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
    `That’s when ${molecula} levels reach the lowest point of the cycle, just before your next dose. It passes on its own once you take it.`,
  fomeCta: 'View cycle',

  aguaTitulo: 'Tomorrow tends to be your driest day',
  aguaTexto: (dele: string, dia: string, outros: string) =>
    `In your logs hydration drops to ${dele} ${dia}, against ${outros} on the other days. Knowing it the night before is half the battle.`,
  aguaCta: 'View hydration',

  enjooTitulo: 'If nausea shows up now, it has an end in sight',
  enjooTexto: (perto: string, longe: string) =>
    `In your logs it sits at ${perto} for the two days after a dose and drops to ${longe} from the third on. It’s the first 48 hours of each cycle, not the whole treatment.`,
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
    slideProntoTexto: 'How it went, one finding and one thing to try this week.',
    slideProntoCta: 'See the summary',
    slideConviteTitulo: 'Want a summary of your week?',
    slideConviteTexto: 'Every Monday I read your logs and tell you what I found.',
    titulo: 'Your week',
    pedirSim: 'Yes, please',
    poucoTitulo: 'On Monday, I’ll read your week',
    poucoTexto: 'Check in on at least 3 days, or weigh in once, and I’ll have something to read.',
    /* a semana teve o mínimo, mas nenhuma descoberta se sustentou (app/leitura) */
    semDescobertaTitulo: 'No finding this time',
    semDescobertaTexto: 'Your logs this week didn’t show a pattern I can stand behind. I’ll read again next Monday.',
    lendo: 'Reading your week…',
    parteSemana: 'The week',
    parteDescoberta: 'A finding',
    parteTeste: 'To try',
    parteTesteAgora: 'To try this week',
    lerInteira: 'Read it all',
    conversar: 'Talk about it',
    telaTitulo: 'Weekly summary',
    desligar: 'Turn off the weekly summary',
    desligada: 'Turned off. I’ll ask again in 4 weeks.',
    /* a tela do resumo (app/leitura), refeita em 01/10/2026 */
    legendaCheckin: 'check-in',
    legendaTreino: 'workout',
    legendaPesagem: 'weigh-in',
    nivelForte: 'Strong pattern',
    nivelComeco: 'Early pattern',
    nivelRetrato: 'From your journey',
    anteriores: 'Previous weeks',
    /* no ciclo da Jornada, a leitura de outra janela, com as datas dela (app/leitura) */
    leituraDe: (periodo: string): string => `Reading for ${periodo}`,
    /* as outras leituras que caem no mesmo ciclo da Jornada (app/leitura) */
    outrasLeituras: 'Other readings for this week',
    erro: 'I couldn’t read your week right now. Check your connection and try again.',
    erroLimite: 'You’ve reached today’s limit of AI readings. I’ll read your week tomorrow.',
    erroConta: 'Sign in to your account so I can read your week.',
    tentarDeNovo: 'Try again',
    fazerCheckin: 'Check in',
    desligadoTitulo: 'The weekly summary is off',
    desligadoTexto: 'Turn it on and every Monday I’ll read your logs and tell you what I found.',
    ligar: 'Turn on the weekly summary',
  },
};
