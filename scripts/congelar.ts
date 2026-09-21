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
