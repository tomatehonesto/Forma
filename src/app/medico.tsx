import React from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import {
  protocoloDaSemana, exameNoProtocolo, penStock, fichaDaEquipe,
} from '../logic/derive';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Chevron, Divider } from '../ui/kit';
import { Linha } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { RETRATOS, inicialDoNome } from '../ui/retratos';
import { useTheme } from '../ui/useTheme';
import { useAurora } from '../ui/aurora';
import { fmtWD, fmtDate, relDay } from '../logic/time';
import { radius, alfa } from '../theme';

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

  const aurora = useAurora();

  const equipe = fichaDaEquipe(S);
  const responsavel = equipe.find((f) => f.responsavel);
  const outros = equipe.filter((f) => !f.responsavel);

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

          ⚠️ ELE ERA UMA LINHA DE LISTA, e virou a peça da tela.

          Foto de 62 px, nome, chevron, e três retângulos chapados
          embaixo: o desenho de um item de configuração, numa tela cuja
          primeira pergunta é "quem cuida de mim?". A pessoa que abre isto
          quer ver alguém, e via uma linha.

          A aurora é a mesma imagem que abre a Home e o Insights, na cor
          que a pessoa escolheu — a mesma peça, e de graça. O retrato
          sangra pela direita e é cortado pelo cartão, como na ficha.

          ⚠️ TODO `Txt` AQUI DENTRO PRECISA DE `c`. Sobre a aurora a tinta
          é branca, e `Txt` sem cor cai no `useTheme()` — no tema claro o
          texto sairia escuro sobre a imagem e sumiria. É o mesmo defeito
          que já apagou quatro textos da tela de planos.

          ⚠️ E O CARTÃO TEM DOIS ALVOS. O bloco do nome leva à ficha; a
          fileira de ações, não. Tocar em "Protocolos" não pode cair no
          perfil por a peça inteira ser tocável. */}
      <View style={{ paddingHorizontal: 20 }}>
        <Row style={{ marginTop: 4 }} gap={12}>
          <CircleBtn name="back" onPress={() => router.back()} />
          <Txt v="title" style={{ flex: 1 }}>Sua equipe</Txt>
        </Row>

        {responsavel ? (
          <View style={{
            /* ⚠️ 272 É MEDIDO, E NÃO ESCOLHIDO: o bloco do nome pede 182 px
               com o nome em duas linhas, e a faixa de ações pede 90. Com 236
               a faixa era cortada por baixo e os rótulos sumiam — ficavam
               três círculos sem nome, que é pior do que não ter ícone.

               Nome de três linhas estoura de novo. Quem encostar aqui mede
               os dois blocos antes de mexer. */
            marginTop: 16, height: 272, borderRadius: radius.card, overflow: 'hidden',
            backgroundColor: c.bg1,
          }}>
            <Image source={aurora.hero} style={StyleSheet.absoluteFill} contentFit="cover" />
            {/* Véu para a tinta branca ficar legível onde a aurora clareia,
                mais pesado embaixo, onde as ações encostam. */}
            <LinearGradient
              colors={[alfa(c.veu, 0.42), alfa(c.veu, 0.28), alfa(c.veu, 0.72)]}
              locations={[0, 0.45, 1]}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />

            <RetratoSangrado ficha={responsavel} />

            <View style={{ flex: 1, justifyContent: 'space-between' }}>
              <Pressable onPress={go('/especialista')} style={({ pressed }) => [{ padding: 18, opacity: pressed ? 0.75 : 1 }]}>
                <View style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: radius.pill, paddingHorizontal: 11, paddingVertical: 5 }}>
                  <Txt v="micro" c="#FFFFFF">Sua especialista</Txt>
                </View>
                <Txt v="h1" c="#FFFFFF" numberOfLines={2} style={{ fontSize: 26, lineHeight: 31, marginTop: 10, maxWidth: 190 }}>
                  {responsavel.nome}
                </Txt>
                {!!responsavel.papel && (
                  <Txt v="caption" c="rgba(255,255,255,0.86)" numberOfLines={1} style={{ marginTop: 5 }}>
                    {responsavel.papel}
                  </Txt>
                )}
                {!!S.profile.clinic && (
                  <Txt v="caption" c="rgba(255,255,255,0.62)" numberOfLines={1}>{S.profile.clinic}</Txt>
                )}
              </Pressable>

              {/* ⚠️ A FAIXA TEM FUNDO PRÓPRIO, e não é enfeite: sem ele o
                  rótulo "Protocolos" caía em cima do jaleco branco do
                  retrato e sumia. Texto branco sobre uma foto só é legível
                  quando alguém garante o que está atrás dele — e numa peça
                  em que a foto é conteúdo, o véu do cartão não basta, ele
                  clareia junto com a imagem.

                  Ela sangra de ponta a ponta, o que também resolve o
                  desenho: vira uma barra de ações, e não três botões
                  soltos boiando sobre uma pessoa.

                  ⚠️ TRÊS AÇÕES, E NÃO QUATRO. O desenho de referência tem
                  uma quarta, "Clínica", que abre uma página com endereço,
                  telefone, site e Instagram — e o estado guarda da clínica
                  só o nome. Três que abrem valem mais do que quatro com
                  uma parada. */}
              <Row
                gap={4}
                style={{
                  backgroundColor: alfa(c.veu, 0.62),
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: 'rgba(255,255,255,0.14)',
                  paddingVertical: 12, paddingHorizontal: 8,
                }}
              >
                {([
                  ['companion', 'Mensagem', '/conversa'],
                  ['cal', 'Consultas', '/consultas'],
                  ['doc', 'Protocolos', '/protocolos'],
                ] as [string, string, string][]).map(([ic, label, to]) => (
                  <Pressable key={label} onPress={go(to)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.6 : 1 }]}>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{
                        width: 42, height: 42, borderRadius: 21,
                        backgroundColor: 'rgba(255,255,255,0.94)',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon name={ic} size={19} color="#14161C" sw={1.9} />
                      </View>
                      <Txt v="micro" c="rgba(255,255,255,0.92)" numberOfLines={1} style={{ marginTop: 6 }}>{label}</Txt>
                    </View>
                  </Pressable>
                ))}
              </Row>
            </View>
          </View>
        ) : null}
      </View>

      {/* ---- próximos passos ---- */}
      <Txt v="h2" style={{ marginTop: 30, marginBottom: 12, paddingHorizontal: 20 }}>Próximos passos</Txt>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
      >
        {/* ⚠️ O ÍCONE SOLTO, E NÃO NUMA PASTILHA DE COR. Numa fila de
            quatro, o quadradinho azul repetido vira uma coluna de botões
            — e nenhum deles é botão: quem leva a algum lugar é o cartão
            inteiro. O peso ia todo para a moldura, que é a única parte da
            peça que não diz nada. É a mesma regra das listas da casa.

            E a seta no canto diz que o cartão é porta, que era o que a
            pastilha estava tentando dizer errado. */}
        {passos.map((p) => (
          <Pressable key={p.titulo} onPress={go(p.to)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <View style={{
              width: 164, height: 132, backgroundColor: c.bg1,
              borderRadius: radius.lg, padding: 15, justifyContent: 'space-between',
            }}>
              <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Icon name={p.ic} size={20} color={c.accent} sw={1.9} />
                <Icon name="chev" size={13} color={c.tx4} sw={2.2} />
              </Row>
              <View>
                <Txt v="bodyMed" numberOfLines={2}>{p.titulo}</Txt>
                <Txt v="micro" c={c.tx3} numberOfLines={2} style={{ marginTop: 3, lineHeight: 16 }}>{p.sub}</Txt>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 20 }}>
        {/* ---- o resumo ----

            ⚠️ ELE NÃO É UM CARTÃO DE PRÓXIMO PASSO, e por isso não entrou
            na fila acima. Os outros são coisas a fazer; este é a coisa
            que se LEVA para elas — o único conteúdo desta tela que
            atravessa para o outro lado. Na fila ele viraria o quinto
            item de uma lista que se rola; aqui ele é o que a tela pede.

            ⚠️ E ELE JÁ PROMETEU UM RESUMO "PRONTO NA VÉSPERA", e não há
            véspera nenhuma: o resumo se monta dos registros na hora em
            que a tela abre, hoje, amanhã ou daqui a um mês. */}
        <Card style={{ marginTop: 24 }} tint={c.accentWeak}>
          <Row gap={6}>
            <Icon name="aura" size={13} color={c.accent} sw={2} />
            <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>PARA LEVAR À CONSULTA</Txt>
          </Row>
          <Txt v="bodyMed" c={c.tx2} style={{ marginTop: 8, lineHeight: 20 }}>
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
      </View>

      {/* ---- a equipe ----

          ⚠️ CADA PESSOA LEVA À FICHA DELA, que é o que esta seção não
          fazia. Eram quatro nomes listados e nenhum tocável — quem quisesse
          saber quem é a enfermeira que orienta a aplicação tinha onde ler
          o nome e mais nada.

          A responsável não se repete aqui: ela é o cabeçalho. */}
      {outros.length ? (
        <>
          <Txt v="h2" style={{ marginTop: 32, marginBottom: 12, paddingHorizontal: 20 }}>Quem mais acompanha você</Txt>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
          >
            {outros.map((f) => (
              <Pressable key={f.id} onPress={go(`/especialista?id=${f.id}`)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                <View style={{ width: 152, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16, alignItems: 'center' }}>
                  <Retrato ficha={f} lado={76} />
                  <Txt v="bodyMed" numberOfLines={1} style={{ marginTop: 13 }}>{f.nome}</Txt>
                  <Txt v="micro" c={c.tx3} numberOfLines={1} style={{ marginTop: 3 }}>{f.papel}</Txt>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </>
      ) : null}

      <View style={{ paddingHorizontal: 20 }}>
        {/* ---- prescrições ---- */}
        <Txt v="h2" style={{ marginTop: 32, marginBottom: 10 }}>Prescrições</Txt>
        {/* ⚠️ A AÇÃO MORA ONDE O ASSUNTO MORA, e não só na ponta de um link.
            Resolver o pedido de receita só pelo parâmetro atenderia quem
            chega pela Home e deixaria de fora quem rola até aqui e pensa
            "essa está vencendo". Fica no alto do cartão porque é o que se
            FAZ com prescrições; o resto da lista é o que se lê. */}
        <Card style={{ paddingVertical: 4 }}>
          <Linha
            ic="send"
            titulo="Pedir nova receita"
            sub="Abre uma mensagem para a equipe, para você revisar e enviar"
            onPress={go('/conversa?pedir=receita')}
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

        {/* ---- documentos ---- */}
        <Txt v="h2" style={{ marginTop: 32, marginBottom: 10 }}>Documentos e exames</Txt>
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
      </View>
    </Screen>
  );
}

/* O retrato dentro do cartão do alto: sangra pela direita e é cortado
   por ele, do mesmo jeito que sangra na ficha. Sem foto o cartão fica só
   com a aurora — a inicial gigante ali dentro competiria com o nome, que
   já está escrito ao lado em corpo grande. */
function RetratoSangrado({ ficha }: { ficha: { id: string } }) {
  const foto = RETRATOS[ficha.id];
  if (!foto) return null;
  return (
    <Image
      source={foto}
      /* ⚠️ ELE PARA ONDE A FAIXA COMEÇA, e não no fundo do cartão. Atrás
         da faixa o retrato só apareceria como um borrão escurecido por
         trás dos botões — e a parte dele que importa, o rosto, está em
         cima. Cortado na altura da barra, o corte lê como enquadramento. */
      style={{ position: 'absolute', right: -10, bottom: 90, width: 158, height: 176 }}
      contentFit="contain"
      contentPosition="bottom center"
      pointerEvents="none"
    />
  );
}

/* O retrato de alguém da equipe, ou a inicial de quem ainda não tem foto.
   Os dois desenhos no mesmo componente porque as duas telas que mostram
   gente precisam concordar: a mesma pessoa com foto numa e inicial na
   outra confunde sem que ninguém saiba dizer por quê. */
function Retrato({ ficha, lado }: { ficha: { id: string; nome: string }; lado: number }) {
  const { c } = useTheme();
  const foto = RETRATOS[ficha.id];
  if (foto) {
    return (
      <Image
        source={foto}
        style={{ width: lado, height: lado, borderRadius: lado / 2, backgroundColor: c.bg2 }}
        contentFit="cover"
        contentPosition="top center"
      />
    );
  }
  return (
    <View style={{
      width: lado, height: lado, borderRadius: lado / 2,
      backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center',
    }}>
      <Txt v="h2" c={c.accent} style={{ fontSize: lado * 0.38 }}>{inicialDoNome(ficha.nome)}</Txt>
    </View>
  );
}
