/* Os pratos que a lista ganhou quando deixou de ser só brasileira.

   Todos são SOMADOS, como os pratos montados da lista brasileira: cada
   componente entra com o peso que tem no prato pronto, e o perfil de
   100 g sai da soma dividida pelo peso total. A receita fica escrita no
   item gerado (`fonte`), para a conta poder ser conferida.

   Um componente é:
     'id'            uma comida da lista, já como se come (cozida,
                     grelhada) — os números dela;
     { usda: n }     uma linha da SR Legacy que não é comida de lista
                     (cebola, azeite, molho de tomate, farinha), com o que
                     ela contém para as restrições quando contém algo.

   As gramaturas são de uma porção de restaurante, e erram para mais ou
   para menos conforme a mão de quem cozinhou — por isso a tela escreve
   "~". A regra da lista brasileira vale aqui: só prato que sai do fogo
   já misturado. Prato mais acompanhamento são dois itens.

   nomes: [português, inglês, espanhol, francês, alemão, italiano]. */
const CEBOLA = { usda: 11282 };
const AZEITE = { usda: 4053 };
const OLEO = { usda: 4669 };
const MOLHO_TOMATE = { usda: 11549 };
const MOLHO_MARINARA = { usda: 6931 };
const CREME_LEITE = { usda: 1053, contem: ['leite'] };
const FARINHA_ROSCA = { usda: 18079 };
const FARINHA = { usda: 20081 };
const KETCHUP = { usda: 11935 };
const LEITE_COCO = { usda: 12118 };
const PESTO = { usda: 6626, contem: ['leite'] };
const MOLHO_CAESAR = { usda: 43015, contem: ['ovo', 'peixe', 'leite'] };
const CALDO = { usda: 14411 };
const SHOYU = { usda: 16123 };
const ALFACE = { usda: 11251 };

export const PRATOS_NOVOS = [
  /* --- alemã e austríaca -------------------------------------------- */
  { id: 'schnitzel', un: 'filé', nomes: ['Schnitzel (bife de porco empanado)', 'Pork schnitzel', 'Escalope de cerdo empanizado', 'Escalope de porc pané', 'Schweineschnitzel', 'Cotoletta di maiale impanata'],
    receita: [['pernil-magro', 120], ['ovo-cozido', 15], [FARINHA_ROSCA, 20], [OLEO, 10]] },
  { id: 'currywurst', un: 'porção', nomes: ['Currywurst', 'Currywurst', 'Currywurst', 'Currywurst', 'Currywurst', 'Currywurst'],
    receita: [['bratwurst', 100], [KETCHUP, 40]] },
  { id: 'gulasch', un: 'prato', nomes: ['Goulash de carne', 'Beef goulash', 'Goulash de res', 'Goulash de bœuf', 'Rindergulasch', 'Gulasch di manzo'],
    receita: [['carne-panela', 140], [CEBOLA, 50], [MOLHO_TOMATE, 60], [OLEO, 5]] },
  { id: 'kaesespaetzle', un: 'prato', nomes: ['Käsespätzle (massa com queijo)', 'Käsespätzle (cheese noodles)', 'Käsespätzle (pasta con queso)', 'Käsespätzle (pâtes au fromage)', 'Käsespätzle', 'Käsespätzle (gnocchetti al formaggio)'],
    receita: [['macarrao-ovo', 200], ['emmental', 45], [CEBOLA, 20], ['manteiga', 5]] },
  { id: 'salada-batata', un: 'porção', nomes: ['Salada de batata', 'Potato salad', 'Ensalada de papa', 'Salade de pommes de terre', 'Kartoffelsalat', 'Insalata di patate'],
    receita: [['batata', 160], [CEBOLA, 20], [OLEO, 8]] },

  /* --- francesa ----------------------------------------------------- */
  { id: 'ratatouille', un: 'porção', nomes: ['Ratatouille', 'Ratatouille', 'Ratatouille', 'Ratatouille', 'Ratatouille', 'Ratatouille'],
    receita: [['berinjela', 80], ['abobrinha', 80], ['pimentao', 40], ['tomate', 60], [AZEITE, 8]] },
  { id: 'boeuf-bourguignon', un: 'prato', nomes: ['Boeuf bourguignon (carne ao vinho)', 'Beef bourguignon', 'Res a la borgoñona', 'Bœuf bourguignon', 'Burgunderbraten', 'Manzo alla borgognona'],
    receita: [['carne-panela', 150], ['cogumelo', 40], ['cenoura', 30], [CEBOLA, 30], ['bacon', 10]] },
  { id: 'coq-au-vin', un: 'prato', nomes: ['Coq au vin (frango ao vinho)', 'Coq au vin', 'Pollo al vino', 'Coq au vin', 'Coq au Vin', 'Pollo al vino'],
    receita: [['sobrecoxa', 150], ['cogumelo', 40], ['bacon', 10], [CEBOLA, 30]] },
  { id: 'salada-nicoise', un: 'prato', nomes: ['Salada niçoise', 'Niçoise salad', 'Ensalada nizarda', 'Salade niçoise', 'Salat Niçoise', 'Insalata nizzarda'],
    receita: [[ALFACE, 60], ['atum-lata', 80], ['ovo-cozido', 50], ['tomate', 60], ['vagem', 40], ['batata', 60], ['azeitona', 12], [AZEITE, 8]] },
  { id: 'quiche-lorraine', un: 'fatia', nomes: ['Quiche lorraine', 'Quiche lorraine', 'Quiche lorraine', 'Quiche lorraine', 'Quiche Lorraine', 'Quiche lorraine'],
    receita: [[FARINHA, 35], ['manteiga', 15], ['ovo-cozido', 55], [CREME_LEITE, 40], ['bacon', 20], ['emmental', 15]] },

  /* --- italiana ----------------------------------------------------- */
  { id: 'espaguete-sugo', un: 'prato', nomes: ['Espaguete ao sugo', 'Spaghetti with tomato sauce', 'Espagueti con salsa de tomate', 'Spaghetti à la sauce tomate', 'Spaghetti mit Tomatensoße', 'Spaghetti al pomodoro'],
    receita: [['macarrao', 200], [MOLHO_MARINARA, 90], ['parmesao', 5]] },
  { id: 'massa-pesto', un: 'prato', nomes: ['Massa ao pesto', 'Pasta with pesto', 'Pasta al pesto', 'Pâtes au pesto', 'Nudeln mit Pesto', 'Pasta al pesto'],
    receita: [['macarrao', 200], [PESTO, 30]] },
  { id: 'risoto-cogumelos', un: 'prato', nomes: ['Risoto de cogumelos', 'Mushroom risotto', 'Risotto de champiñones', 'Risotto aux champignons', 'Pilzrisotto', 'Risotto ai funghi'],
    receita: [['arroz', 200], ['cogumelo', 70], ['parmesao', 10], ['manteiga', 8]] },
  { id: 'minestrone', un: 'prato', nomes: ['Minestrone', 'Minestrone', 'Minestrone', 'Minestrone', 'Minestrone', 'Minestrone'],
    receita: [['sopa-legumes', 230], ['feijao-branco', 40], ['macarrao', 30]] },
  { id: 'caprese', un: 'porção', nomes: ['Salada caprese', 'Caprese salad', 'Ensalada caprese', 'Salade caprese', 'Caprese', 'Insalata caprese'],
    receita: [['mussarela-fresca', 100], ['tomate', 100], [AZEITE, 8]] },
  { id: 'berinjela-parmegiana', un: 'porção', nomes: ['Berinjela à parmegiana', 'Eggplant parmigiana', 'Berenjenas a la parmesana', 'Aubergines à la parmigiana', 'Auberginen-Parmigiana', 'Parmigiana di melanzane'],
    receita: [['berinjela', 150], [MOLHO_MARINARA, 60], ['mussarela-fresca', 40], ['parmesao', 10], [OLEO, 10]] },

  /* --- espanhola e latino-americana --------------------------------- */
  { id: 'gazpacho', un: 'tigela', nomes: ['Gaspacho', 'Gazpacho', 'Gazpacho', 'Gaspacho', 'Gazpacho', 'Gazpacho'],
    receita: [['tomate', 170], ['pepino', 40], ['pimentao', 30], [AZEITE, 10], ['baguete', 10]] },
  { id: 'patatas-bravas', un: 'porção', nomes: ['Batatas bravas', 'Patatas bravas', 'Papas bravas', 'Patatas bravas', 'Patatas bravas', 'Patate bravas'],
    receita: [['batata-frita', 150], [MOLHO_TOMATE, 40]] },
  { id: 'enchiladas-frango', un: 'porção', nomes: ['Enchiladas de frango', 'Chicken enchiladas', 'Enchiladas de pollo', 'Enchiladas au poulet', 'Hähnchen-Enchiladas', 'Enchiladas di pollo'],
    receita: [['tortilla-milho', 48], ['peito-frango', 80], [MOLHO_TOMATE, 60], ['cheddar', 25], ['creme-azedo', 15]] },
  { id: 'fajitas-frango', un: 'porção', nomes: ['Fajitas de frango', 'Chicken fajitas', 'Fajitas de pollo', 'Fajitas au poulet', 'Hähnchen-Fajitas', 'Fajitas di pollo'],
    receita: [['tortilla-trigo', 48], ['peito-frango', 90], ['pimentao', 40], [CEBOLA, 30], [OLEO, 5]] },
  { id: 'lomo-saltado', un: 'prato', nomes: ['Lomo saltado', 'Lomo saltado (Peruvian beef stir-fry)', 'Lomo saltado', 'Lomo saltado (sauté de bœuf péruvien)', 'Lomo saltado (peruanisches Rindfleisch)', 'Lomo saltado (manzo saltato peruviano)'],
    receita: [['alcatra-grelhada', 120], ['batata-frita', 80], ['tomate', 50], [CEBOLA, 40], [SHOYU, 10]] },

  /* --- inglesa e americana ------------------------------------------ */
  { id: 'fish-and-chips', un: 'porção', nomes: ['Peixe com fritas (fish and chips)', 'Fish and chips', 'Pescado con papas fritas', 'Fish and chips', 'Fish and Chips', 'Fish and chips'],
    receita: [['pescada', 150], ['batata-frita', 150]] },
  { id: 'shepherds-pie', un: 'porção', nomes: ['Torta de carne com purê', 'Shepherd’s pie', 'Pastel de carne con puré', 'Hachis parmentier', 'Shepherd’s Pie', 'Pasticcio di carne e purè'],
    receita: [['carne-moida', 120], ['pure-batata', 150], ['cenoura', 30], ['ervilha', 20]] },
  { id: 'ensopado-carne', un: 'prato', nomes: ['Ensopado de carne com batata', 'Beef stew', 'Estofado de res con papas', 'Ragoût de bœuf aux pommes de terre', 'Rindfleischeintopf', 'Spezzatino di manzo con patate'],
    receita: [['carne-panela', 130], ['batata', 80], ['cenoura', 50], [CEBOLA, 30]] },
  { id: 'salada-caesar', un: 'prato', nomes: ['Salada caesar com frango', 'Chicken Caesar salad', 'Ensalada César con pollo', 'Salade César au poulet', 'Caesar Salad mit Hähnchen', 'Insalata Caesar con pollo'],
    receita: [[ALFACE, 100], ['peito-frango', 100], ['parmesao-lasca', 10], ['torrada', 16], [MOLHO_CAESAR, 25]] },
  { id: 'overnight-oats', un: 'pote', nomes: ['Overnight oats (aveia de geladeira)', 'Overnight oats', 'Avena remojada (overnight oats)', 'Porridge froid (overnight oats)', 'Overnight Oats', 'Overnight oats'],
    receita: [['aveia', 40], ['leite', 150], ['chia', 10], ['banana', 50]], onde: 'Café da manhã' },

  /* --- asiática, indiana e mediterrânea ----------------------------- */
  { id: 'curry-frango', un: 'prato', nomes: ['Curry de frango', 'Chicken curry', 'Curry de pollo', 'Curry de poulet', 'Hähnchen-Curry', 'Curry di pollo'],
    receita: [['sobrecoxa', 130], [CEBOLA, 40], [MOLHO_TOMATE, 50], [LEITE_COCO, 60], [OLEO, 5]] },
  { id: 'butter-chicken', un: 'prato', nomes: ['Frango na manteiga (butter chicken)', 'Butter chicken', 'Pollo a la mantequilla', 'Poulet au beurre (butter chicken)', 'Butter Chicken', 'Pollo al burro (butter chicken)'],
    receita: [['peito-frango', 130], [CREME_LEITE, 30], ['manteiga', 10], [MOLHO_TOMATE, 60]] },
  { id: 'frango-teriyaki', un: 'prato', nomes: ['Frango teriyaki', 'Chicken teriyaki', 'Pollo teriyaki', 'Poulet teriyaki', 'Teriyaki-Hähnchen', 'Pollo teriyaki'],
    receita: [['sobrecoxa', 150], [SHOYU, 15], ['mel', 10]] },
  { id: 'salmao-teriyaki', un: 'posta', nomes: ['Salmão teriyaki', 'Salmon teriyaki', 'Salmón teriyaki', 'Saumon teriyaki', 'Teriyaki-Lachs', 'Salmone teriyaki'],
    receita: [['salmao', 140], [SHOYU, 15], ['mel', 10]] },
  { id: 'pho', un: 'tigela', nomes: ['Pho (sopa vietnamita)', 'Pho', 'Pho (sopa vietnamita)', 'Phở', 'Pho', 'Pho (zuppa vietnamita)'],
    receita: [['macarrao-arroz', 150], ['alcatra-grelhada', 60], [CALDO, 300], [CEBOLA, 10]] },
  { id: 'dal', un: 'prato', nomes: ['Dal (lentilha indiana)', 'Dal (Indian lentils)', 'Dal (lentejas a la india)', 'Dal (lentilles à l’indienne)', 'Dal (indische Linsen)', 'Dal (lenticchie all’indiana)'],
    receita: [['lentilha', 200], [CEBOLA, 30], ['tomate', 40], [OLEO, 8]] },
  { id: 'salada-grega', un: 'prato', nomes: ['Salada grega', 'Greek salad', 'Ensalada griega', 'Salade grecque', 'Griechischer Salat', 'Insalata greca'],
    receita: [['tomate', 100], ['pepino', 80], ['feta', 40], ['azeitona', 12], [CEBOLA, 20], [AZEITE, 10]] },
  { id: 'moussaka', un: 'porção', nomes: ['Moussaka', 'Moussaka', 'Musaka', 'Moussaka', 'Moussaka', 'Moussaka'],
    receita: [['berinjela', 120], ['carne-moida', 80], [MOLHO_TOMATE, 40], ['leite', 60], ['manteiga', 5], [FARINHA, 5]] },
  { id: 'cuscuz-legumes', un: 'prato', nomes: ['Cuscuz marroquino com legumes', 'Couscous with vegetables', 'Cuscús con verduras', 'Couscous aux légumes', 'Couscous mit Gemüse', 'Cuscus con verdure'],
    receita: [['cuscuz-marroquino', 150], ['abobrinha', 60], ['cenoura', 40], ['grao-de-bico', 40], [AZEITE, 5]] },
];
