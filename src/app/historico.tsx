import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { timelineWeeks, timelineEvents, timelineCounts, type TLKind } from '../logic/derive';
import { MO, MO_LONG, DAY, dataLonga } from '../logic/time';
import { Txt } from '../ui/kit';
import {
  TelaInterna, Titulao, Chips, Sanfona, SanfonaLinha, Cartao, Linha, Aviso,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   SEU TRATAMENTO

   O nome não é enfeite. "Histórico" promete uma auditoria — linhas, datas,
   um log —, e a tela não é isso: é o tratamento contado em capítulos, e a
   semana é o capítulo, porque é a unidade em que a pessoa se lembra do que
   fez ("na semana que apliquei na coxa eu passei mal").

   Ela já se chamou "A história", que dizia o formato certo e não dizia o
   assunto. "Seu tratamento" diz de quem é e do que se trata — e é o mesmo
   nome na seção da Jornada que traz até aqui, porque link e destino com
   nomes diferentes fazem a pessoa achar que chegou noutro lugar.

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
      titulo="Seu tratamento"
      /* "EXPORTAR" ESCRITO, e não uma seta para cima.

         A seta sozinha na barra lia como "voltar ao topo" — é o que uma
         seta para cima quer dizer numa tela que rola. E era a única ação
         de barra do app que não era um "+": as outras seis telas usam a
         cruz para acrescentar, que ninguém precisa decifrar. Palavra
         ocupa mais largura do que ícone, e neste caso é o preço de não
         fazer a pessoa tocar para descobrir. */
      acao="Exportar"
      onAcao={() => router.push('/exportar' as any)}
    >
      {/* SAIU O "TOQUE EM QUALQUER LINHA PARA ABRIR". A frase só era
          verdade na aba de semanas: nas outras — check-ins, aplicações,
          exames — as linhas são registros e não abrem nada, e o próprio
          código já as desenha sem seta. Instrução que vale em um quarto da
          tela é instrução que a pessoa testa e descobre falsa. O chevron
          diz o que abre, onde abre. */}
      <Titulao
        titulo="Seu tratamento"
        lead={`Tudo que você registrou desde ${dataLonga(inicio)}.`}
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
              /* A DATA É O TÍTULO AQUI. A lista já está filtrada por um
                 tipo — o chip preto em cima diz qual —, e mesmo assim cada
                 linha começava escrevendo o tipo de novo: treze "Check-in"
                 em treze linhas, com o que muda de uma para a outra
                 espremido na legenda. Quem abre "Check-ins" quer ver
                 quando, e depois como foi. */
              <Linha
                key={e.key}
                titulo={curto(e.day)}
                sub={e.detalhe}
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
