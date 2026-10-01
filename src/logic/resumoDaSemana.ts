import type { State } from './seed';
import { M, temDose, doseDoPerfil, adesao, aguaDoDia, sintomasEm, clinicaConectada, temAcompanhamento } from './derive';
import { paraTela } from './escalas';
import { pesoTxt, aguaTxt, sistemaDe } from './medidas';
import { localAtual } from './local';
import { DAY, startOfDay, now } from './time';
import { semanaLida, type Candidata } from './descobertasDaSemana';

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
    `Semana lida: ${data(de)} a ${data(ate - DAY)} (segunda a domingo)`,
    P.startT ? `Semana do tratamento: ${Math.floor((ate - P.startT) / (7 * DAY)) + 1}` : null,
    `Unidades: ${sistemaDe(S) === 'imperial' ? 'imperiais (lb, fl oz)' : 'métricas (kg, mL)'}`,
    `Idioma do aplicativo: ${localAtual()}`,
  ]));

  const med = M(S);
  const aplicacoes = (((S as any).injections ?? []) as any[]).filter((i) => i.t >= de && i.t < ate);
  secoes.push(secao('Tratamento', [
    med && P.med !== 'indefinido' ? `Medicamento: ${med.label} (${med.mol})` : null,
    temDose(S) ? `Dose atual no perfil: ${doseDoPerfil(S)}` : null,
    aplicacoes.length
      ? `Aplicações na semana: ${aplicacoes.map((a) => `${data(a.t)}${a.dose != null ? ` ${num(a.dose, 2)} ${med?.unit ?? 'mg'}` : ''}`).join('; ')}`
      : 'Nenhuma aplicação registrada na semana',
    ((S as any).injections ?? []).length >= 2 ? `Adesão desde o início: ${adesao(S)}%` : null,
  ]));

  const todosPesos = (((S as any).weights ?? []) as any[]).filter((w) => w.t < ate).sort((a, b) => a.t - b.t);
  const antes = todosPesos.filter((w) => w.t < de).pop();
  const fim = pesos[pesos.length - 1];
  secoes.push(secao('Peso', pesos.length ? [
    antes ? `Antes da semana: ${pesoTxt(S, antes.kg)} (${data(antes.t)})` : null,
    `No fim da semana: ${pesoTxt(S, fim.kg)} (${data(fim.t)})`,
    antes ? `Variação na semana: ${fim.kg <= antes.kg ? '-' : '+'}${pesoTxt(S, Math.abs(fim.kg - antes.kg))}` : null,
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
  const aguas = Array.from({ length: 7 }, (_, k) => aguaDoDia(S, +startOfDay(de + k * DAY))).filter((v) => v > 0);
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
