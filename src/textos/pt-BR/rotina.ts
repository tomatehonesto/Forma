/* ============================================================
   A ROTINA — o protocolo, as sugestões, o preparo e o que passou

   O que sobrou do derive.ts depois dos outros catálogos: as perguntas que
   o companion oferece, os empurrões do dia, o protocolo da semana, as
   semanas anteriores, o preparo da consulta e o resumo de um período.
   ============================================================ */

export const rotina = {
  /* ============================================================
     AS PERGUNTAS SUGERIDAS

     ⚠️ PERGUNTA SUGERIDA É A PORTA DE ENTRADA DA IA. Se ela vier genérica
     — "Como está minha evolução?", sempre —, a inteligência não se prova.
     As duas primeiras saem do momento do tratamento; as outras cobrem o
     que a pessoa costuma querer saber.

     ⚠️ E ELAS SÃO PERGUNTAS DELA, NÃO OFERTAS NOSSAS. "Por que senti mais
     fome hoje?" é como alguém pensa; "Entenda o retorno da fome" é como
     um menu fala. A primeira pessoa é o que faz a lista parecer conversa.
     ============================================================ */
  perguntas: {
    maisFome: 'Por que senti mais fome hoje?',
    semFome: 'Por que estou sem fome?',
    depoisDaAplicacao: 'O que esperar depois da aplicação?',
    diminuirEnjoo: 'Como diminuir o enjoo?',
    trocarODia: 'Posso trocar o dia da aplicação?',
    meusExames: 'O que meus exames mostram?',
    meuProgresso: 'Analise meu progresso',
    prepararConsulta: 'Prepare minha consulta',
  },

  /* ============================================================
     OS EMPURRÕES DO DIA

     ⚠️⚠️ O IMPERATIVO AQUI É DE PROPÓSITO — "Beba mais água ainda hoje",
     "Peça a renovação". Numa varredura atrás de texto que cobra a pessoa,
     esta lista aparece inteira e parece o pior achado do aplicativo; não é.

     Cobrança é o aplicativo julgando o que já passou. Isto é o formato de
     uma lista de tarefas, e é o que a pessoa abriu a tela para ver: ela
     veio perguntando o que fazer. Trocar por substantivo — "mais um copo
     hoje" — não deixa o texto mais gentil, deixa a sugestão mais tímida, e
     sugestão tímida numa lista de quatro vira decoração.

     ⚠️ O QUE NÃO PODE SER IMPERATIVO É O `porque`: lá mora o fato, e fato
     com verbo de ordem vira sermão. Quem traduzir tem de manter a
     diferença — o de cima manda, o de baixo explica.
     ============================================================ */
  empurroes: {
    agua: 'Beba mais água ainda hoje',
    /* ⚠️ O MOTIVO ERA UM DÉFICIT COM O NOME DA PESSOA NA FRENTE. "Você
       está abaixo da metade da meta" põe o sujeito no lugar de quem
       falhou, e era o único desta lista com essa forma: os vizinhos falam
       da caneta, da agenda, do ciclo. O que falta de água é fato do dia,
       não defeito de caráter.

       ⚠️ E "ABAIXO DA META", NÃO "NA METADE". O cartão aparece com menos
       de 60% da meta — meio litro de dois e meio é um quinto —, e "o dia
       ainda está na metade" dava uma proporção que ninguém mediu. */
    aguaPorqueComEnjoo: 'Nos seus dias bem hidratados o enjoo aparece menos — e o dia ainda está abaixo da meta',
    aguaPorque: 'O dia ainda está abaixo da meta, e a água segura a saciedade até o fim dele',

    proteina: 'Reforce a proteína no jantar',
    proteinaPorque: 'Você está na fase do ciclo em que a fome volta, e a proteína de hoje aparece na fome de amanhã',

    checkin: 'Faça o check-in de hoje',
    checkinPorque: 'É o registro que alimenta tudo o que eu consigo enxergar sobre você',

    /* O recipiente e o artigo vêm de logic/formas: "Separe a caneta",
       "Separe o frasco". A frase é a mesma; o que muda é a forma do
       medicamento. */
    aplicacao: (recipiente: string) => `Separe ${recipiente} e escolha o local`,
    aplicacaoPorque: 'A aplicação da semana está chegando, e alternar o local reduz irritação na pele',

    receita: 'Peça a renovação da receita',
    /* ⚠️⚠️ A PALAVRA "doses" ESTAVA NO CÓDIGO, e não aqui. O sítio de
       chamada montava `${p.left} doses ${noNa(forma)}` e mandava a frase
       pronta — em português, espanhol e francês "doses" é a mesma palavra,
       e foi por isso que ninguém viu. Em alemão é "Dosen", e a linha saía
       meio traduzida.

       Agora chegam o NÚMERO e o LUGAR, e a palavra é de cada idioma. */
    receitaPorque: (doses: number, onde: string) =>
      `Restam ${doses} ${doses === 1 ? 'dose' : 'doses'} ${onde} — pedindo agora, ela chega antes de acabar`,

    /* O texto do exame vem do protocolo; o que é nosso é o motivo. */
    examePorque: 'Está aberto no protocolo desta semana, e o resultado costuma demorar alguns dias',

    consulta: 'Prepare suas perguntas para a consulta',
    consultaPorque: (tipo: string, doutor: string) =>
      `${tipo} com ${doutor} — eu monto o resumo, você escolhe o que quer perguntar`,
  },

  /* ⚠️ O RÓTULO DO GRUPO SAI DO PRAZO, E O PRAZO SAI DO DADO. "Esta
     semana: agendar exame" é lista de tarefas; "Daqui a 9 dias: prepare
     as perguntas" é alguém organizando a agenda de outra pessoa. */
  prazo: {
    hoje: 'Hoje',
    amanha: 'Amanhã',
    estaSemana: 'Esta semana',
    daquiA: (dias: number) => `Daqui a ${dias} dias`,
  },

  /* ============================================================
     O PROTOCOLO DA SEMANA

     ⚠️ ESTAS FRASES SÃO O QUE A CLÍNICA PRESCREVE, e o registro é mais
     formal que o do resto do aplicativo por isso. "Se exercitar", e não
     "se mexer": o informal servia quando a meta era um empurrão; numa
     lista ao lado de dose e proteína, ele destoa.
     ============================================================ */
  protocolo: {
    aguaTodoDia: (quanto: string) => `Beber ${quanto} todo dia`,
    aguaEmDias: (quanto: string, dias: number) => `Beber ${quanto} em ${dias} dias`,
    origemAgua: 'Hidratação',

    proteinaTodoDia: (gramas: number) => `Comer ${gramas} g de proteína todo dia`,
    proteinaEmDias: (gramas: number, dias: number) => `Comer ${gramas} g de proteína em ${dias} dias`,
    origemProteina: 'Alimentação',

    /* Dias COM MOVIMENTO, e não minutos: é o que o item pede — sair do
       sofá três vezes —, e é o que o registro sabe dizer sem chutar
       modalidade. */
    exercicio: (dias: number) => `Se exercitar em ${dias} ${dias === 1 ? 'dia' : 'dias'} da semana`,
    origemExercicio: 'Exercício',

    aplicacaoUma: 'Aplicação da semana',
    aplicacaoVarias: (quantas: number) => `${quantas} aplicações na semana`,
    origemAplicacao: 'Aplicações',

    /* O que se conta em cada tarefa. "1 de 1 dia" não descreve uma
       injeção, por isso a aplicação traz o par dela. */
    unidadeDia: ['dia', 'dias'] as [string, string],
    unidadeAplicacao: ['aplicação', 'aplicações'] as [string, string],
    nota: (feito: number, alvo: number, unidade: string) => `${feito} de ${alvo} ${unidade}`,
  },

  /* ============================================================
     AS SEMANAS ANTERIORES — a mesma meta, lida depois

     ⚠️ O RESUMO DE CADA META DIZ A MÉDIA, E NÃO SE FOI CUMPRIDA. A semana
     já passou; cobrar o que não dá mais para mudar não serve a ninguém.
     "Sem registro na semana" é o que se diz quando não há o que dizer —
     e é diferente de zero.
     ============================================================ */
  semanas: {
    aguaMeta: (quanto: string) => `Beber ${quanto} todo dia`,
    proteinaMeta: (gramas: number) => `Comer ${gramas} g de proteína todo dia`,
    exercicioMeta: (dias: number) => `Se exercitar em ${dias} dias da semana`,
    semRegistro: 'sem registro na semana',
    mediaDeAgua: (quanto: string) => `média de ${quanto} por dia`,
    mediaDeProteina: (gramas: number) => `média de ${gramas} g por dia`,
    minutosNaSemana: (minutos: number) => `${minutos} min na semana`,
    semMovimento: 'nenhum movimento registrado',
  },

  /* ============================================================
     O PREPARO DA CONSULTA

     ⚠️ CADA ITEM TEM DOIS TÍTULOS, e a diferença entre eles é o que o
     bloco faz: pronto, ele NOMEIA o que já existe ("Peso em dia");
     pendente, ele diz o que FAZER ("Pesar-se antes"). A mesma linha, dois
     verbos, e a pessoa lê a lista de relance sabendo o que falta.
     ============================================================ */
  preparo: {
    pesoNenhum: 'Registrar o peso',
    pesoNenhumSub: 'Nenhuma pesagem ainda',
    pesoEmDia: 'Peso em dia',
    pesoAntigo: 'Pesar-se antes',
    pesoAntigoSub: (quando: string) => `Última pesagem ${quando}`,
    pesoSub: (peso: string, quando: string) => `${peso} · ${quando}`,

    notasProntas: 'Dúvidas anotadas',
    notasProntasSub: (quantas: number) => `${quantas} para levar`,
    notasVazias: 'Anotar dúvidas',
    notasVaziasSub: 'Nada anotado ainda',

    examesRecentes: 'Exames recentes',
    examesRecentesSub: (nome: string, quando: string) => `${nome} · ${quando}`,
    exames: 'Exames',
    examesAntigosSub: (quando: string) => `O último foi ${quando}`,
    examesNenhumSub: 'Nenhum exame guardado',
  },

  /* ⚠️ A MESMA FRASE EM TODAS AS LINHAS DO PREPARO, para o olho comparar
     as datas em vez de traduzi-las. "há um mês" e não "há 1 mês": número
     por extenso quando é um só é como se fala. */
  quando: {
    hoje: 'hoje',
    ontem: 'ontem',
    haDias: (dias: number) => `há ${dias} dias`,
    haUmMes: 'há um mês',
    haMeses: (meses: number) => `há ${meses} meses`,
  },

  /* ============================================================
     O QUE MUDOU NO PERÍODO DE UMA CONSULTA
     ============================================================ */
  periodo: {
    pesoEstavel: 'Peso estável',
    pesoDe: (de: string, para: string) => `De ${de} para ${para}`,
    doseNova: (dose: string) => `Dose para ${dose} mg`,
    doseAnterior: (dose: string) => `Vinha de ${dose} mg`,
    umaAplicacao: '1 aplicação',
    aplicacoes: (quantas: number) => `${quantas} aplicações`,
    marcadores: (quantos: number) => `${quantos} marcadores`,
    umaOrientacao: '1 orientação da equipe',
    orientacoes: (quantas: number) => `${quantas} orientações da equipe`,
    /* Quando o histórico não diz o tipo da consulta. */
    consultaSemTipo: 'Consulta',
  },

  /* ⚠️ "VOCÊ" É RÓTULO E É SENTINELA AO MESMO TEMPO. Um treino sem
     `fonte` gravada é manual — manual é o que existia antes de haver
     origem —, e a tela nunca mostra a ausência: mostra "Você", porque
     ausência não responde "quem registrou isto", responde "não sei".

     Traduzir não quebra registro nenhum: a comparação é sempre contra o
     valor que o próprio aplicativo acabou de devolver, nunca contra algo
     que veio do disco. */
  origemManual: 'Você',

  /* O selo de cada fase do ciclo em relação a hoje. */
  selo: {
    passou: 'passou',
    agora: 'agora',
    amanha: 'amanhã',
    emDias: (dias: number) => `em ${dias} dias`,
  },
};
