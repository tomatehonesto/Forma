import React, { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import {
  BlendMode, BlurStyle, Canvas, Fill, ImageShader, Shader, Skia, useClock, type SkImage,
} from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import { D_SIMBOLO } from '../marcaCaminhos';
import { D_FAISCA } from '../marca';

/* ============================================================
   O ORBE DA MORPHI INTELLIGENCE — a marca em pontos

   A presença da Morphi Intelligence no alto da conversa vazia: uma
   matriz de pontos, como um painel de luz, em que as formas aparecem pelo
   tamanho e pelo brilho de cada ponto. Num ciclo de 20 segundos, com
   pausa em cada uma: a ESTRELA do logo, o M da MORPHI, a CRUZ de saúde e
   o CÍRCULO. Uma onda leve passa pela matriz, e os pontos balançam.

   ⚠️ A HISTÓRIA, PARA NINGUÉM REFAZER O CAMINHO (30/09/2026). Passou por
   esfera de pontos em 3D, bolha iridescente, vidro com tinta em 2D e em
   3D (bonito, mas um objeto de fora), estrela 2D pontuda e estrela com
   relevo (um 3D de plástico, "fake"). O dono sugeriu voltar aos pontos
   com as formas da marca, e é o que casa com a tela: é leve, é nosso, e
   o tema claro deixa de ser problema — ponto colorido em fundo claro não
   vira mancha, como o brilho virava.

   ⚠️ AS FORMAS SÃO OS CAMINHOS OFICIAIS, e não aproximação: a faísca do
   logo (ui/marca) e o M (ui/marcaCaminhos) são desenhados, uma vez, numa
   textura pequena e desfocada — um canal por forma (R a estrela, G o M,
   B a cruz); o círculo é calculado no shader. O desfoque é o que faz os
   pontos da borda serem menores.

   ⚠️ A TEXTURA É OPACA DE PROPÓSITO. A imagem guarda as cores
   multiplicadas pela transparência: uma forma no canal de transparência
   zerava as outras fora dela (foi assim que a estrela saiu redonda). E o
   desfoque não segue a escala do desenho: com a escala, a estrela,
   ampliada, saía cinco vezes mais borrada que o M.

   UMA VARIAÇÃO POR TEMA: no escuro os pontos acesos brilham, no degradê
   da marca (azul à lima); no claro, sem brilho, do azul ao ciano.

   ⚠️ COM "REDUZIR MOVIMENTO" LIGADO NO APARELHO, ELA PARA NA ESTRELA.

   Para conferir sem abrir o aplicativo: o shader e a textura saem iguais
   no CanvasKit do Node, a mesma engine do Skia — foi assim que cada
   versão foi vista, nos dois temas.
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
uniform float2 tamMascara;
uniform shader mascara;

// As formas moram na máscara, um canal cada: R a estrela do logo, G o M
// da Morphi, B a cruz de saúde; o círculo é calculado aqui mesmo. Desfocadas: o valor cai
// devagar na borda, e é isso que faz os pontos da borda serem menores.
float4 formas(float2 uv) {
  float2 m = (uv * 0.5 + 0.5) * tamMascara;
  float4 c = mascara.eval(m);
  float circ = smoothstep(0.66, 0.5, length(uv));
  return float4(c.r, c.g, c.b, circ);
}

// O ciclo, de 20 s, com pausa em cada forma: estrela, M, cruz, círculo.
float4 pesos(float t) {
  float c = fract(t / 20.0);
  float a = smoothstep(0.17, 0.25, c);
  float b = smoothstep(0.42, 0.5, c);
  float d = smoothstep(0.67, 0.75, c);
  float e = smoothstep(0.92, 1.0, c);
  // cada forma pesa enquanto é a da vez
  return float4((1.0 - a) + e, a * (1.0 - b), b * (1.0 - d), d * (1.0 - e));
}

half4 main(float2 pos) {
  float2 uv = (pos - res * 0.5) / (min(res.x, res.y) * 0.5);
  uv.y = -uv.y;

  // A grade de pontos.
  float N = 28.0;
  float2 g = (uv * 0.5 + 0.5) * N;
  float2 celula = floor(g) + 0.5;
  float2 centro = celula / N * 2.0 - 1.0;
  float2 dentroDaCelula = fract(g) - 0.5;

  // O valor da forma no centro do ponto, com um leve balanço que passa
  // pela matriz como uma onda — é o que a faz parecer viva.
  float2 onda = 0.035 * float2(sin(centro.y * 5.0 + t * 1.6), cos(centro.x * 5.0 + t * 1.3));
  float4 w = pesos(t);
  float4 f = formas(float2(centro.x, -centro.y) + onda);
  float v = dot(f, w);
  float pulso = 0.08 * sin(length(centro) * 9.0 - t * 2.2);
  v = clamp(v + pulso * smoothstep(0.05, 0.4, v), 0.0, 1.0);

  // O tamanho do ponto sobe com o valor; fora da forma sobra um ponto
  // mínimo, bem apagado, que desenha a matriz.
  float r = mix(0.1, 0.44, smoothstep(0.08, 0.85, v));
  float d = length(dentroDaCelula);
  float aa = 1.5 * N / min(res.x, res.y);
  float ponto = smoothstep(r + aa, r - aa, d);

  // A cor: o degradê da marca em diagonal, que gira devagar.
  float gg = clamp(dot(centro, normalize(float2(cos(t * 0.15), sin(t * 0.15) + 1.0))) * 0.45 + 0.5, 0.0, 1.0);
  float3 cor;
  float alfa;
  float fora = 1.0 - smoothstep(0.05, 0.3, v);
  if (claro < 0.5) {
    cor = mix(azul, lima, smoothstep(0.4, 1.0, gg));
    cor = mix(cor, roxo, smoothstep(0.35, 0.0, gg) * 0.6);
    cor = mix(cor, float3(1.0), smoothstep(0.75, 1.0, v) * 0.35);
    alfa = ponto * mix(0.18, 1.0, smoothstep(0.1, 0.6, v)) * (1.0 - fora * 0.75);
    // um brilho baixo em volta dos pontos acesos
    float halo = exp(-d * 5.0) * smoothstep(0.4, 1.0, v) * 0.25;
    cor = cor * alfa + cor * halo;
    alfa = clamp(alfa + halo, 0.0, 1.0);
  } else {
    cor = mix(azul, ciano, smoothstep(0.45, 1.0, gg) * 0.8);
    cor = mix(cor, roxo, smoothstep(0.4, 0.0, gg) * 0.5);
    alfa = ponto * mix(0.14, 1.0, smoothstep(0.1, 0.6, v)) * (1.0 - fora * 0.8);
    cor *= alfa;
  }
  // a matriz some perto da borda do quadrado
  float borda = smoothstep(1.0, 0.8, max(abs(uv.x), abs(uv.y)));
  return half4(cor * borda, alfa * borda);
}
`;

/** O lado da textura das formas, em pixels. */
const M = 128;

/* A textura das formas: cada uma num canal, do caminho oficial, desfocada. */
function texturaDasFormas(): SkImage | null {
  const sup = Skia.Surface.Make(M, M);
  if (!sup) return null;
  const cv = sup.getCanvas();
  cv.clear(Skia.Color('#000000'));
  const tinta = (cor: string) => {
    const p = Skia.Paint();
    p.setAntiAlias(true);
    p.setColor(Skia.Color(cor));
    p.setBlendMode(BlendMode.Plus);
    p.setMaskFilter(Skia.MaskFilter.MakeBlur(BlurStyle.Normal, M * 0.022, false));
    return p;
  };
  // R: a faísca do logo (viewBox de 24, a faísca vai de ~2,8 a ~21,2)
  const faisca = Skia.Path.MakeFromSVGString(D_FAISCA);
  if (faisca) {
    const s = (M * 0.66) / 18.4;
    cv.save(); cv.translate(M / 2 - 12 * s, M / 2 - 12 * s); cv.scale(s, s);
    cv.drawPath(faisca, tinta('#FF0000')); cv.restore();
  }
  // G: o M da Morphi (533 x 222)
  const m = Skia.Path.MakeFromSVGString(D_SIMBOLO);
  if (m) {
    const s = (M * 0.76) / 533;
    cv.save(); cv.translate(M / 2 - 266.5 * s, M / 2 - 111 * s); cv.scale(s, s);
    cv.drawPath(m, tinta('#00FF00')); cv.restore();
  }
  // B: a cruz de saúde
  const a = M * 0.11; const b = M * 0.31; const r = M * 0.05;
  const azulCruz = tinta('#0000FF');
  cv.drawRRect(Skia.RRectXY(Skia.XYWHRect(M / 2 - b, M / 2 - a, 2 * b, 2 * a), r, r), azulCruz);
  cv.drawRRect(Skia.RRectXY(Skia.XYWHRect(M / 2 - a, M / 2 - b, 2 * a, 2 * b), r, r), azulCruz);
  sup.flush();
  return sup.makeImageSnapshot();
}

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
  const textura = useMemo(() => texturaDasFormas(), []);
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
