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
    `C’est le moment où le niveau de ${molecula} atteint son point le plus bas du cycle, juste avant la prochaine dose. Ça passe tout seul une fois la dose prise.`,
  fomeCta: 'Voir le cycle',

  aguaTitulo: 'Demain est souvent votre journée la plus sèche',
  aguaTexto: (dele: string, dia: string, outros: string) =>
    `Dans vos relevés, l’hydratation descend à ${dele} ${dia}, contre ${outros} les autres jours. Le savoir la veille, c’est déjà la moitié du chemin.`,
  aguaCta: 'Voir l’hydratation',

  enjooTitulo: 'Si les nausées arrivent maintenant, elles ont une heure pour passer',
  enjooTexto: (perto: string, longe: string) =>
    `Dans vos relevés, elles restent à ${perto} les deux premiers jours après la dose et descendent à ${longe} à partir du troisième. Ce sont les 48 h de chaque cycle, pas le traitement entier.`,
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
    /* os slides do carrossel da Home (app/(tabs)/index): curtos de propósito */
    slideProntoTitulo: 'Votre résumé de la semaine est prêt',
    slideProntoTexto: 'Comment elle s’est passée, une découverte et un test pour la suivante.',
    slideProntoCta: 'Voir le résumé',
    slideConviteTitulo: 'Envie d’un résumé de votre semaine ?',
    slideConviteTexto: 'Chaque lundi, je lis vos données et je vous dis ce que j’ai découvert.',
    titulo: 'Votre semaine',
    pedirSim: 'Oui, volontiers',
    poucoTitulo: 'Lundi, je lirai votre semaine',
    poucoTexto: 'Faites le check-in au moins 3 jours, ou pesez-vous une fois, et j’aurai de quoi lire.',
    /* a semana teve o mínimo, mas nenhuma descoberta se sustentou (app/leitura) */
    semDescobertaTitulo: 'Pas de découverte cette fois',
    semDescobertaTexto: 'Vos données de la semaine n’ont pas montré de tendance que je puisse affirmer. Je relis lundi prochain.',
    lendo: 'Je lis votre semaine…',
    parteSemana: 'La semaine',
    parteDescoberta: 'Une découverte',
    parteTeste: 'À essayer',
    parteTesteAgora: 'À essayer cette semaine',
    lerInteira: 'Tout lire',
    conversar: 'En parler',
    telaTitulo: 'Résumé de la semaine',
    desligar: 'Désactiver le résumé de la semaine',
    desligada: 'Désactivé. Je vous redemanderai dans 4 semaines.',
    /* a tela do resumo (app/leitura), refeita em 01/10/2026 */
    legendaCheckin: 'check-in',
    legendaTreino: 'séance',
    legendaPesagem: 'pesée',
    nivelForte: 'Tendance nette',
    nivelComeco: 'Tendance naissante',
    nivelRetrato: 'De votre parcours',
    anteriores: 'Semaines précédentes',
    /* no ciclo da Jornada, a leitura de outra janela, com as datas dela (app/leitura) */
    leituraDe: (periodo: string): string => `Lecture · ${periodo}`,
    /* as outras leituras que caem no mesmo ciclo da Jornada (app/leitura) */
    outrasLeituras: 'Autres lectures de cette semaine',
    erro: 'Je n’ai pas pu lire votre semaine pour l’instant. Vérifiez la connexion et réessayez.',
    erroLimite: 'Vous avez atteint la limite de lectures par IA pour aujourd’hui. Je lirai votre semaine demain.',
    erroConta: 'Connectez-vous à votre compte pour que je lise votre semaine.',
    tentarDeNovo: 'Réessayer',
    fazerCheckin: 'Faire le check-in',
    desligadoTitulo: 'Le résumé de la semaine est désactivé',
    desligadoTexto: 'Activé, chaque lundi je lis vos données et je vous dis ce que j’ai découvert.',
    ligar: 'Activer le résumé de la semaine',
  },
};
