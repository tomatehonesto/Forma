/* As correções da lista brasileira que saíram da revisão de 29/09/2026.

   A lista antiga está congelada em comidas-base.json, com os números com
   que as refeições antigas foram registradas — e ela continua lá, porque
   cada refeição guarda o próprio rótulo (ItemComida.rotulo) e não depende
   mais dela. O que a revisão achou de errado é corrigido AQUI, por cima,
   e não editando o congelado: assim fica escrito o que mudou e por quê.

   receita  o prato passa a ser somado por esta receita (mesmo formato de
            pratos-novos.mjs, e { taco: n, rend? } para uma linha da TACO)
   gUn/qtd/un/onde   a medida, a porção ou a prateleira que mudam

   O que cada prato CONTÉM para as restrições continua no mapa de
   logic/restricoes, que foi corrigido junto. */
const TACO = (n, rend) => ({ taco: n, ...(rend ? { rend } : {}) });
const CEBOLA = { usda: 11282 };
const AZEITE = { usda: 4053 };
const OLEO = { usda: 4669 };
const DENDE = { usda: 4055 };
const LEITE_COCO = { usda: 12118 };
const MOLHO_TOMATE = { usda: 11549 };
const FARINHA = { usda: 20081 };
const CALDO = { usda: 14411 };
const MAIONESE = { usda: 4025, contem: ['ovo'] };
const NACHOS = { usda: 19056 };

export const CORRECOES = {
  /* ---- receitas que faltavam o que define o prato ---- */
  /* moqueca e bobó sem leite de coco e dendê não são moqueca e bobó */
  moqueca: { receita: [['merluza', 150], ['tomate', 40], [CEBOLA, 20], [LEITE_COCO, 50], [DENDE, 10]] },
  'bobo-camarao': { receita: [['camarao', 90], ['mandioca', 140], [LEITE_COCO, 60], [DENDE, 10]] },
  /* "alho e óleo" sem o óleo */
  'macarrao-alho': { receita: [['macarrao', 180], ['parmesao', 10], [AZEITE, 15]] },
  /* o nhoque era batata pura: a massa leva farinha e ovo */
  nhoque: { receita: [['batata', 170], [FARINHA, 45], [TACO(489), 10], [MOLHO_TOMATE, 60], ['parmesao', 15]] },
  /* era o número de uma empada (massa podre, pouco recheio) */
  'torta-frango': { receita: [[FARINHA, 40], ['manteiga', 15], [TACO(489), 10], [TACO(404), 60], ['milho', 10], ['tomate', 15]], un: 'fatia-torta' },
  /* sopa sem caldo: o número por 100 g saía duas vezes e meia o real */
  canja: { receita: [['arroz', 60], [TACO(404), 70], [CALDO, 200]], un: 'tigela' },
  /* o miojo pesado seco, sem o caldo */
  'ramen-carne': { receita: [[TACO(39), 80], [TACO(328), 50], [TACO(489), 50], [CALDO, 300]] },
  /* falafel, pastel e o peixe do fish and chips são fritos */
  falafel: { receita: [[TACO(575, 2.4), 120], [TACO(35), 20], [OLEO, 15]] },
  'pastel-carne': { receita: [[FARINHA, 45], [OLEO, 15], ['carne-moida', 30]] },
  'pastel-queijo': { receita: [[FARINHA, 45], [OLEO, 15], ['mussarela', 30]] },
  /* a massa era de pão sovado; um croissant sozinho tem o dobro da gordura */
  'croissant-presunto-queijo': { receita: [['croissant', 60], ['presunto', 25], ['mussarela', 25]] },
  /* homus sem tahine e azeite era grão-de-bico */
  'homus-pao': { receita: [['homus', 80], ['pao-sirio', 60]] },
  /* os nachos eram farinha de milho crua */
  'guacamole-nachos': { receita: [['abacate', 80], [NACHOS, 40]] },
  /* a tortilha leva azeite, e a fatia de 250 g era grande demais */
  'tortilla-espanhola': { receita: [[TACO(489), 60], ['batata', 80], [AZEITE, 10]], un: 'fatia-torta' },
  /* o de atum vem com maionese */
  'sanduiche-atum': { receita: [[TACO(52), 50], ['atum-lata', 55], ['tomate', 20], [MAIONESE, 15]] },
  /* o "crepe de queijo" levava presunto */
  'crepe-queijo': { receita: [[TACO(37), 90], ['mussarela', 60]] },
  /* a soma saía sem caloria, com todos os componentes medidos */
  'mac-and-cheese': { receita: [['macarrao', 150], ['queijo-prato', 50], ['leite', 80]] },

  /* ---- porções ---- */
  /* o peso escorrido, e não o da lata cheia */
  'sardinha-lata': { gUn: 84 },
  'atum-lata': { gUn: 120 },

  /* ---- prateleiras ---- */
  coxinha: { onde: 'Doces e lanches' },
  pacoca: { onde: 'Doces e lanches' },

  /* ---- medidas: fatia de pizza, torta e bolo é "part" em francês e
     "Stück" em alemão; empanado é "Stück" em alemão; sopa vem em tigela ---- */
  'bolo-chocolate': { un: 'fatia-torta' },
  'quiche-queijo': { un: 'fatia-torta' },
  'pizza-mussarela': { un: 'fatia-torta' },
  'pizza-calabresa': { un: 'fatia-torta' },
  'pizza-frango': { un: 'fatia-torta' },
  'pizza-portuguesa': { un: 'fatia-torta' },
  'frango-milanesa': { un: 'filé-empanado' },
  'bife-milanesa': { un: 'filé-empanado' },
  'parmegiana-frango': { un: 'filé-empanado' },
  'parmegiana-carne': { un: 'filé-empanado' },
  'sopa-legumes': { un: 'tigela' },
  'sopa-feijao': { un: 'tigela' },
  'sopa-carne': { un: 'tigela' },
  'chili-carne': { un: 'tigela' },
  'mingau-aveia': { un: 'tigela' },
};
