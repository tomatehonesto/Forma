/* ============================================================
   NOTIFICATIONS — the two lines on the lock screen · en-US

   ⚠️ Reasons live in ../pt-BR/avisos.ts. The rule: whoever reads this is
   out in the world, in the middle of something else. None of them nags,
   none says "you didn't", and none asserts what the app can't know at
   that hour. The notification offers; the person knows their day.
   ============================================================ */

export const avisos = {
  doseHoje: (acao: string) => `Your ${acao} is today`,
  doseHojeCorpo: (dose: string) => `${dose}. Log it here whenever you can.`,
  doseAmanha: (acao: string) => `Your ${acao} is tomorrow`,
  doseAmanhaCorpo: (dose: string, oRecipiente: string) => `${dose}. Worth leaving ${oRecipiente} where you can see it.`,
  doseEmDias: (dias: number, acao: string) => `Your ${acao} is in ${dias} days`,
  doseEmDiasCorpo: (dose: string, _doRecipiente: string) => `${dose}. There’s time to check your supply.`,

  /* ⚠️ THE DAILY DOSE GETS ONE NOTIFICATION, TODAY'S (02/10/2026, part B4
     — reasons in ../pt-BR/avisos.ts). "Take" serves the pill and the daily
     pen alike in English, the same call as `doseDeHoje.registrarHoje`, so
     `injetavel` is accepted and not used. The body never claims she
     hasn't taken it yet. */
  doseDiaria: (_injetavel: boolean): string => 'Time to take today’s dose',
  doseDiariaCorpo: (dose: string) => `${dose}. Afterward, one tap logs it.`,

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
