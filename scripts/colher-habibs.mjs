/* A COLHEITA DO HABIB'S — do PDF oficial para scripts/dados/habibs-br.tsv

     node scripts/colher-habibs.mjs                 (baixa o PDF)
     node scripts/colher-habibs.mjs tb_nutri.pdf    (de um arquivo local)

   ⚠️ ESTA REDE SE DEIXA COLHER SOZINHA, e é a diferença para o
   McDonald's. Lá o site responde 403 a quem não é navegador, e a colheita
   tem de ser feita à mão, no console. Aqui o PDF baixa com um GET simples
   — então o script inteiro é reprodutível, e quem quiser conferir um
   número roda de novo e compara.

   ⚠️⚠️ E O HABIB'S PUBLICA O PESO DA PORÇÃO, o que muda o modelo. A RDC
   429 isenta restaurante, e por isso o McDonald's publica só o rótulo do
   produto — "o Big Mac tem 26 g de proteína" — sem dizer quanto o Big Mac
   pesa. O Habib's traz as duas colunas, por 100 g e por porção, com a
   porção em gramas. Então os itens dele entram no modelo normal do
   aplicativo, com valor por 100 g e peso de verdade.

   ⚠️ SÃO DOIS TRAÇADOS DE TABELA NO MESMO ARQUIVO. Num deles os valores
   vêm logo depois dos rótulos; no outro vem antes um "100 g" que, lido
   como número, daria 100 kcal para tudo. A conferência cruzada pega isso:
   o valor por 100 g multiplicado pelo peso tem de bater com o da coluna
   da porção. O que não bate é DESCARTADO, e não gravado na esperança. */
import { readFileSync, writeFileSync } from 'node:fs';
import { textoDoPdf, SEPARADOR } from './ler-pdf.mjs';

const FONTE = 'https://www.habibs.com.br/storage/pdf/tb_nutri.pdf';
const SAIDA = 'scripts/dados/habibs-br.tsv';

const pdf = process.argv[2]
  ? readFileSync(process.argv[2])
  : Buffer.from(await (await fetch(FONTE)).arrayBuffer());

const linhas = textoDoPdf(pdf);
process.stderr.write(linhas.length + ' blocos lidos · ' + linhas[SEPARADOR] + ' glifos sem letra\n');

/* ---------- as palavras ---------- */

/* ⚠️⚠️ O PONTO É MILHAR, E NÃO DECIMAL. O sódio do frango vem "1.024" —
   mil e vinte e quatro miligramas. Lido com a régua de qualquer outro
   idioma daria 1,024 mg, e lido como dois números — que foi o que
   aconteceu — empurra a tabela inteira uma casa para o lado: a coluna da
   porção deixa de bater e o item é descartado por um erro que não é
   dele. A vírgula é que é decimal, como em todo o resto do arquivo. */
const n = (v) => {
  const x = Number(String(v).replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(x) ? x : null;
};
const semAcento = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const slug = (s) => semAcento(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);

/* O PDF vem TODO EM CAIXA ALTA, e caixa alta numa lista de alimentos
   grita. Volta para caixa de frase — com duas ressalvas: depois de
   apóstrofo a letra sobe de novo, porque "Bib'Sfiha" é uma palavra só com
   duas partes; e palavra com "&" fica como veio, porque "M&M’S®" é marca
   registrada e não frase. */
const MINUSCULAS = new Set(['de', 'da', 'do', 'com', 'e', 'em', 'a', 'o', 'no', 'na', 'ao', 'para']);
const titulo = (s) => s.split(/\s+/)
  .map((w, i) => {
    if (w.includes('&')) return w;
    const b = w.toLowerCase();
    if (i > 0 && MINUSCULAS.has(b)) return b;
    return b.replace(/(^|[’'])([a-zà-ÿ])/g, (_, a, c) => a + c.toUpperCase());
  })
  .join(' ');

/* ---------- a leitura ---------- */

const itens = [];
const descartados = [];
const semDeclaracao = [];

for (const bloco of linhas) {
  const m = bloco.match(/^(.+?)Informa[çc][ãa]o Nutricional\s*-\s*Por[çc][ãa]o\s*(?::|de)\s*([\d.,]+)\s*g\s*(?:\(([^)]*)\))?/i);
  if (!m) continue;

  const gramas = n(m[2]);
  const cabeca = m[1];
  /* ⚠️⚠️ "NÃO CONTÉM" É O CONTRÁRIO DE "CONTÉM", e procurar a palavra
     solta inverte a frase. A tabela escreve as duas na mesma linha —
     "NÃO CONTÉM GLÚTEN - CONTÉM LACTOSE" —, e a primeira versão lia
     "contém glúten" na batata frita, que é justamente o item que a rede
     declara sem glúten. Errar para mais só esconde comida de quem
     filtra; errar para menos oferece a comida errada. Nenhum dos dois
     serve, então cada declaração é lida inteira, com o "não" junto. */
  const declaracoes = [...cabeca.matchAll(/(N[ÃA]O\s+)?CONT[ÉE]M\s+([^-]+)/gi)];
  const alerg = declaracoes.filter((d) => !d[1]).map((d) => d[2]).join(' · ');
  /* ⚠️ O ASTERISCO É NOTA DE RODAPÉ, e sai de onde estiver. Ele marca o
     item que leva queijo tipo cheddar, e vinha no meio do nome: "Genius
     Cheddar* e Bacon". Cortar só no fim deixava a estrela no meio. */
  const nome = cabeca
    .replace(/(N[ÃA]O\s+)?CONT[ÉE]M[^]*$/i, '')
    .replace(/\*/g, '')
    .replace(/[:•]+\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
  /* ⚠️⚠️⚠️ A PORÇÃO DE REFERÊNCIA NÃO É A UNIDADE, e confundir as duas
     multiplica por cinco a proteína de um sanduíche. A tabela escreve

       Porção de 75 g (1 unidade)
       Porção: 100 g (5/28 de unidade)
       Porção: 100 g (1 + 3/47 de fatia)

     — e só a primeira linha diz que a porção É a unidade. Na segunda, os
     100 g de referência são 5/28 de um beirute: o beirute inteiro pesa
     560 g. Lido como "1 unidade = 100 g", o aplicativo mostraria 14 g de
     proteína num sanduíche que tem 78 — o mesmo tipo de erro que os
     McNuggets quase puseram no registro de alguém, ver o gerador.

     O que sai daqui são os dois números publicados, separados: o peso da
     porção e quantas unidades ela é. A divisão fica no gerador, porque é
     conta, e conta se confere lendo. */
  const partes = (m[3] ?? '1 unidade').trim().toLowerCase();
  const f = partes.match(/^(?:(\d+)\s*\+\s*)?(\d+)(?:\s*\/\s*(\d+))?\s*(?:de\s+)?([a-zà-ÿ][a-zà-ÿ ]*?)\s*$/i);
  const unidades = f
    ? (f[3] ? (f[1] ? Number(f[1]) : 0) + Number(f[2]) / Number(f[3]) : Number(f[2]))
    : 1;
  const unidade = f ? f[4] : 'unidade';

  const pos = bloco.search(/S[óo]dio \(mg\)/i);
  if (pos < 0 || !gramas || !nome) { descartados.push(nome + ': sem rótulo ou sem porção'); continue; }

  /* ⚠️⚠️ ITEM QUE NÃO DECLARA NADA NÃO ENTRA. Alguns blocos da tabela vêm
     sem nenhuma linha de alérgeno — nem "contém", nem "não contém". Sem
     declaração não dá para distinguir "não tem leite" de "não disseram",
     e o aplicativo trata o que não está marcado como liberado: o item
     apareceria inteiro para quem filtrou lactose. É a única direção do
     erro que machuca, e por isso o item fica de fora até a rede dizer. */
  if (!declaracoes.length) { semDeclaracao.push(nome); continue; }

  /* traçado B: o rótulo "100 g" vem antes dos valores */
  const resto = bloco.slice(pos).replace(/S[óo]dio \(mg\)/i, '').replace(/^\s*100\s*g\s*/i, '');
  const nums = (resto.match(/-?\d+(?:\.\d{3})*(?:,\d+)?/g) ?? []).map(n);
  if (nums.length < 19) { descartados.push(nome + ': números de menos (' + nums.length + ')'); continue; }

  /* a ordem dos rótulos, que é a mesma da RDC 429 */
  const [kcal, carb, , , prot, gord, , , fibra, sodio] = nums;
  if (prot == null || kcal == null) { descartados.push(nome + ': sem proteína'); continue; }

  /* ⚠️⚠️ CADA TRAÇADO SE CONFERE DE UM JEITO, E NENHUM ENTRA SEM CONFERIR.

     A) tabela inteira — por 100 g, depois %VD, depois a coluna da porção.
        A conferência é direta: por 100 g vezes o peso tem de dar a
        coluna da porção. São 20 números ou mais.

     B) tabela curta — por 100 g e %VD, e só. É como vêm o tabule, o
        kafta e o prato do dia. Não há segunda coluna para comparar, mas
        há o %VD, que a própria rede calculou: o valor energético sobre
        20 é a porcentagem dos 2.000 kcal de referência. São 19 números.

     Sem uma das duas contas batendo, o item não entra. É o que impediu
     de ler o rótulo "100 g" como se fosse caloria e gravar 100 kcal para
     a tabela inteira. */
  const perto = (a, b, folga) => a != null && b != null && Math.abs(a - b) <= Math.max(folga, Math.abs(b) * 0.12);
  const daPorcao = (kcal / 100) * gramas;
  const conferiu = nums.length >= 20
    ? perto(nums.slice(-10)[0], daPorcao, 3)
    : perto(nums[10], kcal / 20, 1) || perto(nums[10], daPorcao / 20, 1);
  if (!conferiu) { descartados.push(nome + ': não confere (' + nums.length + ' números)'); continue; }

  const tem = [];
  if (/L[AÁ]CT|LEITE/i.test(alerg)) tem.push('Leite');
  if (/OVO/i.test(alerg)) tem.push('Ovo');
  if (/GL[ÚU]TEN|TRIGO/i.test(alerg)) tem.push('Glúten');
  if (/SOJA/i.test(alerg)) tem.push('Soja');
  if (/PEIXE/i.test(alerg)) tem.push('Peixe');
  if (/AM[ÊE]NDOA|CASTANHA|AMENDOIM|NOZ/i.test(alerg)) tem.push('Castanha');

  if (!unidades || gramas / unidades > 2000) { descartados.push(nome + ': porção estranha (' + gramas + ' g, ' + unidades + ' un)'); continue; }

  itens.push({ nome: titulo(nome), gramas, unidades, unidade, valores: [prot, kcal, carb, gord, fibra ?? '', sodio ?? ''], tem });
}

/* ⚠️⚠️ NOME REPETIDO GANHA O PESO. A batata frita aparece três vezes na
   tabela, com 50 g, 100 g e 120 g — são os três tamanhos, e o PDF não
   escreve "P", "M" e "G" em lugar nenhum do texto: a diferença está só na
   coluna da porção. Ficar com uma e jogar fora as outras esconderia duas
   batatas de verdade; deixar as três com o mesmo nome poria a pessoa para
   escolher entre linhas idênticas. O peso é publicado, e é o que
   distingue — então ele entra no nome. */
const quantos = new Map();
for (const x of itens) quantos.set(x.nome, (quantos.get(x.nome) ?? 0) + 1);
for (const x of itens) if (quantos.get(x.nome) > 1) x.nome += ' ' + Math.round(x.gramas / x.unidades) + ' g';

/* ---------- o arquivo ---------- */

const hoje = new Date().toLocaleDateString('pt-BR');

const cabecalho = `# COLHEITA — Habib's, tabela nutricional oficial
#
# Fonte: ${FONTE}
# Colhida em ${hoje} por scripts/colher-habibs.mjs, que baixa o PDF e
# lê a tabela. Para atualizar, rode o script de novo.
#
# ⚠️ AQUI O PESO DA PORÇÃO É PUBLICADO, e é o que separa esta colheita da
# do McDonald's: a rede traz a tabela nos dois formatos que a RDC 429
# pede — por 100 g e por porção, com a porção declarada em gramas. Por
# isso estes itens entram no modelo normal do aplicativo, com valor por
# 100 g e peso de verdade, e não com \`porUnidade\`.
#
# ⚠️ ${descartados.length} itens foram DESCARTADOS por não passarem na conferência
# cruzada — o valor por 100 g vezes o peso tem de bater com a coluna da
# porção. Quase todos são bebida, que a tabela traz num traçado diferente.
#
# ⚠️ E ${semDeclaracao.length} ficaram de fora por não declararem alérgeno nenhum.
# Sem declaração não dá para distinguir "não tem" de "não disseram", e o
# que não está marcado o aplicativo mostra a quem filtrou. Ver o motivo
# inteiro em scripts/colher-habibs.mjs.
#
# colunas: slug, nome, rede, proteína g/100g, kcal/100g, carboidrato g,
#          gordura g, fibra g, sódio mg, peso da porção de referência g,
#          quantas unidades cabem nessa porção, nome da unidade, alérgenos
#
# ⚠️ AS DUAS ÚLTIMAS COLUNAS NUMÉRICAS SÃO O QUE A TABELA DIZ, sem conta
# nenhuma: "Porção: 100 g (5/28 de unidade)" vira 100 e 0.1786. O peso de
# uma unidade — 560 g — é divisão, e a divisão fica no gerador.
#
`;

const linhasTsv = itens.map((x) => [
  slug(x.nome), x.nome, 'habibs', ...x.valores,
  x.gramas, Number(x.unidades.toFixed(4)), x.unidade, x.tem.join('+'),
].join('\t'));

writeFileSync(SAIDA, cabecalho + linhasTsv.join('\n') + '\n');
process.stderr.write(itens.length + ' itens gravados · ' + descartados.length + ' descartados\n');
for (const d of descartados.slice(0, 8)) process.stderr.write('  ' + d + '\n');
process.stderr.write(semDeclaracao.length + ' sem declaração de alérgeno: ' + semDeclaracao.join(', ') + '\n');
