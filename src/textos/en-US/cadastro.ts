/* ============================================================
   ONBOARDING — nineteen questions, the app's largest screen · en-US

   ⚠️ Reasons live in ../pt-BR/cadastro.ts. Two that constrain this file:

   THE QUESTIONS CONJUGATE. Someone who hasn't started has nothing in the
   present tense to answer, so medication, form, dose, frequency and
   follow-up come in pairs — `Agora` and `Futuro`. English distinguishes
   them too, so both stay.

   EVERY SUBTITLE SAYS WHY WE ASK, and the identity one says the TRUE
   reason, not the flattering one: gender identity enters no calculation
   here. Promising a benefit that doesn't exist is how you lose the
   trust of someone who stopped to read.
   ============================================================ */

export const cadastro = {
  aberturaTitulo: 'Your companion on a journey of ',
  aberturaTituloForte: 'transformation',
  aberturaTexto: 'More than tracking results, it’s understanding the journey behind them. An intelligent experience that learns with you and adapts at every stage.',
  comecar: 'Get started',

  verPlanos: 'View plans',

  titulos: {
    nome: 'What should we call you?',
    identidade: 'How do you identify?',
    nascimento: 'When were you born?',
    tratamento: 'Have you started treatment?',
    inicio: 'When did you start?',
    medicamentoFuturo: 'Which medication do you plan to use?',
    medicamentoAgora: 'Which medication do you use?',
    formaFuturo: 'How will you take it?',
    formaAgora: 'How do you take it?',
    doseFuturo: 'Which dose do you plan to start with?',
    doseAgora: 'What’s your current dose?',
    frequenciaFuturo: 'How often will you take it?',
    frequenciaAgora: 'How often do you take it?',
    corpo: 'What are your current measurements?',
    meta: 'What’s your weight goal?',
    ritmo: 'What pace do you want to get there?',
    motivacao: 'What’s bringing you to this journey?',
    atividade: 'What’s your activity level?',
    restricao: 'Do you have any dietary restrictions?',
    saude: 'Connect your health app',
    acompanhamentoFuturo: 'Do you plan to have a clinician following your care?',
    acompanhamentoAgora: 'Do you have a clinician following your care?',
    consentimento: 'Important information',
  },

  subs: {
    nome: 'Just a first name is fine, or whatever nickname you like.',
    identidade: 'It’s so we speak to you the right way. What goes into the health math is your body, and that comes in the next questions.',
    nascimento: 'Every stage of life has different needs — and age enters the reference ranges for your labs.',
    tratamento: 'Just so we know where you are right now.',
    inicio: 'Approximate is fine. This is where your treatment week comes from, and this weight becomes the start of your curve.',
    medicamento: 'It’s what the dose ladder and the interval between shots come from.',
    forma: 'Compounded comes out of the pharmacy both ways, and what changes is what you hold when it’s time to take it.',
    doseComEscada: (med: string) => `In ${med}’s titration order.`,
    doseSemEscada: 'Compounded has no label ladder — the number is the one on your prescription.',
    frequencia: (doDaForma: string) => `This is where the cycle count, the reminders and the supply ${doDaForma} come from.`,
    corpo: 'Height and weight are how we calculate your BMI and build your daily protein and water goals.',
    meta: 'It’s the reference we use to show how far you’ve come. You can change it whenever you want.',
    ritmo: (aPercorrer: string) => `${aPercorrer} to go.`,
    motivacao: 'There’s no right answer. The one that counts is what you’d remember on a hard day.',
    restricao: 'Protein is the axis of this treatment, and it comes from different places depending on what you eat. You can pick more than one.',
    atividade: 'It goes into your daily water goal — moving more means losing more fluid — and says where you’re starting from.',
    saude: 'Your health data helps make sense of your progress — without you having to log everything.',
    acompanhamento: 'This answer enables features tied to medical follow-up, like notes and planning for appointments.',
    consentimento: 'Two things before we start: what we do for your treatment, and what happens to what you log.',
  },

  seuNome: 'Your name',

  feminino: 'Female',
  masculino: 'Male',
  outro: 'Other',
  prefiroNaoInformar: 'Prefer not to say',

  jaIniciei: 'I’ve started treatment',
  jaInicieiSub: 'I’ve taken at least one dose',
  vouComecar: 'I’m starting soon',
  vouComecarSub: 'I haven’t taken a dose yet',

  aindaNaoSei: 'I don’t know yet',
  aindaNaoSeiMedSub: 'You can set this later in your profile',
  aindaNaoSeiDoseSub: 'Almost everyone starts at the lowest',

  menosComumAqui: 'LESS COMMON HERE',
  manipuladoSub: 'Prepared at a compounding pharmacy',
  formaSeringaSub: 'You draw the dose with a syringe',
  formaCanetaSub: 'Comes prefilled, ready to inject',

  doseDeInicio: 'Starting dose',
  doseMaxima: 'Maximum dose',

  todosOsDias: 'Every day',
  aCadaDias: (d: number) => `Every ${d} days`,
  padrao: 'Standard',
  outroIntervaloTitulo: 'Another interval',
  outroIntervalo: 'You say how many days apart',

  pesoDeHoje: 'WEIGHT TODAY',
  pesoDeQuandoComecou: 'WEIGHT WHEN YOU STARTED',
  querPerder: 'You want to lose',
  querGanhar: 'You want to gain',

  ritmoDevagar: 'Slow and steady',
  ritmoConstante: 'Steady pace',
  ritmoAcelerado: 'Faster',
  ritmoMaisRapido: 'As fast as it goes',
  ritmoPorSemana: (peso: string) => `${peso} a week`,
  ritmoAlcanca: (metaProsa: string, mes: string) => `Reaches ${metaProsa} in ${mes}`,

  semRestricao: 'None',
  semRestricaoSub: 'I eat a bit of everything',

  saudeManchete: 'Everything your body shows, <b>in one place</b>',
  saudeLembrarTitulo: 'One less thing to remember',
  saudeLembrarTexto: 'Weight, sleep and workouts come in on their own.',
  saudeCurvaTitulo: 'Your curve, more complete',
  saudeCurvaTexto: 'What your device measures lands here.',
  saudeControleTitulo: 'You stay in control',
  saudeControleTexto: 'Choose what to share, and turn it off whenever you want.',
  saudeConectar: 'Connect my data',
  /* ⚠️ "DO THIS LATER", not "not now". The refusal that closes the door
     is easier to give than the one that postpones — and this one really
     does postpone. */
  saudeDepois: 'Do this later',

  sim: 'Yes',
  digiteONome: 'Enter the name',
  nadaEnviado: 'It’s there to refer to the clinician along your journey. Nothing is sent to them.',
  vouMeTratar: 'I’ll be treated by a clinician or clinic',
  meAcompanha: 'A clinician or clinic follows my treatment',
  porContaPropria: 'No, on my own',
  porContaPropriaSub: 'You can add one later, whenever you want',
  quemVaiAcompanhar: 'WHO WILL FOLLOW YOUR CARE (OPTIONAL)',
  quemAcompanha: 'WHO FOLLOWS YOUR CARE (OPTIONAL)',

  /* ⚠️ THE LABEL SAYS WHAT THE TAP MEANS. "Continue" would be consenting
     without knowing you consented. */
  concordarEMontar: 'Agree and build my plan',
  ficaRegistrado: 'Recorded with today’s date.',
  salvar: 'Save',
  continuar: 'Continue',

  montandoTitulo: 'Building your plan',
  faseLendo: 'Reading your answers',
  faseCalculando: 'Calculating your daily goals',
  faseDesenhando: 'Drawing your journey',

  telaPlano: {
    planoPronto: 'your personalized plan is ready!',
    manterOPeso: 'keep your weight',
    objetivo: (perder: number, alvo: string, marca: string): [string, string, string] => [
      `To ${perder > 0.05 ? 'lose ' : perder < -0.05 ? 'gain ' : ''}`,
      alvo,
      `${marca}.`,
    ],
    marcaRegistrada: (medicamento: string) => ` with ${medicamento}®`,
    marcaGenerica: (medicamento: string) => ` with ${medicamento}`,
    elaboradoPensando: 'Your plan was put together with',
    nasSuasRespostas: 'Your answers',
    emEstudos: 'GLP-1 research',

    secaoMetas: 'YOUR GOALS FOR THE DAY',
    secaoDose: 'YOUR DOSE',
    secaoAteAMeta: 'UP TO YOUR GOAL',
    secaoCorpo: 'YOUR BODY',
    secaoAjuda: 'HOW I HELP YOU',
    secaoCiencia: 'THE SCIENCE BEHIND YOUR PLAN',

    proteinaPorDia: 'PROTEIN PER DAY',
    proteinaTexto: 'It is the first goal of the day. The medication takes the hunger away, and part of the weight that comes off is muscle — protein is what holds on to lean mass while the fat goes.',
    calorias: 'Calories',
    agua: 'Water',

    aindaADefinir: 'Still to be decided',
    aindaADefinirTexto: 'Once you know the medication, I will build the dose ladder and the cycle.',
    cicloComeca: 'The cycle starts at the first shot you log.',
    cadenciaDiaria: 'every day',
    cadenciaSemanal: 'once a week',
    cadenciaDias: (dias: number) => `every ${dias} days`,

    pesoAPerder: 'Weight to lose',
    pesoAGanhar: 'Weight to gain',
    emSemanas: (semanas: number) => `in ${semanas} weeks`,
    ressalvaDaCurva: (ritmo: string) =>
      `The drop is not a straight line: in the trials the first weeks give more, and the pace eases as the body adjusts. The ${ritmo} a week you chose are the average of the road, not a forecast.`,

    imcDeHoje: 'BMI today',
    naSuaMeta: 'At your goal',

    ajudaDose: 'Every dose in the right place',
    ajudaDoseSub: 'rotating the sites and the dose cycle, without you counting',
    ajudaEnjoo: 'Nausea in numbers',
    ajudaEnjooSub: 'what you feel becomes a pattern, and the pattern goes to the appointment',
    ajudaPeso: 'Your weight curve',
    ajudaPesoSub: 'every weigh-in joins the line, with a reading of what changed',
    ajudaResumo: 'A summary for the appointment',
    ajudaResumoSub: 'doses, symptoms and weight organized on a single page',

    feitoEmCimaDeEvidencia: 'Built on evidence',
    evidenciaTexto: 'The goals, the curve and the priorities in this plan follow public health guidelines and peer-reviewed clinical trials.',
    rodape: 'We follow your journey every day and organize what you log — but the one who runs the treatment is your care team. These numbers are a starting point for that conversation, not a prescription.',

    voltar: 'Back',
  },

  telaDados: {
    titulo: 'Your details',
    lead: 'These are the answers from your sign-up, and they are where your BMI, your daily goals and the plan forecast come from. Changing anything here redoes those numbers.',

    tratamento: 'Treatment',
    medicamento: 'Medication',
    dose: 'Dose',
    doseSub: (valor: string, unidade: string) => `${valor} ${unidade}`,
    frequencia: 'Frequency',

    corpoERitmo: 'Body and pace',
    altura: 'Height',
    pesoInicial: 'Starting weight',
    metaDePeso: 'Weight goal',
    ritmoEscolhido: 'Pace you chose',
    porSemana: (peso: string) => `${peso} a week`,
    semPesoAPerder: 'No weight to lose',

    nome: 'Name',
    sexo: 'Sex',
    nascimento: 'Date of birth',
    nascimentoSub: (data: string, idade: number) => `${data} · ${idade} years old`,
    atividadeFisica: 'Physical activity',
    restricoesAlimentares: 'Food restrictions',
    oQueTeTrouxe: 'What brought you here',

    rodape: 'To log a new weigh-in, use the log button.',
  },
};
