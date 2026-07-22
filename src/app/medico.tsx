import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Chevron, Pill, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { now, fmtWD, fmtDate, fmtTime, relDay } from '../logic/time';
import { radius, font } from '../theme';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Medico() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const [msg, setMsg] = useState('');
  const threadRef = useRef<ScrollView>(null);

  useEffect(() => { if (S.unread) update((s: any) => { s.unread = 0; }); }, []);

  const nd = new Date(S.consult.t);
  const send = () => {
    const t = msg.trim(); if (!t) return;
    update((s: any) => { s.messages.push({ t: +now(), from: 'me', text: t }); });
    setMsg('');
    setTimeout(() => threadRef.current?.scrollToEnd({ animated: true }), 80);
  };

  const clinRows: [string, string, string, (() => void) | undefined][] = [
    ['cal', 'Consultas', 'Agenda, histórico e videoconsulta', () => router.push('/consultas' as any)],
    ['doc', 'Exames enviados', `${S.examBundles.filter((b: any) => b.shared).length} arquivos compartilhados`, () => router.push('/exames' as any)],
    ['trend', 'Compartilhar evolução', 'Peso, medidas e adesão com a equipe', undefined],
  ];

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Meu médico</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{S.profile.doctor} · acompanha sua evolução</Txt>
        </View>
      </Row>

      {/* próxima consulta */}
      <Card tint={c.accentWeak} style={{ marginTop: 18 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Row gap={6}><Icon name="cal" size={14} color={c.accent} sw={2} /><Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>PRÓXIMA CONSULTA</Txt></Row>
          <Pill label={S.consult.type} />
        </Row>
        <Txt v="h1" style={{ fontSize: 26, marginTop: 10 }}>{cap(relDay(nd))}</Txt>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{fmtWD(nd)}, {fmtDate(nd)} · {S.consult.doctor}</Txt>
        <View style={{ marginTop: 14, backgroundColor: c.bg1, borderRadius: radius.md, padding: 13 }}>
          <Row gap={6}><Icon name="aura" size={13} color={c.accent} sw={2} /><Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>PREPARAÇÃO AUTOMÁTICA</Txt></Row>
          <Txt v="bodyMed" c={c.tx2} style={{ marginTop: 6, lineHeight: 19 }}>Seu resumo para a consulta já está sendo montado: peso, adesão, sintomas e perguntas sugeridas. Fica pronto na véspera.</Txt>
          <Pressable onPress={() => router.push('/resumo-medico' as any)}>
            <View style={{ marginTop: 10, backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 11, flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
              <Icon name="doc" size={15} color="#fff" sw={2} /><Txt v="label" c="#fff">Ver preparação da consulta</Txt>
            </View>
          </Pressable>
        </View>
      </Card>

      {/* thread */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Conversa com a equipe</Txt>
      <Card style={{ padding: 14 }}>
        <ScrollView ref={threadRef} style={{ maxHeight: 250 }} showsVerticalScrollIndicator={false}>
          {S.messages.map((m: any, i: number) => (
            <View key={i} style={{
              alignSelf: m.from === 'doc' ? 'flex-start' : 'flex-end', maxWidth: '85%', marginBottom: 8,
              backgroundColor: m.from === 'doc' ? c.bg2 : c.accent, borderRadius: radius.md, padding: 11,
              borderBottomLeftRadius: m.from === 'doc' ? 4 : radius.md, borderBottomRightRadius: m.from === 'doc' ? radius.md : 4,
            }}>
              {m.from === 'doc' && <Txt v="micro" c={c.tx3} style={{ marginBottom: 2 }}>{S.profile.doctor}</Txt>}
              <Txt v="bodyMed" c={m.from === 'doc' ? c.tx : '#fff'} style={{ lineHeight: 19 }}>{m.text}</Txt>
              <Txt v="micro" c={m.from === 'doc' ? c.tx4 : 'rgba(255,255,255,0.7)'} style={{ marginTop: 4 }}>{relDay(new Date(m.t))} · {fmtTime(new Date(m.t))}</Txt>
            </View>
          ))}
        </ScrollView>
        <Divider style={{ marginTop: 6 }} />
        <Row style={{ marginTop: 10 }} gap={8}>
          <TextInput
            value={msg} onChangeText={setMsg} onSubmitEditing={send}
            placeholder="Escrever para a equipe..." placeholderTextColor={c.tx4}
            style={{ flex: 1, backgroundColor: c.bg2, borderRadius: radius.pill, paddingHorizontal: 15, paddingVertical: 11, color: c.tx, fontFamily: font.body, fontSize: 14.5 }}
          />
          <Pressable onPress={send} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="send" size={18} color="#fff" sw={2} />
            </View>
          </Pressable>
        </Row>
        <Txt v="micro" c={c.tx4} style={{ textAlign: 'center', marginTop: 8 }}>Canal organizado com a clínica — some do WhatsApp, entra no seu histórico</Txt>
      </Card>

      {/* protocolos */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Protocolos</Txt>
      <Card style={{ paddingVertical: 14 }} onPress={() => router.push('/protocolos' as any)}>
        <Row>
          <IconBadge name="target" size={40} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Txt v="title">Semana {S.protocol.week}</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{S.protocol.tasks.filter((t: any) => t.done).length} de {S.protocol.tasks.length} concluídos</Txt>
          </View>
          <Chevron />
        </Row>
      </Card>

      {/* na clínica */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Na clínica</Txt>
      <Card style={{ paddingVertical: 4 }}>
        {clinRows.map(([ic, t, sub, onPress], i) => (
          <View key={t}>
            {i > 0 && <Divider style={{ marginLeft: 52 }} />}
            <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed && onPress ? 0.6 : 1 }]}>
              <Row style={{ paddingVertical: 13 }}>
                <IconBadge name={ic} size={40} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt v="title">{t}</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{sub}</Txt>
                </View>
                <Chevron />
              </Row>
            </Pressable>
          </View>
        ))}
      </Card>

      {/* prescrições */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Prescrições</Txt>
      <Card style={{ paddingVertical: 4 }}>
        {S.prescriptions.map((p: any, i: number) => (
          <View key={p.name}>
            {i > 0 && <Divider style={{ marginLeft: 52 }} />}
            <Row style={{ paddingVertical: 13, alignItems: 'flex-start' }}>
              <IconBadge name="pill" size={40} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Txt v="title">{p.name}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{p.detail}</Txt>
                <Txt v="micro" c={c.tx4} style={{ marginTop: 3 }}>{p.by} · {fmtDate(new Date(p.t))}</Txt>
              </View>
            </Row>
          </View>
        ))}
      </Card>

      {/* documentos */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Documentos e exames</Txt>
      <Card style={{ paddingVertical: 4 }}>
        {S.documents.map((d: any, i: number) => (
          <View key={`${d.name}-${i}`}>
            {i > 0 && <Divider />}
            <Row style={{ justifyContent: 'space-between', paddingVertical: 11 }}>
              <Row gap={8} style={{ flex: 1 }}>
                <Icon name="doc" size={15} color={c.tx3} sw={1.8} />
                <View style={{ flex: 1 }}>
                  <Txt v="bodyMed">{d.name}</Txt>
                  <Txt v="micro" c={c.tx3} style={{ marginTop: 1 }}>{d.kind}</Txt>
                </View>
              </Row>
              <Txt v="caption" c={c.tx3}>{fmtDate(new Date(d.t))}</Txt>
            </Row>
          </View>
        ))}
      </Card>

      {/* equipe */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Equipe</Txt>
      <Card style={{ paddingVertical: 4 }}>
        {[[S.profile.doctor, 'Endocrinologia · responsável', 'H'], ['Renata Alves', 'Nutrição', 'R']].map(([n, s, a], i) => (
          <View key={n}>
            {i > 0 && <Divider style={{ marginLeft: 48 }} />}
            <Row style={{ paddingVertical: 12 }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
                <Txt v="title" c={c.accent}>{a}</Txt>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Txt v="title">{n}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{s}</Txt>
              </View>
            </Row>
          </View>
        ))}
      </Card>
    </Screen>
  );
}
