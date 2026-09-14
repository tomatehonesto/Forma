/* Busca uma foto para cada alimento no Wikimedia Commons e baixa em
   assets/images/alimentos/<id>.jpg.

     node scripts/buscar-fotos.mjs            # só os que ainda não têm
     node scripts/buscar-fotos.mjs --refazer  # todos de novo
     node scripts/buscar-fotos.mjs peito-frango banana   # só estes

   PELA WIKIPÉDIA, E NÃO PELA BUSCA DO COMMONS. A primeira versão
   procurava o nome direto no acervo, e deu no que dava: "peito de
   frango grelhado" trouxe a foto de uma ave chamada Sarothrura, e
   "salada de folhas" trouxe uma página de calendário asteca. Busca de
   texto em acervo de 100 milhões de arquivos casa palavra, não assunto.

   A Wikipédia em português resolve isso de graça: o artigo "Arroz" tem
   UMA foto principal, escolhida por gente, e ela é de arroz. O script
   procura o artigo, pega a imagem principal dele e só então vai ao
   Commons buscar a licença daquele arquivo — que continua sendo o
   Commons quem guarda.

   POR QUE O COMMONS PARA A LICENÇA. É o único banco grande com API
   aberta, sem chave, e com a licença de cada arquivo legível por
   máquina — o que permite gerar o arquivo de créditos junto, na mesma
   passada, em vez de prometer que depois alguém anota.

   O PEXELS VEM PRIMEIRO, QUANDO HÁ CHAVE. Ele é banco de fotografia:
   as imagens são de comida posta no prato, com luz, e não a foto de
   documentação que a Wikipédia usa para explicar o que é um alimento.
   Para uma tela que existe para ser bonita, a diferença é o assunto
   inteiro.

   Ele precisa de PEXELS_KEY no ambiente — ver .env.example. Sem a
   chave, o script cai na Wikipédia e continua funcionando.

   E o Pexels é indexado em INGLÊS. "Peito de frango grelhado" não acha
   nada; "grilled chicken breast" acha. A tradução está logo abaixo, em
   dicionário de palavra por palavra: o que ele não conhece passa
   inteiro, porque "carbonara", "sushi" e "falafel" já são o termo.

   A LICENÇA VEM JUNTO. Cada download grava autor, licença e a página de
   origem em CREDITOS.txt. Arquivo sem licença legível é PULADO: é
   melhor a tela cair no painel de cor do que carregar uma imagem cuja
   permissão ninguém consegue mostrar.

   E A FOTO PODE ESTAR ERRADA. Busca por nome acerta "Banana" e erra
   "Baião de dois"; o script não sabe olhar. O CREDITOS.txt sai com o
   título do arquivo de origem justamente para poder conferir depois,
   e apagar um .jpg é o bastante para desfazer. */
import fs from 'node:fs';
import path from 'node:path';

const PASTA = 'assets/images/alimentos';
const LARGURA = 640;
/* A Wikimedia pede um User-Agent que diga QUEM está batendo e como
   falar com ele, e devolve "You are making too many requests" para
   quem não diz. Ponha um e-mail real aqui antes de rodar a lista
   inteira — sem isso o script é barrado depois de algumas dezenas. */
const UA = process.env.WIKI_UA
  || 'MorphiApp/1.0 (+coloque-um-email-de-contato-aqui)';

/* Um pedido por segundo. Parece devagar, e é: 224 alimentos levam uns
   oito minutos. A alternativa é ser barrado no meio e não saber quais
   dos duzentos ficaram sem foto. */
const PAUSA = 1000;
const API = 'https://commons.wikimedia.org/w/api.php';
const WIKI = 'https://pt.wikipedia.org/w/api.php';
const PEXELS = 'https://api.pexels.com/v1/search';
const CHAVE = process.env.PEXELS_KEY || '';

/* PORTUGUÊS → INGLÊS, palavra por palavra.

   Não é tradução de texto, é vocabulário de cardápio: o que interessa é
   que "frango" vire "chicken" e "grelhado" vire "grilled". Palavra que
   não está aqui passa inteira — e passa de propósito, porque nome de
   prato costuma já ser o termo internacional. */
const EN = {
  // aves, carnes e porco
  frango: 'chicken', peito: 'breast', coxa: 'thigh', sobrecoxa: 'thigh',
  carne: 'beef', bife: 'steak', patinho: 'beef', contra: '', 'contra-filé': 'sirloin',
  file: 'fillet', filé: 'fillet', mignon: 'mignon', picanha: 'picanha',
  moída: 'ground beef', moida: 'ground beef', panela: 'stew', músculo: 'beef stew',
  hambúrguer: 'hamburger', linguiça: 'sausage', lombo: 'pork loin', pernil: 'roast pork',
  costelinha: 'pork ribs', costela: 'ribs', almôndegas: 'meatballs', almôndega: 'meatball',
  fígado: 'liver', peru: 'turkey', quibe: 'kibbeh', presunto: 'ham',
  mortadela: 'mortadella', porco: 'pork', acebolado: 'with onions',
  'coxão': 'beef', mole: '', salsicha: 'sausage',
  // peixes
  salmão: 'salmon', merluza: 'hake', pescada: 'white fish', sardinha: 'sardines',
  atum: 'tuna', bacalhau: 'codfish', corvina: 'fish', manjuba: 'fried fish',
  camarão: 'shrimp', peixe: 'fish', lata: 'canned',
  // ovos e laticínios
  ovo: 'egg', ovos: 'eggs', codorna: 'quail', clara: 'egg white', claras: 'egg whites',
  omelete: 'omelette', iogurte: 'yogurt', queijo: 'cheese', mussarela: 'mozzarella',
  parmesão: 'parmesan', ricota: 'ricotta', requeijão: 'cream cheese', leite: 'milk',
  achocolatado: 'chocolate milk', whey: 'whey protein', cottage: 'cottage cheese',
  minas: 'white cheese', prato: '', frescal: 'fresh',
  // grãos, massas e pães
  arroz: 'rice', integral: 'brown', feijão: 'beans', preto: 'black', carioca: 'pinto',
  lentilha: 'lentils', grão: 'chickpeas', bico: '', ervilha: 'peas', tofu: 'tofu',
  macarrão: 'pasta', pão: 'bread', aveia: 'oats', flocos: '', tapioca: 'tapioca',
  cuscuz: 'couscous', farofa: 'farofa', granola: 'granola', torrada: 'toast',
  biscoito: 'cracker', bolo: 'cake', pipoca: 'popcorn', cereal: 'cereal',
  forma: 'sliced', francês: 'french', sovado: 'sweet', tropeiro: 'tropeiro beans',
  baião: 'rice and beans', dois: '',
  // verduras, legumes e frutas
  salada: 'salad', folhas: 'greens', alface: 'lettuce', tomate: 'tomato',
  brócolis: 'broccoli', cenoura: 'carrot', beterraba: 'beetroot', couve: 'kale',
  'couve-flor': 'cauliflower', espinafre: 'spinach', abóbora: 'pumpkin',
  chuchu: 'chayote', vagem: 'green beans', quiabo: 'okra', repolho: 'cabbage',
  pepino: 'cucumber', mandioca: 'cassava', batata: 'potato', doce: 'sweet',
  milho: 'corn', legumes: 'vegetables', palmito: 'heart of palm',
  pimentão: 'bell pepper', banana: 'banana', maçã: 'apple', abacate: 'avocado',
  abacaxi: 'pineapple', goiaba: 'guava', laranja: 'orange', mamão: 'papaya',
  manga: 'mango', melancia: 'watermelon', morango: 'strawberry', uva: 'grapes',
  // castanhas
  castanha: 'cashew nuts', caju: 'cashew', pará: 'brazil nuts', amendoim: 'peanuts',
  amêndoas: 'almonds', pasta: 'butter', paçoca: 'peanut candy',
  // preparo
  grelhado: 'grilled', grelhada: 'grilled', assado: 'roasted', assada: 'roasted',
  cozido: 'boiled', cozida: 'cooked', frito: 'fried', frita: 'fries',
  mexido: 'scrambled', refogado: 'sauteed', vapor: 'steamed', milanesa: 'breaded',
  natural: '', branco: 'white', branca: 'white', verde: 'green', suco: 'juice',
  copo: '', unidade: '', porção: '', barra: 'bar', proteína: 'protein',
  // pratos
  feijoada: 'feijoada', estrogonofe: 'stroganoff', lasanha: 'lasagna',
  nhoque: 'gnocchi', risoto: 'risotto', sanduíche: 'sandwich', sopa: 'soup',
  canja: 'chicken soup', moqueca: 'fish stew', panqueca: 'pancake',
  escondidinho: 'shepherds pie', torta: 'pie', empada: 'pie', coxinha: 'coxinha',
  pastel: 'fried pastry', croquete: 'croquette', esfiha: 'meat pie',
  parmegiana: 'parmigiana', galinhada: 'chicken and rice', yakisoba: 'yakisoba',
  salpicão: 'chicken salad', tabule: 'tabbouleh', vatapá: 'vatapa',
  acarajé: 'acaraje', crepe: 'crepe', lámen: 'ramen', guioza: 'gyoza',
  temaki: 'temaki', poke: 'poke bowl', xadrez: 'stir fry', espetinho: 'skewer',
  grego: 'greek', kebab: 'kebab', shawarma: 'shawarma', homus: 'hummus',
  falafel: 'falafel', quesadilla: 'quesadilla', burrito: 'burrito', taco: 'taco',
  chili: 'chili', guacamole: 'guacamole', nachos: 'nachos', paella: 'paella',
  tortilha: 'spanish omelette', quiche: 'quiche', wrap: 'wrap', ceviche: 'ceviche',
  bibimbap: 'bibimbap', shakshuka: 'shakshuka', waffle: 'waffle',
  croissant: 'croissant', bagel: 'bagel', smoothie: 'smoothie', crepioca: 'tapioca crepe',
  mingau: 'porridge', vitamina: 'smoothie', açaí: 'acai bowl', tigela: 'bowl',
  misto: 'grilled cheese', quente: '', americana: '', americanas: '',
};
const LIGACAO = new Set(['de', 'da', 'do', 'dos', 'das', 'com', 'e', 'ao', 'à', 'a', 'o', 'em', 'no', 'na', 'sem', 'tipo', 'por']);

function paraIngles(nome) {
  const partes = nome
    .toLowerCase()
    .replace(/[(),]/g, ' ')
    .split(/[\s]+/)
    .filter(Boolean)
    .filter((w) => !LIGACAO.has(w))
    .map((w) => (w in EN ? EN[w] : w))
    .filter(Boolean);
  return [...new Set(partes.join(' ').split(' '))].join(' ').trim();
}

/* Uma foto no Pexels. Devolve no mesmo formato do resto do script para
   o CREDITOS.txt não precisar saber de onde veio. */
async function noPexels(termo) {
  if (!CHAVE) return null;
  const u = new URL(PEXELS);
  u.search = new URLSearchParams({
    query: termo, per_page: '3', orientation: 'landscape', size: 'medium',
  }).toString();
  const r = await pega(u, { Authorization: CHAVE, 'User-Agent': UA });
  if (!r.ok) return null;
  const j = await r.json();
  const foto = (j.photos || [])[0];
  if (!foto) return null;
  return {
    url: foto.src.large || foto.src.medium,
    titulo: foto.alt || termo,
    autor: foto.photographer,
    pagina: foto.url,
    /* A licença do Pexels dispensa atribuição, e o CREDITOS.txt registra
       o fotógrafo mesmo assim: é o mínimo, e é o que permite conferir
       depois de onde cada imagem saiu. */
    lic: 'Pexels License',
  };
}

const args = process.argv.slice(2);
const refazer = args.includes('--refazer');
const sos = args.filter((a) => !a.startsWith('--'));

/* Os alimentos, lidos do arquivo gerado. */
const fonte = fs.readFileSync('src/logic/alimentos.ts', 'utf8');
const ALIMENTOS = [...fonte.matchAll(/\{ id: '([^']+)', nome: '([^']+)', busca: '([^']+)'/g)]
  .map((m) => ({ id: m[1], nome: m[2].replace(/\\'/g, "'"), busca: m[3] }));

fs.mkdirSync(PASTA, { recursive: true });

const dorme = (ms) => new Promise((r) => setTimeout(r, ms));

/* Uma tentativa só não basta: a PRIMEIRA conexão do processo estoura o
   tempo com frequência — o túnel ainda está frio — e as seguintes
   passam em menos de um segundo. Sem isto o script morria na primeira
   busca e não baixava nada. */
async function pega(url, headers) {
  let erro;
  for (let i = 0; i < 4; i++) {
    try {
      return await fetch(url, { headers });
    } catch (e) {
      erro = e;
      await dorme(500 * (i + 1));
    }
  }
  throw erro;
}

/* O termo de busca: o nome, sem o que ele tem de preparo. "Peito de
   frango grelhado" acha mais como "frango grelhado" do que inteiro, e
   "Bife de patinho grelhado" acha melhor como "bife". */
function termos(a) {
  const nome = a.nome;
  const curto = nome.split(/[,(]/)[0].trim();
  const duasPalavras = curto.split(' ').filter((p) => p.length > 3).slice(0, 2).join(' ');
  const primeira = a.busca.split(' ')[0];
  return [...new Set([curto, duasPalavras, primeira].filter((t) => t && t.length > 2))];
}

/* O nome do arquivo que ilustra o artigo da Wikipédia em português. */
async function imagemDoArtigo(termo) {
  const u = new URL(WIKI);
  u.search = new URLSearchParams({
    action: 'query', format: 'json',
    generator: 'search',
    gsrsearch: termo,
    gsrlimit: '3',
    gsrnamespace: '0',
    prop: 'pageimages',
    piprop: 'name',
  }).toString();
  const r = await pega(u, { 'User-Agent': UA });
  if (!r.ok) return null;
  const j = await r.json();
  const pags = Object.values(j?.query?.pages || {})
    .sort((a, b) => (a.index || 9) - (b.index || 9));
  for (const pg of pags) {
    if (pg.pageimage) return { arquivo: pg.pageimage, artigo: pg.title };
  }
  return null;
}

/* A ficha daquele arquivo no Commons: url do recorte, tipo e licença. */
async function fichaNoCommons(arquivo) {
  const u = new URL(API);
  u.search = new URLSearchParams({
    action: 'query', format: 'json',
    titles: 'File:' + arquivo,
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|mime',
    iiurlwidth: String(LARGURA),
  }).toString();
  const r = await pega(u, { 'User-Agent': UA });
  if (!r.ok) return null;
  const j = await r.json();
  return Object.values(j?.query?.pages || {})[0] || null;
}

/* Descarta o que não é fotografia de comida: desenho, mapa, brasão,
   logotipo, e o que não é jpg. */
const RUIM = /(logo|coat of arms|map |flag|diagram|chart|icon|svg|seal|stamp|coin|banknote|poster|book|cover|label|packaging)/i;

function serve(p) {
  const ii = p?.imageinfo?.[0];
  if (!ii || !ii.thumburl) return false;
  if (!/^image\/(jpeg|png)$/.test(ii.mime || '')) return false;
  if (RUIM.test(p.title || '')) return false;
  return true;
}

function licencaDe(ii) {
  const m = ii.extmetadata || {};
  const limpo = (v) => (v?.value || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const lic = limpo(m.LicenseShortName) || limpo(m.License);
  const autor = limpo(m.Artist) || limpo(m.Credit) || 'autor não informado';
  return { lic, autor };
}

/* Licenças que permitem uso — com atribuição, que é o que o CREDITOS.txt
   entrega. O que não casar aqui fica de fora: nome de licença que o
   script não reconhece é licença que ninguém leu. */
const LICENCA_OK = /(cc0|cc[- ]by|public domain|pdm|gfdl|attribution)/i;

/* O ARTIGO PRECISA SER DO ALIMENTO.

   A busca da Wikipédia devolve o artigo mais parecido com o texto, e
   "Salmão grelhado" trouxe "Misto-quente" — que tem grelhado no corpo e
   nada de salmão. O guarda é simples: alguma palavra de peso do nome do
   alimento tem de aparecer no título do artigo. Não pega tudo, mas pega
   justamente o erro que faz a tela mentir. */
const SEM_PESO = new Set(['de', 'da', 'do', 'com', 'e', 'ao', 'na', 'no', 'em', 'a', 'o', 'sem', 'tipo']);
const nu = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function combina(nomeAlimento, tituloArtigo) {
  const alvo = nu(tituloArtigo);
  const palavras = nu(nomeAlimento).split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !SEM_PESO.has(w));
  if (!palavras.length) return true;
  /* Radical de 4 letras: "banana" casa "bananeira", "frango" casa
     "frangos", e "salmao" não casa "misto-quente". */
  return palavras.some((w) => alvo.includes(w.slice(0, Math.min(w.length, 5))));
}

const creditos = [];
const pulados = [];
let baixadas = 0;

const alvo = sos.length ? ALIMENTOS.filter((a) => sos.includes(a.id)) : ALIMENTOS;

for (const a of alvo) {
  const destino = path.join(PASTA, a.id + '.jpg');
  if (!refazer && fs.existsSync(destino)) continue;

  let achou = null;

  /* O PEXELS PRIMEIRO. Ele responde em inglês e responde com comida
     fotografada; a Wikipédia fica de rede de segurança para o que o
     banco não tiver. */
  if (CHAVE) {
    const en = paraIngles(a.nome);
    for (const t of [en, en.split(' ').slice(0, 2).join(' ')]) {
      if (!t) continue;
      let px = null;
      try { px = await noPexels(t); } catch { px = null; }
      if (px) { achou = { pexels: px, lic: px.lic, autor: px.autor, termo: t, artigo: 'Pexels' }; break; }
      await dorme(PAUSA);
    }
  }

  for (const t of achou ? [] : termos(a)) {
    let alvoWiki = null;
    try { alvoWiki = await imagemDoArtigo(t); } catch { alvoWiki = null; }
    if (!alvoWiki || !combina(a.nome, alvoWiki.artigo)) { await dorme(PAUSA); continue; }

    let pg = null;
    try { pg = await fichaNoCommons(alvoWiki.arquivo); } catch { pg = null; }
    if (!pg || !serve(pg)) { await dorme(PAUSA); continue; }

    const ii = pg.imageinfo[0];
    const { lic, autor } = licencaDe(ii);
    if (!LICENCA_OK.test(lic)) { await dorme(PAUSA); continue; }

    if (!combina(a.nome, alvoWiki.artigo)) { await dorme(PAUSA); continue; }

    achou = { pg, ii, lic, autor, termo: t, artigo: alvoWiki.artigo };
    break;
  }

  if (!achou) { pulados.push(a.id + ' (' + a.nome + ')'); continue; }

  const urlDaFoto = achou.pexels ? achou.pexels.url : achou.ii.thumburl;
  let bin;
  try { bin = await pega(urlDaFoto, { 'User-Agent': UA }); }
  catch { pulados.push(a.id + ' (download falhou)'); continue; }
  if (!bin.ok) { pulados.push(a.id + ' (download ' + bin.status + ')'); continue; }
  fs.writeFileSync(destino, Buffer.from(await bin.arrayBuffer()));
  baixadas++;

  creditos.push(
    `${a.id}.jpg — ${a.nome}\n` +
    `  arquivo: ${achou.pexels ? achou.pexels.titulo : achou.pg.title}\n` +
    `  autor:   ${achou.autor}\n` +
    `  licença: ${achou.lic}\n` +
    `  origem:  ${achou.pexels ? achou.pexels.pagina : achou.ii.descriptionurl}\n` +
    `  buscado por: "${achou.termo}" em ${achou.pexels ? 'Pexels' : 'pt.wikipedia (' + achou.artigo + ')'}\n`,
  );

  console.log(
    `${(a.id + '                         ').slice(0, 25)} ${achou.pexels ? 'px' : 'wk'}  ` +
    `${achou.pexels ? achou.pexels.titulo : achou.pg.title.replace('File:', '')}  [${achou.lic}]`,
  );
  await dorme(PAUSA);
}

/* O arquivo de créditos é acrescentado, e não reescrito: rodar o script
   para dez alimentos não pode apagar a procedência dos outros duzentos. */
const antes = fs.existsSync(path.join(PASTA, 'CREDITOS.txt'))
  ? fs.readFileSync(path.join(PASTA, 'CREDITOS.txt'), 'utf8')
  : `CRÉDITOS DAS FOTOS

As imagens vêm do Pexels (licença Pexels, uso livre inclusive
comercial) e do Wikimedia Commons (licença que permite uso mediante
atribuição). Cada bloco abaixo diz o autor, a licença e a página de
origem do arquivo.

Gerado por scripts/buscar-fotos.mjs. Apagar um .jpg desfaz o uso
daquela imagem — a tela volta a abrir com o painel de cor.

`;
fs.writeFileSync(path.join(PASTA, 'CREDITOS.txt'), antes + creditos.join('\n'));

console.log(`\nbaixadas: ${baixadas}`);
if (pulados.length) {
  console.log(`sem foto (${pulados.length}):`);
  for (const p of pulados) console.log('  ' + p);
}
