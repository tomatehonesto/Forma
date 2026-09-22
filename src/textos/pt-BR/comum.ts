/* ============================================================
   AS REGRAS DE IDIOMA QUE NÃO SÃO DE DOMÍNIO NENHUM

   Aqui mora o que é gramática pura: coisas que todo domínio precisa e que
   nenhum deles é dono. Hoje é uma só, e ela já estava escrita duas vezes.

   ⚠️ NÃO É UM DEPÓSITO DE SOBRAS. Frase que pertence a um assunto vai
   para o arquivo daquele assunto, mesmo que apareça em três telas. O que
   entra aqui é o que muda por causa do IDIOMA e não do que está sendo
   dito.
   ============================================================ */

export const comum = {
  /* ⚠️ ESTAVA ESCRITA DUAS VEZES: uma em `listaPt`, para "a, b, c e mais
     2", e outra no cuidado, para "mensagens, receita e exames". A mesma
     regra do português — vírgula até o penúltimo, "e" só antes do último
     —, e um join simples dá "mensagens e receita e exames", que é como uma
     máquina fala.

     ⚠️ O `mostrar` É O QUE AS DUAS TINHAM DE DIFERENTE, e é por isso que
     elas não podiam ser a mesma chamada: a lista de pendências mostra
     todos os itens, e a de nomes na Home corta em três e conta o resto.
     Sem teto, nada é cortado.

     Em inglês muda a vírgula antes do "and" e muda o "e mais 2"; quem
     traduzir mexe aqui, uma vez, e as duas telas seguem juntas. */
  /* ⚠️⚠️ A CAIXA NO MEIO DA FRASE É REGRA DE IDIOMA, E ESTAVA ESPALHADA
     PELO CÓDIGO COMO `.toLowerCase()`. Sete sítios em src/logic faziam
     isso à mão: o tipo da consulta, o rótulo do evento, o nome da
     molécula, a nota do resumo.

     Em português, em espanhol, em francês e em inglês a regra é a mesma —
     substantivo comum perde a maiúscula quando entra no meio de uma frase
     — e por isso ninguém percebeu que era regra de idioma. É.

     ⚠️⚠️ O ALEMÃO ESCREVE TODO SUBSTANTIVO COM MAIÚSCULA, sempre, em
     qualquer posição da frase. Lá esta função devolve o que recebeu, e
     `.toLowerCase()` produziria "konsultation rückkehr" — erro de
     ortografia, não de estilo, em toda linha que passasse por ele.

     ⚠️ E NÃO É A MESMA DE `marcadores.noMeio`. Aquela decide se um nome de
     exame é sigla ou nome comum, e "HbA1c" não pode perder a maiúscula.
     Esta é a regra geral, sem exceção de sigla. */
  noMeio: (s: string) => s.toLowerCase(),

  lista: (itens: string[], mostrar = Infinity) => {
    if (!itens.length) return '';
    if (itens.length === 1) return itens[0];
    if (itens.length <= mostrar) {
      return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`;
    }
    return `${itens.slice(0, mostrar).join(', ')} e mais ${itens.length - mostrar}`;
  },
};
