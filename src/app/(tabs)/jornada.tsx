import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useStore } from '../../logic/store';
import { addDays, startOfDay, now, relDay } from '../../logic/time';
import { timelineEvents } from '../../logic/derive';
import { Screen, Txt, Card, IconBadge, Row, Chevron, CircleBtn, Pill } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { useTheme } from '../../ui/useTheme';
import { space } from '../../theme';

const WDS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

export default function Jornada() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const today = +startOfDay(now());
  const [sel, setSel] = useState(today);

  const events = timelineEvents(S);
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
    </Screen>
  );
}
