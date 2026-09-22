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

   ⚠️⚠️ E TAMBÉM AS QUE MENCIONAM UM APELIDO DELE. A primeira versão
   procurava só por `T.` escrito, e passou batido por isto:

     const V = () => T.assinatura.vitrine;
     const ENTRA = [ ['journey', V().umLugarTitulo, V().umLugarTexto], … ];

   `V` é função e está certa; `ENTRA` é constante e congela. Mas no corpo
   de `ENTRA` não existe nenhum `T.` — existe `V()`. A trava disse "nenhuma
   constante de módulo lendo o catálogo" enquanto quatro blocos de texto
   saíam em português numa tela francesa.

   Então são duas passagens por arquivo: a primeira anota quais funções de
   módulo leem o catálogo, a segunda acusa quem lê `T.` OU chama uma
   delas.

   ⚠️⚠️ E A LEITURA TEM DE SER ANSIOSA PARA CONGELAR. Uma constante cujos
   VALORES são funções não congela nada:

     const MEDIDAS = { agua: (S, alvo) => ({ texto: K().aguaTodoDia(…) }) };

   `K()` ali roda quando alguém chama `MEDIDAS.agua(...)`, não no import.
   A primeira versão desta ampliação acusou `MEDIDAS` junto com os dois
   erros de verdade — e uma trava que grita com quem está certo é uma
   trava que alguém desliga.

   Então a leitura só conta quando está FORA de qualquer corpo de arrow
   dentro do inicializador. É heurística, não parser: erra para o lado de
   deixar passar, que é o lado certo para errar.
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

/* Percorre as declarações de módulo do arquivo uma vez, devolvendo nome,
   corpo, linha e se é função. As duas passagens comem desta lista. */
function declaracoes(linhas) {
  const fora = [];
  for (let i = 0; i < linhas.length; i += 1) {
    const m = DECLARA.exec(linhas[i]);
    if (!m) continue;
    const { corpo, fim } = corpoDe(linhas, i);
    const depoisDoIgual = corpo.slice(corpo.indexOf('=') + 1).trim();
    fora.push({ nome: m[1], corpo, linha: fim + 1, funcao: EH_FUNCAO.test(depoisDoIgual) });
    i = fim;
  }
  return fora;
}

const LE_CATALOGO = /\bT\.[a-zA-Z]/;

/* ⚠️ ONDE A LEITURA É ANSIOSA. Devolve o corpo com todo trecho que esteja
   dentro de um corpo de arrow trocado por espaço — o que sobra é o que
   roda no import.

   O corpo de um arrow acaba de dois jeitos: fechando o grupo de chaves ou
   colchetes onde ele começou, ou numa vírgula na mesma profundidade, que é
   o caso do corpo conciso — `{ a: () => T.x, b: T.y }` tem `T.y` ansioso. */
function soOAnsioso(corpo) {
  let fora = '';
  let prof = 0;
  const arrows = [];
  for (let i = 0; i < corpo.length; i += 1) {
    const ch = corpo[i];
    if (corpo.startsWith('=>', i)) { arrows.push(prof); fora += '  '; i += 1; continue; }
    if ('[{('.includes(ch)) prof += 1;
    if (']})'.includes(ch)) { prof -= 1; while (arrows.length && prof < arrows[arrows.length - 1]) arrows.pop(); }
    if ((ch === ',' || ch === ';') && arrows.length && prof === arrows[arrows.length - 1]) arrows.pop();
    fora += arrows.length ? ' ' : ch;
  }
  return fora;
}

const acusados = [];
for (const p of arquivos(join(RAIZ, 'src'))) {
  const decls = declaracoes(readFileSync(p, 'utf8').split(/\r?\n/));

  /* ⚠️ PASSAGEM 1 — os apelidos. Uma função de módulo cujo corpo lê o
     catálogo é um jeito de escrever `T.`, e chamar ela conta como ler. */
  const apelidos = decls.filter((d) => d.funcao && LE_CATALOGO.test(d.corpo)).map((d) => d.nome);
  const CHAMA_APELIDO = apelidos.length
    ? new RegExp(`\\b(${apelidos.join('|')})\\s*\\(`)
    : null;

  /* PASSAGEM 2 — quem congela. */
  for (const d of decls) {
    if (d.funcao) continue;
    const ansioso = soOAnsioso(d.corpo);
    const direto = LE_CATALOGO.test(ansioso);
    const porApelido = CHAMA_APELIDO ? CHAMA_APELIDO.test(ansioso) : false;
    if (!direto && !porApelido) continue;
    const via = direto ? 'T.' : `via ${ansioso.match(CHAMA_APELIDO)[1]}()`;
    acusados.push(`${p.replace(RAIZ, '').replace(/\\/g, '/')}:${d.linha}  ${d.nome}  (${via})`);
  }
}

if (acusados.length) {
  console.error('CONGELAM O IDIOMA — constante de módulo que lê o catálogo:\n');
  for (const a of acusados) console.error('  ' + a);
  console.error('\nA regra: se a tabela lê o catálogo, ela é função.');
  process.exit(1);
}
console.log('nenhuma constante de módulo lendo o catálogo');
