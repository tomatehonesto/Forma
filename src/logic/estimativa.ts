import type { State } from './seed';
import type { Alimento } from './alimentos';
import { localAtual } from './local';
import { alimentoDoItem, type ItemComida, type Rotulo } from './prato';
import { PRATELEIRAS } from './prateleiras';

/* ============================================================
   O PRATO QUE A LISTA NÃO TEM, ESTIMADO PELO NOME

   A lista de alimentos cobre o que se come todo dia; o resto — a
   carbonara, a galinhada, o curry do restaurante — ficava anotado e sem
   conta. Aqui o aplicativo pergunta ao servidor (servidor/api/estimar),
   que devolve o rótulo de UMA porção comum. O item entra com esse
   rótulo gravado e marcado como estimado, e a tela diz isso ao lado dele.

   ⚠️ O DIÁRIO É A MEMÓRIA DAS ESTIMATIVAS. Não há lista à parte: o que a
   pessoa já estimou está nos registros dela, com o rótulo junto, e
   `seusPratos` o encontra ali. Da segunda vez que ela digitar
   "carbonara", o prato sai do diário — sem rede, sem custo e com o
   mesmo número da primeira vez. E como mora no registro, ele sobe e
   desce com a sincronia sem nenhuma peça nova.
   ============================================================ */

const URL_ANALISE = process.env.EXPO_PUBLIC_ANALISE_URL;
const TOKEN = process.env.EXPO_PUBLIC_ANALISE_TOKEN;

/* Mora ao lado da leitura do prato; sem uma URL própria, é a mesma com
   o último trecho trocado — o mesmo desenho da leitura do laudo. */
const URL_ESTIMAR = process.env.EXPO_PUBLIC_ESTIMAR_URL
  ?? (URL_ANALISE ? URL_ANALISE.replace(/\/analisar\/?$/, '/estimar') : undefined);

export const estimativaLigada = () => !!URL_ESTIMAR;

export type MotivoDaEstimativa = 'sem-servidor' | 'sem-rede' | 'nao-reconheci';

export type Estimativa =
  | { ok: true; item: ItemComida }
  | { ok: false; motivo: MotivoDaEstimativa };

const num = (v: unknown, teto: number): number | null =>
  typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= teto ? v : null;
const txt = (v: unknown, teto: number): string | null =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, teto) : null;

/* O que vem da rede vale como proposta, não como verdade — o mesmo
   cuidado da leitura do prato. Um rótulo com um campo faltando não
   entra: meio rótulo faria a energia do dia somar metade de um prato. */
export function limparRotulo(bruto: unknown): Rotulo | null {
  if (!bruto || typeof bruto !== 'object') return null;
  const r = bruto as Record<string, unknown>;
  const nome = txt(r.nome, 80);
  const un = txt(r.un, 30);
  const unp = txt(r.unp, 30);
  const gUn = num(r.gUn, 2000);
  const p = num(r.p, 100);
  const kcal = num(r.kcal, 900);
  const carb = num(r.carb, 100);
  const gord = num(r.gord, 100);
  const fibra = num(r.fibra, 100);
  const onde = (PRATELEIRAS as readonly string[]).includes(r.onde as string) ? (r.onde as string) : null;
  if (!nome || !un || !unp || !gUn || gUn < 5 || p == null || kcal == null
    || carb == null || gord == null || fibra == null || !onde) return null;
  return { nome, un, unp, gUn, p, kcal, carb, gord, fibra, onde };
}

/** O item de prato que nasce de um rótulo estimado. */
export const itemEstimado = (rotulo: Rotulo, qtd = 1): ItemComida =>
  ({ nome: rotulo.nome, qtd, rotulo, estimado: 'nome' });

/** Pergunta ao servidor o rótulo de uma porção do que foi digitado. */
export async function estimarPeloNome(nome: string): Promise<Estimativa> {
  const escrito = nome.trim();
  if (escrito.length < 2) return { ok: false, motivo: 'nao-reconheci' };
  if (!URL_ESTIMAR) return { ok: false, motivo: 'sem-servidor' };

  /* Quinze segundos e desiste: a resposta costuma vir em dois ou três, e
     anotar sem conta está logo abaixo, esperando. */
  const corta = new AbortController();
  const relogio = setTimeout(() => corta.abort(), 15000);
  try {
    const r = await fetch(URL_ESTIMAR, {
      method: 'POST',
      signal: corta.signal,
      headers: {
        'content-type': 'application/json',
        ...(TOKEN ? { 'x-morphi-token': TOKEN } : {}),
      },
      body: JSON.stringify({ nome: escrito, idioma: localAtual() }),
    });
    const corpo = await r.json().catch(() => null);
    if (!corpo || corpo.ok !== true) {
      return { ok: false, motivo: corpo?.motivo === 'sem-rede' ? 'sem-rede' : 'nao-reconheci' };
    }
    const rotulo = limparRotulo(corpo.rotulo);
    return rotulo ? { ok: true, item: itemEstimado(rotulo) } : { ok: false, motivo: 'nao-reconheci' };
  } catch {
    return { ok: false, motivo: 'sem-rede' };
  } finally {
    clearTimeout(relogio);
  }
}

const semAcento = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** Os pratos que a pessoa já estimou, do mais recente para o mais
    antigo, um de cada nome. Ver o alto do arquivo. */
export function seusPratos(S: State): Rotulo[] {
  const vistos = new Set<string>();
  const lista: Rotulo[] = [];
  for (const m of ((S as any).meals || []) as any[]) {
    for (const it of (m?.itens || []) as ItemComida[]) {
      if (it?.estimado !== 'nome' || !it.rotulo) continue;
      const chave = semAcento(it.rotulo.nome);
      if (vistos.has(chave)) continue;
      vistos.add(chave);
      lista.push(it.rotulo);
    }
  }
  return lista;
}

/** Os pratos seus que batem com o que está sendo digitado — toda palavra
    digitada começando uma palavra do nome, como na busca da lista. */
export function buscarNosSeus(S: State, termo: string, limite = 3): Rotulo[] {
  const pedidos = semAcento(termo).split(/\s+/).filter((x) => x.length >= 2);
  if (!pedidos.length) return [];
  return seusPratos(S)
    .filter((r) => {
      const ws = semAcento(r.nome).split(/[\s,]+/);
      return pedidos.every((q) => ws.some((w) => w.startsWith(q)));
    })
    .slice(0, limite);
}

/** Um rótulo lido como alimento, para as peças que desenham alimento. */
export const comoAlimento = (r: Rotulo): Alimento =>
  alimentoDoItem(itemEstimado(r)) as Alimento;
