/* The partner network — the directory, its filters and the card on the
   Care tab. See ../pt-BR/rede for why this exists in every language even
   though the network is Brazilian, and for what is NOT translated
   (whatever the clinic wrote in the portal). */

export const rede = {
  titulo: 'Partner clinics',
  lead: 'Clinics that follow treatment through the app. You reach out to them directly.',

  exemploTitulo: 'Sample clinics',
  exemploTexto: 'Names, registrations and contacts are made up, just to show how the directory looks. The real list comes from the network’s portal.',

  busca: 'Clinic, doctor or specialty',

  perto: 'Near me',
  localizacao: {
    pedindo: 'Finding where you are…',
    negada: 'No permission to use your location. You can pick a city.',
    falhou: 'We couldn’t tell where you are right now. You can pick a city.',
  },

  filtro: {
    especialidade: 'Specialty',
    convenio: 'Insurance',
    modalidade: 'Visit type',
    dia: 'Day',
    cidade: 'City',
  },

  /* "Nutrologia" is a Brazilian medical specialty — a physician who treats
     nutrition. "Nutrição" is the dietitian. Two different people. */
  especialidades: {
    endocrinologia: 'Endocrinology',
    nutrologia: 'Medical nutrition',
    nutricao: 'Nutrition',
    esporte: 'Sports medicine',
    psicologia: 'Psychology',
  },

  resultados: (n: number) => `${n} ${n === 1 ? 'clinic' : 'clinics'}`,

  aDistancia: (quanto: string) => `${quanto} away`,
  soTeleconsulta: 'Telehealth only',
  soPresencial: 'In person',
  presencialETele: 'In person and telehealth',
  teleconsulta: 'Telehealth',
  particular: 'Self-pay',
  maisConvenios: (n: number) => `+${n}`,
  deAte: (de: string, ate: string) => `${de}–${ate}`,
  faixa: (abre: string, fecha: string) => `${abre}⁠–⁠${fecha}`,
  horario: (dias: string, faixa: string) => `${dias} · ${faixa}`,

  vazioTitulo: 'No clinics match these filters',
  vazioTexto: 'Try another specialty, or remove one of the filters.',
  limparFiltros: 'Clear filters',
  erroTitulo: 'We couldn’t open the network',
  erroTexto: 'Check your connection and try again.',
  tentarDeNovo: 'Try again',

  jaTenhoCodigo: 'I have an invite code',

  folha: {
    especialidade: 'Specialty',
    convenio: 'Insurance',
    modalidade: 'Visit type',
    dia: 'Day of the week',
    cidade: 'City',
    todas: 'All',
    qualquer: 'Any',
    qualquerDia: 'Any day',
    todasAsCidades: 'All cities',
    presencialOuTele: 'In person or telehealth',
    presencial: 'In person',
    teleconsulta: 'Telehealth',
    limpar: 'Clear',
  },

  cartao: {
    tag: 'Partner clinics',
    titulo: 'Get care from specialists',
    naRede: (n: number) => `${n} ${n === 1 ? 'professional' : 'professionals'} in the network`,
    pertoDeVoce: (n: number) => `${n} ${n === 1 ? 'professional' : 'professionals'} · closest to you`,
    acao: 'See clinics',
  },
};
