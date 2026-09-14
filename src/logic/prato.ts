import { ALIMENTOS, gramasDe, medidaDe, type Alimento } from './alimentos';

/* ============================================================
   O PRATO MONTADO

   Um item do prato vem de um de dois lugares, e o tipo diz de qual:

     { id: 'arroz', qtd: 4 }                  da tabela — a TACO responde
     { nome: '…', base: 22, qtd: 1 }          livre — quem viu a foto responde
     { nome: '…', qtd: 1 }                    anotado, sem conta

   `qtd` é quantas UNIDADES daquele alimento: quatro colheres de arroz,
   um filé de frango, duas fatias de queijo. Antes era um tamanho
   abstrato de porção — pouca, normal, bastante —, que pedia à pessoa
   comparar o prato dela com uma régua que só o app conhecia. Contar
   colheres é uma coisa que ela viu acontecer.

   O terceiro caso existe porque a tabela tem 144 alimentos e o Brasil
   tem mais. O item entra pelo nome e diz que não conta — perder o
   registro inteiro seria pior, e inventar o número seria voltar ao
   começo.
   ============================================================ */

export type ItemComida = {
  /** Alimento da tabela. */
  id?: string;
  /** Nome livre, quando não há par na tabela. */
  nome?: string;
  /** Proteína de UMA porção, em gramas. Só para item livre contado. */
  base?: number;
  /** Quantas unidades. */
  qtd: number;
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

/** Quantos, e de quê: "4 colheres", "1 filé", "2 porções". */
export function medidaItem(it: ItemComida): string {
  const a = alimentoDe(it.id);
  if (a) return medidaDe(a, it.qtd);
  return `${it.qtd} ${it.qtd === 1 ? 'porção' : 'porções'}`;
}

/** A procedência do número, quando ela precisa ser dita. Item de tabela
    não diz nada: é o caso normal, e anunciá-lo seria ruído em todas as
    linhas para avisar sobre nenhuma. */
export function ressalvaItem(it: ItemComida): string | null {
  switch (origemDe(it)) {
    case 'estimado': return 'estimado pela foto';
    case 'sem-conta': return 'ainda não entra na conta';
    default: return null;
  }
}

export function gramasItem(it: ItemComida): number {
  const a = alimentoDe(it.id);
  if (a) return gramasDe(a, it.qtd);
  return Math.round((it.base ?? 0) * Math.max(0, it.qtd));
}

export function somaDe(itens: ItemComida[]): number {
  return itens.reduce((s, it) => s + gramasItem(it), 0);
}

/** Itens do prato numa dada origem. */
export function itensDe(itens: ItemComida[], origem: Origem): ItemComida[] {
  return itens.filter((it) => origemDe(it) === origem);
}

/** Quantas unidades esse alimento traz ao entrar na lista. */
export function qtdPadrao(id: string): number {
  return alimentoDe(id)?.qtd ?? 1;
}
