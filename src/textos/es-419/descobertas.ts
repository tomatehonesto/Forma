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

  chapeuCruzamento: 'UN HALLAZGO',

  chapeuAntecipacao: 'LO QUE VIENE',

  fomeHoje: 'El hambre tiende a apretar hoy',
  fomeAmanha: 'El hambre tiende a apretar mañana',
  fomeEmDias: (dias: number) => `El hambre tiende a apretar en ${dias} días`,
  /* La molécula en minúscula porque es sustancia, no marca. */
  fomeTexto: (molecula: string) =>
    `Es cuando el nivel de ${molecula} llega al punto más bajo del ciclo, poco antes de la próxima inyección. Se pasa solo cuando te apliques.`,
  fomeCta: 'Ver el ciclo',

  aguaTitulo: 'Mañana suele ser tu día más seco',
  aguaTexto: (dele: string, dia: string, outros: string) =>
    `En tus registros la hidratación baja a ${dele} ${dia}, contra ${outros} los demás días. Saberlo en la víspera es medio camino.`,
  aguaCta: 'Ver la hidratación',

  enjooTitulo: 'Si las náuseas aparecen ahora, tienen hora para pasar',
  enjooTexto: (perto: string, longe: string) =>
    `En tus registros se quedan en ${perto} los dos primeros días después de la inyección y bajan a ${longe} a partir del tercero. Son las 48 h de cada ciclo, no el tratamiento entero.`,
  enjooCta: 'Ver los síntomas',

  chapeuConvite: 'UNA INVITACIÓN',

  metaTitulo: 'Todavía no dijiste adónde quieres llegar',
  metaTexto: 'Una meta tuya — entrar en un pantalón, volver a la playa, dejar un hábito. La guardamos para ti, y quien marca cuándo llega eres tú.',
  metaCta: 'Crear una meta',

  medidasTitulo: 'La balanza cuenta solo una parte',
  medidasTexto: 'La cinta métrica cuenta el resto: cintura y cadera siguen cambiando cuando el peso se estanca, y ahí es donde muestra que algo sigue pasando.',
  medidasCta: 'Registrar medidas',

  refeicaoTitulo: 'La proteína del día puede contarse sola',
  refeicaoTexto: 'Registra lo que comes y la cuenta del día queda hecha — sin tabla, sin sumar nada de cabeza.',
  refeicaoCta: 'Registrar una comida',

  examesTitulo: 'Tus exámenes caben aquí',
  examesTexto: 'Con ellos guardados, puedes ver la línea de cada marcador a lo largo del tratamiento — y llevar todo ordenado a la consulta.',
  examesCta: 'Guardar un examen',

  clinicaTitulo: 'Tu clínica puede quedar de este lado',
  clinicaTexto: 'Con el código que te dio, tu equipo aparece aquí y sus indicaciones dejan de perderse entre los mensajes.',
  clinicaCta: 'Usar el código',
  /* the weekly reading — see ../pt-BR/descobertas.ts */
  semana: {
    chapeu: 'TU SEMANA',
    /* os slides do carrossel da Home (app/(tabs)/index): curtos de propósito */
    slideProntoTitulo: 'Tu resumen de la semana está listo',
    slideProntoTexto: 'Cómo fue, un descubrimiento y una prueba para la próxima.',
    slideProntoCta: 'Ver el resumen',
    slideConviteTitulo: '¿Quieres un resumen de tu semana?',
    slideConviteTexto: 'Cada lunes leo tus registros y te cuento lo que descubrí.',
    titulo: 'Tu semana',
    pedirSim: 'Sí, quiero',
    poucoTitulo: 'El lunes leo tu semana',
    poucoTexto: 'Haz el check-in al menos 3 días, o pésate una vez, y tendré qué leer.',
    lendo: 'Leyendo tu semana…',
    parteSemana: 'La semana',
    parteDescoberta: 'Un descubrimiento',
    parteTeste: 'Para probar',
    lerInteira: 'Leer completa',
    conversar: 'Conversar sobre esto',
    telaTitulo: 'La lectura de la semana',
    desligar: 'Desactivar la lectura de la semana',
    desligada: 'Desactivada. En 4 semanas te pregunto de nuevo.',
  },
};
