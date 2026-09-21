/* ============================================================
   A HOME E A JORNADA — as metas do dia, os cartões e a linha do tempo

   É o texto que mais gente vê depois do ciclo da dose, e o que menos
   parece texto: quase tudo aqui é rótulo curto ao lado de um número.

   ⚠️ TODO NÚMERO EXIBIDO VEM COM UM VEREDITO, e é a palavra que a pessoa
   procura primeiro. O valor diz a medida; a palavra diz se está bom. Sem
   ela a pessoa faz a conta sozinha, e num aplicativo de saúde faz errado.

   ⚠️ E NENHUM VEREDITO DAQUI DÁ NOTA À PESSOA. "Abaixo da meta" qualifica
   o número; "Você não se esforçou" qualificaria quem o produziu. A
   diferença some fácil na tradução, e é o arquivo inteiro que depende
   dela.
   ============================================================ */

export const home = {
  /* ============================================================
     AS TRÊS METAS DO DIA

     ⚠️ "META BATIDA" NÃO É COMEMORAÇÃO, É ESTADO. Ela ocupa o mesmo lugar
     do "Faltam 27 g" — é a mesma linha dizendo a mesma coisa do outro
     lado. Um "Parabéns!" ali mudaria o que o cartão é.
     ============================================================ */
  metas: {
    proteina: 'Ingestão de proteína',
    agua: 'Beber mais água',
    exercicio: 'Exercitar diariamente',
    batida: 'Meta batida',
    faltamProteina: (gramas: number) => `Faltam ${gramas} g`,
    /* A quantidade chega já escrita, com a unidade de quem lê — litro ou
       onça. Ver logic/medidas. */
    faltamAgua: (quanto: string) => `Faltam ${quanto}`,
    faltamExercicio: (minutos: number) => `Faltam ${minutos} min`,
  },

  /* ============================================================
     OS VEREDITOS DE NÚMERO

     ⚠️ "PERTO DA META" É BOA NOTÍCIA, e é de propósito: 85% da meta de
     proteína é um bom dia, e chamar isso de "abaixo" ensina a pessoa a
     ignorar a palavra. O terceiro degrau existe para o primeiro continuar
     significando alguma coisa.
     ============================================================ */
  veredito: {
    naMeta: 'Na meta',
    pertoDaMeta: 'Perto da meta',
    abaixoDaMeta: 'Abaixo da meta',
    /* ⚠️ "EM QUEDA" É O RAMO QUE SALVA O CARTÃO DE GORDURA CORPORAL. Quem
       está acima da meta mas caindo desde o começo não está falhando —
       está no meio do caminho, que é onde quase todo mundo está. */
    emQueda: 'Em queda',
    acimaDaMeta: 'Acima da meta',
  },

  /* ============================================================
     O CARTÃO DE PESO

     ⚠️ O TÍTULO TAMBÉM MUDA, E NÃO SÓ O NÚMERO. "Peso perdido" em cima de
     "+3,3 kg" é uma contradição dentro do mesmo cartão — e a palavra
     errada dói mais do que o número. "Variação do peso" é o nome neutro
     do que aquele número é, e só aparece quando precisa.
     ============================================================ */
  peso: {
    perdido: 'Peso perdido',
    variacao: 'Variação do peso',
    meta: (quanto: string, unidade: string) => `Meta: ${quanto} ${unidade}`,
  },

  /* ⚠️ "ESTÁVEL", E NÃO "−0,0". Um número que não se mexeu não variou para
     lado nenhum, e a palavra é essa. Ele não é boa notícia nem má. */
  estavel: 'Estável',

  /* ============================================================
     A LINHA DO TEMPO

     Os sete tipos são o filtro da tela, e cada chip carrega a contagem
     dele. Os rótulos estão no plural porque nomeiam o conjunto.
     ============================================================ */
  tipos: {
    checkin: 'Check-ins',
    aplicacao: 'Aplicações',
    peso: 'Peso',
    refeicao: 'Refeições',
    exercicio: 'Exercícios',
    consulta: 'Consultas',
    exame: 'Exames',
  },

  evento: {
    aplicacao: (dose: string, unidade: string) => `Aplicação ${dose} ${unidade}`,
    peso: 'Peso',
    /* A primeira pesagem não tem anterior para comparar, então no lugar da
       variação vai o que ela é. */
    pesoInicial: 'Peso inicial',
    checkin: 'Check-in',
    exercicio: 'Exercício',
    minDeMovimento: (minutos: number) => `${minutos} min de movimento`,
    proteinaDaRefeicao: (quanto: string) => `Proteína ${quanto}`,
    consulta: (tipo: string) => `Consulta ${tipo}`,
    marcadoresDe: (quantos: number, fonte: string) => `${quantos} marcadores · ${fonte}`,
    marcadoresDetalhe: (nome: string, quantos: number, fonte: string) =>
      `${nome} · ${quantos} marcadores · ${fonte}`,
    compartilhado: 'Compartilhado',

    /* O resumo do check-in: o que foi respondido, separado por ponto. */
    gramasDeProteina: (gramas: number) => `${gramas} g proteína`,
    horasDeSono: (horas: number) => `${horas}h de sono`,

    /* ⚠️ O VEREDITO DO DIA VEM DO HUMOR, e as três palavras são curtas de
       propósito: elas ocupam a coluna da direita, ao lado de um número.
       "Difícil" é a mais importante das três — ela nomeia o dia ruim sem
       chamá-lo de fracasso. */
    diaBem: 'Bem',
    diaNeutro: 'Neutro',
    diaDificil: 'Difícil',

    /* As respostas do check-in, com o nome de cada pergunta. */
    respostaHumor: 'Humor',
    respostaEnergia: 'Energia',
    respostaFome: 'Fome',
    /* O único campo em que a pessoa escreveu, em vez de escolher. */
    respostaOutroSintoma: 'Outro sintoma',
  },

  /* ============================================================
     A SEMANA, EM CAPÍTULOS

     ⚠️ O RESUMO CONTA O QUE A SEMANA RENDEU, e não lista o que houve. Por
     isso cada tipo tem singular e plural próprios — "1 pesagem" e "3
     pesagens" —, e não um "(s)" pendurado.
     ============================================================ */
  semana: {
    checkin: ['check-in', 'check-ins'] as [string, string],
    peso: ['pesagem', 'pesagens'] as [string, string],
    refeicao: ['refeição', 'refeições'] as [string, string],
    exercicio: ['exercício', 'exercícios'] as [string, string],
    consulta: ['consulta', 'consultas'] as [string, string],
    exame: ['exame', 'exames'] as [string, string],
    contagem: (quantos: number, nome: string) => `${quantos} ${nome}`,
    /* ⚠️ SEMANA VAZIA TEM FRASE PRÓPRIA, e não um espaço em branco: uma
       semana sem registro aconteceu, e o capítulo dela existe. */
    semRegistros: 'Sem registros nesta semana',

    /* Os destaques numéricos do ciclo. */
    hidratacao: 'Hidratação',
    proteina: 'Proteína',
    exercicioMetrica: 'Exercício',
    pesoMetrica: 'Peso',
    litrosPorDia: (quanto: string) => `${quanto} L/dia`,
    gramasPorDia: (quanto: number) => `${quanto} g/dia`,
    minutos: (quanto: number) => `${quanto} min`,
    deltaLitros: (quanto: string) => `${quanto} L`,
    deltaGramas: (quanto: string) => `${quanto} g`,
    deltaMinutos: (quanto: string) => `${quanto} min`,
  },

  /* ============================================================
     O QUE MUDOU DESDE O COMEÇO

     Cada linha é um número de antes contra um de agora. O rótulo é o nome
     da medida; o veredito é a palavra ao lado.
     ============================================================ */
  mudancas: {
    peso: 'Peso',
    cintura: 'Cintura',
    gorduraCorporal: 'Gordura corporal',
    /* ⚠️ A ÚNICA EM QUE SUBIR É A BOA NOTÍCIA: músculo perdido num
       emagrecimento é o que o tratamento tenta evitar. O rótulo não diz
       isso — quem diz é o tom —, mas quem traduzir precisa saber. */
    massaMagra: 'Massa magra',
    naReferencia: 'Na referência',
    foraDaReferencia: 'Fora da referência',
    pressao: 'Pressão',
    /* ⚠️ "ESTÁVEL" ERA O QUE SOBRAVA DE TUDO QUE NÃO FOSSE QUEDA, e a
       pressão subindo catorze pontos saía como estável — em verde. Subir
       tem nome. */
    pressaoEmQueda: 'Em queda',
    pressaoEmAlta: 'Em alta',
    pressaoEstavel: 'Estável',
  },

  /* ============================================================
     A META DE PESO, NA JORNADA
     ============================================================ */
  metaDePeso: {
    /* "Chegar a 68 kg", e não "Meta: 68 kg": a lista é de coisas a
       conseguir, e o verbo é o que a faz parecer uma delas. */
    chegarA: (peso: string) => `Chegar a ${peso}`,
    alcancada: 'meta alcançada',
    faltam: (quanto: string) => `faltam ${quanto}`,
  },

  /* ⚠️ SÓ O NOME DA APPLE MUDA DE IDIOMA — "Apple Saúde" é "Apple Health"
     em inglês, porque é a Apple que traduz o nome do próprio aplicativo.
     Health Connect, Garmin, Fitbit e Withings são marcas e ficam no
     código, sem passar por aqui: marca não se traduz. */
  fontes: {
    appleSaude: 'Apple Saúde',
  },
};
