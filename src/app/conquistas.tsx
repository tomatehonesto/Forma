import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { checkins30, journeyDay, achDone } from '../logic/derive';
import { relDay } from '../logic/time';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Pill } from '../ui/kit';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

export default function Conquistas() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const done = achDone(S), locked = S.achievements.filter((a: any) => !a.done);

  const AchCard = ({ a, on }: { a: any; on: boolean }) => (
    <View style={{ width: '48.5%', backgroundColor: c.bg1, borderRadius: radius.lg, borderWidth: 1, borderColor: c.line, padding: 15, marginTop: 12, alignItems: 'center', opacity: on ? 1 : 0.55 }}>
      <IconBadge name={a.ic} size={44} color={on ? c.accent : c.tx4} bg={on ? c.accentWeak : c.bg3} />
      <Txt v="title" style={{ marginTop: 10, textAlign: 'center' }}>{a.title}</Txt>
      <Txt v="micro" c={c.tx3} style={{ marginTop: 3, textAlign: 'center', lineHeight: 15 }}>{a.desc}</Txt>
      <View style={{ marginTop: 8 }}>
        <Pill label={on ? relDay(new Date(a.t)) : 'em progresso'} color={on ? c.accent : c.tx3} bg={on ? c.accentWeak : c.bg2} />
      </View>
    </View>
  );

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Conquistas</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Marcos da jornada — discretos, nunca infantis</Txt>
        </View>
      </Row>

      <Card tint={c.accentWeak} style={{ marginTop: 18, paddingVertical: 16 }}>
        <Row>
          {[[String(checkins30(S)), 'check-ins no mês'], [`${done.length}/${S.achievements.length}`, 'conquistas'], [String(journeyDay(S)), 'dias de jornada']].map(([v, l], i) => (
            <View key={l} style={{ flex: 1, alignItems: 'center', borderLeftWidth: i ? 1 : 0, borderLeftColor: c.line }}>
              <Txt v="h1" style={{ fontSize: 24 }}>{v}</Txt>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 2, textAlign: 'center' }}>{l}</Txt>
            </View>
          ))}
        </Row>
      </Card>

      <Txt v="h2" style={{ marginTop: 22 }}>Desbloqueadas</Txt>
      <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {done.map((a: any) => <AchCard key={a.id} a={a} on />)}
      </Row>

      <Txt v="h2" style={{ marginTop: 22 }}>A caminho</Txt>
      <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {locked.map((a: any) => <AchCard key={a.id} a={a} on={false} />)}
      </Row>
    </Screen>
  );
}
