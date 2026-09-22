/* ============================================================
   L'ACCUEIL ET LE PARCOURS — les objectifs du jour, les cartes et la frise · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/home.ts. Les deux qui commandent :

   TOUT NOMBRE AFFICHÉ VIENT AVEC UN VERDICT, et c'est le mot que la
   personne cherche en premier. La valeur dit la mesure ; le mot dit si
   c'est bien. Sans lui, elle fait le calcul toute seule, et dans une
   application de santé elle le fait mal.

   ET AUCUN VERDICT D'ICI NE MET UNE NOTE À LA PERSONNE. « En dessous de
   l'objectif » qualifie le nombre ; « vous ne vous êtes pas assez
   appliquée » qualifierait qui l'a produit. La différence se perd
   facilement en traduisant, et le fichier entier en dépend.
   ============================================================ */

export const home = {
  /* ⚠️ « OBJECTIF ATTEINT » N'EST PAS UNE FÊTE, C'EST UN ÉTAT. Ça occupe la
     même place que « Il reste 27 g » — c'est la même ligne qui dit la même
     chose de l'autre côté. Un « Bravo ! » là changerait ce qu'est la
     carte. */
  metas: {
    proteina: 'Apport en protéines',
    agua: 'Boire plus d’eau',
    exercicio: 'Bouger chaque jour',
    batida: 'Objectif atteint',
    faltamProteina: (gramas: number) => `Il reste ${gramas} g`,
    /* La quantité arrive déjà écrite, dans l'unité de qui lit. */
    faltamAgua: (quanto: string) => `Il reste ${quanto}`,
    faltamExercicio: (minutos: number) => `Il reste ${minutos} min`,
  },

  /* ⚠️ « PRÈS DE L'OBJECTIF » EST UNE BONNE NOUVELLE, et c'est voulu : 85%
     de l'objectif de protéines est une bonne journée, et appeler ça « en
     dessous » apprend à la personne à ignorer le mot. Le troisième échelon
     existe pour que le premier continue de vouloir dire quelque chose. */
  veredito: {
    naMeta: 'Dans l’objectif',
    pertoDaMeta: 'Près de l’objectif',
    abaixoDaMeta: 'En dessous de l’objectif',
    /* ⚠️ « EN BAISSE » EST LA BRANCHE QUI SAUVE LA CARTE DE MASSE GRASSE.
       Qui est au-dessus de l'objectif mais descend depuis le début n'est
       pas en échec — elle est à mi-chemin, là où presque tout le monde
       est. */
    emQueda: 'En baisse',
    acimaDaMeta: 'Au-dessus de l’objectif',
  },

  /* ⚠️ LE TITRE CHANGE AUSSI, ET PAS SEULEMENT LE NOMBRE. « Poids perdu »
     au-dessus de « +3,3 kg » est une contradiction à l'intérieur de la
     même carte — et le mauvais mot fait plus mal que le nombre. */
  peso: {
    perdido: 'Poids perdu',
    variacao: 'Variation du poids',
    meta: (quanto: string, unidade: string) => `Objectif : ${quanto} ${unidade}`,
  },

  /* ⚠️ « STABLE », ET NON « −0,0 ». Un nombre qui n'a pas bougé n'a varié
     d'aucun côté, et le mot est celui-là. Ce n'est ni une bonne ni une
     mauvaise nouvelle. */
  estavel: 'Stable',

  tipos: {
    checkin: 'Check-ins',
    aplicacao: 'Injections',
    peso: 'Poids',
    refeicao: 'Repas',
    exercicio: 'Séances',
    consulta: 'Consultations',
    exame: 'Analyses',
  },

  evento: {
    aplicacao: (dose: string, unidade: string) => `Injection ${dose} ${unidade}`,
    peso: 'Poids',
    /* La première pesée n'a pas de précédente à comparer, donc à la place
       de la variation il y a ce qu'elle est. */
    pesoInicial: 'Poids de départ',
    checkin: 'Check-in',
    exercicio: 'Séance',
    minDeMovimento: (minutos: number) => `${minutos} min de mouvement`,
    proteinaDaRefeicao: (quanto: string) => `Protéines ${quanto}`,
    consulta: (tipo: string) => `Consultation ${tipo}`,
    marcadoresDe: (quantos: number, fonte: string) => `${quantos} marqueurs · ${fonte}`,
    marcadoresDetalhe: (nome: string, quantos: number, fonte: string) =>
      `${nome} · ${quantos} marqueurs · ${fonte}`,
    compartilhado: 'Partagé',

    gramasDeProteina: (gramas: number) => `${gramas} g protéines`,
    horasDeSono: (horas: number) => `${horas}h de sommeil`,

    /* ⚠️ LE VERDICT DU JOUR VIENT DE L'HUMEUR, et les trois mots sont
       courts à dessein : ils occupent la colonne de droite, à côté d'un
       nombre. « Difficile » est le plus important des trois — il nomme la
       mauvaise journée sans l'appeler un échec. */
    diaBem: 'Bien',
    diaNeutro: 'Neutre',
    diaDificil: 'Difficile',

    respostaHumor: 'Humeur',
    respostaEnergia: 'Énergie',
    respostaFome: 'Faim',
    respostaOutroSintoma: 'Autre symptôme',
  },

  /* ⚠️ LE RÉSUMÉ RACONTE CE QUE LA SEMAINE A DONNÉ, il ne liste pas ce qui
     s'est passé. D'où le singulier et le pluriel propres à chaque type —
     « 1 pesée » et « 3 pesées » —, et non un « (s) » accroché.

     ⚠️ ET « repas » NE CHANGE PAS au pluriel en français, ce qui est
     exactement la raison pour laquelle la paire est écrite en entier. */
  semana: {
    checkin: ['check-in', 'check-ins'] as [string, string],
    peso: ['pesée', 'pesées'] as [string, string],
    refeicao: ['repas', 'repas'] as [string, string],
    exercicio: ['séance', 'séances'] as [string, string],
    consulta: ['consultation', 'consultations'] as [string, string],
    exame: ['analyse', 'analyses'] as [string, string],
    contagem: (quantos: number, nome: string) => `${quantos} ${nome}`,
    /* ⚠️ UNE SEMAINE VIDE A SA PROPRE PHRASE, et non un blanc : une semaine
       sans relevé a eu lieu, et son chapitre existe. */
    semRegistros: 'Aucun relevé cette semaine',

    hidratacao: 'Hydratation',
    proteina: 'Protéines',
    exercicioMetrica: 'Exercice',
    pesoMetrica: 'Poids',
    litrosPorDia: (quanto: string) => `${quanto} L/jour`,
    gramasPorDia: (quanto: number) => `${quanto} g/jour`,
    minutos: (quanto: number) => `${quanto} min`,
    deltaLitros: (quanto: string) => `${quanto} L`,
    deltaGramas: (quanto: string) => `${quanto} g`,
    deltaMinutos: (quanto: string) => `${quanto} min`,
  },

  mudancas: {
    peso: 'Poids',
    cintura: 'Tour de taille',
    gorduraCorporal: 'Masse grasse',
    /* ⚠️ LA SEULE OÙ MONTER EST LA BONNE NOUVELLE : le muscle perdu en
       maigrissant est ce que le traitement essaie d'éviter. L'étiquette ne
       le dit pas — c'est le ton qui le dit —, mais qui traduit doit le
       savoir. */
    massaMagra: 'Masse maigre',
    naReferencia: 'Dans la référence',
    foraDaReferencia: 'Hors référence',
    pressao: 'Tension',
    /* ⚠️ « STABLE » ÉTAIT CE QUI RESTAIT DE TOUT CE QUI N'ÉTAIT PAS UNE
       BAISSE, et une tension qui montait de quatorze points sortait comme
       stable — en vert. Monter a un nom. */
    pressaoEmQueda: 'En baisse',
    pressaoEmAlta: 'En hausse',
    pressaoEstavel: 'Stable',
  },

  metaDePeso: {
    /* « Arriver à 68 kg », et non « Objectif : 68 kg » : la liste est
       faite de choses à obtenir, et c'est le verbe qui la fait ressembler
       à l'une d'elles. */
    chegarA: (peso: string) => `Arriver à ${peso}`,
    alcancada: 'objectif atteint',
    faltam: (quanto: string) => `il reste ${quanto}`,
  },

  /* ⚠️ SEUL LE NOM D'APPLE CHANGE DE LANGUE, parce que c'est Apple qui
     traduit le nom de sa propre application. */
  fontes: {
    appleSaude: 'Apple Santé',
  },
};
