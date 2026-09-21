/* ============================================================
   O COMPANION — a memória dele e a biblioteca que ele sugere

   ⚠️ A MEMÓRIA FALA DE PRESENÇA, E NÃO DE VOLUME. A linha enumerava o que
   ele tinha lido — "considerei seus check-ins, 11 aplicações, 15 exames…"
   —, e enumerar prova capacidade de contar, não de conhecer. O que
   constrói confiança é ter estado ali ao longo do tempo.

   ⚠️ E A BIBLIOTECA NÃO É CATÁLOGO. Cada leitura entra porque alguma coisa
   no estado da pessoa a puxou — a fase do ciclo, um sintoma, a consulta
   marcada —, e o motivo aparece no cartão. Conteúdo sem motivo visível
   vira blog.

   Por isso cada item tem TRÊS peças, e elas não são intercambiáveis:

     · `motivo`  por que isto apareceu HOJE, com o número dela dentro
     · `titulo`  o que o texto ensina
     · `desc`    o que ele resolve, que é diferente do que ele ensina
   ============================================================ */

export const companion = {
  /* ============================================================
     A MEMÓRIA — quatro aberturas, que giram com os registros
     ============================================================ */
  memoria: {
    desdeAPrimeira: (dias: number) =>
      `Acompanho seu tratamento desde a primeira aplicação, há ${dias} dias.`,
    desdeOPrimeiroDiaComSemanas: (semanas: number) =>
      `Conheço sua jornada desde o primeiro dia — ${semanas} semanas até aqui.`,
    desdeOPrimeiroDia: 'Conheço sua jornada desde o primeiro dia.',
    dosesAtras: (doses: number) =>
      `Estou com você desde a primeira aplicação, ${doses} doses atrás.`,
  },

  /* ============================================================
     A BIBLIOTECA CONTEXTUAL
     ============================================================ */
  biblioteca: {
    /* ---------- a fome que volta ---------- */
    fomeMotivo: (dia: number) => `Você está no dia ${dia} do ciclo, quando a fome volta`,
    fomeTitulo: 'Por que a fome volta antes da aplicação',
    /* ⚠️ "TIRA A SENSAÇÃO DE RECAÍDA" é o serviço desta leitura, e o motivo
       de ela existir: a fome voltando no quinto dia é onde as pessoas
       concluem que falharam. A molécula entra na frase em minúscula porque
       é substância, não marca. */
    fomeDesc: (molecula: string) =>
      `O nível da ${molecula} cai ao longo da semana, e a saciedade cai junto. Entender a curva tira a sensação de recaída.`,

    /* ---------- os primeiros dias ---------- */
    primeirosMotivo: (dias: number) => `Você aplicou há ${dias} ${dias === 1 ? 'dia' : 'dias'}`,
    primeirosTitulo: 'Os primeiros dias depois da dose',
    /* "o que já merece uma mensagem para a equipe" é a metade que importa:
       a leitura existe para separar o esperado do que não espera. */
    primeirosDesc: 'O que é esperado sentir na janela de 48 h e o que já merece uma mensagem para a equipe.',

    /* ---------- o enjoo ---------- */
    enjooMotivo: (dias: number) => `Você marcou enjoo em ${dias} dos últimos 7 dias`,
    enjooTitulo: 'Comer sem enfrentar o enjoo',
    /* ⚠️ "ENFRENTAR" É O VERBO CERTO, e o título inteiro depende dele: quem
       está enjoada não precisa de força de vontade para comer, precisa de
       comida que passe. */
    enjooDesc: 'Combinações e horários que costumam passar melhor nos dias em que a comida parece demais.',

    /* ---------- a proteína ---------- */
    proteinaMotivo: (gramas: number) => `Faltam ${gramas} g para sua média bater a meta`,
    proteinaTitulo: 'Proteína sem cozinhar mais',
    /* "o problema raramente é receita, é praticidade" é o que separa esta
       leitura de um blog de receitas. */
    proteinaDesc: 'Como chegar à meta com o que já existe na sua geladeira — o problema raramente é receita, é praticidade.',

    /* ---------- o sono ---------- */
    sonoMotivo: (horas: string) => `Sua média de sono está em ${horas} h`,
    sonoTitulo: 'O sono como parte do tratamento',
    sonoDesc: 'Dormir pouco muda os hormônios da fome no dia seguinte — nos seus próprios registros isso já aparece.',

    /* ---------- depois do terceiro mês ---------- */
    plateauMotivo: (semana: number, perdido: string) => `Semana ${semana}, com ${perdido} no período`,
    plateauTitulo: 'O que muda depois do terceiro mês',
    /* ⚠️ "ISSO É FISIOLOGIA, NÃO FALHA" é a mesma defesa que o cartão de
       platô faz, e ela precisa estar aqui também: é neste ponto do
       tratamento que as pessoas param. */
    plateauDesc: 'A perda desacelera e isso é fisiologia, não falha. O que passa a valer mais do que a balança daqui em diante.',

    /* ---------- a consulta ---------- */
    consultaMotivo: (dias: number) => `Sua consulta é daqui a ${dias} dias`,
    consultaTitulo: 'Como aproveitar melhor sua consulta',
    consultaDesc: 'O que levar, o que perguntar e como o resumo automático economiza os primeiros dez minutos.',
  },
};
