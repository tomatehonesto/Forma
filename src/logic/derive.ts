/* Seletores / cálculos determinísticos — porta verbatim (S passa como parâmetro). */
import { DAY, startOfDay, now, daysAgo, addDays, diffDays, hm, DOW_PT, nf, kg } from './time';
import { MEDS, CADENCE_DAYS } from './meds';
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
export function checkinToday(S: State) { const t = +startOfDay(now()); return S.checkins.find((c: any) => c.t === t); }
export function streak(S: State) {
  let n = 0; let d = checkinToday(S) ? 0 : 1;
  for (; ;) { const t = +startOfDay(daysAgo(d)); if (S.checkins.find((c: any) => c.t === t)) { n++; d++; } else break; }
  return n;
}
export function checkins30(S: State) { const from = +daysAgo(30); return S.checkins.filter((c: any) => c.t >= from).length; }
export function waterToday(S: State) { const c = checkinToday(S); return c ? c.agua : 0; }

// radar 0..100 a partir das últimas 3 avaliações
export function radar(S: State) {
  const recent = S.checkins.slice(-3);
  const avg = (k: string) => (recent.length ? recent.reduce((s: number, c: any) => s + c[k], 0) / recent.length : 0);
  return [
    { k: 'Sono', v: Math.min(100, (avg('sono') / 8) * 100) },
    { k: 'Energia', v: avg('energia') * 10 },
    { k: 'Humor', v: (avg('mood') / 5) * 100 },
    { k: 'Água', v: Math.min(100, (avg('agua') / GOAL_WATER) * 100) },
    { k: 'Exercício', v: Math.min(100, (recent.filter((c: any) => c.exerc > 0).length / Math.max(1, recent.length)) * 100) },
    { k: 'Proteína', v: Math.min(100, (avg('prot') / 100) * 100) },
    { k: 'Saciedade', v: (10 - avg('fome')) * 10 },
    { k: 'Adesão', v: adesao(S) },
  ];
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
  if (!checkinToday(S)) out.push({ ic: 'leaf', kind: 'info', text: 'Check-in de hoje, quando quiser', act: 'sheet:checkin' });
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
export type Phase = { key: string; label: string; ic: string; range: string };
export function doseCycle(S: State) {
  const li = lastInjection(S);
  const total = CADENCE_DAYS(S.profile.med);
  const injDate = li ? startOfDay(new Date(li.t)) : startOfDay(now());
  const dayIn = Math.max(1, Math.min(total, diffDays(now(), injDate) + 1));
  const phases: Phase[] = [
    { key: 'aplic', label: 'Aplicação', ic: 'syringe', range: 'Dia 1' },
    { key: 'pico', label: 'Pico de efeito', ic: 'rocket', range: 'Dias 1–2' },
    { key: 'estab', label: 'Estabilidade', ic: 'shield', range: 'Dias 3–4' },
    { key: 'retorno', label: 'Início do retorno da fome', ic: 'waves', range: 'Dias 5–6' },
    { key: 'pre', label: 'Pré-aplicação', ic: 'target', range: `Dias 7+` },
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
  if (now().getHours() >= 15 && wt < 4) out.push({ ic: 'water', text: 'Beber água', sub: `${wt} de ${GOAL_WATER} copos até agora`, to: '/registrar' });
  return out;
}

/* Conquista recente (≤7 dias) — só aparece quando há o que celebrar. */
export function recentAchievement(S: State) {
  const done = achDone(S).filter((a: any) => diffDays(now(), new Date(a.t)) <= 7);
  return done.length ? done[done.length - 1] : null;
}

/* Linha do tempo — mistura de eventos (aplicação, check-in, peso, água, treino,
   sono, proteína, humor) num feed cronológico (mockup neurosafe .23_2). */
export type TLEvent = { key: string; day: number; time: string; ic: string; color: string; title: string; sub: string; value: string; valueColor?: string };
export function timelineEvents(S: State): TLEvent[] {
  const out: TLEvent[] = [];
  const med = M(S);
  const li = lastInjection(S);
  const cyc = doseCycle(S);
  const kgf = (x: number) => nf(x, 1).replace('.', ',');
  if (li) out.push({ key: 'inj', day: +startOfDay(new Date(li.t)), time: '09:00', ic: 'syringe', color: 'accent', title: `Aplicação ${li.dose} ${med.unit}`, sub: med.mol, value: `Dia ${cyc.dayIn} de ${cyc.total}`, valueColor: 'tx3' });
  const w = S.weights;
  if (w.length >= 2) {
    const cur = w[w.length - 1], prev = w[w.length - 2]; const dl = cur.kg - prev.kg;
    out.push({ key: 'peso', day: +startOfDay(new Date(cur.t)), time: '07:45', ic: 'scale', color: 'purple', title: 'Peso', sub: `${kgf(cur.kg)} kg`, value: `${dl <= 0 ? '−' : '+'}${kgf(Math.abs(dl))} kg`, valueColor: dl <= 0 ? 'good' : 'tx2' });
  }
  const days = S.checkins.slice(-2).reverse();
  for (const cc of days as any[]) {
    const day = +startOfDay(new Date(cc.t));
    out.push({ key: `ci-${day}`, day, time: '08:30', ic: 'check', color: 'accent', title: 'Check-in', sub: 'Como você está agora', value: '', valueColor: 'accent' });
    const L = cc.agua * 0.2, aguaPct = Math.round((cc.agua / GOAL_WATER) * 100);
    out.push({ key: `agua-${day}`, day, time: '07:30', ic: 'water', color: 'water', title: 'Água', sub: `${L.toFixed(1).replace('.', ',')} L`, value: `${aguaPct}% da meta`, valueColor: 'water' });
    if (cc.exerc > 0) out.push({ key: `tre-${day}`, day, time: '07:00', ic: 'dumbbell', color: 'accent', title: 'Treino', sub: `Caminhada ${cc.exerc} min`, value: 'Leve', valueColor: 'tx2' });
    const sh = Math.floor(cc.sono), sm = Math.round((cc.sono - sh) * 60);
    out.push({ key: `sono-${day}`, day, time: '22:45', ic: 'moon', color: 'purple', title: 'Sono', sub: `${sh}h${sm ? ` ${sm}min` : ''}`, value: cc.sono >= 7 ? 'Qualidade boa' : 'Qualidade ok', valueColor: 'tx2' });
    out.push({ key: `prot-${day}`, day, time: '19:30', ic: 'leaf', color: 'amber', title: 'Proteína', sub: `${Math.round(cc.prot)} g`, value: `${Math.round(cc.prot)}% da meta`, valueColor: 'amber' });
    out.push({ key: `hum-${day}`, day, time: '12:30', ic: 'mood', color: 'amber', title: 'Humor', sub: cc.mood >= 4 ? 'Bom' : cc.mood >= 3 ? 'Neutro' : 'Baixo', value: `${Math.round((cc.mood / 5) * 10)}/10`, valueColor: 'tx2' });
  }
  out.sort((a, b) => b.day - a.day || (b.time > a.time ? 1 : b.time < a.time ? -1 : 0));
  return out.slice(0, 14);
}
