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

   255 itens · McDonald's e Habib's, Brasil
   ============================================================ */
import type { Alimento } from './alimentos';

export const REDES_BR: Alimento[] = [
  {"id":"mcd-mcfish","nome":"McDonald’s McFish","busca":"mcfish mcdonalds mequi mcfish","p":17,"kcal":391,"carb":39,"gord":19,"fibra":1.9,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-rodeio","nome":"Burger King Rodeio","busca":"rodeio burger king bk rodeio","p":17,"kcal":444,"carb":36,"gord":26,"fibra":3,"gUn":144,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"mcd-big-mac","nome":"McDonald’s Big Mac","busca":"big mac mcdonalds mequi big mac","p":26,"kcal":524,"carb":43,"gord":27,"fibra":1.9,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcfloat","nome":"McDonald’s McFloat","busca":"mcfloat mcdonalds mequi mcfloat","p":2.3,"kcal":144,"carb":27,"gord":3.2,"fibra":0,"gUn":null,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-supermc","nome":"McDonald’s SuperMc","busca":"supermc mcdonalds mequi supermc","p":38,"kcal":795,"carb":42,"gord":54,"fibra":4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-ketchup","nome":"Burger King Ketchup","busca":"ketchup burger king bk ketchup","p":0,"kcal":8,"carb":2,"gord":0,"fibra":0,"gUn":7,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-sundae-fast","nome":"Habib’s Sundae Fast","busca":"sundae fast habibs sundae fast","p":2.8,"kcal":188,"carb":31,"gord":5.7,"fibra":0,"gUn":120,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-batata-p","nome":"McDonald’s Batata P","busca":"batata p mcdonalds mequi batata p","p":2,"kcal":171,"carb":25,"gord":7,"fibra":2,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-mostarda","nome":"Burger King Mostarda","busca":"mostarda burger king bk mostarda","p":0,"kcal":3,"carb":0,"gord":0,"fibra":0,"gUn":5,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-whopper","nome":"Burger King WHOPPER®","busca":"whopper® burger king bk whopper","p":32,"kcal":717,"carb":47,"gord":44,"fibra":5,"gUn":325,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"mcd-hamburger","nome":"McDonald’s Hamburger","busca":"hamburger mcdonalds mequi hamburger","p":13,"kcal":242,"carb":29,"gord":8,"fibra":1.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcchicken","nome":"McDonald’s McChicken","busca":"mcchicken mcdonalds mequi mcchicken","p":17,"kcal":403,"carb":42,"gord":18,"fibra":3,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tomatinho","nome":"McDonald’s Tomatinho","busca":"tomatinho mcdonalds mequi tomatinho","p":0.54,"kcal":11,"carb":1.6,"gord":0.27,"fibra":0.86,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-big-king","nome":"Burger King Big King™","busca":"big king™ burger king bk big king","p":35,"kcal":739,"carb":44,"gord":46,"fibra":2,"gUn":266,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-mix-grogu","nome":"Burger King Mix Grogu","busca":"mix grogu burger king bk bk mix grogu","p":5,"kcal":420,"carb":61,"gord":17,"fibra":1,"gUn":185,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"mcd-egg-burger","nome":"McDonald’s Egg Burger","busca":"egg burger mcdonalds mequi egg burger","p":22,"kcal":414,"carb":41,"gord":18,"fibra":1.8,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-side-salad","nome":"McDonald’s Side Salad","busca":"side salad mcdonalds mequi side salad","p":1,"kcal":10,"carb":1,"gord":0,"fibra":1,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-king-bacon","nome":"Burger King King Bacon","busca":"king bacon burger king bk king bacon","p":30,"kcal":821,"carb":29,"gord":64,"fibra":1,"gUn":222,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-genius-cheddar","nome":"Habib’s Genius Cheddar","busca":"genius cheddar habibs genius cheddar","p":9.8,"kcal":254,"carb":17,"gord":16,"fibra":1.3,"gUn":235,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-chicken-jr","nome":"McDonald’s Chicken Jr.","busca":"chicken jr. mcdonalds mequi chicken jr","p":12,"kcal":349,"carb":43,"gord":15,"fibra":2.4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-salada-fish","nome":"McDonald’s Salada Fish","busca":"salada fish mcdonalds mequi salada fish","p":16,"kcal":222,"carb":13,"gord":12,"fibra":3.5,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-chicken-jr","nome":"Burger King Chicken Jr.","busca":"chicken jr. burger king bk chicken jr","p":14,"kcal":385,"carb":36,"gord":21,"fibra":3,"gUn":137,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"mcd-cheeseburger","nome":"McDonald’s Cheeseburger","busca":"cheeseburger mcdonalds mequi cheeseburger","p":15,"kcal":291,"carb":30,"gord":12,"fibra":1.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-derpy-sundae","nome":"McDonald’s Derpy Sundae","busca":"derpy sundae mcdonalds mequi derpy sundae","p":3,"kcal":227,"carb":42,"gord":5,"fibra":0.1,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-duplo-mcfish","nome":"McDonald’s Duplo McFish","busca":"duplo mcfish mcdonalds mequi duplo mcfish","p":17,"kcal":396,"carb":40,"gord":19,"fibra":2.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-cheeseburger","nome":"Burger King Cheeseburger","busca":"cheeseburger burger king bk cheeseburger","p":16,"kcal":308,"carb":30,"gord":14,"fibra":3,"gUn":130,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-maionese-bk","nome":"Burger King Maionese BK®","busca":"maionese bk® burger king bk maionese bk","p":0,"kcal":126,"carb":0,"gord":14,"fibra":0,"gUn":20,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-mix-biscoff","nome":"Burger King Mix Biscoff®","busca":"mix biscoff® burger king bk bk mix biscoff","p":6,"kcal":487,"carb":80,"gord":16,"fibra":1,"gUn":217,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-rodeio-duplo","nome":"Burger King Rodeio Duplo","busca":"rodeio duplo burger king bk rodeio duplo","p":27,"kcal":606,"carb":43,"gord":37,"fibra":4,"gUn":200,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-whopper-jr","nome":"Burger King WHOPPER® Jr.","busca":"whopper® jr. burger king bk whopper jr","p":17,"kcal":388,"carb":29,"gord":23,"fibra":3,"gUn":179,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-beirute-de-kafta","nome":"Habib’s Beirute de Kafta","busca":"beirute de kafta habibs beirute de kafta","p":7,"kcal":214,"carb":16,"gord":13,"fibra":1.1,"gUn":530,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-mcfish-deluxe","nome":"McDonald’s McFish Deluxe","busca":"mcfish deluxe mcdonalds mequi mcfish deluxe","p":26,"kcal":591,"carb":51,"gord":31,"fibra":2.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-pao-de-queijo","nome":"McDonald’s Pão de Queijo","busca":"pao de queijo mcdonalds mequi pao de queijo","p":3.2,"kcal":145,"carb":19,"gord":6.9,"fibra":0.86,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-queijo-quente","nome":"McDonald’s Queijo Quente","busca":"queijo quente mcdonalds mequi queijo quente","p":12,"kcal":314,"carb":41,"gord":11,"fibra":1.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-torta-de-maca","nome":"McDonald’s Torta de Maçã","busca":"torta de maca mcdonalds mequi torta de maca","p":1.8,"kcal":154,"carb":27,"gord":4.5,"fibra":0.8,"gUn":null,"qtd":1,"un":"torta","unp":"tortas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-triplo-burger","nome":"McDonald’s Triplo Burger","busca":"triplo burger mcdonalds mequi triplo burger","p":34,"kcal":549,"carb":36,"gord":29,"fibra":3,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-chicken-duplo","nome":"Burger King Chicken Duplo","busca":"chicken duplo burger king bk chicken duplo","p":23,"kcal":591,"carb":48,"gord":35,"fibra":4,"gUn":206,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-whopper-grogu","nome":"Burger King Whopper Grogu","busca":"whopper grogu burger king bk whopper grogu","p":32,"kcal":735,"carb":46,"gord":46,"fibra":5,"gUn":300,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-cascao-de-morango","nome":"Habib’s Cascão de Morango","busca":"cascao de morango habibs cascao de morango","p":2.3,"kcal":196,"carb":38,"gord":3.7,"fibra":0,"gUn":125,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-cheddar-mcmelt","nome":"McDonald’s Cheddar McMelt","busca":"cheddar mcmelt mcdonalds mequi cheddar mcmelt","p":29,"kcal":509,"carb":33,"gord":29,"fibra":3.2,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcfritas-media","nome":"McDonald’s McFritas Média","busca":"mcfritas media mcdonalds mequi mcfritas media","p":4.8,"kcal":295,"carb":35,"gord":15,"fibra":4.1,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcnifico-bacon","nome":"McDonald’s McNífico Bacon","busca":"mcnifico bacon mcdonalds mequi mcnifico bacon","p":32,"kcal":595,"carb":40,"gord":34,"fibra":4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-sundae-morango","nome":"McDonald’s Sundae morango","busca":"sundae morango mcdonalds mequi sundae morango","p":6,"kcal":298,"carb":50,"gord":9,"fibra":0.8,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-chicken-crispy","nome":"Burger King Chicken Crispy","busca":"chicken crispy burger king bk bk chicken crispy","p":29,"kcal":501,"carb":41,"gord":25,"fibra":2,"gUn":200,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-king-fraldinha","nome":"Burger King King Fraldinha","busca":"king fraldinha burger king bk king fraldinha","p":45,"kcal":961,"carb":39,"gord":69,"fibra":2,"gUn":307,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-maionese-verde","nome":"Burger King Maionese verde","busca":"maionese verde burger king bk maionese verde","p":0,"kcal":120,"carb":0,"gord":13,"fibra":0,"gUn":20,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-mix-de-brownie","nome":"Burger King Mix de Brownie","busca":"mix de brownie burger king bk mix de brownie","p":5,"kcal":393,"carb":60,"gord":15,"fibra":2,"gUn":193,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-shake-biscoff","nome":"Burger King Shake Biscoff®","busca":"shake biscoff® burger king bk bk shake biscoff","p":8,"kcal":699,"carb":116,"gord":22,"fibra":2,"gUn":342,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-whopper-duplo","nome":"Burger King WHOPPER® Duplo","busca":"whopper® duplo burger king bk whopper duplo","p":50,"kcal":962,"carb":47,"gord":62,"fibra":5,"gUn":405,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-de-carne","nome":"Habib’s Bib’Sfiha de Carne","busca":"bibsfiha de carne habibs bib sfiha de carne","p":7.3,"kcal":203,"carb":30,"gord":6.1,"fibra":1.5,"gUn":75,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-casquinha-mista","nome":"McDonald’s Casquinha Mista","busca":"casquinha mista mcdonalds mequi casquinha mista","p":3.3,"kcal":167,"carb":30,"gord":3.9,"fibra":0.4,"gUn":null,"qtd":1,"un":"casquinha","unp":"casquinhas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-duplo-quarterao","nome":"McDonald’s Duplo Quarterão","busca":"duplo quarterao mcdonalds mequi duplo quarterao","p":52,"kcal":836,"carb":39,"gord":52,"fibra":3.2,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcchicken-bacon","nome":"McDonald’s McChicken Bacon","busca":"mcchicken bacon mcdonalds mequi mcchicken bacon","p":18,"kcal":409,"carb":42,"gord":19,"fibra":2.9,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcchicken-duplo","nome":"McDonald’s McChicken Duplo","busca":"mcchicken duplo mcdonalds mequi mcchicken duplo","p":31,"kcal":665,"carb":53,"gord":36,"fibra":4.2,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcfritas-grande","nome":"McDonald’s McFritas Grande","busca":"mcfritas grande mcdonalds mequi mcfritas grande","p":6.9,"kcal":422,"carb":50,"gord":22,"fibra":5.8,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcshake-morango","nome":"McDonald’s McShake Morango","busca":"mcshake morango mcdonalds mequi mcshake morango","p":8,"kcal":575,"carb":111,"gord":11,"fibra":0,"gUn":null,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-sundae-caramelo","nome":"McDonald’s Sundae caramelo","busca":"sundae caramelo mcdonalds mequi sundae caramelo","p":5.4,"kcal":307,"carb":51,"gord":9.2,"fibra":0.97,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-torta-de-banana","nome":"McDonald’s Torta de Banana","busca":"torta de banana mcdonalds mequi torta de banana","p":2.1,"kcal":152,"carb":26,"gord":4.4,"fibra":0.6,"gUn":null,"qtd":1,"un":"torta","unp":"tortas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-baldao-biscoff","nome":"Burger King Baldão Biscoff®","busca":"baldao biscoff® burger king bk bk baldao biscoff","p":14,"kcal":1133,"carb":186,"gord":37,"fibra":3,"gUn":536,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-casquinha-mista","nome":"Burger King Casquinha Mista","busca":"casquinha mista burger king bk casquinha mista","p":3,"kcal":224,"carb":39,"gord":6,"fibra":1,"gUn":127,"qtd":1,"un":"casquinha","unp":"casquinhas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-whopper-rodeio","nome":"Burger King WHOPPER® Rodeio","busca":"whopper® rodeio burger king bk whopper rodeio","p":34,"kcal":901,"carb":70,"gord":53,"fibra":6,"gUn":352,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-de-frango","nome":"Habib’s Bib’Sfiha de Frango","busca":"bibsfiha de frango habibs bib sfiha de frango","p":6,"kcal":183,"carb":30,"gord":4.8,"fibra":1.2,"gUn":75,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-de-queijo","nome":"Habib’s Bib’Sfiha de Queijo","busca":"bibsfiha de queijo habibs bib sfiha de queijo","p":10,"kcal":256,"carb":34,"gord":8.7,"fibra":0.8,"gUn":70,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-cascao-de-chocolate","nome":"Habib’s Cascão de Chocolate","busca":"cascao de chocolate habibs cascao de chocolate","p":2.4,"kcal":194,"carb":37,"gord":4.3,"fibra":0,"gUn":125,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-genius-croc-chicken","nome":"Habib’s Genius Croc Chicken","busca":"genius croc chicken habibs genius croc chicken","p":8.4,"kcal":189,"carb":22,"gord":7.1,"fibra":1.7,"gUn":213,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-velosa-coco","nome":"Habib’s Sorvete Velosa Coco","busca":"sorvete velosa coco habibs sorvete velosa coco","p":4.2,"kcal":234,"carb":25,"gord":13,"fibra":0.7,"gUn":60,"qtd":1,"un":"bola","unp":"bolas","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sundae-soft-morango","nome":"Habib’s Sundae Soft Morango","busca":"sundae soft morango habibs sundae soft morango","p":2.7,"kcal":190,"carb":32,"gord":5.6,"fibra":0,"gUn":125,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-brabo-smokehouse","nome":"McDonald’s Brabo SmokeHouse","busca":"brabo smokehouse mcdonalds mequi brabo smokehouse","p":61,"kcal":1211,"carb":55,"gord":83,"fibra":4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-egg-cheese-bacon","nome":"McDonald’s Egg Cheese Bacon","busca":"egg cheese bacon mcdonalds mequi egg cheese bacon","p":20,"kcal":383,"carb":41,"gord":16,"fibra":1.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-sundae-chocolate","nome":"McDonald’s Sundae chocolate","busca":"sundae chocolate mcdonalds mequi sundae chocolate","p":6,"kcal":322,"carb":50,"gord":12,"fibra":2.5,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-balde-de-batatas","nome":"Burger King Balde de Batatas","busca":"balde de batatas burger king bk bk balde de batatas","p":10,"kcal":653,"carb":93,"gord":24,"fibra":11,"gUn":284,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-king-duplo-bacon","nome":"Burger King King Duplo Bacon","busca":"king duplo bacon burger king bk king duplo bacon","p":52,"kcal":1314,"carb":31,"gord":107,"fibra":1,"gUn":353,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-mega-stacker-2-0","nome":"Burger King Mega Stacker 2.0","busca":"mega stacker 2.0 burger king bk mega stacker 2 0","p":56,"kcal":1054,"carb":49,"gord":68,"fibra":4,"gUn":342,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-mega-stacker-3-0","nome":"Burger King Mega Stacker 3.0","busca":"mega stacker 3.0 burger king bk mega stacker 3 0","p":80,"kcal":1414,"carb":51,"gord":96,"fibra":4,"gUn":453,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-mix-com-nutella","nome":"Burger King Mix com Nutella®","busca":"mix com nutella® burger king bk bk mix com nutella","p":6,"kcal":484,"carb":68,"gord":21,"fibra":2,"gUn":196,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-shake-de-morango","nome":"Burger King Shake de Morango","busca":"shake de morango burger king bk shake de morango","p":4,"kcal":493,"carb":91,"gord":13,"fibra":2,"gUn":318,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-whopper-furioso","nome":"Burger King WHOPPER® Furioso","busca":"whopper® furioso burger king bk whopper furioso","p":38,"kcal":941,"carb":69,"gord":56,"fibra":6,"gUn":366,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-beirute-super-burger","nome":"Habib’s Beirute Super Burger","busca":"beirute super burger habibs beirute super burger","p":14,"kcal":311,"carb":12,"gord":23,"fibra":0,"gUn":560,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-velosa-creme","nome":"Habib’s Sorvete Velosa Creme","busca":"sorvete velosa creme habibs sorvete velosa creme","p":3.8,"kcal":204,"carb":24,"gord":10,"fibra":0,"gUn":60,"qtd":1,"un":"bola","unp":"bolas","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"bk-baldao-de-brownie","nome":"Burger King Baldão de Brownie","busca":"baldao de brownie burger king bk baldao de brownie","p":14,"kcal":1083,"carb":171,"gord":38,"fibra":4,"gUn":534,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-sundae-de-morango","nome":"Burger King Sundae de Morango","busca":"sundae de morango burger king bk sundae de morango","p":4,"kcal":312,"carb":51,"gord":10,"fibra":2,"gUn":173,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-italianinha","nome":"Habib’s Bib’Sfiha Italianinha","busca":"bibsfiha italianinha habibs bib sfiha italianinha","p":11,"kcal":273,"carb":30,"gord":12,"fibra":0.9,"gUn":72,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sundae-soft-chocolate","nome":"Habib’s Sundae Soft Chocolate","busca":"sundae soft chocolate habibs sundae soft chocolate","p":2.8,"kcal":188,"carb":31,"gord":6.2,"fibra":0,"gUn":125,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-casquinha-baunilha","nome":"McDonald’s Casquinha Baunilha","busca":"casquinha baunilha mcdonalds mequi casquinha baunilha","p":3.2,"kcal":170,"carb":31,"gord":3.9,"fibra":0.37,"gUn":null,"qtd":1,"un":"casquinha","unp":"casquinhas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-duplo-burger-bacon","nome":"McDonald’s Duplo Burger Bacon","busca":"duplo burger bacon mcdonalds mequi duplo burger bacon","p":27,"kcal":441,"carb":35,"gord":22,"fibra":2.6,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-duplo-cheeseburger","nome":"McDonald’s Duplo Cheeseburger","busca":"duplo cheeseburger mcdonalds mequi duplo cheeseburger","p":25,"kcal":428,"carb":31,"gord":22,"fibra":2,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mccolosso-caramelo","nome":"McDonald’s McColosso Caramelo","busca":"mccolosso caramelo mcdonalds mequi mccolosso caramelo","p":4.4,"kcal":269,"carb":52,"gord":5,"fibra":0.58,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcshake-do-grimace","nome":"McDonald’s McShake do Grimace","busca":"mcshake do grimace mcdonalds mequi mcshake do grimace","p":7,"kcal":459,"carb":84,"gord":11,"fibra":0.2,"gUn":null,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcshake-kopenhagen","nome":"McDonald’s McShake Kopenhagen","busca":"mcshake kopenhagen mcdonalds mequi mcshake kopenhagen","p":11,"kcal":758,"carb":110,"gord":30,"fibra":6.1,"gUn":null,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcshake-ovomaltine","nome":"McDonald’s McShake Ovomaltine","busca":"mcshake ovomaltine mcdonalds mequi mcshake ovomaltine","p":10,"kcal":635,"carb":120,"gord":13,"fibra":2.5,"gUn":null,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mini-pao-de-queijo","nome":"McDonald’s Mini Pão de Queijo","busca":"mini pao de queijo mcdonalds mequi mini pao de queijo","p":6.5,"kcal":227,"carb":24,"gord":11,"fibra":0.63,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-top-sundae-morango","nome":"McDonald’s Top Sundae morango","busca":"top sundae morango mcdonalds mequi top sundae morango","p":10,"kcal":485,"carb":80,"gord":14,"fibra":0.9,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-cheeseburger-duplo","nome":"Burger King Cheeseburger Duplo","busca":"cheeseburger duplo burger king bk cheeseburger duplo","p":26,"kcal":455,"carb":31,"gord":25,"fibra":3,"gUn":178,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-mix-de-ovomaltine","nome":"Burger King Mix de Ovomaltine®","busca":"mix de ovomaltine® burger king bk mix de ovomaltine","p":4,"kcal":433,"carb":68,"gord":16,"fibra":2,"gUn":189,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-shake-com-nutella","nome":"Burger King Shake com Nutella®","busca":"shake com nutella® burger king bk shake com nutella","p":7,"kcal":550,"carb":88,"gord":19,"fibra":1,"gUn":296,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-shake-de-chocolate","nome":"Burger King Shake de Chocolate","busca":"shake de chocolate burger king bk shake de chocolate","p":21,"kcal":616,"carb":90,"gord":19,"fibra":2,"gUn":325,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-genius-cheddar-e-bacon","nome":"Habib’s Genius Cheddar e Bacon","busca":"genius cheddar e bacon habibs genius cheddar e bacon","p":10,"kcal":251,"carb":16,"gord":16,"fibra":1.3,"gUn":250,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-velosa-morango","nome":"Habib’s Sorvete Velosa Morango","busca":"sorvete velosa morango habibs sorvete velosa morango","p":3.6,"kcal":186,"carb":25,"gord":7.9,"fibra":0,"gUn":60,"qtd":1,"un":"bola","unp":"bolas","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-casquinha-chocolate","nome":"McDonald’s Casquinha Chocolate","busca":"casquinha chocolate mcdonalds mequi casquinha chocolate","p":3.4,"kcal":165,"carb":29,"gord":3.9,"fibra":0.4,"gUn":null,"qtd":1,"un":"casquinha","unp":"casquinhas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-cookies-de-baunilha","nome":"McDonald’s Cookies de baunilha","busca":"cookies de baunilha mcdonalds mequi cookies de baunilha","p":2.2,"kcal":205,"carb":30,"gord":8.6,"fibra":1.7,"gUn":null,"qtd":1,"un":"cookie","unp":"cookies","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-duplo-mcfish-deluxe","nome":"McDonald’s Duplo McFish Deluxe","busca":"duplo mcfish deluxe mcdonalds mequi duplo mcfish deluxe","p":26,"kcal":596,"carb":52,"gord":32,"fibra":3.5,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mccolosso-chocolate","nome":"McDonald’s McColosso Chocolate","busca":"mccolosso chocolate mcdonalds mequi mccolosso chocolate","p":4,"kcal":245,"carb":47,"gord":5,"fibra":0.5,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tasty-turbo-1-carne","nome":"McDonald’s Tasty Turbo 1 carne","busca":"tasty turbo 1 carne mcdonalds mequi tasty turbo 1 carne","p":36,"kcal":800,"carb":41,"gord":55,"fibra":3.9,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-top-sundae-caramelo","nome":"McDonald’s Top Sundae caramelo","busca":"top sundae caramelo mcdonalds mequi top sundae caramelo","p":7.1,"kcal":401,"carb":67,"gord":12,"fibra":1.3,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-chicken-duplo-bacon","nome":"Burger King Chicken Duplo Bacon","busca":"chicken duplo bacon burger king bk chicken duplo bacon","p":25,"kcal":675,"carb":49,"gord":43,"fibra":4,"gUn":222,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-king-jr-toy-story","nome":"Burger King King Jr - Toy Story","busca":"king jr - toy story burger king bk king jr toy story","p":15,"kcal":246,"carb":25,"gord":10,"fibra":3,"gUn":113,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-onion-rings-media","nome":"Burger King Onion Rings – média","busca":"onion rings – media burger king bk onion rings media","p":5,"kcal":319,"carb":36,"gord":17,"fibra":4,"gUn":91,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-pao-carne-e-queijo","nome":"Burger King Pão, Carne e Queijo","busca":"pao, carne e queijo burger king bk pao carne e queijo","p":16,"kcal":288,"carb":26,"gord":14,"fibra":3,"gUn":103,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-stacker-duplo-bacon","nome":"Burger King Stacker Duplo Bacon","busca":"stacker duplo bacon burger king bk stacker duplo bacon","p":49,"kcal":864,"carb":46,"gord":53,"fibra":1,"gUn":249,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-sundae-de-chocolate","nome":"Burger King Sundae de Chocolate","busca":"sundae de chocolate burger king bk sundae de chocolate","p":4,"kcal":336,"carb":49,"gord":14,"fibra":2,"gUn":163,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-whopper-de-plantas","nome":"Burger King WHOPPER® de Plantas","busca":"whopper® de plantas burger king bk whopper de plantas","p":28,"kcal":675,"carb":50,"gord":40,"fibra":10,"gUn":339,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-sorvete-velosa-gianduia","nome":"Habib’s Sorvete Velosa Gianduia","busca":"sorvete velosa gianduia habibs sorvete velosa gianduia","p":5.8,"kcal":276,"carb":29,"gord":16,"fibra":1.7,"gUn":60,"qtd":1,"un":"bola","unp":"bolas","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-velosa-maracuja","nome":"Habib’s Sorvete Velosa Maracujá","busca":"sorvete velosa maracuja habibs sorvete velosa maracuja","p":4.4,"kcal":216,"carb":30,"gord":8.7,"fibra":0,"gUn":60,"qtd":1,"un":"bola","unp":"bolas","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-velosa-pistache","nome":"Habib’s Sorvete Velosa Pistache","busca":"sorvete velosa pistache habibs sorvete velosa pistache","p":8.7,"kcal":253,"carb":26,"gord":13,"fibra":1.2,"gUn":60,"qtd":1,"un":"bola","unp":"bolas","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-caldofreddo-morango","nome":"McDonald’s Caldo&Freddo Morango","busca":"caldo&freddo morango mcdonalds mequi caldofreddo morango","p":5.4,"kcal":468,"carb":81,"gord":13,"fibra":1.8,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-cookies-de-chocolate","nome":"McDonald’s Cookies de chocolate","busca":"cookies de chocolate mcdonalds mequi cookies de chocolate","p":2.6,"kcal":199,"carb":28,"gord":8.5,"fibra":2.2,"gUn":null,"qtd":1,"un":"cookie","unp":"cookies","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-duplo-cheddar-mcmelt","nome":"McDonald’s Duplo Cheddar McMelt","busca":"duplo cheddar mcmelt mcdonalds mequi duplo cheddar mcmelt","p":52,"kcal":854,"carb":36,"gord":56,"fibra":4.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-quarterao-com-queijo","nome":"McDonald’s Quarterão com Queijo","busca":"quarterao com queijo mcdonalds mequi quarterao com queijo","p":32,"kcal":566,"carb":39,"gord":31,"fibra":2.8,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-quarterao-saja-vibes","nome":"McDonald’s Quarterão Saja Vibes","busca":"quarterao saja vibes mcdonalds mequi quarterao saja vibes","p":36,"kcal":666,"carb":40,"gord":40,"fibra":3.9,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tasty-turbo-2-carnes","nome":"McDonald’s Tasty Turbo 2 carnes","busca":"tasty turbo 2 carnes mcdonalds mequi tasty turbo 2 carnes","p":56,"kcal":1070,"carb":41,"gord":76,"fibra":4.4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tasty-turbo-3-carnes","nome":"McDonald’s Tasty Turbo 3 carnes","busca":"tasty turbo 3 carnes mcdonalds mequi tasty turbo 3 carnes","p":77,"kcal":1340,"carb":41,"gord":97,"fibra":4.8,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-top-sundae-chocolate","nome":"McDonald’s Top Sundae chocolate","busca":"top sundae chocolate mcdonalds mequi top sundae chocolate","p":10,"kcal":466,"carb":76,"gord":14,"fibra":0.9,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-batata-frita-media","nome":"Burger King Batata Frita – média","busca":"batata frita – media burger king bk batata frita media","p":4,"kcal":258,"carb":37,"gord":10,"fibra":4,"gUn":112,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-cheddar-duplo-crispy","nome":"Burger King Cheddar Duplo Crispy","busca":"cheddar duplo crispy burger king bk cheddar duplo crispy","p":14,"kcal":283,"carb":18,"gord":17,"fibra":1,"gUn":100,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-chicken-6-unidades","nome":"Burger King Chicken – 6 unidades","busca":"chicken – 6 unidades burger king bk bk chicken 6 unidades","p":14,"kcal":223,"carb":20,"gord":10,"fibra":1,"gUn":111,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-onion-rings-grande","nome":"Burger King Onion Rings – grande","busca":"onion rings – grande burger king bk onion rings grande","p":6,"kcal":313,"carb":55,"gord":7,"fibra":5,"gUn":130,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-casquinha-soft-chocolate","nome":"Habib’s Casquinha Soft Chocolate","busca":"casquinha soft chocolate habibs casquinha soft chocolate","p":2.1,"kcal":172,"carb":34,"gord":2.9,"fibra":0.9,"gUn":105,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-esfiha-folhada-de-m-m-s","nome":"Habib’s Esfiha Folhada de M&M’S®","busca":"esfiha folhada de m&ms® habibs esfiha folhada de m m s","p":6.3,"kcal":486,"carb":52,"gord":28,"fibra":2.5,"gUn":59,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-velosa-chocolate","nome":"Habib’s Sorvete Velosa Chocolate","busca":"sorvete velosa chocolate habibs sorvete velosa chocolate","p":4.7,"kcal":242,"carb":30,"gord":12,"fibra":1.9,"gUn":60,"qtd":1,"un":"bola","unp":"bolas","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-twist-chocolate-com-m-m","nome":"Habib’s Twist Chocolate com M&M®","busca":"twist chocolate com m&m® habibs twist chocolate com m m","p":1.5,"kcal":175,"carb":33,"gord":4.8,"fibra":0,"gUn":210,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-caldofreddo-caramelo","nome":"McDonald’s Caldo&Freddo Caramelo","busca":"caldo&freddo caramelo mcdonalds mequi caldofreddo caramelo","p":5.8,"kcal":488,"carb":83,"gord":15,"fibra":1.3,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-petit-suisse-do-mequi","nome":"McDonald’s Petit Suisse do Méqui","busca":"petit suisse do mequi mcdonalds mequi petit suisse do mequi","p":2.3,"kcal":40,"carb":4.7,"gord":1.3,"fibra":0,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-baldao-de-ovomaltine","nome":"Burger King Baldão de Ovomaltine®","busca":"baldao de ovomaltine® burger king bk baldao de ovomaltine","p":11,"kcal":1276,"carb":186,"gord":54,"fibra":5,"gUn":525,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-batata-frita-grande","nome":"Burger King Batata Frita – grande","busca":"batata frita – grande burger king bk batata frita grande","p":5,"kcal":327,"carb":47,"gord":12,"fibra":5,"gUn":142,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-brownie-de-brigadeiro","nome":"Burger King Brownie de Brigadeiro","busca":"brownie de brigadeiro burger king bk bk brownie de brigadeiro","p":3,"kcal":181,"carb":22,"gord":9,"fibra":1.5,"gUn":50,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-casquinha-de-baunilha","nome":"Burger King Casquinha de Baunilha","busca":"casquinha de baunilha burger king bk casquinha de baunilha","p":3,"kcal":223,"carb":38,"gord":7,"fibra":1,"gUn":127,"qtd":1,"un":"casquinha","unp":"casquinhas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-chicken-10-unidades","nome":"Burger King Chicken – 10 unidades","busca":"chicken – 10 unidades burger king bk bk chicken 10 unidades","p":23,"kcal":373,"carb":33,"gord":17,"fibra":2,"gUn":186,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-chicken-duplo-furioso","nome":"Burger King Chicken Duplo Furioso","busca":"chicken duplo furioso burger king bk chicken duplo furioso","p":23,"kcal":675,"carb":55,"gord":42,"fibra":4,"gUn":241,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-sorvete-velosa-nocciolina","nome":"Habib’s Sorvete Velosa Nocciolina","busca":"sorvete velosa nocciolina habibs sorvete velosa nocciolina","p":4.8,"kcal":228,"carb":28,"gord":11,"fibra":0,"gUn":60,"qtd":1,"un":"bola","unp":"bolas","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-twist-baunilha-com-baton","nome":"Habib’s Twist Baunilha com Baton®","busca":"twist baunilha com baton® habibs twist baunilha com baton","p":3.7,"kcal":208,"carb":30,"gord":8.1,"fibra":0,"gUn":216,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-brabo-brabissimo-carne","nome":"McDonald’s Brabo Brabissímo Carne","busca":"brabo brabissimo carne mcdonalds mequi brabo brabissimo carne","p":58,"kcal":1244,"carb":51,"gord":90,"fibra":4.4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-caldofreddo-chocolate","nome":"McDonald’s Caldo&Freddo Chocolate","busca":"caldo&freddo chocolate mcdonalds mequi caldofreddo chocolate","p":5.6,"kcal":483,"carb":77,"gord":17,"fibra":3.1,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-croissant-de-chocolate","nome":"McDonald’s Croissant de Chocolate","busca":"croissant de chocolate mcdonalds mequi croissant de chocolate","p":6.9,"kcal":407,"carb":42,"gord":23,"fibra":3,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-duplo-egg-cheese-bacon","nome":"McDonald’s Duplo Egg Cheese Bacon","busca":"duplo egg cheese bacon mcdonalds mequi duplo egg cheese bacon","p":25,"kcal":443,"carb":42,"gord":20,"fibra":1.7,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcflurry-mms-morango","nome":"McDonald’s McFlurry M&M's morango","busca":"mcflurry m&m's morango mcdonalds mequi mcflurry mms morango","p":5.9,"kcal":467,"carb":80,"gord":14,"fibra":2.2,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcfritas-cheddar-bacon","nome":"McDonald’s McFritas Cheddar Bacon","busca":"mcfritas cheddar bacon mcdonalds mequi mcfritas cheddar bacon","p":9,"kcal":431,"carb":38,"gord":26,"fibra":4.2,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcshake-creme-crocante","nome":"McDonald’s McShake Creme Crocante","busca":"mcshake creme crocante mcdonalds mequi mcshake creme crocante","p":11,"kcal":800,"carb":137,"gord":23,"fibra":2,"gUn":null,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-salada-mix-crispy-beef","nome":"McDonald’s Salada Mix Crispy Beef","busca":"salada mix crispy beef mcdonalds mequi salada mix crispy beef","p":28,"kcal":368,"carb":3,"gord":23,"fibra":3.4,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-batata-frita-pequena","nome":"Burger King Batata Frita – pequena","busca":"batata frita – pequena burger king bk batata frita pequena","p":3,"kcal":179,"carb":26,"gord":7,"fibra":3,"gUn":78,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-casquinha-com-nutella","nome":"Burger King Casquinha com Nutella®","busca":"casquinha com nutella® burger king bk casquinha com nutella","p":2,"kcal":156,"carb":23,"gord":6,"fibra":1,"gUn":41,"qtd":1,"un":"casquinha","unp":"casquinhas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-shake-de-doce-de-leite","nome":"Burger King Shake de Doce de Leite","busca":"shake de doce de leite burger king bk shake de doce de leite","p":8,"kcal":593,"carb":102,"gord":17,"fibra":1,"gUn":329,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-beirute-de-frango-crocante","nome":"Habib’s Beirute de Frango Crocante","busca":"beirute de frango crocante habibs beirute de frango crocante","p":7.4,"kcal":194,"carb":24,"gord":7.6,"fibra":1.3,"gUn":500,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-esfiha-folhada-de-banoffee","nome":"Habib’s Esfiha Folhada de Banoffee","busca":"esfiha folhada de banoffee habibs esfiha folhada de banoffee","p":4.7,"kcal":316,"carb":39,"gord":16,"fibra":1.6,"gUn":86,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-mccrispy-chicken-deluxe","nome":"McDonald’s McCrispy Chicken Deluxe","busca":"mccrispy chicken deluxe mcdonalds mequi mccrispy chicken deluxe","p":32,"kcal":593,"carb":53,"gord":28,"fibra":4.8,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mccrispy-chicken-legend","nome":"McDonald’s McCrispy Chicken Legend","busca":"mccrispy chicken legend mcdonalds mequi mccrispy chicken legend","p":37,"kcal":900,"carb":65,"gord":55,"fibra":4.3,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcflurry-creme-crocante","nome":"McDonald’s McFlurry Creme Crocante","busca":"mcflurry creme crocante mcdonalds mequi mcflurry creme crocante","p":8,"kcal":551,"carb":87,"gord":19,"fibra":1,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-batata-furiosa-grande","nome":"Burger King Batata Furiosa – grande","busca":"batata furiosa – grande burger king bk batata furiosa grande","p":21,"kcal":1042,"carb":133,"gord":45,"fibra":11,"gUn":408,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-batata-suprema-grande","nome":"Burger King Batata Suprema – grande","busca":"batata suprema – grande burger king bk batata suprema grande","p":23,"kcal":1059,"carb":124,"gord":50,"fibra":11,"gUn":410,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-mega-stacker-rodeio-2-0","nome":"Burger King Mega Stacker Rodeio 2.0","busca":"mega stacker rodeio 2.0 burger king bk mega stacker rodeio 2 0","p":59,"kcal":1259,"carb":76,"gord":78,"fibra":6,"gUn":417,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-mega-stacker-rodeio-3-0","nome":"Burger King Mega Stacker Rodeio 3.0","busca":"mega stacker rodeio 3.0 burger king bk mega stacker rodeio 3 0","p":83,"kcal":1619,"carb":78,"gord":106,"fibra":6,"gUn":528,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-shake-especial-crocante","nome":"Burger King Shake Especial Crocante","busca":"shake especial crocante burger king bk shake especial crocante","p":5,"kcal":514,"carb":90,"gord":15,"fibra":2,"gUn":295,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-sundae-de-doce-de-leite","nome":"Burger King Sundae de Doce de Leite","busca":"sundae de doce de leite burger king bk sundae de doce de leite","p":7,"kcal":378,"carb":58,"gord":13,"fibra":1,"gUn":180,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-whopper-barbecue-bacon","nome":"Burger King WHOPPER® Barbecue Bacon","busca":"whopper® barbecue bacon burger king bk whopper barbecue bacon","p":35,"kcal":767,"carb":49,"gord":47,"fibra":5,"gUn":335,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-beirute-tradicional-rosbife","nome":"Habib’s Beirute Tradicional Rosbife","busca":"beirute tradicional rosbife habibs beirute tradicional rosbife","p":7.4,"kcal":203,"carb":15,"gord":13,"fibra":0.7,"gUn":490,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-casquinha-creme-crocante","nome":"McDonald’s Casquinha Creme Crocante","busca":"casquinha creme crocante mcdonalds mequi casquinha creme crocante","p":4,"kcal":285,"carb":44,"gord":10,"fibra":1,"gUn":null,"qtd":1,"un":"casquinha","unp":"casquinhas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mccolosso-creme-crocante","nome":"McDonald’s McColosso Creme Crocante","busca":"mccolosso creme crocante mcdonalds mequi mccolosso creme crocante","p":5,"kcal":286,"carb":46,"gord":9,"fibra":1,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcflurry-mms-chocolate","nome":"McDonald’s McFlurry M&M's chocolate","busca":"mcflurry m&m's chocolate mcdonalds mequi mcflurry mms chocolate","p":6.2,"kcal":502,"carb":81,"gord":17,"fibra":3.6,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-mega-stacker-cheddar-2-0","nome":"Burger King Mega Stacker Cheddar 2.0","busca":"mega stacker cheddar 2.0 burger king bk mega stacker cheddar 2 0","p":51,"kcal":933,"carb":49,"gord":57,"fibra":4,"gUn":325,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-mega-stacker-cheddar-3-0","nome":"Burger King Mega Stacker Cheddar 3.0","busca":"mega stacker cheddar 3.0 burger king bk mega stacker cheddar 3 0","p":72,"kcal":1232,"carb":50,"gord":79,"fibra":4,"gUn":427,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-mix-brownie-com-nutella","nome":"Burger King Mix Brownie com Nutella®","busca":"mix brownie com nutella® burger king bk bk mix brownie com nutella","p":7,"kcal":498,"carb":71,"gord":22,"fibra":2,"gUn":206,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-batata-super-cheddar-e-bacon","nome":"Habib’s Batata Super Cheddar e Bacon","busca":"batata super cheddar e bacon habibs batata super cheddar e bacon","p":6.4,"kcal":249,"carb":21,"gord":16,"fibra":1.2,"gUn":130,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-velosa-cookies-spicy","nome":"Habib’s Sorvete Velosa Cookies Spicy","busca":"sorvete velosa cookies spicy habibs sorvete velosa cookies spicy","p":4.8,"kcal":234,"carb":27,"gord":12,"fibra":0,"gUn":60,"qtd":1,"un":"bola","unp":"bolas","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-velosa-doce-de-leite","nome":"Habib’s Sorvete Velosa Doce de Leite","busca":"sorvete velosa doce de leite habibs sorvete velosa doce de leite","p":4.5,"kcal":231,"carb":32,"gord":9.3,"fibra":0,"gUn":60,"qtd":1,"un":"bola","unp":"bolas","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-velosa-fior-di-latte","nome":"Habib’s Sorvete Velosa Fior Di Latte","busca":"sorvete velosa fior di latte habibs sorvete velosa fior di latte","p":4.6,"kcal":201,"carb":25,"gord":9.1,"fibra":0,"gUn":60,"qtd":1,"un":"bola","unp":"bolas","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-velosa-stracciatella","nome":"Habib’s Sorvete Velosa Stracciatella","busca":"sorvete velosa stracciatella habibs sorvete velosa stracciatella","p":4.8,"kcal":228,"carb":28,"gord":11,"fibra":0,"gUn":60,"qtd":1,"un":"bola","unp":"bolas","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-panini-com-queijo-e-bacon","nome":"McDonald’s Panini com queijo e bacon","busca":"panini com queijo e bacon mcdonalds mequi panini com queijo e bacon","p":7.8,"kcal":220,"carb":21,"gord":12,"fibra":0.6,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-pao-tipo-brioche-na-chapa","nome":"McDonald’s Pão tipo Brioche na Chapa","busca":"pao tipo brioche na chapa mcdonalds mequi pao tipo brioche na chapa","p":7.3,"kcal":280.5,"carb":38.6,"gord":10.8,"fibra":2.6,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-salada-mix-crispy-chicken","nome":"McDonald’s Salada Mix Crispy Chicken","busca":"salada mix crispy chicken mcdonalds mequi salada mix crispy chicken","p":30,"kcal":423,"carb":24,"gord":23,"fibra":4.5,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tasty-turbo-bacon-1-carne","nome":"McDonald’s Tasty Turbo Bacon 1 carne","busca":"tasty turbo bacon 1 carne mcdonalds mequi tasty turbo bacon 1 carne","p":43,"kcal":888,"carb":41,"gord":61,"fibra":4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-shake-proteico-morango","nome":"Burger King BK Shake Proteico Morango","busca":"bk shake proteico morango burger king bk bk shake proteico morango","p":20,"kcal":577,"carb":92,"gord":14,"fibra":2,"gUn":339,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tasty-turbo-bacon-2-carnes","nome":"McDonald’s Tasty Turbo Bacon 2 carnes","busca":"tasty turbo bacon 2 carnes mcdonalds mequi tasty turbo bacon 2 carnes","p":63,"kcal":1158,"carb":41,"gord":82,"fibra":4,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-tasty-turbo-bacon-3-carnes","nome":"McDonald’s Tasty Turbo Bacon 3 carnes","busca":"tasty turbo bacon 3 carnes mcdonalds mequi tasty turbo bacon 3 carnes","p":84,"kcal":1428,"carb":41,"gord":103,"fibra":5,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-shake-proteico-crocante","nome":"Burger King BK Shake Proteico Crocante","busca":"bk shake proteico crocante burger king bk bk shake proteico crocante","p":21,"kcal":582,"carb":89,"gord":16,"fibra":2,"gUn":312,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-casquinha-de-doce-de-leite","nome":"Burger King Casquinha de Doce de Leite","busca":"casquinha de doce de leite burger king bk casquinha de doce de leite","p":3,"kcal":226,"carb":41,"gord":5,"fibra":0,"gUn":127,"qtd":1,"un":"casquinha","unp":"casquinhas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-esfiha-folhada-feita-de-baton","nome":"Habib’s Esfiha Folhada Feita de Baton®","busca":"esfiha folhada feita de baton® habibs esfiha folhada feita de baton","p":6.3,"kcal":494,"carb":51,"gord":29,"fibra":1.9,"gUn":58,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sundae-cremosissimo-de-morango","nome":"Habib’s Sundae Cremosíssimo de Morango","busca":"sundae cremosissimo de morango habibs sundae cremosissimo de morango","p":4.5,"kcal":222,"carb":31,"gord":9,"fibra":0.7,"gUn":150,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-casquinha-recheada-caramelo","nome":"McDonald’s Casquinha recheada caramelo","busca":"casquinha recheada caramelo mcdonalds mequi casquinha recheada caramelo","p":3.5,"kcal":229.5,"carb":44.1,"gord":4.3,"fibra":0.5,"gUn":null,"qtd":1,"un":"casquinha","unp":"casquinhas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-folhado-com-queijo-e-tomate","nome":"McDonald’s Folhado com Queijo e Tomate","busca":"folhado com queijo e tomate mcdonalds mequi folhado com queijo e tomate","p":8,"kcal":416,"carb":36,"gord":26,"fibra":1.5,"gUn":null,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-batata-furiosa-individual","nome":"Burger King Batata Furiosa – individual","busca":"batata furiosa – individual burger king bk batata furiosa individual","p":11,"kcal":521,"carb":66,"gord":23,"fibra":6,"gUn":204,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-batata-suprema-individual","nome":"Burger King Batata Suprema – individual","busca":"batata suprema – individual burger king bk batata suprema individual","p":11,"kcal":530,"carb":62,"gord":25,"fibra":6,"gUn":205,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-shake-proteico-chocolate","nome":"Burger King BK Shake Proteico Chocolate","busca":"bk shake proteico chocolate burger king bk bk shake proteico chocolate","p":21,"kcal":616,"carb":90,"gord":19,"fibra":2,"gUn":325,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-casquinha-recheada-biscoff","nome":"Burger King Casquinha Recheada Biscoff®","busca":"casquinha recheada biscoff® burger king bk casquinha recheada biscoff","p":6,"kcal":365,"carb":64,"gord":10,"fibra":1,"gUn":174,"qtd":1,"un":"casquinha","unp":"casquinhas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-de-frango-com-cremely","nome":"Habib’s Bib’Sfiha de Frango com Cremely","busca":"bibsfiha de frango com cremely habibs bib sfiha de frango com cremely","p":6.4,"kcal":186,"carb":27,"gord":6.1,"fibra":1.1,"gUn":85,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-cascao-de-baunilha-com-nutella","nome":"Habib’s Cascão de Baunilha com Nutella®","busca":"cascao de baunilha com nutella® habibs cascao de baunilha com nutella","p":2.8,"kcal":217,"carb":37,"gord":6.2,"fibra":0.6,"gUn":125,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-cascao-de-baunilha-com-pistache","nome":"Habib’s Cascão de Baunilha com Pistache","busca":"cascao de baunilha com pistache habibs cascao de baunilha com pistache","p":2.9,"kcal":218,"carb":37,"gord":6.4,"fibra":0,"gUn":125,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-esfiha-folhada-de-doce-de-leite","nome":"Habib’s Esfiha Folhada de Doce de Leite","busca":"esfiha folhada de doce de leite habibs esfiha folhada de doce de leite","p":7.4,"kcal":400,"carb":53,"gord":18,"fibra":1.1,"gUn":50,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sundae-de-baunilha-com-nutella","nome":"Habib’s Sundae de Baunilha com Nutella®","busca":"sundae de baunilha com nutella® habibs sundae de baunilha com nutella","p":3.2,"kcal":211,"carb":31,"gord":8.1,"fibra":0.7,"gUn":125,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-casquinha-recheada-chocolate","nome":"McDonald’s Casquinha recheada chocolate","busca":"casquinha recheada chocolate mcdonalds mequi casquinha recheada chocolate","p":3.5,"kcal":226.5,"carb":42,"gord":5.2,"fibra":1.2,"gUn":null,"qtd":1,"un":"casquinha","unp":"casquinhas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-chicken-mcnuggets-4-unidades","nome":"McDonald’s Chicken McNuggets 4 unidades","busca":"chicken mcnuggets 4 unidades mcdonalds mequi chicken mcnuggets 4 unidades","p":9,"kcal":155,"carb":10,"gord":8.6,"fibra":0.77,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-chicken-mcnuggets-6-unidades","nome":"McDonald’s Chicken McNuggets 6 unidades","busca":"chicken mcnuggets 6 unidades mcdonalds mequi chicken mcnuggets 6 unidades","p":14,"kcal":232,"carb":16,"gord":13,"fibra":1.2,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mccolosso-recheado-chocolate","nome":"McDonald’s McColosso recheado chocolate","busca":"mccolosso recheado chocolate mcdonalds mequi mccolosso recheado chocolate","p":4.6,"kcal":313.6,"carb":59.2,"gord":7,"fibra":2.1,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-chicken-duplo-barbecue-bacon","nome":"Burger King Chicken Duplo Barbecue Bacon","busca":"chicken duplo barbecue bacon burger king bk chicken duplo barbecue bacon","p":25,"kcal":689,"carb":52,"gord":43,"fibra":4,"gUn":230,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-chicken-duplo-barbecue-bacon","nome":"Burger King Chicken Duplo Barbecue Bacon","busca":"chicken duplo barbecue bacon burger king bk chicken duplo barbecue bacon","p":28,"kcal":1589,"carb":52,"gord":142,"fibra":5,"gUn":382,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-mix-leite-em-po-com-nutella","nome":"Burger King Mix Leite em pó com Nutella®","busca":"mix leite em po com nutella® burger king bk bk mix leite em po com nutella","p":9,"kcal":499,"carb":64,"gord":23,"fibra":2,"gUn":198,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-de-carne-com-mussarela","nome":"Habib’s Bib’Sfiha de Carne com Mussarela","busca":"bibsfiha de carne com mussarela habibs bib sfiha de carne com mussarela","p":9,"kcal":217,"carb":27,"gord":8.3,"fibra":1.3,"gUn":85,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sundae-cremosissimo-de-chocolate","nome":"Habib’s Sundae Cremosíssimo de Chocolate","busca":"sundae cremosissimo de chocolate habibs sundae cremosissimo de chocolate","p":5.1,"kcal":240,"carb":32,"gord":10,"fibra":1.7,"gUn":60,"qtd":1,"un":"bola","unp":"bolas","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-chicken-mcnuggets-10-unidades","nome":"McDonald’s Chicken McNuggets 10 unidades","busca":"chicken mcnuggets 10 unidades mcdonalds mequi chicken mcnuggets 10 unidades","p":24,"kcal":387,"carb":26,"gord":21,"fibra":1.9,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-chicken-mcnuggets-15-unidades","nome":"McDonald’s Chicken McNuggets 15 unidades","busca":"chicken mcnuggets 15 unidades mcdonalds mequi chicken mcnuggets 15 unidades","p":34,"kcal":581,"carb":39,"gord":32,"fibra":2.9,"gUn":null,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-de-espinafre-com-cremely","nome":"Habib’s Bib’Sfiha de Espinafre com Cremely","busca":"bibsfiha de espinafre com cremely habibs bib sfiha de espinafre com cremely","p":5.6,"kcal":202,"carb":30,"gord":7,"fibra":1.9,"gUn":76,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-esfiha-folhada-de-chocolate-branco","nome":"Habib’s Esfiha Folhada de Chocolate Branco","busca":"esfiha folhada de chocolate branco habibs esfiha folhada de chocolate branco","p":7.5,"kcal":495,"carb":48,"gord":30,"fibra":1.1,"gUn":50,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-sundae-sabor-cereja-com-laranja","nome":"McDonald’s Sundae sabor cereja com laranja","busca":"sundae sabor cereja com laranja mcdonalds mequi sundae sabor cereja com laranja","p":6,"kcal":290,"carb":48,"gord":9,"fibra":0.9,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-bk-shake-proteico-doce-de-leite","nome":"Burger King BK Shake Proteico Doce de Leite","busca":"bk shake proteico doce de leite burger king bk bk shake proteico doce de leite","p":24,"kcal":677,"carb":104,"gord":18,"fibra":1,"gUn":350,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-de-calabresa-com-mussarela","nome":"Habib’s Bib’Sfiha de Calabresa com Mussarela","busca":"bibsfiha de calabresa com mussarela habibs bib sfiha de calabresa com mussarela","p":8.1,"kcal":251,"carb":31,"gord":11,"fibra":1.1,"gUn":70,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-mcflurry-ovomaltine-rocks-morango","nome":"McDonald’s McFlurry Ovomaltine Rocks morango","busca":"mcflurry ovomaltine rocks morango mcdonalds mequi mcflurry ovomaltine rocks morango","p":5.6,"kcal":453,"carb":86,"gord":9.8,"fibra":2.3,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mccolosso-sabor-cereja-com-laranja","nome":"McDonald’s McColosso sabor cereja com laranja","busca":"mccolosso sabor cereja com laranja mcdonalds mequi mccolosso sabor cereja com laranja","p":4,"kcal":220,"carb":43,"gord":4,"fibra":0.5,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-mcflurry-ovomaltine-rocks-chocolate","nome":"McDonald’s McFlurry Ovomaltine Rocks chocolate","busca":"mcflurry ovomaltine rocks chocolate mcdonalds mequi mcflurry ovomaltine rocks chocolate","p":5.2,"kcal":431,"carb":74,"gord":13,"fibra":3.4,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"mcd-top-sundae-sabor-cereja-com-laranja","nome":"McDonald’s Top Sundae sabor cereja com laranja","busca":"top sundae sabor cereja com laranja mcdonalds mequi top sundae sabor cereja com laranja","p":12,"kcal":530,"carb":84,"gord":16,"fibra":1.3,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"bk-casquinha-recheada-de-doce-de-leite","nome":"Burger King Casquinha Recheada de Doce de Leite","busca":"casquinha recheada de doce de leite burger king bk casquinha recheada de doce de leite","p":6,"kcal":364,"carb":66,"gord":8,"fibra":0,"gUn":173,"qtd":1,"un":"casquinha","unp":"casquinhas","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do Burger King Brasil, consultada em 21/09/2026"},
  {"id":"hab-sorvete-de-creme-cremosissimo-copinho-m","nome":"Habib’s Sorvete de Creme Cremosíssimo Copinho M","busca":"sorvete de creme cremosissimo copinho m habibs sorvete de creme cremosissimo copinho m","p":3.8,"kcal":204,"carb":24,"gord":10,"fibra":0,"gUn":160,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-de-creme-cremosissimo-copinho-p","nome":"Habib’s Sorvete de Creme Cremosíssimo Copinho P","busca":"sorvete de creme cremosissimo copinho p habibs sorvete de creme cremosissimo copinho p","p":3.8,"kcal":204,"carb":24,"gord":10,"fibra":0,"gUn":80,"qtd":1,"un":"porção","unp":"porções","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sundae-de-baunilha-com-calda-de-morango","nome":"Habib’s Sundae de Baunilha com Calda de Morango","busca":"sundae de baunilha com calda de morango habibs sundae de baunilha com calda de morango","p":3.2,"kcal":223,"carb":43,"gord":4.2,"fibra":0.7,"gUn":160,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sundae-de-pistache-com-calda-de-morango","nome":"Habib’s Sundae de Pistache com Calda de Morango","busca":"sundae de pistache com calda de morango habibs sundae de pistache com calda de morango","p":3.2,"kcal":226,"carb":44,"gord":4.2,"fibra":0.7,"gUn":160,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-casquinha-mista-de-baunilha-com-pistache","nome":"Habib’s Casquinha Mista de Baunilha com Pistache","busca":"casquinha mista de baunilha com pistache habibs casquinha mista de baunilha com pistache","p":2,"kcal":177,"carb":34,"gord":3.7,"fibra":0,"gUn":107,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-casquinha-recheada-morango-massa-mista","nome":"Habib’s Casquinha Recheada Morango (massa Mista)","busca":"casquinha recheada morango (massa mista) habibs casquinha recheada morango massa mista","p":3.3,"kcal":192,"carb":36,"gord":4,"fibra":0,"gUn":120,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sundae-de-baunilha-com-calda-de-caramelo","nome":"Habib’s Sundae de Baunilha com Calda de Caramelo","busca":"sundae de baunilha com calda de caramelo habibs sundae de baunilha com calda de caramelo","p":3.2,"kcal":223,"carb":43,"gord":4.3,"fibra":0.6,"gUn":160,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sundae-de-baunilha-com-calda-de-pistache","nome":"Habib’s Sundae de Baunilha com Calda de Pistache","busca":"sundae de baunilha com calda de pistache habibs sundae de baunilha com calda de pistache","p":3.3,"kcal":212,"carb":31,"gord":8.2,"fibra":0,"gUn":125,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sundae-de-pistache-com-calda-de-caramelo","nome":"Habib’s Sundae de Pistache com Calda de Caramelo","busca":"sundae de pistache com calda de caramelo habibs sundae de pistache com calda de caramelo","p":3.2,"kcal":224,"carb":44,"gord":4.2,"fibra":0.6,"gUn":160,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-casquinha-recheada-pistache-massa-mista","nome":"Habib’s Casquinha Recheada Pistache (massa Mista)","busca":"casquinha recheada pistache (massa mista) habibs casquinha recheada pistache massa mista","p":4.2,"kcal":226,"carb":34,"gord":8.2,"fibra":0.5,"gUn":120,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-de-creme-cremosissimo-casquinha-m","nome":"Habib’s Sorvete de Creme Cremosíssimo Casquinha M","busca":"sorvete de creme cremosissimo casquinha m habibs sorvete de creme cremosissimo casquinha m","p":4.1,"kcal":214,"carb":27,"gord":9.8,"fibra":0,"gUn":170,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-de-creme-cremosissimo-casquinha-p","nome":"Habib’s Sorvete de Creme Cremosíssimo Casquinha P","busca":"sorvete de creme cremosissimo casquinha p habibs sorvete de creme cremosissimo casquinha p","p":4.3,"kcal":223,"carb":30,"gord":9.4,"fibra":0,"gUn":90,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-de-morango-cremosissimo-copinho-m","nome":"Habib’s Sorvete de Morango Cremosíssimo Copinho M","busca":"sorvete de morango cremosissimo copinho m habibs sorvete de morango cremosissimo copinho m","p":3.9,"kcal":191,"carb":24,"gord":8.7,"fibra":0,"gUn":160,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-de-morango-cremosissimo-copinho-p","nome":"Habib’s Sorvete de Morango Cremosíssimo Copinho P","busca":"sorvete de morango cremosissimo copinho p habibs sorvete de morango cremosissimo copinho p","p":3.9,"kcal":191,"carb":24,"gord":8.7,"fibra":0,"gUn":80,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sundae-de-baunilha-com-calda-de-chocolate","nome":"Habib’s Sundae de Baunilha com Calda de Chocolate","busca":"sundae de baunilha com calda de chocolate habibs sundae de baunilha com calda de chocolate","p":3.3,"kcal":220,"carb":42,"gord":4.4,"fibra":0.7,"gUn":160,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sundae-de-pistache-com-calda-de-chocolate","nome":"Habib’s Sundae de Pistache com Calda de Chocolate","busca":"sundae de pistache com calda de chocolate habibs sundae de pistache com calda de chocolate","p":3.3,"kcal":223,"carb":43,"gord":4.4,"fibra":0.7,"gUn":160,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-casquinha-recheada-morango-massa-baunilha","nome":"Habib’s Casquinha Recheada Morango (massa Baunilha)","busca":"casquinha recheada morango (massa baunilha) habibs casquinha recheada morango massa baunilha","p":3.3,"kcal":189,"carb":35,"gord":4.1,"fibra":0,"gUn":120,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-casquinha-recheada-morango-massa-pistache","nome":"Habib’s Casquinha Recheada Morango (massa Pistache)","busca":"casquinha recheada morango (massa pistache) habibs casquinha recheada morango massa pistache","p":3.3,"kcal":195,"carb":36,"gord":4,"fibra":0,"gUn":120,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-de-chocolate-cremosissimo-copinho-m","nome":"Habib’s Sorvete de Chocolate Cremosíssimo Copinho M","busca":"sorvete de chocolate cremosissimo copinho m habibs sorvete de chocolate cremosissimo copinho m","p":4.5,"kcal":215,"carb":27,"gord":9.9,"fibra":1.7,"gUn":160,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-de-chocolate-cremosissimo-copinho-p","nome":"Habib’s Sorvete de Chocolate Cremosíssimo Copinho P","busca":"sorvete de chocolate cremosissimo copinho p habibs sorvete de chocolate cremosissimo copinho p","p":4.5,"kcal":215,"carb":27,"gord":9.9,"fibra":1.7,"gUn":80,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-de-morango-cremosissimo-casquinha-m","nome":"Habib’s Sorvete de Morango Cremosíssimo Casquinha M","busca":"sorvete de morango cremosissimo casquinha m habibs sorvete de morango cremosissimo casquinha m","p":4.1,"kcal":201,"carb":27,"gord":8.4,"fibra":0,"gUn":170,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-de-morango-cremosissimo-casquinha-p","nome":"Habib’s Sorvete de Morango Cremosíssimo Casquinha P","busca":"sorvete de morango cremosissimo casquinha p habibs sorvete de morango cremosissimo casquinha p","p":4.3,"kcal":211,"carb":30,"gord":8.2,"fibra":0,"gUn":90,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-casquinha-recheada-pistache-massa-baunilha","nome":"Habib’s Casquinha Recheada Pistache (massa Baunilha)","busca":"casquinha recheada pistache (massa baunilha) habibs casquinha recheada pistache massa baunilha","p":4.2,"kcal":223,"carb":33,"gord":8.2,"fibra":0.5,"gUn":120,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-casquinha-recheada-pistache-massa-pistache","nome":"Habib’s Casquinha Recheada Pistache (massa Pistache)","busca":"casquinha recheada pistache (massa pistache) habibs casquinha recheada pistache massa pistache","p":4.2,"kcal":229,"carb":35,"gord":8.2,"fibra":0.5,"gUn":120,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-mcflurry-trufa-lingua-de-gato-duo-morango","nome":"McDonald’s McFlurry Trufa Língua de Gato DUO morango","busca":"mcflurry trufa lingua de gato duo morango mcdonalds mequi mcflurry trufa lingua de gato duo morango","p":9,"kcal":654,"carb":93,"gord":28,"fibra":0.3,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"hab-casquinha-recheada-chocolate-massa-baunilha","nome":"Habib’s Casquinha Recheada Chocolate (massa Baunilha)","busca":"casquinha recheada chocolate (massa baunilha) habibs casquinha recheada chocolate massa baunilha","p":3.5,"kcal":186,"carb":33,"gord":5.1,"fibra":0,"gUn":120,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-casquinha-recheada-chocolate-massa-pistache","nome":"Habib’s Casquinha Recheada Chocolate (massa Pistache)","busca":"casquinha recheada chocolate (massa pistache) habibs casquinha recheada chocolate massa pistache","p":3.5,"kcal":192,"carb":35,"gord":5,"fibra":0,"gUn":120,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-de-chocolate-cremosissimo-casquinha-m","nome":"Habib’s Sorvete de Chocolate Cremosíssimo Casquinha M","busca":"sorvete de chocolate cremosissimo casquinha m habibs sorvete de chocolate cremosissimo casquinha m","p":4.7,"kcal":225,"carb":30,"gord":9.5,"fibra":1.7,"gUn":170,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sorvete-de-chocolate-cremosissimo-casquinha-p","nome":"Habib’s Sorvete de Chocolate Cremosíssimo Casquinha P","busca":"sorvete de chocolate cremosissimo casquinha p habibs sorvete de chocolate cremosissimo casquinha p","p":4.9,"kcal":233,"carb":33,"gord":9.2,"fibra":1.7,"gUn":90,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-mcflurry-trufa-lingua-de-gato-duo-chocolate","nome":"McDonald’s McFlurry Trufa Língua de Gato DUO chocolate","busca":"mcflurry trufa lingua de gato duo chocolate mcdonalds mequi mcflurry trufa lingua de gato duo chocolate","p":10,"kcal":678,"carb":93,"gord":31,"fibra":2,"gUn":null,"qtd":1,"un":"pote","unp":"potes","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-folhada-de-quatro-queijos-com-cremely","nome":"Habib’s Bib’Sfiha Folhada de Quatro Queijos com Cremely","busca":"bibsfiha folhada de quatro queijos com cremely habibs bib sfiha folhada de quatro queijos com cremely","p":11,"kcal":360,"carb":30,"gord":22,"fibra":1,"gUn":55,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-bib-sfiha-folhada-de-picanha-com-cheddar-e-bacon","nome":"Habib’s Bib’Sfiha Folhada de Picanha com Cheddar e Bacon","busca":"bibsfiha folhada de picanha com cheddar e bacon habibs bib sfiha folhada de picanha com cheddar e bacon","p":9.4,"kcal":307,"carb":26,"gord":18,"fibra":1.6,"gUn":67,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"mcd-mcshake-caramelo","nome":"McDonald’s McShake Caramelo com farofa crocante de amendoim","busca":"mcshake caramelo com farofa crocante de amendoim mcdonalds mequi mcshake caramelo","p":5.4,"kcal":437,"carb":79,"gord":9.2,"fibra":0.97,"gUn":null,"qtd":1,"un":"copo","unp":"copos","onde":"Lanches de rede","porUnidade":true,"fonte":"Tabela do McDonald’s Brasil, consultada em 21/09/2026"},
  {"id":"hab-sundae-misto-de-baunilha-e-pistache-com-calda-de","nome":"Habib’s Sundae Misto de Baunilha e Pistache com Calda de Morango","busca":"sundae misto de baunilha e pistache com calda de morango habibs sundae misto de baunilha e pistache com calda de","p":3.2,"kcal":224,"carb":43,"gord":4.2,"fibra":0.7,"gUn":160,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sundae-misto-de-baunilha-e-pistache-com-calda-de","nome":"Habib’s Sundae Misto de Baunilha e Pistache com Calda de Caramelo","busca":"sundae misto de baunilha e pistache com calda de caramelo habibs sundae misto de baunilha e pistache com calda de","p":3.2,"kcal":223,"carb":43,"gord":4.2,"fibra":0.6,"gUn":160,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
  {"id":"hab-sundae-misto-de-baunilha-e-pistache-com-calda-de","nome":"Habib’s Sundae Misto de Baunilha e Pistache com Calda de Chocolate","busca":"sundae misto de baunilha e pistache com calda de chocolate habibs sundae misto de baunilha e pistache com calda de","p":3.3,"kcal":222,"carb":42,"gord":4.4,"fibra":0.7,"gUn":160,"qtd":1,"un":"unidade","unp":"unidades","onde":"Lanches de rede","fonte":"Tabela do Habib’s, consultada em 21/09/2026"},
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
  ],
  "hab-sundae-de-pistache-com-calda-de-chocolate": [
    "leite"
  ],
  "hab-sundae-de-pistache-com-calda-de-morango": [
    "leite"
  ],
  "hab-sundae-soft-morango": [
    "leite"
  ],
  "hab-twist-baunilha-com-baton": [
    "leite"
  ],
  "hab-sundae-misto-de-baunilha-e-pistache-com-calda-de": [
    "leite"
  ],
  "hab-sundae-fast": [
    "leite"
  ],
  "hab-sundae-soft-chocolate": [
    "leite"
  ],
  "hab-twist-chocolate-com-m-m": [
    "leite"
  ],
  "hab-sorvete-velosa-creme": [
    "leite"
  ],
  "hab-sorvete-velosa-doce-de-leite": [
    "leite"
  ],
  "hab-sorvete-velosa-chocolate": [
    "leite"
  ],
  "hab-sorvete-velosa-coco": [
    "leite"
  ],
  "hab-sorvete-velosa-cookies-spicy": [
    "leite"
  ],
  "hab-sorvete-velosa-fior-di-latte": [
    "leite"
  ],
  "hab-sorvete-velosa-gianduia": [
    "leite"
  ],
  "hab-sorvete-velosa-maracuja": [
    "leite"
  ],
  "hab-sorvete-velosa-morango": [
    "leite"
  ],
  "hab-sorvete-velosa-nocciolina": [
    "leite"
  ],
  "hab-sorvete-velosa-pistache": [
    "leite"
  ],
  "hab-sorvete-velosa-stracciatella": [
    "leite"
  ],
  "hab-cascao-de-baunilha-com-nutella": [
    "leite"
  ],
  "hab-cascao-de-baunilha-com-pistache": [
    "leite"
  ],
  "hab-cascao-de-morango": [
    "leite"
  ],
  "hab-sorvete-de-chocolate-cremosissimo-casquinha-p": [
    "leite"
  ],
  "hab-sorvete-de-chocolate-cremosissimo-casquinha-m": [
    "leite"
  ],
  "hab-sorvete-de-chocolate-cremosissimo-copinho-p": [
    "leite"
  ],
  "hab-sorvete-de-chocolate-cremosissimo-copinho-m": [
    "leite"
  ],
  "hab-sorvete-de-creme-cremosissimo-casquinha-p": [
    "leite"
  ],
  "hab-sorvete-de-morango-cremosissimo-casquinha-m": [
    "leite"
  ],
  "hab-sorvete-de-morango-cremosissimo-copinho-p": [
    "leite"
  ],
  "hab-sorvete-de-creme-cremosissimo-casquinha-m": [
    "leite"
  ],
  "hab-sorvete-de-morango-cremosissimo-casquinha-p": [
    "leite"
  ],
  "hab-sorvete-de-creme-cremosissimo-copinho-m": [
    "leite"
  ],
  "hab-sorvete-de-creme-cremosissimo-copinho-p": [
    "leite"
  ],
  "hab-sorvete-de-morango-cremosissimo-copinho-m": [
    "leite"
  ],
  "hab-sundae-cremosissimo-de-chocolate": [
    "leite"
  ],
  "hab-sundae-de-baunilha-com-nutella": [
    "leite"
  ],
  "hab-sundae-de-pistache-com-calda-de-caramelo": [
    "leite"
  ],
  "hab-sundae-cremosissimo-de-morango": [
    "leite"
  ],
  "hab-sundae-de-baunilha-com-calda-de-caramelo": [
    "leite"
  ],
  "hab-sundae-de-baunilha-com-calda-de-morango": [
    "leite"
  ],
  "hab-sundae-de-baunilha-com-calda-de-pistache": [
    "leite"
  ],
  "hab-sundae-de-baunilha-com-calda-de-chocolate": [
    "leite"
  ],
  "hab-esfiha-folhada-de-banoffee": [
    "leite"
  ],
  "hab-esfiha-folhada-de-chocolate-branco": [
    "leite"
  ],
  "hab-esfiha-folhada-de-m-m-s": [
    "leite"
  ],
  "hab-esfiha-folhada-feita-de-baton": [
    "leite"
  ],
  "hab-esfiha-folhada-de-doce-de-leite": [
    "leite"
  ],
  "hab-casquinha-soft-chocolate": [
    "leite"
  ],
  "hab-casquinha-mista-de-baunilha-com-pistache": [
    "leite"
  ],
  "hab-casquinha-recheada-chocolate-massa-baunilha": [
    "leite"
  ],
  "hab-casquinha-recheada-chocolate-massa-pistache": [
    "leite"
  ],
  "hab-casquinha-recheada-morango-massa-baunilha": [
    "leite"
  ],
  "hab-casquinha-recheada-morango-massa-pistache": [
    "leite"
  ],
  "hab-casquinha-recheada-morango-massa-mista": [
    "leite"
  ],
  "hab-casquinha-recheada-pistache-massa-baunilha": [
    "leite"
  ],
  "hab-casquinha-recheada-pistache-massa-pistache": [
    "leite"
  ],
  "hab-casquinha-recheada-pistache-massa-mista": [
    "leite"
  ],
  "hab-cascao-de-chocolate": [
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
  "bk-shake-de-morango": [
    "leite"
  ],
  "bk-whopper-duplo": [
    "carne"
  ],
  "bk-shake-de-doce-de-leite": [
    "leite"
  ],
  "bk-whopper-furioso": [
    "carne"
  ],
  "bk-shake-especial-crocante": [
    "leite"
  ],
  "bk-whopper-jr": [
    "carne"
  ],
  "bk-shake-de-chocolate": [
    "leite"
  ],
  "bk-whopper-barbecue-bacon": [
    "carne"
  ],
  "bk-whopper-rodeio": [
    "carne"
  ],
  "bk-baldao-de-ovomaltine": [
    "leite"
  ],
  "bk-baldao-de-brownie": [
    "leite"
  ],
  "bk-pao-carne-e-queijo": [
    "carne",
    "leite"
  ],
  "bk-casquinha-de-doce-de-leite": [
    "leite"
  ],
  "bk-cheeseburger": [
    "carne",
    "leite"
  ],
  "bk-casquinha-de-baunilha": [
    "leite"
  ],
  "bk-stacker-duplo-bacon": [
    "carne"
  ],
  "bk-casquinha-mista": [
    "leite"
  ],
  "bk-big-king": [
    "carne"
  ],
  "bk-casquinha-recheada-de-doce-de-leite": [
    "leite"
  ],
  "bk-mega-stacker-2-0": [
    "carne"
  ],
  "bk-sundae-de-chocolate": [
    "leite"
  ],
  "bk-mega-stacker-3-0": [
    "carne"
  ],
  "bk-sundae-de-morango": [
    "leite"
  ],
  "bk-mega-stacker-cheddar-2-0": [
    "carne",
    "leite"
  ],
  "bk-sundae-de-doce-de-leite": [
    "leite"
  ],
  "bk-mega-stacker-cheddar-3-0": [
    "carne",
    "leite"
  ],
  "bk-mix-de-ovomaltine": [
    "leite"
  ],
  "bk-mega-stacker-rodeio-2-0": [
    "carne"
  ],
  "bk-mix-de-brownie": [
    "leite"
  ],
  "bk-mega-stacker-rodeio-3-0": [
    "carne"
  ],
  "bk-bk-brownie-de-brigadeiro": [
    "leite"
  ],
  "bk-rodeio": [
    "carne"
  ],
  "bk-bk-mix-com-nutella": [
    "leite"
  ],
  "bk-rodeio-duplo": [
    "carne"
  ],
  "bk-bk-mix-leite-em-po-com-nutella": [
    "leite"
  ],
  "bk-cheeseburger-duplo": [
    "carne",
    "leite"
  ],
  "bk-bk-mix-brownie-com-nutella": [
    "leite"
  ],
  "bk-cheddar-duplo-crispy": [
    "carne",
    "leite"
  ],
  "bk-shake-com-nutella": [
    "leite"
  ],
  "bk-casquinha-com-nutella": [
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
  "bk-chicken-duplo-barbecue-bacon": [
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
  "bk-bk-shake-proteico-chocolate": [
    "leite"
  ],
  "bk-bk-shake-proteico-crocante": [
    "leite"
  ],
  "bk-bk-shake-proteico-morango": [
    "leite"
  ],
  "bk-bk-shake-proteico-doce-de-leite": [
    "leite"
  ],
  "bk-casquinha-recheada-biscoff": [
    "leite"
  ],
  "bk-bk-shake-biscoff": [
    "leite"
  ],
  "bk-bk-baldao-biscoff": [
    "leite"
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
