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

/* Mora ao lado da leitura do prato; sem uma URL própria, é a mesma com
   o último trecho trocado — o mesmo desenho do laudo e da estimativa.

   ⚠️ LIDA NA HORA, e não quando o arquivo carrega: o Expo troca
   process.env.EXPO_PUBLIC_* pelo valor em qualquer lugar do código, e lida
   na hora a sonda consegue provar a conversa com uma URL de mentira. */
const urlDaConversa = () => {
  const analise = process.env.EXPO_PUBLIC_ANALISE_URL;
  return process.env.EXPO_PUBLIC_CONVERSA_URL
    ?? (analise ? analise.replace(/\/analisar\/?$/, '/conversa') : undefined);
};

export const conversaLigada = () => !!urlDaConversa();

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
/* As conversas guardadas                                             */
/* ------------------------------------------------------------------ */

/* ⚠️ CONVERSAS SEPARADAS, E NÃO UM FIO INFINITO (30/09/2026). A memória
   da Morphi Intelligence é o resumo da jornada, que vai em toda pergunta;
   a conversa é só o assunto. Num fio só, a pergunta sobre enjoo levava
   junto as trocas sobre um exame de semanas atrás — contexto misturado e
   pergunta mais cara —, e achar uma resposta antiga era rolar sem fim.

   Cada conversa tem o título da primeira pergunta. O "+" guarda a atual
   e começa outra; o histórico reabre qualquer uma. Tudo no aparelho, com
   teto de conversas e de mensagens por conversa. */

export type MensagemDaConversa = { who: 'me' | 'ai'; text: string; t: number };
export type Conversa = { id: string; titulo: string; criada: number; atualizada: number; msgs: MensagemDaConversa[] };

/** Quantas mensagens cada conversa guarda. As mais antigas saem primeiro. */
export const TETO_DA_CONVERSA = 60;
/** Quantas conversas ficam guardadas. Sai a que foi mexida há mais tempo. */
export const TETO_DE_CONVERSAS = 30;
/** Quantas mensagens anteriores vão junto com a pergunta (dez trocas). */
export const TROCAS_ENVIADAS = 20;
/** Depois disto sem mexer, a próxima visita abre uma conversa nova, e a
    anterior fica no histórico. */
export const CONVERSA_PARADA_MS = 6 * 60 * 60 * 1000;

const valida = (m: any): m is MensagemDaConversa =>
  m && (m.who === 'me' || m.who === 'ai') && typeof m.text === 'string';

const tituloDe = (msgs: MensagemDaConversa[]) => {
  const p = msgs.find((m) => m.who === 'me')?.text.trim() ?? '';
  return p.length > 80 ? `${p.slice(0, 79).trimEnd()}…` : p;
};

const novoId = () => `c${Date.now().toString(36)}${Math.floor(Math.random() * 1e8).toString(36)}`;

/* O estado das conversas, lido com cuidado. O desenho anterior guardava
   `{ msgs }`, uma conversa só: ela vira a primeira da lista, aberta. */
type Guardadas = { atual: string | null; lista: Conversa[] };
function lerConversas(S: any): Guardadas {
  const c = S?.conversa;
  if (c && Array.isArray(c.msgs)) {
    const msgs = c.msgs.filter(valida);
    if (!msgs.length) return { atual: null, lista: [] };
    const t = msgs[msgs.length - 1].t || Date.now();
    const id = 'c-antiga';
    return { atual: id, lista: [{ id, titulo: tituloDe(msgs), criada: msgs[0].t || t, atualizada: t, msgs }] };
  }
  const lista: Conversa[] = (Array.isArray(c?.lista) ? c.lista : [])
    .filter((x: any) => x && typeof x.id === 'string' && Array.isArray(x.msgs))
    .map((x: any) => ({ ...x, msgs: x.msgs.filter(valida) }));
  const atual = typeof c?.atual === 'string' && lista.some((x) => x.id === c.atual) ? c.atual : null;
  return { atual, lista };
}

/** Todas as conversas, da mexida mais recente para a mais antiga. */
export const conversas = (S: any): Conversa[] =>
  [...lerConversas(S).lista].sort((x, y) => y.atualizada - x.atualizada);

/** A conversa aberta, se houver. */
export const conversaAtual = (S: any): Conversa | null => {
  const g = lerConversas(S);
  return g.lista.find((x) => x.id === g.atual) ?? null;
};

/** As mensagens da conversa aberta. */
export const conversaGuardada = (S: any): MensagemDaConversa[] => conversaAtual(S)?.msgs ?? [];

/** Acrescenta à conversa aberta; sem conversa aberta, abre uma nova com
    esta mensagem. */
export function guardarNaConversa(s: any, m: MensagemDaConversa) {
  const g = lerConversas(s);
  let c = g.lista.find((x) => x.id === g.atual);
  if (!c) {
    c = { id: novoId(), titulo: '', criada: m.t, atualizada: m.t, msgs: [] };
    g.lista.push(c);
    g.atual = c.id;
  }
  c.msgs = [...c.msgs, m].slice(-TETO_DA_CONVERSA);
  c.atualizada = m.t;
  if (!c.titulo) c.titulo = tituloDe(c.msgs);
  const lista = [...g.lista].sort((x, y) => y.atualizada - x.atualizada).slice(0, TETO_DE_CONVERSAS);
  s.conversa = { atual: lista.some((x) => x.id === g.atual) ? g.atual : null, lista };
}

/** O "+": a conversa aberta vai para o histórico, e a próxima pergunta
    começa outra. */
export function recomecarConversa(s: any) {
  const g = lerConversas(s);
  s.conversa = { atual: null, lista: g.lista };
}

/** Reabre uma conversa do histórico. */
export function abrirConversa(s: any, id: string) {
  const g = lerConversas(s);
  s.conversa = { atual: g.lista.some((x) => x.id === id) ? id : g.atual, lista: g.lista };
}

/** Apaga uma conversa do aparelho. */
export function apagarConversa(s: any, id: string) {
  const g = lerConversas(s);
  s.conversa = { atual: g.atual === id ? null : g.atual, lista: g.lista.filter((x) => x.id !== id) };
}

/** A conversa aberta ficou parada tempo demais: a visita de agora começa
    outra (ver CONVERSA_PARADA_MS). */
export const conversaParada = (S: any, agora: number) => {
  const c = conversaAtual(S);
  return !!c && agora - c.atualizada > CONVERSA_PARADA_MS;
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

/** As telas que a resposta sugere, na ordem em que aparecem e sem
    repetir — viram botões embaixo da mensagem (30/09/2026). Até duas: uma
    resposta que manda para quatro lugares não está sugerindo nenhum. */
export function destinosDe(texto: string): string[] {
  const fora: string[] = [];
  for (const m of texto.matchAll(/\[[^\]]+\]\(([^)]*)\)/g)) {
    const r = m[1].trim();
    if (TELAS_DA_CONVERSA.includes(r) && !fora.includes(r)) fora.push(r);
  }
  return fora.slice(0, 2);
}

/** O texto sem a marcação de link. O destino vai para o botão
    (`destinosDe`), e o termo:
    - some, quando o link é um convite sozinho — no começo de uma linha ou
      depois do fim de uma frase, e até o fim da linha ("… no dia 28. [Ver
      seus sintomas](/sintomas)"): ele seria o botão escrito duas vezes;
    - fica como texto comum, quando faz parte da frase ("veja [os seus
      sintomas](/sintomas) desta semana"). */
export const semLinks = (texto: string) =>
  texto
    .replace(/(^|\n|[.!?:]\s+)\[[^\]]+\]\([^)]*\)[.!]?[ \t]*(?=\n|$)/g, (_, antes: string) => antes.trimEnd())
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[ \t]+\n/g, '\n')
    .trim();

/* O trecho que ainda está chegando pode terminar no meio de uma marcação
   — "<b", "[Ver seus" —, e ela apareceria crua por um instante. O que
   está aberto no fim sai até o resto chegar. */
export function parcialLimpo(bruto: string): string {
  let t = bruto;
  const colchete = t.lastIndexOf('[');
  if (colchete >= 0 && !/\]\([^)]*\)/.test(t.slice(colchete))) {
    const fecha = t.indexOf(']', colchete);
    t = fecha < 0 ? t.slice(0, colchete) : t.slice(0, colchete) + t.slice(colchete + 1, fecha);
  }
  const menor = t.lastIndexOf('<');
  if (menor >= 0 && t.indexOf('>', menor) < 0) t = t.slice(0, menor);
  return semLinks(limparResposta(t));
}

export type MotivoDaConversa = 'sem-servidor' | 'sem-rede' | 'sem-aceite' | MotivoDaPorta;

export type RespostaDaConversa =
  | { ok: true; texto: string; uso?: Record<string, number> }
  | { ok: false; motivo: MotivoDaConversa };

/** Pergunta ao Morphi. `anteriores` é a conversa até aqui, SEM a
    pergunta. `aoEscrever` recebe o texto parcial a cada trecho que chega
    (ver servidor/api/conversa: a resposta vem em pedaços). */
export async function perguntarAoMorphi(
  S: State,
  pergunta: string,
  anteriores: MensagemDaConversa[],
  aoEscrever?: (parcial: string) => void,
): Promise<RespostaDaConversa> {
  const URL_CONVERSA = urlDaConversa();
  if (!URL_CONVERSA) return { ok: false, motivo: 'sem-servidor' };
  if (!aceitouAConversa(S)) return { ok: false, motivo: 'sem-aceite' };

  /* Quarenta e cinco segundos e desiste: a resposta costuma vir em
     poucos segundos, e esperar mais do que isso é pior que dizer que a
     rede falhou. */
  const corta = new AbortController();
  const relogio = setTimeout(() => corta.abort(), 60_000);
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
    /* Recusa antes do modelo (sessão, limite, pedido): JSON comum. */
    if (!(r.headers.get('content-type') ?? '').includes('ndjson')) {
      const corpo = await r.json().catch(() => null);
      if (corpo?.ok === true && typeof corpo.resposta === 'string') {
        const texto = limparResposta(corpo.resposta);
        return texto ? { ok: true, texto, uso: corpo.uso } : { ok: false, motivo: 'sem-rede' };
      }
      return { ok: false, motivo: motivoDaPorta(corpo) ?? 'sem-rede' };
    }

    /* Os pedaços: uma linha de JSON por evento. No iOS e no Android o
       fetch global é o do Expo, que lê o corpo aos poucos; sem corpo
       legível aos poucos, lê tudo de uma vez e o texto só não cresce. */
    let bruto = '';
    let uso: Record<string, number> | undefined;
    let falhou = false;
    const evento = (l: string) => {
      if (!l.trim()) return;
      let e: any;
      try { e = JSON.parse(l); } catch { return; }
      if (e?.t === 'texto' && typeof e.v === 'string') {
        bruto += e.v;
        aoEscrever?.(parcialLimpo(bruto));
      } else if (e?.t === 'fim') uso = e.uso;
      else if (e?.t === 'erro') falhou = true;
    };
    const leitor = (r.body as any)?.getReader?.();
    if (leitor) {
      const dec = new TextDecoder();
      let resto = '';
      for (;;) {
        const { value, done } = await leitor.read();
        if (done) break;
        resto += dec.decode(value, { stream: true });
        const linhas = resto.split('\n');
        resto = linhas.pop() ?? '';
        linhas.forEach(evento);
      }
      evento(resto);
    } else {
      (await r.text()).split('\n').forEach(evento);
    }
    const texto = limparResposta(bruto);
    if (falhou || !texto) return { ok: false, motivo: 'sem-rede' };
    if (typeof __DEV__ !== 'undefined' && __DEV__ && uso) console.log('[conversa] uso', JSON.stringify(uso));
    return { ok: true, texto, uso };
  } catch {
    return { ok: false, motivo: 'sem-rede' };
  } finally {
    clearTimeout(relogio);
  }
}
