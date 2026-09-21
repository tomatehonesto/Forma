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

   ⚠️⚠️ AS DUAS REDES ESTÃO NA MESMA PRATELEIRA COM MEDIDAS DIFERENTES, e
   isso não é descuido: é o que cada uma publica.

     McDonald's   valor POR PORÇÃO, e o peso da porção não é publicado
     Habib's      valor POR 100 g, com o peso da porção declarado

   A RDC 429 obriga o peso em alimento embalado e isenta restaurante. O
   McDonald's usa a isenção; o Habib's publica assim mesmo, nos dois
   formatos. Então os itens dele entram no modelo normal do aplicativo —
   valor por 100 g e `gUn` de verdade — e os do McDonald's entram com
   `porUnidade`. Igualar os dois exigiria inventar um peso de um lado ou
   descartar um peso de verdade do outro.

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
const COLHEITA_HABIBS = 'scripts/dados/habibs-br.tsv';
const COLHEITA_BK = 'scripts/dados/bk-br.tsv';

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
  [/mcshake|mcfloat|shake|mix (de|com)|baldão|balde de/i, ['copo', 'copos', 1]],
  [/onion rings/i, ['porção', 'porções', 1]],
  [/chicken – \d+ unidades|nuggets/i, ['porção', 'porções', 1]],
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

/* ============================================================
   O HABIB'S — a rede que publica o peso

   ⚠️ A UNIDADE VEM DA PRÓPRIA TABELA, e não de uma lista de palpites como
   a do McDonald's: o PDF escreve "Porção de 75 g (1 unidade)", "Porção de
   60 g (1 bola)". Quem diz a palavra é quem serve o prato.

   ⚠️ E A DATA VEM DO CABEÇALHO DA COLHEITA. Escrever a data aqui deixaria
   o gerador dizer uma coisa e o arquivo lido dizer outra no dia em que
   alguém recolhesse a tabela sem mexer neste código.
   ============================================================ */

const cruHabibs = fs.readFileSync(COLHEITA_HABIBS, 'utf8');
const quando = (cruHabibs.match(/^#\s*Colhida em\s*([\d/]+)/m) ?? [, '?'])[1];

/* Bebida é de logic/bebidas, e cobertura e farofa ninguém registra como
   porção — a mesma régua do McDonald's, com os nomes desta casa. */
const FORA_HABIBS = /^(caf[ée]|cappuccino|capuccino|chocolatto|latte|espresso|macchiato|max-?fruit|suco|refrigerante|caipirinha|ch[áa] |cobertura|farofa|calda)/i;

/* ⚠️⚠️ SÓ ENTRA O QUE É DA CASA, e esta é a régua que separa uma lista de
   rede de uma lista de comida repetida.

   O cardápio do Habib's tem kibe, tabule, homus, arroz branco, batata
   frita, pastel de carne, estrogonofe de frango e filé à parmegiana — e
   nenhum deles é dele. São pratos que existem em qualquer lugar, e a
   tabela geral já tem todos, medidos pela Unicamp. Pôr os dois lados
   coloca a pessoa diante de uma escolha sem resposta: "Esfiha de carne"
   ou "Habib's Esfiha de carne"? A segunda não acrescenta nada além da
   marca — e acrescenta uma dúvida.

   O que entra é o que só se pede ali: a Bib'Sfiha, o Beirute, o Genius,
   a esfiha folhada de sobremesa e as linhas de sorvete da casa. O
   McDonald's não precisa de régua porque o cardápio inteiro dele já é
   assim: ninguém faz um Big Mac em casa.

   ⚠️ E A LISTA É DE LINHA DE PRODUTO, e não de item. "Velosa" pega os
   onze sabores de uma vez, e o dia em que a rede lançar o décimo segundo
   ele entra sozinho. Nome de item envelheceria a cada cardápio novo. */
const DA_CASA_HABIBS = /bib’sfiha|beirute|genius|esfiha folhada|velosa|cremosíssimo|casquinha (recheada|mista|soft)|sundae|twist|cascão|super cheddar/i;

const plural = (u) => (u.endsWith('ão') ? u.slice(0, -2) + 'ões' : u + 's');

/* ⚠️ O QUE ELE TEM SAI DO NOME E DO ALÉRGENO, porque é só o que a rede
   diz. O McDonald's tem categoria própria — "sanduíches de frango" — e
   aqui não há: o cardápio é uma tabela só. Nome que não diz o recheio
   fica sem marca, e isso está anotado em PENDENCIAS: melhor a pessoa ver
   um item a mais do que o aplicativo afirmar uma receita que ninguém
   publicou. */
const PORNOME_HABIBS = [
  [/carne|picanha|bacon|calabresa|kafta|kibe|quibe|churrasco|beirute de|hamb/i, 'carne'],
  [/frango|peito de peru/i, 'ave'],
  [/atum|peixe|salm[ãa]o/i, 'peixe'],
];

for (const linha of fs.readFileSync(COLHEITA_HABIBS, 'utf8').split(/\r?\n/)) {
  if (!linha.trim() || linha.startsWith('#')) continue;
  const [slug, nome, , p, kcal, carb, gord, fibra, , gramas, unidades, un, alerg] = linha.split('\t');
  if (FORA_HABIBS.test(nome) || !DA_CASA_HABIBS.test(nome)) { fora++; continue; }
  if (num(p) == null || num(gramas) == null) { fora++; continue; }

  const id = 'hab-' + slug;

  itens.push({
    id,
    nome: 'Habib’s ' + nome,
    /* ⚠️ O APÓSTROFO SAI DA BUSCA. 'Bib’Sfiha' é uma palavra com um
       apóstrofo tipográfico no meio, e ninguém digita isso: quem procura
       escreve 'bibsfiha' ou 'sfiha'. A busca guarda as duas formas — a
       sem apóstrofo, e a do slug, que já vem separada. */
    busca: semAcento((nome.replace(/[’']/g, '') + ' habibs ' + slug.replace(/-/g, ' ')).toLowerCase()),
    p: num(p),
    kcal: num(kcal), carb: num(carb), gord: num(gord), fibra: num(fibra),
    /* ⚠️ AQUI `gUn` É PESO DE VERDADE, e por isso não há `porUnidade`:
       os valores acima são por 100 g, como na TACO.

       ⚠️⚠️ E É O PESO DA UNIDADE, e não o da porção de referência. A
       tabela do beirute diz "Porção: 100 g (5/28 de unidade)" — os 100 g
       são cinco vinte e oito avos do sanduíche, que pesa 560. Ver a
       colheita: o TSV guarda os dois números publicados, e a divisão é
       aqui, que é onde dá para conferir. */
    gUn: Math.round(num(gramas) / num(unidades)),
    qtd: 1, un, unp: plural(un),
    onde: PRATELEIRA,
    fonte: 'Tabela do Habib’s, consultada em ' + quando,
  });

  const tem = new Set();
  for (const [re, ing] of PORNOME_HABIBS) if (re.test(nome)) tem.add(ing);
  const a = (alerg ?? '').split('+');
  if (a.includes('Ovo')) tem.add('ovo');
  if (a.includes('Leite')) tem.add('leite');
  if (a.includes('Peixe')) tem.add('peixe');
  if (tem.size) contem[id] = [...tem];
}

/* ============================================================
   O BURGER KING — valores da porção, com o peso dela

   ⚠️ FICA ENTRE AS OUTRAS DUAS. O McDonald's publica o valor da porção e
   não diz o peso; o Habib's publica por 100 g e diz o peso; o Burger King
   publica o valor da porção E o peso. Então o item entra com
   `porUnidade` — os números são do sanduíche inteiro, como na tabela — e
   com `gUn` preenchido, que é o que deixa a tela dizer quanto ele pesa
   sem que ninguém precise inventar.

   ⚠️ E A RESTRIÇÃO SAI DO NOME, porque a tabela liga alérgeno a
   INGREDIENTE e não a produto: ela diz o que tem no queijo cheddar e na
   calda de morango, não o que tem no Stacker. Ver a colheita. Marcar de
   menos é o erro que machuca — quem filtrou lactose veria o milk-shake
   —, e por isso a lista abaixo é generosa: queijo, shake, sorvete e
   sobremesa levam leite.
   ============================================================ */

const cruBk = fs.readFileSync(COLHEITA_BK, 'utf8');
const quandoBk = (cruBk.match(/^#\s*Colhida em\s*([\d/]+)/m) ?? [, '?'])[1];

/* ⚠️ O MOLHO NEM SEMPRE SE CHAMA MOLHO. O Burger King lista "Ketchup",
   "Mostarda" e "Maionese" pelo nome, e a régua do McDonald's — que
   cortava por "molho" — deixou os quatro passarem, cada um com zero
   grama de proteína, na frente de quem procurava um sanduíche. */
const FORA_BK = /^(refrigerante|suco|caf[ée]|água|ch[áa] |molho|ketchup|mostarda|maionese)/i;

const PORNOME_BK = [
  [/whopper|stacker|rodeio|cheeseburger|burger|carne|bacon|big king|cheddar|steakhouse|furioso/i, 'carne'],
  [/chicken|frango|nuggets/i, 'ave'],
  [/fish|peixe/i, 'peixe'],
  [/queijo|cheese|shake|sundae|casquinha|baldão|balde de|mix de|brownie|nutella|doce de leite|ovomaltine|cheddar/i, 'leite'],
];

for (const linha of cruBk.split(/\r?\n/)) {
  if (!linha.trim() || linha.startsWith('#')) continue;
  const [slug, nome, , p, kcal, carb, gord, fibra, , gramas] = linha.split('\t');
  if (FORA_BK.test(nome) || num(p) == null) { fora++; continue; }

  const id = 'bk-' + slug;
  /* "BK® Chicken Crispy" viraria "Burger King BK® Chicken Crispy" */
  const limpo = nome.replace(/^BK®\s*/, '');
  const [un, unp, qtd] = unidadeDe(nome);

  itens.push({
    id,
    nome: 'Burger King ' + limpo,
    busca: semAcento((limpo + ' burger king bk ' + slug.replace(/-/g, ' ')).toLowerCase()),
    p: num(p),
    kcal: num(kcal), carb: num(carb), gord: num(gord), fibra: num(fibra),
    /* ⚠️ OS DOIS JUNTOS: os valores são da porção, e o peso dela é
       publicado. Ver o alto deste bloco. */
    gUn: num(gramas),
    qtd, un, unp,
    onde: PRATELEIRA,
    porUnidade: true,
    fonte: 'Tabela do Burger King Brasil, consultada em ' + quandoBk,
  });

  const tem = new Set();
  for (const [re, ing] of PORNOME_BK) if (re.test(nome)) tem.add(ing);
  if (tem.size) contem[id] = [...tem];
}

itens.sort((a, b) => a.nome.length - b.nome.length || a.nome.localeCompare(b.nome, 'pt-BR'));

const ts = `/* AS REDES DE FAST FOOD DO BRASIL — o que elas publicam

   ⚠️ ARQUIVO GERADO por scripts/gerar-fastfood-br.mjs, a partir da
   colheita em scripts/dados/. Para mexer, mexa lá e rode de novo.

   ⚠️⚠️ SÃO DUAS MEDIDAS NA MESMA LISTA, porque as redes publicam
   diferente. O item do McDonald's traz \`porUnidade: true\` e \`gUn: null\`:
   a rede publica o rótulo do produto — "o Big Mac tem 26 g de proteína" —
   e NÃO diz quanto a porção pesa, porque restaurante é isento da RDC 429.
   O item do Habib's traz valor por 100 g e \`gUn\` de verdade, porque a
   tabela dele declara o peso. Converter um no outro exigiria inventar.

   ⚠️ E O NÚMERO É DAQUI, e não do Big Mac americano. Lá o USDA mediu 24 g
   em 205 g de sanduíche; aqui a rede publica 26 g. São receitas
   diferentes, e por isso a lista é por país.

   ${itens.length} itens · McDonald's e Habib's, Brasil
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
