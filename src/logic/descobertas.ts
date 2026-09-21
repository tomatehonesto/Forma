/* ============================================================
   O MOTOR DE DESCOBERTAS DA HOME

   A Home tem UM slot para dizer algo que a pessoa não sabia. Este arquivo
   decide o que entra nele.

   ⚠️ PRODUZIR E ESCOLHER SÃO TRABALHOS DIFERENTES, e é essa separação que
   justifica o arquivo existir. O `patterns()`, no derive, produz: ele
   olha os registros e devolve tudo o que é verdade sobre esta pessoa.
   Aqui se escolhe — e a Home e a aba Insights escolhem DIFERENTE do mesmo
   material, que é a relação certa entre as duas telas:

     · a aba mostra A LISTA, porque a pessoa tocou nela para ver;
     · a Home mostra UMA, porque ninguém pediu.

   Essa assimetria é a régua: a aba pode mostrar um achado fraco, a Home
   não pode. O que não é pedido precisa valer mais.

   ============================================================
   OS TRÊS TIPOS, E POR QUE SÃO TRÊS

   · CRUZAMENTO — o que ela não veria sozinha. "Seu fim de semana funciona
     como outro tratamento" cruza quatro colunas de 56 check-ins. Olha
     para trás.

   · ANTECIPAÇÃO — o mesmo cruzamento virado para a frente. "A sua
     hidratação cai aos domingos" é um achado; no sábado, é um aviso. A
     conta é a mesma, a frase é outra, e a segunda chega na hora em que
     dá para fazer algo a respeito.

   · CONVITE — uma parte do aplicativo que ela ainda não usou. Não fala
     dos dados dela; fala do que falta para os dados existirem.

   ⚠️ O CONVITE É O QUE RESOLVE O PRIMEIRO DIA. Cruzamento precisa de
   semanas de registro, e a Home de quem instalou ontem ficaria vazia —
   ou, pior, preenchida com invenção, que foi exatamente o que aconteceu
   até hoje de manhã. Convite é verdade desde o primeiro segundo: ou ela
   tem uma meta, ou não tem. Nada a estimar.

   ⚠️ E CONVITE NÃO É RECOMENDAÇÃO. O `recommendations()` já existe e é
   outra coisa: tarefa para hoje, no imperativo, com prazo. Convite não
   tem prazo e não cobra — mostra uma porta e diz para que ela serve. Se
   os dois falassem no mesmo tom, a Home teria duas listas de pendência,
   que é o problema que este projeto passou a semana inteira desfazendo.
   ============================================================ */

import { DAY, startOfDay, now, diffDays, nf } from './time';
import {
  patterns, nota, diaFracoDeAgua, janelaDoEnjoo, hungerForecast,
  clinicaConectada, litros, CUP_ML, M, temDose,
  type Pattern,
} from './derive';
import type { State } from './seed';
import { aguaTxt } from './medidas';

export type TipoDescoberta = 'cruzamento' | 'antecipacao' | 'convite';

export type Descoberta = {
  /* A identidade, e ela precisa mudar quando o CONTEÚDO muda: se a
     hidratação passa a cair às terças em vez de aos domingos, é outra
     descoberta e a pessoa merece vê-la de novo. Por isso o id carrega um
     pedaço do que a frase diz, e não só a categoria. */
  id: string;
  tipo: TipoDescoberta;
  ic: string;
  /* A palavra pequena em cima, que avisa que tipo de coisa vem abaixo. */
  chapeu: string;
  titulo: string;
  texto: string;
  cta: string;
  to: string;
  /* Quanto vale antes da memória entrar na conta. */
  nota: number;
};

const slug = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

/* ============================================================
   1. CRUZAMENTOS — o que o patterns() já sabe, filtrado para a Home
   ============================================================ */

/* ⚠️ DOIS CORTES, E OS DOIS SÃO A RÉGUA MAIS ALTA DA HOME.

   `forca` ausente quer dizer "não é descoberta, é retrato": os dois
   últimos do patterns() descrevem um número que a pessoa JÁ VÊ na Home —
   o ritmo de perda, a adesão. Repetir na Home o que a Home mostra três
   dedos acima é gastar o slot com eco.

   `surpresa >= 2` tira o achado correto e óbvio. "Sua proteína subiu 12%"
   é verdade e tem força, mas quem registra proteína todo dia já sabe: o
   slot da Home é para o que ela NÃO veria sozinha. Na aba ele continua. */
const CORTE_SURPRESA = 2;

function cruzamentos(S: State): Descoberta[] {
  return patterns(S)
    .filter((p: Pattern) => p.forca != null && p.surpresa >= CORTE_SURPRESA)
    .map((p: Pattern) => ({
      id: `cruz:${p.key}:${slug(p.titulo)}`,
      tipo: 'cruzamento' as const,
      ic: p.ic,
      chapeu: 'DESCOBERTA',
      titulo: p.titulo,
      /* ⚠️ SÓ A PRIMEIRA FRASE. O `texto` do pattern foi escrito para o
         cartão da aba, onde cabem três linhas e a conclusão vem depois do
         número. No herói da Home cabe uma frase, e a primeira é sempre a
         que carrega a evidência — as seguintes concluem, e a conclusão
         inteira está a um toque de distância, no cartão. */
      texto: p.texto.split(/(?<=\.)\s/)[0],
      cta: 'Ver a descoberta',
      to: '/insights',
      nota: nota(p),
    }));
}

/* ============================================================
   2. ANTECIPAÇÕES — o mesmo cruzamento, virado para a frente
   ============================================================ */

/* ⚠️ TODA ANTECIPAÇÃO AQUI SAI DE UMA CONTA QUE JÁ EXISTIA, e nenhuma
   delas prevê nada de novo. Isso é de propósito: prever é onde um
   aplicativo de saúde começa a inventar. O que estas fazem é pegar um
   padrão MEDIDO nos registros da pessoa e dizer em que dia ele volta.

   Por isso cada uma tem uma janela curta de validade. Fora da janela não
   é antecipação, é curiosidade — e curiosidade compete mal com um
   cruzamento forte. */
function antecipacoes(S: State): Descoberta[] {
  const out: Descoberta[] = [];
  const hoje = now();

  /* --- o vale da dose ---
     hungerForecast lê a curva farmacológica e devolve o ponto mais baixo
     antes da próxima aplicação. Só existe quando há aplicação no
     passado: linha reta não tem vale. */
  const hf = temDose(S) ? hungerForecast(S) : null;
  if (hf && hf.inDays >= 0 && hf.inDays <= 3) {
    out.push({
      id: `ant:vale:${Math.round(hf.when.getTime() / DAY)}`,
      tipo: 'antecipacao',
      ic: 'drop2',
      chapeu: 'O QUE VEM',
      titulo: hf.inDays === 0
        ? 'A fome tende a apertar hoje'
        : `A fome tende a apertar ${hf.inDays === 1 ? 'amanhã' : `em ${hf.inDays} dias`}`,
      texto: `É quando o nível da ${M(S).mol.toLowerCase()} chega ao ponto mais baixo do ciclo, pouco antes da próxima aplicação. Passa sozinho quando você aplicar.`,
      cta: 'Ver o ciclo',
      to: '/aplicacoes',
      nota: 3,
    });
  }

  /* --- a véspera do dia fraco de água ---
     O mesmo cruzamento que na aba é "a sua hidratação cai aos domingos".
     Aqui ele chega no sábado, que é quando ainda dá para fazer algo. */
  const fraco = diaFracoDeAgua(S);
  if (fraco && (hoje.getDay() + 1) % 7 === fraco.dia) {
    out.push({
      id: `ant:agua:${fraco.dia}`,
      tipo: 'antecipacao',
      ic: 'water',
      chapeu: 'O QUE VEM',
      titulo: 'Amanhã costuma ser o seu dia mais seco',
      texto: `Nos seus registros a hidratação cai para ${aguaTxt(S, fraco.dele * CUP_ML)} ${fraco.nome}, contra ${aguaTxt(S, fraco.outros * CUP_ML)} nos outros dias. Saber disso na véspera é meio caminho.`,
      cta: 'Ver a hidratação',
      to: '/agua',
      nota: 2.6,
    });
  }

  /* --- a janela do enjoo, no dia em que ela abre ---
     ⚠️ A FRASE É SOBRE O FIM DA JANELA, E NÃO SOBRE O ENJOO. Dizer "você
     vai enjoar nas próximas 48 h" é anunciar o sintoma para quem talvez
     não fosse tê-lo — e é o aplicativo piorando o dia de alguém com uma
     previsão. O que vale dizer é o que os registros dela mostram e que
     ninguém conta: que isso ACABA, e mais ou menos quando. */
  const jan = janelaDoEnjoo(S);
  const ultima = (S.injections as any[]).length
    ? Math.max(...(S.injections as any[]).map((i) => +startOfDay(new Date(i.t))))
    : null;
  const desdeUltima = ultima == null ? null : diffDays(hoje, new Date(ultima));
  if (jan && desdeUltima != null && desdeUltima >= 0 && desdeUltima <= 1) {
    out.push({
      id: `ant:enjoo:${ultima}`,
      tipo: 'antecipacao',
      ic: 'waves',
      chapeu: 'O QUE VEM',
      titulo: 'Se o enjoo aparecer agora, ele tem hora para passar',
      texto: `Nos seus registros ele fica em ${nf(jan.perto, 1)} nos dois primeiros dias depois da aplicação e cai para ${nf(jan.longe, 1)} a partir do terceiro. São as 48 h de cada ciclo, não o tratamento inteiro.`,
      cta: 'Ver os sintomas',
      to: '/sintomas',
      nota: 3,
    });
  }

  return out;
}

/* ============================================================
   3. CONVITES — o que ela ainda não usou
   ============================================================ */

/* ⚠️ A NOTA AQUI É AUTORAL, e não tem como não ser: não há evidência para
   medir num convite. Ela é a resposta a "o quanto esta parte muda o
   tratamento", e a ordem diz o que este aplicativo acha que importa —
   saber aonde se quer chegar vem antes de tudo.

   ⚠️ E O CONVITE SE APOSENTA. Três vezes e some, mesmo que ela nunca
   aceite. Um aplicativo que repete o mesmo convite pela sétima vez parou
   de convidar e passou a cobrar, e a diferença entre as duas coisas é o
   número de vezes. */
const TETO_CONVITE = 3;

function convites(S: State): Descoberta[] {
  const out: Descoberta[] = [];
  const poe = (
    id: string, ic: string, titulo: string, texto: string,
    cta: string, to: string, nota: number,
  ) => out.push({ id: `conv:${id}`, tipo: 'convite', ic, chapeu: 'UM CONVITE', titulo, texto, cta, to, nota });

  if (!(S.goals as any[]).length) poe(
    'meta', 'target',
    'Você ainda não disse aonde quer chegar',
    'Uma meta sua — caber numa calça, voltar à praia, largar um hábito. Guardamos para você, e quem marca quando chega é você.',
    'Criar uma meta', '/meta', 3,
  );

  if ((S.measures as any[]).length <= 1) poe(
    'medidas', 'ruler',
    'A balança conta só uma parte',
    'A fita métrica conta a outra: cintura e quadril mudam quando o peso empaca, e é aí que ela mostra que algo está acontecendo.',
    'Registrar medidas', '/medir-medidas', 2.6,
  );

  if (!(S.meals as any[]).length) poe(
    'refeicao', 'soup',
    'A proteína do dia pode se contar sozinha',
    'Registrando o que você come, a conta do dia sai pronta — sem tabela, sem somar nada de cabeça.',
    'Registrar uma refeição', '/registrar', 2.5,
  );

  if (!(S.exams as any[]).length) poe(
    'exames', 'lab',
    'Os seus exames cabem aqui',
    'Com eles guardados, dá para ver a linha de cada marcador ao longo do tratamento — e levar tudo organizado para a consulta.',
    'Guardar um exame', '/exames', 2.2,
  );

  if (!clinicaConectada(S)) poe(
    'clinica', 'steth',
    'A sua clínica pode ficar deste lado',
    'Com o código que ela te deu, a sua equipe aparece aqui e as orientações dela param de se perder no meio das mensagens.',
    'Usar o código', '/codigo', 2,
  );

  return out;
}

/* ============================================================
   4. A MEMÓRIA, E O PESO QUE ELA DÁ
   ============================================================ */

export type VistaEm = Record<string, {
  /* O primeiro dia da temporada atual: é ele que conta a posse. */
  desde: number;
  /* O último dia em que foi mostrada: é ele que diz se a temporada
     ainda é a mesma ou se já acabou. */
  em: number;
  /* Quantas TEMPORADAS, e não quantos dias — o teto do convite conta
     aparições, e três dias seguidos são uma aparição só. */
  vezes: number;
}>;

export const descobertasVistas = (S: State): VistaEm =>
  ((S as any).descobertasVistas ?? {}) as VistaEm;

/* Um dia sem abrir o aplicativo não encerra a temporada: quem pula o
   sábado volta no domingo e continua vendo a mesma descoberta, que é o
   que ela esperaria. Dois dias, aí sim, é outra temporada. */
const FOLGA_DIAS = 1;

/** A marca de que esta descoberta foi para a tela. Chamada pela Home
    quando ela monta — ver o comentário em `descobertaDaHome`. */
export const marcarDescobertaVista = (S: any, id: string) => {
  const m: VistaEm = S.descobertasVistas ?? (S.descobertasVistas = {});
  const hoje = +startOfDay(now());
  const antes = m[id];
  /* Duas aberturas no mesmo dia são a mesma exibição: senão o teto de
     três aparições do convite queimaria numa tarde de quem abre o
     aplicativo seis vezes. */
  if (antes && +startOfDay(new Date(antes.em)) === hoje) return;
  const nova = !antes || diffDays(now(), new Date(antes.em)) > FOLGA_DIAS;
  m[id] = {
    desde: nova ? hoje : antes!.desde,
    em: +now(),
    vezes: (antes?.vezes ?? 0) + (nova ? 1 : 0),
  };
};

/* ⚠️ OS DOIS JEITOS DE ERRAR SÃO OPOSTOS, e o desenho tem de evitar os
   dois ao mesmo tempo:

   · SE NADA SEGURA O SLOT, a Home troca de descoberta todo dia. A de
     ontem sai porque já foi vista, entra a segunda melhor, e no dia
     seguinte a terceira. Um achado que dura um dia não parece observado,
     parece gerado — e o valor inteiro desta tela é parecer que alguém
     olhou.

   · SE NADA SAI, a Home congela no mesmo cartão por semanas e ele vira
     papel de parede. A pessoa deixa de ler antes de deixar de ver.

   POSSE, e depois volta. Uma descoberta escolhida fica com o slot por
   POSSE_DIAS contados do PRIMEIRO dia da temporada. Depois ela sai e
   sobe de volta ao longo de VOLTA_DIAS — porque um bom achado continua
   sendo verdade, e daqui a três semanas ele merece ser dito de novo. A
   Home não precisa inventar verdade nova para se manter interessante;
   precisa lembrar na hora certa.

   ⚠️ A POSSE CONTA DO `desde`, E NÃO DO `em`, e a diferença é um laço
   infinito. Contada do último dia em que apareceu, ela se renovava
   sozinha: a descoberta ia para a tela, a marca ia para hoje, no dia
   seguinte a posse estava fresca de novo. Foi o que a primeira versão
   deste arquivo fez — doze dias simulados, doze vezes a mesma frase. */
const POSSE_DIAS = 3;
const VOLTA_DIAS = 21;

/** O dia em que a temporada desta descoberta termina. */
const fimDaPosse = (v: VistaEm[string]) => +startOfDay(new Date(v.desde)) + POSSE_DIAS * DAY;

const peso = (d: Descoberta, m: VistaEm) => {
  const v = m[d.id];
  if (!v) return 1;
  if (d.tipo === 'convite' && v.vezes >= TETO_CONVITE) return 0;
  const dias = diffDays(now(), new Date(fimDaPosse(v)));
  return dias < 0 ? 1 : Math.min(1, dias / VOLTA_DIAS);
};

/* ============================================================
   5. A ESCOLHA
   ============================================================ */

/** Tudo o que é verdade e caberia na Home, da melhor para a pior. */
export function descobertas(S: State): Descoberta[] {
  const m = descobertasVistas(S);
  return [...cruzamentos(S), ...antecipacoes(S), ...convites(S)]
    .map((d) => ({ d, n: d.nota * peso(d, m) }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n)
    .map((x) => x.d);
}

/** A descoberta da Home, ou nada.

    ⚠️ NADA É UMA RESPOSTA. Quando não há cruzamento com força, nem
    momento chegando, nem parte por explorar, o carrossel da Home fica com
    um slide a menos — igual ao slide de aplicação de quem não tem dose. É
    melhor que a alternativa, e a alternativa tem nome: foi o que este
    aplicativo fez até hoje de manhã, quando a Home de quem tinha acabado
    de instalar anunciava uma descoberta sobre o enjoo que essa pessoa
    nunca registrou.

    ⚠️ E QUEM ESCOLHE NÃO GRAVA. Esta função é pura: a Home a chama a cada
    render, e gravar aqui seria escrever no estado no meio de um desenho
    de tela. A marca fica com `marcarDescobertaVista`, chamada uma vez
    quando a Home monta — o mesmo desenho que `marcarComoVistas` já usa
    para as conquistas. */
export function descobertaDaHome(S: State): Descoberta | null {
  const posse = comPosse(S);
  return posse ?? descobertas(S)[0] ?? null;
}

/** A que está com o slot na mão, se ainda for verdade.

    O "se ainda for verdade" é o que impede a posse de virar mentira: uma
    antecipação cuja véspera passou some da lista de candidatos, e aí a
    posse dela não vale nada. Por isso a posse é procurada DENTRO dos
    candidatos de hoje, e não na memória. */
function comPosse(S: State): Descoberta | null {
  const m = descobertasVistas(S);
  for (const d of [...cruzamentos(S), ...antecipacoes(S), ...convites(S)]) {
    const v = m[d.id];
    if (!v) continue;
    if (d.tipo === 'convite' && v.vezes >= TETO_CONVITE) continue;
    if (diffDays(now(), new Date(fimDaPosse(v))) < 0) return d;
  }
  return null;
}
