/* Tempo — helpers determinísticos (porta verbatim do protótipo). */
export const DAY = 864e5;
export const now = () => new Date();
export const startOfDay = (d: Date | number) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
export const daysAgo = (n: number) => new Date(Date.now() - n * DAY);
export const addDays = (d: Date | number, n: number) => new Date(+d + n * DAY);
export const diffDays = (a: Date | number, b: Date | number) => Math.round((+startOfDay(a) - +startOfDay(b)) / DAY);

export const WD = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
export const MO = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export const MO_LONG = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export const DOW_PT = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
export const DOW_SHORT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

export const fmtDate = (d: Date) => `${d.getDate()} ${MO[d.getMonth()]}`;

/* ⚠️ COM ANO, e é essa a diferença para os `dataLonga` espalhados pelas
   telas de registro. Lá o ano é ruído: ninguém precisa dele para ler a
   refeição de ontem. Aqui ele é o dado — "próxima cobrança em 18 de
   setembro" sem o ano não diz se é daqui a um mês ou a treze, e é
   exatamente essa a pergunta de quem está olhando uma tela de cobrança.

   As três telas de assinatura tinham a mesma função copiada. */
export const dataComAno = (t: number | Date) => {
  const d = new Date(t);
  return `${d.getDate()} de ${MO_LONG[d.getMonth()]} de ${d.getFullYear()}`;
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
  return `${d.getDate()} de ${MO_LONG[d.getMonth()]}`;
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
  return `${DOW_PT[d.getDay()]}, ${dataLonga(d)}`;
};

/* Um intervalo de dias, com o mês dito uma vez quando é o mesmo:
   "1 a 7 set", e "28 jul a 3 ago" quando a semana vira o mês. */
export const fmtPeriodo = (a: Date, b: Date) =>
  a.getMonth() === b.getMonth()
    ? `${a.getDate()} a ${b.getDate()} ${MO[b.getMonth()]}`
    : `${fmtDate(a)} a ${fmtDate(b)}`;
export const fmtWD = (d: Date) => WD[d.getDay()];
export const fmtTime = (d: Date) => `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
export const hm = (h: number, m: number) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

export function relDay(d: Date) {
  const n = diffDays(d, now());
  if (n === 0) return 'hoje'; if (n === -1) return 'ontem'; if (n === 1) return 'amanhã';
  if (n < 0) return `há ${-n} dias`; return `em ${n} dias`;
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
  label: dias <= 0 ? 'hoje' : dias === 1 ? 'amanhã' : `em ${dias} dias`,
});

/** A primeira letra em caixa alta. Existe porque um rótulo que nasce no
    meio de uma frase — "em 3 dias" — às vezes abre uma. */
export const maiuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const nf = (x: number, d = 1) => x.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
export const kg = (x: number) => nf(x, 1).replace('.', ',');

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

/** Casa decimal só quando existe: "68,0 kg" para uma meta redonda finge
 *  uma precisão que a pessoa não definiu, e numa fileira ao lado de
 *  "82,4 kg" a simetria dos dois faz o zero parecer medido. Difere de
 *  kgTxt por sair já com a vírgula, que é como o número aparece na tela
 *  e não no meio de uma frase. */
export const kgCurto = (n: number) => nf(n, n % 1 ? 1 : 0).replace('.', ',');

/** Mil e setecentas quilocalorias se escrevem "1.700". Sem o ponto, o
 *  número mais alto da tela é também o mais difícil de ler. */
export const milhar = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

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
