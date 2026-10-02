import type { State } from './seed';
import type { Permissao } from './avisos';
import { respostaNoDia } from './derive';
import { iconeDaDose, injetavelDe } from './formas';
import { PALETAS } from '../theme';
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

export type PassoId = 'plano' | 'medicacao' | 'aplicacao' | 'checkin' | 'meta' | 'lembretes' | 'saude' | 'aparencia';

export type Passo = {
  id: PassoId;
  ic: string;
  titulo: string;
  /** o porquê, numa linha; o item pronto não o mostra */
  sub?: string;
  pronto: boolean;
  /** para onde o toque leva — o plano não leva a lugar nenhum */
  to?: string;
  /** não segura o cartão: sem ele, o essencial já está feito */
  opcional?: boolean;
};

export type DoAparelho = {
  permissao: Permissao;
  /** o depósito de saúde do sistema (`aparelhoDaVez`), ou nulo no navegador */
  aparelho: { id: string; nome: string } | null;
};

const K = () => T.home.primeirosPassos;

/* A ORDEM É A DO PRIMEIRO DIA: o plano, que já está feito, abre a lista
   com um visto, e não do zero; depois o que conta o tratamento (a
   dose), o que conta o dia (o check-in), e por fim o que deixa o resto
   automático (os lembretes e a saúde do aparelho), que são opcionais. A
   cor do aplicativo fecha a lista: também é opcional, e é a única que
   não muda nada do diário. */
export function passos(S: State, { permissao, aparelho }: DoAparelho): Passo[] {
  /* A forma decide o desenho (seringa ou comprimido) e ainda passa para
     a frase: "dose" é o substantivo de todas desde 01/10/2026, mas a
     frase fica pronta para um idioma que precise dizê-la por forma. */
  const injetavel = injetavelDe(S);
  const lista: Passo[] = [
    /* A prancheta, e não o alvo: o alvo é o desenho das metas diárias, que
       ficam logo abaixo do cartão na mesma folha. */
    { id: 'plano', ic: 'plano', titulo: K().plano, pronto: true },
    {
      id: 'aplicacao', ic: iconeDaDose(S), titulo: K().aplicacao(injetavel), sub: K().aplicacaoSub,
      pronto: (S.injections?.length ?? 0) > 0, to: '/aplicacao',
    },
    {
      id: 'checkin', ic: 'mood', titulo: K().checkin, sub: K().checkinSub,
      pronto: ((S.checkins ?? []) as any[]).some(respostaNoDia), to: '/checkin',
    },
    /* ⚠️ UMA META ALÉM DO PESO (28/09/2026, pedido do dono): para o
       tratamento não virar só o número da balança. Segura o cartão, como
       os de cima — é rápida, e é o empurrão que o dono quer. Qualquer
       meta conta, a pessoal e a medida antiga. Enquanto ela está aqui, o
       convite de meta da Home se cala (ver logic/descobertas). */
    {
      id: 'meta', ic: 'target', titulo: K().meta, sub: K().metaSub,
      pronto: ((S.goals ?? []) as any[]).length > 0, to: '/meta?novo=1',
    },
  ];
  /* ⚠️ A MEDICAÇÃO, PARA QUEM AINDA NÃO DECIDIU (28/09/2026, pedido do
     dono). Quem respondeu "ainda não decidi" no cadastro ganha o item logo
     depois do plano: sem medicação, a dose, o ciclo e os lembretes não têm
     de onde sair. Ele fica na lista depois de feito, com o visto — a marca
     `MEDICACAO` lembra que ele existiu, porque a medicação escolhida, sozinha,
     não diz que um dia ela esteve em aberto. */
  const semMedicacao = (S.profile as any)?.med === 'indefinido';
  if (semMedicacao || vistas(S)[MEDICACAO]) {
    lista.splice(1, 0, {
      id: 'medicacao', ic: 'pill', titulo: K().medicacao, sub: K().medicacaoSub,
      pronto: !semMedicacao, to: '/cadastro?editar=medicamento',
    });
  }
  /* ⚠️ OS DOIS ÚLTIMOS SÃO OPCIONAIS. Aviso e app de saúde são do aparelho,
     e quem não quer nenhum dos dois não está atrasado em nada — sem esta
     marca, o cartão ficava para sempre esperando uma permissão que a
     pessoa decidiu não dar. Eles continuam na lista, porque são bons de
     ter; só não seguram o cartão, que se conclui com o essencial. */
  /* Sem aviso possível (o navegador), não há o que permitir. */
  if (permissao !== 'indisponivel') {
    lista.push({
      id: 'lembretes', ic: 'bell', titulo: K().lembretes, sub: K().lembretesSub,
      pronto: permissao === 'concedida', to: '/lembretes', opcional: true,
    });
  }
  /* Só o depósito do sistema em que o app roda — ver logic/integracoes. */
  if (aparelho) {
    lista.push({
      id: 'saude', ic: 'heart', titulo: K().saude(aparelho.nome), sub: K().saudeSub,
      pronto: !!(S as any).integrations?.[aparelho.id], to: '/integracoes', opcional: true,
    });
  }
  /* ⚠️ A COR DO APLICATIVO, POR ÚLTIMO (02/10/2026, pedido do dono). É
     opcional como os dois do aparelho, e vem depois deles: o aviso e o
     app de saúde servem ao diário, e a cor é gosto. Não depende do
     aparelho — no navegador, é o único opcional. O desenho é o da linha
     "Aparência" do Perfil, que é para onde o toque leva.

     ⚠️ FEITO É TER ESCOLHIDO, e não a cor ter mudado. O estado nasce com
     a Original e o tema do sistema, e quem abre a Aparência e fica com
     eles também escolheu — é a marca que logic/store grava na primeira
     paleta ou no primeiro tema tocado, mesmo que seja o que já estava. A
     paleta diferente da Original conta sem a marca: é quem escolheu antes
     de ela existir. O tema não conta assim, porque um claro guardado
     pode ser só o padrão antigo (`ensureDefaults`, em logic/seed).

     O número de paletas vem da lista, e não do texto: ver o catálogo. */
  lista.push({
    id: 'aparencia', ic: 'palette', titulo: K().aparencia, sub: K().aparenciaSub(PALETAS.length),
    pronto: !!vistas(S)[APARENCIA] || ((S as any).paleta ?? 'original') !== 'original',
    to: '/aparencia', opcional: true,
  });
  return lista;
}

/** O essencial está feito: todo item que não é opcional está pronto. É isto
    que conclui o cartão. */
export const essencialPronto = (lista: Passo[]) => lista.every((p) => p.pronto || p.opcional);

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
const MEDICACAO = 'primeiros-passos-medicacao';
/* ⚠️ ESTA NÃO É GRAVADA AQUI: quem a grava é logic/store, em `setPaleta` e
   `setTheme`, porque a escolha acontece na Aparência e vale por qualquer
   caminho que leve até lá. Aqui ela só é lida, e a chave tem de ser a
   mesma dos dois lados — a sonda confere pela loja de verdade. */
const APARENCIA = 'aparencia-escolhida';

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
/** Guarda que a medicação esteve em aberto — o item dela fica, com o visto. */
export const lembrarMedicacao = (s: State) => marcar(s, MEDICACAO, Date.now());
export const medicacaoLembrada = (S: State) => !!vistas(S)[MEDICACAO];

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
