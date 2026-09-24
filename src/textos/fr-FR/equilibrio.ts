/* ============================================================
   L'ÉQUILIBRE — la lecture du radar, en deux phrases · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/equilibrio.ts. Les deux qui
   commandent :

   ELLE PARLE À LA PREMIÈRE PERSONNE, ET OUVRE UNE CONVERSATION. « Votre
   équilibre est constant » est un compte rendu, et ce qui écrit des
   comptes rendus, c'est un système. « Quelque chose a attiré mon
   attention », c'est quelqu'un qui a regardé les données et a décidé d'en
   parler. Les trois ouvertures sont trois degrés de la même voix, et
   aucune ne met de note.

   ET LA LECTURE N'ORDONNE JAMAIS RIEN. La version la plus grave dit « ce
   serait mon point d'attention pour la semaine prochaine » —
   conditionnel, première personne, une suggestion de regard.
   ============================================================ */

/* ⚠️ ET LE BOUTON PARLE COMME QUI POSE LA QUESTION : « Comment améliorer
   l'exercice » était un titre d'article, et « mon exercice » serait un
   exercice précis. `mon` donne la forme de chaque axe à la première
   personne — l'activité physique, les apports en protéines. */
const AXE: Record<string, { le: string; du: string; mon: string }> = {
  Sommeil: { le: 'le sommeil', du: 'du sommeil', mon: 'mon sommeil' },
  Énergie: { le: 'l’énergie', du: 'de l’énergie', mon: 'mon énergie' },
  Humeur: { le: 'l’humeur', du: 'de l’humeur', mon: 'mon humeur' },
  Hydratation: { le: 'l’hydratation', du: 'de l’hydratation', mon: 'mon hydratation' },
  Exercice: { le: 'l’exercice', du: 'de l’exercice', mon: 'mon activité physique' },
  Protéines: { le: 'les protéines', du: 'des protéines', mon: 'mes apports en protéines' },
  Satiété: { le: 'la satiété', du: 'de la satiété', mon: 'ma satiété' },
  Observance: { le: 'l’observance', du: 'de l’observance', mon: 'mon observance' },
};
const le = (eixo: string) => AXE[eixo]?.le ?? eixo.toLowerCase();
const du = (eixo: string) => AXE[eixo]?.du ?? `de ${eixo.toLowerCase()}`;
const mon = (eixo: string) => AXE[eixo]?.mon ?? le(eixo);
const maj = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const equilibrio = {
  /* ⚠️ « SATIÉTÉ » N'EST PAS LE NOM DE CE QUE LA PERSONNE A RÉPONDU. Elle
     répond FAIM au check-in, et l'axe montre le contraire : plus il y a de
     faim, moins il y a de satiété. Le nom de l'axe est celui du bon côté,
     parce que dans un graphique où tout croît vers l'extérieur l'axe doit
     croître avec. */
  eixos: {
    sono: 'Sommeil',
    energia: 'Énergie',
    humor: 'Humeur',
    hidratacao: 'Hydratation',
    exercicio: 'Exercice',
    proteina: 'Protéines',
    saciedade: 'Satiété',
    adesao: 'Observance',
  },

  aberturaTudoBem: 'J’ai remarqué une bonne chose.',
  aberturaAtencao: 'Quelque chose a attiré mon attention.',
  aberturaPreciso: 'J’ai quelque chose à vous montrer.',

  /* ⚠️⚠️ CETTE PAIRE EST UN PIÈGE DE TRADUCTION, et c'est pour ça qu'elle
     est une fonction et non une concaténation à l'extérieur.

     En français les deux noms ouvrent la phrase seuls et le SECOND passe
     en minuscule : « Sommeil et observance tirent vers le haut ». Sans
     « votre » devant, à dessein — « votre sommeil et observance » accorde
     mal, et le réparer avec « votre sommeil et votre observance » alourdit
     la phrase.

     ⚠️ ET LE FRANÇAIS RÉCLAME L'ÉLISION SUR LE SECOND : « Humeur et
     hydratation » garde le « et », mais un axe commençant par une voyelle
     après « et » n'élide pas — c'est « le/la » qui élide, pas « et ». Rien
     à faire ici, donc, et c'est écrit pour que personne ne l'invente. */
  par: (primeiro: string, segundo: string) => `${primeiro} et ${segundo.toLowerCase()}`,

  /* ⚠️⚠️ AUCUN ACCORD NE PEUT TOMBER SUR LE NOM D'AXE, parce que le nom
     arrive en variable et que les huit ne sont pas du même genre :
     Sommeil et Exercice sont masculins, les six autres féminins, et
     Protéines est en plus au pluriel.

     J'avais écrit « n'est pas restée derrière » — juste pour Satiété,
     faux pour Sommeil, faux deux fois pour Protéines. Et « sont
     constants » n'est juste que si la paire est mixte ; deux axes
     féminins réclament « constantes ».

     La sortie est de ne jamais donner l'axe comme sujet d'un participe :
     « rien ne traîne du côté de… » a « rien » en sujet, invariable, et
     « tiennent bon » ne s'accorde qu'en nombre, que la paire garantit.

     ⚠️ C'est la même règle que le haut de etapa.ts, poussée d'un cran :
     là-bas l'accord tombait sur qui lit, ici il tombe sur un mot que le
     code choisit à l'exécution. Le second est pire, parce qu'il est juste
     la moitié du temps. */
  /* ⚠️⚠️ SEUL, L'AXE A BESOIN DE SON ARTICLE — et de l'élision. La paire
     d'ouverture peut s'en passer, en style de titre (« Sommeil et
     observance tiennent bon »), mais l'axe isolé non : « Exercice est ce
     qui oscille » et « du côté de exercice » étaient deux fautes, la
     seconde sans élision. La table `AXE`, en tête de fichier, suit les
     huit noms de `eixos` ; un nom qui n'y serait pas retombe en
     minuscules. */
  corpoEquilibrado: (doisFortes: string, fraco: string) =>
    `${doisFortes} tirent vers le haut, et rien ne traîne du côté ${du(fraco)}. Je ne changerais rien pour l’instant.`,
  corpoUmAtras: (doisFortes: string, fraco: string) =>
    `${doisFortes} tiennent bon. ${maj(le(fraco))}, c’est ce qui oscille le plus — ce serait mon point d’attention pour la semaine prochaine.`,

  /* ⚠️ LE BOUTON EMPORTE LA QUESTION VERS LE COMPANION. Si le texte du
     bouton et la question envoyée divergent, la personne touche une chose
     et reçoit la réponse d'une autre. */
  botaoMelhorar: (eixo: string) => `Comment améliorer ${mon(eixo)}`,
  perguntaMelhorar: (eixo: string) => `Comment améliorer ${mon(eixo)} ?`,

  serieDe: (eixo: string, dias: number) => `${eixo.toUpperCase()} · ${dias} DERNIERS JOURS`,
};
