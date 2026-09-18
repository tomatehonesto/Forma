/* ============================================================
   OS ÍCONES DAS PALETAS

   O aplicativo deixa escolher a cor de ação e a cor de destaque, e a
   escolha vai até o ícone na tela inicial do telefone. Ícone alternativo
   não se pinta em tempo de execução: ele é um arquivo que precisa estar
   dentro do pacote, declarado antes da compilação. Então são todos
   gerados aqui, um por combinação.

   O DESENHO É O MESMO DO APP. O caminho do símbolo é copiado de
   src/ui/marca.tsx — o mesmo `D_SIMBOLO` que a marca usa dentro das
   telas. Redesenhar aqui seria ter duas marcas que divergem no dia em
   que uma for corrigida.

   COMO RODAR

     node scripts/gerar-icones.mjs

   Ele escreve em assets/icones/ e imprime o bloco do app.json para
   colar no plugin. Rode de novo sempre que CORES ou DESTAQUES mudarem
   em src/theme.ts — e depois `npx expo prebuild --clean`, porque ícone
   alternativo entra pelo projeto nativo.
   ============================================================ */

import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';

const LADO = 1024;
/* O Android recorta o ícone em máscaras diferentes — círculo, quadrado
   redondo, gota. A camada de frente precisa caber no círculo seguro, que
   é 66% do lado; por isso a marca ocupa menos espaço lá do que no iOS. */
const LADO_ANDROID = 1024;

/* O MESMO CAMINHO DA MARCA, lido do arquivo em vez de copiado: se o
   símbolo mudar em src/ui/marca.tsx, o ícone muda junto na próxima
   geração, e não fica um M velho no telefone de alguém. */
async function caminhoDoSimbolo() {
  const src = await readFile(new URL('../src/ui/marca.tsx', import.meta.url), 'utf8');
  const m = src.match(/const D_SIMBOLO = '([^']+)'/);
  if (!m) throw new Error('não achei D_SIMBOLO em src/ui/marca.tsx');
  return m[1];
}

async function cores() {
  const src = await readFile(new URL('../src/theme.ts', import.meta.url), 'utf8');
  const lista = (nome) => {
    const abre = src.indexOf(`export const ${nome}: `);
    if (abre < 0) throw new Error(`não achei ${nome} em src/theme.ts`);
    const ini = src.indexOf('[', abre);
    const fim = src.indexOf('\n];', ini);
    const bloco = [null, src.slice(ini, fim)];
    return [...bloco[1].matchAll(/\{[^}]*id: '([^']+)'[^}]*claro: '([^']+)'[^}]*\}/g)]
      .map((x) => ({ id: x[1], claro: x[2] }));
  };
  return { bases: lista('CORES'), destaques: lista('DESTAQUES') };
}

/* O SÍMBOLO CENTRADO NO QUADRADO, com a mesma folga em volta que o ícone
   atual tem. A viewBox do símbolo é 533×222; ele entra escalado para
   ocupar 56% da largura, que é onde a marca respira sem sumir na grade
   de ícones. */
function svg(fundo, marca, lado, ocupacao) {
  const L = 533, A = 222;
  const escala = (lado * ocupacao) / L;
  const x = (lado - L * escala) / 2;
  const y = (lado - A * escala) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 ${lado} ${lado}">
  <rect width="${lado}" height="${lado}" fill="${fundo}"/>
  <g transform="translate(${x} ${y}) scale(${escala})"><path d="${CAMINHO}" fill="${marca}"/></g>
</svg>`;
}

/* A camada de frente do Android é transparente: o fundo é uma cor
   declarada no plugin, e o sistema é que compõe os dois. */
function svgFrente(marca, lado, ocupacao) {
  const L = 533, A = 222;
  const escala = (lado * ocupacao) / L;
  const x = (lado - L * escala) / 2;
  const y = (lado - A * escala) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 ${lado} ${lado}">
  <g transform="translate(${x} ${y}) scale(${escala})"><path d="${CAMINHO}" fill="${marca}"/></g>
</svg>`;
}

let CAMINHO = '';

const png = (texto) => sharp(Buffer.from(texto)).png({ compressionLevel: 9, palette: true }).toBuffer();

async function main() {
  CAMINHO = await caminhoDoSimbolo();
  const { bases, destaques } = await cores();
  const dir = new URL('../assets/icones/', import.meta.url);
  await mkdir(dir, { recursive: true });

  const entradas = [];
  let bytes = 0;

  for (const b of bases) {
    for (const d of destaques) {
      const nome = `${b.id}-${d.id}`;
      const ios = await png(svg(b.claro, d.claro, LADO, 0.56));
      /* No Android a marca encolhe: o recorte circular come as bordas, e
         o que cabe com folga é 40% da largura. */
      const frente = await png(svgFrente(d.claro, LADO_ANDROID, 0.4));
      await writeFile(new URL(`${nome}.png`, dir), ios);
      await writeFile(new URL(`${nome}-frente.png`, dir), frente);
      bytes += ios.length + frente.length;
      entradas.push({
        name: nome,
        ios: `./assets/icones/${nome}.png`,
        android: {
          foregroundImage: `./assets/icones/${nome}-frente.png`,
          backgroundColor: b.claro,
        },
      });
    }
  }

  await writeFile(
    new URL('../assets/icones/plugin.json', import.meta.url),
    JSON.stringify(entradas, null, 2),
  );

  console.log(`${entradas.length} ícones · ${(bytes / 1024).toFixed(0)} KB`);
  console.log('bloco do plugin em assets/icones/plugin.json');
}

main().catch((e) => { console.error(e); process.exit(1); });
