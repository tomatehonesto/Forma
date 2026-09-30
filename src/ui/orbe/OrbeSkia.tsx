import React, { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { Canvas, Fill, Shader, Skia, useClock } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';

/* ============================================================
   O ORBE DA MORPHI INTELLIGENCE — uma gota de vidro líquido

   A presença da Morphi Intelligence no alto da conversa vazia. Começou
   como uma esfera de pontos, e o dono pediu mais tons e algo que
   combinasse mais com o aplicativo (30/09/2026): virou uma GOTA, que é o
   vidro dos cards do Insights, a água, o remédio — e que respira.

   O que se vê:
   - a borda ondula devagar, e a gota muda de forma sem perder o corpo;
   - a borda é iridescente, como bolha de sabão, passando pelos tons que
     o aplicativo já usa: azul, ciano, lima, rosa e roxo;
   - o miolo é fundo, com uma tinta azul que se move por dentro;
   - dois reflexos de luz no alto, e um brilho baixo em volta.

   ⚠️ É UM SHADER. Cada pixel se calcula na placa de vídeo, a cada
   quadro; o mesmo efeito em camadas animadas travaria o JavaScript.

   ⚠️ COM "REDUZIR MOVIMENTO" LIGADO NO APARELHO, A GOTA PARA num quadro
   bonito, em vez de se mover.

   Para conferir o desenho sem abrir o aplicativo, o shader compila e
   desenha no CanvasKit do Node (a mesma engine do Skia) — foi assim que
   os quadros foram vistos antes de subir.
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

float hash(float3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float ruido(float3 x) {
  float3 i = floor(x);
  float3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + float3(1, 0, 0)), f.x), mix(hash(i + float3(0, 1, 0)), hash(i + float3(1, 1, 0)), f.x), f.y),
    mix(mix(hash(i + float3(0, 0, 1)), hash(i + float3(1, 0, 1)), f.x), mix(hash(i + float3(0, 1, 1)), hash(i + float3(1, 1, 1)), f.x), f.y),
    f.z);
}

float fbm(float3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int k = 0; k < 4; k++) {
    v += a * ruido(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

// A iridescência: os tons do aplicativo em ciclo — azul, ciano, lima,
// rosa, roxo, e de volta ao azul.
float3 iris(float h) {
  h = fract(h) * 5.0;
  float i = floor(h);
  float f = smoothstep(0.0, 1.0, fract(h));
  float3 a = azul;
  float3 b = ciano;
  if (i >= 1.0) { a = ciano; b = lima; }
  if (i >= 2.0) { a = lima; b = rosa; }
  if (i >= 3.0) { a = rosa; b = roxo; }
  if (i >= 4.0) { a = roxo; b = azul; }
  return mix(a, b, f);
}

half4 main(float2 pos) {
  float2 uv = (pos - res * 0.5) / (min(res.x, res.y) * 0.5);
  float ang = atan(uv.y, uv.x);
  float d = length(uv);

  // A forma: um círculo que respira e se deforma devagar.
  float3 pa = float3(cos(ang) * 1.2, sin(ang) * 1.2, t * 0.22);
  float R = 0.7 + 0.1 * (fbm(pa) - 0.45) + 0.015 * sin(t * 0.8);
  float rr = d / R;

  // Fora da gota: só o brilho baixo em volta, nos mesmos tons da borda.
  if (rr >= 1.0) {
    float g = exp(-(rr - 1.0) * 6.0);
    float3 cg = iris(ang / 6.2831853 + t * 0.03);
    float ag = g * 0.4;
    return half4(cg * ag, ag);
  }

  // A superfície: a normal de uma esfera, sacudida por um ruído lento —
  // é o que dá o ar de líquido.
  float z = sqrt(1.0 - rr * rr);
  float3 n = normalize(float3(uv / R, z));
  float3 np = n * 1.7 + float3(0.0, 0.0, t * 0.18);
  n = normalize(n + 0.45 * float3(fbm(np) - 0.5, fbm(np + 4.7) - 0.5, 0.0));

  float fres = pow(1.0 - clamp(n.z, 0.0, 1.0), 1.5);

  // O miolo: vidro escuro, com uma tinta azul que passeia por dentro e
  // redemoinhos nos tons do aplicativo, como tinta na água.
  float tinta = fbm(float3(uv * 1.7 + float2(sin(t * 0.13), cos(t * 0.11)), t * 0.12));
  float veio = fbm(float3(uv * 2.6 + float2(cos(t * 0.09), sin(t * 0.1)) * 1.3, t * 0.16 + 7.0));
  float3 corpo = fundo * 0.55;
  corpo = mix(corpo, azul, smoothstep(0.42, 0.8, tinta) * 0.6);
  corpo = mix(corpo, iris(veio * 1.6 + t * 0.02), smoothstep(0.58, 0.82, veio) * 0.55);

  // A borda iridescente: o tom muda ao redor da gota e com o tempo, e a
  // faixa entra bem na superfície, como numa bolha.
  float h = fres * 0.9 + ang / 6.2831853 + 0.4 * fbm(n * 2.2 + float3(t * 0.08)) + t * 0.03;
  float3 borda = iris(h) * (0.55 + 0.8 * fres);
  float3 cor = mix(corpo, borda, smoothstep(0.02, 0.6, fres));

  // Os reflexos de luz: um maior no alto à esquerda, um menor embaixo.
  float3 luz = normalize(float3(-0.45, -0.6, 0.66));
  float esp = pow(max(dot(n, luz), 0.0), 42.0);
  float3 luz2 = normalize(float3(0.55, 0.5, 0.67));
  float esp2 = pow(max(dot(n, luz2), 0.0), 70.0) * 0.4;
  cor += float3(1.0) * (esp * 0.8 + esp2);

  // Vidro: o miolo deixa passar um pouco do fundo; a borda, não.
  float alfa = mix(0.7, 1.0, smoothstep(0.0, 0.5, fres)) * smoothstep(1.0, 0.975, rr);
  alfa = max(alfa, (esp * 0.8 + esp2) * smoothstep(1.0, 0.975, rr));
  return half4(cor * alfa, alfa);
}
`;

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
    res: [tamanho, tamanho],
    t: parado ? 6.0 : relogio.value / 1000,
    ...cores,
  }), [tamanho, parado, cores]);

  if (!efeito) return null;
  return (
    <Canvas style={{ width: tamanho, height: tamanho }}>
      <Fill>
        <Shader source={efeito} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
}
