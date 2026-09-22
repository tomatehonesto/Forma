/* ============================================================
   GERA A CONFERÊNCIA DE FORMA de um idioma em tradução

     node scripts/conferencia.mjs es-419

   ⚠️ ELA PRECISA VALER ARQUIVO A ARQUIVO, e não só no fim. Um idioma novo
   são trinta arquivos e mil e trezentas chaves; esperar o `CATALOGOS`
   cobrar a forma significa descobrir no trigésimo arquivo um erro que já
   foi repetido vinte e nove vezes.

   ⚠️ E ELA SE GERA, e não se edita à mão. A primeira versão foi escrita a
   mão e saiu com quatro módulos declarados e um só na lista de saída — o
   tipo de erro que não quebra nada e faz o eslint reclamar de variável não
   usada seis meses depois.

   ⚠️⚠️ A FIRMA NÃO É A TRADUÇÃO. Isto compilar prova que não falta chave e
   que nenhum parâmetro mudou de lugar. NÃO prova que o idioma está bem
   escrito, nem que a cópia clínica diz o que tem de dizer.
   ============================================================ */

import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const local = process.argv[2];
if (!local) {
  console.error('uso: node scripts/conferencia.mjs <local>   (ex.: es-419)');
  process.exit(1);
}

const dir = join(RAIZ, 'src', 'textos', local);
const modulos = readdirSync(dir)
  .filter((f) => f.endsWith('.ts') && !f.startsWith('_'))
  .map((f) => f.replace(/\.ts$/, ''))
  .sort();

const cabeca = `/* ============================================================
   A CONFERÊNCIA DE FORMA — ${local} tem de ter a assinatura do português

   ⚠️⚠️ ESTE ARQUIVO NÃO PRODUZ NADA, E É O QUE IMPEDE A TRADUÇÃO DE SAIR
   TORTA. Cada linha abaixo diz ao compilador: este módulo satisfaz
   exatamente o tipo do módulo em português — mesmas chaves, mesmos
   parâmetros, mesma ordem, mesmos tipos.

   ⚠️ Ele existe separado do \`CATALOGOS\` de propósito: a conferência
   precisa valer ENQUANTO a tradução está sendo escrita, arquivo por
   arquivo. Um erro descoberto no sexto arquivo é um erro; o mesmo erro
   descoberto no trigésimo é um padrão repetido vinte e nove vezes.

   ⚠️⚠️ E A ASSINATURA NÃO É A TRADUÇÃO. Isto compilar prova que não falta
   chave e que nenhum parâmetro mudou de lugar. NÃO prova que o idioma
   está bem escrito, nem que a cópia clínica diz o que tem de dizer — isso
   quem confere é quem fala o idioma. Ver PENDENCIAS.

   ⚠️ GERADO por scripts/conferencia.mjs. Não edite à mão.
   ============================================================ */

`;

const linhas = [
  cabeca,
  ...modulos.map((m) => `import type { ${m} as ${m}Pt } from '../pt-BR/${m}';`),
  '',
  ...modulos.map((m) => `import { ${m} } from './${m}';`),
  '',
  ...modulos.map((m) => `const _${m}: typeof ${m}Pt = ${m};`),
  '',
  `export const conferidos = [${modulos.map((m) => `_${m}`).join(', ')}];`,
  '',
].join('\n');

writeFileSync(join(dir, '_conferencia.ts'), linhas.replace(/\n/g, '\r\n'));
/* ⚠️ O TOTAL SAI DO PORTUGUÊS, e era 30 escrito em duro — no dia em
   que um módulo novo entrou, a linha passou a dizer '31 de 30'. O
   português é o contrato; contar de lá é contar do contrato. */
const noPortugues = readdirSync(join(RAIZ, 'src', 'textos', 'pt-BR'))
  .filter((f) => f.endsWith('.ts') && !f.startsWith('_')).length;
console.log(`${local}: ${modulos.length} de ${noPortugues} módulos conferidos`);
