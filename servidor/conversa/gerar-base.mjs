/* A base de conhecimento da conversa, de `servidor/conhecimento/*.md`
   para `servidor/conversa/base.ts`.

     node servidor/conversa/gerar-base.mjs

   ⚠️ POR QUE UM ARQUIVO GERADO, e não ler os .md em tempo de execução: a
   Vercel empacota o que a função importa, e um `readFileSync` de uma
   pasta ao lado depende de configuração de empacotamento para o arquivo
   ir junto. Uma string num .ts vai junto sempre. A sonda dos primeiros
   passos confere que o gerado está em dia com os .md. */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const PASTA = join(AQUI, '..', 'conhecimento');

export function montarBase() {
  return readdirSync(PASTA)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => `<documento nome="${f.replace(/\.md$/, '')}">\n${readFileSync(join(PASTA, f), 'utf8').replace(/\r\n/g, '\n').trim()}\n</documento>`)
    .join('\n\n');
}

export const conteudoDoArquivo = (base) =>
  `/* GERADO por servidor/conversa/gerar-base.mjs, a partir de
   servidor/conhecimento/*.md. Não edite à mão: edite o .md e rode o
   gerador. */
export const BASE = ${JSON.stringify(base)};
`;

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const base = montarBase();
  writeFileSync(join(AQUI, 'base.ts'), conteudoDoArquivo(base));
  console.log(`base.ts: ${base.length} caracteres`);
}
