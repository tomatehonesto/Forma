import React, { useMemo, useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet, TextInput, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import {
  patterns, recommendations, recoBucket, companionSuggestions, recentQuestions,
  balanceRead, companionMemoria, PAT_LABEL, radar, checkins30,
  hasClinic, journeySummary, type PatKey,
} from '../../logic/derive';
import { daysAgo, nf } from '../../logic/time';
import { Txt, Row, SectionHead } from '../../ui/kit';
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
  /* Os centros ficam abaixo da última chip de propósito: mancha que sobe
     demais clareia o fundo do vidro e derruba o contraste do texto. */
  const manchas = [
    { id: 'd0', cx: 0.16, cy: 0.86, rx: 0.80, ry: 0.50, meio: 0.40 },
    { id: 'd1', cx: 0.90, cy: 0.74, rx: 0.70, ry: 0.42, meio: 0.32 },
    { id: 'd2', cx: 0.50, cy: 1.02, rx: 1.10, ry: 0.60, meio: 0.48 },
  ];
  return (
    <Svg width={width} height={height} style={{ position: 'absolute', left: 0, bottom: 0 }}>
      <Defs>
        {manchas.map((m) => (
          <RadialGradient key={m.id} id={m.id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={c.bg} stopOpacity={1} />
            <Stop offset={String(m.meio)} stopColor={c.bg} stopOpacity={0.82} />
            <Stop offset="1" stopColor={c.bg} stopOpacity={0} />
          </RadialGradient>
        ))}
      </Defs>
      {manchas.map((m) => (
        <Ellipse
          key={m.id}
          cx={width * m.cx} cy={height * m.cy}
          rx={width * m.rx} ry={height * m.ry}
          fill={`url(#${m.id})`}
        />
      ))}
      <Rect x={0} y={height * 0.9} width={width} height={height * 0.1} fill={c.bg} />
    </Svg>
  );
}

/* ============================================================
   PÉTALAS — o equilíbrio como oito setores

   Substituiu o radar. Radar desenha um polígono e pede que a pessoa
   julgue a forma dele: quanto mais irregular, pior — mas ninguém sabe
   qual polígono é bom, e um eixo baixo some no meio do contorno. Aqui
   cada indicador tem uma pétala própria: o trilho mostra o que caberia,
   o preenchimento mostra o que há, e a comparação é entre vizinhos, que
   é uma leitura que o olho faz sozinho.

   O eixo mais fraco vem em lima — o mesmo que a leitura escrita logo
   acima aponta como foco da semana. Sem isso o gráfico ilustraria o
   texto por coincidência; com isso, ele aponta para a mesma coisa.
   ============================================================ */
function Petalas({ c, data, size, fraco }: { c: Palette; data: { k: string; v: number }[]; size: number; fraco?: string }) {
  const R = size / 2;
  const meio = R;
  const buraco = R * 0.12;
  const trilhoAte = R * 0.97;
  /* o preenchimento para antes do rótulo: número coberto por pétala é
     dado escondido pelo próprio gráfico */
  const valorAte = R * 0.57;
  const n = data.length;
  const passo = 360 / n;
  const folga = 2.6;          // graus de respiro entre pétalas
  const arredondar = 7;       // vira strokeWidth: o traço arredonda os cantos

  const ponto = (ang: number, r: number) => {
    const rad = ((ang - 90) * Math.PI) / 180;
    return [meio + Math.cos(rad) * r, meio + Math.sin(rad) * r];
  };
  /* setor anular entre dois raios. O contorno com linejoin redondo é o que
     dá o canto arredondado sem precisar calcular arcos de canto — por isso
     os raios entram encolhidos pela metade da espessura. */
  const setor = (a0: number, a1: number, r0: number, r1: number) => {
    const i = arredondar / 2;
    const [x0, y0] = ponto(a0, r0 + i), [x1, y1] = ponto(a1, r0 + i);
    const [x2, y2] = ponto(a1, r1 - i), [x3, y3] = ponto(a0, r1 - i);
    return `M${x0},${y0} A${r0 + i},${r0 + i} 0 0 1 ${x1},${y1} L${x2},${y2} A${r1 - i},${r1 - i} 0 0 0 ${x3},${y3} Z`;
  };

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <SvgGrad id="petala" x1="0" y1="0" x2="0.4" y2="1">
            <Stop offset="0" stopColor={c.panelFrom} />
            <Stop offset="1" stopColor={c.accent2} />
          </SvgGrad>
        </Defs>

        {data.map((d, i) => {
          const a0 = i * passo - passo / 2 + folga / 2;
          const a1 = i * passo + passo / 2 - folga / 2;
          const pct = Math.max(0, Math.min(100, d.v)) / 100;
          const alvo = buraco + (valorAte - buraco) * pct;
          const ehFraco = d.k === fraco;
          return (
            <React.Fragment key={d.k}>
              <Path
                d={setor(a0, a1, buraco, trilhoAte)}
                fill={c.bg2} stroke={c.bg2}
                strokeWidth={arredondar} strokeLinejoin="round"
              />
              {pct > 0.04 && (
                <Path
                  d={setor(a0, a1, buraco, alvo)}
                  fill={ehFraco ? c.lime : 'url(#petala)'}
                  stroke={ehFraco ? c.lime : c.accent2}
                  strokeWidth={arredondar} strokeLinejoin="round"
                />
              )}
            </React.Fragment>
          );
        })}
      </Svg>

      {/* rótulos em View e não em <Text> do SVG: assim herdam a Outfit e a
          escala tipográfica do app, em vez de virarem uma segunda régua */}
      {data.map((d, i) => {
        /* 0,73 e não 0,79: nos setores da esquerda e da direita o rótulo sai
           na horizontal pura, e a caixa de 70 px vazava a borda do desenho */
        const [x, y] = ponto(i * passo, R * 0.73);
        const ehFraco = d.k === fraco;
        return (
          <View key={d.k} pointerEvents="none" style={{ position: 'absolute', left: x - 35, top: y - 19, width: 70, alignItems: 'center' }}>
            <Txt v="bodyMed" c={ehFraco ? c.limeInk : c.tx} style={{ fontSize: 17 }}>{Math.round(d.v)}</Txt>
            <Txt v="micro" c={ehFraco ? c.limeInk : c.tx3} numberOfLines={1}>{d.k}</Txt>
          </View>
        );
      })}
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

  const [filtro, setFiltro] = useState<PatKey | null>(null);
  const [pergunta, setPergunta] = useState('');
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
  const r = journeySummary(S);
  const cor = (k: string) => (c as any)[k] as string;

  const destaque = pads[0];
  const restantes = pads.slice(1);
  const visiveis = filtro ? restantes.filter((p) => p.key === filtro) : restantes;
  const cats = (Object.keys(PAT_LABEL) as PatKey[]).filter((k) => restantes.some((p) => p.key === k));

  /* agrupa preservando a ordem cronológica que recommendations já devolveu */
  const grupos = useMemo(() => {
    const mapa = new Map<string, typeof recos>();
    recos.forEach((x) => {
      const k = recoBucket(x.emDias);
      mapa.set(k, [...(mapa.get(k) || []), x]);
    });
    return [...mapa.entries()];
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
          paddingTop: insets.top + 22, paddingBottom: 140,
          /* O trecho final do degradê é fundo puro, chapado — então o
             conteúdo pode subir para dentro dele sem que nada mude
             visualmente. É encurtar o hero sem encurtar a distância que a
             cor tem para chegar ao fundo. Mede o mesmo que a faixa sólida no
             rodapé da Dissolução. */
          marginBottom: -20,
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
          {/* véu escuro para segurar o contraste do vidro: a aurora tem
              regiões claras, e branco sobre azul-claro não lê */}
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(4,15,51,0.30)' }]} />

          {/* o azul não termina numa altura, termina num contorno — e o
              contorno passa por trás do card da descoberta, não abaixo
              dele: é isso que põe o card na divisa em vez de encostado
              nela */}
          <Dissolucao c={c} width={width} height={340} />

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
          {destaque && (
            <Pressable onPress={perguntar(destaque.q)} style={({ pressed }) => [{ marginTop: 56, opacity: pressed ? 0.9 : 1 }]}>
              <View style={{ backgroundColor: c.bg1, borderRadius: radius.xl, padding: 22, ...shadowCard(c) }}>
                <Row gap={10}>
                  <View style={{ width: 20, height: 2, borderRadius: 1, backgroundColor: c.lime }} />
                  <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1.2 }}>DESCOBERTA DA SEMANA</Txt>
                </Row>
                <Txt v="display" c={c.tx} style={{ fontSize: 21, lineHeight: 28, marginTop: 14 }}>
                  {destaque.titulo}
                </Txt>
                <Txt v="caption" c={c.tx2} style={{ marginTop: 8, lineHeight: 20 }}>{destaque.texto}</Txt>
                <Row gap={6} style={{ marginTop: 16 }}>
                  <Txt v="label" c={c.accent2}>Entender melhor</Txt>
                  <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
                </Row>
              </View>
            </Pressable>
          )}
        </View>

        {/* ---- padrões: o que explica o comportamento ---- */}
        {restantes.length > 0 && (
          <View style={{ marginTop: 36 }}>
            {/* "Outras descobertas" e não "Padrões encontrados": padrão é o
                que o sistema calcula, descoberta é o que ele conta. E o nome
                amarra a seção ao card lá em cima, que é a descoberta da
                semana — estas são as outras. */}
            <SectionHead title="Outras descobertas" />
            <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
              {restantes.length} coisas que encontrei cruzando seus registros.
            </Txt>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              style={{ marginTop: 14, marginHorizontal: -PAD }}
              contentContainerStyle={{ paddingHorizontal: PAD, gap: 6 }}>
              {/* filtro em contorno, não em preenchimento: o chip cheio
                  pesava tanto quanto o conteúdo que ele filtra */}
              <Pressable onPress={() => setFiltro(null)}>
                <Row gap={6} style={{ borderWidth: 1, borderColor: filtro === null ? c.tx : c.line, backgroundColor: filtro === null ? c.tx : 'transparent', paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill }}>
                  <Txt v="label" c={filtro === null ? c.onHero : c.tx2}>Tudo</Txt>
                  <Txt v="micro" c={filtro === null ? c.lime : c.tx4}>{restantes.length}</Txt>
                </Row>
              </Pressable>
              {cats.map((k) => {
                const on = filtro === k;
                const n = restantes.filter((p) => p.key === k).length;
                return (
                  <Pressable key={k} onPress={() => setFiltro(on ? null : k)}>
                    <Row gap={6} style={{ borderWidth: 1, borderColor: on ? c.tx : c.line, backgroundColor: on ? c.tx : 'transparent', paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill }}>
                      <Txt v="label" c={on ? c.onHero : c.tx2}>{PAT_LABEL[k]}</Txt>
                      <Txt v="micro" c={on ? c.lime : c.tx4}>{n}</Txt>
                    </Row>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Cada padrão é uma descoberta, e descoberta se lê em três
                tempos: a evidência (o número que ninguém somaria sozinho), a
                frase que ele sustenta, e o convite para ir fundo.

                Por isso o número vem primeiro e grande, na tipografia leve —
                é a prova. Sem ele o card afirma; com ele, mostra de onde
                tirou. O fio separa sem enquadrar: caixa branca sobre fundo
                quase branco faria cinco descobertas parecerem cinco
                notificações. */}
            <View style={{ marginTop: 20 }}>
              {visiveis.map((p, i) => (
                <Pressable key={p.titulo} onPress={perguntar(p.q)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <View style={{ paddingVertical: 26, borderTopWidth: 1, borderTopColor: c.line }}>
                    <Row style={{ alignItems: 'flex-start' }}>
                      <Row gap={7} style={{ flex: 1 }}>
                        <Icon name={p.ic} size={13} color={cor(p.cor)} sw={2} />
                        <Txt v="micro" c={c.tx3} style={{ letterSpacing: 0.9 }}>{p.cat.toUpperCase()}</Txt>
                      </Row>
                      <Txt v="micro" c={c.tx4}>{String(i + 1).padStart(2, '0')}</Txt>
                    </Row>

                    {p.evid && (
                      <Row gap={7} style={{ alignItems: 'baseline', marginTop: 16 }}>
                        <Txt v="display" c={c.tx} style={{ fontSize: 40, lineHeight: 46 }}>{p.evid.valor}</Txt>
                        {!!p.evid.unidade && <Txt v="body" c={c.tx3}>{p.evid.unidade}</Txt>}
                      </Row>
                    )}
                    {p.evid && (
                      <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{p.evid.legenda}</Txt>
                    )}

                    <Txt v="title" style={{ marginTop: p.evid ? 18 : 14 }}>{p.titulo}</Txt>
                    <Txt v="caption" c={c.tx2} style={{ marginTop: 6, lineHeight: 20 }}>{p.texto}</Txt>

                    <Row gap={6} style={{ marginTop: 16 }}>
                      <Txt v="label" c={c.accent2}>Perguntar sobre isso</Txt>
                      <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
                    </Row>
                  </View>
                </Pressable>
              ))}
              <View style={{ height: 1, backgroundColor: c.line }} />
            </View>
          </View>
        )}

        {/* ---- equilíbrio: a leitura primeiro, o gráfico como ilustração ----
             Oito eixos num radar não concluem nada sozinhos. A frase conclui;
             o desenho mostra de onde ela saiu. */}
        <View style={{ marginTop: 36 }}>
          <SectionHead title="Seu equilíbrio" link="Sintomas" onPress={go('/sintomas')} />

          {/* A conclusão vem antes do gráfico, e vem em voz de gente. O radar
              tem oito eixos e não conclui nada sozinho — quem sabe se 62% em
              proteína é bom é quem já viu os outros sete. Aqui ele deixa de
              ser a análise e passa a ser a prova dela: primeiro o Companion
              diz o que viu, depois mostra onde viu. */}
          {/* Leitura e gráfico dentro do mesmo card: eles são um argumento e
              sua prova, e soltos na página pareciam dois blocos sem dono. O
              card aqui não é moldura decorativa — é o que diz "isto pertence
              àquilo". O fio interno separa o que a IA concluiu do que
              sustenta a conclusão. */}
          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 22, marginTop: 16 }}>
            <Row gap={9}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: c.lime }} />
              <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1.2 }}>O COMPANION OBSERVOU</Txt>
            </Row>
            <Txt v="display" c={c.tx} style={{ fontSize: 23, lineHeight: 30, marginTop: 14 }}>
              {eq.abertura}
            </Txt>
            <Txt v="body" c={c.tx2} style={{ marginTop: 8, lineHeight: 25 }}>{eq.texto}</Txt>

            <Pressable onPress={perguntar(eq.q)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, marginTop: 16 }]}>
              <Row gap={6}>
                <Txt v="label" c={c.accent2}>Como melhorar {eq.fraco.toLowerCase()}</Txt>
                <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
              </Row>
            </Pressable>

            <View style={{ height: 1, backgroundColor: c.line2, marginTop: 24 }} />

            <View style={{ alignItems: 'center', marginTop: 22 }}>
              <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1, marginBottom: 14 }}>
                O QUE SUSTENTA ESSA LEITURA
              </Txt>
              <Petalas data={radar(S)} size={Math.min(288, width - 96)} fraco={eq.fraco} c={c} />
              <Txt v="caption" c={c.tx3} style={{ marginTop: 12 }}>
                Últimos 3 check-ins · {checkins30(S)} registros no mês
              </Txt>
            </View>
          </View>
        </View>

        {/* ---- ações: o entendimento vira tarefa ---- */}
        {grupos.length > 0 && (
          <View style={{ marginTop: 36 }}>
            <SectionHead title="Próximas ações" />
            <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
              Na ordem em que precisam acontecer — nunca sobre dose ou protocolo.
            </Txt>

            {/* Os grupos saem do prazo calculado, não de dois baldes fixos:
                "Daqui a 9 dias" só existe porque a consulta é daqui a nove
                dias. É a diferença entre uma lista de tarefas e alguém
                organizando a agenda de outra pessoa.

                Cada linha carrega o porquê. Sem ele a ação é ordem; com ele,
                é recomendação — e a pessoa pode discordar, que é o que
                separa conselho de alarme. */}
            {grupos.map(([rotulo, itens], gi) => (
              <View key={rotulo} style={{ marginTop: gi === 0 ? 20 : 14 }}>
                <Row gap={10} style={{ marginBottom: 10 }}>
                  <Txt v="label" c={c.tx}>{rotulo}</Txt>
                  <View style={{ flex: 1, height: 1, backgroundColor: c.line }} />
                  <Txt v="micro" c={c.tx4}>{itens.length}</Txt>
                </Row>
                {/* cada prazo é um card: o grupo passa a ter contorno próprio
                    em vez de flutuar como uma lista solta sob um rótulo */}
                <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, paddingHorizontal: 18, paddingVertical: 4 }}>
                  {itens.map((x, i) => (
                    <React.Fragment key={x.texto}>
                      {i > 0 && <View style={{ height: 1, backgroundColor: c.line2 }} />}
                      <Pressable onPress={go(x.to)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                        <Row gap={13} style={{ alignItems: 'flex-start', paddingVertical: 16 }}>
                          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name={x.ic} size={15} color={c.accent} sw={1.9} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Txt v="bodyMed">{x.texto}</Txt>
                            <Txt v="caption" c={c.tx3} style={{ marginTop: 3, lineHeight: 19 }}>{x.porque}</Txt>
                          </View>
                          <View style={{ marginTop: 8 }}>
                            <Icon name="chev" size={14} color={c.tx4} sw={2} />
                          </View>
                        </Row>
                      </Pressable>
                    </React.Fragment>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ---- resumos ---- */}
        <View style={{ marginTop: 36 }}>
          <SectionHead title="Resumos" />
          <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
            Seus dados organizados para levar a alguém.
          </Txt>
          {/* Linhas construídas aqui e não com ListRow: os três resumos têm
              duas linhas de texto cada e o padding padrão do kit os deixava
              colados, com o sub de um quase encostando no título do
              seguinte. 20 px acima e abaixo dão à lista o mesmo ar do
              resto da tela. */}
          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, paddingHorizontal: 18 }}>
            {[
              { ic: 'chart', t: 'Resumo da semana', s: `semana ${r.semana} · ${ci7} check-ins, ${nf(Math.abs(dSem), 1).replace('.', ',')} kg`, on: perguntar('Como está minha evolução?') },
              { ic: 'cal', t: 'Resumo para a consulta', s: hasClinic(S) ? 'peso, adesão, sintomas e perguntas' : 'pronto para compartilhar', on: perguntar('Prepare minha consulta') },
              { ic: 'doc', t: 'Resumo para o médico', s: 'documento com a evolução completa', on: go('/resumo-medico') },
            ].map((x, i) => (
              <React.Fragment key={x.t}>
                {i > 0 && <View style={{ height: 1, backgroundColor: c.line2 }} />}
                <Pressable onPress={x.on} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <Row gap={14} style={{ paddingVertical: 20 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={x.ic} size={16} color={c.tx2} sw={1.9} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Txt v="bodyMed">{x.t}</Txt>
                      <Txt v="caption" c={c.tx3} style={{ marginTop: 3 }}>{x.s}</Txt>
                    </View>
                    <Icon name="chev" size={14} color={c.tx4} sw={2} />
                  </Row>
                </Pressable>
              </React.Fragment>
            ))}
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
