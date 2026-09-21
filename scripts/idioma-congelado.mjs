/* ============================================================
   A TRAVA QUE O TSC NÃO TEM — constante de módulo que lê o catálogo

   ⚠️⚠️ UMA CONSTANTE DE MÓDULO É AVALIADA UMA VEZ, NO IMPORT. Se ela lê
   `T`, ela guarda o texto do idioma que estava valendo naquele instante —
   e não muda mais. Trocar de idioma passa a não mexer naquela tabela.

   A regra do catálogo é: SE A TABELA LÊ O CATÁLOGO, ELA É FUNÇÃO.

   O `tsc` cobra essa regra de graça quando a tabela é indexada por chave,
   porque indexar uma função é erro de tipo. Mas ele NÃO VÊ NADA quando a
   tabela é um ARRAY: `PLANOS.map(...)` compila igual, seja PLANOS uma
   constante congelada ou não. Foi assim que `PLANOS` ficou uma passagem
   inteira congelando o idioma dos dois planos de assinatura.

   Este script é a trava do caso que o tsc não alcança:

     node scripts/idioma-congelado.mjs

   Ele lê cada arquivo de src/logic e src/ui, acha as declarações de
   módulo que não são função, e acusa as que mencionam `T.`.
   ============================================================ */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

/* ⚠️ O CATÁLOGO NÃO ENTRA. Lá dentro, ler o próprio idioma é o trabalho. */
const FORA = /[\\/](textos|node_modules|\.expo)[\\/]/;

function arquivos(dir, saida = []) {
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome);
    if (FORA.test(p)) continue;
    if (statSync(p).isDirectory()) arquivos(p, saida);
    else if (/\.tsx?$/.test(p)) saida.push(p);
  }
  return saida;
}

/* Acha o fim de uma declaração contando chaves e colchetes. Não é um
   parser, e não precisa ser: o que interessa é o corpo entre o `=` e o
   ponto em que a profundidade volta a zero. */
function corpoDe(linhas, i) {
  let prof = 0;
  let corpo = '';
  for (let k = i; k < linhas.length && k < i + 400; k += 1) {
    const l = linhas[k];
    corpo += l + '\n';
    for (const ch of l) {
      if ('[{('.includes(ch)) prof += 1;
      if (']})'.includes(ch)) prof -= 1;
    }
    if (prof <= 0 && k > i) return { corpo, fim: k };
    if (prof <= 0 && /;\s*$/.test(l)) return { corpo, fim: k };
  }
  return { corpo, fim: i };
}

/* ⚠️⚠️ A ASSINATURA DA FUNÇÃO PODE ATRAVESSAR LINHAS, e a primeira versão
   desta trava não sabia disso: `(): Record<Forma, {` abre a chave do tipo
   de retorno antes de chegar ao `=>`, e quatro funções perfeitamente
   corretas foram acusadas de congelar o idioma.

   Uma trava que grita com quem está certo é uma trava que alguém desliga.
   Então o teste roda sobre o CORPO inteiro, e não sobre a primeira linha:
   se depois do `=` vem um parêntese que fecha e um `=>`, é função. */
const DECLARA = /^(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*(?::[^=]*)?=\s*([^]*)$/;
const EH_FUNCAO = /^(\([^]*?\)|[A-Za-z_$][\w$]*)\s*(:[^]*?)?=>/;

const acusados = [];
for (const p of arquivos(join(RAIZ, 'src'))) {
  const linhas = readFileSync(p, 'utf8').split(/\r?\n/);
  for (let i = 0; i < linhas.length; i += 1) {
    const m = DECLARA.exec(linhas[i]);
    if (!m) continue;
    const [, nome] = m;
    const { corpo, fim } = corpoDe(linhas, i);
    i = fim;
    if (EH_FUNCAO.test(corpo.slice(corpo.indexOf('=') + 1).trim())) continue;
    if (!/\bT\.[a-zA-Z]/.test(corpo)) continue;
    acusados.push(`${p.replace(RAIZ, '').replace(/\\/g, '/')}:${i + 1}  ${nome}`);
  }
}

if (acusados.length) {
  console.error('CONGELAM O IDIOMA — constante de módulo que lê o catálogo:\n');
  for (const a of acusados) console.error('  ' + a);
  console.error('\nA regra: se a tabela lê o catálogo, ela é função.');
  process.exit(1);
}
console.log('nenhuma constante de módulo lendo o catálogo');
