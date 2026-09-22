/* ============================================================
   LAS LECTURAS — lo que la aplicación dice después de leer las respuestas · es-419

   ⚠️⚠️ CUATRO TRABAS VALEN PARA EL ARCHIVO ENTERO, y no son estilo. Las
   razones completas viven en ../pt-BR/leituras.ts:

   1. NINGUNA NOMBRA UN DIAGNÓSTICO. Quien lee ya tiene el síntoma, y un
      nombre de enfermedad asusta sin ayudar a decidir el próximo paso.

   2. EL SUJETO ES EL SÍNTOMA O EL CUERPO, NUNCA LA PERSONA. "Vomitar
      mucho" y "a ese ritmo" describían lo involuntario como si fuera
      hábito — quien vomita no está vomitando de más, está vomitando. Ella
      es quien lee, no quien lo causó.

   3. LOS RANGOS SON CLÍNICOS, NO EDITORIALES. El dolor y el mareo avisan
      en el 4, donde el día ya se interrumpió; los conteos avisan en el
      escalón donde la graduación clínica cambia de nivel. Se traducen las
      palabras, no los números — esos viven en logic/leituras.

   4. EL `curto` NOMBRA EL OBJETO DEL VERBO, SIEMPRE. "Toma de a poquito"
      deja a la persona llenando el hueco sola, y en una línea leída al
      pasar el hueco se queda. "Toma agua de a poquito" no deja duda — y
      es la única frase que se va a llevar.

   ⚠️ CADA LECTURA HABLA EN DOS LARGOS. En el formulario es un aviso
   entero; en la confirmación es una línea: `sobre` más `curto`. Todo ya se
   dijo un toque antes; lo que queda es salir de la pantalla recordando.
   ============================================================ */

export const leituras = {
  dorSobre: 'Dolor abdominal',
  dorCurto: 'habla hoy con tu equipo',
  dorTitulo: 'Ese dolor no espera a la próxima consulta',
  /* ⚠️ "CASI SIEMPRE NO ES NADA GRAVE — Y POR ESO MISMO VALE MIRARLO
     TEMPRANO" es la frase entera. Pide atención sin asustar, y el "por eso
     mismo" es lo que impide que la lectura se vuelva alarma. */
  dorTexto: 'Un dolor fuerte en la panza, o que no pasa, es el único que pide atención el mismo día. Casi siempre no es nada grave — y por eso mismo vale mirarlo temprano.',
  dorAcao: 'Habla hoy con tu equipo. Si empeora o viene con vómito, busca atención.',

  vomitoSobre: 'Vómito',
  vomitoCurto: 'toma agua de a poquito, varias veces',
  vomitoTitulo: 'El vómito saca más líquido de lo que parece',
  vomitoTexto: 'Junto con el agua se va la sal, y el cuerpo lo siente antes de que tengas sed. Y cuando la comida no se queda, el día siguiente ya empieza cansado.',
  vomitoAcao: 'Toma de a poquito, varias veces, en vez de un vaso de una sola vez. Si ni el agua se queda, habla hoy con tu equipo.',

  tonturaSobre: 'Mareo',
  tonturaCurto: 'siéntate, toma agua y come algo dulce',
  tonturaTitulo: 'Un mareo así suele tener explicación',
  tonturaTexto: 'Casi siempre es falta de líquido o azúcar bajo. Si tomas algún medicamento para la diabetes junto, el azúcar bajo es todavía más probable.',
  tonturaAcao: 'Siéntate, toma agua y come algo. Si se repite en los próximos días, cuéntaselo a tu equipo.',

  presoSobre: 'Intestino estreñido',
  presoCurto: 'toma agua a lo largo del día, come fibra y camina',
  presoTitulo: 'Cuatro días sin ir ya merece atención',
  presoTexto: 'El medicamento deja todo más lento, y comiendo menos queda poco para que el intestino empuje. Cuatro días es donde esto suele dejar de resolverse solo.',
  presoAcao: 'Agua a lo largo del día, fibra en las comidas y una caminata. Si pasa de cinco días, o viene con dolor fuerte y vómito, busca atención.',

  soltoSobre: 'Intestino suelto',
  soltoCurto: 'toma agua con una pizca de sal, sin esperar la sed',
  soltoTitulo: 'El intestino suelto se lleva agua y sal',
  soltoTexto: 'Siete idas o más en un día se llevan más de lo que la sed alcanza a reponer.',
  soltoAcao: 'Toma a lo largo del día sin esperar la sed, con suero o una pizca de sal. Si mañana sigue así, avísale a tu equipo.',

  /* ⚠️ CUANDO APARECE UNA COMBINACIÓN, LOS AVISOS DE CAMPO DESAPARECEN.
     Ellos dicen "conversa con tu equipo" sobre un síntoma; la combinación
     dice "anda ahora" sobre el conjunto, y dejar los dos en la pantalla es
     permitir que el menos urgente discuta con el más urgente. */
  travaSobre: 'Intestino, dolor y vómito',
  travaCurto: 'busca una guardia hoy',
  travaTitulo: 'Esa combinación pide atención ahora',
  travaTexto: 'Intestino parado hace días, dolor fuerte y vómito juntos pueden ser señal de que algo se trabó. Es raro, pero no mejora solo.',
  /* ⚠️ "QUÉ MEDICAMENTO USAS", y antes decía "que usas la pluma". Quien
     está en una guardia necesita decir QUÉ toma, no en qué envase viene. */
  travaAcao: 'Busca una guardia hoy. Di qué medicamento usas y hace cuántos días no vas al baño.',

  dorVomitoSobre: 'Dolor con vómito',
  dorVomitoCurto: 'busca a tu equipo o una guardia hoy',
  dorVomitoTitulo: 'Dolor fuerte con vómito no espera',
  dorVomitoTexto: 'Un dolor fuerte en la panza junto con vómito, a veces extendiéndose a la espalda, pide atención el mismo día. Llegando temprano, es simple de revisar.',
  dorVomitoAcao: 'Busca a tu equipo o una guardia hoy. Di qué medicamento usas, la dosis y cuándo empezó el dolor.',

  desidratacaoSobre: 'Mareo y pérdida de líquido',
  desidratacaoCurto: 'toma suero o agua con sal, y levántate despacio',
  desidratacaoTitulo: 'Mareo con pérdida de líquido es señal de deshidratación',
  desidratacaoTexto: 'Cuando falta agua y sal, la presión baja al levantarse — y el mareo es el cuerpo avisando.',
  desidratacaoAcao: 'Toma de a poquito a lo largo del día, con suero o una pizca de sal, y levántate despacio. Si no mejora para mañana, avísale a tu equipo.',

  /* ⚠️ POR ESO EL TEXTO TRAE EL NÚMERO DE DÍAS. "Cuatro de los últimos
     siete" es un hecho que la persona lleva a la consulta; "tienes náuseas
     con frecuencia" es una impresión que ya tenía. */
  vomitoSemanaSobre: 'Vómito en la semana',
  vomitoSemanaCurto: 'habla con tu equipo esta semana',
  vomitoSemanaTitulo: 'Vómito en días repetidos',
  vomitoSemanaTexto: (n: number) => `${n} de los últimos siete días con vómito. Así ni la comida, ni el líquido, ni el propio medicamento se quedan.`,
  vomitoSemanaAcao: 'Habla con tu equipo esta semana, sin esperar la consulta. Lleva el número de días — es el que hace la diferencia.',

  soltoSemanaSobre: 'Intestino en la semana',
  soltoSemanaCurto: 'toma más agua y cuéntaselo a tu equipo',
  soltoSemanaTitulo: 'El intestino está suelto hace días',
  soltoSemanaTexto: (n: number) => `${n} de los últimos siete días así ya pesa en la hidratación, aun cuando cada día, solo, parece tranquilo.`,
  soltoSemanaAcao: 'Toma más de lo que la sed pide y cuéntaselo a tu equipo. Puede ser la dosis, puede ser la alimentación.',

  enjooSemanaSobre: 'Náuseas en la semana',
  enjooSemanaCurto: 'lleva el número de días a la consulta',
  enjooSemanaTitulo: 'Las náuseas no están pasando',
  enjooSemanaTexto: (n: number) => `${n} de los últimos siete días con náuseas deja de ser adaptación y se vuelve patrón. Suele cambiar con la dosis, o con la velocidad a la que sube.`,
  /* ⚠️ "SOSTENER LA DOSIS UN POCO MÁS NO ES RENDIRSE" es el servicio de la
     frase: es la conducta que la persona más resiste llevar a la consulta,
     porque la lee como fracaso. */
  enjooSemanaAcao: 'Lleva ese número a la próxima consulta. Sostener la dosis un poco más no es rendirse.',

  /* ⚠️ EL INTESTINO ESTREÑIDO APARECE EN LAS DOS LECTURAS, y no es
     repetición: la regla del campo cuenta días seguidos sin ir — un
     episodio —, y esta cuenta días de la semana con el intestino lento. */
  presoSemanaSobre: 'Intestino lento en la semana',
  presoSemanaCurto: 'toma agua, come fibra y camina',
  presoSemanaTitulo: 'El intestino está lento toda la semana',
  presoSemanaTexto: (n: number) => `${n} de los últimos siete días con el intestino estreñido. Comer menos es efecto del medicamento, y con menos comida pasa menos fibra — él lo siente antes que la balanza.`,
  presoSemanaAcao: 'Agua, fibra y caminata ayudan. A este ritmo, vale contárselo a tu equipo.',

  /* ⚠️ LOS HITOS SE INDEXAN POR EL NÚMERO DE DÍAS, y la clave es el número
     porque quien pregunta es la racha: `marcoDe(7)`. Traducir el valor no
     toca ningún registro.

     ⚠️ Y NO SON SIETE NIVELES DE UNA ESCALERA. Cada uno nombra un tiempo
     que la persona reconoce, y por eso el de 30 dice "registros" y no
     "seguidos": un mes entero sin fallar un día es raro, y la frase no
     puede prometer lo que la regla no exige. */
  marcos: {
    3: 'Tres días seguidos',
    7: 'Una semana entera',
    14: 'Dos semanas seguidas',
    21: 'Tres semanas seguidas',
    30: 'Un mes de registros',
    60: 'Dos meses seguidos',
    90: 'Tres meses seguidos',
  },

  /* ⚠️ LAS TRES CON NÚMERO TRAEN EL NÚMERO QUE LAS SOSTIENE, y es lo que
     las separa de un elogio. "Dormiste bien" es opinión; "Durmiendo 7 h+
     en 5 días" es el conteo de sus propios registros. */
  dormindoBem: (n: number) => `Durmiendo 7 h+ en ${n} días`,
  energiaBoa: (n: number) => `Buena energía en ${n} días`,
  semEnjooDias: (n: number) => `${n} días sin náuseas`,

  saciedadeMelhorando: 'Saciedad mejorando',

};
