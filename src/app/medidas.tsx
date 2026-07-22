import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import { latestMeasure, firstMeasure } from '../logic/derive';
import { nf } from '../logic/time';
import { Screen, Txt, Card, Row, CircleBtn } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { AreaCurve } from '../ui/charts';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

const ROWS: { k: string; label: string; u: string; ic: string; goodUp?: boolean }[] = [
  { k: 'cintura', label: 'Cintura', u: 'cm', ic: 'ruler' },
  { k: 'quadril', label: 'Quadril', u: 'cm', ic: 'ruler' },
  { k: 'braco', label: 'Braço', u: 'cm', ic: 'ruler' },
  { k: 'coxa', label: 'Coxa', u: 'cm', ic: 'ruler' },
  { k: 'gordura', label: 'Gordura corporal', u: '%', ic: 'full' },
  { k: 'musculo', label: 'Massa muscular', u: '%', ic: 'bolt', goodUp: true },
];

export default function Medidas() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const m1 = latestMeasure(S), m0 = firstMeasure(S);

  const trend = (k: string) => {
    const vals = S.measures.map((x: any) => x[k]);
    const mn = Math.min(...vals), mx = Math.max(...vals), pad = (mx - mn) * 0.35 || 1;
    return vals.map((v: number, i: number) => ({ x: i / (vals.length - 1 || 1), y: (v - (mn - pad)) / ((mx + pad) - (mn - pad)) }));
  };

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Medidas & composição</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>O corpo mudando de forma, além da balança</Txt>
        </View>
      </Row>

      <View style={{ marginTop: 16, gap: 12 }}>
        {ROWS.map((r) => {
          const v = (m1 as any)[r.k], v0 = (m0 as any)[r.k], d = v - v0;
          const good = r.goodUp ? d >= 0 : d <= 0;
          return (
            <Card key={r.k} style={{ paddingVertical: 15 }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Row gap={6}><Icon name={r.ic} size={14} color={c.accent} sw={2} /><Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>{r.label.toUpperCase()}</Txt></Row>
                <Row gap={3}>
                  <Icon name={d <= 0 ? 'arrowdown' : 'arrowup'} size={12} color={good ? c.accent : c.cta} sw={2.2} />
                  <Txt v="caption" c={good ? c.accent : c.cta}>{nf(Math.abs(d), 1)} {r.u}</Txt>
                </Row>
              </Row>
              <Row style={{ alignItems: 'baseline', marginTop: 8 }} gap={10}>
                <Txt v="h1" style={{ fontSize: 26 }}>{nf(v, 1)}<Txt v="label" c={c.tx3}> {r.u}</Txt></Txt>
                <Txt v="caption" c={c.tx3}>era {nf(v0, 1)}</Txt>
              </Row>
              <View style={{ marginTop: 6 }}>
                <AreaCurve pts={trend(r.k)} height={56} padT={8} padB={8} nodes dashed={false} id={`m-${r.k}`} strokeFrom={r.goodUp ? c.accent : undefined} strokeTo={r.goodUp ? c.accent : undefined} />
              </View>
            </Card>
          );
        })}
      </View>

      <Pressable style={({ pressed }) => [{ marginTop: 16, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
        <LinearGradient colors={[c.gradFrom, c.gradTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: radius.pill, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
          <Icon name="plus" size={16} color="#fff" sw={2.4} />
          <Txt v="title" c="#fff">Registrar novas medidas</Txt>
        </LinearGradient>
      </Pressable>
    </Screen>
  );
}
