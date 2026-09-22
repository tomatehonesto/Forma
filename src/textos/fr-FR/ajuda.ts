/* ============================================================
   L'AIDE — les huit questions, et pourquoi ce sont ces huit · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/ajuda. Celle qui commande : CHAQUE
   RÉPONSE EST UNE RÈGLE DU CODE, et non une promesse de communication.
   « Les succès sortent des relevés » est écrit dans conquistas.ts ; « les
   notifications dépendent de l'autorisation du téléphone » est dans
   avisos.ts.

   Qui traduit doit le savoir avant d'adoucir une phrase : la réponse sur
   la désinstallation dit qu'il n'y a de copie nulle part parce qu'il n'y
   en a pas, et non parce que ça sonne honnête de le dire.

   ⚠️ ET IL N'Y A PAS DE LIGNE DE CONTACT, pour l'instant. Un « écrivez-
   nous » qui ne mène nulle part est la pire ligne qu'un écran d'aide
   puisse avoir : elle apparaît précisément pour qui n'a déjà pas réussi
   seule.
   ============================================================ */

export const ajuda = {
  titulo: 'Aide',
  lead: 'Les questions que cette application soulève d’habitude, répondues par ce qu’elle fait vraiment.',
  perguntasFrequentes: 'Questions fréquentes',

  qa: [
    {
      q: 'D’où viennent les chiffres qui apparaissent ici ?',
      a: 'Ce sont tous des calculs sur ce que vous avez noté — poids, piqûres, check-ins, repas, analyses. L’application ne complète pas ce qui manque et n’estime pas ce que vous n’avez pas dit : un jour sans réponse apparaît comme un jour sans réponse, et non comme zéro.',
    },
    {
      q: 'Puis-je corriger ou supprimer un relevé ?',
      a: 'Oui, et à l’endroit où il apparaît. Les pesées et les mesures se suppriment dans le détail du marqueur ; les repas et les séances, en ouvrant le relevé dans le journal du jour. Ce que vous supprimez quitte les calculs tout de suite — y compris les courbes et le résumé pour la consultation.',
    },
    {
      q: 'Pourquoi un succès a-t-il disparu ?',
      a: 'Parce qu’il n’a jamais été enregistré. Les succès se comptent à partir de vos relevés à chaque ouverture de l’écran, et ne sont marqués comme faits nulle part. Si le relevé qui a fermé un palier est supprimé, le palier part avec lui — il a cessé d’avoir eu lieu.',
    },
    {
      q: 'J’ai mis un rappel et il n’a pas sonné.',
      /* ⚠️ « Morphi » est le nom de l'application et ne se traduit pas :
         c'est ce que la personne voit dans la liste d'autorisations du
         système. */
      a: 'C’est le téléphone qui sonne, et il ne sonne qu’avec l’autorisation. Si les notifications sont refusées pour Morphi dans les réglages du système, vos alertes restent enregistrées ici et rien ne sonne. L’écran Rappels montre quand c’est le cas et mène à l’autorisation.',
    },
    {
      q: 'Mon poids peut-il venir de la balance tout seul ?',
      a: 'Si votre balance, montre ou bague écrit dans Apple Santé (iPhone) ou dans Health Connect (Android), oui — nous lisons là. Nous ne lisons que le poids, et nous ne faisons que lire : nous n’écrivons jamais rien dans ces applications. Garmin, Fitbit, Withings, Oura et Whoop arrivent par ce chemin.',
    },
    {
      q: 'Que peut voir mon équipe ?',
      a: 'Seulement ce que vous envoyez. Rien ne sort d’ici tout seul : le résumé part quand vous touchez envoyer, les messages quand vous les écrivez. Ce qui reste dehors reste à vous, y compris vis-à-vis de qui vous suit.',
    },
    {
      q: 'Remplacez-vous ce que dit l’équipe qui me suit ?',
      a: 'Non, et sur aucun écran. Ce qu’elle fait, c’est ranger ce qui s’est passé et montrer des motifs dans vos propres relevés — la dose, le symptôme et la conduite sont une conversation de consultation. Quand un texte de l’application touche à ces sujets, il le dit avec.',
    },
    {
      q: 'Et si je désinstalle l’application ?',
      a: 'Vos relevés vivent sur l’appareil, dans l’application — sans compte et sans serveur. Désinstaller emporte tout, et il n’y a de copie nulle part d’où récupérer. Avant ça, vous pouvez construire un fichier avec ce que vous avez noté, dans Exporter.',
    },
  ] as { q: string; a: string }[],

  ondeResolver: 'Où le régler',
  lembretes: 'Rappels',
  lembretesSub: 'Créer, modifier et vérifier l’autorisation de notifications',
  integracoes: 'Appareils et connexions',
  integracoesSub: 'Brancher Apple Santé ou Health Connect',
  privacidade: 'Confidentialité et données',
  privacidadeSub: 'Ce qui reste sur l’appareil et ce qui en sort',
  exportar: 'Exporter vos données',
  exportarSub: 'Construire un fichier avec ce que vous avez noté',

  emergenciaTitulo: 'En cas de symptôme grave',
  emergenciaTexto: 'Cet écran parle de l’application. Si quelque chose dans votre corps demande de l’attention maintenant, joignez votre équipe ou les urgences — n’attendez pas la prochaine consultation.',
};
