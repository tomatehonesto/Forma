/* ============================================================
   A IDENTIDADE DE CADA ITEM DO DIÁRIO

   Cada item ganha um `rid` — o id da linha dele no banco — num lugar só:
   aqui, chamada por `ensureDefaults` (o que já existia ganha o seu na
   primeira abertura, e a semente também) e por `update`, logo depois de
   cada mudança (o item novo ganha o seu na hora). Nenhuma tela muda:
   elas continuam acrescentando itens como sempre.

   ⚠️ `rid`, E NÃO `id`. Metas e alertas já têm um `id` com outro sentido
   ('g3', 'al-dose'), que vai para endereço de tela. `rid` não tem sentido
   nenhum no aplicativo — é só o nome da linha no banco.

   ⚠️ IDEMPOTENTE: quem já tem `rid` não é tocado. E como até hoje o
   diário só existia num aparelho, não há como duas cópias do mesmo item
   receberem identidades diferentes.

   ⚠️ E DOIS ITENS NUNCA DIVIDEM UMA. Uma tela que monta o item novo a
   partir de um antigo (`{ ...ultima, t: agora }`) copia o `rid` junto, e
   os dois virariam uma linha só no banco — o lote que sobe com o mesmo id
   duas vezes é recusado inteiro. Foi o que a medição nova fazia. O
   primeiro, na ordem das listas, fica com o `rid`; o repetido ganha um
   novo.
   ============================================================ */
import * as Crypto from 'expo-crypto';
import { itensDoDiario } from './traducao';

export const novoRid = (): string => Crypto.randomUUID();

/** Carimba, no lugar, um `rid` em todo item do diário que ainda não tem —
    ou que tem o de outro item. */
export function carimbar<T>(S: T, novoId: () => string = novoRid): T {
  const vistos = new Set<string>();
  for (const item of itensDoDiario(S)) {
    if (typeof item.rid !== 'string' || !item.rid || vistos.has(item.rid)) item.rid = novoId();
    vistos.add(item.rid);
  }
  return S;
}
