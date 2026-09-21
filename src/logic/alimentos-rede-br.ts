/* AS REDES DE FAST FOOD DO BRASIL — o que elas publicam

   ⚠️ ARQUIVO GERADO por scripts/gerar-fastfood-br.mjs, a partir da
   colheita em scripts/dados/. Para mexer, mexa lá e rode de novo.

   ⚠️⚠️ OS VALORES SÃO POR PORÇÃO, e é por isso que cada item traz
   `porUnidade: true` e `gUn: null`. A rede publica o rótulo do produto
   dela — "o Big Mac tem 26 g de proteína" — e NÃO publica quanto a porção
   pesa: restaurante é isento da RDC 429, que obriga o peso em alimento
   embalado. Converter para a base de 100 g exigiria inventar esse peso.

   ⚠️ E O NÚMERO É DAQUI, e não do Big Mac americano. Lá o USDA mediu 24 g
   em 205 g de sanduíche; aqui a rede publica 26 g. São receitas
   diferentes, e por isso a lista é por país.

   97 itens · McDonald's Brasil
   ============================================================ */
import type { Alimento } from './alimentos';

export const REDES_BR: Alimento[] = [
  {"id":"mcd-mcfish","nome":"McDonald’s McFish","busca":"mcfish mcdonalds mequi mcfish","p":17,"kcal":391,"carb":39,"gord":19,"fibra":1.9,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-big-mac","nome":"McDonald’s Big Mac","busca":"big mac mcdonalds mequi big mac","p":26,"kcal":524,"carb":43,"gord":27,"fibra":1.9,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcfloat","nome":"McDonald’s McFloat","busca":"mcfloat mcdonalds mequi mcfloat","p":2.3,"kcal":144,"carb":27,"gord":3.2,"fibra":0,"gUn":null,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-supermc","nome":"McDonald’s SuperMc","busca":"supermc mcdonalds mequi supermc","p":38,"kcal":795,"carb":42,"gord":54,"fibra":4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-batata-p","nome":"McDonald’s Batata P","busca":"batata p mcdonalds mequi batata p","p":2,"kcal":171,"carb":25,"gord":7,"fibra":2,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-hamburger","nome":"McDonald’s Hamburger","busca":"hamburger mcdonalds mequi hamburger","p":13,"kcal":242,"carb":29,"gord":8,"fibra":1.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcchicken","nome":"McDonald’s McChicken","busca":"mcchicken mcdonalds mequi mcchicken","p":17,"kcal":403,"carb":42,"gord":18,"fibra":3,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tomatinho","nome":"McDonald’s Tomatinho","busca":"tomatinho mcdonalds mequi tomatinho","p":0.54,"kcal":11,"carb":1.6,"gord":0.27,"fibra":0.86,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-egg-burger","nome":"McDonald’s Egg Burger","busca":"egg burger mcdonalds mequi egg burger","p":22,"kcal":414,"carb":41,"gord":18,"fibra":1.8,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-side-salad","nome":"McDonald’s Side Salad","busca":"side salad mcdonalds mequi side salad","p":1,"kcal":10,"carb":1,"gord":0,"fibra":1,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-chicken-jr","nome":"McDonald’s Chicken Jr.","busca":"chicken jr. mcdonalds mequi chicken jr","p":12,"kcal":349,"carb":43,"gord":15,"fibra":2.4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-salada-fish","nome":"McDonald’s Salada Fish","busca":"salada fish mcdonalds mequi salada fish","p":16,"kcal":222,"carb":13,"gord":12,"fibra":3.5,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-cheeseburger","nome":"McDonald’s Cheeseburger","busca":"cheeseburger mcdonalds mequi cheeseburger","p":15,"kcal":291,"carb":30,"gord":12,"fibra":1.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-derpy-sundae","nome":"McDonald’s Derpy Sundae","busca":"derpy sundae mcdonalds mequi derpy sundae","p":3,"kcal":227,"carb":42,"gord":5,"fibra":0.1,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-duplo-mcfish","nome":"McDonald’s Duplo McFish","busca":"duplo mcfish mcdonalds mequi duplo mcfish","p":17,"kcal":396,"carb":40,"gord":19,"fibra":2.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcfish-deluxe","nome":"McDonald’s McFish Deluxe","busca":"mcfish deluxe mcdonalds mequi mcfish deluxe","p":26,"kcal":591,"carb":51,"gord":31,"fibra":2.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-pao-de-queijo","nome":"McDonald’s Pão de Queijo","busca":"pao de queijo mcdonalds mequi pao de queijo","p":3.2,"kcal":145,"carb":19,"gord":6.9,"fibra":0.86,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-queijo-quente","nome":"McDonald’s Queijo Quente","busca":"queijo quente mcdonalds mequi queijo quente","p":12,"kcal":314,"carb":41,"gord":11,"fibra":1.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-torta-de-maca","nome":"McDonald’s Torta de Maçã","busca":"torta de maca mcdonalds mequi torta de maca","p":1.8,"kcal":154,"carb":27,"gord":4.5,"fibra":0.8,"gUn":null,"qtd":1,"un":"torta","unp":"tortas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-triplo-burger","nome":"McDonald’s Triplo Burger","busca":"triplo burger mcdonalds mequi triplo burger","p":34,"kcal":549,"carb":36,"gord":29,"fibra":3,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-cheddar-mcmelt","nome":"McDonald’s Cheddar McMelt","busca":"cheddar mcmelt mcdonalds mequi cheddar mcmelt","p":29,"kcal":509,"carb":33,"gord":29,"fibra":3.2,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcfritas-media","nome":"McDonald’s McFritas Média","busca":"mcfritas media mcdonalds mequi mcfritas media","p":4.8,"kcal":295,"carb":35,"gord":15,"fibra":4.1,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcnifico-bacon","nome":"McDonald’s McNífico Bacon","busca":"mcnifico bacon mcdonalds mequi mcnifico bacon","p":32,"kcal":595,"carb":40,"gord":34,"fibra":4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-sundae-morango","nome":"McDonald’s Sundae morango","busca":"sundae morango mcdonalds mequi sundae morango","p":6,"kcal":298,"carb":50,"gord":9,"fibra":0.8,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-casquinha-mista","nome":"McDonald’s Casquinha Mista","busca":"casquinha mista mcdonalds mequi casquinha mista","p":3.3,"kcal":167,"carb":30,"gord":3.9,"fibra":0.4,"gUn":null,"qtd":1,"un":"casquinha","unp":"casquinhas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-duplo-quarterao","nome":"McDonald’s Duplo Quarterão","busca":"duplo quarterao mcdonalds mequi duplo quarterao","p":52,"kcal":836,"carb":39,"gord":52,"fibra":3.2,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcchicken-bacon","nome":"McDonald’s McChicken Bacon","busca":"mcchicken bacon mcdonalds mequi mcchicken bacon","p":18,"kcal":409,"carb":42,"gord":19,"fibra":2.9,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcchicken-duplo","nome":"McDonald’s McChicken Duplo","busca":"mcchicken duplo mcdonalds mequi mcchicken duplo","p":31,"kcal":665,"carb":53,"gord":36,"fibra":4.2,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcfritas-grande","nome":"McDonald’s McFritas Grande","busca":"mcfritas grande mcdonalds mequi mcfritas grande","p":6.9,"kcal":422,"carb":50,"gord":22,"fibra":5.8,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcshake-morango","nome":"McDonald’s McShake Morango","busca":"mcshake morango mcdonalds mequi mcshake morango","p":8,"kcal":575,"carb":111,"gord":11,"fibra":0,"gUn":null,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-sundae-caramelo","nome":"McDonald’s Sundae caramelo","busca":"sundae caramelo mcdonalds mequi sundae caramelo","p":5.4,"kcal":307,"carb":51,"gord":9.2,"fibra":0.97,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-torta-de-banana","nome":"McDonald’s Torta de Banana","busca":"torta de banana mcdonalds mequi torta de banana","p":2.1,"kcal":152,"carb":26,"gord":4.4,"fibra":0.6,"gUn":null,"qtd":1,"un":"torta","unp":"tortas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-brabo-smokehouse","nome":"McDonald’s Brabo SmokeHouse","busca":"brabo smokehouse mcdonalds mequi brabo smokehouse","p":61,"kcal":1211,"carb":55,"gord":83,"fibra":4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-egg-cheese-bacon","nome":"McDonald’s Egg Cheese Bacon","busca":"egg cheese bacon mcdonalds mequi egg cheese bacon","p":20,"kcal":383,"carb":41,"gord":16,"fibra":1.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-sundae-chocolate","nome":"McDonald’s Sundae chocolate","busca":"sundae chocolate mcdonalds mequi sundae chocolate","p":6,"kcal":322,"carb":50,"gord":12,"fibra":2.5,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-casquinha-baunilha","nome":"McDonald’s Casquinha Baunilha","busca":"casquinha baunilha mcdonalds mequi casquinha baunilha","p":3.2,"kcal":170,"carb":31,"gord":3.9,"fibra":0.37,"gUn":null,"qtd":1,"un":"casquinha","unp":"casquinhas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-duplo-burger-bacon","nome":"McDonald’s Duplo Burger Bacon","busca":"duplo burger bacon mcdonalds mequi duplo burger bacon","p":27,"kcal":441,"carb":35,"gord":22,"fibra":2.6,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-duplo-cheeseburger","nome":"McDonald’s Duplo Cheeseburger","busca":"duplo cheeseburger mcdonalds mequi duplo cheeseburger","p":25,"kcal":428,"carb":31,"gord":22,"fibra":2,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mccolosso-caramelo","nome":"McDonald’s McColosso Caramelo","busca":"mccolosso caramelo mcdonalds mequi mccolosso caramelo","p":4.4,"kcal":269,"carb":52,"gord":5,"fibra":0.58,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcshake-do-grimace","nome":"McDonald’s McShake do Grimace","busca":"mcshake do grimace mcdonalds mequi mcshake do grimace","p":7,"kcal":459,"carb":84,"gord":11,"fibra":0.2,"gUn":null,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcshake-kopenhagen","nome":"McDonald’s McShake Kopenhagen","busca":"mcshake kopenhagen mcdonalds mequi mcshake kopenhagen","p":11,"kcal":758,"carb":110,"gord":30,"fibra":6.1,"gUn":null,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcshake-ovomaltine","nome":"McDonald’s McShake Ovomaltine","busca":"mcshake ovomaltine mcdonalds mequi mcshake ovomaltine","p":10,"kcal":635,"carb":120,"gord":13,"fibra":2.5,"gUn":null,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mini-pao-de-queijo","nome":"McDonald’s Mini Pão de Queijo","busca":"mini pao de queijo mcdonalds mequi mini pao de queijo","p":6.5,"kcal":227,"carb":24,"gord":11,"fibra":0.63,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-top-sundae-morango","nome":"McDonald’s Top Sundae morango","busca":"top sundae morango mcdonalds mequi top sundae morango","p":10,"kcal":485,"carb":80,"gord":14,"fibra":0.9,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-casquinha-chocolate","nome":"McDonald’s Casquinha Chocolate","busca":"casquinha chocolate mcdonalds mequi casquinha chocolate","p":3.4,"kcal":165,"carb":29,"gord":3.9,"fibra":0.4,"gUn":null,"qtd":1,"un":"casquinha","unp":"casquinhas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-cookies-de-baunilha","nome":"McDonald’s Cookies de baunilha","busca":"cookies de baunilha mcdonalds mequi cookies de baunilha","p":2.2,"kcal":205,"carb":30,"gord":8.6,"fibra":1.7,"gUn":null,"qtd":1,"un":"cookie","unp":"cookies","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-duplo-mcfish-deluxe","nome":"McDonald’s Duplo McFish Deluxe","busca":"duplo mcfish deluxe mcdonalds mequi duplo mcfish deluxe","p":26,"kcal":596,"carb":52,"gord":32,"fibra":3.5,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mccolosso-chocolate","nome":"McDonald’s McColosso Chocolate","busca":"mccolosso chocolate mcdonalds mequi mccolosso chocolate","p":4,"kcal":245,"carb":47,"gord":5,"fibra":0.5,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tasty-turbo-1-carne","nome":"McDonald’s Tasty Turbo 1 carne","busca":"tasty turbo 1 carne mcdonalds mequi tasty turbo 1 carne","p":36,"kcal":800,"carb":41,"gord":55,"fibra":3.9,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-top-sundae-caramelo","nome":"McDonald’s Top Sundae caramelo","busca":"top sundae caramelo mcdonalds mequi top sundae caramelo","p":7.1,"kcal":401,"carb":67,"gord":12,"fibra":1.3,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-caldofreddo-morango","nome":"McDonald’s Caldo&Freddo Morango","busca":"caldo&freddo morango mcdonalds mequi caldofreddo morango","p":5.4,"kcal":468,"carb":81,"gord":13,"fibra":1.8,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-cookies-de-chocolate","nome":"McDonald’s Cookies de chocolate","busca":"cookies de chocolate mcdonalds mequi cookies de chocolate","p":2.6,"kcal":199,"carb":28,"gord":8.5,"fibra":2.2,"gUn":null,"qtd":1,"un":"cookie","unp":"cookies","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-duplo-cheddar-mcmelt","nome":"McDonald’s Duplo Cheddar McMelt","busca":"duplo cheddar mcmelt mcdonalds mequi duplo cheddar mcmelt","p":52,"kcal":854,"carb":36,"gord":56,"fibra":4.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-quarterao-com-queijo","nome":"McDonald’s Quarterão com Queijo","busca":"quarterao com queijo mcdonalds mequi quarterao com queijo","p":32,"kcal":566,"carb":39,"gord":31,"fibra":2.8,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-quarterao-saja-vibes","nome":"McDonald’s Quarterão Saja Vibes","busca":"quarterao saja vibes mcdonalds mequi quarterao saja vibes","p":36,"kcal":666,"carb":40,"gord":40,"fibra":3.9,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tasty-turbo-2-carnes","nome":"McDonald’s Tasty Turbo 2 carnes","busca":"tasty turbo 2 carnes mcdonalds mequi tasty turbo 2 carnes","p":56,"kcal":1070,"carb":41,"gord":76,"fibra":4.4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tasty-turbo-3-carnes","nome":"McDonald’s Tasty Turbo 3 carnes","busca":"tasty turbo 3 carnes mcdonalds mequi tasty turbo 3 carnes","p":77,"kcal":1340,"carb":41,"gord":97,"fibra":4.8,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-top-sundae-chocolate","nome":"McDonald’s Top Sundae chocolate","busca":"top sundae chocolate mcdonalds mequi top sundae chocolate","p":10,"kcal":466,"carb":76,"gord":14,"fibra":0.9,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-caldofreddo-caramelo","nome":"McDonald’s Caldo&Freddo Caramelo","busca":"caldo&freddo caramelo mcdonalds mequi caldofreddo caramelo","p":5.8,"kcal":488,"carb":83,"gord":15,"fibra":1.3,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-petit-suisse-do-mequi","nome":"McDonald’s Petit Suisse do Méqui","busca":"petit suisse do mequi mcdonalds mequi petit suisse do mequi","p":2.3,"kcal":40,"carb":4.7,"gord":1.3,"fibra":0,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-brabo-brabissimo-carne","nome":"McDonald’s Brabo Brabissímo Carne","busca":"brabo brabissimo carne mcdonalds mequi brabo brabissimo carne","p":58,"kcal":1244,"carb":51,"gord":90,"fibra":4.4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-caldofreddo-chocolate","nome":"McDonald’s Caldo&Freddo Chocolate","busca":"caldo&freddo chocolate mcdonalds mequi caldofreddo chocolate","p":5.6,"kcal":483,"carb":77,"gord":17,"fibra":3.1,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-croissant-de-chocolate","nome":"McDonald’s Croissant de Chocolate","busca":"croissant de chocolate mcdonalds mequi croissant de chocolate","p":6.9,"kcal":407,"carb":42,"gord":23,"fibra":3,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-duplo-egg-cheese-bacon","nome":"McDonald’s Duplo Egg Cheese Bacon","busca":"duplo egg cheese bacon mcdonalds mequi duplo egg cheese bacon","p":25,"kcal":443,"carb":42,"gord":20,"fibra":1.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcflurry-mms-morango","nome":"McDonald’s McFlurry M&M's morango","busca":"mcflurry m&m's morango mcdonalds mequi mcflurry mms morango","p":5.9,"kcal":467,"carb":80,"gord":14,"fibra":2.2,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcfritas-cheddar-bacon","nome":"McDonald’s McFritas Cheddar Bacon","busca":"mcfritas cheddar bacon mcdonalds mequi mcfritas cheddar bacon","p":9,"kcal":431,"carb":38,"gord":26,"fibra":4.2,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcshake-creme-crocante","nome":"McDonald’s McShake Creme Crocante","busca":"mcshake creme crocante mcdonalds mequi mcshake creme crocante","p":11,"kcal":800,"carb":137,"gord":23,"fibra":2,"gUn":null,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-salada-mix-crispy-beef","nome":"McDonald’s Salada Mix Crispy Beef","busca":"salada mix crispy beef mcdonalds mequi salada mix crispy beef","p":28,"kcal":368,"carb":3,"gord":23,"fibra":3.4,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mccrispy-chicken-deluxe","nome":"McDonald’s McCrispy Chicken Deluxe","busca":"mccrispy chicken deluxe mcdonalds mequi mccrispy chicken deluxe","p":32,"kcal":593,"carb":53,"gord":28,"fibra":4.8,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mccrispy-chicken-legend","nome":"McDonald’s McCrispy Chicken Legend","busca":"mccrispy chicken legend mcdonalds mequi mccrispy chicken legend","p":37,"kcal":900,"carb":65,"gord":55,"fibra":4.3,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcflurry-creme-crocante","nome":"McDonald’s McFlurry Creme Crocante","busca":"mcflurry creme crocante mcdonalds mequi mcflurry creme crocante","p":8,"kcal":551,"carb":87,"gord":19,"fibra":1,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-casquinha-creme-crocante","nome":"McDonald’s Casquinha Creme Crocante","busca":"casquinha creme crocante mcdonalds mequi casquinha creme crocante","p":4,"kcal":285,"carb":44,"gord":10,"fibra":1,"gUn":null,"qtd":1,"un":"casquinha","unp":"casquinhas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mccolosso-creme-crocante","nome":"McDonald’s McColosso Creme Crocante","busca":"mccolosso creme crocante mcdonalds mequi mccolosso creme crocante","p":5,"kcal":286,"carb":46,"gord":9,"fibra":1,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcflurry-mms-chocolate","nome":"McDonald’s McFlurry M&M's chocolate","busca":"mcflurry m&m's chocolate mcdonalds mequi mcflurry mms chocolate","p":6.2,"kcal":502,"carb":81,"gord":17,"fibra":3.6,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-panini-com-queijo-e-bacon","nome":"McDonald’s Panini com queijo e bacon","busca":"panini com queijo e bacon mcdonalds mequi panini com queijo e bacon","p":7.8,"kcal":220,"carb":21,"gord":12,"fibra":0.6,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-pao-tipo-brioche-na-chapa","nome":"McDonald’s Pão tipo Brioche na Chapa","busca":"pao tipo brioche na chapa mcdonalds mequi pao tipo brioche na chapa","p":7.3,"kcal":280.5,"carb":38.6,"gord":10.8,"fibra":2.6,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-salada-mix-crispy-chicken","nome":"McDonald’s Salada Mix Crispy Chicken","busca":"salada mix crispy chicken mcdonalds mequi salada mix crispy chicken","p":30,"kcal":423,"carb":24,"gord":23,"fibra":4.5,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tasty-turbo-bacon-1-carne","nome":"McDonald’s Tasty Turbo Bacon 1 carne","busca":"tasty turbo bacon 1 carne mcdonalds mequi tasty turbo bacon 1 carne","p":43,"kcal":888,"carb":41,"gord":61,"fibra":4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tasty-turbo-bacon-2-carnes","nome":"McDonald’s Tasty Turbo Bacon 2 carnes","busca":"tasty turbo bacon 2 carnes mcdonalds mequi tasty turbo bacon 2 carnes","p":63,"kcal":1158,"carb":41,"gord":82,"fibra":4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tasty-turbo-bacon-3-carnes","nome":"McDonald’s Tasty Turbo Bacon 3 carnes","busca":"tasty turbo bacon 3 carnes mcdonalds mequi tasty turbo bacon 3 carnes","p":84,"kcal":1428,"carb":41,"gord":103,"fibra":5,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-casquinha-recheada-caramelo","nome":"McDonald’s Casquinha recheada caramelo","busca":"casquinha recheada caramelo mcdonalds mequi casquinha recheada caramelo","p":3.5,"kcal":229.5,"carb":44.1,"gord":4.3,"fibra":0.5,"gUn":null,"qtd":1,"un":"casquinha","unp":"casquinhas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-folhado-com-queijo-e-tomate","nome":"McDonald’s Folhado com Queijo e Tomate","busca":"folhado com queijo e tomate mcdonalds mequi folhado com queijo e tomate","p":8,"kcal":416,"carb":36,"gord":26,"fibra":1.5,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-casquinha-recheada-chocolate","nome":"McDonald’s Casquinha recheada chocolate","busca":"casquinha recheada chocolate mcdonalds mequi casquinha recheada chocolate","p":3.5,"kcal":226.5,"carb":42,"gord":5.2,"fibra":1.2,"gUn":null,"qtd":1,"un":"casquinha","unp":"casquinhas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-chicken-mcnuggets-4-unidades","nome":"McDonald’s Chicken McNuggets 4 unidades","busca":"chicken mcnuggets 4 unidades mcdonalds mequi chicken mcnuggets 4 unidades","p":9,"kcal":155,"carb":10,"gord":8.6,"fibra":0.77,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-chicken-mcnuggets-6-unidades","nome":"McDonald’s Chicken McNuggets 6 unidades","busca":"chicken mcnuggets 6 unidades mcdonalds mequi chicken mcnuggets 6 unidades","p":14,"kcal":232,"carb":16,"gord":13,"fibra":1.2,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mccolosso-recheado-chocolate","nome":"McDonald’s McColosso recheado chocolate","busca":"mccolosso recheado chocolate mcdonalds mequi mccolosso recheado chocolate","p":4.6,"kcal":313.6,"carb":59.2,"gord":7,"fibra":2.1,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-chicken-mcnuggets-10-unidades","nome":"McDonald’s Chicken McNuggets 10 unidades","busca":"chicken mcnuggets 10 unidades mcdonalds mequi chicken mcnuggets 10 unidades","p":24,"kcal":387,"carb":26,"gord":21,"fibra":1.9,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-chicken-mcnuggets-15-unidades","nome":"McDonald’s Chicken McNuggets 15 unidades","busca":"chicken mcnuggets 15 unidades mcdonalds mequi chicken mcnuggets 15 unidades","p":34,"kcal":581,"carb":39,"gord":32,"fibra":2.9,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-sundae-sabor-cereja-com-laranja","nome":"McDonald’s Sundae sabor cereja com laranja","busca":"sundae sabor cereja com laranja mcdonalds mequi sundae sabor cereja com laranja","p":6,"kcal":290,"carb":48,"gord":9,"fibra":0.9,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcflurry-ovomaltine-rocks-morango","nome":"McDonald’s McFlurry Ovomaltine Rocks morango","busca":"mcflurry ovomaltine rocks morango mcdonalds mequi mcflurry ovomaltine rocks morango","p":5.6,"kcal":453,"carb":86,"gord":9.8,"fibra":2.3,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mccolosso-sabor-cereja-com-laranja","nome":"McDonald’s McColosso sabor cereja com laranja","busca":"mccolosso sabor cereja com laranja mcdonalds mequi mccolosso sabor cereja com laranja","p":4,"kcal":220,"carb":43,"gord":4,"fibra":0.5,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcflurry-ovomaltine-rocks-chocolate","nome":"McDonald’s McFlurry Ovomaltine Rocks chocolate","busca":"mcflurry ovomaltine rocks chocolate mcdonalds mequi mcflurry ovomaltine rocks chocolate","p":5.2,"kcal":431,"carb":74,"gord":13,"fibra":3.4,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-top-sundae-sabor-cereja-com-laranja","nome":"McDonald’s Top Sundae sabor cereja com laranja","busca":"top sundae sabor cereja com laranja mcdonalds mequi top sundae sabor cereja com laranja","p":12,"kcal":530,"carb":84,"gord":16,"fibra":1.3,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcflurry-trufa-lingua-de-gato-duo-morango","nome":"McDonald’s McFlurry Trufa Língua de Gato DUO morango","busca":"mcflurry trufa lingua de gato duo morango mcdonalds mequi mcflurry trufa lingua de gato duo morango","p":9,"kcal":654,"carb":93,"gord":28,"fibra":0.3,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcflurry-trufa-lingua-de-gato-duo-chocolate","nome":"McDonald’s McFlurry Trufa Língua de Gato DUO chocolate","busca":"mcflurry trufa lingua de gato duo chocolate mcdonalds mequi mcflurry trufa lingua de gato duo chocolate","p":10,"kcal":678,"carb":93,"gord":31,"fibra":2,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcshake-caramelo","nome":"McDonald’s McShake Caramelo com farofa crocante de amendoim","busca":"mcshake caramelo com farofa crocante de amendoim mcdonalds mequi mcshake caramelo","p":5.4,"kcal":437,"carb":79,"gord":9.2,"fibra":0.97,"gUn":null,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-pao-de-queijo-recheado","nome":"McDonald’s Pão de queijo recheado com molho com queijo tipo cheddar","busca":"pao de queijo recheado com molho com queijo tipo cheddar mcdonalds mequi pao de queijo recheado","p":4.5,"kcal":189,"carb":21,"gord":9.5,"fibra":0.8,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
];

/* O que cada item tem, para as restrições alimentares. Sai da categoria
   em que a própria rede o pôs, mais os alérgenos que ela declara. */
export const CONTEM_REDE_BR: Record<string, string[]> = {
  "mcd-quarterao-saja-vibes": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-brabo-smokehouse": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-brabo-brabissimo-carne": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-duplo-cheeseburger": [
    "carne"
  ],
  "mcd-cheddar-mcmelt": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-duplo-cheddar-mcmelt": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-big-mac": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-duplo-quarterao": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-quarterao-com-queijo": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-mcnifico-bacon": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-duplo-burger-bacon": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-triplo-burger": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-cheeseburger": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-hamburger": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-supermc": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-mcchicken-duplo": [
    "ave",
    "ovo",
    "leite"
  ],
  "mcd-mccrispy-chicken-legend": [
    "ave",
    "ovo",
    "leite"
  ],
  "mcd-mccrispy-chicken-deluxe": [
    "ave",
    "ovo",
    "leite"
  ],
  "mcd-mcchicken-bacon": [
    "ave",
    "carne"
  ],
  "mcd-mcchicken": [
    "ave"
  ],
  "mcd-chicken-jr": [
    "ave",
    "ovo",
    "leite"
  ],
  "mcd-tasty-turbo-bacon-3-carnes": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-tasty-turbo-bacon-2-carnes": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-tasty-turbo-bacon-1-carne": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-tasty-turbo-1-carne": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-tasty-turbo-2-carnes": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-tasty-turbo-3-carnes": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-duplo-mcfish-deluxe": [
    "peixe",
    "ovo",
    "leite"
  ],
  "mcd-mcfish-deluxe": [
    "peixe",
    "ovo",
    "leite"
  ],
  "mcd-duplo-mcfish": [
    "peixe",
    "ovo",
    "leite"
  ],
  "mcd-mcfish": [
    "peixe",
    "ovo",
    "leite"
  ],
  "mcd-salada-fish": [
    "peixe",
    "ovo",
    "leite"
  ],
  "mcd-salada-mix-crispy-chicken": [
    "ave",
    "ovo"
  ],
  "mcd-salada-mix-crispy-beef": [
    "carne",
    "ovo"
  ],
  "mcd-mcfritas-cheddar-bacon": [
    "carne"
  ],
  "mcd-chicken-mcnuggets-4-unidades": [
    "ave",
    "leite"
  ],
  "mcd-chicken-mcnuggets-6-unidades": [
    "ave",
    "leite"
  ],
  "mcd-chicken-mcnuggets-10-unidades": [
    "ave",
    "leite"
  ],
  "mcd-chicken-mcnuggets-15-unidades": [
    "ave",
    "leite"
  ],
  "mcd-pao-de-queijo": [
    "ovo",
    "leite"
  ],
  "mcd-mini-pao-de-queijo": [
    "ovo",
    "leite"
  ],
  "mcd-pao-de-queijo-recheado": [
    "ovo",
    "leite"
  ],
  "mcd-queijo-quente": [
    "ovo",
    "leite"
  ],
  "mcd-pao-tipo-brioche-na-chapa": [
    "ovo",
    "leite"
  ],
  "mcd-egg-burger": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-egg-cheese-bacon": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-duplo-egg-cheese-bacon": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-cookies-de-baunilha": [
    "ovo",
    "leite"
  ],
  "mcd-cookies-de-chocolate": [
    "ovo",
    "leite"
  ],
  "mcd-panini-com-queijo-e-bacon": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-folhado-com-queijo-e-tomate": [
    "ovo",
    "leite"
  ],
  "mcd-croissant-de-chocolate": [
    "ovo",
    "leite"
  ],
  "mcd-sundae-sabor-cereja-com-laranja": [
    "leite"
  ],
  "mcd-derpy-sundae": [
    "leite"
  ],
  "mcd-casquinha-creme-crocante": [
    "leite"
  ],
  "mcd-mcflurry-creme-crocante": [
    "leite"
  ],
  "mcd-mcshake-creme-crocante": [
    "leite"
  ],
  "mcd-mcshake-do-grimace": [
    "ovo",
    "leite"
  ],
  "mcd-mcflurry-trufa-lingua-de-gato-duo-morango": [
    "leite"
  ],
  "mcd-mcflurry-trufa-lingua-de-gato-duo-chocolate": [
    "leite"
  ],
  "mcd-casquinha-baunilha": [
    "leite"
  ],
  "mcd-casquinha-chocolate": [
    "leite"
  ],
  "mcd-casquinha-mista": [
    "leite"
  ],
  "mcd-casquinha-recheada-chocolate": [
    "leite"
  ],
  "mcd-mccolosso-chocolate": [
    "ovo"
  ],
  "mcd-mccolosso-recheado-chocolate": [
    "ovo",
    "leite"
  ],
  "mcd-sundae-chocolate": [
    "leite"
  ],
  "mcd-sundae-morango": [
    "leite"
  ],
  "mcd-sundae-caramelo": [
    "leite"
  ],
  "mcd-top-sundae-caramelo": [
    "leite"
  ],
  "mcd-mcflurry-mms-chocolate": [
    "leite"
  ],
  "mcd-mcflurry-mms-morango": [
    "leite"
  ],
  "mcd-mcflurry-ovomaltine-rocks-chocolate": [
    "leite"
  ],
  "mcd-mcflurry-ovomaltine-rocks-morango": [
    "leite"
  ],
  "mcd-mcshake-ovomaltine": [
    "leite"
  ],
  "mcd-mcshake-kopenhagen": [
    "leite"
  ],
  "mcd-mcshake-morango": [
    "leite"
  ],
  "mcd-torta-de-maca": [
    "ovo",
    "leite"
  ],
  "mcd-torta-de-banana": [
    "ovo",
    "leite"
  ],
  "mcd-petit-suisse-do-mequi": [
    "leite"
  ],
  "mcd-caldofreddo-chocolate": [
    "ovo",
    "leite"
  ],
  "mcd-caldofreddo-morango": [
    "ovo",
    "leite"
  ],
  "mcd-caldofreddo-caramelo": [
    "ovo",
    "leite"
  ],
  "mcd-mcfloat": [
    "leite"
  ]
};
