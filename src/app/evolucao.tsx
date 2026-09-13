import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  startWeight, curWeight, lostKg, firstMeasure, latestMeasure,
  examBy, examFirst, examLast, examStatus,
} from '../logic/derive';
import { MO, nf, DAY } from '../logic/time';
import {
  TelaInterna, Titulao, Bloco, Chips, Cartao, Linha, Metrica, Grade2, CardCurva,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   EVOLUÇÃO

   A tela separa os marcadores por QUEM OS PRODUZ, não por assunto:

     você registra — peso e cintura. Têm histórico navegável, entram em
       /marcador, e a pessoa pode corrigir ou apagar cada linha.
     vem de exame  — gordura, massa magra, HbA1c, pressão. Dependem de
       laudo ou de balança de bioimpedância. Nesta fase são só leitura, e
       dizer isso em voz alta evita a frustração de tocar num card que não
       abre nada.

   A divisão importa porque muda o que a pessoa pode FAZER. Agrupar tudo
   como "seus números" prometeria a mesma coisa de itens que se comportam
   de formas diferentes.
   ============================================================ */

const n1 = (x: number) => nf(x, 1).replace('.', ',');
const dia = (t: number) => { const d = new Date(t); return `${d.getDate()} ${MO[d.getMonth()]}`; };

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
  const cinturas = (S.measures as any[]).filter((m) => m.t >= desde).map((m) => ({ t: m.t, v: m.cintura }));

  const fm = firstMeasure(S), lm = latestMeasure(S);
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

      <Bloco titulo="Você registra" nota="Marcadores que dependem só de você.">
        <View style={{ gap: 10 }}>
          <CardCurva
            id="ev-peso"
            nome="Peso"
            sub={`${n1(startWeight(S))} › ${n1(curWeight(S))} kg · ${dia(ultimoPeso.t)}`}
            valor={`−${n1(lostKg(S))}`}
            unidade="kg"
            pontos={pesos.map((p) => ({ v: p.v, rotulo: n1(p.v), quando: dia(p.t) }))}
            onPress={() => router.push('/marcador?m=peso' as any)}
          />
          {fm && lm ? (
            <CardCurva
              id="ev-cint"
              nome="Cintura"
              sub={`${fm.cintura} › ${lm.cintura} cm · ${dia(lm.t)}`}
              valor={`−${n1(fm.cintura - lm.cintura)}`}
              unidade="cm"
              pontos={cinturas.map((p) => ({ v: p.v, rotulo: String(p.v), quando: dia(p.t) }))}
              onPress={() => router.push('/marcador?m=cintura' as any)}
            />
          ) : null}
        </View>
      </Bloco>

      <Bloco
        titulo="Vem de exame"
        nota="Precisam de laudo ou balança de bioimpedância — nesta fase, só leitura."
      >
        <Grade2>
          {fm && lm ? (
            <Metrica
              ic="activity" nome="Gordura corporal"
              selo={`−${n1(fm.gordura - lm.gordura)} pp`}
              de={`${n1(fm.gordura)}%`} para={`${n1(lm.gordura)}%`}
            />
          ) : null}
          {fm && lm ? (
            <Metrica
              ic="dumbbell" nome="Massa magra"
              selo={`${lm.musculo >= fm.musculo ? '+' : '−'}${n1(Math.abs(lm.musculo - fm.musculo))} kg`}
              de={`${n1(fm.musculo)} kg`} para={`${n1(lm.musculo)} kg`}
            />
          ) : null}
          {a1c && a1c.values.length >= 2 ? (
            <Metrica
              ic="doc" nome="HbA1c"
              selo={examStatus(a1c) === 'ok' ? 'Na referência' : 'Fora da faixa'}
              seloTom={examStatus(a1c) === 'ok' ? 'verde' : 'neutra'}
              de={`${n1(examFirst(a1c).v)}%`} para={`${n1(examLast(a1c).v)}%`}
            />
          ) : null}
          {pa && pa.length >= 2 ? (
            <Metrica
              ic="heart" nome="Pressão"
              selo={pa[pa.length - 1].sys < pa[0].sys ? 'Em queda' : 'Estável'}
              seloTom={pa[pa.length - 1].sys <= pa[0].sys ? 'verde' : 'neutra'}
              de={`${pa[0].sys}/${pa[0].dia}`} para={`${pa[pa.length - 1].sys}/${pa[pa.length - 1].dia}`}
            />
          ) : null}
        </Grade2>
      </Bloco>

      <Cartao>
        <Linha
          ic="doc"
          titulo="Todos os exames"
          sub="Laudos, faixas de referência e histórico completo"
          onPress={() => router.push('/exames' as any)}
        />
        <Linha
          ic="ruler"
          titulo="Todas as medidas"
          sub="Cintura, quadril, braço e coxa"
          onPress={() => router.push('/medidas' as any)}
        />
      </Cartao>
    </TelaInterna>
  );
}
