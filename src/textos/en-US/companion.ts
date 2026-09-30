/* ============================================================
   THE COMPANION — its memory, and the library it suggests · en-US

   ⚠️ Reasons live in ../pt-BR/companion.ts. Two carry over whole: the
   memory speaks of presence and not of volume, and every library card
   shows WHY it showed up today — content without a visible reason is a
   blog.
   ============================================================ */

export const companion = {
  /* ---------- the memory ---------- */
  memoria: {
    desdeOComeco: 'I’ve known your journey from the start.',
  },

  /* ---------- the contextual library ---------- */
  biblioteca: {

    /* ⚠️ The screen used to show four made-up articles hardcoded in the
       screen file, while the real library sat right above here and
       `libraryPicks` built it from the person's state. Nobody called it.
       See ../pt-BR/companion. */
    tela: {
      titulo: 'Library',
      sub: 'The right reading for where you are — not a list of articles',
      minDeLeitura: (min: number) => `${min} min read`,
      vazioTitulo: 'Nothing to read right now',
      vazioTexto: 'Readings show up when something in your logs calls for one. Without that there’s nothing to read — and that’s good news.',
      vazioSemRegistroTexto: 'Readings show up when something in your logs calls for one. With your first check-ins, they start showing up here.',
    },
    fomeMotivo: (dia: number) => `You’re on day ${dia} of the cycle, when hunger comes back`,
    fomeTitulo: 'Why hunger comes back before your injection',
    /* ⚠️ "TAKES AWAY THE FEELING OF HAVING SLIPPED" is what this reading
       is for: hunger returning on day five is where people conclude they
       failed. The molecule stays lowercase — it is a substance, not a
       brand. */
    fomeDesc: (molecula: string) =>
      `${molecula} levels fall across the week, and fullness falls with them. Understanding the curve takes away the feeling of having slipped.`,

    primeirosMotivo: (dias: number) => `You injected ${dias} ${dias === 1 ? 'day' : 'days'} ago`,
    primeirosTitulo: 'The first days after your dose',
    primeirosDesc: 'What’s expected to feel in the first 48 hours, and what already deserves a message to your care team.',

    enjooMotivo: (dias: number) => `You logged nausea on ${dias} of the last 7 days`,
    /* ⚠️ "WITHOUT FIGHTING THE NAUSEA" carries the whole title: someone
       who is nauseous doesn't need willpower to eat, they need food that
       goes down. */
    enjooTitulo: 'Eating without fighting the nausea',
    enjooDesc: 'Combinations and timing that tend to go down better on the days when food feels like too much.',

    proteinaMotivo: (gramas: number) => `You’re ${gramas} g short of hitting your average goal`,
    proteinaTitulo: 'Protein without cooking more',
    proteinaDesc: 'How to reach the goal with what’s already in your fridge — the problem is rarely the recipe, it’s the convenience.',

    sonoMotivo: (horas: string) => `Your sleep is averaging ${horas} h`,
    sonoTitulo: 'Sleep as part of the treatment',
    sonoDesc: 'Short sleep shifts the next day’s hunger hormones — it already shows up in your own logs.',

    plateauMotivo: (semana: number, perdido: string) => `Week ${semana}, with ${perdido} over the period`,
    plateauTitulo: 'What changes after the third month',
    /* ⚠️ "THAT'S PHYSIOLOGY, NOT FAILURE" is the same defense the plateau
       card makes, and it has to be here too: this is the point in
       treatment where people stop. */
    plateauDesc: 'Loss slows down, and that’s physiology, not failure. What starts to matter more than the scale from here on.',

    consultaMotivo: (dias: number) => `Your appointment is in ${dias} days`,
    consultaTitulo: 'How to get more out of your appointment',
    consultaDesc: 'What to bring, what to ask, and how the automatic summary saves you the first ten minutes.',
  },

  telaInsights: {
    ola: (nome: string) => `Hi, ${nome}`,
    pergunta: 'What do you want to\nunderstand today?',
    escreva: 'Write your question...',

    descobertaDaSemana: 'THE FINDING OF THE WEEK',
    entenderMelhor: 'Understand it better',

    oQueMaisPercebi: 'What else I noticed',
    oQueMaisPercebiNota: 'Other observations I found while going through your journey.',
    verTodas: (quantas: number) => `See all the observations (${quantas})`,

    observamos: 'WHAT WE NOTICED',
    hojeDeCem: 'today, out of 100',

    proximasAcoes: 'Next steps',
    proximasAcoesNota: 'In the order they come up. Everyday suggestions — dose and medication are decided by whoever looks after you.',

    resumos: 'Create summaries',
    resumosNota: 'Your data organized to take to someone.',
    disponivelDepois: 'available after your first entries',

    resumoDaSemana: 'Summary of the week',
    resumoDaSemanaSub: (semana: number, checkins: number, peso: string | null) =>
      `week ${semana} · ${checkins} ${checkins === 1 ? 'check-in' : 'check-ins'}${peso ? `, ${peso}` : ''}`,
    preparoDaConsulta: 'Getting ready for the appointment',
    preparoDaConsultaSub: 'weight, adherence, symptoms and questions',
    preparoSemEquipe: 'ready to share',
    documento: 'Appointment summary',
    documentoSub: 'a document with the whole story',
  },
  telaConversa: {
    ola: (nome: string) => `Hi, ${nome}`,
    limite: 'I know your whole journey · I don’t replace your care team',
    ouvindo: 'I’m listening…',
    escrevaOuFale: 'Type or speak',
    pergunte: 'Ask about your journey',
    novaConversa: 'New conversation',
    menu: 'Conversations and new conversation',
    fechar: 'Close',
    irEvolucao: 'See your weigh-ins',
    irSintomas: 'See your symptoms',
    irAplicacoes: 'See your doses',
    irAlimentacao: 'See your meals',
    irAgua: 'See today’s water',
    irExames: 'See your lab results',
    irResumo: 'Open the summary for your appointment',
    irCheckin: 'Do today’s check-in',
    copiar: 'Copy',
    copiado: 'Copied',
    historico: 'Previous conversations',
    historicoTitulo: 'Conversations',
    grupoHoje: 'Today',
    grupoSemana: 'Last 7 days',
    grupoAntes: 'Earlier',
    mensagens: (n: number): string => (n === 1 ? '1 message' : `${n} messages`),
    apagar: 'Delete',
    apagarPergunta: 'Delete this conversation from your phone?',
    cancelar: 'Cancel',
    historicoVazio: 'Your conversations with Morphi Intelligence are kept here, on your phone.',
    aceiteTitulo: 'Before we start',
    aceitePergunta: 'Allow Morphi Intelligence to look at your health data to help you?',
    termosTitulo: 'Terms of use',
    termosResumo: 'What it looks at, where it goes and the limits',
    aceite1Titulo: 'What it looks at',
    aceite1: 'Medication, weight, symptoms, meals, water, exercise and lab results. Your full name, your email and the name of your care provider stay out.',
    aceite2Titulo: 'Where it goes',
    aceite2: 'Each question goes to our server and to Anthropic, the company that provides the technology, in the United States, only to create the answer. Nothing is kept by them; the conversation stays on your phone.',
    aceite3Titulo: 'The limits',
    aceite3: 'Morphi Intelligence can be wrong and doesn’t replace your care team. Dose and medication are always with your care team.',
    politica: 'Read the Privacy Policy',
    aceitar: 'Allow and start talking',
    recusar: 'Not now',
    aceiteRodape: 'Without permission, Morphi Intelligence stays off. You can allow it whenever you like.',
    semServidor: 'The conversation isn’t turned on for this device yet.',
    semRede: 'I couldn’t answer just now — the connection failed. Try again in a moment.',
    semConta: 'To talk with me, sign in to your account.',
    limiteDoDia: 'You’ve reached today’s question limit. I’ll be back to answer tomorrow.',
  },
};
