/* ============================================================
   LAS METAS — los números que la aplicación cobra y los que solo la persona sabe · es-419

   ⚠️ Las razones viven en ../pt-BR/metas.ts. Tres catálogos distintos
   viven aquí: los ALVOS (los cuatro números del perfil), los INDICADORES
   (lo que la aplicación sabe CONTAR) y las PESSOAIS (lo que solo la
   persona sabe decir cuándo llegó — sin porcentaje, porque no existe un
   sesenta por ciento de entrar en un pantalón).

   ⚠️ LAS PERSONALES SON CATEGORÍAS Y NO FRASES HECHAS. La lista dice de QUÉ
   cosa se trata, y la pregunta del segundo toque es la que la vuelve suya.
   Hay que mantener las dos piezas: el nombre corto para la lista y la
   pregunta que obliga a especificar.

   ⚠️ Y EL PREFIJO ES LO QUE CIERRA LA FRASE. La persona escribe un pedazo
   — "vóley", "el vestido de la boda" — y el `monta` devuelve la oración
   entera. En otro idioma el orden puede ser otro; lo que no puede es que
   la frase salga por la mitad o repita el verbo.

   ⚠️ NINGUNA CATEGORÍA ASUME FAMILIA, CUERPO NI DINERO. Una meta que no
   cabe en la vida de quien está leyendo es peor que un campo vacío.
   ============================================================ */

export const metas = {
  alvos: {
    /* ⚠️ ERA LA MISMA FRASE ESCRITA TRES VECES, una en cada número del
       día. Es la misma porque el hecho es el mismo — el protocolo cuenta
       días contra los tres —, y tres copias divergirían la primera vez que
       alguien mejorara la redacción de una.

       Lo que hace: decir lo que la persona no tiene cómo saber mirando la
       hoja. Bajar la meta de proteína hace que el protocolo del equipo
       marque cumplido sin que nada haya cambiado en el plato. No traba y no
       juzga. */
    ressalvaDoProtocolo: 'El protocolo de la semana cuenta los días en que alcanzaste este número. Si lo cambias acá, cambia también lo que el protocolo de tu equipo pasa a considerar cumplido.',

    prot: {
      nome: 'Proteína por día',
      onde: 'Se cuenta en la alimentación y en el protocolo',
      origem: 'Calculado de tu peso, a 1,2 g por kilo',
      un: 'g',
      escreve: (gramas: number) => String(gramas),
    },
    waterMl: {
      nome: 'Hidratación por día',
      origem: 'Calculado de tu peso, tu edad y tu nivel de actividad',
      onde: 'Se cuenta en la hidratación y en el protocolo',
    },
    exercMin: {
      nome: 'Ejercicio por día',
      onde: 'Es la línea punteada de la semana, en el ejercicio',
      /* ⚠️ ESTE NO ES CALCULADO, y sería fácil escribir que sí para que la
         frase quedara igual a las otras dos. Son 60 minutos para todo el
         mundo, y el registro no pregunta nada que cambiara eso. */
      origem: 'El estándar de la aplicación, igual para todos',
      un: 'min',
      escreve: (minutos: number) => String(minutos),
    },
    peso: {
      /* ⚠️ EL MISMO NOMBRE DEL REGISTRO. La pregunta allá es "¿cuál es tu
         meta de peso?", y acá el campo se llamaba "peso de referencia" —
         dos nombres para el mismo número. */
      nome: 'Meta de peso',
      onde: 'Mide el viaje entero, en el Camino',
      origem: 'La elegiste en el registro',
    },
  },

  /* ⚠️ EL NOMBRE EN LA LISTA ES GENÉRICO A PROPÓSITO: "Horas de sueño", y
     no "Dormir 7h+". Elegir la cosa y elegir el número son dos decisiones,
     y la segunda es la personal.

     ⚠️ `origem` DICE DE DÓNDE SALE EL NÚMERO, y es lo que decide si vale la
     pena crear la meta: quien nunca registra comidas necesita ver, antes de
     elegir, que la meta de proteína va a quedar parada en cero.

     ⚠️ `nomes` ES LO QUE SE CUENTA, en singular y en plural, y `femininas`
     es su concordancia. Sin ese par, "11 de 13 noches registradas" sale
     como "registrados". */
  indicadores: {
    sono: {
      nome: 'Horas de sueño',
      pergunta: '¿Cuántas horas por noche?',
      origem: 'Del sueño que respondes en el check-in',
      nomes: ['noche', 'noches'] as [string, string],
      femininas: true,
      un: 'h',
      escreve: (horas: number) => `${horas} h`,
      rotulo: (horas: number) => `Dormir ${horas}h por noche`,
      conta: (horas: number) => `Noches con ${horas}h o más`,
    },
    energia: {
      nome: 'Energía en el día',
      pergunta: '¿De qué nivel para arriba cuenta?',
      origem: 'De la energía que respondes en el check-in',
      nomes: ['día', 'días'] as [string, string],
      femininas: false,
      un: 'de 5',
      escreve: (nivel: number) => `${nivel} de 5`,
      rotulo: (nivel: number) => `Energía ${nivel} o más`,
      conta: (nivel: number) => `Días con energía ${nivel} o más, de 1 a 5`,
    },
    humor: {
      nome: 'Ánimo en el día',
      pergunta: '¿De qué nivel para arriba cuenta?',
      origem: 'Del ánimo que respondes en el check-in',
      nomes: ['día', 'días'] as [string, string],
      femininas: false,
      un: 'de 5',
      escreve: (nivel: number) => `${nivel} de 5`,
      rotulo: (nivel: number) => `Ánimo ${nivel} o más`,
      conta: (nivel: number) => `Días con ánimo ${nivel} o más, de 1 a 5`,
    },
    /* ⚠️ LAS NÁUSEAS Y EL HAMBRE CUENTAN AL REVÉS: el acierto es el día en
       que el número quedó BAJO, y por eso la pregunta es "hasta qué nivel
       todavía cuenta como bueno". Cambiarla por "de qué nivel para arriba"
       invierte la meta entera sin que nada lo acuse. */
    enjoo: {
      nome: 'Náuseas',
      pergunta: '¿Hasta qué nivel todavía cuenta como bueno?',
      origem: 'De las náuseas que marcas en el check-in',
      nomes: ['día', 'días'] as [string, string],
      femininas: false,
      un: 'de 5',
      escreve: (nivel: number) => `${nivel} de 5`,
      rotulo: (nivel: number) => `Náuseas ${nivel} o menos`,
      conta: (nivel: number) => `Días con náuseas ${nivel} o menos, de 1 a 5`,
    },
    fome: {
      nome: 'Hambre',
      pergunta: '¿Hasta qué nivel todavía cuenta como bueno?',
      origem: 'Del hambre que respondes en el check-in',
      nomes: ['día', 'días'] as [string, string],
      femininas: false,
      un: 'de 5',
      escreve: (nivel: number) => `${nivel} de 5`,
      rotulo: (nivel: number) => `Hambre ${nivel} o menos`,
      conta: (nivel: number) => `Días con hambre ${nivel} o menos, de 1 a 5`,
    },
    prot: {
      nome: 'Proteína por día',
      pergunta: '¿Cuántos gramos por día?',
      origem: 'De las comidas que registras',
      nomes: ['día', 'días'] as [string, string],
      femininas: false,
      escreve: (gramas: number) => `${gramas} g`,
      rotulo: (gramas: number) => `Comer ${gramas} g de proteína`,
      conta: (gramas: number) => `Días con ${gramas} g o más`,
    },
    /* Los tres de abajo reciben la cantidad YA ESCRITA — "2,5 L", "85 fl
       oz" —, porque la unidad es decisión de logic/medidas y no de idioma. */
    agua: {
      nome: 'Hidratación por día',
      pergunta: '¿Cuánto por día?',
      origem: 'De lo que registras en la hidratación',
      nomes: ['día', 'días'] as [string, string],
      femininas: false,
      rotulo: (quanto: string) => `Tomar ${quanto} de agua`,
      conta: (quanto: string) => `Días con ${quanto} o más`,
    },
    exerc: {
      nome: 'Minutos de movimiento',
      pergunta: '¿Cuántos minutos por día?',
      origem: 'De los entrenamientos que registras',
      nomes: ['día', 'días'] as [string, string],
      femininas: false,
      escreve: (minutos: number) => `${minutos} min`,
      rotulo: (minutos: number) => `Moverte ${minutos} min por día`,
      conta: (minutos: number) => `Días con ${minutos} min o más`,
    },
  },

  /* ⚠️ EL TIEMPO VERBAL ESTABA ELIGIENDO LA VIDA DE LA PERSONA, y se
     arregló. "Volver a practicar" presupone que practicó; quien quiere
     empezar natación a los cuarenta no cabía en la única categoría de la
     aplicación que hablaba de deporte.

     La única que sigue presuponiendo es la del lugar — y lo DICE en su
     propio nombre, que es la diferencia entre presuponer y preguntar.

     ⚠️ LOS EJEMPLOS VAN EN LA PREGUNTA, NUNCA EN LA PISTA DEL CAMPO. Un
     ejemplo dentro del campo es una sugerencia: quien lee uno antes de
     pensar en su propia meta escribe la meta del ejemplo. */
  pessoais: {
    roupa: {
      nome: 'Una prenda de ropa',
      pergunta: '¿Qué prenda quieres ponerte? La del fondo del clóset, una que viste en una vidriera — la que se te venga a la cabeza.',
      dica: 'Escribe la prenda',
      monta: (r: string) => `Ponerme ${r}`,
    },
    esporte: {
      nome: 'Un deporte',
      pergunta: '¿Qué deporte quieres practicar? Vale lo que ya hiciste alguna vez y lo que nunca probaste.',
      dica: 'Escribe el deporte',
      monta: (r: string) => `Practicar ${r}`,
    },
    folego: {
      /* "Algo del día a día", y no "sin perder el aliento": la barrera
         puede ser la rodilla, puede ser dolor, puede ser vergüenza — y
         nombrar la equivocada excluye a quien tiene la otra. */
      nome: 'Algo del día a día',
      pergunta: '¿Qué quieres poder hacer sin cansarte? Subir la escalera de casa, cargar las compras, caminar hasta ahí sin parar a mitad de camino.',
      dica: 'Escribe la actividad',
      monta: (r: string) => `Lograr ${r}`,
    },
    sentir: {
      nome: 'Cómo me siento',
      pergunta: '¿Cómo quieres sentirte? Con más ánimo, más cómoda en tu propio cuerpo — como tenga sentido para ti.',
      dica: 'Escribe cómo quieres sentirte',
      monta: (r: string) => `Sentirme ${r}`,
    },
    foto: {
      nome: 'Una foto',
      pergunta: '¿Qué foto quieres tener? Una en la playa, una con quien amas, o solo una en la que te reconozcas.',
      dica: 'Escribe la foto',
      monta: (r: string) => `Sacarme ${r}`,
    },
    lugar: {
      /* ⚠️ EL NOMBRE DICE LA PRESUPOSICIÓN, y es la única que quedó. Acá
         ella es el asunto: no se trata de lograr, se trata de volver —
         quien deja de ir a la playa rara vez dejó por no poder. Quien
         quiere un lugar nuevo tiene "Otra meta". */
      nome: 'Un lugar que dejaste de ir',
      pergunta: '¿Adónde quieres volver? La playa, la piscina, la fiesta de alguien — el lugar que va quedando afuera.',
      dica: 'Escribe el lugar',
      monta: (r: string) => `Volver a ${r}`,
    },
    comecar: {
      nome: 'Un hábito para crear',
      pergunta: '¿Qué quieres empezar a hacer? Caminar de mañana, cocinar los domingos, dormirte más temprano.',
      dica: 'Escribe el hábito',
      monta: (r: string) => `Empezar a ${r}`,
    },
    largar: {
      nome: 'Un hábito para dejar',
      pergunta: '¿Qué quieres dejar de hacer? Comer parada, picotear de madrugada — lo que sea tuyo.',
      dica: 'Escribe el hábito',
      monta: (r: string) => `Dejar de ${r}`,
    },
    /* La salida para lo que no cabe en ninguna categoría — lo mismo que
       las otras, solo que sin prefijo: acá la frase entera es de quien
       escribe. */
    livre: {
      nome: 'Otra meta',
      pergunta: '¿Qué quieres lograr? Escríbelo a tu manera — lo guardamos exactamente como lo escribas.',
      dica: 'Escribe tu meta',
      monta: (r: string) => r,
    },
  },

  /* ⚠️ QUIEN LE PONE PLAZO A UNA META DE TRATAMIENTO piensa en "unos tres
     meses", no en el 14 de diciembre. Y la primera opción es NO tener
     plazo, seleccionada: una meta sin fecha sigue siendo meta; lo que no
     puede es ganar un plazo que la persona no eligió. */
  prazos: {
    nao: 'Sin plazo',
    umMes: 'En 1 mes',
    tresMeses: 'En 3 meses',
    seisMeses: 'En 6 meses',
    umAno: 'En 1 año',
  },

  jornada: {
    /* ⚠️ LA CUENTA, Y NO EL PORCENTAJE DE NUEVO. La línea decía "85%" a la
       derecha y "85% de las noches recientes" abajo — el mismo número dos
       veces. "11 de 13 noches" responde de cuántas noches hablamos. */
    contagem: (quantas: number, de: number, nome: string, femininas: boolean) =>
      `${quantas} de ${de} ${nome} ${femininas ? 'registradas' : 'registrados'}`,
    semRegistros: (plural: string) => `sin ${plural} registradas todavía`,

    conquistadaEm: (data: string) => `conquistada el ${data}`,
    /* ⚠️ EL PLAZO ES HECHO, NO RECLAMO. Vencido y no conquistada, la línea
       dice que pasó y para ahí — sin rojo y sin "atrasada". En un
       tratamiento de meses, una fecha que se corrió es la cosa más común
       del mundo, y la meta sigue en pie. */
    ate: (data: string) => `hasta ${data}`,
    oPrazoEra: (data: string) => `el plazo era ${data}`,
    vocemarca: 'tú marcas cuando llegues',
  },
};
