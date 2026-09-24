/* The partner network — the directory and the professional's page. See
   ../pt-BR/rede for why this exists in every language even though the
   network is Brazilian, and for what is NOT translated (whatever the
   professional wrote in the portal). */

export const rede = {
  titulo: 'Partner network',
  lead: 'Professionals who follow treatment through the app. You reach out to the office directly.',

  exemploTitulo: 'Sample professionals',
  exemploTexto: 'Names, registrations and contacts are made up, just to show how the directory looks. The real list comes from the network’s portal.',

  busca: 'Name or specialty',

  localizacao: {
    usar: 'Use my location',
    usarSub: 'To see how far each office is. It stays on this device.',
    pedindo: 'Finding where you are…',
    ligada: 'Closest first',
    ligadaSub: 'Sorted by distance. Tap to turn off.',
    negada: 'No permission to use your location. You can pick a city in the filters.',
    falhou: 'We couldn’t tell where you are right now. You can pick a city in the filters.',
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
  todas: 'All',

  filtros: 'Filters',
  filtrosSub: 'City, insurance, visit type and day',
  resultados: (n: number) => `${n} ${n === 1 ? 'professional' : 'professionals'}`,

  aDistancia: (quanto: string) => `${quanto} away`,
  soTeleconsulta: 'Telehealth only',
  teleconsulta: 'Telehealth',
  outrosLocais: (n: number) => `${n}\u00A0more\u00A0${n === 1 ? 'location' : 'locations'}`,
  deAte: (de: string, ate: string) => `${de}–${ate}`,
  faixa: (abre: string, fecha: string) => `${abre}\u2060–\u2060${fecha}`,
  horario: (dias: string, faixa: string) => `${dias} · ${faixa}`,

  vazioTitulo: 'No one matches these filters',
  vazioTexto: 'Try another specialty, or remove one of the filters.',
  limparFiltros: 'Clear filters',
  erroTitulo: 'We couldn’t open the network',
  erroTexto: 'Check your connection and try again.',
  tentarDeNovo: 'Try again',

  jaTenhoCodigo: 'I have an invite code',

  folha: {
    titulo: 'Filters',
    cidade: 'City',
    todasAsCidades: 'All',
    modalidade: 'Visit type',
    todas: 'All',
    presencial: 'In person',
    teleconsulta: 'Telehealth',
    convenio: 'Insurance',
    qualquer: 'Any',
    particular: 'Self-pay',
    dia: 'Available on',
    qualquerDia: 'Any day',
    ver: (n: number) => (n ? `Show ${n} ${n === 1 ? 'professional' : 'professionals'}` : 'No professionals'),
    limpar: 'Clear',
  },

  ficha: {
    sobre: 'About',
    ondeAtende: 'Where to find them',
    presencialETele: 'In person and telehealth',
    soPresencial: 'In person',
    convenios: 'Insurance',
    soParticular: 'Self-pay only',
    particularNaLista: 'self-pay',
    comoChegar: 'Directions',
    falar: 'Contact the office',
    falarNota: 'The channels the office listed. Each one opens outside the app.',
    agenda: 'Book online',
    exemploContatos: 'Sample contacts — they don’t open anything.',
    proximoTitulo: 'After the first appointment',
    proximoTexto: 'The office gives you an invite code. That’s what connects your care to the app — messages between appointments, your summary reaching the team, and appointments already filled in.',
    jaTenhoCodigo: 'I have a code',
    naoEncontrado: 'We couldn’t find this professional in the network.',
  },
};
