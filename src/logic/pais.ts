/* ============================================================
   O PAÍS — o segundo eixo, que não é o idioma

   ⚠️⚠️ IDIOMA E PAÍS SÃO PERGUNTAS DIFERENTES, e o aplicativo tratava as
   duas como uma só. Um brasileiro em Lisboa lê em português e compra
   remédio em euro; um mexicano nos Estados Unidos pode preferir ler em
   espanhol e ter Zepbound na farmácia da esquina. Derivar um do outro
   erra com as duas pessoas.

   O QUE O PAÍS DECIDE, e o idioma não:

     · a MOEDA — "R$" estava cravado em logic/assinatura, e a tela de
       planos em inglês mostrava "R$ 24.92"
     · os CORTES DE IMC — a OMS publica uma faixa diferente para
       população asiática, com sobrepeso em 23 e obesidade em 25 contra
       25 e 30. Não é preferência: é o corte que a literatura daquela
       população usa, e ele muda o rótulo que alguém lê sobre o próprio
       corpo
     · a TABELA DE ALIMENTOS — feijão e cornbread não são o mesmo prato
     · a REDE DE CLÍNICAS PARCEIRAS, que é brasileira
     · a ORDEM DOS MEDICAMENTOS

   ⚠️⚠️ E A ORDEM É ORDEM, NÃO FILTRO. Esta é a decisão mais importante
   deste arquivo.

   Esconder Zepbound de quem está no Brasil é um incômodo pequeno.
   Esconder manipulado de quem está nos Estados Unidos E TOMA MANIPULADO
   deixa essa pessoa sem conseguir registrar o próprio tratamento — e ela
   é justamente quem mais precisa de um diário, porque está no caso menos
   coberto. O custo de mostrar demais e o de esconder de menos não são
   simétricos.

   Então o país SOBE o que é comum ali e não tira nada de lugar nenhum.

   ⚠️ E ELE É PERGUNTADO, E NÃO DEDUZIDO. O aparelho dá o palpite inicial
   — é a melhor aposta —, e a resposta da pessoa ganha sempre. Ver o alto
   de logic/mercado, que já dizia isso do interruptor de build: adivinhar
   o país pelo telefone erra justamente com quem se mudou, que é quem tem
   mais a perder.
   ============================================================ */

import { MERCADO } from './mercado';
import { localAtual } from './local';
import { NOMES_DE_PAIS } from './paisesNomes';

/** ISO-3166-1 alfa-2. */
export type Pais = string;

/* ⚠️⚠️ AQUI SÓ MORAM OS CÓDIGOS, e os nomes moram em paisesNomes, que é
   arquivo GERADO. A divisão é de responsabilidade: QUEM ENTRA nesta lista
   é decisão — território com população civil, sem alias nem agrupamento —,
   e COMO CADA UM SE ESCREVE é o CLDR que sabe, nos cinco idiomas.

   ⚠️ E O PAÍS SE ESCREVE NO IDIOMA DO APLICATIVO, e não no próprio. Isto
   mudou: a lista já se escreveu em cento e onze línguas, e a regra vinha
   da lista de IDIOMAS, onde ela continua certa — quem abriu o aplicativo
   numa língua que não lê procura "Deutsch", e "Alemão" não o ajuda.

   Com o país é o contrário. A pergunta do país vem DEPOIS da do idioma,
   na mesma tela: quem chega nela já escolheu em que língua lê, e ler
   "Deutschland" no meio de uma lista em português é a única linha que ela
   não consegue procurar pelo nome que conhece.

   Os grupos abaixo não são mais o que decide a grafia — são o que decide
   quem é MERCADO: cada um existe porque o aplicativo fala aquele idioma.
   O último bloco é o resto do mundo, que não é mercado de nenhum e nem
   por isso pode faltar. */
export const PAISES: Pais[] = [
  'BR', 'PT', 'AO', 'MZ', 'CV',
  'GW', 'ST', 'TL',

  'US', 'GB', 'AU', 'CA',
  'NZ', 'IE', 'ZA', 'NG',
  'KE', 'GH', 'PH', 'SG',
  'MY', 'PK',

  'ES', 'MX', 'AR', 'CO', 'CL',
  'PE', 'VE', 'EC', 'GT', 'CU',
  'BO', 'DO', 'HN', 'PY',
  'SV', 'NI', 'CR', 'PA',
  'UY', 'PR',

  'DE', 'AT', 'CH', 'LI',

  'FR', 'BE', 'LU', 'MC', 'SN',
  'CI', 'CM', 'CD',

  'IT', 'SM', 'VA',

  'NL', 'SR',

  'SE', 'NO', 'DK', 'FI', 'IS',

  'PL', 'CZ', 'SK', 'HU',
  'RO', 'BG', 'GR', 'RU',
  'UA', 'BY', 'KZ', 'RS',
  'HR', 'SI',

  'JP', 'KR', 'CN', 'TW', 'HK',
  'TH', 'VN', 'ID', 'IN',
  'BD', 'LK', 'NP', 'MM', 'KH',

  'MA', 'DZ', 'TN', 'SA', 'AE',
  'EG', 'IQ', 'JO', 'KW', 'QA',
  'OM', 'LB', 'LY', 'YE', 'BH',
  'SY', 'IL', 'TR', 'IR',

  /* ============================================================
     E O RESTO DO MUNDO — os que não são mercado de nenhum idioma daqui

     ⚠️⚠️ ELES FALTAVAM, E A FALTA NÃO ERA SILENCIOSA: ERA MENTIROSA. O
     aparelho diz a região no arranque, e quando ela não estava nesta
     tabela o `paisDoAparelho` devolvia `null` e o `paisAtual()` caía no
     `PADRAO`. Quem abrisse o aplicativo na Albânia via "Brasil"
     pré-selecionado, não achava a Albânia na lista para corrigir — e
     ainda ganhava o convite de clínica parceira, que é brasileiro porque
     `temRedeParceira` pergunta `pais === 'BR'`.

     Os grupos de cima são os MERCADOS: cada um existe porque o
     aplicativo fala aquele idioma. Estes não pertencem a grupo nenhum, e
     fingir que pertencem seria inventar uma organização que não
     significa nada. Ficam em ordem de código, que é como se encontram
     aqui dentro — na tela eles entram ordenados por nome, como todos.

     ⚠️ OS NOMES NÃO ESTÃO MAIS AQUI, e a mudança apagou um problema
     inteiro. Enquanto cada país se escrevia no PRÓPRIO idioma, cada nome
     era uma decisão: qual das línguas de um país multilíngue, qual
     escrita, forma curta ou oficial. O gerador do CLDR erra essas três —
     devolvia "Gaana" para Ghana, "Senegaal" para o Senegal, "Казахстан"
     em russo para o Cazaquistão —, e por isso havia curadoria à mão.

     Escrevendo no idioma do APLICATIVO não sobra decisão nenhuma: o CLDR
     sabe como o português chama a Albânia, e o alemão também. Ver
     logic/paisesNomes, que é gerado, e o alto do gerador para saber por
     que ele é gerado e não resolvido no aparelho.

     FICARAM DE FORA, de propósito: território sem população civil
     permanente (Antártida, Bouvet, Heard, Terras Austrais, Geórgia do
     Sul, ilhas menores dos EUA e o Território Britânico do Oceano
     Índico), agrupamento que não é país (UE, ONU) e código depreciado —
     estes últimos se denunciam sozinhos, porque um alias maximiza para a
     região canônica: `und-UK` vira `en-Latn-GB`.
     ============================================================ */
  'AD', 'AF', 'AG', 'AI',
  'AL', 'AM', 'AS', 'AW', 'AX',
  'AZ', 'BA', 'BB', 'BF',
  'BI', 'BJ', 'BL', 'BM', 'BN',
  'BQ', 'BS', 'BT', 'BW',
  'BZ', 'CC', 'CF',
  'CG', 'CK', 'CW',
  'CX', 'CY', 'DJ', 'DM', 'EE',
  'EH', 'ER', 'ET', 'FJ',
  'FK', 'FM', 'FO', 'GA',
  'GD', 'GE', 'GF', 'GG',
  'GI', 'GL', 'GM', 'GN',
  'GP', 'GQ', 'GU', 'GY', 'HT',
  'IM', 'JE', 'JM', 'KG', 'KI',
  'KM', 'KN', 'KP', 'KY',
  'LA', 'LC', 'LR', 'LS', 'LT',
  'LV', 'MD', 'ME', 'MF',
  'MG', 'MH', 'MK', 'ML',
  'MN', 'MO', 'MP', 'MQ',
  'MR', 'MS', 'MT', 'MU', 'MV',
  'MW', 'NA', 'NC', 'NE',
  'NF', 'NR', 'NU', 'PF',
  'PG', 'PM', 'PN',
  'PS', 'PW', 'RE', 'RW', 'SB',
  'SC', 'SD', 'SH', 'SJ',
  'SL', 'SO', 'SS', 'SX',
  'SZ', 'TC', 'TD', 'TG',
  'TJ', 'TK', 'TM', 'TO',
  'TT', 'TV', 'TZ', 'UG',
  'UZ', 'VC',
  'VG', 'VI', 'VU',
  'WF', 'WS', 'XK', 'YT', 'ZM',
  'ZW',
];

/* O nome no idioma em que o aplicativo está falando agora. Sem dado — um
   código que entrou na lista e ainda não passou pelo gerador —, o próprio
   código responde: é feio e é visível, que é o que se quer de uma falta. */
export const nomeDoPais = (c: Pais): string => {
  const tabela = NOMES_DE_PAIS[localAtual()] ?? NOMES_DE_PAIS['pt-BR'];
  return tabela?.[c] ?? c;
};

/* ⚠️ A LISTA DO SELETOR É ORDENADA PELO NOME, e não pelo código: ninguém
   procura um país por "DE".

   ⚠️⚠️ E ELA É FUNÇÃO, e não constante de módulo. Constante de módulo se
   calcula no import e congelaria a ordem no primeiro idioma — em alemão a
   lista sairia alfabética em português, com "Alemanha" onde "Deutschland"
   deveria estar. É a mesma regra do catálogo de textos; ver
   scripts/idioma-congelado.mjs. */
export const paisesOrdenados = (): Pais[] => {
  const l = localAtual();
  return [...PAISES].sort((a, b) => nomeDoPais(a).localeCompare(nomeDoPais(b), l));
};

/* ------------------------------------------------------------------ *
 * QUAL É O PAÍS AGORA
 * ------------------------------------------------------------------ */

const PADRAO: Pais = MERCADO === 'us' ? 'US' : 'BR';

let escolhido: Pais | null = null;
let doAparelho: Pais | null = null;

export const paisAtual = (): Pais => escolhido ?? doAparelho ?? PADRAO;

/** Trocar à mão. `null` devolve a escolha ao aparelho. */
export const trocarPais = (p: Pais | null) => { escolhido = p; };

/** O palpite do aparelho, dito por logic/local quando ele lê a região. */
export const paisDoAparelho = (p: string | null) => {
  doAparelho = p && PAISES.includes(p) ? p : null;
};

/* ------------------------------------------------------------------ *
 * O QUE O PAÍS DECIDE
 * ------------------------------------------------------------------ */

/** A rede de clínicas parceiras é brasileira. Ver logic/mercado. */
export const temRedeParceira = (p: Pais = paisAtual()) => p === 'BR';

/** Qual tabela de composição de alimentos. Hoje existem duas. */
export const tabelaDeAlimentos = (p: Pais = paisAtual()): 'us' | 'br' => (p === 'US' ? 'us' : 'br');

/* ⚠️ A MOEDA É SÍMBOLO MAIS POSIÇÃO, e não só símbolo: "R$ 24,92" põe o
   símbolo antes com espaço, "24,92 €" põe depois, e "$24.92" põe antes
   colado. Três desenhos para a mesma informação.

   ⚠️⚠️ E O NÚMERO NÃO É CONVERTIDO. Isto escreve a moeda do país; a
   TABELA DE PREÇOS continua uma só, em reais, porque é a que existe.
   Trocar o símbolo sem trocar o valor diria que o plano anual custa 299
   dólares, o que seria mentira sobre dinheiro. Quem ligar a cobrança fora
   do Brasil precisa de preço por mercado antes de usar isto — está
   anotado em PENDENCIAS. */
export type Moeda = { simbolo: string; antes: boolean; espaco: boolean };

const MOEDAS: Record<string, Moeda> = {
  BR: { simbolo: 'R$', antes: true, espaco: true },
  US: { simbolo: '$', antes: true, espaco: false },
  GB: { simbolo: '£', antes: true, espaco: false },
  JP: { simbolo: '¥', antes: true, espaco: false },
  CH: { simbolo: 'CHF', antes: true, espaco: true },
};

/* Os países do euro, que são muitos e têm o mesmo desenho. */
const EURO = ['PT', 'ES', 'DE', 'AT', 'FR', 'BE', 'LU', 'MC', 'IT', 'SM', 'VA',
  'NL', 'IE', 'FI', 'GR', 'SK', 'SI', 'HR'];

export const moedaDe = (p: Pais = paisAtual()): Moeda => MOEDAS[p]
  ?? (EURO.includes(p) ? { simbolo: '€', antes: false, espaco: true } : MOEDAS.US);

/* ⚠️⚠️ OS CORTES DE IMC DA ÁSIA-PACÍFICO NÃO SÃO UMA PREFERÊNCIA.

   A OMS publicou em 2004 uma faixa diferente para população asiática,
   com sobrepeso a partir de 23 e obesidade a partir de 25, porque o
   risco cardiometabólico aparece em IMC mais baixo nessas populações. É
   o corte que a literatura e as diretrizes daqueles países usam.

   ⚠️ E É POR PAÍS, QUE É UMA APROXIMAÇÃO — o corte é populacional e
   ninguém é uma população. O aplicativo não pergunta ascendência, e não
   vai perguntar: é dado sensível para uma melhoria marginal num rótulo.
   O país é o palpite honesto que existe, e a faixa aparece com o nome da
   classificação, que é o que a consulta usa.

   Ver PENDENCIAS: o rótulo devia dizer qual corte está usando. */
const CORTES_ASIA = ['CN', 'TW', 'HK', 'JP', 'KR', 'SG', 'MY', 'TH', 'VN',
  'ID', 'PH', 'IN', 'BD', 'LK', 'NP', 'MM', 'KH', 'PK'];

export const cortesDeIMC = (p: Pais = paisAtual()): 'asia' | 'oms' =>
  (CORTES_ASIA.includes(p) ? 'asia' : 'oms');

/* ============================================================
   OS MEDICAMENTOS COMUNS EM CADA PAÍS

   ⚠️⚠️ ISTO ORDENA, E NÃO FILTRA. Ver o alto do arquivo. O que não está
   aqui continua na lista, embaixo — e a pessoa que toma um deles
   continua conseguindo registrar o tratamento dela.

   ⚠️ E "COMUM" NÃO É "APROVADO". Não mantemos uma tabela regulatória:
   Zepbound é da FDA e não existe na ANVISA, manipulado é realidade
   brasileira e foi restringido pela FDA quando a escassez acabou, e
   qualquer lista que se diga de aprovação envelhece entre duas
   consultas. Isto é o que a pessoa daquele país provavelmente tem na
   mão — um palpite de ORDEM, e ordem errada não faz mal a ninguém.
   ============================================================ */
const COMUNS: Record<string, string[]> = {
  BR: ['mounjaro', 'ozempic', 'wegovy', 'saxenda', 'victoza', 'trulicity', 'rybelsus', 'semaglutida-manipulada', 'tirzepatida-manipulada'],
  US: ['zepbound', 'mounjaro', 'wegovy', 'ozempic', 'saxenda', 'victoza', 'trulicity', 'rybelsus'],
};

/* O resto do mundo: as marcas que circulam em mais lugares, sem o que é
   de um mercado só. */
const COMUNS_PADRAO = ['mounjaro', 'ozempic', 'wegovy', 'saxenda', 'victoza', 'trulicity', 'rybelsus'];

export const comunsNoPais = (p: Pais = paisAtual()): string[] => COMUNS[p] ?? COMUNS_PADRAO;
