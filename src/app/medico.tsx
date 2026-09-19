import React from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useStore } from '../logic/store';
import {
  protocoloDaSemana, exameNoProtocolo, penStock, fichaDaEquipe, destinoDoDocumento,
} from '../logic/derive';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Chevron, Divider, SectionHead } from '../ui/kit';
import { Grade2 } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { RETRATOS, inicialDoNome } from '../ui/retratos';
import { useTheme } from '../ui/useTheme';
import { fmtWD, fmtDate, relDay } from '../logic/time';
import { radius } from '../theme';

/* ============================================================
   SUA EQUIPE — o lado de lá do tratamento

   ⚠️ ELA SE CHAMAVA "MEU MÉDICO", E A PRÓPRIA TELA JÁ DISCORDAVA: a
   conversa era "com a equipe", o campo escrevia "para a equipe" e a
   última seção se chamava "Equipe", com a endocrinologista E a
   nutricionista. "Médico" nomeava uma pessoa num lugar que guarda uma
   clínica inteira, "meu" é posse numa relação que é o contrário, e o
   nome brigava com /acompanhamento, que se chama "Quem acompanha você".

   ⚠️ E A CONVERSA SAIU DAQUI. Era um card de 250 px no meio desta página:
   uma rolagem dentro de outra, o teclado por cima do que a pessoa
   escrevia, e a parte viva da relação com a clínica com o mesmo peso
   visual que a lista de documentos. Virou /conversa, tela cheia.

   ⚠️⚠️ E A LISTA "NA CLÍNICA" SE DISSOLVEU, que é a mudança de estrutura
   desta reforma.

   Ela juntava três coisas de naturezas diferentes só porque as três
   tinham a ver com a clínica: uma agenda, um arquivo e uma promessa que
   não abria. Consultas virou ação do cabeçalho — é acesso, não assunto —,
   o exame virou cartão de próximo passo, e a terceira já tinha saído por
   ser porta emparedada.

   ⚠️ E OS MATERIAIS NÃO ENTRAM AQUI, apesar de o desenho pedir. Eles já
   têm carrossel na aba Cuidado, de onde esta tela é empurrada: a mesma
   lista em duas telas seguidas é a segunda porta para a mesma sala.

   ⚠️ A ROTA CONTINUA /medico, e isso é dívida consciente: são quinze
   chamadas espalhadas, quatro delas dentro de derive.ts. O nome que a
   pessoa lê é o que importa, e ele mudou.
   ============================================================ */

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Medico() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const go = (to: string) => () => router.push(to as any);

  const equipe = fichaDaEquipe(S);
  const responsavel = equipe.find((f) => f.responsavel);

  const nd = new Date(S.consult.t);
  const protocolo = protocoloDaSemana(S);
  const exame = exameNoProtocolo(S);
  const estoque = penStock(S);

  /* ============================================================
     PRÓXIMOS PASSOS — o que tem passo, e só isso

     ⚠️ CADA CARTÃO SÓ EXISTE QUANDO HÁ O QUE FAZER. O exame aparece
     quando o protocolo pede um; a receita, quando a caneta está
     acabando. Com o estoque em dia, não há cartão de receita — porque
     não há passo nenhum a dar sobre ela.

     ⚠️ E A RECEITA NÃO VIROU "RECEITA ATIVA · ATÉ 30/10". O desenho de
     referência mostra uma validade, e `prescriptions` guarda nome, data e
     quem prescreveu — validade não existe no estado. Um cartão com data
     de validade inventada numa tela de tratamento é a pior linha que esta
     tela poderia ter. O que existe é o estoque, e é ele que o cartão diz.
     ============================================================ */
  type Passo = { ic: string; titulo: string; sub: string; to: string };
  const passos: Passo[] = [
    ...(S.consult.t ? [{
      ic: 'cal',
      titulo: 'Próxima consulta',
      sub: `${cap(relDay(nd))} · ${fmtWD(nd)}, ${fmtDate(nd)}`,
      to: '/consultas',
    }] : []),
    {
      ic: 'target',
      titulo: `Protocolo da semana ${S.protocol.week}`,
      sub: `${protocolo.feitas} de ${protocolo.total} cumpridas`,
      to: '/protocolos',
    },
    ...(exame ? [{
      ic: 'doc',
      titulo: 'Exame do protocolo',
      sub: exame,
      to: '/exames',
    }] : []),
    ...(!estoque.verdict.good ? [{
      ic: 'pill',
      titulo: 'Renovar a receita',
      sub: `${estoque.left} ${estoque.left === 1 ? 'dose restante' : 'doses restantes'}`,
      to: '/conversa?pedir=receita',
    }] : []),
  ];

  return (
    <Screen style={{ paddingHorizontal: 0 }}>
      {/* ---- o cabeçalho de quem cuida ----

          ⚠️ ELE JÁ FOI UMA LINHA DE LISTA E JÁ FOI UMA VITRINE, e nenhum
          dos dois servia.

          A linha era o desenho de um item de configuração numa tela cuja
          primeira pergunta é "quem cuida de mim?". A vitrine — aurora da
          paleta, retrato sangrando pela direita — resolvia isso e criava
          outro problema: ela só funciona com foto boa, e quem manda a
          foto é a clínica. Foto tremida, recortada torto ou com fundo
          errado virava um borrão de 160 px ocupando metade do cartão, e
          foto nenhuma virava um cartão grande e vazio.

          ⚠️ ENTÃO A FOTO DEIXOU DE SER ESTRUTURA E VIROU DETALHE. Ela mora
          num quadrado de 76 px, de tamanho fixo: com foto boa fica bonito,
          com foto ruim fica pequeno, sem foto cai na inicial. O cartão é o
          mesmo nos três casos, e nenhum deles parece defeito.

          ⚠️ E ELE NÃO PRESSUPÕE CLÍNICA NEM EQUIPE. A linha da clínica só
          aparece quando há clínica; a ação "Clínica" idem. Quem se trata
          com um profissional sozinho — que é o caso mais provável de
          todos — vê o mesmo cartão sem os pedaços que não existem, em vez
          de ver buracos onde eles estariam. */}
      <View style={{ paddingHorizontal: 20 }}>
        <Row style={{ marginTop: 4 }} gap={12}>
          <CircleBtn name="back" onPress={() => router.back()} />
          {/* ⚠️ "SUA EQUIPE" MESMO QUANDO É UMA PESSOA SÓ, e foi decisão.

              Um título condicional — "Sua equipe" com time, outra coisa
              sem — daria ao aplicativo um TERCEIRO nome muito parecido com
              os dois que já existem: /acompanhamento se chama "Quem
              acompanha você" e a Home tem a seção "Seu acompanhamento".
              Três nomes quase iguais para três lugares diferentes custa
              mais do que a licença de chamar de equipe um time de um.

              E a licença é pequena: o cartão logo abaixo mostra quem é,
              com nome e registro, antes de qualquer dúvida. */}
          <Txt v="title" style={{ flex: 1 }}>Sua equipe</Txt>
        </Row>

        {responsavel ? (
          <View style={{ marginTop: 16, backgroundColor: c.bg1, borderRadius: radius.card, overflow: 'hidden' }}>
            <Pressable onPress={go('/especialista')} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <Row gap={14} style={{ padding: 16, alignItems: 'center' }}>
                <Retrato ficha={responsavel} lado={76} />
                <View style={{ flex: 1 }}>
                  <Txt v="title" numberOfLines={2}>{responsavel.nome}</Txt>
                  {!!responsavel.papel && (
                    <Txt v="caption" c={c.tx2} numberOfLines={1} style={{ marginTop: 3 }}>{responsavel.papel}</Txt>
                  )}
                  {/* O registro é a parte verificável, e num cartão de
                      apresentação ele vale mais do que o nome da cidade. */}
                  {!!responsavel.registro && (
                    <Txt v="micro" c={c.tx3} numberOfLines={1} style={{ marginTop: 2 }}>{responsavel.registro}</Txt>
                  )}
                  {!!S.profile.clinic && (
                    <Txt v="micro" c={c.tx3} numberOfLines={1} style={{ marginTop: 2 }}>{S.profile.clinic}</Txt>
                  )}
                </View>
                <Chevron />
              </Row>
            </Pressable>

            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.line }} />

            <Row gap={4} style={{ paddingVertical: 14, paddingHorizontal: 8 }}>
              {([
                ['companion', 'Mensagem', '/conversa'],
                ['cal', 'Consultas', '/consultas'],
                ['doc', 'Protocolos', '/protocolos'],
                ...(S.profile.clinic ? [['heart', 'Clínica', '/clinica']] : []),
              ] as [string, string, string][]).map(([ic, label, to]) => (
                <Pressable key={label} onPress={go(to)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.6 : 1 }]}>
                  <View style={{ alignItems: 'center' }}>
                    <View style={{
                      width: 42, height: 42, borderRadius: 21, backgroundColor: c.bg2,
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon name={ic} size={19} color={c.accent} sw={1.9} />
                    </View>
                    <Txt v="micro" c={c.tx2} numberOfLines={1} style={{ marginTop: 6 }}>{label}</Txt>
                  </View>
                </Pressable>
              ))}
            </Row>
          </View>
        ) : null}

        {/* ---- o resumo ----

            ⚠️ ELE SUBIU PARA O TOPO, e o motivo é o mesmo que o mantinha
            fora da grade: ele não é um próximo passo, é a coisa que se
            LEVA para eles. É o único conteúdo desta tela que atravessa
            para o outro lado.

            Embaixo da grade ele era a peça mais pesada da tela — azul
            cheio, olho-de-boi, botão — parada no meio, entre dois blocos
            leves, quebrando o ritmo no lugar em que ele deveria estar
            assentando. Encostado no cabeçalho, o peso dos dois soma em vez
            de brigar: quem cuida de você, e o que você leva para ela.

            ⚠️ E ELE JÁ PROMETEU UM RESUMO "PRONTO NA VÉSPERA", e não há
            véspera nenhuma: o resumo se monta dos registros na hora em que
            a tela abre, hoje, amanhã ou daqui a um mês. */}
        <Card style={{ marginTop: 16 }} tint={c.accentWeak}>
          <Row gap={6}>
            <Icon name="aura" size={13} color={c.accent} sw={2} />
            <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>PARA LEVAR À CONSULTA</Txt>
          </Row>
          {/* ⚠️ SEM NEGRITO. O parágrafo estava em `bodyMed`, que é peso de
              rótulo, não de leitura: quatro linhas em semibold dentro de um
              cartão que já tem o olho-de-boi azul em cima e um botão cheio
              embaixo davam três vozes altas na mesma peça. Em `caption`,
              com entrelinha maior, ele volta a ser o que é — a explicação
              entre o título e a ação. */}
          <Txt v="caption" c={c.tx2} style={{ marginTop: 9, lineHeight: 21 }}>
            Peso, adesão, sintomas, exames e as suas anotações, num documento só. Ele se monta
            dos seus registros e está pronto agora.
          </Txt>
          <Pressable onPress={go('/resumo-medico')}>
            <View style={{ marginTop: 14, backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 13, flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
              <Icon name="doc" size={16} color={c.accentInk} sw={2} />
              <Txt v="label" c={c.accentInk}>Ver o resumo para o médico</Txt>
            </View>
          </Pressable>
        </Card>

        {/* ---- próximos passos ----

            ⚠️ GRADE, E NÃO CARROSSEL. A fila horizontal só se paga quando
            há mais itens do que cabem na tela — e aqui há dois na maior
            parte do tempo: o exame só entra quando o protocolo pede um, e
            a receita só quando a caneta está acabando. Dois cartões numa
            fileira que mal rola é o mesmo defeito que tirou o carrossel da
            equipe: o gesto é anunciado e não leva a lugar nenhum.

            Em grade os dois ocupam a largura inteira, e quando viram
            quatro eles descem numa segunda fileira em vez de se esconderem
            fora da borda. O que estava escondido passa a ser visto — que é
            o ponto de uma seção chamada "próximos passos".

            ⚠️ O ÍCONE FICA SOLTO, E NÃO NUMA PASTILHA DE COR. O quadradinho
            azul repetido vira uma grade de botões — e nenhum deles é
            botão: quem leva a algum lugar é o cartão inteiro. A seta no
            canto diz que o cartão é porta, que era o que a pastilha estava
            tentando dizer errado. */}
        <Txt v="h2" style={{ marginTop: 30, marginBottom: 12 }}>Próximos passos</Txt>
        <Grade2>
          {passos.map((p) => (
            <Pressable key={p.titulo} onPress={go(p.to)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
              <View style={{
                flex: 1, minHeight: 124, backgroundColor: c.bg1,
                borderRadius: radius.lg, padding: 15, justifyContent: 'space-between',
              }}>
                <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Icon name={p.ic} size={20} color={c.accent} sw={1.9} />
                  <Icon name="chev" size={13} color={c.tx4} sw={2.2} />
                </Row>
                <View style={{ marginTop: 14 }}>
                  <Txt v="bodyMed" numberOfLines={2}>{p.titulo}</Txt>
                  <Txt v="micro" c={c.tx3} numberOfLines={2} style={{ marginTop: 3, lineHeight: 16 }}>{p.sub}</Txt>
                </View>
              </View>
            </Pressable>
          ))}
        </Grade2>

        {/* ---- prescrições ----

            ⚠️ A AÇÃO SAIU DE DENTRO DA LISTA, e virou o link do título.

            Ela era a primeira linha do cartão: mesma altura, mesmo ícone e
            mesma seta das prescrições debaixo dela — só que as outras não
            respondiam ao toque. Uma lista em que o primeiro item é botão e
            o resto é leitura ensina errado nos dois sentidos: faz tocar no
            que não abre e faz duvidar do que abre.

            No título ela continua a um toque de quem rola até aqui —
            que era o motivo de ela existir fora do link da Home — e a
            lista volta a ser uma lista. */}
        <SectionHead
          title="Prescrições"
          link="Pedir nova receita"
          onPress={go('/conversa?pedir=receita')}
          style={{ marginTop: 32, marginBottom: 10 }}
        />
        <Card style={{ paddingVertical: 4 }}>
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

        {/* ---- documentos ----

            ⚠️ ELES ABREM AGORA, e antes eram texto. Uma lista de exames e
            resumos numa tela de tratamento é a primeira coisa em que
            alguém toca — e nenhum dos três respondia. Não era porta
            emparedada por não ter seta: era pior, porque parecia leitura e
            guardava conteúdo.

            Onde cada um abre sai de `destinoDoDocumento`, que é a mesma
            regra que a aba Cuidado usa na lista dela. */}
        <Txt v="h2" style={{ marginTop: 32, marginBottom: 10 }}>Documentos e exames</Txt>
        <Card style={{ paddingVertical: 4 }}>
          {S.documents.map((d: any, i: number) => (
            <View key={`${d.name}-${i}`}>
              {i > 0 && <Divider />}
              <Pressable onPress={go(destinoDoDocumento(d.kind))} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                <Row gap={8} style={{ paddingVertical: 12 }}>
                  <Icon name="doc" size={15} color={c.tx3} sw={1.8} />
                  <View style={{ flex: 1 }}>
                    <Txt v="bodyMed">{d.name}</Txt>
                    <Txt v="micro" c={c.tx3} style={{ marginTop: 1 }}>{d.kind}</Txt>
                  </View>
                  <Txt v="caption" c={c.tx3}>{fmtDate(new Date(d.t))}</Txt>
                  <Chevron />
                </Row>
              </Pressable>
            </View>
          ))}
        </Card>
      </View>
    </Screen>
  );
}

/* O retrato de alguém da equipe, ou a inicial de quem ainda não tem foto.
   Os dois desenhos no mesmo componente porque as telas que mostram gente
   precisam concordar: a mesma pessoa com foto numa e inicial na outra
   confunde sem que ninguém saiba dizer por quê.

   ⚠️ QUADRADO DE CANTO REDONDO, E NÃO CÍRCULO. O círculo corta as pontas
   da imagem, e é justamente nas pontas que mora o erro de uma foto mal
   recortada — ombro cortado, fundo entrando, cabeça encostando na borda.
   O quadrado mostra o enquadramento inteiro: uma foto ruim continua
   ruim, mas fica ruim de um jeito que se entende, em vez de virar um
   recorte estranho que parece defeito do aplicativo. */
function Retrato({ ficha, lado }: { ficha: { id: string; nome: string }; lado: number }) {
  const { c } = useTheme();
  const foto = RETRATOS[ficha.id];
  if (foto) {
    return (
      <Image
        source={foto}
        style={{ width: lado, height: lado, borderRadius: radius.md, backgroundColor: c.bg2 }}
        contentFit="cover"
        contentPosition="top center"
      />
    );
  }
  return (
    <View style={{
      width: lado, height: lado, borderRadius: radius.md,
      backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center',
    }}>
      <Txt v="h2" c={c.accent} style={{ fontSize: lado * 0.38 }}>{inicialDoNome(ficha.nome)}</Txt>
    </View>
  );
}
