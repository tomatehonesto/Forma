import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { registrarAceiteDaLeitura, registrarRecusaDaLeitura } from '../logic/leitura';
import { Txt, SheetScreen } from '../ui/kit';
import { Botao } from '../ui/internas';
import { TermosDoAceite } from '../ui/termosDoAceite';
import { useTheme } from '../ui/useTheme';
import { font } from '../theme';
import { T } from '../textos';

const K = () => T.descobertas.semana;

/* ============================================================
   O ACEITE DA LEITURA DA SEMANA — a folha por cima da Home

   O card "Sua semana" abre esta folha. É um consentimento próprio, e não
   o da conversa: a leitura manda um resumo dos registros para fora sem a
   pessoa ter perguntado nada — outra finalidade (LGPD, art. 11, I). Ver
   docs/superpowers/specs/2026-10-01-leitura-da-semana-design.md.

   Curta por fora (a pergunta), completa por dentro (os termos), como o
   aceite da conversa (app/aceite-ia).

   ⚠️ "AGORA NÃO" É UMA RESPOSTA, E O X NÃO É. O botão grava a recusa e o
   card some por 4 semanas (logic/leitura); fechar pelo X, pela sombra ou
   pelo voltar só fecha, e o card continua perguntando.
   ============================================================ */
export default function AceiteLeitura() {
  const { c } = useTheme();
  const router = useRouter();
  const update = useStore((s) => s.update);

  return (
    <SheetScreen
      titulo={K().aceiteTitulo}
      onClose={() => router.back()}
      rodape={(
        <View style={{ gap: 8 }}>
          <Botao label={K().aceitar} onPress={() => { update((s: any) => { registrarAceiteDaLeitura(s); }); router.back(); }} />
          <Botao label={K().recusar} tom="fantasma" onPress={() => { update((s: any) => { registrarRecusaDaLeitura(s); }); router.back(); }} />
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
