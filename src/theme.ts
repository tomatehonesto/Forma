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

export const BRAND = 'Forma';

export type Palette = {
  bg: string; bg1: string; bg2: string; bg3: string;
  tx: string; tx2: string; tx3: string; tx4: string;
  line: string; line2: string;
  accent: string; accent2: string; accentInk: string;
  accentWeak: string; accentLine: string;
  lime: string; limeDim: string; limeInk: string; limeWeak: string;
  limePale: string; bluePale: string; teal: string; tealPale: string;
  deepFrom: string; deepTo: string; deepGlow: string;
  green: string; greenDim: string; blue: string; blueDim: string;
  good: string; bad: string;
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

  /* Véus de destaque — a superfície de ênfase do app é CLARA. Em vez de
     um bloco escuro (que brigaria com o resto), duas lavagens difusas das
     próprias cores da marca sobre branco: lima no alto, azul embaixo.
     É o tratamento de malha suave, não cor chapada. */
  deepFrom: 'rgba(221,246,44,0.13)', deepTo: 'rgba(6,92,245,0.07)',
  deepGlow: 'rgba(255,255,255,0)',

  // legado do tema v1 — sem uso nas telas, mantidos só para
  // não quebrar o tipo Palette                               [infer]
  green: '#DDF62C', greenDim: '#C7DD2A', blue: '#065CF5', blueDim: '#003FEF',

  // estado                                                   [figma p/ bad]
  good: '#065CF5', bad: '#D51A1A',

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
  deepFrom: 'rgba(221,246,44,0.16)', deepTo: 'rgba(76,139,255,0.14)',
  deepGlow: 'rgba(255,255,255,0)',

  green: '#DDF62C', greenDim: '#C7DD2A', blue: '#4C8BFF', blueDim: '#6BA1FF',

  good: '#4C8BFF', bad: '#FF5A5A',

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

/* Raios do frame: 8 · 12 · 24 · 32 · pill. 32 é o dominante
   (cards e superfícies agrupadas).                           [figma] */
export const radius = { sm: 8, md: 12, lg: 24, xl: 32, pill: 999 };

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

/* Escala tipográfica — tamanhos e entrelinhas lidos do frame. [figma] */
export const ty = {
  /** manchete do hero — 34/300, o peso leve é intencional */
  display: { fontFamily: font.light, fontSize: 34, lineHeight: 37 },
  /** número grande em destaque (streak) */
  h1: { fontFamily: font.display, fontSize: 30, lineHeight: 38 },
  /** título de seção — "Suas metas diárias" */
  h2: { fontFamily: font.display, fontSize: 18, lineHeight: 23 },
  /** título de card — "Ingestão de proteína" */
  title: { fontFamily: font.body, fontSize: 18, lineHeight: 23 },
  /** valor numérico — "57g", "−16,5 kg" */
  metric: { fontFamily: font.body, fontSize: 28, lineHeight: 35 },
  body: { fontFamily: font.body, fontSize: 16, lineHeight: 20 },
  bodyMed: { fontFamily: font.bodyMed, fontSize: 16, lineHeight: 20 },
  /** link de seção e tab ativa — "Ir para metas" */
  label: { fontFamily: font.bodyMed, fontSize: 14, lineHeight: 20 },
  /** legenda — "Faltam 33 g", "Meta: −23 kg", eixos */
  note: { fontFamily: font.light, fontSize: 14, lineHeight: 18 },
  /** sub de item de lista — "3 novas mensagens" */
  caption: { fontFamily: font.body, fontSize: 12, lineHeight: 15 },
  /** overline — "SUA ESPECIALISTA", "PARA HOJE" */
  micro: { fontFamily: font.body, fontSize: 10, lineHeight: 13 },
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
