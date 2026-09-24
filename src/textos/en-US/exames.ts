/* ============================================================
   READING LAB RESULTS — the panel summary and one marker · en-US

   ⚠️ Reasons live in ../pt-BR/exames.ts. Three survive translation whole:

   NOTHING HERE OPINES, EVERYTHING HERE COUNTS. How many fell outside the
   range, how far a value moved, in which direction. It is arithmetic said
   in a sentence.

   THE DIRECTION ONLY APPEARS WHEN THE MARKER DECLARES WHICH WAY IS GOOD.
   Creatinine or TSH going up is neither good news nor bad on its own.

   AND EVERY READING ENDS BY HANDING THE RESULT BACK to whoever follows
   the person. That last sentence is not a legal footer — it is the truth
   about what a single lab panel can say.
   ============================================================ */

export const exames = {
  /* ---------- the panel summary ---------- */
  resumo: {
    todosDentro: (quantos: number) =>
      `All ${quantos} markers in this panel are within the lab’s reference range.`,
    umFora: (total: number, qual: string) =>
      `One of the ${total} markers in this panel came back outside the reference range: ${qual}.`,
    algunsFora: (fora: number, total: number, quais: string) =>
      `${fora} of the ${total} markers in this panel came back outside the reference range: ${quais}.`,
    /* ⚠️ PAST THREE, THE COUNT IS ENOUGH. The summary sits on a cover of
       fixed height, and eight names in a row push the paragraph off it. */
    muitosFora: (fora: number, total: number) =>
      `${fora} of the ${total} markers in this panel came back outside the reference range.`,

    /* The date fragment that opens the second sentence. It carries its own
       punctuation because it joins onto what follows. */
    desde: (data: string) => ` Since ${data},`,
    melhoraUm: (desde: string, qual: string, de: string, para: string, unidade: string) =>
      `${desde} one marker moved in the expected direction, and the biggest change was in ${qual}: from ${de} to ${para} ${unidade}.`,
    melhoraVarios: (desde: string, quantos: number, qual: string, de: string, para: string, unidade: string) =>
      `${desde} ${quantos} markers moved in the expected direction, and the biggest change was in ${qual}: from ${de} to ${para} ${unidade}.`,

    /* ⚠️ THE WORSENING COMES IN THE SAME SENTENCE AND CARRIES THE SAME
       WEIGHT as the improvement. A summary that only reports what got
       better is advertising, and someone reading a blood panel needs both
       halves. */
    pioraUm: (qual: string) => ` One marker went the other way: ${qual}.`,
    pioraPoucos: (quantos: number, quais: string) =>
      ` ${quantos} markers went the other way: ${quais}.`,
    pioraMuitos: (quantos: number) => ` ${quantos} markers went the other way.`,
  },

  /* ---------- reading one marker ----------

     ⚠️ THE HEADLINE IS STATE + WHAT IS AT STAKE, not state + direction:
     the direction is already announced by the trend card above it. What
     no other piece of the screen says is WHY this number matters — and a
     value outside the range without that is an alarm with no subject.

     ⚠️ AND THE HEADLINE DOESN'T NAME THE MARKER. Portuguese avoided it to
     dodge a gender table; English keeps "this result" for a simpler
     reason — the name is already in the bar at the top, and repeating it
     in a sentence about someone's health buys nothing. */
  leitura: {
    acima: 'above',
    abaixo: 'below',

    dentroSemAfeta: 'This result is within the lab’s reference range.',
    foraSemAfeta: (lado: string) =>
      `This result is ${lado} the lab’s reference range.`,
    dentroComAfeta: (afeta: string) =>
      `This result is within the reference range, which is a good sign ${afeta}.`,
    foraComAfeta: (lado: string, afeta: string) =>
      `This result is ${lado} the reference range, which makes a difference ${afeta}.`,

    faixaEntre: (min: string, max: string, unidade: string) => `between ${min} and ${max}${unidade}`,
    faixaAbaixoDe: (max: string, unidade: string) => `below ${max}${unidade}`,
    faixaAcimaDe: (min: string, unidade: string) => `above ${min}${unidade}`,

    rumoDentroBom: ', in the expected direction',
    rumoDentroRuim: ', in the opposite direction',
    rumoForaBom: ', moving toward the reference range',
    rumoForaRuim: ', moving away from it',
    subiu: 'rose',
    caiu: 'fell',
    andou: (data: string, verbo: string, quanto: string, unidade: string, rumo: string) =>
      ` Since ${data} it ${verbo} ${quanto}${unidade}${rumo}.`,

    /* ⚠️ THIS IS THE ONLY SENTENCE ON THE SCREEN THAT LOOKS OUTSIDE THIS
       MARKER. A number outside the range, read alone, becomes the reader's
       whole world — and what disarms that is not in the marker, it is in
       the panel. It is the same service a doctor performs in the first
       sentence of an appointment, and it is factual: it counts, it does
       not opine. */
    painelTudoDentro: (total: number) =>
      ` All ${total} markers in this panel are within the reference range.`,
    painelEsteNao: (total: number, fora: number, plural: boolean) =>
      ` Of the ${total} markers in this panel, ${fora} ${plural ? 'are' : 'is'} outside the reference range; this one isn’t.`,
    painelUnicoFora: (total: number) =>
      ` Of the ${total} markers in this panel, this is the only one outside the reference range.`,
    painelEsteEUmDeles: (total: number, fora: number) =>
      ` Of the ${total} markers in this panel, ${fora} are outside the reference range, and this is one of them.`,

    /* ⚠️ THE LAST SENTENCE DOESN'T COME OUT. "A single panel doesn't
       settle anything" is what keeps the whole reading from turning into
       a diagnosis, and "whoever follows your care" is true in all three
       modes — with a team, with a lone doctor, and with nobody. */
    corpo: (data: string, valor: string, unidade: string, faixa: string, andou: string, painel: string) =>
      `On the ${data} draw the value was ${valor}${unidade}, and the lab’s reference range is ${faixa}.${andou}${painel} A single panel doesn’t settle anything: the person who puts it together with the rest of your history is whoever follows your care.`,
  },

  tela: {
    titulo: 'Lab results',
    linha: (quantos: number, ultimaColeta: string) =>
      `${quantos} ${quantos === 1 ? 'marker' : 'markers'} · last panel on ${ultimaColeta}`,
    foraDaReferencia: 'out of range',
    naReferencia: 'in range',
    blocoFora: 'Outside the range',
    arquivosImportados: 'Imported files',
    arquivoSub: (marcadores: number, fonte: string, data: string) =>
      `${marcadores} markers · ${fonte} · ${data}`,
    importar: 'Import a lab result',
    enviarAoMedico: 'Send to the doctor',

    linhaVazia: 'No results yet',
    vazioTitulo: 'No lab results here',
    vazioTexto: 'You haven’t recorded a result yet. Once you add the first one, it shows up here with its reference range and what that range means.',
    vazioAcao: 'Record a result',

    colhidoEm: (data: string) => `Collected on ${data}`,
    vereditoOk: 'Within range',
    vereditoAlto: 'Above the range',
    vereditoBaixo: 'Below the range',
    vereditoComFaixa: (veredito: string, faixa: string) => `${veredito}: ${faixa}`,
    faixaEntre: (minimo: string, maximo: string, unidade: string) =>
      `between ${minimo} and ${maximo}${unidade}`,
    faixaAbaixo: (maximo: string, unidade: string) => `below ${maximo}${unidade}`,
    faixaAcima: (minimo: string, unidade: string) => `above ${minimo}${unidade}`,
    faixaRef: (referencia: string, unidade: string) => `${referencia}${unidade}`,
    refCurta: (referencia: string) => ` · ref ${referencia}`,

    /* Os selos da LISTA, em caixa baixa e curtos: ali eles cabem ao lado
       do número, e o veredito por extenso mora no detalhe. */
    seloOk: 'in range',
    seloAlto: 'above',
    seloBaixo: 'below',
    seloEnviado: 'sent',

    sobre: 'ABOUT',

    evolucao: 'OVER TIME',
    deAte: (primeiro: string, ultimo: string) => `From ${primeiro} to ${ultimo}`,
    coletasDesde: (quantas: number, data: string) =>
      `${quantas} ${quantas === 1 ? 'panel' : 'panels'} since ${data}`,
    deltaEsperado: ' · as expected',
    deltaOposto: ' · the other way',

    oQueSignifica: 'WHAT THIS MEANS',
    oQueAjuda: 'What usually helps',
    oQueMexe: 'What else moves this number',
    rodape: 'These are the most common causes and paths, not the whole list. Changing a dose or a medication is a decision for whoever follows your treatment.',
    perguntarSobre: 'Ask about this result',
    perguntaCompanion: (marcador: string) => `Explain my ${marcador} result`,
  },
};
