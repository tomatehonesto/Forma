import React, { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import { Canvas, Fill, Shader, Skia, useClock } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';

/* ============================================================
   O ORBE DA MORPHI INTELLIGENCE — a estrela da marca, viva

   A presença da Morphi Intelligence no alto da conversa vazia.

   ⚠️ A HISTÓRIA, PARA NINGUÉM REFAZER O CAMINHO (30/09/2026). Passou por
   uma esfera de pontos, uma bolha iridescente, um vidro com tinta em 2D e
   uma cena 3D de vidro com tinta (raymarching). A 3D ficou bonita, mas
   não "ornava" com a tela: era um objeto de fora. A escolha do dono foi
   a MARCA — a estrela de quatro pontas que já assina a Morphi
   Intelligence no cabeçalho, no Insights e em cada resposta —, mudando
   de forma como na referência que ele trouxe. O shader 3D está no
   histórico deste arquivo, se um dia servir.

   O que se vê:
   - a estrela respira, gira devagar e se transforma num ciclo de 16
     segundos: estrela, círculo, quadrado de cantos redondos, círculo, e
     de volta à estrela — com pausa na estrela, que é a marca;
   - o corpo é o degradê da marca (azul embaixo, lima em cima), com roxo
     passando e o miolo aceso; a borda tem uma luz que corre pelos tons
     do app (ciano, lima, rosa, roxo);
   - um halo baixo em volta, que não escorre pelas pontas;
   - as duas faíscas pequenas do cacho da marca aparecem ao lado enquanto
     ela é estrela, e somem quando ela vira círculo.

   A forma é uma superelipse: com expoente menor que 1 os lados afundam
   e ela é a estrela; com 2, círculo; com 4, quadrado redondo. É 2D e
   leve: roda em resolução cheia sem pesar.

   ⚠️ COM "REDUZIR MOVIMENTO" LIGADO NO APARELHO, ELA PARA NA ESTRELA.

   Para conferir sem abrir o aplicativo: o shader compila e desenha no
   CanvasKit do Node, a mesma engine do Skia.
   ============================================================ */

const FONTE = `
uniform float2 res;
uniform float t;
uniform float3 azul;
uniform float3 fundo;
uniform float3 ciano;
uniform float3 lima;
uniform float3 roxo;
uniform float3 rosa;

// A forma: uma superelipse. Com expoente menor que 1 os lados afundam e ela
// vira a estrela de quatro pontas da marca; com 2 é círculo; com 4, um
// quadrado de cantos redondos. Devolve 1 na borda.
float forma(float2 p, float n) {
  float2 a = abs(p) + 0.0001;
  return pow(pow(a.x, n) + pow(a.y, n), 1.0 / n);
}

float2 girar(float2 p, float a) {
  float c = cos(a); float s = sin(a);
  return float2(c * p.x - s * p.y, s * p.x + c * p.y);
}

// A borda de luz: os tons do app em ciclo.
float3 tons(float h) {
  h = fract(h) * 4.0;
  float i = floor(h);
  float f = smoothstep(0.0, 1.0, fract(h));
  float3 a = ciano; float3 b = lima;
  if (i >= 1.0) { a = lima; b = rosa; }
  if (i >= 2.0) { a = rosa; b = roxo; }
  if (i >= 3.0) { a = roxo; b = ciano; }
  return mix(a, b, f);
}

half4 main(float2 pos) {
  float px = 2.0 / min(res.x, res.y);
  float2 uv = (pos - res * 0.5) * px;
  uv.y = -uv.y;

  // O ciclo, de 16 segundos: estrela, círculo, quadrado redondo, círculo,
  // estrela — com pausas na estrela, que é a marca.
  float c = fract(t / 16.0);
  float n = 0.58;
  n += 1.42 * smoothstep(0.1, 0.3, c);
  n += 2.2 * smoothstep(0.35, 0.5, c);
  n -= 2.2 * smoothstep(0.55, 0.7, c);
  n -= 1.42 * smoothstep(0.75, 0.92, c);
  float estrela = 1.0 - smoothstep(0.7, 1.3, n);

  // Respira e gira devagar.
  float R = 0.5 * (1.0 + 0.035 * sin(t * 1.3)) * mix(1.0, 0.88, smoothstep(1.0, 3.0, n));
  float2 p = girar(uv, 0.18 * sin(t * 0.35) + t * 0.05) / R;
  float f = forma(p, n);
  float d = (f - 1.0) * R * mix(0.55, 1.0, smoothstep(0.58, 2.0, n));

  float ang = atan(uv.y, uv.x);

  // O corpo: o degradê da marca, do azul (embaixo, à esquerda) para a
  // lima (em cima, à direita), com roxo passando e o miolo aceso.
  float g = clamp(dot(uv / R, normalize(float2(1.0, 1.0))) * 0.45 + 0.5 + 0.12 * sin(t * 0.4), 0.0, 1.0);
  float3 corpo = mix(azul, lima, smoothstep(0.35, 1.0, g));
  corpo = mix(corpo, roxo, smoothstep(0.35, 0.0, g) * 0.6);
  corpo = mix(corpo, float3(1.0), pow(clamp(1.0 - f, 0.0, 1.0), 2.2) * 0.55);
  // A borda de luz, com a cor correndo em volta.
  float aro = smoothstep(0.72, 0.99, f);
  corpo = mix(corpo, tons(ang / 6.2831853 + t * 0.06), aro * 0.55);
  float dentro = smoothstep(px, -px, d);

  // O brilho em volta.
  float fora = max(d, 0.0);
  // o halo fica em volta da forma, e não escorre pelas pontas da estrela
  float brilho = exp(-fora * 7.5) * 0.5 * (1.0 - dentro) * smoothstep(0.95, 0.35, length(uv));
  float3 corBrilho = mix(azul, roxo, 0.5 + 0.5 * sin(ang + t * 0.4));

  // As duas faíscas pequenas do cacho, só enquanto é estrela.
  float faisca = 0.0;
  float3 corFaisca = lima;
  float2 f1 = (uv - float2(0.66, 0.6)) / (0.19 * (1.0 + 0.1 * sin(t * 1.7)));
  float2 f2 = (uv - float2(0.8, -0.02)) / (0.12 * (1.0 + 0.1 * sin(t * 2.1 + 1.0)));
  float s1 = smoothstep(px * 6.0, -px * 6.0, forma(f1, 0.58) - 1.0);
  float s2 = smoothstep(px * 8.0, -px * 8.0, forma(f2, 0.58) - 1.0);
  faisca = max(s1 * 0.9, s2 * 0.75) * estrela;
  // o mesmo degradê da marca nas faíscas, e um brilho baixo em volta delas
  corFaisca = mix(mix(azul, lima, 0.75), float3(1.0), 0.2);
  corFaisca = mix(corFaisca, mix(azul, lima, 0.4), s2 * (1.0 - s1));
  float halo = (exp(-length(f1 * 0.19) * 14.0) * 0.35 + exp(-length(f2 * 0.12) * 18.0) * 0.25) * estrela;
  brilho += halo * (1.0 - dentro) * (1.0 - faisca);

  float3 cor = corBrilho * brilho + corpo * dentro + corFaisca * faisca * (1.0 - dentro);
  float alfa = clamp(brilho + dentro + faisca * (1.0 - dentro), 0.0, 1.0);
  return half4(cor, alfa);
}
`;

/** A fração da resolução em que o desenho é calculado. A estrela é leve e
    vai inteira; a gota 3D, que pesava, ia a 0,6. */
const ESCALA = 1;

const rgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h.slice(0, 6), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

/** As cores vêm do tema (ver /companion): assim a gota muda junto com a
    paleta que a pessoa escolheu. Todas em hexadecimal. */
export type PropsDoOrbe = {
  tamanho: number;
  azul: string; fundo: string; ciano: string; lima: string; roxo: string; rosa: string;
};

export default function OrbeSkia({ tamanho, azul, fundo, ciano, lima, roxo, rosa }: PropsDoOrbe) {
  const efeito = useMemo(() => Skia.RuntimeEffect.Make(FONTE), []);
  const relogio = useClock();
  const [parado, setParado] = useState(false);

  useEffect(() => {
    let vivo = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => { if (vivo) setParado(v); }).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setParado);
    return () => { vivo = false; sub.remove(); };
  }, []);

  const cores = useMemo(() => ({
    azul: rgb(azul), fundo: rgb(fundo), ciano: rgb(ciano), lima: rgb(lima), roxo: rgb(roxo), rosa: rgb(rosa),
  }), [azul, fundo, ciano, lima, roxo, rosa]);
  const uniforms = useDerivedValue(() => ({
    res: [Math.round(tamanho * ESCALA), Math.round(tamanho * ESCALA)],
    t: parado ? 0.5 : relogio.value / 1000,
    ...cores,
  }), [tamanho, parado, cores]);

  if (!efeito) return null;
  const menor = Math.round(tamanho * ESCALA);
  return (
    <View style={{ width: tamanho, height: tamanho, alignItems: 'center', justifyContent: 'center' }}>
      <Canvas style={{ width: menor, height: menor, transform: [{ scale: 1 / ESCALA }] }}>
        <Fill>
          <Shader source={efeito} uniforms={uniforms} />
        </Fill>
      </Canvas>
    </View>
  );
}
