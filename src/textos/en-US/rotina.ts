/* ============================================================
   THE ROUTINE — the protocol, the nudges, the prep and what's past · en-US

   ⚠️ Reasons live in ../pt-BR/rotina.ts.
   ============================================================ */

export const rotina = {
  /* ⚠️ A SUGGESTED QUESTION IS THE FRONT DOOR TO THE AI. If it comes out
     generic — "How am I doing?", always — the intelligence never proves
     itself.

     ⚠️ AND THEY ARE THE PERSON'S QUESTIONS, NOT OUR OFFERS. "Why was I
     hungrier today?" is how someone thinks; "Understand returning hunger"
     is how a menu talks. */
  perguntas: {
    maisFome: 'Why was I hungrier today?',
    semFome: 'Why am I not hungry?',
    /* "Dose", and it was "shot" (01/10/2026). See ../pt-BR. */
    depoisDaAplicacao: 'What to expect after my dose?',
    diminuirEnjoo: 'How do I ease the nausea?',
    trocarODia: 'Can I change my dose day?',
    meusExames: 'What do my labs show?',
    meuProgresso: 'Look at my progress',
    prepararConsulta: 'Prep my appointment',
    primeiraDose: 'What to expect from my first dose?',
    porQueEnjoo: 'Why does treatment cause nausea?',
    oQueRegistrar: 'What should I log at the start?',
    comoFunciona: 'How does the medication work?',
  },

  /* ⚠️⚠️ THE IMPERATIVE HERE IS ON PURPOSE — "Drink more water today",
     "Ask for a refill". In a sweep for text that nags the person, this
     list shows up whole and looks like the worst find in the app; it
     isn't.

     Nagging is the app judging what already happened. This is the shape
     of a to-do list, and it is what the person opened the screen for.
     Softening it into a noun phrase doesn't make the text kinder, it
     makes the suggestion timid — and a timid suggestion in a list of four
     is decoration.

     ⚠️ WHAT MAY NEVER BE IMPERATIVE IS THE `porque`: that is where the
     fact lives, and a fact in the imperative becomes a sermon. The top
     line tells, the bottom line explains. */
  empurroes: {
    agua: 'Drink more water today',
    /* ⚠️ THE REASON USED TO BE A DEFICIT WITH THE PERSON'S NAME IN FRONT.
       "You're below half your goal" puts the subject in the position of
       whoever failed. What's missing in water is a fact of the day, not a
       character flaw. */
    aguaPorqueComEnjoo: 'On your well-hydrated days nausea shows up less — and the day is still short of the goal',
    aguaPorque: 'The day is still short of the goal, and water keeps you full to the end of it',

    proteina: 'Add protein at dinner',
    proteinaPorque: 'You’re in the phase of the cycle where hunger comes back, and today’s protein shows up in tomorrow’s hunger',

    checkin: 'Today’s check-in',
    checkinPorque: 'It’s the record that feeds everything I can see about you',

    /* The container and its article come from logic/formas: "Get the pen
       out", "Get the vial out". */
    /* ⚠️ THE SITE ONLY EXISTS FOR PEOPLE WHO INJECT (01/10/2026): "pick the
       site" was said to people on tablets. See ../pt-BR. */
    aplicacao: (recipiente: string, injetavel: boolean): string =>
      (injetavel ? `Get ${recipiente} out and pick the site` : `Get ${recipiente} out`),
    aplicacaoPorque: (injetavel: boolean): string => (injetavel
      ? 'Your next dose is coming up, and rotating the site reduces skin irritation'
      : 'Your next dose is coming up, and keeping the blister pack handy helps you not forget'),

    receita: 'Ask for a prescription refill',
    /* ⚠️ The word "doses" used to live in the call site. See ../pt-BR. */
    receitaPorque: (doses: number, onde: string) =>
      `${doses} ${doses === 1 ? 'dose' : 'doses'} left ${onde} — ask now and it arrives before you run out`,

    examePorque: 'It’s still open on this week’s protocol, and results usually take a few days',

    consulta: 'Get your questions ready for the appointment',
    consultaPorque: (tipo: string, doutor: string) =>
      `${tipo} with ${doutor} — I put the summary together, you pick what to ask`,
  },

  /* ⚠️ THE GROUP LABEL COMES FROM THE DEADLINE, and the deadline comes
     from the data. "This week: schedule labs" is a to-do list; "In 9
     days: get your questions ready" is someone organizing another
     person's calendar. */
  prazo: {
    hoje: 'Today',
    amanha: 'Tomorrow',
    estaSemana: 'This week',
    daquiA: (dias: number) => `In ${dias} days`,
  },

  /* ⚠️ THESE SENTENCES ARE WHAT THE CLINIC PRESCRIBES, and the register is
     more formal than the rest of the app because of it. */
  protocolo: {
    aguaTodoDia: (quanto: string) => `Drink ${quanto} every day`,
    aguaEmDias: (quanto: string, dias: number) => `Drink ${quanto} on ${dias} days`,
    origemAgua: 'Hydration',

    proteinaTodoDia: (gramas: number) => `Eat ${gramas} g of protein every day`,
    proteinaEmDias: (gramas: number, dias: number) => `Eat ${gramas} g of protein on ${dias} days`,
    origemProteina: 'Nutrition',

    /* Days WITH MOVEMENT, not minutes: that's what the item asks for —
       get off the couch three times — and it's what the log can say
       without guessing the activity. */
    exercicio: (dias: number) => `Exercise on ${dias} ${dias === 1 ? 'day' : 'days'} of the week`,
    origemExercicio: 'Exercise',

    aplicacaoUma: 'This week’s dose',
    aplicacaoVarias: (quantas: number) => `${quantas} doses this week`,
    origemAplicacao: 'Doses',

    unidadeDia: ['day', 'days'] as [string, string],
    unidadeAplicacao: ['dose', 'doses'] as [string, string],
    nota: (feito: number, alvo: number, unidade: string) => `${feito} of ${alvo} ${unidade}`,
  },

  /* ⚠️ THE SUMMARY OF EACH GOAL GIVES THE AVERAGE, not whether it was met.
     The week is over; demanding what can no longer change serves nobody.
     "Nothing logged that week" is what you say when there is nothing to
     say — and it is different from zero. */
  semanas: {
    aguaMeta: (quanto: string) => `Drink ${quanto} every day`,
    proteinaMeta: (gramas: number) => `Eat ${gramas} g of protein every day`,
    exercicioMeta: (dias: number) => `Exercise on ${dias} days of the week`,
    semRegistro: 'nothing logged that week',
    mediaDeAgua: (quanto: string) => `averaged ${quanto} a day`,
    mediaDeProteina: (gramas: number) => `averaged ${gramas} g a day`,
    minutosNaSemana: (minutos: number) => `${minutos} min that week`,
    semMovimento: 'no movement logged',
  },

  /* ⚠️ EACH ITEM HAS TWO TITLES, and the difference is what the block
     does: done, it NAMES what exists ("Weight up to date"); pending, it
     says what to DO ("Weigh yourself first"). */
  preparo: {
    pesoNenhum: 'Log your weight',
    pesoNenhumSub: 'No weigh-ins yet',
    pesoEmDia: 'Weight up to date',
    pesoAntigo: 'Weigh yourself first',
    pesoAntigoSub: (quando: string) => `Last weigh-in ${quando}`,
    pesoSub: (peso: string, quando: string) => `${peso} · ${quando}`,

    notasProntas: 'Questions written down',
    notasProntasSub: (quantas: number) => `${quantas} to bring`,
    notasVazias: 'Write down questions',
    notasVaziasSub: 'Nothing written yet',

    examesRecentes: 'Recent labs',
    examesRecentesSub: (nome: string, quando: string) => `${nome} · ${quando}`,
    exames: 'Labs',
    examesAntigosSub: (quando: string) => `The last one was ${quando}`,
    examesNenhumSub: 'No labs saved',
  },

  /* ⚠️ THE SAME PHRASING ON EVERY PREP ROW, so the eye compares the dates
     instead of translating them. */
  quando: {
    hoje: 'today',
    ontem: 'yesterday',
    haDias: (dias: number) => `${dias} days ago`,
    haUmMes: 'a month ago',
    haMeses: (meses: number) => `${meses} months ago`,
  },

  periodo: {
    pesoEstavel: 'Weight steady',
    pesoDe: (de: string, para: string) => `From ${de} to ${para}`,
    doseNova: (dose: string) => `Dose to ${dose} mg`,
    doseAnterior: (dose: string) => `Was on ${dose} mg`,
    remedioNovo: (remedio: string) => `Switched to ${remedio}`,
    remedioAnterior: (remedio: string) => `Was on ${remedio}`,
    umaAplicacao: '1 dose',
    aplicacoes: (quantas: number) => `${quantas} doses`,
    marcadores: (quantos: number) => `${quantos} markers`,
    umaOrientacao: '1 note from your care team',
    orientacoes: (quantas: number) => `${quantas} notes from your care team`,
    consultaSemTipo: 'Appointment',
  },

  /* ⚠️ "YOU" IS A LABEL AND A SENTINEL AT THE SAME TIME. A workout with no
     stored source is manual — manual is what existed before there were
     sources — and the screen never shows the absence: it shows "You",
     because an absence doesn't answer "who logged this", it answers
     "I don't know".

     Translating breaks no record: the comparison is always against the
     value the app itself just returned, never against something from
     disk. */
  origemManual: 'You',

  selo: {
    passou: 'done',
    agora: 'now',
    amanha: 'tomorrow',
    emDias: (dias: number) => `in ${dias} days`,
  },
};
