/* ============================================================
   O QUE CONTA COMO HIDRATAÇÃO

   O app pedia 2,5 L de ÁGUA PURA e media a meta com uma régua de
   LÍQUIDO TOTAL — 35 ml por quilo, que é recomendação de tudo o que se
   bebe, não de água da torneira. A EFSA fixa a referência do mesmo jeito
   (2,0 L para mulheres, 2,5 para homens, incluindo as outras bebidas).
   Quem tomava três cafés e dois chás via meio litro no app e estava
   devendo um litro que já tinha bebido. A incoerência era nossa.

   E ela pesa mais neste tratamento do que num app comum: com náusea,
   muita gente não desce água pura. Desce chá, água de coco, café gelado.
   Contar zero por isso é o app brigando com o tratamento em vez de
   ajudar.

   CADA BEBIDA CONTA PELO VOLUME QUE TEM, e não por um percentual.

   Os apps de contagem costumam publicar uma tabela — "café hidrata 80%",
   "suco 90%" — e esses números não vêm de lugar nenhum que se possa
   citar. O que existe medido é o índice de hidratação de bebidas
   (Maughan, 2016), que comparou a retenção de treze bebidas em dose de
   um litro: leite e soro de reidratação retiveram mais que a água, e
   café e chá em dose moderada não deram diferença significativa
   (Killer, 2014). Nada disso vira um fator por xícara. Então não
   inventamos fator: o que é quase todo água conta como água.

   A EXCEÇÃO É O ÁLCOOL, e ela está aqui em vez de estar escondida. É a
   única bebida com efeito líquido negativo bem estabelecido — ela
   suprime a vasopressina e o corpo devolve mais do que recebeu. Continua
   podendo ser registrada, porque o diário existe para registrar o que
   aconteceu; só não entra no total. E a tela diz por quê, em vez de
   somar zero em silêncio.
   ============================================================ */

export type Bebida = {
  id: string;
  nome: string;
  ic: string;
  /** entra no total do dia */
  conta: boolean;
  /** dito na tela quando a bebida precisa de ressalva */
  nota?: string;
  /* OS RECIPIENTES EM QUE ESTA BEBIDA VEM, quando não são os da água.
     Ninguém toma um garrafão de café, e quem tomou uma xícara não sabe
     dizer de cabeça quantos mililitros foram. O atalho só ajuda se o
     nome dele for o que a pessoa teria dito em voz alta. */
  medidas?: [string, number][];
  /* O ALIMENTO QUE ESTA BEBIDA É, quando o volume responde por ele.
     O registro vira também uma refeição, e proteína, caloria e macro
     saem todos da tabela — nenhum número novo nasce aqui. */
  item?: string;
  /** quanto do volume é o alimento: café com leite é meio leite */
  fracao?: number;
  /** o alimento medido em DOSES, e não em volume — ver o shake */
  porDose?: string;
  /** a pessoa escreve o nome: a lista nunca vai estar completa */
  livre?: boolean;
};

/* Copo, garrafa, garrafão: o que existe na cozinha de qualquer um. */
export const MEDIDAS_PADRAO: [string, number][] = [
  ['Copo', 250],
  ['Garrafa', 500],
  ['Garrafão', 1000],
];

export const BEBIDAS: Bebida[] = [
  { id: 'agua', nome: 'Água', ic: 'water', conta: true },
  { id: 'cafe', nome: 'Café', ic: 'coffee', conta: true, medidas: [['Xícara', 150], ['Caneca', 300], ['Garrafa', 500]] },
  /* O PINGADO CONTA O LEITE QUE TEM DENTRO.

     Metade e metade é a proporção do café com leite de padaria, e é
     dela que sai o item: 200 ml levam 100 ml de leite, com a proteína e
     a caloria que a tabela dá para 100 ml de leite. Quem toma mais
     forte ou mais fraco corrige a refeição depois — o que não dava para
     fazer antes era registrar o leite sem escrever tudo duas vezes. */
  {
    id: 'cafe-leite', nome: 'Café com leite', ic: 'coffee', conta: true,
    item: 'leite', fracao: 0.5,
    medidas: [['Xícara', 150], ['Caneca', 300], ['Copo', 250]],
  },
  { id: 'cha', nome: 'Chá', ic: 'leaf', conta: true, medidas: [['Xícara', 150], ['Caneca', 300], ['Garrafa', 500]] },
  { id: 'coco', nome: 'Água de coco', ic: 'drop2', conta: true, medidas: [['Copo', 250], ['Caixinha', 200], ['Garrafa', 500]] },
  /* O leite e o suco TAMBÉM SÃO COMIDA, e o volume responde por eles:
     250 ml de leite têm a proteína e a caloria que a tabela diz que 250
     ml de leite têm. Por isso eles trazem o id do alimento — o registro
     de um vira registro dos dois, e a pessoa não escreve nada duas
     vezes. */
  { id: 'leite', nome: 'Leite', ic: 'milk', conta: true, item: 'leite', medidas: [['Copo', 250], ['Caneca', 300], ['Garrafa', 500]] },
  { id: 'suco', nome: 'Suco', ic: 'citrus', conta: true, item: 'suco-laranja', medidas: [['Copo', 250], ['Lata', 350], ['Garrafa', 500]] },
  /* O SHAKE PRECISA DE UM SEGUNDO CAMPO, e é o único que precisa.

     A proteína dele não se deduz do volume: 300 ml com uma dose dão 24 g
     e com duas dão 48, e o copo é o mesmo. Quem responde é a dose, então
     a tela pergunta a dose — e a conta sai da mesma tabela de alimentos
     que o resto do app usa, onde um scoop são 30 g de whey. */
  {
    id: 'shake',
    nome: 'Shake ou whey',
    ic: 'shaker',
    conta: true,
    porDose: 'whey',
    medidas: [['Copo', 250], ['Coqueteleira', 400], ['Garrafa', 500]],
  },
  { id: 'refri', nome: 'Refrigerante', ic: 'soda', conta: true, medidas: [['Copo', 250], ['Lata', 350], ['Garrafa', 600]] },
  {
    id: 'alcool',
    nome: 'Bebida alcoólica',
    ic: 'wine',
    conta: false,
    medidas: [['Taça', 150], ['Lata', 350], ['Long neck', 355]],
    nota: 'Fica registrada, mas não entra no total: o álcool faz o corpo devolver mais líquido do que recebeu.',
  },
  /* OUTRO EXISTE PORQUE A LISTA NUNCA VAI ESTAR COMPLETA. Kombucha,
     isotônico, caldo de cana, o suco que a avó fez. O líquido conta —
     é o que essa tela mede —, e o que a pessoa escreveu fica no diário
     no lugar do nome genérico. O que o app não faz é adivinhar o que
     tem dentro. */
  { id: 'outro', nome: 'Outro', ic: 'more', conta: true, livre: true },
];

/* ÁGUA É O PADRÃO, e é o que todo registro antigo é.

   Os goles gravados antes desta tela existir não têm bebida nenhuma
   guardada. Eles são água — era a única coisa que dava para registrar. */
export const BEBIDA_PADRAO = 'agua';

export function bebidaDe(id?: string | null): Bebida {
  return BEBIDAS.find((b) => b.id === id) ?? BEBIDAS[0];
}

export const medidasDe = (b: Bebida) => b.medidas ?? MEDIDAS_PADRAO;
