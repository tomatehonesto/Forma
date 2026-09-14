import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, Animated, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { checkinToday, streak } from '../logic/derive';
import { startOfDay, now } from '../logic/time';
import { ENERGIA, SONO, HUMOR, SINTOMAS, paraTela } from '../logic/escalas';
import { lembretesDoDia, niveisDoRegistro, diasAnteriores } from '../logic/leituras';
import { Txt, Row } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   CHECK-IN CONCLUÍDO

   O check-in terminava em nada: a pessoa respondia dez campos e caía na
   Jornada, sem ninguém dizer que o dia tinha entrado. Um formulário que
   se fecha sozinho ensina que responder não muda coisa alguma.

   Esta é a única tela do app inteiramente sobre a aurora. As abas usam o
   fundo escuro no topo e sobem a folha branca por cima; aqui não sobe
   nada — porque esta tela não tem conteúdo para administrar, ela tem um
   momento para marcar, e o momento dura quinze segundos. É a diferença
   entre um recibo e uma comemoração.

   O que ela mostra, nessa ordem:

     · o selo de feito, em lima, entrando crescendo
     · o STREAK subindo, animado. O número é o mesmo de sempre, mas vê-lo
       virar é o que transforma um registro em sequência. Quem edita um
       dia já respondido vê o número parado: não houve festa, e fingir que
       houve estragaria as que são de verdade.
     · o que ficou gravado, em palavras — não os números da régua, as
       legendas que a pessoa escolheu
     · NÃO SE ESQUEÇA: tudo que o dia pediu de ação, junto. No formulário
       cada aviso vive grudado no seu campo e some quando uma combinação
       toma a frente; aqui eles se juntam, porque a pessoa já respondeu e
       o que resta é levar embora o que fazer.

   Sem nada a lembrar, a tela não inventa. Dia sem aviso é boa notícia, e
   boa notícia não precisa de frase.
   ============================================================ */

const AURORA = require('../../assets/images/aurora-hero.png');
const PAD = 16;

/* Marcos de sequência. Não são conquistas do app — são só os números em
   que faz sentido parar e dizer em voz alta. Só aparecem no dia em que o
   streak chega neles, nunca depois. */
const MARCOS: Record<number, string> = {
  3: 'Três dias seguidos',
  7: 'Uma semana inteira',
  14: 'Duas semanas seguidas',
  21: 'Três semanas seguidas',
  30: 'Um mês de registros',
  60: 'Dois meses seguidos',
  90: 'Três meses seguidos',
};

export default function CheckinOk() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { de } = useLocalSearchParams<{ de?: string }>();

  const registro: any = checkinToday(S);
  const atual = streak(S);
  const anterior = Number(de ?? atual) || 0;
  const subiu = atual > anterior;
  const marco = subiu ? MARCOS[atual] : undefined;

  /* O número começa no de ontem e vira o de hoje meio segundo depois. O
     atraso é de propósito: a pessoa precisa ver o número velho antes para
     a troca significar alguma coisa. */
  const [n, setN] = useState(subiu ? anterior : atual);
  const entrada = useRef(new Animated.Value(0)).current;
  const sobe = useRef(new Animated.Value(0)).current;
  const pulo = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(90, [
      Animated.spring(entrada, { toValue: 1, friction: 6, tension: 90, useNativeDriver: true }),
      Animated.timing(sobe, { toValue: 1, duration: 380, useNativeDriver: true }),
    ]).start();

    if (!subiu) return;
    const t = setTimeout(() => {
      setN(atual);
      Animated.sequence([
        Animated.timing(pulo, { toValue: 1.24, duration: 140, useNativeDriver: true }),
        Animated.spring(pulo, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
    }, 560);
    return () => clearTimeout(t);
  }, []);

  /* O recibo em palavras. Cada linha só existe se foi respondida — a tela
     confirma o que a pessoa disse, e campo em branco não virou resposta. */
  const recibo: [string, string][] = [];
  const energia = paraTela(registro?.energia);
  if (energia) recibo.push(['Energia', ENERGIA[energia - 1]]);
  if (typeof registro?.sono === 'number' && registro.sono >= 5 && registro.sono <= 9) {
    recibo.push(['Sono', SONO[registro.sono - 5]]);
  }
  if (typeof registro?.mood === 'number' && registro.mood >= 1 && registro.mood <= 5) {
    recibo.push(['Humor', HUMOR[registro.mood - 1]]);
  }

  /* Os sintomas, pelo nome. Cada um tem a sua prova de existência: coluna
     própria, entrada no mapa `sint`, `gut` fora do normal ou texto livre. */
  const sintomas = SINTOMAS.filter((x) => {
    if (x.id === 'intestino') return !!registro?.gut && registro.gut !== 'normal';
    if (x.id === 'outro') return !!String(registro?.outroTexto || '').trim();
    if (x.store) return (registro?.[x.store] ?? 0) > 0;
    return (registro?.sint?.[x.id] ?? 0) > 0;
  }).map((x) => x.label);
  recibo.push(['Sintomas', sintomas.length ? sintomas.join(', ') : 'Nenhum hoje']);

  const lembretes = registro
    ? lembretesDoDia(diasAnteriores(S.checkins as any[], +startOfDay(now())), niveisDoRegistro(registro))
    : [];

  const sair = () => router.replace('/(tabs)/jornada' as any);

  /* Sobem juntos, com um atraso depois do selo: o conteúdo entra atrás da
     confirmação, não ao lado dela. */
  const subindo = {
    opacity: sobe,
    transform: [{ translateY: sobe.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.altTo }}>
      {/* A aurora parada. Na Home ela deriva devagar, e ali o movimento é
          ambiente; aqui o que se move é o número, e duas coisas em
          movimento disputam o mesmo olhar. */}
      <Image source={AURORA} style={StyleSheet.absoluteFill} contentFit="cover" />

      {/* Véu mais pesado embaixo, onde ficam o recibo em vidro e a faixa
          do botão — a aurora tem regiões claras, e vidro sobre claro não
          é vidro, é contorno. */}
      <LinearGradient
        colors={['rgba(3,10,38,0.42)', 'rgba(3,10,38,0.54)', 'rgba(3,10,38,0.88)']}
        locations={[0, 0.38, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: PAD,
          paddingTop: insets.top + 52,
          paddingBottom: 180,
          gap: 30,
        }}
      >
        <View style={{ alignItems: 'center', gap: 22 }}>
          {/* O selo em lima, que é a cor que o app reserva para o que foi
              conquistado. Entra crescendo porque é resposta ao toque que
              acabou de acontecer — parado, seria só um ícone. */}
          <Animated.View
            style={{
              opacity: entrada,
              transform: [{ scale: entrada }],
              width: 84, height: 84, borderRadius: 42,
              backgroundColor: c.lime, alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name="check" size={38} color={c.limeInk} sw={2.6} />
          </Animated.View>

          <Animated.View style={[subindo, { alignItems: 'center', gap: 16 }]}>
            <Txt v="display" c={c.onHero} style={{ textAlign: 'center', letterSpacing: -0.6 }}>
              Check-in concluído
            </Txt>

            {/* A sequência. O número é o herói da tela e fica em lima, do
                tamanho dos números grandes do app. */}
            <Row gap={12} style={{ alignItems: 'center' }}>
              <Animated.View style={{ transform: [{ scale: pulo }] }}>
                <Txt v="hero" c={c.lime}>{n}</Txt>
              </Animated.View>
              <Txt v="title" c={c.onHero2} style={{ maxWidth: 132 }}>
                {n === 1 ? 'dia seguido de check-in' : 'dias seguidos de check-in'}
              </Txt>
            </Row>

            {marco ? (
              <View style={{
                backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine,
                borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 6,
              }}>
                <Txt v="tag" c={c.onHero}>{marco}</Txt>
              </View>
            ) : null}
          </Animated.View>
        </View>

        {/* O recibo, em vidro. Em palavras e não em números: quem
            respondeu escolheu "Com disposição", não "4". */}
        <Animated.View style={[subindo, {
          backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine,
          borderRadius: radius.lg, paddingHorizontal: PAD, paddingVertical: 4,
        }]}>
          {recibo.map(([rotulo, valor], i) => (
            <View key={rotulo}>
              {i > 0 ? <View style={{ height: 1, backgroundColor: c.onHeroLine }} /> : null}
              <Row gap={12} style={{ paddingVertical: 13, alignItems: 'flex-start' }}>
                <Txt v="caption" c={c.onHero2} style={{ width: 78 }}>{rotulo}</Txt>
                <Txt v="caption" c={c.onHero} style={{ flex: 1, textAlign: 'right' }}>{valor}</Txt>
              </Row>
            </View>
          ))}
        </Animated.View>

        {lembretes.length ? (
          <Animated.View style={[subindo, { gap: 10 }]}>
            <Row gap={10} style={{ paddingHorizontal: 2 }}>
              <Txt v="micro" c={c.lime} style={{ letterSpacing: 1.2 }}>NÃO SE ESQUEÇA</Txt>
              <View style={{ flex: 1, height: 1, backgroundColor: c.onHeroLine }} />
            </Row>

            {lembretes.map((l) => (
              <View
                key={l.titulo}
                style={{
                  backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine,
                  borderRadius: radius.lg, padding: PAD, gap: 5,
                }}
              >
                <Row gap={8} style={{ alignItems: 'flex-start' }}>
                  <View style={{ marginTop: 2 }}>
                    <Icon name="aura" size={15} color={c.lime} sw={2} />
                  </View>
                  <Txt v="label" c={c.onHero} style={{ flex: 1 }}>{l.titulo}</Txt>
                </Row>
                <Txt v="tag" c={c.onHero2}>{l.texto}</Txt>
                <View style={{ gap: 3, marginTop: 3 }}>
                  <Txt v="micro" c={c.lime} style={{ letterSpacing: 1 }}>O QUE FAZER</Txt>
                  <Txt v="tag" c={c.onHero}>{l.acao}</Txt>
                </View>
              </View>
            ))}
          </Animated.View>
        ) : null}
      </ScrollView>

      {/* A faixa do botão não tem fundo próprio: o véu já escureceu a base
          da aurora, e uma barra chapada ali cortaria a imagem em duas. */}
      <View style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        paddingHorizontal: PAD, paddingTop: 16,
        paddingBottom: (insets.bottom || 12) + 16,
      }}>
        <LinearGradient
          colors={['rgba(3,10,38,0)', 'rgba(3,10,38,0.92)']}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {/* Em lima, como o "Fazer check-in" da Home: é o mesmo par de
            cores fechando o que aquele botão abriu. */}
        <Pressable onPress={sair} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
          <View style={{ backgroundColor: c.lime, borderRadius: radius.pill, paddingVertical: 16, alignItems: 'center' }}>
            <Txt v="bodyMed" c={c.limeInk}>Ver minha jornada</Txt>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
