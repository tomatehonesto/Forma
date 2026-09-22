/* ============================================================
   LE COMPANION — sa mémoire et la bibliothèque qu'il propose · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/companion.ts. Les deux qui
   commandent :

   LA MÉMOIRE PARLE DE PRÉSENCE, PAS DE VOLUME. La ligne énumérait ce
   qu'il avait lu — « j'ai pris en compte vos check-ins, 11 injections,
   15 analyses… » — et énumérer prouve une capacité à compter, pas à
   connaître. Ce qui construit la confiance, c'est d'avoir été là dans la
   durée.

   ET LA BIBLIOTHÈQUE N'EST PAS UN CATALOGUE. Chaque lecture entre parce
   que quelque chose dans l'état de la personne l'a appelée, et le motif
   apparaît sur la carte. Du contenu sans motif visible devient un blog.
   D'où les TROIS pièces, non interchangeables : `motivo` dit pourquoi ça
   apparaît AUJOURD'HUI, avec son chiffre à elle dedans ; `titulo` dit ce
   que le texte enseigne ; `desc` dit ce qu'il résout, ce qui n'est pas la
   même chose.
   ============================================================ */

export const companion = {
  memoria: {
    desdeAPrimeira: (dias: number) =>
      `Je suis votre traitement depuis la première injection, il y a ${dias} jours.`,
    desdeOPrimeiroDiaComSemanas: (semanas: number) =>
      `Je connais votre parcours depuis le premier jour — ${semanas} semaines jusqu’ici.`,
    desdeOPrimeiroDia: 'Je connais votre parcours depuis le premier jour.',
    dosesAtras: (doses: number) =>
      `Je suis avec vous depuis la première injection, il y a ${doses} doses.`,
  },

  biblioteca: {

    /* ⚠️ L'ÉCRAN MONTRAIT QUATRE ARTICLES INVENTÉS, écrits en dur, alors
       que la vraie bibliothèque était juste au-dessus et que `libraryPicks`
       la construisait à partir de l'état de la personne. Personne ne
       l'appelait. Voir ../pt-BR/companion. */
    tela: {
      titulo: 'Bibliothèque',
      sub: 'La lecture juste pour votre moment — et non une liste d’articles',
      minDeLeitura: (min: number) => `${min} min de lecture`,
      vazioTitulo: 'Rien à lire pour l’instant',
      vazioTexto: 'Les lectures arrivent quand quelque chose dans vos relevés en appelle une. Sans ça, il n’y a rien à lire — et c’est une bonne nouvelle.',
    },
    fomeMotivo: (dia: number) => `Vous êtes au jour ${dia} du cycle, quand la faim revient`,
    fomeTitulo: 'Pourquoi la faim revient avant l’injection',
    /* ⚠️ « ENLÈVE LA SENSATION DE RECHUTE » est le service de cette
       lecture et la raison de son existence : la faim qui revient au
       cinquième jour, c'est là que les gens concluent qu'ils ont échoué.
       La molécule en minuscule parce que c'est une substance, pas une
       marque. */
    fomeDesc: (molecula: string) =>
      `Le niveau de ${molecula} baisse au fil de la semaine, et la satiété baisse avec lui. Comprendre la courbe enlève la sensation de rechute.`,

    primeirosMotivo: (dias: number) => `Vous avez fait votre injection il y a ${dias} ${dias === 1 ? 'jour' : 'jours'}`,
    primeirosTitulo: 'Les premiers jours après la dose',
    primeirosDesc: 'Ce qu’il est normal de ressentir dans la fenêtre de 48 h, et ce qui mérite déjà un message à votre équipe.',

    enjooMotivo: (dias: number) => `Vous avez noté des nausées ${dias} des 7 derniers jours`,
    /* ⚠️ « AFFRONTER » EST LE BON VERBE, et le titre entier en dépend :
       quand on a la nausée, il ne faut pas de la volonté pour manger, il
       faut de la nourriture qui passe. */
    enjooTitulo: 'Manger sans affronter la nausée',
    enjooDesc: 'Des associations et des horaires qui passent mieux les jours où la nourriture paraît de trop.',

    proteinaMotivo: (gramas: number) => `Il manque ${gramas} g pour que votre moyenne atteigne l’objectif`,
    proteinaTitulo: 'Des protéines sans cuisiner plus',
    proteinaDesc: 'Comment atteindre l’objectif avec ce qu’il y a déjà dans votre cuisine — le problème est rarement la recette, c’est la praticité.',

    sonoMotivo: (horas: string) => `Votre moyenne de sommeil est à ${horas} h`,
    sonoTitulo: 'Le sommeil comme partie du traitement',
    sonoDesc: 'Dormir peu change les hormones de la faim le lendemain — dans vos propres relevés, ça se voit déjà.',

    plateauMotivo: (semana: number, perdido: string) => `Semaine ${semana}, avec ${perdido} sur la période`,
    plateauTitulo: 'Ce qui change après le troisième mois',
    /* ⚠️ « C'EST DE LA PHYSIOLOGIE, PAS UN ÉCHEC » est la même défense que
       fait la carte de plateau, et elle doit être ici aussi : c'est à ce
       point du traitement que les gens s'arrêtent. */
    plateauDesc: 'La perte ralentit, et c’est de la physiologie, pas un échec. Ce qui compte plus que la balance à partir de maintenant.',

    consultaMotivo: (dias: number) => `Votre consultation est dans ${dias} jours`,
    consultaTitulo: 'Comment mieux profiter de votre consultation',
    consultaDesc: 'Quoi apporter, quoi demander, et comment le résumé automatique économise les dix premières minutes.',
  },
};
