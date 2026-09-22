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

  /* ⚠️ The journey screen lives in `home` because it is the same
     conversation — the type labels and week plurals were already here.
     See ../pt-BR/home for the three silences. */
  telaJornada: {
    ultimos7: 'YOUR LAST 7 DAYS',
    doseEm: (quando: string) => `dose ${quando}`,
    diasComCheckin: (feitos: number, aplicadas: number, vividas: number) =>
      `${feitos} of 7 days with a check-in · ${aplicadas} of ${vividas} weeks with an injection`,
    semanaASemana: 'Week by week. Tap to see what marked each cycle.',
    semanaEDia: (semana: number, dia: number) => `WEEK ${semana} · DAY ${dia}`,
    noInicio: (peso: string) => `${peso} at the start`,
    hoje: 'today',
    faltam: (peso: string) => `${peso} to go`,

    protocolos: 'Protocols',
    sinaisVitais: 'Vitals',
    refeicoesContadas: (quantas: number) => `${quantas} meals`,
    aguaHoje: (quanto: string) => `${quanto} today`,
    minutosHoje: (minutos: number) => `${minutos} min today`,
    indicadores: (quantos: number) => `${quantos} ${quantos === 1 ? 'reading' : 'readings'}`,
    feitasDeTotal: (feitas: number, total: number) => `${feitas} of ${total}`,

    semRegistro: 'nothing logged',
    semQueixas: 'no complaints this week',
    sintomaEmDias: (sintoma: string, dias: number) =>
      `${sintoma.toLowerCase()} on ${dias} ${dias === 1 ? 'day' : 'days'}`,

    dosesNaCaneta: (restam: number, total: number, semanas: number) =>
      `${restam} of ${total} doses in the pen · about ${semanas} ${semanas === 1 ? 'week' : 'weeks'}`,

    oQueJaMudou: 'What has changed',
    evolucao: 'Progress',
    suasMetas: 'Your goals',
    metas: 'Goals',
    oDiaADia: 'Day to day',
    seuTratamento: 'Your treatment',
    verTudo: 'See all',

    porSemana: 'By week',
    semana: (numero: number) => `Week ${numero}`,
    doseAjustada: 'dose adjusted',
    semRegistrosNaSemana: 'Nothing logged this week.',
    nadaNesteTipo: 'Nothing logged in this type yet',

    metaFeita: 'done',
    metaAberta: 'open',
  },

  telaInicio: {
    bomDia: 'Good morning',
    boaTarde: 'Good afternoon',
    boaNoite: 'Good evening',
    linhaDoDia: (dia: string, semana: number) => `${dia} • Week ${semana}`,

    semRegistro: 'NOT LOGGED',
    semRegistroOntem: 'Yesterday’s injection isn’t logged.',
    semRegistroDias: (dias: number) => `The injection from ${dias} days ago isn’t logged.`,
    semRegistroCorpo: 'If you did it, you can log it now. If you didn’t, the cycle picks up again from the next one.',
    semRegistroCta: 'Log an injection',

    aConsulta: 'YOUR APPOINTMENT',
    consultaHoje: 'Your appointment is today.',
    consultaAmanha: 'Your appointment is tomorrow.',
    consultaCorpo: 'I’ll bring the period organized — weight, adherence, symptoms and the questions worth asking.',
    consultaCta: 'See the summary',

    acabou: (oRecipiente: string) => `${oRecipiente} is empty.`,
    restaUmaDose: (onde: string) => `One dose left ${onde}.`,
    receitaCorpo: 'A new prescription takes a few days between the request and the pharmacy — starting now keeps you from stopping halfway.',
    pedirRenovacao: 'Ask for a refill',
    verRecipiente: (oRecipiente: string, _recipiente: string) => `See ${oRecipiente}`,

    entendaOPorQue: 'Understand why',

    proximaAplicacao: 'NEXT INJECTION',
    hojeEDiaDeAplicar: 'Today is your injection day.',
    proximaDose: (quando: string) => `Your next dose is ${quando}.`,
    doseCorpo: (medicamento: string, dose: string, local: string) =>
      `${medicamento} ${dose} · ${local} suggested.`,
    verAplicacao: 'See the injection',
    criarLembrete: 'Set a reminder',

    checkinFeito: 'Check-in done',
    fazerCheckin: 'Do the check-in',
    diasSeguidos: (dias: number): string => (dias === 1 ? 'day of check‑ins' : 'days of check‑ins in a row'),

    metasDiarias: 'Your daily goals',
    metasLink: 'Goals',
    registrar: 'Log',
    evolucao: 'Your progress',
    evolucaoLink: 'Progress',
    gPorDia: 'g/day',
    semMedida: 'no measurement',

    quemCuida: 'Who looks after you',
    areaMedica: 'Care area',
    mensagens: 'Messages',
    novasMensagens: (quantas: number) =>
      `${quantas} new ${quantas === 1 ? 'message' : 'messages'}`,
    nenhumaMensagem: 'No new messages',
    proximaConsulta: 'Next appointment',
    consultaEm: (data: string, diaDaSemana: string) => `${data} • ${diaDaSemana}`,
    solicitarReceita: 'Request a new prescription',
    solicitarReceitaSub: 'A message to your team',
    acompanhaSeuTratamento: 'Follows your treatment',
    resumoParaConsulta: 'Appointment summary',
    resumoParaConsultaSub: 'Weight, adherence, symptoms and labs in a single document',
    anotarConsulta: 'Note an appointment',
    anotarConsultaSub: 'So we can tell you when it gets close',
    quemAcompanha: 'Who follows your treatment?',
    quemAcompanhaSub: 'Write down the name and the summary comes out addressed for the next appointment.',
    preencherFicha: 'Fill in the details',
  },
};
