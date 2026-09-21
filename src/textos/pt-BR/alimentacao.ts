/* ============================================================
   A ALIMENTAÇÃO — o que se come, o que se bebe e o que fica de fora

   Três assuntos que andam juntos na mesma tela e na mesma decisão: a
   leitura da rotina de comida, as bebidas que contam como hidratação e as
   restrições que tiram coisas do prato.

   ⚠️ NENHUMA FRASE DAQUI É PRESCRIÇÃO. As leituras apontam o que a
   contagem mostra e sugerem um próximo prato; nenhuma diz à pessoa que
   ela está errada, porque o aplicativo não sabe o que a equipe dela
   combinou.
   ============================================================ */

export const alimentacao = {
  /* ============================================================
     O QUE DÁ PARA NOTAR NA ROTINA

     ⚠️ TODA FRASE TRAZ O NÚMERO JUNTO. "O seu café da manhã vem com 9 g"
     pode ser conferido na tela de baixo; "você está indo bem no café da
     manhã" não pode ser conferido de lugar nenhum. Elogio sem número é a
     forma mais rápida de um aplicativo soar como cartão de autoajuda.

     ⚠️ E A PERGUNTA DE CADA CARTÃO VAI EM PRIMEIRA PESSOA, como a pessoa
     perguntaria. O campo do companion recebe texto, e um título de seção
     colado ali leria como comando de máquina.
     ============================================================ */
  conselhos: {
    fibraQ: 'Como eu aumento a fibra do meu dia sem enjoar da comida?',
    fibraTitulo: (media: number) => `Fibra: ${media} g por dia`,
    /* ⚠️ A SEGUNDA METADE É O MOTIVO DE O CARTÃO SER O PRIMEIRO: prisão de
       ventre é dos efeitos colaterais mais comuns do tratamento, e a
       fibra é a alavanca de comida que existe para ela. */
    fibraTexto: (dias: number, meta: number) =>
      `É a sua média nos últimos ${dias} dias registrados, contra uma meta de ${meta} g. Feijão, aveia, folhas e frutas com casca são o caminho mais curto — e é a fibra que ajuda com o intestino preso, dos efeitos colaterais mais comuns do tratamento.`,

    fibraBoaQ: 'O que a fibra muda no meu tratamento?',
    fibraBoaTitulo: (media: number) => `Fibra: ${media} g por dia, acima da meta`,
    fibraBoaTexto: (dias: number, meta: number) =>
      `É a sua média nos últimos ${dias} dias registrados, contra uma meta de ${meta} g. É o que costuma segurar o intestino preso do tratamento — vale manter do jeito que está.`,

    /* ⚠️ O MOMENTO FRACO NOMEIA O MOMENTO, e é o que o número do dia não
       diz: um café da manhã de 6 g e um almoço de 40 g somam o mesmo que
       dois de 23, e só o primeiro tem um próximo passo óbvio. */
    momentoFracoQ: (momento: string) => `O que eu posso comer no ${momento.toLowerCase()} para ter mais proteína?`,
    momentoFracoTitulo: (momento: string, media: number) => `${momento}: ${media} g de proteína, na média`,
    /* ⚠️ AS FONTES RESPEITAM O QUE A PESSOA COME. A frase dizia "um ovo,
       um iogurte ou um pedaço de queijo" para todo mundo — conselho que
       um vegano não pode seguir, dito pelo aplicativo que acabou de
       perguntar se ele é vegano. */
    momentoFracoTexto: (melhor: string, mediaMelhor: number, fontes: string) =>
      `É o seu momento mais leve em proteína — o ${melhor.toLowerCase()} vem com ${mediaMelhor} g. Dentro do que você come, quem mais entrega proteína por caloria é ${fontes}.`,

    momentoForteQ: 'Por que a proteína importa tanto neste tratamento?',
    momentoForteTitulo: (momento: string, media: number) => `${momento}: ${media} g de proteína, na média`,
    momentoForteTexto: 'É o momento que mais sustenta a sua meta do dia. Repetir o que já funciona ali é mais fácil do que consertar outro.',

    /* ⚠️ A FRASE CONTA EM QUANTOS DIAS UMA VERDURA APARECEU NO REGISTRO,
       e não em quantos a pessoa comeu verdura. São coisas diferentes, e
       um prato pronto pode ter legume dentro sem o aplicativo saber. Por
       isso ela mostra a contagem e sugere, em vez de afirmar falta. */
    verdeQ: 'Que verduras e legumes combinam com o que eu já costumo comer?',
    verdeTitulo: (comVerde: number, total: number) =>
      `Verduras e legumes em ${comVerde} de ${total} dias registrados`,
    verdeTexto: 'Uma salada ou um legume no almoço enche o prato com pouca caloria — ajuda a chegar no fim da refeição satisfeita sem gastar o dia, e traz a fibra junto.',
  },

  /* ============================================================
     AS BEBIDAS

     ⚠️ OS `id` SÃO DADO — 'agua', 'cafe', 'coco' é o que fica gravado em
     cada registro de hidratação. Só o nome e o recipiente vêm daqui.

     ⚠️ E O RECIPIENTE É O QUE A PESSOA DIRIA EM VOZ ALTA. Ninguém toma um
     garrafão de café, e quem tomou uma xícara não sabe dizer de cabeça
     quantos mililitros foram. O atalho só ajuda se o nome dele for o da
     conversa.
     ============================================================ */
  bebidas: {
    agua: 'Água',
    cafe: 'Café',
    cafeLeite: 'Café com leite',
    cha: 'Chá',
    coco: 'Água de coco',
    leite: 'Leite',
    suco: 'Suco',
    shake: 'Shake ou whey',
    refri: 'Refrigerante',
    alcool: 'Bebida alcoólica',
    outro: 'Outro',

    /* ⚠️ A RESSALVA DO ÁLCOOL FICA NA TELA, e não escondida numa conta. É
       a única bebida com efeito líquido negativo bem estabelecido — ela
       suprime a vasopressina e o corpo devolve mais do que recebeu.
       Continua podendo ser registrada, porque o diário existe para
       registrar o que aconteceu; só não entra no total. */
    notaAlcool: 'Fica registrada, mas não entra no total: o álcool faz o corpo devolver mais líquido do que recebeu.',

    recipientes: {
      xicara: 'Xícara',
      caneca: 'Caneca',
      copo: 'Copo',
      garrafa: 'Garrafa',
      caixinha: 'Caixinha',
      lata: 'Lata',
      taca: 'Taça',
      longNeck: 'Long neck',
      coqueteleira: 'Coqueteleira',
    },
  },

  /* ============================================================
     O PRATO — os momentos, a medida e a leitura de um alimento
     ============================================================ */
  prato: {
    /* ⚠️ OS MOMENTOS SÃO CHAVE E RÓTULO AO MESMO TEMPO: o nome é o que
       fica gravado em cada refeição, e é também o que a tela mostra.
       Traduzir a lista NÃO quebra registro, porque a comparação é sempre
       contra o valor que o próprio aplicativo acabou de devolver — mas
       uma refeição antiga guardada com "Almoço" não casa com "Lunch", e
       por isso a tela cai no nome gravado quando não reconhece. */
    cafeDaManha: 'Café da manhã',
    almoco: 'Almoço',
    lanche: 'Lanche',
    jantar: 'Jantar',

    /* O recuo de quem não está na tabela: "2 porções". */
    porcoes: (qtd: number) => `${qtd} ${qtd === 1 ? 'porção' : 'porções'}`,

    /* ⚠️ A PROCEDÊNCIA SÓ APARECE QUANDO PRECISA SER DITA. Item de tabela
       não diz nada: é o caso normal, e anunciá-lo seria ruído em todas as
       linhas para avisar sobre nenhuma. */
    estimado: 'estimado pela foto',
    semConta: 'ainda não entra na conta',

    /* ⚠️ A LEITURA DE UM ALIMENTO NÃO PROÍBE NADA. "Não é proibido, mas
       ocupa bastante do dia" é o mais longe que ela vai, e é de propósito:
       o aplicativo não sabe o que a equipe combinou com a pessoa. */
    muitaProteinaPoucaCaloria: 'Muita proteína para pouca caloria. É o tipo de comida que o tratamento pede: ela cabe no prato que encolheu e ainda segura a massa magra.',
    boaFonte: 'Boa fonte de proteína, que é o que segura a massa magra enquanto o peso desce.',
    caloriaAlta: 'Caloria alta e pouca proteína. Não é proibido, mas ocupa bastante do dia e devolve pouco do que o tratamento precisa.',
    bastanteFibra: 'Bastante fibra. Ajuda com o intestino preso, que é dos efeitos colaterais mais comuns do tratamento.',
    quaseNaoPesa: 'Quase não pesa no dia. Bom para acompanhar o prato, mas a proteína tem que vir de outro lugar.',
    temFibra: 'Tem fibra, que ajuda com o intestino preso — dos efeitos colaterais mais comuns do tratamento.',
  },

  /* ============================================================
     DE ONDE VEIO O NÚMERO, dito para gente e não em sigla

     A tela dizia "Os valores vêm da TACO, linha 78", que é exato e não
     quer dizer nada para quem não sabe o que é TACO.
     ============================================================ */
  origem: {
    /* ⚠️ O QUE O ITEM DECLARA VALE MAIS QUE O RECUO. Um produto de rede
       traz a tabela da própria rede, e a frase de recuo — "a tabela da
       Unicamp não analisa este" — é verdade e é inútil: ela descreve o
       que a fonte NÃO é, quando o item sabe dizer o que ela é. */
    porCem: (fonte: string) => `${fonte}. São os valores por 100 g, e o peso de cada porção é o que a própria rede declara.`,
    porPorcaoSemPeso: (fonte: string) => `${fonte}. São os valores da porção que a rede vende, e não de 100 g — ela publica o rótulo do produto, sem dizer quanto ele pesa.`,
    porPorcaoComPeso: (fonte: string) => `${fonte}. São os valores da porção que a rede vende, e não de 100 g — com o peso que ela mesma declara.`,
    taco: 'Os números vêm da tabela brasileira de composição de alimentos, feita pela Unicamp, que mede em laboratório o que cada comida tem dentro.',
    somaTaco: 'Este é um prato montado: somamos ingrediente por ingrediente pela tabela da Unicamp, numa porção de restaurante. O seu pode vir maior ou menor.',
    rotulo: 'A tabela da Unicamp não analisa este, então os números vêm do rótulo de produtos comuns no mercado. De marca para marca eles mudam um pouco.',
  },

  /* ============================================================
     AS RESTRIÇÕES

     ⚠️ OS `id` SÃO DADO, e o que a restrição TIRA do prato é conteúdo e
     não idioma — fica em logic/restricoes, junto das chaves.

     ⚠️ O SUBTÍTULO DIZ O QUE CONTINUA, e não só o que sai. "Sem carne,
     frango ou peixe" sozinho deixa a pessoa sem saber do ovo e do queijo,
     que é justamente a dúvida de quem está escolhendo entre vegetariano e
     vegano.
     ============================================================ */
  restricoes: {
    vegetariano: 'Vegetariano',
    vegetarianoSub: 'Sem carne, frango ou peixe. Ovo e laticínio continuam.',
    vegano: 'Vegano',
    veganoSub: 'Nada de origem animal: carne, peixe, ovo, leite e queijo ficam fora.',
    semLactose: 'Sem lactose',
    semLactoseSub: 'Leite, queijo e derivados ficam fora — por intolerância ou alergia.',
    semOvo: 'Sem ovo',
    semOvoSub: 'Ovo e os pratos que levam ovo ficam fora.',
    semPeixe: 'Sem peixe e frutos do mar',
    semPeixeSub: 'Peixe, camarão e frutos do mar ficam fora.',
    semCarneVermelha: 'Sem carne vermelha',
    semCarneVermelhaSub: 'Boi e porco ficam fora. Frango e peixe continuam.',
  },
};
