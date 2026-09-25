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
  lugarEDistancia: (lugar: string, distancia: string) => `${lugar} • ${distancia}`,
  soTeleconsulta: 'Solo teleconsulta',
  soPresencial: 'Presencial',
  presencialETele: 'Presencial y teleconsulta',
  teleconsulta: 'Teleconsulta',
  particular: 'Pago particular',
  aceita: (convenio: string) => `Acepta ${convenio}`,
  aceitaConvenios: 'Acepta seguros',
  atendeHoje: 'Atiende hoy',
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

  apresentacao: {
    tag: 'Clínicas asociadas',
    titulo: 'Seguimiento cercano, entre una consulta y otra',
    subtitulo: 'Las clínicas asociadas acompañan tu tratamiento con la aplicación: el equipo conversa contigo, sigue tu evolución y recibe la información de tu recorrido.',
    comoFunciona: 'Cómo funciona',
    passos: [
      { titulo: 'Encuentra una clínica', texto: 'Elige por especialidad, seguro médico o distancia.' },
      { titulo: 'Agenda tu primera consulta', texto: 'Contacta directamente a la clínica y reserva tu consulta.' },
      { titulo: 'Recibe tu código de invitación', texto: 'La clínica te envía el código después de la consulta. Es lo que conecta tu aplicación con el equipo.' },
      { titulo: 'El equipo acompaña tu tratamiento', texto: 'Todo lo que ya registraste sigue aquí. El vínculo con la clínica no borra nada.' },
    ],
    isencaoTitulo: 'Y hay más: no pagas por Morphi',
    isencaoTexto: 'Quien hace el tratamiento con una clínica asociada tiene acceso gratuito a la aplicación.',
    conhecer: 'Conocer las clínicas asociadas',
    credito: 'Imagen de Drazen Zigic en Magnific',
  },

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
    titulo: 'Ten especialistas a tu lado',
    texto: 'Clínicas que usan Morphi para acompañar de cerca a sus pacientes, seguir la evolución del tratamiento y potenciar sus resultados.',
    acao: 'Ver clínicas',
    saibaMais: 'Conoce más',
  },

  /* El vínculo en el servidor — ver el encabezado del bloque en pt-BR/rede. */
  vinculo: {
    titulo: 'Lo que la clínica pasa a ver',
    itens: {
      peso: 'Pesajes',
      aplicacao: 'Aplicaciones',
      checkin: 'Check-ins: síntomas, sueño, hambre, agua, proteína y movimiento',
      refeicao: 'Comidas',
      refeicao_favorita: 'Comidas favoritas',
      medida: 'Medidas del cuerpo',
      exame: 'Exámenes',
      laudo: 'Informes de laboratorio',
      sinal_vital: 'Signos vitales',
      documento: 'Documentos',
      anotacao: 'Notas',
      meta_pessoal: 'Metas personales',
      caneta: 'Los envases del medicamento',
      pessoal: 'Tus datos: nombre, nacimiento, estatura y foto',
      tratamento: 'El tratamiento, con tu historial de salud: condiciones, alergias y medicamentos',
      acompanhamento: 'Quién te acompaña, y las consultas que anotaste',
      protocolo: 'El protocolo de la semana y las metas',
      preferencias: 'Preferencias de la aplicación, como idioma y recordatorios',
      vistos: 'Lo que la aplicación ya te mostró',
    },
    antes: 'Incluye lo que registraste antes de conectar.',
    perguntas: 'Las preguntas que le haces a Morphi no entran.',
    dura: 'La clínica lo ve mientras dure la conexión. Puedes desconectar en cualquier momento, en la pantalla de la clínica.',
    guarda: 'Lo que se registre durante el acompañamiento queda guardado por la clínica, como historia clínica, incluso después de desconectar.',
    aceitar: 'Conectar es aceptar el compartir de arriba.',
    semInternet: 'Revisar el código necesita internet. Inténtalo de nuevo cuando vuelva la conexión.',
    naoValeuAgora: 'Ese código no sirvió: ya se usó o venció. Pídele otro a la clínica.',
    entrarPrimeiro: 'Para conectar, entra de nuevo a tu cuenta. El código queda guardado.',
    guardadoTitulo: 'Código guardado',
    guardadoTexto: 'Conectamos la clínica en cuanto se cree tu cuenta.',
    desconectar: 'Desconectar de la clínica',
    desconectarPergunta: 'El equipo deja de ver tu diario, y la exención de la aplicación por la clínica termina. Todos tus registros se quedan aquí.',
    desconectarSim: 'Desconectar',
    desconectarCancelar: 'Cancelar',
    desconectarSemInternet: 'Desconectar necesita internet. No cambió nada.',
    avisoEncerrouTitulo: 'La clínica terminó el acompañamiento',
    avisoEncerrouTexto: 'Tu diario sigue aquí, completo.',
    avisoNaoConfirmadoTitulo: 'El código de invitación no se confirmó',
    avisoNaoConfirmadoTexto: 'Nunca se revisó con la clínica. Puedes escribirlo de nuevo en la pestaña Cuidado.',
    avisoNaoValeuTitulo: 'El código de invitación no sirvió',
    avisoNaoValeuTexto: 'Ya se había usado o venció. Puedes escribir otro en la pestaña Cuidado.',
  },
};
