import React from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { periodoDaConsulta } from '../logic/derive';
import { Txt, Row, Card } from '../ui/kit';
import { TelaInterna, Titulao, Cartao, Linha } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { dataComAno } from '../logic/time';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.cuidado.telaConsulta;

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
      <TelaInterna titulo={K().titulo} tituloFixo>
        <Txt v="note" c={c.tx3} style={{ lineHeight: 23 }}>
          {K().naoEstaMais}
        </Txt>
      </TelaInterna>
    );
  }

  return (
    <TelaInterna titulo={dataComAno(p.t)}>
      {/* ⚠️ A MANCHETE É A DATA, e não a palavra "Consulta". O que
          distingue esta tela de outra do mesmo tipo é QUANDO foi — e a
          barra de cima já carrega a mesma data para quando a manchete
          subir. O tipo vira a sobrelinha, que é o papel dele: enquadrar a
          leitura antes da primeira linha.

          ⚠️ E SUMIU O DIA DA SEMANA. "ter" sozinho, sob "18 de agosto de
          2026", não situa ninguém: ele serve quando a data é próxima e a
          pessoa pensa em dias da semana, não num registro de meses
          atrás. */}
      <View>
        <Row gap={6} style={{ marginBottom: 8 }}>
          <Icon name="steth" size={14} color={c.accent} sw={2} />
          <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>{p.tipo.toUpperCase()}</Txt>
        </Row>
        <Titulao titulo={dataComAno(p.t)} />
      </View>

      {/* ---- a nota ----

          Em itálico e entre aspas, como a última orientação na aba
          Cuidado: é a mesma natureza de conteúdo — alguém escreveu — e
          duas aparências para frases escritas seria o começo de duas. */}
      {p.nota ? (
        <Card>
          <Txt v="body" style={{ lineHeight: 25, fontStyle: 'italic' }}>{T.comum.citacao(p.nota)}</Txt>
        </Card>
      ) : null}

      {/* ---- o intervalo ---- */}
      <View style={{ gap: 12 }}>
        <View>
          <Txt v="h2">{p.emAberto ? K().desdeEntao : K().ateASeguinte}</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 6, lineHeight: 21 }}>
            {p.emAberto ? K().desdeEntaoSub : K().ateASeguinteSub(dataComAno(p.ate))}
          </Txt>
        </View>

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
          <Txt v="caption" c={c.tx3} style={{ lineHeight: 21 }}>{K().semRegistro}</Txt>
        </Card>
      )}
      </View>
    </TelaInterna>
  );
}
