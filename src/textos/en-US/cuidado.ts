/* ============================================================
   CARE — the people area · en-US

   ⚠️ Reasons live in ../pt-BR/cuidado.ts, and the rule for this file is
   harder than for the others:

   NO SENTENCE HERE MAY ASSERT WHAT THE CARE TEAM DID WITHOUT KNOWING.
   "Your care team updated your treatment" is only true when there is a
   platform — it is the platform that brings the new guidance. Without a
   server the app knows the appointment happened, because the person said
   so, and nothing else. That is why almost every pair here has a
   with-platform and a without-platform version, and they are not
   variations in tone: the difference between them is a claim of fact.

   AND THE HEADLINE GIVES NO GRADE. "Low adherence" showed up for someone
   who missed two doses, and who almost always missed them because they
   felt sick.
   ============================================================ */

export const cuidado = {
  /* ---------- what is waiting for the person ----------

     ⚠️ EACH ITEM HAS THREE TEXTS, and the third is not a summary:

       · `texto`   what to do — the row title
       · `sub`     why now
       · `rotulo`  what the HEADLINE calls this item in a list

     "Schedule a blood panel" is what you do; in the sentence the subject
     is "labs". Translating the two the same undoes the headline. */
  pendencias: {
    mensagemUma: 'Reply to your care team’s message',
    mensagemVarias: (quantas: number) => `Reply to your care team’s ${quantas} messages`,
    mensagemSub: 'waiting on your reply',
    mensagemRotulo: 'messages',

    receita: 'Ask for a prescription refill',
    receitaSub: (doses: number, semanas: number) =>
      `${doses} ${doses === 1 ? 'dose left' : 'doses left'} · about ${semanas} ${semanas === 1 ? 'week' : 'weeks'}`,
    receitaRotulo: 'prescription',

    exameSubDaEquipe: 'requested by your care team',
    exameSubDoProtocolo: 'from this week’s protocol',
    exameRotulo: 'labs',

    consulta: 'Get ready for your appointment',
    consultaSub: (tipo: string, quando: string, doutor: string) =>
      `${tipo} ${quando} · with ${doutor}`,
    consultaRotulo: 'appointment',
  },

  /* ---------- the follow-up headline ---------- */
  estado: {
    kicker: 'YOUR FOLLOW-UP',

    /* The line break is deliberate: value on top, unit below, for reading
       at a glance. */
    metricaSemanas: 'weeks\nof follow-up',
    metricaAplicacoes: 'injections\nlogged',

    /* ⚠️ "DOSES" AND NOT "INJECTIONS": this pill shares a row with the
       pulse, and the longer word pushes the pulse onto two lines. */
    adesao: (feitas: number, previstas: number) =>
      `${feitas} of ${previstas} ${previstas === 1 ? 'dose' : 'doses'}`,

    /* ---------- the appointment coming up ---------- */
    consultaTitulo: 'Your appointment is coming up.',
    consultaHoje: (doutor: string) =>
      `Your appointment with ${doutor} is today. Worth going over what you want to ask.`,
    consultaFaltam: (dias: number, doutor: string) =>
      `${dias === 1 ? '1 day' : `${dias} days`} until your appointment with ${doutor}.`,
    consultaPulso: (quando: string) => `Appointment ${quando}`,

    /* ---------- right after the appointment ---------- */
    posConsultaTituloComPlataforma: 'Your care team updated your treatment.',
    posConsultaTituloSemPlataforma: 'You had an appointment recently.',
    posConsultaTextoComPlataforma: 'Check the guidance from the appointment and what changes in your dose from here.',
    posConsultaTextoSemPlataforma: 'If the dose or the interval changed, it’s worth updating here — that’s what keeps the app’s math right.',
    posConsultaPulso: 'Treatment updated',

    /* ---------- the open items ---------- */
    /* ⚠️ "WE'VE GOT A FEW THINGS TO TAKE CARE OF" — first person plural,
       not "you have open items". The list below is things that depend on
       them, and opening with a finger pointed on a health card is the
       wrong start. */
    pendenciaTitulo: 'We’ve got a few things to take care of.',
    pendenciaTexto: (quantas: string, plural: boolean, assuntos: string) =>
      `${quantas} ${plural ? 'items need' : 'item needs'} you — ${assuntos}. Nothing urgent, but worth clearing this week.`,
    pendenciaPulso: (quantas: number) =>
      `${quantas} open ${quantas === 1 ? 'item' : 'items'}`,
    porExtenso: ['no', 'one', 'two', 'three', 'four'],

    /* ---------- the rest of the time ---------- */
    emDiaTitulo: 'Your care is up to date.',
    /* ⚠️ THE SECOND VERSION EXISTS BECAUSE THE SENTENCE USED TO OPEN WITH
       THE DOCTOR'S NAME. With nobody on file it opened with a blank
       space. Someone running their treatment alone has been running it
       just as long. */
    emDiaComQuem: (quem: string, semanas: number) =>
      `${quem} has been following your treatment for ${semanas} weeks. You’re keeping up well and there’s nothing important pending right now.`,
    emDiaSozinha: (semanas: number) =>
      `You’re ${semanas} weeks into treatment, keeping up well, with nothing important pending right now.`,
    emDiaPulso: 'Follow-up on track',
  },

  /* ---------- the dose context ---------- */
  dose: {
    aplicacaoHoje: 'Injection today',
    proximaAplicacao: (quando: string) => `Next injection ${quando}`,
    nestaDoseHa: (semanas: number) =>
      `On this dose for ${semanas} ${semanas === 1 ? 'week' : 'weeks'}`,
    /* `quando` already arrives as "in 9 days" / "tomorrow", preposition
       included — that is why this sentence doesn't add another. */
    revisaoNaConsulta: (quando: string) => `Review at the appointment ${quando}`,
    revisaoHoje: 'today',
  },

  equipe: {
    /* The role for someone with no specialty on file. Not "Doctor": they
       might not be, and the app doesn't know. What it knows is the job. */
    responsavelPadrao: 'Responsible for your treatment',
  },

  /* ⚠️ EACH ROW ONLY EXISTS WITH ITS DATA. "Phone —" in a contact list is
     the screen promising a channel that isn't there. The order runs from
     the fastest channel to the most formal. */
  contato: {
    whatsapp: 'WhatsApp',
    whatsappSub: 'Message the clinic',
    telefone: 'Phone',
    site: 'Website',
    email: 'Email',
    instagram: 'Instagram',
  },
};
