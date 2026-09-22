/* ============================================================
   THE CROSS-FINDINGS — what the logs say when they meet · en-US

   ⚠️ Reasons live in ../pt-BR/cruzamentos.ts. Three rules for the whole
   file survive translation:

   NONE OF THESE MAY TURN INTO ADVICE. "Water helps with fullness" is
   information; "drink more water" is an order, and an order based on
   thirteen days of statistics is the worst of both worlds. The verbs were
   chosen one by one.

   THE SUBJECT IS THE PHENOMENON, NOT THE PERSON. "Your hydration drops on
   Sundays", not "you drink less on Sundays" — same fact, finger pointed.

   AND `significa` IS NOT A SUMMARY OF `texto`. It exists to say something
   the numbers do NOT say. Translating it as a recap undoes the card.
   ============================================================ */

export const cruzamentos = {
  catAlimentacao: 'Nutrition',
  catSono: 'Sleep',
  catSintomas: 'Symptoms',
  catPeso: 'Weight',
  catAplicacoes: 'Shots',

  /* ⚠️ THEY COME WITH THE PREPOSITION, not bare. Portuguese needed it to
     avoid a gendered table; English needs it because "on Sundays" is one
     unit and the plural is what makes it habitual. */
  nomesDia: ['on Sundays', 'on Mondays', 'on Tuesdays', 'on Wednesdays', 'on Thursdays', 'on Fridays', 'on Saturdays'],

  /* ---------- 1. the weekend as a different treatment ---------- */
  /* ⚠️ "A DIFFERENT TREATMENT", NOT "YOUR WORST STRETCH". The finding
     crosses three variables, and two of them improve on the weekend. */
  fimDeSemana: {
    titulo: 'Your weekend runs like a different treatment',
    texto: (copos: string, proteina: string, sono: string) =>
      `On Saturdays and Sundays you drink ${copos} fewer glasses${proteina}${sono}`,
    textoProteina: (gramas: number) => ` and eat ${gramas} g less protein`,
    /* ⚠️ SLEEP IS THE GOOD NEWS INSIDE THE BAD, which is why it closes the
       sentence: "rest improves; it's the routine that loosens" is the
       whole finding in one clause, and it's what keeps the card from
       becoming a scolding. */
    textoSono: (horas: string) => ` — but you sleep ${horas} h more. Rest improves; it’s the routine that loosens.`,
    textoSemSono: '.',
    q: 'How do I take better care of the weekend?',
    evid: (copos: string) => ({ valor: `−${copos}`, unidade: 'glasses', legenda: 'on Saturday and Sunday' }),
    porque: 'The weekday routine carries your hydration and your meals without you having to think about them: fixed hours, a bottle on the desk, lunch at the same time. On Saturday that structure disappears, and what’s left is deciding everything in the moment — which is exactly when deciding is hardest.',
    /* ⚠️ "IT DOESN'T NEED NEW DISCIPLINE" is the whole sentence. Whoever
       reads this already knows the weekend is harder; what they don't
       know is that the problem is structural and not a matter of will. */
    significa: 'Two days a week the treatment runs with one foot outside, and they’re exactly the days you have the most time. It doesn’t need new discipline — it needs the weekend to have a routine of its own, instead of being the absence of the weekday one.',
  },

  /* ---------- 2. the weak hydration day ---------- */
  aguaDia: {
    titulo: (dia: string) => `Your hydration drops ${dia}`,
    texto: (pior: string, outros: string) =>
      `About ${pior} glasses, against ${outros} on the other days. Water helps with fullness and with nausea — and it’s the day those two usually weigh the most.`,
    q: 'How’s my water?',
    evid: (pior: string, outros: string) =>
      ({ valor: pior, unidade: `of ${outros} glasses`, legenda: 'the average on that day of the week' }),
    significa: 'One day of the week pulls your average down by itself. Since it’s always the same one, a single reminder can handle it, instead of watching your hydration every day.',
  },

  /* ---------- 3. today's protein against tomorrow's hunger ---------- */
  /* ⚠️ THE FINDING IS THE ONE-DAY LAG, not the protein. The relationship
     vanishes on a daily chart because people see today's hunger next to
     today's plate, never yesterday's. */
  proteinaFome: {
    titulo: 'On the days you hit your protein, the next day is easier',
    texto: (meta: number, comMeta: string, semMeta: string) =>
      `After reaching ${meta} g, your hunger the next day came in at ${comMeta}. When you didn’t reach it, ${semMeta}. The effect doesn’t show up the same day — which is why it’s hard to notice on your own.`,
    q: 'How’s my protein?',
    evid: (diferenca: string) =>
      ({ valor: `−${diferenca}`, unidade: 'hunger', legenda: 'the day after hitting the goal' }),
    porque: 'Protein works on fullness through a slower path than sugar: it takes longer to leave the stomach and it sustains satiety signals for many hours. That’s why the effect crosses the night and reappears in the next morning’s appetite.',
    /* ⚠️ "NOT JUST FILLING A QUOTA" is what moves the protein goal out of
       the obligation slot and into the trade slot. */
    significa: 'Hitting your protein goal isn’t just filling a quota: it’s buying yourself an easier next day. When hunger bites, what settles it isn’t what you eat at that moment — it’s what you ate yesterday.',
  },

  /* ---------- 4. sleep against next-day hunger ---------- */
  sonoFome: {
    titulo: 'Sleeping more than seven hours holds your hunger the next day',
    texto: (comSono: string, semSono: string) =>
      `After full nights your hunger came in at ${comSono}; after short nights, ${semSono}. Your appetite answers to the night before as much as to what you ate.`,
    q: 'What should I log before bed?',
    evid: { valor: '7h', unidade: '+', legenda: 'the point where your hunger changes' },
    /* ⚠️ "IT ISN'T A LACK OF DISCIPLINE" is the heart, not a softener.
       People who slept badly and ate more the next day usually blame
       themselves; the hormonal mechanism is the fact that undoes it. */
    porque: 'Short sleep moves both hormones that regulate appetite: the one that makes you hungry goes up and the one that signals enough goes down. It isn’t a lack of discipline the next day — it’s the body asking for quick energy to make up for the rest it didn’t get.',
    significa: 'Sleep doesn’t usually make it into the math of someone treating their weight, but in your data it moves appetite like few things do. One protected night can be worth more to the next day than any adjustment on the plate.',
  },

  /* ---------- 5. sleep against next-day nausea ---------- */
  /* ⚠️ THIS IS THE ONLY FINDING THAT TIES A HABIT TO A CLINICAL SYMPTOM,
     and its `significa` is the most careful in the file: it UNDOES the
     causal reading the title invites. Getting this wrong doesn't cost a
     bad tip about water — it costs making someone conclude their nausea
     is their own fault for sleeping badly. */
  sonoEnjoo: {
    titulo: 'After long nights, your nausea has been milder',
    texto: (horas: number, comSono: string, semSono: string) =>
      `On the days after sleeping ${horas}h or more, your nausea came in at ${comSono}. After short nights, ${semSono} — on a scale of 5.`,
    q: 'Why am I nauseous?',
    evid: (comSono: string, semSono: string, noites: number) =>
      ({ valor: comSono, unidade: `of ${semSono}`, legenda: `nausea after ${noites} long nights` }),
    significa: 'This is what your logs show, not a causal relationship: the shot cycle moves nausea more than anything else does, and it could be behind both sides of this math. Worth taking to your care team as a lead, not as a settled explanation.',
  },

  /* ---------- 6. the nausea window ---------- */
  /* The finding isn't that nausea exists — it's that it has a closing
     time. */
  janelaEnjoo: {
    titulo: 'Your nausea usually clears about 48 hours after your shot',
    texto: (perto: string, longe: string) =>
      `It sits at ${perto} for the first two days and drops to ${longe} from the third on. It isn’t the whole treatment that makes you nauseous — it’s the first 48 h of each cycle.`,
    q: 'Why am I nauseous?',
    evid: { valor: '48', unidade: 'hours', legenda: 'and then it passes' },
    /* ⚠️ THE LAST SENTENCE IS THE ONLY ONE IN THE FILE THAT SUGGESTS AN
       ACTION, and it may: picking the shot day is the person's call
       with their care team, not a change of dose or medication. */
    significa: (dias: number) =>
      `That repeated in ${dias} of your post-shot logs. Knowing there’s a window, and that it ends, changes what you can do with it: you can pick the shot day so those 48 h land on the lightest part of your week.`,
  },

  /* ---------- 7. water against nausea ---------- */
  aguaEnjoo: {
    titulo: 'On the days you drink well, nausea is milder',
    /* ⚠️ "DOESN'T PROVE CAUSE" IS INSIDE THE SENTENCE, not in a footer.
       The whole card is a correlation over thirteen days; the caveat has
       to arrive next to the number, because that's where it's read. */
    texto: (corte: string, comAgua: string, semAgua: string) =>
      `At ${corte} or more, your average nausea was ${comAgua}. Below that, ${semAgua}. It doesn’t prove cause — but it’s the easiest variable to move that shows up tied to the symptom.`,
    q: 'How do I ease the nausea?',
    evid: (diferenca: string) =>
      ({ valor: `−${diferenca}`, unidade: 'nausea', legenda: 'on well-hydrated days' }),
    significa: 'Of everything that shows up tied to your nausea, water is the one most in your hands. It doesn’t replace talking to your care team if it gets worse, but it’s the first thing worth trying before that.',
  },

  /* ---------- 8. the plateau that stopped nothing ---------- */
  /* ⚠️ THIS IS THE FINDING THAT PREVENTS QUITTING, and that's why it
     exists. The week the scale goes up is the week people stop. */
  platoQueNaoImpediu: {
    titulo: (altas: number, perdido: string) =>
      `The scale went up ${altas} times and you lost ${perdido} anyway`,
    texto: (pesagens: number, altas: number) =>
      `Across ${pesagens} weigh-ins, ${altas} came in above the one before — and the line for the period keeps going down. A week that goes up isn’t a relapse: it’s water and bowels moving inside a trend.`,
    q: 'How am I doing overall?',
    evid: (altas: number, perdido: string) =>
      ({ valor: String(altas), unidade: 'upticks', legenda: `inside −${perdido} over the period` }),
    porque: 'The weight on any given day is fat, but it’s also water, salt, bowels and the hormonal cycle — swings of two to four pounds happen with nothing at all having changed in body fat. Fat leaves slowly and in a line; the rest swings on top of it, and it’s what the scale shows first.',
    significa: 'This matters more than it looks: the week the scale goes up is the week people tend to quit. In your own numbers, it has never meant what it looked like it meant.',
  },

  /* ---------- 9. protein across the treatment ---------- */
  proteinaTendencia: {
    titulo: (subiu: boolean, pct: number) =>
      `Your protein ${subiu ? 'rose' : 'fell'} ${pct}% since the start`,
    textoSubiu: (depois: number, antes: number) =>
      `Averaging ${depois} g/day in recent weeks, against ${antes} g at the start. Protein preserves lean mass during weight loss.`,
    textoCaiu: (depois: number, antes: number) =>
      `Averaging ${depois} g/day in recent weeks, against ${antes} g before. Worth picking back up — lean mass is what holds up your metabolism.`,
    q: 'How’s my protein?',
    evid: (pct: number, antes: number, depois: number) =>
      ({ valor: `${pct > 0 ? '+' : ''}${pct}%`, unidade: '', legenda: `${antes} → ${depois} g per day` }),
    significaSubiu: 'It rose without you announcing any change, which is usually the kind of habit that sticks. Protein is what protects your lean mass while the weight comes down — without it, part of what leaves isn’t fat.',
    significaCaiu: 'The drop was gradual, the kind you don’t notice from one day to the next. Protein is what protects your lean mass while the weight comes down; worth picking it back up before it becomes the new normal.',
  },

  /* ---------- 10. the pace ---------- */
  ritmo: {
    titulo: (ritmo: string) => `Your pace is ${ritmo} kg a week`,
    textoBom: (perdido: string, semanas: number) =>
      `${perdido} in ${semanas} weeks, within what’s expected for your stage.`,
    /* ⚠️ THE OUT-OF-RANGE VERSION DOESN'T DIAGNOSE AND DOESN'T ALARM: it
       refers. Too fast or too slow is an appointment conversation, and
       the card stops exactly there. */
    textoAtencao: (perdido: string, semanas: number) =>
      `${perdido} in ${semanas} weeks. Worth raising the pace with your care team at your next appointment.`,
    q: 'How am I doing overall?',
    evid: (ritmo: string, perdido: string, semanas: number) =>
      ({ valor: ritmo, unidade: 'kg/wk', legenda: `${perdido} in ${semanas} weeks` }),
    significaBom: 'It’s a sustainable pace, and sustainable is what counts: losses that come too fast tend to take lean mass with them and come back afterward. Yours is in the range the literature ties to results that hold.',
    /* ⚠️ "NOT WITH ME" — the only line in the app that says, in the first
       person, what it does NOT do. It exists because the alternative was
       opining on a pace that may have a clinical cause. */
    significaAtencao: 'Pace is a conversation to have with your care team, not with me. I’ll bring the number organized to the appointment if you want.',
  },

  /* ---------- 11. adherence ---------- */
  adesao: {
    tituloPerfeita: 'You haven’t been late on a single shot since the start',
    titulo: (pct: number) => `You’ve kept ${pct}% of your shots on time`,
    texto: (aplicacoes: number, ressalva: string) =>
      `That’s ${aplicacoes} shots since treatment began, ${ressalva}.`,
    textoQuaseTodas: 'nearly all of them on the right date',
    textoComAtrasos: 'with a few late ones along the way',
    q: 'How does the medication cycle work?',
    evid: (pct: number, aplicacoes: number) =>
      ({ valor: `${pct}%`, unidade: '', legenda: `${aplicacoes} shots since the start` }),
    significaAlta: 'That consistency is one of the factors that weighs most on a good response to the medication. The level of the substance in the body depends on regularity, not on effort — and it’s the kind of thing that only shows up when someone looks at the whole history.',
    /* ⚠️ THE LATE VERSION EXPLAINS THE COST AND DOESN'T CHARGE FOR THE
       MISS. "Each delay leaves a window where the effect drops early" is
       the mechanism; "try not to be late" would be the scolding this
       screen doesn't give. */
    significaBaixa: 'Regularity weighs more than the exact dose on any given day: each delay leaves a window where the effect drops early, and that’s where hunger tends to come back hardest.',
  },
};
