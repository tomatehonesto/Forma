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
  { id: 'amendoa', nome: 'Amêndoas', busca: 'amendoa amendoas nuts', p: 18.6, gUn: 30, qtd: 1, un: 'punhado', unp: 'punhados', taco: 587 }, /* Amêndoa, torrada, salgada */
  { id: 'granola', nome: 'Granola', busca: 'granola aveia mel cereal barra', p: 9, gUn: 12, qtd: 3, un: 'colher', unp: 'colheres', fonte: 'rótulo' }, /* rótulo */
  { id: 'cottage', nome: 'Queijo cottage', busca: 'cottage queijo branco fresco', p: 11, gUn: 50, qtd: 2, un: 'colher', unp: 'colheres', fonte: 'rótulo' }, /* rótulo */
  { id: 'barra-proteina', nome: 'Barra de proteína', busca: 'barra de proteina protein bar', p: 33, gUn: 45, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'rótulo' }, /* rótulo */
  { id: 'ovo-codorna', nome: 'Ovo de codorna', busca: 'ovo codorna ovinho', p: 13.7, gUn: 10, qtd: 4, un: 'unidade', unp: 'unidades', taco: 485 }, /* Ovo, de codorna, inteiro, cru */
  { id: 'torrada', nome: 'Torrada', busca: 'torrada pao torrado', p: 10.5, gUn: 8, qtd: 2, un: 'fatia', unp: 'fatias', taco: 63 }, /* Torrada, pão francês */
  { id: 'biscoito-salgado', nome: 'Biscoito cream cracker', busca: 'biscoito salgado cream cracker agua e sal bolacha', p: 10.1, gUn: 6, qtd: 4, un: 'unidade', unp: 'unidades', taco: 13 }, /* Biscoito, salgado, cream cracker */
  { id: 'biscoito-recheado', nome: 'Biscoito recheado', busca: 'biscoito recheado bolacha doce', p: 6.4, gUn: 15, qtd: 3, un: 'unidade', unp: 'unidades', taco: 9 }, /* Biscoito, doce, recheado com chocolate */
  { id: 'bolo-chocolate', nome: 'Bolo de chocolate', busca: 'bolo chocolate fatia doce', p: 6.2, gUn: 60, qtd: 1, un: 'fatia', unp: 'fatias', taco: 16 }, /* Bolo, pronto, chocolate */
  { id: 'pipoca', nome: 'Pipoca', busca: 'pipoca milho estourado', p: 9.9, gUn: 30, qtd: 1, un: 'porção', unp: 'porções', taco: 61 }, /* Pipoca, com óleo de soja, sem sal */
  { id: 'chocolate', nome: 'Chocolate ao leite', busca: 'chocolate barra ao leite bombom', p: 7.2, gUn: 25, qtd: 1, un: 'porção', unp: 'porções', taco: 495 }, /* Chocolate, ao leite */
  { id: 'suco-laranja', nome: 'Suco de laranja', busca: 'suco laranja natural', p: 0.7, gUn: 200, qtd: 1, un: 'copo', unp: 'copos', taco: 215 }, /* Laranja, pêra, suco */
  { id: 'palmito', nome: 'Palmito em conserva', busca: 'palmito conserva pupunha', p: 2.5, gUn: 30, qtd: 3, un: 'tolete', unp: 'toletes', taco: 139 }, /* Palmito, pupunha, em conserva */
  { id: 'pimentao', nome: 'Pimentão', busca: 'pimentao cru salada', p: 1.2, gUn: 30, qtd: 2, un: 'rodela', unp: 'rodelas', taco: 143 }, /* Pimentão, amarelo, cru */
  { id: 'barra-cereal', nome: 'Barra de cereal', busca: 'barra de cereal snack lanche', p: 6, gUn: 25, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'rótulo' }, /* rótulo */
  { id: 'carbonara', nome: 'Macarrão à carbonara', busca: 'carbonara massa bacon ovo', p: 9.5, gUn: 295, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 40×180g÷2,2 + 489×55g + 439×40g + 464×20g' }, /* soma TACO 40×180g÷2,2 + 489×55g + 439×40g + 464×20g */
  { id: 'macarrao-alho', nome: 'Macarrão ao alho e óleo', busca: 'macarrao alho e oleo massa simples', p: 6.2, gUn: 190, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 40×180g÷2,2 + 464×10g' }, /* soma TACO 40×180g÷2,2 + 464×10g */
  { id: 'macarrao-queijos', nome: 'Macarrão aos quatro queijos', busca: 'macarrao quatro queijos massa', p: 9.3, gUn: 275, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 40×170g÷2,2 + 463×45g + 464×20g + 447×40g' }, /* soma TACO 40×170g÷2,2 + 463×45g + 464×20g + 447×40g */
  { id: 'lasanha-carne', nome: 'Lasanha de carne', busca: 'lasanha bolonhesa carne', p: 15.4, gUn: 240, qtd: 1, un: 'pedaço', unp: 'pedaços', fonte: 'soma TACO 37×120g + 326×70g + 463×50g' }, /* soma TACO 37×120g + 326×70g + 463×50g */
  { id: 'lasanha-frango', nome: 'Lasanha de frango', busca: 'lasanha de frango', p: 14.9, gUn: 240, qtd: 1, un: 'pedaço', unp: 'pedaços', fonte: 'soma TACO 37×120g + 404×70g + 463×50g' }, /* soma TACO 37×120g + 404×70g + 463×50g */
  { id: 'lasanha-presunto', nome: 'Lasanha de presunto e queijo', busca: 'lasanha presunto queijo quatro queijos', p: 11.7, gUn: 230, qtd: 1, un: 'pedaço', unp: 'pedaços', fonte: 'soma TACO 37×130g + 439×40g + 463×60g' }, /* soma TACO 37×130g + 439×40g + 463×60g */
  { id: 'nhoque', nome: 'Nhoque ao sugo', busca: 'nhoque gnocchi batata', p: 2.8, gUn: 295, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 91×220g + 161×60g + 464×15g' }, /* soma TACO 91×220g + 161×60g + 464×15g */
  { id: 'parmegiana-frango', nome: 'Filé de frango à parmegiana', busca: 'parmegiana parmigiana frango milanesa com queijo', p: 23.2, gUn: 200, qtd: 1, un: 'filé', unp: 'filés', fonte: 'soma TACO 401×130g + 463×40g + 161×30g' }, /* soma TACO 401×130g + 463×40g + 161×30g */
  { id: 'parmegiana-carne', nome: 'Filé de carne à parmegiana', busca: 'parmegiana parmigiana carne bife milanesa com queijo', p: 18, gUn: 200, qtd: 1, un: 'filé', unp: 'filés', fonte: 'soma TACO 340×130g + 463×40g + 161×30g' }, /* soma TACO 340×130g + 463×40g + 161×30g */
  { id: 'bife-milanesa', nome: 'Bife à milanesa', busca: 'bife a milanesa empanado carne', p: 20.6, gUn: 130, qtd: 1, un: 'filé', unp: 'filés', fonte: 'soma TACO 340×130g' }, /* soma TACO 340×130g */
  { id: 'galinhada', nome: 'Galinhada', busca: 'galinhada arroz com frango', p: 11, gUn: 290, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 3×180g + 404×110g' }, /* soma TACO 3×180g + 404×110g */
  { id: 'escondidinho-carne', nome: 'Escondidinho de carne moída', busca: 'escondidinho carne moida pure', p: 10.1, gUn: 290, qtd: 1, un: 'porção', unp: 'porções', fonte: 'soma TACO 129×180g + 326×80g + 463×30g' }, /* soma TACO 129×180g + 326×80g + 463×30g */
  { id: 'escondidinho-carne-seca', nome: 'Escondidinho de carne seca', busca: 'escondidinho carne seca charque pure', p: 10.1, gUn: 290, qtd: 1, un: 'porção', unp: 'porções', fonte: 'soma TACO 129×180g + 384×80g + 463×30g' }, /* soma TACO 129×180g + 384×80g + 463×30g */
  { id: 'escondidinho-frango', nome: 'Escondidinho de frango', busca: 'escondidinho de frango pure', p: 9.6, gUn: 290, qtd: 1, un: 'porção', unp: 'porções', fonte: 'soma TACO 129×180g + 404×80g + 463×30g' }, /* soma TACO 129×180g + 404×80g + 463×30g */
  { id: 'panqueca-carne', nome: 'Panqueca de carne', busca: 'panqueca de carne moida', p: 12.7, gUn: 160, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 37×70g + 326×60g + 161×30g' }, /* soma TACO 37×70g + 326×60g + 161×30g */
  { id: 'panqueca-frango', nome: 'Panqueca de frango', busca: 'panqueca de frango', p: 12.1, gUn: 160, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 37×70g + 404×60g + 161×30g' }, /* soma TACO 37×70g + 404×60g + 161×30g */
  { id: 'torta-frango', nome: 'Torta de frango', busca: 'torta salgada de frango empadao', p: 6.9, gUn: 150, qtd: 1, un: 'fatia', unp: 'fatias', fonte: 'soma TACO 389×150g' }, /* soma TACO 389×150g */
  { id: 'crepe-carne', nome: 'Crepe de carne', busca: 'crepe de carne moida', p: 14.9, gUn: 170, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 37×90g + 326×50g + 463×30g' }, /* soma TACO 37×90g + 326×50g + 463×30g */
  { id: 'crepe-frango', nome: 'Crepe de frango', busca: 'crepe de frango com catupiry', p: 12.1, gUn: 170, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 37×90g + 404×50g + 465×30g' }, /* soma TACO 37×90g + 404×50g + 465×30g */
  { id: 'crepe-queijo', nome: 'Crepe de queijo', busca: 'crepe de queijo presunto', p: 11.6, gUn: 160, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 37×90g + 463×40g + 439×30g' }, /* soma TACO 37×90g + 463×40g + 439×30g */
  { id: 'pizza-mussarela', nome: 'Pizza de mussarela', busca: 'pizza mussarela marguerita', p: 11.2, gUn: 135, qtd: 1, un: 'fatia', unp: 'fatias', fonte: 'soma TACO 54×70g + 463×40g + 161×25g' }, /* soma TACO 54×70g + 463×40g + 161×25g */
  { id: 'pizza-calabresa', nome: 'Pizza de calabresa', busca: 'pizza calabresa', p: 13.6, gUn: 125, qtd: 1, un: 'fatia', unp: 'fatias', fonte: 'soma TACO 54×70g + 463×25g + 420×30g' }, /* soma TACO 54×70g + 463×25g + 420×30g */
  { id: 'pizza-frango', nome: 'Pizza de frango com catupiry', busca: 'pizza frango catupiry', p: 12.9, gUn: 135, qtd: 1, un: 'fatia', unp: 'fatias', fonte: 'soma TACO 54×70g + 404×35g + 465×30g' }, /* soma TACO 54×70g + 404×35g + 465×30g */
  { id: 'pizza-portuguesa', nome: 'Pizza portuguesa', busca: 'pizza portuguesa presunto ovo', p: 12.7, gUn: 140, qtd: 1, un: 'fatia', unp: 'fatias', fonte: 'soma TACO 54×70g + 463×25g + 439×25g + 488×20g' }, /* soma TACO 54×70g + 463×25g + 439×25g + 488×20g */
  { id: 'sanduiche-frango', nome: 'Sanduíche de frango', busca: 'sanduiche natural lanche de frango', p: 18.5, gUn: 130, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 52×50g + 410×60g + 161×20g' }, /* soma TACO 52×50g + 410×60g + 161×20g */
  { id: 'sanduiche-atum', nome: 'Sanduíche de atum', busca: 'sanduiche natural lanche de atum', p: 15.4, gUn: 125, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 52×50g + 277×55g + 161×20g' }, /* soma TACO 52×50g + 277×55g + 161×20g */
  { id: 'sanduiche-peru', nome: 'Sanduíche de peito de peru', busca: 'sanduiche peito de peru queijo branco', p: 17, gUn: 115, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 52×50g + 425×40g + 461×25g' }, /* soma TACO 52×50g + 425×40g + 461×25g */
  { id: 'x-salada', nome: 'X-salada', busca: 'x salada hamburguer lanche burguer', p: 13.3, gUn: 225, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 54×70g + 416×90g + 463×25g + 78×20g + 161×20g' }, /* soma TACO 54×70g + 416×90g + 463×25g + 78×20g + 161×20g */
  { id: 'misto-quente', nome: 'Misto quente', busca: 'misto quente queijo presunto', p: 14.4, gUn: 110, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 52×50g + 463×30g + 439×30g' }, /* soma TACO 52×50g + 463×30g + 439×30g */
  { id: 'tapioca-frango', nome: 'Tapioca de frango', busca: 'tapioca recheada de frango', p: 10, gUn: 150, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 551×90g + 404×60g' }, /* soma TACO 551×90g + 404×60g */
  { id: 'tapioca-queijo', nome: 'Tapioca de queijo', busca: 'tapioca recheada de queijo coco', p: 5.4, gUn: 130, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 551×90g + 461×40g' }, /* soma TACO 551×90g + 461×40g */
  { id: 'esfiha', nome: 'Esfiha de carne', busca: 'esfiha esfirra kibe aberto', p: 15.9, gUn: 85, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 54×50g + 326×35g' }, /* soma TACO 54×50g + 326×35g */
  { id: 'pastel-carne', nome: 'Pastel de carne', busca: 'pastel de carne salgado frito', p: 14.5, gUn: 90, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 54×60g + 326×30g' }, /* soma TACO 54×60g + 326×30g */
  { id: 'pastel-queijo', nome: 'Pastel de queijo', busca: 'pastel de queijo salgado frito', p: 13.1, gUn: 90, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 54×60g + 463×30g' }, /* soma TACO 54×60g + 463×30g */
  { id: 'croquete', nome: 'Croquete de carne', busca: 'croquete de carne salgado', p: 16.9, gUn: 45, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 388×45g' }, /* soma TACO 388×45g */
  { id: 'empada-frango', nome: 'Empada de frango', busca: 'empada empadinha de frango', p: 6.9, gUn: 70, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 389×70g' }, /* soma TACO 389×70g */
  { id: 'moqueca', nome: 'Moqueca de peixe', busca: 'moqueca peixe dende', p: 21.2, gUn: 190, qtd: 1, un: 'porção', unp: 'porções', fonte: 'soma TACO 301×150g + 161×40g' }, /* soma TACO 301×150g + 161×40g */
  { id: 'bobo-camarao', nome: 'Bobó de camarão', busca: 'bobo de camarao', p: 7.8, gUn: 230, qtd: 1, un: 'porção', unp: 'porções', fonte: 'soma TACO 284×90g + 129×140g' }, /* soma TACO 284×90g + 129×140g */
  { id: 'bacalhau-natas', nome: 'Bacalhau com batata', busca: 'bacalhau com natas batata portuguesa', p: 9.9, gUn: 290, qtd: 1, un: 'porção', unp: 'porções', fonte: 'soma TACO 280×110g + 91×140g + 447×40g' }, /* soma TACO 280×110g + 91×140g + 447×40g */
  { id: 'sushi', nome: 'Sushi de salmão', busca: 'sushi sashimi temaki japonesa salmao', p: 11.9, gUn: 160, qtd: 1, un: 'porção', unp: 'porções', fonte: 'soma TACO 3×90g + 315×70g' }, /* soma TACO 3×90g + 315×70g */
  { id: 'risoto-camarao', nome: 'Risoto de camarão', busca: 'risoto risotto de camarao', p: 8.7, gUn: 295, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 3×200g + 284×80g + 464×15g' }, /* soma TACO 3×200g + 284×80g + 464×15g */
  { id: 'risoto-frango', nome: 'Risoto de frango', busca: 'risoto risotto de frango', p: 11.9, gUn: 290, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 3×200g + 410×70g + 464×20g' }, /* soma TACO 3×200g + 410×70g + 464×20g */
  { id: 'canja', nome: 'Canja de galinha', busca: 'canja sopa de frango com arroz', p: 14.6, gUn: 130, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 3×60g + 404×70g' }, /* soma TACO 3×60g + 404×70g */
  { id: 'sopa-legumes', nome: 'Sopa de legumes', busca: 'sopa caldo de legumes', p: 2, gUn: 250, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 546×250g' }, /* soma TACO 546×250g */
  { id: 'sopa-feijao', nome: 'Caldo de feijão', busca: 'caldo sopa de feijao', p: 6.4, gUn: 250, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 561×220g + 420×30g' }, /* soma TACO 561×220g + 420×30g */
  { id: 'sopa-carne', nome: 'Sopa de carne com legumes', busca: 'sopa de carne legumes musculo', p: 11.7, gUn: 270, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 371×90g + 546×180g' }, /* soma TACO 371×90g + 546×180g */
  { id: 'mingau-aveia', nome: 'Mingau de aveia', busca: 'mingau de aveia leite overnight', p: 5, gUn: 240, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 7×40g + leite TBCA×200g' }, /* soma TACO 7×40g + leite TBCA×200g */
  { id: 'vitamina-banana', nome: 'Vitamina de banana', busca: 'vitamina batida de banana leite', p: 3.3, gUn: 310, qtd: 1, un: 'copo', unp: 'copos', fonte: 'soma TACO leite TBCA×200g + 182×90g + 7×20g' }, /* soma TACO leite TBCA×200g + 182×90g + 7×20g */
  { id: 'panqueca-americana', nome: 'Panquecas americanas', busca: 'panqueca americana pancake hotcake', p: 7.9, gUn: 190, qtd: 1, un: 'porção', unp: 'porções', fonte: 'soma TACO 35×60g + 489×50g + leite TBCA×80g' }, /* soma TACO 35×60g + 489×50g + leite TBCA×80g */
  { id: 'waffle', nome: 'Waffle', busca: 'waffle belga', p: 8.1, gUn: 160, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 35×60g + 489×40g + leite TBCA×60g' }, /* soma TACO 35×60g + 489×40g + leite TBCA×60g */
  { id: 'crepioca', nome: 'Crepioca de queijo', busca: 'crepioca tapioca com ovo', p: 9.8, gUn: 120, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 551×40g + 489×50g + 461×30g' }, /* soma TACO 551×40g + 489×50g + 461×30g */
  { id: 'iogurte-granola', nome: 'Iogurte com granola e fruta', busca: 'iogurte granola parfait grego bowl', p: 4, gUn: 260, qtd: 1, un: 'tigela', unp: 'tigelas', fonte: 'soma TACO 448×170g + granola rótulo×30g + 182×60g' }, /* soma TACO 448×170g + granola rótulo×30g + 182×60g */
  { id: 'smoothie-proteico', nome: 'Smoothie de banana com whey', busca: 'smoothie shake proteico batida', p: 9.9, gUn: 320, qtd: 1, un: 'copo', unp: 'copos', fonte: 'soma TACO 182×90g + leite TBCA×200g + whey rótulo×30g' }, /* soma TACO 182×90g + leite TBCA×200g + whey rótulo×30g */
  { id: 'torrada-abacate-ovo', nome: 'Torrada com abacate e ovo', busca: 'avocado toast torrada abacate ovo', p: 8.6, gUn: 160, qtd: 1, un: 'porção', unp: 'porções', fonte: 'soma TACO 63×50g + 163×60g + 490×50g' }, /* soma TACO 63×50g + 163×60g + 490×50g */
  { id: 'shakshuka', nome: 'Shakshuka', busca: 'shakshuka ovos no molho de tomate arabe', p: 5.6, gUn: 280, qtd: 1, un: 'porção', unp: 'porções', fonte: 'soma TACO 489×100g + 159×150g + 107×30g' }, /* soma TACO 489×100g + 159×150g + 107×30g */
  { id: 'croissant-presunto-queijo', nome: 'Croissant de presunto e queijo', busca: 'croissant misto frances padaria', p: 13, gUn: 110, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 54×60g + 439×25g + 463×25g' }, /* soma TACO 54×60g + 439×25g + 463×25g */
  { id: 'bagel-cream-cheese', nome: 'Bagel com cream cheese', busca: 'bagel cream cheese requeijao pao', p: 8.3, gUn: 120, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 53×90g + 465×30g' }, /* soma TACO 53×90g + 465×30g */
  { id: 'sanduiche-ovo', nome: 'Sanduíche de ovo', busca: 'sanduiche de ovo egg sandwich', p: 12, gUn: 150, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 52×50g + 488×100g' }, /* soma TACO 52×50g + 488×100g */
  { id: 'acai-tigela', nome: 'Açaí na tigela', busca: 'acai tigela com granola', p: 1.6, gUn: 340, qtd: 1, un: 'tigela', unp: 'tigelas', fonte: 'soma TACO 168×250g + granola rótulo×30g + 182×60g' }, /* soma TACO 168×250g + granola rótulo×30g + 182×60g */
  { id: 'ramen-carne', nome: 'Lámen com carne e ovo', busca: 'ramen lamen miojo japones sopa macarrao', p: 15.2, gUn: 180, qtd: 1, un: 'tigela', unp: 'tigelas', fonte: 'soma TACO 39×80g + 328×50g + 488×50g' }, /* soma TACO 39×80g + 328×50g + 488×50g */
  { id: 'temaki-salmao', nome: 'Temaki de salmão', busca: 'temaki cone japones salmao', p: 9.7, gUn: 140, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 3×80g + 316×60g' }, /* soma TACO 3×80g + 316×60g */
  { id: 'poke-salmao', nome: 'Poke de salmão', busca: 'poke bowl havaiano salmao', p: 7.7, gUn: 280, qtd: 1, un: 'tigela', unp: 'tigelas', fonte: 'soma TACO 3×150g + 316×90g + 163×40g' }, /* soma TACO 3×150g + 316×90g + 163×40g */
  { id: 'gyoza-porco', nome: 'Guioza de porco', busca: 'guioza gyoza pastel japones porco', p: 16.8, gUn: 100, qtd: 1, un: 'porção', unp: 'porções', fonte: 'soma TACO 35×45g + 433×55g' }, /* soma TACO 35×45g + 433×55g */
  { id: 'frango-xadrez', nome: 'Frango xadrez', busca: 'frango xadrez chines castanha', p: 23.1, gUn: 170, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 410×110g + 588×20g + 145×40g' }, /* soma TACO 410×110g + 588×20g + 145×40g */
  { id: 'arroz-frito', nome: 'Arroz frito com ovo', busca: 'arroz frito yakimeshi chines chaufa', p: 5.1, gUn: 260, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 3×180g + 489×50g + 559×30g' }, /* soma TACO 3×180g + 489×50g + 559×30g */
  { id: 'pad-thai-camarao', nome: 'Pad thai de camarão', busca: 'pad thai tailandes macarrao camarao', p: 9.4, gUn: 215, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 40×80g÷2,2 + 285×80g + 489×40g + 558×15g' }, /* soma TACO 40×80g÷2,2 + 285×80g + 489×40g + 558×15g */
  { id: 'bibimbap', nome: 'Bibimbap', busca: 'bibimbap coreano arroz carne ovo', p: 8.9, gUn: 330, qtd: 1, un: 'tigela', unp: 'tigelas', fonte: 'soma TACO 3×180g + 328×60g + 490×50g + 110×40g' }, /* soma TACO 3×180g + 328×60g + 490×50g + 110×40g */
  { id: 'taco-carne', nome: 'Taco de carne', busca: 'taco tacos mexicano carne', p: 20.1, gUn: 130, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 33×40g + 326×70g + 463×20g' }, /* soma TACO 33×40g + 326×70g + 463×20g */
  { id: 'burrito-frango', nome: 'Burrito de frango', busca: 'burrito mexicano frango feijao', p: 13.7, gUn: 270, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 35×70g + 410×80g + 561×60g + 3×60g' }, /* soma TACO 35×70g + 410×80g + 561×60g + 3×60g */
  { id: 'quesadilla-queijo', nome: 'Quesadilla de queijo', busca: 'quesadilla mexicana queijo tortilla', p: 15.6, gUn: 110, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 35×60g + 463×50g' }, /* soma TACO 35×60g + 463×50g */
  { id: 'chili-carne', nome: 'Chili com carne', busca: 'chili con carne mexicano feijao', p: 12.3, gUn: 260, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 326×100g + 567×100g + 159×60g' }, /* soma TACO 326×100g + 567×100g + 159×60g */
  { id: 'guacamole-nachos', nome: 'Guacamole com nachos', busca: 'guacamole nachos abacate mexicano', p: 3.2, gUn: 120, qtd: 1, un: 'porção', unp: 'porções', fonte: 'soma TACO 163×80g + 33×40g' }, /* soma TACO 163×80g + 33×40g */
  { id: 'homus-pao', nome: 'Homus com pão sírio', busca: 'homus hummus grao de bico arabe', p: 8.5, gUn: 140, qtd: 1, un: 'porção', unp: 'porções', fonte: 'soma TACO 575×80g÷2,4 + 53×60g' }, /* soma TACO 575×80g÷2,4 + 53×60g */
  { id: 'falafel', nome: 'Falafel', busca: 'falafel bolinho de grao de bico arabe', p: 9, gUn: 140, qtd: 1, un: 'porção', unp: 'porções', fonte: 'soma TACO 575×120g÷2,4 + 35×20g' }, /* soma TACO 575×120g÷2,4 + 35×20g */
  { id: 'shawarma-frango', nome: 'Shawarma de frango', busca: 'shawarma shauarma churrasco grego frango', p: 19.4, gUn: 200, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 53×70g + 410×100g + 448×30g' }, /* soma TACO 53×70g + 410×100g + 448×30g */
  { id: 'kebab-carne', nome: 'Kebab de carne', busca: 'kebab kebap doner carne arabe turco', p: 15.9, gUn: 180, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 53×70g + 328×80g + 448×30g' }, /* soma TACO 53×70g + 328×80g + 448×30g */
  { id: 'souvlaki-frango', nome: 'Espetinho grego de frango', busca: 'souvlaki espetinho grego frango tzatziki', p: 25, gUn: 160, qtd: 1, un: 'espetinho', unp: 'espetinhos', fonte: 'soma TACO 410×120g + 448×40g' }, /* soma TACO 410×120g + 448×40g */
  { id: 'tikka-masala', nome: 'Frango tikka masala', busca: 'tikka masala curry indiano frango', p: 16.1, gUn: 230, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 410×110g + 447×60g + 159×60g' }, /* soma TACO 410×110g + 447×60g + 159×60g */
  { id: 'curry-grao-de-bico', nome: 'Curry de grão-de-bico', busca: 'curry indiano grao de bico vegetariano channa', p: 4.8, gUn: 250, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 575×120g÷2,4 + 523×80g + 159×50g' }, /* soma TACO 575×120g÷2,4 + 523×80g + 159×50g */
  { id: 'paella-frutos-do-mar', nome: 'Paella de frutos do mar', busca: 'paella espanhola arroz camarao', p: 4.8, gUn: 290, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 3×200g + 285×90g' }, /* soma TACO 3×200g + 285×90g */
  { id: 'tortilla-espanhola', nome: 'Tortilha espanhola', busca: 'tortilla espanhola omelete de batata', p: 5.9, gUn: 250, qtd: 1, un: 'fatia', unp: 'fatias', fonte: 'soma TACO 489×100g + 91×150g' }, /* soma TACO 489×100g + 91×150g */
  { id: 'quiche-queijo', nome: 'Quiche de queijo', busca: 'quiche torta francesa queijo', p: 12.1, gUn: 175, qtd: 1, un: 'fatia', unp: 'fatias', fonte: 'soma TACO 35×45g + 489×55g + 463×40g + 447×35g' }, /* soma TACO 35×45g + 489×55g + 463×40g + 447×35g */
  { id: 'mac-and-cheese', nome: 'Macarrão com queijo cheddar', busca: 'mac and cheese macarrao queijo americano', p: 7.4, gUn: 280, qtd: 1, un: 'prato', unp: 'pratos', fonte: 'soma TACO 40×150g÷2,2 + 467×50g + leite TBCA×80g' }, /* soma TACO 40×150g÷2,2 + 467×50g + leite TBCA×80g */
  { id: 'wrap-frango', nome: 'Wrap de frango', busca: 'wrap enrolado frango tortilla', p: 18.7, gUn: 170, qtd: 1, un: 'unidade', unp: 'unidades', fonte: 'soma TACO 35×60g + 410×80g + 161×30g' }, /* soma TACO 35×60g + 410×80g + 161×30g */
  { id: 'ceviche-peixe', nome: 'Ceviche de peixe', busca: 'ceviche peruano peixe limao', p: 14.2, gUn: 180, qtd: 1, un: 'porção', unp: 'porções', fonte: 'soma TACO 307×150g + 107×30g' }, /* soma TACO 307×150g + 107×30g */
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
