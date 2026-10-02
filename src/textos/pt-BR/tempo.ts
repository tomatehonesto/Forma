/* ============================================================
   O TEMPO DITO PARA GENTE — "hoje", "ontem", "em 3 dias"

   ⚠️⚠️ ISTO NÃO É FORMATO, É FALA, e é por isso que mora aqui e não em
   logic/local. A fronteira entre os dois é simples de dizer e fácil de
   errar: o formato responde COMO um número ou uma data se escrevem —
   vírgula ou ponto, "13 mai" ou "May 13" —, e é igual em qualquer frase.
   Isto responde O QUE se diz no lugar da data, e a resposta tem
   concordância, tem plural e muda com a língua de um jeito que nenhuma
   tabela de separadores descreve.

   "em 3 dias" vira "in 3 days", mas "amanhã" vira "tomorrow" — não é a
   mesma frase com outras palavras, é outra frase.

   ⚠️ SÃO DUAS PERGUNTAS, E ELAS NÃO SÃO A MESMA. `daquiA` só olha para a
   frente: dose vencida é dose para tomar AGORA, e por isso tudo que já
   passou lê "hoje". `relativo` olha para os dois lados, e é o certo para
   uma coleta ou uma consulta que já aconteceu. Misturar os dois faria a
   aplicação atrasada aparecer como "há 2 dias", que é descrição de
   arquivo e não de tarefa.
   ============================================================ */

export const tempo = {
  /** Só para a frente: "hoje", "amanhã", "em 3 dias". */
  daquiA: (dias: number) => (dias <= 0 ? 'hoje' : dias === 1 ? 'amanhã' : `em ${dias} dias`),

  /** Para os dois lados. Negativo é passado.

      ⚠️ O PORTUGUÊS USA "há" PARA O PASSADO e "em" para o futuro, e são
      duas preposições diferentes para a mesma distância. O inglês usa
      "ago" no fim e "in" no começo, o que muda a ORDEM da frase e não só
      a palavra — motivo bastante para isto ser uma função por idioma em
      vez de uma tabela de palavras. */
  relativo: (dias: number) => {
    if (dias === 0) return 'hoje';
    if (dias === -1) return 'ontem';
    if (dias === 1) return 'amanhã';
    return dias < 0 ? `há ${-dias} dias` : `em ${dias} dias`;
  },

  /** Uma duração: "1 dia", "5 dias", "1 semana", "3 semanas".

      ⚠️ EXISTE POR CAUSA DO ESTOQUE (02/10/2026, parte B3 de
      docs/superpowers/specs/2026-10-01-oral-e-diario-design.md). A
      cobertura do remédio era sempre escrita em semanas, e para quem toma
      todo dia isso dava "cerca de 0.42857142857142855 semanas" — três
      comprimidos divididos por sete. A unidade é escolhida na lógica
      (`coberturaDoEstoque`, em logic/derive); aqui só se escreve, com o
      plural de cada língua. */
  duracao: (c: { n: number; unidade: 'dia' | 'semana' }) =>
    c.unidade === 'dia'
      ? `${c.n} ${c.n === 1 ? 'dia' : 'dias'}`
      : `${c.n} ${c.n === 1 ? 'semana' : 'semanas'}`,
};
