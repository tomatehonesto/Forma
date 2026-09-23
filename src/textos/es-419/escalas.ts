/* ============================================================
   LAS REGLAS — qué quiere decir cada número · es-419

   ⚠️ Las razones viven en ../pt-BR/escalas.ts. Las tres que mandan sobre
   esta traducción:

   ⚠️⚠️ ESTE ES EL TEXTO QUE LA PERSONA TOCA, no el que lee. Cambiar un
   escalón de lugar no cambia una frase: cambia lo que queda GRABADO. El 4
   de hoy pasaría a significar otra cosa que el 4 de ayer, y la serie que
   alimenta el radar, las metas y el resumen de la consulta se quedaría sin
   sentido. Hay que mantener el ORDEN y la distancia entre escalones antes
   de pensar en las palabras.

   ⚠️⚠️ Y NINGUNA FRASE PIDE CONCORDANCIA DE GÉNERO. El español la cobra en
   el participio igual que el portugués — "cansado/cansada" —, y la misma
   frase tiene que servir a cualquiera que use la aplicación. La salida es
   la que ya se usó allá: elegir verbo que no la pida. "Tuve que
   acostarme", y no "quedé acostada".

   ⚠️ EL ESPACIO ANTES DE LA "h" ES INQUEBRABLE, y aquí va escrito como
   ` ` a propósito. En el archivo en portugués es el carácter
   invisible, y ya se perdió una vez: alguien redigitó los cinco escalones
   con espacio común y nada lo acusó hasta la conferencia byte a byte. Un
   escape no se pierde al copiar.
   ============================================================ */

export const escalas = {
  energia: ['Sin fuerzas', 'Arrastrando el día', 'Alcanzó para el día', 'Con ánimo', 'Energía de sobra'],

  sono: ['5 h o menos', 'Cerca de 6 h', 'Cerca de 7 h', 'Cerca de 8 h', '9 h o más'],

  humor: ['Un día difícil', 'Medio para abajo', 'Un día normal', 'Un buen día', 'Un gran día'],

  /* ⚠️ EL HAMBRE ES LO CONTRARIO DE LA SACIEDAD, y el radar lee saciedad.
     Por eso 1 es el hambre MENOR: la regla sube junto con el síntoma, como
     las otras. Invertir el orden aquí invierte el eje del radar. */
  fome: ['Sin hambre', 'Poca hambre', 'Hambre normal', 'Bastante hambre', 'Hambre todo el día'],

  /* La red de seguridad, para un síntoma que todavía no tiene regla
     propia. */
  intensidade: ['Apenas lo noté', 'Leve', 'Molestó', 'Estorbó el día', 'Se apoderó del día'],

  sintoma: {
    nausea: ['Un leve revoltijo', 'Náuseas que van y vienen', 'Náuseas constantes', 'Casi vomité', 'Vomité'],
    constip: ['Fui con esfuerzo', 'Un día sin ir', 'Dos días sin ir', 'Tres días sin ir', 'Cuatro días o más'],
    /* ⚠️ EL PISO ES UN RANGO, Y NO "UNA VEZ", y esto es decisión clínica y
       no de redacción: una ida blanda no es diarrea. La definición de la
       OMS empieza en tres evacuaciones blandas en el día. Con el piso en
       una vez, la escala llamaría síntoma a lo que todavía está dentro de
       lo normal de mucha gente — y una columna que le llama diarrea a todo
       no sirve para leer nada después.

       El escalón 1 es el "blando, pero todavía no es eso", el 2 es donde la
       OMS pasa a llamarlo diarrea, y el 5 es el rango que la graduación
       clínica trata como grave. Los cortes van en los mismos NÚMEROS, no
       en las mismas palabras. */
    diarreia: ['Una o dos veces', 'Tres veces', 'Cuatro veces', 'Cinco a seis veces', 'Siete o más'],
    refluxo: ['Ardor leve', 'Después de las comidas', 'Varias veces al día', 'Estorbó para comer', 'No pude acostarme'],
    fadiga: ['Cansancio leve', 'Me cansé más rápido', 'Tuve que bajar el ritmo', 'Tuve que acostarme', 'No salí de la cama'],
    cefaleia: ['Una punzada', 'Molestó un poco', 'Necesité un analgésico', 'Estorbó el día', 'Me quedé a oscuras'],
    tontura: ['Leve desequilibrio', 'Al levantarme rápido', 'Varias veces al día', 'Tuve que sostenerme', 'No pude estar de pie'],
    /* ⚠️ EL VÓMITO SE CUENTA, NO SE GRADÚA: "estorbó el día" no dice nada
       sobre vomitar, y el número de veces es lo que el equipo va a
       preguntar. */
    vomito: ['Una vez', 'Dos veces', 'Tres veces', 'Cuatro o más', 'No pude parar'],
    dor: ['Una molestia', 'Cólico leve', 'Cólico constante', 'Tuve que parar el día', 'Dolor que no pasó'],
  },

  /* ⚠️ LAS CLAVES SON DATO Y NO SE TRADUCEN: 'normal', 'preso', 'solto' y
     'alterna' son lo que queda grabado en `gut`. Solo el rótulo viene de
     aquí.

     ⚠️ Y "ALTERNÓ" ES VALOR DE PRIMERA CLASE, no caso raro. Estreñirse y
     soltarse son las dos puntas del mismo efecto — el medicamento
     desacelera el tracto entero. */
  intestino: {
    normal: 'Normal',
    preso: 'Estreñido',
    solto: 'Suelto',
    alterna: 'Alternó',
  },

  /* ⚠️ A RÉGUA SEM RESPOSTA DIZ QUE ESTÁ SEM RESPOSTA, e não zero. É a
     mesma regra dos três silêncios da Jornada: um dia sem resposta é um
     dia sem resposta. Mora no topo de `escalas` porque quem a escreve é o
     componente da régua, que serve a mais de uma tela. */
  aindaNaoRespondi: 'Todavía no respondí',

  nomes: {
    nausea: 'Náusea',
    intestino: 'Intestino',
    vomito: 'Vómito',
    dor: 'Dolor abdominal',
    refluxo: 'Reflujo',
    fadiga: 'Fatiga',
    cefaleia: 'Dolor de cabeza',
    tontura: 'Mareo',
    outro: 'Otro',
    preso: 'Intestino estreñido',
    solto: 'Intestino suelto',
  },

  tela: {
    titulo: 'Síntomas',
    diasRespondidos: (quantos: number, de: number) =>
      `${quantos} ${quantos === 1 ? 'día respondido' : 'días respondidos'} en los últimos ${de}`,
    nenhumDia: (de: number) => `Ningún día respondido en los últimos ${de}`,

    nestaSemana: 'Esta semana',
    semRespostaSemana: 'Todavía no respondiste sobre síntomas esta semana. Es en el check-in donde entran.',
    fazerCheckin: 'Hacer check-in',
    nenhumSintoma: 'Ningún síntoma esta semana',
    nenhumSintomaSub: (respondidos: number) =>
      `${respondidos} ${respondidos === 1 ? 'día respondido' : 'días respondidos'}, ninguno con queja.`,
    diasDe: (dias: number, respondidos: number) =>
      `${dias} de ${respondidos} ${respondidos === 1 ? 'día' : 'días'}`,
    noPiorDia: (legenda: string) => `En el peor día: ${legenda}`,
    voceEscreveuEm: (data: string) => `Escribiste el ${data}`,

    aoLongoDoCiclo: 'A lo largo del ciclo',
    aoLongoNota: (dias: number) =>
      `Promedio de las náuseas en cada día después de la inyección, de ${dias} ${dias === 1 ? 'día respondido' : 'días respondidos'}.`,
    dose: 'dosis',

    cicloParecido: 'En los días respondidos hasta ahora, las náuseas aparecen parecidas a lo largo de todo el ciclo — no están siguiendo la dosis.',
    cicloPoucos: 'Todavía son pocos días respondidos para decir si las náuseas acompañan el ciclo. Responde algunos días más y esta cuenta se sostiene.',
    cicloInicio1: 'Las náuseas pesan más el día de la inyección.',
    cicloInicioN: (dias: number) => `Las náuseas pesan más en los ${dias} primeros días después de la inyección.`,
    cicloFim1: 'Las náuseas pesan más la víspera de la próxima inyección.',
    cicloFimN: (dias: number) => `Las náuseas pesan más en los ${dias} días previos a la próxima inyección.`,
    cicloDia0: 'el día de la inyección',
    cicloDiaN: (dia: number) => `el ${dia}.º día después`,
    cicloEspalhado: (lista: string) => `Las náuseas pesan más ${lista}.`,

    comoSeSentiu: 'Cómo te sentiste',
    respostasEm14: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'respuesta' : 'respuestas'} en 14 días`,
    semRespostas: 'Sin respuestas todavía',
    sentir: {
      energia: 'Energía',
      humor: 'Ánimo',
      sono: 'Sueño',
      fome: 'Hambre',
    },
  },

  telaCheckin: {
    titulo: 'Check-in',
    pergunta: '¿Cómo estuvo tu día?',
    lead: 'Responde lo que tenga sentido. Dejarlo en blanco también es una respuesta.',
    salvar: 'Guardar el check-in',

    energia: 'Energía',
    fome: 'Hambre',
    sono: 'Sueño',
    humor: 'Ánimo',

    teveSintoma: '¿Tuviste algún síntoma?',
    comoFoiIntestino: '¿Cómo estuvo el intestino?',
    qualOutroSintoma: '¿Cuál fue el otro síntoma?',
    outroPlaceholder: 'Ej.: gusto metálico en la boca',
    intensidadeDe: (sintoma: string) => `${sintoma} · intensidad`,
  },
};
