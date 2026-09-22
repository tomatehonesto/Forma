/* ============================================================
   LES RÈGLES DE LANGUE QUI N'APPARTIENNENT À AUCUN DOMAINE · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/comum.ts. Ici vit ce qui est de la
   grammaire pure : ce dont tous les domaines ont besoin et dont aucun
   n'est propriétaire.

   ⚠️⚠️ ET LE FRANÇAIS RÉCLAME QUELQUE CHOSE QUE NI LE PORTUGAIS NI
   L'ESPAGNOL NE RÉCLAMENT : UNE ESPACE FINE INSÉCABLE AVANT « ? », « ! »,
   « : » et « ; ». « Comment ça va ? », et non « Comment ça va? ».

   C'est de la typographie, pas du goût : l'Imprimerie nationale et le
   Petit Robert la donnent comme règle, et une application de santé qui
   l'ignore se lit comme une traduction automatique dès la première
   question. Elle est INSÉCABLE parce qu'une espace ordinaire laisserait le
   « ? » tomber seul en début de ligne.

   ⚠️ ELLE EST INVISIBLE — U+202F —, et c'est pour ça qu'elle est écrite en
   échappement ` ` partout dans ce catalogue. Le fichier portugais a
   déjà perdu une espace insécable une fois parce que quelqu'un l'a
   retapée au lieu de la copier ; un échappement ne se perd pas.

   La fonction `fine` est là pour les phrases construites au vol. Les
   textes fixes portent déjà l'échappement.
   ============================================================ */

/** Pose l'espace fine insécable devant la ponctuation haute. */
export const fine = (s: string) => s.replace(/ ?([?!:;])/g, ' $1');

export const comum = {
  /* ⚠️ LE FRANÇAIS NE MET PAS DE VIRGULE avant le « et » final, comme le
     portugais et contrairement à l'anglais américain. */
  /* ⚠️ LA CASSE EN MILIEU DE PHRASE EST UNE RÈGLE DE LANGUE. Voir
     ../pt-BR/comum : l'allemand écrit TOUT nom commun avec une majuscule,
     et c'est pour ça que ceci est une fonction et non un `.toLowerCase()`
     posé dans la logique. */
  noMeio: (s: string) => s.toLowerCase(),

  lista: (itens: string[], mostrar = Infinity) => {
    if (!itens.length) return '';
    if (itens.length === 1) return itens[0];
    if (itens.length <= mostrar) {
      return `${itens.slice(0, -1).join(', ')} et ${itens[itens.length - 1]}`;
    }
    return `${itens.slice(0, mostrar).join(', ')} et ${itens.length - mostrar} de plus`;
  },

  abas: {
    home: 'Accueil',
    jornada: 'Parcours',
    cuidado: 'Soin',
    insights: 'Insights',
  },
};
