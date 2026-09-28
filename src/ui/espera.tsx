import React from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

/* ============================================================
   AS PEÇAS DA ESPERA — o que a espera do plano (app/cadastro) e a volta
   de quem entra numa conta (app/conta) têm em comum: a frase da vez com
   o brilho passando, e a roda que vira visto.
   ============================================================ */

/* a fase da vez: maior que as que passaram */
export const FASE_ATIVA = { fontSize: 30, lineHeight: 36 };

/* ------------------------------------------------------------------ */
/* O BRILHO NO TEXTO — a luz que atravessa a fase da vez.

   É o efeito do fim do vídeo de referência do dono: uma faixa mais clara
   passa pela frase da esquerda para a direita, sem parar, enquanto ela
   está acontecendo.

   ⚠️ SEM MÁSCARA, DE PROPÓSITO. O MaskedView não recorta na web — ele
   desenha a máscara (ver ui/vidro) —, e o brilho precisa aparecer igual
   nos dois. Então são três janelas estreitas, uma dentro da outra, que
   correm por cima do texto; cada uma mostra a MESMA frase, na mesma
   largura e no mesmo lugar, numa tinta mais clara, e as três somadas
   fazem a borda suave. A frase de dentro anda ao contrário da janela, e
   por isso fica parada enquanto a janela passa. */
const FAIXAS_DO_BRILHO = [{ larg: 110, op: 0.3 }, { larg: 64, op: 0.45 }, { larg: 26, op: 0.6 }];

export function BrilhoNoTexto({ texto, estilo, cor }: {
  texto: string;
  estilo: { fontSize: number; lineHeight: number; fontFamily: string };
  cor: string;
}) {
  const [largura, setLargura] = React.useState(0);
  const x = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const laco = Animated.loop(Animated.sequence([
      Animated.timing(x, { toValue: 1, duration: 1150, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.delay(180),
    ]));
    laco.start();
    return () => laco.stop();
  }, []);
  const centro = x.interpolate({ inputRange: [0, 1], outputRange: [-70, largura + 70] });
  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      onLayout={(e) => setLargura(e.nativeEvent.layout.width)}
    >
      {largura > 0 ? FAIXAS_DO_BRILHO.map((f) => {
        const esquerda = Animated.subtract(centro, f.larg / 2);
        return (
          <Animated.View
            key={f.larg}
            style={{
              position: 'absolute', top: 0, bottom: 0, left: 0, width: f.larg, overflow: 'hidden',
              transform: [{ translateX: esquerda }],
            }}
          >
            <Animated.Text
              style={{
                ...estilo, color: cor, opacity: f.op,
                position: 'absolute', left: 0, top: 0, width: largura,
                transform: [{ translateX: Animated.multiply(esquerda, -1) }],
              }}
            >
              {texto}
            </Animated.Text>
          </Animated.View>
        );
      }) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* A RODA QUE VIRA VISTO — o carregador da espera do plano.

   Um arco de um quarto de volta girando enquanto a espera anda. Quando
   ela acaba, o arco para de girar e cresce até fechar o círculo, e o visto
   se desenha dentro dele — o mesmo traço que girava é o que conclui.
   Desenhado em SVG, e não o `ActivityIndicator` do sistema, porque é o
   traço que se transforma: um carregador pronto só sabe sumir. */
const RODA = 32;
const RAIO = 13;
const VOLTA = 2 * Math.PI * RAIO;
const VISTO = 17;             // o comprimento do traço do visto, com folga

export function RodaQueViraVisto({ pronto, cor }: { pronto: boolean; cor: string }) {
  const giro = React.useRef(new Animated.Value(0)).current;
  const arco = React.useRef(new Animated.Value(0)).current;   // 0 = um quarto, 1 = o círculo
  const visto = React.useRef(new Animated.Value(0)).current;
  const laco = React.useRef<Animated.CompositeAnimation | null>(null);
  /* O arco e o visto chegam ao desenho pelo estado, e não por componente
     animado do SVG: na web, esse repassa ao DOM uma propriedade que só
     existe no nativo. São seiscentos milissegundos, uma vez só. */
  const [fechou, setFechou] = React.useState(0);
  const [desenhou, setDesenhou] = React.useState(0);
  React.useEffect(() => {
    const a = arco.addListener(({ value }) => setFechou(value));
    const b = visto.addListener(({ value }) => setDesenhou(value));
    return () => { arco.removeListener(a); visto.removeListener(b); };
  }, []);

  React.useEffect(() => {
    laco.current = Animated.loop(Animated.timing(giro, {
      toValue: 1, duration: 850, easing: Easing.linear, useNativeDriver: true,
    }));
    laco.current.start();
    return () => laco.current?.stop();
  }, []);

  React.useEffect(() => {
    if (!pronto) return;
    laco.current?.stop();
    Animated.sequence([
      Animated.timing(arco, { toValue: 1, duration: 360, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(visto, { toValue: 1, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
  }, [pronto]);

  return (
    <View style={{ width: RODA, height: RODA }}>
      <Animated.View style={{
        position: 'absolute', width: RODA, height: RODA,
        transform: [{ rotate: giro.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
      }}>
        <Svg width={RODA} height={RODA}>
          <Circle
            cx={RODA / 2} cy={RODA / 2} r={RAIO}
            stroke={cor} strokeWidth={2.5} fill="none" strokeLinecap="round"
            strokeDasharray={`${VOLTA} ${VOLTA}`}
            strokeDashoffset={VOLTA * 0.72 * (1 - fechou)}
          />
        </Svg>
      </Animated.View>
      <Svg width={RODA} height={RODA} style={{ position: 'absolute' }}>
        <Path
          d="M10.5 16.5 L14.5 20.5 L21.5 12.5"
          stroke={cor} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={`${VISTO} ${VISTO}`}
          strokeDashoffset={VISTO * (1 - desenhou)}
        />
      </Svg>
    </View>
  );
}
