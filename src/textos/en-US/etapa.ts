/* ============================================================
   THE STAGE OF TREATMENT — the messages that open the Home · en-US

   ⚠️ Reasons live in ../pt-BR/etapa.ts. Read it before changing a word:
   the plateau card in particular carries a rule that is easy to undo in
   translation.

   ⚠️ THE HAT HAS TO FIT IN TWO WORDS. It is the uppercase label above the
   headline, drawn on a single line — anything longer breaks the card.
   ============================================================ */

export const etapa = {
  /* ---------- 1. hasn't started yet ---------- */
  antesChapeu: 'BEFORE YOU START',

  antesComDoseHead: 'Your first injection is still ahead of you.',
  antesComDoseBody: (molecula: string) =>
    `The first days on ${molecula} usually bring less hunger and mild nausea. Logging how you feel from the start is what gives you something to compare against later.`,
  antesComDoseQ: 'What to expect on injection day?',

  antesSemDoseHead: 'Your treatment doesn’t have a dose set yet.',
  antesSemDoseBody: 'Once your care team sets it, it belongs here — it’s what we build the weekly cycle and the reminders from.',
  antesSemDoseQ: 'How does the medication cycle work?',

  /* ---------- 2. the dose went up ---------- */
  doseNovaChapeu: 'NEW DOSE',
  doseNovaHead: (dose: string, unidade: string) =>
    `You moved up to ${dose} ${unidade} this week.`,
  doseNovaBodyCom: (perto: string, longe: string) =>
    `In your own logs, nausea sits at ${perto} for the two days after an injection and drops to ${longe} from the third on. Each step up tends to repeat that shape.`,
  doseNovaBodySem: 'Each step up tends to bring back, for a few days, what had already passed — nausea most often. It usually eases as your body adjusts.',
  doseNovaQ: 'Why am I nauseous?',

  /* ---------- 3. the first week ---------- */
  primeiraChapeu: 'FIRST WEEK',
  primeiraHead: 'This is your first week of treatment.',
  /* ⚠️ THE BODY IS THE SUBJECT, on purpose: what is happening is not a
     failure of the person and not something to endure, it is an
     adjustment. Keep the body doing the acting. */
  primeiraBody: 'Your body is still getting to know the medication. Mild nausea, less hunger, and some tiredness are the most common reports in the first days, and they usually ease over the weeks.',
  primeiraQ: 'What to expect on injection day?',

  /* ---------- 4. maintenance ---------- */
  manutencaoChapeu: 'MAINTENANCE',
  manutencaoHeadEquipe: 'You’re in the range your care team set.',
  manutencaoHeadDela: 'You’re at the weight you set as your goal.',
  /* ⚠️ "KEEPING IT IS DIFFERENT WORK FROM LOSING IT" is the heart of the
     sentence, not decoration: people who reach the goal are usually told
     they're done, and what decides whether the result holds is exactly
     what comes after. */
  manutencaoBody: (atual: string, alvo: string, por: string | null) =>
    `${atual}, against ${alvo}${por ? ` set by ${por}` : ''} — and at least a month in that range. Keeping it is different work from losing it, and it’s what decides whether the result holds.`,
  manutencaoQ: 'How am I doing overall?',

  /* ---------- 5. plateau ---------- */
  platoChapeu: 'WEIGHT STEADY',
  platoHead: 'Your weight has been flat for about a month.',
  /* ⚠️⚠️ THE EXPLANATION COMES BEFORE ANY SUGGESTION, AND THE SUGGESTION
     IS NOT "TRY HARDER".

     A plateau is physiology: the body spends less as it weighs less, and
     the same dose now meets a different body. Whoever is reading this is
     doing what they have always done and watching the scale stop — the
     last thing they need is an app implying the problem is them.

     ⚠️ "THAT'S A CONVERSATION FOR YOUR APPOINTMENT, NOT A MATTER OF
     EFFORT" is the whole sentence in a handful of words, and it is why
     this card has no action button. Anything along the lines of "here's
     what you can do" undoes the card. */
  platoBodyIgual: (media: string) =>
    `Your weigh-ins have averaged ${media} since then. A plateau is an expected part of treatment: the body starts spending less as the weight comes down. That’s a conversation for your appointment, not a matter of effort.`,
  platoBodyDois: (antes: string, agora: string) =>
    `${antes} four weeks ago, ${agora} now. A plateau is an expected part of treatment: the body starts spending less as the weight comes down. That’s a conversation for your appointment, not a matter of effort.`,
  platoQ: 'How am I doing overall?',
};
