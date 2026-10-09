/* ============================================================
   SUBIR A CONFIGURAÇÃO — supabase/config.toml nos dois projetos

     node scripts/subir-config.mjs            — mostra a diferença de cada um e sobe, dev primeiro
     node scripts/subir-config.mjs --diff     — só mostra
     node scripts/subir-config.mjs --so-dev   — só o dev

   O `config.toml` é a fonte da autenticação, da API e do armazenamento
   dos dois projetos (ver o alto dele): a base vale para os dois, e os
   blocos [remotes.*] dizem o que muda em cada um. Este script mostra a
   diferença de cada projeto e chama o `config push`, que pergunta, bloco
   a bloco, antes de escrever. Na produção, antes disso, a palavra
   digitada.

   ⚠️ TRÊS COISAS QUE O DIFF NÃO MOSTRA:

     · os segredos (senha do SMTP, chaves dos provedores) — a API não os
       devolve. Eles não estão no arquivo, e o script se recusa a rodar se
       aparecer um: um push com a variável vazia grava o vazio;
     · o limite de e-mails por hora — com o SMTP fora do arquivo, a CLI
       não o compara nem o sobe;
     · o CORPO do e-mail (supabase/modelos/codigo.html) — o diff compara
       o assunto, não o corpo. Mudou o corpo? A prova é um código de
       verdade chegando (supabase/modelos/README.md).

   O repositório continua ligado ao dev: `--project-ref` não muda a
   ligação (conferido no fim, por garantia).
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ, REF_DEV } from './banco-dev.mjs';
import {
  REF_PRODUCAO, cliNaTela, cliCalada, jsonDaSaida, conferirRepositorioNoDev, confirmarProducao,
} from './producao.mjs';

const SO_DIFF = process.argv.includes('--diff');
const SO_DEV = process.argv.includes('--so-dev');

/* Nenhum segredo declarado: `pass`, `secret` ou `auth_token` fora de comentário. */
const toml = fs.readFileSync(path.join(RAIZ, 'supabase', 'config.toml'), 'utf8');
const segredos = toml.split(/\r?\n/)
  .map((l, i) => ({ l, n: i + 1 }))
  .filter(({ l }) => /^\s*(pass|secret|auth_token|secret_key)\s*=/.test(l) && !/^\s*#/.test(l));
if (segredos.length) {
  console.error('\n  ✖ O config.toml declara segredo — um push gravaria o valor dele (ou o vazio) por cima do painel:');
  for (const { l, n } of segredos) console.error(`    linha ${n}: ${l.trim()}`);
  console.error('  Tire a linha (o segredo mora no painel) e rode de novo.\n');
  process.exit(1);
}

const alvos = [
  { nome: 'o dev', ref: REF_DEV, producao: false },
  ...(SO_DEV ? [] : [{ nome: 'a produção', ref: REF_PRODUCAO, producao: true }]),
];

let falhou = false;
for (const alvo of alvos) {
  console.log(`\n━━━ ${alvo.nome.toUpperCase()} (${alvo.ref}) ━━━`);

  const { status, saida } = cliCalada(['config', 'diff', '--project-ref', alvo.ref, '--output-format', 'json']);
  const diff = jsonDaSaida(saida, '{"schema_version"');
  if (status !== 0 || !diff) {
    console.error(`  ✖ não consegui comparar — o projeto está pausado?\n${saida.slice(0, 800)}`);
    falhou = true;
    continue;
  }

  /* O que só existe no servidor (remote_only) o push não toca. */
  const escritas = diff.changes.filter((c) => c.class !== 'remote_only');
  console.log(`  bloco usado: ${diff.target?.local_scope ?? '?'}`);
  if (!escritas.length) {
    console.log('  nada a subir: o projeto já tem o que o arquivo declara');
    continue;
  }
  console.log(`  ${escritas.length} diferença(s) que o push escreveria:`);
  for (const c of escritas) {
    const p = c.path.join('.');
    const valor = /pass|secret|content/i.test(p) ? '(oculto)' : `${JSON.stringify(c.remote)} → ${JSON.stringify(c.local)}`;
    console.log(`    • ${p}: ${valor}`);
  }
  if (SO_DIFF) continue;

  if (alvo.producao && !(await confirmarProducao('O push vai mudar a configuração de login do app das pessoas.'))) {
    console.log('  cancelado: nada foi escrito na produção.');
    continue;
  }
  console.log('\n  o push (a CLI pergunta antes de cada bloco):');
  if (cliNaTela(['config', 'push', '--project-ref', alvo.ref]) !== 0) {
    console.error('  ✖ o push falhou.');
    falhou = true;
  }
}

console.log('\n  lembrete: o corpo do e-mail não entra no diff — mudou supabase/modelos/codigo.html? Prove com um código de verdade.');
const ligado = conferirRepositorioNoDev();
process.exit(falhou || !ligado ? 1 : 0);
