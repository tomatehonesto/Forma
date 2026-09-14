import { ALIMENTOS, PORCOES, gramasDe, type Alimento, type Porcao } from './alimentos';

/* ============================================================
   O PRATO MONTADO

   Um item do prato vem de um de dois lugares, e o tipo diz de qual:

     { id: 'peito-frango', porcao }        da tabela — a TACO responde
     { nome: '…', base: 22, porcao }       livre — quem viu a foto responde

   O segundo caso existe porque a tabela tem 76 alimentos e o Brasil tem
   mais: escondidinho, virado à paulista, a receita da avó. Quando a foto
   reconhece um prato que a tabela não tem, o item entra assim mesmo, com
   o número que o analisador estimou — e a tela DIZ que foi assim, porque
   esse número não tem a procedência que o outro tem.

   O que os dois casos têm em comum é o que importa: a porção continua
   sendo escolhida pela pessoa, e a soma continua sendo uma só.
   ============================================================ */

export type ItemComida = {
  /** Alimento da tabela. */
  id?: string;
  /** Nome livre, quando não há par na tabela. */
  nome?: string;
  /** Proteína de uma porção normal, em gramas. Só para item livre. */
  base?: number;
  porcao: Porcao;
};

export type Origem = 'tabela' | 'estimado' | 'sem-conta';

/** De onde sai — ou não sai — o número deste item. */
export function origemDe(it: ItemComida): Origem {
  if (alimentoDe(it.id)) return 'tabela';
  return it.base != null ? 'estimado' : 'sem-conta';
}

/** O alimento de um item, ou null se ele for livre (ou o id sumir). */
export function alimentoDe(id?: string): Alimento | null {
  return (id && ALIMENTOS.find((a) => a.id === id)) || null;
}

export function nomeItem(it: ItemComida): string {
  return alimentoDe(it.id)?.nome ?? it.nome ?? '';
}

/** A medida caseira, ou a confissão de onde o número veio — ou não veio. */
export function medidaItem(it: ItemComida): string {
  const a = alimentoDe(it.id);
  if (a) return a.medida;
  return it.base != null ? 'estimado pela foto' : 'ainda não entra na conta';
}

export function gramasItem(it: ItemComida): number {
  const a = alimentoDe(it.id);
  if (a) return gramasDe(a, it.porcao);
  const k = PORCOES.find((p) => p.id === it.porcao)!.k;
  return Math.round((it.base ?? 0) * k);
}

export function somaDe(itens: ItemComida[]): number {
  return itens.reduce((s, it) => s + gramasItem(it), 0);
}

/** Itens do prato numa dada origem. */
export function itensDe(itens: ItemComida[], origem: Origem): ItemComida[] {
  return itens.filter((it) => origemDe(it) === origem);
}
