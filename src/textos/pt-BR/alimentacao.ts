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

  /* ============================================================
     A TELA DA ALIMENTAÇÃO

     ⚠️⚠️ A FRASE DA ENERGIA VEM COM `<b>` DENTRO, e isso não é enfeite: é
     o que permite a QUANTIDADE ficar em qualquer lugar da frase.

     O português diz "Ainda cabem 487 kcal no seu dia" — número no meio. O
     alemão diz "Es passen noch 487 kcal in deinen Tag" — outro meio. Se a
     tela montasse isso em três pedaços (antes, número, depois), cada
     idioma teria de caber na ordem do português, e o alemão não cabe.

     O marcador já existia, vindo dos insights, e `Rich` em ui/kit sabe
     lê-lo. Aqui ele passa a servir a um segundo propósito: soltar a
     ordem das palavras.

     ⚠️ E AS TRÊS FRASES SÃO TRÊS, e não uma com condicional. "Sobram X do
     que dá para contar" é o que se diz quando parte do prato ficou fora
     da conta — dizer "ainda cabem 500" para quem almoçou sem registrar
     seria o aplicativo autorizando um jantar que ele não tem como
     calcular.
     ============================================================ */
  tela: {
    titulo: 'Alimentação',
    linhaSemProteina: (alvo: number) => `Proteína: nada registrado · meta de ${alvo} g`,
    linhaComProteina: (prot: number, alvo: number, resto: string) => `Proteína: ${prot} de ${alvo} g · ${resto}`,
    faltamParaMeta: (falta: number) => `${falta} g para a meta`,
    metaAlcancada: 'meta alcançada',
    registrarRefeicao: 'Registrar uma refeição',

    /* ---------- a energia do dia ---------- */
    energiaTitulo: 'A energia de hoje',
    calorias: 'CALORIAS',
    deKcal: (meta: string) => `de ${meta} kcal`,

    sobramDoQueConta: (quanto: string) => `Sobram <b>${quanto} kcal</b> do que dá para contar.`,
    /* ⚠️ "ESCOLHA BEM COMO GASTAR" É O ÚNICO PEDIDO DESTA TELA, e ele cabe
       aqui porque é o assunto dela: num prato que encolheu, o que decide o
       tratamento não é o tamanho da sobra, é o que entra nela. */
    aindaCabem: (quanto: string) => `Ainda cabem <b>${quanto} kcal</b> no seu dia. Escolha bem como gastar.`,
    /* "Amanhã é outro dia" e não um alerta: passar da meta num dia não é
       falha, e a tela não tem nada a cobrar de um dia que já acabou. */
    passouAMeta: (quanto: string) => `Você passou a meta do dia em <b>${quanto} kcal</b>. Amanhã é outro dia.`,

    foraDaConta: (fora: number, total: number) =>
      `${fora} de ${total} ${total === 1 ? 'refeição não entra' : 'refeições não entram'} nesta conta: só o prato montado pela tabela tem rótulo conferido.`,

    carboidrato: 'Carboidrato',
    gordura: 'Gordura',
    fibra: 'Fibra',
    deG: (meta: number) => `de ${meta} g`,

    /* ---------- a semana ---------- */
    semanaTitulo: 'A proteína da semana',
    estaSemana: 'Esta semana',
    /* ⚠️ MÉDIA DOS DIAS REGISTRADOS, e o subtítulo diz isso. Um dia sem
       refeição anotada não é um dia de 0 g — é um dia que a pessoa não
       registrou, e dividir por sete transformaria esquecimento em queda
       de proteína. */
    nadaNaSemana: 'Nada registrado nos últimos sete dias',
    mediaDeDias: (dias: number) => `Média de ${dias} ${dias === 1 ? 'dia registrado' : 'dias registrados'}`,
    metaG: (alvo: number) => `Meta: ${alvo} g`,

    /* ---------- o que notamos ---------- */
    notamosTitulo: 'O que notamos',
    notamosNota: 'Da sua rotina das últimas duas semanas — e só do que você registrou.',
    continueAssim: 'CONTINUE ASSIM',
    umaIdeia: 'UMA IDEIA',
    conversarSobre: 'Conversar sobre isso',

    /* ---------- o diário ---------- */
    diarioTitulo: 'Diário de refeições',
    diarioNota: 'Toque numa refeição para ver, corrigir ou apagar.',
    /* ⚠️ A ORIGEM QUALIFICA O NÚMERO, como nos treinos: 30 g que você
       escreveu e 30 g que a foto estimou não se conferem do mesmo jeito. E
       a ausência de `fonte` quer dizer manual — a tela nunca mostra a
       ausência, mostra "por você". */
    porVoce: 'por você',
    pelaFoto: 'pela foto',
    /* "de proteína" escrito, e não só "g": num aplicativo que recusa
       contar caloria, um grama sem dono é justamente a dúvida que a tela
       existe para não deixar. */
    deProteina: 'de proteína',
    totalDoDia: (refeicoes: number, gramas: number) =>
      `${refeicoes} ${refeicoes === 1 ? 'refeição' : 'refeições'} · ${gramas} g de proteína`,
    diaVazioTitulo: 'Nenhuma refeição neste dia',
    diaVazioTexto: 'O que você registrar entra na proteína do dia.',

    /* ---------- os favoritos ---------- */
    favoritosTitulo: 'Pratos favoritos',
    favoritosLink: 'Cadastrar',
    favoritosNota: 'Monte o prato uma vez e ele entra no registro com um toque.',
    semPratoGuardado: 'Sem prato guardado — abre pela busca',
    favVazioTitulo: 'Nenhum prato favorito',
    favVazioTexto: 'Cadastre um prato que você repete e ele entra com um toque.',

    /* ---------- seus alimentos ---------- */
    seusAlimentos: 'Seus alimentos',
    dicionario: 'Dicionário de alimentos',
    dicionarioSub: 'Aprenda como cada comida pode te ajudar no tratamento',
    restricoesLinha: 'Restrições alimentares',
    semRestricao: 'Nenhuma restrição',
  },

  /* ============================================================
     A TELA DA HIDRATAÇÃO

     ⚠️ HIDRATAÇÃO, E NÃO ÁGUA. A tela passou a contar café, chá, leite e
     suco — o nome antigo virava promessa menor do que a tela cumpre, e
     mandava a pessoa registrar só o copo d'água.

     ⚠️ E O NOME DA BEBIDA CHEGA JÁ EM MINÚSCULA, por `comum.noMeio`. O
     `.toLowerCase()` que ficava no sítio de chamada é regra de idioma:
     no alemão ele apagaria a maiúscula de um substantivo.
     ============================================================ */
  telaAgua: {
    titulo: 'Hidratação',
    /* ⚠️ O QUE FALTA, e não só o quanto já foi: "faltam 2 L" é o que
       decide se vale encher a garrafa agora. */
    hojeNada: (meta: string) => `Hoje: nada registrado · meta de ${meta}`,
    hojeCom: (bebido: string, meta: string, resto: string) =>
      `Hoje: ${bebido} de ${meta} · ${resto}`,
    faltam: (quanto: string) => `faltam ${quanto}`,
    metaAlcancada: 'meta alcançada',
    registrar: 'Registrar o que você bebeu',

    /* ---------- a semana ---------- */
    suaSemana: 'A sua semana',
    nadaNaSemana: 'Nada registrado nos últimos sete dias',
    mediaDeDias: (dias: number) =>
      `Média de ${dias} ${dias === 1 ? 'dia registrado' : 'dias registrados'}`,
    meta: (quanto: string) => `Meta: ${quanto}`,

    /* ---------- o diário ----------

       ⚠️ A HORA NÃO É ENFEITE: é ela que identifica o registro para quem
       procura qual apagar. Entre dois copos de 0,25 L, o que diferencia
       um do outro é "às 7:18". */
    diario: 'Diário de bebidas',
    diarioNota: 'Café, chá, leite e suco contam: a meta é de líquido, e não de água pura. Apague o que tiver entrado errado.',
    apagarDoDia: 'Apagar a água deste dia?',
    apagarGole: (quanto: string, hora: string) => `Apagar ${quanto} das ${hora}?`,
    deBebida: (nome: string) => ` de ${nome}`,
    /* ⚠️ O DIA SEM HORA É DITO, e não maquiado: um registro de antes de o
       diário existir sabe o total e não sabe quando, e inventar "08:00"
       para preencher a linha seria escrever no diário da pessoa uma coisa
       que ela não escreveu. */
    totalSemHora: 'Total do dia, sem registro de horário',
    asHoras: (hora: string) => `às ${hora}`,
    foraDaContaSufixo: ' · fora da conta',
    registros: (quantos: number, total: string) =>
      `${quantos} ${quantos === 1 ? 'registro' : 'registros'} · ${total}`,
    maisForaDaConta: (quantos: number) => ` · ${quantos} fora da conta`,
    /* A água do prato entra no total do dia e não nesta lista: ela não
       foi bebida, foi comida, e tem diário próprio. Sem esta linha a capa
       diria 2,3 L e a soma dos goles daria 1,9. */
    daComida: (quanto: string) => `Mais ${quanto} da comida que você registrou`,
    vazioTitulo: 'Nada registrado neste dia',
    vazioTexto: 'O que você anotar entra no total do dia.',

    /* ---------- o lembrete ---------- */
    lembrete: 'Lembrete',
    alertas: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'alerta' : 'alertas'} de hidratação`,
    nenhumAlerta: 'Nenhum alerta de hidratação',
    tocaEm: (quando: string) => `Toca ${quando}`,
    umToquePorDia: 'Um toque por dia, na hora que você escolher',
  },

  /* ============================================================
     A FOLHA DE REGISTRAR UMA REFEIÇÃO

     Ela faz três trabalhos com o mesmo formulário — registrar, corrigir e
     guardar um favorito —, e o título, o subtítulo e o botão mudam nos
     três. É por isso que são nove chaves e não três.

     ⚠️ O MOMENTO SUGERIDO SAI DE `momentoDaHora`, e a tela tinha a sua
     própria régua: `hora < 10 ? 'Café da manhã' : hora < 15 ? 'Almoço'…`,
     com os nomes escritos aqui e com CORTES DIFERENTES dos do resto do
     aplicativo. Duas regras para a mesma pergunta, e a daqui era a que
     ficava em português.

     ⚠️ E O QUE FICA DE FORA DA SOMA É DITO EMBAIXO DELA. A linha do item
     já avisa, mas é a SOMA que vira o número do dia — e é nela que a
     ressalva precisa aparecer para ser lida.
     ============================================================ */
  telaMedirRefeicao: {
    /* ---------- os três títulos ---------- */
    favorito: 'Um prato favorito',
    favoritoSub: 'Monte o prato uma vez e ele fica a um toque',
    corrigir: 'Corrigir a refeição',
    corrigirSub: 'O que ficou errado no registro',
    oQueComeu: 'O que você comeu?',
    proteinaHoje: (hoje: number, alvo: number) => `${hoje} de ${alvo} g de proteína hoje`,

    /* ---------- o botão ---------- */
    digaOQueTinha: 'Diga o que tinha no prato',
    guardarNosFavoritos: 'Guardar nos favoritos',
    salvarCorrecao: 'Salvar a correção',
    registrarMomento: (momento: string) => `Registrar ${momento}`,

    /* ---------- o prato ---------- */
    quando: 'QUANDO',
    oQueTinhaNoPrato: 'O QUE TINHA NO PRATO',
    proteinaDestaRefeicao: 'Proteína desta refeição',
    gramas: (quanto: number) => `~${quanto} g`,
    semContaUm: (item: string) =>
      `${item} não entra nessa conta — ainda não tenho a proteína desse prato.`,
    semContaVarios: (quantos: number) =>
      `${quantos} itens não entram nessa conta — ainda não tenho a proteína deles.`,
    estimadoPelaFoto: 'Parte deste total foi estimada pela foto, sem tabela por trás.',

    /* ---------- os favoritos ---------- */
    pratosFavoritos: 'Pratos favoritos',
    pratosGuardados: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'prato guardado' : 'pratos guardados'}`,
    favoritoProteina: (quanto: number) => `~${quanto} g de proteína`,

    /* ---------- o compositor do prato (ui/comida) ---------- */
    buscaPlaceholder: 'Busque um alimento ou um prato',
    itemSub: (marca: string, medida: string, gramas: number) =>
      `${marca}${medida} · ~${gramas} g de proteína`,
    anotarEscrito: (texto: string) => `Anotar “${texto}”`,
    semProteinaAinda: 'Não tenho a proteína desse ainda',
    escanear: 'Escanear',
    lendoOPrato: 'Lendo o prato…',
    confiraALista: 'Confira a lista abaixo e ajuste o que precisar.',

    apagar: 'Apagar esta refeição',
  },
};
