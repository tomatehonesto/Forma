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
};
