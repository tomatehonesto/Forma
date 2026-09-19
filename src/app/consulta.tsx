import React from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { periodoDaConsulta } from '../logic/derive';
import { Screen, Txt, Row, CircleBtn, Card } from '../ui/kit';
import { Cartao, Linha } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { dataComAno } from '../logic/time';

/* ============================================================
   UMA CONSULTA QUE JÁ ACONTECEU

   ⚠️ ELA NÃO DIZ "O QUE VEIO DESTA CONSULTA", E A DIFERENÇA É TUDO.

   A tentação era ligar as coisas à consulta: a receita daquele dia foi
   dada ALI, a dose subiu POR CAUSA dela. Provavelmente sim — e
   "provavelmente" sobre a medicação de alguém não é coisa que este
   aplicativo possa afirmar. Ele não estava na sala. O que ele sabe é a
   data de cada registro, e data não é causa.

   Então a tela mostra um INTERVALO: o que aconteceu entre esta consulta e
   a seguinte. É verificável, e responde a mesma pergunta sem inventar a
   parte que falta — "o que mudou desde que eu estive lá" é, afinal, o que
   se quer saber ao abrir uma consulta passada.

   ⚠️ E A NOTA É A ÚNICA COISA AQUI QUE ALGUÉM ESCREVEU. Ela vem do
   histórico, entre aspas, no alto: o resto da tela é leitura de
   registros, e a nota é a voz de quem viveu a consulta. Misturá-la com as
   linhas derivadas faria as duas parecerem da mesma fonte.

   ⚠️ NADA AQUI ABRE NADA. Não é esquecimento: uma linha que diz "2
   aplicações" não tem tela própria, e mandá-la para a lista geral de
   aplicações tiraria a pessoa do período que ela veio ler. Sem seta, a
   lista se lê como o que é — um extrato.
   ============================================================ */

export default function Consulta() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const { t } = useLocalSearchParams<{ t?: string }>();

  const p = t ? periodoDaConsulta(S, Number(t)) : null;

  if (!p) {
    return (
      <Screen>
        <Row style={{ marginTop: 4 }} gap={12}>
          <CircleBtn name="back" onPress={() => router.back()} />
          <Txt v="title" style={{ flex: 1 }}>Consulta</Txt>
        </Row>
        <Txt v="note" c={c.tx3} style={{ marginTop: 28, lineHeight: 23 }}>
          Esta consulta não está mais no seu histórico.
        </Txt>
      </Screen>
    );
  }

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <Txt v="title" style={{ flex: 1 }}>Consulta</Txt>
      </Row>

      {/* ---- quando foi ---- */}
      <View style={{ marginTop: 22 }}>
        <Row gap={6}>
          <Icon name="steth" size={14} color={c.accent} sw={2} />
          <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>{p.tipo.toUpperCase()}</Txt>
        </Row>
        {/* ⚠️ SÓ A DATA, E TINHA O DIA DA SEMANA EMBAIXO. "ter" sozinho,
            sob "18 de agosto de 2026", não ajuda ninguém a situar nada —
            ele serve quando a data é próxima e a pessoa pensa em dias da
            semana ("seg, 28 set"), e não num registro de um ano atrás. */}
        <Txt v="h1" style={{ fontSize: 26, marginTop: 8 }}>{dataComAno(p.t)}</Txt>
      </View>

      {/* ---- a nota ----

          Em itálico e entre aspas, como a última orientação na aba
          Cuidado: é a mesma natureza de conteúdo — alguém escreveu — e
          duas aparências para frases escritas seria o começo de duas. */}
      {p.nota ? (
        <Card style={{ marginTop: 20 }}>
          <Txt v="body" style={{ lineHeight: 25, fontStyle: 'italic' }}>“{p.nota}”</Txt>
        </Card>
      ) : null}

      {/* ---- o intervalo ---- */}
      <Txt v="h2" style={{ marginTop: 32 }}>
        {p.emAberto ? 'Desde então' : 'Até a consulta seguinte'}
      </Txt>
      <Txt v="caption" c={c.tx3} style={{ marginTop: 6, marginBottom: 12, lineHeight: 21 }}>
        {p.emAberto
          ? 'O que os seus registros mostram deste dia até agora.'
          : `O que os seus registros mostram entre este dia e ${dataComAno(p.ate)}.`}
      </Txt>

      {p.mudancas.length ? (
        <Cartao>
          {p.mudancas.map((m) => (
            <Linha key={m.id} ic={m.ic} titulo={m.titulo} sub={m.sub} seta={false} />
          ))}
        </Cartao>
      ) : (
        /* ⚠️ VAZIO É UMA RESPOSTA, e não um erro. Um período sem registro
            nenhum quer dizer que nada foi registrado nele — e dizer isso é
            mais honesto do que esconder a seção e deixar a pessoa achando
            que a tela quebrou. */
        <Card>
          <Txt v="caption" c={c.tx3} style={{ lineHeight: 21 }}>
            Nenhum registro seu caiu neste período. O que ficou combinado na consulta está
            na anotação acima, se houver.
          </Txt>
        </Card>
      )}
    </Screen>
  );
}
