import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from './Icon';
import { Txt } from './kit';
import { useTheme } from './useTheme';
import { radius } from '../theme';

/* A CONVERSA COMO CAMADA TRANSVERSAL: todo contexto ganha um botão que abre
   o chat já com a pergunta certa. A pessoa não "abre o assistente" — ela
   pergunta, e por isso o rótulo é um verbo e não um nome próprio. */
export function AskCompanion({ q, label = 'Perguntar sobre isso', tone = 'soft', style }: {
  q: string; label?: string; tone?: 'soft' | 'line'; style?: any;
}) {
  const { c } = useTheme();
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/companion?q=${encodeURIComponent(q)}` as any)}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, alignSelf: 'flex-start' }, style]}
    >
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 7,
        backgroundColor: tone === 'soft' ? c.accentWeak : 'transparent',
        borderWidth: tone === 'line' ? 1.2 : 0, borderColor: c.accentLine,
        paddingHorizontal: 13, paddingVertical: 9, borderRadius: radius.pill,
      }}>
        <Icon name="aura" size={14} color={c.accent} sw={2} />
        <Txt v="label" c={c.accent}>{label}</Txt>
      </View>
    </Pressable>
  );
}
