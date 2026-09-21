/* Gera src/logic/alimentos-us.ts a partir da FNDDS (USDA).

   ⚠️⚠️ POR QUE UMA SEGUNDA BASE, E NÃO UMA TRADUÇÃO DA PRIMEIRA.

   A lista brasileira sai da TACO e descreve o que se come no Brasil, com
   os números medidos aqui. Traduzir "Peito de frango grelhado" para
   "Grilled chicken breast" e manter 32 g de proteína seria inventar um
   dado americano a partir de uma medição brasileira — e nem os alimentos
   são os mesmos: pão de queijo não existe lá, biscuits and gravy não
   existe aqui.

   Então cada mercado tem a SUA base, com a fonte dele. Esta é a FNDDS —
   Food and Nutrient Database for Dietary Studies, do USDA. Domínio
   público, e é a base que o próprio governo americano usa para ler o que
   as pessoas responderam num inquérito alimentar: são alimentos COMO SE
   COME, com prato pronto e com marca, e não uma tabela de ingredientes.

     node scripts/gerar-alimentos-us.mjs src/logic/alimentos-us.ts

   ⚠️ E ELA TRAZ A PORÇÃO CASEIRA, que é o coração do registro aqui: "1
   McDonald's Big Mac = 205 g" está no próprio dado. Foi o que decidiu
   usar a FNDDS em vez da SR Legacy, que é maior e descreve 100 g.

   ⚠️ O FORMATO DE SAÍDA É UMA STRING EMPACOTADA, e não cinco mil objetos.
   Cinco mil literais de objeto são cinco mil alocações no start do
   aplicativo; uma string é uma. A lista só vira objeto quando alguém
   busca pela primeira vez. */
import fs from 'node:fs';
import zlib from 'node:zlib';

const SAIDA = process.argv[2] ?? 'src/logic/alimentos-us.ts';
const FONTE = 'https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_survey_food_json_2022-10-28.zip';

/* ---------------------------------------------------------------- zip

   Trinta linhas em vez de uma dependência. O zip do USDA tem uma entrada
   só, deflate; o leitor acha o fim do diretório central, anda até o
   cabeçalho local e infla. */
function primeiroArquivoDoZip(buf) {
  const fim = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (fim < 0) throw new Error('não parece um zip');
  const inicioDir = buf.readUInt32LE(fim + 16);
  const metodo = buf.readUInt16LE(inicioDir + 10);
  const compr = buf.readUInt32LE(inicioDir + 20);
  const nomeLen = buf.readUInt16LE(inicioDir + 28);
  const extraLen = buf.readUInt16LE(inicioDir + 30);
  const comentLen = buf.readUInt16LE(inicioDir + 32);
  const local = buf.readUInt32LE(inicioDir + 42);
  const nome = buf.toString('utf8', inicioDir + 46, inicioDir + 46 + nomeLen);
  void extraLen; void comentLen;

  const nomeLocal = buf.readUInt16LE(local + 26);
  const extraLocal = buf.readUInt16LE(local + 28);
  const dados = buf.subarray(local + 30 + nomeLocal + extraLocal, local + 30 + nomeLocal + extraLocal + compr);
  return { nome, conteudo: metodo === 0 ? dados : zlib.inflateRawSync(dados, { maxOutputLength: 512 * 1024 * 1024 }) };
}

const bruto = process.env.FNDDS_LOCAL
  ? fs.readFileSync(process.env.FNDDS_LOCAL, 'utf8')
  : await (async () => {
    process.stderr.write('baixando a FNDDS…\n');
    const r = await fetch(FONTE);
    if (!r.ok) throw new Error('FNDDS respondeu ' + r.status);
    return primeiroArquivoDoZip(Buffer.from(await r.arrayBuffer())).conteudo.toString('utf8');
  })();

const FNDDS = JSON.parse(bruto);
const TUDO = FNDDS.SurveyFoods ?? Object.values(FNDDS)[0];

/* ------------------------------------------------------- as prateleiras

   ⚠️ AS TREZE PRATELEIRAS SÃO AS MESMAS DA LISTA BRASILEIRA, e isso não é
   estética: `restricoes.ts` sugere fonte de proteína por prateleira e
   `conselhos.ts` conta o corredor verde por ela. Uma base com categorias
   próprias apagaria os dois recursos para quem está nos EUA.

   A FNDDS tem cento e sessenta categorias; aqui elas caem nas treze. O
   que não cai é DESCARTADO e CONTADO — o script imprime o que ficou de
   fora, para a próxima rodada decidir se era desperdício ou acerto. */
/* ⚠️ UMA TABELA, E NÃO UM REGEX. A primeira versão disto casava padrão
   no nome da categoria — e as categorias da FNDDS são NOMES DE ALIMENTO,
   não nomes de grupo: "Broccoli" e "Spinach" não contêm a palavra
   "vegetable", e as duas caíram fora da prateleira de verduras sem que
   nada acusasse. Trinta itens somem em silêncio, e o defeito só aparece
   quando alguém procura brócolis e não acha.

   São 169 linhas porque são 169 categorias. Cada uma diz onde cai, e o
   `null` é uma decisão dita: bebida vai para logic/bebidas, condimento e
   gordura não se registram por porção, comida de bebê não é deste
   aplicativo. */
const PRATELEIRA = {
  /* --- carnes e aves --- */
  'Bacon': 'Carnes e aves',
  'Beef, excludes ground': 'Carnes e aves',
  'Burgers': 'Carnes e aves',
  'Chicken patties, nuggets and tenders': 'Carnes e aves',
  'Chicken, whole pieces': 'Carnes e aves',
  'Cold cuts and cured meats': 'Carnes e aves',
  'Frankfurters': 'Carnes e aves',
  'Ground beef': 'Carnes e aves',
  'Lamb, goat, game': 'Carnes e aves',
  'Liver and organ meats': 'Carnes e aves',
  'Meat mixed dishes': 'Carnes e aves',
  'Pork': 'Carnes e aves',
  'Poultry mixed dishes': 'Carnes e aves',
  'Sausages': 'Carnes e aves',
  'Turkey, duck, other poultry': 'Carnes e aves',

  /* --- peixes e frutos do mar --- */
  'Fish': 'Peixes e frutos do mar',
  'Shellfish': 'Peixes e frutos do mar',
  'Seafood mixed dishes': 'Peixes e frutos do mar',

  /* --- ovos --- */
  'Eggs and omelets': 'Ovos',

  /* --- leite e queijos --- */
  'Cheese': 'Leite e queijos',
  'Cottage/ricotta cheese': 'Leite e queijos',
  'Cream cheese, sour cream, whipped cream': 'Leite e queijos',
  'Cream and cream substitutes': 'Leite e queijos',
  'Flavored milk, lowfat': 'Leite e queijos',
  'Flavored milk, nonfat': 'Leite e queijos',
  'Flavored milk, reduced fat': 'Leite e queijos',
  'Flavored milk, whole': 'Leite e queijos',
  'Milk, lowfat': 'Leite e queijos',
  'Milk, nonfat': 'Leite e queijos',
  'Milk, reduced fat': 'Leite e queijos',
  'Milk, whole': 'Leite e queijos',
  'Milk substitutes': 'Leite e queijos',
  'Yogurt, Greek': 'Leite e queijos',
  'Yogurt, regular': 'Leite e queijos',

  /* --- grãos e feijões --- */
  'Bean, pea, legume dishes': 'Grãos e feijões',
  'Beans, peas, legumes': 'Grãos e feijões',
  'Processed soy products': 'Grãos e feijões',

  /* --- verduras e legumes --- */
  'Broccoli': 'Verduras e legumes',
  'Cabbage': 'Verduras e legumes',
  'Carrots': 'Verduras e legumes',
  'Coleslaw, non-lettuce salads': 'Verduras e legumes',
  'Corn': 'Verduras e legumes',
  'French fries and other fried white potatoes': 'Verduras e legumes',
  'Fried vegetables': 'Verduras e legumes',
  'Lettuce and lettuce salads': 'Verduras e legumes',
  'Mashed potatoes and white potato mixtures': 'Verduras e legumes',
  'Olives, pickles, pickled vegetables': 'Verduras e legumes',
  'Onions': 'Verduras e legumes',
  'Other dark green vegetables': 'Verduras e legumes',
  'Other red and orange vegetables': 'Verduras e legumes',
  'Other starchy vegetables': 'Verduras e legumes',
  'Other vegetables and combinations': 'Verduras e legumes',
  'Spinach': 'Verduras e legumes',
  'String beans': 'Verduras e legumes',
  'Tomatoes': 'Verduras e legumes',
  'Vegetable dishes': 'Verduras e legumes',
  'Vegetables on a sandwich': 'Verduras e legumes',
  'White potatoes, baked or boiled': 'Verduras e legumes',

  /* --- frutas --- */
  'Apples': 'Frutas',
  'Bananas': 'Frutas',
  'Blueberries and other berries': 'Frutas',
  'Citrus fruits': 'Frutas',
  'Dried fruits': 'Frutas',
  'Grapes': 'Frutas',
  'Mango and papaya': 'Frutas',
  'Melons': 'Frutas',
  'Other fruits and fruit salads': 'Frutas',
  'Peaches and nectarines': 'Frutas',
  'Pears': 'Frutas',
  'Pineapple': 'Frutas',
  'Strawberries': 'Frutas',

  /* --- castanhas e sementes --- */
  'Nuts and seeds': 'Castanhas e sementes',

  /* --- arroz, massas e pães --- */
  'Bagels and English muffins': 'Arroz, massas e pães',
  'Biscuits, muffins, quick breads': 'Arroz, massas e pães',
  'Crackers, excludes saltines': 'Arroz, massas e pães',
  'Pasta, noodles, cooked grains': 'Arroz, massas e pães',
  'Rice': 'Arroz, massas e pães',
  'Rolls and buns': 'Arroz, massas e pães',
  'Saltine crackers': 'Arroz, massas e pães',
  'Tortillas': 'Arroz, massas e pães',
  'Yeast breads': 'Arroz, massas e pães',

  /* --- café da manhã --- */
  'Egg/breakfast sandwiches': 'Café da manhã',
  'Grits and other cooked cereals': 'Café da manhã',
  'Oatmeal': 'Café da manhã',
  'Pancakes, waffles, French toast': 'Café da manhã',
  'Ready-to-eat cereal, higher sugar (>21.2g/100g)': 'Café da manhã',
  'Ready-to-eat cereal, lower sugar (=<21.2g/100g)': 'Café da manhã',

  /* --- doces e lanches --- */
  'Cakes and pies': 'Doces e lanches',
  'Candy containing chocolate': 'Doces e lanches',
  'Candy not containing chocolate': 'Doces e lanches',
  'Cereal bars': 'Doces e lanches',
  'Cookies and brownies': 'Doces e lanches',
  'Doughnuts, sweet rolls, pastries': 'Doces e lanches',
  'Gelatins, ices, sorbets': 'Doces e lanches',
  'Ice cream and frozen dairy desserts': 'Doces e lanches',
  'Jams, syrups, toppings': 'Doces e lanches',
  'Milk shakes and other dairy drinks': 'Doces e lanches',
  'Popcorn': 'Doces e lanches',
  'Potato chips': 'Doces e lanches',
  'Pretzels/snack mix': 'Doces e lanches',
  'Pudding': 'Doces e lanches',
  'Sugars and honey': 'Doces e lanches',
  'Tortilla, corn, other chips': 'Doces e lanches',
  'Turnovers and other grain-based items': 'Doces e lanches',

  /* --- suplementos --- */
  'Nutrition bars': 'Suplementos',
  'Nutritional beverages': 'Suplementos',
  'Protein and nutritional powders': 'Suplementos',

  /* --- pratos prontos --- */
  'Burritos and tacos': 'Pratos prontos',
  'Cheese sandwiches': 'Pratos prontos',
  'Chicken fillet sandwiches': 'Pratos prontos',
  'Deli and cured meat sandwiches': 'Pratos prontos',
  'Egg rolls, dumplings, sushi': 'Pratos prontos',
  'Frankfurter sandwiches': 'Pratos prontos',
  'Fried rice and lo/chow mein': 'Pratos prontos',
  'Macaroni and cheese': 'Pratos prontos',
  'Meat and BBQ sandwiches': 'Pratos prontos',
  'Nachos': 'Pratos prontos',
  'Other Mexican mixed dishes': 'Pratos prontos',
  'Pasta mixed dishes, excludes macaroni and cheese': 'Pratos prontos',
  'Peanut butter and jelly sandwiches': 'Pratos prontos',
  'Pizza': 'Pratos prontos',
  'Rice mixed dishes': 'Pratos prontos',
  'Seafood sandwiches': 'Pratos prontos',
  'Soups': 'Pratos prontos',
  'Stir-fry and soy-based sauce mixtures': 'Pratos prontos',
  'Vegetable sandwiches/burgers': 'Pratos prontos',

  /* --- bebida: é de logic/bebidas, e não desta lista --- */
  'Apple juice': null,
  'Beer': null,
  'Bottled water': null,
  'Citrus juice': null,
  'Coffee': null,
  'Diet soft drinks': null,
  'Diet sport and energy drinks': null,
  'Enhanced water': null,
  'Flavored or carbonated water': null,
  'Fruit drinks': null,
  'Liquor and cocktails': null,
  'Other diet drinks': null,
  'Other fruit juice': null,
  'Smoothies and grain drinks': null,
  'Soft drinks': null,
  'Sport and energy drinks': null,
  'Tap water': null,
  'Tea': null,
  'Vegetable juice': null,
  'Wine': null,

  /* --- condimento e gordura: ninguém registra uma porção de maionese,
         e o que elas acrescentam entra pelo prato em que foram usadas --- */
  'Butter and animal fats': null,
  'Dips, gravies, other sauces': null,
  'Margarine': null,
  'Mayonnaise': null,
  'Mustard and other condiments': null,
  'Pasta sauces, tomato-based': null,
  'Salad dressings and vegetable oils': null,
  'Soy-based condiments': null,
  'Sugar substitutes': null,
  'Tomato-based condiments': null,

  /* --- comida de bebê e fórmula: não é deste aplicativo --- */
  'Baby food: cereals': null,
  'Baby food: fruit': null,
  'Baby food: meat and dinners': null,
  'Baby food: mixtures': null,
  'Baby food: snacks and sweets': null,
  'Baby food: vegetable': null,
  'Baby food: yogurt': null,
  'Baby juice': null,
  'Baby water': null,
  'Formula, prepared from powder': null,
  'Formula, ready-to-feed': null,
  'Human milk': null,

  /* --- a própria FNDDS não classificou --- */
  'Not included in a food category': null,
};

/* ⚠️ CATEGORIA DESCONHECIDA DERRUBA O SCRIPT. A FNDDS ganha edição nova
   de tempos em tempos, e uma categoria nova cairia calada — que é
   exatamente o defeito que a tabela veio consertar. */
const naoMapeadas = new Set();
const prateleiraDe = (cat) => {
  if (!(cat in PRATELEIRA)) { naoMapeadas.add(cat); return null; }
  return PRATELEIRA[cat];
};

/* ------------------------------------------------------------ a porção

   FNDDS escreve "1 McDonald's Big Mac", "1 cup", "2 slices". O número da
   frente é a QUANTIDADE e o resto é a UNIDADE — que é exatamente o par
   que a tela precisa para perguntar "quantos?".

   ⚠️ E O PLURAL SAI DA REGRA DO INGLÊS, que é simples o bastante para
   caber aqui: sibilante ganha -es, y depois de consoante vira -ies, o
   resto ganha -s. As exceções que importam num registro de comida são
   poucas e estão na tabela. */
const IRREGULAR = { leaf: 'leaves', loaf: 'loaves', half: 'halves', slice: 'slices', 'french fry': 'french fries' };
const plural = (un) => {
  const u = un.toLowerCase();
  if (IRREGULAR[u]) return IRREGULAR[u];
  /* nome próprio de produto não pluraliza: "2 Big Mac" é o que se diz */
  if (/[A-Z]/.test(un.slice(1))) return un;
  if (/(s|x|z|ch|sh)$/.test(u)) return un + 'es';
  if (/[^aeiou]y$/.test(u)) return un.slice(0, -1) + 'ies';
  return un + 's';
};

/* ⚠️ A PORÇÃO É A PERGUNTA QUE A TELA FAZ, e escolher a errada quebra o
   registro inteiro. A primeira versão pegava a primeira porção que
   começasse com "1 ", e o resultado foi:

     Big Mac    -> "1 McDonald's Mac Jr" (135 g), que é outro sanduíche
     Pizza      -> "1 surface inch" (8 g), que ninguém come
     Espinafre  -> "1 leaf" (10 g), que ninguém come

   A FNDDS lista TODAS as porções possíveis, inclusive as de laboratório.
   Escolher entre elas é curadoria, e ela está aqui como pontuação — assim
   dá para ler por que cada uma ganhou. */

/* O que alguém de fato come de uma vez. */
const PORCAO_BOA = /\b(piece|slice|sandwich|burger|cup|container|bowl|item|each|package|bar|can|bottle|patty|breast|thigh|wing|filet|fillet|steak|egg|link|serving|scoop|taco|burrito|roll|muffin|bagel|cookie|donut|doughnut|bun|wrap|plate|portion|order|small|medium|large)\b/i;

/* O que é fração de laboratório, e não porção de gente. */
const PORCAO_RUIM = /\b(surface inch|cubic inch|tsp|teaspoon|tbsp|tablespoon|leaf|leaves|sprig|seed|kernel|chip|bean|grain|drop|dash|pinch|floret|slice, thin|cm|mm|inch)\b/i;

const porcaoDe = (f) => {
  const ps = (f.foodPortions ?? [])
    .filter((x) => x.portionDescription && !/not specified/i.test(x.portionDescription) && x.gramWeight > 0);
  if (!ps.length) return null;

  const nomeNorm = String(f.description).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ');

  const palavrasDoNome = nomeNorm.split(/\s+/).filter(Boolean);

  const nota = (x) => {
    const d = x.portionDescription;
    const semNumero = d.replace(/^\s*\d+(?:\.\d+)?\s*/, '').toLowerCase();
    let n = 0;

    /* ⚠️⚠️ A PORÇÃO QUE SE CHAMA COMO O ALIMENTO É A CERTA, e é o que
       separa o Big Mac do Mac Jr. A FNDDS lista as três dentro do MESMO
       registro — Mac Jr, Grand Mac e Big Mac —, e só uma é o que a pessoa
       comeu.

       ⚠️ E NÃO BASTA CONTAR O QUE BATE: a primeira versão exigia que toda
       palavra da porção estivesse no nome, e descartava as curtas para não
       casar ruído. "Big" e "Mac" têm três letras — eram justamente as
       palavras que decidiam, e sem elas Mac Jr e Big Mac empatavam.

       O que decide é o que NÃO bate: "jr" e "grand" não estão em "Big Mac
       (McDonalds)", e cada palavra sobrando derruba a nota. */
    const palavras = semNumero.replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/)
      .filter((w) => w.length >= 2 && w !== 'nfs');
    if (palavras.length) {
      const batem = palavras.filter((w) => palavrasDoNome.some((nw) => nw.includes(w) || w.includes(nw))).length;
      n += Math.round(60 * (batem / palavras.length)) - 25 * (palavras.length - batem);
    }

    if (PORCAO_BOA.test(semNumero)) n += 50;
    if (PORCAO_RUIM.test(semNumero)) n -= 100;
    /* uma porção de refeição pesa entre trinta e seiscentos gramas */
    if (x.gramWeight >= 30 && x.gramWeight <= 600) n += 20;
    if (x.gramWeight < 12) n -= 40;
    /* "1 alguma coisa" é mais legível que "3 alguma coisa" */
    if (/^\s*1\s+\S/.test(d)) n += 10;
    return n;
  };

  const p = ps.slice().sort((a, b) => nota(b) - nota(a))[0];
  const m = p.portionDescription.match(/^\s*(\d+(?:\.\d+)?)\s+(.+)$/);
  /* ⚠️ "NFS" É JARGÃO DE BANCO — "Not Further Specified" —, e vazava para
     a tela: "1 cup, NFS", "1 piece, NFS". Quem responde o registro não tem
     por que saber o que a sigla quer dizer, e o que ela acrescenta é zero:
     a porção continua sendo um copo, um pedaço. */
  const un = (m ? m[2] : p.portionDescription)
    .replace(/[,(]?\s*NFS\s*\)?/gi, '')
    .replace(/\s*,\s*$/, '')
    .trim().replace(/\s+/g, ' ');
  if (!un || un.length > 28) return null;
  return { gUn: Math.round(p.gramWeight / (m ? Number(m[1]) : 1)), qtd: 1, un, unp: plural(un) };
};

/* ------------------------------------------------------------ nutrientes */
const N = { p: 1003, kcal: 1008, carb: 1005, gord: 1004, fibra: 1079 };
const nut = (f, id) => {
  const n = f.foodNutrients?.find((x) => x.nutrient?.id === id);
  return typeof n?.amount === 'number' ? Math.round(n.amount * 10) / 10 : null;
};

/* ------------------------------------------------------------- o id

   Sai do fdcId, e não do nome: o nome muda entre edições da FNDDS, o
   fdcId não. Com prefixo, para nunca colidir com um id da lista
   brasileira. */
const idDe = (f) => 'us' + f.fdcId;

/* ---------------------------------------------------------------- busca

   O nome sem pontuação e sem maiúscula, mais o que estava entre
   parênteses — é ali que a FNDDS guarda a marca. "Big Mac (McDonalds)"
   passa a ser achável por "mcdonalds" também. */
const buscaDe = (nome) => {
  const semAcento = nome.normalize('NFD').replace(/[̀-ͯ]/g, '');
  return semAcento.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
};

/* ================================================================= */
const linhas = [];
const foraPorCategoria = new Map();
let semProteina = 0, semPorcao = 0, semCategoria = 0;

for (const f of TUDO) {
  const p = nut(f, N.p);
  if (p == null) { semProteina++; continue; }

  const cat = f.wweiaFoodCategory?.wweiaFoodCategoryDescription ?? '';
  const onde = prateleiraDe(cat);
  if (!onde) {
    semCategoria++;
    foraPorCategoria.set(cat, (foraPorCategoria.get(cat) ?? 0) + 1);
    continue;
  }

  const porc = porcaoDe(f);
  if (!porc) { semPorcao++; continue; }

  const nome = String(f.description).replace(/\s+/g, ' ').trim();
  linhas.push([
    idDe(f), nome, buscaDe(nome),
    p, nut(f, N.kcal) ?? '', nut(f, N.carb) ?? '', nut(f, N.gord) ?? '', nut(f, N.fibra) ?? '',
    porc.gUn, porc.qtd, porc.un, porc.unp, onde,
  ].join(''));
}

/* ⚠️ A ORDEM É POR NOME MAIS CURTO, e não alfabética. Ela faz o papel
   que na lista brasileira é curadoria à mão: lá os alimentos são
   ordenados DENTRO da prateleira do mais comum para o menos, e é essa
   ordem que a busca usa como desempate.

   A FNDDS não traz importância nenhuma, e em ordem alfabética "Beef and
   broccoli" vinha antes de "Broccoli, raw", "Cake or cupcake, peanut
   butter" antes de "Peanut butter". O nome curto é o alimento; o longo é
   quase sempre um prato que o contém ou uma variação dele. */
const semAcentoOrd = (x) => x.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
linhas.sort((a, b) => {
  const na = a.split('')[1], nb = b.split('')[1];
  return na.length - nb.length || semAcentoOrd(na).localeCompare(semAcentoOrd(nb), 'en');
});

const pacote = linhas.join('');
const kb = (Buffer.byteLength(pacote, 'utf8') / 1024).toFixed(0);

const cabecalho = `/* OS ALIMENTOS DOS ESTADOS UNIDOS — de onde saem os gramas lá

   ⚠️ ARQUIVO GERADO por scripts/gerar-alimentos-us.mjs. Para mexer, mexa
   lá e rode de novo:

     node scripts/gerar-alimentos-us.mjs src/logic/alimentos-us.ts

   Fonte: FNDDS (Food and Nutrient Database for Dietary Studies), USDA,
   edição 2019-2020. Domínio público. São alimentos COMO SE COME — prato
   pronto e marca incluídos —, porque é a base que o próprio governo usa
   para ler inquérito alimentar. A porção caseira vem do dado, e não de
   curadoria nossa: "1 McDonald's Big Mac" pesa 205 g segundo o USDA.

   ⚠️ ESTA NÃO É UMA TRADUÇÃO DA LISTA BRASILEIRA, e não pode virar uma.
   Os alimentos são outros e os números foram medidos em outro lugar. Ver
   o alto do gerador.

   ⚠️ E O PACOTE É UMA STRING, e não ${linhas.length} objetos: são
   ${linhas.length} alocações a menos no start, e a lista só vira objeto
   quando alguém busca pela primeira vez.

   ${linhas.length} alimentos · ${kb} KB empacotados
   ============================================================ */
import type { Alimento } from './alimentos';

/* Unidade 0x1f separa campo, 0x1e separa registro: são os separadores que
   o Unicode reserva para isso, e nenhum nome de alimento os contém. */
const PACOTE = ${JSON.stringify(pacote)};

let lista: Alimento[] | null = null;

/** A lista americana, montada na primeira vez que alguém precisa dela. */
export function alimentosUS(): Alimento[] {
  if (lista) return lista;
  const n = (v: string) => (v === '' ? null : Number(v));
  lista = PACOTE.split('\\u001e').map((linha) => {
    const [id, nome, busca, p, kcal, carb, gord, fibra, gUn, qtd, un, unp, onde] = linha.split('\\u001f');
    return {
      id, nome, busca,
      p: Number(p), kcal: n(kcal), carb: n(carb), gord: n(gord), fibra: n(fibra),
      gUn: Number(gUn), qtd: Number(qtd), un, unp, onde,
      fonte: 'USDA FNDDS 2019-2020',
    } as Alimento;
  });
  return lista;
}
`;

/* ⚠️ CATEGORIA DESCONHECIDA DERRUBA O SCRIPT, e nada é gravado. A FNDDS
   ganha edição nova de tempos em tempos, e uma categoria nova cairia
   calada — que é exatamente o defeito que a tabela veio consertar. */
if (naoMapeadas.size) {
  process.stderr.write('\n⚠️ CATEGORIAS QUE A TABELA NÃO CONHECE — a FNDDS mudou:\n'
    + [...naoMapeadas].map((c) => '  ' + c).join('\n')
    + '\nAcrescente cada uma ao mapa PRATELEIRA, com o lugar dela ou com null.\n');
  process.exit(1);
}

fs.writeFileSync(SAIDA, cabecalho);

process.stderr.write(
  '\n' + linhas.length + ' alimentos · ' + kb + ' KB\n'
  + '  descartados: ' + semProteina + ' sem proteína, ' + semPorcao + ' sem porção, '
  + semCategoria + ' fora das treze prateleiras\n\n'
  + 'as categorias que ficaram de fora, por tamanho:\n'
  + [...foraPorCategoria.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)
    .map(([c, n2]) => '  ' + String(n2).padStart(4) + '  ' + c).join('\n') + '\n',
);
