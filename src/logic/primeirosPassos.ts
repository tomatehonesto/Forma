import type { State } from './seed';
import type { Permissao } from './avisos';
import { startOfDay } from './time';
import { respostaNoDia } from './derive';
import { FORMAS, formaDe } from './formas';
import { T } from '../textos';

/* ============================================================
   OS PRIMEIROS PASSOS — o que a pessoa ainda configura, lido do estado
   (docs/superpowers/specs/2026-09-26-primeiros-passos-design.md)

   ⚠️ CADA ITEM É UMA LEITURA, e não uma caixinha. É a regra do preparo da
   consulta (`ItemDoPreparo`, em logic/derive): o item não pergunta,
   responde, e o toque leva para onde a resposta muda. O que o aplicativo
   não tem como saber não entra — "já comprei a caneta" não vira item.

   ⚠️ A PERMISSÃO E O APARELHO ENTRAM DE FORA. Os dois são do telefone, e
   não do diário: a permissão muda nos ajustes do sistema, e a leitura dela
   é assíncrona. Esta função recebe os dois já lidos, e por isso roda em
   node, na sonda (scripts/primeiros-passos.ts).

   ⚠️ O CHECK-IN É O DIA COM RESPOSTA, e não o dia com registro. O mesmo
   `checkins` guarda a água e a proteína do dia, e um copo d'água não pode
   marcar "fiz o primeiro check-in" — é a regra de `respostaNoDia`.
   ============================================================ */

export type PassoId = 'plano' | 'aplicacao' | 'checkin' | 'lembretes' | 'saude';

export type Passo = {
  id: PassoId;
  ic: string;
  titulo: string;
  /** o porquê, numa linha; o item pronto não o mostra */
  sub?: string;
  pronto: boolean;
  /** para onde o toque leva — o plano não leva a lugar nenhum */
  to?: string;
};

export type DoAparelho = {
  permissao: Permissao;
  /** o depósito de saúde do sistema (`aparelhoDaVez`), ou nulo no navegador */
  aparelho: { id: string; nome: string } | null;
};

const K = () => T.home.primeirosPassos;

/* A ORDEM É A DO PRIMEIRO DIA: o plano, que já está feito, abre a lista em
   "1 de 5" e não em zero; depois o que conta o tratamento (a aplicação), o
   que conta o dia (o check-in), e por fim o que deixa o resto automático
   (os lembretes e a saúde do aparelho). */
export function passos(S: State, { permissao, aparelho }: DoAparelho): Passo[] {
  /* Quem toma comprimido registra a primeira dose, e não a primeira
     aplicação — a forma decide a palavra e o desenho (logic/formas). */
  const injetavel = FORMAS()[formaDe(S)].injetavel;
  const lista: Passo[] = [
    { id: 'plano', ic: 'target', titulo: K().plano, pronto: true },
    {
      id: 'aplicacao', ic: injetavel ? 'syringe' : 'pill', titulo: K().aplicacao(injetavel), sub: K().aplicacaoSub,
      pronto: (S.injections?.length ?? 0) > 0, to: '/aplicacao',
    },
    {
      id: 'checkin', ic: 'mood', titulo: K().checkin, sub: K().checkinSub,
      pronto: ((S.checkins ?? []) as any[]).some(respostaNoDia), to: '/checkin',
    },
  ];
  /* Sem aviso possível (o navegador), não há o que permitir. */
  if (permissao !== 'indisponivel') {
    lista.push({
      id: 'lembretes', ic: 'bell', titulo: K().lembretes, sub: K().lembretesSub,
      pronto: permissao === 'concedida', to: '/lembretes',
    });
  }
  /* Só o depósito do sistema em que o app roda — ver logic/integracoes. */
  if (aparelho) {
    lista.push({
      id: 'saude', ic: 'heart', titulo: K().saude(aparelho.nome), sub: K().saudeSub,
      pronto: !!(S as any).integrations?.[aparelho.id], to: '/integracoes',
    });
  }
  return lista;
}

/* ============================================================
   AS DUAS MARCAS

   Moram em `apresentacoesVistas`, o mapa que já sobe na parte `vistos` da
   sincronia (logic/traducao). Nenhum campo novo no estado — a regra de
   campo novo em parte existente não se aplica, porque o campo é o mesmo.

   ⚠️ CONCLUÍDO VENCE ESCONDIDO, e não volta: nem se a permissão for
   revogada depois, nem num aparelho novo, onde a permissão e a saúde
   nascem pendentes. Quem terminou não recomeça.
   ============================================================ */
const ESCONDIDOS = 'primeiros-passos-escondidos';
const CONCLUIDOS = 'primeiros-passos-concluidos';

const vistas = (S: any): Record<string, number> => S?.apresentacoesVistas ?? {};
const marcar = (s: any, chave: string, quando: number | null) => {
  const m = s.apresentacoesVistas ?? (s.apresentacoesVistas = {});
  if (quando == null) delete m[chave];
  else m[chave] = quando;
};

export const passosEscondidos = (S: State) => !!vistas(S)[ESCONDIDOS];
export const passosConcluidos = (S: State) => !!vistas(S)[CONCLUIDOS];

export const esconderPassos = (s: State) => marcar(s, ESCONDIDOS, Date.now());
export const reabrirPassos = (s: State) => marcar(s, ESCONDIDOS, null);
export const concluirPassos = (s: State) => marcar(s, CONCLUIDOS, Date.now());

/* ⚠️ O DIÁRIO DE EXEMPLO NÃO TEM PRIMEIROS PASSOS. A semente é alguém
   com meses de tratamento, e é assim que ela serve de vitrine; um cartão
   de boas-vindas em cima dela mostraria um aplicativo que não existe para
   ninguém. */
const doDiario = (S: State) => !!S.onboardDone && !(S as any).semente;

/** O cartão tem lugar na Home: cadastro feito, nem concluído nem escondido. */
export const passosNaHome = (S: State) =>
  doDiario(S) && !passosConcluidos(S) && !passosEscondidos(S);

/** A linha do Perfil que reabre: escondido, e ainda não concluído. */
export const passosParaReabrir = (S: State) =>
  doDiario(S) && passosEscondidos(S) && !passosConcluidos(S);

/* ============================================================
   HÁ EVOLUÇÃO?

   Duas pesagens em dias diferentes — o mínimo para "peso perdido" querer
   dizer alguma coisa. Quem já tinha começado e informou o peso inicial no
   cadastro tem as duas no primeiro dia, e tem evolução de verdade; quem
   começa hoje tem uma, e a seção espera (Peça 2 da especificação).
   ============================================================ */
export function temEvolucao(S: State) {
  const dias = new Set(((S.weights ?? []) as { t: number }[]).map((w) => +startOfDay(w.t)));
  return dias.size >= 2;
}
