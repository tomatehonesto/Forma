import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
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

   ⚠️ O NOME, E NÃO "IA". A pessoa conversa com a Morphi Intelligence, e
   é ela quem pede a permissão. A Anthropic aparece como a empresa que
   fornece a tecnologia, porque é para lá que o dado vai.

   ⚠️ FECHAR SEM PERMITIR É RECUSAR, por qualquer caminho — o "Agora não",
   o X, o toque na sombra, o voltar do Android. A folha só fecha; quem
   percebe a recusa e sai da conversa é a própria /companion, ao voltar
   ao foco sem a permissão. Assim nenhum dos quatro caminhos precisa ser
   interceptado aqui.

   ⚠️ PERMITIR GRAVA E FECHA, e a pergunta que esperava (a que veio do
   Insights, por exemplo) segue sozinha: a /companion a guarda em
   `pendente` e manda quando vê a permissão.
   ============================================================ */
export default function AceiteIa() {
  const { c } = useTheme();
  const router = useRouter();
  const update = useStore((s) => s.update);
  const [termos, setTermos] = useState(false);

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
      <View style={{ marginTop: 6, gap: 8 }}>
        <Txt v="bodyMed" style={{ fontFamily: font.bodySemi, lineHeight: 24 }}>{K().aceitePergunta}</Txt>
        <Txt v="body" c={c.tx2} style={{ lineHeight: 23 }}>{K().aceiteSub}</Txt>
      </View>

      {/* Os termos, que abrem e fecham. Fechados, a folha tem o tamanho do
          pedido; abertos, o texto inteiro, na ordem em que a pessoa
          pergunta: o que, para onde, e até onde. */}
      <View style={{ marginTop: 16, backgroundColor: c.bg1, borderRadius: radius.lg, overflow: 'hidden' }}>
        <Pressable
          onPress={() => setTermos((v) => !v)}
          accessibilityRole="button" accessibilityState={{ expanded: termos }}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <Row gap={10} style={{ paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center' }}>
            <Icon name="doc" size={16} color={c.accent} sw={1.9} />
            <Txt v="label" style={{ flex: 1 }}>{termos ? K().ocultarTermos : K().verTermos}</Txt>
            <View style={{ transform: [{ rotate: termos ? '90deg' : '0deg' }] }}>
              <Icon name="chev" size={14} color={c.tx3} sw={2} />
            </View>
          </Row>
        </Pressable>
        {termos ? (
          <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}>
            {[K().aceite1, K().aceite2, K().aceite3].map((t, i) => (
              <Row key={i} gap={12} style={{ alignItems: 'flex-start' }}>
                <Icon name={['doc', 'lock', 'info'][i]} size={15} color={c.tx3} sw={1.9} />
                <Txt v="caption" c={c.tx2} style={{ flex: 1, lineHeight: 20 }}>{t}</Txt>
              </Row>
            ))}
            <Pressable onPress={() => router.push('/documento?id=privacidade' as any)} hitSlop={8}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, alignSelf: 'flex-start' }]}>
              <Txt v="label" c={c.accent2}>{K().politica}</Txt>
            </Pressable>
          </View>
        ) : null}
      </View>
    </SheetScreen>
  );
}
