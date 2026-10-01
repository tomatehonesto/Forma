import type { State } from '../seed';
import { examStatus, cadenciaDias, aguaDoDia, startWeight } from '../derive';
import { SINTOMAS_LIDOS, grauDoSintoma } from '../escalas';
import { DAY, startOfDay } from '../time';
import { COMPORTAMENTOS, RESULTADOS, JANELA_SEMANAS, type Dia, type Comportamento, type Resultado } from './dias';
import { comparar, nivelDe, forcaDe, tendencia } from './regua';

/* ============================================================
   OS DETECTORES — um por área da jornada

   ⚠️ NÃO É SÓ REGISTRO CONTRA SINTOMA (o dono, 01/10/2026: "ritmo de
   perda de peso, melhora de exames, exercícios, de tudo"). Cada detector
   olha uma área e devolve candidatas na mesma forma; acrescentar uma área
   é escrever mais uma função e pô-la na lista do index.

   Os números de `dados` são o que a leitura usa COMO VIERAM: a IA do
   servidor escreve a frase, mas não calcula nada.
   ============================================================ */

export type Area = 'habitos' | 'ritmo' | 'exames' | 'exercicio' | 'sintomas' | 'pesoSemanal' | 'medidas' | 'constancia';
export type Nivel = 'forte' | 'comeco' | 'retrato';

export type Candidata = {
  area: Area;
  /** o que é, para a leitura: 'par', 'ritmoRecente', 'marco', … */
  tipo: string;
  /** a identidade, para a memória: a mesma descoberta não volta por 3 semanas */
  chave: string;
  nivel: Nivel;
  forca: number;
  dados: Record<string, number | string | boolean>;
};

export type Contexto = { S: State; dias: Dia[]; de: number; ate: number };

const um = (x: number) => Math.round(x * 10) / 10;
const dois = (x: number) => Math.round(x * 100) / 100;
const media = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const pesosAte = (S: State, ate: number) => (((S as any).weights ?? []) as { t: number; kg: number }[])
  .filter((w) => w.t < ate).sort((a, b) => a.t - b.t);

/* ---------------- hábitos × como a pessoa se sente ---------------- */

/* Pares que não dizem nada: a janela do enjoo já é uma descoberta de
   hoje (derive, janelaDoEnjoo), e proteína na meta com fome do mesmo dia
   é quase a mesma coisa medida duas vezes. */
const OBVIO = (b: Comportamento, r: Resultado, lag: number) =>
  (b === 'posAplicacao' && r === 'enjoo') || (b === 'proteinaNaMeta' && r === 'fome' && lag === 0);

export function habitos({ dias, ate }: Contexto): Candidata[] {
  const fora: Candidata[] = [];
  const metade = ate - (JANELA_SEMANAS / 2) * 7 * DAY;
  for (const b of COMPORTAMENTOS) for (const r of RESULTADOS) for (const lag of [0, 1]) {
    if (OBVIO(b, r, lag)) continue;
    const pares: { com: boolean; valor: number; t: number }[] = [];
    dias.forEach((d, i) => {
      const faz = d.faz[b];
      const sente = dias[i + lag]?.sente[r];
      if (faz != null && sente != null) pares.push({ com: faz, valor: sente, t: d.t });
    });
    const c = comparar(pares, metade);
    if (!c) continue;
    const nivel = nivelDe(c);
    if (!nivel) continue;
    fora.push({
      area: b === 'treino' ? 'exercicio' : 'habitos',
      tipo: 'par',
      chave: `par:${b}:${r}:${lag}`,
      nivel,
      forca: forcaDe(c),
      dados: {
        comportamento: b, resultado: r, defasagem: lag,
        mediaCom: um(c.mediaCom), mediaSem: um(c.mediaSem), diasCom: c.diasCom, diasSem: c.diasSem,
        escala: '1 a 5',
      },
    });
  }
  return fora;
}

/* ---------------- o ritmo do peso ---------------- */

const kgPorSemana = (pts: { t: number; kg: number }[]) => {
  const tr = tendencia(pts.map((p) => ({ t: p.t, v: p.kg })));
  return tr ? { perda: -tr.inclinacao * 7 * DAY, desvio: tr.desvio } : null;
};

export function ritmo({ S, de, ate }: Contexto): Candidata[] {
  const fora: Candidata[] = [];
  const pesos = pesosAte(S, ate);
  if (pesos.length < 2) return fora;

  /* as últimas 4 semanas contra as 4 anteriores */
  const recentes = pesos.filter((w) => w.t >= ate - 28 * DAY);
  const anteriores = pesos.filter((w) => w.t >= ate - 56 * DAY && w.t < ate - 28 * DAY);
  if (recentes.length >= 4 && anteriores.length >= 4) {
    const r = kgPorSemana(recentes)!, a = kgPorSemana(anteriores)!;
    const ruido = kgPorSemana([...anteriores, ...recentes])!.desvio;
    const dif = r.perda - a.perda;
    /* ⚠️ DESACELERAR NÃO É DESCOBERTA FORTE. A perda desacelera com o tempo
       — é o esperado, e a base diz isso. Dito como o destaque da semana,
       vira "parou de funcionar". Acelerar é padrão forte; desacelerar fica
       como retrato de prioridade baixa, para a leitura explicar. */
    if (Math.abs(dif) >= 0.3 && Math.abs(dif) * 4 >= Math.max(1, 2 * ruido)) {
      const acelerou = dif > 0;
      fora.push({
        area: 'ritmo', tipo: acelerou ? 'ritmoAcelerou' : 'ritmoDesacelerou', chave: `ritmo:recente:${acelerou ? 'acelerou' : 'desacelerou'}`,
        nivel: acelerou ? 'forte' : 'retrato', forca: acelerou ? Math.min(1, Math.abs(dif) / 0.8) : 0.2,
        dados: { ritmoRecenteKgSemana: dois(r.perda), ritmoAnteriorKgSemana: dois(a.perda), semanas: 4 },
      });
    }
  }

  /* antes e depois da última subida de dose, nas últimas 12 semanas */
  const apl = (((S as any).injections ?? []) as any[]).filter((i) => i.t < ate && i.dose != null).sort((x, y) => x.t - y.t);
  for (let i = apl.length - 1; i > 0; i--) {
    if (apl[i].dose === apl[i - 1].dose) continue;
    const t = apl[i].t;
    if (t < ate - 84 * DAY) break;
    const antes = pesos.filter((w) => w.t >= t - 28 * DAY && w.t < t);
    const depois = pesos.filter((w) => w.t >= t && w.t < Math.min(ate, t + 42 * DAY));
    if (antes.length >= 3 && depois.length >= 3) {
      const a = kgPorSemana(antes)!, d = kgPorSemana(depois)!;
      const ruido = kgPorSemana([...antes, ...depois])!.desvio;
      const dif = d.perda - a.perda;
      /* ⚠️ SÓ QUANDO ACELEROU. Desacelerar depois de subir a dose quase
         sempre é o tempo, e não a dose (a perda desacelera mês a mês);
         dito como descoberta, sugere que a dose não funciona — e a pessoa
         pode mexer nela por conta própria. */
      if (dif >= 0.3 && dif * 3 >= Math.max(1, 2 * ruido)) {
        fora.push({
          area: 'ritmo', tipo: 'ritmoDaDose', chave: `ritmo:dose:${apl[i].dose}`,
          nivel: 'forte', forca: Math.min(1, Math.abs(dif) / 0.8),
          dados: { doseAntes: apl[i - 1].dose, doseDepois: apl[i].dose, ritmoAntesKgSemana: dois(a.perda), ritmoDepoisKgSemana: dois(d.perda) },
        });
      }
    }
    break;
  }

  /* marcos: um múltiplo de 5% do peso inicial cruzado na semana lida */
  const inicial = startWeight(S) || pesos[0].kg;
  const antesDaSemana = pesos.filter((w) => w.t < de).pop();
  const fimDaSemana = pesos.filter((w) => w.t >= de).pop();
  if (antesDaSemana && fimDaSemana && inicial) {
    const pctAntes = ((inicial - antesDaSemana.kg) / inicial) * 100;
    const pctFim = ((inicial - fimDaSemana.kg) / inicial) * 100;
    const marco = Math.floor(pctFim / 5) * 5;
    if (marco >= 5 && pctAntes < marco) {
      fora.push({
        area: 'ritmo', tipo: 'marco', chave: `ritmo:marco:${marco}`, nivel: 'retrato', forca: 0.9,
        dados: { marcoPct: marco, perdidoKg: um(inicial - fimDaSemana.kg), pesoInicialKg: um(inicial) },
      });
    }
    const meta = (S.profile as any).goalWeight;
    if (meta && meta < inicial) {
      const metadeDoCaminho = inicial - (inicial - meta) / 2;
      if (antesDaSemana.kg > metadeDoCaminho && fimDaSemana.kg <= metadeDoCaminho) {
        fora.push({
          area: 'ritmo', tipo: 'metadeDoCaminho', chave: 'ritmo:metade', nivel: 'retrato', forca: 0.85,
          dados: { metaKg: meta, pesoKg: fimDaSemana.kg, faltamKg: um(fimDaSemana.kg - meta) },
        });
      }
    }
  }

  /* a projeção, sempre condicional: "se o ritmo continuar" */
  const meta = (S.profile as any).goalWeight;
  const atual = pesos[pesos.length - 1].kg;
  if (meta && atual > meta && recentes.length >= 3) {
    const r = kgPorSemana(recentes)!;
    if (r.perda >= 0.1) {
      const semanas = Math.round((atual - meta) / r.perda);
      if (semanas <= 104) {
        fora.push({
          area: 'ritmo', tipo: 'projecao', chave: `ritmo:projecao:${Math.round(semanas / 4)}`, nivel: 'retrato', forca: 0.3,
          dados: { metaKg: meta, pesoKg: atual, ritmoKgSemana: dois(r.perda), semanasSeORitmoContinuar: semanas },
        });
      }
    }
  }
  return fora;
}

/* ---------------- exames ---------------- */

const statusDe = (e: any, v: number) => examStatus({ ref: e.ref ?? '', values: [{ t: 0, v }] });

export function exames({ S, ate }: Contexto): Candidata[] {
  const fora: Candidata[] = [];
  for (const e of ((S as any).exams ?? []) as any[]) {
    const vs = ((e.values ?? []) as { t: number; v: number }[]).filter((x) => x.t < ate).sort((a, b) => a.t - b.t);
    if (vs.length < 2) continue;
    const ant = vs[vs.length - 2], ult = vs[vs.length - 1];
    if (!e.ref) continue;
    const sAnt = statusDe(e, ant.v), sUlt = statusDe(e, ult.v);
    const melhorou = (sAnt === 'alto' && ult.v < ant.v) || (sAnt === 'baixo' && ult.v > ant.v)
      || (sAnt === 'ok' && ((e.good === 'down' && ult.v < ant.v) || (e.good === 'up' && ult.v > ant.v)));
    if (!melhorou) continue;
    const pct = Math.abs(ult.v - ant.v) / Math.abs(ant.v || 1);
    const entrou = sAnt !== 'ok' && sUlt === 'ok';
    if (!entrou && pct < 0.05) continue;
    fora.push({
      area: 'exames', tipo: entrou ? 'exameEntrouNaFaixa' : 'exameMelhorou', chave: `exame:${e.marker}:${ult.t}`,
      nivel: entrou || pct >= 0.1 ? 'forte' : 'retrato', forca: entrou ? 0.9 : Math.min(0.8, pct * 4),
      dados: { marcador: e.marker, unidade: e.unit ?? '', antes: ant.v, depois: ult.v, referencia: e.ref, dataAntes: ant.t, dataDepois: ult.t },
    });
  }
  return fora;
}

/* ---------------- exercício ---------------- */

/** Os dias de treino em cada uma das últimas n semanas (a mais antiga
    primeiro), e quantos dias com registro cada uma teve. */
function semanasDeTreino(S: State, ate: number, n: number) {
  const checkins = ((S as any).checkins ?? []) as any[];
  return Array.from({ length: n }, (_, i) => {
    const fim = ate - (n - 1 - i) * 7 * DAY, ini = fim - 7 * DAY;
    const doPeriodo = checkins.filter((c) => c.t >= ini && c.t < fim);
    return { treinos: doPeriodo.filter((c) => (c.exerc ?? 0) > 0).length, registros: doPeriodo.length };
  });
}

export function exercicio({ S, ate }: Contexto): Candidata[] {
  const fora: Candidata[] = [];
  const sem = semanasDeTreino(S, ate, 12);
  /* a sequência de semanas treinando, até a semana lida */
  let seq = 0;
  for (let i = sem.length - 1; i >= 0 && sem[i].treinos > 0; i--) seq++;
  if (seq >= 3) {
    fora.push({
      area: 'exercicio', tipo: 'sequenciaDeTreino', chave: `exercicio:sequencia:${seq}`, nivel: 'retrato', forca: Math.min(0.7, 0.3 + seq * 0.05),
      dados: { semanasSeguidas: seq, treinosNaSemana: sem[sem.length - 1].treinos },
    });
  }
  /* as últimas 4 semanas contra as 4 anteriores, só com registro nas duas */
  const ult = sem.slice(-4), ant = sem.slice(-8, -4);
  const comRegistro = (xs: typeof sem) => xs.reduce((a, s) => a + s.registros, 0) >= 8;
  if (comRegistro(ult) && comRegistro(ant)) {
    const mu = media(ult.map((s) => s.treinos)), ma = media(ant.map((s) => s.treinos));
    if (Math.abs(mu - ma) >= 1) {
      fora.push({
        area: 'exercicio', tipo: 'frequenciaDeTreino', chave: `exercicio:frequencia:${mu > ma ? 'subiu' : 'caiu'}`,
        nivel: 'forte', forca: Math.min(1, Math.abs(mu - ma) / 2),
        dados: { treinosPorSemanaAgora: um(mu), treinosPorSemanaAntes: um(ma), semanas: 4 },
      });
    }
  }
  return fora;
}

/* ---------------- sintomas ao longo do tempo ---------------- */

export function sintomas({ S, ate }: Contexto): Candidata[] {
  const fora: Candidata[] = [];
  const checkins = ((S as any).checkins ?? []) as any[];
  const respondido = (c: any) => typeof c.nausea === 'number' || c.gut != null || !!c.sint;
  for (const s of SINTOMAS_LIDOS()) {
    const serie = (ini: number, fim: number) => checkins
      .filter((c) => c.t >= ini && c.t < fim && respondido(c))
      .map((c) => grauDoSintoma(c, s.id) ?? 0);
    const agora = serie(ate - 14 * DAY, ate), antes = serie(ate - 28 * DAY, ate - 14 * DAY);
    if (agora.length < 4 || antes.length < 4) continue;
    const ma = media(antes), mg = media(agora);
    if (ma >= 1.5 && mg <= ma / 2) {
      fora.push({
        area: 'sintomas', tipo: 'sintomaCaiu', chave: `sintoma:${s.id}:caiu`, nivel: 'forte', forca: Math.min(1, (ma - mg) / 2),
        dados: { sintoma: s.label, mediaAntes: um(ma), mediaAgora: um(mg), escala: '0 a 5', semanas: 2 },
      });
    }
  }
  return fora;
}

/* ---------------- hábitos × peso, semana a semana ---------------- */

/* O peso oscila demais para um sinal fraco dizer alguma coisa: aqui só
   existe padrão forte, e com régua própria (8 semanas, 3 de cada lado,
   0,3 kg por semana de diferença). */
export function pesoSemanal({ S, ate }: Contexto): Candidata[] {
  const fora: Candidata[] = [];
  const pesos = pesosAte(S, ate);
  const P: any = S.profile;
  const checkins = ((S as any).checkins ?? []) as any[];
  const semanas: { fim: number; perda: number; treinos: number; prot: number | null; agua: number | null }[] = [];
  for (let i = 11; i >= 0; i--) {
    const fim = ate - i * 7 * DAY, ini = fim - 7 * DAY;
    const ultimoAntes = pesos.filter((w) => w.t < ini).pop();
    const ultimoNa = pesos.filter((w) => w.t >= ini && w.t < fim).pop();
    if (!ultimoAntes || !ultimoNa || ultimoNa.t - ultimoAntes.t > 14 * DAY) continue;
    const doPeriodo = checkins.filter((c) => c.t >= ini && c.t < fim);
    const prots = doPeriodo.map((c) => c.prot).filter((v): v is number => typeof v === 'number' && v > 0);
    const aguas = Array.from({ length: 7 }, (_, k) => aguaDoDia(S, +startOfDay(ini + k * DAY))).filter((v) => v > 0);
    semanas.push({
      fim, perda: ultimoAntes.kg - ultimoNa.kg,
      treinos: doPeriodo.filter((c) => (c.exerc ?? 0) > 0).length,
      prot: prots.length >= 3 ? media(prots) : null,
      agua: aguas.length >= 3 ? media(aguas) : null,
    });
  }
  if (semanas.length < 8) return fora;
  const metade = semanas[Math.floor(semanas.length / 2)].fim;
  const habitosDaSemana: [string, (s: (typeof semanas)[number]) => boolean | null][] = [
    ['treino3', (s) => s.treinos >= 3],
    ['proteinaNaMeta', (s) => (s.prot == null || !P.targets?.prot ? null : s.prot >= P.targets.prot)],
    ['aguaNaMeta', (s) => (s.agua == null || !P.targets?.waterMl ? null : s.agua >= P.targets.waterMl)],
  ];
  for (const [nome, f] of habitosDaSemana) {
    const pares = semanas.map((s) => ({ com: f(s), valor: s.perda, t: s.fim })).filter((p): p is { com: boolean; valor: number; t: number } => p.com != null);
    const c = comparar(pares, metade);
    if (!c || Math.min(c.diasCom, c.diasSem) < 3 || Math.abs(c.diferenca) < 0.3 || c.z < 2.5 || !c.repete) continue;
    fora.push({
      area: 'pesoSemanal', tipo: 'pesoPorHabito', chave: `pesoSemanal:${nome}`, nivel: 'forte', forca: Math.min(1, Math.abs(c.diferenca) / 0.8),
      dados: { habito: nome, perdaComKgSemana: dois(c.mediaCom), perdaSemKgSemana: dois(c.mediaSem), semanasCom: c.diasCom, semanasSem: c.diasSem },
    });
  }
  return fora;
}

/* ---------------- medidas ---------------- */

export function medidas({ S, ate }: Contexto): Candidata[] {
  const ms = (((S as any).measures ?? []) as any[]).filter((m) => m.t < ate && typeof m.cintura === 'number').sort((a, b) => a.t - b.t);
  if (ms.length < 2) return [];
  const ult = ms[ms.length - 1];
  const ant = [...ms].reverse().find((m) => m.t <= ult.t - 21 * DAY && m.t >= ult.t - 180 * DAY);
  if (!ant) return [];
  const pesos = pesosAte(S, ate);
  const perto = (t: number) => pesos.filter((w) => Math.abs(w.t - t) <= 7 * DAY).sort((a, b) => Math.abs(a.t - t) - Math.abs(b.t - t))[0];
  const pa = perto(ant.t), pu = perto(ult.t);
  if (!pa || !pu) return [];
  const pctC = (ant.cintura - ult.cintura) / ant.cintura, pctP = (pa.kg - pu.kg) / pa.kg;
  if (pctC < 0.02 || pctC < pctP + 0.01) return [];
  return [{
    area: 'medidas', tipo: 'cinturaMaisQuePeso', chave: `medidas:cintura:${ult.t}`, nivel: 'retrato', forca: 0.6,
    dados: { cinturaAntesCm: ant.cintura, cinturaDepoisCm: ult.cintura, pctCintura: um(pctC * 100), pctPeso: um(pctP * 100), dataAntes: ant.t, dataDepois: ult.t },
  }];
}

/* ---------------- constância (e o retrato que sempre existe) ---------------- */

export function constancia({ S, de, ate }: Contexto): Candidata[] {
  const fora: Candidata[] = [];
  const P: any = S.profile;

  /* aplicações sem falha, da mais recente para trás */
  const apl = (((S as any).injections ?? []) as any[]).filter((i) => i.t < ate).sort((a, b) => b.t - a.t);
  const folga = (cadenciaDias(S) + 2) * DAY;
  let seguidas = apl.length ? 1 : 0;
  for (let i = 1; i < apl.length && apl[i - 1].t - apl[i].t <= folga; i++) seguidas++;
  if (seguidas >= 4 && apl.length && ate - apl[0].t <= folga) {
    fora.push({
      area: 'constancia', tipo: 'aplicacoesSemFalha', chave: `constancia:aplicacoes:${Math.floor(seguidas / 4)}`, nivel: 'retrato', forca: 0.5,
      dados: { aplicacoesSeguidas: seguidas, cadenciaDias: cadenciaDias(S) },
    });
  }

  /* a melhor semana de água e de proteína, entre as últimas 12 */
  const checkins = ((S as any).checkins ?? []) as any[];
  const porSemana = (f: (ini: number, fim: number) => number[]) => Array.from({ length: 12 }, (_, i) => {
    const fim = ate - (11 - i) * 7 * DAY, ini = fim - 7 * DAY;
    const xs = f(ini, fim);
    return xs.length >= 3 ? media(xs) : null;
  });
  const medidasDaSemana: [string, (number | null)[], number | undefined][] = [
    ['agua', porSemana((ini) => Array.from({ length: 7 }, (_, k) => aguaDoDia(S, +startOfDay(ini + k * DAY))).filter((v) => v > 0)), P.targets?.waterMl],
    ['proteina', porSemana((ini, fim) => checkins.filter((c) => c.t >= ini && c.t < fim && typeof c.prot === 'number' && c.prot > 0).map((c) => c.prot)), P.targets?.prot],
  ];
  for (const [nome, xs] of medidasDaSemana) {
    const esta = xs[xs.length - 1];
    const antes = xs.slice(0, -1).filter((v): v is number => v != null);
    if (esta == null || antes.length < 4 || esta <= Math.max(...antes)) continue;
    fora.push({
      area: 'constancia', tipo: 'melhorSemana', chave: `constancia:melhor:${nome}:${de}`, nivel: 'retrato', forca: 0.55,
      dados: { medida: nome, mediaDaSemana: Math.round(esta), melhorAntes: Math.round(Math.max(...antes)), semanasComparadas: antes.length + 1 },
    });
  }

  /* o dia da semana mais forte em proteína, nas 6 semanas */
  const porDia: number[][] = Array.from({ length: 7 }, () => []);
  for (const c of checkins) if (c.t >= ate - JANELA_SEMANAS * 7 * DAY && c.t < ate && typeof c.prot === 'number' && c.prot > 0) porDia[new Date(c.t).getDay()].push(c.prot);
  const comAmostra = porDia.map((xs, dia) => ({ dia, xs })).filter((x) => x.xs.length >= 3);
  if (comAmostra.length >= 5) {
    const geral = media(comAmostra.flatMap((x) => x.xs));
    const melhor = comAmostra.map((x) => ({ dia: x.dia, m: media(x.xs) })).sort((a, b) => b.m - a.m)[0];
    if (melhor.m >= geral * 1.2) {
      fora.push({
        area: 'constancia', tipo: 'diaMaisForte', chave: `constancia:dia:proteina:${melhor.dia}`, nivel: 'retrato', forca: 0.4,
        dados: { medida: 'proteina', diaDaSemana: melhor.dia, mediaDoDia: Math.round(melhor.m), mediaGeral: Math.round(geral) },
      });
    }
  }

  /* os dois que existem para quase todo mundo: a variação do peso no mês
     e a semana do tratamento */
  const pesos = pesosAte(S, ate).filter((w) => w.t >= ate - 30 * DAY);
  if (pesos.length >= 2) {
    fora.push({
      area: 'constancia', tipo: 'pesoNoMes', chave: `constancia:pesoNoMes:${de}`, nivel: 'retrato', forca: 0.05,
      dados: { variacaoKg: um(pesos[pesos.length - 1].kg - pesos[0].kg), dias: Math.round((pesos[pesos.length - 1].t - pesos[0].t) / DAY) },
    });
  }
  if (P.startT) {
    const semana = Math.floor((ate - P.startT) / (7 * DAY)) + 1;
    if (semana >= 1) {
      fora.push({
        area: 'constancia', tipo: 'semanaDoTratamento', chave: `constancia:semana:${semana}`, nivel: 'retrato', forca: 0.01,
        dados: { semanaDoTratamento: semana },
      });
    }
  }
  return fora;
}
