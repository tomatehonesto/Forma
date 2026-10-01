/* ============================================================
   AS DESCOBERTAS — o cartão da Home que não é o ciclo

   Três tipos dividem o mesmo lugar, e o chapéu é o que diz qual é qual:

     · o ACHADO      um cruzamento dos registros dela, já escrito em
                     textos/pt-BR/cruzamentos — aqui só o botão
     · a ANTECIPAÇÃO o que vem amanhã, e por quê
     · o CONVITE     o que o aplicativo ainda não sabe sobre ela

   ⚠️ A ANTECIPAÇÃO SEMPRE DIZ QUE PASSA. "A fome tende a apertar hoje" é
   um aviso, e aviso sem prazo vira ameaça: as três terminam dizendo o que
   acontece depois — "passa sozinho quando você aplicar", "são as 48 h de
   cada ciclo, não o tratamento inteiro".

   ⚠️ E O CONVITE NÃO COBRA. "Você ainda não disse aonde quer chegar" é a
   ausência dita como possibilidade, e não como falta; "você não criou
   nenhuma meta" seria a mesma frase com a régua virada para a pessoa.
   ============================================================ */

export const descobertas = {
  /* O botão do achado. O texto dele mora em cruzamentos. */
  verDescoberta: 'Ver a descoberta',

  /* ---------- o que vem ---------- */
  chapeuCruzamento: 'DESCOBERTA',
  chapeuAntecipacao: 'O QUE VEM',

  fomeHoje: 'A fome tende a apertar hoje',
  fomeAmanha: 'A fome tende a apertar amanhã',
  fomeEmDias: (dias: number) => `A fome tende a apertar em ${dias} dias`,
  /* A molécula em minúscula porque é substância, e não marca. */
  fomeTexto: (molecula: string) =>
    `É quando o nível da ${molecula} chega ao ponto mais baixo do ciclo, pouco antes da próxima aplicação. Passa sozinho quando você aplicar.`,
  fomeCta: 'Ver o ciclo',

  aguaTitulo: 'Amanhã costuma ser o seu dia mais seco',
  /* O `dia` chega com preposição — "às quartas" —, e vem de cruzamentos. */
  aguaTexto: (dele: string, dia: string, outros: string) =>
    `Nos seus registros a hidratação cai para ${dele} ${dia}, contra ${outros} nos outros dias. Saber disso na véspera é meio caminho.`,
  aguaCta: 'Ver a hidratação',

  enjooTitulo: 'Se o enjoo aparecer agora, ele tem hora para passar',
  enjooTexto: (perto: string, longe: string) =>
    `Nos seus registros ele fica em ${perto} nos dois primeiros dias depois da aplicação e cai para ${longe} a partir do terceiro. São as 48 h de cada ciclo, não o tratamento inteiro.`,
  enjooCta: 'Ver os sintomas',

  /* ---------- os convites ---------- */
  chapeuConvite: 'UM CONVITE',

  metaTitulo: 'Você ainda não disse aonde quer chegar',
  metaTexto: 'Uma meta sua — caber numa calça, voltar à praia, largar um hábito. Guardamos para você, e quem marca quando chega é você.',
  metaCta: 'Criar uma meta',

  medidasTitulo: 'A balança conta só uma parte',
  medidasTexto: 'A fita métrica conta a outra: cintura e quadril mudam quando o peso empaca, e é aí que ela mostra que algo está acontecendo.',
  medidasCta: 'Registrar medidas',

  refeicaoTitulo: 'A proteína do dia pode se contar sozinha',
  refeicaoTexto: 'Registrando o que você come, a conta do dia sai pronta — sem tabela, sem somar nada de cabeça.',
  refeicaoCta: 'Registrar uma refeição',

  examesTitulo: 'Os seus exames cabem aqui',
  examesTexto: 'Com eles guardados, dá para ver a linha de cada marcador ao longo do tratamento — e levar tudo organizado para a consulta.',
  examesCta: 'Guardar um exame',

  clinicaTitulo: 'A sua clínica pode ficar deste lado',
  clinicaTexto: 'Com o código que ela te deu, a sua equipe aparece aqui e as orientações dela param de se perder no meio das mensagens.',
  clinicaCta: 'Usar o código',
  /* ---------- a leitura da semana (01/10/2026) ----------
     O card "Sua semana" na Home, a tela /leitura e o aceite próprio. Ver
     docs/superpowers/specs/2026-10-01-leitura-da-semana-design.md. A voz é
     a da Morphi Intelligence ("eu"), e o aceite diz o que sai, o que fica
     e o que a leitura é — coincidência, e não causa. */
  semana: {
    chapeu: 'SUA SEMANA',
    /* os slides do carrossel da Home (app/(tabs)/index): curtos de propósito */
    slideProntoTitulo: 'Seu resumo da semana está pronto',
    slideProntoTexto: 'Como foi, uma descoberta e um teste para a próxima.',
    slideProntoCta: 'Ver o resumo',
    slideConviteTitulo: 'Quer um resumo da sua semana?',
    slideConviteTexto: 'Toda segunda eu leio seus registros e te conto o que descobri.',
    titulo: 'Sua semana',
    pedirSim: 'Quero',
    poucoTitulo: 'Na segunda, eu leio a sua semana',
    poucoTexto: 'Faça o check-in em pelo menos 3 dias, ou se pese uma vez, e eu tenho o que ler.',
    /* a semana teve o mínimo, mas nenhuma descoberta se sustentou (app/leitura) */
    semDescobertaTitulo: 'Desta vez não achei uma descoberta',
    semDescobertaTexto: 'Os seus registros da semana não mostraram um padrão que eu possa afirmar. Na próxima segunda eu leio de novo.',
    lendo: 'Lendo a sua semana…',
    parteSemana: 'A semana',
    parteDescoberta: 'Uma descoberta',
    parteTeste: 'Para testar',
    parteTesteAgora: 'Para testar nesta semana',
    lerInteira: 'Ler inteira',
    conversar: 'Conversar sobre isso',
    telaTitulo: 'Resumo da semana',
    desligar: 'Desligar o resumo da semana',
    desligada: 'Desliguei. Daqui a 4 semanas eu pergunto de novo.',
    /* a tela do resumo (app/leitura), refeita em 01/10/2026 */
    legendaCheckin: 'check-in',
    legendaTreino: 'treino',
    legendaPesagem: 'pesagem',
    nivelForte: 'Padrão forte',
    nivelComeco: 'Começo de padrão',
    nivelRetrato: 'Retrato da jornada',
    anteriores: 'Semanas anteriores',
    erro: 'Não consegui ler a sua semana agora. Confira a conexão e tente de novo.',
    erroLimite: 'Você chegou ao limite de leituras com IA de hoje. Amanhã eu leio a sua semana.',
    erroConta: 'Entre na sua conta para eu ler a sua semana.',
    tentarDeNovo: 'Tentar de novo',
    fazerCheckin: 'Fazer o check-in',
    desligadoTitulo: 'O resumo da semana está desligado',
    desligadoTexto: 'Ligado, toda segunda eu leio os seus registros e te conto o que descobri.',
    ligar: 'Ligar o resumo da semana',
    indisponivel: 'O resumo da semana não está disponível agora.',
  },
};
