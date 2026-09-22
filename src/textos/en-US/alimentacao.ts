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

  /* ---------- the plate: moments, measure and the read ---------- */
  prato: {
    /* ⚠️ THE MOMENTS ARE KEY AND LABEL AT ONCE: the name is what gets
       stored on each meal, and it's also what the screen shows. */
    cafeDaManha: 'Breakfast',
    almoco: 'Lunch',
    lanche: 'Snack',
    jantar: 'Dinner',

    porcoes: (qtd: number) => `${qtd} ${qtd === 1 ? 'serving' : 'servings'}`,

    estimado: 'estimated from the photo',
    semConta: 'not counted yet',

    /* ⚠️ THE READ OF A FOOD FORBIDS NOTHING. "It isn't off-limits, but it
       takes up a good part of the day" is as far as it goes, on purpose:
       the app doesn't know what the care team agreed with the person. */
    muitaProteinaPoucaCaloria: 'A lot of protein for few calories. It\u2019s the kind of food this treatment asks for: it fits the plate that shrank and still holds on to lean mass.',
    boaFonte: 'A good source of protein, which is what holds on to lean mass while the weight comes down.',
    caloriaAlta: 'High calories and little protein. It isn\u2019t off-limits, but it takes up a good part of the day and gives back little of what the treatment needs.',
    bastanteFibra: 'Plenty of fiber. It helps with constipation, one of the most common side effects of the treatment.',
    quaseNaoPesa: 'It barely weighs on the day. Good alongside the plate, but the protein has to come from somewhere else.',
    temFibra: 'It has fiber, which helps with constipation — one of the most common side effects of the treatment.',
  },

  /* ---------- where the number came from, said in plain words ---------- */
  origem: {
    porCem: (fonte: string) => `${fonte}. These are the per-100 g values, and the weight of each serving is what the chain itself declares.`,
    porPorcaoSemPeso: (fonte: string) => `${fonte}. These are the values for the serving the chain sells, not for 100 g — it publishes the product label without saying how much it weighs.`,
    porPorcaoComPeso: (fonte: string) => `${fonte}. These are the values for the serving the chain sells, not for 100 g — with the weight it declares itself.`,
    taco: 'The numbers come from the Brazilian food composition table, built by Unicamp, which measures in a lab what each food has in it.',
    somaTaco: 'This is a composed dish: we add it up ingredient by ingredient from the Unicamp table, at a restaurant portion. Yours may come out bigger or smaller.',
    rotulo: 'The Unicamp table doesn\u2019t analyze this one, so the numbers come from the labels of products common in stores. They shift a little from brand to brand.',
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

  /* ⚠️ The energy sentence carries `<b>` inside so the QUANTITY can sit
     anywhere in the sentence. See ../pt-BR/alimentacao. */
  tela: {
    titulo: 'Food',
    linhaSemProteina: (alvo: number) => `Protein: nothing logged · goal of ${alvo} g`,
    linhaComProteina: (prot: number, alvo: number, resto: string) => `Protein: ${prot} of ${alvo} g · ${resto}`,
    faltamParaMeta: (falta: number) => `${falta} g to the goal`,
    metaAlcancada: 'goal reached',
    registrarRefeicao: 'Log a meal',

    energiaTitulo: 'Today’s energy',
    calorias: 'CALORIES',
    deKcal: (meta: string) => `of ${meta} kcal`,

    sobramDoQueConta: (quanto: string) => `<b>${quanto} kcal</b> left of what can be counted.`,
    aindaCabem: (quanto: string) => `There’s still room for <b>${quanto} kcal</b> today. Choose well how to spend it.`,
    passouAMeta: (quanto: string) => `You went past today’s goal by <b>${quanto} kcal</b>. Tomorrow is another day.`,

    foraDaConta: (fora: number, total: number) =>
      `${fora} of ${total} ${total === 1 ? 'meal isn’t' : 'meals aren’t'} in this count: only a plate built from the table has a checked label.`,

    carboidrato: 'Carbs',
    gordura: 'Fat',
    fibra: 'Fiber',
    deG: (meta: number) => `of ${meta} g`,

    semanaTitulo: 'Protein this week',
    estaSemana: 'This week',
    nadaNaSemana: 'Nothing logged in the last seven days',
    mediaDeDias: (dias: number) => `Average of ${dias} logged ${dias === 1 ? 'day' : 'days'}`,
    metaG: (alvo: number) => `Goal: ${alvo} g`,

    notamosTitulo: 'What we noticed',
    notamosNota: 'From your routine over the last two weeks — and only from what you logged.',
    continueAssim: 'KEEP IT UP',
    umaIdeia: 'AN IDEA',
    conversarSobre: 'Talk about this',

    diarioTitulo: 'Meal diary',
    diarioNota: 'Tap a meal to see, fix or delete it.',
    porVoce: 'by you',
    pelaFoto: 'from the photo',
    deProteina: 'of protein',
    totalDoDia: (refeicoes: number, gramas: number) =>
      `${refeicoes} ${refeicoes === 1 ? 'meal' : 'meals'} · ${gramas} g of protein`,
    diaVazioTitulo: 'No meals on this day',
    diaVazioTexto: 'Whatever you log goes into the day’s protein.',

    favoritosTitulo: 'Favorite plates',
    favoritosLink: 'Add one',
    favoritosNota: 'Build the plate once and it logs with a single tap.',
    semPratoGuardado: 'No plate saved — opens through search',
    favVazioTitulo: 'No favorite plates',
    favVazioTexto: 'Save a plate you repeat and it logs with one tap.',

    seusAlimentos: 'Your foods',
    dicionario: 'Food dictionary',
    dicionarioSub: 'Learn how each food can help your treatment',
    restricoesLinha: 'Dietary restrictions',
    semRestricao: 'None',
  },

  telaAgua: {
    titulo: 'Hydration',
    hojeNada: (meta: string) => `Today: nothing logged · goal of ${meta}`,
    hojeCom: (bebido: string, meta: string, resto: string) =>
      `Today: ${bebido} of ${meta} · ${resto}`,
    faltam: (quanto: string) => `${quanto} to go`,
    metaAlcancada: 'goal reached',
    registrar: 'Log what you drank',

    suaSemana: 'Your week',
    nadaNaSemana: 'Nothing logged in the last seven days',
    mediaDeDias: (dias: number) =>
      `Average of ${dias} ${dias === 1 ? 'logged day' : 'logged days'}`,
    meta: (quanto: string) => `Goal: ${quanto}`,

    diario: 'Drinks diary',
    diarioNota: 'Coffee, tea, milk and juice count: the goal is fluid, not plain water. Delete anything that went in wrong.',
    apagarDoDia: 'Delete this day’s water?',
    apagarGole: (quanto: string, hora: string) => `Delete ${quanto} from ${hora}?`,
    deBebida: (nome: string) => ` of ${nome}`,
    totalSemHora: 'Day total, with no time logged',
    asHoras: (hora: string) => `at ${hora}`,
    foraDaContaSufixo: ' · not counted',
    registros: (quantos: number, total: string) =>
      `${quantos} ${quantos === 1 ? 'entry' : 'entries'} · ${total}`,
    maisForaDaConta: (quantos: number) => ` · ${quantos} not counted`,
    daComida: (quanto: string) => `Plus ${quanto} from the food you logged`,
    vazioTitulo: 'Nothing logged on this day',
    vazioTexto: 'Whatever you note goes into the day’s total.',

    lembrete: 'Reminder',
    alertas: (quantos: number) =>
      `${quantos} hydration ${quantos === 1 ? 'reminder' : 'reminders'}`,
    nenhumAlerta: 'No hydration reminder',
    tocaEm: (quando: string) => `Rings ${quando}`,
    umToquePorDia: 'One nudge a day, at the time you choose',
  },

  telaMedirRefeicao: {
    favorito: 'A favorite plate',
    favoritoSub: 'Build the plate once and it stays one tap away',
    corrigir: 'Fix the meal',
    corrigirSub: 'What went wrong in the entry',
    oQueComeu: 'What did you eat?',
    proteinaHoje: (hoje: number, alvo: number) => `${hoje} of ${alvo} g of protein today`,

    digaOQueTinha: 'Say what was on the plate',
    guardarNosFavoritos: 'Save to favorites',
    salvarCorrecao: 'Save the fix',
    registrarMomento: (momento: string) => `Log ${momento}`,

    quando: 'WHEN',
    oQueTinhaNoPrato: 'WHAT WAS ON THE PLATE',
    proteinaDestaRefeicao: 'Protein in this meal',
    gramas: (quanto: number) => `~${quanto} g`,
    semContaUm: (item: string) =>
      `${item} doesn’t go into this count — I don’t have the protein for that dish yet.`,
    semContaVarios: (quantos: number) =>
      `${quantos} items don’t go into this count — I don’t have their protein yet.`,
    estimadoPelaFoto: 'Part of this total was estimated from the photo, with no table behind it.',

    pratosFavoritos: 'Favorite plates',
    pratosGuardados: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'plate saved' : 'plates saved'}`,
    favoritoProteina: (quanto: number) => `~${quanto} g of protein`,

    /* ---------- o compositor do prato (ui/comida) ---------- */
    buscaPlaceholder: 'Search for a food or a plate',
    itemSub: (marca: string, medida: string, gramas: number) =>
      `${marca}${medida} · ~${gramas} g of protein`,
    anotarEscrito: (texto: string) => `Note down “${texto}”`,
    semProteinaAinda: 'I don’t have the protein for that one yet',
    escanear: 'Scan',
    lendoOPrato: 'Reading the plate…',
    confiraALista: 'Check the list below and adjust what you need.',

    apagar: 'Delete this meal',
  },

  telaAlimento: {
    titulo: 'Food',
    naoEncontrado: 'I could not find this food.',

    destaque: {
      'proteína': 'High in protein',
      'fibra': 'High in fiber',
      'vitamina C': 'High in vitamin C',
      'vitamina A': 'High in vitamin A',
      'cálcio': 'High in calcium',
      'ferro': 'High in iron',
      'magnésio': 'High in magnesium',
      'zinco': 'High in zinc',
      'fósforo': 'High in phosphorus',
      'niacina': 'High in niacin',
      'tiamina': 'High in thiamine',
      'riboflavina': 'High in riboflavin',
    },
    porcentoDoDia: (pct: number) => `${pct}% of what a person needs in a day`,

    porcaoDe: (medida: string) => `Portion: ${medida}`,
    porcaoDe100: 'Portion of 100 g',
    valoresDe: (medida: string) => `Values for ${medida}`,
    valoresPor100: 'Values per 100 g',

    proteina: 'Protein',
    carboidrato: 'Carbs',
    gordura: 'Fat',

    proteinaEm: (medida: string) => `Protein in ${medida}`,
    fibraEm: (medida: string) => `Fiber in ${medida}`,
    fibraPor100: 'Fiber per 100 g',
    naoMedida: 'not measured',
    pesaPertoDe: (medida: string, peso: string) => `${medida} weighs about ${peso}.`,

    registrarComIsto: 'Log a meal with this',
  },
};
