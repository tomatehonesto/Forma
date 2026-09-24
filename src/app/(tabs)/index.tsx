import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Pressable, ScrollView, Animated, Easing, StyleSheet, AccessibilityInfo, useWindowDimensions } from 'react-native';
import { useAurora } from '../../ui/aurora';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import { descobertaDaHome, marcarDescobertaVista } from '../../logic/descobertas';
import { alertasDe } from '../../logic/alertas';
import { EstrelaIA } from '../../ui/marca';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { mensagemDoDia } from '../../logic/etapa';
import {
  dailyTargets, weightCard, weightSeries, protein7d, bodyFat,
  nextInjectionDate, siteLabel, nextSite, streak, temAcompanhamento, clinicaConectada, temConsulta, M,
  lastInjection, penStock,
  checkinFeito, diaDoTratamento,
  type DailyTarget,
  doseDoPerfil, temDose,
  diasAteAplicar,
} from '../../logic/derive';
import { now, nf, fmtDate, diasDaSemana, quandoEm, diffDays, maiuscula } from '../../logic/time';
import { FORMAS, formaDe, oA, noNa } from '../../logic/formas';
import { Txt, Row, Card, SectionHead, ListRow, Metric, Retrato, Rolagem } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { AreaCurve } from '../../ui/charts';
import { useTheme } from '../../ui/useTheme';
import { useLarguraApp } from '../../ui/useLarguraApp';
import { useLightStatusBar } from '../../ui/useLightStatusBar';
import { radius, alfa, type Palette, RESPIRO_ABAS } from '../../theme';
import { fotoDe, focoDe } from '../../ui/retratos';
import { T } from '../../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.home.telaInicio;

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
            <Txt v="label" c={c.accent}>{K().registrar}</Txt>
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
  const [held, setHeld] = useState(false);
  /* ⚠️ DEDO NO CARROSSEL PAUSA O CRONÔMETRO, e ele chegou a sair daqui.

     Quando o deslize virou apagar-e-acender, não havia gesto para
     proteger e a pausa foi embora junto. Com o arrasto de volta, o
     problema volta com ele: sete segundos passam no meio de um gesto
     lento, o cronômetro troca de slide, e a pessoa solta o dedo achando
     que arrastou para um lugar e chega em outro.

     Agora quem liga e desliga é o próprio gesto, no onBegin e no
     onFinalize — e não mais o ScrollView, que não existe mais. */
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
  const greet = hour < 12 ? K().bomDia : hour < 18 ? K().boaTarde : K().boaNoite;

  /* ⚠️ ESCOLHER É PURO, MARCAR É EFEITO. `descobertaDaHome` roda a cada
     desenho da tela e não escreve nada; a marca de "já mostrei isto" vai
     no efeito abaixo, uma vez por montagem. Gravar durante o render seria
     escrever no estado no meio de um desenho — e, pior, a cada desenho:
     o teto de três aparições do convite queimaria numa rolagem. */
  const desc = descobertaDaHome(S);
  useEffect(() => {
    if (desc) update((s: any) => marcarDescobertaVista(s, desc.id));
  }, [desc?.id]);

  const brief = mensagemDoDia(S);
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

  /* ⚠️⚠️ A ESTRELINHA NÃO É ENFEITE DE BOTÃO, e estava em todos.

     Ela é a marca de "isto saiu de uma análise dos seus dados", e o
     carrossel a punha em toda CTA — inclusive em "Ver a aplicação", que
     leva a uma tela de calendário, e em "Entenda o por quê", que abre uma
     pergunta escrita à mão. Marca que aparece em tudo deixa de marcar
     coisa nenhuma, e a que mais perde é a descoberta: quando tudo brilha,
     o único lugar em que o brilho era verdade fica igual ao resto.

     Fica só onde é verdade: cruzamento e antecipação, que saem dos
     registros da pessoa. O CONVITE NÃO LEVA ESTRELA — ele é o aplicativo
     mostrando uma porta que ela ainda não abriu, e isso não é análise de
     nada. O resto ganha a seta, que é o que esses botões sempre foram:
     uma porta para outra tela. */
  const temLembreteDeDose = alertasDe(S, 'dose').some((a) => a.on);
  type SlideHero = { over: string; title: string; body: string; cta: string; to: string; ia?: boolean; ic?: string };

  /* ⚠️ O ATRASO DA APLICAÇÃO É EXATO, e não estimado. `nextInjectionDate`
     é a última aplicação mais a cadência; passado esse dia sem registro
     novo, `diasAteAplicar` fica negativo. Não há heurística no meio. */
  const atraso = temDose(S) && lastInjection(S) ? -nd : 0;
  const caneta = penStock(S);
  /* A forma decide como o recipiente se chama e como as preposições
     concordam com ele — ver logic/formas. */
  const forma = formaDe(S);
  const recipiente = FORMAS()[forma].recipiente;

  /* Carrossel do hero — as leituras do dia, todas com dado real.

     ⚠️ QUANTOS SLIDES É CONSEQUÊNCIA, NÃO DECISÃO. Cada entrada tem a
     própria condição, e quem não tem o que dizer não entra: quem nunca
     aplicou não vê ciclo, quem não tem consulta marcada não vê consulta,
     e quem está com tudo em dia vê menos cartões do que quem tem uma
     aplicação sem registro. Um número fixo obrigaria a inventar conteúdo
     para preencher — que é como um carrossel vira vitrine. */
  const slides: SlideHero[] = [
    /* ⚠️⚠️ O QUE ESTÁ FORA DO LUGAR VEM PRIMEIRO. Estes três são os únicos
       que pedem uma AÇÃO com hora marcada — o resto da Home é leitura. Se
       entrassem depois, a pessoa precisaria passar por dois cartões
       informativos para descobrir que a dose de ontem não foi registrada.

       ⚠️ E NENHUM DELES DIZ QUE ELA FALHOU. "A aplicação de ontem não está
       registrada" é o que o aplicativo sabe; "você não aplicou" é o que
       ele não tem como saber, e seria acusação em cima de um palpite. A
       segunda linha dá as duas saídas sem escolher uma. */
    ...(atraso >= 1 ? [{
      over: K().semRegistro,
      title: atraso === 1 ? K().semRegistroOntem : K().semRegistroDias(atraso),
      body: K().semRegistroCorpo,
      cta: K().semRegistroCta, to: '/aplicacao', ic: 'syringe',
    }] : []),

    ...(temConsulta(S) && diffDays(new Date(S.consult.t), now()) <= 1 ? [{
      over: K().aConsulta,
      title: diffDays(new Date(S.consult.t), now()) <= 0 ? K().consultaHoje : K().consultaAmanha,
      body: K().consultaCorpo,
      cta: K().consultaCta, to: '/resumo-medico', ic: 'doc',
    }] : []),

    /* ⚠️ A RENOVAÇÃO SÓ É OFERECIDA A QUEM TEM PARA QUEM PEDIR. O pedido é
       uma mensagem à equipe, e sem clínica ligada ele abre uma tela vazia
       — é a mesma regra que a tela de Cuidado já aplica ao mesmo botão.
       Sem equipe, o cartão continua existindo e leva ao recipiente, porque
       o fato de ele estar acabando não depende de plataforma nenhuma. */
    ...(temDose(S) && caneta.left <= 1 ? [{
      over: recipiente.toUpperCase(),
      title: caneta.left <= 0
        ? K().acabou(`${maiuscula(oA(forma))} ${recipiente}`)
        : K().restaUmaDose(noNa(forma)),
      body: K().receitaCorpo,
      ...(clinicaConectada(S)
        ? { cta: K().pedirRenovacao, to: '/conversa?pedir=receita', ic: 'doc' }
        : { cta: K().verMedicamento, to: '/caneta', ic: 'dose' }),
    }] : []),

    { over: brief.chapeu, title: brief.head, body: brief.body, cta: K().entendaOPorQue, to: `/companion?q=${encodeURIComponent(brief.q)}` },
    /* A PRÓXIMA APLICAÇÃO SÓ ENTRA QUANDO EXISTE UMA.

       Quem respondeu "ainda não sei" no medicamento sai do cadastro sem
       dose, e este slide anunciava a data de uma aplicação que ninguém
       marcou — quando não quebrava a Home inteira ao formatar um número
       que era nulo. Sem dose, o carrossel simplesmente tem um slide a
       menos, que é o que a verdade sobre esse dia é. */
    /* ⚠️ SAI DE CENA QUANDO HÁ ATRASO. `quandoEm` trata dia negativo como
       "hoje", então este cartão diria "hoje é dia de aplicar sua dose"
       para quem está três dias atrasada — verdade pela metade, ao lado de
       um cartão que conta a outra metade. Um assunto, um cartão. */
    ...(temDose(S) && atraso < 1 ? [{
      over: K().proximaAplicacao,
      /* ⚠️ O REMÉDIO NÃO É O SUJEITO DA FRASE. "Mounjaro é hoje" trata a
         caixinha como se ela tivesse agenda, e obriga quem lê a traduzir
         para o que a frase queria dizer: que hoje ela aplica. O nome do
         medicamento não some — desce para a linha de baixo, junto da dose
         e do local, que é onde ele é informação e não manchete. */
      title: quandoEm(nd).hoje ? K().hojeEDiaDeAplicar : K().proximaDose(quandoEm(nd).label),
      body: K().doseCorpo(med.label, doseDoPerfil(S), siteLabel(nextSite(S))),
      /* ⚠️ A SEGUNDA AÇÃO DEPENDE DE ELA JÁ TER A PRIMEIRA. Oferecer
         "criar um lembrete" a quem já tem um lembrete de dose ligado é uma
         porta que não leva a nada novo — e a lista de alertas sabe
         responder isso numa linha. Quem já tem continua indo para a tela
         da aplicação, que é onde se registra a dose. */
      ...(temLembreteDeDose
        ? { cta: K().verAplicacao, to: '/aplicacoes' }
        : { cta: K().criarLembrete, to: '/lembretes', ic: 'bell' }),
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
      ia: desc.tipo !== 'convite',
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
      setSlide((s) => (s + 1) % total);
    });
    return () => anim.stop();
  }, [slide, held, total, progress]);


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

  /* ⚠️ A BARRA QUE COLAPSA — o retrato e o sino não somem mais no scroll.

     Os dois moram no alto do hero, dentro do scroll, e sumiam nos
     primeiros sessenta pixels. Ficavam a uma rolagem inteira de distância
     de quem já estava lendo as metas do dia: para abrir o perfil ou ver
     um aviso era preciso subir tudo de volta.

     ⚠️ AQUI OS DOIS ESTADOS SÃO DESENHOS DIFERENTES, e por isso a solução
     não é a mesma das telas de capa. Lá, o botão de voltar era o mesmo nos
     dois e bastou tirá-lo do scroll. Aqui o estado expandido é uma
     composição — retrato de 40, saudação em manchete, a linha do dia —
     montada sobre a aurora; ela não cabe numa barra e não deve caber. O
     que a barra carrega é o mínimo que continua sendo útil lá embaixo:
     quem eu sou, onde estou no tratamento, e se chegou aviso.

     ⚠️ O QUE SE REPETE É O DESENHO, NUNCA O COMPORTAMENTO. Retrato e sino
     aparecem duas vezes na tela, mas `Perfil` e `Sino` são escritos uma vez
     só, logo abaixo — o destino, a contagem de não lidas e a marca verde
     saem do mesmo lugar. Dois desenhos do mesmo controle é composição;
     dois controles fazendo a mesma coisa é o que diverge no dia em que um
     dos dois mudar. */
  const [colapsado, setColapsado] = useState(false);
  const barra = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(barra, { toValue: colapsado ? 1 : 0, duration: 160, useNativeDriver: true }).start();
  }, [colapsado, barra]);

  /* O retrato e o sino, escritos uma vez e desenhados em dois tamanhos.
     `claro` é sobre a aurora — vidro e tinta clara; escuro é sobre o fundo
     da página. */
  const Perfil = ({ tam }: { tam: number }) => (
    <Pressable hitSlop={6} onPress={go('/perfil')} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
      <Retrato foto={(S.profile as any).foto} nome={first} tam={tam} />
    </Pressable>
  );

  const Sino = ({ tam, claro }: { tam: number; claro: boolean }) => (
    <Pressable hitSlop={8} onPress={go('/notificacoes')}>
      <View style={{
        width: tam, height: tam, borderRadius: tam / 2,
        backgroundColor: claro ? c.onHeroLine : c.bg2,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="bell" size={tam * 0.5} color={claro ? c.onHero : c.tx} sw={1.8} />
      </View>
      {S.unread > 0 && (
        <View style={{
          position: 'absolute', top: 1, right: 1, width: 9, height: 9,
          borderRadius: 5, backgroundColor: c.lime,
        }} />
      )}
    </Pressable>
  );

  /* ⚠️ `mostrado` ATRASA O `slide` DE PROPÓSITO. Se o conteúdo trocasse no
     mesmo instante em que o índice muda, a frase nova apareceria já
     apagando — o corte tem de acontecer no fundo do apagar, com a tela
     limpa. Por isso são dois estados: um é onde a pessoa está, o outro é
     o que está desenhado agora. */
  const [mostrado, setMostrado] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (mostrado === slide) return;
    /* ⚠️ A TROCA ACONTECE MESMO SE A SAÍDA FOR INTERROMPIDA, e o `finished`
       é ignorado de propósito. Voltar aqui sem acender de novo deixaria o
       cartão invisível para sempre — e "para sempre" é até a pessoa sair
       da aba e voltar. Entre mostrar o slide errado por um instante e
       mostrar nada até o fim da sessão, o instante é muito melhor. */
    Animated.timing(fade, { toValue: 0, duration: 130, useNativeDriver: true }).start(() => {
      setMostrado(slide);
      Animated.timing(fade, { toValue: 1, duration: 190, useNativeDriver: true }).start();
    });
  }, [slide, mostrado, fade]);

  /* A altura do maior slide, medida no primeiro desenho — ver o
     comentário do carrossel. */
  const [alturaDoSlide, setAlturaDoSlide] = useState(0);


  /* ⚠️⚠️ O ARRASTO VOLTOU SEM O DESLIZE, e é essa separação que faz ele
     valer a pena.

     O ScrollView horizontal amarrava as duas coisas: quem quisesse trocar
     de cartão tinha de aceitar o texto correndo pela lateral. Aqui o
     gesto só diz PARA QUE LADO; quem troca é o mesmo apagar e acender de
     antes. A mão faz o que fazia, e o olho para de perseguir.

     ⚠️ E ELE NÃO PODE ROUBAR A ROLAGEM VERTICAL, que é o risco real de
     pôr um Pan dentro de um ScrollView. `activeOffsetX` só o liga depois
     de 18 px na horizontal, e `failOffsetY` o mata assim que o dedo anda
     12 px na vertical — quem começa a descer a Home nunca acorda o gesto,
     e quem arrasta de lado nunca arrasta a página.

     ⚠️ `runOnJS(true)` porque o fim do gesto chama `setSlide`. Sem isso o
     callback roda na thread de UI e o setState vai para o limbo.

     O limiar de 40 px é o que separa intenção de tremor: menos que isso
     num cartão que não se move parece toque acidental, e trocar sem a
     pessoa querer é pior do que não trocar. */
  const arrastar = useMemo(
    () => Gesture.Pan()
      .enabled(total > 1)
      .runOnJS(true)
      .activeOffsetX([-18, 18])
      .failOffsetY([-12, 12])
      .onBegin(() => setHeld(true))
      .onFinalize(() => setHeld(false))
      .onEnd((ev) => {
        if (Math.abs(ev.translationX) < 40) return;
        const passo = ev.translationX < 0 ? 1 : -1;
        setSlide((s) => (s + passo + total) % total);
      }),
    [total],
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      {/* ⚠️⚠️ SEM ESTICÃO, e é a decisão que apaga todo o resto.

          O efeito elástico existe para dizer "acabou o conteúdo", e numa
          lista de texto ele faz isso bem. Numa tela cujo topo é uma
          imagem inteira ele faz outra coisa: puxa para baixo o que
          deveria subir, e descobre acima dela um recorte que não foi
          desenhado para ser visto.

          Dá para compensar — e por um commit foi o que esteve aqui: a
          aurora andava ao contrário do esticão para ficar parada, e uma
          fatia de véu cobria o que sobrava no pé. Funcionava, e era
          máquina inteira para sustentar um movimento que ninguém pediu.
          Travar é a resposta mais simples e a única sem efeito colateral.

          ⚠️ SÃO DUAS PROPRIEDADES PORQUE SÃO DOIS SISTEMAS. `bounces` é o
          elástico do iOS; `overScrollMode` é o brilho e o esticão do
          Android. Uma sem a outra trava metade dos aparelhos. */}
      <Rolagem
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={{ paddingBottom: RESPIRO_ABAS }}
        scrollEventThrottle={16}
        /* 60 é logo depois de a linha da saudação sair: ela ocupa de
           insets.top + 26 a + 66, e a barra cobre até + 48. Assim o
           retrato e o sino voltam no instante em que se perderiam, sem
           faixa morta no meio. */
        onScroll={(e) => setColapsado(e.nativeEvent.contentOffset.y > 60)}
      >

        {/* ================= HERO ================= */}
        {/* ⚠️ RECORTA, e sobrou disto tudo.

            A aurora mora num Animated.View com escala de 1,06 a 1,14 — a
            deriva —, e o véu que a escurece fica FORA dele de propósito:
            véu que passeia deixa trechos descobertos. A imagem ampliada
            transborda o hero, e o véu não vai junto; o recorte é o que
            impede esse transbordo de existir fora dele.

            Com a rolagem travada, isso deixou de ser visível — mas
            continua sendo o certo, e custa uma propriedade. */}
        <View style={{ overflow: 'hidden' }}>
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

          {/* ⚠️ O CABEÇALHO SAIU DA ROLAGEM, e aqui ficou o vão dele.

              Puxando a Home para baixo, ele descia junto com o conteúdo —
              e o retrato e o sino saíam do lugar que a pessoa já decorou.
              Agora ele mora na camada fixa, com a barra colapsada, e as
              duas se cruzam: ver o fim deste arquivo.

              O vão mantém a composição do hero exatamente como era — o
              carrossel continua a 80 px de onde a saudação acaba. */}
          <View style={{ height: insets.top + 66 }} />

          {/* ---- o carrossel, que deixou de correr ----

              ⚠️ ERA UM ScrollView HORIZONTAL COM pagingEnabled, e o texto
              entrava pela lateral. Numa vitrine isso é certo: o movimento
              diz que há mais coisa do lado. Aqui não há mais coisa do
              lado — há a MESMA COISA dizendo outra frase, e o deslize
              fazia o olho perseguir um texto em vez de ler o que chegou.

              Agora o cartão fica onde está e só o conteúdo troca, num
              apagar e acender. A paginação continua marcando onde se
              está, e tocar num ponto continua levando até ele.

              ⚠️ TODOS OS SLIDES CONTINUAM MONTADOS, e é isso que segura a
              altura. Com um filho só, cada troca mudaria a altura do bloco
              conforme o texto fosse mais curto ou mais longo — e a
              paginação e a faixa de check-in dariam um pulo a cada quinze
              segundos. Empilhados em absoluto, o contêiner fica do tamanho
              do maior, medido no primeiro desenho.

              ⚠️ E O `minHeight` É O PISO DESSE PRIMEIRO DESENHO. Antes de a
              medida chegar, a altura seria zero e a faixa de baixo subiria
              por um quadro. O número não desenha nada — ele só evita o
              pulo entre montar e medir. */}
          <GestureDetector gesture={arrastar}>
          <View style={{ marginTop: 80, minHeight: 176, height: alturaDoSlide || undefined }}>
            {/* ⚠️⚠️ O `fade` MORA NESTE PAI, E NUNCA SAI DELE.

                A primeira versão punha `opacity: i === mostrado ? fade : 0`
                em cada slide — e aí, a cada troca, o valor animado se
                soltava de um elemento e se prendia a outro no meio da
                animação. O resultado era o carrossel apagar e não acender
                mais: o nó ficava parado em zero, e o hero inteiro virava
                aurora sem texto.

                Com o valor preso a um pai que existe desde a montagem e
                nunca mais muda, a animação tem sempre o mesmo alvo. Quem
                escolhe QUAL slide está à vista são opacidades comuns, 0 ou
                1, dentro dele — números, não animação. */}
            <Animated.View
              style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: fade }}
            >
            {slides.map((s, i) => (
              <View
                key={i}
                onLayout={(ev) => {
                  const h = ev.nativeEvent.layout.height;
                  setAlturaDoSlide((a) => (h > a ? h : a));
                }}
                pointerEvents={i === mostrado ? 'auto' : 'none'}
                style={{
                  /* ⚠️ ANCORADO EMBAIXO, e não em cima — era o que o
                     justifyContent 'flex-end' fazia no carrossel antigo.
                     O bloco tem a altura do maior slide; com os curtos
                     presos no topo, sobrava um vão entre o texto e a
                     paginação que mudava de tamanho a cada troca. Presos
                     embaixo, todos encostam na mesma linha e o que sobra
                     fica em cima, onde só existe aurora. */
                  position: 'absolute', left: 0, right: 0, bottom: 0,
                  paddingHorizontal: PAD,
                  opacity: i === mostrado ? 1 : 0,
                }}
              >
                <View style={{ maxWidth: 300 }}>
                  <Txt v="caption" c={c.lime} style={{ letterSpacing: 1 }}>{s.over}</Txt>
                  <Txt v="display" c={c.onHero} style={{ marginTop: 10 }}>{s.title}</Txt>
                  <Txt v="body" c={c.onHero} style={{ marginTop: 12 }}>{s.body}</Txt>
                </View>
                <Pressable onPress={go(s.to)} style={({ pressed }) => [{ alignSelf: 'flex-start', marginTop: 16, opacity: pressed ? 0.7 : 1 }]}>
                  <Row gap={7} style={{ backgroundColor: c.onHeroWeak, borderRadius: radius.xl, paddingHorizontal: 14, paddingVertical: 6 }}>
                    <Txt v="note" c={c.onHero}>{s.cta}</Txt>
                    {/* ⚠️ A ESTRELA DA IA, E NÃO MAIS A FAÍSCA DO Icon. As
                        duas diziam a mesma coisa, em dois desenhos: a do
                        Icon é de traço e uma cor só; esta é a marca, com o
                        cacho e o degradê, e é a que assina o Insights e o
                        cabeçalho do chat. Ter a de traço aqui era o mesmo
                        personagem com dois rostos — o problema que o orbe
                        tinha, no lugar onde ele foi resolvido. */}
                    {s.ia ? (
                      <EstrelaIA size={15} />
                    ) : (
                      <Icon name={s.ic ?? 'chev'} size={13} color={c.onHero2} sw={2} />
                    )}
                  </Row>
                </Pressable>
              </View>
            ))}
            </Animated.View>
          </View>
          </GestureDetector>

          {/* pontinhos — o ativo é a barra que enche até virar o slide */}
          <Row gap={4} style={{ paddingHorizontal: PAD, marginTop: 24 }}>
            {slides.map((_, i) => {
              const active = i === slide;
              return (
                <Pressable key={i} hitSlop={10} onPress={() => setSlide(i)}>
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
                <Txt v="body" c={c.limeInk}>{feitoHoje ? K().checkinFeito : K().fazerCheckin}</Txt>
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
              <Txt v="body" c={c.onHero} style={{ width: 120 }}>{K().diasSeguidos(stk)}</Txt>
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
            <SectionHead title={K().metasDiarias} link={K().metasLink} onPress={go('/metas')} />
          </View>
          <Rolagem
            horizontal showsHorizontalScrollIndicator={false}
            snapToInterval={GOAL_W + GOAL_GAP} decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: PAD, gap: GOAL_GAP, paddingTop: 16 }}
          >
            {targets.map((t) => <GoalCard key={t.key} t={t} onRegister={go('/registrar')} />)}
          </Rolagem>

          {/* evolucao */}
          <View style={{ paddingHorizontal: PAD, marginTop: 40 }}>
            <SectionHead title={K().evolucao} link={K().evolucaoLink} onPress={go('/evolucao')} />

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
                <Txt v="body">{T.home.metas.proteina}</Txt>
                <View style={{ marginTop: 'auto' }}>
                  <Row style={{ marginTop: 28, alignItems: 'center' }}>
                    <Txt v="metric">{Math.round(prot7.avg)}</Txt>
                    <Txt v="caption" c={c.tx3} style={{ marginLeft: 3, marginTop: 6 }}>{K().gPorDia}</Txt>
                    <TrendDot up good={prot7.verdict.good} c={c} />
                  </Row>
                  <Txt v="note" c={prot7.verdict.good ? c.tx3 : c.bad} style={{ marginTop: 4 }}>{prot7.verdict.label}</Txt>
                </View>
              </View>
              <View style={{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16 }}>
                <Txt v="body">{T.medidas.corpo.gordura}</Txt>
                <View style={{ marginTop: 'auto' }}>
                  <Row style={{ marginTop: 28, alignItems: 'center' }}>
                    <Txt v="metric">{bf ? nf(bf.v, bf.v % 1 ? 1 : 0) : '—'}</Txt>
                    {bf && <Txt v="caption" c={c.tx3} style={{ marginLeft: 3, marginTop: 6 }}>%</Txt>}
                    {bf && <TrendDot up={!bf.above} good={bf.verdict.good} c={c} />}
                  </Row>
                  <Txt v="note" c={bf && !bf.verdict.good ? c.bad : c.tx3} style={{ marginTop: 4 }}>
                    {bf ? bf.verdict.label : K().semMedida}
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
              title={K().quemCuida}
              link={conectada ? K().areaMedica : undefined}
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
                  <ListRow ic="companion" title={K().mensagens} dot={S.unread > 0}
                    sub={S.unread > 0 ? K().novasMensagens(S.unread) : K().nenhumaMensagem}
                    onPress={go('/conversa')} />
                  <View style={{ height: 1, backgroundColor: c.line, marginVertical: 12 }} />
                  <ListRow ic="cal" title={K().proximaConsulta}
                    sub={K().consultaEm(fmtDate(consultD), diasDaSemana()[consultD.getDay()])}
                    onPress={go('/consultas')} />
                  <View style={{ height: 1, backgroundColor: c.line, marginVertical: 12 }} />
                  {/* ⚠️ LEVA AO PEDIDO, e não à tela onde ele poderia estar.
                      Esta linha abria a tela de equipe no alto, num hub sem
                      nenhuma ação de pedir receita — porta emparedada de
                      manual. O parâmetro abre a conversa com o rascunho
                      pronto; quem envia continua sendo ela. */}
                  <ListRow ic="doc" title={K().solicitarReceita} sub={K().solicitarReceitaSub}
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
                      {(S.profile as any).doctorInfo?.especialidade || K().acompanhaSeuTratamento}
                    </Txt>
                  </View>
                </Row>

                <View style={{ marginTop: 20 }}>
                  <ListRow ic="doc" title={K().resumoParaConsulta}
                    sub={K().resumoParaConsultaSub}
                    onPress={go('/resumo-medico')} />
                  <View style={{ height: 1, backgroundColor: c.line, marginVertical: 12 }} />
                  {/* A consulta entra como linha, e não como card: sem
                      plataforma ela é um compromisso anotado, e não um
                      evento que chegou de fora. A linha diz a data quando
                      há uma, e convida quando não há. */}
                  <ListRow ic="cal"
                    title={temConsulta(S) ? K().proximaConsulta : K().anotarConsulta}
                    sub={temConsulta(S)
                      ? K().consultaEm(fmtDate(new Date(S.consult.t)), diasDaSemana()[new Date(S.consult.t).getDay()])
                      : K().anotarConsultaSub}
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
                <Txt v="title">{K().quemAcompanha}</Txt>
                <Txt v="note" c={c.tx3} style={{ marginTop: 6 }}>{K().quemAcompanhaSub}</Txt>
                <Row gap={6} style={{ marginTop: 14 }}>
                  <Txt v="label" c={c.accent2}>{K().preencherFicha}</Txt>
                  <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
                </Row>
              </Card>
            )}
          </View>
          ) : null}
        </View>
      </Rolagem>

      {/* ⚠️ O CABEÇALHO EXPANDIDO, FIXO E CRUZANDO COM A BARRA.

          Os dois moram na mesma camada, um por cima do outro, e trocam
          por opacidade: enquanto o hero está à vista é este que aparece,
          sobre a aurora; passando o limiar, ele apaga e a barra acende.

          ⚠️ E O MOTIVO ORIGINAL DELE SER FIXO JÁ NÃO EXISTE. Ele saiu da
          rolagem para não descer junto no esticão — e o esticão foi
          travado logo depois. O que sobra a favor é o cruzamento: os dois
          cabeçalhos trocam por opacidade, no mesmo lugar, em vez de um
          sair de cena rolando enquanto o outro aparece.

          O preço é pequeno e vale saber: nos primeiros 60 px de rolagem
          de verdade ele fica parado enquanto o hero sobe, e descola por
          um instante. A troca acontece logo ali, e o cruzamento cobre a
          diferença. Devolvê-lo para dentro da rolagem é uma linha, se um
          dia o descolamento incomodar mais do que o cruzamento ajuda. */}
      <Animated.View
        pointerEvents={colapsado ? 'none' : 'box-none'}
        style={{
          position: 'absolute', left: 0, right: 0, top: 0, zIndex: 19,
          paddingHorizontal: PAD, paddingTop: insets.top + 26,
          opacity: barra.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
        }}
      >
        <Row style={{ alignItems: 'center' }}>
          {/* O RETRATO É O MESMO DO PERFIL. Quem escolhe a foto lá
              escolhe para o app inteiro — e esta é a tela que ela mais
              abre. Ver Retrato, em ui/kit. */}
          <Perfil tam={40} />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Txt v="title" c={c.onHero}>{greet}, <Txt v="h2" c={c.onHero}>{first}</Txt></Txt>
            <Txt v="caption" c={c.onHero2} style={{ marginTop: 2 }}>
              {dia.antes ? dia.texto : K().linhaDoDia(dia.texto, S.protocol.week)}
            </Txt>
          </View>
          <Sino tam={40} claro />
        </Row>
      </Animated.View>

      {/* ---- a barra colapsada ----

          ⚠️ SÓ APARECE DEPOIS DE ROLAR, ao contrário da das telas de capa.
          Lá ela existe o tempo todo porque carrega a ÚNICA saída da tela —
          sumir nos primeiros pixels deixaria alguém preso. Aqui não há
          saída para proteger: as abas estão no rodapé o tempo inteiro, e
          o hero já mostra retrato e sino em tamanho grande. Uma barra
          permanente por cima da aurora só taparia a manchete do dia.

          ⚠️ E O MEIO LEVA A LINHA DO DIA, e não o nome. "Mariana" na barra
          seria o aplicativo contando a ela quem ela é. "Dia 71 · Semana
          11" é onde ela está no tratamento — a mesma frase que o hero
          mostra, que é o fato que não cabe na cabeça de ninguém e continua
          útil trinta cartões abaixo. */}
      <Animated.View
        pointerEvents={colapsado ? 'box-none' : 'none'}
        style={{
          position: 'absolute', left: 0, right: 0, top: 0, zIndex: 20,
          paddingTop: insets.top + 8, paddingHorizontal: PAD, paddingBottom: 10,
          backgroundColor: c.bg,
          borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.line,
          opacity: barra,
        }}
      >
        <Row gap={12} style={{ alignItems: 'center' }}>
          <Perfil tam={30} />
          <Txt v="note" c={c.tx2} style={{ flex: 1 }} numberOfLines={1}>
            {dia.antes ? dia.texto : K().linhaDoDia(dia.texto, S.protocol.week)}
          </Txt>
          <Sino tam={34} claro={false} />
        </Row>
      </Animated.View>
    </View>
  );
}
