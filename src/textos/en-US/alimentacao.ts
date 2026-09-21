/* ============================================================
   NUTRITION — what you eat, what you drink, what stays out · en-US

   ⚠️ Reasons live in ../pt-BR/alimentacao.ts. The rule for the file:
   NOTHING HERE IS A PRESCRIPTION. The readings point at what the count
   shows and suggest a next plate; none of them tells the person they're
   wrong, because the app doesn't know what their care team agreed on.
   ============================================================ */

export const alimentacao = {
  /* ⚠️ EVERY SENTENCE CARRIES ITS NUMBER. "Your breakfast comes in at 9 g"
     can be checked on the screen below; "you're doing well at breakfast"
     can't be checked anywhere. */
  conselhos: {
    fibraQ: 'How do I get more fiber into my day without getting sick of the food?',
    fibraTitulo: (media: number) => `Fiber: ${media} g a day`,
    fibraTexto: (dias: number, meta: number) =>
      `That’s your average across the last ${dias} logged days, against a goal of ${meta} g. Beans, oats, greens and fruit with the skin on are the shortest path — and fiber is what helps with the constipation, one of the most common side effects of the treatment.`,

    fibraBoaQ: 'What does fiber change in my treatment?',
    fibraBoaTitulo: (media: number) => `Fiber: ${media} g a day, above goal`,
    fibraBoaTexto: (dias: number, meta: number) =>
      `That’s your average across the last ${dias} logged days, against a goal of ${meta} g. It’s what usually holds off the constipation that comes with treatment — worth keeping as it is.`,

    /* ⚠️ THE WEAK MOMENT NAMES THE MOMENT, which is what the daily number
       doesn't say: a 6 g breakfast and a 40 g lunch add up to the same as
       two of 23, and only the first has an obvious next step. */
    momentoFracoQ: (momento: string) => `What can I eat at ${momento.toLowerCase()} to get more protein?`,
    momentoFracoTitulo: (momento: string, media: number) => `${momento}: ${media} g of protein, on average`,
    /* ⚠️ THE SOURCES RESPECT WHAT THE PERSON EATS. The sentence used to
       say "an egg, a yogurt or a piece of cheese" to everyone — advice a
       vegan can't follow, from the app that just asked whether they're
       vegan. */
    momentoFracoTexto: (melhor: string, mediaMelhor: number, fontes: string) =>
      `It’s your lightest moment for protein — ${melhor.toLowerCase()} comes in at ${mediaMelhor} g. Within what you eat, the ones that deliver the most protein per calorie are ${fontes}.`,

    momentoForteQ: 'Why does protein matter so much in this treatment?',
    momentoForteTitulo: (momento: string, media: number) => `${momento}: ${media} g of protein, on average`,
    momentoForteTexto: 'It’s the moment that holds up your daily goal the most. Repeating what already works there is easier than fixing another one.',

    /* ⚠️ THE SENTENCE COUNTS ON HOW MANY DAYS A VEGETABLE SHOWED UP IN THE
       LOG, not on how many days the person ate vegetables. Those are
       different things, and a prepared dish can have vegetables in it
       without the app knowing. */
    verdeQ: 'Which vegetables go with what I already eat?',
    verdeTitulo: (comVerde: number, total: number) =>
      `Vegetables on ${comVerde} of ${total} logged days`,
    verdeTexto: 'A salad or a vegetable at lunch fills the plate with few calories — it helps you finish the meal satisfied without spending the day, and it brings the fiber along.',
  },

  /* ⚠️ THE `id`s ARE DATA — 'agua', 'cafe', 'coco' is what gets stored in
     every hydration entry. Only the name and the container come from
     here, and the container is what the person would say out loud. */
  bebidas: {
    agua: 'Water',
    cafe: 'Coffee',
    cafeLeite: 'Coffee with milk',
    cha: 'Tea',
    coco: 'Coconut water',
    leite: 'Milk',
    suco: 'Juice',
    shake: 'Shake or whey',
    refri: 'Soda',
    alcool: 'Alcoholic drink',
    outro: 'Other',

    /* ⚠️ THE ALCOHOL CAVEAT STAYS ON SCREEN, not hidden inside the math.
       It's the only drink with a well-established negative fluid effect —
       it suppresses vasopressin and the body gives back more than it
       took. It can still be logged, because the diary exists to record
       what happened; it just doesn't count toward the total. */
    notaAlcool: 'It gets logged, but it doesn’t count toward the total: alcohol makes the body give back more fluid than it took in.',

    recipientes: {
      xicara: 'Cup',
      caneca: 'Mug',
      copo: 'Glass',
      garrafa: 'Bottle',
      caixinha: 'Carton',
      lata: 'Can',
      taca: 'Wine glass',
      longNeck: 'Longneck',
      coqueteleira: 'Shaker',
    },
  },

  /* ⚠️ THE SUBTITLE SAYS WHAT STAYS, not just what goes. "No meat,
     chicken or fish" on its own leaves the person wondering about eggs
     and cheese, which is exactly the question of someone choosing between
     vegetarian and vegan. */
  restricoes: {
    vegetariano: 'Vegetarian',
    vegetarianoSub: 'No meat, chicken or fish. Eggs and dairy stay.',
    vegano: 'Vegan',
    veganoSub: 'Nothing of animal origin: meat, fish, eggs, milk and cheese are out.',
    semLactose: 'Lactose-free',
    semLactoseSub: 'Milk, cheese and dairy are out — for intolerance or allergy.',
    semOvo: 'Egg-free',
    semOvoSub: 'Eggs and the dishes that use them are out.',
    semPeixe: 'No fish or shellfish',
    semPeixeSub: 'Fish, shrimp and shellfish are out.',
    semCarneVermelha: 'No red meat',
    semCarneVermelhaSub: 'Beef and pork are out. Chicken and fish stay.',
  },
};
