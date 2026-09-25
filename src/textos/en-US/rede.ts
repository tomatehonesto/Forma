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
  lugarEDistancia: (lugar: string, distancia: string) => `${lugar} • ${distancia}`,
  soTeleconsulta: 'Telehealth only',
  soPresencial: 'In person',
  presencialETele: 'In person and telehealth',
  teleconsulta: 'Telehealth',
  particular: 'Self-pay',
  aceita: (convenio: string) => `Takes ${convenio}`,
  aceitaConvenios: 'Takes insurance',
  atendeHoje: 'Open today',
  deAte: (de: string, ate: string) => `${de}–${ate}`,
  faixa: (abre: string, fecha: string) => `${abre}\u2060–\u2060${fecha}`,
  horario: (dias: string, faixa: string) => `${dias} · ${faixa}`,

  vazioTitulo: 'No clinics match these filters',
  vazioTexto: 'Try another specialty, or remove one of the filters.',
  limparFiltros: 'Clear filters',
  erroTitulo: 'We couldn’t open the network',
  erroTexto: 'Check your connection and try again.',
  tentarDeNovo: 'Try again',

  jaTenhoCodigo: 'I have an invite code',

  apresentacao: {
    tag: 'Partner clinics',
    titulo: 'Care that stays close between appointments',
    subtitulo: 'Partner clinics follow treatment through the app: the team talks with you, gets your summary and handles prescriptions right here.',
    comoFunciona: 'How it works',
    passos: [
      { titulo: 'You choose the clinic', texto: 'By specialty, insurance and how far it is from you.' },
      { titulo: 'You book the first appointment', texto: 'Directly with the clinic — on WhatsApp, by phone or through its online booking. That contact doesn’t go through us.' },
      { titulo: 'You get the invite code', texto: 'The clinic gives it to you after the appointment, and it’s what connects your app to the team.' },
      { titulo: 'And the team follows along', texto: 'Everything you’ve already logged stays here — the link doesn’t reset anything.' },
    ],
    conhecer: 'Meet the partner clinics',
    credito: 'Image by Drazen Zigic on Magnific',
  },

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
    titulo: 'Have specialists by your side',
    texto: 'Clinics that use Morphi to follow their patients closely, track how treatment is progressing and boost their results.',
    acao: 'See clinics',
  },
};
