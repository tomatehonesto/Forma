import { estadoVazio, ensureDefaults, type State } from '../../src/logic/seed';
import { startOfDay, daysAgo } from '../../src/logic/time';

/* ============================================================
   OS PACIENTES FICTÍCIOS DA AVALIAÇÃO DA CONVERSA

   Cada um é um diário no formato do aplicativo, e o resumo que a IA lê
   sai de `resumoDaJornada`, a mesma função do app. Assim a avaliação
   mede também se ela USA os dados — e não só se sabe responder.

   ⚠️ O RELÓGIO É FIXO (ver relogio.ts), e os dias aqui são "há N dias"
   a partir dele: hoje é quarta, 30/09/2026. "Segunda" é há 2 dias.

   ⚠️ SÃO CASOS DE TESTE, E NÃO RETRATOS. Cada paciente existe para
   algumas perguntas da lista (ver casos.ts); o número que importa para
   a pergunta está aqui de propósito — o platô da Carla, a dose nova do
   Diego, o enjoo da Ana no dia seguinte à aplicação.
   ============================================================ */

type Dia = number; // há quantos dias
type Sint = Partial<Record<'vomito' | 'dor' | 'fadiga' | 'cefaleia' | 'tontura', number>>;
type Check = {
  d: Dia;
  nausea?: number; // 1 a 5, como a pessoa respondeu
  preso?: number;
  solto?: number;
  refluxo?: number;
  sint?: Sint;
  fome?: number; // 1 a 5
  energia?: number; // 1 a 5
  humor?: number; // 1 a 5
  sono?: number; // horas
  agua?: number; // mL
  prot?: number; // g
  exerc?: number; // min
};

type Ficha = {
  nome: string;
  med: string;
  dose: number;
  altura: number;
  inicio: Dia;
  meta?: number;
  alvos?: { prot: number; waterMl: number };
  acompanhamento: 'proprio' | 'nenhum';
  sistema?: 'metrico' | 'imperial';
  pesos: [Dia, number][];
  aplicacoes: [Dia, number][];
  checkins?: Check[];
  exames?: { marker: string; unit: string; ref?: string; values: [Dia, number][] }[];
};

const dia = (d: Dia) => +startOfDay(daysAgo(d));
/* a régua da tela (1 a 5) para a coluna antiga (0 a 10), que é onde
   náusea, refluxo, intestino, fome e energia moram — ver logic/escalas */
const col = (g?: number) => (g == null ? undefined : g * 2);

function diario(f: Ficha): State {
  const S: any = estadoVazio();
  Object.assign(S.profile, {
    name: f.nome,
    med: f.med,
    dose: f.dose,
    height: f.altura,
    startT: +daysAgo(f.inicio),
    startWeight: f.pesos[0]?.[1] ?? 0,
    goalWeight: f.meta ?? 0,
    acompanhamento: f.acompanhamento,
    sistema: f.sistema,
  });
  if (f.alvos) S.profile.targets = { ...S.profile.targets, ...f.alvos };
  S.weights = f.pesos.map(([d, kg]) => ({ t: +daysAgo(d) , kg }));
  S.injections = f.aplicacoes.map(([d, dose], i) => ({
    t: +daysAgo(d), med: f.med, dose, site: ['abd-e', 'abd-d', 'coxa-e', 'coxa-d'][i % 4], note: '',
  }));
  S.checkins = (f.checkins ?? []).map((c) => {
    const x: any = { t: dia(c.d) };
    if (c.nausea != null) x.nausea = col(c.nausea);
    if (c.refluxo != null) x.refluxo = col(c.refluxo);
    if (c.preso != null) { x.gut = 'preso'; x.constip = col(c.preso); }
    else if (c.solto != null) { x.gut = 'solto'; x.diarreia = col(c.solto); }
    else if (c.nausea != null) x.gut = 'normal';
    if (c.sint) x.sint = c.sint;
    if (c.fome != null) x.fome = col(c.fome);
    if (c.energia != null) x.energia = col(c.energia);
    if (c.humor != null) x.mood = c.humor;
    if (c.sono != null) x.sono = c.sono;
    if (c.agua != null) x.agua = c.agua / 250;
    if (c.prot != null) x.prot = c.prot;
    if (c.exerc != null) x.exerc = c.exerc;
    return x;
  }).sort((a: any, b: any) => a.t - b.t);
  S.exams = (f.exames ?? []).map((e) => ({ ...e, good: '', values: e.values.map(([d, v]) => ({ t: +daysAgo(d), v })) }));
  return ensureDefaults(S) as State;
}

/* dias seguidos de check-in, do mais antigo para hoje, com um gerador
   por dia (null pula o dia) */
const dias = (de: Dia, ate: Dia, f: (d: Dia) => Omit<Check, 'd'> | null): Check[] => {
  const r: Check[] = [];
  for (let d = de; d >= ate; d--) { const c = f(d); if (c) r.push({ d, ...c }); }
  return r;
};

/* ------------------------------------------------------------------ */

/** Ana — Wegovy 0,5 mg, semana 6, −4,2 kg. O enjoo aparece no dia
    seguinte à aplicação e melhora em dois dias; aplicou ontem, e hoje
    o enjoo voltou. Check-in em 5 de cada 7 dias. */
export const ana = () => diario({
  nome: 'Ana Paula Souza', med: 'wegovy', dose: 0.5, altura: 1.65, inicio: 42, meta: 75,
  alvos: { prot: 90, waterMl: 2000 }, acompanhamento: 'proprio',
  pesos: [[42, 88.0], [35, 87.1], [28, 86.2], [21, 85.6], [14, 84.9], [7, 84.3], [1, 83.8]],
  aplicacoes: [[42, 0.25], [35, 0.25], [28, 0.25], [21, 0.25], [14, 0.5], [7, 0.5], [1, 0.5]],
  checkins: dias(13, 0, (d) => {
    if (d === 11 || d === 9 || d === 4 || d === 2) return null; // 5 de 7
    const depois = [13, 6, 0].includes(d) ? 3 : [12, 5].includes(d) ? 2 : 1;
    return {
      nausea: depois, fome: depois >= 2 ? 2 : 3, energia: depois >= 3 ? 3 : 4, humor: 4, sono: 7,
      agua: depois >= 2 ? 1250 : 1750, prot: depois >= 2 ? 55 : 80, exerc: d % 3 === 0 ? 30 : 0,
    };
  }),
});

/** Bruno — Mounjaro 5 mg, semana 12, 100 → 91 kg (−9%). A última
    semana subiu 0,3 kg. A aplicação estava prevista para ontem e não foi
    registrada. Sem exames. */
export const bruno = () => diario({
  nome: 'Bruno Carvalho', med: 'mounjaro', dose: 5, altura: 1.8, inicio: 85, meta: 85,
  alvos: { prot: 110, waterMl: 2500 }, acompanhamento: 'proprio',
  pesos: [[85, 100], [78, 98.9], [71, 97.8], [64, 97.0], [57, 96.1], [50, 95.4], [43, 94.6], [36, 93.9], [29, 93.1], [22, 92.4], [15, 91.8], [8, 90.7], [2, 91.0]],
  aplicacoes: [[85, 2.5], [78, 2.5], [71, 2.5], [64, 2.5], [57, 5], [50, 5], [43, 5], [36, 5], [29, 5], [22, 5], [15, 5], [8, 5]],
  checkins: dias(13, 0, (d) => (d % 4 !== 1 ? null : { nausea: 1, fome: 3, energia: 4, humor: 3, sono: 7, agua: 2500, prot: 105, exerc: 60 })),
});

/** Carla — Mounjaro 5 mg, semana 12, −8,4 kg, adesão total, check-in
    quase todo dia. Peso parado há 10 dias. Fome baixa, proteína e água
    bem abaixo da meta, treino caindo. HbA1c 6,1% há um mês. */
export const carla = () => diario({
  nome: 'Carla Menezes', med: 'mounjaro', dose: 5, altura: 1.62, inicio: 85, meta: 68,
  alvos: { prot: 95, waterMl: 2000 }, acompanhamento: 'proprio',
  pesos: [[84, 86.5], [77, 85.4], [70, 84.2], [63, 83.1], [56, 82.3], [49, 81.2], [42, 80.4], [35, 79.6], [28, 79.0], [21, 78.6], [14, 78.3], [10, 78.0], [7, 78.2], [4, 77.9], [1, 78.1]],
  aplicacoes: [[85, 2.5], [78, 2.5], [71, 2.5], [64, 2.5], [57, 5], [50, 5], [43, 5], [36, 5], [29, 5], [22, 5], [15, 5], [8, 5], [1, 5]],
  checkins: dias(13, 0, (d) => (d === 8 ? null : {
    nausea: d % 7 === 6 ? 2 : 1, fome: 1, energia: d % 3 === 0 ? 2 : 3, humor: 3, sono: 6.5,
    agua: 1100, prot: 45 + (d % 3) * 5, exerc: d === 12 || d === 5 ? 40 : 0,
  })),
  exames: [
    { marker: 'HbA1c', unit: '%', ref: '< 5,7', values: [[120, 6.4], [30, 6.1]] },
    { marker: 'Glicemia jejum', unit: 'mg/dL', ref: '70–99', values: [[120, 118], [30, 108]] },
    { marker: 'Creatinina', unit: 'mg/dL', ref: '0,6–1,1', values: [[30, 0.8]] },
  ],
});

/** Diego — Mounjaro, subiu de 5 para 7,5 mg na segunda (há 2 dias).
    Desde então: enjoo forte, quase sem comer, pouca água, e tontura
    hoje. */
export const diego = () => diario({
  nome: 'Diego Ramos', med: 'mounjaro', dose: 7.5, altura: 1.76, inicio: 72, meta: 82,
  alvos: { prot: 110, waterMl: 2500 }, acompanhamento: 'proprio',
  pesos: [[72, 96.0], [65, 95.1], [58, 94.0], [51, 93.2], [44, 92.5], [37, 91.6], [30, 91.0], [23, 90.3], [16, 89.8], [9, 89.4], [2, 89.1], [0, 88.3]],
  aplicacoes: [[72, 2.5], [65, 2.5], [58, 2.5], [51, 2.5], [44, 5], [37, 5], [30, 5], [23, 5], [16, 5], [9, 5], [2, 7.5]],
  checkins: dias(13, 0, (d) => {
    if (d > 2) return d % 2 ? null : { nausea: 1, fome: 3, energia: 4, humor: 4, sono: 7, agua: 2250, prot: 100, exerc: 45 };
    return {
      nausea: 4, fome: 1, energia: 2, humor: 2, sono: 6, agua: d === 0 ? 500 : 800, prot: d === 0 ? 15 : 30, exerc: 0,
      sint: d === 0 ? { tontura: 3, fadiga: 3 } : { fadiga: 2 },
    };
  }),
});

/** Eduarda — Ozempic 0,25 mg, semana 3, −1,5 kg. Sem médico registrado
    no aplicativo. Pouca fome, check-in de vez em quando. */
export const eduarda = () => diario({
  nome: 'Eduarda Lima', med: 'ozempic', dose: 0.25, altura: 1.6, inicio: 21, meta: 65,
  alvos: { prot: 80, waterMl: 2000 }, acompanhamento: 'nenhum',
  pesos: [[21, 78.0], [14, 77.4], [7, 76.9], [1, 76.5]],
  aplicacoes: [[21, 0.25], [14, 0.25], [7, 0.25], [0, 0.25]],
  checkins: dias(13, 0, (d) => (d % 2 ? null : { nausea: 1, fome: 2, energia: 4, humor: 3, sono: 7.5, agua: 1500, prot: 60 })),
});

/** Fernanda — acabou de instalar: nome e medicamento, nenhum registro. */
export const fernanda = () => diario({
  nome: 'Fernanda', med: 'mounjaro', dose: 2.5, altura: 1.7, inicio: 0,
  acompanhamento: 'proprio', pesos: [], aplicacoes: [],
});

/** Gustavo — Wegovy 2,4 mg, 40 semanas, 112 → 97 kg. Estável há seis
    semanas, perto da meta. */
export const gustavo = () => diario({
  nome: 'Gustavo Pereira', med: 'wegovy', dose: 2.4, altura: 1.82, inicio: 280, meta: 95,
  alvos: { prot: 120, waterMl: 3000 }, acompanhamento: 'proprio',
  pesos: [[280, 112], [252, 109.6], [224, 107.1], [196, 104.8], [168, 102.5], [140, 100.6], [112, 99.0], [84, 98.0], [56, 97.3], [42, 97.1], [28, 96.8], [14, 97.2], [3, 97.0]],
  aplicacoes: [[70, 2.4], [63, 2.4], [56, 2.4], [49, 2.4], [42, 2.4], [35, 2.4], [28, 2.4], [21, 2.4], [14, 2.4], [7, 2.4], [0, 2.4]],
  checkins: dias(13, 0, (d) => (d % 3 ? null : { nausea: 1, fome: 3, energia: 4, humor: 4, sono: 7, agua: 2750, prot: 125, exerc: 50 })),
});

/** Emily — EUA, Zepbound 5 mg, unidades imperiais, semana 8. Aplicou
    ontem, e hoje registrou vômito. */
export const emily = () => diario({
  nome: 'Emily Carter', med: 'zepbound', dose: 5, altura: 1.68, inicio: 57, meta: 77,
  alvos: { prot: 100, waterMl: 2400 }, acompanhamento: 'proprio', sistema: 'imperial',
  pesos: [[57, 95.3], [50, 94.4], [43, 93.6], [36, 92.8], [29, 92.1], [22, 91.4], [15, 90.7], [8, 90.2], [1, 89.8]],
  aplicacoes: [[57, 2.5], [50, 2.5], [43, 2.5], [36, 2.5], [29, 5], [22, 5], [15, 5], [8, 5], [1, 5]],
  checkins: dias(13, 0, (d) => (d === 0
    ? { nausea: 4, sint: { vomito: 3 }, fome: 1, energia: 2, humor: 2, agua: 600, prot: 10 }
    : d % 2 ? null : { nausea: 1, fome: 3, energia: 4, humor: 4, sono: 7, agua: 2000, prot: 90 })),
});

/** Sofía — América Latina, Ozempic 0,5 mg, semana 8, intestino preso
    quase todo dia. */
export const sofia = () => diario({
  nome: 'Sofía Hernández', med: 'ozempic', dose: 0.5, altura: 1.58, inicio: 56, meta: 62,
  alvos: { prot: 80, waterMl: 2000 }, acompanhamento: 'proprio',
  pesos: [[56, 74.0], [49, 73.3], [42, 72.5], [35, 71.9], [28, 71.2], [21, 70.8], [14, 70.3], [7, 69.9], [1, 69.6]],
  aplicacoes: [[56, 0.25], [49, 0.25], [42, 0.25], [35, 0.25], [28, 0.5], [21, 0.5], [14, 0.5], [7, 0.5], [0, 0.5]],
  checkins: dias(13, 0, (d) => (d % 3 === 1 ? null : { preso: d < 7 ? 4 : 3, fome: 2, energia: 3, humor: 3, sono: 7, agua: 1000, prot: 55 })),
});

/* ---- os pacientes das perguntas difíceis (30/09/2026) ----
   Cada pergunta traz um contexto ("perdi 9 kg e travou há 3 semanas",
   "parei há 3 semanas"); o diário daqui é esse contexto registrado, para
   a IA poder conferir o que a pessoa diz contra o que ela anotou. */

const semanal = (de: Dia, ate: Dia, dose: number): [Dia, number][] => {
  const r: [Dia, number][] = [];
  for (let d = de; d >= ate; d -= 7) r.push([d, dose]);
  return r;
};
const titulacaoMounjaro = (inicio: Dia, ate: Dia, ...subidas: number[]): [Dia, number][] => {
  /* 2,5 mg por 4 semanas, depois cada dose da lista por 4 semanas, e a
     última até `ate` */
  const r: [Dia, number][] = [];
  let d = inicio;
  const doses = [2.5, ...subidas];
  doses.forEach((dose, i) => {
    const fim = i === doses.length - 1 ? ate : d - 21;
    r.push(...semanal(d, fim, dose));
    d -= 28;
  });
  return r;
};

/** Helena — Mounjaro 5 mg há 2 meses, −9 kg, e nada nas últimas 3
    semanas. */
export const helena = () => diario({
  nome: 'Helena Rocha', med: 'mounjaro', dose: 5, altura: 1.7, inicio: 60, meta: 75,
  alvos: { prot: 100, waterMl: 2500 }, acompanhamento: 'proprio',
  pesos: [[60, 95.0], [53, 93.4], [46, 91.8], [39, 90.2], [32, 88.6], [25, 87.0], [21, 86.1], [14, 86.3], [7, 85.9], [1, 86.0]],
  aplicacoes: titulacaoMounjaro(60, 4, 5),
  checkins: dias(13, 0, (d) => (d % 3 === 2 ? null : { nausea: 1, fome: 2, energia: 4, humor: 3, sono: 7, agua: 1750, prot: 70, exerc: d % 4 === 0 ? 40 : 0 })),
});

/** Igor — Wegovy 2,4 mg por 40 semanas, chegou à meta e parou há 3
    semanas (a última aplicação foi há 22 dias). A fome voltou forte e o
    peso começou a subir. */
export const igor = () => diario({
  nome: 'Igor Almeida', med: 'wegovy', dose: 2.4, altura: 1.78, inicio: 300, meta: 88,
  alvos: { prot: 110, waterMl: 2500 }, acompanhamento: 'proprio',
  pesos: [[300, 105], [240, 99.0], [180, 94.2], [120, 90.6], [60, 88.5], [28, 88.0], [21, 88.4], [14, 88.9], [7, 89.5], [2, 90.1]],
  aplicacoes: semanal(78, 22, 2.4),
  checkins: dias(13, 0, (d) => (d % 2 ? null : { fome: 5, energia: 4, humor: 3, sono: 7, agua: 2000, prot: 90 })),
});

/** João — Mounjaro 7,5 mg, 16 semanas, só −3 kg, quase sem efeito
    colateral. */
export const joao = () => diario({
  nome: 'João Batista', med: 'mounjaro', dose: 7.5, altura: 1.75, inicio: 112, meta: 85,
  alvos: { prot: 110, waterMl: 2500 }, acompanhamento: 'proprio',
  pesos: [[112, 98.0], [84, 97.2], [56, 96.4], [28, 95.6], [14, 95.3], [2, 95.0]],
  aplicacoes: titulacaoMounjaro(112, 0, 5, 7.5),
  checkins: dias(13, 0, (d) => (d % 3 ? null : { fome: 4, energia: 4, humor: 3, sono: 7, agua: 2000, prot: 95 })),
});

/** Karina — Wegovy 2,4 mg (a manutenção recomendada) há 12 semanas, 30
    semanas de tratamento, −1,8 kg (2%). Nenhum sintoma marcado. */
export const karina = () => diario({
  nome: 'Karina Duarte', med: 'wegovy', dose: 2.4, altura: 1.63, inicio: 210, meta: 75,
  alvos: { prot: 90, waterMl: 2000 }, acompanhamento: 'proprio',
  pesos: [[210, 92.0], [168, 91.4], [126, 91.0], [84, 90.7], [42, 90.5], [14, 90.4], [3, 90.2]],
  aplicacoes: [...semanal(210, 189, 0.25), ...semanal(182, 161, 0.5), ...semanal(154, 133, 1), ...semanal(126, 112, 1.7), ...semanal(105, 0, 2.4)],
  checkins: dias(13, 0, (d) => (d % 3 ? null : { nausea: 1, fome: 3, energia: 4, humor: 3, sono: 7, agua: 1750, prot: 80 })),
});

/** Lara — Mounjaro 5 mg, 3 meses: −5 kg no primeiro mês, −2 kg no
    segundo, −0,5 kg no terceiro. */
export const lara = () => diario({
  nome: 'Lara Teixeira', med: 'mounjaro', dose: 5, altura: 1.66, inicio: 90, meta: 75,
  alvos: { prot: 95, waterMl: 2200 }, acompanhamento: 'proprio',
  pesos: [[90, 92.0], [83, 90.6], [76, 89.5], [69, 88.3], [62, 87.0], [55, 86.4], [48, 85.9], [41, 85.5], [34, 85.0], [27, 84.9], [20, 84.7], [13, 84.6], [6, 84.5], [1, 84.5]],
  aplicacoes: titulacaoMounjaro(90, 6, 5),
  checkins: dias(13, 0, (d) => (d % 2 ? null : { nausea: 1, fome: 3, energia: 4, humor: 3, sono: 7, agua: 2000, prot: 85, exerc: 30 })),
});

/** Nina — Mounjaro 5 mg, 10 semanas, −6 kg, e a última pesagem subiu
    1,8 kg sobre a anterior. */
export const nina = () => diario({
  nome: 'Nina Barros', med: 'mounjaro', dose: 5, altura: 1.6, inicio: 70, meta: 66,
  alvos: { prot: 90, waterMl: 2000 }, acompanhamento: 'proprio',
  pesos: [[70, 80.0], [63, 79.1], [56, 78.0], [49, 77.2], [42, 76.5], [35, 75.9], [28, 75.4], [21, 74.8], [14, 74.4], [8, 74.0], [1, 75.8]],
  aplicacoes: titulacaoMounjaro(70, 0, 5),
  checkins: dias(13, 0, (d) => (d % 2 ? null : { nausea: 1, fome: 3, energia: 4, humor: 3, sono: 7, agua: 1750, prot: 80 })),
});

/** Otávio — Mounjaro 5 mg, 13 semanas, −12 kg, o peso ainda descendo
    devagar, e a fome voltando nos últimos dias (de "pouca" para acima do
    normal). */
export const otavio = () => diario({
  nome: 'Otávio Nunes', med: 'mounjaro', dose: 5, altura: 1.84, inicio: 91, meta: 92,
  alvos: { prot: 120, waterMl: 3000 }, acompanhamento: 'proprio',
  pesos: [[91, 110.0], [84, 108.3], [77, 106.8], [70, 105.4], [63, 104.1], [56, 102.8], [49, 101.7], [42, 100.8], [35, 100.0], [28, 99.4], [21, 98.9], [14, 98.5], [7, 98.2], [1, 98.0]],
  aplicacoes: titulacaoMounjaro(91, 0, 5),
  checkins: dias(13, 0, (d) => ({ nausea: 1, fome: d > 6 ? 2 : 4, energia: 4, humor: 3, sono: d > 6 ? 7 : 6, agua: 2250, prot: d > 6 ? 110 : 90 })),
});

/** Paula — Mounjaro 5 mg, 8 semanas, 85 → 76,5 kg (−10%). Come
    proteína perto da meta, bebe água, energia boa. */
export const paula = () => diario({
  nome: 'Paula Freitas', med: 'mounjaro', dose: 5, altura: 1.64, inicio: 56, meta: 68,
  alvos: { prot: 90, waterMl: 2000 }, acompanhamento: 'proprio',
  pesos: [[56, 85.0], [49, 83.2], [42, 81.6], [35, 80.3], [28, 79.1], [21, 78.2], [14, 77.4], [7, 76.9], [1, 76.5]],
  aplicacoes: titulacaoMounjaro(56, 0, 5),
  checkins: dias(13, 0, (d) => (d % 2 ? null : { nausea: 1, fome: 2, energia: 4, humor: 4, sono: 7.5, agua: 2000, prot: 85, exerc: 40 })),
});

export const PACIENTES = { ana, bruno, carla, diego, eduarda, fernanda, gustavo, emily, sofia, helena, igor, joao, karina, lara, nina, otavio, paula };
export type Paciente = keyof typeof PACIENTES;
