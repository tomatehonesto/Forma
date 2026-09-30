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
        não é check-in; quem toma comprimido registra a primeira dose; o
        aviso e o app de saúde são opcionais, e o cartão se conclui sem
        eles;
     4. esconder, reabrir e concluir, e concluído vence escondido; o
        diário de exemplo não tem cartão;
     5. "Sua evolução" pede duas pesagens em dias diferentes, e os dois
        cartões de baixo são os que têm evolução, na ordem de relevância;
     6. nenhuma frase afirma o que não aconteceu (Peça 3 da especificação):
        sem aplicação registrada não há ciclo, próxima dose, fase, adesão
        nem aviso de dose; sem pesagens bastantes não há ritmo nem
        "estável"; sem recipiente registrado não há estoque; sem check-in
        respondido não há leitura do equilíbrio;
     7. quem já tinha começado responde no cadastro a última aplicação, e
        ela vira a primeira do diário — sem local, e sem o local vazio
        contar para o rodízio nem sobrar como " · " numa linha;
     8. o cartão de quem cuida não sai sem nome: a pessoa, a clínica, ou
        cartão nenhum;
     9. o "+ Registrar" de cada meta do dia abre a folha dela;
    10. quem respondeu "ainda não decidi" ganha o item da medicação, e
        ele fica com o visto depois de escolhida;
    11. o destaque de boas-vindas vale na primeira semana do diário, até
        a apresentação ser vista;
    12. a primeira semana fala dia a dia, contada do registro da dose; o
        resumo da semana vem nos dois dias depois da dose nova; e o que
        veio com o cadastro não é marco na Home.
   ============================================================ */

import { buildSeed, estadoVazio, type State } from '../src/logic/seed';
import {
  passos, passosNaHome, passosParaReabrir, esconderPassos, reabrirPassos, concluirPassos, essencialPronto,
  lembrarMedicacao,
  type DoAparelho,
} from '../src/logic/primeirosPassos';
import {
  temEvolucao, temCiclo, journeySummary, journeyChanges, careState, doseContext, penStock,
  balanceRead, recommendations, radar, libraryPicks, companionSuggestions,
  cicloFases, injCalendar, protocoloDaSemana,
  aplicacaoDoCadastro, diaDoTratamento, nextInjectionDate, rodizioDeLocais, timelineEvents,
  semanasDaGrade, timelineWeeks, comecouAntesDoApp, nomeDeQuemCuida, dailyTargets, indicadoresDaEvolucao,
  diasDeRefeicao, diasDeAgua, diasDoPeriodo, temHistoria, ritmoRecente, last7Days, examCats, REFERENCIA_DOS_MARCADORES,
  nomeDoMarcador,
} from '../src/logic/derive';
import { semanaDoTratamento } from '../src/logic/time';
import { boasVindasNaHome, marcarApresentacaoVista } from '../src/logic/apresentacao';
import { semanaQuePassou, marcoRecente } from '../src/logic/destaques';
import { descobertas } from '../src/logic/descobertas';
import { redeLancada, temRedeParceira } from '../src/logic/pais';
import { unidadesDe, unidadePadrao, converterValor, converterFaixa, faixaTxt } from '../src/logic/unidadesDeExame';
import { htmlDoRelatorio, recortePadrao } from '../src/logic/relatorioPdf';
import { dataDeTabela } from '../src/logic/pdf';
import { localDePartida } from '../src/logic/local';
import { ensureDefaults } from '../src/logic/seed';
import { energiaDoDia, registrarRefeicao, aguaDoDia } from '../src/logic/derive';
import { gramasItem, nomeItem, nutrientesDe, comRotulo, origemDe, ressalvaItem, type ItemComida } from '../src/logic/prato';
import { limparRotulo, itemEstimado, seusPratos, buscarNosSeus } from '../src/logic/estimativa';
import { PRATELEIRAS } from '../src/logic/prateleiras';
import { PRATELEIRAS as PRATELEIRAS_DO_SERVIDOR } from '../servidor/prateleiras';
import { rotuloDaPorcao } from '../servidor/rotulo';
import { limpar as limparDaFoto } from '../src/logic/analise';
import { abrirPorta } from '../servidor/cota';
import { motivoDaPorta } from '../src/logic/portaDaIa';
import { resumoDaJornada, TETO_DO_RESUMO } from '../src/logic/resumoDaJornada';
import {
  aceitouAConversa, registrarAceiteDaConversa, limparResposta, TELAS_DA_CONVERSA,
  guardarNaConversa, conversaGuardada, TETO_DA_CONVERSA, perguntarAoMorphi,
} from '../src/logic/conversa';
import { TELAS } from '../servidor/conversa/prompt';
import { BASE } from '../servidor/conversa/base';
import { lerPedido, mensagensDe, TETOS } from '../servidor/api/conversa';
// @ts-ignore — o gerador é .mjs, sem tipos
import { montarBase } from '../servidor/conversa/gerar-base.mjs';
import { DESTINO_NO_ESTADO, DESTINO_NO_PERFIL } from '../src/logic/traducao';
import { ALIMENTOS, dicionario, buscarAlimento } from '../src/logic/alimentos';
import { COMIDAS, UNIDADES } from '../src/logic/comidas';
import { trocarLocal } from '../src/logic/local';
import { contemDe, cabe } from '../src/logic/restricoes';
import { alimentoDe } from '../src/logic/prato';
import ALIMENTOS_DO_SERVIDOR from '../servidor/alimentos.json';
import { limparLaudo, gravarLaudo } from '../src/logic/laudo';
import { MARCADORES as MARCADORES_DO_SERVIDOR } from '../servidor/marcadores';
import { proximasDe, type Alerta } from '../src/logic/alertas';
import { resumoEmTexto, resumoDoTratamento } from '../src/logic/resumo';
import { conquistas } from '../src/logic/conquistas';
import { mensagemDoDia } from '../src/logic/etapa';
import { companionMemoria } from '../src/logic/derive';
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
ok(nIphone.length === 6, `no iPhone são seis itens (${nIphone.map((p) => p.id).join(', ')})`);
ok(JSON.stringify(prontos(novo, IPHONE)) === '["plano"]', 'só o plano começa pronto: o cartão abre com um visto, e não do zero');
ok(nIphone.every((p) => p.id === 'plano' ? !p.to : !!p.to), 'todo item por fazer leva a uma tela, e o plano a nenhuma');
ok(nIphone.find((p) => p.id === 'saude')!.titulo.includes('Apple Saúde'), 'o item da saúde diz o nome do aparelho');

console.log('\n2. O NAVEGADOR');
const nWeb = passos(novo, NAVEGADOR);
ok(nWeb.length === 4 && !nWeb.some((p) => p.id === 'lembretes' || p.id === 'saude'),
  'sem aviso nem depósito de saúde, sobram o plano, a aplicação, o check-in e a meta');

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
ok(JSON.stringify(nIphone.filter((p) => p.opcional).map((p) => p.id)) === '["lembretes","saude"]',
  'o aviso e o app de saúde são os opcionais');
const essencial = clone(novo);
(essencial.injections as any[]).push({ t: +hoje, dose: 2.5 });
(essencial.checkins as any[]).push({ t: +hoje, energia: 3 });
const semMeta = clone(essencial);
(essencial.goals as any[]).push({ id: 'g1', ic: 'roupa', label: 'Vestir o vestido azul', indicador: null });
ok(!essencialPronto(passos(semMeta, IPHONE)), 'sem uma meta além do peso, o essencial ainda não está pronto — ela segura o cartão');
ok(!essencialPronto(nIphone) && essencialPronto(passos(essencial, IPHONE)) && !passos(essencial, IPHONE).every((p) => p.pronto),
  'com a aplicação, o check-in e uma meta, o essencial está pronto — sem aviso nem app de saúde, o cartão não fica pendente para sempre');

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

/* Os dois de baixo do peso: os que mais fazem sentido, entre os que têm
   evolução — nenhum "sem medida". */
const ids = (x: State) => indicadoresDaEvolucao(x).map((i) => i.id).join(',');
ok(ids(doisDias) === '', 'só com o peso, a seção fica só com o peso — nenhum cartão de "sem medida"');
const umaFita = clone(doisDias);
(umaFita.measures as any[]).push({ t: +hoje, cintura: 98 });
ok(ids(umaFita) === '', 'uma medida da cintura ainda não é evolução');
const duasFitas = clone(umaFita);
(duasFitas.measures as any[]).unshift({ t: +hoje - 20 * DIA, cintura: 104 });
const cin = indicadoresDaEvolucao(duasFitas)[0];
ok(ids(duasFitas) === 'cintura' && cin.nota === '−6,0 cm' && cin.tom === 'bom' && cin.sobe === false,
  `duas medidas em dias diferentes: a cintura entra, com a variação (${cin?.nota})`);
const comProteina = clone(doisDias);
(comProteina.checkins as any[]).push({ t: +hoje, prot: 80 }, { t: +hoje - DIA, prot: 70 });
ok(ids(comProteina) === 'proteina', 'quem não mede o corpo vê a proteína, com dois dias registrados na semana');
ok(ids(buildSeed() as State) === 'cintura,massaMagra', 'no diário de exemplo, cintura e massa magra — e nunca mais de dois');

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

ok(doseContext(zero).proxima === T.cuidado.dose.primeiraARegistrar && doseContext(aplicou5).proxima !== T.cuidado.dose.primeiraARegistrar,
  'sem aplicação registrada, a próxima não é "hoje" — é a primeira, a registrar');
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

console.log('\n7. QUEM JÁ TINHA COMEÇADO');
/* O cadastro pergunta a data da última aplicação a quem já está em
   tratamento, e a resposta vira a primeira aplicação do diário. */
const ha3 = +hoje - 3 * DIA;
const doCadastro = aplicacaoDoCadastro('mounjaro', 2.5, ha3);
ok(doCadastro.t === ha3 + 12 * 3600e3 && doCadastro.site === '' && doCadastro.dose === 2.5,
  'a aplicação do cadastro entra ao meio-dia do dia respondido, sem local');
const jaComecou = clone(zero);
jaComecou.profile.startT = +hoje - 40 * DIA;
(jaComecou.injections as any[]).push(doCadastro);
ok(temCiclo(jaComecou) && !diaDoTratamento(jaComecou).antes,
  'quem já tinha começado tem ciclo desde o primeiro dia — nada de "Antes da primeira dose"');
ok(+nextInjectionDate(jaComecou) === ha3 + 7 * DIA, 'a próxima dose conta da última aplicação respondida');
ok(alertaDaDose ? proximasDe(jaComecou, { ...alertaDaDose, on: true }, 3).length > 0 : false,
  'e o aviso da dose passa a ter data');
ok(rodizioDeLocais(jaComecou).every((l: any) => l.ultima == null),
  'a aplicação sem local não conta para local nenhum do rodízio');
ok((conquistas(jaComecou).find((q) => q.id === 'rodizio')?.nivel ?? 0) === 0,
  'nem vira "um local usado" nas conquistas');
const evento = timelineEvents(jaComecou).find((e) => e.kind === 'aplicacao');
ok(!!evento && !evento.sub.endsWith('·') && !evento.sub.includes(' ·  ') && !evento.sub.endsWith(' '),
  'na linha do tempo, a aplicação sem local não deixa um " · " pendurado');
ok(doCadastro.origem === 'cadastro', 'a aplicação do cadastro leva a origem — é a última dose, e não a primeira');
ok(mensagemDoDia(jaComecou).chapeu !== T.etapa.primeiraChapeu(6) && mensagemDoDia(aplicou5).chapeu === T.etapa.primeiraChapeu(6),
  '"primeira semana" só para quem começou no app — e não para quem estava no dia 40');
const memoria = [0, 1, 2, 3].map((n) => {
  const x = clone(jaComecou);
  (x.checkins as any[]).push(...Array.from({ length: n }, (_, k) => ({ t: +hoje - k * DIA, energia: 5 })));
  return companionMemoria(x);
});
ok(memoria.every((f) => f === T.companion.memoria.desdeOComeco),
  'o Morphi diz "desde o começo", sem contar da dose do cadastro');
ok((conquistas(jaComecou).find((q) => q.id === 'tempo')?.nivel ?? 0) >= 1,
  'o tempo de tratamento conta do início que a pessoa contou (40 dias: um mês)');
const grade = semanasDaGrade(jaComecou);
ok(grade.vividas === 1 && grade.aplicadas === 1,
  `as semanas de antes do app não viram semanas sem dose: "1 de 1", e não "1 de 6" (${grade.aplicadas} de ${grade.vividas})`);
/* Quem começou antes do app: pela aplicação do cadastro, ou — nos diários
   de antes dela — por um início anterior ao dia do cadastro. */
const antigo = (inicioHa: number) => {
  const x = clone(zero);
  (x.profile as any).consentimento = { em: +hoje + 10 * 3600e3, versao: 1 };
  x.profile.startT = +hoje - inicioHa * DIA;
  return x;
};
ok(comecouAntesDoApp(jaComecou) && comecouAntesDoApp(antigo(40)) && !comecouAntesDoApp(antigo(0)) && !comecouAntesDoApp(aplicou5),
  'quem começou antes do app se reconhece sem campo novo no perfil — e quem ia começar, não');
const semanaDaDose = semanaDoTratamento(doCadastro.t, jaComecou.profile.startT);
ok(timelineWeeks(jaComecou)[0]?.semana === semanaDaDose && timelineWeeks(aplicou5)[0]?.semana === 1,
  `a linha do tempo de quem já tinha começado abre na semana do tratamento (${semanaDaDose}), e a de quem começou no app, na 1`);

console.log('\n8. QUEM CUIDA TEM NOME');
const soClinica = clone(novo);
soClinica.profile.doctor = '';
soClinica.profile.clinic = 'Clínica Tavares';
const comPessoa = clone(soClinica);
comPessoa.profile.doctor = 'Júlia Tavares';
const ninguem = clone(soClinica);
ninguem.profile.clinic = '';
ok(nomeDeQuemCuida(comPessoa) === 'Júlia Tavares' && nomeDeQuemCuida(soClinica) === 'Clínica Tavares' && nomeDeQuemCuida(ninguem) === '',
  'a pessoa, quando há; a clínica, quando o código não trouxe pessoa; e nada — e nenhum cartão — quando não há nenhum dos dois');

console.log('\n9. CADA META ABRE O PRÓPRIO REGISTRO');
const metasDoDia = Object.fromEntries(dailyTargets(novo).map((m) => [m.key, m.registrarEm]));
ok(JSON.stringify(metasDoDia) === JSON.stringify({ prot: '/medir-refeicao', agua: '/medir-agua', exerc: '/medir-exercicio' }),
  'o "+ Registrar" de cada meta abre a folha dela — a proteína pela refeição —, e não a lista de todos');

console.log('\n10. QUEM AINDA NÃO DECIDIU A MEDICAÇÃO');
const semMed = clone(novo);
(semMed.profile as any).med = 'indefinido';
const aberta = passos(semMed, IPHONE);
ok(aberta[1]?.id === 'medicacao' && !aberta[1].pronto && !aberta[1].opcional && aberta[1].to === '/cadastro?editar=medicamento',
  'o item "defina a medicação" entra logo depois do plano, por fazer, segura o cartão e leva ao passo do medicamento');
ok(!passos(novo, IPHONE).some((p) => p.id === 'medicacao'), 'quem escolheu a medicação no cadastro não ganha o item');
const decidiu = clone(semMed);
lembrarMedicacao(decidiu);
(decidiu.profile as any).med = 'mounjaro';
const feita = passos(decidiu, IPHONE).find((p) => p.id === 'medicacao');
ok(!!feita && feita.pronto, 'depois de escolhida, a medicação continua na lista, com o visto — a marca lembra que ela esteve em aberto');

console.log('\n11. AS BOAS-VINDAS DA PRIMEIRA SEMANA');
const chegou = clone(novo);
(chegou.profile as any).consentimento = { em: Date.now() - 2 * DIA, versao: 2 };
ok(boasVindasNaHome(chegou), 'quem chegou há dois dias vê o destaque de boas-vindas');
const viu = clone(chegou);
marcarApresentacaoVista(viu);
ok(!boasVindasNaHome(viu), 'depois de ver a apresentação, o destaque sai de cena');
const semana = clone(chegou);
(semana.profile as any).consentimento.em = Date.now() - 8 * DIA;
ok(!boasVindasNaHome(semana), 'com mais de uma semana de diário, também');
ok(!boasVindasNaHome(novo), 'sem a hora do aceite, não dá para saber se o diário é novo — e não há boas-vindas');
const vitrine = clone(chegou);
(vitrine as any).semente = true;
ok(!boasVindasNaHome(vitrine), 'o diário de exemplo não é recebido');

console.log('\n12. OS DESTAQUES NOVOS DA HOME');
const comDose = (dias: number) => {
  const x = clone(zero);
  (x.injections as any[]).push({ t: +hoje - dias * DIA + 12 * 3600e3, med: 'mounjaro', dose: 2.5, site: 'abd-e', note: '' });
  return x;
};
ok(mensagemDoDia(comDose(0)).chapeu === T.etapa.primeiraChapeu(1) && mensagemDoDia(comDose(0)).head === T.etapa.primeiraDias[0].head,
  'no dia em que a primeira dose é registrada, é o dia 1 da primeira semana');
ok(mensagemDoDia(comDose(3)).chapeu === T.etapa.primeiraChapeu(4) && mensagemDoDia(comDose(3)).head === T.etapa.primeiraDias[3].head,
  'três dias depois do registro, o dia 4 — cada dia com o seu recado');
ok(mensagemDoDia(comDose(6)).chapeu === T.etapa.primeiraChapeu(7) && !String(mensagemDoDia(comDose(7)).chapeu).includes(T.etapa.primeiraChapeu(8).split('·')[0].trim()),
  'o dia 7 é o último; no oitavo, a primeira semana acabou');
const semanaNova = clone(semente);
const ultimaDose = (semanaNova.injections as any[])[(semanaNova.injections as any[]).length - 1];
(semanaNova.injections as any[]).push({ ...ultimaDose, t: +hoje + 9 * 3600e3 });
const resumo = semanaQuePassou(semanaNova);
ok(!!resumo && resumo.semana > 0 && !!(resumo.deltaPeso || resumo.resumo),
  `no dia da dose nova, o resumo da semana que ela fechou (semana ${resumo?.semana})`);
const semanaVelha = clone(semanaNova);
(semanaVelha.injections as any[])[(semanaVelha.injections as any[]).length - 1].t = +hoje - 3 * DIA;
ok(semanaQuePassou(semanaVelha) === null, 'três dias depois da dose, o resumo já saiu de cena');
ok(semanaQuePassou(zero) === null, 'sem dose, não há semana para resumir');
const recemCadastrado = clone(novo);
(recemCadastrado.profile as any).consentimento = { em: Date.now(), versao: 2 };
(recemCadastrado.weights as any[]).push({ t: +hoje, kg: 90 });
ok(marcoRecente(recemCadastrado) === null, 'o que veio com o cadastro — a primeira pesagem — não é marco na Home');

console.log('\n13. O INSIGHTS DE QUEM ACABOU DE CHEGAR');
const P = T.rotina.perguntas;
const sz = companionSuggestions(zero);
ok(sz.includes(P.primeiraDose) && ![P.depoisDaAplicacao, P.maisFome, P.semFome].some((q) => sz.includes(q)),
  'sem aplicação, a pergunta é sobre a primeira dose, e não sobre uma fase do ciclo');
ok(!sz.includes(P.meuProgresso) && !sz.includes(P.prepararConsulta),
  'sem duas pesagens nem consulta perto, o Morphi não oferece progresso nem preparo');
const enjoou = clone(zero);
(enjoou.checkins as any[]).push({ t: +hoje - DIA, nausea: 4 });
ok(companionSuggestions(enjoou).includes(P.porQueEnjoo), 'registrou enjoo, aparece "Por que o tratamento dá enjoo?"');
ok(companionSuggestions(semente).includes(P.meuProgresso), 'com pesagens em dias diferentes, o progresso volta às sugestões');
ok(companionSuggestions(semente).length <= 4 && sz.length <= 4, 'no máximo quatro sugestões');
ok(balanceRead(zero).vazia && !balanceRead(respondeu6).vazia, 'sem check-in respondido, "O que observamos" não tem o que dizer');
ok(companionMemoria(zero) === companionMemoria(semente), 'a memória é uma frase só, verdade no primeiro dia e no centésimo');

console.log('\n14. AS TELAS INTERNAS DE QUEM ACABOU DE CHEGAR');
const chegouHoje = clone(zero);
chegouHoje.profile.startT = +hoje + 9 * 3600e3;
ok(diasDeRefeicao(chegouHoje, 29).length === 1 && diasDeAgua(chegouHoje, 29).length === 1 && diasDoPeriodo(chegouHoje, 30).length === 1,
  'as tiras de refeições, água e exercício começam no dia do começo, e não um mês antes');
ok(diasDeRefeicao(semente, 29).length === 29 && diasDeAgua(semente, 29).length === 29 && diasDoPeriodo(semente, 30).length === 30,
  'com mais de um mês de diário, a tira tem o tamanho de sempre');
const resumo0 = resumoDoTratamento(chegouHoje);
const linhasDe = (id: string) => resumo0.find((s) => s.id === id)?.linhas ?? [];
ok(linhasDe('peso').some((l) => l.k === T.resumo.pesoAtual) && !linhasDe('peso').some((l) => l.k === T.resumo.inicioAtual),
  'com uma pesagem, o resumo diz o peso atual, e não "75,1 kg → 75,1"');
ok(linhasDe('sintomas').length === 0, 'sem resposta, os sintomas do resumo não viram quatro traços');
ok(resumoDoTratamento(semente).find((s) => s.id === 'sintomas')!.linhas.length === 4,
  'com respostas, as quatro médias voltam');
const hojeCadastrou = clone(chegouHoje);
(hojeCadastrou.profile as any).consentimento = { em: +hoje + 9 * 3600e3, versao: 2 };
(hojeCadastrou.checkins as any[]).push({ t: +hoje, energia: 6 });
const semanaDepois = clone(hojeCadastrou);
(semanaDepois.profile as any).consentimento.em = +hoje - 8 * DIA;
const semanaVazia = clone(zero);
(semanaVazia.profile as any).consentimento = { em: +hoje - 8 * DIA, versao: 2 };
ok(!temHistoria(hojeCadastrou) && temHistoria(semanaDepois),
  '"Seu tratamento" espera sete dias de aplicativo, mesmo com check-in no primeiro');
ok(!temHistoria(semanaVazia), 'e, passados os sete, ainda pede um registro além do cadastro');
ok(temHistoria(semente), 'com semanas de dose fechadas, a história aparece');

console.log('\n15. O RITMO É O DE PERDA, CONTRA O ESCOLHIDO');
const comRitmo = (escolhido: number | null) => {
  const x = clone(semente);
  (x.profile as any).ritmo = escolhido;
  return journeySummary(x);
};
const real = journeySummary(semente).ritmo;
ok(comRitmo(real).verdict.label === T.tratamento.ritmoNoPlano, 'perdendo no ritmo escolhido, a etiqueta diz "No seu ritmo"');
ok(comRitmo(real * 2).verdict.label === T.tratamento.ritmoMaisDevagar && comRitmo(real * 2).verdict.good,
  'bem abaixo do escolhido, "Mais devagar que o plano" — sem virar alerta');
ok(comRitmo(real / 2).verdict.label === T.tratamento.ritmoMaisRapido, 'bem acima, "Mais rápido que o plano"');
ok(comRitmo(null).verdict.label.includes(T.tratamento.ritmoPorSemana('').trim()),
  'sem ritmo escolhido, a etiqueta é só o número por semana');
const rapido = clone(semente);
(rapido.weights as any[]).push({ t: +hoje + 3600e3, kg: 40 });
ok(journeySummary(rapido).verdict.tom === 'atencao', 'acima de 1,5 kg por semana, o limite clínico chama a conversa');
ok(ritmoRecente(semente) != null && ritmoRecente(zero) == null, 'o trecho recente só com pesagens a duas semanas uma da outra');
const sete = last7Days(semanaDepois).filter((d) => !d.antes).length;
const um = last7Days(hojeCadastrou).filter((d) => !d.antes).length;
ok(um === 1 && sete === 7, 'os sete dias da Jornada não contam os de antes do cadastro');
ok(last7Days(semente).every((d) => !d.antes), 'sem hora de aceite, os sete contam');
const emLibra = clone(semente);
(emLibra.profile as any).sistema = 'imperial';
const rKg = journeySummary(semente), rLb = journeySummary(emLibra);
ok(rLb.lostLabel !== rKg.lostLabel && rLb.faltamLabel !== rKg.faltamLabel,
  `em libra, o destaque e o "faltam" da Jornada saem em libra (${rLb.lostLabel} / ${rLb.faltamLabel})`);

console.log('\n16. A HOME DO PRIMEIRO DIA');
const temConviteDeMedidas = (x: State) => descobertas(x).some((d) => d.id === 'conv:medidas');
ok(!temConviteDeMedidas(hojeCadastrou) && temConviteDeMedidas(semanaDepois),
  'o convite das medidas espera a primeira semana no aplicativo');

console.log('\n17. A CHAVE DA REDE (EXPO_PUBLIC_REDE)');
/* Sem a variável é o estado da build de loja até a virada; com
   EXPO_PUBLIC_REDE=1 na frente do comando, o de depois dela. */
const conviteDaClinica = descobertas(semanaDepois).some((d) => d.id === 'conv:clinica');
if (!redeLancada()) {
  ok(!temRedeParceira('BR'), 'sem a variável, não há rede, nem no Brasil');
  ok(!conviteDaClinica, 'e o carrossel não convida a digitar o código de uma clínica que não existe');
} else {
  ok(temRedeParceira('BR') && !temRedeParceira('US'), 'com a variável, a rede volta — e só no Brasil');
  ok(conviteDaClinica, 'e o convite da clínica volta ao carrossel');
}

console.log('\n18. O EXAME ANOTADO');
const semReferencia = examCats().flatMap(([, ms]) => ms).filter((m) => {
  const r = REFERENCIA_DOS_MARCADORES[m];
  return !r || !r.unit || !r.ref;
});
ok(!semReferencia.length,
  `todo marcador que a folha oferece nasce com unidade e faixa usual${semReferencia.length ? ` (faltam: ${semReferencia.join(', ')})` : ''}`);
const refDiferente = examCats().flatMap(([, ms]) => ms).filter((m) => unidadesDe(m)[0]?.id !== REFERENCIA_DOS_MARCADORES[m]?.unit);
ok(!refDiferente.length, `a primeira unidade de cada marcador é a da tabela de referência${refDiferente.length ? ` (${refDiferente.join(', ')})` : ''}`);
const idaEVolta = examCats().flatMap(([, ms]) => ms).every((m) => unidadesDe(m).every((u) =>
  Math.abs(converterValor(m, converterValor(m, 100, unidadesDe(m)[0].id, u.id), u.id, unidadesDe(m)[0].id) - 100) < 1e-9));
ok(idaEVolta, 'toda conversão volta ao número de onde saiu');
ok(unidadePadrao('Glicemia jejum', 'BR') === 'mg/dL' && unidadePadrao('Glicemia jejum', 'GB') === 'mmol/L'
  && unidadePadrao('Glicemia jejum', 'FR') === 'g/L' && unidadePadrao('HbA1c', 'GB') === 'mmol/mol' && unidadePadrao('HbA1c', 'FR') === '%',
  'a unidade que vem marcada segue o que o laudo de cada país costuma dizer');
ok(Math.abs(converterValor('Glicemia jejum', 99, 'mg/dL', 'mmol/L') - 5.495) < 0.01 && Math.abs(converterValor('HbA1c', 5.7, '%', 'mmol/mol') - 38.8) < 0.1,
  'os fatores batem com as tabelas de conversão (99 mg/dL = 5,5 mmol/L; 5,7% = 39 mmol/mol)');
ok(converterFaixa('Glicemia jejum', '70–99', 'mg/dL', 'mmol/L') === '3.9–5.5' && converterFaixa('HbA1c', '< 5,7', '%', 'mmol/mol') === '< 39',
  'a faixa usual é convertida para a unidade do laudo');
ok(faixaTxt('3.9–5.5') === '3,9–5,5' && faixaTxt('< 5,7') === '< 5,7', 'e escrita com o decimal de quem lê');

console.log('\n19. O PDF DO MÉDICO, NO RECORTE PADRÃO');
const comNota = clone(semente);
(comNota.notes as any[]).push({ t: +hoje, text: 'Dor <forte> & tontura', done: false });
const padrao = recortePadrao(comNota);
const html = htmlDoRelatorio(comNota, padrao);
ok(html.startsWith('<!DOCTYPE html>') && html.includes(T.resumo.relatorio.titulo) && html.includes(`<h1>${semente.profile.name}</h1>`),
  'o documento abre com o nome de quem ele é como manchete');
ok(padrao.desde === (comNota as any).consultsHistory[0].t && !padrao.inclui.habitos && padrao.inclui.exames,
  'com um toque, o PDF vem desde a última consulta, com o que é clínico e sem os hábitos');
ok(html.includes(`<h2>${T.resumo.medicacao}</h2>`), 'a medicação, que só o resumo tinha, entrou no PDF único');
ok(html.includes(nomeDoMarcador('Glicemia jejum')) && html.includes(T.resumo.pdf.referencia),
  'a tabela de exames tem os marcadores pelo nome e a coluna de referência');
ok(html.includes('Dor &lt;forte&gt; &amp; tontura') && !html.includes('<forte>'),
  'o que a pessoa escreveu entra escapado — um "<" numa anotação não quebra o documento');
ok(resumoDoTratamento(semente).find((s) => s.id === 'exames')!.linhas.every((l) => !l.k.includes('Glicemia jejum') || nomeDoMarcador('Glicemia jejum') === 'Glicemia jejum'),
  'o resumo em texto usa o nome do marcador no idioma de quem lê');

console.log('\n20. A LEITURA DO LAUDO');
const lido = limparLaudo({
  ok: true, coleta: '2026-09-20',
  resultados: [
    { marcador: 'HbA1c', nome_no_laudo: 'Hemoglobina glicada', valor: 5.4, unidade: '%', referencia: '< 5,7' },
    { marcador: 'HbA1c', nome_no_laudo: 'HbA1c anterior', valor: 6.1, unidade: '%', referencia: null },
    { marcador: 'LDL', nome_no_laudo: 'LDL', valor: 112, unidade: 'mg/dl', referencia: 'Desejável: < 130' },
    { marcador: 'Inventado', nome_no_laudo: 'Sódio', valor: 140, unidade: 'mEq/L', referencia: null },
    { marcador: 'TSH', nome_no_laudo: 'TSH', valor: -1, unidade: 'mUI/L', referencia: null },
  ],
});
ok(!!lido && lido.resultados.length === 2 && lido.resultados[0].valor === 5.4,
  'o mesmo marcador duas vezes entra uma — o primeiro, que é o desta coleta; e valor negativo não entra');
ok(!!lido && lido.resultados[1].unidade === null && lido.resultados[1].referencia === null,
  'unidade fora da lista fica para a pessoa escolher, e faixa com texto em volta não vira faixa');
ok(!!lido && lido.naoReconhecidos.includes('Sódio'), 'o que não acompanhamos é mostrado como lido, e não gravado');
ok(limparLaudo({ ok: true, coleta: '2999-01-01', resultados: [{ marcador: 'HbA1c', valor: 5, unidade: '%' }] })!.coleta === null,
  'coleta no futuro é leitura errada: fica sem data');
const comLaudo = clone(semente);
const ldlAntes = (comLaudo.exams as any[]).find((e) => e.marker === 'LDL').values.length;
const g1 = gravarLaudo(comLaudo, [{ marcador: 'LDL', valor: 2.9, unidade: 'mmol/L', referencia: '< 3,4' }], +hoje);
const ldl = (comLaudo.exams as any[]).find((e) => e.marker === 'LDL');
ok(g1 === 1 && ldl.unit === 'mg/dL' && Math.abs(ldl.values[ldl.values.length - 1].v - 2.9 * 38.67) < 0.5,
  'o laudo em mmol/L entra no LDL que já estava em mg/dL, convertido — a linha do tempo não mistura escalas');
ok(gravarLaudo(comLaudo, [{ marcador: 'LDL', valor: 2.9, unidade: 'mmol/L', referencia: null }], +hoje) === 0
  && ldl.values.length === ldlAntes + 1, 'a mesma coleta lida duas vezes não entra duas vezes');
const semExames = clone(zero);
gravarLaudo(semExames, [{ marcador: 'Vitamina D', valor: 75, unidade: 'nmol/L', referencia: '75–250' }], null);
const vd = (semExames.exams as any[])[0];
ok(vd.unit === 'nmol/L' && vd.ref === '75–250' && vd.good === 'up',
  'o marcador novo nasce na unidade e com a faixa do laudo, e com a direção da tabela');
const doApp = Object.fromEntries(examCats().flatMap(([, ms]) => ms).map((m) => [m, unidadesDe(m).map((u) => u.id)]));
const doServidor = Object.fromEntries(Object.entries(MARCADORES_DO_SERVIDOR).map(([m, v]) => [m, [...v.unidades]]));
ok(JSON.stringify(doApp) === JSON.stringify(doServidor),
  'a lista de marcadores e unidades do servidor é a mesma do aplicativo');

console.log('\n21. O RELATÓRIO DE EXPORTAR');
const RR = T.resumo.relatorio;
const tudo = { aplicacoes: true, peso: true, sintomas: true, exames: true, notas: true, habitos: true };
const relTudo = htmlDoRelatorio(semente, { desde: semente.profile.startT, inclui: tudo });
ok(relTudo.startsWith('<!DOCTYPE html>') && [RR.visaoGeral, RR.peso, RR.aplicacoes, RR.sintomas, RR.exames, RR.habitos, RR.notas]
  .every((t) => relTudo.includes(`<h2>${t}</h2>`)) && relTudo.includes('<svg'),
  'com tudo incluído, o relatório tem as seções, e a curva do peso');
const relSem = htmlDoRelatorio(semente, { desde: semente.profile.startT, inclui: { ...tudo, habitos: false, exames: false } });
ok(!relSem.includes(`<h2>${RR.habitos}</h2>`) && !relSem.includes(`<h2>${RR.exames}</h2>`),
  'o que a pessoa tirou não entra no papel');
const primeiraPesagem = Math.min(...(semente.weights as any[]).map((w) => w.t));
const relRecente = htmlDoRelatorio(semente, { desde: +hoje - 14 * DIA, inclui: tudo });
ok(!relRecente.includes(dataDeTabela(primeiraPesagem)) && relTudo.includes(dataDeTabela(primeiraPesagem)),
  'o período escolhido corta as tabelas: a primeira pesagem só aparece no tratamento inteiro');

console.log('\n22. O IDIOMA DE QUEM ESTÁ FORA DOS SEIS');
ok(localDePartida('nl') === 'en-US' && localDePartida('ar') === 'en-US' && localDePartida('ja') === 'en-US',
  'o aparelho num idioma que não temos abre em inglês, e não no português do build');
ok(localDePartida('pt') === 'pt-BR' && localDePartida('es') === 'es-419' && localDePartida('de') === 'de-DE',
  'o aparelho num idioma que temos abre nele');
ok(localDePartida('') === 'pt-BR' && localDePartida(null) === 'pt-BR',
  'o aparelho que não disse idioma nenhum fica com o padrão do build');

console.log('\n23. O RÓTULO GRAVADO EM CADA ITEM DE REFEIÇÃO');
const semRotulo = clone(semente);
const comR = ensureDefaults(clone(semente)) as State;
const itensDaSemente = (comR.meals as any[]).flatMap((m) => (m.itens || []) as ItemComida[]).filter((it) => it.id);
ok(itensDaSemente.length > 0 && itensDaSemente.every((it) => it.rotulo && typeof it.rotulo.p === 'number'),
  'a migração grava o rótulo em todo item de tabela do diário');
const diasDaSemente = [...new Set((comR.meals as any[]).map((m) => +new Date(new Date(m.t).setHours(0, 0, 0, 0))))];
ok(diasDaSemente.every((d) => JSON.stringify(energiaDoDia(comR, d)) === JSON.stringify(energiaDoDia(semRotulo, d))
  && aguaDoDia(comR, d) === aguaDoDia(semRotulo, d)),
  'com o rótulo, a energia e a água de cada dia são as mesmas de antes');
const umItem = itensDaSemente[0];
const orfao: ItemComida = { ...umItem, id: 'alimento-que-saiu-da-tabela' };
ok(gramasItem(orfao) === gramasItem(umItem) && nomeItem(orfao) === nomeItem(umItem)
  && nutrientesDe([orfao]).kcal === nutrientesDe([umItem]).kcal,
  'o alimento que sair da tabela continua com o nome e os números do dia em que foi registrado');
const mudado = { ...umItem, rotulo: { ...umItem.rotulo!, p: umItem.rotulo!.p * 2 } };
ok(gramasItem(mudado) !== gramasItem(umItem), 'o número do registro é o do rótulo gravado, e não o da tabela de hoje');
ok(comRotulo(mudado) === mudado, 'quem já tem rótulo não é regravado');
const registrou = clone(novo);
registrarRefeicao(registrou, { name: 'Almoço', tag: '', itens: [{ id: umItem.id, qtd: 2 }] });
ok(!!(registrou.meals as any[])[0].itens[0].rotulo, 'a refeição nova já nasce com o rótulo');

console.log('\n24. O PRATO ESTIMADO PELO NOME');
ok(JSON.stringify(PRATELEIRAS) === JSON.stringify(PRATELEIRAS_DO_SERVIDOR),
  'as prateleiras do servidor são as mesmas do aplicativo');
ok(ALIMENTOS().every((a) => (PRATELEIRAS as readonly string[]).includes(a.onde)),
  'toda prateleira da lista de comidas está na lista de prateleiras');
const carbonara = rotuloDaPorcao({
  nome: 'Carbonara', unidade: 'prato', unidades: 'pratos', gramas: 350,
  proteina: 24.5, kcal: 630, carboidrato: 70, gordura: 28, fibra: 3.5, prateleira: 'Pratos prontos',
});
const limpo = limparRotulo(carbonara);
ok(!!limpo && limpo.p === 7 && limpo.kcal === 180 && limpo.gUn === 350,
  'o servidor converte a porção para 100 g, e o aplicativo aceita o que ele devolve');
ok(rotuloDaPorcao({ ...(carbonara as any), gramas: 2, unidade: 'x', unidades: 'x', proteina: 1, carboidrato: 1, gordura: 1, fibra: 0, prateleira: 'Pratos prontos' }) === null,
  'uma porção de 2 g é erro, e não entra');
ok(limparRotulo({ ...carbonara, kcal: undefined }) === null && limparRotulo({ ...carbonara, onde: 'Sapatos' }) === null,
  'um rótulo com campo faltando, ou com prateleira inventada, não entra');
const itemC = itemEstimado(limpo!, 2);
ok(origemDe(itemC) === 'estimado' && ressalvaItem(itemC) === T.alimentacao.prato.estimadoPeloNome,
  'o item estimado diz que é estimado, e por onde');
ok(gramasItem(itemC) === 49 && nutrientesDe([itemC]).kcal === 1260 && nutrientesDe([itemC]).fora === 0,
  'duas porções contam a proteína e entram na energia do dia');
ok(nomeItem(itemC) === 'Carbonara', 'o nome é o do prato estimado');
const comPrato = clone(novo);
registrarRefeicao(comPrato, { name: 'Almoço', tag: '', itens: [itemC] });
registrarRefeicao(comPrato, { name: 'Jantar', tag: '', itens: [itemEstimado({ ...limpo!, p: 9 })] });
ok(seusPratos(comPrato).length === 1 && seusPratos(comPrato)[0].p === 9,
  'os pratos seus vêm do diário, um de cada nome, o mais recente primeiro');
ok(buscarNosSeus(comPrato, 'carbo').length === 1 && buscarNosSeus(comPrato, 'lasanha').length === 0,
  'a busca acha o prato já estimado pelo começo da palavra');

console.log('\n25. UMA LISTA DE COMIDAS PARA TODO PAÍS');
ok(COMIDAS.every((c) => c.n.length === 6 && c.n.every(Boolean) && UNIDADES[c.un]?.length === 6),
  'toda comida tem nome e medida nos seis idiomas');
ok(dicionario().length > 200 && dicionario().every((a) => !a.prato) && ALIMENTOS().length > dicionario().length,
  'o dicionário é só comida de prateleira, e o registro tem também os pratos');
ok(!ALIMENTOS().some((a) => (a as any).marca || a.onde === 'Lanches de rede'), 'o fast food saiu da lista');
/* Os ids que o aplicativo escreve à mão: a semente, as bebidas, a água do prato. */
const idsDoCodigo = [
  ...(buildSeed().meals as any[]).flatMap((m) => (m.itens || []).map((it: any) => it.id)).filter(Boolean),
  'leite', 'suco-laranja', 'whey', 'sopa-legumes', 'sopa-feijao', 'sopa-carne', 'canja', 'achocolatado', 'vitamina-banana', 'smoothie-proteico', 'mingau-aveia',
];
ok(idsDoCodigo.every((id) => !!alimentoDe(id)), 'todo id que o aplicativo usa existe na lista nova');
ok(JSON.stringify((ALIMENTOS_DO_SERVIDOR as { id: string }[]).map((a) => a.id)) === JSON.stringify(COMIDAS.filter((c) => !c.oculto).map((c) => c.id)),
  'a lista que a leitura da foto usa é a mesma do aplicativo, sem o que saiu das listas');
trocarLocal('de-DE');
const frangoDe = alimentoDe('peito-frango')!;
ok(frangoDe.nome === 'Hähnchenbrust' && frangoDe.un === 'Filet', 'em alemão, o nome e a medida vêm em alemão');
ok(buscarAlimento('Hähnchenbrust')[0]?.id === 'peito-frango' && buscarAlimento('chicken breast').some((a) => a.id === 'peito-frango'),
  'a busca acha pelo nome do idioma de agora, e também pelo de outro idioma');
ok(buscarAlimento('Schnitzel', 6, 'dicionario').every((a) => !a.prato) && buscarAlimento('Schnitzel').some((a) => a.id === 'schnitzel'),
  'a busca do dicionário deixa o prato de fora, e a do registro o acha');
trocarLocal(null);
ok(alimentoDe('peito-frango')!.nome === 'Peito de frango', 'de volta ao padrão, o nome volta ao português');
ok(dicionario().filter((a) => /^Cenoura/.test(a.nome)).length === 1 && dicionario().filter((a) => /^Espinafre/.test(a.nome)).length === 1,
  'uma entrada por alimento: a cenoura e o espinafre aparecem uma vez só no dicionário');
ok(!ALIMENTOS().some((a) => a.id === 'cenoura' || a.id === 'whey' || a.id === 'suco-laranja') && !!alimentoDe('cenoura') && !!alimentoDe('whey'),
  'o que saiu das listas continua existindo por dentro, para as receitas e a hidratação');
ok(!dicionario().some((a) => a.id === 'batata-frita') && ALIMENTOS().some((a) => a.id === 'batata-frita'),
  'a fritura comum sai do dicionário e continua na busca de refeição');
ok(alimentoDe('peito-frango')!.preparo === 'grelhado' && alimentoDe('banana')!.preparo === 'cru',
  'o alimento diz de que preparo são os números');
const schnitzel = alimentoDe('schnitzel')!;
ok(contemDe(schnitzel).includes('carne') && contemDe(schnitzel).includes('ovo'),
  'o prato somado contém o que as comidas da receita contêm');
ok(contemDe(alimentoDe('salada-caesar')!).includes('ave') && contemDe(alimentoDe('salada-caesar')!).includes('peixe'),
  'e o que a receita leva de fora da lista, como as anchovas do molho caesar');
ok(cabe(alimentoDe('bebida-soja')!, ['vegano']) && !cabe(alimentoDe('leite-desnatado')!, ['vegano']),
  'a bebida de soja cabe no vegano, mesmo na prateleira do leite');

console.log('\n26. A FOTO DEVOLVE O RÓTULO INTEIRO DO QUE NÃO ESTÁ NA LISTA');
const porcaoFoto = { nome: 'Bobó de camarão', unidade: 'prato', unidades: 'pratos', gramas: 300,
  proteina: 24, kcal: 450, carboidrato: 45, gordura: 20, fibra: 3, prateleira: 'Pratos prontos' as const };
/* o que o servidor devolve: o rótulo, e nome e base para a versão antiga */
const daFoto = limparDaFoto([
  { id: 'arroz', qtd: 4 },
  { nome: 'Bobó de camarão', base: 24, rotulo: rotuloDaPorcao(porcaoFoto), qtd: 1 },
  { nome: 'Farofa da vó', base: 3, qtd: 1 },
]);
ok(daFoto.length === 3 && daFoto[1].estimado === 'foto' && !!daFoto[1].rotulo && daFoto[2].base === 3 && !daFoto[2].rotulo,
  'o item fora da lista vem com o rótulo e marcado como da foto; o formato antigo continua entrando');
ok(ressalvaItem(daFoto[1]) === T.alimentacao.prato.estimado && gramasItem(daFoto[1]) === 24,
  'a tela diz que foi estimado pela foto, e a proteína é a da porção');
const somaFoto = nutrientesDe(daFoto);
ok(somaFoto.contados === 2 && somaFoto.estimados === 1 && somaFoto.fora === 1,
  'o prato da foto entra na energia como estimado, e o item só com proteína fica fora');
const comFoto = clone(novo);
registrarRefeicao(comFoto, { name: 'Almoço', tag: '', itens: daFoto, fonte: 'foto' });
const energiaFoto = energiaDoDia(comFoto, +hoje);
ok(energiaFoto.estimadas === 1 && energiaFoto.kcal >= 450, 'a energia do dia conta a refeição com número estimado, e diz quantas');
ok(seusPratos(comFoto).some((r) => r.nome === 'Bobó de camarão'), 'o prato estimado pela foto também volta como prato seu');

console.log('\n27. A PORTA DO SERVIDOR DA IA');
/* A porta é assíncrona, e a sonda roda em CommonJS, sem await no topo:
   a seção é uma função, e o resultado final espera por ela. */
const secaoDaPorta = (async () => {
  const env = { ...process.env };
  const fetchDeVerdade = globalThis.fetch;
  let pedido: { url: string; headers: any; body: any } | null = null;
  const responde = (status: number, corpo: unknown) => {
    globalThis.fetch = (async (url: string, init: any) => {
      pedido = { url, headers: init.headers, body: JSON.parse(init.body) };
      return new Response(JSON.stringify(corpo), { status });
    }) as any;
  };
  const req = (auth?: string) => new Request('https://x/api/analisar', { method: 'POST', headers: auth ? { authorization: auth } : {} });

  delete process.env.SUPABASE_URL; delete process.env.SUPABASE_PUBLISHABLE_KEY; delete process.env.VERCEL_ENV;
  ok((await abrirPorta(req(), 'foto')).ok, 'sem o Supabase configurado, em desenvolvimento, a porta deixa passar');
  process.env.VERCEL_ENV = 'production';
  const semConfig = await abrirPorta(req(), 'foto');
  ok(!semConfig.ok && semConfig.motivo === 'sem-rede', 'em produção, sem o Supabase configurado, a porta fecha em vez de abrir');

  process.env.SUPABASE_URL = 'https://projeto.supabase.co/';
  process.env.SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_teste';
  const semSessao = await abrirPorta(req(), 'foto');
  ok(!semSessao.ok && semSessao.motivo === 'sem-conta' && semSessao.status === 401, 'sem o JWT da sessão, é "sem-conta"');

  responde(200, { ok: true, limite: 20, restam: 19 });
  const aberta = await abrirPorta(req('Bearer jwt.da.sessao'), 'estimativa');
  ok(aberta.ok && pedido!.url === 'https://projeto.supabase.co/rest/v1/rpc/consumir_cota_da_ia'
    && pedido!.headers.authorization === 'Bearer jwt.da.sessao' && pedido!.headers.apikey === 'sb_publishable_teste'
    && pedido!.body.tipo === 'estimativa',
    'com sessão, a porta repassa o JWT e a chave pública para a cota, com o tipo, e abre');
  responde(200, { ok: false, limite: 20, restam: 0 });
  const cheia = await abrirPorta(req('Bearer jwt.da.sessao'), 'foto');
  ok(!cheia.ok && cheia.motivo === 'limite' && cheia.status === 429, 'passado o teto do dia, é "limite"');
  responde(401, { message: 'JWT expired' });
  const vencida = await abrirPorta(req('Bearer jwt.vencido'), 'laudo');
  ok(!vencida.ok && vencida.motivo === 'sem-conta', 'um JWT recusado pelo Supabase é "sem-conta"');
  responde(401, { code: '42501', message: 'sessão anônima' });
  const anonima = await abrirPorta(req('Bearer jwt.anonimo'), 'foto');
  ok(!anonima.ok && anonima.motivo === 'sem-conta', 'a sessão anônima recusada pela função é "sem-conta"');
  responde(500, { message: 'erro' });
  const quebrou = await abrirPorta(req('Bearer jwt.da.sessao'), 'foto');
  ok(!quebrou.ok && quebrou.motivo === 'sem-rede', 'um erro do Supabase fecha a porta, e não a abre');

  ok(motivoDaPorta({ ok: false, motivo: 'limite' }) === 'limite' && motivoDaPorta({ ok: false, motivo: 'sem-rede' }) === null,
    'o aplicativo reconhece os dois motivos da porta, e só eles');

  globalThis.fetch = fetchDeVerdade;
  for (const k of ['SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY', 'VERCEL_ENV']) {
    if (env[k] === undefined) delete process.env[k]; else process.env[k] = env[k];
  }
})();

/* ============================================================
   28. A CONVERSA DO MORPHI INTELLIGENCE
   ============================================================ */
const secaoDaConversa = secaoDaPorta.then(async () => {
  console.log('\n28. A CONVERSA DO MORPHI INTELLIGENCE');

  /* O resumo na semente: as seções, o teto, e nada de terceiros. */
  const S = ensureDefaults(clone(semente)) as State;
  const r = resumoDaJornada(S);
  ok(['## Pessoa', '## Tratamento', '## Peso', '## Sintomas', '## Alimentação e água', '## Exames'].every((x) => r.includes(x)),
    'o resumo da semente tem as seções do tratamento, do peso, dos sintomas, da comida e dos exames');
  ok(r.length <= TETO_DO_RESUMO && r.length < TETOS.resumo, 'o resumo cabe no teto do aplicativo, e o do aplicativo no do servidor');
  const P = S.profile as any;
  const terceiros = [P.doctor, P.clinic, P.nutri, P.clinicInfo?.cidade, P.email, P.conta?.email, (S as any).conta?.email]
    .filter((x) => typeof x === 'string' && x.trim().length > 2);
  ok(terceiros.length > 0 && terceiros.every((x) => !r.includes(x)),
    'o resumo não leva o nome da médica, da clínica nem e-mail nenhum');
  const sobrenome = String(P.name).trim().split(/\s+/).slice(1).join(' ');
  ok(!sobrenome || !r.includes(sobrenome), 'do nome, só o primeiro');
  ok(!((S as any).notes ?? []).some((n: any) => typeof n?.text === 'string' && n.text.length > 12 && r.includes(n.text)),
    'as notas livres não entram no resumo');

  /* A pessoa sem registros: nenhuma seção inventada. */
  const V = ensureDefaults(estadoVazio() as State) as State;
  const rv = resumoDaJornada(V);
  ok(!rv.includes('## Sintomas') && !rv.includes('## Exames') && !rv.includes('## Check-in') && rv.includes('Nenhuma pesagem registrada'),
    'sem registros, o resumo não inventa seção de sintomas, check-in nem exames, e diz que não há pesagem');
  ok(!/sem sintomas/i.test(rv) && !/sem sintomas/i.test(r), 'nenhum resumo diz "sem sintomas" — ausência de registro não é ausência');

  /* O aceite: sem ele, nada sai do aparelho. */
  const A = clone(V) as any;
  ok(!aceitouAConversa(A), 'a conversa começa sem o aceite');
  let chamou = false;
  const fetchDeVerdade = globalThis.fetch;
  globalThis.fetch = (async () => { chamou = true; return new Response('{}'); }) as any;
  const semAceite = await perguntarAoMorphi(A, 'por que tenho enjoo?', []);
  ok(!semAceite.ok && (semAceite.motivo === 'sem-aceite' || semAceite.motivo === 'sem-servidor') && !chamou,
    'sem o aceite, a pergunta não chama o servidor');
  globalThis.fetch = fetchDeVerdade;
  registrarAceiteDaConversa(A);
  ok(aceitouAConversa(A), 'o aceite fica gravado com a versão');
  ok(DESTINO_NO_PERFIL.aceiteDaConversa === 'parte:preferencias' && DESTINO_NO_ESTADO.conversa === 'aparelho',
    'o aceite anda com a pessoa; a conversa fica no aparelho e não sobe');

  /* A conversa guardada tem teto. */
  for (let i = 0; i < TETO_DA_CONVERSA + 7; i++) guardarNaConversa(A, { who: i % 2 ? 'ai' : 'me', text: 'm' + i, t: i });
  const g = conversaGuardada(A);
  ok(g.length === TETO_DA_CONVERSA && g[g.length - 1].text === 'm' + (TETO_DA_CONVERSA + 6),
    'a conversa guardada para no teto, e as mais antigas é que saem');

  /* A resposta que chega da rede: só o que a tela entende. */
  const limpa = limparResposta('Oi **Mari**. Veja [seus sintomas](/sintomas), [um site](https://x.com) e [nada](/admin).<script>x</script>\n\n\n\nFim');
  ok(limpa === 'Oi <b>Mari</b>. Veja [seus sintomas](/sintomas), um site e nada.x\n\nFim',
    'a resposta limpa: negrito vira <b>, link de fora vira texto, e só as rotas da lista abrem');
  ok(JSON.stringify([...TELAS_DA_CONVERSA].sort()) === JSON.stringify(Object.keys(TELAS).sort()),
    'as rotas que o prompt oferece são as mesmas que o aplicativo abre');

  /* O servidor: a base gerada em dia, o pedido conferido, as mensagens. */
  ok(BASE === montarBase(), 'a base de conhecimento gerada está em dia com servidor/conhecimento (rode gerar-base.mjs)');
  ok(lerPedido({ pergunta: 'oi', historico: [], resumo: '', idioma: 'de-DE' })?.idioma === 'de-DE'
    && lerPedido({ pergunta: 'oi', idioma: 'xx' })?.idioma === 'pt-BR',
    'o pedido aceita os seis idiomas, e o que não conhece cai no português');
  ok(lerPedido({ pergunta: '' }) === null && lerPedido({ pergunta: 'x'.repeat(TETOS.pergunta + 1) }) === null
    && lerPedido({ pergunta: 'oi', resumo: 'x'.repeat(TETOS.resumo + 1) }) === null
    && lerPedido({ pergunta: 'oi', historico: Array(TETOS.trocas + 1).fill({ quem: 'eu', texto: 'a' }) }) === null
    && lerPedido({ pergunta: 'oi', historico: [{ quem: 'sistema', texto: 'a' }] }) === null,
    'o servidor recusa pergunta vazia ou longa, resumo grande, histórico longo e papel desconhecido');
  const ms = mensagensDe([{ quem: 'morphi', texto: 'a' }, { quem: 'eu', texto: 'b' }, { quem: 'eu', texto: 'c' }, { quem: 'morphi', texto: 'd' }], 'e');
  ok(ms.length === 3 && ms[0].role === 'user' && ms[0].content === 'b\n\nc' && ms[1].role === 'assistant' && ms[2].content === 'e',
    'as mensagens começam pela pessoa, alternam, e juntam duas falas seguidas do mesmo lado');

  /* A função inteira, com a porta fechada: não chega ao modelo. */
  const env = { ...process.env };
  process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'sk-teste';
  process.env.VERCEL_ENV = 'production';
  process.env.SUPABASE_URL = 'https://projeto.supabase.co';
  process.env.SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_teste';
  delete process.env.MORPHI_TOKEN;
  const conversa = (await import('../servidor/api/conversa')).default;
  const post = (corpo: unknown, auth?: string) => conversa.fetch(new Request('https://x/api/conversa', {
    method: 'POST', headers: { 'content-type': 'application/json', ...(auth ? { authorization: auth } : {}) }, body: JSON.stringify(corpo),
  }));
  const malformado = await post({ pergunta: '' });
  ok(malformado.status === 400, 'um pedido malformado é recusado antes da porta, sem gastar cota');
  const semLogin = await post({ pergunta: 'por que tenho enjoo?', resumo: r, idioma: 'pt-BR' });
  ok(semLogin.status === 401 && (await semLogin.json()).motivo === 'sem-conta', 'sem sessão, a conversa é "sem-conta" e não chama o modelo');
  for (const k of ['ANTHROPIC_API_KEY', 'VERCEL_ENV', 'SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY', 'MORPHI_TOKEN']) {
    if (env[k] === undefined) delete process.env[k]; else process.env[k] = env[k];
  }
});

secaoDaConversa.then(() => {
  console.log(falhas ? `\n${falhas} afirmação(ões) falharam\n` : '\ntodas as afirmações passaram\n');
  process.exit(falhas ? 1 : 0);
});
