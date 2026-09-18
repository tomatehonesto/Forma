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
   CONQUISTAS — calculadas, e não concedidas

   ⚠️ ELAS ERAM UMA LISTA FIXA NO ESTADO, com `done: true` escrito à mão.
   Cinco vinham marcadas como feitas desde o primeiro segundo do
   aplicativo, e uma delas estava errada: "Dez semanas" vinha comemorada
   no dia 67.

   Aqui cada uma é uma conta sobre os registros, e sabe QUANDO aconteceu:
   a data vem do registro que fechou a conta. Apagar esse registro desfaz
   a conquista, porque ela deixou de ter acontecido.

   O CATÁLOGO É DECLARATIVO porque são mais de trinta. Cada uma diz o que
   conta, quanto precisa e onde buscar — e a máquina lá embaixo transforma
   isso em "feito / a caminho / faltam tantos". Trinta funções escritas à
   mão divergiriam na décima: uma arredondaria diferente, outra esqueceria
   o caso de lista vazia.

   TODA CONQUISTA É UM MARCO DE CONTAGEM ou um marco de VALOR:

     contar   a enésima vez que algo aconteceu — a data é a da enésima
     valor    uma linha que foi cruzada — a data é a do registro que cruzou

   Não há conquista de "faça isso todo dia para sempre", e isso é
   decisão: uma que só se perde é uma que cobra. Aqui o que foi
   conquistado fica.

   E NENHUMA DEPENDE DE JULGAMENTO. Não há "semana perfeita" nem "você
   falhou": as trinta e quatro contam coisas que a pessoa fez, e a que
   ainda não veio diz quanto falta, não o que deu errado.
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
  desc: string;
  /** o instante do registro que fechou a conta; null enquanto não fechou */
  t: number | null;
  /** 0..1, o quanto já andou */
  pct: number;
  /** o que falta, em palavras curtas */
  falta: string;
};

/* ------------------------------------------------------------------ *
 * AS DUAS MÁQUINAS
 * ------------------------------------------------------------------ */

type Conta = { feito: number; alvo: number; t: number | null };

/** A enésima vez. `datas` vem ordenada; a data da conquista é a enésima. */
const aEnesima = (datas: number[], n: number): Conta => {
  const d = [...datas].sort((a, b) => a - b);
  return { feito: d.length, alvo: n, t: d.length >= n ? d[n - 1] : null };
};

/** A linha cruzada. `quando` é o instante em que ela foi cruzada. */
const aLinha = (feito: number, alvo: number, quando: number | null): Conta =>
  ({ feito, alvo, t: feito >= alvo && quando != null ? quando : null });

const diaDe = (t: number) => +startOfDay(new Date(t));

/** A maior sequência de dias colados em que a condição valeu. */
function maiorSequencia(S: State, vale: (c: any) => boolean): Conta & { n: number } {
  const bons = (S.checkins as any[]).filter(vale).map((c) => diaDe(c.t)).sort((a, b) => a - b);
  let melhor = 0; let fim: number | null = null;
  let n = 0; let anterior: number | null = null;
  for (const d of bons) {
    n = anterior != null && d - anterior === DAY ? n + 1 : 1;
    if (n > melhor) { melhor = n; fim = d; }
    anterior = d;
  }
  return { feito: melhor, alvo: 0, t: fim, n: melhor };
}

/* QUANTOS DIAS DE UMA MESMA SEMANA bateram a condição. A semana é a
   janela de sete dias que mais rendeu, e não a do calendário: quem bebe
   água de quinta a segunda cumpriu cinco dias, e dizer que não porque a
   semana virou no domingo seria o app discutindo calendário com alguém. */
function melhorJanela(S: State, vale: (c: any) => boolean): { n: number; fim: number | null } {
  const bons = new Set((S.checkins as any[]).filter(vale).map((c) => diaDe(c.t)));
  const todos = [...bons].sort((a, b) => a - b);
  let melhor = 0; let fim: number | null = null;
  for (const d0 of todos) {
    let n = 0; let ultimo: number | null = null;
    for (let k = 0; k < 7; k++) {
      const d = d0 + k * DAY;
      if (bons.has(d)) { n++; ultimo = d; }
    }
    if (n > melhor) { melhor = n; fim = ultimo; }
  }
  return { n: melhor, fim };
}

/** Os dias, em ordem, em que a condição valeu. */
const diasEm = (S: State, vale: (c: any) => boolean) =>
  (S.checkins as any[]).filter(vale).map((c) => diaDe(c.t)).sort((a, b) => a - b);

const respondeu = (c: any, campo: string) => c?.[campo] != null && !Number.isNaN(c[campo]);
const um = (n: number) => n.toFixed(1).replace('.', ',');

/* ------------------------------------------------------------------ *
 * O CATÁLOGO
 * ------------------------------------------------------------------ */

type Def = {
  id: string; familia: Familia; ic: string; titulo: string; desc: string;
  conta: (S: State) => Conta;
  /** o que falta, em palavras. Recebe o que falta, já no positivo. */
  falta: (resta: number, S: State) => string;
  /** some da lista quando a pergunta não faz sentido para esta pessoa */
  vale?: (S: State) => boolean;
};

const vezes = (n: number, s: string, p = s + 's') => `${n} ${n === 1 ? s : p}`;

const CATALOGO: Def[] = [
  /* ---------------- tratamento ---------------- */
  {
    id: 'dose-1', familia: 'tratamento', ic: 'leaf',
    titulo: 'Primeiro passo', desc: 'Primeira aplicação registrada',
    conta: (S) => aEnesima((S.injections as any[]).map((i) => i.t), 1),
    falta: () => 'Ao registrar a primeira aplicação',
  },
  {
    id: 'dose-4', familia: 'tratamento', ic: 'syringe',
    titulo: 'Um mês de caneta', desc: '4 aplicações registradas',
    conta: (S) => aEnesima((S.injections as any[]).map((i) => i.t), 4),
    falta: (r) => `Faltam ${vezes(r, 'aplicação', 'aplicações')}`,
  },
  {
    id: 'dose-12', familia: 'tratamento', ic: 'syringe',
    titulo: 'Três meses', desc: '12 aplicações registradas',
    conta: (S) => aEnesima((S.injections as any[]).map((i) => i.t), 12),
    falta: (r) => `Faltam ${vezes(r, 'aplicação', 'aplicações')}`,
  },
  {
    id: 'dose-26', familia: 'tratamento', ic: 'syringe',
    titulo: 'Meio ano', desc: '26 aplicações registradas',
    conta: (S) => aEnesima((S.injections as any[]).map((i) => i.t), 26),
    falta: (r) => `Faltam ${vezes(r, 'aplicação', 'aplicações')}`,
  },
  {
    id: 'dose-52', familia: 'tratamento', ic: 'cal',
    titulo: 'Um ano', desc: '52 aplicações registradas',
    conta: (S) => aEnesima((S.injections as any[]).map((i) => i.t), 52),
    falta: (r) => `Faltam ${vezes(r, 'aplicação', 'aplicações')}`,
  },
  {
    /* O RODÍZIO NÃO É ENFEITE: repetir o mesmo ponto causa nódulo, e
       alternar é orientação de bula. A conquista é a única da lista que
       premia uma prática de segurança. */
    id: 'rodizio', familia: 'tratamento', ic: 'troca',
    titulo: 'Rodízio completo', desc: 'Aplicou nos seis locais',
    conta: (S) => {
      const vistos = new Set<string>();
      let quando: number | null = null;
      for (const i of S.injections as any[]) {
        vistos.add(i.site);
        if (vistos.size === 6 && quando == null) quando = i.t;
      }
      return aLinha(vistos.size, 6, quando);
    },
    falta: (r) => `Faltam ${vezes(r, 'local', 'locais')}`,
  },
  {
    id: 'dez-semanas', familia: 'tratamento', ic: 'cal',
    titulo: 'Dez semanas', desc: 'Dez semanas desde a primeira dose',
    conta: (S) => {
      const i1 = (S.injections as any[])[0];
      if (!i1) return { feito: 0, alvo: 70, t: null };
      const d0 = diaDe(i1.t);
      const d = diffDays(now(), new Date(d0));
      return aLinha(d, 70, d0 + 70 * DAY);
    },
    falta: (r, S) => ((S.injections as any[]).length ? `Faltam ${vezes(r, 'dia')}` : 'Começa na primeira aplicação'),
  },
  {
    id: 'manutencao', familia: 'tratamento', ic: 'dose',
    titulo: 'Dose de manutenção', desc: 'Chegar ao fim da titulação',
    vale: (S) => (M(S).doses?.length ?? 0) > 0,
    conta: (S) => {
      const escada = M(S).doses ?? [];
      const alvo = escada[escada.length - 1];
      const inj = (S.injections as any[]).find((i) => i.dose >= alvo) ?? null;
      return aLinha(S.profile.dose || 0, alvo, inj ? inj.t : null);
    },
    falta: (_r, S) => {
      const escada = M(S).doses ?? [];
      return `Você está em ${S.profile.dose || 0} de ${escada[escada.length - 1]} ${M(S).unit}`;
    },
  },

  /* ---------------- peso ---------------- */
  {
    id: 'peso-1', familia: 'peso', ic: 'scale',
    titulo: 'Primeira pesagem', desc: 'Um peso registrado',
    conta: (S) => aEnesima((S.weights as any[]).map((w) => w.t), 1),
    falta: () => 'Ao registrar a primeira pesagem',
  },
  {
    id: 'peso-20', familia: 'peso', ic: 'scale',
    titulo: 'Vinte pesagens', desc: 'A curva com vinte pontos',
    conta: (S) => aEnesima((S.weights as any[]).map((w) => w.t), 20),
    falta: (r) => `Faltam ${vezes(r, 'pesagem', 'pesagens')}`,
  },
  ...([
    ['5', 5, '5% do peso inicial perdidos'],
    ['10', 10, '10% do peso inicial perdidos'],
  ] as const).map(([suf, pct, desc]): Def => ({
    id: `pct-${suf}`, familia: 'peso', ic: 'trend',
    titulo: `${pct}% do peso`, desc,
    conta: (S) => {
      const ini = S.profile.startWeight;
      const alvo = ini * (1 - pct / 100);
      const pesos = (S.weights as any[]).slice().sort((a, b) => a.t - b.t);
      const w = pesos.find((x) => x.kg <= alvo) ?? null;
      const atual = pesos.length ? pesos[pesos.length - 1].kg : ini;
      return aLinha(ini - atual, ini * (pct / 100), w ? w.t : null);
    },
    falta: (r) => `Faltam ${um(r)} kg`,
  })),
  ...([5, 10, 15, 20] as const).map((n): Def => ({
    id: `menos-${n}`, familia: 'peso', ic: 'scale',
    titulo: `−${n} kg`, desc: `Marca de ${n} kg a menos`,
    conta: (S) => {
      const ini = S.profile.startWeight;
      const pesos = (S.weights as any[]).slice().sort((a, b) => a.t - b.t);
      const w = pesos.find((x) => x.kg <= ini - n) ?? null;
      const atual = pesos.length ? pesos[pesos.length - 1].kg : ini;
      return aLinha(ini - atual, n, w ? w.t : null);
    },
    falta: (r) => `Faltam ${um(r)} kg`,
  })),
  {
    id: 'meta-peso', familia: 'peso', ic: 'target',
    titulo: 'Meta alcançada', desc: 'Chegar ao peso que você definiu',
    conta: (S) => {
      const ini = S.profile.startWeight;
      const alvo = S.profile.goalWeight;
      const pesos = (S.weights as any[]).slice().sort((a, b) => a.t - b.t);
      const w = pesos.find((x) => x.kg <= alvo) ?? null;
      const atual = pesos.length ? pesos[pesos.length - 1].kg : ini;
      /* A fração é do CAMINHO, e não do peso: chegar a 68 partindo de
         82,4 é catorze quilos, e mostrar 82% porque 68 é 82% de 82,4
         seria uma barra quase cheia no primeiro dia. */
      return aLinha(Math.max(0, ini - atual), Math.max(0.1, ini - alvo), w ? w.t : null);
    },
    falta: (r) => `Faltam ${um(r)} kg`,
  },

  /* ---------------- constância ---------------- */
  {
    id: 'checkin-1', familia: 'constancia', ic: 'check',
    titulo: 'Primeiro check-in', desc: 'Um dia respondido',
    conta: (S) => aEnesima(diasEm(S, (c) => respondeu(c, 'mood')), 1),
    falta: () => 'Ao responder o primeiro check-in',
  },
  ...([
    ['100', 100, 'Cem dias respondidos'],
    ['200', 200, 'Duzentos dias respondidos'],
  ] as const).map(([suf, n, desc]): Def => ({
    id: `checkin-${suf}`, familia: 'constancia', ic: 'check',
    titulo: `${n} check-ins`, desc,
    conta: (S) => aEnesima(diasEm(S, (c) => respondeu(c, 'mood')), n),
    falta: (r) => `Faltam ${vezes(r, 'dia')}`,
  })),
  ...([
    [7, 'Semana completa'],
    [15, 'Quinze dias seguidos'],
    [30, 'Um mês seguido'],
  ] as const).map(([n, titulo]): Def => ({
    id: `seguidos-${n}`, familia: 'constancia', ic: 'spark',
    titulo, desc: `${n} check-ins em dias seguidos`,
    conta: (S) => {
      const s = maiorSequencia(S, (c) => respondeu(c, 'mood'));
      return aLinha(s.n, n, s.t);
    },
    falta: (_r, S) => `Maior sequência: ${maiorSequencia(S, (c) => respondeu(c, 'mood')).n} de ${n} dias`,
  })),

  /* ---------------- hidratação ---------------- */
  {
    id: 'agua-1', familia: 'hidratacao', ic: 'water',
    titulo: 'Primeira meta de água', desc: 'Um dia inteiro na meta',
    conta: (S) => aEnesima(diasEm(S, (c) => (c?.agua ?? 0) >= metaDeCopos(S)), 1),
    falta: () => 'No primeiro dia em que você bater a meta',
  },
  {
    id: 'agua-semana', familia: 'hidratacao', ic: 'water',
    titulo: 'Hidratação em dia', desc: '5 dias na meta, na mesma semana',
    conta: (S) => {
      const j = melhorJanela(S, (c) => (c?.agua ?? 0) >= metaDeCopos(S));
      return aLinha(j.n, 5, j.fim);
    },
    falta: (_r, S) => `Melhor semana: ${melhorJanela(S, (c) => (c?.agua ?? 0) >= metaDeCopos(S)).n} de 5 dias`,
  },
  ...([30, 100] as const).map((n): Def => ({
    id: `agua-${n}`, familia: 'hidratacao', ic: 'drop',
    titulo: `${n} dias na meta`, desc: `${n} dias de água cumprida`,
    conta: (S) => aEnesima(diasEm(S, (c) => (c?.agua ?? 0) >= metaDeCopos(S)), n),
    falta: (r) => `Faltam ${vezes(r, 'dia')}`,
  })),

  /* ---------------- proteína ---------------- */
  {
    id: 'prot-1', familia: 'proteina', ic: 'flame',
    titulo: 'Primeira meta de proteína', desc: 'Um dia inteiro na meta',
    vale: (S) => metaDeProt(S) > 0,
    conta: (S) => aEnesima(diasEm(S, (c) => (c?.prot ?? 0) >= metaDeProt(S)), 1),
    falta: () => 'No primeiro dia em que você bater a meta',
  },
  {
    id: 'prot-14', familia: 'proteina', ic: 'flame',
    titulo: 'Proteína em foco', desc: '14 dias seguidos na meta',
    vale: (S) => metaDeProt(S) > 0,
    conta: (S) => {
      const s = maiorSequencia(S, (c) => (c?.prot ?? 0) >= metaDeProt(S));
      return aLinha(s.n, 14, s.t);
    },
    falta: (_r, S) => `Maior sequência: ${maiorSequencia(S, (c) => (c?.prot ?? 0) >= metaDeProt(S)).n} de 14 dias`,
  },
  ...([30, 100] as const).map((n): Def => ({
    id: `prot-${n}`, familia: 'proteina', ic: 'flame',
    titulo: `${n} dias de proteína`, desc: `${n} dias na meta do perfil`,
    vale: (S) => metaDeProt(S) > 0,
    conta: (S) => aEnesima(diasEm(S, (c) => (c?.prot ?? 0) >= metaDeProt(S)), n),
    falta: (r) => `Faltam ${vezes(r, 'dia')}`,
  })),

  /* ---------------- movimento ---------------- */
  {
    id: 'treino-1', familia: 'movimento', ic: 'dumbbell',
    titulo: 'Primeiro treino', desc: 'Uma sessão registrada',
    conta: (S) => aEnesima(diasEm(S, (c) => (c?.treinos?.length ?? 0) > 0), 1),
    falta: () => 'Ao registrar o primeiro treino',
  },
  ...([10, 50, 150] as const).map((n): Def => ({
    id: `treino-${n}`, familia: 'movimento', ic: 'dumbbell',
    titulo: `${n} treinos`, desc: `${n} sessões registradas`,
    conta: (S) => {
      /* Conta SESSÕES, e não dias: quem treina de manhã e à noite fez
         dois treinos. A data é a do dia em que a enésima aconteceu. */
      const datas: number[] = [];
      for (const c of (S.checkins as any[]).slice().sort((a, b) => a.t - b.t)) {
        for (let k = 0; k < (c.treinos?.length ?? 0); k++) datas.push(diaDe(c.t));
      }
      return aEnesima(datas, n);
    },
    falta: (r) => `Faltam ${vezes(r, 'treino')}`,
  })),
  {
    id: 'exerc-semana', familia: 'movimento', ic: 'activity',
    titulo: 'Semana ativa', desc: '5 dias na meta de movimento, na mesma semana',
    vale: (S) => metaDeExerc(S) > 0,
    conta: (S) => {
      const j = melhorJanela(S, (c) => (c?.exerc ?? 0) >= metaDeExerc(S));
      return aLinha(j.n, 5, j.fim);
    },
    falta: (_r, S) => `Melhor semana: ${melhorJanela(S, (c) => (c?.exerc ?? 0) >= metaDeExerc(S)).n} de 5 dias`,
  },

  /* ---------------- alimentação ---------------- */
  {
    id: 'refeicao-1', familia: 'comida', ic: 'utensils',
    titulo: 'Primeira refeição', desc: 'Um prato registrado',
    conta: (S) => aEnesima((S.meals as any[]).map((m) => m.t), 1),
    falta: () => 'Ao registrar o primeiro prato',
  },
  ...([50, 200] as const).map((n): Def => ({
    id: `refeicao-${n}`, familia: 'comida', ic: 'utensils',
    titulo: `${n} refeições`, desc: `${n} pratos registrados`,
    conta: (S) => aEnesima((S.meals as any[]).map((m) => m.t), n),
    falta: (r) => `Faltam ${vezes(r, 'refeição', 'refeições')}`,
  })),
  {
    id: 'favorito-1', familia: 'comida', ic: 'star',
    titulo: 'Primeiro favorito', desc: 'Um prato guardado para repetir',
    conta: (S) => {
      /* O favorito não guarda data. O que existe é a lista: ter o
         primeiro é a conquista, e a data do primeiro é a da refeição
         mais antiga — o dia em que a comida entrou na rotina. */
      const n = ((S as any).favMeals ?? []).length;
      const primeira = (S.meals as any[]).map((m) => m.t).sort((a, b) => a - b)[0] ?? null;
      return aLinha(n, 1, primeira);
    },
    falta: () => 'Ao guardar o primeiro prato favorito',
  },

  /* ---------------- acompanhamento ---------------- */
  {
    id: 'foto-1', familia: 'acompanhamento', ic: 'camera',
    titulo: 'Primeira foto', desc: 'Um registro de progresso',
    conta: (S) => aEnesima((S.photos as any[]).map((p) => p.t), 1),
    falta: () => 'Ao guardar a primeira foto',
  },
  {
    id: 'foto-5', familia: 'acompanhamento', ic: 'camera',
    titulo: 'Cinco fotos', desc: 'A mudança em cinco momentos',
    conta: (S) => aEnesima((S.photos as any[]).map((p) => p.t), 5),
    falta: (r) => `Faltam ${vezes(r, 'foto')}`,
  },
  {
    id: 'medida-1', familia: 'acompanhamento', ic: 'ruler',
    titulo: 'Primeira medida', desc: 'Fita métrica registrada',
    conta: (S) => aEnesima((S.measures as any[]).map((m) => m.t), 1),
    falta: () => 'Ao registrar as primeiras medidas',
  },
  {
    id: 'cintura-5', familia: 'acompanhamento', ic: 'ruler',
    titulo: '−5 cm de cintura', desc: 'A medida que a balança não mostra',
    vale: (S) => (S.measures as any[]).length > 0,
    conta: (S) => {
      const ms = (S.measures as any[]).filter((m) => m.cintura != null).sort((a, b) => a.t - b.t);
      if (!ms.length) return { feito: 0, alvo: 5, t: null };
      const ini = ms[0].cintura;
      const m5 = ms.find((m) => ini - m.cintura >= 5) ?? null;
      return aLinha(ini - ms[ms.length - 1].cintura, 5, m5 ? m5.t : null);
    },
    falta: (r) => `Faltam ${um(r)} cm`,
  },
  {
    id: 'exame-1', familia: 'acompanhamento', ic: 'doc',
    titulo: 'Primeiro exame', desc: 'Um painel importado',
    conta: (S) => aEnesima((S.examBundles as any[]).map((b) => b.t), 1),
    falta: () => 'Ao importar o primeiro exame',
  },
  {
    id: 'consulta-1', familia: 'acompanhamento', ic: 'steth',
    titulo: 'Primeira consulta', desc: 'Uma consulta no histórico',
    conta: (S) => aEnesima((S.consultsHistory as any[]).map((c) => c.t), 1),
    falta: () => 'Depois da primeira consulta registrada',
  },
];

export function conquistas(S: State): Conquista[] {
  return CATALOGO
    .filter((d) => !d.vale || d.vale(S))
    .map((d) => {
      const { feito, alvo, t } = d.conta(S);
      const resta = Math.max(0, alvo - feito);
      return {
        id: d.id, familia: d.familia, ic: d.ic, titulo: d.titulo, desc: d.desc,
        t,
        pct: alvo > 0 ? Math.max(0, Math.min(1, feito / alvo)) : 0,
        falta: d.falta(resta, S),
      };
    });
}

/* AS FEITAS, DA MAIS RECENTE PARA A MAIS ANTIGA — a última conquista é a
   notícia; as antigas são a estante. */
export const feitas = (l: Conquista[]) =>
  l.filter((x) => x.t != null).sort((a, b) => b.t! - a.t!);

/* AS QUE FALTAM, DA MAIS PERTO PARA A MAIS LONGE. Com trinta e quatro na
   lista, a ordem do catálogo colocaria "um ano de caneta" na frente de
   "faltam 200 gramas" — e a que está a um passo é a única que muda o que
   a pessoa faz hoje. */
export const aCaminho = (l: Conquista[]) =>
  l.filter((x) => x.t == null).sort((a, b) => b.pct - a.pct);
