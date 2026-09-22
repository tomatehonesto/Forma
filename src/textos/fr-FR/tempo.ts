/* ============================================================
   LE TEMPS DIT POUR DES GENS — « aujourd'hui », « hier », « dans 3 jours » · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/tempo.ts. Ce n'est pas du format,
   c'est de la parole : ça répond à CE QU'ON DIT à la place de la date.

   ⚠️ LE FRANÇAIS MET « il y a » DEVANT ET « dans » DEVANT AUSSI, là où le
   portugais a « há » et « em ». Les deux sont antéposés, donc l'ordre de
   la phrase ne change pas — contrairement à l'anglais, qui colle « ago »
   à la fin. C'est exactement pourquoi ceci est une fonction par langue et
   pas une table de mots.
   ============================================================ */

export const tempo = {
  /** Vers l'avant seulement : « aujourd'hui », « demain », « dans 3 jours ». */
  daquiA: (dias: number) => (dias <= 0 ? 'aujourd’hui' : dias === 1 ? 'demain' : `dans ${dias} jours`),

  /** Des deux côtés. Négatif, c'est le passé. */
  relativo: (dias: number) => {
    if (dias === 0) return 'aujourd’hui';
    if (dias === -1) return 'hier';
    if (dias === 1) return 'demain';
    return dias < 0 ? `il y a ${-dias} jours` : `dans ${dias} jours`;
  },
};
