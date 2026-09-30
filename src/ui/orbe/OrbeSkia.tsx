import React, { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import {
  AlphaType, Canvas, ColorType, Fill, ImageShader, Shader, Skia, useClock,
  type SkCanvas, type SkImage, type SkPaint,
} from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import { D_SIMBOLO } from '../marcaCaminhos';
import { distanciaComSinal, codificar } from './distancia';

/* ============================================================
   O ORBE DA MORPHI INTELLIGENCE — a esfera de pontos que vira a marca

   A presença da Morphi Intelligence no alto da conversa vazia: uma
   esfera coberta de pontos, como meio-tom, que gira devagar e se deforma
   como um tecido. Num ciclo de 16 segundos, depois de uns 9 de esfera
   livre, ela SE TRANSFORMA na marca — alternando o M da Morphi e a
   estrela da Morphi Intelligence —, fica uns 3 s na forma e volta.

   ⚠️ A HISTÓRIA, PARA NINGUÉM REFAZER O CAMINHO (30/09/2026). Passou por
   esfera 2D, bolha, vidro com tinta (2D e 3D), estrela 2D e com relevo,
   marca em pontos, esfera de pontos com desenho dentro, e esfera que
   virava M, seringa, copo e anilha. O dono ficou com a marca só: o M e a
   estrela — seringa e copo liam como ícones de outro app.

   A TRANSFORMAÇÃO, que era só "encolher para a forma":
   - a curva é suave nas duas pontas (smootherstep);
   - no meio do caminho a superfície se agita e encolhe um pouco, como
     esforço;
   - a peça chega GIRANDO rápido e desacelera até ficar de frente, e vai
     embora girando de novo — o giro dá a sensação de aceleração e
     esconde a mistura das formas;
   - parada, ela balança num ângulo largo, para mostrar que tem volume.

   ⚠️ UMA GRADE DE PONTOS SÓ, NA TRANSFORMAÇÃO. Duas grades misturadas (a
   da esfera e uma reta na peça) faziam ondas (moiré). A grade é a da
   esfera, num referencial que passa da rotação da esfera para a da peça;
   só no fim da chegada, com a peça plana e quase parada, ela vira reta —
   na face plana, a grade da esfera faria olho-de-peixe.

   COMO É FEITA: raymarching; a peça é o desenho com espessura. O M é o
   caminho oficial (ui/marcaCaminhos), transformado em distância até a
   borda (ui/orbe/distancia) numa textura; a estrela é a faísca do logo
   (ui/marca), calculada no shader.

   AS CORES: a cor que age e a do alcançado mudam com a aparência (ver
   comPaleta em src/theme); o ciano é o terceiro tom, entre as duas. No
   claro, verde-água e lima escurecida junto do ciano.

   ⚠️ COM "REDUZIR MOVIMENTO" LIGADO NO APARELHO, ELA PARA, COMO ESFERA.

   Para conferir sem abrir o aplicativo: o shader e a textura saem iguais
   no CanvasKit do Node, a mesma engine do Skia.
   ============================================================ */

const FONTE = `
uniform float2 res;
uniform float t;
uniform float claro;
uniform float3 acao;
uniform float3 acao2;
uniform float3 alcancado;
uniform float3 ciano;
uniform float2 tamMascara;
uniform shader campos;

const float MUNDO = 1.25;

float3 girar(float3 p, float a, float b) {
  float ca = cos(a); float sa = sin(a);
  p = float3(ca * p.x + sa * p.z, p.y, -sa * p.x + ca * p.z);
  float cb = cos(b); float sb = sin(b);
  return float3(p.x, cb * p.y - sb * p.z, sb * p.y + cb * p.z);
}

// A linha do tempo: um ciclo de 16 s — 9 s de esfera livre, a forma
// chegando (1,6 s), 3,2 s de forma, a forma indo (1,6 s). Alterna entre o
// M da Morphi e a estrela da Morphi Intelligence.
const float CICLO = 16.0;
float suave(float x) { x = clamp(x, 0.0, 1.0); return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
float chegada(float f) { return clamp((f - 9.0) / 1.6, 0.0, 1.0); }
float saida(float f) { return clamp((f - 13.8) / 1.6, 0.0, 1.0); }

// (qual, quanto): qual 0 é o M, 1 a estrela; quanto vai de 0 (esfera) a 1.
float2 vez(float t) {
  float qual = mod(floor(t / CICLO), 2.0);
  float f = mod(t, CICLO);
  return float2(qual, suave(chegada(f)) * (1.0 - suave(saida(f))));
}

// A agitação da transformação: no meio do caminho a superfície se agita e
// encolhe um pouco — é o "esforço" de virar outra coisa.
float agito(float w) { return 4.0 * w * (1.0 - w); }

// O giro da peça: ela chega girando rápido e desacelera até ficar de
// frente; parada, balança o bastante para mostrar que tem volume; e vai
// embora girando de novo.
float giroDaPeca(float t) {
  float f = mod(t, CICLO);
  float c = chegada(f);
  float s = saida(f);
  float entra = 6.2831853 * pow(1.0 - c, 2.2);
  float sai = 6.2831853 * pow(s, 2.2);
  return entra + sai + 0.45 * sin(t * 0.9);
}

// A estrela da Morphi Intelligence: a faísca do logo (ui/marca) — quatro
// pontas, lados retos, pontas redondas.
float estrela(float2 p) {
  p /= 0.95;
  float an = 3.1415927 / 4.0;
  float en = 3.1415927 / 3.0;
  float2 acs = float2(cos(an), sin(an));
  float2 ecs = float2(cos(en), sin(en));
  float bn = mod(atan(p.x, p.y), 2.0 * an) - an;
  p = length(p) * float2(cos(bn), abs(sin(bn)));
  float r = 0.89;
  p -= r * acs;
  p += ecs * clamp(-dot(p, ecs), 0.0, r * acs.y / ecs.y);
  return (length(p) * sign(p.x) - 0.11) * 0.95;
}

// A distância até a borda do desenho, no plano: o M vem da textura (a
// distância com sinal, 0,5 na borda); a estrela é calculada aqui.
float plano(float2 xy, float qual) {
  if (qual > 0.5) { return estrela(xy); }
  float2 m = float2(xy.x / MUNDO * 0.5 + 0.5, 0.5 - xy.y / MUNDO * 0.5) * tamMascara;
  float v = campos.eval(m).r;
  return (0.5 - v) * 2.0 * 20.0 * (2.0 * MUNDO / tamMascara.x);
}

// A forma do desenho em 3D: o contorno com espessura, cantos redondos.
float peca(float3 p, float qual) {
  float esp = qual < 0.5 ? 0.2 : 0.17;
  float d2 = plano(p.xy, qual);
  float2 w = float2(d2, abs(p.z) - esp);
  return min(max(w.x, w.y), 0.0) + length(max(w, 0.0)) - 0.05;
}

float esfera(float3 q, float ag) {
  float d = length(q) - (1.0 - 0.08 * ag);
  float k = 1.0 + 1.6 * ag;
  d += 0.07 * k * sin(q.x * 2.1 + t * 0.7) * sin(q.y * 1.8 - t * 0.5) * sin(q.z * 2.3 + t * 0.6);
  float onda1 = q.y * 2.4 + 1.3 * sin(q.x * 1.7 + t * 0.5) + t * 0.6;
  float onda2 = q.x * 2.2 - q.z * 1.1 + 1.1 * sin(q.y * 1.9 - t * 0.4) - t * 0.5;
  d -= 0.085 * k * pow(abs(sin(onda1)), 4.0);
  d -= 0.07 * k * pow(abs(sin(onda2)), 4.0);
  return d;
}

float3 giroEsfera(float3 p) { return girar(p, t * 0.18, 0.3 * sin(t * 0.13)); }
float3 giroPeca(float3 p) { return girar(p, giroDaPeca(t), 0.12 * sin(t * 0.45)); }

float mapa(float3 p, float2 vz) {
  float ag = agito(vz.y);
  float de = esfera(giroEsfera(p), ag);
  if (vz.y <= 0.001) { return de * 0.5; }
  float3 pp = giroPeca(p);
  // a peça também treme no meio do caminho
  float dp = peca(pp, vz.x) + 0.04 * ag * sin(pp.x * 6.0 + t * 3.0) * sin(pp.y * 5.0 - t * 2.5);
  return mix(de, dp, vz.y) * 0.5;
}

float3 normal(float3 p, float2 vz) {
  float e = 0.004;
  return normalize(
    float3(1, -1, -1) * mapa(p + float3(1, -1, -1) * e, vz) +
    float3(-1, -1, 1) * mapa(p + float3(-1, -1, 1) * e, vz) +
    float3(-1, 1, -1) * mapa(p + float3(-1, 1, -1) * e, vz) +
    float3(1, 1, 1) * mapa(p + float3(1, 1, 1) * e, vz));
}

half4 main(float2 pos) {
  float2 uv = (pos - res * 0.5) / (min(res.x, res.y) * 0.5);
  uv.y = -uv.y;
  float2 vz = vez(t);

  float3 ro = float3(0.0, 0.0, 3.3);
  float3 rd = normalize(float3(uv * 1.12, -2.4));
  float b = dot(ro, rd);
  float c = dot(ro, ro) - 1.4 * 1.4;
  float h = b * b - c;
  if (h < 0.0) { return half4(0.0); }
  float dist = -b - sqrt(h);
  bool bateu = false;
  for (int i = 0; i < 72; i++) {
    float3 p = ro + rd * dist;
    float s = mapa(p, vz);
    if (s < 0.002) { bateu = true; break; }
    dist += s;
    if (dist > 5.0) { break; }
  }
  if (!bateu) { return half4(0.0); }

  float3 p = ro + rd * dist;
  float3 n = normal(p, vz);

  // Os pontos: na esfera, a grade de latitude e longitude; na peça, uma
  // grade reta no plano da frente — é o que faz o desenho ler limpo. No
  // meio da transformação, uma se funde na outra.
  // UMA GRADE SÓ, num referencial que passa da rotação da esfera para a
  // da peça junto com a forma. Duas grades misturadas (a da esfera e uma
  // reta na peça) faziam ondas (moiré) no meio da transformação.
  float N = 105.0;
  float3 q = giroEsfera(p);
  float3 pp = giroPeca(p);
  float3 g = girar(p, mix(t * 0.18, giroDaPeca(t), vz.y), mix(0.3 * sin(t * 0.13), 0.12 * sin(t * 0.45), vz.y));
  float3 dir = normalize(q);
  float3 dg = normalize(g);
  float lat = asin(clamp(dg.y, -1.0, 1.0));
  float fila = floor((lat / 3.1415927 + 0.5) * N);
  float latC = (fila + 0.5) / N * 3.1415927 - 1.5707963;
  float cols = max(1.0, floor(2.0 * N * cos(latC)));
  float lon = atan(dg.z, dg.x) / 6.2831853 + 0.5;
  float dd = length(float2(fract(lon * cols) - 0.5, fract((lat / 3.1415927 + 0.5) * N) - 0.5));
  // Com a peça já formada e de frente, a grade vira reta no plano dela —
  // na face plana, a grade da esfera faria olho-de-peixe. A troca é só no
  // fim da chegada, quando a peça já está plana e quase parada.
  float passo = 3.1415927 / N;
  float lado = smoothstep(0.55, 0.85, abs(n.z));
  float2 gPlano = mix(float2(pp.x + pp.y, pp.z), pp.xy, lado) / passo;
  float dPlano = length(fract(gPlano) - 0.5);
  float kReta = smoothstep(0.86, 0.98, vz.y);

  // A luz: borda e cristas na esfera; na peça, a face acesa por inteiro e
  // os cantos mais ainda.
  float borda = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 1.6);
  float crista = smoothstep(0.18, 0.5, 1.0 - dot(n, dir)) * (1.0 - vz.y);
  float o1 = q.y * 2.4 + 1.3 * sin(q.x * 1.7 + t * 0.5) + t * 0.6;
  float o2 = q.x * 2.2 - q.z * 1.1 + 1.1 * sin(q.y * 1.9 - t * 0.4) - t * 0.5;
  float linhas = (pow(1.0 - abs(sin(o1)), 7.0) + 0.7 * pow(1.0 - abs(sin(o2)), 7.0)) * (1.0 - vz.y);
  float luz = clamp(dot(n, normalize(float3(-0.3, 0.8, 0.5))), 0.0, 1.0);
  float I = clamp(0.05 + 1.05 * borda + 0.5 * crista * (0.45 + borda) + 0.75 * linhas * (0.3 + borda) + 0.12 * luz, 0.0, 1.0);
  // detalhes de luz de cada peça: a água do copo e a borda e o miolo da
  // anilha acendem mais
  float extra = 0.0;
  I = mix(I, clamp(0.5 + 0.45 * borda + 0.2 * luz + extra, 0.0, 1.0), smoothstep(0.4, 0.9, vz.y));

  float raio = mix(claro < 0.5 ? 0.12 : 0.2, 0.44, I);
  float ponto = mix(smoothstep(raio + 0.12, raio - 0.12, dd), smoothstep(raio + 0.12, raio - 0.12, dPlano), kReta);

  // A cor: a cor que age, o ciano e o alcançado, em faixas diagonais que
  // correm devagar — três tons, e dois deles mudam com a aparência.
  float v = clamp(dot(uv, normalize(float2(0.45, 1.0))) * 0.5 + 0.5 + 0.12 * sin(t * 0.35 + uv.x * 1.8), 0.0, 1.0);
  float3 cor;
  float alfa;
  if (claro < 0.5) {
    // ESCURO: azul embaixo, ciano no meio, lima em cima; os pontos acesos
    // clareiam.
    cor = mix(acao, ciano, smoothstep(0.2, 0.55, v));
    cor = mix(cor, alcancado, smoothstep(0.55, 0.92, v));
    cor = mix(cor, float3(1.0), pow(I, 3.0) * 0.25);
    cor *= 0.55 + 0.75 * I;
    alfa = ponto * mix(0.3, 1.0, I);
  } else {
    // CLARO: tons mais fundos, que aparecem no branco — o azul fundo, um
    // verde-água e um lima escurecido, que não vira oliva por ir junto do
    // ciano.
    float3 agua = mix(ciano, acao2, 0.45);
    float3 limaC = mix(alcancado, ciano, 0.45) * 0.78;
    cor = mix(acao2, agua, smoothstep(0.2, 0.55, v));
    cor = mix(cor, limaC, smoothstep(0.58, 0.95, v));
    cor *= mix(0.8, 1.0, I);
    alfa = ponto * mix(0.55, 1.0, I);
  }
  alfa *= smoothstep(0.0, 0.06, dot(n, -rd) + 0.02);
  return half4(cor * alfa, alfa);
}
`;

/** O lado da textura do M, em pixels. */
const M = 128;

/* Um desenho numa máscara (1 dentro, 0 fora), e a distância até a borda. */
function campo(desenha: (cv: SkCanvas, p: SkPaint) => void): Float32Array | null {
  const sup = Skia.Surface.Make(M, M);
  if (!sup) return null;
  const cv = sup.getCanvas();
  cv.clear(Skia.Color('#000000'));
  const p = Skia.Paint();
  p.setAntiAlias(true);
  p.setColor(Skia.Color('#FFFFFF'));
  desenha(cv, p);
  sup.flush();
  const px = sup.makeImageSnapshot().readPixels(0, 0, {
    width: M, height: M, colorType: ColorType.RGBA_8888, alphaType: AlphaType.Unpremul,
  });
  if (!px) return null;
  const dentro = new Uint8Array(M * M);
  for (let i = 0; i < M * M; i++) dentro[i] = px[i * 4] > (px instanceof Float32Array ? 0.5 : 127) ? 1 : 0;
  return distanciaComSinal(dentro, M, M);
}

/* A textura do M: a distância até a borda, no canal vermelho. */
function texturaDoM(): SkImage | null {
  const m = campo((cv, p) => {
    const pth = Skia.Path.MakeFromSVGString(D_SIMBOLO);
    if (!pth) return;
    const s = (M * 0.74) / 533;
    cv.save(); cv.translate(M / 2 - 266.5 * s, M / 2 - 111 * s); cv.scale(s, s); cv.drawPath(pth, p); cv.restore();
  });
  if (!m) return null;
  const bytes = new Uint8Array(M * M * 4);
  for (let i = 0; i < M * M; i++) {
    bytes[i * 4] = codificar(m[i]);
    bytes[i * 4 + 3] = 255;
  }
  return Skia.Image.MakeImage(
    { width: M, height: M, colorType: ColorType.RGBA_8888, alphaType: AlphaType.Opaque },
    Skia.Data.fromBytes(bytes), M * 4,
  );
}

const rgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h.slice(0, 6), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export type PropsDoOrbe = {
  tamanho: number;
  /** O tema claro tem a própria variação — ver o alto do arquivo. */
  claro: boolean;
  /** a cor que age (accent) e o segundo tom dela (accent2) — mudam com a aparência */
  acao: string; acao2: string;
  /** a cor do alcançado (lime) — muda com a aparência */
  alcancado: string;
  /** o terceiro tom, fixo (teal) */
  ciano: string;
};

export default function OrbeSkia({ tamanho, claro, acao, acao2, alcancado, ciano }: PropsDoOrbe) {
  const efeito = useMemo(() => Skia.RuntimeEffect.Make(FONTE), []);
  const textura = useMemo(() => texturaDoM(), []);
  const relogio = useClock();
  const [parado, setParado] = useState(false);

  useEffect(() => {
    let vivo = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => { if (vivo) setParado(v); }).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setParado);
    return () => { vivo = false; sub.remove(); };
  }, []);

  const cores = useMemo(() => ({
    acao: rgb(acao), acao2: rgb(acao2), alcancado: rgb(alcancado), ciano: rgb(ciano),
  }), [acao, acao2, alcancado, ciano]);
  const uniforms = useDerivedValue(() => ({
    res: [tamanho, tamanho],
    // parada, ela fica num instante de esfera
    t: parado ? 1.0 : relogio.value / 1000,
    claro: claro ? 1 : 0,
    ...cores,
    tamMascara: [M, M],
  }), [tamanho, parado, cores, claro]);

  if (!efeito || !textura) return null;
  return (
    <Canvas style={{ width: tamanho, height: tamanho }}>
      <Fill>
        <Shader source={efeito} uniforms={uniforms}>
          <ImageShader image={textura} x={0} y={0} width={M} height={M} fit="none" tx="clamp" ty="clamp" />
        </Shader>
      </Fill>
    </Canvas>
  );
}
