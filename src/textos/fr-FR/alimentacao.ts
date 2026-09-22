/* ============================================================
   L'ALIMENTATION — ce qu'on mange, ce qu'on boit et ce qui reste dehors · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/alimentacao.ts. Celle qui vaut pour
   le fichier entier : AUCUNE phrase d'ici n'est une prescription. Les
   lectures pointent ce que le comptage montre et proposent une prochaine
   assiette ; aucune ne dit à la personne qu'elle a tort, parce que
   l'application ne sait pas ce qu'elle a convenu avec son équipe.
   ============================================================ */

export const alimentacao = {
  /* ⚠️ CHAQUE PHRASE PORTE LE NOMBRE AVEC ELLE. « Votre petit-déjeuner
     apporte 9 g » se vérifie sur l'écran du dessous ; « vous vous en
     sortez bien au petit-déjeuner » ne se vérifie nulle part. Un compliment
     sans chiffre est la façon la plus rapide pour une application de
     sonner comme une carte de développement personnel.

     ⚠️ ET LA QUESTION DE CHAQUE CARTE EST À LA PREMIÈRE PERSONNE, comme la
     personne la poserait. Le champ du companion reçoit du texte, et un
     titre de section collé là se lirait comme une commande de machine. */
  conselhos: {
    fibraQ: 'Comment augmenter les fibres de ma journée sans me lasser de ce que je mange ?',
    fibraTitulo: (media: number) => `Fibres : ${media} g par jour`,
    /* ⚠️ LA SECONDE MOITIÉ EST LA RAISON POUR LAQUELLE CETTE CARTE EST LA
       PREMIÈRE : la constipation est l'un des effets secondaires les plus
       courants du traitement, et la fibre est le levier alimentaire qui
       existe pour elle. */
    fibraTexto: (dias: number, meta: number) =>
      `C’est votre moyenne sur les ${dias} derniers jours notés, contre un objectif de ${meta} g. Légumes secs, avoine, verdures et fruits avec la peau sont le chemin le plus court — et c’est la fibre qui aide pour le transit bloqué, l’un des effets secondaires les plus courants du traitement.`,

    fibraBoaQ: 'Qu’est-ce que les fibres changent dans mon traitement ?',
    fibraBoaTitulo: (media: number) => `Fibres : ${media} g par jour, au-dessus de l’objectif`,
    fibraBoaTexto: (dias: number, meta: number) =>
      `C’est votre moyenne sur les ${dias} derniers jours notés, contre un objectif de ${meta} g. C’est ce qui tient en général le transit bloqué du traitement — autant garder comme ça.`,

    /* ⚠️ LE MOMENT FAIBLE NOMME LE MOMENT, et c'est ce que le chiffre du
       jour ne dit pas : un petit-déjeuner à 6 g et un déjeuner à 40 g font
       la même somme que deux à 23, et seul le premier a un pas suivant
       évident. */
    momentoFracoQ: (momento: string) => `Que puis-je manger au ${momento.toLowerCase()} pour avoir plus de protéines ?`,
    momentoFracoTitulo: (momento: string, media: number) => `${momento} : ${media} g de protéines, en moyenne`,
    /* ⚠️ LES SOURCES RESPECTENT CE QUE LA PERSONNE MANGE. La phrase disait
       « un œuf, un yaourt ou un morceau de fromage » pour tout le monde —
       un conseil qu'une personne végane ne peut pas suivre, dit par
       l'application qui vient de lui demander si elle est végane. */
    momentoFracoTexto: (melhor: string, mediaMelhor: number, fontes: string) =>
      `C’est votre moment le plus léger en protéines — le ${melhor.toLowerCase()} en apporte ${mediaMelhor} g. Dans ce que vous mangez, ce qui donne le plus de protéines par calorie, c’est ${fontes}.`,

    momentoForteQ: 'Pourquoi les protéines comptent-elles autant dans ce traitement ?',
    momentoForteTitulo: (momento: string, media: number) => `${momento} : ${media} g de protéines, en moyenne`,
    momentoForteTexto: 'C’est le moment qui soutient le plus votre objectif du jour. Refaire ce qui marche déjà là est plus simple que de réparer ailleurs.',

    /* ⚠️ LA PHRASE COMPTE DANS COMBIEN DE JOURS UN LÉGUME EST APPARU DANS
       LE RELEVÉ, et non dans combien la personne en a mangé. Ce sont deux
       choses différentes, et un plat tout prêt peut en contenir sans que
       l'application le sache. */
    verdeQ: 'Quels légumes vont avec ce que je mange déjà d’habitude ?',
    verdeTitulo: (comVerde: number, total: number) =>
      `Des légumes sur ${comVerde} des ${total} jours notés`,
    verdeTexto: 'Une salade ou un légume au déjeuner remplit l’assiette avec peu de calories — ça aide à finir le repas rassasiée sans entamer la journée, et ça apporte les fibres avec.',
  },

  /* ⚠️ LES `id` SONT DES DONNÉES — 'agua', 'cafe', 'coco' est ce qui reste
     enregistré dans chaque relevé d'hydratation. Seuls le nom et le
     récipient viennent d'ici.

     ⚠️ ET LE RÉCIPIENT EST CE QUE LA PERSONNE DIRAIT À VOIX HAUTE.
     Personne ne boit une bonbonne de café, et qui a bu une tasse ne sait
     pas de tête combien de millilitres c'était. */
  bebidas: {
    agua: 'Eau',
    cafe: 'Café',
    cafeLeite: 'Café au lait',
    cha: 'Thé',
    coco: 'Eau de coco',
    leite: 'Lait',
    suco: 'Jus',
    shake: 'Shake ou whey',
    refri: 'Soda',
    alcool: 'Boisson alcoolisée',
    outro: 'Autre',

    /* ⚠️ LA RÉSERVE SUR L'ALCOOL RESTE À L'ÉCRAN, et non cachée dans un
       calcul. C'est la seule boisson au bilan hydrique négatif bien
       établi — elle supprime la vasopressine et le corps rend plus qu'il
       n'a reçu. Elle reste notable, parce que le journal existe pour noter
       ce qui s'est passé ; elle n'entre simplement pas dans le total. */
    notaAlcool: 'Elle reste notée, mais n’entre pas dans le total : l’alcool fait rendre au corps plus de liquide qu’il n’en a reçu.',

    recipientes: {
      xicara: 'Tasse',
      caneca: 'Mug',
      copo: 'Verre',
      garrafa: 'Bouteille',
      caixinha: 'Briquette',
      lata: 'Canette',
      taca: 'Coupe',
      longNeck: 'Long neck',
      coqueteleira: 'Shaker',
    },
  },

  prato: {
    /* ⚠️ LES MOMENTS SONT CLÉ ET ÉTIQUETTE À LA FOIS : le nom est ce qui
       reste enregistré dans chaque repas, et aussi ce que l'écran montre.
       Traduire la liste NE casse aucun relevé, parce que la comparaison se
       fait toujours contre la valeur que l'application vient de rendre —
       mais un repas ancien gardé avec « Almoço » ne correspond pas à
       « Déjeuner », et c'est pour ça que l'écran retombe sur le nom
       enregistré quand il ne le reconnaît pas. */
    cafeDaManha: 'Petit-déjeuner',
    almoco: 'Déjeuner',
    lanche: 'Collation',
    jantar: 'Dîner',

    porcoes: (qtd: number) => `${qtd} ${qtd === 1 ? 'portion' : 'portions'}`,

    /* ⚠️ LA PROVENANCE N'APPARAÎT QUE QUAND IL FAUT LA DIRE. Un item de
       table ne dit rien : c'est le cas normal, et l'annoncer serait du
       bruit sur toutes les lignes pour prévenir sur aucune. */
    estimado: 'estimé d’après la photo',
    semConta: 'n’entre pas encore dans le compte',

    /* ⚠️ LA LECTURE D'UN ALIMENT N'INTERDIT RIEN. « Ce n'est pas interdit,
       mais ça prend une bonne part de la journée » est le plus loin où
       elle va, et c'est voulu : l'application ne sait pas ce que l'équipe
       a convenu avec la personne. */
    muitaProteinaPoucaCaloria: 'Beaucoup de protéines pour peu de calories. C’est le type d’aliment que le traitement demande : il tient dans l’assiette qui a rétréci et soutient encore la masse maigre.',
    boaFonte: 'Bonne source de protéines, et c’est ce qui retient la masse maigre pendant que le poids descend.',
    caloriaAlta: 'Calories élevées et peu de protéines. Ce n’est pas interdit, mais ça prend une bonne part de la journée et rend peu de ce dont le traitement a besoin.',
    bastanteFibra: 'Beaucoup de fibres. Ça aide pour le transit bloqué, l’un des effets secondaires les plus courants du traitement.',
    quaseNaoPesa: 'Ça ne pèse presque rien dans la journée. Bon pour accompagner l’assiette, mais les protéines doivent venir d’ailleurs.',
    temFibra: 'Contient des fibres, qui aident pour le transit bloqué — l’un des effets secondaires les plus courants du traitement.',
  },

  /* ⚠️ CE QUE L'ITEM DÉCLARE VAUT PLUS QUE LE REPLI. Un produit d'enseigne
     apporte la table de l'enseigne elle-même, et la phrase de repli — « la
     table de l'Unicamp n'analyse pas celui-ci » — est vraie et inutile :
     elle décrit ce que la source N'EST PAS, alors que l'item sait dire ce
     qu'elle est. */
  origem: {
    porCem: (fonte: string) => `${fonte}. Ce sont les valeurs pour 100 g, et le poids de chaque portion est celui que l’enseigne déclare elle-même.`,
    porPorcaoSemPeso: (fonte: string) => `${fonte}. Ce sont les valeurs de la portion vendue par l’enseigne, et non de 100 g — elle publie l’étiquette du produit, sans dire combien il pèse.`,
    porPorcaoComPeso: (fonte: string) => `${fonte}. Ce sont les valeurs de la portion vendue par l’enseigne, et non de 100 g — avec le poids qu’elle déclare elle-même.`,
    taco: 'Les chiffres viennent de la table brésilienne de composition des aliments, faite par l’Unicamp, qui mesure en laboratoire ce que chaque aliment contient.',
    somaTaco: 'C’est un plat composé : nous additionnons ingrédient par ingrédient avec la table de l’Unicamp, pour une portion de restaurant. La vôtre peut être plus grande ou plus petite.',
    rotulo: 'La table de l’Unicamp n’analyse pas celui-ci, alors les chiffres viennent de l’étiquette de produits courants du commerce. D’une marque à l’autre ils changent un peu.',
  },

  /* ⚠️ LE SOUS-TITRE DIT CE QUI RESTE, et pas seulement ce qui sort. « Sans
     viande, volaille ni poisson » tout seul laisse la personne sans savoir
     pour l'œuf et le fromage, qui est justement le doute de qui hésite
     entre végétarien et végane. */
  restricoes: {
    vegetariano: 'Végétarien',
    vegetarianoSub: 'Sans viande, volaille ni poisson. L’œuf et les produits laitiers restent.',
    vegano: 'Végane',
    veganoSub: 'Rien d’origine animale : viande, poisson, œuf, lait et fromage sortent.',
    semLactose: 'Sans lactose',
    semLactoseSub: 'Lait, fromage et dérivés sortent — par intolérance ou allergie.',
    semOvo: 'Sans œuf',
    semOvoSub: 'L’œuf et les plats qui en contiennent sortent.',
    semPeixe: 'Sans poisson ni fruits de mer',
    semPeixeSub: 'Poisson, crevettes et fruits de mer sortent.',
    semCarneVermelha: 'Sans viande rouge',
    semCarneVermelhaSub: 'Bœuf et porc sortent. Volaille et poisson restent.',
  },

  /* ⚠️⚠️ LA PHRASE DE L'ÉNERGIE PORTE UN `<b>` À L'INTÉRIEUR, et ce n'est
     pas de la décoration : c'est ce qui libère l'ORDRE DES MOTS. Le
     portugais met le nombre au milieu, l'allemand ailleurs. Si l'écran
     assemblait ça en trois morceaux, chaque langue devrait rentrer dans
     l'ordre du portugais. Voir ../pt-BR/alimentacao.

     ⚠️ ET « REPAS » NE CHANGE PAS AU PLURIEL, ce qui rend la paire
     singulier/pluriel invisible ici — c'est le VERBE qui s'accorde, pas
     le nom. */
  tela: {
    titulo: 'Alimentation',
    linhaSemProteina: (alvo: number) => `Protéines : rien de noté · objectif de ${alvo} g`,
    linhaComProteina: (prot: number, alvo: number, resto: string) => `Protéines : ${prot} sur ${alvo} g · ${resto}`,
    faltamParaMeta: (falta: number) => `encore ${falta} g avant l’objectif`,
    metaAlcancada: 'objectif atteint',
    registrarRefeicao: 'Noter un repas',

    energiaTitulo: 'L’énergie d’aujourd’hui',
    calorias: 'CALORIES',
    deKcal: (meta: string) => `sur ${meta} kcal`,

    sobramDoQueConta: (quanto: string) => `Il reste <b>${quanto} kcal</b> sur ce qui se compte.`,
    aindaCabem: (quanto: string) => `Il reste encore <b>${quanto} kcal</b> dans votre journée. Choisissez bien comment les dépenser.`,
    /* Avec l'auxiliaire AVOIR, le participe n'accorde rien. */
    passouAMeta: (quanto: string) => `Vous avez dépassé l’objectif du jour de <b>${quanto} kcal</b>. Demain est un autre jour.`,

    foraDaConta: (fora: number, total: number) =>
      `${fora} repas sur ${total} ${total === 1 ? 'n’entre pas' : 'n’entrent pas'} dans ce compte : seule une assiette construite avec la table a une étiquette vérifiée.`,

    carboidrato: 'Glucides',
    gordura: 'Lipides',
    fibra: 'Fibres',
    deG: (meta: number) => `sur ${meta} g`,

    semanaTitulo: 'Les protéines de la semaine',
    estaSemana: 'Cette semaine',
    nadaNaSemana: 'Rien de noté ces sept derniers jours',
    mediaDeDias: (dias: number) => `Moyenne sur ${dias} ${dias === 1 ? 'jour noté' : 'jours notés'}`,
    metaG: (alvo: number) => `Objectif : ${alvo} g`,

    notamosTitulo: 'Ce qu’on a remarqué',
    notamosNota: 'D’après votre routine des deux dernières semaines — et seulement d’après ce que vous avez noté.',
    continueAssim: 'CONTINUEZ COMME ÇA',
    umaIdeia: 'UNE IDÉE',
    conversarSobre: 'En parler',

    diarioTitulo: 'Journal des repas',
    diarioNota: 'Touchez un repas pour le voir, le corriger ou le supprimer.',
    porVoce: 'par vous',
    pelaFoto: 'd’après la photo',
    deProteina: 'de protéines',
    totalDoDia: (refeicoes: number, gramas: number) =>
      `${refeicoes} repas · ${gramas} g de protéines`,
    diaVazioTitulo: 'Aucun repas ce jour-là',
    diaVazioTexto: 'Ce que vous notez entre dans les protéines du jour.',

    favoritosTitulo: 'Plats favoris',
    favoritosLink: 'Enregistrer',
    favoritosNota: 'Composez le plat une fois, et il se note en un toucher.',
    semPratoGuardado: 'Aucun plat enregistré — s’ouvre par la recherche',
    favVazioTitulo: 'Aucun plat favori',
    favVazioTexto: 'Enregistrez un plat que vous répétez, et il se note en un toucher.',

    seusAlimentos: 'Vos aliments',
    dicionario: 'Dictionnaire des aliments',
    dicionarioSub: 'Apprenez comment chaque aliment peut aider votre traitement',
    restricoesLinha: 'Restrictions alimentaires',
    semRestricao: 'Aucune',
  },

  telaAgua: {
    titulo: 'Hydratation',
    hojeNada: (meta: string) => `Aujourd’hui : rien de noté · objectif de ${meta}`,
    hojeCom: (bebido: string, meta: string, resto: string) =>
      `Aujourd’hui : ${bebido} sur ${meta} · ${resto}`,
    faltam: (quanto: string) => `il reste ${quanto}`,
    metaAlcancada: 'objectif atteint',
    registrar: 'Noter ce que vous avez bu',

    suaSemana: 'Votre semaine',
    nadaNaSemana: 'Rien de noté ces sept derniers jours',
    mediaDeDias: (dias: number) =>
      `Moyenne sur ${dias} ${dias === 1 ? 'jour noté' : 'jours notés'}`,
    meta: (quanto: string) => `Objectif : ${quanto}`,

    diario: 'Journal des boissons',
    diarioNota: 'Le café, le thé, le lait et le jus comptent : l’objectif est en liquide, pas en eau pure. Effacez ce qui est entré de travers.',
    apagarDoDia: 'Effacer l’eau de ce jour ?',
    apagarGole: (quanto: string, hora: string) => `Effacer ${quanto} de ${hora} ?`,
    deBebida: (nome: string) => ` de ${nome}`,
    totalSemHora: 'Total du jour, sans heure notée',
    asHoras: (hora: string) => `à ${hora}`,
    foraDaContaSufixo: ' · hors du compte',
    registros: (quantos: number, total: string) =>
      `${quantos} ${quantos === 1 ? 'relevé' : 'relevés'} · ${total}`,
    maisForaDaConta: (quantos: number) => ` · ${quantos} hors du compte`,
    daComida: (quanto: string) => `Plus ${quanto} venant de ce que vous avez mangé`,
    vazioTitulo: 'Rien de noté ce jour-là',
    vazioTexto: 'Ce que vous notez entre dans le total du jour.',

    lembrete: 'Rappel',
    alertas: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'rappel' : 'rappels'} d’hydratation`,
    nenhumAlerta: 'Aucun rappel d’hydratation',
    tocaEm: (quando: string) => `Sonne ${quando}`,
    umToquePorDia: 'Un signal par jour, à l’heure que vous choisissez',
  },
};
