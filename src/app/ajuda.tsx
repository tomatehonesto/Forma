import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Sanfona, Cartao, Linha, Aviso } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   AJUDA

   Toda seção de configurações tem uma, e quase toda uma é a mesma coisa:
   oito perguntas genéricas sobre conta e senha, escritas por quem não
   conhece o aplicativo. Aqui não há conta nem senha, e as dúvidas reais
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

/* As perguntas vêm na ordem em que aparecem na vida de alguém: primeiro
   a desconfiança com os números, depois o que fazer com eles, e por
   último o que acontece com os dados. */
const PERGUNTAS: QA[] = [
  {
    q: 'De onde saem os números que o app mostra?',
    a: 'Todos eles são contas feitas em cima do que você registrou — peso, aplicações, check-ins, refeições, exames. O aplicativo não completa o que faltou nem estima o que você não disse: dia sem resposta aparece como dia sem resposta, e não como zero.',
  },
  {
    q: 'Posso corrigir ou apagar um registro?',
    a: 'Pode, e no lugar onde ele aparece. Pesagens e medidas se apagam no detalhe do marcador; refeições e treinos, abrindo o registro no diário do dia. O que você apagar some das contas na hora — inclusive dos gráficos e do resumo para o médico.',
  },
  {
    q: 'Por que uma conquista desapareceu?',
    a: 'Porque ela nunca foi guardada. As conquistas são contadas dos seus registros toda vez que a tela abre, e não marcadas como feitas em algum lugar. Se o registro que fechou um nível for apagado, o nível sai junto — ele deixou de ter acontecido.',
  },
  {
    q: 'Marquei um lembrete e ele não tocou.',
    a: 'Quem toca é o celular, e ele só toca com permissão. Se os avisos estiverem negados para o Morphi nos ajustes do sistema, os seus alertas continuam guardados aqui e nada soa. A tela de Lembretes mostra quando é esse o caso e leva à permissão.',
  },
  {
    q: 'O meu peso pode vir da balança sozinho?',
    a: 'Se a sua balança, relógio ou anel escrevem no Apple Saúde (iPhone) ou no Health Connect (Android), sim — o app lê de lá. Ele lê só o peso, e só lê: nunca escreve nada nesses aplicativos. Garmin, Fitbit, Withings, Oura e Whoop chegam por esse caminho.',
  },
  {
    q: 'O que a minha equipe consegue ver?',
    a: 'Só o que você enviar. Nada sai daqui sozinho: o resumo vai quando você toca em enviar, as mensagens quando você escreve. O que fica de fora continua sendo seu, inclusive de quem te acompanha.',
  },
  {
    q: 'O aplicativo substitui a orientação de quem me acompanha?',
    a: 'Não, e em nenhuma tela. O que ele faz é organizar o que aconteceu e mostrar padrões nos seus próprios registros — dose, sintoma e conduta são conversa de consulta. Quando um texto do app toca nesses assuntos, ele diz isso junto.',
  },
  {
    q: 'E se eu desinstalar o aplicativo?',
    a: 'Os seus registros moram no aparelho, dentro do aplicativo — sem conta e sem servidor. Desinstalar leva tudo junto, e não há cópia em lugar nenhum de onde recuperar. Antes disso, dá para montar um arquivo com o que você registrou, em Exportar.',
  },
];

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
    <TelaInterna titulo="Ajuda">
      <Titulao
        titulo="Ajuda"
        lead="As dúvidas que este aplicativo costuma provocar, respondidas pelo que ele de fato faz."
      />

      <Bloco titulo="Perguntas frequentes">
        <Sanfona>
          {PERGUNTAS.map((qa) => <Pergunta key={qa.q} qa={qa} />)}
        </Sanfona>
      </Bloco>

      {/* AS PORTAS QUE AS RESPOSTAS CITAM. Explicar onde uma coisa
          acontece e não levar até lá transforma a ajuda numa aula: quem
          leu que o lembrete depende da permissão quer ir conferir a
          permissão, e não decorar o caminho. */}
      <Bloco titulo="Onde resolver">
        <Cartao>
          <Linha ic="clock" titulo="Lembretes"
            sub="Criar, editar e conferir a permissão de avisos" onPress={go('/lembretes')} />
          <Linha ic="trend" titulo="Dispositivos e integrações"
            sub="Ligar o Apple Saúde ou o Health Connect" onPress={go('/integracoes')} />
          <Linha ic="lock" titulo="Privacidade e dados"
            sub="O que fica no aparelho e o que sai dele" onPress={go('/privacidade')} />
          <Linha ic="doc" titulo="Exportar seus dados"
            sub="Montar um arquivo com o que você registrou" onPress={go('/exportar')} />
        </Cartao>
      </Bloco>

      <Aviso
        ic="info"
        titulo="Em caso de sintoma grave"
        texto="Esta tela é sobre o aplicativo. Se alguma coisa no seu corpo pede atenção agora, procure a sua equipe ou um serviço de emergência — não espere a próxima consulta."
      />

      <View />
    </TelaInterna>
  );
}
