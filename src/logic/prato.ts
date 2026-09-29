import { ALIMENTOS, gramasDe, medidaDe, type Alimento } from './alimentos';
import { T } from '../textos';

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
/* ⚠️ É FUNÇÃO, porque lê o catálogo. Ver src/textos/README. */
export const MOMENTOS = (): [string, string][] => {
  const t = T.alimentacao.prato;
  return [
    ['coffee', t.cafeDaManha],
    ['cutlery', t.almoco],
    ['sandwich', t.lanche],
    ['moon', t.jantar],
  ];
};

export const iconeDaRefeicao = (nome: string) =>
  MOMENTOS().find(([, n]) => n === nome)?.[0] ?? 'cutlery';

/* ============================================================
   O RÓTULO GRAVADO COM O ITEM

   ⚠️⚠️ O REGISTRO GUARDAVA SÓ O ID, e os números eram buscados na tabela
   toda vez que alguém olhava. Isso amarrava o passado à tabela de hoje:
   no dia em que um alimento saísse da lista — ou mudasse de número —,
   as calorias da terça passada mudariam junto, ou sumiriam, sem ninguém
   ter tocado na terça.

   Agora o item leva uma cópia do rótulo do momento em que foi
   registrado. O que a pessoa comeu fica com os números com que foi
   registrado; a tabela continua sendo de onde eles saem da primeira vez.

   O NOME E A MEDIDA CONTINUAM VINDO DA TABELA, quando o alimento ainda
   está lá, e é de propósito: são texto, e a tabela os escreve no idioma
   de agora. O rótulo gravado só fala por eles quando o alimento sumiu.
   ============================================================ */
export type Rotulo = {
  nome: string;
  un: string;
  unp: string;
  gUn: number | null;
  p: number;
  kcal: number | null;
  carb: number | null;
  gord: number | null;
  fibra: number | null;
  onde: string;
  porUnidade?: true;
  /** conta como líquido na hidratação — ver LIQUIDOS */
  liquido?: true;
};

export type ItemComida = {
  /** Alimento da tabela. */
  id?: string;
  /** Nome livre, quando não há par na tabela. */
  nome?: string;
  /** Proteína de UMA porção, em gramas. Só para item livre contado. */
  base?: number;
  /** Quantas unidades. */
  qtd: number;
  /** Os números do alimento no momento do registro. */
  rotulo?: Rotulo;
  /** O rótulo não veio de tabela: foi estimado pelo nome digitado ou
      pela foto — ver logic/estimativa. A tela diz isso ao lado do item. */
  estimado?: 'nome' | 'foto';
};

export type Origem = 'tabela' | 'estimado' | 'sem-conta';

/** De onde sai — ou não sai — o número deste item. */
export function origemDe(it: ItemComida): Origem {
  if (it.estimado) return 'estimado';
  if (alimentoDoItem(it)) return 'tabela';
  return it.base != null ? 'estimado' : 'sem-conta';
}

/* ⚠️ UM MAPA, E NÃO UM `find`. A migração que grava o rótulo passa por
   todas as refeições do diário, e com a lista americana cada `find`
   percorria 4.666 alimentos. O mapa se refaz quando a lista muda — a
   lista segue o país, e o país pode mudar. */
let porId: { lista: Alimento[]; mapa: Map<string, Alimento> } | null = null;

/** O alimento da TABELA, ou null se ele for livre (ou o id sumir). */
export function alimentoDe(id?: string): Alimento | null {
  if (!id) return null;
  const lista = ALIMENTOS();
  if (!porId || porId.lista !== lista) porId = { lista, mapa: new Map(lista.map((a) => [a.id, a])) };
  return porId.mapa.get(id) ?? null;
}

/** O alimento com que o item faz conta: o rótulo gravado nele, e a
    tabela só para o registro antigo, de antes do rótulo. */
export function alimentoDoItem(it: ItemComida): Alimento | null {
  const r = it.rotulo;
  if (r) return { id: it.id ?? '', busca: '', qtd: 1, ...r };
  return alimentoDe(it.id);
}

const rotuloDe = (a: Alimento): Rotulo => ({
  nome: a.nome, un: a.un, unp: a.unp, gUn: a.gUn,
  p: a.p, kcal: a.kcal, carb: a.carb, gord: a.gord, fibra: a.fibra, onde: a.onde,
  ...(a.porUnidade ? { porUnidade: true as const } : {}),
  ...(LIQUIDOS.has(a.id) ? { liquido: true as const } : {}),
});

/** O item com o rótulo da tabela gravado nele. Quem já tem rótulo fica
    como está: o número de um registro é o do dia em que foi feito. */
export function comRotulo(it: ItemComida): ItemComida {
  if (it.rotulo || !it.id) return it;
  const a = alimentoDe(it.id);
  return a ? { ...it, rotulo: rotuloDe(a) } : it;
}

export function nomeItem(it: ItemComida): string {
  return alimentoDe(it.id)?.nome ?? it.rotulo?.nome ?? it.nome ?? '';
}

/** Quantos, e de quê: "4 colheres", "1 filé", "2 porções". */
export function medidaItem(it: ItemComida): string {
  const a = alimentoDe(it.id) ?? alimentoDoItem(it);
  if (a) return medidaDe(a, it.qtd);
  return T.alimentacao.prato.porcoes(it.qtd);
}

/** A procedência do número, quando ela precisa ser dita. Item de tabela
    não diz nada: é o caso normal, e anunciá-lo seria ruído em todas as
    linhas para avisar sobre nenhuma. */
export function ressalvaItem(it: ItemComida): string | null {
  switch (origemDe(it)) {
    case 'estimado': return it.estimado === 'nome' ? T.alimentacao.prato.estimadoPeloNome : T.alimentacao.prato.estimado;
    case 'sem-conta': return T.alimentacao.prato.semConta;
    default: return null;
  }
}

export function gramasItem(it: ItemComida): number {
  const a = alimentoDoItem(it);
  if (a) return gramasDe(a, it.qtd);
  return Math.round((it.base ?? 0) * Math.max(0, it.qtd));
}

export function somaDe(itens: ItemComida[]): number {
  return itens.reduce((s, it) => s + gramasItem(it), 0);
}

/* ============================================================
   O RESTO DO PRATO: ENERGIA, CARBOIDRATO, GORDURA E FIBRA

   O rótulo de um item vem da tabela, de uma estimativa — pelo nome ou
   pela foto, que devolvem o rótulo inteiro de uma porção — ou de lugar
   nenhum. O item antigo da foto, de quando ela só devolvia a proteína,
   responde por proteína e nada mais: tirar a caloria dali seria
   construir um número em cima de outro que já era aproximação.

   ⚠️ A ESTIMATIVA ENTRA NA SOMA, E A SOMA DIZ ISSO. `estimados` conta
   quantos itens contados vieram de estimativa, e a tela da alimentação
   diz de quantas refeições o número é estimado — somar calado seria
   apresentar um palpite com a cara de um rótulo conferido.

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
    proteína. Só existe para item de tabela: é gUn que dá a régua.

    ⚠️ E É `null` TAMBÉM QUANDO O PESO NÃO FOI PUBLICADO. O rótulo de uma
    rede de fast food traz o valor da porção sem dizer quanto ela pesa, e
    devolver zero aqui faria o prato somar um item de peso nenhum. Quem
    pergunta o peso tem de saber lidar com não saber. */
export function pesoItem(it: ItemComida): number | null {
  const a = alimentoDoItem(it);
  return a && a.gUn != null ? a.gUn * Math.max(0, it.qtd) : null;
}

export type SomaDoPrato = Nutrientes & {
  /** quantos itens não entraram na conta */
  fora: number;
  /** quantos entraram */
  contados: number;
  /** dos que entraram, quantos vieram de estimativa */
  estimados: number;
};

export function nutrientesDe(itens: ItemComida[]): SomaDoPrato {
  const s: SomaDoPrato = { kcal: 0, carb: 0, gord: 0, fibra: 0, fora: 0, contados: 0, estimados: 0 };
  for (const it of itens) {
    const a = alimentoDoItem(it);
    const g = pesoItem(it);
    if (!a || g == null || a.kcal == null) { s.fora++; continue; }
    s.contados++;
    if (it.estimado) s.estimados++;
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
      texto: T.alimentacao.prato.muitaProteinaPoucaCaloria,
    };
  }
  if (p >= 15) {
    return {
      bom: true,
      texto: T.alimentacao.prato.boaFonte,
    };
  }
  if (razao != null && razao < 3 && (kcal as number) >= 250) {
    return {
      bom: false,
      texto: T.alimentacao.prato.caloriaAlta,
    };
  }
  /* A ressalva vem antes do elogio da fibra. A batata frita tem 8 g de
     fibra, e pela ordem anterior saía daqui elogiada — verdade sobre a
     fibra, e a leitura errada do prato inteiro. */
  if (fibra != null && fibra >= 5) {
    return {
      bom: true,
      texto: T.alimentacao.prato.bastanteFibra,
    };
  }
  if (kcal != null && kcal <= 60 && p < 3) {
    return {
      bom: true,
      texto: T.alimentacao.prato.quaseNaoPesa,
    };
  }
  if (fibra != null && fibra >= 2.5) {
    return {
      bom: true,
      texto: T.alimentacao.prato.temFibra,
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
  if (a.taco) return T.alimentacao.origem.taco;
  if (a.usda) return T.alimentacao.origem.usda;
  /* O prato somado da lista brasileira só leva a TACO; o que entrou com a
     lista de todos os países mistura a TACO e o USDA, e diz isso. As
     frases das redes de fast food saíram com elas. */
  if (a.fonte?.startsWith('soma TACO')) return T.alimentacao.origem.somaTaco;
  if (a.fonte?.startsWith('soma')) return T.alimentacao.origem.soma;
  return T.alimentacao.origem.rotulo;
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
/* ⚠️⚠️ OS QUATRO NOMES VÊM DE ONDE MOMENTOS OS LÊ, e não de uma segunda
   cópia aqui embaixo. É a mesma string que fica GRAVADA na refeição, e
   duas cópias divergindo num acento fariam `iconeDaRefeicao` não achar o
   momento que ela mesma acabou de gravar.

   As faixas de hora ficam, e são as de comer no Brasil — mas elas não
   são texto: quem almoça ao meio-dia almoça ao meio-dia em qualquer
   idioma, e o que sobra continua sendo lanche. */
export function momentoDaHora(h: number): string {
  const t = T.alimentacao.prato;
  if (h < 10) return t.cafeDaManha;
  if (h >= 11 && h < 15) return t.almoco;
  if (h >= 19 && h < 23) return t.jantar;
  return t.lanche;
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
  const a = alimentoDoItem(it);
  const g = pesoItem(it);
  const liquido = it.rotulo ? it.rotulo.liquido === true : !!a && LIQUIDOS.has(a.id);
  if (!a || g == null || !liquido) return 0;
  if (a.carb == null || a.gord == null) return 0;
  const pct = Math.max(0, 100 - (a.p + a.carb + a.gord + CINZAS));
  return Math.round((pct / 100) * g);
}

export const aguaDe = (itens: ItemComida[]) => itens.reduce((s, it) => s + aguaItem(it), 0);
