import React from 'react';
import {
  Animated, Image, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, View, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import { FORMAS, formaDe } from '../logic/formas';
import { marcarApresentacaoVista } from '../logic/apresentacao';
import { localAtual } from '../logic/local';
import { Txt, Row } from '../ui/kit';
import { Botao } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { alfa, font } from '../theme';
import { T } from '../textos';
import { TELAS_DA_APRESENTACAO, LARGURA_DA_FOTO, ALTO_DA_FOTO } from '../ui/telasDaApresentacao';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo. */
const K = () => T.home.apresentacao;

/* ============================================================
   COMO PODEMOS AJUDAR — a apresentação de quem acabou de chegar
   (28/09/2026, pedido do dono; a regra de quando ela aparece mora em
   logic/apresentacao)

   Uma página por pilar do aplicativo, passada para o lado: em cima, um
   telefone com a TELA REAL daquela parte; embaixo, o título e uma frase.

   ⚠️ SÓ O TELEFONE, NO BRANCO (pedido do dono, depois de várias voltas):
   sem peças saltando do aparelho, sem luz nem brilho atrás. A página é o
   fundo liso, o texto e o telefone — e o telefone some embaixo no fundo,
   como quem sai do bolso.

   ⚠️ A TELA É FOTO DA TELA DE VERDADE (decisão do dono), tirada pelo
   scripts/capturar-apresentacao.mjs com o diário de exemplo, nos seis
   idiomas — e não uma tela desenhada à parte. Rode o script de novo quando
   uma dessas telas mudar. A foto é do tema claro: dentro do telefone a
   tela é sempre clara, como numa loja de aplicativos.

   ⚠️ SEM HORA, BATERIA NEM SINAL no alto do telefone (pedido do dono): só
   a ilha, que é o que faz o aparelho parecer um aparelho.

   ⚠️ VISTA É VISTA DE QUALQUER JEITO: chegar à última página, ou pular.

   A VOZ É A DO PRODUTO ("nós"). O companheiro, que fala em "eu", aparece
   aqui como um dos pilares, descrito por nós.
   ============================================================ */

type Id = 'dose' | 'estado' | 'comida' | 'evolucao' | 'consultas' | 'companheiro';
type Pilar = { id: Id; titulo: string; texto: string };

export default function Apresentacao() {
  const { c, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const injetavel = FORMAS()[formaDe(S)].injetavel;
  /* as fotos das telas reais, no idioma da vez (ver o script que as tira) */
  const fotos = TELAS_DA_APRESENTACAO[localAtual()] ?? TELAS_DA_APRESENTACAO['pt-BR'];
  /* O branco da página — no escuro, o fundo do tema. */
  const fundo = isDark ? c.bg : '#FFFFFF';
  /* ⚠️ O PAINEL: UMA COR SÓ ATRÁS DO TELEFONE (pedido do dono). Em vez de
     luz espalhada pela página, um bloco de cantos redondos no tom claro da
     cor de ação, com o telefone em cima dele e o pé do aparelho sumindo
     nessa mesma cor. O texto fica embaixo, no branco. */
  const painel = mistura(c.accent, fundo, isDark ? 0.16 : 0.09);

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

  /* ⚠️ O TEXTO MANDA NA ALTURA, E O TELEFONE FICA COM O QUE SOBRA. Com o
     telefone numa altura fixa, a frase mais longa (a dos sintomas, num
     iPhone 12) invadia a paginação. Agora a página tem a altura da rolagem,
     o texto ocupa o que precisa, e o painel do telefone estica no resto —
     o aparelho é mais alto que o painel, e o painel o corta. */
  const larguraDoTelefone = Math.round(Math.min(width * 0.62, 260));
  const [alturaDaPagina, setAlturaDaPagina] = React.useState(0);

  return (
    <View style={{ flex: 1, backgroundColor: fundo }}>
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
        onLayout={(e) => setAlturaDaPagina(e.nativeEvent.layout.height)}
      >
        {pilares.map((p, i) => {
          const faixa = [(i - 1) * width, i * width, (i + 1) * width];
          /* O telefone anda mais devagar que o texto: a página chega em duas
             camadas, e não colada no gesto. */
          const anda = (f: number) => x.interpolate({ inputRange: faixa, outputRange: [width * f, 0, -width * f], extrapolate: 'clamp' });
          const some = x.interpolate({ inputRange: faixa, outputRange: [0, 1, 0], extrapolate: 'clamp' });
          return (
            <View
              key={p.id}
              accessibilityLabel={K().pagina(i + 1, pilares.length)}
              /* cada página corta na própria borda, para nada alargar a rolagem */
              style={{ width, height: alturaDaPagina || undefined, paddingTop: insets.top + 48, overflow: 'hidden' }}
            >
              <View
                accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
                style={{
                  flex: 1, marginHorizontal: 16, borderRadius: 32, backgroundColor: painel,
                  overflow: 'hidden', alignItems: 'center', paddingTop: 28,
                }}
              >
                <Animated.View style={{ opacity: some, transform: [{ translateX: anda(0.25) }] }}>
                  <Telefone largura={larguraDoTelefone} foto={fotos[p.id]} />
                </Animated.View>
                {/* o pé do telefone some na cor do painel */}
                <LinearGradient
                  colors={[alfa(painel, 0), alfa(painel, 0.6), alfa(painel, 0.94), painel]}
                  locations={[0, 0.35, 0.7, 1]}
                  style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '46%' }}
                />
              </View>
              <Animated.View style={{
                paddingHorizontal: 32, paddingTop: 22, paddingBottom: 8, gap: 10, alignItems: 'center',
                opacity: some, transform: [{ translateX: anda(0.4) }],
              }}>
                <Txt style={{ fontFamily: font.display, fontSize: 30, lineHeight: 36, color: c.tx, textAlign: 'center' }}>{p.titulo}</Txt>
                <Txt style={{ fontFamily: font.body, fontSize: 17, lineHeight: 25, color: c.tx2, textAlign: 'center' }}>{p.texto}</Txt>
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>

      {/* o pé: os pontos e o seguir */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: insets.bottom + 20, gap: 18 }}>
        <Row gap={6} style={{ justifyContent: 'center' }}>
          {pilares.map((p, i) => (
            <View key={p.id} style={{
              width: i === pagina ? 18 : 6, height: 6, borderRadius: 3,
              backgroundColor: i === pagina ? c.tx : c.line,
            }} />
          ))}
        </Row>
        <Botao pilula label={pagina >= ultima ? K().comecar : K().continuar} onPress={seguir} />
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* O TELEFONE: moldura escura, a ilha no alto, e a FOTO da tela real
   dentro. Ele é mais alto que o painel: o painel o corta, e o degradê do
   painel apaga o pé dele (ver acima). */
const FUNDO_DA_FOTO = '#F5F6FA';

/** Uma cor sólida entre duas: `t` da primeira, o resto da segunda. */
function mistura(a: string, b: string, t: number): string {
  const n = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [n(a), n(b)];
  return '#' + x.map((v, i) => Math.round(v * t + y[i] * (1 - t)).toString(16).padStart(2, '0')).join('');
}

function Telefone({ largura, foto }: { largura: number; foto: number }) {
  const { isDark } = useTheme();
  const moldura = isDark ? '#2A2E36' : '#0E1116';
  const tela = largura - 14;
  const altura = tela * (ALTO_DA_FOTO / LARGURA_DA_FOTO) + 7;
  return (
    <View style={{ width: largura, height: altura }}>
      <View style={{
        flex: 1, borderTopLeftRadius: 44, borderTopRightRadius: 44, backgroundColor: moldura,
        padding: 7, paddingBottom: 0,
        shadowColor: '#0B1220', shadowOpacity: 0.12, shadowRadius: 24, shadowOffset: { width: 0, height: 10 },
      }}>
        <View style={{ flex: 1, borderTopLeftRadius: 37, borderTopRightRadius: 37, backgroundColor: FUNDO_DA_FOTO, overflow: 'hidden' }}>
          {/* A foto já traz, no alto, o lugar da barra de estado: a própria borda
              de cima da tela, continuada e borrada pelo script. Assim uma tela
              que abre com foto ou degradê não ganha uma faixa clara em cima. */}
          <Image source={foto} style={{ width: tela, height: tela * (ALTO_DA_FOTO / LARGURA_DA_FOTO) }} resizeMode="cover" />
          <View style={{ position: 'absolute', top: 9, alignSelf: 'center', width: 66, height: 19, borderRadius: 10, backgroundColor: moldura }} />
        </View>
      </View>
    </View>
  );
}
