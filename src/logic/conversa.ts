import type { State } from './seed';
import { localAtual } from './local';
import { now } from './time';
import { resumoDaJornada } from './resumoDaJornada';
import { cabecalhosDaIa, motivoDaPorta, type MotivoDaPorta } from './portaDaIa';

/* ============================================================
   A CONVERSA DO MORPHI INTELLIGENCE, do lado do aparelho

   A pergunta vai ao servidor (servidor/api/conversa) com o resumo da
   jornada (logic/resumoDaJornada) e as últimas trocas; a resposta volta
   como texto para o RichDoc. Ver a especificação,
   docs/superpowers/specs/2026-09-29-morphi-intelligence-design.md.

   ⚠️ SEM O ACEITE, NADA SAI DO APARELHO. `perguntarAoMorphi` confere o
   aceite de novo, e não confia só na tela: a pergunta que chega pelo
   endereço (/companion?q=…) não pode furar a folha.

   ⚠️ A CONVERSA MORA NO APARELHO (`S.conversa`) e não sobe na sincronia
   (ver logic/traducao). O teto de mensagens guardadas é o que impede o
   estado de crescer sem fim.
   ============================================================ */

const URL_ANALISE = process.env.EXPO_PUBLIC_ANALISE_URL;

/* Mora ao lado da leitura do prato; sem uma URL própria, é a mesma com
   o último trecho trocado — o mesmo desenho do laudo e da estimativa. */
const URL_CONVERSA = process.env.EXPO_PUBLIC_CONVERSA_URL
  ?? (URL_ANALISE ? URL_ANALISE.replace(/\/analisar\/?$/, '/conversa') : undefined);

export const conversaLigada = () => !!URL_CONVERSA;

/* ------------------------------------------------------------------ */
/* O aceite                                                           */
/* ------------------------------------------------------------------ */

/** Sobe quando o texto do aceite muda de sentido: a pessoa aceita de
    novo o que passou a ser dito. */
export const VERSAO_DO_ACEITE_DA_CONVERSA = 1;

export const aceitouAConversa = (S: any) =>
  (S?.profile?.aceiteDaConversa?.versao ?? 0) >= VERSAO_DO_ACEITE_DA_CONVERSA;

export const registrarAceiteDaConversa = (s: any) => {
  s.profile.aceiteDaConversa = { em: +now(), versao: VERSAO_DO_ACEITE_DA_CONVERSA };
};

/* ------------------------------------------------------------------ */
/* A conversa guardada                                                */
/* ------------------------------------------------------------------ */

export type MensagemDaConversa = { who: 'me' | 'ai'; text: string; t: number };

/** Quantas mensagens ficam guardadas. As mais antigas saem primeiro. */
export const TETO_DA_CONVERSA = 60;
/** Quantas mensagens anteriores vão junto com a pergunta (dez trocas). */
export const TROCAS_ENVIADAS = 20;

export const conversaGuardada = (S: any): MensagemDaConversa[] =>
  (Array.isArray(S?.conversa?.msgs) ? S.conversa.msgs : [])
    .filter((m: any) => m && (m.who === 'me' || m.who === 'ai') && typeof m.text === 'string');

export const guardarNaConversa = (s: any, m: MensagemDaConversa) => {
  const msgs = [...conversaGuardada(s), m];
  s.conversa = { msgs: msgs.slice(-TETO_DA_CONVERSA) };
};

export const recomecarConversa = (s: any) => {
  s.conversa = { msgs: [] };
};

/* ------------------------------------------------------------------ */
/* A resposta                                                         */
/* ------------------------------------------------------------------ */

/** As telas que uma resposta pode abrir. É a mesma lista de
    servidor/conversa/prompt (TELAS) — a sonda confere. */
export const TELAS_DA_CONVERSA = [
  '/evolucao', '/sintomas', '/aplicacoes', '/alimentacao', '/agua', '/exames', '/resumo-medico', '/checkin',
];

/* O que vem da rede vale como proposta. O RichDoc entende <b>, "- ",
   "## " e [termo](/rota); o resto sai. Um link para fora da lista vira
   texto comum — um endereço inventado pelo modelo não abre nada, e um
   link externo não abre nunca. O negrito com asteriscos, que o modelo
   às vezes escreve apesar da regra, vira o <b> que a tela conhece. */
export function limparResposta(bruto: string): string {
  return bruto
    .replace(/\r\n/g, '\n')
    .replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>')
    .replace(/<(?!\/?b>)[^>]*>/g, '')
    .replace(/\[([^\]]+)\]\(([^)]*)\)/g, (_, termo: string, rota: string) =>
      TELAS_DA_CONVERSA.includes(rota.trim()) ? `[${termo}](${rota.trim()})` : termo)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export type MotivoDaConversa = 'sem-servidor' | 'sem-rede' | 'sem-aceite' | MotivoDaPorta;

export type RespostaDaConversa =
  | { ok: true; texto: string; uso?: Record<string, number> }
  | { ok: false; motivo: MotivoDaConversa };

/** Pergunta ao Morphi. `anteriores` é a conversa até aqui, SEM a
    pergunta. */
export async function perguntarAoMorphi(
  S: State,
  pergunta: string,
  anteriores: MensagemDaConversa[],
): Promise<RespostaDaConversa> {
  if (!URL_CONVERSA) return { ok: false, motivo: 'sem-servidor' };
  if (!aceitouAConversa(S)) return { ok: false, motivo: 'sem-aceite' };

  /* Quarenta e cinco segundos e desiste: a resposta costuma vir em
     poucos segundos, e esperar mais do que isso é pior que dizer que a
     rede falhou. */
  const corta = new AbortController();
  const relogio = setTimeout(() => corta.abort(), 45_000);
  try {
    const r = await fetch(URL_CONVERSA, {
      method: 'POST',
      signal: corta.signal,
      headers: await cabecalhosDaIa(),
      body: JSON.stringify({
        pergunta: pergunta.trim().slice(0, 1000),
        historico: anteriores.slice(-TROCAS_ENVIADAS).map((m) => ({
          quem: m.who === 'me' ? 'eu' : 'morphi',
          texto: m.text.slice(0, 4000),
        })),
        resumo: resumoDaJornada(S),
        idioma: localAtual(),
      }),
    });
    const corpo = await r.json().catch(() => null);
    if (!corpo || corpo.ok !== true || typeof corpo.resposta !== 'string') {
      return { ok: false, motivo: motivoDaPorta(corpo) ?? 'sem-rede' };
    }
    const texto = limparResposta(corpo.resposta);
    if (!texto) return { ok: false, motivo: 'sem-rede' };
    if (__DEV__ && corpo.uso) console.log('[conversa] uso', JSON.stringify(corpo.uso));
    return { ok: true, texto, uso: corpo.uso };
  } catch {
    return { ok: false, motivo: 'sem-rede' };
  } finally {
    clearTimeout(relogio);
  }
}
