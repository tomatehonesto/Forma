import React, { useMemo, useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet, TextInput, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import {
  patterns, recommendations, companionSuggestions, recentQuestions, balanceRead,
  libraryPicks, PAT_LABEL, radar, checkins30, hasClinic, journeySummary, type PatKey,
} from '../../logic/derive';
import { daysAgo, nf } from '../../logic/time';
import { Txt, Row, SectionHead, ListRow, Divider } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { Radar } from '../../ui/charts';
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
  const leituras = useMemo(() => libraryPicks(S), [S]);
  const r = journeySummary(S);
  const cor = (k: string) => (c as any)[k] as string;

  const destaque = pads[0];
  const restantes = pads.slice(1);
  const visiveis = filtro ? restantes.filter((p) => p.key === filtro) : restantes;
  const cats = (Object.keys(PAT_LABEL) as PatKey[]).filter((k) => restantes.some((p) => p.key === k));

  const hoje = recos.filter((x) => x.quando === 'hoje');
  const semana = recos.filter((x) => x.quando === 'semana');

  /* prova de que ele conhece a jornada — número, não promessa */
  const lidos = S.checkins.length + S.weights.length + S.injections.length + S.exams.length;

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
          <LinearGradient
            /* Azul escuro em cima, azul claro embaixo. A rampa não vai até o
               fundo da tela — quem faz o encontro com o branco é a
               Dissolução, logo abaixo.

               O azul médio aparece DUAS vezes, em 24% e em 58%: entre elas a
               cor não muda. Essa faixa chapada é o que permite campo e chips
               em vidro. Num degradê contínuo a chip de cima estaria sobre um
               azul e a de baixo sobre outro bem mais claro, com a mesma
               translucidez rendendo contrastes diferentes. A parada acompanha
               a última chip; o card da descoberta é opaco e não precisa
               dela. */
            colors={[c.altTo, c.altMid, c.altMid, c.altFrom]}
            locations={[0, 0.24, 0.58, 1]}
            start={{ x: 0.25, y: 0 }} end={{ x: 0.75, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Clarão no alto, fora do eixo. Serve só para quebrar a leitura de
              rampa: um degradê de duas cores, por mais bem espaçado que
              esteja, ainda lê como faixa uniforme descendo. A mancha
              desalinhada dá profundidade sem custar contraste — ela morre
              bem acima do campo de digitar. */}
          <Svg width={width} height={230} style={{ position: 'absolute', left: 0, top: 0 }}>
            <Defs>
              <RadialGradient id="atmosfera" cx="50%" cy="50%" r="50%">
                <Stop offset="0" stopColor={c.altFrom} stopOpacity={0.30} />
                <Stop offset="0.55" stopColor={c.altFrom} stopOpacity={0.12} />
                <Stop offset="1" stopColor={c.altFrom} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Ellipse cx={width * 0.78} cy={70} rx={width * 0.62} ry={115} fill="url(#atmosfera)" />
          </Svg>

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
          <Txt v="caption" c={c.onHero2} style={{ marginTop: 10, textAlign: 'center' }}>
            Ele leu {lidos} registros da sua jornada
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
            <SectionHead title="Padrões encontrados" />
            <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
              {restantes.length} no que você registrou até agora.
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

            {/* Lista numerada com fios, não pilha de caixas. Cinco cards
                brancos iguais empilhados fazem o olho tratar todos como o
                mesmo peso e desistir no terceiro; o número dá posição, o fio
                dá separação, e o espaço faz o resto. É o mesmo conteúdo com
                metade da tinta. */}
            <View style={{ marginTop: 18 }}>
              {visiveis.map((p, i) => (
                <Pressable key={p.titulo} onPress={perguntar(p.q)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <Row gap={14} style={{ alignItems: 'flex-start', paddingVertical: 20, borderTopWidth: 1, borderTopColor: c.line }}>
                    <Txt v="micro" c={c.tx4} style={{ width: 20, marginTop: 3 }}>
                      {String(i + 1).padStart(2, '0')}
                    </Txt>
                    <View style={{ flex: 1 }}>
                      <Row gap={7}>
                        <Icon name={p.ic} size={13} color={cor(p.cor)} sw={2} />
                        <Txt v="micro" c={c.tx3} style={{ letterSpacing: 0.8 }}>{p.cat.toUpperCase()}</Txt>
                      </Row>
                      <Txt v="title" style={{ marginTop: 9 }}>{p.titulo}</Txt>
                      <Txt v="note" c={c.tx2} style={{ marginTop: 5 }}>{p.texto}</Txt>
                    </View>
                    <View style={{ marginTop: 3 }}>
                      <Icon name="chev" size={15} color={c.tx4} sw={2} />
                    </View>
                  </Row>
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

          {/* A leitura vem primeiro e grande; o radar entra abaixo, sem caixa,
              como ilustração dela. Dentro de um card os dois disputavam o
              mesmo plano — a frase virava legenda do gráfico, quando é o
              gráfico que devia ser a nota de rodapé da frase. */}
          <Row gap={10} style={{ marginTop: 20 }}>
            <View style={{ width: 20, height: 2, borderRadius: 1, backgroundColor: c.lime }} />
            <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1.2 }}>LEITURA DO COMPANION</Txt>
          </Row>
          <Txt v="display" c={c.tx} style={{ fontSize: 24, lineHeight: 31, marginTop: 14 }}>
            {eq.titulo}
          </Txt>
          <Txt v="note" c={c.tx2} style={{ marginTop: 8 }}>{eq.texto}</Txt>

          <View style={{ alignItems: 'center', marginTop: 24 }}>
            <Radar data={radar(S)} size={Math.min(250, width - 110)} />
            <Txt v="caption" c={c.tx3} style={{ marginTop: 10 }}>
              Últimos 3 check-ins · {checkins30(S)} registros no mês
            </Txt>
          </View>

          <Pressable onPress={perguntar(eq.q)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, marginTop: 20 }]}>
            <Row gap={6}>
              <Txt v="label" c={c.accent2}>Como melhorar {eq.fraco.toLowerCase()}</Txt>
              <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
            </Row>
          </Pressable>
        </View>

        {/* ---- ações: o entendimento vira tarefa ---- */}
        {(hoje.length > 0 || semana.length > 0) && (
          <View style={{ marginTop: 36 }}>
            <SectionHead title="Próximas ações" />
            <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
              Sai dos seus registros e da fase do ciclo — nunca de dose ou protocolo.
            </Txt>

            {hoje.length > 0 && (
              <>
                <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1, marginTop: 18, marginBottom: 10 }}>HOJE</Txt>
                <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, paddingHorizontal: 16 }}>
                  {hoje.map((x, i) => (
                    <React.Fragment key={x.texto}>
                      {i > 0 && <Divider />}
                      <ListRow ic={x.ic} title={x.texto} onPress={go(x.to)} />
                    </React.Fragment>
                  ))}
                </View>
              </>
            )}

            {semana.length > 0 && (
              <>
                <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1, marginTop: 20, marginBottom: 10 }}>PRÓXIMA SEMANA</Txt>
                <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, paddingHorizontal: 16 }}>
                  {semana.map((x, i) => (
                    <React.Fragment key={x.texto}>
                      {i > 0 && <Divider />}
                      <ListRow ic={x.ic} title={x.texto} onPress={go(x.to)} />
                    </React.Fragment>
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        {/* ---- resumos ---- */}
        <View style={{ marginTop: 36 }}>
          <SectionHead title="Resumos" />
          <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
            Seus dados organizados para levar a alguém.
          </Txt>
          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, paddingHorizontal: 16 }}>
            <ListRow ic="chart" title="Resumo da semana"
              sub={`semana ${r.semana} · ${ci7} check-ins, ${nf(Math.abs(dSem), 1).replace('.', ',')} kg`}
              onPress={perguntar('Como está minha evolução?')} />
            <Divider />
            <ListRow ic="cal" title="Resumo para a consulta"
              sub={hasClinic(S) ? 'peso, adesão, sintomas e perguntas' : 'pronto para compartilhar'}
              onPress={perguntar('Prepare minha consulta')} />
            <Divider />
            <ListRow ic="doc" title="Resumo para o médico"
              sub="documento com a evolução completa" onPress={go('/resumo-medico')} />
          </View>
        </View>

        {/* ---- leituras: cada uma entra por um motivo que aparece no card ----
             O segundo card do Companion morava aqui. Saiu: ele já é a porta
             da tela, e repetir a porta no fim é dizer que a primeira não
             convenceu. No lugar entra o que a IA escolheu ler com a pessoa. */}
        {leituras.length > 0 && (
          <View style={{ marginTop: 36 }}>
            <SectionHead title="Para o seu momento" link="Ver tudo" onPress={go('/biblioteca')} />
            <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
              Escolhido pela fase do seu ciclo e pelo que você vem registrando.
            </Txt>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              style={{ marginTop: 14, marginHorizontal: -PAD }}
              contentContainerStyle={{ paddingHorizontal: PAD, gap: 10 }}>
              {leituras.map((l) => (
                <Pressable key={l.titulo} onPress={go('/biblioteca')} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
                  <View style={{ width: 264, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18 }}>
                    <Row gap={8} style={{ alignItems: 'flex-start' }}>
                      <View style={{ marginTop: 1 }}>
                        <Icon name={l.ic} size={14} color={c.accent} sw={2} />
                      </View>
                      <Txt v="micro" c={c.accent} style={{ flex: 1, letterSpacing: 0.6 }}>{l.motivo.toUpperCase()}</Txt>
                    </Row>
                    <Txt v="title" style={{ marginTop: 11 }}>{l.titulo}</Txt>
                    <Txt v="caption" c={c.tx2} style={{ marginTop: 6, lineHeight: 19 }}>{l.desc}</Txt>
                    <Row gap={6} style={{ marginTop: 14 }}>
                      <Icon name="book" size={13} color={c.tx4} sw={2} />
                      <Txt v="micro" c={c.tx3}>{l.min} min de leitura</Txt>
                    </Row>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
