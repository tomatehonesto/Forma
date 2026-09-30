import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { registrarAceiteDaConversa } from '../logic/conversa';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { Botao } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { T } from '../textos';

const K = () => T.companion.telaConversa;

/* ============================================================
   O TERMO DE USO DA IA — a folha que abre por cima da conversa

   A conversa do Morphi Intelligence (/companion) abre esta folha na
   primeira visita, e enquanto o aceite não existir. A conversa fica
   visível atrás, sem campo: é o termo que decide se ela liga.

   ⚠️ FECHAR SEM ACEITAR É RECUSAR, por qualquer caminho — o "Agora não",
   o X, o toque na sombra, o voltar do Android. A folha só fecha; quem
   percebe a recusa e sai da conversa é a própria /companion, ao voltar
   ao foco sem o aceite. Assim nenhum dos quatro caminhos precisa ser
   interceptado aqui.

   ⚠️ ACEITAR GRAVA E FECHA, e a pergunta que esperava (a que veio do
   Insights, por exemplo) segue sozinha: a /companion a guarda em
   `pendente` e manda quando vê o aceite.
   ============================================================ */
export default function AceiteIa() {
  const { c } = useTheme();
  const router = useRouter();
  const update = useStore((s) => s.update);

  const aceitar = () => {
    update((s: any) => { registrarAceiteDaConversa(s); });
    router.back();
  };

  return (
    <SheetScreen
      titulo={K().aceiteTitulo}
      onClose={() => router.back()}
      rodape={(
        <View style={{ gap: 8 }}>
          <Botao label={K().aceitar} onPress={aceitar} />
          <Botao label={K().recusar} tom="fantasma" onPress={() => router.back()} />
          <Txt v="micro" c={c.tx4} style={{ textAlign: 'center', marginTop: 2 }}>{K().aceiteRodape}</Txt>
        </View>
      )}
    >
      <View style={{ marginTop: 6, gap: 14 }}>
        <Txt v="micro" c={c.accent} style={{ letterSpacing: 0.6, textTransform: 'uppercase' }}>{K().aceiteRotulo}</Txt>
        {[K().aceite1, K().aceite2, K().aceite3].map((t, i) => (
          <Row key={i} gap={12} style={{ alignItems: 'flex-start' }}>
            <Icon name={['doc', 'lock', 'info'][i]} size={17} color={c.accent} sw={1.9} />
            <Txt v="body" c={c.tx2} style={{ flex: 1, lineHeight: 23 }}>{t}</Txt>
          </Row>
        ))}
        <Pressable onPress={() => router.push('/documento?id=privacidade' as any)} hitSlop={8}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, alignSelf: 'flex-start' }]}>
          <Txt v="label" c={c.accent2}>{K().politica}</Txt>
        </Pressable>
      </View>
    </SheetScreen>
  );
}
