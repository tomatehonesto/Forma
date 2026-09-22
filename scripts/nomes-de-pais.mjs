/* ============================================================
   OS NOMES DE PAÍS, NOS CINCO IDIOMAS — gerador

   ⚠️⚠️ ISTO GERA CÓDIGO, e o código gerado entra no repositório. Não é
   cerimônia: o aplicativo NÃO USA `Intl` EM LUGAR NENHUM em tempo de
   execução — `logic/local` escreve data e número com tabelas próprias —,
   não há polyfill instalado, e o Hermes não garante `Intl.DisplayNames`.
   Resolver o nome no aparelho seria apostar num motor que pode não ter a
   peça, e a aposta só se perde no aparelho de alguém.

   Aqui, no Node com ICU completo, a tabela sai pronta e vira dado.

   Rodar quando um país entrar ou sair da lista:

     node scripts/nomes-de-pais.mjs

   Ele lê os CÓDIGOS de src/logic/pais.ts e reescreve
   src/logic/paisesNomes.ts inteiro. Rodar duas vezes não muda nada — se
   mudar, o diff é a resposta.
   ============================================================ */

import { readFileSync, writeFileSync } from 'node:fs';

const RAIZ = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const LOCAIS = ['pt-BR', 'en-US', 'es-419', 'fr-FR', 'de-DE'];

/* Os códigos vêm da lista curada, que é quem decide QUEM entra. Este
   script só responde COMO cada um se escreve. */
const fonte = readFileSync(`${RAIZ}src/logic/pais.ts`, 'utf8');
const bloco = fonte.slice(fonte.indexOf('export const PAISES'), fonte.indexOf('];', fonte.indexOf('export const PAISES')));
/* ⚠️ OS COMENTÁRIOS DE DENTRO DO BLOCO SAEM ANTES, e não é zelo: um deles
   explica que `temRedeParceira` pergunta `pais === 'BR'`, e o 'BR' dali
   entrava na lista como se fosse um país a mais. O Brasil apareceu duas
   vezes na primeira geração. */
const semComentarios = bloco.replace(/\/\*[^]*?\*\//g, '');
const codigos = [...semComentarios.matchAll(/'([A-Z]{2})'/g)].map((m) => m[1]);
if (codigos.length < 200) throw new Error(`achei só ${codigos.length} códigos — a âncora mudou?`);
const repetidos = codigos.filter((c, i) => codigos.indexOf(c) !== i);
if (repetidos.length) throw new Error(`código repetido na lista: ${[...new Set(repetidos)].join(' ')}`);

const linhas = [];
for (const l of LOCAIS) {
  const nomes = new Intl.DisplayNames([l], { type: 'region' });
  const pares = [];
  for (const c of codigos) {
    const n = nomes.of(c);
    /* ⚠️ SEM DADO, O CÓDIGO VOLTA COMO NOME — "AD" em vez de "Andorra". É
       silencioso, e por isso é erro e não recuo: se um dia o ICU do Node
       não souber um país, este script para em vez de gravar a sigla. */
    if (!n || n === c) throw new Error(`sem nome para ${c} em ${l}`);
    pares.push(`${c}: ${JSON.stringify(n)}`);
  }

  let linha = '   ';
  const corpo = [];
  for (const par of pares) {
    const item = ` ${par},`;
    if ((linha + item).length > 92) { corpo.push(linha); linha = '   '; }
    linha += item;
  }
  if (linha.trim()) corpo.push(linha);
  linhas.push(`  ${JSON.stringify(l)}: {\n${corpo.join('\n')}\n  },`);
}

const saida = `/* ============================================================
   OS NOMES DE PAÍS, NOS CINCO IDIOMAS

   ⚠️⚠️ ARQUIVO GERADO. Não edite à mão: rode

     node scripts/nomes-de-pais.mjs

   e ele reescreve tudo. O que se edita é a LISTA DE CÓDIGOS, em
   logic/pais — quem entra é decisão; como se escreve é o CLDR.

   ⚠️ E ELE É GERADO, E NÃO RESOLVIDO NO APARELHO, porque o aplicativo não
   usa \`Intl\` em tempo de execução e o Hermes não garante
   \`Intl.DisplayNames\`. Ver o alto do gerador.
   ============================================================ */

export const NOMES_DE_PAIS: Record<string, Record<string, string>> = {
${linhas.join('\n\n')}
};
`;

writeFileSync(`${RAIZ}src/logic/paisesNomes.ts`, saida);
console.log(`ok — ${codigos.length} países × ${LOCAIS.length} idiomas`);
