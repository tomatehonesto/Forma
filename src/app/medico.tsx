import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { protocoloDaSemana } from '../logic/derive';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Chevron, Pill, Divider } from '../ui/kit';
import { Linha } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { fmtWD, fmtDate, relDay } from '../logic/time';
import { radius } from '../theme';

/* ============================================================
   SUA EQUIPE — o lado de lá do tratamento

   ⚠️ ELA SE CHAMAVA "MEU MÉDICO", E A PRÓPRIA TELA JÁ DISCORDAVA.

   Três linhas abaixo do título vinha "Conversa com a equipe"; o campo
   dizia "Escrever para a equipe"; e a última seção era "Equipe", com a
   endocrinologista E a nutricionista. O nome falava de uma pessoa num
   lugar que guarda uma clínica inteira — consultas, protocolos,
   prescrições, documentos, duas profissionais.

   Três coisas estavam erradas nele, e cada uma sozinha bastava:

   · "médico" nomeia UMA pessoa, e a tela tem duas na própria lista — e
     exclui a nutricionista que já estava nela, a enfermeira, o
     psicólogo, o educador físico;
   · "meu" é posse, e a relação é o contrário: quem é de quem aqui é ela
     que é paciente da clínica;
   · e ele brigava com /acompanhamento, que se chama "Quem acompanha
     você" — duas portas com nomes quase iguais é o defeito que este
     projeto passou a semana apagando.

   "Sua equipe" não escolhe uma pessoa, não presume posse e é o nome que
   a tela já usava por dentro em dois lugares. Funciona também quando a
   clínica não tem nome guardado — o que acontece com quem entrou só pelo
   código de convite.

   ⚠️ E A CONVERSA SAIU DAQUI. Ela era um card de 250 px no meio desta
   página: uma rolagem dentro de outra, o teclado por cima do que a
   pessoa escrevia, e a parte viva da relação com a clínica com o mesmo
   peso visual que a lista de documentos. Virou /conversa, tela cheia.

   O que morreu junto: o estado do campo, a referência da thread, o
   rascunho da receita e a leitura das mensagens. Zerar o contador de não
   lidas foi para lá, e é onde tem que ser — enquanto a caixa era um card,
   "lido" acontecia ao abrir uma tela que tem outras seis coisas, e a
   pessoa zerava o aviso sem nunca ter rolado até a mensagem.

   ⚠️ A ROTA CONTINUA /medico, e isso é dívida consciente: são quinze
   chamadas espalhadas, incluindo quatro dentro de derive.ts. O nome que
   a pessoa lê é o que importa, e ele mudou; o outro é endereço interno e
   troca quando alguém encostar nos quinze de uma vez.
   ============================================================ */

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Medico() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const quem = [S.profile.clinic, S.profile.doctor].filter(Boolean).join(' · ');

  /* ============================================================
     A EQUIPE VEM DO ESTADO, E VINHA DO ARQUIVO

     ⚠️ ESTAVA CRAVADA NO JSX, e errada de quatro maneiras ao mesmo tempo:

         [[S.profile.doctor, 'Endocrinologia · responsável', 'H'],
          ['Renata Alves', 'Nutrição', 'R']]

     · "Renata Alves" aparecia para TODO MUNDO — quem entrou por código de
       convite, sem clínica nenhuma guardada, via uma nutricionista que
       nunca falou com ela;
     · a equipe tem TRÊS pessoas em `S.team` — a nutricionista, a
       enfermeira e o psicólogo — e a tela mostrava uma. Duas profissionais
       existiam no estado e não existiam na tela;
     · os papéis estavam reescritos à mão e divergiam da fonte:
       "Nutrição" contra `role: 'Nutricionista'`, "Endocrinologia" contra
       `especialidade: 'Endocrinologista'`;
     · e as iniciais eram letras digitadas. Trocar "Renata" por outro nome
       deixava o "R" para trás.

     ⚠️ E NADA DISSO PRECISAVA SER INVENTADO: os dados já estavam todos no
     estado, e a aba Cuidado já os lia. Esta tela escreveu de novo, por
     fora, uma versão pior de algo que existia — que é como duas fontes
     para o mesmo fato nascem.

     ⚠️ A SEÇÃO SOME QUANDO NÃO HÁ EQUIPE, e isso é o oposto do defeito
     antigo: quem tem vínculo mas nenhum nome guardado não vê uma lista com
     gente inventada, vê a ausência — que é a verdade. */
  const inicial = (n: string) =>
    (n.split(/\s+/).find((w) => !w.endsWith('.')) ?? n).charAt(0).toUpperCase();

  const equipe: { nome: string; papel: string }[] = [
    /* A responsável primeiro, e com o papel montado da ficha dela: a
       especialidade é um fato guardado, "responsável" é o lugar que ela
       ocupa nesta lista. */
    ...(S.profile.doctor
      ? [{
        nome: S.profile.doctor,
        papel: [(S.profile as any).doctorInfo?.especialidade, 'responsável'].filter(Boolean).join(' · '),
      }]
      : []),
    ...(((S as any).team ?? []) as any[]).map((m) => ({ nome: m.name, papel: m.role })),
  ];

  const nd = new Date(S.consult.t);

  /* ⚠️ AQUI HAVIA UMA TERCEIRA LINHA — "Compartilhar evolução · Peso,
     medidas e adesão com a equipe" — e ela era a quinta porta emparedada
     deste aplicativo. Tinha ícone, subtítulo e chevron, e o `onPress` era
     `undefined`: a lista inteira parecia tocável e uma das três não
     respondia ao dedo. É a pior variante do defeito, porque não leva a
     lugar errado — não leva a lugar nenhum, e a pessoa acha que o toque
     falhou.

     ⚠️ E ELA NÃO GANHOU DESTINO, PORQUE O DESTINO JÁ EXISTE DUAS VEZES NA
     MESMA TELA. Peso, adesão, sintomas, exames e anotações são o resumo —
     e o resumo é o botão azul lá em cima, dentro de "PARA LEVAR À
     CONSULTA", com essa lista escrita por extenso. Apontar esta linha
     para lá seria trocar uma porta que não abre por duas portas para a
     mesma sala.

     ⚠️ SE UM DIA "COMPARTILHAR" FOR OUTRA COISA — a equipe acompanhando o
     peso continuamente, e não um documento levado à consulta —, ela volta
     como AJUSTE e não como linha de navegação: é uma permissão que se liga
     e se desliga, e precisa de servidor para significar alguma coisa. Ver
     PENDENCIAS.md, item 6. */
  const clinRows: [string, string, string, () => void][] = [
    ['cal', 'Consultas', 'Agenda, histórico e videoconsulta', () => router.push('/consultas' as any)],
    ['doc', 'Exames enviados', `${S.examBundles.filter((b: any) => b.shared).length} arquivos compartilhados`, () => router.push('/exames' as any)],
  ];

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Sua equipe</Txt>
          {/* ⚠️ O SUBTÍTULO MOSTRA O QUE EXISTE, E SOME QUANDO NÃO EXISTE.

              Ele dizia "{nome} · acompanha sua evolução" — e o "acompanha
              sua evolução" é uma frase que a tela inteira já demonstra,
              gasta na única linha que poderia dizer QUAL equipe é esta.
              Com o nome da clínica e o da responsável, quem abre reconhece
              onde chegou antes de rolar.

              Quem entrou só pelo código pode não ter nenhum dos dois
              guardados; aí a linha não aparece, em vez de aparecer com um
              separador solto no meio do nada. */}
          {quem ? <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{quem}</Txt> : null}
        </View>
      </Row>

      {/* próxima consulta */}
      <Card tint={c.accentWeak} style={{ marginTop: 18 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Row gap={6}><Icon name="cal" size={14} color={c.accent} sw={2} /><Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>PRÓXIMA CONSULTA</Txt></Row>
          <Pill label={S.consult.type} />
        </Row>
        <Txt v="h1" style={{ fontSize: 26, marginTop: 10 }}>{cap(relDay(nd))}</Txt>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{fmtWD(nd)}, {fmtDate(nd)} · {S.consult.doctor}</Txt>
        <View style={{ marginTop: 14, backgroundColor: c.bg1, borderRadius: radius.md, padding: 13 }}>
          {/* ⚠️ ELE PROMETIA UM RESUMO QUE FICAVA "PRONTO NA VÉSPERA", e
              não há véspera nenhuma: o resumo se monta dos registros na
              hora em que a tela abre, hoje, amanhã ou daqui a um mês. E o
              botão se chamava "Ver preparação da consulta" para abrir uma
              tela chamada "Resumo para o médico" — dois nomes para uma
              porta fazem a pessoa achar que chegou noutro lugar.

              Esta é a porta principal do resumo agora que ele saiu do
              perfil: o que atravessa para o outro lado mora aqui. */}
          <Row gap={6}><Icon name="aura" size={13} color={c.accent} sw={2} /><Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>PARA LEVAR À CONSULTA</Txt></Row>
          <Txt v="bodyMed" c={c.tx2} style={{ marginTop: 6, lineHeight: 19 }}>Peso, adesão, sintomas, exames e as suas anotações, num documento só. Ele se monta dos seus registros e está pronto agora.</Txt>
          <Pressable onPress={() => router.push('/resumo-medico' as any)}>
            <View style={{ marginTop: 10, backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 11, flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
              <Icon name="doc" size={15} color="#fff" sw={2} /><Txt v="label" c="#fff">Ver o resumo para o médico</Txt>
            </View>
          </Pressable>
        </View>
      </Card>

      {/* protocolos */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Protocolos</Txt>
      <Card style={{ paddingVertical: 14 }} onPress={() => router.push('/protocolos' as any)}>
        <Row>
          <IconBadge name="target" size={40} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Txt v="title">Semana {S.protocol.week}</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{protocoloDaSemana(S).feitas} de {protocoloDaSemana(S).total} cumpridas</Txt>
          </View>
          <Chevron />
        </Row>
      </Card>

      {/* na clínica */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Na clínica</Txt>
      <Card style={{ paddingVertical: 4 }}>
        {clinRows.map(([ic, t, sub, onPress], i) => (
          <View key={t}>
            {i > 0 && <Divider style={{ marginLeft: 52 }} />}
            <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Row style={{ paddingVertical: 13 }}>
                <IconBadge name={ic} size={40} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt v="title">{t}</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{sub}</Txt>
                </View>
                <Chevron />
              </Row>
            </Pressable>
          </View>
        ))}
      </Card>

      {/* prescrições */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Prescrições</Txt>
      {/* ⚠️ A AÇÃO MORA ONDE O ASSUNTO MORA, e não só na ponta de um link.

          Fazer o pedido funcionar pelo parâmetro resolvia quem chega pela
          Home e deixava de fora quem chega aqui por conta própria, rola
          até as prescrições e pensa "essa está vencendo". Uma
          funcionalidade que só existe quando alguém a alcança pelo caminho
          certo não existe.

          Fica no alto do cartão porque é o que se FAZ com prescrições; o
          resto da lista é o que se lê. */}
      <Card style={{ paddingVertical: 4 }}>
        <Linha
          ic="send"
          titulo="Pedir nova receita"
          sub="Abre uma mensagem para a equipe, para você revisar e enviar"
          onPress={() => router.push('/conversa?pedir=receita' as any)}
        />
        <Divider style={{ marginLeft: 52 }} />
        {S.prescriptions.map((p: any, i: number) => (
          <View key={p.name}>
            {i > 0 && <Divider style={{ marginLeft: 52 }} />}
            <Row style={{ paddingVertical: 13, alignItems: 'flex-start' }}>
              <IconBadge name="pill" size={40} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Txt v="title">{p.name}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{p.detail}</Txt>
                <Txt v="micro" c={c.tx4} style={{ marginTop: 3 }}>{p.by} · {fmtDate(new Date(p.t))}</Txt>
              </View>
            </Row>
          </View>
        ))}
      </Card>

      {/* documentos */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Documentos e exames</Txt>
      <Card style={{ paddingVertical: 4 }}>
        {S.documents.map((d: any, i: number) => (
          <View key={`${d.name}-${i}`}>
            {i > 0 && <Divider />}
            <Row style={{ justifyContent: 'space-between', paddingVertical: 11 }}>
              <Row gap={8} style={{ flex: 1 }}>
                <Icon name="doc" size={15} color={c.tx3} sw={1.8} />
                <View style={{ flex: 1 }}>
                  <Txt v="bodyMed">{d.name}</Txt>
                  <Txt v="micro" c={c.tx3} style={{ marginTop: 1 }}>{d.kind}</Txt>
                </View>
              </Row>
              <Txt v="caption" c={c.tx3}>{fmtDate(new Date(d.t))}</Txt>
            </Row>
          </View>
        ))}
      </Card>

      {/* equipe */}
      {equipe.length ? (
        <>
          <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Equipe</Txt>
          <Card style={{ paddingVertical: 4 }}>
            {equipe.map((m, i) => (
              <View key={m.nome}>
                {i > 0 && <Divider style={{ marginLeft: 48 }} />}
                <Row style={{ paddingVertical: 12 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
                    <Txt v="title" c={c.accent}>{inicial(m.nome)}</Txt>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Txt v="title">{m.nome}</Txt>
                    {m.papel ? <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{m.papel}</Txt> : null}
                  </View>
                </Row>
              </View>
            ))}
          </Card>
        </>
      ) : null}
    </Screen>
  );
}
