/* ============================================================
   LAB MARKERS — the largest block of clinical text in the app · en-US

   ⚠️ Reasons live in ../pt-BR/marcadores.ts. Read the four locks on the
   "what usually helps" section before touching a single item there.

   ⚠️⚠️ THE KEYS OF THESE TABLES ARE NOT TRANSLATED. "HbA1c", "Glicemia
   jejum", "Ferritina" are what is STORED in `e.marker` — they are data,
   not labels. Translating a key would break the link between a panel
   someone logged last year and this table. What the reader sees is the
   `nome` map below.

   ⚠️ AND THIS IS NOT LABEL TRANSLATION. In the United States TGO and TGP
   are called AST and ALT — a different name on the report, not the same
   word in another language. The same goes for HbA1c, which US patients
   read as "A1C" on their own results.

   ⚠️⚠️ THIS FILE NEEDS REVIEW BY SOMEONE QUALIFIED IN THE TARGET MARKET.
   It is written to the same rules as the Portuguese — nothing prescribes,
   nothing carries a dose, nothing promises a result — but the wording of
   clinical education for a US audience is not a call a translation can
   settle on its own. It is recorded in PENDENCIAS.
   ============================================================ */

import type { SobreOMarcador, JeitoDeAjudar } from '../pt-BR/marcadores';

/* ⚠️ THE NAME ON SCREEN. The key on the left is the stored data; the
   value on the right is what the reader sees. Anything not listed shows
   up as its own key — old records don't vanish from the screen because a
   table doesn't know them. */
const NOME: Record<string, string> = {
  'HbA1c': 'A1C',
  'Glicemia jejum': 'Fasting glucose',
  'Insulina': 'Insulin',
  'Colesterol total': 'Total cholesterol',
  'HDL': 'HDL',
  'LDL': 'LDL',
  'Triglicerídeos': 'Triglycerides',
  'Creatinina': 'Creatinine',
  'TGO': 'AST',
  'TGP': 'ALT',
  'TSH': 'TSH',
  'T4 livre': 'Free T4',
  'Vitamina D': 'Vitamin D',
  'Vitamina B12': 'Vitamin B12',
  'Ferritina': 'Ferritin',
};

/* ⚠️ MID-SENTENCE CASING IS A LANGUAGE RULE. In English the common nouns
   go lowercase inside a sentence — "vitamin D", "fasting glucose" — while
   the initialisms keep their case: A1C, HDL, AST. The test is the same
   shape as the Portuguese one, without the accented ranges. */
const NO_MEIO = (nome: string) => {
  const p1 = nome.split(' ')[0];
  return /^[A-Z][a-z]+$/.test(p1) ? nome[0].toLowerCase() + nome.slice(1) : nome;
};

/* ⚠️ NO DEFINITION CITES ANOTHER MARKER OR A LAB TERM. If a sentence
   needs a second sentence to be understood, it isn't a definition, it's
   an encyclopedia entry. */
const SOBRE = {
  'HbA1c': {
    oQueE: 'How much sugar has stuck to the red cells in your blood.',
    porQue: 'Since those cells live about three months, the result tells the average sugar over that period, not just the day of the draw.',
    afeta: 'for how sugar has been controlled over the months',
  },
  'Glicemia jejum': {
    oQueE: 'The amount of sugar in your blood after hours without eating.',
    porQue: 'It’s the most direct measure of how the body handles glucose at rest.',
    afeta: 'for how the body deals with sugar',
  },
  'Insulina': {
    oQueE: 'The hormone that moves sugar out of the blood and into the cells.',
    porQue: 'When it’s high, it usually signals that the body has to make more of it to do the same job.',
    afeta: 'for the effort the body spends keeping sugar in order',
  },
  'Colesterol total': {
    oQueE: 'All the cholesterol circulating in your blood, added up.',
    porQue: 'On its own it says little, because it lumps into one number types of cholesterol that do opposite things in the body.',
    afeta: 'for artery health over the years',
  },
  'HDL': {
    oQueE: 'The cholesterol that does the cleanup: it picks up fat from the arteries and carries it away.',
    porQue: 'It’s the only cholesterol test where a higher number is the good news.',
    afeta: 'for clearing fat out of the arteries',
  },
  'LDL': {
    oQueE: 'The cholesterol that carries fat out to the body’s tissues.',
    porQue: 'In excess, it’s the one that builds up in the artery wall over the years.',
    afeta: 'for artery health over the years',
  },
  'Triglicerídeos': {
    oQueE: 'The fat circulating in your blood, coming from food and from the liver.',
    porQue: 'It responds quickly to what you eat and to weight, which is why it’s usually the first to move during treatment.',
    afeta: 'for fat in the blood and for the heart',
  },
  'Creatinina': {
    oQueE: 'A leftover that muscle produces all the time and the kidney clears out.',
    porQue: 'Since it’s the kidney that removes it from the blood, how much is left there is one way to see whether it’s keeping up.',
    afeta: 'for how the kidneys are working',
  },
  'TGO': {
    oQueE: 'A substance kept inside liver and muscle cells.',
    porQue: 'It only shows up in the blood when those cells break — which is why it works as a warning that something is irritating the liver.',
    afeta: 'for liver health',
  },
  'TGP': {
    oQueE: 'A substance kept almost only inside liver cells.',
    porQue: 'Since it barely exists anywhere else in the body, when it shows up in the blood the address is much more certain.',
    afeta: 'for liver health',
  },
  'TSH': {
    oQueE: 'The message the brain sends the thyroid asking it to work.',
    porQue: 'It goes up when the thyroid is slow and down when it’s fast — it’s the thermostat, not the temperature.',
    afeta: 'for the pace of your metabolism',
  },
  'T4 livre': {
    oQueE: 'The hormone the thyroid produces, in the part of it the body can actually use.',
    porQue: 'It shows what the thyroid is really delivering, which is why it always comes paired with the test above.',
    afeta: 'for the pace of your metabolism',
  },
  'Vitamina D': {
    oQueE: 'The vitamin the body makes from sunlight and absorbs from food.',
    porQue: 'It takes part in calcium absorption and in how muscle and immunity work.',
    afeta: 'for bones, muscle and immunity',
  },
  'Vitamina B12': {
    oQueE: 'A vitamin that comes from animal-source foods.',
    porQue: 'It’s needed for red blood cells and for nerves, and people who eat less of those usually keep an eye on replacing it.',
    afeta: 'for nerves and for making blood',
  },
  'Ferritina': {
    oQueE: 'The body’s iron pantry — what’s stored inside the cells.',
    porQue: 'That’s why it shows the stock, and not the iron circulating in your blood today.',
    afeta: 'for the iron stores that hold up your energy',
  },
} satisfies Record<string, SobreOMarcador>;

/* ============================================================
   WHAT MOVES THIS NUMBER

   ⚠️ NO ITEM SAYS WHAT TO DO. "Alcohol in the days before" is a fact
   about the marker; "stop drinking" would be management, and management
   belongs to whoever follows the person. The line between educating and
   prescribing runs exactly here.

   ⚠️ THESE ARE COMMON CAUSES, NOT THE COMPLETE LIST.
   ============================================================ */
const INFLUENCIAS = {
  'HbA1c': [
    'The average glucose of the last two to three months, not what you ate yesterday',
    'Anemia and blood disorders, which change how long red cells live and distort the result',
    'Weight loss and glucose medications, which tend to bring it down over months',
  ],
  'Glicemia jejum': [
    'How many hours of fasting before the draw',
    'Poor sleep and stress the night before, which raise morning sugar',
    'Exercise and weight loss, which tend to bring it down',
  ],
  'Insulina': [
    'The fast before the draw, as much as for glucose',
    'How much body fat there is, which weighs most in this math',
    'It’s usually read alongside glucose, not on its own',
  ],
  'Colesterol total': [
    'How much fat you eat, though less than its reputation suggests',
    'Genetics — some families make more cholesterol regardless of diet',
    'A slow thyroid, which raises it with no relation to food',
  ],
  'HDL': [
    'Regular aerobic exercise, which is what raises it most',
    'Smoking, which lowers it',
    'Genetics, which weighs heavily on this one in particular',
  ],
  'LDL': [
    'Saturated and trans fat in your food',
    'Weight loss, which usually brings it down along with triglycerides',
    'Genetics, which in some families dominates the result',
  ],
  'Triglicerídeos': [
    'The fast — eating close to the draw changes it a lot, more than anything else on the panel',
    'Alcohol in the days before',
    'Excess sugar and refined flour, which the body converts into fat',
  ],
  'Creatinina': [
    'How much muscle mass a person has, because it comes from muscle',
    'Hydration on the day of the draw',
    'A hard workout the day before, which can raise it temporarily',
  ],
  'TGO': [
    'Intense exercise in the days before, because it also exists in muscle',
    'Alcohol',
    'Fat in the liver, common in people carrying excess weight',
  ],
  'TGP': [
    'Fat in the liver, which is the most common cause of a mild change',
    'Alcohol and some medications',
    'Weight loss, which usually brings it down over the months',
  ],
  'TSH': [
    'The time of the draw — it runs higher overnight and in the early morning',
    'Acute illness and some medications',
    'Thyroid hormone replacement, when there is any',
  ],
  'T4 livre': [
    'How the thyroid is working, always read together with TSH',
    'Pregnancy and estrogen, which change the proteins that carry it',
  ],
  'Vitamina D': [
    'Sun on the skin — how much, what time, and how much of the body is exposed',
    'Darker skin and sunscreen, which reduce production',
    'Supplementation, when there is any',
    'The season: winter usually pulls it down',
  ],
  'Vitamina B12': [
    'Animal-source foods in the diet',
    'Bariatric surgery and some stomach medications, which reduce absorption',
    'Supplementation, when there is any',
  ],
  'Ferritina': [
    'The body’s iron stores',
    'Inflammation and infection, which raise it even with no iron to spare — which is why it’s never read alone',
    'Heavy periods, which reduce the stores over time',
  ],
} satisfies Record<string, string[]>;

/* ============================================================
   WHAT USUALLY HELPS

   ⚠️ THIS IS THE DANGEROUS PART OF THE FILE, AND IT HAS FOUR LOCKS.
   They are the Portuguese file's, unchanged:

   1. NOTHING HERE IS ABOUT MEDICATION. No item says to start, stop,
      raise or lower anything — and where replacement is the subject, the
      sentence says "when recommended by whoever follows your care".

   2. NOTHING HERE CARRIES A DOSE, AN AMOUNT OR A TIMEFRAME. "Sun on the
      skin is the main source" is information; "twenty minutes a day" is
      a prescription, and a prescription has to come from someone who
      examined the person.

   3. NOTHING HERE PROMISES A RESULT. The items say what is KNOWN about
      the marker, not what will happen to the reader's number.

   4. NOTHING HERE IS ABOUT THYROID OR KIDNEY. TSH, T4 and creatinine are
      left out on purpose: in the first case what moves the number is
      medication, and in the second the most obvious advice — drink
      water, eat protein — is exactly what someone with poor kidney
      function should not follow on their own. A marker with no honest
      item gets no section.
   ============================================================ */
const AJUDAR = {
  'HbA1c': [
    {
      grupo: 'In food',
      itens: [
        { nome: 'Slow-absorbing carbohydrates', detalhe: 'Whole grains, beans and vegetables raise glucose more slowly than white flour and sugar' },
        { nome: 'Protein and fiber in the same meal', detalhe: 'They lower the glucose spike from whatever is eaten with them' },
      ],
    },
    {
      grupo: 'In movement',
      itens: [
        { nome: 'Walking after eating', detalhe: 'Working muscle takes up glucose without depending on insulin' },
        { nome: 'Regular exercise', detalhe: 'Improves insulin sensitivity, and the effect builds over weeks' },
      ],
    },
  ],
  'Glicemia jejum': [
    {
      grupo: 'In your routine',
      itens: [
        { nome: 'Sleep', detalhe: 'Short nights raise the next morning’s glucose' },
        { nome: 'An earlier last meal', detalhe: 'Eating close to bedtime usually shows up in the next day’s fasting number' },
      ],
    },
    {
      grupo: 'In movement',
      itens: [
        { nome: 'Aerobic activity', detalhe: 'Lowers fasting glucose over weeks, not days' },
      ],
    },
  ],
  'Insulina': [
    {
      grupo: 'In weight and movement',
      itens: [
        { nome: 'Lowering body fat', detalhe: 'It’s what most reduces the insulin needed for the same work' },
        { nome: 'Strength training', detalhe: 'More muscle mass means more room for glucose to go' },
      ],
    },
  ],
  'Colesterol total': [
    {
      grupo: 'In food',
      itens: [
        { nome: 'Less saturated and trans fat', detalhe: 'Fried food, processed meats and packaged foods are the most common sources' },
        { nome: 'Soluble fiber', detalhe: 'Oats, beans and fruit reduce cholesterol absorption in the gut' },
      ],
    },
  ],
  'HDL': [
    {
      grupo: 'In movement',
      itens: [
        { nome: 'Aerobic exercise', detalhe: 'It’s what raises HDL most, and the effect depends on regularity' },
      ],
    },
    {
      grupo: 'In food',
      itens: [
        { nome: 'Good fats', detalhe: 'Olive oil, avocado, nuts and oily fish' },
      ],
    },
  ],
  'LDL': [
    {
      grupo: 'In food',
      itens: [
        { nome: 'Less saturated fat', detalhe: 'It’s what raises LDL most — fatty meats, whole-milk dairy, fried food' },
        { nome: 'Soluble fiber', detalhe: 'Oats, beans, lentils and fruit with the skin on' },
      ],
    },
    {
      grupo: 'In weight',
      itens: [
        { nome: 'Weight loss', detalhe: 'Usually brings LDL and triglycerides down together' },
      ],
    },
  ],
  'Triglicerídeos': [
    {
      grupo: 'In food',
      itens: [
        { nome: 'Less sugar and refined flour', detalhe: 'The excess turns into fat in the liver, and it’s what raises this marker most' },
        { nome: 'Alcohol', detalhe: 'It’s the single most common cause of high triglycerides' },
      ],
    },
    {
      grupo: 'In movement',
      itens: [
        { nome: 'Aerobic activity', detalhe: 'Triglycerides are among the markers that respond fastest' },
      ],
    },
  ],
  'TGO': [
    {
      grupo: 'In the liver',
      itens: [
        { nome: 'Alcohol', detalhe: 'It’s the most common cause of a change in both enzymes' },
        { nome: 'Weight loss', detalhe: 'Reduces fat in the liver, which is the other common cause' },
      ],
    },
  ],
  'TGP': [
    {
      grupo: 'In the liver',
      itens: [
        { nome: 'Weight loss', detalhe: 'Fat in the liver is the most common cause of a mild change, and it responds to weight' },
        { nome: 'Alcohol', detalhe: 'It leaves the math when it leaves the routine' },
      ],
    },
  ],
  'Vitamina D': [
    {
      grupo: 'In the sun',
      itens: [
        { nome: 'Skin exposure', detalhe: 'It’s the main source — sunscreen and covering clothes reduce production' },
      ],
    },
    {
      grupo: 'In food and replacement',
      itens: [
        { nome: 'Oily fish, egg yolk and mushrooms', detalhe: 'These are the food sources, and they’re usually not enough on their own' },
        { nome: 'Supplementation', detalhe: 'When recommended by whoever follows your care — the amount depends on your level' },
      ],
    },
  ],
  'Vitamina B12': [
    {
      grupo: 'In food',
      itens: [
        { nome: 'Animal sources', detalhe: 'Meat, eggs, milk and dairy are the only natural sources' },
      ],
    },
    {
      grupo: 'In absorption',
      itens: [
        { nome: 'Stomach medications', detalhe: 'Long-term use reduces absorption — something to bring to your appointment' },
        { nome: 'Supplementation', detalhe: 'When recommended by whoever follows your care, especially after bariatric surgery' },
      ],
    },
  ],
  'Ferritina': [
    {
      grupo: 'In food',
      itens: [
        { nome: 'Iron from animal sources', detalhe: 'Red meat, liver and shellfish are the best absorbed' },
        { nome: 'Vitamin C alongside', detalhe: 'Oranges, bell peppers and berries improve absorption of iron from plants' },
        { nome: 'Coffee and tea away from meals', detalhe: 'They get in the way of absorption when taken together' },
      ],
    },
  ],
} satisfies Record<string, JeitoDeAjudar[]>;

export const marcadores = {
  /* The only screen labels in this file, and therefore the only ones
     translated without caveat. WHICH markers fall into each category is
     not a language decision — it's clinical content, and it lives in
     logic/derive with the keys. */
  catMetabolico: 'Metabolic',
  catLipidico: 'Lipids',
  catFigadoRim: 'Liver & kidney',
  catTireoide: 'Thyroid',
  catVitaminas: 'Vitamins',

  nome: NOME,
  noMeio: NO_MEIO,
  sobre: SOBRE,
  influencias: INFLUENCIAS,
  ajudar: AJUDAR,
};
