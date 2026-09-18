/* ============================================================
   Forma — design tokens (single source of truth)

   V2: extraído do Figma "Aplicativo de Caneta GLP-1" › frame Home
   (node 181:1869). Azul elétrico + lima sobre branco, tipografia
   Outfit em pesos leves.

   Procedência de cada valor:
     [figma]  lido direto do frame — não alterar sem nova referência
     [infer]  derivado por consistência; o frame não define. Substituir
              quando chegarem os frames de Jornada / Insights / Cuidado.
   ============================================================ */

export const BRAND = 'Morphi';

export type Palette = {
  bg: string; bg1: string; bg2: string; bg3: string;
  tx: string; tx2: string; tx3: string; tx4: string;
  line: string; line2: string;
  accent: string; accent2: string; accentInk: string;
  accentWeak: string; accentLine: string;
  lime: string; limeDim: string; limeInk: string; limeWeak: string;
  limePale: string; bluePale: string; teal: string; tealPale: string;
  panelFrom: string; panelMid: string; panelTo: string;
  altFrom: string; altMid: string; altTo: string;
  glass: string; glassLine: string;
  green: string; greenDim: string; blue: string; blueDim: string;
  good: string; bad: string;
  ok: string; okBg: string;
  limeSoft: string; limeSoftInk: string;
  cta: string; cta2: string; ctaInk: string; ctaWeak: string; ctaLine: string;
  water: string; waterBg: string;
  purple: string; purpleBg: string;
  amber: string; amberBg: string;
  rose: string; roseBg: string;
  gradFrom: string; gradTo: string;
  onHero: string; onHero2: string; onHeroWeak: string; onHeroLine: string;
  track: string; shadow: string; scrim: string;
  /* O VÉU DO HERO. A aurora é imagem e vive atrás de texto branco; o que
     garante a leitura é um gradiente escuro por cima dela. Esse escuro
     era o azul-noite cravado em seis lugares — e com a aurora seguindo a
     paleta, um véu azul sobre um fundo verde puxa o verde de volta para o
     azul e come metade da troca. */
  veu: string;
};

export const light: Palette = {
  // superfícies — bg é a folha branca que sobe sobre o hero  [figma]
  bg: '#F5F6FA', bg1: '#FFFFFF', bg2: '#EDF1F3', bg3: '#E5E7EA',
  // texto                                                    [figma]
  tx: '#000000', tx2: '#4D5461', tx3: '#727272', tx4: '#98A2B3',
  // divisores                                                [figma]
  line: '#E5E7EA', line2: '#EDF1F3',

  // ação — azul elétrico. accent = controles ("Registrar",
  // tab ativa), accent2 = links de seção ("Ir para metas").  [figma]
  accent: '#065CF5', accent2: '#003FEF', accentInk: '#FFFFFF',
  accentWeak: 'rgba(6,92,245,0.08)', accentLine: 'rgba(6,92,245,0.20)',

  // destaque — lima. Botão de check-in, números de streak,
  // overline "PARA HOJE", barra de proteína.                 [figma]
  lime: '#DDF62C', limeDim: '#C7DD2A', limeInk: '#0A0A0A',
  limeWeak: 'rgba(221,246,44,0.18)',

  // barras de meta diária — cada uma é um gradiente do tom
  // pálido ao saturado. Proteína lima, água azul, exercício
  // teal.                                                    [figma]
  limePale: '#F5F8DF', bluePale: '#D7DDEF',
  teal: '#15E4CB', tealPale: '#C5EAE6',

  /* Painel de destaque — azul saturado em gradiente. Precisa ler como
     CARD, não como fundo: o app inteiro é claro, então a superfície de
     ênfase se separa por saturação, e o lima pontua os itens dentro. */
  panelFrom: '#3D7BFF', panelMid: '#065CF5', panelTo: '#0130BE',

  /* Segundo gradiente, para o Insights — azul escuro descendo até azul
     claro. Mesma família do painel da Jornada, em outro registro: aquele
     é azul vivo chapado num card, este é uma lavagem que começa quase
     noturna e termina no fundo da tela.

     A versão anterior puxava para o violeta (#2E3C9E / #161F63) e lia
     como outra marca. Agora o azul é azul em toda a rampa.

     altMid é a cor da faixa chapada onde moram campo e chips em vidro:
     branco sobre ela dá 9,9:1. */
  altFrom: '#4C77E8', altMid: '#123A9E', altTo: '#05143F',

  /* Vidro sobre fundo escuro — o mesmo tratamento da faixa de check-in
     da Home, agora nomeado para poder se repetir. */
  glass: 'rgba(255,255,255,0.13)', glassLine: 'rgba(255,255,255,0.20)',

  // legado do tema v1 — sem uso nas telas, mantidos só para
  // não quebrar o tipo Palette                               [infer]
  green: '#DDF62C', greenDim: '#C7DD2A', blue: '#065CF5', blueDim: '#003FEF',

  // estado                                                   [figma p/ bad]
  good: '#065CF5', bad: '#D51A1A',

  /* Selos das telas internas — o par de lavagens que carrega o veredito
     dentro de um card: lima para variação medida ('−7,3 kg') e verde para
     estado clínico bom ('Na referência'). São washes com tinta escura por
     cima, não cores de marca: o selo informa, não compete com o azul.  */
  ok: '#3C6B2C', okBg: '#D9EFC6',
  limeSoft: '#EFF6A6', limeSoftInk: '#4A5410',

  // atenção / destrutivo — o frame só define o vermelho do
  // indicador de piora; o resto é derivado dele.             [infer]
  cta: '#D51A1A', cta2: '#E8452B', ctaInk: '#FFFFFF',
  ctaWeak: 'rgba(213,26,26,0.08)', ctaLine: 'rgba(213,26,26,0.20)',

  // cores de dado — só "água" aparece no frame (barra azul).
  // As outras três são usadas pela timeline e pelo radar e
  // ainda não têm referência de design.                      [infer]
  water: '#065CF5', waterBg: '#EAF1FE',
  purple: '#7A5AF8', purpleBg: '#F0EDFE',
  amber: '#B58900', amberBg: '#FAF6E0',
  rose: '#E0457B', roseBg: '#FDECF2',

  // gradiente do FAB e do avatar — no frame o FAB é azul
  // chapado; mantido como gradiente sutil entre os dois azuis
  gradFrom: '#065CF5', gradTo: '#003FEF',

  // texto sobre o hero escuro (aurora)                       [figma]
  onHero: '#FFFFFF', onHero2: 'rgba(255,255,255,0.80)',
  onHeroWeak: 'rgba(255,255,255,0.10)', onHeroLine: 'rgba(255,255,255,0.20)',

  track: '#EDF1F3',
  shadow: 'rgba(0,0,0,0.05)',                              // [figma]
  scrim: 'rgba(0,0,0,0.45)',
  /* O azul-noite que já estava cravado nos gradientes do hero. */
  veu: '#030A26',
};

/* Dark — NÃO existe frame de referência. Derivado da paleta clara
   invertendo superfícies e preservando azul/lima. Trocar quando
   houver desenho. */
export const dark: Palette = {
  bg: '#0B0D12', bg1: '#141821', bg2: '#1C2029', bg3: '#262B36',
  tx: '#FFFFFF', tx2: '#C3C9D4', tx3: '#98A2B3', tx4: '#6B7280',
  line: 'rgba(255,255,255,0.09)', line2: 'rgba(255,255,255,0.14)',

  accent: '#4C8BFF', accent2: '#6BA1FF', accentInk: '#04102B',
  accentWeak: 'rgba(76,139,255,0.14)', accentLine: 'rgba(76,139,255,0.28)',

  lime: '#DDF62C', limeDim: '#C7DD2A', limeInk: '#0A0A0A',
  limeWeak: 'rgba(221,246,44,0.16)',
  limePale: '#4A5220', bluePale: '#1E2A4D', teal: '#15E4CB', tealPale: '#12463F',
  panelFrom: '#4C8BFF', panelMid: '#1F5FE0', panelTo: '#0A2E9E',
  altFrom: '#5B84EE', altMid: '#123A9E', altTo: '#040F33',
  glass: 'rgba(255,255,255,0.11)', glassLine: 'rgba(255,255,255,0.17)',

  green: '#DDF62C', greenDim: '#C7DD2A', blue: '#4C8BFF', blueDim: '#6BA1FF',

  good: '#4C8BFF', bad: '#FF5A5A',

  ok: '#A7D98A', okBg: 'rgba(167,217,138,0.16)',
  limeSoft: 'rgba(221,246,44,0.16)', limeSoftInk: '#DDF62C',

  cta: '#FF5A5A', cta2: '#FF7A5A', ctaInk: '#2B0404',
  ctaWeak: 'rgba(255,90,90,0.16)', ctaLine: 'rgba(255,90,90,0.30)',

  water: '#4C8BFF', waterBg: 'rgba(76,139,255,0.15)',
  purple: '#9D86FF', purpleBg: 'rgba(157,134,255,0.15)',
  amber: '#E0BC4A', amberBg: 'rgba(224,188,74,0.15)',
  rose: '#F26A9B', roseBg: 'rgba(242,106,155,0.15)',

  gradFrom: '#4C8BFF', gradTo: '#065CF5',

  onHero: '#FFFFFF', onHero2: 'rgba(255,255,255,0.80)',
  onHeroWeak: 'rgba(255,255,255,0.10)', onHeroLine: 'rgba(255,255,255,0.20)',

  track: 'rgba(255,255,255,0.10)',
  shadow: 'rgba(0,0,0,0.45)',
  scrim: 'rgba(0,0,0,0.60)',
  veu: '#030A26',
};

/* Largura máxima do app.

   Isto é um app de celular. No web ele rodaria edge-to-edge, e aí a mesma
   manchete de 32px que domina uma tela de 390 vira uma linha perdida num
   hero de 1400 — o desenho some, e quem avalia a tela pelo navegador julga
   um layout que ninguém vai ver. A coluna centrada em app/_layout devolve
   ao preview a proporção do aparelho.

   430 é a largura do iPhone Pro Max, o maior telefone que o app precisa
   atender: a coluna nunca aperta um aparelho real, só segura o desktop. */
export const APP_MAX_W = 430;

export const space = { xs: 4, sm: 8, md: 12, base: 16, lg: 20, xl: 24, xxl: 32, huge: 44 };

/* Altura da tab bar sem a safe area. Mora aqui, e não em ui/TabBar, porque
   o kit precisa dela para posicionar os sheets acima da barra — e kit não
   pode importar de TabBar, que já importa do kit. */
export const TAB_BAR_H = 58;

/* Raios do frame: 8 · 12 · 24 · 32 · pill. 32 é o dominante
   (cards e superfícies agrupadas).                           [figma] */
/* 18 entra entre md e lg como o raio de CARD das telas internas: elas são
   listas densas de cartões pequenos, e 24 num card de 60px de altura come a
   própria caixa. As telas de aba seguem em lg/xl — lá o card é grande e o
   raio maior é o que dá o ar de superfície agrupada.                [figma] */
export const radius = { sm: 8, md: 12, card: 18, lg: 24, xl: 32, pill: 999 };

/* Outfit em quatro pesos. O frame usa 300 como peso mais frequente —
   o app v1 era 700/800, então o conjunto fica visivelmente mais leve. */
export const font = {
  display: 'Outfit_600SemiBold',
  displayX: 'Outfit_600SemiBold',
  bold: 'Outfit_600SemiBold',
  semi: 'Outfit_500Medium',
  medDisplay: 'Outfit_400Regular',
  body: 'Outfit_400Regular',
  bodyMed: 'Outfit_500Medium',
  bodySemi: 'Outfit_600SemiBold',
  light: 'Outfit_300Light',
};

/* Escala tipográfica.

   O frame do Figma usa 10px em overline e 12px em legenda. Numa peça de
   apresentação isso funciona; num app de tratamento, não — a pessoa lê
   isto no ônibus, com pressa, às vezes com a vista cansada, e boa parte
   do público tem mais de 40. A escala foi subida um degrau na ponta
   pequena, mantendo a hierarquia e as proporções do frame.

   A régua era: 12 · 14 · 15 · 17 · 19 · 20 · 30 · 32 · 36

   E ainda era pequena. Vista na proporção certa — o app numa coluna de
   telefone, não esticado no navegador —, a leitura continuou apertada, e
   a escala subiu de novo, cerca de 12% em toda a extensão. O degrau maior
   ficou nas legendas: caption e note carregam quase todo o texto
   secundário do app (a data de um registro, o de-onde-para-onde de uma
   métrica, a frase que explica um campo) e eram justamente as que a vista
   cansada perdia primeiro.

   A régua agora: 13 · 16 · 17 · 19 · 21 · 23 · 40 · 44

   A ponta grande veio depois, do protótipo das telas internas: lá o
   número do hero é 44 e o corpo é 14,5, e o que dá caráter àquelas telas
   não é o tamanho do texto — é a DISTÂNCIA entre os dois. Os tamanhos de
   leitura ficaram onde estavam; subiu só o que é valor. */
export const ty = {
  /* O número do hero — "−7,3 kg" na Jornada. É o maior degrau da régua e
     não é vaidade: no protótipo das telas internas ele é 44 contra um
     corpo de 14,5, uma razão de 3×, e é dela que vem o soco daquelas
     telas. A nossa razão era 1,9× e a tela lia chapada.

     Separado de `display` porque os dois papéis divergiram: o titulão de
     uma tela interna ("Evolução", "A história") é um TÍTULO e fica em 36;
     isto aqui é um VALOR, a resposta que a pessoa abriu o app para ver, e
     ganha a ponta da escala sozinho. */
  hero: { fontFamily: font.light, fontSize: 44, lineHeight: 52 },
  /** manchete de tela — titulão das internas, slides do hero da Home */
  display: { fontFamily: font.light, fontSize: 36, lineHeight: 42 },
  /** número grande em destaque (streak) */
  h1: { fontFamily: font.display, fontSize: 36, lineHeight: 44 },
  /** título de seção — "Suas metas diárias" */
  h2: { fontFamily: font.display, fontSize: 23, lineHeight: 30 },
  /** título de card — "Ingestão de proteína" */
  title: { fontFamily: font.body, fontSize: 21, lineHeight: 28 },
  /** valor numérico — "57g", "−16,5 kg", o número do stepper */
  metric: { fontFamily: font.body, fontSize: 40, lineHeight: 48 },
  body: { fontFamily: font.body, fontSize: 19, lineHeight: 26 },
  bodyMed: { fontFamily: font.bodyMed, fontSize: 19, lineHeight: 26 },
  /** link de seção e tab ativa — "Ir para metas" */
  label: { fontFamily: font.bodyMed, fontSize: 16, lineHeight: 22 },
  /** legenda — "Faltam 33 g", "Meta: −23 kg", eixos */
  note: { fontFamily: font.light, fontSize: 17, lineHeight: 24 },
  /** sub de item de lista — "3 novas mensagens" */
  caption: { fontFamily: font.body, fontSize: 16, lineHeight: 21 },
  /* Selo — "Em ritmo saudável", "−7,3 kg", "Na referência".

     Vivia em `micro` junto com o overline, e os dois querem coisas
     opostas. O overline é um rótulo de seção em caixa alta: ele orienta e
     depois some, e ser pequeno é parte do trabalho. O selo é um VALOR —
     o veredito do tratamento, a variação da semana — e encolhê-lo esconde
     justamente o que a pessoa veio ler. Ao lado de um número de 44px, 13
     sumia.

     15 contra um corpo de 19 dá a mesma razão que o protótipo tem entre o
     selo dele e o corpo dele. */
  tag: { fontFamily: font.body, fontSize: 15, lineHeight: 20 },
  /** overline em caixa alta — "SUA ESPECIALISTA", "PARA HOJE" */
  micro: { fontFamily: font.body, fontSize: 13, lineHeight: 17 },
} as const;

/* Sombra do frame é bem mais suave que a do v1: preto a 5%. */
export const shadowCard = (p: Palette) => ({
  shadowColor: p.shadow,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 16,
  elevation: 2,
});

export const shadowSoft = (p: Palette) => ({
  shadowColor: p.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 8,
  elevation: 1,
});


/* ============================================================
   AS PALETAS

   ⚠️ ERAM DUAS ESCOLHAS SOLTAS — uma cor de ação e uma de alcançado — e
   isso empurrava para a pessoa uma decisão que é de design. As duas
   juntas dão vinte e cinco combinações, e algumas delas são ruins: ação e
   alcançado próximos fazem o botão que leva a algum lugar e a marca do
   que já foi feito virarem a mesma coisa. Oferecer o erro como opção não
   é dar liberdade; é terceirizar um problema.

   Agora são cinco paletas fechadas. Cada uma é um conjunto que já foi
   olhado junto: a cor que age, a cor que celebra e a aurora do fundo.
   Quem escolhe escolhe um clima, não dois valores.

   ⚠️ E ERAM DOZE. Doze cabem numa grade de quatro por três e não cabem
   numa decisão: metade delas era vizinha de outra — oceano ao lado de
   original, menta ao lado de floresta, índigo ao lado de amora —, e
   escolher entre dois azuis parecidos é trabalho, não personalização. As
   cinco que ficaram dividem a roda inteira, e cada uma se reconhece de
   longe: azul, violeta, magenta, laranja, verde.

   O que sai daqui sai junto: a aurora, o ícone e a linha do plugin. Os
   dois geradores leem esta lista, e quem a encurtar precisa rodar
   `node scripts/gerar-aurora.mjs` e `node scripts/gerar-icones.mjs`, e
   colar o plugin.json novo em app.json.

   CADA PALETA TEM TRÊS PARTES

     ação        botão, link, aba ativa, painel da Jornada
     alcançado   check-in feito, meta batida, conquista
     aurora      o gradiente que é fundo da Home e do Insights

   A AURORA É IMAGEM, e por isso entra como receita e não como cor: o
   arquivo original é girado no matiz e ajustado na saturação por
   scripts/gerar-aurora.mjs, uma vez, antes da compilação. Sem isso a
   paleta trocaria tudo menos a maior superfície de cor do aplicativo —
   que é justamente a primeira coisa que alguém vê ao abrir.

   A PRIMEIRA É A DO FIGMA, com os valores exatos: quem não escolher nada
   vê o aplicativo que foi desenhado, e não uma aproximação calculada
   dele.
   ============================================================ */

const canal = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
const hex2 = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');

/** Mistura duas cores. t=0 devolve a primeira, t=1 a segunda. */
export const mix = (a: string, b: string, t: number) =>
  `#${[0, 1, 2].map((i) => hex2(canal(a, i) + (canal(b, i) - canal(a, i)) * t)).join('')}`;

/** A mesma cor, com alfa. É como o véu e o fio da cor de ação nascem. */
export const alfa = (hex: string, a: number) =>
  `rgba(${canal(hex, 0)},${canal(hex, 1)},${canal(hex, 2)},${a})`;

/* ⚠️ ESCURECER NÃO É MISTURAR COM O AZUL DA NOITE.

   A primeira versão fazia as pontas escuras da rampa misturando a cor com
   o azul-noite do tema. Funcionava para o azul e virava lama para o
   resto: âmbar misturado com azul é cinza, porque são complementares — a
   tela de Insights ficou um borrão sem cor nenhuma.

   Multiplicar os canais em direção ao preto preserva a matiz: âmbar
   escuro continua âmbar, violeta escuro continua violeta. */
const escurecer = (hex: string, t: number) =>
  `#${[0, 1, 2].map((i) => hex2(canal(hex, i) * (1 - t))).join('')}`;

const BRANCO = '#FFFFFF';

export type Paleta = {
  id: string;
  nome: string;
  /** a cor de ação, em cada modo — o resto da família sai daqui */
  acaoClara: string;
  acaoEscura: string;
  /** a tinta por cima da cor de ação cheia */
  inkClaro: string;
  inkEscuro: string;
  /** a cor do alcançado, e a tinta escura que vai por cima dela */
  alcancado: string;
  alcancadoInk: string;
  /** giro de matiz, em graus, sobre a aurora original — que é azul */
  auroraHue: number;
  /** fator de saturação da aurora: 1 mantém, abaixo de 1 lava */
  auroraSat: number;
};

export const PALETAS: Paleta[] = [
  {
    id: 'original', nome: 'Original',
    acaoClara: '#065CF5', acaoEscura: '#4C8BFF', inkClaro: '#FFFFFF', inkEscuro: '#04102B',
    alcancado: '#DDF62C', alcancadoInk: '#0A0A0A',
    auroraHue: 0, auroraSat: 1,
  },
  {
    id: 'amora', nome: 'Amora',
    acaoClara: '#6B3BF5', acaoEscura: '#9B7BFF', inkClaro: '#FFFFFF', inkEscuro: '#150B2B',
    alcancado: '#2BE8C8', alcancadoInk: '#04211C',
    auroraHue: 40, auroraSat: 1.05,
  },
  {
    /* ⚠️ CHAMAVA-SE FRAMBOESA, e o nome não cabia. As cinco ficam numa
       fileira só, e numa fileira de cinco cada rótulo tem 65 pixels:
       "Framboesa" pedia 66 e aparecia como "Framboe…". Nome de paleta é
       rótulo antes de ser poesia — e pitaia, que é magenta por dentro e
       âmbar por fora, diz a mesma cor em seis letras. */
    id: 'pitaia', nome: 'Pitaia',
    acaoClara: '#C4187F', acaoEscura: '#F06FB4', inkClaro: '#FFFFFF', inkEscuro: '#2B0418',
    alcancado: '#FFC93C', alcancadoInk: '#2B1E04',
    auroraHue: 110, auroraSat: 1.1,
  },
  {
    id: 'brasa', nome: 'Brasa',
    acaoClara: '#C2410C', acaoEscura: '#FB923C', inkClaro: '#FFFFFF', inkEscuro: '#2B1004',
    alcancado: '#FFD84D', alcancadoInk: '#2B2004',
    auroraHue: 165, auroraSat: 1.05,
  },
  {
    id: 'floresta', nome: 'Floresta',
    acaoClara: '#15803D', acaoEscura: '#4ADE80', inkClaro: '#FFFFFF', inkEscuro: '#042B14',
    alcancado: '#FFD84D', alcancadoInk: '#2B2004',
    auroraHue: -85, auroraSat: 0.95,
  },
];

export const paletaDe = (id?: string) => PALETAS.find((x) => x.id === id) ?? PALETAS[0];

/* A paleta calculada fica guardada por id e modo. `useTheme` roda em toda
   tela e a cada render: sem isto, cada um deles receberia um objeto novo
   e recém-misturado, e a comparação por identidade que o React usa para
   decidir o que redesenhar pararia de valer em cima de um valor que muda
   cinco vezes por ano. */
const guardadas = new Map<string, Palette>();

export function comPaleta(p: Palette, id: string | undefined, isDark: boolean): Palette {
  const pal = paletaDe(id);
  if (pal.id === 'original') return p;

  const chave = `${pal.id}:${isDark ? 'd' : 'l'}`;
  const pronta = guardadas.get(chave);
  if (pronta) return pronta;

  const base = isDark ? pal.acaoEscura : pal.acaoClara;
  const ink = isDark ? pal.inkEscuro : pal.inkClaro;
  const alc = pal.alcancado;

  const feita: Palette = {
    ...p,

    /* ---- a cor que age ---- */
    accent: base,
    /* No claro o segundo tom é mais fundo que o primeiro; no escuro é
       mais claro — a mesma inversão que o azul do tema já fazia. */
    accent2: isDark ? mix(base, BRANCO, 0.18) : escurecer(base, 0.24),
    accentInk: ink,
    accentWeak: alfa(base, isDark ? 0.14 : 0.08),
    accentLine: alfa(base, isDark ? 0.28 : 0.2),
    gradFrom: base,
    gradTo: escurecer(base, isDark ? 0.3 : 0.24),
    /* O painel de destaque é a rampa curta: claro em cima, cheio no meio,
       fundo embaixo. */
    panelFrom: mix(base, BRANCO, isDark ? 0 : 0.22),
    panelMid: base,
    panelTo: escurecer(base, 0.5),
    /* A rampa longa começa quase noturna e termina no fundo da tela. */
    altFrom: mix(base, BRANCO, 0.1),
    altMid: escurecer(base, 0.58),
    altTo: escurecer(base, 0.88),
    /* A pastilha do "Inicial", no perfil: a lavagem mais pálida da cor. */
    bluePale: isDark ? escurecer(base, 0.7) : mix(base, p.bg, 0.78),
    /* O VÉU É A PRÓPRIA COR, quase preta. Assim ele escurece a aurora sem
       arrastá-la de volta para o azul — e a paleta chega até a maior
       superfície do aplicativo inteira, e não só até a imagem. */
    veu: escurecer(base, 0.93),

    /* ---- a cor do alcançado ---- */
    lime: alc,
    limeDim: escurecer(alc, 0.1),
    limeInk: pal.alcancadoInk,
    limeWeak: alfa(alc, isDark ? 0.16 : 0.18),
    /* O selo é lavagem com tinta escura por cima; no escuro é o
       contrário: véu da cor com a própria cor por tinta. */
    limeSoft: isDark ? alfa(alc, 0.16) : mix(alc, BRANCO, 0.62),
    limeSoftInk: isDark ? alc : escurecer(alc, 0.62),
    limePale: isDark ? escurecer(alc, 0.68) : mix(alc, BRANCO, 0.82),
    /* `green` é legado do tema v1 e aponta para o mesmo alcançado; segue
       junto para não ficar um verde solto no meio de uma paleta vinho. */
    green: alc,
    greenDim: escurecer(alc, 0.1),
  };

  guardadas.set(chave, feita);
  return feita;
}
