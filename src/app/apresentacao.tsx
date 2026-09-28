import React from 'react';
import {
  Animated, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, View, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { FORMAS, formaDe } from '../logic/formas';
import { marcarApresentacaoVista } from '../logic/apresentacao';
import { Txt, Row } from '../ui/kit';
import { Botao } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { ManchaDeLuz } from '../ui/mancha';
import { useTheme } from '../ui/useTheme';
import { font } from '../theme';
import { T } from '../textos';
import { PAPEL_DO_PLANO } from './plano';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo. */
const K = () => T.home.apresentacao;

/* ============================================================
   COMO PODEMOS AJUDAR — a apresentação de quem acabou de chegar
   (28/09/2026, pedido do dono; a regra de quando ela aparece mora em
   logic/apresentacao)

   Uma página por pilar do aplicativo, passada para o lado: o que é, numa
   frase, e uma porta para experimentar ali mesmo. O fundo é a luz em
   repouso da espera do plano (ui/mancha), derivando devagar — a mesma
   língua do primeiro contato inteiro.

   ⚠️ VISTA É VISTA DE QUALQUER JEITO: chegar à última página, fechar, ou
   sair por uma das portas. Quem saiu para experimentar já entendeu o que
   a apresentação queria dizer, e o destaque da Home não precisa insistir.

   ⚠️ A PORTA TROCA A TELA (`replace`), e não empilha: voltar da tela
   experimentada leva para a Home, e não de volta à apresentação.

   A VOZ É A DO PRODUTO ("nós"). O companheiro, que fala em "eu", aparece
   aqui como um dos pilares, descrito por nós. Ver a nota das duas vozes.
   ============================================================ */

type Pilar = { id: string; ic: string; titulo: string; texto: string; cta: string; to: string };

const REPOUSO = new Animated.Value(0);

export default function Apresentacao() {
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const injetavel = FORMAS()[formaDe(S)].injetavel;

  const pilares: Pilar[] = [
    { id: 'dose', ic: injetavel ? 'syringe' : 'pill', titulo: K().dose.titulo,
      texto: injetavel ? K().dose.texto : K().dose.textoOral, cta: K().dose.cta, to: '/aplicacao' },
    { id: 'estado', ic: 'mood', ...K().estado, to: '/checkin' },
    { id: 'comida', ic: 'soup', ...K().comida, to: '/medir-refeicao' },
    { id: 'evolucao', ic: 'chart', ...K().evolucao, to: '/metas' },
    { id: 'consultas', ic: 'doc', ...K().consultas, to: '/resumo-medico' },
    { id: 'companheiro', ic: 'spark', ...K().companheiro, to: '/companion' },
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
  const experimentar = (to: string) => { vista(); router.replace(to as any); };
  const seguir = () => {
    if (pagina >= ultima) return sair();
    rolagem.current?.scrollTo({ x: (pagina + 1) * width, animated: true });
  };
  const aoRolar = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const p = Math.round(e.nativeEvent.contentOffset.x / width);
    if (p !== pagina) setPagina(Math.max(0, Math.min(ultima, p)));
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, overflow: 'hidden' }}>
      <ManchaDeLuz p={REPOUSO} largura={width} altura={height} papel={insets.top + PAPEL_DO_PLANO} viva />

      {/* o alto: o chapéu e o fechar */}
      <Row style={{
        position: 'absolute', top: insets.top + 12, left: 24, right: 16, zIndex: 2,
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1.2 }}>{K().chapeu}</Txt>
        <Pressable
          onPress={sair} hitSlop={14} accessibilityRole="button" accessibilityLabel={K().fechar}
          style={({ pressed }) => [{ padding: 6, opacity: pressed ? 0.5 : 1 }]}
        >
          <Icon name="x" size={22} color={c.tx2} sw={2} />
        </Pressable>
      </Row>

      <Animated.ScrollView
        ref={rolagem as any}
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x } } }], { useNativeDriver: true, listener: aoRolar })}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {pilares.map((p, i) => {
          /* O texto entra deslizando um pouco mais devagar que a página: a
             palavra chega logo depois do gesto, e não colada nele. */
          const desliza = x.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [width * 0.25, 0, -width * 0.25],
            extrapolate: 'clamp',
          });
          const some = x.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
          });
          return (
            <View
              key={p.id}
              accessibilityLabel={K().pagina(i + 1, pilares.length)}
              style={{ width, paddingTop: insets.top + 96, paddingHorizontal: 28 }}
            >
              <Animated.View style={{ gap: 18, opacity: some, transform: [{ translateX: desliza }] }}>
                <View style={{
                  width: 56, height: 56, borderRadius: 28, backgroundColor: c.accentWeak,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={p.ic} size={26} color={c.accent} sw={2} />
                </View>
                <Txt style={{ fontFamily: font.display, fontSize: 34, lineHeight: 40, color: c.tx }}>{p.titulo}</Txt>
                <Txt style={{ fontFamily: font.body, fontSize: 19, lineHeight: 27, color: c.tx2 }}>{p.texto}</Txt>
                <Pressable
                  onPress={() => experimentar(p.to)} hitSlop={10} accessibilityRole="button"
                  style={({ pressed }) => [{ alignSelf: 'flex-start', opacity: pressed ? 0.6 : 1 }]}
                >
                  <Row gap={6} style={{ alignItems: 'center' }}>
                    <Txt v="bodyMed" c={c.accent}>{p.cta}</Txt>
                    <Icon name="chev" size={16} color={c.accent} sw={2.2} />
                  </Row>
                </Pressable>
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
        <Botao pilula tom="fantasma" label={pagina >= ultima ? K().comecar : K().proximo} onPress={seguir} />
      </View>
    </View>
  );
}
