import React, { useMemo, useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { checkins30, journeyDay } from '../logic/derive';
import {
  conquistas, feitas, aCaminho, niveisFeitos, niveisTotais, FAMILIAS, type Conquista,
} from '../logic/conquistas';
import { relDay } from '../logic/time';
import { Txt, Row, Vazio } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Chips, Grade } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.conquistas.tela;

/* ============================================================
   CONQUISTAS

   ⚠️ ELAS ERAM UMA LISTA FIXA, com `done: true` escrito à mão no arquivo
   de exemplo. Cinco vinham marcadas como feitas — com data — desde o
   primeiro segundo do aplicativo, e quem instalasse hoje abriria a tela
   com "Primeiros 5% · há 30 dias" antes de ter se pesado uma vez. E a
   própria tela dizia "ninguém aqui decide se você merece", que era
   exatamente o contrário do que acontecia.

   Agora cada uma é uma conta sobre os registros, em
   src/logic/conquistas.ts — e some se o registro que a fechou for
   apagado, porque aí ela deixou de ter acontecido.

   O QUE FALTA VIROU O ASSUNTO DAS QUE FALTAM. Elas diziam "em progresso",
   que serve para qualquer uma delas em qualquer dia. Faltar dois quilos e
   faltar nove não são o mesmo estado, e a diferença é o que faz alguém
   continuar: agora cada uma traz a frase do que falta e uma barra com o
   quanto já andou.

   E SÃO TRINTA E QUATRO, o que muda o problema da tela. Com oito, duas
   grades resolviam; com trinta e quatro, "a caminho" vira um paredão em
   que a conquista a um passo fica perdida entre a de um ano de caneta.

   Duas coisas resolvem isso, e nenhuma delas é esconder. As que faltam
   vêm ordenadas DA MAIS PERTO PARA A MAIS LONGE — a que está a duzentos
   gramas é a única que muda o que alguém faz hoje. E as pastilhas de
   cima filtram por assunto, para quem veio ver de hidratação e não de
   aplicação: são as mesmas do Histórico e das Notificações, com a
   contagem de feitas em cada uma.
   ============================================================ */

function Cartao({ q, onPress }: { q: Conquista; onPress: () => void }) {
  const { c } = useTheme();
  const on = q.nivel > 0;
  const completa = q.nivel === q.niveis;
  return (
    /* O CARTÃO INTEIRO ABRE A TRILHA. Ele já mostra o nível e o que
       falta; o que ele não tem espaço para mostrar é o caminho até aqui,
       e é isso que o toque entrega. */
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{
        flex: 1, backgroundColor: c.bg1, borderRadius: radius.card,
        borderWidth: 1, borderColor: c.line, padding: 15, alignItems: 'center',
        opacity: pressed ? 0.7 : 1,
      }]}
    >
      {/* A MARCA CONQUISTADA É LIMA, como em toda tela deste app: é a cor
          do alcançado na Jornada, nas metas e na ficha do perfil. Cinza é
          a caminho. */}
      <View style={{
        width: 44, height: 44, borderRadius: 16,
        backgroundColor: on ? c.limeSoft : c.bg3,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={q.ic} size={21} color={on ? c.tx : c.tx4} sw={1.8} />
      </View>

      <Txt v="bodyMed" style={{ marginTop: 10, textAlign: 'center' }}>{q.titulo}</Txt>

      {/* AS BOLINHAS SÃO A TRILHA INTEIRA numa olhada. Com "nível 3 de 6"
          escrito, a pessoa lê dois números e faz a conta; com seis pontos e
          três cheios, ela vê. E o número continua logo abaixo para quem
          quiser a precisão — as duas formas dizem o mesmo, e a rápida vem
          primeiro. */}
      <Row gap={4} style={{ marginTop: 8, justifyContent: 'center' }}>
        {Array.from({ length: q.niveis }, (_, i) => (
          <View
            key={i}
            style={{
              width: 6, height: 6, borderRadius: 3,
              backgroundColor: i < q.nivel ? c.lime : c.bg3,
            }}
          />
        ))}
      </Row>
      <Txt v="micro" c={c.tx3} style={{ marginTop: 6, textAlign: 'center' }}>
        {on ? K().nivelDeTotal(q.nivel, q.niveis) : K().niveisTotal(q.niveis)}
      </Txt>
      <Txt v="micro" c={c.tx3} style={{ marginTop: 2, textAlign: 'center', lineHeight: 16 }}>{q.desc}</Txt>

      {/* O PÉ DO CARTÃO DIZ DUAS COISAS DIFERENTES conforme o estado, e as
          duas importam para quem está no meio da trilha: quando o nível
          atual veio, e quanto falta para o próximo. Os títulos têm uma ou
          duas linhas conforme o nome, e a margem automática faz os dois de
          uma fileira terminarem na mesma altura. */}
      <View style={{ marginTop: 'auto', paddingTop: 12, width: '100%', alignItems: 'center', gap: 8 }}>
        {/* A DATA É LEGENDA, e não veredito. Ela era uma pastilha lima, e
            o lima neste cartão já tem dono: o ícone e as bolinhas do nível.
            Três coisas em lima no mesmo cartão fazem o olho procurar qual
            delas é a notícia — e a notícia é o nível, não o dia em que ele
            caiu. Em texto pequeno e cinza, a data continua ali para quem
            for buscá-la. */}
        {on && q.t != null ? <Txt v="micro" c={c.tx4}>{relDay(new Date(q.t))}</Txt> : null}
        {completa ? (
          <Txt v="micro" c={c.tx4} style={{ textAlign: 'center' }}>{K().trilhaCompleta}</Txt>
        ) : (
          <View style={{ width: '100%', gap: 7 }}>
            {/* A BARRA É O TRECHO ATÉ O PRÓXIMO NÍVEL, e não a trilha
                inteira: de cinquenta para cem check-ins, estar em setenta é
                quarenta por cento do trecho — e mostrar setenta por cento
                seria uma barra quase cheia que não anda mais por trinta
                dias. */}
            <View style={{ height: 4, borderRadius: 2, backgroundColor: c.track, overflow: 'hidden' }}>
              <View style={{ width: `${Math.round(q.pct * 100)}%`, height: 4, backgroundColor: c.tx4 }} />
            </View>
            <Txt v="micro" c={c.tx3} numberOfLines={2} style={{ textAlign: 'center', lineHeight: 15 }}>{q.falta}</Txt>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default function Conquistas() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const [aba, setAba] = useState('todas');

  const todas = useMemo(() => conquistas(S), [S]);

  /* A CONTAGEM DA PASTILHA É DE FEITAS, e não do total. "Peso 8" quer
     dizer oito conquistas de peso na lista, o que é informação sobre o
     catálogo; "Peso 3" quer dizer três alcançadas, que é informação sobre
     a pessoa — e é ela que alguém vem conferir. */
  const chips = useMemo(() => [
    { id: 'todas', label: K().todas, n: feitas(todas).length },
    ...FAMILIAS()
      .map((f) => ({ id: f.id, label: f.nome, n: feitas(todas.filter((q) => q.familia === f.id)).length }))
      .filter((f) => todas.some((q) => q.familia === f.id)),
  ], [todas]);

  const lista = aba === 'todas' ? todas : todas.filter((q) => q.familia === aba);
  const done = feitas(lista);
  const faltam = aCaminho(lista);

  return (
    <TelaInterna titulo={K().titulo}>
      <Titulao titulo={K().titulo} lead={K().lead} />

      <Row style={{ backgroundColor: c.accentWeak, borderRadius: radius.card, paddingVertical: 16 }}>
        {/* O placar é sempre do TOTAL, e não do filtro: ele é o resumo da
            jornada, e mudar de número ao tocar numa pastilha faria parecer
            que a pessoa perdeu conquistas ao olhar para um assunto. */}
        {[
          [String(checkins30(S)), K().checkinsNoMes],
          [`${niveisFeitos(todas)}/${niveisTotais(todas)}`, K().niveis],
          [String(journeyDay(S)), K().diasDeJornada],
        ].map(([v, l], i) => (
          <View key={l} style={{ flex: 1, alignItems: 'center', borderLeftWidth: i ? 1 : 0, borderLeftColor: c.accentLine }}>
            <Txt v="h1" style={{ fontSize: 24 }}>{v}</Txt>
            <Txt v="micro" c={c.tx3} style={{ marginTop: 2, textAlign: 'center' }}>{l}</Txt>
          </View>
        ))}
      </Row>

      <Chips itens={chips} valor={aba} onChange={setAba} />

      {/* "DESBLOQUEADAS" ERA PALAVRA DE JOGO, e contradizia a própria
          tela: aqui não há fase a vencer nem prêmio a liberar — há coisas
          que aconteceram no tratamento de alguém. */}
      <Bloco titulo={K().conquistadas}>
        {done.length ? (
          <Grade cols={2} gap={12}>
            {done.map((q) => <Cartao key={q.id} q={q} onPress={() => router.push(`/trilha?id=${q.id}` as any)} />)}
          </Grade>
        ) : (
          /* Quem abre no primeiro dia via um título e nada embaixo. A frase
             não promete conquista nenhuma: diz onde ela vai aparecer, e a
             lista de "a caminho" logo abaixo já mostra quais são. */
          <Vazio ic="trophy" titulo={K().nenhumaAinda} texto={K().nenhumaAindaTexto} />
        )}
      </Bloco>

      {faltam.length ? (
        <Bloco titulo={K().aCaminho}>
          <Grade cols={2} gap={12}>
            {faltam.map((q) => <Cartao key={q.id} q={q} onPress={() => router.push(`/trilha?id=${q.id}` as any)} />)}
          </Grade>
        </Bloco>
      ) : null}
    </TelaInterna>
  );
}
