import { formato, hora12, numero } from './local';
import { T } from '../textos';

/* Tempo — helpers determinísticos (porta verbatim do protótipo). */
export const DAY = 864e5;
export const now = () => new Date();
export const startOfDay = (d: Date | number) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
export const daysAgo = (n: number) => new Date(Date.now() - n * DAY);
export const addDays = (d: Date | number, n: number) => new Date(+d + n * DAY);
export const diffDays = (a: Date | number, b: Date | number) => Math.round((+startOfDay(a) - +startOfDay(b)) / DAY);

/* ⚠️⚠️ SÃO FUNÇÕES, E ISSO NÃO É ESTILO. Constante de módulo é avaliada
   uma vez, no import, e congelaria o primeiro local que o aplicativo viu:
   trocar de idioma não teria efeito nenhum sobre nome de mês, e nada
   acusaria — nem o tsc, nem o app, só a tela de alguém em inglês com
   "setembro" escrito.

   Foi exatamente assim que a extração de textos apagou o rodízio de
   locais de aplicação, e essa história está no README de src/textos. A
   regra que saiu de lá vale aqui inteira: se a tabela lê o local, ela é
   função.

   ⚠️ E O `DOW_SHORT` MORREU. Ele era `WD` escrito de novo, letra por
   letra, com outro nome — duas listas idênticas onde uma ia envelhecer
   sozinha. Os dois usos dele, em logic/alertas, passaram para o `WD`. */
export const WD = () => formato().diaCurto;
export const MO = () => formato().mesCurto;
export const MO_LONG = () => formato().mesLongo;
export const DOW_PT = () => formato().diaLongo;

/** "20 set".

    ⚠️ ACEITA NÚMERO, e antes só aceitava Date — e era por isso que seis
    telas tinham a própria cópia dela. Caneta, histórico e semana
    chamavam-na de `curto`; evolução, medidas e saúde, de `dia`. Todas as
    seis faziam a mesma coisa: `new Date(t)` e depois o que esta linha
    faz.

    A barreira era de tipo, não de formato. Quem tinha um timestamp na mão
    — que é o que o estado guarda — não conseguia usar a função da casa
    sem escrever um `new Date` antes, e escrever a função inteira era só
    um caractere a mais de trabalho. A conversão desce para cá, como já
    tinha descido em `dataComAno` e `dataLonga`. */
export const fmtDate = (t: number | Date) => {
  const d = new Date(t);
  return formato().curta(d.getDate(), d.getMonth());
};

/* ⚠️ COM ANO, e é essa a diferença para os `dataLonga` espalhados pelas
   telas de registro. Lá o ano é ruído: ninguém precisa dele para ler a
   refeição de ontem. Aqui ele é o dado — "próxima cobrança em 18 de
   setembro" sem o ano não diz se é daqui a um mês ou a treze, e é
   exatamente essa a pergunta de quem está olhando uma tela de cobrança.

   As três telas de assinatura tinham a mesma função copiada. */
export const dataComAno = (t: number | Date) => {
  const d = new Date(t);
  return formato().comAno(d.getDate(), d.getMonth(), d.getFullYear());
};

/** "20 de setembro".

    ⚠️ ESTAVA COPIADA SEIS VEZES, E COM DOIS NOMES. Chamava-se `dataLonga`
    em exportar, nota e notas, e `porExtenso` em exames e marcador — e a
    tela de registro escrevia a expressão direto no corpo. Dois nomes para
    a mesma frase é pior que seis cópias de um: quem procura por um deles
    conclui que o outro não existe e escreve o sétimo.

    Fica ao lado de `dataComAno`, que é esta mesma com o ano, e que já
    tinha nascido de uma consolidação igual a esta. */
export const dataLonga = (t: number | Date) => {
  const d = new Date(t);
  return formato().longa(d.getDate(), d.getMonth());
};

/** "quarta, 20 de setembro".

    ⚠️ ESTAVA COPIADA OITO VEZES, E AS CÓPIAS DISCORDAVAM. Cinco delas
    vinham com a inicial maiúscula embutida — aplicação, aplicação-ok
    (duas), dia e peso — e três em minúscula: caneta, ciclo e refeição.

    Nenhuma das duas estava errada, e é isso que torna a cópia ruim: em
    "Última dose desta caneta: quarta, 23 de setembro" a minúscula é a
    certa, e como título de tela a maiúscula é. A forma natural da frase é
    a minúscula; quem abre uma frase com ela envolve em `maiuscula`, e a
    decisão fica visível na linha que a toma em vez de escondida em cinco
    formatadores parecidos. */
export const dataComDiaDaSemana = (t: number | Date) => {
  const d = new Date(t);
  return formato().comDiaDaSemana(DOW_PT()[d.getDay()], dataLonga(d));
};

/* Um intervalo de dias, com o mês dito uma vez quando é o mesmo:
   "1 a 7 set", e "28 jul a 3 ago" quando a semana vira o mês. */
export const fmtPeriodo = (a: Date, b: Date) =>
  a.getMonth() === b.getMonth()
    ? formato().periodo(a.getDate(), b.getDate(), b.getMonth())
    : formato().junta(fmtDate(a), fmtDate(b));
export const fmtWD = (d: Date) => WD()[d.getDay()];

/** "maio de 2026" — o cabeçalho do calendário.

    ⚠️ ERA MONTADO NA PRÓPRIA TELA, com o "de" no meio da interpolação. O
    inglês não tem esse "de": lá é "May 2026". */
export const fmtMesAno = (d: Date) => formato().mesAno(d.getMonth(), d.getFullYear());

/** "13 a 19 de maio" — o intervalo com o mês por extenso.

    ⚠️ ESTAVA ESCRITO À MÃO na tela da semana, com o nome do mês vindo da
    tabela e o "de" no meio da interpolação. Em inglês aquilo sairia "13 a
    19 de May": a frase era portuguesa por dentro e ninguém veria isso até
    a tradução chegar. É o mesmo motivo de todos os outros formatadores
    daqui existirem. */
export const fmtPeriodoLongo = (a: Date, b: Date) =>
  a.getMonth() === b.getMonth()
    ? formato().periodoLongo(a.getDate(), b.getDate(), b.getMonth())
    : formato().junta(dataLonga(a), dataLonga(b));

/* ⚠️ O RELÓGIO É DE DOZE HORAS EM INGLÊS, e "14:30" não é uma hora que
   alguém leia lá sem converter de cabeça. O zero à esquerda também some:
   "08:30 AM" não se escreve, "8:30 AM" sim. Quem manda é `hora12`, que
   ouve o idioma e deixa o aparelho discordar — ver logic/local. */
const relogio = (h: number, m: number, zero: boolean) => {
  const mm = String(m).padStart(2, '0');
  if (!hora12()) return `${zero ? String(h).padStart(2, '0') : h}:${mm}`;
  const meio = h < 12 ? 'AM' : 'PM';
  return `${h % 12 === 0 ? 12 : h % 12}:${mm} ${meio}`;
};

export const fmtTime = (d: Date) => relogio(d.getHours(), d.getMinutes(), false);
export const hm = (h: number, m: number) => relogio(h, m, true);

export function relDay(d: Date) {
  const n = diffDays(d, now());
  return T.tempo.relativo(n);
}
/** O "daqui a quanto" das coisas marcadas: aplicação e consulta.

    ⚠️ A MESMA ESCADA ESTAVA ESCRITA SETE VEZES — na Home, na Jornada, em
    Aplicações, no `doseContext`, no `nextConsult`, no `todayBrief` e no aviso
    do dia. Idênticas as sete, e o que importa nelas não é o texto: é o
    DEGRAU. Bastava alguém decidir que atrasado não é "hoje" para o
    aplicativo passar a dizer duas coisas sobre a mesma dose, e nada no
    código apontaria as outras seis.

    ⚠️ E NÃO É O `relDay` logo acima. Ele sabe olhar para trás — "ontem",
    "há 3 dias" — e é o certo para uma coleta ou uma consulta que já
    passou. Aqui o passado não existe: dose vencida é dose para tomar
    AGORA, e por isso tudo que é ≤ 0 lê "hoje". Misturar os dois faria a
    aplicação atrasada aparecer como "há 2 dias", que é descrição de
    arquivo, não de tarefa.

    Devolve o rótulo e o degrau, e não só o rótulo: cada tela escreve a
    própria frase — "Mounjaro é hoje", "dose hoje", "Hoje" — e precisa
    saber qual ramo está escrevendo sem repetir o teste. */
export const quandoEm = (dias: number) => ({
  dias,
  hoje: dias <= 0,
  label: T.tempo.daquiA(dias),
});

/** A primeira letra em caixa alta. Existe porque um rótulo que nasce no
    meio de uma frase — "em 3 dias" — às vezes abre uma. */
export const maiuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** O número como o local escreve — vírgula decimal e ponto de milhar em
    português, o contrário em inglês.

    ⚠️ A CONTA MUDOU DE CASA, E O NOME FICOU. Ela mora em logic/local, com
    o resto do que muda de idioma para idioma, e a história de por que ela
    não usa `toLocaleString` está lá. Aqui fica o nome que trinta arquivos
    já chamam: trocar a implementação sem tocar em nenhum sítio de chamada
    é justamente o que um funil serve para permitir. */
export const nf = numero;
export const kg = (x: number) => nf(x, 1);

/* ------------------------------------------------------------------ *
 * OS TRÊS FORMATADORES DE NÚMERO EM TEXTO
 *
 * Moravam dentro de cadastro.tsx, e saíram de lá quando a tela de plano
 * virou rota própria: as duas telas escrevem os mesmos números, e duas
 * cópias de uma regra de arredondamento é como começam as divergências.
 * ------------------------------------------------------------------ */

/** O número em prosa: a régua escreve 10,0 porque anda de 0,1 em 0,1, e
 *  dentro dela a casa decimal é informação. Numa frase, ninguém diz
 *  "perder dez vírgula zero quilos". */
export const kgTxt = (v: number) => nf(v, v % 1 === 0 ? 0 : 1);

/* ⚠️ O kgCurto MORREU AQUI, e ele era o kgTxt com um replace no fim.
   A diferença que o comentário dele defendia — "sai já com a vírgula" —
   deixou de existir no instante em que o nf passou a garantir a vírgula
   para todo mundo. Os seis usos dele foram para o kgTxt. */

/** Mil e setecentas quilocalorias se escrevem "1.700". Sem o ponto, o
 *  número mais alto da tela é também o mais difícil de ler. */
export const milhar = (n: number) => nf(n, 0);

/** Em que semana do tratamento cai uma data — 1 no primeiro dia.

    ⚠️ ELA ESTAVA ESCRITA CINCO VEZES, em duas grafias diferentes:
    `floor(dias/7) + 1` no `weekGrid`, e `ceil((dias + 1) / 7)` nas telas de
    refeição, de registro, de treino e no `ensureDefaults`. As duas dão o
    mesmo número — é uma identidade aritmética para inteiro não negativo —
    e essa é justamente a parte perigosa: quem mexesse numa não teria
    como desconfiar que estava separando-a das outras quatro.

    Mora aqui, e não em derive, porque é conta de calendário e porque a
    semente também precisa dela: `derive` importa `State` da semente, e um
    `import` de valor no sentido contrário fecharia o ciclo. Todos os cinco
    lugares já liam deste arquivo.

    Sem data de início não há jornada: dividir por sete uma data que é
    zero devolveria a semana em que o mundo começou a contar o tempo. */
export const semanaDoTratamento = (quando: Date | number, inicio: number) =>
  inicio ? Math.max(1, Math.floor(diffDays(quando, new Date(inicio)) / 7) + 1) : 1;

/** A dose com as casas que ela tem, e não com uma casa fixa: 0,25 mg
 *  precisa de duas, 2,5 de uma, 15 de nenhuma. */
export const doseTxt = (d: number) =>
  nf(d, d % 1 === 0 ? 0 : Math.round(d * 10) === d * 10 ? 1 : 2);
