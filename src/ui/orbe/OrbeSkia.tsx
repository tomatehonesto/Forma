import React, { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import { Canvas, Fill, Shader, Skia, useClock } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';

/* ============================================================
   O ORBE DA MORPHI INTELLIGENCE — uma gota de vidro 3D com tinta dentro

   A presença da Morphi Intelligence no alto da conversa vazia. Passou
   por uma esfera de pontos, por uma bolha iridescente e por um vidro
   desenhado em 2D; o dono achou todas falsas perto da referência (um
   vidro líquido com tinta laranja dentro, que muda de transparência e de
   cor conforme se move). Esta é uma CENA 3D, calculada a cada quadro
   (raymarching):

   - a forma é um corpo 3D que se deforma e gira devagar, com dobras;
   - o vidro reflete um "estúdio" de luzes em volta — uma caixa de luz
     branca, faixas verticais que viram os veios cromados, e luzes nos
     tons do app que giram devagar: é por isso que as cores e o brilho
     correm pela superfície quando ela se move;
   - Fresnel: de frente o vidro deixa ver o fundo, nas bordas ele
     reflete — a transparência muda com a forma, e a gota funciona nos
     temas escuro e claro;
   - a luz entra no vidro (refração) e atravessa a tinta, que é um volume:
     nuvens azuis que se fundem e gotinhas soltas, na frente e atrás.

   ⚠️ DESENHADO EM RESOLUÇÃO MENOR E AMPLIADO (ESCALA). A cena é pesada
   para cada pixel de uma tela de alta densidade, a cada quadro; o vidro
   é macio, e a ampliação não aparece. Corta o custo para cerca de um
   terço, que é bateria e aparelho simples.

   ⚠️ COM "REDUZIR MOVIMENTO" LIGADO NO APARELHO, A GOTA PARA num quadro
   bonito, em vez de se mover.

   Para conferir sem abrir o aplicativo: o shader compila e desenha no
   CanvasKit do Node, a mesma engine do Skia — foi assim que os quadros
   foram vistos e ajustados.
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

float3 girar(float3 p, float a, float b) {
  float ca = cos(a); float sa = sin(a);
  p = float3(ca * p.x + sa * p.z, p.y, -sa * p.x + ca * p.z);
  float cb = cos(b); float sb = sin(b);
  return float3(p.x, cb * p.y - sb * p.z, sb * p.y + cb * p.z);
}

// A forma: uma esfera empurrada por ondas lentas em três direções — as
// dobras do vidro líquido.
float mapa(float3 p) {
  float3 q = girar(p, t * 0.23, 0.35 * sin(t * 0.17));
  float d = length(q) - 1.0;
  d += 0.11 * sin(q.x * 1.9 + t * 0.9) * sin(q.y * 2.1 - t * 0.7) * sin(q.z * 1.7 + t * 0.8);
  d += 0.08 * sin(q.x * 3.7 + q.y * 2.3 + t * 1.2) * sin(q.z * 3.1 - t * 1.05);
  d += 0.04 * sin(q.y * 6.1 + t * 1.6) * sin(q.x * 5.3 - q.z * 4.1 + t * 0.7);
  return d * 0.75;
}

float3 normal(float3 p) {
  float e = 0.003;
  return normalize(
    float3(1, -1, -1) * mapa(p + float3(1, -1, -1) * e) +
    float3(-1, -1, 1) * mapa(p + float3(-1, -1, 1) * e) +
    float3(-1, 1, -1) * mapa(p + float3(-1, 1, -1) * e) +
    float3(1, 1, 1) * mapa(p + float3(1, 1, 1) * e));
}

// O estúdio que o vidro reflete: escuro embaixo, claro em cima, uma caixa
// de luz branca grande no alto à esquerda e duas coloridas que giram
// devagar — são elas que fazem as cores correrem pela superfície.
float3 estudio(float3 r) {
  float3 c = mix(float3(0.03, 0.035, 0.05), float3(0.55, 0.58, 0.66), smoothstep(-0.4, 0.9, r.y));
  // a caixa de luz grande, no alto à esquerda
  c += float3(1.0) * smoothstep(0.72, 0.86, dot(r, normalize(float3(-0.55, 0.75, 0.35)))) * 2.2;
  // a luz de preenchimento, de frente: é o que o miolo do vidro reflete
  c += float3(0.85, 0.9, 1.0) * smoothstep(0.8, 0.97, dot(r, normalize(float3(-0.25, 0.3, 1.0)))) * 0.9;
  // faixas de luz verticais em volta: viram os veios cromados das dobras
  float ang = atan(r.z, r.x);
  float faixas = pow(0.5 + 0.5 * sin(ang * 5.0 + r.y * 2.0 + t * 0.25), 9.0) * smoothstep(-0.5, 0.3, r.y);
  c += float3(0.95, 0.97, 1.0) * faixas * 1.9;
  // as luzes coloridas que giram devagar: as cores que correm pela superfície
  float a = t * 0.2;
  float3 l2 = normalize(float3(cos(a), -0.1, sin(a)));
  float3 l3 = normalize(float3(-sin(a * 1.3), 0.2, cos(a * 1.3)));
  c += mix(ciano, azul, 0.25) * smoothstep(0.62, 0.9, dot(r, l2)) * 1.4;
  c += mix(rosa, roxo, 0.45) * smoothstep(0.68, 0.92, dot(r, l3)) * 1.1;
  c += lima * smoothstep(0.9, 0.99, dot(r, normalize(float3(0.8, 0.25, -0.5)))) * 0.8;
  return c;
}

// A tinta: bolhas que andam dentro do vidro e se fundem.
float tinta(float3 p) {
  float3 q = girar(p, -t * 0.15, 0.0);
  float s = 0.0;
  for (int i = 0; i < 9; i++) {
    float fi = float(i);
    float3 c = 0.55 * float3(sin(t * (0.31 + 0.07 * fi) + fi * 1.9),
                             sin(t * (0.27 + 0.05 * fi) + fi * 2.7),
                             cos(t * (0.23 + 0.06 * fi) + fi * 1.3));
    float r = 0.19 + 0.09 * sin(fi * 3.3);
    float3 dd = q - c;
    s += r * r / max(dot(dd, dd), 0.0001);
  }
  // e gotinhas pequenas, soltas, que andam mais depressa
  float g = 0.0;
  for (int j = 0; j < 5; j++) {
    float fj = float(j);
    float3 c = 0.62 * float3(sin(t * (0.5 + 0.09 * fj) + fj * 4.1), cos(t * (0.44 + 0.07 * fj) + fj * 2.2), sin(t * (0.38 + 0.1 * fj) + fj));
    float3 dd = q - c;
    g += 0.0036 / max(dot(dd, dd), 0.0001);
  }
  return max(smoothstep(0.75, 1.4, s), smoothstep(0.8, 1.2, g));
}

half4 main(float2 pos) {
  float2 uv = (pos - res * 0.5) / (min(res.x, res.y) * 0.5);
  uv.y = -uv.y;
  float3 ro = float3(0.0, 0.0, 3.4);
  float3 rd = normalize(float3(uv * 1.08, -2.4));

  // Procura a superfície.
  float dist = 0.0;
  bool bateu = false;
  for (int i = 0; i < 56; i++) {
    float3 p = ro + rd * dist;
    float h = mapa(p);
    if (h < 0.0015) { bateu = true; break; }
    dist += h;
    if (dist > 6.0) { break; }
  }
  if (!bateu) { return half4(0.0); }

  float3 p = ro + rd * dist;
  float3 n = normal(p);
  float cosi = clamp(dot(-rd, n), 0.0, 1.0);
  float F = 0.1 + 0.9 * pow(1.0 - cosi, 2.6);

  // O reflexo.
  float3 refl = estudio(reflect(rd, n));

  // A refração: o raio entra no vidro e atravessa a tinta.
  float3 rt = refract(rd, n, 1.0 / 1.4);
  float3 acum = float3(0.0);
  float opac = 0.0;
  float3 q = p + rt * 0.02;
  for (int k = 0; k < 18; k++) {
    q += rt * 0.1;
    if (mapa(q) > 0.0) { break; }
    float dn = tinta(q);
    // a tinta clareia onde recebe a luz de cima
    float luz = 0.55 + 0.45 * clamp(q.y * 0.8 + 0.5, 0.0, 1.0);
    float3 ct = azul * (1.0 + 0.9 * luz);
    ct = mix(ct, ciano, smoothstep(0.3, 0.9, q.x * 0.6 + 0.5 * sin(t * 0.3)) * 0.4);
    ct = mix(ct, roxo, smoothstep(0.4, 0.9, -q.y * 0.7 + 0.3) * 0.3);
    float a = dn * 0.42 * (1.0 - opac);
    acum += ct * luz * a;
    opac += a;
  }

  // O vidro quase não tinge; a luz que passa leva um pouco do estúdio.
  float3 passa = estudio(rt) * 0.3;
  float3 cor = refl * F + (acum + passa * (1.0 - opac)) * (1.0 - F);
  float alfa = clamp(F * (0.35 + 0.65 * clamp(dot(refl, float3(0.33)), 0.0, 1.0)) + opac * (1.0 - F) + 0.14 * (1.0 - F) * (1.0 - opac), 0.0, 1.0);
  // brilho especular forte
  float esp = pow(clamp(dot(reflect(rd, n), normalize(float3(-0.55, 0.75, 0.35))), 0.0, 1.0), 80.0);
  cor += float3(1.0) * esp * 1.2;
  alfa = clamp(max(alfa, esp), 0.0, 1.0);
  return half4(cor * alfa / max(alfa, 0.001) * alfa, alfa);
}
`;

/** A fração da resolução em que a cena é calculada — ver o alto do arquivo. */
const ESCALA = 0.6;

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
    t: parado ? 6.0 : relogio.value / 1000,
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
