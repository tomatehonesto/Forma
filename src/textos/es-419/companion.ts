/* ============================================================
   EL COMPANION — su memoria y la biblioteca que sugiere · es-419

   ⚠️ Las razones viven en ../pt-BR/companion.ts. Las dos que mandan:

   LA MEMORIA HABLA DE PRESENCIA, NO DE VOLUMEN. La línea enumeraba lo que
   había leído — "consideré tus check-ins, 11 aplicaciones, 15 exámenes…" —
   y enumerar prueba capacidad de contar, no de conocer. Lo que construye
   confianza es haber estado ahí a lo largo del tiempo.

   Y LA BIBLIOTECA NO ES CATÁLOGO. Cada lectura entra porque algo en el
   estado de la persona la trajo, y el motivo aparece en la tarjeta.
   Contenido sin motivo visible se vuelve blog. Por eso cada ítem tiene
   TRES piezas y no son intercambiables: `motivo` es por qué apareció HOY,
   con el número de ella dentro; `titulo` es lo que el texto enseña; `desc`
   es lo que resuelve, que es distinto de lo que enseña.
   ============================================================ */

export const companion = {
  memoria: {
    desdeOComeco: 'Conozco tu recorrido desde el comienzo.',
  },

  biblioteca: {

    /* ⚠️ La pantalla mostraba cuatro artículos inventados escritos en duro,
       mientras la biblioteca de verdad estaba justo arriba y `libraryPicks`
       la armaba según el estado de la persona. Nadie la llamaba. Ver
       ../pt-BR/companion. */
    tela: {
      titulo: 'Biblioteca',
      sub: 'Contenido justo para tu momento — no una lista de artículos',
      minDeLeitura: (min: number) => `${min} min de lectura`,
      vazioTitulo: 'Nada para leer ahora',
      vazioTexto: 'Las lecturas aparecen cuando algo en tus registros pide una. Sin eso no hay qué leer — y eso es buena noticia.',
      vazioSemRegistroTexto: 'Las lecturas aparecen cuando algo en tus registros pide una. Con tus primeros check-ins, empiezan a aparecer aquí.',
    },
    fomeMotivo: (dia: number) => `Estás en el día ${dia} del ciclo, cuando el hambre vuelve`,
    fomeTitulo: 'Por qué el hambre vuelve antes de la aplicación',
    /* ⚠️ "QUITA LA SENSACIÓN DE RECAÍDA" es el servicio de esta lectura y
       la razón de que exista: el hambre que vuelve al quinto día es donde
       la gente concluye que falló. La molécula va en minúscula porque es
       sustancia, no marca. */
    fomeDesc: (molecula: string) =>
      `El nivel de ${molecula} baja a lo largo de la semana, y la saciedad baja con él. Entender la curva quita la sensación de recaída.`,

    primeirosMotivo: (dias: number) => `Te aplicaste hace ${dias} ${dias === 1 ? 'día' : 'días'}`,
    primeirosTitulo: 'Los primeros días después de la dosis',
    primeirosDesc: 'Qué es esperable sentir en la ventana de 48 h y qué ya merece un mensaje a tu equipo.',

    enjooMotivo: (dias: number) => `Marcaste náuseas en ${dias} de los últimos 7 días`,
    /* ⚠️ "ENFRENTAR" ES EL VERBO CORRECTO, y el título entero depende de
       él: quien tiene náuseas no necesita fuerza de voluntad para comer,
       necesita comida que le pase. */
    enjooTitulo: 'Comer sin enfrentar las náuseas',
    enjooDesc: 'Combinaciones y horarios que suelen pasar mejor los días en que la comida parece demasiado.',

    proteinaMotivo: (gramas: number) => `Faltan ${gramas} g para que tu promedio alcance la meta`,
    proteinaTitulo: 'Proteína sin cocinar más',
    proteinaDesc: 'Cómo llegar a la meta con lo que ya hay en tu cocina — el problema rara vez es la receta, es la practicidad.',

    sonoMotivo: (horas: string) => `Tu promedio de sueño está en ${horas} h`,
    sonoTitulo: 'El sueño como parte del tratamiento',
    sonoDesc: 'Dormir poco cambia las hormonas del hambre al día siguiente — en tus propios registros eso ya aparece.',

    plateauMotivo: (semana: number, perdido: string) => `Semana ${semana}, con ${perdido} en el período`,
    plateauTitulo: 'Qué cambia después del tercer mes',
    /* ⚠️ "ESTO ES FISIOLOGÍA, NO FALLA" es la misma defensa que hace la
       tarjeta de meseta, y tiene que estar aquí también: es en este punto
       del tratamiento donde la gente abandona. */
    plateauDesc: 'La pérdida se desacelera y eso es fisiología, no falla. Qué pasa a valer más que la balanza de aquí en adelante.',

    consultaMotivo: (dias: number) => `Tu consulta es en ${dias} días`,
    consultaTitulo: 'Cómo aprovechar mejor tu consulta',
    consultaDesc: 'Qué llevar, qué preguntar y cómo el resumen automático ahorra los primeros diez minutos.',
  },

  telaInsights: {
    ola: (nome: string) => `Hola, ${nome}`,
    pergunta: '¿Qué quieres\nentender hoy?',
    escreva: 'Escribe tu pregunta...',

    descobertaDaSemana: 'EL HALLAZGO DE LA SEMANA',
    entenderMelhor: 'Entender mejor',

    oQueMaisPercebi: 'Qué más noté',
    oQueMaisPercebiNota: 'Otras observaciones que encontré analizando tu recorrido.',
    verTodas: (quantas: number) => `Ver todas las observaciones (${quantas})`,

    observamos: 'LO QUE OBSERVAMOS',
    hojeDeCem: 'hoy, de 100',

    proximasAcoes: 'Próximos pasos',
    proximasAcoesNota: 'En el orden en que llegan. Sugerencias del día a día — la dosis y la medicación las decide quien te acompaña.',

    resumos: 'Resúmenes',
    resumosNota: 'Listos con tus registros, para que los leas y los lleves a la consulta.',
    disponivelDepois: 'disponible después de los primeros registros',

    resumoDaSemana: 'Resumen de la semana',
    resumoDaSemanaPronto: (periodo: string): string => `listo · ${periodo}`,
    resumoDaSemanaToda: 'cada lunes, una lectura de tu semana',
    resumoDaSemanaDesligado: 'desactivado',
    documento: 'Resumen para la consulta',
    documentoSub: 'documento con la evolución completa',
  },
  telaConversa: {
    ola: (nome: string) => `Hola, ${nome}`,
    ouvindo: 'Te escucho…',
    escrevaOuFale: 'Escribe o habla',
    pergunte: 'Pregunta sobre tu recorrido',
    novaConversa: 'Nueva conversación',
    assuntoApetite: 'Apetito',
    assuntoTratamento: 'Tratamiento',
    assuntoSintomas: 'Síntomas',
    assuntoExames: 'Exámenes',
    assuntoProgresso: 'Progreso',
    assuntoConsulta: 'Consulta',
    assuntoComeco: 'Primeros pasos',
    menu: 'Conversaciones y nueva conversación',
    fechar: 'Cerrar',
    irEvolucao: 'Ver tus pesajes',
    irSintomas: 'Ver tus síntomas',
    irAplicacoes: 'Ver tus aplicaciones',
    irAlimentacao: 'Ver tu alimentación',
    irAgua: 'Ver el agua de hoy',
    irExames: 'Ver tus exámenes',
    irResumo: 'Abrir el resumen para la consulta',
    irCheckin: 'Hacer el check-in de hoy',
    copiar: 'Copiar',
    copiado: 'Copiado',
    levarCurto: 'Llevar a la consulta',
    dataHoje: 'Hoy',
    dataOntem: 'Ayer',
    fecharMenu: 'Cerrar el menú',
    compartilhar: 'Compartir',
    /* a folha da seleção nativa (app/selecionar-texto) */
    selecionarTitulo: 'Seleccionar texto',
    /* o 👍 e o 👎 da resposta, e a folha do 👎 (app/avaliar-resposta) */
    curtir: 'Me sirvió la respuesta',
    naoCurtir: 'No me sirvió',
    obrigadoNota: 'Gracias por tu opinión',
    avaliarTitulo: '¿Qué no ayudó?',
    motivos: { errada: 'Información equivocada', 'nao-respondeu': 'No respondió lo que pregunté', tom: 'La forma de decirlo', arriscada: 'Me pareció riesgosa', outro: 'Otro motivo' } as Record<string, string>,
    avaliarAviso: 'Para mejorar, tu pregunta y esta respuesta nos llegan a nosotros. Nada más de la conversación ni de tus registros. Las guardamos hasta 12 meses.',
    avaliarEnviar: 'Enviar',
    avaliarCancelar: 'Ahora no',
    avaliado: 'Enviado, gracias',
    avaliarFalhou: 'No se pudo enviar ahora. Inténtalo más tarde.',
    avaliarSemConta: 'Inicia sesión en tu cuenta para calificar una respuesta.',
    levarConsulta: 'Llevar la pregunta a la consulta',
    naPauta: 'Anotado para la consulta',
    historico: 'Conversaciones anteriores',
    historicoTitulo: 'Conversaciones',
    grupoHoje: 'Hoy',
    grupoSemana: 'Últimos 7 días',
    grupoAntes: 'Antes',
    mensagens: (n: number): string => (n === 1 ? '1 mensaje' : `${n} mensajes`),
    apagar: 'Borrar',
    apagarPergunta: '¿Borrar esta conversación del teléfono?',
    cancelar: 'Cancelar',
    historicoVazio: 'Tus conversaciones con Morphi Intelligence se guardan aquí, en tu teléfono.',
    aceiteTitulo: 'Antes de empezar',
    aceitePergunta: '¿Permitir que Morphi Intelligence consulte tus datos de salud para ayudarte?',
    termosTitulo: 'Términos de uso',
    termosResumo: 'Lo que hace, lo que consulta, por dónde pasa y los límites',
    aceite1Titulo: 'Lo que hace',
    aceite1: 'Responde tus preguntas, escribe un resumen de tu semana cada lunes, lee las fotos del plato y los análisis que envíes y estima platos por el nombre.',
    aceite2Titulo: 'Lo que consulta',
    aceite2: 'Medicamento, peso, síntomas, comidas, agua, ejercicio y exámenes, y la foto o el análisis cuando lo envías. Tu nombre completo, tu correo y el nombre de quien te atiende quedan fuera.',
    aceite3Titulo: 'Por dónde pasa',
    aceite3: 'Va a nuestro servidor y a Anthropic, la empresa que provee la tecnología, en Estados Unidos, solo para generar la respuesta. Nada se queda con ellos, y los datos no se usan para entrenar modelos.',
    aceite4Titulo: 'Los límites',
    aceite4: 'Morphi Intelligence puede equivocarse y no reemplaza a quien te atiende. Dosis y medicamento, siempre con tu equipo. El resumen de la semana se apaga en el propio resumen.',
    politica: 'Leer la Política de Privacidad',
    aceitar: 'Permitir',
    recusar: 'Ahora no',
    aceiteRodape: 'Sin el permiso, las funciones de inteligencia artificial quedan apagadas. Puedes permitirlo cuando quieras.',
    semServidor: 'La conversación todavía no está activada en este dispositivo.',
    semRede: 'No pude responder ahora — la conexión falló. Inténtalo de nuevo en un momento.',
    semConta: 'Para conversar conmigo, entra en tu cuenta.',
    limiteDoDia: 'Llegaste al límite de preguntas de hoy. Mañana vuelvo a responder.',
    limiteDoMes: 'Llegaste al límite de 100 preguntas en 30 días. Vuelven poco a poco, a medida que los días más antiguos salen de la cuenta.',
    restam: (n: number): string => (n === 1 ? 'Queda 1 pregunta hoy' : `Quedan ${n} preguntas hoy`),
  },
};
