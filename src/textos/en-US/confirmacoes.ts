import { medidas } from './medidas';

/* ============================================================
   CONFIRMATIONS — the sheet that shows up after logging · en-US

   ⚠️ Reasons live in ../pt-BR/confirmacoes.ts. Two carry over:

   THE TITLE ONLY BECOMES NEWS WHEN THE GOAL CLOSES. "Hydration goal met"
   on every glass would be the usual lie: saying it's done while it isn't.

   AND THE CHANGE BADGE DOESN'T JUDGE. The same tone applies whether the
   number went up or down.
   ============================================================ */

export const confirmacoes = {
  /* ⚠️ "NO CHANGE" AND NOT "−0.0". A number that didn't move didn't move
     in any direction, and a minus sign in front of a zero suggests a loss
     that didn't happen. */
  semMudanca: 'no change',

  /* ---------------- weight ---------------- */
  peso: 'Weight logged',
  pesoDesdeUltima: 'Since your last weigh-in',
  pesoMeta: 'Weight goal',
  pesoFaltam: (quanto: string) => `${quanto} to go`,
  pesoAlcancada: 'reached',
  pesoNotaPlato: 'A month with your weight in the same range. That’s when your waist usually keeps coming down, and the tape is what shows it.',
  pesoCaminhoPlato: 'Measure your body too',
  pesoCaminho: 'View weight curve',

  /* ---------------- measurements ---------------- */
  medidas: 'Measurements logged',
  cintura: medidas.corpo.cintura,
  quadril: medidas.corpo.quadril,
  braco: medidas.corpo.braco,
  coxa: medidas.corpo.coxa,
  medidasCaminho: 'See your progress',

  /* ---------------- labs ---------------- */
  exame: 'Result logged',
  /* ⚠️ THE VERDICT FIRST, because it's the question of someone who just
     typed a lab number — and the range comes with it, because the range
     is what holds the verdict up. */
  exameFaixa: 'Reference range',
  exameNaReferencia: 'in range',
  exameAcima: 'above',
  exameAbaixo: 'below',
  exameDesdeAnterior: 'Since the previous draw',
  examePrimeira: 'First draw for this marker',
  examePrimeiraSub: 'the next one already becomes a comparison',
  exameCaminho: 'See it in the lab panel',

  /* ---------------- note ---------------- */
  anotacao: 'Note saved',
  anotacaoPauta: 'On the appointment agenda',
  anotacaoComDoutor: (doutor: string) => `goes into the summary for ${doutor}`,
  anotacaoSemDoutor: 'goes into the appointment summary',
  anotacaoCaminho: 'View appointment summary',

  /* ---------------- meal ---------------- */
  refeicao: 'Meal logged',
  refeicaoTexto: (agora: number, alvo: number) => `${agora} of ${alvo} g of protein today`,
  refeicaoFesta: 'Daily protein goal met',
  proteinaDoDia: 'Protein today',
  proteinaMeta: (alvo: number) => `goal of ${alvo} g`,
  faltamGramas: (v: string) => `${v} g to go`,
  metaBatida: 'goal met',
  refeicaoCaminho: 'View today’s nutrition',

  /* ---------------- workout ---------------- */
  exercicio: 'Workout logged',
  exercicioTexto: (tipo: string, min: string) => `${tipo} · ${min} min`,
  exercicioSemTreino: (agora: number) => `${agora} min today`,
  exercicioFesta: 'Daily movement goal met',
  movimentoDoDia: 'Movement today',
  movimentoSub: (agora: number, alvo: number) => `${agora} of ${alvo} min`,
  faltamMinutos: (v: string) => `${v} min to go`,
  treinosHoje: 'Workouts today',
  exercicioCaminho: 'View exercise week',

  /* ---------------- water ---------------- */
  agua: 'Water logged',
  aguaFechada: 'Hydration goal met',
  aguaTexto: (agora: string, alvo: string) => `${agora} of ${alvo} today`,
  hidratacaoDoDia: 'Hydration today',
  hidratacaoMeta: (alvo: string) => `goal of ${alvo}`,
  faltamAgua: (v: string) => `${v} to go`,
  aguaCaminho: 'View hydration',
};
