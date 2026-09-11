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

   A régua ficou: 12 · 14 · 15 · 17 · 19 · 20 · 30 · 32 · 36 */
export const ty = {
  /** manchete do hero — o peso leve é intencional */
  display: { fontFamily: font.light, fontSize: 32, lineHeight: 38 },
  /** número grande em destaque (streak) */
  h1: { fontFamily: font.display, fontSize: 32, lineHeight: 40 },
  /** título de seção — "Suas metas diárias" */
  h2: { fontFamily: font.display, fontSize: 20, lineHeight: 26 },
  /** título de card — "Ingestão de proteína" */
  title: { fontFamily: font.body, fontSize: 19, lineHeight: 25 },
  /** valor numérico — "57g", "−16,5 kg" */
  metric: { fontFamily: font.body, fontSize: 30, lineHeight: 37 },
  body: { fontFamily: font.body, fontSize: 17, lineHeight: 23 },
  bodyMed: { fontFamily: font.bodyMed, fontSize: 17, lineHeight: 23 },
  /** link de seção e tab ativa — "Ir para metas" */
  label: { fontFamily: font.bodyMed, fontSize: 15, lineHeight: 20 },
  /** legenda — "Faltam 33 g", "Meta: −23 kg", eixos */
  note: { fontFamily: font.light, fontSize: 15, lineHeight: 21 },
  /** sub de item de lista — "3 novas mensagens" */
  caption: { fontFamily: font.body, fontSize: 14, lineHeight: 18 },
  /** overline em caixa alta e selos — "SUA ESPECIALISTA", "PARA HOJE" */
  micro: { fontFamily: font.body, fontSize: 12, lineHeight: 15 },
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
