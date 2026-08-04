import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, ScrollView, Animated, Easing, StyleSheet, AccessibilityInfo, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import {
  todayBrief, dailyTargets, weightCard, weightSeries, protein7d, bodyFat,
  nextInjectionDate, siteLabel, nextSite, streak, insights, hasClinic, M,
  type DailyTarget,
} from '../../logic/derive';
import { now, diffDays, nf, fmtDate, DOW_PT } from '../../logic/time';
import { Txt, Row, Card, SectionHead, ListRow, Metric } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { AreaCurve } from '../../ui/charts';
import { useTheme } from '../../ui/useTheme';
import { useLightStatusBar } from '../../ui/useLightStatusBar';
import { radius, type Palette } from '../../theme';

const AURORA = require('../../../assets/images/aurora-hero.png');
const PAD = 24;                     // margem lateral do frame
const GOAL_W = 323;                 // largura do card de meta
const GOAL_GAP = 4;
const DOT_W = 44;                   // largura do ponto ativo (= a barra de progresso)
const DOT_IDLE = 12;
const DERIVA_MS = 22000;            // ciclo do movimento lento da aurora
const SLIDE_MS = 7000;              // tempo de leitura de cada slide do hero

/* ------------------------------------------------------------------ */
/* Barra de meta — trilho, preenchimento em gradiente e marcador da
   posicao atual. As cores vem da propria meta (proteina/agua/exercicio). */
function GoalBar({ t }: { t: DailyTarget }) {
  const { c } = useTheme();
  const from = (c as any)[t.from] as string;
  const to = (c as any)[t.to] as string;
  const pct = `${Math.round(t.pct * 100)}%`;
  return (
    <View>
      <View style={{ height: 8, borderRadius: radius.pill, backgroundColor: c.bg2, overflow: 'hidden' }}>
        <LinearGradient
          colors={[from, to]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={{ width: pct as any, height: 8, borderRadius: radius.pill }}
        />
      </View>
      <Row style={{ justifyContent: 'space-between', marginTop: 5 }}>
        <Txt v="note" c={c.tx3}>0</Txt>
        <Txt v="note" c={c.tx3}>{t.maxLabel}</Txt>
      </Row>
      {/* marcador triangular na posicao atual */}
      <View style={{ position: 'absolute', top: 10, left: pct as any, marginLeft: -5 }}>
        <View style={{ width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 6, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: c.tx }} />
      </View>
    </View>
  );
}

function GoalCard({ t, onRegister }: { t: DailyTarget; onRegister: () => void }) {
  const { c } = useTheme();
  return (
    <View style={{ width: GOAL_W, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16 }}>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Txt v="title" style={{ flex: 1, marginRight: 10, marginTop: 4 }} numberOfLines={1}>{t.label}</Txt>
        {/* unidade na mesma linha do número, recuada um tom */}
        <Metric value={t.num} unit={t.unit} />
      </Row>
      <View style={{ marginTop: 12 }}><GoalBar t={t} /></View>
      <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <Pressable onPress={onRegister} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
          <Row gap={6}>
            <Icon name="plus" size={15} color={c.accent} sw={2.4} />
            <Txt v="label" c={c.accent}>Registrar</Txt>
          </Row>
        </Pressable>
        <Txt v="note" c={t.done ? c.accent : c.tx}>{t.remain}</Txt>
      </Row>
    </View>
  );
}

/* Selo de tendencia ao lado do numero (sobe = lima, precisa cair = vermelho) */
function TrendDot({ up, good, c }: { up: boolean; good: boolean; c: Palette }) {
  return (
    <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: good ? c.lime : c.bad, alignItems: 'center', justifyContent: 'center', marginLeft: 6 }}>
      <Icon name={up ? 'arrowup' : 'arrowdown'} size={11} color={good ? c.limeInk : '#FFFFFF'} sw={2.6} />
    </View>
  );
}

/* ------------------------------------------------------------------ */
export default function Home() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [slide, setSlide] = useState(0);
  const [held, setHeld] = useState(false);   // dedo no carrossel = cronômetro parado
  const heroRef = useRef<ScrollView>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const deriva = useRef(new Animated.Value(0)).current;

  const go = (to: string) => () => router.push(to as any);
  useLightStatusBar();
  const first = S.profile.name.split(' ')[0];
  const hour = now().getHours();
  const greet = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  const brief = todayBrief(S);
  const med = M(S);
  const ndDays = diffDays(nextInjectionDate(S), now());
  const ins = insights(S);
  const targets = dailyTargets(S);
  const wc = weightCard(S);
  const wSeries = weightSeries(S);
  const prot7 = protein7d(S);
  const bf = bodyFat(S);
  const stk = streak(S);
  const linked = hasClinic(S);
  const consultD = new Date(S.consult.t);

  /* Carrossel do hero — tres leituras do dia, todas com dado real. */
  const slides = [
    { over: 'PARA HOJE', title: brief.head, body: brief.body, cta: 'Entenda o por quê', to: `/companion?q=${encodeURIComponent(brief.q)}` },
    {
      over: 'PRÓXIMA APLICAÇÃO',
      title: ndDays <= 0 ? `${med.label} é hoje.` : `${med.label} ${ndDays === 1 ? 'amanhã' : `em ${ndDays} dias`}.`,
      body: `${nf(S.profile.dose, S.profile.dose % 1 ? 1 : 0)} ${med.unit} · ${siteLabel(nextSite(S))} sugerido.`,
      cta: 'Ver o preparo', to: '/proxima-aplicacao',
    },
    ...(ins.length ? [{
      over: 'DESCOBERTA', title: ins[0].text.replace(/<\/?b>/g, ''),
      body: 'O Forma acompanha seus registros e conta o que encontra.',
      cta: 'Ver descobertas', to: '/insights',
    }] : []),
  ];

  const total = slides.length;

  /* A barra do ponto ativo é o próprio cronômetro: enche em SLIDE_MS e,
     ao encher, empurra para o próximo slide (voltando ao primeiro no fim).
     Encostar o dedo pausa; soltar recomeça a contagem do slide atual. */
  useEffect(() => {
    progress.setValue(0);
    if (held || total < 2) return;
    const anim = Animated.timing(progress, {
      toValue: 1, duration: SLIDE_MS, easing: Easing.linear, useNativeDriver: false,
    });
    anim.start(({ finished }) => {
      if (!finished) return;
      const next = (slide + 1) % total;
      heroRef.current?.scrollTo({ x: next * width, animated: true });
      setSlide(next);
    });
    return () => anim.stop();
  }, [slide, held, total, width, progress]);


  /* Deriva da aurora — vai e volta devagar, dando vida ao fundo sem
     pedir atenção. Transform roda no driver nativo, então não custa
     quadro de JS. Respeita 'reduzir movimento': para quem liga essa
     opção do sistema, o fundo fica parado. */
  useEffect(() => {
    let cancelado = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduzir) => {
      if (cancelado || reduzir) return;
      const ida = (to: number) => Animated.timing(deriva, {
        toValue: to, duration: DERIVA_MS, easing: Easing.inOut(Easing.ease), useNativeDriver: true,
      });
      Animated.loop(Animated.sequence([ida(1), ida(0)])).start();
    });
    return () => { cancelado = true; deriva.stopAnimation(); };
  }, [deriva]);

  const onHeroScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== slide) setSlide(i);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* ================= HERO ================= */}
        <View>
          {/* escala base acima de 1 para a deriva não descobrir as bordas */}
          <Animated.View
            style={[StyleSheet.absoluteFillObject, {
              transform: [
                { scale: deriva.interpolate({ inputRange: [0, 1], outputRange: [1.06, 1.14] }) },
                { translateX: deriva.interpolate({ inputRange: [0, 1], outputRange: [-9, 9] }) },
                { translateY: deriva.interpolate({ inputRange: [0, 1], outputRange: [5, -7] }) },
              ],
            }]}
          >
            <Image source={AURORA} style={StyleSheet.absoluteFillObject} contentFit="cover" />
          </Animated.View>

          {/* cabecalho */}
          <Row style={{ paddingHorizontal: PAD, paddingTop: insets.top + 26, alignItems: 'center' }}>
            <Pressable hitSlop={6} onPress={go('/perfil')} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
              <LinearGradient colors={[c.gradFrom, c.gradTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
                <Txt v="title" c="#FFFFFF">{first[0]}</Txt>
              </LinearGradient>
            </Pressable>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Txt v="title" c={c.onHero}>{greet}, <Txt v="h2" c={c.onHero}>{first}</Txt></Txt>
              <Txt v="caption" c={c.onHero2} style={{ marginTop: 2 }}>
                Dia {diffDays(now(), new Date(S.profile.startT)) + 1} do tratamento • Semana {S.protocol.week}
              </Txt>
            </View>
            <Pressable hitSlop={8} onPress={go('/notificacoes')}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.onHeroLine, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="bell" size={20} color={c.onHero} sw={1.8} />
              </View>
              {S.unread > 0 && <View style={{ position: 'absolute', top: 1, right: 1, width: 9, height: 9, borderRadius: 5, backgroundColor: c.lime }} />}
            </Pressable>
          </Row>

          {/* carrossel */}
          <ScrollView
            ref={heroRef}
            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onScroll={onHeroScroll} scrollEventThrottle={32}
            onScrollBeginDrag={() => setHeld(true)}
            onScrollEndDrag={() => setHeld(false)}
            style={{ marginTop: 80 }}
          >
            {/* flex:1 faz o slide preencher a altura do mais alto (o
                ScrollView estica o contêiner, não o filho), e o conteúdo
                é empurrado para baixo. Assim a paginação fica parada e
                slides curtos não abrem um vão até ela. */}
            {slides.map((s, i) => (
              <View key={i} style={{ width, flex: 1, paddingHorizontal: PAD, justifyContent: 'flex-end' }}>
                <View style={{ maxWidth: 300 }}>
                  <Txt v="caption" c={c.lime} style={{ letterSpacing: 1 }}>{s.over}</Txt>
                  <Txt v="display" c={c.onHero} style={{ marginTop: 10 }}>{s.title}</Txt>
                  <Txt v="body" c={c.onHero} style={{ marginTop: 12 }}>{s.body}</Txt>
                </View>
                <Pressable onPress={go(s.to)} style={({ pressed }) => [{ alignSelf: 'flex-start', marginTop: 16, opacity: pressed ? 0.7 : 1 }]}>
                  <Row gap={7} style={{ backgroundColor: c.onHeroWeak, borderRadius: radius.xl, paddingHorizontal: 14, paddingVertical: 6 }}>
                    <Txt v="note" c={c.onHero}>{s.cta}</Txt>
                    <Icon name="spark" size={13} color={c.lime} sw={2} />
                  </Row>
                </Pressable>
              </View>
            ))}
          </ScrollView>

          {/* pontinhos — o ativo é a barra que enche até virar o slide */}
          <Row gap={4} style={{ paddingHorizontal: PAD, marginTop: 24 }}>
            {slides.map((_, i) => {
              const active = i === slide;
              return (
                <Pressable key={i} hitSlop={10} onPress={() => { heroRef.current?.scrollTo({ x: i * width, animated: true }); setSlide(i); }}>
                  <View style={{ width: active ? DOT_W : DOT_IDLE, height: 4, borderRadius: radius.pill, backgroundColor: c.onHeroLine, overflow: 'hidden' }}>
                    {active && (
                      <Animated.View
                        style={{
                          height: 4, borderRadius: radius.pill, backgroundColor: c.onHero,
                          width: progress.interpolate({ inputRange: [0, 1], outputRange: [0, DOT_W] }),
                        }}
                      />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </Row>

          {/* Faixa do check-in — vidro sobre a aurora, cantos de cima
              arredondados. Os 60 de padding embaixo são os 36px que a
              folha clara vai cobrir (no Figma a faixa tem 128 de altura
              e some por baixo do bloco branco). */}
          <Row style={{
            marginTop: 40, paddingHorizontal: PAD, paddingTop: 24, paddingBottom: 60,
            backgroundColor: 'rgba(151,151,151,0.20)',
            borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg,
            alignItems: 'center',
          }}>
            <Pressable onPress={go('/checkin')} style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.96 : 1 }] }]}>
              <View style={{ backgroundColor: c.lime, borderRadius: radius.pill, paddingHorizontal: 24, paddingVertical: 12 }}>
                <Txt v="body" c={c.limeInk}>Check-in</Txt>
              </View>
            </Pressable>
            <Row style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }} gap={8}>
              <Txt v="h1" c={c.lime}>{stk}</Txt>
              <Txt v="body" c={c.onHero} style={{ width: 120 }}>
                {stk === 1 ? 'dia de check-in' : 'dias de check-in consecutivos'}
              </Txt>
            </Row>
          </Row>
        </View>

        {/* ================= FOLHA ================= */}
        {/* Folha clara — sobe 36px por cima da faixa de vidro, que é o
            que torna o arredondamento visível (senão os cantos revelam
            o próprio fundo claro e o raio some). */}
        <View style={{ backgroundColor: c.bg, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, marginTop: -36, paddingTop: 32 }}>

          {/* metas diarias */}
          <View style={{ paddingHorizontal: PAD }}>
            <SectionHead title="Suas metas diárias" link="Ir para metas" onPress={go('/metas')} />
          </View>
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            snapToInterval={GOAL_W + GOAL_GAP} decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: PAD, gap: GOAL_GAP, paddingTop: 16 }}
          >
            {targets.map((t) => <GoalCard key={t.key} t={t} onRegister={go('/registrar')} />)}
          </ScrollView>

          {/* evolucao */}
          <View style={{ paddingHorizontal: PAD, marginTop: 40 }}>
            <SectionHead title="Sua evolução" link="Ir para evolução" onPress={go('/evolucao')} />

            <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 16, overflow: 'hidden' }}>
              <Row style={{ padding: 16, paddingBottom: 12, alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Txt v="body">Peso perdido</Txt>
                  <Txt v="note" c={c.tx3} style={{ marginTop: 2 }}>{wc.goalLabel}</Txt>
                </View>
                <Txt v="metric">{wc.lostLabel}</Txt>
              </Row>
              {wSeries.length > 1 && (
                <AreaCurve pts={wSeries} height={50} padT={4} padB={0} padX={0} strokeW={2} strokeFrom={c.limeDim} strokeTo={c.limeDim} id="wk" dashed={false} />
              )}
            </View>

            <Row gap={4} style={{ marginTop: 4, alignItems: 'stretch' }}>
              <View style={{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16 }}>
                <Txt v="body">Ingestão de proteína</Txt>
                <Row style={{ marginTop: 28, alignItems: 'center' }}>
                  <Txt v="metric">{Math.round(prot7.avg)}</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginLeft: 3, marginTop: 6 }}>g/dia</Txt>
                  <TrendDot up good={prot7.verdict.good} c={c} />
                </Row>
                <Txt v="note" c={prot7.verdict.good ? c.tx3 : c.bad} style={{ marginTop: 4 }}>{prot7.verdict.label}</Txt>
              </View>
              <View style={{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16 }}>
                <Txt v="body">Gordura corporal</Txt>
                <Row style={{ marginTop: 28, alignItems: 'center' }}>
                  <Txt v="metric">{bf ? nf(bf.v, bf.v % 1 ? 1 : 0).replace('.', ',') : '—'}</Txt>
                  {bf && <Txt v="caption" c={c.tx3} style={{ marginLeft: 3, marginTop: 6 }}>%</Txt>}
                  {bf && <TrendDot up={!bf.above} good={bf.verdict.good} c={c} />}
                </Row>
                <Txt v="note" c={bf && !bf.verdict.good ? c.bad : c.tx3} style={{ marginTop: 4 }}>
                  {bf ? bf.verdict.label : 'sem medida'}
                </Txt>
              </View>
            </Row>
          </View>

          {/* acompanhamento */}
          <View style={{ paddingHorizontal: PAD, marginTop: 40 }}>
            <SectionHead title="Seu acompanhamento" link="Ir para área médica" onPress={go('/medico')} />

            {linked ? (
              <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 16, padding: 16 }}>
                <Row>
                  {/* sem foto no perfil — inicial ate existir upload de avatar */}
                  <View style={{ width: 80, height: 80, borderRadius: radius.md, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
                    <Txt v="h1" c={c.accent}>{S.profile.doctor.replace(/^Dr[a]?\.\s*/, '')[0]}</Txt>
                  </View>
                  <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center' }}>
                    <Txt v="micro" c={c.tx3} style={{ letterSpacing: 0.6 }}>SUA ESPECIALISTA</Txt>
                    <Txt v="h2" style={{ marginTop: 3 }}>{S.profile.doctor}</Txt>
                    <Txt v="caption" c={c.tx2} style={{ marginTop: 3 }}>{S.profile.clinic}</Txt>
                  </View>
                </Row>

                <View style={{ marginTop: 24 }}>
                  <ListRow ic="companion" title="Mensagens" dot={S.unread > 0}
                    sub={S.unread > 0 ? `${S.unread} ${S.unread === 1 ? 'nova mensagem' : 'novas mensagens'}` : 'Nenhuma mensagem nova'}
                    onPress={go('/medico')} />
                  <View style={{ height: 1, backgroundColor: c.line, marginVertical: 12 }} />
                  <ListRow ic="cal" title="Próxima consulta"
                    sub={`${fmtDate(consultD)} • ${DOW_PT[consultD.getDay()]}`}
                    onPress={go('/consultas')} />
                  <View style={{ height: 1, backgroundColor: c.line, marginVertical: 12 }} />
                  <ListRow ic="doc" title="Solicitar nova receita" sub="Renove seu tratamento" onPress={go('/medico')} />
                </View>
              </View>
            ) : (
              /* sem clinica vinculada — o acompanhamento vira convite */
              <Card style={{ marginTop: 16 }} onPress={go('/medico')}>
                <Txt v="title">Você ainda não tem uma equipe no Forma</Txt>
                <Txt v="note" c={c.tx3} style={{ marginTop: 6 }}>
                  Encontre um especialista credenciado para acompanhar seu tratamento de perto.
                </Txt>
                <Row gap={6} style={{ marginTop: 14 }}>
                  <Txt v="label" c={c.accent2}>Conhecer especialistas</Txt>
                  <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
                </Row>
              </Card>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
