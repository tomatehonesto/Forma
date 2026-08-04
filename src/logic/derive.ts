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
export type Pattern = { key: PatKey; cat: string; ic: string; cor: string; titulo: string; texto: string; q: string };

export const PAT_LABEL: Record<PatKey, string> = {
  alimentacao: 'Alimentação', sono: 'Sono', sintomas: 'Sintomas',
  peso: 'Peso', aplicacoes: 'Aplicações',
};

export function patterns(S: State): Pattern[] {
  const out: Pattern[] = [];
  const cs = S.checkins as any[];
  const n1 = (x: number) => nf(x, 1).replace('.', ',');

  /* água por dia da semana — onde a hidratação cai */
  const porDia: Record<number, number[]> = {};
  cs.forEach((c) => { const d = new Date(c.t).getDay(); (porDia[d] = porDia[d] || []).push(c.agua); });
  let piorDia: number | null = null, piorMedia = 99;
  Object.entries(porDia).forEach(([d, arr]) => {
    const m = arr.reduce((s, x) => s + x, 0) / arr.length;
    if (m < piorMedia) { piorMedia = m; piorDia = +d; }
  });
  if (piorDia !== null) {
    const nomes = ['aos domingos', 'às segundas', 'às terças', 'às quartas', 'às quintas', 'às sextas', 'aos sábados'];
    out.push({
      key: 'alimentacao', cat: 'Alimentação', ic: 'water', cor: 'water',
      titulo: `Sua hidratação cai ${nomes[piorDia]}`,
      texto: `Cerca de ${piorMedia.toFixed(0)} copos, contra ${GOAL_WATER} nos outros dias. Água ajuda com saciedade e com o enjoo.`,
      q: 'Como está minha água?',
    });
  }

  /* proteína: metade recente contra metade antiga */
  if (cs.length >= 8) {
    const meio = Math.floor(cs.length / 2);
    const antes = cs.slice(0, meio).reduce((s, x) => s + x.prot, 0) / meio;
    const depois = cs.slice(meio).reduce((s, x) => s + x.prot, 0) / (cs.length - meio);
    const pct = Math.round(((depois - antes) / antes) * 100);
    if (Math.abs(pct) >= 5) {
      out.push({
        key: 'alimentacao', cat: 'Alimentação', ic: 'leaf', cor: 'lime',
        titulo: `Sua proteína ${pct > 0 ? 'subiu' : 'caiu'} ${Math.abs(pct)}%`,
        texto: pct > 0
          ? `Média de ${Math.round(depois)} g/dia nas últimas semanas. Proteína preserva massa magra durante a perda de peso.`
          : `Média de ${Math.round(depois)} g/dia nas últimas semanas. Vale retomar — massa magra sustenta o metabolismo.`,
        q: 'Como está minha proteína?',
      });
    }
  }

  /* sono contra fome do dia seguinte */
  const pares = cs.slice(0, -1).map((c, i) => ({ sono: c.sono, fomeDepois: cs[i + 1].fome }));
  const bem = pares.filter((p) => p.sono >= 7), mal = pares.filter((p) => p.sono < 7);
  if (bem.length >= 2 && mal.length >= 2) {
    const fBem = bem.reduce((s, p) => s + p.fomeDepois, 0) / bem.length;
    const fMal = mal.reduce((s, p) => s + p.fomeDepois, 0) / mal.length;
    if (fMal - fBem >= 0.5) {
      out.push({
        key: 'sono', cat: 'Sono', ic: 'moon', cor: 'purple',
        titulo: 'Dormir 7h+ reduz sua fome no dia seguinte',
        texto: `Fome média de ${n1(fBem)} depois de noites boas, contra ${n1(fMal)} depois de noites curtas.`,
        q: 'O que registrar antes de dormir?',
      });
    }
  }

  /* enjoo concentrado nos dias após a aplicação */
  const diasInj = new Set((S.injections as any[]).map((i) => +startOfDay(new Date(i.t))));
  const nPerto = cs.filter((c) => {
    const dia = +startOfDay(new Date(c.t));
    return [...diasInj].some((t) => dia >= t && dia - t <= 2 * DAY);
  });
  if (nPerto.length >= 2) {
    const enjooPerto = nPerto.reduce((s, c) => s + c.nausea, 0) / nPerto.length;
    const resto = cs.filter((c) => !nPerto.includes(c));
    const enjooResto = resto.length ? resto.reduce((s, c) => s + c.nausea, 0) / resto.length : 0;
    if (enjooPerto - enjooResto >= 0.5) {
      out.push({
        key: 'sintomas', cat: 'Sintomas', ic: 'waves', cor: 'rose',
        titulo: 'Seu enjoo se concentra nos dias após a aplicação',
        texto: `Média de ${n1(enjooPerto)} nos dois dias seguintes, contra ${n1(enjooResto)} no resto da semana. Costuma diminuir com o tempo.`,
        q: 'Por que sinto enjoo?',
      });
    }
  }

  /* ritmo de perda */
  const r = journeySummary(S);
  out.push({
    key: 'peso', cat: 'Peso', ic: 'scale', cor: 'accent',
    titulo: `Seu ritmo é de ${r.ritmoLabel} kg por semana`,
    texto: r.verdict.good
      ? `${n1(r.lost)} kg em ${r.semana} semanas. Perder peso não é linear — semanas paradas fazem parte.`
      : `${n1(r.lost)} kg em ${r.semana} semanas. Vale comentar o ritmo com sua equipe na próxima consulta.`,
    q: 'Como está minha evolução?',
  });

  /* constância das aplicações */
  const ade = adesao(S);
  out.push({
    key: 'aplicacoes', cat: 'Aplicações', ic: 'syringe', cor: 'accent2',
    titulo: `${ade}% das aplicações em dia`,
    texto: ade >= 90
      ? `${S.injections.length} aplicações desde o início. Constância é o que faz a medicação trabalhar a seu favor.`
      : `${S.injections.length} aplicações desde o início. Atrasos mudam o efeito ao longo da semana.`,
    q: 'Como funciona o ciclo da medicação?',
  });

  return out;
}

/* Recomendações — o que fazer com o que foi encontrado. Saem da fase do
   ciclo e do que está em aberto, não de conselho genérico. */
export type Reco = { quando: 'hoje' | 'semana'; ic: string; texto: string; to: string };

export function recommendations(S: State): Reco[] {
  const out: Reco[] = [];
  const cyc = doseCycle(S);
  const nd = diffDays(nextInjectionDate(S), now());
  const t: any = S.profile.targets;

  if (cyc.phase.key === 'retorno' || cyc.phase.key === 'pre') {
    out.push({ quando: 'hoje', ic: 'leaf', texto: 'Reforce a proteína hoje — é a fase em que a fome volta', to: '/medir-refeicao' });
  }
  if (waterMlToday(S) < t.waterMl * 0.6) {
    out.push({ quando: 'hoje', ic: 'water', texto: 'Você está atrás na água — falta mais da metade da meta', to: '/medir-agua' });
  }
  if (!checkinToday(S)) {
    out.push({ quando: 'hoje', ic: 'check', texto: 'O check-in de hoje ainda não foi feito', to: '/checkin' });
  }

  if (nd <= 2) {
    out.push({ quando: 'semana', ic: 'syringe', texto: `Aplicação ${nd <= 0 ? 'hoje' : nd === 1 ? 'amanhã' : `em ${nd} dias`} — separe a caneta e o local`, to: '/proxima-aplicacao' });
  }
  const p = penStock(S);
  if (!p.verdict.good) {
    out.push({ quando: 'semana', ic: 'pill', texto: `${p.left} doses na caneta — renove a receita`, to: '/aplicacoes' });
  }
  const exame = S.protocol.tasks.find((x: any) => !x.done && /exame/i.test(x.t));
  if (exame) out.push({ quando: 'semana', ic: 'doc', texto: exame.t, to: '/exames' });
  if (hasClinic(S)) {
    const cd = diffDays(new Date(S.consult.t), now());
    if (cd >= 0 && cd <= 10) out.push({ quando: 'semana', ic: 'cal', texto: `Consulta em ${cd} dias — leve suas anotações`, to: '/consultas' });
  }
  return out;
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

  out.push({
    ic: 'scale', label: 'Peso', from: `${n1(startWeight(S))} kg`, to: `${n1(curWeight(S))} kg`,
    delta: `−${n1(lostKg(S))} kg`, good: true, to_: '/evolucao',
  });

  if (fm && lm && fm !== lm) {
    if (lm.cintura !== fm.cintura) out.push({
      ic: 'ruler', label: 'Cintura', from: `${fm.cintura} cm`, to: `${lm.cintura} cm`,
      delta: `−${n1(fm.cintura - lm.cintura)} cm`, good: lm.cintura < fm.cintura, to_: '/medidas',
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
  const media = (k: string) => (recentes.length ? recentes.reduce((s, c) => s + (c[k] || 0), 0) / recentes.length : 0);
  const pctSono = recentes.length
    ? (recentes.filter((c) => c.sono >= 7).length / recentes.length) * 100
    : 0;

  return (S.goals as any[]).map((g) => {
    let pct = g.prog || 0;
    let hint = '';
    if (g.kind === 'peso') {
      pct = goalProgress(S);
      hint = `faltam ${nf(Math.max(0, curWeight(S) - S.profile.goalWeight), 1).replace('.', ',')} kg`;
    } else if (g.kind === 'sono') {
      pct = pctSono;
      hint = `${Math.round(pctSono)}% das noites recentes`;
    } else if (g.kind === 'energia') {
      pct = media('energia') * 10;
      hint = `energia média ${nf(media('energia'), 1).replace('.', ',')} de 10`;
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
