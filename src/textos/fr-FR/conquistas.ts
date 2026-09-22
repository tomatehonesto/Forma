/* ============================================================
   LES PALIERS — les parcours, ce que dit chaque niveau et ce qui manque · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/conquistas.ts. Les deux qui
   commandent :

   LES `id` ET LES SEUILS NE SONT PAS ICI. 'kg', 'rodizio', 'prot-seq' sont
   des données, et les nombres de chaque niveau sont du contenu : des
   seuils par langue feraient gagner à la même personne des paliers
   différents selon la langue dans laquelle elle lit.

   CHAQUE PARCOURS PARLE À DEUX TEMPS, et ce ne sont pas la même phrase :
   `desc` est ce que ce niveau EST DÉJÀ — « 12 injections notées » —, et
   `falta` est ce qui la sépare du suivant. « Il manque » et non « il vous
   faut » : le sujet est la distance, pas la personne.

   ⚠️⚠️ ET L'ACCORD DU PARTICIPE EST LE PIÈGE DE CE FICHIER EN FRANÇAIS.
   « 12 injections notées » s'accorde avec « injections », féminin pluriel ;
   « 12 jours notés » avec « jours », masculin. Le portugais fait pareil et
   s'en sort avec un `'s'` conditionnel parce que le genre y est fixe par
   ligne ; le français doit écrire les quatre formes à la main, parce que
   le féminin ajoute un `e` ET un `s`.

   Chaque `desc` ci-dessous porte donc son accord en dur, accordé au nom
   qui le précède — jamais à qui lit.
   ============================================================ */

/* Le pluriel du français, avec l'irrégulier dit en toutes lettres quand
   il existe. */
const p = (n: number, s: string, pl = `${s}s`) => `${n} ${n === 1 ? s : pl}`;

export const conquistas = {
  familias: {
    tratamento: 'Traitement',
    peso: 'Poids',
    constancia: 'Régularité',
    hidratacao: 'Hydratation',
    proteina: 'Protéines',
    movimento: 'Mouvement',
    comida: 'Alimentation',
    acompanhamento: 'Suivi',
  },

  doses: 'Injections',
  dosesDesc: (a: number) => `${p(a, 'injection')} notée${a === 1 ? '' : 's'}`,
  dosesFalta: (r: number) => `Il manque ${p(r, 'injection')}`,

  tempo: 'Durée du traitement',
  /* En dessous d'un an on compte en mois, au-delà en années : « 12 mois »
     et « 1 an » sont la même durée, et seule la seconde se fête. */
  tempoDesc: (a: number) => (a < 365
    ? `${a / 30} mois depuis la première dose`
    : `${a / 365} an${a > 365 ? 's' : ''} depuis la première dose`),
  tempoFalta: (r: number) => `Il manque ${p(r, 'jour')}`,

  /* ⚠️ LA ROTATION N'EST PAS UN ORNEMENT : répéter le même point cause des
     nodules, et alterner est une consigne de notice. C'est le seul
     parcours qui récompense une pratique de sécurité. */
  rodizio: 'Rotation',
  rodizioDesc: (a: number) => `${p(a, 'site')} d’injection utilisé${a === 1 ? '' : 's'}`,
  rodizioFalta: (r: number) => `Il manque ${p(r, 'site')}`,

  titulacao: 'Titration',
  titulacaoDesc: (a: string) => `Atteindre la dose de ${a}`,
  titulacaoFalta: (a: string) => `Prochaine : ${a}`,

  /* ⚠️ LE POIDS ARRIVE DÉJÀ ÉCRIT, dans l'unité de qui lit. */
  kg: 'Kilos en moins',
  kgDesc: (peso: string) => `${peso} en dessous du poids de départ`,
  kgFalta: (peso: string) => `Il manque ${peso}`,

  /* ⚠️ LE POURCENTAGE EST UNE AUTRE CONVERSATION, pas une répétition des
     kilos : les cinq pour cent sont le repère clinique que la littérature
     utilise, et dix kilos ne veulent pas dire la même chose dans deux
     corps différents. */
  pct: 'Pourcentage perdu',
  pctDesc: (a: number) => `${a}% du poids de départ`,
  pctFalta: (r: string) => `Il manque ${r} points`,

  pesagens: 'Pesées',
  pesagensDesc: (a: number) => `${p(a, 'poids', 'poids')} noté${a === 1 ? '' : 's'}`,
  pesagensFalta: (r: number) => `Il manque ${p(r, 'pesée')}`,

  checkins: 'Check-ins',
  checkinsDesc: (a: number) => `${p(a, 'journée')} remplie${a === 1 ? '' : 's'}`,
  checkinsFalta: (r: number) => `Il manque ${p(r, 'jour')}`,

  sequencia: 'Jours d’affilée',
  sequenciaDesc: (a: number) => `${p(a, 'check-in')} d’affilée`,
  sequenciaFalta: (r: number, alvo: number) => `Il manque ${p(r, 'jour')} pour ${alvo}`,

  aguaDias: 'Jours à l’objectif d’eau',
  aguaDiasDesc: (a: number) => `${p(a, 'journée')} d’eau tenue${a === 1 ? '' : 's'}`,
  aguaDiasFalta: (r: number) => `Il manque ${p(r, 'jour')}`,

  aguaSemana: 'Semaine hydratée',
  aguaSemanaDesc: (a: number) => `${p(a, 'jour')} à l’objectif, dans la même semaine`,
  aguaSemanaFalta: (r: number, alvo: number) => `Il manque ${p(r, 'jour')} pour ${alvo}`,

  protDias: 'Jours à l’objectif de protéines',
  protDiasDesc: (a: number) => `${p(a, 'jour')} à l’objectif du profil`,
  protDiasFalta: (r: number) => `Il manque ${p(r, 'jour')}`,

  protSeq: 'Protéines d’affilée',
  protSeqDesc: (a: number) => `${p(a, 'jour')} d’affilée à l’objectif`,
  protSeqFalta: (r: number, alvo: number) => `Il manque ${p(r, 'jour')} pour ${alvo}`,

  treinos: 'Séances',
  treinosDesc: (a: number) => `${p(a, 'séance')} notée${a === 1 ? '' : 's'}`,
  treinosFalta: (r: number) => `Il manque ${p(r, 'séance')}`,

  exercSemana: 'Semaine active',
  exercSemanaDesc: (a: number) => `${p(a, 'jour')} à l’objectif de mouvement, dans la même semaine`,
  exercSemanaFalta: (r: number, alvo: number) => `Il manque ${p(r, 'jour')} pour ${alvo}`,

  refeicoes: 'Repas',
  refeicoesDesc: (a: number) => `${p(a, 'assiette')} notée${a === 1 ? '' : 's'}`,
  refeicoesFalta: (r: number) => `Il manque ${p(r, 'repas', 'repas')}`,

  favoritos: 'Plats favoris',
  favoritosDesc: (a: number) => `${p(a, 'plat')} gardé${a === 1 ? '' : 's'} pour y revenir`,
  favoritosFalta: (r: number) => `Il manque ${p(r, 'plat')}`,

  medidas: 'Mesures au mètre',
  medidasDesc: (a: number) => `${p(a, 'mesure')} notée${a === 1 ? '' : 's'}`,
  medidasFalta: (r: number) => `Il manque ${p(r, 'mesure')}`,

  cintura: 'Centimètres de tour de taille',
  cinturaDesc: (comp: string) => `${comp} de moins au tour de taille`,
  cinturaFalta: (comp: string) => `Il manque ${comp}`,

  exames: 'Analyses',
  /* ⚠️ « bilan » FAIT « bilans », mais « repas » NE CHANGE PAS au pluriel.
     C'est exactement pour ça que le pluriel est un champ. */
  examesDesc: (a: number) => `${p(a, 'bilan')} importé${a === 1 ? '' : 's'}`,
  examesFalta: (r: number) => `Il manque ${p(r, 'analyse')}`,

  consultas: 'Consultations',
  consultasDesc: (a: number) => `${p(a, 'consultation')} dans l’historique`,
  consultasFalta: (r: number) => `Il manque ${p(r, 'consultation')}`,

  marco: (titulo: string, nivel: number) => `${titulo} · niveau ${nivel}`,
};
