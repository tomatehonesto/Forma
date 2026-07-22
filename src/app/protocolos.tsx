import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import { nextInjectionDate } from '../logic/derive';
import { relDay } from '../logic/time';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Pill, Rich, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';

export default function Protocolos() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const p = S.protocol;
  const done = p.tasks.filter((t: any) => t.done).length;
  const pct = Math.round((done / p.tasks.length) * 100);
  const toggle = (i: number) => update((s: any) => { s.protocol.tasks[i].done = !s.protocol.tasks[i].done; });

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Protocolos</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Sua jornada da semana, passo a passo</Txt>
        </View>
      </Row>

      <Card tint={c.accentWeak} style={{ marginTop: 18 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Row gap={6}><Icon name="target" size={14} color={c.accent} sw={2} /><Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>SEMANA {p.week}</Txt></Row>
          <Txt v="h2" c={c.accent}>{pct}%</Txt>
        </Row>
        <Txt v="h1" style={{ fontSize: 24, marginTop: 8 }}>{done} de {p.tasks.length} concluídos</Txt>
        <View style={{ height: 8, borderRadius: 4, backgroundColor: c.track, marginTop: 12, overflow: 'hidden' }}>
          <LinearGradient colors={[c.gradFrom, c.gradTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: `${pct}%`, height: '100%' }} />
        </View>
      </Card>

      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Esta semana</Txt>
      <View style={{ gap: 10 }}>
        {p.tasks.map((t: any, i: number) => (
          <Pressable key={t.t} onPress={() => toggle(i)}>
            <Card style={{ paddingVertical: 14 }}>
              <Row gap={12}>
                <View style={{ width: 26, height: 26, borderRadius: 9, borderWidth: 1.6, borderColor: t.done ? c.accent : c.line2, backgroundColor: t.done ? c.accent : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                  {t.done && <Icon name="check" size={15} color="#fff" sw={2.4} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Txt v="title" c={t.done ? c.tx3 : c.tx} style={t.done ? { textDecorationLine: 'line-through' } : undefined}>{t.t}</Txt>
                  {!!t.note && <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{t.note}</Txt>}
                </View>
              </Row>
            </Card>
          </Pressable>
        ))}
      </View>

      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Semanas anteriores</Txt>
      <Card style={{ paddingVertical: 4 }}>
        {[['Semana 9', '5 de 5 concluídos'], ['Semana 8', '4 de 5 · exame incluído']].map(([t, s], i) => (
          <View key={t}>
            {i > 0 && <Divider style={{ marginLeft: 52 }} />}
            <Row style={{ paddingVertical: 13 }}>
              <IconBadge name="check" size={40} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Txt v="title">{t}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{s}</Txt>
              </View>
              <Pill label="completa" />
            </Row>
          </View>
        ))}
      </Card>

      <Card tint={c.accentWeak} style={{ marginTop: 14 }}>
        <Row gap={7}><Icon name="aura" size={14} color={c.accent} sw={2} /><Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>PREVISÃO DA PRÓXIMA SEMANA</Txt></Row>
        <Rich v="bodyMed" base={c.tx2} bold={c.tx} style={{ marginTop: 8, lineHeight: 21 }} text={`Aplicação ${relDay(nextInjectionDate(S))}, consulta ${relDay(new Date(S.consult.t))}, e provável pico de fome perto da dose. Vou preparar o protocolo da semana ${p.week + 1} com foco em <b>proteína e hidratação</b>.`} />
      </Card>
    </Screen>
  );
}
