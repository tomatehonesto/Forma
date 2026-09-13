/* Seletores / cálculos determinísticos — porta verbatim (S passa como parâmetro). */
import { DAY, startOfDay, now, daysAgo, addDays, diffDays, hm, DOW_PT, nf, kg, relDay } from './time';
import { MEDS, CADENCE_DAYS, SHELF_DAYS } from './meds';
import type { State } from './seed';

export const GOAL_WATER = 8;

export const M = (S: State) => MEDS[S.profile.med];
export const curWeight = (S: State) => S.weights[S.weights.length - 1].kg;
export const startWeight = (S: State) => S.profile.startWeight;
export const lostKg = (S: State) => startWeight(S) - curWeight(S);
export const lostPct = (S: State) => (lostKg(S) / startWeight(S)) * 100;
export const imc = (S: State, w: number) => w / (S.profile.height ** 2);
export const goalProgress = (S: State) =>
  Math.max(0, Math.min(100, ((startWeight(S) - curWeight(S)) / (startWeight(S) - S.profile.goalWeight)) * 100));
export const lastInjection = (S: State) => (S.injections.length ? S.injections[S.injections.length - 1] : null);

export function nextInjectionDate(S: State) {
  const li = lastInjection(S); if (!li) return startOfDay(now());
  return addDays(startOfDay(new Date(li.t)), CADENCE_DAYS(S.profile.med));
}
export function adesao(S: State) {
  const days = diffDays(now(), new Date(S.profile.startT));
  const expected = Math.floor(days / CADENCE_DAYS(S.profile.med)) + 1;
  return Math.max(0, Math.min(100, Math.round((S.injections.length / expected) * 100)));
}
/* O REGISTRO DO DIA e o CHECK-IN FEITO são duas perguntas diferentes.

   `checkinToday` devolve o registro de hoje — a linha onde moram a água,
   a proteína e o exercício. Ela nasce no primeiro copo d'água, porque os
   acumuladores precisam de onde somar.

   Quem pergunta "a pessoa fez o check-in?" não pode usar essa linha: um
   copo d'água às oito da manhã criava o registro e, com ele, o banner
   dizia "concluído", o streak subia e o empurrão do dia sumia — tudo sem
   ninguém ter respondido nada.

   `checkinFeito` procura resposta, não registro. Resposta é o que só
   existe porque alguém disse: energia, sono, humor, fome, os sintomas, o
   intestino, a anotação. Zero conta — marcar "não tive náusea" grava 0, e
   isso é uma resposta. Água em zero não conta: ela é zero desde que o dia
   nasceu. */
export function checkinToday(S: State) { const t = +startOfDay(now()); return S.checkins.find((c: any) => c.t === t); }

const RESPOSTAS = ['energia', 'sono', 'mood', 'fome', 'nausea', 'constip', 'diarreia', 'refluxo', 'gut'];

/** O dia tem alguma resposta — não só um acumulador que subiu sozinho. */
export function respostaNoDia(c: any) {
  if (!c) return false;
  if (RESPOSTAS.some((k) => c[k] != null)) return true;
  if (Object.keys(c.sint || {}).length) return true;
  if (String(c.outroTexto || '').trim()) return true;
  return !!String(c.note || '').trim();
}

export function checkinFeito(S: State) { return respostaNoDia(checkinToday(S)); }

export function streak(S: State) {
  let n = 0; let d = checkinFeito(S) ? 0 : 1;
  for (; ;) {
    const t = +startOfDay(daysAgo(d));
    if (respostaNoDia(S.checkins.find((c: any) => c.t === t))) { n++; d++; } else break;
  }
  return n;
}
export function checkins30(S: State) {
  const from = +daysAgo(30);
  return S.checkins.filter((c: any) => c.t >= from && respostaNoDia(c)).length;
}
export function waterToday(S: State) { const c = checkinToday(S); return c ? c.agua : 0; }

// radar 0..100 a partir das últimas 3 avaliações
/* Eixo sem resposta SAI do radar, em vez de aparecer zerado. Um vértice
   encostado no centro lê como "você foi mal nisso", e não é isso que um
   dia sem registro diz. A figura fica com menos pontas e continua
   verdadeira — o que é melhor do que oito pontas mentindo em três. */
export function radar(S: State) {
  const recent = S.checkins.slice(-3);
  const eixos: { k: string; v: number }[] = [];
  const põe = (k: string, v: number | null) => { if (v != null) eixos.push({ k, v }); };
  const esc = (m: number | null, f: (x: number) => number) => (m == null ? null : f(m));

  põe('Sono', esc(mediaDe(recent, 'sono'), (m) => Math.min(100, (m / 8) * 100)));
  põe('Energia', esc(mediaDe(recent, 'energia'), (m) => m * 10));
  põe('Humor', esc(mediaDe(recent, 'mood'), (m) => (m / 5) * 100));
  /* Acumuladores não somem: zero de água é uma resposta, não uma lacuna. */
  põe('Água', Math.min(100, ((mediaDe(recent, 'agua') ?? 0) / GOAL_WATER) * 100));
  põe('Exercício', recent.length
    ? Math.min(100, (recent.filter((c: any) => (c.exerc || 0) > 0).length / recent.length) * 100)
    : 0);
  põe('Proteína', Math.min(100, ((mediaDe(recent, 'prot') ?? 0) / 100) * 100));
  põe('Saciedade', esc(mediaDe(recent, 'fome'), (m) => (10 - m) * 10));
  põe('Adesão', adesao(S));
  return eixos;
}

// nível farmacológico estimado 0..1 num instante t
export function pharmaLevel(S: State, t: number) {
  const m = M(S); const tabs = 0.6; let lvl = 0;
  for (const inj of S.injections) {
    const dt = (t - inj.t) / DAY; if (dt < 0) continue;
    lvl += inj.dose * (1 - Math.exp(-dt / tabs)) * Math.exp(-dt * Math.LN2 / m.hl);
  }
  return lvl;
}
// amostra a curva ao redor de hoje e normaliza; retorna pontos + vale futuro
export function pharmaSeries(S: State) {
  const days = CADENCE_DAYS(S.profile.med);
  const from = +addDays(startOfDay(now()), -Math.min(days, 7));
  const to = +addDays(startOfDay(now()), days + 1);
  const pts: { t: number; v: number; n: number }[] = []; let max = 0;
  for (let t = from; t <= to; t += DAY / 2) { const v = pharmaLevel(S, t); pts.push({ t, v, n: 0 }); if (v > max) max = v; }
  pts.forEach((p) => (p.n = max ? p.v / max : 0));
  const nd = +nextInjectionDate(S); let trough: { t: number; v: number; n: number } | null = null;
  for (const p of pts) { if (p.t >= +startOfDay(now()) && p.t <= nd) { if (!trough || p.n < trough.n) trough = p; } }
  return { pts, trough, nextDose: nd };
}
export function hungerForecast(S: State) {
  const { trough } = pharmaSeries(S); if (!trough) return null;
  const d = diffDays(new Date(trough.t), now());
  return { when: new Date(trough.t), inDays: d };
}

export type Insight = { ic: string; text: string };
// insights automáticos (parte computada, parte heurística). Texto mantém marcador <b>..</b>.
export function insights(S: State): Insight[] {
  const out: Insight[] = [];
  const byWd: Record<number, number[]> = {};
  S.checkins.forEach((c: any) => { const w = new Date(c.t).getDay(); (byWd[w] = byWd[w] || []).push(c.agua); });
  let minWd: number | null = null, minV = 99;
  Object.entries(byWd).forEach(([w, a]) => { const m = a.reduce((s, x) => s + x, 0) / a.length; if (m < minV) { minV = m; minWd = +w; } });
  if (minWd !== null)
    out.push({ ic: 'water', text: `Você bebe menos água <b>${['aos domingos', 'às segundas', 'às terças', 'às quartas', 'às quintas', 'às sextas', 'aos sábados'][minWd]}</b> — cerca de ${minV.toFixed(0)} copos, contra ${GOAL_WATER} nos outros dias.` });
  const c = S.checkins;
  if (c.length >= 8) {
    const half = Math.floor(c.length / 2);
    const a = c.slice(0, half).reduce((s: number, x: any) => s + x.prot, 0) / half;
    const b = c.slice(half).reduce((s: number, x: any) => s + x.prot, 0) / (c.length - half);
    const pct = Math.round(((b - a) / a) * 100);
    if (pct > 0) out.push({ ic: 'flame', text: `Sua ingestão de proteína <b>subiu ${pct}%</b> nas últimas semanas. Isso ajuda a preservar massa magra durante a perda de peso.` });
  }
  const hf = hungerForecast(S);
  if (hf) out.push({ ic: 'drop2', text: `Sua fome tende a subir <b>${hf.inDays <= 0 ? 'nestes dias' : `nos próximos ${hf.inDays} dias`}</b>, quando o nível da ${M(S).mol.toLowerCase()} chega ao ponto mais baixo antes da próxima aplicação.` });
  out.push({ ic: 'moon', text: `Nas noites em que você dorme <b>7h ou mais</b>, seus registros de náusea no dia seguinte são menores.` });
  return out;
}

/* seletores das áreas complementares */
export const journeyDay = (S: State) => diffDays(now(), new Date(S.profile.startT)) + 1;
export const latestMeasure = (S: State) => S.measures[S.measures.length - 1];
export const firstMeasure = (S: State) => S.measures[0];
export function vitalLast(S: State, k: string) { const a = (S.vitals as any)[k]; return a && a.length ? a[a.length - 1] : null; }
export function examBy(S: State, m: string) { return S.exams.find((e: any) => e.marker === m); }
export const examLast = (e: any) => e.values[e.values.length - 1];
export const examFirst = (e: any) => e.values[0];
export const achDone = (S: State) => S.achievements.filter((a: any) => a.done);

export type Alert = { ic: string; kind: string; text: string; act: string };
export function alerts(S: State): Alert[] {
  const out: Alert[] = [];
  if (!checkinFeito(S)) out.push({ ic: 'leaf', kind: 'info', text: 'Check-in de hoje, quando quiser', act: 'sheet:checkin' });
  const dr = doseReminderDate(S); const nd = diffDays(nextInjectionDate(S), now());
  if (nd <= 1) out.push({ ic: 'syringe', kind: 'warn', text: `Aplicação ${nd <= 0 ? 'hoje' : 'amanhã'}`, act: 'nav:aplicacoes' });
  else if (dr) { const dd = diffDays(startOfDay(dr), now()); if (dd <= 1) out.push({ ic: 'syringe', kind: 'info', text: `Lembrete: aplicação ${diffDays(nextInjectionDate(S), now()) === 2 ? 'em 2 dias' : 'em breve'}`, act: 'nav:aplicacoes' }); }
  out.push({ ic: 'pill', kind: 'info', text: 'Estoque em 3 doses — renovar receita', act: 'nav:aplicacoes' });
  return out;
}

/* lembretes configuráveis */
export function doseReminderDate(S: State) {
  const r = S.reminders && S.reminders.dose; if (!r || !r.on) return null;
  const d = addDays(startOfDay(nextInjectionDate(S)), -(r.lead || 0)) as Date;
  d.setHours(r.hour || 9, r.min || 0, 0, 0);
  return d;
}
export function pesoReminderDate(S: State) {
  const r: any = S.reminders && S.reminders.peso; if (!r || !r.on) return null;
  const base = startOfDay(now());
  if (r.freq === 'diaria') { const d = new Date(base); d.setHours(r.hour || 8, r.min || 0, 0, 0); return d <= now() ? addDays(d, 1) : d; }
  const target = (r.dow == null ? 1 : r.dow); let add = (target - base.getDay() + 7) % 7;
  const same = new Date(base); same.setHours(r.hour || 8, r.min || 0, 0, 0);
  if (add === 0 && same <= now()) add = 7;
  const d = addDays(base, add) as Date; d.setHours(r.hour || 8, r.min || 0, 0, 0); return d;
}
export function dailyReminderDate(r: any) {
  if (!r || !r.on) return null;
  const d = new Date(startOfDay(now())); d.setHours(r.hour || 12, r.min || 0, 0, 0);
  return d <= now() ? addDays(d, 1) : d;
}
export function reminderWhen(d: Date | null) {
  if (!d) return null;
  const days = diffDays(startOfDay(d), startOfDay(now()));
  const day = days <= 0 ? 'hoje' : days === 1 ? 'amanhã' : DOW_PT[d.getDay()];
  return `${day} · ${hm(d.getHours(), d.getMinutes())}`;
}
export function activeReminderCount(S: State) {
  const R: any = S.reminders || {};
  return ['dose', 'peso', 'agua', 'proteina'].filter((k) => R[k] && R[k].on).length;
}

export function examStatus(e: any) {
  const v = examLast(e).v; const r = e.ref;
  const m = r.match(/([<>])\s*([\d,\.]+)/);
  if (m) { const lim = parseFloat(m[2].replace(',', '.')); return m[1] === '<' ? (v < lim ? 'ok' : 'alto') : (v > lim ? 'ok' : 'baixo'); }
  const rg = r.match(/([\d,\.]+)[–-]([\d,\.]+)/);
  if (rg) { const lo = parseFloat(rg[1].replace(',', '.')), hi = parseFloat(rg[2].replace(',', '.')); return v < lo ? 'baixo' : v > hi ? 'alto' : 'ok'; }
  return 'ok';
}
export function examGaugeData(e: any) {
  const v = examLast(e).v, r = e.ref;
  let min = 0, max = 1, bandL = 0, bandR = 1;
  const rng = r.match(/([\d,\.]+)\s*[–-]\s*([\d,\.]+)/), one = r.match(/([<>])\s*([\d,\.]+)/);
  if (rng) { const lo = parseFloat(rng[1].replace(',', '.')), hi = parseFloat(rng[2].replace(',', '.')), pad = (hi - lo) * 0.6 || hi * 0.2; min = Math.max(0, lo - pad); max = hi + pad; bandL = lo; bandR = hi; }
  else if (one) { const lim = parseFloat(one[2].replace(',', '.')); if (one[1] === '<') { min = 0; max = lim * 1.7; bandL = 0; bandR = lim; } else { min = 0; max = lim * 2.2; bandL = lim; bandR = max; } }
  else { min = 0; max = (v * 1.6) || 1; bandL = min; bandR = max; }
  const clamp = (x: number) => Math.max(1, Math.min(99, ((x - min) / ((max - min) || 1)) * 100));
  return { pos: clamp(v), bandL: clamp(bandL), bandR: clamp(bandR), min, max, status: examStatus(e) };
}

/* Modo clínica — recursos de equipe médica só aparecem com vínculo ativo. */
export const hasClinic = (S: State) => !!S.profile.clinic;

/* Marcos do tratamento — a narrativa da jornada em eventos (cronológico desc). */
export type Milestone = { t: number; ic: string; title: string; sub: string };
export function milestones(S: State): Milestone[] {
  const out: Milestone[] = [];
  out.push({ t: S.profile.startT, ic: 'leaf', title: 'Início do tratamento', sub: `${MEDS[S.profile.med].label} · ${kg(S.profile.startWeight)} kg` });
  let prev: number | null = null;
  for (const inj of S.injections as any[]) {
    if (prev != null && inj.dose !== prev) out.push({ t: inj.t, ic: 'dose', title: `Dose ajustada para ${nf(inj.dose, inj.dose % 1 ? 1 : 0)} mg`, sub: 'Titulação conforme orientação médica' });
    prev = inj.dose;
  }
  const w5 = S.weights.find((w: any) => (S.profile.startWeight - w.kg) / S.profile.startWeight >= 0.05);
  if (w5) out.push({ t: w5.t, ic: 'trend', title: '5% do peso inicial', sub: 'Marca clínica, com benefícios além da balança' });
  S.consultsHistory.forEach((ch: any) => out.push({ t: ch.t, ic: 'steth', title: `Consulta ${ch.type.toLowerCase()}`, sub: ch.note }));
  S.examBundles.forEach((b: any) => out.push({ t: b.t, ic: 'doc', title: b.name, sub: `${b.n} marcadores importados` }));
  achDone(S).forEach((a: any) => out.push({ t: a.t, ic: a.ic, title: a.title, sub: a.desc }));
  out.sort((a, b) => b.t - a.t);
  return out;
}

/* Aplicações — locais, rotação e calendário de constância (porta verbatim). */
export const SITE_LABEL: Record<string, string> = { 'abd-e': 'Abdômen (esq.)', 'abd-d': 'Abdômen (dir.)', 'coxa-e': 'Coxa (esq.)', 'coxa-d': 'Coxa (dir.)', 'braco-e': 'Braço (esq.)', 'braco-d': 'Braço (dir.)' };
export const siteLabel = (s: string) => SITE_LABEL[s] || s;
export function nextSite(S: State) {
  const used = S.injections.slice(-3).map((i: any) => i.site);
  const all = ['abd-e', 'abd-d', 'coxa-e', 'coxa-d', 'braco-e', 'braco-d'];
  return all.find((s) => !used.includes(s)) || all[0];
}
// calendário de aderência: 6 semanas, aplicadas marcadas, próxima tracejada — sem punição por dia perdido
export function injCalendar(S: State) {
  const applied = new Set(S.injections.map((i: any) => +startOfDay(new Date(i.t))));
  const nd = +startOfDay(nextInjectionDate(S)), today = +startOfDay(now());
  const anchor = new Date(Math.max(nd, today));
  const endSat = addDays(startOfDay(anchor), 6 - anchor.getDay());
  const cells: { day: number; applied: boolean; planned: boolean; today: boolean }[] = [];
  for (let i = 41; i >= 0; i--) {
    const d = addDays(endSat, -i); const key = +startOfDay(d);
    cells.push({ day: d.getDate(), applied: applied.has(key), planned: key === nd && key >= today, today: key === today });
  }
  return cells;
}

/* ============================================================
   GRADE DE SEMANAS — o calendário do acompanhamento

   Uma célula por semana de tratamento, da primeira até hoje mais algumas
   à frente. Cada célula sabe três coisas: se teve aplicação, quantos
   check-ins teve, e se é a semana corrente ou ainda por vir.

   É o mesmo dado que a barra de adesão resume num número, e a diferença
   é o que se enxerga: 87% não mostra ONDE ficaram os buracos, e é
   justamente o buraco — duas semanas seguidas sem registro em maio — que
   explica um platô. Um número esconde padrão; uma grade é o padrão.
   ============================================================ */
export type SemanaCelula = {
  n: number;                 // número da semana de tratamento
  aplicou: boolean;
  checkins: number;
  futura: boolean;
  atual: boolean;
  mes: string;               // rótulo curto, para agrupar visualmente
};

export function weekGrid(S: State, adiante = 4): SemanaCelula[] {
  const ini = startOfDay(new Date(S.profile.startT));
  const hoje = +startOfDay(now());
  const decorridas = Math.max(1, Math.floor(diffDays(now(), ini) / 7) + 1);
  const total = decorridas + adiante;

  const apl = S.injections.map((i: any) => +startOfDay(new Date(i.t)));
  const chk = (S.checkins as any[]).map((c) => c.t);

  return Array.from({ length: total }, (_, k) => {
    const de = +addDays(ini, k * 7);
    const ate = +addDays(ini, (k + 1) * 7);
    return {
      n: k + 1,
      aplicou: apl.some((t) => t >= de && t < ate),
      checkins: chk.filter((t) => t >= de && t < ate).length,
      futura: de > hoje,
      atual: hoje >= de && hoje < ate,
      mes: MES_CURTO[new Date(de).getMonth()],
    };
  });
}

const MES_CURTO = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** Os últimos sete dias, com o que foi registrado em cada um.

    Sete e não trinta: a semana é a unidade em que a pessoa se lembra do
    que fez. Numa grade de trinta dias, a célula de anteontem e a de três
    semanas atrás pesam igual — e só uma delas ainda pode ser corrigida.

    Ancorada em hoje à direita, não na segunda-feira: a pergunta é "como
    tenho ido", não "como foi a semana civil". */
export function last7Days(S: State) {
  const chk = new Set((S.checkins as any[]).map((c) => c.t));
  const apl = new Set(S.injections.map((i: any) => +startOfDay(new Date(i.t))));
  const hoje = +startOfDay(now());
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(startOfDay(now()), i - 6);
    const t = +d;
    return {
      t,
      dow: DOW_PT[d.getDay()][0].toUpperCase(),
      dia: d.getDate(),
      feito: chk.has(t),
      aplicou: apl.has(t),
      hoje: t === hoje,
    };
  });
}

/* Exames — categorias e explicações (porta verbatim). */
export const EXAM_CATS: [string, string[]][] = [
  ['Metabólico', ['HbA1c', 'Glicemia jejum', 'Insulina']],
  ['Lipídico', ['Colesterol total', 'HDL', 'LDL', 'Triglicerídeos']],
  ['Fígado & rim', ['Creatinina', 'TGO', 'TGP']],
  ['Tireoide', ['TSH', 'T4 livre']],
  ['Vitaminas', ['Vitamina D', 'Vitamina B12', 'Ferritina']],
];
export function examExplain(e: any) {
  const map: Record<string, string> = {
    'HbA1c': 'A HbA1c reflete sua glicose média dos últimos ~3 meses. A queda de 6,3 para 5,6% mostra um controle bem melhor — saiu da faixa de pré-diabetes, algo comum com a perda de peso no tratamento com GLP-1.',
    'Glicemia jejum': 'Sua glicose em jejum voltou à faixa normal, refletindo a melhora da sensibilidade à insulina que costuma acompanhar a redução de peso.',
    'Colesterol total': 'Caiu para dentro da faixa desejável, acompanhando a melhora dos triglicerídeos e do LDL.',
    'HDL': 'O HDL (colesterol "bom") subiu — protege o coração. Atividade física e perda de peso ajudam a elevá-lo.',
    'LDL': 'O LDL ("ruim") caiu para uma faixa saudável, reduzindo o risco cardiovascular.',
    'Triglicerídeos': 'Caíram bastante — costumam responder rápido à perda de peso e à redução de açúcar e álcool.',
    'Vitamina D': 'Subiu para uma faixa adequada, importante para ossos, humor e imunidade.',
  };
  return map[e.marker] || `Este marcador está ${examStatus(e) === 'ok' ? 'dentro da referência' : 'fora da referência'}. Vale acompanhar a evolução ao longo do tratamento e conversar com a Dra. Helena. Não interpreto exames isoladamente nem substituo a avaliação médica.`;
}

/* Ciclo da dose — fase atual, dia no ciclo e stepper (mockups neurosafe). */
/* Cada fase carrega uma explicação em português comum. O nome sozinho
   ("Início do retorno da fome") é diagnóstico sem contexto — numa tela de
   tratamento isso assusta em vez de orientar. */
export type Phase = { key: string; label: string; ic: string; range: string; hint: string; q: string };
export function doseCycle(S: State) {
  const li = lastInjection(S);
  const total = CADENCE_DAYS(S.profile.med);
  const injDate = li ? startOfDay(new Date(li.t)) : startOfDay(now());
  const dayIn = Math.max(1, Math.min(total, diffDays(now(), injDate) + 1));
  const phases: Phase[] = [
    { key: 'aplic', label: 'Aplicação', ic: 'syringe', range: 'Dia 1', hint: 'O efeito começa a subir nas próximas horas.', q: 'O que esperar no dia da aplicação?' },
    { key: 'pico', label: 'Pico de efeito', ic: 'rocket', range: 'Dias 1–2', hint: 'Remédio no ponto mais alto — a fome fica menor.', q: 'Quando tenho mais energia?' },
    { key: 'estab', label: 'Estabilidade', ic: 'shield', range: 'Dias 3–4', hint: 'Efeito constante, sem grandes oscilações.', q: 'Como funciona o ciclo da medicação?' },
    { key: 'retorno', label: 'Início do retorno da fome', ic: 'waves', range: 'Dias 5–6', hint: 'O remédio começa a cair, e a fome tende a voltar.', q: 'Por que sinto mais fome?' },
    { key: 'pre', label: 'Pré-aplicação', ic: 'target', range: `Dias 7+`, hint: 'Ponto mais baixo do ciclo, até a próxima dose.', q: 'Por que sinto mais fome?' },
  ];
  const idx = dayIn >= 7 ? 4 : dayIn >= 5 ? 3 : dayIn >= 3 ? 2 : dayIn >= 2 ? 1 : 0;
  return { dayIn, total, phases, idx, phase: phases[idx], nextDose: nextInjectionDate(S) };
}

/* ============================================================
   HOME DE AÇÃO — o motor do dia
   ============================================================ */

/* Briefing do dia — mensagem específica e acionável por fase do ciclo.
   Determinística (mesmo dia → mesma mensagem), muda conforme o ciclo anda. */
export function todayBrief(S: State) {
  const cyc = doseCycle(S);
  const ndDays = diffDays(nextInjectionDate(S), now());
  let head = '', body = '', q = '';
  switch (cyc.phase.key) {
    case 'aplic':
      head = 'Hoje é dia de aplicação.';
      body = 'Enjoo leve pode aparecer — prefira refeições menores ao longo do dia.';
      q = 'O que esperar no dia da aplicação?';
      break;
    case 'pico':
      head = 'Seu apetite tende a ficar mais baixo hoje.';
      body = 'Pico de efeito da medicação — bom dia para treinar e adiantar a proteína.';
      q = 'Quando tenho mais energia?';
      break;
    case 'estab':
      head = 'Seu corpo está na fase estável do ciclo.';
      body = 'Efeito constante — mantenha água e proteína em dia para sustentar a saciedade.';
      q = 'Como funciona o ciclo da medicação?';
      break;
    case 'retorno':
      head = 'Sua fome pode começar a aumentar nas próximas 24 horas.';
      body = 'Proteína e água seguram a saciedade nesta fase do ciclo.';
      q = 'Por que sinto mais fome?';
      break;
    default:
      head = ndDays <= 0 ? 'Fome no ponto alto — a aplicação é hoje.' : `Fome no ponto alto do ciclo — aplicação ${ndDays === 1 ? 'amanhã' : `em ${ndDays} dias`}.`;
      body = 'Não pule refeições: volumes menores, mais vezes, com proteína.';
      q = 'Por que sinto mais fome?';
  }
  // sinal extra: noite bem dormida muda o tom do dia
  const last = S.checkins[S.checkins.length - 1];
  if (last && last.sono >= 7.5 && cyc.phase.key !== 'aplic') {
    body = 'Você dormiu bem — seu corpo tende a responder melhor hoje. ' + body;
  }
  return { head, body, q, cyc };
}

/* Tarefas inteligentes do dia — cada uma só aparece quando faz sentido agora. */
export type TodayTask = { ic: string; text: string; sub?: string; to: string; warn?: boolean };
export function todayTasks(S: State): TodayTask[] {
  const out: TodayTask[] = [];
  const nd = nextInjectionDate(S);
  const ndDays = diffDays(nd, now());
  if (ndDays <= 3)
    out.push({ ic: 'syringe', text: ndDays <= 0 ? 'Aplicação hoje' : ndDays === 1 ? 'Aplicação amanhã' : `Aplicação em ${ndDays} dias`, sub: `${siteLabel(nextSite(S))} sugerido`, to: '/proxima-aplicacao', warn: ndDays <= 1 });
  out.push({ ic: 'pill', text: 'Renovar receita', sub: 'Restam 3 doses na caneta', to: '/aplicacoes' });
  const lastW = S.weights[S.weights.length - 1];
  const wDays = diffDays(now(), new Date(lastW.t));
  if (wDays >= 4) out.push({ ic: 'scale', text: 'Registrar peso', sub: `Último registro há ${wDays} dias`, to: '/registrar' });
  const examTask = S.protocol.tasks.find((t: any) => !t.done && /exame/i.test(t.t));
  if (examTask) out.push({ ic: 'doc', text: examTask.t, sub: 'Do protocolo desta semana', to: '/protocolos' });
  if (hasClinic(S)) {
    const cd = diffDays(new Date(S.consult.t), now());
    if (cd >= 0 && cd <= 2) out.push({ ic: 'cal', text: cd === 0 ? 'Consulta hoje' : cd === 1 ? 'Consulta amanhã' : 'Consulta em 2 dias', sub: S.consult.type, to: '/consultas', warn: cd <= 1 });
  }
  const wt = waterToday(S);
  if (now().getHours() >= 15 && wt < 4) out.push({ ic: 'water', text: 'Registrar água', sub: `${wt} de ${GOAL_WATER} copos até agora`, to: '/registrar' });
  const ciT = checkinToday(S);
  if (ciT && ciT.prot < 90) out.push({ ic: 'leaf', text: `Faltam ${Math.round(90 - ciT.prot)} g de proteína`, sub: 'Da meta diária de 90 g', to: '/alimentacao' });
  return out;
}

/* Conquista recente (≤7 dias) — só aparece quando há o que celebrar. */
export function recentAchievement(S: State) {
  const done = achDone(S).filter((a: any) => diffDays(now(), new Date(a.t)) <= 7);
  return done.length ? done[done.length - 1] : null;
}

/* ============================================================
   INSIGHTS — a camada de interpretação

   A Home diz como está hoje, a Jornada diz por onde passou. Esta camada
   responde "o que isso quer dizer": lê os registros e devolve padrão,
   não número.

   Tudo aqui é heurística sobre dado real, nunca conselho clínico — o
   texto precisa deixar isso claro sempre que tocar em dose ou sintoma.
   ============================================================ */
export type PatKey = 'alimentacao' | 'sono' | 'sintomas' | 'peso' | 'aplicacoes';
/* `surpresa` ordena a tela: 3 é o que a pessoa não veria sozinha (cruza duas
   variáveis, ou contraria a intuição), 0 é o que ela já sabe olhando a Home.
   Sem essa nota, um "ritmo de 0,7 kg/semana" — correto e óbvio — disputa
   espaço com "seu fim de semana é outro tratamento". */
export type Pattern = {
  key: PatKey; cat: string; ic: string; cor: string;
  titulo: string; texto: string; q: string; surpresa: number;
  /* O número que sustenta o achado, separado do texto para poder ser
     exibido grande. Sem ele o card afirma; com ele, o card mostra de onde
     tirou — e é a diferença entre parecer opinião e parecer descoberta. */
  evid?: { valor: string; unidade: string; legenda: string };
  /* O terceiro movimento: o que o achado quer dizer para esta pessoa.
     Sem ele o card informa e para; com ele, responde a pergunta que a
     pessoa faria em seguida — "e daí?". É a diferença entre dado e
     análise, e é o que faz a tela parecer escrita e não gerada. */
  significa: string;
  /* Por que o fenômeno acontece. Só os achados de maior surpresa têm —
     são os candidatos a virar a matéria da semana, e matéria precisa de
     um meio entre a manchete e a conclusão. Nos demais, explicar o
     mecanismo alongaria sem acrescentar. */
  porque?: string;
};

export const PAT_LABEL: Record<PatKey, string> = {
  alimentacao: 'Alimentação', sono: 'Sono', sintomas: 'Sintomas',
  peso: 'Peso', aplicacoes: 'Aplicações',
};

export function patterns(S: State): Pattern[] {
  const out: Pattern[] = [];
  const cs = S.checkins as any[];
  const n1 = (x: number) => nf(x, 1).replace('.', ',');
  const med = (arr: number[]) => (arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : 0);

  /* --- o fim de semana como outro tratamento ---
     Cruza três variáveis de uma vez. Ninguém percebe isso olhando um dia
     por vez: é preciso agrupar 13 check-ins por tipo de dia. */
  const fds = cs.filter((c) => [0, 6].includes(new Date(c.t).getDay()));
  const uteis = cs.filter((c) => ![0, 6].includes(new Date(c.t).getDay()));
  let fdsDito = false;
  if (fds.length >= 2 && uteis.length >= 3) {
    const dAgua = med(uteis.map((c) => c.agua)) - med(fds.map((c) => c.agua));
    const dProt = med(uteis.map((c) => c.prot)) - med(fds.map((c) => c.prot));
    const dSono = med(fds.map((c) => c.sono)) - med(uteis.map((c) => c.sono));
    if (dAgua >= 1.5) {
      fdsDito = true;
      /* a proteína só entra na frase quando a diferença é grande o
         bastante para significar alguma coisa — 5 g de gap não sustentam
         uma manchete, e insight que exagera o dado deixa de ser insight */
      const prot = dProt >= 8 ? ` e come ${Math.round(dProt)} g menos de proteína` : '';
      const sono = dSono >= 0.4 ? ` — mas dorme ${n1(dSono)} h a mais. O descanso melhora; a rotina é que se solta.` : '.';
      out.push({
        key: 'alimentacao', cat: 'Alimentação', ic: 'cal', cor: 'water', surpresa: 3,
        titulo: 'Seu fim de semana funciona como outro tratamento',
        texto: `Sábado e domingo você bebe ${n1(dAgua)} copos a menos${prot}${sono}`,
        q: 'Como cuidar melhor do fim de semana?',
        evid: { valor: `−${n1(dAgua)}`, unidade: 'copos', legenda: 'no sábado e no domingo' },
        porque: 'A rotina da semana carrega sua hidratação e suas refeições sem que você precise pensar nelas: horários fixos, garrafa na mesa, almoço na mesma hora. No sábado essa estrutura some, e o que sobra é decidir tudo na hora — que é exatamente quando a decisão fica mais difícil.',
        significa: 'Dois dias por semana o tratamento fica com um pé fora, e são justamente os dias em que você tem mais tempo. Não precisa de disciplina nova — precisa que o fim de semana tenha uma rotina própria, não a ausência da rotina da semana.',
      });
    }
  }

  /* --- água por dia da semana --- */
  const porDia: Record<number, number[]> = {};
  cs.forEach((c) => { const d = new Date(c.t).getDay(); (porDia[d] = porDia[d] || []).push(c.agua); });
  let piorDia: number | null = null, piorMedia = 99;
  Object.entries(porDia).forEach(([d, arr]) => {
    const m = med(arr);
    if (m < piorMedia) { piorMedia = m; piorDia = +d; }
  });
  /* se o card do fim de semana já falou disso, este vira eco: dois cards
     dizendo a mesma coisa gastam a confiança que o primeiro construiu */
  if (piorDia !== null && !(fdsDito && [0, 6].includes(piorDia))) {
    const outros = med(cs.filter((c) => new Date(c.t).getDay() !== piorDia).map((c) => c.agua));
    const nomes = ['aos domingos', 'às segundas', 'às terças', 'às quartas', 'às quintas', 'às sextas', 'aos sábados'];
    if (outros - piorMedia >= 1) out.push({
      key: 'alimentacao', cat: 'Alimentação', ic: 'water', cor: 'water', surpresa: 2,
      titulo: `Você bebe bem menos água ${nomes[piorDia]}`,
      texto: `Cerca de ${piorMedia.toFixed(0)} copos, contra ${outros.toFixed(0)} nos outros dias. Água ajuda com saciedade e com o enjoo — e é o dia em que os dois costumam pesar mais.`,
      q: 'Como está minha água?',
      evid: { valor: piorMedia.toFixed(0), unidade: `de ${outros.toFixed(0)} copos`, legenda: 'a média nesse dia da semana' },
      significa: 'Um dia da semana puxa sua média para baixo sozinho. Como é sempre o mesmo, dá para resolver com um lembrete só, em vez de vigiar a hidratação todos os dias.',
    });
  }

  /* --- proteína de hoje contra fome de amanhã ---
     A relação está a um dia de distância, então some no gráfico diário:
     a pessoa vê a fome de hoje ao lado do prato de hoje, nunca do de ontem. */
  const t: any = S.profile.targets;
  const seq = cs.slice(0, -1).map((c, i) => ({ prot: c.prot, fomeDepois: cs[i + 1].fome }));
  const bateu = seq.filter((p) => p.prot >= t.prot), naoBateu = seq.filter((p) => p.prot < t.prot);
  if (bateu.length >= 2 && naoBateu.length >= 2) {
    const fSim = med(bateu.map((p) => p.fomeDepois)), fNao = med(naoBateu.map((p) => p.fomeDepois));
    if (fNao - fSim >= 0.5) out.push({
      key: 'alimentacao', cat: 'Alimentação', ic: 'leaf', cor: 'lime', surpresa: 3,
      titulo: 'Nos dias em que você bate a proteína, o dia seguinte é mais fácil',
      texto: `Depois de chegar aos ${t.prot} g, sua fome no dia seguinte ficou em ${n1(fSim)}. Quando não chegou, ${n1(fNao)}. O efeito não aparece no mesmo dia — por isso é difícil notar sozinha.`,
      q: 'Como está minha proteína?',
      evid: { valor: `−${n1(fNao - fSim)}`, unidade: 'de fome', legenda: 'no dia seguinte a bater a meta' },
      porque: 'A proteína age na saciedade por um caminho mais lento que o do açúcar: ela demora a esvaziar do estômago e sustenta os sinais de saciedade por muitas horas. Por isso o efeito atravessa a noite e reaparece no apetite da manhã seguinte.',
      significa: `Bater a meta de proteína não é só cumprir tabela: é comprar um dia seguinte mais tranquilo. Quando a fome apertar, o que resolve não é o que você come naquela hora — é o que você comeu ontem.`,
    });
  }

  /* --- sono contra fome do dia seguinte --- */
  const pares = cs.slice(0, -1).map((c, i) => ({ sono: c.sono, fomeDepois: cs[i + 1].fome }));
  const bem = pares.filter((p) => p.sono >= 7), mal = pares.filter((p) => p.sono < 7);
  if (bem.length >= 2 && mal.length >= 2) {
    const fBem = med(bem.map((p) => p.fomeDepois)), fMal = med(mal.map((p) => p.fomeDepois));
    if (fMal - fBem >= 0.5) out.push({
      key: 'sono', cat: 'Sono', ic: 'moon', cor: 'purple', surpresa: 3,
      titulo: 'Dormir mais de sete horas segura sua fome no dia seguinte',
      texto: `Depois de noites completas sua fome ficou em ${n1(fBem)}; depois de noites curtas, ${n1(fMal)}. Seu apetite responde ao sono da véspera tanto quanto ao que você comeu.`,
      q: 'O que registrar antes de dormir?',
      evid: { valor: '7h', unidade: '+', legenda: 'o ponto em que sua fome muda' },
      porque: 'Dormir pouco mexe nos dois hormônios que regulam apetite: sobe o que dá fome e cai o que avisa que já deu. Não é falta de disciplina no dia seguinte — é o corpo pedindo energia rápida para compensar o que faltou de descanso.',
      significa: 'Sono não costuma entrar na conta de quem está tratando o peso, mas nos seus dados ele mexe no apetite como poucas coisas. Uma noite protegida pode valer mais para o dia seguinte do que qualquer ajuste no prato.',
    });
  }

  /* --- enjoo: onde ele começa e onde termina ---
     O achado não é que existe enjoo — é que ele tem hora para acabar. */
  const diasInj = (S.injections as any[]).map((i) => +startOfDay(new Date(i.t)));
  const desde = (c: any) => {
    const dia = +startOfDay(new Date(c.t));
    const ds = diasInj.filter((x) => x <= dia).map((x) => (dia - x) / DAY);
    return ds.length ? Math.min(...ds) : 99;
  };
  const perto = cs.filter((c) => desde(c) <= 2), longe = cs.filter((c) => desde(c) > 2 && desde(c) < 99);
  if (perto.length >= 2 && longe.length >= 2) {
    const ePerto = med(perto.map((c) => c.nausea)), eLonge = med(longe.map((c) => c.nausea));
    if (ePerto - eLonge >= 0.5) out.push({
      key: 'sintomas', cat: 'Sintomas', ic: 'waves', cor: 'rose', surpresa: 2,
      titulo: 'Seu enjoo costuma sumir cerca de 48 horas depois da aplicação',
      texto: `Ele fica em ${n1(ePerto)} nos dois primeiros dias e cai para ${n1(eLonge)} a partir do terceiro. Não é o tratamento inteiro que enjoa — são as primeiras 48 h de cada ciclo.`,
      q: 'Por que sinto enjoo?',
      evid: { valor: '48', unidade: 'horas', legenda: 'e então ele passa' },
      significa: `Isso se repetiu em ${perto.length} dos seus registros pós-aplicação. Saber que existe uma janela, e que ela acaba, muda o que fazer com ela: dá para escolher o dia da aplicação de forma que essas 48 h caiam no seu período mais leve da semana.`,
    });
  }

  /* --- água contra enjoo ---
     Duas coisas que a pessoa registra em telas diferentes, e que só se
     encontram quando alguém cruza as duas colunas. */
  const hidratados = cs.filter((c) => c.agua >= GOAL_WATER - 1);
  const secos = cs.filter((c) => c.agua < GOAL_WATER - 1);
  if (hidratados.length >= 3 && secos.length >= 3) {
    const eSim = med(hidratados.map((c) => c.nausea)), eNao = med(secos.map((c) => c.nausea));
    if (eNao - eSim >= 0.5) out.push({
      key: 'sintomas', cat: 'Sintomas', ic: 'water', cor: 'water', surpresa: 3,
      titulo: 'Nos dias em que você bebe bem, o enjoo é menor',
      texto: `Com ${GOAL_WATER - 1} copos ou mais, seu enjoo médio foi ${n1(eSim)}. Abaixo disso, ${n1(eNao)}. Não prova causa — mas é a variável mais fácil de mexer que aparece ligada ao sintoma.`,
      q: 'Como diminuir o enjoo?',
      evid: { valor: `−${n1(eNao - eSim)}`, unidade: 'de enjoo', legenda: 'nos dias bem hidratados' },
      significa: 'De tudo o que aparece ligado ao seu enjoo, a água é o que está mais na sua mão. Não substitui conversar com a equipe se ele apertar, mas é a primeira coisa que vale testar antes.',
    });
  }

  /* --- o platô que não impediu nada ---
     Contra-intuitivo por definição: a balança subiu e o resultado veio
     assim mesmo. É o padrão que evita abandono na semana ruim. */
  const ws = S.weights as any[];
  if (ws.length >= 5) {
    const subidas = ws.slice(1).filter((w, i) => w.kg > ws[i].kg).length;
    const total = ws[0].kg - ws[ws.length - 1].kg;
    if (subidas >= 1 && total > 0) out.push({
      key: 'peso', cat: 'Peso', ic: 'trend', cor: 'accent', surpresa: 3,
      titulo: `A balança subiu ${subidas} vezes e você perdeu ${n1(total)} kg mesmo assim`,
      texto: `Em ${ws.length} pesagens, ${subidas} vieram acima da anterior — e a linha do período continua descendo. Semana de alta não é recaída: é ruído de água e intestino dentro de uma tendência.`,
      q: 'Como está minha evolução?',
      evid: { valor: String(subidas), unidade: 'altas', legenda: `dentro de −${n1(total)} kg no período` },
      porque: 'O peso do dia é gordura, mas também é água, sal, intestino e o ciclo hormonal — variações de um a dois quilos acontecem sem que nada tenha mudado na gordura corporal. A gordura sai devagar e em linha; o resto oscila por cima dela e é o que a balança mostra primeiro.',
      significa: 'Isso importa mais do que parece: a semana em que a balança sobe é a semana em que as pessoas costumam desistir. Nos seus próprios números, ela nunca significou o que parecia significar.',
    });
  }

  /* --- proteína: metade recente contra metade antiga --- */
  if (cs.length >= 8) {
    const meio = Math.floor(cs.length / 2);
    const antes = med(cs.slice(0, meio).map((x) => x.prot));
    const depois = med(cs.slice(meio).map((x) => x.prot));
    const pct = Math.round(((depois - antes) / antes) * 100);
    if (Math.abs(pct) >= 5) out.push({
      key: 'alimentacao', cat: 'Alimentação', ic: 'flame', cor: 'lime', surpresa: 1,
      titulo: `Sua proteína ${pct > 0 ? 'subiu' : 'caiu'} ${Math.abs(pct)}% desde o começo`,
      texto: pct > 0
        ? `Média de ${Math.round(depois)} g/dia nas últimas semanas, contra ${Math.round(antes)} g no início. Proteína preserva massa magra durante a perda de peso.`
        : `Média de ${Math.round(depois)} g/dia nas últimas semanas, contra ${Math.round(antes)} g antes. Vale retomar — massa magra sustenta o metabolismo.`,
      q: 'Como está minha proteína?',
      evid: { valor: `${pct > 0 ? '+' : ''}${pct}%`, unidade: '', legenda: `${Math.round(antes)} → ${Math.round(depois)} g por dia` },
      significa: pct > 0
        ? 'Subiu sem que você anunciasse nenhuma mudança, o que costuma ser o tipo de hábito que fica. Proteína é o que protege sua massa magra enquanto o peso cai — sem ela, parte do que some não é gordura.'
        : 'A queda foi gradual, do tipo que não se percebe de um dia para o outro. Proteína é o que protege sua massa magra enquanto o peso cai; vale retomar antes que vire o novo normal.',
    });
  }

  /* --- os dois óbvios, no fim da fila --- */
  const r = journeySummary(S);
  out.push({
    key: 'peso', cat: 'Peso', ic: 'scale', cor: 'accent', surpresa: 0,
    titulo: `Seu ritmo é de ${r.ritmoLabel} kg por semana`,
    texto: r.verdict.good
      ? `${n1(r.lost)} kg em ${r.semana} semanas, dentro do esperado para a sua fase.`
      : `${n1(r.lost)} kg em ${r.semana} semanas. Vale comentar o ritmo com sua equipe na próxima consulta.`,
    q: 'Como está minha evolução?',
    evid: { valor: r.ritmoLabel, unidade: 'kg/sem', legenda: `${n1(r.lost)} kg em ${r.semana} semanas` },
    significa: r.verdict.good
      ? 'É um ritmo sustentável, e sustentável é o que importa: perdas rápidas demais costumam levar massa magra junto e voltar depois. O seu está no intervalo que a literatura associa a resultado que se mantém.'
      : 'Ritmo é uma conversa para ter com sua equipe, não comigo. Levo o número organizado para a consulta se você quiser.',
  });

  const ade = adesao(S);
  out.push({
    key: 'aplicacoes', cat: 'Aplicações', ic: 'syringe', cor: 'accent2', surpresa: 0,
    titulo: ade >= 100
      ? 'Você não atrasou nenhuma aplicação desde o começo'
      : `Você manteve ${ade}% das aplicações em dia`,
    texto: `São ${S.injections.length} aplicações desde o início do tratamento, ${ade >= 90 ? 'praticamente todas na data certa' : 'com alguns atrasos pelo caminho'}.`,
    q: 'Como funciona o ciclo da medicação?',
    evid: { valor: `${ade}%`, unidade: '', legenda: `${S.injections.length} aplicações desde o início` },
    significa: ade >= 90
      ? 'Essa consistência é um dos fatores que mais pesam numa boa resposta ao medicamento. O nível da substância no corpo depende de regularidade, não de esforço — e é o tipo de coisa que só aparece quando alguém olha o histórico inteiro.'
      : 'A regularidade pesa mais do que a dose exata do dia: cada atraso deixa uma janela em que o efeito cai antes da hora, e é nela que a fome costuma voltar mais forte.',
  });

  /* o mais surpreendente primeiro — a ordem da tela é a ordem do valor */
  return out.sort((a, b) => b.surpresa - a.surpresa);
}

/* ============================================================
   LEITURA DO EQUILÍBRIO

   O radar mostra oito eixos e não conclui nada — quem conclui é o
   paciente, que não sabe se 62% em proteína é bom. Aqui a IA lê o
   gráfico por ele: o gráfico vira ilustração de uma frase, não a frase.
   ============================================================ */
export function balanceRead(S: State) {
  const eixos = radar(S).slice().sort((a, b) => b.v - a.v);
  const fortes = eixos.slice(0, 2);
  const fracos = eixos.slice(-2).reverse();
  const fraco = eixos[eixos.length - 1];
  const media = eixos.reduce((s, e) => s + e.v, 0) / eixos.length;
  /* amplitude entre o melhor e o pior eixo: é ela que diz se o
     tratamento está equilibrado ou apoiado numa perna só */
  const amp = eixos[0].v - fraco.v;

  /* Fala em primeira pessoa, com abertura de conversa. "Seu equilíbrio
     está consistente" é laudo — quem escreve laudo é sistema. "Uma coisa
     me chamou atenção" é alguém que olhou os dados e resolveu comentar,
     que é exatamente o que a tela promete. */
  const abertura = amp <= 30 ? 'Reparei numa coisa boa.'
    : amp <= 55 ? 'Uma coisa me chamou atenção.'
      : 'Preciso te mostrar uma coisa.';

  /* Sem "seu" antes do par: "seu sono e adesão" concorda errado, e
     consertar com "seu sono e sua adesão" trava a frase. Os nomes dos
     eixos abrem a oração sozinhos. */
  const par = (a: string, b: string) => `${a} e ${b.toLowerCase()}`;
  /* Duas frases, não quatro. O gráfico ao lado mostra a variação que o
     texto antes precisava descrever — descrever e desenhar a mesma coisa
     é gastar o dobro do espaço para dizer uma vez. */
  const corpo = amp <= 30
    ? `${par(fortes[0].k, fortes[1].k)} puxam para cima, e nem ${fraco.k.toLowerCase()} ficou para trás. Eu não mudaria nada por enquanto.`
    : `${par(fortes[0].k, fortes[1].k)} estão consistentes. ${fraco.k} é o que mais oscila — seria meu foco para a próxima semana.`;

  return {
    abertura,
    texto: corpo,
    media: Math.round(media),
    fortes: fortes.map((e) => e.k),
    fracos: fracos.map((e) => e.k),
    fraco: fraco.k,
    q: `Como melhorar ${fraco.k.toLowerCase()}?`,
  };
}

/* O eixo mais fraco, dia a dia.

   O radar e as pétalas mostram a MÉDIA de cada indicador, e média esconde
   exatamente o que a leitura afirma: que aquele eixo "oscila". Duas
   semanas de 50 constante e duas semanas alternando 20 e 80 dão a mesma
   média e não são a mesma coisa. Aqui a série diária mostra a oscilação
   em vez de descrevê-la. */
/* null quando o dia não respondeu aquele eixo — a série pula o ponto em vez
   de desenhar um zero que ninguém disse. */
const EIXO_DIA: Record<string, (c: any, S: State) => number | null> = {
  'Sono': (c) => (respondido(c, 'sono') ? Math.min(100, (c.sono / 8) * 100) : null),
  'Energia': (c) => (respondido(c, 'energia') ? c.energia * 10 : null),
  'Humor': (c) => (respondido(c, 'mood') ? (c.mood / 5) * 100 : null),
  'Água': (c) => Math.min(100, ((c.agua || 0) / GOAL_WATER) * 100),
  'Exercício': (c) => ((c.exerc || 0) > 0 ? 100 : 0),
  'Proteína': (c) => Math.min(100, c.prot || 0),
  'Saciedade': (c) => (respondido(c, 'fome') ? (10 - c.fome) * 10 : null),
  'Adesão': (_c, S) => adesao(S),
};

export function balanceSeries(S: State, eixo: string, n = 8) {
  const f = EIXO_DIA[eixo];
  const cs = (S.checkins as any[]).slice(-n);
  if (!f || !cs.length) return [];
  return cs
    .map((c) => ({ t: c.t, bruto: f(c, S) }))
    .filter((p): p is { t: number; bruto: number } => p.bruto != null)
    .map((p) => ({ t: p.t, v: Math.max(0, Math.min(100, Math.round(p.bruto))) }));
}

/* ============================================================
   MEMÓRIA DO COMPANION

   A frase que prova que ele conhece esta pessoa e não uma qualquer.
   "Leu 51 registros" é verdadeiro mas soa a contador; o que constrói
   confiança é a extensão do que ele acompanha — desde quando, e o quê.

   O índice sai da quantidade de check-ins, e não de sorteio: a frase
   muda quando a jornada muda, não a cada vez que a tela desenha.
   ============================================================ */
export function companionMemoria(S: State): string {
  const dias = diffDays(now(), new Date(S.profile.startT));
  const semanas = Math.max(1, Math.floor(dias / 7));
  const nInj = S.injections.length;
  const nCheck = S.checkins.length;

  const frases = [
    `Acompanho seu tratamento desde a primeira aplicação, há ${dias} dias.`,
    `Conheço sua jornada desde o primeiro dia — ${semanas} semanas até aqui.`,
    /* Antes esta linha enumerava o que ele leu ("considerei seus check-ins,
       11 aplicações, 15 exames..."). Enumerar prova capacidade de contar,
       não de conhecer — e a frase que constrói confiança é a que fala de
       presença ao longo do tempo, não de volume processado. */
    'Conheço sua jornada desde o primeiro dia.',
    `Estou com você desde a primeira aplicação, ${nInj} doses atrás.`,
  ];
  return frases[nCheck % frases.length];
}

/* ============================================================
   BIBLIOTECA CONTEXTUAL

   Não é catálogo. Cada leitura entra porque alguma coisa no estado da
   pessoa a puxou — a fase do ciclo, um sintoma, a consulta marcada — e
   o motivo aparece no card. Conteúdo sem motivo visível vira blog.
   ============================================================ */
export type Leitura = { motivo: string; titulo: string; desc: string; ic: string; min: number };

export function libraryPicks(S: State): Leitura[] {
  const out: Leitura[] = [];
  const cyc = doseCycle(S);
  const ci: any = checkinToday(S);
  const cs = S.checkins as any[];
  const r = journeySummary(S);
  const m = M(S);

  const dia = Math.max(0, CADENCE_DAYS(S.profile.med) - diffDays(nextInjectionDate(S), now()));

  if (cyc.phase.key === 'retorno' || cyc.phase.key === 'pre') {
    out.push({ motivo: `Você está no dia ${dia} do ciclo, quando a fome volta`, titulo: 'Por que a fome volta antes da aplicação', desc: `O nível da ${m.mol.toLowerCase()} cai ao longo da semana, e a saciedade cai junto. Entender a curva tira a sensação de recaída.`, ic: 'drop2', min: 3 });
  }
  if (cyc.phase.key === 'aplic' || cyc.phase.key === 'pico') {
    out.push({ motivo: `Você aplicou há ${dia} ${dia === 1 ? 'dia' : 'dias'}`, titulo: 'Os primeiros dias depois da dose', desc: 'O que é esperado sentir na janela de 48 h e o que já merece uma mensagem para a equipe.', ic: 'dose', min: 3 });
  }

  const enjoo = cs.slice(-5).reduce((s, c) => s + c.nausea, 0) / Math.max(1, Math.min(5, cs.length));
  if (enjoo >= 2 || (ci && ci.nausea >= 4)) {
    const dias = cs.slice(-7).filter((c) => c.nausea >= 3).length;
    out.push({ motivo: `Você marcou enjoo em ${dias} dos últimos 7 dias`, titulo: 'Comer sem enfrentar o enjoo', desc: 'Combinações e horários que costumam passar melhor nos dias em que a comida parece demais.', ic: 'waves', min: 4 });
  }

  const t: any = S.profile.targets;
  const protMed = cs.length ? cs.reduce((s, c) => s + c.prot, 0) / cs.length : 0;
  if (protMed < t.prot) {
    out.push({ motivo: `Faltam ${Math.round(t.prot - protMed)} g para sua média bater a meta`, titulo: 'Proteína sem cozinhar mais', desc: 'Como chegar à meta com o que já existe na sua geladeira — o problema raramente é receita, é praticidade.', ic: 'flame', min: 5 });
  }

  const sonoMed = cs.length ? cs.reduce((s, c) => s + c.sono, 0) / cs.length : 0;
  if (sonoMed < 7) {
    out.push({ motivo: `Sua média de sono está em ${nf(sonoMed, 1).replace('.', ',')} h`, titulo: 'O sono como parte do tratamento', desc: 'Dormir pouco muda os hormônios da fome no dia seguinte — nos seus próprios registros isso já aparece.', ic: 'moon', min: 4 });
  }

  if (r.semana >= 8) {
    out.push({ motivo: `Semana ${r.semana}, com ${nf(r.lost, 1).replace('.', ',')} kg no período`, titulo: 'O que muda depois do terceiro mês', desc: 'A perda desacelera e isso é fisiologia, não falha. O que passa a valer mais do que a balança daqui em diante.', ic: 'journey', min: 6 });
  }

  if (hasClinic(S)) {
    const cd = diffDays(new Date(S.consult.t), now());
    if (cd >= 0 && cd <= 14) out.push({ motivo: `Sua consulta é daqui a ${cd} dias`, titulo: 'Como aproveitar melhor sua consulta', desc: 'O que levar, o que perguntar e como o resumo automático economiza os primeiros dez minutos.', ic: 'steth', min: 3 });
  }

  return out.slice(0, 4);
}

/* Perguntas que a pessoa já fez — a conversa continua entre sessões em vez
   de recomeçar do zero toda vez que a aba abre. */
export function recentQuestions(S: State): string[] {
  const a = ((S as any).asked || []) as { t: number; q: string }[];
  return [...new Set(a.slice().reverse().map((x) => x.q))].slice(0, 3);
}

/* Sugestões para o Morphi — o que faz sentido perguntar AGORA.

   Pergunta sugerida é a porta de entrada da IA: se ela vier genérica
   ("Como está minha evolução?" sempre), a inteligência não se prova. As
   duas primeiras saem do momento do tratamento; as outras cobrem o que a
   pessoa costuma querer saber. */
export function companionSuggestions(S: State): string[] {
  const out: string[] = [];
  const cyc = doseCycle(S);
  const nd = diffDays(nextInjectionDate(S), now());
  const ci: any = checkinToday(S);

  if (cyc.phase.key === 'retorno' || cyc.phase.key === 'pre') out.push('Por que senti mais fome hoje?');
  else if (cyc.phase.key === 'pico') out.push('Por que estou sem fome?');
  else if (cyc.phase.key === 'aplic') out.push('O que esperar depois da aplicação?');

  if (ci && ci.nausea >= 5) out.push('Como diminuir o enjoo?');
  if (nd <= 2) out.push('Posso trocar o dia da aplicação?');

  const a1c = examBy(S, 'HbA1c');
  if (a1c && a1c.values.length >= 2) out.push('O que meus exames mostram?');

  out.push('Analise meu progresso');
  if (hasClinic(S)) out.push('Prepare minha consulta');

  /* sem repetir e no máximo quatro — lista longa vira menu, não conversa */
  return [...new Set(out)].slice(0, 4);
}

/* Recomendações — o que fazer com o que foi encontrado. Saem da fase do
   ciclo e do que está em aberto, não de conselho genérico. */
/* Cada ação carrega o PORQUÊ e o PRAZO REAL, não um balde genérico.

   "Esta semana: agendar exame" é lista de tarefas. "Daqui a 9 dias:
   prepare perguntas para a consulta" é alguém organizando a agenda de
   outra pessoa — e a diferença toda está em o prazo ser calculado a
   partir do dado, não escolhido entre duas opções fixas. */
export type Reco = {
  /* ordem cronológica real, em dias — é ela que agrupa e ordena */
  emDias: number;
  ic: string;
  texto: string;
  /* a razão de a IA estar sugerindo isso agora */
  porque: string;
  to: string;
};

export function recommendations(S: State): Reco[] {
  const out: Reco[] = [];
  const cyc = doseCycle(S);
  const nd = diffDays(nextInjectionDate(S), now());
  const t: any = S.profile.targets;
  const cs = S.checkins as any[];
  const recentes = cs.slice(-4);
  const enjoo = recentes.length ? recentes.reduce((s, c) => s + c.nausea, 0) / recentes.length : 0;

  if (waterMlToday(S) < t.waterMl * 0.6) {
    out.push({
      emDias: 0, ic: 'water', texto: 'Beba mais água ainda hoje',
      porque: enjoo >= 2
        ? 'Nos seus dias bem hidratados o enjoo aparece menos — e você está na metade da meta'
        : 'Você está abaixo da metade da meta, e a água segura a saciedade até o fim do dia',
      to: '/medir-agua',
    });
  }
  if (cyc.phase.key === 'retorno' || cyc.phase.key === 'pre') {
    out.push({
      emDias: 0, ic: 'leaf', texto: 'Reforce a proteína no jantar',
      porque: 'Você está na fase do ciclo em que a fome volta, e a proteína de hoje aparece na fome de amanhã',
      to: '/medir-refeicao',
    });
  }
  if (!checkinFeito(S)) {
    out.push({
      emDias: 0, ic: 'check', texto: 'Faça o check-in de hoje',
      porque: 'É o registro que alimenta tudo o que eu consigo enxergar sobre você',
      to: '/checkin',
    });
  }

  if (nd >= 0 && nd <= 3) {
    out.push({
      emDias: nd, ic: 'syringe', texto: 'Separe a caneta e escolha o local',
      porque: 'A aplicação da semana está chegando, e alternar o local reduz irritação na pele',
      to: '/proxima-aplicacao',
    });
  }
  const p = penStock(S);
  if (!p.verdict.good) {
    out.push({
      emDias: Math.max(1, p.left * 7 - 7), ic: 'pill', texto: 'Peça a renovação da receita',
      porque: `Restam ${p.left} doses na caneta — pedindo agora, ela chega antes de acabar`,
      to: '/aplicacoes',
    });
  }
  const exame = S.protocol.tasks.find((x: any) => !x.done && /exame/i.test(x.t));
  if (exame) out.push({
    emDias: 5, ic: 'doc', texto: exame.t,
    porque: 'Está aberto no protocolo desta semana, e o resultado costuma demorar alguns dias',
    to: '/exames',
  });
  if (hasClinic(S)) {
    const cd = diffDays(new Date(S.consult.t), now());
    if (cd >= 0 && cd <= 14) out.push({
      emDias: cd, ic: 'cal', texto: 'Prepare suas perguntas para a consulta',
      porque: `${S.consult.type} com ${S.consult.doctor} — eu monto o resumo, você escolhe o que quer perguntar`,
      to: '/consultas',
    });
  }
  return out.sort((a, b) => a.emDias - b.emDias);
}

/* O rótulo do grupo sai do prazo, e o prazo sai do dado. */
export function recoBucket(d: number): string {
  if (d <= 0) return 'Hoje';
  if (d === 1) return 'Amanhã';
  if (d <= 7) return 'Esta semana';
  return `Daqui a ${d} dias`;
}

/* ============================================================
   HOME V2 — metas diárias e cartões de evolução (Figma 181:1869)
   ============================================================ */

/** Um copo de água = 250 ml. O check-in continua contando copos;
    a Home exibe em litros, que é como o desenho fala. */
export const CUP_ML = 250;

export const waterMlToday = (S: State) => waterToday(S) * CUP_ML;

const nfBR = (v: number, d = 0) => nf(v, d).replace('.', ',');

export type DailyTarget = {
  key: 'prot' | 'agua' | 'exerc';
  label: string;
  /* valor e unidade são dois elementos, nunca uma string só — mantém a
     coluna de números alinhada entre os três cards. */
  num: string; unit: string;
  maxLabel: string;
  cur: number; target: number; pct: number;
  remain: string; done: boolean;
  from: string; to: string;   // chaves da Palette p/ o gradiente da barra
};

/* As três metas do dia. Vêm do check-in de hoje contra profile.targets —
   quando não há check-in, tudo zera (e não some da tela: a meta continua
   valendo, só não foi cumprida ainda). */
export function dailyTargets(S: State): DailyTarget[] {
  const t: any = S.profile.targets;
  const ci: any = checkinToday(S);
  const prot = ci ? ci.prot : 0;
  const ml = waterMlToday(S);
  const ex = ci ? ci.exerc : 0;
  const mk = (
    key: DailyTarget['key'], label: string, cur: number, target: number,
    num: string, unit: string, maxLabel: string, remain: string, from: string, to: string,
  ): DailyTarget => ({
    key, label, cur, target, num, unit, maxLabel,
    pct: Math.max(0, Math.min(1, target ? cur / target : 0)),
    remain, done: cur >= target, from, to,
  });
  const faltaMl = Math.max(0, t.waterMl - ml);
  return [
    mk('prot', 'Ingestão de proteína', prot, t.prot,
      `${Math.round(prot)}`, 'g', `${t.prot} g`,
      prot >= t.prot ? 'Meta batida' : `Faltam ${Math.round(t.prot - prot)} g`,
      'limePale', 'lime'),
    mk('agua', 'Beber mais água', ml, t.waterMl,
      nfBR(ml / 1000, 1), 'L', `${nfBR(t.waterMl / 1000, 1)} L`,
      faltaMl <= 0 ? 'Meta batida' : `Faltam ${faltaMl >= 1000 ? `${nfBR(faltaMl / 1000, 1)} L` : `${Math.round(faltaMl)} ml`}`,
      'bluePale', 'accent2'),
    mk('exerc', 'Exercitar diariamente', ex, t.exercMin,
      `${Math.round(ex)}`, 'min', `${t.exercMin} min`,
      ex >= t.exercMin ? 'Meta batida' : `Faltam ${Math.round(t.exercMin - ex)} min`,
      'tealPale', 'teal'),
  ];
}

/* Todo número exibido vem com um veredito. O valor diz a medida; a palavra
   diz se está bom — e é a palavra que a pessoa procura primeiro. Sem isso
   ela faz a conta sozinha, e num tratamento médico faz errado. */
export type Verdict = { label: string; good: boolean };

/** Média de proteína dos últimos 7 dias, contra a meta. */
export function protein7d(S: State) {
  const from = +daysAgo(7);
  const r = S.checkins.filter((c: any) => c.t >= from);
  const avg = r.length ? r.reduce((s: number, c: any) => s + c.prot, 0) / r.length : 0;
  const target = (S.profile as any).targets.prot as number;
  const verdict: Verdict = avg >= target
    ? { label: 'Na meta', good: true }
    : avg >= target * 0.85
      ? { label: 'Perto da meta', good: true }
      : { label: 'Abaixo da meta', good: false };
  return { avg, target, verdict };
}

/** Gordura corporal da última medida, contra a meta do perfil. */
export function bodyFat(S: State) {
  const m = latestMeasure(S);
  const target = (S.profile as any).targets.bodyFat as number;
  if (!m) return null;
  const first = firstMeasure(S);
  const caindo = first ? m.gordura < first.gordura : false;
  const above = m.gordura > target;
  const verdict: Verdict = !above
    ? { label: 'Na meta', good: true }
    : caindo
      ? { label: 'Em queda', good: true }
      : { label: 'Acima da meta', good: false };
  return { v: m.gordura, target, above, verdict };
}

/** Peso perdido e o quanto a meta pede — cartão principal da evolução. */
export function weightCard(S: State) {
  const lost = lostKg(S);
  const goal = startWeight(S) - S.profile.goalWeight;
  return { lost, goal, lostLabel: `-${nfBR(lost, 1)} kg`, goalLabel: `Meta: -${nfBR(goal, 1)} kg` };
}

/** Série de peso normalizada (x,y ∈ 0..1) para o sparkline do card. */
export function weightSeries(S: State) {
  const w = S.weights;
  if (w.length < 2) return [] as { x: number; y: number }[];
  const ks = w.map((p: any) => p.kg);
  const lo = Math.min(...ks), hi = Math.max(...ks), span = hi - lo || 1;
  return w.map((p: any, i: number) => ({ x: i / (w.length - 1), y: (p.kg - lo) / span }));
}

/* Linha do tempo — mistura de eventos (aplicação, check-in, peso, água, treino,
   sono, proteína, humor) num feed cronológico (mockup neurosafe .23_2). */
/* Os oito tipos da árvore de informação. O filtro da Linha do tempo é
   exatamente esta lista — e cada chip carrega sua contagem, para a pessoa
   saber o que tem atrás dele antes de tocar. */
export type TLKind = 'checkin' | 'aplicacao' | 'peso' | 'foto' | 'refeicao' | 'exercicio' | 'consulta' | 'exame';

export const TL_LABEL: Record<TLKind, string> = {
  checkin: 'Check-ins', aplicacao: 'Aplicações', peso: 'Peso', foto: 'Fotos',
  refeicao: 'Refeições', exercicio: 'Exercícios', consulta: 'Consultas', exame: 'Exames',
};

export type TLEvent = {
  key: string; kind: TLKind; day: number; time: string;
  ic: string; color: string; title: string; sub: string;
  value: string; valueColor?: string;
};

/* Feed cronológico do tratamento inteiro. Água, sono, proteína e humor não
   são eventos próprios: são o conteúdo do check-in daquele dia — por isso
   entram resumidos na linha do check-in, e não como oito linhas repetidas. */
export function timelineEvents(S: State): TLEvent[] {
  const out: TLEvent[] = [];
  const med = M(S);
  const kgf = (x: number) => nf(x, 1).replace('.', ',');
  const D = (t: number) => +startOfDay(new Date(t));

  for (const inj of S.injections as any[]) {
    out.push({
      key: `inj-${inj.t}`, kind: 'aplicacao', day: D(inj.t), time: '09:00',
      ic: 'syringe', color: 'accent', title: `Aplicação ${nf(inj.dose, inj.dose % 1 ? 1 : 0)} ${med.unit}`,
      sub: `${med.mol} · ${siteLabel(inj.site)}`, value: '', valueColor: 'tx3',
    });
  }

  const w = S.weights as any[];
  w.forEach((cur, i) => {
    const prev = i > 0 ? w[i - 1] : null;
    const dl = prev ? cur.kg - prev.kg : 0;
    out.push({
      key: `peso-${cur.t}`, kind: 'peso', day: D(cur.t), time: '07:45',
      ic: 'scale', color: 'accent2', title: 'Peso', sub: `${kgf(cur.kg)} kg`,
      value: prev ? `${dl <= 0 ? '−' : '+'}${kgf(Math.abs(dl))} kg` : 'Peso inicial',
      valueColor: prev ? (dl <= 0 ? 'good' : 'tx2') : 'tx3',
    });
  });

  for (const cc of S.checkins as any[]) {
    const day = D(cc.t);
    const L = (cc.agua * CUP_ML) / 1000;
    out.push({
      key: `ci-${day}`, kind: 'checkin', day, time: '08:30',
      ic: 'check', color: 'accent', title: 'Check-in',
      sub: `${L.toFixed(1).replace('.', ',')} L · ${Math.round(cc.prot)} g proteína · ${Math.floor(cc.sono)}h de sono`,
      value: cc.mood >= 4 ? 'Bem' : cc.mood >= 3 ? 'Neutro' : 'Difícil',
      valueColor: cc.mood >= 4 ? 'good' : 'tx3',
    });
    if (cc.exerc > 0) out.push({
      key: `ex-${day}`, kind: 'exercicio', day, time: '07:00',
      ic: 'dumbbell', color: 'teal', title: 'Exercício', sub: `${cc.exerc} min de movimento`,
      value: '', valueColor: 'tx3',
    });
  }

  for (const p of S.photos as any[]) out.push({
    key: `foto-${p.t}`, kind: 'foto', day: D(p.t), time: '10:00',
    ic: 'camera', color: 'purple', title: 'Foto de progresso', sub: p.tag, value: '', valueColor: 'tx3',
  });

  for (const m of S.meals as any[]) out.push({
    key: `ref-${m.t}`, kind: 'refeicao', day: D(m.t), time: '12:30',
    ic: 'utensils', color: 'amber', title: m.name, sub: m.tag,
    value: `Proteína ${m.prot}`, valueColor: 'tx3',
  });

  for (const ch of S.consultsHistory as any[]) out.push({
    key: `con-${ch.t}`, kind: 'consulta', day: D(ch.t), time: '14:00',
    ic: 'steth', color: 'accent2', title: `Consulta ${ch.type.toLowerCase()}`, sub: ch.note, value: '', valueColor: 'tx3',
  });

  for (const b of S.examBundles as any[]) out.push({
    key: `exa-${b.t}`, kind: 'exame', day: D(b.t), time: '11:00',
    ic: 'doc', color: 'amber', title: b.name, sub: `${b.n} marcadores · ${b.source}`,
    value: b.shared ? 'Compartilhado' : '', valueColor: 'tx3',
  });

  out.sort((a, b) => b.day - a.day || (b.time > a.time ? 1 : b.time < a.time ? -1 : 0));
  return out;
}

/* A linha do tempo em capítulos semanais.

   Num tratamento semanal a aplicação não é "mais um evento": ela abre a
   semana. Tudo que acontece depois dela — check-in, peso, refeição, foto —
   pertence àquele ciclo. Por isso a aplicação vira o cabeçalho do capítulo,
   e não uma linha igual às outras. É assim que a paciente já pensa:
   "semana 10", não "agosto". */
/** Um destaque numérico do ciclo — valor + como ele se moveu. */
export type WeekMetric = { ic: string; label: string; valor: string; delta: string | null; good: boolean };

export type JourneyWeek = {
  semana: number; t: number; dose: string; site: string;
  eventos: TLEvent[]; deltaPeso: string | null;
  /** resumo dos registros da semana — "7 check-ins · 2 refeições" */
  resumo: string;
  /** dose diferente da semana anterior: o evento que mais muda o tratamento */
  mudouDose: boolean;
  /** o que os números daquele ciclo dizem, comparados com o anterior */
  metricas: WeekMetric[];
};

export function timelineWeeks(S: State): JourneyWeek[] {
  const evs = timelineEvents(S);
  const injs = (S.injections as any[]).slice().sort((a, b) => a.t - b.t);
  const med = M(S);
  const out: JourneyWeek[] = [];
  const n1 = (x: number) => nf(x, 1).replace('.', ',');

  /* Médias do ciclo — o que o corpo recebeu naquela semana. Calculadas
     para todos os ciclos antes do laço, porque cada semana precisa da
     anterior para dizer se melhorou ou piorou. */
  const janela = (i: number) => {
    const ini = +startOfDay(new Date(injs[i].t));
    const fim = i + 1 < injs.length ? +startOfDay(new Date(injs[i + 1].t)) : Infinity;
    const cs = (S.checkins as any[]).filter((x) => x.t >= ini && x.t < fim);
    if (!cs.length) return null;
    const med2 = (k: string) => cs.reduce((s: number, x: any) => s + (x[k] || 0), 0) / cs.length;
    return { agua: (med2('agua') * CUP_ML) / 1000, prot: med2('prot'), exerc: cs.reduce((s: number, x: any) => s + (x.exerc || 0), 0) };
  };
  const stats = injs.map((_, i) => janela(i));

  for (let i = injs.length - 1; i >= 0; i--) {
    const inicio = +startOfDay(new Date(injs[i].t));
    const fim = i + 1 < injs.length ? +startOfDay(new Date(injs[i + 1].t)) : Infinity;
    const eventos = evs.filter((e) => e.day >= inicio && e.day < fim && e.kind !== 'aplicacao');

    // variação de peso dentro do ciclo — o que a semana rendeu
    const pesos = (S.weights as any[]).filter((w) => {
      const d = +startOfDay(new Date(w.t));
      return d >= inicio && d < fim;
    });
    const anteriores = (S.weights as any[]).filter((w) => +startOfDay(new Date(w.t)) < inicio);
    const base = anteriores.length ? anteriores[anteriores.length - 1].kg : null;
    let deltaPeso: string | null = null;
    if (base != null && pesos.length) {
      const d = pesos[pesos.length - 1].kg - base;
      deltaPeso = `${d <= 0 ? '−' : '+'}${nf(Math.abs(d), 1).replace('.', ',')} kg`;
    }

    /* resumo por tipo — é o que a semana rendeu, não a lista do que houve */
    const contagem: Partial<Record<TLKind, number>> = {};
    for (const e of eventos) contagem[e.kind] = (contagem[e.kind] || 0) + 1;
    const nome: Partial<Record<TLKind, [string, string]>> = {
      checkin: ['check-in', 'check-ins'],
      peso: ['pesagem', 'pesagens'],
      foto: ['foto', 'fotos'],
      refeicao: ['refeição', 'refeições'],
      exercicio: ['exercício', 'exercícios'],
      consulta: ['consulta', 'consultas'],
      exame: ['exame', 'exames'],
    };
    const resumo = (Object.keys(contagem) as TLKind[])
      .map((k) => {
        const n = contagem[k]!;
        const [s, p] = nome[k] ?? [TL_LABEL[k].toLowerCase(), TL_LABEL[k].toLowerCase()];
        return `${n} ${n === 1 ? s : p}`;
      })
      .join(' · ');

    /* Destaques numéricos do ciclo. Cada um traz a variação contra a semana
       anterior — é a comparação que transforma número em informação. */
    const at = stats[i], ant = i > 0 ? stats[i - 1] : null;
    const metricas: WeekMetric[] = [];
    if (deltaPeso) metricas.push({
      ic: 'scale', label: 'Peso', valor: deltaPeso, delta: null, good: deltaPeso.startsWith('−'),
    });
    if (at) {
      const varia = (agora: number, antes: number | undefined, suf: string) =>
        antes == null ? null : `${agora >= antes ? '+' : '−'}${n1(Math.abs(agora - antes))} ${suf}`;
      metricas.push({
        ic: 'water', label: 'Hidratação', valor: `${n1(at.agua)} L/dia`,
        delta: varia(at.agua, ant?.agua, 'L'), good: !ant || at.agua >= ant.agua,
      });
      metricas.push({
        ic: 'leaf', label: 'Proteína', valor: `${Math.round(at.prot)} g/dia`,
        delta: ant ? `${at.prot >= ant.prot ? '+' : '−'}${Math.round(Math.abs(at.prot - ant.prot))} g` : null,
        good: !ant || at.prot >= ant.prot,
      });
      metricas.push({
        ic: 'dumbbell', label: 'Exercício', valor: `${at.exerc} min`,
        delta: ant ? `${at.exerc >= ant.exerc ? '+' : '−'}${Math.abs(at.exerc - ant.exerc)} min` : null,
        good: !ant || at.exerc >= ant.exerc,
      });
    }

    out.push({
      semana: i + 1, t: injs[i].t,
      dose: `${med.label} ${nf(injs[i].dose, injs[i].dose % 1 ? 1 : 0)} ${med.unit}`,
      site: siteLabel(injs[i].site),
      eventos, deltaPeso,
      resumo: resumo || 'Sem registros nesta semana',
      mudouDose: i > 0 && injs[i].dose !== injs[i - 1].dose,
      metricas,
    });
  }
  return out;
}

/** Contagem por tipo — alimenta os chips de filtro. Tipo sem evento não vira chip. */
export function timelineCounts(S: State): { kind: TLKind; label: string; n: number }[] {
  const all = timelineEvents(S);
  return (Object.keys(TL_LABEL) as TLKind[])
    .map((k) => ({ kind: k, label: TL_LABEL[k], n: all.filter((e) => e.kind === k).length }))
    .filter((x) => x.n > 0);
}

/* "O que já mudou" — o coração da Jornada.

   Uma paciente de GLP-1 abre esta tela com uma pergunta: está funcionando?
   Listar links para telas não responde. Mostrar de-onde-para-onde responde —
   e cobre justamente o que mais sustenta alguém num platô, quando a balança
   trava mas cintura, exames e composição seguem melhorando. */
export type Change = { ic: string; label: string; from: string; to: string; delta: string; good: boolean; to_: string };

export function journeyChanges(S: State): Change[] {
  const out: Change[] = [];
  const n1 = (x: number) => nf(x, 1).replace('.', ',');
  const fm = firstMeasure(S), lm = latestMeasure(S);

  /* Peso e cintura vão para /marcador, e não para a tela da área: são os
     dois marcadores que a própria pessoa registra, então existe um
     histórico linha a linha para abrir — com a série, cada registro e o
     caminho para corrigir. Os de baixo vêm de exame ou de balança, não
     têm lista para auditar, e seguem levando para onde o laudo mora. */
  out.push({
    ic: 'scale', label: 'Peso', from: `${n1(startWeight(S))} kg`, to: `${n1(curWeight(S))} kg`,
    delta: `−${n1(lostKg(S))} kg`, good: true, to_: '/marcador?m=peso',
  });

  if (fm && lm && fm !== lm) {
    if (lm.cintura !== fm.cintura) out.push({
      ic: 'ruler', label: 'Cintura', from: `${fm.cintura} cm`, to: `${lm.cintura} cm`,
      delta: `−${n1(fm.cintura - lm.cintura)} cm`, good: lm.cintura < fm.cintura, to_: '/marcador?m=cintura',
    });
    if (lm.gordura !== fm.gordura) out.push({
      ic: 'activity', label: 'Gordura corporal', from: `${n1(fm.gordura)}%`, to: `${n1(lm.gordura)}%`,
      delta: `−${n1(fm.gordura - lm.gordura)} pp`, good: lm.gordura < fm.gordura, to_: '/medidas',
    });
    if (lm.musculo !== fm.musculo) out.push({
      ic: 'dumbbell', label: 'Massa magra', from: `${n1(fm.musculo)} kg`, to: `${n1(lm.musculo)} kg`,
      delta: `${lm.musculo >= fm.musculo ? '+' : '−'}${n1(Math.abs(lm.musculo - fm.musculo))} kg`,
      good: lm.musculo >= fm.musculo, to_: '/medidas',
    });
  }

  const a1c = examBy(S, 'HbA1c');
  if (a1c && a1c.values.length >= 2) {
    const f = examFirst(a1c), l = examLast(a1c);
    out.push({
      ic: 'doc', label: 'HbA1c', from: `${n1(f.v)}%`, to: `${n1(l.v)}%`,
      delta: examStatus(a1c) === 'ok' ? 'Na referência' : 'Fora da faixa',
      good: examStatus(a1c) === 'ok', to_: '/exames',
    });
  }

  const pa = (S.vitals as any).pa;
  if (pa && pa.length >= 2) {
    const f = pa[0], l = pa[pa.length - 1];
    out.push({
      ic: 'heart', label: 'Pressão', from: `${f.sys}/${f.dia}`, to: `${l.sys}/${l.dia}`,
      delta: l.sys < f.sys ? 'Em queda' : 'Estável', good: l.sys <= f.sys, to_: '/saude',
    });
  }

  return out;
}

/* Metas — a linha de chegada.

   No estado, três das quatro metas guardam prog: 0: elas não são digitadas,
   são derivadas do que a pessoa registra. Só a meta manual ("vestir a calça
   jeans antiga") carrega um valor informado por ela. */
export type JourneyGoal = { id: string; ic: string; label: string; pct: number; hint: string };

export function journeyGoals(S: State): JourneyGoal[] {
  const recentes = S.checkins.slice(-14) as any[];
  /* Só os dias respondidos entram na conta. Quatorze dias com três noites
     registradas não são "21% das noites" — são três noites, e duas delas
     boas é 67%. Diluir pelo que não foi perguntado transformaria silêncio
     em fracasso. */
  const pctSono = pctDe(recentes, 'sono', (v) => v >= 7);
  const mediaEnergia = mediaDe(recentes, 'energia');

  return (S.goals as any[]).map((g) => {
    let pct = g.prog || 0;
    let hint = '';
    if (g.kind === 'peso') {
      pct = goalProgress(S);
      hint = `faltam ${nf(Math.max(0, curWeight(S) - S.profile.goalWeight), 1).replace('.', ',')} kg`;
    } else if (g.kind === 'sono') {
      pct = pctSono ?? 0;
      hint = pctSono == null
        ? 'sem noites registradas ainda'
        : `${Math.round(pctSono)}% das noites recentes`;
    } else if (g.kind === 'energia') {
      pct = (mediaEnergia ?? 0) * 10;
      hint = mediaEnergia == null
        ? 'sem check-ins recentes'
        : `energia média ${nf(mediaEnergia, 1).replace('.', ',')} de 10`;
    } else {
      hint = 'acompanhada por você';
    }
    return { id: g.id, ic: g.ic, label: g.label, pct: Math.max(0, Math.min(100, pct)), hint };
  });
}

/* Captura rápida — os três atalhos do sheet de registrar.

   O critério é FREQUÊNCIA, não importância. Aplicação é o registro mais
   importante do tratamento e mesmo assim não merece lugar fixo: acontece
   uma vez a cada sete dias, então em seis deles ocuparia um dos três
   espaços de maior destaque sem ser usada.

   Os três lugares vão para o que a pessoa faz todo dia — e mudam quando o
   dia pede outra coisa. */
export type QuickKey = 'agua' | 'refeicao' | 'checkin' | 'exercicio' | 'aplicacao' | 'sintomas' | 'exame' | 'anotacoes';

export function quickCapture(S: State): { motivo: string; acoes: QuickKey[] } {
  const nd = diffDays(nextInjectionDate(S), now());
  const li = lastInjection(S);
  const aplicouHoje = li ? +startOfDay(new Date(li.t)) === +startOfDay(now()) : false;

  /* Água e refeição são os dois registros que acontecem todo dia, então
     seguram lugar fixo. Só o terceiro gira conforme o momento — e nunca
     entra aí algo semanal como a aplicação, que ficaria parada seis dias
     em sete ocupando destaque. */
  if (nd <= 0 || aplicouHoje) {
    return {
      motivo: aplicouHoje ? 'Você aplicou hoje' : 'Hoje é dia de aplicação',
      acoes: ['agua', 'refeicao', 'sintomas'],   // é quando o enjoo aparece
    };
  }

  const ultima = (S.consultsHistory as any[])
    .slice().sort((a, b) => b.t - a.t)[0];
  if (ultima && diffDays(now(), new Date(ultima.t)) <= 2) {
    return {
      motivo: 'Depois da sua consulta',
      acoes: ['agua', 'refeicao', 'exame'],      // é quando os exames chegam
    };
  }

  return { motivo: 'Um dia comum de tratamento', acoes: ['agua', 'refeicao', 'exercicio'] };
}

/** Estoque da caneta — quantas doses restam e quando isso vira urgência. */
export function penStock(S: State) {
  const p: any = (S as any).pen || { dosesLeft: 0, dosesPerPen: 4 };
  const semanas = p.dosesLeft * (CADENCE_DAYS(S.profile.med) / 7);
  const verdict: Verdict = p.dosesLeft <= 1
    ? { label: 'Renove agora', good: false }
    : p.dosesLeft <= 3
      ? { label: 'Vale renovar a receita', good: false }
      : { label: 'Estoque em dia', good: true };
  return { left: p.dosesLeft, total: p.dosesPerPen, semanas, verdict };
}

/* Resumo do tratamento — os cinco números do topo da Jornada. */
export function journeySummary(S: State) {
  const lost = lostKg(S);
  const goal = startWeight(S) - S.profile.goalWeight;
  const semanas = Math.max(1, Math.ceil(journeyDay(S) / 7));
  const ritmo = lost / semanas;                       // kg por semana
  /* 0,5–1,5 kg/semana é a faixa que o tratamento costuma render. Fora dela
     o texto não alarma: aponta para conversar com a equipe. */
  const verdict: Verdict = ritmo >= 0.5 && ritmo <= 1.5
    ? { label: 'Em ritmo saudável', good: true }
    : ritmo > 1.5
      ? { label: 'Ritmo acelerado', good: false }
      : { label: 'Ritmo mais lento', good: true };
  return {
    dia: journeyDay(S), semana: S.protocol.week,
    lost, lostLabel: nf(lost, 1).replace('.', ','),
    goal, pct: Math.round((lost / goal) * 100),
    faltamLabel: nf(Math.max(0, goal - lost), 1).replace('.', ','),
    aplicacoes: S.injections.length,
    proximaEmDias: diffDays(nextInjectionDate(S), now()),
    /* ritmo semanal — diz mais que "71 dias de tratamento", que é trivia */
    ritmo, ritmoLabel: nf(ritmo, 1).replace('.', ','),
    adesao: adesao(S), streak: streak(S),
    verdict,
  };
}

/* ============================================================
   CUIDADO — a área das pessoas

   Diferente das outras abas, aqui quase nada é calculado: o dado já
   existe pronto no estado (consulta marcada, mensagens, receitas). O que
   falta é seleção — o que está esperando a pessoa, o que está esperando
   a equipe, e o que é só arquivo.
   ============================================================ */

/** Última mensagem da conversa com a equipe, com quem falou por último. */
export function lastMessage(S: State) {
  const m = S.messages as any[];
  if (!m.length) return null;
  const u = m[m.length - 1];
  return {
    ...u,
    daEquipe: u.from === 'doc',
    quando: relDay(new Date(u.t)),
  };
}

/** A próxima consulta, com o quanto falta e se já dá para se preparar. */
export function nextConsult(S: State) {
  if (!hasClinic(S)) return null;
  const d = new Date(S.consult.t);
  const dias = diffDays(d, now());
  return {
    data: d, dias,
    tipo: S.consult.type,
    doutor: S.consult.doctor,
    /* uma semana antes é quando faz sentido começar a juntar perguntas —
       antes disso ainda vai acontecer coisa que vale levar */
    prepararAgora: dias >= 0 && dias <= 7,
    label: dias <= 0 ? 'hoje' : dias === 1 ? 'amanhã' : `em ${dias} dias`,
  };
}

/** O que está esperando uma ação da pessoa — e só isso. */
export function carePending(S: State) {
  /* Título curto e sub explicando: a lista virou ListRow, e ListRow tem
     duas linhas. O título diz O QUE fazer, o sub diz por que agora — que
     é a informação que decide se a pessoa toca hoje ou semana que vem. */
  const out: { ic: string; texto: string; sub?: string; to: string; urgente?: boolean }[] = [];
  const cs = nextConsult(S);

  if (S.unread > 0) out.push({
    ic: 'companion',
    texto: `Responder ${S.unread === 1 ? 'a mensagem' : `as ${S.unread} mensagens`} da sua equipe`,
    sub: 'aguardando sua resposta',
    to: '/medico', urgente: true,
  });
  const p = penStock(S);
  if (!p.verdict.good) out.push({
    ic: 'pill', texto: 'Peça a renovação da receita',
    sub: `${p.left} ${p.left === 1 ? 'dose restante' : 'doses restantes'} · cerca de ${p.semanas} ${p.semanas === 1 ? 'semana' : 'semanas'}`,
    to: '/medico',
  });
  const exame = S.protocol.tasks.find((t: any) => !t.done && /exame/i.test(t.t));
  if (exame) out.push({ ic: 'doc', texto: exame.t, sub: 'pedido pela sua equipe', to: '/exames' });
  if (cs?.prepararAgora) out.push({
    ic: 'cal', texto: 'Prepare o que levar para a consulta',
    sub: `${cs.tipo.toLowerCase()} ${cs.label} · com ${cs.doutor}`,
    to: '/consultas',
  });
  return out;
}

/** Documentos e exames em uma lista só, do mais recente para o mais antigo. */
export function careDocs(S: State, n = 3) {
  const docs = (S.documents as any[]).map((d) => ({
    t: d.t, nome: d.name, tipo: d.kind,
    to: /exame/i.test(d.kind) ? '/exames' : '/resumo-medico',
  }));
  const recs = (S.prescriptions as any[]).map((r) => ({
    t: r.t, nome: r.name, tipo: 'Receita', to: '/medico',
  }));
  return [...docs, ...recs].sort((a, b) => b.t - a.t).slice(0, n);
}

/* ============================================================
   ESTADO DO ACOMPANHAMENTO

   Responde à pergunta que traz a pessoa à aba Cuidado: "como está meu
   cuidado agora?". Diferente de carePending, que lista o que exige ação,
   aqui TODAS as dimensões aparecem — inclusive as que estão bem. É a
   diferença entre um painel e uma lista de tarefas: o painel também
   precisa poder dizer "está tudo certo", e essa é justamente a
   informação que mais tranquiliza.
   ============================================================ */
/* Três níveis e não dois. "Precisa de atenção" junta coisas muito
   diferentes: uma receita que vence em três semanas e um exame já
   atrasado não pedem a mesma reação, e tratá-los igual ensina a pessoa a
   ignorar os dois. */
export type CareNivel = 'ok' | 'atencao' | 'acao';
export type CareTile = {
  ic: string; label: string; valor: string;
  nivel: CareNivel;
  to: string;
};

export function careStatus(S: State) {
  const cs = nextConsult(S);
  const p = penStock(S);
  const exame = S.protocol.tasks.find((t: any) => !t.done && /exame/i.test(t.t));

  const tiles: CareTile[] = [
    {
      ic: 'cal', label: 'Consulta',
      valor: cs ? (cs.dias <= 0 ? 'Hoje' : cs.dias === 1 ? 'Amanhã' : `Em ${cs.dias} dias`) : 'Sem consulta',
      nivel: !cs ? 'atencao' : cs.dias <= 1 ? 'acao' : 'ok',
      to: '/consultas',
    },
    {
      ic: 'companion', label: 'Mensagens',
      valor: S.unread > 0 ? `${S.unread} não ${S.unread === 1 ? 'lida' : 'lidas'}` : 'Tudo em dia',
      nivel: S.unread > 0 ? 'atencao' : 'ok',
      to: '/medico',
    },
    {
      ic: 'pill', label: 'Receita',
      valor: p.semanas <= 0 ? 'Vencida' : `Vence em ${p.semanas} ${p.semanas === 1 ? 'semana' : 'semanas'}`,
      nivel: p.left <= 1 ? 'acao' : p.verdict.good ? 'ok' : 'atencao',
      to: '/aplicacoes',
    },
    {
      ic: 'doc', label: 'Exames',
      valor: exame ? 'Pendente' : 'Em dia',
      nivel: exame ? 'acao' : 'ok',
      to: '/exames',
    },
  ];

  const n = tiles.filter((t) => t.nivel !== 'ok').length;
  const semanas = Math.max(1, Math.floor(diffDays(now(), new Date(S.profile.startT)) / 7));
  const r = journeySummary(S);
  const nomes = ['nenhuma', 'uma', 'duas', 'três', 'quatro'];

  /* Duas frases, não uma.

     A primeira diz como o tratamento está indo — e sai do dado real de
     evolução, não de otimismo genérico. A segunda dimensiona o que falta.
     Separadas nessa ordem, a pendência chega depois de a pessoa já saber
     que está no caminho certo, que é a diferença entre acompanhamento e
     cobrança. Uma frase só, começando por "2 coisas precisam", faz da
     tela um aviso. */
  const indoBem = r.verdict.good;
  const titulo = !hasClinic(S)
    ? 'Você ainda não tem uma equipe no Morphi'
    : indoBem
      ? 'Seu tratamento está evoluindo bem'
      : 'Sua equipe está acompanhando de perto';

  const sub = !hasClinic(S)
    ? 'Encontre um especialista para acompanhar seu tratamento de perto.'
    : n === 0
      ? `${S.profile.doctor} acompanha você há ${semanas} semanas, e está tudo em dia por aqui.`
      : `${S.profile.doctor} acompanha você há ${semanas} semanas. Nesta semana, ${nomes[n] ?? n} ${n === 1 ? 'coisa merece' : 'coisas merecem'} sua atenção.`;

  /* A mesma frase sem a duração. Onde o card já mostra "10 semanas" em
     corpo grande, repetir "acompanha você há 10 semanas" logo acima é
     dizer o número duas vezes — e a segunda gasta uma linha inteira. */
  const subCurto = !hasClinic(S)
    ? sub
    : n === 0
      ? `${S.profile.doctor} está com você, e não há nada pendente.`
      : `Com ${S.profile.doctor}. Nesta semana, ${nomes[n] ?? n} ${n === 1 ? 'coisa merece' : 'coisas merecem'} sua atenção.`;

  return { tiles, quantos: n, titulo, sub, subCurto };
}

/* ============================================================
   O ESTADO DO ACOMPANHAMENTO, EM UMA FRASE

   careStatus responde "como está cada dimensão" — quatro linhas, quatro
   níveis. Serve a um painel. Mas o hero não é painel: ele tem que dizer,
   numa frase só, o que está acontecendo com o acompanhamento AGORA.

   E o que está acontecendo muda de natureza ao longo do mês. Faltando
   três dias para a consulta, o assunto do cuidado é a consulta. No dia
   seguinte a ela, é a orientação nova. Com a receita vencendo, é a
   receita. No resto do tempo — que é a maior parte — é a continuidade.

   Por isso a saída é um estado nomeado e não um texto montado por
   concatenação: cada momento tem manchete própria, e a ordem em que os
   estados são testados é a ordem de precedência entre eles.
   ============================================================ */
export type CareMomento = 'consulta' | 'posConsulta' | 'pendencia' | 'emDia' | 'semClinica';

/* "a, b e c" — vírgula até o penúltimo, "e" só antes do último. Com join
   simples saía "mensagens e receita e exames", que é como uma máquina
   fala. */
const lista = (xs: string[]) =>
  xs.length <= 1 ? (xs[0] ?? '')
    : `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}`;

export function careState(S: State) {
  const cs = nextConsult(S);
  const st = careStatus(S);
  const semanas = Math.max(1, Math.floor(diffDays(now(), new Date(S.profile.startT)) / 7));
  const ad = adesao(S);
  const nomes = ['nenhuma', 'uma', 'duas', 'três', 'quatro'];

  /* Dois números e um rótulo, não três números.

     A primeira versão punha a adesão como terceiro "big number", e ela
     não é número: é veredito. Escrita em corpo 25 numa coluna de um
     terço, "Boa adesão" cortava — e a solução não era diminuir a fonte,
     era reconhecer que ali não cabia um número porque ali não HÁ um.
     Adesão desceu para a linha do pulso, onde qualificador é a gramática
     do lugar.

     Os dois que ficaram são contagens de verdade — duração e volume — e
     por isso ganham a leitura de relance que o princípio 9 pede: valor
     em cima, unidade embaixo. */
  const adRotulo = ad >= 90 ? 'Boa adesão' : ad >= 70 ? 'Adesão regular' : 'Adesão baixa';
  const metricas: { valor: string; label: string }[] = [
    { valor: String(semanas), label: 'semanas\nde acompanhamento' },
    { valor: String(S.injections.length), label: 'aplicações\nregistradas' },
  ];

  /* O plano em números.

     A régua de traços que vivia no hero não dizia nada, e a razão é que
     ela não tinha REFERÊNCIA: onze traços acesos não significam nada
     sem saber quantos existem ao todo. Barra sem denominador é decoração
     com aparência de dado.

     Estes três números dão o denominador — previstas, atual, cumpridas —
     e é a partir deles que a forma passa a ter o que mostrar. O
     horizonte vem do plano que a equipe traçou (profile.planoSemanas),
     não de uma alta: tratamento com GLP-1 não tem data de alta, tem
     data em que a titulação chega à dose de manutenção. */
  const grade = weekGrid(S, 0);
  /* A semana corrente vem da grade, não de `semanas`.

     `semanas` é quantas se COMPLETARAM — floor(dias/7) —, e a que a pessoa
     está vivendo é a seguinte. Usar uma no lugar da outra deslocava a
     régua em um: o marcador de "agora" caía sobre uma semana já cumprida,
     e a semana de fato corrente aparecia como prevista. */
  const plano = {
    previstas: (S.profile as any).planoSemanas ?? 16,
    atual: grade.length,
    cumpridas: grade.filter((g) => !g.futura && g.aplicou).length,
  };

  const base = { metricas, semanas, adesaoRotulo: adRotulo, plano };

  if (!hasClinic(S)) return {
    ...base, momento: 'semClinica' as CareMomento, nivel: 'atencao' as CareNivel,
    kicker: 'SEU ACOMPANHAMENTO',
    titulo: 'Você ainda não tem uma equipe.',
    texto: 'Encontre um especialista para acompanhar seu tratamento de perto.',
    pulso: 'Sem vínculo com clínica',
  };

  /* A consulta chegando vence tudo: nos dias que a antecedem, ela é o
     acompanhamento. Três dias é a janela em que dá tempo de preparar
     alguma coisa — antes disso ainda vai acontecer o que vale levar. */
  if (cs && cs.dias >= 0 && cs.dias <= 3) return {
    ...base, momento: 'consulta' as CareMomento, nivel: 'atencao' as CareNivel,
    kicker: 'SEU ACOMPANHAMENTO',
    titulo: 'Sua consulta está chegando.',
    /* O resumo saiu daqui e virou a faixa de vidro no pé do card. Numa
       frase corrida ele é informação; como faixa, com ícone e chevron,
       ele é uma coisa que se pode abrir — e era isso que ele queria ser
       desde o começo. */
    texto: cs.dias === 0
      ? `Sua consulta com ${cs.doutor} é hoje. Vale revisar o que você quer perguntar.`
      : `${cs.dias === 1 ? 'Falta 1 dia' : `Faltam ${cs.dias} dias`} para sua consulta com ${cs.doutor}.`,
    pulso: `Consulta ${cs.label}`,
  };

  /* Logo depois da consulta o tratamento costuma ter mudado, e é isso que
     a pessoa volta aqui para conferir. */
  const ultima = (S.consultsHistory as any[]).slice().sort((a, b) => b.t - a.t)[0];
  if (ultima && diffDays(now(), new Date(ultima.t)) <= 2) return {
    ...base, momento: 'posConsulta' as CareMomento, nivel: 'ok' as CareNivel,
    kicker: 'SEU ACOMPANHAMENTO',
    titulo: 'Sua equipe atualizou seu tratamento.',
    texto: 'Confira as orientações da consulta e o que muda na sua dose a partir de agora.',
    pulso: 'Tratamento atualizado',
  };

  if (st.quantos > 0) return {
    ...base, momento: 'pendencia' as CareMomento, nivel: 'acao' as CareNivel,
    kicker: 'SEU ACOMPANHAMENTO',
    titulo: 'Temos algumas coisas para cuidar.',
    /* nomeia o que é, em vez de contar quantos: "duas coisas" obriga a
       rolar para descobrir se importa */
    texto: `${nomes[st.quantos] ?? st.quantos} ${st.quantos === 1 ? 'pendência precisa' : 'pendências precisam'} de você — ${lista(st.tiles.filter((t) => t.nivel !== 'ok').map((t) => t.label.toLowerCase()))}. Nada urgente, mas vale resolver esta semana.`,
    pulso: `${st.quantos} ${st.quantos === 1 ? 'item pendente' : 'itens pendentes'}`,
  };

  return {
    ...base, momento: 'emDia' as CareMomento, nivel: 'ok' as CareNivel,
    kicker: 'SEU ACOMPANHAMENTO',
    titulo: 'Seu cuidado está em dia.',
    texto: `${S.profile.doctor} acompanha seu tratamento há ${semanas} semanas. Você está com boa adesão e não há nenhuma pendência importante no momento.`,
    pulso: 'Acompanhamento em dia',
  };
}

/* Contexto do tratamento — as três frases curtas que fazem a dose parecer
   acompanhada em vez de só registrada. */
export function doseContext(S: State) {
  const nd = diffDays(nextInjectionDate(S), now());
  const injs = S.injections as any[];

  /* há quanto tempo a dose atual não muda: acha a primeira aplicação da
     dose vigente andando de trás para frente */
  const atual = injs.length ? injs[injs.length - 1].dose : S.profile.dose;
  let i = injs.length - 1;
  while (i > 0 && injs[i - 1].dose === atual) i--;
  const desde = injs.length ? Math.max(1, Math.round(diffDays(now(), new Date(injs[i].t)) / 7)) : 0;

  const cs = nextConsult(S);
  return {
    proxima: nd <= 0 ? 'Aplicação hoje' : nd === 1 ? 'Próxima aplicação amanhã' : `Próxima aplicação em ${nd} dias`,
    naDose: desde > 0 ? `Nesta dose há ${desde} ${desde === 1 ? 'semana' : 'semanas'}` : null,
    /* cs.label já vem como "em 9 dias" / "amanhã" / "hoje", então a
       preposição não entra aqui — "consulta de em 9 dias" */
    revisao: cs ? `Revisão na consulta ${cs.dias <= 0 ? 'de hoje' : cs.label}` : null,
  };
}

/* ============================================================
   CICLO EM QUATRO FASES — a leitura das telas internas

   doseCycle() divide o ciclo em cinco etapas e é o que alimenta a Home e
   a Jornada: lá a pergunta é "em que ponto eu estou AGORA", e cinco
   etapas dão granularidade para a frase do dia mudar.

   A tela de Ciclo pergunta outra coisa — "como é o ciclo inteiro" — e aí
   cinco linhas é uma a mais do que a pessoa consegue guardar. Aplicação e
   pico são a mesma experiência vivida ("o efeito está subindo"), então
   viram uma fase só. Sobram quatro, que é o número de coisas que cabe na
   cabeça de quem está lendo isto pela primeira vez.

   As duas leituras convivem de propósito: nenhuma tela de aba muda por
   causa desta função.
   ============================================================ */
export type CicloFase = {
  key: string;
  /** "Dias 1–2 · subida" */
  titulo: string;
  /** o que a fase é, em meia linha */
  sub: string;
  /** primeiro e último dia do ciclo que a fase cobre */
  de: number; ate: number;
  comum: string;
  ajuda: string;
  /** só a fase de descida tem: é quando os sintomas que pedem médico aparecem */
  atencao?: string;
};

export const CICLO_FASES: CicloFase[] = [
  {
    key: 'subida', titulo: 'Dias 1–2 · subida', sub: 'Efeito subindo, apetite mais baixo',
    de: 1, ate: 2,
    comum: 'náusea leve, saciedade rápida, menos vontade de comer',
    ajuda: 'refeições menores e mais espaçadas; beber água ao longo do dia',
  },
  {
    key: 'plato', titulo: 'Dias 3–4 · platô', sub: 'Fase mais estável do ciclo',
    de: 3, ate: 4,
    comum: 'apetite constante, intestino mais lento',
    ajuda: 'priorizar proteína e fibra nas refeições',
  },
  {
    key: 'descida', titulo: 'Dias 5–6 · descida', sub: 'Efeito cedendo, fome voltando aos poucos',
    de: 5, ate: 6,
    comum: 'mais fome que nos primeiros dias, energia oscilando',
    ajuda: 'é a fase em que a fome volta — não significa que o tratamento parou de funcionar',
    atencao: 'vômito persistente ou dor abdominal forte: fale com seu médico',
  },
  {
    key: 'baixo', titulo: 'Dia 7 · ponto mais baixo', sub: 'Véspera da próxima aplicação',
    de: 7, ate: 99,
    comum: 'apetite mais próximo do habitual',
    ajuda: 'deixe a caneta e o local da aplicação definidos na véspera',
  },
];

/** Onde a pessoa está nas quatro fases, e o rótulo de cada uma em relação
    a hoje: "passou", "agora", "amanhã" ou o intervalo que falta. */
export function cicloFases(S: State) {
  const { dayIn, total, nextDose } = doseCycle(S);
  const fases = CICLO_FASES.map((f) => {
    const estado: 'passou' | 'agora' | 'amanha' | 'depois' =
      dayIn > f.ate ? 'passou'
        : dayIn >= f.de ? 'agora'
          : f.de === dayIn + 1 ? 'amanha' : 'depois';
    const selo = estado === 'passou' ? 'passou' : estado === 'agora' ? 'agora' : estado === 'amanha' ? 'amanhã' : `em ${f.de - dayIn} dias`;
    return { ...f, estado, selo };
  });
  const atual = fases.find((f) => f.estado === 'agora') ?? fases[fases.length - 1];
  return { dayIn, total, nextDose, fases, atual, pct: Math.round((dayIn / total) * 100) };
}

/* ============================================================
   CANETAS — o histórico do que foi aberto

   O estado guarda quantas doses sobraram na caneta atual, não uma lista
   de canetas. A lista é reconstruída a partir das aplicações: a caneta em
   uso cobre as últimas (dosesPerPen − dosesLeft) aplicações, e o resto do
   histórico é fatiado de trás para frente em blocos do mesmo tamanho.

   Reconstruir em vez de guardar significa que trocar a contagem de doses
   por caneta no perfil reescreve o histórico inteiro — que é justamente o
   comportamento certo enquanto a caneta não for uma entidade do estado.
   ============================================================ */

/* A validade depois de aberta virou campo de MEDS — ela varia por produto
   e não se deduz da molécula nem da cadência. Ver o bloco sobre `shelf`
   em logic/meds. */

export type Caneta = {
  id: number;
  /** 'uso' | 'fim' — a de cima é a que está aberta */
  estado: 'uso' | 'fim';
  label: string; dose: number; unit: string;
  usadas: number; total: number;
  /** timestamp da primeira aplicação da caneta; null se ainda não foi aberta */
  abertaEm: number | null;
  ultimaEm: number | null;
  aplicacoes: { t: number; site: string; dose: number }[];
};

export function canetas(S: State): Caneta[] {
  const p: any = (S as any).pen || { dosesLeft: 0, dosesPerPen: 4 };
  const total: number = p.dosesPerPen || 4;
  const injs = (S.injections as any[]).slice().sort((a, b) => a.t - b.t);
  const med = M(S);

  /* A caneta aberta pode estar pela metade; as anteriores sempre foram
     usadas até o fim. Por isso o corte começa pelo pedaço de cima. */
  const emUso = Math.max(0, Math.min(total, total - p.dosesLeft));
  const blocos: any[][] = [];
  let fim = injs.length;
  if (emUso > 0) { blocos.push(injs.slice(fim - emUso)); fim -= emUso; }
  while (fim > 0) { const ini = Math.max(0, fim - total); blocos.push(injs.slice(ini, fim)); fim = ini; }

  return blocos.map((bl, i) => ({
    id: i,
    estado: i === 0 && emUso > 0 ? 'uso' : 'fim',
    label: med.label,
    dose: bl.length ? bl[bl.length - 1].dose : S.profile.dose,
    unit: med.unit,
    usadas: bl.length,
    total,
    abertaEm: bl.length ? bl[0].t : null,
    ultimaEm: bl.length ? bl[bl.length - 1].t : null,
    aplicacoes: bl.map((x) => ({ t: x.t, site: x.site, dose: x.dose })),
  }));
}

/** A caneta aberta e o que decorre dela: validade, cobertura e o veredito
    de estoque que a Jornada já mostra no card de receita. */
export function canetaAtual(S: State) {
  const lista = canetas(S);
  const atual = lista[0] ?? null;
  const est = penStock(S);
  const cad = CADENCE_DAYS(S.profile.med);
  const validadeDias = SHELF_DAYS(S.profile.med);
  const vence = atual?.abertaEm ? addDays(new Date(atual.abertaEm), validadeDias) : null;
  /* Cobertura da receita: o que ainda há de dose vezes a cadência, contado
     a partir da próxima aplicação. É uma estimativa do app, não um dado da
     receita — o texto na tela diz "cerca de". */
  const cobreAte = addDays(nextInjectionDate(S), Math.max(0, est.left - 1) * cad);

  /* A caneta pode vencer ANTES de a última dose sair dela. Com Trulicity —
     14 dias de validade e 4 doses semanais — isso é a regra, não a exceção:
     a quarta dose cairia duas semanas depois de a caneta ter vencido. Quem
     consome decide o que fazer com o aviso; aqui só se constata. */
  const venceAntesDoFim = !!vence && vence < cobreAte;

  return { atual, lista, ...est, vence, cobreAte, validadeDias, venceAntesDoFim };
}

/* ============================================================
   NOTAS PARA A CONSULTA

   A lista é a fonte; o texto corrido é uma PROJEÇÃO dela, gerada só na
   hora de montar o relatório. O caminho inverso — guardar texto e tentar
   extrair estrutura — foi o que existia antes, e não sobrevive à primeira
   pergunta que a tela precisa responder: "esta nota é de antes ou depois
   de eu subir a dose?".
   ============================================================ */
export type Nota = { t: number; text: string; done: boolean };

export const notas = (S: State): Nota[] =>
  ((S as any).notes || []).slice().sort((a: Nota, b: Nota) => b.t - a.t);

export const notasAbertas = (S: State) => notas(S).filter((n) => !n.done);

/** As notas ainda não conversadas, em texto, para o resumo do médico. */
export function notasTexto(S: State) {
  const abertas = notasAbertas(S);
  return abertas.length ? abertas.map((n) => `• ${n.text}`).join('\n') : '';
}

/* ============================================================
   O REGISTRO DO DIA — acumulador não é estado

   O check-in de um dia é o recipiente daquele dia, e várias telas
   escrevem nele: o check-in em si, a água, o exercício, a refeição. O
   problema é que cada uma delas, ao criar o registro do zero, preenchia o
   dia INTEIRO com valores de enfeite — sono 7, humor 3, fome 5, energia 6.
   Registrar um copo d'água afirmava junto que a pessoa dormiu sete horas.

   A separação que resolve é entre dois tipos de campo:

     acumuladores — agua, prot, exerc. Contam o que foi acontecendo no dia,
       e zero é a resposta HONESTA de quem ainda não registrou nada. Nascem
       em zero e vão subindo.

     estados — sono, humor, fome, energia, sintomas. Descrevem como a
       pessoa esteve, e não têm valor neutro: só existem se ela disser.
       Ficam AUSENTES até ser perguntados.

   Quem lê estado precisa então saber lidar com ausência — e é por isso que
   as médias abaixo devolvem null em vez de zero. Um dia sem resposta não é
   um dia ruim; é um dia sem resposta, e a diferença entre as duas coisas é
   o que separa um diário de um boletim.
   ============================================================ */

/** Registro de hoje, criado se ainda não existir. Só os acumuladores
    nascem preenchidos — em zero, que é o que eles de fato valem. */
export function registroDoDia(s: any, t: number) {
  let c = s.checkins.find((x: any) => x.t === t);
  if (!c) { c = { t, agua: 0, prot: 0, exerc: 0 }; s.checkins.push(c); }
  return c;
}

/** O campo foi respondido naquele dia? */
export const respondido = (c: any, k: string) => typeof c?.[k] === 'number';

/** Média só dos dias em que o campo foi respondido; null se nenhum foi. */
export function mediaDe(cs: any[], k: string): number | null {
  const vs = (cs || []).filter((c) => respondido(c, k)).map((c) => c[k] as number);
  return vs.length ? vs.reduce((a, b) => a + b, 0) / vs.length : null;
}

/** Proporção de dias que atendem a condição, contando só os respondidos.
    null quando ninguém respondeu — não existe "0% das noites" se nenhuma
    noite foi registrada. */
export function pctDe(cs: any[], k: string, cond: (v: number) => boolean): number | null {
  const vs = (cs || []).filter((c) => respondido(c, k)).map((c) => c[k] as number);
  return vs.length ? (vs.filter(cond).length / vs.length) * 100 : null;
}
