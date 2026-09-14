/* ============================================================
   OS ALIMENTOS — de onde saem os gramas

   ARQUIVO GERADO por scripts/gerar-alimentos.mjs, que é onde mora a
   curadoria. Para mexer na lista, mexa lá e rode de novo:

     node scripts/gerar-alimentos.mjs src/logic/alimentos.ts

   Proteína por 100 g, como se come. Os valores vêm da TACO — Tabela
   Brasileira de Composição de Alimentos, 4ª edição, NEPA/UNICAMP — e o
   campo `taco` guarda a linha exata de onde cada um saiu, para que o
   número tenha procedência e não opinião. As poucas entradas sem `taco`
   trazem `fonte` dizendo de onde vieram: a TACO não analisou o leite
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
   componentes na TACO com a receita escrita em `fonte`: quem almoçou
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
  /** Linha da TACO de onde `p` saiu. */
  taco?: number;
  /** Quando não é da TACO, de onde é. */
  fonte?: string;
};

export const ALIMENTOS: Alimento[] = [
  { id: 'peito-frango', nome: 'Peito de frango grelhado', busca: 'frango peito file grelhado file de frango', p: 32, gUn: 120, qtd: 1, un: 'filé', unp: 'filés', taco: 410 }, /* Frango, peito, sem pele, grelhado */
  { id: 'frango-assado', nome: 'Frango assado sem pele', busca: 'frango assado cozido', p: 28, gUn: 120, qtd: 1, un: 'pedaço', unp: 'pedaços', taco: 403 }, /* Frango, inteiro, sem pele, assado */
  { id: 'sobrecoxa', nome: 'Coxa ou sobrecoxa de frango', busca: 'coxa sobrecoxa frango', p: 29.2, gUn: 100, qtd: 1, un: 'unidade', unp: 'unidades', taco: 413 }, /* Frango, sobrecoxa, sem pele, assada */
  { id: 'frango-milanesa', nome: 'Frango à milanesa', busca: 'frango milanesa empanado nuggets', p: 28.5, gUn: 120, qtd: 1, un: 'filé', unp: 'filés', taco: 401 }, /* Frango, filé, à milanesa */
  { id: 'patinho', nome: 'Bife de patinho grelhado', busca: 'bife patinho carne vermelha grelhado', p: 35.9, gUn: 100, qtd: 1, un: 'bife', unp: 'bifes', taco: 377 }, /* Carne, bovina, patinho, sem gordura, grelhado */
  { id: 'contrafile', nome: 'Contra-filé grelhado', busca: 'contra file bife carne', p: 32.4, gUn: 100, qtd: 1, un: 'bife', unp: 'bifes', taco: 344 }, /* Carne, bovina, contra-filé, com gordura, grelhado */
  { id: 'file-mignon', nome: 'Filé mignon grelhado', busca: 'file mignon carne', p: 32.8, gUn: 100, qtd: 1, un: 'medalhão', unp: 'medalhões', taco: 358 }, /* Carne, bovina, filé mingnon, sem gordura, grelhado */
  { id: 'picanha', nome: 'Picanha grelhada', busca: 'picanha churrasco carne', p: 31.9, gUn: 50, qtd: 2, un: 'fatia', unp: 'fatias', taco: 383 }, /* Carne, bovina, picanha, sem gordura, grelhada */
  { id: 'carne-moida', nome: 'Carne moída refogada', busca: 'carne moida bolonhesa moido', p: 26.7, gUn: 25, qtd: 4, un: 'colher', unp: 'colheres', taco: 326 }, /* Carne, bovina, acém, moído, cozido */
  { id: 'carne-panela', nome: 'Carne de panela', busca: 'carne panela cozida ensopado paleta', p: 29.7, gUn: 100, qtd: 1, un: 'porção', unp: 'porções', taco: 374 }, /* Carne, bovina, paleta, sem gordura, cozida */
  { id: 'musculo', nome: 'Músculo cozido', busca: 'musculo cozido sopa', p: 31.2, gUn: 100, qtd: 1, un: 'porção', unp: 'porções', taco: 371 }, /* Carne, bovina, músculo, sem gordura, cozido */
  { id: 'hamburguer', nome: 'Hambúrguer', busca: 'hamburguer burguer lanche', p: 20, gUn: 80, qtd: 1, un: 'unidade', unp: 'unidades', taco: 416 }, /* Hambúrguer, bovino, frito */
  { id: 'linguica', nome: 'Linguiça', busca: 'linguica calabresa churrasco', p: 18.2, gUn: 80, qtd: 1, un: 'gomo', unp: 'gomos', taco: 420 }, /* Lingüiça, frango, grelhada */
  { id: 'lombo', nome: 'Lombo de porco assado', busca: 'lombo porco suino', p: 35.7, gUn: 100, qtd: 1, un: 'fatia', unp: 'fatias', taco: 432 }, /* Porco, lombo, assado */
  { id: 'pernil', nome: 'Pernil assado', busca: 'pernil porco suino', p: 32.1, gUn: 100, qtd: 1, un: 'fatia', unp: 'fatias', taco: 435 }, /* Porco, pernil, assado */
  { id: 'costelinha', nome: 'Costelinha de porco', busca: 'costela costelinha porco', p: 30.2, gUn: 60, qtd: 2, un: 'costela', unp: 'costelas', taco: 430 }, /* Porco, costela, assada */
  { id: 'coxao-mole', nome: 'Carne cozida (coxão mole)', busca: 'coxao mole carne cozida panela', p: 32.4, gUn: 100, qtd: 1, un: 'porção', unp: 'porções', taco: 351 }, /* Carne, bovina, coxão mole, sem gordura, cozido */
  { id: 'almondega', nome: 'Almôndegas', busca: 'almondega bolinho de carne', p: 18.2, gUn: 33, qtd: 3, un: 'unidade', unp: 'unidades', taco: 331 }, /* Carne, bovina, almôndegas, fritas */
  { id: 'figado', nome: 'Fígado acebolado', busca: 'figado bife acebolado', p: 29.9, gUn: 100, qtd: 1, un: 'bife', unp: 'bifes', taco: 356 }, /* Carne, bovina, fígado, grelhado */
  { id: 'peru', nome: 'Peru assado', busca: 'peru chester ave natal', p: 26.2, gUn: 100, qtd: 1, un: 'fatia', unp: 'fatias', taco: 425 }, /* Peru, congelado, assado */
  { id: 'quibe', nome: 'Quibe assado', busca: 'quibe kibe', p: 14.6, gUn: 80, qtd: 1, un: 'pedaço', unp: 'pedaços', taco: 440 }, /* Quibe, assado */
  { id: 'presunto', nome: 'Presunto', busca: 'presunto frios peito de peru', p: 14.3, gUn: 15, qtd: 2, un: 'fatia', unp: 'fatias', taco: 439 }, /* Presunto, sem capa de gordura */
  { id: 'mortadela', nome: 'Mortadela', busca: 'mortadela frios', p: 12, gUn: 15, qtd: 2, un: 'fatia', unp: 'fatias', taco: 424 }, /* Mortadela */
  { id: 'salmao', nome: 'Salmão grelhado', busca: 'salmao peixe', p: 23.9, gUn: 120, qtd: 1, un: 'posta', unp: 'postas', taco: 315 }, /* Salmão, filé, com pele, fresco,  grelhado */
  { id: 'merluza', nome: 'Merluza assada', busca: 'merluza peixe branco assado file', p: 26.6, gUn: 120, qtd: 1, un: 'filé', unp: 'filés', taco: 301 }, /* Merluza, filé, assado */
  { id: 'pescada', nome: 'Pescada frita', busca: 'pescada peixe frito tilapia', p: 28.6, gUn: 120, qtd: 1, un: 'filé', unp: 'filés', taco: 308 }, /* Pescada, filé, frito */
  { id: 'sardinha', nome: 'Sardinha assada', busca: 'sardinha peixe assada', p: 32.2, gUn: 50, qtd: 2, un: 'unidade', unp: 'unidades', taco: 318 }, /* Sardinha, assada */
  { id: 'sardinha-lata', nome: 'Sardinha em lata', busca: 'sardinha lata conserva', p: 15.9, gUn: 160, qtd: 1, un: 'lata', unp: 'latas', taco: 319 }, /* Sardinha, conserva em óleo */
  { id: 'atum-lata', nome: 'Atum em lata', busca: 'atum lata conserva', p: 26.2, gUn: 160, qtd: 1, un: 'lata', unp: 'latas', taco: 277 }, /* Atum, conserva em óleo */
  { id: 'bacalhau', nome: 'Bacalhau refogado', busca: 'bacalhau', p: 24, gUn: 120, qtd: 1, un: 'porção', unp: 'porções', taco: 280 }, /* Bacalhau, salgado, refogado */
  { id: 'corvina', nome: 'Corvina assada', busca: 'corvina peixe assado', p: 26.8, gUn: 120, qtd: 1, un: 'posta', unp: 'postas', taco: 293 }, /* Corvina grande, assada */
  { id: 'manjuba', nome: 'Manjuba frita', busca: 'manjuba peixinho frito', p: 30.1, gUn: 80, qtd: 1, un: 'porção', unp: 'porções', taco: 300 }, /* Manjuba, frita */
  { id: 'camarao', nome: 'Camarão cozido', busca: 'camarao frutos do mar', p: 19, gUn: 100, qtd: 1, un: 'porção', unp: 'porções', taco: 284 }, /* Camarão, Rio Grande, grande, cozido */
  { id: 'ovo-cozido', nome: 'Ovo cozido', busca: 'ovo ovos cozido pochê', p: 13.3, gUn: 50, qtd: 2, un: 'unidade', unp: 'unidades', taco: 488 }, /* Ovo, de galinha, inteiro, cozido/10minutos */
  { id: 'ovo-frito', nome: 'Ovo frito ou mexido', busca: 'ovo ovos frito mexido mexidos', p: 15.6, gUn: 50, qtd: 2, un: 'unidade', unp: 'unidades', taco: 490 }, /* Ovo, de galinha, inteiro, frito */
  { id: 'omelete', nome: 'Omelete de queijo', busca: 'omelete omelette', p: 15.6, gUn: 120, qtd: 1, un: 'unidade', unp: 'unidades', taco: 484 }, /* Omelete, de queijo */
  { id: 'iogurte', nome: 'Iogurte natural', busca: 'iogurte natural grego', p: 4.1, gUn: 170, qtd: 1, un: 'pote', unp: 'potes', taco: 448 }, /* Iogurte, natural */
  { id: 'iogurte-fruta', nome: 'Iogurte de fruta', busca: 'iogurte morango sabor fruta', p: 2.7, gUn: 150, qtd: 1, un: 'pote', unp: 'potes', taco: 451 }, /* Iogurte, sabor morango */
  { id: 'queijo-minas', nome: 'Queijo minas frescal', busca: 'queijo minas branco frescal', p: 17.4, gUn: 50, qtd: 1, un: 'fatia', unp: 'fatias', taco: 461 }, /* Queijo, minas, frescal */
  { id: 'mussarela', nome: 'Mussarela', busca: 'mussarela muçarela queijo', p: 22.6, gUn: 15, qtd: 2, un: 'fatia', unp: 'fatias', taco: 463 }, /* Queijo, mozarela */
  { id: 'queijo-prato', nome: 'Queijo prato', busca: 'queijo prato', p: 22.7, gUn: 15, qtd: 2, un: 'fatia', unp: 'fatias', taco: 467 }, /* Queijo, prato */
  { id: 'parmesao', nome: 'Parmesão ralado', busca: 'parmesao queijo ralado', p: 35.6, gUn: 15, qtd: 1, un: 'colher', unp: 'colheres', taco: 464 }, /* Queijo, parmesão */
  { id: 'ricota', nome: 'Ricota', busca: 'ricota queijo', p: 12.6, gUn: 50, qtd: 1, un: 'fatia', unp: 'fatias', taco: 469 }, /* Queijo, ricota */
  { id: 'requeijao', nome: 'Requeijão', busca: 'requeijao cream cheese', p: 9.4, gUn: 30, qtd: 1, un: 'colher', unp: 'colheres', taco: 465 }, /* Queijo, pasteurizado */
  { id: 'leite', nome: 'Leite', busca: 'leite copo integral desnatado', p: 3.2, gUn: 200, qtd: 1, un: 'copo', unp: 'copos', fonte: 'TBCA' }, /* TBCA */
  { id: 'achocolatado', nome: 'Leite com achocolatado', busca: 'achocolatado nescau toddy leite', p: 2.1, gUn: 200, qtd: 1, un: 'copo', unp: 'copos', taco: 455 }, /* Leite, de vaca, achocolatado */
  { id: 'whey', nome: 'Whey protein', busca: 'whey proteina suplemento shake', p: 80, gUn: 30, qtd: 1, un: 'scoop', unp: 'scoops', fonte: 'rótulo' }, /* rótulo */
  { id: 'feijao-carioca', nome: 'Feijão carioca', busca: 'feijao carioca caldo', p: 4.8, gUn: 80, qtd: 1, un: 'concha', unp: 'conchas', taco: 561 }, /* Feijão, carioca, cozido */
  { id: 'feijao-preto', nome: 'Feijão preto', busca: 'feijao preto', p: 4.5, gUn: 80, qtd: 1, un: 'concha', unp: 'conchas', taco: 567 }, /* Feijão, preto, cozido */
  { id: 'lentilha', nome: 'Lentilha cozida', busca: 'lentilha', p: 6.3, gUn: 80, qtd: 1, un: 'concha', unp: 'conchas', taco: 577 }, /* Lentilha, cozida */
  { id: 'grao-de-bico', nome: 'Grão-de-bico cozido', busca: 'grao de bico homus', p: 8.8, gUn: 80, qtd: 1, un: 'concha', unp: 'conchas', fonte: 'TACO 575 ÷ 2,4 de rendimento' }, /* TACO 575 ÷ 2,4 de rendimento */
  { id: 'tofu', nome: 'Tofu', busca: 'tofu soja queijo de soja', p: 6.6, gUn: 100, qtd: 1, un: 'fatia', unp: 'fatias', taco: 584 }, /* Soja, queijo (tofu) */
  { id: 'feijao-tropeiro', nome: 'Feijão tropeiro', busca: 'tropeiro feijao mineiro', p: 10.2, gUn: 120, qtd: 1, un: 'porção', unp: 'porções', taco: 539 }, /* Feijão tropeiro mineiro */
  { id: 'ervilha', nome: 'Ervilha', busca: 'ervilha', p: 7.5, gUn: 20, qtd: 3, un: 'colher', unp: 'colheres', taco: 559 }, /* Ervilha, em vagem */
  { id: 'arroz', nome: 'Arroz branco', busca: 'arroz branco', p: 2.5, gUn: 30, qtd: 4, un: 'colher', unp: 'colheres', taco: 3 }, /* Arroz, tipo 1, cozido */
  { id: 'arroz-integral', nome: 'Arroz integral', busca: 'arroz integral', p: 2.6, gUn: 30, qtd: 4, un: 'colher', unp: 'colheres', taco: 1 }, /* Arroz, integral, cozido */
  { id: 'macarrao', nome: 'Macarrão cozido', busca: 'macarrao massa espaguete penne', p: 4.5, gUn: 150, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'TACO 40 ÷ 2,2 de rendimento' }, /* TACO 40 ÷ 2,2 de rendimento */
  { id: 'macarrao-bolonhesa', nome: 'Macarrão à bolonhesa', busca: 'macarrao bolonhesa molho carne', p: 4.9, gUn: 200, qtd: 1, un: 'prato', unp: 'pratos', taco: 542 }, /* Macarrão, molho bolognesa */
  { id: 'pao-frances', nome: 'Pão francês', busca: 'pao frances padaria', p: 8, gUn: 50, qtd: 1, un: 'unidade', unp: 'unidades', taco: 53 }, /* Pão, trigo, francês */
  { id: 'pao-integral', nome: 'Pão integral de forma', busca: 'pao forma integral', p: 9.4, gUn: 25, qtd: 2, un: 'fatia', unp: 'fatias', taco: 52 }, /* Pão, trigo, forma, integral */
  { id: 'aveia', nome: 'Aveia em flocos', busca: 'aveia flocos mingau', p: 13.9, gUn: 15, qtd: 2, un: 'colher', unp: 'colheres', taco: 7 }, /* Aveia, flocos, crua */
  { id: 'tapioca', nome: 'Tapioca', busca: 'tapioca goma', p: 0.1, gUn: 90, qtd: 1, un: 'unidade', unp: 'unidades', taco: 551 }, /* Tapioca, com manteiga */
  { id: 'cuscuz', nome: 'Cuscuz de milho', busca: 'cuscuz milho', p: 2.2, gUn: 120, qtd: 1, un: 'pedaço', unp: 'pedaços', taco: 533 }, /* Cuscuz, de milho, cozido com sal */
  { id: 'pao-de-queijo', nome: 'Pão de queijo', busca: 'pao de queijo', p: 5.1, gUn: 20, qtd: 3, un: 'unidade', unp: 'unidades', taco: 140 }, /* Pão, de queijo, assado */
  { id: 'cereal', nome: 'Cereal matinal', busca: 'cereal matinal granola sucrilhos', p: 7.2, gUn: 30, qtd: 1, un: 'xícara', unp: 'xícaras', taco: 25 }, /* Cereal matinal, milho */
  { id: 'arroz-carreteiro', nome: 'Arroz carreteiro', busca: 'carreteiro arroz com carne', p: 10.8, gUn: 200, qtd: 1, un: 'prato', unp: 'pratos', taco: 526 }, /* Arroz carreteiro */
  { id: 'baiao', nome: 'Baião de dois', busca: 'baiao de dois', p: 6.2, gUn: 200, qtd: 1, un: 'prato', unp: 'pratos', taco: 527 }, /* Baião de dois, arroz e feijão-de-corda */
  { id: 'pao-sovado', nome: 'Pão doce ou sovado', busca: 'pao sovado doce bisnaguinha', p: 8.4, gUn: 50, qtd: 1, un: 'unidade', unp: 'unidades', taco: 54 }, /* Pão, trigo, sovado */
  { id: 'pao-aveia', nome: 'Pão de aveia', busca: 'pao aveia forma', p: 12.3, gUn: 25, qtd: 2, un: 'fatia', unp: 'fatias', taco: 48 }, /* Pão, aveia, forma */
  { id: 'cuscuz-paulista', nome: 'Cuscuz paulista', busca: 'cuscuz paulista', p: 2.6, gUn: 150, qtd: 1, un: 'pedaço', unp: 'pedaços', taco: 534 }, /* Cuscuz, paulista */
  { id: 'estrogonofe', nome: 'Estrogonofe de frango', busca: 'estrogonofe strogonoff frango', p: 17.6, gUn: 150, qtd: 1, un: 'porção', unp: 'porções', taco: 538 }, /* Estrogonofe de frango */
  { id: 'bife-a-cavalo', nome: 'Bife à cavalo', busca: 'bife a cavalo', p: 23.7, gUn: 150, qtd: 1, un: 'porção', unp: 'porções', taco: 529 }, /* Bife à cavalo, com contra filé */
  { id: 'coxinha', nome: 'Coxinha', busca: 'coxinha salgado', p: 9.6, gUn: 80, qtd: 1, un: 'unidade', unp: 'unidades', taco: 386 }, /* Coxinha de frango, frita */
  { id: 'legumes', nome: 'Legumes cozidos', busca: 'legumes cozidos vapor mistura', p: 2, gUn: 100, qtd: 1, un: 'pires', unp: 'pires', taco: 546 }, /* Salada, de legumes, cozida no vapor */
  { id: 'feijoada', nome: 'Feijoada', busca: 'feijoada', p: 8.7, gUn: 250, qtd: 1, un: 'prato', unp: 'pratos', taco: 540 }, /* Feijoada */
  { id: 'virado', nome: 'Virado à paulista', busca: 'virado paulista', p: 10.2, gUn: 250, qtd: 1, un: 'prato', unp: 'pratos', taco: 555 }, /* Virado à paulista */
  { id: 'estrogonofe-carne', nome: 'Estrogonofe de carne', busca: 'estrogonofe strogonoff carne', p: 15, gUn: 150, qtd: 1, un: 'porção', unp: 'porções', taco: 537 }, /* Estrogonofe de carne */
  { id: 'yakisoba', nome: 'Yakisoba', busca: 'yakisoba macarrao oriental', p: 7.5, gUn: 250, qtd: 1, un: 'prato', unp: 'pratos', taco: 556 }, /* Yakisoba */
  { id: 'salpicao', nome: 'Salpicão de frango', busca: 'salpicao', p: 13.9, gUn: 120, qtd: 1, un: 'porção', unp: 'porções', taco: 547 }, /* Salpicão, de frango */
  { id: 'dobradinha', nome: 'Dobradinha', busca: 'dobradinha bucho', p: 19.8, gUn: 200, qtd: 1, un: 'prato', unp: 'pratos', taco: 536 }, /* Dobradinha */
  { id: 'vaca-atolada', nome: 'Vaca atolada', busca: 'vaca atolada costela mandioca', p: 5.1, gUn: 250, qtd: 1, un: 'prato', unp: 'pratos', taco: 553 }, /* Vaca atolada */
  { id: 'vatapa', nome: 'Vatapá', busca: 'vatapa', p: 6, gUn: 150, qtd: 1, un: 'porção', unp: 'porções', taco: 554 }, /* Vatapá */
  { id: 'acaraje', nome: 'Acarajé', busca: 'acaraje', p: 8.3, gUn: 100, qtd: 1, un: 'unidade', unp: 'unidades', taco: 525 }, /* Acarajé */
  { id: 'manicoba', nome: 'Maniçoba', busca: 'manicoba', p: 10, gUn: 200, qtd: 1, un: 'prato', unp: 'pratos', taco: 543 }, /* Maniçoba */
  { id: 'barreado', nome: 'Barreado', busca: 'barreado', p: 18.3, gUn: 200, qtd: 1, un: 'prato', unp: 'pratos', taco: 528 }, /* Barreado */
  { id: 'charuto', nome: 'Charuto de repolho', busca: 'charuto repolho', p: 6.8, gUn: 75, qtd: 2, un: 'unidade', unp: 'unidades', taco: 532 }, /* Charuto, de repolho */
  { id: 'tabule', nome: 'Tabule', busca: 'tabule', p: 2, gUn: 100, qtd: 1, un: 'porção', unp: 'porções', taco: 549 }, /* Tabule */
  { id: 'salada-folhas', nome: 'Salada de folhas', busca: 'salada alface folhas verde rucula', p: 1.3, gUn: 60, qtd: 1, un: 'prato', unp: 'pratos', taco: 78 }, /* Alface, crespa, crua */
  { id: 'tomate', nome: 'Tomate', busca: 'tomate', p: 0.8, gUn: 60, qtd: 1, un: 'unidade', unp: 'unidades', taco: 161 }, /* Tomate, salada */
  { id: 'brocolis', nome: 'Brócolis', busca: 'brocolis', p: 2.1, gUn: 80, qtd: 1, un: 'porção', unp: 'porções', taco: 100 }, /* Brócolis, cozido */
  { id: 'cenoura', nome: 'Cenoura cozida', busca: 'cenoura', p: 0.8, gUn: 20, qtd: 3, un: 'colher', unp: 'colheres', taco: 109 }, /* Cenoura, cozida */
  { id: 'beterraba', nome: 'Beterraba cozida', busca: 'beterraba', p: 1.3, gUn: 20, qtd: 3, un: 'colher', unp: 'colheres', taco: 97 }, /* Beterraba, cozida */
  { id: 'couve', nome: 'Couve refogada', busca: 'couve mineira', p: 1.7, gUn: 25, qtd: 2, un: 'colher', unp: 'colheres', taco: 116 }, /* Couve, manteiga, refogada */
  { id: 'couve-flor', nome: 'Couve-flor', busca: 'couve flor', p: 1.2, gUn: 80, qtd: 1, un: 'porção', unp: 'porções', taco: 118 }, /* Couve-flor, cozida */
  { id: 'espinafre', nome: 'Espinafre refogado', busca: 'espinafre', p: 2.7, gUn: 30, qtd: 2, un: 'colher', unp: 'colheres', taco: 120 }, /* Espinafre, Nova Zelândia, refogado */
  { id: 'abobora', nome: 'Abóbora cozida', busca: 'abobora jerimum cabotia', p: 1.4, gUn: 100, qtd: 1, un: 'porção', unp: 'porções', taco: 64 }, /* Abóbora, cabotian, cozida */
  { id: 'chuchu', nome: 'Chuchu cozido', busca: 'chuchu', p: 0.4, gUn: 80, qtd: 1, un: 'porção', unp: 'porções', taco: 112 }, /* Chuchu, cozido */
  { id: 'vagem', nome: 'Vagem', busca: 'vagem', p: 1.8, gUn: 60, qtd: 1, un: 'porção', unp: 'porções', taco: 162 }, /* Vagem, crua */
  { id: 'quiabo', nome: 'Quiabo', busca: 'quiabo', p: 1.9, gUn: 60, qtd: 1, un: 'porção', unp: 'porções', taco: 147 }, /* Quiabo, cru */
  { id: 'repolho', nome: 'Repolho', busca: 'repolho', p: 0.9, gUn: 50, qtd: 1, un: 'pires', unp: 'pires', taco: 149 }, /* Repolho, branco, cru */
  { id: 'pepino', nome: 'Pepino', busca: 'pepino', p: 0.9, gUn: 100, qtd: 1, un: 'unidade', unp: 'unidades', taco: 142 }, /* Pepino, cru */
  { id: 'mandioca', nome: 'Mandioca cozida', busca: 'mandioca aipim macaxeira', p: 0.6, gUn: 100, qtd: 1, un: 'porção', unp: 'porções', taco: 129 }, /* Mandioca, cozida */
  { id: 'mandioca-frita', nome: 'Mandioca frita', busca: 'mandioca frita aipim', p: 1.4, gUn: 100, qtd: 1, un: 'porção', unp: 'porções', taco: 132 }, /* Mandioca, frita */
  { id: 'batata', nome: 'Batata cozida', busca: 'batata inglesa cozida pure', p: 1.2, gUn: 120, qtd: 1, un: 'unidade', unp: 'unidades', taco: 91 }, /* Batata, inglesa, cozida */
  { id: 'batata-frita', nome: 'Batata frita', busca: 'batata frita fritas', p: 5, gUn: 100, qtd: 1, un: 'porção', unp: 'porções', taco: 93 }, /* Batata, inglesa, frita */
  { id: 'batata-doce', nome: 'Batata doce', busca: 'batata doce', p: 0.6, gUn: 120, qtd: 1, un: 'pedaço', unp: 'pedaços', taco: 88 }, /* Batata, doce, cozida */
  { id: 'milho', nome: 'Milho verde', busca: 'milho verde lata', p: 3.2, gUn: 27, qtd: 3, un: 'colher', unp: 'colheres', taco: 45 }, /* Milho, verde, enlatado, drenado */
  { id: 'farofa', nome: 'Farofa', busca: 'farofa farinha mandioca', p: 2.1, gUn: 15, qtd: 2, un: 'colher', unp: 'colheres', taco: 131 }, /* Mandioca, farofa, temperada */
  { id: 'banana', nome: 'Banana', busca: 'banana', p: 1.3, gUn: 90, qtd: 1, un: 'unidade', unp: 'unidades', taco: 182 }, /* Banana, prata, crua */
  { id: 'maca', nome: 'Maçã', busca: 'maca fruta', p: 0.2, gUn: 130, qtd: 1, un: 'unidade', unp: 'unidades', taco: 221 }, /* Maçã, Argentina, com casca, crua */
  { id: 'abacate', nome: 'Abacate', busca: 'abacate guacamole', p: 1.2, gUn: 200, qtd: 1, un: 'unidade', unp: 'unidades', taco: 163 }, /* Abacate, cru */
  { id: 'abacaxi', nome: 'Abacaxi', busca: 'abacaxi', p: 0.9, gUn: 50, qtd: 2, un: 'fatia', unp: 'fatias', taco: 164 }, /* Abacaxi, cru */
  { id: 'goiaba', nome: 'Goiaba', busca: 'goiaba', p: 1.1, gUn: 100, qtd: 1, un: 'unidade', unp: 'unidades', taco: 200 }, /* Goiaba, vermelha, com casca, crua */
  { id: 'laranja', nome: 'Laranja', busca: 'laranja', p: 1, gUn: 130, qtd: 1, un: 'unidade', unp: 'unidades', taco: 214 }, /* Laranja, pêra, crua */
  { id: 'mamao', nome: 'Mamão', busca: 'mamao papaia formosa', p: 0.8, gUn: 150, qtd: 1, un: 'fatia', unp: 'fatias', taco: 225 }, /* Mamão, Formosa, cru */
  { id: 'manga', nome: 'Manga', busca: 'manga', p: 0.9, gUn: 150, qtd: 1, un: 'unidade', unp: 'unidades', taco: 231 }, /* Manga, Tommy Atkins, crua */
  { id: 'melancia', nome: 'Melancia', busca: 'melancia', p: 0.9, gUn: 200, qtd: 1, un: 'fatia', unp: 'fatias', taco: 235 }, /* Melancia, crua */
  { id: 'morango', nome: 'Morango', busca: 'morango', p: 0.9, gUn: 100, qtd: 1, un: 'xícara', unp: 'xícaras', taco: 239 }, /* Morango, cru */
  { id: 'uva', nome: 'Uva', busca: 'uva', p: 0.7, gUn: 100, qtd: 1, un: 'cacho', unp: 'cachos', taco: 256 }, /* Uva, Itália, crua */
  { id: 'castanha-caju', nome: 'Castanha de caju', busca: 'castanha caju', p: 18.5, gUn: 30, qtd: 1, un: 'punhado', unp: 'punhados', taco: 588 }, /* Castanha-de-caju, torrada, salgada */
  { id: 'castanha-para', nome: 'Castanha do Pará', busca: 'castanha para brasil', p: 14.5, gUn: 7, qtd: 3, un: 'unidade', unp: 'unidades', taco: 589 }, /* Castanha-do-Brasil, crua */
  { id: 'amendoim', nome: 'Amendoim', busca: 'amendoim', p: 22.5, gUn: 30, qtd: 1, un: 'punhado', unp: 'punhados', taco: 558 }, /* Amendoim, torrado, salgado */
  { id: 'pasta-amendoim', nome: 'Pasta de amendoim', busca: 'pasta de amendoim peanut', p: 25, gUn: 20, qtd: 1, un: 'colher', unp: 'colheres', fonte: 'rótulo' }, /* rótulo */
  { id: 'pacoca', nome: 'Paçoca', busca: 'pacoca amendoim doce', p: 16, gUn: 25, qtd: 1, un: 'unidade', unp: 'unidades', taco: 579 }, /* Paçoca, amendoim */
  { id: 'carbonara', nome: 'Macarrão à carbonara', busca: 'carbonara massa bacon', p: 9.5, gUn: 295, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 40×180g÷2,2 + 489×55g + 439×40g + 464×20g' }, /* soma TACO 40×180g÷2,2 + 489×55g + 439×40g + 464×20g */
  { id: 'lasanha', nome: 'Lasanha', busca: 'lasanha a bolonhesa', p: 15.4, gUn: 240, qtd: 1, un: 'pedaço', unp: 'pedaços', fonte: 'soma TACO 37×120g + 326×70g + 463×50g' }, /* soma TACO 37×120g + 326×70g + 463×50g */
  { id: 'parmegiana', nome: 'Filé à parmegiana', busca: 'parmegiana parmigiana milanesa com queijo', p: 23.2, gUn: 200, qtd: 1, un: 'filé', unp: 'filés', fonte: 'soma TACO 401×130g + 463×40g + 161×30g' }, /* soma TACO 401×130g + 463×40g + 161×30g */
  { id: 'escondidinho', nome: 'Escondidinho', busca: 'escondidinho carne seca purê', p: 10.1, gUn: 290, qtd: 1, un: 'porção', unp: 'porções', fonte: 'soma TACO 129×180g + 326×80g + 463×30g' }, /* soma TACO 129×180g + 326×80g + 463×30g */
  { id: 'pizza', nome: 'Pizza', busca: 'pizza', p: 11.2, gUn: 135, qtd: 1, un: 'fatia', unp: 'fatias', fonte: 'soma TACO 54×70g + 463×40g + 161×25g' }, /* soma TACO 54×70g + 463×40g + 161×25g */
  { id: 'risoto', nome: 'Risoto', busca: 'risoto risotto', p: 11.2, gUn: 280, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 3×200g + 464×20g + 410×60g' }, /* soma TACO 3×200g + 464×20g + 410×60g */
  { id: 'sanduiche-frango', nome: 'Sanduíche de frango', busca: 'sanduiche natural lanche frango', p: 18.5, gUn: 130, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 52×50g + 410×60g + 161×20g' }, /* soma TACO 52×50g + 410×60g + 161×20g */
  { id: 'crepe', nome: 'Crepe salgado', busca: 'crepe panqueca recheada', p: 14.9, gUn: 170, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 37×90g + 326×50g + 463×30g' }, /* soma TACO 37×90g + 326×50g + 463×30g */
  { id: 'esfiha', nome: 'Esfiha de carne', busca: 'esfiha esfirra kibe aberto', p: 15.9, gUn: 85, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 54×50g + 326×35g' }, /* soma TACO 54×50g + 326×35g */
  { id: 'pastel-carne', nome: 'Pastel de carne', busca: 'pastel salgado frito', p: 14.5, gUn: 90, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 54×60g + 326×30g' }, /* soma TACO 54×60g + 326×30g */
  { id: 'moqueca', nome: 'Moqueca de peixe', busca: 'moqueca peixe dendê', p: 21.2, gUn: 190, qtd: 1, un: 'porção', unp: 'porções', fonte: 'soma TACO 301×150g + 161×40g' }, /* soma TACO 301×150g + 161×40g */
  { id: 'canja', nome: 'Canja de galinha', busca: 'canja sopa de frango', p: 14.6, gUn: 130, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 3×60g + 404×70g' }, /* soma TACO 3×60g + 404×70g */
  { id: 'sopa-legumes', nome: 'Sopa de legumes', busca: 'sopa caldo de legumes', p: 2, gUn: 250, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 546×250g' }, /* soma TACO 546×250g */
  { id: 'acai-tigela', nome: 'Açaí na tigela', busca: 'acai tigela', p: 1.4, gUn: 340, qtd: 1, un: 'tigela', unp: 'tigelas', fonte: 'soma TACO 168×250g + 25×30g + 182×60g' }, /* soma TACO 168×250g + 25×30g + 182×60g */
  { id: 'sushi', nome: 'Sushi ou sashimi', busca: 'sushi sashimi temaki japonesa', p: 11.9, gUn: 160, qtd: 1, un: 'porção', unp: 'porções', fonte: 'soma TACO 3×90g + 315×70g' }, /* soma TACO 3×90g + 315×70g */
  { id: 'strogonoff-arroz', nome: 'Estrogonofe com arroz', busca: 'estrogonofe com arroz prato feito', p: 10.9, gUn: 270, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 538×150g + 3×120g' }, /* soma TACO 538×150g + 3×120g */
  { id: 'pf-frango', nome: 'Prato feito de frango', busca: 'pf prato feito frango arroz feijao', p: 12.7, gUn: 360, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 410×120g + 3×120g + 561×80g + 78×40g' }, /* soma TACO 410×120g + 3×120g + 561×80g + 78×40g */
  { id: 'pf-carne', nome: 'Prato feito de carne', busca: 'pf prato feito bife arroz feijao', p: 12.7, gUn: 340, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 377×100g + 3×120g + 561×80g + 78×40g' }, /* soma TACO 377×100g + 3×120g + 561×80g + 78×40g */
  { id: 'misto-quente', nome: 'Misto quente', busca: 'misto quente queijo presunto', p: 14.4, gUn: 110, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 52×50g + 463×30g + 439×30g' }, /* soma TACO 52×50g + 463×30g + 439×30g */
  { id: 'salada-frango', nome: 'Salada com frango', busca: 'salada com frango caesar', p: 14.4, gUn: 210, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 78×80g + 410×90g + 161×40g' }, /* soma TACO 78×80g + 410×90g + 161×40g */
];

/** "2 colheres", "1 filé" — o plural só quando é mais de um. */
export function medidaDe(a: Alimento, qtd: number): string {
  return `${qtd} ${qtd === 1 ? a.un : a.unp}`;
}

const semAcento = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

/* Busca por prefixo de palavra, e não por trecho solto: "ova" não devia
   trazer "Ovo cozido" pelo meio de "abacate". O que começa igual ao que
   foi digitado vem primeiro; o resto vem depois, na ordem da lista. */
export function buscarAlimento(termo: string, limite = 6): Alimento[] {
  const t = semAcento(termo);
  if (t.length < 2) return [];
  const comeca: Alimento[] = [];
  const contem: Alimento[] = [];
  for (const a of ALIMENTOS) {
    const palavras = semAcento(a.nome + ' ' + a.busca).split(/[\s,]+/);
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
