/* ============================================================
   THE LANGUAGE RULES THAT BELONG TO NO DOMAIN — en-US

   ⚠️ THE REASONS LIVE IN THE PORTUGUESE FILE. Read ../pt-BR/comum.ts
   before changing anything here: it carries WHY each message says what it
   says, and this file carries only what English does differently. That is
   the rule for every file in this directory — the justification is not
   duplicated, because two copies of a reason drift apart and then nobody
   knows which one the code followed.
   ============================================================ */

export const comum = {
  /* ⚠️ THE SERIAL COMMA IS THE DIFFERENCE. Portuguese writes "a, b e c"
     with no comma before the conjunction; American English writes
     "a, b, and c" — the Oxford comma — and leaving it out is what makes
     "milk, eggs and bacon" read as one item at the end.

     Two items take no comma at all: "milk and eggs", never "milk, and
     eggs". That is why the two-item case is its own branch and not a
     shorter run of the same join. */
  /* ⚠️ Mid-sentence case is a language rule. English lowers a common
     noun inside a sentence, the same as Portuguese — see ../pt-BR/comum.
     German does not, which is why this is a function and not a call to
     `.toLowerCase()` out in the logic. */
  noMeio: (s: string) => s.toLowerCase(),
  /* ⚠️ AS ASPAS SÃO DE CADA IDIOMA: “ ” no português e no inglês, « » no
     francês com espaça, «» no espanhol sem, e „ “ no alemão — que abre
     embaixo. Escritas na tela, toda citação do aplicativo sai com aspa
     inglesa em cinco idiomas.

     ⚠️ E ELA MORA AQUI porque a citação não é de uma tela: é a nota da
     semana, o sintoma que a pessoa escreveu, a anotação da consulta. Eram
     duas cópias idênticas, em `escalas` e em `home`, e a terceira tela
     ia escrever a terceira. */
  citacao: (texto: string) => `“${texto}”`,

  lista: (itens: string[], mostrar = Infinity) => {
    if (!itens.length) return '';
    if (itens.length === 1) return itens[0];
    if (itens.length <= mostrar) {
      if (itens.length === 2) return `${itens[0]} and ${itens[1]}`;
      return `${itens.slice(0, -1).join(', ')}, and ${itens[itens.length - 1]}`;
    }
    const resto = itens.length - mostrar;
    return `${itens.slice(0, mostrar).join(', ')}, and ${resto} more`;
  },

  abas: {
    home: 'Home',
    jornada: 'Journey',
    cuidado: 'Care',
    insights: 'Insights',
  },
};
