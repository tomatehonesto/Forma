/* ============================================================
   O PROJETO DE DESENVOLVIMENTO DO SUPABASE — e só ele

   O que scripts/regras.mjs e scripts/semente.mjs têm em comum: conferir
   que a CLI está ligada ao morphi-dev antes de qualquer coisa, e rodar
   SQL nele pela API de gestão (`supabase db query --linked`), com o login
   de quem está na máquina — sem senha do banco e sem chave secreta.

   ⚠️ A SEMENTE TEM MÉDICOS INVENTADOS, E A TRAVA CRIA CONTAS DE TESTE.
   Nenhuma das duas pode chegar à produção. Por isso a conferência do
   projeto é a primeira linha dos dois scripts, e não um aviso no README.
   ============================================================ */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const REF_DEV = 'kjagyoqykhysvasauzgo';

/** Sai sem fazer nada se o projeto ligado não for o de desenvolvimento. */
export function conferirProjeto() {
  const arq = path.join(RAIZ, 'supabase', '.temp', 'project-ref');
  const ref = fs.existsSync(arq) ? fs.readFileSync(arq, 'utf8').trim() : '';
  if (ref !== REF_DEV) {
    console.error(
      `\n  ⚠️  O projeto ligado é "${ref || 'nenhum'}", e não o de desenvolvimento (${REF_DEV}).` +
      '\n  Isto só roda no morphi-dev. Nada foi feito.\n',
    );
    process.exit(2);
  }
}

/* A CLI do projeto (devDependency fixada) é um script de Node: roda pelo
   próprio Node, sem shell no meio. */
const CLI = path.join(RAIZ, 'node_modules', 'supabase', 'dist', 'supabase.js');

/** Roda a CLI com esses argumentos e devolve o código de saída e tudo o que ela escreveu. */
export function rodarCli(args) {
  const r = spawnSync(process.execPath, [CLI, ...args], {
    cwd: RAIZ,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  return { status: r.status, saida: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}

/** Roda um SQL no projeto ligado, pela API de gestão. Um arquivo com várias
    instruções roda numa transação só: um erro no meio desfaz o arquivo inteiro. */
export function rodarSql(sql) {
  const arq = path.join(os.tmpdir(), `morphi-${process.pid}-${Date.now()}.sql`);
  fs.writeFileSync(arq, sql);
  try {
    return rodarCli(['db', 'query', '--linked', '-f', arq]);
  } finally {
    fs.rmSync(arq, { force: true });
  }
}

/** As migrações de supabase/migrations que ainda não subiram para o projeto ligado. */
export function migracoesPendentes() {
  const { saida } = rodarCli(['migration', 'list', '--linked']);
  const ini = saida.indexOf('{"migrations"');
  if (ini < 0) throw new Error(`não consegui ler a lista de migrações:\n${saida}`);
  const { migrations } = JSON.parse(saida.slice(ini, saida.lastIndexOf('}') + 1));
  const subiram = new Set(migrations.filter((m) => m.remote).map((m) => m.remote));
  const pasta = path.join(RAIZ, 'supabase', 'migrations');
  return fs.readdirSync(pasta)
    .filter((a) => a.endsWith('.sql') && !subiram.has(a.slice(0, 14)))
    .sort()
    .map((a) => ({ nome: `supabase/migrations/${a}`, sql: fs.readFileSync(path.join(pasta, a), 'utf8') }));
}

/* A mensagem de um erro do banco, como a CLI a escreve: um JSON cuja
   mensagem traz outro JSON, com a mensagem do Postgres dentro —
     {"_tag":"Error","error":{"message":"unexpected status 400: {\"message\":\"Failed to run sql query: ERROR:  P0001: …\"}"}}
   Devolve a mensagem do Postgres sem as duas camadas, ou a saída inteira
   quando não há erro para desembrulhar. */
export function mensagemDoBanco(saida) {
  const ini = saida.indexOf('{"_tag"');
  if (ini < 0) return saida;
  try {
    let msg = JSON.parse(saida.slice(ini, saida.lastIndexOf('}') + 1))?.error?.message ?? saida;
    const dentro = msg.indexOf('{');
    if (dentro >= 0) {
      try { msg = JSON.parse(msg.slice(dentro)).message ?? msg; } catch { /* fica a de fora */ }
    }
    return msg;
  } catch {
    return saida;
  }
}

/** O endereço e a chave PÚBLICA do projeto de desenvolvimento, de .env.development. */
export function variaveisPublicas() {
  const txt = fs.readFileSync(path.join(RAIZ, '.env.development'), 'utf8');
  const env = {};
  for (const linha of txt.split(/\r?\n/)) {
    const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return { url: env.EXPO_PUBLIC_SUPABASE_URL, chave: env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY };
}
