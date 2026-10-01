/* ============================================================
   DISCOVERIES — the Home card that isn't the cycle · en-US

   ⚠️ Reasons live in ../pt-BR/descobertas.ts. Two survive translation:

   THE HEADS-UP ALWAYS SAYS IT PASSES. "Hunger tends to bite today" is a
   warning, and a warning without an end becomes a threat: all three close
   by saying what happens next.

   AND THE INVITATION DOESN'T NAG. "You haven't said where you want to get
   to" is an absence stated as a possibility, not as a failing.
   ============================================================ */

export const descobertas = {
  verDescoberta: 'See the finding',

  /* ---------- what's coming ---------- */
  chapeuCruzamento: 'A FINDING',
  chapeuAntecipacao: 'WHAT’S COMING',

  fomeHoje: 'Hunger tends to bite today',
  fomeAmanha: 'Hunger tends to bite tomorrow',
  fomeEmDias: (dias: number) => `Hunger tends to bite in ${dias} days`,
  fomeTexto: (molecula: string) =>
    `That’s when ${molecula} levels reach the lowest point of the cycle, just before your next shot. It passes on its own once you take it.`,
  fomeCta: 'View cycle',

  aguaTitulo: 'Tomorrow tends to be your driest day',
  aguaTexto: (dele: string, dia: string, outros: string) =>
    `In your logs hydration drops to ${dele} ${dia}, against ${outros} on the other days. Knowing it the night before is half the battle.`,
  aguaCta: 'View hydration',

  enjooTitulo: 'If nausea shows up now, it has an end in sight',
  enjooTexto: (perto: string, longe: string) =>
    `In your logs it sits at ${perto} for the two days after a shot and drops to ${longe} from the third on. It’s the first 48 hours of each cycle, not the whole treatment.`,
  enjooCta: 'View symptoms',

  /* ---------- the invitations ---------- */
  chapeuConvite: 'AN INVITATION',

  metaTitulo: 'You haven’t set a goal yet',
  metaTexto: 'A goal of your own — fitting into a pair of jeans, getting back to the beach, dropping a habit. We’ll keep it here, and you’re the one who decides when you’ve hit it.',
  metaCta: 'Create a goal',

  medidasTitulo: 'The scale tells only part of it',
  medidasTexto: 'The tape measure tells the rest: waist and hips keep moving when the weight stalls, and that’s when it shows something is still moving.',
  medidasCta: 'Log measurements',

  refeicaoTitulo: 'The day’s protein can count itself',
  refeicaoTexto: 'Log what you eat and the day’s math is done for you — no tables, nothing to add up in your head.',
  refeicaoCta: 'Log a meal',

  examesTitulo: 'Your lab results belong here',
  examesTexto: 'Once they’re saved, you can follow each marker across the treatment — and bring it all laid out to your appointment.',
  examesCta: 'Save a lab panel',

  clinicaTitulo: 'Your clinic can be on this side',
  clinicaTexto: 'With the code they gave you, your care team shows up here and their guidance stops getting lost in your messages.',
  clinicaCta: 'Use the code',
  /* the weekly reading — see ../pt-BR/descobertas.ts */
  semana: {
    chapeu: 'YOUR WEEK',
    /* os slides do carrossel da Home (app/(tabs)/index): curtos de propósito */
    slideProntoTitulo: 'Your weekly summary is ready',
    slideProntoTexto: 'How it went, one finding and one thing to try next week.',
    slideProntoCta: 'See the summary',
    slideConviteTitulo: 'Want a summary of your week?',
    slideConviteTexto: 'Every Monday I read your logs and tell you what I found.',
    titulo: 'Your week',
    pedirTitulo: 'Want me to read your week?',
    pedirTexto: 'Every Monday I look at what you logged last week and tell you how it went, one finding about you, and one thing to try next week.',
    pedirSim: 'Yes, please',
    pedirNao: 'Not now',
    poucoTitulo: 'On Monday, I’ll read your week',
    poucoTexto: 'Check in on at least 3 days, or weigh in once, and I’ll have something to read.',
    lendo: 'Reading your week…',
    parteSemana: 'The week',
    parteDescoberta: 'A finding',
    parteTeste: 'To try',
    lerInteira: 'Read it all',
    conversar: 'Talk about it',
    telaTitulo: 'Your weekly reading',
    desligar: 'Turn off the weekly reading',
    desligada: 'Turned off. I’ll ask again in 4 weeks.',
    aceiteTitulo: 'Your weekly reading',
    aceitePergunta: 'Want me to read your week every Monday?',
    termosTitulo: 'What this means',
    termosResumo: 'What leaves your phone, what’s kept, and what it is',
    aceite1Titulo: 'What leaves your phone',
    aceite1: 'Every Monday, a summary of your week — weight, injection, check-ins, symptoms, water, protein and workouts — and a finding calculated on your phone go to our server, which asks Anthropic’s AI, in the United States, for the reading. Without your full name, your email or your notes.',
    aceite2Titulo: 'What’s kept',
    aceite2: 'The reading comes back to your phone and stays only there, like the chat. The server keeps nothing, and Anthropic doesn’t use the data to train models.',
    aceite3Titulo: 'What it is',
    aceite3: 'A reading of your logs: it points out coincidences, not causes, and it doesn’t replace your care team. Nothing in it changes a dose.',
    politica: 'Read the Privacy Policy',
    aceitar: 'Turn on the weekly reading',
    recusar: 'Not now',
    aceiteRodape: 'You can turn it off anytime, from the reading itself.',
  },
};
