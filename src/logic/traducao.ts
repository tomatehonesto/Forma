/* ============================================================
   A TRADUÇÃO ENTRE O ESTADO E O BANCO

   ⚠️ POR ENQUANTO, SÓ OS CAMINHOS. A tabela inteira — que campo do
   estado vira que tipo de registro, que parte do perfil, o que vem da
   clínica e o que fica no aparelho — nasce na fase 3 do plano
   (docs/superpowers/plans/2026-09-25-supabase-ponte-plano.md). Aqui
   estão só as listas cujos itens viram linhas no banco, porque é nelas
   que cada item precisa de identidade (ver logic/identidade).

   ⚠️ LISTA DE TEXTO SOLTO NÃO ENTRA. `customSyms` é uma lista de nomes
   (`['Refluxo']`): não há onde pôr identidade num texto, e ela vai para
   uma parte do perfil, e não para `registros`.
   ============================================================ */

/** As listas do estado em que cada item vira uma linha no banco. */
export const LISTAS_DO_DIARIO = [
  'weights', 'injections', 'checkins', 'meals', 'favMeals', 'measures',
  'examBundles', 'photos', 'documents', 'notes', 'goals', 'pens', 'asked',
] as const;

/** Todo item do estado que vira uma linha no banco: os das listas do
    diário, cada valor de cada marcador de exame e cada medição de cada
    sinal vital. Os exames e os sinais se achatam de propósito — dois
    aparelhos acrescentando valores ao mesmo marcador não podem se
    atropelar. */
export function itensDoDiario(S: any): any[] {
  const itens: any[] = [];
  const juntar = (lista: unknown) => {
    if (!Array.isArray(lista)) return;
    for (const item of lista) if (item && typeof item === 'object') itens.push(item);
  };
  for (const nome of LISTAS_DO_DIARIO) juntar(S?.[nome]);
  if (Array.isArray(S?.exams)) for (const marcador of S.exams) juntar(marcador?.values);
  if (S?.vitals && typeof S.vitals === 'object') for (const medicoes of Object.values(S.vitals)) juntar(medicoes);
  return itens;
}
