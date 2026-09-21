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

import { T } from '../textos';

/** 1–5 na tela, 0–10 no armazenamento (dobrado na fronteira). */
export const ENERGIA = () => T.escalas.energia;

/** Horas dormidas — as pontas absorvem o que passa delas. */
/* Espaço fino inquebrável entre o número e o 'h': em caixa estreita a
   linha quebrava entre os dois e sobrava um 'h' órfão na segunda linha. */
export const SONO = () => T.escalas.sono;

/** 1–5 dos dois lados, sem conversão. */
export const HUMOR = () => T.escalas.humor;

/* PROTEÍNA POR REFEIÇÃO — a faixa saiu da pergunta.

   Durante um tempo a tela perguntava "quanta proteína tinha?" e oferecia
   Bastante / Média / Pouca. Era melhor do que o silêncio de antes, mas
   continuava pedindo a coisa errada: quantas gramas de proteína tem um
   filé é informação que quem comeu não tem. A pergunta certa é o que
   estava no prato — essa a pessoa responde sem pensar —, e a conta é
   trabalho do app.

   O que sobrou da faixa é rótulo, nas duas direções:

   faixaDe(g) desce dos gramas para a palavra, para /alimentacao poder
   dizer "proteína alta" sem guardar isso em lugar nenhum. Os cortes
   ficam no meio do caminho entre as âncoras antigas (30, 18 e 8), o que
   mantém a ida e a volta coerentes.

   gramasDaFaixa sobe da palavra para os gramas, e existe SÓ para ler
   refeição gravada antes de tudo isso: elas têm 'alta' e não têm `g`.
   Não use em registro novo — em registro novo o grama vem do prato. */
/* ⚠️⚠️ ESTAS TRÊS PALAVRAS NÃO VÃO PARA O CATÁLOGO, e é o contrário do
   resto do arquivo: 'alta', 'média' e 'baixa' ficaram GRAVADAS em toda
   refeição registrada antes de o grama existir, e `gramasDaFaixa` lê o
   registro velho por elas. Traduzir apagaria a proteína dessas refeições.

   Quem MOSTRA a faixa para alguém é a tela de alimentação, e é lá que a
   palavra vira texto. Aqui ela é chave. */
export function faixaDe(g: number): string {
  if (g >= 24) return 'alta';
  if (g >= 13) return 'média';
  return 'baixa';
}

const FAIXA_ANTIGA: Record<string, number> = { alta: 30, 'média': 18, baixa: 8 };

/** Gramas de uma refeição antiga, gravada só com a faixa. */
export function gramasDaFaixa(prot: string | null | undefined): number | null {
  return prot ? FAIXA_ANTIGA[prot] ?? null : null;
}

/** Régua genérica de sintoma — a rede de segurança para um sintoma que
    ainda não tem a sua. Ver `SINTOMA` logo abaixo. */
export const INTENSIDADE = () => T.escalas.intensidade;

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
export const SINTOMA = (): Record<string, string[]> => T.escalas.sintoma;

const SINTOMA_ANTIGO: Record<string, string[]> = {
  nausea: ['Um leve embrulho', 'Enjoo indo e vindo', 'Enjoo constante', 'Quase vomitei', 'Vomitei'],
  constip: ['Fui com esforço', 'Um dia sem ir', 'Dois dias sem ir', 'Três dias sem ir', 'Quatro dias ou mais'],
  /* O lado solto se conta em idas no dia, como o preso se conta em dias
     sem ir — os dois lados do eixo medem quantidade, não advérbio.

     O piso é uma FAIXA, e não "uma vez", porque uma ida mole não é
     diarreia: a definição da OMS começa em três evacuações moles no dia
     (ou mais do que o normal para aquela pessoa). Com o piso em uma vez,
     a escala afirmava como sintoma o que ainda está dentro do normal de
     muita gente — e uma coluna que chama tudo de diarreia não serve para
     ler nada depois.

     Então: o degrau 1 é o "mole, mas ainda não é isso", o 2 é onde a OMS
     passa a chamar de diarreia, e o 5 é a faixa que a graduação clínica
     trata como grave. O lado preso não precisou do mesmo ajuste — fazer
     força para evacuar já é critério de constipação, então o piso dele
     nasce em cima da linha. */
  diarreia: ['Uma ou duas vezes', 'Três vezes', 'Quatro vezes', 'Cinco a seis vezes', 'Sete ou mais'],
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
export const INTESTINO = (): [string, string][] => {
  const t = T.escalas.intestino;
  return [['normal', t.normal], ['preso', t.preso], ['solto', t.solto], ['alterna', t.alterna]];
};

/** Fome é o contrário de saciedade, e o radar lê como saciedade. Por isso
    1 é a fome menor: a régua sobe junto com o sintoma, como as outras. */
export const FOME = () => T.escalas.fome;

/* A fronteira entre as duas réguas. O armazenamento é 0–10 desde o começo
   — radar, metas, série do balanço e histórico leem nessa escala —, e as
   telas falam 1–5. A conversão mora aqui, ao lado das legendas que dão
   nome a cada degrau, e é a mesma para o check-in, para "como o corpo
   reagiu" e para quem lê o registro depois de salvo.

   Zero vira null de propósito: na régua de armazenamento o zero é
   "não teve", e na tela isso é campo em branco, não o degrau 1. */
export const paraTela = (v: any) => (typeof v === 'number' && v > 0 ? Math.round(v / 2) : null);

/* O GRAU DE UM SINTOMA NO DIA, na régua de 1 a 5 — a mesma que a pessoa
   respondeu.

   Os sintomas moram em três lugares, por história: náusea e refluxo têm
   coluna própria em 0–10; o intestino guarda a direção em `gut` e a
   quantidade em `constip`/`diarreia`, também em 0–10; e o resto vive no
   mapa `sint`, já na régua da tela.

   Sem um lugar só para essa tradução, cada tela que lê sintoma refaz a
   conversão por conta própria — e foi assim que a tela de sintomas
   acabou escrevendo "náusea 4/10" embaixo de uma pergunta de 1 a 5, e a
   da semana classificando como "forte" o que a pessoa respondeu como
   leve.

   `null` é "não teve ou não respondeu". Os dois somem da leitura pelo
   mesmo motivo: nenhum dos dois é sintoma. Quem precisa distinguir um do
   outro — o gráfico do ciclo precisa — pergunta antes se o dia teve
   resposta, e aí o silêncio e o zero deixam de ser a mesma coisa. */
export function grauDoSintoma(c: any, id: string): number | null {
  if (!c) return null;
  if (id === 'nausea') return paraTela(c.nausea);
  if (id === 'refluxo') return paraTela(c.refluxo);
  if (id === 'preso') return c.gut === 'preso' ? paraTela(c.constip) : null;
  if (id === 'solto') return c.gut === 'solto' ? paraTela(c.diarreia) : null;
  const v = c?.sint?.[id];
  return typeof v === 'number' && v > 0 ? v : null;
}

/* OS SINTOMAS que a tela oferece, na ordem em que aparecem.

   `store` é a coluna numérica legada, para os três que já tinham uma desde
   o começo; os outros vivem no mapa `sint` do registro. Dois são casos à
   parte e não têm régua nem coluna própria aqui: `intestino` escreve
   `gut` (e `constip` ou `diarreia`, conforme o lado), e `outro` guarda texto
   em `outroTexto`.

   Mora junto das réguas porque quem lê um registro já salvo — a
   confirmação do check-in, por exemplo — precisa da mesma lista para dar
   nome ao que encontrou. */
export const SINTOMAS = (): { id: string; label: string; store?: string }[] => {
  const n = T.escalas.nomes;
  return [
    { id: 'nausea', label: n.nausea, store: 'nausea' },
    { id: 'intestino', label: n.intestino },
    { id: 'vomito', label: n.vomito },
    { id: 'dor', label: n.dor },
    { id: 'refluxo', label: n.refluxo, store: 'refluxo' },
    { id: 'fadiga', label: n.fadiga },
    { id: 'cefaleia', label: n.cefaleia },
    { id: 'tontura', label: n.tontura },
    { id: 'outro', label: n.outro },
  ];
};

/* OS SINTOMAS COMO SE LÊ DEPOIS — com os dois lados do intestino separados.

   `SINTOMAS`, acima, é a lista de PERGUNTAS, e nela o intestino é uma só:
   prender e soltar são as duas pontas do mesmo eixo, e a pessoa responde
   uma vez. Quem lê o passado precisa deles separados — "intestino em
   quatro dias" soma dias presos com dias soltos e vira um número que não
   quer dizer nada.

   Cada um traz a régua com que foi respondido, que é o que devolve a
   palavra do grau: o 4 da náusea é "quase vomitei" e o 4 da constipação é
   "três dias sem ir". Sem a régua junto, a tela teria que escrever "4 de
   5" e deixar a pessoa lembrar do resto. */
export const SINTOMAS_LIDOS = (): { id: string; label: string; regua: string[] }[] => {
  const n = T.escalas.nomes;
  const s = SINTOMA();
  return [
    { id: 'nausea', label: n.nausea, regua: s.nausea },
    { id: 'preso', label: n.preso, regua: s.constip },
    { id: 'solto', label: n.solto, regua: s.diarreia },
    { id: 'vomito', label: n.vomito, regua: s.vomito },
    { id: 'dor', label: n.dor, regua: s.dor },
    { id: 'refluxo', label: n.refluxo, regua: s.refluxo },
    { id: 'fadiga', label: n.fadiga, regua: s.fadiga },
    { id: 'cefaleia', label: n.cefaleia, regua: s.cefaleia },
    { id: 'tontura', label: n.tontura, regua: s.tontura },
  ];
};
