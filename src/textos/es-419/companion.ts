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
    desdeAPrimeira: (dias: number) =>
      `Acompaño tu tratamiento desde la primera dosis, hace ${dias} días.`,
    desdeOPrimeiroDiaComSemanas: (semanas: number) =>
      `Conozco tu recorrido desde el primer día — ${semanas} semanas hasta aquí.`,
    desdeOPrimeiroDia: 'Conozco tu recorrido desde el primer día.',
    dosesAtras: (doses: number) =>
      `Estoy contigo desde la primera dosis, hace ${doses} dosis.`,
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
    proximasAcoesNota: 'En el orden en que necesitan pasar — nunca sobre dosis ni protocolo.',

    resumos: 'Armar resúmenes',
    resumosNota: 'Tus datos ordenados para llevar a alguien.',

    resumoDaSemana: 'Resumen de la semana',
    resumoDaSemanaSub: (semana: number, checkins: number, peso: string) =>
      `semana ${semana} · ${checkins} ${checkins === 1 ? 'check-in' : 'check-ins'}, ${peso}`,
    preparoDaConsulta: 'Preparación de la consulta',
    preparoDaConsultaSub: 'peso, adherencia, síntomas y preguntas',
    preparoSemEquipe: 'listo para compartir',
    documento: 'Resumen para la consulta',
    documentoSub: 'documento con la evolución completa',
  },
};
