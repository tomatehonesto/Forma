import React, { useRef, useState } from 'react';
import { View, Pressable, Animated, LayoutAnimation, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Txt, Row } from './kit';
import { Icon } from './Icon';
import { useTheme } from './useTheme';
import { radius, font } from '../theme';

/* ============================================================
   OS TERMOS DE UM ACEITE, QUE ABREM E FECHAM

   Saiu de app/aceite-ia quando a leitura da semana ganhou o próprio
   aceite. Desde 01/10/2026 o aceite da IA é um só (ui/aceiteDaIa), e é
   ele quem usa esta peça.

   O cabeçalho diz o que tem dentro antes de abrir: um "ver mais" sem
   conteúdo anunciado pede um toque às cegas. Dentro, cada termo tem
   título e texto, na ordem em que a pessoa pergunta — o quê, para onde,
   até onde —, e a Política fecha a lista.

   A abertura anima a altura (LayoutAnimation) e a seta gira junto; no
   navegador a altura só troca, sem animar, e está tudo bem.
   ============================================================ */
export function TermosDoAceite({ titulo, resumo, itens, politica }: {
  titulo: string; resumo: string; itens: [string, string][]; politica: string;
}) {
  const { c } = useTheme();
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const giro = useRef(new Animated.Value(0)).current;

  const alternar = () => {
    LayoutAnimation.configureNext(LayoutAnimation.create(220, 'easeInEaseOut', 'opacity'));
    Animated.timing(giro, { toValue: aberto ? 0 : 1, duration: 220, useNativeDriver: true }).start();
    setAberto((v) => !v);
  };
  const seta = giro.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '270deg'] });

  return (
    <View style={{
      marginTop: 18, borderRadius: radius.lg, overflow: 'hidden',
      backgroundColor: c.bg1, borderWidth: StyleSheet.hairlineWidth, borderColor: c.line,
    }}>
      <Pressable
        onPress={alternar}
        accessibilityRole="button" accessibilityState={{ expanded: aberto }}
        style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
      >
        <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center' }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Txt v="label" style={{ fontFamily: font.bodySemi }}>{titulo}</Txt>
            <Txt v="caption" c={c.tx3}>{resumo}</Txt>
          </View>
          <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View style={{ transform: [{ rotate: seta }] }}>
              <Icon name="chev" size={13} color={c.tx2} sw={2.2} />
            </Animated.View>
          </View>
        </Row>
      </Pressable>

      {aberto ? (
        <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.line, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16, gap: 14 }}>
          {itens.map(([t, texto]) => (
            <View key={t} style={{ gap: 3 }}>
              <Txt v="label" style={{ fontFamily: font.bodySemi }}>{t}</Txt>
              <Txt v="caption" c={c.tx2} style={{ lineHeight: 20 }}>{texto}</Txt>
            </View>
          ))}
          <Pressable onPress={() => router.push('/documento?id=privacidade' as any)} hitSlop={8}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, alignSelf: 'flex-start' }]}>
            <Row gap={6} style={{ alignItems: 'center' }}>
              <Txt v="label" c={c.accent2}>{politica}</Txt>
              <Icon name="chev" size={12} color={c.accent2} sw={2.2} />
            </Row>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
