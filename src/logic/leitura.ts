import type { State } from './seed';
import { now } from './time';
import { localAtual } from './local';
import { cabecalhosDaIa, motivoDaPorta, type MotivoDaPorta } from './portaDaIa';
import { candidatasDaSemana, escolherDaSemana, semanaLida, type Lembranca, type Area, type Nivel } from './descobertasDaSemana';
import { resumoDaSemana, temMinimoDaSemana, descobertaParaLeitura } from './resumoDaSemana';

/* ============================================================
   A LEITURA DA SEMANA, do lado do aparelho

   Toda segunda, na primeira abertura, o aparelho calcula a descoberta da
   semana (descobertasDaSemana) e o resumo (resumoDaSemana), e pede o texto
   ao servidor (servidor/api/leitura). A leitura volta e fica guardada no
   aparelho a semana inteira. Ver docs/superpowers/specs/2026-10-01-leitura-
   da-semana-design.md.

   ⚠️ SÓ COM O ACEITE PRÓPRIO, pedido pelo card. A leitura manda dado de
   saúde para fora sem a pessoa ter perguntado nada: é outra finalidade
   que a conversa, e outro consentimento.

   ⚠️ A LEITURA FICA SÓ NO APARELHO (`S.leituras`, 'aparelho' em
   logic/traducao), como a conversa: é texto da IA sobre dado de saúde.
   ============================================================ */

/** Sobe quando o texto do aceite muda de sentido. */
export const VERSAO_DO_ACEITE_DA_LEITURA = 1;
/** As leituras guardadas: as últimas 8 semanas, que também são a memória
    das descobertas (uma não volta por 3 semanas). */
export const LEITURAS_GUARDADAS = 8;

export type TextoDaLeitura = { semana: string; descoberta: string; teste: string };
export type Leitura = {
  /** o `de` da semana lida: a segunda-feira, 00h */
  semana: number;
  criada: number;
  texto: TextoDaLeitura;
  descoberta: { chave: string; area: Area; nivel: Nivel; tipo: string };
};

const urlDaLeitura = () => {
  const analise = process.env.EXPO_PUBLIC_ANALISE_URL;
  return process.env.EXPO_PUBLIC_LEITURA_URL
    ?? (analise ? analise.replace(/\/analisar\/?$/, '/leitura') : undefined);
};
export const leituraLigada = () => !!urlDaLeitura();

export const aceitouALeitura = (S: any) => (S?.profile?.aceiteDaLeitura?.versao ?? 0) >= VERSAO_DO_ACEITE_DA_LEITURA;
/* ⚠️ O "AGORA NÃO" VALE 4 SEMANAS, e não para sempre. Não há (ainda) uma
   tela de preferências para religar; perguntar de novo depois de um mês é
   o caminho de volta, e quatro semanas não é insistir. O mesmo vale para o
   "desligar" da própria leitura. */
export const SEMANAS_ATE_PERGUNTAR_DE_NOVO = 4;
export const recusouALeitura = (S: any, agora: number = +now()) => {
  const a = S?.profile?.aceiteDaLeitura;
  return !!a?.recusou && !aceitouALeitura(S) && agora - (a.em ?? 0) < SEMANAS_ATE_PERGUNTAR_DE_NOVO * 7 * 864e5;
};
export const registrarAceiteDaLeitura = (s: any) => { s.profile.aceiteDaLeitura = { em: +now(), versao: VERSAO_DO_ACEITE_DA_LEITURA }; };
export const registrarRecusaDaLeitura = (s: any) => { s.profile.aceiteDaLeitura = { em: +now(), recusou: true }; };

export const leiturasGuardadas = (S: any): Leitura[] => ((S?.leituras ?? []) as Leitura[]).slice().sort((a, b) => a.semana - b.semana);
export const leituraDaSemana = (S: any, semana: number) => leiturasGuardadas(S).find((l) => l.semana === semana) ?? null;

export function guardarLeitura(s: any, l: Leitura) {
  const outras = leiturasGuardadas(s).filter((x) => x.semana !== l.semana);
  s.leituras = [...outras, l].sort((a, b) => a.semana - b.semana).slice(-LEITURAS_GUARDADAS);
}

const lembrancas = (S: any): Lembranca[] => leiturasGuardadas(S).map((l) => ({ semana: l.semana, chave: l.descoberta.chave, area: l.descoberta.area }));

/** O que o card mostra nesta semana. */
export type EstadoDaLeitura =
  | { tipo: 'oculto' }
  | { tipo: 'pedirAceite' }
  | { tipo: 'poucoRegistro' }
  | { tipo: 'gerar'; semana: number }
  | { tipo: 'pronta'; leitura: Leitura };

export function estadoDaLeitura(S: State, agora: Date = now()): EstadoDaLeitura {
  if (!leituraLigada() || recusouALeitura(S, +agora)) return { tipo: 'oculto' };
  if (!aceitouALeitura(S)) return { tipo: 'pedirAceite' };
  const { de } = semanaLida(agora);
  const guardada = leituraDaSemana(S, de);
  if (guardada) return { tipo: 'pronta', leitura: guardada };
  if (!temMinimoDaSemana(S, agora)) return { tipo: 'poucoRegistro' };
  return { tipo: 'gerar', semana: de };
}

export type MotivoDaLeitura = 'sem-servidor' | 'sem-rede' | 'sem-aceite' | 'pouco-registro' | MotivoDaPorta;

/** Pede a leitura da semana ao servidor. Não grava: quem chama guarda o
    resultado com `guardarLeitura`. */
export async function pedirLeitura(S: State, agora: Date = now()): Promise<{ ok: true; leitura: Leitura } | { ok: false; motivo: MotivoDaLeitura }> {
  const URL_LEITURA = urlDaLeitura();
  if (!URL_LEITURA) return { ok: false, motivo: 'sem-servidor' };
  if (!aceitouALeitura(S)) return { ok: false, motivo: 'sem-aceite' };
  if (!temMinimoDaSemana(S, agora)) return { ok: false, motivo: 'pouco-registro' };
  const { de } = semanaLida(agora);
  const escolhida = escolherDaSemana(candidatasDaSemana(S, agora), lembrancas(S), de);
  if (!escolhida) return { ok: false, motivo: 'pouco-registro' };

  /* Uma leitura é texto curto: 30 segundos é mais que o bastante, e o
     card some em silêncio se passar — tenta de novo na próxima abertura. */
  const corta = new AbortController();
  const relogio = setTimeout(() => corta.abort(), 30_000);
  try {
    const r = await fetch(URL_LEITURA, {
      method: 'POST',
      signal: corta.signal,
      headers: await cabecalhosDaIa(),
      body: JSON.stringify({ resumo: resumoDaSemana(S, agora), descoberta: descobertaParaLeitura(escolhida, S), idioma: localAtual() }),
    });
    const corpo = await r.json().catch(() => null);
    if (corpo?.ok === true && corpo.leitura && typeof corpo.leitura.semana === 'string'
      && typeof corpo.leitura.descoberta === 'string' && typeof corpo.leitura.teste === 'string') {
      if (typeof __DEV__ !== 'undefined' && __DEV__ && corpo.uso) console.log('leitura: uso', corpo.uso);
      return {
        ok: true,
        leitura: {
          semana: de, criada: Date.now(),
          texto: { semana: corpo.leitura.semana, descoberta: corpo.leitura.descoberta, teste: corpo.leitura.teste },
          descoberta: { chave: escolhida.chave, area: escolhida.area, nivel: escolhida.nivel, tipo: escolhida.tipo },
        },
      };
    }
    return { ok: false, motivo: motivoDaPorta(corpo) ?? 'sem-rede' };
  } catch {
    return { ok: false, motivo: 'sem-rede' };
  } finally {
    clearTimeout(relogio);
  }
}

/** A leitura como primeira mensagem de uma conversa: "Conversar sobre isso". */
export const leituraComoMensagem = (l: Leitura, rotulos: { semana: string; descoberta: string; teste: string }) =>
  /* o renderizador da conversa (RichDoc) junta a quebra simples: cada
     título é um parágrafo, senão ele gruda no texto */
  [`<b>${rotulos.semana}</b>`, l.texto.semana, `<b>${rotulos.descoberta}</b>`, l.texto.descoberta, `<b>${rotulos.teste}</b>`, l.texto.teste].join('\n\n');
