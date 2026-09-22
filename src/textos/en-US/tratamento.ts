/* ============================================================
   TREATMENT — the dose, the cadence, the milestones and the scales · en-US

   ⚠️ Reasons live in ../pt-BR/tratamento.ts. What they share: these are
   the words that describe the treatment itself, and almost all of them
   appear on more than one screen.

   ⚠️ NONE OF THEM GRADES THE PERSON. The pace and supply labels qualify
   the NUMBER, not whoever produced it.
   ============================================================ */

export const tratamento = {
  /* ⚠️ The KEY is the Portuguese name and never changes — it is what
     `MEDS[x].mol` stores and what `faixaDaMolecula` compares. Only the
     value below is the screen. See ../pt-BR/tratamento. */
  molecula: {
    'Tirzepatida': 'Tirzepatide',
    'Semaglutida': 'Semaglutide',
    'Dulaglutida': 'Dulaglutide',
    'Liraglutida': 'Liraglutide',
    '—': '—',
  } as Record<string, string>,

  /* ⚠️ THE ABSENCE HAS ITS OWN PHRASE, short on purpose: it lands inside
     other sentences, as in "Mounjaro not set yet". */
  doseIndefinida: 'not set yet',

  /* ⚠️ TWO LENGTHS, ON PURPOSE. A screen's opening line spells it out; a
     cell in the medical summary table has no such width. Keep both short
     enough for where they go — the short one sits next to a number. */
  cadenciaSemanal: 'once a week',
  cadenciaDiaria: 'daily',
  cadenciaOutra: (dias: number) => `every ${dias} days`,
  cadenciaSemanalCurta: '1×/week',
  cadenciaDiariaCurta: 'daily',
  cadenciaOutraCurta: (dias: number) => `every ${dias} days`,

  /* Before it starts there is a countdown; after, the day. */
  antesDaPrimeiraDose: 'Before your first dose',
  comecaAmanha: 'Starts tomorrow',
  comecaEm: (dias: number) => `Starts in ${dias} days`,
  /* ⚠️ "DAY 71", NOT "DAY 71 OF TREATMENT". The line this sits on already
     ends in "Week 10", and the two together can only be counting the same
     thing. */
  diaDoTratamento: (dia: number) => `Day ${dia}`,

  /* ⚠️ NEGATIVE PACE IS NOT "SLOWER PACE". Someone who gained weight fell
     into the last label, and the card said "Slower pace" in green next to
     a number that went up. Slow and backwards are different things, and
     only one of them is a pace.

     ⚠️ AND FASTER IS NOT BAD. Losing more than three pounds a week is a
     reason to talk to the care team — lean mass, hydration — not a
     mistake the person made. The word can't sound like a scolding. */
  ritmoAcimaDoInicio: 'Above your starting weight',
  ritmoSaudavel: 'Healthy pace',
  ritmoAcelerado: 'Faster pace',
  ritmoLento: 'Slower pace',

  /* Three degrees, and the middle one shows up most: "worth refilling" is
     a heads-up weeks in advance, not an alarm. */
  estoqueUrgente: 'Refill now',
  estoqueRenovar: 'Worth refilling your prescription',
  estoqueEmDia: 'Supply on track',

  /* ⚠️ THE SIDE IS ABBREVIATED IN PARENTHESES because these labels appear
     inside short lines — history, the day's suggestion, the weekly
     summary. "Left side of the abdomen" fits in none of them. */
  locais: {
    'abd-e': 'Abdomen (left)',
    'abd-d': 'Abdomen (right)',
    'coxa-e': 'Thigh (left)',
    'coxa-d': 'Thigh (right)',
    'braco-e': 'Arm (left)',
    'braco-d': 'Arm (right)',
  },

  marcos: {
    inicio: 'Treatment started',
    doseAjustada: (dose: string) => `Dose adjusted to ${dose} mg`,
    /* ⚠️ "AS DIRECTED BY YOUR PRESCRIBER" is what keeps the line from
       sounding like the app adjusted something. It records; the person
       who prescribes adjusts. */
    titulacao: 'Titration as directed by your prescriber',
    cincoPorCento: '5% of starting weight',
    /* ⚠️ "BEYOND THE SCALE" is the heart of it: 5% is the mark from which
       the literature shows gains in blood pressure, glucose and
       triglycerides. Without that half, the line is just another weight
       number. */
    cincoPorCentoSub: 'A clinical mark, with benefits beyond the scale',
    consulta: (tipo: string) => `${tipo} appointment`,
    marcadoresImportados: (quantos: number) => `${quantos} markers imported`,
  },

  /* ⚠️ THESE ARE THE NAMES OF THE CLASSIFICATION, not adjectives we chose.
     "Class I obesity" is the term on the report; softening it would put
     the app out of step with what the person reads at the lab and hears
     at the appointment. Where care comes in is the TONE of the color,
     which is a screen decision. */
  imc: {
    abaixo: 'Underweight',
    normal: 'Normal weight',
    sobrepeso: 'Overweight',
    grau1: 'Class I obesity',
    grau2: 'Class II obesity',
    grau3: 'Class III obesity',
  },

  /* ⚠️ NONE OF THE FIVE IS ABOUT APPEARANCE ALONE, and "How I see myself"
     is the closest on purpose: the sentence is the person's about
     themselves, not the app's about their body. */
  motivos: {
    saude: 'Health',
    saudeSub: 'Labs, blood pressure, glucose',
    energia: 'Energy',
    energiaSub: 'Getting through the day',
    espelho: 'How I see myself',
    espelhoSub: 'In the mirror and in photos',
    confianca: 'Confidence',
    confiancaSub: 'Feeling good in my own skin',
    medico: 'Medical advice',
    medicoSub: 'It came from whoever follows my care',
  },

  /* ⚠️ THE SUBTITLE IS WHAT MAKES THE STEP MEAN ANYTHING. Without "1 to 3
     days a week", "lightly active" is self-assessment, and every person
     puts themselves on a different step — about a number that becomes
     their protein goal. */
  atividades: {
    sedentario: 'Sedentary',
    sedentarioSub: 'Little or no exercise',
    leve: 'Lightly active',
    leveSub: '1 to 3 days a week',
    moderado: 'Moderately active',
    moderadoSub: '3 to 5 days a week',
    muito: 'Very active',
    muitoSub: '6 to 7 days a week',
  },

  /* ⚠️ Duration is a language rule and used to be written in the screen
     file. See ../pt-BR/tratamento. */
  telaExercicio: {
    titulo: 'Exercise',
    unidadeMin: 'min',
    duracao: (min: number) => {
      if (min < 60) return `${min} min`;
      const h = Math.floor(min / 60);
      const m = min % 60;
      return m ? `${h} hr ${m}` : `${h} hr`;
    },

    hojeSemTreino: (daSemana: number) => `Today: no workout yet · ${daSemana} min this week`,
    hojeComTreino: (hoje: number, alvo: number, resto: string) => `Today: ${hoje} of ${alvo} min · ${resto}`,
    metaAlcancada: 'goal reached',
    faltamMin: (falta: number) => `${falta} min to go`,
    registrarTreino: 'Log a workout',

    movimentoTitulo: 'Your movement',
    estaSemana: 'This week',
    nenhumDiaComMovimento: 'No day with movement',
    emDiasDosSete: (dias: number) => `On ${dias} of seven ${dias === 1 ? 'day' : 'days'}`,
    metaMin: (alvo: number) => `Goal: ${alvo} min`,

    semForca: 'No strength work this week. Weights, pilates and functional are what hold the muscle.',
    comForca: (dias: number) => `${dias} ${dias === 1 ? 'day' : 'days'} with strength work — that’s what holds the muscle while the weight comes down.`,

    minutosPorSemana: 'Minutes per week',
    mediaOitoSemanas: 'Average of the last 8 weeks',
    semanaDe: (data: string) => `week of ${data}`,

    periodo7: '7 days',
    periodo30: '30 days',
    periodo90: '3 months',
    noPeriodo: 'In this period',
    noPeriodoNota: 'Only what was logged here — what comes from the watch has no activity type.',
    treinos: 'Workouts',
    tempo: 'Time',
    maisLongo: 'Longest',
    deForca: 'Strength',

    diarioTitulo: 'Workout diary',
    diarioNota: 'Tap a workout to see, fix or delete it.',
    diaVazioTitulo: 'No workout on this day',
    diaVazioTexto: 'Rest is part of it too.',

    integracoes: 'Connections',
    conectar: 'Connect a watch or app',
    lancamSozinhos: 'They log the minutes on their own',
    conectarSub: 'Apple Health, Health Connect, Garmin and others',
  },

  telaAplicacoes: {
    aplicada: 'logged',
    semCulpa: 'No guilt over a day that passed — what counts is picking it back up. You can log an earlier injection at any time, with the button below.',
    titulo: 'Injections',
    registrar: 'Log an injection',
    lead: (med: string, molecula: string, cadencia: string) => `${med} · ${molecula} · ${cadencia}`,

    proximaAplicacao: 'NEXT INJECTION',

    cicloDaDose: 'Dose cycle',
    cicloSub: (dia: number, total: number, fase: string) => `Day ${dia} of ${total} · ${fase.toLowerCase()}`,
    emCurso: 'under way',

    eReceita: (recipiente: string) => `${recipiente} and prescription`,
    dosesUsadas: (usadas: number, total: number, onde: string) => `${usadas} of ${total} doses used ${onde}`,
    cobreSemanas: (veredito: string, semanas: number) =>
      `${veredito} — covers about ${semanas} ${semanas === 1 ? 'week' : 'weeks'}`,

    alertasDeDose: (quantos: number) => `${quantos} injection ${quantos === 1 ? 'reminder' : 'reminders'}`,
    nenhumAlerta: 'No injection reminder',
    tocaEm: (quando: string) => `Rings ${quando}`,
    avisoAntes: 'A heads-up before the dose, at the time you choose',

    rodizioTitulo: 'Rotating the sites',
    naoUsado: 'Not used yet — it’s its turn.',
    proximoDaRotacao: 'It’s next in the rotation, even though it was used this week.',
    descansandoHa: (semanas: number) =>
      `Resting for ${semanas} ${semanas === 1 ? 'week' : 'weeks'} — it’s its turn.`,
    usadoHaPouco: 'used recently',
    oProximo: 'next up',
    proxima: 'next',

    constancia: 'Consistency',
    constanciaNota: (feitas: number, previstas: number) =>
      `${feitas} of ${previstas} doses planned since treatment began.`,

    nivelNoCorpo: 'Level in the body',
    nivelTexto: (molecula: string, meiaVida: string) =>
      `Estimated ${molecula} in the body, with a half-life of ${meiaVida}. The lowest point, just before the next dose, is usually when hunger picks up.`,
    meiaVidaDias: (dias: number) => `${dias} days`,
    meiaVidaHoras: 'about 13 hours',

    historico: 'History',
    proximaEmLocal: (local: string) => `Next · ${local}`,
  },
};
