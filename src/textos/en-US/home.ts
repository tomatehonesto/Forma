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
    aplicacao: 'Shots',
    peso: 'Weight',
    refeicao: 'Meals',
    exercicio: 'Workouts',
    consulta: 'Appointments',
    exame: 'Labs',
  },

  evento: {
    aplicacao: (dose: string, unidade: string) => `Shot ${dose} ${unidade}`,
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
      `${feitos} of 7 days with a check-in · ${aplicadas} of ${vividas} weeks with a shot`,
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

    dosesRestantes: (restam: number, semanas: number) =>
      restam === 0
        ? 'No doses left'
        : `${restam === 1 ? '1 dose left' : `${restam} doses left`} · about ${semanas} ${semanas === 1 ? 'week' : 'weeks'}`,

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
    semRegistroOntem: 'Yesterday’s shot isn’t logged.',
    semRegistroDias: (dias: number) => `The shot from ${dias} days ago isn’t logged.`,
    semRegistroCorpo: 'If you took it, you can log it now. If you didn’t, the cycle picks back up with your next shot.',
    semRegistroCta: 'Log the shot',

    aConsulta: 'YOUR APPOINTMENT',
    consultaHoje: 'Your appointment is today.',
    consultaAmanha: 'Your appointment is tomorrow.',
    consultaCorpo: 'I’ll have everything since your last visit laid out — weight, adherence, symptoms and the questions worth asking.',
    consultaCta: 'View summary',

    acabou: (oRecipiente: string) => `${oRecipiente} is empty.`,
    restaUmaDose: (onde: string) => `One dose left ${onde}.`,
    receitaCorpo: 'A new prescription takes a few days from request to pharmacy — starting now means you won’t run out mid-treatment.',
    pedirRenovacao: 'Ask for a refill',
    verMedicamento: 'View the medication',

    entendaOPorQue: 'Understand why',

    proximaAplicacao: 'NEXT SHOT',
    hojeEDiaDeAplicar: 'Today is shot day.',
    proximaDose: (quando: string) => `Your next dose is ${quando}.`,
    doseCorpo: (medicamento: string, dose: string, local: string) =>
      `${medicamento} ${dose} · ${local} suggested.`,
    verAplicacao: 'View shot',
    criarLembrete: 'Set a reminder',

    checkinFeito: 'Check-in done',
    fazerCheckin: 'Check in',
    diasSeguidos: (dias: number): string => (dias === 1 ? 'day of check‑ins' : 'days in a row'),

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
    anotarConsulta: 'Add appointment',
    anotarConsultaSub: 'So we can tell you when it gets close',
    quemAcompanha: 'Who follows your treatment?',
    quemAcompanhaSub: 'Add their name and we’ll address your summary to them.',
    preencherFicha: 'Fill in the details',
  },

  telaSemana: {
    titulo: 'Week',
    semanaN: (numero: number) => `Week ${numero}`,
    vazio: 'No weeks logged yet.',
    lead: (periodo: string, dose: string) => `${periodo} · ${dose}`,

    aplicacao: 'Shot',
    semPesagem: 'no weigh-in',

    comoSeSentiu: 'How you felt',
    diasRespondidos: (quantos: number) => `${quantos} of 7 days answered`,
    sintomaDias: (legenda: string, dias: number) =>
      `${legenda} · ${dias} ${dias === 1 ? 'day' : 'days'}`,
    energia: 'Energy',
    energiaDe5: (media: string) => `${media} out of 5`,

    diaADia: 'Day by day',
    diaComData: (diaDaSemana: string, data: string) => `${diaDaSemana}, ${data}`,
    selo: {
      aplicacao: 'shot',
      checkin: 'check-in',
      peso: 'weigh-in',
      refeicao: 'meal',
      exercicio: 'exercise',
      consulta: 'appointment',
      exame: 'lab result',
    },

    nota: 'Note for the appointment',
    verTodas: 'See all',
    nenhumaNota: 'No note this week',
    anotadaEm: (data: string) => `Written on ${data}`,
    toqueParaEscrever: 'Tap to write one',
  },

  telaRegistrar: {
    titulo: 'What do you want to log?',

    checkinChapeu: 'DAILY CHECK-IN',
    checkinFeito: 'Done today',
    checkinPendente: 'How are you feeling today?',
    checkinEditar: 'Edit',
    diasSeguidos: (dias: number): string => (dias === 1 ? 'day in a row' : 'days in a row'),

    agua: 'I drank\nwater',
    /* ⚠️ THE TARGET ARRIVES WITH ITS UNIT INSIDE, so no "L" here: on
       imperial both numbers are ounces. Reasons in ../pt-BR/home.ts. */
    aguaSub: (bebido: string, alvo: string) => `${bebido} of ${alvo}`,
    exercicio: 'I\nmoved',
    exercicioSub: (feito: number, alvo: number) => `${feito} of ${alvo} min`,
    refeicao: 'I had a meal',
    refeicaoSub: (proteina: number, alvo: number) => `${proteina} of ${alvo} g`,

    levaUmMinuto: 'TAKES A MINUTE',
    aplicacao: 'I took my dose',
    peso: 'I just weighed myself',
    medidas: 'I measured my body',
    exame: 'I got a lab result',
    anotacao: 'I wrote something down for my appointment',
  },
  telaRitmo: {
    titulo: 'How we read your pace',
    sub: 'This label is about how steady the treatment is, not how fast the weight comes off.',

    aplicacoes: 'Shots on time',
    aplicacoesSub: (aplicadas: number, vividas: number) =>
      `${aplicadas} of ${vividas} ${vividas === 1 ? 'week' : 'weeks'}`,

    intervalo: 'Time between doses',
    intervaloEmDia: (dias: number) => `${dias} ${dias === 1 ? 'day' : 'days'}, no long delays`,
    intervaloMaior: (dias: number) => `longest gap: ${dias} ${dias === 1 ? 'day' : 'days'}`,

    sintomas: 'Symptoms reported',
    sintomasLeves: 'Mild',
    sintomasModerados: 'Mild to moderate',
    sintomasFortes: 'Moderate to strong',

    seloOk: 'ok',
    seloAtencao: 'watch',
    seloIrregular: 'irregular',
    seloEstavel: 'steady',
    seloEmAlta: 'rising',

    avisoTitulo: 'A different week doesn’t change the label',
    avisoTexto: (etiqueta: string) =>
      `It doesn’t go up or down with how much you lost, and it’ll never tell you the week was bad. Right now it reads “${etiqueta}”.`,

    entendi: 'Got it',
  },
  telaProtocolos: {
    semanaN: (n: number) => `Week ${n}`,
    tudoCumprido: 'all done',
    cumpridasDeTotal: (feitas: number, total: number) => `${feitas} of ${total} done`,
    aplicacaoEm: (quando: string) => `shot ${quando}`,

    falarComEquipe: 'Talk to the team',

    estaSemana: 'This week',
    ressalva: 'These goals are ways to get more out of the treatment, not a list of demands — you don’t have to close them all. What actually drives the treatment is the dose and your follow-up. Anything left open starts over next week, and the counts fill in on their own from what you log.',

    ressalvaDaSemana: 'The goals are today’s, measured against this week’s records.',

    semanasAnteriores: 'Previous weeks',
    semanasAnterioresNota: 'Today’s goals, measured against each week’s records.',
  },
  telaDia: {
    registrosDeste: 'Entries for this day',
    diaDeAplicacao: 'Shot day',
    nadaRegistrado: 'nothing logged yet',

    aplicacao: 'Shot',
    doseLinha: (med: string, dose: string, unidade: string, estado?: string) =>
      `${med} ${dose} ${unidade}${estado ? ` · ${estado}` : ''}`,
    prevista: 'due today',
    semRegistroMinusculo: 'no entry',

    escalaDe: (nome: string, valor: number, max: number) => `${nome} ${valor} of ${max}`,
    respondidoNesteDia: 'Answered on this day',
    semRegistro: 'No entry',

    seloFeita: 'done',
    seloFeito: 'done',
    seloRegistrar: 'record',

    semPrazo: 'Days with no entry stay blank. You can fill them in later, with no deadline.',
  },
};
