import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { T } from '../textos';
import { now, fmtDate, nf } from './time';
import { localAtual } from './local';
import { INDICADORES, examStatus, examLast, nomeDoMarcador } from './derive';
import { faixaTxt } from './unidadesDeExame';
import { D_SIMBOLO, D_LETREIRO, LIMA_MARCA, LOCKUP, RAZAO_LOCKUP } from '../ui/marcaCaminhos';

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
const NOITE = '#0d1220';

/* ⚠️ A MARCA NUMA PASTILHA ESCURA (29/09/2026, pedido do dono). O M é
   lima, e lima sobre papel branco quase some — no aplicativo a marca mora
   sobre fundo escuro, e é assim que ela é reconhecida. Os caminhos são os
   do SVG oficial (ui/marcaCaminhos), sem retoque. */
const LOGO_ALTURA = 16;
const LOGO = `<span class="logo"><svg width="${(LOGO_ALTURA * RAZAO_LOCKUP).toFixed(1)}" height="${LOGO_ALTURA}" viewBox="${LOCKUP}" xmlns="http://www.w3.org/2000/svg">
  <path d="${D_SIMBOLO}" fill="${LIMA_MARCA}"/>${D_LETREIRO.map((d) => `<path d="${d}" fill="#FFFFFF"/>`).join('')}
</svg></span>`;

/* A folha. Fonte do sistema (o PDF é montado pelo navegador do aparelho,
   e fonte externa dependeria de rede), A4, números alinhados à direita
   como numa coluna de laudo, e uma cor só — o azul da marca — para
   títulos, o gráfico e o fio do cabeçalho. Verde e vermelho só aparecem
   onde dizem alguma coisa: nas etiquetas dos exames e na régua dos
   sintomas. */
const ESTILO = `
  @page { margin: 16mm 15mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif; color: ${TINTA}; font-size: 10.5pt; line-height: 1.45; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  header { border-bottom: 2px solid ${AZUL}; padding-bottom: 14px; margin-bottom: 22px; }
  .topo { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
  .logo { display: inline-flex; background: ${NOITE}; border-radius: 8px; padding: 7px 11px; }
  .meta { color: ${CINZA}; font-size: 9pt; text-align: right; }
  .sobre { font-size: 9pt; letter-spacing: .12em; text-transform: uppercase; color: ${AZUL}; font-weight: 700; }
  h1 { font-size: 25pt; line-height: 1.1; margin: 4px 0 6px; font-weight: 650; letter-spacing: -.015em; }
  .quando { color: ${CINZA}; font-size: 10pt; }
  section { margin: 0 0 22px; }
  .inteira { page-break-inside: avoid; }
  h2 { font-size: 9.5pt; text-transform: uppercase; letter-spacing: .08em; color: ${AZUL}; margin: 0 0 8px; padding-bottom: 5px; border-bottom: 1px solid ${FIO}; }
  .nota { color: ${CINZA}; font-size: 9pt; margin: 0 0 8px; }
  table { width: 100%; border-collapse: collapse; }
  td, th { padding: 7px 8px; vertical-align: top; text-align: left; }
  th { font-size: 8.5pt; color: ${CINZA}; font-weight: 500; border-bottom: 1px solid ${FIO}; }
  tbody tr:nth-child(even) td { background: ${FUNDO}; }
  .num { text-align: right; white-space: nowrap; }
  .fraco { color: ${CINZA}; }
  .miudo { font-size: 8.5pt; color: ${CINZA}; }
  .forte { font-weight: 600; }
  .grande { font-size: 12.5pt; font-weight: 600; }
  .cartoes { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .cartao { background: ${FUNDO}; border-radius: 10px; padding: 10px 12px; }
  .cartao .rot { font-size: 8.5pt; color: ${CINZA}; }
  .cartao .val { font-size: 15pt; font-weight: 600; margin-top: 2px; }
  .cartao .sub { font-size: 8.5pt; color: ${CINZA}; margin-top: 1px; }
  .grafico { width: 100%; height: auto; display: block; margin: 4px 0 10px; }
  .tag { display: inline-block; font-size: 8.5pt; font-weight: 600; padding: 2px 9px; border-radius: 999px; white-space: nowrap; }
  .tag.ok { background: #e3f5ea; color: #1d7a4a; }
  .tag.fora { background: #fde8e6; color: #c0392b; }
  .faixa { display: flex; flex-wrap: wrap; gap: 2px; max-width: 250px; }
  .dia { width: 9px; height: 9px; border-radius: 2px; display: inline-block; }
  .regua { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  ul { margin: 4px 0 0; padding-left: 18px; }
  li { margin: 4px 0; }
  footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid ${FIO}; color: ${CINZA}; font-size: 8.5pt; }
`;

/** O documento inteiro, em volta do corpo que cada papel monta.

    ⚠️ O NOME É A MANCHETE, E O TIPO DE PAPEL VAI ACIMA, PEQUENO (29/09/2026,
    pedido do dono). Um médico que recebe vinte PDFs por semana procura de
    QUEM é; "Relatório do tratamento" é o que todos dizem. */
export function documento(p: {
  titulo: string; quem: string; quando: string; meta?: string; corpo: string; rodape: string;
}): string {
  return `<!DOCTYPE html>
<html lang="${localAtual()}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.quem)} — ${esc(p.titulo)}</title>
<style>${ESTILO}</style>
</head>
<body>
<header>
  <div class="topo">${LOGO}${p.meta ? `<div class="meta">${esc(p.meta)}</div>` : ''}</div>
  <div class="sobre">${esc(p.titulo)}</div>
  <h1>${esc(p.quem)}</h1>
  <div class="quando">${esc(p.quando)}</div>
</header>
${p.corpo}
<footer>${esc(p.rodape)}</footer>
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
/* OS SINTOMAS EM PALAVRAS

   ⚠️ O NÚMERO NÃO DIZIA NADA (29/09/2026, pedido do dono). "Náusea 4",
   "Energia 5" pedem que quem lê adivinhe a régua. Cada degrau do check-in
   já tem a sua frase — "Deu para o dia", "Enjoo indo e vindo" —, e é com
   ela que a pessoa respondeu: o papel fala a mesma língua.

   Por indicador, uma linha: a resposta mais comum no período, em
   palavras, com quantos dias; o pior momento, quando ele foi forte; e uma
   faixa de quadradinhos, um por dia respondido, do verde (o melhor) ao
   vermelho (o pior). A cor é a única escala: quem recebe vê de longe se o
   período foi tranquilo ou difícil, e a frase diz o quê. */
const CORES = ['#2f9e6b', '#6fbf8e', '#b9d98b', '#f1c95a', '#ef9448', '#e0584a'];
const ORDEM = ['energia', 'humor', 'fome', 'enjoo', 'sono'];

export function blocoDeSintomas(dias: any[]): string {
  const R = T.resumo.relatorio;
  const inds = INDICADORES().filter((i) => ORDEM.includes(i.id) && i.escala?.legendas)
    .sort((a, b) => ORDEM.indexOf(a.id) - ORDEM.indexOf(b.id));
  const linhas: string[] = [];
  for (const ind of inds) {
    const valores = ind.escala!.valores;
    const legendas = ind.escala!.legendas!;
    /* o degrau de 1 a 5 do dia, ou 0 quando o sintoma não apareceu */
    const degraus = dias.map((c) => {
      const v = ind.leitura(c);
      if (v == null) return null;
      if (ind.id === 'sono') {
        let k = 0;
        valores.forEach((x, i) => { if (Math.abs(x - v) < Math.abs(valores[k] - v)) k = i; });
        return k + 1;
      }
      return Math.max(0, Math.min(5, Math.round(v)));
    }).filter((d): d is number => d != null);
    if (!degraus.length) continue;
    /* o quanto aquele dia foi ruim, de 0 (nada) a 5 — a régua sobe junto
       com o sintoma na fome e no enjoo, e ao contrário na energia, no
       humor e no sono */
    const ruim = (d: number) => (d === 0 ? 0 : ind.sentido === 'max' ? d : 6 - d);
    const palavra = (d: number) => (d === 0 ? R.semEnjoo : legendas[d - 1]);
    const conta = new Map<number, number>();
    degraus.forEach((d) => conta.set(d, (conta.get(d) ?? 0) + 1));
    const [maisComum, vezes] = [...conta.entries()].sort((a, b) => b[1] - a[1] || ruim(a[0]) - ruim(b[0]))[0];
    const pior = degraus.reduce((m, d) => (ruim(d) > ruim(m) ? d : m), degraus[0]);
    const piorLinha = ruim(pior) >= 4 && pior !== maisComum
      ? `<div class="miudo">${esc(R.piorEm(palavra(pior), conta.get(pior)!))}</div>` : '';
    const faixa = degraus.map((d) => `<span class="dia" style="background:${CORES[ruim(d)]}"></span>`).join('');
    linhas.push(`<tr>
      <td class="forte" style="width:22%">${esc(ind.nome)}</td>
      <td style="width:38%">${esc(palavra(maisComum))}<div class="miudo">${esc(R.diasDe(vezes, degraus.length))}</div>${piorLinha}</td>
      <td><div class="faixa">${faixa}</div></td>
    </tr>`);
  }
  if (!linhas.length) return '';
  const regua = CORES.slice(1).map((c) => `<span class="dia" style="background:${c}"></span>`).join('');
  return `<table><tbody>${linhas.join('')}</tbody></table>
    <div class="regua miudo">${esc(R.melhor)} ${regua} ${esc(R.pior)} · ${esc(R.cadaQuadrado)}</div>`;
}

/* ------------------------------------------------------------------ */
/* OS EXAMES, UM POR LINHA

   ⚠️ AS COLETAS EMPILHADAS VIRAVAM BAGUNÇA (29/09/2026, pedido do dono).
   Cada marcador mostrava todas as datas do período uma embaixo da outra,
   e o que importa — o último resultado está dentro ou fora? — sumia no
   meio. Agora é uma linha por marcador: o último valor em destaque, a
   data dele, o anterior em miúdo quando existe, a faixa, e a etiqueta:
   verde na referência, vermelha fora dela. Aqui o vermelho é certo: o
   papel é para quem trata, e fora da faixa é o que ele procura primeiro. */
export function tabelaDeExames(exames: any[]): string {
  const E = T.exames.tela;
  const R = T.resumo.relatorio;
  const P = T.resumo.pdf;
  const valor = (e: any, v: number) => `${nf(v, v % 1 ? 1 : 0)}${e.unit ? ` ${e.unit}` : ''}`;
  const linhas = exames.map((e) => {
    const vs = (e.values || []).slice().sort((a: any, b: any) => a.t - b.t);
    const ult = examLast({ values: vs });
    const ant = vs.length >= 2 ? vs[vs.length - 2] : null;
    const st = e.ref ? examStatus({ ...e, values: vs }) : null;
    const tag = st == null ? ''
      : st === 'ok' ? `<span class="tag ok">${esc(E.seloOk)}</span>`
        : `<span class="tag fora">${esc(st === 'alto' ? E.seloAlto : E.seloBaixo)}</span>`;
    return `<tr>
      <td class="forte">${esc(nomeDoMarcador(e.marker))}</td>
      <td><span class="grande">${esc(valor(e, ult.v))}</span>
        <div class="miudo">${esc(R.coletadoEm(dataDeTabela(ult.t)))}</div>
        ${ant ? `<div class="miudo">${esc(R.antes(valor(e, ant.v), dataDeTabela(ant.t)))}</div>` : ''}</td>
      <td class="fraco">${esc(e.ref ? `${faixaTxt(e.ref)}${e.unit ? ` ${e.unit}` : ''}` : '—')}</td>
      <td class="num">${tag}</td>
    </tr>`;
  }).join('');
  return `<table>
    <thead><tr><th>${esc(P.exame)}</th><th>${esc(P.resultado)}</th><th>${esc(P.referencia)}</th><th></th></tr></thead>
    <tbody>${linhas}</tbody>
  </table>`;
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
