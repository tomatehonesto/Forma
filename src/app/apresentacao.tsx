import React from 'react';
import {
  Animated, Easing, Image, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import { useStore } from '../logic/store';
import { FORMAS, formaDe } from '../logic/formas';
import { marcarApresentacaoVista } from '../logic/apresentacao';
import { Txt, Row } from '../ui/kit';
import { Botao } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { ManchaDeLuz, useCoresDaLuz } from '../ui/mancha';
import { useTheme } from '../ui/useTheme';
import { alfa, font } from '../theme';
import { T } from '../textos';
import { PAPEL_DO_PLANO } from './plano';
import { localAtual } from '../logic/local';
import { TELAS_DA_APRESENTACAO, LARGURA_DA_FOTO, ALTO_DA_FOTO } from '../ui/telasDaApresentacao';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo. */
const K = () => T.home.apresentacao;

/* ============================================================
   COMO PODEMOS AJUDAR — a apresentação de quem acabou de chegar
   (28/09/2026, pedido do dono; a regra de quando ela aparece mora em
   logic/apresentacao)

   Uma página por pilar do aplicativo, passada para o lado: em cima, a
   VITRINE, que ocupa metade da tela; embaixo, o título e uma frase.

   ⚠️ A VITRINE É UM TELEFONE, COM UMA PEÇA SALTANDO DELE (pedidos do dono:
   "mais destaque para as imagens", "não só componentes", "como se fosse
   um mockup mesmo" e "parece meio zona alguns"). No meio, o aparelho —
   moldura escura, ilha, barra de estado — com a tela daquela parte, que
   some embaixo no fundo da página; por cima, UMA peça maior, com mais
   sombra, passando da borda do aparelho para o lado livre. Uma só: com
   duas ou três soltas, o olho não sabia para onde ir. O telefone e a
   peça andam em velocidades diferentes quando a página passa, e a peça
   flutua devagar: é isso que dá fundo.

   ⚠️ VITRINE EM CÓDIGO, E NÃO PRINT DE TELA (decisão do dono). O print
   envelhece a cada mudança de tela, não se traduz e não segue a paleta nem
   o tema escuro. Estas se traduzem, trocam de cor com a paleta e não
   mentem sobre uma tela que mudou.

   ⚠️ E OS NÚMEROS DELAS SÃO EXEMPLO, sem o nome da pessoa: ninguém pode
   ler "−6,4 kg" como se fosse o próprio diário. Ver o catálogo.

   ⚠️ SEM PORTA PARA EXPERIMENTAR (decisão do dono): a página só apresenta.

   ⚠️ VISTA É VISTA DE QUALQUER JEITO: chegar à última página, ou pular.

   A VOZ É A DO PRODUTO ("nós"). O companheiro, que fala em "eu", aparece
   aqui como um dos pilares, descrito por nós — e dentro da vitrine dele,
   na conversa, fala como ele mesmo.
   ============================================================ */

type Id = 'dose' | 'estado' | 'comida' | 'evolucao' | 'consultas' | 'companheiro';
type Pilar = { id: Id; titulo: string; texto: string };

const REPOUSO = new Animated.Value(0);

/** A geometria da vitrine de uma página: a caixa inteira (a largura da
    tela) e a moldura no meio dela, um pouco para um lado quando as peças
    saem pelo outro. */
type Caixa = { W: number; H: number; fx: number; fy: number; fw: number; fh: number };

/* o telefone vai um pouco para o lado oposto ao da peça que salta */
const DESLOCA: Record<Id, number> = {
  dose: -34, estado: 30, comida: -30, evolucao: 30, consultas: -34, companheiro: 30,
};

export default function Apresentacao() {
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const injetavel = FORMAS()[formaDe(S)].injetavel;
  /* as fotos das telas reais, no idioma da vez (ver o script que as tira) */
  const fotos = TELAS_DA_APRESENTACAO[localAtual()] ?? TELAS_DA_APRESENTACAO['pt-BR'];

  const pilares: Pilar[] = [
    { id: 'dose', titulo: K().dose.titulo, texto: injetavel ? K().dose.texto : K().dose.textoOral },
    { id: 'estado', ...K().estado },
    { id: 'comida', ...K().comida },
    { id: 'evolucao', ...K().evolucao },
    { id: 'consultas', ...K().consultas },
    { id: 'companheiro', ...K().companheiro },
  ];
  const ultima = pilares.length - 1;

  const [pagina, setPagina] = React.useState(0);
  const rolagem = React.useRef<ScrollView>(null);
  const x = React.useRef(new Animated.Value(0)).current;

  const flutua = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const laco = Animated.loop(Animated.sequence([
      Animated.timing(flutua, { toValue: 1, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(flutua, { toValue: 0, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    laco.start();
    return () => laco.stop();
  }, []);

  const vista = () => update(marcarApresentacaoVista);
  React.useEffect(() => { if (pagina === ultima) vista(); }, [pagina]);

  const sair = () => {
    vista();
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)' as any);
  };
  const seguir = () => {
    if (pagina >= ultima) return sair();
    rolagem.current?.scrollTo({ x: (pagina + 1) * width, animated: true });
  };
  const aoRolar = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const p = Math.round(e.nativeEvent.contentOffset.x / width);
    if (p !== pagina) setPagina(Math.max(0, Math.min(ultima, p)));
  };

  /* A vitrine ocupa metade da tela: é ela o assunto da página. */
  const H = Math.round(Math.min(height * 0.53, 470));
  const fw = Math.round(Math.min(width * 0.6, 250));
  const caixaDe = (id: Id): Caixa => ({
    W: width, H, fw, fh: H - 4, fy: 4,
    fx: Math.round((width - fw) / 2 + DESLOCA[id]),
  });

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, overflow: 'hidden' }}>
      <ManchaDeLuz p={REPOUSO} largura={width} altura={height} papel={insets.top + PAPEL_DO_PLANO} viva />

      {/* o alto: o pular, que some na última página */}
      <Row style={{ position: 'absolute', top: insets.top + 10, right: 16, zIndex: 3 }}>
        {pagina < ultima ? (
          <Pressable
            onPress={sair} hitSlop={14} accessibilityRole="button"
            style={({ pressed }) => [{ paddingVertical: 6, paddingHorizontal: 8, opacity: pressed ? 0.5 : 1 }]}
          >
            <Row gap={4} style={{ alignItems: 'center' }}>
              <Txt v="label" c={c.tx2}>{K().pular}</Txt>
              <Icon name="chev" size={14} color={c.tx2} sw={2} />
            </Row>
          </Pressable>
        ) : null}
      </Row>

      <Animated.ScrollView
        ref={rolagem as any}
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x } } }], { useNativeDriver: true, listener: aoRolar })}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {pilares.map((p, i) => {
          const faixa = [(i - 1) * width, i * width, (i + 1) * width];
          /* Três velocidades: a tela devagar, as peças mais depressa, o
             texto no meio — a página chega em camadas. */
          const anda = (f: number) => x.interpolate({ inputRange: faixa, outputRange: [width * f, 0, -width * f], extrapolate: 'clamp' });
          const some = x.interpolate({ inputRange: faixa, outputRange: [0, 1, 0], extrapolate: 'clamp' });
          const caixa = caixaDe(p.id);
          return (
            <View
              key={p.id}
              accessibilityLabel={K().pagina(i + 1, pilares.length)}
              /* ⚠️ CADA PÁGINA CORTA NA PRÓPRIA BORDA: o brilho e a peça passam da
                 caixa da vitrine, e sem o corte alargavam a rolagem — a
                 paginação desalinhava e as últimas páginas ficavam em branco. */
              style={{ width, paddingTop: insets.top + 44, overflow: 'hidden' }}
            >
              <View
                accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
                style={{ width, height: H }}
              >
                <Animated.View style={{ ...ABS, opacity: some, transform: [{ translateX: anda(0.25) }] }}>
                  <Brilho caixa={caixa} />
                  <Telefone caixa={caixa} foto={fotos[p.id].tela} />
                </Animated.View>
                <Animated.View style={{
                  ...ABS, opacity: some,
                  transform: [
                    { translateX: anda(0.55) },
                    { translateY: flutua.interpolate({ inputRange: [0, 1], outputRange: [4, -4] }) },
                  ],
                }}>
                  <PecaDe id={p.id} caixa={caixa} peca={fotos[p.id].peca} />
                </Animated.View>
              </View>
              <Animated.View style={{
                paddingHorizontal: 32, marginTop: 18, gap: 10, alignItems: 'center',
                opacity: some, transform: [{ translateX: anda(0.4) }],
              }}>
                <Txt style={{ fontFamily: font.display, fontSize: 30, lineHeight: 36, color: c.tx, textAlign: 'center' }}>{p.titulo}</Txt>
                <Txt style={{ fontFamily: font.body, fontSize: 17, lineHeight: 25, color: c.tx2, textAlign: 'center' }}>{p.texto}</Txt>
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>

      {/* o pé: os pontos e o seguir, sobre a luz */}
      <View style={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20, gap: 18 }}>
        <Row gap={6} style={{ justifyContent: 'center' }}>
          {pilares.map((p, i) => (
            <View key={p.id} style={{
              width: i === pagina ? 18 : 6, height: 6, borderRadius: 3,
              backgroundColor: i === pagina ? c.tx : 'rgba(255,255,255,0.7)',
            }} />
          ))}
        </Row>
        {/* O botão claro, e não o azul: ele fica sobre a luz, e o azul sobre
            azul não se lê. */}
        <Botao pilula tom="fantasma" label={pagina >= ultima ? K().comecar : K().continuar} onPress={seguir} />
      </View>
    </View>
  );
}

const ABS = { position: 'absolute' as const, left: 0, top: 0, right: 0, bottom: 0 };

/* ------------------------------------------------------------------ */
/* O BRILHO atrás do telefone: uma mancha azul e uma verde, bem apagadas —
   as duas cores da marca (o verde é o do alcançado da paleta).

   ⚠️ ELE PASSA DA CAIXA DA VITRINE, por cima e pelos lados (pedido do
   dono: "o header está cortando a cor"). Desenhado só dentro da caixa, o
   halo terminava numa linha reta embaixo do "Pular". */
function Brilho({ caixa: k }: { caixa: Caixa }) {
  const cor = useCoresDaLuz();
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const SOBRA = 140;
  const L = k.W + 2 * SOBRA, A = k.H + 2 * SOBRA;
  const cx = (x: number) => x + SOBRA, cy = (y: number) => y + SOBRA;
  return (
    <Svg width={L} height={A} style={{ position: 'absolute', left: -SOBRA, top: -SOBRA }} pointerEvents="none">
      <Defs>
        <RadialGradient id={`${id}a`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={cor.ciano} stopOpacity={0.32} />
          <Stop offset="0.5" stopColor={cor.ciano} stopOpacity={0.14} />
          <Stop offset="1" stopColor={cor.ciano} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id={`${id}b`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={cor.verde} stopOpacity={0.3} />
          <Stop offset="0.5" stopColor={cor.verde} stopOpacity={0.12} />
          <Stop offset="1" stopColor={cor.verde} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={cx(k.fx + k.fw * 0.05)} cy={cy(k.H * 0.6)} rx={k.fw * 0.95} ry={k.H * 0.5} fill={`url(#${id}a)`} />
      <Ellipse cx={cx(k.fx + k.fw * 0.95)} cy={cy(k.H * 0.28)} rx={k.fw * 0.9} ry={k.H * 0.46} fill={`url(#${id}b)`} />
    </Svg>
  );
}

/* O TELEFONE: moldura escura, a ilha no alto, a barra de estado, e a FOTO
   da tela real dentro (scripts/capturar-apresentacao.mjs). Ele não aparece
   inteiro — some embaixo no fundo da página, como quem sai do bolso: o que
   importa é o alto da tela.

   ⚠️ A TELA DENTRO É SEMPRE CLARA, também no tema escuro: a foto é do tema
   claro, e a barra de estado acompanha a foto, e não o tema da página —
   como uma foto de tela numa loja de aplicativos. */
const FUNDO_DA_FOTO = '#F5F6FA';
const TINTA_DA_FOTO = '#000000';

function Telefone({ caixa: k, foto }: { caixa: Caixa; foto: number }) {
  const { c, isDark } = useTheme();
  const moldura = isDark ? '#2A2E36' : '#0E1116';
  const largura = k.fw - 14;
  return (
    <View style={{
      position: 'absolute', left: k.fx, top: k.fy, width: k.fw, height: k.fh,
      borderTopLeftRadius: 42, borderTopRightRadius: 42, backgroundColor: moldura,
      padding: 7, paddingBottom: 0,
      shadowColor: '#0B1220', shadowOpacity: 0.22, shadowRadius: 30, shadowOffset: { width: 0, height: 16 },
    }}>
      <View style={{ flex: 1, borderTopLeftRadius: 35, borderTopRightRadius: 35, backgroundColor: FUNDO_DA_FOTO, overflow: 'hidden' }}>
        {/* a barra de estado, com a ilha no meio */}
        <Row style={{ height: 30, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'space-between' }}>
          <Txt style={{ fontFamily: font.bodySemi, fontSize: 11, color: TINTA_DA_FOTO }}>9:41</Txt>
          <Row gap={4} style={{ alignItems: 'center' }}>
            <Row gap={1.5} style={{ alignItems: 'flex-end' }}>
              {[4, 6, 8, 10].map((h) => <View key={h} style={{ width: 2.5, height: h, borderRadius: 1, backgroundColor: TINTA_DA_FOTO }} />)}
            </Row>
            <View style={{ width: 18, height: 9, borderRadius: 2.5, borderWidth: 1, borderColor: TINTA_DA_FOTO, padding: 1 }}>
              <View style={{ flex: 1, width: '75%', borderRadius: 1, backgroundColor: TINTA_DA_FOTO }} />
            </View>
          </Row>
        </Row>
        <View style={{ position: 'absolute', top: 8, alignSelf: 'center', width: 64, height: 19, borderRadius: 10, backgroundColor: moldura }} />
        <Image source={foto} style={{ width: largura, height: largura * (ALTO_DA_FOTO / LARGURA_DA_FOTO) }} resizeMode="cover" />
      </View>
      {/* ⚠️ O PÉ SE MESCLA COM O FUNDO (pedido do dono): a metade de baixo do
          aparelho vai sumindo devagar, e o degradê passa das bordas para
          levar a sombra junto — sem isso, a sombra desenhava o contorno do
          telefone no meio do nada. */}
      <LinearGradient
        colors={[alfa(c.bg, 0), alfa(c.bg, 0.6), alfa(c.bg, 0.92), c.bg]}
        locations={[0, 0.4, 0.72, 1]}
        style={{ position: 'absolute', left: -40, right: -40, bottom: -24, height: k.fh * 0.55 + 24 }}
      />
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* A PEÇA QUE SALTA DO TELEFONE — a foto de um cartão da própria tela real
   (o script fotografa o elemento sozinho), maior, com mais sombra, passando
   da borda do aparelho para o lado livre.

   ⚠️ É DA MESMA TELA, e por isso diz o mesmo que ela: uma peça desenhada à
   parte falaria "quinta, 2 de outubro" em cima de uma tela que diz "em 3
   dias, quinta, 1 de outubro".

   ⚠️ UMA SÓ (pedido do dono: "parece meio zona alguns"). Com duas ou três
   peças soltas em volta, o olho não sabia para onde ir. */
const PECA: Record<Id, { lado: 'direita' | 'esquerda'; largura: number; topo: number }> = {
  dose: { lado: 'direita', largura: 250, topo: 0.44 },
  estado: { lado: 'esquerda', largura: 240, topo: 0.52 },
  comida: { lado: 'direita', largura: 240, topo: 0.5 },
  evolucao: { lado: 'esquerda', largura: 240, topo: 0.46 },
  consultas: { lado: 'direita', largura: 240, topo: 0.42 },
  companheiro: { lado: 'esquerda', largura: 250, topo: 0.5 },
};

function PecaDe({ id, caixa: k, peca }: { id: Id; caixa: Caixa; peca: { src: number; w: number; h: number } }) {
  const { c } = useTheme();
  const cfg = PECA[id];
  const largura = Math.min(cfg.largura, k.W - 24);
  const altura = largura * (peca.h / peca.w);
  const direita = k.fx + k.fw;
  return (
    <View style={{
      position: 'absolute', top: k.H * cfg.topo, width: largura, height: altura,
      left: cfg.lado === 'direita'
        ? Math.min(direita - largura * 0.5, k.W - largura - 12)
        : Math.max(12, k.fx - largura * 0.42),
      borderRadius: 18, backgroundColor: c.bg1,
      shadowColor: '#0B1220', shadowOpacity: 0.2, shadowRadius: 28, shadowOffset: { width: 0, height: 14 },
      elevation: 8,
    }}>
      <Image source={peca.src} style={{ width: largura, height: altura, borderRadius: 18 }} resizeMode="cover" />
    </View>
  );
}
