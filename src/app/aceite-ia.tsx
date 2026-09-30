import React, { useRef, useState } from 'react';
import { View, Pressable, Animated, LayoutAnimation, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { registrarAceiteDaConversa } from '../logic/conversa';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { Botao } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius, font } from '../theme';
import { T } from '../textos';

const K = () => T.companion.telaConversa;

/* ============================================================
   O TERMO DE USO DA MORPHI INTELLIGENCE — a folha por cima da conversa

   A conversa (/companion) abre esta folha na primeira visita, e enquanto
   a permissão não existir. A conversa fica visível atrás, sem campo: é a
   permissão que decide se ela liga.

   ⚠️ CURTA POR FORA, COMPLETA POR DENTRO. Por fora vai só o pedido — a
   Morphi Intelligence pode consultar os seus dados de saúde para ajudar?
   —, que é a decisão que a pessoa toma. O que ela consulta, por onde
   passa e os limites ficam nos termos, que abrem num toque. Estão todos
   ali antes do "Permitir": o termo encurtou na tela, e não no conteúdo.

   ⚠️ SEM PROMESSA DO QUE A CONVERSA FARIA. Uma frase aqui dizia "assim
   ela responde sobre você, e não de um jeito genérico" — mas sem a
   permissão não há conversa nenhuma, genérica ou não, e a frase sugeria
   uma alternativa que não existe.

   ⚠️ O NOME, E NÃO "IA". A pessoa conversa com a Morphi Intelligence, e
   é ela quem pede a permissão. A Anthropic aparece como a empresa que
   fornece a tecnologia, porque é para lá que o dado vai.

   ⚠️ FECHAR SEM PERMITIR É RECUSAR, por qualquer caminho — o "Agora não",
   o X, o toque na sombra, o voltar do Android. A folha só fecha; quem
   percebe a recusa e sai da conversa é a própria /companion, ao voltar
   ao foco sem a permissão.

   ⚠️ PERMITIR GRAVA E FECHA, e a pergunta que esperava (a que veio do
   Insights, por exemplo) segue sozinha: a /companion a guarda em
   `pendente` e manda quando vê a permissão.
   ============================================================ */
export default function AceiteIa() {
  const { c } = useTheme();
  const router = useRouter();
  const update = useStore((s) => s.update);

  const permitir = () => {
    update((s: any) => { registrarAceiteDaConversa(s); });
    router.back();
  };

  return (
    <SheetScreen
      titulo={K().aceiteTitulo}
      onClose={() => router.back()}
      rodape={(
        <View style={{ gap: 8 }}>
          <Botao label={K().aceitar} onPress={permitir} />
          <Botao label={K().recusar} tom="fantasma" onPress={() => router.back()} />
          <Txt v="micro" c={c.tx4} style={{ textAlign: 'center', marginTop: 2 }}>{K().aceiteRodape}</Txt>
        </View>
      )}
    >
      <Txt v="bodyMed" style={{ fontFamily: font.bodySemi, lineHeight: 25, marginTop: 6 }}>{K().aceitePergunta}</Txt>
      <Termos />
    </SheetScreen>
  );
}

/* ============================================================
   OS TERMOS, QUE ABREM E FECHAM

   O cabeçalho diz o que tem dentro antes de abrir ("o que ela consulta,
   por onde passa e os limites"): um "ver mais" sem conteúdo anunciado
   pede um toque às cegas. Dentro, cada termo tem título e texto, na
   ordem em que a pessoa pergunta — o quê, para onde, até onde —, e a
   Política fecha a lista.

   A abertura anima a altura (LayoutAnimation) e a seta gira junto; no
   navegador a altura só troca, sem animar, e está tudo bem.
   ============================================================ */
function Termos() {
  const { c } = useTheme();
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const giro = useRef(new Animated.Value(0)).current;

  const alternar = () => {
    LayoutAnimation.configureNext(LayoutAnimation.create(220, 'easeInEaseOut', 'opacity'));
    Animated.timing(giro, { toValue: aberto ? 0 : 1, duration: 220, useNativeDriver: true }).start();
    setAberto((v) => !v);
  };
  const seta = giro.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '270deg'] });

  const itens: [string, string][] = [
    [K().aceite1Titulo, K().aceite1],
    [K().aceite2Titulo, K().aceite2],
    [K().aceite3Titulo, K().aceite3],
  ];

  return (
    <View style={{
      marginTop: 18, borderRadius: radius.lg, overflow: 'hidden',
      backgroundColor: c.bg1, borderWidth: StyleSheet.hairlineWidth, borderColor: c.line,
    }}>
      <Pressable
        onPress={alternar}
        accessibilityRole="button" accessibilityState={{ expanded: aberto }}
        style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
      >
        <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center' }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Txt v="label" style={{ fontFamily: font.bodySemi }}>{K().termosTitulo}</Txt>
            <Txt v="caption" c={c.tx3}>{K().termosResumo}</Txt>
          </View>
          <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View style={{ transform: [{ rotate: seta }] }}>
              <Icon name="chev" size={13} color={c.tx2} sw={2.2} />
            </Animated.View>
          </View>
        </Row>
      </Pressable>

      {aberto ? (
        <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.line, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16, gap: 14 }}>
          {itens.map(([titulo, texto]) => (
            <View key={titulo} style={{ gap: 3 }}>
              <Txt v="label" style={{ fontFamily: font.bodySemi }}>{titulo}</Txt>
              <Txt v="caption" c={c.tx2} style={{ lineHeight: 20 }}>{texto}</Txt>
            </View>
          ))}
          <Pressable onPress={() => router.push('/documento?id=privacidade' as any)} hitSlop={8}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, alignSelf: 'flex-start' }]}>
            <Row gap={6} style={{ alignItems: 'center' }}>
              <Txt v="label" c={c.accent2}>{K().politica}</Txt>
              <Icon name="chev" size={12} color={c.accent2} sw={2.2} />
            </Row>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
