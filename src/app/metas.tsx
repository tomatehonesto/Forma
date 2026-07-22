import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import { curWeight, goalProgress } from '../logic/derive';
import { nf, kg } from '../logic/time';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn } from '../ui/kit';
import { useTheme } from '../ui/useTheme';

function goalVal(S: any, g: any) {
  if (g.kind === 'peso') return goalProgress(S);
  if (g.kind === 'manual') return g.prog;
  if (g.kind === 'sono') { const wk = S.checkins.filter((c: any) => { const d = new Date(c.t).getDay(); return d >= 1 && d <= 5; }); return wk.length ? (wk.filter((c: any) => c.sono >= 7).length / wk.length) * 100 : 0; }
  if (g.kind === 'energia') { const r = S.checkins.slice(-7); return r.length ? (r.reduce((s: number, c: any) => s + c.energia, 0) / r.length) * 10 : 0; }
  return 0;
}
const subOf = (g: any) => g.kind === 'peso' ? 'referência combinada com a médica' : g.kind === 'manual' ? 'progresso pessoal' : g.kind === 'sono' ? 'noites de semana com 7h+' : 'média da semana';

export default function Metas() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Metas além do peso</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Transformação é o conjunto, não só a balança</Txt>
        </View>
      </Row>

      <View style={{ marginTop: 16, gap: 12 }}>
        {S.goals.map((g: any) => {
          const isPeso = g.kind === 'peso';
          const v = goalVal(S, g);
          return (
            <Card key={g.id} style={{ paddingVertical: 15 }}>
              <Row>
                <IconBadge name={g.ic} size={40} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt v="title">{g.label}</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{subOf(g)}</Txt>
                </View>
                <Txt v="h2" c={isPeso ? c.tx2 : c.accent}>{isPeso ? `${kg(curWeight(S))} kg` : `${nf(v, 0)}%`}</Txt>
              </Row>
              {isPeso ? (
                <Txt v="micro" c={c.tx3} style={{ marginTop: 10, lineHeight: 16 }}>Tendência constante desde {kg(S.profile.startWeight)} kg, no seu ritmo — sem contagem regressiva.</Txt>
              ) : (
                <View style={{ height: 8, borderRadius: 4, backgroundColor: c.track, marginTop: 12, overflow: 'hidden' }}>
                  <LinearGradient colors={[c.gradFrom, c.gradTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: `${Math.min(100, v)}%`, height: '100%' }} />
                </View>
              )}
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}
