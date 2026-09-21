/* O TEXTO DE UM PDF, SEM DEPENDÊNCIA — para colher tabela nutricional.

   Serve para PDF gerado por editor (InDesign, Word, Illustrator). Não
   serve para PDF escaneado, que é imagem e precisaria de OCR.

     node scripts/ler-pdf.mjs arquivo.pdf

   ⚠️⚠️ POR QUE ELE LÊ A FONTE, E NÃO SÓ OS BYTES. A primeira versão
   pegava o que estava entre parênteses no fluxo de conteúdo e pronto. O
   Habib's virou "Chocolao", "Fior Di Lae", "Sundae So Morango" e
   "Bibsfiha" — e o alérgeno virou "LAOSE".

   Não era acento perdido: a fonte do cardápio tem LIGADURAS próprias —
   um desenho só para "tt", outro para "ct", outro para "ft" — e cada uma
   ocupa um código baixo, daqueles que não têm letra nenhuma. Some do
   texto sem erro nenhum, e o nome sai torto.

   ⚠️ E O MESMO CÓDIGO QUER DIZER COISAS DIFERENTES EM CADA FONTE. Neste
   arquivo, o byte 30 é "ct" na fonte do miolo e "ft" na do título: lido
   com uma tabela só, "SUNDAE SOFT" viraria "SUNDAE SOCT". Por isso o
   leitor acompanha o /Tf — qual fonte está escrevendo agora — e decodifica
   cada letra com o /ToUnicode dela, que é o mapa que o próprio PDF traz
   justamente para isso.

   ⚠️ QUANDO NÃO HÁ MAPA, A LETRA VEM COMO ESTÁ. É o caso comum: fonte
   sem ligadura nenhuma, byte igual a latin1. O mapa é o conserto da
   exceção, e não o caminho de todo mundo. */
import { readFileSync } from 'node:fs';
import zlib from 'node:zlib';

/* ---------- os objetos do arquivo ---------- */

function abrir(buf) {
  const s = buf.toString('latin1');
  const onde = new Map();
  for (const m of s.matchAll(/(?:^|[\r\n\s>])(\d+)\s+0\s+obj\b/g)) {
    onde.set(Number(m[1]), m.index + m[0].indexOf(m[1]));
  }

  /* O cabeçalho é o dicionário; o fluxo, se houver, vem depois de
     "stream". Corto no primeiro dos dois para não ler binário como
     texto. */
  const objeto = (n) => {
    const a = onde.get(n);
    if (a == null) return null;
    const fim = s.indexOf('endobj', a);
    const iFluxo = s.indexOf('stream', a);
    const temFluxo = iFluxo >= 0 && (fim < 0 || iFluxo < fim);
    const cab = s.slice(a, temFluxo ? iFluxo : fim < 0 ? a + 4000 : fim);
    let dados = null;
    if (temFluxo) {
      let p = iFluxo + 6;
      if (buf[p] === 0x0d) p++;
      if (buf[p] === 0x0a) p++;
      const f = s.indexOf('endstream', p);
      dados = buf.subarray(p, f < 0 ? buf.length : f);
    }
    return { n, cab, dados };
  };

  const inflar = (d) => {
    if (!d) return '';
    try { return zlib.inflateSync(d).toString('latin1'); } catch { return d.toString('latin1'); }
  };

  return { s, onde, objeto, inflar };
}

/* ---------- o mapa de cada fonte ---------- */

const deHex = (h) => {
  let r = '';
  for (let i = 0; i + 4 <= h.length; i += 4) r += String.fromCharCode(parseInt(h.slice(i, i + 4), 16));
  return r;
};

/* O /ToUnicode é um CMap: uma lista de "este código é esta letra". Só
   duas formas aparecem na prática — bfchar (um a um) e bfrange (uma
   faixa seguida). */
function mapaDaFonte(cmap) {
  const m = new Map();
  for (const bloco of cmap.split('beginbfchar').slice(1)) {
    const corpo = bloco.split('endbfchar')[0];
    for (const par of corpo.matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)) {
      m.set(parseInt(par[1], 16), deHex(par[2]));
    }
  }
  for (const bloco of cmap.split('beginbfrange').slice(1)) {
    const corpo = bloco.split('endbfrange')[0];
    for (const t of corpo.matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)) {
      const lo = parseInt(t[1], 16);
      const hi = parseInt(t[2], 16);
      const alvo = t[3];
      for (let c = lo; c <= hi && c - lo < 512; c++) {
        m.set(c, deHex(alvo.slice(0, -4) + (parseInt(alvo.slice(-4), 16) + (c - lo)).toString(16).padStart(4, '0')));
      }
    }
  }
  return m;
}

/* ---------- o texto ---------- */

const octal = (s) => s
  .replace(/\\(\d{1,3})/g, (_, n) => String.fromCharCode(parseInt(n, 8)))
  .replace(/\\([()\\])/g, '$1');

/* ⚠️⚠️ MOVER O CURSOR É SEPARAR, e numa tabela isso é tudo. A célula de
   um número não traz espaço nenhum: o PDF escreve

     (55)Tj  -0.112 -2.094 Td  (8,9)Tj  0.347 -2.094 Td  (0)Tj

   — desenha "55", anda para a linha de baixo, desenha "8,9". Sem o Td
   virar separador, isso vira "558,90", e a tabela inteira colapsa numa
   fila de dígitos grudados que leitor nenhum separa depois. Palavra
   partida por kerning é outra coisa, e vem em TJ no mesmo Td: "CHOC",
   "OL", "A", "TT", "O" continuam grudando certo.

   ⚠️ E UM GLIFO SEM LETRA TAMBÉM VIRA ESPAÇO, mas esse é contado. Se um
   dia uma ligadura de verdade ficar sem /ToUnicode, ela viraria espaço e
   o nome sairia partido ao meio sem ninguém notar. O leitor devolve
   quantos viu — neste cardápio é um só. */
const SEPARADOR = Symbol('glifos sem letra');

export function textoDoPdf(buf) {
  const { s, onde, objeto, inflar } = abrir(buf);
  let mudos = 0;

  /* a letra do mapa da fonte; na falta dele, o byte como veio; e espaço
     quando o glifo não corresponde a letra nenhuma */
  const letra = (mapa, ch) => {
    const c = ch.charCodeAt(0);
    const v = mapa ? mapa.get(c) : undefined;
    if (v) return v;
    if (v === '' || c < 0x20) { mudos++; return ' '; }
    return ch;
  };

  const cacheMapa = new Map();
  const mapaDe = (numFonte) => {
    if (cacheMapa.has(numFonte)) return cacheMapa.get(numFonte);
    let m = null;
    const f = objeto(numFonte);
    const ref = f && f.cab.match(/\/ToUnicode\s+(\d+)\s+0\s+R/);
    if (ref) {
      const cm = objeto(Number(ref[1]));
      if (cm) m = mapaDaFonte(inflar(cm.dados));
    }
    cacheMapa.set(numFonte, m);
    return m;
  };

  /* nome do recurso (/T1_0) → número do objeto da fonte, por página */
  const fontesDe = (cabPagina) => {
    let dic = cabPagina.match(/\/Font\s*<<([^>]*)>>/);
    if (!dic) {
      const ref = cabPagina.match(/\/Resources\s+(\d+)\s+0\s+R/);
      const r = ref && objeto(Number(ref[1]));
      dic = r && r.cab.match(/\/Font\s*<<([^>]*)>>/);
    }
    const tab = new Map();
    if (dic) for (const m of dic[1].matchAll(/\/([A-Za-z0-9_.+-]+)\s+(\d+)\s+0\s+R/g)) tab.set(m[1], Number(m[2]));
    return tab;
  };

  const linhas = [];

  for (const [n] of onde) {
    const o = objeto(n);
    if (!o || !/\/Type\s*\/Page[^s]/.test(o.cab)) continue;

    const fontes = fontesDe(o.cab);
    const conteudos = [];
    const c1 = o.cab.match(/\/Contents\s+(\d+)\s+0\s+R/);
    if (c1) conteudos.push(Number(c1[1]));
    const cN = o.cab.match(/\/Contents\s*\[([^\]]*)\]/);
    if (cN) for (const m of cN[1].matchAll(/(\d+)\s+0\s+R/g)) conteudos.push(Number(m[1]));

    for (const cn of conteudos) {
      const co = objeto(cn);
      if (!co) continue;
      const fluxo = inflar(co.dados);

      for (const bt of fluxo.split(/\bBT\b/).slice(1)) {
        const corpo = bt.split(/\bET\b/)[0];
        const partes = [];
        let mapa = null;

        const passo = /\/([A-Za-z0-9_.+-]+)\s+[\d.-]+\s+Tf|\((?:[^()\\]|\\.)*\)|<([0-9A-Fa-f\s]+)>|\bTd\b|\bTD\b|\bT\*\b/g;
        for (const m of corpo.matchAll(passo)) {
          const t = m[0];
          if (t.startsWith('/')) { mapa = mapaDe(fontes.get(m[1])); continue; }
          if (/^Td|^TD|^T\*/.test(t)) { partes.push(' '); continue; }

          const bytes = t.startsWith('(')
            ? octal(t.slice(1, -1))
            : deHex(m[2].replace(/\s+/g, '').padEnd(Math.ceil(m[2].replace(/\s+/g, '').length / 4) * 4, '0'));

          partes.push([...bytes].map((ch) => letra(mapa, ch)).join(''));
        }

        /* espaço repetido vira um só, e o bloco vira uma linha */
        const txt = partes.join('').replace(/\s+/g, ' ').trim();
        if (txt) linhas.push(txt);
      }
    }
  }

  linhas[SEPARADOR] = mudos;
  return linhas;
}

export { SEPARADOR };

if (process.argv[1] && process.argv[1].endsWith('ler-pdf.mjs')) {
  const linhas = textoDoPdf(readFileSync(process.argv[2]));
  const saida = linhas.join('\n');
  console.log(saida.slice(0, Number(process.argv[3] ?? 4000)));
  console.log('\n--- ' + linhas.length + ' blocos, ' + saida.length + ' caracteres, '
    + linhas[SEPARADOR] + ' glifos sem letra ---');
}
