import type { State } from './seed';
import { DAY, now } from './time';

/* ============================================================
   A APRESENTAÇÃO — "como podemos ajudar", para quem acabou de chegar
   (28/09/2026, pedido do dono)

   Duas peças: a tela de apresentação (app/apresentacao), uma página por
   pilar do aplicativo, e o destaque de boas-vindas no carrossel da Home,
   que leva a ela. O destaque sai de cena quando a apresentação foi vista
   — até o fim, ou fechada — ou quando o diário passa de uma semana: quem
   já usa há dias não precisa ser apresentado.

   ⚠️ A MARCA MORA EM `apresentacoesVistas`, como as dos primeiros passos:
   ela sobe com a sincronia, e quem viu num telefone não revê no outro.

   ⚠️ O NASCIMENTO DO DIÁRIO É O ACEITE DO CADASTRO (`consentimento.em`),
   o único momento que o cadastro grava com hora. Sem ele — um diário de
   antes do aviso —, não há boas-vindas: não dá para saber se ele é novo.
   ============================================================ */

const VISTA = 'apresentacao-inicio';
const DIAS_DE_BOAS_VINDAS = 7;

const vistas = (S: any): Record<string, number> => S?.apresentacoesVistas ?? {};

export const apresentacaoVista = (S: State) => !!vistas(S)[VISTA];

export const marcarApresentacaoVista = (s: State) => {
  const m = (s as any).apresentacoesVistas ?? ((s as any).apresentacoesVistas = {});
  if (!m[VISTA]) m[VISTA] = Date.now();
};

/** O destaque de boas-vindas tem lugar na Home: diário de verdade (e não o
    de exemplo), com menos de uma semana, e a apresentação ainda não vista. */
export function boasVindasNaHome(S: State): boolean {
  if (!S.onboardDone || (S as any).semente || apresentacaoVista(S)) return false;
  const nasceu = (S.profile as any)?.consentimento?.em;
  if (typeof nasceu !== 'number') return false;
  return +now() - nasceu < DIAS_DE_BOAS_VINDAS * DAY;
}
