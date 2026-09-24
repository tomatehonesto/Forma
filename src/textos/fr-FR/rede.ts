/* Le réseau partenaire — l’annuaire, ses filtres et la carte de l’onglet
   Suivi. Voir ../pt-BR/rede : pourquoi il existe dans toutes les langues
   alors que le réseau est brésilien, et ce qui ne se traduit PAS (ce que
   la clinique a écrit dans le portail). */

export const rede = {
  titulo: 'Cliniques partenaires',
  lead: 'Des cliniques qui suivent le traitement avec l’application. Le premier contact se fait directement avec elles.',

  exemploTitulo: 'Cliniques fictives',
  exemploTexto: 'Les noms, numéros d’inscription et contacts sont inventés, juste pour voir à quoi ressemble l’annuaire. La vraie liste vient du portail du réseau.',

  busca: 'Clinique, médecin ou spécialité',

  perto: 'Près de moi',
  localizacao: {
    pedindo: 'Recherche de votre position…',
    negada: 'Pas d’autorisation pour la position. Vous pouvez choisir la ville.',
    falhou: 'Impossible de savoir où vous êtes pour l’instant. Vous pouvez choisir la ville.',
  },

  filtro: {
    especialidade: 'Spécialité',
    convenio: 'Assurance',
    modalidade: 'Type de consultation',
    dia: 'Jour',
    cidade: 'Ville',
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

  resultados: (n: number) => `${n} ${n === 1 ? 'clinique' : 'cliniques'}`,

  aDistancia: (quanto: string) => `à ${quanto}`,
  soTeleconsulta: 'Téléconsultation uniquement',
  soPresencial: 'En cabinet',
  presencialETele: 'En cabinet et en téléconsultation',
  teleconsulta: 'Téléconsultation',
  particular: 'Paiement direct',
  aceita: (convenio: string) => `Accepte ${convenio}`,
  soParticular: 'Paiement direct uniquement',
  particularNaLista: 'paiement direct',
  tambemTeleconsulta: 'Aussi en téléconsultation',
  /* « du lun. au ven. » */
  deAte: (de: string, ate: string) => `du ${de} au ${ate}`,
  faixa: (abre: string, fecha: string) => `${abre}\u2060–\u2060${fecha}`,
  horario: (dias: string, faixa: string) => `${dias} · ${faixa}`,

  vazioTitulo: 'Aucune clinique avec ces filtres',
  vazioTexto: 'Essayez une autre spécialité, ou retirez un des filtres.',
  limparFiltros: 'Effacer les filtres',
  erroTitulo: 'Impossible d’ouvrir le réseau',
  erroTexto: 'Vérifiez votre connexion et réessayez.',
  tentarDeNovo: 'Réessayer',

  jaTenhoCodigo: 'J’ai un code d’invitation',

  folha: {
    especialidade: 'Spécialité',
    convenio: 'Assurance',
    modalidade: 'Type de consultation',
    dia: 'Jour de consultation',
    cidade: 'Ville',
    todas: 'Toutes',
    qualquer: 'Peu importe',
    qualquerDia: 'N’importe quel jour',
    todasAsCidades: 'Toutes les villes',
    presencialOuTele: 'En cabinet ou en téléconsultation',
    presencial: 'En cabinet',
    teleconsulta: 'Téléconsultation',
    limpar: 'Effacer',
  },

  cartao: {
    tag: 'Cliniques partenaires',
    titulo: 'Soyez suivi par des spécialistes',
    naRede: (n: number) => `${n} ${n === 1 ? 'professionnel' : 'professionnels'} dans le réseau`,
    pertoDeVoce: (n: number) => `${n} ${n === 1 ? 'professionnel' : 'professionnels'} · les plus proches de vous`,
    acao: 'Voir les cliniques',
  },
};
