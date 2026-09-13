/* ============================================================
   AS RÉGUAS — o que cada número quer dizer

   Um número sozinho pede que a pessoa invente a régua. "3 de energia é
   bom?" não tem resposta, e cada dia acaba respondido com uma régua
   diferente da do dia anterior — o que estraga justamente a série que o
   app vai ler depois. A legenda devolve a régua pronta.

   Ficam aqui, e não dentro das telas, porque DUAS telas escrevem as
   mesmas colunas: o check-in e "como o corpo reagiu" dividem o enjoo. Se
   cada uma trouxesse a sua legenda, o 4 de hoje e o 4 de ontem passariam
   a significar coisas diferentes conforme a porta por onde a pessoa
   entrou — o mesmo tipo de divergência que já tinha aparecido quando o
   enjoo era guardado em dois lugares.

   As frases são curtas porque a linha da escala é uma só. Todas em
   primeira pessoa e sem concordância de gênero: a mesma frase serve para
   quem usa o app, seja quem for.
   ============================================================ */

/** 1–5 na tela, 0–10 no armazenamento (dobrado na fronteira). */
export const ENERGIA = ['sem força', 'arrastando o dia', 'deu para o dia', 'com disposição', 'energia de sobra'];

/** Horas dormidas — as pontas absorvem o que passa delas. */
export const SONO = ['5 h ou menos', 'cerca de 6 h', 'cerca de 7 h', 'cerca de 8 h', '9 h ou mais'];

/** 1–5 dos dois lados, sem conversão. */
export const HUMOR = ['um dia difícil', 'meio para baixo', 'um dia normal', 'um bom dia', 'um ótimo dia'];

/** Quanto um sintoma pesou. Vale para os sete do check-in e para o enjoo
    de "como o corpo reagiu" — é a mesma coluna. */
export const INTENSIDADE = ['mal percebi', 'leve', 'incomodou', 'atrapalhou o dia', 'tomou conta do dia'];

/** Fome é o contrário de saciedade, e o radar lê como saciedade. Por isso
    1 é a fome menor: a régua sobe junto com o sintoma, como as outras. */
export const FOME = ['sem fome', 'pouca fome', 'fome normal', 'bastante fome', 'fome o dia todo'];
