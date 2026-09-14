/* Gera src/logic/alimentos.ts a partir da TACO 4ª ed. (NEPA/UNICAMP).

   Cada linha da curadoria é:
     [tacoId, slug, nome, busca, porcao, medida]  -> proteína lida da TACO
     [null,  slug, nome, busca, porcao, medida, p, origem] -> valor de fora

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
  [410, 'peito-frango', 'Peito de frango grelhado', 'frango peito file grelhado file de frango', 120, '1 filé médio'],
  [403, 'frango-assado', 'Frango assado sem pele', 'frango assado cozido', 120, '1 pedaço'],
  [413, 'sobrecoxa', 'Coxa ou sobrecoxa de frango', 'coxa sobrecoxa frango', 100, '1 unidade'],
  [401, 'frango-milanesa', 'Frango à milanesa', 'frango milanesa empanado nuggets', 120, '1 filé'],
  [377, 'patinho', 'Bife de patinho grelhado', 'bife patinho carne vermelha grelhado', 100, '1 bife médio'],
  [344, 'contrafile', 'Contra-filé grelhado', 'contra file bife carne', 100, '1 bife médio'],
  [358, 'file-mignon', 'Filé mignon grelhado', 'file mignon carne', 100, '1 medalhão'],
  [383, 'picanha', 'Picanha grelhada', 'picanha churrasco carne', 100, '2 fatias'],
  [326, 'carne-moida', 'Carne moída refogada', 'carne moida bolonhesa moido', 100, '4 colheres'],
  [374, 'carne-panela', 'Carne de panela', 'carne panela cozida ensopado paleta', 100, '1 porção'],
  [371, 'musculo', 'Músculo cozido', 'musculo cozido sopa', 100, '1 porção'],
  [416, 'hamburguer', 'Hambúrguer', 'hamburguer burguer lanche', 80, '1 unidade'],
  [420, 'linguica', 'Linguiça', 'linguica calabresa churrasco', 80, '1 gomo'],
  [432, 'lombo', 'Lombo de porco assado', 'lombo porco suino', 100, '1 fatia grossa'],
  [435, 'pernil', 'Pernil assado', 'pernil porco suino', 100, '1 fatia'],
  [430, 'costelinha', 'Costelinha de porco', 'costela costelinha porco', 120, '2 costelas'],
  [351, 'coxao-mole', 'Carne cozida (coxão mole)', 'coxao mole carne cozida panela', 100, '1 porção'],
  [331, 'almondega', 'Almôndegas', 'almondega bolinho de carne', 100, '3 unidades'],
  [356, 'figado', 'Fígado acebolado', 'figado bife acebolado', 100, '1 bife'],
  [425, 'peru', 'Peru assado', 'peru chester ave natal', 100, '1 fatia'],
  [440, 'quibe', 'Quibe assado', 'quibe kibe', 80, '1 pedaço'],
  [439, 'presunto', 'Presunto', 'presunto frios peito de peru', 30, '2 fatias'],
  [424, 'mortadela', 'Mortadela', 'mortadela frios', 30, '2 fatias'],

  /* --- peixes e frutos do mar --------------------------------------- */
  [315, 'salmao', 'Salmão grelhado', 'salmao peixe', 120, '1 posta'],
  [301, 'merluza', 'Merluza assada', 'merluza peixe branco assado file', 120, '1 filé'],
  [308, 'pescada', 'Pescada frita', 'pescada peixe frito tilapia', 120, '1 filé'],
  [318, 'sardinha', 'Sardinha assada', 'sardinha peixe assada', 100, '2 unidades'],
  [319, 'sardinha-lata', 'Sardinha em lata', 'sardinha lata conserva', 80, 'meia lata'],
  [277, 'atum-lata', 'Atum em lata', 'atum lata conserva', 80, 'meia lata'],
  [280, 'bacalhau', 'Bacalhau refogado', 'bacalhau', 120, '1 porção'],
  [293, 'corvina', 'Corvina assada', 'corvina peixe assado', 120, '1 posta'],
  [300, 'manjuba', 'Manjuba frita', 'manjuba peixinho frito', 80, '1 porção'],
  [284, 'camarao', 'Camarão cozido', 'camarao frutos do mar', 100, '1 porção'],

  /* --- ovos ---------------------------------------------------------- */
  [488, 'ovo-cozido', 'Ovo cozido', 'ovo ovos cozido pochê', 100, '2 unidades'],
  [490, 'ovo-frito', 'Ovo frito ou mexido', 'ovo ovos frito mexido mexidos', 100, '2 unidades'],
  [484, 'omelete', 'Omelete de queijo', 'omelete omelette', 120, '1 unidade'],

  /* --- leite e derivados --------------------------------------------- */
  [448, 'iogurte', 'Iogurte natural', 'iogurte natural grego', 170, '1 pote'],
  [451, 'iogurte-fruta', 'Iogurte de fruta', 'iogurte morango sabor fruta', 150, '1 pote'],
  [461, 'queijo-minas', 'Queijo minas frescal', 'queijo minas branco frescal', 50, '1 fatia grossa'],
  [463, 'mussarela', 'Mussarela', 'mussarela muçarela queijo', 30, '2 fatias'],
  [467, 'queijo-prato', 'Queijo prato', 'queijo prato', 30, '2 fatias'],
  [464, 'parmesao', 'Parmesão ralado', 'parmesao queijo ralado', 15, '1 colher'],
  [469, 'ricota', 'Ricota', 'ricota queijo', 50, '1 fatia'],
  [465, 'requeijao', 'Requeijão', 'requeijao cream cheese', 30, '1 colher'],
  /* A TACO marca o leite líquido como não analisado (*). O valor vem da
     TBCA/FCF-USP para leite de vaca integral UHT. */
  [null, 'leite', 'Leite', 'leite copo integral desnatado', 200, '1 copo', 3.2, 'TBCA'],
  /* Suplemento: não existe tabela de composição para isso, o número é o
     do rótulo típico de whey concentrado. */
  [455, 'achocolatado', 'Leite com achocolatado', 'achocolatado nescau toddy leite', 200, '1 copo'],
  [null, 'whey', 'Whey protein', 'whey proteina suplemento shake', 30, '1 scoop', 80, 'rótulo'],

  /* --- leguminosas ---------------------------------------------------- */
  [561, 'feijao-carioca', 'Feijão carioca', 'feijao carioca caldo', 80, '1 concha'],
  [567, 'feijao-preto', 'Feijão preto', 'feijao preto', 80, '1 concha'],
  [577, 'lentilha', 'Lentilha cozida', 'lentilha', 80, '1 concha'],
  /* Cozidos que a TACO só traz crus. O fator é o rendimento de cocção
     (quanto o grão pesa depois de hidratado), e está escrito aqui para
     que a conta possa ser conferida. */
  [null, 'grao-de-bico', 'Grão-de-bico cozido', 'grao de bico homus', 80, '1 concha', +(21.2 / 2.4).toFixed(1), 'TACO 575 ÷ 2,4 de rendimento'],
  [584, 'tofu', 'Tofu', 'tofu soja queijo de soja', 100, '1 fatia grossa'],
  [539, 'feijao-tropeiro', 'Feijão tropeiro', 'tropeiro feijao mineiro', 120, '1 porção'],
  [559, 'ervilha', 'Ervilha', 'ervilha', 60, '3 colheres'],

  /* --- cereais e acompanhamentos -------------------------------------- */
  [3, 'arroz', 'Arroz branco', 'arroz branco', 120, '4 colheres'],
  [1, 'arroz-integral', 'Arroz integral', 'arroz integral', 120, '4 colheres'],
  [null, 'macarrao', 'Macarrão cozido', 'macarrao massa espaguete penne', 150, '1 prato raso', +(10.0 / 2.2).toFixed(1), 'TACO 40 ÷ 2,2 de rendimento'],
  [542, 'macarrao-bolonhesa', 'Macarrão à bolonhesa', 'macarrao bolonhesa molho carne', 200, '1 prato'],
  [53, 'pao-frances', 'Pão francês', 'pao frances padaria', 50, '1 unidade'],
  [52, 'pao-integral', 'Pão integral de forma', 'pao forma integral', 50, '2 fatias'],
  [7, 'aveia', 'Aveia em flocos', 'aveia flocos mingau', 30, '2 colheres'],
  [551, 'tapioca', 'Tapioca', 'tapioca goma', 90, '1 unidade'],
  [533, 'cuscuz', 'Cuscuz de milho', 'cuscuz milho', 120, '1 pedaço'],
  [140, 'pao-de-queijo', 'Pão de queijo', 'pao de queijo', 60, '3 unidades'],
  [25, 'cereal', 'Cereal matinal', 'cereal matinal granola sucrilhos', 30, '1 xícara'],
  [526, 'arroz-carreteiro', 'Arroz carreteiro', 'carreteiro arroz com carne', 200, '1 prato'],
  [527, 'baiao', 'Baião de dois', 'baiao de dois', 200, '1 prato'],
  [54, 'pao-sovado', 'Pão doce ou sovado', 'pao sovado doce bisnaguinha', 50, '1 unidade'],
  [48, 'pao-aveia', 'Pão de aveia', 'pao aveia forma', 50, '2 fatias'],
  [534, 'cuscuz-paulista', 'Cuscuz paulista', 'cuscuz paulista', 150, '1 pedaço'],

  /* --- pratos prontos -------------------------------------------------- */
  [538, 'estrogonofe', 'Estrogonofe de frango', 'estrogonofe strogonoff frango', 150, '1 porção'],
  [529, 'bife-a-cavalo', 'Bife à cavalo', 'bife a cavalo', 150, '1 porção'],
  [386, 'coxinha', 'Coxinha', 'coxinha salgado', 80, '1 unidade'],
  [546, 'legumes', 'Legumes cozidos', 'legumes cozidos vapor mistura', 100, '1 pires'],
  [540, 'feijoada', 'Feijoada', 'feijoada', 250, '1 prato'],
  [555, 'virado', 'Virado à paulista', 'virado paulista', 250, '1 prato'],
  [537, 'estrogonofe-carne', 'Estrogonofe de carne', 'estrogonofe strogonoff carne', 150, '1 porção'],
  [556, 'yakisoba', 'Yakisoba', 'yakisoba macarrao oriental', 250, '1 prato'],
  [547, 'salpicao', 'Salpicão de frango', 'salpicao', 120, '1 porção'],
  [536, 'dobradinha', 'Dobradinha', 'dobradinha bucho', 200, '1 prato'],
  [553, 'vaca-atolada', 'Vaca atolada', 'vaca atolada costela mandioca', 250, '1 prato'],
  [554, 'vatapa', 'Vatapá', 'vatapa', 150, '1 porção'],
  [525, 'acaraje', 'Acarajé', 'acaraje', 100, '1 unidade'],
  [543, 'manicoba', 'Maniçoba', 'manicoba', 200, '1 prato'],
  [528, 'barreado', 'Barreado', 'barreado', 200, '1 prato'],
  [532, 'charuto', 'Charuto de repolho', 'charuto repolho', 150, '2 unidades'],
  [549, 'tabule', 'Tabule', 'tabule', 100, '1 porção'],

  /* --- verduras, frutas e o resto do prato ------------------------------ */
  [78, 'salada-folhas', 'Salada de folhas', 'salada alface folhas verde rucula', 60, '1 prato'],
  [161, 'tomate', 'Tomate', 'tomate', 60, '1 unidade'],
  [100, 'brocolis', 'Brócolis', 'brocolis', 80, '1 porção'],
  [109, 'cenoura', 'Cenoura cozida', 'cenoura', 60, '3 colheres'],
  [97, 'beterraba', 'Beterraba cozida', 'beterraba', 60, '3 colheres'],
  [116, 'couve', 'Couve refogada', 'couve mineira', 50, '2 colheres'],
  [118, 'couve-flor', 'Couve-flor', 'couve flor', 80, '1 porção'],
  [120, 'espinafre', 'Espinafre refogado', 'espinafre', 60, '2 colheres'],
  [64, 'abobora', 'Abóbora cozida', 'abobora jerimum cabotia', 100, '1 porção'],
  [112, 'chuchu', 'Chuchu cozido', 'chuchu', 80, '1 porção'],
  [162, 'vagem', 'Vagem', 'vagem', 60, '1 porção'],
  [147, 'quiabo', 'Quiabo', 'quiabo', 60, '1 porção'],
  [149, 'repolho', 'Repolho', 'repolho', 50, '1 pires'],
  [142, 'pepino', 'Pepino', 'pepino', 50, 'meia unidade'],
  [129, 'mandioca', 'Mandioca cozida', 'mandioca aipim macaxeira', 100, '1 porção'],
  [132, 'mandioca-frita', 'Mandioca frita', 'mandioca frita aipim', 100, '1 porção'],
  [91, 'batata', 'Batata cozida', 'batata inglesa cozida pure', 120, '1 unidade média'],
  [93, 'batata-frita', 'Batata frita', 'batata frita fritas', 100, '1 porção'],
  [88, 'batata-doce', 'Batata doce', 'batata doce', 120, '1 pedaço'],
  [45, 'milho', 'Milho verde', 'milho verde lata', 80, '3 colheres'],
  [131, 'farofa', 'Farofa', 'farofa farinha mandioca', 30, '2 colheres'],
  [182, 'banana', 'Banana', 'banana', 90, '1 unidade'],
  [221, 'maca', 'Maçã', 'maca fruta', 130, '1 unidade'],
  [163, 'abacate', 'Abacate', 'abacate guacamole', 100, 'meia unidade'],
  [164, 'abacaxi', 'Abacaxi', 'abacaxi', 100, '2 fatias'],
  [200, 'goiaba', 'Goiaba', 'goiaba', 100, '1 unidade'],
  [214, 'laranja', 'Laranja', 'laranja', 130, '1 unidade'],
  [225, 'mamao', 'Mamão', 'mamao papaia formosa', 150, '1 fatia'],
  [231, 'manga', 'Manga', 'manga', 150, '1 unidade'],
  [235, 'melancia', 'Melancia', 'melancia', 200, '1 fatia'],
  [239, 'morango', 'Morango', 'morango', 100, '1 xícara'],
  [256, 'uva', 'Uva', 'uva', 100, '1 cacho pequeno'],

  /* --- nozes e sementes -------------------------------------------------- */
  [588, 'castanha-caju', 'Castanha de caju', 'castanha caju', 30, '1 punhado'],
  [589, 'castanha-para', 'Castanha do Pará', 'castanha para brasil', 20, '3 unidades'],
  [558, 'amendoim', 'Amendoim', 'amendoim', 30, '1 punhado'],
  [null, 'pasta-amendoim', 'Pasta de amendoim', 'pasta de amendoim peanut', 20, '1 colher', 25, 'rótulo'],
  [579, 'pacoca', 'Paçoca', 'pacoca amendoim doce', 25, '1 unidade'],
];

const porId = new Map(TACO.map((x) => [x.id, x]));
const erros = [];
const linhas = L.map((l) => {
  const [id, slug, nome, busca, porcao, medida, pFora, origem] = l;
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
    `porcao: ${porcao}`,
    `medida: '${medida}'`,
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
  /** Linha da TACO de onde \`p\` saiu. */
  taco?: number;
  /** Quando não é da TACO, de onde é. */
  fonte?: string;
};

export const ALIMENTOS: Alimento[] = [
${linhas.join('\n')}
];

/** Quanto cada tamanho de porção vale sobre a porção normal. */
export const PORCOES: { id: Porcao; label: string; k: number }[] = [
  { id: 'pouca', label: 'Pouca', k: 0.6 },
  { id: 'normal', label: 'Normal', k: 1 },
  { id: 'bastante', label: 'Bastante', k: 1.6 },
];
export type Porcao = 'pouca' | 'normal' | 'bastante';

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

/** Gramas de proteína de um alimento numa porção. Sempre arredondado:
    a precisão que existe aqui não chega na casa decimal. */
export function gramasDe(a: Alimento, porcao: Porcao): number {
  const k = PORCOES.find((x) => x.id === porcao)!.k;
  return Math.round((a.p / 100) * a.porcao * k);
}
`;

fs.writeFileSync(process.argv[2], cab);

/* A MESMA lista, em JSON, para o servidor que lê a foto.

   Ele precisa dela no prompt: sem a lista, o modelo devolve nomes soltos
   e nada casa com a tabela do app — todo item viraria "estimado pela
   foto", justamente o que se quer evitar. E precisa ser a mesma lista,
   gerada na mesma passada, senão um id existe de um lado e não do outro.

   Só o que o prompt usa: id, nome e a medida da porção normal. */
const paraServidor = L.map((l) => {
  const [id, slug, nome, busca, porcao, medida] = l;
  return { id: slug, nome, medida };
});
fs.writeFileSync('servidor/alimentos.json', JSON.stringify(paraServidor) + '\n');

console.log('alimentos: ' + linhas.length);
