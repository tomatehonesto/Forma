/* ============================================================
   LE TRAITEMENT — la dose, la cadence, les jalons et les règles · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/tratamento.ts. Celle qui vaut pour
   le fichier entier : AUCUN de ces mots ne met une note à la personne.
   Les étiquettes de rythme et de stock qualifient le NOMBRE, pas qui l'a
   produit.
   ============================================================ */

export const tratamento = {
  /* ⚠️ LA CLÉ EST LE NOM PORTUGAIS et ne se traduit pas. Voir
     ../pt-BR/tratamento.

     ⚠️ ET LE FRANÇAIS ACCENTUE LÀ OÙ LES AUTRES N'ACCENTUENT PAS :
     « tirzépatide », « sémaglutide ». La dénomination commune
     internationale suit l'orthographe de chaque langue, et le français
     met l'accent que le portugais n'a pas. */
  molecula: {
    'Tirzepatida': 'Tirzépatide',
    'Semaglutida': 'Sémaglutide',
    'Dulaglutida': 'Dulaglutide',
    'Liraglutida': 'Liraglutide',
    '—': '—',
  } as Record<string, string>,

  /* ⚠️ L'ABSENCE A SA PROPRE PHRASE, et elle est courte à dessein : elle
     entre au milieu d'autres, comme « Mounjaro pas encore définie ». */
  doseIndefinida: 'pas encore définie',

  /* ⚠️ DEUX LONGUEURS, ET C'EST VOULU. La ligne qui ouvre un écran parle
     en toutes lettres ; la cellule d'un tableau de résumé médical n'a pas
     cette largeur. Les deux doivent rester courtes pour leur place. */
  cadenciaSemanal: 'une fois par semaine',
  cadenciaDiaria: 'usage quotidien',
  cadenciaOutra: (dias: number) => `tous les ${dias} jours`,
  cadenciaSemanalCurta: '1× par semaine',
  cadenciaDiariaCurta: 'quotidienne',
  cadenciaOutraCurta: (dias: number) => `tous les ${dias} j`,

  antesDaPrimeiraDose: 'Avant la première dose',
  comecaAmanha: 'Commence demain',
  comecaEm: (dias: number) => `Commence dans ${dias} jours`,
  /* ⚠️ « JOUR 71 », ET NON « JOUR 71 DU TRAITEMENT ». La ligne où ça
     apparaît finit déjà par « Semaine 10 », et les deux ensemble ne
     peuvent compter que la même chose. */
  diaDoTratamento: (dia: number) => `Jour ${dia}`,

  /* ⚠️ UN RYTHME NÉGATIF N'EST PAS « UN RYTHME PLUS LENT ». Qui avait
     repris du poids tombait sur la dernière étiquette, et la carte disait
     « Rythme plus lent » en vert à côté d'un nombre qui montait. Lent et à
     l'envers sont deux choses différentes, et une seule des deux est un
     rythme.

     ⚠️ ET ACCÉLÉRÉ N'EST PAS MAUVAIS. Perdre plus de 1,5 kg par semaine est
     une raison d'en parler à son équipe — masse maigre, hydratation —, pas
     une faute commise. Le mot ne peut pas sonner comme un reproche. */
  ritmoAcimaDoInicio: 'Au-dessus du départ',
  ritmoSaudavel: 'Rythme sain',
  ritmoAcelerado: 'Rythme accéléré',
  ritmoLento: 'Rythme plus lent',

  /* Trois degrés, et celui du milieu est le plus fréquent : « vaut le coup
     de renouveler » est un avis des semaines à l'avance, pas une alarme. */
  estoqueUrgente: 'Renouvelez maintenant',
  estoqueRenovar: 'Vaut le coup de renouveler l’ordonnance',
  estoqueEmDia: 'Stock à jour',

  /* ⚠️ LE CÔTÉ EST ABRÉGÉ ET ENTRE PARENTHÈSES parce que ces étiquettes
     apparaissent dans des lignes courtes — historique, suggestion du jour,
     résumé de la semaine. « Abdomen côté gauche » ne tient dans aucune. */
  locais: {
    'abd-e': 'Abdomen (g.)',
    'abd-d': 'Abdomen (d.)',
    'coxa-e': 'Cuisse (g.)',
    'coxa-d': 'Cuisse (d.)',
    'braco-e': 'Bras (g.)',
    'braco-d': 'Bras (d.)',
  },

  marcos: {
    inicio: 'Début du traitement',
    doseAjustada: (dose: string) => `Dose ajustée à ${dose} mg`,
    /* ⚠️ « SELON L'AVIS MÉDICAL » est ce qui empêche la ligne de laisser
       croire que l'application a ajusté quoi que ce soit. Elle note ; qui
       ajuste, c'est qui prescrit. */
    titulacao: 'Titration selon l’avis médical',
    cincoPorCento: '5% du poids de départ',
    /* ⚠️ « AU-DELÀ DE LA BALANCE » est le cœur : les 5% sont le repère à
       partir duquel la littérature montre un gain sur la tension, la
       glycémie et les triglycérides. Sans cette moitié, la ligne n'est
       qu'un chiffre de poids de plus. */
    cincoPorCentoSub: 'Repère clinique, avec des bénéfices au-delà de la balance',
    consulta: (tipo: string) => `Consultation ${tipo}`,
    marcadoresImportados: (quantos: number) => `${quantos} marqueurs importés`,
  },

  /* ⚠️ CE SONT LES NOMS DE LA CLASSIFICATION, et non des adjectifs choisis
     par nous. « Obésité de classe I » est le terme du compte rendu ; le
     remplacer par quelque chose de plus doux désalignerait l'application
     de ce que la personne lit sur son analyse et en consultation. Là où le
     soin intervient, c'est dans le TON de la couleur, qui est une décision
     d'écran. */
  imc: {
    abaixo: 'Insuffisance pondérale',
    normal: 'Poids normal',
    sobrepeso: 'Surpoids',
    grau1: 'Obésité de classe I',
    grau2: 'Obésité de classe II',
    grau3: 'Obésité de classe III',
  },

  /* ⚠️ AUCUN DES CINQ NE PORTE SUR L'APPARENCE SEULE, et « Comment je me
     vois » est le plus proche de ça à dessein : la phrase est de la
     personne sur elle-même, pas de l'application sur son corps. « Maigrir
     pour être belle » serait un autre produit. */
  motivos: {
    saude: 'Santé',
    saudeSub: 'Analyses, tension, glycémie',
    energia: 'Énergie',
    energiaSub: 'De l’allant dans la journée',
    espelho: 'Comment je me vois',
    espelhoSub: 'Dans le miroir et sur les photos',
    confianca: 'Confiance',
    confiancaSub: 'Me sentir bien avec moi',
    medico: 'Avis médical',
    medicoSub: 'C’est qui me suit qui me l’a conseillé',
  },

  /* ⚠️ LE SOUS-TITRE EST CE QUI DONNE UN SENS À L'ÉCHELON. Sans « 1 à 3
     jours par semaine », « légèrement actif » est une auto-évaluation, et
     chacun se place à un échelon différent — sur un nombre qui va devenir
     son objectif de protéines. */
  atividades: {
    sedentario: 'Sédentaire',
    sedentarioSub: 'Peu ou pas d’exercice',
    leve: 'Légèrement actif',
    leveSub: '1 à 3 jours par semaine',
    moderado: 'Modérément actif',
    moderadoSub: '3 à 5 jours par semaine',
    muito: 'Très actif',
    muitoSub: '6 à 7 jours par semaine',
  },

  /* ⚠️⚠️ LA DURÉE EST UNE RÈGLE DE LANGUE, et elle était écrite en dur
     dans le fichier de l'écran. « 6 h 20 » au lieu de « 380 min » : au-
     dessus d'une heure, la minute pure oblige à diviser de tête pour
     savoir si c'est beaucoup. Voir ../pt-BR/tratamento. */
  tela: {
    titulo: 'Exercice',
    unidadeMin: 'min',
    duracao: (min: number) => {
      if (min < 60) return `${min} min`;
      const h = Math.floor(min / 60);
      const m = min % 60;
      return m ? `${h} h ${m}` : `${h} h`;
    },

    hojeSemTreino: (daSemana: number) => `Aujourd’hui : pas encore de séance · ${daSemana} min cette semaine`,
    hojeComTreino: (hoje: number, alvo: number, resto: string) => `Aujourd’hui : ${hoje} sur ${alvo} min · ${resto}`,
    metaAlcancada: 'objectif atteint',
    faltamMin: (falta: number) => `encore ${falta} min`,
    registrarTreino: 'Noter une séance',

    movimentoTitulo: 'Votre mouvement',
    estaSemana: 'Cette semaine',
    nenhumDiaComMovimento: 'Aucun jour avec du mouvement',
    emDiasDosSete: (dias: number) => `Sur ${dias} ${dias === 1 ? 'jour' : 'jours'} des sept`,
    metaMin: (alvo: number) => `Objectif : ${alvo} min`,

    semForca: 'Aucune séance de renforcement cette semaine. Musculation, pilates et functional sont ce qui tient le muscle.',
    comForca: (dias: number) => `${dias} ${dias === 1 ? 'jour' : 'jours'} avec du renforcement — c’est ce qui tient le muscle pendant que le poids descend.`,

    minutosPorSemana: 'Minutes par semaine',
    mediaOitoSemanas: 'Moyenne des 8 dernières semaines',
    semanaDe: (data: string) => `semaine du ${data}`,

    periodo7: '7 jours',
    periodo30: '30 jours',
    periodo90: '3 mois',
    noPeriodo: 'Sur la période',
    noPeriodoNota: 'Seulement ce qui a été noté ici — ce qui vient de la montre n’a pas de discipline.',
    treinos: 'Séances',
    tempo: 'Temps',
    maisLongo: 'La plus longue',
    deForca: 'Renforcement',

    diarioTitulo: 'Journal des séances',
    diarioNota: 'Touchez une séance pour la voir, la corriger ou la supprimer.',
    diaVazioTitulo: 'Aucune séance ce jour-là',
    diaVazioTexto: 'Le repos en fait partie aussi.',

    integracoes: 'Connexions',
    conectar: 'Connecter une montre ou une application',
    lancamSozinhos: 'Elles entrent les minutes toutes seules',
    conectarSub: 'Apple Santé, Health Connect, Garmin et d’autres',
  },
};
