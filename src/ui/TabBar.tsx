import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from './Icon';
import { Txt } from './kit';
import { useTheme } from './useTheme';
import { shadowCard } from '../theme';

const ITEMS = [
  { ic: 'home', label: 'Início' },
  { ic: 'activity', label: 'Jornada' },
  { ic: 'barchart', label: 'Insights' },
  { ic: 'user', label: 'Você' },
];

/* Tab bar custom com FAB central (abre o check-in). */
export function TabBar({ state, navigation }: any) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const Tab = ({ idx }: { idx: number }) => {
    const focused = state.index === idx;
    const route = state.routes[idx];
    const { ic, label } = ITEMS[idx];
    return (
      <Pressable
        style={styles.tab}
        onPress={() => {
          const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
        }}
      >
        <Icon name={ic} size={24} color={focused ? c.accent : c.tx3} sw={focused ? 2.1 : 1.7} />
        <Txt v="micro" c={focused ? c.accent : c.tx3} style={{ marginTop: 3 }}>{label}</Txt>
      </Pressable>
    );
  };

  return (
    <View style={[styles.bar, { backgroundColor: c.bg1, borderTopColor: c.line, paddingBottom: (insets.bottom || 8) + 6 }]}>
      <Tab idx={0} />
      <Tab idx={1} />
      <View style={styles.fabSlot}>
        <Pressable onPress={() => router.push('/checkin')} style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.94 : 1 }] }]}>
          <LinearGradient colors={[c.gradFrom, c.gradTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.fab, shadowCard(c)]}>
            <Icon name="plus" size={26} color="#fff" sw={2.6} />
          </LinearGradient>
        </Pressable>
      </View>
      <Tab idx={2} />
      <Tab idx={3} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'flex-start', paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fabSlot: { width: 74, alignItems: 'center' },
  fab: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', marginTop: -24 },
});
