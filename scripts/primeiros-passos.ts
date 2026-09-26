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
     5. "Sua evolução" pede duas pesagens em dias diferentes;
     6. nenhuma frase afirma o que não aconteceu (Peça 3 da especificação):
        sem aplicação registrada não há ciclo, próxima dose, fase, adesão
        nem aviso de dose; sem pesagens bastantes não há ritmo nem
        "estável"; sem recipiente registrado não há estoque; sem check-in
        respondido não há leitura do equilíbrio.
   ============================================================ */

import { buildSeed, estadoVazio, type State } from '../src/logic/seed';
import {
  passos, passosNaHome, passosParaReabrir, esconderPassos, reabrirPassos, concluirPassos,
  type DoAparelho,
} from '../src/logic/primeirosPassos';
import {
  temEvolucao, temCiclo, journeySummary, journeyChanges, careState, doseContext, penStock,
  balanceRead, recommendations, radar, libraryPicks, companionSuggestions,
  cicloFases, injCalendar, protocoloDaSemana,
} from '../src/logic/derive';
import { proximasDe, type Alerta } from '../src/logic/alertas';
import { resumoEmTexto } from '../src/logic/resumo';
import { conquistas } from '../src/logic/conquistas';
import { T } from '../src/textos';

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

console.log('\n6. NENHUMA FRASE SOBRE O QUE NÃO ACONTECEU');
/* Uma pessoa com dose definida, uma pesagem e nada registrado. */
const zero = clone(novo);
zero.profile.med = 'mounjaro';
(zero.profile as any).dose = 2.5;
(zero.weights as any[]).push({ t: +hoje, kg: 80 });
const aplicou5 = clone(zero);
(aplicou5.injections as any[]).push({ t: +hoje - 5 * DIA + 12 * 3600e3, med: 'mounjaro', dose: 2.5, site: 'abd-e', note: '' });

ok(!temCiclo(zero) && temCiclo(aplicou5), 'sem aplicação registrada não há ciclo; com uma, há');

const r0 = journeySummary(zero);
const perto = clone(zero);
(perto.weights as any[]).push({ t: +hoje - 3 * DIA, kg: 81 });
const longe = clone(zero);
(longe.weights as any[]).push({ t: +hoje - 8 * DIA, kg: 81.5 });
ok(!r0.temRitmo && !journeySummary(perto).temRitmo && journeySummary(longe).temRitmo,
  'o ritmo pede pesagens com uma semana entre elas — no primeiro dia não há "Ritmo mais lento"');
ok(!journeyChanges(zero).some((c) => c.ic === 'scale') && journeyChanges(perto).some((c) => c.ic === 'scale'),
  'com uma pesagem, o peso não entra em "O que já mudou" (nada de "Estável")');

const st0 = careState(zero);
const st5 = careState(aplicou5);
ok(st0.momento === 'comeco' && st0.adesaoRotulo === null && !st0.texto.includes('adesão'),
  `o Cuidado sem dose registrada está no começo, sem "0 de 0 doses" nem adesão (momento: ${st0.momento})`);
ok(st5.momento !== 'comeco' && st5.adesaoRotulo !== null, 'com uma aplicação, o Cuidado deixa o começo e conta as doses');
const emDia1 = T.cuidado.estado.emDiaSozinha(1, true);
ok(emDia1.includes('1 semana ') && !emDia1.includes('1 semanas'), 'uma semana é "semana", e não "1 semanas"');
ok(!T.cuidado.estado.emDiaSozinha(4, false).includes('adesão'), 'sem adesão alta, a frase não a elogia');

ok(doseContext(zero).proxima === T.cuidado.dose.nenhumaRegistrada && doseContext(aplicou5).proxima !== T.cuidado.dose.nenhumaRegistrada,
  'sem aplicação registrada, a próxima não é "hoje"');
const aplicouHoje = clone(zero);
(aplicouHoje.injections as any[]).push({ t: +hoje + 12 * 3600e3, med: 'mounjaro', dose: 2.5, site: 'abd-e', note: '' });
ok(doseContext(aplicouHoje).naDose === null && doseContext(aplicou5).naDose !== null,
  'a primeira aplicação, registrada hoje, não é "nesta dose há 1 semana"');
ok(!recommendations(zero).some((x) => x.ic === 'syringe') && recommendations(aplicou5).some((x) => x.ic === 'syringe'),
  '"a aplicação da semana está chegando" só com ciclo');

const alertaDaDose = (((zero as any).alertas ?? []) as Alerta[]).find((a) => a.tipo === 'dose');
ok(!!alertaDaDose, 'o diário novo nasce com o alerta da dose');
if (alertaDaDose) {
  const ligado = { ...alertaDaDose, on: true };
  ok(proximasDe(zero, ligado, 3).length === 0 && proximasDe(aplicou5, ligado, 3).length > 0,
    'o aviso da dose espera a primeira aplicação registrada — nada de "é hoje" às nove');
}

const comCaneta = clone(aplicou5);
(comCaneta as any).pens = [{ t: +hoje - 5 * DIA, med: 'mounjaro', dose: 2.5, dosesPerPen: 4 }];
ok(!penStock(zero).registrada && !penStock(aplicou5).registrada && penStock(comCaneta).registrada,
  'sem recipiente registrado, o estoque é recuo e não fato ("4 de 4")');

const eq0 = balanceRead(zero);
const respondeu6 = clone(zero);
(respondeu6.checkins as any[]).push({ t: +hoje, energia: 7, agua: 3 });
const eq1 = balanceRead(respondeu6);
ok(eq0.to === '/checkin' && eq0.abertura === T.equilibrio.semLeitura && eq1.to === undefined,
  'sem check-in respondido não há leitura do equilíbrio — nem "Reparei numa coisa boa"');
ok(!radar(zero).some((e) => e.id === 'adesao') && radar(aplicou5).some((e) => e.id === 'adesao'),
  'sem ciclo, adesão não é eixo do equilíbrio');
const doCiclo = (S: State) => libraryPicks(S).filter((l) => l.ic === 'dose' || l.ic === 'drop2').length;
ok(doCiclo(zero) === 0 && doCiclo(aplicou5) > 0, 'a biblioteca não diz "Você aplicou há 7 dias" a quem nunca aplicou');
ok(!companionSuggestions(zero).includes(T.rotina.perguntas.trocarODia),
  'sem dia de aplicação, o Morphi não sugere trocá-lo');

/* As telas da dose (Etapa 3, grupo A). */
const cf0 = cicloFases(zero);
ok(!cf0.comCiclo && cf0.fases.every((f) => f.estado !== 'agora' && f.selo === undefined)
  && cicloFases(aplicou5).fases.some((f) => f.estado === 'agora'),
  'sem ciclo, nenhuma fase é "agora" nem tem data — as fases viram conteúdo');
ok(!injCalendar(zero).some((c) => c.planned) && injCalendar(aplicou5).some((c) => c.planned),
  'sem ciclo, a grade de Aplicações não marca a "próxima"');
const temAplicacaoNaSemana = (S: State) => protocoloDaSemana(S).tarefas.some((t: any) => t.ic === 'syringe');
ok(!temAplicacaoNaSemana(zero) && temAplicacaoNaSemana(aplicou5),
  'antes da primeira dose, "Aplicação da semana" sai do protocolo; com ela, volta');

/* O documento que vai para o médico (Etapa 3, grupo B). */
const doc0 = resumoEmTexto(zero);
ok(doc0.includes(T.cuidado.dose.nenhumaRegistrada) && doc0.includes(T.resumo.aplicacoesNenhuma)
  && !doc0.includes(T.resumo.aplicacoesValor(0, 0)) && !doc0.includes(T.resumo.variacao),
  'o resumo sem dose nem evolução não diz "1 dias", "0 de 0 previstas" nem "Estável (0,0%)"');
ok(resumoEmTexto(longe).includes(T.resumo.variacao), 'com evolução, a variação volta ao resumo');
ok(T.resumo.emDias(1) === '1 dia', 'um dia é "1 dia"');

/* Conquistas e biblioteca (Etapa 3, grupo C). */
ok(T.conquistas.dosesFalta(1) === 'Falta 1 aplicação' && T.conquistas.dosesFalta(3).startsWith('Faltam'),
  '"Falta 1 aplicação", e não "Faltam 1"');
const tempo0 = conquistas(zero).find((q) => q.id === 'tempo');
const tempo5 = conquistas(aplicou5).find((q) => q.id === 'tempo');
ok(tempo0?.falta === T.conquistas.tempoSemDose && tempo5?.falta !== T.conquistas.tempoSemDose,
  'o tempo de tratamento não conta "faltam 30 dias" de uma primeira dose que não existe');
const leitura = (S: State, ic: string) => libraryPicks(S).some((l) => l.ic === ic);
const dormiu = clone(zero);
(dormiu.checkins as any[]).push({ t: +hoje, sono: 5 });
ok(!leitura(zero, 'moon') && !leitura(zero, 'flame') && leitura(dormiu, 'moon'),
  'sem registro, a biblioteca não fala da "sua média" de sono nem de proteína');

console.log(falhas ? `\n${falhas} afirmação(ões) falharam\n` : '\ntodas as afirmações passaram\n');
process.exit(falhas ? 1 : 0);
