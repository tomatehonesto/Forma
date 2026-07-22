import React, { useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Pill, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { fmtWD, fmtDate, relDay } from '../logic/time';
import { radius, font } from '../theme';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const PRE = ['Pesar-se na véspera', 'Anotar dúvidas para a médica', 'Ter os exames recentes à mão', 'Revisar o resumo automático'];

export default function Consultas() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const [pre, setPre] = useState<boolean[]>([false, false, false, false]);
  const [notes, setNotes] = useState(S.consultNotes || '');

  const nd = new Date(S.consult.t);
  const saveNotes = (t: string) => { setNotes(t); update((s: any) => { s.consultNotes = t; }); };

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Consultas</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Agenda, preparação e histórico</Txt>
        </View>
      </Row>

      {/* próxima */}
      <Card tint={c.accentWeak} style={{ marginTop: 18 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Row gap={6}><Icon name="cal" size={14} color={c.accent} sw={2} /><Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>PRÓXIMA</Txt></Row>
          <Pill label={S.consult.type} />
        </Row>
        <Txt v="h1" style={{ fontSize: 26, marginTop: 8 }}>{cap(relDay(nd))}</Txt>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{fmtWD(nd)}, {fmtDate(nd)} · {S.consult.doctor}</Txt>
        <Row gap={10} style={{ marginTop: 14 }}>
          <Pressable style={{ flex: 1 }}>
            <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
              <Icon name="companion" size={15} color="#fff" sw={2} /><Txt v="label" c="#fff">Videoconsulta</Txt>
            </View>
          </Pressable>
          <Pressable style={{ flex: 1 }} onPress={() => router.push('/resumo-medico' as any)}>
            <View style={{ backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line2, borderRadius: radius.pill, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
              <Icon name="doc" size={15} color={c.tx2} sw={2} /><Txt v="label" c={c.tx2}>Preparação</Txt>
            </View>
          </Pressable>
        </Row>
      </Card>

      {/* checklist */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Checklist pré-consulta</Txt>
      <View style={{ gap: 10 }}>
        {PRE.map((t, i) => (
          <Pressable key={t} onPress={() => setPre((p) => p.map((x, j) => (j === i ? !x : x)))}>
            <Card style={{ paddingVertical: 14 }}>
              <Row gap={12}>
                <View style={{ width: 24, height: 24, borderRadius: 8, borderWidth: 1.6, borderColor: pre[i] ? c.accent : c.line2, backgroundColor: pre[i] ? c.accent : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                  {pre[i] && <Icon name="check" size={14} color="#fff" sw={2.4} />}
                </View>
                <Txt v="title" c={pre[i] ? c.tx3 : c.tx} style={pre[i] ? { textDecorationLine: 'line-through' } : undefined}>{t}</Txt>
              </Row>
            </Card>
          </Pressable>
        ))}
      </View>

      {/* anotações */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Anotações para a próxima consulta</Txt>
      <Card>
        <TextInput
          value={notes} onChangeText={saveNotes} multiline
          placeholder={'Dúvidas, sintomas que quer comentar, mudanças que notou... o que você não quer esquecer de falar com a médica.'}
          placeholderTextColor={c.tx4}
          style={{ minHeight: 96, textAlignVertical: 'top', color: c.tx, fontFamily: font.body, fontSize: 14.5, lineHeight: 21 }}
        />
        <Pressable onPress={() => router.push('/resumo-medico' as any)}>
          <View style={{ marginTop: 12, backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line2, borderRadius: radius.pill, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
            <Icon name="doc" size={15} color={c.tx2} sw={2} /><Txt v="label" c={c.tx2}>Ver resumo para o médico</Txt>
          </View>
        </Pressable>
      </Card>

      {/* histórico */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Histórico</Txt>
      <Card style={{ paddingVertical: 4 }}>
        {S.consultsHistory.map((h: any, i: number) => (
          <View key={h.t}>
            {i > 0 && <Divider style={{ marginLeft: 52 }} />}
            <Row style={{ paddingVertical: 13, alignItems: 'flex-start' }}>
              <IconBadge name="steth" size={40} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Txt v="title">{h.type} · {fmtDate(new Date(h.t))}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 2, lineHeight: 18 }}>{h.note}</Txt>
              </View>
            </Row>
          </View>
        ))}
      </Card>
    </Screen>
  );
}
