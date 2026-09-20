import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, ScrollView, Animated, Easing, StyleSheet, AccessibilityInfo, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useAurora } from '../../ui/aurora';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import { descobertaDaHome, marcarDescobertaVista } from '../../logic/descobertas';
import {
  todayBrief, dailyTargets, weightCard, weightSeries, protein7d, bodyFat,
  nextInjectionDate, siteLabel, nextSite, streak, temAcompanhamento, clinicaConectada, temConsulta, M,
  checkinFeito, diaDoTratamento,
  type DailyTarget,
  doseDoPerfil, temDose,
  diasAteAplicar,
} from '../../logic/derive';
import { now, nf, fmtDate, DOW_PT, quandoEm } from '../../logic/time';
import { Txt, Row, Card, SectionHead, ListRow, Metric, Retrato } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { AreaCurve } from '../../ui/charts';
import { useTheme } from '../../ui/useTheme';
import { useLarguraApp } from '../../ui/useLarguraApp';
import { useLightStatusBar } from '../../ui/useLightStatusBar';
import { radius, alfa, type Palette } from '../../theme';
import { fotoDe, focoDe } from '../../ui/retratos';

const PAD = 24;                     // margem lateral do frame
const FOTO_MEDICA = fotoDe('responsavel');   // um mapa, três leitores
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
  const aurora = useAurora();
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const width = useLarguraApp();
  const [slide, setSlide] = useState(0);
  const [held, setHeld] = useState(false);   // dedo no carrossel = cronômetro parado
  const heroRef = useRef<ScrollView>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const deriva = useRef(new Animated.Value(0)).current;

  /* ⚠️ navigate, E NÃO push, PORQUE UM DOS DESTINOS É UMA ABA.

     A CTA da descoberta leva a /insights, que é irmã desta tela dentro
     do grupo (tabs) — e é a única ligação do aplicativo inteiro para
     uma aba: um grep por /insights acha esta linha e mais nada.

     Com push, a URL ia para /insights e voltava sozinha para / logo em
     seguida, enquanto a tela da aba abria. Endereço e tela discordando
     é o bastante para trocar: no navegador o histórico fica errado, e
     um push numa irmã de aba pede uma segunda instância de uma tela
     que já está montada.

     A doc da v57 descreve push como "using a push operation if
     possible" e navigate como simplesmente "navigates to the provided
     href". navigate é o geral; push é o caso especial de querer uma
     cópia nova por cima, e nenhuma CTA daqui quer isso. */
  const go = (to: string) => () => router.navigate(to as any);
  useLightStatusBar();
  const first = S.profile.name.split(' ')[0];
  const dia = diaDoTratamento(S);
  const hour = now().getHours();
  const greet = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  /* ⚠️ ESCOLHER É PURO, MARCAR É EFEITO. `descobertaDaHome` roda a cada
     desenho da tela e não escreve nada; a marca de "já mostrei isto" vai
     no efeito abaixo, uma vez por montagem. Gravar durante o render seria
     escrever no estado no meio de um desenho — e, pior, a cada desenho:
     o teto de três aparições do convite queimaria numa rolagem. */
  const desc = descobertaDaHome(S);
  useEffect(() => {
    if (desc) update((s: any) => marcarDescobertaVista(s, desc.id));
  }, [desc?.id]);

  const brief = todayBrief(S);
  const med = M(S);
  const nd = diasAteAplicar(S);
  const targets = dailyTargets(S);
  const wc = weightCard(S);
  const wSeries = weightSeries(S);
  const prot7 = protein7d(S);
  const bf = bodyFat(S);
  const stk = streak(S);
  const feitoHoje = checkinFeito(S);
  const linked = temAcompanhamento(S);
  const conectada = clinicaConectada(S);
  const consultD = new Date(S.consult.t);

  /* Carrossel do hero — tres leituras do dia, todas com dado real. */
  const slides = [
    { over: 'PARA HOJE', title: brief.head, body: brief.body, cta: 'Entenda o por quê', to: `/companion?q=${encodeURIComponent(brief.q)}` },
    /* A PRÓXIMA APLICAÇÃO SÓ ENTRA QUANDO EXISTE UMA.

       Quem respondeu "ainda não sei" no medicamento sai do cadastro sem
       dose, e este slide anunciava a data de uma aplicação que ninguém
       marcou — quando não quebrava a Home inteira ao formatar um número
       que era nulo. Sem dose, o carrossel simplesmente tem um slide a
       menos, que é o que a verdade sobre esse dia é. */
    ...(temDose(S) ? [{
      over: 'PRÓXIMA APLICAÇÃO',
      title: quandoEm(nd).hoje ? `${med.label} é hoje.` : `${med.label} ${quandoEm(nd).label}.`,
      body: `${doseDoPerfil(S)} · ${siteLabel(nextSite(S))} sugerido.`,
      cta: 'Ver a aplicação', to: '/aplicacoes',
    }] : []),
    /* ⚠️ O SLIDE NÃO É MAIS SÓ "DESCOBERTA", e o chapéu vem do motor.

       São três coisas diferentes que podem cair neste slot, e a palavra
       de cima é o que avisa qual delas é: DESCOBERTA para o cruzamento
       que ela não veria sozinha, O QUE VEM para o padrão dela que se
       repete nos próximos dias, UM CONVITE para uma parte do aplicativo
       que ela ainda não abriu. Anunciar as três como descoberta seria
       chamar de achado um convite — e a palavra perde o valor na segunda
       vez que isso acontece.

       Quando não há nenhuma das três, o carrossel fica com um slide a
       menos, igual ao da aplicação de quem não tem dose. Ver o comentário
       em `descobertaDaHome`. */
    ...(desc ? [{
      over: desc.chapeu,
      title: desc.titulo,
      body: desc.texto,
      cta: desc.cta, to: desc.to,
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
            style={[StyleSheet.absoluteFill, {
              transform: [
                { scale: deriva.interpolate({ inputRange: [0, 1], outputRange: [1.06, 1.14] }) },
                { translateX: deriva.interpolate({ inputRange: [0, 1], outputRange: [-9, 9] }) },
                { translateY: deriva.interpolate({ inputRange: [0, 1], outputRange: [5, -7] }) },
              ],
            }]}
          >
            <Image source={aurora.hero} style={StyleSheet.absoluteFill} contentFit="cover" />
          </Animated.View>

          {/* Véu sobre a aurora, mais pesado nas pontas que no meio.

              A imagem tem regiões bem claras, e o hero carrega a manchete do
              dia em branco por cima delas — sem o véu a leitura depende de
              onde a deriva parou, o que é o mesmo que não ser legível. Fica
              FORA do Animated.View de propósito: se derivasse junto, a
              proteção passearia pela tela e deixaria trechos descobertos.

              Mais escuro em cima (onde ficam nome e data, em corpo pequeno)
              e embaixo (onde a faixa de check-in encosta), e mais leve no
              meio, para a aurora ainda aparecer onde ela é bonita. */}
          <LinearGradient
            colors={[alfa(c.veu, 0.62), alfa(c.veu, 0.34), alfa(c.veu, 0.58)]}
            locations={[0, 0.46, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          {/* cabecalho */}
          <Row style={{ paddingHorizontal: PAD, paddingTop: insets.top + 26, alignItems: 'center' }}>
            {/* O RETRATO É O MESMO DO PERFIL. Quem escolhe a foto lá
                escolhe para o app inteiro — e esta é a tela que ela mais
                abre. Ver Retrato, em ui/kit. */}
            <Pressable hitSlop={6} onPress={go('/perfil')} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
              <Retrato foto={(S.profile as any).foto} nome={first} tam={40} />
            </Pressable>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Txt v="title" c={c.onHero}>{greet}, <Txt v="h2" c={c.onHero}>{first}</Txt></Txt>
              <Txt v="caption" c={c.onHero2} style={{ marginTop: 2 }}>
                {dia.antes ? dia.texto : `${dia.texto} • Semana ${S.protocol.week}`}
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
            {/* Dois estados, e o rótulo diz qual é: "Fazer check-in" é
                convite, "Check-in feito" é comprovante. Um rótulo só —
                "Check-in" — deixa a pessoa sem saber se já registrou hoje,
                que é justamente o que ela vem à Home descobrir. */}
            <Pressable onPress={go('/checkin')} style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.96 : 1 }] }]}>
              <Row gap={8} style={{ backgroundColor: c.lime, borderRadius: radius.pill, paddingHorizontal: 22, paddingVertical: 12 }}>
                {feitoHoje && <Icon name="check" size={17} color={c.limeInk} sw={2.4} />}
                <Txt v="body" c={c.limeInk}>{feitoHoje ? 'Check-in feito' : 'Fazer check-in'}</Txt>
              </Row>
            </Pressable>
            <Row style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }} gap={8}>
              <Txt v="h1" c={c.lime}>{stk}</Txt>
              {/* Hífen não-separável em "check‑in": com o corpo em 19px a
                  frase quebrava em três linhas e partia a palavra ao meio
                  ("dias de check-" / "in" / "consecutivos"), que é o tipo de
                  quebra que faz a pessoa reler.

                  A caixa não pode crescer — 120px é exatamente o que sobra
                  entre o botão e a borda —, então o que encolheu foi a
                  frase: "seguidos" diz o mesmo que "consecutivos" em quatro
                  letras a menos, e cabe em duas linhas limpas. */}
              <Txt v="body" c={c.onHero} style={{ width: 120 }}>
                {stk === 1 ? 'dia de check‑in' : 'dias seguidos de check‑in'}
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
            {/* ⚠️ "METAS", E NÃO "IR PARA METAS". O link de seção é o NOME
                da tela do outro lado, e "ir para" é o que a seta ao lado
                já diz — duas vezes a mesma informação, uma escrita e uma
                desenhada. Vale para toda a casa: os links de seção nomeiam
                destino, não descrevem o gesto. */}
            <SectionHead title="Suas metas diárias" link="Metas" onPress={go('/metas')} />
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
            <SectionHead title="Sua evolução" link="Evolução" onPress={go('/evolucao')} />

            <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 16, overflow: 'hidden' }}>
              <Row style={{ padding: 16, paddingBottom: 12, alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Txt v="body">{wc.titulo}</Txt>
                  <Txt v="note" c={c.tx3} style={{ marginTop: 2 }}>{wc.goalLabel}</Txt>
                </View>
                <Txt v="metric">{wc.lostLabel}</Txt>
              </Row>
              {wSeries.length > 1 && (
                <AreaCurve pts={wSeries} height={50} padT={4} padB={0} padX={0} strokeW={2} strokeFrom={c.limeDim} strokeTo={c.limeDim} id="wk" dashed={false} />
              )}
            </View>

            <Row gap={4} style={{ marginTop: 4, alignItems: 'stretch' }}>
              {/* OS DOIS NÚMEROS SE ALINHAM PELO PÉ, e não pelo topo.

                  "Ingestão de proteína" quebra em duas linhas e "Gordura
                  corporal" cabia em uma, então o mesmo afastamento de 28
                  deixava um número mais alto que o outro — dois cartões
                  lado a lado com a mesma estrutura e a leitura desencontrada.

                  A quebra de "Gordura / corporal" é escrita à mão porque
                  depende da largura do cartão, que depende da tela; e o
                  bloco de baixo ganhou um marginTop automatico para o dia em que
                  um dos dois títulos mudar de tamanho outra vez. O 28
                  continua sendo o mínimo. */}
              <View style={{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16 }}>
                <Txt v="body">Ingestão de proteína</Txt>
                <View style={{ marginTop: 'auto' }}>
                  <Row style={{ marginTop: 28, alignItems: 'center' }}>
                    <Txt v="metric">{Math.round(prot7.avg)}</Txt>
                    <Txt v="caption" c={c.tx3} style={{ marginLeft: 3, marginTop: 6 }}>g/dia</Txt>
                    <TrendDot up good={prot7.verdict.good} c={c} />
                  </Row>
                  <Txt v="note" c={prot7.verdict.good ? c.tx3 : c.bad} style={{ marginTop: 4 }}>{prot7.verdict.label}</Txt>
                </View>
              </View>
              <View style={{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16 }}>
                <Txt v="body">Gordura{'\n'}corporal</Txt>
                <View style={{ marginTop: 'auto' }}>
                  <Row style={{ marginTop: 28, alignItems: 'center' }}>
                    <Txt v="metric">{bf ? nf(bf.v, bf.v % 1 ? 1 : 0) : '—'}</Txt>
                    {bf && <Txt v="caption" c={c.tx3} style={{ marginLeft: 3, marginTop: 6 }}>%</Txt>}
                    {bf && <TrendDot up={!bf.above} good={bf.verdict.good} c={c} />}
                  </Row>
                  <Txt v="note" c={bf && !bf.verdict.good ? c.bad : c.tx3} style={{ marginTop: 4 }}>
                    {bf ? bf.verdict.label : 'sem medida'}
                  </Txt>
                </View>
              </View>
            </Row>
          </View>

          {/* ---- acompanhamento ----

              ⚠️ A SEÇÃO INTEIRA SOME PARA QUEM SEGUE POR CONTA PRÓPRIA.

              Ela existia nos três estados, e no terceiro era um card
              dizendo "Você ainda não tem uma equipe por aqui" — na Home,
              todo santo dia, para alguém que respondeu no cadastro que
              decidiu conduzir o tratamento sozinha. Repetir isso não é
              informar: é discordar em silêncio de uma escolha que a
              pessoa já comunicou.

              A oferta não desapareceu do aplicativo — ela está no fim da
              aba Cuidado, depois do que importa, onde quem quiser olhar
              olha. O que ela deixou de ter é a primeira tela. */}
          {linked ? (
          <View style={{ paddingHorizontal: PAD, marginTop: 40 }}>
            {/* ⚠️ E O ATALHO DO CABEÇALHO IA JUNTO, sem perguntar. "Ir
                para área médica" apontava para /medico nos dois estados —
                era a quarta porta a levar, sem vínculo, para a conversa
                com uma médica sem nome. Sem equipe não há área médica, e
                o convite do card abaixo é a única porta que faz sentido
                aqui. */}
            {/* ⚠️ "QUEM CUIDA DE VOCÊ", e era "Seu acompanhamento".

                O nome antigo entrava numa família de três quase iguais —
                /acompanhamento se chama "Quem acompanha você" e a aba
                Cuidado tinha "Sua equipe de apoio" —, e nenhum dos três
                dizia o que a seção MOSTRA: uma pessoa, com nome e rosto.
                "Seu acompanhamento" podia ser o gráfico de peso.

                Agora é o mesmo título nos três lugares onde a mesma médica
                aparece — Home, Cuidado e Perfil. Uma pergunta, uma
                resposta, três telas.

                ⚠️ E O LINK PERDEU O "IR PARA". "Área médica" é o nome da
                tela do outro lado, escrito igual ao título dela; "Ir para"
                é o que a seta ao lado já diz, e os outros links desta Home
                não têm verbo nenhum. */}
            <SectionHead
              title="Quem cuida de você"
              link={conectada ? 'Área médica' : undefined}
              onPress={conectada ? go('/medico') : undefined}
            />

            {conectada ? (
              <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 16, padding: 16 }}>
                <Row>
                  {/* O retrato, no lugar da inicial.

                      A inicial era o certo enquanto não havia imagem — ela
                      identifica sem fingir. Agora que existe o recorte da
                      especialista, mantê-la seria escolher o símbolo sobre
                      a pessoa, e esta seção é justamente a que diz "tem
                      alguém do outro lado".

                      ⚠️ O FUNDO TINGIDO SOBROU DO RECORTE. Ele existia
                      porque a imagem era PNG transparente e precisava de
                      moldura; agora a foto cobre o quadrado inteiro e ele
                      só aparece enquanto ela carrega. Fica por isso — um
                      quadrado que pisca branco antes da foto é pior. */}
                  <View style={{ width: 80, height: 80, borderRadius: radius.md, backgroundColor: c.accentWeak, overflow: 'hidden' }}>
                    <Image
                      source={FOTO_MEDICA}
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                      contentPosition={focoDe('responsavel')}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center' }}>
                    {/* ⚠️ O OLHO-DE-BOI SAIU. Ele dizia "SUA ESPECIALISTA"
                        a três pixels de um título de seção que já diz
                        "Quem cuida de você" — duas etiquetas para a mesma
                        pessoa, uma em cima da outra. Com o título acima do
                        cartão, ele virou eco. */}
                    <Txt v="h2">{S.profile.doctor}</Txt>
                    <Txt v="caption" c={c.tx2} style={{ marginTop: 3 }}>{S.profile.clinic}</Txt>
                  </View>
                </Row>

                <View style={{ marginTop: 24 }}>
                  <ListRow ic="companion" title="Mensagens" dot={S.unread > 0}
                    sub={S.unread > 0 ? `${S.unread} ${S.unread === 1 ? 'nova mensagem' : 'novas mensagens'}` : 'Nenhuma mensagem nova'}
                    onPress={go('/conversa')} />
                  <View style={{ height: 1, backgroundColor: c.line, marginVertical: 12 }} />
                  <ListRow ic="cal" title="Próxima consulta"
                    sub={`${fmtDate(consultD)} • ${DOW_PT[consultD.getDay()]}`}
                    onPress={go('/consultas')} />
                  <View style={{ height: 1, backgroundColor: c.line, marginVertical: 12 }} />
                  {/* ⚠️ LEVA AO PEDIDO, e não à tela onde ele poderia estar.
                      Esta linha abria a tela de equipe no alto, num hub sem
                      nenhuma ação de pedir receita — porta emparedada de
                      manual. O parâmetro abre a conversa com o rascunho
                      pronto; quem envia continua sendo ela. */}
                  <ListRow ic="doc" title="Solicitar nova receita" sub="Uma mensagem para a sua equipe"
                    onPress={go('/conversa?pedir=receita')} />
                </View>
              </View>
            ) : (S.profile.doctor || S.profile.clinic) ? (
              /* ⚠️ MÉDICO SEM PLATAFORMA. Três linhas viram uma: mensagens
                 e receita são conversa com a equipe, e não há equipe. A que
                 sobra é a que funciona em qualquer consulta — o resumo, que
                 a pessoa leva no telefone, imprime ou manda por fora.

                 Sem retrato, pelo mesmo motivo do Perfil: não existe foto
                 de um médico que não é da rede, e um boneco genérico
                 ocuparia o lugar de alguém real. */
              <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 16, padding: 16 }}>
                <Row gap={14} style={{ alignItems: 'center' }}>
                  <View style={{
                    width: 52, height: 52, borderRadius: radius.md, backgroundColor: c.bg3,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name="steth" size={22} color={c.tx3} sw={1.8} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Txt v="bodyMed">{S.profile.doctor || S.profile.clinic}</Txt>
                    <Txt v="micro" c={c.tx3} style={{ marginTop: 3 }}>
                      {(S.profile as any).doctorInfo?.especialidade || 'Acompanha o seu tratamento'}
                    </Txt>
                  </View>
                </Row>

                <View style={{ marginTop: 20 }}>
                  <ListRow ic="doc" title="Resumo para a consulta"
                    sub="Peso, adesão, sintomas e exames num documento só"
                    onPress={go('/resumo-medico')} />
                  <View style={{ height: 1, backgroundColor: c.line, marginVertical: 12 }} />
                  {/* A consulta entra como linha, e não como card: sem
                      plataforma ela é um compromisso anotado, e não um
                      evento que chegou de fora. A linha diz a data quando
                      há uma, e convida quando não há. */}
                  <ListRow ic="cal"
                    title={temConsulta(S) ? 'Próxima consulta' : 'Anotar uma consulta'}
                    sub={temConsulta(S)
                      ? `${fmtDate(new Date(S.consult.t))} • ${DOW_PT[new Date(S.consult.t).getDay()]}`
                      : 'Para avisarmos quando ela chegar perto'}
                    onPress={go(temConsulta(S) ? '/consultas' : '/anotar-consulta')} />
                </View>
              </View>
            ) : (
              /* ⚠️ SEM VÍNCULO, ESTE CARD ABRIA A CONVERSA COM QUEM NÃO
                 EXISTE. "Conhecer especialistas" levava a /medico — a
                 thread da médica —, que escreve `S.profile.doctor` sem
                 perguntar se há um. Sem clínica, a tela abria com o nome
                 vazio: "· acompanha sua evolução", e uma equipe de duas
                 pessoas em que a primeira não tem nome.

                 Era a terceira porta falsa do mesmo assunto. As outras
                 duas: a aba Cuidado terminava num botão "Vincular uma
                 clínica" que levava ao Perfil, e lá o card de especialista
                 era um Pressable sem `onPress`. Nenhuma tela deste
                 aplicativo escreve `doctor` ou `clinic` — vincular não é
                 coisa que ele saiba fazer (PENDENCIAS.md, item 6).

                 O card fica, porque a ausência de equipe é um fato da
                 Home. O que muda é para onde ele leva: a aba Cuidado, que
                 é onde o assunto mora de verdade e onde o convite está
                 escrito por extenso. E `navigate`, e não `push`: trocar
                 de aba é ir para uma tela que já existe, não empilhar
                 outra em cima. */
              /* ⚠️ E AQUI FICOU O ESTADO DO MEIO SEM NOME REGISTRADO.
                 Quem respondeu "tenho um profissional" e não escreveu o
                 nome continua tendo consulta, resumo e preparo — o que
                 falta é a ficha, e é ela que o card oferece. Não é o
                 convite antigo com outra roupa: aquele empurrava para uma
                 rede, este completa um dado que a própria pessoa disse
                 ter. */
              <Card style={{ marginTop: 16 }} onPress={go('/acompanhamento')}>
                <Txt v="title">Quem acompanha você?</Txt>
                <Txt v="note" c={c.tx3} style={{ marginTop: 6 }}>
                  Anote o nome e o resumo já sai endereçado para a próxima consulta.
                </Txt>
                <Row gap={6} style={{ marginTop: 14 }}>
                  <Txt v="label" c={c.accent2}>Preencher a ficha</Txt>
                  <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
                </Row>
              </Card>
            )}
          </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
