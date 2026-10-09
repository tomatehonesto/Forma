/* ============================================================
   SUBIR O BANCO — o dev primeiro, a trava, e só então a produção

     node scripts/subir-banco.mjs            — os dois, nesta ordem
     node scripts/subir-banco.mjs --so-dev   — para depois do dev
     node scripts/subir-banco.mjs --ensaio   — mostra o que subiria nos dois, sem escrever nada

   A ordem, e por que ela não se inverte:

     1. O DEV. As migrações que ainda não subiram passam pela trava das
        regras no modo ensaio (`regras.mjs --ensaio`: sobem, são provadas
        e desfeitas numa transação só); depois o `db push`; depois a trava
        inteira de novo, contra o banco como ficou. Qualquer falha para
        tudo aqui — a produção nem é olhada.
     2. AS FUNÇÕES no dev (`supabase/functions`, todas). Elas não sobem
        com as migrações, e esquecer uma é "Apagar meus dados" falhando.
     3. A PRODUÇÃO, por um diretório fora do repositório (scripts/
        producao.mjs): o ensaio do push, que lista o que subiria; a
        confirmação digitada; o push e as funções. A semente e a trava não
        existem nesse diretório.

   Uma migração nunca chega à produção sem ter passado pela trava no dev
   — é a razão de existirem dois projetos (decidido com o dono em
   09/10/2026, PENDENCIAS e o plano do Supabase).
   ============================================================ */
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { RAIZ, REF_DEV, conferirProjeto, migracoesPendentes } from './banco-dev.mjs';
import {
  REF_PRODUCAO, cliNaTela, cliCalada, jsonDaSaida, diretorioDaProducao, apagarDiretorio,
  conferirRepositorioNoDev, confirmarProducao,
} from './producao.mjs';

const ENSAIO = process.argv.includes('--ensaio');
const SO_DEV = process.argv.includes('--so-dev');

const titulo = (t) => console.log(`\n━━━ ${t} ━━━`);
const parar = (msg, codigo = 1) => { console.error(`\n  ✖ ${msg}\n`); conferirRepositorioNoDev(); process.exit(codigo); };
const trava = (...args) =>
  spawnSync(process.execPath, [path.join(RAIZ, 'scripts', 'regras.mjs'), ...args], { cwd: RAIZ, stdio: 'inherit' }).status;

conferirProjeto();

/* ---------------- 1. o dev ---------------- */
titulo(`O DEV (${REF_DEV})`);
let pendentes;
let devRespondeu = true;
try {
  pendentes = migracoesPendentes();
} catch (e) {
  devRespondeu = false;
  const msg = `não consegui ler as migrações do morphi-dev — ele está pausado? Reative no painel.\n${String(e.message).slice(0, 600)}`;
  if (!ENSAIO) parar(msg);
  console.error(`  ⚠️  ${msg}\n  (no ensaio, sigo para a produção só para mostrar o que ela tem)`);
}

if (devRespondeu) {
  if (pendentes.length === 0) {
    console.log('  o dev já tem todas as migrações');
  } else {
    console.log(`  ${pendentes.length} migração(ões) por subir:`);
    for (const m of pendentes) console.log(`    • ${m.nome}`);
    console.log('\n  a trava, no modo ensaio (sobe, prova e desfaz):');
    if (trava('--ensaio') !== 0) parar('a trava falhou no ensaio: nada subiu, nem no dev.');
    if (!ENSAIO) {
      console.log('\n  o push no dev:');
      if (cliNaTela(['db', 'push', '--linked']) !== 0) parar('o push no dev falhou.');
      console.log('\n  a trava, contra o dev como ficou:');
      if (trava() !== 0) parar('a trava falhou depois do push no dev. A produção NÃO sobe: conserte no dev primeiro.');
    }
  }
  if (!ENSAIO) {
    console.log('\n  as funções no dev:');
    if (cliNaTela(['functions', 'deploy', '--use-api', '--project-ref', REF_DEV]) !== 0) {
      parar('a publicação das funções no dev falhou.');
    }
  }
}

if (SO_DEV) {
  conferirRepositorioNoDev();
  console.log('\n  --so-dev: a produção fica para depois.\n');
  process.exit(0);
}

/* ---------------- 2. a produção ---------------- */
titulo(`A PRODUÇÃO (${REF_PRODUCAO})`);
let dir;
try {
  dir = diretorioDaProducao();
  const ensaio = cliCalada(['db', 'push', '--linked', '--dry-run', '--workdir', dir]);
  const plano = jsonDaSaida(ensaio.saida, '{"upToDate"');
  if (ensaio.status !== 0 || !plano) throw new Error(`o ensaio do push na produção falhou:\n${ensaio.saida}`);
  if (plano.seeds?.length) throw new Error(`o ensaio da produção quer rodar semente (${plano.seeds.join(', ')}). Nada foi feito.`);

  const migracoes = plano.migrations ?? [];
  console.log(migracoes.length
    ? `  ${migracoes.length} migração(ões) por subir:\n${migracoes.map((m) => `    • ${m}`).join('\n')}`
    : '  a produção já tem todas as migrações');
  console.log('  e as funções de supabase/functions, todas, de novo');

  if (ENSAIO) {
    console.log('\n  --ensaio: nada foi escrito.\n');
  } else if (!(await confirmarProducao(migracoes.length
    ? `Vão ${migracoes.length} migração(ões) e as funções para o banco das pessoas.`
    : 'Vão só as funções, de novo, para a produção.'))) {
    console.log('\n  cancelado: nada foi escrito na produção.\n');
  } else {
    if (migracoes.length) {
      console.log('\n  o push na produção:');
      if (cliNaTela(['db', 'push', '--linked', '--yes', '--workdir', dir]) !== 0) {
        throw new Error('o push na produção falhou — conferir no painel o que chegou a subir.');
      }
    }
    console.log('\n  as funções na produção:');
    if (cliNaTela(['functions', 'deploy', '--use-api', '--project-ref', REF_PRODUCAO, '--workdir', dir]) !== 0) {
      throw new Error('a publicação das funções na produção falhou.');
    }
    console.log('\n  ✔ a produção está em dia.\n');
  }
} catch (e) {
  if (dir) apagarDiretorio(dir);
  parar(e.message);
}
apagarDiretorio(dir);
conferirRepositorioNoDev();
