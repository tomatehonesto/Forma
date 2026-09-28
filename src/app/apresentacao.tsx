import React from 'react';
import {
  Animated, Easing, Image, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, View,
  useWindowDimensions, type StyleProp, type ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, Ellipse, LinearGradient as SvgGradiente, Path, RadialGradient, Stop } from 'react-native-svg';
import { useStore } from '../logic/store';
import { FORMAS, formaDe } from '../logic/formas';
import { marcarApresentacaoVista } from '../logic/apresentacao';
import { Txt, Row } from '../ui/kit';
import { Botao } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { ManchaDeLuz, useCoresDaLuz } from '../ui/mancha';
import { useTheme } from '../ui/useTheme';
import { alfa, font, radius } from '../theme';
import { T } from '../textos';
import { PAPEL_DO_PLANO } from './plano';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo. */
const K = () => T.home.apresentacao;
const V = () => T.home.apresentacao.vitrine;

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
              style={{ width, paddingTop: insets.top + 44 }}
            >
              <View
                accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
                style={{ width, height: H }}
              >
                <Animated.View style={{ ...ABS, opacity: some, transform: [{ translateX: anda(0.25) }] }}>
                  <Brilho caixa={caixa} />
                  <Telefone caixa={caixa}><TelaDe id={p.id} caixa={caixa} injetavel={injetavel} /></Telefone>
                </Animated.View>
                <Animated.View style={{
                  ...ABS, opacity: some,
                  transform: [
                    { translateX: anda(0.55) },
                    { translateY: flutua.interpolate({ inputRange: [0, 1], outputRange: [4, -4] }) },
                  ],
                }}>
                  <PecaDe id={p.id} caixa={caixa} injetavel={injetavel} />
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

/* O TELEFONE: moldura escura, a ilha no alto, a barra de estado, e a tela
   do aplicativo dentro. Ele não aparece inteiro — some embaixo no fundo da
   página, como quem sai do bolso: o que importa é o alto da tela. */
function Telefone({ caixa: k, children }: { caixa: Caixa; children: React.ReactNode }) {
  const { c, isDark } = useTheme();
  const moldura = isDark ? '#2A2E36' : '#0E1116';
  return (
    <View style={{
      position: 'absolute', left: k.fx, top: k.fy, width: k.fw, height: k.fh,
      borderTopLeftRadius: 42, borderTopRightRadius: 42, backgroundColor: moldura,
      padding: 7, paddingBottom: 0,
      shadowColor: '#0B1220', shadowOpacity: 0.22, shadowRadius: 30, shadowOffset: { width: 0, height: 16 },
    }}>
      <View style={{ flex: 1, borderTopLeftRadius: 35, borderTopRightRadius: 35, backgroundColor: c.bg, overflow: 'hidden' }}>
        {/* a barra de estado, com a ilha no meio */}
        <Row style={{ height: 34, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'space-between' }}>
          <Txt style={{ fontFamily: font.bodySemi, fontSize: 11, color: c.tx }}>9:41</Txt>
          <Row gap={4} style={{ alignItems: 'center' }}>
            <Row gap={1.5} style={{ alignItems: 'flex-end' }}>
              {[4, 6, 8, 10].map((h) => <View key={h} style={{ width: 2.5, height: h, borderRadius: 1, backgroundColor: c.tx }} />)}
            </Row>
            <View style={{ width: 18, height: 9, borderRadius: 2.5, borderWidth: 1, borderColor: c.tx, padding: 1 }}>
              <View style={{ flex: 1, width: '75%', borderRadius: 1, backgroundColor: c.tx }} />
            </View>
          </Row>
        </Row>
        <View style={{ position: 'absolute', top: 9, alignSelf: 'center', width: 64, height: 19, borderRadius: 10, backgroundColor: moldura }} />
        <View style={{ paddingHorizontal: 13, paddingTop: 6, gap: 9 }}>{children}</View>
      </View>
      {/* o pé some no fundo da página, telefone e tela juntos */}
      <LinearGradient
        colors={[alfa(c.bg, 0), c.bg]}
        style={{ position: 'absolute', left: -2, right: -2, bottom: 0, height: k.fh * 0.3 }}
      />
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* AS PEÇAS — o desenho do aplicativo em miniatura. */
function Peca({ style, children, saindo }: { style?: StyleProp<ViewStyle>; children?: React.ReactNode; saindo?: boolean }) {
  const { c } = useTheme();
  return (
    <View style={[{
      backgroundColor: c.bg1, borderRadius: saindo ? 20 : 14, padding: saindo ? 16 : 10,
      shadowColor: '#0B1220', shadowOpacity: saindo ? 0.18 : 0.04,
      shadowRadius: saindo ? 28 : 6, shadowOffset: { width: 0, height: saindo ? 14 : 2 },
      elevation: saindo ? 8 : 1,
    }, style]}>
      {children}
    </View>
  );
}

function Chip({ ic, texto }: { ic?: string; texto: string }) {
  const { c } = useTheme();
  return (
    <Row gap={5} style={{
      alignSelf: 'flex-start', alignItems: 'center', backgroundColor: c.accentWeak,
      borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5,
    }}>
      {ic ? <Icon name={ic} size={12} color={c.accent} sw={2} /> : null}
      <Txt v="micro" c={c.accent}>{texto}</Txt>
    </Row>
  );
}

function TituloDaTela({ children }: { children: string }) {
  const { c } = useTheme();
  return <Txt numberOfLines={1} style={{ fontFamily: font.display, fontSize: 17, lineHeight: 22, color: c.tx }}>{children}</Txt>;
}

function Miudo({ children, cor, forte }: { children: string; cor?: string; forte?: boolean }) {
  const { c } = useTheme();
  return (
    <Txt numberOfLines={1} style={{ fontFamily: forte ? font.bodySemi : font.body, fontSize: 11.5, lineHeight: 15, color: cor ?? c.tx2 }}>
      {children}
    </Txt>
  );
}

function Escala({ rotulo, n }: { rotulo: string; n: number }) {
  const { c } = useTheme();
  return (
    <View style={{ gap: 5 }}>
      <Miudo>{rotulo}</Miudo>
      <Row gap={4}>
        {[1, 2, 3, 4, 5].map((k) => (
          <View key={k} style={{ flex: 1, height: 7, borderRadius: 4, backgroundColor: k <= n ? c.accent : c.bg2 }} />
        ))}
      </Row>
    </View>
  );
}

function Anel({ frac, cor, R = 24, grossura = 7 }: { frac: number; cor: string; R?: number; grossura?: number }) {
  const { c } = useTheme();
  const volta = 2 * Math.PI * R;
  const lado = R * 2 + grossura + 2;
  return (
    <Svg width={lado} height={lado}>
      <Circle cx={lado / 2} cy={lado / 2} r={R} stroke={c.bg2} strokeWidth={grossura} fill="none" />
      <Circle
        cx={lado / 2} cy={lado / 2} r={R} stroke={cor} strokeWidth={grossura} fill="none" strokeLinecap="round"
        strokeDasharray={`${volta} ${volta}`} strokeDashoffset={volta * (1 - frac)}
        transform={`rotate(-90 ${lado / 2} ${lado / 2})`}
      />
    </Svg>
  );
}

/** Um ícone num círculo claro — o começo de toda linha de lista da casa. */
function Bolinha({ ic, tam = 26 }: { ic: string; tam?: number }) {
  const { c } = useTheme();
  return (
    <View style={{ width: tam, height: tam, borderRadius: tam / 2, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={ic} size={tam * 0.5} color={c.accent} sw={2} />
    </View>
  );
}

const FOTOS = {
  omelete: require('../../assets/images/alimentos/omelete.jpg'),
  frango: require('../../assets/images/alimentos/frango-assado.jpg'),
  iogurte: require('../../assets/images/alimentos/iogurte-granola.jpg'),
};

/* ------------------------------------------------------------------ */
/* A TELA de cada pilar, dentro do telefone. */
function TelaDe({ id, caixa: k, injetavel }: { id: Id; caixa: Caixa; injetavel: boolean }) {
  const { c } = useTheme();

  if (id === 'dose') {
    return (
      <>
        <TituloDaTela>{injetavel ? V().tDose : V().tDoseOral}</TituloDaTela>
        <Peca style={{ alignItems: 'center', gap: 3, paddingVertical: 14 }}>
          <Anel frac={5 / 7} cor={c.accent} R={30} grossura={8} />
          <Miudo cor={c.tx} forte>{V().ciclo}</Miudo>
          <Miudo>{V().cicloSub}</Miudo>
        </Peca>
        {[[V().h1d, V().h1l], [V().h2d, V().h2l]].map(([d, l]) => (
          <Peca key={d}>
            <Row gap={8} style={{ alignItems: 'center' }}>
              <Bolinha ic={injetavel ? 'syringe' : 'pill'} />
              <View style={{ flex: 1 }}>
                <Miudo cor={c.tx} forte>{d}</Miudo>
                {injetavel ? <Miudo>{l}</Miudo> : null}
              </View>
            </Row>
          </Peca>
        ))}
      </>
    );
  }

  if (id === 'estado') {
    return (
      <>
        <TituloDaTela>{V().tCheckin}</TituloDaTela>
        <Peca style={{ gap: 11 }}>
          <Escala rotulo={V().energia} n={4} />
          <Escala rotulo={V().fome} n={2} />
          <Escala rotulo={V().humor} n={4} />
          <Escala rotulo={V().sono} n={3} />
        </Peca>
      </>
    );
  }

  if (id === 'comida') {
    const linhas: [string, string, number][] = [
      [V().cafe, V().cafePrato, FOTOS.omelete],
      [V().almoco, V().prato, FOTOS.frango],
      [V().lanche, V().lanchePrato, FOTOS.iogurte],
    ];
    return (
      <>
        <TituloDaTela>{V().tComida}</TituloDaTela>
        {linhas.map(([refeicao, prato, foto]) => (
          <Peca key={refeicao} style={{ padding: 7 }}>
            <Row gap={9} style={{ alignItems: 'center' }}>
              <Image source={foto} style={{ width: 40, height: 40, borderRadius: 9 }} resizeMode="cover" />
              <View style={{ flex: 1 }}>
                <Miudo>{refeicao}</Miudo>
                <Miudo cor={c.tx} forte>{prato}</Miudo>
              </View>
            </Row>
          </Peca>
        ))}
      </>
    );
  }

  if (id === 'evolucao') {
    const w = k.fw - 14 - 26 - 20, h = 96;
    const pontos = [0, 0.08, 0.14, 0.12, 0.26, 0.33, 0.31, 0.45, 0.52, 0.6, 0.58, 0.7];
    const px = (i: number) => (i / (pontos.length - 1)) * w;
    const py = (v: number) => 8 + v * (h - 18);
    const linha = pontos.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ');
    return (
      <>
        <TituloDaTela>{V().tEvolucao}</TituloDaTela>
        <Peca style={{ gap: 5 }}>
          <Miudo>{V().peso}</Miudo>
          <Txt style={{ fontFamily: font.display, fontSize: 19, lineHeight: 23, color: c.tx }}>{V().pesoValor.split(' ').slice(0, 2).join(' ')}</Txt>
          <Svg width={w} height={h}>
            <Defs>
              <SvgGradiente id="apresentacaoArea" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={c.accent} stopOpacity={0.2} />
                <Stop offset="1" stopColor={c.accent} stopOpacity={0} />
              </SvgGradiente>
            </Defs>
            <Path d={`${linha} L${w} ${h} L0 ${h} Z`} fill="url(#apresentacaoArea)" />
            <Path d={linha} stroke={c.accent} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
            <Circle cx={px(pontos.length - 1)} cy={py(pontos[pontos.length - 1])} r={4.5} fill={c.accent} />
          </Svg>
          <Miudo>{V().periodo}</Miudo>
        </Peca>
      </>
    );
  }

  if (id === 'consultas') {
    return (
      <>
        <TituloDaTela>{V().resumo}</TituloDaTela>
        <Peca style={{ gap: 9 }}>
          {[V().r1, V().r2, V().r3, V().r4].map((linha) => (
            <Row key={linha} gap={8} style={{ alignItems: 'center' }}>
              <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: c.accent }} />
              <View style={{ flex: 1 }}><Miudo>{linha}</Miudo></View>
            </Row>
          ))}
        </Peca>
        <Peca style={{ gap: 7 }}>
          {[0.9, 0.72, 0.84, 0.5].map((f, i) => (
            <View key={i} style={{ height: 6, width: `${f * 100}%`, borderRadius: 3, backgroundColor: c.bg2 }} />
          ))}
        </Peca>
      </>
    );
  }

  /* o companheiro */
  return (
    <>
      <TituloDaTela>{V().tCompanheiro}</TituloDaTela>
      <Row gap={6} style={{ alignItems: 'flex-end' }}>
        <Bolinha ic="spark" tam={22} />
        <Peca style={{ flex: 1, borderBottomLeftRadius: 4 }}>
          <Txt style={{ fontFamily: font.body, fontSize: 11.5, lineHeight: 15, color: c.tx }}>{V().saudacao}</Txt>
        </Peca>
      </Row>
      <View style={{
        alignSelf: 'flex-end', maxWidth: '85%', backgroundColor: c.accent,
        borderRadius: 14, borderBottomRightRadius: 4, paddingHorizontal: 10, paddingVertical: 8,
      }}>
        <Txt style={{ fontFamily: font.body, fontSize: 11.5, lineHeight: 15, color: c.accentInk }}>{V().pergunta}</Txt>
      </View>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* A PEÇA QUE SALTA DO TELEFONE — uma só por página, maior, com mais
   sombra, passando da borda do aparelho para o lado da página.

   ⚠️ UMA SÓ (pedido do dono: "parece meio zona alguns"). Com duas ou três
   peças soltas em volta, o olho não sabia para onde ir; com uma, a página
   tem um assunto. */
function PecaDe({ id, caixa: k, injetavel }: { id: Id; caixa: Caixa; injetavel: boolean }) {
  const { c } = useTheme();
  const direita = k.fx + k.fw;
  /* a peça começa dentro do telefone e passa da borda do lado livre */
  const peloLado = (lado: 'direita' | 'esquerda', largura: number, topo: number): ViewStyle => ({
    position: 'absolute', top: topo, width: largura,
    ...(lado === 'direita'
      ? { left: Math.min(direita - largura * 0.55, k.W - largura - 12) }
      : { left: Math.max(12, k.fx - largura * 0.45) }),
  });

  if (id === 'dose') {
    return (
      <Peca saindo style={[peloLado('direita', 236, k.H * 0.46), { gap: 9 }]}>
        <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>{V().proxima}</Txt>
        <Txt style={{ fontFamily: font.display, fontSize: 20, lineHeight: 25, color: c.tx }}>{V().dia}</Txt>
        <Row gap={6} style={{ flexWrap: 'wrap' }}>
          <Chip texto={V().dose} />
          {injetavel ? <Chip ic="target" texto={V().local} /> : null}
        </Row>
        <Row gap={6} style={{ alignItems: 'center', borderTopWidth: 1, borderTopColor: c.line, paddingTop: 9 }}>
          <Icon name="bell" size={13} color={c.tx3} sw={2} />
          <Txt v="micro" c={c.tx3}>{V().lembrete}</Txt>
        </Row>
      </Peca>
    );
  }

  if (id === 'estado') {
    return (
      <Peca saindo style={[peloLado('esquerda', 232, k.H * 0.56), { gap: 7 }]}>
        <Row gap={6} style={{ alignItems: 'center' }}>
          <Icon name="spark" size={14} color={c.accent} sw={2} />
          <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>{V().padraoChapeu}</Txt>
        </Row>
        <Txt style={{ fontFamily: font.bodyMed, fontSize: 15, lineHeight: 21, color: c.tx }}>{V().padrao}</Txt>
      </Peca>
    );
  }

  if (id === 'comida') {
    return (
      <Peca saindo style={[peloLado('direita', 150, k.H * 0.18), { alignItems: 'center', gap: 5 }]}>
        <Anel frac={62 / 90} cor={c.accent} R={32} grossura={9} />
        <Txt v="label" c={c.tx}>{V().proteina}</Txt>
        <Txt v="micro" c={c.tx3}>{V().proteinaValor}</Txt>
      </Peca>
    );
  }

  if (id === 'evolucao') {
    return (
      <Peca saindo style={[peloLado('esquerda', 190, k.H * 0.68), { paddingVertical: 13 }]}>
        <Row gap={9} style={{ alignItems: 'center' }}>
          <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: c.lime, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={15} color={c.limeInk} sw={2.6} />
          </View>
          <Txt v="bodyMed" c={c.tx} style={{ flex: 1 }}>{V().meta1}</Txt>
        </Row>
      </Peca>
    );
  }

  if (id === 'consultas') {
    return (
      <Peca saindo style={peloLado('direita', 220, k.H * 0.54)}>
        <Row gap={10} style={{ alignItems: 'center' }}>
          <Bolinha ic="doc" tam={32} />
          <Txt style={{ flex: 1, fontFamily: font.display, fontSize: 17, lineHeight: 22, color: c.tx }}>{V().r1}</Txt>
        </Row>
      </Peca>
    );
  }

  /* o companheiro: a resposta salta da conversa */
  return (
    <Row gap={8} style={[peloLado('esquerda', Math.min(260, k.W - 24), k.H * 0.5), { alignItems: 'flex-end' }]}>
      <View style={{
        width: 34, height: 34, borderRadius: 17, backgroundColor: c.bg1, alignItems: 'center', justifyContent: 'center',
        shadowColor: '#0B1220', shadowOpacity: 0.14, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
      }}>
        <Icon name="spark" size={16} color={c.accent} sw={2} />
      </View>
      <Peca saindo style={{ flex: 1, borderBottomLeftRadius: 6 }}>
        <Txt style={{ fontFamily: font.bodyMed, fontSize: 16, lineHeight: 22, color: c.tx }}>{V().resposta}</Txt>
      </Peca>
    </Row>
  );
}
