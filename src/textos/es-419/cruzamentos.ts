/* ============================================================
   LOS CRUCES — lo que los registros de ella dicen cuando se cruzan · es-419

   ⚠️ Las razones viven en ../pt-BR/cruzamentos.ts. Las tres que mandan:

   NINGUNA DE ESTAS FRASES PUEDE VOLVERSE CONSEJO. "El agua ayuda con la
   saciedad" es información; "toma más agua" es orden, y una orden basada
   en la estadística de trece registros es lo peor de los dos mundos. Los
   verbos se eligieron uno por uno.

   EL SUJETO ES EL FENÓMENO, NO LA PERSONA. "Tu hidratación baja los
   domingos", y no "tomas menos agua los domingos" — es el mismo hecho con
   el dedo apuntando.

   CADA HALLAZGO TIENE HASTA CUATRO MOVIMIENTOS y no son intercambiables:
   `titulo` es el hallazgo en una línea, `texto` son los números que lo
   sostienen, `porque` es el mecanismo, y `significa` es el "¿y entonces?".
   Traducir `significa` como si fuera resumen del `texto` deshace la
   tarjeta: existe para decir algo que los números NO dicen.
   ============================================================ */

export const cruzamentos = {
  catAlimentacao: 'Alimentación',
  catSono: 'Sueño',
  catSintomas: 'Síntomas',
  catPeso: 'Peso',
  catAplicacoes: 'Inyecciones',

  /* ⚠️ VIENEN CON PREPOSICIÓN, y no sueltos. En español los siete llevan
     "los" — "los domingos", "los lunes" — sin la asimetría del portugués,
     pero la lista sigue siendo el lugar correcto: concatenar el artículo
     afuera obligaría a la tabla a saber género, y en otro idioma la
     preposición vuelve a partirse. */
  nomesDia: ['los domingos', 'los lunes', 'los martes', 'los miércoles', 'los jueves', 'los viernes', 'los sábados'],

  /* ⚠️ "OTRO TRATAMIENTO", Y NO "TU PEOR MOMENTO". El hallazgo cruza tres
     variables, y dos de ellas mejoran el fin de semana (el sueño sube). El
     titular nombra la diferencia sin decir qué lado es el equivocado. */
  fimDeSemana: {
    titulo: 'Tu fin de semana funciona como otro tratamiento',
    texto: (copos: string, proteina: string, sono: string) =>
      `Los sábados y domingos tomas ${copos} vasos menos${proteina}${sono}`,
    textoProteina: (gramas: number) => ` y comes ${gramas} g menos de proteína`,
    /* ⚠️ EL SUEÑO ES LA BUENA NOTICIA DENTRO DE LA MALA, y por eso cierra
       la frase: "el descanso mejora; la rutina es la que se suelta" es el
       hallazgo entero resumido, y es lo que impide que la tarjeta se
       vuelva un reto. */
    textoSono: (horas: string) => ` — pero duermes ${horas} h más. El descanso mejora; la rutina es la que se afloja.`,
    textoSemSono: '.',
    q: '¿Cómo cuidar mejor el fin de semana?',
    evid: (copos: string) => ({ valor: `−${copos}`, unidade: 'vasos', legenda: 'el sábado y el domingo' }),
    porque: 'La rutina de la semana carga tu hidratación y tus comidas sin que tengas que pensar en ellas: horarios fijos, botella en la mesa, almuerzo a la misma hora. El sábado esa estructura desaparece, y lo que queda es decidir todo sobre la marcha — que es justamente cuando la decisión se vuelve más difícil.',
    /* ⚠️ "NO NECESITA DISCIPLINA NUEVA" es la frase entera. Quien lee esto
       ya sabe que el fin de semana es más difícil; lo que no sabe es que el
       problema es estructural y no de voluntad. */
    significa: 'Dos días por semana el tratamiento queda sin su estructura, y son justamente los días en que tienes más tiempo. No necesitas disciplina nueva — necesitas que el fin de semana tenga una rutina propia, no la ausencia de la rutina de la semana.',
  },

  aguaDia: {
    /* ⚠️ EL SUJETO ES LA HIDRATACIÓN, Y ERA LA PERSONA. "Tomas mucha menos
       agua los domingos" es el mismo hecho con el dedo apuntando. */
    titulo: (dia: string) => `Tu hidratación baja ${dia}`,
    texto: (pior: string, outros: string) =>
      `Cerca de ${pior} vasos, contra ${outros} los otros días. El agua ayuda con la saciedad y con las náuseas — y es el día en que las dos suelen pesar más.`,
    q: '¿Cómo va mi agua?',
    evid: (pior: string, outros: string) =>
      ({ valor: pior, unidade: `de ${outros} vasos`, legenda: 'el promedio en ese día de la semana' }),
    significa: 'Un día de la semana te baja el promedio él solo. Como es siempre el mismo, se puede resolver con un recordatorio, en vez de vigilar la hidratación todos los días.',
  },

  /* ⚠️ EL HALLAZGO ES EL RETRASO DE UN DÍA, y no la proteína. La relación
     desaparece en el gráfico diario porque la persona ve el hambre de hoy
     al lado del plato de hoy, nunca del de ayer. */
  proteinaFome: {
    titulo: 'Los días en que alcanzas la proteína, el día siguiente es más fácil',
    texto: (meta: number, comMeta: string, semMeta: string) =>
      `Después de llegar a los ${meta} g, tu hambre al día siguiente quedó en ${comMeta}. Cuando no llegó, ${semMeta}. El efecto no aparece el mismo día — por eso es difícil notarlo sola.`,
    q: '¿Cómo va mi proteína?',
    evid: (diferenca: string) =>
      ({ valor: `−${diferenca}`, unidade: 'de hambre', legenda: 'al día siguiente de alcanzar la meta' }),
    porque: 'La proteína actúa sobre la saciedad por un camino más lento que el del azúcar: tarda más en salir del estómago y sostiene las señales de saciedad por muchas horas. Por eso el efecto sigue durante la noche y reaparece en el apetito de la mañana siguiente.',
    /* ⚠️ "NO ES SOLO CUMPLIR UNA TABLA" es lo que saca la meta de proteína
       del lugar de obligación y la pone en el de intercambio. */
    significa: 'Alcanzar la meta de proteína no es solo cumplir una tabla: es ganarte un día siguiente más tranquilo. Cuando el hambre apriete, lo que resuelve no es lo que comes en ese momento — es lo que comiste ayer.',
  },

  sonoFome: {
    titulo: 'Dormir más de siete horas sostiene tu hambre al día siguiente',
    texto: (comSono: string, semSono: string) =>
      `Después de noches completas tu hambre quedó en ${comSono}; después de noches cortas, ${semSono}. Tu apetito responde al sueño de la víspera tanto como a lo que comiste.`,
    q: '¿Qué registrar antes de dormir?',
    evid: { valor: '7h', unidade: '+', legenda: 'el punto en que tu hambre cambia' },
    /* ⚠️ "NO ES FALTA DE DISCIPLINA" es el centro, y no una atenuación.
       Quien durmió mal y comió más al día siguiente suele culparse por
       eso; el mecanismo hormonal es el hecho que deshace la culpa. */
    porque: 'Dormir poco mueve las dos hormonas que regulan el apetito: sube la que da hambre y baja la que avisa que ya fue suficiente. No es falta de disciplina al día siguiente — es tu cuerpo pidiendo energía rápida para compensar lo que faltó de descanso.',
    significa: 'El sueño no suele entrar en la cuenta de quien está tratando el peso, pero en tus datos mueve el apetito como pocas cosas. Una noche protegida puede valer más para el día siguiente que cualquier ajuste en el plato.',
  },

  /* ⚠️ ESTE ES EL ÚNICO HALLAZGO QUE LIGA HÁBITO A SÍNTOMA CLÍNICO, y por
     eso su `significa` es el más cuidadoso del archivo: DESHACE la lectura
     de causa que el título invita a hacer. Equivocarse aquí no cuesta un
     mal consejo sobre el agua — cuesta que alguien concluya que sus
     náuseas son culpa de haber dormido mal. */
  sonoEnjoo: {
    titulo: 'Después de las noches largas, tus náuseas han sido menores',
    texto: (horas: number, comSono: string, semSono: string) =>
      `En los días siguientes a dormir ${horas}h o más, tus náuseas quedaron en ${comSono}. Después de las noches cortas, ${semSono} — en una escala de 5.`,
    q: '¿Por qué siento náuseas?',
    evid: (comSono: string, semSono: string, noites: number) =>
      ({ valor: comSono, unidade: `de ${semSono}`, legenda: `las náuseas después de ${noites} noches largas` }),
    significa: 'Esto es lo que muestran tus registros, y no una relación de causa: el ciclo de la inyección mueve las náuseas más que cualquier otra cosa, y puede estar detrás de los dos lados de la cuenta. Vale como pista para llevarle a tu equipo, no como explicación cerrada.',
  },

  janelaEnjoo: {
    titulo: 'Tus náuseas suelen desaparecer cerca de 48 horas después de la inyección',
    texto: (perto: string, longe: string) =>
      `Se quedan en ${perto} los dos primeros días y bajan a ${longe} a partir del tercero. No es el tratamiento entero el que da náuseas — son las primeras 48 h de cada ciclo.`,
    q: '¿Por qué siento náuseas?',
    evid: { valor: '48', unidade: 'horas', legenda: 'y entonces pasa' },
    /* ⚠️ LA ÚLTIMA FRASE ES LA ÚNICA DEL ARCHIVO QUE SUGIERE UNA ACCIÓN, y
       puede: elegir el día de la inyección es decisión de la persona con
       su equipo, no cambio de dosis ni de medicación. */
    significa: (dias: number) =>
      `Esto se repitió en ${dias} de tus registros posteriores a la inyección. Saber que existe una ventana, y que termina, cambia qué hacer con ella: puedes elegir el día de la inyección de forma que esas 48 h caigan en la parte más liviana de tu semana.`,
  },

  aguaEnjoo: {
    titulo: 'Los días en que tomas bien, las náuseas son menores',
    /* ⚠️ "NO PRUEBA CAUSA" ESTÁ DENTRO DE LA FRASE, y no en un pie de
       página. La tarjeta entera es una correlación de trece días; la
       salvedad tiene que llegar junto al número, porque es ahí donde se
       lee. */
    texto: (corte: string, comAgua: string, semAgua: string) =>
      `Con ${corte} o más, tus náuseas promedio fueron ${comAgua}. Abajo de eso, ${semAgua}. No prueba que sea la causa — pero de todo lo que aparece ligado al síntoma, es lo más fácil de cambiar.`,
    q: '¿Cómo disminuir las náuseas?',
    evid: (diferenca: string) =>
      ({ valor: `−${diferenca}`, unidade: 'de náuseas', legenda: 'en los días bien hidratados' }),
    significa: 'De todo lo que aparece ligado a tus náuseas, el agua es lo que está más en tu mano. No sustituye conversar con tu equipo si aprietan, pero es lo primero que conviene probar.',
  },

  /* ⚠️ ESTE ES EL HALLAZGO QUE EVITA EL ABANDONO, y por eso existe. La
     semana en que la balanza sube es la semana en que la gente para — y la
     tarjeta muestra, con sus números, que eso ya pasó antes y no significó
     lo que parecía significar. */
  platoQueNaoImpediu: {
    titulo: (altas: number, perdido: string) =>
      `La balanza subió ${altas} veces y aun así perdiste ${perdido}`,
    texto: (pesagens: number, altas: number) =>
      `En ${pesagens} pesajes, ${altas} estuvieron por encima del anterior — y la línea que los atraviesa sigue bajando. Una semana de alza no es recaída: son variaciones de agua e intestino dentro de una tendencia.`,
    q: '¿Cómo va mi evolución?',
    evid: (altas: number, perdido: string) =>
      ({ valor: String(altas), unidade: 'alzas', legenda: `dentro de −${perdido} en el tramo` }),
    porque: 'El peso del día es grasa, pero también es agua, sal, intestino y el ciclo hormonal — variaciones de uno a dos kilos ocurren sin que nada haya cambiado en la grasa corporal. La grasa sale despacio y en línea; el resto oscila por encima y es lo que la balanza muestra primero.',
    significa: 'Esto importa más de lo que parece: la semana en que la balanza sube es la semana en que la gente suele rendirse. En tus propios números, nunca significó lo que parecía significar.',
  },

  proteinaTendencia: {
    titulo: (subiu: boolean, pct: number) =>
      `Tu proteína ${subiu ? 'subió' : 'bajó'} ${pct}% desde el comienzo`,
    textoSubiu: (depois: number, antes: number) =>
      `Promedio de ${depois} g/día en las últimas semanas, contra ${antes} g al inicio. La proteína preserva la masa magra durante la pérdida de peso.`,
    textoCaiu: (depois: number, antes: number) =>
      `Promedio de ${depois} g/día en las últimas semanas, contra ${antes} g antes. Conviene retomarla — la masa magra sostiene el metabolismo.`,
    q: '¿Cómo va mi proteína?',
    evid: (pct: number, antes: number, depois: number) =>
      ({ valor: `${pct > 0 ? '+' : ''}${pct}%`, unidade: '', legenda: `${antes} → ${depois} g por día` }),
    significaSubiu: 'Subió sin que te lo propusieras, que suele ser el tipo de hábito que se queda. La proteína es lo que protege tu masa magra mientras el peso baja — sin ella, parte de lo que desaparece no es grasa.',
    significaCaiu: 'La caída fue gradual, del tipo que no se percibe de un día para el otro. La proteína es lo que protege tu masa magra mientras el peso baja; conviene retomarla antes de que se vuelva lo normal.',
  },

  /* ⚠️ ESTOS DOS DESCRIBEN UN NÚMERO QUE LA PERSONA YA VE EN EL INICIO, y
     por eso no son hallazgo: son retrato. Van últimos a propósito. */

  ritmo: {
    /* ⚠️ LA UNIDAD VIENE DE AFUERA, no está escrita acá: en imperial el
       ritmo es en libras por semana. Ver ../pt-BR/cruzamentos.ts. */
    titulo: (ritmo: string, unidade: string) => `Tu ritmo es de ${ritmo} ${unidade} por semana`,
    textoBom: (perdido: string, semanas: number) =>
      `${perdido} en ${semanas} semanas, dentro de lo esperado para tu fase.`,
    /* ⚠️ LA VERSIÓN FUERA DE LO ESPERADO NO DIAGNOSTICA Y NO ALARMA: deriva.
       Un ritmo demasiado rápido o demasiado lento es conversación de
       consulta, y la tarjeta para exactamente ahí. */
    textoAtencao: (perdido: string, semanas: number) =>
      `${perdido} en ${semanas} semanas. Conviene comentar el ritmo con tu equipo en la próxima consulta.`,
    q: '¿Cómo va mi evolución?',
    evid: (ritmo: string, unidade: string, perdido: string, semanas: number) =>
      ({ valor: ritmo, unidade: `${unidade}/sem`, legenda: `${perdido} en ${semanas} semanas` }),
    significaBom: 'Es un ritmo sostenible, y lo sostenible es lo que importa: las pérdidas demasiado rápidas suelen llevarse masa magra y volver después. El tuyo está en el intervalo que la literatura asocia a un resultado que se mantiene.',
    /* ⚠️ "NO CONMIGO" — es la única línea de la aplicación que dice, en
       primera persona, lo que NO hace. Existe porque la alternativa era
       opinar sobre un ritmo que puede tener causa clínica. */
    significaAtencao: 'El ritmo es una conversación para tener con tu equipo, no conmigo. Llevo el número ordenado a la consulta si quieres.',
  },

  adesao: {
    tituloPerfeita: 'No has atrasado ninguna inyección desde el comienzo',
    titulo: (pct: number) => `Mantuviste ${pct}% de las inyecciones al día`,
    texto: (aplicacoes: number, ressalva: string) =>
      `Son ${aplicacoes} inyecciones desde el inicio del tratamiento, ${ressalva}.`,
    textoQuaseTodas: 'prácticamente todas en la fecha correcta',
    textoComAtrasos: 'con algunos atrasos en el camino',
    q: '¿Cómo funciona el ciclo de la medicación?',
    evid: (pct: number, aplicacoes: number) =>
      ({ valor: `${pct}%`, unidade: '', legenda: `${aplicacoes} inyecciones desde el inicio` }),
    significaAlta: 'Esa consistencia es uno de los factores que más pesan en una buena respuesta al medicamento. El nivel de la sustancia en el cuerpo depende de la regularidad, no del esfuerzo — y es el tipo de cosa que solo aparece cuando alguien mira el historial entero.',
    /* ⚠️ LA VERSIÓN CON ATRASOS EXPLICA EL COSTO Y NO RECLAMA LA FALTA.
       "Cada atraso deja una ventana en que el efecto cae antes de tiempo" es
       el mecanismo; "trata de no atrasarte" sería el reto que esta pantalla
       no da. */
    significaBaixa: 'La regularidad pesa más que la dosis exacta del día: cada atraso deja una ventana en que el efecto cae antes de tiempo, y es en ella donde el hambre suele volver más fuerte.',
  },
};
