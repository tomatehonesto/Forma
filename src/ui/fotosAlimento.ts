/* ============================================================
   AS FOTOS DOS ALIMENTOS

   ARQUIVO GERADO por scripts/gerar-fotos.mjs a partir do que existe em
   assets/images/alimentos/. Para acrescentar uma foto, ponha o arquivo lá com o id do
   alimento no nome e rode:

     node scripts/gerar-fotos.mjs

   A tela de consulta procura nesta ordem: a foto DAQUELE alimento, a
   foto da prateleira dele, e por último o painel de cor — que continua
   dizendo alguma coisa, porque a cor vem do nutriente em destaque.

   A prateleira existe para o meio do caminho. Com vinte fotos entre
   duzentas e vinte e quatro, dezenove telas caem no painel de cor; com
   uma foto de "carnes e aves", todas as carnes já abrem com imagem
   enquanto a específica não chega.
   ============================================================ */
const POR_ITEM: Record<string, any> = {

};

const POR_PRATELEIRA: Record<string, any> = {

};

const chave = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** A foto de um alimento: a dele, a da prateleira dele, ou nenhuma. */
export function fotoDoAlimento(id: string, onde: string): any | null {
  return POR_ITEM[id] || POR_PRATELEIRA[chave(onde)] || null;
}

/** Quantas fotos existem hoje — a tela de consulta não usa, o gerador sim. */
export const TOTAL_FOTOS = 0;
