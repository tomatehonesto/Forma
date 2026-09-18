import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useStore } from '../logic/store';
import { checkins30, journeyDay } from '../logic/derive';
import { conquistas, feitas, aCaminho, type Conquista } from '../logic/conquistas';
import { relDay } from '../logic/time';
import { Txt, Row, Vazio } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Grade, Selo } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

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
   ============================================================ */

function Cartao({ q }: { q: Conquista }) {
  const { c } = useTheme();
  const on = q.t != null;
  return (
    <View style={{
      flex: 1, backgroundColor: c.bg1, borderRadius: radius.card,
      borderWidth: 1, borderColor: c.line, padding: 15, alignItems: 'center',
    }}>
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
      <Txt v="micro" c={c.tx3} style={{ marginTop: 3, textAlign: 'center', lineHeight: 16 }}>{q.desc}</Txt>

      {/* O SELO DESCE PARA O PÉ do cartão: os títulos têm uma ou duas
          linhas conforme o nome, e sem isso os dois de uma fileira
          terminavam em alturas diferentes. */}
      <View style={{ marginTop: 'auto', paddingTop: 12, width: '100%', alignItems: 'center' }}>
        {on ? (
          <Selo label={relDay(new Date(q.t!))} tom="lima" />
        ) : (
          <View style={{ width: '100%', gap: 7 }}>
            {/* A BARRA É O QUANTO ANDOU, e ela é fina e cinza de propósito:
                o assunto desta metade da tela é o que ainda não veio, e uma
                barra colorida faria o não-feito competir com o feito. */}
            <View style={{ height: 4, borderRadius: 2, backgroundColor: c.track, overflow: 'hidden' }}>
              <View style={{ width: `${Math.round(q.pct * 100)}%`, height: 4, backgroundColor: c.tx4 }} />
            </View>
            <Txt v="micro" c={c.tx3} numberOfLines={2} style={{ textAlign: 'center', lineHeight: 15 }}>{q.falta}</Txt>
          </View>
        )}
      </View>
    </View>
  );
}

export default function Conquistas() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();

  const todas = useMemo(() => conquistas(S), [S]);
  const done = feitas(todas);
  const faltam = aCaminho(todas);

  return (
    <TelaInterna titulo="Conquistas">
      <Titulao
        titulo="Conquistas"
        lead="Marcos que saem sozinhos do que você registrou — ninguém aqui decide se você merece."
      />

      <Row style={{ backgroundColor: c.accentWeak, borderRadius: radius.card, paddingVertical: 16 }}>
        {[
          [String(checkins30(S)), 'check-ins no mês'],
          [`${done.length}/${todas.length}`, 'conquistas'],
          [String(journeyDay(S)), 'dias de jornada'],
        ].map(([v, l], i) => (
          <View key={l} style={{ flex: 1, alignItems: 'center', borderLeftWidth: i ? 1 : 0, borderLeftColor: c.accentLine }}>
            <Txt v="h1" style={{ fontSize: 24 }}>{v}</Txt>
            <Txt v="micro" c={c.tx3} style={{ marginTop: 2, textAlign: 'center' }}>{l}</Txt>
          </View>
        ))}
      </Row>

      {/* "DESBLOQUEADAS" ERA PALAVRA DE JOGO, e contradizia a própria
          tela: aqui não há fase a vencer nem prêmio a liberar — há coisas
          que aconteceram no tratamento de alguém. */}
      <Bloco titulo="Já conquistadas">
        {done.length ? (
          <Grade cols={2} gap={12}>
            {done.map((q) => <Cartao key={q.id} q={q} />)}
          </Grade>
        ) : (
          /* Quem abre no primeiro dia via um título e nada embaixo. A frase
             não promete conquista nenhuma: diz onde ela vai aparecer, e a
             lista de "a caminho" logo abaixo já mostra quais são. */
          <Vazio ic="trophy" titulo="Nenhuma conquista ainda" texto="As que estão a caminho aparecem logo abaixo." />
        )}
      </Bloco>

      {faltam.length ? (
        <Bloco titulo="A caminho">
          <Grade cols={2} gap={12}>
            {faltam.map((q) => <Cartao key={q.id} q={q} />)}
          </Grade>
        </Bloco>
      ) : null}
    </TelaInterna>
  );
}
