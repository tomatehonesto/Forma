import { MERCADO } from './mercado';

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

export type Local = 'pt-BR' | 'en-US';

/* O caminho de quem não respondeu é o do build. Ver logic/mercado. */
const PADRAO: Local = MERCADO === 'us' ? 'en-US' : 'pt-BR';

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

const FORMATOS: Record<Local, Formato> = { 'pt-BR': PT, 'en-US': EN };

/* ------------------------------------------------------------------ *
 * QUAL É O LOCAL AGORA
 * ------------------------------------------------------------------ */

let escolhido: Local | null = null;
let doAparelho: Local | null = null;
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

/** Trocar à mão. Ainda não há tela que chame isto: existe para a
    tradução e para a rede de congelamento, que precisa escrever os dois
    locais no mesmo teste. `null` devolve a escolha ao aparelho. */
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

    /* Só existem dois catálogos possíveis. Quem fala outra língua cai no
       do mercado, que é o único texto que o build carrega. */
    doAparelho = l.languageCode === 'en' ? 'en-US' : l.languageCode === 'pt' ? 'pt-BR' : PADRAO;
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
