/* ============================================================
   LOS RECORDATORIOS — los cinco tipos y cómo se describe cada uno · es-419

   ⚠️ Las razones viven en ../pt-BR/alertas.ts. Cada tipo tiene tres
   piezas, y la del medio existe por ancho: `titulo` es el nombre en la
   pantalla de configuración, `curto` el mismo nombre en una línea
   apretada al lado de una hora, y `desc` lo que hace, en una frase.

   ⚠️ "APLICACIÓN DE LA DOSIS", y antes decía "de la pluma". La tabla no
   sabe qué forma usa quien está leyendo, y la salida fue la frase que
   sirve igual a pluma, frasco y jeringa. Comprimido todavía lee
   "aplicación" aquí, y es deuda conocida.

   ⚠️ Y EL CHECK-IN ES EL ÚNICO QUE PREGUNTA. Los otros cuatro avisan
   sobre cosas que la persona HACE — aplicar, pesarse, tomar agua, comer.
   Por eso mismo es el que más se pierde: nada en el día recuerda que hay
   que responder.
   ============================================================ */

export const alertas = {
  dose: 'Inyección de la dosis',
  doseCurto: 'Inyección',
  doseDesc: 'Un aviso antes de la próxima dosis, para mantener el tratamiento al día.',

  checkin: 'Check-in del día',
  checkinCurto: 'Check-in',
  checkinDesc: 'Un toque para responder cómo te fue hoy — sueño, hambre, energía y ánimo.',

  peso: 'Pesarte',
  pesoCurto: 'Pesarte',
  pesoDesc: 'Un toque los días en que quieres subirte a la balanza.',

  agua: 'Hidratación',
  aguaCurto: 'Hidratación',
  aguaDesc: 'Empujoncitos para tomar agua — ayudan con la saciedad y las náuseas.',

  proteina: 'Proteína',
  proteinaCurto: 'Proteína',
  proteinaDesc: 'Recordatorio para priorizar la proteína en las comidas del día.',

  noDia: 'El mismo día',
  diasAntes: (n: number) => `${n} día${n > 1 ? 's' : ''} antes`,

  /* ⚠️ LOS TRES ATAJOS DE SEMANA SON NOMBRE DE CONJUNTO, no enumeración.
     "Lunes, martes, miércoles, jueves, viernes" es correcto y nadie lo
     lee; "Días hábiles" es lo mismo en dos palabras. */
  todoDia: 'Todos los días',
  diasUteis: 'Días hábiles',
  fimDeSemana: 'Fin de semana',
  listaDeDias: (primeiro: string, resto: string[]) =>
    primeiro + (resto.length ? `, ${resto.join(', ')}` : ''),

  /* ⚠️ EL INTERVALO SE DICE COMO REGLA, no como lista. "Cada 2 h, de 8 a
     20 h" es una frase; las siete horas que genera no cabrían en la línea,
     y cabrían menos todavía en la cabeza de quien solo quiere revisar lo
     que configuró. */
  aCada: (cada: number, de: number, ate: number) => `cada ${cada} h, de ${de} a ${ate} h`,
  quandoEHoras: (quando: string, horas: string) => `${quando} · ${horas}`,

  tela: {
    alertaDe: (tipo: string) => `Alerta de ${tipo}`,
    novoAlerta: 'Nueva alerta',
    salvar: 'Guardar',
    criar: 'Crear alerta',
    apagar: 'Borrar esta alerta',

    oQueAvisar: 'Qué avisar',

    antecedencia: 'Antelación',
    antecedenciaAjuda: 'Contada a partir de la fecha de tu próxima inyección.',

    diasDaSemana: 'Días de la semana',
    diasDaSemanaAjuda: 'Sin ninguno marcado, la alerta suena todos los días.',

    quandoTocar: 'Cuándo suena',
    modoHorarios: 'Horarios',
    modoIntervalo: 'Intervalo',

    horarios: 'Horarios',
    horariosAjuda: 'Puedes marcar más de uno — la alerta suena en cada uno de ellos.',

    aCada: 'Cada',
    aCadaHoras: (horas: number) => `${horas}h`,
    comeca: 'Empieza',
    ate: 'Hasta',
    ateAjuda: (avisos: number, cada: number) =>
      `${avisos} avisos por día, cada ${cada} horas.`,

    tocaEm: (quando: string) => `Suena ${quando}`,
    semHorario: 'Sin horario marcado',
  },
  telaLembretes: {
    titulo: 'Recordatorios',
    lead: 'Los avisos que crees aparecen aquí, en el orden en que suenan.',
    criar: 'Crear alerta',

    proximo: (quando: string) => `Próximo: ${quando}`,
    desligado: 'Apagado',
    guardado: 'Guardado — los avisos salen por el celular',
    semAviso: 'Sin aviso mientras esté bloqueado',

    bloqueados: 'Los avisos están bloqueados',
    bloqueadosTexto: 'El aparato está bloqueando las notificaciones de esta aplicación. Mientras siga así, nada de lo que actives aquí va a llegar.',
    semNavegador: 'En el navegador no se puede avisar',
    semNavegadorTexto: 'Lo que crees queda guardado y empieza a valer cuando abras la aplicación en el celular.',
    abrirConfiguracoes: 'Abrir la configuración',

    vazio: 'Ninguna alerta todavía',
    vazioTexto: (assuntos: string) => `${assuntos} — crea las que tengan sentido para tu rutina.`,

    convite: 'Un aviso es una invitación, no una exigencia. Si un día se pasa, aquí no se acumula nada.',
  },
  /* NOTIFICACIONES — ver ../pt-BR/alertas.ts. El aviso de dosis reutiliza
     `avisos`; el de existencias, el veredicto de Inyecciones. */
  telaNotificacoes: {
    titulo: 'Notificaciones',
    lead: 'Lo que te contamos en los últimos días.',
    todos: 'Todas',
    origemTratamento: 'Tratamiento',
    origemMensagens: 'Mensajes',
    vazio: 'Nada por aquí',
    vazioTexto: 'Cuando tengamos algo que decirte, aparecerá en esta lista.',
    configurar: 'Configurar recordatorios',
    ligados: (n: number) => (n === 0 ? 'Ninguna alerta activa' : n === 1 ? '1 alerta activa' : `${n} alertas activas`),

    insightTitulo: 'Nuevo insight',
    respondeu: (autor: string) => `${autor} respondió`,
    examesTitulo: 'Exámenes importados',
    examesCorpo: (nome: string, marcadores: number) =>
      `${nome}: ${marcadores} ${marcadores === 1 ? 'marcador, ordenado' : 'marcadores, ordenados'} por fecha.`,
    /* El `falta` llega listo — "Faltan 5 pesajes". */
    conquistaCorpo: (desc: string, falta: string) => `${desc}. ${falta} para el siguiente nivel.`,
  },
};
