import React from 'react';
import { Text, View, Pressable, ScrollView, StyleSheet, TextProps, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ty, font, radius, space, shadowCard } from '../theme';
import { useTheme } from './useTheme';
import { Icon } from './Icon';

type TxtProps = TextProps & { v?: keyof typeof ty; c?: string; style?: StyleProp<TextStyle>; };
export function Txt({ v = 'body', c, style, ...rest }: TxtProps) {
  const { c: col } = useTheme();
  return <Text {...rest} style={[ty[v], { color: c ?? col.tx }, style]} />;
}

/* Texto com ênfase — parseia marcador <b>..</b> vindo dos insights. */
export function Rich({ text, v = 'body', base, bold, style }: { text: string; v?: keyof typeof ty; base?: string; bold?: string; style?: StyleProp<TextStyle> }) {
  const { c } = useTheme();
  const parts = text.split(/(<b>.*?<\/b>)/g).filter(Boolean);
  return (
    <Text style={[ty[v], { color: base ?? c.tx }, style]}>
      {parts.map((p, i) =>
        p.startsWith('<b>')
          ? <Text key={i} style={{ color: bold ?? c.accent, fontFamily: v === 'body' || v === 'bodyMed' ? font.bodySemi : font.bold }}>{p.replace(/<\/?b>/g, '')}</Text>
          : <Text key={i}>{p}</Text>
      )}
    </Text>
  );
}

export function Card({ children, style, onPress, tint }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; tint?: string }) {
  const { c } = useTheme();
  const body = (
    <View style={[{ backgroundColor: tint ?? c.bg1, borderRadius: radius.xl, padding: space.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: c.line }, shadowCard(c), style]}>
      {children}
    </View>
  );
  if (!onPress) return body;
  return <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.97 : 1, transform: [{ scale: pressed ? 0.994 : 1 }] }]}>{body}</Pressable>;
}

export function Pill({ label, color, bg, icon }: { label: string; color?: string; bg?: string; icon?: string }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', backgroundColor: bg ?? c.accentWeak, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill }}>
      {icon ? <Icon name={icon} size={13} color={color ?? c.accent} sw={2} /> : null}
      <Text style={[ty.micro, { color: color ?? c.accent }]}>{label}</Text>
    </View>
  );
}

export function IconBadge({ name, size = 44, iconSize, color, bg, sw }: { name: string; size?: number; iconSize?: number; color?: string; bg?: string; sw?: number }) {
  const { c } = useTheme();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2.6, backgroundColor: bg ?? c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={name} size={iconSize ?? Math.round(size * 0.46)} color={color ?? c.accent} sw={sw ?? 1.8} />
    </View>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: c.line2 }, style]} />;
}

export function Row({ children, style, gap }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; gap?: number }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center' }, gap != null && { gap }, style]}>{children}</View>;
}

export function Chevron({ color, size = 18 }: { color?: string; size?: number }) {
  const { c } = useTheme();
  return <Icon name="chev" size={size} color={color ?? c.tx4} sw={2} />;
}

export function CircleBtn({ name, onPress, color, bg, size = 40 }: { name: string; onPress?: () => void; color?: string; bg?: string; size?: number }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ width: size, height: size, borderRadius: size / 2.4, alignItems: 'center', justifyContent: 'center', backgroundColor: bg ?? c.bg2, opacity: pressed ? 0.7 : 1 }]}>
      <Icon name={name} size={Math.round(size * 0.5)} color={color ?? c.tx2} sw={1.9} />
    </Pressable>
  );
}

/* Container base de tela — SafeArea topo + scroll + fundo do app. */
export function Screen({ children, scroll = true, style }: { children: React.ReactNode; scroll?: boolean; style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  if (!scroll) return <View style={[{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top }, style]}>{children}</View>;
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.bg }}
      contentContainerStyle={[{ paddingTop: insets.top + 6, paddingBottom: 120, paddingHorizontal: space.lg }, style]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

export const sectionTitleStyle: TextStyle = { ...ty.h2 };
