/* ============================================================
   LES DÉCOUVERTES — la carte d'accueil qui n'est pas le cycle · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/descobertas.ts. Les deux qui
   commandent :

   L'ANTICIPATION DIT TOUJOURS QUE ÇA PASSE. « La faim a tendance à serrer
   aujourd'hui » est un avertissement, et un avertissement sans échéance
   devient une menace : les trois finissent en disant ce qui arrive après
   — « ça passe tout seul quand vous ferez la piqûre », « ce sont les
   48 h de chaque cycle, pas le traitement entier ».

   ET L'INVITATION NE RÉCLAME RIEN. « Vous n'avez pas encore dit où vous
   voulez arriver » est l'absence dite comme une possibilité, pas comme un
   manque ; « vous n'avez créé aucun objectif » serait la même phrase avec
   la règle tournée vers la personne.
   ============================================================ */

export const descobertas = {
  verDescoberta: 'Voir la découverte',

  chapeuCruzamento: 'UNE DÉCOUVERTE',

  chapeuAntecipacao: 'CE QUI ARRIVE',

  fomeHoje: 'La faim a tendance à serrer aujourd’hui',
  fomeAmanha: 'La faim a tendance à serrer demain',
  fomeEmDias: (dias: number) => `La faim a tendance à serrer dans ${dias} jours`,
  /* La molécule en minuscule parce que c'est une substance, pas une
     marque. */
  fomeTexto: (molecula: string) =>
    `C’est le moment où le niveau de ${molecula} atteint son point le plus bas du cycle, juste avant la prochaine piqûre. Ça passe tout seul une fois la piqûre faite.`,
  fomeCta: 'Voir le cycle',

  aguaTitulo: 'Demain est souvent votre journée la plus sèche',
  aguaTexto: (dele: string, dia: string, outros: string) =>
    `Dans vos relevés, l’hydratation descend à ${dele} ${dia}, contre ${outros} les autres jours. Le savoir la veille, c’est déjà la moitié du chemin.`,
  aguaCta: 'Voir l’hydratation',

  enjooTitulo: 'Si les nausées arrivent maintenant, elles ont une heure pour passer',
  enjooTexto: (perto: string, longe: string) =>
    `Dans vos relevés, elles restent à ${perto} les deux premiers jours après la piqûre et descendent à ${longe} à partir du troisième. Ce sont les 48 h de chaque cycle, pas le traitement entier.`,
  enjooCta: 'Voir les symptômes',

  chapeuConvite: 'UNE INVITATION',

  metaTitulo: 'Vous n’avez pas encore dit où vous voulez arriver',
  metaTexto: 'Un objectif à vous — entrer dans un pantalon, retourner à la plage, lâcher une habitude. Nous le gardons pour vous, et c’est vous qui cochez quand vous y êtes.',
  metaCta: 'Créer un objectif',

  medidasTitulo: 'La balance ne raconte qu’une partie',
  medidasTexto: 'Le mètre ruban raconte le reste : le tour de taille et les hanches continuent de bouger quand le poids stagne, et c’est là qu’il montre qu’il se passe encore quelque chose.',
  medidasCta: 'Noter des mesures',

  refeicaoTitulo: 'Les protéines du jour peuvent se compter toutes seules',
  refeicaoTexto: 'Notez ce que vous mangez et le compte du jour se fait tout seul — sans table, sans rien additionner de tête.',
  refeicaoCta: 'Noter un repas',

  examesTitulo: 'Vos analyses tiennent ici',
  examesTexto: 'Une fois qu’elles sont rangées, vous pouvez voir la ligne de chaque marqueur au fil du traitement — et tout apporter en ordre à la consultation.',
  examesCta: 'Ranger une analyse',

  clinicaTitulo: 'Votre clinique peut être de ce côté-ci',
  clinicaTexto: 'Avec le code qu’elle vous a donné, votre équipe apparaît ici et ses consignes cessent de se perdre au milieu des messages.',
  clinicaCta: 'Utiliser le code',
  /* the weekly reading — see ../pt-BR/descobertas.ts */
  semana: {
    chapeu: 'VOTRE SEMAINE',
    titulo: 'Votre semaine',
    pedirTitulo: 'Voulez-vous que je lise votre semaine ?',
    pedirTexto: 'Chaque lundi, je regarde ce que vous avez noté la semaine passée et je vous dis comment elle s’est passée, une découverte sur vous et un essai pour la semaine suivante.',
    pedirSim: 'Oui, volontiers',
    pedirNao: 'Pas maintenant',
    poucoTitulo: 'Lundi, je lirai votre semaine',
    poucoTexto: 'Faites le check-in au moins 3 jours, ou pesez-vous une fois, et j’aurai de quoi lire.',
    lendo: 'Je lis votre semaine…',
    parteSemana: 'La semaine',
    parteDescoberta: 'Une découverte',
    parteTeste: 'À essayer',
    lerInteira: 'Tout lire',
    conversar: 'En parler',
    telaTitulo: 'La lecture de la semaine',
    desligar: 'Désactiver la lecture de la semaine',
    desligada: 'Désactivée. Je vous redemanderai dans 4 semaines.',
    aceiteTitulo: 'La lecture de la semaine',
    aceitePergunta: 'Voulez-vous que je lise votre semaine chaque lundi ?',
    termosTitulo: 'Ce que cela veut dire',
    termosResumo: 'Ce qui sort du téléphone, ce qui est gardé et ce que c’est',
    aceite1Titulo: 'Ce qui sort du téléphone',
    aceite1: 'Chaque lundi, un résumé de votre semaine — poids, injection, check-ins, symptômes, eau, protéines et entraînements — et une découverte calculée sur votre téléphone vont à notre serveur, qui demande la lecture à l’IA d’Anthropic, aux États-Unis. Sans votre nom complet, votre e-mail ni vos notes.',
    aceite2Titulo: 'Ce qui est gardé',
    aceite2: 'La lecture revient sur votre téléphone et n’y reste que là, comme la conversation. Le serveur ne garde rien, et Anthropic n’utilise pas les données pour entraîner des modèles.',
    aceite3Titulo: 'Ce que c’est',
    aceite3: 'Une lecture de vos données : elle montre des coïncidences, pas des causes, et ne remplace pas votre équipe. Rien dedans ne change une dose.',
    politica: 'Lire la Politique de confidentialité',
    aceitar: 'Activer la lecture de la semaine',
    recusar: 'Pas maintenant',
    aceiteRodape: 'Vous pouvez la désactiver quand vous voulez, depuis la lecture elle-même.',
  },
};
