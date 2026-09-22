import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { libraryPicks } from '../logic/derive';
import { Screen, Txt, Card, Row, CircleBtn, Pill, Vazio } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { T } from '../textos';

/* ============================================================
   A BIBLIOTECA

   ⚠️⚠️ ELA MOSTRAVA QUATRO ARTIGOS FALSOS. Estavam escritos aqui, numa
   constante de módulo, com os números da semente dentro: "Você está aqui
   · 5 mg", "Passando pros 5 mg: o que esperar". Quem estivesse em 2,5 mg
   lia a tela de outra pessoa.

   E a biblioteca de VERDADE já existia: sete leituras em
   textos/<local>/companion, traduzidas em cinco idiomas, montadas por
   `libraryPicks` em logic/derive conforme a fase do ciclo, o enjoo da
   semana, a média de proteína, a média de sono, a semana do tratamento e
   a consulta marcada. Ninguém chamava a função.

   Traduzir a maquete teria sido o pior dos dois mundos — cinco cópias de
   um texto inventado, ao lado de sete leituras reais que continuariam
   sem uso.

   ⚠️ CADA LEITURA TRAZ O MOTIVO DELA, e é o que separa isto de um blog:
   `motivo` diz por que ela aparece HOJE, com o número da pessoa dentro
   ("Você está no dia 5 do ciclo, quando a fome volta"). Conteúdo sem
   motivo visível é lista de artigos, que é justamente o que o subtítulo
   promete que esta tela não é.

   ⚠️ E ELA PODE VIR VAZIA, o que a maquete não podia. Quem está no meio
   do ciclo, dormindo bem, com a proteína em dia e sem consulta marcada
   não tem leitura que se justifique — e o vazio aqui é boa notícia.
   ============================================================ */

export default function Biblioteca() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();

  const K = T.companion.biblioteca.tela;
  const leituras = libraryPicks(S);

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">{K.titulo}</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{K.sub}</Txt>
        </View>
      </Row>

      {leituras.length ? (
        <View style={{ marginTop: 16, gap: 12 }}>
          {leituras.map((it, i) => (
            <Card key={it.titulo} tint={i === 0 ? c.accentWeak : undefined}>
              <Row gap={6}>
                <Icon name={it.ic} size={14} color={c.accent} sw={2} />
                {/* O motivo em caixa alta, como o chapéu das descobertas:
                    é a etiqueta que diz por que este cartão está aqui. */}
                <Txt v="micro" c={c.accent} style={{ letterSpacing: 0.6 }}>{it.motivo.toUpperCase()}</Txt>
              </Row>
              <Txt v="h2" style={{ marginTop: 9 }}>{it.titulo}</Txt>
              <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 5, lineHeight: 20 }}>{it.desc}</Txt>
              <Row style={{ marginTop: 12 }}>
                {/* ⚠️ O TEMPO DE LEITURA ERA "3 min" PARA OS QUATRO, e é o
                    tipo de número que um aplicativo não deve inventar.
                    Agora vem de `libraryPicks`, que o declara por leitura. */}
                <Pill icon="book" label={K.minDeLeitura(it.min)} color={c.tx3} bg={c.bg2} />
              </Row>
            </Card>
          ))}
        </View>
      ) : (
        <View style={{ marginTop: 16 }}>
          <Vazio ic="book" titulo={K.vazioTitulo} texto={K.vazioTexto} />
        </View>
      )}
    </Screen>
  );
}
