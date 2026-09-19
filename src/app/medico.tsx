import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, ScrollView, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { protocoloDaSemana, penStock, medComDose } from '../logic/derive';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Chevron, Pill, Divider } from '../ui/kit';
import { Linha } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { now, fmtWD, fmtDate, fmtTime, relDay } from '../logic/time';
import { radius, font } from '../theme';

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

   ⚠️ A ROTA CONTINUA /medico, e isso é dívida consciente: são quinze
   chamadas espalhadas, incluindo quatro dentro de derive.ts. O nome que
   a pessoa lê é o que importa, e ele mudou; o outro é endereço interno e
   troca quando alguém encostar nos quinze de uma vez.
   ============================================================ */

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Medico() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const [msg, setMsg] = useState('');
  const threadRef = useRef<ScrollView>(null);
  const telaRef = useRef<ScrollView>(null);
  const campoRef = useRef<TextInput>(null);
  const [yConversa, setYConversa] = useState(0);

  useEffect(() => { if (S.unread) update((s: any) => { s.unread = 0; }); }, []);

  /* A CONVERSA ABRE NO FIM, e não no começo.

     A caixa tem 250 px e a conversa cresce: abrir no topo é abrir na
     mensagem mais velha, que é a única que já foi lida — e a recente, que
     é o motivo de alguém entrar aqui, fica fora da caixa.

     Sem animação: não é um movimento, é o lugar onde a tela começa. */
  useEffect(() => {
    const t = setTimeout(() => threadRef.current?.scrollToEnd({ animated: false }), 60);
    return () => clearTimeout(t);
  }, [S.messages.length]);

  const quem = [S.profile.clinic, S.profile.doctor].filter(Boolean).join(' · ');

  /* ============================================================
     PEDIR RECEITA É MANDAR UMA MENSAGEM

     ⚠️ AQUI HAVIA UMA PORTA EMPAREDADA, e ela vinha de dois lugares: a
     Home tinha "Solicitar nova receita" e o pendente da aba Cuidado tinha
     "Peça a renovação da receita", e os dois abriam esta tela NO ALTO.
     Não existia ação nenhuma de pedir receita aqui dentro — o bloco de
     Prescrições é leitura. A pessoa chegava, procurava o botão, e o botão
     não existia.

     A resposta não era inventar um fluxo de pedido: pedir receita a uma
     clínica É uma mensagem para a clínica. O canal já estava na tela.

     ⚠️⚠️ E O RASCUNHO NÃO SE ENVIA SOZINHO. ⚠️⚠️

     O aplicativo escreve a frase e para. Quem manda é ela, no mesmo botão
     de sempre, depois de ler e mudar o que quiser — porque isto vai para
     um profissional de saúde, com o nome dela em cima, e um aplicativo
     que fala por alguém numa conversa clínica é o tipo de atalho que
     ninguém pediu.

     O rascunho carrega o que a equipe precisa para responder sem
     perguntar de volta: o medicamento com a dose e quantas doses sobraram
     na caneta. Os dois saem do estado, e não de um texto fixo. */
  const { pedir } = useLocalSearchParams<{ pedir?: string }>();
  const estoque = penStock(S);

  const rascunhoDaReceita = () =>
    `Oi! Queria pedir a renovação da receita de ${medComDose(S)}. ${
      estoque.left === 1 ? 'Resta 1 dose' : `Restam ${estoque.left} doses`
    } na caneta.`;

  const pedirReceita = () => {
    setMsg(rascunhoDaReceita());
    /* O atraso é o tempo de a tela existir: rolar e focar antes da
       primeira pintura não leva a lugar nenhum. */
    setTimeout(() => {
      telaRef.current?.scrollTo({ y: Math.max(0, yConversa - 16), animated: true });
      campoRef.current?.focus();
    }, 80);
  };

  /* Chegando pela Home ou pelo pendente, o pedido já vem pedido. */
  useEffect(() => { if (pedir === 'receita') pedirReceita(); }, [pedir]);

  const nd = new Date(S.consult.t);
  const send = () => {
    const t = msg.trim(); if (!t) return;
    update((s: any) => { s.messages.push({ t: +now(), from: 'me', text: t }); });
    setMsg('');
    setTimeout(() => threadRef.current?.scrollToEnd({ animated: true }), 80);
  };

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
    <Screen scrollRef={telaRef}>
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

      {/* thread */}
      <View onLayout={(e) => setYConversa(e.nativeEvent.layout.y)}>
        <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Conversa com a equipe</Txt>
      </View>
      <Card style={{ padding: 14 }}>
        <ScrollView ref={threadRef} style={{ maxHeight: 250 }} showsVerticalScrollIndicator={false}>
          {S.messages.map((m: any, i: number) => (
            <View key={i} style={{
              alignSelf: m.from === 'doc' ? 'flex-start' : 'flex-end', maxWidth: '85%', marginBottom: 8,
              backgroundColor: m.from === 'doc' ? c.bg2 : c.accent, borderRadius: radius.md, padding: 11,
              borderBottomLeftRadius: m.from === 'doc' ? 4 : radius.md, borderBottomRightRadius: m.from === 'doc' ? radius.md : 4,
            }}>
              {m.from === 'doc' && <Txt v="micro" c={c.tx3} style={{ marginBottom: 2 }}>{S.profile.doctor}</Txt>}
              <Txt v="bodyMed" c={m.from === 'doc' ? c.tx : '#fff'} style={{ lineHeight: 19 }}>{m.text}</Txt>
              <Txt v="micro" c={m.from === 'doc' ? c.tx4 : 'rgba(255,255,255,0.7)'} style={{ marginTop: 4 }}>{relDay(new Date(m.t))} · {fmtTime(new Date(m.t))}</Txt>
            </View>
          ))}
        </ScrollView>
        <Divider style={{ marginTop: 6 }} />
        <Row style={{ marginTop: 10 }} gap={8}>
          <TextInput
            ref={campoRef}
            value={msg} onChangeText={setMsg} onSubmitEditing={send}
            placeholder="Escrever para a equipe..." placeholderTextColor={c.tx4}
            style={{ flex: 1, backgroundColor: c.bg2, borderRadius: radius.pill, paddingHorizontal: 15, paddingVertical: 11, color: c.tx, fontFamily: font.body, fontSize: 19 }}
          />
          <Pressable onPress={send} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="send" size={18} color="#fff" sw={2} />
            </View>
          </Pressable>
        </Row>
        <Txt v="micro" c={c.tx4} style={{ textAlign: 'center', marginTop: 8 }}>Canal organizado com a clínica — some do WhatsApp, entra no seu histórico</Txt>
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
          onPress={pedirReceita}
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
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Equipe</Txt>
      <Card style={{ paddingVertical: 4 }}>
        {[[S.profile.doctor, 'Endocrinologia · responsável', 'H'], ['Renata Alves', 'Nutrição', 'R']].map(([n, s, a], i) => (
          <View key={n}>
            {i > 0 && <Divider style={{ marginLeft: 48 }} />}
            <Row style={{ paddingVertical: 12 }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
                <Txt v="title" c={c.accent}>{a}</Txt>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Txt v="title">{n}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{s}</Txt>
              </View>
            </Row>
          </View>
        ))}
      </Card>
    </Screen>
  );
}
