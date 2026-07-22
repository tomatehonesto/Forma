import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line } from 'react-native-svg';
import { useStore } from '../../logic/store';
import { now, MO, MO_LONG, diffDays, relDay, fmtTime } from '../../logic/time';
import { nextInjectionDate, checkinToday, todayBrief, todayTasks, recentAchievement, hasClinic } from '../../logic/derive';
import { Screen, Txt, Card, IconBadge, Row, Chevron, Divider, Pill } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { AskCompanion } from '../../ui/Ask';
import { useTheme } from '../../ui/useTheme';
import { BRAND, radius } from '../../theme';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const WDL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const WDS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

function BrandMark() {
  const { c } = useTheme();
  return (
    <Row gap={9}>
      <Svg width={24} height={24} viewBox="0 0 24 24">
        <Line x1={6} y1={16.5} x2={12} y2={7.5} stroke={c.accent} strokeWidth={1.9} strokeLinecap="round" />
        <Line x1={12} y1={7.5} x2={18} y2={14} stroke={c.accent2} strokeWidth={1.9} strokeLinecap="round" />
        <Circle cx={6} cy={16.5} r={2.7} fill={c.accent} />
        <Circle cx={12} cy={7.5} r={2.7} fill={c.accent} />
        <Circle cx={18} cy={14} r={2.7} fill={c.accent2} />
      </Svg>
      <Txt v="h2" style={{ letterSpacing: -0.3 }}>{BRAND}</Txt>
    </Row>
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

  const nd = nextInjectionDate(S);
  const ndDays = diffDays(nd, now());
  const ndLabel = ndDays <= 0 ? 'hoje' : ndDays === 1 ? 'amanhã' : `em ${ndDays} dias`;
  const lastDocMsg = [...S.messages].reverse().find((m: any) => m.from === 'doc');
  const consultDays = diffDays(new Date(S.consult.t), now());
  const protoDone = S.protocol.tasks.filter((t: any) => t.done).length;

  return (
    <Screen>
      {/* header */}
      <Row style={{ justifyContent: 'space-between', marginTop: 4 }}>
        <BrandMark />
        <Row gap={16}>
          <Pressable hitSlop={10} onPress={go('/notificacoes')}>
            <Icon name="bell" size={23} color={c.tx2} sw={1.8} />
            {S.unread > 0 && <View style={{ position: 'absolute', top: -1, right: -1, width: 9, height: 9, borderRadius: 5, backgroundColor: c.accent, borderWidth: 1.6, borderColor: c.bg }} />}
          </Pressable>
          <Pressable hitSlop={6} onPress={go('/perfil')} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
            <LinearGradient colors={[c.gradFrom, c.gradTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }}>
              <Txt v="title" c="#fff">{first[0]}</Txt>
            </LinearGradient>
          </Pressable>
        </Row>
      </Row>

      {/* saudação */}
      <View style={{ marginTop: 18 }}>
        <Txt v="h1">{greet}, {first}</Txt>
        <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 3 }}>{dateStr}</Txt>
      </View>

      {/* hero do dia — pequeno, específico, 3 segundos */}
      <Card tint={c.accentWeak} style={{ marginTop: 16 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Row gap={7}>
            <Icon name="spark" size={15} color={c.accent} sw={2} />
            <Txt v="micro" c={c.accent} style={{ letterSpacing: 1.1 }}>HOJE SEU CORPO</Txt>
          </Row>
          <Txt v="micro" c={c.tx3}>Dia {brief.cyc.dayIn} de {brief.cyc.total}</Txt>
        </Row>
        <Txt v="h2" style={{ marginTop: 10, lineHeight: 26 }}>{brief.head}</Txt>
        <Txt v="bodyMed" c={c.tx2} style={{ marginTop: 6, lineHeight: 20 }}>{brief.body}</Txt>
        <Row style={{ justifyContent: 'space-between', marginTop: 14 }}>
          <AskCompanion q={brief.q} label="Entender melhor" />
          <Pressable onPress={go('/ciclo')} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
            <CycleDots dayIn={brief.cyc.dayIn} total={brief.cyc.total} />
          </Pressable>
        </Row>
      </Card>

      {/* check-in — A ação principal */}
      {!ci ? (
        <Card style={{ marginTop: 14 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Txt v="h2">Como você está agora?</Txt>
              <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 3 }}>Leva menos de 20 segundos.</Txt>
            </View>
            <Row gap={4}>
              {['mood', 'frown', 'brain'].map((ic) => (
                <View key={ic} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={ic} size={17} color={c.tx3} sw={1.8} />
                </View>
              ))}
            </Row>
          </Row>
          <Pressable onPress={go('/checkin')} style={({ pressed }) => [{ marginTop: 14, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
            <LinearGradient colors={[c.gradFrom, c.gradTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: radius.pill, paddingVertical: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
              <Icon name="check" size={19} color="#fff" sw={2.4} />
              <Txt v="title" c="#fff">Registrar check-in</Txt>
            </LinearGradient>
          </Pressable>
        </Card>
      ) : (
        <Card style={{ marginTop: 14 }}>
          <Row>
            <IconBadge name="check" size={44} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt v="title">Check-in de hoje feito</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Energia {ci.energia} · Fome {ci.fome} · Enjoo {ci.nausea}</Txt>
            </View>
            <Pressable onPress={go('/jornada')} hitSlop={8}><Chevron /></Pressable>
          </Row>
          <AskCompanion q="Quando tenho mais energia?" label="O que isso significa?" style={{ marginTop: 12, marginLeft: 56 }} />
        </Card>
      )}

      {/* hoje — só o que importa agora */}
      {tasks.length > 0 && (
        <>
          <Txt v="h2" style={{ marginTop: 22, marginBottom: 10 }}>Hoje</Txt>
          <Card style={{ paddingVertical: 4 }}>
            {tasks.map((t, i) => (
              <View key={t.text}>
                {i > 0 && <Divider style={{ marginLeft: 52 }} />}
                <Pressable onPress={go(t.to)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <Row style={{ paddingVertical: 12 }}>
                    <IconBadge name={t.ic} size={40} color={t.warn ? c.cta : undefined} bg={t.warn ? c.ctaWeak : undefined} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Txt v="title">{t.text}</Txt>
                      {!!t.sub && <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{t.sub}</Txt>}
                    </View>
                    <Chevron />
                  </Row>
                </Pressable>
              </View>
            ))}
          </Card>
        </>
      )}

      {/* acompanhamento — muda com o contexto do usuário */}
      <Row style={{ justifyContent: 'space-between', marginTop: 22, marginBottom: 10 }}>
        <Txt v="h2">Acompanhamento</Txt>
        {linked && <Pill label={S.profile.clinic} icon="steth" />}
      </Row>
      <Card style={{ paddingVertical: 4 }}>
        {linked ? (
          <>
            <Pressable onPress={go('/consultas')} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Row style={{ paddingVertical: 12 }}>
                <IconBadge name="cal" size={40} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt v="title">Consulta {relDay(new Date(S.consult.t))}</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{S.consult.type} · {S.consult.doctor}</Txt>
                </View>
                <Chevron />
              </Row>
            </Pressable>
            {lastDocMsg && (
              <>
                <Divider style={{ marginLeft: 52 }} />
                <Pressable onPress={go('/medico')} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <Row style={{ paddingVertical: 12 }}>
                    <IconBadge name="steth" size={40} color={c.purple} bg={c.purpleBg} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Row gap={6}>
                        <Txt v="title">{S.profile.doctor.split(' ').slice(0, 2).join(' ')}</Txt>
                        {S.unread > 0 && <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: c.accent }} />}
                      </Row>
                      <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }} numberOfLines={1}>{lastDocMsg.text}</Txt>
                    </View>
                    <Txt v="micro" c={c.tx4}>{relDay(new Date(lastDocMsg.t))}</Txt>
                  </Row>
                </Pressable>
              </>
            )}
            <Divider style={{ marginLeft: 52 }} />
            <Pressable onPress={go('/resumo-medico')} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Row style={{ paddingVertical: 12 }}>
                <IconBadge name="doc" size={40} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt v="title">Resumo pronto pra consulta</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>Peso, adesão, sintomas e perguntas sugeridas</Txt>
                </View>
                <Chevron />
              </Row>
            </Pressable>
          </>
        ) : (
          <>
            <View style={{ paddingVertical: 12 }}>
              <Row>
                <IconBadge name="aura" size={40} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt v="title">Resumo do Companion</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>Sua evolução, contada em linguagem simples</Txt>
                </View>
              </Row>
              <AskCompanion q="Como está minha evolução?" label="Gerar meu resumo" style={{ marginTop: 10, marginLeft: 52 }} />
            </View>
            <Divider style={{ marginLeft: 52 }} />
            <Pressable onPress={go('/descobertas')} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Row style={{ paddingVertical: 12 }}>
                <IconBadge name="play" size={40} color={c.accent2} bg={c.waterBg} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt v="title">Replay da semana</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>O que mudou nos últimos 7 dias</Txt>
                </View>
                <Chevron />
              </Row>
            </Pressable>
            <Divider style={{ marginLeft: 52 }} />
            <Pressable onPress={go('/biblioteca')} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Row style={{ paddingVertical: 12 }}>
                <IconBadge name="book" size={40} color={c.amber} bg={c.amberBg} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt v="title">Recomendações</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>Conteúdo pro seu momento do tratamento</Txt>
                </View>
                <Chevron />
              </Row>
            </Pressable>
          </>
        )}
      </Card>

      {/* protocolo da semana — objetivos, abaixo das prioridades do dia */}
      <Card style={{ marginTop: 14 }} onPress={go('/protocolos')}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Row gap={6}><Icon name="target" size={14} color={c.accent} sw={2} /><Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>PROTOCOLO · SEMANA {S.protocol.week}</Txt></Row>
          <Txt v="label" c={c.tx3}>{protoDone}/{S.protocol.tasks.length}</Txt>
        </Row>
        {S.protocol.tasks.filter((t: any) => !t.done).slice(0, 2).map((t: any) => (
          <Row key={t.t} gap={10} style={{ marginTop: 12 }}>
            <View style={{ width: 22, height: 22, borderRadius: 8, borderWidth: 1.6, borderColor: c.line2 }} />
            <View style={{ flex: 1 }}>
              <Txt v="bodyMed">{t.t}</Txt>
              {!!t.note && <Txt v="micro" c={c.tx3} style={{ marginTop: 1 }}>{t.note}</Txt>}
            </View>
          </Row>
        ))}
        <AskCompanion q="Como o protocolo ajuda meu tratamento?" label="Como isso ajuda meu tratamento?" style={{ marginTop: 12 }} />
      </Card>

      {/* próxima aplicação — evento futuro, sem protagonismo */}
      <Card style={{ marginTop: 14, paddingVertical: 14 }} onPress={go('/proxima-aplicacao')}>
        <Row>
          <IconBadge name="syringe" size={40} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Txt v="title">Próxima aplicação {ndLabel}</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{WDS[nd.getDay()]}, {nd.getDate()} {cap(MO[nd.getMonth()])} · preparo e local sugerido</Txt>
          </View>
          <Chevron />
        </Row>
      </Card>

      {/* contextual — só quando há o que celebrar */}
      {ach && (
        <Card tint={c.accentWeak} style={{ marginTop: 14, paddingVertical: 14 }} onPress={go('/conquistas')}>
          <Row>
            <IconBadge name={ach.ic} size={40} bg={c.bg1} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt v="title" c={c.accent}>{ach.title}</Txt>
              <Txt v="caption" c={c.tx2} style={{ marginTop: 1 }}>{ach.desc} · {relDay(new Date(ach.t))}</Txt>
            </View>
            <Chevron />
          </Row>
        </Card>
      )}
    </Screen>
  );
}
