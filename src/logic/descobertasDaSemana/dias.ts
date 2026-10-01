import type { State } from '../seed';
import { aguaDoDia } from '../derive';
import { paraTela, grauDoSintoma } from '../escalas';
import { startOfDay, now } from '../time';
import { alimentacao as alimPt } from '../../textos/pt-BR/alimentacao';
import { alimentacao as alimEn } from '../../textos/en-US/alimentacao';
import { alimentacao as alimEs } from '../../textos/es-419/alimentacao';
import { alimentacao as alimFr } from '../../textos/fr-FR/alimentacao';
import { alimentacao as alimDe } from '../../textos/de-DE/alimentacao';
import { alimentacao as alimIt } from '../../textos/it-IT/alimentacao';

/* ============================================================
   OS DIAS DA LEITURA DA SEMANA

   A semana lida é a última segunda a domingo COMPLETA antes de hoje; a
   janela dos padrões, as 6 semanas que terminam nela. Nada do dia de
   hoje entra: a leitura de segunda fala de uma semana fechada, e a
   mesma pessoa abrindo o app duas vezes na segunda vê a mesma leitura.

   Cada dia diz o que a pessoa fez (os comportamentos) e como ela estava
   (os resultados), com NULL onde não há registro que diga. Null é "não
   sei", e nunca "não": um dia sem refeição registrada não é um dia sem
   café da manhã — é um dia em que ninguém anotou nada.

   Ver docs/superpowers/specs/2026-10-01-leitura-da-semana-design.md.
   ============================================================ */

export const JANELA_SEMANAS = 6;

export type Comportamento = 'cafe' | 'jantarTarde' | 'proteinaNaMeta' | 'aguaNaMeta' | 'treino' | 'sono7' | 'posAplicacao';
export type Resultado = 'fome' | 'energia' | 'humor' | 'enjoo';

export const COMPORTAMENTOS: Comportamento[] = ['cafe', 'jantarTarde', 'proteinaNaMeta', 'aguaNaMeta', 'treino', 'sono7', 'posAplicacao'];
export const RESULTADOS: Resultado[] = ['fome', 'energia', 'humor', 'enjoo'];

export type Dia = {
  t: number;
  faz: Record<Comportamento, boolean | null>;
  sente: Record<Resultado, number | null>;
};

/** O dia `k` dias depois de `t`, às 00h, contado pelo CALENDÁRIO.

    ⚠️ E NÃO SOMANDO 24 HORAS. Onde há horário de verão, a semana da
    troca tem um dia de 23 ou de 25 horas, e a soma caía às 23h da
    véspera ou à 01h do dia: a semana lida começava no domingo, a fileira
    dos sete dias do resumo repetia um dia, e o check-in da segunda saía
    da conta (achado da revisão de 01/10/2026; a mesma regra de injGrade,
    em derive, e da grade do mês, em ui/calendario). */
export const noCalendario = (t: number, k: number) => {
  const d = new Date(t);
  return +new Date(d.getFullYear(), d.getMonth(), d.getDate() + k);
};

/** A segunda-feira (00h) da semana de `agora`, e a semana lida: os 7
    dias antes dela. */
export function semanaLida(agora: Date = now()) {
  const hoje = +startOfDay(agora);
  const desdeSegunda = (new Date(hoje).getDay() + 6) % 7; // segunda = 0
  const segunda = noCalendario(hoje, -desdeSegunda);
  return { de: noCalendario(segunda, -7), ate: segunda };
}

/* O café da manhã é reconhecido pelo nome, em qualquer um dos seis
   idiomas (a refeição é gravada com o rótulo do idioma de quando foi
   registrada), ou pela hora. */
const CAFES = new Set([alimPt, alimEn, alimEs, alimFr, alimDe, alimIt].map((a: any) => String(a.prato.cafeDaManha).toLowerCase()));
const hora = (t: number) => { const d = new Date(t); return d.getHours() + d.getMinutes() / 60; };

/** Os dias da janela, do mais antigo ao mais novo. */
export function diasDaJanela(S: State, agora: Date = now()): Dia[] {
  const { ate } = semanaLida(agora);
  const P: any = S.profile;
  const metaProt = P.targets?.prot || 0;
  const metaAgua = P.targets?.waterMl || 0;
  const checkins = ((S as any).checkins ?? []) as any[];
  const refeicoes = ((S as any).meals ?? []) as any[];
  const aplicacoes = (((S as any).injections ?? []) as any[]).map((i) => +startOfDay(i.t));
  const temAplicacoes = aplicacoes.length > 0;

  const dias: Dia[] = [];
  /* Os dias pelo calendário, e não de 24 em 24 horas (ver noCalendario). */
  for (let k = -JANELA_SEMANAS * 7; k < 0; k++) {
    const dia = noCalendario(ate, k);
    const c = checkins.find((x) => x.t === dia);
    const doDia = refeicoes.filter((m) => +startOfDay(m.t) === dia);
    /* refeições só dizem algo num dia em que a pessoa anotou pelo menos duas */
    const comiaRegistrado = doDia.length >= 2;
    const cafe = comiaRegistrado
      ? doDia.some((m) => CAFES.has(String(m.name ?? '').toLowerCase()) || hora(m.t) < 10.5)
      : null;
    const ultima = comiaRegistrado ? Math.max(...doDia.map((m) => hora(m.t))) : null;
    const agua = aguaDoDia(S, dia);
    const respondeu = !!c && (c.fome != null || c.energia != null || typeof c.mood === 'number' || typeof c.nausea === 'number');
    const posApl = temAplicacoes ? aplicacoes.some((a) => a === noCalendario(dia, -1) || a === noCalendario(dia, -2)) : null;

    dias.push({
      t: dia,
      faz: {
        cafe,
        jantarTarde: ultima == null ? null : ultima >= 21,
        proteinaNaMeta: metaProt && typeof c?.prot === 'number' && c.prot > 0 ? c.prot >= metaProt : null,
        aguaNaMeta: metaAgua && agua > 0 ? agua >= metaAgua : null,
        treino: c ? (c.exerc ?? 0) > 0 : null,
        sono7: typeof c?.sono === 'number' ? c.sono >= 7 : null,
        posAplicacao: posApl,
      },
      sente: {
        fome: respondeu ? paraTela(c.fome) : null,
        energia: respondeu ? paraTela(c.energia) : null,
        humor: respondeu && typeof c.mood === 'number' ? c.mood : null,
        /* sintoma respondido sem enjoo é zero, e não "não sei" */
        enjoo: typeof c?.nausea === 'number' ? (grauDoSintoma(c, 'nausea') ?? 0) : null,
      },
    });
  }
  return dias;
}
