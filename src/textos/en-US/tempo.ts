/* ============================================================
   TIME SAID IN WORDS — en-US

   ⚠️ Reasons live in ../pt-BR/tempo.ts.
   ============================================================ */

export const tempo = {
  /** Forward only: "today", "tomorrow", "in 3 days". */
  daquiA: (dias: number) => (dias <= 0 ? 'today' : dias === 1 ? 'tomorrow' : `in ${dias} days`),

  /** Both directions. Negative is the past.

      ⚠️ ENGLISH PUTS THE PAST AT THE END OF THE PHRASE. Portuguese uses a
      preposition on the left for both directions — "há 3 dias", "em 3
      dias" — and English uses "in" on the left for the future and "ago"
      on the right for the past. The word order changes, not just the
      word, which is why this is a function per language instead of a
      table of strings. */
  relativo: (dias: number) => {
    if (dias === 0) return 'today';
    if (dias === -1) return 'yesterday';
    if (dias === 1) return 'tomorrow';
    return dias < 0 ? `${-dias} days ago` : `in ${dias} days`;
  },
};
