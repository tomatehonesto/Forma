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
    desdeOComeco: 'Je connais votre parcours depuis le début.',
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
      vazioSemRegistroTexto: 'Les lectures arrivent quand quelque chose dans vos relevés en appelle une. Avec vos premiers check-ins, elles commencent à apparaître ici.',
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

    primeirosMotivo: (dias: number) => `Vous avez fait votre injection il y a ${dias} ${dias === 1 ? 'jour' : 'jours'}`,
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

  telaInsights: {
    ola: (nome: string) => `Bonjour, ${nome}`,
    pergunta: 'Que voulez-vous\ncomprendre aujourd’hui ?',
    escreva: 'Écrivez votre question...',

    descobertaDaSemana: 'LA DÉCOUVERTE DE LA SEMAINE',
    entenderMelhor: 'Mieux comprendre',

    oQueMaisPercebi: 'Ce que j’ai remarqué d’autre',
    oQueMaisPercebiNota: 'D’autres observations trouvées en parcourant votre traitement.',
    verTodas: (quantas: number) => `Voir toutes les observations (${quantas})`,

    observamos: 'CE QUE NOUS AVONS OBSERVÉ',
    hojeDeCem: 'aujourd’hui, sur 100',

    proximasAcoes: 'Prochaines étapes',
    proximasAcoesNota: 'Dans l’ordre où elles arrivent. Des suggestions du quotidien — la dose et le traitement sont décidés par qui vous suit.',

    resumos: 'Créer des résumés',
    resumosNota: 'Vos données mises en ordre pour les apporter à quelqu’un.',
    disponivelDepois: 'disponible après vos premières saisies',

    resumoDaSemana: 'Résumé de la semaine',
    resumoDaSemanaSub: (semana: number, checkins: number, peso: string | null) =>
      `semaine ${semana} · ${checkins} ${checkins === 1 ? 'check-in' : 'check-ins'}${peso ? `, ${peso}` : ''}`,
    preparoDaConsulta: 'Préparation de la consultation',
    preparoDaConsultaSub: 'poids, observance, symptômes et questions',
    preparoSemEquipe: 'prêt à partager',
    documento: 'Résumé pour la consultation',
    documentoSub: 'un document avec toute l’évolution',
  },
  telaConversa: {
    ola: (nome: string) => `Bonjour, ${nome}`,
    ouvindo: 'Je vous écoute…',
    escrevaOuFale: 'Écrivez ou parlez',
    pergunte: 'Posez une question sur votre parcours',
    novaConversa: 'Nouvelle conversation',
    assuntoApetite: 'Appétit',
    assuntoTratamento: 'Traitement',
    assuntoSintomas: 'Symptômes',
    assuntoExames: 'Examens',
    assuntoProgresso: 'Progrès',
    assuntoConsulta: 'Consultation',
    assuntoComeco: 'Premiers pas',
    menu: 'Conversations et nouvelle conversation',
    fechar: 'Fermer',
    irEvolucao: 'Voir vos pesées',
    irSintomas: 'Voir vos symptômes',
    irAplicacoes: 'Voir vos injections',
    irAlimentacao: 'Voir votre alimentation',
    irAgua: 'Voir l’eau d’aujourd’hui',
    irExames: 'Voir vos examens',
    irResumo: 'Ouvrir le résumé pour la consultation',
    irCheckin: 'Faire le bilan du jour',
    copiar: 'Copier',
    copiado: 'Copié',
    levarCurto: 'Garder pour la consultation',
    dataHoje: 'Aujourd’hui',
    dataOntem: 'Hier',
    fecharMenu: 'Fermer le menu',
    compartilhar: 'Partager',
    levarConsulta: 'Garder la question pour la consultation',
    naPauta: 'Noté pour la consultation',
    historico: 'Conversations précédentes',
    historicoTitulo: 'Conversations',
    grupoHoje: 'Aujourd’hui',
    grupoSemana: '7 derniers jours',
    grupoAntes: 'Plus tôt',
    mensagens: (n: number): string => (n === 1 ? '1 message' : `${n} messages`),
    apagar: 'Supprimer',
    apagarPergunta: 'Supprimer cette conversation du téléphone ?',
    cancelar: 'Annuler',
    historicoVazio: 'Vos conversations avec Morphi Intelligence sont gardées ici, sur votre téléphone.',
    aceiteTitulo: 'Avant de commencer',
    aceitePergunta: 'Autoriser Morphi Intelligence à consulter vos données de santé pour vous aider ?',
    termosTitulo: 'Conditions d’utilisation',
    termosResumo: 'Ce qu’elle consulte, par où cela passe et les limites',
    aceite1Titulo: 'Ce qu’elle consulte',
    aceite1: 'Traitement, poids, symptômes, repas, eau, activité physique et examens. Votre nom complet, votre e-mail et le nom de votre soignant restent en dehors.',
    aceite2Titulo: 'Par où cela passe',
    aceite2: 'Chaque question va vers notre serveur et vers Anthropic, l’entreprise qui fournit la technologie, aux États-Unis, uniquement pour rédiger la réponse. Rien n’est conservé chez eux ; la conversation reste sur votre téléphone.',
    aceite3Titulo: 'Les limites',
    aceite3: 'Morphi Intelligence peut se tromper et ne remplace pas votre soignant. La dose et le traitement, toujours avec votre équipe.',
    politica: 'Lire la Politique de confidentialité',
    aceitar: 'Autoriser et discuter',
    recusar: 'Pas maintenant',
    aceiteRodape: 'Sans votre autorisation, Morphi Intelligence reste désactivée. Vous pouvez l’autoriser quand vous voulez.',
    semServidor: 'La conversation n’est pas encore activée sur cet appareil.',
    semRede: 'Je n’ai pas pu répondre — la connexion a échoué. Réessayez dans un instant.',
    semConta: 'Pour discuter avec moi, connectez-vous à votre compte.',
    limiteDoDia: 'Vous avez atteint la limite de questions pour aujourd’hui. Je répondrai de nouveau demain.',
  },
};
