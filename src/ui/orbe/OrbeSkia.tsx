import React, { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { Canvas, Fill, Shader, Skia, useClock } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';

/* ============================================================
   O ORBE DA MORPHI INTELLIGENCE — uma esfera de pontos que se move

   A presença da Morphi Intelligence no alto da conversa vazia: uma
   esfera coberta de pontos, como meio-tom, que gira devagar e se deforma
   como um tecido. As referências do dono (30/09/2026) são esferas de
   pontos com dobras, borda acesa e miolo escuro.

   ⚠️ A HISTÓRIA, PARA NINGUÉM REFAZER O CAMINHO. Passou por esfera de
   pontos em 2D, bolha iridescente, vidro com tinta (2D e 3D), estrela
   2D, estrela com relevo e a marca em pontos (estrela, M, cruz). O dono
   escolheu esta: é a mais simples, e a que casa com a tela.

   COMO É FEITA:
   - a superfície é 3D de verdade (raymarching): uma esfera com ondas
     largas e dobras de tecido que correm por ela;
   - os pontos moram NA superfície, numa grade de latitude e longitude
     com menos pontos perto dos polos, para o espaçamento ficar igual; nas
     dobras eles se apertam na tela, e é isso que desenha as linhas;
   - cada ponto cresce com a luz, como meio-tom: a borda (Fresnel) e as
     cristas das dobras acendem; o miolo fica escuro, com pontos
     pequenos;
   - a cor é um degradê vertical nos tons do app — rosa em cima, roxo no
     meio, azul embaixo —, que balança devagar.

   UMA VARIAÇÃO POR TEMA: no escuro, as cristas puxam para a lima e o
   brilho clareia os pontos; no claro, as cristas puxam para o ciano, e
   os pontos do miolo são maiores, para a esfera não sumir no branco.

   ⚠️ COM "REDUZIR MOVIMENTO" LIGADO NO APARELHO, ELA PARA.

   Para conferir sem abrir o aplicativo: o shader compila e desenha no
   CanvasKit do Node, a mesma engine do Skia — foi assim que cada versão
   foi vista, nos dois temas, antes de subir.
   ============================================================ */

const FONTE = `
uniform float2 res;
uniform float t;
uniform float claro;
uniform float3 azul;
uniform float3 fundo;
uniform float3 ciano;
uniform float3 lima;
uniform float3 roxo;
uniform float3 rosa;

float3 girar(float3 p, float a, float b) {
  float ca = cos(a); float sa = sin(a);
  p = float3(ca * p.x + sa * p.z, p.y, -sa * p.x + ca * p.z);
  float cb = cos(b); float sb = sin(b);
  return float3(p.x, cb * p.y - sb * p.z, sb * p.y + cb * p.z);
}

// A forma: uma esfera que se deforma como um tecido — ondas largas e
// dobras mais finas, com vincos (o abs faz a crista).
float mapa(float3 p) {
  float3 q = girar(p, t * 0.18, 0.3 * sin(t * 0.13));
  float d = length(q) - 1.0;
  // ondas largas, que tiram a esfera do redondo sem virar caroço
  d += 0.07 * sin(q.x * 2.1 + t * 0.7) * sin(q.y * 1.8 - t * 0.5) * sin(q.z * 2.3 + t * 0.6);
  // as dobras de tecido: ondas que correm pela superfície, com crista fina
  float onda1 = q.y * 2.4 + 1.3 * sin(q.x * 1.7 + t * 0.5) + t * 0.6;
  float onda2 = q.x * 2.2 - q.z * 1.1 + 1.1 * sin(q.y * 1.9 - t * 0.4) - t * 0.5;
  d -= 0.085 * pow(abs(sin(onda1)), 4.0);
  d -= 0.07 * pow(abs(sin(onda2)), 4.0);
  return d * 0.5;
}

float3 normal(float3 p) {
  float e = 0.004;
  return normalize(
    float3(1, -1, -1) * mapa(p + float3(1, -1, -1) * e) +
    float3(-1, -1, 1) * mapa(p + float3(-1, -1, 1) * e) +
    float3(-1, 1, -1) * mapa(p + float3(-1, 1, -1) * e) +
    float3(1, 1, 1) * mapa(p + float3(1, 1, 1) * e));
}

half4 main(float2 pos) {
  float2 uv = (pos - res * 0.5) / (min(res.x, res.y) * 0.5);
  uv.y = -uv.y;
  float3 ro = float3(0.0, 0.0, 3.3);
  float3 rd = normalize(float3(uv * 1.12, -2.4));

  // Começa perto da esfera (a conta de uma bola que a contém), e anda
  // pela distância até a superfície.
  float b = dot(ro, rd);
  float c = dot(ro, ro) - 1.3 * 1.3;
  float h = b * b - c;
  if (h < 0.0) { return half4(0.0); }
  float dist = -b - sqrt(h);
  bool bateu = false;
  for (int i = 0; i < 64; i++) {
    float3 p = ro + rd * dist;
    float s = mapa(p);
    if (s < 0.002) { bateu = true; break; }
    dist += s;
    if (dist > 5.0) { break; }
  }
  if (!bateu) { return half4(0.0); }

  float3 p = ro + rd * dist;
  float3 n = normal(p);
  float3 q = girar(p, t * 0.18, 0.3 * sin(t * 0.13));
  float3 dir = normalize(q);

  // Os pontos sobre a superfície: uma grade em latitude e longitude, com
  // menos pontos por fileira perto dos polos, para o espaçamento ficar
  // igual. Nas dobras eles se apertam na tela — são as linhas das cristas.
  float N = 105.0;
  float lat = asin(clamp(dir.y, -1.0, 1.0));
  float fila = floor((lat / 3.1415927 + 0.5) * N);
  float latC = (fila + 0.5) / N * 3.1415927 - 1.5707963;
  float cols = max(1.0, floor(2.0 * N * cos(latC)));
  float lon = atan(dir.z, dir.x) / 6.2831853 + 0.5;
  float2 celula = float2(fract(lon * cols) - 0.5, fract((lat / 3.1415927 + 0.5) * N) - 0.5);
  float dd = length(celula * float2(1.0, 1.0));

  // A luz de cada ponto: borda (Fresnel), cristas (onde a normal foge da
  // esfera) e uma luz do alto.
  float borda = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 1.6);
  float crista = smoothstep(0.18, 0.5, 1.0 - dot(n, dir));
  float luz = clamp(dot(n, normalize(float3(-0.3, 0.8, 0.5))), 0.0, 1.0);
  // as linhas das dobras: onde cada onda cruza o zero há uma crista, e ela
  // acende como uma linha fina que corre pela esfera
  float o1 = q.y * 2.4 + 1.3 * sin(q.x * 1.7 + t * 0.5) + t * 0.6;
  float o2 = q.x * 2.2 - q.z * 1.1 + 1.1 * sin(q.y * 1.9 - t * 0.4) - t * 0.5;
  float linhas = pow(1.0 - abs(sin(o1)), 7.0) + 0.7 * pow(1.0 - abs(sin(o2)), 7.0);
  float I = clamp(0.05 + 1.05 * borda + 0.5 * crista * (0.45 + borda) + 0.75 * linhas * (0.3 + borda) + 0.12 * luz, 0.0, 1.0);

  // O ponto: maior onde há luz, como meio-tom.
  float raio = mix(claro < 0.5 ? 0.12 : 0.2, 0.44, I);
  float ponto = smoothstep(raio + 0.12, raio - 0.12, dd);

  // A cor: um degradê vertical nos tons do app — rosa em cima, roxo no
  // meio, azul embaixo —, que gira devagar; as cristas puxam para a lima
  // (escuro) ou para o ciano (claro).
  float v = clamp(uv.y * 0.55 + 0.5 + 0.12 * sin(t * 0.3 + uv.x * 2.0), 0.0, 1.0);
  float3 cor = mix(azul, roxo, smoothstep(0.15, 0.55, v));
  cor = mix(cor, rosa, smoothstep(0.55, 0.95, v));
  float alfa;
  if (claro < 0.5) {
    cor = mix(cor, lima, crista * borda * 0.5);
    cor = mix(cor, float3(1.0), pow(I, 3.0) * 0.3);
    cor *= 0.55 + 0.75 * I;
    alfa = ponto * mix(0.3, 1.0, I);
  } else {
    cor = mix(cor, ciano, crista * borda * 0.4);
    cor *= mix(0.8, 1.0, I);
    alfa = ponto * mix(0.55, 1.0, I);
  }
  // a borda da esfera se desfaz um pouco, em vez de um corte seco
  alfa *= smoothstep(0.0, 0.06, dot(n, -rd) + 0.02);
  return half4(cor * alfa, alfa);
}
`;

const rgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h.slice(0, 6), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

/** As cores vêm do tema (ver /companion): assim o orbe muda junto com a
    paleta que a pessoa escolheu. Todas em hexadecimal. */
export type PropsDoOrbe = {
  tamanho: number;
  /** O tema claro tem a própria variação — ver o alto do arquivo. */
  claro: boolean;
  azul: string; fundo: string; ciano: string; lima: string; roxo: string; rosa: string;
};

export default function OrbeSkia({ tamanho, claro, azul, fundo, ciano, lima, roxo, rosa }: PropsDoOrbe) {
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
    t: parado ? 15.0 : relogio.value / 1000,
    claro: claro ? 1 : 0,
    ...cores,
  }), [tamanho, parado, cores, claro]);

  if (!efeito) return null;
  return (
    <Canvas style={{ width: tamanho, height: tamanho }}>
      <Fill>
        <Shader source={efeito} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
}
