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
    subtitulo: 'Partner clinics follow your treatment through the app: the team talks with you, follows your progress and receives the information from your journey.',
    comoFunciona: 'How it works',
    passos: [
      { titulo: 'Find a clinic', texto: 'Choose by specialty, insurance or how far it is from you.' },
      { titulo: 'Book your first appointment', texto: 'Contact the clinic directly and schedule your appointment.' },
      { titulo: 'Get your invite code', texto: 'The clinic sends you the code after the appointment. It’s what connects your app to the team.' },
      { titulo: 'The team follows your treatment', texto: 'Everything you’ve already logged stays here. The link with the clinic doesn’t erase anything.' },
    ],
    isencaoTitulo: 'And there’s more: you don’t pay for Morphi',
    isencaoTexto: 'If you’re treated at a partner clinic, you get free access to the app.',
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
    saibaMais: 'Learn more',
  },

  /* The link on the server — see the header of the block in pt-BR/rede. */
  vinculo: {
    titulo: 'What the clinic will see',
    itens: {
      peso: 'Weigh-ins',
      aplicacao: 'Doses',
      checkin: 'Check-ins: symptoms, sleep, hunger, water, protein and movement',
      refeicao: 'Meals',
      refeicao_favorita: 'Favorite meals',
      medida: 'Body measurements',
      exame: 'Lab results',
      laudo: 'Lab reports',
      sinal_vital: 'Vital signs',
      documento: 'Documents',
      anotacao: 'Notes',
      meta_pessoal: 'Personal goals',
      caneta: 'Your medication containers',
      pessoal: 'Your details: name, birth date, height and photo',
      tratamento: 'Your treatment, with your health history: conditions, allergies and medications',
      acompanhamento: 'Who looks after you, and the appointments you noted',
      protocolo: 'The week’s protocol and the goals',
      preferencias: 'App preferences, like language and reminders',
      vistos: 'What the app has already shown you',
    },
    antes: 'It includes what you logged before connecting.',
    perguntas: 'The questions you ask Morphi are not included.',
    dura: 'The clinic sees it while the connection lasts. You can disconnect at any time, on the clinic’s screen.',
    guarda: 'What is logged during the care stays with the clinic, as a medical record, even after you disconnect.',
    aceitar: 'Connecting means agreeing to the sharing above.',
    semInternet: 'Checking the code needs internet. Try again when the connection is back.',
    naoValeuAgora: 'That code didn’t work: it was already used or it expired. Ask the clinic for another one.',
    entrarPrimeiro: 'To connect, sign in to your account again. The code stays saved.',
    guardadoTitulo: 'Code saved',
    guardadoTexto: 'We’ll connect the clinic as soon as your account is created.',
    desconectar: 'Disconnect from the clinic',
    desconectarPergunta: 'The team stops seeing your journal, and the app exemption through the clinic ends. All your entries stay here.',
    desconectarSim: 'Disconnect',
    desconectarCancelar: 'Cancel',
    desconectarSemInternet: 'Disconnecting needs internet. Nothing changed.',
    avisoEncerrouTitulo: 'The clinic ended the care',
    avisoEncerrouTexto: 'Your journal is still here, all of it.',
    avisoNaoConfirmadoTitulo: 'The invite code wasn’t confirmed',
    avisoNaoConfirmadoTexto: 'It was never checked with the clinic. You can enter it again in the Care tab.',
    avisoNaoValeuTitulo: 'The invite code didn’t work',
    avisoNaoValeuTexto: 'It had already been used or had expired. You can enter another one in the Care tab.',
  },
};
