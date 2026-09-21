import React from 'react';
import { View, Pressable, ScrollView, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Txt, Row } from './kit';
import { Icon } from './Icon';
import { VidroDegrade } from './vidro';
import { useTheme } from './useTheme';
import { radius } from '../theme';

/* ⚠️ O TÍTULO ATRAVESSA O CONTEXTO, e não vira mais um parâmetro.

   A barra que colapsa mora no `TelaDeHabito`, e o título mora na
   `CapaDeHabito` — que é filha dela. Pedir o mesmo texto nos dois lugares
   faria cada uma das seis telas escrevê-lo duas vezes, e o dia em que
   alguém trocasse um só teria a barra dizendo uma coisa e a capa outra.

   A capa avisa quem é, quando monta. Uma linha nas seis telas continua
   sendo uma linha. */
const CapaCtx = React.createContext<((titulo: string) => void) | null>(null);

/* ============================================================
   A CAPA DE UM HÁBITO

   Os três hábitos que se registram todo dia — água, comida, movimento —
   passaram a abrir do mesmo jeito: a matéria do hábito em foto ocupando
   o alto da tela, o nome, quanto de quanto, a proporção em número grande
   e a ação logo ali.

   O QUE ISSO SUBSTITUI. Cada uma dessas telas abria com um titulão sobre
   fundo liso e, logo abaixo, um cartão branco com o número do dia e uma
   barrinha. A capa faz o trabalho dos dois de uma vez — e faz mais um,
   que o cartão não fazia: dá vontade. Uma tigela de atum com ovo diz
   sobre proteína uma coisa que "63 / 90 g" não diz.

   O CARTÃO DO DIA SAI JUNTO, nas telas que tinham um. Mantê-lo seria
   duas versões do mesmo dia a dez centímetros de rolagem uma da outra.

   E O RODAPÉ FIXO TAMBÉM. A ação mora na capa agora; um botão fixo
   embaixo seria a segunda porta para a mesma sala, com a de baixo mais
   chamativa que a principal. O custo é real e é aceito: rolando até o
   diário, a ação fica para trás.

   O NÚMERO GRANDE É SEMPRE A PROPORÇÃO DO DIA, e nunca a quantidade — a
   quantidade já está escrita por extenso na linha de cima, com a unidade
   e a meta. São as duas resoluções da mesma coisa, que é o que um topo
   faz: o quanto, e o quão longe.

   EM BRANCO SÓLIDO, e não translúcido. Ele nasceu a 46% de branco, para
   ficar no plano da imagem como uma marca-d'água — e a marca-d'água
   funcionava sobre a água, que é lisa, e sumia sobre a tigela de atum,
   que tem grão-de-bico claro, ovo amarelo e folha verde em cada
   centímetro. Tapar o buraco subindo a opacidade foto a foto seria
   acertar cada tela e perder a família.

   Branco inteiro lê em qualquer imagem, e a sombra difusa larga é o que
   o separa do fundo sem pintar uma caixa atrás dele. O número é o que a
   pessoa veio ver; deixá-lo meio apagado era estilo cobrando pedágio da
   informação.
   ============================================================ */
export function CapaDeHabito({ foto, titulo, linha, pct, valor, posicao, children }: {
  foto: any;
  titulo: string;
  /** "Hoje: 0,5 de 2,5 L" — a quantidade por extenso, com a meta */
  linha: string;
  /** a proporção do dia, já arredondada */
  pct?: number;
  /* ⚠️ UM NÚMERO QUE NÃO É PORCENTAGEM, para quando a tela não tem uma.

     Água, proteína e movimento têm meta, e meta vira fração: 60% é uma
     frase completa. Exame não tem meta — ninguém persegue "90% dos
     marcadores na faixa", e transformar resultado de sangue em placar é
     inventar um jogo onde há um laudo. O que aquela tela tem são duas
     contagens, e elas precisam do mesmo lugar de honra que o 60% ocupa
     aqui.

     Quem passa `valor` manda no miolo da capa e dispensa `pct`. */
  valor?: React.ReactNode;
  /* QUAL PEDAÇO DA FOTO FICA VISÍVEL. A capa é larga e as fotos são
     retratos: sobra altura, e o corte padrão tira metade de cima e
     metade de baixo. Isso serve para textura — água, comida — e não
     serve quando o assunto mora numa ponta só, como as pernas de quem
     corre. */
  posicao?: any;
  /** os atalhos, no pé da foto */
  children?: React.ReactNode;
}) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const avisar = React.useContext(CapaCtx);
  React.useEffect(() => { avisar?.(titulo); }, [avisar, titulo]);

  /* Até onde o vidro desce: a barra de voltar, o título e a linha do
     número. Abaixo disso a foto fica limpa, que é onde o número grande
     mora. */
  const alturaVidro = insets.top + 122;
  const altura = insets.top + 398;

  return (
    <View style={{ height: altura }}>
      <Image
        source={foto}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        contentFit="cover"
        contentPosition={posicao}
      />
      {/* A faixa vai além da última linha de texto: a passagem precisa de
          espaço para deixar de ser um corte. */}
      <VidroDegrade altura={alturaVidro + 120} />
      {/* Uma sombra curta e fraca só atrás do texto. O vidro escurece para
          dar MATÉRIA; esta garante a leitura do branco. */}
      <LinearGradient
        colors={['rgba(0,0,0,0.20)', 'rgba(0,0,0,0.09)', 'rgba(0,0,0,0)']}
        locations={[0, 0.6, 1]}
        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, height: alturaVidro }}
      />

      <View style={{ flex: 1, paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 46 }}>
        {/* ⚠️ O BOTÃO DE VOLTAR SAIU DAQUI, e sobrou o espaço dele.

            Ele morava dentro de uma capa de 398 px que é o primeiro filho
            do scroll — então rolar a tela levava embora a única saída
            dela. Quem descia até o fim de Exames tinha de subir tudo de
            volta só para voltar.

            Agora ele mora na barra fixa do TelaDeHabito, sempre no mesmo
            ponto da tela. O vão continua aqui para o título começar onde
            sempre começou: as seis telas não mudam de desenho, só param
            de perder a saída. */}
        <View style={{ height: 36 }} />

        <Txt v="display" c={c.onHero} style={{ marginTop: 22 }}>{titulo}</Txt>
        <Txt v="note" c={c.onHero2} style={{ marginTop: 2 }}>{linha}</Txt>

        {/* A SOMBRA DIFUSA É O QUE SEGURA O BRANCO EM QUALQUER FOTO — e
            ela não precisa saber nada sobre a imagem que está embaixo,
            que é o ponto: a escada ao sol é clara, a trilha é escura, e o
            mesmo número funciona nas duas.

            O "%" acompanha o branco do número. Ele já é menor; escurecê-lo
            também seria hierarquia demais para um símbolo de um glifo. */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          {valor ?? (
            <Txt
              v="display"
              c={c.onHero}
              style={{
                fontSize: 84, lineHeight: 92, letterSpacing: -2,
                textShadowColor: 'rgba(0,0,0,0.38)', textShadowRadius: 26,
                textShadowOffset: { width: 0, height: 2 },
              }}
            >
              {pct}
              <Txt v="display" c={c.onHero} style={{ fontSize: 40, lineHeight: 92 }}>%</Txt>
            </Txt>
          )}
        </View>

        {children ? <Row gap={8}>{children}</Row> : null}
      </View>
    </View>
  );
}

/* UM ATALHO NO PÉ DA CAPA.

   Vidro quando é um entre vários — um pedaço da própria foto desfocado,
   com um fio branco de borda —, AZUL quando é a ação principal.

   O azul é o da marca, o mesmo de todo botão do app. Ele chegou a ser
   branco, com o argumento de que branco lê sobre qualquer foto e o azul
   sumiria em metade delas. O argumento estava errado por dois motivos.

   Sumir não era o risco: o botão é uma forma cheia de 350 px por 44,
   não um fio — ele aparece sobre qualquer coisa. O risco era o oposto,
   um retângulo branco no meio da foto parecendo um pedaço de papel
   colado ali.

   E o que se perdia era a CONSTÂNCIA. Em todas as outras telas do app o
   botão de ação é azul; três telas com botão branco não viram um estilo,
   viram três exceções. */
export function AtalhoDaCapa({ titulo, sub, cheio, onPress }: {
  titulo: string; sub?: string; cheio?: boolean; onPress: () => void;
}) {
  const { c } = useTheme();
  const corpo = (
    <>
      <Txt v="caption" c={cheio ? c.accentInk : c.onHero}>{titulo}</Txt>
      {sub ? <Txt v="micro" c={cheio ? c.accentInk : c.onHero2} style={cheio ? { opacity: 0.7 } : undefined}>{sub}</Txt> : null}
    </>
  );

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
      {cheio ? (
        <View style={{
          backgroundColor: c.accent, borderRadius: radius.pill,
          alignItems: 'center', paddingVertical: sub ? 10 : 13, gap: 1,
        }}>
          {corpo}
        </View>
      ) : (
        <BlurView
          intensity={36}
          tint="light"
          style={{
            overflow: 'hidden', borderRadius: radius.pill,
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
            alignItems: 'center', paddingVertical: sub ? 9 : 12, gap: 1,
          }}
        >
          {corpo}
        </BlurView>
      )}
    </Pressable>
  );
}

/* A FOLHA que sobe por cima da foto e leva o resto da tela.

   O fundo é o `bg` de sempre, e não o branco dos cartões: os Blocos e
   Cartões que moram dentro dela precisam do fundo para continuarem
   parecendo cartões. */
export function FolhaDeHabito({ children }: { children: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={{
      backgroundColor: c.bg, marginTop: -26,
      borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
      paddingHorizontal: 16, paddingTop: 22, gap: 22,
    }}>
      {children}
    </View>
  );
}

/* A rolagem inteira de uma tela de hábito: capa, folha, e a folga de
   baixo que o aparelho pede.

   ⚠️ E UM RODAPÉ FIXO, OPCIONAL. Água, prato e movimento não têm: a ação
   delas é registrar, e registrar mora no atalho da capa, onde a pessoa
   acabou de ver o número do dia. Uma tela cuja ação NÃO nasce do número —
   importar um laudo, mandar para a equipe — não tem por que emprestar o
   pé da capa: o atalho lá em cima significa "faça isto agora, a partir
   disto que você está vendo", e não é o caso.

   É a mesma faixa da <TelaInterna>, com o mesmo fio em cima. O fio não é
   enfeite: sem ele o conteúdo parece cortado numa linha reta sem
   explicação, e um degradê no lugar dele lia como vidro embaçado. Ele
   declara que ali começa outra superfície. */
/* Quando a barra deixa de ser transparente e assume o título.

   O vidro da capa desce até `insets.top + 122` e leva o título e a linha
   dentro dele; a barra ocupa `insets.top + 48`. A diferença é o quanto
   precisa rolar para o texto da capa passar por baixo da barra — e é aí
   que ela precisa assumir, nem antes (tapando a capa inteira à toa) nem
   depois (com o título sumido e nada no lugar). */
const LIMITE = 74;

export function TelaDeHabito({ children, rodape }: {
  children: React.ReactNode;
  rodape?: React.ReactNode;
}) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [titulo, setTitulo] = React.useState('');
  const [passou, setPassou] = React.useState(false);
  const tinta = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(tinta, { toValue: passou ? 1 : 0, duration: 160, useNativeDriver: true }).start();
  }, [passou, tinta]);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + (rodape ? 150 : 28) }}
        scrollEventThrottle={16}
        onScroll={(e) => setPassou(e.nativeEvent.contentOffset.y > LIMITE)}
      >
        <CapaCtx.Provider value={setTitulo}>{children}</CapaCtx.Provider>
      </ScrollView>

      <BarraQueColapsa titulo={titulo} passou={passou} repouso="vidro" />
      {rodape ? (
        <View style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          paddingHorizontal: 16, paddingTop: 14,
          paddingBottom: (insets.bottom || 12) + 14,
          backgroundColor: c.bg, gap: 8,
          borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.line,
        }}>
          {rodape}
        </View>
      ) : null}
    </View>
  );
}

/* ============================================================
   A BARRA QUE COLAPSA

   ⚠️ ELA EXISTE O TEMPO TODO, e o que muda é o fundo. Aparecer só depois
   de rolar deixaria a tela sem saída nos primeiros pixels — e a saída é
   justamente o que ela veio resolver.

   Em repouso é invisível: só o botão, no desenho que a tela de baixo
   pede. Passando o limiar, o fundo entra, o título aparece e o botão
   troca de roupa.

   ⚠️ SÃO DOIS BOTÕES CRUZANDO, e não um mudando de cor. Animar
   backgroundColor obriga a largar o useNativeDriver, e aí a animação
   passa a disputar a thread do JS com a rolagem que a disparou — que é
   onde ela engasga. Dois desenhos empilhados trocando de opacidade rodam
   na thread nativa e custam uma View a mais.

   ⚠️ QUEM ROLA É DE FORA. A barra não conhece scroll nenhum: recebe
   `passou` pronto. É o que deixa a mesma peça servir ao TelaDeHabito, que
   tem uma capa de 398 px, e às telas de retrato, cuja foto tem outra
   altura — cada uma sabe o próprio limiar, e nenhuma precisa contar isso
   para a barra.

   ⚠️ E O `repouso` EXISTE PORQUE O QUE ESTÁ ATRÁS MUDA. Sobre a aurora de
   um hábito, vidro claro. Sobre a foto de alguém — que pode ser uma sala
   com a janela estourada —, branco chapado, o único que não some no
   claro. Sem foto, o botão normal das telas internas, e aí a troca fica
   invisível porque os dois lados são iguais: a barra continua ganhando
   fundo e título, que é o que ela veio fazer.
   ============================================================ */
export function BarraQueColapsa({ titulo, passou, repouso = 'vidro', onVoltar }: {
  titulo: string;
  /** quem rola decide; ver o comentário acima */
  passou: boolean;
  repouso?: 'vidro' | 'branco' | 'normal';
  onVoltar?: () => void;
}) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const tinta = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(tinta, { toValue: passou ? 1 : 0, duration: 160, useNativeDriver: true }).start();
  }, [passou, tinta]);

  const FUNDO: Record<string, string> = { vidro: c.onHeroLine, branco: '#FFFFFF', normal: c.bg2 };
  const TINTA: Record<string, string> = { vidro: c.onHero, branco: '#1A1D23', normal: c.tx };

  return (
    <View
      pointerEvents="box-none"
      style={{ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 20 }}
    >
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
          backgroundColor: c.bg,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: c.line,
          opacity: tinta,
        }}
      />
      <Row style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Pressable
          onPress={onVoltar ?? (() => router.back())}
          hitSlop={10}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <View style={{ width: 36, height: 36 }}>
            <Animated.View
              style={{
                position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 18,
                backgroundColor: FUNDO[repouso], alignItems: 'center', justifyContent: 'center',
                opacity: tinta.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
              }}
            >
              <Icon name="back" size={16} color={TINTA[repouso]} sw={2.2} />
            </Animated.View>
            <Animated.View
              style={{
                position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: radius.md,
                backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center',
                opacity: tinta,
              }}
            >
              <Icon name="back" size={18} color={c.tx} sw={2} />
            </Animated.View>
          </View>
        </Pressable>

        {/* O título centra na tela, com o espaçador do tamanho do botão do
            outro lado — a mesma conta do cabeçalho do companion. */}
        <Animated.View style={{ flex: 1, opacity: tinta }} pointerEvents="none">
          <Txt v="bodyMed" style={{ textAlign: 'center' }} numberOfLines={1}>{titulo}</Txt>
        </Animated.View>
        <View style={{ width: 36 }} />
      </Row>
    </View>
  );
}
