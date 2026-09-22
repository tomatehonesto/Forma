/* ============================================================
   LES NOTIFICATIONS — les deux lignes de l'écran verrouillé · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/avisos.ts. Celle qui commande : qui
   lit ceci est dans la rue, au milieu d'autre chose. Aucune ne réclame,
   aucune ne dit « vous n'avez pas », et aucune n'affirme ce que
   l'application ignore à cette heure-là — si la personne a déjà bu, déjà
   mangé, déjà pesé. La notification propose ; c'est elle qui sait sa
   journée.

   ⚠️ ET CELLE DU CHECK-IN POSE UNE QUESTION, au lieu d'ordonner. C'est la
   seule des cinq : « Faites votre check-in » traite comme une tâche ce
   qui est une conversation.
   ============================================================ */

export const avisos = {
  /* La `dose` arrive toute faite — « Mounjaro 5 mg » —, et le récipient
     avec son article vient de logic/formas : « laisser le stylo en vue »,
     « laisser la seringue en vue ». */
  doseHoje: 'Votre injection est aujourd’hui',
  doseHojeCorpo: (dose: string) => `${dose}. Quand vous pourrez, notez-la ici.`,
  doseAmanha: 'Votre injection est demain',
  doseAmanhaCorpo: (dose: string, oRecipiente: string) => `${dose}. Autant laisser ${oRecipiente} en vue.`,
  doseEmDias: (dias: number) => `Votre injection est dans ${dias} jours`,
  doseEmDiasCorpo: (dose: string, doRecipiente: string) => `${dose}. Vous avez le temps de vérifier ce qu’il reste ${doRecipiente}.`,

  checkin: 'Comment s’est passée votre journée ?',
  checkinCorpo: 'Sommeil, faim, énergie et humeur — quatre réponses, et la journée est enregistrée.',
  peso: 'Jour de pesée',
  pesoCorpo: 'Montez sur la balance quand vous pourrez. Un chiffre par semaine dessine déjà la courbe.',
  agua: 'Un verre d’eau',
  aguaCorpo: 'Ça aide pour la satiété et pour les nausées — et ça compte pour l’objectif du jour.',
  proteina: 'Les protéines d’abord',
  proteinaCorpo: 'Au prochain repas, commencez par elles. C’est ce qui retient la masse maigre.',
};
