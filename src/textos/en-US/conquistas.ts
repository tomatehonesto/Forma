/* ============================================================
   ACHIEVEMENTS — the tracks, what each level says, what's left · en-US

   ⚠️ Reasons live in ../pt-BR/conquistas.ts. Two carry over:

   THE `id`s AND THE LEVELS ARE NOT HERE. Per-language levels would make
   the same person earn different achievements depending on the language
   they read in.

   AND EACH TRACK SPEAKS IN TWO TENSES: `desc` is what that level already
   IS, read with pride; `falta` is what separates them from the next, and
   has to fit one line without sounding like a demand. "X to go", not "you
   need X": the subject is the distance, not the person.

   ⚠️ ENGLISH PLURALS ARE SIMPLER THAN PORTUGUESE ONES, but not free:
   "check-in" takes an s, "serving" takes an s, and the irregulars are
   written out where they exist. The helper stays for the same reason the
   Portuguese one exists.
   ============================================================ */

const p = (n: number, s: string, pl = `${s}s`) => `${n} ${n === 1 ? s : pl}`;

export const conquistas = {
  familias: {
    tratamento: 'Treatment',
    peso: 'Weight',
    constancia: 'Consistency',
    hidratacao: 'Hydration',
    proteina: 'Protein',
    movimento: 'Movement',
    comida: 'Nutrition',
    acompanhamento: 'Follow-up',
  },

  /* ---------------- treatment ---------------- */
  doses: 'Shots',
  dosesDesc: (a: number) => `${p(a, 'shot')} logged`,
  dosesFalta: (r: number) => `${p(r, 'shot')} to go`,

  tempo: 'Time in treatment',
  /* Under a year it counts in months, from there in years: "12 months"
     and "1 year" are the same span, and only the second gets celebrated. */
  tempoDesc: (a: number) => (a < 365
    ? `${p(a / 30, 'month')} since your first dose`
    : `${p(a / 365, 'year')} since your first dose`),
  tempoFalta: (r: number) => `${p(r, 'day')} to go`,

  /* ⚠️ ROTATION ISN'T DECORATION: repeating the same spot causes lumps,
     and alternating is label guidance. It's the only track that rewards a
     safety practice. */
  rodizio: 'Rotation',
  rodizioDesc: (a: number) => `${p(a, 'injection site')} used`,
  rodizioFalta: (r: number) => `${p(r, 'site')} to go`,

  titulacao: 'Titration',
  titulacaoDesc: (a: string) => `Reaching the ${a} dose`,
  titulacaoFalta: (a: string) => `Next: ${a}`,

  /* ---------------- weight ---------------- */
  /* ⚠️ THE WEIGHT ARRIVES ALREADY WRITTEN, in the unit of whoever is
     reading — "5.0 kg below your starting weight". See logic/medidas.

     ⚠️⚠️ WHICH IS WHY THE TITLE NAMES NO UNIT. "Pounds down" over a
     value in kilos was this screen contradicting itself, for every
     reader on metric. Reasons in ../pt-BR/conquistas.ts. */
  kg: 'Weight down',
  kgDesc: (peso: string) => `${peso} below your starting weight`,
  kgFalta: (peso: string) => `${peso} to go`,

  /* ⚠️ THE PERCENTAGE IS A DIFFERENT CONVERSATION, not a repeat of the
     weight: five percent is the clinical mark the literature uses, and
     twenty pounds means different things in different bodies. */
  pct: 'Percent lost',
  pctDesc: (a: number) => `${a}% of your starting weight`,
  pctFalta: (r: string) => `${r} points to go`,

  pesagens: 'Weigh-ins',
  pesagensDesc: (a: number) => `${p(a, 'weigh-in')} logged`,
  pesagensFalta: (r: number) => `${p(r, 'weigh-in')} to go`,

  /* ---------------- consistency ---------------- */
  checkins: 'Check-ins',
  checkinsDesc: (a: number) => `${p(a, 'day')} answered`,
  checkinsFalta: (r: number) => `${p(r, 'day')} to go`,

  sequencia: 'Days in a row',
  sequenciaDesc: (a: number) => `${p(a, 'check-in')} on consecutive days`,
  sequenciaFalta: (r: number, alvo: number) => `${p(r, 'day')} to go to reach ${alvo}`,

  /* ---------------- hydration ---------------- */
  aguaDias: 'Days on your water goal',
  aguaDiasDesc: (a: number) => `${p(a, 'day')} hitting your water goal`,
  aguaDiasFalta: (r: number) => `${p(r, 'day')} to go`,

  aguaSemana: 'A hydrated week',
  aguaSemanaDesc: (a: number) => `${p(a, 'day')} on goal, in the same week`,
  aguaSemanaFalta: (r: number, alvo: number) => `${p(r, 'day')} to go to reach ${alvo}`,

  /* ---------------- protein ---------------- */
  protDias: 'Days on your protein goal',
  protDiasDesc: (a: number) => `${p(a, 'day')} hitting your protein goal`,
  protDiasFalta: (r: number) => `${p(r, 'day')} to go`,

  protSeq: 'Protein in a row',
  protSeqDesc: (a: number) => `${p(a, 'day')} in a row on goal`,
  protSeqFalta: (r: number, alvo: number) => `${p(r, 'day')} to go to reach ${alvo}`,

  /* ---------------- movement ---------------- */
  treinos: 'Workouts',
  treinosDesc: (a: number) => `${p(a, 'session')} logged`,
  treinosFalta: (r: number) => `${p(r, 'workout')} to go`,

  exercSemana: 'An active week',
  exercSemanaDesc: (a: number) => `${p(a, 'day')} on your movement goal, in the same week`,
  exercSemanaFalta: (r: number, alvo: number) => `${p(r, 'day')} to go to reach ${alvo}`,

  /* ---------------- nutrition ---------------- */
  refeicoes: 'Meals',
  refeicoesDesc: (a: number) => `${p(a, 'plate')} logged`,
  refeicoesFalta: (r: number) => `${p(r, 'meal')} to go`,

  favoritos: 'Favorite meals',
  favoritosDesc: (a: number) => `${p(a, 'plate')} saved to repeat`,
  favoritosFalta: (r: number) => `${p(r, 'plate')} to go`,

  /* ---------------- follow-up ---------------- */
  medidas: 'Tape measurements',
  medidasDesc: (a: number) => `${p(a, 'measurement')} logged`,
  medidasFalta: (r: number) => `${p(r, 'measurement')} to go`,

  /* ⚠️ NO UNIT IN THE TITLE, same reason as the weight track. */
  cintura: 'Waist',
  cinturaDesc: (comp: string) => `${comp} off your waist`,
  cinturaFalta: (comp: string) => `${comp} to go`,

  exames: 'Lab results',
  examesDesc: (a: number) => `${p(a, 'panel')} imported`,
  examesFalta: (r: number) => `${p(r, 'panel')} to go`,

  consultas: 'Appointments',
  consultasDesc: (a: number) => `${p(a, 'appointment')} in your history`,
  consultasFalta: (r: number) => `${p(r, 'appointment')} to go`,

  marco: (titulo: string, nivel: number) => `${titulo} · level ${nivel}`,
  tela: {
    titulo: 'Milestones',
    lead: 'Marks that come out of what you logged on their own — nobody here decides whether you deserve them.',

    nivelDeTotal: (nivel: number, total: number) => `Level ${nivel} of ${total}`,
    niveisTotal: (total: number) => `${total} ${total === 1 ? 'level' : 'levels'}`,
    trilhaCompleta: 'Path complete',

    todas: 'All',
    checkinsNoMes: 'check-ins this month',
    niveis: 'levels',
    diasDeJornada: 'days of the journey',

    conquistadas: 'Reached',
    nenhumaAinda: 'None yet',
    nenhumaAindaTexto: 'The ones on the way show up just below.',
    ossoDaRegra: 'Levels come out of your records. If a record goes, the level it closed goes with it.',
    aCaminho: 'On the way',
  },
};
