/* ============================================================
   UNITS OF MEASURE — the words, not the symbols · en-US

   ⚠️ Reasons live in ../pt-BR/medidas.ts. Only what's read out loud
   belongs here; "kg", "cm", "oz" and "ml" are international symbols and
   stay in the code.
   ============================================================ */

export const medidas = {
  metrico: 'Metric',
  imperial: 'Imperial',
  unidadesMetrico: 'kilograms, meters, centimeters and liters',
  unidadesImperial: 'pounds, feet, inches and ounces',

  /* ⚠️ The seven body markers live here and only here — they used to be
     written in two places. See ../pt-BR/medidas. */
  corpo: {
    peso: 'Weight',
    cintura: 'Waist',
    quadril: 'Hips',
    braco: 'Arm',
    coxa: 'Thigh',
    gordura: 'Body fat',
    massaMagra: 'Lean mass',
  },

  tela: {
    periodo12s: '12 weeks',
    periodo3m: '3 months',
    periodoTudo: 'All',

    mesmoJeitoTitulo: 'Measure the same way every time',
    mesmoJeitoTexto: 'Same time of day, no tight clothes, tape flat against the skin without pulling. Comparing two measurements only works if both were taken the same way.',

    notaManha: 'morning',

    vazioTitulo: (nome: string) => `No ${nome.toLowerCase()} logged yet`,
    vazioDaBalanca: 'This one comes from a body-composition scale, and no reading has come in yet.',
    vazioRegistre: 'Log the first one to start following it.',

    lead: (data: string, inicial: string, unidade: string) =>
      `Logged on ${data} · ${inicial} ${unidade} at the start of treatment`,
    subCurva: (periodo: string, quantos: number) =>
      `${periodo.toLowerCase()}${quantos > 1 ? ` · ${quantos} entries` : ''}`,

    registros: 'Entries',
    notaLeitura: 'Readings from a body-composition scale. Nothing to fix here — they come in complete.',
    notaCorrigir: 'Tap to fix or delete. Whatever is here goes into the report for your doctor.',
  },

  telaEvolucao: {
    titulo: 'Progress',
    lead: 'Twelve weeks of treatment. Tap a marker to see its history and fix entries.',

    voceRegistra: 'You log these',
    voceRegistraNota: 'Markers that depend only on you — tap to see the history and fix entries.',

    vemDeExame: 'These come from a lab',
    vemDeExameNota: 'They need a lab report or a body-composition scale. Read only — but each one opens its own history.',

    pressao: 'Blood pressure',
    emQueda: 'Coming down',
    emAlta: 'Going up',
    estavel: 'Steady',
    pressaoValor: (sistolica: number, diastolica: number) => `${sistolica}/${diastolica}`,

    todosOsExames: 'All lab results',
    todosOsExamesSub: 'Reports, reference ranges and the full history',
  },

  telaSinaisVitais: {
    titulo: 'Vital signs',
    lead: 'Numbers that improve along with weight — and that the scale alone doesn’t show.',

    aoLongoDoTempo: 'Followed over time',
    pressaoArterial: 'Blood pressure',
    pressaoSub: (inicial: string, medicoes: number) =>
      `${inicial} at the start · ${medicoes} readings`,
    glicemiaDeJejum: 'Fasting glucose',
    glicemiaSub: (inicial: number, medicoes: number) =>
      `${inicial} mg/dL at the start · ${medicoes} readings`,

    ultimaLeitura: 'Latest reading',
    ultimaLeituraNota: 'A single point: these numbers say whether you’re inside the range, not where you’re heading.',
    pontuais: {
      fc: 'Heart rate',
      spo2: 'O₂ saturation',
      fr: 'Breathing rate',
      glic: 'Glucose',
    },
    seloNormal: 'normal',
    seloBaixo: 'low',
    seloAlto: 'high',

    deOndeVem: 'Where they come from',
    aparelhosEContas: 'Devices and accounts',
    aparelhosEContasSub: 'See what can be connected today, and what’s still to come',

    naoSeDigitam: 'These numbers aren’t typed in',
    naoSeDigitamTexto: 'Blood pressure, saturation and heart rate arrive from a connected device — and that link doesn’t exist in this version yet. A lab result comes in through Lab results.',
  },
};
