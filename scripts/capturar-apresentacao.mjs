/* ============================================================
   AS TELAS DA APRESENTAÇÃO — fotografadas do aplicativo de verdade

     (com o servidor de desenvolvimento no ar, em 127.0.0.1:8081)
     node scripts/capturar-apresentacao.mjs

   A apresentação de quem chega ("como podemos ajudar", app/apresentacao)
   mostra, dentro de um telefone, a tela real de cada pilar — e não uma
   tela inventada (pedido do dono, 28/09/2026). Este script abre o
   aplicativo na web com o DIÁRIO DE EXEMPLO (a Mariana, a semente de
   desenvolvimento: dado de ilustração, de ninguém), em cada um dos seis
   idiomas, e fotografa o alto da tela de cada pilar.

   Grava em assets/apresentacao, já em WebP, e escreve o mapa
   src/ui/telasDaApresentacao.ts, com um `require` por imagem — o
   empacotador precisa do caminho escrito.

   ⚠️ RODE DE NOVO QUANDO UMA DESSAS TELAS MUDAR. A foto é da tela de
   hoje; o script existe para ela não envelhecer esquecida.

   ⚠️ SÓ O TEMA CLARO E A PALETA ORIGINAL. O telefone da apresentação
   mostra a foto clara também no tema escuro — é uma foto de tela, como a
   de uma loja de aplicativos.

   Precisa do Playwright com o Chromium (devDependency; o navegador se
   instala com `npx playwright install chromium`).
   ============================================================ */

import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = process.env.BASE ?? 'http://127.0.0.1:8081';
const IDIOMAS = ['pt-BR', 'en-US', 'es-419', 'fr-FR', 'de-DE', 'it-IT'];
/* O pilar e a tela real dele. */
const TELAS = [
  ['dose', '/aplicacoes'],
  ['estado', '/sintomas'],
  ['comida', '/alimentacao'],
  ['evolucao', '/evolucao'],
  ['consultas', '/resumo-medico'],
  ['companheiro', '/insights'],
];
/* O telefone de iPhone comum, e só o alto da tela: é o que o aparelho da
   apresentação mostra antes de sumir no fundo. */
const LARGURA = 390, ALTURA = 844, ALTO = 700;
const SAIDA = 540;
/* O LUGAR DA BARRA DE ESTADO, em pontos. Na web a tela começa colada no
   alto, e no telefone da apresentação há a ilha em cima. Esta faixa é
   acrescentada ao alto da foto, continuando a própria borda de cima dela,
   borrada: numa tela clara é o fundo claro; numa que abre com foto ou
   degradê (Alimentação, Insights), é a foto ou o degradê seguindo — sem a
   faixa branca de antes (pedido do dono). */
const TOPO = 30;
const ESCALA = 2;

const pasta = new URL('../assets/apresentacao/', import.meta.url);
await mkdir(pasta, { recursive: true });

const navegador = await chromium.launch();
let bytes = 0;
try {
  for (const idioma of IDIOMAS) {
    const contexto = await navegador.newContext({
      viewport: { width: LARGURA, height: ALTURA }, deviceScaleFactor: ESCALA, colorScheme: 'light',
    });
    const pagina = await contexto.newPage();
    /* A primeira abertura cria o diário de exemplo; depois o idioma entra
       nele, como a folha de Idioma faria. */
    await pagina.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await pagina.waitForFunction(() => !!localStorage.getItem('norte.v1'), null, { timeout: 60000 });
    await pagina.evaluate((l) => {
      const S = JSON.parse(localStorage.getItem('norte.v1'));
      if (!S.semente) throw new Error('o diário desta origem não é o de exemplo');
      S.profile.idioma = l;
      localStorage.setItem('norte.v1', JSON.stringify(S));
    }, idioma);

    for (const [pilar, rota] of TELAS) {
      await pagina.goto(`${BASE}${rota}`, { waitUntil: 'networkidle' });
      await pagina.waitForTimeout(1800);
      const aqui = new URL(pagina.url()).pathname;
      if (aqui !== rota) throw new Error(`${idioma} ${pilar}: esperava ${rota}, ficou em ${aqui}`);
      const png = await pagina.screenshot({ clip: { x: 0, y: 0, width: LARGURA, height: ALTO } });
      const comTopo = await sharp(png).extend({ top: TOPO * ESCALA, extendWith: 'copy' }).png().toBuffer();
      const faixa = await sharp(comTopo).extract({ left: 0, top: 0, width: LARGURA * ESCALA, height: TOPO * ESCALA + 12 }).blur(10).png().toBuffer();
      /* compõe antes e reduz depois: o sharp reduz antes de compor, e a faixa
         no tamanho cheio não caberia na foto já reduzida */
      const composta = await sharp(comTopo).composite([{ input: faixa, top: 0, left: 0 }]).png().toBuffer();
      const tela = await sharp(composta).resize({ width: SAIDA }).webp({ quality: 82 }).toBuffer();
      await writeFile(new URL(`${pilar}-${idioma}.webp`, pasta), tela);
      bytes += tela.length;
      console.log(`  ${idioma.padEnd(6)} ${pilar.padEnd(12)} ${rota}`);
    }
    await contexto.close();
  }
} finally {
  await navegador.close();
}

/* o mapa — um require por imagem */
const pilarDoIdioma = (l) => TELAS.map(([p]) =>
  `    ${p}: require('../../assets/apresentacao/${p}-${l}.webp'),`).join('\n');
const mapa = [
  `/* GERADO por scripts/capturar-apresentacao.mjs — não edite à mão.`,
  `   As fotos das telas reais para a apresentação (app/apresentacao), por`,
  `   idioma e por pilar: o alto da tela. Rode o script de novo quando uma`,
  `   dessas telas mudar. */`,
  ``,
  `export type PilarDaApresentacao = ${TELAS.map(([p]) => `'${p}'`).join(' | ')};`,
  ``,
  `/** o tamanho da foto da tela, em pontos: a largura do telefone e o alto que ela cobre */`,
  `export const LARGURA_DA_FOTO = ${LARGURA};`,
  `export const ALTO_DA_FOTO = ${ALTO + TOPO};`,
  ``,
  `export const TELAS_DA_APRESENTACAO: Record<string, Record<PilarDaApresentacao, number>> = {`,
  ...IDIOMAS.map((l) => `  '${l}': {\n${pilarDoIdioma(l)}\n  },`),
  `};`,
  ``,
].join('\n');
await writeFile(new URL('../src/ui/telasDaApresentacao.ts', import.meta.url), mapa);
console.log(`\n${IDIOMAS.length * TELAS.length} telas · ${(bytes / 1024 / 1024).toFixed(2)} MB`);
