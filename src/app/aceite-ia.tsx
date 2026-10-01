import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { registrarAceiteDaConversa } from '../logic/conversa';
import { Txt, SheetScreen } from '../ui/kit';
import { TermosDoAceite } from '../ui/termosDoAceite';
import { Botao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { font } from '../theme';
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
      <TermosDoAceite
        titulo={K().termosTitulo} resumo={K().termosResumo} politica={K().politica}
        itens={[[K().aceite1Titulo, K().aceite1], [K().aceite2Titulo, K().aceite2], [K().aceite3Titulo, K().aceite3]]}
      />
    </SheetScreen>
  );
}
