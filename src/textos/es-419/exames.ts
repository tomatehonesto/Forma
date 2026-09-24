/* ============================================================
   LA LECTURA DE LOS EXÁMENES — el resumen de la toma y la lectura de un marcador · es-419

   ⚠️ Las razones viven en ../pt-BR/exames.ts. Las tres que mandan:

   NADA AQUÍ OPINA, TODO AQUÍ CUENTA. Cuántos quedaron fuera del rango,
   cuánto se movió el valor, para qué lado. Es aritmética dicha en frase —
   y es así a propósito: la versión anterior era un párrafo escrito a mano
   con los números de UNA persona, y afirmaba "tus marcadores mejoraron" a
   quien había empeorado.

   EL RUMBO SOLO APARECE CUANDO EL MARCADOR DECLARA QUÉ LADO ES EL BUENO.
   Creatinina o TSH subiendo no es noticia buena ni mala por sí; llamarle
   mejora a una dirección sin saberlo sería opinión. Sin eso la frase para
   en el hecho: "subió 20".

   Y TODA LECTURA TERMINA DEVOLVIENDO EL EXAMEN A QUIEN ACOMPAÑA A LA
   PERSONA. La última frase no es pie de página jurídico — es la verdad
   sobre lo que un examen aislado puede decir.
   ============================================================ */

export const exames = {
  resumo: {
    todosDentro: (quantos: number) =>
      `Los ${quantos} marcadores de esta muestra están dentro del rango de referencia del laboratorio.`,
    umFora: (total: number, qual: string) =>
      `Uno de los ${total} marcadores de esta muestra quedó fuera del rango: ${qual}.`,
    algunsFora: (fora: number, total: number, quais: string) =>
      `${fora} de los ${total} marcadores de esta muestra quedaron fuera del rango: ${quais}.`,
    /* ⚠️ PASANDO DE TRES, LA CUENTA BASTA. El resumen vive en una portada
       de altura fija, y ocho nombres seguidos empujan el párrafo fuera de
       ella — y aunque cupiera, una lista de ocho en medio de una frase no
       se lee, se cuenta. */
    muitosFora: (fora: number, total: number) =>
      `${fora} de los ${total} marcadores de esta muestra quedaron fuera del rango.`,

    desde: (data: string) => ` Desde el ${data},`,
    melhoraUm: (desde: string, qual: string, de: string, para: string, unidade: string) =>
      `${desde} un marcador se movió en la dirección esperada. El mayor cambio: ${qual}, de ${de} a ${para} ${unidade}.`,
    melhoraVarios: (desde: string, quantos: number, qual: string, de: string, para: string, unidade: string) =>
      `${desde} ${quantos} marcadores se movieron en la dirección esperada. El mayor cambio: ${qual}, de ${de} a ${para} ${unidade}.`,

    /* ⚠️ EL EMPEORAMIENTO VA EN LA MISMA FRASE Y CON EL MISMO PESO QUE LA
       MEJORA. Un resumen que solo cuenta lo que mejoró es publicidad, y
       quien está leyendo un examen de sangre necesita las dos mitades. */
    pioraUm: (qual: string) => ` Un marcador fue en la dirección opuesta: ${qual}.`,
    pioraPoucos: (quantos: number, quais: string) =>
      ` ${quantos} marcadores fueron en la dirección opuesta: ${quais}.`,
    pioraMuitos: (quantos: number) => ` ${quantos} marcadores fueron en la dirección opuesta.`,
  },

  /* ⚠️ EL TITULAR ES ESTADO + LO QUE ESTÁ EN JUEGO, y antes era estado +
     rumbo. Lo que ninguna otra pieza de la pantalla dice es POR QUÉ este
     número importa — y un valor fuera del rango sin eso es una alarma sin
     asunto.

     ⚠️ Y EL TITULAR NO DICE EL NOMBRE DEL MARCADOR. "Tu HbA1c" / "Tu
     ferritina" pediría una tabla de género por marcador para escribir bien
     en español, y equivocarse en el artículo en una frase sobre la salud
     de alguien es un tropiezo barato de evitar. "Este resultado" siempre
     es correcto, y el nombre está en la barra de arriba. */
  leitura: {
    acima: 'arriba',
    abaixo: 'abajo',

    dentroSemAfeta: 'Este resultado está dentro del rango de referencia del laboratorio.',
    foraSemAfeta: (lado: string) =>
      `Este resultado está ${lado} del rango de referencia del laboratorio.`,
    dentroComAfeta: (afeta: string) =>
      `Este resultado está dentro del rango de referencia, lo que es buena señal ${afeta}.`,
    foraComAfeta: (lado: string, afeta: string) =>
      `Este resultado está ${lado} del rango de referencia, lo que hace diferencia ${afeta}.`,

    faixaEntre: (min: string, max: string, unidade: string) => `entre ${min} y ${max}${unidade}`,
    faixaAbaixoDe: (max: string, unidade: string) => `abajo de ${max}${unidade}`,
    faixaAcimaDe: (min: string, unidade: string) => `arriba de ${min}${unidade}`,

    rumoDentroBom: ', en la dirección esperada',
    rumoDentroRuim: ', en la dirección opuesta a la esperada',
    rumoForaBom: ', caminando hacia el rango',
    rumoForaRuim: ', alejándose de él',
    subiu: 'subió',
    caiu: 'bajó',
    andou: (data: string, verbo: string, quanto: string, unidade: string, rumo: string) =>
      ` Desde el ${data} ${verbo} ${quanto}${unidade}${rumo}.`,

    /* ⚠️ ESTA ES LA ÚNICA FRASE DE LA PANTALLA QUE MIRA FUERA DE ESTE
       MARCADOR. Un número fuera del rango leído solo se vuelve el mundo
       entero de quien lee — y lo que desarma eso no está en el marcador,
       está en el panel: saber que los otros catorce salieron bien cambia el
       tamaño de este uno. */
    painelTudoDentro: (total: number) =>
      ` Los ${total} marcadores de este examen están dentro del rango.`,
    painelEsteNao: (total: number, fora: number, plural: boolean) =>
      ` De los ${total} marcadores de este examen, ${fora} ${plural ? 'quedaron' : 'quedó'} fuera del rango; este no.`,
    painelUnicoFora: (total: number) =>
      ` De los ${total} marcadores de este examen, este es el único fuera del rango.`,
    painelEsteEUmDeles: (total: number, fora: number) =>
      ` De los ${total} marcadores de este examen, ${fora} están fuera del rango, y este es uno de ellos.`,

    /* ⚠️ LA ÚLTIMA FRASE NO SE QUITA. "Un examen solo no cierra nada" es lo
       que impide que la lectura entera se vuelva diagnóstico, y "quien te
       acompaña" es verdad en los tres modos — con equipo, con médico suelto
       y sin nadie. */
    corpo: (data: string, valor: string, unidade: string, faixa: string, andou: string, painel: string) =>
      `En la toma de ${data} el valor fue ${valor}${unidade}, y la referencia del laboratorio es ${faixa}.${andou}${painel} Un examen solo no cierra nada: quien lo junta con el resto de tu historia es quien te acompaña.`,
  },

  tela: {
    titulo: 'Exámenes',
    linha: (quantos: number, ultimaColeta: string) =>
      `${quantos} ${quantos === 1 ? 'marcador' : 'marcadores'} · última muestra ${ultimaColeta}`,
    foraDaReferencia: 'fuera del rango',
    naReferencia: 'dentro del rango',
    blocoFora: 'Fuera del rango',
    arquivosImportados: 'Archivos importados',
    fonteFoto: 'foto',
    arquivoSub: (marcadores: number, fonte: string, data: string) =>
      `${marcadores} marcadores · ${fonte} · ${data}`,
    importar: 'Importar examen',
    enviarAoMedico: 'Enviar al médico',

    linhaVazia: 'Todavía sin resultados',
    vazioTitulo: 'Ningún examen por acá',
    vazioTexto: 'Todavía no anotaste ningún resultado. Cuando anotes el primero, aparece acá con el rango de referencia y lo que ese rango quiere decir.',
    vazioAcao: 'Anotar un resultado',

    colhidoEm: (data: string) => `Tomado el ${data}`,
    vereditoOk: 'Dentro del rango',
    vereditoAlto: 'Por encima del rango',
    vereditoBaixo: 'Por debajo del rango',
    vereditoComFaixa: (veredito: string, faixa: string) => `${veredito}: ${faixa}`,
    faixaEntre: (minimo: string, maximo: string, unidade: string) =>
      `entre ${minimo} y ${maximo}${unidade}`,
    faixaAbaixo: (maximo: string, unidade: string) => `por debajo de ${maximo}${unidade}`,
    faixaAcima: (minimo: string, unidade: string) => `por encima de ${minimo}${unidade}`,
    faixaRef: (referencia: string, unidade: string) => `${referencia}${unidade}`,
    refCurta: (referencia: string) => ` · ref ${referencia}`,

    /* Os selos da LISTA, em caixa baixa e curtos: ali eles cabem ao lado
       do número, e o veredito por extenso mora no detalhe. */
    seloOk: 'dentro del rango',
    seloAlto: 'por encima',
    seloBaixo: 'por debajo',
    seloEnviado: 'enviado',

    sobre: 'SOBRE',

    evolucao: 'EVOLUCIÓN',
    deAte: (primeiro: string, ultimo: string) => `De ${primeiro} a ${ultimo}`,
    coletasDesde: (quantas: number, data: string) =>
      `${quantas} ${quantas === 1 ? 'toma' : 'tomas'} desde ${data}`,
    deltaEsperado: ' · esperado',
    deltaOposto: ' · al revés',

    oQueSignifica: 'QUÉ SIGNIFICA ESTO',
    oQueAjuda: 'Lo que suele ayudar',
    oQueMexe: 'Lo que también mueve el resultado',
    rodape: 'Son las causas y los caminos más comunes, y no la lista entera. Cambiar la dosis o la medicación es decisión de quien te acompaña.',
    perguntarSobre: 'Preguntar sobre este examen',
    perguntaCompanion: (marcador: string) => `Explica mi examen de ${marcador}`,
  },
};
