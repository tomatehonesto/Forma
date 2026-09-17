import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { alertasAtivos } from '../logic/alertas';
import { relDay } from '../logic/time';
import { Screen, Txt, Row, CircleBtn, ListRow, Grupo } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   NOTIFICAÇÕES — o que o app veio te contar

   Era uma pilha de cards soltos, um por aviso, cada um com o ícone dentro
   de uma pastilha colorida por origem: azul para tratamento, roxo para
   clínica, outro azul para a inteligência. Quatro cores para quatro
   remetentes é paleta sem significado — ninguém aprende esse código, e
   quem aprendesse não ganharia nada com ele. Some a cor, fica o ícone,
   que já diz de que assunto é cada aviso.

   E UMA LISTA É UM CARD, não seis. Card por item transforma seis avisos
   em seis blocos flutuando com espaço igual entre eles, e o olho conta
   blocos em vez de ler a sequência. É o mesmo desenho do diário de
   refeições e do perfil — o vocabulário de lista do app.
   ============================================================ */

export default function Notificacoes() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();

  /* Só dois tipos de aviso levam a algum lugar. Os outros são recado, e
     recado que não abre nada não ganha toque nem seta — chevron que não
     leva a lugar nenhum cobra um toque para revelar que não há. */
  const navOf: Record<string, string> = { trat: '/aplicacoes', exame: '/exames' };
  const nRem = alertasAtivos(S);

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <Txt v="h1" style={{ flex: 1 }}>Notificações</Txt>
      </Row>
      {/* O SUBTÍTULO EM LINHA PRÓPRIA. Ao lado do botão de voltar ele
          dividia a largura com o título e com o círculo, e terminava
          cortado no meio da palavra. */}
      <Txt v="caption" c={c.tx3} style={{ marginTop: 12 }}>
        O que o app te contou nos últimos dias.
      </Txt>

      <Grupo>
        {S.notifications.map((n: any) => {
          const to = navOf[n.kind];
          const corpo = (
            /* AVISO NÃO É LINHA DE NAVEGAÇÃO, e por isso não usa a linha
               de lista do app: ele tem data, e data quer o canto de cima.

               Com o quando na coluna da direita, como a linha comum faz
               com o chevron, ele roubava largura do texto na altura toda —
               o título quebrava em duas e o corpo era cortado no meio da
               frase, justamente nos avisos mais longos, que são os que têm
               algo a dizer. Aqui a data divide só a primeira linha com o
               título, e o corpo corre embaixo na largura inteira. */
            <Row gap={12} style={{ alignItems: 'flex-start' }}>
              <View style={{ width: 32, alignItems: 'center', paddingTop: 2 }}>
                <Icon name={n.ic} size={20} color={c.tx2} sw={1.8} />
              </View>
              <View style={{ flex: 1 }}>
                <Row gap={10} style={{ alignItems: 'baseline' }}>
                  <Txt v="body" style={{ flex: 1 }}>{n.title}</Txt>
                  <Txt v="micro" c={c.tx4}>{relDay(new Date(n.t))}</Txt>
                </Row>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 2, lineHeight: 20 }}>{n.body}</Txt>
              </View>
            </Row>
          );
          if (!to) return <View key={n.t}>{corpo}</View>;
          return (
            <Pressable key={n.t} onPress={() => router.push(to as any)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              {corpo}
            </Pressable>
          );
        })}
      </Grupo>

      <Grupo title="Lembretes">
        <ListRow
          ic="bell" title="Configurar lembretes"
          sub={nRem ? `${nRem} alerta${nRem === 1 ? '' : 's'} ligado${nRem === 1 ? '' : 's'}` : 'Nenhum alerta ligado'}
          onPress={() => router.push('/lembretes' as any)}
        />
      </Grupo>

      <Row gap={7} style={{ marginTop: 16, alignItems: 'flex-start' }}>
        <Icon name="info" size={14} color={c.tx4} sw={1.8} />
        <Txt v="micro" c={c.tx4} style={{ flex: 1, lineHeight: 17 }}>
          Lembretes acolhem, não cobram — você escolhe o quê, quando, e pode adiar sempre.
        </Txt>
      </Row>
    </Screen>
  );
}
