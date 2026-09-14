/* Reduz as fotos de assets/images/alimentos/ para o tamanho em que elas
   realmente aparecem.

     node scripts/enxugar-fotos.mjs

   POR QUE. O banco entrega a foto no tamanho dele — algumas vieram com
   940 px e quase um megabyte —, e na tela de consulta a imagem ocupa a
   largura do aparelho, com um véu escuro por cima e texto em cima dele.
   Carregar 900 KB para desenhar isso é peso de instalação que ninguém
   vê: são 23 MB de bundle que viram uns 6.

   720 px de largura cobre um telefone de 390 pt em densidade 2× com
   folga, e 3× numa imagem já escurecida não se distingue. Qualidade 72
   é o ponto em que o JPEG para de melhorar aos olhos numa foto que vai
   ficar atrás de um degradê preto.

   Roda em cima dos arquivos, e é idempotente: quem já está pequeno é
   deixado em paz. */
import fs from 'node:fs';
import path from 'node:path';
import Jimp from 'jimp-compact';

const PASTA = 'assets/images/alimentos';
const LARGURA = 720;
const QUALIDADE = 72;

const arquivos = fs.readdirSync(PASTA).filter((n) => /\.jpe?g$/i.test(n)).sort();
let antes = 0, depois = 0, mexidos = 0;

for (const nome of arquivos) {
  const caminho = path.join(PASTA, nome);
  const tamanhoAntes = fs.statSync(caminho).size;
  antes += tamanhoAntes;

  try {
    const img = await Jimp.read(caminho);
    const precisa = img.bitmap.width > LARGURA || tamanhoAntes > 150 * 1024;
    if (!precisa) { depois += tamanhoAntes; continue; }

    if (img.bitmap.width > LARGURA) img.resize(LARGURA, Jimp.AUTO);
    img.quality(QUALIDADE);
    await img.writeAsync(caminho);

    const tamanhoDepois = fs.statSync(caminho).size;
    depois += tamanhoDepois;
    mexidos++;
    console.log(
      `${(nome + '                          ').slice(0, 26)}` +
      `${Math.round(tamanhoAntes / 1024)} KB → ${Math.round(tamanhoDepois / 1024)} KB`,
    );
  } catch (e) {
    depois += tamanhoAntes;
    console.log(`${nome}: não deu para abrir (${e.message})`);
  }
}

const mb = (b) => (b / 1024 / 1024).toFixed(1);
console.log(`\n${mexidos} de ${arquivos.length} redimensionadas`);
console.log(`total: ${mb(antes)} MB → ${mb(depois)} MB`);
