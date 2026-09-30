import React, { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import {
  BlendMode, BlurStyle, Canvas, Fill, ImageShader, PaintStyle, Shader, Skia, StrokeCap, StrokeJoin, useClock,
  type SkImage,
} from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import { D_SIMBOLO } from '../marcaCaminhos';

/* ============================================================
   O ORBE DA MORPHI INTELLIGENCE — uma esfera de pontos que se move

   A presença da Morphi Intelligence no alto da conversa vazia: uma
   esfera coberta de pontos, como meio-tom, que gira devagar e se deforma
   como um tecido. A cada 5 segundos, os pontos da frente acendem formando
   um desenho — o M da Morphi, uma seringa, um copo d'água, uma anilha —,
   e voltam a ser só a esfera. Atrás dela, uma aura baixa da cor do app.

   ⚠️ A HISTÓRIA, PARA NINGUÉM REFAZER O CAMINHO (30/09/2026). Passou por
   esfera de pontos em 2D, bolha iridescente, vidro com tinta (2D e 3D),
   estrela 2D, estrela com relevo e a marca em pontos. O dono escolheu a
   esfera de pontos em 3D, e pediu as cores do app e os desenhos.

   ⚠️ AS CORES SÃO AS DUAS QUE A APARÊNCIA MUDA — a cor que age (accent e
   accent2) e a do alcançado (lime), ver comPaleta em src/theme. Roxo,
   rosa e ciano não mudam com a aparência, e por isso não entram: quem
   escolhe outra cor vê a esfera na cor que escolheu. É o mesmo degradê
   da estrela da Morphi Intelligence (ui/marca).

   COMO É FEITA:
   - a superfície é 3D (raymarching): uma esfera com ondas largas e
     dobras de tecido que correm por ela;
   - os pontos moram NA superfície, numa grade de latitude e longitude
     com espaçamento igual; nas dobras eles se apertam, e isso desenha as
     linhas;
   - cada ponto cresce com a luz, como meio-tom: a borda e as cristas
     acendem, e o miolo fica escuro;
   - os desenhos são olhados de frente, numa textura pequena desfocada,
     um canal cada: R o M (o caminho oficial, ui/marcaCaminhos), G a
     seringa e B o copo (os ícones do app, Lucide, em traço); a anilha é
     desenhada no shader. A textura é opaca: a imagem guarda as cores
     multiplicadas pela transparência, e um desenho no canal de
     transparência apagaria os outros.

   ⚠️ A ANILHA NÃO TEM OS VÃOS DE PEGADA: três furos em volta do centro
   liam como um rosto.

   UMA VARIAÇÃO POR TEMA: no escuro, do tom da cor que age ao alcançado,
   e o desenho acende quase branco; no claro, a lima some no branco, e o
   degradê vai do tom fundo da cor a um tom claro dela, com só um toque
   do alcançado.

   ⚠️ COM "REDUZIR MOVIMENTO" LIGADO NO APARELHO, ELA PARA.

   Para conferir sem abrir o aplicativo: o shader e a textura saem iguais
   no CanvasKit do Node, a mesma engine do Skia — foi assim que cada
   versão foi vista, nos dois temas e com outra paleta.
   ============================================================ */

const FONTE = `
uniform float2 res;
uniform float t;
uniform float claro;
uniform float3 acao;
uniform float3 acao2;
uniform float3 alcancado;
uniform float2 tamMascara;
uniform shader icones;

float3 girar(float3 p, float a, float b) {
  float ca = cos(a); float sa = sin(a);
  p = float3(ca * p.x + sa * p.z, p.y, -sa * p.x + ca * p.z);
  float cb = cos(b); float sb = sin(b);
  return float3(p.x, cb * p.y - sb * p.z, sb * p.y + cb * p.z);
}

float mapa(float3 p) {
  float3 q = girar(p, t * 0.18, 0.3 * sin(t * 0.13));
  float d = length(q) - 1.0;
  d += 0.07 * sin(q.x * 2.1 + t * 0.7) * sin(q.y * 1.8 - t * 0.5) * sin(q.z * 2.3 + t * 0.6);
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

// O ícone da vez, olhando para a frente: R o M da Morphi, G a seringa,
// B o copo d'água; a anilha é desenhada aqui. Cada um fica 5 s.
float icone(float2 uv, float t) {
  float ciclo = t / 5.0;
  float vez = mod(floor(ciclo), 5.0);
  float f = fract(ciclo);
  float env = smoothstep(0.08, 0.3, f) * smoothstep(0.96, 0.74, f);
  if (vez < 0.5) { return 0.0; }
  float2 m = float2(uv.x * 0.5 + 0.5, 0.5 - uv.y * 0.5) * tamMascara;
  float4 c = icones.eval(m);
  float v = 0.0;
  if (vez < 1.5) { v = c.r; }
  else if (vez < 2.5) { v = c.g; }
  else if (vez < 3.5) { v = c.b; }
  else {
    // a anilha de frente: o disco cheio, a borda grossa, um sulco, e o
    // miolo com o furo. (Os vãos de pegada saíram: três furos em volta do
    // centro liam como um rosto.)
    float r = length(uv);
    float disco = smoothstep(0.58, 0.54, r) * 0.5;
    float aro = smoothstep(0.075, 0.03, abs(r - 0.51));
    float sulco = smoothstep(0.035, 0.0, abs(r - 0.38));
    float miolo = smoothstep(0.05, 0.02, abs(r - 0.16));
    float furo = smoothstep(0.1, 0.12, r);
    v = max(max(disco * (1.0 - sulco * 0.8) * furo, aro), miolo * 0.95);
  }
  return v * env;
}

half4 main(float2 pos) {
  float2 uv = (pos - res * 0.5) / (min(res.x, res.y) * 0.5);
  uv.y = -uv.y;

  // A luz atrás: um halo da cor que age, bem baixo.
  float r0 = length(uv);
  // uma aura que nasce na borda da esfera, e não um clarão no meio
  float halo = exp(-pow(max(r0 - 0.62, 0.0), 2.0) * 9.0) * smoothstep(0.35, 0.8, r0) * (claro < 0.5 ? 0.3 : 0.12);
  float3 corFundo = mix(acao, alcancado, smoothstep(-0.6, 0.9, uv.y) * 0.35);
  float3 base = corFundo * halo;
  float aBase = halo;

  float3 ro = float3(0.0, 0.0, 3.3);
  float3 rd = normalize(float3(uv * 1.12, -2.4));
  float b = dot(ro, rd);
  float c = dot(ro, ro) - 1.3 * 1.3;
  float h = b * b - c;
  if (h < 0.0) { return half4(base, aBase); }
  float dist = -b - sqrt(h);
  bool bateu = false;
  for (int i = 0; i < 64; i++) {
    float3 p = ro + rd * dist;
    float s = mapa(p);
    if (s < 0.002) { bateu = true; break; }
    dist += s;
    if (dist > 5.0) { break; }
  }
  if (!bateu) { return half4(base, aBase); }

  float3 p = ro + rd * dist;
  float3 n = normal(p);
  float3 q = girar(p, t * 0.18, 0.3 * sin(t * 0.13));
  float3 dir = normalize(q);

  float N = 105.0;
  float lat = asin(clamp(dir.y, -1.0, 1.0));
  float fila = floor((lat / 3.1415927 + 0.5) * N);
  float latC = (fila + 0.5) / N * 3.1415927 - 1.5707963;
  float cols = max(1.0, floor(2.0 * N * cos(latC)));
  float lon = atan(dir.z, dir.x) / 6.2831853 + 0.5;
  float2 celula = float2(fract(lon * cols) - 0.5, fract((lat / 3.1415927 + 0.5) * N) - 0.5);
  float dd = length(celula);

  float borda = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 1.6);
  float crista = smoothstep(0.18, 0.5, 1.0 - dot(n, dir));
  float luz = clamp(dot(n, normalize(float3(-0.3, 0.8, 0.5))), 0.0, 1.0);
  float o1 = q.y * 2.4 + 1.3 * sin(q.x * 1.7 + t * 0.5) + t * 0.6;
  float o2 = q.x * 2.2 - q.z * 1.1 + 1.1 * sin(q.y * 1.9 - t * 0.4) - t * 0.5;
  float linhas = pow(1.0 - abs(sin(o1)), 7.0) + 0.7 * pow(1.0 - abs(sin(o2)), 7.0);
  float I = clamp(0.05 + 1.05 * borda + 0.5 * crista * (0.45 + borda) + 0.75 * linhas * (0.3 + borda) + 0.12 * luz, 0.0, 1.0);

  // O ícone: os pontos da frente acendem formando o desenho, e o resto da
  // esfera baixa um pouco, para ele ler.
  float ic = icone(uv, t);
  float algum = smoothstep(0.0, 0.2, ic) * 0.0 + step(0.001, ic);
  float env = 0.0;
  {
    float f = fract(t / 5.0);
    float vez = mod(floor(t / 5.0), 5.0);
    env = vez < 0.5 ? 0.0 : smoothstep(0.08, 0.3, f) * smoothstep(0.96, 0.74, f);
  }
  I = mix(I, I * 0.55, env * 0.8 * (1.0 - borda));
  I = max(I, smoothstep(0.15, 0.7, ic) * 0.95);

  float raio = mix(claro < 0.5 ? 0.12 : 0.2, 0.44, I);
  float ponto = smoothstep(raio + 0.12, raio - 0.12, dd);

  // A cor sai das DUAS cores que a aparência muda: a que age embaixo, a
  // do alcançado em cima — o mesmo degradê da estrela da Morphi
  // Intelligence.
  float v = clamp(uv.y * 0.55 + 0.5 + 0.1 * sin(t * 0.3 + uv.x * 2.0), 0.0, 1.0);
  float3 cor;
  if (claro < 0.5) {
    cor = mix(acao, acao2, smoothstep(0.1, 0.5, v));
    cor = mix(cor, alcancado, smoothstep(0.5, 1.0, v) * 0.85);
  } else {
    // no claro a lima some no branco: o degradê é da própria cor que age,
    // do tom fundo embaixo a um tom claro em cima, com um toque do alcançado
    cor = mix(acao2, acao, smoothstep(0.05, 0.45, v));
    cor = mix(cor, mix(acao, float3(1.0), 0.35), smoothstep(0.5, 1.0, v));
    cor = mix(cor, alcancado, smoothstep(0.75, 1.0, v) * 0.18);
  }
  float alfa;
  if (claro < 0.5) {
    cor = mix(cor, float3(1.0), pow(I, 3.0) * 0.3 + smoothstep(0.3, 0.8, ic) * 0.22);
    cor *= 0.55 + 0.75 * I;
    alfa = ponto * mix(0.3, 1.0, I);
  } else {
    cor = mix(cor, acao, smoothstep(0.3, 0.8, ic) * 0.5);
    cor *= mix(0.78, 1.0, I);
    alfa = ponto * mix(0.55, 1.0, I);
  }
  alfa *= smoothstep(0.0, 0.06, dot(n, -rd) + 0.02);
  // os pontos por cima da luz de trás
  float3 fim = cor * alfa + base * (1.0 - alfa);
  float aFim = alfa + aBase * (1.0 - alfa);
  return half4(fim, aFim);
}
`;

/** O lado da textura dos desenhos, em pixels. */
const M = 128;

/* Os ícones do app (Lucide, viewBox 24, em traço): a seringa e o copo
   d'água. A água do copo vai cheia, para o desenho ler em pontos. */
const SERINGA = ['m18 2 4 4', 'm17 7 3-3', 'M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5', 'm9 11 4 4', 'm5 19-3 3', 'm14 4 6 6'];
const COPO = 'M5.116 4.104A1 1 0 0 1 6.11 3h11.78a1 1 0 0 1 .994 1.105L17.19 20.21A2 2 0 0 1 15.2 22H8.8a2 2 0 0 1-2-1.79z';
const AGUA = 'M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0L17.2 20.2A2 2 0 0 1 15.2 22H8.8a2 2 0 0 1-2-1.79z';

function texturaDosDesenhos(): SkImage | null {
  const sup = Skia.Surface.Make(M, M);
  if (!sup) return null;
  const cv = sup.getCanvas();
  cv.clear(Skia.Color('#000000'));
  const tinta = (cor: string, traco?: number) => {
    const p = Skia.Paint();
    p.setAntiAlias(true);
    p.setColor(Skia.Color(cor));
    p.setBlendMode(BlendMode.Plus);
    p.setMaskFilter(Skia.MaskFilter.MakeBlur(BlurStyle.Normal, M * 0.012, false));
    if (traco) {
      p.setStyle(PaintStyle.Stroke);
      p.setStrokeWidth(traco);
      p.setStrokeCap(StrokeCap.Round);
      p.setStrokeJoin(StrokeJoin.Round);
    }
    return p;
  };
  // R: o M da Morphi (533 x 222)
  const m = Skia.Path.MakeFromSVGString(D_SIMBOLO);
  if (m) {
    const s = (M * 0.62) / 533;
    cv.save(); cv.translate(M / 2 - 266.5 * s, M / 2 - 111 * s); cv.scale(s, s);
    cv.drawPath(m, tinta('#FF0000')); cv.restore();
  }
  const s24 = (M * 0.56) / 24;
  // G: a seringa
  cv.save(); cv.translate(M / 2 - 12 * s24, M / 2 - 12 * s24); cv.scale(s24, s24);
  const traco = tinta('#00FF00', 2.4);
  for (const d of SERINGA) { const p = Skia.Path.MakeFromSVGString(d); if (p) cv.drawPath(p, traco); }
  cv.restore();
  // B: o copo e a água
  cv.save(); cv.translate(M / 2 - 12 * s24, M / 2 - 12 * s24); cv.scale(s24, s24);
  const copo = Skia.Path.MakeFromSVGString(COPO);
  if (copo) cv.drawPath(copo, tinta('#0000FF', 2.4));
  const agua = Skia.Path.MakeFromSVGString(AGUA);
  if (agua) cv.drawPath(agua, tinta('#000096'));
  cv.restore();
  sup.flush();
  return sup.makeImageSnapshot();
}

const rgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h.slice(0, 6), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

/** As cores vêm do tema (ver /companion) — as duas que a aparência muda. */
export type PropsDoOrbe = {
  tamanho: number;
  /** O tema claro tem a própria variação — ver o alto do arquivo. */
  claro: boolean;
  /** a cor que age (accent) e o segundo tom dela (accent2) */
  acao: string; acao2: string;
  /** a cor do alcançado (lime) */
  alcancado: string;
};

export default function OrbeSkia({ tamanho, claro, acao, acao2, alcancado }: PropsDoOrbe) {
  const efeito = useMemo(() => Skia.RuntimeEffect.Make(FONTE), []);
  const textura = useMemo(() => texturaDosDesenhos(), []);
  const relogio = useClock();
  const [parado, setParado] = useState(false);

  useEffect(() => {
    let vivo = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => { if (vivo) setParado(v); }).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setParado);
    return () => { vivo = false; sub.remove(); };
  }, []);

  const cores = useMemo(() => ({ acao: rgb(acao), acao2: rgb(acao2), alcancado: rgb(alcancado) }), [acao, acao2, alcancado]);
  const uniforms = useDerivedValue(() => ({
    res: [tamanho, tamanho],
    // parada, ela fica num instante sem desenho: a esfera só
    t: parado ? 2.0 : relogio.value / 1000,
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
