/* ============================================================
   EL CICLO DE LA DOSIS — el titular de inicio y las cuatro fases · es-419

   ⚠️ Las razones viven en ../pt-BR/ciclo.ts. La regla que vale para el
   archivo entero: NINGUNA de estas frases manda hacer nada. Dicen qué está
   pasando y qué suele ayudar — la diferencia entre "toma más agua" y "el
   agua sostiene la saciedad en esta fase" es la diferencia entre una
   aplicación que reclama y una que explica, y esta es la segunda.
   ============================================================ */

export const ciclo = {
  /* ⚠️ "DÍA 5 DE LA DOSIS", Y NO "DÍA 5 DE 7". El de-siete parecía cuenta
     regresiva de un plazo — ¿siete de qué, y qué pasa al llegar? La
     cadencia es del medicamento, no una meta que cumplir. */
  chapeuDia: (dia: number) => `DÍA ${dia} DESDE LA DOSIS`,
  chapeuSemCiclo: 'PARA HOY',

  /* ⚠️ NO ANUNCIA QUE HOY ES DÍA DE APLICARSE: la siguiente tarjeta de
     inicio es entera sobre eso, con la dosis y el lugar. Dos tarjetas
     seguidas dando la misma noticia gastan el carrusel. */
  aplicHead: 'El efecto empieza a subir en las próximas horas.',
  aplicBody: 'Pueden aparecer náuseas leves — mejor comidas más chicas a lo largo del día.',
  aplicQ: '¿Qué esperar el día de la inyección?',

  picoHead: 'Tu apetito tiende a estar más bajo hoy.',
  picoBody: 'Pico de efecto de la medicación — buen día para entrenar y adelantar la proteína.',
  picoQ: '¿Cuándo tengo más energía?',

  estabHead: 'Tu cuerpo está en la fase estable del ciclo.',
  estabBody: 'Efecto constante — mantén el agua y la proteína al día para sostener la saciedad.',
  estabQ: '¿Cómo funciona el ciclo de la medicación?',

  retornoHead: 'Tu hambre puede empezar a aumentar en las próximas 24 horas.',
  retornoBody: 'La proteína y el agua sostienen la saciedad en esta fase del ciclo.',
  retornoQ: '¿Por qué siento más hambre?',

  altoHeadHoje: 'Hambre en el punto más alto del ciclo.',
  altoHeadComData: (quando: string) => `Hambre en el punto alto del ciclo — inyección ${quando}.`,
  /* ⚠️ "NO TE SALTES COMIDAS" PRESUPONE QUE SE LAS SALTA, y en el punto
     alto del hambre quien menos se las salta es quien tiene hambre. La
     frase nacía como consejo y llegaba como reto — la versión afirmativa
     dice lo mismo útil sin acusar a nadie de nada. */
  altoBody: 'Porciones más chicas y más seguidas, con proteína, contienen mejor el hambre.',
  altoQ: '¿Por qué siento más hambre?',

  /* Entra delante del cuerpo del mensaje cuando la noche fue buena. Es la
     única línea de la aplicación que celebra el sueño, y existe porque
     dormir bien cambia el día entero de quien está en tratamiento. */
  dormiuBem: (resto: string) => `Dormiste bien — tu cuerpo tiende a responder mejor hoy. ${resto}`,

  /* ⚠️ SON CINCO AQUÍ Y CUATRO MÁS ABAJO, y es a propósito. Esta es la
     pregunta "en qué punto estoy AHORA"; la tabla de abajo responde "cómo
     es el ciclo entero", y ahí cinco líneas es una más de las que caben en
     la cabeza de quien lee por primera vez.

     ⚠️ EL `label` ES NOMBRE DE ETAPA Y EL `hint` ES LO QUE ELLA ES. El
     nombre solo — "Inicio del retorno del hambre" — es diagnóstico sin
     contexto, y en una pantalla de tratamiento eso asusta en vez de
     orientar. */
  faseAplicLabel: 'Inyección',
  faseAplicRange: 'Día 1',
  faseAplicHint: 'El efecto empieza a subir en las próximas horas.',

  fasePicoLabel: 'Pico de efecto',
  fasePicoRange: 'Días 1–2',
  fasePicoHint: 'Medicamento en el punto más alto — el hambre baja.',

  faseEstabLabel: 'Estabilidad',
  faseEstabRange: 'Días 3–4',
  faseEstabHint: 'Efecto constante, sin grandes oscilaciones.',

  faseRetornoLabel: 'Inicio del retorno del hambre',
  faseRetornoRange: 'Días 5–6',
  faseRetornoHint: 'El nivel del medicamento empieza a bajar, y el hambre tiende a volver.',

  fasePreLabel: 'Pre-inyección',
  fasePreRange: 'Días 7+',
  fasePreHint: 'Punto más bajo del ciclo, hasta la próxima dosis.',

  /* ⚠️ ESTA TABLA PRESUPONE CADENCIA SEMANAL, y es deuda conocida: quien
     usa medicamento diario no tiene siete días de ciclo que atravesar.
     Queda escrito para que quien traduzca no pierda tiempo buscándole
     sentido a los rótulos de día. */
  faseSubidaTitulo: 'Días 1–2 · subida',
  faseSubidaSub: 'Efecto subiendo, apetito más bajo',
  faseSubidaComum: 'náuseas leves, saciedad rápida, menos ganas de comer',
  faseSubidaAjuda: 'comidas más chicas y más espaciadas; tomar agua a lo largo del día',

  fasePlatoTitulo: 'Días 3–4 · meseta',
  fasePlatoSub: 'Fase más estable del ciclo',
  fasePlatoComum: 'apetito constante, intestino más lento',
  fasePlatoAjuda: 'priorizar proteína y fibra en las comidas',

  faseDescidaTitulo: 'Días 5–6 · bajada',
  faseDescidaSub: 'Efecto cediendo, hambre volviendo de a poco',
  faseDescidaComum: 'más hambre que en los primeros días, energía oscilando',
  /* ⚠️ LA MITAD FINAL DE ESTA FRASE ES LA RAZÓN DE QUE EXISTA. Que el
     hambre vuelva al quinto día asusta a quien cree que el medicamento
     dejó de funcionar, y abandonar ahí es común. Decir que es la fase, y
     no la falla, es el trabajo entero de la línea. */
  faseDescidaAjuda: 'es la fase en que el hambre vuelve — no significa que el tratamiento dejó de funcionar',
  /* La única fase con atención: es donde aparecen los síntomas que piden
     médico. No es alarma — es el límite entre lo esperado y lo que no
     espera a la próxima consulta. */
  faseDescidaAtencao: 'vómito persistente o dolor abdominal fuerte: habla con tu médico',

  faseBaixoTitulo: 'Día 7 · punto más bajo',
  faseBaixoSub: 'Víspera de la próxima inyección',
  faseBaixoComum: 'apetito más cerca de lo habitual',
  /* "La dosis", y no "la pluma": esta tabla es constante y no sabe la
     forma del medicamento — la frase sirve igual a pluma, frasco y
     jeringa. */
  faseBaixoAjuda: 'deja la dosis y el lugar de la inyección definidos la víspera',
  tela: {
    titulo: 'Ciclo de la dosis',
    diaDepois: (dia: number, acao: string) => `Día ${dia} después\nde la ${acao}`,
    lead: 'El efecto del medicamento sube en los primeros días y va cediendo hasta la próxima dosis. Lo que sientes cambia junto con él — y eso es lo esperado.',

    cicloAtual: 'Ciclo actual',
    diaDeTotal: (dia: number, total: number) => `día ${dia} de ${total}`,
    proximaDose: (data: string) => `Próxima dosis ${data}`,

    asQuatroFases: 'Las cuatro fases',
    comum: 'Común',
    ajuda: 'Ayuda',
    atencao: 'Atención',

    conteudoGeral: 'Esto es contenido general',
    conteudoGeralTexto: 'El ciclo varía de persona a persona y con la dosis. Nada de esto reemplaza la orientación de tu médico.',

    baseadoEm: (molecula: string) => `Basado en el comportamiento típico de ${molecula}`,
  },
};
