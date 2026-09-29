import { T } from '../textos';
import type { State } from './seed';
import {
  M, curWeight, medComDose, nomeDoMarcador, respostaNoDia, siteLabel, variacaoDe, aguaDoDia,
} from './derive';
import { dataComAno, now, nf, doseTxt, startOfDay } from './time';
import { pesoTxt, pesoV, pesoU, compTxt, aguaTxt } from './medidas';
import { faixaTxt } from './unidadesDeExame';
import { documento, esc, hojeIso, compartilharPdf, graficoDeLinha, dataDeTabela, type ResultadoDoPdf } from './pdf';

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
   depois a curva do peso, depois o detalhe — medidas, aplicações,
   sintomas, exames —, e no fim o que ela escreveu. Hábitos entram como
   médias, e não como a lista de cada copo d'água: num papel, a lista de
   cem refeições é ruído.
   ============================================================ */

export type RecorteDoRelatorio = { desde: number; inclui: Record<string, boolean> };

const numero = (v: number | null | undefined, casas = 1) =>
  v == null || !Number.isFinite(v) ? '—' : nf(v, v % 1 ? casas : 0);

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
  const cartoes = [
    S.weights.length ? cartao(R.pesoAtual, pesoTxt(S, curWeight(S)), variacao ? `${R.variacao}: ${variacao}` : undefined) : '',
    cartao(R.doseAtual, medComDose(S)),
    r.inclui.aplicacoes ? cartao(R.aplicacoesNoPeriodo, String(aplicacoes.length)) : '',
    r.inclui.sintomas ? cartao(R.checkinsRespondidos, String(checkins.length)) : '',
  ].filter(Boolean).join('');
  let corpo = secao(R.visaoGeral, `<div class="cartoes">${cartoes}</div>`);

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

  /* ---- aplicações ---- */
  if (r.inclui.aplicacoes) {
    corpo += secao(R.aplicacoes, aplicacoes.length ? tabela(
      [{ t: R.data }, { t: R.dose, num: true }, { t: R.local }],
      aplicacoes.slice().reverse().map((a: any) => [
        esc(dataDeTabela(a.t)),
        esc(a.dose ? `${doseTxt(a.dose)} ${med.unit}` : '—'),
        esc(a.site ? siteLabel(a.site) : '—'),
      ]),
    ) : vazio, undefined, false);
  }

  /* ---- sintomas: só os dias respondidos, e o que ficou em branco é traço ---- */
  if (r.inclui.sintomas) {
    corpo += secao(R.sintomas, checkins.length ? tabela(
      [{ t: R.data }, { t: Q.nausea, num: true }, { t: Q.fome, num: true }, { t: Q.energia, num: true }, { t: Q.sono, num: true }],
      checkins.slice().reverse().map((c: any) => [
        esc(dataDeTabela(c.t)), esc(numero(c.nausea)), esc(numero(c.fome)), esc(numero(c.energia)),
        esc(c.sono != null ? `${numero(c.sono)} h` : '—'),
      ]),
    ) : vazio, undefined, false);
  }

  /* ---- exames: cada marcador com as coletas do período ---- */
  if (r.inclui.exames) {
    const exames = (S.exams as any[])
      .map((e) => ({ e, vs: (e.values || []).filter((v: any) => v.t >= desde).sort((a: any, b: any) => b.t - a.t) }))
      .filter((x) => x.vs.length);
    corpo += secao(R.exames, exames.length ? tabela(
      [{ t: Q.pdf.exame }, { t: Q.pdf.resultado, num: true }, { t: Q.pdf.referencia, num: true }],
      exames.map(({ e, vs }) => [
        esc(nomeDoMarcador(e.marker)),
        vs.map((v: any) => `${esc(`${numero(v.v)}${e.unit ? ` ${e.unit}` : ''}`)} <span class="fraco">· ${esc(dataDeTabela(v.t))}</span>`).join('<br>'),
        esc(e.ref ? `${faixaTxt(e.ref)}${e.unit ? ` ${e.unit}` : ''}` : '—'),
      ]),
    ) : vazio);
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

