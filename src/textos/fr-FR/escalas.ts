/* ============================================================
   LES RÈGLES — ce que chaque chiffre veut dire · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/escalas.ts. Les trois qui commandent
   cette traduction :

   ⚠️⚠️ C'EST LE TEXTE QUE LA PERSONNE TOUCHE, pas celui qu'elle lit.
   Déplacer un échelon ne change pas une phrase : ça change ce qui reste
   ENREGISTRÉ. Le 4 d'aujourd'hui voudrait dire autre chose que le 4
   d'hier, et la série qui nourrit le radar, les objectifs et le résumé de
   consultation perdrait son sens. Il faut garder l'ORDRE et la distance
   entre les échelons avant de penser aux mots.

   ⚠️⚠️ ET AUCUNE PHRASE NE PEUT ACCORDER UN PARTICIPE AVEC QUI LA LIT.
   C'est ici que le français est le plus traître des trois langues : le
   portugais et l'espagnol s'en sortent en choisissant un verbe, mais le
   français fait accorder le participe avec le SUJET dès qu'il passe par
   l'auxiliaire être.

   « Je ne suis pas sortie du lit » affirme un genre. « Je suis restée
   dans le noir » aussi. « Je me suis fatiguée plus vite » aussi. Les
   trois sont la traduction naturelle, et les trois sont fausses.

   Les sorties, échelon par échelon : l'auxiliaire AVOIR (« j'ai dû
   m'allonger »), l'infinitif sans sujet (« impossible de tenir debout »)
   ou le groupe nominal (« fatigue plus rapide »). Aucune des trois ne
   porte de genre.

   ⚠️ L'ESPACE AVANT LE « h » EST INSÉCABLE, écrite ici en ` `. Dans
   le fichier portugais c'est le caractère invisible, et il s'est déjà
   perdu une fois.
   ============================================================ */

export const escalas = {
  energia: ['Sans force', 'La journée en traînant', 'Ça a suffi pour la journée', 'En forme', 'De l’énergie à revendre'],

  sono: ['5 h ou moins', 'Environ 6 h', 'Environ 7 h', 'Environ 8 h', '9 h ou plus'],

  humor: ['Une journée difficile', 'Plutôt en creux', 'Une journée normale', 'Une bonne journée', 'Une très bonne journée'],

  /* ⚠️ LA FAIM EST L'INVERSE DE LA SATIÉTÉ, et le radar lit la satiété.
     C'est pour ça que 1 est la faim la PLUS FAIBLE : la règle monte avec
     le symptôme, comme les autres. Inverser l'ordre ici inverse l'axe du
     radar. */
  fome: ['Aucune faim', 'Un peu faim', 'Faim normale', 'Bien faim', 'Faim toute la journée'],

  /* Le filet de sécurité, pour un symptôme qui n'a pas encore sa règle. */
  intensidade: ['À peine perceptible', 'Léger', 'Gênant', 'A gêné la journée', 'A pris toute la journée'],

  sintoma: {
    nausea: ['Un léger haut-le-cœur', 'Nausée par vagues', 'Nausée constante', 'J’ai failli vomir', 'J’ai vomi'],
    constip: ['Avec effort', 'Un jour sans aller', 'Deux jours sans aller', 'Trois jours sans aller', 'Quatre jours ou plus'],
    /* ⚠️ LE PLANCHER EST UNE FOURCHETTE, ET NON « UNE FOIS », et c'est une
       décision clinique et non rédactionnelle : une selle molle n'est pas
       une diarrhée. La définition de l'OMS commence à trois selles molles
       dans la journée. Avec le plancher à une fois, l'échelle appellerait
       symptôme ce qui est encore dans le normal de beaucoup de gens — et
       une colonne qui appelle tout diarrhée ne sert à rien à la lecture.

       L'échelon 1 est le « mou, mais pas encore ça », le 2 est là où l'OMS
       commence à parler de diarrhée, et le 5 est la fourchette que la
       gradation clinique traite comme grave. Les coupures vont sur les
       mêmes NOMBRES, pas sur les mêmes mots. */
    diarreia: ['Une ou deux fois', 'Trois fois', 'Quatre fois', 'Cinq à six fois', 'Sept ou plus'],
    refluxo: ['Brûlure légère', 'Après les repas', 'Plusieurs fois dans la journée', 'A gêné pour manger', 'Impossible de m’allonger'],
    fadiga: ['Fatigue légère', 'Fatigue plus rapide', 'J’ai dû lever le pied', 'J’ai dû m’allonger', 'Impossible de sortir du lit'],
    cefaleia: ['Un élancement', 'Un peu gênant', 'J’ai dû prendre un antalgique', 'A gêné la journée', 'Volets fermés, dans le noir'],
    tontura: ['Léger déséquilibre', 'En me levant vite', 'Plusieurs fois dans la journée', 'J’ai dû me retenir', 'Impossible de tenir debout'],
    /* ⚠️ LE VOMISSEMENT SE COMPTE, IL NE SE GRADUE PAS : « a gêné la
       journée » ne dit rien sur le fait de vomir, et le nombre de fois est
       ce que l'équipe va demander. */
    vomito: ['Une fois', 'Deux fois', 'Trois fois', 'Quatre ou plus', 'Je n’ai pas pu m’arrêter'],
    dor: ['Une gêne', 'Crampe légère', 'Crampe constante', 'J’ai dû arrêter ma journée', 'Douleur qui n’est pas passée'],
  },

  /* ⚠️ LES CLÉS SONT DES DONNÉES ET NE SE TRADUISENT PAS : 'normal',
     'preso', 'solto' et 'alterna' sont ce qui reste enregistré dans `gut`.
     Seule l'étiquette vient d'ici.

     ⚠️ ET « ALTERNÉ » EST UNE VALEUR DE PREMIÈRE CLASSE, pas un cas
     bizarre. Se bloquer et se relâcher sont les deux bouts du même effet —
     le médicament ralentit tout le tube digestif. */
  intestino: {
    normal: 'Normal',
    preso: 'Bloqué',
    solto: 'Relâché',
    alterna: 'Alterné',
  },

  nomes: {
    nausea: 'Nausée',
    intestino: 'Transit',
    vomito: 'Vomissement',
    dor: 'Douleur abdominale',
    refluxo: 'Reflux',
    fadiga: 'Fatigue',
    cefaleia: 'Mal de tête',
    tontura: 'Vertige',
    outro: 'Autre',
    preso: 'Transit bloqué',
    solto: 'Transit relâché',
  },
};
