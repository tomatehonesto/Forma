import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { T } from '../textos';
import type { State } from './seed';
import { examLast, nomeDoMarcador } from './derive';
import { resumoDoTratamento, valorDoExame } from './resumo';
import { faixaTxt } from './unidadesDeExame';
import { dataComAno, now } from './time';
import { localAtual } from './local';

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

   ⚠️ NADA SAI DO APARELHO SOZINHO. O PDF é montado aqui, fica no cache do
   aplicativo e só sai pela folha de compartilhar do sistema, com a pessoa
   escolhendo para onde. No navegador não há arquivo: abre a impressão, e
   "salvar como PDF" é uma das opções dela.
   ============================================================ */

/* O que a pessoa escreveu vai para dentro de HTML: nome, anotações, nome
   do médico. Sem escapar, um "<" numa anotação quebraria o documento. */
const esc = (s: unknown) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const hoje = () => {
  const d = new Date(+now());
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

/** O HTML do documento — separado do envio para a sonda poder lê-lo. */
export function htmlDoResumo(S: State): string {
  const p: any = S.profile;
  const R = T.resumo;
  const P = R.pdf;
  const secoes = resumoDoTratamento(S);

  const para = [p.doctor, p.clinic].filter(Boolean).join(' · ');
  const cabecalho = `
    <header>
      <div class="marca">Morphi</div>
      <h1>${esc(P.titulo)}</h1>
      <div class="quem">${esc(p.name)}</div>
      <div class="quando">${esc(dataComAno(now()))}${para ? ` · ${esc(para)}` : ''}</div>
    </header>`;

  const corpo = secoes.map((s) => {
    const nota = s.nota ? `<p class="nota">${esc(s.nota)}</p>` : '';
    if (s.id === 'exames' && s.exames?.length) {
      const linhas = s.exames.map((e: any) => `
        <tr>
          <td>${esc(nomeDoMarcador(e.marker))}</td>
          <td class="num">${esc(valorDoExame(e))}</td>
          <td class="num">${esc(e.ref ? `${faixaTxt(e.ref)}${e.unit ? ` ${e.unit}` : ''}` : '—')}</td>
          <td class="num">${esc(dataComAno(examLast(e).t))}</td>
        </tr>`).join('');
      return `
        <section>
          <h2>${esc(s.titulo)}</h2>${nota}
          <table class="exames">
            <thead><tr><th>${esc(P.exame)}</th><th class="num">${esc(P.resultado)}</th><th class="num">${esc(P.referencia)}</th><th class="num">${esc(P.coleta)}</th></tr></thead>
            <tbody>${linhas}</tbody>
          </table>
        </section>`;
    }
    if (s.id === 'notas') {
      const itens = (s.notas ?? []).map((n) => `<li>${esc(n.text)}</li>`).join('');
      return `
        <section>
          <h2>${esc(s.titulo)}</h2>
          ${itens ? `<ul>${itens}</ul>` : `<p class="nota">${esc(R.semAnotacoes)}</p>`}
        </section>`;
    }
    const linhas = s.linhas.map((l) => `<tr><td>${esc(l.k)}</td><td class="num">${esc(l.v)}</td></tr>`).join('');
    return `
      <section>
        <h2>${esc(s.titulo)}</h2>${nota}
        ${linhas ? `<table>${linhas}</table>` : ''}
      </section>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="${localAtual()}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(P.titulo)} — ${esc(p.name)}</title>
<style>
  @page { margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #14171f; font-size: 11pt; line-height: 1.45; margin: 0; }
  header { border-bottom: 2px solid #1C5CF5; padding-bottom: 12px; margin-bottom: 18px; }
  .marca { font-size: 9pt; letter-spacing: .12em; text-transform: uppercase; color: #1C5CF5; font-weight: 600; }
  h1 { font-size: 20pt; margin: 6px 0 4px; font-weight: 600; }
  .quem { font-size: 12pt; font-weight: 500; }
  .quando { color: #5b6170; font-size: 10pt; margin-top: 2px; }
  section { margin: 0 0 16px; page-break-inside: avoid; }
  h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: .06em; color: #1C5CF5; margin: 0 0 4px; }
  .nota { color: #5b6170; font-size: 9.5pt; margin: 0 0 6px; }
  table { width: 100%; border-collapse: collapse; }
  td, th { padding: 6px 0; border-bottom: 1px solid #e4e6eb; vertical-align: top; text-align: left; }
  th { font-size: 9pt; color: #5b6170; font-weight: 500; }
  .num { text-align: right; padding-left: 12px; white-space: nowrap; }
  ul { margin: 4px 0 0; padding-left: 18px; }
  li { margin: 3px 0; }
  footer { margin-top: 22px; padding-top: 10px; border-top: 1px solid #e4e6eb; color: #5b6170; font-size: 9pt; }
</style>
</head>
<body>
${cabecalho}
${corpo}
<footer>${esc(R.origem)}</footer>
</body>
</html>`;
}

export type ResultadoDoPdf = 'compartilhado' | 'impresso' | 'sem-suporte' | 'erro';

/** Monta o PDF e entrega pela folha do sistema — ou, no navegador, pela
    impressão. */
export async function compartilharResumoPdf(S: State): Promise<ResultadoDoPdf> {
  const html = htmlDoResumo(S);
  try {
    if (Platform.OS === 'web') {
      /* No navegador o expo-print imprime a PÁGINA, e não o HTML dado: o
         documento abre numa janela própria e a impressão sai de lá. */
      const janela = window.open('', '_blank');
      if (!janela) return 'erro';
      janela.document.write(html);
      janela.document.close();
      janela.focus();
      setTimeout(() => janela.print(), 250);
      return 'impresso';
    }

    /* A4 em pontos. No iOS as margens vão por parâmetro, que é onde o
       expo-print as aceita; no Android e na web, vale o @page do HTML. */
    const { uri } = await Print.printToFileAsync({
      html, width: 595, height: 842,
      ...(Platform.OS === 'ios' ? { margins: { top: 48, bottom: 48, left: 44, right: 44 } } : {}),
    });
    /* O arquivo nasce com nome sorteado; quem recebe vê o nome, e
       "7F3A….pdf" num e-mail não diz de quem nem de quando é. */
    const destino = new File(Paths.cache, T.resumo.pdf.arquivo(hoje()));
    if (destino.exists) destino.delete();
    await new File(uri).move(destino);

    if (!(await Sharing.isAvailableAsync())) return 'sem-suporte';
    await Sharing.shareAsync(destino.uri, {
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
      dialogTitle: T.resumo.pdf.titulo,
    });
    return 'compartilhado';
  } catch {
    return 'erro';
  }
}
