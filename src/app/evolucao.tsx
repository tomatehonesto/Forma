import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  startWeight, curWeight, lostKg, firstMeasure, latestMeasure,
  examBy, examFirst, examLast, examStatus, variacaoDe,
} from '../logic/derive';
import { nf, DAY, fmtDate } from '../logic/time';
import {
  TelaInterna, Titulao, Bloco, Chips, Cartao, Linha, Metrica, Grade2, CardCurva,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { pesoTxt, compTxt, compU, compN, pesoN, pesoU, pesoV, compV } from '../logic/medidas';

/* ============================================================
   EVOLUÇÃO — o índice de todos os números

   A tela separa os marcadores por QUEM OS PRODUZ, não por assunto:

     você registra — peso e as quatro circunferências. Têm histórico
       navegável e a pessoa pode corrigir ou apagar cada linha.
     vem de exame  — gordura, massa magra, HbA1c, pressão. Dependem de
       laudo ou de balança de bioimpedância, e são só leitura.

   A divisão importa porque muda o que a pessoa pode FAZER. Agrupar tudo
   como "seus números" prometeria a mesma coisa de itens que se comportam
   de formas diferentes.

   ⚠️⚠️ ELA ABSORVEU A /medidas, e as duas eram a mesma tela.

   Mesma divisão — "Você registra" contra "Vem de exame" e "Vem da
   balança" —, mesmo desenho de card, e cintura, gordura e massa magra
   apareciam nas duas. Esta aqui ainda tinha, no pé, um link "Todas as
   medidas" que levava a uma versão reduzida de si mesma.

   A /medidas só existia porque esta escondia três circunferências
   (quadril, braço, coxa) atrás daquele link. Com as cinco aqui, a
   pergunta que ela respondia — "quais medidas eu tenho?" — passa a ser a
   mesma que esta responde, e uma das duas era a mais.

   ⚠️ E OS QUATRO DE LEITURA PASSARAM A ABRIR. O comentário antigo
   defendia que eles NÃO abrissem, "para evitar a frustração de tocar num
   card que não abre nada" — e o argumento estava certo enquanto não
   havia para onde levar. Só que os mesmos quatro já eram tocáveis na
   Jornada, no card de "O que já mudou": o aplicativo dizia duas coisas
   sobre as mesmas quatro medidas. Hoje todos têm tela, e a resposta é
   uma só.
   ============================================================ */

/* As quatro da fita, na ordem em que a fita passa. */
const CIRC: [string, string][] = [
  ['cintura', 'Cintura'],
  ['quadril', 'Quadril'],
  ['braco', 'Braço'],
  ['coxa', 'Coxa'],
];


const PERIODOS = [
  { id: '12s', label: '12 semanas', dias: 84 },
  { id: '3m', label: '3 meses', dias: 91 },
  { id: 'tudo', label: 'Tudo', dias: Infinity },
];

export default function Evolucao() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const [per, setPer] = useState('12s');

  const corte = PERIODOS.find((p) => p.id === per)!.dias;
  const desde = corte === Infinity ? -Infinity : Date.now() - corte * DAY;

  const pesos = (S.weights as any[]).filter((w) => w.t >= desde).map((w) => ({ t: w.t, v: w.kg }));
  const medidas = (S.measures as any[]).filter((m) => m.t >= desde);

  const fm: any = firstMeasure(S), lm: any = latestMeasure(S);
  const ultimoPeso = (S.weights as any[])[S.weights.length - 1];
  const a1c = examBy(S, 'HbA1c');
  const pa = (S.vitals as any).pa as { sys: number; dia: number }[];

  return (
    <TelaInterna
      titulo="Evolução"
      iconeAcao="plus"
      onAcao={() => router.push('/medir-peso' as any)}
    >
      <Titulao
        titulo="Evolução"
        lead="Doze semanas de tratamento. Toque num marcador para ver o histórico e corrigir registros."
      />

      <Chips itens={PERIODOS.map((p) => ({ id: p.id, label: p.label }))} valor={per} onChange={setPer} />

      <Bloco titulo="Você registra" nota="Marcadores que dependem só de você — toque para ver o histórico e corrigir.">
        <View style={{ gap: 10 }}>
          <CardCurva
            id="ev-peso"
            nome="Peso"
            sub={`${pesoN(S, startWeight(S))} › ${pesoTxt(S, curWeight(S))} · ${fmtDate(ultimoPeso.t)}`}
            valor={variacaoDe(pesoV(S, curWeight(S) - startWeight(S))).numero}
            unidade={pesoU(S)}
            pontos={pesos.map((p) => ({ v: p.v, rotulo: nf(p.v, 1), quando: fmtDate(p.t) }))}
            onPress={() => router.push('/marcador?m=peso' as any)}
          />
          {fm && lm ? CIRC.map(([k, nome]) => (
            <CardCurva
              key={k}
              id={`ev-${k}`}
              nome={nome}
              sub={`${compN(S, fm[k], 0)} › ${compTxt(S, lm[k], 0)} · ${fmtDate(lm.t)}`}
              valor={variacaoDe(compV(S, lm[k] - fm[k])).numero}
              unidade={compU(S)}
              pontos={medidas.map((p) => ({ v: p[k] as number, rotulo: nf(p[k], 0), quando: fmtDate(p.t) }))}
              onPress={() => router.push(`/marcador?m=${k}` as any)}
            />
          )) : null}
        </View>
      </Bloco>

      {/* ⚠️ AS QUATRO PASTILHAS NO MESMO VERDE, e duas saíam em lima.

          Gordura e massa magra usavam `lima`; HbA1c e pressão, `verde`. São
          dois verdes diferentes, lado a lado numa grade de dois por dois,
          dizendo a mesma coisa — "esta foi boa notícia". Cor que muda sem
          o significado mudar é a pessoa procurando a diferença que não
          existe.

          O `verde` é o que ganha porque é o que a Jornada já usa nos cards
          de "O que já mudou", que são estes mesmos quatro marcadores. O
          `lima` deste aplicativo é a cor do ALCANÇADO — meta fechada,
          check-in do dia —, e nenhum destes quatro é uma linha de
          chegada. */}
      <Bloco
        titulo="Vem de exame"
        nota="Precisam de laudo ou balança de bioimpedância. Só leitura — mas cada um abre o seu histórico."
      >
        <Grade2>
          {fm && lm ? (
            <Metrica
              ic="activity" nome="Gordura corporal"
              /* O TOM VEM DO VEREDITO, e era o lima padrão do <Selo>. Sem
                 isto a gordura subindo aparecia na mesma pastilha verde da
                 gordura caindo: o número mudava de sinal e a cor não. */
              selo={variacaoDe(lm.gordura - fm.gordura, 'pp').delta}
              seloTom={variacaoDe(lm.gordura - fm.gordura).good ? 'verde' : 'neutra'}
              de={`${nf(fm.gordura, 1)}%`} para={`${nf(lm.gordura, 1)}%`}
              onPress={() => router.push('/marcador?m=gordura' as any)}
            />
          ) : null}
          {fm && lm ? (
            <Metrica
              ic="dumbbell" nome="Massa magra"
              selo={variacaoDe(pesoV(S, lm.musculo - fm.musculo), pesoU(S), false).delta}
              seloTom={variacaoDe(pesoV(S, lm.musculo - fm.musculo), '', false).good ? 'verde' : 'neutra'}
              de={`${pesoTxt(S, fm.musculo)}`} para={`${pesoTxt(S, lm.musculo)}`}
              onPress={() => router.push('/marcador?m=musculo' as any)}
            />
          ) : null}
          {a1c && a1c.values.length >= 2 ? (
            <Metrica
              ic="doc" nome="HbA1c"
              selo={examStatus(a1c) === 'ok' ? 'Na referência' : 'Fora da referência'}
              seloTom={examStatus(a1c) === 'ok' ? 'verde' : 'neutra'}
              de={`${nf(examFirst(a1c).v, 1)}%`} para={`${nf(examLast(a1c).v, 1)}%`}
              onPress={() => router.push('/exames?m=HbA1c' as any)}
            />
          ) : null}
          {pa && pa.length >= 2 ? (
            <Metrica
              ic="heart" nome="Pressão"
              /* "Estável" era tudo que não fosse queda, e uma subida de
                 catorze pontos saía como estável. Subir tem nome. */
              selo={pa[pa.length - 1].sys < pa[0].sys ? 'Em queda'
                : pa[pa.length - 1].sys > pa[0].sys ? 'Em alta' : 'Estável'}
              seloTom={pa[pa.length - 1].sys < pa[0].sys ? 'verde' : 'neutra'}
              de={`${pa[0].sys}/${pa[0].dia}`} para={`${pa[pa.length - 1].sys}/${pa[pa.length - 1].dia}`}
              onPress={() => router.push('/saude' as any)}
            />
          ) : null}
        </Grade2>
      </Bloco>

      {/* "Todas as medidas" saiu junto com a tela que ele abria: as quatro
          estão logo acima. Exames fica, porque a lista dos quinze é outra
          coisa do que os dois marcadores que a Evolução destaca. */}
      <Cartao>
        <Linha
          ic="doc"
          titulo="Todos os exames"
          sub="Laudos, faixas de referência e histórico completo"
          onPress={() => router.push('/exames' as any)}
        />
      </Cartao>
    </TelaInterna>
  );
}
