import React from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useStore } from '../logic/store';
import {
  protocoloDaSemana, exameNoProtocolo, penStock, fichaDaEquipe, destinoDoDocumento,
  notasAbertas, clinicaConectada,
} from '../logic/derive';
import { Txt, Card, Row, Chevron, SectionHead } from '../ui/kit';
import { TelaInterna, Titulao, Grade2, Cartao, Linha } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { fotoDe, focoDe, inicialDoNome } from '../ui/retratos';
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

/* ⚠️ A MESMA LARGURA DA ABA CUIDADO, e é de propósito que o número
   esteja escrito aqui e lá. São três fileiras horizontais no aplicativo —
   o material na aba Cuidado e estas duas — e cartão de 178 com respiro de
   10 deixa o segundo item mostrando um terço de si na borda do aparelho.
   É esse terço que diz que a fileira anda; com cartão mais largo, o
   segundo some e a fileira parece uma lista de um item.

   ⚠️ E AS DUAS FILEIRAS DESTA TELA TÊM A MESMA MEDIDA porque ficam a uma
   rolagem uma da outra. Duas fileiras de larguras diferentes na mesma
   tela leem como erro de alinhamento antes de lerem como duas coisas
   diferentes. */
const LARGURA_DO_CARD = 178;

export default function Medico() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const go = (to: string) => () => router.push(to as any);

  const equipe = fichaDaEquipe(S);

  /* As dúvidas ainda não conversadas, e o material que veio da clínica.
     Os dois são listas do estado que esta tela apenas lê — quem escreve
     são /nota e o outro lado, que ainda não existe. */
  const abertas = notasAbertas(S);
  const materiais = ((S as any).materials ?? []) as
    { name: string; kind: string; meta: string; ic: string; motivo: string }[];
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
    <TelaInterna titulo="Área médica">
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
      {/* ⚠️ <TelaInterna> E <Titulao>, COMO TODA TELA INTERNA DA CASA.
          Era um <Screen> com a seta e o nome lado a lado, que é o desenho
          de outra família: nele o nome fica pequeno para sempre e a tela
          abre sem manchete. Aqui a barra só ganha o título quando a
          manchete sobe — o nome está sempre num lugar só, e a rolagem é
          que troca qual.

          ⚠️ E O RESPIRO LATERAL CAIU DE 20 PARA 16, que é o da casa. Não
          é detalhe: com a <TelaInterna> pondo os 16 dela, os 20 daqui
          somariam 36 de um lado e o cartão desta tela ficaria mais estreito
          que o de todas as outras. */}
      <View>
        <View style={{ marginTop: 4 }}>
          {/* ⚠️ "ÁREA MÉDICA", E ERA "SUA EQUIPE".

              A Home já chamava esta tela assim: a seção "Seu
              acompanhamento" tem o link "Ir para área médica", e ele vem
              para cá. Dois nomes para um destino é o mesmo defeito que
              tirou a equipe escrita à mão e as duas aparências do mesmo
              botão de ação — quem toca em "área médica" e chega numa tela
              chamada "Sua equipe" não sabe se chegou onde queria.

              ⚠️ E O NOME ANTIGO DESCREVIA SÓ O PRIMEIRO CARTÃO. Abaixo
              dele moram o resumo para levar à consulta, os próximos
              passos, as prescrições e os documentos — nada disso é a
              equipe, tudo isso é o tratamento do lado clínico. "Sua
              equipe" nomeava a peça de cima e deixava o resto sem nome.

              ⚠️ A RAZÃO ANTIGA CONTINUA VALENDO, e é por isso que o nome
              novo serve: o problema era ter um TERCEIRO nome parecido com
              /acompanhamento ("Quem acompanha você") e com a seção da Home
              ("Seu acompanhamento"). "Área médica" não entra nessa família
              — some a semelhança e some também o título condicional, que
              mudaria de nome conforme o tamanho do time.

              ⚠️ A RESSALVA, PARA QUEM MEXER DEPOIS: em aplicativo
              brasileiro, "área médica" também é como se chama o portal DOS
              médicos. Aqui não há portal nenhum e o aplicativo inteiro é
              do paciente, então a leitura não tem para onde ir — mas se um
              dia existir alguma coisa para a clínica, este nome fica
              ocupado e é este título que muda. */}
          <Titulao
            titulo="Área médica"
            lead="Quem cuida de você, e o que atravessa para o outro lado."
          />
        </View>

        {responsavel ? (
          <View style={{ marginTop: 26, backgroundColor: c.bg1, borderRadius: radius.card, overflow: 'hidden' }}>
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
                    {/* ⚠️ O MESMO CÍRCULO DA FICHA. Era `c.bg2` aqui e virou
                        `accentWeak` lá, e são as MESMAS QUATRO AÇÕES para a
                        MESMA PESSOA, a um toque de distância uma tela da
                        outra. Duas aparências para o mesmo controle é o
                        tipo de diferença que ninguém descreve e todo mundo
                        sente — e foi assim que a equipe já tinha sido
                        escrita à mão dentro de um JSX uma vez.

                        Fica menor que o da ficha (42 contra 52) porque
                        aqui a fileira mora dentro do cartão, sob um fio, e
                        lá ela é a peça solta logo abaixo do nome. O
                        tamanho é do lugar; a cor é do controle. */}
                    <View style={{
                      width: 42, height: 42, borderRadius: 21, backgroundColor: c.accentWeak,
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
              <Txt v="label" c={c.accentInk}>Ver o resumo para consulta</Txt>
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

        {/* ---- as suas anotações ----

            ⚠️ ELAS NÃO TINHAM LUGAR NENHUM. `/nota` escreve uma e `/nota?t=`
            edita aquela, mas nenhuma tela do aplicativo mostrava as quatro
            juntas — elas só reapareciam dentro do resumo, na hora de levar
            à consulta. Uma lista que só existe no PDF é uma lista que
            ninguém revisa: a pessoa anota a dúvida e nunca mais a vê até
            estar sentada na frente da médica.

            ⚠️ E É AQUI QUE ELAS MORAM, e não na aba Cuidado. O resumo logo
            acima já diz "as suas anotações, num documento só" — as duas
            peças são a mesma errand, uma é o que se leva e a outra é o que
            está dentro. Separá-las em telas diferentes é o que estava
            errado.

            ⚠️ SÓ AS ABERTAS. A nota marcada como conversada cumpriu o que
            tinha para cumprir; mantê-la na lista faz a pessoa reler na
            consulta seguinte uma pergunta que já foi respondida. O
            histórico continua no estado, e `/nota` sabe desmarcar.

            ⚠️ E A SEÇÃO NÃO SOME QUANDO ESTÁ VAZIA, que é o contrário da
            regra do resto do aplicativo. Aqui a lista vazia não é ausência
            de dado: é o convite. Sumindo, quem nunca anotou nada nunca
            descobre que dá para anotar — e o link "Anotar" no título é a
            única porta para `/nota` que existe fora da consulta.

            ⚠️ E O TÍTULO É "SUAS ANOTAÇÕES", e era "Anotações para a
            consulta". Medido: o título longo quebrava em duas linhas e
            empurrava o link "Anotar" para o canto de cima, deslocado do
            título que ele acompanha. O possessivo faz o trabalho que o
            resto da frase fazia — separa as SUAS das prescrições e dos
            documentos, que são deles. */}
        <SectionHead
          title="Suas anotações"
          link="Anotar"
          onPress={go('/nota')}
          style={{ marginTop: 32, marginBottom: 10 }}
        />
        {/* ⚠️ FILEIRA, E NÃO LISTA — e a diferença é o que a nota É.

            Numa lista, cada anotação vira uma linha de mesmo peso com uma
            seta no canto, e quatro linhas de texto corrido empilhadas leem
            como itens de configuração. A anotação não é um item de menu:
            é uma frase que a pessoa escreveu, e ela merece respirar num
            cartão em vez de caber numa linha.

            E são poucas por natureza. Quem anota quinze dúvidas para uma
            consulta não vai revisar quinze — quatro ou cinco é o número
            real, e é exatamente o que uma fileira horizontal serve bem. */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -16 }}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
        >
          {abertas.length ? (
            abertas.map((n) => (
              <Pressable key={n.t} onPress={go(`/nota?t=${n.t}`)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                <View style={{
                  width: LARGURA_DO_CARD, minHeight: 148, backgroundColor: c.bg1,
                  borderRadius: radius.lg, padding: 16, justifyContent: 'space-between',
                }}>
                  <View>
                    <Icon name="pencil" size={18} color={c.accent} sw={1.9} />
                    {/* Quatro linhas: a mais longa da semente ocupa três, e
                        a quarta é a folga de quem escreve mais. Depois
                        disso corta — a nota inteira está a um toque. */}
                    <Txt v="caption" style={{ marginTop: 12, lineHeight: 21 }} numberOfLines={4}>{n.text}</Txt>
                  </View>
                  {/* ⚠️ A DATA FICA. Sem ela a nota chega na consulta sem o
                      contexto que a explica — "isso foi antes ou depois de
                      eu subir a dose?" é a primeira pergunta que a médica
                      faz, e é a própria anotação que deveria responder. */}
                  <Txt v="micro" c={c.tx4} style={{ marginTop: 12 }}>{fmtDate(new Date(n.t))}</Txt>
                </View>
              </Pressable>
            ))
          ) : (
            <Pressable onPress={go('/nota')} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <View style={{
                width: LARGURA_DO_CARD, minHeight: 148, backgroundColor: c.bg1,
                borderRadius: radius.lg, padding: 16, justifyContent: 'space-between',
              }}>
                <Icon name="pencil" size={18} color={c.accent} sw={1.9} />
                <View>
                  <Txt v="caption" style={{ lineHeight: 21 }}>Anotar uma dúvida</Txt>
                  <Txt v="micro" c={c.tx4} style={{ marginTop: 4, lineHeight: 16 }}>
                    Para perguntar na próxima consulta
                  </Txt>
                </View>
              </View>
            </Pressable>
          )}
        </ScrollView>

        {/* ---- prescrições ----

            ⚠️ A AÇÃO SAIU DE DENTRO DA LISTA, e virou o link do título.
            Ela era a primeira linha do cartão: mesma altura, mesmo ícone e
            mesma seta das prescrições debaixo dela — só que as outras não
            respondiam ao toque. Uma lista em que o primeiro item é botão e
            o resto é leitura ensina errado nos dois sentidos: faz tocar no
            que não abre e faz duvidar do que abre.

            ⚠️ E AGORA ELA ABRE. Eu tinha escrito aqui que "o que há para
            saber sobre uma receita está inteiro na linha dela" — e não
            está: falta a coisa que se procura com pressa, que é o que
            fazer quando a receita venceu e a caneta vai acabar. A tela do
            outro lado responde isso.

            ⚠️⚠️ E ELA NÃO É UMA RECEITA. O pedido que abriu esta porta foi
            "poder usar na farmácia"; não dá, e fingir que dá seria o erro
            mais grave possível aqui. Receita é documento assinado, com
            validade e número; isto é o REGISTRO de uma. A tela diz isso na
            cara e leva ao único caminho que existe — pedir uma nova à
            clínica.

            ⚠️ O ÍCONE FICA SOLTO, e saiu da pastilha azul. Numa lista, o
            quadrado de cor repetido vira uma coluna de botões — e aqui
            nenhum item é botão. É a mesma regra da <Linha> da casa, e é
            por segui-la que as duas listas se alinham pela mesma coluna,
            mesmo sendo desenhadas por lugares diferentes. */}
        <SectionHead
          title="Prescrições"
          link="Pedir nova receita"
          onPress={go('/conversa?pedir=receita')}
          style={{ marginTop: 32, marginBottom: 10 }}
        />
        <Cartao>
          {S.prescriptions.map((p: any) => (
            <Pressable key={p.name} onPress={go(`/prescricao?t=${p.t}`)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 14, alignItems: 'flex-start' }}>
                <View style={{ width: 34, alignItems: 'center', marginTop: 1 }}>
                  <Icon name="pill" size={20} color={c.accent} sw={1.9} />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt v="body">{p.name}</Txt>
                  <Txt v="caption" c={c.tx2} style={{ marginTop: 2, lineHeight: 20 }}>{p.detail}</Txt>
                  {/* Quem prescreveu e quando: é o que torna a linha
                      verificável, e é a única parte dela que envelhece. */}
                  <Txt v="micro" c={c.tx4} style={{ marginTop: 4 }}>{p.by} · {fmtDate(new Date(p.t))}</Txt>
                </View>
                <View style={{ marginTop: 3 }}><Chevron /></View>
              </Row>
            </Pressable>
          ))}
        </Cartao>

        {/* ---- documentos ----

            ⚠️ ELES ABREM, e antes eram texto. Uma lista de exames e resumos
            numa tela de tratamento é a primeira coisa em que alguém toca —
            e nenhum dos três respondia. Não era porta emparedada por não
            ter seta: era pior, porque parecia leitura e guardava conteúdo.

            ⚠️ E A DATA DESCEU PARA O SUBTÍTULO. Ela morava à direita,
            encostada na seta, e as duas disputavam o mesmo canto: o olho
            batia numa data e num chevron grudados sem saber qual dos dois
            era o assunto. No subtítulo ela vira o que é — parte da
            descrição do documento, junto do tipo.

            Com isso a linha vira uma <Linha> da casa, sem desenho próprio:
            ícone solto, título, subtítulo, seta. Uma peça a menos para
            divergir do resto do aplicativo. */}
        {/* ---- o que a clínica mandou ----

            ⚠️ A TELA SÓ TINHA UMA DIREÇÃO. Prescrições e Documentos são o
            que saiu de você e o que ficou registrado sobre você; o que a
            clínica MANDOU — o guia do enjoo, o vídeo da aplicação, o
            protocolo alimentar — vivia só na aba Cuidado. Numa tela que se
            chama área médica, o material que a equipe preparou não devia
            estar em outro lugar.

            ⚠️ A MESMA FILEIRA DA ABA CUIDADO, e por um tempo foi lista.
            O argumento da lista era que aqui o material é acervo e lá é
            vitrine — e é verdade que as duas telas o usam diferente, mas
            não é verdade que isso mude a PEÇA. Um guia de dois minutos com
            um motivo escrito embaixo é um cartão nas duas; transformá-lo
            em linha aqui fazia a mesma coisa ter duas aparências no mesmo
            aplicativo, que é o defeito que este arquivo passou a sessão
            inteira removendo.

            ⚠️ O MOTIVO VEM ANTES DO FORMATO. "Para a fase de titulação" é
            o que separa curadoria de biblioteca: sem ele o cartão diz o
            que a coisa É, com ele diz por que ela está aqui. O tipo e o
            tamanho vêm depois porque respondem "quanto tempo isso vai me
            tomar", que é a segunda pergunta.

            ⚠️ E SOME SEM VÍNCULO, como na aba Cuidado: sem clínica não há
            quem tenha montado nada, e `materials` só se enche pelo outro
            lado. */}
        {!!materiais.length && clinicaConectada(S) && (
          <>
            <Txt v="h2" style={{ marginTop: 32, marginBottom: 10 }}>O que a clínica preparou</Txt>
            <ScrollView
              horizontal showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -16 }}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
            >
              {materiais.map((m) => (
                <Pressable key={m.name} onPress={go('/protocolos')} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                  <View style={{
                    width: LARGURA_DO_CARD, minHeight: 148, backgroundColor: c.bg1,
                    borderRadius: radius.lg, padding: 16, justifyContent: 'space-between',
                  }}>
                    {/* o ícone diz o formato antes do rótulo dizer: vídeo,
                        guia e checklist se consomem de maneiras diferentes,
                        e saber isso antes de tocar evita abrir a coisa
                        errada com pressa */}
                    <Icon name={m.ic} size={18} color={c.accent} sw={1.9} />
                    <View style={{ marginTop: 12 }}>
                      <Txt v="caption" style={{ lineHeight: 21 }} numberOfLines={2}>{m.name}</Txt>
                      <Txt v="micro" c={c.accent2} style={{ marginTop: 6, lineHeight: 16 }} numberOfLines={2}>{m.motivo}</Txt>
                      <Txt v="micro" c={c.tx4} style={{ marginTop: 6 }}>{m.kind} · {m.meta}</Txt>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        <Txt v="h2" style={{ marginTop: 32, marginBottom: 10 }}>Documentos e exames</Txt>
        <Cartao>
          {S.documents.map((d: any, i: number) => (
            <Linha
              key={`${d.name}-${i}`}
              ic="doc"
              titulo={d.name}
              sub={`${d.kind} · ${fmtDate(new Date(d.t))}`}
              onPress={go(destinoDoDocumento(d.kind))}
            />
          ))}
        </Cartao>
      </View>
    </TelaInterna>
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
  const foto = fotoDe(ficha.id);
  if (foto) {
    return (
      <Image
        source={foto}
        style={{ width: lado, height: lado, borderRadius: radius.md, backgroundColor: c.bg2 }}
        contentFit="cover"
        /* ⚠️ O ENQUADRAMENTO VEM DA FOTO, e não desta tela. Cada imagem
           sabe se o rosto dela está no topo ou no meio do quadro; a tela
           só pergunta. Era `contentPosition` cravado aqui, e cada tela
           cravava um valor diferente para a mesma pessoa.

           ⚠️ E NENHUM FOCO RESOLVE O QUADRADO PEQUENO COM FOTO DE CORPO
           INTEIRO: 76px de largura deixam o rosto com uns doze. Isso não é
           enquadramento, é recorte — e recorte se faz na hora do envio.
           Está em PENDENCIAS. */
        contentPosition={focoDe(ficha.id)}
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
