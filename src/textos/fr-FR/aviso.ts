/* ============================================================
   LE CONSENTEMENT ET LE RESTE — la clause, les cartes de données · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/aviso.ts. Celle qui commande :

   LA CLAUSE NE RABAISSE PAS L'APPLICATION POUR SE PROTÉGER. « Ceci n'est
   pas une application médicale » est vrai et c'est lâche : qui lit vient
   de répondre à treize questions sur son propre traitement, et mérite de
   savoir ce qu'elle gagne, pas seulement ce qu'elle ne gagne pas. La
   phrase dit les deux, dans cet ordre — ce que nous faisons, et où nous
   nous arrêtons.
   ============================================================ */

export const aviso = {
  isencaoTitulo: 'Nous suivons votre traitement — nous ne le conduisons pas',
  isencaoTexto: 'Nous gardons ce que vous notez, nous vous montrons comment les choses avancent et nous préparons ce que vous apporterez à la consultation. Nous ne sommes pas un diagnostic et nous ne prescrivons pas : la dose, l’intervalle et le médicament sont la décision de qui vous suit.',
  isencaoReforco: 'Avant de changer quoi que ce soit à votre dose ou à votre horaire, parlez-en à votre équipe. Et si un symptôme vous inquiète, n’attendez pas la prochaine consultation.',
  isencaoAceite: 'J’ai compris et j’accepte',

  guardadoTitulo: 'Ce que vous notez reste sur votre appareil',
  guardadoTexto: 'Poids, symptômes, injections, analyses et notes sont enregistrés dans l’application, sur ce téléphone. Il n’y a ni compte ni mot de passe : personne n’entre dans vos données avec un identifiant.',

  usoTitulo: 'À quoi servent vos données',
  usoTexto: 'À construire vos objectifs quotidiens, à suivre l’évolution du traitement et à organiser ce que vous apportez à la consultation. Rien de tout cela n’est un diagnostic, et l’application ne prescrit ni n’ajuste de dose.',

  /* ⚠️ LA PARTIE QU'UN AVIS DE CONSENTEMENT TAIT D'HABITUDE, et la seule
     ici qui change ce que la personne décide. */
  saiTitulo: 'Ce qui peut sortir d’ici, et seulement d’un geste de vous',
  saiTexto: 'Le résumé et les messages que vous envoyez à votre équipe de santé. Et la photo de l’assiette, quand vous utilisez la lecture par photo : elle est envoyée pour être lue et n’est pas conservée.',

  controleTitulo: 'Vous gardez la main',
  controleTexto: 'Vous pouvez corriger et effacer n’importe quel relevé, tout exporter dans un fichier et effacer vos données entièrement, à tout moment, dans les réglages.',

  /* ⚠️ SEUL LE NOM D'APPLE CHANGE DE LANGUE, parce que c'est Apple qui
     traduit le nom de sa propre application. Health Connect, Garmin,
     Fitbit et Withings sont des marques et restent dans le code. */
  appleSaude: 'Apple Santé',
  trazPesagens: 'Vos pesées — y compris celles que votre balance y envoie.',
  trazTreinos: 'Séances et fréquence cardiaque',
  trazSono: 'Sommeil et pas',
  trazBalanca: 'Balance et tension',

  /* ⚠️ LES TROIS FINISSENT EN PROPOSANT LE CHEMIN MANUEL, et c'est ce qui
     les sépare d'un message d'erreur : la personne a photographié
     l'assiette parce qu'elle veut la noter, et dire seulement « ça n'a pas
     marché » la laisse à mi-chemin. */
  fotoSemServidor: 'La lecture par photo n’est pas encore activée. Vous pouvez composer l’assiette juste en dessous.',
  fotoSemRede: 'Pas de connexion pour lire la photo maintenant. Vous pouvez composer l’assiette juste en dessous.',
  fotoNaoReconheci: 'Je n’ai pas réussi à reconnaître l’assiette. Composez ci-dessous ce qu’il y avait.',

  porMes: 'par mois',
  porMesCurto: '/mois',

  exportacaoAviso: 'Relevés faits par la personne elle-même dans l’application. Ce n’est ni un dossier médical ni un compte rendu.',
  exportacaoTitulo: 'Vos données Morphi',

  medIndefinido: 'Pas encore défini',

  garrafao: 'Bonbonne',

  /* ⚠️ LES NOMS SONT CLÉ ET ÉTIQUETTE À LA FOIS — c'est le `tipo` qui
     reste enregistré dans chaque séance. Même famille que le moment du
     repas et le marqueur d'analyse. */
  modalidades: {
    caminhada: 'Marche',
    corrida: 'Course',
    musculacao: 'Musculation',
    bike: 'Vélo',
    natacao: 'Natation',
    yoga: 'Yoga',
    pilates: 'Pilates',
    funcional: 'Fonctionnel',
    alongamento: 'Étirements',
    outro: 'Autre',
  },
};
