/* O PERFIL · es-419 — ver o cabeçalho do pt-BR para as regras. */

export const perfil = {
  naoInformado: 'Sin informar',
  nenhuma: 'Ninguna',
  especialista: 'Especialista',
  dia: (numero: number) => `Día ${numero}`,
  inicial: 'Inicial',
  atual: 'Actual',
  meta: 'Meta',

  consultaEm: (quando: string) => `Consulta ${quando}`,
  naoLidas: (quantas: number) => `${quantas} sin leer`,

  planoECobranca: 'Plan y cobro',
  suaAssinatura: 'Tu suscripción',

  acompanhamento: 'Seguimiento',
  metasDiarias: 'Metas diarias',
  metasDiariasSub: (proteina: number, agua: string) => `${proteina} g de proteína · ${agua} L de agua`,
  lembretes: 'Recordatorios',
  lembretesSub: 'Dosis, pesaje, agua y proteína',
  dispositivos: 'Dispositivos e integraciones',
  dispositivosSub: 'Apple Health, Withings y más',

  oQueVoceJaFez: 'Lo que ya hiciste',
  conquistas: 'Logros',
  conquistasSub: 'Lo que ya alcanzaste en el tratamiento',

  sobreVoce: 'Sobre ti',
  seusDados: 'Tus datos',
  seusDadosSub: 'Altura, peso, ritmo y más',
  exames: 'Exámenes',
  examesSub: 'Los resultados del laboratorio, explicados',
  seuTratamento: 'Tu tratamiento',
  seuTratamentoSub: 'Todo lo que registraste, semana a semana',

  personalize: 'Personaliza la aplicación',
  aparencia: 'Apariencia',
  aparenciaSub: (paleta: string, escuro: boolean) =>
    `${paleta}, en ${escuro ? 'oscuro' : 'claro'} · elige el color de la aplicación`,
  idiomaSub: (idioma: string, pais: string) => `${idioma} · ${pais}`,
  unidades: 'Unidades de medida',
  unidadesSub: (sistema: string, unidades: string) => `${sistema} · ${unidades}`,

  ajudaEDados: 'Ayuda y datos',
  privacidade: 'Privacidad y datos',
  privacidadeSub: 'Qué queda en el aparato, exportar, borrar y los documentos',
  ajuda: 'Ayuda',
  ajudaSub: 'Preguntas frecuentes sobre la aplicación',

  reportar: 'Reportar un problema',
  reportarSub: 'Cuenta qué pasó — va con la versión de la aplicación',
  problemaAssunto: 'Morphi — problema',
  problemaSistema: (sistema: string, versao: string) => `Sistema: ${sistema} ${versao}`,
  problemaPaleta: (paleta: string, escuro: boolean) =>
    `Paleta: ${paleta} · Tema: ${escuro ? 'oscuro' : 'claro'}`,
  problemaCorpo: 'Cuenta qué estabas haciendo y qué pasó.',

  sair: 'Cerrar sesión',
  versao: (numero: string) => `Morphi · versión ${numero}`,
};
