import type { State } from './seed';
import { timelineWeeks, lastInjection } from './derive';
import { conquistas, type Conquista } from './conquistas';
import { DAY, diffDays, now, startOfDay } from './time';

/* ============================================================
   OS DESTAQUES NOVOS DA HOME — a semana que passou e o marco alcançado
   (28/09/2026, pedidos do dono; o carrossel mora em app/(tabs)/index)

   Os dois são leituras do diário, como o resto do carrossel: cada um tem a
   própria condição, e quem não tem o que dizer não entra. O teto de quatro
   cartões e a ordem são do carrossel.
   ============================================================ */

/* ------------------------------------------------------------------ */
/* A SEMANA QUE PASSOU

   ⚠️ A SEMANA É A DO TRATAMENTO, e não a do calendário: vai de uma dose à
   seguinte, como na Jornada e na tela da semana (`timelineWeeks`). Por
   isso o resumo aparece logo depois da dose nova — no dia dela e no
   seguinte —, falando da semana que ela fechou.

   ⚠️ SÓ O QUE ACONTECEU. O peso entra quando houve pesagem na semana e
   antes dela; os registros, quando houve registro. Semana sem nada não
   ganha cartão — "0 check-ins" seria cobrança, e não resumo. */
const DIAS_DO_RESUMO = 2;

export type ResumoDaSemana = { semana: number; deltaPeso: string | null; resumo: string };

export function semanaQuePassou(S: State): ResumoDaSemana | null {
  const ultima = lastInjection(S);
  if (!ultima) return null;
  const desde = diffDays(now(), startOfDay(new Date(ultima.t)));
  if (desde < 0 || desde >= DIAS_DO_RESUMO) return null;
  /* a primeira é a semana que está começando; a segunda, a que fechou */
  const w = timelineWeeks(S)[1];
  if (!w || (!w.deltaPeso && !w.resumo)) return null;
  return { semana: w.semana, deltaPeso: w.deltaPeso, resumo: w.resumo };
}

/* ------------------------------------------------------------------ */
/* O MARCO ALCANÇADO

   O nível de conquista mais recente, nos três dias depois de alcançado. A
   comemoração em tela cheia (conquista-ok) acontece uma vez; este cartão
   é a lembrança dela na Home, com a porta para as conquistas.

   ⚠️ O QUE VEIO COM O CADASTRO NÃO É MARCO. A primeira pesagem e a dose
   de partida são o formulário que a pessoa acabou de preencher — o mesmo
   motivo por que o cadastro não as comemora (ver app/cadastro). O corte é
   o aceite do cadastro (`consentimento.em`), com um dia de folga. */
const DIAS_DO_MARCO = 3;

/** Se um marco é de depois do cadastro — a regra vale também para "O que
    você já fez", no Perfil (28/09/2026). */
export function depoisDoCadastro(S: State, t: number): boolean {
  const nasceu = (S.profile as any)?.consentimento?.em;
  return typeof nasceu !== 'number' || t > nasceu + DAY;
}

export function marcoRecente(S: State): Conquista | null {
  const agora = +now();
  const recentes = conquistas(S)
    .filter((q) => q.nivel > 0 && q.t != null && agora - q.t < DIAS_DO_MARCO * DAY && q.t <= agora && depoisDoCadastro(S, q.t))
    .sort((a, b) => (b.t ?? 0) - (a.t ?? 0));
  return recentes[0] ?? null;
}
