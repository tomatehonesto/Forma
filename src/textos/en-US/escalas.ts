/* ============================================================
   THE RULERS — what each number means · en-US

   ⚠️ Reasons live in ../pt-BR/escalas.ts. The one that must survive
   translation: THIS IS THE TEXT PEOPLE TAP, not the text they read.
   Moving a step changes what gets STORED — today's 4 would stop meaning
   yesterday's 4, and the series that feeds the radar, the goals and the
   appointment summary would lose its footing. Keep the ORDER and the
   distance between steps before thinking about the words.

   ⚠️ AND EVERY LINE AVOIDS GENDER AGREEMENT, which English gets for free
   but which the Portuguese file had to solve verb by verb. Nothing here
   should reintroduce it in a future language.
   ============================================================ */

export const escalas = {
  /* ---------- the four check-in axes ---------- */
  energia: ['Running on empty', 'Dragging through it', 'Enough to get by', 'Feeling up for it', 'Energy to spare'],

  /* ⚠️ THE SPACE BEFORE THE "h" IS A NO-BREAK SPACE (U+00A0), written as
     an escape here so it can't be lost in a copy-paste. In a narrow field
     the line broke between the number and the letter and left an orphan
     "h" on the second line. */
  sono: ['5 h or less', 'About 6 h', 'About 7 h', 'About 8 h', '9 h or more'],

  humor: ['A hard day', 'A bit low', 'An ordinary day', 'A good day', 'A great day'],

  /* ⚠️ HUNGER IS THE OPPOSITE OF FULLNESS, and the radar reads it as
     fullness. 1 is the LEAST hunger so the ruler climbs with the symptom,
     like the others. Reversing this reverses the radar axis. */
  fome: ['Not hungry', 'A little hungry', 'Normal hunger', 'Quite hungry', 'Hungry all day'],

  /* ---------- the symptoms, each with its own ruler ---------- */
  intensidade: ['Barely noticed', 'Mild', 'Bothersome', 'Got in the way', 'Took over the day'],

  sintoma: {
    nausea: ['A slight queasiness', 'Nausea coming and going', 'Constant nausea', 'Almost threw up', 'Threw up'],
    constip: ['Went, with effort', 'One day without', 'Two days without', 'Three days without', 'Four days or more'],
    /* ⚠️ THE FLOOR IS A RANGE, NOT "ONCE", and that is a clinical call and
       not a writing one: one loose stool is not diarrhea. The WHO
       definition starts at three loose stools in a day. With the floor at
       once, the scale would call a symptom what is still normal for many
       people — and a column that calls everything diarrhea is a column
       you can't read anything from later.

       So: step 1 is "loose, but not that yet", step 2 is where the WHO
       starts calling it diarrhea, and step 5 is the band clinical grading
       treats as severe. Keep the cuts at the same NUMBERS, not at the
       same words. */
    diarreia: ['Once or twice', 'Three times', 'Four times', 'Five to six times', 'Seven or more'],
    refluxo: ['Mild burning', 'After meals', 'Several times a day', 'Made eating hard', 'Couldn’t lie down'],
    fadiga: ['A little tired', 'Tired out faster', 'Had to slow down', 'Had to lie down', 'Didn’t get out of bed'],
    cefaleia: ['A twinge', 'Mildly bothersome', 'Needed medication', 'Got in the way', 'Stayed in the dark'],
    tontura: ['Slightly off balance', 'On standing up fast', 'Several times a day', 'Had to hold on', 'Couldn’t stay standing'],
    /* ⚠️ VOMITING IS COUNTED, NOT GRADED: "got in the way" says nothing
       about throwing up, and the number of times is what the care team
       will ask for. */
    vomito: ['Once', 'Twice', 'Three times', 'Four or more', 'Couldn’t stop'],
    dor: ['Some discomfort', 'Mild cramping', 'Constant cramping', 'Had to stop my day', 'Pain that wouldn’t let up'],
  },

  /* ⚠️ THE KEYS ARE DATA and are not translated: 'normal', 'preso',
     'solto' and 'alterna' are what gets stored in `gut`. Only the label
     comes from here.

     ⚠️ AND "ALTERNATED" IS A FIRST-CLASS ANSWER, not an edge case. Slowing
     down and speeding up are the two ends of the same effect. */
  intestino: {
    normal: 'Normal',
    preso: 'Constipated',
    solto: 'Loose',
    alterna: 'Alternated',
  },

  /* ⚠️ TWO LISTS BECAUSE THEY ARE TWO QUESTIONS. The asking list has one
     bowel item; the reading list splits it, because "bowel on four days"
     would add constipated days to loose ones. The `id`s are data. */
  nomes: {
    nausea: 'Nausea',
    intestino: 'Bowels',
    vomito: 'Vomiting',
    dor: 'Abdominal pain',
    refluxo: 'Reflux',
    fadiga: 'Fatigue',
    cefaleia: 'Headache',
    tontura: 'Dizziness',
    outro: 'Other',
    preso: 'Constipation',
    solto: 'Loose stools',
  },

  tela: {
    titulo: 'Symptoms',
    diasRespondidos: (quantos: number, de: number) =>
      `${quantos} ${quantos === 1 ? 'day answered' : 'days answered'} in the last ${de}`,
    nenhumDia: (de: number) => `No days answered in the last ${de}`,

    nestaSemana: 'This week',
    semRespostaSemana: 'You have not answered about symptoms this week yet. They come in through the check-in.',
    fazerCheckin: 'Do the check-in',
    nenhumSintoma: 'No symptoms this week',
    nenhumSintomaSub: (respondidos: number) =>
      `${respondidos} ${respondidos === 1 ? 'day answered' : 'days answered'}, none with a complaint.`,
    diasDe: (dias: number, respondidos: number) =>
      `${dias} of ${respondidos} ${respondidos === 1 ? 'day' : 'days'}`,
    noPiorDia: (legenda: string) => `On the worst day: ${legenda}`,
    citacao: (texto: string) => `“${texto}”`,
    voceEscreveuEm: (data: string) => `You wrote on ${data}`,

    aoLongoDoCiclo: 'Across the cycle',
    aoLongoNota: (dias: number) =>
      `Average nausea on each day after the injection, from ${dias} ${dias === 1 ? 'day answered' : 'days answered'}.`,
    dose: 'dose',

    cicloParecido: 'Across the days answered so far, nausea looks much the same through the whole cycle — it is not following the dose.',
    cicloPoucos: 'Too few days answered so far to say whether nausea follows the cycle. Answer a few more and this calculation stands up.',
    cicloInicio1: 'Nausea weighs most on injection day.',
    cicloInicioN: (dias: number) => `Nausea weighs most in the first ${dias} days after the injection.`,
    cicloFim1: 'Nausea weighs most the day before the next injection.',
    cicloFimN: (dias: number) => `Nausea weighs most in the ${dias} days leading up to the next injection.`,
    cicloDia0: 'on injection day',
    cicloDiaN: (dia: number) => `on day ${dia} after`,
    cicloEspalhado: (lista: string) => `Nausea weighs most ${lista}.`,

    comoSeSentiu: 'How you felt',
    respostasEm14: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'answer' : 'answers'} in 14 days`,
    semRespostas: 'No answers yet',
    sentir: {
      energia: 'Energy',
      humor: 'Mood',
      sono: 'Sleep',
      fome: 'Hunger',
    },
  },
};
