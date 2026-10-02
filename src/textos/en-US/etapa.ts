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

  antesComDoseHead: 'Your first dose is still ahead of you.',
  antesComDoseBody: (molecula: string) =>
    `The first days on ${molecula} usually bring less hunger and mild nausea. Logging how you feel from the start is what gives you something to compare against later.`,
  antesComDoseQ: 'What to expect on dose day?',

  antesSemDoseHead: 'Your treatment doesn’t have a dose set yet.',
  antesSemDoseBody: 'Once your care team sets it, it goes here — it’s what we build the weekly cycle and the reminders from.',
  antesSemDoseQ: 'How does the medication cycle work?',

  /* ---------- 2. the dose went up ---------- */
  doseNovaChapeu: 'NEW DOSE',
  doseNovaHead: (dose: string, unidade: string) =>
    `You moved up to ${dose} ${unidade} this week.`,
  doseNovaBodyCom: (perto: string, longe: string) =>
    `In your own logs, nausea sits at ${perto} for the two days after a dose and drops to ${longe} from the third on. Each step up tends to repeat that shape.`,
  doseNovaBodySem: 'Each step up tends to bring back, for a few days, what had already passed — nausea most often. It usually eases as your body adjusts.',
  doseNovaQ: 'Why am I nauseous?',

  /* ---------- 3. the first week ---------- */
  /* ⚠️ DIA A DIA, CONTADO DO REGISTRO DA DOSE (28/09/2026, pedido do dono):
     o dia 1 é o dia em que a primeira dose foi registrada, e cada dia tem
     o seu recado — o que é comum sentir, e o que vale registrar. Guia, e
     não diagnóstico: "é comum", "costuma". */
  primeiraChapeu: (n: number): string => `FIRST WEEK · DAY ${n}`,
  primeiraDias: [
    { head: 'Your first dose is logged.', body: 'It’s common not to feel anything yet — your body is just getting to know the medication. An evening check-in becomes the baseline for the days ahead.', q: 'What to expect on dose day?' },
    { head: 'Your hunger may start to ease.', body: 'Many people notice less appetite from today on. Eating slowly and stopping at the first sign of fullness helps avoid nausea.', q: 'Why does hunger go down?' },
    { head: 'Keep an eye on water.', body: 'With less hunger, it’s easy to drink less without noticing. Staying hydrated helps with nausea and digestion.', q: 'How much water should I drink?' },
    { head: 'Protein first.', body: 'With smaller plates, start with protein: it helps preserve muscle while your weight goes down.', q: 'Why does protein matter so much?' },
    { head: 'How’s your digestion?', body: 'Constipation is a common report in the first weeks. Logging it in your check-in shows whether it passes — and gives you something to bring to your appointment.', q: 'What helps with constipation?' },
    { head: 'Hunger may come back a little.', body: 'Near the end of the cycle, it’s expected for appetite to return a bit. That’s part of it — and it’s why your next dose has a set day.', q: 'Why does hunger come back before the next dose?' },
    { head: 'One week of treatment.', body: 'You’ve completed your first week. The check-ins from these days are what show how your body responded, and what’s worth bringing to your appointment.', q: 'How did my first week go?' },
  ],
  /* ⚠️ Day six for a daily dose (01/10/2026) — see ../pt-BR/etapa.ts. The
     one above is about the weekly cycle; with one dose a day there's no
     end of cycle for hunger to wait for. */
  primeiraDiaSeisDiaria: {
    head: 'No highs and lows across the week.',
    body: 'With one dose a day, the medication stays at a similar level from one day to the next — hunger has no set day to come back. If it shows up, your check-in is the place to note it.',
    q: 'How does a daily medication work?',
  },

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
    `Your weigh-ins have averaged ${media} since then. A plateau is an expected part of treatment: your body starts burning less as the weight comes down. That’s a conversation for your appointment, not a matter of effort.`,
  platoBodyDois: (antes: string, agora: string) =>
    `${antes} four weeks ago, ${agora} now. A plateau is an expected part of treatment: your body starts burning less as the weight comes down. That’s a conversation for your appointment, not a matter of effort.`,
  platoQ: 'How am I doing overall?',
};
