/* Gera src/logic/comidas.ts (a lista de comidas do aplicativo) e
   servidor/alimentos.json (a mesma lista, para a leitura da foto).

     node scripts/gerar-comidas.mjs

   ⚠️⚠️ UMA LISTA SÓ, PARA TODO PAÍS. Até aqui eram duas bases por
   mercado — a TACO no Brasil, a FNDDS americana nos Estados Unidos — e
   quem estava na França, na Alemanha ou no México caía na brasileira,
   com os nomes em português. Agora é uma lista, com o nome de cada
   comida nos seis idiomas do aplicativo.

   DE ONDE VEM CADA NÚMERO — cada item diz o seu:
     taco     a lista brasileira que já existia, com os números da TACO
              (4ª ed., NEPA/UNICAMP) congelados em dados/comidas-base.json
              — os mesmos com que as refeições antigas foram registradas;
     usda     a SR Legacy do USDA (abril de 2018, domínio público), lida
              aqui pelo número NDB — dados/comidas-novas.mjs;
     rótulo   produto comum de mercado, quando nenhuma das duas analisou;
     soma     prato montado, somado componente por componente —
              dados/pratos-novos.mjs, e os pratos antigos da base.

   ⚠️ A SR LEGACY NÃO MORA NO REPOSITÓRIO: são 200 MB de JSON. O gerador
   a baixa (12 MB compactados) ou lê uma cópia em disco:

     USDA_SR=/caminho/FoodData_Central_sr_legacy_food_json_2018-04.json node scripts/gerar-comidas.mjs

   ⚠️ E A TACO TAMBÉM, para as receitas corrigidas da lista brasileira
   (dados/correcoes-base.mjs), que podem citar uma linha dela:

     TACO_LOCAL=/caminho/TACO.json

   O script FALHA se um número NDB não existir, se um componente de
   receita não for achado, ou se uma comida ficar sem nome em algum dos
   seis idiomas: número inventado e tela em branco não passam daqui. */
import fs from 'node:fs';
import zlib from 'node:zlib';
import { UNIDADES } from './dados/unidades.mjs';
import { NOMES_BASE } from './dados/nomes-base.mjs';
import { NOVAS } from './dados/comidas-novas.mjs';
import { PRATOS_NOVOS } from './dados/pratos-novos.mjs';
import { CORRECOES } from './dados/correcoes-base.mjs';
import { CONSOLIDACAO } from './dados/consolidacao.mjs';

const LOCAIS = ['pt-BR', 'en-US', 'es-419', 'fr-FR', 'de-DE', 'it-IT'];
const FONTE_SR = 'https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_json_2018-04.zip';
const erros = [];

/* ------------------------------------------------------------ a SR Legacy */

function primeiroArquivoDoZip(buf) {
  const fim = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (fim < 0) throw new Error('não parece um zip');
  const inicioDir = buf.readUInt32LE(fim + 16);
  const metodo = buf.readUInt16LE(inicioDir + 10);
  const compr = buf.readUInt32LE(inicioDir + 20);
  const local = buf.readUInt32LE(inicioDir + 42);
  const nomeLocal = buf.readUInt16LE(local + 26);
  const extraLocal = buf.readUInt16LE(local + 28);
  const dados = buf.subarray(local + 30 + nomeLocal + extraLocal, local + 30 + nomeLocal + extraLocal + compr);
  return metodo === 0 ? dados : zlib.inflateRawSync(dados, { maxOutputLength: 512 * 1024 * 1024 });
}

const bruto = process.env.USDA_SR
  ? fs.readFileSync(process.env.USDA_SR, 'utf8')
  : await (async () => {
    process.stderr.write('baixando a SR Legacy…\n');
    const r = await fetch(FONTE_SR);
    if (!r.ok) throw new Error('SR Legacy respondeu ' + r.status);
    return primeiroArquivoDoZip(Buffer.from(await r.arrayBuffer())).toString('utf8');
  })();

/* ------------------------------------------------------------ a TACO */

const FONTE_TACO = 'https://raw.githubusercontent.com/marcelosanto/tabela_taco/main/TACO.json';
const TACO = new Map((process.env.TACO_LOCAL
  ? JSON.parse(fs.readFileSync(process.env.TACO_LOCAL, 'utf8'))
  : await fetch(FONTE_TACO).then((r) => r.json())
).map((x) => [x.id, x]));
/* A célula da TACO traz "Tr" para traço (zero na nossa precisão) e
   texto para não analisado (null, nunca zero). */
const celula = (v) => (typeof v === 'number' ? v : v === 'Tr' || v === 'tr' ? 0 : null);
const linhaDaTaco = (id, rend = 1) => {
  const x = TACO.get(id);
  if (!x || typeof x.protein_g !== 'number') return null;
  const d = (v) => { const c = celula(v); return c == null ? null : c / rend; };
  return { p: x.protein_g / rend, kcal: d(x.energy_kcal), carb: d(x.carbohydrate_g), gord: d(x.lipid_g), fibra: d(x.fiber_g) };
};

/* Uma linha da TACO no formato da SR, para o destaque sair pela mesma
   régua. */
const TACO_PARA_SR = {
  protein_g: 'p', energy_kcal: 'kcal', carbohydrate_g: 'carb', lipid_g: 'gord', fiber_g: 'fibra',
  vitaminC_mg: 'vitC', calcium_mg: 'calcio', iron_mg: 'ferro', magnesium_mg: 'magnesio', zinc_mg: 'zinco',
  phosphorus_mg: 'fosforo', niacin_mg: 'niacina', thiamine_mg: 'tiamina', riboflavin_mg: 'riboflavina', rae_mcg: 'vitA',
};
const tacoComoSr = (id) => {
  const x = TACO.get(id);
  if (!x) return null;
  const o = { d: x.description };
  for (const [k, v] of Object.entries(TACO_PARA_SR)) { const c = celula(x[k]); if (c != null) o[v] = c; }
  return o;
};

/* O PREPARO, LIDO DA DESCRIÇÃO DA PRÓPRIA TABELA — e não escrito à mão.
   O dicionário tem uma entrada por alimento (ver dados/consolidacao), e
   a tela do alimento diz de que preparo são os números: "grelhado, sem
   óleo", "cru". A ordem importa: "stir-fried" é refogado antes de ser
   frito, e "cooked, dry heat" é assado antes de ser cozido. */
function preparoDe(descricao) {
  if (!descricao) return null;
  const d = descricao.toLowerCase();
  if (/refogad|stir-fried|sautéed/.test(d)) return 'refogado';
  if (/grelhad|grilled|broiled/.test(d)) return 'grelhado';
  if (/assad|roasted|baked|dry heat/.test(d)) return 'assado';
  if (/frit|fried/.test(d)) return 'frito';
  if (/cozid|cooked|boiled|braised|stewed|moist heat|prepared/.test(d)) return 'cozido';
  if (/\bcru\b|\bcrua\b|\braw\b/.test(d)) return 'cru';
  return null;
}

/* Os nutrientes que o aplicativo usa, pelo id da FoodData Central. */
const NUTRIENTES = {
  1003: 'p', 1008: 'kcal', 1005: 'carb', 1004: 'gord', 1079: 'fibra',
  1162: 'vitC', 1087: 'calcio', 1089: 'ferro', 1090: 'magnesio', 1095: 'zinco',
  1091: 'fosforo', 1167: 'niacina', 1165: 'tiamina', 1166: 'riboflavina', 1106: 'vitA',
};
const SR = new Map();
for (const f of JSON.parse(bruto).SRLegacyFoods) {
  const o = { d: f.description };
  for (const n of f.foodNutrients) {
    const k = NUTRIENTES[n.nutrient?.id];
    if (k && o[k] == null && typeof n.amount === 'number') o[k] = n.amount;
  }
  SR.set(f.ndbNumber, o);
}

/* ------------------------------------------------------------ o destaque */

/* A mesma régua da lista brasileira (ver o alto de gerar-alimentos, na
   história do repositório): VDR da ANVISA, IN 75/2020, Anexo II; corte
   de 15% em 100 g; e a proteína ganha quando passa de 30%, porque é a
   conta deste aplicativo. */
const VDR = [
  ['proteína', 'p', 'g', 50], ['fibra', 'fibra', 'g', 25], ['vitamina C', 'vitC', 'mg', 100],
  ['cálcio', 'calcio', 'mg', 1000], ['ferro', 'ferro', 'mg', 14], ['magnésio', 'magnesio', 'mg', 420],
  ['zinco', 'zinco', 'mg', 11], ['fósforo', 'fosforo', 'mg', 700], ['niacina', 'niacina', 'mg', 15],
  ['tiamina', 'tiamina', 'mg', 1.2], ['riboflavina', 'riboflavina', 'mg', 1.2], ['vitamina A', 'vitA', 'mcg', 800],
];
function destaqueDe(row) {
  let melhor = null;
  let proteina = null;
  for (const [nome, campo, un, idr] of VDR) {
    const v = row[campo];
    if (typeof v !== 'number') continue;
    const pct = Math.round((v / idr) * 100);
    if (pct < 15) continue;
    const cand = { nome, valor: +v.toFixed(v < 10 ? 1 : 0), un, pct };
    if (nome === 'proteína') proteina = cand;
    if (!melhor || pct > melhor.pct) melhor = cand;
  }
  if (proteina && proteina.pct >= 30) return proteina;
  return melhor;
}
const soProteina = (p) => (p / 50 >= 0.15
  ? { nome: 'proteína', valor: +p.toFixed(1), un: 'g', pct: Math.round((p / 50) * 100) }
  : null);

/* ------------------------------------------------------------ as comidas */

const r1 = (v) => (v == null ? null : +v.toFixed(1));
const r0 = (v) => (v == null ? null : Math.round(v));
const semAcento = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const comidas = [];
const porId = new Map();
const junta = (c) => {
  if (porId.has(c.id)) erros.push('id repetido: ' + c.id);
  if (!UNIDADES[c.un]) erros.push(c.id + ': unidade sem tradução: ' + c.un);
  if (!Array.isArray(c.n) || c.n.length !== 6 || c.n.some((x) => !x)) erros.push(c.id + ': falta nome em algum idioma');
  porId.set(c.id, c);
  comidas.push(c);
};

/* A lista brasileira, com os números que já tinha. Pratos são os da
   prateleira de prontos e os somados; o resto é dicionário. */
const BASE = JSON.parse(fs.readFileSync('scripts/dados/comidas-base.json', 'utf8'));
for (const a of BASE) {
  const outros = NOMES_BASE[a.id];
  if (!outros) { erros.push(a.id + ': sem tradução em nomes-base'); continue; }
  const somado = typeof a.fonte === 'string' && a.fonte.startsWith('soma');
  junta({
    id: a.id, n: [a.nome, ...outros], busca: a.busca,
    p: a.p, kcal: a.kcal, carb: a.carb, gord: a.gord, fibra: a.fibra,
    gUn: a.gUn, qtd: a.qtd, un: a.un, onde: a.onde,
    prato: somado || a.onde === 'Pratos prontos',
    destaque: a.destaque ?? null,
    ...(a.taco ? { taco: a.taco } : {}),
    ...(a.fonte ? { fonte: a.fonte } : {}),
    preparo: a.taco ? preparoDe(TACO.get(a.taco)?.description) : null,
  });
}

/* As novas comidas de prateleira. */
for (const c of NOVAS) {
  let v;
  let destaque;
  if (c.usda) {
    const row = SR.get(c.usda);
    if (!row) { erros.push(c.id + ': NDB ' + c.usda + ' não existe na SR Legacy'); continue; }
    if (typeof row.p !== 'number') { erros.push(c.id + ': NDB ' + c.usda + ' sem proteína'); continue; }
    /* rend: o rendimento de cozimento, quando a linha é do alimento cru */
    const d = c.rend ?? 1;
    const div = (x) => (x == null ? null : x / d);
    const r = Object.fromEntries(Object.entries(row).map(([k, x]) => [k, typeof x === 'number' ? x / d : x]));
    v = { p: r1(row.p / d), kcal: r0(div(row.kcal ?? null)), carb: r1(div(row.carb ?? null)), gord: r1(div(row.gord ?? null)), fibra: r1(div(row.fibra ?? null)) };
    destaque = destaqueDe(r);
  } else if (c.rotulo) {
    v = c.rotulo;
    destaque = soProteina(v.p);
  } else { erros.push(c.id + ': sem fonte'); continue; }
  junta({
    id: c.id, n: c.nomes, busca: c.busca ?? '',
    ...v, gUn: c.gUn, qtd: c.qtd, un: c.un, onde: c.onde, prato: false,
    destaque,
    ...(c.usda ? { usda: c.usda } : { fonte: 'rótulo' }),
    ...(c.contem ? { contem: c.contem } : {}),
    preparo: c.usda ? preparoDe(SR.get(c.usda)?.d) : null,
  });
}

/* A SOMA DE UMA RECEITA — a mesma conta para os pratos novos e para as
   receitas corrigidas da lista brasileira. Cada componente entra com o
   peso que tem no prato pronto; o perfil de 100 g é a soma dividida pelo
   peso total. Um nutriente não analisado em UM componente deixa o prato
   sem aquele nutriente: dizer 300 kcal quando faltou contar algo é pior
   do que dizer "não sei". */
function somaReceita(id, receita) {
  let peso = 0;
  const soma = { p: 0, kcal: 0, carb: 0, gord: 0, fibra: 0 };
  const falta = { kcal: false, carb: false, gord: false, fibra: false };
  const partes = [];
  const ids = [];
  const contem = new Set();
  for (const [comp, g] of receita) {
    let v;
    let rotulo;
    if (typeof comp === 'string') {
      v = porId.get(comp);
      if (!v) { erros.push(id + ': componente ' + comp + ' não está na lista'); continue; }
      rotulo = comp;
      ids.push(comp);
    } else if (comp.taco) {
      v = linhaDaTaco(comp.taco, comp.rend);
      if (!v) { erros.push(id + ': TACO ' + comp.taco + ' não existe ou não tem proteína'); continue; }
      rotulo = 'TACO ' + comp.taco + (comp.rend ? '÷' + String(comp.rend).replace('.', ',') : '');
    } else {
      v = SR.get(comp.usda);
      if (!v) { erros.push(id + ': NDB ' + comp.usda + ' não existe'); continue; }
      rotulo = 'USDA ' + comp.usda;
    }
    for (const x of comp.contem ?? []) contem.add(x);
    peso += g;
    soma.p += ((v.p ?? 0) / 100) * g;
    for (const k of ['kcal', 'carb', 'gord', 'fibra']) {
      if (typeof v[k] !== 'number') falta[k] = true;
      else soma[k] += (v[k] / 100) * g;
    }
    partes.push(rotulo + '×' + g + 'g');
  }
  const p100 = (x) => +((x / peso) * 100).toFixed(1);
  const p = p100(soma.p);
  return {
    p, kcal: falta.kcal ? null : Math.round((soma.kcal / peso) * 100),
    carb: falta.carb ? null : p100(soma.carb), gord: falta.gord ? null : p100(soma.gord),
    fibra: falta.fibra ? null : p100(soma.fibra),
    gUn: peso, qtd: 1, prato: true,
    destaque: soProteina(p),
    fonte: 'soma ' + partes.join(' + '),
    receita: ids,
    ...(contem.size ? { contem: [...contem] } : {}),
  };
}

/* As receitas corrigidas da lista brasileira: depois das comidas novas,
   porque algumas citam uma delas (o croissant, o homus). O item fica no
   lugar dele na lista — a ordem é a curadoria da busca. */
for (const [id, c] of Object.entries(CORRECOES)) {
  const alvo = porId.get(id);
  if (!alvo) { erros.push('correção de ' + id + ': não está na lista'); continue; }
  if (c.receita) {
    delete alvo.taco;
    Object.assign(alvo, somaReceita(id, c.receita), { preparo: null });
  }
  if (c.gUn) alvo.gUn = c.gUn;
  if (c.qtd) alvo.qtd = c.qtd;
  if (c.onde) alvo.onde = c.onde;
  if (c.un) {
    if (!UNIDADES[c.un]) erros.push(id + ': unidade sem tradução: ' + c.un);
    alvo.un = c.un;
  }
}

/* UMA ENTRADA POR ALIMENTO — ver dados/consolidacao. */
for (const [id, c] of Object.entries(CONSOLIDACAO)) {
  const alvo = porId.get(id);
  if (!alvo) { erros.push('consolidação de ' + id + ': não está na lista'); continue; }
  if (c.nomes) {
    if (c.nomes.length !== 6 || c.nomes.some((x) => !x)) erros.push(id + ': consolidação sem os seis nomes');
    alvo.n = c.nomes;
  }
  if (c.taco) {
    const row = tacoComoSr(c.taco);
    if (!row || typeof row.p !== 'number') { erros.push(id + ': TACO ' + c.taco + ' sem proteína'); continue; }
    Object.assign(alvo, {
      p: r1(row.p), kcal: r0(row.kcal ?? null), carb: r1(row.carb ?? null), gord: r1(row.gord ?? null), fibra: r1(row.fibra ?? null),
      destaque: destaqueDe(row), taco: c.taco, preparo: preparoDe(row.d),
    });
    delete alvo.fonte;
  }
  if (c.prato) alvo.prato = true;
  if (c.oculto) alvo.oculto = true;
}

/* Os pratos novos, somados. */
for (const d of PRATOS_NOVOS) {
  const soma = somaReceita(d.id, d.receita);
  /* o que o prato costuma levar e a receita não soma */
  const contem = [...new Set([...(soma.contem ?? []), ...(d.contem ?? [])])];
  junta({ id: d.id, n: d.nomes, busca: '', ...soma, ...(contem.length ? { contem } : {}), un: d.un, onde: d.onde ?? 'Pratos prontos' });
}

if (erros.length) { console.error(erros.join('\n')); process.exit(1); }

/* ------------------------------------------------------------ a saída */

const lit = (v) => JSON.stringify(v);
const linhas = comidas.map((c) => {
  const campos = [
    `id: ${lit(c.id)}`, `n: ${lit(c.n)}`, `busca: ${lit(semAcento(c.busca))}`,
    `p: ${c.p}`, `kcal: ${c.kcal}`, `carb: ${c.carb}`, `gord: ${c.gord}`, `fibra: ${c.fibra}`,
    `gUn: ${c.gUn}`, `qtd: ${c.qtd}`, `un: ${lit(c.un)}`, `onde: ${lit(c.onde)}`,
    c.prato ? 'prato: true' : null,
    c.oculto ? 'oculto: true' : null,
    c.preparo ? `preparo: ${lit(c.preparo)}` : null,
    c.destaque ? `destaque: ${lit(c.destaque)}` : null,
    c.taco ? `taco: ${c.taco}` : null,
    c.usda ? `usda: ${c.usda}` : null,
    c.fonte ? `fonte: ${lit(c.fonte)}` : null,
    c.receita ? `receita: ${lit(c.receita)}` : null,
    c.contem ? `contem: ${lit(c.contem)}` : null,
  ].filter(Boolean);
  return `  { ${campos.join(', ')} },`;
});

const unidades = Object.entries(UNIDADES)
  .map(([k, v]) => `  ${lit(k)}: [${LOCAIS.map((l) => lit(v[l])).join(', ')}],`)
  .join('\n');

const dicionario = comidas.filter((c) => !c.prato && !c.oculto).length;
const ocultos = comidas.filter((c) => c.oculto).length;
const saida = `/* ============================================================
   AS COMIDAS — a lista do aplicativo, em todo país

   ⚠️ ARQUIVO GERADO por scripts/gerar-comidas.mjs, que é onde mora a
   explicação de cada fonte. Para mexer, mexa em scripts/dados/ e rode:

     node scripts/gerar-comidas.mjs

   ${comidas.length} comidas: ${dicionario} do dicionário, ${comidas.length - dicionario - ocultos} pratos e ${ocultos} fora das listas.

   n        o nome, na ordem de LOCAIS_DAS_COMIDAS
   busca    palavras a mais para a busca, sem acento
   p…fibra  por 100 g; null é "não analisado", nunca zero
   gUn      gramas de UMA medida caseira (un)
   prato    prato pronto: entra no registro, fica fora do dicionário
   oculto   fora das duas listas, e existe por dentro (ver consolidacao)
   preparo  de que preparo são os números, lido da descrição da tabela
   taco / usda / fonte   de onde vieram os números
   receita  as comidas da lista que o prato somado leva
   contem   o que ele tem para as restrições, quando o corredor não diz
   ============================================================ */
import type { Ingrediente } from './restricoes';

export const LOCAIS_DAS_COMIDAS = ${lit(LOCAIS)} as const;

export type ComidaGerada = {
  id: string;
  n: [string, string, string, string, string, string];
  busca: string;
  p: number;
  kcal: number | null;
  carb: number | null;
  gord: number | null;
  fibra: number | null;
  gUn: number;
  qtd: number;
  un: string;
  onde: string;
  prato?: true;
  /** fora das listas; existe para as refeições antigas, as receitas e a hidratação */
  oculto?: true;
  /** de que preparo são os números, quando a tabela diz */
  preparo?: 'cru' | 'cozido' | 'grelhado' | 'assado' | 'frito' | 'refogado';
  destaque?: { nome: string; valor: number; un: string; pct: number };
  taco?: number;
  usda?: number;
  fonte?: string;
  receita?: string[];
  contem?: Ingrediente[];
};

/** A medida caseira nos seis idiomas: [singular, plural] em cada um. */
export const UNIDADES: Record<string, [string, string][]> = {
${unidades}
};

export const COMIDAS: ComidaGerada[] = [
${linhas.join('\n')}
];
`;
fs.writeFileSync('src/logic/comidas.ts', saida);

/* A MESMA lista para o servidor que lê a foto: o id, o nome em
   português — é a língua do prompt — e a medida em que ele deve contar.
   Gerada na mesma passada, para um id não existir de um lado só. */
const paraServidor = comidas.filter((c) => !c.oculto).map((c) => ({ id: c.id, nome: c.n[0], un: UNIDADES[c.un]['pt-BR'][0], unp: UNIDADES[c.un]['pt-BR'][1], padrao: c.qtd }));
fs.writeFileSync('servidor/alimentos.json', JSON.stringify(paraServidor) + '\n');

console.log(`comidas: ${comidas.length} (${dicionario} no dicionário, ${comidas.length - dicionario - ocultos} pratos, ${ocultos} fora das listas)`);
