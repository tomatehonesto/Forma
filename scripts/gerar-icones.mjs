/* ============================================================
   OS ÍCONES DAS PALETAS

   Cada paleta tem o seu ícone, e a escolha vai até a tela inicial do
   telefone. Ícone alternativo não se pinta em tempo de execução: ele é um
   arquivo que precisa estar dentro do pacote, declarado antes da
   compilação. Então todos são gerados aqui, um por paleta.

   ⚠️ ERAM VINTE E CINCO — cinco cores de ação vezes cinco de alcançado,
   quando as duas eram escolhas soltas. Com as paletas fechadas viraram
   dez: o fundo é a cor que age e a marca é a do alcançado, as duas do
   mesmo conjunto.

   O DESENHO É O MESMO DO APP. O caminho do símbolo é lido de
   src/ui/marca.tsx — o mesmo `D_SIMBOLO` que a marca usa dentro das
   telas. Redesenhar aqui seria ter duas marcas que divergem no dia em que
   uma for corrigida.

   COMO RODAR

     node scripts/gerar-icones.mjs

   Ele escreve em assets/icones/ e um plugin.json com o bloco do app.json.
   Rode de novo sempre que PALETAS mudar em src/theme.ts — e depois
   `npx expo prebuild --clean`, porque ícone alternativo entra pelo
   projeto nativo.
   ============================================================ */

import sharp from 'sharp';
import { mkdir, writeFile, readFile } from 'node:fs/promises';

const LADO = 1024;

/* O MESMO CAMINHO DA MARCA, lido do arquivo em vez de copiado: se o
   símbolo mudar em src/ui/marca.tsx, o ícone muda junto na próxima
   geração, e não fica um M velho no telefone de alguém. */
async function caminhoDoSimbolo() {
  const src = await readFile(new URL('../src/ui/marca.tsx', import.meta.url), 'utf8');
  const m = src.match(/D_SIMBOLO = '([^']+)'/);
  if (!m) throw new Error('não achei D_SIMBOLO em src/ui/marca.tsx');
  return m[1];
}

async function paletas() {
  const src = await readFile(new URL('../src/theme.ts', import.meta.url), 'utf8');
  const abre = src.indexOf('export const PALETAS: Paleta[] = [');
  if (abre < 0) throw new Error('não achei PALETAS em src/theme.ts');
  const bloco = src.slice(abre, src.indexOf('\n];', abre));
  const re = /id: '([^']+)'[\s\S]*?acaoClara: '([^']+)'[\s\S]*?alcancado: '([^']+)'/g;
  return [...bloco.matchAll(re)].map((m) => ({ id: m[1], acao: m[2], alcancado: m[3] }));
}

let CAMINHO = '';

/* O símbolo centrado no quadrado. A viewBox dele é 533×222; entra
   escalado para ocupar 56% da largura, que é onde a marca respira sem
   sumir na grade de ícones. */
function svg(fundo, marca, ocupacao) {
  const L = 533, A = 222;
  const escala = (LADO * ocupacao) / L;
  const x = (LADO - L * escala) / 2;
  const y = (LADO - A * escala) / 2;
  const corpo = `<g transform="translate(${x} ${y}) scale(${escala})"><path d="${CAMINHO}" fill="${marca}"/></g>`;
  const atras = fundo ? `<rect width="${LADO}" height="${LADO}" fill="${fundo}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${LADO}" height="${LADO}" viewBox="0 0 ${LADO} ${LADO}">${atras}${corpo}</svg>`;
}

const png = (texto) => sharp(Buffer.from(texto)).png({ compressionLevel: 9, palette: true }).toBuffer();

async function main() {
  CAMINHO = await caminhoDoSimbolo();
  const lista = await paletas();
  const dir = new URL('../assets/icones/', import.meta.url);
  await mkdir(dir, { recursive: true });

  const entradas = [];
  let bytes = 0;

  for (const p of lista) {
    const ios = await png(svg(p.acao, p.alcancado, 0.56));
    /* A camada de frente do Android é transparente — o fundo é uma cor
       declarada no plugin, e o sistema compõe os dois. E a marca encolhe:
       o recorte circular come as bordas, e o que cabe com folga é 40% da
       largura. */
    const frente = await png(svg(null, p.alcancado, 0.4));

    await writeFile(new URL(`${p.id}.png`, dir), ios);
    await writeFile(new URL(`${p.id}-frente.png`, dir), frente);
    bytes += ios.length + frente.length;

    entradas.push({
      name: p.id,
      ios: `./assets/icones/${p.id}.png`,
      android: {
        foregroundImage: `./assets/icones/${p.id}-frente.png`,
        backgroundColor: p.acao,
      },
    });
  }

  await writeFile(
    new URL('../assets/icones/plugin.json', import.meta.url),
    JSON.stringify(entradas, null, 2),
  );

  console.log(`${entradas.length} ícones · ${(bytes / 1024).toFixed(0)} KB`);
}

main().catch((e) => { console.error(e); process.exit(1); });
