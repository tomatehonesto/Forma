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

  antesComDoseHead: 'Votre première dose est encore à venir.',
  /* ⚠️ LA MOLÉCULE, PAS LA MARQUE. Qui n'a pas encore fait d'injection
     lit ce qu'elle va ressentir, et ce qui cause l'effet est la
     substance — écrire la marque ici sonnerait comme de la publicité au
     seul moment où la personne n'a pas encore d'expérience à opposer. */
  antesComDoseBody: (molecula: string) =>
    `Les premiers jours sous ${molecula} apportent souvent moins de faim et une nausée légère. Noter comment vous vous sentez dès maintenant, c’est ce qui donne une base de comparaison ensuite.`,
  antesComDoseQ: 'À quoi s’attendre le jour de la dose ?',

  antesSemDoseHead: 'Votre traitement n’a pas encore de dose définie.',
  /* « Quand votre équipe la définira » et non « quand vous la
     définirez » : la dose est la décision de qui prescrit, et nous ne
     poussons personne à choisir un chiffre qui n'est pas le sien. */
  antesSemDoseBody: 'Quand votre équipe la définira, elle viendra ici — c’est à partir d’elle que nous construisons le cycle de la semaine et les rappels.',
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
    `Dans vos relevés, la nausée reste à ${perto} les deux premiers jours après la dose et descend à ${longe} à partir du troisième. Chaque palier répète souvent ce dessin.`,
  doseNovaBodySem: 'Chaque palier ramène souvent, pour quelques jours, ce qui était déjà passé — la nausée en premier. Cela tend à céder à mesure que votre corps s’ajuste.',
  doseNovaQ: 'Pourquoi ai-je des nausées ?',

  /* ⚠️ DIA A DIA, CONTADO DO REGISTRO DA DOSE (28/09/2026, pedido do dono):
     o dia 1 é o dia em que a primeira dose foi registrada, e cada dia tem
     o seu recado — o que é comum sentir, e o que vale registrar. Guia, e
     não diagnóstico: "é comum", "costuma". */
  primeiraChapeu: (n: number): string => `PREMIÈRE SEMAINE · JOUR ${n}`,
  primeiraDias: [
    { head: 'Votre première dose est enregistrée.', body: 'Il est courant de ne rien ressentir encore : le corps commence tout juste à découvrir le médicament. Un check-in ce soir servira de base pour comparer les prochains jours.', q: 'À quoi s’attendre le jour de la dose ?' },
    { head: 'La faim peut commencer à diminuer.', body: 'Beaucoup de personnes ont moins envie de manger à partir d’aujourd’hui. Manger lentement et s’arrêter au premier signe de satiété aide à éviter les nausées.', q: 'Pourquoi la faim diminue-t-elle ?' },
    { head: 'Pensez à l’eau.', body: 'Avec moins de faim, on boit aussi moins sans s’en rendre compte. Bien s’hydrater aide contre les nausées et pour le transit.', q: 'Combien d’eau dois-je boire ?' },
    { head: 'Les protéines d’abord.', body: 'Avec une assiette plus petite, commencez par les protéines : elles aident à préserver les muscles pendant que le poids baisse.', q: 'Pourquoi les protéines comptent-elles autant ?' },
    { head: 'Comment va votre transit ?', body: 'La constipation est fréquente les premières semaines. La noter dans le check-in aide à voir si elle passe, et à en parler en consultation.', q: 'Qu’est-ce qui aide contre la constipation ?' },
    { head: 'La faim peut revenir un peu.', body: 'Vers la fin du cycle, il est normal que l’appétit revienne un peu. Cela fait partie du traitement, et c’est pour cela que la prochaine dose a un jour fixe.', q: 'Pourquoi la faim revient-elle avant la prochaine dose ?' },
    { head: 'Une semaine de traitement.', body: 'Vous avez terminé votre première semaine. Ce sont les check-ins de ces jours qui montrent comment votre corps a réagi, et ce qu’il vaut la peine d’apporter en consultation.', q: 'Comment s’est passée ma première semaine ?' },
  ],

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
    `${atual}, contre ${alvo}${por ? ` notés par ${por}` : ''} — et cela fait au moins un mois dans cette fourchette. Maintenir est un travail différent de perdre, et c’est ce qui décide si le résultat tient.`,
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
    `La moyenne de vos pesées est à ${media} depuis. Le plateau fait partie du traitement : votre corps dépense moins à mesure que le poids descend. C’est un sujet de consultation, pas d’effort.`,
  platoBodyDois: (antes: string, agora: string) =>
    `${antes} il y a quatre semaines, ${agora} maintenant. Le plateau fait partie du traitement : votre corps dépense moins à mesure que le poids descend. C’est un sujet de consultation, pas d’effort.`,
  platoQ: 'Où en est mon évolution ?',
};
