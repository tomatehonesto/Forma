/* ============================================================
   Forma — design tokens (single source of truth)
   Palette: green + blue (vibrant, premium) over warm off-white.
   Change BRAND or the accent hexes here and the whole app follows.
   ============================================================ */

export const BRAND = 'Forma';

export type Palette = {
  bg: string; bg1: string; bg2: string; bg3: string;
  tx: string; tx2: string; tx3: string; tx4: string;
  line: string; line2: string;
  accent: string; accent2: string; accentInk: string;
  accentWeak: string; accentLine: string;
  green: string; greenDim: string; blue: string; blueDim: string;
  good: string;
  cta: string; cta2: string; ctaInk: string; ctaWeak: string; ctaLine: string;
  water: string; waterBg: string;
  purple: string; purpleBg: string;
  amber: string; amberBg: string;
  rose: string; roseBg: string;
  gradFrom: string; gradTo: string;
  track: string; shadow: string; scrim: string;
};

export const light: Palette = {
  bg: '#F4F7F5', bg1: '#FFFFFF', bg2: '#EDF2EF', bg3: '#E3EAE6',
  tx: '#0F2E38', tx2: '#45606A', tx3: '#7B919B', tx4: '#A7B9BF',
  line: '#E7ECE9', line2: '#DBE3DF',
  accent: '#0FB981', accent2: '#2E86C7', accentInk: '#FFFFFF',
  accentWeak: 'rgba(15,185,129,0.10)', accentLine: 'rgba(15,185,129,0.22)',
  green: '#0FB981', greenDim: '#0C9E6E', blue: '#2E86C7', blueDim: '#2570AC',
  good: '#0FB981',
  cta: '#E8562C', cta2: '#F1793A', ctaInk: '#FFFFFF',
  ctaWeak: 'rgba(232,86,44,0.10)', ctaLine: 'rgba(232,86,44,0.24)',
  water: '#3E8FD0', waterBg: '#E9F2FB',
  purple: '#8B7FD4', purpleBg: '#EFEDFB',
  amber: '#DFA53C', amberBg: '#FAF1DD',
  rose: '#E27BA0', roseBg: '#FBEAF0',
  gradFrom: '#12C08A', gradTo: '#2E86C7',
  track: '#E9EEEB', shadow: 'rgba(15,46,56,0.10)', scrim: 'rgba(15,46,56,0.38)',
};

export const dark: Palette = {
  bg: '#0D1618', bg1: '#152220', bg2: '#1B2825', bg3: '#243330',
  tx: '#EAF3EF', tx2: '#AFC3BE', tx3: '#7F8A94', tx4: '#5C6E72',
  line: 'rgba(255,255,255,0.08)', line2: 'rgba(255,255,255,0.13)',
  accent: '#2ED3A0', accent2: '#4FA6E0', accentInk: '#04211A',
  accentWeak: 'rgba(46,211,160,0.14)', accentLine: 'rgba(46,211,160,0.28)',
  green: '#2ED3A0', greenDim: '#25B489', blue: '#4FA6E0', blueDim: '#3E8CC4',
  good: '#2ED3A0',
  cta: '#F1662F', cta2: '#F7864A', ctaInk: '#FFFFFF',
  ctaWeak: 'rgba(241,102,47,0.16)', ctaLine: 'rgba(241,102,47,0.30)',
  water: '#5AA6E0', waterBg: 'rgba(90,166,224,0.15)',
  purple: '#A79BE8', purpleBg: 'rgba(167,155,232,0.15)',
  amber: '#EBBE5E', amberBg: 'rgba(235,190,94,0.15)',
  rose: '#EC93B4', roseBg: 'rgba(236,147,180,0.15)',
  gradFrom: '#2ED3A0', gradTo: '#4FA6E0',
  track: 'rgba(255,255,255,0.10)', shadow: 'rgba(0,0,0,0.40)', scrim: 'rgba(0,0,0,0.55)',
};

export const space = { xs: 4, sm: 8, md: 12, base: 16, lg: 20, xl: 24, xxl: 32, huge: 44 };
export const radius = { sm: 10, md: 14, lg: 18, xl: 24, pill: 999 };

export const font = {
  display: 'PlusJakartaSans_700Bold',
  displayX: 'PlusJakartaSans_800ExtraBold',
  bold: 'PlusJakartaSans_700Bold',
  semi: 'PlusJakartaSans_600SemiBold',
  medDisplay: 'PlusJakartaSans_500Medium',
  body: 'Inter_400Regular',
  bodyMed: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
};

// type ramp — size + line height + default family
export const ty = {
  display: { fontFamily: font.displayX, fontSize: 32, lineHeight: 37 },
  h1: { fontFamily: font.display, fontSize: 26, lineHeight: 31 },
  h2: { fontFamily: font.display, fontSize: 20, lineHeight: 25 },
  title: { fontFamily: font.semi, fontSize: 16, lineHeight: 21 },
  body: { fontFamily: font.body, fontSize: 15, lineHeight: 22 },
  bodyMed: { fontFamily: font.bodyMed, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: font.bodyMed, fontSize: 13, lineHeight: 17 },
  caption: { fontFamily: font.bodyMed, fontSize: 12, lineHeight: 16 },
  micro: { fontFamily: font.bodySemi, fontSize: 11, lineHeight: 14 },
} as const;

export const shadowCard = (p: Palette) => ({
  shadowColor: p.shadow,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 1,
  shadowRadius: 20,
  elevation: 3,
});

export const shadowSoft = (p: Palette) => ({
  shadowColor: p.shadow,
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 1,
  shadowRadius: 10,
  elevation: 2,
});
