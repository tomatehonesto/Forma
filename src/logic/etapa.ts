/* ============================================================
   A MENSAGEM DO DIA, E OS DOIS RELÓGIOS QUE ELA LÊ

   O primeiro slide da Home responde "como está hoje". Até aqui ele lia um
   relógio só: o CICLO DA SEMANA — dia 1 a 7 entre uma aplicação e a
   seguinte, com cinco frases fixas, uma por fase.

   Falta o outro relógio, e ele é mais lento: ONDE NO TRATAMENTO. A
   primeira semana de quem nunca aplicou nada não é a mesma coisa que a
   décima primeira de quem está estável, e a semana em que a dose sobe não
   é uma semana qualquer — é a que traz de volta, por alguns dias, o que
   já tinha passado.

   ⚠️ AS ETAPAS PREEMPTAM O CICLO, e não se somam a ele. Um dia é dia 3 do
   ciclo E primeira semana de tratamento ao mesmo tempo, e as duas frases
   são verdadeiras; só uma cabe. Ganha a etapa, porque ela é a notícia:
   "dia 3 de 7, o efeito está constante" é o que acontece toda semana,
   enquanto "você subiu de dose" acontece cinco ou seis vezes no
   tratamento inteiro. Quando nenhuma etapa está acontecendo, o ciclo
   volta a falar, que é o seu trabalho nas outras cinquenta semanas.

   ⚠️ E POR ISSO O PLATÔ TEM PRAZO. As três primeiras etapas são EVENTOS:
   acontecem, valem uma semana e passam. Platô e manutenção são ESTADOS —
   duram meses — e um estado que preempta o ciclo faria a Home repetir a
   mesma frase por trinta dias seguidos, que é como um cartão vira papel
   de parede. Os dois só falam enquanto são NOTÍCIA: platô, entre a quarta
   e a sétima semana parada; manutenção, do primeiro mês na faixa em
   diante, e o ciclo assume quando ela deixa de ser novidade.

   ============================================================
   PADRÃO E PERSONALIZADA NÃO SÃO DUAS FAMÍLIAS

   ⚠️ São a MOLDURA e o RECHEIO. A moldura é padrão: existe para todo
   mundo, sempre, e é ela que garante que a Home tenha o que dizer no
   primeiro dia. O recheio é a pessoa — e entra quando existe.

   "Cada degrau costuma trazer o enjoo de volta por alguns dias" é a
   moldura. Para quem já tem registros, a mesma frase vira "nos seus
   registros o enjoo fica em 1,8 nos dois primeiros dias e cai para 1,0 a
   partir do terceiro". Mesma etapa, mesma intenção, e a segunda fala da
   pessoa em vez de falar de pacientes em geral.

   Isso é diferente da DESCOBERTA, que mora em descobertas.ts e é o outro
   slide: lá, o dado É a notícia, e sem dado não há slide. Aqui o dado
   melhora uma notícia que existiria de qualquer jeito.

   ⚠️ ESTE ARQUIVO FICA ACIMA DO derive, e nunca o contrário. Ele lê
   `todayBrief`, `janelaDoEnjoo` e `doseCycle`; se o derive importasse de
   volta, o ciclo de imports fecharia. É o mesmo desenho de
   descobertas.ts: uma camada que ESCOLHE, sobre uma que CALCULA.
   ============================================================ */

import { DAY, diffDays, startOfDay, now, nf, doseTxt } from './time';
import {
  todayBrief, doseCycle, janelaDoEnjoo, lastInjection, temDose, M, pesoDeReferencia,
} from './derive';
import type { State } from './seed';
import { T } from '../textos';
import { pesoTxt } from './medidas';

export type Mensagem = {
  chapeu: string;
  head: string;
  body: string;
  q: string;
  /* De onde a frase veio — a Home não usa, mas um teste e a próxima
     pessoa a mexer nisto usam, e é a diferença entre "hoje é uma
     semana especial" e "hoje é terça". */
  fonte: 'etapa' | 'ciclo';
};

/** Há quantos dias foi a última aplicação, ou null se não houve nenhuma. */
const diasDesdeUltima = (S: State) => {
  const li = lastInjection(S);
  return li ? diffDays(now(), startOfDay(new Date(li.t))) : null;
};

/** A aplicação em que a dose mudou, se a mudança foi a última que houve. */
function subiuDeDose(S: State) {
  const injs = (S.injections as any[]).slice().sort((a, b) => a.t - b.t);
  if (injs.length < 2) return null;
  const ultima = injs[injs.length - 1], anterior = injs[injs.length - 2];
  if (ultima.dose === anterior.dose) return null;
  return { de: anterior.dose, para: ultima.dose, t: ultima.t };
}

/* ============================================================
   O PESO PARADO, E OS DOIS NÚMEROS QUE ALGUÉM TEVE DE ESCOLHER

   ⚠️⚠️ ESTES LIMIARES SÃO ESCOLHA, NÃO MEDIDA — estão no PENDENCIAS para
   revisão de quem entende. O aplicativo não tem como derivá-los dos
   dados: "quanto tempo parada é um platô" é pergunta clínica, e a
   resposta muda com a fase do tratamento e com a pessoa.

   O que está escrito aqui, e por quê:

   · QUATRO SEMANAS. Menos que isso é ruído: o próprio aplicativo diz, na
     tela de evolução, que variações de um a dois quilos acontecem por
     água, sal e intestino sem nada ter mudado na gordura. Uma quinzena
     parada não é um platô, é uma quinzena.

   · MEIO QUILO. É o quanto o peso pode ter caído em quatro semanas e
     ainda assim contar como parado — cerca de 125 g por semana, bem
     abaixo de qualquer ritmo terapêutico.

   · E A COMPARAÇÃO É ENTRE MÉDIAS, nunca entre duas pesagens. Duas
     pesagens comparam dois dias, e dois dias é onde a água mora. A média
     tira isso da conta — e é por isso que cada janela exige DUAS
     pesagens para valer.

   · A LARGURA DA JANELA SE AJUSTA A QUEM SE PESA POUCO. Eram sete dias
     fixos, e quem se pesa uma vez por semana nunca tinha duas pesagens
     em sete dias: essa pessoa não recebia platô nem manutenção, nunca.
     Não era limiar conservador, era ponto cego.

     Agora a janela tenta sete dias e, se não couberem duas pesagens nas
     DUAS pontas, tenta catorze. Quem se pesa toda semana passa a ter
     duas pesagens por janela, e elas ficam a sete dias uma da outra —
     que é justamente a independência de que a média precisa, porque a
     água de uma terça não é a água da terça seguinte.

     ⚠️ A LARGURA É A MESMA NAS DUAS PONTAS, sempre. Comparar uma média
     de sete dias com uma de catorze é comparar dois alisamentos
     diferentes e chamar a diferença de perda de peso.

     ⚠️ E A DISTÂNCIA ENTRE AS PONTAS NÃO MUDA: as duas janelas crescem
     para trás a partir do próprio fim, então os centros continuam a 28
     dias um do outro. É o que deixa o meio quilo querer dizer a mesma
     coisa nos dois casos.

     ⚠️ QUEM SE PESA DE QUINZE EM QUINZE CONTINUA DE FORA, e é honesto:
     com duas pesagens no mês inteiro não dá para separar platô de água.
     Catorze dias é o limite porque, além dele, a janela de "agora"
     passaria a incluir peso de três semanas atrás e deixaria de ser
     agora.

     A leitura de quem se pesa semanalmente é mais ruidosa que a de quem
     se pesa todo dia — média de duas medidas contra média de sete. Isto
     está no PENDENCIAS junto com os limiares.
   ============================================================ */
const PLATO_SEMANAS = 4;
const PLATO_KG = 0.5;
/* Depois de tantas semanas, peso parado deixou de ser notícia e passou a
   ser a situação dela: o ciclo volta a falar, porque é ele que ajuda no
   dia a dia. Ver o comentário sobre preempção no alto do arquivo. */
const PLATO_VELHO_SEMANAS = 7;

/* Duas pesagens é o mínimo para uma janela valer; sete dias é a largura
   que se tenta primeiro, catorze é a rede para quem se pesa uma vez por
   semana. Ver a nota das janelas no alto do arquivo. */
const MIN_PESAGENS = 2;
const LARGURAS_DIAS = [7, 14];

/** As pesagens de uma janela de `largura` dias que terminou há `semanasAtras`
    semanas. */
function pesagensDaJanela(S: State, semanasAtras: number, largura: number) {
  const fim = +startOfDay(now()) - semanasAtras * 7 * DAY;
  const ini = fim - largura * DAY;
  return (S.weights as any[]).filter((w) => w.t > ini && w.t <= fim + DAY);
}

/** A menor largura que serve às DUAS pontas da comparação, ou null quando
    nenhuma serve. */
function larguraQueServe(S: State, atras: number): number | null {
  for (const l of LARGURAS_DIAS) {
    if (pesagensDaJanela(S, 0, l).length >= MIN_PESAGENS
      && pesagensDaJanela(S, atras, l).length >= MIN_PESAGENS) return l;
  }
  return null;
}

/** A média das pesagens de uma janela — ou null quando não há duas ali. */
function mediaDaJanela(S: State, semanasAtras: number, largura: number): number | null {
  const ws = pesagensDaJanela(S, semanasAtras, largura);
  return ws.length >= MIN_PESAGENS ? ws.reduce((s, w) => s + w.kg, 0) / ws.length : null;
}

/** Quanto o peso caiu entre a janela de `atras` semanas atrás e a de agora.
    Positivo é perda. null quando falta pesagem de um dos lados. */
function quedaEm(S: State, atras: number): number | null {
  const l = larguraQueServe(S, atras);
  if (l == null) return null;
  const agora = mediaDaJanela(S, 0, l), antes = mediaDaJanela(S, atras, l);
  return agora == null || antes == null ? null : antes - agora;
}

/* ⚠️⚠️ ISTO ERA UM `if` DENTRO DA MENSAGEM DO DIA, e virou função porque
   passou a ter um segundo leitor: a confirmação de uma pesagem, que
   oferece a fita métrica justamente em platô (ver logic/confirmacoes).

   Duas telas dizendo "platô" a partir de duas contas parecidas é o
   defeito que este código já teve em outros lugares — a Home anunciando
   um padrão que a tela de Insights considerava fraco demais para
   mostrar. Aqui a conta é uma só, e quem discordar discorda dela.

   ⚠️ E NÃO É SÓ "PAROU": é "parou E ainda é notícia". Parado há muito
   tempo deixou de ser novidade e passou a ser a situação dela — e quem
   começou a se pesar há cinco semanas não tem como saber se começou
   agora. Nos dois casos não se diz nada. */
/* ⚠️ DEVOLVE OS NÚMEROS, e não um sim ou não — porque o cartão do platô
   mostra os dois pesos que ele comparou. Deixar a tela recalcular a média
   por conta própria seria escolher a largura da janela duas vezes, e
   bastaria uma pesagem nova entre as duas contas para o cartão exibir
   números que ninguém comparou. */
export function emPlato(S: State): { antes: number; agora: number } | null {
  const queda = quedaEm(S, PLATO_SEMANAS);
  const quedaVelha = quedaEm(S, PLATO_VELHO_SEMANAS);
  const parado = queda != null && queda < PLATO_KG;
  const aindaENoticia = quedaVelha == null || quedaVelha >= PLATO_KG;
  if (!parado || !aindaENoticia) return null;

  const l = larguraQueServe(S, PLATO_SEMANAS)!;
  const agora = mediaDaJanela(S, 0, l), antes = mediaDaJanela(S, PLATO_SEMANAS, l);
  return agora == null || antes == null ? null : { antes, agora };
}

/* Uma etapa vale por uma semana — o tempo de um ciclo inteiro, que é
   quanto o corpo leva para responder ao degrau novo. Depois disso a
   semana volta a ser uma semana, e o ciclo volta a falar. */
const JANELA_DIAS = 7;

export function mensagemDoDia(S: State): Mensagem {
  const etapa = daEtapa(S);
  if (etapa) return etapa;

  /* Sem etapa acontecendo, o ciclo. `todayBrief` já devolve o chapéu
     certo: DIA x DE y quando há ciclo, PARA HOJE quando não há. */
  const b = todayBrief(S);
  return { chapeu: b.chapeu, head: b.head, body: b.body, q: b.q, fonte: 'ciclo' };
}

function daEtapa(S: State): Mensagem | null {
  const desde = diasDesdeUltima(S);

  /* ---------- 1. ainda não começou ----------
     A Home de quem terminou o cadastro e ainda não aplicou não tem ciclo
     nenhum para ler: `doseCycle` usaria hoje como data da última dose e
     diria "dia 1 de 7" para quem nunca aplicou nada. */
  if (desde == null) {
    return temDose(S)
      ? {
        chapeu: T.etapa.antesChapeu,
        head: T.etapa.antesComDoseHead,
        body: T.etapa.antesComDoseBody(M(S).mol.toLowerCase()),
        q: T.etapa.antesComDoseQ,
        fonte: 'etapa',
      }
      : {
        chapeu: T.etapa.antesChapeu,
        head: T.etapa.antesSemDoseHead,
        body: T.etapa.antesSemDoseBody,
        q: T.etapa.antesSemDoseQ,
        fonte: 'etapa',
      };
  }

  /* ---------- 2. a dose subiu ----------
     ⚠️ ANTES DA PRIMEIRA SEMANA na ordem, de propósito: quem sobe de dose
     na segunda aplicação está nas duas etapas, e o degrau é a notícia
     maior — é ele que explica por que o enjoo voltou depois de ter
     passado. */
  const subiu = subiuDeDose(S);
  if (subiu && desde <= JANELA_DIAS) {
    const jan = janelaDoEnjoo(S);
    return {
      chapeu: T.etapa.doseNovaChapeu,
      head: T.etapa.doseNovaHead(doseTxt(subiu.para), M(S).unit),
      /* A moldura é a mesma; o recheio é dela quando existe. Ver o
         comentário no alto do arquivo, e a nota da mensagem em
         textos/pt-BR/etapa. */
      body: jan
        ? T.etapa.doseNovaBodyCom(nf(jan.perto, 1), nf(jan.longe, 1))
        : T.etapa.doseNovaBodySem,
      q: T.etapa.doseNovaQ,
      fonte: 'etapa',
    };
  }

  /* ---------- 3. a primeira semana ---------- */
  if ((S.injections as any[]).length === 1 && desde <= JANELA_DIAS) {
    return {
      chapeu: T.etapa.primeiraChapeu,
      head: T.etapa.primeiraHead,
      body: T.etapa.primeiraBody,
      q: T.etapa.primeiraQ,
      fonte: 'etapa',
    };
  }

  /* ---------- 4. manutenção ----------
     ⚠️ ANTES DO PLATÔ, E A ORDEM É O ASSUNTO INTEIRO. Peso parado em quem
     chegou à meta e peso parado em quem ainda está longe dela são o mesmo
     número e notícias opostas: uma é o objetivo, a outra é uma pergunta
     para a consulta. Chamar de platô quem chegou onde queria chegar seria
     o aplicativo transformando a conquista dela em problema. */
  const larguraDoMes = larguraQueServe(S, PLATO_SEMANAS);
  const agora = larguraDoMes == null ? null : mediaDaJanela(S, 0, larguraDoMes);
  /* ⚠️ O ÚNICO LUGAR DO APLICATIVO QUE PREFERE A RÉGUA DA EQUIPE.

     Manutenção é um ESTADO CLÍNICO: estar na faixa que a equipe definiu é
     um fato sobre o tratamento; estar na que a pessoa escolheu no
     cadastro é um fato sobre o desejo dela. As duas merecem existir, e só
     uma responde "o tratamento chegou onde queria chegar".

     A Jornada continua medindo contra a meta DELA, e é de propósito: a
     viagem é dela, e repontar o destino em silêncio mudaria o que todas
     as telas dizem sobre o progresso sem que ela tivesse pedido nada. */
  const ref = pesoDeReferencia(S);
  const naMeta = agora != null && ref.kg > 0 && agora <= ref.kg + 0.5;
  const jaEstavaNaMeta = (() => {
    const antes = larguraDoMes == null ? null : mediaDaJanela(S, PLATO_SEMANAS, larguraDoMes);
    return antes != null && ref.kg > 0 && antes <= ref.kg + 0.5;
  })();
  if (naMeta && jaEstavaNaMeta) {
    return {
      chapeu: T.etapa.manutencaoChapeu,
      /* A procedência entra na frase, sempre — ver o comentário no alto de
         meta-clinica.tsx, e a nota da mensagem em textos/pt-BR/etapa. */
      head: ref.daEquipe ? T.etapa.manutencaoHeadEquipe : T.etapa.manutencaoHeadDela,
      body: T.etapa.manutencaoBody(
        pesoTxt(S, agora!), pesoTxt(S, ref.kg), ref.daEquipe ? ref.por : null,
      ),
      q: T.etapa.manutencaoQ,
      fonte: 'etapa',
    };
  }

  /* ---------- 5. platô ---------- */
  const plato = emPlato(S);
  if (plato) {
    const { antes, agora } = plato;
    return {
      chapeu: T.etapa.platoChapeu,
      head: T.etapa.platoHead,
      /* ⚠️ A DECISÃO DE QUAL DAS DUAS FRASES USAR É DAQUI, e o texto delas
         é de textos/pt-BR/etapa — onde está escrito por que a explicação
         vem antes de qualquer sugestão, e por que não há sugestão.

         A condição fica aqui porque é ARITMÉTICA: quando os dois números
         arredondam para o mesmo, dizer os dois parece defeito de código. A
         conta é do idioma que arredonda, não do que escreve. */
      body: nf(antes, 1) === nf(agora, 1)
        ? T.etapa.platoBodyIgual(pesoTxt(S, agora))
        : T.etapa.platoBodyDois(pesoTxt(S, antes), pesoTxt(S, agora)),
      q: T.etapa.platoQ,
      fonte: 'etapa',
    };
  }

  return null;
}

/** A fase do ciclo, para quem precisa dela fora da mensagem. */
export const faseDoCiclo = (S: State) => doseCycle(S).phase;
