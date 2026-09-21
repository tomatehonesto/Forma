/* ============================================================
   A ETAPA DO TRATAMENTO — as mensagens que abrem a Home

   Uma etapa é um momento que o tratamento atravessa e que explica o que a
   pessoa está sentindo: a dose que subiu, a primeira semana, a
   manutenção, o platô. Fora delas, quem fala é o ciclo da dose.

   ⚠️ QUEM FOR TRADUZIR: o chapéu é a etiqueta em caixa alta acima da
   manchete, e ele tem de caber em duas palavras — a Home o desenha numa
   linha só, e o que passa disso quebra o cartão.
   ============================================================ */

export const etapa = {
  /* ---------- 1. ainda não começou ---------- */
  antesChapeu: 'ANTES DE COMEÇAR',

  antesComDoseHead: 'Sua primeira aplicação ainda está por vir.',
  /* ⚠️ A MOLÉCULA, E NÃO A MARCA. Quem ainda não aplicou está lendo sobre
     o que vai sentir, e o que causa o efeito é a substância — escrever a
     marca aqui soaria a propaganda no único momento em que a pessoa ainda
     não tem experiência própria para contrapor. */
  antesComDoseBody: (molecula: string) =>
    `Os primeiros dias com ${molecula} costumam trazer menos fome e um enjoo leve. Registrar como você se sente desde já é o que dá base de comparação depois.`,
  antesComDoseQ: 'O que esperar no dia da aplicação?',

  antesSemDoseHead: 'Seu tratamento ainda não tem uma dose definida.',
  /* "Quando sua equipe definir" e não "quando você definir": dose é
     decisão de quem prescreve, e o aplicativo não empurra a pessoa a
     escolher um número que não é dela. */
  antesSemDoseBody: 'Quando sua equipe definir, ela cabe aqui — é a partir dela que montamos o ciclo da semana e os lembretes.',
  antesSemDoseQ: 'Como funciona o ciclo da medicação?',

  /* ---------- 2. a dose subiu ---------- */
  doseNovaChapeu: 'DOSE NOVA',
  doseNovaHead: (dose: string, unidade: string) =>
    `Você subiu para ${dose} ${unidade} nesta semana.`,
  /* ⚠️ A MOLDURA É A MESMA E O RECHEIO É DELA QUANDO EXISTE. Com registros
     suficientes, a frase conta o desenho do enjoo DELA; sem eles, conta o
     desenho que costuma acontecer. As duas dizem a mesma coisa, e só uma
     delas é sobre ela. */
  doseNovaBodyCom: (perto: string, longe: string) =>
    `Nos seus registros o enjoo fica em ${perto} nos dois primeiros dias depois de aplicar e cai para ${longe} a partir do terceiro. Cada degrau costuma repetir esse desenho.`,
  doseNovaBodySem: 'Cada degrau costuma trazer de volta, por alguns dias, o que já tinha passado — o enjoo é o mais comum. Tende a ceder à medida que o corpo se ajusta.',
  doseNovaQ: 'Por que sinto enjoo?',

  /* ---------- 3. a primeira semana ---------- */
  primeiraChapeu: 'PRIMEIRA SEMANA',
  primeiraHead: 'Esta é a sua primeira semana de tratamento.',
  /* "O corpo ainda está conhecendo o remédio" — a frase põe o corpo como
     sujeito de propósito: o que está acontecendo não é falha de quem usa
     nem efeito a ser suportado, é ajuste. */
  primeiraBody: 'O corpo ainda está conhecendo o remédio. Enjoo leve, menos fome e um pouco de cansaço são os relatos mais comuns nos primeiros dias, e costumam diminuir com as semanas.',
  primeiraQ: 'O que esperar no dia da aplicação?',

  /* ---------- 4. manutenção ---------- */
  manutencaoChapeu: 'MANUTENÇÃO',
  /* ⚠️ A PROCEDÊNCIA ENTRA NA FRASE, SEMPRE. "A faixa que a sua equipe
     definiu" só pode ser dito quando alguém anotou de quem veio — e a
     diferença entre as duas manchetes não é de tom, é de fato. */
  manutencaoHeadEquipe: 'Você está na faixa que a sua equipe definiu.',
  manutencaoHeadDela: 'Você está no peso que definiu como meta.',
  /* ⚠️ "MANTER É UM TRABALHO DIFERENTE DE PERDER" é o miolo da frase, e
     não enfeite: quem chega à meta costuma ouvir que terminou, e o que
     decide se o resultado fica é justamente o que vem depois. */
  manutencaoBody: (atual: string, alvo: string, por: string | null) =>
    `${atual}, contra ${alvo}${por ? ` anotados de ${por}` : ''} — e há pelo menos um mês nessa faixa. Manter é um trabalho diferente de perder, e é o que decide se o resultado fica.`,
  manutencaoQ: 'Como está minha evolução?',

  /* ---------- 5. platô ---------- */
  platoChapeu: 'PESO ESTÁVEL',
  platoHead: 'Seu peso está parado há cerca de um mês.',
  /* ⚠️⚠️ A EXPLICAÇÃO VEM ANTES DE QUALQUER SUGESTÃO, E A SUGESTÃO NÃO É
     "SE ESFORCE MAIS".

     Platô é fisiologia: o corpo gasta menos à medida que pesa menos, e a
     mesma dose passa a encontrar um corpo diferente. Quem lê isto está
     fazendo o mesmo de sempre e vendo a balança parar — a última coisa de
     que precisa é de um aplicativo sugerindo que o problema é ela.

     ⚠️ "É ASSUNTO DE CONSULTA, NÃO DE ESFORÇO" é a frase inteira em seis
     palavras, e ela é o motivo de o cartão não ter botão de ação. Trocar
     por qualquer coisa na linha de "veja o que você pode fazer" desfaz o
     cartão. Quem traduzir precisa saber disto antes de escolher o verbo.

     ⚠️ E QUANDO OS DOIS NÚMEROS ARREDONDAM IGUAL, NÃO SE DIZ DUAS VEZES.
     "78,2 kg há quatro semanas, 78,2 kg agora" é exato e parece defeito de
     código — e um número que parece defeito derruba a frase inteira
     junto. Mostrar os dois continua sendo a regra quando eles são dois. */
  platoBodyIgual: (media: string) =>
    `A média das suas pesagens está em ${media} desde então. Platô é parte esperada do tratamento: o corpo passa a gastar menos conforme o peso cai. É assunto de consulta, não de esforço.`,
  platoBodyDois: (antes: string, agora: string) =>
    `${antes} há quatro semanas, ${agora} agora. Platô é parte esperada do tratamento: o corpo passa a gastar menos conforme o peso cai. É assunto de consulta, não de esforço.`,
  platoQ: 'Como está minha evolução?',
};
