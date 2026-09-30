import React, { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import { Canvas, Fill, Shader, Skia, useClock } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';

/* ============================================================
   O ORBE DA MORPHI INTELLIGENCE — a marca, viva e com volume

   A presença da Morphi Intelligence no alto da conversa vazia.

   ⚠️ A HISTÓRIA, PARA NINGUÉM REFAZER O CAMINHO (30/09/2026). Passou por
   uma esfera de pontos, uma bolha iridescente, um vidro com tinta em 2D,
   uma cena 3D de vidro com tinta (bonita, mas "não ornava" — era um
   objeto de fora) e uma estrela 2D pontuda demais, que não era a do logo
   e ficava feia no tema claro. Esta é a MARCA:

   - a estrela é a faísca do logo (ui/marca): pontas na vertical e na
     horizontal, lados retos, pontas redondas — conferida sobre o
     contorno do logo, e não no olho;
   - ela se transforma num ciclo de 20 segundos, com pausa em cada forma:
     estrela, CRUZ DE SAÚDE, círculo, quadrado redondo, e de volta; as
     formas são distâncias até a borda (SDF), e por isso a transformação
     sai lisa;
   - tem RELEVO: a forma é um volume macio, com luz do alto à esquerda,
     brilho especular e sombra própria — um ícone, e não um adesivo;
   - as duas faíscas pequenas do cacho do logo aparecem ao lado enquanto
     ela é estrela.

   ⚠️ UMA VARIAÇÃO POR TEMA, e não a mesma com outra cor de fundo:
   - ESCURO: ela acende — miolo claro, luz de borda nos tons do app, halo
     em volta; degradê da marca, do azul à lima;
   - CLARO: sem halo (brilho em fundo claro vira mancha), cores densas do
     azul ao ciano com a lima só na ponta (azul com lima misturados dão um
     verde sujo), e uma sombra suave embaixo, que é o que dá corpo.

   ⚠️ COM "REDUZIR MOVIMENTO" LIGADO NO APARELHO, ELA PARA NA ESTRELA.

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

// ---------- as formas, como distância até a borda ----------

// A estrela do logo (a faísca de ui/marca): quatro pontas, lados retos,
// pontas redondas. Ponta em 1.0.
float estrela(float2 p) {
  float an = 3.1415927 / 4.0;
  float en = 3.1415927 / 3.0;
  float2 acs = float2(cos(an), sin(an));
  float2 ecs = float2(cos(en), sin(en));
  float bn = mod(atan(p.x, p.y), 2.0 * an) - an;
  p = length(p) * float2(cos(bn), abs(sin(bn)));
  float r = 0.89;
  p -= r * acs;
  p += ecs * clamp(-dot(p, ecs), 0.0, r * acs.y / ecs.y);
  return length(p) * sign(p.x) - 0.11;
}

float caixa(float2 p, float2 b, float r) {
  float2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

// A cruz de saúde, de braços redondos.
float cruz(float2 p) {
  return min(caixa(p, float2(0.8, 0.27), 0.14), caixa(p, float2(0.27, 0.8), 0.14));
}

float circulo(float2 p) { return length(p) - 0.74; }
float quadrado(float2 p) { return caixa(p, float2(0.64, 0.64), 0.26); }

// O ciclo, de 20 segundos, com pausa em cada forma: estrela, cruz,
// círculo, quadrado redondo, e de volta à estrela.
float4 pesos(float t) {
  float c = fract(t / 20.0);
  float a = smoothstep(0.14, 0.24, c);   // estrela -> cruz
  float b = smoothstep(0.38, 0.48, c);   // cruz -> círculo
  float d = smoothstep(0.62, 0.72, c);   // círculo -> quadrado
  float e = smoothstep(0.86, 0.96, c);   // quadrado -> estrela
  return float4(a, b, d, e);
}

float forma(float2 p, float4 w) {
  float s = estrela(p);
  s = mix(s, cruz(p), w.x);
  s = mix(s, circulo(p), w.y);
  s = mix(s, quadrado(p), w.z);
  s = mix(s, estrela(p), w.w);
  return s;
}

float2 girar(float2 p, float a) {
  float c = cos(a); float s = sin(a);
  return float2(c * p.x - s * p.y, s * p.x + c * p.y);
}

half4 main(float2 pos) {
  float px = 2.0 / min(res.x, res.y);
  float2 uv = (pos - res * 0.5) * px;
  uv.y = -uv.y;

  float4 w = pesos(t);
  float ehEstrela = 1.0 - smoothstep(0.0, 0.25, w.x) + smoothstep(0.75, 1.0, w.w);
  ehEstrela = clamp(ehEstrela, 0.0, 1.0);

  // Escala da forma grande, respiração e um balanço leve.
  float S = 0.5 * (1.0 + 0.03 * sin(t * 1.2));
  float giro = 0.12 * sin(t * 0.33);
  float2 p = girar(uv, giro) / S;
  float d = forma(p, w) * S;

  // A normal do relevo: a forma como um volume macio, alto no meio.
  float e = 0.004;
  float dx = forma(girar(uv + float2(e, 0.0), giro) / S, w) * S - forma(girar(uv - float2(e, 0.0), giro) / S, w) * S;
  float dy = forma(girar(uv + float2(0.0, e), giro) / S, w) * S - forma(girar(uv - float2(0.0, e), giro) / S, w) * S;
  float2 grad = float2(dx, dy) / (2.0 * e);
  float ALT = 0.085;
  float s = clamp(-d / ALT, 0.0, 1.0);
  float incl = 2.0 * (1.0 - s) / ALT * 0.05;
  float3 n = normalize(float3(grad * incl, 1.0));

  float3 L = normalize(float3(-0.5, 0.6, 0.65));
  float dif = clamp(dot(n, L), 0.0, 1.0);
  float esp = pow(clamp(dot(reflect(-L, n), float3(0.0, 0.0, 1.0)), 0.0, 1.0), 28.0);

  // A cor: o degradê da marca (azul embaixo à esquerda, lima em cima à
  // direita), com roxo passando e girando devagar.
  float g = clamp(dot(uv / 0.6, normalize(float2(1.0, 1.0))) * 0.42 + 0.5 + 0.1 * sin(t * 0.4), 0.0, 1.0);
  float3 base = mix(azul, lima, smoothstep(0.38, 0.95, g));
  base = mix(base, roxo, smoothstep(0.4, 0.0, g) * 0.55);
  base = mix(base, ciano, smoothstep(0.55, 0.7, g) * smoothstep(0.85, 0.7, g) * 0.35);

  float dentro = smoothstep(px, -px, d);
  float3 corpo;
  float3 cor;
  float alfa;
  if (claro < 0.5) {
    // ESCURO: a forma acende — miolo claro, luz de borda, halo em volta.
    corpo = base * (0.6 + 0.65 * dif) + float3(1.0) * esp * 0.75;
    corpo = mix(corpo, float3(1.0), pow(s, 3.0) * 0.18);
    float aro = smoothstep(0.35, 0.0, s) * dentro;
    corpo += mix(ciano, rosa, 0.5 + 0.5 * sin(atan(uv.y, uv.x) + t * 0.5)) * aro * 0.35;
    float halo = exp(-max(d, 0.0) * 9.0) * 0.42 * (1.0 - dentro) * smoothstep(1.0, 0.4, length(uv));
    float3 corHalo = mix(azul, roxo, 0.5 + 0.5 * sin(atan(uv.y, uv.x) * 1.0 + t * 0.4));
    cor = corpo * dentro + corHalo * halo;
    alfa = clamp(dentro + halo, 0.0, 1.0);
  } else {
    // CLARO: sem halo — brilho em fundo claro vira mancha. Cores mais
    // densas, e uma sombra suave embaixo, que é o que dá corpo no claro.
    // no claro o degradê passa do azul pelo ciano, e a lima fica só como
    // a luz da ponta: azul com lima, misturados, dão um verde sujo
    float3 baseC = mix(azul, ciano, smoothstep(0.35, 0.95, g) * 0.85);
    baseC = mix(baseC, roxo, smoothstep(0.4, 0.0, g) * 0.35);
    baseC = mix(baseC, lima, smoothstep(0.88, 1.0, g) * 0.55);
    corpo = baseC * (0.68 + 0.42 * dif) + float3(1.0) * esp * 0.9;
    corpo = mix(corpo, float3(1.0), pow(s, 2.0) * 0.1);
    corpo = mix(corpo, baseC * 0.7, smoothstep(0.3, 0.0, s) * 0.3);
    float ds = forma(girar(uv - float2(0.0, -0.07), giro) / S, w) * S;
    float sombra = exp(-max(ds, 0.0) * 11.0) * 0.28 * (1.0 - dentro) * smoothstep(1.0, 0.3, length(uv));
    cor = corpo * dentro + fundo * 0.5 * sombra;
    alfa = clamp(dentro + sombra, 0.0, 1.0);
  }

  // As duas faíscas pequenas do cacho da marca, enquanto é estrela.
  float2 q1 = (uv - float2(0.64, 0.58)) / 0.19;
  float2 q2 = (uv - float2(0.74, -0.04)) / 0.12;
  float f1 = smoothstep(px, -px, estrela(q1) * 0.19) * 0.95;
  float f2 = smoothstep(px, -px, estrela(q2) * 0.12) * 0.82;
  float fa = max(f1, f2) * ehEstrela * (1.0 - dentro);
  // no claro as faíscas vão no azul e no ciano: a lima em fundo claro
  // lê como oliva
  float3 corF = claro < 0.5 ? mix(azul, lima, mix(0.75, 0.5, f2 / 0.82)) : mix(azul, ciano, mix(0.35, 0.8, f2 / 0.82));
  cor = cor * (1.0 - fa) + corF * fa;
  alfa = clamp(alfa + fa * (1.0 - alfa), 0.0, 1.0);
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
    res: [Math.round(tamanho * ESCALA), Math.round(tamanho * ESCALA)],
    t: parado ? 0.5 : relogio.value / 1000,
    claro: claro ? 1 : 0,
    ...cores,
  }), [tamanho, parado, cores, claro]);

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
