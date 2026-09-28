import React from 'react';
import { Animated, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useStore } from '../logic/store';
import { PALETAS } from '../theme';

/* ============================================================
   A MANCHA DE LUZ — a espera do plano e o alto dele

   Três manchas de luz em SVG, cada uma um gradiente radial que some no
   fundo da tela. Elas não são imagem: o movimento é só de lugar e de
   tamanho, e um gradiente esticado continua um gradiente — a imagem da
   aurora esticada desenhava as faixas de luz deformadas (28/09/2026,
   pedido do dono, com a referência em vídeo).

   `p` vai de 0 a 1 e tem três paradas:
     0    a mancha repousa no pé da tela (a espera);
     0.5  ela subiu e cobre a tela inteira;
     1    ela recuou para o alto e é o cabeçalho do plano.
   O plano desenha a mesma mancha parada em 1 — por isso a espera termina
   exatamente no quadro em que o plano começa.

   ⚠️ A COR SEGUE A PALETA pelo mesmo giro de matiz que as auroras levam
   (ver scripts/gerar-aurora.mjs): as cores de base são as azuis da
   original, giradas por `auroraHue`.
   ============================================================ */

type Quadro = { x: number; y: number; rx: number; ry: number; o: number };
type Mancha = { cor: string; meio: number; quadros: [Quadro, Quadro, Quadro] };

/** os azuis da paleta original, antes do giro */
const BASE = { ceu: '#78B9FF', funda: '#2A4DF2', ciano: '#3CCBF6' };

function giro(hex: string, graus: number, sat: number): string {
  const n = parseInt(hex.slice(1), 16);
  let r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  h = (((h + graus) % 360) + 360) % 360;
  s = Math.min(1, s * sat);
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
    : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  const to = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

function useCores() {
  const id = useStore((s) => (s.S as any).paleta as string | undefined);
  const p = PALETAS.find((x) => x.id === id) ?? PALETAS[0];
  return React.useMemo(() => ({
    ceu: giro(BASE.ceu, p.auroraHue, p.auroraSat),
    funda: giro(BASE.funda, p.auroraHue, p.auroraSat),
    ciano: giro(BASE.ciano, p.auroraHue, p.auroraSat),
  }), [p.auroraHue, p.auroraSat]);
}

const PARADO = new Animated.Value(1);
const R = 400;   // o raio da mancha desenhada; o tamanho vem da escala

/** A mancha. `papel` é onde o cabeçalho do plano termina (no fim, a luz
    some logo abaixo dele). Sem `p`, ela fica parada no cabeçalho. */
export function ManchaDeLuz({ p = PARADO, largura: W, altura: H, papel: T }: {
  p?: Animated.Value;
  largura: number;
  altura: number;
  papel: number;
}) {
  const cor = useCores();
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  /* Os três quadros de cada mancha: repouso, tela cheia, cabeçalho. */
  const manchas: Mancha[] = [
    { cor: cor.ceu, meio: 0.55, quadros: [
      { x: W * 0.5, y: H * 1.12, rx: W * 1.1, ry: H * 0.3, o: 0.9 },
      { x: W * 0.5, y: H * 0.5, rx: W * 1.7, ry: H * 1.05, o: 1 },
      { x: W * 0.55, y: -T * 0.05, rx: W * 1.5, ry: T * 1.2, o: 0.95 },
    ] },
    { cor: cor.funda, meio: 0.5, quadros: [
      { x: W * 0.45, y: H * 1.0, rx: W * 0.95, ry: H * 0.34, o: 1 },
      { x: W * 0.45, y: H * 0.34, rx: W * 1.25, ry: H * 0.62, o: 1 },
      { x: W * 0.2, y: -T * 0.3, rx: W * 0.95, ry: T * 0.85, o: 0.9 },
    ] },
    { cor: cor.ciano, meio: 0.45, quadros: [
      { x: W * 0.62, y: H * 1.08, rx: W * 0.6, ry: H * 0.14, o: 0.85 },
      { x: W * 0.55, y: H * 0.95, rx: W * 1.3, ry: H * 0.5, o: 1 },
      { x: W * 0.85, y: T * 0.05, rx: W * 1.0, ry: T * 0.8, o: 0.9 },
    ] },
  ];
  const quadro = (m: Mancha, k: keyof Quadro, f = (v: number) => v) =>
    p.interpolate({ inputRange: [0, 0.5, 1], outputRange: m.quadros.map((q) => f(q[k])) });

  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, overflow: 'hidden' }}>
      {manchas.map((m, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute', left: -R, top: -R, width: 2 * R, height: 2 * R,
            opacity: quadro(m, 'o'),
            transform: [
              { translateX: quadro(m, 'x') },
              { translateY: quadro(m, 'y') },
              { scaleX: quadro(m, 'rx', (v) => v / R) },
              { scaleY: quadro(m, 'ry', (v) => v / R) },
            ],
          }}
        >
          <Svg width={2 * R} height={2 * R}>
            <Defs>
              <RadialGradient id={`${id}m${i}`} cx="50%" cy="50%" r="50%">
                <Stop offset="0" stopColor={m.cor} stopOpacity={1} />
                <Stop offset={m.meio} stopColor={m.cor} stopOpacity={0.75} />
                <Stop offset="1" stopColor={m.cor} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Rect x={0} y={0} width={2 * R} height={2 * R} fill={`url(#${id}m${i})`} />
          </Svg>
        </Animated.View>
      ))}
    </View>
  );
}
