import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { checkinToday, streak } from '../logic/derive';
import { startOfDay, now } from '../logic/time';
import { ENERGIA, SONO, HUMOR, SINTOMAS, paraTela } from '../logic/escalas';
import { leituraDoDia, niveisDoRegistro, diasAnteriores } from '../logic/leituras';
import { Txt, Row } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { Aviso, Botao, Selo } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   CHECK-IN CONCLUÍDO

   O check-in terminava em nada: a pessoa respondia dez campos e caía na
   Jornada, sem ninguém dizer que o dia tinha entrado. Um formulário que
   se fecha sozinho ensina que responder não muda coisa alguma.

   Esta tela fecha o gesto com as três coisas que ela produziu:

     · a confirmação — o dia está registrado
     · o STREAK subindo, animado. O número é o mesmo de sempre, mas vê-lo
       virar é o que transforma um registro em sequência. Quem edita um
       dia já respondido vê o número parado: não houve festa, e fingir que
       houve estragaria as que são de verdade.
     · o que ficou gravado, em palavras — não os números da régua, as
       legendas que a pessoa escolheu. É o recibo do que ela disse.
     · a LEITURA do dia, quando existe: a mesma combinação ou persistência
       que o formulário mostraria, vinda de logic/leituras para as duas
       chegarem à mesma conclusão sobre o mesmo dia.

   Sem leitura, a tela não inventa uma. Dia sem nada a apontar é uma boa
   notícia que não precisa de frase.
   ============================================================ */

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
  const pulo = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(entrada, { toValue: 1, friction: 6, tension: 90, useNativeDriver: true }).start();
    if (!subiu) return;
    const t = setTimeout(() => {
      setN(atual);
      Animated.sequence([
        Animated.timing(pulo, { toValue: 1.22, duration: 140, useNativeDriver: true }),
        Animated.spring(pulo, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
    }, 520);
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

  const leitura = registro
    ? leituraDoDia(diasAnteriores(S.checkins as any[], +startOfDay(now())), niveisDoRegistro(registro))
    : null;

  const sair = () => router.replace('/(tabs)/jornada' as any);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: PAD,
          paddingTop: insets.top + 48,
          paddingBottom: 170,
          gap: 28,
        }}
      >
        {/* O selo de feito. Entra crescendo porque é a resposta ao toque
            que acabou de acontecer — parado, seria só um ícone. */}
        <View style={{ alignItems: 'center', gap: 20 }}>
          <Animated.View
            style={{
              opacity: entrada,
              transform: [{ scale: entrada }],
              width: 78, height: 78, borderRadius: 39,
              backgroundColor: c.okBg, alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name="check" size={34} color={c.ok} sw={2.4} />
          </Animated.View>

          <Txt v="h1" style={{ textAlign: 'center', letterSpacing: -0.4 }}>Check-in concluído</Txt>
        </View>

        {/* A sequência. O número é o herói da tela, então fica sozinho na
            sua linha, no tamanho que os números grandes têm no app. */}
        <View style={{ alignItems: 'center', gap: 12 }}>
          <Row gap={12} style={{ alignItems: 'center' }}>
            <Animated.View style={{ transform: [{ scale: pulo }] }}>
              <Txt v="hero" c={c.accent}>{n}</Txt>
            </Animated.View>
            <Txt v="title" c={c.tx2} style={{ maxWidth: 130 }}>
              {n === 1 ? 'dia seguido de check-in' : 'dias seguidos de check-in'}
            </Txt>
          </Row>

          {marco ? <Selo label={marco} tom="lima" /> : null}
        </View>

        {/* O recibo. Em palavras e não em números: quem respondeu escolheu
            "Com disposição", não "4". */}
        <View style={{ backgroundColor: c.bg1, borderRadius: radius.card, paddingHorizontal: PAD, paddingVertical: 4 }}>
          {recibo.map(([rotulo, valor], i) => (
            <View key={rotulo}>
              {i > 0 ? <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.line }} /> : null}
              <Row gap={12} style={{ paddingVertical: 13, alignItems: 'flex-start' }}>
                <Txt v="caption" c={c.tx3} style={{ width: 78 }}>{rotulo}</Txt>
                <Txt v="caption" style={{ flex: 1, textAlign: 'right' }}>{valor}</Txt>
              </Row>
            </View>
          ))}
        </View>

        {leitura ? (
          <Aviso destaque ic="aura" titulo={leitura.titulo} texto={leitura.texto} acao={leitura.acao} />
        ) : null}
      </ScrollView>

      <View style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        paddingHorizontal: PAD, paddingTop: 14,
        paddingBottom: (insets.bottom || 12) + 14,
        backgroundColor: c.bg,
        borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.line,
      }}>
        <Botao label="Ver minha jornada" onPress={sair} />
      </View>
    </View>
  );
}
