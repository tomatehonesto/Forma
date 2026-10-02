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
        calendário, e a contagem do regime diário atravessando a troca;
    11. o estoque (parte B3, 02/10/2026): o semanal como era; o que cabe
        em cada recipiente (miligramas na caneta diária, caixa de 30 no
        comprimido); a linha de renovar em dias de cobertura; o recipiente
        de outro remédio (ou da outra dose do comprimido) que não gasta; e
        os textos em dias, sem "cerca de 0", nos seis idiomas;
    12. o lembrete (parte B4, 02/10/2026): o semanal com a conta e a chave
        de sempre; o diário todo dia na hora do alerta, sem antecedência,
        dentro da cota, quieto hoje depois do toque em "Tomei hoje" (a
        chave de remarcar muda com ele); o `reagendar` de verdade, lido
        no duble do expo-notifications; o texto do aviso do dia pela forma
        nos seis idiomas; e a noite em que o relógio volta uma hora.
    13. o relatório e a IA (parte B5, 02/10/2026): o semanal como era (o
        resumo, a lista do PDF, o .json, o que a IA lê e a constância de
        dose a dose, igual à conta antiga); no diário, "Dias com dose
        registrada: N de M" no resumo do médico, o PDF em trechos de dose
        com mais de 14 registros (a subida, a dose dobrada, o trecho
        recortado pelo período, a troca no mesmo dia e a troca de
        remédio), a constância em dias no .json, no resumo da conversa e
        no da semana, os dias seguidos com dose na leitura; as regras do
        servidor citando as linhas que o resumo escreve; e os seis
        idiomas.
   ============================================================ */

import { buildSeed, comNotificacoesDeExemplo, ensureDefaults, estadoVazio, iniciarMarcaDaEscadaDiaria, type State } from '../src/logic/seed';
import { resumoDoTratamento, resumoEmTexto } from '../src/logic/resumo';
import { htmlDoRelatorio, dosesEmResumo, INCLUI_PADRAO } from '../src/logic/relatorioPdf';
import { esc } from '../src/logic/pdf';
import { dadosParaExportar } from '../src/logic/exportacao';
import { constancia } from '../src/logic/descobertasDaSemana/detectores';
import { INSTRUCOES, TELAS } from '../servidor/conversa/prompt';
import { REGRAS_DA_LEITURA } from '../servidor/leitura/prompt';
import {
  lastInjection, nextInjectionDate, doseCycle, todayBrief, hungerForecast, pharmaSeries, janelaDoEnjoo,
  sintomaNoCiclo, padraoDoCiclo, companionSuggestions, recommendations, libraryPicks, protocoloDaSemana,
  timelineWeeks, journeySummary, adesao, cicloFases, temHistoria, temFasesDoCiclo, doseDiaria,
  gravarDose, seriaAMaisRecente, dosesNoDia, doseDeHoje, diasComDoseNaSemana, diasComDose,
  inicioDoTratamento, semanaDoTratamentoEm, janelaDaSemanaDoTratamento, dosesEmOrdem,
  doseContext, injGrade,
  inicioDoDiario, diasDoDiario, dosesPrevistas, dosesFeitas, careState, constanciaDaGrade, doseEmUsoNoDia,
  faltaNaDose, timelineEvents, diasAteAplicar, adesaoSemConta, radar, patterns,
  penStock, canetas, canetaAtual, dosesPorRecipiente, coberturaDoEstoque, estoqueNoFim, recipienteDaDose,
  carePending, RENOVAR_COM, trechosDeDose, diasComDoseDesde, cadenciaDias,
} from '../src/logic/derive';
import { resumoDaJornada, viaDoTratamento, frequenciaDoTratamento } from '../src/logic/resumoDaJornada';
import { conquistas, novosNiveis, marcarComoVistas } from '../src/logic/conquistas';
import { mensagemDoDia } from '../src/logic/etapa';
import { semanaQuePassou } from '../src/logic/destaques';
import { descobertas } from '../src/logic/descobertas';
import { diasDaJanela, semanaLida } from '../src/logic/descobertasDaSemana/dias';
import { destaquesDaSemana, resumoDaSemana } from '../src/logic/resumoDaSemana';
import { FORMAS, formaDe } from '../src/logic/formas';
import { primeiroDiaDaSemana, trocarLocal, type Local } from '../src/logic/local';
import { MEDS, cabeDe, dosesDoMg } from '../src/logic/meds';
import { semanaDoTratamento, startOfDay, fmtTime, addDays, hm, doseTxt } from '../src/logic/time';
import { proximasDe, resumoDe, tiposDe, antecedenciaDe, chaveDosAvisos, rotuloDoLead, novoAlerta, type Alerta } from '../src/logic/alertas';
import { textoDoAvisoDeDose, lerNotificacao } from '../src/logic/notificacoes';
import { reagendar } from '../src/logic/avisos';
import { agendados } from './duble/expo';
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

/* ------------------------------------------------------------------ */
/* ⚠️ A PARTE B3 — O ESTOQUE (02/10/2026). Era um 4 para todo remédio e
   uma linha de renovar em doses: a caneta de Saxenda "acabava" no quarto
   dia, a caixa de Rybelsus pedia receita a cada quatro comprimidos, e a
   cobertura saía "cerca de 0.2857 semanas". Agora o catálogo diz quanto
   cabe (doses, miligramas ou comprimidos por caixa), a linha de renovar é
   em DIAS de cobertura (sete, ou três doses, o que vier antes), e o
   recipiente de outro remédio não "gasta" com a dose de quem toma todo
   dia. E o semanal, de novo, primeiro. */
console.log('\n11. O ESTOQUE (B3): O QUE CABE, EM DIAS DE COBERTURA');
/* Um recipiente aberto à meia-noite de `k` dias atrás — as doses das 7h12
   daquele dia em diante saem dele. */
const comRecipiente = (S: State, k: number, med: string, dose: number, dosesPerPen: number, extra: Record<string, unknown> = {}) => {
  (S as any).pens = [{ t: diaHa(k, 0, 0), med, dose, dosesPerPen, ...extra }];
  return S;
};
const R = T.rotina.empurroes;
const PC = T.cuidado.pendencias;
const temReceita = (S: State) => carePending(S).some((p: any) => p.texto === PC.receita);
const recoReceita = (S: State) => recommendations(S).find((r) => r.texto === R.receita);

/* O semanal: a semente e a mesma caneta com 1 a 5 doses dentro. */
const pS = penStock(semente);
const regraAntiga = (left: number) => (left <= 1 ? T.tratamento.estoqueUrgente : left <= RENOVAR_COM ? T.tratamento.estoqueRenovar : T.tratamento.estoqueEmDia);
ok(pS.registrada && pS.verdict.label === regraAntiga(pS.left) && dosesPorRecipiente(semente) === 4,
  `semanal: a semente tem ${pS.left} de ${pS.total}, e o veredito é o de sempre ("${pS.verdict.label}")`);
ok(JSON.stringify(coberturaDoEstoque(semente)) === JSON.stringify({ n: pS.left, unidade: 'semana' }),
  'semanal: a cobertura continua em semanas, e é o mesmo número de antes (doses × 7 ÷ 7)');
const semanalCom = (n: number) => {
  const x = clone(semente);
  (x as any).pens = [{ t: lastInjection(semente)!.t + 1, med: semente.profile.med, dose: (semente.profile as any).dose, dosesPerPen: n }];
  return x;
};
ok([1, 2, 3, 4, 5].every((n) => penStock(semanalCom(n)).verdict.label === regraAntiga(n) && estoqueNoFim(semanalCom(n)) === (n <= 1)),
  'semanal: de 1 a 5 doses, "Renove agora" na última, "Vale renovar" com três — como sempre foi, e o cartão da Home só na última');
ok(recoReceita(semanalCom(3))?.emDias === 14, `semanal: o pedido da receita, com três doses, continua "daqui a 14 dias" (${recoReceita(semanalCom(3))?.emDias})`);
ok(!('mg' in recipienteDaDose({ t: 1, med: 'mounjaro', dose: 2.5, dosesPerPen: 4 })), 'semanal: o recipiente gravado sai como sempre saiu, sem miligramas');

/* O catálogo. */
ok(dosesDoMg(18, 0.6) === 30 && dosesDoMg(18, 1.2) === 15 && dosesDoMg(18, 1.8) === 10 && dosesDoMg(18, 2.4) === 7 && dosesDoMg(18, 3) === 6,
  'a caneta de 18 mg: 30 doses de 0,6, 15 de 1,2, 10 de 1,8, 7 de 2,4 e 6 de 3 mg — em µg, sem o 29,999 da vírgula');
ok(cabeDe('saxenda').em === 'mg' && cabeDe('victoza').em === 'mg' && JSON.stringify(cabeDe('rybelsus')) === '{"em":"comprimidos","n":30}'
  && JSON.stringify(cabeDe('mounjaro')) === '{"em":"doses","n":4}',
  'o catálogo: Saxenda e Victoza em mg, Rybelsus em caixa de 30, as semanais com o 4 de sempre');

/* A caneta diária, em miligramas. Saxenda 1,2 mg, dez doses desde a
   abertura. */
const sax = comRecipiente(diario(20, ate(9), 1.2, 'saxenda'), 9, 'saxenda', 1.2, 15, { mg: 18 });
const pSax = penStock(sax);
ok(pSax.registrada && pSax.left === 5 && pSax.total === 15, `Saxenda 1,2 mg, dez doses: restam 5 de 15 (${pSax.left} de ${pSax.total}), e não "acabou" no quarto dia`);
ok(pSax.verdict.label === T.tratamento.estoqueRenovar && !estoqueNoFim(sax),
  'cinco dias de remédio: "Vale renovar" (sete dias de cobertura), e ainda não o cartão da Home');
const subiu18 = clone(sax);
(subiu18.profile as any).dose = 1.8;
ok(penStock(subiu18).left === 3 && penStock(subiu18).total === 13 && estoqueNoFim(subiu18),
  'a dose sobe para 1,8 mg no meio da caneta: os 6 mg que sobram são 3 doses (13 no total), e é "Renove agora"');
const antiga = comRecipiente(clone(sax), 9, 'saxenda', 1.2, 4);
ok(penStock(antiga).left === 5, 'a caneta de Saxenda gravada antes disto (com o "4" de todo mundo) conta pelos 18 mg do catálogo');
ok(recipienteDaDose({ t: 1, med: 'saxenda', dose: 3, dosesPerPen: 6 }).mg === 18 && dosesPorRecipiente(diario(5, [], 3, 'saxenda')) === 6,
  'a caneta nova de Saxenda grava os 18 mg, e a 3 mg cabem 6 doses');
const saxSemCaneta = diario(5, ate(5), 3, 'saxenda');
ok(!penStock(saxSemCaneta).registrada && penStock(saxSemCaneta).verdict.good && !temReceita(saxSemCaneta),
  'sem caneta registrada, nada de "renovar": a caneta cheia de 3 mg (6 doses, menos de 7 dias) é recuo, e não estoque');

/* O comprimido. */
ok(!penStock(A).registrada && penStock(A).verdict.good && !estoqueNoFim(A) && !temReceita(A) && !recoReceita(A),
  'o comprimido sem caixa registrada: não há "a caixa acabou", nem receita a pedir — o Cuidado pede o registro');
ok(dosesPorRecipiente(A) === 30 && canetaAtual(A).atual === null, 'e a caixa nova abre com os 30 do padrão');
/* A caixa registrada pela folha de hoje grava os comprimidos confirmados
   (`comprimidos`, revisão da B3); a de antes gravava só o 4 de todo mundo. */
const caixa = (usadas: number, n = 30, extra: Record<string, unknown> = { comprimidos: n }) =>
  comRecipiente(diario(usadas + 5, ate(usadas - 1)), usadas - 1, 'rybelsus', 7, n, extra);
const c24 = caixa(24);
const cob24 = coberturaDoEstoque(c24);
ok(penStock(c24).left === 6 && JSON.stringify(cob24) === '{"n":6,"unidade":"dia"}' && penStock(c24).verdict.label === T.tratamento.estoqueRenovar,
  `a caixa de 30 com 24 tomados: restam 6, "cerca de 6 dias", e é hora de renovar (${penStock(c24).verdict.label})`);
ok(T.cuidado.tela.restamDe(6, 30, cob24) === '6 de 30 · cerca de 6 dias' && T.cuidado.pendencias.receitaSub(6, cob24) === '6 doses restantes · cerca de 6 dias',
  `o Cuidado escreve "${T.cuidado.tela.restamDe(6, 30, cob24)}" — e não "cerca de 0.857 semanas"`);
ok(temReceita(c24) && recoReceita(c24)?.emDias === 5, `o pedido da receita entra nas pendências, e nas ações "daqui a 5 dias" (${recoReceita(c24)?.emDias}), e não 35`);
const c2 = caixa(2);
ok(penStock(c2).left === 28 && JSON.stringify(coberturaDoEstoque(c2)) === '{"n":4,"unidade":"semana"}' && penStock(c2).verdict.good,
  'com 28 na caixa: "cerca de 4 semanas", estoque em dia');
const c28 = caixa(28);
ok(penStock(c28).left === 2 && estoqueNoFim(c28) && penStock(c28).verdict.label === T.tratamento.estoqueUrgente,
  'com 2 na caixa (dois dias): "Renove agora", e o cartão da Home aparece — três dias antes, e não no último');
const c30 = caixa(30);
const cob0 = coberturaDoEstoque(c30);
ok(penStock(c30).left === 0 && T.cuidado.tela.restamDe(0, 30, cob0) === '0 de 30' && T.home.telaJornada.dosesRestantes(0, cob0) === T.home.telaJornada.dosesRestantes(0, { n: 0, unidade: 'semana' })
  && !T.tratamento.telaAplicacoes.cobre(T.tratamento.estoqueUrgente, cob0).includes('cerca de 0'),
  'a caixa vazia não diz "cerca de 0" em lugar nenhum');
ok(dosesPorRecipiente(caixa(10, 28)) === 28, 'quem confirmou uma caixa de 28 abre a próxima com 28 marcado');
/* A caixa de 7 mg e o comprimido de 14 mg. */
const subiu14 = caixa(10);
(subiu14.profile as any).dose = 14;
for (const i of subiu14.injections as any[]) if (i.t >= diaHa(2, 0, 0)) i.dose = 14;
ok(!penStock(subiu14).registrada && penStock(subiu14).verdict.good && !estoqueNoFim(subiu14) && canetas(subiu14)[0].usadas === 7 && canetas(subiu14)[0].estado === 'fim',
  'subiu para 14 mg sem registrar a caixa nova: a caixa de 7 mg não conta os de 14, e o estoque pede o registro em vez de anunciar o fim');
/* Quem trocou a caneta semanal pelo comprimido: a última caneta aberta
   não gasta com o comprimido. */
const trocouComCaneta = comRecipiente(clone(trocou), 20, 'mounjaro', 5, 4);
ok(!penStock(trocouComCaneta).registrada && !estoqueNoFim(trocouComCaneta) && canetas(trocouComCaneta)[0].usadas === 3 && !temReceita(trocouComCaneta),
  'trocou o Mounjaro pelo Rybelsus: a caneta antiga conta só as 3 injeções, e nada de "a caneta acabou" para quem toma comprimido');

/* ---- a segunda leitura da B3 (02/10/2026, achados da revisão) ---- */

/* Do comprimido diário para a caneta semanal: as injeções de Ozempic não
   saem da caixa de Rybelsus. Antes, "Estoque em dia · 18 de 30 · cerca de
   18 semanas" e nenhum pedido para registrar a caneta. */
const paraSemanal = caixa(20);
paraSemanal.injections = (paraSemanal.injections as any[]).filter((i) => i.t < diaHa(7, 0, 0));
(paraSemanal.injections as any[]).push(
  { t: diaHa(7, 8, 0), med: 'ozempic', dose: 0.25, site: '', note: '' },
  { t: diaHa(0, 8, 0), med: 'ozempic', dose: 0.25, site: '', note: '' },
);
paraSemanal.profile.med = 'ozempic';
(paraSemanal.profile as any).dose = 0.25;
(paraSemanal.profile as any).forma = 'caneta';
ok(!doseDiaria(paraSemanal) && !penStock(paraSemanal).registrada && canetas(paraSemanal)[0].usadas === 12 && canetas(paraSemanal)[0].estado === 'fim'
  && faltaNaDose(paraSemanal, { dose: 0.25, usadasAntes: null }).includes('recipiente'),
  `trocou o Rybelsus pelo Ozempic: a caixa conta só os 12 comprimidos, o estoque pede a caneta, e a folha da dose pergunta por ela (${canetas(paraSemanal)[0].usadas} na caixa)`);
/* O mesmo da caneta de miligramas: o Wegovy não sai da caneta de Saxenda. */
const saxParaWegovy = comRecipiente(diario(12, ate(11).filter((k) => k >= 7), 3, 'saxenda'), 11, 'saxenda', 3, 6, { mg: 18 });
(saxParaWegovy.injections as any[]).push({ t: diaHa(0, 8, 0), med: 'wegovy', dose: 0.25, site: '', note: '' });
saxParaWegovy.profile.med = 'wegovy';
(saxParaWegovy.profile as any).dose = 0.25;
ok(!penStock(saxParaWegovy).registrada && canetas(saxParaWegovy)[0].usadas === 5,
  `a caneta de Saxenda não absorve o Wegovy: 5 doses de Saxenda, e o estoque pede a caneta nova (${canetas(saxParaWegovy)[0].usadas})`);
/* E a caneta semanal continua dona de toda dose depois dela. */
ok(penStock(semente).registrada
  && canetas(semente)[0].usadas === (semente.injections as any[]).filter((i) => i.t >= ((semente as any).pens as any[]).slice(-1)[0].t).length,
  'a caneta semanal da semente continua dona de toda dose depois da abertura dela, como sempre');

/* A caixa de antes, com o 4 de todo mundo: conta pelos 30 do catálogo. */
const caixaAntiga = caixa(10, 4, {});
ok(penStock(caixaAntiga).registrada && penStock(caixaAntiga).total === 30 && penStock(caixaAntiga).left === 20 && !estoqueNoFim(caixaAntiga)
  && dosesPorRecipiente(caixaAntiga) === 30,
  `a caixa registrada antes da revisão (dosesPerPen 4, sem os comprimidos confirmados) conta 20 de 30, e a próxima abre com 30 (${penStock(caixaAntiga).left} de ${penStock(caixaAntiga).total})`);
ok(penStock(caixa(2, 4)).total === 4, 'e a caixa de 4 que alguém confirmou é de 4');

/* A caixa que já estava em uso: dez comprimidos já tinham saído quando ela
   foi registrada, e dois foram tomados depois. */
const caixaEmUso = caixa(2, 30, { comprimidos: 30, usadasAntes: 10 });
ok(penStock(caixaEmUso).registrada && penStock(caixaEmUso).left === 18 && canetas(caixaEmUso)[0].jaEmUso && canetaAtual(caixaEmUso).vence === null,
  `a caixa registrada já em uso conta o que restava: 18 de 30, e não 28 (${penStock(caixaEmUso).left})`);

/* Os seis idiomas: o recipiente do comprimido é a caixa, e nenhum texto
   do estoque escreve "cerca de 0" nem um número quebrado. */
const CAIXA: Record<Local, string> = { 'pt-BR': 'caixa', 'en-US': 'box', 'es-419': 'caja', 'de-DE': 'Packung', 'fr-FR': 'boîte', 'it-IT': 'confezione' };
const falhasDeIdioma: string[] = [];
for (const l of Object.keys(CAIXA) as Local[]) {
  trocarLocal(l);
  if (FORMAS().comprimido.recipiente !== CAIXA[l]) falhasDeIdioma.push(`${l}: ${FORMAS().comprimido.recipiente}`);
  const zero = { n: 0, unidade: 'dia' as const };
  const tres = { n: 3, unidade: 'dia' as const };
  const z0 = T.tempo.duracao(zero);
  const comZero = [
    T.cuidado.pendencias.receitaSub(0, zero), T.cuidado.tela.restamDe(0, 30, zero), T.home.telaJornada.dosesRestantes(0, zero),
    T.tratamento.telaAplicacoes.cobre('x', zero), T.tratamento.telaCaneta.receitaDura(zero), T.tratamento.telaCaneta.renovarTexto(zero),
  ];
  if (comZero.some((s) => s.includes(z0))) falhasDeIdioma.push(`${l}: "${z0}" num texto de estoque vazio`);
  const comTres = [
    T.cuidado.pendencias.receitaSub(3, tres), T.cuidado.tela.restamDe(3, 30, tres), T.home.telaJornada.dosesRestantes(3, tres),
    T.tratamento.telaAplicacoes.cobre('x', tres), T.tratamento.telaCaneta.receitaDura(tres), T.tratamento.telaCaneta.renovarTexto(tres),
  ];
  if (!comTres.every((s) => s.includes(T.tempo.duracao(tres)) && !/\d[.,]\d/.test(s))) falhasDeIdioma.push(`${l}: três dias não escritos como "${T.tempo.duracao(tres)}"`);
}
trocarLocal(null);
ok(!falhasDeIdioma.length, `nos seis idiomas, a caixa é o recipiente e o estoque fala em dias sem "cerca de 0" ${falhasDeIdioma.length ? `(${falhasDeIdioma.join('; ')})` : ''}`);

/* ------------------------------------------------------------------ */
/* ⚠️ A PARTE B4 — O LEMBRETE (02/10/2026). O aviso da dose era UMA data —
   a próxima dose menos a antecedência —, e para quem toma todo dia isso
   dava "A sua dose é amanhã" às 9h do dia de tomar (o padrão é 1 dia
   antes), nunca tocava com 2 ou 3 dias, e sumia no primeiro dia sem
   registro. Agora o diário é como o check-in: todo dia, nas horas do
   alerta, dentro da cota — e quieto hoje depois da dose de hoje. O
   semanal, de novo, primeiro: a conta antiga está escrita aqui, e as duas
   têm de dar as mesmas datas.

   ⚠️ É ASSÍNCRONA porque roda o `reagendar` de logic/avisos de verdade, e
   lê no duble do expo-notifications (scripts/duble/expo.ts) o que ele
   marcaria no aparelho. O relógio parado espera a promessa acabar antes
   de devolver o `Date` — o de `comRelogio`, síncrono, o devolveria no
   primeiro `await`. */
async function comRelogioAsync<R>(fuso: string | null, [a, m, d, h]: [number, number, number, number], fn: () => Promise<R>): Promise<R> {
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
  try { return await fn(); } finally { (globalThis as any).Date = Real; process.env.TZ = antes; }
}

const alDose = (S: State) => (((S as any).alertas ?? []) as Alerta[]).find((a) => a.tipo === 'dose')!;
/* A conta de antes da B4, escrita aqui: a próxima dose menos a
   antecedência, nas horas do alerta, só as que ainda vêm. */
const contaAntiga = (S: State, a: Alerta) => {
  const agora = new Date();
  const base = addDays(startOfDay(nextInjectionDate(S)), -(a.lead ?? 0));
  return a.horas.map((h) => { const x = new Date(base); x.setHours(h, 0, 0, 0); return x; })
    .filter((x) => x > agora).sort((x, y) => +x - +y);
};
const datas = (ds: Date[]) => JSON.stringify(ds.map(Number));

async function oLembrete() {
  console.log('\n12. O LEMBRETE (B4): TODO DIA NA HORA, E QUIETO DEPOIS DA DOSE DE HOJE');

  /* O semanal: a semente e a mesma pessoa com uma dose ontem ao meio-dia
     (a próxima fica a seis dias, e todas as antecedências caem no futuro). */
  const semanalOntem = clone(semente);
  (semanalOntem.injections as any[]).push({ ...lastInjection(semente)!, t: diaHa(1, 12, 0) });
  const alS = alDose(semente);
  ok([0, 1, 2, 3].every((lead) => {
    const a = { ...alS, lead, horas: [8, 20] };
    return contaAntiga(semanalOntem, a).length === 2 && datas(proximasDe(semanalOntem, a, 56)) === datas(contaAntiga(semanalOntem, a));
  }), 'semanal: com 0 a 3 dias de antecedência e duas horas, as datas são as da conta antiga — e a cota não acrescenta nenhuma');
  ok(resumoDe(alS, semente) === T.alertas.quandoEHoras(rotuloDoLead(alS.lead ?? 0), hm(9, 0)) && antecedenciaDe(semente, { ...alS, lead: 2 }) === 2,
    `semanal: a linha da lista continua "${resumoDe(alS, semente)}", e a antecedência gravada vale`);
  ok(tiposDe(semente).dose.temLead && tiposDe(semente).dose.desc === T.alertas.doseDesc,
    'semanal: a folha continua perguntando a antecedência, com a descrição de sempre');
  /* A chave do semanal ganhou o que o aviso diz — remédio, dose e forma
     (02/10/2026, revisão da B4) —, e as datas que ela remarca são as de
     sempre (ver a afirmação logo acima). */
  ok(chaveDosAvisos(semente) === JSON.stringify([(semente as any).alertas, +nextInjectionDate(semente),
    semente.profile.med, semente.profile.dose, formaDe(semente)]),
    'semanal: a chave que o _layout observa para remarcar são os alertas, a próxima dose e o que o aviso diz');
  ok(textoDoAvisoDeDose({ dias: 1, med: 'Mounjaro', dose: 5, unidade: 'mg', forma: 'caneta' }).title === T.avisos.doseAmanha(FORMAS().caneta.acao)
    && lerNotificacao(semente, { t: 1, tipo: 'dose', dias: 1, med: 'Mounjaro', dose: 5, unidade: 'mg', forma: 'caneta' })?.titulo === T.avisos.doseAmanha(FORMAS().caneta.acao),
    'semanal: o aviso (e o guardado na lista de notificações) continua "A sua dose é amanhã"');
  const exS = (comNotificacoesDeExemplo(clone(semente)).notifications as any[]).filter((n) => n.tipo === 'dose');
  const ultS2 = dosesEmOrdem(semente).slice(-1)[0];
  ok(exS.length === 1 && exS[0].t === +startOfDay(new Date(ultS2.t)) - 864e5 + 9 * 36e5 && exS[0].dias === 1
    && JSON.stringify(Object.keys(exS[0])) === '["t","tipo","dias","med","dose","unidade","forma"]',
    'semanal: o aviso de exemplo da semente é o da véspera, às 9h, com os campos de sempre (sem `diaria`)');
  await reagendar(semanalOntem);
  ok(agendados.length === 1 && agendados[0].title === T.avisos.doseAmanha(FORMAS().caneta.acao) && +agendados[0].date === +contaAntiga(semanalOntem, alS)[0],
    `semanal: o agendador marca um aviso só, na véspera às 9h ("${agendados[0]?.title}")`);

  /* O diário, com o relógio parado numa quarta-feira às 8h: Rybelsus todo
     dia até ontem, a dose de hoje ainda por tomar. */
  await comRelogioAsync(null, [2026, 9, 14, 8], async () => {
    const D = diario(10, ate(10).filter((k) => k !== 0));
    const al = alDose(D);
    const nove = (k: number) => diaHa(-k, 9, 0);
    const seq = (n: number, de = 0) => JSON.stringify(Array.from({ length: n }, (_, i) => nove(de + i)));
    ok(al.on && al.lead === 1 && al.horas.join() === '9' && datas(proximasDe(D, al, 5)) === seq(5),
      'diário: o alerta com que todo diário nasce (9h, gravado "1 dia antes") toca hoje às 9h e em cada um dos quatro dias seguintes — no dia, sem antecedência');
    ok([0, 2, 3].every((lead) => datas(proximasDe(D, { ...al, lead }, 5)) === seq(5)) && antecedenciaDe(D, { ...al, lead: 3 }) === 0,
      'a antecedência gravada não é lida no diário (nem 2 ou 3 dias, que antes nunca tocavam)');
    ok(datas(proximasDe(D, { ...al, horas: [9, 21] }, 3)) === JSON.stringify([nove(0), diaHa(0, 21, 0), nove(1)]),
      'com duas horas, as duas tocam todo dia, na ordem');
    const fila = proximasDe(D, al, 56);
    ok(fila.length === 35 && new Set(fila.map((x) => +startOfDay(x))).size === 35 && fila.every((x) => x.getHours() === 9 && x.getMinutes() === 0),
      `a fila para no horizonte de cinco semanas: 35 dias, um aviso por dia, todos às 9h (${fila.length})`);

    /* O toque em "Tomei hoje" às 8h — o mesmo `gravarDose` da Home. */
    const tocou = clone(D);
    gravarDose(tocou, { t: +new Date(), med: 'rybelsus', dose: 7, site: '', note: '' });
    ok(doseDeHoje(tocou).feita && +nextInjectionDate(tocou) === diaHa(-1, 0, 0) && +nextInjectionDate(D) === +startOfDay(new Date())
      && chaveDosAvisos(tocou) !== chaveDosAvisos(D),
      'o toque das 8h leva a próxima dose de hoje para amanhã, e a chave que o _layout observa muda — os avisos são remarcados');
    ok(+proximasDe(tocou, al, 1)[0] === nove(1) && datas(proximasDe(tocou, al, 5)) === seq(5, 1) && proximasDe(tocou, al, 56).length === 34,
      'e o aviso das 9h de hoje sai da fila: o primeiro passa a ser amanhã às 9h');
    const sumiu = diario(10, ate(10).filter((k) => k >= 3));
    ok(contaAntiga(sumiu, al).length === 0 && +proximasDe(sumiu, al, 1)[0] === nove(0),
      'três dias sem registro: a conta antiga não tinha data nenhuma (o aviso sumia), e o de agora toca hoje às 9h');
    ok(proximasDe(diario(0, []), al, 3).length === 0,
      'antes da primeira dose registrada, nada — a mesma espera do semanal (`temCiclo`)');
    const saxD = diario(10, ate(10).filter((k) => k !== 0), 1.2, 'saxenda');
    ok(datas(proximasDe(saxD, alDose(saxD), 3)) === seq(3), 'a caneta diária (Saxenda) tem o mesmo aviso de todo dia');

    /* O que as telas leem. */
    ok(resumoDe(al, D) === T.alertas.quandoEHoras(T.alertas.todoDia, hm(9, 0)),
      `a linha de Lembretes: "${resumoDe(al, D)}", e não "${T.alertas.quandoEHoras(rotuloDoLead(1), hm(9, 0))}"`);
    ok(!tiposDe(D).dose.temLead && tiposDe(D).dose.desc === T.alertas.doseDescDiaria && tiposDe(D).dose.ic === 'pill'
      && tiposDe(D).checkin.temDias,
      'a folha esconde a antecedência, e a descrição diz que o aviso fica quieto depois da dose de hoje');

    /* O agendador de verdade. */
    const r = MEDS.rybelsus;
    await reagendar(D);
    ok(agendados.length === 35 && agendados[0].title === T.avisos.doseDiaria(false) && agendados[0].title !== T.avisos.doseAmanha(FORMAS().comprimido.acao)
      && agendados[0].body === T.avisos.doseDiariaCorpo(`${r.label} ${doseTxt(7)} ${r.unit}`) && +agendados[0].date === nove(0),
      `o agendador marca 35 avisos, o primeiro hoje às 9h: "${agendados[0]?.title}" — "${agendados[0]?.body}"`);
    await reagendar(tocou);
    ok(agendados.length === 34 && +agendados[0].date === nove(1), 'depois do toque, a fila remarcada começa amanhã');
    const varios = clone(D);
    (varios as any).alertas = [al, novoAlerta('checkin'), novoAlerta('peso'), novoAlerta('agua')];
    await reagendar(varios);
    const daDose = agendados.filter((x) => x.title === T.avisos.doseDiaria(false));
    ok(daDose.length === 14 && +daDose[0].date === nove(0) && +daDose[13].date === nove(13),
      `com quatro alertas ligados, a dose leva a parte dela do orçamento (56 ÷ 4 = 14 dias seguidos), e não a fila inteira (${daDose.length})`);
    await reagendar(saxD);
    ok(agendados[0]?.title === T.avisos.doseDiaria(true), `a caneta diária: "${agendados[0]?.title}"`);

    /* ⚠️ Duas remarcações ao mesmo tempo (revisão da B4, 02/10/2026): a
       volta ao foco e a chave que mudou à meia-noite chegavam juntas, e a
       fila saía com avisos em dobro. Agora a segunda espera, e uma que
       chega com outra já esperando só troca o estado. */
    await Promise.all([reagendar(D), reagendar(D)]);
    ok(agendados.length === 35 && new Set(agendados.map((x) => +x.date)).size === 35,
      `duas remarcações juntas deixam a fila uma vez só: 35 avisos, nenhum em dobro (${agendados.length})`);
    const primeira = reagendar(D);
    const ultima = reagendar(tocou);
    await Promise.all([primeira, ultima]);
    ok(agendados.length === 34 && +agendados[0].date === nove(1),
      'e quem chega por último manda: a remarcação que esperava usa o estado mais novo (a dose de hoje feita, fila começando amanhã)');

    /* A caixa nova de 14 mg à noite, com a dose de hoje já feita: a
       próxima dose não muda, e o texto dos avisos já marcados mudaria. */
    const caixa14 = clone(tocou);
    caixa14.profile.dose = 14;
    ok(chaveDosAvisos(caixa14) !== chaveDosAvisos(tocou) && +nextInjectionDate(caixa14) === +nextInjectionDate(tocou),
      'trocar a dose remarca os avisos, mesmo sem mexer na data da próxima — "Rybelsus 7 mg" não fica nos 34 já marcados');

    /* A lista de notificações. */
    ok(lerNotificacao(D, { t: 1, tipo: 'dose', dias: 0, med: 'Rybelsus', dose: 7, unidade: 'mg', forma: 'comprimido', diaria: true })?.titulo === T.avisos.doseDiaria(false),
      'o aviso do dia guardado na lista de notificações se lê como chegou');
    const exD = (S: State) => (comNotificacoesDeExemplo(clone(S)).notifications as any[]).filter((n) => n.tipo === 'dose');
    const ontemAs10 = clone(D);
    const ontem = (ontemAs10.injections as any[]).find((i) => i.t === diaHa(1));
    ontem.t = diaHa(1, 10, 0);
    const ex10 = exD(ontemAs10);
    ok(exD(D).length === 0 && ex10.length === 1 && ex10[0].t === diaHa(1, 9, 0) && ex10[0].dias === 0 && ex10[0].diaria === true,
      'o aviso de exemplo: a dose das 7h12 calou o das 9h (nenhum na lista); a das 10h deixou o das 9h tocar');

    /* Os seis idiomas: o aviso do dia, com o verbo da forma. */
    const falhasB4: string[] = [];
    for (const l of Object.keys(CAIXA) as Local[]) {
      trocarLocal(l);
      const comp = textoDoAvisoDeDose({ dias: 0, med: 'Rybelsus', dose: 7, unidade: 'mg', forma: 'comprimido', diaria: true });
      const can = textoDoAvisoDeDose({ dias: 0, med: 'Saxenda', dose: 1.2, unidade: 'mg', forma: 'caneta', diaria: true });
      const semanalHoje = textoDoAvisoDeDose({ dias: 0, med: 'Rybelsus', dose: 7, unidade: 'mg', forma: 'comprimido' });
      if (comp.title !== T.avisos.doseDiaria(false) || can.title !== T.avisos.doseDiaria(true)) falhasB4.push(`${l}: título`);
      if (comp.title === semanalHoje.title || comp.title === T.avisos.doseAmanha(FORMAS().comprimido.acao)) falhasB4.push(`${l}: o diário com a frase do semanal`);
      if (l !== 'en-US' && comp.title === can.title) falhasB4.push(`${l}: o verbo não segue a forma`);
      if (!comp.body.includes(`Rybelsus ${doseTxt(7)} mg`) || !can.body.includes(`Saxenda ${doseTxt(1.2)} mg`)) falhasB4.push(`${l}: corpo sem a dose`);
      if (!T.alertas.doseDescDiaria || T.alertas.doseDescDiaria === T.alertas.doseDesc) falhasB4.push(`${l}: descrição`);
      if (!T.tratamento.telaAplicacoes.avisoDiario || T.tratamento.telaAplicacoes.avisoDiario === T.tratamento.telaAplicacoes.avisoAntes) falhasB4.push(`${l}: convite de /aplicacoes`);
      if (resumoDe(al, D) !== T.alertas.quandoEHoras(T.alertas.todoDia, hm(9, 0))) falhasB4.push(`${l}: linha de Lembretes`);
    }
    trocarLocal(null);
    ok(!falhasB4.length, `nos seis idiomas, o aviso do dia tem o verbo da forma, traz a dose e não fala de "amanhã" ${falhasB4.length ? `(${falhasB4.join('; ')})` : ''}`);
  });

  /* Berlim, sábado 24/10 às 10h, com a dose de hoje feita: o relógio volta
     uma hora na madrugada de domingo, e a fila não pode repetir o domingo
     nem perder um dia. */
  comRelogio('Europe/Berlin', [2026, 9, 24, 10], () => {
    const B = diario(6, ate(6));
    const f = proximasDe(B, alDose(B), 4).map((x) => `${x.getDate()}/${x.getMonth() + 1} ${x.getHours()}h`).join(', ');
    ok(f === '25/10 9h, 26/10 9h, 27/10 9h, 28/10 9h', `em Berlim, atravessando a volta do relógio: ${f}`);
  });
}

/* ------------------------------------------------------------------ */
/* ⚠️ A PARTE B5 — O RELATÓRIO E A IA (02/10/2026). O papel do médico dizia
   "Doses: 40 de 92 previstas" a quem registra o comprimido de um toque por
   dia, e listava uma linha por comprimido — noventa "7 mg" desde a última
   consulta. A IA lia a adesão em porcentagem, "Próxima dose prevista:
   amanhã" e a constância de dose a dose com três dias de folga; e o prompt
   mandava responder "quanto vou perder?" com "a referência mais próxima
   que os documentos trazem", que para quem toma Rybelsus é o STEP 1 da
   injeção. O semanal, de novo, primeiro.

   ⚠️ COM O RELÓGIO PARADO na sexta, 02/10/2026, às 10h: a dose de hoje das
   7h12 já foi, e a semana que a leitura lê é a de 21 a 27/09. */
const secaoDoses = (html: string) => {
  const i = html.indexOf(`<h2>${esc(T.resumo.relatorio.aplicacoes)}</h2>`);
  return i < 0 ? '' : html.slice(i, html.indexOf('</section>', i));
};
/* as linhas do corpo da tabela das doses (a do cabeçalho fica de fora) */
const linhasDaTabela = (secao: string) => Math.max(0, (secao.match(/<tr>/g) ?? []).length - 1);
const diaIso = (t: number) => {
  const d = new Date(t);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
/* A conta de constância de antes da B5, escrita aqui: o semanal tem de
   dar exatamente o mesmo. */
const constanciaAntiga = (S: State, ate: number) => {
  const apl = (((S as any).injections ?? []) as any[]).filter((i) => i.t < ate).sort((a, b) => b.t - a.t);
  const folga = (cadenciaDias(S) + 2) * 864e5;
  let seguidas = apl.length ? 1 : 0;
  for (let i = 1; i < apl.length && apl[i - 1].t - apl[i].t <= folga; i++) seguidas++;
  return seguidas >= 4 && apl.length && ate - apl[0].t <= folga
    ? [{ tipo: 'aplicacoesSemFalha', chave: `constancia:aplicacoes:${Math.floor(seguidas / 4)}`, dados: { aplicacoesSeguidas: seguidas, cadenciaDias: cadenciaDias(S) } }]
    : [];
};

function oRelatorioEaIa() {
  console.log('\n13. O RELATÓRIO E A IA (B5): DIAS COM DOSE, O PDF EM TRECHOS E AS REGRAS DO SERVIDOR');
  comRelogio(null, [2026, 9, 2, 10], () => {
    const R = T.resumo.relatorio;
    const Q = T.resumo;
    const medicacao = (S: State) => resumoDoTratamento(S).find((s) => s.id === 'medicacao')!.linhas;
    const tudo = (S: State) => ({ desde: S.profile.startT, inclui: { ...INCLUI_PADRAO } });

    /* ---- o semanal, como era ---- */
    const sem = ensureDefaults(buildSeed()) as State;
    ok(medicacao(sem).some((l) => l.k === Q.aplicacoes && l.v === Q.aplicacoesValor(dosesFeitas(sem), dosesPrevistas(sem)))
      && !medicacao(sem).some((l) => l.k === Q.diasComDose),
      `semanal: o resumo do médico continua "${Q.aplicacoes}: ${Q.aplicacoesValor(dosesFeitas(sem), dosesPrevistas(sem))}"`);
    /* vinte canetas semanais: mais de 14, e a lista continua */
    const vinte = diario(140, Array.from({ length: 20 }, (_, i) => i * 7), 5, 'mounjaro');
    const htmlVinte = htmlDoRelatorio(vinte, tudo(vinte));
    ok(!dosesEmResumo(vinte, 20) && linhasDaTabela(secaoDoses(htmlVinte)) === 20 && !htmlVinte.includes(esc(R.resumoPorDose(20)))
      && htmlVinte.includes(esc(R.aplicacoesNoPeriodo)) && !htmlVinte.includes(esc(R.diasComDoseNoPeriodo)),
      `semanal com 20 doses no período: a lista de sempre, uma linha por dose (${linhasDaTabela(secaoDoses(htmlVinte))}), e o cartão "${R.aplicacoesNoPeriodo}"`);
    ok(R.dosesSub(20, true, dosesEmResumo(vinte, 20)) === R.dosesSub(20, true, false),
      `semanal: a linha do ajuste do PDF continua "${R.dosesSub(20, true, false)}"`);
    const expSem = dadosParaExportar(sem, { desde: 0, inclui: { aplicacoes: true } } as any);
    ok(!('constancia_diaria' in expSem.tratamento), 'semanal: o .json não ganha a constância diária (o congelar.ts confere o arquivo inteiro)');
    const jSem = resumoDaJornada(sem);
    ok(jSem.includes('Frequência: semanal') && jSem.includes('Próxima dose prevista:') && jSem.includes('(adesão ')
      && !jSem.includes('Dias com dose') && !jSem.includes('Dose de hoje'),
      'semanal: o resumo da conversa continua com a adesão e a próxima dose, sem as linhas do diário');
    const sSem = resumoDaSemana(sem);
    ok(!sSem.includes('Frequência') && (sSem.includes('Doses na semana:') || sSem.includes('Nenhuma dose registrada na semana')) && !sSem.includes('Dias com dose'),
      'semanal: o resumo da semana continua com a lista das doses, sem a linha da frequência');
    const { ate: fimDaSemana } = semanaLida(new Date());
    const consSem = constancia({ S: sem, dias: [], de: 0, ate: fimDaSemana }).filter((c) => /^constancia:(dias|aplicacoes):/.test(c.chave));
    ok(JSON.stringify(consSem.map(({ tipo, chave, dados }) => ({ tipo, chave, dados }))) === JSON.stringify(constanciaAntiga(sem, fimDaSemana)),
      `semanal: a constância de dose a dose dá o mesmo que a conta antiga (${consSem.length ? consSem[0].chave : 'nenhuma'})`);

    /* ---- o diário: o resumo do médico em dias ---- */
    const D = diario(27, ate(27).filter((k) => k !== 3 && k !== 10));
    const D0 = diario(27, ate(27).filter((k) => k !== 0 && k !== 3 && k !== 10));
    ok(medicacao(D).some((l) => l.k === Q.diasComDose && l.v === Q.diasComDoseValor(26, 28)) && !medicacao(D).some((l) => l.k === Q.aplicacoes),
      `diário: "${Q.diasComDose}: ${Q.diasComDoseValor(26, 28)}" — 28 dias do regime, dois sem registro, e nenhum "previstas"`);
    ok(medicacao(D0).some((l) => l.k === Q.diasComDose && l.v === Q.diasComDoseValor(25, 27)),
      'diário: antes da dose de hoje, hoje não conta ("25 de 27", e não "25 de 28")');
    ok(resumoEmTexto(D).includes(`- ${Q.diasComDose}: ${Q.diasComDoseValor(26, 28)}`) && !resumoEmTexto(D).includes(Q.aplicacoesValor(26, 28)),
      'diário: o texto que se envia diz o mesmo que a tela');
    const trocouB5 = diario(20, [2, 1, 0]);
    (trocouB5.injections as any[]).unshift(...[20, 13, 6].map((k) => umaDose(k, 'mounjaro', 5, { site: 'abd-e' })));
    const semPilula = clone(trocouB5);
    (semPilula as any).injections = (semPilula.injections as any[]).filter((i) => i.med === 'mounjaro');
    ok(!medicacao(semPilula).some((l) => l.k === Q.diasComDose) && medicacao(semPilula).some((l) => l.v === Q.aplicacoesRegistradas(3)),
      'diário sem comprimido registrado (trocou da caneta): a linha de antes, "3 registradas", sem dias a contar');

    /* ---- o PDF: o resumo por dose ---- */
    const htmlD = htmlDoRelatorio(D, tudo(D));
    const dosesD = secaoDoses(htmlD);
    ok(dosesEmResumo(D, 26) && dosesD.includes(esc(R.resumoPorDose(26))) && dosesD.includes(esc(R.periodoDaDose))
      && linhasDaTabela(dosesD) === 1 && dosesD.includes(`>${esc(Q.diasComDoseValor(26, 28))}<`) && dosesD.includes('>26<'),
      `diário, 26 registros: uma linha por trecho de dose (${linhasDaTabela(dosesD)}), com "${Q.diasComDoseValor(26, 28)}" dias com dose, e não 26 linhas`);
    ok(htmlD.includes(esc(R.diasComDoseNoPeriodo)) && htmlD.includes(`>${esc(Q.diasComDoseValor(26, 28))}</div>`) && !htmlD.includes(esc(R.aplicacoesNoPeriodo)),
      `diário: o cartão do período conta dias ("${R.diasComDoseNoPeriodo}: ${Q.diasComDoseValor(26, 28)}")`);
    ok(R.dosesSub(26, false, dosesEmResumo(D, 26)) !== R.dosesSub(26, false, false),
      `diário: a linha do ajuste do PDF avisa que vem resumido ("${R.dosesSub(26, false, true)}")`);
    const curto = htmlDoRelatorio(D, { desde: diaHa(9, 0, 0), inclui: { ...INCLUI_PADRAO } });
    ok(!dosesEmResumo(D, 9) && linhasDaTabela(secaoDoses(curto)) === 9 && !curto.includes(esc(R.resumoPorDose(9)))
      && curto.includes(`>${esc(Q.diasComDoseValor(9, 10))}</div>`),
      `diário, período curto (9 registros): a lista, uma linha por dose (${linhasDaTabela(secaoDoses(curto))}), e o cartão "${Q.diasComDoseValor(9, 10)}"`);

    /* A subida de 3 para 7 mg, com quatro dias sem registro entre as duas e
       uma dose dobrada no dia 5. */
    const tit = diario(27, []);
    (tit as any).injections = [
      ...Array.from({ length: 10 }, (_, i) => umaDose(27 - i, 'rybelsus', 3)),
      ...Array.from({ length: 14 }, (_, i) => umaDose(13 - i, 'rybelsus', 7)),
    ];
    (tit.injections as any[]).splice((tit.injections as any[]).findIndex((i) => i.t === diaHa(5)) + 1, 0, umaDose(5, 'rybelsus', 7, { t: diaHa(5, 20, 0) }));
    const tr = trechosDeDose(tit, diaHa(27, 0, 0));
    const trTxt = JSON.stringify(tr.map((t) => [t.dose, diaIso(t.de), diaIso(t.ate), t.doses, t.feitos, t.dias]));
    ok(trTxt === JSON.stringify([[3, diaIso(diaHa(27)), diaIso(diaHa(14)), 10, 10, 14], [7, diaIso(diaHa(13)), diaIso(diaHa(0)), 15, 14, 14]]),
      `a subida: o trecho de 3 mg vai até a véspera do de 7 mg — os quatro dias sem registro contam contra ele —, e a dose dobrada aparece como 15 registros em 14 dias (${trTxt})`);
    const noPer = diasComDoseDesde(tit, diaHa(27, 0, 0));
    ok(tr.reduce((s, t) => s + t.dias, 0) === noPer.dias && tr.reduce((s, t) => s + t.feitos, 0) === noPer.feitos && noPer.dias === 28,
      `os trechos somam o cartão do período (${noPer.feitos} de ${noPer.dias})`);
    const tr20 = trechosDeDose(tit, diaHa(20, 0, 0));
    ok(tr20.length === 2 && tr20[0].de === diaHa(20, 0, 0) && tr20[0].doses === 3 && tr20[0].feitos === 3 && tr20[0].dias === 7,
      'o trecho que começou antes do período entra recortado: do começo do período, 3 de 7 dias');
    const dosesTit = secaoDoses(htmlDoRelatorio(tit, tudo(tit)));
    ok(linhasDaTabela(dosesTit) === 2 && dosesTit.indexOf(`${doseTxt(7)} mg`) < dosesTit.indexOf(`${doseTxt(3)} mg`),
      'no papel, dois trechos, o mais novo em cima');

    /* A troca no mesmo dia (14 mg às 7h, de volta a 7 mg às 9h): nenhuma
       dose some do papel. */
    const mesmoDia = diario(27, ate(27).filter((k) => k !== 0));
    (mesmoDia.injections as any[]).push(umaDose(0, 'rybelsus', 14, { t: diaHa(0, 7, 0) }), umaDose(0, 'rybelsus', 7, { t: diaHa(0, 9, 0) }));
    const trMd = trechosDeDose(mesmoDia, diaHa(27, 0, 0));
    /* O dia dividido fica com o trecho de antes (revisão da B5): o de 14
       mg conta o dia (1 de 1), e a dose das 9h vai numa linha própria, sem
       dia a contar — nenhuma dose some do papel. */
    ok(trMd.reduce((s, t) => s + t.doses, 0) === 29 && trMd.some((t) => t.dose === 14 && t.doses === 1 && t.feitos === 1 && t.dias === 1)
      && trMd.filter((t) => t.dose === 7).slice(-1)[0]?.doses === 1 && trMd.filter((t) => t.dose === 7).slice(-1)[0]?.dias === 0,
      'a troca no mesmo dia: o dia fica com o trecho de antes, e a dose seguinte entra numa linha própria, sem dia a contar (29 de 29 no papel)');

    /* A manhã da subida: "Tomei hoje" grava os 7 mg do perfil às 7h10, e a
       pessoa acrescenta os 14 mg de verdade às 7h15. O papel não pode dizer
       que houve uma dose dobrada de 7 mg no trecho de antes. */
    const subida = diario(40, ate(40).filter((k) => k !== 0));
    (subida.injections as any[]).push(umaDose(0, 'rybelsus', 7, { t: diaHa(0, 7, 10) }), umaDose(0, 'rybelsus', 14, { t: diaHa(0, 7, 15) }));
    const trSub = trechosDeDose(subida, diaHa(40, 0, 0));
    const sete = trSub.find((t) => t.dose === 7)!, quatorze = trSub.find((t) => t.dose === 14)!;
    ok(sete.doses === 41 && sete.feitos === 41 && sete.dias === 41 && sete.ate === diaHa(0, 0, 0) && quatorze.doses === 1 && quatorze.dias === 0,
      `a manhã da subida: 7 mg com 41 registros em 41 de 41 dias, até hoje, e 14 mg numa linha de hoje — e não 41 registros em 40 dias (${sete.doses} em ${sete.feitos} de ${sete.dias})`);

    /* Quem trocou a caneta semanal pelo comprimido no período. */
    const troca = diario(30, ate(15));
    (troca.injections as any[]).unshift(...[30, 23, 16].map((k) => umaDose(k, 'mounjaro', 5, { site: 'abd-e' })));
    const trTroca = trechosDeDose(troca, diaHa(30, 0, 0));
    const dosesTroca = secaoDoses(htmlDoRelatorio(troca, { desde: diaHa(30, 0, 0), inclui: { ...INCLUI_PADRAO } }));
    ok(trTroca.length === 2 && trTroca[0].med === 'mounjaro' && trTroca[0].doses === 3 && trTroca[0].dias === 0
      && trTroca[1].dias === 16 && trTroca[1].feitos === 16 && dosesTroca.includes(esc(R.medicamento)) && dosesTroca.includes('>—<'),
      'quem trocou de caneta para comprimido: a caneta é um trecho com as doses dela e sem dias a contar (traço), e a coluna Medicamento aparece');
    ok(trechosDeDose(troca, diaHa(10, 0, 0)).length === 1, 'a caneta que acabou antes do período não entra como linha vazia');

    /* ---- o .json ---- */
    const exD = (S: State, aplicacoes = true) => dadosParaExportar(S, { desde: 0, inclui: { aplicacoes } } as any).tratamento.constancia_diaria;
    ok(JSON.stringify(exD(D)) === JSON.stringify({ desde: diaIso(diaHa(27)), ate: diaIso(diaHa(0)), dias_contados: 28, dias_com_dose_registrada: 26 }),
      `o .json leva a constância em dias, com as datas do calendário de quem exporta (${JSON.stringify(exD(D))})`);
    ok(exD(D0).ate === diaIso(diaHa(1)) && exD(D0).dias_contados === 27 && exD(D, false) === undefined
      && JSON.stringify(exD(semPilula)) === JSON.stringify({ desde: null, ate: null, dias_contados: 0, dias_com_dose_registrada: 0 }),
      'antes da dose de hoje a contagem para ontem; sem as doses no arquivo, sem a conta; sem comprimido registrado, zero e datas nulas');

    /* ---- o que a conversa lê ---- */
    const jD = resumoDaJornada(D);
    const linhasEsperadas = [
      'Frequência: diária',
      `Dias com dose registrada desde o começo do uso diário (${diaIso(diaHa(27))}): 26 de 28`,
      'Dias com dose nas últimas 2 semanas: 12 de 14',
      'Dose de hoje: registrada às 07:12',
    ];
    ok(linhasEsperadas.every((l) => jD.includes(l)) && !jD.includes('adesão') && !jD.includes('Próxima dose prevista'),
      `a conversa lê a constância em dias e a dose de hoje, sem adesão em porcentagem nem "próxima dose" (${linhasEsperadas.filter((l) => !jD.includes(l)).join(' | ') || 'as quatro linhas'})`);
    const jD0 = resumoDaJornada(D0);
    ok(jD0.includes('Dose de hoje: ainda não registrada') && jD0.includes('Dias com dose nas últimas 2 semanas: 11 de 13'),
      'antes da dose de hoje: "ainda não registrada", e hoje fora da conta das duas semanas');
    const sax = diario(10, ate(10), 1.2, 'saxenda');
    ok(resumoDaJornada(sax).includes('Via: injetável (caneta)') && resumoDaJornada(sax).includes('Frequência: diária'),
      'a caneta diária: a via injetável e a frequência diária (a regra do comprimido não vale para ela)');

    /* ---- o que a leitura de segunda lê ---- */
    const sD = resumoDaSemana(D);
    ok(sD.includes('Frequência: diária') && sD.includes('Dias com dose registrada na semana: 6 de 7')
      && sD.includes('Dias com dose registrada desde o começo do uso diário: 26 de 28')
      && !sD.includes('Doses na semana:') && !sD.includes('Adesão desde o início'),
      'a semana de 21 a 27/09 em dias ("6 de 7", o 22 sem registro), e não sete datas e uma porcentagem');
    const subiu = clone(D);
    for (const i of subiu.injections as any[]) if (i.t < diaHa(8, 0, 0)) i.dose = 3;
    (subiu.profile as any).dose = 7;
    ok(resumoDaSemana(subiu).includes('A dose mudou na semana: Rybelsus 3 mg desde 2026-09-21; Rybelsus 7 mg desde 2026-09-24'),
      `a dose que mudou no meio da semana vai dita (${resumoDaSemana(subiu).split('\n').find((l) => l.startsWith('A dose mudou')) ?? 'sem a linha'})`);

    /* ---- a constância da leitura, em dias ---- */
    const todos = diario(40, ate(40));
    const consD = constancia({ S: todos, dias: [], de: 0, ate: fimDaSemana }).filter((c) => /^constancia:(dias|aplicacoes):/.test(c.chave));
    ok(consD.length === 1 && consD[0].tipo === 'diasSeguidosComDose' && consD[0].dados.diasSeguidosComDose === 36 && consD[0].chave === 'constancia:dias:1',
      `diário: dias seguidos com dose até o domingo da semana lida (${JSON.stringify(consD.map((c) => c.dados))}), com a chave de quatro em quatro semanas`);
    const doisFuros = diario(40, ate(40).filter((k) => k !== 7 && k !== 8));
    ok(!constancia({ S: doisFuros, dias: [], de: 0, ate: fimDaSemana }).some((c) => /^constancia:(dias|aplicacoes):/.test(c.chave))
      && constanciaAntiga(doisFuros, fimDaSemana).length === 1,
      'dois comprimidos esquecidos seguidos quebram a sequência (a conta antiga, com três dias de folga, dava "sem falha")');

    /* ---- as regras do servidor leem as linhas que o resumo escreve ---- */
    ok(viaDoTratamento(D) === 'Via: oral (comprimido)' && frequenciaDoTratamento(D) === 'Frequência: diária'
      && INSTRUCOES.includes('"Via: oral (comprimido)"') && INSTRUCOES.includes('"Frequência: diária"')
      && REGRAS_DA_LEITURA.includes('"Via: oral (comprimido)"') && REGRAS_DA_LEITURA.includes('"Frequência: diária"'),
      'as regras da conversa e da leitura citam exatamente as linhas "Via" e "Frequência" que o resumo escreve');
    ok(/COMPRIMIDO NÃO SE PROJETA COM ESTUDO DE INJEÇÃO[^\n]*STEP, SURMOUNT/.test(INSTRUCOES) && /REMÉDIO DE TODO DIA NÃO TEM CICLO SEMANAL/.test(INSTRUCOES)
      && /DOSE DE TODO DIA NÃO TEM CICLO SEMANAL/.test(REGRAS_DA_LEITURA) && REGRAS_DA_LEITURA.includes('diasSeguidosComDose:'),
      'a conversa não projeta o comprimido com estudo de injeção nem fala de ciclo no diário; a leitura também, e o glossário explica o campo novo');
    ok(!/\$\{|undefined|NaN/.test(INSTRUCOES) && TELAS['/aplicacoes'] === 'as doses registradas e a próxima dose',
      'o bloco fixo da conversa continua sem nada que varie (o cache acerta), e a tela das doses tem o nome de agora');

    /* ---- os seis idiomas ---- */
    const falhasB5: string[] = [];
    for (const l of Object.keys(CAIXA) as Local[]) {
      trocarLocal(l);
      const RR = T.resumo.relatorio;
      const QQ = T.resumo;
      if (!QQ.diasComDose || QQ.diasComDose === QQ.aplicacoes) falhasB5.push(`${l}: rótulo`);
      if (!/26\D+28/.test(QQ.diasComDoseValor(26, 28))) falhasB5.push(`${l}: valor`);
      if (RR.dosesSub(26, false, true) === RR.dosesSub(26, false, false) || RR.dosesSub(26, true, true) !== RR.dosesSub(26, false, true)) falhasB5.push(`${l}: linha do ajuste`);
      if (!RR.resumoPorDose(26).includes('26') || !RR.periodoDaDose || !RR.registros || !RR.diasComDose || !RR.diasComDoseNoPeriodo) falhasB5.push(`${l}: colunas`);
      const h = htmlDoRelatorio(D, tudo(D));
      if (!h.includes(esc(RR.resumoPorDose(26))) || !h.includes(esc(RR.diasComDoseNoPeriodo)) || !h.includes(esc(QQ.diasComDose))) falhasB5.push(`${l}: o papel`);
      if (/undefined|NaN/.test(secaoDoses(h))) falhasB5.push(`${l}: buraco no papel`);
    }
    trocarLocal(null);
    ok(!falhasB5.length, `nos seis idiomas, o papel do diário diz dias com dose, resume por dose e a linha do ajuste avisa ${falhasB5.length ? `(${falhasB5.join('; ')})` : ''}`);
  });
}

oLembrete().then(() => {
  oRelatorioEaIa();
  console.log(falhas ? `\n${falhas} afirmação(ões) falharam\n` : '\ntodas as afirmações passaram\n');
  process.exit(falhas ? 1 : 0);
}, (e) => {
  console.error(e);
  process.exit(1);
});
