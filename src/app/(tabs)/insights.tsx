import React, { useMemo, useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet, TextInput, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import {
  patterns, recommendations, recoBucket, companionSuggestions, recentQuestions,
  balanceRead, balanceSeries, companionMemoria, hasClinic, journeySummary,
} from '../../logic/derive';
import { daysAgo, nf } from '../../logic/time';
import { Txt, Row, SectionHead, ListRow } from '../../ui/kit';
import { Barras } from '../../ui/charts';
import { Icon } from '../../ui/Icon';
import { useTheme } from '../../ui/useTheme';
import { useLightStatusBar } from '../../ui/useLightStatusBar';
import Svg, { Defs, Ellipse, Path, RadialGradient, Rect, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import { radius, font, shadowCard, type Palette } from '../../theme';

/* ============================================================
   INSIGHTS — a camada de interpretação.

   A Home responde "como estou hoje", a Jornada "por onde passei". Esta
   tela responde "o que isso quer dizer".

   A ordem não é arbitrária. O Companion abre porque é a porta da
   inteligência; as descobertas vêm logo depois porque são a prova de que
   essa inteligência conhece a pessoa; os padrões explicam o comportamento;
   só então vêm as ações. Renovar receita é importante, mas é tarefa — e
   tarefa não pode competir com o que faz o produto valer a pena.

   Nada aqui decide dose ou protocolo: isso é da equipe médica.
   ============================================================ */

const PAD = 24;
const AURORA_INSIGHTS = require('../../../assets/images/aurora-insights.png');

/* Fundo pálido do círculo de ícone, a partir da cor do achado. A paleta já
   tem o par claro de cada cor de dado; sem esse mapa eu teria de compor
   alfa em runtime, e cor com alfa sobre branco não é a mesma coisa que a
   cor pálida desenhada — a segunda foi escolhida, a primeira só acontece. */
function fundoDe(c: Palette, k: string): string {
  const par: Record<string, string> = {
    water: c.waterBg, purple: c.purpleBg, rose: c.roseBg, amber: c.amberBg,
    lime: c.limeWeak, teal: c.tealPale, accent: c.accentWeak, accent2: c.accentWeak,
  };
  return par[k] ?? c.bg2;
}

/* Três perguntas, uma por linha, centradas e sem ícone.

   A nuvem escalonada era bonita no mockup e errada no aparelho: as
   perguntas em português são longas — 22 a 29 caracteres contra as 12 a 15
   do inglês da referência — e duas por linha só cabiam vazando a tela. Chip
   cortada na borda não é insinuação de que há mais, é chip cortada. */
const CHIPS_MAX = 3;

/* ============================================================
   DISSOLUÇÃO — como o azul acaba

   Degradê linear termina em linha, e linha o olho encontra sempre: por
   mais longa que seja a queda, existe uma altura em que a tela inteira
   muda de cor de uma vez, de borda a borda. É o que fazia o fim parecer
   cortado mesmo depois de esticado.

   Aqui a cor do fundo entra por cima em três manchas de tamanhos e
   alturas diferentes, cada uma com queda radial até zero. Onde elas se
   sobrepõem o azul some antes; onde não chegam, ele sobrevive mais um
   pouco. O limite deixa de ser uma altura e passa a ser um contorno —
   irregular, sem lado paralelo à borda da tela.

   A faixa sólida no rodapé garante que os últimos pixels são fundo puro,
   para que o encontro com o conteúdo não tenha emenda nenhuma.
   ============================================================ */
function Dissolucao({ c, width, height }: { c: Palette; width: number; height: number }) {
  /* Antes eram manchas radiais sobrepostas, para que o azul acabasse num
     contorno irregular em vez de numa linha. O contorno resolvia o corte,
     mas trazia estrutura própria: onde duas manchas se encontram existe uma
     crista, e crista é forma — o olho encontra forma tão rápido quanto
     encontra linha.

     Agora a queda é uma rampa vertical única, e a irregularidade fica por
     conta da própria aurora, que já é irregular. O que faz a rampa
     desaparecer é o PERFIL das paradas: alfa distribuído em curva, quase
     parado no começo e acelerando depois. Numa rampa linear de duas
     paradas o topo tem uma taxa de mudança constante desde o primeiro
     pixel, e é justamente isso que se vê como início do degradê. */
  return (
    <View style={{ position: 'absolute', left: 0, bottom: 0, width, height }} pointerEvents="none">
      <LinearGradient
        colors={[
          'rgba(245,246,250,0)', 'rgba(245,246,250,0.02)', 'rgba(245,246,250,0.07)',
          'rgba(245,246,250,0.17)', 'rgba(245,246,250,0.34)', 'rgba(245,246,250,0.58)',
          'rgba(245,246,250,0.80)', 'rgba(245,246,250,0.94)', 'rgba(245,246,250,1)',
        ]}
        locations={[0, 0.14, 0.28, 0.42, 0.56, 0.70, 0.82, 0.90, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Duas manchas muito fracas por cima, deslocadas para lados opostos.
          Não desenham contorno nessa opacidade — só impedem que a rampa
          fique perfeitamente horizontal, que é o único jeito de uma
          transição longa denunciar que foi calculada. */}
      <Svg width={width} height={height} style={StyleSheet.absoluteFillObject}>
        <Defs>
          <RadialGradient id="dsf0" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={c.bg} stopOpacity={0.34} />
            <Stop offset="0.6" stopColor={c.bg} stopOpacity={0.12} />
            <Stop offset="1" stopColor={c.bg} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="dsf1" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={c.bg} stopOpacity={0.26} />
            <Stop offset="0.6" stopColor={c.bg} stopOpacity={0.09} />
            <Stop offset="1" stopColor={c.bg} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={width * 0.18} cy={height * 0.78} rx={width * 0.72} ry={height * 0.40} fill="url(#dsf0)" />
        <Ellipse cx={width * 0.88} cy={height * 0.64} rx={width * 0.62} ry={height * 0.34} fill="url(#dsf1)" />
      </Svg>
    </View>
  );
}

/* ============================================================
   ONDA — a presença do Companion

   Substituiu a esfera. Esfera é objeto: fica ali, parada, decorativa. A
   onda é sinal — diz que alguém está ouvindo, que há atividade do outro
   lado. Numa aba cuja tese é "existe uma inteligência acompanhando",
   sinal comunica melhor que objeto.

   Três senóides de amplitude e fase diferentes, com opacidade caindo do
   centro para as bordas — é a queda nas pontas que faz o traço parecer
   emitido em vez de desenhado. O lima leva a linha da frente porque é a
   cor de energia da marca; o teal e o branco ficam atrás, dando volume.
   ============================================================ */
function Onda({ c, width, height = 96 }: { c: Palette; width: number; height?: number }) {
  const meio = height / 2;

  /* Cada curva é uma senóide amostrada em 48 pontos, com um envelope que
     zera a amplitude nas duas pontas: sem ele o traço termina no ar, com
     um corte reto que denuncia o SVG. */
  const curva = (amp: number, ciclos: number, fase: number) => {
    const n = 48;
    return Array.from({ length: n + 1 }, (_, i) => {
      const t = i / n;
      const envelope = Math.sin(Math.PI * t) ** 1.4;
      const y = meio - Math.sin(t * Math.PI * 2 * ciclos + fase) * amp * envelope;
      return `${i ? 'L' : 'M'}${(t * width).toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  };

  const linhas = [
    { d: curva(height * 0.30, 1.5, 0), cor: c.lime, w: 2, o: 1 },
    { d: curva(height * 0.22, 1.5, 0.7), cor: c.teal, w: 1.6, o: 0.72 },
    { d: curva(height * 0.34, 1.2, 2.1), cor: '#FFFFFF', w: 1.2, o: 0.45 },
    { d: curva(height * 0.16, 2.1, 3.4), cor: c.lime, w: 1, o: 0.34 },
  ];

  return (
    <Svg width={width} height={height}>
      <Defs>
        {/* brilho por trás do feixe — dá o halo sem contorno */}
        <RadialGradient id="ondaGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={c.lime} stopOpacity={0.34} />
          <Stop offset="0.45" stopColor={c.teal} stopOpacity={0.16} />
          <Stop offset="1" stopColor={c.teal} stopOpacity={0} />
        </RadialGradient>
        {/* as pontas somem: o feixe não tem começo nem fim visível */}
        <SvgGrad id="ondaFade" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
          <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={1} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </SvgGrad>
      </Defs>

      <Ellipse cx={width / 2} cy={meio} rx={width / 2} ry={height / 2} fill="url(#ondaGlow)" />

      {linhas.map((l, i) => (
        <React.Fragment key={i}>
          {/* traço largo e translúcido por baixo = o glow da própria linha */}
          <Path d={l.d} stroke={l.cor} strokeWidth={l.w * 4} strokeOpacity={l.o * 0.16} fill="none" strokeLinecap="round" />
          <Path d={l.d} stroke={l.cor} strokeWidth={l.w} strokeOpacity={l.o} fill="none" strokeLinecap="round" />
        </React.Fragment>
      ))}
    </Svg>
  );
}

export default function Insights() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  useLightStatusBar();

  const go = (to: string) => () => router.push(to as any);
  const perguntar = (q: string) => () => router.push(`/companion?q=${encodeURIComponent(q)}` as any);

  const [pergunta, setPergunta] = useState('');
  const [tudo, setTudo] = useState(false);
  const enviar = () => {
    const q = pergunta.trim();
    if (q) { setPergunta(''); router.push(`/companion?q=${encodeURIComponent(q)}` as any); }
  };

  const recentes = useMemo(() => recentQuestions(S), [S]);
  /* o que ela já perguntou sai das sugestões — a mesma frase nas duas
     listas faz o app parecer com uma resposta só */
  const sugestoes = useMemo(
    () => companionSuggestions(S).filter((q) => !recentes.includes(q)),
    [S, recentes],
  );
  /* o que ela já perguntou vem na frente: retomar é mais provável que começar */
  const chips = useMemo(
    () => [
      ...recentes.map((q) => ({ q, visto: true })),
      ...sugestoes.map((q) => ({ q, visto: false })),
    ].slice(0, CHIPS_MAX),
    [recentes, sugestoes],
  );

  const pads = useMemo(() => patterns(S), [S]);
  const recos = useMemo(() => recommendations(S), [S]);
  const eq = useMemo(() => balanceRead(S), [S]);
  const serie = useMemo(() => balanceSeries(S, eq.fraco), [S, eq.fraco]);
  const r = journeySummary(S);
  const cor = (k: string) => (c as any)[k] as string;

  const destaque = pads[0];
  /* três, e as três de maior surpresa — patterns() já devolve ordenado.
     Selecionar é o trabalho da IA; despejar tudo o que ela sabe é o
     oposto de priorizar. O resto fica atrás de um toque. */
  const outras = tudo ? pads.slice(1) : pads.slice(1, 4);
  const temMais = !tudo && pads.length > 4;

  /* Uma ação por horizonte, não as três mais próximas.
     Pegar simplesmente o topo da lista devolvia "hoje, hoje, hoje" — que é
     verdade, mas lê como despejo de pendências do dia. Espalhando por prazo,
     a seção mostra que alguém está olhando a semana inteira: o que fazer
     agora, o que preparar, e o que já dá para adiantar. */
  const acoes = useMemo(() => {
    const vistos = new Set<string>();
    return recos.filter((x) => {
      const b = recoBucket(x.emDias);
      if (vistos.has(b)) return false;
      vistos.add(b);
      return true;
    }).slice(0, 3);
  }, [recos]);

  const memoria = useMemo(() => companionMemoria(S), [S]);

  const w = S.weights.filter((x: any) => x.t >= +daysAgo(7));
  const dSem = w.length >= 2 ? w[w.length - 1].kg - w[0].kg : 0;
  const ci7 = S.checkins.filter((x: any) => x.t >= +daysAgo(7)).length;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: PAD }}>

        {/* ============================================================
            O COMPANION ABRE A TELA

            Sem card. A cor entra escura no topo e morre em branco onde o
            conteúdo começa — o hero não tem borda, tem fim. Card definido
            recorta a IA como mais um bloco da tela; um banho de cor diz que
            ela é o ambiente em que a tela acontece.

            O vidro sobrou para uma coisa só: o campo. É o único elemento
            que a pessoa vai tocar aqui, então é o único que ganha matéria.
            ============================================================ */}
        <View style={{
          marginHorizontal: -PAD, paddingHorizontal: PAD,
          /* a barra de baixo não é respiro: é o comprimento que a cor precisa
             para chegar ao fundo da tela sem degrau. Sem ela o degradê termina
             seco, e o corte aparece como uma linha atravessando a tela */
          /* +48 e não +22: a onda encostava na barra de status. O elemento
             que abre a tela precisa de margem antes dele, senão parece que
             o conteúdo começou fora do quadro. */
          paddingTop: insets.top + 76, paddingBottom: 214,
          /* O trecho final do degradê é fundo puro, chapado — então o
             conteúdo pode subir para dentro dele sem que nada mude
             visualmente. É encurtar o hero sem encurtar a distância que a
             cor tem para chegar ao fundo. Mede o mesmo que a faixa sólida no
             rodapé da Dissolução. */
          marginBottom: -34,
          overflow: 'hidden',
        }}>
          {/* A aurora entra como imagem: o degradê que eu havia construído em
              paradas de cor chegava perto, mas cor calculada não tem grão nem
              a irregularidade de luz que uma peça pintada tem. A imagem é a
              mesma família da Home, em outro corte — a Home é vertical e
              recortada, esta é a faixa larga. */}
          <Image
            source={AURORA_INSIGHTS}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            contentPosition="center"
          />
          {/* Véu escuro para segurar o contraste do vidro: a aurora tem
              regiões claras, e branco sobre azul-claro não lê.

              Em degradê e não chapado porque o card da descoberta virou vidro
              e mora na parte de baixo — ali o véu precisa pesar mais. No topo
              ele fica leve, para a aurora aparecer onde ela é bonita, e o
              texto que mora lá (saudação e pergunta) é grande o bastante para
              aguentar. */}
          <LinearGradient
            colors={['rgba(4,15,51,0.26)', 'rgba(4,15,51,0.30)', 'rgba(4,15,51,0.62)']}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />

          {/* o azul não termina numa altura, termina num contorno — e o
              contorno passa por trás do card da descoberta, não abaixo
              dele: é isso que põe o card na divisa em vez de encostado
              nela */}
          <Dissolucao c={c} width={width} height={250} />

          {/* O orbe é a única marca do Companion aqui. Substitui a linha de
              nome, contagem e link que ocupava o topo: três elementos de
              interface para dizer o que uma presença diz sozinha. Tocá-lo
              abre a conversa inteira — o caminho continua existindo, só
              deixou de ocupar espaço. */}
          <Pressable onPress={go('/companion')} style={({ pressed }) => [{ alignSelf: 'center', opacity: pressed ? 0.8 : 1 }]}>
            <Onda c={c} width={Math.min(300, width - PAD * 2)} />
          </Pressable>

          {/* a pergunta solta na cor, centrada, sem moldura */}
          <Txt v="note" c={c.onHero2} style={{ marginTop: 4, textAlign: 'center' }}>
            Oi, {S.profile.name.split(' ')[0]}
          </Txt>
          <Txt v="display" c={c.onHero} style={{ fontSize: 30, lineHeight: 37, marginTop: 4, textAlign: 'center' }}>
            O que você quer{'\n'}entender hoje?
          </Txt>
          {/* a credencial voltou, agora do tamanho certo: uma linha discreta
              sob a pergunta, não uma barra de identidade no topo */}
          {/* A credencial fala em primeira pessoa e em extensão de tempo, não
              em contagem. "Leu 51 registros" é verdadeiro e soa a contador;
              "acompanho desde a primeira aplicação" é memória, que é o que
              faz acreditar que ele conhece ESTA pessoa. */}
          <Txt v="caption" c={c.onHero2} style={{ marginTop: 10, textAlign: 'center' }}>
            {memoria}
          </Txt>

          {/* o campo é o vidro — e fica na faixa ainda saturada do gradiente,
              porque vidro sobre branco não é vidro, é contorno */}
          <Row gap={10} style={{ backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, borderRadius: radius.pill, paddingLeft: 18, paddingRight: 6, marginTop: 24 }}>
            <TextInput
              value={pergunta} onChangeText={setPergunta}
              onSubmitEditing={enviar} returnKeyType="send"
              placeholder="Escreva sua pergunta..." placeholderTextColor={c.onHero2}
              style={{ flex: 1, paddingVertical: 15, color: c.onHero, fontFamily: font.body, fontSize: 16 }}
            />
            <Pressable onPress={enviar} hitSlop={8} disabled={!pergunta.trim()} style={({ pressed }) => [{ opacity: !pergunta.trim() ? 0.35 : pressed ? 0.6 : 1 }]}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.lime, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="send" size={17} color={c.limeInk} sw={2} />
              </View>
            </Pressable>
          </Row>

          {/* Uma pergunta por linha, cada chip do tamanho do próprio texto e
              centrada. Perde o desenho de nuvem da referência, e ganha o que
              importa mais: nenhuma pergunta cortada na borda.

              Sem ícone: a pergunta já diz do que se trata, e um pictograma
              ao lado de "Como diminuir o enjoo?" não acrescenta leitura —
              só divide a atenção com o texto que faz o trabalho.

              Em vidro, como o campo: chip branca sólida virava botão e
              competia com o card branco que vem logo abaixo. Translúcida,
              ela pertence ao ambiente do Companion. */}
          <View style={{ marginTop: 20, alignItems: 'center', gap: 8 }}>
            {chips.map(({ q }) => (
              <Pressable key={q} onPress={perguntar(q)} style={({ pressed }) => [{ opacity: pressed ? 0.65 : 1, maxWidth: '100%' }]}>
                <View style={{ backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 11 }}>
                  <Txt v="caption" c={c.onHero} numberOfLines={1}>{q}</Txt>
                </View>
              </Pressable>
            ))}
          </View>

          {/* ---- descoberta da semana ----
              Mora dentro do hero, montado em cima da divisa: metade sobre o
              azul, metade sobre a dissolução. É uma decisão de autoria, não
              de layout — a descoberta não é o primeiro item da lista de
              conteúdo, é a última coisa que a IA diz, e a peça que costura
              as duas metades da tela.

              Branco e opaco de propósito. Em vidro ele teria de caber
              inteiro dentro do azul, senão o texto branco escorregaria para
              um fundo clareando; opaco, ele carrega o próprio fundo e pode
              ficar exatamente onde o desenho pede. */}
          {/* marginTop alto de propósito: empurra o card para baixo, o que dá
              ao Companion a tela quase inteira e deixa o card entrando pelo
              rodapé — a borda superior aparecendo na dobra é o que promete
              que há mais conteúdo abaixo. */}
          {destaque && (
            <Pressable onPress={perguntar(destaque.q)} style={({ pressed }) => [{ marginTop: 104, opacity: pressed ? 0.85 : 1 }]}>
              {/* Em vidro, como o campo e as chips. Opaco ele era um objeto
                  pousado sobre o azul; translúcido, pertence ao ambiente do
                  Companion — e a descoberta É fala dele, não conteúdo da
                  página. Por isso o card fica inteiro sobre cor chapada, e a
                  dissolução só começa depois dele. */}
              <View style={{ backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, borderRadius: radius.xl, padding: 24, overflow: 'hidden' }}>
                {/* clarão lima no canto, quase imperceptível: a assinatura da
                    IA no card sem precisar de mais um elemento gráfico */}
                <Svg width={220} height={180} style={{ position: 'absolute', right: -60, top: -60 }} pointerEvents="none">
                  <Defs>
                    <RadialGradient id="brilhoCard" cx="50%" cy="50%" r="50%">
                      <Stop offset="0" stopColor={c.lime} stopOpacity={0.42} />
                      <Stop offset="0.55" stopColor={c.lime} stopOpacity={0.16} />
                      <Stop offset="1" stopColor={c.lime} stopOpacity={0} />
                    </RadialGradient>
                  </Defs>
                  <Ellipse cx={110} cy={90} rx={110} ry={90} fill="url(#brilhoCard)" />
                </Svg>

                <Row gap={9}>
                  <Icon name="aura" size={15} color={c.lime} sw={2} />
                  <Txt v="micro" c={c.lime} style={{ letterSpacing: 1.2 }}>A DESCOBERTA DA SEMANA</Txt>
                </Row>
                <Txt v="title" c={c.onHero} style={{ fontSize: 20, lineHeight: 27, marginTop: 14 }}>
                  {destaque.titulo}
                </Txt>
                <Txt v="caption" c={c.onHero2} style={{ marginTop: 9, lineHeight: 21 }}>{destaque.texto}</Txt>
                <Row gap={7} style={{ marginTop: 16 }}>
                  <Txt v="label" c={c.lime}>Entender melhor</Txt>
                  <Icon name="chev" size={13} color={c.lime} sw={2.2} />
                </Row>
              </View>
            </Pressable>
          )}
        </View>

        {/* ============================================================
            O CORPO DA MATÉRIA

            A capa fica no card, sobre a divisa; o texto continua aqui, na
            página branca. É a estrutura de revista: manchete e olho na
            abertura, e o desenvolvimento em coluna, com o número solto
            entre os dois movimentos fazendo as vezes de olho gráfico.

            Dois movimentos e não cinco: por que acontece, e o que isso
            quer dizer para esta pessoa. A pergunta que o leitor faz depois
            de uma descoberta é sempre "e daí?", e a matéria acaba quando
            ela é respondida.
            ============================================================ */}
        {outras.length > 0 && (
          <View style={{ marginTop: 22 }}>
            <SectionHead title="O que mais percebi" />
            <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
              Outras observações que encontrei analisando sua jornada.
            </Txt>

            {/* Card único com linhas divididas, e não blocos soltos na
                página: o card agrupa, e agrupar aqui diz que aquelas três
                coisas são da mesma natureza e vieram da mesma leitura. */}
            <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 16, paddingHorizontal: 18 }}>
              {outras.map((p, i) => (
                <React.Fragment key={p.titulo}>
                  {i > 0 && <View style={{ height: 1, backgroundColor: c.line2 }} />}
                  <Pressable onPress={perguntar(p.q)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                    <Row gap={14} style={{ alignItems: 'flex-start', paddingVertical: 20 }}>
                      {/* o círculo tingido carrega a categoria sem precisar
                          escrevê-la: quem lê três observações seguidas
                          reconhece que são de assuntos diferentes */}
                      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: fundoDe(c, p.cor), alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={p.ic} size={17} color={cor(p.cor)} sw={1.9} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Txt v="bodyMed" style={{ lineHeight: 23 }}>{p.titulo}</Txt>
                        <Txt v="caption" c={c.tx3} style={{ marginTop: 5, lineHeight: 20 }}>{p.texto}</Txt>
                      </View>
                      <View style={{ marginTop: 10 }}>
                        <Icon name="chev" size={15} color={c.tx4} sw={2} />
                      </View>
                    </Row>
                  </Pressable>
                </React.Fragment>
              ))}

              {/* o total fica no rodapé, não na chamada: três é o que a IA
                  escolheu mostrar; quem quiser o acervo inteiro pede */}
              {temMais && (
                <>
                  <View style={{ height: 1, backgroundColor: c.line2 }} />
                  <Pressable onPress={() => setTudo(true)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                    <Row gap={7} style={{ paddingVertical: 18 }}>
                      <Txt v="label" c={c.accent2}>Ver todas as observações ({pads.length - 1})</Txt>
                      <Icon name="chev" size={14} color={c.accent2} sw={2.2} />
                    </Row>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        )}

        {/* ---- equilíbrio: a leitura primeiro, o gráfico como ilustração ----
             Oito eixos num radar não concluem nada sozinhos. A frase conclui;
             o desenho mostra de onde ela saiu. */}
        {/* ============================================================
            O EQUILÍBRIO

            Sem título de seção e sem card: é o Companion falando de novo,
            na mesma coluna de texto da matéria. O que muda de registro é o
            fundo escuro — a fala dele tem a cor da aba, e é isso que
            separa o que ele diz do que a página apresenta.

            O gráfico entra depois, menor e sobre o claro, com o rótulo
            dizendo que é apoio. Deixou de ser a seção "Seu equilíbrio"
            com um gráfico dentro e virou uma observação com uma nota de
            rodapé desenhada.
            ============================================================ */}
        {/* Card escuro no meio do claro. É a única peça da tela que troca de
            fundo, e é isso que impede a leitura mais interpretativa da página
            de passar como mais um bloco branco entre blocos brancos.

            O gráfico saiu daqui. A spec pede que a interpretação seja o
            elemento, e um radar ao lado de três frases volta a puxar a
            atenção para a técnica — os oito indicadores continuam desenhados
            em Sintomas, que é onde quem quer o detalhe vai. */}
        <View style={{ backgroundColor: c.altTo, borderRadius: radius.lg, padding: 24, marginTop: 40 }}>
          <Row gap={9}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: c.lime }} />
            <Txt v="micro" c={c.lime} style={{ letterSpacing: 1.2 }}>COMPANION OBSERVOU</Txt>
          </Row>
          <Txt v="display" c={c.onHero} style={{ fontSize: 22, lineHeight: 29, marginTop: 16 }}>
            {eq.abertura}
          </Txt>
          <Txt v="caption" c={c.onHero2} style={{ marginTop: 9, lineHeight: 21 }}>{eq.texto}</Txt>

          {/* O gráfico entra para dizer o que o texto teria de descrever em
              mais duas frases: o formato da oscilação. Barras e não pétalas
              porque aqui o assunto é UM indicador ao longo dos dias, não
              oito num instante — e para uma série curta, barra é o gráfico
              mais simples que ainda informa. */}
          {serie.length > 2 && (
            <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: c.glassLine, paddingTop: 18 }}>
              <Row style={{ alignItems: 'flex-end' }}>
                <View style={{ flex: 1 }}>
                  <Txt v="micro" c={c.onHero2} style={{ letterSpacing: 0.8 }}>
                    {eq.fraco.toUpperCase()} · ÚLTIMOS {serie.length} DIAS
                  </Txt>
                  <Row gap={7} style={{ alignItems: 'baseline', marginTop: 4 }}>
                    <Txt v="h2" c={c.lime}>{serie[serie.length - 1].v}</Txt>
                    <Txt v="caption" c={c.onHero2}>hoje, de 100</Txt>
                  </Row>
                </View>
                <Barras data={serie} height={48} />
              </Row>
            </View>
          )}

          {/* botão sólido em lima, não link: aqui a IA não oferece leitura,
              propõe conversa */}
          <Pressable onPress={perguntar(eq.q)} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1, marginTop: 22, alignSelf: 'flex-start' }]}>
            <Row gap={8} style={{ backgroundColor: c.lime, borderRadius: radius.pill, paddingHorizontal: 20, paddingVertical: 13 }}>
              <Txt v="label" c={c.limeInk}>Como melhorar {eq.fraco.toLowerCase()}</Txt>
              <Icon name="chev" size={14} color={c.limeInk} sw={2.4} />
            </Row>
          </Pressable>
        </View>

        {/* ---- ações: o entendimento vira tarefa ---- */}
        {/* ============================================================
            SE FOSSE COMIGO, ESTA SEMANA

            Deixou de ser calendário. Antes os prazos eram os títulos e as
            ações vinham penduradas neles, o que fazia a seção parecer
            agenda; agora a IA escolhe UMA recomendação principal e trata o
            resto como nota de rodapé. O prazo continua lá, mas como
            informação dentro da linha, não como estrutura da seção.

            Priorizar é escolher o que fica de fora do destaque — se tudo
            tem o mesmo peso, ninguém priorizou nada.
            ============================================================ */}
        {acoes.length > 0 && (
          <View style={{ marginTop: 40 }}>
            <SectionHead title="Próximas ações" />
            <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
              Na ordem em que precisam acontecer — nunca sobre dose ou protocolo.
            </Txt>

            {/* Timeline: um fio vertical ligando as ações, com um ponto em
                cada. O ícone saiu — ele identificava o assunto, mas o que
                importa nesta seção é a ORDEM, e ícones lado a lado num fio
                competem com os pontos que marcam a posição.

                O ponto da primeira é cheio e maior: é a que já está
                acontecendo. Os demais ficam vazados, como marcos ainda por
                chegar, e o fio para no último — linha que continua depois do
                fim promete um item que não existe. */}
            <View style={{ marginTop: 20 }}>
              {acoes.map((x, i) => {
                const ultimo = i === acoes.length - 1;
                const agora = i === 0;
                return (
                  <Pressable key={x.texto} onPress={go(x.to)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                    <Row gap={16} style={{ alignItems: 'stretch' }}>
                      <View style={{ width: 14, alignItems: 'center' }}>
                        <View style={{
                          width: agora ? 14 : 11, height: agora ? 14 : 11, borderRadius: 7, marginTop: 4,
                          backgroundColor: agora ? c.accent : c.bg,
                          borderWidth: agora ? 0 : 2, borderColor: c.line,
                        }} />
                        {!ultimo && <View style={{ flex: 1, width: 2, backgroundColor: c.line, marginTop: 4 }} />}
                      </View>
                      <View style={{ flex: 1, paddingBottom: ultimo ? 0 : 26 }}>
                        <Txt v="micro" c={agora ? c.accent : c.tx3} style={{ letterSpacing: 0.9 }}>
                          {recoBucket(x.emDias).toUpperCase()}
                        </Txt>
                        <Txt v="bodyMed" style={{ marginTop: 5, lineHeight: 23 }}>{x.texto}</Txt>
                        <Txt v="caption" c={c.tx3} style={{ marginTop: 4, lineHeight: 20 }}>{x.porque}</Txt>
                      </View>
                      <View style={{ marginTop: 4 }}>
                        <Icon name="chev" size={15} color={c.tx4} sw={2} />
                      </View>
                    </Row>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* ---- gerar resumos ----
             "Resumos" nomeava um lugar onde eles já estariam; "Gerar resumos"
             nomeia a ação, que é o que de fato acontece — cada um é montado
             na hora, com os dados de hoje.

             A lista usa o mesmo ListRow com fio da área médica da Home: são
             o mesmo tipo de coisa, três atalhos para documentos, e repetir o
             padrão poupa a pessoa de aprender dois. */}
        <View style={{ marginTop: 40 }}>
          <SectionHead title="Gerar resumos" />
          <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
            Seus dados organizados para levar a alguém.
          </Txt>

          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 16, padding: 16 }}>
            <ListRow ic="chart" title="Resumo da semana"
              sub={`semana ${r.semana} · ${ci7} check-ins, ${nf(Math.abs(dSem), 1).replace('.', ',')} kg`}
              onPress={perguntar('Como está minha evolução?')} />
            <View style={{ height: 1, backgroundColor: c.line, marginVertical: 12 }} />
            <ListRow ic="cal" title="Resumo para a consulta"
              sub={hasClinic(S) ? 'peso, adesão, sintomas e perguntas' : 'pronto para compartilhar'}
              onPress={perguntar('Prepare minha consulta')} />
            <View style={{ height: 1, backgroundColor: c.line, marginVertical: 12 }} />
            <ListRow ic="doc" title="Resumo para o médico"
              sub="documento com a evolução completa" onPress={go('/resumo-medico')} />
          </View>
        </View>

        {/* O bloco de leituras morava aqui. A tela fecha nos resumos: o que
            ela faz é observar, interpretar e organizar — sugerir artigo é
            outro serviço, e ele diluía o último gesto da página. libraryPicks
            segue em derive.ts, servindo a Biblioteca. */}
      </ScrollView>
    </View>
  );
}
