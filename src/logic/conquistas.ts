import type { State } from './seed';
import { MEDS } from './meds';
import { DAY, startOfDay, now, diffDays } from './time';

/* ESTE ARQUIVO NÃO IMPORTA O DERIVE, e o derive importa este. O caminho
   tem uma direção só de propósito: o derive já chama as conquistas — a
   linha do tempo e o aviso de conquista recente leem daqui —, e um
   import de volta fecharia um ciclo entre os dois maiores módulos de
   lógica do app. Ciclo em Metro não estoura, ele entrega `undefined` na
   ordem errada, o que é pior: quebra em um lugar e não no outro, e só às
   vezes. */
const cupMl = 250;
const metaDeCopos = (S: State) => ((S.profile as any).targets?.waterMl ?? 0) / cupMl;
const metaDeProt = (S: State) => (S.profile as any).targets?.prot ?? 0;
const metaDeExerc = (S: State) => (S.profile as any).targets?.exercMin ?? 0;
const M = (S: State) => MEDS[S.profile.med];

/* ============================================================
   CONQUISTAS — trilhas de nível, calculadas dos registros

   ⚠️ ELAS JÁ FORAM UMA LISTA FIXA NO ESTADO, com `done: true` escrito à
   mão — cinco marcadas como feitas desde o primeiro segundo do app, uma
   delas errada. Aqui cada uma é uma conta, e some se o registro que a
   fechou for apagado.

   E ELAS DEIXARAM DE SER AVULSAS. "5 check-ins", "10 check-ins" e "50
   check-ins" são a mesma conquista em três alturas, e como cartões
   separados elas enchiam a tela com o mesmo ícone e o mesmo título três
   vezes — enquanto a pergunta que interessa ("onde eu estou nisso?")
   ficava espalhada entre eles.

   Agora cada assunto é uma TRILHA com níveis. O cartão mostra o nível
   alcançado, quando ele veio, e quanto falta para o próximo. Vinte
   cartões dizem o que quarenta e seis diziam, e dizem melhor: a trilha
   guarda a progressão, que é a informação que os cartões avulsos
   perdiam.

   OS NÍVEIS SÃO CRESCENTES E ESPAÇADOS. Cinco, dez, vinte e cinco, e daí
   por diante: perto no começo, para quem está começando ter o que
   alcançar, e longe no fim, para quem está há um ano ainda ter. Um nível
   a cada dez seria uma escada que cansa antes de acabar.

   NENHUM NÍVEL SE PERDE, e isso é decisão: não há "semana perfeita" nem
   nada que só exista enquanto a pessoa não falhar. Conquista que se perde
   é conquista que cobra.
   ============================================================ */

export type Familia =
  | 'tratamento' | 'peso' | 'constancia' | 'hidratacao'
  | 'proteina' | 'movimento' | 'comida' | 'acompanhamento';

export const FAMILIAS: { id: Familia; nome: string }[] = [
  { id: 'tratamento', nome: 'Tratamento' },
  { id: 'peso', nome: 'Peso' },
  { id: 'constancia', nome: 'Constância' },
  { id: 'hidratacao', nome: 'Hidratação' },
  { id: 'proteina', nome: 'Proteína' },
  { id: 'movimento', nome: 'Movimento' },
  { id: 'comida', nome: 'Alimentação' },
  { id: 'acompanhamento', nome: 'Acompanhamento' },
];

export type Conquista = {
  id: string;
  familia: Familia;
  ic: string;
  titulo: string;
  /** quantos níveis já foram alcançados — 0 quando nenhum */
  nivel: number;
  /** quantos níveis a trilha tem */
  niveis: number;
  /** o que o nível atual (ou o primeiro, quando nenhum) representa */
  desc: string;
  /** quando o nível atual foi alcançado; null enquanto nenhum foi */
  t: number | null;
  /** 0..1 rumo ao PRÓXIMO nível; 1 quando a trilha acabou */
  pct: number;
  /** o que falta para o próximo; vazio quando a trilha acabou */
  falta: string;
};

/* ------------------------------------------------------------------ *
 * AS DUAS MÁQUINAS
 *
 * Toda trilha é uma contagem ou um valor que cresce, e as duas se
 * resumem à mesma dupla: quanto já foi feito, e em que instante cada
 * marca foi batida. O resto — nível, progresso, o que falta — sai daí.
 * ------------------------------------------------------------------ */

type Medida = { feito: number; quando: (alvo: number) => number | null };

/** A enésima vez que algo aconteceu. */
const porContagem = (datas: number[]): Medida => {
  const d = [...datas].sort((a, b) => a - b);
  return { feito: d.length, quando: (n) => (d.length >= n ? d[n - 1] : null) };
};

/** Um valor que cresce: a data é a do primeiro registro que cruzou. */
const porValor = (serie: { t: number; v: number }[], atual: number): Medida => {
  const s = [...serie].sort((a, b) => a.t - b.t);
  return { feito: atual, quando: (alvo) => s.find((x) => x.v >= alvo)?.t ?? null };
};

const diaDe = (t: number) => +startOfDay(new Date(t));

/* A MAIOR SEQUÊNCIA de dias colados, e o dia em que ela passou por cada
   altura. Sem esse segundo dado a trilha saberia que a pessoa chegou a
   trinta dias e não saberia quando chegou a sete. */
function porSequencia(S: State, vale: (c: any) => boolean): Medida {
  const bons = (S.checkins as any[]).filter(vale).map((c) => diaDe(c.t)).sort((a, b) => a - b);
  const primeiraVez = new Map<number, number>();
  let melhor = 0; let n = 0; let anterior: number | null = null;
  for (const d of bons) {
    n = anterior != null && d - anterior === DAY ? n + 1 : 1;
    if (!primeiraVez.has(n)) primeiraVez.set(n, d);
    if (n > melhor) melhor = n;
    anterior = d;
  }
  return { feito: melhor, quando: (alvo) => primeiraVez.get(alvo) ?? null };
}

/* QUANTOS DIAS DE UMA MESMA SEMANA bateram a condição. A semana é a
   janela de sete dias que mais rendeu, e não a do calendário: quem bebe
   água de quinta a segunda cumpriu cinco dias, e dizer que não porque a
   semana virou no domingo seria o app discutindo calendário com alguém. */
function porJanela(S: State, vale: (c: any) => boolean): Medida {
  const bons = new Set((S.checkins as any[]).filter(vale).map((c) => diaDe(c.t)));
  const todos = [...bons].sort((a, b) => a - b);
  const primeiraVez = new Map<number, number>();
  let melhor = 0;
  for (const d0 of todos) {
    let n = 0; let ultimo = d0;
    for (let k = 0; k < 7; k++) {
      const d = d0 + k * DAY;
      if (bons.has(d)) { n++; ultimo = d; }
    }
    for (let k = 1; k <= n; k++) if (!primeiraVez.has(k)) primeiraVez.set(k, ultimo);
    if (n > melhor) melhor = n;
  }
  return { feito: melhor, quando: (alvo) => primeiraVez.get(alvo) ?? null };
}

const diasEm = (S: State, vale: (c: any) => boolean) =>
  (S.checkins as any[]).filter(vale).map((c) => diaDe(c.t)).sort((a, b) => a - b);

const respondeu = (c: any, campo: string) => c?.[campo] != null && !Number.isNaN(c[campo]);
const um = (n: number) => n.toFixed(1).replace('.', ',');
const inteiro = (n: number) => String(Math.ceil(n));

/* ------------------------------------------------------------------ *
 * O CATÁLOGO
 * ------------------------------------------------------------------ */

type Trilha = {
  id: string; familia: Familia; ic: string; titulo: string;
  /** as alturas da trilha, em ordem crescente */
  niveis: number[];
  /** o que aquele nível representa, escrito por extenso */
  desc: (alvo: number) => string;
  /** o que falta para ele */
  falta: (resta: number, alvo: number) => string;
  medida: (S: State) => Medida;
  /** some da lista quando a pergunta não faz sentido para esta pessoa */
  vale?: (S: State) => boolean;
};

const plural = (n: number, s: string, p = s + 's') => `${n} ${n === 1 ? s : p}`;

const CATALOGO: Trilha[] = [
  /* ---------------- tratamento ---------------- */
  {
    id: 'doses', familia: 'tratamento', ic: 'syringe', titulo: 'Aplicações',
    niveis: [1, 4, 12, 26, 52, 104],
    desc: (a) => `${plural(a, 'aplicação', 'aplicações')} registrada${a === 1 ? '' : 's'}`,
    falta: (r) => `Faltam ${plural(r, 'aplicação', 'aplicações')}`,
    medida: (S) => porContagem((S.injections as any[]).map((i) => i.t)),
  },
  {
    id: 'tempo', familia: 'tratamento', ic: 'cal', titulo: 'Tempo de tratamento',
    niveis: [30, 90, 180, 365, 730],
    desc: (a) => (a < 365 ? `${a / 30} ${a === 30 ? 'mês' : 'meses'} desde a primeira dose` : `${a / 365} ano${a > 365 ? 's' : ''} desde a primeira dose`),
    falta: (r) => `Faltam ${plural(r, 'dia')}`,
    medida: (S) => {
      const i1 = (S.injections as any[])[0];
      if (!i1) return { feito: 0, quando: () => null };
      const d0 = diaDe(i1.t);
      return { feito: diffDays(now(), new Date(d0)), quando: (a) => (diffDays(now(), new Date(d0)) >= a ? d0 + a * DAY : null) };
    },
  },
  {
    /* O RODÍZIO NÃO É ENFEITE: repetir o mesmo ponto causa nódulo, e
       alternar é orientação de bula. É a única trilha que premia uma
       prática de segurança, e a única com um teto natural — são seis
       locais, e não há sétimo. */
    id: 'rodizio', familia: 'tratamento', ic: 'troca', titulo: 'Rodízio',
    niveis: [2, 4, 6],
    desc: (a) => `${plural(a, 'local', 'locais')} de aplicação usado${a === 1 ? '' : 's'}`,
    falta: (r) => `Faltam ${plural(r, 'local', 'locais')}`,
    medida: (S) => {
      const vistos = new Set<string>();
      const quando = new Map<number, number>();
      for (const i of S.injections as any[]) {
        vistos.add(i.site);
        if (!quando.has(vistos.size)) quando.set(vistos.size, i.t);
      }
      return { feito: vistos.size, quando: (a) => quando.get(a) ?? null };
    },
  },
  {
    id: 'titulacao', familia: 'tratamento', ic: 'dose', titulo: 'Titulação',
    vale: (S) => (M(S).doses?.length ?? 0) > 1,
    niveis: [], // preenchida abaixo, a partir da escada do medicamento
    desc: (a) => `Chegar à dose de ${a}`,
    falta: (_r, a) => `Próxima: ${a}`,
    medida: (S) => {
      const injs = (S.injections as any[]).slice().sort((x, y) => x.t - y.t);
      return {
        feito: S.profile.dose || 0,
        quando: (a) => injs.find((i) => i.dose >= a)?.t ?? null,
      };
    },
  },

  /* ---------------- peso ---------------- */
  {
    id: 'kg', familia: 'peso', ic: 'scale', titulo: 'Quilos a menos',
    niveis: [2, 5, 10, 15, 20, 30],
    desc: (a) => `${a} kg abaixo do peso inicial`,
    falta: (r) => `Faltam ${um(r)} kg`,
    medida: (S) => {
      const ini = S.profile.startWeight;
      const pesos = (S.weights as any[]).map((w) => ({ t: w.t, v: ini - w.kg }));
      const atual = pesos.length ? ini - (S.weights as any[])[S.weights.length - 1].kg : 0;
      return porValor(pesos, Math.max(0, atual));
    },
  },
  {
    /* A PORCENTAGEM É OUTRA CONVERSA, e não uma repetição dos quilos: os
       cinco por cento são a marca clínica que a literatura usa, e dez
       quilos significam coisas diferentes em corpos diferentes. */
    id: 'pct', familia: 'peso', ic: 'trend', titulo: 'Percentual perdido',
    niveis: [5, 10, 15, 20],
    desc: (a) => `${a}% do peso inicial`,
    falta: (r) => `Faltam ${um(r)} pontos`,
    medida: (S) => {
      const ini = S.profile.startWeight;
      const pesos = (S.weights as any[]).map((w) => ({ t: w.t, v: ((ini - w.kg) / ini) * 100 }));
      const ultimo = (S.weights as any[])[S.weights.length - 1];
      const atual = ultimo ? ((ini - ultimo.kg) / ini) * 100 : 0;
      return porValor(pesos, Math.max(0, atual));
    },
  },
  {
    id: 'pesagens', familia: 'peso', ic: 'scale', titulo: 'Pesagens',
    niveis: [1, 10, 25, 50, 100],
    desc: (a) => `${plural(a, 'peso')} registrado${a === 1 ? '' : 's'}`,
    falta: (r) => `Faltam ${plural(r, 'pesagem', 'pesagens')}`,
    medida: (S) => porContagem((S.weights as any[]).map((w) => w.t)),
  },

  /* ---------------- constância ---------------- */
  {
    id: 'checkins', familia: 'constancia', ic: 'check', titulo: 'Check-ins',
    niveis: [1, 5, 10, 25, 50, 100, 200, 365],
    desc: (a) => `${plural(a, 'dia')} respondido${a === 1 ? '' : 's'}`,
    falta: (r) => `Faltam ${plural(r, 'dia')}`,
    medida: (S) => porContagem(diasEm(S, (c) => respondeu(c, 'mood'))),
  },
  {
    id: 'sequencia', familia: 'constancia', ic: 'spark', titulo: 'Dias seguidos',
    niveis: [3, 7, 15, 30, 60, 100],
    desc: (a) => `${plural(a, 'check-in')} em dias seguidos`,
    falta: (r, a) => `Faltam ${plural(r, 'dia')} para ${a}`,
    medida: (S) => porSequencia(S, (c) => respondeu(c, 'mood')),
  },

  /* ---------------- hidratação ---------------- */
  {
    id: 'agua-dias', familia: 'hidratacao', ic: 'water', titulo: 'Dias na meta de água',
    niveis: [1, 7, 30, 100, 200],
    desc: (a) => `${plural(a, 'dia')} de água cumprida`,
    falta: (r) => `Faltam ${plural(r, 'dia')}`,
    medida: (S) => porContagem(diasEm(S, (c) => (c?.agua ?? 0) >= metaDeCopos(S))),
  },
  {
    id: 'agua-semana', familia: 'hidratacao', ic: 'drop', titulo: 'Semana hidratada',
    niveis: [3, 5, 7],
    desc: (a) => `${plural(a, 'dia')} na meta, na mesma semana`,
    falta: (r, a) => `Faltam ${plural(r, 'dia')} para ${a}`,
    medida: (S) => porJanela(S, (c) => (c?.agua ?? 0) >= metaDeCopos(S)),
  },

  /* ---------------- proteína ---------------- */
  {
    id: 'prot-dias', familia: 'proteina', ic: 'flame', titulo: 'Dias na meta de proteína',
    vale: (S) => metaDeProt(S) > 0,
    niveis: [1, 7, 30, 100, 200],
    desc: (a) => `${plural(a, 'dia')} na meta do perfil`,
    falta: (r) => `Faltam ${plural(r, 'dia')}`,
    medida: (S) => porContagem(diasEm(S, (c) => (c?.prot ?? 0) >= metaDeProt(S))),
  },
  {
    id: 'prot-seq', familia: 'proteina', ic: 'flame', titulo: 'Proteína seguida',
    vale: (S) => metaDeProt(S) > 0,
    niveis: [3, 7, 14, 30],
    desc: (a) => `${plural(a, 'dia')} seguidos na meta`,
    falta: (r, a) => `Faltam ${plural(r, 'dia')} para ${a}`,
    medida: (S) => porSequencia(S, (c) => (c?.prot ?? 0) >= metaDeProt(S)),
  },

  /* ---------------- movimento ---------------- */
  {
    id: 'treinos', familia: 'movimento', ic: 'dumbbell', titulo: 'Treinos',
    niveis: [1, 10, 25, 50, 100, 250],
    desc: (a) => `${plural(a, 'sessão', 'sessões')} registrada${a === 1 ? '' : 's'}`,
    falta: (r) => `Faltam ${plural(r, 'treino')}`,
    medida: (S) => {
      /* Conta SESSÕES, e não dias: quem treina de manhã e à noite fez
         dois treinos. */
      const datas: number[] = [];
      for (const c of (S.checkins as any[]).slice().sort((a, b) => a.t - b.t)) {
        for (let k = 0; k < (c.treinos?.length ?? 0); k++) datas.push(diaDe(c.t));
      }
      return porContagem(datas);
    },
  },
  {
    id: 'exerc-semana', familia: 'movimento', ic: 'activity', titulo: 'Semana ativa',
    vale: (S) => metaDeExerc(S) > 0,
    niveis: [3, 5, 7],
    desc: (a) => `${plural(a, 'dia')} na meta de movimento, na mesma semana`,
    falta: (r, a) => `Faltam ${plural(r, 'dia')} para ${a}`,
    medida: (S) => porJanela(S, (c) => (c?.exerc ?? 0) >= metaDeExerc(S)),
  },

  /* ---------------- alimentação ---------------- */
  {
    id: 'refeicoes', familia: 'comida', ic: 'utensils', titulo: 'Refeições',
    niveis: [1, 25, 100, 365, 1000],
    desc: (a) => `${plural(a, 'prato')} registrado${a === 1 ? '' : 's'}`,
    falta: (r) => `Faltam ${plural(r, 'refeição', 'refeições')}`,
    medida: (S) => porContagem((S.meals as any[]).map((m) => m.t)),
  },
  {
    id: 'favoritos', familia: 'comida', ic: 'star', titulo: 'Pratos favoritos',
    niveis: [1, 5, 12],
    desc: (a) => `${plural(a, 'prato')} guardado${a === 1 ? '' : 's'} para repetir`,
    falta: (r) => `Faltam ${plural(r, 'prato')}`,
    medida: (S) => {
      /* O favorito não guarda data. O que existe é a lista — então a
         data de cada nível é a da refeição mais antiga, que é quando a
         comida entrou na rotina. É uma aproximação, e está dita aqui em
         vez de virar um carimbo que finge precisão. */
      const n = ((S as any).favMeals ?? []).length;
      const primeira = (S.meals as any[]).map((m) => m.t).sort((a, b) => a - b)[0] ?? null;
      return { feito: n, quando: (a) => (n >= a ? primeira : null) };
    },
  },

  /* ---------------- acompanhamento ---------------- */
  {
    id: 'fotos', familia: 'acompanhamento', ic: 'camera', titulo: 'Fotos de progresso',
    niveis: [1, 3, 6, 12],
    desc: (a) => `${plural(a, 'foto')} guardada${a === 1 ? '' : 's'}`,
    falta: (r) => `Faltam ${plural(r, 'foto')}`,
    medida: (S) => porContagem((S.photos as any[]).map((p) => p.t)),
  },
  {
    id: 'medidas', familia: 'acompanhamento', ic: 'ruler', titulo: 'Medidas de fita',
    niveis: [1, 3, 6, 12],
    desc: (a) => `${plural(a, 'medição', 'medições')} registrada${a === 1 ? '' : 's'}`,
    falta: (r) => `Faltam ${plural(r, 'medição', 'medições')}`,
    medida: (S) => porContagem((S.measures as any[]).map((m) => m.t)),
  },
  {
    id: 'cintura', familia: 'acompanhamento', ic: 'ruler', titulo: 'Centímetros de cintura',
    vale: (S) => (S.measures as any[]).some((m) => m.cintura != null),
    niveis: [2, 5, 10, 15],
    desc: (a) => `${a} cm a menos na cintura`,
    falta: (r) => `Faltam ${um(r)} cm`,
    medida: (S) => {
      const ms = (S.measures as any[]).filter((m) => m.cintura != null).sort((a, b) => a.t - b.t);
      if (!ms.length) return { feito: 0, quando: () => null };
      const ini = ms[0].cintura;
      const serie = ms.map((m) => ({ t: m.t, v: ini - m.cintura }));
      return porValor(serie, Math.max(0, ini - ms[ms.length - 1].cintura));
    },
  },
  {
    id: 'exames', familia: 'acompanhamento', ic: 'doc', titulo: 'Exames',
    niveis: [1, 3, 6],
    desc: (a) => `${plural(a, 'painel', 'painéis')} importado${a === 1 ? '' : 's'}`,
    falta: (r) => `Faltam ${plural(r, 'exame')}`,
    medida: (S) => porContagem((S.examBundles as any[]).map((b) => b.t)),
  },
  {
    id: 'consultas', familia: 'acompanhamento', ic: 'steth', titulo: 'Consultas',
    niveis: [1, 3, 6, 12],
    desc: (a) => `${plural(a, 'consulta')} no histórico`,
    falta: (r) => `Faltam ${plural(r, 'consulta')}`,
    medida: (S) => porContagem((S.consultsHistory as any[]).map((c) => c.t)),
  },
];

/* A TITULAÇÃO TEM OS NÍVEIS DO MEDICAMENTO, e não uma escada escrita
   aqui: cada caneta tem a sua, e o catálogo de medicamentos é quem sabe.
   A primeira dose não entra como nível — chegar nela é o próprio começo,
   e já é a primeira aplicação. */
const niveisDaTrilha = (t: Trilha, S: State): number[] =>
  (t.id === 'titulacao' ? (M(S).doses ?? []).slice(1) : t.niveis);

export function conquistas(S: State): Conquista[] {
  return CATALOGO
    .filter((t) => !t.vale || t.vale(S))
    .map((t): Conquista => {
      const niveis = niveisDaTrilha(t, S);
      const { feito, quando } = t.medida(S);

      /* O NÍVEL É QUANTAS ALTURAS FORAM PASSADAS. Conta pelo valor, e não
         pela data: quem apagou o registro que cruzou uma marca antiga mas
         está acima dela hoje continua tendo passado por ali. */
      let nivel = 0;
      for (const alvo of niveis) if (feito >= alvo) nivel++;

      const atual = nivel > 0 ? niveis[nivel - 1] : null;
      const proximo = nivel < niveis.length ? niveis[nivel] : null;
      const anterior = nivel > 0 ? niveis[nivel - 1] : 0;

      return {
        id: t.id, familia: t.familia, ic: t.ic, titulo: t.titulo,
        nivel, niveis: niveis.length,
        desc: t.desc(atual ?? niveis[0] ?? 0),
        t: atual != null ? quando(atual) : null,
        /* O PROGRESSO É DENTRO DO NÍVEL, e não do total. De cinquenta para
           cem check-ins, estar em setenta é quarenta por cento do trecho —
           e setenta por cento seria uma barra quase cheia que não anda mais
           por trinta dias. */
        pct: proximo == null ? 1 : Math.max(0, Math.min(1, (feito - anterior) / (proximo - anterior))),
        falta: proximo == null ? '' : t.falta(Math.max(0, proximo - feito), proximo),
      };
    });
}

/* A TRILHA INTEIRA, degrau a degrau, com a data de cada um.

   A conquista resumida guarda só o nível atual, que é o que o cartão da
   grade precisa. Quem abre a trilha quer a progressão — e ela existe: a
   medida sabe responder "quando cheguei a cada altura", e é essa resposta
   que o resumo joga fora ao ficar com uma data só. */
export function degrausDe(S: State, id: string) {
  const t = CATALOGO.find((x) => x.id === id);
  if (!t || (t.vale && !t.vale(S))) return null;
  const niveis = niveisDaTrilha(t, S);
  const { feito, quando } = t.medida(S);
  let nivel = 0;
  for (const alvo of niveis) if (feito >= alvo) nivel++;
  const proximo = nivel < niveis.length ? niveis[nivel] : null;
  return {
    id: t.id, titulo: t.titulo, ic: t.ic, nivel,
    degraus: niveis.map((alvo) => ({
      alvo, desc: t.desc(alvo),
      /* A data existe só para o degrau passado. Guardar a de um degrau
         que não veio seria inventar futuro. */
      t: feito >= alvo ? quando(alvo) : null,
    })),
    falta: proximo == null ? '' : t.falta(Math.max(0, proximo - feito), proximo),
  };
}

/* ------------------------------------------------------------------ *
 * O QUE AINDA NÃO FOI VISTO
 *
 * A conquista é calculada, e por isso ela não tem um "aconteceu agora":
 * ela simplesmente passa a ser verdade na hora em que o registro entra.
 * Para o app poder DIZER que aconteceu, falta uma coisa que a conta não
 * dá — o que a pessoa já sabe.
 *
 * É o que esta marca d'água guarda: o último nível de cada trilha que já
 * foi mostrado. Um número por trilha, nada mais. Não é uma segunda fonte
 * da conquista — a conquista continua saindo dos registros —, é a
 * memória do que já foi contado.
 *
 * ELA NASCE NO NÍVEL ATUAL, e não em zero. Quem já usa o app tem trinta
 * e nove níveis; começar do zero faria a primeira abertura depois desta
 * mudança comemorar trinta e nove coisas de uma vez, a maioria de meses
 * atrás. Ver ensureDefaults em seed.ts.
 * ------------------------------------------------------------------ */

export type VistoEm = Record<string, number>;

export const vistoEm = (S: State): VistoEm => ((S as any).vistoEmConquistas ?? {}) as VistoEm;

/** As trilhas que subiram de nível desde a última vez que o app contou. */
export const novosNiveis = (S: State): Conquista[] => {
  const visto = vistoEm(S);
  return conquistas(S).filter((q) => q.nivel > (visto[q.id] ?? 0));
};

/** A marca d'água no nível de agora — o que a pessoa passou a saber. */
export const marcarComoVistas = (S: any) => {
  const visto: VistoEm = S.vistoEmConquistas ?? (S.vistoEmConquistas = {});
  for (const q of conquistas(S)) visto[q.id] = q.nivel;
};

/** Quantos níveis foram alcançados, somando as trilhas. */
export const niveisFeitos = (l: Conquista[]) => l.reduce((n, q) => n + q.nivel, 0);
export const niveisTotais = (l: Conquista[]) => l.reduce((n, q) => n + q.niveis, 0);

/* COM NÍVEL, DA MAIS RECENTE PARA A MAIS ANTIGA — o último nível é a
   notícia; os antigos são a estante. */
export const feitas = (l: Conquista[]) =>
  l.filter((x) => x.nivel > 0).sort((a, b) => (b.t ?? 0) - (a.t ?? 0));

/* SEM NÍVEL, DA MAIS PERTO PARA A MAIS LONGE: a que está a um passo é a
   única que muda o que a pessoa faz hoje. */
export const aCaminho = (l: Conquista[]) =>
  l.filter((x) => x.nivel === 0).sort((a, b) => b.pct - a.pct);

/* O QUE O RESTO DO APP LÊ. A linha do tempo e o aviso de conquista
   recente querem um evento com título e data — o nível alcançado, e não a
   trilha inteira. */
export const eventosDeConquista = (S: State) =>
  feitas(conquistas(S))
    .filter((q) => q.t != null)
    .map((q) => ({
      id: `${q.id}-${q.nivel}`, ic: q.ic, t: q.t!,
      /* O id do EVENTO tem o nível junto, porque dois níveis da mesma
         trilha são dois momentos distintos na linha do tempo. A trilha
         em si não tem nível: é a ela que se abre, e é por isso que o id
         dela vai separado em vez de ser extraído do outro com um split. */
      trilha: q.id,
      title: `${q.titulo} · nível ${q.nivel}`, desc: q.desc,
    }));
