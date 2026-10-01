import React from 'react';
import { View } from 'react-native';
import { Txt, SheetScreen } from './kit';
import { TermosDoAceite } from './termosDoAceite';
import { Botao } from './internas';
import { useTheme } from './useTheme';
import { font } from '../theme';
import { T } from '../textos';

const K = () => T.companion.telaConversa;

/* ============================================================
   A FOLHA DO ACEITE DA MORPHI INTELLIGENCE — uma só, para toda a IA

   A mesma folha em todo lugar onde a IA é usada pela primeira vez: a
   conversa e o convite do resumo da semana (app/aceite-ia), a leitura do
   laudo (app/laudo, na própria tela), a foto do prato e a estimativa pelo
   nome (que abrem app/aceite-ia antes da primeira vez). Ver
   logic/aceiteDaIa.

   ⚠️ CURTA POR FORA, COMPLETA POR DENTRO. Por fora vai só a pergunta; o
   que ela faz, o que consulta, por onde passa e os limites ficam nos
   termos, que abrem num toque — e estão todos ali antes do "Permitir".

   ⚠️ FECHAR SEM PERMITIR É RECUSAR, por qualquer caminho.
   ============================================================ */
export function FolhaDoAceiteDaIa({ onAceitar, onRecusar, onFechar }: {
  onAceitar: () => void;
  onRecusar: () => void;
  onFechar: () => void;
}) {
  const { c } = useTheme();
  return (
    <SheetScreen
      titulo={K().aceiteTitulo}
      onClose={onFechar}
      rodape={(
        <View style={{ gap: 8 }}>
          <Botao label={K().aceitar} onPress={onAceitar} />
          <Botao label={K().recusar} tom="fantasma" onPress={onRecusar} />
          <Txt v="micro" c={c.tx4} style={{ textAlign: 'center', marginTop: 2 }}>{K().aceiteRodape}</Txt>
        </View>
      )}
    >
      <Txt v="bodyMed" style={{ fontFamily: font.bodySemi, lineHeight: 25, marginTop: 6 }}>{K().aceitePergunta}</Txt>
      <TermosDoAceite
        titulo={K().termosTitulo} resumo={K().termosResumo} politica={K().politica}
        itens={[
          [K().aceite1Titulo, K().aceite1], [K().aceite2Titulo, K().aceite2],
          [K().aceite3Titulo, K().aceite3], [K().aceite4Titulo, K().aceite4],
        ]}
      />
    </SheetScreen>
  );
}
