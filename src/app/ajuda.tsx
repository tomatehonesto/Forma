import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Sanfona, Cartao, Linha, Aviso } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { T } from '../textos';
import { CANAL } from '../logic/documentos';
import { escreverParaNos } from '../ui/contato';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. As oito perguntas eram uma
   constante escrita em duro logo abaixo — o caso exato. */
const K = () => T.ajuda;

/* ============================================================
   AJUDA

   Toda seção de configurações tem uma, e quase toda uma é a mesma coisa:
   oito perguntas genéricas sobre conta e senha, escritas por quem não
   conhece o aplicativo. Aqui a conta é um e-mail com código, sem senha, e as dúvidas preco
   deste app são outras — por que uma conquista sumiu, de onde saiu um
   número, por que o lembrete não tocou.

   CADA RESPOSTA É UMA REGRA DO CÓDIGO, e não uma promessa de marketing.
   "As conquistas saem dos registros" está escrito em conquistas.ts; "os
   avisos dependem da permissão do celular" está em avisos.ts. Se uma
   dessas regras mudar, a resposta aqui fica errada — e é por isso que
   cada uma delas diz ONDE a coisa acontece, com caminho para lá.

   SEM LINHA DE CONTATO, por enquanto. Um "fale com a gente" que não vai
   a lugar nenhum é a pior linha que uma tela de ajuda pode ter: ela
   aparece exatamente para quem já não conseguiu resolver sozinho. Ela
   entra quando houver canal.
   ============================================================ */

type QA = { q: string; a: string };


function Pergunta({ qa }: { qa: QA }) {
  const { c } = useTheme();
  const [aberta, setAberta] = useState(false);
  return (
    <Pressable onPress={() => setAberta((a) => !a)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
        <Row gap={10} style={{ alignItems: 'flex-start' }}>
          <Txt v="bodyMed" style={{ flex: 1, letterSpacing: -0.2 }}>{qa.q}</Txt>
          <Icon name={aberta ? 'chevup' : 'chevdown'} size={14} color={c.tx4} sw={2} />
        </Row>
        {/* A RESPOSTA SÓ APARECE ABERTA. Numa lista de oito, com a
            resposta sempre visível, ninguém acha a pergunta que veio
            fazer — e a tela vira um texto corrido com títulos. */}
        {aberta ? (
          <Txt v="caption" c={c.tx2} style={{ marginTop: 10, lineHeight: 21 }}>{qa.a}</Txt>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function Ajuda() {
  const router = useRouter();
  const go = (p: string) => () => router.push(p as any);

  return (
    <TelaInterna titulo={K().titulo}>
      <Titulao titulo={K().titulo} lead={K().lead} />

      <Bloco titulo={K().perguntasFrequentes}>
        <Sanfona>
          {K().qa.map((qa) => <Pergunta key={qa.q} qa={qa} />)}
        </Sanfona>
      </Bloco>

      {/* AS PORTAS QUE AS RESPOSTAS CITAM. Explicar onde uma coisa
          acontece e não levar até lá transforma a ajuda numa aula: quem
          leu que o lembrete depende da permissão quer ir conferir a
          permissão, e não decorar o caminho. */}
      <Bloco titulo={K().ondeResolver}>
        <Cartao>
          <Linha ic="clock" titulo={K().lembretes} sub={K().lembretesSub} onPress={go('/lembretes')} />
          <Linha ic="trend" titulo={K().integracoes} sub={K().integracoesSub} onPress={go('/integracoes')} />
          <Linha ic="lock" titulo={K().privacidade} sub={K().privacidadeSub} onPress={go('/privacidade')} />
          <Linha ic="doc" titulo={K().exportar} sub={K().exportarSub} onPress={go('/exportar')} />
        </Cartao>
      </Bloco>

      {/* ⚠️ A LINHA DE CONTATO ENTROU QUANDO HOUVE CANAL (26/09/2026): a
          caixa `contact@morphihealth.com`, que alguém lê. Antes dela, um
          "fale com a gente" iria para o vazio — a pior linha que uma
          ajuda pode ter, porque aparece para quem já não resolveu sozinho.

          O endereço vai escrito no subtítulo, e não só no toque: sem
          aplicativo de e-mail, o toque falha em silêncio, e quem não tem
          onde tocar ainda tem o que copiar. E ela fica logo acima do aviso
          de emergência, que lembra que e-mail não é canal de urgência. */}
      <Bloco titulo={K().faleConosco}>
        <Cartao>
          <Linha ic="mail" titulo={K().escreverParaNos} sub={CANAL()} onPress={() => escreverParaNos(K().emailAssunto)} />
        </Cartao>
      </Bloco>

      <Aviso
        ic="info"
        titulo={K().emergenciaTitulo}
        texto={K().emergenciaTexto}
      />

      <View />
    </TelaInterna>
  );
}
