/* ============================================================
   LA ROUTINE — le protocole, les suggestions, la préparation et ce qui est passé · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/rotina.ts. Trois commandent ici :

   LA QUESTION SUGGÉRÉE EST LA PORTE D'ENTRÉE DE L'IA, et ce sont des
   questions à ELLE, pas des offres à nous. « Pourquoi ai-je eu plus faim
   aujourd'hui ? » est la façon dont quelqu'un pense ; « Comprendre le
   retour de la faim » est la façon dont parle un menu.

   L'IMPÉRATIF DES `empurroes` EST VOULU, et le `porque` en dessous ne
   l'est jamais : celui du haut commande, celui du bas explique.

   ⚠️ ET LA PERSONNE VOUVOIE LE COMPANION, comme il la vouvoie. Le
   tutoiement de l'assistant existe en français, mais il ouvrirait deux
   registres dans un même échange — et qui écrit « Préparez ma
   consultation » lit ensuite « je monte le résumé » de la même bouche.
   ============================================================ */

export const rotina = {
  perguntas: {
    maisFome: 'Pourquoi ai-je eu plus faim aujourd’hui ?',
    semFome: 'Pourquoi n’ai-je pas faim ?',
    depoisDaAplicacao: 'À quoi s’attendre après la piqûre ?',
    diminuirEnjoo: 'Comment faire baisser la nausée ?',
    trocarODia: 'Puis-je changer le jour de la piqûre ?',
    meusExames: 'Que montrent mes analyses ?',
    /* ⚠️ CES DEUX-LÀ NE SONT PAS DES QUESTIONS, ce sont des demandes : le
       companion construit l'analyse et monte le résumé. Les tourner en
       « Comment préparer ma consultation ? » changerait ce qui est demandé
       — un conseil au lieu d'un travail fait. */
    meuProgresso: 'Analysez mon évolution',
    prepararConsulta: 'Préparez ma consultation',
  },

  /* ⚠️⚠️ L'IMPÉRATIF ICI EST VOULU — « Buvez encore de l'eau », « Demandez
     le renouvellement ». Dans une relecture qui cherche le texte faisant des
     reproches, cette liste apparaît en entier et paraît la pire trouvaille
     de l'application ; elle ne l'est pas.

     Le reproche, c'est l'application qui juge ce qui est déjà passé. Ceci
     est la forme d'une liste de tâches, et c'est ce que la personne a
     ouvert l'écran pour voir : elle est venue demander quoi faire. Passer
     au substantif — « encore un verre aujourd'hui » — ne rend pas le texte
     plus doux, il rend la suggestion plus timide, et une suggestion timide
     dans une liste de quatre devient de la décoration. */
  empurroes: {
    agua: 'Buvez encore de l’eau aujourd’hui',
    /* ⚠️ LE MOTIF ÉTAIT UN DÉFICIT AVEC LE NOM DE LA PERSONNE DEVANT.
       « Vous êtes en dessous de la moitié de l'objectif » met le sujet à la
       place de qui a failli, et c'était le seul de cette liste sous cette
       forme : les voisins parlent du stylo, de l'agenda, du cycle. Ce qui
       manque d'eau est un fait de la journée, pas un défaut de caractère.

       ⚠️ ET « LES JOURS BIEN HYDRATÉS », ET NON « les jours où vous êtes
       bien hydratée » : le participe avec `être` affirmerait un genre.

       ⚠️ ET « EN DESSOUS DE L'OBJECTIF », PAS « À LA MOITIÉ ». La carte
       apparaît sous 60 % de l'objectif, et « à la moitié » donnait une
       proportion que personne n'a mesurée. Voir ../pt-BR. */
    aguaPorqueComEnjoo: 'Les jours bien hydratés, la nausée se fait moins sentir — et la journée est encore en dessous de l’objectif',
    aguaPorque: 'La journée est encore en dessous de l’objectif, et l’eau soutient la satiété jusqu’au bout',

    proteina: 'Renforcez les protéines au dîner',
    proteinaPorque: 'Vous êtes dans la phase du cycle où la faim revient, et les protéines d’aujourd’hui se voient dans la faim de demain',

    checkin: 'Faites le check-in du jour',
    checkinPorque: 'C’est le relevé qui alimente tout ce que j’arrive à voir de votre parcours',

    /* Le récipient arrive avec son article, depuis logic/formas : « le
       stylo », « la seringue ». La phrase est la même ; ce qui change, c'est
       la forme du médicament. */
    aplicacao: (recipiente: string) => `Sortez ${recipiente} et choisissez le site`,
    aplicacaoPorque: 'La piqûre de la semaine approche, et alterner les sites réduit l’irritation de la peau',

    receita: 'Demandez le renouvellement de l’ordonnance',
    /* ⚠️ L'ORDONNANCE EST NOMMÉE ICI, et ce n'est pas une redite du titre :
       le début de la ligne parle de doses dans le stylo, et un « elle » qui
       suivrait irait se coller au mot le plus proche. */
    /* ⚠️ Le mot « doses » vivait dans l'appel. Voir ../pt-BR. */
    receitaPorque: (doses: number, onde: string) =>
      `Il reste ${doses} ${doses === 1 ? 'dose' : 'doses'} ${onde} — une ordonnance demandée maintenant arrive avant la fin du stock`,

    /* Le texte de l'analyse vient du protocole ; ce qui est à nous, c'est le
       motif. */
    examePorque: 'C’est encore ouvert dans le protocole de cette semaine, et le résultat met souvent quelques jours',

    consulta: 'Préparez vos questions pour la consultation',
    consultaPorque: (tipo: string, doutor: string) =>
      `${tipo} avec ${doutor} — je prépare le résumé, vous choisissez ce que vous voulez demander`,
  },

  /* ⚠️ L'ÉTIQUETTE DU GROUPE SORT DU DÉLAI, ET LE DÉLAI SORT DE LA DONNÉE.
     « Cette semaine : prendre rendez-vous » est une liste de tâches ;
     « Dans 9 jours : préparez les questions » est quelqu'un qui organise
     l'agenda de quelqu'un d'autre. */
  prazo: {
    hoje: 'Aujourd’hui',
    amanha: 'Demain',
    estaSemana: 'Cette semaine',
    daquiA: (dias: number) => `Dans ${dias} jours`,
  },

  /* ⚠️ CES PHRASES SONT CE QUE LA CLINIQUE PRESCRIT, et le registre est plus
     formel que celui du reste de l'application pour cette raison. « Faire de
     l'exercice », et non « bouger » : l'informel servait quand l'objectif
     était un coup de pouce ; dans une liste à côté de la dose et des
     protéines, il détonne. */
  protocolo: {
    aguaTodoDia: (quanto: string) => `Boire ${quanto} tous les jours`,
    aguaEmDias: (quanto: string, dias: number) => `Boire ${quanto} en ${dias} jours`,
    origemAgua: 'Hydratation',

    proteinaTodoDia: (gramas: number) => `Manger ${gramas} g de protéines tous les jours`,
    proteinaEmDias: (gramas: number, dias: number) => `Manger ${gramas} g de protéines en ${dias} jours`,
    origemProteina: 'Alimentation',

    /* Des jours AVEC DU MOUVEMENT, et non des minutes : c'est ce que
       l'élément demande — quitter le canapé trois fois —, et c'est ce que le
       relevé sait dire sans deviner la modalité. */
    exercicio: (dias: number) => `Faire de l’exercice ${dias} ${dias === 1 ? 'jour' : 'jours'} dans la semaine`,
    origemExercicio: 'Exercice',

    aplicacaoUma: 'Piqûre de la semaine',
    aplicacaoVarias: (quantas: number) => `${quantas} piqûres dans la semaine`,
    origemAplicacao: 'Piqûres',

    /* Ce qui se compte dans chaque tâche. « 1 sur 1 jour » ne décrit pas une
       piqûre, d'où sa paire à elle. */
    unidadeDia: ['jour', 'jours'] as [string, string],
    unidadeAplicacao: ['piqûre', 'piqûres'] as [string, string],
    /* « 2 sur 7 jours » : en français la part se dit avec « sur », là où le
       portugais écrit « de ». */
    nota: (feito: number, alvo: number, unidade: string) => `${feito} sur ${alvo} ${unidade}`,
  },

  /* ⚠️ LE RÉSUMÉ DE CHAQUE OBJECTIF DIT LA MOYENNE, et non s'il a été tenu.
     La semaine est passée ; reprocher ce qu'on ne peut plus changer ne sert
     à personne. « Aucun relevé cette semaine » est ce qu'on dit quand il n'y
     a rien à dire — et c'est différent de zéro. */
  semanas: {
    aguaMeta: (quanto: string) => `Boire ${quanto} tous les jours`,
    proteinaMeta: (gramas: number) => `Manger ${gramas} g de protéines tous les jours`,
    exercicioMeta: (dias: number) => `Faire de l’exercice ${dias} jours dans la semaine`,
    semRegistro: 'aucun relevé cette semaine',
    mediaDeAgua: (quanto: string) => `moyenne de ${quanto} par jour`,
    mediaDeProteina: (gramas: number) => `moyenne de ${gramas} g par jour`,
    minutosNaSemana: (minutos: number) => `${minutos} min dans la semaine`,
    semMovimento: 'aucun mouvement relevé',
  },

  /* ⚠️ CHAQUE ÉLÉMENT A DEUX TITRES, et la différence entre eux est ce que
     le bloc fait : prêt, il NOMME ce qui existe déjà (« Poids à jour ») ;
     en attente, il dit quoi FAIRE (« Se peser avant »). La même ligne, deux
     verbes, et la personne lit la liste d'un coup d'œil en sachant ce qui
     manque. */
  preparo: {
    pesoNenhum: 'Noter le poids',
    pesoNenhumSub: 'Aucune pesée pour l’instant',
    pesoEmDia: 'Poids à jour',
    pesoAntigo: 'Se peser avant',
    pesoAntigoSub: (quando: string) => `Dernière pesée ${quando}`,
    pesoSub: (peso: string, quando: string) => `${peso} · ${quando}`,

    notasProntas: 'Questions notées',
    notasProntasSub: (quantas: number) => `${quantas} à emporter`,
    notasVazias: 'Noter vos questions',
    notasVaziasSub: 'Rien de noté pour l’instant',

    examesRecentes: 'Analyses récentes',
    examesRecentesSub: (nome: string, quando: string) => `${nome} · ${quando}`,
    exames: 'Analyses',
    /* ⚠️ « LA DERNIÈRE, C'ÉTAIT hier » ET NON « La dernière remonte à
       hier » : `quando` arrive déjà avec son « il y a », et « remonte à il y
       a trois jours » empile deux fois la même chose. */
    examesAntigosSub: (quando: string) => `La dernière, c’était ${quando}`,
    examesNenhumSub: 'Aucune analyse enregistrée',
  },

  /* ⚠️ LA MÊME FORME SUR TOUTES LES LIGNES DE LA PRÉPARATION, pour que l'œil
     compare les dates au lieu de les traduire. « il y a un mois » et non
     « il y a 1 mois » : le nombre en toutes lettres quand il est seul, c'est
     ainsi qu'on parle. */
  quando: {
    hoje: 'aujourd’hui',
    ontem: 'hier',
    haDias: (dias: number) => `il y a ${dias} jours`,
    haUmMes: 'il y a un mois',
    haMeses: (meses: number) => `il y a ${meses} mois`,
  },

  periodo: {
    pesoEstavel: 'Poids stable',
    pesoDe: (de: string, para: string) => `De ${de} à ${para}`,
    doseNova: (dose: string) => `Dose à ${dose} mg`,
    doseAnterior: (dose: string) => `Venait de ${dose} mg`,
    umaAplicacao: '1 piqûre',
    aplicacoes: (quantas: number) => `${quantas} piqûres`,
    marcadores: (quantos: number) => `${quantos} marqueurs`,
    umaOrientacao: '1 recommandation de l’équipe',
    orientacoes: (quantas: number) => `${quantas} recommandations de l’équipe`,
    /* Quand l'historique ne dit pas le type de la consultation. */
    consultaSemTipo: 'Consultation',
  },

  /* ⚠️ « VOUS » EST À LA FOIS ÉTIQUETTE ET SENTINELLE. Une séance sans
     `fonte` enregistrée est manuelle — manuel est ce qui existait avant
     qu'il y ait une origine —, et l'écran ne montre jamais l'absence : il
     montre « Vous », parce que l'absence ne répond pas « qui a noté ceci »,
     elle répond « je ne sais pas ».

     Traduire ne casse aucun relevé : la comparaison se fait toujours contre
     la valeur que l'application vient de rendre, jamais contre quelque chose
     venu du disque. */
  origemManual: 'Vous',

  /* ⚠️ « PASSÉ » EST ICI LE NOM DU TEMPS, PAS UN PARTICIPE. La pastille se
     pose à côté de « montée », « plateau », « descente », « point le plus
     bas » — féminin, masculin, féminin, masculin —, et un participe devrait
     s'accorder avec chacun. Les quatre valeurs sont donc des repères de
     temps, invariables : le passé, maintenant, demain, dans tant de jours. */
  selo: {
    passou: 'passé',
    agora: 'maintenant',
    amanha: 'demain',
    emDias: (dias: number) => `dans ${dias} jours`,
  },
};
