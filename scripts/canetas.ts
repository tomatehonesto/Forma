/* ============================================================
   A SONDA DOS RECIPIENTES

     npx tsx --tsconfig scripts/tsconfig.json scripts/canetas.ts

   O histórico de canetas foi, por muito tempo, uma ADIVINHAÇÃO: o estado
   guardava só quantas doses sobravam no que estava aberto, e a lista saía
   de fatiar as aplicações de trás para frente em blocos de quatro. A
   conta mentia de dois jeitos — rotulava o bloco com a última dose dele,
   e transformava o resto da divisão numa caneta de "1 de 4 doses" que
   afirmava três doses descartadas que ninguém descartou.

   ⚠️⚠️ E É POR ISSO QUE ESTA SONDA EXISTE. Um histórico errado de
   medicamento não quebra nada e não acusa nada: a tela abre, a lista
   rola, e a pessoa lê que usou uma caneta de 5 mg num mês em que estava
   em 2,5. Só quem for conferir aplicação por aplicação descobre.

   Ela afirma as quatro coisas que o modelo novo promete:

     1. toda caneta entrega as doses da concentração DELA;
     2. nenhuma aplicação é contada duas vezes, e nenhuma some;
     3. quantas sobram é a subtração, e não um número gravado;
     4. a fração da constância conta os mesmos pontos que a grade acende.
   ============================================================ */

import { buildSeed, ensureDefaults, type State } from '../src/logic/seed';
import {
  canetas, canetaAtual, penStock, dosesPrevistas, adesao,
  constanciaDaGrade, injCalendar, cadenciaDias,
} from '../src/logic/derive';
import { diffDays } from '../src/logic/time';

let falhas = 0;
const ok = (certo: boolean, o: string) => {
  console.log(`${certo ? '  ok  ' : '  NÃO '} ${o}`);
  if (!certo) falhas += 1;
};

const S = ensureDefaults(buildSeed()) as State;
const d = (t: number) => new Date(t).toISOString().slice(0, 10);
const lista = canetas(S);
const injs = (S.injections as any[]).slice().sort((a, b) => a.t - b.t);

console.log('\nO QUE A SEMENTE TEM');
console.log(`  ${injs.length} aplicações, de ${d(injs[0].t)} a ${d(injs[injs.length - 1].t)}`);
for (const k of lista) {
  console.log(`  [${k.estado}] ${k.label} ${k.dose} ${k.unit} · aberta ${d(k.abertaEm!)} · ${k.usadas}/${k.total}`);
}

console.log('\n1. CADA CANETA ENTREGA A CONCENTRAÇÃO DELA');
for (const k of lista) {
  ok(
    k.aplicacoes.every((a) => a.dose === k.dose),
    `${d(k.abertaEm!)}: as ${k.usadas} doses são de ${k.dose} ${k.unit}`,
  );
  ok(k.usadas <= k.total, `${d(k.abertaEm!)}: não entregou mais doses do que cabe (${k.usadas} ≤ ${k.total})`);
}
/* A titulação é o caso que quebrava o modelo antigo: sem uma caneta de
   cada concentração, esta sonda passaria por um motivo que não é o
   certo. */
ok(new Set(lista.map((k) => k.dose)).size > 1, 'a semente tem canetas de mais de uma concentração');

console.log('\n2. AS APLICAÇÕES NÃO SE PERDEM NEM SE REPETEM');
const daLista = lista.flatMap((k) => k.aplicacoes.map((a) => a.t));
ok(new Set(daLista).size === daLista.length, 'nenhuma aplicação aparece em duas canetas');
const primeiraAbertura = Math.min(...lista.map((k) => k.abertaEm!));
const depoisDaPrimeira = injs.filter((i) => i.t >= primeiraAbertura);
ok(
  daLista.length === depoisDaPrimeira.length,
  `as ${depoisDaPrimeira.length} aplicações desde a primeira abertura estão todas em alguma caneta`,
);
/* O contrário do defeito antigo: nenhuma caneta é inventada para acomodar
   o resto de uma divisão. */
ok(lista.every((k) => k.usadas > 0), 'nenhuma caneta sem dose nenhuma');

console.log('\n3. O QUE SOBRA É SUBTRAÇÃO');
const est = penStock(S);
const atual = lista[0];
ok(est.total === atual.total, `a capacidade é a do recipiente aberto (${est.total})`);
ok(est.left === atual.total - atual.usadas, `restam ${est.left} = ${atual.total} − ${atual.usadas}`);
ok(canetaAtual(S).atual?.abertaEm === atual.abertaEm, 'a caneta atual é a de cima da lista');

console.log('\n4. A CONSTÂNCIA CONTA O QUE A GRADE DESENHA');
const g = constanciaDaGrade(S);
const acesos = injCalendar(S).filter((c) => c.applied).length;
ok(g.feitas === acesos, `as feitas são os pontos acesos (${g.feitas})`);
ok(g.previstas >= g.feitas, `nenhuma dose a mais do que o previsto (${g.feitas} de ${g.previstas})`);
ok(g.previstas <= g.semanas * 7 / cadenciaDias(S) + 1, 'as previstas cabem na janela da grade');

console.log('\n5. AS PREVISTAS COMEÇAM NA PRIMEIRA APLICAÇÃO');
const esperado = Math.floor(diffDays(new Date(), new Date(injs[0].t)) / cadenciaDias(S)) + 1;
ok(dosesPrevistas(S) === esperado, `${dosesPrevistas(S)} encaixes desde ${d(injs[0].t)}`);
/* A semente aplica de sete em sete dias, sem atraso: adesão de cem. Era
   91% porque a conta cobrava uma dose no dia em que o tratamento
   começou — quatro dias antes da primeira aplicação. */
ok(adesao(S) === 100, `adesão de ${adesao(S)}% para dez aplicações em dia`);

console.log(falhas ? `\n${falhas} afirmação(ões) falharam\n` : '\ntodas as afirmações passaram\n');
process.exit(falhas ? 1 : 0);
