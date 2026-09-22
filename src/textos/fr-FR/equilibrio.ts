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
  aberturaPreciso: 'J’ai besoin de vous montrer une chose.',

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
  corpoEquilibrado: (doisFortes: string, fraco: string) =>
    `${doisFortes} tirent vers le haut, et rien ne traîne du côté de ${fraco.toLowerCase()}. Je ne changerais rien pour l’instant.`,
  corpoUmAtras: (doisFortes: string, fraco: string) =>
    `${doisFortes} tiennent bon. ${fraco} est ce qui oscille le plus — ce serait mon point d’attention pour la semaine prochaine.`,

  /* ⚠️ LE BOUTON EMPORTE LA QUESTION VERS LE COMPANION. Si le texte du
     bouton et la question envoyée divergent, la personne touche une chose
     et reçoit la réponse d'une autre. */
  botaoMelhorar: (eixo: string) => `Comment améliorer ${eixo.toLowerCase()}`,
  perguntaMelhorar: (eixo: string) => `Comment améliorer ${eixo.toLowerCase()} ?`,

  serieDe: (eixo: string, dias: number) => `${eixo.toUpperCase()} · ${dias} DERNIERS JOURS`,
};
