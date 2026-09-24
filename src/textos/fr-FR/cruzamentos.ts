/* ============================================================
   LES CROISEMENTS — ce que ses relevés disent quand on les croise · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/cruzamentos.ts. Celles qui valent
   pour le fichier entier :

   AUCUNE DE CES PHRASES NE PEUT DEVENIR UN CONSEIL. « L'eau aide pour la
   satiété » est une information ; « buvez plus d'eau » est un ordre, et un
   ordre fondé sur la statistique de treize relevés est le pire des deux
   mondes.

   ET LE SUJET EST LE PHÉNOMÈNE, PAS LA PERSONNE. « Votre hydratation
   baisse le dimanche », et non « vous buvez moins le dimanche » — c'est le
   même fait avec le doigt pointé.

   ⚠️ CHAQUE TROUVAILLE A JUSQU'À QUATRE MOUVEMENTS, non interchangeables :
   `titulo` (la manchette), `texto` (les chiffres qui la tiennent),
   `porque` (le mécanisme) et `significa` (le « et alors ? »). Traduire
   `significa` comme un résumé du `texto` défait la carte : il existe pour
   dire ce que les chiffres NE disent pas.

   ⚠️ ET LE PIÈGE FRANÇAIS EST PARTOUT ICI, parce que ce fichier parle de
   ce que la personne a fait. Chaque passé composé passe par AVOIR — « vous
   avez perdu », « vos protéines ont baissé » —, jamais par être, qui
   accorderait le participe avec qui lit.
   ============================================================ */

/* ⚠️ EN FRANÇAIS, MOINS DE DEUX EST SINGULIER : « 1,6 verre », « 0,5
   verre », et « 2 verres ». Le nombre arrive déjà formaté, virgule
   comprise ; c'était « 1,6 verres » partout. */
const verre = (n: string) => (parseFloat(n.replace(',', '.')) < 2 ? 'verre' : 'verres');

export const cruzamentos = {
  /* ---------- les étiquettes de catégorie ---------- */
  catAlimentacao: 'Alimentation',
  catSono: 'Sommeil',
  catSintomas: 'Symptômes',
  catPeso: 'Poids',
  catAplicacoes: 'Piqûres',

  /* ---------- les jours de la semaine, tels qu'ils entrent dans la phrase ---------- */
  /* ⚠️ ILS ARRIVENT AVEC LEUR ARTICLE, et non nus. « Votre hydratation
     baisse dimanche » parle d'un dimanche précis, celui qui vient ; « le
     dimanche » est l'habitude, et c'est de l'habitude qu'il s'agit. Le
     français met le même « le » aux sept, là où le portugais partage entre
     « aos » et « às » — la liste reste quand même le bon endroit, puisque
     c'est l'article qui porte le sens. */
  nomesDia: ['le dimanche', 'le lundi', 'le mardi', 'le mercredi', 'le jeudi', 'le vendredi', 'le samedi'],

  /* ---------- 1. le week-end comme un autre traitement ---------- */
  /* ⚠️ « UN AUTRE TRAITEMENT », ET NON « VOTRE PIRE MOMENT ». La trouvaille
     croise trois variables, et deux d'entre elles s'améliorent le week-end
     (le sommeil monte). La manchette nomme la différence sans dire quel
     côté est le mauvais. */
  fimDeSemana: {
    titulo: 'Votre week-end fonctionne comme un autre traitement',
    texto: (copos: string, proteina: string, sono: string) =>
      `Samedi et dimanche, vous buvez ${copos} ${verre(copos)} de moins${proteina}${sono}`,
    /* Morceau facultatif : n'entre que quand l'écart de protéines est assez
       grand — le seuil et sa raison sont dans logic/derive. */
    textoProteina: (gramas: number) => ` et mangez ${gramas} g de protéines en moins`,
    /* ⚠️ LE SOMMEIL EST LA BONNE NOUVELLE DANS LA MAUVAISE, et c'est pour ça
       qu'il ferme la phrase : « le repos s'améliore ; c'est la routine qui
       se relâche » est toute la trouvaille en une ligne, et c'est ce qui
       empêche la carte de devenir un reproche. */
    textoSono: (horas: string) => ` — mais vous dormez ${horas} h de plus. Le repos s’améliore ; c’est la routine qui se relâche.`,
    textoSemSono: '.',
    q: 'Comment mieux tenir le week-end ?',
    evid: (copos: string) => ({ valor: `−${copos}`, unidade: verre(copos), legenda: 'le samedi et le dimanche' }),
    porque: 'La routine de la semaine porte votre hydratation et vos repas sans que vous ayez à y penser : des horaires fixes, la bouteille sur le bureau, le déjeuner à la même heure. Le samedi, cette structure disparaît, et il reste à tout décider sur le moment — exactement quand décider est le plus difficile.',
    /* ⚠️ « IL NE FAUT PAS UNE DISCIPLINE NOUVELLE » est toute la phrase. Qui
       lit ceci sait déjà que le week-end est plus dur ; ce qu'elle ne sait
       pas, c'est que le problème est de structure et non de volonté. */
    significa: 'Deux jours par semaine, le traitement se retrouve sans sa structure, et ce sont justement les jours où vous avez le plus de temps. Il ne faut pas une discipline nouvelle — il faut que le week-end ait sa propre routine, au lieu d’être l’absence de celle de la semaine.',
  },

  /* ---------- 2. le jour faible en hydratation ---------- */
  aguaDia: {
    /* ⚠️ LE SUJET EST L'HYDRATATION, ET C'ÉTAIT LA PERSONNE. « Vous buvez
       bien moins d'eau le dimanche » est le même fait avec le doigt pointé
       — et c'était le seul des cinq sous cette forme : les quatre autres
       disent « la balance est montée », « vos protéines ont baissé »,
       « votre rythme est de ». */
    titulo: (dia: string) => `Votre hydratation baisse ${dia}`,
    texto: (pior: string, outros: string) =>
      `Environ ${pior} ${verre(pior)}, contre ${outros} les autres jours. L’eau aide pour la satiété et pour la nausée — et c’est le jour où ces deux-là pèsent le plus souvent.`,
    q: 'Où en est mon hydratation ?',
    /* ⚠️ « CONTRE », ET NON « DE ». L'anglais écrit « 3, of 6 glasses » et
       le portugais « 3, de 6 copos » ; en français « 3 de 6 verres » serait
       une fraction, alors que le chiffre du dessous est celui des AUTRES
       jours. */
    evid: (pior: string, outros: string) =>
      ({ valor: pior, unidade: `contre ${outros} ${verre(outros)}`, legenda: 'la moyenne ce jour-là' }),
    /* La valeur de la trouvaille, c'est que le problème a une adresse : un
       jour fixe se règle avec un rappel, surveiller l'hydratation tous les
       jours non. */
    significa: 'Un jour de la semaine tire votre moyenne vers le bas à lui tout seul. Comme c’est toujours le même, un seul rappel suffit à le régler, au lieu de surveiller l’hydratation tous les jours.',
  },

  /* ---------- 3. les protéines d'aujourd'hui contre la faim de demain ---------- */
  /* ⚠️ LA TROUVAILLE EST LE DÉCALAGE D'UN JOUR, et non les protéines. La
     relation disparaît du graphique quotidien parce que la personne voit la
     faim d'aujourd'hui à côté de l'assiette d'aujourd'hui, jamais de celle
     d'hier — et c'est cela que la carte lui rend. */
  proteinaFome: {
    titulo: 'Les jours où vous atteignez l’objectif de protéines, le lendemain est plus facile',
    /* ⚠️ « IL PASSE INAPERÇU », et non « difficile à remarquer toute
       seule » : le portugais met là un adjectif qui s'accorde avec qui lit,
       et le français le mettrait au féminin ou au masculin — donc il
       affirmerait. Le sujet redevient l'effet. */
    texto: (meta: number, comMeta: string, semMeta: string) =>
      `Après avoir atteint les ${meta} g, votre faim du lendemain est restée à ${comMeta}. Les jours sans l’objectif, ${semMeta}. L’effet n’apparaît pas le jour même — c’est pour ça qu’il passe inaperçu.`,
    q: 'Où en sont mes protéines ?',
    evid: (diferenca: string) =>
      ({ valor: `−${diferenca}`, unidade: 'de faim', legenda: 'le lendemain d’un objectif atteint' }),
    porque: 'Les protéines agissent sur la satiété par un chemin plus lent que celui du sucre : elles mettent du temps à quitter l’estomac et entretiennent les signaux de satiété pendant des heures. L’effet traverse donc la nuit et réapparaît dans l’appétit du lendemain matin.',
    /* ⚠️ « PAS SEULEMENT REMPLIR UN TABLEAU » est ce qui sort l'objectif de
       protéines de la place de l'obligation pour le mettre dans celle de
       l'échange — et la dernière phrase donne l'usage pratique sans rien
       ordonner. */
    significa: 'Atteindre l’objectif de protéines n’est pas seulement remplir un tableau : c’est s’acheter un lendemain plus tranquille. Quand la faim serre, ce qui la règle n’est pas ce que vous mangez à ce moment-là — c’est ce que vous avez mangé hier.',
  },

  /* ---------- 4. le sommeil contre la faim du lendemain ---------- */
  sonoFome: {
    titulo: 'Dormir plus de sept heures retient votre faim du lendemain',
    texto: (comSono: string, semSono: string) =>
      `Après des nuits complètes, votre faim est restée à ${comSono} ; après des nuits courtes, ${semSono}. Votre appétit répond au sommeil de la veille autant qu’à ce que vous avez mangé.`,
    q: 'Quoi noter avant de dormir ?',
    evid: { valor: '7 h', unidade: '+', legenda: 'le point où votre faim change' },
    /* ⚠️ « CE N'EST PAS UN MANQUE DE DISCIPLINE » est le cœur, pas un
       adoucissement. Qui a mal dormi et mangé davantage le lendemain s'en
       veut ; le mécanisme hormonal est le fait qui défait la culpabilité. */
    porque: 'Dormir peu touche aux deux hormones qui règlent l’appétit : celle qui donne faim monte, et celle qui prévient que ça suffit baisse. Ce n’est pas un manque de discipline le lendemain — c’est votre corps qui réclame de l’énergie rapide pour compenser le repos qui a manqué.',
    significa: 'Le sommeil entre rarement dans les comptes quand on soigne son poids, mais dans vos données il touche à l’appétit comme peu de choses. Une nuit protégée peut valoir plus pour le lendemain que n’importe quel ajustement dans l’assiette.',
  },

  /* ---------- 5. le sommeil contre la nausée du lendemain ---------- */
  /* ⚠️ C'EST LA SEULE TROUVAILLE QUI RELIE UNE HABITUDE À UN SYMPTÔME
     CLINIQUE, et son `significa` est donc le plus prudent du fichier : il
     DÉFAIT la lecture causale que le titre invite à faire. Se tromper ici ne
     coûte pas un mauvais conseil sur l'eau — ça coûte de faire conclure à
     quelqu'un que sa nausée est la faute d'une mauvaise nuit. */
  sonoEnjoo: {
    titulo: 'Après les nuits longues, votre nausée est plus faible',
    texto: (horas: number, comSono: string, semSono: string) =>
      `Les jours qui suivent une nuit de ${horas} h ou plus, votre nausée est restée à ${comSono}. Après les nuits courtes, ${semSono} — sur une échelle de 5.`,
    q: 'Pourquoi ai-je des nausées ?',
    evid: (comSono: string, semSono: string, noites: number) =>
      ({ valor: comSono, unidade: `contre ${semSono}`, legenda: `la nausée après ${noites} nuits longues` }),
    significa: 'C’est ce que montrent vos relevés, et non un lien de cause : le cycle de la piqûre joue sur la nausée plus que tout le reste, et il peut être derrière les deux côtés du calcul. À prendre comme une piste à emporter chez votre équipe, pas comme une explication arrêtée.',
  },

  /* ---------- 6. la fenêtre de la nausée ---------- */
  /* La trouvaille n'est pas qu'il y a de la nausée — c'est qu'elle a une
     heure de fin. */
  janelaEnjoo: {
    titulo: 'Votre nausée disparaît en général environ 48 heures après la piqûre',
    texto: (perto: string, longe: string) =>
      `Elle est à ${perto} les deux premiers jours et tombe à ${longe} à partir du troisième. Ce n’est pas le traitement entier qui donne la nausée — ce sont les 48 premières heures de chaque cycle.`,
    q: 'Pourquoi ai-je des nausées ?',
    evid: { valor: '48', unidade: 'heures', legenda: 'et ensuite ça passe' },
    /* ⚠️ LA DERNIÈRE PHRASE EST LA SEULE DU FICHIER QUI SUGGÈRE UNE ACTION,
       et elle le peut : choisir le jour de la piqûre est une décision de
       la personne avec son équipe, pas un changement de dose ni de
       médicament. */
    significa: (dias: number) =>
      `Cela s’est répété dans ${dias} de vos relevés d’après-piqûre. Savoir qu’il existe une fenêtre, et qu’elle se termine, change ce qu’on en fait : le jour de la piqûre peut se choisir pour que ces 48 h tombent sur la partie la plus légère de votre semaine.`,
  },

  /* ---------- 7. l'eau contre la nausée ---------- */
  aguaEnjoo: {
    titulo: 'Les jours où vous buvez bien, la nausée est plus faible',
    /* ⚠️ « ÇA NE PROUVE PAS LA CAUSE » EST DANS LA PHRASE, et non en note de
       bas de page. Toute la carte est une corrélation sur treize jours ; la
       réserve doit arriver collée au chiffre, parce que c'est là qu'on la
       lit. */
    texto: (corte: string, comAgua: string, semAgua: string) =>
      `À partir de ${corte}, votre nausée moyenne a été de ${comAgua}. En dessous, ${semAgua}. Ça ne prouve pas la cause — mais c’est, parmi ce qui apparaît lié au symptôme, la variable la plus facile à bouger.`,
    q: 'Comment faire baisser la nausée ?',
    evid: (diferenca: string) =>
      ({ valor: `−${diferenca}`, unidade: 'de nausée', legenda: 'les jours bien hydratés' }),
    significa: 'De tout ce qui apparaît lié à votre nausée, l’eau est ce qui est le plus à votre portée. Ça ne remplace pas d’en parler à votre équipe si elle serre, mais c’est la première chose à essayer avant.',
  },

  /* ---------- 8. le plateau qui n'a rien empêché ---------- */
  /* ⚠️ C'EST LA TROUVAILLE QUI ÉVITE L'ABANDON, et c'est pour ça qu'elle
     existe. La semaine où la balance monte est la semaine où les gens
     s'arrêtent — et la carte montre, avec ses chiffres à elle, que c'est
     déjà arrivé et que ça n'a pas voulu dire ce que ça avait l'air de
     vouloir dire. */
  platoQueNaoImpediu: {
    titulo: (altas: number, perdido: string) =>
      `La balance est montée ${altas} fois et vous avez perdu ${perdido} quand même`,
    texto: (pesagens: number, altas: number) =>
      `Sur ${pesagens} pesées, ${altas} étaient au-dessus de la précédente — et la tendance de fond continue de baisser. Une semaine en hausse n’est pas une rechute : c’est du bruit d’eau et de transit à l’intérieur d’une tendance.`,
    q: 'Où en est mon évolution ?',
    evid: (altas: number, perdido: string) =>
      ({ valor: String(altas), unidade: 'hausses', legenda: `dans −${perdido} sur la période` }),
    porque: 'Le poids du jour, c’est de la graisse, mais c’est aussi de l’eau, du sel, du transit et le cycle hormonal — des écarts d’un à deux kilos arrivent sans que rien n’ait changé dans la masse grasse. La graisse s’en va lentement et en ligne ; le reste oscille par-dessus, et c’est ce que la balance montre en premier.',
    significa: 'Cela compte plus qu’il n’y paraît : la semaine où la balance monte est la semaine où les gens abandonnent. Dans vos propres chiffres, elle n’a jamais voulu dire ce qu’elle avait l’air de vouloir dire.',
  },

  /* ---------- 9. les protéines au fil du traitement ---------- */
  /* Les deux moitiés de la phrase changent de direction ensemble, et la
     version qui baisse NE fait pas de reproche : « ça vaut le coup de
     reprendre avant que ça devienne la nouvelle normale » est le plus près
     d'une demande où ce fichier arrive, et c'est à propos d'une habitude,
     pas de la personne. */
  proteinaTendencia: {
    titulo: (subiu: boolean, pct: number) =>
      `Vos protéines ${subiu ? 'ont augmenté' : 'ont baissé'} de ${pct}% depuis le début`,
    textoSubiu: (depois: number, antes: number) =>
      `Moyenne de ${depois} g/jour ces dernières semaines, contre ${antes} g au début. Les protéines préservent la masse maigre pendant la perte de poids.`,
    textoCaiu: (depois: number, antes: number) =>
      `Moyenne de ${depois} g/jour ces dernières semaines, contre ${antes} g avant. Ça vaut le coup de reprendre — la masse maigre soutient le métabolisme.`,
    q: 'Où en sont mes protéines ?',
    evid: (pct: number, antes: number, depois: number) =>
      ({ valor: `${pct > 0 ? '+' : ''}${pct}%`, unidade: '', legenda: `${antes} → ${depois} g par jour` }),
    significaSubiu: 'Elles ont augmenté sans que vous l’ayez cherché, ce qui est en général le genre d’habitude qui reste. Les protéines protègent votre masse maigre pendant que le poids descend — sans elles, une partie de ce qui part n’est pas de la graisse.',
    significaCaiu: 'La baisse a été progressive, du genre qu’on ne remarque pas d’un jour à l’autre. Les protéines protègent votre masse maigre pendant que le poids descend ; ça vaut le coup de reprendre avant que ça devienne la nouvelle normale.',
  },

  /* ============================================================
     LES DEUX PORTRAITS, EN FIN DE FILE

     ⚠️ CES DEUX-LÀ DÉCRIVENT UN CHIFFRE QUE LA PERSONNE VOIT DÉJÀ SUR
     L'ACCUEIL, et ce ne sont donc pas des trouvailles : ce sont des
     portraits. Ils restent en dernier exprès.

     La raison de ce marquage est dans logic/derive — c'étaient les seuls
     sans condition autour, et ils ouvraient l'onglet, pour qui venait
     d'installer, sur « Vous avez tenu 0% des piqûres à la date ».
     ============================================================ */

  /* ---------- 10. le rythme ---------- */
  ritmo: {
    /* ⚠️ L’UNITÉ VIENT DE L’EXTÉRIEUR, elle n’est pas écrite ici : en
       impérial le rythme est en livres par semaine. Voir
       ../pt-BR/cruzamentos.ts. */
    titulo: (ritmo: string, unidade: string) => `Votre rythme est de ${ritmo} ${unidade} par semaine`,
    textoBom: (perdido: string, semanas: number) =>
      `${perdido} en ${semanas} semaines, dans ce qui est attendu pour votre phase.`,
    /* ⚠️ LA VERSION HORS DE L'ATTENDU NE DIAGNOSTIQUE PAS ET N'ALARME PAS :
       elle oriente. Un rythme trop rapide ou trop lent est une conversation
       de consultation, et la carte s'arrête exactement là. */
    textoAtencao: (perdido: string, semanas: number) =>
      `${perdido} en ${semanas} semaines. Ça vaut le coup d’en parler à votre équipe à la prochaine consultation.`,
    q: 'Où en est mon évolution ?',
    evid: (ritmo: string, unidade: string, perdido: string, semanas: number) =>
      ({ valor: ritmo, unidade: `${unidade}/sem`, legenda: `${perdido} en ${semanas} semaines` }),
    significaBom: 'C’est un rythme tenable, et c’est ce qui compte : les pertes trop rapides emportent souvent la masse maigre avec elles et reviennent ensuite. Le vôtre est dans l’intervalle que la littérature associe à un résultat qui tient.',
    /* ⚠️ « PAS AVEC MOI » — c'est la seule ligne de l'application qui dit, à
       la première personne, ce qu'elle NE fait pas. Elle existe parce que
       l'autre choix était de donner un avis sur un rythme qui peut avoir une
       cause clinique. */
    significaAtencao: 'Le rythme est une conversation à avoir avec votre équipe, pas avec moi. J’emporte le chiffre organisé pour la consultation si vous voulez.',
  },

  /* ---------- 11. l'assiduité ---------- */
  adesao: {
    tituloPerfeita: 'Vous n’avez pas eu une seule piqûre en retard depuis le début',
    titulo: (pct: number) => `Vous avez tenu ${pct}% des piqûres à la date`,
    texto: (aplicacoes: number, ressalva: string) =>
      `Cela fait ${aplicacoes} piqûres depuis le début du traitement, ${ressalva}.`,
    textoQuaseTodas: 'presque toutes à la bonne date',
    textoComAtrasos: 'avec quelques retards en chemin',
    q: 'Comment fonctionne le cycle du médicament ?',
    evid: (pct: number, aplicacoes: number) =>
      ({ valor: `${pct}%`, unidade: '', legenda: `${aplicacoes} piqûres depuis le début` }),
    significaAlta: 'Cette régularité est l’un des facteurs qui pèsent le plus dans une bonne réponse au médicament. Le niveau de la substance dans le corps dépend de la régularité, pas de l’effort — et c’est le genre de chose qui n’apparaît que quand quelqu’un regarde tout l’historique.',
    /* ⚠️ LA VERSION AVEC RETARDS EXPLIQUE LE COÛT ET NE REPROCHE PAS LE
       MANQUE. « Chaque retard laisse une fenêtre où l'effet baisse avant
       l'heure » est le mécanisme ; « essayez de ne pas être en retard »
       serait le reproche que cet écran ne fait pas. */
    significaBaixa: 'La régularité pèse plus que la dose exacte du jour : chaque retard laisse une fenêtre où l’effet baisse avant l’heure, et c’est là que la faim revient souvent plus fort.',
  },
};
