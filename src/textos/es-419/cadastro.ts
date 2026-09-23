/* ============================================================
   EL REGISTRO — diecinueve preguntas, la pantalla más grande · es-419

   ⚠️ Las razones viven en ../pt-BR/cadastro.ts. Dos que mandan:

   LAS PREGUNTAS SE CONJUGAN. Quien todavía va a empezar no tiene nada en
   presente que responder, así que medicamento, forma, dosis, frecuencia y
   seguimiento vienen en par — `Agora` y `Futuro`.

   CADA SUBTÍTULO DICE POR QUÉ PREGUNTAMOS, y el de la identidad dice la
   razón VERDADERA, no la conveniente: la identidad de género no entra en
   ninguna cuenta aquí. Prometer un beneficio que no existe es como se
   pierde la confianza de quien se detuvo a leer.

   ⚠️ Y EL DEL SEGUIMIENTO NO PUEDE SONAR A OFERTA. En una pregunta que
   nadie verifica, un menú de ventajas es una invitación a mentir para
   desbloquear la versión mejor — y quien miente ahí recibe una aplicación
   que pasa a hablarle de consultas que no tiene.
   ============================================================ */

export const cadastro = {
  aberturaTitulo: 'La compañía en tu camino de ',
  aberturaTituloForte: 'transformación',
  aberturaTexto: 'Más que acompañar resultados, es entender el camino detrás de ellos. Una experiencia inteligente que aprende contigo y se adapta a cada etapa.',
  comecar: 'Empezar',

  verPlanos: 'Ver planes',

  titulos: {
    nome: '¿Cómo podemos llamarte?',
    identidade: '¿Cómo te identificas?',
    nascimento: '¿Cuándo naciste?',
    tratamento: '¿Ya estás en tratamiento?',
    inicio: '¿Cuándo empezaste?',
    medicamentoFuturo: '¿Qué medicamento piensas usar?',
    medicamentoAgora: '¿Qué medicamento usas?',
    formaFuturo: '¿Cómo vas a aplicártelo?',
    formaAgora: '¿Cómo te lo aplicas?',
    doseFuturo: '¿Con qué dosis piensas empezar?',
    doseAgora: '¿Cuál es tu dosis actual?',
    frequenciaFuturo: '¿Cada cuánto vas a aplicártelo?',
    frequenciaAgora: '¿Cada cuánto te lo aplicas?',
    corpo: '¿Cuáles son tus medidas actuales?',
    meta: '¿Cuál es tu meta de peso?',
    ritmo: '¿Qué ritmo quieres seguir para llegar?',
    motivacao: '¿Qué te está trayendo a este camino?',
    atividade: '¿Cuál es tu nivel de actividad física?',
    restricao: '¿Tienes alguna restricción alimentaria?',
    saude: 'Conecta tu aplicación de salud',
    acompanhamentoFuturo: '¿Piensas tener el seguimiento de un especialista?',
    acompanhamentoAgora: '¿Tienes el seguimiento de un especialista?',
    consentimento: 'Información importante',
  },

  subs: {
    nome: 'Puede ser solo el primer nombre, o el apodo que te gusta.',
    identidade: 'Es para hablarte de la forma correcta. Lo que entra en las cuentas de salud es tu cuerpo, y eso viene en las próximas preguntas.',
    nascimento: 'Cada etapa de la vida tiene necesidades distintas — y la edad entra en los rangos de referencia de tus exámenes.',
    tratamento: 'Solo para saber dónde estás ahora.',
    inicio: 'Aproximado está bien. De aquí sale tu semana de tratamiento, y este peso es el que se vuelve el comienzo de tu curva.',
    medicamento: 'De él salen la escalera de dosis y el intervalo entre las inyecciones.',
    forma: 'El preparado magistral sale de la farmacia de las dos formas, y lo que cambia es lo que tienes en la mano a la hora de aplicártelo.',
    doseComEscada: (med: string) => `En el orden de titulación de ${med}.`,
    doseSemEscada: 'El preparado magistral no tiene escalera de dosis estándar — el número es el de tu receta.',
    /* ⚠️ EL RECIPIENTE VIENE CONCORDADO — "del frasco", "de la pluma". Ver
       T.formas.doDa, en textos/es-419/formas.ts. */
    frequencia: (doDaForma: string) => `De aquí salen el conteo del ciclo, los recordatorios y las existencias ${doDaForma}.`,
    corpo: 'Con la altura y el peso calculamos tu IMC y armamos tus metas diarias de proteína y agua.',
    meta: 'Es la referencia que usamos para mostrar cuánto has avanzado. Puedes cambiarla cuando quieras.',
    ritmo: (aPercorrer: string) => `${aPercorrer} por recorrer.`,
    motivacao: 'No hay respuesta correcta. Vale la que recordarías en un día difícil.',
    restricao: 'La proteína es el eje de este tratamiento, y viene de lugares distintos según lo que comas. Puedes marcar más de una.',
    atividade: 'Entra en tu meta diaria de agua — quien se mueve más pierde más líquido — y dice de dónde estás partiendo.',
    saude: 'Tus datos de salud ayudan a entender tu evolución — sin que tengas que registrarlo todo.',
    acompanhamento: 'Esta respuesta abre lo que está ligado al seguimiento médico — notas y preparación para las consultas.',
    consentimento: 'Dos cosas antes de empezar: qué hacemos por tu tratamiento, y qué pasa con lo que registras.',
  },

  seuNome: 'Tu nombre',

  feminino: 'Femenino',
  masculino: 'Masculino',
  outro: 'Otro',
  prefiroNaoInformar: 'Prefiero no decirlo',

  jaIniciei: 'Ya empecé el tratamiento',
  jaInicieiSub: 'Ya me apliqué al menos una dosis',
  vouComecar: 'Voy a empezar pronto',
  vouComecarSub: 'Todavía no me apliqué',

  /* ⚠️ "TODAVÍA NO SÉ" APARECE DOS VECES, con subtítulos distintos — una en
     el medicamento y otra en la dosis. El rótulo es el mismo porque la
     duda es la misma; lo que cambia es lo que le respondemos. */
  aindaNaoSei: 'Todavía no sé',
  aindaNaoSeiMedSub: 'Puedes definirlo después en tu perfil',
  aindaNaoSeiDoseSub: 'Casi todo el mundo empieza por la más baja',

  menosComumAqui: 'MENOS COMÚN AQUÍ',
  manipuladoSub: 'Preparada en farmacia de compuestos',
  formaSeringaSub: 'Cargas la dosis con una jeringa',
  formaCanetaSub: 'Ya viene precargada, lista para aplicar',

  doseDeInicio: 'Dosis de inicio',
  doseMaxima: 'Dosis máxima',

  todosOsDias: 'Todos los días',
  aCadaDias: (d: number) => `Cada ${d} días`,
  padrao: 'Estándar',
  outroIntervaloTitulo: 'Otro intervalo',
  outroIntervalo: 'Tú dices cada cuántos días',

  pesoDeHoje: 'PESO DE HOY',
  pesoDeQuandoComecou: 'PESO DE CUANDO EMPEZASTE',
  querPerder: 'Quieres perder',
  querGanhar: 'Quieres ganar',

  /* ⚠️ NINGÚN RITMO PROMETE NADA, y por eso los nombres son de RITMO y no
     de resultado. Lo que la literatura describe como pérdida sostenida
     queda alrededor de 0,5 a 1 kg por semana; arriba de eso la cuenta es
     del cuerpo y de la dosis, no de la voluntad. */
  ritmoDevagar: 'Despacio y constante',
  ritmoConstante: 'Ritmo constante',
  ritmoAcelerado: 'Acelerado',
  ritmoMaisRapido: 'Lo más rápido que se pueda',
  ritmoPorSemana: (peso: string) => `${peso} por semana`,
  ritmoAlcanca: (metaProsa: string, mes: string) => `Alcanzas ${metaProsa} en ${mes}`,

  semRestricao: 'Ninguna',
  semRestricaoSub: 'Como de todo',

  /* ⚠️ EL PASO DE SALUD TIENE TITULAR PROPIO, y no la pregunta seca de los
     otros: es el único del formulario que pide una AUTORIZACIÓN en vez de
     una respuesta, y lo que decide a alguien a autorizar no es saber qué
     queremos — es saber qué gana. El cierre carga la promesa. */
  saudeManchete: 'Todo lo que tu cuerpo muestra, <b>en un solo lugar</b>',
  saudeLembrarTitulo: 'Una cosa menos que recordar',
  saudeLembrarTexto: 'Peso, sueño y entrenamiento entran solos.',
  saudeCurvaTitulo: 'Tu curva, más completa',
  saudeCurvaTexto: 'Lo que tu dispositivo mide ya entra aquí.',
  saudeControleTitulo: 'Tú sigues teniendo el control',
  saudeControleTexto: 'Elige qué compartir, y apágalo cuando quieras.',
  saudeConectar: 'Conectar mis datos',
  /* ⚠️ "HACERLO DESPUÉS", y no "ahora no". El rechazo que cierra la puerta
     es más fácil de dar que el que lo posterga — y este lo posterga de
     verdad: la pantalla de Integraciones sigue en el perfil. */
  saudeDepois: 'Hacerlo después',

  sim: 'Sí',
  digiteONome: 'Escribe el nombre',
  nadaEnviado: 'Sirve para tenerlo a mano a lo largo de tu camino. No se le envía nada a esa persona.',
  vouMeTratar: 'Me voy a tratar con un médico o clínica',
  meAcompanha: 'Un médico o clínica acompaña mi tratamiento',
  porContaPropria: 'No, por mi cuenta',
  porContaPropriaSub: 'Puedes agregarlo después, cuando quieras',
  quemVaiAcompanhar: 'QUIÉN VA A SEGUIR TU TRATAMIENTO (OPCIONAL)',
  quemAcompanha: 'QUIÉN SIGUE TU TRATAMIENTO (OPCIONAL)',

  /* ⚠️ EL RÓTULO DICE QUÉ SIGNIFICA EL TOQUE. "Continuar" sería la persona
     consintiendo sin saber que consintió — y el consentimiento para datos
     de salud tiene que ser un acto claro, no el efecto secundario de
     avanzar una pantalla. */
  concordarEMontar: 'Aceptar y armar mi plan',
  ficaRegistrado: 'Queda registrado con la fecha de hoy.',
  salvar: 'Guardar',
  continuar: 'Continuar',

  /* ⚠️ LAS TRES FRASES DICEN QUÉ SE ESTÁ HACIENDO, en el orden en que se
     hace. La barra anda sola y no finge progreso real: mide el tiempo de
     la espera, que es el único número honesto que existe aquí. */
  montandoTitulo: 'Armando tu plan',
  faseLendo: 'Leyendo tus respuestas',
  faseCalculando: 'Calculando tus metas del día',
  faseDesenhando: 'Dibujando tu camino',

  telaPlano: {
    planoPronto: '¡tu plan personalizado está listo!',
    manterOPeso: 'mantener tu peso',
    objetivo: (perder: number, alvo: string, marca: string): [string, string, string] => [
      `Para ${perder > 0.05 ? 'perder ' : perder < -0.05 ? 'ganar ' : ''}`,
      alvo,
      `${marca}.`,
    ],
    marcaRegistrada: (medicamento: string) => ` con ${medicamento}®`,
    marcaGenerica: (medicamento: string) => ` con ${medicamento}`,
    elaboradoPensando: 'Tu plan fue armado pensando',
    nasSuasRespostas: 'En tus respuestas',
    emEstudos: 'En estudios sobre GLP-1',

    secaoMetas: 'TUS METAS DEL DÍA',
    secaoDose: 'TU DOSIS',
    secaoAteAMeta: 'HASTA TU META',
    secaoCorpo: 'TU CUERPO',
    secaoAjuda: 'CÓMO TE AYUDO',
    secaoCiencia: 'LA CIENCIA DETRÁS DE TU PLAN',

    proteinaPorDia: 'PROTEÍNA POR DÍA',
    proteinaTexto: 'Es la primera meta del día. El medicamento quita el hambre, y parte del peso que baja viene de músculo — la proteína es lo que sostiene la masa magra mientras la grasa se va.',
    calorias: 'Calorías',
    agua: 'Agua',

    aindaADefinir: 'Todavía por definir',
    aindaADefinirTexto: 'Cuando sepas el medicamento, armo la escalera de dosis y el ciclo.',
    cicloComeca: 'El ciclo empieza en la primera inyección que registres.',
    cadenciaDiaria: 'todos los días',
    cadenciaSemanal: 'una vez por semana',
    cadenciaDias: (dias: number) => `cada ${dias} días`,

    pesoAPerder: 'Peso a perder',
    pesoAGanhar: 'Peso a ganar',
    emSemanas: (semanas: number) => `en ${semanas} semanas`,
    ressalvaDaCurva: (ritmo: string) =>
      `La bajada no es recta: en los estudios, las primeras semanas rinden más y el ritmo afloja a medida que tu cuerpo se ajusta. Los ${ritmo} por semana que elegiste son un promedio de todo el trayecto, y no una previsión.`,

    imcDeHoje: 'IMC de hoy',
    naSuaMeta: 'En tu meta',

    ajudaDose: 'Cada dosis en el lugar correcto',
    ajudaDoseSub: 'la rotación de los lugares y el ciclo de la dosis, sin que cuentes',
    ajudaEnjoo: 'Las náuseas en números',
    ajudaEnjooSub: 'lo que sientes se vuelve patrón, y el patrón va a la consulta',
    ajudaPeso: 'Tu curva de peso',
    ajudaPesoSub: 'cada pesaje entra en la línea, con la lectura de lo que cambió',
    ajudaResumo: 'Un resumen para la consulta',
    ajudaResumoSub: 'dosis, síntomas y peso ordenados en una sola página',

    feitoEmCimaDeEvidencia: 'Hecho sobre evidencia',
    evidenciaTexto: 'Las metas, la curva y las prioridades de este plan siguen directrices de salud pública y ensayos clínicos revisados por pares.',
    rodape: 'Acompañamos tu recorrido todos los días y ordenamos lo que registras — pero quien conduce el tratamiento es tu equipo de salud. Estos números son un punto de partida para esa conversación, y no una prescripción.',

    voltar: 'Volver',
  },

  telaDados: {
    titulo: 'Tus datos',
    lead: 'Son las respuestas de tu registro, y de ellas salen tu IMC, tus metas del día y la previsión del plan. Cambiar algo aquí rehace esos números.',

    tratamento: 'Tratamiento',
    medicamento: 'Medicamento',
    dose: 'Dosis',
    doseSub: (valor: string, unidade: string) => `${valor} ${unidade}`,
    frequencia: 'Frecuencia',

    corpoERitmo: 'Cuerpo y ritmo',
    altura: 'Altura',
    pesoInicial: 'Peso inicial',
    metaDePeso: 'Meta de peso',
    ritmoEscolhido: 'Ritmo elegido',
    porSemana: (peso: string) => `${peso} por semana`,
    semPesoAPerder: 'Sin peso a perder',

    nome: 'Nombre',
    sexo: 'Sexo',
    nascimento: 'Nacimiento',
    nascimentoSub: (data: string, idade: number) => `${data} · ${idade} años`,
    atividadeFisica: 'Actividad física',
    restricoesAlimentares: 'Restricciones alimentarias',
    oQueTeTrouxe: 'Qué te trajo',

    rodape: 'Para registrar un pesaje nuevo, usa el botón de registrar.',
  },
};
