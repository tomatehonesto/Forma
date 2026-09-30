import React, { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import {
  AlphaType, Canvas, ColorType, Fill, ImageShader, PaintStyle, Shader, Skia, StrokeCap, StrokeJoin, useClock,
  type SkCanvas, type SkImage, type SkPaint,
} from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import { D_SIMBOLO } from '../marcaCaminhos';
import { distanciaComSinal, codificar } from './distancia';

/* ============================================================
   O ORBE DA MORPHI INTELLIGENCE — a esfera de pontos que vira coisas

   A presença da Morphi Intelligence no alto da conversa vazia: uma
   esfera coberta de pontos, como meio-tom, que gira devagar e se deforma
   como um tecido. A cada 8 segundos ela SE TRANSFORMA num objeto — o M da
   Morphi, uma seringa, um copo d'água, uma anilha —, fica de frente por
   uns segundos, e volta a ser esfera.

   ⚠️ A HISTÓRIA, PARA NINGUÉM REFAZER O CAMINHO (30/09/2026). Passou por
   esfera de pontos em 2D, bolha iridescente, vidro com tinta (2D e 3D),
   estrela 2D, estrela com relevo, a marca em pontos, a esfera de pontos,
   e a esfera com o desenho aceso DENTRO dela. O dono queria que a forma
   virasse os itens — é esta.

   COMO É FEITA:
   - a esfera é 3D (raymarching), com ondas largas e dobras de tecido;
   - cada objeto é o desenho com espessura, como uma peça recortada: o M
     é o caminho oficial (ui/marcaCaminhos), a seringa e o copo são os
     ícones do app (Lucide); a anilha é um disco com furo, feito aqui;
   - para uma forma derreter na outra, o shader usa a distância até a
     borda de cada desenho (ui/orbe/distancia), calculada uma vez, quando
     o orbe aparece, e guardada numa textura, um desenho por canal;
   - na forma, a peça para de girar e fica de frente, para ler; os pontos
     se alinham numa grade reta; o copo acende a água, e a anilha, a borda
     e o miolo.

   AS CORES: a cor que age e a do alcançado mudam com a aparência (ver
   comPaleta em src/theme); o ciano entra como o terceiro tom, entre os
   dois, para não ficar monótono. No escuro: azul, ciano e lima, e os
   pontos acesos clareiam. No claro: o azul fundo, um verde-água e um
   lima escurecido junto do ciano — a lima pura vira oliva no branco.

   ⚠️ COM "REDUZIR MOVIMENTO" LIGADO NO APARELHO, ELA PARA, COMO ESFERA.

   Para conferir sem abrir o aplicativo: o shader e a textura saem iguais
   no CanvasKit do Node, a mesma engine do Skia — foi assim que cada
   versão foi vista, nos dois temas.
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

// A linha do tempo: a cada 8 s um desenho — 2,5 s de esfera, a forma
// chegando, 3 s de forma, a forma indo. Devolve (qual, quanto).
float2 vez(float t) {
  float ciclo = t / 8.0;
  float qual = mod(floor(ciclo), 4.0);
  float f = fract(ciclo) * 8.0;
  float w = smoothstep(2.5, 3.8, f) * (1.0 - smoothstep(6.8, 8.0, f));
  return float2(qual, w);
}

// A distância até a borda do desenho, no plano: a textura guarda a
// distância com sinal (0,5 na borda), um desenho por canal.
float plano(float2 xy, float qual) {
  if (qual > 2.5) {
    // a anilha: um disco com o furo
    float r = length(xy);
    return max(r - 0.74, 0.17 - r);
  }
  float2 m = float2(xy.x / MUNDO * 0.5 + 0.5, 0.5 - xy.y / MUNDO * 0.5) * tamMascara;
  float4 c = campos.eval(m);
  float v = qual < 0.5 ? c.r : (qual < 1.5 ? c.g : c.b);
  return (0.5 - v) * 2.0 * 20.0 * (2.0 * MUNDO / tamMascara.x);
}

// A forma do desenho em 3D: o contorno com espessura, cantos redondos.
float peca(float3 p, float qual) {
  float esp = qual < 0.5 ? 0.2 : (qual < 1.5 ? 0.13 : (qual < 2.5 ? 0.18 : 0.15));
  float d2 = plano(p.xy, qual);
  float2 w = float2(d2, abs(p.z) - esp);
  return min(max(w.x, w.y), 0.0) + length(max(w, 0.0)) - 0.05;
}

float esfera(float3 q) {
  float d = length(q) - 1.0;
  d += 0.07 * sin(q.x * 2.1 + t * 0.7) * sin(q.y * 1.8 - t * 0.5) * sin(q.z * 2.3 + t * 0.6);
  float onda1 = q.y * 2.4 + 1.3 * sin(q.x * 1.7 + t * 0.5) + t * 0.6;
  float onda2 = q.x * 2.2 - q.z * 1.1 + 1.1 * sin(q.y * 1.9 - t * 0.4) - t * 0.5;
  d -= 0.085 * pow(abs(sin(onda1)), 4.0);
  d -= 0.07 * pow(abs(sin(onda2)), 4.0);
  return d;
}

// A esfera gira; a peça fica de frente, com um balanço leve.
float3 giroEsfera(float3 p) { return girar(p, t * 0.18, 0.3 * sin(t * 0.13)); }
float3 giroPeca(float3 p) { return girar(p, 0.28 * sin(t * 0.6), 0.12 * sin(t * 0.45)); }

float mapa(float3 p, float2 vz) {
  float de = esfera(giroEsfera(p));
  if (vz.y <= 0.001) { return de * 0.5; }
  float dp = peca(giroPeca(p), vz.x);
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
  float N = 105.0;
  float3 q = giroEsfera(p);
  float3 dir = normalize(q);
  float lat = asin(clamp(dir.y, -1.0, 1.0));
  float fila = floor((lat / 3.1415927 + 0.5) * N);
  float latC = (fila + 0.5) / N * 3.1415927 - 1.5707963;
  float cols = max(1.0, floor(2.0 * N * cos(latC)));
  float lon = atan(dir.z, dir.x) / 6.2831853 + 0.5;
  float dEsf = length(float2(fract(lon * cols) - 0.5, fract((lat / 3.1415927 + 0.5) * N) - 0.5));
  float3 pp = giroPeca(p);
  float passo = 3.1415927 / N;
  float2 gp = pp.xy / passo;
  // nas laterais da peça a grade corre em z, para não virar risco
  float lado = smoothstep(0.55, 0.85, abs(n.z));
  float2 gl = float2(pp.x + pp.y, pp.z) / passo;
  float dPlano = length(fract(mix(gl, gp, lado)) - 0.5);
  float dd = mix(dEsf, dPlano, smoothstep(0.35, 0.65, vz.y));

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
  if (vz.x > 1.5 && vz.x < 2.5) { extra = smoothstep(0.02, -0.04, pp.y + 0.05 + 0.03 * sin(pp.x * 9.0 + t * 2.0)) * 0.35; }
  if (vz.x > 2.5) { float rr = length(pp.xy); extra = (smoothstep(0.07, 0.02, abs(rr - 0.66)) + smoothstep(0.05, 0.015, abs(rr - 0.25))) * 0.4; }
  I = mix(I, clamp(0.5 + 0.45 * borda + 0.2 * luz + extra, 0.0, 1.0), smoothstep(0.4, 0.9, vz.y));

  float raio = mix(claro < 0.5 ? 0.12 : 0.2, 0.44, I);
  float ponto = smoothstep(raio + 0.12, raio - 0.12, dd);

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

/** O lado da textura dos desenhos, em pixels. */
const M = 128;

/* Os ícones do app (Lucide, viewBox 24, em traço). */
const SERINGA = ['m18 2 4 4', 'm17 7 3-3', 'M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5', 'm9 11 4 4', 'm5 19-3 3', 'm14 4 6 6'];
const COPO = 'M5.116 4.104A1 1 0 0 1 6.11 3h11.78a1 1 0 0 1 .994 1.105L17.19 20.21A2 2 0 0 1 15.2 22H8.8a2 2 0 0 1-2-1.79z';

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

function texturaDosCampos(): SkImage | null {
  const s24 = (M * 0.62) / 24;
  const s24s = (M * 0.72) / 24;
  const m = campo((cv, p) => {
    const pth = Skia.Path.MakeFromSVGString(D_SIMBOLO);
    if (!pth) return;
    const s = (M * 0.74) / 533;
    cv.save(); cv.translate(M / 2 - 266.5 * s, M / 2 - 111 * s); cv.scale(s, s); cv.drawPath(pth, p); cv.restore();
  });
  const seringa = campo((cv, p) => {
    p.setStyle(PaintStyle.Stroke); p.setStrokeWidth(2.2); p.setStrokeCap(StrokeCap.Round); p.setStrokeJoin(StrokeJoin.Round);
    cv.save(); cv.translate(M / 2 - 12 * s24s, M / 2 - 12 * s24s); cv.scale(s24s, s24s);
    for (const d of SERINGA) { const pth = Skia.Path.MakeFromSVGString(d); if (pth) cv.drawPath(pth, p); }
    cv.restore();
  });
  const copo = campo((cv, p) => {
    const pth = Skia.Path.MakeFromSVGString(COPO);
    if (!pth) return;
    cv.save(); cv.translate(M / 2 - 12 * s24, M / 2 - 12 * s24); cv.scale(s24, s24); cv.drawPath(pth, p); cv.restore();
  });
  if (!m || !seringa || !copo) return null;
  const bytes = new Uint8Array(M * M * 4);
  for (let i = 0; i < M * M; i++) {
    bytes[i * 4] = codificar(m[i]);
    bytes[i * 4 + 1] = codificar(seringa[i]);
    bytes[i * 4 + 2] = codificar(copo[i]);
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
  const textura = useMemo(() => texturaDosCampos(), []);
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
