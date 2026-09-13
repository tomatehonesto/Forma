import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { timelineWeeks, timelineEvents, timelineCounts, type TLKind } from '../logic/derive';
import { MO, MO_LONG, DAY } from '../logic/time';
import { Txt } from '../ui/kit';
import {
  TelaInterna, Titulao, Chips, Sanfona, SanfonaLinha, Cartao, Linha, Aviso,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   A HISTÓRIA

   O nome não é enfeite. "Histórico" promete uma auditoria — linhas, datas,
   um log. "A história" promete o que a tela realmente entrega: o
   tratamento contado em capítulos, e a semana é o capítulo, porque é a
   unidade em que a pessoa se lembra do que fez ("na semana que apliquei na
   coxa eu passei mal").

   Semana sem registro FICA NA LISTA, do mesmo tamanho que as outras. Sumir
   com ela deixaria a história parecendo mais constante do que foi, e
   marcá-la de vermelho transformaria uma semana corrida em falha. Ela
   aparece com o selo neutro "sem pesagem" e segue adiante — é o que diz o
   aviso no pé da tela.

   Os outros chips trocam o eixo: em vez de semanas, a lista vira os
   eventos de um tipo só, em ordem cronológica. Mesmo conteúdo, outro
   recorte — para quem veio procurar "quando foi aquele exame".
   ============================================================ */

const curto = (t: number) => { const d = new Date(t); return `${d.getDate()} ${MO[d.getMonth()]}`; };

export default function Historico() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const [aba, setAba] = useState('semana');

  const semanas = useMemo(() => timelineWeeks(S), [S]);
  const eventos = useMemo(() => timelineEvents(S), [S]);
  const contagens = useMemo(() => timelineCounts(S), [S]);

  const chips = [
    { id: 'semana', label: 'Por semana', n: semanas.length },
    ...contagens.map((x) => ({ id: x.kind, label: x.label, n: x.n })),
  ];

  const inicio = new Date(S.profile.startT);
  const vazias = semanas.filter((w) => !w.deltaPeso).length;

  return (
    <TelaInterna
      titulo="A história"
      iconeAcao="arrowup"
      onAcao={() => router.push('/exportar' as any)}
    >
      <Titulao
        titulo="A história"
        lead={`Tudo que você registrou desde ${inicio.getDate()} de ${MO_LONG[inicio.getMonth()]}. Toque em qualquer linha para abrir.`}
      />

      <Chips itens={chips} valor={aba} onChange={setAba} />

      {aba === 'semana' ? (
        <Sanfona>
          {semanas.map((w) => (
            <SanfonaLinha
              key={w.semana}
              titulo={`Semana ${w.semana}`}
              selo={w.deltaPeso ?? 'sem pesagem'}
              seloTom={w.deltaPeso ? 'lima' : 'neutra'}
              sub={`${curto(w.t)} a ${curto(w.t + 6 * DAY)} · ${w.dose} · ${w.site}`}
              meta={w.resumo}
              onPress={() => router.push(`/semana?s=${w.semana}` as any)}
            />
          ))}
        </Sanfona>
      ) : (
        <Cartao>
          {eventos
            .filter((e) => e.kind === (aba as TLKind))
            .map((e) => (
              <Linha
                key={e.key}
                titulo={e.title}
                sub={`${curto(e.day)}${e.time ? ` · ${e.time}` : ''}${e.sub ? ` · ${e.sub}` : ''}`}
                selo={e.value || undefined}
                seloTom="neutra"
                seta={false}
              />
            ))}
        </Cartao>
      )}

      {aba === 'semana' && vazias > 0 ? (
        <Aviso
          ic="info"
          titulo={vazias === 1 ? 'Uma semana ficou quase vazia' : `${vazias} semanas ficaram quase vazias`}
          texto="Semanas sem registro continuam na lista, do mesmo tamanho que as outras. Elas não somem nem viram falha."
        />
      ) : null}

      <View style={{ alignItems: 'center' }}>
        <Txt v="caption" c={c.tx4}>
          {eventos.length} registros desde o início do tratamento
        </Txt>
      </View>
    </TelaInterna>
  );
}
