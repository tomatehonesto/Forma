/* ============================================================
   LOS MARCADORES DE EXAMEN — el bloque de texto clínico más grande · es-419

   ⚠️ Las razones viven en ../pt-BR/marcadores.ts. Las que mandan sobre
   esta traducción:

   ⚠️⚠️ LAS CLAVES DE ESTAS TABLAS NO SE TRADUCEN. "HbA1c", "Glicemia
   jejum", "Ferritina" son lo que queda GRABADO en el registro del examen,
   en `e.marker` — no son rótulo de pantalla, son dato. Traducirlas
   rompería el vínculo entre el examen que alguien anotó el año pasado y la
   tabla nueva. Por eso existe `nome`: la clave es dato y el nombre es
   pantalla.

   Y no es traducción de rótulo: en los Estados Unidos TGO y TGP se llaman
   AST y ALT, que es otro nombre en el informe, no la misma palabra en otra
   lengua. En América Latina los informes usan TGO y TGP, y es lo que la
   persona va a ver en su papel.

   ⚠️ Y NINGUNO DE ESTOS TEXTOS PUEDE VOLVERSE CONDUCTA EN LA TRADUCCIÓN.
   Las trabas están escritas en cada sección: son lo que separa una
   aplicación que explica de una que receta.
   ============================================================ */

export type SobreOMarcador = { oQueE: string; porQue: string; afeta: string };

const NOME: Record<string, string> = {
  'HbA1c': 'HbA1c',
  'Glicemia jejum': 'Glucemia en ayunas',
  'Insulina': 'Insulina',
  'Colesterol total': 'Colesterol total',
  'HDL': 'HDL',
  'LDL': 'LDL',
  'Triglicerídeos': 'Triglicéridos',
  'Creatinina': 'Creatinina',
  'TGO': 'TGO',
  'TGP': 'TGP',
  'TSH': 'TSH',
  'T4 livre': 'T4 libre',
  'Vitamina D': 'Vitamina D',
  'Vitamina B12': 'Vitamina B12',
  'Ferritina': 'Ferritina',
};

/* ⚠️ LA MAYÚSCULA EN MEDIO DE LA FRASE ES REGLA DE IDIOMA, y las letras
   acentuadas del español no son las del portugués: aquí entran la ü y la
   ñ, y sale la ã. "Vitamina D" se vuelve "vitamina D" en medio de una
   frase, pero "HbA1c" y "HDL" se quedan como están: solo cae la mayúscula
   de quien tiene la PRIMERA PALABRA entera en minúsculas después de la
   inicial, que es el dibujo de un nombre común y no de una sigla. */
const NO_MEIO = (nome: string) => {
  const p1 = nome.split(' ')[0];
  return /^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+$/.test(p1) ? nome[0].toLowerCase() + nome.slice(1) : nome;
};

/* ⚠️ NINGUNA DEFINICIÓN CITA OTRO MARCADOR NI TÉRMINO DE INFORME. La regla:
   si la frase necesita una segunda frase para entenderse, no es una
   definición, es una entrada de diccionario.

   ⚠️ Y NINGUNA DICE SI ESTÁ BIEN. Una definición que insinúa diagnóstico es
   diagnóstico con ropa de glosario.

   ⚠️ `afeta` ES UN COMPLEMENTO, NO UNA FRASE. Entra siempre después de un
   verbo que ya carga la salvedad — "hace diferencia…", "es buena señal…" —
   y por eso empieza en la preposición. Escrito como frase entera, cada
   marcador tendría que concordar en género con su propio nombre, y "Tu
   HbA1c" / "Tu ferritina" es el tipo de error que solo aparece en
   producción. */
const SOBRE = {
  'HbA1c': {
    oQueE: 'Cuánta azúcar quedó pegada a los glóbulos rojos de la sangre.',
    porQue: 'Como esos glóbulos viven cerca de tres meses, el resultado cuenta el promedio del azúcar en ese período, y no solo el del día del examen.',
    afeta: 'para el control del azúcar a lo largo de los meses',
  },
  'Glicemia jejum': {
    oQueE: 'La cantidad de azúcar en la sangre después de horas sin comer.',
    porQue: 'Es la medida más directa de cómo el cuerpo administra la glucosa en reposo.',
    afeta: 'para cómo el cuerpo maneja el azúcar',
  },
  'Insulina': {
    oQueE: 'La hormona que hace que el azúcar salga de la sangre y entre en las células.',
    porQue: 'Cuando está alta, suele ser señal de que el cuerpo necesita producir más para hacer el mismo trabajo.',
    afeta: 'para el esfuerzo del cuerpo en mantener el azúcar en orden',
  },
  'Colesterol total': {
    oQueE: 'Todo el colesterol que está circulando en tu sangre, sumado.',
    porQue: 'Solo dice poco, porque junta en una sola cuenta tipos de colesterol que hacen cosas opuestas en el cuerpo.',
    afeta: 'para la salud de las arterias a lo largo de los años',
  },
  'HDL': {
    oQueE: 'El colesterol que hace la limpieza: recoge grasa de las arterias y se la lleva.',
    porQue: 'Es el único examen de colesterol en que un número más alto es la buena noticia.',
    afeta: 'para la limpieza de grasa de las arterias',
  },
  'LDL': {
    oQueE: 'El colesterol que lleva grasa a los tejidos del cuerpo.',
    porQue: 'En exceso, es el que se va acumulando en la pared de las arterias a lo largo de los años.',
    afeta: 'para la salud de las arterias a lo largo de los años',
  },
  'Triglicerídeos': {
    oQueE: 'La grasa que circula en la sangre, venida de la comida y del hígado.',
    porQue: 'Responde rápido a lo que se come y al peso, y por eso suele ser el primero en moverse en un tratamiento.',
    afeta: 'para la grasa en la sangre y para el corazón',
  },
  'Creatinina': {
    oQueE: 'Un residuo que el músculo produce todo el tiempo y que el riñón desecha.',
    porQue: 'Como quien lo saca de la sangre es el riñón, lo que queda ahí es una de las formas de ver si está dando abasto.',
    afeta: 'para el trabajo de los riñones',
  },
  'TGO': {
    oQueE: 'Una sustancia que está guardada dentro de las células del hígado y del músculo.',
    porQue: 'Solo aparece en la sangre cuando esas células se rompen — por eso sirve de aviso de que algo está irritando el hígado.',
    afeta: 'para la salud del hígado',
  },
  'TGP': {
    oQueE: 'Una sustancia que está guardada casi solo dentro de las células del hígado.',
    porQue: 'Como casi no existe en otro lugar del cuerpo, cuando aparece en la sangre la dirección es bastante más segura.',
    afeta: 'para la salud del hígado',
  },
  'TSH': {
    oQueE: 'El recado que el cerebro le manda a la tiroides pidiéndole que trabaje.',
    porQue: 'Sube cuando la tiroides está lenta y baja cuando está acelerada — es el termostato, y no la temperatura.',
    afeta: 'para el ritmo del metabolismo',
  },
  'T4 livre': {
    oQueE: 'La hormona que la tiroides produce, en la parte que el cuerpo puede usar.',
    porQue: 'Muestra lo que la tiroides está entregando de hecho, y por eso viene siempre en dupla con el examen anterior.',
    afeta: 'para el ritmo del metabolismo',
  },
  'Vitamina D': {
    oQueE: 'La vitamina que el cuerpo produce con sol y absorbe de la comida.',
    porQue: 'Participa en la absorción de calcio y en el funcionamiento del músculo y la inmunidad.',
    afeta: 'para los huesos, el músculo y la inmunidad',
  },
  'Vitamina B12': {
    oQueE: 'Una vitamina que viene de alimentos de origen animal.',
    porQue: 'Es necesaria para los glóbulos rojos y para los nervios, y quien come menos suele reponerla con atención.',
    afeta: 'para los nervios y la producción de sangre',
  },
  'Ferritina': {
    oQueE: 'La despensa de hierro del cuerpo — lo que queda guardado dentro de las células.',
    porQue: 'Por eso muestra el stock, y no el hierro que está circulando en la sangre hoy.',
    afeta: 'para el stock de hierro, que sostiene el ánimo',
  },
} satisfies Record<string, SobreOMarcador>;

/* ⚠️ ES LA PARTE QUE VUELVE EL EXAMEN UNA COSA COMPRENSIBLE. Un número de
   examen sin causas es un veredicto; con causas, se vuelve algo que tiene
   historia y que la persona reconoce: "ayuno corto", "entrenamiento fuerte
   la víspera", "bajé de peso".

   ⚠️ Y NINGÚN ÍTEM DICE QUÉ HACER. "Alcohol en los días anteriores" es un
   hecho sobre el marcador; "deja de tomar" sería conducta, y la conducta es
   de quien acompaña a la persona. La línea entre educar y recetar es esa, y
   pasa exactamente aquí.

   ⚠️ SON CAUSAS COMUNES, Y NO LA LISTA COMPLETA. */
const INFLUENCIAS = {
  'HbA1c': [
    'El promedio de glucosa de los últimos dos a tres meses, y no lo que comiste ayer',
    'Anemia y enfermedades de la sangre, que cambian la vida de los glóbulos rojos y distorsionan el resultado',
    'La pérdida de peso y los medicamentos para la glucosa, que suelen bajarla a lo largo de meses',
  ],
  'Glicemia jejum': [
    'Cuántas horas de ayuno antes de la toma',
    'Dormir mal y el estrés de la víspera, que elevan el azúcar de la mañana',
    'El ejercicio y la pérdida de peso, que tienden a bajarla',
  ],
  'Insulina': [
    'El ayuno antes de la toma, tanto como en la glucemia',
    'La cantidad de grasa corporal, que es lo que más pesa en la cuenta',
    'Suele leerse junto con la glucemia, y no sola',
  ],
  'Colesterol total': [
    'Lo que se come de grasa, pero menos de lo que sugiere su fama',
    'La genética — algunas familias producen más colesterol independientemente de la dieta',
    'La tiroides lenta, que lo eleva sin relación con la comida',
  ],
  'HDL': [
    'El ejercicio aeróbico regular, que es lo que más lo eleva',
    'El tabaquismo, que lo reduce',
    'La genética, con mucho peso en este en particular',
  ],
  'LDL': [
    'La grasa saturada y trans en la alimentación',
    'La pérdida de peso, que suele reducirlo junto con los triglicéridos',
    'La genética, que en algunas familias domina el resultado',
  ],
  'Triglicerídeos': [
    'El ayuno — comer cerca de la toma lo altera mucho, más que en cualquier otro del panel',
    'El alcohol en los días anteriores',
    'El azúcar y la harina en exceso, que el cuerpo convierte en grasa',
  ],
  'Creatinina': [
    'Cuánta masa muscular tiene la persona, porque viene del músculo',
    'La hidratación el día de la toma',
    'El entrenamiento pesado de la víspera, que puede elevarla temporalmente',
  ],
  'TGO': [
    'El ejercicio intenso en los días anteriores, porque también existe en el músculo',
    'El alcohol',
    'La grasa en el hígado, común en quien tiene exceso de peso',
  ],
  'TGP': [
    'La grasa en el hígado, que es la causa más común de alteración leve',
    'El alcohol y algunos medicamentos',
    'La pérdida de peso, que suele reducirla a lo largo de los meses',
  ],
  'TSH': [
    'La hora de la toma — es más alto de madrugada y al comienzo de la mañana',
    'Enfermedades agudas y algunos medicamentos',
    'La reposición de hormona tiroidea, cuando existe',
  ],
  'T4 livre': [
    'El funcionamiento de la tiroides, leído siempre junto al TSH',
    'El embarazo y el estrógeno, que cambian las proteínas que lo transportan',
  ],
  'Vitamina D': [
    'Sol en la piel — cantidad, horario y cuánto del cuerpo queda expuesto',
    'La piel más oscura y el protector solar, que reducen la producción',
    'La suplementación, cuando existe',
    'La estación del año: el invierno suele tirarla abajo',
  ],
  'Vitamina B12': [
    'Los alimentos de origen animal en la dieta',
    'La cirugía bariátrica y algunos remedios para el estómago, que reducen la absorción',
    'La suplementación, cuando existe',
  ],
  'Ferritina': [
    'El stock de hierro del cuerpo',
    'La inflamación y la infección, que la elevan aun sin hierro de sobra — por eso nunca se lee sola',
    'La menstruación abundante, que a lo largo del tiempo reduce el stock',
  ],
} satisfies Record<string, string[]>;

/* ============================================================
   LO QUE SUELE AYUDAR

   ⚠️ ESTA ES LA PARTE PELIGROSA DEL ARCHIVO, Y TIENE CUATRO TRABAS. Las
   razones completas están en ../pt-BR/marcadores.ts:

   1. NADA AQUÍ ES SOBRE MEDICACIÓN. Ningún ítem manda empezar, parar,
      aumentar ni disminuir nada — y donde la reposición es el asunto, la
      frase dice "cuando lo indique quien te acompaña", que es el hecho.

   2. NADA AQUÍ TIENE DOSIS, CANTIDAD NI PLAZO. "La exposición al sol es la
      principal fuente" es información; "veinte minutos por día" es receta,
      y una receta tiene que ser de alguien que examinó a la persona.

   3. NADA AQUÍ PROMETE RESULTADO. Los ítems dicen lo que se SABE sobre el
      marcador, no lo que va a pasar con el número de quien lee.

   4. NADA AQUÍ ES DE TIROIDES NI DE RIÑÓN. TSH, T4 y creatinina quedaron
      fuera a propósito: en el primer caso lo que mueve el número es
      medicación, y en el segundo los consejos más obvios (tomar agua,
      comer proteína) son justamente los que una persona con el riñón
      comprometido no debe seguir por su cuenta. Un marcador sin ítem
      honesto no gana sección.
   ============================================================ */
export type JeitoDeAjudar = { grupo: string; itens: { nome: string; detalhe: string }[] };

const AJUDAR = {
  'HbA1c': [
    {
      grupo: 'En la comida',
      itens: [
        { nome: 'Carbohidrato de absorción lenta', detalhe: 'Los granos integrales, los frijoles y las verduras elevan la glucosa más despacio que la harina blanca y el azúcar' },
        { nome: 'Proteína y fibra en la misma comida', detalhe: 'Reducen el pico de glucosa de lo que se come junto' },
      ],
    },
    {
      grupo: 'En el movimiento',
      itens: [
        { nome: 'Caminar después de comer', detalhe: 'El músculo en actividad consume glucosa sin depender de la insulina' },
        { nome: 'Ejercicio regular', detalhe: 'Mejora la sensibilidad a la insulina, y el efecto se acumula a lo largo de semanas' },
      ],
    },
  ],
  'Glicemia jejum': [
    {
      grupo: 'En la rutina',
      itens: [
        { nome: 'Sueño', detalhe: 'Las noches cortas elevan la glucosa de la mañana siguiente' },
        { nome: 'Última comida más temprano', detalhe: 'Comer muy cerca de dormir suele aparecer en el ayuno del día siguiente' },
      ],
    },
    {
      grupo: 'En el movimiento',
      itens: [
        { nome: 'Actividad aeróbica', detalhe: 'Reduce la glucosa en ayunas a lo largo de semanas, no de días' },
      ],
    },
  ],
  'Insulina': [
    {
      grupo: 'En el peso y en el movimiento',
      itens: [
        { nome: 'Reducción de grasa corporal', detalhe: 'Es lo que más reduce la insulina necesaria para el mismo trabajo' },
        { nome: 'Entrenamiento de fuerza', detalhe: 'Más masa muscular significa más lugar adonde vaya la glucosa' },
      ],
    },
  ],
  'Colesterol total': [
    {
      grupo: 'En la comida',
      itens: [
        { nome: 'Menos grasa saturada y trans', detalhe: 'Las frituras, los embutidos y los industrializados son las fuentes más comunes' },
        { nome: 'Fibras solubles', detalhe: 'La avena, los frijoles y las frutas reducen la absorción de colesterol en el intestino' },
      ],
    },
  ],
  'HDL': [
    {
      grupo: 'En el movimiento',
      itens: [
        { nome: 'Ejercicio aeróbico', detalhe: 'Es lo que más eleva el HDL, y el efecto depende de la regularidad' },
      ],
    },
    {
      grupo: 'En la comida',
      itens: [
        { nome: 'Grasas buenas', detalhe: 'Aceite de oliva, aguacate, nueces y pescados grasos' },
      ],
    },
  ],
  'LDL': [
    {
      grupo: 'En la comida',
      itens: [
        { nome: 'Menos grasa saturada', detalhe: 'Es la que más eleva el LDL — carnes grasas, lácteos enteros, frituras' },
        { nome: 'Fibras solubles', detalhe: 'Avena, frijoles, lentejas y frutas con cáscara' },
      ],
    },
    {
      grupo: 'En el peso',
      itens: [
        { nome: 'Pérdida de peso', detalhe: 'Suele reducir el LDL y los triglicéridos juntos' },
      ],
    },
  ],
  'Triglicerídeos': [
    {
      grupo: 'En la comida',
      itens: [
        { nome: 'Menos azúcar y harina', detalhe: 'El exceso se vuelve grasa en el hígado, y es lo que más eleva este marcador' },
        { nome: 'Alcohol', detalhe: 'Es la causa aislada más común de triglicéridos altos' },
      ],
    },
    {
      grupo: 'En el movimiento',
      itens: [
        { nome: 'Actividad aeróbica', detalhe: 'Los triglicéridos son de los marcadores que responden más rápido' },
      ],
    },
  ],
  'TGO': [
    {
      grupo: 'En el hígado',
      itens: [
        { nome: 'Alcohol', detalhe: 'Es la causa más común de alteración en las dos enzimas' },
        { nome: 'Pérdida de peso', detalhe: 'Reduce la grasa en el hígado, que es la otra causa común' },
      ],
    },
  ],
  'TGP': [
    {
      grupo: 'En el hígado',
      itens: [
        { nome: 'Pérdida de peso', detalhe: 'La grasa en el hígado es la causa más común de alteración leve, y responde al peso' },
        { nome: 'Alcohol', detalhe: 'Desaparece de la cuenta cuando desaparece de la rutina' },
      ],
    },
  ],
  'Vitamina D': [
    {
      grupo: 'En el sol',
      itens: [
        { nome: 'Exposición de la piel', detalhe: 'Es la principal fuente — el protector solar y la ropa que cubre reducen la producción' },
      ],
    },
    {
      grupo: 'En la comida y en la reposición',
      itens: [
        { nome: 'Pescados grasos, yema y hongos', detalhe: 'Son las fuentes alimentarias, y suelen ser insuficientes solas' },
        { nome: 'Suplementación', detalhe: 'Cuando la indique quien te acompaña — la dosis depende de tu nivel' },
      ],
    },
  ],
  'Vitamina B12': [
    {
      grupo: 'En la comida',
      itens: [
        { nome: 'Origen animal', detalhe: 'Carnes, huevos, leche y derivados son las únicas fuentes naturales' },
      ],
    },
    {
      grupo: 'En la absorción',
      itens: [
        { nome: 'Remedios para el estómago', detalhe: 'El uso prolongado reduce la absorción — asunto para llevar a la consulta' },
        { nome: 'Suplementación', detalhe: 'Cuando la indique quien te acompaña, sobre todo después de una cirugía bariátrica' },
      ],
    },
  ],
  'Ferritina': [
    {
      grupo: 'En la comida',
      itens: [
        { nome: 'Hierro de origen animal', detalhe: 'La carne roja, el hígado y los mariscos son los mejor absorbidos' },
        { nome: 'Vitamina C junto', detalhe: 'La naranja, la acerola y el pimiento mejoran la absorción del hierro de los vegetales' },
        { nome: 'Café y té lejos de la comida', detalhe: 'Dificultan la absorción cuando se toman junto' },
      ],
    },
  ],
} satisfies Record<string, JeitoDeAjudar[]>;

export const marcadores = {
  /* Son los únicos rótulos de pantalla de este archivo, y por eso los
     únicos que se traducen sin salvedad. CUÁLES marcadores entran en cada
     categoría no es decisión de idioma — es contenido clínico. */
  catMetabolico: 'Metabólico',
  catLipidico: 'Lipídico',
  catFigadoRim: 'Hígado y riñones',
  catTireoide: 'Tiroides',
  catVitaminas: 'Vitaminas',

  nome: NOME,
  noMeio: NO_MEIO,
  sobre: SOBRE,
  influencias: INFLUENCIAS,
  ajudar: AJUDAR,
};
