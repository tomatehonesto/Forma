/* ============================================================
   LES OBJECTIFS — les chiffres que l'application compte et ceux que seule la personne connaît · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/metas.ts. Trois catalogues
   différents habitent ici — les CIBLES du profil, les INDICATEURS que
   l'application sait compter, et les objectifs PERSONNELS qu'elle ne
   mesure pas. Ce qui commande la traduction :

   LES PERSONNELS SONT DES CATÉGORIES, PAS DES PHRASES TOUTES FAITES. La
   liste dit DE QUOI il s'agit, et la question du second toucher la rend
   sienne. Il faut garder les deux pièces : le nom court pour la liste et
   la question qui oblige à préciser.

   ET LE PRÉFIXE FERME LA PHRASE. La personne écrit un morceau — « volley »,
   « la robe du mariage » — et `monta` rend la phrase entière.

   ⚠️⚠️ EN FRANÇAIS, LE PRÉFIXE A UNE CONTRAINTE DE PLUS : il ne peut pas
   demander une préposition qui s'élide ou se contracte devant ce que la
   personne écrit. « Arrêter de » devient « d'aller » devant une voyelle,
   et « Retourner à » devient « au parc » devant un article — deux fautes
   que personne ne peut corriger après coup. Les préfixes d'ici sont donc
   choisis pour n'avoir besoin de rien : « Ne plus », « Retrouver »,
   « Porter ». « Commencer à » reste parce que « à » ne s'élide pas.

   ⚠️ ET LE NOM DE L'ONGLET EST « PARCOURS » — le même mot que le companion
   emploie déjà (« je connais votre parcours depuis le premier jour »). La
   barre d'onglets est encore écrite en dur dans ui/TabBar ; le jour où
   elle sortira dans le catalogue, c'est ce mot-là qu'elle doit reprendre.
   ============================================================ */

export const metas = {
  /* ============================================================
     LES CIBLES — les quatre chiffres que l'application compte
     ============================================================ */
  alvos: {
    /* ⚠️ C'ÉTAIT LA MÊME PHRASE ÉCRITE TROIS FOIS, une par chiffre du jour.
       Elle est la même parce que le fait est le même — le protocole compte
       les jours contre les trois —, et trois copies divergeraient à la
       première fois que quelqu'un améliorerait la rédaction de l'une.

       Ce qu'elle fait : dire ce que la personne ne peut pas savoir en
       regardant la fiche. Baisser l'objectif de protéines fait marquer le
       protocole de l'équipe comme tenu sans que rien n'ait changé dans
       l'assiette. Elle ne bloque pas et ne juge pas.

       L'objectif de poids n'a pas cette réserve, parce qu'aucun protocole
       ne compte contre lui. */
    ressalvaDoProtocolo: 'Le protocole de la semaine compte les jours où vous avez atteint ce chiffre. Le changer ici change aussi ce que le protocole de votre équipe considère comme tenu.',

    prot: {
      nome: 'Protéines par jour',
      onde: 'Comptées dans l’alimentation et dans le protocole',
      origem: 'Calculé d’après votre poids, à 1,2 g par kilo',
      un: 'g',
      escreve: (gramas: number) => String(gramas),
    },
    waterMl: {
      nome: 'Hydratation par jour',
      origem: 'Calculé d’après votre poids, votre âge et votre niveau d’activité',
      onde: 'Comptée dans l’hydratation et dans le protocole',
    },
    exercMin: {
      nome: 'Exercice par jour',
      onde: 'C’est la ligne pointillée de la semaine, dans l’exercice',
      /* ⚠️ CELUI-CI N'EST PAS CALCULÉ, et il serait facile d'écrire qu'il
         l'est pour que la phrase ressemble aux deux autres. C'est 60
         minutes pour tout le monde, et l'inscription ne demande rien qui
         changerait ça. */
      origem: 'Le réglage par défaut, le même pour tout le monde',
      un: 'min',
      escreve: (minutos: number) => String(minutos),
    },
    peso: {
      /* ⚠️ LE MÊME NOM QU'À L'INSCRIPTION. La question là-bas est « quel est
         votre objectif de poids ? », et ici le champ s'appelait « poids de
         référence » — deux noms pour le même chiffre, et qui voulait
         changer sa réponse devait deviner lequel des deux c'était. */
      nome: 'Objectif de poids',
      onde: 'Il mesure tout le voyage, dans le Parcours',
      /* Le seul des quatre que la personne a vraiment choisi — et c'est
         pour ça que sa phrase ne parle d'aucun calcul. */
      origem: 'Vous l’avez choisi à l’inscription',
    },
  },

  /* ============================================================
     LES INDICATEURS — ce que l'application sait compter

     ⚠️ LE NOM DANS LA LISTE EST GÉNÉRIQUE EXPRÈS : « Heures de sommeil », et
     non « Dormir 7 h+ ». Choisir la chose et choisir le chiffre sont deux
     décisions, et la seconde est la personnelle — sept heures est ce que
     la littérature répète et reste quand même un pari sur la vie de
     quelqu'un.

     ⚠️ `origem` DIT D'OÙ SORT LE CHIFFRE, et c'est ce qui décide si
     l'objectif vaut la peine d'être créé : qui ne note jamais de repas doit
     voir, avant de choisir, que l'objectif de protéines restera à zéro.

     ⚠️ `nomes` EST CE QUI SE COMPTE, au singulier et au pluriel, et
     `femininas` en est l'accord. Sans cette paire, « 11 sur 13 nuits
     enregistrées » sortirait en « enregistrés ». En français le partage
     tombe exactement au même endroit qu'en portugais : « nuit » est
     féminin, « jour » est masculin.
     ============================================================ */
  indicadores: {
    sono: {
      nome: 'Heures de sommeil',
      pergunta: 'Combien d’heures par nuit ?',
      origem: 'Du sommeil que vous notez au check-in',
      nomes: ['nuit', 'nuits'] as [string, string],
      femininas: true,
      un: 'h',
      escreve: (horas: number) => `${horas} h`,
      rotulo: (horas: number) => `Dormir ${horas} h par nuit`,
      conta: (horas: number) => `Nuits avec ${horas} h ou plus`,
    },
    energia: {
      nome: 'Énergie dans la journée',
      pergunta: 'À partir de quel niveau ça compte ?',
      origem: 'De l’énergie que vous notez au check-in',
      nomes: ['jour', 'jours'] as [string, string],
      femininas: false,
      un: 'sur 5',
      escreve: (nivel: number) => `${nivel} sur 5`,
      rotulo: (nivel: number) => `Énergie ${nivel} ou plus`,
      conta: (nivel: number) => `Jours avec une énergie de ${nivel} ou plus, de 1 à 5`,
    },
    humor: {
      nome: 'Humeur dans la journée',
      pergunta: 'À partir de quel niveau ça compte ?',
      origem: 'De l’humeur que vous notez au check-in',
      nomes: ['jour', 'jours'] as [string, string],
      femininas: false,
      un: 'sur 5',
      escreve: (nivel: number) => `${nivel} sur 5`,
      rotulo: (nivel: number) => `Humeur ${nivel} ou plus`,
      conta: (nivel: number) => `Jours avec une humeur de ${nivel} ou plus, de 1 à 5`,
    },
    /* ⚠️ LA NAUSÉE ET LA FAIM COMPTENT À L'ENVERS : la réussite est le jour
       où le chiffre est resté BAS, et c'est pour ça que la question est
       « jusqu'à quel niveau ça compte encore comme bon ». La remplacer par
       « à partir de quel niveau » renverse tout l'objectif sans que rien ne
       le signale. */
    enjoo: {
      nome: 'Nausée',
      pergunta: 'Jusqu’à quel niveau ça compte encore comme bon ?',
      origem: 'De la nausée que vous notez au check-in',
      nomes: ['jour', 'jours'] as [string, string],
      femininas: false,
      un: 'sur 5',
      escreve: (nivel: number) => `${nivel} sur 5`,
      rotulo: (nivel: number) => `Nausée ${nivel} ou moins`,
      conta: (nivel: number) => `Jours avec une nausée de ${nivel} ou moins, de 1 à 5`,
    },
    fome: {
      nome: 'Faim',
      pergunta: 'Jusqu’à quel niveau ça compte encore comme bon ?',
      origem: 'De la faim que vous notez au check-in',
      nomes: ['jour', 'jours'] as [string, string],
      femininas: false,
      un: 'sur 5',
      escreve: (nivel: number) => `${nivel} sur 5`,
      rotulo: (nivel: number) => `Faim ${nivel} ou moins`,
      conta: (nivel: number) => `Jours avec une faim de ${nivel} ou moins, de 1 à 5`,
    },
    prot: {
      nome: 'Protéines par jour',
      pergunta: 'Combien de grammes par jour ?',
      origem: 'Des repas que vous notez',
      nomes: ['jour', 'jours'] as [string, string],
      femininas: false,
      escreve: (gramas: number) => `${gramas} g`,
      rotulo: (gramas: number) => `Manger ${gramas} g de protéines`,
      conta: (gramas: number) => `Jours avec ${gramas} g ou plus`,
    },
    /* Les trois du bas reçoivent la quantité DÉJÀ ÉCRITE — « 2,5 L »,
       « 85 fl oz » —, parce que l'unité est une décision de logic/medidas
       et non de langue. Ici n'entre que la phrase autour. */
    agua: {
      nome: 'Hydratation par jour',
      pergunta: 'Combien par jour ?',
      origem: 'De ce que vous notez dans l’hydratation',
      nomes: ['jour', 'jours'] as [string, string],
      femininas: false,
      rotulo: (quanto: string) => `Boire ${quanto} d’eau`,
      conta: (quanto: string) => `Jours avec ${quanto} ou plus`,
    },
    exerc: {
      nome: 'Minutes de mouvement',
      pergunta: 'Combien de minutes par jour ?',
      origem: 'Des séances que vous notez',
      nomes: ['jour', 'jours'] as [string, string],
      femininas: false,
      escreve: (minutos: number) => `${minutos} min`,
      rotulo: (minutos: number) => `Bouger ${minutos} min par jour`,
      conta: (minutos: number) => `Jours avec ${minutos} min ou plus`,
    },
  },

  /* ============================================================
     LES OBJECTIFS PERSONNELS — ce que l'application ne mesure pas

     ⚠️ LE TEMPS DU VERBE CHOISISSAIT LA VIE DE LA PERSONNE, et ça a été
     réparé. « Recommencer à pratiquer » présuppose qu'elle a pratiqué ; qui
     veut se mettre à la natation à quarante ans n'entrait pas dans la seule
     catégorie de l'application qui parlait de sport.

     La seule qui présuppose encore est celle du lieu — et elle le DIT dans
     son propre nom, ce qui est la différence entre présupposer et demander.

     ⚠️ LES EXEMPLES VONT DANS LA QUESTION, JAMAIS DANS L'INDICATION DU
     CHAMP. Un exemple dans un champ est une suggestion : qui en lit un
     avant d'avoir pensé à son propre objectif écrit celui de l'exemple.
     Dans la question, ils sont ce qu'ils doivent être — la forme de la
     réponse, pas la réponse.

     ⚠️ ET AUCUNE CATÉGORIE NE SUPPOSE UNE FAMILLE, UN CORPS OU DE L'ARGENT.
     Un objectif qui n'entre pas dans la vie de qui le lit est pire qu'un
     champ vide.
     ============================================================ */
  pessoais: {
    roupa: {
      nome: 'Un vêtement',
      /* « Au fond de l'armoire », et non du placard : « placard » est de
         France, « garde-robe » du Québec, et « armoire » se comprend
         partout. */
      pergunta: 'Quel vêtement voulez-vous porter ? Celui qui dort au fond de l’armoire, un que vous avez vu en vitrine — celui qui vous vient à l’esprit.',
      dica: 'Écrivez le vêtement',
      monta: (r: string) => `Porter ${r}`,
    },
    esporte: {
      nome: 'Un sport',
      pergunta: 'Quel sport voulez-vous pratiquer ? Celui que vous avez déjà fait un jour comme celui que vous n’avez jamais essayé.',
      dica: 'Écrivez le sport',
      monta: (r: string) => `Pratiquer ${r}`,
    },
    folego: {
      /* « Quelque chose du quotidien », et non « sans perdre le souffle » :
         l'obstacle peut être un genou, une douleur, une gêne — et nommer le
         mauvais exclut qui a l'autre. */
      nome: 'Quelque chose du quotidien',
      pergunta: 'Qu’est-ce que vous voulez arriver à faire sans vous fatiguer ? Monter l’escalier de chez vous, porter les courses, marcher jusqu’au coin de la rue sans vous arrêter en chemin.',
      dica: 'Écrivez l’activité',
      monta: (r: string) => `Arriver à ${r}`,
    },
    sentir: {
      nome: 'Comment je me sens',
      pergunta: 'Comment voulez-vous vous sentir ? Avec plus d’allant, plus à l’aise dans votre corps — comme ça a du sens pour vous.',
      dica: 'Écrivez comment vous voulez vous sentir',
      monta: (r: string) => `Me sentir ${r}`,
    },
    foto: {
      nome: 'Une photo',
      pergunta: 'Quelle photo voulez-vous avoir ? Une à la plage, une avec ceux que vous aimez, ou juste une où vous vous reconnaissez.',
      dica: 'Écrivez la photo',
      monta: (r: string) => `Prendre ${r}`,
    },
    lugar: {
      /* ⚠️ LE NOM DIT LA PRÉSUPPOSITION, et c'est la seule qui reste. Ici
         elle est le sujet : il ne s'agit pas d'y arriver, il s'agit d'y
         revenir — qui cesse d'aller à la plage a rarement cessé par manque
         de force. Qui veut un endroit nouveau a « Un autre objectif ».

         ⚠️ ET « RETROUVER », ET NON « RETOURNER À » : la personne écrit
         « le parc », et « à le parc » n'existe pas. Le verbe sans
         préposition passe partout. */
      nome: 'Un endroit que vous ne fréquentez plus',
      pergunta: 'Où voulez-vous retourner ? La plage, la piscine, la fête de quelqu’un — l’endroit que vous laissez de côté.',
      dica: 'Écrivez l’endroit',
      monta: (r: string) => `Retrouver ${r}`,
    },
    comecar: {
      nome: 'Une habitude à prendre',
      pergunta: 'Qu’est-ce que vous voulez commencer à faire ? Marcher le matin, cuisiner le dimanche, vous coucher plus tôt.',
      dica: 'Écrivez l’habitude',
      monta: (r: string) => `Commencer à ${r}`,
    },
    largar: {
      /* ⚠️ « NE PLUS », ET NON « ARRÊTER DE » : devant une voyelle, « de »
         s'élide en « d' », et personne ne peut le corriger après coup. « Ne
         plus grignoter la nuit » et « Ne plus aller au distributeur »
         marchent tous les deux sans rien changer. */
      nome: 'Une habitude à laisser',
      pergunta: 'Qu’est-ce que vous voulez arrêter de faire ? Manger debout, grignoter la nuit — ce qui vaut pour vous.',
      dica: 'Écrivez l’habitude',
      monta: (r: string) => `Ne plus ${r}`,
    },
    /* La sortie pour ce qui n'entre dans aucune catégorie — la même chose
       que les autres, mais sans préfixe : ici la phrase entière est de qui
       l'écrit, et `monta` rend ce qu'elle a écrit. */
    livre: {
      nome: 'Un autre objectif',
      pergunta: 'Qu’est-ce que vous voulez réussir ? Écrivez-le à votre façon — nous le gardons exactement comme vous l’écrivez.',
      dica: 'Écrivez votre objectif',
      monta: (r: string) => r,
    },
  },

  /* ============================================================
     LES ÉCHÉANCES — relatives, et vraiment facultatives

     Qui met une échéance à un objectif de traitement pense « dans trois
     mois », pas au 14 décembre. Et la première option est de NE PAS en
     avoir, déjà sélectionnée : un objectif sans date reste un objectif ; ce
     qu'il ne peut pas, c'est gagner une échéance que la personne n'a pas
     choisie.
     ============================================================ */
  prazos: {
    nao: 'Sans échéance',
    umMes: 'Dans 1 mois',
    tresMeses: 'Dans 3 mois',
    seisMeses: 'Dans 6 mois',
    umAno: 'Dans 1 an',
  },

  /* ============================================================
     LA LIGNE DE CHAQUE OBJECTIF, DANS LE PARCOURS
     ============================================================ */
  jornada: {
    /* ⚠️ LE COMPTE, ET NON LE POURCENTAGE UNE SECONDE FOIS. La ligne disait
       « 85% » à droite et « 85% des nuits récentes » en dessous — le même
       chiffre deux fois. « 11 sur 13 nuits » répond : de combien de nuits
       parle-t-on. */
    contagem: (quantas: number, de: number, nome: string, femininas: boolean) =>
      `${quantas} sur ${de} ${nome} ${femininas ? 'enregistrées' : 'enregistrés'}`,
    /* ⚠️ « PAS ENCORE DE nuits » N'ACCORDE RIEN, et c'est voulu : la ligne
       reçoit « jours » sept fois sur huit et « nuits » une fois, et un
       participe ici devrait connaître le genre de ce qui arrive. Le
       portugais et l'espagnol écrivaient « registradas » en dur, au féminin,
       et sortaient « sem dias registradas ». */
    semRegistros: (plural: string) => `pas encore de ${plural}`,

    /* Le personnel n'a pas de fraction : il a la date, qui est la part de la
       réussite qu'on raconte à quelqu'un. */
    conquistadaEm: (data: string) => `atteint le ${data}`,
    /* ⚠️ L'ÉCHÉANCE EST UN FAIT, PAS UN REPROCHE. Passée et non atteinte, la
       ligne dit qu'elle est passée et s'arrête là — sans rouge et sans « en
       retard ». Dans un traitement de plusieurs mois, une date qui glisse
       est la chose la plus banale du monde, et l'objectif tient toujours
       debout. */
    ate: (data: string) => `d’ici le ${data}`,
    oPrazoEra: (data: string) => `l’échéance était le ${data}`,
    vocemarca: 'vous cochez le jour venu',
  },

  /* ⚠️ LES DEUX ÉCRANS D'OBJECTIF VIVAIENT DANS LE CODE, et c'est
     l'allemand qui les a dénoncés : la liste s'ouvrait sur des titres
     portugais à côté de noms de cible allemands. Voir ../pt-BR/metas.

     ⚠️ ET UNE LIGNE D'ICI A FAILLI ACCORDER AVEC QUI LIT. « J'y suis
     arrivé » sur le bouton de l'objectif personnel demande un genre que
     le portugais ne demande pas — « Consegui » n'accorde rien. La sortie
     est l'impersonnel : « C'est fait ». */
  tela: {
    /* ---------- la liste ---------- */
    titulo: 'Objectifs',
    progresso: (perdido: string, total: string, alvo: string) => `${perdido} sur ${total} jusqu’à ${alvo}`,
    novaMeta: 'Nouvel objectif',

    numerosTitulo: 'Vos chiffres du jour',
    numerosNota: 'C’est ce que comptent les écrans de l’eau, de l’alimentation et de l’exercice, et ce que le protocole additionne.',

    /* ⚠️ « VIA », ET NON « DE » : le chiffre est passé PAR l'équipe — dit
       en consultation et noté ensuite. « De votre équipe » sonne comme une
       possession, comme si la ligne appartenait au cabinet et non à
       elle. */
    equipeMira: (valor: string) => `Votre équipe vise ${valor}`,
    alterada: 'Modifié par vous',
    viaEquipe: 'Via votre équipe',

    suasTitulo: 'Vos objectifs à vous',
    suasNota: 'Les objectifs mesurés, nous les suivons dans vos relevés. Les vôtres, c’est vous qui les cochez.',

    vazioTitulo: 'Aucun objectif pour l’instant',
    vazioTexto: 'Écrivez une chose que vous voulez réussir. Elle reste ici jusqu’à ce qu’elle arrive.',

    /* ---------- la feuille d'un des quatre chiffres ---------- */
    definidoPelaEquipe: 'Défini par votre équipe',
    novoValor: 'Nouvelle valeur',
    salvar: 'Enregistrer',

    hoje: (valor: string) => `Aujourd’hui : ${valor}`,
    origemSua: 'Un chiffre à vous',
    origemDaEquipe: (por: string, quando: string) => `Défini par ${por}, noté le ${quando}`,
    /* Avec l'auxiliaire AVOIR, le participe n'accorde rien. */
    origemVoceEm: (quando: string) => `Vous avez défini ce chiffre le ${quando}`,
    origemEmuda: (origem: string, muda: string) => `${origem}. ${muda}`,
    mudaPeso: 'C’est le point d’arrivée convenu avec votre équipe, et y toucher change l’échelle du Parcours et de l’évolution — sans effacer rien de ce qui est déjà noté.',
    mudaOutros: 'Le changement vaut à partir de maintenant : les jours déjà notés gardent ce qu’ils valaient, et ce qui change, c’est ce à quoi on les compare.',

    travadoTitulo: (por: string) => `C’est ${por} qui l’a défini`,
    travadoTexto: 'Ce chiffre fait partie de votre traitement, et c’est pour ça qu’il ne se change pas ici. S’il ne convient plus — une autre consigne, une contrainte apparue, une nouvelle équipe —, retirez la note dans l’Espace médical et il redevient le vôtre.',
    divergeTitulo: 'Ce chiffre n’est pas celui de votre équipe',
    divergeTexto: (por: string, dela: string, nosso: string) =>
      `${por} a défini ${dela}, et nous comptons sur ${nosso}. Nous gardons les deux : vous pouvez revenir au sien dans l’Espace médical, ou emporter l’écart à la prochaine consultation.`,
    recomendadoTitulo: 'C’est la valeur recommandée',

    verAnotacao: 'Voir la note de votre équipe',
    anotacaoSub: (por: string, valor: string) => `${por} · ${valor}`,

    /* ---------- la feuille d'un nouvel objectif ---------- */
    novaSub: 'Une chose à vous. Nous la gardons pour vous, et c’est vous qui la cochez',
    escolhaOTipo: 'Choisissez le type',
    escrevaDoSeuJeito: 'Écrivez-le à votre façon',

    guardarMeta: 'Enregistrer l’objectif',
    respondaParaGuardar: 'Répondez pour enregistrer',
    prazoRotulo: 'Échéance (facultatif)',

    /* ⚠️ LES GUILLEMETS SONT CEUX DE LA LANGUE, et ils portent une espace
       fine insécable à l'intérieur — c'est la même U+202F que la
       ponctuation double. D'où la phrase entière en fonction. */
    vaiAparecer: (frase: string, ate: string) => `Ça apparaîtra comme ça : « ${frase} »${ate}.`,
    vaiAparecerAte: (data: string) => `, d’ici le ${data}`,
    aindaNaoAteMarcar: 'Il reste à « pas encore » jusqu’à ce que vous le cochiez. Le jour où ça arrive, nous gardons aussi la date.',

    /* ---------- la feuille d'un objectif de la liste ---------- */
    metaTitulo: 'Objectif',
    naoEncontrei: 'Je n’ai pas trouvé cet objectif',
    apagadaEmOutraTela: 'Il a peut-être été supprimé sur un autre écran.',
    subPessoal: 'Objectif à vous, coché par vous',
    subMedida: 'Objectif mesuré par vos check-ins',

    conquistada: 'Atteint',
    aindaNao: 'Pas encore',
    /* ⚠️ « C'EST FAIT » ET NON « J'Y SUIS ARRIVÉ » : avec être, le
       participe affirmerait un genre. Voir le haut du fichier. */
    consegui: 'C’est fait',
    aindaNaoConsegui: 'Toujours pas',
    apagar: 'Supprimer',

    contamosPorVoce: 'Celui-ci, nous le comptons pour vous',
    contamosTexto: 'Il sort de vos check-ins des quatorze derniers jours, et seulement des jours où vous avez répondu. Il ne se coche pas à la main — et c’est ce qui fait que le chiffre vaut quelque chose.',
  },
};
