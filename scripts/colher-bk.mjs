/* A COLHEITA DO BURGER KING — do PDF oficial para scripts/dados/bk-br.tsv

     node scripts/colher-bk.mjs                  (baixa o PDF)
     node scripts/colher-bk.mjs tabela.pdf       (de um arquivo local)

   ⚠️⚠️ O ENDEREÇO DA TABELA MUDA, E O ANTIGO NÃO DÁ ERRO DE ENDEREÇO. O
   botão "Ver Tabela" do cardápio apontava para
   TABELA_NUTRICIONAL_BK_2025.pdf, que responde AccessDenied — o arquivo
   saiu do balde e o link ficou. Depois apontou para um nome com data,
   Tabela-nutricional-BK-22_07_2026.pdf, que responde AccessDenied
   também: o próprio botão do site está quebrado. O que responde é o nome
   sem data, e é nele que este script bate.

   Se um dia ele parar de responder, o caminho para achar o novo é este:
   abrir burgerking.com.br/cardapio num navegador, embrulhar window.open
   para guardar o que passa por ela, e clicar em "Ver Tabela" — o
   endereço aparece ali, mesmo quando o arquivo não abre.

   ⚠️⚠️ E AQUI A REDE PUBLICA O PESO DA PORÇÃO, o que o McDonald's não
   faz. A coluna "Porção (unid.)" traz 325 g para o Whopper. Então o item
   entra com os valores da porção — que é como a tabela os dá — E com o
   peso, que é o que permite dizer "1 unidade pesa perto de 325 g" sem
   inventar nada.

   ⚠️ A CONFERÊNCIA É A CALORIA DUAS VEZES. A tabela publica kcal e kJ
   lado a lado, e um é o outro vezes 4,184. Se as duas colunas não
   baterem, a linha foi lida torta — fim de coluna, célula vazia, número
   partido — e o item não entra. É a mesma régua do Habib's: nada entra
   sem uma segunda conta da própria fonte confirmando. */
import { readFileSync, writeFileSync } from 'node:fs';
import { textoDoPdf, SEPARADOR } from './ler-pdf.mjs';

const FONTE = 'https://bk-media.burgerking.com.br/TABELA_NUTRICIONAL_BK.pdf';
const SAIDA = 'scripts/dados/bk-br.tsv';

const pdf = process.argv[2]
  ? readFileSync(process.argv[2])
  /* ⚠️ O balde recusa quem não se apresenta como navegador. */
  : Buffer.from(await (await fetch(FONTE, { headers: { 'User-Agent': 'Mozilla/5.0' } })).arrayBuffer());

const linhas = textoDoPdf(pdf);
process.stderr.write(linhas.length + ' blocos lidos · ' + linhas[SEPARADOR] + ' glifos sem letra\n');

/* ---------- as palavras ---------- */

/* A célula vem como "717 (36%)", "1.369 (68%)" ou "0*": o que interessa
   é o número antes do parêntese, com o ponto de milhar desfeito e o
   asterisco da nota de rodapé fora. */
const n = (v) => {
  const t = String(v).split('(')[0].replace(/\*/g, '').replace(/\./g, '').replace(',', '.').trim();
  const x = Number(t);
  return Number.isFinite(x) ? x : null;
};
const semAcento = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const slug = (s) => semAcento(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);

const ROTULO = /^(#|Porç|Calorias|Carboidratos|Açúcares|adicionados|Proteínas|Gorduras|saturadas|trans|Fibra|Sódio|\(g\)|totais)/i;

/* ---------- a leitura ---------- */

const itens = [];
const descartados = [];

for (let i = 1; i < linhas.length; i++) {
  const peso = linhas[i].match(/^([\d.,]+)\s*g$/);
  if (!peso) continue;

  const nome = linhas[i - 1].trim();
  if (!/[a-zà-ÿ]/i.test(nome) || ROTULO.test(nome)) continue;

  /* ⚠️⚠️ A LINHA NÃO TEM SEMPRE ONZE CÉLULAS, e ler a décima como se
     sempre fosse a mesma coluna trocou gordura saturada por proteína no
     Stacker Duplo Bacon: 23 g no lugar de 49. O sanduíche que mais tem
     proteína no cardápio ia entrar com menos da metade.

     O que acontece é que as duas colunas de açúcar vêm VAZIAS em parte
     do cardápio, e célula vazia não vira bloco de texto nenhum — a linha
     encolhe de onze para nove e todo o resto anda duas casas para trás.

     Então a linha é lida até onde ela vai — célula é só dígito, ponto,
     vírgula, parêntese, porcentagem e asterisco; nome tem letra —, e o
     tamanho diz quais colunas faltam. Com dez, quem distingue é o
     parêntese: "açúcares totais" é a única coluna sem %VD ao lado. */
  const CELULA = /^[\d.,*\s()%]+$/;
  const celulas = [];
  for (let j = i + 1; j < linhas.length && CELULA.test(linhas[j]); j++) celulas.push(linhas[j].trim());

  if (celulas.length < 9 || celulas.length > 11) {
    descartados.push(nome + ': ' + celulas.length + ' células');
    continue;
  }

  const temPct = (c) => /%/.test(c ?? '');
  const cheia = [...celulas];
  if (cheia.length === 10) cheia.splice(temPct(cheia[3]) ? 3 : 4, 0, null);
  if (cheia.length === 9) cheia.splice(3, 0, null, null);

  /* a ordem das colunas, que é a da própria tabela */
  const [kcal, kj, carb, , , prot, gord, , , fibra, sodio] = cheia.map((c) => (c == null ? null : n(c)));
  if (kcal == null || kj == null || prot == null) { descartados.push(nome + ': célula vazia'); continue; }

  if (Math.abs(kj - kcal * 4.184) > Math.max(30, kcal * 4.184 * 0.03)) {
    descartados.push(nome + ': kcal e kJ não batem (' + kcal + ' contra ' + kj + ')');
    continue;
  }

  /* ⚠️⚠️ E A COLUNA DA PROTEÍNA SE CONFERE PELA CALORIA, que é física e
     não aritmética de ninguém: proteína e carboidrato dão 4 kcal por
     grama, gordura dá 9. Se a soma não chega perto da caloria publicada,
     alguma coluna foi lida no lugar de outra.

     ⚠️ A PRIMEIRA VERSÃO CONFERIA PELO %VD AO LADO DO VALOR, e teve de
     sair: a tabela do Burger King erra a própria porcentagem em várias
     linhas. O Mega Stacker traz "56 (121%)" — 56 g de proteína seriam
     112% dos 50 g de referência, não 121% —, e a conta da caloria mostra
     que o errado é a porcentagem: 56 g de proteína, 49 de carboidrato e
     68 de gordura dão 1.032 kcal, e a tabela publica 1.054. Conferir
     pelo número que a fonte errou jogava fora o sanduíche com mais
     proteína do cardápio. */
  const porMacro = 4 * prot + 4 * (carb ?? 0) + 9 * (gord ?? 0);
  if (Math.abs(porMacro - kcal) > Math.max(40, kcal * 0.15)) {
    descartados.push(nome + ': os macros não dão a caloria (' + Math.round(porMacro) + ' contra ' + kcal + ')');
    continue;
  }

  itens.push({ nome, gramas: n(peso[1]), valores: [prot, kcal, carb ?? '', gord ?? '', fibra ?? '', sodio ?? ''] });
}

/* ⚠️⚠️ O MESMO PRODUTO EM TRÊS TAMANHOS TEM DE TER A MESMA COMIDA
   DENTRO, e é a última conferência — a única que pega uma linha certa
   pregada no nome errado.

   O "BK® Chicken – 4 unidades" vem com 40 g e 1 g de proteína. Os irmãos
   dele vêm com 111 g e 14 g, e 186 g e 23 g — dezoito gramas e um pouco
   mais de um grama de proteína por unidade, os dois. A linha de quatro
   unidades passa em todas as outras contas, porque ela é coerente
   consigo mesma: o que está errado é ela estar debaixo desse nome.

   Então cada família — o nome sem o tamanho — é comparada pela proteína
   por grama, e quem destoa por mais de duas vezes e meia da mediana dos
   irmãos fica de fora. Uma família de um membro só não tem com o que se
   comparar, e passa. */
const familia = (nome) => nome.replace(/\s*[–—-]\s*.*$/, '').trim();
const porFamilia = new Map();
for (const x of itens) {
  const k = familia(x.nome);
  if (!porFamilia.has(k)) porFamilia.set(k, []);
  porFamilia.get(k).push(x);
}
const sobreviventes = [];
for (const [k, grupo] of porFamilia) {
  if (grupo.length < 2) { sobreviventes.push(...grupo); continue; }
  const dens = grupo.map((x) => x.valores[0] / x.gramas).sort((a, b) => a - b);
  const meio = dens[Math.floor(dens.length / 2)];
  for (const x of grupo) {
    const d = x.valores[0] / x.gramas;
    /* Família sem proteína nenhuma não tem o que comparar: a diferença
       entre 0,0 e 0,4 g é ruído de arredondamento, e não coluna trocada. */
    const vale = meio * x.gramas >= 2;
    const fora = vale && meio > 0 && (d > meio * 2.5 || d < meio / 2.5);
    if (fora) descartados.push(x.nome + ': destoa dos outros tamanhos de "' + k + '" (' + d.toFixed(3) + ' contra ' + meio.toFixed(3) + ' g de proteína por grama)');
    else sobreviventes.push(x);
  }
}
itens.length = 0;
itens.push(...sobreviventes);

/* ---------- o arquivo ---------- */

const hoje = new Date().toLocaleDateString('pt-BR');

const cabecalho = `# COLHEITA — Burger King Brasil, tabela nutricional oficial
#
# Fonte: ${FONTE}
# Colhida em ${hoje} por scripts/colher-bk.mjs, que baixa o PDF e lê a
# tabela. Para atualizar, rode o script de novo.
#
# ⚠️ OS VALORES SÃO DA PORÇÃO, E O PESO DELA É PUBLICADO. A coluna
# "Porção (unid.)" diz 325 g para o Whopper, e os números da linha são
# desse sanduíche inteiro — não de 100 g. É mais do que o McDonald's
# publica, e menos do que o Habib's: lá vêm as duas bases.
#
# ⚠️ A REDE NÃO LIGA ALÉRGENO A PRODUTO. O PDF traz a lista de alérgenos
# por INGREDIENTE — o queijo cheddar, o picles, a calda de morango — e
# não por sanduíche. Montar o alérgeno do produto exigiria saber a receita
# dele, que a tabela não dá. Por isso a coluna de alérgeno não existe
# aqui, e as restrições saem do nome, no gerador.
#
# colunas: slug, nome, rede, proteína g/porção, kcal/porção,
#          carboidrato g, gordura g, fibra g, sódio mg, peso da porção g
#
`;

const linhasTsv = itens.map((x) => [slug(x.nome), x.nome, 'bk', ...x.valores, x.gramas].join('\t'));

writeFileSync(SAIDA, cabecalho + linhasTsv.join('\n') + '\n');
process.stderr.write(itens.length + ' itens gravados · ' + descartados.length + ' descartados\n');
for (const d of descartados.slice(0, 8)) process.stderr.write('  ' + d + '\n');
