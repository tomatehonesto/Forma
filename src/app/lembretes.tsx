import React from 'react';
import { View, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { doseReminderDate, pesoReminderDate, dailyReminderDate, reminderWhen } from '../logic/derive';
import { DOW_SHORT, hm } from '../logic/time';
import { Screen, Txt, Card, Row, CircleBtn, Divider } from '../ui/kit';
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

  /* RÓTULO E FILEIRA, com a quebra alinhada.

     As pastilhas viviam no mesmo Row do rótulo, com wrap: ao passar da
     largura, a segunda fileira voltava para a margem esquerda e ficava
     embaixo da palavra "Horário", em vez de embaixo da primeira
     pastilha. A correção é a fileira ter caixa própria — o rótulo ocupa
     a coluna dele, e a quebra acontece dentro do que sobra. */
  const Campo = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <Row style={{ marginTop: 10, alignItems: 'flex-start' }} gap={6}>
      <Txt v="caption" c={c.tx3} style={{ width: 62, paddingTop: 6 }}>{label}</Txt>
      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{children}</View>
    </Row>
  );

  const HourRow = ({ k }: { k: string }) => (
    <Campo label="Horário">
      {HOURS.map((h) => <Chip key={h} on={R[k].hour === h} label={hm(h, 0)} onPress={() => set(k, 'hour', h)} />)}
    </Campo>
  );

  const RemCard = ({ k, ic, title, desc, children, preview }: { k: string; ic: string; title: string; desc: string; children?: React.ReactNode; preview: string | null }) => {
    const on = R[k].on;
    return (
      <Card style={{ paddingVertical: 15 }}>
        <Row style={{ alignItems: 'flex-start' }} gap={12}>
          {/* O ÍCONE SOLTO, pela mesma regra do resto do app: a pastilha
              de cor repetida numa coluna vira fileira de botões que não
              são botões. A largura fixa fica, porque é ela que alinha os
              títulos entre si — e a cor continua dizendo se o lembrete
              está ligado, que é informação e não decoração. */}
          <View style={{ width: 32, alignItems: 'center', paddingTop: 2 }}>
            <Icon name={ic} size={21} color={on ? c.accent : c.tx4} sw={1.8} />
          </View>
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
        <Txt v="h1" style={{ flex: 1 }}>Lembretes</Txt>
      </Row>
      {/* O SUBTÍTULO EM LINHA PRÓPRIA. Ao lado do botão de voltar ele
          dividia a largura com o título e com o círculo, e terminava
          cortado no meio da palavra. */}
      <Txt v="caption" c={c.tx3} style={{ marginTop: 12 }}>
        No seu ritmo — você escolhe o quê e quando.
      </Txt>

      <View style={{ marginTop: 18, gap: 12 }}>
        <RemCard k="dose" ic="syringe" title="Aplicação da caneta" desc="Um aviso antes da próxima dose, para manter o tratamento em dia." preview={reminderWhen(doseReminderDate(S))}>
          <Campo label="Avisar">
            {[0, 1, 2].map((n) => <Chip key={n} on={R.dose.lead === n} label={n === 0 ? 'no dia' : `${n} dia${n > 1 ? 's' : ''} antes`} onPress={() => set('dose', 'lead', n)} />)}
          </Campo>
          <HourRow k="dose" />
        </RemCard>

        <RemCard k="peso" ic="scale" title="Pesagem" desc="No seu ritmo, sem obrigação. Pese quando fizer sentido para você." preview={reminderWhen(pesoReminderDate(S))}>
          <Campo label="Frequência">
            <Chip on={R.peso.freq === 'semanal'} label="semanal" onPress={() => set('peso', 'freq', 'semanal')} />
            <Chip on={R.peso.freq === 'diaria'} label="diária" onPress={() => set('peso', 'freq', 'diaria')} />
          </Campo>
          {R.peso.freq === 'semanal' && (
            <Campo label="Dia">
              {[1, 2, 3, 4, 5, 6, 0].map((n) => <Chip key={n} on={R.peso.dow === n} label={DOW_SHORT[n]} onPress={() => set('peso', 'dow', n)} />)}
            </Campo>
          )}
          <HourRow k="peso" />
        </RemCard>

        <RemCard k="agua" ic="water" title="Hidratação" desc="Um empurrãozinho para beber água — ajuda com saciedade e enjoo." preview={reminderWhen(dailyReminderDate(R.agua))}>
          <HourRow k="agua" />
        </RemCard>

        <RemCard k="proteina" ic="flame" title="Proteína" desc="Lembrete para priorizar proteína em uma refeição do dia." preview={reminderWhen(dailyReminderDate(R.proteina))}>
          <HourRow k="proteina" />
        </RemCard>
      </View>

      <Row gap={8} style={{ marginTop: 16, paddingHorizontal: 4, alignItems: 'flex-start' }}>
        <Icon name="info" size={13} color={c.tx4} sw={1.8} />
        <Txt v="micro" c={c.tx4} style={{ flex: 1, lineHeight: 17 }}>Os lembretes acolhem, não cobram — dá para adiar, e se um dia passar, é só retomar.</Txt>
      </Row>
    </Screen>
  );
}
