/* ============================================================
   LAS FUENTES — de dónde sale cada número de la aplicación · es-419

   ⚠️ Las razones viven en ../pt-BR/fontes.ts. La que manda: EL TÍTULO DEL
   ARTÍCULO NO SE TRADUCE, y no está aquí. "Once-Weekly Semaglutide in
   Adults with Overweight or Obesity" es el nombre de un trabajo
   publicado, y traducirlo lo volvería imposible de encontrar — quien toque
   el sello va a buscar esas palabras. Los títulos se quedan en
   logic/fontes, con la URL y el año.

   Aquí solo están las dos frases que son nuestras: lo que ese trabajo
   SOSTIENE en la aplicación, y el nombre de quien lo publicó cuando ese
   nombre se dice en español.
   ============================================================ */

export const fontes = {
  sustenta: {
    acompanha: 'Lo que esta aplicación acompaña: proteína, movimiento, agua y síntomas',
    imc: 'Los rangos de IMC',
    plato: 'Cuándo suele estabilizarse la pérdida',
    proteina: 'La meta de proteína por kilo de peso',
    ritmo: 'El ritmo seguro de pérdida y el piso de calorías',
    curva: 'La forma de la curva: rápida al principio, más lenta después',
    agua: 'La meta de agua por kilo, y la variación por edad',
    fibra: 'La meta de fibra por cada mil kilocalorías',
    gasto: 'La estimación de gasto del día (Mifflin-St Jeor)',
    equacao: 'La elección de esta ecuación entre las disponibles',
  },

  /* ⚠️ SOLO LOS QUE SE DICEN EN ESPAÑOL. Las revistas — Clinical Obesity,
     Metabolites, New England Journal of Medicine — son nombres propios y
     se quedan en logic/fontes, junto al título y la URL. */
  onde: {
    harvard: 'Harvard T.H. Chan School of Public Health, sobre dos artículos de JAMA Internal Medicine',
    oms: 'Organización Mundial de la Salud',
    nhs: 'NHS — servicio público de salud del Reino Unido',
    academy: 'Academy of Nutrition and Dietetics',
  },

  /* ⚠️ LA SIGLA DEL SELLO TAMBIÉN CAMBIA. 'OMS' se lee como palabra en
     toda América Latina y nadie necesita expandirla; en inglés la misma
     institución es 'WHO'. */
  siglaOms: 'OMS',
  siglaNhs: 'National Health Service - UK',

  tituloMifflin: 'Mifflin-St Jeor: ecuación de gasto energético en reposo, en el análisis de evidencia de la Academy',
};
