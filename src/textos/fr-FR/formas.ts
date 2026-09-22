/* ============================================================
   LA FORME D'ADMINISTRATION — le vocabulaire et l'accord · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/formas.ts. Le français réclame les
   mêmes accords que le portugais et l'espagnol, et deux choses de plus :

   ⚠️⚠️ « DE + LE » SE CONTRACTE EN « DU », et « à + le » en « au ». « de la
   seringue » mais « du flacon », jamais « de le flacon ». C'est exactement
   l'erreur que le fichier portugais décrit : elle passe le `tsc`, elle
   passe la relecture du diff, et elle n'apparaît que sur l'écran de qui
   utilise la forme la moins courante. C'est la même asymétrie qu'en
   espagnol — là-bas « del » —, sauf que le français contracte aussi
   « dans le » en rien du tout : « dans le flacon » reste entier.

   ⚠️⚠️ ET L'ÉLISION GUETTE LE MOT SUIVANT. « de » devient « d' » devant
   une voyelle, et « le/la » devient « l' ». Aucun des quatre récipients
   d'aujourd'hui ne commence par une voyelle — stylo, flacon, seringue,
   plaquette —, donc rien ne casse ; le cinquième, s'il commence par une
   voyelle ou un h muet, cassera en silence. C'est écrit ici pour que qui
   l'ajoute le sache avant, et pas après.

   ⚠️ LE GENRE EST CELUI DU MOT, et ça se voit d'un coup avec trois
   langues : le récipient du comprimé est « cartela » (féminin) en
   portugais, « blíster » (masculin) en espagnol et « plaquette »
   (féminin) en français. Même forme d'administration, trois genres qui ne
   s'accordent pas entre eux — et c'est pour ça que la table de genre vit
   dans chaque fichier de langue et pas dans la logique.

   ⚠️ ET « STYLO » EST MASCULIN, là où « caneta » et « pluma » sont
   féminins dans les deux autres langues. Rien de ce qui a été écrit
   ailleurs ne peut être repris ici sans le relire.
   ============================================================ */

type Recipiente = 'caneta' | 'frasco' | 'seringa' | 'comprimido';

/* ⚠️ PRIVÉ À DESSEIN. Il n'entre pas dans `palavras` et n'est pas
   exporté : la seule porte vers le genre, ce sont les fonctions
   ci-dessous. */
const GENERO: Record<Recipiente, 'm' | 'f'> = {
  caneta: 'm', frasco: 'm', seringa: 'f', comprimido: 'f',
};

const f = (r: Recipiente) => GENERO[r] === 'f';

export const formas = {
  /* ⚠️ LE PLURIEL EST UN CHAMP, et non `recipiente + 's'`. Les quatre
     d'aujourd'hui sont réguliers et le calcul tomberait juste — et c'est
     exactement comme ça que le cinquième, irrégulier, passe sans que
     personne le remarque. */
  palavras: {
    caneta: { recipiente: 'stylo', plural: 'stylos', verbo: 'injecter', acao: 'injection' },
    frasco: { recipiente: 'flacon', plural: 'flacons', verbo: 'injecter', acao: 'injection' },
    seringa: { recipiente: 'seringue', plural: 'seringues', verbo: 'injecter', acao: 'injection' },
    comprimido: { recipiente: 'plaquette', plural: 'plaquettes', verbo: 'prendre', acao: 'prise' },
  } as Record<Recipiente, { recipiente: string; plural: string; verbo: string; acao: string }>,

  concordar: (r: Recipiente, masc: string, fem: string) => (f(r) ? fem : masc),

  /* « dans le stylo », « dans la seringue » — pas de contraction. */
  noNa: (r: Recipiente) => `${f(r) ? 'dans la' : 'dans le'} ${formas.palavras[r].recipiente}`,
  /* ⚠️⚠️ « de la seringue », mais « DU flacon ». La contraction n'est pas
     facultative. */
  doDa: (r: Recipiente) => (f(r)
    ? `de la ${formas.palavras[r].recipiente}`
    : `du ${formas.palavras[r].recipiente}`),
  /** « dans cette seringue », « dans ce stylo ». */
  nesteNesta: (r: Recipiente) => `${f(r) ? 'dans cette' : 'dans ce'} ${formas.palavras[r].recipiente}`,

  /** « une autre seringue », « un autre stylo ». */
  umOutro: (r: Recipiente, maiusculo = false) => {
    const p = f(r) ? 'une autre' : 'un autre';
    return maiusculo ? p[0].toUpperCase() + p.slice(1) : p;
  },

  /** « le stylo », « la seringue ». */
  oA: (r: Recipiente): string => (f(r) ? 'la' : 'le'),
};
