import type { State } from './seed';
import { M, temDose, doseDoPerfil, doseDiaria, adesao, adesaoSemConta, aguaDoDia, sintomasEm, clinicaConectada, temAcompanhamento, milestones, timelineEvents, comSinal, marcoQueEhEvento, type WeekMetric } from './derive';
import { paraTela } from './escalas';
import { pesoTxt, aguaTxt, aguaNoPasso, sistemaDe } from './medidas';
import { localAtual } from './local';
import { DAY, startOfDay, now } from './time';
import { semanaLida, noCalendario, type Candidata } from './descobertasDaSemana';
import { viaDoTratamento } from './resumoDaJornada';
import { T } from '../textos';

/* ============================================================
   O RESUMO DA SEMANA — o que a leitura de segunda LÊ

   Os 7 dias da semana lida (segunda a domingo, fechada), no formato e
   com as regras de `resumoDaJornada`: só o primeiro nome, nenhum dado de
   terceiros, nenhuma anotação livre, e nada que não aconteceu (sem
   registro, a linha não aparece).

   E a régua do MÍNIMO: com menos de 3 check-ins e nenhuma pesagem na
   semana, não há leitura — o card convida a registrar, e o servidor não é
   chamado. Ver docs/superpowers/specs/2026-10-01-leitura-da-semana-design.md.
   ============================================================ */

export const TETO_DO_RESUMO_DA_SEMANA = 6_000;

const data = (t: number) => {
  const d = new Date(t);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
const num = (v: number, casas = 1) => String(Math.round(v * 10 ** casas) / 10 ** casas);
const media = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

const respondido = (c: any) => c.fome != null || c.energia != null || typeof c.mood === 'number' || typeof c.nausea === 'number';

function daSemana(S: State, agora: Date) {
  const { de, ate } = semanaLida(agora);
  const dentro = (t: number) => t >= de && t < ate;
  const checkins = (((S as any).checkins ?? []) as any[]).filter((c) => dentro(c.t)).sort((a, b) => a.t - b.t);
  const pesos = (((S as any).weights ?? []) as any[]).filter((w) => dentro(w.t)).sort((a, b) => a.t - b.t);
  return { de, ate, checkins, pesos, respondidos: checkins.filter(respondido) };
}

/** Há registro bastante para uma leitura? 3 check-ins ou uma pesagem. */
export function temMinimoDaSemana(S: State, agora: Date = now()): boolean {
  const { respondidos, pesos } = daSemana(S, agora);
  return respondidos.length >= 3 || pesos.length >= 1;
}

function secao(titulo: string, linhas: (string | false | null | undefined)[]): string | null {
  const l = linhas.filter(Boolean) as string[];
  return l.length ? `## ${titulo}\n${l.join('\n')}` : null;
}

export function resumoDaSemana(S: State, agora: Date = now()): string {
  const P: any = S.profile;
  const { de, ate, checkins, pesos, respondidos } = daSemana(S, agora);
  const secoes: (string | null)[] = [];

  secoes.push(secao('Pessoa', [
    P.name ? `Primeiro nome: ${String(P.name).trim().split(/\s+/)[0]}` : null,
    `Semana lida: ${data(de)} a ${data(noCalendario(ate, -1))} (segunda a domingo)`,
    P.startT ? `Semana do tratamento: ${Math.floor((ate - P.startT) / (7 * DAY)) + 1}` : null,
    `Unidades: ${sistemaDe(S) === 'imperial' ? 'imperiais (lb, fl oz)' : 'métricas (kg, mL)'}`,
    `Idioma do aplicativo: ${localAtual()}`,
  ]));

  const med = M(S);
  const aplicacoes = (((S as any).injections ?? []) as any[]).filter((i) => i.t >= de && i.t < ate);
  /* ⚠️ "DOSES", E ERA "APLICAÇÕES", e a via vai dita (01/10/2026) — os
     motivos estão em resumoDaJornada, que escreve a mesma linha. */
  secoes.push(secao('Tratamento', [
    med && P.med !== 'indefinido' ? `Medicamento: ${med.label} (${med.mol})` : null,
    med && P.med !== 'indefinido' ? viaDoTratamento(S) : null,
    temDose(S) ? `Dose atual no perfil: ${doseDoPerfil(S)}` : null,
    aplicacoes.length
      ? `Doses na semana: ${aplicacoes.map((a) => `${data(a.t)}${a.dose != null ? ` ${num(a.dose, 2)} ${med?.unit ?? 'mg'}` : ''}`).join('; ')}`
      : 'Nenhuma dose registrada na semana',
    /* sem dia a contar na dose diária, sem a linha — e não "0%" (ver `adesaoSemConta`) */
    ((S as any).injections ?? []).length >= 2 && !adesaoSemConta(S) ? `Adesão desde o início: ${adesao(S)}%` : null,
  ]));

  const todosPesos = (((S as any).weights ?? []) as any[]).filter((w) => w.t < ate).sort((a, b) => a.t - b.t);
  const fim = pesos[pesos.length - 1];
  /* ⚠️ A MESMA BASE DO CARTÃO DA TELA (numerosDaSemana): a pesagem de antes
     só conta se estiver a até 14 dias da última da semana; senão, a
     primeira da semana. Com bases diferentes, a IA escrevia uma variação
     e o cartão logo acima mostrava outra (achado da revisão de
     01/10/2026). */
  const ultimaAntes = todosPesos.filter((w) => w.t < de).pop();
  const antes = ultimaAntes && fim && fim.t - ultimaAntes.t <= 14 * DAY ? ultimaAntes : null;
  const base = antes ?? (pesos.length >= 2 ? pesos[0] : null);
  secoes.push(secao('Peso', pesos.length ? [
    antes ? `Antes da semana: ${pesoTxt(S, antes.kg)} (${data(antes.t)})` : null,
    `No fim da semana: ${pesoTxt(S, fim.kg)} (${data(fim.t)})`,
    base ? `Variação na semana: ${fim.kg <= base.kg ? '-' : '+'}${pesoTxt(S, Math.abs(fim.kg - base.kg))}` : null,
    P.startWeight ? `Desde o início: ${fim.kg <= P.startWeight ? '-' : '+'}${pesoTxt(S, Math.abs(P.startWeight - fim.kg))}` : null,
    P.goalWeight ? `Meta: ${pesoTxt(S, P.goalWeight)}` : null,
  ] : ['Nenhuma pesagem na semana']));

  const escala = (vs: (number | null)[]) => { const xs = vs.filter((v): v is number => v != null); return xs.length ? `${num(media(xs))}/5` : null; };
  secoes.push(secao('Check-in', respondidos.length ? [
    `Dias com check-in: ${respondidos.length} de 7`,
    escala(respondidos.map((c) => paraTela(c.fome))) && `Fome média: ${escala(respondidos.map((c) => paraTela(c.fome)))}`,
    escala(respondidos.map((c) => paraTela(c.energia))) && `Energia média: ${escala(respondidos.map((c) => paraTela(c.energia)))}`,
    escala(respondidos.map((c) => (typeof c.mood === 'number' ? c.mood : null))) && `Humor médio: ${escala(respondidos.map((c) => (typeof c.mood === 'number' ? c.mood : null)))}`,
    respondidos.some((c) => typeof c.sono === 'number') && `Sono médio: ${num(media(respondidos.filter((c) => typeof c.sono === 'number').map((c) => c.sono)))} h`,
  ] : []));

  const sint = sintomasEm(respondidos);
  secoes.push(secao('Sintomas da semana', respondidos.length ? [
    sint.length ? sint.map((s) => `${s.label} em ${s.dias} dia(s), pior ${s.pior}/5 (${s.legenda})`).join('; ') : 'Nenhum sintoma marcado nos dias respondidos',
  ] : []));

  const alvo = P.targets ?? {};
  const prots = checkins.map((c) => c.prot).filter((v): v is number => typeof v === 'number' && v > 0);
  const aguas = Array.from({ length: 7 }, (_, k) => aguaDoDia(S, noCalendario(de, k))).filter((v) => v > 0);
  const refeicoes = (((S as any).meals ?? []) as any[]).filter((m) => m.t >= de && m.t < ate).length;
  secoes.push(secao('Alimentação e água', [
    prots.length ? `Proteína média em ${prots.length} dia(s) com registro: ${Math.round(media(prots))} g${alvo.prot ? ` (meta ${alvo.prot} g)` : ''}` : null,
    aguas.length ? `Água média em ${aguas.length} dia(s) com registro: ${aguaTxt(S, media(aguas))}${alvo.waterMl ? ` (meta ${aguaTxt(S, alvo.waterMl)})` : ''}` : null,
    refeicoes ? `Refeições registradas: ${refeicoes}` : null,
  ]));

  const treinos = checkins.filter((c) => (c.exerc ?? 0) > 0);
  secoes.push(secao('Exercício', treinos.length
    ? [`Treinos na semana: ${treinos.length} dia(s), ${treinos.reduce((a, c) => a + c.exerc, 0)} min no total`]
    : checkins.length ? ['Nenhum treino registrado na semana'] : []));

  secoes.push(secao('Acompanhamento', [
    clinicaConectada(S) ? 'Tem clínica parceira conectada no aplicativo'
      : temAcompanhamento(S) ? 'Tem acompanhamento médico próprio'
        : 'Não registrou acompanhamento médico',
  ]));

  const texto = secoes.filter(Boolean).join('\n\n');
  return texto.length > TETO_DO_RESUMO_DA_SEMANA ? `${texto.slice(0, TETO_DO_RESUMO_DA_SEMANA)}\n(resumo cortado no teto)` : texto;
}

/** Os números de uma semana (de segunda 00h a domingo), para a tela do
    resumo (app/leitura): calculados aqui, e não pela IA, e por isso
    aparecem antes de o texto chegar. O peso é a variação contra a última
    pesagem antes da semana (ou a primeira dela); sem duas pesagens, nulo. */
export function numerosDaSemana(S: State, semana: number) {
  /* ⚠️ A SEMANA PELO CALENDÁRIO (ver noCalendario, em
     descobertasDaSemana/dias). E a segunda é refeita a partir da chave:
     leituras guardadas antes dessa correção, numa semana de horário de
     verão, têm a chave às 23h do domingo ou à 01h da segunda — meio dia
     depois cai sempre na segunda certa. */
  const de = +startOfDay(semana + 12 * 3600e3);
  const ate = noCalendario(de, 7);
  const dentro = (t: number) => t >= de && t < ate;
  const P: any = S.profile;
  const todos = (((S as any).weights ?? []) as any[]).filter((w) => w.t < ate).sort((a, b) => a.t - b.t);
  const pesos = todos.filter((w) => dentro(w.t));
  const fim = pesos[pesos.length - 1];
  /* ⚠️ A PESAGEM DE ANTES SÓ SERVE DE BASE SE ESTIVER PERTO — até 14
     dias da última da semana, a mesma régua do detector pesoSemanal.
     Mais velha que isso, a variação seria de meses, e o cartão a
     mostraria como se fosse da semana (achado da revisão de 01/10/2026). */
  const ultimaAntes = todos.filter((w) => w.t < de).pop();
  const antes = ultimaAntes && fim && fim.t - ultimaAntes.t <= 14 * DAY ? ultimaAntes : null;
  const base = antes ?? (pesos.length >= 2 ? pesos[0] : null);
  const checkins = (((S as any).checkins ?? []) as any[]).filter((c) => dentro(c.t));
  const prots = checkins.map((c) => c.prot).filter((v): v is number => typeof v === 'number' && v > 0);
  const aguas = Array.from({ length: 7 }, (_, k) => aguaDoDia(S, noCalendario(de, k))).filter((v) => v > 0);
  return {
    /* Os sete dias, de segunda a domingo, também pelo calendário. */
    dias: diasDoPeriodo(S, de, ate),
    deltaKg: base && fim && base !== fim ? fim.kg - base.kg : null as number | null,
    diasComCheckin: checkins.filter(respondido).length,
    treinos: checkins.filter((c) => (c.exerc ?? 0) > 0).length,
    minutosDeExercicio: checkins.reduce((a, c) => a + (c.exerc ?? 0), 0),
    proteinaMedia: prots.length ? media(prots) : null,
    metaProteina: (P.targets?.prot as number) || null,
    aguaMedia: aguas.length ? media(aguas) : null,
    metaAgua: (P.targets?.waterMl as number) || null,
  };
}

/** OS NÚMEROS DA SEMANA NO FORMATO DO ACORDEÃO DA JORNADA (01/10/2026,
    pedido do dono): peso, hidratação, proteína e exercício, cada um
    contra a semana anterior, com os mesmos rótulos (T.home.semana) e o
    mesmo desenho (ui/semanaEmNumeros).

    ⚠️ AS CONTAS SÃO AS DESTE ARQUIVO, e não as do acordeão: a semana
    aqui é de segunda a domingo e a de lá é de uma aplicação à outra, e a
    água daqui soma a da comida (aguaDoDia, a mesma da tela de água). O
    que as duas telas dividem é a pergunta e a forma.

    E SÓ O QUE HOUVE: sem pesagem para comparar, o peso não entra; sem
    registro de água ou de proteína, a linha não entra; o exercício entra
    com qualquer check-in, porque "0 min" num dia respondido é resposta. */
export function metricasDaSemana(S: State, semana: number): WeekMetric[] {
  const W = T.home.semana;
  const n = numerosDaSemana(S, semana);
  const a = numerosDaSemana(S, noCalendario(+startOfDay(semana + 12 * 3600e3), -7));
  const out: WeekMetric[] = [];
  if (n.deltaKg != null) {
    /* Zero não tem sinal, como no acordeão: "−0,0 kg" afirmaria uma queda. */
    const valor = Math.abs(n.deltaKg) < 0.05 ? pesoTxt(S, 0) : `${n.deltaKg < 0 ? '−' : '+'}${pesoTxt(S, Math.abs(n.deltaKg))}`;
    out.push({ ic: 'scale', label: W.pesoMetrica, valor, delta: null, good: valor.startsWith('−') });
  }
  /* Cada variação sai dos valores como são escritos, com o zero sem sinal
     (comSinal e aguaNoPasso, as mesmas regras do acordeão). */
  if (n.aguaMedia != null) {
    const agua = aguaNoPasso(S, n.aguaMedia);
    const d = a.aguaMedia == null ? null : agua - aguaNoPasso(S, a.aguaMedia);
    out.push({
      ic: 'water', label: W.hidratacao, valor: W.aguaPorDia(aguaTxt(S, agua)),
      delta: d == null ? null : comSinal(d, (v) => aguaTxt(S, v)),
      good: d == null || d >= 0,
    });
  }
  if (n.proteinaMedia != null) {
    const d = a.proteinaMedia == null ? null : Math.round(n.proteinaMedia) - Math.round(a.proteinaMedia);
    out.push({
      ic: 'leaf', label: W.proteina, valor: W.gramasPorDia(Math.round(n.proteinaMedia)),
      delta: d == null ? null : W.deltaGramas(comSinal(d, String)),
      good: d == null || d >= 0,
    });
  }
  if (n.diasComCheckin || n.minutosDeExercicio) {
    const antes = a.diasComCheckin || a.minutosDeExercicio ? a.minutosDeExercicio : null;
    const d = antes == null ? null : n.minutosDeExercicio - antes;
    out.push({
      ic: 'dumbbell', label: W.exercicioMetrica, valor: W.minutos(n.minutosDeExercicio),
      delta: d == null ? null : W.deltaMinutos(comSinal(d, String)),
      good: d == null || d >= 0,
    });
  }
  return out;
}

/* ============================================================
   UM PERÍODO QUALQUER — a semana de segunda a domingo ou o ciclo
   ============================================================

   A tela do resumo da semana (app/leitura) abre dos dois jeitos
   (01/10/2026, pedido do dono): pelo Insights e pela Home, a semana de
   segunda a domingo que a IA leu; pelo "Ver detalhes" da Jornada, o
   ciclo de uma aplicação à outra (timelineWeeks). As peças abaixo servem
   aos dois — `ini` às 00h e `fim` exclusivo, que pode ser Infinity no
   ciclo que ainda não fechou. */

/** Os dias do período, pelo calendário, até `ate` (exclusivo): se houve
    check-in respondido, treino e pesagem em cada um. */
export function diasDoPeriodo(S: State, ini: number, ate: number) {
  const checkins = ((S as any).checkins ?? []) as any[];
  const pesos = ((S as any).weights ?? []) as any[];
  const dias: { t: number; checkin: boolean; treino: boolean; pesagem: boolean }[] = [];
  for (let k = 0; noCalendario(ini, k) < ate; k++) {
    const t = noCalendario(ini, k);
    const fimDoDia = noCalendario(ini, k + 1);
    const noDia = (x: number) => x >= t && x < fimDoDia;
    const doDia = checkins.filter((c) => noDia(c.t));
    dias.push({
      t,
      checkin: doDia.some(respondido),
      treino: doDia.some((c) => (c.exerc ?? 0) > 0),
      pesagem: pesos.some((w) => noDia(w.t)),
    });
  }
  return dias;
}

/** A janela de um ciclo da Jornada: da aplicação até a véspera da
    próxima — a mesma de timelineWeeks, que é a do acordeão. O ciclo que
    não fechou vai até hoje, ou até o sétimo dia, o que vier depois.
    `semanas` vem como timelineWeeks devolve: da mais nova à mais velha. */
export function janelaDoCiclo<W extends { t: number }>(semanas: W[], w: W) {
  const i = semanas.indexOf(w);
  const ini = +startOfDay(w.t);
  const fim = i > 0 ? +startOfDay(semanas[i - 1].t) : Infinity;
  const ultimoDia = Number.isFinite(fim) ? noCalendario(fim, -1) : Math.max(noCalendario(ini, 6), +startOfDay(now()));
  return { ini, fim, ultimoDia };
}

/** O ciclo da Jornada que contém a maior parte de uma semana de segunda a
    domingo (`segunda`, a chave de uma leitura). É ele que o "Resumo da
    semana" do Insights abre (app/leitura): a mesma tela, da mesma semana,
    que o "Ver detalhes" do acordeão. No empate, o mais recente.

    ⚠️ SÓ COM 4 DIAS OU MAIS, ou nulo — e aí a tela fica na semana de
    segunda a domingo. Com medicação diária (Saxenda, Victoza, Rybelsus),
    cada aplicação abria um "ciclo" de um dia, e o Insights abria o resumo
    de um domingo só (achado da revisão de 01/10/2026). Com aplicação
    semanal, um dos dois ciclos que dividem a semana sempre tem 4.

    ⚠️ E DESDE A PARTE B2 (01/10/2026) A DOSE DIÁRIA TAMBÉM TEM CICLOS DE
    SETE DIAS: os blocos da semana do tratamento (`timelineWeeks`, em
    derive). Um dos dois blocos que dividem a semana de segunda a domingo
    sempre tem 4 dias, e o resumo do diário passa a abrir a semana do
    tratamento, como o da caneta. */
export function cicloQueCobre<W extends { t: number }>(semanas: W[], segunda: number): W | null {
  const seg = +startOfDay(segunda + 12 * 3600e3);
  let melhor: W | null = null;
  let maior = 0;
  for (const w of semanas) {
    const { ini, fim } = janelaDoCiclo(semanas, w);
    let dentro = 0;
    for (let k = 0; k < 7; k++) { const d = noCalendario(seg, k); if (d >= ini && d < fim) dentro++; }
    if (dentro > maior) { maior = dentro; melhor = w; }
  }
  return maior >= 4 ? melhor : null;
}

/** O que aconteceu no período, para o "dia a dia": os registros da linha
    do tempo, menos a aplicação — que abre o ciclo e já está no topo, e
    na semana de segunda a domingo está nos destaques. É o recorte de
    timelineWeeks, que era o da tela da semana. */
export const eventosDoPeriodo = (S: State, ini: number, fim: number) =>
  timelineEvents(S).filter((e) => e.day >= ini && e.day < fim && e.kind !== 'aplicacao');

/** O QUE MARCOU A SEMANA, como no acordeão: as conquistas e os
    acontecimentos que não são rotina. Na semana de segunda a domingo
    entra também a aplicação — no ciclo ela é o cabeçalho, e numa semana
    de calendário ela é um acontecimento como outro qualquer. A cor vem
    como nome de token; quem desenha resolve. */
export function destaquesDaSemana(S: State, semana: number) {
  const de = +startOfDay(semana + 12 * 3600e3);
  /* ⚠️ SEM A LINHA DE CADA DOSE NA DOSE DIÁRIA (01/10/2026, achado da
     revisão): sete comprimidos viravam sete linhas iguais em "o que marcou
     a semana" — rotina, e não acontecimento. A dose nova continua, pelo
     marco "dose ajustada". O semanal fica como era. */
  return destaquesDoPeriodo(S, de, noCalendario(de, 7), !doseDiaria(S));
}

export function destaquesDoPeriodo(S: State, de: number, ate: number, comAplicacao: boolean): { k: string; ic: string; cor: string; titulo: string; sub: string }[] {
  const dentro = (t: number) => t >= de && t < ate;
  /* ⚠️ SEM REPETIR (achado da revisão de 01/10/2026): a consulta e o exame
     são marco e acontecimento ao mesmo tempo, e apareciam duas vezes — fica
     o acontecimento. E no dia em que a dose mudou, o marco "dose ajustada"
     já conta a aplicação; a linha da aplicação sai. */
  const marcos = milestones(S).filter((m) => dentro(m.t) && !marcoQueEhEvento(m));
  const diasDeDoseNova = new Set(marcos.filter((m) => m.to === '/aplicacoes').map((m) => +startOfDay(m.t)));
  const itens = [
    ...marcos.map((m) => ({ t: m.t, k: `m-${m.t}-${m.title}`, ic: m.ic, cor: 'lime', titulo: m.title, sub: m.sub })),
    ...timelineEvents(S)
      .filter((e) => dentro(e.day) && (e.kind === 'consulta' || e.kind === 'exame' || (comAplicacao && e.kind === 'aplicacao' && !diasDeDoseNova.has(e.day))))
      .map((e) => ({ t: e.day, k: e.key, ic: e.ic, cor: e.color, titulo: e.title, sub: e.sub })),
  ];
  /* Em ordem de data, os dois tipos juntos: eram os marcos do mais novo
     ao mais velho e os acontecimentos ao contrário, no mesmo cartão. */
  return itens.sort((x, y) => x.t - y.t || x.titulo.localeCompare(y.titulo)).map(({ t, ...resto }) => resto);
}

/* A descoberta como vai ao servidor: os números como vieram, as datas
   escritas, e o dia da semana por extenso. A IA não calcula nada. */
const DIAS_DA_SEMANA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
/* ⚠️ NAS UNIDADES DA PESSOA. A regra da leitura é usar os números como
   vieram — e eles vinham em kg para quem lê em libras (a Emily da
   avaliação recebeu "5.1 kg"). A conversão é daqui, e não da IA. */
const LB_POR_KG = 2.20462;
export function descobertaParaLeitura(c: Candidata, S?: State) {
  const libras = !!S && sistemaDe(S) === 'imperial';
  const dados: Record<string, number | string | boolean> = {};
  for (const [k, v] of Object.entries(c.dados)) {
    if (libras && typeof v === 'number' && /Kg(Semana)?$/.test(k)) dados[k.replace(/Kg(Semana)?$/, 'Lb$1')] = Math.round(v * LB_POR_KG * 10) / 10;
    else if (/^data/.test(k) && typeof v === 'number') dados[k] = data(v);
    else if (k === 'diaDaSemana' && typeof v === 'number') dados[k] = DIAS_DA_SEMANA[v];
    else dados[k] = v;
  }
  return { nivel: c.nivel, area: c.area, tipo: c.tipo, dados };
}
