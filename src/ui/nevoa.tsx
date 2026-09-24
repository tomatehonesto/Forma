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

   ⚠️ E A COR MORA À DIREITA. O título e o texto de abertura são
   alinhados à esquerda, e mancha atrás de letra é letra lutando para ser
   lida — então as manchas ficam do meio para a direita, e um véu da cor
   do fundo clareia o lado esquerdo. O título lê como lê em qualquer
   outra tela; a cor fica sendo o que acontece em volta dele.
   ============================================================ */

/* ⚠️ `capa` É A NÉVOA NO LUGAR DE UMA FOTO — o cabeçalho de /clinica
   quando a clínica não mandou imagem. Ali o nome mora num vidro, que
   garante a leitura sozinho: a cor pode ocupar o quadro inteiro, sem o
   véu da esquerda e sem se desfazer no pé, porque o vidro precisa de cor
   atrás dele para ser vidro. */
export function Nevoa({ altura, capa }: { altura: number; capa?: boolean }) {
  const { c, isDark } = useTheme();
  /* ⚠️ O ID É POR INSTÂNCIA. Na web os gradientes do SVG vivem no mesmo
     documento, e duas névoas com o mesmo id pintariam as duas com as
     cores da primeira. */
  const base = useId().replace(/[^a-zA-Z0-9]/g, '');

  const forca = isDark ? 0.8 : 1;
  const tinta = mix(c.accent, '#FFFFFF', 0.5);
  const manchas = capa
    ? [
      { id: `${base}a`, cor: c.accent, cx: '82%', cy: '24%', rx: '90%', ry: '58%', a: 0.95 },
      { id: `${base}b`, cor: tinta, cx: '14%', cy: '8%', rx: '72%', ry: '46%', a: 0.95 },
      { id: `${base}c`, cor: c.lime, cx: '100%', cy: '82%', rx: '62%', ry: '40%', a: 0.72 },
      { id: `${base}d`, cor: c.accent2, cx: '36%', cy: '72%', rx: '58%', ry: '36%', a: 0.5 },
    ]
    : [
      { id: `${base}a`, cor: c.accent, cx: '92%', cy: '10%', rx: '82%', ry: '64%', a: 0.95 },
      { id: `${base}b`, cor: tinta, cx: '60%', cy: '0%', rx: '58%', ry: '42%', a: 0.8 },
      { id: `${base}c`, cor: c.lime, cx: '100%', cy: '58%', rx: '60%', ry: '42%', a: 0.72 },
      { id: `${base}d`, cor: c.accent2, cx: '80%', cy: '36%', rx: '42%', ry: '28%', a: 0.4 },
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
      {capa ? null : (
        <>
          {/* o véu do lado esquerdo, onde o título mora */}
          <LinearGradient
            colors={[alfa(c.bg, 0.9), alfa(c.bg, 0.5), alfa(c.bg, 0)]}
            locations={[0, 0.38, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 0.78, y: 0.5 }}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          />
          <LinearGradient
            colors={[alfa(c.bg, 0), c.bg]}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: altura * 0.42 }}
          />
        </>
      )}
    </View>
  );
}
