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

/** ISO-3166-1 alfa-2. */
export type Pais = string;

/* ⚠️ CADA PAÍS SE ESCREVE NO PRÓPRIO IDIOMA, e é a mesma regra da lista
   de idiomas: quem procura o próprio país procura a palavra que
   reconhece, não a tradução dela. "Deutschland" e não "Alemanha".

   E é o que torna esta lista possível: uma tradução por país seria a
   lista inteira vezes o número de idiomas, para uma tela que a pessoa
   abre uma vez na vida. */
export const NOME_DO_PAIS: Record<Pais, string> = {
  BR: 'Brasil', PT: 'Portugal', AO: 'Angola', MZ: 'Moçambique', CV: 'Cabo Verde',
  GW: 'Guiné-Bissau', ST: 'São Tomé e Príncipe', TL: 'Timor-Leste',

  US: 'United States', GB: 'United Kingdom', AU: 'Australia', CA: 'Canada',
  NZ: 'New Zealand', IE: 'Ireland', ZA: 'South Africa', NG: 'Nigeria',
  KE: 'Kenya', GH: 'Ghana', PH: 'Philippines', SG: 'Singapore',
  MY: 'Malaysia', PK: 'Pakistan',

  ES: 'España', MX: 'México', AR: 'Argentina', CO: 'Colombia', CL: 'Chile',
  PE: 'Perú', VE: 'Venezuela', EC: 'Ecuador', GT: 'Guatemala', CU: 'Cuba',
  BO: 'Bolivia', DO: 'República Dominicana', HN: 'Honduras', PY: 'Paraguay',
  SV: 'El Salvador', NI: 'Nicaragua', CR: 'Costa Rica', PA: 'Panamá',
  UY: 'Uruguay', PR: 'Puerto Rico',

  DE: 'Deutschland', AT: 'Österreich', CH: 'Schweiz', LI: 'Liechtenstein',

  FR: 'France', BE: 'België', LU: 'Luxembourg', MC: 'Monaco', SN: 'Sénégal',
  CI: 'Côte d’Ivoire', CM: 'Cameroun', CD: 'RD Congo',

  IT: 'Italia', SM: 'San Marino', VA: 'Città del Vaticano',

  NL: 'Nederland', SR: 'Suriname',

  SE: 'Sverige', NO: 'Norge', DK: 'Danmark', FI: 'Suomi', IS: 'Ísland',

  PL: 'Polska', CZ: 'Česko', SK: 'Slovensko', HU: 'Magyarország',
  RO: 'România', BG: 'България', GR: 'Ελλάδα', RU: 'Россия',
  UA: 'Україна', BY: 'Беларусь', KZ: 'Қазақстан', RS: 'Србија',
  HR: 'Hrvatska', SI: 'Slovenija',

  JP: '日本', KR: '대한민국', CN: '中国', TW: '台灣', HK: '香港',
  TH: 'ไทย', VN: 'Việt Nam', ID: 'Indonesia', IN: 'भारत',
  BD: 'বাংলাদেশ', LK: 'ශ්‍රී ලංකා', NP: 'नेपाल', MM: 'မြန်မာ', KH: 'កម្ពុជា',

  MA: 'المغرب', DZ: 'الجزائر', TN: 'تونس', SA: 'السعودية', AE: 'الإمارات',
  EG: 'مصر', IQ: 'العراق', JO: 'الأردن', KW: 'الكويت', QA: 'قطر',
  OM: 'عُمان', LB: 'لبنان', LY: 'ليبيا', YE: 'اليمن', BH: 'البحرين',
  SY: 'سوريا', IL: 'ישראל', TR: 'Türkiye', IR: 'ایران',
};

/* ⚠️ A LISTA DO SELETOR É ORDENADA PELO NOME, e não pelo código. Ninguém
   procura um país por "DE". */
export const PAISES: Pais[] = Object.keys(NOME_DO_PAIS)
  .sort((a, b) => NOME_DO_PAIS[a].localeCompare(NOME_DO_PAIS[b], 'pt-BR'));

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
  doAparelho = p && NOME_DO_PAIS[p] ? p : null;
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
