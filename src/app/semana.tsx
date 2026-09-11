import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { timelineWeeks, notas } from '../logic/derive';
import { MO_LONG, DAY, DOW_PT, MO } from '../logic/time';
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
  /* Média dos check-ins do ciclo — é o que transforma "náusea" em uma
     quantidade comparável com "constipação" na mesma tela. */
  const cs = (S.checkins as any[]).filter((x) => x.t >= w.t && x.t < w.t + 7 * DAY);
  const media = (k: string) => (cs.length ? cs.reduce((a, x) => a + (x[k] || 0), 0) / cs.length : 0);
  const dias = (k: string) => cs.filter((x) => (x[k] || 0) > 0).length;
  const grau = (v: number) => (v <= 2 ? 'leve' : v <= 5 ? 'moderada' : 'forte');

  const sintomas = [
    { k: 'nausea', label: 'Náusea' },
    { k: 'constip', label: 'Constipação' },
    { k: 'refluxo', label: 'Refluxo' },
  ].filter((x) => media(x.k) > 0);

  /* A nota que pertence a ESTA semana, não a mais recente do app: o bloco
     está contando o que aconteceu no ciclo, e uma nota de três semanas
     depois entraria aqui como se tivesse sido escrita na época. */
  const nota = notas(S).find((n) => n.t >= w.t && n.t < w.t + 7 * DAY) ?? null;

  return (
    <TelaInterna
      titulo={`Semana ${w.semana}`}
      iconeAcao="arrowup"
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

      {sintomas.length || cs.length ? (
        <Bloco titulo="Como você se sentiu">
          <View style={{ gap: 8 }}>
            {sintomas.map((x) => {
              const v = media(x.k);
              return (
                <Progresso
                  key={x.k}
                  label={x.label}
                  valor={`${grau(v)} · ${dias(x.k)} ${dias(x.k) === 1 ? 'dia' : 'dias'}`}
                  pct={(v / 10) * 100}
                />
              );
            })}
            {cs.length ? (
              <Progresso
                label="Energia"
                valor={`${media('energia').toFixed(1).replace('.', ',')} de 10`}
                pct={media('energia') * 10}
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
              sub={[e.title, e.sub, e.time].filter(Boolean).join(' · ')}
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
