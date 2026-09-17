import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { checkins30, journeyDay, achDone } from '../logic/derive';
import { relDay } from '../logic/time';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Pill, Vazio } from '../ui/kit';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

export default function Conquistas() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const done = achDone(S), locked = S.achievements.filter((a: any) => !a.done);

  /* A MARCA CONQUISTADA É LIMA, como em toda tela deste app: é a cor do
     alcançado na Jornada, nas metas e na ficha do perfil. Ela estava azul
     aqui, que é a cor de ação — a mesma tinta do botão de registrar —, e
     com isso a grade pedia leitura em vez de dar a resposta de relance.
     Lima é feito, cinza é a caminho.

     E O SELO DESCE PARA O PÉ do cartão. Os títulos têm uma ou duas linhas
     conforme o nome, e sem isso o selo acompanhava o fim do texto: numa
     fileira de dois, um ficava no meio e o outro embaixo. Com a margem
     automática em cima, os cartões da mesma fileira terminam na mesma
     linha, que é o que faz uma grade parecer uma grade. */
  const AchCard = ({ a, on }: { a: any; on: boolean }) => (
    <View style={{ width: '48.5%', backgroundColor: c.bg1, borderRadius: radius.lg, borderWidth: 1, borderColor: c.line, padding: 15, marginTop: 12, alignItems: 'center', opacity: on ? 1 : 0.6 }}>
      <IconBadge name={a.ic} size={44} color={on ? c.tx : c.tx4} bg={on ? c.limeSoft : c.bg3} />
      <Txt v="title" style={{ marginTop: 10, textAlign: 'center' }}>{a.title}</Txt>
      <Txt v="micro" c={c.tx3} style={{ marginTop: 3, textAlign: 'center', lineHeight: 15 }}>{a.desc}</Txt>
      <View style={{ marginTop: 'auto', paddingTop: 10 }}>
        <Pill label={on ? relDay(new Date(a.t)) : 'em progresso'} color={on ? c.tx2 : c.tx3} bg={on ? c.limeSoft : c.bg2} />
      </View>
    </View>
  );

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <Txt v="h1" style={{ flex: 1 }}>Conquistas</Txt>
      </Row>
      {/* O SUBTÍTULO DIZIA "marcos da jornada — discretos, nunca
          infantis". A segunda metade era uma nota de projeto: a regra que
          nós seguimos ao desenhar a tela, escrita para quem lê o código, e
          entregue à pessoa como se fosse informação. Quem abre aqui quer
          saber de onde saem essas marcas — e a resposta é que ninguém as
          concede: elas caem sozinhas do que já foi registrado. */}
      <Txt v="caption" c={c.tx3} style={{ marginTop: 12 }}>
        Marcos que saem sozinhos do que você registrou — ninguém aqui decide se você merece.
      </Txt>

      <Card tint={c.accentWeak} style={{ marginTop: 18, paddingVertical: 16 }}>
        <Row>
          {[[String(checkins30(S)), 'check-ins no mês'], [`${done.length}/${S.achievements.length}`, 'conquistas'], [String(journeyDay(S)), 'dias de jornada']].map(([v, l], i) => (
            <View key={l} style={{ flex: 1, alignItems: 'center', borderLeftWidth: i ? 1 : 0, borderLeftColor: c.line }}>
              <Txt v="h1" style={{ fontSize: 24 }}>{v}</Txt>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 2, textAlign: 'center' }}>{l}</Txt>
            </View>
          ))}
        </Row>
      </Card>

      {/* "DESBLOQUEADAS" É PALAVRA DE JOGO, e contradizia a própria tela:
          aqui não há fase a vencer nem prêmio a liberar — há coisas que
          aconteceram no tratamento de alguém. */}
      <Txt v="h2" style={{ marginTop: 22 }}>Já conquistadas</Txt>
      {done.length === 0 ? (
        /* Quem abre no primeiro dia via um título e nada embaixo. A
           frase não promete conquista nenhuma: diz onde ela vai aparecer,
           e a lista de "a caminho" logo abaixo já mostra quais são. */
        <Vazio ic="trophy" titulo="Nenhuma conquista ainda" texto="As que estão a caminho aparecem logo abaixo." />
      ) : (
        <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {done.map((a: any) => <AchCard key={a.id} a={a} on />)}
        </Row>
      )}

      <Txt v="h2" style={{ marginTop: 22 }}>A caminho</Txt>
      <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {locked.map((a: any) => <AchCard key={a.id} a={a} on={false} />)}
      </Row>
    </Screen>
  );
}
