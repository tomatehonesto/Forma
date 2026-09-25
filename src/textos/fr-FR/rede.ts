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
  lugarEDistancia: (lugar: string, distancia: string) => `${lugar} • ${distancia}`,
  soTeleconsulta: 'Téléconsultation uniquement',
  soPresencial: 'En cabinet',
  presencialETele: 'En cabinet et en téléconsultation',
  teleconsulta: 'Téléconsultation',
  particular: 'Paiement direct',
  aceita: (convenio: string) => `Accepte ${convenio}`,
  aceitaConvenios: 'Assurances acceptées',
  atendeHoje: 'Aujourd’hui',
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

  apresentacao: {
    tag: 'Cliniques partenaires',
    titulo: 'Un suivi de près, entre deux consultations',
    subtitulo: 'Les cliniques partenaires suivent votre traitement avec l’application — l’équipe échange avec vous, suit votre évolution et reçoit les informations de votre parcours.',
    comoFunciona: 'Comment ça marche',
    passos: [
      { titulo: 'Trouvez une clinique', texto: 'Choisissez selon la spécialité, l’assurance ou la distance.' },
      { titulo: 'Prenez votre premier rendez-vous', texto: 'Contactez directement la clinique pour fixer votre rendez-vous.' },
      { titulo: 'Recevez votre code d’invitation', texto: 'La clinique vous envoie le code après la consultation. C’est lui qui relie votre application à l’équipe.' },
      { titulo: 'L’équipe suit votre traitement', texto: 'Tout ce que vous avez déjà enregistré reste ici. Le lien avec la clinique n’efface rien.' },
    ],
    isencaoTitulo: 'Et ce n’est pas tout : Morphi ne vous coûte rien',
    isencaoTexto: 'Les patients d’une clinique partenaire ont accès gratuitement à l’application.',
    conhecer: 'Découvrir les cliniques partenaires',
    credito: 'Image de Drazen Zigic sur Magnific',
  },

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
    titulo: 'Des spécialistes à vos côtés',
    texto: 'Des cliniques qui utilisent Morphi pour suivre leurs patients de près, surveiller l’évolution du traitement et optimiser leurs résultats.',
    acao: 'Voir les cliniques',
    saibaMais: 'En savoir plus',
  },
};
