import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { Screen, Txt, Card, Row, CircleBtn, Pill, SectionHead } from '../ui/kit';
import { Cartao, Linha } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { preparoDaConsulta, temConsulta, clinicaConectada } from '../logic/derive';
import { fmtWD, fmtDate, relDay, diffDays, now } from '../logic/time';
import { radius } from '../theme';

/* ============================================================
   CONSULTAS — a próxima, o que levar nela, e as que já foram

   ⚠️ O CHECKLIST DE QUATRO FRASES SAIU, e com ele o defeito que
   sustentava a tela: ele era marcado à mão e guardado em `useState`, ou
   seja, esquecido ao sair. Alguém marcava "pesar-se na véspera", voltava
   no dia seguinte e encontrava tudo em branco.

   E três dos quatro itens eram coisas que o aplicativo JÁ SABE. Ele
   registra o peso, guarda as dúvidas anotadas e tem os exames — e mesmo
   assim pedia que a pessoa marcasse à mão que tinha feito aquilo. Agora
   cada linha é uma leitura do estado: ela não pergunta, responde, e o
   toque leva para onde a resposta muda.

   ⚠️ "TER OS EXAMES À MÃO" NÃO VIROU LINHA, e era um dos quatro. Estar
   com o papel na bolsa é do mundo, não do estado — e um item que só a
   pessoa pode confirmar nos devolveria o checklist manual, com a
   persistência que ele não tinha. O que ficou é o que se pode afirmar.

   ⚠️ A PAUTA DEIXOU DE SER LISTADA AQUI. Ela é uma lista só, e a casa
   dela é a área médica — onde ela aparece em cartões, ao lado do resumo
   que a leva para a consulta. Aqui ficou o PONTEIRO: quantas dúvidas
   existem, e a porta. Três telas mostrando a mesma lista era o caminho
   para três telas divergindo.

   ⚠️ E "VIDEOCONSULTA" NÃO VOLTA. Era um botão cheio sem `onPress` — o
   mais destacado da tela, e não fazia nada. Chamada de vídeo é coisa da
   plataforma, e nem a plataforma existe.
   ============================================================ */

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Consultas() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const update = useStore((st) => st.update);
  const go = (to: string) => () => router.push(to as any);

  const marcada = temConsulta(S);
  const conectada = clinicaConectada(S);
  const preparo = preparoDaConsulta(S);
  const faltando = preparo.filter((i) => !i.pronto).length;

  const nd = new Date(S.consult.t);
  /* Negativo quer dizer que a data já passou. A consulta anotada não sai
     sozinha de lá: ninguém avisou o app de que ela aconteceu, e apagar
     por conta própria uma coisa que a pessoa escreveu é o tipo de zelo
     que vira perda de dado. */
  const faltam = marcada ? diffDays(nd, now()) : 0;
  const passou = marcada && faltam < 0;

  /* Ela vira linha do histórico, e não desaparece. O texto fica vazio
     porque o app não estava lá: quem quiser contar o que foi decidido
     tem as anotações, que são de quem viveu a consulta. */
  const realizada = () => {
    update((st: any) => {
      (st.consultsHistory ?? (st.consultsHistory = [])).unshift({
        t: st.consult.t, type: st.consult.type || 'Consulta', note: '',
      });
      st.consult = { t: 0, type: '', doctor: '' };
    });
  };

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        {/* ⚠️ `title` E NÃO `h1` COM SUBTÍTULO. O cabeçalho era um bloco de
            duas linhas — "Consultas" grande e "Agenda, preparação e
            histórico" embaixo —, e nenhuma outra tela interna deste
            aplicativo se apresenta assim. O subtítulo também era um índice
            do que vinha depois, o que só é útil quando o que vem depois
            não se explica. */}
        <Txt v="title" style={{ flex: 1 }}>Consultas</Txt>
      </Row>

      {/* ---- a próxima ----

          ⚠️ ELE NÃO PERGUNTAVA SE HAVIA CONSULTA. Sem data, o estado
          guarda zero, e zero formatado é 1º de janeiro de 1970: a tela
          abria dizendo "há vinte mil dias", com o tipo em branco e o nome
          do médico vazio. Enquanto a data só vinha da semente ninguém
          via; a partir da porta de anotar, qualquer pessoa vê. */}
      {marcada ? (
        <Card tint={c.accentWeak} style={{ marginTop: 18 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Row gap={6}>
              <Icon name="cal" size={14} color={c.accent} sw={2} />
              <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>{passou ? 'JÁ PASSOU' : 'PRÓXIMA'}</Txt>
            </Row>
            {S.consult.type ? <Pill label={S.consult.type} /> : null}
          </Row>
          <Txt v="h1" style={{ fontSize: 26, marginTop: 8 }}>{cap(relDay(nd))}</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>
            {fmtWD(nd)}, {fmtDate(nd)}{S.consult.doctor ? ` · ${S.consult.doctor}` : ''}
          </Txt>

          {/* ⚠️ UM BOTÃO SÓ, e eram dois de contorno com o mesmo destino:
              "Preparação" e "Ver resumo para o médico" abriam os dois
              /resumo-medico, com nomes diferentes. Duas portas para a
              mesma sala ensinam que as portas desta tela não são de
              confiança.

              E ele é cheio, não de contorno: é a única ação do cartão, e
              é a coisa que se leva. */}
          {passou ? (
            <Pressable onPress={realizada} style={({ pressed }) => [{ marginTop: 14, opacity: pressed ? 0.8 : 1 }]}>
              <Row gap={7} style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 13, justifyContent: 'center' }}>
                <Icon name="check" size={15} color={c.accentInk} sw={2} />
                <Txt v="label" c={c.accentInk}>Já aconteceu</Txt>
              </Row>
            </Pressable>
          ) : (
            <Pressable onPress={go('/resumo-medico')} style={({ pressed }) => [{ marginTop: 14, opacity: pressed ? 0.8 : 1 }]}>
              <Row gap={7} style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 13, justifyContent: 'center' }}>
                <Icon name="doc" size={15} color={c.accentInk} sw={2} />
                <Txt v="label" c={c.accentInk}>Ver o resumo para levar</Txt>
              </Row>
            </Pressable>
          )}

          {!conectada ? (
            <Pressable onPress={go('/anotar-consulta')} style={({ pressed }) => [{ marginTop: 12, alignSelf: 'center', opacity: pressed ? 0.6 : 1 }]}>
              <Txt v="label" c={c.accent2}>Mudar a data</Txt>
            </Pressable>
          ) : null}
        </Card>
      ) : (
        /* Sem consulta, a diferença é de quem marca: com plataforma, a
           agenda é da clínica e não há o que fazer aqui; sem ela, quem
           anota é a pessoa, e o botão é a porta que faltava. */
        <Card style={{ marginTop: 18 }}>
          <Row gap={6}>
            <Icon name="cal" size={14} color={c.tx3} sw={2} />
            <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>PRÓXIMA</Txt>
          </Row>
          <Txt v="bodyMed" style={{ marginTop: 8 }}>Nenhuma consulta anotada</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 3, lineHeight: 19 }}>
            {conectada
              ? 'Quando a sua equipe marcar a próxima, ela aparece aqui.'
              : 'Com a data aqui, o app avisa quando ela estiver perto e deixa o resumo pronto para levar.'}
          </Txt>
          {!conectada ? (
            <Pressable onPress={go('/anotar-consulta')} style={({ pressed }) => [{ marginTop: 14, opacity: pressed ? 0.8 : 1 }]}>
              <Row gap={7} style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 13, justifyContent: 'center' }}>
                <Icon name="cal" size={15} color={c.accentInk} sw={2} />
                <Txt v="label" c={c.accentInk}>Anotar consulta</Txt>
              </Row>
            </Pressable>
          ) : null}
        </Card>
      )}

      {/* ---- o que levar ----

          ⚠️ O TÍTULO DIZ O QUE FALTA, e não "checklist". Uma tela que
          abre com "3 de 3 prontos" responde antes de ser lida; "Checklist
          pré-consulta" só nomeia o formato da coisa.

          ⚠️ E A LINHA PRONTA CONTINUA TOCÁVEL. Ela vira confirmação, não
          se apaga: ver o peso registrado e poder abrir a pesagem é o que
          transforma a lista de lembrete em painel. Uma lista em que
          metade dos itens deixa de responder ao toque é a lista que
          ensinou errado em /medico, e não volta aqui. */}
      <SectionHead
        title="Para levar"
        style={{ marginTop: 30, marginBottom: 4 }}
      />
      <Txt v="caption" c={c.tx3} style={{ marginBottom: 12, lineHeight: 21 }}>
        {faltando === 0
          ? 'Está tudo em dia — o resumo já se monta com isso.'
          : faltando === 1
            ? 'Falta uma coisa para o resumo ficar completo.'
            : `Faltam ${faltando} coisas para o resumo ficar completo.`}
      </Txt>
      <Cartao>
        {preparo.map((i) => (
          <Pressable key={i.id} onPress={go(i.to)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
            <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center' }}>
              {/* ⚠️ O ESTADO É O ÍCONE, e não uma caixa de marcar. Caixa de
                  marcar pede toque para MUDAR o valor; aqui o valor não é
                  da pessoa, é do estado — ela resolve pesando, anotando ou
                  guardando exame, e não marcando um quadrado. O visto
                  fechado diz "já está"; o ícone da coisa diz o que fazer. */}
              <View style={{
                width: 34, height: 34, borderRadius: 17,
                backgroundColor: i.pronto ? c.okBg : c.accentWeak,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon
                  name={i.pronto ? 'check' : i.ic}
                  size={i.pronto ? 16 : 17}
                  color={i.pronto ? c.ok : c.accent}
                  sw={i.pronto ? 2.6 : 1.9}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Txt v="body">{i.titulo}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{i.sub}</Txt>
              </View>
              <Icon name="chev" size={14} color={c.tx4} sw={2} />
            </Row>
          </Pressable>
        ))}
      </Cartao>

      {/* ---- histórico ----

          ⚠️ É O <Cartao> DA CASA, e era um <Card> com IconBadge e um
          <Divider> de margem calculada à mão. A pastilha de cor saiu de
          todas as listas deste aplicativo pelo mesmo motivo: numa coluna
          repetida ela vira uma fileira de botões, e nenhuma destas linhas
          é botão.

          ⚠️ E ELAS NÃO ABREM NADA, DE PROPÓSITO. Não existe tela de
          consulta passada, e o que há para saber sobre uma está inteiro
          na linha dela. Por isso não têm seta — a mesma regra das
          prescrições em /medico. */}
      {S.consultsHistory.length ? (
        <>
          <Txt v="h2" style={{ marginTop: 32, marginBottom: 10 }}>Consultas anteriores</Txt>
          <Cartao>
            {S.consultsHistory.map((h: any) => (
              <Linha
                key={h.t}
                ic="steth"
                titulo={`${h.type} · ${fmtDate(new Date(h.t))}`}
                sub={h.note || undefined}
                seta={false}
              />
            ))}
          </Cartao>
        </>
      ) : null}
    </Screen>
  );
}
