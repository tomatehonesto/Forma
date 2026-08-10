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
import { Malha } from '../../ui/instrumentos';
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

/* O ORBE NÃO É MAIS UM ARQUIVO.

   Ele passou por três formas. Desenhado em SVG — halo, reflexo, corpo,
   brasa e aro em camadas de degradê radial —, chegava perto e não chegava
   lá. Depois virou PNG recortado do fundo por luminância, e aí o recorte
   apareceu: onde o halo quase acaba, o dither da imagem de origem vira
   franja, e franja num objeto que deveria ser contínuo é pior do que a
   versão desenhada.

   A saída era não recortar. Agora o orbe faz parte da imagem do hero:
   mesma peça, mesma luz, mesma renderização, nenhuma borda para dar
   errado. É a mesma decisão que a aurora já tinha tomado — quando a
   matéria é o assunto, ela vem inteira.

   Sobra em código só a altura que ele ocupa, para o texto começar abaixo
   dele e para o toque cair em cima dele.

   A PEÇA VEM NO FORMATO DA TELA, E ISSO RESOLVEU UM PROBLEMA REAL

   A versão anterior era 2:3 — quase quadrada perto de um hero estreito e
   comprido. Com contentFit cover a escala fica ditada pela ALTURA, e o
   orbe crescia junto com o conteúdo: chegou a 275 px de diâmetro, e cada
   linha a mais empurrava a esfera para baixo, que empurrava o texto, que
   aumentava o hero. Um laço sem ponto fixo — eu ajustava a margem e o
   problema voltava maior. Cheguei a esticar a tela da imagem para 3600 px
   só para tirar a escala das mãos da altura.

   Esta vem 853×1844, praticamente a proporção do aparelho. A imagem cabe
   inteira na altura do hero (nenhuma linha dela é descartada em cima ou
   embaixo) e o corte acontece nas laterais, onde só existe degradê. O
   orbe fica em 136 px e o laço some por construção, sem truque nenhum. */
const ORBE_ALTURA = 240;

/* As duas medidas da junção entre o hero e a folha.

   BARRA é o vão de imagem abaixo do card da descoberta. SOBREPOSICAO é o
   quanto a folha clara sobe por cima dele. A diferença — 68 menos 36 — é
   a faixa de aurora que continua visível sob o card, e é ela que faz o
   card ficar montado sobre a imagem em vez de encostado na borda dela.

   Os dois números são os mesmos da Home. Junção idêntica, medida idêntica:
   se uma tela abrisse 36 e a outra 44, a diferença não leria como
   variação, leria como descuido. */
const BARRA = 68;
const SOBREPOSICAO = 36;

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

/* A DISSOLUÇÃO morava aqui, em quatro versões: 120 px, 300, 420, e um
   perfil em sigmoide de vinte paradas. Cada uma ficou melhor que a
   anterior sem nunca ficar certa, e o motivo é que o problema não era o
   ajuste — era a ideia.

   Um degradê que vai da cor ao fundo tenta ESCONDER que existe uma
   transição, e essa é uma promessa que nenhum degradê cumpre: por mais
   longa e suave que seja a rampa, existe sempre uma altura em que a tela
   inteira muda de cor de lado a lado. O olho encontra faixa horizontal
   antes de encontrar qualquer outra coisa.

   A folha clara com topo arredondado (no corpo da tela) faz o contrário:
   assume a transição e a transforma em objeto. Não há mistura, há
   sobreposição — e o raio diz "isto é outra camada" numa forma que se lê
   de imediato, sem depender de truque de alfa nenhum.

   Fica registrado porque o erro é instrutivo: eu estava refinando a
   execução de uma abordagem que não ia dar certo, e refinar o errado
   parece progresso porque cada passo de fato melhora. */

/* A ONDA mudou para ui/instrumentos. Ela é a presença do Companion,
   e o Companion tem tela propria — peça que aparece em dois lugares
   nao mora dentro de um deles. */

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
          /* +76 e não +22: a onda encostava na barra de status. O elemento
             que abre a tela precisa de margem antes dele, senão parece que
             o conteúdo começou fora do quadro. */
          /* A barra de baixo era o comprimento que a cor precisava para se
             diluir — chegou a 380 px na versão do degradê. Com a folha, a
             cor não se dilui mais: ela é coberta. Então a barra volta a ser
             o que o nome diz, o vão entre a base do card e o fim da
             imagem, e 68 px bastam. Descontada a sobreposição da folha,
             sobram 32 px de aurora visível sob o card. */
          paddingTop: insets.top + 76, paddingBottom: BARRA,
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
            /* ancorada no topo, não centralizada.

               Com a peça esticada, a imagem é mais alta que o hero — e
               centralizar corta em cima e embaixo por igual, o que subia o
               orbe 78 px e o deixava quase encostado na barra de status.
               Ancorada no topo, a posição da esfera é sempre a mesma
               fração da largura, e o corte acontece só embaixo, onde só
               existe degradê. */
            contentPosition="top center"
          />
          {/* Véu escuro para segurar o contraste do vidro: a aurora tem
              regiões claras, e branco sobre azul-claro não lê.

              Em degradê e não chapado porque o card da descoberta virou vidro
              e mora na parte de baixo — ali o véu precisa pesar mais. No topo
              ele fica leve, para a aurora aparecer onde ela é bonita, e o
              texto que mora lá (saudação e pergunta) é grande o bastante para
              aguentar. */}
          {/* O véu voltou a escurecer até o rodapé.

              Ele tinha soltado a cauda para não sujar o miolo da difusão.
              Sem difusão, o argumento cai: o que sobra de imagem abaixo do
              card são 32 px de faixa, e ali escuro é bom — é o que faz a
              borda clara da folha aparecer contra alguma coisa em vez de
              contra mais claridade. */}
          <LinearGradient
            colors={['rgba(4,15,51,0.26)', 'rgba(4,15,51,0.30)', 'rgba(4,15,51,0.62)']}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />

          {/* A Dissolucao era desenhada aqui. Foi embora inteira — o azul
              não precisa mais acabar, porque a folha o cobre. */}

          {/* O orbe é a única marca do Companion aqui. Substitui a linha de
              nome, contagem e link que ocupava o topo: três elementos de
              interface para dizer o que uma presença diz sozinha. Tocá-lo
              abre a conversa inteira — o caminho continua existindo, só
              deixou de ocupar espaço.

              Voltou a ser esfera. Era uma onda de senóides, e as duas dizem
              "há uma inteligência aqui" — mas sugerem coisas diferentes: a
              onda é sinal em trânsito, algo passando; a esfera é um corpo,
              uma coisa que ESTÁ. Numa aba cuja tese é "existe alguém
              acompanhando você desde o primeiro dia", presença permanente
              comunica melhor que sinal.

              E ele deixou de ser um elemento.

              Passou por três formas. Desenhado em SVG, chegava perto e não
              chegava lá — cor calculada não tem o grão de uma peça
              renderizada, e numa forma cuja matéria É luz isso é o assunto
              inteiro. Depois virou PNG recortado do fundo por luminância,
              e o recorte apareceu: onde o halo quase acaba, o dither da
              imagem vira franja, e franja num objeto que deveria ser
              contínuo é pior que a versão desenhada.

              A saída era não recortar. O orbe agora faz parte da própria
              imagem do hero — mesma peça, mesma luz, mesma renderização —,
              então não existe borda para dar errado. É a mesma decisão que
              a aurora já tinha tomado: quando a matéria é o assunto, ela
              vem inteira.

              O que sobra aqui é só o toque, invisível, sobre onde o orbe
              está desenhado. */}
          <Pressable onPress={go('/companion')} style={({ pressed }) => [{ height: ORBE_ALTURA, opacity: pressed ? 0.85 : 1 }]} />

          {/* a pergunta solta na cor, centrada, sem moldura */}
          <Txt v="note" c={c.onHero2} style={{ textAlign: 'center' }}>
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
          {/* 80 e não 104.

              O vão grande existia para empurrar o card para baixo e deixá-lo
              entrando pelo rodapé, com a borda superior aparecendo na dobra
              — a promessa de que há mais conteúdo abaixo.

              Com a folha, essa promessa passou a ser feita por outra coisa:
              o próprio arredondamento claro subindo por cima da imagem já
              diz que a tela continua, e diz melhor, porque é uma camada
              inteira e não a aresta de um card. O vão perdeu a função e
              virou só distância.

              80 é o mesmo respiro que separa os blocos grandes no resto do
              app. Aqui ele fecha o gesto do Companion — pergunta, campo,
              chips — e abre o próximo, em vez de deixar as chips soltas no
              meio de um vazio. */}
          {destaque && (
            <Pressable onPress={perguntar(destaque.q)} style={({ pressed }) => [{ marginTop: 80, opacity: pressed ? 0.85 : 1 }]}>
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

        {/* ================= FOLHA =================

            A difusão saiu. Ela passou por quatro versões — 120 px, 300,
            420, perfil em sigmoide — e cada uma ficou melhor que a
            anterior sem nunca ficar certa. O motivo é que o problema não
            era o ajuste: era a ideia.

            Um degradê que vai do azul ao fundo tenta esconder que existe
            uma transição. E esconder é uma promessa que nenhum degradê
            cumpre, porque a tela tem borda: por mais longa e suave que
            seja a rampa, existe SEMPRE uma altura em que a coisa toda muda
            de cor de lado a lado, e o olho encontra faixa horizontal antes
            de encontrar qualquer outra coisa.

            A folha faz o contrário: assume a transição e a transforma em
            objeto. Uma superfície clara com o topo arredondado sobe por
            cima da imagem — não há mistura, há sobreposição, e o
            arredondamento diz "isto aqui é outra camada" numa forma que se
            lê de imediato e não depende de nenhum truque de alfa.

            É o que a Home já fazia. Duas telas resolvendo a mesma junção
            de dois jeitos era eu tratando como problema de arte o que era
            um padrão do app — e padrão que existe e não se usa é
            inconsistência gratuita.

            Sobe 36 px por cima do hero: sem a sobreposição, os cantos
            arredondados revelariam o próprio fundo claro atrás e o raio
            sumiria. O arredondamento só existe porque tem imagem embaixo
            dele.
            ============================================================ */}
        <View style={{
          marginHorizontal: -PAD, paddingHorizontal: PAD,
          backgroundColor: c.bg,
          borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg,
          marginTop: -SOBREPOSICAO, paddingTop: 34,
        }}>

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
        {/* Sem margem no topo: o paddingTop da folha já é o respiro, e a
            medida vive num lugar só. */}
        {outras.length > 0 && (
          <View>
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
        {/* A malha, a mesma do hero de Cuidado.

            O card era `altTo` chapado — o azul mais escuro da rampa, e
            portanto tecnicamente da marca. Mas cor chapada num app cujas
            duas superfícies escuras são pintadas lia como um retângulo
            desligado das duas: o mesmo registro de "fala do Companion" que
            a Cuidado usa, sem o material que o faz parecer isso.

            Com a malha ele passa a pertencer. O verde-água que nasce do
            cruzamento entre lima e azul é a mesma assinatura, e ela
            aparecendo aqui diz que a voz é a mesma — a inteligência do app
            fala com a mesma superfície em qualquer aba, e é a superfície
            que a identifica antes do rótulo.

            `overflow: hidden` porque a malha é absoluta e precisa ser
            recortada pelo raio; o conteúdo vai num filho, senão ele fica
            atrás do desenho. */}
        <View style={{ backgroundColor: c.altMid, borderRadius: radius.lg, marginTop: 40, overflow: 'hidden' }}>
          <Malha id="insightsEquilibrio" forca={1} escura />
          <View style={{ padding: 24 }}>
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
        </View>
      </ScrollView>
    </View>
  );
}
