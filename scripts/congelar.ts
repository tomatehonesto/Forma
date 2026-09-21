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

     npx tsx scripts/congelar.ts > antes.json
     …extrai um domínio…
     npx tsx scripts/congelar.ts > depois.json
     diff antes.json depois.json

   Diferença nenhuma é a única saída aceitável. Qualquer linha no diff é um
   erro de extração, não uma melhoria — melhoria de texto é outro commit.

   ⚠️ A DATA ANDA. `now()` é o relógio de verdade, então a saída muda de um
   dia para o outro. Isto compara ANTES e DEPOIS da mesma sessão; não serve
   como arquivo commitado que se confere semanas depois.
   ============================================================ */

import { buildSeed } from '../src/logic/seed';
import {
  todayBrief, journeyGoals, weightCard, canetaAtual, cicloFases,
  rodizioDeLocais, bodyFat, penStock, variacaoDe, resumoDeMovimento,
  periodoDaConsulta, adesao, hungerForecast, enjooAposDormir,
  examCats, examBy, examAbout, examInfluences, examWays, examStatus,
  examExplain, examSummary, exameNoProtocolo,
  patterns, PAT_LABEL, balanceRead, diaFracoDeAgua, janelaDoEnjoo,
  ALVOS, INDICADORES, METAS_PESSOAIS, META_LIVRE, PRAZOS, padraoDe,
  carePending, careState, doseContext, lastMessage, nextConsult,
  contatosDaClinica, fichaDaEquipe, fichaDaClinica,
} from '../src/logic/derive';
import { mensagemDoDia, emPlato } from '../src/logic/etapa';
import { descobertas, descobertaDaHome } from '../src/logic/descobertas';
import { confirmacaoDe } from '../src/logic/confirmacoes';
import { conselhosDaRotina } from '../src/logic/conselhos';
import {
  niveisDoRegistro, combinacao, leituraDoDia, avisosDoDia, lembretesDoDia, marcoDe,
} from '../src/logic/leituras';
import { conquistas } from '../src/logic/conquistas';
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
const CENARIOS: [string, (S: any) => void][] = [
  ['caneta-metrico', () => {}],
  ['caneta-imperial', (S) => { S.profile.sistema = 'imperial'; }],
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

for (const [nome, ajusta] of CENARIOS) {
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
  c.balanceRead = tenta('balanceRead', () => balanceRead(S));
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
const semTempo = (_k: string, v: unknown) => {
  if (typeof v === 'number' && Math.abs(v) > 1e12) return '<tempo>';
  /* Data em ISO carrega hora e milissegundo, e sai pelo mesmo motivo: um
     Date que virou string ainda é relógio, e não texto escrito para
     alguém ler. Data em PROSA — "segunda, 21 de setembro" — não casa
     aqui, e continua sendo vigiada. */
  if (typeof v === 'string' && ISO.test(v)) return '<tempo>';
  return v;
};

/* Duas casas de indentação: o diff tem de ser legível por humano, porque
   quem julga se uma diferença é erro sou eu. */
console.log(JSON.stringify(saida, semTempo, 2));
