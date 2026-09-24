/* ============================================================
   LA RUTINA — el protocolo, las sugerencias, la preparación y lo que pasó · es-419

   ⚠️ Las razones viven en ../pt-BR/rotina.ts.
   ============================================================ */

export const rotina = {
  /* ⚠️ LA PREGUNTA SUGERIDA ES LA PUERTA DE ENTRADA DE LA IA. Si viene
     genérica — "¿Cómo va mi evolución?", siempre —, la inteligencia no se
     prueba.

     ⚠️ Y SON PREGUNTAS DE ELLA, NO OFERTAS NUESTRAS. "¿Por qué sentí más
     hambre hoy?" es como alguien piensa; "Entiende el retorno del hambre"
     es como habla un menú. La primera persona es lo que hace que la lista
     parezca conversación. */
  perguntas: {
    maisFome: '¿Por qué sentí más hambre hoy?',
    semFome: '¿Por qué no tengo hambre?',
    depoisDaAplicacao: '¿Qué esperar después de la inyección?',
    diminuirEnjoo: '¿Cómo disminuir las náuseas?',
    trocarODia: '¿Puedo cambiar el día de la inyección?',
    meusExames: '¿Qué muestran mis exámenes?',
    meuProgresso: 'Analiza mi progreso',
    prepararConsulta: 'Prepara mi consulta',
  },

  /* ⚠️⚠️ EL IMPERATIVO AQUÍ ES A PROPÓSITO — "Toma más agua hoy mismo",
     "Pide la renovación". En una revisión buscando texto que le reclame a
     la persona, esta lista aparece entera y parece el peor hallazgo de la
     aplicación; no lo es.

     Reclamo es la aplicación juzgando lo que ya pasó. Esto es el formato de
     una lista de tareas, y es lo que la persona abrió la pantalla para ver:
     vino preguntando qué hacer. Cambiarlo por sustantivo — "un vaso más
     hoy" — no vuelve el texto más amable, vuelve la sugerencia más tímida,
     y una sugerencia tímida en una lista de cuatro se vuelve decoración.

     ⚠️ LO QUE NO PUEDE SER IMPERATIVO ES EL `porque`: ahí vive el hecho, y
     un hecho con verbo de orden se vuelve sermón. El de arriba manda, el de
     abajo explica. */
  empurroes: {
    agua: 'Toma más agua hoy mismo',
    /* ⚠️ EL MOTIVO ERA UN DÉFICIT CON EL NOMBRE DE LA PERSONA ADELANTE.
       "Estás abajo de la mitad de la meta" pone al sujeto en el lugar de
       quien falló. Lo que falta de agua es hecho del día, no defecto de
       carácter. */
    aguaPorqueComEnjoo: 'En tus días bien hidratados las náuseas aparecen menos — y el día todavía está en la mitad de la meta',
    aguaPorque: 'El día todavía está en la mitad de la meta, y el agua sostiene la saciedad hasta el final',

    proteina: 'Refuerza la proteína en la cena',
    proteinaPorque: 'Estás en la fase del ciclo en que el hambre vuelve, y la proteína de hoy aparece en el hambre de mañana',

    checkin: 'Haz el check-in de hoy',
    checkinPorque: 'Es el registro que alimenta todo lo que logro ver sobre ti',

    /* El recipiente y el artículo vienen de logic/formas: "Separa la
       pluma", "Separa el frasco". */
    aplicacao: (recipiente: string) => `Separa ${recipiente} y elige el lugar`,
    aplicacaoPorque: 'La inyección de la semana está llegando, y alternar el lugar reduce la irritación en la piel',

    receita: 'Pide la renovación de la receta',
    /* ⚠️ La palabra "doses" vivía en el sitio de llamada. Ver ../pt-BR. */
    receitaPorque: (doses: number, onde: string) =>
      `${doses === 1 ? 'Queda' : 'Quedan'} ${doses} ${doses === 1 ? 'dosis' : 'dosis'} ${onde} — pidiéndola ahora, llega antes de que se acabe`,

    examePorque: 'Está abierto en el protocolo de esta semana, y el resultado suele demorar algunos días',

    consulta: 'Prepara tus preguntas para la consulta',
    consultaPorque: (tipo: string, doutor: string) =>
      `${tipo} con ${doutor} — yo armo el resumen, tú eliges qué quieres preguntar`,
  },

  /* ⚠️ EL RÓTULO DEL GRUPO SALE DEL PLAZO, Y EL PLAZO SALE DEL DATO. "Esta
     semana: agendar examen" es lista de tareas; "En 9 días: prepara las
     preguntas" es alguien organizando la agenda de otra persona. */
  prazo: {
    hoje: 'Hoy',
    amanha: 'Mañana',
    estaSemana: 'Esta semana',
    daquiA: (dias: number) => `En ${dias} días`,
  },

  /* ⚠️ ESTAS FRASES SON LO QUE LA CLÍNICA PRESCRIBE, y el registro es más
     formal que el del resto de la aplicación por eso. "Ejercitarse", y no
     "moverse": lo informal servía cuando la meta era un empujón; en una
     lista al lado de dosis y proteína, desentona. */
  protocolo: {
    aguaTodoDia: (quanto: string) => `Tomar ${quanto} todos los días`,
    aguaEmDias: (quanto: string, dias: number) => `Tomar ${quanto} en ${dias} días`,
    origemAgua: 'Hidratación',

    proteinaTodoDia: (gramas: number) => `Comer ${gramas} g de proteína todos los días`,
    proteinaEmDias: (gramas: number, dias: number) => `Comer ${gramas} g de proteína en ${dias} días`,
    origemProteina: 'Alimentación',

    /* Días CON MOVIMIENTO, y no minutos: es lo que el ítem pide — moverse
       tres veces —, y es lo que el registro sabe decir sin adivinar la
       modalidad. */
    exercicio: (dias: number) => `Ejercitarse en ${dias} ${dias === 1 ? 'día' : 'días'} de la semana`,
    origemExercicio: 'Ejercicio',

    aplicacaoUma: 'Inyección de la semana',
    aplicacaoVarias: (quantas: number) => `${quantas} inyecciones en la semana`,
    origemAplicacao: 'Inyecciones',

    /* Lo que se cuenta en cada tarea. "1 de 1 día" no describe una
       inyección, por eso la aplicación trae su propio par. */
    unidadeDia: ['día', 'días'] as [string, string],
    unidadeAplicacao: ['inyección', 'inyecciones'] as [string, string],
    nota: (feito: number, alvo: number, unidade: string) => `${feito} de ${alvo} ${unidade}`,
  },

  /* ⚠️ EL RESUMEN DE CADA META DICE EL PROMEDIO, y no si se cumplió. La
     semana ya pasó; reclamar lo que ya no se puede cambiar no le sirve a
     nadie. "Sin registro en la semana" es lo que se dice cuando no hay nada
     que decir — y es distinto de cero. */
  semanas: {
    aguaMeta: (quanto: string) => `Tomar ${quanto} todos los días`,
    proteinaMeta: (gramas: number) => `Comer ${gramas} g de proteína todos los días`,
    exercicioMeta: (dias: number) => `Ejercitarse en ${dias} días de la semana`,
    semRegistro: 'sin registro en la semana',
    mediaDeAgua: (quanto: string) => `promedio de ${quanto} por día`,
    mediaDeProteina: (gramas: number) => `promedio de ${gramas} g por día`,
    minutosNaSemana: (minutos: number) => `${minutos} min en la semana`,
    semMovimento: 'ningún movimiento registrado',
  },

  /* ⚠️ CADA ÍTEM TIENE DOS TÍTULOS, y la diferencia entre ellos es lo que
     el bloque hace: listo, NOMBRA lo que ya existe ("Peso al día");
     pendiente, dice qué HACER ("Pesarse antes"). La misma línea, dos
     verbos, y la persona lee la lista de un vistazo sabiendo qué falta. */
  preparo: {
    pesoNenhum: 'Registrar el peso',
    pesoNenhumSub: 'Ningún pesaje todavía',
    pesoEmDia: 'Peso al día',
    pesoAntigo: 'Pesarse antes',
    pesoAntigoSub: (quando: string) => `Último pesaje ${quando}`,
    pesoSub: (peso: string, quando: string) => `${peso} · ${quando}`,

    notasProntas: 'Dudas anotadas',
    notasProntasSub: (quantas: number) => `${quantas} para llevar`,
    notasVazias: 'Anotar dudas',
    notasVaziasSub: 'Nada anotado todavía',

    examesRecentes: 'Exámenes recientes',
    examesRecentesSub: (nome: string, quando: string) => `${nome} · ${quando}`,
    exames: 'Exámenes',
    examesAntigosSub: (quando: string) => `El último fue ${quando}`,
    examesNenhumSub: 'Ningún examen guardado',
  },

  /* ⚠️ LA MISMA FRASE EN TODAS LAS LÍNEAS DE LA PREPARACIÓN, para que el
     ojo compare las fechas en vez de traducirlas. "hace un mes" y no "hace
     1 mes": el número por extenso cuando es uno solo es como se habla. */
  quando: {
    hoje: 'hoy',
    ontem: 'ayer',
    haDias: (dias: number) => `hace ${dias} días`,
    haUmMes: 'hace un mes',
    haMeses: (meses: number) => `hace ${meses} meses`,
  },

  periodo: {
    pesoEstavel: 'Peso estable',
    pesoDe: (de: string, para: string) => `De ${de} a ${para}`,
    doseNova: (dose: string) => `Dosis a ${dose} mg`,
    doseAnterior: (dose: string) => `Venía de ${dose} mg`,
    umaAplicacao: '1 inyección',
    aplicacoes: (quantas: number) => `${quantas} inyecciones`,
    marcadores: (quantos: number) => `${quantos} marcadores`,
    umaOrientacao: '1 indicación del equipo',
    orientacoes: (quantas: number) => `${quantas} indicaciones del equipo`,
    consultaSemTipo: 'Consulta',
  },

  /* ⚠️ "TÚ" ES RÓTULO Y CENTINELA A LA VEZ. Un entrenamiento sin `fonte`
     grabada es manual — manual es lo que existía antes de que hubiera
     origen —, y la pantalla nunca muestra la ausencia: muestra "Tú", porque
     la ausencia no responde "quién registró esto", responde "no sé". */
  origemManual: 'Tú',

  selo: {
    passou: 'pasó',
    agora: 'ahora',
    amanha: 'mañana',
    emDias: (dias: number) => `en ${dias} días`,
  },
};
