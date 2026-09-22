/* ============================================================
   TREATMENT — the dose, the cadence, the milestones and the scales · en-US

   ⚠️ Reasons live in ../pt-BR/tratamento.ts. What they share: these are
   the words that describe the treatment itself, and almost all of them
   appear on more than one screen.

   ⚠️ NONE OF THEM GRADES THE PERSON. The pace and supply labels qualify
   the NUMBER, not whoever produced it.
   ============================================================ */

export const tratamento = {
  /* ⚠️ The KEY is the Portuguese name and never changes — it is what
     `MEDS[x].mol` stores and what `faixaDaMolecula` compares. Only the
     value below is the screen. See ../pt-BR/tratamento. */
  molecula: {
    'Tirzepatida': 'Tirzepatide',
    'Semaglutida': 'Semaglutide',
    'Dulaglutida': 'Dulaglutide',
    'Liraglutida': 'Liraglutide',
    '—': '—',
  } as Record<string, string>,

  /* ⚠️ THE ABSENCE HAS ITS OWN PHRASE, short on purpose: it lands inside
     other sentences, as in "Mounjaro not set yet". */
  doseIndefinida: 'not set yet',

  /* ⚠️ TWO LENGTHS, ON PURPOSE. A screen's opening line spells it out; a
     cell in the medical summary table has no such width. Keep both short
     enough for where they go — the short one sits next to a number. */
  cadenciaSemanal: 'once a week',
  cadenciaDiaria: 'daily',
  cadenciaOutra: (dias: number) => `every ${dias} days`,
  cadenciaSemanalCurta: '1×/week',
  cadenciaDiariaCurta: 'daily',
  cadenciaOutraCurta: (dias: number) => `every ${dias} days`,

  /* Before it starts there is a countdown; after, the day. */
  antesDaPrimeiraDose: 'Before your first dose',
  comecaAmanha: 'Starts tomorrow',
  comecaEm: (dias: number) => `Starts in ${dias} days`,
  /* ⚠️ "DAY 71", NOT "DAY 71 OF TREATMENT". The line this sits on already
     ends in "Week 10", and the two together can only be counting the same
     thing. */
  diaDoTratamento: (dia: number) => `Day ${dia}`,

  /* ⚠️ NEGATIVE PACE IS NOT "SLOWER PACE". Someone who gained weight fell
     into the last label, and the card said "Slower pace" in green next to
     a number that went up. Slow and backwards are different things, and
     only one of them is a pace.

     ⚠️ AND FASTER IS NOT BAD. Losing more than three pounds a week is a
     reason to talk to the care team — lean mass, hydration — not a
     mistake the person made. The word can't sound like a scolding. */
  ritmoAcimaDoInicio: 'Above your starting weight',
  ritmoSaudavel: 'Healthy pace',
  ritmoAcelerado: 'Faster pace',
  ritmoLento: 'Slower pace',

  /* Three degrees, and the middle one shows up most: "worth refilling" is
     a heads-up weeks in advance, not an alarm. */
  estoqueUrgente: 'Refill now',
  estoqueRenovar: 'Worth refilling your prescription',
  estoqueEmDia: 'Supply on track',

  /* ⚠️ THE SIDE IS ABBREVIATED IN PARENTHESES because these labels appear
     inside short lines — history, the day's suggestion, the weekly
     summary. "Left side of the abdomen" fits in none of them. */
  locais: {
    'abd-e': 'Abdomen (left)',
    'abd-d': 'Abdomen (right)',
    'coxa-e': 'Thigh (left)',
    'coxa-d': 'Thigh (right)',
    'braco-e': 'Arm (left)',
    'braco-d': 'Arm (right)',
  },

  marcos: {
    inicio: 'Treatment started',
    doseAjustada: (dose: string) => `Dose adjusted to ${dose} mg`,
    /* ⚠️ "AS DIRECTED BY YOUR PRESCRIBER" is what keeps the line from
       sounding like the app adjusted something. It records; the person
       who prescribes adjusts. */
    titulacao: 'Titration as directed by your prescriber',
    cincoPorCento: '5% of starting weight',
    /* ⚠️ "BEYOND THE SCALE" is the heart of it: 5% is the mark from which
       the literature shows gains in blood pressure, glucose and
       triglycerides. Without that half, the line is just another weight
       number. */
    cincoPorCentoSub: 'A clinical mark, with benefits beyond the scale',
    consulta: (tipo: string) => `${tipo} appointment`,
    marcadoresImportados: (quantos: number) => `${quantos} markers imported`,
  },

  /* ⚠️ THESE ARE THE NAMES OF THE CLASSIFICATION, not adjectives we chose.
     "Class I obesity" is the term on the report; softening it would put
     the app out of step with what the person reads at the lab and hears
     at the appointment. Where care comes in is the TONE of the color,
     which is a screen decision. */
  imc: {
    abaixo: 'Underweight',
    normal: 'Normal weight',
    sobrepeso: 'Overweight',
    grau1: 'Class I obesity',
    grau2: 'Class II obesity',
    grau3: 'Class III obesity',
  },

  /* ⚠️ NONE OF THE FIVE IS ABOUT APPEARANCE ALONE, and "How I see myself"
     is the closest on purpose: the sentence is the person's about
     themselves, not the app's about their body. */
  motivos: {
    saude: 'Health',
    saudeSub: 'Labs, blood pressure, glucose',
    energia: 'Energy',
    energiaSub: 'Getting through the day',
    espelho: 'How I see myself',
    espelhoSub: 'In the mirror and in photos',
    confianca: 'Confidence',
    confiancaSub: 'Feeling good in my own skin',
    medico: 'Medical advice',
    medicoSub: 'It came from whoever follows my care',
  },

  /* ⚠️ THE SUBTITLE IS WHAT MAKES THE STEP MEAN ANYTHING. Without "1 to 3
     days a week", "lightly active" is self-assessment, and every person
     puts themselves on a different step — about a number that becomes
     their protein goal. */
  atividades: {
    sedentario: 'Sedentary',
    sedentarioSub: 'Little or no exercise',
    leve: 'Lightly active',
    leveSub: '1 to 3 days a week',
    moderado: 'Moderately active',
    moderadoSub: '3 to 5 days a week',
    muito: 'Very active',
    muitoSub: '6 to 7 days a week',
  },
};
