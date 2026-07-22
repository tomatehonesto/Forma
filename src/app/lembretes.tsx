import React from 'react';
import { View, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { doseReminderDate, pesoReminderDate, dailyReminderDate, reminderWhen } from '../logic/derive';
import { DOW_SHORT, hm } from '../logic/time';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

const HOURS = [7, 8, 9, 12, 15, 20];

export default function Lembretes() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const R: any = S.reminders;

  const set = (key: string, field: string, val: any) => update((s: any) => { s.reminders[key][field] = val; });

  const Chip = ({ on, label, onPress }: { on: boolean; label: string; onPress: () => void }) => (
    <Pressable onPress={onPress}>
      <View style={{ paddingHorizontal: 11, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: on ? c.accentWeak : c.bg2, borderWidth: 1.1, borderColor: on ? c.accent : c.line }}>
        <Txt v="micro" c={on ? c.accent : c.tx3}>{label}</Txt>
      </View>
    </Pressable>
  );

  const HourRow = ({ k }: { k: string }) => (
    <Row style={{ marginTop: 10, flexWrap: 'wrap' }} gap={6}>
      <Txt v="caption" c={c.tx3} style={{ width: 62 }}>Horário</Txt>
      {HOURS.map((h) => <Chip key={h} on={R[k].hour === h} label={hm(h, 0)} onPress={() => set(k, 'hour', h)} />)}
    </Row>
  );

  const RemCard = ({ k, ic, title, desc, children, preview }: { k: string; ic: string; title: string; desc: string; children?: React.ReactNode; preview: string | null }) => {
    const on = R[k].on;
    return (
      <Card style={{ paddingVertical: 15 }}>
        <Row style={{ alignItems: 'flex-start' }} gap={12}>
          <IconBadge name={ic} size={40} color={on ? c.accent : c.tx4} bg={on ? c.accentWeak : c.bg2} />
          <View style={{ flex: 1 }}>
            <Txt v="title">{title}</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 2, lineHeight: 17 }}>{desc}</Txt>
          </View>
          <Switch value={on} onValueChange={(v) => set(k, 'on', v)} trackColor={{ false: c.track, true: c.accent }} thumbColor="#fff" />
        </Row>
        {on && (
          <View style={{ marginTop: 4 }}>
            {children}
            <Divider style={{ marginTop: 12 }} />
            <Row gap={6} style={{ marginTop: 10 }}>
              <Icon name="bell" size={12} color={c.accent} sw={2} />
              <Txt v="micro" c={c.tx3}>Próximo: {preview || 'quando chegar o dia'}</Txt>
            </Row>
          </View>
        )}
      </Card>
    );
  };

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Lembretes</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>No seu ritmo — você escolhe o quê e quando</Txt>
        </View>
      </Row>

      <View style={{ marginTop: 16, gap: 12 }}>
        <RemCard k="dose" ic="syringe" title="Aplicação da caneta" desc="Um aviso antes da próxima dose, pra manter o tratamento em dia." preview={reminderWhen(doseReminderDate(S))}>
          <Row style={{ marginTop: 8, flexWrap: 'wrap' }} gap={6}>
            <Txt v="caption" c={c.tx3} style={{ width: 62 }}>Avisar</Txt>
            {[0, 1, 2].map((n) => <Chip key={n} on={R.dose.lead === n} label={n === 0 ? 'no dia' : `${n} dia${n > 1 ? 's' : ''} antes`} onPress={() => set('dose', 'lead', n)} />)}
          </Row>
          <HourRow k="dose" />
        </RemCard>

        <RemCard k="peso" ic="scale" title="Pesagem" desc="No seu ritmo, sem obrigação. Pese quando fizer sentido pra você." preview={reminderWhen(pesoReminderDate(S))}>
          <Row style={{ marginTop: 8, flexWrap: 'wrap' }} gap={6}>
            <Txt v="caption" c={c.tx3} style={{ width: 62 }}>Frequência</Txt>
            <Chip on={R.peso.freq === 'semanal'} label="semanal" onPress={() => set('peso', 'freq', 'semanal')} />
            <Chip on={R.peso.freq === 'diaria'} label="diária" onPress={() => set('peso', 'freq', 'diaria')} />
          </Row>
          {R.peso.freq === 'semanal' && (
            <Row style={{ marginTop: 10, flexWrap: 'wrap' }} gap={6}>
              <Txt v="caption" c={c.tx3} style={{ width: 62 }}>Dia</Txt>
              {[1, 2, 3, 4, 5, 6, 0].map((n) => <Chip key={n} on={R.peso.dow === n} label={DOW_SHORT[n]} onPress={() => set('peso', 'dow', n)} />)}
            </Row>
          )}
          <HourRow k="peso" />
        </RemCard>

        <RemCard k="agua" ic="water" title="Hidratação" desc="Um empurrãozinho pra beber água — ajuda com saciedade e enjoo." preview={reminderWhen(dailyReminderDate(R.agua))}>
          <HourRow k="agua" />
        </RemCard>

        <RemCard k="proteina" ic="flame" title="Proteína" desc="Lembrete pra priorizar proteína em uma refeição do dia." preview={reminderWhen(dailyReminderDate(R.proteina))}>
          <HourRow k="proteina" />
        </RemCard>
      </View>

      <Row gap={8} style={{ marginTop: 16, paddingHorizontal: 4, alignItems: 'flex-start' }}>
        <Icon name="info" size={13} color={c.tx4} sw={1.8} />
        <Txt v="micro" c={c.tx4} style={{ flex: 1, lineHeight: 16 }}>São preferências suas, guardadas no aparelho. Os lembretes acolhem, não cobram — dá pra adiar, e se um dia passar, é só retomar.</Txt>
      </Row>
    </Screen>
  );
}
