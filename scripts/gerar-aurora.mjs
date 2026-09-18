/* ============================================================
   AS AURORAS DAS PALETAS

   A aurora é a maior superfície de cor do aplicativo: ela é o fundo do
   hero da Home, da tela de check-in concluído, do Insights, do companion
   e das metas. Uma paleta que trocasse tudo menos ela trocaria tudo menos
   a primeira coisa que alguém vê ao abrir.

   E ela é IMAGEM — um gradiente borrado, não um degradê de duas cores —,
   então não dá para repintá-la com um token. O que dá é girar o matiz do
   arquivo original, que é azul, até a cor da paleta. Aqui, uma vez, antes
   da compilação: girar em tempo de execução seria processar dois megabytes
   de pixel a cada abertura.

   POR QUE WEBP. Os dois PNG originais somam 3,2 MB. Dez paletas em PNG
   dariam trinta e dois megabytes — inviável. A aurora é um borrão suave,
   que é o caso em que o WebP ganha mais: os vinte arquivos somam cerca de
   1,4 MB, menos da metade do que os dois PNG custavam. `expo-image`, que
   é quem desenha todos eles, lê WebP nos dois sistemas.

   COMO RODAR

     node scripts/gerar-aurora.mjs

   Rode de novo sempre que PALETAS mudar em src/theme.ts, ou quando um dos
   arquivos originais for substituído.
   ============================================================ */

import sharp from 'sharp';
import { mkdir, writeFile, readFile } from 'node:fs/promises';

/* Qualidade alta de propósito: a aurora ocupa a tela inteira atrás de
   texto branco, e artefato de compressão em gradiente aparece como
   faixas. 86 é onde elas somem sem o arquivo dobrar. */
const QUALIDADE = 86;

const FONTES = [
  { de: 'aurora-hero.png', para: 'hero' },
  { de: 'aurora-insights.png', para: 'insights' },
];

async function paletas() {
  const src = await readFile(new URL('../src/theme.ts', import.meta.url), 'utf8');
  const abre = src.indexOf('export const PALETAS: Paleta[] = [');
  if (abre < 0) throw new Error('não achei PALETAS em src/theme.ts');
  const bloco = src.slice(abre, src.indexOf('\n];', abre));
  return [...bloco.matchAll(/id: '([^']+)'[\s\S]*?auroraHue: (-?[\d.]+), auroraSat: ([\d.]+)/g)]
    .map((m) => ({ id: m[1], hue: Number(m[2]), sat: Number(m[3]) }));
}

async function main() {
  const lista = await paletas();
  const dir = new URL('../assets/auroras/', import.meta.url);
  await mkdir(dir, { recursive: true });

  let bytes = 0;
  for (const p of lista) {
    for (const f of FONTES) {
      /* Sharp lê caminho ou buffer, e não URL — no Windows um file:// vira
         uma string que ele tenta abrir literalmente. */
      const entrada = await readFile(new URL(`../assets/images/${f.de}`, import.meta.url));
      const b = await sharp(entrada)
        /* `modulate` gira o matiz e multiplica a saturação em cima da
           imagem inteira, que é o que preserva a forma do borrão: qualquer
           recolorização por máscara perderia o desenho. */
        .modulate({ hue: p.hue, saturation: p.sat })
        .webp({ quality: QUALIDADE })
        .toBuffer();
      await writeFile(new URL(`${f.para}-${p.id}.webp`, dir), b);
      bytes += b.length;
    }
  }

  console.log(`${lista.length * FONTES.length} auroras · ${(bytes / 1024 / 1024).toFixed(2)} MB`);
}

main().catch((e) => { console.error(e); process.exit(1); });
