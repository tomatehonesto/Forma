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
    lead: 'Doce semanas de tratamiento. Toca un marcador para ver el historial y corregir registros.',

    voceRegistra: 'Los que registras tú',
    voceRegistraNota: 'Marcadores que dependen solo de ti — toca para ver el historial y corregir registros.',

    vemDeExame: 'Vienen de un examen',
    vemDeExameNota: 'Necesitan informe de laboratorio o balanza de bioimpedancia. Solo lectura — pero cada uno abre su historial.',

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
};
