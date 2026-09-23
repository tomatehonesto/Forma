/* ============================================================
   A SONDA DOS MODOS FINGIDOS

     npx tsx --tsconfig scripts/tsconfig.json scripts/modos.ts

   O atalho do perfil mostra o aplicativo de quem NÃO tem clínica
   parceira, e ele faz isso apagando dado — não trocando a resposta de um
   predicado. A razão está escrita em logic/store, na máscara.

   ⚠️⚠️ E É POR ISSO QUE ESTA SONDA EXISTE. Apagar dado é uma aposta: a de
   que os sessenta e um sítios que já consultam `clinicaConectada` e
   `temAcompanhamento` fazem o resto sozinhos. Se um campo de plataforma
   escapar da máscara, nada quebra e nada acusa — a tela simplesmente
   mostra uma mensagem de uma clínica que, naquele modo, não existe.

   Ela afirma as três coisas que a máscara promete:

     1. os dois modos perdem TUDO que só existe com plataforma;
     2. o modo 2 mantém o médico próprio, e o modo 3 não;
     3. o que é DELA atravessa os dois — peso, aplicações, check-ins,
        refeições e exames não são da clínica.
   ============================================================ */

import { buildSeed, ensureDefaults, type State } from '../src/logic/seed';
import { mascarar } from '../src/logic/store';
import { clinicaConectada, temAcompanhamento, semAcompanhamento } from '../src/logic/derive';

let falhas = 0;
const ok = (certo: boolean, o: string) => {
  console.log(`${certo ? '  ok  ' : '  NÃO '} ${o}`);
  if (!certo) falhas += 1;
};

const verdade = ensureDefaults(buildSeed()) as State;
const semParceira = mascarar(verdade, 'sem-parceira');
const sozinha = mascarar(verdade, 'sozinha');

const p = (S: State) => S.profile as any;
const q = (S: State) => S as any;

console.log('\nA SEMENTE, para a comparação valer');
ok(clinicaConectada(verdade), 'a Mariana tem clínica parceira');
ok(q(verdade).messages.length > 0, 'e tem conversa com a equipe');
ok(q(verdade).prescriptions.length > 0, 'e tem receita da clínica');

console.log('\n1. O QUE SAI NOS DOIS MODOS — só existe com plataforma');
for (const [nome, S] of [['sem-parceira', semParceira], ['sozinha', sozinha]] as const) {
  ok(!clinicaConectada(S), `${nome}: clinicaConectada é falso`);
  ok(q(S).messages.length === 0 && q(S).unread === 0, `${nome}: sem mensagens nem não-lidas`);
  ok(q(S).prescriptions.length === 0, `${nome}: sem receitas`);
  ok(q(S).team.length === 0, `${nome}: sem equipe`);
  ok(q(S).materials.length === 0, `${nome}: sem material da clínica`);
  ok(
    !(q(S).protocol.tasks ?? []).some((t: any) => t.t && /exame/i.test(t.t)),
    `${nome}: sem a tarefa de exame, que era a única autoral da clínica`,
  );
}

console.log('\n2. O MÉDICO PRÓPRIO — é o que separa os dois modos');
ok(temAcompanhamento(semParceira), 'sem-parceira: continua tendo quem acompanhe');
ok(!!p(semParceira).doctor, 'sem-parceira: o nome do médico fica');
ok(q(semParceira).consult.t > 0, 'sem-parceira: a consulta dela continua marcada');

ok(semAcompanhamento(sozinha), 'sozinha: não tem quem acompanhe');
ok(!p(sozinha).doctor && !p(sozinha).clinic, 'sozinha: nenhum nome sobra para uma tela escrever');
ok(q(sozinha).consult.t === 0, 'sozinha: sem consulta marcada');
ok(q(sozinha).consultsHistory.length === 0, 'sozinha: sem consultas anteriores');

console.log('\n3. O QUE É DELA ATRAVESSA OS DOIS');
for (const [nome, S] of [['sem-parceira', semParceira], ['sozinha', sozinha]] as const) {
  for (const campo of ['weights', 'injections', 'checkins', 'meals', 'exams', 'measures'] as const) {
    ok(
      q(S)[campo].length === q(verdade)[campo].length && q(S)[campo].length > 0,
      `${nome}: ${campo} intacto (${q(S)[campo].length})`,
    );
  }
}

console.log('\n4. E A VERDADE NÃO FOI TOCADA');
ok(clinicaConectada(verdade), 'o estado de origem continua com vínculo');
ok(q(verdade).messages.length > 0, 'e continua com as mensagens');

console.log(falhas ? `\n${falhas} afirmação(ões) falharam\n` : '\ntodas as afirmações passaram\n');
process.exit(falhas ? 1 : 0);
