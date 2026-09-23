import { MERCADO } from './mercado';
import { paisDoAparelho as contaOPais } from './pais';

/* ============================================================
   O LOCAL — em que idioma o aplicativo fala e como ele escreve número

   ⚠️⚠️ SÃO DUAS COISAS, E UM VALOR SÓ. Idioma é que palavra sai; local é
   como o número sai. A tentação é separá-los — "português com números
   americanos" —, e é a tentação que produz `181.7 kg` numa tela em
   português. Quem escreve em português escreve 181,7. São a mesma
   decisão, e por isso são o mesmo valor.

   ⚠️ E NÃO É O SISTEMA DE UNIDADES. Um brasileiro pode ler em libra — a
   folha de unidades deixa —, e ele continua escrevendo 181,7 lb com
   vírgula, porque a vírgula é da língua dele e não da libra. Trocar a
   vírgula junto com a unidade seria confundir duas réguas que só por
   acaso andam juntas nos Estados Unidos. Ver logic/medidas.

   ⚠️⚠️ POR QUE ISTO É UMA PEÇA À PARTE, E VEIO ANTES DA TRADUÇÃO. O
   catálogo de textos (src/textos) tira a frase do código; este arquivo
   tira o FORMATO. São problemas diferentes: a frase muda de idioma para
   idioma e se confere lendo; o formato muda e ninguém lê — um ponto no
   lugar de uma vírgula não parece erro, parece número. Quarenta e dois
   lugares do aplicativo já tinham pendurado um `.replace('.', ',')` no
   fim de uma chamada, e os que esqueceram ficaram com o ponto. Com o
   formato num lugar só, esquecer deixa de ser possível.

   ⚠️ DE ONDE VEM O VALOR, em ordem: o que a pessoa escolheu, o que o
   aparelho diz, e o mercado do build. Hoje não há tela de escolha, e é de
   propósito: só existe texto em português, e um seletor que promete
   inglês e entrega português é porta emparedada. A tela nasce junto com a
   tradução.
   ============================================================ */

export type Local = 'pt-BR' | 'en-US' | 'es-419' | 'fr-FR' | 'de-DE' | 'it-IT';

/* O caminho de quem não respondeu é o do build. Ver logic/mercado. */
const PADRAO: Local = MERCADO === 'us' ? 'en-US' : 'pt-BR';

/* ============================================================
   OS IDIOMAS QUE EXISTEM, E O QUE O PAÍS TEM A VER COM ISSO

   ⚠️⚠️ SÓ SE OFERECE O QUE SE ENTREGA. Esta lista é a dos locais que têm
   CATÁLOGO, e ela não pode ser maior que o tipo `Local` — que, por sua
   vez, obriga src/textos a ter um catálogo para cada um, porque lá o
   registro é `Record<Local, Textos>` e o `tsc` cobra.

   Isso é de propósito e é a trava principal deste arquivo: acrescentar um
   idioma à lista SEM escrever o catálogo dele não compila. Sem essa
   trava, a tela ofereceria "Deutsch" e entregaria português — que é a
   porta emparedada mais cara do aplicativo, porque quem a abre não tem
   como voltar: ele não sabe ler o que está na tela para achar o caminho
   de volta.
   ============================================================ */
export const DISPONIVEIS: Local[] = ['pt-BR', 'en-US', 'es-419', 'fr-FR', 'de-DE', 'it-IT'];

/* ⚠️ CADA UM SE ESCREVE NO PRÓPRIO IDIOMA, e é a única lista do
   aplicativo que não passa pelo catálogo. "Inglês" só ajuda quem já lê
   português; quem abriu a tela por estar perdido procura a palavra que
   reconhece. */
export const NOME_DO_LOCAL: Record<Local, string> = {
  'pt-BR': 'Português',
  'en-US': 'English',
  'es-419': 'Español',
  'fr-FR': 'Français',
  'de-DE': 'Deutsch',
  'it-IT': 'Italiano',
};

/* ============================================================
   O IDIOMA PRINCIPAL DE CADA PAÍS

   ⚠️⚠️ ISTO É DADO DE ORDENAÇÃO, E NÃO UMA AFIRMAÇÃO SOBRE NINGUÉM. Ele
   responde a uma pergunta só: qual idioma põe em cima da lista para
   alguém que está na Alemanha. Não responde "que idioma esta pessoa
   fala" — país não determina língua, e muita gente vive onde não nasceu.
   Por isso a lista inteira continua à vista, e a escolha é dela.

   ⚠️ E ELE É MAIOR DO QUE `DISPONIVEIS` DE PROPÓSITO. Estão aqui países
   cujo idioma o aplicativo ainda não fala, e isso não é promessa: quando
   o idioma não existe, o mapa não tem efeito nenhum e a ordem cai no
   padrão. O mapa já pronto é o que faz o próximo idioma custar só o
   catálogo dele.

   ⚠️ ONDE O PAÍS TEM MAIS DE UM IDIOMA, ESCOLHI O DE MAIS FALANTES — o
   Canadá aparece como inglês, a Bélgica como neerlandês, a Suíça como
   alemão. É ordenação, e quem discordar troca em dois toques. */
const IDIOMA_DO_PAIS: Record<string, string> = {
  /* português */
  BR: 'pt', PT: 'pt', AO: 'pt', MZ: 'pt', CV: 'pt', GW: 'pt', ST: 'pt', TL: 'pt',
  /* inglês */
  US: 'en', GB: 'en', AU: 'en', CA: 'en', NZ: 'en', IE: 'en', ZA: 'en',
  NG: 'en', KE: 'en', GH: 'en', PH: 'en', SG: 'en', MY: 'en', PK: 'en',
  /* espanhol */
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es',
  EC: 'es', GT: 'es', CU: 'es', BO: 'es', DO: 'es', HN: 'es', PY: 'es',
  SV: 'es', NI: 'es', CR: 'es', PA: 'es', UY: 'es', PR: 'es',
  /* alemão */
  DE: 'de', AT: 'de', CH: 'de', LI: 'de',
  /* francês */
  FR: 'fr', BE: 'nl', LU: 'fr', MC: 'fr', SN: 'fr', CI: 'fr', CM: 'fr',
  CD: 'fr', MA: 'ar', DZ: 'ar', TN: 'ar',
  /* italiano */
  IT: 'it', SM: 'it', VA: 'it',
  /* neerlandês */
  NL: 'nl', SR: 'nl',
  /* nórdicos */
  SE: 'sv', NO: 'no', DK: 'da', FI: 'fi', IS: 'is',
  /* leste europeu */
  PL: 'pl', CZ: 'cs', SK: 'sk', HU: 'hu', RO: 'ro', BG: 'bg', GR: 'el',
  RU: 'ru', UA: 'uk', BY: 'ru', KZ: 'ru', RS: 'sr', HR: 'hr', SI: 'sl',
  /* Ásia */
  JP: 'ja', KR: 'ko', CN: 'zh', TW: 'zh', HK: 'zh', TH: 'th', VN: 'vi',
  ID: 'id', IN: 'hi', BD: 'bn', LK: 'si', NP: 'ne', MM: 'my', KH: 'km',
  /* Oriente Médio e árabe */
  SA: 'ar', AE: 'ar', EG: 'ar', IQ: 'ar', JO: 'ar', KW: 'ar', QA: 'ar',
  OM: 'ar', LB: 'ar', LY: 'ar', YE: 'ar', BH: 'ar', SY: 'ar',
  IL: 'he', TR: 'tr', IR: 'fa',
};

/* ------------------------------------------------------------------ *
 * COMO CADA LOCAL ESCREVE
 * ------------------------------------------------------------------ */

/* ⚠️⚠️ OS NOMES DO CALENDÁRIO MORAM AQUI, E NÃO NO CATÁLOGO DE TEXTOS.

   "maio" e "May" são palavras, e a regra da casa é que palavra mora em
   src/textos. Estas doze mais sete são a exceção, e a exceção tem
   motivo: elas não são fala do aplicativo, são a grade do calendário —
   lista fechada, sem concordância, sem sujeito, igual em todo texto que
   já existiu naquele idioma. E o formatador de data não funciona sem
   elas: deixá-las no catálogo faria o motor de formato nascer pela
   metade, esperando a tradução para conseguir escrever uma data.

   A prosa sobre tempo — "ontem", "há 3 dias", "em 2 semanas" — não é
   disto aqui: é fala, tem concordância, e vai para o catálogo. */
type Formato = {
  /* o que separa o inteiro da fração, e o que agrupa os milhares */
  decimal: string;
  milhar: string;

  mesCurto: string[];
  mesLongo: string[];
  diaCurto: string[];
  diaLongo: string[];

  /* ⚠️ O DESENHO DA DATA É FUNÇÃO, e não uma máscara tipo "DD/MM/YYYY".
     Máscara resolve ordem e não resolve o resto: o português precisa do
     "de" entre o dia e o mês e de outro antes do ano, e o inglês precisa
     da vírgula antes do ano e de nenhuma preposição. Uma função escreve
     a frase da língua dela e acabou. */
  curta: (dia: number, mes: number) => string;
  longa: (dia: number, mes: number) => string;
  comAno: (dia: number, mes: number, ano: number) => string;
  comDiaDaSemana: (diaDaSemana: string, resto: string) => string;
  periodo: (de: number, ate: number, mes: number) => string;
  /* O mesmo intervalo com o mês por extenso. A semana do tratamento o
     usa no cabeçalho, onde "13 a 19 mai" ficaria seco ao lado de um
     título. */
  periodoLongo: (de: number, ate: number, mes: number) => string;
  /* "maio de 2026" / "May 2026" — o cabeçalho do calendário. */
  mesAno: (mes: number, ano: number) => string;
  /* ⚠️ O QUE FICA ENTRE DUAS DATAS TAMBÉM É DO IDIOMA. Quando a semana
     vira o mês, o intervalo não cabe no `periodo` e as duas datas vêm
     escritas por inteiro — e o que as junta é "a" em português e um
     travessão em inglês. Escrito na tela, aquele "a" ficava lá para
     sempre: "Jul 28 a Aug 3". */
  junta: (de: string, ate: string) => string;

  /* Relógio de 24 ou de 12 horas. É o padrão do idioma, e o aparelho
     pode discordar — ver `lerAparelho`. */
  hora12: boolean;
};

const PT: Formato = {
  decimal: ',',
  milhar: '.',
  mesCurto: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  mesLongo: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  diaCurto: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
  diaLongo: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  curta: (d, m) => `${d} ${PT.mesCurto[m]}`,
  longa: (d, m) => `${d} de ${PT.mesLongo[m]}`,
  comAno: (d, m, a) => `${d} de ${PT.mesLongo[m]} de ${a}`,
  comDiaDaSemana: (dia, resto) => `${dia}, ${resto}`,
  periodo: (de, ate, m) => `${de} a ${ate} ${PT.mesCurto[m]}`,
  periodoLongo: (de, ate, m) => `${de} a ${ate} de ${PT.mesLongo[m]}`,
  mesAno: (m, a) => `${PT.mesLongo[m]} de ${a}`,
  junta: (de, ate) => `${de} a ${ate}`,
  hora12: false,
};

const EN: Formato = {
  decimal: '.',
  milhar: ',',
  mesCurto: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  mesLongo: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  diaCurto: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  diaLongo: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  curta: (d, m) => `${EN.mesCurto[m]} ${d}`,
  longa: (d, m) => `${EN.mesLongo[m]} ${d}`,
  comAno: (d, m, a) => `${EN.mesLongo[m]} ${d}, ${a}`,
  comDiaDaSemana: (dia, resto) => `${dia}, ${resto}`,
  /* "May 13–19", com travessão curto e sem repetir o mês — é como o
     inglês escreve intervalo. */
  periodo: (de, ate, m) => `${EN.mesCurto[m]} ${de}–${ate}`,
  periodoLongo: (de, ate, m) => `${EN.mesLongo[m]} ${de}–${ate}`,
  mesAno: (m, a) => `${EN.mesLongo[m]} ${a}`,
  junta: (de, ate) => `${de} – ${ate}`,
  hora12: true,
};

/* ⚠️⚠️ O ESPANHOL NÃO TEM UM SEPARADOR DECIMAL, TEM DOIS — e esta é a
   maior concessão de `es-419` existir como um idioma só.

   México, América Central, Porto Rico e a República Dominicana escrevem
   1.234,56 como "1,234.56", à americana. A América do Sul inteira e a
   Espanha escrevem "1.234,56". São cerca de 150 milhões de falantes de um
   lado e mais de 200 do outro, e nenhuma escolha serve aos dois.

   Fica a vírgula decimal, que cobre mais gente — e no dia em que o
   México pesar o bastante, a saída não é mudar este número: é um
   `es-MX` com o mesmo catálogo e outro formato, que é exatamente o que
   esta separação entre FORMATO e CATÁLOGO existe para permitir. Está
   anotado em PENDENCIAS.

   ⚠️ E O RELÓGIO É DE 24 H pelo mesmo tipo de motivo: o México escreve
   12 h e a América do Sul, 24. O aparelho manda sobre este — ver
   `lerAparelho` —, então o padrão só vale para quem não disse nada. */
const ES: Formato = {
  decimal: ',',
  milhar: '.',
  mesCurto: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  mesLongo: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  diaCurto: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  diaLongo: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  curta: (d, m) => `${d} ${ES.mesCurto[m]}`,
  longa: (d, m) => `${d} de ${ES.mesLongo[m]}`,
  comAno: (d, m, a) => `${d} de ${ES.mesLongo[m]} de ${a}`,
  comDiaDaSemana: (dia, resto) => `${dia}, ${resto}`,
  periodo: (de, ate, m) => `${de} a ${ate} ${ES.mesCurto[m]}`,
  periodoLongo: (de, ate, m) => `${de} a ${ate} de ${ES.mesLongo[m]}`,
  mesAno: (m, a) => `${ES.mesLongo[m]} de ${a}`,
  junta: (de, ate) => `${de} a ${ate}`,
  hora12: false,
};

/* ⚠️⚠️ O MILHAR DO FRANCÊS É UM ESPAÇO, E É ESTE ESPAÇO: o fino
   inquebrável, U+202F. Não é capricho tipográfico — um espaço comum
   deixaria "12 400" quebrar a linha no meio do número, e é o mesmo
   caractere que já separa a pontuação dupla no catálogo francês.

   ⚠️ E O DIA DA SEMANA NÃO LEVA VÍRGULA. "mercredi 13 mai", e não
   "mercredi, 13 mai" — o português e o inglês põem a vírgula, o francês
   não põe nada, e é por isso que `comDiaDaSemana` é função e não máscara.

   ⚠️ NEM O MÊS LEVA "de". "13 mai 2026" é a data francesa inteira: sem
   preposição, sem maiúscula no mês, e com o dia antes.

   ⚠️ E O INTERVALO LONGO DIZ "du … au …", que é como se lê um período em
   francês. O curto fica com o travessão, porque ele é etiqueta e não
   frase. */
const FR: Formato = {
  decimal: ',',
  milhar: ' ',
  /* ⚠️ O PONTO DAS ABREVIAÇÕES NÃO É ENFEITE: em francês ele marca que a
     palavra foi cortada, e por isso "mars", "mai", "juin" e "août" não o
     levam — eles não foram cortados. */
  mesCurto: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  mesLongo: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  diaCurto: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  diaLongo: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  curta: (d, m) => `${d} ${FR.mesCurto[m]}`,
  longa: (d, m) => `${d} ${FR.mesLongo[m]}`,
  comAno: (d, m, a) => `${d} ${FR.mesLongo[m]} ${a}`,
  comDiaDaSemana: (dia, resto) => `${dia} ${resto}`,
  periodo: (de, ate, m) => `${de}–${ate} ${FR.mesCurto[m]}`,
  periodoLongo: (de, ate, m) => `du ${de} au ${ate} ${FR.mesLongo[m]}`,
  mesAno: (m, a) => `${FR.mesLongo[m]} ${a}`,
  junta: (de, ate) => `${de} – ${ate}`,
  hora12: false,
};

/* ⚠️⚠️ O PONTO DEPOIS DO DIA NÃO É PONTUAÇÃO, É O ORDINAL. Em alemão a
   data se escreve "13. Mai 2026", e aquele ponto quer dizer "décimo
   terceiro" — tirar ele não deixa a data mais limpa, deixa ela errada.
   Ele entra em todas as formas: na curta, na longa, com ano, e nos dois
   lados do intervalo ("13.–19. Mai").

   ⚠️ E O MÊS VAI COM MAIÚSCULA, ao contrário do francês e do espanhol —
   é substantivo, e alemão escreve todo substantivo com maiúscula. Pela
   mesma razão, a abreviação leva ponto quando a palavra foi cortada
   ("Sept.") e não leva quando não foi ("Mai", "Juni").

   ⚠️ O DIA DA SEMANA CURTO NÃO LEVA PONTO, e isso não é contradição: são
   duas letras fixas — Mo, Di, Mi —, que é a forma corrente e a da norma.
   O francês leva ("lun."), o alemão não.

   ⚠️ E O MILHAR É PONTO, como em português. O alemão escreve 1.234,56 —
   é o francês que é a exceção entre os cinco, com o espaço fino. */
const DE: Formato = {
  decimal: ',',
  milhar: '.',
  mesCurto: ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'],
  mesLongo: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  diaCurto: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  diaLongo: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  curta: (d, m) => `${d}. ${DE.mesCurto[m]}`,
  longa: (d, m) => `${d}. ${DE.mesLongo[m]}`,
  comAno: (d, m, a) => `${d}. ${DE.mesLongo[m]} ${a}`,
  comDiaDaSemana: (dia, resto) => `${dia}, ${resto}`,
  periodo: (de, ate, m) => `${de}.–${ate}. ${DE.mesCurto[m]}`,
  periodoLongo: (de, ate, m) => `${de}. bis ${ate}. ${DE.mesLongo[m]}`,
  mesAno: (m, a) => `${DE.mesLongo[m]} ${a}`,
  junta: (de, ate) => `${de} – ${ate}`,
  hora12: false,
};

/* ⚠️ O ITALIANO ESCREVE A DATA COMO O FRANCÊS — dia antes, mês em
   minúscula e SEM preposição: "13 maggio 2026". E o dia da semana não
   leva vírgula: "mercoledì 13 maggio". São as duas regras que o
   português e o inglês quebram, cada um do seu jeito.

   ⚠️ E O INTERVALO LONGO DIZ "dal … al …", com a preposição articulada,
   que é como se lê um período em italiano. O curto fica com o travessão,
   porque ele é etiqueta e não frase.

   ⚠️ O PRIMEIRO DO MÊS SE DIZ "il 1º maggio", com ordinal, e é a única
   exceção da língua — os outros trinta dias são cardinais. A forma
   ordinal é da prosa e da fala; em tela de aplicativo e em calendário o
   italiano escreve "1 maggio", e é o que fica aqui. Se um dia isto
   mudar, muda só em `curta`, `longa` e `comAno`. */
const IT: Formato = {
  decimal: ',',
  milhar: '.',
  /* ⚠️ A ABREVIAÇÃO NÃO LEVA PONTO, ao contrário do francês. "gen",
     "feb", "mag" é a forma corrente do italiano e a do CLDR; o ponto do
     francês marca corte de palavra, e o italiano não o usa aqui. */
  mesCurto: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
  mesLongo: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
  diaCurto: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'],
  diaLongo: ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
  curta: (d, m) => `${d} ${IT.mesCurto[m]}`,
  longa: (d, m) => `${d} ${IT.mesLongo[m]}`,
  comAno: (d, m, a) => `${d} ${IT.mesLongo[m]} ${a}`,
  comDiaDaSemana: (dia, resto) => `${dia} ${resto}`,
  periodo: (de, ate, m) => `${de}–${ate} ${IT.mesCurto[m]}`,
  periodoLongo: (de, ate, m) => `dal ${de} al ${ate} ${IT.mesLongo[m]}`,
  mesAno: (m, a) => `${IT.mesLongo[m]} ${a}`,
  junta: (de, ate) => `${de} – ${ate}`,
  hora12: false,
};

const FORMATOS: Record<Local, Formato> = { 'pt-BR': PT, 'en-US': EN, 'es-419': ES, 'fr-FR': FR, 'de-DE': DE, 'it-IT': IT };

/* ------------------------------------------------------------------ *
 * QUAL É O LOCAL AGORA
 * ------------------------------------------------------------------ */

let escolhido: Local | null = null;
let doAparelho: Local | null = null;
let paisDoAparelho: string | null = null;
let relogio12: boolean | null = null;

export const localAtual = (): Local => escolhido ?? doAparelho ?? PADRAO;

/** O formato do local em uso. É função, e não constante: constante de
    módulo é lida uma vez, no import, e congelaria o primeiro local que
    o aplicativo viu. Foi assim que a extração de textos quebrou o
    rodízio de locais de aplicação — ver src/textos/README. */
export const formato = (): Formato => FORMATOS[localAtual()];

/** Relógio de 12 horas? O idioma tem um padrão e o aparelho pode
    discordar: um brasileiro com o telefone em 12 horas lê "8:30 PM" em
    português, e está certo — quem escolheu foi ele, no sistema. */
export const hora12 = () => relogio12 ?? formato().hora12;

/** A lista para escolher, com o idioma do país da pessoa em cima.

    ⚠️⚠️ A ORDEM É A ÚNICA COISA QUE O PAÍS DECIDE. Quem está na Alemanha
    vê alemão primeiro quando ele existir; até lá, vê a lista inteira na
    ordem padrão. Nada some, nada se escolhe sozinho — país não determina
    língua, e o custo de errar essa suposição recai justamente sobre quem
    já é minoria onde mora.

    ⚠️ E O APARELHO TEM DUAS RESPOSTAS, não uma. O idioma do sistema é a
    melhor pista — é o que a pessoa configurou —, e o país é a segunda.
    Quando as duas discordam, ganha o idioma: quem pôs o telefone em
    português morando na Alemanha respondeu à pergunta antes de ela ser
    feita. */
export function idiomasOrdenados(): Local[] {
  const doIdioma = doAparelho;
  const doPais = paisDoAparelho ? IDIOMA_DO_PAIS[paisDoAparelho] : null;

  /* o primeiro candidato que exista como catálogo */
  const primeiro = DISPONIVEIS.find((l) => l === doIdioma)
    ?? (doPais ? DISPONIVEIS.find((l) => l.split('-')[0] === doPais) : undefined);

  if (!primeiro) return DISPONIVEIS;
  return [primeiro, ...DISPONIVEIS.filter((l) => l !== primeiro)];
}

/** Trocar à mão. `null` devolve a escolha ao aparelho. */
export const trocarLocal = (l: Local | null) => { escolhido = l; };

/* ⚠️⚠️ O MÓDULO DO APARELHO É CARREGADO TARDE, DENTRO DO try — e o
   `import` no alto do arquivo não servia.

   `expo-localization` depende de `expo-modules-core`, que só existe dentro
   do aplicativo. A rede de congelamento roda em node, e um `import` no
   topo do módulo é resolvido ANTES de qualquer linha deste arquivo
   correr: o try nunca chegava a ser executado, e a rede quebrava na
   primeira importação de logic/time, que importa este arquivo. Com o
   `require` aqui dentro, node só encontra o módulo se alguém pedir o
   aparelho — e quem roda fora do aplicativo não pede.

   É o mesmo desenho do `require` adiado da tabela americana de alimentos,
   em logic/alimentos, e pela mesma razão: o custo de carregar algo que
   este caminho não vai usar. */
export function lerAparelho(): { local: Local; imperial: boolean } | null {
  try {
    /* eslint-disable-next-line @typescript-eslint/no-var-requires */
    const Localization = require('expo-localization') as typeof import('expo-localization');
    const l = Localization.getLocales()[0];
    const cal = Localization.getCalendars()[0];
    if (!l) return null;

/* ⚠️⚠️ ISTO ERA UMA ESCADA DE DOIS DEGRAUS — `en` ou `pt`, e o resto
       caía no mercado. No dia em que o espanhol entrou, um telefone em
       espanhol passou a abrir o aplicativo em português e ninguém
       percebeu: a escada não sabia que tinha ganhado um degrau.

       Agora ela pergunta ao DISPONIVEIS, que é quem sabe quais catálogos
       existem. Idioma novo entra sozinho. */
    const idioma = l.languageCode ?? '';
    doAparelho = DISPONIVEIS.find((x) => x.split('-')[0] === idioma) ?? PADRAO;

    paisDoAparelho = l.regionCode ?? null;
    /* O palpite do país vai para logic/pais, que é quem responde por ele. */
    contaOPais(paisDoAparelho);
    if (cal && typeof cal.uses24hourClock === 'boolean') relogio12 = !cal.uses24hourClock;

    /* ⚠️ E O APARELHO TAMBÉM DIZ AS UNIDADES, que até aqui começavam
       sempre em métrico. `measurementSystem` é o que o sistema
       operacional já sabe sobre quem está segurando o telefone, e
       perguntar de novo o que ele já respondeu é trabalho que se passa
       para a pessoa. A escolha dela, quando existir, continua ganhando —
       ver `sistemaDe` em logic/medidas. */
    return { local: doAparelho, imperial: l.measurementSystem === 'us' };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * O NÚMERO
 * ------------------------------------------------------------------ */

/** O número escrito como o local escreve.

    ⚠️⚠️ A CONTA É FEITA AQUI, SEM `toLocaleString`. Essa chamada só cumpre
    o que promete onde existe ICU completo; no React Native ela cai para
    o comportamento do `toString`, ignora o local e ignora as casas
    pedidas. Foi o que deixou quarenta e dois `.replace('.', ',')`
    espalhados pelo aplicativo — e o `.replace` era outro defeito à
    espera do número certo: onde o ICU funcionava, `1.700,5` virava
    `1,700,5`.

    `toFixed` garante as casas com ponto; depois o milhar recebe o
    separador dele e o ponto decimal recebe o seu, nessa ordem, que é a
    que não confunde os dois. */
export const numero = (x: number, casas = 1) => {
  const f = formato();
  const [inteiro, frac] = Math.abs(x).toFixed(casas).split('.');
  const comMilhar = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, f.milhar);
  return `${x < 0 ? '-' : ''}${comMilhar}${frac ? `${f.decimal}${frac}` : ''}`;
};

/** O mesmo número sem zero à toa no fim: 1 L, 1,5 L, 0,25 L — como se
    escreve à mão. `casas` é o MÁXIMO, e não o exato.

    ⚠️ ESTAVA ESCRITO DUAS VEZES, com a vírgula na mão nas duas: uma em
    logic/derive, chamada `litros`, e outra dentro do `aguaN` de
    logic/medidas, que trazia no comentário a frase "era o litros de
    derive" — o aviso de que a cópia existia, deixado por quem a fez. As
    duas continuam existindo, com os nomes que as telas chamam, e as duas
    passaram a pedir a conta aqui. */
export const numeroEnxuto = (x: number, casas = 2) => {
  const f = formato();
  const cru = numero(x, casas);
  return cru.includes(f.decimal) ? cru.replace(new RegExp(`\\${f.decimal}?0+$`), '') : cru;
};
