import { readFileSync, existsSync, mkdirSync, appendFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { COMIDAS } from '../../src/logic/comidas';
import { parametrosDaFoto } from '../../servidor/api/analisar';
import { parametrosDoLaudo } from '../../servidor/api/laudo';
import { parametrosDaEstimativa } from '../../servidor/api/estimar';

/* ============================================================
   A AVALIAÇÃO DOS TRÊS RECURSOS DE IA FORA DA CONVERSA

     npx tsx --tsconfig scripts/tsconfig.json scripts/avaliacao/recursos.ts \
       [--recurso foto|laudo|estimar|todos] \
       [--modelos claude-opus-5,claude-opus-5-5,claude-sonnet-5-5,claude-haiku-4-5] \
       [--limite N] [--seco]

   Compara modelos na foto do prato, na leitura do laudo e na estimativa
   pelo nome, com o MESMO pedido que o servidor monta (parametrosDaFoto,
   parametrosDoLaudo, parametrosDaEstimativa) — só o modelo muda. A nota é
   conta contra um gabarito, sem juiz:

     · foto: as 30 fotos do Nutrition5k (Google, CC BY 4.0), com o peso e
       os nutrientes medidos de cada prato. Erro percentual de calorias e
       de proteína do prato inteiro, pela tabela do aplicativo.
     · laudo: 10 laudos FICTÍCIOS (PDF e foto), gerados com o gabarito.
       Quantos resultados vieram certos (marcador, valor e unidade), a
       data da coleta, e o que veio a mais (inventado).
     · estimar: 20 pratos do catálogo do aplicativo, digitados como uma
       pessoa digitaria, e 3 textos que não são comida. Erro de calorias e
       proteína por 100 g, e se reconheceu o que não é comida.

   Os dados ficam em .claude/avaliacao-dados (fora do git) e os
   resultados em .claude/hillclimb/recursos/. Retoma de onde parou.

   ⚠️ GASTA CRÉDITO DE VERDADE. `--seco` confere os dados e diz quantas
   chamadas faria, sem chamar.
   ============================================================ */

if (existsSync('.env')) process.loadEnvFile('.env');
const doServidor = createRequire(resolve('servidor/package.json'));
const Anthropic = doServidor('@anthropic-ai/sdk').default;

const DADOS = '.claude/avaliacao-dados';
const SAIDA = '.claude/hillclimb/recursos';

/* US$ por milhão de tokens (entrada, saída). Cache: gravar 1,25x e ler
   0,1x a entrada. Haiku 4.5 a conferir na página de preços. */
const PRECOS: Record<string, [number, number]> = {
  'claude-opus-5': [5, 25], 'claude-opus-5-5': [4, 20], 'claude-sonnet-5-5': [2, 10], 'claude-haiku-4-5': [1, 5],
};
const custo = (m: string, u: any) => {
  const [e, s] = PRECOS[m] ?? [0, 0];
  return ((u.input_tokens ?? 0) * e + (u.cache_creation_input_tokens ?? 0) * e * 1.25
    + (u.cache_read_input_tokens ?? 0) * e * 0.1 + (u.output_tokens ?? 0) * s) / 1e6;
};

function args() {
  const a = { recurso: 'todos', modelos: Object.keys(PRECOS), limite: Infinity, seco: false };
  const v = process.argv.slice(2);
  for (let i = 0; i < v.length; i++) {
    if (v[i] === '--recurso') a.recurso = v[++i];
    else if (v[i] === '--modelos') a.modelos = v[++i].split(',').map((s) => s.trim());
    else if (v[i] === '--limite') a.limite = +v[++i];
    else if (v[i] === '--seco') a.seco = true;
  }
  return a;
}

/* O Haiku 4.5 não aceita `effort`: sai do pedido, e o resto fica igual. */
const ajustar = (p: any, modelo: string) =>
  modelo.startsWith('claude-haiku') ? { ...p, output_config: { format: p.output_config.format } } : p;

const ape = (estimado: number, real: number) => (real ? Math.abs(estimado - real) / real : NaN);
const porId = new Map((COMIDAS as any[]).map((c) => [c.id, c]));

/* ---------------- os casos ---------------- */
type Caso = { recurso: string; id: string; pedido: (modelo: string) => any; nota: (saida: any) => Record<string, number> };

function casosDaFoto(): Caso[] {
  const g = JSON.parse(readFileSync(`${DADOS}/nutrition5k/gabarito.json`, 'utf8'));
  return g.map((p: any) => ({
    recurso: 'foto', id: p.id,
    pedido: (m: string) => parametrosDaFoto({ imagem: readFileSync(`${DADOS}/nutrition5k/fotos/${p.id}.png`).toString('base64'), tipo: 'image/png', idioma: 'inglês americano' }, m),
    nota: (s: any) => {
      let kcal = 0, prot = 0;
      for (const it of s?.itens ?? []) {
        const c = it.id ? porId.get(it.id) : null;
        if (c) { kcal += (c.kcal / 100) * c.gUn * it.qtd; prot += (c.p / 100) * c.gUn * it.qtd; }
        else if (it.porcao) { kcal += it.porcao.kcal * it.qtd; prot += it.porcao.proteina * it.qtd; }
      }
      return { erroKcal: ape(kcal, p.kcal), erroProteina: ape(prot, p.proteina), kcalEstimada: Math.round(kcal), kcalReal: p.kcal };
    },
  }));
}

const unid = (u: string | null | undefined) => (u ?? '').replace(/\s/g, '').replace('μ', 'µ').toLowerCase();
function casosDoLaudo(): Caso[] {
  const g = JSON.parse(readFileSync(`${DADOS}/laudos/gabarito.json`, 'utf8'));
  return g.map((c: any) => ({
    recurso: 'laudo', id: c.id,
    pedido: (m: string) => {
      const pdf = c.formato === 'pdf';
      return parametrosDoLaudo({ arquivo: readFileSync(`${DADOS}/laudos/${c.id}.${pdf ? 'pdf' : 'jpg'}`).toString('base64'), tipo: pdf ? 'application/pdf' : 'image/jpeg' }, m);
    },
    nota: (s: any) => {
      const lidos = (s?.resultados ?? []) as any[];
      let certos = 0;
      for (const e of c.gabarito.resultados) {
        const r = lidos.find((x) => x.marcador === e.marcador);
        if (r && typeof r.valor === 'number' && Math.abs(r.valor - e.valor) < 1e-9 && unid(r.unidade) === unid(e.unidade)) certos++;
      }
      const esperados = new Set(c.gabarito.resultados.map((e: any) => e.marcador));
      const inventados = lidos.filter((x) => x.marcador && !esperados.has(x.marcador)).length;
      return {
        acertos: c.gabarito.resultados.length ? certos / c.gabarito.resultados.length : (lidos.length === 0 ? 1 : 0),
        dataCerta: (s?.coleta ?? null) === c.gabarito.coleta ? 1 : 0,
        inventados,
      };
    },
  }));
}

function casosDaEstimativa(): Caso[] {
  const g = JSON.parse(readFileSync(`${DADOS}/estimar/gabarito.json`, 'utf8'));
  return g.map((c: any) => ({
    recurso: 'estimar', id: c.id,
    pedido: (m: string) => parametrosDaEstimativa({ nome: c.digitado, idioma: 'pt-BR' }, m),
    nota: (s: any) => {
      const reconheceu = !!s && s.comida === c.comida ? 1 : 0;
      if (!c.comida || !s?.comida || !s.gramas) return { reconheceu };
      return {
        reconheceu,
        erroKcal100: ape((s.kcal / s.gramas) * 100, c.kcal100),
        erroProteina100: ape((s.proteina / s.gramas) * 100, c.prot100),
        porcaoRazao: s.gramas / c.gPorcao,
      };
    },
  }));
}

/* ---------------- a rodada ---------------- */
async function principal() {
const a = args();
const casos = [
  ...(a.recurso === 'todos' || a.recurso === 'foto' ? casosDaFoto() : []),
  ...(a.recurso === 'todos' || a.recurso === 'laudo' ? casosDoLaudo() : []),
  ...(a.recurso === 'todos' || a.recurso === 'estimar' ? casosDaEstimativa() : []),
];
const porRecurso = new Map<string, Caso[]>();
for (const c of casos) {
  const l = porRecurso.get(c.recurso) ?? [];
  if (l.length < a.limite) l.push(c);
  porRecurso.set(c.recurso, l);
}
const fila = [...porRecurso.values()].flat();
mkdirSync(SAIDA, { recursive: true });
const arquivo = (r: string) => `${SAIDA}/${r}.jsonl`;
const feitos = new Set<string>();
for (const r of porRecurso.keys()) {
  if (!existsSync(arquivo(r))) continue;
  for (const l of readFileSync(arquivo(r), 'utf8').split('\n').filter(Boolean)) {
    const x = JSON.parse(l);
    if (x.status === 'ok') feitos.add(`${x.recurso}|${x.modelo}|${x.id}`);
  }
}
const trabalho = fila.flatMap((c) => a.modelos.map((m) => ({ c, m }))).filter(({ c, m }) => !feitos.has(`${c.recurso}|${m}|${c.id}`));
console.log(`${fila.length} casos × ${a.modelos.length} modelos; ${trabalho.length} chamadas a fazer`);
if (a.seco) {
  for (const { c, m } of trabalho.slice(0, 3)) { const p = c.pedido(m); console.log(' ', c.recurso, c.id, m, p.model, Object.keys(p.output_config)); }
  process.exit(0);
}

const cliente = new Anthropic();
let i = 0;
async function trabalhador() {
  while (i < trabalho.length) {
    const { c, m } = trabalho[i++];
    const t0 = Date.now();
    try {
      const r = await cliente.messages.parse(ajustar(c.pedido(m), m));
      const linha = { recurso: c.recurso, id: c.id, modelo: m, servido: r.model, status: 'ok', segundos: (Date.now() - t0) / 1000,
        custo: custo(m, r.usage), uso: r.usage, nota: c.nota(r.parsed_output), saida: r.parsed_output };
      appendFileSync(arquivo(c.recurso), `${JSON.stringify(linha)}\n`);
      console.log(`  ${c.recurso} ${c.id} ${m}: ${JSON.stringify(linha.nota)}`);
    } catch (e: any) {
      appendFileSync(arquivo(c.recurso), `${JSON.stringify({ recurso: c.recurso, id: c.id, modelo: m, status: 'erro', erro: String(e?.message ?? e).slice(0, 300) })}\n`);
      console.log(`  ${c.recurso} ${c.id} ${m}: ERRO ${String(e?.message ?? e).slice(0, 120)}`);
      if (/credit balance/i.test(String(e?.message))) { console.log('sem crédito; parando'); process.exit(1); }
    }
  }
}
await Promise.all([trabalhador(), trabalhador(), trabalhador()]);

/* ---------------- o resumo ---------------- */
const media = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : NaN);
for (const r of porRecurso.keys()) {
  const linhas = readFileSync(arquivo(r), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).filter((x) => x.status === 'ok');
  console.log(`\n== ${r}`);
  for (const m of a.modelos) {
    const ls = linhas.filter((x) => x.modelo === m);
    if (!ls.length) continue;
    const chaves = [...new Set(ls.flatMap((x) => Object.keys(x.nota)))].filter((k) => !/Real|Estimada/.test(k));
    const notas = chaves.map((k) => `${k} ${media(ls.map((x) => x.nota[k]).filter((v: any) => typeof v === 'number' && !Number.isNaN(v))).toFixed(3)}`);
    console.log(`  ${m.padEnd(18)} n=${ls.length}  ${notas.join('  ')}  US$/chamada ${media(ls.map((x) => x.custo)).toFixed(4)}  s ${media(ls.map((x) => x.segundos)).toFixed(1)}`);
  }
}
}

principal();
