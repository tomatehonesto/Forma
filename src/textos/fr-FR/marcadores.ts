/* ============================================================
   LES MARQUEURS D'ANALYSE — le plus gros bloc de texte clinique · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/marcadores.ts. Celles qui commandent
   cette traduction :

   ⚠️⚠️ LES CLÉS DE CES TABLES NE SE TRADUISENT PAS. « HbA1c », « Glicemia
   jejum », « Ferritina » sont ce qui reste ENREGISTRÉ dans le relevé de
   l'analyse, dans `e.marker` — ce ne sont pas des étiquettes d'écran, ce
   sont des données. Les traduire romprait le lien entre l'analyse notée
   l'an dernier et la table nouvelle. C'est pour ça que `nome` existe : la
   clé est la donnée, le nom est l'écran.

   ⚠️⚠️ ET CE N'EST PAS UNE TRADUCTION D'ÉTIQUETTE — C'EST LE NOM DU
   LABORATOIRE. Aux États-Unis, TGO et TGP s'appellent AST et ALT ; en
   France, en Belgique et en Suisse, ce sont **ASAT** et **ALAT**. Ce n'est
   pas le même mot dans une autre langue : c'est ce qui est imprimé sur le
   papier que la personne a dans la main, et si l'écran dit autre chose,
   elle ne retrouve pas sa ligne.

   ⚠️ ET AUCUN DE CES TEXTES NE PEUT DEVENIR UNE CONDUITE EN TRADUISANT.
   Les verrous sont écrits dans chaque section : ce sont eux qui séparent
   une application qui explique d'une application qui prescrit.
   ============================================================ */

export type SobreOMarcador = { oQueE: string; porQue: string; afeta: string };

const NOME: Record<string, string> = {
  'HbA1c': 'HbA1c',
  'Glicemia jejum': 'Glycémie à jeun',
  'Insulina': 'Insuline',
  'Colesterol total': 'Cholestérol total',
  'HDL': 'HDL',
  'LDL': 'LDL',
  'Triglicerídeos': 'Triglycérides',
  'Creatinina': 'Créatinine',
  /* ⚠️ ASAT ET ALAT, et non TGO et TGP. Voir l'en-tête : c'est le nom du
     compte rendu français, pas une traduction. */
  'TGO': 'ASAT',
  'TGP': 'ALAT',
  'TSH': 'TSH',
  'T4 livre': 'T4 libre',
  'Vitamina D': 'Vitamine D',
  'Vitamina B12': 'Vitamine B12',
  'Ferritina': 'Ferritine',
};

/* ⚠️ LA MAJUSCULE AU MILIEU DE LA PHRASE EST UNE RÈGLE DE LANGUE, et les
   lettres accentuées du français ne sont pas celles du portugais : ici
   entrent le è, le ë, le ï, le û, et sortent le ã et le õ. « Vitamine D »
   devient « vitamine D » au milieu d'une phrase, mais « HbA1c », « HDL » et
   « ASAT » restent tels quels : seule tombe la majuscule de celui dont le
   PREMIER MOT est entièrement en minuscules après l'initiale, ce qui est
   le dessin d'un nom commun et non d'un sigle. */
const NO_MEIO = (nome: string) => {
  const p1 = nome.split(' ')[0];
  return /^[A-ZÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ][a-zàâäéèêëîïôöùûüç]+$/.test(p1) ? nome[0].toLowerCase() + nome.slice(1) : nome;
};

/* ⚠️ AUCUNE DÉFINITION NE CITE UN AUTRE MARQUEUR NI UN TERME DE COMPTE
   RENDU. La règle : si la phrase a besoin d'une seconde phrase pour être
   comprise, ce n'est pas une définition, c'est une entrée de dictionnaire.

   ⚠️ ET AUCUNE NE DIT SI C'EST BON. Une définition qui laisse entendre un
   diagnostic est un diagnostic déguisé en glossaire ; celui qui lit le
   résultat est celui qui suit la personne.

   ⚠️ `afeta` EST UN COMPLÉMENT, PAS UNE PHRASE. Il arrive toujours après un
   verbe qui porte déjà la réserve — « ça fait une différence… », « c'est
   bon signe… » — et commence donc par la préposition. Écrit comme phrase
   entière, chaque marqueur devrait s'accorder en genre avec son propre nom,
   et « Votre ferritine est bon » est le genre d'erreur qui n'apparaît qu'en
   production. */
const SOBRE = {
  'HbA1c': {
    oQueE: 'La quantité de sucre restée accrochée aux globules rouges du sang.',
    porQue: 'Comme ces globules vivent près de trois mois, le résultat raconte la moyenne du sucre sur cette période, et pas seulement celle du jour de la prise de sang.',
    afeta: 'pour le contrôle du sucre au fil des mois',
  },
  'Glicemia jejum': {
    oQueE: 'La quantité de sucre dans le sang après plusieurs heures sans manger.',
    porQue: 'C’est la mesure la plus directe de la façon dont le corps gère le glucose au repos.',
    afeta: 'pour la façon dont le corps gère le sucre',
  },
  'Insulina': {
    oQueE: 'L’hormone qui fait sortir le sucre du sang pour le faire entrer dans les cellules.',
    porQue: 'Quand elle est haute, c’est en général le signe que le corps doit en produire davantage pour faire le même travail.',
    afeta: 'pour l’effort que fait le corps à tenir le sucre en ordre',
  },
  'Colesterol total': {
    oQueE: 'Tout le cholestérol qui circule dans votre sang, additionné.',
    porQue: 'Seul, il dit peu de chose, parce qu’il met dans un même total des cholestérols qui font des choses opposées dans le corps.',
    afeta: 'pour la santé des artères au fil des années',
  },
  'HDL': {
    oQueE: 'Le cholestérol qui fait le ménage : il ramasse de la graisse dans les artères et l’emporte.',
    porQue: 'C’est la seule analyse de cholestérol où un chiffre plus haut est la bonne nouvelle.',
    afeta: 'pour le nettoyage de la graisse dans les artères',
  },
  'LDL': {
    oQueE: 'Le cholestérol qui transporte la graisse vers les tissus du corps.',
    porQue: 'En excès, c’est lui qui s’accumule dans la paroi des artères au fil des années.',
    afeta: 'pour la santé des artères au fil des années',
  },
  'Triglicerídeos': {
    oQueE: 'La graisse qui circule dans le sang, venue de ce qu’on mange et du foie.',
    porQue: 'Ils répondent vite à l’alimentation et au poids, et c’est pour ça qu’ils bougent souvent les premiers dans un traitement.',
    afeta: 'pour la graisse dans le sang et pour le cœur',
  },
  'Creatinina': {
    oQueE: 'Un déchet que le muscle produit en permanence et que le rein élimine.',
    porQue: 'Comme c’est le rein qui la retire du sang, ce qu’il en reste est l’une des façons de voir s’il suit.',
    afeta: 'pour le travail des reins',
  },
  'TGO': {
    oQueE: 'Une substance qui reste enfermée dans les cellules du foie et du muscle.',
    porQue: 'Elle n’apparaît dans le sang que lorsque ces cellules se rompent — d’où son rôle d’alerte quand quelque chose irrite le foie.',
    afeta: 'pour la santé du foie',
  },
  'TGP': {
    oQueE: 'Une substance qui reste enfermée presque uniquement dans les cellules du foie.',
    porQue: 'Comme elle n’existe presque pas ailleurs dans le corps, quand elle apparaît dans le sang l’adresse est bien plus sûre.',
    afeta: 'pour la santé du foie',
  },
  'TSH': {
    oQueE: 'Le message que le cerveau envoie à la thyroïde pour lui demander de travailler.',
    porQue: 'Elle monte quand la thyroïde est lente et baisse quand elle s’emballe — c’est le thermostat, pas la température.',
    afeta: 'pour le rythme du métabolisme',
  },
  'T4 livre': {
    oQueE: 'L’hormone que produit la thyroïde, dans la part que le corps peut utiliser.',
    porQue: 'Elle montre ce que la thyroïde livre vraiment, et c’est pour ça qu’elle vient toujours en duo avec l’analyse précédente.',
    afeta: 'pour le rythme du métabolisme',
  },
  'Vitamina D': {
    oQueE: 'La vitamine que le corps fabrique avec le soleil et absorbe dans l’alimentation.',
    porQue: 'Elle participe à l’absorption du calcium et au fonctionnement du muscle et de l’immunité.',
    afeta: 'pour les os, le muscle et l’immunité',
  },
  'Vitamina B12': {
    oQueE: 'Une vitamine qui vient des aliments d’origine animale.',
    porQue: 'Elle est nécessaire aux globules rouges et aux nerfs, et qui en mange moins la surveille en général de plus près.',
    afeta: 'pour les nerfs et la fabrication du sang',
  },
  'Ferritina': {
    oQueE: 'La réserve de fer du corps — ce qui reste stocké à l’intérieur des cellules.',
    porQue: 'C’est pour ça qu’elle montre le stock, et non le fer qui circule dans le sang aujourd’hui.',
    afeta: 'pour la réserve de fer, qui soutient l’énergie',
  },
} satisfies Record<string, SobreOMarcador>;

/* ============================================================
   CE QUI FAIT BOUGER CE CHIFFRE

   ⚠️ C'EST LA PARTIE QUI REND L'ANALYSE COMPRÉHENSIBLE. Savoir que la
   ferritine est la réserve de fer aide à lire le mot. Ça n'aide pas à
   comprendre pourquoi elle a changé — et « pourquoi ça a changé » est la
   question que la personne emporte de l'écran dans sa vie.

   ⚠️ ET AUCUN ÉLÉMENT NE DIT QUOI FAIRE. « De l'alcool les jours
   précédents » est un fait sur le marqueur ; « arrêtez de boire » serait
   une conduite, et la conduite appartient à qui suit la personne. La ligne
   entre instruire et prescrire passe exactement ici.

   ⚠️ CE SONT DES CAUSES COURANTES, ET NON LA LISTE COMPLÈTE.
   ============================================================ */
const INFLUENCIAS = {
  'HbA1c': [
    'La moyenne du glucose des deux à trois derniers mois, et non ce que vous avez mangé hier',
    'L’anémie et les maladies du sang, qui changent la durée de vie des globules rouges et faussent le résultat',
    'La perte de poids et les médicaments du glucose, qui la font en général baisser au fil des mois',
  ],
  'Glicemia jejum': [
    'Le nombre d’heures de jeûne avant la prise de sang',
    'Le mauvais sommeil et le stress de la veille, qui élèvent le sucre du matin',
    'L’exercice et la perte de poids, qui ont tendance à la faire baisser',
  ],
  'Insulina': [
    'Le jeûne avant la prise de sang, autant que pour la glycémie',
    'La quantité de masse grasse, qui est ce qui pèse le plus dans le calcul',
    'Elle se lit en général avec la glycémie, et non toute seule',
  ],
  'Colesterol total': [
    'Ce qu’on mange comme graisses, mais moins que sa réputation ne le laisse croire',
    'La génétique — certaines familles produisent plus de cholestérol indépendamment de l’alimentation',
    'Une thyroïde lente, qui l’élève sans rapport avec la nourriture',
  ],
  'HDL': [
    'L’exercice d’endurance régulier, qui est ce qui l’élève le plus',
    'Le tabac, qui le réduit',
    'La génétique, qui pèse lourd sur celui-ci en particulier',
  ],
  'LDL': [
    'Les graisses saturées et trans dans l’alimentation',
    'La perte de poids, qui le réduit en général avec les triglycérides',
    'La génétique, qui domine le résultat dans certaines familles',
  ],
  'Triglicerídeos': [
    'Le jeûne — manger près de la prise de sang change beaucoup, plus que pour tout autre du bilan',
    'L’alcool les jours précédents',
    'Le sucre et la farine en excès, que le corps transforme en graisse',
  ],
  'Creatinina': [
    'La masse musculaire de la personne, puisqu’elle vient du muscle',
    'L’hydratation le jour de la prise de sang',
    'Un entraînement dur la veille, qui peut l’élever passagèrement',
  ],
  'TGO': [
    'L’exercice intense les jours précédents, parce qu’elle existe aussi dans le muscle',
    'L’alcool',
    'La graisse dans le foie, courante en cas d’excès de poids',
  ],
  'TGP': [
    'La graisse dans le foie, qui est la cause la plus courante d’une élévation légère',
    'L’alcool et certains médicaments',
    'La perte de poids, qui la réduit en général au fil des mois',
  ],
  'TSH': [
    'L’heure de la prise de sang — elle est plus haute la nuit et en début de matinée',
    'Les maladies aiguës et certains médicaments',
    'Un traitement hormonal thyroïdien, quand il y en a un',
  ],
  'T4 livre': [
    'Le fonctionnement de la thyroïde, lu toujours avec la TSH',
    'La grossesse et les œstrogènes, qui changent les protéines qui la transportent',
  ],
  'Vitamina D': [
    'Le soleil sur la peau — la quantité, l’heure et la surface exposée',
    'Une peau plus foncée et la crème solaire, qui réduisent la production',
    'La supplémentation, quand il y en a une',
    'La saison : l’hiver la fait souvent chuter',
  ],
  'Vitamina B12': [
    'Les aliments d’origine animale dans l’alimentation',
    'La chirurgie bariatrique et certains médicaments de l’estomac, qui réduisent l’absorption',
    'La supplémentation, quand il y en a une',
  ],
  'Ferritina': [
    'La réserve de fer du corps',
    'L’inflammation et l’infection, qui l’élèvent même sans excès de fer — c’est pour ça qu’elle ne se lit jamais seule',
    'Des règles abondantes, qui réduisent la réserve au fil du temps',
  ],
} satisfies Record<string, string[]>;

/* ============================================================
   CE QUI AIDE EN GÉNÉRAL

   ⚠️ C'EST LA PARTIE DANGEREUSE DU FICHIER, ET ELLE A QUATRE VERROUS.

   Une liste de « comment améliorer votre analyse » est, sans précaution,
   une prescription déguisée en conseil — et la prescription appartient à
   qui suit la personne. Ce qui justifie son existence est l'inverse de ce
   qui la rendrait fausse : la prise de sang est le document de santé que
   le moins de gens comprennent, et laisser quelqu'un seul avec un chiffre
   et une fourchette, c'est l'abandonner à l'endroit le plus difficile.

   LES VERROUS :

   1. RIEN ICI NE PARLE DE MÉDICAMENT. Aucun élément ne dit de commencer,
      d'arrêter, d'augmenter ou de diminuer quoi que ce soit — et là où la
      supplémentation est le sujet, la phrase dit « quand elle est indiquée
      par qui vous suit », qui est le fait.

   2. RIEN ICI N'A DE DOSE, DE QUANTITÉ NI DE DÉLAI. « L'exposition au
      soleil est la source principale » est une information ; « vingt
      minutes par jour » est une ordonnance, et une ordonnance doit venir de
      quelqu'un qui a examiné la personne.

   3. RIEN ICI NE PROMET DE RÉSULTAT. Les éléments disent ce qu'on SAIT du
      marqueur — que manger du fer avec de la vitamine C améliore
      l'absorption —, et non ce qui va arriver au chiffre de qui lit.

   4. RIEN ICI NE CONCERNE LA THYROÏDE NI LE REIN. TSH, T4 et créatinine
      sont restées dehors exprès : dans le premier cas, ce qui fait bouger
      le chiffre est un médicament ; dans le second, les conseils les plus
      évidents (boire de l'eau, manger des protéines) sont justement ceux
      qu'une personne dont le rein va mal ne doit pas suivre de son propre
      chef. Un marqueur sans élément honnête n'a pas de section.
   ============================================================ */
export type JeitoDeAjudar = { grupo: string; itens: { nome: string; detalhe: string }[] };

const AJUDAR = {
  'HbA1c': [
    {
      grupo: 'Dans l’assiette',
      itens: [
        { nome: 'Des glucides à absorption lente', detalhe: 'Céréales complètes, légumes secs et légumes élèvent le glucose plus lentement que la farine blanche et le sucre' },
        { nome: 'Protéines et fibres au même repas', detalhe: 'Elles réduisent le pic de glucose de ce qu’on mange avec' },
      ],
    },
    {
      grupo: 'Dans le mouvement',
      itens: [
        { nome: 'Marcher après le repas', detalhe: 'Le muscle en activité consomme du glucose sans dépendre de l’insuline' },
        { nome: 'De l’exercice régulier', detalhe: 'Il améliore la sensibilité à l’insuline, et l’effet s’accumule au fil des semaines' },
      ],
    },
  ],
  'Glicemia jejum': [
    {
      grupo: 'Dans la routine',
      itens: [
        { nome: 'Le sommeil', detalhe: 'Les nuits courtes élèvent le glucose du lendemain matin' },
        { nome: 'Un dernier repas plus tôt', detalhe: 'Manger juste avant de dormir se voit souvent dans le jeûne du lendemain' },
      ],
    },
    {
      grupo: 'Dans le mouvement',
      itens: [
        { nome: 'L’activité d’endurance', detalhe: 'Elle réduit la glycémie à jeun au fil des semaines, pas des jours' },
      ],
    },
  ],
  'Insulina': [
    {
      grupo: 'Dans le poids et le mouvement',
      itens: [
        { nome: 'La baisse de la masse grasse', detalhe: 'C’est ce qui réduit le plus l’insuline nécessaire pour le même travail' },
        { nome: 'Le renforcement musculaire', detalhe: 'Plus de masse musculaire, c’est plus d’endroits où le glucose peut aller' },
      ],
    },
  ],
  'Colesterol total': [
    {
      grupo: 'Dans l’assiette',
      itens: [
        { nome: 'Moins de graisses saturées et trans', detalhe: 'Fritures, charcuterie et produits ultratransformés en sont les sources les plus courantes' },
        { nome: 'Des fibres solubles', detalhe: 'Avoine, légumes secs et fruits réduisent l’absorption du cholestérol dans l’intestin' },
      ],
    },
  ],
  'HDL': [
    {
      grupo: 'Dans le mouvement',
      itens: [
        { nome: 'L’exercice d’endurance', detalhe: 'C’est ce qui élève le plus le HDL, et l’effet dépend de la régularité' },
      ],
    },
    {
      grupo: 'Dans l’assiette',
      itens: [
        { nome: 'Les bonnes graisses', detalhe: 'Huile d’olive, avocat, fruits à coque et poissons gras' },
      ],
    },
  ],
  'LDL': [
    {
      grupo: 'Dans l’assiette',
      itens: [
        { nome: 'Moins de graisses saturées', detalhe: 'Ce sont elles qui élèvent le plus le LDL — viandes grasses, laitages entiers, fritures' },
        { nome: 'Des fibres solubles', detalhe: 'Avoine, haricots, lentilles et fruits avec la peau' },
      ],
    },
    {
      grupo: 'Dans le poids',
      itens: [
        { nome: 'La perte de poids', detalhe: 'Elle réduit en général le LDL et les triglycérides ensemble' },
      ],
    },
  ],
  'Triglicerídeos': [
    {
      grupo: 'Dans l’assiette',
      itens: [
        { nome: 'Moins de sucre et de farine', detalhe: 'L’excès devient de la graisse dans le foie, et c’est ce qui élève le plus ce marqueur' },
        { nome: 'L’alcool', detalhe: 'C’est la cause isolée la plus courante de triglycérides hauts' },
      ],
    },
    {
      grupo: 'Dans le mouvement',
      itens: [
        { nome: 'L’activité d’endurance', detalhe: 'Les triglycérides sont parmi les marqueurs qui répondent le plus vite' },
      ],
    },
  ],
  'TGO': [
    {
      grupo: 'Du côté du foie',
      itens: [
        { nome: 'L’alcool', detalhe: 'C’est la cause la plus courante d’élévation des deux enzymes' },
        { nome: 'La perte de poids', detalhe: 'Elle réduit la graisse dans le foie, qui est l’autre cause courante' },
      ],
    },
  ],
  'TGP': [
    {
      grupo: 'Du côté du foie',
      itens: [
        { nome: 'La perte de poids', detalhe: 'La graisse dans le foie est la cause la plus courante d’une élévation légère, et elle répond au poids' },
        { nome: 'L’alcool', detalhe: 'Il disparaît du calcul quand il disparaît de la routine' },
      ],
    },
  ],
  'Vitamina D': [
    {
      grupo: 'Au soleil',
      itens: [
        { nome: 'L’exposition de la peau', detalhe: 'C’est la source principale — la crème solaire et les vêtements couvrants réduisent la production' },
      ],
    },
    {
      grupo: 'Dans l’assiette et la supplémentation',
      itens: [
        { nome: 'Poissons gras, jaune d’œuf et champignons', detalhe: 'Ce sont les sources alimentaires, et elles sont rarement suffisantes à elles seules' },
        { nome: 'La supplémentation', detalhe: 'Quand elle est indiquée par la personne qui vous suit — la dose dépend de votre niveau' },
      ],
    },
  ],
  'Vitamina B12': [
    {
      grupo: 'Dans l’assiette',
      itens: [
        { nome: 'L’origine animale', detalhe: 'Viandes, œufs, lait et produits laitiers en sont les seules sources naturelles' },
      ],
    },
    {
      grupo: 'Dans l’absorption',
      itens: [
        { nome: 'Les médicaments de l’estomac', detalhe: 'Un usage prolongé réduit l’absorption — un sujet à emporter en consultation' },
        { nome: 'La supplémentation', detalhe: 'Quand elle est indiquée par la personne qui vous suit, surtout après une chirurgie bariatrique' },
      ],
    },
  ],
  'Ferritina': [
    {
      grupo: 'Dans l’assiette',
      itens: [
        { nome: 'Le fer d’origine animale', detalhe: 'Viande rouge, foie et fruits de mer sont les mieux absorbés' },
        { nome: 'De la vitamine C avec', detalhe: 'Orange, kiwi et poivron améliorent l’absorption du fer des végétaux' },
        { nome: 'Le café et le thé à distance du repas', detalhe: 'Ils gênent l’absorption quand ils sont pris pendant' },
      ],
    },
  ],
} satisfies Record<string, JeitoDeAjudar[]>;

export const marcadores = {
  /* ---------- les catégories ---------- */
  /* Ce sont les seules étiquettes d'écran de ce fichier, et donc les seules
     qui se traduisent sans réserve. QUELS marqueurs entrent dans chaque
     catégorie n'est pas une décision de langue — c'est du contenu clinique,
     et ça vit dans logic/derive avec les clés. */
  catMetabolico: 'Métabolique',
  catLipidico: 'Lipidique',
  catFigadoRim: 'Foie & rein',
  catTireoide: 'Thyroïde',
  catVitaminas: 'Vitamines',

  nome: NOME,
  noMeio: NO_MEIO,
  sobre: SOBRE,
  influencias: INFLUENCIAS,
  ajudar: AJUDAR,
};
