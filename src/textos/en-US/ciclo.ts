/* ============================================================
   THE DOSE CYCLE — the Home headline and the phases · en-US

   ⚠️ Reasons live in ../pt-BR/ciclo.ts. THE RULE FOR THE WHOLE FILE: none
   of these sentences tells anyone to do anything. They say what is
   happening and what tends to help — the difference between "drink more
   water" and "water holds fullness in this phase" is the difference
   between an app that nags and one that explains, and this is the second.
   ============================================================ */

export const ciclo = {
  /* ⚠️ "DAY 5 OF YOUR DOSE", NOT "DAY 5 OF 7". The out-of-seven read like
     a countdown to a deadline — seven of what, and what happens when it
     lands? The cadence belongs to the medication, not to a quota. */
  chapeuDia: (dia: number) => `DAY ${dia} OF YOUR DOSE`,
  chapeuSemCiclo: 'FOR TODAY',

  /* ---------- injection day ---------- */
  /* ⚠️ IT DOESN'T ANNOUNCE THAT TODAY IS INJECTION DAY: the next Home
     slide is entirely about that, with the dose and the site. */
  aplicHead: 'The effect starts climbing over the next few hours.',
  aplicBody: 'Mild nausea may show up — smaller meals through the day tend to go down easier.',
  aplicQ: 'What to expect on injection day?',

  /* ---------- peak ---------- */
  picoHead: 'Your appetite tends to run lower today.',
  picoBody: 'Peak effect of the medication — a good day to train and to get protein in early.',
  picoQ: 'When do I have the most energy?',

  /* ---------- steady ---------- */
  estabHead: 'Your body is in the steady phase of the cycle.',
  estabBody: 'Constant effect — keeping water and protein up is what sustains fullness.',
  estabQ: 'How does the medication cycle work?',

  /* ---------- hunger returning ---------- */
  retornoHead: 'Your hunger may start rising over the next 24 hours.',
  retornoBody: 'Protein and water hold fullness in this phase of the cycle.',
  retornoQ: 'Why am I hungrier?',

  /* ---------- hunger at its peak ---------- */
  altoHeadHoje: 'Hunger at the highest point of the cycle.',
  altoHeadComData: (quando: string) => `Hunger at the cycle’s high point — injection ${quando}.`,
  /* ⚠️ "DON'T SKIP MEALS" ASSUMES SKIPPING, and at the hunger peak the
     person least likely to skip is the hungry one. The sentence was born
     as advice and landed as a scolding; the affirmative version says the
     same useful thing without accusing anyone. */
  altoBody: 'Smaller portions more often, with protein, hold hunger better.',
  altoQ: 'Why am I hungrier?',

  /* The only line in the app that celebrates sleep, and it exists because
     sleeping well changes the whole day of someone in treatment. */
  dormiuBem: (resto: string) => `You slept well — your body tends to respond better today. ${resto}`,

  /* ---------- the five steps of the stepper ----------

     ⚠️ FIVE HERE AND FOUR BELOW, on purpose. This answers "where am I
     RIGHT NOW"; the table below answers "what does the whole cycle look
     like", and there five rows is one more than fits in the head of
     someone reading it for the first time.

     ⚠️ THE `label` IS THE NAME OF THE STEP AND THE `hint` IS WHAT IT IS.
     The name alone — "Hunger starting to return" — is a diagnosis without
     context, and on a treatment screen that frightens instead of
     orienting. */
  faseAplicLabel: 'Injection',
  faseAplicRange: 'Day 1',
  faseAplicHint: 'The effect starts climbing over the next few hours.',

  fasePicoLabel: 'Peak effect',
  fasePicoRange: 'Days 1–2',
  fasePicoHint: 'Medication at its highest — hunger runs lower.',

  faseEstabLabel: 'Steady',
  faseEstabRange: 'Days 3–4',
  faseEstabHint: 'Constant effect, without big swings.',

  faseRetornoLabel: 'Hunger starting to return',
  faseRetornoRange: 'Days 5–6',
  faseRetornoHint: 'The medication starts to fall, and hunger tends to come back.',

  fasePreLabel: 'Pre-injection',
  fasePreRange: 'Days 7+',
  fasePreHint: 'Lowest point of the cycle, until the next dose.',

  /* ---------- the four phases of the inner screens ----------

     ⚠️ THIS TABLE ASSUMES A WEEKLY CADENCE, and that is known debt:
     someone on a daily medication has no seven-day cycle to cross. It is
     written here so nobody wastes time looking for sense in the day
     labels. */
  faseSubidaTitulo: 'Days 1–2 · rising',
  faseSubidaSub: 'Effect climbing, appetite lower',
  faseSubidaComum: 'mild nausea, filling up fast, less interest in food',
  faseSubidaAjuda: 'smaller meals, further apart; water through the day',

  fasePlatoTitulo: 'Days 3–4 · plateau',
  fasePlatoSub: 'The steadiest phase of the cycle',
  fasePlatoComum: 'steady appetite, slower bowels',
  fasePlatoAjuda: 'putting protein and fiber first at meals',

  faseDescidaTitulo: 'Days 5–6 · falling',
  faseDescidaSub: 'Effect easing, hunger slowly returning',
  faseDescidaComum: 'more hunger than in the first days, energy swinging',
  /* ⚠️ THE SECOND HALF OF THIS LINE IS WHY IT EXISTS. Hunger returning on
     day five frightens people who think the medication stopped working,
     and quitting there is common. Saying it is the phase, not the
     failure, is the whole job of the line. */
  faseDescidaAjuda: 'this is the phase where hunger returns — it doesn’t mean the treatment stopped working',
  /* The only phase with a caution: it is where the symptoms that need a
     doctor show up. Not an alarm — the line between what is expected and
     what shouldn't wait for the next appointment. */
  faseDescidaAtencao: 'persistent vomiting or severe abdominal pain: contact your doctor',

  faseBaixoTitulo: 'Day 7 · lowest point',
  faseBaixoSub: 'The day before your next injection',
  faseBaixoComum: 'appetite closer to usual',
  /* "The dose", not "the pen": this table is constant and doesn't know
     the form of the medication. */
  faseBaixoAjuda: 'have the dose and the injection site decided the night before',
  tela: {
    titulo: 'Dose cycle',
    diaDepois: (dia: number, acao: string) => `Day ${dia} after\nyour ${acao}`,
    lead: 'The effect of the medication rises in the first days and eases off until the next dose. What you feel moves with it — and that is expected.',

    cicloAtual: 'Current cycle',
    diaDeTotal: (dia: number, total: number) => `day ${dia} of ${total}`,
    proximaDose: (data: string) => `Next dose ${data}`,

    asQuatroFases: 'The four phases',
    comum: 'Common',
    ajuda: 'Helps',
    atencao: 'Watch out',

    conteudoGeral: 'This is general content',
    conteudoGeralTexto: 'The cycle varies from person to person and with the dose. Nothing here replaces your doctor’s guidance.',

    baseadoEm: (molecula: string) => `Based on the typical behavior of ${molecula}`,
  },
};
