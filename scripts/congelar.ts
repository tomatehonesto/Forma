/* ============================================================
   O CONGELAMENTO — a rede da extração de textos

   ⚠️⚠️ ESTE ARQUIVO EXISTE POR CAUSA DE QUATRO FRASES QUEBRADAS.

   A varredura das unidades trocou 58 sítios com uma expressão regular, e
   quatro delas saíram erradas: o `.+?` atravessou um `)}` e comeu o texto
   entre dois números. Todas compilavam. O `tsc` não viu nada, a revisão de
   diff viu — e só porque eu fui olhar linha a linha.

   Tirar 1.500 frases do código para um catálogo é a mesma operação, trinta
   vezes maior. Sem uma invariante verificável, é questão de quando, e não
   de se.

   A INVARIANTE: a extração está certa se, e somente se, o texto que estas
   funções produzem for BYTE A BYTE idêntico antes e depois. Elas são
   funções puras do estado, e o estado é a semente — então a saída é
   determinística dentro de uma mesma execução.

   ⚠️ E ELAS NÃO IMPORTAM REACT NATIVE, que é o que torna isto possível
   sem navegador e sem montar tela nenhuma:

     npx tsx --tsconfig scripts/tsconfig.json scripts/congelar.ts > antes.json
     …extrai um domínio…
     npx tsx --tsconfig scripts/tsconfig.json scripts/congelar.ts > depois.json
     diff antes.json depois.json

   ⚠️⚠️ O `--tsconfig` NÃO É ENFEITE, E A REDE MORRE SEM ELE. Este arquivo
   importa `logic/exportacao`, que importa `Platform` de 'react-native' —
   e o esbuild do tsx não lê o Flow do index.js do React Native. O erro é
   "Unexpected typeof", não tem nada a ver com texto, e quem o vir vai
   achar que a rede apodreceu.

   Ela não apodreceu: os dublês estão em scripts/duble e o mapeamento
   deles está em scripts/tsconfig.json. O que faltava era mandar o tsx ler
   esse tsconfig, porque ele não o acha sozinho.

   Diferença nenhuma é a única saída aceitável. Qualquer linha no diff é um
   erro de extração, não uma melhoria — melhoria de texto é outro commit.

   ⚠️ A DATA ANDA. `now()` é o relógio de verdade, então a saída muda de um
   dia para o outro. Isto compara ANTES e DEPOIS da mesma sessão; não serve
   como arquivo commitado que se confere semanas depois.

   ⚠️⚠️ E O SILÊNCIO DESTA REDE NÃO É PROVA. Ela roda sete cenários sobre
   UMA semente, e a semente tem registro de tudo — então todo ramo que só
   aparece no vazio fica fora. `metas.jornada.semRegistros` é o exemplo
   que custou: o feminino estava escrito em duro nela, a tela dizia "sem
   dias registradas ainda", e o congelamento acusou "idêntico" antes e
   depois da correção, porque nunca renderizou aquela linha.

   Antes de confiar num "idêntico", procure no JSON a frase que DEVERIA
   ter mudado. Se ela não estiver lá, a rede não olhou — e quem olha é
   você.
   ============================================================ */

import { trocarLocal, type Local } from '../src/logic/local';
import { buildSeed } from '../src/logic/seed';
import {
  todayBrief, journeyGoals, weightCard, canetaAtual, cicloFases,
  rodizioDeLocais, bodyFat, penStock, variacaoDe, resumoDeMovimento,
  periodoDaConsulta, adesao, hungerForecast, enjooAposDormir,
  examCats, examBy, examAbout, examInfluences, examWays, examStatus, examesComValor,
  examExplain, examSummary, exameNoProtocolo,
  patterns, PAT_LABEL, balanceRead, balanceSeries, radar, diaFracoDeAgua, janelaDoEnjoo,
  ALVOS, INDICADORES, METAS_PESSOAIS, META_LIVRE, PRAZOS, padraoDe,
  carePending, careState, doseContext, lastMessage, nextConsult,
  contatosDaClinica, fichaDaEquipe, fichaDaClinica,
  doseDoPerfil, cadenciaTexto, cadenciaCurta, milestones, semanasDaGrade, MOTIVOS, ATIVIDADES,
  FAIXAS_IMC, planoDoPerfil, companionMemoria, libraryPicks, dailyTargets,
  protein7d, TL_LABEL, timelineEvents, timelineWeeks, journeyChanges,
  metaDePeso, listaPt, protocoloDaSemana, semanaDoHistorico, diaDoTratamento,
  journeySummary, preparoDaConsulta,
} from '../src/logic/derive';
import { mensagemDoDia, emPlato } from '../src/logic/etapa';
import { descobertas, descobertaDaHome } from '../src/logic/descobertas';
import { confirmacaoDe } from '../src/logic/confirmacoes';
import { conselhosDaRotina } from '../src/logic/conselhos';
import {
  niveisDoRegistro, combinacao, leituraDoDia, avisosDoDia, lembretesDoDia, marcoDe,
} from '../src/logic/leituras';
import { conquistas } from '../src/logic/conquistas';
import { buscarAlimento, medidaDe, gramasDe } from '../src/logic/alimentos';
import {
  ENERGIA, SONO, HUMOR, FOME, INTENSIDADE, SINTOMA, INTESTINO,
  SINTOMAS, SINTOMAS_LIDOS, faixaDe, gramasDaFaixa,
} from '../src/logic/escalas';
import { dadosParaExportar } from '../src/logic/exportacao';

/* Uma chamada que não existe mais — porque alguém renomeou a função — não
   pode derrubar o congelamento inteiro em silêncio: ela entra como erro
   NOMEADO, e o diff mostra que aquele bloco parou de ser conferido. */
const tenta = (nome: string, fn: () => unknown) => {
  try { return fn(); } catch (e: any) { return `⚠️ ERRO EM ${nome}: ${e?.message ?? e}`; }
};

/* ⚠️ AS QUATRO FORMAS E OS DOIS SISTEMAS, e não só o padrão.

   Metade do texto deste aplicativo passou a depender da forma do
   medicamento e da unidade de medida. Congelar só o caminho de quem usa
   caneta em quilo deixaria de fora justamente os ramos novos, que são os
   que ninguém exercita todo dia. */
/* ⚠️⚠️ O TERCEIRO CAMPO É O LOCAL, e ele não mora no estado. Idioma,
   separador decimal e desenho de data são valor de módulo — ver
   logic/local, que explica por quê —, então o cenário não consegue
   ajustá-los mexendo em `S`. Ele diz qual local quer, e o laço troca
   antes de rodar e devolve depois.

   ⚠️ E O CENÁRIO EM INGLÊS SAI COM FRASE EM PORTUGUÊS, de propósito: o
   motor de formato já escreve em inglês e o catálogo ainda não fala. É
   exatamente o que o aplicativo faz hoje num aparelho americano, e é a
   linha de base da peça 4 — quando a tradução chegar, só a PROSA deste
   cenário pode mudar. Número, data e relógio já estão no lugar, e
   qualquer movimento neles será erro dela. */
const CENARIOS: [string, (S: any) => void, Local?][] = [
  ['caneta-metrico', () => {}],
  ['caneta-imperial', (S) => { S.profile.sistema = 'imperial'; }],
  ['caneta-en-US', () => {}, 'en-US'],
  ['caneta-imperial-en-US', (S) => { S.profile.sistema = 'imperial'; }, 'en-US'],
  ['frasco-metrico', (S) => { S.profile.med = 'semaglutida-manipulada'; S.profile.forma = 'frasco'; S.profile.dose = 1.35; }],
  ['comprimido-metrico', (S) => { S.profile.med = 'rybelsus'; S.profile.forma = 'comprimido'; S.profile.dose = 7; }],

  /* ⚠️ O QUINTO CENÁRIO É DE DADOS FABRICADOS, e ele existe porque a
     semente dispara cinco dos onze cruzamentos. Os outros seis — proteína
     contra fome do dia seguinte, sono contra fome, sono contra enjoo,
     água contra enjoo, o dia fraco de hidratação e a proteína ao longo do
     tempo — nunca rodavam, e extrair texto que nada executa é escrever
     no escuro.

     ⚠️ E ELE NÃO É "DADO REALISTA", É UM GATILHO. Uma pessoa não vive
     catorze dias ruins seguidos e catorze bons; o que interessa aqui é
     que TODA relação que o `patterns()` procura exista e aponte para o
     mesmo lado, para que todas as frases sejam escritas uma vez. Ele não
     vale como retrato de ninguém, e por isso não entra na semente. */
  ['cruzamentos-fabricados', (S) => {
    const DIA = 86_400_000;
    const cs = S.checkins as any[];
    const hoje = cs[cs.length - 1].t;
    S.checkins = Array.from({ length: 28 }, (_, i) => {
      const t = hoje - (27 - i) * DIA;
      const dow = new Date(t).getDay();
      /* a segunda quinzena é a boa: é o que separa os grupos das
         comparações com atraso de um dia */
      const bom = i >= 14;
      const fds = dow === 0 || dow === 6;
      const base = bom ? 11 : 6;
      return {
        t,
        /* a quarta-feira é o dia fraco de água, e ela é de propósito um
           dia útil: no fim de semana o achado do fim de semana já falou,
           e o segundo seria eco */
        agua: base - (dow === 3 ? 4 : fds ? 3 : 0),
        aguas: [],
        prot: (bom ? 120 : 40) - (fds ? 20 : 0),
        sono: (bom ? 8 : 5) + (fds ? 1 : 0),
        nausea: bom ? 1 : 3,
        fome: bom ? 2 : 4,
        energia: bom ? 7 : 4,
        mood: bom ? 4 : 2,
        gut: 'normal',
        exerc: bom ? 40 : 0,
        treinos: [],
      };
    });
  }],
];

const TIPOS = ['peso', 'medidas', 'exame', 'anotacao', 'refeicao', 'exercicio', 'agua'] as const;

const saida: Record<string, unknown> = {};

for (const [nome, ajusta, local] of CENARIOS) {
  trocarLocal(local ?? 'pt-BR');
  const S: any = buildSeed();
  ajusta(S);
  const c: Record<string, unknown> = {};

  c.todayBrief = tenta('todayBrief', () => todayBrief(S));
  c.mensagemDoDia = tenta('mensagemDoDia', () => mensagemDoDia(S));
  c.emPlato = tenta('emPlato', () => emPlato(S));
  c.descobertas = tenta('descobertas', () => descobertas(S));
  c.descobertaDaHome = tenta('descobertaDaHome', () => descobertaDaHome(S));
  c.conselhos = tenta('conselhos', () => conselhosDaRotina(S));
  c.conquistas = tenta('conquistas', () => conquistas(S));
  c.journeyGoals = tenta('journeyGoals', () => journeyGoals(S));
  c.weightCard = tenta('weightCard', () => weightCard(S));
  c.canetaAtual = tenta('canetaAtual', () => canetaAtual(S));
  c.penStock = tenta('penStock', () => penStock(S));
  c.bodyFat = tenta('bodyFat', () => bodyFat(S));
  c.cicloFases = tenta('cicloFases', () => cicloFases(S));
  c.rodizioDeLocais = tenta('rodizioDeLocais', () => rodizioDeLocais(S));
  c.resumoDeMovimento = tenta('resumoDeMovimento', () => resumoDeMovimento(S, 28));
  c.periodoDaConsulta = tenta('periodoDaConsulta', () => periodoDaConsulta(S, S.consult?.t ?? 0));
  c.adesao = tenta('adesao', () => adesao(S));
  c.hungerForecast = tenta('hungerForecast', () => hungerForecast(S));
  c.enjooAposDormir = tenta('enjooAposDormir', () => enjooAposDormir(S));
  c.exportacao = tenta('dadosParaExportar', () => dadosParaExportar(S, {
    desde: 0, inclui: {
      peso: true, sintomas: true, aplicacoes: true, exames: true,
      alimentacao: true, exercicio: true, notas: true,
    },
  } as any));

  c.confirmacoes = TIPOS.map((t) => [t, tenta(`confirmacaoDe(${t})`, () => confirmacaoDe(S, t))]);

  /* As leituras do check-in não recebem o estado: recebem os níveis do
     dia. Três dias fabricados cobrem o combinado, o aviso e o lembrete. */
  const dias = [
    { sono: 4, fome: 5, energia: 2, humor: 2, agua: 2, prot: 30 },
    { sono: 8, fome: 1, energia: 5, humor: 5, agua: 10, prot: 120 },
    { sono: 6, fome: 3, energia: 3, humor: 3, agua: 6, prot: 70 },
  ];
  c.leituras = dias.map((d) => {
    const n = niveisDoRegistro(d);
    return {
      niveis: n,
      combinacao: tenta('combinacao', () => combinacao(n)),
      leituraDoDia: tenta('leituraDoDia', () => leituraDoDia(dias, n)),
      avisos: tenta('avisosDoDia', () => avisosDoDia(n)),
      lembretes: tenta('lembretesDoDia', () => lembretesDoDia(dias, n)),
    };
  });
  c.marcos = [1, 3, 7, 14, 30, 60, 100].map((n) => [n, tenta('marcoDe', () => marcoDe(n))]);

  /* ⚠️ AS RÉGUAS SÃO TABELAS CONSTANTES, e por isso não dependem do
     cenário — mas entram aqui do mesmo jeito. São o texto que a pessoa
     TOCA para responder o check-in: se um degrau trocar de lugar, o 4 de
     hoje passa a significar outra coisa que o 4 de ontem, e a série
     inteira que o aplicativo lê depois fica sem sentido. */
  /* ⚠️ A BUSCA DE ALIMENTO NÃO PRODUZ FRASE, mas produz o que a pessoa
     VÊ quando digita — e ela acabou de mudar de regra. Entra aqui para o
     diff mostrar o que a mudança fez com a lista brasileira, que não era
     o alvo dela. */
  c.buscaDeAlimento = ['arroz', 'frango', 'peito de frango', 'ovo', 'pao', 'feijao', 'leite', 'banana', 'queijo', 'carne moida']
    .map((termo) => [termo, tenta('buscarAlimento', () => buscarAlimento(termo, 6).map((a) => a.nome + ' · ' + medidaDe(a, a.qtd) + ' · ' + gramasDe(a, a.qtd) + ' g'))]);

  c.escalas = {
    energia: ENERGIA(), sono: SONO(), humor: HUMOR(), fome: FOME(),
    intensidade: INTENSIDADE(), sintoma: SINTOMA(), intestino: INTESTINO(),
    sintomas: SINTOMAS(),
    sintomasLidos: SINTOMAS_LIDOS().map((x) => [x.id, x.label, x.regua]),
    /* ⚠️ A FAIXA DE PROTEÍNA É VALOR GRAVADO, e a volta existe só para ler
       refeição antiga. Se o rótulo mudar, a leitura do registro velho
       para de achar o número. */
    faixas: [40, 24, 23, 13, 12, 0].map((g) => [g, tenta('faixaDe', () => faixaDe(g))]),
    daFaixa: ['alta', 'média', 'baixa', 'outra'].map((f) => [f, tenta('gramasDaFaixa', () => gramasDaFaixa(f))]),
  };
  c.variacoes = [-2.4, -0.04, 0, 1.7].map((v) => [v, tenta('variacaoDe', () => variacaoDe(v, 'kg'))]);

  /* ⚠️ O DOMÍNIO DOS EXAMES ENTRA INTEIRO, e ele estava fora da rede.

     São quarenta e tantas definições, vinte e tantas listas de causa e
     trinta grupos de "o que costuma ajudar" — o maior bloco de texto
     clínico do aplicativo, e justamente o que não tinha nada embaixo.

     A varredura sai das CATEGORIAS e não de uma lista escrita à mão:
     marcador que alguém acrescentar amanhã entra sozinho no congelamento,
     em vez de sair calado. */
  c.examCats = tenta('examCats', () => examCats());
  c.marcadores = examCats().flatMap(([, ms]) => ms).map((m) => {
    /* As três primeiras só leem `.marker`, então valem para marcador que a
       semente não tem. As duas últimas precisam dos valores, e por isso só
       rodam para quem existe. */
    const e = examBy(S, m);
    return [m, {
      sobre: tenta('examAbout', () => examAbout({ marker: m })),
      influencias: tenta('examInfluences', () => examInfluences({ marker: m })),
      ajudar: tenta('examWays', () => examWays({ marker: m })),
      status: e ? tenta('examStatus', () => examStatus(e)) : null,
      explica: e ? tenta('examExplain', () => examExplain(e, S.exams)) : null,
    }];
  });
  /* ⚠️ OS CRUZAMENTOS ENTRAM CRUS, e não pelo que a Home mostra deles.
     O congelamento já chamava `descobertas`, que LÊ o `patterns()` e
     descarta a maior parte — os retratos do fim da fila, os achados sem
     força, tudo o que não cabe na Home. Congelar só a peneira é congelar
     um terço do texto e achar que cobriu. */
  c.patterns = tenta('patterns', () => patterns(S));
  c.patLabel = tenta('PAT_LABEL', () => PAT_LABEL());
  /* ============================================================
     O EQUILÍBRIO — e a leitura tem três aberturas, das quais a semente
     vive uma

     `balanceRead` escolhe a abertura pela AMPLITUDE entre o melhor e o pior
     eixo: até 30 é "reparei numa coisa boa", até 55 é "uma coisa me
     chamou atenção", acima disso é "preciso te mostrar uma coisa". E o
     corpo da frase tem duas versões pelo mesmo corte.

     A semente cai sempre na terceira. As outras duas — que são as que
     dizem que está tudo bem — nunca rodavam.

     ⚠️ OS TRÊS CHECK-INS FABRICADOS SÃO SÓ ISSO: um jeito de mover a
     amplitude. `radar` lê a média dos três últimos, então mexer neles é
     mexer na figura inteira. */
  c.balanceRead = tenta('balanceRead', () => balanceRead(S));
  c.radar = tenta('radar', () => radar(S));

  const equilibrio = (nome: string, sono: number) => {
    const cs = (S.checkins as any[]).slice();
    const tres = cs.slice(-3).map((c: any) => ({
      ...c, sono, energia: 10, mood: 5, agua: 20, prot: 400, fome: 0, exerc: 40,
    }));
    const V: any = { ...S, checkins: [...cs.slice(0, -3), ...tres] };
    const leitura = tenta('balanceRead', () => balanceRead(V));
    return [nome, {
      radar: tenta('radar', () => radar(V)),
      leitura,
      serieDoFraco: tenta('balanceSeries', () => balanceSeries(V, (leitura as any).fraco)),
    }];
  };
  c.equilibrio = [
    equilibrio('tudo-junto', 8),
    equilibrio('um-eixo-atras', 4),
    equilibrio('um-eixo-muito-atras', 1),
  ];
  /* Toda série do balanço, eixo por eixo: são oito funções de leitura, e
     só a do eixo mais fraco roda na tela. */
  c.series = radar(S).map((e) => [e.id, tenta('balanceSeries', () => balanceSeries(S, e.id))]);
  c.diaFracoDeAgua = tenta('diaFracoDeAgua', () => diaFracoDeAgua(S));
  c.janelaDoEnjoo = tenta('janelaDoEnjoo', () => janelaDoEnjoo(S));

  /* ⚠️ OS CATÁLOGOS DE META ENTRAM UM A UM, E EXECUTADOS. Quase tudo
     neles é função — `un(S)`, `escreve(v, S)`, `rotulo(v, S)`, `monta(r)` —,
     e congelar a tabela crua congelaria o nome da função, não a frase que
     ela produz. Duas das quatro grandezas mudam de unidade, então a
     mesma linha sai diferente em métrico e em imperial: é isso que estes
     quatro cenários existem para pegar. */
  c.alvos = Object.entries(ALVOS()).map(([k, a]) => [k, {
    nome: a.nome, onde: a.onde, origem: a.origem, ressalva: a.ressalva ?? null,
    un: tenta('un', () => a.un(S)),
    escreve: tenta('escreve', () => a.escreve(a.le(S), S)),
  }]);

  c.indicadores = INDICADORES().map((i) => {
    const v = padraoDe(i, S);
    return [i.id, {
      nome: i.nome, pergunta: i.pergunta, origem: i.origem, nomes: i.nomes, un: i.un ?? null,
      escreve: tenta('escreve', () => i.escreve(v, S)),
      rotulo: tenta('rotulo', () => i.rotulo(v, S)),
      conta: tenta('conta', () => i.conta(v, S)),
    }];
  });

  /* O `monta` recebe um pedaço de frase e devolve a sentença inteira; o
     pedaço é sempre o mesmo para o diff ficar legível. */
  c.metasPessoais = [...METAS_PESSOAIS(), META_LIVRE()].map((m) => [m.id, {
    nome: m.nome, pergunta: m.pergunta, dica: m.dica,
    monta: tenta('monta', () => m.monta('AQUILO')),
  }]);

  c.prazos = PRAZOS().map((x) => [x.id, x.label, x.dias]);

  /* ⚠️ A SEMENTE SÓ TEM META PESSOAL, e três delas sem prazo. A meta
     MEDIDA — a que tem porcentagem, contagem e o rótulo montado a partir
     do indicador — nunca rodava, nem o prazo vencido, nem o prazo por
     vir. Estas metas são fabricadas aqui, e não na semente, porque
     ninguém tem oito metas medidas ao mesmo tempo. */
  c.journeyGoalsFabricadas = tenta('journeyGoals(fabricadas)', () => {
    const fake = { ...S, goals: [
      ...INDICADORES().map((i) => ({ id: 'm-' + i.id, ic: i.ic, indicador: i.id })),
      { id: 'p-prazo', ic: 'target', label: 'Uma meta com prazo por vir', indicador: null, feita: false, em: null, prazo: S.checkins[S.checkins.length - 1].t + 30 * 86_400_000 },
      { id: 'p-venceu', ic: 'target', label: 'Uma meta com prazo vencido', indicador: null, feita: false, em: null, prazo: S.checkins[S.checkins.length - 1].t - 30 * 86_400_000 },
      { id: 'p-feita', ic: 'target', label: 'Uma meta conquistada', indicador: null, feita: true, em: S.checkins[0].t, prazo: null },
    ] };
    return journeyGoals(fake as any);
  });

  /* ============================================================
     O CUIDADO — e ele tem QUATRO manchetes, das quais a semente vive uma

     `careState` escolhe entre consulta-chegando, pós-consulta, pendências e
     em-dia, nessa ordem de precedência. A semente cai sempre na terceira,
     porque tem uma mensagem não lida e três doses na caneta — as outras
     três manchetes nunca rodavam, e dentro delas há ainda os ramos de
     com-plataforma e sem-plataforma, que dizem coisas diferentes.

     ⚠️ E O MOTIVO DE ISTO IMPORTAR MAIS AQUI do que nos outros domínios:
     este é o texto que fala da EQUIPE de alguém. "Sua equipe atualizou
     seu tratamento" é falso sem plataforma, e o ramo que evita a mentira
     é justamente um dos que não rodavam. */
  const DIA = 86_400_000;
  const hoje = S.checkins[S.checkins.length - 1].t;
  const cuidado = (nome: string, muda: (V: any) => void) => {
    const V: any = { ...S, profile: { ...S.profile } };
    muda(V);
    return [nome, {
      pendentes: tenta('carePending', () => carePending(V)),
      estado: tenta('careState', () => careState(V)),
      contexto: tenta('doseContext', () => doseContext(V)),
      proximaConsulta: tenta('nextConsult', () => nextConsult(V)),
      ultimaMensagem: tenta('lastMessage', () => lastMessage(V)),
    }];
  };
  /* Zera tudo o que produz pendência: sem isso o estado de pendências
     vence, e nenhuma das outras três manchetes chega a ser testada. */
  const semPendencia = (V: any) => {
    V.unread = 0;
    V.pen = { ...(S as any).pen, dosesLeft: 8 };
    V.protocol = { ...S.protocol, tasks: [] };
    V.consult = { ...(S as any).consult, t: hoje + 60 * DIA };
    V.consultsHistory = [];
  };

  c.cuidado = [
    cuidado('como-a-semente-esta', () => {}),
    cuidado('consulta-hoje', (V) => { V.consult = { ...(S as any).consult, t: hoje }; }),
    cuidado('consulta-amanha', (V) => { V.consult = { ...(S as any).consult, t: hoje + DIA }; }),
    cuidado('consulta-em-3-dias', (V) => { V.consult = { ...(S as any).consult, t: hoje + 3 * DIA }; }),
    /* A semente tem UMA mensagem não lida, então o plural da linha de
       mensagens nunca rodava. */
    cuidado('duas-mensagens', (V) => { V.unread = 2; }),
    cuidado('pos-consulta-com-plataforma', (V) => {
      semPendencia(V);
      V.consultsHistory = [{ t: hoje - DIA, type: 'Teleconsulta', doctor: 'Dra. Helena Costa' }];
    }),
    cuidado('pos-consulta-sem-plataforma', (V) => {
      semPendencia(V);
      V.consultsHistory = [{ t: hoje - DIA, type: 'Teleconsulta', doctor: 'Dra. Helena Costa' }];
      V.profile.vinculo = undefined;
    }),
    /* Uma pendência só — é o ramo do singular, em três frases diferentes. */
    cuidado('uma-pendencia', (V) => {
      semPendencia(V);
      V.pen = { ...(S as any).pen, dosesLeft: 1 };
    }),
    cuidado('em-dia-com-medico', semPendencia),
    cuidado('em-dia-sem-medico', (V) => {
      semPendencia(V);
      V.profile.doctor = ''; V.profile.clinic = ''; V.profile.vinculo = undefined;
    }),
  ];

  /* ⚠️ OS CINCO CANAIS DE CONTATO, e a clínica da semente não tem todos.
     Cada linha só existe quando o dado existe — é a regra da tela —, e
     congelar só o que a semente traz deixaria três das cinco fora. */
  c.contatos = tenta('contatosDaClinica', () => contatosDaClinica({
    whatsapp: '+55 11 90000-0000', telefone: '(11) 3000-0000',
    site: 'clinica.example', email: 'contato@clinica.example', instagram: 'clinica',
  }));
  c.contatosDaSemente = tenta('contatosDaClinica(semente)', () => contatosDaClinica(fichaDaClinica(S)?.contato));
  c.equipe = tenta('fichaDaEquipe', () => fichaDaEquipe(S));
  /* Sem especialidade anotada, o papel da responsável cai no texto
     padrão — e esse é o caso de quem nunca preencheu a ficha. */
  c.equipeSemEspecialidade = tenta('fichaDaEquipe(sem especialidade)', () =>
    fichaDaEquipe({ ...S, profile: { ...S.profile, doctorInfo: {} } } as any));

  /* ============================================================
     O RESTO DO derive.ts — as seções menores, todas de uma vez

     ⚠️ NENHUMA DELAS ESTAVA NA REDE. São dezesseis seções e duzentos e
     sessenta pedaços de frase: o protocolo da semana, as semanas
     anteriores, o preparo da consulta, o plano que sai do cadastro, a
     Home inteira, a biblioteca, os marcos, o resumo da coleta. Cortar
     tudo isso sem congelar antes seria repetir, de uma vez só, o erro que
     este arquivo existe para impedir.
     ============================================================ */
  c.doseDoPerfil = tenta('doseDoPerfil', () => doseDoPerfil(S));
  c.cadenciaTexto = tenta('cadenciaTexto', () => cadenciaTexto(S));
  c.cadenciaCurta = tenta('cadenciaCurta', () => cadenciaCurta(S));
  c.milestones = tenta('milestones', () => milestones(S));
  c.semanasDaGrade = tenta('semanasDaGrade', () => semanasDaGrade(S));
  c.motivos = tenta("MOTIVOS", () => MOTIVOS());
  c.atividades = tenta("ATIVIDADES", () => ATIVIDADES());
  c.faixasDeIMC = tenta("FAIXAS_IMC", () => FAIXAS_IMC());
  c.planoDoPerfil = tenta('planoDoPerfil', () => planoDoPerfil(S));
  c.companionMemoria = tenta('companionMemoria', () => companionMemoria(S));
  c.libraryPicks = tenta('libraryPicks', () => libraryPicks(S));
  c.dailyTargets = tenta('dailyTargets', () => dailyTargets(S));
  c.protein7d = tenta('protein7d', () => protein7d(S));
  c.tlLabel = tenta('TL_LABEL', () => TL_LABEL());
  c.timelineEvents = tenta('timelineEvents', () => timelineEvents(S));
  c.timelineWeeks = tenta('timelineWeeks', () => timelineWeeks(S));
  c.journeyChanges = tenta('journeyChanges', () => journeyChanges(S));
  c.metaDePeso = tenta('metaDePeso', () => metaDePeso(S));
  c.protocoloDaSemana = tenta('protocoloDaSemana', () => protocoloDaSemana(S));
  c.semanaDoHistorico = tenta('semanaDoHistorico', () => semanaDoHistorico(S, hoje));
  c.diaDoTratamento = tenta('diaDoTratamento', () => diaDoTratamento(S));
  c.journeySummary = tenta('journeySummary', () => journeySummary(S));
  c.preparoDaConsulta = tenta('preparoDaConsulta', () => preparoDaConsulta(S));

  /* `listaPt` escreve "a, b e mais 2" — um, dois, três e quatro itens dão
     quatro frases diferentes. */
  c.listaPt = [1, 2, 3, 4, 5].map((n) =>
    [n, tenta('listaPt', () => listaPt(['um', 'dois', 'três', 'quatro', 'cinco'].slice(0, n)))]);

  /* ⚠️ VARIAÇÕES QUE A SEMENTE NÃO TEM. O plano de partida e o dia do
     tratamento mudam de frase antes da primeira dose, e a semente já
     aplicou dez vezes. */
  const antesDeComecar = (V: any) => {
    V.injections = [];
    V.profile = { ...S.profile, startT: hoje + 3 * DIA };
  };
  c.antesDeComecar = tenta('antes de começar', () => {
    const V: any = { ...S }; antesDeComecar(V);
    return {
      dia: diaDoTratamento(V), plano: planoDoPerfil(V),
      memoria: companionMemoria(V), preparo: preparoDaConsulta(V),
      doseDoPerfil: doseDoPerfil(V), cadencia: cadenciaTexto(V),
    };
  });
  c.semDose = tenta('sem dose', () => {
    const V: any = { ...S, profile: { ...S.profile, dose: 0 } };
    return { doseDoPerfil: doseDoPerfil(V), memoria: companionMemoria(V) };
  });
  /* Cadência diária e a de "a cada N dias": a semente é semanal. */
  c.cadencias = tenta('cadências', () => [1, 7, 14].map((dias) => {
    const V: any = { ...S, profile: { ...S.profile, intervalo: dias } };
    return [dias, cadenciaTexto(V), cadenciaCurta(V)];
  }));

  /* ============================================================
     OS EXAMES FORA DA FAIXA — e a semente não tem nenhum

     ⚠️ A SEMENTE É DE UMA PESSOA QUE FOI BEM: quinze marcadores, todos
     dentro da referência, todos caminhando na direção esperada. Dos
     ramos do resumo e da leitura, isso exercita três — e os que ficam de
     fora são justamente os que falam com quem recebeu uma notícia ruim.

     ⚠️ É O TEXTO MAIS DELICADO DO APLICATIVO INTEIRO. Ele diz a alguém
     que um exame de sangue dela saiu fora da faixa, e a diferença entre
     "este é o único fora" e "este é um deles" é a diferença entre um
     susto e um contexto. Extrair isso sem executar seria o pior lugar
     para escrever no escuro.

     Os valores abaixo são fabricados: empurram marcadores para fora da
     faixa, para os dois lados, e fazem alguns andarem na direção errada. */
  const piorado = (marcadores: [string, number][], base = S) => {
    const exams = (base.exams as any[]).map((e) => {
      const novo = marcadores.find(([m]) => m === e.marker);
      if (!novo) return e;
      return { ...e, values: [...e.values, { t: e.values[e.values.length - 1].t + 1, v: novo[1] }] };
    });
    return { ...base, exams } as any;
  };

  /* Um fora, três fora, cinco fora — os três tamanhos de lista que o
     resumo distingue, mais o caso de a lista não caber. */
  const UM: [string, number][] = [['HbA1c', 7.4]];
  const TRES: [string, number][] = [['HbA1c', 7.4], ['LDL', 171], ['Ferritina', 9]];
  const CINCO: [string, number][] = [...TRES, ['TGP', 88], ['Triglicerídeos', 240]];

  c.exames = [
    ['um-fora', UM], ['tres-fora', TRES], ['cinco-fora', CINCO],
  ].map(([nome, quais]) => {
    const V = piorado(quais as [string, number][]);
    const todos = examesComValor(V.exams);
    return [nome, {
      resumo: tenta('examSummary', () => examSummary(V)),
      /* A leitura de CADA marcador tocado, mais um que ficou dentro: é
         onde estão os ramos de painel, de faixa e de rumo. */
      leituras: (quais as [string, number][]).map(([m]) => {
        const e = examBy(V, m);
        return [m, e ? tenta('examExplain', () => examExplain(e, todos)) : null];
      }),
      umQueFicouDentro: tenta('examExplain(dentro)', () => {
        const e = examBy(V, 'HDL');
        return e ? examExplain(e, todos) : null;
      }),
    }];
  });

  /* ⚠️ E UM QUE PIOROU SEM SAIR DA FAIXA: é o ramo "na direção oposta à
     esperada", que não existe em nenhum dos cenários acima — lá quem
     piora já sai da referência junto. */
  c.examePioraDentro = tenta('examExplain(piora dentro)', () => {
    const V = piorado([['HDL', 42]]);
    const e = examBy(V, 'HDL');
    return e ? { leitura: examExplain(e, examesComValor(V.exams)), resumo: examSummary(V) } : null;
  });

  c.examSummary = tenta('examSummary', () => examSummary(S));
  c.exameNoProtocolo = tenta('exameNoProtocolo', () => exameNoProtocolo(S));

  saida[nome] = c;
}

/* ⚠️ OS CARIMBOS DE TEMPO SAEM, e isto é o que torna o congelamento
   comparável. A semente é montada a partir de , então duas
   execuções separadas por dois segundos produzem milissegundos
   diferentes — e um diff cheio de linhas de tempo esconde a única linha
   que importa.

   O corte é por GRANDEZA e não por nome de campo: qualquer número acima
   de 10^12 é época em milissegundos, e não existe medida deste
   aplicativo nessa ordem. Assim um campo de tempo que alguém batize de
   outro jeito amanhã continua saindo.

   Data FORMATADA continua entrando, porque aí ela é texto — e texto é o
   que este arquivo existe para vigiar. */
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

/* ⚠️ RELÓGIO TAMBÉM VIAJA DENTRO DE STRING, e o corte por grandeza não
   pegava. As chaves de lista são `peso-1790010721378` — época em
   milissegundos colada num prefixo —, e duas execuções separadas por duas
   horas produziam trezentas linhas de diff que escondiam a única que
   importava.

   ⚠️ E O CORTE É PELA FORMA DA CHAVE, E NÃO POR "TREZE DÍGITOS". A
   primeira versão contava treze dígitos seguidos e apagou um TELEFONE:
   número com DDI tem exatamente treze. Prefixo de letra e hífen é o que
   distingue a chave de qualquer outro número dentro de uma string. */
const EPOCA = /([a-z]-)\d{13}\b/g;

const semTempo = (_k: string, v: unknown) => {
  if (typeof v === 'number' && Math.abs(v) > 1e12) return '<tempo>';
  /* Data em ISO carrega hora e milissegundo, e sai pelo mesmo motivo: um
     Date que virou string ainda é relógio, e não texto escrito para
     alguém ler. Data em PROSA — "segunda, 21 de setembro" — não casa
     aqui, e continua sendo vigiada. */
  if (typeof v === 'string' && ISO.test(v)) return '<tempo>';
  /* Sempre replace, nunca test: um regex com /g guarda o `lastIndex` entre
     chamadas, e `test` alternaria entre achar e não achar a mesma string. */
  if (typeof v === 'string') return v.replace(EPOCA, '$1<tempo>');
  return v;
};

/* Duas casas de indentação: o diff tem de ser legível por humano, porque
   quem julga se uma diferença é erro sou eu. */
console.log(JSON.stringify(saida, semTempo, 2));
