/* ============================================================
   LOS HALLAZGOS — la tarjeta de inicio que no es el ciclo · es-419

   ⚠️ Las razones viven en ../pt-BR/descobertas.ts. Las dos que mandan:

   LA ANTICIPACIÓN SIEMPRE DICE QUE PASA. "El hambre tiende a apretar hoy"
   es un aviso, y un aviso sin plazo se vuelve amenaza: las tres terminan
   diciendo qué ocurre después — "se pasa solo cuando te apliques", "son
   las 48 h de cada ciclo, no el tratamiento entero".

   Y LA INVITACIÓN NO RECLAMA. "Todavía no dijiste adónde quieres llegar"
   es la ausencia dicha como posibilidad, no como falta; "no creaste
   ninguna meta" sería la misma frase con la regla apuntando a la persona.
   ============================================================ */

export const descobertas = {
  verDescoberta: 'Ver el hallazgo',

  chapeuAntecipacao: 'LO QUE VIENE',

  fomeHoje: 'El hambre tiende a apretar hoy',
  fomeAmanha: 'El hambre tiende a apretar mañana',
  fomeEmDias: (dias: number) => `El hambre tiende a apretar en ${dias} días`,
  /* La molécula en minúscula porque es sustancia, no marca. */
  fomeTexto: (molecula: string) =>
    `Es cuando el nivel de ${molecula} llega al punto más bajo del ciclo, poco antes de la próxima aplicación. Se pasa solo cuando te apliques.`,
  fomeCta: 'Ver el ciclo',

  aguaTitulo: 'Mañana suele ser tu día más seco',
  aguaTexto: (dele: string, dia: string, outros: string) =>
    `En tus registros la hidratación baja a ${dele} ${dia}, contra ${outros} los demás días. Saberlo en la víspera es medio camino.`,
  aguaCta: 'Ver la hidratación',

  enjooTitulo: 'Si las náuseas aparecen ahora, tienen hora para pasar',
  enjooTexto: (perto: string, longe: string) =>
    `En tus registros se quedan en ${perto} los dos primeros días después de la aplicación y bajan a ${longe} a partir del tercero. Son las 48 h de cada ciclo, no el tratamiento entero.`,
  enjooCta: 'Ver los síntomas',

  chapeuConvite: 'UNA INVITACIÓN',

  metaTitulo: 'Todavía no dijiste adónde quieres llegar',
  metaTexto: 'Una meta tuya — entrar en un pantalón, volver a la playa, dejar un hábito. La guardamos para ti, y quien marca cuándo llega eres tú.',
  metaCta: 'Crear una meta',

  medidasTitulo: 'La balanza cuenta solo una parte',
  medidasTexto: 'La cinta métrica cuenta la otra: cintura y cadera cambian cuando el peso se estanca, y ahí es donde ella muestra que algo está pasando.',
  medidasCta: 'Registrar medidas',

  refeicaoTitulo: 'La proteína del día puede contarse sola',
  refeicaoTexto: 'Registrando lo que comes, la cuenta del día sale hecha — sin tabla, sin sumar nada de cabeza.',
  refeicaoCta: 'Registrar una comida',

  examesTitulo: 'Tus exámenes caben aquí',
  examesTexto: 'Con ellos guardados, puedes ver la línea de cada marcador a lo largo del tratamiento — y llevar todo ordenado a la consulta.',
  examesCta: 'Guardar un examen',

  clinicaTitulo: 'Tu clínica puede quedar de este lado',
  clinicaTexto: 'Con el código que te dio, tu equipo aparece aquí y sus indicaciones dejan de perderse entre los mensajes.',
  clinicaCta: 'Usar el código',
};
