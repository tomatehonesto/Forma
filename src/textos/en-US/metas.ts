/* ============================================================
   GOALS — the numbers the app tracks and the ones only you know · en-US

   ⚠️ Reasons live in ../pt-BR/metas.ts. Three catalogs live here:

     · alvos        the four profile numbers — protein, water, movement
                    and the weight goal
     · indicadores  what the app can COUNT
     · pessoais     what only the person can say they reached

   ⚠️ THE PERSONAL ONES ARE CATEGORIES, NOT READY-MADE SENTENCES. The list
   says WHAT KIND of thing it is; the second-tap question is what makes it
   theirs. Both pieces have to survive: the short name for the list and
   the question that forces the specific.

   ⚠️ AND THE PREFIX IS WHAT CLOSES THE SENTENCE. The person writes a
   fragment — "volleyball", "the wedding dress" — and `monta` returns the
   whole sentence. What can't happen is the sentence coming out half-made
   or repeating the verb.

   ⚠️ NO CATEGORY ASSUMES FAMILY, BODY OR MONEY. A goal that doesn't fit
   the life of whoever is reading is worse than an empty field.

   ⚠️ ONE THING ENGLISH GETS FOR FREE: the `femininas` flag on each
   indicator exists for Portuguese participle agreement. Here it changes
   nothing — "logged" is "logged" — but the field stays, because the shape
   of the catalog is the contract, and a future language may need it.
   ============================================================ */

export const metas = {
  alvos: {
    /* ⚠️ IT WAS THE SAME SENTENCE WRITTEN THREE TIMES, once per daily
       number. What it does: say what the person can't know by looking at
       the sheet. Lowering the protein goal makes the team's protocol mark
       it met without anything having changed on the plate. It doesn't
       block and it doesn't judge. */
    ressalvaDoProtocolo: 'This week’s protocol counts the days you hit this number. Changing it here also changes what your care team’s protocol counts as met.',

    prot: {
      nome: 'Protein per day',
      onde: 'Tracked in nutrition and in the protocol',
      origem: 'Calculated from your weight, at 1.2 g per kilo',
      un: 'g',
      escreve: (gramas: number) => String(gramas),
    },
    waterMl: {
      nome: 'Hydration per day',
      origem: 'Calculated from your weight, your age and your activity level',
      onde: 'Tracked in hydration and in the protocol',
    },
    exercMin: {
      nome: 'Exercise per day',
      onde: 'It’s the dashed line of the week, in exercise',
      /* ⚠️ THIS ONE ISN'T CALCULATED, and it would be easy to write that
         it is so the sentence matches the other two. It's 60 minutes for
         everyone, and onboarding asks nothing that would change it. */
      origem: 'The app’s default, the same for everyone',
      un: 'min',
      escreve: (minutos: number) => String(minutos),
    },
    peso: {
      /* ⚠️ THE SAME NAME AS IN ONBOARDING. The question there is "what's
         your weight goal?", and this field used to be called "reference
         weight" — two names for one number. */
      nome: 'Weight goal',
      onde: 'Measures the whole trip, in the Journey',
      origem: 'You chose it during onboarding',
    },
  },

  /* ⚠️ THE NAME IN THE LIST IS GENERIC ON PURPOSE: "Hours of sleep", not
     "Sleep 7h+". Choosing the thing and choosing the number are two
     decisions, and the second one is personal.

     ⚠️ `origem` SAYS WHERE THE NUMBER COMES FROM, and it's what decides
     whether the goal is worth creating: someone who never logs meals
     needs to see, before choosing, that a protein goal will sit at
     zero. */
  indicadores: {
    sono: {
      nome: 'Hours of sleep',
      pergunta: 'How many hours a night?',
      origem: 'From the sleep you answer at check-in',
      nomes: ['night', 'nights'] as [string, string],
      femininas: true,
      un: 'h',
      escreve: (horas: number) => `${horas} h`,
      rotulo: (horas: number) => `Sleep ${horas}h a night`,
      conta: (horas: number) => `Nights with ${horas}h or more`,
    },
    energia: {
      nome: 'Energy for the day',
      pergunta: 'From which level up does it count?',
      origem: 'From the energy you answer at check-in',
      nomes: ['day', 'days'] as [string, string],
      femininas: false,
      un: 'of 5',
      escreve: (nivel: number) => `${nivel} of 5`,
      rotulo: (nivel: number) => `Energy ${nivel} or higher`,
      conta: (nivel: number) => `Days with energy ${nivel} or higher, of 1 to 5`,
    },
    humor: {
      nome: 'Mood for the day',
      pergunta: 'From which level up does it count?',
      origem: 'From the mood you answer at check-in',
      nomes: ['day', 'days'] as [string, string],
      femininas: false,
      un: 'of 5',
      escreve: (nivel: number) => `${nivel} of 5`,
      rotulo: (nivel: number) => `Mood ${nivel} or higher`,
      conta: (nivel: number) => `Days with mood ${nivel} or higher, of 1 to 5`,
    },
    /* ⚠️ NAUSEA AND HUNGER COUNT THE OTHER WAY AROUND: the win is the day
       the number came in LOW, which is why the question is "up to which
       level does it still count as good". Swapping it for "from which
       level up" inverts the whole goal with nothing to catch it. */
    enjoo: {
      nome: 'Nausea',
      pergunta: 'Up to which level does it still count as good?',
      origem: 'From the nausea you mark at check-in',
      nomes: ['day', 'days'] as [string, string],
      femininas: false,
      un: 'of 5',
      escreve: (nivel: number) => `${nivel} of 5`,
      rotulo: (nivel: number) => `Nausea ${nivel} or lower`,
      conta: (nivel: number) => `Days with nausea ${nivel} or lower, of 1 to 5`,
    },
    fome: {
      nome: 'Hunger',
      pergunta: 'Up to which level does it still count as good?',
      origem: 'From the hunger you answer at check-in',
      nomes: ['day', 'days'] as [string, string],
      femininas: false,
      un: 'of 5',
      escreve: (nivel: number) => `${nivel} of 5`,
      rotulo: (nivel: number) => `Hunger ${nivel} or lower`,
      conta: (nivel: number) => `Days with hunger ${nivel} or lower, of 1 to 5`,
    },
    prot: {
      nome: 'Protein per day',
      pergunta: 'How many grams a day?',
      origem: 'From the meals you log',
      nomes: ['day', 'days'] as [string, string],
      femininas: false,
      escreve: (gramas: number) => `${gramas} g`,
      rotulo: (gramas: number) => `Eat ${gramas} g of protein`,
      conta: (gramas: number) => `Days with ${gramas} g or more`,
    },
    /* The three below receive the amount ALREADY WRITTEN — "2.5 L", "85
       fl oz" — because the unit is a logic/medidas decision and not a
       language one. */
    agua: {
      nome: 'Hydration per day',
      pergunta: 'How much a day?',
      origem: 'From what you log in hydration',
      nomes: ['day', 'days'] as [string, string],
      femininas: false,
      rotulo: (quanto: string) => `Drink ${quanto} of water`,
      conta: (quanto: string) => `Days with ${quanto} or more`,
    },
    exerc: {
      nome: 'Minutes of movement',
      pergunta: 'How many minutes a day?',
      origem: 'From the workouts you log',
      nomes: ['day', 'days'] as [string, string],
      femininas: false,
      escreve: (minutos: number) => `${minutos} min`,
      rotulo: (minutos: number) => `Move ${minutos} min a day`,
      conta: (minutos: number) => `Days with ${minutos} min or more`,
    },
  },

  /* ⚠️ THE TENSE WAS CHOOSING THE PERSON'S LIFE, and it was fixed. "Get
     back to playing" assumes they played; someone who wants to start
     swimming at forty didn't fit the app's only sport category.

     The only one that still assumes is the place — and it SAYS SO in its
     own name, which is the difference between assuming and asking.

     ⚠️ THE EXAMPLES GO IN THE QUESTION, NEVER IN THE FIELD HINT. An
     example inside a field is a suggestion: whoever reads one before
     thinking of their own goal writes the example's goal. */
  pessoais: {
    roupa: {
      nome: 'A piece of clothing',
      pergunta: 'What do you want to wear? Something at the back of the closet, something you saw in a window — whatever comes to mind.',
      dica: 'Type the piece of clothing',
      monta: (r: string) => `Wear ${r}`,
    },
    esporte: {
      nome: 'A sport',
      pergunta: 'Which sport do you want to play? Counts either way — whether you played once or never tried.',
      dica: 'Type the sport',
      monta: (r: string) => `Play ${r}`,
    },
    folego: {
      /* "Something day-to-day", not "without losing your breath": the
         barrier might be a knee, might be pain, might be embarrassment —
         and naming the wrong one leaves out whoever has the other. */
      nome: 'Something day-to-day',
      pergunta: 'What do you want to be able to do without tiring out? Climb the stairs at home, carry the groceries, walk to the corner without stopping halfway.',
      dica: 'Type the activity',
      monta: (r: string) => `Be able to ${r}`,
    },
    sentir: {
      nome: 'How I feel',
      pergunta: 'How do you want to feel? With more energy, more at ease in your own body — whichever way makes sense to you.',
      dica: 'Type how you want to feel',
      monta: (r: string) => `Feel ${r}`,
    },
    foto: {
      nome: 'A photo',
      pergunta: 'What photo do you want to have? One at the beach, one with someone you love, or just one where you recognize yourself.',
      dica: 'Type the photo',
      monta: (r: string) => `Take ${r}`,
    },
    lugar: {
      /* ⚠️ THE NAME STATES THE ASSUMPTION, and it's the only one left.
         Here the assumption is the subject: it isn't about managing, it's
         about going back. Whoever wants somewhere new has "Another
         goal". */
      nome: 'A place you stopped going',
      pergunta: 'Where do you want to go back to? The beach, the pool, someone’s party — the place you’ve been skipping.',
      dica: 'Type the place',
      monta: (r: string) => `Go back to ${r}`,
    },
    comecar: {
      nome: 'A habit to build',
      pergunta: 'What do you want to start doing? Walking in the morning, cooking on Sundays, going to bed earlier.',
      dica: 'Type the habit',
      monta: (r: string) => `Start ${r}`,
    },
    largar: {
      nome: 'A habit to drop',
      pergunta: 'What do you want to stop doing? Eating standing up, snacking in the middle of the night — whatever it is for you.',
      dica: 'Type the habit',
      monta: (r: string) => `Stop ${r}`,
    },
    livre: {
      nome: 'Another goal',
      pergunta: 'What do you want to reach? Write it your way — we keep it exactly as you write it.',
      dica: 'Type your goal',
      monta: (r: string) => r,
    },
  },

  /* ⚠️ RELATIVE, AND GENUINELY OPTIONAL. Whoever puts a deadline on a
     treatment goal thinks in "about three months", not December 14. And
     the first option is NO deadline, preselected. */
  prazos: {
    nao: 'No deadline',
    umMes: 'In 1 month',
    tresMeses: 'In 3 months',
    seisMeses: 'In 6 months',
    umAno: 'In 1 year',
  },

  jornada: {
    /* ⚠️ THE COUNT, NOT THE PERCENTAGE AGAIN. The row said "85%" on the
       right and "85% of recent nights" below — the same number twice.
       "11 of 13 nights" answers how many nights we're talking about. */
    /* ⚠️ O PARÂMETRO DE CONCORDÂNCIA NÃO É USADO AQUI, E NÃO SAI DA
       ASSINATURA. Em inglês "logged" não concorda com nada, e apagar o
       parâmetro quebraria o contrato de forma que o tsc confere contra o
       português — que precisa dele para escrever "registradas" ou
       "registrados". Um sublinhado no nome diz que a omissão é decisão e
       não esquecimento. */
    contagem: (quantas: number, de: number, nome: string, _femininas: boolean) =>
      `${quantas} of ${de} ${nome} logged`,
    semRegistros: (plural: string) => `no ${plural} logged yet`,

    conquistadaEm: (data: string) => `reached on ${data}`,
    /* ⚠️ THE DEADLINE IS A FACT, NOT A DEMAND. Past and not reached, the
       row says it passed and stops there — no red, no "overdue". In a
       treatment that runs for months, a date that slipped is the most
       ordinary thing in the world, and the goal still stands. */
    ate: (data: string) => `by ${data}`,
    oPrazoEra: (data: string) => `the deadline was ${data}`,
    vocemarca: 'you mark it when you get there',
  },

  /* ⚠️ The two goal screens lived in the code until German gave them away:
     the list opened with Portuguese headers next to German target names.
     See ../pt-BR/metas for the reasons. */
  tela: {
    /* ---------- the list ---------- */
    titulo: 'Goals',
    progresso: (perdido: string, total: string, alvo: string) => `${perdido} of ${total} toward ${alvo}`,
    novaMeta: 'New goal',

    numerosTitulo: 'Your daily numbers',
    numerosNota: 'It’s what the water, food and movement screens measure against, and what the protocol tallies.',

    /* ⚠️ "Via", not "from": the number came THROUGH the team — said in a
       visit and written down afterwards. "From your team" sounds like
       ownership, as if the line belonged to the clinic and not to her. */
    equipeMira: (valor: string) => `Your team aims for ${valor}`,
    alterada: 'Changed by you',
    viaEquipe: 'Via your team',

    suasTitulo: 'Your own goals',
    suasNota: 'The measured ones we follow through your logs. Yours, you check off.',

    vazioTitulo: 'No goals yet',
    vazioTexto: 'Write down something you want to reach. It stays here until it happens.',

    /* ---------- the sheet for one of the four numbers ---------- */
    definidoPelaEquipe: 'Set by your team',
    novoValor: 'New value',
    salvar: 'Save',

    hoje: (valor: string) => `Today: ${valor}`,
    origemSua: 'A number of your own',
    origemDaEquipe: (por: string, quando: string) => `Set by ${por}, noted on ${quando}`,
    origemVoceEm: (quando: string) => `You set this number on ${quando}`,
    origemEmuda: (origem: string, muda: string) => `${origem}. ${muda}`,
    mudaPeso: 'It’s the finish line agreed with your team, and moving it changes the range on the Journey and on your progress — without erasing anything already logged.',
    mudaOutros: 'The change counts from now on: the days already logged keep meaning what they meant, and what changes is what they get compared against.',

    travadoTitulo: (por: string) => `${por} set this one`,
    travadoTexto: 'This number is part of your treatment, which is why it isn’t changed here. If it no longer fits — different guidance, a restriction that came up, a new team —, remove the note in the Care area and it becomes yours again.',
    divergeTitulo: 'This isn’t your team’s number',
    divergeTexto: (por: string, dela: string, nosso: string) =>
      `${por} set ${dela}, and we’re going by ${nosso}. We keep both: you can go back to theirs in the Care area, or take the difference to your next visit.`,
    recomendadoTitulo: 'This is the recommended value',

    verAnotacao: 'View your team’s note',
    anotacaoSub: (por: string, valor: string) => `${por} · ${valor}`,

    /* ---------- the sheet for a new goal ---------- */
    novaSub: 'Something of your own. We’ll keep it here, and you’re the one who checks it off',
    escolhaOTipo: 'Pick the kind',
    escrevaDoSeuJeito: 'Write it your way',

    guardarMeta: 'Save goal',
    respondaParaGuardar: 'Answer to save',
    prazoRotulo: 'Deadline (optional)',

    /* ⚠️ The quotation marks belong to the language, which is why the whole
       sentence is a function here. */
    vaiAparecer: (frase: string, ate: string) => `It’ll show up like this: “${frase}”${ate}.`,
    vaiAparecerAte: (data: string) => `, by ${data}`,
    aindaNaoAteMarcar: 'It stays at ’not yet’ until you check it off. The day it happens, we keep the date with it.',

    /* ---------- the sheet for one goal from the list ---------- */
    metaTitulo: 'Goal',
    naoEncontrei: 'I couldn’t find this goal',
    apagadaEmOutraTela: 'It may have been deleted on another screen.',
    subPessoal: 'Your own goal, checked off by you',
    subMedida: 'Goal measured from your check-ins',

    conquistada: 'Reached',
    aindaNao: 'Not yet',
    consegui: 'I did it',
    aindaNaoConsegui: 'Not yet after all',
    apagar: 'Delete',

    contamosPorVoce: 'This one we count for you',
    contamosTexto: 'It comes from your check-ins over the last fourteen days, and only from the days you answered. There’s no way to mark it by hand — and that’s what makes the number mean something.',
  },
};
