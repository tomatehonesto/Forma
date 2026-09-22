/* ============================================================
   L'ÉTAPE DU TRAITEMENT — les messages qui ouvrent l'écran d'accueil · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/etapa.ts.

   ⚠️ LE CHAPEAU DOIT TENIR EN DEUX MOTS. C'est l'étiquette en capitales
   au-dessus du titre, et l'écran d'accueil la dessine sur une seule
   ligne : ce qui déborde casse la carte. « MANUTENÇÃO » tient en
   « ENTRETIEN » ; « ANTES DE COMEÇAR » en « AVANT DE COMMENCER », qui est
   déjà à la limite.
   ============================================================ */

export const etapa = {
  antesChapeu: 'AVANT DE COMMENCER',

  antesComDoseHead: 'Votre première injection est encore à venir.',
  /* ⚠️ LA MOLÉCULE, PAS LA MARQUE. Qui n'a pas encore fait d'injection
     lit ce qu'elle va ressentir, et ce qui cause l'effet est la
     substance — écrire la marque ici sonnerait comme de la publicité au
     seul moment où la personne n'a pas encore d'expérience à opposer. */
  antesComDoseBody: (molecula: string) =>
    `Les premiers jours avec ${molecula} apportent souvent moins de faim et une nausée légère. Noter comment vous vous sentez dès maintenant, c’est ce qui donne une base de comparaison ensuite.`,
  antesComDoseQ: 'À quoi s’attendre le jour de l’injection ?',

  antesSemDoseHead: 'Votre traitement n’a pas encore de dose définie.',
  /* « Quand votre équipe la définira » et non « quand vous la
     définirez » : la dose est la décision de qui prescrit, et nous ne
     poussons personne à choisir un chiffre qui n'est pas le sien. */
  antesSemDoseBody: 'Quand votre équipe la définira, elle tiendra ici — c’est à partir d’elle que nous construisons le cycle de la semaine et les rappels.',
  antesSemDoseQ: 'Comment fonctionne le cycle du médicament ?',

  doseNovaChapeu: 'NOUVELLE DOSE',
  /* ⚠️⚠️ LE SUJET EST LA DOSE, PAS LA PERSONNE — et en français ce
     n'est pas du style, c'est de la grammaire.

     J'avais écrit « Vous êtes passée à 5 mg ». Avec l'auxiliaire être,
     le participe s'accorde avec le sujet : cette phrase affirme que qui
     lit est une femme. Le portugais « Você subiu » et l'espagnol
     « Subiste » ne portent aucun genre, donc rien n'avertissait.

     « Vous êtes passé(e) » est laid et « Vous avez augmenté à » est
     bancal. La sortie est celle que le fichier des lectures impose déjà
     partout : METTRE LA CHOSE EN SUJET. « Votre dose est passée » accorde
     avec la dose, qui est féminine, et ne dit rien de personne.

     ⚠️ La règle vaut pour tout le catalogue français : aucune phrase ne
     doit accorder un participe avec qui la lit. */
  doseNovaHead: (dose: string, unidade: string) =>
    `Votre dose est passée à ${dose} ${unidade} cette semaine.`,
  /* ⚠️ LE CADRE EST LE MÊME ET LE CONTENU EST LE SIEN QUAND IL EXISTE.
     Avec assez de relevés, la phrase raconte le dessin de SES nausées ;
     sans eux, celui qui arrive d'habitude. */
  doseNovaBodyCom: (perto: string, longe: string) =>
    `Dans vos relevés, la nausée reste à ${perto} les deux premiers jours après l’injection et descend à ${longe} à partir du troisième. Chaque palier répète souvent ce dessin.`,
  doseNovaBodySem: 'Chaque palier ramène souvent, pour quelques jours, ce qui était déjà passé — la nausée en premier. Cela tend à céder à mesure que le corps s’ajuste.',
  doseNovaQ: 'Pourquoi ai-je des nausées ?',

  primeiraChapeu: 'PREMIÈRE SEMAINE',
  primeiraHead: 'C’est votre première semaine de traitement.',
  /* « Le corps est encore en train de découvrir le médicament » — la
     phrase met le corps en sujet à dessein : ce qui se passe n'est ni une
     faute de qui le prend ni un effet à supporter, c'est un ajustement. */
  primeiraBody: 'Le corps est encore en train de découvrir le médicament. Nausée légère, moins de faim et un peu de fatigue sont les retours les plus courants des premiers jours, et ils s’atténuent avec les semaines.',
  primeiraQ: 'À quoi s’attendre le jour de l’injection ?',

  manutencaoChapeu: 'ENTRETIEN',
  /* ⚠️ LA PROVENANCE ENTRE DANS LA PHRASE, TOUJOURS. « La fourchette que
     votre équipe a définie » ne peut se dire que si quelqu'un a noté de
     qui elle venait — et la différence entre les deux titres n'est pas de
     ton, elle est de fait. */
  manutencaoHeadEquipe: 'Vous êtes dans la fourchette que votre équipe a définie.',
  manutencaoHeadDela: 'Vous êtes au poids que vous vous étiez fixé.',
  /* ⚠️ « MAINTENIR EST UN TRAVAIL DIFFÉRENT DE PERDRE » est le cœur de la
     phrase, pas un ornement : on dit souvent à qui atteint son objectif
     que c'est fini, et ce qui décide si le résultat tient, c'est
     justement ce qui vient après. */
  manutencaoBody: (atual: string, alvo: string, por: string | null) =>
    `${atual}, contre ${alvo}${por ? ` notés par ${por}` : ''} — et cela fait au moins un mois dans cette fourchette. Maintenir est un travail différent de perdre, et c’est ce qui décide si le résultat tient.`,
  manutencaoQ: 'Où en est mon évolution ?',

  platoChapeu: 'POIDS STABLE',
  platoHead: 'Votre poids est immobile depuis environ un mois.',
  /* ⚠️⚠️ L'EXPLICATION VIENT AVANT TOUTE SUGGESTION, ET LA SUGGESTION
     N'EST PAS « FAITES PLUS D'EFFORTS ».

     Le plateau est de la physiologie : le corps dépense moins à mesure
     qu'il pèse moins, et la même dose rencontre désormais un corps
     différent. Qui lit ceci fait comme d'habitude et voit la balance
     s'arrêter — la dernière chose dont elle a besoin, c'est d'une
     application qui suggère que le problème, c'est elle.

     ⚠️ « C'EST UN SUJET DE CONSULTATION, PAS D'EFFORT » est la phrase
     entière en six mots, et c'est la raison pour laquelle la carte n'a pas
     de bouton d'action. La remplacer par quoi que ce soit du genre « voyez
     ce que vous pouvez faire » défait la carte.

     ⚠️ ET QUAND LES DEUX CHIFFRES S'ARRONDISSENT PAREIL, on ne le dit pas
     deux fois. « 78,2 kg il y a quatre semaines, 78,2 kg maintenant » est
     exact et ressemble à un bug — et un chiffre qui ressemble à un bug
     emporte la phrase entière avec lui. */
  platoBodyIgual: (media: string) =>
    `La moyenne de vos pesées est à ${media} depuis. Le plateau fait partie du traitement : le corps dépense moins à mesure que le poids descend. C’est un sujet de consultation, pas d’effort.`,
  platoBodyDois: (antes: string, agora: string) =>
    `${antes} il y a quatre semaines, ${agora} maintenant. Le plateau fait partie du traitement : le corps dépense moins à mesure que le poids descend. C’est un sujet de consultation, pas d’effort.`,
  platoQ: 'Où en est mon évolution ?',
};
