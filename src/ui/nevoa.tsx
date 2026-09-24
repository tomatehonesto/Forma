import React, { useId } from 'react';
import { View } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from './useTheme';
import { alfa, mix } from '../theme';

/* ============================================================
   A NÉVOA — o degradê desfocado no alto da vitrine da rede

   ⚠️ NÃO É A AURORA. A aurora é imagem, escura e dramática, e é o fundo
   das telas que falam do tratamento da pessoa. A vitrine fala de quem
   está do lado de fora — e pede o contrário: luz, ar, uma cor que se
   desfaz no papel.

   ⚠️ E É DESENHADA, NÃO FOTOGRAFADA, e é por isso que segue a paleta.
   São três manchas radiais — a cor de ação, a cor de "alcançado" e um
   meio-tom entre a primeira e o branco —, cada uma indo da cor ao
   transparente. Sobrepostas, lêem como um borrão; trocar a paleta troca
   as três, e o modo escuro só baixa a força delas.

   O pé dissolve no fundo da página, e o que vem depois começa sem corte.
   ============================================================ */

export function Nevoa({ altura }: { altura: number }) {
  const { c, isDark } = useTheme();
  /* ⚠️ O ID É POR INSTÂNCIA. Na web os gradientes do SVG vivem no mesmo
     documento, e duas névoas com o mesmo id pintariam as duas com as
     cores da primeira. */
  const base = useId().replace(/[^a-zA-Z0-9]/g, '');

  const forca = isDark ? 0.8 : 1;
  const manchas = [
    { id: `${base}a`, cor: c.accent, cx: '84%', cy: '14%', rx: '100%', ry: '68%', a: 0.95 },
    { id: `${base}b`, cor: mix(c.accent, '#FFFFFF', 0.5), cx: '10%', cy: '4%', rx: '75%', ry: '55%', a: 1 },
    { id: `${base}c`, cor: c.lime, cx: '0%', cy: '58%', rx: '66%', ry: '42%', a: 0.65 },
    { id: `${base}d`, cor: c.accent2, cx: '70%', cy: '44%', rx: '48%', ry: '30%', a: 0.4 },
  ];

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: altura }}>
      <Svg width="100%" height="100%">
        <Defs>
          {manchas.map((m) => (
            <RadialGradient key={m.id} id={m.id} cx={m.cx} cy={m.cy} rx={m.rx} ry={m.ry} fx={m.cx} fy={m.cy}>
              <Stop offset="0" stopColor={m.cor} stopOpacity={m.a * forca} />
              <Stop offset="0.5" stopColor={m.cor} stopOpacity={m.a * forca * 0.38} />
              <Stop offset="1" stopColor={m.cor} stopOpacity={0} />
            </RadialGradient>
          ))}
        </Defs>
        {manchas.map((m) => (
          <Rect key={m.id} x="0" y="0" width="100%" height="100%" fill={`url(#${m.id})`} />
        ))}
      </Svg>
      <LinearGradient
        colors={[alfa(c.bg, 0), c.bg]}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: altura * 0.42 }}
      />
    </View>
  );
}
