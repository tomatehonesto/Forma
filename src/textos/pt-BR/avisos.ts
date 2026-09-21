/* ============================================================
   OS AVISOS — as duas linhas que aparecem na tela de bloqueio

   ⚠️⚠️ QUEM LÊ ISTO ESTÁ NA RUA, NO MEIO DE OUTRA COISA. Por isso nenhum
   deles cobra, nenhum diz "você não", e nenhum afirma o que o aplicativo
   não sabe àquela hora — se a pessoa já bebeu água hoje, se já comeu, se
   já pesou. O aviso oferece; quem sabe do dia é ela.

   ⚠️ E O DO CHECK-IN PERGUNTA, em vez de mandar. É o único dos cinco
   assim, e é assim porque o check-in é uma pergunta: "Faça o check-in"
   trata de tarefa uma coisa que é conversa, e "como foi o seu dia?" é o
   que alguém perguntaria — e é o que a tela do outro lado vai perguntar
   de novo.
   ============================================================ */

export const avisos = {
  /* ---------- a aplicação, em três distâncias ---------- */
  /* O `dose` chega pronto — "Mounjaro 5 mg" —, e o recipiente e o artigo
     vêm de logic/formas: "deixar a caneta à vista", "deixar o frasco à
     vista". Ver o comentário de `oA` e `doDa` lá. */
  doseHoje: 'A sua aplicação é hoje',
  doseHojeCorpo: (dose: string) => `${dose}. Quando der, registre por aqui.`,
  doseAmanha: 'A sua aplicação é amanhã',
  doseAmanhaCorpo: (dose: string, oRecipiente: string) => `${dose}. Vale deixar ${oRecipiente} à vista.`,
  doseEmDias: (dias: number) => `A sua aplicação é em ${dias} dias`,
  doseEmDiasCorpo: (dose: string, doRecipiente: string) => `${dose}. Dá tempo de conferir o estoque ${doRecipiente}.`,

  /* ---------- os outros quatro ---------- */
  checkin: 'Como foi o seu dia?',
  checkinCorpo: 'Sono, fome, energia e humor — quatro respostas, e o dia fica registrado.',
  peso: 'Dia de pesagem',
  pesoCorpo: 'Suba na balança quando der. Um número por semana já desenha a curva.',
  agua: 'Um copo de água',
  aguaCorpo: 'Ajuda com a saciedade e com o enjoo — e conta para a meta do dia.',
  proteina: 'Proteína primeiro',
  proteinaCorpo: 'Na próxima refeição, comece por ela. É o que segura a massa magra.',
};
