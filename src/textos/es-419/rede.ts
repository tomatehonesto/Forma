/* La red asociada — el directorio y la ficha del profesional. Ver
   ../pt-BR/rede: por qué existe en todos los idiomas aunque la red sea
   brasileña, y qué NO se traduce (lo que el profesional escribió en el
   portal). */

export const rede = {
  titulo: 'Red asociada',
  lead: 'Profesionales que acompañan el tratamiento con la aplicación. El primer contacto es directo con el consultorio.',

  exemploTitulo: 'Profesionales de ejemplo',
  exemploTexto: 'Los nombres, registros y contactos son inventados, solo para ver cómo queda el directorio. La lista real viene del portal de la red.',

  busca: 'Nombre o especialidad',

  localizacao: {
    usar: 'Usar mi ubicación',
    usarSub: 'Para ver la distancia a cada consultorio. Se queda en el dispositivo.',
    pedindo: 'Buscando dónde estás…',
    ligada: 'Los más cercanos primero',
    ligadaSub: 'Ordenado por distancia. Toca para desactivar.',
    negada: 'Sin permiso para usar tu ubicación. Puedes elegir la ciudad en los filtros.',
    falhou: 'No pudimos saber dónde estás ahora. Puedes elegir la ciudad en los filtros.',
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
  todas: 'Todas',

  filtros: 'Filtros',
  filtrosSub: 'Ciudad, seguro médico, modalidad y día',
  resultados: (n: number) => `${n} ${n === 1 ? 'profesional' : 'profesionales'}`,

  aDistancia: (quanto: string) => `a ${quanto}`,
  soTeleconsulta: 'Solo teleconsulta',
  teleconsulta: 'Teleconsulta',
  outrosLocais: (n: number) => `${n}\u00A0${n === 1 ? 'lugar' : 'lugares'}\u00A0más`,
  deAte: (de: string, ate: string) => `${de} a ${ate}`,
  faixa: (abre: string, fecha: string) => `${abre}\u2060–\u2060${fecha}`,
  horario: (dias: string, faixa: string) => `${dias} · ${faixa}`,

  vazioTitulo: 'Nadie con estos filtros',
  vazioTexto: 'Prueba otra especialidad, o quita uno de los filtros.',
  limparFiltros: 'Quitar filtros',
  erroTitulo: 'No pudimos abrir la red',
  erroTexto: 'Revisa tu conexión e inténtalo de nuevo.',
  tentarDeNovo: 'Intentar de nuevo',

  jaTenhoCodigo: 'Ya tengo un código de invitación',

  folha: {
    titulo: 'Filtros',
    cidade: 'Ciudad',
    todasAsCidades: 'Todas',
    modalidade: 'Modalidad',
    todas: 'Todas',
    presencial: 'Presencial',
    teleconsulta: 'Teleconsulta',
    convenio: 'Seguro médico',
    qualquer: 'Cualquiera',
    particular: 'Pago particular',
    dia: 'Atiende el',
    qualquerDia: 'Cualquier día',
    ver: (n: number) => (n ? `Ver ${n} ${n === 1 ? 'profesional' : 'profesionales'}` : 'Ningún profesional'),
    limpar: 'Limpiar',
  },

  ficha: {
    sobre: 'Acerca de',
    ondeAtende: 'Dónde atiende',
    presencialETele: 'Presencial y teleconsulta',
    soPresencial: 'Presencial',
    convenios: 'Seguros médicos',
    soParticular: 'Solo pago particular',
    particularNaLista: 'pago particular',
    comoChegar: 'Cómo llegar',
    falar: 'Contactar al consultorio',
    falarNota: 'Los canales que registró el consultorio. Cada uno se abre fuera de la aplicación.',
    agenda: 'Agendar en línea',
    exemploContatos: 'Contactos de ejemplo — no abren nada.',
    proximoTitulo: 'Después de la primera consulta',
    proximoTexto: 'El consultorio te da un código de invitación. Es lo que conecta el seguimiento con la aplicación — mensajes entre consultas, tu resumen llegando al equipo y la agenda ya cargada.',
    jaTenhoCodigo: 'Ya tengo un código',
    naoEncontrado: 'No encontramos a este profesional en la red.',
  },
};
