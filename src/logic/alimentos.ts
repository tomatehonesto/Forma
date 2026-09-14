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

   Já a PORÇÃO não é da TACO, e não podia ser: tabela de composição
   descreve 100 g, não descreve prato. Os gramas de "1 filé médio" são
   medida caseira comum, e é por isso que a tela fala em "~" e pergunta
   se a porção foi pouca, normal ou bastante em vez de pedir a balança.

   A lista é curta de propósito. São os alimentos que alguém digita
   DEPOIS de comer — não um inventário de ingredientes. Quem procurar
   "farinha de trigo" não acha, e está certo: ninguém almoça isso.
   ============================================================ */

export type Alimento = {
  id: string;
  nome: string;
  /** Termos sem acento para a busca encontrar o que a pessoa digita. */
  busca: string;
  /** Proteína por 100 g. */
  p: number;
  /** Gramas de uma porção normal. */
  porcao: number;
  /** O que é essa porção, em medida de casa. */
  medida: string;
  /** Linha da TACO de onde `p` saiu. */
  taco?: number;
  /** Quando não é da TACO, de onde é. */
  fonte?: string;
};

export const ALIMENTOS: Alimento[] = [
  { id: 'peito-frango', nome: 'Peito de frango grelhado', busca: 'frango peito file grelhado file de frango', p: 32, porcao: 120, medida: '1 filé médio', taco: 410 }, /* Frango, peito, sem pele, grelhado */
  { id: 'frango-assado', nome: 'Frango assado sem pele', busca: 'frango assado cozido', p: 28, porcao: 120, medida: '1 pedaço', taco: 403 }, /* Frango, inteiro, sem pele, assado */
  { id: 'sobrecoxa', nome: 'Coxa ou sobrecoxa de frango', busca: 'coxa sobrecoxa frango', p: 29.2, porcao: 100, medida: '1 unidade', taco: 413 }, /* Frango, sobrecoxa, sem pele, assada */
  { id: 'frango-milanesa', nome: 'Frango à milanesa', busca: 'frango milanesa empanado nuggets', p: 28.5, porcao: 120, medida: '1 filé', taco: 401 }, /* Frango, filé, à milanesa */
  { id: 'patinho', nome: 'Bife de patinho grelhado', busca: 'bife patinho carne vermelha grelhado', p: 35.9, porcao: 100, medida: '1 bife médio', taco: 377 }, /* Carne, bovina, patinho, sem gordura, grelhado */
  { id: 'contrafile', nome: 'Contra-filé grelhado', busca: 'contra file bife carne', p: 32.4, porcao: 100, medida: '1 bife médio', taco: 344 }, /* Carne, bovina, contra-filé, com gordura, grelhado */
  { id: 'file-mignon', nome: 'Filé mignon grelhado', busca: 'file mignon carne', p: 32.8, porcao: 100, medida: '1 medalhão', taco: 358 }, /* Carne, bovina, filé mingnon, sem gordura, grelhado */
  { id: 'picanha', nome: 'Picanha grelhada', busca: 'picanha churrasco carne', p: 31.9, porcao: 100, medida: '2 fatias', taco: 383 }, /* Carne, bovina, picanha, sem gordura, grelhada */
  { id: 'carne-moida', nome: 'Carne moída refogada', busca: 'carne moida bolonhesa moido', p: 26.7, porcao: 100, medida: '4 colheres', taco: 326 }, /* Carne, bovina, acém, moído, cozido */
  { id: 'carne-panela', nome: 'Carne de panela', busca: 'carne panela cozida ensopado paleta', p: 29.7, porcao: 100, medida: '1 porção', taco: 374 }, /* Carne, bovina, paleta, sem gordura, cozida */
  { id: 'musculo', nome: 'Músculo cozido', busca: 'musculo cozido sopa', p: 31.2, porcao: 100, medida: '1 porção', taco: 371 }, /* Carne, bovina, músculo, sem gordura, cozido */
  { id: 'hamburguer', nome: 'Hambúrguer', busca: 'hamburguer burguer lanche', p: 20, porcao: 80, medida: '1 unidade', taco: 416 }, /* Hambúrguer, bovino, frito */
  { id: 'linguica', nome: 'Linguiça', busca: 'linguica calabresa churrasco', p: 18.2, porcao: 80, medida: '1 gomo', taco: 420 }, /* Lingüiça, frango, grelhada */
  { id: 'lombo', nome: 'Lombo de porco assado', busca: 'lombo porco suino', p: 35.7, porcao: 100, medida: '1 fatia grossa', taco: 432 }, /* Porco, lombo, assado */
  { id: 'pernil', nome: 'Pernil assado', busca: 'pernil porco suino', p: 32.1, porcao: 100, medida: '1 fatia', taco: 435 }, /* Porco, pernil, assado */
  { id: 'costelinha', nome: 'Costelinha de porco', busca: 'costela costelinha porco', p: 30.2, porcao: 120, medida: '2 costelas', taco: 430 }, /* Porco, costela, assada */
  { id: 'coxao-mole', nome: 'Carne cozida (coxão mole)', busca: 'coxao mole carne cozida panela', p: 32.4, porcao: 100, medida: '1 porção', taco: 351 }, /* Carne, bovina, coxão mole, sem gordura, cozido */
  { id: 'almondega', nome: 'Almôndegas', busca: 'almondega bolinho de carne', p: 18.2, porcao: 100, medida: '3 unidades', taco: 331 }, /* Carne, bovina, almôndegas, fritas */
  { id: 'figado', nome: 'Fígado acebolado', busca: 'figado bife acebolado', p: 29.9, porcao: 100, medida: '1 bife', taco: 356 }, /* Carne, bovina, fígado, grelhado */
  { id: 'peru', nome: 'Peru assado', busca: 'peru chester ave natal', p: 26.2, porcao: 100, medida: '1 fatia', taco: 425 }, /* Peru, congelado, assado */
  { id: 'quibe', nome: 'Quibe assado', busca: 'quibe kibe', p: 14.6, porcao: 80, medida: '1 pedaço', taco: 440 }, /* Quibe, assado */
  { id: 'presunto', nome: 'Presunto', busca: 'presunto frios peito de peru', p: 14.3, porcao: 30, medida: '2 fatias', taco: 439 }, /* Presunto, sem capa de gordura */
  { id: 'mortadela', nome: 'Mortadela', busca: 'mortadela frios', p: 12, porcao: 30, medida: '2 fatias', taco: 424 }, /* Mortadela */
  { id: 'salmao', nome: 'Salmão grelhado', busca: 'salmao peixe', p: 23.9, porcao: 120, medida: '1 posta', taco: 315 }, /* Salmão, filé, com pele, fresco,  grelhado */
  { id: 'merluza', nome: 'Merluza assada', busca: 'merluza peixe branco assado file', p: 26.6, porcao: 120, medida: '1 filé', taco: 301 }, /* Merluza, filé, assado */
  { id: 'pescada', nome: 'Pescada frita', busca: 'pescada peixe frito tilapia', p: 28.6, porcao: 120, medida: '1 filé', taco: 308 }, /* Pescada, filé, frito */
  { id: 'sardinha', nome: 'Sardinha assada', busca: 'sardinha peixe assada', p: 32.2, porcao: 100, medida: '2 unidades', taco: 318 }, /* Sardinha, assada */
  { id: 'sardinha-lata', nome: 'Sardinha em lata', busca: 'sardinha lata conserva', p: 15.9, porcao: 80, medida: 'meia lata', taco: 319 }, /* Sardinha, conserva em óleo */
  { id: 'atum-lata', nome: 'Atum em lata', busca: 'atum lata conserva', p: 26.2, porcao: 80, medida: 'meia lata', taco: 277 }, /* Atum, conserva em óleo */
  { id: 'bacalhau', nome: 'Bacalhau refogado', busca: 'bacalhau', p: 24, porcao: 120, medida: '1 porção', taco: 280 }, /* Bacalhau, salgado, refogado */
  { id: 'corvina', nome: 'Corvina assada', busca: 'corvina peixe assado', p: 26.8, porcao: 120, medida: '1 posta', taco: 293 }, /* Corvina grande, assada */
  { id: 'manjuba', nome: 'Manjuba frita', busca: 'manjuba peixinho frito', p: 30.1, porcao: 80, medida: '1 porção', taco: 300 }, /* Manjuba, frita */
  { id: 'camarao', nome: 'Camarão cozido', busca: 'camarao frutos do mar', p: 19, porcao: 100, medida: '1 porção', taco: 284 }, /* Camarão, Rio Grande, grande, cozido */
  { id: 'ovo-cozido', nome: 'Ovo cozido', busca: 'ovo ovos cozido pochê', p: 13.3, porcao: 100, medida: '2 unidades', taco: 488 }, /* Ovo, de galinha, inteiro, cozido/10minutos */
  { id: 'ovo-frito', nome: 'Ovo frito ou mexido', busca: 'ovo ovos frito mexido mexidos', p: 15.6, porcao: 100, medida: '2 unidades', taco: 490 }, /* Ovo, de galinha, inteiro, frito */
  { id: 'omelete', nome: 'Omelete de queijo', busca: 'omelete omelette', p: 15.6, porcao: 120, medida: '1 unidade', taco: 484 }, /* Omelete, de queijo */
  { id: 'iogurte', nome: 'Iogurte natural', busca: 'iogurte natural grego', p: 4.1, porcao: 170, medida: '1 pote', taco: 448 }, /* Iogurte, natural */
  { id: 'iogurte-fruta', nome: 'Iogurte de fruta', busca: 'iogurte morango sabor fruta', p: 2.7, porcao: 150, medida: '1 pote', taco: 451 }, /* Iogurte, sabor morango */
  { id: 'queijo-minas', nome: 'Queijo minas frescal', busca: 'queijo minas branco frescal', p: 17.4, porcao: 50, medida: '1 fatia grossa', taco: 461 }, /* Queijo, minas, frescal */
  { id: 'mussarela', nome: 'Mussarela', busca: 'mussarela muçarela queijo', p: 22.6, porcao: 30, medida: '2 fatias', taco: 463 }, /* Queijo, mozarela */
  { id: 'queijo-prato', nome: 'Queijo prato', busca: 'queijo prato', p: 22.7, porcao: 30, medida: '2 fatias', taco: 467 }, /* Queijo, prato */
  { id: 'parmesao', nome: 'Parmesão ralado', busca: 'parmesao queijo ralado', p: 35.6, porcao: 15, medida: '1 colher', taco: 464 }, /* Queijo, parmesão */
  { id: 'ricota', nome: 'Ricota', busca: 'ricota queijo', p: 12.6, porcao: 50, medida: '1 fatia', taco: 469 }, /* Queijo, ricota */
  { id: 'requeijao', nome: 'Requeijão', busca: 'requeijao cream cheese', p: 9.4, porcao: 30, medida: '1 colher', taco: 465 }, /* Queijo, pasteurizado */
  { id: 'leite', nome: 'Leite', busca: 'leite copo integral desnatado', p: 3.2, porcao: 200, medida: '1 copo', fonte: 'TBCA' }, /* TBCA */
  { id: 'achocolatado', nome: 'Leite com achocolatado', busca: 'achocolatado nescau toddy leite', p: 2.1, porcao: 200, medida: '1 copo', taco: 455 }, /* Leite, de vaca, achocolatado */
  { id: 'whey', nome: 'Whey protein', busca: 'whey proteina suplemento shake', p: 80, porcao: 30, medida: '1 scoop', fonte: 'rótulo' }, /* rótulo */
  { id: 'feijao-carioca', nome: 'Feijão carioca', busca: 'feijao carioca caldo', p: 4.8, porcao: 80, medida: '1 concha', taco: 561 }, /* Feijão, carioca, cozido */
  { id: 'feijao-preto', nome: 'Feijão preto', busca: 'feijao preto', p: 4.5, porcao: 80, medida: '1 concha', taco: 567 }, /* Feijão, preto, cozido */
  { id: 'lentilha', nome: 'Lentilha cozida', busca: 'lentilha', p: 6.3, porcao: 80, medida: '1 concha', taco: 577 }, /* Lentilha, cozida */
  { id: 'grao-de-bico', nome: 'Grão-de-bico cozido', busca: 'grao de bico homus', p: 8.8, porcao: 80, medida: '1 concha', fonte: 'TACO 575 ÷ 2,4 de rendimento' }, /* TACO 575 ÷ 2,4 de rendimento */
  { id: 'tofu', nome: 'Tofu', busca: 'tofu soja queijo de soja', p: 6.6, porcao: 100, medida: '1 fatia grossa', taco: 584 }, /* Soja, queijo (tofu) */
  { id: 'feijao-tropeiro', nome: 'Feijão tropeiro', busca: 'tropeiro feijao mineiro', p: 10.2, porcao: 120, medida: '1 porção', taco: 539 }, /* Feijão tropeiro mineiro */
  { id: 'ervilha', nome: 'Ervilha', busca: 'ervilha', p: 7.5, porcao: 60, medida: '3 colheres', taco: 559 }, /* Ervilha, em vagem */
  { id: 'arroz', nome: 'Arroz branco', busca: 'arroz branco', p: 2.5, porcao: 120, medida: '4 colheres', taco: 3 }, /* Arroz, tipo 1, cozido */
  { id: 'arroz-integral', nome: 'Arroz integral', busca: 'arroz integral', p: 2.6, porcao: 120, medida: '4 colheres', taco: 1 }, /* Arroz, integral, cozido */
  { id: 'macarrao', nome: 'Macarrão cozido', busca: 'macarrao massa espaguete penne', p: 4.5, porcao: 150, medida: '1 prato raso', fonte: 'TACO 40 ÷ 2,2 de rendimento' }, /* TACO 40 ÷ 2,2 de rendimento */
  { id: 'macarrao-bolonhesa', nome: 'Macarrão à bolonhesa', busca: 'macarrao bolonhesa molho carne', p: 4.9, porcao: 200, medida: '1 prato', taco: 542 }, /* Macarrão, molho bolognesa */
  { id: 'pao-frances', nome: 'Pão francês', busca: 'pao frances padaria', p: 8, porcao: 50, medida: '1 unidade', taco: 53 }, /* Pão, trigo, francês */
  { id: 'pao-integral', nome: 'Pão integral de forma', busca: 'pao forma integral', p: 9.4, porcao: 50, medida: '2 fatias', taco: 52 }, /* Pão, trigo, forma, integral */
  { id: 'aveia', nome: 'Aveia em flocos', busca: 'aveia flocos mingau', p: 13.9, porcao: 30, medida: '2 colheres', taco: 7 }, /* Aveia, flocos, crua */
  { id: 'tapioca', nome: 'Tapioca', busca: 'tapioca goma', p: 0.1, porcao: 90, medida: '1 unidade', taco: 551 }, /* Tapioca, com manteiga */
  { id: 'cuscuz', nome: 'Cuscuz de milho', busca: 'cuscuz milho', p: 2.2, porcao: 120, medida: '1 pedaço', taco: 533 }, /* Cuscuz, de milho, cozido com sal */
  { id: 'pao-de-queijo', nome: 'Pão de queijo', busca: 'pao de queijo', p: 5.1, porcao: 60, medida: '3 unidades', taco: 140 }, /* Pão, de queijo, assado */
  { id: 'cereal', nome: 'Cereal matinal', busca: 'cereal matinal granola sucrilhos', p: 7.2, porcao: 30, medida: '1 xícara', taco: 25 }, /* Cereal matinal, milho */
  { id: 'arroz-carreteiro', nome: 'Arroz carreteiro', busca: 'carreteiro arroz com carne', p: 10.8, porcao: 200, medida: '1 prato', taco: 526 }, /* Arroz carreteiro */
  { id: 'baiao', nome: 'Baião de dois', busca: 'baiao de dois', p: 6.2, porcao: 200, medida: '1 prato', taco: 527 }, /* Baião de dois, arroz e feijão-de-corda */
  { id: 'pao-sovado', nome: 'Pão doce ou sovado', busca: 'pao sovado doce bisnaguinha', p: 8.4, porcao: 50, medida: '1 unidade', taco: 54 }, /* Pão, trigo, sovado */
  { id: 'pao-aveia', nome: 'Pão de aveia', busca: 'pao aveia forma', p: 12.3, porcao: 50, medida: '2 fatias', taco: 48 }, /* Pão, aveia, forma */
  { id: 'cuscuz-paulista', nome: 'Cuscuz paulista', busca: 'cuscuz paulista', p: 2.6, porcao: 150, medida: '1 pedaço', taco: 534 }, /* Cuscuz, paulista */
  { id: 'estrogonofe', nome: 'Estrogonofe de frango', busca: 'estrogonofe strogonoff frango', p: 17.6, porcao: 150, medida: '1 porção', taco: 538 }, /* Estrogonofe de frango */
  { id: 'bife-a-cavalo', nome: 'Bife à cavalo', busca: 'bife a cavalo', p: 23.7, porcao: 150, medida: '1 porção', taco: 529 }, /* Bife à cavalo, com contra filé */
  { id: 'coxinha', nome: 'Coxinha', busca: 'coxinha salgado', p: 9.6, porcao: 80, medida: '1 unidade', taco: 386 }, /* Coxinha de frango, frita */
  { id: 'legumes', nome: 'Legumes cozidos', busca: 'legumes cozidos vapor mistura', p: 2, porcao: 100, medida: '1 pires', taco: 546 }, /* Salada, de legumes, cozida no vapor */
  { id: 'feijoada', nome: 'Feijoada', busca: 'feijoada', p: 8.7, porcao: 250, medida: '1 prato', taco: 540 }, /* Feijoada */
  { id: 'virado', nome: 'Virado à paulista', busca: 'virado paulista', p: 10.2, porcao: 250, medida: '1 prato', taco: 555 }, /* Virado à paulista */
  { id: 'estrogonofe-carne', nome: 'Estrogonofe de carne', busca: 'estrogonofe strogonoff carne', p: 15, porcao: 150, medida: '1 porção', taco: 537 }, /* Estrogonofe de carne */
  { id: 'yakisoba', nome: 'Yakisoba', busca: 'yakisoba macarrao oriental', p: 7.5, porcao: 250, medida: '1 prato', taco: 556 }, /* Yakisoba */
  { id: 'salpicao', nome: 'Salpicão de frango', busca: 'salpicao', p: 13.9, porcao: 120, medida: '1 porção', taco: 547 }, /* Salpicão, de frango */
  { id: 'dobradinha', nome: 'Dobradinha', busca: 'dobradinha bucho', p: 19.8, porcao: 200, medida: '1 prato', taco: 536 }, /* Dobradinha */
  { id: 'vaca-atolada', nome: 'Vaca atolada', busca: 'vaca atolada costela mandioca', p: 5.1, porcao: 250, medida: '1 prato', taco: 553 }, /* Vaca atolada */
  { id: 'vatapa', nome: 'Vatapá', busca: 'vatapa', p: 6, porcao: 150, medida: '1 porção', taco: 554 }, /* Vatapá */
  { id: 'acaraje', nome: 'Acarajé', busca: 'acaraje', p: 8.3, porcao: 100, medida: '1 unidade', taco: 525 }, /* Acarajé */
  { id: 'manicoba', nome: 'Maniçoba', busca: 'manicoba', p: 10, porcao: 200, medida: '1 prato', taco: 543 }, /* Maniçoba */
  { id: 'barreado', nome: 'Barreado', busca: 'barreado', p: 18.3, porcao: 200, medida: '1 prato', taco: 528 }, /* Barreado */
  { id: 'charuto', nome: 'Charuto de repolho', busca: 'charuto repolho', p: 6.8, porcao: 150, medida: '2 unidades', taco: 532 }, /* Charuto, de repolho */
  { id: 'tabule', nome: 'Tabule', busca: 'tabule', p: 2, porcao: 100, medida: '1 porção', taco: 549 }, /* Tabule */
  { id: 'salada-folhas', nome: 'Salada de folhas', busca: 'salada alface folhas verde rucula', p: 1.3, porcao: 60, medida: '1 prato', taco: 78 }, /* Alface, crespa, crua */
  { id: 'tomate', nome: 'Tomate', busca: 'tomate', p: 0.8, porcao: 60, medida: '1 unidade', taco: 161 }, /* Tomate, salada */
  { id: 'brocolis', nome: 'Brócolis', busca: 'brocolis', p: 2.1, porcao: 80, medida: '1 porção', taco: 100 }, /* Brócolis, cozido */
  { id: 'cenoura', nome: 'Cenoura cozida', busca: 'cenoura', p: 0.8, porcao: 60, medida: '3 colheres', taco: 109 }, /* Cenoura, cozida */
  { id: 'beterraba', nome: 'Beterraba cozida', busca: 'beterraba', p: 1.3, porcao: 60, medida: '3 colheres', taco: 97 }, /* Beterraba, cozida */
  { id: 'couve', nome: 'Couve refogada', busca: 'couve mineira', p: 1.7, porcao: 50, medida: '2 colheres', taco: 116 }, /* Couve, manteiga, refogada */
  { id: 'couve-flor', nome: 'Couve-flor', busca: 'couve flor', p: 1.2, porcao: 80, medida: '1 porção', taco: 118 }, /* Couve-flor, cozida */
  { id: 'espinafre', nome: 'Espinafre refogado', busca: 'espinafre', p: 2.7, porcao: 60, medida: '2 colheres', taco: 120 }, /* Espinafre, Nova Zelândia, refogado */
  { id: 'abobora', nome: 'Abóbora cozida', busca: 'abobora jerimum cabotia', p: 1.4, porcao: 100, medida: '1 porção', taco: 64 }, /* Abóbora, cabotian, cozida */
  { id: 'chuchu', nome: 'Chuchu cozido', busca: 'chuchu', p: 0.4, porcao: 80, medida: '1 porção', taco: 112 }, /* Chuchu, cozido */
  { id: 'vagem', nome: 'Vagem', busca: 'vagem', p: 1.8, porcao: 60, medida: '1 porção', taco: 162 }, /* Vagem, crua */
  { id: 'quiabo', nome: 'Quiabo', busca: 'quiabo', p: 1.9, porcao: 60, medida: '1 porção', taco: 147 }, /* Quiabo, cru */
  { id: 'repolho', nome: 'Repolho', busca: 'repolho', p: 0.9, porcao: 50, medida: '1 pires', taco: 149 }, /* Repolho, branco, cru */
  { id: 'pepino', nome: 'Pepino', busca: 'pepino', p: 0.9, porcao: 50, medida: 'meia unidade', taco: 142 }, /* Pepino, cru */
  { id: 'mandioca', nome: 'Mandioca cozida', busca: 'mandioca aipim macaxeira', p: 0.6, porcao: 100, medida: '1 porção', taco: 129 }, /* Mandioca, cozida */
  { id: 'mandioca-frita', nome: 'Mandioca frita', busca: 'mandioca frita aipim', p: 1.4, porcao: 100, medida: '1 porção', taco: 132 }, /* Mandioca, frita */
  { id: 'batata', nome: 'Batata cozida', busca: 'batata inglesa cozida pure', p: 1.2, porcao: 120, medida: '1 unidade média', taco: 91 }, /* Batata, inglesa, cozida */
  { id: 'batata-frita', nome: 'Batata frita', busca: 'batata frita fritas', p: 5, porcao: 100, medida: '1 porção', taco: 93 }, /* Batata, inglesa, frita */
  { id: 'batata-doce', nome: 'Batata doce', busca: 'batata doce', p: 0.6, porcao: 120, medida: '1 pedaço', taco: 88 }, /* Batata, doce, cozida */
  { id: 'milho', nome: 'Milho verde', busca: 'milho verde lata', p: 3.2, porcao: 80, medida: '3 colheres', taco: 45 }, /* Milho, verde, enlatado, drenado */
  { id: 'farofa', nome: 'Farofa', busca: 'farofa farinha mandioca', p: 2.1, porcao: 30, medida: '2 colheres', taco: 131 }, /* Mandioca, farofa, temperada */
  { id: 'banana', nome: 'Banana', busca: 'banana', p: 1.3, porcao: 90, medida: '1 unidade', taco: 182 }, /* Banana, prata, crua */
  { id: 'maca', nome: 'Maçã', busca: 'maca fruta', p: 0.2, porcao: 130, medida: '1 unidade', taco: 221 }, /* Maçã, Argentina, com casca, crua */
  { id: 'abacate', nome: 'Abacate', busca: 'abacate guacamole', p: 1.2, porcao: 100, medida: 'meia unidade', taco: 163 }, /* Abacate, cru */
  { id: 'abacaxi', nome: 'Abacaxi', busca: 'abacaxi', p: 0.9, porcao: 100, medida: '2 fatias', taco: 164 }, /* Abacaxi, cru */
  { id: 'goiaba', nome: 'Goiaba', busca: 'goiaba', p: 1.1, porcao: 100, medida: '1 unidade', taco: 200 }, /* Goiaba, vermelha, com casca, crua */
  { id: 'laranja', nome: 'Laranja', busca: 'laranja', p: 1, porcao: 130, medida: '1 unidade', taco: 214 }, /* Laranja, pêra, crua */
  { id: 'mamao', nome: 'Mamão', busca: 'mamao papaia formosa', p: 0.8, porcao: 150, medida: '1 fatia', taco: 225 }, /* Mamão, Formosa, cru */
  { id: 'manga', nome: 'Manga', busca: 'manga', p: 0.9, porcao: 150, medida: '1 unidade', taco: 231 }, /* Manga, Tommy Atkins, crua */
  { id: 'melancia', nome: 'Melancia', busca: 'melancia', p: 0.9, porcao: 200, medida: '1 fatia', taco: 235 }, /* Melancia, crua */
  { id: 'morango', nome: 'Morango', busca: 'morango', p: 0.9, porcao: 100, medida: '1 xícara', taco: 239 }, /* Morango, cru */
  { id: 'uva', nome: 'Uva', busca: 'uva', p: 0.7, porcao: 100, medida: '1 cacho pequeno', taco: 256 }, /* Uva, Itália, crua */
  { id: 'castanha-caju', nome: 'Castanha de caju', busca: 'castanha caju', p: 18.5, porcao: 30, medida: '1 punhado', taco: 588 }, /* Castanha-de-caju, torrada, salgada */
  { id: 'castanha-para', nome: 'Castanha do Pará', busca: 'castanha para brasil', p: 14.5, porcao: 20, medida: '3 unidades', taco: 589 }, /* Castanha-do-Brasil, crua */
  { id: 'amendoim', nome: 'Amendoim', busca: 'amendoim', p: 22.5, porcao: 30, medida: '1 punhado', taco: 558 }, /* Amendoim, torrado, salgado */
  { id: 'pasta-amendoim', nome: 'Pasta de amendoim', busca: 'pasta de amendoim peanut', p: 25, porcao: 20, medida: '1 colher', fonte: 'rótulo' }, /* rótulo */
  { id: 'pacoca', nome: 'Paçoca', busca: 'pacoca amendoim doce', p: 16, porcao: 25, medida: '1 unidade', taco: 579 }, /* Paçoca, amendoim */
];

/** Quanto cada tamanho de porção vale sobre a porção normal. */
export const PORCOES: { id: Porcao; label: string; k: number }[] = [
  { id: 'pouca', label: 'Pouca', k: 0.6 },
  { id: 'normal', label: 'Normal', k: 1 },
  { id: 'bastante', label: 'Bastante', k: 1.6 },
];
export type Porcao = 'pouca' | 'normal' | 'bastante';

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

/** Gramas de proteína de um alimento numa porção. Sempre arredondado:
    a precisão que existe aqui não chega na casa decimal. */
export function gramasDe(a: Alimento, porcao: Porcao): number {
  const k = PORCOES.find((x) => x.id === porcao)!.k;
  return Math.round((a.p / 100) * a.porcao * k);
}
