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

   As frases são curtas porque são manchete do campo, e começam com
   maiúscula pelo mesmo motivo: quem lê "Deu para o dia" embaixo de
   "ENERGIA" está lendo uma resposta, não uma etiqueta. Todas em primeira
   pessoa e sem concordância de gênero: a mesma frase serve para quem usa
   o app, seja quem for.
   ============================================================ */

/** 1–5 na tela, 0–10 no armazenamento (dobrado na fronteira). */
export const ENERGIA = ['Sem força', 'Arrastando o dia', 'Deu para o dia', 'Com disposição', 'Energia de sobra'];

/** Horas dormidas — as pontas absorvem o que passa delas. */
export const SONO = ['5 h ou menos', 'Cerca de 6 h', 'Cerca de 7 h', 'Cerca de 8 h', '9 h ou mais'];

/** 1–5 dos dois lados, sem conversão. */
export const HUMOR = ['Um dia difícil', 'Meio para baixo', 'Um dia normal', 'Um bom dia', 'Um ótimo dia'];

/** Régua genérica de sintoma — a rede de segurança para um sintoma que
    ainda não tem a sua. Ver `SINTOMA` logo abaixo. */
export const INTENSIDADE = ['Mal percebi', 'Leve', 'Incomodou', 'Atrapalhou o dia', 'Tomou conta do dia'];

/* Cada sintoma tem a SUA régua, porque cada um piora de um jeito.

   "Tomou conta do dia" servia para tudo e não descrevia nada: o 5 da
   náusea é vomitar, o da constipação é o quarto dia sem ir ao banheiro e
   o da tontura é não conseguir ficar de pé. São eventos diferentes, e
   quem responde sabe qual deles teve — a régua genérica obrigava a
   traduzir isso para um advérbio.

   Constipação sai da intensidade e vira contagem de dias, que é como a
   pessoa de fato se lembra do sintoma e como a equipe clínica pergunta.

   Só as pontas aparecem embaixo do trilho, então elas são as mais curtas
   das cinco. */
export const SINTOMA: Record<string, string[]> = {
  nausea: ['Um leve embrulho', 'Enjoo indo e vindo', 'Enjoo constante', 'Quase vomitei', 'Vomitei'],
  constip: ['Fui com esforço', 'Um dia sem ir', 'Dois dias sem ir', 'Três dias sem ir', 'Quatro dias ou mais'],
  /* O lado solto se conta em idas no dia, como o preso se conta em dias
     sem ir — os dois lados do eixo medem quantidade, não advérbio. Os
     cortes em quatro e em sete são os mesmos que a graduação clínica de
     diarreia usa para separar o leve do que merece atenção. */
  diarreia: ['Uma vez', 'Duas vezes', 'Três vezes', 'Quatro a seis vezes', 'Sete ou mais'],
  refluxo: ['Queimação leve', 'Depois das refeições', 'Várias vezes no dia', 'Atrapalhou comer', 'Não consegui deitar'],
  fadiga: ['Cansaço leve', 'Cansei mais rápido', 'Precisei desacelerar', 'Precisei deitar', 'Não saí da cama'],
  cefaleia: ['Uma fisgada', 'Incomodou de leve', 'Precisei de remédio', 'Atrapalhou o dia', 'Fiquei no escuro'],
  tontura: ['Leve desequilíbrio', 'Ao levantar rápido', 'Várias vezes no dia', 'Precisei me segurar', 'Não fiquei de pé'],
  /* Vômito se conta, não se gradua: "atrapalhou o dia" não diz nada sobre
     vomitar, e o número de vezes é o que a equipe vai perguntar. */
  vomito: ['Uma vez', 'Duas vezes', 'Três vezes', 'Quatro ou mais', 'Não consegui parar'],
  dor: ['Um desconforto', 'Cólica leve', 'Cólica constante', 'Precisei parar o dia', 'Dor que não passou'],
};

/* O INTESTINO é um eixo, não um sintoma.

   Prender e soltar não são queixas diferentes: são as duas pontas do
   mesmo efeito. A caneta desacelera o trato inteiro — esvaziamento
   gástrico atrasado em cerca de 80% de quem usa, cólon em cerca de um
   terço —, e daí sai constipação; a mesma lentidão, com o escalonamento
   de dose e a mudança de alimentação, produz diarreia numa proporção
   equivalente. Nos dados de mundo real os dois aparecem quase empatados,
   32,7% de diarreia contra 30,4% de constipação.

   Por isso "Alternou" é um valor de primeira classe e não um caso
   estranho: era a resposta que a pessoa tinha e que a tela não aceitava.

   A lista mora aqui porque as duas telas que escrevem `gut` — o check-in
   e "como o corpo reagiu" — precisam concordar sobre quais valores
   existem. Separadas, uma podia gravar um estado que a outra não sabia
   exibir. */
export const INTESTINO: [string, string][] = [
  ['normal', 'Normal'],
  ['preso', 'Preso'],
  ['solto', 'Solto'],
  ['alterna', 'Alternou'],
];

/** Fome é o contrário de saciedade, e o radar lê como saciedade. Por isso
    1 é a fome menor: a régua sobe junto com o sintoma, como as outras. */
export const FOME = ['Sem fome', 'Pouca fome', 'Fome normal', 'Bastante fome', 'Fome o dia todo'];
