/* Gera src/logic/alimentos-rede-br.ts a partir do que as redes publicam.

   ⚠️⚠️ POR QUE O FAST FOOD É POR PAÍS.

   O Big Mac do Brasil tem 26 g de proteína; o dos Estados Unidos, medido
   pelo USDA, tem 24 g em 205 g de sanduíche. Não é erro de ninguém: são
   receitas diferentes, pesos diferentes e tabelas diferentes. Um "Big
   Mac" global com um valor médio seria estimativa com cara de dado, que é
   o oposto do que este código faz com número.

   O lado americano já vem na FNDDS — o USDA mediu as redes de lá. Este
   arquivo é o lado brasileiro, e a fonte é a que a própria rede publica.

     node scripts/gerar-fastfood-br.mjs src/logic/alimentos-rede-br.ts

   ⚠️ A COLHEITA É MANUAL, E ISSO É DECISÃO E NÃO PREGUIÇA. O site do
   McDonald's responde 403 a qualquer cliente que não seja um navegador de
   verdade — o gerador da TACO e o da FNDDS baixam a fonte sozinhos, este
   não consegue. Então a colheita mora em scripts/dados/, com a data em
   que foi feita, e o gerador lê dela.

   PARA ATUALIZAR: abra mcdonalds.com.br num navegador e rode isto no
   console, que é o mesmo colhedor que produziu o arquivo. Ele lê a tabela
   que vem no HTML de cada página de produto.

     const campo = { 'Calorias (Kcal)': 'kcal', 'Gordura total': 'gord',
       'Carboidratos': 'carb', 'Proteínas': 'p', 'Fibra alimentar': 'fibra',
       'Sódio': 'sodio' };
     const num = (v) => { const m = String(v).replace(',', '.').match(/-?\d+(\.\d+)?/); return m ? Number(m[0]) : null; };
     const cats = ['sanduiches-de-carne-bovina', 'sanduiches-de-frango', 'familia-tasty',
       'lancamentos', 'acompanhamentos', 'cafe-da-manha', 'sobremesas', 'mclanche-feliz', 'mccafe'];
     const out = [];
     for (const c of cats) {
       const hc = await fetch('/cardapio/' + c).then((r) => r.text());
       const links = [...new Set([...hc.matchAll(/\/cardapio\/[a-z0-9-]+\/([a-z0-9-]+)/g)].map((m) => m[0]))];
       for (const L of links) {
         const hp = await fetch(L).then((r) => r.text());
         const i = hp.indexOf('<table'); if (i < 0) continue;
         const t = hp.slice(i, hp.indexOf('</table>') + 8);
         const linhas = [...t.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)]
           .map((m) => [...m[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((x) => x[1].replace(/<[^>]+>/g, '').trim()));
         const v = {}; for (const ln of linhas) if (campo[ln[0]]) v[campo[ln[0]]] = num(ln[1]);
         const nome = (hp.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1];
         if (!nome || v.p == null) continue;
         const al = hp.slice(hp.indexOf('Este produto cont'), hp.indexOf('Este produto cont') + 1200);
         const alerg = ['Leite', 'Soja', 'Ovo', 'Glúten', 'Trigo', 'Amendoim', 'Castanha', 'Peixe', 'Crustáceos'].filter((x) => al.includes('>' + x + '<'));
         out.push([L.split('/').pop(), nome.replace(/<[^>]+>/g, '').trim(), c, v.p, v.kcal ?? '', v.carb ?? '', v.gord ?? '', v.fibra ?? '', v.sodio ?? '', alerg.join('+')].join('\t'));
       }
     }
     copy(out.join('\n'));
*/
import fs from 'node:fs';

const SAIDA = process.argv[2] ?? 'src/logic/alimentos-rede-br.ts';
const COLHEITA = 'scripts/dados/mcdonalds-br.tsv';

/* ⚠️ A UNIDADE É O QUE A PESSOA PEDE NO BALCÃO, e por isso é curadoria
   nossa e não da rede: ela publica o rótulo, não a palavra. "1 Big Mac",
   "1 casquinha", "4 nuggets" — é o que alguém diz depois de comer.

   Quem não estiver aqui vira "1 unidade", que é sempre verdade e nunca
   é a melhor palavra. */
const UNIDADE = [
  [/mcnuggets/i, ['porção', 'porções', 1]],
  [/mcfritas|batata/i, ['porção', 'porções', 1]],
  [/salada|side salad/i, ['porção', 'porções', 1]],
  [/casquinha/i, ['casquinha', 'casquinhas', 1]],
  [/sundae|mcflurry|mccolosso|petit|caldo/i, ['pote', 'potes', 1]],
  [/mcshake|mcfloat/i, ['copo', 'copos', 1]],
  [/torta/i, ['torta', 'tortas', 1]],
  [/cookies/i, ['cookie', 'cookies', 1]],
  [/pão de queijo|mini pão/i, ['porção', 'porções', 1]],
  [/tomatinho/i, ['porção', 'porções', 1]],
];
/* ⚠⚠ A QUANTIDADE É SEMPRE 1, e uma tentativa de ser esperto aqui
   quase pôs quatro vezes mais proteína no registro de alguém.

   Eu tinha marcado os McNuggets como "4 nuggets", achando que a
   unidade natural era o nugget. Mas o valor que a rede publica é o da
   PORÇÃO INTEIRA — 9 g de proteína nos quatro —, e a conta do
   aplicativo multiplica o valor pela quantidade: deu 36 g.

   A regra que vale: num produto de rede, a porção é o produto. O `qtd`
   existe para a TACO, onde a porção natural é "4 colheres de arroz" e o
   valor é por 100 g. Aqui o valor já é da caixa. */

const unidadeDe = (nome) => UNIDADE.find(([re]) => re.test(nome))?.[1] ?? ['unidade', 'unidades', 1];

/* ⚠️ A PRATELEIRA É UMA SÓ, E É NOVA. Espalhar o fast food pelas treze
   existentes faria a McFritas contar como verdura no corredor verde e o
   Big Mac aparecer como sugestão de fonte de proteína — os dois recursos
   leem a prateleira. Uma prateleira própria os deixa de fora dos dois de
   graça, e dá à pessoa o filtro que ela procuraria primeiro. */
const PRATELEIRA = 'Lanches de rede';

/* ⚠️ O QUE FICA DE FORA, e por quê. Bebida é de logic/bebidas; molho
   ninguém registra como porção; e café com leite é bebida ainda que a
   rede o liste no cardápio da manhã. Mesma régua da lista americana. */
const FORA = /^(molho|ketchup|mostarda|café|capuccino|cappuccino|chocolate quente|espresso|macchiato|caffé|iced|smoothie|affogato|moca mix|mccafé canadá|água mineral|suco|bebida sabor)/i;

/* ⚠️ A RESTRIÇÃO SAI DA CATEGORIA DA PRÓPRIA REDE, e não de um palpite
   sobre o nome: quem diz que o McChicken é de ave é o McDonald's, que o
   pôs em "sanduíches de frango". Ovo e leite vêm dos alérgenos que ela
   declara; peixe vem dos dois. */
const PORCATEGORIA = {
  'sanduiches-de-carne-bovina': ['carne'],
  'familia-tasty': ['carne'],
  'sanduiches-de-frango': ['ave'],
  peixe: ['peixe'],
};
const PORNOME = [
  [/mcnuggets|chicken|frango/i, 'ave'],
  [/fish|peixe/i, 'peixe'],
  [/beef|bacon|burger|hamb/i, 'carne'],
];

const linhas = fs.readFileSync(COLHEITA, 'utf8')
  .split(/\r?\n/)
  .filter((l) => l.trim() && !l.startsWith('#'));

const num = (v) => (v === '' || v == null ? null : Number(v));
const semAcento = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

const itens = [];
const contem = {};
let fora = 0;

for (const linha of linhas) {
  const [slug, nome, cat, p, kcal, carb, gord, fibra, , alerg] = linha.split('\t');
  if (FORA.test(nome)) { fora++; continue; }
  if (num(p) == null) { fora++; continue; }

  const [un, unp, qtd] = unidadeDe(nome);
  const id = 'mcd-' + slug;

  itens.push({
    id,
    nome: 'McDonald’s ' + nome,
    /* A marca entra na busca de todo jeito, para "mcdonalds" e "mequi"
       acharem o cardápio inteiro. */
    busca: semAcento((nome + ' mcdonalds mequi ' + slug.replace(/-/g, ' ')).toLowerCase()),
    p: num(p),
    kcal: num(kcal), carb: num(carb), gord: num(gord), fibra: num(fibra),
    gUn: null,
    qtd, un, unp,
    onde: PRATELEIRA,
    porUnidade: true,
    fonte: 'Tabela do McDonald’s Brasil, consultada em 21/09/2026',
  });

  /* o que ele tem, para as restrições */
  const tem = new Set(PORCATEGORIA[cat] ?? []);
  for (const [re, ing] of PORNOME) if (re.test(nome)) tem.add(ing);
  const a = (alerg ?? '').split('+');
  if (a.includes('Ovo')) tem.add('ovo');
  if (a.includes('Leite')) tem.add('leite');
  if (a.includes('Peixe')) tem.add('peixe');
  if (tem.size) contem[id] = [...tem];
}

itens.sort((a, b) => a.nome.length - b.nome.length || a.nome.localeCompare(b.nome, 'pt-BR'));

const ts = `/* AS REDES DE FAST FOOD DO BRASIL — o que elas publicam

   ⚠️ ARQUIVO GERADO por scripts/gerar-fastfood-br.mjs, a partir da
   colheita em scripts/dados/. Para mexer, mexa lá e rode de novo.

   ⚠️⚠️ OS VALORES SÃO POR PORÇÃO, e é por isso que cada item traz
   \`porUnidade: true\` e \`gUn: null\`. A rede publica o rótulo do produto
   dela — "o Big Mac tem 26 g de proteína" — e NÃO publica quanto a porção
   pesa: restaurante é isento da RDC 429, que obriga o peso em alimento
   embalado. Converter para a base de 100 g exigiria inventar esse peso.

   ⚠️ E O NÚMERO É DAQUI, e não do Big Mac americano. Lá o USDA mediu 24 g
   em 205 g de sanduíche; aqui a rede publica 26 g. São receitas
   diferentes, e por isso a lista é por país.

   ${itens.length} itens · McDonald's Brasil
   ============================================================ */
import type { Alimento } from './alimentos';

export const REDES_BR: Alimento[] = [
${itens.map((x) => '  ' + JSON.stringify(x) + ',').join('\n')}
];

/* O que cada item tem, para as restrições alimentares. Sai da categoria
   em que a própria rede o pôs, mais os alérgenos que ela declara. */
export const CONTEM_REDE_BR: Record<string, string[]> = ${JSON.stringify(contem, null, 2)};
`;

fs.writeFileSync(SAIDA, ts);
process.stderr.write(itens.length + ' itens · ' + fora + ' fora (bebida, molho ou sem proteína)\n');
