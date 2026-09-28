import React from 'react';
import { Animated, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useStore } from '../logic/store';
import { PALETAS } from '../theme';

/* ============================================================
   A MANCHA DE LUZ — a espera do plano e o alto dele

   Quatro manchas de luz em SVG, cada uma um gradiente radial que some no
   fundo da tela. Elas não são imagem, e não esticam: a imagem da aurora
   esticada deformava as faixas de luz, e a mancha que só esticava e
   encolhia parecia elástica (28/09/2026, pedido do dono, com o vídeo de
   referência visto quadro a quadro).

   O QUE A REFERÊNCIA FAZ: as camadas sobem juntas, cada uma numa
   velocidade — a azul funda atravessa a tela e sai pelo alto, o ciano e
   o céu vêm atrás e ficam, e uma faixa azul média sobe com o branco logo
   embaixo dela, até parar onde o cabeçalho termina. Por isso cada mancha
   aqui tem só dois quadros, o de partida e o de chegada, e o tamanho não
   muda: o que muda é a distância que cada uma percorre. A curva do
   tempo (quem anima `p`) é rápida no começo e longa no fim.

     0    a mancha repousa no pé da tela (a espera);
     1    ela é o cabeçalho do plano.
   O plano desenha a mesma mancha parada em 1 — por isso a espera termina
   exatamente no quadro em que o plano começa.

   ⚠️ A COR SEGUE A PALETA pelo mesmo giro de matiz que as auroras levam
   (ver scripts/gerar-aurora.mjs): as cores de base são as azuis da
   original, giradas por `auroraHue`.
   ============================================================ */

type Mancha = {
  cor: string; meio: number;
  /** o centro, o tamanho (fixo) e a opacidade */
  x: number; rx: number; ry: number; o: number;
  /** a altura do centro na partida e na chegada */
  de: number; ate: number;
};

/** os azuis da paleta original, antes do giro */
const BASE = { ceu: '#78B9FF', funda: '#2A4DF2', ciano: '#3CCBF6', faixa: '#3E82F0' };

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
    faixa: giro(BASE.faixa, p.auroraHue, p.auroraSat),
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
  /* Da de trás para a da frente. Na partida só a funda aparece, no pé; as
     outras esperam abaixo da tela, cada uma mais longe — quanto mais longe
     ela parte, mais rápido sobe, e é essa diferença que desenha a onda. */
  const manchas: Mancha[] = [
    { cor: cor.ceu, meio: 0.55, x: W * 0.5, rx: W * 1.6, ry: T * 1.15, o: 0.95, de: H * 1.9, ate: -T * 0.05 },
    { cor: cor.ciano, meio: 0.45, x: W * 0.62, rx: W * 1.2, ry: T * 1.0, o: 0.9, de: H * 1.57, ate: T * 0.08 },
    { cor: cor.funda, meio: 0.5, x: W * 0.45, rx: W * 0.95, ry: H * 0.36, o: 1, de: H * 1.02, ate: -T * 0.55 },
    { cor: cor.faixa, meio: 0.35, x: W * 0.5, rx: W * 1.5, ry: T * 0.55, o: 0.6, de: H * 2.35, ate: T * 0.72 },
  ];

  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, overflow: 'hidden' }}>
      {manchas.map((m, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute', left: -R, top: -R, width: 2 * R, height: 2 * R,
            opacity: m.o,
            transform: [
              { translateX: m.x },
              { translateY: p.interpolate({ inputRange: [0, 1], outputRange: [m.de, m.ate] }) },
              { scaleX: m.rx / R },
              { scaleY: m.ry / R },
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
