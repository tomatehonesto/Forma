/* Seletores / cálculos determinísticos — porta verbatim (S passa como parâmetro). */
import { DAY, startOfDay, now, daysAgo, addDays, diffDays, fmtDate, fmtWD, hm, DOW_PT, nf, kg, relDay } from './time';
import { MEDS, CADENCE_DAYS, SHELF_DAYS } from './meds';
import { ehForca, iconeDe } from './modalidades';
import { MOMENTOS, nomeItem } from './prato';
import { ENERGIA, FOME, HUMOR, SINTOMA, SINTOMAS_LIDOS, SONO, grauDoSintoma, paraTela } from './escalas';
import type { State } from './seed';

/* A META DE ÁGUA SAI DO PERFIL, como a de proteína e a de exercício.

   Era a constante 8 aqui — oito copos, 2 L — enquanto o perfil pedia
   2,5 L e todas as telas de registro liam o perfil. Duas metas para a
   mesma água: a barra do dia dizia "faltam 2 L", o radar dava a mesma
   pessoa como 100% hidratada, e a conversa com o acompanhante contava os
   copos até oito. Nenhuma das três estava errada sozinha.

   Em COPOS porque é em copos que o check-in guarda a água, e é contra
   copos que estas contas comparam. Quem traduz para litro é a frase. */
export const metaDeCopos = (S: State) => (S.profile as any).targets.waterMl / CUP_ML;

export const M = (S: State) => MEDS[S.profile.med];
export const curWeight = (S: State) => S.weights[S.weights.length - 1].kg;
export const startWeight = (S: State) => S.profile.startWeight;
export const lostKg = (S: State) => startWeight(S) - curWeight(S);
export const lostPct = (S: State) => (lostKg(S) / startWeight(S)) * 100;
export const imc = (S: State, w: number) => w / (S.profile.height ** 2);
export const goalProgress = (S: State) =>
  Math.max(0, Math.min(100, ((startWeight(S) - curWeight(S)) / (startWeight(S) - S.profile.goalWeight)) * 100));
export const lastInjection = (S: State) => (S.injections.length ? S.injections[S.injections.length - 1] : null);

/* A CADÊNCIA REAL, que nem sempre é a do catálogo.

   CADENCE_DAYS lê MEDS: Mounjaro e Ozempic são semanais, Saxenda e
   Victoza são diários. É o certo para quase todo mundo, e é por isso que
   o cadastro não faz da frequência uma pergunta.

   Só que aplicar a cada dez ou catorze dias existe, e não é erro de quem
   faz: acontece por tolerância, por orientação e por preço da caneta.
   Para essa pessoa o app inteiro contava errado — próxima aplicação,
   adesão, dia do ciclo, quanto tempo dura o estoque — e cobrava dose
   atrasada de quem não estava atrasada.

   O cadastro pergunta isso como EXCEÇÃO, atrás de um toque, e guarda em
   profile.intervalo. Aqui é onde a exceção passa a valer: as dez contas
   que dependiam da cadência leem esta função, e não mais o catálogo
   direto. Sem isto a resposta seria lida na tela do cadastro e jogada
   fora — que é exatamente o defeito que o "Quando" da tela de aplicação
   já teve. */
export const cadenciaDias = (S: State) => {
  const i = (S.profile as any).intervalo;
  return typeof i === 'number' && i > 0 ? i : CADENCE_DAYS(S.profile.med);
};

/** A idade, contada da data de nascimento — inclusive se já fez anos. */
export const idadeDe = (S: State) => {
  const t = (S.profile as any).nascimento;
  if (typeof t !== 'number') return null;
  const d = new Date(t); const h = now();
  let anos = h.getFullYear() - d.getFullYear();
  const m = h.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && h.getDate() < d.getDate())) anos -= 1;
  return anos;
};

/* COMO A CADÊNCIA SE ESCREVE, em dois comprimentos.

   Quatro telas montavam esta frase por conta própria, cada uma com a sua
   redação e todas lendo med.cad direto do catálogo: "uma vez por
   semana", "1× por semana", "diariamente", "diária", "uso diário". Com o
   intervalo de exceção, as quatro passaram a contradizer a contagem do
   próprio app — a tela de aplicações dizia "uma vez por semana" logo
   acima de um anel marcando dia 5 de 10.

   Os dois comprimentos são de propósito: a linha de abertura de uma tela
   fala por extenso, e a célula de uma tabela de resumo médico não tem
   essa largura. */
export const cadenciaTexto = (S: State) => {
  const d = cadenciaDias(S);
  if (d === 7) return 'uma vez por semana';
  if (d === 1) return 'uso diário';
  return `a cada ${d} dias`;
};

export const cadenciaCurta = (S: State) => {
  const d = cadenciaDias(S);
  if (d === 7) return '1× por semana';
  if (d === 1) return 'diária';
  return `a cada ${d} dias`;
};

export function nextInjectionDate(S: State) {
  const li = lastInjection(S); if (!li) return startOfDay(now());
  return addDays(startOfDay(new Date(li.t)), cadenciaDias(S));
}
export function adesao(S: State) {
  const days = diffDays(now(), new Date(S.profile.startT));
  const expected = Math.floor(days / cadenciaDias(S)) + 1;
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
  põe('Água', Math.min(100, ((mediaDe(recent, 'agua') ?? 0) / metaDeCopos(S)) * 100));
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
  const days = cadenciaDias(S);
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
  /* Só os dias que TÊM água registrada. Os check-ins antigos guardam
     exercício e proteína e mais nada, e um undefined no meio fazia a
     média virar NaN — todas as sete viravam, nenhuma ganhava a
     comparação, e o padrão nunca aparecia para ninguém. */
  S.checkins.forEach((c: any) => {
    if (typeof c.agua !== 'number') return;
    const w = new Date(c.t).getDay();
    (byWd[w] = byWd[w] || []).push(c.agua);
  });
  let minWd: number | null = null, minV = 99;
  Object.entries(byWd).forEach(([w, a]) => { const m = a.reduce((s, x) => s + x, 0) / a.length; if (m < minV) { minV = m; minWd = +w; } });
  /* "CONTRA A META", e não "contra os outros dias". A frase terminava em
     "contra 8 nos outros dias" e os 8 eram a meta, não o que a pessoa
     bebe de segunda a sábado: o texto atribuía a ela um hábito que talvez
     nunca tivesse tido. E em litros, que é como as duas telas de água
     falam. */
  if (minWd !== null)
    out.push({ ic: 'water', text: `Você bebe menos água <b>${['aos domingos', 'às segundas', 'às terças', 'às quartas', 'às quintas', 'às sextas', 'aos sábados'][minWd]}</b> — cerca de ${litros(minV * CUP_ML)} L, contra a meta de ${litros(metaDeCopos(S) * CUP_ML)} L.` });
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
/* TER ACOMPANHAMENTO não é ter uma clínica.

   Isto lia só `clinic`, e por isso quem é acompanhado por uma médica sem
   clínica no nome — a maioria — aparecia para o app como pessoa sozinha:
   a aba Cuidado escondia o preparo de consulta e o resumo médico dizia
   que não havia para quem mandar.

   O cadastro pergunta uma coisa só, "alguém acompanha você?", e guarda um
   nome, porque se ele é de pessoa ou de lugar é assunto de quem responde.
   Aqui a pergunta continua a mesma de antes — existe alguém do outro
   lado? —, e agora ela olha para os dois campos. */
export const hasClinic = (S: State) => !!(S.profile.doctor || S.profile.clinic);

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
/* ============================================================
   O RODÍZIO DOS LOCAIS

   Alternar o local não é burocracia: repetir o mesmo ponto causa nódulo
   e irritação, e é o tipo de coisa que ninguém controla de cabeça. O app
   tem a resposta inteira guardada — cada aplicação traz o local e a data
   —, e usava isso só para SUGERIR o próximo, numa linha de texto.

   Aqui ele devolve a coisa toda: há quanto tempo cada um dos seis
   descansa. É o que transforma "Abdômen (esq.) sugerido" em uma decisão
   que a pessoa consegue conferir sozinha.

   Local nunca usado devolve semanas nulo — e não zero. Zero seria "usado
   esta semana", que é o oposto. */
export type LocalDoRodizio = {
  id: string;
  label: string;
  ultima: number | null;
  /** semanas desde a última vez; null quando nunca foi usado */
  semanas: number | null;
  proximo: boolean;
};

export function rodizioDeLocais(S: State): LocalDoRodizio[] {
  const prox = nextSite(S);
  const hoje = +startOfDay(now());
  const ultimaDe = new Map<string, number>();
  for (const i of S.injections as any[]) {
    const t = +startOfDay(new Date(i.t));
    if (!ultimaDe.has(i.site) || t > (ultimaDe.get(i.site) as number)) ultimaDe.set(i.site, t);
  }
  return Object.keys(SITE_LABEL).map((id) => {
    const ultima = ultimaDe.get(id) ?? null;
    return {
      id,
      label: SITE_LABEL[id],
      ultima,
      semanas: ultima == null ? null : Math.floor((hoje - ultima) / (7 * DAY)),
      proximo: id === prox,
    };
  }).sort((a, b) => (a.ultima ?? -1) - (b.ultima ?? -1));
}

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
  const total = cadenciaDias(S);
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
    out.push({ ic: 'syringe', text: ndDays <= 0 ? 'Aplicação hoje' : ndDays === 1 ? 'Aplicação amanhã' : `Aplicação em ${ndDays} dias`, sub: `${siteLabel(nextSite(S))} sugerido`, to: '/aplicacoes', warn: ndDays <= 1 });
  out.push({ ic: 'pill', text: 'Renovar receita', sub: 'Restam 3 doses na caneta', to: '/aplicacoes' });
  const lastW = S.weights[S.weights.length - 1];
  const wDays = diffDays(now(), new Date(lastW.t));
  if (wDays >= 4) out.push({ ic: 'scale', text: 'Registrar peso', sub: `Último registro há ${wDays} dias`, to: '/registrar' });
  const examTask = exameNoProtocolo(S);
  if (examTask) out.push({ ic: 'doc', text: examTask, sub: 'Do protocolo desta semana', to: '/protocolos' });
  if (hasClinic(S)) {
    const cd = diffDays(new Date(S.consult.t), now());
    if (cd >= 0 && cd <= 2) out.push({ ic: 'cal', text: cd === 0 ? 'Consulta hoje' : cd === 1 ? 'Consulta amanhã' : 'Consulta em 2 dias', sub: S.consult.type, to: '/consultas', warn: cd <= 1 });
  }
  /* Metade da meta às três da tarde é o mesmo critério de antes — quatro
     copos de oito —, agora escrito contra a meta que a pessoa tem.

     E o destino é a folha de registro. A linha diz "Registrar água" e
     levava para o menu de registros, onde ainda era preciso achar a
     água: um toque a mais para fazer o que o texto já tinha prometido. */
  const mlHoje = waterMlToday(S);
  const alvoAgua = (S.profile as any).targets.waterMl as number;
  if (now().getHours() >= 15 && mlHoje < alvoAgua / 2) out.push({ ic: 'water', text: 'Registrar água', sub: `${litros(mlHoje)} de ${litros(alvoAgua)} L até agora`, to: '/medir-agua' });
  const ciT = checkinToday(S);
  /* A meta vem do perfil. Estava 90 fixo aqui enquanto o resto do app lia
     targets.prot — quem mudasse a meta passaria a ver duas contas. */
  const alvoProt = (S.profile as any).targets.prot as number;
  if (ciT && ciT.prot < alvoProt) out.push({ ic: 'leaf', text: `Faltam ${Math.round(alvoProt - ciT.prot)} g de proteína`, sub: `Da meta diária de ${alvoProt} g`, to: '/alimentacao' });
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
  /* "BEBEU BEM" É COMPARADO COM OS PRÓPRIOS DIAS DELA, e não com a meta.

     O corte era um copo abaixo da meta, e a meta não tem nada a ver com a
     comparação que este achado faz. Quem nunca chega perto dela não tem
     nenhum dia "bem hidratado" — e o achado, que é sobre a VARIAÇÃO da
     pessoa, deixaria de existir justamente para quem mais precisava dele.

     A mediana dos dias registrados divide em dois grupos que sempre têm
     gente: os dias em que ela bebeu mais do que o próprio normal, e os em
     que bebeu menos. E só entram os dias que têm as DUAS colunas: cruzar
     água com enjoo num dia sem enjoo registrado é comparar com nada. */
  const comAgua = cs.filter((c) => typeof c.agua === 'number' && typeof c.nausea === 'number');
  const escala = comAgua.map((c) => c.agua as number).sort((a, b) => a - b);
  const corteAgua = escala.length ? escala[Math.floor(escala.length / 2)] : 0;
  const hidratados = comAgua.filter((c) => c.agua >= corteAgua);
  const secos = comAgua.filter((c) => c.agua < corteAgua);
  if (hidratados.length >= 3 && secos.length >= 3) {
    const eSim = med(hidratados.map((c) => c.nausea)), eNao = med(secos.map((c) => c.nausea));
    if (eNao - eSim >= 0.5) out.push({
      key: 'sintomas', cat: 'Sintomas', ic: 'water', cor: 'water', surpresa: 3,
      titulo: 'Nos dias em que você bebe bem, o enjoo é menor',
      texto: `Com ${litros(corteAgua * CUP_ML)} L ou mais, seu enjoo médio foi ${n1(eSim)}. Abaixo disso, ${n1(eNao)}. Não prova causa — mas é a variável mais fácil de mexer que aparece ligada ao sintoma.`,
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
  'Água': (c, S) => Math.min(100, ((c.agua || 0) / metaDeCopos(S)) * 100),
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
   OS SINTOMAS, LIDOS DEPOIS

   Um dia de check-in responde "como foi hoje". Três perguntas só a SÉRIE
   responde, e são as três que a pessoa leva para a consulta:

     · o que apareceu na semana, e em quantos dias
     · se isso acompanha o ciclo da dose
     · e o que dá para afirmar a partir disso

   A do meio é a que a tela de sintomas afirmava sem calcular. Havia um
   parágrafo fixo dizendo que a náusea se concentra nos dois primeiros
   dias depois da aplicação e que a fome faz o contrário. É o padrão
   típico — mas escrito com "seus registros" virava um achado sobre ESTA
   pessoa que ninguém tinha olhado. O app tem a data de cada aplicação e o
   grau de cada dia: dá para responder de verdade, e às vezes a resposta
   é "ainda não dá para dizer".
   ============================================================ */

/** Um sintoma na janela lida. `dias` são os dias em que ele apareceu. */
export type SintomaLido = {
  id: string; label: string;
  dias: number; pior: number; media: number;
  /** a frase da régua no pior grau — "enjoo constante", "dois dias sem ir" */
  legenda: string;
};

const janela = (S: State, n: number) => {
  const desde = +startOfDay(daysAgo(n - 1));
  return (S.checkins as any[]).filter((c) => c.t >= desde);
};

/* O DIA PASSOU PELA PERGUNTA DE SINTOMAS — mesmo que a resposta tenha
   sido "não tive nada".

   Não dá para usar `respostaNoDia` aqui: ela aceita o dia em que a pessoa
   respondeu só o sono, e nesse dia a náusea não é zero — é ausência. O
   check-in grava zero nas colunas e 'normal' no intestino quando nada é
   marcado, então a presença desses campos é a prova de que a pergunta foi
   feita e respondida. */
const respondeuSintomas = (c: any) => typeof c?.nausea === 'number' || c?.gut != null || !!c?.sint;

/** Dias da janela em que os sintomas foram respondidos — o denominador
    honesto. Sem ele, "náusea em 3 dias" esconde que só 4 foram respondidos. */
export function diasDeSintomas(S: State, n = 7) {
  return janela(S, n).filter(respondeuSintomas).length;
}

/** Os sintomas que apareceram nos últimos `n` dias, do mais presente. */
export function sintomasDaSemana(S: State, n = 7): SintomaLido[] {
  return sintomasEm(janela(S, n));
}

/* A MESMA LEITURA, sobre os dias que quem chama escolher.

   /sintomas pergunta pelos últimos sete; /semana pergunta por uma semana
   específica do tratamento, que pode ter acabado em abril. Era essa
   diferença de janela que justificava a segunda tela ter a sua própria
   conta — e com ela vieram uma régua de 0 a 10 na cara da pessoa, um
   "forte" que chamava de forte o que ela respondeu como leve, e o
   silêncio somado como zero. A janela é de quem chama; a régua, não. */
export function sintomasEm(cs: any[]): SintomaLido[] {
  const fora: SintomaLido[] = [];
  for (const s of SINTOMAS_LIDOS) {
    const graus = cs.map((c) => grauDoSintoma(c, s.id)).filter((v): v is number => v != null);
    if (!graus.length) continue;
    const pior = Math.max(...graus);
    fora.push({
      id: s.id, label: s.label, dias: graus.length, pior,
      media: graus.reduce((a, b) => a + b, 0) / graus.length,
      legenda: s.regua[pior - 1] ?? '',
    });
  }
  /* Mais dias primeiro, e o grau desempata: o que incomodou a semana
     inteira vem antes do que foi forte num dia só. */
  return fora.sort((a, b) => b.dias - a.dias || b.pior - a.pior);
}

/* O SINTOMA AO LONGO DO CICLO DA DOSE.

   O dia do ciclo é a distância até a última aplicação: 0 é o dia de
   aplicar. Um dia respondido SEM o sintoma entra como zero e não sai da
   conta — o vale é metade do achado, e tirá-lo faria a média subir
   justamente nos dias em que o sintoma não apareceu. */
export function sintomaNoCiclo(S: State, id = 'nausea') {
  const cad = cadenciaDias(S);
  const baldes = Array.from({ length: cad }, (_, dia) => ({ dia, dias: 0, soma: 0 }));
  const injs = (S.injections as any[]).map((i) => +startOfDay(new Date(i.t))).sort((a, b) => a - b);
  for (const c of S.checkins as any[]) {
    if (!respondeuSintomas(c)) continue;
    let ultima: number | null = null;
    for (const t of injs) { if (t <= c.t) ultima = t; else break; }
    if (ultima == null) continue;
    const d = Math.round((c.t - ultima) / DAY);
    if (d < 0 || d >= cad) continue;
    baldes[d].dias++;
    baldes[d].soma += grauDoSintoma(c, id) ?? 0;
  }
  return baldes.map((b) => ({ dia: b.dia, dias: b.dias, media: b.dias ? b.soma / b.dias : null }));
}

/* O PADRÃO, e a régua para poder afirmar que existe um.

   Três condições, e todas precisam valer: dias bastantes, quase todo o
   ciclo coberto, e um degrau inteiro de diferença entre o pior dia e o
   melhor. Sem isso a frase seria ruído de amostra pequena com cara de
   descoberta — e é uma frase que a pessoa leva para a consulta.

   Quando não dá para afirmar, devolve POR QUE não deu, porque as duas
   razões dizem coisas opostas à pessoa: "ainda são poucos dias" pede que
   ela continue respondendo, e "aparece parecido em todo o ciclo" já é uma
   resposta — a de que, nela, o sintoma não segue a dose. A régua fica
   aqui e não na tela: quem mostra não deveria poder discordar de quem
   calcula sobre quantos dias bastam. */
export type PadraoDoCiclo =
  | { pode: true; dias: number[]; alto: number; baixo: number; doInicio: boolean; doFim: boolean }
  | { pode: false; motivo: 'poucos' | 'parecido' };

export function padraoDoCiclo(S: State, id = 'nausea'): PadraoDoCiclo {
  const baldes = sintomaNoCiclo(S, id);
  const com = baldes.filter((b) => b.media != null) as { dia: number; dias: number; media: number }[];
  const total = com.reduce((a, b) => a + b.dias, 0);
  if (total < 10 || com.length < baldes.length - 1) return { pode: false, motivo: 'poucos' };
  const alto = Math.max(...com.map((b) => b.media));
  const baixo = Math.min(...com.map((b) => b.media));
  if (alto - baixo < 1) return { pode: false, motivo: 'parecido' };
  const corte = (alto + baixo) / 2;
  const dias = com.filter((b) => b.media >= corte).map((b) => b.dia).sort((a, b) => a - b);
  const seguido = dias.every((d, i) => i === 0 || d === dias[i - 1] + 1);
  return {
    pode: true, dias, alto, baixo,
    doInicio: seguido && dias[0] === 0,
    doFim: seguido && dias[dias.length - 1] === baldes.length - 1,
  };
}

/* ============================================================
   AS FAIXAS DE IMC

   Os cortes são os que a OMS usa para adultos — 18,5 / 25 / 30 / 35 / 40
   —, e são os mesmos que aparecem em qualquer relatório de consulta. Ficam
   numa tabela só porque mais de uma tela mostra IMC: três listas escritas
   à mão viram, mais cedo ou mais tarde, três classificações diferentes
   para o mesmo número.

   O QUE ELAS NÃO SABEM: o IMC não separa músculo de gordura, não sabe a
   idade de quem está na balança nem de onde veio o peso. Quem mostra a
   faixa mostra junto o que ela ignora — é o mesmo cuidado que as faixas de
   referência dos exames pedem.

   `tom` é o nome de um par de cores do tema, e não uma cor: a tela clara e
   a escura resolvem o mesmo nome em vermelhos diferentes.
   ============================================================ */
export type FaixaIMC = { de: number; ate: number; nome: string; tom: string };
export const FAIXAS_IMC: FaixaIMC[] = [
  { de: 15, ate: 18.5, nome: 'Abaixo do peso', tom: 'blue' },
  { de: 18.5, ate: 25, nome: 'Peso normal', tom: 'ok' },
  { de: 25, ate: 30, nome: 'Sobrepeso', tom: 'amber' },
  { de: 30, ate: 35, nome: 'Obesidade grau I', tom: 'cta2' },
  { de: 35, ate: 40, nome: 'Obesidade grau II', tom: 'cta' },
  { de: 40, ate: 45, nome: 'Obesidade grau III', tom: 'cta' },
];
export const faixaDoIMC = (v: number) =>
  FAIXAS_IMC.find((x) => v < x.ate) ?? FAIXAS_IMC[FAIXAS_IMC.length - 1];

/* ============================================================
   O PLANO DE PARTIDA — o que o app deriva do cadastro

   As metas diárias do app — proteína, água, movimento, gordura corporal
   — vinham fixas da semente: 90 g, 2,5 L, 60 min, 28%. Eram os números
   de UMA pessoa, lidos dez vezes cada um por telas que falam com outra.

   Aqui elas saem do que a pessoa acabou de contar. Não é conta de
   nutricionista e não substitui uma: é ponto de partida, e o perfil muda
   todas.

   ⚠️ PROCEDÊNCIA — os dois coeficientes são de uso corrente e NÃO foram
   conferidos contra diretriz brasileira vigente. Proteína a 1,2 g por
   quilo é o piso da faixa que se cita para preservação de massa magra em
   perda de peso (a faixa vai a 1,6, e o piso é escolha deliberada: errar
   para baixo num número que a pessoa vai perseguir todo dia é mais
   seguro do que errar para cima). Água a 35 ml por quilo é a regra de
   bolso mais comum. Antes disto chegar a alguém de verdade, as duas
   linhas precisam ser verificadas e esta marca, removida.

   E NÃO TEM CALORIA, de propósito. O app decidiu não contar caloria —
   /alimentacao tem uma seção inteira chamada "Por que proteína, e não
   caloria", e o argumento é que num tratamento de GLP-1 a fome cai
   sozinha e o risco deixa de ser comer demais. Uma meta diária de
   quilocaloria aqui contradiria isso na cara, e seria pior: o app não
   soma caloria de refeição nenhuma, então seria uma meta que nada no app
   consegue medir. Meta que ninguém lê é pior do que meta nenhuma.
   ============================================================ */
export type PlanoInicial = {
  imc: number;
  /** o IMC que a meta de peso representa, na mesma altura */
  imcMeta: number;
  /** quilocalorias por dia, já com o piso de segurança aplicado */
  kcal: number;
  /** o gasto estimado do dia, antes do déficit */
  gasto: number;
  /** o ritmo escolhido pedia menos caloria do que o piso — a meta parou nele */
  noPiso: boolean;
  /** gramas por dia */
  prot: number;
  carb: number;
  gord: number;
  fibra: number;
  /** mililitros por dia */
  agua: number;
  /** semanas até a meta, no ritmo escolhido; null quando não há o que perder */
  semanas: number | null;
  chegada: number | null;
};

/* OS QUATRO DEGRAUS DE ATIVIDADE, com o que cada um quer dizer em dias
   por semana — sem isso "levemente ativo" é autoavaliação, e cada pessoa
   se põe num degrau diferente.

   Mora aqui, e não na tela que pergunta, porque quem lê o índice é a
   conta de energia logo abaixo: a lista e o multiplicador são a mesma
   informação em duas formas, e separá-los é como um ganha um degrau que o
   outro não tem. */
export const ATIVIDADES: { id: string; titulo: string; sub: string }[] = [
  { id: 'sedentario', titulo: 'Sedentário', sub: 'pouco ou nenhum exercício' },
  { id: 'leve', titulo: 'Levemente ativo', sub: '1 a 3 dias por semana' },
  { id: 'moderado', titulo: 'Moderadamente ativo', sub: '3 a 5 dias por semana' },
  { id: 'muito', titulo: 'Muito ativo', sub: '6 a 7 dias por semana' },
];

/* Os multiplicadores clássicos de nível de atividade sobre o gasto de
   repouso, na ordem de ATIVIDADES. */
const FATOR_ATIVIDADE = [1.2, 1.375, 1.55, 1.725];
/* Um quilo de gordura corporal ≈ 7.700 kcal. É a conta que transforma o
   ritmo que a pessoa escolheu (kg por semana) em déficit por dia. */
const KCAL_POR_QUILO = 7700;

export function planoDoCadastro(d: {
  altura: number; peso: number; meta: number; ritmo: number | null;
  /** 0 sedentário, 1 leve, 2 moderado, 3 muito ativo */
  atividade?: number;
  idade?: number;
  /** o que o cadastro sabe sobre o corpo — ver o bloco sobre a equação */
  sexo?: 'f' | 'm' | null;
}): PlanoInicial {
  const perder = d.peso - d.meta;
  const semanas = d.ritmo && perder > 0 ? Math.ceil(perder / d.ritmo) : null;
  const idade = d.idade ?? 40;

  /* ============================================================
     A ENERGIA DO DIA

     O APP PASSOU A CONTAR CALORIA, e isso é uma reversão de rumo que
     merece estar escrita aqui: /alimentacao tem uma seção chamada "Por
     que proteína, e não caloria", e o argumento dela continua de pé para
     o dia a dia — num tratamento de GLP-1 a fome cai sozinha, e contar
     caloria de cada refeição é trabalho que a maioria abandona na
     segunda semana. O que mudou é o ESCOPO: aqui a caloria não é um
     contador, é um ALVO — e é dele que saem carboidrato e gordura, que
     não existem de outra forma. Os dois são fatia de uma meta de
     energia; sem ela, gramas de carboidrato são chute com cara de conta.

     ⚠️ E É ALVO SEM LEITOR, por enquanto: nenhuma tela soma a caloria do
     que a pessoa come. Enquanto /alimentacao não ler `targets.kcal`, este
     número vive só na tela de plano — e meta que ninguém lê é dívida, não
     recurso.

     MIFFLIN-ST JEOR, porque é a que a Academy of Nutrition and Dietetics
     designou como padrão baseado em evidência para gasto de repouso, e a
     que mais vezes cai dentro de 10% do medido por calorimetria.

     O TERMO DE SEXO É O PONTO FRACO, e está dito em vez de escondido: a
     equação pede sexo biológico (+5 para homens, −161 para mulheres), e o
     cadastro pergunta como a pessoa se IDENTIFICA. Para quem respondeu
     "outro" ou "prefiro não informar", o termo usado é a média dos dois
     (−78), que erra menos do que escolher um. Para quem respondeu
     feminino ou masculino, a identidade é usada como aproximação do
     corpo — o que é aproximação mesmo, e não verdade.
     ============================================================ */
  const tmb = 10 * d.peso + 6.25 * (d.altura * 100) - 5 * idade
    + (d.sexo === 'm' ? 5 : d.sexo === 'f' ? -161 : -78);
  const gasto = tmb * FATOR_ATIVIDADE[d.atividade ?? 0];
  const deficit = d.ritmo && perder > 0 ? (d.ritmo * KCAL_POR_QUILO) / 7 : 0;

  /* O PISO EXISTE PORQUE O RITMO NÃO TEM TETO NA TELA DE ESCOLHA.

     O app deixa escolher até 2 kg por semana, e 2 kg por semana são 2.200
     kcal de déficit por dia — mais do que o gasto inteiro de muita gente.
     Sem piso, a tela de plano escreveria "coma 300 kcal por dia" com toda
     a calma do mundo, e isso é dano.

     1.200 para mulheres e 1.500 para homens é a linha que o NHS marca
     como o mínimo sem acompanhamento médico. Na dúvida sobre o corpo, o
     piso mais alto: errar para mais comida é o erro que não machuca. */
  const piso = d.sexo === 'f' ? 1200 : 1500;
  const bruto = gasto - deficit;
  const kcal = Math.max(piso, Math.round(bruto / 10) * 10);

  /* Arredondados para cinco: o app vai escrever estes números como meta, e
     "96,4 g" afirma uma precisão que a conta não tem — ela nasce de uma
     regra de bolso sobre um peso digitado. */
  const prot = Math.round((d.peso * 1.2) / 5) * 5;
  /* 28% da energia em gordura — o meio da faixa de 25 a 30% que as
     diretrizes repetem. Nove quilocalorias por grama. */
  const gord = Math.round((kcal * 0.28) / 9 / 5) * 5;
  /* O carboidrato é o que sobra. É a ordem certa: a proteína protege
     massa magra e tem alvo próprio, a gordura tem faixa, e o resto da
     energia vira carboidrato — e não o contrário. */
  const carb = Math.max(0, Math.round((kcal - prot * 4 - gord * 9) / 4 / 5) * 5);
  /* 14 g de fibra por 1.000 kcal é a ingestão adequada do Institute of
     Medicine, repetida na posição da Academy of Nutrition and Dietetics.
     Ela é proporcional à energia, e não ao peso. */
  const fibra = Math.round(((kcal / 1000) * 14) / 5) * 5;

  return {
    imc: d.peso / (d.altura ** 2),
    imcMeta: d.meta / (d.altura ** 2),
    kcal,
    gasto: Math.round(gasto / 10) * 10,
    noPiso: bruto < piso,
    prot,
    carb,
    gord,
    fibra,
    /* A ÁGUA SOBE COM O QUANTO A PESSOA SE MEXE, E CAI COM A IDADE.

       35 ml por quilo é a referência para adultos até uns 55 anos; de 56
       a 65 a faixa citada cai para 30, e daí em diante para 25 — a
       necessidade por quilo diminui e a sede fica menos confiável, o que
       faz uma meta alta demais virar cobrança sem função. Quem treina
       perde mais líquido, e o acréscimo por nível de atividade é modesto
       de propósito: é ponto de partida.

       São as duas perguntas — nascimento e atividade física — virando
       conta. É esse o critério para uma pergunta existir no cadastro. */
    agua: Math.round(
      (d.peso * (idade <= 55 ? 35 : idade <= 65 ? 30 : 25)
        + [0, 100, 250, 400][d.atividade ?? 0]) / 100,
    ) * 100,
    /* A META DE GORDURA CORPORAL CONTINUA FORA DAQUI.

       Ela dependia do sexo biológico — 28% é a ponta saudável para
       mulheres, 20% para homens — e o cadastro pergunta identidade. A
       equação de energia usa identidade como aproximação porque o erro
       ali é de algumas dezenas de quilocalorias num alvo que já é
       estimativa; um alvo de composição corporal é outra ordem de
       afirmação, e continua vindo do padrão do app até haver de onde
       tirar. */
    semanas,
    chegada: semanas ? +addDays(startOfDay(now()), semanas * 7) : null,
  };
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

  const dia = Math.max(0, cadenciaDias(S) - diffDays(nextInjectionDate(S), now()));

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
      to: '/aplicacoes',
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
  const exame = exameNoProtocolo(S);
  if (exame) out.push({
    emDias: 5, ic: 'doc', texto: exame,
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

/* COMO O APP ESCREVE UM VOLUME: em litros, e sem zero à toa no fim —
   "2,5", "1,75", "0,25", "1". Duas telas falam de água, e enquanto cada
   uma tinha o próprio formatador elas escreviam o mesmo copo de jeitos
   diferentes a dois toques de distância.

   Sem arredondar para uma casa: 1,75 L arredondado vira 1,8 L, e um
   número que a pessoa não registrou aparecendo no lugar do que ela
   registrou é caro demais para o pouco que economiza de largura.

   A unidade não vem junto de propósito — quem escreve o "L" é a frase,
   que às vezes quer "de 2,5 L hoje" e às vezes só o número. */
export const litros = (ml: number) => (ml / 1000).toFixed(2).replace(/\.?0+$/, '').replace('.', ',');

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
      litros(ml), 'L', `${litros(t.waterMl)} L`,
      /* Sempre em litros, inclusive abaixo de um. A frase trocava de
         unidade no meio do caminho — "Faltam 1,5 L" virava "Faltam 400 ml"
         quando a pessoa chegava perto —, e quem está acompanhando o
         próprio número via a escala mudar debaixo do pé. */
      faltaMl <= 0 ? 'Meta batida' : `Faltam ${litros(faltaMl)} L`,
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
    /* SÓ OS DIAS EM QUE HOUVE CHECK-IN DE VERDADE.

       Todo registro de dia entrava aqui como um check-in, e os antigos
       guardam só acumuladores — proteína e exercício. Deles esta linha
       lia sono e humor assim mesmo: quarenta e dois dias de "NaN L ·
       NaNh de sono", cada um marcado como dia Difícil, porque um humor
       AUSENTE também não é >= 3. A linha do tempo contava uma temporada
       ruim que nunca existiu.

       O evento de exercício continua fora desta condição: ele depende de
       exerc, que é acumulador, e um dia de treino sem check-in é um dia
       de treino. */
    if (respondido(cc, 'mood')) {
      /* E o resumo traz só o que foi respondido. Água e proteína são
         acumuladores e sempre valem o que dizem; sono é estado, e um dia
         sem resposta sai da frase em vez de virar zero. */
      const partes = [`${litros((cc.agua || 0) * CUP_ML)} L`, `${Math.round(cc.prot || 0)} g proteína`];
      if (respondido(cc, 'sono')) partes.push(`${Math.floor(cc.sono)}h de sono`);
      out.push({
        key: `ci-${day}`, kind: 'checkin', day, time: '08:30',
        ic: 'check', color: 'accent', title: 'Check-in',
        sub: partes.join(' · '),
        value: cc.mood >= 4 ? 'Bem' : cc.mood >= 3 ? 'Neutro' : 'Difícil',
        valueColor: cc.mood >= 4 ? 'good' : 'tx3',
      });
    }
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

/* AS METAS, prontas para a tela — a medida com a conta que o indicador
   dela devolve, a pessoal com o estado e a data. */
export type JourneyGoal = {
  id: string; ic: string; label: string;
  pct: number;
  hint: string;
  /** sem indicador: quem marca é a pessoa */
  pessoal: boolean;
  feita: boolean;
  /** o que o indicador conta, em uma frase; vazio nas pessoais */
  conta: string;
};

export function journeyGoals(S: State): JourneyGoal[] {
  /* Catorze dias, e só os RESPONDIDOS entram na conta: quatorze dias com
     três noites registradas não são "21% das noites" — são três noites, e
     duas delas boas é 67%. Diluir pelo que não foi perguntado
     transformaria silêncio em fracasso. */
  const recentes = S.checkins.slice(-14) as any[];

  /* CADA META PERGUNTA AO PRÓPRIO INDICADOR.

     Aqui havia um `if` para sono e outro para energia, os dois com a
     conta escrita à mão. Acrescentar "menos enjoo" exigia um terceiro,
     e a tela de nova meta não teria como oferecer nada que o arquivo
     não soubesse de cor. Agora a lista de indicadores é o que manda, e
     esta função não conhece nenhum deles pelo nome.

     A de energia era MÉDIA × 10: energia 6,2 virava barra em 62%, como
     se 62% fosse o caminho andado até um dez que ninguém pediu. Ela é
     um indicador como os outros — dias que passaram de sete. */
  return (S.goals as any[]).map((g) => {
    const ind = indicadorDe(g.indicador || KIND_ANTIGO[g.kind]);

    if (!ind) {
      /* Pessoal: cheia ou vazia, e a data no lugar da fração. */
      /* O PRAZO É FATO, NÃO COBRANÇA. Passado e não conquistada, a linha
         diz que ele passou e para aí — sem vermelho e sem "atrasada". Num
         tratamento de meses, uma data que escorregou é a coisa mais
         comum do mundo, e a meta continua de pé. */
      const venceu = !g.feita && g.prazo && g.prazo < +startOfDay(now());
      return {
        id: g.id, ic: g.ic, label: g.label,
        pct: g.feita ? 100 : 0,
        hint: g.feita && g.em
          ? `conquistada em ${fmtDate(new Date(g.em))}`
          : g.prazo
            ? `${venceu ? 'o prazo era' : 'até'} ${fmtDate(new Date(g.prazo))}`
            : 'você marca quando chegar',
        pessoal: true,
        feita: !!g.feita,
        conta: '',
      };
    }

    const alvo = typeof g.alvo === 'number' ? g.alvo : padraoDe(ind, S);
    const vals = recentes.map((c) => ind.leitura(c)).filter((v): v is number => v != null);
    const n = vals.filter((v) => (ind.sentido === 'min' ? v >= alvo : v <= alvo)).length;
    const de = vals.length;
    /* A CONTA, e não a porcentagem de novo. A linha dizia "85%" à
       direita e "85% das noites recentes" embaixo — o mesmo número duas
       vezes. "11 de 13 noites" responde de quantas noites falamos. */
    return {
      id: g.id, ic: ind.ic, label: g.label || ind.rotulo(alvo),
      pct: de ? Math.round((n / de) * 100) : 0,
      hint: de
        ? `${n} de ${de} ${de === 1 ? ind.nomes[0] : ind.nomes[1]} ${ind.nomes[0] === 'noite' ? 'registradas' : 'registrados'}`
        : `sem ${ind.nomes[1]} registradas ainda`,
      pessoal: false,
      feita: false,
      conta: ind.conta(alvo),
    };
  });
}

/* Captura rápida — os três atalhos do sheet de registrar.

   O critério é FREQUÊNCIA, não importância. Aplicação é o registro mais
   importante do tratamento e mesmo assim não merece lugar fixo: acontece
   uma vez a cada sete dias, então em seis deles ocuparia um dos três
   espaços de maior destaque sem ser usada.

   Os três lugares vão para o que a pessoa faz todo dia — e mudam quando o
   dia pede outra coisa. */
export type QuickKey = 'agua' | 'refeicao' | 'checkin' | 'exercicio' | 'aplicacao' | 'exame' | 'anotacoes';

/* Os três atalhos do sheet de registrar. Fixos, sempre os mesmos.

   Eles giravam com o momento do tratamento: no dia da aplicação o terceiro
   virava "Meu corpo reagiu", depois de uma consulta virava "Recebi um
   exame". A intenção era boa e o efeito era ruim — o sheet é superfície de
   memória muscular, e um botão que troca de identidade conforme o dia
   obriga a LER os três toda vez, que é o oposto de atalho.

   E a escolha do dia de aplicação era a mais questionável das três:
   sintoma já é o assunto do check-in, que fica no banner logo acima, com
   nove sintomas e intensidade. Exercício não está em lugar nenhum além
   daqui — tirá-lo do atalho no dia em que a pessoa mais precisa se mexer
   era trocar o único caminho pelo caminho duplicado.

   A rotação continua existindo no app, mas onde ela cabe: nos empurrões da
   Home e do companion, que são leitura, não botão. */
export const ATALHOS: QuickKey[] = ['agua', 'refeicao', 'exercicio'];

/* Quais integrações trazem MOVIMENTO. Balança e Withings ficam de fora:
   elas pesam, não contam passo.

   A ordem é a de quem costuma ser a fonte principal — o telefone antes do
   relógio, porque o relógio manda para ele. */
const FONTES_MOVIMENTO: [string, string][] = [
  ['appleHealth', 'Apple Saúde'],
  ['healthConnect', 'Health Connect'],
  ['googleFit', 'Google Fit'],
  ['garmin', 'Garmin'],
  ['fitbit', 'Fitbit'],
  ['watch', 'seu smartwatch'],
];

/* TODAS as fontes ligadas, e não a primeira que aparece.

   Ninguém tem só uma. Quem usa Garmin costuma ter o Apple Saúde ligado
   junto, e quem tem relógio tem o app do relógio — e a tela que dizia
   "Apple Saúde conectado" estava escondendo as outras duas de quem
   justamente queria saber de onde os minutos vinham. */
export function fontesDeMovimento(S: State): string[] {
  const i: any = (S as any).integrations || {};
  return FONTES_MOVIMENTO.filter(([k]) => i[k]).map(([, nome]) => nome);
}

/** Lista em português: "a", "a e b", "a, b e c", "a, b e mais 2". */
export function listaPt(itens: string[], mostrar = 3): string {
  if (!itens.length) return '';
  if (itens.length === 1) return itens[0];
  if (itens.length <= mostrar) {
    return itens.slice(0, -1).join(', ') + ' e ' + itens[itens.length - 1];
  }
  return itens.slice(0, mostrar).join(', ') + ` e mais ${itens.length - mostrar}`;
}

/* ============================================================
   O MOVIMENTO DOS ÚLTIMOS DIAS

   Duas coisas moram no registro do dia e não são a mesma:

     exerc    minutos — o total, venha de onde vier
     treinos  as sessões: [{ tipo, min }]

   Elas divergem de propósito. Quem tem Apple Saúde ou Health Connect
   ligado recebe minutos que ninguém digitou, e esses minutos não têm
   modalidade: o telefone conta passo, não sabe que era caminhada. Então
   a soma dos treinos é quase sempre MENOR que os minutos, e a tela que
   mostra as duas precisa dizer isso — senão ela se contradiz sozinha.
   ============================================================ */

/* `i` é a posição da sessão dentro do dia dela. A lista da tela é
   achatada e reordenada, então sem esse índice não dá para apagar uma
   sessão específica — só adivinhar qual era. */
export type Treino = { t: number; i: number; tipo: string; min: number; ic: string; fonte: string };

/* DE ONDE VEIO A SESSÃO.

   Um treino de 50 minutos que a pessoa digitou e um que o relógio mandou
   não valem a mesma coisa na hora de conferir: o primeiro ela lembra de
   ter escrito, o segundo pode ser uma caminhada até o mercado que o
   relógio resolveu chamar de exercício. Sem a origem escrita, corrigir
   vira adivinhação.

   Ausência quer dizer manual, porque manual é o que existia antes de
   haver origem — e todo registro antigo é manual de fato. Mas a tela
   nunca mostra a ausência: ela mostra "Você", porque ausência não
   responde "quem registrou isto", responde "não sei". */
export const ORIGEM_MANUAL = 'Você';
export const origemDoTreino = (tr: { fonte?: string } | null | undefined): string =>
  (tr && tr.fonte) || ORIGEM_MANUAL;
export const ehManual = (fonte: string) => fonte === ORIGEM_MANUAL;

/** As sessões registradas à mão, da mais nova para a mais velha. */
export function treinosRecentes(S: State, dias = 30): Treino[] {
  const corte = +startOfDay(now()) - (dias - 1) * DAY;
  const out: Treino[] = [];
  for (const c of S.checkins as any[]) {
    if (c.t < corte) continue;
    ((c.treinos || []) as { tipo: string; min: number; fonte?: string }[]).forEach((tr, i) => {
      out.push({ t: c.t, i, tipo: tr.tipo, min: tr.min, ic: iconeDe(tr.tipo), fonte: origemDoTreino(tr) });
    });
  }
  return out.sort((a, b) => b.t - a.t);
}

/** Os sete últimos dias em minutos, do mais antigo para hoje. */
export function semanaDeMovimento(S: State): { t: number; min: number }[] {
  const hoje = +startOfDay(now());
  const porDia = new Map<number, number>(
    (S.checkins as any[]).map((c) => [c.t, c.exerc || 0]),
  );
  return Array.from({ length: 7 }, (_, i) => {
    const t = hoje - (6 - i) * DAY;
    return { t, min: Math.round(porDia.get(t) || 0) };
  });
}

/* MINUTOS POR SEMANA, NAS ÚLTIMAS N SEMANAS.

   O gráfico de barras em cima responde "como foi esta semana". Este
   responde outra coisa, que nenhuma parte da tela respondia: estou me
   mexendo mais ou menos do que estava há dois meses. Num tratamento que
   dura meses, essa é a pergunta que a semana isolada nunca alcança.

   Em SEMANAS e não em dias porque o dia é picotado — 0, 30, 0, 0, 45 —,
   e uma curva suave passada por cima disso desenha um movimento que não
   aconteceu. A semana soma o descanso junto com o treino, que é como o
   corpo conta.

   As semanas terminam hoje e correm para trás: a última é a que está
   acontecendo, e por isso costuma ser mais baixa que as outras. */
export function semanasDeMovimento(S: State, n = 8): { t: number; min: number }[] {
  const hoje = +startOfDay(now());
  const balde = new Array(n).fill(0);
  for (const c of S.checkins as any[]) {
    const atras = Math.floor((hoje - c.t) / DAY);
    if (atras < 0 || atras >= n * 7) continue;
    balde[n - 1 - Math.floor(atras / 7)] += c.exerc || 0;
  }
  return balde.map((min, i) => ({ t: hoje - (n - 1 - i) * 7 * DAY, min: Math.round(min) }));
}

/* Em quantos dos últimos 7 dias houve treino de força.

   A proporção de força já teve um cartão inteiro nesta tela — barra,
   legenda, minutos por modalidade — e não fazia nada. Era resumo: olhava
   bonito, não mudava nenhuma decisão, e ocupava a altura de um cartão
   para dizer o que cabe numa linha.

   A linha ficou, porque o FATO importa: em déficit calórico quem só faz
   cardio perde massa magra junto com a gordura, e massa magra é o que o
   tratamento inteiro tenta segurar. O que saiu foi a moldura. */
export function diasDeForca(S: State): number {
  const corte = +startOfDay(now()) - 6 * DAY;
  const dias = new Set<number>();
  for (const c of S.checkins as any[]) {
    if (c.t < corte) continue;
    if (((c.treinos || []) as any[]).some((tr) => ehForca(tr.tipo))) dias.add(c.t);
  }
  return dias.size;
}

/* OS DIAS DO PERÍODO, do mais antigo para hoje.

   Serve à tira de calendário do caderno: cada dia sabe se teve treino
   registrado e quantos minutos. É diferente do gráfico de barras lá em
   cima, que mostra SETE dias e responde "quanto" — aqui a pergunta é o
   ritmo ao longo do período: três dias seguidos, um de folga, dois.

   `treinos` e não `exerc`: a tira navega o caderno, e o caderno só tem
   o que foi registrado à mão. Marcar um dia que só o relógio preencheu
   levaria a pessoa a um dia vazio. */
/** Um dia na tira de calendário: quantos registros ele tem, e se é hoje.

    `itens` e não `treinos` porque a mesma tira serve o caderno de treino
    e o de alimentação — nomear pelo conteúdo de um dos dois obrigava o
    outro a ler `d.treinos` para contar refeições. */
export type DiaDaTira = { t: number; itens: number; hoje: boolean };

export function diasDoPeriodo(S: State, dias: number): DiaDaTira[] {
  const hoje = +startOfDay(now());
  const porT = new Map((S.checkins as any[]).map((c) => [c.t, c]));
  /* `hoje` sai daqui e não da tela porque quem sabe que dia é hoje é esta
     camada — a tela que recalculasse isso teria a sua própria meia-noite,
     e as duas divergiriam justamente na virada. */
  return Array.from({ length: dias }, (_, i) => {
    const t = hoje - (dias - 1 - i) * DAY;
    const lista = (porT.get(t)?.treinos || []) as { min: number }[];
    return {
      t,
      itens: lista.length,
      hoje: t === hoje,
    };
  });
}

/* O RESUMO DE UM PERÍODO — só do que foi registrado aqui.

   Os minutos vêm dos TREINOS, e não de `exerc`: os números ficam em
   cima da lista de treinos, e somar o que o relógio trouxe faria o
   resumo dizer 12 h sobre uma lista que mostra 6 h. Duas contas na mesma
   tela é a divergência que este app passou meses tirando de si mesmo. */
export type Resumo = { treinos: number; min: number; maisLongo: number; forca: number };

export function resumoDeMovimento(S: State, dias: number): Resumo {
  const lista = treinosRecentes(S, dias);
  return {
    treinos: lista.length,
    min: lista.reduce((x, t) => x + t.min, 0),
    maisLongo: lista.reduce((x, t) => Math.max(x, t.min), 0),
    forca: lista.filter((t) => ehForca(t.tipo)).reduce((x, t) => x + t.min, 0),
  };
}

/** Uma sessão pelo dia e pela posição dentro dele. */
export function treinoEm(S: State, t: number, i: number): { tipo: string; min: number; fonte?: string } | null {
  const c = (S.checkins as any[]).find((x) => x.t === t);
  return c?.treinos?.[i] ?? null;
}

/* Corrigir uma sessão acerta o total do dia pela DIFERENÇA, e não pela
   soma dos treinos: o dia pode carregar minutos que vieram do relógio, e
   recalcular do zero apagaria justamente esses. */
export function editarTreino(s: any, t: number, i: number, tipo: string, min: number) {
  const c = (s.checkins as any[]).find((x) => x.t === t);
  const tr = c?.treinos?.[i];
  if (!tr) return;
  c.exerc = Math.max(0, (c.exerc || 0) - tr.min + min);
  /* Espalha o original: corrigir a modalidade não pode apagar de onde a
     sessão veio. Trocar o objeto inteiro por { tipo, min } fazia um treino
     do relógio virar um treino manual no instante em que alguém acertava
     a duração dele. */
  c.treinos = (c.treinos as any[]).map((x: any, j: number) => (j === i ? { ...x, tipo, min } : x));
}

/* Apagar uma sessão devolve os minutos dela ao dia. O total NÃO volta a
   zero: ele pode carregar minutos que vieram do relógio e que ninguém
   digitou, e esses não são desta sessão. */
export function apagarTreino(s: any, t: number, i: number) {
  const c = (s.checkins as any[]).find((x) => x.t === t);
  const tr = c?.treinos?.[i];
  if (!tr) return;
  c.treinos = (c.treinos as any[]).filter((_: any, j: number) => j !== i);
  c.exerc = Math.max(0, (c.exerc || 0) - tr.min);
}

/* Apagar uma refeição devolve a proteína dela ao dia. Mesma regra do
   treino: o total do dia não volta a zero, porque ele soma o que as
   OUTRAS refeições trouxeram.

   Refeição antiga, gravada antes de `g` existir, vale o que a faixa dela
   valia — senão apagar um registro de "proteína alta" tiraria zero do dia
   e o número ficaria alto para sempre, sem nada explicando. */
/* ============================================================
   A PROTEÍNA AO LONGO DO TEMPO

   A tela de alimentação só sabia dizer HOJE. Num tratamento de meses a
   pergunta que importa não é "quanto comi hoje", é "estou conseguindo
   manter" — e são as mesmas duas resoluções que o exercício já tem: a
   semana dia a dia, e a tendência de oito semanas.
   ============================================================ */

/** Os sete últimos dias em gramas, do mais antigo para hoje. */
export function semanaDeProteina(S: State): { t: number; g: number }[] {
  const hoje = +startOfDay(now());
  const porDia = new Map<number, number>(
    (S.checkins as any[]).map((c) => [c.t, Math.round(c.prot || 0)]),
  );
  return Array.from({ length: 7 }, (_, i) => {
    const t = hoje - (6 - i) * DAY;
    return { t, g: porDia.get(t) || 0 };
  });
}

/** O dia a que uma refeição pertence — ela guarda a hora, o caderno lê o dia. */
export const diaDaRefeicao = (m: any) => +startOfDay(new Date(m.t));

/** Os dias do período, marcando os que têm refeição registrada. */
export function diasDeRefeicao(S: State, dias: number): DiaDaTira[] {
  const hoje = +startOfDay(now());
  const porT = new Map<number, { n: number; g: number }>();
  for (const m of S.meals as any[]) {
    const t = diaDaRefeicao(m);
    const a = porT.get(t) || { n: 0, g: 0 };
    a.n += 1;
    a.g += m.g ?? 0;
    porT.set(t, a);
  }
  return Array.from({ length: dias }, (_, i) => {
    const t = hoje - (dias - 1 - i) * DAY;
    const a = porT.get(t);
    return { t, itens: a?.n || 0, hoje: t === hoje };
  });
}

/* AS REFEIÇÕES DE UM DIA, na ordem em que o dia acontece: café, almoço,
   lanche, jantar.

   Pela hora do registro elas saíam trocadas com frequência — quem só
   lembra de anotar à noite registra o café por último, e o caderno
   mostrava o dia de trás para a frente. A ordem que se lê é a do prato,
   não a do toque, e ela já está escrita em MOMENTOS; a hora fica como
   desempate para duas refeições do mesmo momento. */
export function refeicoesDoDia(S: State, t: number): any[] {
  const ordem = (nome: string) => {
    const i = MOMENTOS.findIndex(([, n]) => n === nome);
    return i < 0 ? MOMENTOS.length : i;
  };
  return (S.meals as any[])
    .filter((m) => diaDaRefeicao(m) === t)
    .slice()
    .sort((a, b) => ordem(a.name) - ordem(b.name) || a.t - b.t);
}

/** Uma refeição pelo instante em que foi registrada — que é o id dela. */
export function refeicaoEm(S: State, t: number): any | null {
  return (S.meals as any[]).find((m) => m.t === t) ?? null;
}

/* Corrigir uma refeição acerta o dia pela DIFERENÇA, e não recalculando
   do zero: o dia pode carregar proteína de outras refeições, e refazer a
   conta a partir desta apagaria justamente as outras. É a mesma regra de
   editarTreino, pelo mesmo motivo. */
export function editarRefeicao(
  s: any, t: number,
  dados: { name: string; g: number; tag: string; itens?: any[]; fonte?: string },
) {
  const m = (s.meals as any[]).find((x) => x.t === t);
  if (!m) return;
  const dia = (s.checkins as any[]).find((c) => c.t === +startOfDay(new Date(t)));
  if (dia) dia.prot = Math.max(0, (dia.prot || 0) - (m.g || 0) + dados.g);
  Object.assign(m, dados);
}

/* OS FAVORITOS — pratos que se repetem.

   Um favorito é um PRATO, não um nome: quem come marmita repete os
   mesmos itens nas mesmas quantidades, e é isso que faz o atalho valer
   a pena. Guardar só o texto obrigava a pessoa a remontar o prato item
   por item toda vez, que é exatamente o trabalho que o favorito existe
   para poupar.

   Os antigos, que eram só string, continuam a ser lidos — eles abrem o
   registro com o nome escrito na busca, como sempre fizeram. O que não
   acontece mais é CRIAR um assim. */
export type Favorito = { nome: string; itens?: any[] };

/* O nome sai dos ITENS, e não de um campo guardado ao lado deles. Dois
   lugares dizendo como o prato se chama divergem na primeira vez que
   alguém troca o arroz branco pelo integral e o nome continua falando do
   branco. */
export function favoritos(S: State): Favorito[] {
  return (((S as any).favMeals || []) as any[]).map((f) => {
    if (typeof f === 'string') return { nome: f };
    const itens = (f.itens || []) as any[];
    return { ...f, nome: itens.length ? itens.map(nomeItem).filter(Boolean).join(', ') : f.nome };
  });
}

export function apagarFavorito(s: any, nome: string) {
  s.favMeals = (((s as any).favMeals || []) as any[])
    .filter((f) => (typeof f === 'string' ? f : f.nome) !== nome);
}

export function guardarFavorito(s: any, fav: Favorito) {
  const atuais = favoritos(s as any);
  if (atuais.some((f) => f.nome === fav.nome)) return;
  s.favMeals = [...(s.favMeals || []), fav];
}

export function apagarRefeicao(s: any, t: number, gramas: number) {
  s.meals = (s.meals as any[]).filter((m) => m.t !== t);
  const dia = (s.checkins as any[]).find((c) => c.t === +startOfDay(new Date(t)));
  if (dia) dia.prot = Math.max(0, (dia.prot || 0) - gramas);
}

/* ============================================================
   A ÁGUA — e a memória que ela não tinha

   Beber era a única coisa deste app que não se podia desfazer. O registro
   somava num acumulador do dia e não guardava nada sobre quem somou: quem
   tocou "Garrafão" sem querer ficava com um litro a mais para sempre,
   vendo o número errado todo dia até ele virar ontem. Refeição se apaga,
   treino se apaga, água não se apagava.

   Agora a água guarda os goles um a um, com a mesma dupla que o exercício
   já tem — `treinos` é a lista, `exerc` é o total do dia, e apagar um
   mexe nos dois. Aqui é `aguas` e `agua`.

   POR QUE DOIS CAMPOS e não só a lista: `agua` é o que o app inteiro lê —
   a pontuação, os padrões, o resumo, a Home. E os dias antigos só têm o
   total: derivar tudo da lista faria cada um deles valer zero, que é
   perder histórico para arrumar a arquitetura. O total continua sendo o
   número; a lista conta de onde ele veio.

   E um dia sem goles é tratado pelo que ele é: um total sem detalhe. O
   caderno mostra uma linha só dizendo isso, em vez de inventar um horário
   que ninguém registrou.
   ============================================================ */

/** Um gole no caderno: quando e quanto. O instante é o id. */
export type Gole = { t: number; ml: number };

/** Registra água hoje — entra na lista e sobe o total do dia. */
export function registrarAgua(s: any, ml: number) {
  const c = registroDoDia(s, +startOfDay(now()));
  c.aguas = [...((c.aguas || []) as Gole[]), { t: +now(), ml }];
  c.agua = (c.agua || 0) + ml / CUP_ML;
}

/* Apagar devolve ao dia o que aquele gole tinha somado, e não zera: o dia
   carrega a água dos outros goles. Mesma regra de apagarTreino.

   Sem o instante, apaga o dia inteiro — que é a única saída possível para
   um registro antigo, de quando não havia goles para apagar um a um. */
export function apagarGole(s: any, dia: number, t?: number | null) {
  const c = (s.checkins as any[]).find((x) => x.t === dia);
  if (!c) return;
  if (t == null) { c.agua = 0; c.aguas = []; return; }
  const g = ((c.aguas || []) as Gole[]).find((x) => x.t === t);
  if (!g) return;
  c.aguas = ((c.aguas || []) as Gole[]).filter((x) => x.t !== t);
  c.agua = Math.max(0, (c.agua || 0) - g.ml / CUP_ML);
}

/** Os sete últimos dias em ml, do mais antigo para hoje. */
export function semanaDeAgua(S: State): { t: number; ml: number }[] {
  const hoje = +startOfDay(now());
  const porDia = new Map<number, number>(
    (S.checkins as any[]).map((c) => [c.t, Math.round((c.agua || 0) * CUP_ML)]),
  );
  return Array.from({ length: 7 }, (_, i) => {
    const t = hoje - (6 - i) * DAY;
    return { t, ml: porDia.get(t) || 0 };
  });
}

/** Os dias do período, marcando os que têm água registrada. */
export function diasDeAgua(S: State, dias: number): DiaDaTira[] {
  const hoje = +startOfDay(now());
  const porT = new Map<number, number>();
  for (const c of S.checkins as any[]) {
    /* O ponto da tira responde "houve registro", e para isso o TOTAL é
       resposta melhor que a lista: um dia antigo tem litros e nenhum gole,
       e marcá-lo como vazio seria sumir com ele da vista. */
    const n = ((c.aguas || []) as Gole[]).length || ((c.agua || 0) > 0 ? 1 : 0);
    if (n) porT.set(c.t, n);
  }
  return Array.from({ length: dias }, (_, i) => {
    const t = hoje - (dias - 1 - i) * DAY;
    return { t, itens: porT.get(t) || 0, hoje: t === hoje };
  });
}

/** O caderno de um dia, do primeiro gole ao último. Um dia antigo devolve
    uma linha sem hora: o total é tudo o que se sabe dele. */
export function golesDoDia(S: State, t: number): { t: number | null; ml: number }[] {
  const c = (S.checkins as any[]).find((x) => x.t === t);
  if (!c) return [];
  const gs = ((c.aguas || []) as Gole[]).slice().sort((a, b) => a.t - b.t);
  if (gs.length) return gs;
  const ml = Math.round((c.agua || 0) * CUP_ML);
  return ml > 0 ? [{ t: null, ml }] : [];
}

/* ============================================================
   O PROTOCOLO DA SEMANA

   Cinco itens combinados com a equipe, e duas naturezas muito diferentes
   entre eles:

     MEDIDOS   água, proteína, movimento. O app conta esses dias o tempo
               todo — é o que as três telas de hábito fazem. No protocolo
               eles só aparecem somados.

     MANUAIS   aplicar a dose, agendar o exame. Não há registro de onde
               tirar a resposta; quem sabe é a pessoa, e por isso essas
               se marcam.

   A SEPARAÇÃO NÃO É ARRUMAÇÃO, é o conserto de uma mentira. Os medidos
   vinham com a contagem ESCRITA À MÃO — "5 de 7 dias" — ao lado de um
   caderno de água que sabia a resposta de verdade, e com uma caixinha
   que deixava marcar "2 L por dia" como cumprido num dia de meio litro.
   Duas fontes para o mesmo fato, e a que mandava era a inventada.

   Agora a contagem sai dos registros, e nos medidos a caixinha some:
   eles se cumprem bebendo, comendo e andando — não tocando neles.

   E A META SAI DO PERFIL, não do texto da tarefa. O item dizia "2 L de
   água por dia" enquanto o perfil pedia 2,5 L: a tela de água cobrava um
   número e o protocolo cobrava outro, na mesma semana. */

export type TarefaDoProtocolo = {
  /** o índice no array guardado — é por ele que a manual se marca */
  i: number;
  texto: string;
  nota: string;
  feita: boolean;
  /** medida: o app conta. manual: a pessoa marca. */
  medida: boolean;
};

/* Como cada meta medida se escreve e se conta. O alvo — em quantos dias
   da semana — vem da tarefa, porque é ele que a equipe negocia. */
const MEDIDAS: Record<string, (S: State, alvo: number) => { texto: string; feito: number }> = {
  agua: (S, alvo) => {
    const ml = (S.profile as any).targets.waterMl as number;
    return {
      texto: alvo >= 7 ? `Beber ${litros(ml)} L todo dia` : `Beber ${litros(ml)} L em ${alvo} dias`,
      feito: semanaDeAgua(S).filter((d) => d.ml >= ml).length,
    };
  },
  prot: (S, alvo) => {
    const g = (S.profile as any).targets.prot as number;
    return {
      texto: alvo >= 7 ? `Comer ${g} g de proteína todo dia` : `Comer ${g} g de proteína em ${alvo} dias`,
      feito: semanaDeProteina(S).filter((d) => d.g >= g).length,
    };
  },
  /* Dias COM MOVIMENTO, e não minutos: é o que o item pede — sair do
     sofá três vezes —, e é o que o registro sabe dizer sem chutar
     modalidade. O item já foi "Caminhada 3× na semana", e o app não tem
     como saber se aqueles trinta minutos foram uma caminhada. */
  exerc: (S, alvo) => ({
    texto: `Se mexer em ${alvo} ${alvo === 1 ? 'dia' : 'dias'} da semana`,
    feito: semanaDeMovimento(S).filter((d) => d.min > 0).length,
  }),
};

export function protocoloDaSemana(S: State) {
  const p: any = S.protocol;
  const tarefas: TarefaDoProtocolo[] = (p.tasks as any[]).map((x, i) => {
    const m = x.metrica && MEDIDAS[x.metrica];
    if (!m) {
      /* Tarefa manual — inclusive as antigas, guardadas antes de existir
         métrica: elas continuam valendo o que a pessoa marcou. */
      return { i, texto: x.t, nota: x.note || '', feita: !!x.done, medida: false };
    }
    const alvo = x.alvo || 7;
    const { texto, feito } = m(S, alvo);
    return {
      i, texto,
      nota: `${feito} de ${alvo} ${alvo === 1 ? 'dia' : 'dias'}`,
      feita: feito >= alvo,
      medida: true,
    };
  });
  const feitas = tarefas.filter((t) => t.feita).length;
  return {
    semana: p.week as number,
    tarefas,
    feitas,
    total: tarefas.length,
    pct: tarefas.length ? Math.round((feitas / tarefas.length) * 100) : 0,
  };
}

/* ============================================================
   AS SEMANAS ANTERIORES

   O app guarda UM protocolo, o desta semana — quem escreve é a equipe, e
   o da semana passada não ficou em lugar nenhum. Esta seção já existiu
   com duas linhas cravadas no código ("Semana 9 · 5 de 5 concluídos") e
   saiu por isso: era história inventada sobre o tratamento de alguém.

   O QUE DÁ PARA MOSTRAR DE VERDADE são as três metas que o app MEDE,
   semana a semana, saídas dos mesmos registros que alimentam as telas de
   água, alimentação e exercício. Aplicação e exame não entram: não existe
   registro de quem marcou o quê, e um "cumprido" sem lastro aqui seria a
   mesma invenção com outra roupa.

   A RESSALVA É REAL e está escrita na tela: os alvos são os de HOJE,
   aplicados para trás. Se a equipe mudou a meta de proteína no mês
   passado, o app não tem como saber — ele guarda a meta atual, não a
   história dela.

   E só entram as semanas com registro. Uma semana sem nenhum check-in
   não é uma semana de zeros, é uma semana sem resposta — e a diferença
   entre as duas coisas é a mesma de sempre.
   ============================================================ */
export type SemanaDoProtocolo = {
  semana: number;
  de: number;
  ate: number;
  metas: { ic: string; feito: number; alvo: number }[];
};

export function historicoDeProtocolos(S: State, n = 6): SemanaDoProtocolo[] {
  const hoje = +startOfDay(now());
  const t = (S.profile as any).targets;
  /* Os alvos saem das tarefas de hoje — é lá que a equipe negocia quantos
     dias da semana cada meta pede. */
  const alvoDe = (metrica: string, padrao: number) => {
    const x = (S.protocol.tasks as any[]).find((y) => y.metrica === metrica);
    return (x && x.alvo) || padrao;
  };
  const alvos = { agua: alvoDe('agua', 7), prot: alvoDe('prot', 7), exerc: alvoDe('exerc', 3) };

  const out: SemanaDoProtocolo[] = [];
  for (let k = 1; k <= n; k++) {
    const ate = hoje - k * 7 * DAY;
    const de = ate - 6 * DAY;
    const cs = (S.checkins as any[]).filter((c) => c.t >= de && c.t <= ate);
    if (!cs.length) continue;
    out.push({
      semana: S.protocol.week - k,
      de,
      ate,
      metas: [
        { ic: 'water', feito: cs.filter((c) => (c.agua || 0) * CUP_ML >= t.waterMl).length, alvo: alvos.agua },
        { ic: 'utensils', feito: cs.filter((c) => (c.prot || 0) >= t.prot).length, alvo: alvos.prot },
        { ic: 'dumbbell', feito: cs.filter((c) => (c.exerc || 0) > 0).length, alvo: alvos.exerc },
      ],
    });
  }
  return out;
}

/* UMA SEMANA DO HISTÓRICO, aberta.

   A linha do histórico diz 5/7 e para aí. Quem toca nela quer a coisa
   que o número esconde: QUAIS dias. Cinco de sete seguidos e cinco de
   sete alternados são a mesma fração e semanas diferentes — a primeira é
   um hábito que caiu na quinta, a segunda é um hábito que nunca pegou.

   Dia sem check-in devolve valor nulo, e não zero. Nos acumuladores os
   dois quase se confundem — quem não registrou água provavelmente bebeu
   pouco —, mas "não sei" e "zero" continuam sendo respostas diferentes,
   e a célula vazia é a única que diz a primeira. */
export type DiaDaMeta = { t: number; ok: boolean; valor: number | null };
export type MetaDaSemana = {
  ic: string;
  texto: string;
  feito: number;
  alvo: number;
  /** a frase de baixo: média por dia, ou o total da semana */
  resumo: string;
  dias: DiaDaMeta[];
};

export function semanaDoHistorico(S: State, ate: number) {
  const de = ate - 6 * DAY;
  const t = (S.profile as any).targets;
  const alvoDe = (metrica: string, padrao: number) => {
    const x = (S.protocol.tasks as any[]).find((y) => y.metrica === metrica);
    return (x && x.alvo) || padrao;
  };

  const porT = new Map<number, any>((S.checkins as any[]).map((c) => [c.t, c]));
  const dias = Array.from({ length: 7 }, (_, i) => de + i * DAY);

  /* Média só dos dias REGISTRADOS, como em toda média deste arquivo:
     dividir por sete transformaria um dia sem resposta em um dia ruim. */
  const media = (vs: (number | null)[]) => {
    const n = vs.filter((v): v is number => v != null);
    return n.length ? n.reduce((a, b) => a + b, 0) / n.length : null;
  };

  const monta = (
    ic: string, texto: string, alvo: number,
    valorDe: (c: any) => number | null, bate: (v: number) => boolean,
    resumoDe: (m: number | null, soma: number) => string,
  ): MetaDaSemana => {
    const ds: DiaDaMeta[] = dias.map((d) => {
      const c = porT.get(d);
      const v = c ? valorDe(c) : null;
      return { t: d, ok: v != null && bate(v), valor: v };
    });
    const vs = ds.map((d) => d.valor);
    const soma = vs.reduce((a: number, b) => a + (b || 0), 0);
    return { ic, texto, alvo, feito: ds.filter((d) => d.ok).length, resumo: resumoDe(media(vs), soma), dias: ds };
  };

  return {
    semana: S.protocol.week - Math.round((+startOfDay(now()) - ate) / (7 * DAY)),
    de,
    ate,
    metas: [
      monta('water', `Beber ${litros(t.waterMl)} L todo dia`, alvoDe('agua', 7),
        (c) => (typeof c.agua === 'number' ? c.agua * CUP_ML : null),
        (v) => v >= t.waterMl,
        (m) => (m == null ? 'sem registro na semana' : `média de ${litros(Math.round(m))} L por dia`)),
      monta('utensils', `Comer ${t.prot} g de proteína todo dia`, alvoDe('prot', 7),
        (c) => (typeof c.prot === 'number' ? Math.round(c.prot) : null),
        (v) => v >= t.prot,
        (m) => (m == null ? 'sem registro na semana' : `média de ${Math.round(m)} g por dia`)),
      monta('dumbbell', `Se mexer em ${alvoDe('exerc', 3)} dias da semana`, alvoDe('exerc', 3),
        (c) => (typeof c.exerc === 'number' ? Math.round(c.exerc) : null),
        (v) => v > 0,
        (_m, soma) => (soma ? `${soma} min na semana` : 'nenhum movimento registrado')),
    ],
  };
}

/* ============================================================
   OS ALVOS — os quatro números que o app cobra

   Proteína, água, exercício e o peso de referência. Eles não são enfeite
   de perfil: a tela de alimentação cobra o de proteína, a de água cobra o
   dela, o protocolo conta os três e a Jornada mede a viagem inteira
   contra o de peso.

   E NÃO HAVIA COMO MUDAR NENHUM. O perfil tinha duas linhas apontando
   para /metas — "peso de referência" e "metas diárias" — e a tela de
   metas não mostrava nem um nem outro: dois becos sem saída para os
   números mais usados do app. A meta de 90 g de proteína valia para
   sempre porque ninguém tinha onde escrever outra.

   A tabela mora aqui, e não na tela, porque a folha de edição e a lista
   precisam das mesmas definições. Duas cópias divergiriam no dia em que
   alguém mudasse o passo de um lado só.
   ============================================================ */
export type ChaveDeAlvo = 'prot' | 'waterMl' | 'exercMin' | 'peso';

export const ALVOS: Record<ChaveDeAlvo, {
  ic: string;
  nome: string;
  /** o que este número muda no resto do app */
  onde: string;
  un: string;
  passo: number;
  min: number;
  max: number;
  le: (S: State) => number;
  /** como o número se escreve na tela */
  escreve: (v: number) => string;
}> = {
  prot: {
    ic: 'utensils', nome: 'Proteína por dia', onde: 'Cobrada na alimentação e no protocolo',
    un: 'g', passo: 5, min: 40, max: 220,
    le: (S) => (S.profile as any).targets.prot,
    escreve: (v) => String(Math.round(v)),
  },
  waterMl: {
    /* Guardada em mililitros e escrita em litros, como em toda parte: o
       passo de 250 ml é um copo, que é a unidade em que se bebe. */
    ic: 'water', nome: 'Água por dia', onde: 'Cobrada na água e no protocolo',
    un: 'L', passo: 250, min: 750, max: 5000,
    le: (S) => (S.profile as any).targets.waterMl,
    escreve: (v) => litros(v),
  },
  exercMin: {
    ic: 'dumbbell', nome: 'Exercício por dia', onde: 'É a tracejada da semana, no exercício',
    un: 'min', passo: 10, min: 10, max: 180,
    le: (S) => (S.profile as any).targets.exercMin,
    escreve: (v) => String(Math.round(v)),
  },
  peso: {
    /* Referência, e não alvo: é o ponto de chegada que a equipe combinou,
       e o app usa ele para medir o caminho — não para cobrar. */
    ic: 'scale', nome: 'Peso de referência', onde: 'Mede a viagem inteira, na Jornada',
    un: 'kg', passo: 0.5, min: 40, max: 200,
    le: (S) => S.profile.goalWeight,
    /* Sem o ",0" pendurado: 68 kg é como se fala de um peso redondo, e
       "68,0 kg" numa pastilha de meta parece precisão de balança. */
    escreve: (v) => nf(v, 1).replace('.', ',').replace(/,0$/, ''),
  },
};

export function mudarAlvo(s: any, chave: ChaveDeAlvo, valor: number) {
  const a = ALVOS[chave];
  const v = Math.max(a.min, Math.min(a.max, valor));
  if (chave === 'peso') s.profile.goalWeight = v;
  else s.profile.targets[chave] = v;
}

/* ============================================================
   AS METAS — e as duas naturezas que elas têm

   MEDIDAS   o app tem como responder: quantas noites de sete horas,
             quantos dias com energia alta. Saem dos check-ins, e a
             porcentagem é uma conta de verdade.

   PESSOAIS  só a pessoa sabe. Vestir a calça jeans antiga, subir a
             escada sem parar, voltar a jogar bola no domingo.

   A PESSOAL PERDEU A PORCENTAGEM, e essa é a mudança que importa. Ela
   vinha com "prog: 60" escrito na semente e uma barra em 60% — e não
   existe sessenta por cento de caber numa calça. Era precisão inventada,
   parada para sempre num número que ninguém tinha como mexer.

   Agora ela é o que sempre foi: ainda não, ou conseguiu em tal dia. A
   data importa mais que a barra — é ela que a pessoa vai querer contar
   para alguém.

   É a mesma divisão do protocolo, pelo mesmo motivo: o que o app mede,
   ele conta; o que só a pessoa sabe, ela diz.
   ============================================================ */
/* ============================================================
   OS INDICADORES — o que o app sabe contar, e a régua que falta

   Um indicador é uma coluna do check-in mais uma DIREÇÃO: sono conta
   para cima, enjoo conta para baixo. O que ele não traz é o número —
   esse é de quem está criando a meta.

   A LISTA OFERECIA A RÉGUA PRONTA: "Dormir 7h+", "Enjoo em 2 ou menos".
   Sete horas é o que a literatura repete, e mesmo assim é um palpite
   sobre a vida de alguém — quem dorme cinco e quer chegar a seis não
   tinha onde dizer isso, e quem já dorme oito recebia uma meta que já
   nasceu cumprida. Escolher a coisa e escolher o número são duas
   decisões, e a segunda é a que é pessoal.

   Agora a lista é genérica — "Horas de sono", "Enjoo" — e o número vem
   no segundo toque, com a mesma régua e as mesmas palavras do check-in.

   E É A RÉGUA DA TELA, NÃO A DO BANCO. Energia e fome são guardadas de
   0 a 10 e perguntadas de 1 a 5; a meta dizia "energia de 7 para cima",
   que é um número que ninguém nunca viu em tela nenhuma. A escolha
   acontece em 1 a 5, com as legendas do check-in, e a leitura converte —
   é a mesma fronteira que escalas.ts já documenta.

   TODO INDICADOR CONTA SÓ OS DIAS RESPONDIDOS. Catorze dias com três
   noites registradas não são "21% das noites": são três noites.
   ============================================================ */
export type Indicador = {
  id: string;
  ic: string;
  /** o nome genérico, na lista de escolha: "Horas de sono" */
  nome: string;
  /** a pergunta do segundo passo */
  pergunta: string;
  /* DE ONDE SAI O NÚMERO, dito na lista. "Conta para cima" era o que
     estava ali, e é coisa da régua — que só aparece no passo seguinte.
     Antes de escolher, o que a pessoa precisa saber é se o app tem como
     responder: se ela nunca registra refeição, a meta de proteína vai
     ficar parada em zero e é melhor ela ver isso agora. */
  origem: string;
  /** singular e plural do que se conta */
  nomes: [string, string];
  /** para cima (sono, proteína) ou para baixo (enjoo, fome) */
  sentido: 'min' | 'max';
  /** o palpite inicial — só um começo, não uma recomendação */
  padrao: number;
  /* A UNIDADE, para quem escreve MÉDIA.

     `escreve` dá conta do número inteiro que a pessoa escolhe — "7 h",
     "4 de 5" —, mas média tem casa decimal, e formatar decimal é de quem
     mostra. Sem a unidade declarada aqui, cada tela que mostra média
     redescobre que sono é hora e energia é degrau; é assim que uma delas
     acaba escrevendo "6.8 h" com ponto. Os indicadores de passo já dizem
     a sua em `passos.un`. */
  un?: string;
  /** quando o padrão sai da meta do perfil */
  doPerfil?: (S: State) => number;
  /** escolha por régua, com as legendas do check-in */
  escala?: { valores: number[]; legendas?: string[] };
  /** escolha por passos, quando o número é aberto */
  passos?: { min: number; max: number; passo: number; un: string };
  /** o valor do dia na régua da ESCOLHA; null quando não foi respondido */
  leitura: (c: any) => number | null;
  /** o nome que a meta ganha: "Dormir 7h por noite" */
  rotulo: (v: number) => string;
  /** o que ela conta, dito por extenso */
  conta: (v: number) => string;
  /** como o número aparece no seletor */
  escreve: (v: number) => string;
};

const num = (c: any, k: string): number | null => (typeof c[k] === 'number' ? c[k] : null);

export const INDICADORES: Indicador[] = [
  {
    id: 'sono', ic: 'moon', nome: 'Horas de sono',
    pergunta: 'Quantas horas por noite?', origem: 'Do sono que você responde no check-in',
    nomes: ['noite', 'noites'], sentido: 'min', padrao: 7, un: 'h',
    escala: { valores: [5, 6, 7, 8, 9], legendas: SONO },
    leitura: (c) => num(c, 'sono'),
    escreve: (v) => `${v} h`,
    rotulo: (v) => `Dormir ${v}h por noite`,
    conta: (v) => `Noites com ${v}h ou mais`,
  },
  {
    /* Energia e fome moram de 0 a 10 no banco e de 1 a 5 na tela. A
       leitura converte com paraTela, que é a mesma função que o check-in
       usa para reabrir uma resposta salva. */
    id: 'energia', ic: 'bolt', nome: 'Energia no dia',
    pergunta: 'De que nível para cima conta?', origem: 'Da energia que você responde no check-in',
    nomes: ['dia', 'dias'], sentido: 'min', padrao: 4, un: 'de 5',
    escala: { valores: [1, 2, 3, 4, 5], legendas: ENERGIA },
    leitura: (c) => paraTela(c.energia),
    escreve: (v) => `${v} de 5`,
    rotulo: (v) => `Energia ${v} ou mais`,
    conta: (v) => `Dias com energia ${v} ou mais, de 1 a 5`,
  },
  {
    id: 'humor', ic: 'mood', nome: 'Humor no dia',
    pergunta: 'De que nível para cima conta?', origem: 'Do humor que você responde no check-in',
    nomes: ['dia', 'dias'], sentido: 'min', padrao: 4, un: 'de 5',
    escala: { valores: [1, 2, 3, 4, 5], legendas: HUMOR },
    leitura: (c) => num(c, 'mood'),
    escreve: (v) => `${v} de 5`,
    rotulo: (v) => `Humor ${v} ou mais`,
    conta: (v) => `Dias com humor ${v} ou mais, de 1 a 5`,
  },
  {
    /* Sintoma conta AO CONTRÁRIO: o acerto é o dia em que o número ficou
       baixo. Sem o sentido, "menos enjoo" mostraria a barra crescendo
       junto com o enjoo. */
    id: 'enjoo', ic: 'waves', nome: 'Enjoo',
    pergunta: 'Até que nível ainda conta como bom?', origem: 'Do enjoo que você marca no check-in',
    nomes: ['dia', 'dias'], sentido: 'max', padrao: 2, un: 'de 5',
    escala: { valores: [1, 2, 3, 4, 5], legendas: SINTOMA.nausea },
    leitura: (c) => num(c, 'nausea'),
    escreve: (v) => `${v} de 5`,
    rotulo: (v) => `Enjoo ${v} ou menos`,
    conta: (v) => `Dias com enjoo ${v} ou menos, de 1 a 5`,
  },
  {
    id: 'fome', ic: 'soup', nome: 'Fome',
    pergunta: 'Até que nível ainda conta como bom?', origem: 'Da fome que você responde no check-in',
    nomes: ['dia', 'dias'], sentido: 'max', padrao: 3, un: 'de 5',
    escala: { valores: [1, 2, 3, 4, 5], legendas: FOME },
    leitura: (c) => paraTela(c.fome),
    escreve: (v) => `${v} de 5`,
    rotulo: (v) => `Fome ${v} ou menos`,
    conta: (v) => `Dias com fome ${v} ou menos, de 1 a 5`,
  },
  {
    /* Os três de baixo começam na meta do PERFIL, que é o número que a
       pessoa já persegue todo dia — mas continuam livres: dá para pôr uma
       meta de proteína mais baixa do que a diária e ir subindo. */
    id: 'prot', ic: 'utensils', nome: 'Proteína por dia',
    pergunta: 'Quantos gramas por dia?', origem: 'Das refeições que você registra',
    nomes: ['dia', 'dias'], sentido: 'min', padrao: 90,
    doPerfil: (S) => (S.profile as any).targets.prot,
    passos: { min: 40, max: 220, passo: 5, un: 'g' },
    leitura: (c) => num(c, 'prot'),
    escreve: (v) => `${Math.round(v)} g`,
    rotulo: (v) => `Comer ${Math.round(v)} g de proteína`,
    conta: (v) => `Dias com ${Math.round(v)} g ou mais`,
  },
  {
    id: 'agua', ic: 'water', nome: 'Água por dia',
    pergunta: 'Quanto por dia?', origem: 'Da água que você registra',
    nomes: ['dia', 'dias'], sentido: 'min', padrao: 2500,
    doPerfil: (S) => (S.profile as any).targets.waterMl,
    passos: { min: 750, max: 5000, passo: 250, un: 'L' },
    leitura: (c) => (typeof c.agua === 'number' ? c.agua * CUP_ML : null),
    escreve: (v) => `${litros(v)} L`,
    rotulo: (v) => `Beber ${litros(v)} L de água`,
    conta: (v) => `Dias com ${litros(v)} L ou mais`,
  },
  {
    id: 'exerc', ic: 'dumbbell', nome: 'Minutos de movimento',
    pergunta: 'Quantos minutos por dia?', origem: 'Dos treinos que você registra',
    nomes: ['dia', 'dias'], sentido: 'min', padrao: 30,
    passos: { min: 10, max: 180, passo: 10, un: 'min' },
    leitura: (c) => num(c, 'exerc'),
    escreve: (v) => `${Math.round(v)} min`,
    rotulo: (v) => `Se mexer ${Math.round(v)} min por dia`,
    conta: (v) => `Dias com ${Math.round(v)} min ou mais`,
  },
];

/* ============================================================
   AS QUE O APP NÃO MEDE

   A folha oferecia oito indicadores e, no fim, uma linha em branco. E a
   linha em branco é a parte mais difícil da tela: quem abre "escreva sua
   meta" com o cursor piscando escreve "emagrecer" — que é o que o app
   inteiro já faz — ou fecha.

   ESTAS SÃO CATEGORIAS, E NÃO FRASES PRONTAS. É a mesma forma dos
   indicadores: a lista diz de QUE coisa se trata, e o segundo toque é
   que a torna dela. "Um esporte" pergunta qual esporte; "uma peça de
   roupa" pergunta qual peça.

   Elas chegaram a ser frases prontas que preenchiam o campo — "Voltar a
   um esporte que eu gostava", com o cursor no fim. Funcionava e era
   preguiçoso: quem não apagasse nada ficava com uma meta genérica, e
   meta genérica não convida ninguém a nada. A pergunta obriga a
   especificar, que é justamente o trabalho que uma meta pessoal pede.

   O PREFIXO GARANTE QUE A FRASE FECHE. A resposta é um pedaço de frase —
   "vôlei", "o vestido do casamento" — e o monta devolve a sentença
   inteira. Sem isso, metade das metas começaria em minúscula e a outra
   metade repetiria o verbo.

   Nenhuma delas assume família, corpo ou dinheiro: uma meta que não cabe
   na vida de quem está lendo é pior do que campo vazio.
   ============================================================ */
export type MetaPessoal = {
  id: string;
  ic: string;
  /** a categoria, na lista */
  nome: string;
  /** a pergunta que especifica */
  pergunta: string;
  /* O QUE APARECE DENTRO DO CAMPO, e por que ele é neutro.

     Ele era um exemplo de verdade — "o vestido do casamento da minha
     irmã", "vôlei" —, e exemplo dentro de campo é sugestão: quem lê
     aquilo antes de pensar na própria meta pensa na meta do exemplo. Pior
     no caso da roupa, que inventava um casamento e uma irmã para quem
     talvez não tenha nenhum dos dois.

     Quem ensina a forma da resposta agora é a frase montada logo abaixo,
     que aparece já na primeira letra e mostra o resultado de verdade em
     vez de prometer um. */
  dica: string;
  /** a frase inteira, a partir do pedaço que a pessoa escreveu */
  monta: (r: string) => string;
};

export const METAS_PESSOAIS: MetaPessoal[] = [
  {
    id: 'roupa', ic: 'ruler', nome: 'Uma peça de roupa',
    pergunta: 'Qual peça você quer vestir?',
    dica: 'Digite a peça de roupa',
    monta: (r) => `Vestir ${r}`,
  },
  {
    id: 'esporte', ic: 'run', nome: 'Um esporte',
    pergunta: 'Qual esporte você quer voltar a praticar?',
    dica: 'Digite o esporte',
    monta: (r) => `Voltar a praticar ${r}`,
  },
  {
    id: 'folego', ic: 'walk', nome: 'Algo do dia a dia',
    pergunta: 'O que você quer fazer sem perder o fôlego?',
    dica: 'Digite a atividade',
    monta: (r) => `Conseguir ${r} sem perder o fôlego`,
  },
  {
    id: 'sentir', ic: 'heart', nome: 'Como eu me sinto',
    pergunta: 'Como você quer se sentir?',
    dica: 'Digite como você quer se sentir',
    monta: (r) => `Me sentir ${r}`,
  },
  {
    id: 'foto', ic: 'photo', nome: 'Uma foto',
    pergunta: 'Que foto você quer tirar?',
    dica: 'Digite a foto que você quer tirar',
    monta: (r) => `Tirar ${r}`,
  },
];

/* A saída para o que não cabe em nenhuma categoria. Ela é a mesma coisa
   que as outras — pergunta, exemplo, monta —, só que sem prefixo: aqui a
   frase inteira é de quem escreve. */
export const META_LIVRE: MetaPessoal = {
  id: 'livre', ic: 'more', nome: 'Outra meta',
  pergunta: 'O que você quer conseguir?',
  dica: 'Digite a sua meta',
  monta: (r) => r,
};

/* OS PRAZOS, e por que eles são relativos.

   Uma meta pessoal pode ter data — "até o casamento", "até a consulta de
   junho" — e um calendário para escolher o dia exato seria precisão que
   ninguém tem: quem põe prazo numa meta de tratamento pensa em "uns três
   meses", não em 14 de dezembro.

   E o prazo é OPCIONAL de verdade: a primeira opção é não ter, e ela vem
   selecionada. Uma meta sem data continua sendo uma meta — o que ela não
   pode é ganhar um prazo que a pessoa não escolheu. */
export const PRAZOS: { id: string; label: string; dias: number | null }[] = [
  { id: 'nao', label: 'Sem prazo', dias: null },
  { id: '30', label: 'Em 1 mês', dias: 30 },
  { id: '90', label: 'Em 3 meses', dias: 90 },
  { id: '180', label: 'Em 6 meses', dias: 180 },
  { id: '365', label: 'Em 1 ano', dias: 365 },
];

export const indicadorDe = (id?: string | null) =>
  INDICADORES.find((x) => x.id === id) || null;

/** O número com que o seletor abre: a meta do perfil quando existe. */
export const padraoDe = (i: Indicador, S: State) => (i.doPerfil ? i.doPerfil(S) : i.padrao);

/* Os indicadores que ainda não viraram meta. Duas metas medindo a mesma
   coluna seriam duas linhas quase iguais, e a segunda teria de explicar
   por que difere da primeira. */
export function indicadoresLivres(S: State): Indicador[] {
  const usados = new Set(((S.goals || []) as any[]).map((g) => g.indicador || KIND_ANTIGO[g.kind]));
  return INDICADORES.filter((i) => !usados.has(i.id));
}

/* As metas guardadas antes de existir indicador traziam `kind`, e as da
   primeira versão do catálogo traziam a régua no id ('sono7u'). As duas
   continuam valendo: o app traduz na leitura, e ninguém perde a meta de
   sono por causa de uma mudança de formato. */
const KIND_ANTIGO: Record<string, string> = {
  sono: 'sono', energia: 'energia',
  sono7u: 'sono', sono7: 'sono', energia7: 'energia', humor4: 'humor',
};

export type Meta = {
  id: string;
  ic: string;
  label: string;
  /** o indicador que o app conta; sem ele, a meta é pessoal */
  indicador?: string | null;
  /** o número que a pessoa escolheu para ele */
  alvo?: number;
  /** só nas pessoais */
  feita?: boolean;
  /** o dia em que ela foi conquistada */
  em?: number | null;
  /** a data que a pessoa escolheu, quando escolheu alguma */
  prazo?: number | null;
};

/** Uma meta que só a pessoa sabe dizer quando chegou, com prazo se ela
    quis um. */
export function guardarMetaPessoal(s: any, label: string, ic = 'target', prazo: number | null = null) {
  const texto = label.trim();
  if (!texto) return;
  s.goals = [...(s.goals || []), {
    id: 'g' + Date.now(), ic, label: texto, indicador: null, feita: false, em: null, prazo,
  }];
}

/** Uma meta amarrada a um indicador e a um número — o app conta, ela não
    se marca. O rótulo sai do indicador com o alvo dentro, para a lista
    não ter de remontar a frase. */
export function guardarMetaMedida(s: any, idIndicador: string, alvo: number) {
  const i = indicadorDe(idIndicador);
  if (!i) return;
  s.goals = [...(s.goals || []), {
    id: 'g' + Date.now(), ic: i.ic, label: i.rotulo(alvo), indicador: i.id, alvo,
  }];
}

export function apagarMeta(s: any, id: string) {
  s.goals = ((s.goals || []) as any[]).filter((g) => g.id !== id);
}

/* Marcar guarda a DATA junto, e desmarcar a apaga. Sem isso, quem
   desmarcasse por engano e marcasse de novo ficaria com a data do engano
   — e a data é a parte da conquista que se conta para alguém. */
export function marcarMeta(s: any, id: string) {
  const g = ((s.goals || []) as any[]).find((x) => x.id === id);
  if (!g || g.indicador || KIND_ANTIGO[g.kind]) return;
  g.feita = !g.feita;
  g.em = g.feita ? +startOfDay(now()) : null;
}

/* O EXAME QUE AINDA ESTÁ ABERTO no protocolo. Três telas perguntam por
   ele — a lista de hoje, as recomendações e o cuidado —, e a busca morava
   copiada nas três, cada uma com a sua regex.

   E só as MANUAIS entram: uma tarefa medida não tem texto próprio (o
   texto dela sai da meta do perfil), então procurar "exame" nela é
   procurar em undefined. */
export function exameNoProtocolo(S: State): string | null {
  const x = (S.protocol.tasks as any[])
    .find((t) => !t.done && typeof t.t === 'string' && /exame/i.test(t.t));
  return x ? (x.t as string) : null;
}

/** Marca ou desmarca uma tarefa manual. As medidas não passam por aqui. */
export function marcarTarefa(s: any, i: number) {
  const x = s.protocol.tasks[i];
  if (!x || x.metrica) return;
  x.done = !x.done;
}

/* ============================================================
   QUANDO FOI A APLICAÇÃO

   O formulário tinha três opções — Agora, Outro horário, Outro dia — e
   as três gravavam `+now()`. A escolha era lida na tela e jogada fora
   no salvar: quem aplicou na sexta e registrou no domingo ficava com uma
   aplicação de domingo, e a próxima data saía dois dias errada.

   E a tela de aplicações prometia, por escrito, "dá pra registrar uma
   aplicação anterior a qualquer momento".

   "OUTRO HORÁRIO" NÃO VOLTA. A hora de uma aplicação não aparece em
   lugar nenhum do app — o histórico mostra data, o calendário conta por
   dia, a curva farmacológica trabalha em dias. Um controle cujo valor
   ninguém lê não é um recurso, é uma pergunta que a pessoa responde à
   toa.

   Fica o DIA, em pastilhas: hoje e os seis anteriores. Mais que isso e o
   atraso deixa de ser esquecimento e vira outra conversa — com a equipe,
   não com o formulário. */
export function diasParaAplicar(S: State, n = 7): { id: string; label: string; t: number }[] {
  const hoje = +startOfDay(now());
  return Array.from({ length: n }, (_, i) => {
    const t = hoje - i * DAY;
    const d = new Date(t);
    return {
      id: String(i),
      label: i === 0 ? 'Hoje' : i === 1 ? 'Ontem' : i === 2 ? 'Anteontem' : `${fmtWD(d)} ${d.getDate()}`,
      t,
    };
  });
}

/* A hora dentro do dia escolhido: agora quando é hoje, meio-dia quando é
   um dia que já passou. Meio-dia porque a hora precisa existir para o
   registro ter um instante, e porque ela não aparece em tela nenhuma —
   herdar a hora de AGORA num registro de sexta-feira seria inventar um
   detalhe com cara de dado. */
export const instanteDaAplicacao = (t: number) =>
  t === +startOfDay(now()) ? +now() : t + 12 * 3600000;

/* NÃO EXISTE APAGAR APLICAÇÃO, e isso é decisão de produto.

   Chegou a existir, pela mesma regra da água e do treino: o que o app
   deixa criar, ele tem de deixar desfazer. Mas uma aplicação não é um
   copo d'água — é registro de medicamento injetado, o que a equipe lê na
   consulta e o que conta a história do tratamento. Um toque errado
   apagando a dose da semana passada some com um fato clínico.

   Quem registrou errado resolve com quem acompanha. O app não oferece a
   borracha. */

/** Estoque da caneta — quantas doses restam e quando isso vira urgência. */
export function penStock(S: State) {
  const p: any = (S as any).pen || { dosesLeft: 0, dosesPerPen: 4 };
  const semanas = p.dosesLeft * (cadenciaDias(S) / 7);
  const verdict: Verdict = p.dosesLeft <= 1
    ? { label: 'Renove agora', good: false }
    : p.dosesLeft <= 3
      ? { label: 'Vale renovar a receita', good: false }
      : { label: 'Estoque em dia', good: true };
  return { left: p.dosesLeft, total: p.dosesPerPen, semanas, verdict };
}

/* Resumo do tratamento — os cinco números do topo da Jornada. */
/* A LINHA DO DIA, que agora precisa saber contar para trás.

   O cadastro aceita "vou começar em breve", e com isso startT pode estar
   no futuro. A conta que a Home fazia — diffDays + 1, direto no JSX —
   escrevia "Dia -6 do tratamento", que não é frase nenhuma, e ao lado
   dela uma semana de protocolo que ainda não começou.

   Antes de começar o que existe é contagem regressiva; depois, o dia. E
   a semana só entra quando existe semana. */
export function diaDoTratamento(S: State) {
  /* SEM NENHUMA APLICAÇÃO, NÃO HÁ DIA DE TRATAMENTO A CONTAR.

     O cadastro deixou de perguntar a data a quem ainda vai começar —
     muita gente chega ao app antes de ter receita, e pedir uma data que
     ela não tem é pedir um palpite para guardar como fato. Para essa
     pessoa startT é o dia do cadastro, e sem esta guarda a Home abriria
     dizendo "Dia 1 do tratamento" para quem nunca aplicou nada.

     O tratamento começa na primeira dose, e é ela que passa a contar. */
  if (!S.injections.length) return { antes: true, texto: 'Antes da primeira dose' };
  const d = diffDays(now(), new Date(S.profile.startT));
  if (d < 0) return { antes: true, texto: d === -1 ? 'Começa amanhã' : `Começa em ${-d} dias` };
  return { antes: false, texto: `Dia ${d + 1} do tratamento` };
}

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
  const exame = exameNoProtocolo(S);
  if (exame) out.push({ ic: 'doc', texto: exame, sub: 'pedido pela sua equipe', to: '/exames' });
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
  const cad = cadenciaDias(S);
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
export function contaDe(cs: any[], k: string, cond: (v: number) => boolean) {
  const vs = (cs || []).filter((c) => respondido(c, k)).map((c) => c[k] as number);
  return { n: vs.filter(cond).length, de: vs.length };
}

export function pctDe(cs: any[], k: string, cond: (v: number) => boolean): number | null {
  const { n, de } = contaDe(cs, k, cond);
  return de ? (n / de) * 100 : null;
}
