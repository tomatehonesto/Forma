/* Gera src/logic/alimentos.ts a partir da TACO 4ª ed. (NEPA/UNICAMP).

   Cada linha da curadoria é:
     [tacoId, slug, nome, busca, gUn, qtd, un, unp]        -> da TACO
     [null,  slug, nome, busca, gUn, qtd, un, unp, p, de]  -> de fora

   gUn  gramas de UMA unidade (um filé, uma colher, uma concha)
   qtd  quantas unidades vêm marcadas quando a pessoa escolhe o alimento
   un   a unidade no singular; unp no plural

   A unidade é o coração disso. Perguntar "a porção foi pouca, normal ou
   bastante?" pedia uma comparação com uma régua que só o app conhecia.
   Perguntar "quantas colheres de arroz?" pergunta uma coisa que quem
   comeu viu acontecer.

   O script FALHA se algum id da TACO não tiver proteína numérica: número
   inventado não passa daqui. */
import fs from 'node:fs';

/* A TACO é baixada na hora: 1 MB de JSON não precisa morar no repositório,
   e assim a origem do dado fica explícita no próprio gerador.

     node scripts/gerar-alimentos.mjs src/logic/alimentos.ts
*/
const FONTE = 'https://raw.githubusercontent.com/marcelosanto/tabela_taco/main/TACO.json';
/* TACO_LOCAL aponta para uma cópia em disco, para gerar sem rede. */
const TACO = process.env.TACO_LOCAL
  ? JSON.parse(fs.readFileSync(process.env.TACO_LOCAL, 'utf8'))
  : await fetch(FONTE).then((r) => r.json());

const L = [
  /* --- aves e carnes ------------------------------------------------ */
  [410, 'peito-frango', 'Peito de frango grelhado', 'frango peito file grelhado file de frango', 120, 1, 'filé', 'filés'],
  [403, 'frango-assado', 'Frango assado sem pele', 'frango assado cozido', 120, 1, 'pedaço', 'pedaços'],
  [413, 'sobrecoxa', 'Coxa ou sobrecoxa de frango', 'coxa sobrecoxa frango', 100, 1, 'unidade', 'unidades'],
  [401, 'frango-milanesa', 'Frango à milanesa', 'frango milanesa empanado nuggets', 120, 1, 'filé', 'filés'],
  [377, 'patinho', 'Bife de patinho grelhado', 'bife patinho carne vermelha grelhado', 100, 1, 'bife', 'bifes'],
  [344, 'contrafile', 'Contra-filé grelhado', 'contra file bife carne', 100, 1, 'bife', 'bifes'],
  [358, 'file-mignon', 'Filé mignon grelhado', 'file mignon carne', 100, 1, 'medalhão', 'medalhões'],
  [383, 'picanha', 'Picanha grelhada', 'picanha churrasco carne', 50, 2, 'fatia', 'fatias'],
  [326, 'carne-moida', 'Carne moída refogada', 'carne moida bolonhesa moido', 25, 4, 'colher', 'colheres'],
  [374, 'carne-panela', 'Carne de panela', 'carne panela cozida ensopado paleta', 100, 1, 'porção', 'porções'],
  [371, 'musculo', 'Músculo cozido', 'musculo cozido sopa', 100, 1, 'porção', 'porções'],
  [416, 'hamburguer', 'Hambúrguer', 'hamburguer burguer lanche', 80, 1, 'unidade', 'unidades'],
  [420, 'linguica', 'Linguiça', 'linguica calabresa churrasco', 80, 1, 'gomo', 'gomos'],
  [432, 'lombo', 'Lombo de porco assado', 'lombo porco suino', 100, 1, 'fatia', 'fatias'],
  [435, 'pernil', 'Pernil assado', 'pernil porco suino', 100, 1, 'fatia', 'fatias'],
  [430, 'costelinha', 'Costelinha de porco', 'costela costelinha porco', 60, 2, 'costela', 'costelas'],
  [351, 'coxao-mole', 'Carne cozida (coxão mole)', 'coxao mole carne cozida panela', 100, 1, 'porção', 'porções'],
  [331, 'almondega', 'Almôndegas', 'almondega bolinho de carne', 33, 3, 'unidade', 'unidades'],
  [356, 'figado', 'Fígado acebolado', 'figado bife acebolado', 100, 1, 'bife', 'bifes'],
  [425, 'peru', 'Peru assado', 'peru chester ave natal', 100, 1, 'fatia', 'fatias'],
  [440, 'quibe', 'Quibe assado', 'quibe kibe', 80, 1, 'pedaço', 'pedaços'],
  [439, 'presunto', 'Presunto', 'presunto frios peito de peru', 15, 2, 'fatia', 'fatias'],
  [424, 'mortadela', 'Mortadela', 'mortadela frios', 15, 2, 'fatia', 'fatias'],

  /* --- peixes e frutos do mar --------------------------------------- */
  [315, 'salmao', 'Salmão grelhado', 'salmao peixe', 120, 1, 'posta', 'postas'],
  [301, 'merluza', 'Merluza assada', 'merluza peixe branco assado file', 120, 1, 'filé', 'filés'],
  [308, 'pescada', 'Pescada frita', 'pescada peixe frito tilapia', 120, 1, 'filé', 'filés'],
  [318, 'sardinha', 'Sardinha assada', 'sardinha peixe assada', 50, 2, 'unidade', 'unidades'],
  [319, 'sardinha-lata', 'Sardinha em lata', 'sardinha lata conserva', 160, 1, 'lata', 'latas'],
  [277, 'atum-lata', 'Atum em lata', 'atum lata conserva', 160, 1, 'lata', 'latas'],
  [280, 'bacalhau', 'Bacalhau refogado', 'bacalhau', 120, 1, 'porção', 'porções'],
  [293, 'corvina', 'Corvina assada', 'corvina peixe assado', 120, 1, 'posta', 'postas'],
  [300, 'manjuba', 'Manjuba frita', 'manjuba peixinho frito', 80, 1, 'porção', 'porções'],
  [284, 'camarao', 'Camarão cozido', 'camarao frutos do mar', 100, 1, 'porção', 'porções'],

  /* --- ovos ---------------------------------------------------------- */
  [488, 'ovo-cozido', 'Ovo cozido', 'ovo ovos cozido pochê', 50, 2, 'unidade', 'unidades'],
  [490, 'ovo-frito', 'Ovo frito ou mexido', 'ovo ovos frito mexido mexidos', 50, 2, 'unidade', 'unidades'],
  [484, 'omelete', 'Omelete de queijo', 'omelete omelette', 120, 1, 'unidade', 'unidades'],

  /* --- leite e derivados --------------------------------------------- */
  [448, 'iogurte', 'Iogurte natural', 'iogurte natural grego', 170, 1, 'pote', 'potes'],
  [451, 'iogurte-fruta', 'Iogurte de fruta', 'iogurte morango sabor fruta', 150, 1, 'pote', 'potes'],
  [461, 'queijo-minas', 'Queijo minas frescal', 'queijo minas branco frescal', 50, 1, 'fatia', 'fatias'],
  [463, 'mussarela', 'Mussarela', 'mussarela muçarela queijo', 15, 2, 'fatia', 'fatias'],
  [467, 'queijo-prato', 'Queijo prato', 'queijo prato', 15, 2, 'fatia', 'fatias'],
  [464, 'parmesao', 'Parmesão ralado', 'parmesao queijo ralado', 15, 1, 'colher', 'colheres'],
  [469, 'ricota', 'Ricota', 'ricota queijo', 50, 1, 'fatia', 'fatias'],
  [465, 'requeijao', 'Requeijão', 'requeijao cream cheese', 30, 1, 'colher', 'colheres'],
  /* A TACO marca o leite líquido como não analisado (*). O valor vem da
     TBCA/FCF-USP para leite de vaca integral UHT. */
  [null, 'leite', 'Leite', 'leite copo integral desnatado', 200, 1, 'copo', 'copos', 3.2, 'TBCA'],
  /* Suplemento: não existe tabela de composição para isso, o número é o
     do rótulo típico de whey concentrado. */
  [455, 'achocolatado', 'Leite com achocolatado', 'achocolatado nescau toddy leite', 200, 1, 'copo', 'copos'],
  [null, 'whey', 'Whey protein', 'whey proteina suplemento shake', 30, 1, 'scoop', 'scoops', 80, 'rótulo'],

  /* --- leguminosas ---------------------------------------------------- */
  [561, 'feijao-carioca', 'Feijão carioca', 'feijao carioca caldo', 80, 1, 'concha', 'conchas'],
  [567, 'feijao-preto', 'Feijão preto', 'feijao preto', 80, 1, 'concha', 'conchas'],
  [577, 'lentilha', 'Lentilha cozida', 'lentilha', 80, 1, 'concha', 'conchas'],
  /* Cozidos que a TACO só traz crus. O fator é o rendimento de cocção
     (quanto o grão pesa depois de hidratado), e está escrito aqui para
     que a conta possa ser conferida. */
  [null, 'grao-de-bico', 'Grão-de-bico cozido', 'grao de bico homus', 80, 1, 'concha', 'conchas', +(21.2 / 2.4).toFixed(1), 'TACO 575 ÷ 2,4 de rendimento'],
  [584, 'tofu', 'Tofu', 'tofu soja queijo de soja', 100, 1, 'fatia', 'fatias'],
  [539, 'feijao-tropeiro', 'Feijão tropeiro', 'tropeiro feijao mineiro', 120, 1, 'porção', 'porções'],
  [559, 'ervilha', 'Ervilha', 'ervilha', 20, 3, 'colher', 'colheres'],

  /* --- cereais e acompanhamentos -------------------------------------- */
  [3, 'arroz', 'Arroz branco', 'arroz branco', 30, 4, 'colher', 'colheres'],
  [1, 'arroz-integral', 'Arroz integral', 'arroz integral', 30, 4, 'colher', 'colheres'],
  [null, 'macarrao', 'Macarrão cozido', 'macarrao massa espaguete penne', 150, 1, 'prato', 'pratos', +(10.0 / 2.2).toFixed(1), 'TACO 40 ÷ 2,2 de rendimento'],
  [542, 'macarrao-bolonhesa', 'Macarrão à bolonhesa', 'macarrao bolonhesa molho carne', 200, 1, 'prato', 'pratos'],
  [53, 'pao-frances', 'Pão francês', 'pao frances padaria', 50, 1, 'unidade', 'unidades'],
  [52, 'pao-integral', 'Pão integral de forma', 'pao forma integral', 25, 2, 'fatia', 'fatias'],
  [7, 'aveia', 'Aveia em flocos', 'aveia flocos mingau', 15, 2, 'colher', 'colheres'],
  [551, 'tapioca', 'Tapioca', 'tapioca goma', 90, 1, 'unidade', 'unidades'],
  [533, 'cuscuz', 'Cuscuz de milho', 'cuscuz milho', 120, 1, 'pedaço', 'pedaços'],
  [140, 'pao-de-queijo', 'Pão de queijo', 'pao de queijo', 20, 3, 'unidade', 'unidades'],
  [25, 'cereal', 'Cereal matinal', 'cereal matinal granola sucrilhos', 30, 1, 'xícara', 'xícaras'],
  [526, 'arroz-carreteiro', 'Arroz carreteiro', 'carreteiro arroz com carne', 200, 1, 'prato', 'pratos'],
  [527, 'baiao', 'Baião de dois', 'baiao de dois', 200, 1, 'prato', 'pratos'],
  [54, 'pao-sovado', 'Pão doce ou sovado', 'pao sovado doce bisnaguinha', 50, 1, 'unidade', 'unidades'],
  [48, 'pao-aveia', 'Pão de aveia', 'pao aveia forma', 25, 2, 'fatia', 'fatias'],
  [534, 'cuscuz-paulista', 'Cuscuz paulista', 'cuscuz paulista', 150, 1, 'pedaço', 'pedaços'],

  /* --- pratos prontos -------------------------------------------------- */
  [538, 'estrogonofe', 'Estrogonofe de frango', 'estrogonofe strogonoff frango', 150, 1, 'porção', 'porções'],
  [529, 'bife-a-cavalo', 'Bife à cavalo', 'bife a cavalo', 150, 1, 'porção', 'porções'],
  [386, 'coxinha', 'Coxinha', 'coxinha salgado', 80, 1, 'unidade', 'unidades'],
  [546, 'legumes', 'Legumes cozidos', 'legumes cozidos vapor mistura', 100, 1, 'pires', 'pires'],
  [540, 'feijoada', 'Feijoada', 'feijoada', 250, 1, 'prato', 'pratos'],
  [555, 'virado', 'Virado à paulista', 'virado paulista', 250, 1, 'prato', 'pratos'],
  [537, 'estrogonofe-carne', 'Estrogonofe de carne', 'estrogonofe strogonoff carne', 150, 1, 'porção', 'porções'],
  [556, 'yakisoba', 'Yakisoba', 'yakisoba macarrao oriental', 250, 1, 'prato', 'pratos'],
  [547, 'salpicao', 'Salpicão de frango', 'salpicao', 120, 1, 'porção', 'porções'],
  [536, 'dobradinha', 'Dobradinha', 'dobradinha bucho', 200, 1, 'prato', 'pratos'],
  [553, 'vaca-atolada', 'Vaca atolada', 'vaca atolada costela mandioca', 250, 1, 'prato', 'pratos'],
  [554, 'vatapa', 'Vatapá', 'vatapa', 150, 1, 'porção', 'porções'],
  [525, 'acaraje', 'Acarajé', 'acaraje', 100, 1, 'unidade', 'unidades'],
  [543, 'manicoba', 'Maniçoba', 'manicoba', 200, 1, 'prato', 'pratos'],
  [528, 'barreado', 'Barreado', 'barreado', 200, 1, 'prato', 'pratos'],
  [532, 'charuto', 'Charuto de repolho', 'charuto repolho', 75, 2, 'unidade', 'unidades'],
  [549, 'tabule', 'Tabule', 'tabule', 100, 1, 'porção', 'porções'],

  /* --- verduras, frutas e o resto do prato ------------------------------ */
  [78, 'salada-folhas', 'Salada de folhas', 'salada alface folhas verde rucula', 60, 1, 'prato', 'pratos'],
  [161, 'tomate', 'Tomate', 'tomate', 60, 1, 'unidade', 'unidades'],
  [100, 'brocolis', 'Brócolis', 'brocolis', 80, 1, 'porção', 'porções'],
  [109, 'cenoura', 'Cenoura cozida', 'cenoura', 20, 3, 'colher', 'colheres'],
  [97, 'beterraba', 'Beterraba cozida', 'beterraba', 20, 3, 'colher', 'colheres'],
  [116, 'couve', 'Couve refogada', 'couve mineira', 25, 2, 'colher', 'colheres'],
  [118, 'couve-flor', 'Couve-flor', 'couve flor', 80, 1, 'porção', 'porções'],
  [120, 'espinafre', 'Espinafre refogado', 'espinafre', 30, 2, 'colher', 'colheres'],
  [64, 'abobora', 'Abóbora cozida', 'abobora jerimum cabotia', 100, 1, 'porção', 'porções'],
  [112, 'chuchu', 'Chuchu cozido', 'chuchu', 80, 1, 'porção', 'porções'],
  [162, 'vagem', 'Vagem', 'vagem', 60, 1, 'porção', 'porções'],
  [147, 'quiabo', 'Quiabo', 'quiabo', 60, 1, 'porção', 'porções'],
  [149, 'repolho', 'Repolho', 'repolho', 50, 1, 'pires', 'pires'],
  [142, 'pepino', 'Pepino', 'pepino', 100, 1, 'unidade', 'unidades'],
  [129, 'mandioca', 'Mandioca cozida', 'mandioca aipim macaxeira', 100, 1, 'porção', 'porções'],
  [132, 'mandioca-frita', 'Mandioca frita', 'mandioca frita aipim', 100, 1, 'porção', 'porções'],
  [91, 'batata', 'Batata cozida', 'batata inglesa cozida pure', 120, 1, 'unidade', 'unidades'],
  [93, 'batata-frita', 'Batata frita', 'batata frita fritas', 100, 1, 'porção', 'porções'],
  [88, 'batata-doce', 'Batata doce', 'batata doce', 120, 1, 'pedaço', 'pedaços'],
  [45, 'milho', 'Milho verde', 'milho verde lata', 27, 3, 'colher', 'colheres'],
  [131, 'farofa', 'Farofa', 'farofa farinha mandioca', 15, 2, 'colher', 'colheres'],
  [182, 'banana', 'Banana', 'banana', 90, 1, 'unidade', 'unidades'],
  [221, 'maca', 'Maçã', 'maca fruta', 130, 1, 'unidade', 'unidades'],
  [163, 'abacate', 'Abacate', 'abacate guacamole', 200, 1, 'unidade', 'unidades'],
  [164, 'abacaxi', 'Abacaxi', 'abacaxi', 50, 2, 'fatia', 'fatias'],
  [200, 'goiaba', 'Goiaba', 'goiaba', 100, 1, 'unidade', 'unidades'],
  [214, 'laranja', 'Laranja', 'laranja', 130, 1, 'unidade', 'unidades'],
  [225, 'mamao', 'Mamão', 'mamao papaia formosa', 150, 1, 'fatia', 'fatias'],
  [231, 'manga', 'Manga', 'manga', 150, 1, 'unidade', 'unidades'],
  [235, 'melancia', 'Melancia', 'melancia', 200, 1, 'fatia', 'fatias'],
  [239, 'morango', 'Morango', 'morango', 100, 1, 'xícara', 'xícaras'],
  [256, 'uva', 'Uva', 'uva', 100, 1, 'cacho', 'cachos'],

  /* --- nozes e sementes -------------------------------------------------- */
  [588, 'castanha-caju', 'Castanha de caju', 'castanha caju', 30, 1, 'punhado', 'punhados'],
  [589, 'castanha-para', 'Castanha do Pará', 'castanha para brasil', 7, 3, 'unidade', 'unidades'],
  [558, 'amendoim', 'Amendoim', 'amendoim', 30, 1, 'punhado', 'punhados'],
  [null, 'pasta-amendoim', 'Pasta de amendoim', 'pasta de amendoim peanut', 20, 1, 'colher', 'colheres', 25, 'rótulo'],
  [579, 'pacoca', 'Paçoca', 'pacoca amendoim doce', 25, 1, 'unidade', 'unidades'],
];

const porId = new Map(TACO.map((x) => [x.id, x]));
const erros = [];

/* PRATOS QUE SÃO O PRATO INTEIRO

   A TACO tem feijoada e virado à paulista, mas não tem carbonara nem
   lasanha — e alguém que almoçou carbonara não vai montar "macarrão +
   ovo + bacon + queijo", vai escrever carbonara.

   Então esses são somados aqui, a partir das linhas da TACO dos
   componentes, com a receita escrita junto. Não é palpite: é uma conta
   que dá para conferir, e o campo `fonte` da entrada gerada mostra de
   quais linhas ela saiu.

   As gramaturas são de uma porção de restaurante. Erram para mais ou
   para menos conforme a mão de quem cozinhou — como toda estimativa
   desta tabela, e é por isso que a tela escreve "~". */
const COMPOSTOS = [
  /* O terceiro número de um componente é o rendimento de cocção: a TACO
     traz macarrão só cru, e 180 g de massa NO PRATO não carregam a
     proteína de 180 g de massa seca. Sem isso o carbonara contava massa
     crua e saía 10 g acima. */
  ['carbonara', 'Macarrão à carbonara', 'carbonara massa bacon',
   'prato', 'pratos', [[40, 180, 2.2], [489, 55], [439, 40], [464, 20]]],
  ['lasanha', 'Lasanha', 'lasanha a bolonhesa',
   'pedaço', 'pedaços', [[37, 120], [326, 70], [463, 50]]],
  ['parmegiana', 'Filé à parmegiana', 'parmegiana parmigiana milanesa com queijo',
   'filé', 'filés', [[401, 130], [463, 40], [161, 30]]],
  ['escondidinho', 'Escondidinho', 'escondidinho carne seca purê',
   'porção', 'porções', [[129, 180], [326, 80], [463, 30]]],
  ['pizza', 'Pizza', 'pizza',
   'fatia', 'fatias', [[54, 70], [463, 40], [161, 25]]],
  ['risoto', 'Risoto', 'risoto risotto',
   'prato', 'pratos', [[3, 200], [464, 20], [410, 60]]],
  ['sanduiche-frango', 'Sanduíche de frango', 'sanduiche natural lanche frango',
   'unidade', 'unidades', [[52, 50], [410, 60], [161, 20]]],
  ['crepe', 'Crepe salgado', 'crepe panqueca recheada',
   'unidade', 'unidades', [[37, 90], [326, 50], [463, 30]]],
  ['esfiha', 'Esfiha de carne', 'esfiha esfirra kibe aberto',
   'unidade', 'unidades', [[54, 50], [326, 35]]],
  ['pastel-carne', 'Pastel de carne', 'pastel salgado frito',
   'unidade', 'unidades', [[54, 60], [326, 30]]],
  ['moqueca', 'Moqueca de peixe', 'moqueca peixe dendê',
   'porção', 'porções', [[301, 150], [161, 40]]],
  ['canja', 'Canja de galinha', 'canja sopa de frango',
   'prato', 'pratos', [[3, 60], [404, 70]]],
  ['sopa-legumes', 'Sopa de legumes', 'sopa caldo de legumes',
   'prato', 'pratos', [[546, 250]]],
  ['acai-tigela', 'Açaí na tigela', 'acai tigela',
   'tigela', 'tigelas', [[168, 250], [25, 30], [182, 60]]],
  ['sushi', 'Sushi ou sashimi', 'sushi sashimi temaki japonesa',
   'porção', 'porções', [[3, 90], [315, 70]]],
  ['strogonoff-arroz', 'Estrogonofe com arroz', 'estrogonofe com arroz prato feito',
   'prato', 'pratos', [[538, 150], [3, 120]]],
  ['pf-frango', 'Prato feito de frango', 'pf prato feito frango arroz feijao',
   'prato', 'pratos', [[410, 120], [3, 120], [561, 80], [78, 40]]],
  ['pf-carne', 'Prato feito de carne', 'pf prato feito bife arroz feijao',
   'prato', 'pratos', [[377, 100], [3, 120], [561, 80], [78, 40]]],
  ['misto-quente', 'Misto quente', 'misto quente queijo presunto',
   'unidade', 'unidades', [[52, 50], [463, 30], [439, 30]]],
  ['salada-frango', 'Salada com frango', 'salada com frango caesar',
   'prato', 'pratos', [[78, 80], [410, 90], [161, 40]]],
];

const linhas = L.concat(COMPOSTOS.map(([slug, nome, busca, un, unp, receita]) => {
  /* A proteína de 100 g do prato montado: soma o que cada componente
     entrega e divide pelo peso total. */
  let prot = 0, peso = 0;
  const partes = [];
  for (const [tacoId, gramas, rendimento = 1] of receita) {
    const row = porId.get(tacoId);
    if (!row || typeof row.protein_g !== 'number') {
      erros.push(slug + ': componente ' + tacoId + ' sem proteína numérica');
      continue;
    }
    prot += (row.protein_g / rendimento / 100) * gramas;
    peso += gramas;
    partes.push(tacoId + '×' + gramas + 'g' + (rendimento !== 1 ? '÷' + String(rendimento).replace('.', ',') : ''));
  }
  return [null, slug, nome, busca, peso, 1, un, unp,
    +((prot / peso) * 100).toFixed(1), 'soma TACO ' + partes.join(' + ')];
}));

const linhasTS = linhas.map((l) => {
  const [id, slug, nome, busca, gUn, qtd, un, unp, pFora, origem] = l;
  let p, nota;
  if (id == null) {
    p = pFora;
    nota = origem;
  } else {
    const row = porId.get(id);
    if (!row) { erros.push(slug + ': id ' + id + ' nao existe'); return null; }
    if (typeof row.protein_g !== 'number') { erros.push(slug + ': proteina nao numerica (' + row.protein_g + ') em ' + row.description); return null; }
    p = +row.protein_g.toFixed(1);
    nota = row.description;
  }
  const campos = [
    `id: '${slug}'`,
    `nome: '${nome.replace(/'/g, "\\'")}'`,
    `busca: '${busca}'`,
    `p: ${p}`,
    `gUn: ${gUn}`,
    `qtd: ${qtd}`,
    `un: '${un}'`,
    `unp: '${unp}'`,
    id == null ? `fonte: '${origem}'` : `taco: ${id}`,
  ].join(', ');
  return `  { ${campos} }, /* ${nota} */`;
});

if (erros.length) { console.error(erros.join('\n')); process.exit(1); }

const cab = `/* ============================================================
   OS ALIMENTOS — de onde saem os gramas

   ARQUIVO GERADO por scripts/gerar-alimentos.mjs, que é onde mora a
   curadoria. Para mexer na lista, mexa lá e rode de novo:

     node scripts/gerar-alimentos.mjs src/logic/alimentos.ts

   Proteína por 100 g, como se come. Os valores vêm da TACO — Tabela
   Brasileira de Composição de Alimentos, 4ª edição, NEPA/UNICAMP — e o
   campo \`taco\` guarda a linha exata de onde cada um saiu, para que o
   número tenha procedência e não opinião. As poucas entradas sem \`taco\`
   trazem \`fonte\` dizendo de onde vieram: a TACO não analisou o leite
   líquido, não tem suplemento, e traz grão-de-bico e macarrão só crus.

   Já a UNIDADE não é da TACO, e não podia ser: tabela de composição
   descreve 100 g, não descreve prato. Que um filé de frango pese perto
   de 120 g é medida caseira, e é por isso que a tela escreve "~".

   Mas a unidade é o que torna a pergunta respondível. "A porção foi
   pouca, normal ou bastante?" pede uma comparação com uma régua que só
   o app conhece. "Quantas colheres de arroz?" pergunta uma coisa que
   quem comeu viu acontecer.

   A lista é curta de propósito. São os alimentos que alguém digita
   DEPOIS de comer — não um inventário de ingredientes. Quem procurar
   "farinha de trigo" não acha, e está certo: ninguém almoça isso. O que
   entra além dos ingredientes são pratos inteiros, somados a partir dos
   componentes na TACO com a receita escrita em \`fonte\`: quem almoçou
   carbonara escreve carbonara, não "macarrão + ovo + bacon".
   ============================================================ */

export type Alimento = {
  id: string;
  nome: string;
  /** Termos sem acento para a busca encontrar o que a pessoa digita. */
  busca: string;
  /** Proteína por 100 g. */
  p: number;
  /** Gramas de UMA unidade: um filé, uma colher, uma concha. */
  gUn: number;
  /** Quantas unidades vêm marcadas ao escolher o alimento. */
  qtd: number;
  /** A unidade no singular, e no plural. */
  un: string;
  unp: string;
  /** Linha da TACO de onde \`p\` saiu. */
  taco?: number;
  /** Quando não é da TACO, de onde é. */
  fonte?: string;
};

export const ALIMENTOS: Alimento[] = [
${linhasTS.join('\n')}
];

/** "2 colheres", "1 filé" — o plural só quando é mais de um. */
export function medidaDe(a: Alimento, qtd: number): string {
  return \`\${qtd} \${qtd === 1 ? a.un : a.unp}\`;
}

const semAcento = (s: string) =>
  s.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase().trim();

/* Busca por prefixo de palavra, e não por trecho solto: "ova" não devia
   trazer "Ovo cozido" pelo meio de "abacate". O que começa igual ao que
   foi digitado vem primeiro; o resto vem depois, na ordem da lista. */
export function buscarAlimento(termo: string, limite = 6): Alimento[] {
  const t = semAcento(termo);
  if (t.length < 2) return [];
  const comeca: Alimento[] = [];
  const contem: Alimento[] = [];
  for (const a of ALIMENTOS) {
    const palavras = semAcento(a.nome + ' ' + a.busca).split(/[\\s,]+/);
    if (palavras.some((p) => p.startsWith(t))) comeca.push(a);
    else if (palavras.some((p) => p.includes(t))) contem.push(a);
  }
  return [...comeca, ...contem].slice(0, limite);
}

/** Gramas de proteína de N unidades. Sempre arredondado: a precisão que
    existe aqui não chega na casa decimal. */
export function gramasDe(a: Alimento, qtd: number): number {
  return Math.round((a.p / 100) * a.gUn * Math.max(0, qtd));
}
`;

fs.writeFileSync(process.argv[2], cab);

/* A MESMA lista, em JSON, para o servidor que lê a foto.

   Ele precisa dela no prompt: sem a lista, o modelo devolve nomes soltos
   e nada casa com a tabela do app — todo item viraria "estimado pela
   foto", justamente o que se quer evitar. E precisa ser a mesma lista,
   gerada na mesma passada, senão um id existe de um lado e não do outro.

   Só o que o prompt usa: id, nome e a unidade em que ele deve contar. */
const paraServidor = linhas.map((l) => {
  const [, slug, nome, , , qtd, un, unp] = l;
  return { id: slug, nome, un, unp, padrao: qtd };
});
fs.writeFileSync('servidor/alimentos.json', JSON.stringify(paraServidor) + '\n');

console.log('alimentos: ' + linhasTS.length + ' (' + COMPOSTOS.length + ' pratos compostos)');
