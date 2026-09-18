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
   A COR DO APLICATIVO

   O azul e o lima são a marca, e o lima não se mexe: ele é a cor do
   alcançado em toda tela deste app — check-in feito, meta batida, nível
   de conquista —, e trocá-lo por escolha de preferência quebraria a
   única regra de cor que o aplicativo inteiro obedece.

   O que se troca é a COR DE AÇÃO: botão, link, tab ativa, painel de
   destaque, gradiente do retrato. Ela é azul por padrão e continua
   sendo até alguém decidir o contrário.

   ⚠️ NENHUMA PALETA CHEGA PERTO DO LIMA NEM DO TEAL. Verde e amarelo
   ficaram de fora de propósito: lima já significa "alcançado" e o teal
   já é a barra de exercício. Uma cor de ação vizinha delas faria a tela
   inteira dizer a mesma coisa em dois tons parecidos, que é como se
   perde um código de cor que levou o app inteiro para ser construído.

   UMA COR-BASE POR MODO, E O RESTO SAI DELA. Ajustar doze tons à mão
   para cada paleta seria doze chances de uma delas divergir; aqui a
   família inteira — véu, fio, gradiente do painel, rampa do fundo
   escuro — é calculada da base, com as mesmas proporções do azul
   original. Adicionar uma paleta é escrever duas cores.
   ============================================================ */

const canal = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
const hex2 = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');

/** Mistura duas cores. t=0 devolve a primeira, t=1 a segunda. */
export const mix = (a: string, b: string, t: number) =>
  `#${[0, 1, 2].map((i) => hex2(canal(a, i) + (canal(b, i) - canal(a, i)) * t)).join('')}`;

/** A mesma cor, com alfa. É como o véu e o fio da cor de ação nascem. */
export const alfa = (hex: string, a: number) =>
  `rgba(${canal(hex, 0)},${canal(hex, 1)},${canal(hex, 2)},${a})`;

const BRANCO = '#FFFFFF';

/* ⚠️ ESCURECER NÃO É MISTURAR COM O AZUL DA NOITE.

   A primeira versão fazia as pontas escuras da rampa misturando a cor
   com #05143F, que é o azul-noite do tema. Funcionava para o azul, e
   virava lama para o resto: âmbar misturado com azul é cinza, porque são
   complementares — a tela de Insights ficou um borrão sem cor nenhuma.

   Multiplicar os canais em direção ao preto preserva a matiz: âmbar
   escuro continua âmbar, violeta escuro continua violeta. */
const escurecer = (hex: string, t: number) =>
  `#${[0, 1, 2].map((i) => hex2(canal(hex, i) * (1 - t))).join('')}`;

export type Cor = {
  id: string;
  nome: string;
  /** a cor de ação no tema claro e no escuro — o resto sai daqui */
  claro: string;
  escuro: string;
  /** a tinta que vai POR CIMA da cor cheia, em cada modo */
  inkClaro: string;
  inkEscuro: string;
};

export const CORES: Cor[] = [
  /* O AZUL É O PRIMEIRO E É O PADRÃO, com os valores exatos do Figma:
     quem não escolher nada continua vendo o aplicativo que foi
     desenhado, e não uma aproximação calculada dele. */
  { id: 'azul', nome: 'Azul', claro: '#065CF5', escuro: '#4C8BFF', inkClaro: '#FFFFFF', inkEscuro: '#04102B' },
  { id: 'violeta', nome: 'Violeta', claro: '#6B3BF5', escuro: '#9B7BFF', inkClaro: '#FFFFFF', inkEscuro: '#150B2B' },
  { id: 'magenta', nome: 'Magenta', claro: '#C4187F', escuro: '#F06FB4', inkClaro: '#FFFFFF', inkEscuro: '#2B0418' },
  { id: 'ambar', nome: 'Âmbar', claro: '#B4610A', escuro: '#F0A24A', inkClaro: '#FFFFFF', inkEscuro: '#2B1604' },
  { id: 'grafite', nome: 'Grafite', claro: '#2E3440', escuro: '#B6BECC', inkClaro: '#FFFFFF', inkEscuro: '#14181F' },
];

export const corDe = (id?: string) => CORES.find((x) => x.id === id) ?? CORES[0];

/* A PALETA INTEIRA, COM A COR DE AÇÃO TROCADA.

   Devolve o mesmo objeto quando a cor é o azul padrão: sem isso, cada
   render recalcularia doze tons para chegar exatamente onde o Figma já
   estava — e o `===` que o React usa para comparar deixaria de valer. */
/* A paleta calculada fica guardada por cor e modo. `useTheme` roda em
   toda tela e a cada render: sem isto, cada um deles receberia um objeto
   novo e recém-misturado, e a comparação por identidade que o React usa
   para decidir o que redesenhar pararia de valer em cima de um valor que
   muda cinco vezes por ano. */
const guardadas = new Map<string, Palette>();

/* AS DUAS ESCOLHAS, NUMA CHAMADA SÓ. A ação e o destaque são
   independentes — trocar uma não mexe na outra — e quem combina as duas
   é esta função, para que nenhuma tela precise saber que existe escolha
   de cor. */
export function comPaleta(p: Palette, cor: string | undefined, destaque: string | undefined, isDark: boolean): Palette {
  return comDestaque(comCor(p, cor, isDark), destaque, isDark);
}

export function comCor(p: Palette, id: string | undefined, isDark: boolean): Palette {
  const cor = corDe(id);
  if (cor.id === 'azul') return p;

  const chave = `${cor.id}:${isDark ? 'd' : 'l'}`;
  const pronta = guardadas.get(chave);
  if (pronta) return pronta;

  const base = isDark ? cor.escuro : cor.claro;
  const ink = isDark ? cor.inkEscuro : cor.inkClaro;

  const paleta: Palette = {
    ...p,
    accent: base,
    /* No claro o segundo tom é mais FUNDO que o primeiro; no escuro é
       mais claro — a mesma inversão que o azul do tema já fazia. */
    accent2: isDark ? mix(base, BRANCO, 0.18) : escurecer(base, 0.24),
    accentInk: ink,
    accentWeak: alfa(base, isDark ? 0.14 : 0.08),
    accentLine: alfa(base, isDark ? 0.28 : 0.2),
    gradFrom: base,
    gradTo: escurecer(base, isDark ? 0.3 : 0.24),
    /* O painel de destaque é a rampa curta: claro em cima, cheio no meio,
       fundo embaixo. */
    panelFrom: mix(base, BRANCO, isDark ? 0.0 : 0.22),
    panelMid: base,
    panelTo: escurecer(base, 0.5),
    /* A rampa longa do Insights começa quase noturna e termina no fundo
       da tela. */
    altFrom: mix(base, BRANCO, 0.1),
    altMid: escurecer(base, 0.58),
    altTo: escurecer(base, 0.88),
    /* A pastilha do "Inicial", no perfil: a lavagem mais pálida da cor. */
    bluePale: isDark ? escurecer(base, 0.7) : mix(base, p.bg, 0.78),
  };

  guardadas.set(chave, paleta);
  return paleta;
}

/* ============================================================
   A COR DE DESTAQUE

   O lima é a cor do ALCANÇADO neste app: check-in feito, meta batida,
   nível de conquista, botão de começar. Essa função não muda — o que
   muda é a tinta que a cumpre.

   E é uma função, não decoração: o app inteiro lê "esta coisa aconteceu"
   quando vê essa cor. Por isso todas as opções são claras e saturadas,
   com tinta escura por cima: uma cor de destaque escura inverteria a
   leitura, e "alcançado" passaria a parecer "desativado".

   ⚠️ NENHUMA DELAS É A COR DE AÇÃO. Destaque e ação precisam se separar
   à primeira vista — se as duas forem azuis, o botão que leva a algum
   lugar e a marca do que já foi feito viram a mesma coisa. Quem escolhe
   as duas pode chegar perto; a tela de aparência mostra o par junto,
   justamente para essa escolha ser feita olhando.
   ============================================================ */
export type Destaque = {
  id: string;
  nome: string;
  /** a cor cheia */
  claro: string;
  /** a tinta que vai por cima dela — escura em todas, de propósito */
  ink: string;
};

export const DESTAQUES: Destaque[] = [
  { id: 'lima', nome: 'Lima', claro: '#DDF62C', ink: '#0A0A0A' },
  { id: 'turquesa', nome: 'Turquesa', claro: '#2BE8C8', ink: '#04211C' },
  { id: 'coral', nome: 'Coral', claro: '#FF8A5B', ink: '#2B0F04' },
  { id: 'ouro', nome: 'Ouro', claro: '#FFC93C', ink: '#2B1E04' },
  { id: 'rosa', nome: 'Rosa', claro: '#FF85B3', ink: '#2B0715' },
];

export const destaqueDe = (id?: string) => DESTAQUES.find((x) => x.id === id) ?? DESTAQUES[0];

/* A FAMÍLIA DO DESTAQUE, derivada da cor cheia como a da ação é da dela.

   São sete tons e cada um tem um papel que já existia no tema: o cheio,
   o rebaixado da barra, a tinta por cima, o véu de fundo, a lavagem do
   selo com a sua tinta escura, e a pálida da barra de meta. */
function comDestaque(p: Palette, id: string | undefined, isDark: boolean): Palette {
  const d = destaqueDe(id);
  if (d.id === 'lima') return p;

  const base = d.claro;
  return {
    ...p,
    lime: base,
    limeDim: escurecer(base, 0.1),
    limeInk: d.ink,
    limeWeak: alfa(base, isDark ? 0.16 : 0.18),
    /* O selo é lavagem com tinta escura por cima, e no escuro é o
       contrário: véu da cor com a própria cor por tinta. */
    limeSoft: isDark ? alfa(base, 0.16) : mix(base, BRANCO, 0.62),
    limeSoftInk: isDark ? base : escurecer(base, 0.62),
    limePale: isDark ? escurecer(base, 0.68) : mix(base, BRANCO, 0.82),
    /* `green` é legado do tema v1 e aponta para o mesmo lima; segue
       junto para não ficar um verde solto no meio de uma paleta rosa. */
    green: base,
    greenDim: escurecer(base, 0.1),
  };
}
