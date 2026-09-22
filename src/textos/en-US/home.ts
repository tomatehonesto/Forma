import { medidas } from './medidas';

/* ============================================================
   HOME AND THE JOURNEY — daily goals, cards and the timeline · en-US

   ⚠️ Reasons live in ../pt-BR/home.ts. The one the whole file depends on:

   EVERY NUMBER SHOWN COMES WITH A VERDICT, and the verdict is the word
   people look for first. The value gives the measure; the word says
   whether it's good. Without it people do the math themselves, and in a
   health app they do it wrong.

   AND NO VERDICT HERE GRADES THE PERSON. "Below goal" qualifies the
   number; "You didn't try hard enough" would qualify who produced it.
   That distinction disappears easily in translation.
   ============================================================ */

/* ⚠️ The body names come from medidas.corpo. See ../pt-BR. */
/* ⚠️ The body names come from medidas.corpo. See ../pt-BR. */
export const home = {
  /* ⚠️ "GOAL MET" IS NOT A CELEBRATION, IT'S A STATE. It sits in the same
     slot as "27 g to go" — the same line saying the same thing from the
     other side. A "Congrats!" there would change what the card is. */
  metas: {
    proteina: 'Protein intake',
    agua: 'Drink more water',
    exercicio: 'Move every day',
    batida: 'Goal met',
    faltamProteina: (gramas: number) => `${gramas} g to go`,
    /* The amount arrives already written, in the reader's unit — liters
       or ounces. See logic/medidas. */
    faltamAgua: (quanto: string) => `${quanto} to go`,
    faltamExercicio: (minutos: number) => `${minutos} min to go`,
  },

  /* ⚠️ "CLOSE TO GOAL" IS GOOD NEWS, on purpose: 85% of a protein goal is
     a good day, and calling that "below" teaches people to ignore the
     word. The third step exists so the first keeps meaning something. */
  veredito: {
    naMeta: 'On goal',
    pertoDaMeta: 'Close to goal',
    abaixoDaMeta: 'Below goal',
    /* ⚠️ "TRENDING DOWN" IS THE BRANCH THAT SAVES THE BODY-FAT CARD.
       Someone above goal but falling since the start isn't failing —
       they're in the middle of it, which is where almost everyone is. */
    emQueda: 'Trending down',
    acimaDaMeta: 'Above goal',
  },

  /* ⚠️ THE TITLE CHANGES TOO, not just the number. "Weight lost" above
     "+3.3 lb" is a contradiction inside one card — and the wrong word
     hurts more than the number. */
  peso: {
    perdido: 'Weight lost',
    variacao: 'Weight change',
    meta: (quanto: string, unidade: string) => `Goal: ${quanto} ${unidade}`,
  },

  /* ⚠️ "STEADY", NOT "−0.0". A number that didn't move didn't move in any
     direction, and that's the word. It is neither good news nor bad. */
  estavel: 'Steady',

  tipos: {
    checkin: 'Check-ins',
    aplicacao: 'Injections',
    peso: 'Weight',
    refeicao: 'Meals',
    exercicio: 'Workouts',
    consulta: 'Appointments',
    exame: 'Labs',
  },

  evento: {
    aplicacao: (dose: string, unidade: string) => `Injection ${dose} ${unidade}`,
    peso: 'Weight',
    pesoInicial: 'Starting weight',
    checkin: 'Check-in',
    exercicio: 'Workout',
    minDeMovimento: (minutos: number) => `${minutos} min of movement`,
    proteinaDaRefeicao: (quanto: string) => `Protein ${quanto}`,
    consulta: (tipo: string) => `${tipo} appointment`,
    marcadoresDe: (quantos: number, fonte: string) => `${quantos} markers · ${fonte}`,
    marcadoresDetalhe: (nome: string, quantos: number, fonte: string) =>
      `${nome} · ${quantos} markers · ${fonte}`,
    compartilhado: 'Shared',

    gramasDeProteina: (gramas: number) => `${gramas} g protein`,
    horasDeSono: (horas: number) => `${horas}h of sleep`,

    /* ⚠️ THE DAY'S VERDICT COMES FROM MOOD, and the three words are short
       on purpose: they sit in the right-hand column next to a number.
       "Hard" is the important one — it names the bad day without calling
       it a failure. */
    diaBem: 'Good',
    diaNeutro: 'Neutral',
    diaDificil: 'Hard',

    respostaHumor: 'Mood',
    respostaEnergia: 'Energy',
    respostaFome: 'Hunger',
    respostaOutroSintoma: 'Other symptom',
  },

  /* ⚠️ THE SUMMARY REPORTS WHAT THE WEEK YIELDED, it doesn't list what
     happened. Each type carries its own singular and plural — "1 weigh-in"
     and "3 weigh-ins" — instead of a dangling "(s)". */
  semana: {
    checkin: ['check-in', 'check-ins'] as [string, string],
    peso: ['weigh-in', 'weigh-ins'] as [string, string],
    refeicao: ['meal', 'meals'] as [string, string],
    exercicio: ['workout', 'workouts'] as [string, string],
    consulta: ['appointment', 'appointments'] as [string, string],
    exame: ['lab panel', 'lab panels'] as [string, string],
    contagem: (quantos: number, nome: string) => `${quantos} ${nome}`,
    semRegistros: 'Nothing logged this week',

    hidratacao: 'Hydration',
    proteina: 'Protein',
    exercicioMetrica: 'Exercise',
    pesoMetrica: 'Weight',
    litrosPorDia: (quanto: string) => `${quanto} L/day`,
    gramasPorDia: (quanto: number) => `${quanto} g/day`,
    minutos: (quanto: number) => `${quanto} min`,
    deltaLitros: (quanto: string) => `${quanto} L`,
    deltaGramas: (quanto: string) => `${quanto} g`,
    deltaMinutos: (quanto: string) => `${quanto} min`,
  },

  mudancas: {
    peso: medidas.corpo.peso,
    cintura: medidas.corpo.cintura,
    gorduraCorporal: medidas.corpo.gordura,
    /* ⚠️ THE ONLY ONE WHERE GOING UP IS THE GOOD NEWS: muscle lost during
       weight loss is what the treatment tries to prevent. */
    massaMagra: medidas.corpo.massaMagra,
    naReferencia: 'In range',
    foraDaReferencia: 'Out of range',
    pressao: 'Blood pressure',
    /* ⚠️ "STEADY" USED TO BE EVERYTHING THAT WASN'T A DROP, and blood
       pressure climbing fourteen points came out as steady — in green.
       Going up has a name. */
    pressaoEmQueda: 'Trending down',
    pressaoEmAlta: 'Trending up',
    pressaoEstavel: 'Steady',
  },

  metaDePeso: {
    /* "Reach 150 lb", not "Goal: 150 lb": the list is of things to
       achieve, and the verb is what makes it look like one. */
    chegarA: (peso: string) => `Reach ${peso}`,
    alcancada: 'goal reached',
    faltam: (quanto: string) => `${quanto} to go`,
  },

  /* ⚠️ ONLY APPLE'S NAME CHANGES BY LANGUAGE — Apple translates the name
     of its own app. Health Connect, Garmin, Fitbit and Withings are
     brands and stay in the code: brands aren't translated. */
  fontes: {
    appleSaude: 'Apple Health',
  },
};
