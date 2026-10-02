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

   ⚠️ E ELE NÃO GERA NADA SE AS PALETAS NÃO PASSAREM NA TRAVA (02/10/2026).
   scripts/paletas.ts roda primeiro, e uma falha para tudo antes do
   primeiro arquivo. Depois de gerar, ela roda de novo com --aurora: a
   forte sobre a imagem (R7) só se mede com a imagem pronta, e esta é a
   hora em que ela fica pronta.
   ============================================================ */

import sharp from 'sharp';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/* A trava é TypeScript, porque importa os tokens de verdade de
   src/theme.ts; daqui ela roda pelo tsx, como as outras sondas. A linha
   vai inteira para o shell, sem lista de argumentos: no Windows o npx é
   um .cmd, e .cmd só roda por shell. */
function travaDasPaletas(...extra) {
  const r = spawnSync(
    ['npx tsx --tsconfig scripts/tsconfig.json scripts/paletas.ts', ...extra].join(' '),
    { cwd: fileURLToPath(new URL('..', import.meta.url)), stdio: 'inherit', shell: true },
  );
  return r.status === 0;
}

/* Qualidade alta de propósito: a aurora ocupa a tela inteira atrás de
   texto branco, e artefato de compressão em gradiente aparece como
   faixas. 86 é onde elas somem sem o arquivo dobrar. */
const QUALIDADE = 86;

const FONTES = [
  { de: 'aurora-hero.png', para: 'hero' },
  { de: 'aurora-insights.png', para: 'insights' },
  /* ⚠️ AS AURORAS DAS OUTRAS TELAS (27/09/2026, enviadas pelo dono): a
     Home tinha a dela, e todo o resto repetia a mesma. Cada tela ganha a
     sua em ui/aurora. `largura` reduz o original, que veio maior do que
     qualquer tela precisa — um borrão não perde nada, e o pacote agradece. */
  { de: 'aurora-onda.png', para: 'onda', largura: 828 },
  { de: 'aurora-corrente.png', para: 'corrente', largura: 828 },
  { de: 'aurora-raio.png', para: 'raio', largura: 828 },
  { de: 'aurora-nuvem.png', para: 'nuvem', largura: 828 },
  { de: 'aurora-veu.png', para: 'veu', largura: 828 },
  /* A capa da conta: a aurora que termina em branco, no claro, e a que
     termina em preto, no escuro. O giro de matiz não mexe no branco nem
     no preto — só na luz. */
  { de: 'aurora-conta-claro.png', para: 'conta-claro', largura: 828 },
  { de: 'aurora-conta-escuro.png', para: 'conta-escuro', largura: 828 },
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
  if (!travaDasPaletas()) {
    console.error('\n  ⚠️  As paletas não passaram em scripts/paletas.ts. Nenhuma aurora foi gerada.\n');
    process.exit(1);
  }

  const lista = await paletas();
  const dir = new URL('../assets/auroras/', import.meta.url);
  await mkdir(dir, { recursive: true });

  let bytes = 0;
  for (const p of lista) {
    for (const f of FONTES) {
      /* Sharp lê caminho ou buffer, e não URL — no Windows um file:// vira
         uma string que ele tenta abrir literalmente. */
      const entrada = await readFile(new URL(`../assets/images/${f.de}`, import.meta.url));
      const b = await (f.largura ? sharp(entrada).resize({ width: f.largura }) : sharp(entrada))
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

  if (!travaDasPaletas('--aurora')) {
    console.error('\n  ⚠️  As auroras foram gravadas, mas a forte não lê sobre elas (R7). Não publique estas imagens.\n');
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
