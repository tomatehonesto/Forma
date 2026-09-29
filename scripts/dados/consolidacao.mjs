/* UMA ENTRADA POR ALIMENTO — a decisão de 29/09/2026.

   O dicionário tinha o mesmo alimento em vários preparos: cenoura cozida
   e crua, espinafre refogado e cru, batata cozida, frita, assada e em
   purê, ovo cozido e frito. Quem procurava "cenoura" escolhia entre duas
   linhas que diziam quase a mesma coisa. Agora o dicionário tem uma
   entrada por alimento, com o nome simples:

   - o que se come cru (fruta, folha) traz o número do alimento cru;
   - o que precisa de fogo (carne, grão, feijão, massa, tubérculo) traz o
     número do preparo simples, sem óleo — a tela do alimento diz qual
     (\`preparo\`, que o gerador lê da descrição da própria tabela);
   - o frito é o alimento mais o óleo, que está em "Molhos e gorduras".

   O CORTE NÃO É PREPARO. Patinho, picanha e costela são alimentos
   diferentes: com a proteína parecida, a costela tem o dobro das
   calorias do patinho. Eles continuam separados.

   O que sai da lista não é apagado:
     oculto  some do dicionário e da busca de refeição, e continua
             existindo por dentro — as refeições antigas guardam o
             rótulo, mas as receitas, a semente e a hidratação citam o id;
     prato   sai do dicionário e continua na busca de refeição: a
             fritura comum (batata frita, ovo frito, milanesa) é algo que
             a pessoa registra pelo nome, e o prato já é somado.

   nomes: [português, inglês, espanhol, francês, alemão, italiano].
   taco: troca a linha da TACO de onde saem os números. */
export const CONSOLIDACAO = {
  /* ---- carnes e aves: o nome do corte, sem o preparo ---- */
  'peito-frango': { nomes: ['Peito de frango', 'Chicken breast', 'Pechuga de pollo', 'Blanc de poulet', 'Hähnchenbrust', 'Petto di pollo'] },
  'frango-assado': { nomes: ['Frango inteiro, sem pele', 'Whole chicken, skinless', 'Pollo entero sin piel', 'Poulet entier sans peau', 'Ganzes Hähnchen ohne Haut', 'Pollo intero senza pelle'] },
  sobrecoxa: { nomes: ['Coxa e sobrecoxa de frango', 'Chicken thigh and drumstick', 'Muslo y pierna de pollo', 'Cuisse de poulet', 'Hähnchenschenkel', 'Coscia di pollo'] },
  patinho: { nomes: ['Patinho', 'Lean beef (knuckle)', 'Carne de res magra (pierna)', 'Bœuf maigre (tranche grasse)', 'Mageres Rindfleisch (Kugel)', 'Manzo magro (noce)'] },
  contrafile: { nomes: ['Contra-filé', 'Strip steak', 'Lomo de res (contra-filé)', 'Faux-filet', 'Rumpsteak', 'Controfiletto'] },
  'file-mignon': { nomes: ['Filé mignon', 'Beef tenderloin', 'Filete de res', 'Filet de bœuf', 'Rinderfilet', 'Filetto di manzo'] },
  /* a picanha se come com a capa de gordura */
  picanha: { taco: 381, nomes: ['Picanha', 'Picanha (top sirloin cap)', 'Picaña', 'Picanha (aiguillette baronne)', 'Picanha (Tafelspitz)', 'Picanha (codone)'] },
  'carne-moida': { nomes: ['Carne moída', 'Ground beef', 'Carne molida', 'Bœuf haché', 'Rinderhack', 'Carne macinata di manzo'] },
  'carne-panela': { nomes: ['Paleta bovina', 'Beef shoulder', 'Paleta de res', 'Paleron de bœuf', 'Rinderschulter', 'Spalla di manzo'] },
  musculo: { nomes: ['Músculo bovino', 'Beef shank', 'Jarrete de res (chambarete)', 'Jarret de bœuf', 'Rinderhesse', 'Muscolo di manzo'] },
  lombo: { nomes: ['Lombo de porco', 'Pork loin', 'Lomo de cerdo', 'Longe de porc', 'Schweinelende', 'Lonza di maiale'] },
  pernil: { nomes: ['Pernil de porco', 'Pork leg', 'Pierna de cerdo', 'Cuisse de porc', 'Schweinekeule', 'Cosciotto di maiale'] },
  costelinha: { nomes: ['Costelinha de porco', 'Pork ribs', 'Costillas de cerdo', 'Travers de porc', 'Schweinerippchen', 'Costine di maiale'] },
  'coxao-mole': { nomes: ['Coxão mole', 'Beef top round', 'Carne de res, corte de pierna', 'Tende de tranche', 'Rind, Oberschale', 'Fesa di manzo'] },
  figado: { nomes: ['Fígado bovino', 'Beef liver', 'Hígado de res', 'Foie de bœuf', 'Rinderleber', 'Fegato di manzo'] },
  peru: { nomes: ['Peru', 'Turkey', 'Pavo', 'Dinde', 'Truthahn', 'Tacchino'] },
  'alcatra-grelhada': { nomes: ['Alcatra', 'Top sirloin', 'Cuadril de res', 'Rumsteck', 'Hüftsteak', 'Scamone'] },
  cordeiro: { nomes: ['Cordeiro', 'Lamb', 'Cordero', 'Agneau', 'Lamm', 'Agnello'] },
  'costeleta-porco': { nomes: ['Costeleta de porco', 'Pork chop', 'Chuleta de cerdo', 'Côte de porc', 'Schweinekotelett', 'Braciola di maiale'] },
  pato: { nomes: ['Pato', 'Duck', 'Pato', 'Canard', 'Ente', 'Anatra'] },
  bacon: { nomes: ['Bacon', 'Bacon', 'Tocino', 'Bacon', 'Speck', 'Pancetta'] },
  'pernil-magro': { oculto: true },
  'frango-milanesa': { prato: true },
  almondega: { prato: true },
  quibe: { prato: true },
  coxinha: { prato: true },

  /* ---- peixes e frutos do mar ---- */
  salmao: { nomes: ['Salmão', 'Salmon', 'Salmón', 'Saumon', 'Lachs', 'Salmone'] },
  merluza: { nomes: ['Merluza', 'Hake', 'Merluza', 'Merlu', 'Seehecht', 'Nasello'] },
  sardinha: { nomes: ['Sardinha', 'Sardine', 'Sardina', 'Sardine', 'Sardine', 'Sardina'] },
  corvina: { nomes: ['Corvina', 'Croaker', 'Corvina', 'Maigre', 'Umberfisch', 'Ombrina'] },
  camarao: { nomes: ['Camarão', 'Shrimp', 'Camarones', 'Crevettes', 'Garnelen', 'Gamberi'] },
  'atum-fresco': { nomes: ['Atum fresco', 'Fresh tuna', 'Atún fresco', 'Thon frais', 'Frischer Thunfisch', 'Tonno fresco'] },
  'bacalhau-fresco': { nomes: ['Bacalhau fresco', 'Cod', 'Bacalao fresco', 'Cabillaud', 'Kabeljau', 'Merluzzo'] },
  tilapia: { nomes: ['Tilápia', 'Tilapia', 'Tilapia', 'Tilapia', 'Tilapia', 'Tilapia'] },
  truta: { nomes: ['Truta', 'Trout', 'Trucha', 'Truite', 'Forelle', 'Trota'] },
  cavala: { nomes: ['Cavala', 'Mackerel', 'Caballa', 'Maquereau', 'Makrele', 'Sgombro'] },
  mexilhao: { nomes: ['Mexilhão', 'Mussels', 'Mejillones', 'Moules', 'Miesmuscheln', 'Cozze'] },
  polvo: { nomes: ['Polvo', 'Octopus', 'Pulpo', 'Poulpe', 'Oktopus', 'Polpo'] },
  pescada: { prato: true },
  bacalhau: { prato: true },
  manjuba: { prato: true },
  lula: { prato: true },

  /* ---- ovos ---- */
  'ovo-cozido': { nomes: ['Ovo', 'Egg', 'Huevo', 'Œuf', 'Ei', 'Uovo'] },
  'ovo-frito': { prato: true },
  omelete: { prato: true },

  /* ---- grãos, arroz, massas ---- */
  lentilha: { nomes: ['Lentilha', 'Lentils', 'Lentejas', 'Lentilles', 'Linsen', 'Lenticchie'] },
  'grao-de-bico': { nomes: ['Grão-de-bico', 'Chickpeas', 'Garbanzos', 'Pois chiches', 'Kichererbsen', 'Ceci'] },
  'feijao-branco': { nomes: ['Feijão-branco', 'White beans', 'Frijoles blancos', 'Haricots blancs', 'Weiße Bohnen', 'Fagioli cannellini'] },
  'feijao-vermelho': { nomes: ['Feijão-vermelho', 'Kidney beans', 'Frijoles rojos', 'Haricots rouges', 'Kidneybohnen', 'Fagioli rossi'] },
  quinoa: { nomes: ['Quinoa', 'Quinoa', 'Quinoa', 'Quinoa', 'Quinoa', 'Quinoa'] },
  macarrao: { nomes: ['Macarrão', 'Pasta', 'Pasta', 'Pâtes', 'Nudeln', 'Pasta'] },
  'macarrao-integral': { nomes: ['Macarrão integral', 'Whole wheat pasta', 'Pasta integral', 'Pâtes complètes', 'Vollkornnudeln', 'Pasta integrale'] },
  'macarrao-arroz': { nomes: ['Macarrão de arroz', 'Rice noodles', 'Fideos de arroz', 'Nouilles de riz', 'Reisnudeln', 'Spaghetti di riso'] },
  'macarrao-ovo': { nomes: ['Macarrão com ovos', 'Egg noodles', 'Fideos de huevo', 'Nouilles aux œufs', 'Eiernudeln', 'Pasta all’uovo'] },
  bulgur: { nomes: ['Triguilho (bulgur)', 'Bulgur', 'Bulgur', 'Boulgour', 'Bulgur', 'Bulgur'] },
  'arroz-agulha': { oculto: true },

  /* ---- verduras e tubérculos: in natura quando se come cru ---- */
  'cenoura-crua': { nomes: ['Cenoura', 'Carrot', 'Zanahoria', 'Carotte', 'Karotte', 'Carota'] },
  cenoura: { oculto: true },
  'espinafre-cru': { nomes: ['Espinafre', 'Spinach', 'Espinacas', 'Épinards', 'Spinat', 'Spinaci'] },
  espinafre: { oculto: true },
  beterraba: { nomes: ['Beterraba', 'Beet', 'Remolacha', 'Betterave', 'Rote Bete', 'Barbabietola'] },
  couve: { nomes: ['Couve', 'Collard greens', 'Col rizada (berza)', 'Chou vert', 'Grünkohl', 'Cavolo nero'] },
  abobora: { nomes: ['Abóbora', 'Pumpkin', 'Calabaza', 'Potiron', 'Kürbis', 'Zucca'] },
  chuchu: { nomes: ['Chuchu', 'Chayote', 'Chayote', 'Chayote', 'Chayote', 'Chayote'] },
  mandioca: { nomes: ['Mandioca', 'Cassava', 'Yuca', 'Manioc', 'Maniok', 'Manioca'] },
  batata: { nomes: ['Batata', 'Potato', 'Papa', 'Pomme de terre', 'Kartoffel', 'Patata'] },
  cogumelo: { nomes: ['Cogumelo', 'Mushrooms', 'Champiñones', 'Champignons', 'Champignons', 'Funghi'] },
  'mandioca-frita': { prato: true },
  'batata-frita': { prato: true },
  'pure-batata': { prato: true },
  'batata-assada': { oculto: true },

  /* ---- sucos e suplementos saem das listas; a hidratação usa o suco
     de laranja e o whey (logic/bebidas), e por isso eles ficam por
     dentro ---- */
  'suco-laranja': { oculto: true },
  'suco-maca': { oculto: true },
  whey: { oculto: true },
  'barra-proteina': { oculto: true },
};
