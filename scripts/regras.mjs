/* ============================================================
   A TRAVA DAS REGRAS DE ACESSO

     node scripts/regras.mjs              — o banco como está
     node scripts/regras.mjs --ensaio     — antes de subir uma migração

   ⚠️⚠️ UMA REGRA ERRADA EXPÕE DADO DE SAÚDE. ⚠️⚠️

   Três partes:

     1. A PORTA DA FRENTE — a API de verdade, com a chave pública, sem
        login: a vitrine responde, o diário não. É o que prova as
        permissões e a exposição das tabelas, e não só as regras.
     2. AS REGRAS — supabase/testes/regras.sql, que cria as contas de
        teste, afirma quem lê e quem escreve o quê, e desfaz tudo no fim.
     3. OS MUTANTES — o mesmo arquivo, uma vez com cada erro plantado de
        supabase/testes/mutantes/. Cada um tem de derrubar pelo menos uma
        afirmação. Mutante que passa é regra sem trava.

   E uma conferência a mais: a lista de códigos de exemplo que o
   aplicativo mostra na dica da folha é a mesma da semente.

   O ENSAIO. Com `--ensaio`, as migrações que ainda não subiram e a
   semente vão no mesmo envio das regras, antes delas — e o `raise` do fim
   desfaz tudo junto. É como uma migração nova é provada ANTES do
   `db push`: sem Docker não há banco local, e o esquema do morphi-dev
   não pode ser o lugar das tentativas. A porta da frente fica de fora do
   ensaio, porque a API ainda não enxerga o que não subiu.

   ⚠️ Só roda com a CLI ligada ao morphi-dev (ver scripts/banco-dev.mjs).
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';
import {
  RAIZ, conferirProjeto, rodarSql, variaveisPublicas, mensagemDoBanco, migracoesPendentes,
} from './banco-dev.mjs';

conferirProjeto();
const ENSAIO = process.argv.includes('--ensaio');

let falhas = 0;
const ok = (certo, o, detalhe) => {
  console.log(`${certo ? '  ok  ' : '  NÃO '} ${o}${!certo && detalhe ? `\n         ${detalhe}` : ''}`);
  if (!certo) falhas += 1;
};

const { url, chave } = variaveisPublicas();


/* ---------------- 1. a porta da frente ---------------- */
async function pedir(caminho, init = {}) {
  const r = await fetch(`${url}${caminho}`, {
    ...init,
    headers: { apikey: chave, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });
  let corpo = null;
  try { corpo = await r.json(); } catch { /* sem corpo */ }
  return { status: r.status, corpo };
}
const mostrar = (r) => `status ${r.status}, ${JSON.stringify(r.corpo)?.slice(0, 200)}`;

if (!ENSAIO) {
  console.log('\nA PORTA DA FRENTE — a API de verdade, com a chave pública e sem login');
  const vitrine = await pedir('/rest/v1/clinicas?select=id,nome&limit=1');
  ok(vitrine.status === 200, 'a vitrine responde', mostrar(vitrine));
  for (const tabela of ['registros', 'perfis', 'perguntas', 'vinculos', 'convites', 'mensagens']) {
    const r = await pedir(`/rest/v1/${tabela}?select=*&limit=1`);
    ok(r.corpo?.code === '42501', `${tabela} responde 42501`, mostrar(r));
  }
  const conferir = await pedir('/rest/v1/rpc/conferir_convite', {
    method: 'POST', body: JSON.stringify({ codigo: 'NAOEXISTE' }),
  });
  ok(conferir.status === 200 && conferir.corpo === null, 'conferir_convite responde, e não acha o que não existe', mostrar(conferir));
  const usar = await pedir('/rest/v1/rpc/usar_convite', {
    method: 'POST', body: JSON.stringify({ codigo: 'NAOEXISTE', versao_consentimento: 1 }),
  });
  ok(usar.corpo?.code === '42501', 'usar_convite não responde a quem não tem login', mostrar(usar));
  const visao = await pedir('/rest/v1/perguntas_para_leitura?select=*');
  ok(visao.status === 404, 'a visão das perguntas não existe na API', mostrar(visao));
}


/* ---------------- os códigos de exemplo ---------------- */
console.log('\nOS CÓDIGOS DE EXEMPLO — o aplicativo e a semente dizem os mesmos');
const semente = fs.readFileSync(path.join(RAIZ, 'supabase', 'seed.sql'), 'utf8');
const blocoDaSemente = semente.slice(semente.indexOf('insert into public.convites'));
const daSemente = [...blocoDaSemente.matchAll(/^\s*\('([A-Z0-9]+)',/gm)].map((m) => m[1]).sort();
/* Desde a fase 6 do plano, a lista de exemplo mora só na semente; o
   aplicativo guarda os nomes dos códigos, para a dica da folha. */
const rede = fs.readFileSync(path.join(RAIZ, 'src', 'logic', 'rede.ts'), 'utf8');
const ini = rede.indexOf('const CODIGOS_DE_EXEMPLO');
const doAplicativo = [...rede.slice(ini, rede.indexOf('];', ini)).matchAll(/'([A-Z0-9]+)'/g)].map((m) => m[1]).sort();
ok(daSemente.length > 0 && JSON.stringify(daSemente) === JSON.stringify(doAplicativo),
  `os ${daSemente.length} códigos da semente são os do aplicativo`,
  `semente: ${daSemente.join(', ')} · aplicativo: ${doAplicativo.join(', ')}`);


/* ---------------- os tipos de registro ---------------- */
console.log('\nOS TIPOS DE REGISTRO — o banco e a tradução dizem os mesmos');
/* Um tipo que o aparelho sobe e o banco não aceita derruba o lote
   inteiro; um que o banco aceita e o aparelho não conhece desce e fica
   de fora. A regra mora na migração, e a lista, em logic/traducao. */
const migracao = fs.readFileSync(path.join(RAIZ, 'supabase', 'migrations', '20260925162603_perfis_e_registros.sql'), 'utf8');
const doBanco = [...(/registros_tipo_conhecido check \(tipo in \(([^)]*)\)\)/.exec(migracao)?.[1] ?? '').matchAll(/'([a-z_]+)'/g)]
  .map((m) => m[1]).sort();
const traducao = fs.readFileSync(path.join(RAIZ, 'src', 'logic', 'traducao.ts'), 'utf8');
const iniTipos = traducao.indexOf('export const TIPOS_DE_REGISTRO');
const daTraducao = [...traducao.slice(iniTipos, traducao.indexOf('] as const', iniTipos)).matchAll(/'([a-z_]+)'/g)]
  .map((m) => m[1]).sort();
ok(doBanco.length > 0 && JSON.stringify(doBanco) === JSON.stringify(daTraducao),
  `os ${doBanco.length} tipos da regra do banco são os da tradução`,
  `banco: ${doBanco.join(', ')} · tradução: ${daTraducao.join(', ')}`);


/* ---------------- o tempo real acordado ----------------
   `realtime.messages` é particionada por dia, e quem cria as partições é o
   próprio serviço de tempo real, quando alguém se conecta. Sem partição,
   `realtime.send` engole o erro e nenhum aviso chega — e as afirmações de
   tempo real cairiam por causa do ambiente, e não da regra. Uma conexão
   curta, com a chave pública, acorda o serviço. */
function acordarTempoReal() {
  return new Promise((resolve) => {
    const ws = new WebSocket(`${url.replace(/^https:/, 'wss:')}/realtime/v1/websocket?apikey=${chave}&vsn=1.0.0`);
    const desistir = setTimeout(() => { try { ws.close(); } catch { /* já fechou */ } resolve(false); }, 20000);
    ws.addEventListener('open', () => ws.send(JSON.stringify({
      topic: 'realtime:acordar', event: 'phx_join', ref: '1', join_ref: '1',
      payload: { config: { broadcast: { self: false, ack: false }, presence: { key: '' }, private: false } },
    })));
    ws.addEventListener('message', (e) => {
      let m;
      try { m = JSON.parse(String(e.data)); } catch { return; }
      if (m.event === 'phx_reply' && m.ref === '1') {
        setTimeout(() => { clearTimeout(desistir); ws.close(); resolve(true); }, 3000);
      }
    });
    ws.addEventListener('error', () => { clearTimeout(desistir); resolve(false); });
  });
}
console.log('\nO TEMPO REAL');
console.log(`  ${(await acordarTempoReal()) ? 'acordado' : 'não respondeu — as afirmações de tempo real dizem se isso pesou'}`);


/* ---------------- o que vai antes das regras ---------------- */
const antes = [];
if (ENSAIO) {
  const pendentes = migracoesPendentes();
  console.log(`\nO ENSAIO — ${pendentes.length ? pendentes.map((p) => path.basename(p.nome)).join(', ') : 'nenhuma migração pendente'}, e a semente`);
  antes.push(...pendentes, { nome: 'supabase/seed.sql', sql: semente });
}
const prefixo = antes.map((p) => (p.sql.endsWith('\n') ? p.sql : `${p.sql}\n`)).join('');

/* Onde começa cada parte do envio, em linhas, para achar o arquivo de um
   erro de SQL ("LINE n") quando o ensaio quebra. */
function ondeFica(linha) {
  let inicio = 1;
  let achado = null;
  for (const p of [...antes, { nome: 'supabase/testes/regras.sql', sql: '' }]) {
    if (inicio <= linha) achado = { nome: p.nome, linha: linha - inicio + 1 };
    inicio += (p.sql.endsWith('\n') ? p.sql : `${p.sql}\n`).split('\n').length - 1;
  }
  return achado;
}


/* ---------------- 2. as regras ---------------- */
const MARCA = '-- @MUTANTE@';
const molde = fs.readFileSync(path.join(RAIZ, 'supabase', 'testes', 'regras.sql'), 'utf8');
if (!molde.includes(MARCA)) throw new Error(`supabase/testes/regras.sql perdeu a marca ${MARCA}`);

/* O bloco sempre termina num `raise`: PROVA-OK ou PROVA-FALHOU. Qualquer
   outra saída é o SQL quebrado — e isso não conta como mutante pego. */
function provar(mutante = '') {
  const msg = mensagemDoBanco(rodarSql(prefixo + molde.replace(MARCA, mutante)).saida);
  const certo = msg.match(/PROVA-OK (\d+)/);
  if (certo) return { passou: true, total: Number(certo[1]) };
  const errado = msg.match(/PROVA-FALHOU (\d+) de (\d+) \|\| ([\s\S]*?)(?:\nCONTEXT:|$)/);
  if (errado) {
    return {
      passou: false, total: Number(errado[2]),
      quais: errado[3].split(' || ').map((s) => s.trim()).filter(Boolean),
    };
  }
  const linha = msg.match(/LINE (\d+):/);
  const onde = linha ? ondeFica(Number(linha[1])) : null;
  return { passou: false, quebrado: `${msg.trim()}${onde ? `\n         → ${onde.nome}, linha ${onde.linha}` : ''}` };
}

console.log('\nAS REGRAS — supabase/testes/regras.sql');
const limpo = provar();
if (limpo.passou) {
  ok(true, `todas as ${limpo.total} afirmações passaram`);
} else if (limpo.quebrado) {
  ok(false, 'o arquivo de regras rodou até o fim', limpo.quebrado.slice(0, 2000));
} else {
  for (const q of limpo.quais) ok(false, q);
}


/* ---------------- 3. os mutantes ---------------- */
console.log('\nOS MUTANTES — cada erro plantado tem de derrubar uma afirmação');
const pasta = path.join(RAIZ, 'supabase', 'testes', 'mutantes');
for (const arq of fs.readdirSync(pasta).filter((a) => a.endsWith('.sql')).sort()) {
  const r = provar(fs.readFileSync(path.join(pasta, arq), 'utf8'));
  if (r.passou) {
    ok(false, `${arq} foi pego`, 'nenhuma afirmação caiu: a regra que ele afrouxa está sem trava');
  } else if (r.quebrado) {
    ok(false, `${arq} foi pego`, `o SQL quebrou antes das afirmações: ${r.quebrado.slice(0, 600)}`);
  } else {
    ok(true, `${arq} foi pego por ${r.quais.length}: ${r.quais[0].slice(0, 110)}`);
  }
}

console.log(falhas ? `\n${falhas} afirmação(ões) falharam\n` : '\ntodas as afirmações passaram\n');
process.exit(falhas ? 1 : 0);
