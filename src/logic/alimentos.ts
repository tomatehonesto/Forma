/* ============================================================
   OS ALIMENTOS — a lista com que o aplicativo conta

   ⚠️⚠️ ERAM DUAS BASES POR MERCADO, E VIROU UMA LISTA SÓ. A TACO no
   Brasil, a FNDDS americana nos Estados Unidos — e quem estava na
   França, na Alemanha ou no México caía na brasileira, com os nomes em
   português. Agora a lista é uma, gerada em logic/comidas a partir de
   scripts/dados/, com o nome de cada comida nos seis idiomas; este
   arquivo a lê no idioma de agora e responde às telas.

   E ELA TEM DUAS PORTAS:
     o DICIONÁRIO (`dicionario()`) é o que se explora na tela de
       alimentos — comida como se come, o que cada uma traz;
     o REGISTRO (`ALIMENTOS()`) é o dicionário mais os pratos prontos:
       ninguém procura os benefícios de uma carbonara, mas quem comeu
       quer registrá-la e saber o que ela somou.

   O fast food saiu, e de propósito: o registro fica com prato de
   verdade, e o que a lista não tem é estimado pelo nome (ver
   logic/estimativa).
   ============================================================ */

import { COMIDAS, UNIDADES, LOCAIS_DAS_COMIDAS, type ComidaGerada } from './comidas';
import { localAtual, type Local } from './local';
import type { Ingrediente } from './restricoes';

export type Alimento = {
  id: string;
  nome: string;
  /** Termos sem acento para a busca encontrar o que a pessoa digita. */
  busca: string;
  /* ⚠️ PROTEÍNA POR 100 g — OU POR UNIDADE, quando `porUnidade` é verdade.
     Ver o campo lá embaixo antes de fazer conta com este número. */
  p: number;
  /* O RESTO DO RÓTULO, por 100 g.

     Um `null` ali quer dizer NÃO ANALISADO, e não zero: a TACO deixa
     a célula vazia quando o nutriente não foi medido naquele alimento, e
     a tela mostra "—". Dizer zero ali seria afirmar uma ausência que
     ninguém verificou. */
  kcal: number | null;
  carb: number | null;
  gord: number | null;
  fibra: number | null;
  /** Gramas de UMA unidade: um filé, uma colher, uma concha. */
  /* ⚠️ GRAMAS DE UMA UNIDADE, e `null` quando a fonte NÃO PUBLICA o peso.

     A TACO e a FNDDS descrevem 100 g, e a unidade caseira é o que permite
     perguntar "quantas colheres?" em vez de "quantos gramas?". Já a rede
     de fast food publica o contrário: o valor da porção inteira, sem
     dizer quanto ela pesa — restaurante é isento da RDC 429, que obriga
     o peso em alimento embalado.

     Com `null` aqui, `porUnidade` é verdade e os valores JÁ SÃO da unidade. */
  gUn: number | null;

  /* ⚠️⚠️ OS VALORES SÃO DA UNIDADE, E NÃO DE 100 g.

     Isto não é uma variação de formato: é outra base de medida. `p: 26` num
     alimento comum quer dizer 26 g de proteína em 100 g; aqui quer dizer
     26 g no sanduíche inteiro. Toda conta que divide por 100 tem de
     perguntar isto antes.

     Existe porque a fonte é outra: a rede publica o rótulo do produto
     dela, e não uma tabela de composição. Inventar um peso para converter
     seria fabricar o dado que falta. */
  porUnidade?: boolean;
  /** Quantas unidades vêm marcadas ao escolher o alimento. */
  qtd: number;
  /** A unidade no singular, e no plural. */
  un: string;
  unp: string;
  /** Em que corredor do mercado ele estaria — filtro e foto. */
  onde: string;
  /* O nutriente em que 100 g deste alimento mais se destacam, quando
     algum passa de 15% da IDR — o mesmo corte que a regra brasileira de
     rotulagem usa para autorizar a frase "fonte de". Sem destaque, a
     tela não inventa frase nenhuma. */
  destaque?: { nome: string; valor: number; un: string; pct: number };
  /** Linha da TACO de onde os números saíram. */
  taco?: number;
  /** Número NDB da SR Legacy (USDA) de onde os números saíram. */
  usda?: number;
  /** Quando não é de tabela, de onde é: "rótulo", ou a receita somada. */
  fonte?: string;
  /** Prato pronto: entra no registro, e fica fora do dicionário. */
  prato?: true;
  /** Fora das duas listas, e existe por dentro — ver scripts/dados/consolidacao. */
  oculto?: true;
  /** De que preparo são os números, quando a tabela diz. */
  preparo?: 'cru' | 'cozido' | 'grelhado' | 'assado' | 'frito' | 'refogado';
  /** As comidas da lista que o prato somado leva — ver logic/restricoes. */
  receita?: string[];
  /** O que ele tem, para as restrições, quando o corredor não diz. */
  contem?: Ingrediente[];
};

/* ============================================================
   A LISTA NO IDIOMA DE AGORA

   Montada na primeira vez que alguém pergunta, e de novo quando o
   idioma muda. O nome e a medida mudam de idioma; o número não muda.
   ============================================================ */
const semAcento = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

let lista: { local: Local; todos: Alimento[]; registro: Alimento[]; dicionario: Alimento[] } | null = null;

function montar(c: ComidaGerada, i: number): Alimento {
  const [un, unp] = UNIDADES[c.un]?.[i] ?? [c.un, c.un];
  const { n, un: _chave, ...resto } = c;
  void _chave;
  return { ...resto, nome: n[i], un, unp };
}

function listas() {
  const local = localAtual();
  if (!lista || lista.local !== local) {
    const i = Math.max(0, (LOCAIS_DAS_COMIDAS as readonly string[]).indexOf(local));
    const todos = COMIDAS.map((c) => montar(c, i));
    const registro = todos.filter((a) => !a.oculto);
    lista = { local, todos, registro, dicionario: registro.filter((a) => !a.prato) };
  }
  return lista;
}

/** A lista do REGISTRO: o dicionário e os pratos prontos. */
export function ALIMENTOS(): Alimento[] {
  return listas().registro;
}

/** TODAS as comidas, inclusive as que saíram das listas: é por aqui que
    um id antigo — de uma receita, da semente, da hidratação — ainda
    encontra o alimento dele. Ver scripts/dados/consolidacao. */
export function todasAsComidas(): Alimento[] {
  return listas().todos;
}

/** A lista do DICIONÁRIO: só comida de prateleira, sem prato pronto. */
export function dicionario(): Alimento[] {
  return listas().dicionario;
}

/** "2 colheres", "1 filé" — o plural só quando é mais de um. */
/* Lido pelo quê? Uma pergunta, duas respostas possíveis. */
export const porUnidadeDe = (a: Alimento) => a.porUnidade === true;

export function medidaDe(a: Alimento, qtd: number): string {
  return `${qtd} ${qtd === 1 ? a.un : a.unp}`;
}


/* Busca por prefixo de palavra, e não por trecho solto: "ova" não devia
   trazer "Ovo cozido" pelo meio de "abacate". O que começa igual ao que
   foi digitado vem primeiro; o resto vem depois, na ordem da lista. */
/* ⚠️ AS PALAVRAS DE BUSCA SÃO CALCULADAS UMA VEZ, e não a cada tecla. Com
   224 alimentos dava para normalizar tudo dentro do laço; com 4.666, cada
   letra digitada custava 4.666 normalizações de string e a digitação
   engasgava. O índice se monta na primeira busca e vive enquanto o
   aplicativo viver.

   ⚠️ E O NOME É INDEXADO SEPARADO DOS SINÔNIMOS, porque é isso que decide
   a ordem. Ver o comentário da busca. */
/* ⚠️ E OS OUTROS CINCO NOMES ENTRAM NO `tudo`. Quem está na Alemanha e
   digita "chicken" acha o frango, em alemão; o nome do idioma de agora
   continua sendo o que decide a ordem. */
type NoIndice = { a: Alimento; nome: string[]; tudo: string[] };
let indice: { local: Local; nos: NoIndice[] } | null = null;
const indiceDaBusca = (): NoIndice[] => {
  const local = localAtual();
  if (!indice || indice.local !== local) {
    const nomes = new Map(COMIDAS.map((c) => [c.id, c.n.join(' ')]));
    indice = {
      local,
      nos: ALIMENTOS().map((a) => ({
        a,
        nome: semAcento(a.nome).split(/[\s,()]+/).filter(Boolean),
        tudo: semAcento((nomes.get(a.id) ?? a.nome) + ' ' + a.busca).split(/[\s,()]+/).filter(Boolean),
      })),
    };
  }
  return indice.nos;
};

/* Palavras de ligação dos seis idiomas: aparecem em quase todo nome
   composto e não distinguem nada. */
const LIGACAO = new Set([
  'de', 'da', 'do', 'com', 'em', 'ao', 'na', 'no', 'and', 'with', 'the', 'or',
  'con', 'el', 'la', 'y', 'en', 'al', 'et', 'le', 'les', 'au', 'aux', 'du', 'des', 'a',
  'mit', 'und', 'der', 'die', 'das', 'con', 'e', 'di', 'il', 'alla', 'al', 'allo',
]);

/* ⚠️ TODAS AS PALAVRAS DIGITADAS PRECISAM BATER, e antes só a primeira
   batia — na verdade, a frase inteira era tratada como uma palavra só.

   Com 224 alimentos em português ninguém percebeu: quem procura almoço
   digita "arroz". Com a base americana o defeito apareceu na primeira
   busca — "big mac" e "peanut butter" não devolviam nada, porque nenhuma
   palavra sozinha começa com "big mac". E valia nos dois idiomas: "peito
   de frango" também não achava nada.

   ⚠️⚠️ E A ORDEM SAI DE ONDE BATEU, e não do tamanho do nome. A primeira
   versão ordenava pelo nome mais curto, com o argumento de que o nome
   curto é o alimento e o longo é um prato que o contém. O efeito foi o
   contrário: "queijo" passou a trazer "Tofu" antes de "Queijo minas", e
   "arroz" trazia "Bibimbap" antes de "Arroz branco" — porque esses pratos
   têm a palavra nos SINÔNIMOS e o nome mais curto.

   O que separa os dois é onde a palavra apareceu: no NOME do alimento ou
   na lista de busca dele. Quem digita "queijo" quer o queijo; o omelete
   ⚠️ E O DESEMPATE É A ORDEM DO ARQUIVO, que também já custou uma
   tentativa: eu ordenei pelo nome mais curto, e "frango" passou a trazer
   "Frango xadrez" antes de "Peito de frango grelhado". A lista brasileira
   é ordenada à mão DENTRO de cada prateleira, do mais comum para o menos
   — peito de frango vem antes de torta de frango porque é o que mais
   gente come. Essa curadoria já estava lá, e a ordem alfabética do nome
   a jogava fora. */
export function buscarAlimento(termo: string, limite = 6, onde: 'registro' | 'dicionario' = 'registro'): Alimento[] {
  const t = semAcento(termo);
  if (t.length < 2) return [];
  const pedidos = t.split(/\s+/).filter((x) => x.length >= 2 && !LIGACAO.has(x));
  if (!pedidos.length) return [];

  const exata = (q: string, ws: string[]) => ws.includes(q);
  const comeca = (q: string, ws: string[]) => ws.some((w) => w.startsWith(q));
  const contem = (q: string, ws: string[]) => ws.some((w) => w.includes(q));

  const achados: { a: Alimento; grupo: number; i: number }[] = [];
  indiceDaBusca().forEach(({ a, nome, tudo }, i) => {
    if (onde === 'dicionario' && a.prato) return;
    /* ⚠️ PALAVRA EXATA VALE MAIS QUE PREFIXO, e sem isso "egg" trazia
       "Eggnog" na frente de "Egg, boiled": "eggnog" começa com "egg" e a
       lista americana não tem curadoria de importância para desempatar. */
    const grupo = pedidos.every((q) => exata(q, nome)) ? 0
      : pedidos.every((q) => comeca(q, nome)) ? 1
        : pedidos.every((q) => exata(q, tudo)) ? 2
          : pedidos.every((q) => comeca(q, tudo)) ? 3
            : pedidos.every((q) => contem(q, nome)) ? 4
              : pedidos.every((q) => contem(q, tudo)) ? 5
                : -1;
    if (grupo >= 0) achados.push({ a, grupo, i });
  });
  achados.sort((x, y) => x.grupo - y.grupo || x.i - y.i);
  return achados.slice(0, limite).map((x) => x.a);
}

/** Gramas de proteína de N unidades. Sempre arredondado: a precisão que
    existe aqui não chega na casa decimal. */
export function gramasDe(a: Alimento, qtd: number): number {
  const n = Math.max(0, qtd);
  if (porUnidadeDe(a)) return Math.round(a.p * n);
  return Math.round((a.p / 100) * (a.gUn ?? 0) * n);
}
