import { ALIMENTOS, gramasDe, medidaDe, type Alimento } from './alimentos';

/* ============================================================
   O PRATO MONTADO

   Um item do prato vem de um de dois lugares, e o tipo diz de qual:

     { id: 'arroz', qtd: 4 }                  da tabela — a TACO responde
     { nome: '…', base: 22, qtd: 1 }          livre — quem viu a foto responde
     { nome: '…', qtd: 1 }                    anotado, sem conta

   `qtd` é quantas UNIDADES daquele alimento: quatro colheres de arroz,
   um filé de frango, duas fatias de queijo. Antes era um tamanho
   abstrato de porção — pouca, normal, bastante —, que pedia à pessoa
   comparar o prato dela com uma régua que só o app conhecia. Contar
   colheres é uma coisa que ela viu acontecer.

   O terceiro caso existe porque a tabela tem 144 alimentos e o Brasil
   tem mais. O item entra pelo nome e diz que não conta — perder o
   registro inteiro seria pior, e inventar o número seria voltar ao
   começo.
   ============================================================ */

/* OS MOMENTOS DA REFEIÇÃO, cada um pelo que se come nele: a xícara, o
   talher, o sanduíche.

   Menos o jantar, que fica na lua — e não por descuido. Jantar no Brasil
   é quase sempre a mesma comida do almoço, então nenhum desenho de prato
   separa um do outro: a única coisa que distingue o jantar é ser de
   noite. Desenhar uma tigela ali fingiria uma diferença de comida que
   não existe.

   Mora aqui, e não na folha de registro, porque a folha de detalhe
   precisa do mesmo ícone — e duas listas de momentos divergem na semana
   em que alguém acrescentar a ceia numa delas. */
export const MOMENTOS: [string, string][] = [
  ['coffee', 'Café da manhã'],
  ['cutlery', 'Almoço'],
  ['sandwich', 'Lanche'],
  ['moon', 'Jantar'],
];

export const iconeDaRefeicao = (nome: string) =>
  MOMENTOS.find(([, n]) => n === nome)?.[0] ?? 'cutlery';

export type ItemComida = {
  /** Alimento da tabela. */
  id?: string;
  /** Nome livre, quando não há par na tabela. */
  nome?: string;
  /** Proteína de UMA porção, em gramas. Só para item livre contado. */
  base?: number;
  /** Quantas unidades. */
  qtd: number;
};

export type Origem = 'tabela' | 'estimado' | 'sem-conta';

/** De onde sai — ou não sai — o número deste item. */
export function origemDe(it: ItemComida): Origem {
  if (alimentoDe(it.id)) return 'tabela';
  return it.base != null ? 'estimado' : 'sem-conta';
}

/** O alimento de um item, ou null se ele for livre (ou o id sumir). */
export function alimentoDe(id?: string): Alimento | null {
  return (id && ALIMENTOS.find((a) => a.id === id)) || null;
}

export function nomeItem(it: ItemComida): string {
  return alimentoDe(it.id)?.nome ?? it.nome ?? '';
}

/** Quantos, e de quê: "4 colheres", "1 filé", "2 porções". */
export function medidaItem(it: ItemComida): string {
  const a = alimentoDe(it.id);
  if (a) return medidaDe(a, it.qtd);
  return `${it.qtd} ${it.qtd === 1 ? 'porção' : 'porções'}`;
}

/** A procedência do número, quando ela precisa ser dita. Item de tabela
    não diz nada: é o caso normal, e anunciá-lo seria ruído em todas as
    linhas para avisar sobre nenhuma. */
export function ressalvaItem(it: ItemComida): string | null {
  switch (origemDe(it)) {
    case 'estimado': return 'estimado pela foto';
    case 'sem-conta': return 'ainda não entra na conta';
    default: return null;
  }
}

export function gramasItem(it: ItemComida): number {
  const a = alimentoDe(it.id);
  if (a) return gramasDe(a, it.qtd);
  return Math.round((it.base ?? 0) * Math.max(0, it.qtd));
}

export function somaDe(itens: ItemComida[]): number {
  return itens.reduce((s, it) => s + gramasItem(it), 0);
}

/* ============================================================
   O RESTO DO PRATO: ENERGIA, CARBOIDRATO, GORDURA E FIBRA

   A proteína de um item pode vir de três lugares — da tabela, da
   estimativa da foto, ou de lugar nenhum. O resto do rótulo vem de um
   só: a tabela. Quem estimou proteína olhando a foto estimou proteína, e
   nada mais; tirar a caloria dali seria construir um número em cima de
   outro que já era aproximação.

   POR ISSO ESTA SOMA É UM PISO, E A TELA DIZ ISSO. Ela soma o que tem
   rótulo conferido e conta à parte os itens que ficaram de fora, em vez
   de somar zero por eles em silêncio. Um total que engole o que não sabe
   vira meta cumprida por omissão — o contrário do que uma meta de
   energia serve para fazer.

   E quando a tabela traz caloria mas não traz fibra, a fibra daquele
   item fica fora da soma dela e o item continua contando na energia:
   cada nutriente responde pelo que foi medido, e nenhum herda zero de
   uma célula vazia.
   ============================================================ */
export type Nutrientes = { kcal: number; carb: number; gord: number; fibra: number };

/** Quantos GRAMAS DE COMIDA o item tem — o peso do prato, e não o da
    proteína. Só existe para item de tabela: é gUn que dá a régua. */
export function pesoItem(it: ItemComida): number | null {
  const a = alimentoDe(it.id);
  return a ? a.gUn * Math.max(0, it.qtd) : null;
}

export type SomaDoPrato = Nutrientes & {
  /** quantos itens não entraram na conta */
  fora: number;
  /** quantos entraram */
  contados: number;
};

export function nutrientesDe(itens: ItemComida[]): SomaDoPrato {
  const s: SomaDoPrato = { kcal: 0, carb: 0, gord: 0, fibra: 0, fora: 0, contados: 0 };
  for (const it of itens) {
    const a = alimentoDe(it.id);
    const g = pesoItem(it);
    if (!a || g == null || a.kcal == null) { s.fora++; continue; }
    s.contados++;
    s.kcal += (a.kcal / 100) * g;
    if (a.carb != null) s.carb += (a.carb / 100) * g;
    if (a.gord != null) s.gord += (a.gord / 100) * g;
    if (a.fibra != null) s.fibra += (a.fibra / 100) * g;
  }
  return {
    ...s,
    kcal: Math.round(s.kcal),
    carb: Math.round(s.carb),
    gord: Math.round(s.gord),
    fibra: Math.round(s.fibra),
  };
}

/** Itens do prato numa dada origem. */
export function itensDe(itens: ItemComida[], origem: Origem): ItemComida[] {
  return itens.filter((it) => origemDe(it) === origem);
}

/* ============================================================
   O QUE ESTE ALIMENTO FAZ POR QUEM ESTÁ EM TRATAMENTO

   Uma frase por alimento, calculada dos números — não escrita à mão
   para cada um. Duzentas e vinte e quatro frases escritas à mão seriam
   duzentas e vinte e quatro afirmações que ninguém conferiu; estas aqui
   são a leitura de uma conta, e a conta está logo acima na tela.

   O eixo é PROTEÍNA POR CALORIA. Num tratamento de GLP-1 a fome cai e o
   prato encolhe, então a pergunta deixa de ser "quanto eu como" e passa
   a ser "o que cabe no pouco que eu como". Um alimento que entrega 20 g
   de proteína a cada 100 kcal trabalha a favor; um que entrega 2 g
   ocupa o espaço de outro que entregaria mais.

   A fibra entra logo depois porque prisão de ventre é efeito colateral
   conhecido da caneta, e é o segundo assunto de comida numa consulta.

   E quando não há o que dizer, não se diz nada. Sem frase é melhor do
   que "delicioso e nutritivo".
   ============================================================ */
export type Insight = { texto: string; bom: boolean };

export function insightDe(a: Alimento): Insight | null {
  const { p, kcal, fibra } = a;
  /* Proteína a cada 100 kcal. Sem caloria analisada não há razão, e sem
     razão não há frase. */
  const razao = kcal && kcal > 0 ? (p / kcal) * 100 : null;

  if (razao != null && razao >= 15 && p >= 10) {
    return {
      bom: true,
      texto: 'Muita proteína para pouca caloria. É o tipo de comida que o tratamento pede: ela cabe no prato que encolheu e ainda segura a massa magra.',
    };
  }
  if (p >= 15) {
    return {
      bom: true,
      texto: 'Boa fonte de proteína, que é o que segura a massa magra enquanto o peso desce.',
    };
  }
  if (razao != null && razao < 3 && (kcal as number) >= 250) {
    return {
      bom: false,
      texto: 'Caloria alta e pouca proteína. Não é proibido, mas ocupa bastante do dia e devolve pouco do que o tratamento precisa.',
    };
  }
  /* A ressalva vem antes do elogio da fibra. A batata frita tem 8 g de
     fibra, e pela ordem anterior saía daqui elogiada — verdade sobre a
     fibra, e a leitura errada do prato inteiro. */
  if (fibra != null && fibra >= 5) {
    return {
      bom: true,
      texto: 'Bastante fibra. Ajuda com o intestino preso, que é dos efeitos colaterais mais comuns da caneta.',
    };
  }
  if (kcal != null && kcal <= 60 && p < 3) {
    return {
      bom: true,
      texto: 'Quase não pesa no dia. Bom para acompanhar o prato, mas a proteína tem que vir de outro lugar.',
    };
  }
  if (fibra != null && fibra >= 2.5) {
    return {
      bom: true,
      texto: 'Tem fibra, que ajuda com o intestino preso — dos efeitos colaterais mais comuns da caneta.',
    };
  }
  return null;
}

/* DE ONDE VEIO O NÚMERO, dito para gente.

   A tela dizia "Os valores vêm da TACO, linha 78", que é exato e não
   quer dizer nada para quem não sabe o que é TACO. Sigla sem explicação
   é a forma mais rápida de um app parecer que não foi escrito para
   quem está lendo. */
export function origemDoAlimento(a: Alimento): string {
  if (a.taco) {
    return 'Os números vêm da tabela brasileira de composição de alimentos, feita pela Unicamp, que mede em laboratório o que cada comida tem dentro.';
  }
  if (a.fonte && a.fonte.startsWith('soma TACO')) {
    return 'Este é um prato montado: somamos ingrediente por ingrediente pela tabela da Unicamp, numa porção de restaurante. O seu pode vir maior ou menor.';
  }
  return 'A tabela da Unicamp não analisa este, então os números vêm do rótulo de produtos comuns no mercado. De marca para marca eles mudam um pouco.';
}

/** Quantas unidades esse alimento traz ao entrar na lista. */
export function qtdPadrao(id: string): number {
  return alimentoDe(id)?.qtd ?? 1;
}

/* A QUE MOMENTO PERTENCE O QUE SE REGISTRA AGORA.

   A hidratação cria refeições — um copo de leite é bebida e comida —, e
   toda refeição precisa de um momento. Perguntar "isso foi café da manhã
   ou lanche?" a quem só queria anotar um copo de leite é cobrar uma
   decisão pelo trabalho do app; o relógio já sabe, e erra pouco.

   As faixas são as do horário brasileiro de comer, e o que sobra é
   lanche — que é o que um copo de leite às quatro da tarde é mesmo. */
export function momentoDaHora(h: number): string {
  if (h < 10) return 'Café da manhã';
  if (h >= 11 && h < 15) return 'Almoço';
  if (h >= 19 && h < 23) return 'Jantar';
  return 'Lanche';
}

/* ============================================================
   A COMIDA QUE HIDRATA

   Uma sopa é 90% água, e o app mandava a pessoa registrar a sopa na
   alimentação e um copo d'água na hidratação para dizer a mesma coisa
   duas vezes. A referência que gera a meta — 35 ml por quilo — é de
   líquido total, e a EFSA conta 20 a 30% dele vindo da comida. Ignorar o
   prato era a mesma incoerência que ignorar o café.

   O NÚMERO NÃO É INVENTADO, É O QUE SOBRA. Num rótulo por 100 g, o que
   não é proteína, carboidrato, gordura ou cinza é água. É assim que a
   própria tabela de composição chega à coluna de umidade, e sai dos
   números que já estão aqui: leite dá 88%, suco de laranja 91%, sopa de
   legumes 90% — que é o que essas coisas são mesmo.

   A LISTA É QUE É JULGAMENTO, e por isso ela é curta e explícita. Pão
   também tem água, e melancia tem mais do que sopa; contar os dois
   transformaria a meta de hidratação numa contabilidade de tudo o que
   entra pela boca, e a pessoa perderia a única coisa que a tela serve
   para dizer: se ela precisa beber mais hoje. Aqui entra o que se toma
   ou se serve na tigela — o que alguém chamaria de líquido sem pensar.
   ============================================================ */
const LIQUIDOS = new Set([
  'sopa-legumes', 'sopa-feijao', 'sopa-carne', 'canja', 'caldo-verde',
  'leite', 'achocolatado', 'suco-laranja', 'vitamina-banana', 'smoothie-proteico',
  'mingau-aveia',
]);

/** Cinzas (minerais) por 100 g — o resto do rótulo que ninguém escreve. */
const CINZAS = 1;

/** Quantos mililitros de água este item do prato traz. */
export function aguaItem(it: ItemComida): number {
  const a = alimentoDe(it.id);
  const g = pesoItem(it);
  if (!a || g == null || !LIQUIDOS.has(a.id)) return 0;
  if (a.carb == null || a.gord == null) return 0;
  const pct = Math.max(0, 100 - (a.p + a.carb + a.gord + CINZAS));
  return Math.round((pct / 100) * g);
}

export const aguaDe = (itens: ItemComida[]) => itens.reduce((s, it) => s + aguaItem(it), 0);
