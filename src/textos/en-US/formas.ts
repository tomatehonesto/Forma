/* ============================================================
   DOSAGE FORM — the vocabulary and the agreement · en-US

   ⚠️ Reasons live in ../pt-BR/formas.ts. The one that matters here:

   ENGLISH HAS NO GRAMMATICAL GENDER, so five of these six functions
   collapse into "the word, with an article in front". That is not a stub
   — it is the correct English implementation of a rule Portuguese
   charges for and English doesn't. The Portuguese file computes a gender;
   this one has nothing to compute.

   ⚠️ `concordar` RETURNS ITS FIRST ARGUMENT. In Portuguese the caller
   passes two spellings and the gender picks one; in English both
   spellings are the same word, so whichever arrives first is the answer.
   A caller writing English prose has no reason to call it at all.

   ⚠️ THE PILL'S CONTAINER IS THE BLISTER PACK, not a bottle — same
   reasoning as the Portuguese "cartela": a blister pack doesn't expire
   once opened the way a pen does.
   ============================================================ */

type Recipiente = 'caneta' | 'frasco' | 'seringa' | 'comprimido';

export const formas = {
  palavras: {
    caneta: { recipiente: 'pen', plural: 'pens', verbo: 'inject', acao: 'injection' },
    frasco: { recipiente: 'vial', plural: 'vials', verbo: 'inject', acao: 'injection' },
    seringa: { recipiente: 'syringe', plural: 'syringes', verbo: 'inject', acao: 'injection' },
    comprimido: { recipiente: 'blister pack', plural: 'blister packs', verbo: 'take', acao: 'dose' },
  } as Record<Recipiente, { recipiente: string; plural: string; verbo: string; acao: string }>,

  concordar: (_r: Recipiente, masc: string, _fem: string) => masc,

  noNa: (r: Recipiente) => `in the ${formas.palavras[r].recipiente}`,
  doDa: (r: Recipiente) => `of the ${formas.palavras[r].recipiente}`,
  nesteNesta: (r: Recipiente) => `in this ${formas.palavras[r].recipiente}`,

  umOutro: (_r: Recipiente, maiusculo = false) => (maiusculo ? 'Another' : 'another'),

  oA: (_r: Recipiente) => 'the',
};
