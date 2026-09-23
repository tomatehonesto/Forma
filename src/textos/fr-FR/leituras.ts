/* ============================================================
   LES LECTURES — ce que l'application dit après avoir lu les réponses · fr-FR

   ⚠️⚠️ QUATRE VERROUS VALENT POUR LE FICHIER ENTIER, et aucun n'est du
   style. Les raisons complètes vivent dans ../pt-BR/leituras.ts :

   1. AUCUNE NE NOMME UN DIAGNOSTIC. Qui lit a déjà le symptôme, et un nom
      de maladie effraie sans aider à décider du pas suivant.

   2. LE SUJET EST LE SYMPTÔME OU LE CORPS, JAMAIS LA PERSONNE. « Vomir
      beaucoup » et « à ce rythme » décrivaient l'involontaire comme une
      habitude — qui vomit ne vomit pas trop, elle vomit. Elle est celle
      qui lit, pas celle qui l'a causé.

   3. LES SEUILS SONT CLINIQUES, PAS RÉDACTIONNELS. La douleur et le
      vertige alertent au 4, là où la journée s'est déjà interrompue ; les
      comptages alertent à l'échelon où la gradation clinique change de
      palier. On traduit les mots, pas les nombres.

   4. LE `curto` NOMME L'OBJET DU VERBE, TOUJOURS. « Buvez par petites
      gorgées » laisse la personne combler le trou toute seule, et dans
      une ligne lue en passant le trou reste. « Buvez de l'eau par petites
      gorgées » ne laisse aucun doute.

   ⚠️⚠️ ET « LES URGENCES » EST LE MOT, dans les vingt pays francophones.
   C'est la leçon que l'espagnol a coûtée : là-bas j'avais écrit
   « guardia », qui est l'urgence hospitalière en Argentine et un AGENT DE
   SÉCURITÉ au Mexique. Le français n'a pas cette fracture — mais la
   vérifier faisait partie du travail, pas de la chance.
   ============================================================ */

export const leituras = {
  dorSobre: 'Douleur abdominale',
  dorCurto: 'parlez-en à votre équipe aujourd’hui',
  dorTitulo: 'Cette douleur n’attend pas la prochaine consultation',
  /* ⚠️ « PRESQUE JAMAIS GRAVE — ET C'EST JUSTEMENT POUR ÇA QU'IL VAUT
     MIEUX REGARDER TÔT » est la phrase entière. Elle demande de
     l'attention sans effrayer, et le « justement pour ça » est ce qui
     empêche la lecture de devenir une alarme. */
  dorTexto: 'Une douleur forte au ventre, ou qui ne passe pas, demande de l’attention le jour même. Ce n’est presque jamais grave — et c’est justement pour ça qu’il vaut mieux regarder tôt.',
  dorAcao: 'Parlez-en à votre équipe aujourd’hui. Si ça empire ou si des vomissements s’y ajoutent, allez consulter.',

  vomitoSobre: 'Vomissements',
  vomitoCurto: 'buvez de l’eau par petites gorgées, souvent',
  vomitoTitulo: 'Les vomissements emportent plus de liquide qu’il n’y paraît',
  vomitoTexto: 'Avec l’eau part le sel, et le corps le sent avant que la soif n’arrive. Et quand la nourriture ne reste pas, vous commencez le lendemain déjà fatiguée.',
  vomitoAcao: 'Buvez par petites gorgées, souvent, plutôt qu’un verre d’un coup. Si même l’eau ne reste pas, parlez-en à votre équipe aujourd’hui.',

  tonturaSobre: 'Vertiges',
  tonturaCurto: 'asseyez-vous, buvez de l’eau et mangez quelque chose de sucré',
  tonturaTitulo: 'Un vertige comme celui-là a souvent une explication',
  tonturaTexto: 'C’est presque toujours un manque de liquide ou un sucre bas. Si vous prenez aussi un médicament pour le diabète, le sucre bas devient encore plus probable.',
  tonturaAcao: 'Asseyez-vous, buvez de l’eau et mangez quelque chose. Si ça se répète les jours suivants, dites-le à votre équipe.',

  presoSobre: 'Transit bloqué',
  presoCurto: 'buvez de l’eau au fil de la journée, mangez des fibres et marchez',
  presoTitulo: 'Quatre jours sans aller mérite déjà de l’attention',
  presoTexto: 'Le médicament ralentit tout, et en mangeant moins il reste peu à pousser pour l’intestin. Vers quatre jours, c’est le moment où ça cesse en général de se régler tout seul.',
  presoAcao: 'De l’eau au fil de la journée, des fibres aux repas et une marche. Si ça dépasse cinq jours, ou si une douleur forte et des vomissements s’y ajoutent, allez consulter.',

  soltoSobre: 'Transit relâché',
  soltoCurto: 'buvez de l’eau avec une pincée de sel, sans attendre la soif',
  soltoTitulo: 'Un transit relâché emporte l’eau et le sel avec lui',
  soltoTexto: 'Sept passages ou plus dans une journée emportent plus que ce que la soif arrive à remplacer.',
  soltoAcao: 'Buvez au fil de la journée sans attendre la soif, avec un soluté de réhydratation ou une pincée de sel. Si demain c’est pareil, prévenez votre équipe.',

  /* ⚠️ QUAND UNE COMBINAISON APPARAÎT, LES ALERTES DE CHAMP DISPARAISSENT.
     Elles disent « parlez-en à votre équipe » à propos d'un symptôme ; la
     combinaison dit « allez-y maintenant » à propos de l'ensemble, et
     garder les deux à l'écran, c'est laisser le moins urgent discuter avec
     le plus urgent. */
  travaSobre: 'Transit, douleur et vomissements',
  travaCurto: 'allez aux urgences aujourd’hui',
  travaTitulo: 'Cette combinaison demande une prise en charge maintenant',
  travaTexto: 'Un transit arrêté depuis des jours, une douleur forte et des vomissements ensemble peuvent être le signe que quelque chose s’est bloqué. C’est rare, mais ça ne s’arrange pas tout seul.',
  /* ⚠️ « QUEL MÉDICAMENT VOUS PRENEZ », et avant c'était « que vous
     utilisez le stylo ». Qui est aux urgences a besoin de dire CE QU'ELLE
     prend, pas dans quel emballage ça vient. */
  travaAcao: 'Allez aux urgences aujourd’hui. Dites quel médicament vous prenez et depuis combien de jours vous n’allez pas à la selle.',

  dorVomitoSobre: 'Douleur avec vomissements',
  dorVomitoCurto: 'voyez votre équipe ou les urgences aujourd’hui',
  dorVomitoTitulo: 'Une douleur forte avec vomissements n’attend pas',
  dorVomitoTexto: 'Une douleur forte au ventre avec des vomissements, parfois qui irradie dans le dos, demande de l’attention le jour même. Si vous arrivez tôt, c’est simple à vérifier.',
  dorVomitoAcao: 'Voyez votre équipe ou allez aux urgences aujourd’hui. Dites quel médicament vous prenez, la dose et quand la douleur a commencé.',

  desidratacaoSobre: 'Vertiges et perte de liquide',
  desidratacaoCurto: 'buvez un soluté ou de l’eau salée, et levez-vous doucement',
  desidratacaoTitulo: 'Un vertige avec perte de liquide est un signe de déshydratation',
  desidratacaoTexto: 'Quand l’eau et le sel manquent, la tension tombe au moment de se lever — et le vertige est votre corps qui prévient.',
  desidratacaoAcao: 'Buvez par petites gorgées au fil de la journée, avec un soluté ou une pincée de sel, et levez-vous doucement. Si ça ne va pas mieux d’ici demain, prévenez votre équipe.',

  /* ⚠️ C'EST POUR ÇA QUE LE TEXTE PORTE LE NOMBRE DE JOURS. « Quatre des
     sept derniers » est un fait qu'on emporte en consultation ; « vous
     avez souvent la nausée » est une impression qu'elle avait déjà. */
  vomitoSemanaSobre: 'Vomissements dans la semaine',
  vomitoSemanaCurto: 'parlez-en à votre équipe cette semaine',
  vomitoSemanaTitulo: 'Des vomissements sur des jours répétés',
  vomitoSemanaTexto: (n: number) => `${n} des sept derniers jours avec des vomissements. Comme ça, ni la nourriture, ni le liquide, ni le médicament lui-même ne restent.`,
  vomitoSemanaAcao: 'Parlez-en à votre équipe cette semaine, sans attendre la consultation. Dites-leur le nombre de jours — c’est lui qui fait la différence.',

  soltoSemanaSobre: 'Transit dans la semaine',
  soltoSemanaCurto: 'buvez davantage et dites-le à votre équipe',
  soltoSemanaTitulo: 'Le transit est relâché depuis des jours',
  soltoSemanaTexto: (n: number) => `${n} des sept derniers jours comme ça pèse déjà sur l’hydratation, même quand chaque journée, prise seule, paraît tranquille.`,
  soltoSemanaAcao: 'Buvez plus que ce que la soif demande et dites-le à votre équipe. Ça peut être la dose, ça peut être l’alimentation.',

  enjooSemanaSobre: 'Nausées dans la semaine',
  enjooSemanaCurto: 'emportez le nombre de jours en consultation',
  enjooSemanaTitulo: 'Les nausées ne passent pas',
  enjooSemanaTexto: (n: number) => `${n} des sept derniers jours avec des nausées, ce n’est plus de l’adaptation, c’est un schéma. Ça change souvent avec la dose, ou avec la vitesse à laquelle elle monte.`,
  /* ⚠️ « TENIR LA DOSE UN PEU PLUS LONGTEMPS N'EST PAS ABANDONNER » est le
     service de la phrase : c'est la conduite que la personne résiste le
     plus à emporter en consultation, parce qu'elle la lit comme un
     échec. */
  enjooSemanaAcao: 'Emportez ce nombre à la prochaine consultation. Tenir la dose un peu plus longtemps, ce n’est pas abandonner.',

  /* ⚠️ LE TRANSIT BLOQUÉ APPARAÎT DANS LES DEUX LECTURES, et ce n'est pas
     une répétition : la règle du champ compte les jours d'affilée sans
     aller — un épisode —, et celle-ci compte les jours de la semaine avec
     le transit lent. */
  presoSemanaSobre: 'Transit lent dans la semaine',
  presoSemanaCurto: 'buvez de l’eau, mangez des fibres et marchez',
  presoSemanaTitulo: 'Le transit est lent toute la semaine',
  presoSemanaTexto: (n: number) => `${n} des sept derniers jours avec la constipation. Manger moins est un effet du médicament, et avec moins de nourriture il passe moins de fibres — il le sent avant la balance.`,
  presoSemanaAcao: 'De l’eau, des fibres et de la marche aident. À ce rythme, ça vaut le coup d’en parler à votre équipe.',

  /* ⚠️ LES JALONS SONT INDEXÉS PAR LE NOMBRE DE JOURS, et la clé reste le
     nombre parce que c'est la série qui demande : `marcoDe(7)`. Traduire
     la valeur ne touche aucun relevé.

     ⚠️ ET CE NE SONT PAS SEPT NIVEAUX D'UNE ÉCHELLE. Chacun nomme une
     durée que la personne reconnaît, et c'est pour ça que celui de 30 dit
     « relevés » et non « d'affilée » : un mois entier sans rater un jour
     est rare, et la phrase ne peut pas promettre ce que la règle
     n'exige pas. */
  marcos: {
    3: 'Trois jours d’affilée',
    7: 'Une semaine entière',
    14: 'Deux semaines d’affilée',
    21: 'Trois semaines d’affilée',
    30: 'Un mois de relevés',
    60: 'Deux mois d’affilée',
    90: 'Trois mois d’affilée',
  },

  /* ⚠️ LES TROIS AVEC UN NOMBRE PORTENT LE NOMBRE QUI LES SOUTIENT, et
     c'est ce qui les sépare d'un compliment. « Vous avez bien dormi » est
     un avis ; « 7 h+ de sommeil sur 5 jours » est le compte de ses propres
     relevés. */
  dormindoBem: (n: number) => `7 h+ de sommeil sur ${n} jours`,
  energiaBoa: (n: number) => `Bonne énergie sur ${n} jours`,
  semEnjooDias: (n: number) => `${n} jours sans nausée`,

  saciedadeMelhorando: 'La satiété s’améliore',

};
