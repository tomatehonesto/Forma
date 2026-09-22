/* ============================================================
   LES RAPPELS — les cinq types et comment chacun se décrit · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/alertas.ts. Chaque type a trois
   pièces, et celle du milieu existe à cause de la largeur : `titulo` est
   le nom sur l'écran de réglages, `curto` le même nom sur une ligne
   serrée à côté d'une heure, et `desc` ce qu'il fait, en une phrase.

   ⚠️ « INJECTION DE LA DOSE », et avant c'était « du stylo ». La table ne
   sait pas quelle forme utilise la personne qui lit, et la sortie a été
   la phrase qui sert aussi bien au stylo, au flacon et à la seringue. Le
   comprimé lit encore « injection » ici, et c'est une dette connue.

   ⚠️ ET LE CHECK-IN EST LE SEUL QUI POSE UNE QUESTION. Les quatre autres
   préviennent pour des choses que la personne FAIT. C'est pour ça qu'il
   est le plus oublié : rien dans la journée ne rappelle d'y répondre.
   ============================================================ */

export const alertas = {
  dose: 'Injection de la dose',
  doseCurto: 'Injection',
  doseDesc: 'Un rappel avant la prochaine dose, pour garder le traitement à jour.',

  checkin: 'Check-in du jour',
  checkinCurto: 'Check-in',
  checkinDesc: 'Un geste pour dire comment la journée s’est passée — sommeil, faim, énergie et humeur.',

  peso: 'Pesée',
  pesoCurto: 'Pesée',
  pesoDesc: 'Un rappel les jours où vous voulez monter sur la balance.',

  agua: 'Hydratation',
  aguaCurto: 'Hydratation',
  aguaDesc: 'De petits coups de pouce pour boire — ils aident pour la satiété et les nausées.',

  proteina: 'Protéines',
  proteinaCurto: 'Protéines',
  proteinaDesc: 'Un rappel pour donner la priorité aux protéines dans les repas du jour.',

  noDia: 'Le jour même',
  diasAntes: (n: number) => `${n} jour${n > 1 ? 's' : ''} avant`,

  /* ⚠️ LES TROIS RACCOURCIS DE SEMAINE SONT DES NOMS D'ENSEMBLE, pas des
     énumérations. « Lundi, mardi, mercredi, jeudi, vendredi » est correct
     et personne ne le lit ; « En semaine » dit la même chose en deux
     mots. */
  todoDia: 'Tous les jours',
  diasUteis: 'En semaine',
  fimDeSemana: 'Le week-end',
  listaDeDias: (primeiro: string, resto: string[]) =>
    primeiro + (resto.length ? `, ${resto.join(', ')}` : ''),

  /* ⚠️ L'INTERVALLE SE DIT COMME UNE RÈGLE, pas comme une liste. « Toutes
     les 2 h, de 8 h à 20 h » est une phrase ; les sept heures qu'elle
     engendre ne tiendraient pas sur la ligne, et encore moins dans la tête
     de qui veut juste vérifier ce qu'il a réglé. */
  aCada: (cada: number, de: number, ate: number) => `toutes les ${cada} h, de ${de} h à ${ate} h`,
  quandoEHoras: (quando: string, horas: string) => `${quando} · ${horas}`,

  tela: {
    alertaDe: (tipo: string) => `Rappel de ${tipo}`,
    novoAlerta: 'Nouveau rappel',
    salvar: 'Enregistrer',
    criar: 'Créer le rappel',
    apagar: 'Effacer ce rappel',

    oQueAvisar: 'Quoi rappeler',

    antecedencia: 'Combien de temps avant',
    antecedenciaAjuda: 'Comptée à partir de la date de votre prochaine injection.',

    diasDaSemana: 'Jours de la semaine',
    diasDaSemanaAjuda: 'Si aucun n’est coché, le rappel sonne tous les jours.',

    quandoTocar: 'Quand il sonne',
    modoHorarios: 'Horaires',
    modoIntervalo: 'Intervalle',

    horarios: 'Horaires',
    horariosAjuda: 'Vous pouvez en cocher plusieurs — le rappel sonne à chacun d’eux.',

    aCada: 'Toutes les',
    aCadaHoras: (horas: number) => `${horas} h`,
    comeca: 'Commence',
    ate: 'Jusqu’à',
    ateAjuda: (avisos: number, cada: number) =>
      `${avisos} rappels par jour, toutes les ${cada} heures.`,

    tocaEm: (quando: string) => `Sonne ${quando}`,
    semHorario: 'Aucun horaire coché',
  },
};
