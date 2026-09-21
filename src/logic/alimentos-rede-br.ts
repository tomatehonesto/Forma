/* AS REDES DE FAST FOOD DO BRASIL — o que elas publicam

   ⚠️ ARQUIVO GERADO por scripts/gerar-fastfood-br.mjs, a partir da
   colheita em scripts/dados/. Para mexer, mexa lá e rode de novo.

   ⚠️⚠️ SÃO DUAS MEDIDAS NA MESMA LISTA, porque as redes publicam
   diferente. O item do McDonald's traz `porUnidade: true` e `gUn: null`:
   a rede publica o rótulo do produto — "o Big Mac tem 26 g de proteína" —
   e NÃO diz quanto a porção pesa, porque restaurante é isento da RDC 429.
   O item do Habib's traz valor por 100 g e `gUn` de verdade, porque a
   tabela dele declara o peso. Converter um no outro exigiria inventar.

   ⚠️ E O NÚMERO É DAQUI, e não do Big Mac americano. Lá o USDA mediu 24 g
   em 205 g de sanduíche; aqui a rede publica 26 g. São receitas
   diferentes, e por isso a lista é por país.

   117 itens · McDonald's e Habib's, Brasil
   ============================================================ */
import type { Alimento } from './alimentos';

export const REDES_BR: Alimento[] = [
  {"id":"mcd-mcfish","nome":"McDonald’s McFish","busca":"mcfish mcdonalds mequi mcfish","p":17,"kcal":391,"carb":39,"gord":19,"fibra":1.9,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-rodeio","nome":"Burger King Rodeio","busca":"rodeio burger king bk rodeio","p":17,"kcal":444,"carb":36,"gord":26,"fibra":3,"gUn":144,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"mcd-big-mac","nome":"McDonald’s Big Mac","busca":"big mac mcdonalds mequi big mac","p":26,"kcal":524,"carb":43,"gord":27,"fibra":1.9,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-supermc","nome":"McDonald’s SuperMc","busca":"supermc mcdonalds mequi supermc","p":38,"kcal":795,"carb":42,"gord":54,"fibra":4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-batata-p","nome":"McDonald’s Batata P","busca":"batata p mcdonalds mequi batata p","p":2,"kcal":171,"carb":25,"gord":7,"fibra":2,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-whopper","nome":"Burger King WHOPPER®","busca":"whopper® burger king bk whopper","p":32,"kcal":717,"carb":47,"gord":44,"fibra":5,"gUn":325,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"mcd-hamburger","nome":"McDonald’s Hamburger","busca":"hamburger mcdonalds mequi hamburger","p":13,"kcal":242,"carb":29,"gord":8,"fibra":1.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcchicken","nome":"McDonald’s McChicken","busca":"mcchicken mcdonalds mequi mcchicken","p":17,"kcal":403,"carb":42,"gord":18,"fibra":3,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tomatinho","nome":"McDonald’s Tomatinho","busca":"tomatinho mcdonalds mequi tomatinho","p":0.54,"kcal":11,"carb":1.6,"gord":0.27,"fibra":0.86,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-big-king","nome":"Burger King Big King™","busca":"big king™ burger king bk big king","p":35,"kcal":739,"carb":44,"gord":46,"fibra":2,"gUn":266,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"mcd-egg-burger","nome":"McDonald’s Egg Burger","busca":"egg burger mcdonalds mequi egg burger","p":22,"kcal":414,"carb":41,"gord":18,"fibra":1.8,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-side-salad","nome":"McDonald’s Side Salad","busca":"side salad mcdonalds mequi side salad","p":1,"kcal":10,"carb":1,"gord":0,"fibra":1,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-king-bacon","nome":"Burger King King Bacon","busca":"king bacon burger king bk king bacon","p":30,"kcal":821,"carb":29,"gord":64,"fibra":1,"gUn":222,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-genius-cheddar","nome":"Habib’s Genius Cheddar","busca":"genius cheddar habibs genius cheddar","p":9.8,"kcal":254,"carb":17,"gord":16,"fibra":1.3,"gUn":235,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-chicken-jr","nome":"McDonald’s Chicken Jr.","busca":"chicken jr. mcdonalds mequi chicken jr","p":12,"kcal":349,"carb":43,"gord":15,"fibra":2.4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-salada-fish","nome":"McDonald’s Salada Fish","busca":"salada fish mcdonalds mequi salada fish","p":16,"kcal":222,"carb":13,"gord":12,"fibra":3.5,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-chicken-jr","nome":"Burger King Chicken Jr.","busca":"chicken jr. burger king bk chicken jr","p":14,"kcal":385,"carb":36,"gord":21,"fibra":3,"gUn":137,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"mcd-cheeseburger","nome":"McDonald’s Cheeseburger","busca":"cheeseburger mcdonalds mequi cheeseburger","p":15,"kcal":291,"carb":30,"gord":12,"fibra":1.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-duplo-mcfish","nome":"McDonald’s Duplo McFish","busca":"duplo mcfish mcdonalds mequi duplo mcfish","p":17,"kcal":396,"carb":40,"gord":19,"fibra":2.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-cheeseburger","nome":"Burger King Cheeseburger","busca":"cheeseburger burger king bk cheeseburger","p":16,"kcal":308,"carb":30,"gord":14,"fibra":3,"gUn":130,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-rodeio-duplo","nome":"Burger King Rodeio Duplo","busca":"rodeio duplo burger king bk rodeio duplo","p":27,"kcal":606,"carb":43,"gord":37,"fibra":4,"gUn":200,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-whopper-jr","nome":"Burger King WHOPPER® Jr.","busca":"whopper® jr. burger king bk whopper jr","p":17,"kcal":388,"carb":29,"gord":23,"fibra":3,"gUn":179,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-beirute-de-kafta","nome":"Habib’s Beirute de Kafta","busca":"beirute de kafta habibs beirute de kafta","p":7,"kcal":214,"carb":16,"gord":13,"fibra":1.1,"gUn":530,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-mcfish-deluxe","nome":"McDonald’s McFish Deluxe","busca":"mcfish deluxe mcdonalds mequi mcfish deluxe","p":26,"kcal":591,"carb":51,"gord":31,"fibra":2.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-pao-de-queijo","nome":"McDonald’s Pão de Queijo","busca":"pao de queijo mcdonalds mequi pao de queijo","p":3.2,"kcal":145,"carb":19,"gord":6.9,"fibra":0.86,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-queijo-quente","nome":"McDonald’s Queijo Quente","busca":"queijo quente mcdonalds mequi queijo quente","p":12,"kcal":314,"carb":41,"gord":11,"fibra":1.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-triplo-burger","nome":"McDonald’s Triplo Burger","busca":"triplo burger mcdonalds mequi triplo burger","p":34,"kcal":549,"carb":36,"gord":29,"fibra":3,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-chicken-duplo","nome":"Burger King Chicken Duplo","busca":"chicken duplo burger king bk chicken duplo","p":23,"kcal":591,"carb":48,"gord":35,"fibra":4,"gUn":206,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-whopper-grogu","nome":"Burger King Whopper Grogu","busca":"whopper grogu burger king bk whopper grogu","p":32,"kcal":735,"carb":46,"gord":46,"fibra":5,"gUn":300,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"mcd-cheddar-mcmelt","nome":"McDonald’s Cheddar McMelt","busca":"cheddar mcmelt mcdonalds mequi cheddar mcmelt","p":29,"kcal":509,"carb":33,"gord":29,"fibra":3.2,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcfritas-media","nome":"McDonald’s McFritas Média","busca":"mcfritas media mcdonalds mequi mcfritas media","p":4.8,"kcal":295,"carb":35,"gord":15,"fibra":4.1,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcnifico-bacon","nome":"McDonald’s McNífico Bacon","busca":"mcnifico bacon mcdonalds mequi mcnifico bacon","p":32,"kcal":595,"carb":40,"gord":34,"fibra":4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-chicken-crispy","nome":"Burger King Chicken Crispy","busca":"chicken crispy burger king bk bk chicken crispy","p":29,"kcal":501,"carb":41,"gord":25,"fibra":2,"gUn":200,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-king-fraldinha","nome":"Burger King King Fraldinha","busca":"king fraldinha burger king bk king fraldinha","p":45,"kcal":961,"carb":39,"gord":69,"fibra":2,"gUn":307,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-whopper-duplo","nome":"Burger King WHOPPER® Duplo","busca":"whopper® duplo burger king bk whopper duplo","p":50,"kcal":962,"carb":47,"gord":62,"fibra":5,"gUn":405,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-de-carne","nome":"Habib’s Bib’Sfiha de Carne","busca":"bibsfiha de carne habibs bib sfiha de carne","p":7.3,"kcal":203,"carb":30,"gord":6.1,"fibra":1.5,"gUn":75,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-duplo-quarterao","nome":"McDonald’s Duplo Quarterão","busca":"duplo quarterao mcdonalds mequi duplo quarterao","p":52,"kcal":836,"carb":39,"gord":52,"fibra":3.2,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcchicken-bacon","nome":"McDonald’s McChicken Bacon","busca":"mcchicken bacon mcdonalds mequi mcchicken bacon","p":18,"kcal":409,"carb":42,"gord":19,"fibra":2.9,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcchicken-duplo","nome":"McDonald’s McChicken Duplo","busca":"mcchicken duplo mcdonalds mequi mcchicken duplo","p":31,"kcal":665,"carb":53,"gord":36,"fibra":4.2,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcfritas-grande","nome":"McDonald’s McFritas Grande","busca":"mcfritas grande mcdonalds mequi mcfritas grande","p":6.9,"kcal":422,"carb":50,"gord":22,"fibra":5.8,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-whopper-rodeio","nome":"Burger King WHOPPER® Rodeio","busca":"whopper® rodeio burger king bk whopper rodeio","p":34,"kcal":901,"carb":70,"gord":53,"fibra":6,"gUn":352,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-de-frango","nome":"Habib’s Bib’Sfiha de Frango","busca":"bibsfiha de frango habibs bib sfiha de frango","p":6,"kcal":183,"carb":30,"gord":4.8,"fibra":1.2,"gUn":75,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-de-queijo","nome":"Habib’s Bib’Sfiha de Queijo","busca":"bibsfiha de queijo habibs bib sfiha de queijo","p":10,"kcal":256,"carb":34,"gord":8.7,"fibra":0.8,"gUn":70,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-genius-croc-chicken","nome":"Habib’s Genius Croc Chicken","busca":"genius croc chicken habibs genius croc chicken","p":8.4,"kcal":189,"carb":22,"gord":7.1,"fibra":1.7,"gUn":213,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-brabo-smokehouse","nome":"McDonald’s Brabo SmokeHouse","busca":"brabo smokehouse mcdonalds mequi brabo smokehouse","p":61,"kcal":1211,"carb":55,"gord":83,"fibra":4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-egg-cheese-bacon","nome":"McDonald’s Egg Cheese Bacon","busca":"egg cheese bacon mcdonalds mequi egg cheese bacon","p":20,"kcal":383,"carb":41,"gord":16,"fibra":1.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-balde-de-batatas","nome":"Burger King Balde de Batatas","busca":"balde de batatas burger king bk bk balde de batatas","p":10,"kcal":653,"carb":93,"gord":24,"fibra":11,"gUn":284,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-king-duplo-bacon","nome":"Burger King King Duplo Bacon","busca":"king duplo bacon burger king bk king duplo bacon","p":52,"kcal":1314,"carb":31,"gord":107,"fibra":1,"gUn":353,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-mega-stacker-2-0","nome":"Burger King Mega Stacker 2.0","busca":"mega stacker 2.0 burger king bk mega stacker 2 0","p":56,"kcal":1054,"carb":49,"gord":68,"fibra":4,"gUn":342,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-mega-stacker-3-0","nome":"Burger King Mega Stacker 3.0","busca":"mega stacker 3.0 burger king bk mega stacker 3 0","p":80,"kcal":1414,"carb":51,"gord":96,"fibra":4,"gUn":453,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-whopper-furioso","nome":"Burger King WHOPPER® Furioso","busca":"whopper® furioso burger king bk whopper furioso","p":38,"kcal":941,"carb":69,"gord":56,"fibra":6,"gUn":366,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-beirute-super-burger","nome":"Habib’s Beirute Super Burger","busca":"beirute super burger habibs beirute super burger","p":14,"kcal":311,"carb":12,"gord":23,"fibra":0,"gUn":560,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-italianinha","nome":"Habib’s Bib’Sfiha Italianinha","busca":"bibsfiha italianinha habibs bib sfiha italianinha","p":11,"kcal":273,"carb":30,"gord":12,"fibra":0.9,"gUn":72,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-duplo-burger-bacon","nome":"McDonald’s Duplo Burger Bacon","busca":"duplo burger bacon mcdonalds mequi duplo burger bacon","p":27,"kcal":441,"carb":35,"gord":22,"fibra":2.6,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-duplo-cheeseburger","nome":"McDonald’s Duplo Cheeseburger","busca":"duplo cheeseburger mcdonalds mequi duplo cheeseburger","p":25,"kcal":428,"carb":31,"gord":22,"fibra":2,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mini-pao-de-queijo","nome":"McDonald’s Mini Pão de Queijo","busca":"mini pao de queijo mcdonalds mequi mini pao de queijo","p":6.5,"kcal":227,"carb":24,"gord":11,"fibra":0.63,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-cheeseburger-duplo","nome":"Burger King Cheeseburger Duplo","busca":"cheeseburger duplo burger king bk cheeseburger duplo","p":26,"kcal":455,"carb":31,"gord":25,"fibra":3,"gUn":178,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-genius-cheddar-e-bacon","nome":"Habib’s Genius Cheddar e Bacon","busca":"genius cheddar e bacon habibs genius cheddar e bacon","p":10,"kcal":251,"carb":16,"gord":16,"fibra":1.3,"gUn":250,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-duplo-mcfish-deluxe","nome":"McDonald’s Duplo McFish Deluxe","busca":"duplo mcfish deluxe mcdonalds mequi duplo mcfish deluxe","p":26,"kcal":596,"carb":52,"gord":32,"fibra":3.5,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tasty-turbo-1-carne","nome":"McDonald’s Tasty Turbo 1 carne","busca":"tasty turbo 1 carne mcdonalds mequi tasty turbo 1 carne","p":36,"kcal":800,"carb":41,"gord":55,"fibra":3.9,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-chicken-duplo-bacon","nome":"Burger King Chicken Duplo Bacon","busca":"chicken duplo bacon burger king bk chicken duplo bacon","p":25,"kcal":675,"carb":49,"gord":43,"fibra":4,"gUn":222,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-king-jr-toy-story","nome":"Burger King King Jr - Toy Story","busca":"king jr - toy story burger king bk king jr toy story","p":15,"kcal":246,"carb":25,"gord":10,"fibra":3,"gUn":113,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-onion-rings-media","nome":"Burger King Onion Rings – média","busca":"onion rings – media burger king bk onion rings media","p":5,"kcal":319,"carb":36,"gord":17,"fibra":4,"gUn":91,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-pao-carne-e-queijo","nome":"Burger King Pão, Carne e Queijo","busca":"pao, carne e queijo burger king bk pao carne e queijo","p":16,"kcal":288,"carb":26,"gord":14,"fibra":3,"gUn":103,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-stacker-duplo-bacon","nome":"Burger King Stacker Duplo Bacon","busca":"stacker duplo bacon burger king bk stacker duplo bacon","p":49,"kcal":864,"carb":46,"gord":53,"fibra":1,"gUn":249,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-whopper-de-plantas","nome":"Burger King WHOPPER® de Plantas","busca":"whopper® de plantas burger king bk whopper de plantas","p":28,"kcal":675,"carb":50,"gord":40,"fibra":10,"gUn":339,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"mcd-duplo-cheddar-mcmelt","nome":"McDonald’s Duplo Cheddar McMelt","busca":"duplo cheddar mcmelt mcdonalds mequi duplo cheddar mcmelt","p":52,"kcal":854,"carb":36,"gord":56,"fibra":4.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-quarterao-com-queijo","nome":"McDonald’s Quarterão com Queijo","busca":"quarterao com queijo mcdonalds mequi quarterao com queijo","p":32,"kcal":566,"carb":39,"gord":31,"fibra":2.8,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-quarterao-saja-vibes","nome":"McDonald’s Quarterão Saja Vibes","busca":"quarterao saja vibes mcdonalds mequi quarterao saja vibes","p":36,"kcal":666,"carb":40,"gord":40,"fibra":3.9,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tasty-turbo-2-carnes","nome":"McDonald’s Tasty Turbo 2 carnes","busca":"tasty turbo 2 carnes mcdonalds mequi tasty turbo 2 carnes","p":56,"kcal":1070,"carb":41,"gord":76,"fibra":4.4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tasty-turbo-3-carnes","nome":"McDonald’s Tasty Turbo 3 carnes","busca":"tasty turbo 3 carnes mcdonalds mequi tasty turbo 3 carnes","p":77,"kcal":1340,"carb":41,"gord":97,"fibra":4.8,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-batata-frita-media","nome":"Burger King Batata Frita – média","busca":"batata frita – media burger king bk batata frita media","p":4,"kcal":258,"carb":37,"gord":10,"fibra":4,"gUn":112,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-cheddar-duplo-crispy","nome":"Burger King Cheddar Duplo Crispy","busca":"cheddar duplo crispy burger king bk cheddar duplo crispy","p":14,"kcal":283,"carb":18,"gord":17,"fibra":1,"gUn":100,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-chicken-6-unidades","nome":"Burger King Chicken – 6 unidades","busca":"chicken – 6 unidades burger king bk bk chicken 6 unidades","p":14,"kcal":223,"carb":20,"gord":10,"fibra":1,"gUn":111,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-onion-rings-grande","nome":"Burger King Onion Rings – grande","busca":"onion rings – grande burger king bk onion rings grande","p":6,"kcal":313,"carb":55,"gord":7,"fibra":5,"gUn":130,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-batata-frita-grande","nome":"Burger King Batata Frita – grande","busca":"batata frita – grande burger king bk batata frita grande","p":5,"kcal":327,"carb":47,"gord":12,"fibra":5,"gUn":142,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-chicken-10-unidades","nome":"Burger King Chicken – 10 unidades","busca":"chicken – 10 unidades burger king bk bk chicken 10 unidades","p":23,"kcal":373,"carb":33,"gord":17,"fibra":2,"gUn":186,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-chicken-duplo-furioso","nome":"Burger King Chicken Duplo Furioso","busca":"chicken duplo furioso burger king bk chicken duplo furioso","p":23,"kcal":675,"carb":55,"gord":42,"fibra":4,"gUn":241,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"mcd-brabo-brabissimo-carne","nome":"McDonald’s Brabo Brabissímo Carne","busca":"brabo brabissimo carne mcdonalds mequi brabo brabissimo carne","p":58,"kcal":1244,"carb":51,"gord":90,"fibra":4.4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-duplo-egg-cheese-bacon","nome":"McDonald’s Duplo Egg Cheese Bacon","busca":"duplo egg cheese bacon mcdonalds mequi duplo egg cheese bacon","p":25,"kcal":443,"carb":42,"gord":20,"fibra":1.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcfritas-cheddar-bacon","nome":"McDonald’s McFritas Cheddar Bacon","busca":"mcfritas cheddar bacon mcdonalds mequi mcfritas cheddar bacon","p":9,"kcal":431,"carb":38,"gord":26,"fibra":4.2,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-salada-mix-crispy-beef","nome":"McDonald’s Salada Mix Crispy Beef","busca":"salada mix crispy beef mcdonalds mequi salada mix crispy beef","p":28,"kcal":368,"carb":3,"gord":23,"fibra":3.4,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-batata-frita-pequena","nome":"Burger King Batata Frita – pequena","busca":"batata frita – pequena burger king bk batata frita pequena","p":3,"kcal":179,"carb":26,"gord":7,"fibra":3,"gUn":78,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-beirute-de-frango-crocante","nome":"Habib’s Beirute de Frango Crocante","busca":"beirute de frango crocante habibs beirute de frango crocante","p":7.4,"kcal":194,"carb":24,"gord":7.6,"fibra":1.3,"gUn":500,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-mccrispy-chicken-deluxe","nome":"McDonald’s McCrispy Chicken Deluxe","busca":"mccrispy chicken deluxe mcdonalds mequi mccrispy chicken deluxe","p":32,"kcal":593,"carb":53,"gord":28,"fibra":4.8,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mccrispy-chicken-legend","nome":"McDonald’s McCrispy Chicken Legend","busca":"mccrispy chicken legend mcdonalds mequi mccrispy chicken legend","p":37,"kcal":900,"carb":65,"gord":55,"fibra":4.3,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-batata-furiosa-grande","nome":"Burger King Batata Furiosa – grande","busca":"batata furiosa – grande burger king bk batata furiosa grande","p":21,"kcal":1042,"carb":133,"gord":45,"fibra":11,"gUn":408,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-batata-suprema-grande","nome":"Burger King Batata Suprema – grande","busca":"batata suprema – grande burger king bk batata suprema grande","p":23,"kcal":1059,"carb":124,"gord":50,"fibra":11,"gUn":410,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-mega-stacker-rodeio-2-0","nome":"Burger King Mega Stacker Rodeio 2.0","busca":"mega stacker rodeio 2.0 burger king bk mega stacker rodeio 2 0","p":59,"kcal":1259,"carb":76,"gord":78,"fibra":6,"gUn":417,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-mega-stacker-rodeio-3-0","nome":"Burger King Mega Stacker Rodeio 3.0","busca":"mega stacker rodeio 3.0 burger king bk mega stacker rodeio 3 0","p":83,"kcal":1619,"carb":78,"gord":106,"fibra":6,"gUn":528,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-whopper-barbecue-bacon","nome":"Burger King WHOPPER® Barbecue Bacon","busca":"whopper® barbecue bacon burger king bk whopper barbecue bacon","p":35,"kcal":767,"carb":49,"gord":47,"fibra":5,"gUn":335,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-beirute-tradicional-rosbife","nome":"Habib’s Beirute Tradicional Rosbife","busca":"beirute tradicional rosbife habibs beirute tradicional rosbife","p":7.4,"kcal":203,"carb":15,"gord":13,"fibra":0.7,"gUn":490,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"bk-mega-stacker-cheddar-2-0","nome":"Burger King Mega Stacker Cheddar 2.0","busca":"mega stacker cheddar 2.0 burger king bk mega stacker cheddar 2 0","p":51,"kcal":933,"carb":49,"gord":57,"fibra":4,"gUn":325,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-mega-stacker-cheddar-3-0","nome":"Burger King Mega Stacker Cheddar 3.0","busca":"mega stacker cheddar 3.0 burger king bk mega stacker cheddar 3 0","p":72,"kcal":1232,"carb":50,"gord":79,"fibra":4,"gUn":427,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-batata-super-cheddar-e-bacon","nome":"Habib’s Batata Super Cheddar e Bacon","busca":"batata super cheddar e bacon habibs batata super cheddar e bacon","p":6.4,"kcal":249,"carb":21,"gord":16,"fibra":1.2,"gUn":130,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-panini-com-queijo-e-bacon","nome":"McDonald’s Panini com queijo e bacon","busca":"panini com queijo e bacon mcdonalds mequi panini com queijo e bacon","p":7.8,"kcal":220,"carb":21,"gord":12,"fibra":0.6,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-pao-tipo-brioche-na-chapa","nome":"McDonald’s Pão tipo Brioche na Chapa","busca":"pao tipo brioche na chapa mcdonalds mequi pao tipo brioche na chapa","p":7.3,"kcal":280.5,"carb":38.6,"gord":10.8,"fibra":2.6,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-salada-mix-crispy-chicken","nome":"McDonald’s Salada Mix Crispy Chicken","busca":"salada mix crispy chicken mcdonalds mequi salada mix crispy chicken","p":30,"kcal":423,"carb":24,"gord":23,"fibra":4.5,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tasty-turbo-bacon-1-carne","nome":"McDonald’s Tasty Turbo Bacon 1 carne","busca":"tasty turbo bacon 1 carne mcdonalds mequi tasty turbo bacon 1 carne","p":43,"kcal":888,"carb":41,"gord":61,"fibra":4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tasty-turbo-bacon-2-carnes","nome":"McDonald’s Tasty Turbo Bacon 2 carnes","busca":"tasty turbo bacon 2 carnes mcdonalds mequi tasty turbo bacon 2 carnes","p":63,"kcal":1158,"carb":41,"gord":82,"fibra":4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tasty-turbo-bacon-3-carnes","nome":"McDonald’s Tasty Turbo Bacon 3 carnes","busca":"tasty turbo bacon 3 carnes mcdonalds mequi tasty turbo bacon 3 carnes","p":84,"kcal":1428,"carb":41,"gord":103,"fibra":5,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-folhado-com-queijo-e-tomate","nome":"McDonald’s Folhado com Queijo e Tomate","busca":"folhado com queijo e tomate mcdonalds mequi folhado com queijo e tomate","p":8,"kcal":416,"carb":36,"gord":26,"fibra":1.5,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-batata-furiosa-individual","nome":"Burger King Batata Furiosa – individual","busca":"batata furiosa – individual burger king bk batata furiosa individual","p":11,"kcal":521,"carb":66,"gord":23,"fibra":6,"gUn":204,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-batata-suprema-individual","nome":"Burger King Batata Suprema – individual","busca":"batata suprema – individual burger king bk batata suprema individual","p":11,"kcal":530,"carb":62,"gord":25,"fibra":6,"gUn":205,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-de-frango-com-cremely","nome":"Habib’s Bib’Sfiha de Frango com Cremely","busca":"bibsfiha de frango com cremely habibs bib sfiha de frango com cremely","p":6.4,"kcal":186,"carb":27,"gord":6.1,"fibra":1.1,"gUn":85,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-chicken-mcnuggets-4-unidades","nome":"McDonald’s Chicken McNuggets 4 unidades","busca":"chicken mcnuggets 4 unidades mcdonalds mequi chicken mcnuggets 4 unidades","p":9,"kcal":155,"carb":10,"gord":8.6,"fibra":0.77,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-chicken-mcnuggets-6-unidades","nome":"McDonald’s Chicken McNuggets 6 unidades","busca":"chicken mcnuggets 6 unidades mcdonalds mequi chicken mcnuggets 6 unidades","p":14,"kcal":232,"carb":16,"gord":13,"fibra":1.2,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-de-carne-com-mussarela","nome":"Habib’s Bib’Sfiha de Carne com Mussarela","busca":"bibsfiha de carne com mussarela habibs bib sfiha de carne com mussarela","p":9,"kcal":217,"carb":27,"gord":8.3,"fibra":1.3,"gUn":85,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-chicken-mcnuggets-10-unidades","nome":"McDonald’s Chicken McNuggets 10 unidades","busca":"chicken mcnuggets 10 unidades mcdonalds mequi chicken mcnuggets 10 unidades","p":24,"kcal":387,"carb":26,"gord":21,"fibra":1.9,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-chicken-mcnuggets-15-unidades","nome":"McDonald’s Chicken McNuggets 15 unidades","busca":"chicken mcnuggets 15 unidades mcdonalds mequi chicken mcnuggets 15 unidades","p":34,"kcal":581,"carb":39,"gord":32,"fibra":2.9,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-de-espinafre-com-cremely","nome":"Habib’s Bib’Sfiha de Espinafre com Cremely","busca":"bibsfiha de espinafre com cremely habibs bib sfiha de espinafre com cremely","p":5.6,"kcal":202,"carb":30,"gord":7,"fibra":1.9,"gUn":76,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-de-calabresa-com-mussarela","nome":"Habib’s Bib’Sfiha de Calabresa com Mussarela","busca":"bibsfiha de calabresa com mussarela habibs bib sfiha de calabresa com mussarela","p":8.1,"kcal":251,"carb":31,"gord":11,"fibra":1.1,"gUn":70,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"bk-chicken-duplo-barbecue-bacon-230-g","nome":"Burger King Chicken Duplo Barbecue Bacon 230 g","busca":"chicken duplo barbecue bacon 230 g burger king bk chicken duplo barbecue bacon 230 g","p":25,"kcal":689,"carb":52,"gord":43,"fibra":4,"gUn":230,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-chicken-duplo-barbecue-bacon-382-g","nome":"Burger King Chicken Duplo Barbecue Bacon 382 g","busca":"chicken duplo barbecue bacon 382 g burger king bk chicken duplo barbecue bacon 382 g","p":28,"kcal":1589,"carb":52,"gord":142,"fibra":5,"gUn":382,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-folhada-de-quatro-queijos-com-cremely","nome":"Habib’s Bib’Sfiha Folhada de Quatro Queijos com Cremely","busca":"bibsfiha folhada de quatro queijos com cremely habibs bib sfiha folhada de quatro queijos com cremely","p":11,"kcal":360,"carb":30,"gord":22,"fibra":1,"gUn":55,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-folhada-de-picanha-com-cheddar-e-bacon","nome":"Habib’s Bib’Sfiha Folhada de Picanha com Cheddar e Bacon","busca":"bibsfiha folhada de picanha com cheddar e bacon habibs bib sfiha folhada de picanha com cheddar e bacon","p":9.4,"kcal":307,"carb":26,"gord":18,"fibra":1.6,"gUn":67,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
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
  "mcd-panini-com-queijo-e-bacon": [
    "carne",
    "ovo",
    "leite"
  ],
  "mcd-folhado-com-queijo-e-tomate": [
    "ovo",
    "leite"
  ],
  "hab-batata-super-cheddar-e-bacon": [
    "carne",
    "leite"
  ],
  "hab-bib-sfiha-de-carne-com-mussarela": [
    "carne",
    "leite"
  ],
  "hab-bib-sfiha-de-espinafre-com-cremely": [
    "leite"
  ],
  "hab-bib-sfiha-de-frango": [
    "ave"
  ],
  "hab-bib-sfiha-de-calabresa-com-mussarela": [
    "carne",
    "leite"
  ],
  "hab-bib-sfiha-de-carne": [
    "carne"
  ],
  "hab-bib-sfiha-de-frango-com-cremely": [
    "ave",
    "leite"
  ],
  "hab-bib-sfiha-italianinha": [
    "leite"
  ],
  "hab-bib-sfiha-de-queijo": [
    "leite"
  ],
  "hab-bib-sfiha-folhada-de-picanha-com-cheddar-e-bacon": [
    "carne",
    "leite"
  ],
  "hab-bib-sfiha-folhada-de-quatro-queijos-com-cremely": [
    "leite"
  ],
  "hab-beirute-super-burger": [
    "leite"
  ],
  "hab-beirute-tradicional-rosbife": [
    "leite"
  ],
  "hab-beirute-de-kafta": [
    "carne",
    "leite"
  ],
  "hab-genius-croc-chicken": [
    "leite"
  ],
  "hab-genius-cheddar": [
    "leite"
  ],
  "hab-genius-cheddar-e-bacon": [
    "carne",
    "leite"
  ],
  "hab-beirute-de-frango-crocante": [
    "carne",
    "ave",
    "leite"
  ],
  "bk-whopper": [
    "carne"
  ],
  "bk-whopper-duplo": [
    "carne"
  ],
  "bk-whopper-furioso": [
    "carne"
  ],
  "bk-whopper-jr": [
    "carne"
  ],
  "bk-whopper-barbecue-bacon": [
    "carne"
  ],
  "bk-whopper-rodeio": [
    "carne"
  ],
  "bk-pao-carne-e-queijo": [
    "carne",
    "leite"
  ],
  "bk-cheeseburger": [
    "carne",
    "leite"
  ],
  "bk-stacker-duplo-bacon": [
    "carne"
  ],
  "bk-big-king": [
    "carne"
  ],
  "bk-mega-stacker-2-0": [
    "carne"
  ],
  "bk-mega-stacker-3-0": [
    "carne"
  ],
  "bk-mega-stacker-cheddar-2-0": [
    "carne",
    "leite"
  ],
  "bk-mega-stacker-cheddar-3-0": [
    "carne",
    "leite"
  ],
  "bk-mega-stacker-rodeio-2-0": [
    "carne"
  ],
  "bk-mega-stacker-rodeio-3-0": [
    "carne"
  ],
  "bk-rodeio": [
    "carne"
  ],
  "bk-rodeio-duplo": [
    "carne"
  ],
  "bk-cheeseburger-duplo": [
    "carne",
    "leite"
  ],
  "bk-cheddar-duplo-crispy": [
    "carne",
    "leite"
  ],
  "bk-chicken-jr": [
    "ave"
  ],
  "bk-bk-chicken-crispy": [
    "ave"
  ],
  "bk-chicken-duplo": [
    "ave"
  ],
  "bk-chicken-duplo-barbecue-bacon-230-g": [
    "carne",
    "ave"
  ],
  "bk-chicken-duplo-barbecue-bacon-382-g": [
    "carne",
    "ave"
  ],
  "bk-whopper-de-plantas": [
    "carne"
  ],
  "bk-bk-chicken-6-unidades": [
    "ave"
  ],
  "bk-bk-chicken-10-unidades": [
    "ave"
  ],
  "bk-bk-balde-de-batatas": [
    "leite"
  ],
  "bk-chicken-duplo-furioso": [
    "carne",
    "ave"
  ],
  "bk-chicken-duplo-bacon": [
    "carne",
    "ave"
  ],
  "bk-king-bacon": [
    "carne"
  ],
  "bk-king-duplo-bacon": [
    "carne"
  ],
  "bk-whopper-grogu": [
    "carne"
  ]
};
