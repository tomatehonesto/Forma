import { T } from '../textos';
import type { State } from './seed';
import { respostaNoDia } from './derive';
import { resumoDoTratamento } from './resumo';
import { dataComAno, now, startOfDay, DAY } from './time';
import {
  documento, esc, hojeIso, compartilharPdf, blocoDeSintomas, tabelaDeExames, type ResultadoDoPdf,
} from './pdf';

/* ============================================================
   O RESUMO EM PDF

   ⚠️ O COMPARTILHAR MANDAVA TEXTO CORRIDO (28/09/2026, pedido do dono).
   O resumo saía como mensagem — "RESUMO DE TRATAMENTO — Mariana", linhas
   com hífen —, e quem recebia do outro lado era um médico que lê laudo o
   dia inteiro, recebendo um parágrafo de WhatsApp. Agora ele sai como
   documento: uma página com cabeçalho, as seções e a tabela de exames.

   ⚠️ É O MESMO RESUMO, E NÃO UMA SEGUNDA MONTAGEM. As seções vêm de
   `resumoDoTratamento`, que é o que a tela mostra e o que o texto
   transcreve — se a tela e o PDF divergirem, é porque alguém escreveu uma
   terceira conta.

   A folha e a entrega são as de logic/pdf, as mesmas do relatório de
   /exportar.
   ============================================================ */

/** O HTML do documento — separado do envio para a sonda poder lê-lo. */
export function htmlDoResumo(S: State): string {
  const p: any = S.profile;
  const R = T.resumo;
  const P = R.pdf;
  const secoes = resumoDoTratamento(S);
  const para = [p.doctor, p.clinic].filter(Boolean).join(' · ');
  /* os mesmos catorze dias que a seção de sintomas do resumo lê */
  const desde = +startOfDay(now()) - 13 * DAY;
  const ultimosDias = (S.checkins as any[]).filter((c) => c.t >= desde && respostaNoDia(c)).sort((a, b) => a.t - b.t);

  const corpo = secoes.map((s) => {
    const nota = s.nota ? `<p class="nota">${esc(s.nota)}</p>` : '';
    /* exames e sintomas com os blocos comuns (logic/pdf): o exame com a
       etiqueta, e o sintoma em palavras — sem a nota de "média", que o
       papel não mostra mais */
    if (s.id === 'exames' && s.exames?.length) {
      return `<section class="inteira"><h2>${esc(s.titulo)}</h2>${tabelaDeExames(s.exames)}</section>`;
    }
    if (s.id === 'sintomas') {
      const bloco = blocoDeSintomas(ultimosDias);
      return `<section class="inteira"><h2>${esc(s.titulo)}</h2>${bloco || `<p class="nota">${esc(s.nota ?? '')}</p>`}</section>`;
    }
    if (s.id === 'notas') {
      const itens = (s.notas ?? []).map((n) => `<li>${esc(n.text)}</li>`).join('');
      return `
        <section class="inteira">
          <h2>${esc(s.titulo)}</h2>
          ${itens ? `<ul>${itens}</ul>` : `<p class="nota">${esc(R.semAnotacoes)}</p>`}
        </section>`;
    }
    const linhas = s.linhas.map((l) => `<tr><td>${esc(l.k)}</td><td class="num">${esc(l.v)}</td></tr>`).join('');
    return `
      <section class="inteira">
        <h2>${esc(s.titulo)}</h2>${nota}
        ${linhas ? `<table><tbody>${linhas}</tbody></table>` : ''}
      </section>`;
  }).join('');

  return documento({
    titulo: P.titulo,
    quem: p.name,
    quando: `${dataComAno(now())}${para ? ` · ${para}` : ''}`,
    corpo,
    rodape: R.origem,
  });
}

export type { ResultadoDoPdf };

/** O resumo, montado e entregue. */
export const compartilharResumoPdf = (S: State): Promise<ResultadoDoPdf> =>
  compartilharPdf(htmlDoResumo(S), T.resumo.pdf.arquivo(hojeIso()), T.resumo.pdf.titulo);
