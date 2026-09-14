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

   O Pexels e o Unsplash têm foto melhor, e não entram aqui porque a API
   dos dois exige chave de conta. Com uma chave em PEXELS_KEY dá para
   escrever a segunda metade deste script.

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
  for (const t of termos(a)) {
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

  let bin;
  try { bin = await pega(achou.ii.thumburl, { 'User-Agent': UA }); }
  catch { pulados.push(a.id + ' (download falhou)'); continue; }
  if (!bin.ok) { pulados.push(a.id + ' (download ' + bin.status + ')'); continue; }
  fs.writeFileSync(destino, Buffer.from(await bin.arrayBuffer()));
  baixadas++;

  creditos.push(
    `${a.id}.jpg — ${a.nome}\n` +
    `  arquivo: ${achou.pg.title}\n` +
    `  autor:   ${achou.autor}\n` +
    `  licença: ${achou.lic}\n` +
    `  origem:  ${achou.ii.descriptionurl}\n` +
    `  artigo:  ${achou.artigo} (pt.wikipedia, buscado por "${achou.termo}")\n`,
  );

  console.log(`${a.id}  ←  ${achou.artigo}  ·  ${achou.pg.title.replace('File:', '')}  [${achou.lic}]`);
  await dorme(PAUSA);
}

/* O arquivo de créditos é acrescentado, e não reescrito: rodar o script
   para dez alimentos não pode apagar a procedência dos outros duzentos. */
const antes = fs.existsSync(path.join(PASTA, 'CREDITOS.txt'))
  ? fs.readFileSync(path.join(PASTA, 'CREDITOS.txt'), 'utf8')
  : `CRÉDITOS DAS FOTOS

As imagens vêm do Wikimedia Commons, com licença que permite uso
mediante atribuição. Cada bloco abaixo diz o autor, a licença e a
página de origem do arquivo.

Gerado por scripts/buscar-fotos.mjs. Apagar um .jpg desfaz o uso
daquela imagem — a tela volta a abrir com o painel de cor.

`;
fs.writeFileSync(path.join(PASTA, 'CREDITOS.txt'), antes + creditos.join('\n'));

console.log(`\nbaixadas: ${baixadas}`);
if (pulados.length) {
  console.log(`sem foto (${pulados.length}):`);
  for (const p of pulados) console.log('  ' + p);
}
