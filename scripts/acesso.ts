/* ============================================================
   A TRAVA DA PROMESSA DO VÍNCULO

     npx tsx --tsconfig scripts/tsconfig.json scripts/acesso.ts

   A folha do código promete a quem já paga pela loja e conecta uma
   clínica: "O vínculo com a clínica já garante o seu acesso ao
   aplicativo… e cancelar não muda nada no que você já registrou." Esta
   sonda é o que torna a frase verificável, e ela afirma as duas metades:

     1. O ACESSO — com vínculo há acesso, com a assinatura ativa ou
        cancelada; sem vínculo, a assinatura decide; sem os dois, não há.
     2. OS REGISTROS — conectar, recarregar, cancelar e perder o vínculo
        não encostam em nada do que a pessoa registrou.

   ⚠️ QUEM LIGAR A COBRANÇA RODA ESTA SONDA. O portão que vai trancar o
   aplicativo ainda não existe (PENDENCIAS, itens 5 e 36). Quando existir,
   ele pergunta a `acessoDe`; se alguém o fizer ler a loja diretamente, é
   aqui que a promessa deixa de ter prova.
   ============================================================ */

import { buildSeed, ensureDefaults, type State } from '../src/logic/seed';
import { mascarar } from '../src/logic/store';
import { clinicaConectada } from '../src/logic/derive';
import { acessoDe, vinculoDoConvite, type Assinatura } from '../src/logic/assinatura';

let falhas = 0;
const ok = (certo: boolean, o: string) => {
  console.log(`${certo ? '  ok  ' : '  NÃO '} ${o}`);
  if (!certo) falhas += 1;
};

/* O que é DELA — o que a promessa diz que não muda. A lista é a de
   `estadoVazio`, em logic/seed, menos o que vem da clínica (mensagens,
   receitas, equipe, material). */
const REGISTROS = [
  'weights', 'injections', 'pens', 'checkins', 'photos', 'measures', 'exams', 'examBundles',
  'meals', 'favMeals', 'notes', 'goals', 'customSyms', 'history', 'vitals', 'documents',
] as const;
const registros = (S: State) => JSON.stringify(REGISTROS.map((k) => (S as any)[k]));
const clone = (S: State): State => JSON.parse(JSON.stringify(S));

/* Uma assinatura anual no meio do período — a da loja, que o aplicativo
   ainda não lê (`assinaturaAtual` devolve nulo). Cancelada e ainda no
   período pago, ela continua sendo esta; vencida, vira nulo. */
const ativa: Assinatura = { plano: 'anual', renovaEm: Date.now() + 200 * 864e5, emTeste: false };

async function main() {
  /* A lista de exemplo e os códigos dela só existem em `__DEV__`, e
     logic/rede decide isso quando carrega — daí o import depois. */
  (globalThis as any).__DEV__ = true;
  const { conferirConvite, gravarConviteDaRede } = await import('../src/logic/rede');

  const mariana = ensureDefaults(buildSeed()) as State;
  const sozinha = mascarar(mariana, 'sozinha');

  console.log('\nAS DUAS PESSOAS, para a comparação valer');
  ok(clinicaConectada(mariana), 'a Mariana tem vínculo com clínica');
  ok(!clinicaConectada(sozinha), 'a "sozinha" não tem');
  ok((mariana as any).weights.length > 0 && (mariana as any).injections.length > 0, 'e as duas têm registros');

  console.log('\n1. O ACESSO — o vínculo basta sozinho');
  const a1 = acessoDe(mariana, ativa);
  ok(a1.tem && a1.por === 'vinculo', 'vínculo e assinatura ativa: acesso, e pelo vínculo');
  const a2 = acessoDe(mariana, null);
  ok(a2.tem && a2.por === 'vinculo', 'vínculo e assinatura cancelada e vencida: acesso continua');
  const a3 = acessoDe(sozinha, ativa);
  ok(a3.tem && a3.por === 'assinatura', 'sem vínculo, com assinatura: acesso pela assinatura');
  ok(!acessoDe(sozinha, null).tem, 'sem vínculo e sem assinatura: sem acesso');
  ok(acessoDe(mariana).tem, 'sem passar a assinatura, a regra lê a costura — e o vínculo basta');

  console.log('\n2. OS REGISTROS — nada do que é dela muda');
  const antes = registros(sozinha);
  acessoDe(sozinha, null);
  acessoDe(mariana, ativa);
  ok(registros(sozinha) === antes, 'perguntar pelo acesso não escreve nada');

  /* conectar pela folha, com um código da lista de exemplo */
  const r = await conferirConvite('savassi26');
  ok(r.tipo === 'achou', 'o código de exemplo é achado');
  const conectada = clone(sozinha);
  if (r.tipo === 'achou') gravarConviteDaRede(conectada, r.convite);
  ok(clinicaConectada(conectada), 'conectada, ela passa a ter vínculo');
  ok(registros(conectada) === antes, 'conectar não encosta em nenhum registro');
  const a4 = acessoDe(conectada, ativa);
  ok(a4.tem && a4.por === 'vinculo', 'quem já pagava e conectou tem acesso pelo vínculo');

  /* o caminho sem fonte, que é o de produção enquanto o portal não existe */
  const semFonte = clone(sozinha);
  (semFonte.profile as any).convite = 'ABCD1234';
  (semFonte.profile as any).vinculo = vinculoDoConvite('ABCD1234');
  ok(acessoDe(semFonte, null).tem, 'sem fonte, o código liga e dá acesso do mesmo jeito');
  ok(registros(semFonte) === antes, 'e também não encosta em registro');

  /* recarregar o aplicativo: o estado passa por ensureDefaults */
  const recarregada = ensureDefaults(clone(conectada)) as State;
  ok(clinicaConectada(recarregada), 'recarregado, o vínculo continua');
  ok(registros(recarregada) === antes, 'recarregado, os registros continuam idênticos');

  /* cancelar a assinatura: a loja para de cobrar, e o aplicativo não faz nada */
  const cancelou = acessoDe(recarregada, null);
  ok(cancelou.tem && cancelou.por === 'vinculo', 'cancelou a assinatura: o acesso continua, pelo vínculo');
  ok(registros(recarregada) === antes, 'cancelou a assinatura: os registros continuam idênticos');

  /* e o pior caso: a clínica encerra o vínculo e não há assinatura */
  const semVinculo = clone(recarregada);
  (semVinculo.profile as any).vinculo = null;
  ok(!acessoDe(semVinculo, null).tem, 'sem vínculo e sem assinatura: o acesso fica suspenso');
  ok(registros(semVinculo) === antes, 'mas nada foi apagado — é o que a tela /suspenso diz');

  console.log(falhas ? `\n${falhas} afirmação(ões) falharam\n` : '\ntodas as afirmações passaram\n');
  process.exit(falhas ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
