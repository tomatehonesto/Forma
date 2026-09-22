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
  verDescoberta: 'View finding',

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
};
