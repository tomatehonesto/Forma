import React from 'react';
import { Animated, Easing, View } from 'react-native';
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
  cor: string;
  /** o centro, o tamanho (fixo) e a opacidade */
  x: number; rx: number; ry: number; o: number;
  /** a altura do centro na partida e na chegada */
  de: number; ate: number;
};

/** os azuis da paleta original, antes do giro */
const BASE = {
  ceu: '#78B9FF', funda: '#2A4DF2', ciano: '#3CCBF6', faixa: '#3E82F0',
  /* os tons de apoio: um anil mais fechado e um brilho quase branco, que
     dão a nuance entre as cores maiores (pedido do dono) */
  anil: '#3B2FD6', brilho: '#B9D6FF',
};

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
    anil: giro(BASE.anil, p.auroraHue, p.auroraSat),
    brilho: giro(BASE.brilho, p.auroraHue, p.auroraSat),
  }), [p.auroraHue, p.auroraSat]);
}

/* ⚠️ A BORDA SOME AOS POUCOS (pedido do dono: "os raios ainda estão muito
   marcados"). Com três paradas — cheio, meio, nada — o olho achava a
   borda de cada elipse. Seis paradas numa curva de sino (a opacidade cai
   devagar no começo, rápido no meio e devagar de novo no fim) apagam a
   borda; e a mancha cresce um pouco para a cor ocupar o mesmo lugar. */
const DESFOQUE: [number, number][] = [[0, 0.95], [0.2, 0.85], [0.4, 0.6], [0.6, 0.32], [0.8, 0.1], [1, 0]];
const CRESCE = 1.18;

const PARADO = new Animated.Value(1);
const R = 400;   // o raio da mancha desenhada; o tamanho vem da escala

/** A mancha. `papel` é onde o cabeçalho do plano termina (no fim, a luz
    some logo abaixo dele). Sem `p`, ela fica parada no cabeçalho. */
export function ManchaDeLuz({ p = PARADO, largura: W, altura: H, papel: T, viva }: {
  p?: Animated.Value;
  /** a luz derivando devagar enquanto espera (a espera do plano) */
  viva?: boolean;
  largura: number;
  altura: number;
  papel: number;
}) {
  const cor = useCores();
  /* ⚠️ A LUZ SE MEXE ENQUANTO ESPERA (pedido do dono). Cada mancha deriva
     num pequeno círculo, cada uma num ponto diferente da volta, e a
     deriva some conforme a luz sobe — no cabeçalho ela está parada, e o
     plano, que desenha a mesma luz sem deriva, emenda sem pulo. */
  const deriva = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    if (!viva) return;
    const laco = Animated.loop(Animated.timing(deriva, {
      toValue: 1, duration: 7000, easing: Easing.linear, useNativeDriver: true,
    }));
    laco.start();
    return () => laco.stop();
  }, [viva]);
  const PONTOS = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
  const onda = (fase: number, amplitude: number) => Animated.multiply(
    deriva.interpolate({
      inputRange: PONTOS,
      outputRange: PONTOS.map((t) => Math.sin((t + fase) * 2 * Math.PI) * amplitude),
    }),
    p.interpolate({ inputRange: [0, 1], outputRange: [1, 0], extrapolate: 'clamp' }),
  );
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  /* Da de trás para a da frente. Na partida só a funda aparece, no pé; as
     outras esperam abaixo da tela, cada uma mais longe — quanto mais longe
     ela parte, mais rápido sobe, e é essa diferença que desenha a onda. */
  const manchas: Mancha[] = [
    /* ⚠️ A BORDA DE BAIXO NÃO É RETA (pedido do dono): no cabeçalho, as
       manchas grandes param em alturas diferentes — o céu desce mais à
       esquerda, o ciano e o segundo céu ficam mais altos à direita, e a
       faixa média faz uma barriga do lado esquerdo. Com uma mancha larga
       só, a luz terminava numa linha, como um degradê linear. */
    { cor: cor.ceu, x: W * 0.3, rx: W * 1.15, ry: T * 1.2, o: 0.95, de: H * 1.9, ate: T * 0.02 },
    { cor: cor.ceu, x: W * 0.88, rx: W * 0.85, ry: T * 0.85, o: 0.85, de: H * 1.8, ate: -T * 0.12 },
    { cor: cor.ciano, x: W * 0.72, rx: W * 0.95, ry: T * 0.95, o: 0.9, de: H * 1.57, ate: -T * 0.02 },
    { cor: cor.funda, x: W * 0.45, rx: W * 0.95, ry: H * 0.36, o: 1, de: H * 1.02, ate: -T * 0.55 },
    { cor: cor.faixa, x: W * 0.28, rx: W * 0.95, ry: T * 0.5, o: 0.6, de: H * 2.35, ate: T * 0.72 },
    /* Os tons de apoio. Na espera eles já aparecem no pé, em volta da
       funda — o anil à esquerda, um ciano à direita e o brilho no meio —,
       para a mancha em repouso não ser um azul só. Na subida o anil e o
       ciano de baixo atravessam e saem; no cabeçalho ficam um anil no
       canto e o brilho sobre o céu. */
    { cor: cor.anil, x: W * 0.12, rx: W * 0.7, ry: H * 0.26, o: 0.75, de: H * 1.06, ate: -T * 0.75 },
    { cor: cor.ciano, x: W * 0.85, rx: W * 0.65, ry: H * 0.2, o: 0.85, de: H * 0.98, ate: -T * 0.2 },
    { cor: cor.anil, x: W * 0.95, rx: W * 0.55, ry: T * 0.5, o: 0.45, de: H * 1.75, ate: -T * 0.2 },
    { cor: cor.brilho, x: W * 0.4, rx: W * 0.5, ry: H * 0.12, o: 0.55, de: H * 1.0, ate: T * 0.25 },
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
              { translateX: viva ? Animated.add(m.x, onda(i * 0.21, W * 0.09)) : m.x },
              { translateY: viva
                ? Animated.add(p.interpolate({ inputRange: [0, 1], outputRange: [m.de, m.ate] }), onda(i * 0.21 + 0.25, H * 0.035))
                : p.interpolate({ inputRange: [0, 1], outputRange: [m.de, m.ate] }) },
              { scaleX: (m.rx * CRESCE) / R },
              { scaleY: (m.ry * CRESCE) / R },
            ],
          }}
        >
          <Svg width={2 * R} height={2 * R}>
            <Defs>
              <RadialGradient id={`${id}m${i}`} cx="50%" cy="50%" r="50%">
                {DESFOQUE.map(([onde, quanto]) => (
                  <Stop key={onde} offset={onde} stopColor={m.cor} stopOpacity={quanto} />
                ))}
              </RadialGradient>
            </Defs>
            <Rect x={0} y={0} width={2 * R} height={2 * R} fill={`url(#${id}m${i})`} />
          </Svg>
        </Animated.View>
      ))}
    </View>
  );
}
