import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import { checkinToday } from '../logic/derive';
import { now, relDay } from '../logic/time';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Pill, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

export default function Alimentacao() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const prot = Math.round(checkinToday(S)?.prot || 70);
  const addMeal = (name: string) => update((s: any) => {
    s.meals.unshift({ t: +now(), name, prot: 'alta', qual: 'boa', tag: name });
  });

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Alimentação</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Sem contar calorias — foco no que sustenta o tratamento</Txt>
        </View>
      </Row>

      {/* proteína */}
      <Card style={{ marginTop: 18 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Row gap={6}><Icon name="flame" size={14} color={c.amber} sw={2} /><Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>PROTEÍNA DE HOJE</Txt></Row>
          <Txt v="h2"><Txt v="h2" c={c.accent}>{prot}</Txt><Txt v="label" c={c.tx3}> / 90 g</Txt></Txt>
        </Row>
        <View style={{ height: 8, borderRadius: 4, backgroundColor: c.track, marginTop: 12, overflow: 'hidden' }}>
          <LinearGradient colors={[c.gradFrom, c.gradTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: `${Math.min(100, (prot / 90) * 100)}%`, height: '100%' }} />
        </View>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 8 }}>Proteína protege sua massa magra durante a perda de peso.</Txt>
      </Card>

      <Pressable style={({ pressed }) => [{ marginTop: 12, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
        <LinearGradient colors={[c.gradFrom, c.gradTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: radius.pill, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
        <Icon name="camera" size={16} color="#fff" sw={2} />
        <Txt v="title" c="#fff">Escanear uma refeição</Txt>
        </LinearGradient>
      </Pressable>

      {/* recentes */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Registro recente</Txt>
      <View style={{ gap: 10 }}>
        {S.meals.map((m: any, i: number) => (
          <Card key={`${m.t}-${i}`} style={{ paddingVertical: 14 }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Txt v="title">{m.name}</Txt>
              <Txt v="micro" c={c.tx3}>{relDay(new Date(m.t))}</Txt>
            </Row>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 3 }}>{m.tag}</Txt>
            <Row gap={7} style={{ marginTop: 10, flexWrap: 'wrap' }}>
              <Pill label={`proteína ${m.prot}`} color={m.prot === 'alta' ? c.accent : c.tx3} bg={m.prot === 'alta' ? c.accentWeak : c.bg2} />
              <Pill label="saciedade longa" color={c.accent2} bg={c.waterBg} />
              <Pill label={`qualidade ${m.qual}`} color={c.tx3} bg={c.bg2} />
            </Row>
          </Card>
        ))}
      </View>

      {/* favoritos */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Favoritos</Txt>
      <Card style={{ paddingVertical: 4 }}>
        {S.favMeals.map((f: string, i: number) => (
          <View key={f}>
            {i > 0 && <Divider style={{ marginLeft: 52 }} />}
            <Row style={{ paddingVertical: 12 }}>
              <IconBadge name="leaf" size={40} />
              <Txt v="title" style={{ flex: 1, marginLeft: 12 }}>{f}</Txt>
              <Pressable onPress={() => addMeal(f)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                <View style={{ paddingHorizontal: 13, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: c.accentWeak, borderWidth: 1, borderColor: c.accentLine }}>
                  <Txt v="micro" c={c.accent}>registrar</Txt>
                </View>
              </Pressable>
            </Row>
          </View>
        ))}
      </Card>
    </Screen>
  );
}
