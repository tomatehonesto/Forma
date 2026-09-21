/* ============================================================
   THE READINGS — what the app says after reading the answers · en-US

   ⚠️⚠️ Reasons live in ../pt-BR/leituras.ts. FOUR LOCKS APPLY TO THE WHOLE
   FILE, and they are not style:

   1. NONE OF THEM NAMES A DIAGNOSIS. Whoever is reading already has the
      symptom, and the name of a disease frightens without helping decide
      the next step.

   2. THE SUBJECT IS THE SYMPTOM OR THE BODY, NEVER THE PERSON. Someone
      who is vomiting isn't vomiting too much — they're vomiting. They are
      the one reading, not the one who caused it.

   3. THE THRESHOLDS ARE CLINICAL, NOT EDITORIAL. Translation touches the
      words, never the numbers, which live in logic/leituras.

   4. THE `curto` NAMES THE OBJECT OF THE VERB, ALWAYS. "Sip slowly"
      leaves the reader filling the gap, and on a line read in passing the
      gap stays. "Sip water slowly" leaves no doubt — and it's the only
      sentence they'll carry away.
   ============================================================ */

export const leituras = {
  /* ---------- the field warnings ---------- */
  dorSobre: 'Abdominal pain',
  dorCurto: 'contact your care team today',
  dorTitulo: 'This pain doesn’t wait for your next appointment',
  /* ⚠️ "ALMOST ALWAYS IT'S NOTHING SERIOUS — AND THAT'S EXACTLY WHY IT'S
     WORTH LOOKING EARLY" is the whole sentence. It asks for attention
     without frightening, and the "exactly why" is what keeps the reading
     from becoming an alarm. */
  dorTexto: 'Severe pain in the belly, or pain that doesn’t let up, is the one that needs attention the same day. Almost always it’s nothing serious — and that’s exactly why it’s worth looking early.',
  dorAcao: 'Contact your care team today. If it gets worse or comes with vomiting, go get seen.',

  vomitoSobre: 'Vomiting',
  vomitoCurto: 'sip water slowly, several times',
  vomitoTitulo: 'Vomiting takes more fluid than it looks',
  vomitoTexto: 'Salt goes out with the water, and the body feels it before you feel thirsty. And when food doesn’t stay down, the next day already starts tired.',
  vomitoAcao: 'Sip slowly, several times, instead of a whole glass at once. If even water won’t stay down, contact your care team today.',

  tonturaSobre: 'Dizziness',
  tonturaCurto: 'sit down, drink water and eat something sweet',
  tonturaTitulo: 'Dizziness like this usually has an explanation',
  tonturaTexto: 'Almost always it’s low fluid or low blood sugar. If you also take a diabetes medication, low blood sugar becomes more likely still.',
  tonturaAcao: 'Sit down, drink water and eat something. If it happens again over the next days, tell your care team.',

  presoSobre: 'Constipation',
  presoCurto: 'drink water through the day, eat fiber and take a walk',
  presoTitulo: 'Four days without going deserves attention',
  presoTexto: 'The medication slows everything down, and eating less leaves little for the bowel to push along. Four days is where this usually stops resolving on its own.',
  presoAcao: 'Water through the day, fiber at meals and a walk. If it goes past five days, or comes with severe pain and vomiting, go get seen.',

  soltoSobre: 'Loose stools',
  soltoCurto: 'drink water with a pinch of salt, without waiting to feel thirsty',
  soltoTitulo: 'Loose stools take water and salt along',
  soltoTexto: 'Seven trips or more in a day take out more than thirst can put back.',
  soltoAcao: 'Drink through the day without waiting to feel thirsty, with an oral rehydration mix or a pinch of salt. If tomorrow is the same, tell your care team.',

  /* ---------- the combinations ----------

     ⚠️ WHEN A COMBINATION APPEARS, THE FIELD WARNINGS GO AWAY. They say
     "talk to your care team" about one symptom; the combination says "go
     now" about the whole picture, and keeping both on screen lets the
     less urgent argue with the more urgent. */
  travaSobre: 'Bowels, pain and vomiting',
  travaCurto: 'go to urgent care today',
  travaTitulo: 'This combination needs care now',
  travaTexto: 'Bowels stopped for days, severe pain and vomiting together can mean something is blocked. It’s rare, but it doesn’t get better on its own.',
  /* ⚠️ "WHICH MEDICATION YOU TAKE", not "that you use the pen". Someone at
     urgent care needs to say WHAT they take, not what package it comes
     in. */
  travaAcao: 'Go to urgent care today. Say which medication you take and how many days since you last had a bowel movement.',

  dorVomitoSobre: 'Pain with vomiting',
  dorVomitoCurto: 'contact your care team or go get seen today',
  dorVomitoTitulo: 'Severe pain with vomiting doesn’t wait',
  dorVomitoTexto: 'Severe belly pain along with vomiting, sometimes spreading to the back, needs attention the same day. Caught early, it’s simple to check.',
  dorVomitoAcao: 'Contact your care team or go get seen today. Say which medication you take, the dose, and when the pain started.',

  desidratacaoSobre: 'Dizziness and fluid loss',
  desidratacaoCurto: 'drink an oral rehydration mix or salted water, and stand up slowly',
  desidratacaoTitulo: 'Dizziness with fluid loss is a sign of dehydration',
  desidratacaoTexto: 'When water and salt run short, blood pressure drops on standing — and the dizziness is the body saying so.',
  desidratacaoAcao: 'Sip through the day, with an oral rehydration mix or a pinch of salt, and stand up slowly. If it isn’t better by tomorrow, tell your care team.',

  /* ---------- persistence ----------

     ⚠️ THE TEXT CARRIES THE NUMBER OF DAYS. "Four of the last seven" is a
     fact the person takes to the appointment; "you get nauseous often" is
     an impression they already had. */
  vomitoSemanaSobre: 'Vomiting this week',
  vomitoSemanaCurto: 'contact your care team this week',
  vomitoSemanaTitulo: 'Vomiting on repeated days',
  vomitoSemanaTexto: (n: number) => `${n} of the last seven days with vomiting. At that rate food, fluid and the medication itself don’t stay down.`,
  vomitoSemanaAcao: 'Contact your care team this week, without waiting for the appointment. Bring the number of days — that’s what makes the difference.',

  soltoSemanaSobre: 'Bowels this week',
  soltoSemanaCurto: 'drink more water and tell your care team',
  soltoSemanaTitulo: 'Your bowels have been loose for days',
  soltoSemanaTexto: (n: number) => `${n} of the last seven days like this already weighs on hydration, even when each day on its own seems fine.`,
  soltoSemanaAcao: 'Drink more than thirst asks for and tell your care team. It could be the dose, it could be the food.',

  enjooSemanaSobre: 'Nausea this week',
  enjooSemanaCurto: 'bring the number of days to your appointment',
  enjooSemanaTitulo: 'The nausea isn’t passing',
  enjooSemanaTexto: (n: number) => `${n} of the last seven days with nausea stops being adjustment and becomes a pattern. It usually changes with the dose, or with how fast it goes up.`,
  /* ⚠️ "HOLDING THE DOSE A LITTLE LONGER ISN'T GIVING UP" is what the
     sentence is for: it's the course of action people most resist
     bringing to the appointment, because they read it as failure. */
  enjooSemanaAcao: 'Bring that number to your next appointment. Holding the dose a little longer isn’t giving up.',

  /* ⚠️ CONSTIPATION APPEARS IN BOTH READINGS, and it isn't repetition: the
     field ruler counts consecutive days without going — one episode — and
     this one counts days in the week with slow bowels, which is the
     pattern of someone who goes every three days without ever reaching
     four. */
  presoSemanaSobre: 'Slow bowels this week',
  presoSemanaCurto: 'drink water, eat fiber and take a walk',
  presoSemanaTitulo: 'Your bowels have been slow all week',
  presoSemanaTexto: (n: number) => `${n} of the last seven days with constipation. Eating less is an effect of the medication, and less food means less fiber passing through — the bowel feels it before the scale does.`,
  presoSemanaAcao: 'Water, fiber and a walk help. At this rate, it’s worth telling your care team.',
};
