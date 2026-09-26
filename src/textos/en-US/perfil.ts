/* O PERFIL · en-US — ver o cabeçalho do pt-BR para as regras. */

export const perfil = {
  naoInformado: 'Not given',
  nenhuma: 'None',
  especialista: 'Specialist',
  dia: (numero: number) => `Day ${numero}`,
  inicial: 'Start',
  atual: 'Today',
  meta: 'Goal',

  consultaEm: (quando: string) => `Appointment ${quando}`,
  naoLidas: (quantas: number) => `${quantas} unread`,

  planoECobranca: 'Plan and billing',
  suaAssinatura: 'Your subscription',

  acompanhamento: 'Follow-up',
  metasDiarias: 'Daily goals',
  metasDiariasSub: (proteina: number, agua: string) => `${proteina} g of protein · ${agua} L of water`,
  lembretes: 'Reminders',
  lembretesSub: 'Dose, weigh-in, water and protein',
  dispositivos: 'Devices and integrations',
  dispositivosSub: 'Apple Health, Withings and more',

  oQueVoceJaFez: 'What you have done',
  conquistas: 'Milestones',
  conquistasSub: 'What you have reached in your treatment',

  sobreVoce: 'About you',
  seusDados: 'Your details',
  seusDadosSub: 'Height, weight, pace and more',
  exames: 'Lab results',
  examesSub: 'What the lab found, explained',
  seuTratamento: 'Your treatment',
  seuTratamentoSub: 'Everything you logged, week by week',

  personalize: 'Make the app yours',
  aparencia: 'Appearance',
  aparenciaSub: (paleta: string, escuro: boolean) =>
    `${paleta}, ${escuro ? 'dark' : 'light'} mode · pick the app’s color`,
  idiomaSub: (idioma: string) => idioma,
  unidades: 'Units of measurement',
  unidadesSub: (sistema: string, unidades: string) => `${sistema} · ${unidades}`,

  ajudaEDados: 'Help and data',
  privacidade: 'Privacy and data',
  privacidadeSub: 'Where your journal is kept, export, delete and the documents',
  ajuda: 'Help',
  ajudaSub: 'Frequently asked questions about the app',

  reportar: 'Report a problem',
  reportarSub: 'Tell us what happened — we’ll attach the app version',
  problemaAssunto: 'Morphi — problem',
  problemaSistema: (sistema: string, versao: string) => `System: ${sistema} ${versao}`,
  problemaPaleta: (paleta: string, escuro: boolean) =>
    `Palette: ${paleta} · Theme: ${escuro ? 'dark' : 'light'}`,
  problemaCorpo: 'Tell us what you were doing and what happened.',

  sair: 'Sign out',
  versao: (numero: string) => `Morphi · version ${numero}`,
};
