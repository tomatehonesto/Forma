import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { alertasAtivos } from '../logic/alertas';
import { lerNotificacao, type NotificacaoLida, type Origem } from '../logic/notificacoes';
import { relDay } from '../logic/time';
import { Txt, Row, Vazio } from '../ui/kit';
import { TelaInterna, Titulao, Chips, Bloco, Cartao, Linha } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { T } from '../textos';

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
   blocos em vez de ler a sequência.

   O FILTRO É O QUE A COR TENTAVA SER. A origem do aviso é informação
   útil — "o que a minha equipe me mandou?" é uma pergunta que alguém faz
   —, e ela estava codificada num tom de pastilha que ninguém decifra. Em
   pastilhas de filtro, a mesma informação vira uma pergunta que se
   responde com um toque.

   ⚠️⚠️ E NADA AQUI ESTAVA NO CATÁLOGO. O título, as pastilhas, o vazio e
   a linha de lembretes eram português escrito na tela — e a lista também,
   porque cada notificação era gravada no estado como frase pronta. Agora
   a lista guarda o fato e a frase é montada na hora, no idioma de agora.
   Ver logic/notificacoes.
   ============================================================ */

const K = () => T.alertas.telaNotificacoes;

/* As origens, com o nome que a pessoa lê. Só aparecem as que existem na
   lista: pastilha de filtro que devolve tela vazia é um caminho sem
   saída, e uma origem sem nenhum aviso não tem por que ser oferecida.

   ⚠️ É FUNÇÃO, porque lê o catálogo — constante de módulo congelaria o
   idioma no import. E três delas usam o nome da tela para onde o toque
   leva: a pastilha e o destino não podem se chamar de dois jeitos. */
const ORIGENS = (): { id: Origem; label: string }[] => [
  { id: 'trat', label: K().origemTratamento },
  { id: 'clin', label: K().origemMensagens },
  { id: 'ia', label: T.comum.abas.insights },
  { id: 'conquista', label: T.conquistas.tela.titulo },
  { id: 'exame', label: T.exames.tela.titulo },
];

/* Só três origens levam a algum lugar. As outras são recado, e recado
   que não abre nada não ganha toque nem seta — chevron que não leva a
   lugar nenhum cobra um toque para revelar que não há. */
const DESTINO: Partial<Record<Origem, string>> = { trat: '/aplicacoes', exame: '/exames', conquista: '/conquistas' };

export default function Notificacoes() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const [aba, setAba] = useState('todos');

  const nRem = alertasAtivos(S);

  /* ⚠️ SEM `useMemo`. A frase depende do idioma, e a prévia de idioma
     do desenvolvimento troca o idioma sem trocar o estado — uma lista
     guardada pelo estado continuaria na língua de antes. São poucas
     linhas; escrever de novo a cada desenho não custa nada. */
  const todos = ((S.notifications ?? []) as any[])
    .map((n) => lerNotificacao(S, n))
    .filter((n): n is NotificacaoLida => n != null);

  const chips = [
    { id: 'todos', label: K().todos, n: todos.length },
    ...ORIGENS()
      .map((o) => ({ ...o, n: todos.filter((x) => x.origem === o.id).length }))
      .filter((o) => o.n > 0),
  ];

  /* A ABA ESCOLHIDA PODE DEIXAR DE EXISTIR. Quem filtrou por Exames e
     volta depois que o último saiu da lista ficaria olhando um vazio sem
     entender por quê. Sem a pastilha, a tela volta para Todos. */
  const filtro = chips.some((x) => x.id === aba) ? aba : 'todos';
  const lista = filtro === 'todos' ? todos : todos.filter((x) => x.origem === filtro);

  return (
    <TelaInterna titulo={K().titulo}>
      <Titulao titulo={K().titulo} lead={K().lead} />

      {/* Com uma origem só na lista, o filtro seria uma pastilha de
          "Todos" e mais nada — um controle que não controla. */}
      {chips.length > 2 ? <Chips itens={chips} valor={filtro} onChange={setAba} /> : null}

      {lista.length ? (
        <Cartao>
          {lista.map((n, i) => {
            const to = DESTINO[n.origem];
            const corpo = (
              /* AVISO NÃO É LINHA DE NAVEGAÇÃO, e por isso não usa a linha
                 de lista do app: ele tem data, e data quer o canto de cima.

                 Com o quando na coluna da direita, como a linha comum faz
                 com o chevron, ele roubava largura do texto na altura toda
                 — o título quebrava em duas e o corpo era cortado no meio
                 da frase, justamente nos avisos mais longos, que são os que
                 têm algo a dizer. Aqui a data divide só a primeira linha
                 com o título, e o corpo corre embaixo na largura inteira. */
              <Row gap={12} style={{ alignItems: 'flex-start', paddingHorizontal: 16, paddingVertical: 14 }}>
                <View style={{ width: 28, alignItems: 'center', paddingTop: 2 }}>
                  <Icon name={n.ic} size={20} color={c.tx2} sw={1.8} />
                </View>
                <View style={{ flex: 1 }}>
                  <Row gap={10} style={{ alignItems: 'baseline' }}>
                    <Txt v="bodyMed" style={{ flex: 1 }}>{n.titulo}</Txt>
                    <Txt v="micro" c={c.tx4}>{relDay(new Date(n.t))}</Txt>
                  </Row>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 2, lineHeight: 20 }}>{n.corpo}</Txt>
                </View>
              </Row>
            );
            /* A chave leva a posição junto: duas conquistas fechadas na
               mesma comemoração saem com o mesmo instante. */
            const chave = `${n.t}-${i}`;
            if (!to) return <View key={chave}>{corpo}</View>;
            return (
              <Pressable key={chave} onPress={() => router.push(to as any)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                {corpo}
              </Pressable>
            );
          })}
        </Cartao>
      ) : (
        <Vazio ic="bell" titulo={K().vazio} texto={K().vazioTexto} />
      )}

      <Bloco titulo={T.alertas.telaLembretes.titulo}>
        <Cartao>
          <Linha
            ic="bell" titulo={K().configurar}
            sub={K().ligados(nRem)}
            onPress={() => router.push('/lembretes' as any)}
          />
        </Cartao>
      </Bloco>

      {/* NÃO HÁ RECADO SOBRE LEMBRETES AQUI. "Um aviso é um convite, não
          uma cobrança" é a única frase da tela que não fala do que está
          nela: esta lista é o que JÁ chegou, e aquilo é uma promessa sobre
          o que vai chegar. Ela mora em Lembretes, que é onde se decide o
          que vem — e dita duas vezes, no fim de duas telas vizinhas, ela
          vira o app repetindo a própria boa intenção. */}
    </TelaInterna>
  );
}
