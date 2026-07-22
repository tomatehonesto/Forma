import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import { MO, MO_LONG, addDays, startOfDay, diffDays, now } from '../logic/time';
import { doseCycle, lastInjection } from '../logic/derive';
import { Screen, Txt, Card, Pill, IconBadge, Row, Chevron, CircleBtn } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { Ring } from '../ui/charts';
import { useTheme } from '../ui/useTheme';
import { space, radius } from '../theme';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const WDL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const PREP = [
  { ic: 'leaf', color: 'accent', title: 'Priorize proteína', body: 'Ajuda a manter a saciedade nos próximos dias.' },
  { ic: 'water', color: 'water', title: 'Hidrate-se', body: 'Beba água ao longo do dia para reduzir desejos.' },
  { ic: 'moon', color: 'purple', title: 'Durma bem', body: 'Sono de qualidade melhora sua resposta à medicação.' },
];

export default function ProximaAplicacao() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();

  const cyc = doseCycle(S);
  const nd = cyc.nextDose;
  const ndDays = Math.max(0, diffDays(nd, now()));
  const dateStr = `${WDL[nd.getDay()]}, ${nd.getDate()} de ${cap(MO_LONG[nd.getMonth()])}`;
  const li = lastInjection(S);
  const injD = li ? startOfDay(new Date(li.t)) : startOfDay(now());
  const phaseDate = (offset: number) => { const d = addDays(injD, offset); return `${d.getDate()} ${cap(MO[d.getMonth()])}`; };
  const offsets = [0, 1, 3, 5, 6];

  const colorOf = (k: string) => (c as any)[k] as string;

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', marginTop: 4 }}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <CircleBtn name="info" />
      </Row>

      {/* hero countdown */}
      <Card style={{ marginTop: 14, overflow: 'hidden' }}>
        <LinearGradient colors={['rgba(15,185,129,0.10)', 'rgba(46,134,199,0.05)', 'rgba(255,255,255,0)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
        <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Txt v="bodyMed" c={c.tx3}>Faltam</Txt>
            <Txt v="display" style={{ fontSize: 40, lineHeight: 44, marginTop: 2 }}>{ndDays <= 0 ? 'Hoje' : `${ndDays} ${ndDays === 1 ? 'dia' : 'dias'}`}</Txt>
            <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 2 }}>para sua próxima aplicação</Txt>
            <View style={{ marginTop: 12 }}><Pill label={dateStr} icon="cal" /></View>
          </View>
          <Ring size={104} stroke={11} pct={(cyc.dayIn / cyc.total) * 100} id="pa">
            <Icon name="syringe" size={26} color={c.accent} sw={1.7} />
          </Ring>
        </Row>
      </Card>

      {/* insight */}
      <Card tint={c.accentWeak} onPress={() => router.push('/ciclo')} style={{ marginTop: 14 }}>
        <Row>
          <IconBadge name="spark" size={40} bg={c.bg1} />
          <Txt v="bodyMed" c={c.tx2} style={{ flex: 1, marginLeft: 12 }}>
            Seu corpo tende a sentir mais fome entre o dia 5 e 6 após a aplicação. Prepare-se com escolhas que funcionam bem para você.
          </Txt>
          <Chevron />
        </Row>
      </Card>

      {/* ciclo da dose stepper */}
      <Card style={{ marginTop: 14 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt v="h2">Seu ciclo da dose</Txt>
          <Txt v="label" c={c.accent} onPress={() => router.push('/ciclo')}>Ver ciclo</Txt>
        </Row>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16, marginHorizontal: -space.lg }} contentContainerStyle={{ paddingHorizontal: space.lg }}>
          {cyc.phases.map((p, i) => {
            const done = i < cyc.idx, active = i === cyc.idx;
            const fg = active ? c.accentInk : done ? c.accent : c.tx4;
            const bg = active ? c.accent : done ? c.accentWeak : c.bg2;
            return (
              <View key={p.key} style={{ width: 96, alignItems: 'center' }}>
                <Row style={{ width: '100%', justifyContent: 'center' }}>
                  {i > 0 && <View style={{ position: 'absolute', left: 0, right: '50%', top: 18, height: 2, backgroundColor: i <= cyc.idx ? c.accent : c.line2 }} />}
                  {i < cyc.phases.length - 1 && <View style={{ position: 'absolute', left: '50%', right: 0, top: 18, height: 2, backgroundColor: i < cyc.idx ? c.accent : c.line2 }} />}
                  <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', borderWidth: done || active ? 0 : 1.4, borderColor: c.line2 }}>
                    <Icon name={done ? 'check' : p.ic} size={18} color={fg} sw={1.9} />
                  </View>
                </Row>
                <Txt v="caption" c={active ? c.tx : c.tx3} style={{ marginTop: 8, textAlign: 'center' }} numberOfLines={2}>{p.label}</Txt>
                <Txt v="micro" c={c.tx4} style={{ marginTop: 3 }}>{p.range}</Txt>
                <Txt v="micro" c={c.tx4} style={{ marginTop: 1 }}>{phaseDate(offsets[i])}</Txt>
              </View>
            );
          })}
        </ScrollView>
      </Card>

      {/* preparar agora */}
      <View style={{ marginTop: 22 }}>
        <Txt v="h2">Preparar agora pode te ajudar</Txt>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14, marginHorizontal: -space.lg }} contentContainerStyle={{ paddingHorizontal: space.lg, gap: 10 }}>
          {PREP.map((p) => (
            <View key={p.title} style={{ width: 190, backgroundColor: c.bg1, borderRadius: radius.lg, borderWidth: 1, borderColor: c.line, padding: 16 }}>
              <IconBadge name={p.ic} size={40} color={colorOf(p.color)} bg={colorOf(p.color) + '18'} />
              <Row style={{ justifyContent: 'space-between', marginTop: 12 }}>
                <Txt v="title" style={{ flex: 1 }}>{p.title}</Txt>
                <Chevron size={16} />
              </Row>
              <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 4 }}>{p.body}</Txt>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* privacidade */}
      <Card tint={c.accentWeak} style={{ marginTop: 18 }}>
        <Row>
          <IconBadge name="lock" size={44} bg={c.bg1} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Txt v="title">Privacidade é nossa prioridade.</Txt>
            <Txt v="bodyMed" c={c.tx2} style={{ marginTop: 2 }}>Seus dados são seus. Sempre.</Txt>
          </View>
        </Row>
      </Card>
    </Screen>
  );
}
