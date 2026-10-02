/* ============================================================
   LA ETAPA DEL TRATAMIENTO — los mensajes que abren la pantalla de inicio · es-419

   ⚠️ Las razones viven en ../pt-BR/etapa.ts.

   ⚠️ EL SOMBRERO TIENE QUE CABER EN DOS PALABRAS. Es la etiqueta en
   mayúsculas encima del titular, y la pantalla de inicio la dibuja en una
   sola línea: lo que pase de ahí rompe la tarjeta.
   ============================================================ */

export const etapa = {
  antesChapeu: 'ANTES DE EMPEZAR',

  antesComDoseHead: 'Tu primera dosis todavía está por venir.',
  /* ⚠️ LA MOLÉCULA, NO LA MARCA. Quien todavía no se aplicó está leyendo
     sobre lo que va a sentir, y lo que causa el efecto es la sustancia —
     escribir la marca aquí sonaría a publicidad en el único momento en que
     la persona aún no tiene experiencia propia para contraponer. */
  antesComDoseBody: (molecula: string) =>
    `Los primeros días con ${molecula} suelen traer menos hambre y náuseas leves. Registrar cómo te sientes desde ya es lo que da base de comparación después.`,
  antesComDoseQ: '¿Qué esperar el día de la dosis?',

  antesSemDoseHead: 'Tu tratamiento todavía no tiene una dosis definida.',
  /* "Cuando tu equipo la defina" y no "cuando tú la definas": la dosis es
     decisión de quien prescribe, y no empujamos a nadie a elegir un número
     que no es suyo. */
  antesSemDoseBody: 'Cuando tu equipo la defina, va aquí — es a partir de ella que armamos el ciclo de la semana y los recordatorios.',
  antesSemDoseQ: '¿Cómo funciona el ciclo de la medicación?',

  doseNovaChapeu: 'DOSIS NUEVA',
  doseNovaHead: (dose: string, unidade: string) =>
    `Subiste a ${dose} ${unidade} esta semana.`,
  /* ⚠️ EL MARCO ES EL MISMO Y EL RELLENO ES DE ELLA CUANDO EXISTE. Con
     registros suficientes, la frase cuenta el dibujo de SUS náuseas; sin
     ellos, cuenta el dibujo que suele ocurrir. */
  doseNovaBodyCom: (perto: string, longe: string) =>
    `En tus registros las náuseas se quedan en ${perto} los dos primeros días después de la dosis y bajan a ${longe} a partir del tercero. Cada escalón suele repetir ese dibujo.`,
  doseNovaBodySem: 'Cada escalón suele traer de vuelta, por algunos días, lo que ya había pasado — las náuseas son lo más común. Tiende a ceder a medida que tu cuerpo se ajusta.',
  doseNovaQ: '¿Por qué siento náuseas?',

  /* ⚠️ DIA A DIA, CONTADO DO REGISTRO DA DOSE (28/09/2026, pedido do dono):
     o dia 1 é o dia em que a primeira dose foi registrada, e cada dia tem
     o seu recado — o que é comum sentir, e o que vale registrar. Guia, e
     não diagnóstico: "é comum", "costuma". */
  primeiraChapeu: (n: number): string => `PRIMERA SEMANA · DÍA ${n}`,
  primeiraDias: [
    { head: 'Tu primera dosis está registrada.', body: 'Es común no sentir nada todavía: el cuerpo recién está conociendo el medicamento. Un check-in por la noche ya sirve de base para comparar los próximos días.', q: '¿Qué esperar el día de la dosis?' },
    { head: 'El hambre puede empezar a bajar.', body: 'Mucha gente nota menos ganas de comer a partir de hoy. Comer despacio y parar a la primera señal de saciedad ayuda a evitar las náuseas.', q: '¿Por qué baja el hambre?' },
    { head: 'Atención al agua.', body: 'Con menos hambre, también se toma menos agua sin darse cuenta. Mantenerla al día ayuda con las náuseas y con el intestino.', q: '¿Cuánta agua debo tomar?' },
    { head: 'Proteína primero.', body: 'Con el plato más chico, conviene empezar por la proteína: es la que ayuda a preservar la masa muscular mientras baja el peso.', q: '¿Por qué importa tanto la proteína?' },
    { head: '¿Cómo está tu intestino?', body: 'El estreñimiento es un relato común en las primeras semanas. Registrarlo en el check-in ayuda a ver si es pasajero y a llevarlo a la consulta.', q: '¿Qué ayuda con el estreñimiento?' },
    { head: 'El hambre puede volver un poco.', body: 'Cerca del final del ciclo, es esperable que el apetito vuelva a aparecer. Es parte del proceso, y por eso la próxima dosis tiene día fijo.', q: '¿Por qué vuelve el hambre antes de la próxima dosis?' },
    { head: 'Una semana de tratamiento.', body: 'Completaste la primera semana. Son los check-ins de estos días los que muestran cómo respondió el cuerpo, y lo que vale la pena llevar a la consulta.', q: '¿Cómo fue mi primera semana?' },
  ],
  /* ⚠️ El sexto día de quien toma la dosis todos los días (01/10/2026) —
     ver ../pt-BR/etapa.ts. El de arriba habla del ciclo semanal; con una
     dosis por día no hay fin de ciclo que el hambre espere. */
  primeiraDiaSeisDiaria: {
    head: 'Sin altibajos en la semana.',
    body: 'Con una dosis por día, el medicamento queda en un nivel parecido de un día a otro — el hambre no tiene un día fijo para volver. Si aparece, el check-in es el lugar para anotarlo.',
    q: '¿Cómo funciona el medicamento de todos los días?',
  },

  manutencaoChapeu: 'MANTENIMIENTO',
  /* ⚠️ LA PROCEDENCIA ENTRA EN LA FRASE, SIEMPRE. "El rango que definió tu
     equipo" solo puede decirse cuando alguien anotó de quién vino — y la
     diferencia entre los dos titulares no es de tono, es de hecho. */
  manutencaoHeadEquipe: 'Estás en el rango que definió tu equipo.',
  manutencaoHeadDela: 'Estás en el peso que definiste como meta.',
  /* ⚠️ "MANTENER ES UN TRABAJO DISTINTO DE PERDER" es el centro de la
     frase, y no adorno: a quien llega a la meta suelen decirle que
     terminó, y lo que decide si el resultado se queda es justamente lo que
     viene después. */
  manutencaoBody: (atual: string, alvo: string, por: string | null) =>
    `${atual}, contra ${alvo}${por ? ` anotados por ${por}` : ''} — y hace por lo menos un mes en ese rango. Mantener es un trabajo distinto de perder, y es lo que decide si el resultado se queda.`,
  manutencaoQ: '¿Cómo va mi evolución?',

  platoChapeu: 'PESO ESTABLE',
  platoHead: 'Tu peso está parado hace cerca de un mes.',
  /* ⚠️⚠️ LA EXPLICACIÓN VIENE ANTES DE CUALQUIER SUGERENCIA, Y LA
     SUGERENCIA NO ES "ESFUÉRZATE MÁS".

     La meseta es fisiología: el cuerpo gasta menos a medida que pesa
     menos, y la misma dosis pasa a encontrar un cuerpo distinto. Quien lee
     esto está haciendo lo mismo de siempre y viendo la balanza detenerse —
     lo último que necesita es una aplicación sugiriendo que el problema es
     ella.

     ⚠️ "ES ASUNTO DE CONSULTA, NO DE ESFUERZO" es la frase entera en seis
     palabras, y es la razón de que la tarjeta no tenga botón de acción.
     Cambiarla por cualquier cosa en la línea de "mira lo que puedes hacer"
     deshace la tarjeta.

     ⚠️ Y CUANDO LOS DOS NÚMEROS REDONDEAN IGUAL, NO SE DICE DOS VECES.
     "78,2 kg hace cuatro semanas, 78,2 kg ahora" es exacto y parece
     defecto de código — y un número que parece defecto se lleva la frase
     entera abajo. */
  platoBodyIgual: (media: string) =>
    `El promedio de tus pesajes está en ${media} desde entonces. La meseta es parte esperada del tratamiento: tu cuerpo empieza a gastar menos a medida que el peso baja. Es asunto de consulta, no de esfuerzo.`,
  platoBodyDois: (antes: string, agora: string) =>
    `${antes} hace cuatro semanas, ${agora} ahora. La meseta es parte esperada del tratamiento: tu cuerpo empieza a gastar menos a medida que el peso baja. Es asunto de consulta, no de esfuerzo.`,
  platoQ: '¿Cómo va mi evolución?',
};
