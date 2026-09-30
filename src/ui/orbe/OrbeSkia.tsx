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

   A primeira gota tinha o miolo escuro e opaco, e no tema claro ficava
   uma mancha. Agora é como a referência do dono: um VIDRO TRANSPARENTE
   com TINTA dentro.
   - o vidro quase não tem cor: aparece na borda, cromado, com as dobras
     da superfície e dois reflexos de luz; o fundo da tela passa por ele;
   - dentro, gotas de tinta andam, se juntam e se separam (metaballs),
     com uma nuvem de tinta que passeia — no azul do app, com toques de
     ciano e lima;
   - a refração: o que está dentro aparece deslocado pelas dobras;
   - um contorno fino segura a gota no tema claro.

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

// A tinta: gotas que andam por dentro, se juntam e se separam (metaballs),
// mais uma nuvem de tinta que passeia. Devolve a densidade e qual tom.
float2 tinta(float2 p, float t) {
  float campo = 0.0;
  float tom = 0.0;
  for (int i = 0; i < 18; i++) {
    float fi = float(i);
    float a1 = 0.35 + 0.25 * fract(sin(fi * 12.99) * 437.5);
    float a2 = 0.3 + 0.25 * fract(sin(fi * 78.23) * 921.3);
    float ph = fi * 1.7;
    float2 c = float2(sin(t * a1 + ph), cos(t * a2 + ph * 1.3)) * (0.15 + 0.42 * fract(sin(fi * 3.1) * 91.7));
    float r = 0.035 + 0.085 * fract(sin(fi * 5.7) * 311.1);
    float2 dd = p - c;
    float cont = r * r / max(dot(dd, dd), 0.0001);
    campo += cont;
    tom += cont * fract(fi * 0.37);
  }
  float nuvem = fbm(float3(p * 2.2 + float2(sin(t * 0.21), cos(t * 0.17)) * 0.6, t * 0.15));
  campo += smoothstep(0.44, 0.7, nuvem) * 1.4;
  return float2(campo, tom / max(campo, 0.0001));
}

half4 main(float2 pos) {
  float2 uv = (pos - res * 0.5) / (min(res.x, res.y) * 0.5);
  float ang = atan(uv.y, uv.x);
  float d = length(uv);

  // A forma: um vidro que respira e se deforma devagar.
  float3 pa = float3(cos(ang) * 1.3, sin(ang) * 1.3, t * 0.2);
  float R = 0.74 + 0.12 * (fbm(pa) - 0.45);
  float rr = d / R;
  if (rr >= 1.0) { return half4(0.0); }

  // A superfície de vidro, com as dobras.
  float z = sqrt(1.0 - rr * rr);
  float3 n = normalize(float3(uv / R, z));
  float3 np = n * 1.6 + float3(0.0, 0.0, t * 0.16);
  n = normalize(n + 0.55 * float3(fbm(np) - 0.5, fbm(np + 4.7) - 0.5, 0.0));
  float fres = pow(1.0 - clamp(n.z, 0.0, 1.0), 1.8);

  // A tinta vista através do vidro: a refração desloca o que está dentro.
  float2 dentro = uv / R - n.xy * 0.22;
  float2 tt = tinta(dentro, t * 0.8);
  float dens = smoothstep(0.85, 1.2, tt.x) * smoothstep(1.0, 0.82, rr);
  // O volume: a gota de tinta é funda na borda e clara no meio, com um
  // ponto de luz onde ela é mais densa.
  float3 corTinta = mix(fundo, azul, 0.45);
  corTinta = mix(corTinta, azul, smoothstep(1.05, 2.0, tt.x));
  corTinta = mix(corTinta, ciano, smoothstep(0.62, 0.9, tt.y) * 0.45);
  corTinta = mix(corTinta, lima, smoothstep(0.93, 0.99, tt.y) * 0.22);
  corTinta = mix(corTinta, float3(1.0), smoothstep(3.0, 6.5, tt.x) * 0.3);

  // O vidro: quase sem cor no miolo; cromado e reflexos na borda.
  float veio = sin(fres * 14.0 + fbm(n * 3.0 + float3(t * 0.1)) * 6.0);
  float3 prata = mix(float3(0.78, 0.82, 0.92), float3(1.0), 0.5 + 0.5 * veio);
  prata = mix(prata, roxo, 0.18 * (0.5 - 0.5 * veio));
  float aVidro = 0.05 + 0.92 * smoothstep(0.1, 0.8, fres) * (0.5 + 0.5 * veio);

  // O contorno fino, que segura a gota no tema claro sem pesar no escuro.
  float aro = smoothstep(0.9, 1.0, rr) * smoothstep(1.0, 0.975, rr);
  float3 corVidro = mix(prata, fundo, aro * 0.6);
  aVidro = max(aVidro, aro * 0.55);

  // Os reflexos de luz.
  float esp = pow(max(dot(n, normalize(float3(-0.45, -0.6, 0.66))), 0.0), 36.0);
  float esp2 = pow(max(dot(n, normalize(float3(0.55, 0.5, 0.67))), 0.0), 64.0) * 0.5;

  // A tinta por baixo, o vidro por cima.
  float3 cor = corTinta * dens * (1.0 - aVidro) + corVidro * aVidro;
  float alfa = dens * (1.0 - aVidro) + aVidro;
  cor += float3(1.0) * (esp * 0.9 + esp2);
  alfa = max(alfa, esp * 0.9 + esp2);
  float borda = smoothstep(1.0, 0.975, rr);
  return half4(cor * borda, clamp(alfa, 0.0, 1.0) * borda);
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
