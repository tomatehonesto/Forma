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
  diasDeRefeicao, diasDeAgua, diasDoPeriodo, temHistoria, ritmoRecente, last7Days,
} from '../src/logic/derive';
import { semanaDoTratamento } from '../src/logic/time';
import { boasVindasNaHome, marcarApresentacaoVista } from '../src/logic/apresentacao';
import { semanaQuePassou, marcoRecente } from '../src/logic/destaques';
import { descobertas } from '../src/logic/descobertas';
import { redeLancada, temRedeParceira } from '../src/logic/pais';
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

console.log(falhas ? `\n${falhas} afirmação(ões) falharam\n` : '\ntodas as afirmações passaram\n');
process.exit(falhas ? 1 : 0);
