import React from 'react';
import { View, Pressable, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import type { State } from '../logic/seed';
import { M, curWeight, lostKg, lostPct, adesao, journeyDay, examLast } from '../logic/derive';
import { now, fmtDate, diffDays, nf, kg } from '../logic/time';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

function resumoText(S: State) {
  const p = S.profile, cur = curWeight(S), med = M(S);
  const recent = S.checkins.slice(-7);
  const avg = (k: string) => (recent.length ? recent.reduce((s: number, c: any) => s + (c[k] || 0), 0) / recent.length : 0);
  const exLines = S.exams.slice(0, 6).map((e: any) => `- ${e.marker}: ${nf(examLast(e).v, examLast(e).v % 1 ? 1 : 0)} ${e.unit} (ref ${e.ref})`).join('\n');
  return [
    `RESUMO DE TRATAMENTO — ${p.name}`,
    `${fmtDate(now())} · para ${p.doctor} (${p.clinic})`, '',
    'MEDICAÇÃO',
    `${med.label} (${med.mol}) ${nf(p.dose, p.dose % 1 ? 1 : 0)} ${med.unit} · ${med.cad === 'weekly' ? '1x/semana' : 'diária'}`,
    `Dia ${journeyDay(S)} de tratamento · adesão às aplicações ${adesao(S)}%`, '',
    'PESO',
    `Início ${kg(p.startWeight)} kg -> atual ${kg(cur)} kg (${nf(lostPct(S), 1)}% em ${diffDays(now(), new Date(p.startT))} dias)`,
    `Referência combinada: ${kg(p.goalWeight)} kg`, '',
    `SINTOMAS (média dos últimos ${recent.length} check-ins, 0-10)`,
    `Náusea ${nf(avg('nausea'), 1)} · Fome ${nf(avg('fome'), 1)} · Energia ${nf(avg('energia'), 1)} · Sono ${nf(avg('sono'), 1)} h`, '',
    'EXAMES (mais recentes)', exLines, '',
    'ANOTAÇÕES PARA A CONSULTA',
    (S.consultNotes || '').trim() || '(sem anotações)',
  ].join('\n');
}

export default function ResumoMedico() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const p = S.profile, cur = curWeight(S), med = M(S);
  const recent = S.checkins.slice(-7);
  const avg = (k: string) => (recent.length ? recent.reduce((s: number, x: any) => s + (x[k] || 0), 0) / recent.length : 0);

  const share = () => { Share.share({ message: resumoText(S) }).catch(() => {}); };

  const Sec = ({ t }: { t: string }) => <Txt v="micro" c={c.accent} style={{ letterSpacing: 1, marginTop: 18, marginBottom: 4 }}>{t.toUpperCase()}</Txt>;
  const Line = ({ k, v }: { k: string; v: string }) => (
    <View>
      <Divider />
      <Row style={{ justifyContent: 'space-between', paddingVertical: 9 }}>
        <Txt v="caption" c={c.tx3}>{k}</Txt>
        <Txt v="label" style={{ maxWidth: '58%', textAlign: 'right' }}>{v}</Txt>
      </Row>
    </View>
  );

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Resumo para o médico</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Um retrato do tratamento, pronto pra compartilhar</Txt>
        </View>
      </Row>

      <Card style={{ marginTop: 16 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <View>
            <Txt v="h2">{p.name}</Txt>
            <Txt v="micro" c={c.tx3} style={{ marginTop: 2 }}>{fmtDate(now())} · {p.doctor}</Txt>
          </View>
          <IconBadge name="doc" size={40} />
        </Row>

        <Sec t="Medicação" />
        <Line k="Medicamento" v={`${med.label} ${nf(p.dose, p.dose % 1 ? 1 : 0)} ${med.unit}`} />
        <Line k="Cadência" v={med.cad === 'weekly' ? '1× por semana' : 'diária'} />
        <Line k="Tempo de tratamento" v={`${journeyDay(S)} dias`} />
        <Line k="Adesão às aplicações" v={`${adesao(S)}%`} />

        <Sec t="Peso" />
        <Line k="Início → atual" v={`${kg(p.startWeight)} → ${kg(cur)} kg`} />
        <Line k="Variação" v={`−${kg(lostKg(S))} kg (${nf(lostPct(S), 1)}%)`} />
        <Line k="Referência combinada" v={`${kg(p.goalWeight)} kg`} />

        <Sec t={`Sintomas · média de ${recent.length} check-ins`} />
        <Line k="Náusea / Fome" v={`${nf(avg('nausea'), 1)} / ${nf(avg('fome'), 1)} (0–10)`} />
        <Line k="Energia / Sono" v={`${nf(avg('energia'), 1)} / ${nf(avg('sono'), 1)} h`} />

        <Sec t="Exames recentes" />
        {S.exams.slice(0, 5).map((e: any) => (
          <Line key={e.marker} k={e.marker} v={`${nf(examLast(e).v, examLast(e).v % 1 ? 1 : 0)} ${e.unit}`} />
        ))}

        <Sec t="Anotações para a consulta" />
        <Txt v="bodyMed" c={(S.consultNotes || '').trim() ? c.tx2 : c.tx4} style={{ marginTop: 4, lineHeight: 20 }}>
          {(S.consultNotes || '').trim() || 'Sem anotações — adicione em Consultas.'}
        </Txt>
      </Card>

      <Row gap={10} style={{ marginTop: 14 }}>
        <Pressable style={{ flex: 1 }} onPress={share}>
          <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 13, flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
            <Icon name="doc" size={15} color="#fff" sw={2} /><Txt v="label" c="#fff">Compartilhar resumo</Txt>
          </View>
        </Pressable>
        <Pressable style={{ flex: 1 }} onPress={share}>
          <View style={{ backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line2, borderRadius: radius.pill, paddingVertical: 13, flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
            <Icon name="steth" size={15} color={c.tx2} sw={2} /><Txt v="label" c={c.tx2}>Enviar à {p.doctor.split(' ').slice(0, 2).join(' ')}</Txt>
          </View>
        </Pressable>
      </Row>
      <Txt v="micro" c={c.tx4} style={{ textAlign: 'center', marginTop: 14 }}>Você decide o que compartilhar. Nada sai sem o seu toque.</Txt>
    </Screen>
  );
}
