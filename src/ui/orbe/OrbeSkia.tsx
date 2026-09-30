import React, { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { Canvas, Fill, Shader, Skia, useClock } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';

/* ============================================================
   O ORBE DA MORPHI INTELLIGENCE — o desenho

   Uma esfera de pontos que gira devagar, com a borda ondulando e dobras
   que passam por ela como ondas: é a presença da Morphi Intelligence no
   alto da conversa vazia, no lugar da estrela pequena.

   ⚠️ É UM SHADER, E NÃO DESENHO. Cada pixel do quadrado se pergunta,
   a cada quadro, se cai num ponto da esfera e de que cor. Na placa de
   vídeo isso custa quase nada, e o movimento sai fluido até em aparelho
   simples; o mesmo efeito com centenas de círculos animados um a um
   travaria o JavaScript.

   AS CORES SÃO AS DO APLICATIVO, e chegam de fora (ui/orbe): o miolo na
   cor de destaque, as cristas das dobras na lima, e o brilho da borda.

   ⚠️ COM "REDUZIR MOVIMENTO" LIGADO NO APARELHO, O ORBE PARA num quadro
   bonito, em vez de girar.

   Só é importado depois do Skia carregado — ver ui/orbe.web, que o busca
   sob demanda na web.
   ============================================================ */

const FONTE = `
uniform float2 res;
uniform float t;
uniform float3 miolo;
uniform float3 crista;
uniform float3 brilho;

half4 main(float2 pos) {
  float2 uv = (pos - res * 0.5) / (min(res.x, res.y) * 0.5);
  float ang = atan(uv.y, uv.x);
  float d = length(uv);

  // A borda ondula: três ondas lentas em volta do círculo.
  float borda = 0.05 * sin(3.0 * ang + t * 0.7)
              + 0.035 * sin(5.0 * ang - t * 1.05)
              + 0.025 * sin(7.0 * ang + t * 0.55);
  float R = 0.8 + borda;
  float rr = d / R;
  if (rr >= 1.0) { return half4(0.0); }

  // O ponto na superfície, e a esfera girando em volta do eixo vertical.
  float z = sqrt(1.0 - rr * rr);
  float3 n = float3(uv / R, z);
  float a = t * 0.22;
  float cs = cos(a);
  float sn = sin(a);
  float3 q = float3(cs * n.x + sn * n.z, n.y, -sn * n.x + cs * n.z);

  // As dobras: a superfície empurrada por ondas cruzadas.
  q += 0.09 * float3(sin(q.y * 5.0 + t * 0.8), sin(q.z * 5.0 + t * 0.9), sin(q.x * 5.0 - t * 0.7));

  float lat = asin(clamp(q.y / length(q), -1.0, 1.0));
  float lon = atan(q.z, q.x);
  float N = 40.0;
  float2 grade = float2(lon / 6.2831853 * N * 2.0, lat / 3.1415927 * N);
  float2 celula = fract(grade) - 0.5;
  float dd = length(celula);

  // O aro (0 no miolo, 1 na borda) e a onda das dobras, que acende as
  // cristas como o laranja da referência — aqui, na lima do app.
  float aro = 1.0 - z;
  float onda = 0.5 + 0.5 * sin(q.y * 7.0 - t * 1.1 + sin(q.x * 3.0 + t * 0.6) * 1.8);
  float crista_ = smoothstep(0.55, 1.0, onda) * smoothstep(0.1, 0.75, aro);
  float tam = mix(0.2, 0.38, aro) * mix(0.85, 1.25, onda);
  float ponto = smoothstep(tam, tam - 0.1, dd);

  float3 cor = mix(miolo, brilho, smoothstep(0.3, 0.9, aro) * 0.6);
  cor = mix(cor, crista, crista_);
  float alfa = ponto * (0.45 + 0.55 * aro + 0.35 * crista_) * smoothstep(1.0, 0.94, rr);

  // Um brilho baixo no miolo, para a esfera ter corpo entre os pontos.
  float halo = 0.10 * z * smoothstep(1.0, 0.6, rr);
  float3 corFinal = cor * alfa + miolo * halo;
  float alfaFinal = clamp(alfa + halo, 0.0, 1.0);
  return half4(corFinal, alfaFinal);
}
`;

const rgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h.slice(0, 6), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export type PropsDoOrbe = { tamanho: number; miolo: string; crista: string; brilho: string };

export default function OrbeSkia({ tamanho, miolo, crista, brilho }: PropsDoOrbe) {
  const efeito = useMemo(() => Skia.RuntimeEffect.Make(FONTE), []);
  const relogio = useClock();
  const [parado, setParado] = useState(false);

  useEffect(() => {
    let vivo = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => { if (vivo) setParado(v); }).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setParado);
    return () => { vivo = false; sub.remove(); };
  }, []);

  const cores = useMemo(() => ({ miolo: rgb(miolo), crista: rgb(crista), brilho: rgb(brilho) }), [miolo, crista, brilho]);
  const uniforms = useDerivedValue(() => ({
    res: [tamanho, tamanho],
    t: parado ? 4.2 : relogio.value / 1000,
    miolo: cores.miolo,
    crista: cores.crista,
    brilho: cores.brilho,
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
