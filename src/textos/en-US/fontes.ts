/* ============================================================
   SOURCES — where each number in the app comes from · en-US

   ⚠️ Reasons live in ../pt-BR/fontes.ts. The one that matters: THE PAPER
   TITLES ARE NOT TRANSLATED AND ARE NOT HERE. They are the names of
   published work, and whoever taps the badge will search for those exact
   words. They live in logic/fontes with the URL and the year.
   ============================================================ */

export const fontes = {
  sustenta: {
    acompanha: 'What this app tracks: protein, movement, water and symptoms',
    imc: 'The BMI ranges',
    plato: 'When weight loss usually levels off',
    proteina: 'The protein goal per kilo of body weight',
    ritmo: 'The safe pace of loss and the calorie floor',
    curva: 'The shape of the curve: fast at first, easing later',
    agua: 'The water goal per kilo, and how it varies with age',
    fibra: 'The fiber goal per thousand calories',
    gasto: 'The estimate of daily expenditure (Mifflin-St Jeor)',
    equacao: 'The choice of this equation among the available ones',
  },

  /* ⚠️ ONLY THE ONES THAT HAVE AN ENGLISH FORM. The journals — Clinical
     Obesity, Metabolites, New England Journal of Medicine — are proper
     names and live in logic/fontes. */
  onde: {
    harvard: 'Harvard T.H. Chan School of Public Health, on two papers in JAMA Internal Medicine',
    oms: 'World Health Organization',
    nhs: 'NHS — the United Kingdom’s public health service',
    academy: 'Academy of Nutrition and Dietetics',
  },

  /* ⚠️ THE BADGE ABBREVIATION CHANGES TOO: the same institution the
     Portuguese calls 'OMS' is 'WHO' here. */
  siglaOms: 'WHO',
  siglaNhs: 'NHS - United Kingdom',

  tituloMifflin: 'Mifflin-St Jeor: resting energy expenditure equation, in the Academy’s evidence analysis',
};
