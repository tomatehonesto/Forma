import { ALIMENTOS, type Alimento } from './alimentos';

/* ============================================================
   O QUE A PESSOA NÃO COME

   A pergunta entra no cadastro porque três coisas do app leem a
   resposta: a tabela de alimentos, que passa a mostrar primeiro o que
   serve; os achados da tela de Alimentação, que sugerem o que comer; e o
   Morphi, que conversa sobre isso. Sem leitor, seria mais uma pergunta
   cobrada de graça na porta de entrada.

   E O MOTIVO MAIOR NÃO É FILTRAR LISTA: é que proteína é o eixo deste
   tratamento, e ela é mais difícil para quem não come carne — muito mais
   para quem não come nada de origem animal. Um app que diz "coma um ovo"
   para um vegano não errou de tom, errou de pessoa.

   FILTRAR NÃO É APAGAR

   A tabela mostra primeiro o que cabe na restrição e tem sempre como ver
   tudo. O diário nunca filtra nada: ele existe para registrar o que
   aconteceu, inclusive o dia do casamento em que o vegetariano comeu a
   comida que tinha. Um alimento que não se acha obriga a pessoa a mentir
   ou a deixar buraco — e buraco é justamente o que este app passa o
   tempo todo combatendo.

   O CONSELHO, SIM, OBEDECE. Ali não é registro, é sugestão: sugerir o
   que a pessoa não come é pior do que não sugerir nada.

   ⚠️ CELÍACO E GLÚTEN FICARAM DE FORA, E DE PROPÓSITO

   Seria a terceira restrição mais pedida, e é a única desta lista em que
   errar machuca. "Contém leite" se confere olhando a receita; "sem
   glúten" depende de contaminação cruzada, de molho, de marca, e de
   coisas que uma tabela de composição não registra. Um celíaco que
   confia num filtro errado não fica frustrado, fica doente. Enquanto não
   houver dado de rótulo para sustentar a afirmação, o app não a faz.
   ============================================================ */

/** O que um alimento tem dentro, do ponto de vista de quem restringe. */
export type Ingrediente = 'carne' | 'ave' | 'peixe' | 'ovo' | 'leite';

export type Restricao = {
  id: string;
  titulo: string;
  sub: string;
  /** o que ela tira do prato */
  tira: Ingrediente[];
};

export const RESTRICOES: Restricao[] = [
  { id: 'vegetariano', titulo: 'Vegetariano', sub: 'Sem carne, frango ou peixe. Ovo e laticínio continuam.', tira: ['carne', 'ave', 'peixe'] },
  { id: 'vegano', titulo: 'Vegano', sub: 'Nada de origem animal: carne, peixe, ovo, leite e queijo ficam fora.', tira: ['carne', 'ave', 'peixe', 'ovo', 'leite'] },
  { id: 'sem-lactose', titulo: 'Sem lactose', sub: 'Leite, queijo e derivados ficam fora — por intolerância ou alergia.', tira: ['leite'] },
  { id: 'sem-ovo', titulo: 'Sem ovo', sub: 'Ovo e os pratos que levam ovo ficam fora.', tira: ['ovo'] },
  { id: 'sem-peixe', titulo: 'Sem peixe e frutos do mar', sub: 'Peixe, camarão e frutos do mar ficam fora.', tira: ['peixe'] },
  { id: 'sem-carne-vermelha', titulo: 'Sem carne vermelha', sub: 'Boi e porco ficam fora. Frango e peixe continuam.', tira: ['carne'] },
];

/* O QUE ESTA LISTA É, E O QUE ELA NÃO É.

   Ela é orientação: põe na frente o que cabe no que a pessoa come. Não é
   garantia de segurança alimentar, e a diferença importa — uma
   intolerância cobra desconforto, uma alergia cobra hospital. Não temos
   dado de rótulo, de marca nem de contaminação cruzada, e a tela de
   restrições diz isso em vez de deixar a pessoa deduzir.

/* ============================================================
   DE ONDE SAI O QUE CADA ALIMENTO TEM

   O CORREDOR RESPONDE PELA MAIORIA. Tudo em "Carnes e aves" tem carne,
   tudo em "Peixes e frutos do mar" tem peixe, e assim por diante — são
   49 alimentos etiquetados sem ninguém precisar decidir nada.

   O RESTO É UM POR UM, e está aqui embaixo em vez de espalhado pela
   tabela de composição: ali cada linha é medida de laboratório, e isto é
   julgamento sobre receita. Misturar as duas coisas na mesma linha faria
   parecer que a TACO respondeu por uma afirmação que é minha.

   E ELE JULGA O PRATO COMO ELE COSTUMA VIR. Uma lasanha de carne tem
   carne, queijo e massa com ovo; um estrogonofe tem creme de leite. Quem
   faz diferente em casa não é traído por isso, porque a lista nunca
   esconde nada em definitivo — é por isso que "mostrar tudo" existe.
   ============================================================ */
const POR_CORREDOR: Record<string, Ingrediente[]> = {
  'Carnes e aves': ['carne'],
  'Peixes e frutos do mar': ['peixe'],
  Ovos: ['ovo'],
  'Leite e queijos': ['leite'],
};

const CONTEM: Record<string, Ingrediente[]> = {
  /* aves e exceções dentro dos corredores de origem animal */
  'peito-frango': ['ave'],
  'frango-assado': ['ave'],
  sobrecoxa: ['ave'],
  'frango-milanesa': ['ave', 'ovo'],
  peru: ['ave'],
  coxinha: ['ave', 'leite'],
  linguica: ['carne', 'ave'],
  almondega: ['carne', 'ovo'],
  omelete: ['ovo', 'leite'],
  achocolatado: ['leite'],

  /* suplementos */
  whey: ['leite'],
  'barra-proteina': ['leite'],

  /* pratos prontos */
  'feijao-tropeiro': ['carne', 'ovo'],
  'macarrao-bolonhesa': ['carne'],
  'arroz-carreteiro': ['carne'],
  baiao: ['carne', 'leite'],
  'cuscuz-paulista': ['peixe', 'ovo'],
  estrogonofe: ['ave', 'leite'],
  'bife-a-cavalo': ['carne', 'ovo'],
  feijoada: ['carne'],
  virado: ['carne', 'ovo'],
  'estrogonofe-carne': ['carne', 'leite'],
  yakisoba: ['carne', 'ave'],
  salpicao: ['ave', 'ovo'],
  dobradinha: ['carne'],
  'vaca-atolada': ['carne'],
  vatapa: ['peixe'],
  acaraje: ['peixe'],
  manicoba: ['carne'],
  barreado: ['carne'],
  charuto: ['carne'],
  carbonara: ['carne', 'ovo', 'leite'],
  'macarrao-queijos': ['leite'],
  'lasanha-carne': ['carne', 'leite'],
  'lasanha-frango': ['ave', 'leite'],
  'lasanha-presunto': ['carne', 'leite'],
  nhoque: ['ovo'],
  'parmegiana-frango': ['ave', 'ovo', 'leite'],
  'parmegiana-carne': ['carne', 'ovo', 'leite'],
  'bife-milanesa': ['carne', 'ovo'],
  galinhada: ['ave'],
  'escondidinho-carne': ['carne', 'leite'],
  'escondidinho-carne-seca': ['carne', 'leite'],
  'escondidinho-frango': ['ave', 'leite'],
  'panqueca-carne': ['carne', 'ovo', 'leite'],
  'panqueca-frango': ['ave', 'ovo', 'leite'],
  'torta-frango': ['ave', 'ovo', 'leite'],
  'crepe-carne': ['carne', 'ovo', 'leite'],
  'crepe-frango': ['ave', 'ovo', 'leite'],
  'crepe-queijo': ['ovo', 'leite'],
  'pizza-mussarela': ['leite'],
  'pizza-calabresa': ['carne', 'leite'],
  'pizza-frango': ['ave', 'leite'],
  'pizza-portuguesa': ['carne', 'ovo', 'leite'],
  moqueca: ['peixe'],
  'bobo-camarao': ['peixe'],
  'bacalhau-natas': ['peixe', 'leite'],
  sushi: ['peixe'],
  'risoto-camarao': ['peixe', 'leite'],
  'risoto-frango': ['ave', 'leite'],
  canja: ['ave'],
  'sopa-carne': ['carne'],
  'ramen-carne': ['carne', 'ovo'],
  'temaki-salmao': ['peixe'],
  'poke-salmao': ['peixe'],
  'gyoza-porco': ['carne'],
  'frango-xadrez': ['ave'],
  'arroz-frito': ['ovo'],
  'pad-thai-camarao': ['peixe', 'ovo'],
  bibimbap: ['carne', 'ovo'],
  'taco-carne': ['carne', 'leite'],
  'burrito-frango': ['ave', 'leite'],
  'quesadilla-queijo': ['leite'],
  'chili-carne': ['carne'],
  'shawarma-frango': ['ave'],
  'kebab-carne': ['carne'],
  'souvlaki-frango': ['ave'],
  'tikka-masala': ['ave', 'leite'],
  'paella-frutos-do-mar': ['peixe'],
  'tortilla-espanhola': ['ovo'],
  'quiche-queijo': ['ovo', 'leite'],
  'mac-and-cheese': ['leite'],
  'ceviche-peixe': ['peixe'],

  /* pães, massas e doces */
  'pao-de-queijo': ['leite'],
  'pao-sovado': ['leite', 'ovo'],
  'biscoito-recheado': ['leite'],
  'bolo-chocolate': ['ovo', 'leite'],

  /* lanches */
  chocolate: ['leite'],
  'sanduiche-frango': ['ave'],
  'sanduiche-atum': ['peixe'],
  'sanduiche-peru': ['ave', 'leite'],
  'x-salada': ['carne', 'leite'],
  'misto-quente': ['carne', 'leite'],
  'tapioca-frango': ['ave'],
  'tapioca-queijo': ['leite'],
  esfiha: ['carne'],
  'pastel-carne': ['carne'],
  'pastel-queijo': ['leite'],
  croquete: ['carne', 'ovo', 'leite'],
  'empada-frango': ['ave', 'ovo', 'leite'],
  'wrap-frango': ['ave', 'leite'],

  /* café da manhã */
  'mingau-aveia': ['leite'],
  'vitamina-banana': ['leite'],
  'panqueca-americana': ['ovo', 'leite'],
  waffle: ['ovo', 'leite'],
  crepioca: ['ovo', 'leite'],
  'iogurte-granola': ['leite'],
  'smoothie-proteico': ['leite'],
  'torrada-abacate-ovo': ['ovo'],
  shakshuka: ['ovo'],
  'croissant-presunto-queijo': ['carne', 'leite'],
  'bagel-cream-cheese': ['leite'],
  'sanduiche-ovo': ['ovo'],
};

export function contemDe(a: Alimento): Ingrediente[] {
  return CONTEM[a.id] ?? POR_CORREDOR[a.onde] ?? [];
}

/** O que as restrições escolhidas tiram do prato, somadas. */
export function tiradosPor(ids: string[]): Ingrediente[] {
  const fora = new Set<Ingrediente>();
  for (const id of ids) for (const i of RESTRICOES.find((r) => r.id === id)?.tira ?? []) fora.add(i);
  return [...fora];
}

/** Este alimento cabe nas restrições da pessoa? Sem restrição, tudo cabe. */
export function cabe(a: Alimento, ids: string[]): boolean {
  if (!ids.length) return true;
  const fora = tiradosPor(ids);
  return !contemDe(a).some((i) => fora.includes(i));
}

/* AS FONTES DE PROTEÍNA QUE SOBRAM, para quem dá conselho.

   A lista sai da própria tabela, e não de uma frase escrita à mão para
   cada caso: escrita à mão ela seria mais uma afirmação sem conta atrás;
   assim, ela muda sozinha no dia em que a tabela mudar.

   ORDENADA POR PROTEÍNA A CADA 100 KCAL, que é o eixo do app inteiro —
   o mesmo de prato.ts. Por proteína bruta, a resposta para vegano seria
   "pasta de amendoim e castanha", que é verdade sobre o grama e péssimo
   conselho: num prato que encolheu, o que interessa é o que entrega
   proteína sem gastar o dia. Por este eixo, a resposta vira tofu,
   ervilha e lentilha.

   SÓ COMIDA DE PRATELEIRA, e não prato montado. "Coma uma lasanha de
   frango" não é sugestão de fonte de proteína, é sugestão de almoço. */
const PRATELEIRAS = [
  'Carnes e aves', 'Peixes e frutos do mar', 'Ovos', 'Leite e queijos',
  'Grãos e feijões', 'Verduras e legumes', 'Castanhas e sementes', 'Arroz, massas e pães',
];

export function fontesDeProteina(ids: string[], quantas = 3): string[] {
  return ALIMENTOS()
    .filter((a) => a.p >= 6 && a.kcal && PRATELEIRAS.includes(a.onde) && cabe(a, ids))
    .sort((a, b) => (b.p / (b.kcal as number)) - (a.p / (a.kcal as number)))
    .slice(0, quantas)
    .map((a) => a.nome.toLowerCase());
}
