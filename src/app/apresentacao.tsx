import React from 'react';
import {
  Animated, Easing, Image, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, View,
  useWindowDimensions, type StyleProp, type ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, LinearGradient as SvgGradiente, Path, RadialGradient, Stop } from 'react-native-svg';
import { useStore } from '../logic/store';
import { FORMAS, formaDe } from '../logic/formas';
import { marcarApresentacaoVista } from '../logic/apresentacao';
import { Txt, Row } from '../ui/kit';
import { Botao } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { ManchaDeLuz, useCoresDaLuz } from '../ui/mancha';
import { useTheme } from '../ui/useTheme';
import { font, radius } from '../theme';
import { T } from '../textos';
import { PAPEL_DO_PLANO } from './plano';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo. */
const K = () => T.home.apresentacao;
const V = () => T.home.apresentacao.vitrine;

/* ============================================================
   COMO PODEMOS AJUDAR — a apresentação de quem acabou de chegar
   (28/09/2026, pedido do dono; a regra de quando ela aparece mora em
   logic/apresentacao)

   Uma página por pilar do aplicativo, passada para o lado: em cima, uma
   VITRINE — como aquela parte é, desenhada com as peças do próprio
   aplicativo —; embaixo, o título e uma frase. O desenho segue a
   referência do dono (páginas com ilustração, "Pular" no alto, um botão
   só embaixo); a ilustração é nossa.

   ⚠️ VITRINE EM CÓDIGO, E NÃO PRINT DE TELA (decisão do dono). O print
   envelhece a cada mudança de tela, não se traduz — o texto dentro da
   imagem ficaria em português nos seis idiomas — e não segue a paleta nem
   o tema escuro. As vitrines se traduzem, trocam de cor com a paleta e
   não mentem sobre uma tela que mudou.

   ⚠️ E OS NÚMEROS DELAS SÃO EXEMPLO, sem o nome da pessoa: ninguém pode
   ler "−6,4 kg" como se fosse o próprio diário. Ver o catálogo.

   ⚠️ SEM PORTA PARA EXPERIMENTAR (decisão do dono): a página só apresenta.
   Com a vitrine, ela já mostra o que precisava; a Home está logo depois.

   ⚠️ VISTA É VISTA DE QUALQUER JEITO: chegar à última página, ou pular.

   A VOZ É A DO PRODUTO ("nós"). O companheiro, que fala em "eu", aparece
   aqui como um dos pilares, descrito por nós.
   ============================================================ */

type Pilar = { id: 'dose' | 'estado' | 'comida' | 'evolucao' | 'consultas' | 'companheiro'; titulo: string; texto: string };

const REPOUSO = new Animated.Value(0);
const ALTURA_DA_VITRINE = 300;

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

  /* As vitrines respiram: sobem e descem uns poucos pontos, devagar, para
     a página não parecer um print parado. */
  const flutua = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const laco = Animated.loop(Animated.sequence([
      Animated.timing(flutua, { toValue: 1, duration: 2600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(flutua, { toValue: 0, duration: 2600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
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

  const largura = Math.min(width - 56, 340);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, overflow: 'hidden' }}>
      <ManchaDeLuz p={REPOUSO} largura={width} altura={height} papel={insets.top + PAPEL_DO_PLANO} viva />

      {/* o alto: o pular, que some na última página */}
      <Row style={{ position: 'absolute', top: insets.top + 10, right: 16, zIndex: 2 }}>
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
          /* A vitrine anda mais devagar que a página, e o texto mais devagar
             ainda: a página chega em camadas, e não colada no gesto. */
          const vitrineAnda = x.interpolate({ inputRange: faixa, outputRange: [width * 0.35, 0, -width * 0.35], extrapolate: 'clamp' });
          const textoAnda = x.interpolate({ inputRange: faixa, outputRange: [width * 0.2, 0, -width * 0.2], extrapolate: 'clamp' });
          const some = x.interpolate({ inputRange: faixa, outputRange: [0, 1, 0], extrapolate: 'clamp' });
          return (
            <View
              key={p.id}
              accessibilityLabel={K().pagina(i + 1, pilares.length)}
              style={{ width, paddingTop: insets.top + 64, alignItems: 'center' }}
            >
              <Animated.View
                accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
                style={{
                  width: largura, height: ALTURA_DA_VITRINE, opacity: some,
                  transform: [
                    { translateX: vitrineAnda },
                    { translateY: flutua.interpolate({ inputRange: [0, 1], outputRange: [3, -3] }) },
                  ],
                }}
              >
                <Brilho largura={largura} altura={ALTURA_DA_VITRINE} />
                <Vitrine id={p.id} largura={largura} injetavel={injetavel} />
              </Animated.View>
              <Animated.View style={{
                paddingHorizontal: 32, marginTop: 28, gap: 12, alignItems: 'center',
                opacity: some, transform: [{ translateX: textoAnda }],
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

/* ------------------------------------------------------------------ */
/* O BRILHO atrás da vitrine: duas manchas da paleta, bem apagadas — é o
   halo colorido da referência, com as cores da luz do aplicativo. */
function Brilho({ largura, altura }: { largura: number; altura: number }) {
  const cor = useCoresDaLuz();
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <Svg width={largura + 80} height={altura + 60} style={{ position: 'absolute', left: -40, top: -30 }}>
      <Defs>
        <RadialGradient id={`${id}a`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={cor.ciano} stopOpacity={0.32} />
          <Stop offset="1" stopColor={cor.ciano} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id={`${id}b`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={cor.anil} stopOpacity={0.26} />
          <Stop offset="1" stopColor={cor.anil} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={(largura + 80) * 0.35} cy={(altura + 60) * 0.55} rx={(largura + 80) * 0.38} ry={(altura + 60) * 0.42} fill={`url(#${id}a)`} />
      <Ellipse cx={(largura + 80) * 0.68} cy={(altura + 60) * 0.42} rx={(largura + 80) * 0.36} ry={(altura + 60) * 0.4} fill={`url(#${id}b)`} />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* AS PEÇAS DAS VITRINES — cartões no desenho do aplicativo, com sombra
   para flutuar sobre o brilho. */
function Peca({ style, children }: { style?: StyleProp<ViewStyle>; children: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={[{
      backgroundColor: c.bg1, borderRadius: radius.lg, padding: 14,
      shadowColor: '#0B1220', shadowOpacity: 0.1, shadowRadius: 18, shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    }, style]}>
      {children}
    </View>
  );
}

function Chip({ ic, texto, style }: { ic?: string; texto: string; style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  return (
    <Row gap={6} style={[{
      alignSelf: 'flex-start', alignItems: 'center', backgroundColor: c.accentWeak,
      borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6,
    }, style]}>
      {ic ? <Icon name={ic} size={13} color={c.accent} sw={2} /> : null}
      <Txt v="micro" c={c.accent}>{texto}</Txt>
    </Row>
  );
}

function Vitrine({ id, largura: L, injetavel }: { id: Pilar['id']; largura: number; injetavel: boolean }) {
  const { c } = useTheme();
  const cor = useCoresDaLuz();

  if (id === 'dose') {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {/* a pilha: um cartão atrás, para dar fundo */}
        <Peca style={{ position: 'absolute', left: L * 0.08, right: L * 0.08, top: 58, height: 130, opacity: 0.6 }}>{null}</Peca>
        <Peca style={{ marginHorizontal: L * 0.02, gap: 10, marginTop: 20 }}>
          <Row gap={8} style={{ alignItems: 'center' }}>
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={injetavel ? 'syringe' : 'pill'} size={16} color={c.accent} sw={2} />
            </View>
            <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>{V().proxima}</Txt>
          </Row>
          <Txt style={{ fontFamily: font.display, fontSize: 22, lineHeight: 28, color: c.tx }}>{V().dia}</Txt>
          <Row gap={6} style={{ flexWrap: 'wrap' }}>
            <Chip texto={V().dose} />
            {injetavel ? <Chip ic="target" texto={V().local} /> : null}
          </Row>
        </Peca>
        <Peca style={{ position: 'absolute', right: -4, bottom: 34, paddingVertical: 10, paddingHorizontal: 12 }}>
          <Row gap={8} style={{ alignItems: 'center' }}>
            <Icon name="bell" size={15} color={c.accent} sw={2} />
            <Txt v="label" c={c.tx}>{V().lembrete}</Txt>
          </Row>
        </Peca>
      </View>
    );
  }

  if (id === 'estado') {
    const linhas: [string, number][] = [[V().energia, 4], [V().fome, 2], [V().humor, 4]];
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Peca style={{ marginRight: L * 0.12, gap: 12, marginTop: -84 }}>
          {linhas.map(([rotulo, n]) => (
            <View key={rotulo} style={{ gap: 6 }}>
              <Txt v="label" c={c.tx2}>{rotulo}</Txt>
              <Row gap={6}>
                {[1, 2, 3, 4, 5].map((k) => (
                  <View key={k} style={{
                    flex: 1, height: 8, borderRadius: 4,
                    backgroundColor: k <= n ? c.accent : c.bg2,
                  }} />
                ))}
              </Row>
            </View>
          ))}
        </Peca>
        <Peca style={{ position: 'absolute', left: L * 0.18, right: -4, bottom: -6, gap: 6 }}>
          <Row gap={6} style={{ alignItems: 'center' }}>
            <Icon name="spark" size={14} color={c.accent} sw={2} />
            <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>{V().padraoChapeu}</Txt>
          </Row>
          <Txt v="caption" c={c.tx} style={{ lineHeight: 19 }}>{V().padrao}</Txt>
        </Peca>
      </View>
    );
  }

  if (id === 'comida') {
    const R = 26;
    const volta = 2 * Math.PI * R;
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{
          width: L * 0.66, height: 210, borderRadius: radius.lg, overflow: 'hidden', marginTop: -10,
          shadowColor: '#0B1220', shadowOpacity: 0.12, shadowRadius: 18, shadowOffset: { width: 0, height: 8 },
        }}>
          <Image source={require('../../assets/images/alimentos/frango-assado.jpg')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          <View style={{ position: 'absolute', left: 10, right: 10, bottom: 10 }}>
            <Peca style={{ paddingVertical: 8, paddingHorizontal: 10, gap: 2 }}>
              <Txt v="label" c={c.tx}>{V().prato}</Txt>
              <Txt v="micro" c={c.accent}>{V().pratoProteina}</Txt>
            </Peca>
          </View>
        </View>
        <Peca style={{ position: 'absolute', right: -4, top: 18, alignItems: 'center', gap: 6, width: L * 0.36 }}>
          <Svg width={R * 2 + 10} height={R * 2 + 10}>
            <Circle cx={R + 5} cy={R + 5} r={R} stroke={c.bg2} strokeWidth={7} fill="none" />
            <Circle
              cx={R + 5} cy={R + 5} r={R} stroke={c.accent} strokeWidth={7} fill="none" strokeLinecap="round"
              strokeDasharray={`${volta} ${volta}`} strokeDashoffset={volta * (1 - 62 / 90)}
              transform={`rotate(-90 ${R + 5} ${R + 5})`}
            />
          </Svg>
          <Txt v="label" c={c.tx}>{V().proteina}</Txt>
          <Txt v="micro" c={c.tx3}>{V().proteinaValor}</Txt>
        </Peca>
        <Peca style={{ position: 'absolute', right: 6, bottom: 22, gap: 6, width: L * 0.4 }}>
          <Row gap={6} style={{ alignItems: 'center' }}>
            <Icon name="water" size={14} color={cor.ciano} sw={2} />
            <Txt v="label" c={c.tx}>{V().agua}</Txt>
          </Row>
          <View style={{ height: 8, borderRadius: 4, backgroundColor: c.bg2, overflow: 'hidden' }}>
            <View style={{ width: '56%', height: '100%', borderRadius: 4, backgroundColor: cor.ciano }} />
          </View>
          <Txt v="micro" c={c.tx3}>{V().aguaValor}</Txt>
        </Peca>
      </View>
    );
  }

  if (id === 'evolucao') {
    const w = L - 28, h = 110;
    /* uma descida com os tropeços de verdade: o peso não cai em linha reta */
    const pontos = [0, 0.08, 0.14, 0.12, 0.26, 0.33, 0.31, 0.45, 0.52, 0.6, 0.58, 0.7];
    const px = (k: number) => (k / (pontos.length - 1)) * w;
    const py = (v: number) => 10 + v * (h - 24);
    const linha = pontos.map((v, k) => `${k ? 'L' : 'M'}${px(k).toFixed(1)} ${py(v).toFixed(1)}`).join(' ');
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Peca style={{ gap: 8, marginTop: -34 }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Txt v="label" c={c.tx2}>{V().peso}</Txt>
            <Txt v="label" c={c.accent}>{V().pesoValor}</Txt>
          </Row>
          <Svg width={w} height={h}>
            <Defs>
              <SvgGradiente id="evolucaoArea" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={c.accent} stopOpacity={0.18} />
                <Stop offset="1" stopColor={c.accent} stopOpacity={0} />
              </SvgGradiente>
            </Defs>
            <Path d={`${linha} L${w} ${h} L0 ${h} Z`} fill="url(#evolucaoArea)" />
            <Path d={linha} stroke={c.accent} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
            <Circle cx={px(pontos.length - 1)} cy={py(pontos[pontos.length - 1])} r={4.5} fill={c.accent} />
          </Svg>
        </Peca>
        <Peca style={{ position: 'absolute', left: -4, bottom: 44, paddingVertical: 10, paddingHorizontal: 12 }}>
          <Row gap={8} style={{ alignItems: 'center' }}>
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: c.lime, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="check" size={12} color={c.limeInk} sw={2.6} />
            </View>
            <Txt v="label" c={c.tx}>{V().meta1}</Txt>
          </Row>
        </Peca>
        <Peca style={{ position: 'absolute', right: -4, bottom: 0, paddingVertical: 10, paddingHorizontal: 12 }}>
          <Row gap={8} style={{ alignItems: 'center' }}>
            <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: c.line }} />
            <Txt v="label" c={c.tx}>{V().meta2}</Txt>
          </Row>
        </Peca>
      </View>
    );
  }

  if (id === 'consultas') {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Peca style={{ position: 'absolute', left: L * 0.1, right: L * 0.02, top: 30, height: 200, opacity: 0.6, transform: [{ rotate: '4deg' }] }}>{null}</Peca>
        <Peca style={{ marginRight: L * 0.06, gap: 12, transform: [{ rotate: '-2deg' }] }}>
          <Row gap={8} style={{ alignItems: 'center' }}>
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="doc" size={16} color={c.accent} sw={2} />
            </View>
            <Txt v="bodyMed" c={c.tx} style={{ flex: 1 }}>{V().resumo}</Txt>
          </Row>
          {[V().r1, V().r2, V().r3].map((linha) => (
            <Row key={linha} gap={10} style={{ alignItems: 'center', borderTopWidth: 1, borderTopColor: c.line, paddingTop: 10 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent }} />
              <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>{linha}</Txt>
            </Row>
          ))}
        </Peca>
      </View>
    );
  }

  /* o companheiro: a pergunta e a resposta */
  return (
    <View style={{ flex: 1, justifyContent: 'center', gap: 14 }}>
      <View style={{
        alignSelf: 'flex-end', maxWidth: L * 0.78, backgroundColor: c.accent,
        borderRadius: 20, borderBottomRightRadius: 6, paddingHorizontal: 14, paddingVertical: 10,
      }}>
        <Txt v="body" c={c.accentInk}>{V().pergunta}</Txt>
      </View>
      <Row gap={8} style={{ alignItems: 'flex-end' }}>
        <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.bg1, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="spark" size={15} color={c.accent} sw={2} />
        </View>
        <Peca style={{ maxWidth: L * 0.78, borderBottomLeftRadius: 6, paddingVertical: 10 }}>
          <Txt v="body" c={c.tx}>{V().resposta}</Txt>
        </Peca>
      </Row>
    </View>
  );
}
