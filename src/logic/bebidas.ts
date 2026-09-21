import { RECIPIENTES_IMP, type Sistema } from './medidas';
import { T } from '../textos';
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

/* ⚠️ É FUNÇÃO, E NÃO CONSTANTE, porque lê o catálogo. Constante de
   módulo é avaliada no import e congelaria o idioma. Ver src/textos.

   ⚠️ E O QUE NÃO VEM DO CATÁLOGO: o \`id\`, que é o que fica gravado; o
   \`ic\`, que é desenho; o \`conta\`, que é decisão de fisiologia; e os
   MILILITROS de cada recipiente, que são medida e não palavra — uma
   xícara tem 150 ml em qualquer idioma. */
export const BEBIDAS = (): Bebida[] => {
  const t = T.alimentacao.bebidas;
  const r = t.recipientes;
  return [
  { id: 'agua', nome: t.agua, ic: 'water', conta: true },
  { id: 'cafe', nome: t.cafe, ic: 'coffee', conta: true, medidas: [[r.xicara, 150], [r.caneca, 300], [r.garrafa, 500]] },
  /* O PINGADO CONTA O LEITE QUE TEM DENTRO.

     Metade e metade é a proporção do café com leite de padaria, e é
     dela que sai o item: 200 ml levam 100 ml de leite, com a proteína e
     a caloria que a tabela dá para 100 ml de leite. Quem toma mais
     forte ou mais fraco corrige a refeição depois — o que não dava para
     fazer antes era registrar o leite sem escrever tudo duas vezes. */
  {
    id: 'cafe-leite', nome: t.cafeLeite, ic: 'coffee', conta: true,
    item: 'leite', fracao: 0.5,
    medidas: [[r.xicara, 150], [r.caneca, 300], [r.copo, 250]],
  },
  { id: 'cha', nome: t.cha, ic: 'leaf', conta: true, medidas: [[r.xicara, 150], [r.caneca, 300], [r.garrafa, 500]] },
  { id: 'coco', nome: t.coco, ic: 'drop2', conta: true, medidas: [[r.copo, 250], [r.caixinha, 200], [r.garrafa, 500]] },
  /* O leite e o suco TAMBÉM SÃO COMIDA, e o volume responde por eles:
     250 ml de leite têm a proteína e a caloria que a tabela diz que 250
     ml de leite têm. Por isso eles trazem o id do alimento — o registro
     de um vira registro dos dois, e a pessoa não escreve nada duas
     vezes. */
  { id: 'leite', nome: t.leite, ic: 'milk', conta: true, item: 'leite', medidas: [[r.copo, 250], [r.caneca, 300], [r.garrafa, 500]] },
  { id: 'suco', nome: t.suco, ic: 'citrus', conta: true, item: 'suco-laranja', medidas: [[r.copo, 250], [r.lata, 350], [r.garrafa, 500]] },
  /* O SHAKE PRECISA DE UM SEGUNDO CAMPO, e é o único que precisa.

     A proteína dele não se deduz do volume: 300 ml com uma dose dão 24 g
     e com duas dão 48, e o copo é o mesmo. Quem responde é a dose, então
     a tela pergunta a dose — e a conta sai da mesma tabela de alimentos
     que o resto do app usa, onde um scoop são 30 g de whey. */
  {
    id: 'shake',
    nome: t.shake,
    ic: 'shaker',
    conta: true,
    porDose: 'whey',
    medidas: [[r.copo, 250], [r.coqueteleira, 400], [r.garrafa, 500]],
  },
  { id: 'refri', nome: t.refri, ic: 'soda', conta: true, medidas: [[r.copo, 250], [r.lata, 350], [r.garrafa, 600]] },
  {
    id: 'alcool',
    nome: t.alcool,
    ic: 'wine',
    conta: false,
    medidas: [[r.taca, 150], [r.lata, 350], [r.longNeck, 355]],
    nota: t.notaAlcool,
  },
  /* OUTRO EXISTE PORQUE A LISTA NUNCA VAI ESTAR COMPLETA. Kombucha,
     isotônico, caldo de cana, o suco que a avó fez. O líquido conta —
     é o que essa tela mede —, e o que a pessoa escreveu fica no diário
     no lugar do nome genérico. O que o app não faz é adivinhar o que
     tem dentro. */
  { id: 'outro', nome: t.outro, ic: 'more', conta: true, livre: true },
  ];
};

/* ÁGUA É O PADRÃO, e é o que todo registro antigo é.

   Os goles gravados antes desta tela existir não têm bebida nenhuma
   guardada. Eles são água — era a única coisa que dava para registrar. */
export const BEBIDA_PADRAO = 'agua';

export function bebidaDe(id?: string | null): Bebida {
  const todas = BEBIDAS();
  return todas.find((b) => b.id === id) ?? todas[0];
}

/* ⚠️ OS RECIPIENTES NÃO SE CONVERTEM — TROCAM. Copo, garrafa e garrafão
   são 250, 500 e 1000 ml aqui; convertidos, dariam 8,5, 16,9 e 33,8 fl oz,
   números que ninguém tem em casa e que ninguém soma de cabeça. O copo de
   lá tem outro tamanho, e é ele que a tabela imperial traz. Ver
   RECIPIENTES_IMP, em logic/medidas.

   ⚠️ E SÓ VALE PARA A ÁGUA. Xícara de café, lata de refrigerante e taça de
   vinho já são o que são nos dois sistemas — quem tem medidas próprias
   fica com elas. */
export const medidasDe = (b: Bebida, sistema: Sistema = 'metrico') =>
  b.medidas ?? (sistema === 'imperial' ? RECIPIENTES_IMP : MEDIDAS_PADRAO);
