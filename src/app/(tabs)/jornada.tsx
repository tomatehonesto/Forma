import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../logic/store';
import { addDays, startOfDay, now, relDay, fmtDate } from '../../logic/time';
import { timelineEvents, milestones, hasClinic, achDone, doseCycle } from '../../logic/derive';
import { Screen, Txt, Card, IconBadge, Row, Chevron, CircleBtn, Pill } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { useTheme } from '../../ui/useTheme';
import { radius } from '../../theme';

const WDS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

export default function Jornada() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const today = +startOfDay(now());
  const [sel, setSel] = useState(today);

  const events = timelineEvents(S);
  const marcos = milestones(S).slice(0, 9);
  const cyc = doseCycle(S);
  const linked = hasClinic(S);
  const trails: [string, string, string, string][] = [
    ['syringe', 'Aplicações', 'Histórico e constância', '/aplicacoes'],
    ['activity', 'Ciclo da dose', `Dia ${cyc.dayIn} de ${cyc.total} · ${cyc.phase.label.toLowerCase()}`, '/ciclo'],
    ['clock', 'Próxima aplicação', 'Contagem e preparo', '/proxima-aplicacao'],
    ['target', 'Protocolos', `Semana ${S.protocol.week}`, '/protocolos'],
    ['leaf', 'Alimentação', 'Refeições e proteína', '/alimentacao'],
    ...(linked ? ([
      ['steth', 'Meu médico', 'Mensagens e equipe', '/medico'],
      ['cal', 'Consultas', 'Agenda e preparação', '/consultas'],
    ] as [string, string, string, string][]) : []),
  ];
  const days = [-3, -2, -1, 0, 1, 2, 3].map((o) => { const d = addDays(new Date(today), o); return { t: +startOfDay(d), num: d.getDate(), wd: WDS[d.getDay()] }; });
  const colorOf = (k: string) => (c as any)[k] as string;

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 8 }}>
        <View style={{ flex: 1 }}>
          <Txt v="display">Linha do tempo</Txt>
          <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 6 }}>Seu corpo, dia após dia.</Txt>
        </View>
        <CircleBtn name="filter" color={c.accent} bg={c.accentWeak} />
      </Row>

      {/* seletor de dias */}
      <Row style={{ justifyContent: 'space-between', marginTop: 18 }}>
        {days.map((d) => {
          const active = d.t === sel;
          return (
            <Pressable key={d.t} onPress={() => setSel(d.t)} style={{ alignItems: 'center', width: 44 }}>
              <View style={{ width: 42, height: 52, borderRadius: 21, backgroundColor: active ? c.accent : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                <Txt v="title" c={active ? c.accentInk : c.tx}>{d.num}</Txt>
                <Txt v="micro" c={active ? c.accentInk : c.tx4} style={{ marginTop: 1 }}>{d.wd}</Txt>
              </View>
            </Pressable>
          );
        })}
      </Row>

      <View style={{ marginTop: 18, marginBottom: 6 }}>
        <Pill label={sel === today ? 'HOJE' : relDay(new Date(sel)).toUpperCase()} />
      </View>

      {/* timeline */}
      <View style={{ marginTop: 4 }}>
        {events.map((ev, i) => {
          const color = colorOf(ev.color);
          const isToday = ev.day === today;
          const dayLabel = isToday ? '' : relDay(new Date(ev.day));
          return (
            <Row key={ev.key} style={{ alignItems: 'stretch' }}>
              <View style={{ width: 52, paddingTop: 6 }}>
                {dayLabel ? <Txt v="micro" c={c.tx4} style={{ textTransform: 'capitalize' }}>{dayLabel}</Txt> : null}
                <Txt v="caption" c={c.tx3}>{ev.time}</Txt>
              </View>
              <View style={{ width: 48, alignItems: 'center' }}>
                {i < events.length - 1 && <View style={{ position: 'absolute', top: 8, bottom: -4, width: 2, backgroundColor: c.line2 }} />}
                <View style={{ backgroundColor: c.bg, padding: 3, borderRadius: 24, marginTop: 2 }}>
                  <IconBadge name={ev.ic} size={40} color={color} bg={color + '22'} />
                </View>
              </View>
              <View style={{ flex: 1, paddingBottom: 22, marginLeft: 4, marginTop: 6 }}>
                <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Txt v="title" style={{ flex: 1, marginRight: 8 }}>{ev.title}</Txt>
                  {ev.value
                    ? <Txt v="label" c={ev.valueColor ? colorOf(ev.valueColor) : c.tx2} style={{ textAlign: 'right' }}>{ev.value}</Txt>
                    : <Chevron size={16} />}
                </Row>
                <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 1 }}>{ev.sub}</Txt>
              </View>
            </Row>
          );
        })}
      </View>

      {/* padrão do dia */}
      <Card tint={c.accentWeak} style={{ marginTop: 6 }}>
        <Row>
          <IconBadge name="spark" size={42} bg={c.bg1} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Txt v="title" c={c.accent}>Padrão do dia</Txt>
            <Txt v="bodyMed" c={c.tx2} style={{ marginTop: 2 }}>Dias com mais proteína e sono de qualidade costumam trazer menos fome no dia seguinte.</Txt>
          </View>
          <Chevron />
        </Row>
      </Card>

      {/* trilhos do tratamento */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 2 }}>Seu tratamento</Txt>
      <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {trails.map(([ic, t, sub, to]) => (
          <Pressable key={t} onPress={() => router.push(to as any)} style={({ pressed }) => [{ width: '48.5%', opacity: pressed ? 0.7 : 1 }]}>
            <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, borderWidth: 1, borderColor: c.line, padding: 14, marginTop: 10 }}>
              <IconBadge name={ic} size={36} />
              <Txt v="title" style={{ marginTop: 10 }}>{t}</Txt>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 2 }} numberOfLines={1}>{sub}</Txt>
            </View>
          </Pressable>
        ))}
      </Row>

      {/* marcos do tratamento */}
      <Row style={{ justifyContent: 'space-between', marginTop: 24, marginBottom: 10 }}>
        <Txt v="h2">Marcos da jornada</Txt>
        <Pressable onPress={() => router.push('/conquistas' as any)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
          <Row gap={4}><Txt v="label" c={c.accent}>{achDone(S).length} conquistas</Txt><Chevron size={15} color={c.accent} /></Row>
        </Pressable>
      </Row>
      <Card style={{ paddingVertical: 6 }}>
        {marcos.map((m, i) => (
          <Row key={`${m.t}-${m.title}`} style={{ alignItems: 'stretch' }}>
            <View style={{ width: 40, alignItems: 'center' }}>
              {i < marcos.length - 1 && <View style={{ position: 'absolute', top: 14, bottom: -8, width: 2, backgroundColor: c.line2 }} />}
              <View style={{ backgroundColor: c.bg1, paddingVertical: 3 }}>
                <IconBadge name={m.ic} size={32} iconSize={15} />
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: 10, paddingBottom: i < marcos.length - 1 ? 16 : 6 }}>
              <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Txt v="title" style={{ flex: 1, marginRight: 8 }}>{m.title}</Txt>
                <Txt v="micro" c={c.tx4}>{fmtDate(new Date(m.t))}</Txt>
              </Row>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }} numberOfLines={2}>{m.sub}</Txt>
            </View>
          </Row>
        ))}
      </Card>
    </Screen>
  );
}
