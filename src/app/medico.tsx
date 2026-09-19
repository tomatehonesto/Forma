import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useStore } from '../logic/store';
import {
  protocoloDaSemana, exameNoProtocolo, penStock, fichaDaEquipe,
} from '../logic/derive';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Chevron, Divider } from '../ui/kit';
import { Linha } from '../ui/internas';
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

          ⚠️ O RETRATO E O NOME LEVAM À FICHA; A FILEIRA DE AÇÕES NÃO.
          São alvos separados, e o de baixo ganha — tocar em "Protocolos"
          não pode cair no perfil por a peça inteira ser tocável.

          ⚠️ E SÃO TRÊS AÇÕES, E NÃO QUATRO. O desenho de referência tem
          uma quarta, "Clínica", que abre uma página de clínica com
          endereço, telefone, site e Instagram — e o estado guarda da
          clínica só o nome. Três que abrem valem mais do que quatro com
          uma parada. */}
      <View style={{ paddingHorizontal: 20 }}>
        <Row style={{ marginTop: 4 }} gap={12}>
          <CircleBtn name="back" onPress={() => router.back()} />
          <Txt v="h1" style={{ flex: 1 }}>Sua equipe</Txt>
        </Row>

        {responsavel ? (
          <Pressable onPress={go('/especialista')} style={({ pressed }) => [{ marginTop: 18, opacity: pressed ? 0.8 : 1 }]}>
            <Row gap={14} style={{ alignItems: 'center' }}>
              <Retrato ficha={responsavel} lado={62} />
              <View style={{ flex: 1 }}>
                <Txt v="title" numberOfLines={1}>{responsavel.nome}</Txt>
                <Txt v="caption" c={c.tx3} numberOfLines={1} style={{ marginTop: 2 }}>
                  {[responsavel.papel, S.profile.clinic].filter(Boolean).join(' · ')}
                </Txt>
              </View>
              <Chevron />
            </Row>
          </Pressable>
        ) : null}

        <Row gap={10} style={{ marginTop: 18 }}>
          {([
            ['companion', 'Mensagem', '/conversa'],
            ['cal', 'Consultas', '/consultas'],
            ['doc', 'Protocolos', '/protocolos'],
          ] as [string, string, string][]).map(([ic, label, to]) => (
            <Pressable key={label} onPress={go(to)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.6 : 1 }]}>
              <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, paddingVertical: 15, alignItems: 'center', gap: 8 }}>
                <Icon name={ic} size={19} color={c.accent} sw={1.9} />
                <Txt v="micro" c={c.tx2}>{label}</Txt>
              </View>
            </Pressable>
          ))}
        </Row>
      </View>

      {/* ---- próximos passos ---- */}
      <Txt v="h2" style={{ marginTop: 30, marginBottom: 12, paddingHorizontal: 20 }}>Próximos passos</Txt>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
      >
        {passos.map((p) => (
          <Pressable key={p.titulo} onPress={go(p.to)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <View style={{ width: 168, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16, gap: 10 }}>
              <View style={{ width: 36, height: 36, borderRadius: radius.sm, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={p.ic} size={18} color={c.accent} sw={1.9} />
              </View>
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
                <View style={{ width: 150, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16, alignItems: 'center' }}>
                  <Retrato ficha={f} lado={64} />
                  <Txt v="bodyMed" numberOfLines={1} style={{ marginTop: 12 }}>{f.nome}</Txt>
                  <Txt v="micro" c={c.tx3} numberOfLines={1} style={{ marginTop: 2 }}>{f.papel}</Txt>
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
