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
    vazioDaBalanca: 'This one comes from a body-composition scale, and none has arrived yet.',
    vazioRegistre: 'Log the first one to start following it.',

    lead: (data: string, inicial: string, unidade: string) =>
      `Logged on ${data} · ${inicial} ${unidade} at the start of treatment`,
    subCurva: (periodo: string, quantos: number) =>
      `${periodo.toLowerCase()}${quantos > 1 ? ` · ${quantos} entries` : ''}`,

    registros: 'Entries',
    notaLeitura: 'Readings from a body-composition scale. Nothing to fix here — they arrive finished.',
    notaCorrigir: 'Tap to fix or delete. Whatever is here goes into the report for your doctor.',
  },
};
