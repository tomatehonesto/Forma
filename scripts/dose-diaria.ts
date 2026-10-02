/* ============================================================
   A SONDA DA DOSE DIÁRIA

     npx tsx --tsconfig scripts/tsconfig.json scripts/dose-diaria.ts

   O aplicativo nasceu para a caneta semanal, e quem toma Rybelsus (ou
   aplica Saxenda) todo dia lia "Dia 1 depois da dose — o efeito começa a
   subir" todo santo dia, uma "Semana 90" por dose na Jornada e "4 de 4
   semanas com dose" tendo perdido vinte de vinte e oito doses. A parte B
   (B1 e B2) de docs/superpowers/specs/2026-10-01-oral-e-diario-design.md
   desfaz isso, com três decisões do dono:

     · a dose diária é UM TOQUE por dia, como o check-in, e nada é
       presumido — a constância é de dias com dose registrada;
     · a semana de quem toma todo dia é a DO TRATAMENTO: blocos de 7 dias
       contados do início, a régua do painel "SEMANA N · DIA D";
     · o que foi desenhado em cima de um ciclo semanal — as fases, o
       "vale" da fome, a janela do enjoo, o padrão do ciclo nos sintomas,
       o "um ou dois dias depois da dose" das descobertas — sai de cena.

   ⚠️⚠️ E QUEM TOMA POR SEMANA NÃO PODE VER NADA MUDAR. É a primeira parte
   desta sonda, antes de qualquer afirmação sobre o diário: toda mudança
   da parte B pergunta `doseDiaria` antes, e uma pergunta esquecida aparece
   aqui como uma semana semanal com cara de bloco.

   Ela afirma:

     1. o semanal continua como era (a semente);
     2. a última dose é a de data mais recente, para todos — e gravar uma
        dose retroativa não troca a dose do perfil;
     3. no diário, as fases, o vale, a janela do enjoo, o padrão do ciclo
        e o "depois da dose" estão desligados;
     4. a semana do tratamento: blocos de 7 dias com o número do painel,
        "N de 7 doses" e o remédio da semana;
     5. a dose de hoje e os dias com dose desta semana;
     6. as conquistas contam dias com dose;
     7. a primeira semana, a dose nova e a semana que passou, no diário;
     8. o que as telas leem: a pastilha de Cuidado, a contagem da semana
        que passou e o dia de cada casa da grade de doses;
     9. os achados da revisão de 01/10/2026 (F1 a F12): a conta começa no
        regime diário de agora, a semana "em dia" é a de todos os dias, o
        dia esquecido ganha a dose daquele dia, hoje só conta depois da
        dose, e as sobras do ciclo semanal que ainda falavam com o diário;
    10. com o relógio parado em Berlim, na semana em que o relógio volta
        uma hora (25/10/2026): os sete dias e a próxima dose pelo
        calendário, e a contagem do regime diário atravessando a troca.
   ============================================================ */

import { buildSeed, ensureDefaults, estadoVazio, iniciarMarcaDaEscadaDiaria, type State } from '../src/logic/seed';
import { resumoDoTratamento } from '../src/logic/resumo';
import {
  lastInjection, nextInjectionDate, doseCycle, todayBrief, hungerForecast, pharmaSeries, janelaDoEnjoo,
  sintomaNoCiclo, padraoDoCiclo, companionSuggestions, recommendations, libraryPicks, protocoloDaSemana,
  timelineWeeks, journeySummary, adesao, cicloFases, temHistoria, temFasesDoCiclo, doseDiaria,
  gravarDose, seriaAMaisRecente, dosesNoDia, doseDeHoje, diasComDoseNaSemana, diasComDose,
  inicioDoTratamento, semanaDoTratamentoEm, janelaDaSemanaDoTratamento, dosesEmOrdem,
  doseContext, injGrade,
  inicioDoDiario, diasDoDiario, dosesPrevistas, dosesFeitas, careState, constanciaDaGrade, doseEmUsoNoDia,
  faltaNaDose, timelineEvents, diasAteAplicar, adesaoSemConta, radar, patterns,
} from '../src/logic/derive';
import { resumoDaJornada } from '../src/logic/resumoDaJornada';
import { conquistas, novosNiveis, marcarComoVistas } from '../src/logic/conquistas';
import { mensagemDoDia } from '../src/logic/etapa';
import { semanaQuePassou } from '../src/logic/destaques';
import { descobertas } from '../src/logic/descobertas';
import { diasDaJanela, semanaLida } from '../src/logic/descobertasDaSemana/dias';
import { destaquesDaSemana } from '../src/logic/resumoDaSemana';
import { FORMAS, formaDe } from '../src/logic/formas';
import { primeiroDiaDaSemana } from '../src/logic/local';
import { MEDS } from '../src/logic/meds';
import { semanaDoTratamento, startOfDay, fmtTime } from '../src/logic/time';
import { T } from '../src/textos';

let falhas = 0;
const ok = (certo: boolean, o: string) => {
  console.log(`${certo ? '  ok  ' : '  NÃO '} ${o}`);
  if (!certo) falhas += 1;
};
const clone = (S: State): State => JSON.parse(JSON.stringify(S));

/* O instante `k` dias atrás, pelo calendário, na hora dada (o comprimido
   das 7h12). */
const diaHa = (k: number, h = 7, min = 12) => {
  const d = new Date();
  return +new Date(d.getFullYear(), d.getMonth(), d.getDate() - k, h, min);
};
const amanha = diaHa(-1, 0, 0);

const novo = estadoVazio() as State;
novo.onboardDone = true;

/** Uma pessoa que toma Rybelsus todo dia, com o tratamento começado há
    `inicioHa` dias e uma dose em cada um dos dias de `doses` (dias atrás). */
function diario(inicioHa: number, doses: number[], dose = 7, med = 'rybelsus'): State {
  const S = clone(novo);
  S.profile.med = med;
  (S.profile as any).forma = med === 'rybelsus' ? 'comprimido' : 'caneta';
  (S.profile as any).dose = dose;
  S.profile.startT = diaHa(inicioHa, 0, 0);
  (S.profile as any).consentimento = { em: diaHa(inicioHa, 8, 0), versao: 2 };
  (S as any).injections = doses
    .slice().sort((a, b) => b - a)
    .map((k) => ({ t: diaHa(k), med, dose, site: '', note: '' }));
  return ensureDefaults(S) as State;
}
const ate = (n: number) => Array.from({ length: n + 1 }, (_, k) => k);

/* ------------------------------------------------------------------ */
console.log('\n1. QUEM TOMA POR SEMANA NÃO VÊ NADA MUDAR');
const semente = ensureDefaults(buildSeed()) as State;
const injsS = semente.injections as any[];
ok(!doseDiaria(semente) && temFasesDoCiclo(semente), 'a semente (Mounjaro) não é dose diária, e o ciclo semanal vale');
ok(lastInjection(semente) === injsS[injsS.length - 1], 'com a lista em ordem, a última dose continua sendo a última da lista');
ok(doseCycle(semente).phases.length === 5 && doseCycle(semente).total === 7, 'as cinco fases do ciclo de sete dias');
ok(todayBrief(semente).chapeu === T.ciclo.chapeuDia(doseCycle(semente).dayIn), `o chapéu da Home conta o dia depois da dose (${todayBrief(semente).chapeu})`);
const twS = timelineWeeks(semente);
ok(twS.length === injsS.length && twS.every((w) => !w.diaria && injsS.some((i) => i.t === w.t)),
  `uma semana por dose, de dose a dose (${twS.length} semanas, ${injsS.length} doses)`);
ok(twS.every((w, i) => w.semana === twS.length - i) && twS.every((w) => !!w.site && w.dosesTexto === undefined),
  'numeradas de 1 em diante, com o local, e sem a contagem de doses do diário');
const dosesS = conquistas(semente).find((q) => q.id === 'doses')!;
ok(dosesS.niveis === 6 && dosesS.desc === T.conquistas.dosesDesc(dosesS.alvo ?? 1),
  `a trilha de doses tem os seis degraus semanais (${dosesS.desc})`);
ok(protocoloDaSemana(semente).tarefas.some((t) => t.texto === T.rotina.protocolo.aplicacaoUma),
  'o protocolo continua com a "Dose da semana"');
ok(adesao(semente) === 100, `adesão de ${adesao(semente)}% para doses em dia`);
ok(janelaDoEnjoo(semente) !== null && pharmaSeries(semente).trough !== null,
  'a janela do enjoo e o vale da fome continuam valendo');
ok(sintomaNoCiclo(semente).length === 7, 'os sintomas ao longo do ciclo têm os sete dias');
ok(diasDaJanela(semente).some((d) => d.faz.posAplicacao === true),
  'as descobertas da semana ainda sabem o que é "um ou dois dias depois da dose"');

/* ------------------------------------------------------------------ */
console.log('\n2. A ÚLTIMA DOSE É A DE DATA MAIS RECENTE — PARA TODOS');
const retroSemanal = clone(semente);
const ultimaS = lastInjection(semente)!;
(retroSemanal.injections as any[]).push({ ...ultimaS, t: ultimaS.t - 9 * 864e5 });
ok(lastInjection(retroSemanal)!.t === ultimaS.t && +nextInjectionDate(retroSemanal) === +nextInjectionDate(semente),
  'no semanal, uma dose antiga registrada hoje (no fim da lista) não muda a próxima dose');

/* A pessoa do diário: Rybelsus 7 mg, começou há 20 dias (hoje é o dia
   21, semana 3), e esqueceu dois dias — há 10 dias (semana 2) e há 3
   dias (semana 3). */
const A = diario(20, ate(20).filter((k) => k !== 10 && k !== 3));
const fora = clone(A);
(fora.injections as any[]).push({ t: diaHa(3), med: 'rybelsus', dose: 7, site: '', note: '' });
ok(lastInjection(fora)!.t === diaHa(0), 'a dose esquecida registrada hoje vai para o fim da lista, e a última continua sendo a de hoje');
ok(+nextInjectionDate(fora) === amanha, 'e a próxima dose continua sendo amanhã');

const grava = clone(A);
ok(!seriaAMaisRecente(grava, diaHa(10)) && seriaAMaisRecente(grava, diaHa(0, 20, 0)), 'a dose de dez dias atrás não seria a mais recente; a das 20h de hoje, sim');
gravarDose(grava, { t: diaHa(10), med: 'rybelsus', dose: 3, site: '', note: '' });
const ordem = (grava.injections as any[]).map((i) => i.t);
ok((grava.profile as any).dose === 7, 'gravar a dose retroativa (3 mg) não troca a dose do perfil (7 mg)');
ok(ordem.every((t, i) => i === 0 || ordem[i - 1] <= t), 'e ela entra no lugar da data dela — a lista segue em ordem');
gravarDose(grava, { t: diaHa(0, 20, 0), med: 'rybelsus', dose: 14, site: '', note: '' });
ok((grava.profile as any).dose === 14 && lastInjection(grava)!.dose === 14, 'a dose mais nova, essa sim, vira a dose do perfil');
ok(dosesNoDia(grava, +new Date()).length === 2, 'e o dia de hoje passa a ter duas doses — a tela pede confirmação pela segunda');

/* ------------------------------------------------------------------ */
console.log('\n3. NO DIÁRIO, O QUE ERA DO CICLO SEMANAL SAI DE CENA');
ok(doseDiaria(A) && !temFasesDoCiclo(A), 'Rybelsus é dose diária, e o ciclo semanal não vale');
const cyc = doseCycle(A);
ok(cyc.phases.length === 1 && cyc.phase.key === 'diaria' && cyc.phase.label === T.ciclo.faseDiariaLabel,
  `o ciclo tem uma fase só, a do nível estável ("${cyc.phase.label}")`);
const brief = todayBrief(A);
ok(brief.chapeu === T.ciclo.chapeuSemCiclo && T.ciclo.diarios.some((d) => d.head === brief.head),
  `a Home não diz "dia 1 depois da dose": "${brief.chapeu} · ${brief.head}"`);
ok(!brief.head.includes(T.ciclo.aplicHead) && mensagemDoDia(A).fonte === 'ciclo', 'e nada de "o efeito começa a subir"');
ok(hungerForecast(A) === null && pharmaSeries(A).trough === null, 'sem vale da fome antes da próxima dose');
ok(!descobertas(A).some((d) => d.id.startsWith('ant:vale') || d.id.startsWith('ant:enjoo')),
  'e sem as antecipações do vale e da janela do enjoo na Home');

/* O mesmo diário com doses espaçadas e o enjoo nos dois dias depois de
   cada uma: no semanal a janela aparece; no diário, não. */
const espacado = (med: string) => {
  const x = diario(20, [20, 13, 6], med === 'rybelsus' ? 7 : 2.5, med);
  (x as any).checkins = [20, 19, 13, 12, 6, 5, 17, 16, 10, 9, 3, 2].map((k, i) => ({
    t: diaHa(k, 0, 0), nausea: i < 6 ? 4 : 1, mood: 3, sint: {},
  }));
  return x;
};
ok(janelaDoEnjoo(espacado('mounjaro')) !== null && janelaDoEnjoo(espacado('rybelsus')) === null,
  'a "janela de 48 h" do enjoo aparece no semanal e não no diário, com os mesmos registros');
ok(diasDaJanela(espacado('mounjaro')).some((d) => d.faz.posAplicacao != null) && diasDaJanela(espacado('rybelsus')).every((d) => d.faz.posAplicacao === null),
  'o "um ou dois dias depois da dose" das descobertas é nulo no diário — o par não é montado');
const pad = padraoDoCiclo(espacado('rybelsus'));
ok(sintomaNoCiclo(espacado('rybelsus')).length === 0 && !pad.pode && pad.motivo === 'poucos',
  'os sintomas não afirmam "parecido ao longo de todo o ciclo" de um ciclo que não existe');
const P = T.rotina.perguntas;
const sugA = companionSuggestions(A);
ok(![P.depoisDaAplicacao, P.maisFome, P.semFome, P.trocarODia].some((q) => sugA.includes(q)),
  'as perguntas sugeridas não falam de fase nem de trocar o dia da dose');
ok(!recommendations(A).some((r) => r.porque === T.rotina.empurroes.aplicacaoPorque(false)),
  'as próximas ações não dizem que "a dose da semana está chegando"');
const L = T.companion.biblioteca;
ok(!libraryPicks(A).some((l) => l.titulo === L.primeirosTitulo || l.titulo === L.fomeTitulo),
  'a biblioteca não recomenda leitura por fase do ciclo');
ok(!cicloFases(A).comCiclo && cicloFases(A).fases.every((f) => f.estado === 'depois'),
  'a tela de fases, se aberta, não marca "agora" em fase nenhuma');
const tarefa = protocoloDaSemana(A).tarefas.find((t) => t.texto === T.rotina.protocolo.aplicacaoTodoDia);
ok(!!tarefa && tarefa.nota === T.rotina.protocolo.nota(6, 7, T.rotina.protocolo.unidadeDia[1]) && !tarefa.feita,
  `o protocolo pede "Dose todo dia" e conta dias com dose (${tarefa?.nota})`);

/* ------------------------------------------------------------------ */
console.log('\n4. A SEMANA É A DO TRATAMENTO, COM A RÉGUA DO PAINEL');
const tw = timelineWeeks(A);
const painel = journeySummary(A).semana;
ok(painel === 3 && semanaDoTratamento(new Date(), A.profile.startT) === 3, `o painel está na semana 3 (SEMANA ${painel} · DIA ${journeySummary(A).dia})`);
ok(tw.length === 3 && tw.map((w) => w.semana).join(',') === '3,2,1', `três blocos, do mais novo ao mais velho (${tw.map((w) => w.semana).join(', ')})`);
ok(tw[0].semana === painel && tw.every((w) => w.diaria && semanaDoTratamentoEm(A, w.t) === w.semana),
  'o bloco de cima tem o número do painel, e cada bloco começa na própria semana');
ok(tw.every((w) => w.t === diaHa(20 - 7 * (w.semana - 1), 0, 0) && w.fim === diaHa(20 - 7 * w.semana, 0, 0)),
  'cada bloco tem sete dias, contados do início do tratamento');
ok(inicioDoTratamento(A) === diaHa(20, 0, 0) && JSON.stringify(janelaDaSemanaDoTratamento(A, 2)) === JSON.stringify({ ini: diaHa(13, 0, 0), fim: diaHa(6, 0, 0) }),
  'a âncora é o início do tratamento, e a semana 2 vai do dia 8 ao 14');
const rotulo = `${MEDS.rybelsus.label} 7 mg`;
ok(tw.every((w) => w.dose === rotulo && w.site === '' && !w.mudouDose), `o remédio da semana ("${rotulo}"), sem local`);
ok(tw.every((w) => !w.eventos.some((e) => e.kind === 'aplicacao')), 'as doses não viram sete linhas iguais na semana: o cabeçalho as conta');
ok(JSON.stringify(tw.map((w) => w.doses)) === JSON.stringify([{ feitos: 6, dias: 7 }, { feitos: 6, dias: 7 }, { feitos: 7, dias: 7 }]),
  `as contagens: ${tw.map((w) => `${w.doses?.feitos}/${w.doses?.dias}`).join(', ')}`);
ok(tw[1].dosesTexto === T.home.semana.dosesDaSemana(6, 7) && tw[2].dosesTexto === T.home.semana.dosesDaSemana(7, 7),
  `o cabeçalho escreve "${tw[1].dosesTexto} · ${tw[1].dose}"`);

const comCheckins = clone(A);
(comCheckins as any).checkins = [9, 8].map((k) => ({ t: diaHa(k, 0, 0), mood: 4, agua: 6, prot: 80, exerc: 30, sint: {} }));
const tw2 = timelineWeeks(comCheckins)[1];
ok(tw2.semana === 2 && tw2.resumo.includes(T.home.semana.contagem(2, T.home.semana.checkin[1])) && tw2.metricas.length === 3,
  `o resto da semana é o de sempre — o que rendeu e os números (${tw2.resumo})`);

const titulou = diario(20, ate(20));
for (const i of titulou.injections as any[]) if (i.t < diaHa(9, 0, 0)) i.dose = 3;
const twT = timelineWeeks(titulou);
ok(twT[1].mudouDose && !twT[0].mudouDose && !twT[2].mudouDose && twT[1].dose === rotulo && twT[2].dose === `${MEDS.rybelsus.label} 3 mg`,
  'a semana em que a dose subiu (3 → 7 mg) é a "dose ajustada", com a dose mais nova dela');

const parou = diario(20, ate(20).filter((k) => k < 6 || k > 13));
ok(timelineWeeks(parou)[1].doses?.feitos === 0 && timelineWeeks(parou)[1].dosesTexto === T.home.semana.dosesDaSemana(0, 7) && timelineWeeks(parou).length === 3,
  `a semana sem dose continua na lista, sem cobrança ("${timelineWeeks(parou)[1].dosesTexto}")`);

/* ------------------------------------------------------------------ */
console.log('\n5. A DOSE DE HOJE E OS DIAS COM DOSE DESTA SEMANA');
const h = doseDeHoje(A);
ok(h.feita && h.t === diaHa(0) && h.dose === 7 && h.quantas === 1, 'a dose de hoje está feita, às 7h12, com 7 mg');
const semHoje = diario(20, ate(20).filter((k) => k !== 10 && k !== 3 && k !== 0));
ok(!doseDeHoje(semHoje).feita && doseDeHoje(semHoje).quantas === 0, 'antes do toque, a dose de hoje está pendente — nada é presumido');
ok(JSON.stringify((({ semana, feitos, dias }) => ({ semana, feitos, dias }))(diasComDoseNaSemana(A))) === '{"semana":3,"feitos":6,"dias":7}',
  'com a dose de hoje: 6 de 7 dias com dose na semana 3');
ok(JSON.stringify((({ semana, feitos, dias }) => ({ semana, feitos, dias }))(diasComDoseNaSemana(semHoje))) === '{"semana":3,"feitos":5,"dias":6}',
  'antes dela, hoje ainda não conta: 5 de 6 — o dia não acabou');
ok(timelineWeeks(semHoje)[0].dosesTexto === T.home.semana.dosesDaSemana(5, 6), 'e o bloco de cima diz o mesmo que o painel');
const primeiroDia = diario(14, ate(14).filter((k) => k !== 0));
ok(diasComDoseNaSemana(primeiroDia).dias === 0 && timelineWeeks(primeiroDia)[0].dosesTexto === '',
  'no primeiro dia da semana, antes da dose, não há o que contar — e o bloco não escreve "0 de 0"');
const dobrada = clone(A);
(dobrada.injections as any[]).push({ t: diaHa(0, 21, 0), med: 'rybelsus', dose: 7, site: '', note: '' });
ok(doseDeHoje(dobrada).quantas === 2 && diasComDoseNaSemana(dobrada).feitos === 6 && adesao(dobrada) === adesao(A),
  'duas doses no mesmo dia são um dia: nem a semana nem a adesão sobem');
ok(adesao(A) === Math.round((diasComDose(A).length / 21) * 100), `a adesão é de dias com dose (${diasComDose(A).length} de 21 = ${adesao(A)}%)`);

/* ------------------------------------------------------------------ */
console.log('\n6. AS CONQUISTAS CONTAM DIAS COM DOSE');
const qA = conquistas(A).find((q) => q.id === 'doses')!;
ok(qA.niveis === 5 && qA.nivel === 1 && qA.alvo === 7 && qA.proximo === 30,
  `os degraus são de dias — 7, 30, 90, 180, 365 —, e 19 dias passam do primeiro (${qA.desc}; ${qA.falta})`);
ok(qA.desc === T.conquistas.dosesDiasDesc(7) && qA.falta === T.conquistas.dosesDiasFalta(30 - diasComDose(A).length),
  'o texto fala em dias com dose');
const qDobrada = conquistas(dobrada).find((q) => q.id === 'doses')!;
ok(qDobrada.resta === qA.resta, 'a dose dobrada não adianta a trilha');
const seis = diario(5, ate(5));
ok(conquistas(seis).find((q) => q.id === 'doses')!.nivel === 0, 'seis dias de dose ainda não são o primeiro degrau (eram "4 doses" no semanal)');

/* ------------------------------------------------------------------ */
console.log('\n7. A PRIMEIRA SEMANA, A DOSE NOVA E A SEMANA QUE PASSOU');
const dia4 = diario(3, ate(3));
ok(mensagemDoDia(dia4).chapeu === T.etapa.primeiraChapeu(4) && mensagemDoDia(dia4).head === T.etapa.primeiraDias[3].head,
  'no quarto dia, a primeira semana continua — contada da primeira dose, e não "só com uma dose"');
const dia6 = diario(5, ate(5));
ok(mensagemDoDia(dia6).head === T.etapa.primeiraDiaSeisDiaria.head,
  'o sexto dia não fala da fome voltando "perto do fim do ciclo"');
ok(mensagemDoDia(diario(7, ate(7))).chapeu !== T.etapa.primeiraChapeu(8), 'no oitavo dia, a primeira semana acabou');
const subiu = diario(20, ate(20));
for (const i of subiu.injections as any[]) if (i.t < diaHa(3, 0, 0)) i.dose = 3;
ok(mensagemDoDia(subiu).chapeu === T.etapa.doseNovaChapeu, 'três dias depois de subir para 7 mg, a Home fala da dose nova — e não só no dia dela');
ok(mensagemDoDia(titulou).chapeu !== T.etapa.doseNovaChapeu, 'nove dias depois, já não');
const virada = diario(14, ate(14));
const resumo = semanaQuePassou(virada);
ok(!!resumo && resumo.semana === 2, `no primeiro dia da semana 3, o resumo da semana 2 que fechou (semana ${resumo?.semana})`);
ok(semanaQuePassou(A) === null, 'no meio da semana, nada — e não a cada dose');
ok(temHistoria(A) && !temHistoria(diario(3, ate(3))), '"Seu tratamento" abre com uma semana de tratamento fechada, e não na segunda dose');
ok(dosesEmOrdem(A).length === (A.injections as any[]).length, 'nenhuma dose some ao ordenar');

/* ------------------------------------------------------------------ */
/* ⚠️ O QUE AS TELAS LEEM DA LÓGICA (01/10/2026, parte B1 — as telas):
   a pastilha de Cuidado, o resumo da semana que passou na Home e o dia de
   cada casa da grade de /aplicacoes, que deixa marcar vários dias
   esquecidos de uma vez. */
console.log('\n8. O QUE AS TELAS LEEM');
const H = T.tratamento.doseDeHoje;
ok(doseContext(A).proxima === H.pastilhaFeita(fmtTime(new Date(diaHa(0)))),
  `com a dose de hoje, a pastilha de Cuidado é a dose de hoje (${doseContext(A).proxima})`);
const aindaSemAHoje = diario(20, ate(20).filter((k) => k !== 0));
ok(doseContext(aindaSemAHoje).proxima === H.pastilhaAindaNao, 'sem ela, "ainda não registrada" — e não "Próxima dose amanhã"');
ok(!doseContext(semente).proxima.includes(H.titulo), `no semanal, a pastilha de sempre (${doseContext(semente).proxima})`);
ok(resumo?.doses === T.home.semana.dosesDaSemana(7, 7), `a semana que fechou diz quantos dias tiveram dose (${resumo?.doses})`);
const resumoSemanal = semanaQuePassou(semente);
ok(!resumoSemanal || !('doses' in resumoSemanal), 'e a do semanal sai como sempre saiu, sem o campo');
const grade = injGrade(A).cells;
ok(grade.every((c, i) => i === 0 || c.t > grade[i - 1].t) && grade.some((c) => c.today && c.t === +startOfDay(new Date())),
  'cada casa da grade sabe o seu dia (00h), em ordem, com hoje entre elas');
const esquecidos = grade.filter((c) => !c.applied && c.t < +startOfDay(new Date()) && c.t >= inicioDoTratamento(A)!).map((c) => c.t);
ok(esquecidos.length === 2 && esquecidos.includes(+startOfDay(new Date(diaHa(10)))) && esquecidos.includes(+startOfDay(new Date(diaHa(3)))),
  'os dias marcáveis são os dois esquecidos — nem antes do início, nem hoje, nem dia com dose');

/* ------------------------------------------------------------------ */
/* ⚠️ OS ACHADOS DA REVISÃO DE 01/10/2026, um caso por conserto (F1 a
   F12). Cada um afirma o que a versão de antes errava — e falharia nela —,
   para o conserto não voltar calado. */
console.log('\n9. OS ACHADOS DA REVISÃO (01/10/2026)');
const W = T.home.semana;
const E = T.cuidado.estado;
const umaDose = (k: number, med = 'rybelsus', d = 7, extra: Record<string, unknown> = {}) =>
  ({ t: diaHa(k), med, dose: d, site: '', note: '', ...extra });
const daSemana = (S: State) => (({ semana, feitos, dias }) => JSON.stringify({ semana, feitos, dias }))(diasComDoseNaSemana(S));

/* F1 — a conta começa no regime diário de agora. */
/* Quem já tinha começado: o tratamento há 16 dias (a semana 3 começou
   anteontem), e o aplicativo ontem, com a dose do cadastro. */
const jaTinha = diario(16, [1, 0]);
(jaTinha.profile as any).consentimento.em = diaHa(1, 8, 0);
(jaTinha.injections as any[])[0].origem = 'cadastro';
ok(daSemana(jaTinha) === '{"semana":3,"feitos":2,"dias":2}' && timelineWeeks(jaTinha)[0].dosesTexto === W.dosesDaSemana(2, 2),
  `F1 quem já tinha começado: o dia antes da primeira dose não é dose perdida (${timelineWeeks(jaTinha)[0].dosesTexto}, era "2 de 3")`);
/* Quem esperou a receita: o início há 20 dias, o comprimido há 3. */
const esperou = diario(20, [3, 2, 1, 0]);
ok(daSemana(esperou) === '{"semana":3,"feitos":4,"dias":4}', 'F1 quem esperou a receita: a semana conta da primeira dose ("4 de 4", era "4 de 7")');
/* Quem trocou a caneta semanal pelo comprimido anteontem. */
const trocou = diario(20, [2, 1, 0]);
(trocou.injections as any[]).unshift(...[20, 13, 6].map((k) => umaDose(k, 'mounjaro', 5, { site: 'abd-e' })));
const twTrocou = timelineWeeks(trocou);
ok(inicioDoDiario(trocou) === diaHa(2, 0, 0) && daSemana(trocou) === '{"semana":3,"feitos":3,"dias":3}',
  'F1 quem trocou: o regime diário começa no primeiro comprimido, e o dia da caneta não conta como comprimido ("3 de 3", era "4 de 7")');
ok(twTrocou[0].doses?.feitos === 3 && twTrocou[0].doses?.dias === 3 && twTrocou[1].doses === null && twTrocou[2].doses === null,
  'F1 e os blocos dizem o mesmo: a semana da troca conta do comprimido, as da caneta não contam');
ok(dosesPrevistas(trocou) === 3 && dosesFeitas(trocou) === 3 && adesao(trocou) === 100,
  `F1/F5 a adesão de quem trocou conta do regime diário (${dosesFeitas(trocou)} de ${dosesPrevistas(trocou)}, era 6 de 21)`);
const trocouAgora = clone(trocou);
(trocouAgora.profile as any).consentimento.em = diaHa(2, 8, 0);
ok(!temHistoria(trocouAgora), 'F1 "Seu tratamento" não abre com a semana da caneta como se fosse uma semana diária fechada');
/* Trocou e ainda não registrou o comprimido: não há regime diário. */
const semComprimido = clone(trocou);
(semComprimido as any).injections = (trocou.injections as any[]).filter((i) => i.med === 'mounjaro');
ok(inicioDoDiario(semComprimido) === null && diasComDoseNaSemana(semComprimido).dias === 0
  && dosesPrevistas(semComprimido) === 0 && careState(semComprimido).adesaoRotulo === null && constanciaDaGrade(semComprimido).previstas === 0,
  'F1 sem comprimido registrado não há o que contar: o painel volta ao check-in, e a pastilha some');
/* Ida e volta: o comprimido, a caneta, o comprimido de novo. O primeiro
   período é diário pela dose, mas não é o regime de agora: o começo dele
   fica depois da janela, e o bloco não conta. */
const idaEVolta = diario(20, [20, 19, 18, 17, 16, 15, 2, 1, 0]);
(idaEVolta.injections as any[]).splice(6, 0, umaDose(13, 'mounjaro', 5, { site: 'abd-e' }), umaDose(6, 'mounjaro', 5, { site: 'abd-d' }));
const twIda = timelineWeeks(idaEVolta);
ok(twIda[2].semana === 1 && twIda[2].doses?.dias === 0 && twIda[2].dosesTexto === '',
  `F1 a semana do comprimido de antes da caneta não conta "6 de 7" num regime que já acabou (${JSON.stringify(twIda[2].doses)})`);

/* F2 — a semana "com dose em dia" é a que teve dose todos os dias. */
const planoA = careState(A).plano;
ok(JSON.stringify(planoA.semanasFeitas) === '[1]' && planoA.cumpridas === 1,
  `F2 a semana 2 (um dia esquecido) não está "em dia", e a de hoje fica de fora (${JSON.stringify(planoA.semanasFeitas)}, eram 3)`);
ok(JSON.stringify(careState(diario(20, ate(20))).plano.semanasFeitas) === '[1,2]', 'F2 com todos os dias, as duas semanas fechadas estão em dia');
ok(JSON.stringify(careState(trocou).plano.semanasFeitas) === '[1,2]', 'F2 as semanas da caneta de quem trocou valem pela regra delas: tiveram dose');
ok(JSON.stringify(careState(jaTinha).plano.semanasFeitas) === '[]', 'F2 as semanas de antes do aplicativo não são semanas em dia, nem perdidas');
ok(!('semanasFeitas' in careState(semente).plano), 'F2 no semanal, o plano sai como sempre saiu, sem o campo');

/* F3 — o dia esquecido ganha a dose que estava em uso nele. */
const subiuOntem = diario(20, ate(20).filter((k) => k !== 12 && k !== 5));
for (const i of subiuOntem.injections as any[]) if (i.t < diaHa(1, 0, 0)) i.dose = 3;
ok(JSON.stringify(doseEmUsoNoDia(subiuOntem, diaHa(12, 0, 0))) === '{"med":"rybelsus","dose":3}'
  && doseEmUsoNoDia(subiuOntem, diaHa(5, 0, 0)).dose === 3,
  'F3 quem subiu de 3 para 7 mg ontem: os dias esquecidos da semana passada ganham 3 mg, e não os 7 do perfil');
const tarde = diario(20, [4, 3]);
for (const i of tarde.injections as any[]) i.dose = 3;
ok(doseEmUsoNoDia(tarde, diaHa(8, 0, 0)).dose === 3 && doseEmUsoNoDia(diario(5, []), diaHa(2, 0, 0)).dose === 7,
  'F3 sem dose antes, a primeira depois; sem dose nenhuma, a do perfil');
const marcou = clone(subiuOntem);
const marcados = [12, 5].map((k) => diaHa(k, 0, 0));
const emUso = marcados.map((d) => doseEmUsoNoDia(marcou, d));
marcados.forEach((d, k) => gravarDose(marcou, { t: d + 12 * 3600e3, med: emUso[k].med, dose: emUso[k].dose, site: '', note: '' }));
const twMarcou = timelineWeeks(marcou);
ok(!twMarcou[1].mudouDose && !twMarcou[2].mudouDose && (marcou.profile as any).dose === 7,
  'F3 marcados os dois dias, nenhuma semana antiga ganha uma "dose ajustada" inventada, e o perfil continua em 7 mg');
ok(!T.tratamento.telaAplicacoes.marcarDiasNota(false).includes('7 mg'), 'F3 a nota não promete a dose de hoje para todos os dias');

/* F4 — a semana só com dose não diz "Sem registros". */
ok(timelineWeeks(A)[0].resumo === W.semOutrosRegistros && timelineWeeks(parou)[1].resumo === W.semRegistros,
  `F4 "${timelineWeeks(A)[0].dosesTexto} · ${timelineWeeks(A)[0].resumo}"; a semana sem dose nenhuma, "${timelineWeeks(parou)[1].resumo}"`);

/* F5 — hoje só conta depois da dose de hoje. */
ok(adesao(aindaSemAHoje) === 100 && dosesPrevistas(aindaSemAHoje) === 20 && careState(aindaSemAHoje).adesaoRotulo === E.adesao(20, 20),
  `F5 antes do comprimido de hoje, "${careState(aindaSemAHoje).adesaoRotulo}" — e não "20 de 21"`);
ok(JSON.stringify(constanciaDaGrade(aindaSemAHoje)) === JSON.stringify({ feitas: 20, previstas: 20, semanas: 6 }),
  'F5 a constância da grade de doses conta igual');
const tomou = clone(aindaSemAHoje);
gravarDose(tomou, { t: diaHa(0), med: 'rybelsus', dose: 7, site: '', note: '' });
ok(careState(tomou).adesaoRotulo === E.adesao(21, 21) && JSON.stringify(diasDoDiario(tomou)) === '{"feitos":21,"dias":21}',
  'F5 depois do toque, hoje entra: 21 de 21');
ok(adesao(A) === 90 && careState(A).adesaoRotulo === E.adesao(19, 21), `F5 com dois dias esquecidos, 19 de 21 (${adesao(A)}%)`);
/* Sem dia a contar (trocou e ainda não tomou o comprimido), a adesão
   não vira "0%" em lugar nenhum. */
const DA = T.cruzamentos.adesao;
ok(adesaoSemConta(semComprimido) && !radar(semComprimido).some((e) => e.id === 'adesao')
  && !patterns(semComprimido).some((p) => p.titulo === DA.titulo(0)) && !resumoDaJornada(semComprimido).includes('adesão 0%'),
  'F5 sem dia a contar, nem o radar, nem o retrato, nem o resumo da jornada dizem "0%"');
ok(!adesaoSemConta(A) && patterns(A).some((p) => p.titulo === DA.titulo(90) && p.texto === DA.texto(19, DA.textoQuaseTodas)),
  'F5 com dias a contar, o retrato fala dos dias com dose (19, a 90%)');
ok(!adesaoSemConta(semente) && radar(semente).some((e) => e.id === 'adesao'), 'F5 no semanal, o eixo da adesão continua no radar');

/* F6 — a folha de confirmação não tem "Próxima dose" no diário. Ela é
   tela; o que se afirma aqui é o que ela lê para decidir o cartão (ver
   `temCartao`, em app/aplicacao-ok): o comprimido diário não tem linha
   nenhuma, e o cartão sai; a caneta diária fica só com a do recipiente. */
const saxenda = diario(20, ate(20), 1.2, 'saxenda');
ok(doseDiaria(A) && !FORMAS()[formaDe(A)].injetavel, 'F6 o comprimido diário: sem "Próxima dose" e sem recipiente — nenhum cartão vazio');
ok(doseDiaria(saxenda) && FORMAS()[formaDe(saxenda)].injetavel, 'F6 a caneta diária: o cartão só com o recipiente');
ok(!doseDiaria(semente), 'F6 no semanal, a próxima dose continua na folha');

/* F7 — cada escada da trilha de doses tem a sua marca d'água. */
const vaiEVolta = clone(semente);
(vaiEVolta as any).vistoEmConquistas = {};
marcarComoVistas(vaiEVolta);
const visto = (vaiEVolta as any).vistoEmConquistas as Record<string, number>;
const nivelSemanal = visto.doses;
const forma0 = (semente.profile as any).forma, dose0 = (semente.profile as any).dose;
vaiEVolta.profile.med = 'rybelsus'; (vaiEVolta.profile as any).forma = 'comprimido'; (vaiEVolta.profile as any).dose = 7;
ensureDefaults(vaiEVolta);
const nivelDiario = conquistas(vaiEVolta).find((q) => q.id === 'doses')!.nivel;
ok(nivelSemanal > nivelDiario && visto.doses === nivelSemanal && visto['doses:diaria'] === nivelDiario,
  `F7 ao passar para o diário, a escada diária ganha a marca dela (${nivelDiario}) e a semanal fica onde estava (${nivelSemanal})`);
ok(!novosNiveis(vaiEVolta).some((q) => q.id === 'doses'), 'F7 e nada é comemorado na troca');
vaiEVolta.profile.med = semente.profile.med; (vaiEVolta.profile as any).forma = forma0; (vaiEVolta.profile as any).dose = dose0;
ok(!novosNiveis(vaiEVolta).some((q) => q.id === 'doses'), 'F7 de volta à caneta semanal, os degraus semanais já vistos não comemoram de novo');
const vistoA = clone(A);
(vistoA as any).vistoEmConquistas = {};
marcarComoVistas(vistoA);
ok((vistoA as any).vistoEmConquistas['doses:diaria'] === qA.nivel && (vistoA as any).vistoEmConquistas.doses === undefined,
  'F7 no diário, o "já vi" grava na escada diária, e não na semanal');

/* F8 — marcar vários dias pede o mesmo que o toque e a folha. A grade é
   tela; o que se afirma é a pergunta que ela passou a fazer. */
ok(faltaNaDose(saxenda, { dose: 1.2, usadasAntes: null }).includes('recipiente') && faltaNaDose(A, { dose: 7, usadasAntes: null }).length === 0,
  'F8 a caneta diária sem caneta registrada não marca dia nenhum (falta o recipiente); o comprimido marca');

/* F10 — o slide "Sua semana N" só para a semana que teve alguma coisa. */
const parouHaMeses = diario(70, Array.from({ length: 31 }, (_, i) => 40 + i));
ok(semanaQuePassou(parouHaMeses) === null && !!semanaQuePassou(virada),
  'F10 quem parou há mais de um mês não ganha "Nenhuma dose registrada · Sem registros" a cada virada de semana');

/* F12 — o resumo da semana de calendário não lista uma linha por dose. */
const segundaLida = semanaLida(new Date()).de;
const chavesDeDose = (S: State) => new Set(timelineEvents(S).filter((e) => e.kind === 'aplicacao').map((e) => e.key));
const dA = chavesDeDose(A);
ok(!destaquesDaSemana(A, segundaLida).some((d) => dA.has(d.k)), 'F12 no diário, "o que marcou a semana" não tem sete linhas de dose');
const ultS = lastInjection(semente)!;
const segundaS = (() => { const d = new Date(ultS.t); return +new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7)); })();
const dS = chavesDeDose(semente);
ok(destaquesDaSemana(semente, segundaS).some((d) => dS.has(d.k)), 'F12 no semanal, a dose continua sendo um acontecimento da semana');

/* ------------------------------------------------------------------ */
/* ⚠️ O RELÓGIO PARADO, como em scripts/avaliacao/relogio — mas com o
   instante e o fuso de cada caso. O fuso troca no meio da sonda (o Node
   relê `process.env.TZ`), e volta no fim; o instante é montado DEPOIS da
   troca, para "28/10 às 10h" ser 10h em Berlim. */
function comRelogio<R>(fuso: string | null, [a, m, d, h]: [number, number, number, number], fn: () => R): R {
  const Real = Date;
  const antes = process.env.TZ ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (fuso) process.env.TZ = fuso;
  const AGORA = new Real(a, m, d, h, 0, 0).getTime();
  class Fixo extends Real {
    constructor(...x: any[]) {
      if (x.length === 0) super(AGORA);
      else super(...(x as [number]));
    }
    static now() { return AGORA; }
  }
  (globalThis as any).Date = Fixo;
  try { return fn(); } finally { (globalThis as any).Date = Real; process.env.TZ = antes; }
}

/* F11 — a grade de doses se ancora em hoje. No último dia da semana, o
   toque da dose de hoje empurrava a grade uma fileira para frente. */
const ultimoDiaDaSemana = (() => {
  const alvo = (primeiroDiaDaSemana() + 6) % 7;
  let d = new Date(2026, 9, 1, 10);
  while (d.getDay() !== alvo) d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 10);
  return [d.getFullYear(), d.getMonth(), d.getDate(), 10] as [number, number, number, number];
})();
comRelogio(null, ultimoDiaDaSemana, () => {
  const S = diario(20, ate(20));
  const cells = injGrade(S).cells;
  ok(cells[cells.length - 1].t === +startOfDay(new Date()) && cells[cells.length - 1].today,
    'F11 no último dia da semana, com a dose de hoje, a grade termina hoje — sem uma fileira de dias futuros');
});

console.log('\n10. EM BERLIM, NA SEMANA EM QUE O RELÓGIO VOLTA UMA HORA (25/10/2026)');
/* Quarta, 28/10, 10h: a caneta semanal na segunda 19/10 (o início), e o
   comprimido todo dia de quinta 22/10 em diante. */
comRelogio('Europe/Berlin', [2026, 9, 28, 10], () => {
  ok(new Date(2026, 9, 25, 1).getTimezoneOffset() === -120 && new Date(2026, 9, 25, 12).getTimezoneOffset() === -60,
    'o relógio está em Berlim, e o dia 25/10 tem 25 horas');
  const S = diario(9, [6, 5, 4, 3, 2, 1, 0]);
  (S.injections as any[]).unshift(umaDose(9, 'mounjaro', 5, { site: 'abd-e' }));
  ok(inicioDoDiario(S) === +new Date(2026, 9, 22), 'F1 o regime diário começa à meia-noite de 22/10');
  const tw = timelineWeeks(S);
  ok(tw[1].t === +new Date(2026, 9, 19) && tw[1].fim === +new Date(2026, 9, 26) && tw[0].t === +new Date(2026, 9, 26),
    'os blocos de 7 dias atravessam a troca pelo calendário (19/10 a 25/10, e 26/10 em diante)');
  ok(tw[1].doses?.feitos === 4 && tw[1].doses?.dias === 4 && daSemana(S) === '{"semana":2,"feitos":3,"dias":3}',
    `F1 o bloco da troca conta do comprimido: "${tw[1].dosesTexto}" (era "5 de 7", com a caneta), e a semana 2, "${tw[0].dosesTexto}"`);
  const tarefa = protocoloDaSemana(S).tarefas.find((t) => t.texto === T.rotina.protocolo.aplicacaoTodoDia);
  ok(tarefa?.nota === T.rotina.protocolo.nota(7, 7, T.rotina.protocolo.unidadeDia[1]) && !!tarefa?.feita,
    `F9 "Dose todo dia": os sete dias pelo calendário, 22/10 incluído (${tarefa?.nota}, era 6 de 7)`);
});
/* ------------------------------------------------------------------ */
/* A segunda verificação das correções (01/10/2026): quem troca de caneta
   semanal para comprimido diário com o app aberto, os dias entre a última
   caneta e o primeiro comprimido, o resumo do médico de quem ainda não
   registrou o comprimido, e a semana de um regime diário anterior. */
{
  /* A troca com o app aberto: a gravação cria a marca da escada diária no
     nível de agora (store.update chama iniciarMarcaDaEscadaDiaria), e nada
     é comemorado na hora. */
  const sw = clone(semente);
  (sw.profile as any).med = 'saxenda';
  const antes = novosNiveis(sw).some((q: any) => q.id === 'doses');
  iniciarMarcaDaEscadaDiaria(sw);
  ok(!novosNiveis(sw).some((q: any) => q.id === 'doses') && (sw as any).vistoEmConquistas.doses === (semente as any).vistoEmConquistas.doses,
    `F7 trocar para o diário com o app aberto não comemora a escada que acabou de aparecer (antes do conserto: ${antes ? 'comemorava' : 'não'}), e a marca semanal fica intacta`);
  /* O dia entre a última caneta e o primeiro comprimido entra como
     comprimido do regime de agora, e não como caneta. */
  const lacuna = doseEmUsoNoDia(trocou, diaHa(3, 0, 0));
  ok(lacuna.med === 'rybelsus' && lacuna.dose === 7,
    `F3 o dia esquecido logo depois da troca é um comprimido (${lacuna.med} ${lacuna.dose}), e não uma injeção da caneta`);
  /* O resumo do médico de quem trocou e ainda não registrou o comprimido
     conta as canetas, sem "Nenhuma registrada". */
  const doc = JSON.stringify(resumoDoTratamento(semComprimido));
  ok(!doc.includes(T.resumo.aplicacoesNenhuma) && doc.includes(T.resumo.aplicacoesRegistradas(3)),
    'F5 o resumo do médico diz "3 registradas", e não "Nenhuma registrada", com as canetas no diário');
  /* A semana de um regime diário ANTERIOR não vira "cumprida" com um
     comprimido só. */
  const feitasIda = (careState(idaEVolta).plano as any).semanasFeitas as number[] | undefined;
  ok(!!feitasIda && !feitasIda.includes(1),
    `F2 a semana do comprimido de antes da caneta (ida e volta) não conta como cumprida (${JSON.stringify(feitasIda)})`);
}

/* Domingo, 25/10, 10h: a dose das 7h12 do dia da troca. */
comRelogio('Europe/Berlin', [2026, 9, 25, 10], () => {
  const S = diario(6, ate(6));
  ok(+nextInjectionDate(S) === +new Date(2026, 9, 26) && diasAteAplicar(S) === 1,
    `F9 a próxima dose é a meia-noite de 26/10, amanhã — e não 23h de hoje (${new Date(+nextInjectionDate(S)).toString().slice(4, 21)})`);
  ok(daSemana(S) === '{"semana":1,"feitos":7,"dias":7}', 'F1 a primeira semana, com o dia de 25 horas, tem sete dias');
});

console.log(falhas ? `\n${falhas} afirmação(ões) falharam\n` : '\ntodas as afirmações passaram\n');
process.exit(falhas ? 1 : 0);
