import { T } from '../textos';
import type { State } from './seed';
import {
  M, curWeight, medComDose, respostaNoDia, siteLabel, variacaoDe, aguaDoDia,
  doseDiaria, diasComDoseDesde, trechosDeDose,
} from './derive';
import { MEDS } from './meds';
import { localDaDose } from './formas';
import { dataComAno, now, nf, doseTxt, startOfDay } from './time';
import { pesoTxt, pesoV, pesoU, compTxt, aguaTxt } from './medidas';
import { resumoDoTratamento } from './resumo';
import {
  documento, esc, hojeIso, compartilharPdf, graficoDeLinha, dataDeTabela, blocoDeSintomas, tabelaDeExames,
  type ResultadoDoPdf,
} from './pdf';

/* ============================================================
   O RELATÓRIO DO TRATAMENTO — o PDF de /exportar

   ⚠️ EXPORTAR ENTREGAVA UM .JSON (29/09/2026, pedido do dono: "tem que
   vir um PDF, e bonito, com as informações organizadas"). O JSON
   continua existindo — é a portabilidade que a LGPD pede, em formato que
   outro aplicativo lê, e a Política promete —, mas passou a ser a segunda
   opção. A primeira é este relatório: o que a pessoa leva para a consulta,
   imprime ou guarda para si.

   Ele obedece à mesma tela que o JSON: o período escolhido e os
   interruptores de "o que entra". Nada entra que ela tenha tirado.

   A ORDEM É A DE QUEM LÊ: primeiro os números que resumem o período,
   depois a curva do peso, depois o detalhe — medidas, doses, sintomas,
   exames —, e no fim o que ela escreveu. Hábitos entram como
   médias, e não como a lista de cada copo d'água: num papel, a lista de
   cem refeições é ruído.
   ============================================================ */

export type RecorteDoRelatorio = { desde: number; inclui: Record<string, boolean> };

/* ⚠️ É UM PDF SÓ PARA O MÉDICO (29/09/2026, pedido do dono). O resumo
   para a consulta tinha o seu PDF curto, e /exportar o relatório; eram
   dois papéis parecidos para a mesma pessoa. Ficou este, com a medicação
   que só o resumo tinha, e ele sai do Resumo para consulta com um toque —
   com o recorte abaixo — ou de /pdf-consulta, onde a pessoa ajusta. */
export const INCLUI_PADRAO = { aplicacoes: true, peso: true, sintomas: true, exames: true, notas: true, habitos: false };

/** Desde a última consulta — é a pergunta que a consulta faz: o que
    aconteceu desde a última vez. Sem consulta anterior, o tratamento
    inteiro. */
export function recortePadrao(S: State): RecorteDoRelatorio {
  const ultima = ((S as any).consultsHistory as any[] | undefined)?.[0]?.t;
  return { desde: ultima ?? S.profile.startT, inclui: { ...INCLUI_PADRAO } };
}

const secao = (titulo: string, conteudo: string, nota?: string, inteira = true) => `
  <section${inteira ? ' class="inteira"' : ''}>
    <h2>${esc(titulo)}</h2>${nota ? `<p class="nota">${esc(nota)}</p>` : ''}
    ${conteudo}
  </section>`;

const tabela = (cab: { t: string; num?: boolean }[], linhas: string[][]) => `
  <table>
    <thead><tr>${cab.map((c) => `<th${c.num ? ' class="num"' : ''}>${esc(c.t)}</th>`).join('')}</tr></thead>
    <tbody>${linhas.map((l) => `<tr>${l.map((v, i) => `<td${cab[i]?.num ? ' class="num"' : ''}>${v}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>`;

/* ⚠️ QUANTAS LINHAS DE DOSE O PAPEL AGUENTA ANTES DE RESUMIR (02/10/2026,
   parte B5 de docs/superpowers/specs/2026-10-01-oral-e-diario-design.md).
   Catorze é o que a caneta semanal enche em três meses e o comprimido em
   duas semanas: até aí, uma linha por dose ainda se lê e diz mais (a
   hora, a dose de cada dia). Passou disso, quem toma todo dia recebe o
   resumo por dose — e só quem toma todo dia: o semanal continua com a
   lista, como sempre. A tela de ajuste (app/pdf-consulta) pergunta isto
   também, para a linha dela dizer o que vai sair. */
export const LINHAS_DE_DOSE = 14;
export const dosesEmResumo = (S: State, quantas: number) => doseDiaria(S) && quantas > LINHAS_DE_DOSE;

const cartao = (rot: string, val: string, sub?: string) => `
  <div class="cartao"><div class="rot">${esc(rot)}</div><div class="val">${esc(val)}</div>${sub ? `<div class="sub">${esc(sub)}</div>` : ''}</div>`;

/** O HTML do relatório — separado do envio para a sonda poder lê-lo. */
export function htmlDoRelatorio(S: State, r: RecorteDoRelatorio): string {
  const p: any = S.profile;
  const R = T.resumo.relatorio;
  const Q = T.resumo;
  const med = M(S);
  const desde = +startOfDay(new Date(r.desde));
  const apos = <X extends { t: number }>(a: X[] | undefined) => (a || []).filter((x) => x.t >= desde).sort((a, b) => a.t - b.t);
  const vazio = `<p class="nota">${esc(R.semRegistros)}</p>`;

  const pesos = apos(S.weights as any[]);
  const medidas = apos(S.measures as any[]);
  const aplicacoes = apos(S.injections as any[]);
  const checkins = apos(S.checkins as any[]).filter(respostaNoDia);

  /* ---- os números do período ---- */
  const variacao = pesos.length >= 2
    ? variacaoDe(pesoV(S, pesos[pesos.length - 1].kg - pesos[0].kg), pesoU(S)).delta : null;
  /* ⚠️ NA DOSE DIÁRIA, O CARTÃO CONTA DIAS (02/10/2026, parte B5): "Doses
     no período: 92" somava a dose dobrada como se fosse um dia a mais e
     não dizia quantos dias o período tinha. "Dias com dose no período: 26
     de 28" é a régua de todo o diário (`contagemDaJanela`): do começo do
     regime diário ou do período, o que vier depois, até hoje — e hoje só
     depois da dose de hoje. Sem dia a contar (trocou e ainda não registrou
     o comprimido), o número de registros, como era. O semanal fica como
     era. */
  const noPeriodo = doseDiaria(S) ? diasComDoseDesde(S, desde) : null;
  const cartoes = [
    S.weights.length ? cartao(R.pesoAtual, pesoTxt(S, curWeight(S))) : '',
    variacao ? cartao(R.variacao, variacao) : '',
    r.inclui.aplicacoes
      ? (noPeriodo?.dias
        ? cartao(R.diasComDoseNoPeriodo, Q.diasComDoseValor(noPeriodo.feitos, noPeriodo.dias))
        : cartao(R.aplicacoesNoPeriodo, String(aplicacoes.length)))
      : '',
    r.inclui.sintomas ? cartao(R.checkinsRespondidos, String(checkins.length)) : '',
  ].filter(Boolean).join('');
  let corpo = secao(R.visaoGeral, `<div class="cartoes">${cartoes}</div>`);

  /* ---- a medicação: a mesma seção do resumo na tela ---- */
  const medicacao = resumoDoTratamento(S).find((s) => s.id === 'medicacao');
  if (medicacao?.linhas.length) {
    corpo += secao(medicacao.titulo, `<table><tbody>${medicacao.linhas
      .map((l) => `<tr><td>${esc(l.k)}</td><td class="num">${esc(l.v)}</td></tr>`).join('')}</tbody></table>`);
  }

  /* ---- peso e medidas ---- */
  if (r.inclui.peso) {
    const grafico = graficoDeLinha(pesos.map((w) => ({ t: w.t, v: pesoV(S, w.kg) })), {
      rotuloValor: (v) => `${nf(v, 1)} ${pesoU(S)}`,
      rotuloData: (t) => dataDeTabela(t),
      meta: p.goalWeight ? pesoV(S, p.goalWeight) : null,
      rotuloMeta: p.goalWeight ? `${T.perfil.meta} · ${pesoTxt(S, p.goalWeight)}` : undefined,
    });
    const linhas = pesos.slice().reverse().map((w) => [esc(dataDeTabela(w.t)), esc(pesoTxt(S, w.kg))]);
    corpo += secao(R.peso, pesos.length
      ? `${grafico}${tabela([{ t: R.data }, { t: R.peso, num: true }], linhas)}`
      : vazio, undefined, false);
    if (medidas.length) {
      const C = T.medidas.corpo;
      corpo += secao(R.medidas, tabela(
        [{ t: R.data }, { t: C.cintura, num: true }, { t: C.quadril, num: true }, { t: C.braco, num: true }, { t: C.coxa, num: true }],
        medidas.slice().reverse().map((m: any) => [
          esc(dataDeTabela(m.t)),
          ...['cintura', 'quadril', 'braco', 'coxa'].map((k) => esc(m[k] ? compTxt(S, m[k], 0) : '—')),
        ]),
      ));
    }
  }

  /* ---- as doses ----

     ⚠️⚠️ CADA DOSE COM O SEU REMÉDIO, E O LOCAL SÓ DE QUEM FOI INJETADA
     (01/10/2026). A tabela lia a unidade de `M(S)` — o remédio de HOJE —
     e o `site` cru de cada registro. Dois erros num papel que vai para o
     médico:

     · Quem trocou de Ozempic para Rybelsus no período via as doses antigas
       com a unidade e o nome do remédio novo, sem nada que dissesse que
       houve troca. Cada registro grava o `med` (app/aplicacao), e é dele
       que sai a unidade; com mais de um remédio no período, a coluna
       Medicamento aparece e diz qual era cada dose.
     · Até 01/10/2026 o comprimido era gravado com um local de injeção
       inventado, e ele chegava aqui. `localDaDose` devolve vazio para dose
       não injetada — e a coluna Local inteira sai quando nenhuma linha do
       período tem local, em vez de uma coluna de traços que perguntaria ao
       médico onde se aplica um comprimido.

     O registro antigo sem `med` cai no remédio de agora, como no resto do
     app (logic/formas, formaDaDose). */
  /* ⚠️⚠️ E QUEM TOMA TODO DIA, COM MAIS DE 14 REGISTROS, RECEBE O RESUMO
     POR DOSE (02/10/2026, parte B5). Desde a última consulta eram noventa
     linhas "7 mg" — trezentas no tratamento inteiro —, e a subida de 3
     para 7 e 14 mg, que é o que o médico procura, se perdia no meio delas.
     Cada linha agora é um trecho com o mesmo remédio e a mesma dose
     (`trechosDeDose`): de quando a quando, quantos registros e em quantos
     dias houve dose, contra os dias do trecho. Mais registros que dias
     com dose é dose dobrada no mesmo dia, e fica à vista.

     O local do Saxenda não entra no resumo: noventa locais não cabem num
     trecho, e o rodízio por trecho fica para quando houver revisão
     clínica do que o médico quer ver ali (PENDENCIAS). Até 14 registros, e
     sempre no semanal, a lista de antes, com o local. */
  if (r.inclui.aplicacoes && dosesEmResumo(S, aplicacoes.length)) {
    const trechos = trechosDeDose(S, desde);
    const variosRemedios = new Set(trechos.map((t) => t.med)).size > 1;
    const quando = (t: { de: number; ate: number }) =>
      t.de === t.ate ? dataDeTabela(t.de) : R.periodo(dataDeTabela(t.de), dataDeTabela(t.ate));
    corpo += secao(R.aplicacoes, tabela(
      [
        { t: R.periodoDaDose },
        ...(variosRemedios ? [{ t: R.medicamento }] : []),
        { t: R.dose, num: true },
        { t: R.registros, num: true },
        { t: R.diasComDose, num: true },
      ],
      trechos.slice().reverse().map((t) => {
        const m = MEDS[t.med] ?? med;
        return [
          esc(quando(t)),
          ...(variosRemedios ? [esc(m.label)] : []),
          esc(t.dose ? `${doseTxt(t.dose)} ${m.unit}` : '—'),
          esc(String(t.doses)),
          /* sem dia a contar (outro regime, ou a troca no mesmo dia), traço */
          esc(t.dias ? Q.diasComDoseValor(t.feitos, t.dias) : '—'),
        ];
      }),
    ), R.resumoPorDose(aplicacoes.length), false);
  } else if (r.inclui.aplicacoes) {
    const medDe = (a: any) => MEDS[a.med] ?? med;
    const variosRemedios = new Set(aplicacoes.map((a: any) => a.med || S.profile.med)).size > 1;
    const comLocal = aplicacoes.some((a: any) => localDaDose(S, a));
    const cab = [
      { t: R.data },
      ...(variosRemedios ? [{ t: R.medicamento }] : []),
      { t: R.dose, num: true },
      ...(comLocal ? [{ t: R.local }] : []),
    ];
    corpo += secao(R.aplicacoes, aplicacoes.length ? tabela(
      cab,
      aplicacoes.slice().reverse().map((a: any) => {
        const local = localDaDose(S, a);
        return [
          esc(dataDeTabela(a.t)),
          ...(variosRemedios ? [esc(medDe(a).label)] : []),
          esc(a.dose ? `${doseTxt(a.dose)} ${medDe(a).unit}` : '—'),
          ...(comLocal ? [esc(local ? siteLabel(local) : '—')] : []),
        ];
      }),
    ) : vazio, undefined, false);
  }

  /* ---- sintomas: em palavras, com a faixa dos dias (logic/pdf) ---- */
  if (r.inclui.sintomas) {
    corpo += secao(R.sintomas, blocoDeSintomas(checkins) || vazio);
  }

  /* ---- exames: os marcadores com coleta no período, um por linha, com
     o último valor e a etiqueta (logic/pdf). O anterior pode ser de antes
     do período: é ele que diz para onde o número andou. ---- */
  if (r.inclui.exames) {
    const exames = (S.exams as any[]).filter((e) => (e.values || []).some((v: any) => v.t >= desde));
    corpo += secao(R.exames, exames.length ? tabelaDeExames(exames) : vazio);
  }

  /* ---- hábitos, como médias ---- */
  if (r.inclui.habitos) {
    const diasTodos = apos(S.checkins as any[]);
    const comProteina = diasTodos.filter((c: any) => (c.prot || 0) > 0);
    const comAgua = diasTodos.map((c: any) => aguaDoDia(S, c.t)).filter((ml) => ml > 0);
    const minutos = diasTodos.reduce((s: number, c: any) => s + ((c.treinos || []) as any[]).reduce((a, t) => a + (t.min || 0), 0), 0);
    corpo += secao(R.habitos, `<div class="cartoes">${[
      cartao(R.proteinaMedia, comProteina.length ? `${Math.round(comProteina.reduce((s: number, c: any) => s + c.prot, 0) / comProteina.length)} g` : '—'),
      cartao(R.aguaMedia, comAgua.length ? aguaTxt(S, comAgua.reduce((s, v) => s + v, 0) / comAgua.length) : '—'),
      cartao(R.exercicioTotal, R.minutos(minutos)),
    ].join('')}</div>`);
  }

  /* ---- o que ela escreveu ---- */
  if (r.inclui.notas) {
    const notas = apos(S.notes as any[]);
    corpo += secao(R.notas, notas.length
      ? `<ul>${notas.map((n: any) => `<li>${esc(n.text)}${n.done ? ` <span class="fraco">· ${esc(R.conversada)}</span>` : ''}</li>`).join('')}</ul>`
      : vazio);
  }

  const para = [p.doctor, p.clinic].filter(Boolean).join(' · ');
  return documento({
    titulo: R.titulo,
    quem: p.name,
    quando: `${R.periodo(dataComAno(desde), dataComAno(now()))}${para ? ` · ${R.para(para)}` : ''}`,
    meta: R.geradoEm(dataComAno(now())),
    corpo,
    rodape: Q.origem,
  });
}

/** O relatório, montado e entregue. */
export const compartilharRelatorioPdf = (S: State, r: RecorteDoRelatorio): Promise<ResultadoDoPdf> =>
  compartilharPdf(htmlDoRelatorio(S, r), T.resumo.relatorio.arquivo(hojeIso()), T.resumo.relatorio.titulo);

