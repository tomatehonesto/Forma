import React, { useMemo, useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useAurora } from '../../ui/aurora';
import { useRouter, useIsFocused } from 'expo-router';
import { Image } from 'expo-image';
import { Orbe } from '../../ui/orbe';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import {
  patterns, recommendations, recoBucket, companionSuggestions, recentQuestions,
  balanceRead, balanceSeries, companionMemoria, respostaNoDia, timelineWeeks,
} from '../../logic/derive';
import { cicloQueCobre, janelaDoCiclo } from '../../logic/resumoDaSemana';
import { nf, fmtPeriodo, now } from '../../logic/time';
import { leituraDaSemana, leituraLigada, aceitouALeitura } from '../../logic/leitura';
import { semanaLida, noCalendario } from '../../logic/descobertasDaSemana';
import { enderecoDoCompanheiro, type OrigemNoEndereco } from '../../logic/perguntas';
import { Txt, Row, SectionHead, ListRow, Rolagem } from '../../ui/kit';
import { Barras } from '../../ui/charts';
import { Malha } from '../../ui/instrumentos';
import { Icon } from '../../ui/Icon';
import { useTheme } from '../../ui/useTheme';
import { useLarguraApp } from '../../ui/useLarguraApp';
import { useLightStatusBar } from '../../ui/useLightStatusBar';
import { Cascata, useEntrada } from '../../ui/cascata';
import Svg, { Defs, Ellipse, Path, RadialGradient, Rect, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import { radius, font, shadowCard, alfa, type Palette, RESPIRO_ABAS, comPaleta, dark } from '../../theme';
import { T } from '../../textos';

/* ============================================================
   INSIGHTS — a camada de interpretação.

   A Home responde "como estou hoje", a Jornada "por onde passei". Esta
   tela responde "o que isso quer dizer".

   A ordem não é arbitrária. O Morphi abre porque é a porta da
   inteligência; as descobertas vêm logo depois porque são a prova de que
   essa inteligência conhece a pessoa; os padrões explicam o comportamento;
   só então vêm as ações. Renovar receita é importante, mas é tarefa — e
   tarefa não pode competir com o que faz o produto valer a pena.

   Nada aqui decide dose ou protocolo: isso é da equipe médica.
   ============================================================ */

const PAD = 24;

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.companion.telaInsights;

/* ⚠️⚠️ A ESFERA VOLTOU, E É A MESMA DA CONVERSA (30/09/2026).

   Aqui já morou um orbe (SVG, depois PNG, depois pintado na própria
   aurora), que saiu para a estrela da IA entrar: duas marcas para a mesma
   coisa eram uma marca a menos. A esfera de pontos não repete esse erro —
   ela é a presença da Morphi Intelligence no alto da conversa, e a cada
   ciclo SE TRANSFORMA no M e no cacho de estrelas. A estrela continua
   sendo a marca; a esfera é o personagem que vira ela. Aqui e na
   conversa, o mesmo desenho (ui/orbe).

   ⚠️ SEMPRE NO MODO ESCURO, E COM AS CORES DO ESCURO. O topo desta tela é
   aurora com véu, escuro nos dois temas; os pontos do modo claro (tinta
   sobre papel) somem nele. A paleta escolhida vale igual.

   ⚠️ SÓ DESENHA COM A ABA EM FOCO. As abas ficam montadas; o orbe é um
   shader que roda a cada quadro, e fora da vista seria bateria gasta à
   toa. Fora de foco, o lugar fica reservado, do mesmo tamanho. */
const MARCA_ALTURA = 136;
const ORBE_TAMANHO = 124;
/* ⚠️ A SOMBRA ATRÁS DA ESFERA (30/09/2026). A aurora tem regiões claras
   perto do topo, e os pontos da esfera são finos: sem nada entre os dois,
   ela se perdia no fundo. Uma mancha escura e larga, na cor do véu, que
   some antes da borda — escurece o fundo sem desenhar um disco. É daqui e
   não do shader: na conversa o fundo já é liso e não precisa. */
const SOMBRA_TAMANHO = 250;

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

/* A ONDA mudou para ui/instrumentos. Ela é a presença do Morphi,
   e o Morphi tem tela propria — peça que aparece em dois lugares
   nao mora dentro de um deles. */

export default function Insights() {
  const aurora = useAurora();
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const orbe = useMemo(() => comPaleta(dark, (S as any).paleta, true), [(S as any).paleta]);
  const focada = useIsFocused();
  /* A entrada da aba, uma vez por sessão — ver ui/cascata. */
  const entrada = useEntrada('insights');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const width = useLarguraApp();
  useLightStatusBar();

  const go = (to: string) => () => router.push(to as any);
  /* A origem vai no endereço — ver logic/perguntas: sem ela, a pergunta é
     uma sugestão nossa; digitada no campo, é da pessoa; e uma recente
     tocada de novo herda a da vez anterior. */
  const perguntar = (q: string, origem?: OrigemNoEndereco) => () =>
    router.push(enderecoDoCompanheiro(q, origem) as any);

  const [tudo, setTudo] = useState(false);

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

  /* O resumo da semana que acabou de fechar, se já saiu. */
  const leituraPronta = leituraDaSemana(S, semanaLida(now()).de);
  /* ⚠️ O NOME DA SEMANA É O DA TELA QUE A LINHA ABRE: a semana do topo da
     Jornada (app/leitura) — "Semana 10 · 27 set a 3 out", e não as datas
     de segunda a domingo da leitura, que a tela mostra como "Leitura de".
     Sem ciclo semanal, as da leitura. */
  const semanasDaJornada = useMemo(() => timelineWeeks(S), [S]);
  const cicloDoResumo = cicloQueCobre(semanasDaJornada, semanaLida(now()).de) ? semanasDaJornada[0] : null;
  const nomeDoResumo = leituraPronta
    ? (cicloDoResumo
      ? (() => { const j = janelaDoCiclo(semanasDaJornada, cicloDoResumo); return `${T.home.telaSemana.semanaN(cicloDoResumo.semana)} · ${fmtPeriodo(new Date(j.ini), new Date(j.ultimoDia))}`; })()
      : fmtPeriodo(new Date(leituraPronta.semana), new Date(noCalendario(leituraPronta.semana, 6))))
    : null;
  /* Os primeiros registros: um check-in respondido, uma segunda pesagem
     ou uma segunda aplicação. A pesagem e a dose do cadastro não contam —
     são o formulário, e não o diário. */
  const comRegistros = S.checkins.some(respostaNoDia) || S.weights.length >= 2 || S.injections.length >= 2;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Rolagem showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: RESPIRO_ABAS, paddingHorizontal: PAD }}>

        {/* ============================================================
            O MORPHI ABRE A TELA

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
          {/* ⚠️ A AURORA É O PALCO, E O QUE MORA NELA CHEGA (02/10/2026, fase 1
              de docs/superpowers/specs/2026-10-02-motion-design.md). A
              imagem e o véu (em `absoluteFill`, que a cascata deixa parados)
              não se mexem — subindo, descobririam uma faixa clara no alto
              da tela. A esfera, a pergunta, o campo, as perguntas prontas e
              a descoberta entram um depois do outro, e a folha continua a
              fila. Uma vez por sessão — ver ui/cascata. */}
          <Cascata entrada={entrada}>
          {/* A aurora entra como imagem: o degradê que eu havia construído em
              paradas de cor chegava perto, mas cor calculada não tem grão nem
              a irregularidade de luz que uma peça pintada tem. Desde
              27/09/2026 ela não é mais a da Home: é a "nuvem", uma das
              auroras que o dono mandou para as telas deixarem de repetir a
              mesma (ver ui/aurora). */}
          <Image
            source={aurora.nuvem}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            /* Ancorada no topo, e agora por um motivo mais simples do que o
               antigo: sem orbe desenhado na peça, não há nada que precise
               cair num lugar exato. Fica no topo porque é lá que a aurora
               é mais bonita, e o corte acontece embaixo, onde ela já
               escureceu. */
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
              contra mais claridade.

              ⚠️ E AGORA PESA NO TOPO (30/09/2026). Com a esfera lá em
              cima, o dono quis o alto quase sem aurora — escuro, para a
              esfera ser a única luz — e os desenhos da imagem só da metade
              para baixo, atrás do campo e do card. O véu começa quase
              opaco e abre por volta de 60% da altura. */}
          <LinearGradient
            colors={[alfa(c.veu, 0.94), alfa(c.veu, 0.86), alfa(c.veu, 0.3), alfa(c.veu, 0.45)]}
            locations={[0, 0.28, 0.62, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          {/* A Dissolucao era desenhada aqui. Foi embora inteira — o azul
              não precisa mais acabar, porque a folha o cobre. */}

          {/* A ESFERA É A PRESENÇA DA IA AQUI, e substitui a linha de nome,
              contagem e link que já ocupou este topo: três elementos de
              interface para dizer o que uma presença diz sozinha.

              Tocá-la abre a conversa inteira — o caminho continua onde
              estava, e agora quem o abre é o mesmo símbolo que assina as
              respostas do outro lado — a esfera vira essa estrela a cada
              ciclo. Ver o comentário da constante lá em cima. */}
          <Pressable
            onPress={go('/companion?nova=1')}
            style={({ pressed }) => [{
              height: MARCA_ALTURA, alignItems: 'center', justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            }]}
          >
            <Svg
              width={SOMBRA_TAMANHO} height={SOMBRA_TAMANHO} pointerEvents="none"
              style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -SOMBRA_TAMANHO / 2, marginTop: -SOMBRA_TAMANHO / 2 }}
            >
              <Defs>
                <RadialGradient id="sombraDoOrbe" cx="50%" cy="50%" r="50%">
                  <Stop offset="0" stopColor={c.veu} stopOpacity={0.7} />
                  <Stop offset="0.42" stopColor={c.veu} stopOpacity={0.5} />
                  <Stop offset="0.72" stopColor={c.veu} stopOpacity={0.18} />
                  <Stop offset="1" stopColor={c.veu} stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Rect width={SOMBRA_TAMANHO} height={SOMBRA_TAMANHO} fill="url(#sombraDoOrbe)" />
            </Svg>
            {focada ? (
              <Orbe tamanho={ORBE_TAMANHO} claro={false} acao={orbe.accent} acao2={orbe.accent2} alcancado={orbe.lime} ciano={orbe.teal} />
            ) : <View style={{ width: ORBE_TAMANHO, height: ORBE_TAMANHO }} />}
          </Pressable>

          {/* a pergunta solta na cor, centrada, sem moldura */}
          <Txt v="note" c={c.onHero2} style={{ textAlign: 'center' }}>
            {K().ola(S.profile.name.split(' ')[0])}
          </Txt>
          {/* ⚠️ A QUEBRA VEM DO TEXTO, e não daqui. Era um {'\n'} escrito no
              meio do JSX, o que fixava em português o ponto onde a frase
              quebra; a alemã é mais longa e quebra em outro lugar. */}
          <Txt v="display" c={c.onHero} style={{ fontSize: 30, lineHeight: 37, marginTop: 4, textAlign: 'center' }}>
            {K().pergunta}
          </Txt>
          {/* a credencial voltou, agora do tamanho certo: uma linha discreta
              sob a pergunta, não uma barra de identidade no topo */}
          {/* A credencial fala em primeira pessoa e em extensão de tempo, não
              em contagem. "Leu 51 registros" é verdadeiro e soa a contador;
              "acompanho desde a primeira dose" é memória, que é o que
              faz acreditar que ele conhece ESTA pessoa. */}
          <Txt v="caption" c={c.onHero2} style={{ marginTop: 10, textAlign: 'center' }}>
            {memoria}
          </Txt>

          {/* o campo é o vidro — e fica na faixa ainda saturada do gradiente,
              porque vidro sobre branco não é vidro, é contorno.

              ⚠️ PARECE UM CAMPO, E É UMA PORTA. Escrever aqui abria o
              teclado em cima do hero, e a resposta vinha em outra tela de
              qualquer jeito. Agora o toque leva ao Morphi Intelligence com
              o campo de lá já focado: a pessoa escreve onde a conversa
              acontece. */}
          <Pressable onPress={go('/companion?escrever=1')} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1, marginTop: 24 }]}>
            <Row gap={10} style={{ backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, borderRadius: radius.pill, paddingLeft: 18, paddingRight: 6 }}>
              <Txt v="body" c={c.onHero2} numberOfLines={1} style={{ flex: 1, paddingVertical: 15, fontFamily: font.body, fontSize: 19, lineHeight: 24 }}>
                {K().escreva}
              </Txt>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.lime, alignItems: 'center', justifyContent: 'center', opacity: 0.35 }}>
                <Icon name="send" size={17} color={c.limeInk} sw={2} />
              </View>
            </Row>
          </Pressable>

          {/* Uma pergunta por linha, cada chip do tamanho do próprio texto e
              centrada. Perde o desenho de nuvem da referência, e ganha o que
              importa mais: nenhuma pergunta cortada na borda.

              Sem ícone: a pergunta já diz do que se trata, e um pictograma
              ao lado de "Como diminuir o enjoo?" não acrescenta leitura —
              só divide a atenção com o texto que faz o trabalho.

              Em vidro, como o campo: chip branca sólida virava botão e
              competia com o card branco que vem logo abaixo. Translúcida,
              ela pertence ao ambiente do Morphi. */}
          <View style={{ marginTop: 20, alignItems: 'center', gap: 8 }}>
            {chips.map(({ q, visto }) => (
              <Pressable key={q} onPress={perguntar(q, visto ? 'recente' : undefined)} style={({ pressed }) => [{ opacity: pressed ? 0.65 : 1, maxWidth: '100%' }]}>
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
              app. Aqui ele fecha o gesto do Morphi — pergunta, campo,
              chips — e abre o próximo, em vez de deixar as chips soltas no
              meio de um vazio. */}
          {destaque && (
            <Pressable onPress={perguntar(destaque.q)} style={({ pressed }) => [{ marginTop: 80, opacity: pressed ? 0.85 : 1 }]}>
              {/* Em vidro, como o campo e as chips. Opaco ele era um objeto
                  pousado sobre o azul; translúcido, pertence ao ambiente do
                  Morphi — e a descoberta É fala dele, não conteúdo da
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
                  <Txt v="micro" c={c.lime} style={{ letterSpacing: 1.2 }}>{K().descobertaDaSemana}</Txt>
                </Row>
                <Txt v="title" c={c.onHero} style={{ fontSize: 20, lineHeight: 27, marginTop: 14 }}>
                  {destaque.titulo}
                </Txt>
                <Txt v="caption" c={c.onHero2} style={{ marginTop: 9, lineHeight: 21 }}>{destaque.texto}</Txt>
                <Row gap={7} style={{ marginTop: 16 }}>
                  <Txt v="label" c={c.lime}>{K().entenderMelhor}</Txt>
                  <Icon name="chev" size={13} color={c.lime} sw={2.2} />
                </Row>
              </View>
            </Pressable>
          )}
          </Cascata>
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
        {/* A folha fica parada; os blocos dela entram depois dos do hero. */}
        <Cascata entrada={entrada} desde={7}>

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
        {/* ⚠️ A MARGEM DE CIMA SÓ EXISTE SE HOUVER SEÇÃO ANTES (30/09/2026).
            Cada seção abria com 40 de respiro, contando com outra acima;
            sem "O que mais percebi" (pouco registro), a primeira que
            sobrava somava os 40 ao paddingTop da folha, e o topo branco
            ficava com um vão. O paddingTop é o respiro da primeira. */}
        {outras.length > 0 && (
          <View>
            <SectionHead title={K().oQueMaisPercebi} />
            <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>{K().oQueMaisPercebiNota}</Txt>

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
                      <Txt v="label" c={c.accent2}>{K().verTodas(pads.length - 1)}</Txt>
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

            Sem título de seção e sem card: é o Morphi falando de novo,
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
            desligado das duas: o mesmo registro de "fala do Morphi" que
            a Cuidado usa, sem o material que o faz parecer isso.

            Com a malha ele passa a pertencer. O verde-água que nasce do
            cruzamento entre lima e azul é a mesma assinatura, e ela
            aparecendo aqui diz que a voz é a mesma — a inteligência do app
            fala com a mesma superfície em qualquer aba, e é a superfície
            que a identifica antes do rótulo.

            `overflow: hidden` porque a malha é absoluta e precisa ser
            recortada pelo raio; o conteúdo vai num filho, senão ele fica
            atrás do desenho. */}
        {/* ⚠️ SÓ QUANDO HÁ O QUE DIZER (28/09/2026, pedido do dono). Sem
            check-in respondido, o cartão abria "O que observamos" para dizer
            que ainda não tinha o que ler — um título que promete observação
            em cima de uma frase que admite não ter nenhuma. Sem leitura, ele
            não aparece; o convite para o check-in já mora nas ações. */}
        {!eq.vazia && (
        <View style={{ backgroundColor: c.altMid, borderRadius: radius.lg, marginTop: outras.length > 0 ? 40 : 0, overflow: 'hidden' }}>
          <Malha id="insightsEquilibrio" forca={1} escura />
          <View style={{ padding: 24 }}>
          <Row gap={9}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: c.lime }} />
            <Txt v="micro" c={c.lime} style={{ letterSpacing: 1.2 }}>{K().observamos}</Txt>
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
                    {eq.serieDe(serie.length)}
                  </Txt>
                  <Row gap={7} style={{ alignItems: 'baseline', marginTop: 4 }}>
                    <Txt v="h2" c={c.lime}>{serie[serie.length - 1].v}</Txt>
                    <Txt v="caption" c={c.onHero2}>{K().hojeDeCem}</Txt>
                  </Row>
                </View>
                <Barras data={serie} height={48} />
              </Row>
            </View>
          )}

          {/* botão sólido em lima, não link: aqui a IA não oferece leitura,
              propõe conversa */}
          {/* Sem leitura, o botão leva ao check-in, que é de onde ela sai. */}
          <Pressable onPress={eq.to ? go(eq.to) : perguntar(eq.q)} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1, marginTop: 22, alignSelf: 'flex-start' }]}>
            <Row gap={8} style={{ backgroundColor: c.lime, borderRadius: radius.pill, paddingHorizontal: 20, paddingVertical: 13 }}>
              <Txt v="label" c={c.limeInk}>{eq.botao}</Txt>
              <Icon name="chev" size={14} color={c.limeInk} sw={2.4} />
            </Row>
          </Pressable>
          </View>
        </View>
        )}

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
          <View style={{ marginTop: outras.length > 0 || !eq.vazia ? 40 : 0 }}>
            <SectionHead title={K().proximasAcoes} />
            <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>{K().proximasAcoesNota}</Txt>

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

        {/* ---- resumos ----
             ⚠️ VOLTOU A SER "RESUMOS", E CADA LINHA ABRE UMA TELA PRONTA
             (01/10/2026, pedido do dono). Era "Gerar resumos", e duas das
             três linhas mandavam uma pergunta para a conversa ("Analise meu
             progresso", "Prepare minha consulta") — a pessoa tocava num
             resumo e caía num chat esperando a IA escrever. Agora o nome diz
             o que está lá: o resumo da semana (app/leitura) e o documento
             para a consulta (app/resumo-medico). Perguntar continua a um
             toque, na conversa.

             ⚠️ O "PREPARO DA CONSULTA" SAIU (mesmo dia). Aberto, ele levava à
             tela de Consultas inteira — a próxima, o que levar, as que já
             foram —, e ficava ao lado do resumo para consulta como se fossem
             dois documentos. O "o que levar" continua em Consultas, na aba
             Cuidado, onde a consulta mora.

             E o resumo da semana ganhou aqui o lugar FIXO que não tinha: o
             carrossel da Home só o mostra pronto ou como convite, e girando
             entre outros. Desligado, era daqui que não havia como religar.

             A lista usa o mesmo ListRow com fio da área médica da Home: são
             o mesmo tipo de coisa, atalhos para o que está pronto, e repetir
             o padrão poupa a pessoa de aprender dois. */}
        <View style={{ marginTop: outras.length > 0 || !eq.vazia || acoes.length > 0 ? 40 : 0 }}>
          <SectionHead title={K().resumos} />
          <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>{K().resumosNota}</Txt>

          {/* ⚠️ ANTES DOS PRIMEIROS REGISTROS, ELES ESPERAM (28/09/2026,
              pedido do dono). Abertos, montavam documentos de nada — "semana
              1 · 0 check-ins", um preparo de consulta sem peso nem sintoma.
              Ficam na lista, porque dizem o que o app vai fazer, mas sem
              toque e com o aviso de quando passam a existir.

              ⚠️ O RESUMO DA SEMANA SÓ EXISTE COM O SERVIDOR DA LEITURA
              (logic/leitura, leituraLigada) — sem ele, a linha some, como
              some o convite da Home. */}
          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 16, padding: 16, opacity: comRegistros ? 1 : 0.55 }}>
            {leituraLigada() ? (
              <>
                <ListRow ic="spark" title={K().resumoDaSemana}
                  sub={!comRegistros ? K().disponivelDepois
                    : nomeDoResumo ? K().resumoDaSemanaPronto(nomeDoResumo)
                      /* o mesmo estado em que /leitura mostra "desligado" */
                      : !aceitouALeitura(S) ? K().resumoDaSemanaDesligado
                        : K().resumoDaSemanaToda}
                  onPress={comRegistros ? go('/leitura') : undefined} />
                <View style={{ height: 1, backgroundColor: c.line, marginVertical: 12 }} />
              </>
            ) : null}
            <ListRow ic="doc" title={K().documento}
              sub={comRegistros ? K().documentoSub : K().disponivelDepois}
              onPress={comRegistros ? go('/resumo-medico') : undefined} />
          </View>
        </View>

        {/* O bloco de leituras morava aqui. A tela fecha nos resumos: o que
            ela faz é observar, interpretar e organizar — sugerir artigo é
            outro serviço, e ele diluía o último gesto da página. libraryPicks
            segue em derive.ts, servindo a Biblioteca. */}
        </Cascata>
        </View>
      </Rolagem>
    </View>
  );
}
