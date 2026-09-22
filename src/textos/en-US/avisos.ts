/* ============================================================
   NOTIFICATIONS — the two lines on the lock screen · en-US

   ⚠️ Reasons live in ../pt-BR/avisos.ts. The rule: whoever reads this is
   out in the world, in the middle of something else. None of them nags,
   none says "you didn't", and none asserts what the app can't know at
   that hour. The notification offers; the person knows their day.
   ============================================================ */

export const avisos = {
  doseHoje: 'Your shot is today',
  doseHojeCorpo: (dose: string) => `${dose}. Log it here whenever you can.`,
  doseAmanha: 'Your shot is tomorrow',
  doseAmanhaCorpo: (dose: string, oRecipiente: string) => `${dose}. Worth leaving ${oRecipiente} where you can see it.`,
  doseEmDias: (dias: number) => `Your shot is in ${dias} days`,
  doseEmDiasCorpo: (dose: string, doRecipiente: string) => `${dose}. There’s time to check ${doRecipiente} supply.`,

  /* ⚠️ THIS ONE ASKS instead of telling. It's the only one of the five,
     and it's that way because the check-in is a question. */
  checkin: 'How are you feeling today?',
  checkinCorpo: 'Sleep, hunger, energy and mood — four answers, and the day is logged.',
  peso: 'Weigh-in day',
  pesoCorpo: 'Step on the scale whenever you can. One number a week already draws the curve.',
  agua: 'A glass of water',
  aguaCorpo: 'It helps with fullness and with nausea — and it counts toward the daily goal.',
  proteina: 'Protein first',
  proteinaCorpo: 'At your next meal, start with it. It’s what holds on to lean mass.',
};
