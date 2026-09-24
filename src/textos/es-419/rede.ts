/* La red asociada — el directorio, sus filtros y la tarjeta de la pestaña
   Cuidado. Ver ../pt-BR/rede: por qué existe en todos los idiomas aunque
   la red sea brasileña, y qué NO se traduce (lo que la clínica escribió
   en el portal). */

export const rede = {
  titulo: 'Clínicas asociadas',
  lead: 'Clínicas que acompañan el tratamiento con la aplicación. El primer contacto es directo con ellas.',

  exemploTitulo: 'Clínicas de ejemplo',
  exemploTexto: 'Los nombres, registros y contactos son inventados, solo para ver cómo queda el directorio. La lista real viene del portal de la red.',

  busca: 'Clínica, médico o especialidad',

  perto: 'Cerca de mí',
  localizacao: {
    pedindo: 'Buscando dónde estás…',
    negada: 'Sin permiso para usar tu ubicación. Puedes elegir la ciudad.',
    falhou: 'No pudimos saber dónde estás ahora. Puedes elegir la ciudad.',
  },

  filtro: {
    especialidade: 'Especialidad',
    convenio: 'Seguro médico',
    modalidade: 'Modalidad',
    dia: 'Día',
    cidade: 'Ciudad',
  },

  /* "Nutrologia" es una especialidad médica brasileña; "Nutrição" es el
     nutricionista. En México "nutriólogo" es el segundo, por eso el
     primero va como "Nutrición médica". */
  especialidades: {
    endocrinologia: 'Endocrinología',
    nutrologia: 'Nutrición médica',
    nutricao: 'Nutrición',
    esporte: 'Medicina del deporte',
    psicologia: 'Psicología',
  },

  resultados: (n: number) => `${n} ${n === 1 ? 'clínica' : 'clínicas'}`,

  aDistancia: (quanto: string) => `a ${quanto}`,
  soTeleconsulta: 'Solo teleconsulta',
  soPresencial: 'Presencial',
  presencialETele: 'Presencial y teleconsulta',
  teleconsulta: 'Teleconsulta',
  particular: 'Pago particular',
  aceita: (convenio: string) => `Acepta ${convenio}`,
  soParticular: 'Solo pago particular',
  maisConvenios: (n: number) => `+${n}`,
  deAte: (de: string, ate: string) => `${de} a ${ate}`,
  faixa: (abre: string, fecha: string) => `${abre}\u2060–\u2060${fecha}`,
  horario: (dias: string, faixa: string) => `${dias} · ${faixa}`,

  vazioTitulo: 'Ninguna clínica con estos filtros',
  vazioTexto: 'Prueba otra especialidad, o quita uno de los filtros.',
  limparFiltros: 'Quitar filtros',
  erroTitulo: 'No pudimos abrir la red',
  erroTexto: 'Revisa tu conexión e inténtalo de nuevo.',
  tentarDeNovo: 'Intentar de nuevo',

  jaTenhoCodigo: 'Ya tengo un código de invitación',

  folha: {
    especialidade: 'Especialidad',
    convenio: 'Seguro médico',
    modalidade: 'Modalidad',
    dia: 'Día de atención',
    cidade: 'Ciudad',
    todas: 'Todas',
    qualquer: 'Cualquiera',
    qualquerDia: 'Cualquier día',
    todasAsCidades: 'Todas las ciudades',
    presencialOuTele: 'Presencial o teleconsulta',
    presencial: 'Presencial',
    teleconsulta: 'Teleconsulta',
    limpar: 'Limpiar',
  },

  cartao: {
    tag: 'Clínicas asociadas',
    titulo: 'Cuenta con el seguimiento de especialistas',
    naRede: (n: number) => `${n} ${n === 1 ? 'profesional' : 'profesionales'} en la red`,
    pertoDeVoce: (n: number) => `${n} ${n === 1 ? 'profesional' : 'profesionales'} · los más cercanos a ti`,
    acao: 'Ver clínicas',
  },
};
