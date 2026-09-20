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

import { diffDays, startOfDay, now, nf, doseTxt } from './time';
import {
  todayBrief, doseCycle, janelaDoEnjoo, lastInjection, temDose, M,
} from './derive';
import type { State } from './seed';

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
        chapeu: 'ANTES DE COMEÇAR',
        head: 'Sua primeira aplicação ainda está por vir.',
        body: `Os primeiros dias com ${M(S).mol.toLowerCase()} costumam trazer menos fome e um enjoo leve. Registrar como você se sente desde já é o que dá base de comparação depois.`,
        q: 'O que esperar no dia da aplicação?',
        fonte: 'etapa',
      }
      : {
        chapeu: 'ANTES DE COMEÇAR',
        head: 'Seu tratamento ainda não tem uma dose definida.',
        body: 'Quando sua equipe definir, ela cabe aqui — é a partir dela que montamos o ciclo da semana e os lembretes.',
        q: 'Como funciona o ciclo da medicação?',
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
      chapeu: 'DOSE NOVA',
      head: `Você subiu para ${doseTxt(subiu.para)} ${M(S).unit} nesta semana.`,
      /* A moldura é a mesma; o recheio é dela quando existe. Ver o
         comentário no alto do arquivo. */
      body: jan
        ? `Nos seus registros o enjoo fica em ${nf(jan.perto, 1)} nos dois primeiros dias depois de aplicar e cai para ${nf(jan.longe, 1)} a partir do terceiro. Cada degrau costuma repetir esse desenho.`
        : 'Cada degrau costuma trazer de volta, por alguns dias, o que já tinha passado — o enjoo é o mais comum. Tende a ceder à medida que o corpo se ajusta.',
      q: 'Por que sinto enjoo?',
      fonte: 'etapa',
    };
  }

  /* ---------- 3. a primeira semana ---------- */
  if ((S.injections as any[]).length === 1 && desde <= JANELA_DIAS) {
    return {
      chapeu: 'PRIMEIRA SEMANA',
      head: 'Esta é a sua primeira semana de tratamento.',
      body: 'O corpo ainda está conhecendo o remédio. Enjoo leve, menos fome e um pouco de cansaço são os relatos mais comuns nos primeiros dias, e costumam diminuir com as semanas.',
      q: 'O que esperar no dia da aplicação?',
      fonte: 'etapa',
    };
  }

  return null;
}

/** A fase do ciclo, para quem precisa dela fora da mensagem. */
export const faseDoCiclo = (S: State) => doseCycle(S).phase;
