import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Pill, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { notasAbertas, temConsulta, clinicaConectada } from '../logic/derive';
import { fmtWD, fmtDate, relDay, diffDays, now } from '../logic/time';
import { radius } from '../theme';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const PRE = ['Pesar-se na véspera', 'Anotar dúvidas para a médica', 'Ter os exames recentes à mão', 'Revisar o resumo automático'];

export default function Consultas() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const [pre, setPre] = useState<boolean[]>([false, false, false, false]);
  const update = useStore((st) => st.update);
  const pauta = notasAbertas(S);

  const marcada = temConsulta(S);
  const conectada = clinicaConectada(S);
  const nd = new Date(S.consult.t);
  /* Negativo quer dizer que a data já passou. A consulta anotada não sai
     sozinha de lá: ninguém avisou o app de que ela aconteceu, e apagar
     por conta própria uma coisa que a pessoa escreveu é o tipo de zelo
     que vira perda de dado. */
  const faltam = marcada ? diffDays(nd, now()) : 0;
  const passou = marcada && faltam < 0;

  /* Ela vira linha do histórico, e não desaparece. O texto fica vazio
     porque o app não estava lá: quem quiser contar o que foi decidido
     tem as anotações, que são de quem viveu a consulta. */
  const realizada = () => {
    update((st: any) => {
      (st.consultsHistory ?? (st.consultsHistory = [])).unshift({
        t: st.consult.t, type: st.consult.type || 'Consulta', note: '',
      });
      st.consult = { t: 0, type: '', doctor: '' };
    });
  };

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Consultas</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Agenda, preparação e histórico</Txt>
        </View>
      </Row>

      {/* ---- a próxima ----

          ⚠️ ESTE CARD NÃO PERGUNTAVA SE HAVIA CONSULTA. Sem data, o
          estado guarda zero, e zero formatado é 1º de janeiro de 1970:
          a tela abria dizendo "há vinte mil dias", com o tipo em branco e
          o nome do médico vazio. Enquanto a data só vinha da semente
          ninguém via; a partir da porta de anotar, qualquer pessoa vê. */}
      {marcada ? (
        <Card tint={c.accentWeak} style={{ marginTop: 18 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Row gap={6}>
              <Icon name="cal" size={14} color={c.accent} sw={2} />
              <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>{passou ? 'JÁ PASSOU' : 'PRÓXIMA'}</Txt>
            </Row>
            {S.consult.type ? <Pill label={S.consult.type} /> : null}
          </Row>
          <Txt v="h1" style={{ fontSize: 26, marginTop: 8 }}>{cap(relDay(nd))}</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>
            {fmtWD(nd)}, {fmtDate(nd)}{S.consult.doctor ? ` · ${S.consult.doctor}` : ''}
          </Txt>

          {/* ⚠️ "VIDEOCONSULTA" ERA UM BOTÃO CHEIO SEM onPress — o mais
              destacado da tela, e não fazia nada. Chamada de vídeo é coisa
              da plataforma, e nem com ela existe ainda; um botão cheio
              prometendo entrar numa sala é a promessa mais cara que esta
              tela podia fazer. Fica a preparação, que funciona. */}
          {passou ? (
            <Pressable onPress={realizada} style={({ pressed }) => [{ marginTop: 14, opacity: pressed ? 0.8 : 1 }]}>
              <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
                <Icon name="check" size={15} color={c.accentInk} sw={2} />
                <Txt v="label" c={c.accentInk}>Já aconteceu</Txt>
              </View>
            </Pressable>
          ) : (
            <Pressable onPress={() => router.push('/resumo-medico' as any)} style={({ pressed }) => [{ marginTop: 14, opacity: pressed ? 0.8 : 1 }]}>
              <View style={{ backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line2, borderRadius: radius.pill, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
                <Icon name="doc" size={15} color={c.tx2} sw={2} /><Txt v="label" c={c.tx2}>Preparação</Txt>
              </View>
            </Pressable>
          )}

          {!conectada ? (
            <Pressable onPress={() => router.push('/anotar-consulta' as any)} style={({ pressed }) => [{ marginTop: 10, alignSelf: 'center', opacity: pressed ? 0.6 : 1 }]}>
              <Txt v="label" c={c.accent2}>Mudar a data</Txt>
            </Pressable>
          ) : null}
        </Card>
      ) : (
        /* Sem consulta, a diferença é de quem marca: com plataforma, a
           agenda é da clínica e não há o que fazer aqui; sem ela, quem
           anota é a pessoa, e o botão é a porta que faltava. */
        <Card style={{ marginTop: 18 }}>
          <Row gap={6}>
            <Icon name="cal" size={14} color={c.tx3} sw={2} />
            <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>PRÓXIMA</Txt>
          </Row>
          <Txt v="bodyMed" style={{ marginTop: 8 }}>Nenhuma consulta anotada</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 3, lineHeight: 19 }}>
            {conectada
              ? 'Quando a sua equipe marcar a próxima, ela aparece aqui.'
              : 'Com a data aqui, o app avisa quando ela estiver perto e deixa o resumo pronto para levar.'}
          </Txt>
          {!conectada ? (
            <Pressable onPress={() => router.push('/anotar-consulta' as any)} style={({ pressed }) => [{ marginTop: 14, opacity: pressed ? 0.8 : 1 }]}>
              <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
                <Icon name="cal" size={15} color={c.accentInk} sw={2} />
                <Txt v="label" c={c.accentInk}>Anotar consulta</Txt>
              </View>
            </Pressable>
          ) : null}
        </Card>
      )}

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

      {/* anotações

          Aqui havia uma caixa de texto corrido, e ela era a segunda forma
          de anotar no app — a outra sendo a lista de /notas, que guarda
          data e estado por nota. Dois editores para a mesma coisa,
          gravando em campos diferentes: o que a pessoa escrevesse aqui não
          apareceria lá, e vice-versa.

          Ficou a lista. Esta tela mostra a pauta e leva para lá; escrever
          acontece em um lugar só. */}
      <Row style={{ marginTop: 24, marginBottom: 10, justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Txt v="h2" style={{ flex: 1 }}>Anotações para a próxima consulta</Txt>
        <Pressable onPress={() => router.push('/notas' as any)} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
          <Row gap={4}>
            <Txt v="label" c={c.accent2}>Ver todas</Txt>
            <Icon name="chev" size={12} color={c.accent2} sw={2.2} />
          </Row>
        </Pressable>
      </Row>
      <Card>
        {pauta.length ? (
          pauta.slice(0, 3).map((n, i) => (
            <View key={n.t}>
              {i > 0 && <Divider style={{ marginVertical: 10 }} />}
              <Pressable onPress={() => router.push(`/nota?t=${n.t}` as any)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                <Txt v="body">“{n.text}”</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{fmtDate(new Date(n.t))}</Txt>
              </Pressable>
            </View>
          ))
        ) : (
          <Txt v="bodyMed" c={c.tx4}>
            Dúvidas, sintomas que quer comentar, mudanças que notou — o que você não quer esquecer de falar com a médica.
          </Txt>
        )}
        <Pressable onPress={() => router.push('/nota' as any)}>
          <View style={{ marginTop: 12, backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line2, borderRadius: radius.pill, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
            <Icon name="pencil" size={15} color={c.tx2} sw={2} /><Txt v="label" c={c.tx2}>Nova nota</Txt>
          </View>
        </Pressable>
        <Pressable onPress={() => router.push('/resumo-medico' as any)}>
          <View style={{ marginTop: 8, backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line2, borderRadius: radius.pill, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
            <Icon name="doc" size={15} color={c.tx2} sw={2} /><Txt v="label" c={c.tx2}>Ver resumo para o médico</Txt>
          </View>
        </Pressable>
      </Card>

      {/* histórico */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Histórico</Txt>
      <Card style={{ paddingVertical: 4 }}>
        {!S.consultsHistory.length ? (
          <Txt v="bodyMed" c={c.tx4} style={{ paddingVertical: 12 }}>
            As consultas que já aconteceram ficam aqui.
          </Txt>
        ) : null}
        {S.consultsHistory.map((h: any, i: number) => (
          <View key={h.t}>
            {i > 0 && <Divider style={{ marginLeft: 52 }} />}
            <Row style={{ paddingVertical: 13, alignItems: 'flex-start' }}>
              <IconBadge name="steth" size={40} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Txt v="title">{h.type} · {fmtDate(new Date(h.t))}</Txt>
                {h.note ? (
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 2, lineHeight: 18 }}>{h.note}</Txt>
                ) : null}
              </View>
            </Row>
          </View>
        ))}
      </Card>
    </Screen>
  );
}
