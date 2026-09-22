/* ============================================================
   LE CYCLE DE LA DOSE — le titre d'accueil et les quatre phases · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/ciclo.ts. La règle qui vaut pour le
   fichier entier : AUCUNE de ces phrases n'ordonne quoi que ce soit.
   Elles disent ce qui se passe et ce qui aide d'habitude — la différence
   entre « buvez plus d'eau » et « l'eau soutient la satiété à cette
   phase » est la différence entre une application qui réclame et une qui
   explique, et celle-ci est la seconde.

   ⚠️ « Vous avez bien dormi » passe par l'auxiliaire avoir : pas
   d'accord, donc pas de genre. C'était le piège de etapa.ts.
   ============================================================ */

export const ciclo = {
  /* ⚠️ « JOUR 5 DE LA DOSE », ET NON « JOUR 5 SUR 7 ». Le sur-sept
     ressemblait à un compte à rebours — sept de quoi, et que se passe-t-il
     à l'arrivée ? La cadence appartient au médicament, ce n'est pas un
     objectif à tenir. */
  chapeuDia: (dia: number) => `JOUR ${dia} DE LA DOSE`,
  chapeuSemCiclo: 'POUR AUJOURD’HUI',

  /* ⚠️ N'ANNONCE PAS QUE L'INJECTION EST AUJOURD'HUI : la carte suivante
     de l'accueil est entièrement là-dessus, avec la dose et le site. Deux
     cartes de suite qui donnent la même nouvelle gaspillent le carrousel. */
  aplicHead: 'L’effet commence à monter dans les prochaines heures.',
  aplicBody: 'Une nausée légère peut apparaître — mieux vaut des repas plus petits au fil de la journée.',
  aplicQ: 'À quoi s’attendre le jour de l’injection ?',

  picoHead: 'Votre appétit a tendance à être plus bas aujourd’hui.',
  picoBody: 'Pic d’effet du médicament — bonne journée pour s’entraîner et prendre de l’avance sur les protéines.',
  picoQ: 'Quand ai-je le plus d’énergie ?',

  estabHead: 'Votre corps est dans la phase stable du cycle.',
  estabBody: 'Effet constant — gardez l’eau et les protéines à jour pour soutenir la satiété.',
  estabQ: 'Comment fonctionne le cycle du médicament ?',

  retornoHead: 'Votre faim peut commencer à augmenter dans les 24 prochaines heures.',
  retornoBody: 'Les protéines et l’eau soutiennent la satiété à cette phase du cycle.',
  retornoQ: 'Pourquoi ai-je plus faim ?',

  altoHeadHoje: 'Faim au point le plus haut du cycle.',
  altoHeadComData: (quando: string) => `Faim au point haut du cycle — injection ${quando}.`,
  /* ⚠️ « NE SAUTEZ PAS DE REPAS » PRÉSUPPOSE QU'ELLE EN SAUTE, et au point
     haut de la faim, celle qui en saute le moins est celle qui a faim. La
     phrase naissait comme un conseil et arrivait comme un reproche — la
     version affirmative dit la même chose utile sans accuser personne. */
  altoBody: 'Des portions plus petites et plus souvent, avec des protéines, tiennent mieux la faim.',
  altoQ: 'Pourquoi ai-je plus faim ?',

  /* Passe devant le corps du message quand la nuit a été bonne. C'est la
     seule ligne de l'application qui célèbre le sommeil, et elle existe
     parce que bien dormir change la journée entière de qui est en
     traitement. */
  dormiuBem: (resto: string) => `Vous avez bien dormi — votre corps a tendance à mieux répondre aujourd’hui. ${resto}`,

  /* ⚠️ CINQ ICI ET QUATRE PLUS BAS, et c'est voulu. Ceci répond à « où
     j'en suis MAINTENANT » ; la table du bas répond à « comment est le
     cycle entier », et là cinq lignes, c'est une de plus que ce qui tient
     dans la tête d'une première lecture.

     ⚠️ LE `label` EST UN NOM D'ÉTAPE ET LE `hint` DIT CE QU'ELLE EST. Le
     nom seul — « Début du retour de la faim » — est un diagnostic sans
     contexte, et sur un écran de traitement ça effraie au lieu
     d'orienter. */
  faseAplicLabel: 'Injection',
  faseAplicRange: 'Jour 1',
  faseAplicHint: 'L’effet commence à monter dans les prochaines heures.',

  fasePicoLabel: 'Pic d’effet',
  fasePicoRange: 'Jours 1–2',
  fasePicoHint: 'Médicament au plus haut — la faim baisse.',

  faseEstabLabel: 'Stabilité',
  faseEstabRange: 'Jours 3–4',
  faseEstabHint: 'Effet constant, sans grandes oscillations.',

  faseRetornoLabel: 'Début du retour de la faim',
  faseRetornoRange: 'Jours 5–6',
  faseRetornoHint: 'Le médicament commence à redescendre, et la faim a tendance à revenir.',

  fasePreLabel: 'Avant l’injection',
  fasePreRange: 'Jours 7+',
  fasePreHint: 'Point le plus bas du cycle, jusqu’à la prochaine dose.',

  /* ⚠️ CETTE TABLE PRÉSUPPOSE UNE CADENCE HEBDOMADAIRE, et c'est une dette
     connue : qui prend un médicament quotidien n'a pas sept jours de cycle
     à traverser. C'est écrit pour que personne ne perde du temps à
     chercher un sens aux étiquettes de jour. */
  faseSubidaTitulo: 'Jours 1–2 · montée',
  faseSubidaSub: 'Effet qui monte, appétit plus bas',
  faseSubidaComum: 'nausée légère, satiété rapide, moins d’envie de manger',
  faseSubidaAjuda: 'des repas plus petits et plus espacés ; boire de l’eau au fil de la journée',

  fasePlatoTitulo: 'Jours 3–4 · plateau',
  fasePlatoSub: 'Phase la plus stable du cycle',
  fasePlatoComum: 'appétit constant, transit plus lent',
  fasePlatoAjuda: 'donner la priorité aux protéines et aux fibres dans les repas',

  faseDescidaTitulo: 'Jours 5–6 · descente',
  faseDescidaSub: 'Effet qui cède, faim qui revient peu à peu',
  faseDescidaComum: 'plus faim que les premiers jours, énergie en dents de scie',
  /* ⚠️ LA SECONDE MOITIÉ DE CETTE PHRASE EST LA RAISON DE SON EXISTENCE.
     Que la faim revienne au cinquième jour effraie qui croit que le
     médicament a cessé de marcher, et c'est là qu'on abandonne. Dire que
     c'est la phase, et non l'échec, c'est tout le travail de la ligne. */
  faseDescidaAjuda: 'c’est la phase où la faim revient — cela ne veut pas dire que le traitement a cessé de marcher',
  /* La seule phase avec une alerte : c'est là qu'apparaissent les
     symptômes qui demandent un médecin. Ce n'est pas une alarme — c'est la
     limite entre ce qui est attendu et ce qui n'attend pas la prochaine
     consultation. */
  faseDescidaAtencao: 'vomissements persistants ou douleur abdominale forte : parlez-en à votre médecin',

  faseBaixoTitulo: 'Jour 7 · point le plus bas',
  faseBaixoSub: 'Veille de la prochaine injection',
  faseBaixoComum: 'appétit plus proche de l’habitude',
  /* « La dose », et non « le stylo » : cette table est constante et ne
     connaît pas la forme du médicament — la phrase sert au stylo, au
     flacon et à la seringue. */
  faseBaixoAjuda: 'préparez la dose et le site de l’injection la veille',
  tela: {
    titulo: 'Cycle de la dose',
    diaDepois: (dia: number, acao: string) => `Jour ${dia} après\nvotre ${acao}`,
    lead: 'L’effet du médicament monte les premiers jours et redescend jusqu’à la dose suivante. Ce que vous ressentez bouge avec lui — et c’est attendu.',

    cicloAtual: 'Cycle en cours',
    diaDeTotal: (dia: number, total: number) => `jour ${dia} sur ${total}`,
    proximaDose: (data: string) => `Dose suivante ${data}`,

    asQuatroFases: 'Les quatre phases',
    comum: 'Courant',
    ajuda: 'Ce qui aide',
    atencao: 'Vigilance',

    conteudoGeral: 'Ceci est un contenu général',
    conteudoGeralTexto: 'Le cycle varie d’une personne à l’autre et avec la dose. Rien ici ne remplace l’avis de votre médecin.',

    baseadoEm: (molecula: string) => `D’après le comportement typique de ${molecula}`,
  },
};
