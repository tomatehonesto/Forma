/* ============================================================
   A SONDA DOS PRIMEIROS PASSOS

     npx tsx --tsconfig scripts/tsconfig.json scripts/primeiros-passos.ts

   O cartão "Primeiros passos" da Home é uma lista de leituras do estado,
   e não de caixinhas (docs/superpowers/specs/2026-09-26-primeiros-passos-
   design.md). Se uma leitura errar, o cartão mente de dois jeitos: cobra o
   que a pessoa já fez, ou dá por feito o que ela não fez. Nenhum dos dois
   quebra a tela — por isso esta sonda existe.

   Ela afirma:

     1. o diário novo começa com o plano pronto e o resto por fazer;
     2. no navegador, sem aviso nem depósito de saúde, sobram três itens;
     3. cada item se marca com o que de fato aconteceu — e um copo d'água
        não é check-in; quem toma comprimido registra a primeira dose;
     4. esconder, reabrir e concluir, e concluído vence escondido; o
        diário de exemplo não tem cartão;
     5. "Sua evolução" pede duas pesagens em dias diferentes.
   ============================================================ */

import { buildSeed, estadoVazio, type State } from '../src/logic/seed';
import {
  passos, passosNaHome, passosParaReabrir, esconderPassos, reabrirPassos, concluirPassos, temEvolucao,
  type DoAparelho,
} from '../src/logic/primeirosPassos';

let falhas = 0;
const ok = (certo: boolean, o: string) => {
  console.log(`${certo ? '  ok  ' : '  NÃO '} ${o}`);
  if (!certo) falhas += 1;
};
const clone = (S: State): State => JSON.parse(JSON.stringify(S));
const prontos = (S: State, a: DoAparelho) => passos(S, a).filter((p) => p.pronto).map((p) => p.id);

const IPHONE: DoAparelho = { permissao: 'nao-perguntada', aparelho: { id: 'appleHealth', nome: 'Apple Saúde' } };
const NAVEGADOR: DoAparelho = { permissao: 'indisponivel', aparelho: null };
const DIA = 864e5;
const hoje = new Date(); hoje.setHours(0, 0, 0, 0);

const novo = estadoVazio() as State;
novo.onboardDone = true;

console.log('\n1. O DIÁRIO NOVO');
const nIphone = passos(novo, IPHONE);
ok(nIphone.length === 5, `no iPhone são cinco itens (${nIphone.map((p) => p.id).join(', ')})`);
ok(JSON.stringify(prontos(novo, IPHONE)) === '["plano"]', 'só o plano começa pronto: o cartão abre em "1 de 5"');
ok(nIphone.every((p) => p.id === 'plano' ? !p.to : !!p.to), 'todo item por fazer leva a uma tela, e o plano a nenhuma');
ok(nIphone.find((p) => p.id === 'saude')!.titulo.includes('Apple Saúde'), 'o item da saúde diz o nome do aparelho');

console.log('\n2. O NAVEGADOR');
const nWeb = passos(novo, NAVEGADOR);
ok(nWeb.length === 3 && !nWeb.some((p) => p.id === 'lembretes' || p.id === 'saude'),
  'sem aviso nem depósito de saúde, sobram o plano, a aplicação e o check-in');

console.log('\n3. CADA ITEM SE MARCA COM O QUE ACONTECEU');
const aplicou = clone(novo);
(aplicou.injections as any[]).push({ t: +hoje, dose: 2.5 });
ok(prontos(aplicou, IPHONE).includes('aplicacao'), 'a primeira aplicação marca a aplicação');
const oral = clone(novo);
(oral.profile as any).forma = 'comprimido';
const doseOral = passos(oral, IPHONE).find((p) => p.id === 'aplicacao')!;
const doseCaneta = nIphone.find((p) => p.id === 'aplicacao')!;
ok(doseOral.titulo.includes('dose') && doseOral.ic === 'pill' && doseCaneta.titulo.includes('aplicação') && doseCaneta.ic === 'syringe',
  'quem toma comprimido registra a primeira dose, e quem aplica, a primeira aplicação');

const bebeu = clone(novo);
(bebeu.checkins as any[]).push({ t: +hoje, agua: 2 });
ok(!prontos(bebeu, IPHONE).includes('checkin'), 'um copo d\'água não é check-in');
const respondeu = clone(bebeu);
(respondeu.checkins as any[])[0].energia = 3;
ok(prontos(respondeu, IPHONE).includes('checkin'), 'o dia com resposta marca o check-in');

ok(prontos(novo, { ...IPHONE, permissao: 'concedida' }).includes('lembretes'), 'a permissão concedida marca os lembretes');
ok(!prontos(novo, { ...IPHONE, permissao: 'negada' }).includes('lembretes'), 'a permissão negada deixa os lembretes por fazer');
const ligou = clone(novo);
(ligou as any).integrations.appleHealth = true;
ok(prontos(ligou, IPHONE).includes('saude'), 'o Apple Saúde ligado marca a saúde');
ok(!prontos(ligou, { ...IPHONE, aparelho: { id: 'healthConnect', nome: 'Health Connect' } }).includes('saude'),
  'no Android, quem conta é o Health Connect, e não o Apple Saúde');

console.log('\n4. ESCONDER, REABRIR E CONCLUIR');
ok(passosNaHome(novo) && !passosParaReabrir(novo), 'o diário novo tem o cartão na Home, e nada a reabrir no Perfil');
const semCadastro = clone(novo);
semCadastro.onboardDone = false;
ok(!passosNaHome(semCadastro), 'sem o cadastro feito, não há cartão');
const semente = buildSeed() as State;
const sementeEscondida = clone(semente);
esconderPassos(sementeEscondida);
ok(!passosNaHome(semente) && !passosParaReabrir(sementeEscondida), 'o diário de exemplo não tem cartão, nem linha no Perfil');
const escondeu = clone(novo);
esconderPassos(escondeu);
ok(!passosNaHome(escondeu) && passosParaReabrir(escondeu), 'escondido, sai da Home e aparece no Perfil');
const reabriu = clone(escondeu);
reabrirPassos(reabriu);
ok(passosNaHome(reabriu) && !passosParaReabrir(reabriu), 'reaberto, volta para a Home');
const concluiu = clone(escondeu);
concluirPassos(concluiu);
ok(!passosNaHome(concluiu) && !passosParaReabrir(concluiu), 'concluído vence escondido: nem Home, nem Perfil');
const naVolta = clone(concluiu);
reabrirPassos(naVolta);
ok(!passosNaHome(naVolta), 'e concluído não volta, nem reaberto');

console.log('\n5. "SUA EVOLUÇÃO" PEDE EVOLUÇÃO');
const umaPesagem = clone(novo);
(umaPesagem.weights as any[]).push({ t: +hoje, kg: 80 });
ok(!temEvolucao(umaPesagem), 'uma pesagem: sem evolução');
const mesmoDia = clone(umaPesagem);
(mesmoDia.weights as any[]).push({ t: +hoje + 3600e3, kg: 79.8 });
ok(!temEvolucao(mesmoDia), 'duas no mesmo dia: sem evolução');
const doisDias = clone(umaPesagem);
(doisDias.weights as any[]).push({ t: +hoje - 21 * DIA, kg: 85 });
ok(temEvolucao(doisDias), 'duas em dias diferentes: com evolução — quem já tinha começado a tem no primeiro dia');

console.log(falhas ? `\n${falhas} afirmação(ões) falharam\n` : '\ntodas as afirmações passaram\n');
process.exit(falhas ? 1 : 0);
