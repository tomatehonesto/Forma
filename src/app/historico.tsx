import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { timelineWeeks, timelineEvents, timelineCounts, type TLKind } from '../logic/derive';
import { DAY, dataLonga, fmtDate, fmtPeriodo } from '../logic/time';
import { Txt } from '../ui/kit';
import {
  TelaInterna, Titulao, Chips, Sanfona, SanfonaLinha, Cartao, Linha, Aviso,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.home.telaHistorico;
/* ⚠️ O TÍTULO, A ABA E "SEMANA N" VÊM DA JORNADA, e não daqui. É a
   seção de lá que traz até esta tela, e link e destino com nomes
   diferentes fazem a pessoa achar que chegou noutro lugar. */
const J = () => T.home.telaJornada;

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


export default function Historico() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const [aba, setAba] = useState('semana');

  const semanas = useMemo(() => timelineWeeks(S), [S]);
  const eventos = useMemo(() => timelineEvents(S), [S]);
  const contagens = useMemo(() => timelineCounts(S), [S]);

  const chips = [
    { id: 'semana', label: J().porSemana, n: semanas.length },
    ...contagens.map((x) => ({ id: x.kind, label: x.label, n: x.n })),
  ];

  const inicio = new Date(S.profile.startT);
  const vazias = semanas.filter((w) => !w.deltaPeso).length;

  return (
    <TelaInterna
      titulo={J().seuTratamento}
      /* "EXPORTAR" ESCRITO, e não uma seta para cima.

         A seta sozinha na barra lia como "voltar ao topo" — é o que uma
         seta para cima quer dizer numa tela que rola. E era a única ação
         de barra do app que não era um "+": as outras seis telas usam a
         cruz para acrescentar, que ninguém precisa decifrar. Palavra
         ocupa mais largura do que ícone, e neste caso é o preço de não
         fazer a pessoa tocar para descobrir. */
      acao={K().exportar}
      onAcao={() => router.push('/exportar' as any)}
    >
      {/* SAIU O "TOQUE EM QUALQUER LINHA PARA ABRIR". A frase só era
          verdade na aba de semanas: nas outras — check-ins, aplicações,
          exames — as linhas são registros e não abrem nada, e o próprio
          código já as desenha sem seta. Instrução que vale em um quarto da
          tela é instrução que a pessoa testa e descobre falsa. O chevron
          diz o que abre, onde abre. */}
      <Titulao
        titulo={J().seuTratamento}
        lead={K().lead(dataLonga(inicio))}
      />

      <Chips itens={chips} valor={aba} onChange={setAba} />

      {aba === 'semana' ? (
        <Sanfona>
          {semanas.map((w) => (
            <SanfonaLinha
              key={w.semana}
              titulo={J().semana(w.semana)}
              selo={w.deltaPeso ?? K().semPesagem}
              seloTom={w.deltaPeso ? 'lima' : 'neutra'}
              /* ⚠️ ERA "17 set a 23 set", montado aqui. O formatador da
                  casa diz o mês uma vez — "17 a 23 set" — e em inglês diz
                  "Sep 17–23". O "a" escrito na tela ficaria em português
                  para sempre. */
              sub={`${fmtPeriodo(new Date(w.t), new Date(w.t + 6 * DAY))} · ${w.dose} · ${w.site}`}
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
                titulo={fmtDate(e.day)}
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
          titulo={K().semanasVazias(vazias)}
          texto={K().semanasVaziasTexto}
        />
      ) : null}

      <View style={{ alignItems: 'center' }}>
        <Txt v="caption" c={c.tx4}>
          {K().registrosDesde(eventos.length)}
        </Txt>
      </View>
    </TelaInterna>
  );
}
