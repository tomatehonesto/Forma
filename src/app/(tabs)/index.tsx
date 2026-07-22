import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../logic/store';
import { now, MO, MO_LONG, diffDays, relDay } from '../../logic/time';
import { nextInjectionDate, checkinToday, todayBrief, todayTasks, recentAchievement, hasClinic, streak, siteLabel, nextSite } from '../../logic/derive';
import { Screen, Txt, Card, IconBadge, Row, Chevron, Divider, Pill } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { AskCompanion } from '../../ui/Ask';
import { useTheme } from '../../ui/useTheme';
import { radius } from '../../theme';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const WDL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const WDL_LOW = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

/* superfície calma — agrupa listas (inset grouped, iOS). Sem sombra: o card
   com sombra fica reservado pra ação principal. */
function Surface({ children, style }: { children: React.ReactNode; style?: any }) {
  const { c } = useTheme();
  return (
    <View style={[{ backgroundColor: c.bg1, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: c.line2, paddingHorizontal: 14 }, style]}>
      {children}
    </View>
  );
}

/* indicador discreto do ciclo — 7 pontos, sem gráfico */
function CycleDots({ dayIn, total }: { dayIn: number; total: number }) {
  const { c } = useTheme();
  return (
    <Row gap={5}>
      {Array.from({ length: total }, (_, i) => {
        const cur = i === dayIn - 1;
        return <View key={i} style={{ width: cur ? 18 : 6, height: 6, borderRadius: 3, backgroundColor: i < dayIn ? (cur ? c.accent : c.accentLine) : c.track }} />;
      })}
    </Row>
  );
}

/* linha de lista — ícone plano, vive dentro de uma Surface */
function ListRow({ ic, color, title, sub, meta, onPress, warn }: {
  ic: string; color?: string; title: string; sub?: string; meta?: string; onPress?: () => void; warn?: boolean;
}) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed && onPress ? 0.55 : 1 }]}>
      <Row style={{ paddingVertical: 13 }}>
        <View style={{ width: 32 }}>
          <Icon name={ic} size={20} color={warn ? c.cta : color ?? c.accent} sw={1.8} />
        </View>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Txt v="title">{title}</Txt>
          {!!sub && <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{sub}</Txt>}
        </View>
        {meta ? <Txt v="micro" c={c.tx4}>{meta}</Txt> : onPress ? <Chevron size={16} /> : null}
      </Row>
    </Pressable>
  );
}

function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <Row style={{ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
      <Txt v="h2">{children}</Txt>
      {right}
    </Row>
  );
}

export default function Home() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const go = (p: string) => () => router.push(p as any);

  const d = now();
  const greet = d.getHours() < 12 ? 'Bom dia' : d.getHours() < 18 ? 'Boa tarde' : 'Boa noite';
  const first = S.profile.name.split(' ')[0];
  const dateStr = `${WDL[d.getDay()]}, ${d.getDate()} de ${cap(MO_LONG[d.getMonth()])}`;

  const brief = todayBrief(S);
  const tasks = todayTasks(S);
  const ci = checkinToday(S);
  const linked = hasClinic(S);
  const ach = recentAchievement(S);
  const stk = streak(S);

  const nd = nextInjectionDate(S);
  const ndDays = diffDays(nd, now());
  const ndWhen = ndDays <= 0 ? 'hoje' : ndDays === 1 ? 'amanhã' : `${WDL_LOW[nd.getDay()]}, ${nd.getDate()} ${MO[nd.getMonth()]}`;
  const lastDocMsg = [...S.messages].reverse().find((m: any) => m.from === 'doc');
  const examTask = S.protocol.tasks.find((t: any) => !t.done && /exame/i.test(t.t));
  const protoDone = S.protocol.tasks.filter((t: any) => t.done).length;
  const protoPending = S.protocol.tasks.filter((t: any) => !t.done).slice(0, 2);

  return (
    <Screen>
      {/* header: saudação no lugar do logo */}
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 6 }}>
        <View style={{ flex: 1 }}>
          <Txt v="h1">{greet}, {first}</Txt>
          <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 2 }}>{dateStr}</Txt>
        </View>
        <Row gap={14} style={{ marginTop: 4 }}>
          <Pressable hitSlop={10} onPress={go('/notificacoes')}>
            <Icon name="bell" size={23} color={c.tx2} sw={1.8} />
            {S.unread > 0 && <View style={{ position: 'absolute', top: -1, right: -1, width: 9, height: 9, borderRadius: 5, backgroundColor: c.accent, borderWidth: 1.6, borderColor: c.bg }} />}
          </Pressable>
          <Pressable hitSlop={6} onPress={go('/perfil')} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
            <LinearGradient colors={[c.gradFrom, c.gradTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
              <Txt v="title" c="#fff">{first[0]}</Txt>
            </LinearGradient>
          </Pressable>
        </Row>
      </Row>

      {/* hoje seu corpo — contextualização do dia, sem caixa e compacta */}
      <View style={{ marginTop: 24 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Row gap={6}>
            <Icon name="spark" size={13} color={c.accent} sw={2.1} />
            <Txt v="micro" c={c.accent} style={{ letterSpacing: 1.1 }}>HOJE SEU CORPO</Txt>
          </Row>
          <Pressable onPress={go('/ciclo')} hitSlop={8}>
            <Row gap={8}>
              <Txt v="micro" c={c.tx3}>Dia {brief.cyc.dayIn} de {brief.cyc.total}</Txt>
              <CycleDots dayIn={brief.cyc.dayIn} total={brief.cyc.total} />
            </Row>
          </Pressable>
        </Row>
        <Txt v="title" style={{ marginTop: 8, fontSize: 17.5, lineHeight: 23 }}>{brief.head}</Txt>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 3, lineHeight: 18 }}>
          {brief.body}  <Txt v="caption" c={c.accent} onPress={() => router.push(`/companion?q=${encodeURIComponent(brief.q)}` as any)}>Entender melhor</Txt>
        </Txt>
      </View>

      {/* check-in — a ação do dia; rostinhos abrem o bottom sheet */}
      {!ci ? (
        <Card style={{ marginTop: 18 }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Txt v="h2">Como você está agora?</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 3 }}>Toque pra registrar — leva menos de 20 segundos.</Txt>
            </View>
            {stk > 0 && <Pill icon="flame" label={`${stk} dias`} color={c.amber} bg={c.amberBg} />}
          </Row>
          <Row gap={10} style={{ marginTop: 14 }}>
            {(['mood', 'meh', 'frown'] as const).map((f) => (
              <Pressable key={f} onPress={go('/checkin')} style={({ pressed }) => [{ flex: 1, transform: [{ scale: pressed ? 0.94 : 1 }] }]}>
                <View style={{ height: 54, borderRadius: radius.md, backgroundColor: c.bg2, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={f} size={26} color={f === 'mood' ? c.accent : f === 'meh' ? c.amber : c.cta} sw={1.7} />
                </View>
              </Pressable>
            ))}
          </Row>
        </Card>
      ) : (
        <Surface style={{ marginTop: 14 }}>
          <Row style={{ paddingVertical: 13 }}>
            <View style={{ width: 32 }}><Icon name="check" size={20} color={c.accent} sw={2.2} /></View>
            <View style={{ flex: 1 }}>
              <Txt v="title">Check-in de hoje feito</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>Energia {ci.energia} · Fome {ci.fome} · Enjoo {ci.nausea}</Txt>
            </View>
            <AskCompanion q="Quando tenho mais energia?" label="O que isso significa?" />
          </Row>
        </Surface>
      )}

      {/* hoje — inbox do tratamento */}
      {tasks.length > 0 && (
        <View style={{ marginTop: 26 }}>
          <SectionTitle>Hoje</SectionTitle>
          <View>
            {tasks.map((t, i) => (
              <View key={t.text}>
                {i > 0 && <Divider style={{ marginLeft: 32 }} />}
                <ListRow ic={t.ic} title={t.text} sub={t.sub} onPress={go(t.to)} warn={t.warn}
                  color={t.ic === 'water' ? c.water : t.ic === 'pill' ? c.amber : t.ic === 'doc' ? c.accent2 : undefined} />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* seu acompanhamento — feed contextual, clínica ou Companion */}
      <View style={{ marginTop: 26 }}>
        <SectionTitle right={
          <Row gap={5}>
            <Icon name={linked ? 'steth' : 'aura'} size={13} color={c.tx3} sw={1.9} />
            <Txt v="micro" c={c.tx3}>{linked ? S.profile.clinic : 'Companion'}</Txt>
          </Row>
        }>Seu acompanhamento</SectionTitle>

        <Surface>
          {linked ? (
            <>
              {lastDocMsg && (
                <>
                  <ListRow ic="steth" color={c.purple} title={`${S.profile.doctor.split(' ').slice(0, 2).join(' ')} respondeu sua última mensagem.`} sub={lastDocMsg.text} meta={relDay(new Date(lastDocMsg.t))} onPress={go('/medico')} />
                  <Divider style={{ marginLeft: 32 }} />
                </>
              )}
              <ListRow ic="cal" title={`Consulta ${relDay(new Date(S.consult.t))}.`} sub={`${S.consult.type} · ${S.consult.doctor}`} onPress={go('/consultas')} />
              <Divider style={{ marginLeft: 32 }} />
              <ListRow ic="doc" color={c.accent2} title="Seu resumo para a consulta está pronto." sub="Peso, adesão, sintomas e perguntas sugeridas" onPress={go('/resumo-medico')} />
              {examTask && (
                <>
                  <Divider style={{ marginLeft: 32 }} />
                  <ListRow ic="drop2" color={c.amber} title="Exame solicitado para esta semana." sub={examTask.t} onPress={go('/protocolos')} />
                </>
              )}
            </>
          ) : (
            <>
              <Row style={{ paddingVertical: 13, alignItems: 'flex-start' }}>
                <View style={{ width: 32, paddingTop: 1 }}><Icon name="aura" size={20} color={c.accent} sw={1.8} /></View>
                <Txt v="bodyMed" style={{ flex: 1, lineHeight: 21 }}>{brief.head} {brief.body}</Txt>
              </Row>
              <Divider style={{ marginLeft: 32 }} />
              <View style={{ paddingVertical: 13, paddingLeft: 32 }}>
                <Txt v="micro" c={c.tx3} style={{ letterSpacing: 0.8 }}>PERGUNTAS SUGERIDAS</Txt>
                <View style={{ marginTop: 10, gap: 8, alignItems: 'flex-start' }}>
                  <AskCompanion q="Por que minha fome voltou?" label="Por que minha fome voltou?" tone="line" />
                  <AskCompanion q="Como diminuir o enjoo?" label="Como diminuir o enjoo?" tone="line" />
                  <AskCompanion q="Posso trocar o local da aplicação?" label="Posso trocar o local da aplicação?" tone="line" />
                </View>
              </View>
              <Divider style={{ marginLeft: 32 }} />
              <ListRow ic="companion" color={c.tx3} title="Última conversa" sub="Continue de onde parou" onPress={go('/companion')} />
            </>
          )}
        </Surface>
      </View>

      {/* tratamento — evento futuro, uma linha */}
      <View style={{ marginTop: 26 }}>
        <SectionTitle>Tratamento</SectionTitle>
        <ListRow ic="syringe" title={`Próxima aplicação ${ndWhen}.`} sub={`${siteLabel(nextSite(S))} sugerido · preparo em 3 passos`} onPress={go('/proxima-aplicacao')} />
      </View>

      {/* protocolo da semana — objetivos */}
      <View style={{ marginTop: 26 }}>
        <SectionTitle right={<Txt v="label" c={c.tx3}>{protoDone} de {S.protocol.tasks.length}</Txt>}>Protocolo da semana</SectionTitle>
        <View>
          {protoPending.map((t: any, i: number) => (
            <View key={t.t}>
              {i > 0 && <Divider style={{ marginLeft: 32 }} />}
              <Pressable onPress={go('/protocolos')} style={({ pressed }) => [{ opacity: pressed ? 0.55 : 1 }]}>
                <Row style={{ paddingVertical: 13 }}>
                  <View style={{ width: 32 }}>
                    <View style={{ width: 20, height: 20, borderRadius: 7, borderWidth: 1.6, borderColor: c.line2 }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Txt v="title">{t.t}</Txt>
                    {!!t.note && <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{t.note}</Txt>}
                  </View>
                </Row>
              </Pressable>
            </View>
          ))}
          <Row style={{ justifyContent: 'space-between', marginTop: 6, paddingLeft: 32 }}>
            <Pressable onPress={go('/protocolos')} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Row gap={4}><Txt v="label" c={c.accent}>Ver a semana inteira</Txt><Chevron size={15} color={c.accent} /></Row>
            </Pressable>
            <AskCompanion q="Como o protocolo ajuda meu tratamento?" label="Como isso ajuda?" tone="line" />
          </Row>
        </View>
      </View>

      {/* contextual — só quando há o que celebrar */}
      {ach && (
        <Surface style={{ marginTop: 26, backgroundColor: c.accentWeak, borderColor: c.accentLine }}>
          <Pressable onPress={go('/conquistas')} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <Row style={{ paddingVertical: 13 }}>
              <View style={{ width: 32 }}><Icon name={ach.ic} size={20} color={c.accent} sw={1.9} /></View>
              <View style={{ flex: 1 }}>
                <Txt v="title" c={c.accent}>{ach.title}</Txt>
                <Txt v="caption" c={c.tx2} style={{ marginTop: 1 }}>{ach.desc} · {relDay(new Date(ach.t))}</Txt>
              </View>
              <Chevron />
            </Row>
          </Pressable>
        </Surface>
      )}
    </Screen>
  );
}
