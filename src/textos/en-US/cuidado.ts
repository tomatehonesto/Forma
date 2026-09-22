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
    metricaAplicacoes: 'shots\nlogged',

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
    aplicacaoHoje: 'Shot today',
    proximaAplicacao: (quando: string) => `Next shot ${quando}`,
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

  tela: {
    paraAConsulta: (quando: string) => `FOR THE APPOINTMENT ${quando}`,
    resumoPronto: 'Your summary is ready',
    vouPreparar: 'I will put your summary together',

    linhaDoPlano: (previstas: number, temHorizonte: boolean): [string, string, string] => [
      'Week ',
      temHorizonte ? ` of ${previstas} up to your goal · ` : ' of your treatment · ',
      ' with the shot done',
    ],

    ultimaOrientacao: 'LATEST GUIDANCE',
    voceEscreveu: 'YOU WROTE',
    naoLida: 'unread',
    responder: 'Reply',
    enviarPrimeira: 'Send the first message',

    precisaDeVoce: 'Needs you',
    nadaPrecisa: 'Nothing needs you right now.',
    emDia: 'Your follow-up is up to date.',

    proximaConsulta: 'Your next appointment',
    consultasLink: 'Appointments',
    anotarConsulta: 'Add appointment',
    anotarConsultaSub: 'With the date here, the summary is ready and we tell you when it gets close.',
    eQuando: (quando: string) => `It is ${quando}`,
    preparoTexto: 'I put together a summary with weight, consistency and symptoms for that stretch — you pick what to ask.',
    prepararAConsulta: 'Get ready for the appointment',

    seuTratamento: 'Your treatment',
    aplicacoesLink: 'Shots',
    dosesEm: (onde: string) => `Doses ${onde}`,
    restamDe: (restam: number, total: number, semanas: number) =>
      `${restam} of ${total} · about ${semanas} ${semanas === 1 ? 'week' : 'weeks'}`,
    pedirRenovacao: 'Ask for a refill',

    exames: 'Lab results',
    marcadoresAcompanhados: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'marker followed' : 'markers followed'}`,
    nenhumResultado: 'No results saved',
    importeUmExame: 'Import a lab result to start following it',
    foraDaReferencia: (quantos: number) => `${quantos} outside the reference range`,
    todosNaReferencia: 'All within range',

    quemAcompanha: 'Who follows your treatment',
    ninguemRegistrado: 'Nobody noted down yet',
    seVoceSeTrata: 'If someone treats you, add them here — your summary will be ready for the appointment.',

    acompanhamentoProfissional: 'Professional follow-up',
    conhecaParceiros: 'Meet the partner doctors',
    parceirosTexto: 'Some clinics follow the treatment in here with you — messages between appointments, your summary reaching the team and the calendar already filled in.',
    passouATer: 'Started seeing someone?',
    anoteQuemE: 'Add who it is.',
  },

  telaAcompanhamento: {
    leadComVinculo: 'These details come from the clinic that follows your treatment.',
    ondeAtendida: 'Where the appointments happen',
    quemCorrige: 'The clinic is who corrects it',
    quemCorrigeTexto: 'If anything is wrong, talk to the team — they are the ones who keep this record, and whatever gets fixed there arrives here.',

    lead: 'If someone treats you, note them here. It is what makes the summary come out ready for the appointment and the question prep show up at the right time.',

    nome: 'Name',
    nomeAjuda: 'What you call this person. It can be the name of the practice, if you prefer.',
    nomePlaceholder: 'Type the name',
    especialidade: 'Specialty',
    opcional: 'Optional.',
    especialidadePlaceholder: 'Endocrinology',
    ondeAtende: 'Where they practice',
    ondeAtendeAjuda: 'Optional — clinic, hospital or practice.',
    ondeAtendePlaceholder: 'Type the clinic or practice',

    nadaEnviado: 'None of this is sent to anyone',
    nadaEnviadoTexto: 'The name stays in the app, with you. For your team to receive your data, you’ll need an invitation code from the clinic — and from then on the clinic is the one keeping this record.',
    salvar: 'Save',

    naoTenhoMais: 'I no longer have anyone following me',
    tirarPergunta: 'Remove who follows you?',
    tirarTexto: 'All of your entries stay right here — weight, shots, symptoms, lab results and notes. All that leaves is the name.',
    simTirar: 'Yes, remove',
    cancelar: 'Cancel',
  },

  telaAnotarConsulta: {
    titulo: 'Add appointment',

    quemMarca: 'The clinic books it',
    quemMarcaLead: 'Your calendar comes from the team that follows your treatment.',
    datasChegam: 'The dates come from the clinic',
    datasChegamTexto: 'To move or cancel it, talk to the team — whatever changes there shows up here.',

    proximaConsulta: 'Your next appointment',
    anoteSuaConsulta: 'Add your appointment',
    lead: 'With the date here, we tell you when it gets close and leave the summary ready for you to take.',

    quando: 'When',
    comoVaiSer: 'How it will be',
    tipos: {
      presencial: 'In person',
      teleconsulta: 'Video call',
      retorno: 'Follow-up',
    },
    comQuem: (quem: string) => `With ${quem}.`,

    dataFicaComVoce: 'The date stays with you',
    dataFicaComVoceTexto: 'Adding it here doesn’t tell the practice, and it doesn’t go into your phone calendar. We’re the ones who find out the appointment is near.',

    salvar: 'Save',
    anotar: 'Add appointment',
    naoTenho: 'I have no appointment booked',
  },
  telaConsultas: {
    titulo: 'Appointments',
    leadComData: 'The next one, what to take to it, and the ones already behind you.',
    leadSemData: 'What to take to the next one, and the ones already behind you.',

    jaPassou: 'ALREADY PASSED',
    proxima: 'NEXT',
    dataDaConsulta: (diaDaSemana: string, data: string, quem: string) =>
      `${diaDaSemana}, ${data}${quem ? ` · ${quem}` : ''}`,
    jaAconteceu: 'It already happened',
    verResumo: 'View summary to bring',
    mudarData: 'Change the date',

    nenhumaAnotada: 'No appointment noted',
    clinicaMarca: 'When your team books the next one, it shows up here.',
    semDataTexto: 'With the date here, we tell you when it gets close and leave the summary ready to take.',
    anotarConsulta: 'Add appointment',

    paraLevar: 'To take with you',
    paraLevarSub: (faltando: number): string =>
      faltando === 0
        ? 'Everything is up to date — the summary builds itself from this.'
        : faltando === 1
          ? 'One thing is missing for the summary to be complete.'
          : `${faltando} things are missing for the summary to be complete.`,

    anteriores: 'Past appointments',
    linhaAnterior: (tipo: string, data: string) => `${tipo} · ${data}`,

    consultaGenerica: 'Appointment',
  },
  telaConsulta: {
    titulo: 'Appointment',
    naoEstaMais: 'This appointment is no longer in your history.',

    desdeEntao: 'Since then',
    desdeEntaoSub: 'What your records show from that day until now.',
    ateASeguinte: 'Until the next appointment',
    ateASeguinteSub: (data: string) =>
      `What your records show between that day and ${data}.`,

    semRegistro: 'None of your records fell in this window. What was agreed at the appointment is in the note above, if there is one.',
  },

  telaAreaMedica: {
    titulo: 'Medical area',
    lead: 'Who looks after you, and what crosses over to the other side.',

    atalhoMensagem: 'Message',
    atalhoClinica: 'Clinic',

    paraLevar: 'TO TAKE TO THE APPOINTMENT',
    paraLevarTexto: 'Weight, adherence, symptoms, lab results and your notes, in a single document. It builds itself from your records and it’s ready now.',
    verResumo: 'View appointment summary',

    suasAnotacoes: 'Your notes',
    anotar: 'Add',
    anotarDuvida: 'Add a question',
    anotarDuvidaSub: 'To ask at the next appointment',

    prescricoes: 'Prescriptions',
    pedirReceita: 'Ask for a new prescription',
    clinicaPreparou: 'What the clinic prepared',

    numerosDaEquipe: 'Your team’s numbers',
    naoAnotada: 'not noted',
    anotadoPor: (por: string, data: string) => `${por} · noted on ${data}`,
    anoteONumero: 'Add the number set at your appointment',

    duasMetas: (minha: string) =>
      `Your weight goal, in the app, is ${minha}. The two live side by side — yours keeps measuring the Journey —, and the difference between them is a good question for the next appointment.`,

    documentos: 'Documents and lab results',
    documentoSub: (tipo: string, data: string) => `${tipo} · ${data}`,
  },
};
