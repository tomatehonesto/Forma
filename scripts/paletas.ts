/* ============================================================
   A TRAVA DAS PALETAS — "sóbria + forte" como regra que se confere

     npx tsx --tsconfig scripts/tsconfig.json scripts/paletas.ts
     npx tsx --tsconfig scripts/tsconfig.json scripts/paletas.ts --aurora
     npx tsx --tsconfig scripts/tsconfig.json scripts/paletas.ts --tudo

   `--aurora` mede também a forte sobre as auroras publicadas (com sharp),
   e `--tudo` imprime as linhas que passaram, e não só as que falharam.

   ⚠️⚠️ AS PALETAS FORAM JULGADAS NO OLHO, E O OLHO ERROU EM DOIS LUGARES
   (02/10/2026). Em 18/09 elas eram doze e caíram para cinco por vizinhança
   de matiz — dois azuis parecidos são trabalho, não escolha. Contraste não
   entrou na conversa, e estava lá: a Menta tinha a ação clara demais e a
   forte escura demais, a Sálvia punha a forte em cima de uma sóbria quase
   do mesmo tom, e o coral do Índigo sumia sobre a aurora. E nas cinco que
   ficaram, o modo escuro pintava o painel da Jornada, o "+" e o avatar
   com a cor de ação CLARA, debaixo de texto branco: 1,74:1 na Floresta.
   Ninguém viu porque a escolha se faz olhando a prévia, e a prévia é uma
   tela clara.

   O QUE A ORIGINAL ENSINA, E QUE AGORA É REGRA. Toda paleta são duas
   cores com trabalhos opostos:

     SÓBRIA  (acaoClara)  escura o bastante para carregar branco e para ser
                          link sobre o branco. É botão, painel, "+", ícone.
     FORTE   (alcancado)  luminosa o bastante para carregar tinta preta e
                          para brilhar sobre o escuro. É o alcançado.
     CLARA   (acaoEscura) a sóbria clareada, para ser TEXTO no modo
                          escuro — link, aba, chip. Nunca superfície.

   Quando uma faz o trabalho da outra, a tela quebra num lugar que ninguém
   olha na hora de escolher. As regras abaixo são essa frase escrita em
   números, uma linha por superfície que existe de verdade no aplicativo.

   ⚠️ ELA LÊ OS TOKENS DE VERDADE. Os dois geradores leem PALETAS por
   regex, e para eles basta: só precisam de três valores. Aqui uma cópia
   conferiria uma derivação que não é a que roda — e foi justamente a
   derivação, e não as cores, que quebrou o modo escuro. Então a trava
   importa `comPaleta` e mede o que `useTheme` entrega às telas, com os
   alfas compostos sobre a superfície onde eles caem.

   ⚠️ E OS GERADORES NÃO RODAM SEM ELA. scripts/gerar-aurora.mjs e
   scripts/gerar-icones.mjs chamam esta trava antes de gerar qualquer
   arquivo e se recusam se ela falhar: uma paleta nova só chega à aurora,
   ao ícone e ao app.json depois de passar aqui.

   De onde saiu cada limite está escrito junto da tabela, e o histórico
   das paletas (as doze, o corte para cinco) em src/theme.ts, acima de
   PALETAS.
   ============================================================ */

import fs from 'node:fs';
import path from 'node:path';
import { PALETAS, FILEIRAS_DA_ESCOLHA, comPaleta, light, dark, mix, type Palette, type Paleta } from '../src/theme';

const RAIZ = path.resolve(path.dirname(process.argv[1] ?? '.'), '..');
const AURORA = process.argv.includes('--aurora');
const TUDO = process.argv.includes('--tudo');

const BRANCO = '#FFFFFF';

/* ---------------- a cor, a luz e a distância ---------------- */

type Rgba = [number, number, number, number];

/** '#RRGGBB' ou 'rgba(r,g,b,a)' — as duas formas que theme.ts escreve. */
function ler(cor: string): Rgba {
  if (cor.startsWith('#') && cor.length === 7) {
    return [0, 1, 2].map((i) => parseInt(cor.slice(1 + i * 2, 3 + i * 2), 16)).concat(1) as Rgba;
  }
  const m = cor.match(/^rgba?\(([^)]+)\)$/);
  if (!m) throw new Error(`cor que a trava não sabe ler: ${cor}`);
  const [r, g, b, a = '1'] = m[1].split(',').map((s) => s.trim());
  return [Number(r), Number(g), Number(b), Number(a)];
}

/* O alfa se compõe no espaço da tela (sRGB com gama), que é como o
   React Native e o navegador desenham: o `accentWeak` de 8% não é uma cor,
   é o branco do cartão com 8% de ação por cima. */
function compor(frente: string, fundo: Rgba): Rgba {
  const [r, g, b, a] = ler(frente);
  if (a >= 1) return [r, g, b, 1];
  return [r * a + fundo[0] * (1 - a), g * a + fundo[1] * (1 - a), b * a + fundo[2] * (1 - a), 1];
}

const linear = (v: number) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const luz = ([r, g, b]: Rgba | [number, number, number]) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
/** WCAG 2.x. */
const razao = (y1: number, y2: number) => (Math.max(y1, y2) + 0.05) / (Math.min(y1, y2) + 0.05);

function oklab([r, g, b]: Rgba | [number, number, number]): [number, number, number] {
  const R = linear(r), G = linear(g), B = linear(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
/** ΔE em OKLab, ×100 — 1 é o limiar do olho, 10 já se distingue lado a lado. */
const distancia = (x: Rgba, y: Rgba) => { const a = oklab(x), b = oklab(y); return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) * 100; };
const matiz = (x: Rgba | [number, number, number]) => { const [, a, b] = oklab(x); return ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360; };
const entreMatizes = (h1: number, h2: number) => Math.abs(((h1 - h2 + 540) % 360) - 180);
const croma = (x: Rgba | [number, number, number]) => { const [, a, b] = oklab(x); return Math.hypot(a, b); };
/** Abaixo disto a cor é cinza, e o matiz de um cinza é ruído — o mesmo corte da R17. */
const SEM_MATIZ = 0.05;

/* ---------------- a tabela ---------------- */

type Modo = 'claro' | 'escuro';
type Ctx = { c: Palette; pal: Paleta; modo: Modo };
type Cor = { nome: string; de: (x: Ctx) => string };
type Medida = 'contraste' | 'ΔE' | 'Y' | 'croma' | 'Δh';

const tok = (k: keyof Palette): Cor => ({ nome: k, de: (x) => x.c[k] });
const fixa = (nome: string, hex: string): Cor => ({ nome, de: () => hex });
const branco = fixa('branco', BRANCO);

/* O topo da rampa do ícone não é token: é a conta de scripts/gerar-icones.mjs
   (`clarear(acao, 0.2)`), refeita aqui com o `mix` do tema — clarear em
   direção ao branco é a mesma mistura. */
const topoDoIcone: Cor = { nome: 'topo do ícone', de: (x) => mix(x.pal.acaoClara, BRANCO, 0.2) };

type Linha = [
  regra: string, frente: Cor, fundo: Cor | null, minimo: number,
  modo: Modo | 'ambos', o: string, medida?: Medida,
];

/* ⚠️ CADA LINHA É UMA SUPERFÍCIE QUE EXISTE. Os mínimos são os da WCAG
   2.x — 4,5 para texto, 3 para texto grande e para traço ou ícone — e
   7 onde a forte é TEXTO pequeno sobre escuro ou carrega tinta num
   tamanho de selo. Os de ΔE vêm das colisões medidas: a forte da Amora a
   1,45 do teal fixo e a sóbria da Brasa a 5,5 do vermelho destrutivo.

   O `modo` diz em qual tema a linha vale. A forte e a tinta dela são as
   mesmas nos dois, mas a superfície em volta não é, e os tokens derivados
   (o selo, o véu, a faixa do Insights) mudam com o modo — então R5, R6 e
   R8 se conferem nos dois. */
const TABELA: Linha[] = [
  /* ---- modo claro: a sóbria carrega branco e é link ---- */
  ['R1', tok('accentInk'), tok('accent'), 4.5, 'claro', 'o texto do botão cheio'],
  ['R1', branco, tok('panelMid'), 4.5, 'claro', 'o número da Jornada, no meio do painel'],
  ['R1', branco, tok('panelFrom'), 3, 'claro', 'o alto do painel, onde a linha da semana começa'],
  ['R1', branco, tok('gradFrom'), 3, 'claro', 'o "+" da barra e a inicial do avatar'],
  ['R2', tok('accent'), tok('bg'), 4.5, 'claro', 'o link e a aba ativa sobre o fundo'],
  ['R2', tok('accent2'), tok('bg1'), 4.5, 'claro', 'o link de seção dentro do cartão'],
  ['R3', tok('accent'), tok('accentWeak'), 4.5, 'claro', 'o texto do chip selecionado'],
  ['R4', tok('lime'), tok('panelMid'), 3, 'claro', 'a curva e o check da forte no painel; a marca no ícone'],

  /* ---- a forte: luz que carrega tinta ---- */
  ['R5', tok('limeInk'), tok('lime'), 7, 'ambos', 'a tinta da pastilha de alcançado'],
  ['R6', tok('limeSoftInk'), tok('limeSoft'), 4.5, 'ambos', 'o selo ("−7,3 kg") dentro do cartão'],
  ['R7', tok('lime'), null, 0.55, 'claro', 'a forte é luz: só assim lê sobre a aurora e sobre o escuro', 'Y'],
  ['R8', tok('lime'), tok('altMid'), 4.5, 'ambos', 'a forte sobre a faixa chapada do Insights'],
  ['R8', tok('lime'), tok('veu'), 7, 'ambos', 'a forte como texto sobre o véu da aurora'],

  /* ---- modo escuro: a clara é texto, a sóbria continua superfície ---- */
  ['R9', tok('accentInk'), tok('accent'), 4.5, 'escuro', 'o texto do botão cheio'],
  ['R10', tok('accent'), tok('bg1'), 4.5, 'escuro', 'o link sobre o cartão'],
  ['R10', tok('accent'), tok('accentWeak'), 4.5, 'escuro', 'o texto do chip selecionado'],
  ['R11', branco, tok('panelMid'), 4.5, 'escuro', 'o número da Jornada, no meio do painel'],
  ['R11', branco, tok('panelFrom'), 3, 'escuro', 'o alto do painel, onde a linha da semana começa'],
  ['R11', tok('lime'), tok('panelMid'), 3, 'escuro', 'a curva e o check da forte no painel'],
  ['R11', branco, tok('gradFrom'), 3, 'escuro', 'o "+" da barra e a inicial do avatar'],
  /* Os mesmos grad* também pintam o "+" da barra, o avatar, o traço do
     gráfico de área e o anel de progresso, sobre o cartão escuro. 3 é o
     mínimo de traço, e é onde a Original já está (3,03).

     ⚠️ VIROU TRAVA (02/10/2026). Era aviso porque parecia puxar contra a
     R11 — o "+" querendo a ponta escura, o traço querendo a clara. Na
     prévia das dez, o "+" da Grafite sumia na barra escura (1,42:1), e a
     conta mostrou que as duas cabem juntas: comPaleta levanta a ponta só
     até 3:1, e o branco por cima continua acima de 3. */
  ['R11t', tok('gradTo'), tok('bg1'), 3, 'escuro', 'a ponta escura do "+", do avatar, do traço do gráfico e do anel, sobre o cartão'],

  /* ---- sentido: a cor da paleta não pode ser a cor de um estado ---- */
  /* ⚠️ E O PONTO NOS DOIS MODOS (02/10/2026). O veredito do painel tem
     ponto no claro e no escuro, e com a `calma` de src/theme.ts o teal
     de uma paleta pode, em tese, mudar de modo. */
  ['R12', tok('lime'), tok('teal'), 10, 'ambos', 'o alcançado não pode ser o teal da má notícia que não cobra', 'ΔE'],
  /* ⚠️ E NO ESCURO, O SELO (02/10/2026, achado da verificação das dez):
     ali o selo do alcançado escreve com a própria forte, e o selo teal
     escreve com #A6F5EB. Um verde-água claro passava na R12 de cima a
     12,7 e ficava a 2,6 do selo teal — "alcançado" e "má notícia" com a
     mesma cara. No claro a regra não vale: a própria Original dá 8,7. */
  ['R12', tok('limeSoftInk'), tok('tealInk'), 10, 'escuro', 'o selo do alcançado não pode ser o selo teal', 'ΔE'],
  ['R13', tok('accent'), tok('cta'), 15, 'claro', 'a ação não pode ser o vermelho do destrutivo', 'ΔE'],

  /* ---- a má notícia que não cobra: o teal fixo, ou a `calma` de quem o troca ----

     ⚠️ ERA SÓ A R12, QUE OLHA O TEAL DE FORA (02/10/2026). Com a Amora
     trocando a família inteira (ver `calma` em src/theme.ts), ela passou
     a ser escolhida — e o que nunca precisou de conferência no teal fixo,
     porque foi olhado uma vez, agora precisa: a pílula ler, o ponto
     aparecer no painel, e a família não virar nenhuma das vizinhas. Cada
     linha é uma peça da Jornada, e o teal fixo passa em todas, em todas
     as paletas da rodada. */
  ['R18', tok('tealInk'), tok('tealBg'), 4.5, 'ambos', 'a pílula do "ruim" no ChangeTile da Jornada'],
  ['R18', tok('teal'), tok('panelMid'), 3, 'ambos', 'o ponto de "Acima do início" no meio do painel'],
  ['R18', tok('teal'), tok('amber'), 15, 'ambos', 'ao lado do ponto do "pede conversa"', 'ΔE'],
  ['R18', tok('teal'), tok('cta'), 15, 'ambos', 'a má notícia que não cobra não pode ser o vermelho que cobra', 'ΔE'],
  /* COR, E NÃO CINZA. A ardósia passava em tudo acima e a pílula lia como
     a do "Estável" — e a Jornada já recusou ausência de cor para notícia
     ruim, porque lê como desligado. Os pisos são os do teal fixo com uma
     folga (ele dá 0,071 e 0,038 no claro). */
  ['R18', tok('tealInk'), null, 0.06, 'ambos', 'a tinta da pílula é cor, e não o cinza do "Estável"', 'croma'],
  ['R18', tok('tealBg'), null, 0.03, 'ambos', 'e a lavagem também, caída no cartão', 'croma'],
  /* NEM A AÇÃO. A pervinca passava nos pisos e lia como o chip "Dose
     ajustada", que vive na mesma tela. 20° é o degrau que a R17 calibrou
     para duas cores terem nomes diferentes; ao lado de um cinza não conta. */
  ['R18', tok('tealInk'), tok('accent'), 20, 'ambos', 'a pílula não é o chip da ação ("Dose ajustada")', 'Δh'],

  /* ---- avisos: pedem olho, não bloqueiam ---- */
  ['R14', tok('accent'), tok('lime'), 20, 'escuro', 'a barra cheia (forte) ao lado da barra em curso (clara), na Jornada', 'ΔE'],
  /* No escuro, a ação é a clara e o destrutivo é #FF5A5A — e Cacau e
     Pitaia chegam a 12–14 dele. O botão de apagar tem palavra e lugar
     próprios, então pede olho, e não trava. */
  ['R13e', tok('accent'), tok('cta'), 15, 'escuro', 'a ação clara perto do vermelho do destrutivo no escuro', 'ΔE'],
  ['R4i', tok('lime'), topoDoIcone, 3, 'claro', 'a marca sobre o alto da rampa do ícone'],
];

/* R14, R13e, R15 e a marca no alto do ícone são avisos: os
   limites ainda não foram calibrados no olho (o histórico não é coerente —
   original e amora ficaram a 10,4, oceano saiu a 17,7), e um aviso que
   bloqueia vira o primeiro limite que alguém desliga. */
const AVISOS = new Set(['R14', 'R13e', 'R15', 'R4i', 'R7h']);

/* A forte sobre a aurora (R7, com --aurora): o véu do hero chega a 0,34
   no meio da Home, mas o texto da forte mora onde ele está mais perto de
   0,5. O percentil 95 deixa de fora o brilho de um punhado de pixels, e
   não a faixa clara inteira. */
const VEU_R7 = 0.5;
const PERCENTIL = 0.95;
/* A aurora é girada no matiz pelo sharp, e o giro dele não é linear em
   OKLCH: `auroraHue` é chutado à mão. Mais de 20° de distância e a
   aurora já é outra cor ao lado do botão. */
const MATIZ_DA_AURORA = 20;

/* ---------------- a conferência ---------------- */

const num = (v: number, casas = 2) => v.toFixed(casas).replace('.', ',');
const temaDe = (modo: Modo) => (modo === 'claro' ? light : dark);

type Resultado = { regra: string; paleta: string; certo: boolean; aviso: boolean; texto: string };
const resultados: Resultado[] = [];

function anotar(regra: string, paleta: string, certo: boolean, texto: string) {
  resultados.push({ regra, paleta, certo, aviso: AVISOS.has(regra), texto });
}

function medir(linha: Linha, x: Ctx): number {
  const [, frente, fundo, , , , medida = 'contraste'] = linha;
  const superficie = ler(x.c.bg1);
  if (medida === 'Y') return luz(compor(frente.de(x), superficie));
  if (medida === 'croma') return croma(compor(frente.de(x), superficie));
  const atras = compor(fundo!.de(x), superficie);
  const diante = compor(frente.de(x), atras);
  /* ao lado de um cinza o matiz não conta, e a linha passa — como na R17 */
  if (medida === 'Δh') return croma(diante) < SEM_MATIZ || croma(atras) < SEM_MATIZ ? 180 : entreMatizes(matiz(diante), matiz(atras));
  return medida === 'ΔE' ? distancia(diante, atras) : razao(luz(diante), luz(atras));
}

function descrever(linha: Linha, modo: Modo, v: number): string {
  const [regra, frente, fundo, minimo, , o, medida = 'contraste'] = linha;
  const par = medida === 'Y' ? `Y(${frente.nome})`
    : medida === 'croma' ? `croma(${frente.nome})`
      : medida === 'ΔE' ? `ΔEok(${frente.nome}, ${fundo!.nome})`
        : medida === 'Δh' ? `Δh(${frente.nome}, ${fundo!.nome})`
          : `${frente.nome} × ${fundo!.nome}`;
  const valor = medida === 'ΔE' ? num(v, 1) : medida === 'croma' ? num(v, 3) : medida === 'Δh' ? `${num(v, 0)}°` : num(v);
  const casas = medida === 'Y' || medida === 'croma' ? 2 : minimo % 1 ? 1 : 0;
  return `${regra.padEnd(4)} ${modo.padEnd(6)} ${par.padEnd(30)} ${valor.padStart(6)} ≥ ${num(minimo, casas).padEnd(4)}  ${o}`;
}

for (const pal of PALETAS) {
  for (const linha of TABELA) {
    const modos: Modo[] = linha[4] === 'ambos' ? ['claro', 'escuro'] : [linha[4]];
    for (const modo of modos) {
      const x: Ctx = { c: comPaleta(temaDe(modo), pal.id, modo === 'escuro'), pal, modo };
      const v = medir(linha, x);
      anotar(linha[0], pal.id, v >= linha[3], descrever(linha, modo, v));
    }
  }

  /* R18, a exceção: quem traz `calma` precisa dela. O teal é fixo para um
     estado não mudar de cor com o gosto de quem instalou, e ele só se
     dobra enquanto a forte cair em cima dele — se um dia a forte mudar, a
     família calma sai junto. */
  if (pal.calma) {
    const d = distancia(ler(pal.alcancado), ler(light.teal));
    anotar('R18', pal.id, d < 10, `R18  —      ${'ΔEok(forte, teal fixo)'.padEnd(30)} ${num(d, 1).padStart(6)} < 10    a família calma só vale enquanto a forte cair em cima do teal`);
  }

  /* R16. A fileira de aparencia.tsx tem 65 px por rótulo, e "Framboesa"
     pedia 66: aparecia como "Framboe…". Nome é rótulo antes de ser poesia. */
  const letras = Array.from(pal.nome.normalize('NFC')).length;
  anotar('R16', pal.id, letras <= 8, `R16  —      nome "${pal.nome}"${' '.repeat(Math.max(0, 22 - pal.nome.length))} ${String(letras).padStart(6)} ≤ 8     letras: a coluna da escolha tem 65 px`);
}

/* R16, a outra metade: a escolha mora em FILEIRAS_DA_ESCOLHA (src/theme.ts),
   duas fileiras de cinco escritas à mão, sem flexWrap, de propósito
   (aparencia.tsx). ⚠️ ERA UM AVISO QUE CONTAVA PALETAS (02/10/2026); agora
   que as fileiras existem, ela confere as fileiras: toda paleta numa delas,
   uma vez só, nenhuma fileira com mais de cinco, e no máximo duas. A
   undécima paleta não cabe até alguém decidir onde ela mora. */
{
  const nas = FILEIRAS_DA_ESCOLHA.flat();
  const fora = PALETAS.filter((pal) => !nas.includes(pal.id)).map((pal) => pal.id);
  const sobra = nas.filter((id, i) => !PALETAS.some((pal) => pal.id === id) || nas.indexOf(id) !== i);
  const larga = FILEIRAS_DA_ESCOLHA.some((f) => f.length > 5);
  const certo = !fora.length && !sobra.length && !larga && FILEIRAS_DA_ESCOLHA.length <= 2;
  anotar('R16', 'todas', certo, `R16  —      ${PALETAS.length} paletas em ${FILEIRAS_DA_ESCOLHA.length} fileira(s) de ${FILEIRAS_DA_ESCOLHA.map((f) => f.length).join(' + ')}`
    + `${fora.length ? ` · fora das fileiras: ${fora.join(', ')}` : ''}${sobra.length ? ` · sobrando ou repetida: ${sobra.join(', ')}` : ''}`
    + `  (no máximo duas fileiras de cinco, cada paleta uma vez)`);
}

/* R15, entre as paletas: a sóbria de uma perto da sóbria de outra é
   escolher entre dois azuis — o motivo do corte de 18/09. */
for (let i = 0; i < PALETAS.length; i++) {
  for (let j = i + 1; j < PALETAS.length; j++) {
    const a = PALETAS[i], b = PALETAS[j];
    const dS = distancia(ler(a.acaoClara), ler(b.acaoClara));
    const dF = distancia(ler(a.alcancado), ler(b.alcancado));
    const par = Math.hypot(dS, dF);
    const certo = dS >= 10 && par >= 20;
    anotar('R15', `${a.id}–${b.id}`, certo,
      `R15  —      ΔEok sóbria ${num(dS, 1).padStart(5)} ≥ 10 · forte ${num(dF, 1).padStart(5)} · par ${num(par, 1).padStart(5)} ≥ 20`);
  }
}

/* ============================================================
   R17, ENTRE AS PALETAS: UMA COR DE BASE POR PALETA (02/10/2026)

   O dono, sobre as dez da primeira prévia: "Tentaria não repetir cores de
   base." Amora, Índigo e Ameixa eram três roxos, e a Ameixa "se parecia"
   com a Amora.

   ⚠️ NÃO É DISTÂNCIA, É NOME. Pela R15 a Original e a Amora estão MAIS
   perto (ΔEok 10,4 entre as sóbrias) que a Amora e a Ameixa (17,6), e no
   matiz também (24° contra 34°). E o olho separa as duas primeiras — azul
   e violeta — e junta as duas últimas: "as duas são roxas". Nenhum limiar
   de distância faz as duas coisas. O que decide é a faixa do círculo onde
   o nome não muda, e elas não têm a mesma largura: a passagem do azul
   para o violeta é curta, e o roxo vai de 274° a 330° em OKLCH.

   E O ESCURO APERTA MAIS QUE O CLARO. Toda clara mora entre L 0,65 e 0,80
   para ler sobre o cartão, então a claridade — que no claro separa um
   marinho de um azul — some: duas sóbrias do mesmo matiz viram a mesma
   clara. No escuro só o matiz separa.

   Quatro testes, todos no matiz OKLCH:
     cor        a sóbria com croma ≥ 0,08 e a clara com ≥ 0,11; abaixo de
                0,05 a base é cinza, e cinza é uma família só;
     família    a sóbria e a clara de uma paleta na mesma faixa; duas
                paletas nunca na mesma;
     claro      Δh das sóbrias ≥ 20°;
     escuro     Δh das claras ≥ 26° e ΔEok das claras ≥ 8.

   ⚠️ E TRÊS PARES FICAM PERTO DE PROPÓSITO. Nas rodadas de 02/10/2026 o
   dono olhou, lado a lado, e aprovou: Original e Marinho (os dois azuis —
   ele pediu uma Marinho toda em azul), Floresta e Oliva (os dois verdes,
   separados pela forte: lilás e pêssego) e Camurça e Grafite (os dois
   neutros, sem matiz). Eles saem como aviso, com o nome de quem aprovou e
   quando — e só eles: a próxima paleta que cair na família de outra trava,
   até alguém olhar. A licença é do par, e não da família.
   ============================================================ */
const CINZA = 0.05, COR_SOBRIA = 0.08, COR_CLARA = 0.11;
const GAP_CLARO = 20, GAP_ESCURO = 26, DE_CLARAS = 8;
/** [família, desde (graus OKLCH)] — cada faixa vai até a próxima; abaixo de 10° ainda é rosa. */
const FAMILIAS: [nome: string, desde: number][] = [
  ['vermelho', 10], ['terroso', 35], ['verde', 110], ['petróleo', 180], ['azul', 232], ['roxo', 274], ['rosa', 330],
];
/** Os pares que o dono viu e aprovou perto, em 02/10/2026 — em ordem alfabética. */
const PARES_APROVADOS = new Set(['marinho–original', 'floresta–oliva', 'camurca–grafite']);
const chaveDoPar = (a: string, b: string) => [a, b].sort().join('–');

function familia(hex: string): string {
  const x = ler(hex);
  if (croma(x) < CINZA) return 'cinza';
  const h = matiz(x);
  let nome = FAMILIAS[FAMILIAS.length - 1][0];
  for (const [n, desde] of FAMILIAS) if (h >= desde) nome = n;
  return nome;
}

for (const pal of PALETAS) {
  const fS = familia(pal.acaoClara), fC = familia(pal.acaoEscura);
  const cS = croma(ler(pal.acaoClara)), cC = croma(ler(pal.acaoEscura));
  const semNome = fS !== 'cinza' && (cS < COR_SOBRIA || cC < COR_CLARA);
  const limite = fS === 'cinza' ? `< ${num(CINZA)}     ` : `≥ ${num(COR_SOBRIA)} / ${num(COR_CLARA)}`;
  anotar('R17', pal.id, fS === fC && !semNome,
    `R17  —      ${`família ${fS} / ${fC}`.padEnd(27)} croma ${num(cS, 3)} / ${num(cC, 3)} ${limite}   a clara é a mesma cor da sóbria${fS === 'cinza' ? '' : ', e é cor'}`);
}

for (let i = 0; i < PALETAS.length; i++) {
  for (let j = i + 1; j < PALETAS.length; j++) {
    const a = PALETAS[i], b = PALETAS[j];
    const fa = familia(a.acaoClara), fb = familia(b.acaoClara);
    const cinza = fa === 'cinza' || fb === 'cinza';
    const gS = entreMatizes(matiz(ler(a.acaoClara)), matiz(ler(b.acaoClara)));
    const gC = entreMatizes(matiz(ler(a.acaoEscura)), matiz(ler(b.acaoEscura)));
    const dC = distancia(ler(a.acaoEscura), ler(b.acaoEscura));
    const certo = fa !== fb && (cinza || (gS >= GAP_CLARO && gC >= GAP_ESCURO)) && dC >= DE_CLARAS;
    const matizes = cinza ? 'Δh não conta ao lado do cinza'.padEnd(43)
      : `Δh sóbrias ${num(gS, 0).padStart(3)}° ≥ ${GAP_CLARO} · claras ${num(gC, 0).padStart(3)}° ≥ ${GAP_ESCURO}`;
    const texto = `R17  —      ${(fa === fb ? `as duas são ${fa}` : `${fa} · ${fb}`).padEnd(20)} ${matizes} · ΔEok claras ${num(dC, 1).padStart(4)} ≥ ${DE_CLARAS}`;
    const aprovado = !certo && PARES_APROVADOS.has(chaveDoPar(a.id, b.id));
    if (aprovado) resultados.push({ regra: 'R17', paleta: `${a.id}–${b.id}`, certo: false, aviso: true, texto: `${texto} · perto, aprovado pelo dono em 02/10/2026` });
    else anotar('R17', `${a.id}–${b.id}`, certo, texto);
  }
}
/* Um par aprovado que deixou de existir (uma das duas saiu, ou mudou de
   família) não fica na lista esperando licenciar a próxima. */
for (const par of PARES_APROVADOS) {
  const [x, y] = par.split('–');
  if (!PALETAS.some((pal) => pal.id === x) || !PALETAS.some((pal) => pal.id === y)) {
    anotar('R17', par, false, `R17  —      o par aprovado ${par} não existe mais: tire-o de PARES_APROVADOS`);
  }
}

/* ---------------- --aurora: a forte sobre a imagem ---------------- */

async function conferirAuroras() {
  const sharp = (await import('sharp')).default;
  for (const pal of PALETAS) {
    const arq = path.join(RAIZ, 'assets', 'auroras', `hero-${pal.id}.webp`);
    if (!fs.existsSync(arq)) {
      anotar('R7', pal.id, false, `R7   —      não há assets/auroras/hero-${pal.id}.webp — rode node scripts/gerar-aurora.mjs`);
      continue;
    }
    /* 432 de largura é a tela com folga: a aurora é um borrão, e o
       percentil de um borrão não muda com a resolução. */
    const { data, info } = await sharp(fs.readFileSync(arq)).resize({ width: 432 }).removeAlpha().raw()
      .toBuffer({ resolveWithObject: true });
    const n = info.width * info.height;
    const forte = luz(ler(pal.alcancado));

    for (const modo of ['claro', 'escuro'] as Modo[]) {
      const veu = ler(comPaleta(temaDe(modo), pal.id, modo === 'escuro').veu);
      const ys = new Float64Array(n);
      for (let k = 0; k < n; k++) {
        ys[k] = luz([0, 1, 2].map((i) => data[k * 3 + i] * (1 - VEU_R7) + veu[i] * VEU_R7) as [number, number, number]);
      }
      ys.sort();
      const p = ys[Math.floor((n - 1) * PERCENTIL)];
      const v = razao(forte, p);
      anotar('R7', pal.id, v >= 4.5,
        `R7   ${modo.padEnd(6)} ${'lime × aurora (véu 0,5, p95)'.padEnd(30)} ${num(v).padStart(6)} ≥ 4,5   a forte como texto sobre o hero`);
    }

    /* O matiz médio da aurora, pesado pelo croma: o cinza do borrão não
       vota, e o matiz de um pixel quase sem cor é ruído. */
    let sx = 0, sy = 0;
    for (let k = 0; k < n; k++) {
      const px: [number, number, number] = [data[k * 3], data[k * 3 + 1], data[k * 3 + 2]];
      const [, a, b] = oklab(px);
      sx += a; sy += b;
    }
    const daAurora = ((Math.atan2(sy, sx) * 180) / Math.PI + 360) % 360;
    const daSobria = matiz(ler(pal.acaoClara));
    const d = entreMatizes(daAurora, daSobria);
    anotar('R7h', pal.id, d <= MATIZ_DA_AURORA,
      `R7h  —      matiz da aurora ${num(daAurora, 0)}° · da sóbria ${num(daSobria, 0)}° ${num(d, 0).padStart(6)} ≤ ${MATIZ_DA_AURORA}    o auroraHue leva a aurora para outra cor`);
  }
}

/* ---------------- a saída ---------------- */

async function main() {
  if (AURORA) await conferirAuroras();

  const marca = (r: Resultado) => (r.certo ? '  ok  ' : r.aviso ? ' aviso' : '  NÃO ');

  console.log('\nAS PALETAS — sóbria + forte, sobre os tokens que comPaleta entrega');
  for (const pal of PALETAS) {
    const dela = resultados.filter((r) => r.paleta === pal.id);
    const falhas = dela.filter((r) => !r.certo && !r.aviso).length;
    const avisos = dela.filter((r) => !r.certo && r.aviso).length;
    console.log(`\n${falhas ? '  NÃO ' : '  ok  '} ${pal.nome.toUpperCase()} — sóbria ${pal.acaoClara} · clara ${pal.acaoEscura} · forte ${pal.alcancado}`
      + `${falhas ? ` · ${falhas} falha(s)` : ''}${avisos ? ` · ${avisos} aviso(s)` : ''}`);
    for (const r of dela) if (TUDO || !r.certo) console.log(`      ${marca(r)} ${r.texto}`);
  }

  const pares = resultados.filter((r) => r.regra === 'R15' || (r.regra === 'R17' && r.paleta.includes('–')) || r.paleta === 'todas');
  console.log('\nENTRE AS PALETAS');
  for (const r of pares) if (TUDO || !r.certo) console.log(`${marca(r)} ${r.paleta.padEnd(18)} ${r.texto}`);
  if (!TUDO && pares.every((r) => r.certo)) console.log('  ok   nenhum par vizinho');

  /* A matriz: cada regra contra cada paleta, para ver de uma vez se a
     falha é de uma cor ou de uma regra. */
  const regras = [...new Set(resultados.filter((r) => r.regra !== 'R15' && !r.paleta.includes('–') && r.paleta !== 'todas').map((r) => r.regra))];
  console.log('\nPOR REGRA');
  console.log(`  ${''.padEnd(14)}${PALETAS.map((p) => p.id.padStart(10)).join('')}`);
  for (const regra of regras) {
    const tipo = AVISOS.has(regra) ? 'aviso' : 'trava';
    const celulas = PALETAS.map((p) => {
      const rs = resultados.filter((r) => r.regra === regra && r.paleta === p.id);
      if (!rs.length) return '—'.padStart(10);
      return (rs.every((r) => r.certo) ? 'ok' : rs[0].aviso ? 'aviso' : 'NÃO').padStart(10);
    });
    console.log(`  ${`${regra} (${tipo})`.padEnd(14)}${celulas.join('')}`);
  }
  if (!AURORA) console.log('\n  R7 mediu só a luz da forte; a forte sobre a imagem pede --aurora.');

  const falhas = resultados.filter((r) => !r.certo && !r.aviso);
  const avisos = resultados.filter((r) => !r.certo && r.aviso);
  console.log(falhas.length
    ? `\n${falhas.length} falha(s) que travam${avisos.length ? ` e ${avisos.length} aviso(s)` : ''}\n`
    : `\ntodas as regras que travam passaram${avisos.length ? `; ${avisos.length} aviso(s) pedem olho` : ''}\n`);
  process.exit(falhas.length ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(2); });
