import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { now, fmtDate } from './time';
import { localAtual } from './local';

/* ============================================================
   OS PDFs DO APLICATIVO — o papel e a entrega

   Dois documentos saem daqui: o resumo para a consulta (logic/resumoPdf)
   e o relatório do tratamento de /exportar (logic/relatorioPdf). Os dois
   usam a mesma folha — o mesmo cabeçalho, as mesmas tabelas, a mesma
   tinta — para parecerem o que são: papéis do mesmo aplicativo.

   ⚠️ NADA SAI DO APARELHO SOZINHO. O PDF é montado aqui, fica no cache e
   só sai pela folha de compartilhar do sistema, com a pessoa escolhendo
   para onde. No navegador não há arquivo: abre a impressão, e "salvar
   como PDF" é uma das opções dela.
   ============================================================ */

/* O que a pessoa escreveu vai para dentro de HTML: nome, anotações, nome
   do médico. Sem escapar, um "<" numa anotação quebraria o documento. */
export const esc = (s: unknown) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** AAAA-MM-DD do dia de hoje, para o nome do arquivo. */
export const hojeIso = () => {
  const d = new Date(+now());
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

/* A data das tabelas: curta, e com o ano — o período pode atravessar a
   virada do ano, e "3 jan" sem ano num papel de consulta é ambíguo. */
export const dataDeTabela = (t: number) => {
  const ano = new Date(t).getFullYear();
  return localAtual() === 'en-US' ? `${fmtDate(t)}, ${ano}` : `${fmtDate(t)} ${ano}`;
};

const AZUL = '#1C5CF5';
const TINTA = '#14171f';
const CINZA = '#5b6170';
const FIO = '#e4e6eb';
const FUNDO = '#f4f6fb';

/* A folha. Fonte do sistema (o PDF é montado pelo navegador do aparelho,
   e fonte externa dependeria de rede), A4, números alinhados à direita
   como numa coluna de laudo, e uma cor só — o azul da marca — para
   títulos, o gráfico e o fio do cabeçalho. */
const ESTILO = `
  @page { margin: 16mm 15mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif; color: ${TINTA}; font-size: 10.5pt; line-height: 1.45; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  header { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; border-bottom: 2px solid ${AZUL}; padding-bottom: 12px; margin-bottom: 20px; }
  .marca { font-size: 8.5pt; letter-spacing: .14em; text-transform: uppercase; color: ${AZUL}; font-weight: 700; }
  h1 { font-size: 21pt; line-height: 1.15; margin: 6px 0 4px; font-weight: 650; letter-spacing: -.01em; }
  .quem { font-size: 12pt; font-weight: 500; }
  .quando { color: ${CINZA}; font-size: 9.5pt; margin-top: 2px; }
  .meta { text-align: right; color: ${CINZA}; font-size: 9pt; white-space: nowrap; }
  section { margin: 0 0 20px; }
  .inteira { page-break-inside: avoid; }
  h2 { font-size: 9.5pt; text-transform: uppercase; letter-spacing: .08em; color: ${AZUL}; margin: 0 0 8px; padding-bottom: 5px; border-bottom: 1px solid ${FIO}; }
  .nota { color: ${CINZA}; font-size: 9pt; margin: 0 0 8px; }
  table { width: 100%; border-collapse: collapse; }
  td, th { padding: 6px 8px; vertical-align: top; text-align: left; }
  th { font-size: 8.5pt; color: ${CINZA}; font-weight: 500; border-bottom: 1px solid ${FIO}; }
  tbody tr:nth-child(even) td { background: ${FUNDO}; }
  .num { text-align: right; white-space: nowrap; }
  .fraco { color: ${CINZA}; }
  .cartoes { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .cartao { background: ${FUNDO}; border-radius: 10px; padding: 10px 12px; }
  .cartao .rot { font-size: 8.5pt; color: ${CINZA}; }
  .cartao .val { font-size: 15pt; font-weight: 600; margin-top: 2px; }
  .cartao .sub { font-size: 8.5pt; color: ${CINZA}; margin-top: 1px; }
  .grafico { width: 100%; height: auto; display: block; margin: 4px 0 10px; }
  ul { margin: 4px 0 0; padding-left: 18px; }
  li { margin: 4px 0; }
  footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid ${FIO}; color: ${CINZA}; font-size: 8.5pt; display: flex; justify-content: space-between; gap: 16px; }
`;

/** O documento inteiro, em volta do corpo que cada papel monta. */
export function documento(p: {
  titulo: string; quem: string; quando: string; meta?: string; corpo: string; rodape: string; rodapeDireita?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="${localAtual()}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.titulo)} — ${esc(p.quem)}</title>
<style>${ESTILO}</style>
</head>
<body>
<header>
  <div>
    <div class="marca">Morphi</div>
    <h1>${esc(p.titulo)}</h1>
    <div class="quem">${esc(p.quem)}</div>
    <div class="quando">${esc(p.quando)}</div>
  </div>
  ${p.meta ? `<div class="meta">${esc(p.meta)}</div>` : ''}
</header>
${p.corpo}
<footer><span>${esc(p.rodape)}</span>${p.rodapeDireita ? `<span>${esc(p.rodapeDireita)}</span>` : ''}</footer>
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/* O GRÁFICO — uma linha, em SVG dentro do HTML

   SVG porque o PDF é montado pelo navegador do aparelho, e ele desenha
   SVG sem biblioteca nenhuma. Sem eixo cheio de marcas: o maior e o menor
   valor à esquerda, as duas datas embaixo, e a meta tracejada quando ela
   cai dentro do desenho — é o que se lê de uma curva de peso num papel. */
export function graficoDeLinha(pontos: { t: number; v: number }[], p: {
  rotuloValor: (v: number) => string; rotuloData: (t: number) => string; meta?: number | null; rotuloMeta?: string;
}): string {
  if (pontos.length < 2) return '';
  const L = 640, A = 170, esq = 58, dir = 12, cima = 12, baixo = 24;
  const ts = pontos.map((x) => x.t), vs = pontos.map((x) => x.v);
  const t0 = Math.min(...ts), t1 = Math.max(...ts);
  let v0 = Math.min(...vs), v1 = Math.max(...vs);
  if (p.meta != null && p.meta >= v0 - (v1 - v0) * 0.6) v0 = Math.min(v0, p.meta);
  const folga = (v1 - v0) * 0.12 || 1;
  v0 -= folga; v1 += folga;
  const x = (t: number) => esq + ((t - t0) / ((t1 - t0) || 1)) * (L - esq - dir);
  const y = (v: number) => cima + (1 - (v - v0) / ((v1 - v0) || 1)) * (A - cima - baixo);
  const linha = pontos.map((q, i) => `${i ? 'L' : 'M'}${x(q.t).toFixed(1)},${y(q.v).toFixed(1)}`).join(' ');
  const area = `${linha} L${x(t1).toFixed(1)},${(A - baixo).toFixed(1)} L${x(t0).toFixed(1)},${(A - baixo).toFixed(1)} Z`;
  const maior = Math.max(...vs), menor = Math.min(...vs);
  const meta = p.meta != null && p.meta >= v0 && p.meta <= v1
    ? `<line x1="${esq}" x2="${L - dir}" y1="${y(p.meta).toFixed(1)}" y2="${y(p.meta).toFixed(1)}" stroke="${CINZA}" stroke-width="1" stroke-dasharray="4 4"/>
       <text x="${L - dir}" y="${(y(p.meta) - 4).toFixed(1)}" text-anchor="end" font-size="10" fill="${CINZA}">${esc(p.rotuloMeta ?? '')}</text>`
    : '';
  return `<svg class="grafico" viewBox="0 0 ${L} ${A}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${AZUL}" stop-opacity=".18"/><stop offset="1" stop-color="${AZUL}" stop-opacity="0"/></linearGradient></defs>
    <line x1="${esq}" x2="${L - dir}" y1="${A - baixo}" y2="${A - baixo}" stroke="${FIO}"/>
    <text x="${esq - 8}" y="${(y(maior) + 4).toFixed(1)}" text-anchor="end" font-size="10" fill="${CINZA}">${esc(p.rotuloValor(maior))}</text>
    <text x="${esq - 8}" y="${(y(menor) + 4).toFixed(1)}" text-anchor="end" font-size="10" fill="${CINZA}">${esc(p.rotuloValor(menor))}</text>
    ${meta}
    <path d="${area}" fill="url(#g)"/>
    <path d="${linha}" fill="none" stroke="${AZUL}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>
    ${pontos.length <= 40 ? pontos.map((q) => `<circle cx="${x(q.t).toFixed(1)}" cy="${y(q.v).toFixed(1)}" r="2.6" fill="${AZUL}"/>`).join('') : ''}
    <text x="${esq}" y="${A - 6}" font-size="10" fill="${CINZA}">${esc(p.rotuloData(t0))}</text>
    <text x="${L - dir}" y="${A - 6}" text-anchor="end" font-size="10" fill="${CINZA}">${esc(p.rotuloData(t1))}</text>
  </svg>`;
}

/* ------------------------------------------------------------------ */

export type ResultadoDoPdf = 'compartilhado' | 'impresso' | 'sem-suporte' | 'erro';

/** Monta o PDF e entrega pela folha do sistema — ou, no navegador, pela
    impressão. */
export async function compartilharPdf(html: string, nomeDoArquivo: string, titulo: string): Promise<ResultadoDoPdf> {
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
      ...(Platform.OS === 'ios' ? { margins: { top: 46, bottom: 46, left: 42, right: 42 } } : {}),
    });
    /* O arquivo nasce com nome sorteado; quem recebe vê o nome, e
       "7F3A….pdf" num e-mail não diz de quem nem de quando é. */
    const destino = new File(Paths.cache, nomeDoArquivo);
    if (destino.exists) destino.delete();
    await new File(uri).move(destino);

    if (!(await Sharing.isAvailableAsync())) return 'sem-suporte';
    await Sharing.shareAsync(destino.uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: titulo });
    return 'compartilhado';
  } catch {
    return 'erro';
  }
}
