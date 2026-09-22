/* ============================================================
   EL TRATAMIENTO — la dosis, la cadencia, los hitos y las reglas · es-419

   ⚠️ Las razones viven en ../pt-BR/tratamento.ts. La que vale para el
   archivo entero: NINGUNA de estas palabras le pone nota a la persona. Los
   rótulos de ritmo y de existencias califican el NÚMERO, no a quien lo
   produjo.
   ============================================================ */

export const tratamento = {
  /* ⚠️ LA AUSENCIA TIENE FRASE PROPIA, y es corta a propósito: entra en
     medio de otras, como "Mounjaro todavía sin definir". */
  doseIndefinida: 'todavía sin definir',

  /* ⚠️ DOS LARGOS, Y ES A PROPÓSITO. La línea que abre una pantalla habla
     por extenso; la celda de una tabla de resumen médico no tiene ese
     ancho. Las dos tienen que seguir cortas para su lugar. */
  cadenciaSemanal: 'una vez por semana',
  cadenciaDiaria: 'uso diario',
  cadenciaOutra: (dias: number) => `cada ${dias} días`,
  cadenciaSemanalCurta: '1× por semana',
  cadenciaDiariaCurta: 'diaria',
  cadenciaOutraCurta: (dias: number) => `cada ${dias} días`,

  antesDaPrimeiraDose: 'Antes de la primera dosis',
  comecaAmanha: 'Empieza mañana',
  comecaEm: (dias: number) => `Empieza en ${dias} días`,
  /* ⚠️ "DÍA 71", Y NO "DÍA 71 DEL TRATAMIENTO". La línea donde aparece ya
     termina en "Semana 10", y las dos juntas solo pueden estar contando lo
     mismo. */
  diaDoTratamento: (dia: number) => `Día ${dia}`,

  /* ⚠️ RITMO NEGATIVO NO ES "RITMO MÁS LENTO". Quien subió de peso caía en
     el último rótulo, y la tarjeta decía "Ritmo más lento" en verde al lado
     de un número que subió. Lento y al revés son cosas distintas, y solo
     una de las dos es ritmo.

     ⚠️ Y ACELERADO NO ES MALO. Perder más de 1,5 kg por semana es motivo
     para conversar con el equipo — masa magra, hidratación —, y no un
     error que la persona cometió. La palabra no puede sonar a reto. */
  ritmoAcimaDoInicio: 'Arriba del inicio',
  ritmoSaudavel: 'En ritmo saludable',
  ritmoAcelerado: 'Ritmo acelerado',
  ritmoLento: 'Ritmo más lento',

  /* Tres grados, y el del medio es el que más aparece: "vale renovar" es
     un aviso con semanas de anticipación, no una alarma. */
  estoqueUrgente: 'Renueva ahora',
  estoqueRenovar: 'Vale renovar la receta',
  estoqueEmDia: 'Existencias al día',

  /* ⚠️ EL LADO VA ABREVIADO Y ENTRE PARÉNTESIS porque estos rótulos
     aparecen dentro de líneas cortas — historial, sugerencia del día,
     resumen de la semana. "Abdomen lado izquierdo" no cabe en ninguna. */
  locais: {
    'abd-e': 'Abdomen (izq.)',
    'abd-d': 'Abdomen (der.)',
    'coxa-e': 'Muslo (izq.)',
    'coxa-d': 'Muslo (der.)',
    'braco-e': 'Brazo (izq.)',
    'braco-d': 'Brazo (der.)',
  },

  marcos: {
    inicio: 'Inicio del tratamiento',
    doseAjustada: (dose: string) => `Dosis ajustada a ${dose} mg`,
    /* ⚠️ "SEGÚN INDICACIÓN MÉDICA" es lo que impide que la línea parezca
       que la aplicación ajustó algo. Ella registra; quien ajusta es quien
       receta. */
    titulacao: 'Titulación según indicación médica',
    cincoPorCento: '5% del peso inicial',
    /* ⚠️ "MÁS ALLÁ DE LA BALANZA" es el centro: el 5% es la marca a partir
       de la cual la literatura muestra ganancia en presión, glucemia y
       triglicéridos. Sin esa mitad, la línea es un número de peso más. */
    cincoPorCentoSub: 'Marca clínica, con beneficios más allá de la balanza',
    consulta: (tipo: string) => `Consulta ${tipo}`,
    marcadoresImportados: (quantos: number) => `${quantos} marcadores importados`,
  },

  /* ⚠️ SON LOS NOMBRES DE LA CLASIFICACIÓN, y no adjetivos elegidos por
     nosotros. "Obesidad grado I" es el término del informe; cambiarlo por
     algo más suave desalinearía la aplicación de lo que la persona lee en
     el examen y en la consulta. Donde entra el cuidado es en el TONO del
     color, que es decisión de pantalla. */
  imc: {
    abaixo: 'Bajo peso',
    normal: 'Peso normal',
    sobrepeso: 'Sobrepeso',
    grau1: 'Obesidad grado I',
    grau2: 'Obesidad grado II',
    grau3: 'Obesidad grado III',
  },

  /* ⚠️ NINGUNO DE LOS CINCO ES SOBRE APARIENCIA SOLA, y "Cómo me veo" es
     lo más cerca de eso a propósito: la frase es de la persona sobre sí
     misma, no de la aplicación sobre su cuerpo. "Adelgazar para verse
     bien" sería otro producto. */
  motivos: {
    saude: 'Salud',
    saudeSub: 'Exámenes, presión, glucemia',
    energia: 'Energía',
    energiaSub: 'Ánimo en el día',
    espelho: 'Cómo me veo',
    espelhoSub: 'En el espejo y en las fotos',
    confianca: 'Confianza',
    confiancaSub: 'Sentirme bien conmigo',
    medico: 'Indicación médica',
    medicoSub: 'Me lo indicó quien me acompaña',
  },

  /* ⚠️ EL SUBTÍTULO ES LO QUE HACE QUE EL ESCALÓN SIGNIFIQUE ALGO. Sin "1
     a 3 días por semana", "levemente activo" es autoevaluación, y cada
     persona se pone en un escalón distinto — sobre un número que va a
     volverse su meta de proteína. */
  atividades: {
    sedentario: 'Sedentario',
    sedentarioSub: 'Poco o nada de ejercicio',
    leve: 'Levemente activo',
    leveSub: '1 a 3 días por semana',
    moderado: 'Moderadamente activo',
    moderadoSub: '3 a 5 días por semana',
    muito: 'Muy activo',
    muitoSub: '6 a 7 días por semana',
  },
};
