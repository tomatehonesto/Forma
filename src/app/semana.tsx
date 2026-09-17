import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { INDICADORES, sintomasEm, timelineWeeks, notas } from '../logic/derive';
import { MO_LONG, DAY, DOW_PT, MO, nf } from '../logic/time';
import { Txt } from '../ui/kit';
import {
  TelaInterna, Titulao, Bloco, Grade2, Metrica, Progresso, Sanfona, SanfonaLinha, Cartao, Linha,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   UMA SEMANA

   O capítulo aberto. A ordem responde, nesta sequência, o que a pessoa
   pergunta quando volta a uma semana específica:

     1. o que eu fiz        — aplicação e peso, na grade de dois
     2. como eu me senti    — sintomas como intensidade, não como lista
     3. o que aconteceu     — dia a dia, em ordem
     4. o que eu quis falar — a nota que ficou guardada para a consulta

   Os sintomas viram barra porque "náusea leve por 2 dias" é uma
   quantidade, e quantidade se compara de relance entre linhas. Como lista
   de palavras, a pessoa teria que ler as três para saber qual pesou mais.
   ============================================================ */

const curto = (t: number) => { const d = new Date(t); return `${d.getDate()} ${MO[d.getMonth()]}`; };

/* TL_LABEL é plural ("Refeições") porque nasceu para rotular filtros. Num
   selo de linha o que cabe é o singular em caixa baixa: ali ele qualifica
   UM dia, não uma coleção. */
const SELO: Record<string, string> = {
  aplicacao: 'aplicação', checkin: 'check-in', peso: 'pesagem', foto: 'foto',
  refeicao: 'refeição', exercicio: 'exercício', consulta: 'consulta', exame: 'exame',
};
const diaSemana = (t: number) => {
  const d = new Date(t);
  const nome = DOW_PT[d.getDay()];
  return `${nome.charAt(0).toUpperCase()}${nome.slice(1)}, ${curto(t)}`;
};

export default function Semana() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const { s } = useLocalSearchParams<{ s?: string }>();

  const semanas = useMemo(() => timelineWeeks(S), [S]);
  const w = semanas.find((x) => x.semana === Number(s)) ?? semanas[0];

  if (!w) {
    return (
      <TelaInterna titulo="Semana">
        <Txt v="note" c={c.tx3}>Ainda não há semanas registradas.</Txt>
      </TelaInterna>
    );
  }

  const ini = new Date(w.t), fim = new Date(w.t + 6 * DAY);
  const cs = (S.checkins as any[]).filter((x) => x.t >= w.t && x.t < w.t + 7 * DAY);

  /* OS SINTOMAS SAEM DA LEITURA COMPARTILHADA.

     Esta tela tinha a sua: média com `x[k] || 0`, que soma como zero o dia
     em que ninguém respondeu; uma lista de quatro sintomas escrita à mão,
     sem os cinco que o check-in também grava; e um "leve / moderada /
     forte" medido na régua de 0 a 10 do banco — que classificava como
     forte o que a pessoa tinha respondido como moderado. A régua agora é
     a mesma da tela de sintomas, e a palavra do grau é a que ela leu ao
     responder. */
  const sintomas = sintomasEm(cs);
  const respondidos = cs.filter((x: any) => typeof x?.nausea === 'number' || x?.gut != null).length;

  /* Energia pela leitura do indicador, que é quem sabe que a coluna mora
     de 0 a 10 e a pergunta foi de 1 a 5. */
  const energia = INDICADORES.find((x) => x.id === 'energia')!;
  const ens = cs.map((x: any) => energia.leitura(x)).filter((v): v is number => v != null);
  const mediaEnergia = ens.length ? ens.reduce((a, b) => a + b, 0) / ens.length : null;

  /* A nota que pertence a ESTA semana, não a mais recente do app: o bloco
     está contando o que aconteceu no ciclo, e uma nota de três semanas
     depois entraria aqui como se tivesse sido escrita na época. */
  const nota = notas(S).find((n) => n.t >= w.t && n.t < w.t + 7 * DAY) ?? null;

  return (
    <TelaInterna
      titulo={`Semana ${w.semana}`}
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
      <Titulao
        titulo={`Semana ${w.semana}`}
        lead={`${ini.getDate()} a ${fim.getDate()} de ${MO_LONG[fim.getMonth()]} · ${w.dose}`}
      />

      <Grade2>
        <Metrica
          ic="syringe"
          nome="Aplicação"
          selo={DOW_PT[ini.getDay()]}
          seloTom="neutra"
          para={w.site}
        />
        {w.deltaPeso ? (
          <Metrica ic="scale" nome="Peso" selo={w.deltaPeso} para={w.metricas[0]?.valor ?? w.deltaPeso} />
        ) : (
          <Metrica ic="scale" nome="Peso" selo="sem pesagem" seloTom="neutra" para="—" />
        )}
      </Grade2>

      {sintomas.length || mediaEnergia != null ? (
        <Bloco
          titulo="Como você se sentiu"
          nota={respondidos ? `${respondidos} de 7 dias respondidos` : undefined}
        >
          <View style={{ gap: 8 }}>
            {sintomas.map((x) => (
              <Progresso
                key={x.id}
                label={x.label}
                valor={`${x.legenda.toLowerCase()} · ${x.dias} ${x.dias === 1 ? 'dia' : 'dias'}`}
                pct={(x.media / 5) * 100}
              />
            ))}
            {mediaEnergia != null ? (
              <Progresso
                label="Energia"
                valor={`${nf(mediaEnergia, 1)} de 5`}
                pct={(mediaEnergia / 5) * 100}
              />
            ) : null}
          </View>
        </Bloco>
      ) : null}

      <Bloco titulo="Dia a dia">
        <Sanfona>
          {w.eventos.map((e) => (
            <SanfonaLinha
              key={e.key}
              titulo={diaSemana(e.day)}
              selo={SELO[e.kind] ?? e.kind}
              seloTom="neutra"
              /* Sem a hora: ela nunca foi registrada — ver ordemNoDia
                 em TLEvent, no derive. */
              sub={[e.title, e.sub].filter(Boolean).join(' · ')}
              onPress={e.kind === 'peso' ? () => router.push(`/registro?m=peso&t=${e.day}` as any) : undefined}
            />
          ))}
        </Sanfona>
      </Bloco>

      <Bloco titulo="Nota para a consulta" link="Ver todas" onLink={() => router.push('/notas' as any)}>
        <Cartao>
          <Linha
            titulo={nota ? `“${nota.text}”` : 'Nenhuma nota nesta semana'}
            sub={nota ? `Anotada em ${curto(nota.t)}` : 'Toque para escrever uma'}
            onPress={() => router.push(nota ? `/nota?t=${nota.t}` as any : '/nota' as any)}
          />
        </Cartao>
      </Bloco>
    </TelaInterna>
  );
}
