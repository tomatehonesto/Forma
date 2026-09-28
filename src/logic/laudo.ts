import { Platform } from 'react-native';
import { File } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { now, startOfDay } from './time';
import { REFERENCIA_DOS_MARCADORES } from './derive';
import { unidadesDe, converterValor, converterFaixa } from './unidadesDeExame';

/* ============================================================
   A LEITURA DO LAUDO

   O aplicativo não fala com o modelo: fala com a função
   servidor/api/laudo, que tem a chave. Sem a URL configurada, a leitura
   devolve 'sem-servidor' e a folha de anotar continua sendo o caminho —
   ligar a leitura é variável de ambiente, e não outro build.

   ⚠️ UM LAUDO É DADO DE SAÚDE SENSÍVEL, E ELE SAI DO APARELHO. Por isso a
   leitura tem um aceite próprio (art. 11, I, da LGPD), pedido antes da
   primeira, que diz para onde o arquivo vai e que ele não é guardado. O
   aceite fica no perfil com a versão; se o texto mudar, a versão sobe e
   ele é pedido de novo.

   ⚠️ NADA É GRAVADO SEM CONFERÊNCIA. O que volta é proposta: a tela de
   revisão mostra cada resultado, editável e removível, e só grava o que
   a pessoa confirmou contra o papel.
   ============================================================ */

const URL_ANALISE = process.env.EXPO_PUBLIC_ANALISE_URL;
const TOKEN = process.env.EXPO_PUBLIC_ANALISE_TOKEN;
/* A mesma função mora ao lado da leitura do prato; sem uma URL própria,
   ela sai da outra. */
const URL_LAUDO = process.env.EXPO_PUBLIC_LAUDO_URL
  ?? (URL_ANALISE ? URL_ANALISE.replace(/\/analisar\/?$/, '/laudo') : undefined);

/** A versão do texto do aceite (textos/<idioma>/exames, `laudo.aceite`). */
export const VERSAO_DO_ACEITE_DO_LAUDO = 1;

export const aceitouLeituraDoLaudo = (S: any) =>
  (S?.profile?.aceiteDoLaudo?.versao ?? 0) >= VERSAO_DO_ACEITE_DO_LAUDO;

export const registrarAceiteDoLaudo = (s: any) => {
  s.profile.aceiteDoLaudo = { em: +now(), versao: VERSAO_DO_ACEITE_DO_LAUDO };
};

export const leituraDoLaudoLigada = () => !!URL_LAUDO;

/* ------------------------------------------------------------------ */
/* O ARQUIVO

   PDF vai como está, até uns 3 MB — é o que cabe no teto de 4,5 MB do
   corpo depois do base64. Foto vai reduzida a 1600 px: laudo é texto
   miúdo, e precisa de mais resolução que um prato, mas não da foto crua
   de 12 megapixels. */
const MAX_PDF = 3_000_000;
const LADO_DA_FOTO = 1600;

export type Arquivo = { uri: string; tipo: 'pdf' | 'foto'; tamanho?: number; base64Web?: string };

async function base64De(a: Arquivo): Promise<string | 'grande' | null> {
  try {
    if (a.tipo === 'pdf') {
      if (a.tamanho && a.tamanho > MAX_PDF) return 'grande';
      if (a.base64Web) return a.base64Web.replace(/^data:[^;]+;base64,/, '');
      if (Platform.OS === 'web') return null;
      const f = new File(a.uri);
      if (f.size > MAX_PDF) return 'grande';
      return await f.base64();
    }
    const ctx = ImageManipulator.manipulate(a.uri);
    ctx.resize({ width: LADO_DA_FOTO });
    const render = await ctx.renderAsync();
    const saida = await render.saveAsync({ format: SaveFormat.JPEG, compress: 0.75, base64: true });
    return saida.base64 ?? null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* O QUE VOLTA */

export type ResultadoLido = {
  marcador: string;
  valor: number;
  /** nula quando o laudo usa uma unidade que o marcador não conhece: a
      pessoa escolhe na revisão */
  unidade: string | null;
  /** a faixa como o laboratório a imprimiu, ou nula */
  referencia: string | null;
};

export type LaudoLido = {
  /** o dia da coleta, ou nulo quando o laudo não diz */
  coleta: number | null;
  resultados: ResultadoLido[];
  /** o que foi visto e não é um dos marcadores acompanhados */
  naoReconhecidos: string[];
};

export type MotivoDoLaudo = 'sem-servidor' | 'sem-rede' | 'nao-reconheci' | 'grande';
export type Leitura = { ok: true; laudo: LaudoLido } | { ok: false; motivo: MotivoDoLaudo };

/* A faixa só com o que uma faixa tem: números, o traço e os sinais. */
const FAIXA = /^[<>≤≥]?\s*\d+(?:[.,]\d+)?(?:\s*[–-]\s*\d+(?:[.,]\d+)?)?$/;

/** O que veio da rede, conferido de novo. Pura — a sonda a exercita. */
export function limparLaudo(corpo: any): LaudoLido | null {
  if (!corpo || corpo.ok !== true || !Array.isArray(corpo.resultados)) return null;
  const vistos = new Set<string>();
  const resultados: ResultadoLido[] = [];
  const naoReconhecidos: string[] = [];
  for (const x of corpo.resultados) {
    if (!x || typeof x !== 'object') continue;
    const m = typeof x.marcador === 'string' && REFERENCIA_DOS_MARCADORES[x.marcador] ? x.marcador : null;
    if (!m) {
      const nome = typeof x.nome_no_laudo === 'string' ? x.nome_no_laudo.trim() : '';
      if (nome && !naoReconhecidos.includes(nome)) naoReconhecidos.push(nome);
      continue;
    }
    if (vistos.has(m)) continue;
    if (typeof x.valor !== 'number' || !Number.isFinite(x.valor) || x.valor < 0) continue;
    vistos.add(m);
    const u = typeof x.unidade === 'string' && unidadesDe(m).some((o) => o.id === x.unidade) ? x.unidade : null;
    const ref = typeof x.referencia === 'string' && FAIXA.test(x.referencia.trim())
      ? x.referencia.trim().replace(/\s*-\s*/, '–') : null;
    resultados.push({ marcador: m, valor: x.valor, unidade: u, referencia: ref });
  }
  let coleta: number | null = null;
  if (typeof corpo.coleta === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(corpo.coleta)) {
    const [a, mm, d] = corpo.coleta.split('-').map(Number);
    const t = +new Date(a, mm - 1, d, 12);
    /* coleta no futuro, ou de antes de o laboratório existir, é leitura
       errada — melhor sem data do que com uma inventada */
    if (t <= +now() + 86400000 && a >= 1990) coleta = t;
  }
  if (!resultados.length && !naoReconhecidos.length) return null;
  return { coleta, resultados, naoReconhecidos };
}

export async function lerLaudo(a: Arquivo): Promise<Leitura> {
  if (!URL_LAUDO) return { ok: false, motivo: 'sem-servidor' };
  const arquivo = await base64De(a);
  if (arquivo === 'grande') return { ok: false, motivo: 'grande' };
  if (!arquivo) return { ok: false, motivo: 'nao-reconheci' };

  /* Um laudo pede mais leitura que um prato: 55 segundos, logo abaixo do
     teto da função. */
  const corta = new AbortController();
  const relogio = setTimeout(() => corta.abort(), 55000);
  try {
    const r = await fetch(URL_LAUDO, {
      method: 'POST',
      signal: corta.signal,
      headers: { 'content-type': 'application/json', ...(TOKEN ? { 'x-morphi-token': TOKEN } : {}) },
      body: JSON.stringify({ arquivo, tipo: a.tipo === 'pdf' ? 'application/pdf' : 'image/jpeg' }),
    });
    const corpo = await r.json().catch(() => null);
    if (!corpo || corpo.ok !== true) {
      const m = corpo?.motivo;
      return { ok: false, motivo: m === 'sem-rede' || m === 'grande' ? m : 'nao-reconheci' };
    }
    const laudo = limparLaudo(corpo);
    if (!laudo || !laudo.resultados.length) return { ok: false, motivo: 'nao-reconheci' };
    return { ok: true, laudo };
  } catch {
    return { ok: false, motivo: 'sem-rede' };
  } finally {
    clearTimeout(relogio);
  }
}

/* ------------------------------------------------------------------ */
/* GRAVAR O QUE FOI CONFERIDO

   Cada resultado entra no exame do seu marcador. O registro que já
   existe manda na unidade: o valor do laudo é convertido para ela, para a
   linha do tempo não misturar escalas. O registro novo nasce na unidade do
   laudo, com a faixa do laudo — e, sem ela, a usual convertida.

   A mesma coleta lida duas vezes não entra duas vezes: mesmo marcador,
   mesmo dia e mesmo valor é o mesmo resultado. */
export type Conferido = { marcador: string; valor: number; unidade: string; referencia: string | null };

export function gravarLaudo(s: any, itens: Conferido[], coleta: number | null): number {
  const t = coleta ?? +now();
  const dia = +startOfDay(new Date(t));
  let gravados = 0;
  for (const it of itens) {
    const padrao = REFERENCIA_DOS_MARCADORES[it.marcador];
    let e = s.exams.find((x: any) => x.marker === it.marcador);
    if (!e) {
      e = {
        marker: it.marcador,
        unit: it.unidade,
        ref: it.referencia ?? (padrao ? converterFaixaUsual(it.marcador, it.unidade) : ''),
        good: padrao?.good ?? '',
        values: [],
      };
      s.exams.push(e);
    }
    const unidadeDoRegistro = e.unit || padrao?.unit || it.unidade;
    if (!e.unit) e.unit = unidadeDoRegistro;
    const v = Number(converterValor(it.marcador, it.valor, it.unidade, unidadeDoRegistro).toFixed(3));
    const repetido = e.values.some((x: any) => +startOfDay(new Date(x.t)) === dia && Math.abs(x.v - v) < 1e-6);
    if (repetido) continue;
    e.values.push({ t, v });
    e.values.sort((a: any, b: any) => a.t - b.t);
    gravados += 1;
  }
  return gravados;
}

/* A faixa usual do marcador, na unidade dada — para o registro novo que o
   laudo trouxe sem faixa. */
function converterFaixaUsual(marcador: string, unidade: string): string {
  const p = REFERENCIA_DOS_MARCADORES[marcador];
  return p ? converterFaixa(marcador, p.ref, p.unit, unidade) : '';
}
