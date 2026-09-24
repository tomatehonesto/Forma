/* ============================================================
   BALANCE — the radar read, in two sentences · en-US

   ⚠️ Reasons live in ../pt-BR/equilibrio.ts. The two that matter most:
   the voice is first person and opens a conversation, never a verdict;
   and the read never tells anyone to do anything — the strongest version
   says "that's where I'd look next week", in the conditional.
   ============================================================ */

const meu = (eixo: string) => (eixo === 'Protein' ? 'my protein intake' : eixo === 'Exercise' ? 'my physical activity' : `my ${eixo.toLowerCase()}`);

export const equilibrio = {
  /* ⚠️ THE AXIS NAME IS NOT THE KEY. The key is the id ('sono'); this is
     only the label. And "Fullness" is the good side of the hunger scale —
     on a chart where everything grows outward, the axis has to grow with
     it. */
  eixos: {
    sono: 'Sleep',
    energia: 'Energy',
    humor: 'Mood',
    hidratacao: 'Hydration',
    exercicio: 'Exercise',
    proteina: 'Protein',
    saciedade: 'Fullness',
    adesao: 'Adherence',
  },

  /* The three openers, chosen by the spread between the best and worst
     axis. */
  aberturaTudoBem: 'I noticed something good.',
  aberturaAtencao: 'Something caught my eye.',
  aberturaPreciso: 'There’s something I want to show you.',

  /* ⚠️⚠️ THIS PAIR IS THE TRANSLATION TRAP the Portuguese file warns
     about, and it resolves differently here.

     Portuguese drops the second noun to lowercase — "Sono e adesão" —
     because it opens the clause bare. English keeps both capitalized when
     they are the chart's own labels, and two items take no comma before
     "and". So this is a plain join, and the lowercasing that Portuguese
     needs would be wrong. */
  par: (primeiro: string, segundo: string) => `${primeiro} and ${segundo.toLowerCase()}`,

  corpoEquilibrado: (doisFortes: string, fraco: string) =>
    `${doisFortes} are pulling you up, and ${fraco.toLowerCase()} isn’t lagging either. I wouldn’t change anything for now.`,
  corpoUmAtras: (doisFortes: string, fraco: string) =>
    `${doisFortes} are steady. ${fraco} is what swings the most — that’s where I’d look next week.`,

  /* ⚠️ THE BUTTON AND THE QUESTION ARE THE SAME SENTENCE, on purpose: the
     button hands the question to the companion, and if they drift the
     person taps one thing and gets an answer to another. */
  botaoMelhorar: (eixo: string) => `How to improve ${meu(eixo)}`,
  perguntaMelhorar: (eixo: string) => `How to improve ${meu(eixo)}?`,

  serieDe: (eixo: string, dias: number) => `${eixo.toUpperCase()} · LAST ${dias} DAYS`,
};
