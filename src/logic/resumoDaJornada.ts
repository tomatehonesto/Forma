import type { State } from './seed';
import {
  M, temDose, doseDoPerfil, curWeight, startWeight, lostKg, lostPct, lastInjection,
  nextInjectionDate, adesao, cadenciaDias, aguaDoDia, sintomasEm, clinicaConectada,
  temAcompanhamento,
} from './derive';
import { ENERGIA, FOME, HUMOR, SINTOMAS_LIDOS, grauDoSintoma, paraTela } from './escalas';
import { pesoTxt, aguaTxt, sistemaDe } from './medidas';
import { localAtual } from './local';
import { now, startOfDay, daysAgo, diffDays } from './time';

/* ============================================================
   O RESUMO DA JORNADA — o que a conversa do Morphi Intelligence LÊ

   A cada pergunta, o aplicativo manda ao servidor (servidor/api/conversa)
   este texto, e o modelo responde a partir dele. Ver a especificação,
   docs/superpowers/specs/2026-09-29-morphi-intelligence-design.md.

   ⚠️ É O QUE ELA LÊ, E NÃO O QUE ELA RESPONDE. O resumo vai inteiro
   porque o aplicativo não sabe de antemão o que é relevante — o enjoo
   da semana só se explica vendo a dose e a água —, e é o prompt que
   manda a resposta falar só do que foi perguntado.

   ⚠️ É PARA O MODELO, E NÃO PARA A TELA, e por isso não passa pelo
   catálogo de textos: os rótulos das seções são fixos, em português, e
   o modelo responde no idioma da pessoa de qualquer jeito. Os NOMES de
   sintomas e de graus vêm do catálogo, no idioma do aplicativo, porque
   são as palavras que a pessoa escolheu ao responder.

   ⚠️ SAI DAS FUNÇÕES DE `derive`, e não de uma segunda leitura do
   estado: a conversa e a tela não podem discordar sobre o mesmo número.

   ⚠️ NENHUM DADO DE TERCEIROS E NENHUMA IDENTIFICAÇÃO além do primeiro
   nome. Sem sobrenome, sem e-mail, sem o nome de quem acompanha ou da
   clínica, e sem notas livres (`notes`, `consultNotes`), que podem citar
   outras pessoas. O modelo não precisa disso para responder, e é dado
   que sai do aparelho.

   ⚠️ NENHUMA SEÇÃO AFIRMA O QUE NÃO ACONTECEU. Sem dado, a seção não
   aparece. Nunca "sem sintomas": ausência de registro não é ausência de
   sintoma, e o prompt manda o modelo dizer exatamente isso.
   ============================================================ */

/** O teto do resumo, em caracteres (cerca de 2.500 tokens). O servidor
    recusa acima de 24 mil; este fica bem abaixo. */
export const TETO_DO_RESUMO = 10_000;

const data = (t: number) => {
  const d = new Date(t);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
const haQuanto = (t: number) => {
  const n = diffDays(now(), new Date(t));
  return n <= 0 ? 'hoje' : n === 1 ? 'ontem' : `há ${n} dias`;
};
const num = (v: number, casas = 1) => String(Math.round(v * 10 ** casas) / 10 ** casas);

function secao(titulo: string, linhas: (string | false | null | undefined)[]): string | null {
  const l = linhas.filter(Boolean) as string[];
  return l.length ? `## ${titulo}\n${l.join('\n')}` : null;
}

export function resumoDaJornada(S: State): string {
  const P = S.profile as any;
  const agora = +now();
  const secoes: (string | null)[] = [];

  /* A PESSOA — só o primeiro nome, e o que muda a leitura dos números. */
  secoes.push(secao('Pessoa', [
    `Hoje: ${data(agora)}`,
    P.name ? `Primeiro nome: ${String(P.name).trim().split(/\s+/)[0]}` : null,
    P.height ? `Altura: ${num(P.height, 2)} m` : null,
    `Unidades: ${sistemaDe(S) === 'imperial' ? 'imperiais (lb, fl oz)' : 'métricas (kg, mL)'}`,
    `Idioma do aplicativo: ${localAtual()}`,
    P.startT ? `Começou o tratamento em ${data(P.startT)} (${haQuanto(P.startT)})` : null,
  ]));

  /* O TRATAMENTO — o medicamento, a dose, e a história das doses pelas
     aplicações registradas. */
  const med = M(S);
  const injs = ((S as any).injections ?? []) as { t: number; dose?: number; site?: string }[];
  const mudancas: string[] = [];
  let doseAnterior: number | undefined;
  for (const i of injs) {
    if (i.dose != null && i.dose !== doseAnterior) {
      mudancas.push(`${data(i.t)}: ${num(i.dose, 2)} ${med?.unit ?? 'mg'}`);
      doseAnterior = i.dose;
    }
  }
  const ultima = lastInjection(S) as any;
  secoes.push(secao('Tratamento', [
    med && P.med !== 'indefinido' ? `Medicamento: ${med.label} (${med.mol})` : 'Medicamento: ainda não informado',
    med && P.med !== 'indefinido' ? `Frequência: ${cadenciaDias(S) === 1 ? 'diária' : cadenciaDias(S) === 7 ? 'semanal' : `a cada ${cadenciaDias(S)} dias`}` : null,
    temDose(S) ? `Dose atual no perfil: ${doseDoPerfil(S)}` : 'Dose: ainda não informada',
    injs.length ? `Aplicações registradas: ${injs.length}${injs.length >= 2 ? ` (adesão ${adesao(S)}%)` : ''}` : 'Nenhuma aplicação registrada ainda',
    mudancas.length > 1 ? `Doses ao longo do tempo (data da primeira aplicação em cada dose): ${mudancas.join('; ')}` : null,
    ultima ? `Última aplicação: ${data(ultima.t)} (${haQuanto(ultima.t)})${ultima.dose != null ? `, ${num(ultima.dose, 2)} ${med?.unit ?? 'mg'}` : ''}` : null,
    ultima ? `Próxima aplicação prevista: ${data(+nextInjectionDate(S))}` : null,
  ]));

  /* O PESO — de onde partiu, onde está, a meta e as últimas pesagens. */
  const pesos = ((S as any).weights ?? []) as { t: number; kg: number }[];
  secoes.push(secao('Peso', pesos.length ? [
    startWeight(S) ? `Peso inicial: ${pesoTxt(S, startWeight(S))}` : null,
    `Peso mais recente: ${pesoTxt(S, curWeight(S))} (${data(pesos[pesos.length - 1].t)})`,
    startWeight(S) && pesos.length >= 2 ? `Variação desde o início: ${lostKg(S) >= 0 ? '-' : '+'}${pesoTxt(S, Math.abs(lostKg(S)))} (${num(Math.abs(lostPct(S)))}% ${lostKg(S) >= 0 ? 'a menos' : 'a mais'})` : null,
    P.goalWeight ? `Meta: ${pesoTxt(S, P.goalWeight)}` : null,
    `Últimas pesagens: ${pesos.slice(-12).map((w) => `${data(w.t)} ${pesoTxt(S, w.kg)}`).join('; ')}`,
  ] : [
    startWeight(S) ? `Peso informado no cadastro: ${pesoTxt(S, startWeight(S))}` : null,
    P.goalWeight ? `Meta: ${pesoTxt(S, P.goalWeight)}` : null,
    'Nenhuma pesagem registrada ainda',
  ]));

  /* OS SINTOMAS — dia a dia, das últimas 4 semanas, só nos dias em que a
     pergunta foi respondida; e o resumo de cada um. */
  const desde = +startOfDay(daysAgo(27));
  const cks = (((S as any).checkins ?? []) as any[]).filter((c) => c.t >= desde).sort((a, b) => a.t - b.t);
  const lidos = SINTOMAS_LIDOS();
  const diaADia = cks.map((c) => {
    const s = lidos
      .map((x) => ({ x, g: grauDoSintoma(c, x.id) }))
      .filter((y) => y.g != null)
      .map(({ x, g }) => `${x.label} ${g}/5 (${x.regua[(g as number) - 1] ?? ''})`);
    if (c.outroTexto) s.push(`outro: ${String(c.outroTexto).slice(0, 80)}`);
    return s.length ? `${data(c.t)}: ${s.join(', ')}` : null;
  }).filter(Boolean) as string[];
  const respondidos = cks.filter((c) => typeof c.nausea === 'number' || c.gut != null || !!c.sint).length;
  const resumoSint = sintomasEm(cks);
  secoes.push(secao('Sintomas (últimas 4 semanas)', respondidos ? [
    `Dias em que a pergunta de sintomas foi respondida: ${respondidos}`,
    resumoSint.length
      ? `Resumo: ${resumoSint.map((s) => `${s.label} em ${s.dias} dia(s), pior ${s.pior}/5`).join('; ')}`
      : 'Nenhum sintoma marcado nos dias respondidos',
    ...diaADia,
  ] : []));

  /* O CHECK-IN — fome, energia, humor e sono, das últimas 2 semanas. */
  const desde14 = +startOfDay(daysAgo(13));
  const escala = (v: any, r: string[]) => {
    const g = paraTela(v);
    return g ? `${g}/5 (${r[g - 1] ?? ''})` : null;
  };
  const checkin = cks.filter((c) => c.t >= desde14).map((c) => {
    const partes = [
      c.fome != null && escala(c.fome, FOME()) ? `fome ${escala(c.fome, FOME())}` : null,
      c.energia != null && escala(c.energia, ENERGIA()) ? `energia ${escala(c.energia, ENERGIA())}` : null,
      typeof c.mood === 'number' ? `humor ${c.mood}/5 (${HUMOR()[c.mood - 1] ?? ''})` : null,
      typeof c.sono === 'number' ? `sono ${num(c.sono)} h` : null,
    ].filter(Boolean);
    return partes.length ? `${data(c.t)}: ${partes.join(', ')}` : null;
  }).filter(Boolean) as string[];
  secoes.push(secao('Check-in (últimas 2 semanas)', checkin));

  /* A ALIMENTAÇÃO E A ÁGUA — médias de 14 dias contra a meta, e as
     refeições dos últimos 3 dias. As médias contam só os dias com
     registro, e dizem quantos foram. */
  const alvo = P.targets ?? {};
  const todos = ((S as any).checkins ?? []) as any[];
  const dias14 = Array.from({ length: 14 }, (_, i) => +startOfDay(daysAgo(i)));
  const protDias = dias14.map((t) => todos.find((c) => c.t === t)?.prot).filter((v): v is number => typeof v === 'number' && v > 0);
  const aguaDias = dias14.map((t) => aguaDoDia(S, t)).filter((v) => v > 0);
  const media = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const refeicoes = (((S as any).meals ?? []) as any[])
    .filter((m) => m.t >= +startOfDay(daysAgo(2)))
    .sort((a, b) => a.t - b.t)
    .map((m) => `${data(m.t)} ${m.name ?? 'refeição'}: ${String(m.tag ?? '').slice(0, 120)}${typeof m.g === 'number' ? ` (${Math.round(m.g)} g de proteína)` : ''}`);
  secoes.push(secao('Alimentação e água', [
    alvo.prot ? `Meta de proteína: ${alvo.prot} g/dia` : null,
    protDias.length ? `Proteína média nos ${protDias.length} dia(s) com registro, das últimas 2 semanas: ${Math.round(media(protDias))} g` : 'Nenhuma proteína registrada nas últimas 2 semanas',
    alvo.waterMl ? `Meta de água: ${aguaTxt(S, alvo.waterMl)}/dia` : null,
    aguaDias.length ? `Água média nos ${aguaDias.length} dia(s) com registro, das últimas 2 semanas: ${aguaTxt(S, media(aguaDias))}` : 'Nenhuma água registrada nas últimas 2 semanas',
    aguaDias.length ? `Água por dia: ${dias14.slice().reverse().map((t) => { const v = aguaDoDia(S, t); return v > 0 ? `${data(t)} ${aguaTxt(S, v)}` : null; }).filter(Boolean).join('; ')}` : null,
    refeicoes.length ? `Refeições dos últimos 3 dias:\n${refeicoes.map((r) => `- ${r}`).join('\n')}` : null,
  ]));

  /* O EXERCÍCIO — minutos das últimas 2 semanas. */
  const exerc = dias14.slice().reverse()
    .map((t) => { const c = todos.find((x) => x.t === t); return c?.exerc > 0 ? `${data(t)} ${c.exerc} min` : null; })
    .filter(Boolean) as string[];
  secoes.push(secao('Exercício (últimas 2 semanas)', exerc.length ? [exerc.join('; ')] : []));

  /* OS EXAMES — cada marcador com os valores e as datas. */
  const exames = ((S as any).exams ?? []) as { marker: string; unit: string; ref?: string; values?: { t: number; v: number }[] }[];
  secoes.push(secao('Exames', exames
    .filter((e) => e.values?.length)
    .map((e) => `${e.marker}${e.ref ? ` (referência ${e.ref} ${e.unit})` : ''}: ${e.values!.slice().sort((a, b) => a.t - b.t).map((v) => `${data(v.t)} ${num(v.v, 2)} ${e.unit}`).join('; ')}`)));

  /* A EQUIPE — só o tipo, sem nomes de terceiros. */
  secoes.push(secao('Acompanhamento', [
    clinicaConectada(S) ? 'Tem clínica parceira conectada no aplicativo'
      : temAcompanhamento(S) ? 'Tem acompanhamento médico próprio'
        : 'Não registrou acompanhamento médico',
  ]));

  const texto = secoes.filter(Boolean).join('\n\n');
  return texto.length > TETO_DO_RESUMO ? `${texto.slice(0, TETO_DO_RESUMO)}\n(resumo cortado no teto)` : texto;
}

