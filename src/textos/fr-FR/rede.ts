/* Le réseau partenaire — l’annuaire et la fiche du professionnel. Voir
   ../pt-BR/rede : pourquoi il existe dans toutes les langues alors que le
   réseau est brésilien, et ce qui ne se traduit PAS (ce que le
   professionnel a écrit dans le portail). */

export const rede = {
  titulo: 'Réseau partenaire',
  lead: 'Des professionnels qui suivent le traitement avec l’application. Le premier contact se fait directement avec le cabinet.',

  exemploTitulo: 'Professionnels fictifs',
  exemploTexto: 'Les noms, numéros d’inscription et contacts sont inventés, juste pour voir à quoi ressemble l’annuaire. La vraie liste vient du portail du réseau.',

  busca: 'Nom ou spécialité',

  localizacao: {
    usar: 'Utiliser ma position',
    usarSub: 'Pour voir la distance jusqu’à chaque cabinet. Elle reste sur l’appareil.',
    pedindo: 'Recherche de votre position…',
    ligada: 'Les plus proches d’abord',
    ligadaSub: 'Par ordre de distance. Touchez pour désactiver.',
    negada: 'Pas d’autorisation pour la position. Vous pouvez choisir la ville dans les filtres.',
    falhou: 'Impossible de savoir où vous êtes pour l’instant. Vous pouvez choisir la ville dans les filtres.',
  },

  /* « Nutrologia » est une spécialité médicale brésilienne (médecin
     nutritionniste) ; « Nutrição » est le diététicien. */
  especialidades: {
    endocrinologia: 'Endocrinologie',
    nutrologia: 'Nutrition médicale',
    nutricao: 'Diététique',
    esporte: 'Médecine du sport',
    psicologia: 'Psychologie',
  },
  todas: 'Toutes',

  filtros: 'Filtres',
  filtrosSub: 'Ville, assurance, type de consultation et jour',
  resultados: (n: number) => `${n} ${n === 1 ? 'professionnel' : 'professionnels'}`,

  aDistancia: (quanto: string) => `à ${quanto}`,
  soTeleconsulta: 'Téléconsultation uniquement',
  teleconsulta: 'Téléconsultation',
  outrosLocais: (n: number) => `${n}\u00A0autre${n === 1 ? '' : 's'}\u00A0${n === 1 ? 'lieu' : 'lieux'}`,
  /* « du lun. au ven. » */
  deAte: (de: string, ate: string) => `du ${de} au ${ate}`,
  faixa: (abre: string, fecha: string) => `${abre}\u2060–\u2060${fecha}`,
  horario: (dias: string, faixa: string) => `${dias} · ${faixa}`,

  vazioTitulo: 'Personne avec ces filtres',
  vazioTexto: 'Essayez une autre spécialité, ou retirez un des filtres.',
  limparFiltros: 'Effacer les filtres',
  erroTitulo: 'Impossible d’ouvrir le réseau',
  erroTexto: 'Vérifiez votre connexion et réessayez.',
  tentarDeNovo: 'Réessayer',

  jaTenhoCodigo: 'J’ai un code d’invitation',

  folha: {
    titulo: 'Filtres',
    cidade: 'Ville',
    todasAsCidades: 'Toutes',
    modalidade: 'Type de consultation',
    todas: 'Tous',
    presencial: 'En cabinet',
    teleconsulta: 'Téléconsultation',
    convenio: 'Assurance',
    qualquer: 'Peu importe',
    particular: 'Paiement direct',
    dia: 'Consulte le',
    qualquerDia: 'N’importe quel jour',
    ver: (n: number) => (n ? `Voir ${n} ${n === 1 ? 'professionnel' : 'professionnels'}` : 'Aucun professionnel'),
    limpar: 'Effacer',
  },

  ficha: {
    sobre: 'Présentation',
    ondeAtende: 'Où consulter',
    presencialETele: 'En cabinet et en téléconsultation',
    soPresencial: 'En cabinet',
    convenios: 'Assurances',
    soParticular: 'Paiement direct uniquement',
    particularNaLista: 'paiement direct',
    comoChegar: 'Itinéraire',
    falar: 'Contacter le cabinet',
    falarNota: 'Les moyens de contact indiqués par le cabinet. Chacun s’ouvre en dehors de l’application.',
    agenda: 'Prendre rendez-vous en ligne',
    exemploContatos: 'Contacts fictifs — ils n’ouvrent rien.',
    proximoTitulo: 'Après la première consultation',
    proximoTexto: 'Le cabinet vous remet un code d’invitation. C’est lui qui relie le suivi à l’application — les messages entre les consultations, votre résumé transmis à l’équipe et les rendez-vous déjà inscrits.',
    jaTenhoCodigo: 'J’ai un code',
    naoEncontrado: 'Ce professionnel n’est pas dans le réseau.',
  },
};
