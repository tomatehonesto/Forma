/* ============================================================
   A PRODUÇÃO DO SUPABASE — o projeto `morphi`, e como chegar nela sem
   ligar o repositório a ela

   O repositório fica SEMPRE ligado ao morphi-dev: é o que a trava das
   regras e a semente conferem antes de rodar (scripts/banco-dev.mjs).
   Ligar o repositório à produção, mesmo por um minuto, abre a janela em
   que outra sessão roda a semente — médicos inventados, códigos de
   convite fáceis — no banco das pessoas.

   Por isso a produção se alcança de dois jeitos, e só destes:

     · pela API de gestão com `--project-ref`, que não muda a ligação
       (o `config diff`, o `config push`, o `functions deploy`);
     · por um diretório FORA do repositório, montado aqui, com o que pode
       ir para a produção — o config.toml com a semente desligada, as
       migrações, as funções e o modelo do e-mail — e nada da semente nem
       da trava. É lá que o `db push` roda, com `--workdir`.

   Depois de qualquer passo, `conferirRepositorioNoDev()` confere que a
   ligação do repositório continua sendo o dev.
   ============================================================ */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline/promises';
import { spawnSync } from 'node:child_process';
import { RAIZ, REF_DEV } from './banco-dev.mjs';

export const REF_PRODUCAO = 'jsyrmhzjwuckmixyvsnn';

const CLI = path.join(RAIZ, 'node_modules', 'supabase', 'dist', 'supabase.js');

/** Roda a CLI na tela, para a pessoa ver e responder às perguntas dela. */
export function cliNaTela(args) {
  return spawnSync(process.execPath, [CLI, ...args], { cwd: RAIZ, stdio: 'inherit' }).status;
}

/** Roda a CLI em silêncio e devolve o código de saída e tudo o que ela escreveu. */
export function cliCalada(args) {
  const r = spawnSync(process.execPath, [CLI, ...args], {
    cwd: RAIZ, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  });
  return { status: r.status, saida: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}

/** O JSON que a CLI escreve no fim da saída, a partir da chave que o abre. */
export function jsonDaSaida(saida, comeco) {
  const ini = saida.indexOf(comeco);
  if (ini < 0) return null;
  try {
    return JSON.parse(saida.slice(ini, saida.lastIndexOf('}') + 1));
  } catch {
    return null;
  }
}

/** O config.toml com a semente desligada. Falha alto se não achar o bloco:
    um diretório da produção com a semente ligada é o erro que isto existe
    para impedir. */
function semSemente(toml) {
  const bloco = /\[db\.seed\][\s\S]*?(?=\n\[)/;
  const achado = toml.match(bloco);
  if (!achado) throw new Error('não achei o bloco [db.seed] no config.toml');
  const desligado = achado[0]
    .replace(/^enabled\s*=\s*true\s*$/m, 'enabled = false')
    .replace(/^sql_paths\s*=.*$/m, 'sql_paths = []');
  if (!/^enabled = false$/m.test(desligado) || !/^sql_paths = \[\]$/m.test(desligado)) {
    throw new Error('não consegui desligar a semente no config.toml da produção');
  }
  return toml.replace(bloco, desligado);
}

/** Monta o diretório da produção, fora do repositório, e o liga ao `morphi`.
    Devolve o caminho; quem chama apaga com `apagarDiretorio`. */
export function diretorioDaProducao() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'morphi-producao-'));
  const sb = path.join(dir, 'supabase');
  fs.mkdirSync(sb);
  const toml = fs.readFileSync(path.join(RAIZ, 'supabase', 'config.toml'), 'utf8');
  fs.writeFileSync(path.join(sb, 'config.toml'), semSemente(toml));
  for (const pasta of ['migrations', 'functions', 'modelos']) {
    fs.cpSync(path.join(RAIZ, 'supabase', pasta), path.join(sb, pasta), { recursive: true });
  }

  const { status, saida } = cliCalada(['link', '--project-ref', REF_PRODUCAO, '--workdir', dir]);
  const ligado = path.join(sb, '.temp', 'project-ref');
  const ref = fs.existsSync(ligado) ? fs.readFileSync(ligado, 'utf8').trim() : '';
  if (status !== 0 || ref !== REF_PRODUCAO) {
    apagarDiretorio(dir);
    throw new Error(`não consegui ligar o diretório da produção:\n${saida}`);
  }
  return dir;
}

export function apagarDiretorio(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

/** Avisa alto se a ligação do repositório deixou de ser o dev. */
export function conferirRepositorioNoDev() {
  const arq = path.join(RAIZ, 'supabase', '.temp', 'project-ref');
  const ref = fs.existsSync(arq) ? fs.readFileSync(arq, 'utf8').trim() : '';
  if (ref !== REF_DEV) {
    console.error(
      `\n  ⚠️⚠️  O REPOSITÓRIO ESTÁ LIGADO A "${ref || 'nenhum'}", e não ao morphi-dev.` +
      `\n  Religue antes de qualquer outra coisa: npx supabase link --project-ref ${REF_DEV}\n`,
    );
    return false;
  }
  return true;
}

/** A confirmação da produção: digitar a palavra, e não apertar Enter. */
export async function confirmarProducao(oQue) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const r = await rl.question(`\n  ${oQue}\n  Para seguir na PRODUÇÃO, digite "produção" (qualquer outra coisa cancela): `);
    return ['produção', 'producao'].includes(r.trim().toLowerCase());
  } finally {
    rl.close();
  }
}
