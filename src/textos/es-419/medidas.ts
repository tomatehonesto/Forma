/* ============================================================
   UNIDADES DE MEDIDA — las palabras, no los símbolos · es-419

   ⚠️ Las razones viven en ../pt-BR/medidas.ts. Aquí solo entra lo que se
   lee en voz alta: "kg", "cm", "oz" y "ml" son símbolos internacionales y
   se quedan en el código.
   ============================================================ */

export const medidas = {
  metrico: 'Métrico',
  imperial: 'Imperial',
  unidadesMetrico: 'kilos, metros, centímetros y litros',
  unidadesImperial: 'libras, pies, pulgadas y onzas',

  /* ⚠️ Los siete marcadores del cuerpo viven aquí, y solo aquí — estaban
     escritos en dos lugares. Ver ../pt-BR/medidas. */
  corpo: {
    peso: 'Peso',
    cintura: 'Cintura',
    quadril: 'Cadera',
    braco: 'Brazo',
    coxa: 'Muslo',
    gordura: 'Grasa corporal',
    massaMagra: 'Masa magra',
  },
  pontosPercentuais: 'pp',

  tela: {
    periodo12s: '12 semanas',
    periodo3m: '3 meses',
    periodoTudo: 'Todo',

    mesmoJeitoTitulo: 'Medir siempre de la misma forma',
    mesmoJeitoTexto: 'A la misma hora del día, sin ropa apretada y con la cinta pegada a la piel, sin apretar. La comparación entre dos medidas solo vale si las dos se hicieron igual.',

    notaManha: 'mañana',

    vazioTitulo: (nome: string) => `Ningún registro de ${nome.toLowerCase()}`,
    vazioDaBalanca: 'Esta medida viene de la balanza de bioimpedancia, y todavía no llegó ninguna.',
    vazioRegistre: 'Registra la primera para empezar a seguirla.',

    lead: (data: string, inicial: string, unidade: string) =>
      `Registrado el ${data} · ${inicial} ${unidade} al inicio del tratamiento`,
    subCurva: (periodo: string, quantos: number) =>
      `${periodo.toLowerCase()}${quantos > 1 ? ` · ${quantos} registros` : ''}`,

    registros: 'Registros',
    notaLeitura: 'Lecturas de la balanza de bioimpedancia. No hay nada que corregir aquí — llegan listas.',
    notaCorrigir: 'Toca para corregir o borrar. Lo que esté aquí va al informe de tu médico.',
  },

  telaEvolucao: {
    titulo: 'Evolución',
    lead: 'Toca un marcador para ver el historial y corregir registros.',

    voceRegistra: 'Los que registras tú',
    voceRegistraNota: 'Marcadores que dependen solo de ti — toca para ver el historial y corregir registros.',

    vemDeExame: 'Vienen de un examen',
    vemDeExameNota: 'Necesitan informe de laboratorio o balanza de bioimpedancia. Solo lectura — pero cada uno abre su historial.',
    medidasConvite: 'Cintura, cadera, brazo y muslo',
    medidasConviteSub: 'Cambian cuando la balanza se estanca. Registra las primeras.',

    pressao: 'Presión',
    emQueda: 'Bajando',
    emAlta: 'Subiendo',
    estavel: 'Estable',
    pressaoValor: (sistolica: number, diastolica: number) => `${sistolica}/${diastolica}`,

    todosOsExames: 'Todos los exámenes',
    todosOsExamesSub: 'Informes, rangos de referencia e historial completo',
  },

  telaSinaisVitais: {
    titulo: 'Signos vitales',
    lead: 'Indicadores que mejoran junto con el peso — y que la balanza sola no muestra.',

    aoLongoDoTempo: 'Seguidos a lo largo del tiempo',
    pressaoArterial: 'Presión arterial',
    pressaoSub: (inicial: string, medicoes: number) =>
      `${inicial} al inicio · ${medicoes} mediciones`,
    glicemiaDeJejum: 'Glucemia en ayunas',
    glicemiaSub: (inicial: number, medicoes: number) =>
      `${inicial} mg/dL al inicio · ${medicoes} mediciones`,

    ultimaLeitura: 'Última lectura',
    ultimaLeituraNota: 'Medida puntual: estos números dicen si estás dentro del rango, no hacia dónde vas.',
    pontuais: {
      fc: 'Frec. cardíaca',
      spo2: 'Saturación O₂',
      fr: 'Frec. respiratoria',
      glic: 'Glucemia',
    },
    seloNormal: 'normal',
    seloBaixo: 'bajo',
    seloAlto: 'alto',

    deOndeVem: 'De dónde vienen',
    aparelhosEContas: 'Aparatos y cuentas',
    aparelhosEContasSub: 'Ver qué se puede conectar hoy, y qué todavía está por venir',

    naoSeDigitam: 'Estos números no se escriben a mano',
    naoSeDigitamTexto: 'Presión, saturación y frecuencia llegan de un aparato conectado — y esa conexión todavía no existe en esta versión. Un resultado de laboratorio entra por Exámenes.',
  },
  telaRegistro: {
    sub: (data: string) => `${data} · registrado por ti`,
    valor: 'Valor',
    dataEHora: 'Fecha y hora',
    semana: 'Semana',
    semanaDoTratamento: (n: number) => `Semana ${n} del tratamiento`,
    corrigir: 'Corregir registro',
    apagar: 'Borrar',
    apagarTira: 'Borrar quita el registro del gráfico y del informe de tu médico.',
  },
  telaMedir: {
    tituloPeso: '¿Cuánto pesas?',
    desdeOUltimo: (sinal: string, v: string) => `${sinal}${v} desde el último`,
    salvar: (v: string) => `Guardar ${v}`,
    tituloMedidas: '¿Cuáles son tus medidas?',
    abremNaUltima: 'las reglas abren en la última medición',
    oQueMediu: 'Qué mediste',
    nenhumaObrigatoria: 'Ninguna es obligatoria. Medir solo la cintura es un registro tan bueno como medir las cuatro.',
    desdeAUltima: (sinal: string, v: string) => `${sinal}${v} desde la última`,
    registrar: (n: number): string => (n === 1 ? 'Registrar la medida' : 'Registrar las medidas'),
    unidadesTitulo: 'Unidades de medida',
    unidadesSub: 'Solo cambia cómo se muestran los números.',
    comoLe: 'Cómo lees las medidas',
    mesmasUnidades: 'La dosis del medicamento sigue en miligramos, y la proteína en gramos — son las mismas unidades en los dos sistemas.',
  },
};
