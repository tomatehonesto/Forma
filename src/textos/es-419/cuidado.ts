/* ============================================================
   EL CUIDADO — el área de las personas · es-419

   ⚠️ Las razones viven en ../pt-BR/cuidado.ts. La regla que vale para el
   archivo entero es más dura que la de los otros:

   ⚠️⚠️ NINGUNA FRASE DE AQUÍ PUEDE AFIRMAR LO QUE EL EQUIPO HIZO SIN
   SABERLO. "Tu equipo actualizó tu tratamiento" solo es verdad cuando
   existe plataforma — es ella la que trae la indicación nueva. Sin
   servidor, la aplicación sabe que la consulta ocurrió, porque la persona
   lo dijo, y nada más. Por eso casi todo par de frases aquí tiene una
   versión con plataforma y otra sin, y no son variaciones de tono: la
   diferencia entre las dos es una afirmación de hecho.

   ⚠️ Y EL TITULAR NO PONE NOTA. La pastilla de arriba decía "Buena
   adherencia" o "Adherencia baja" — y la tercera aparecía para quien
   perdió dos dosis, que casi siempre las perdió porque se sintió mal. Una
   consecuencia del tratamiento se volvía nota sobre la persona en el
   primer lugar donde cae el ojo. Hoy es "8 de 11 dosis", que dice lo mismo
   sin juzgar y dice más: la nota aplastaba 70% y 89% en el mismo rótulo.
   ============================================================ */

export const cuidado = {
  /* ⚠️ CADA ÍTEM TIENE TRES TEXTOS, y el tercero no es resumen de los
     otros: `texto` es qué hacer, `sub` es por qué ahora, y `rotulo` es
     cómo el TITULAR nombra este ítem cuando los lista en una sola frase.
     "Agendar examen de sangre" es lo que se hace; para la frase, el asunto
     es "exámenes". Traducir los dos igual deshace el titular. */
  pendencias: {
    mensagemUma: 'Responder el mensaje de tu equipo',
    mensagemVarias: (quantas: number) => `Responder los ${quantas} mensajes de tu equipo`,
    mensagemSub: 'esperando tu respuesta',
    mensagemRotulo: 'mensajes',

    receita: 'Pide la renovación de la receta',
    receitaSub: (doses: number, semanas: number) =>
      `${doses} ${doses === 1 ? 'dosis restante' : 'dosis restantes'} · cerca de ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,
    receitaRotulo: 'receta',

    /* El título del examen viene del protocolo — es lo que el equipo
       escribió, y no texto nuestro. Lo nuestro es de dónde vino: con
       equipo, lo pidió ella; sin equipo, quien lo pide es el propio plan, y
       decir "pedido por tu equipo" inventaría uno. */
    exameSubDaEquipe: 'pedido por tu equipo',
    exameSubDoProtocolo: 'del protocolo de esta semana',
    exameRotulo: 'exámenes',

    consulta: 'Prepara lo que vas a llevar a la consulta',
    consultaSub: (tipo: string, quando: string, doutor: string) =>
      `${tipo} ${quando} · con ${doutor}`,
    consultaRotulo: 'consulta',
  },

  estado: {
    /* ⚠️ ERA LA MISMA PALABRA ESCRITA CUATRO VECES, una por momento. Las
       cuatro tarjetas son la misma tarjeta en momentos distintos. */
    kicker: 'TU SEGUIMIENTO',

    /* El salto de línea es a propósito: valor arriba, unidad abajo, para
       leerse de un vistazo. */
    metricaSemanas: 'semanas\nde seguimiento',
    metricaAplicacoes: 'aplicaciones\nregistradas',

    /* ⚠️ "DOSIS" Y NO "APLICACIONES": esta pastilla comparte la línea con
       el pulso, y la palabra larga lo empuja a dos líneas. */
    adesao: (feitas: number, previstas: number) =>
      `${feitas} de ${previstas} ${previstas === 1 ? 'dosis' : 'dosis'}`,

    consultaTitulo: 'Tu consulta está llegando.',
    consultaHoje: (doutor: string) =>
      `Tu consulta con ${doutor} es hoy. Vale repasar lo que quieres preguntar.`,
    consultaFaltam: (dias: number, doutor: string) =>
      `${dias === 1 ? 'Falta 1 día' : `Faltan ${dias} días`} para tu consulta con ${doutor}.`,
    consultaPulso: (quando: string) => `Consulta ${quando}`,

    /* ⚠️ LAS DOS VERSIONES NO SON DE TONO, SON DE HECHO. Sin plataforma la
       aplicación no sabe qué se decidió en el consultorio, y la frase
       cambia de dueño. */
    posConsultaTituloComPlataforma: 'Tu equipo actualizó tu tratamiento.',
    posConsultaTituloSemPlataforma: 'Tuviste una consulta hace poco.',
    posConsultaTextoComPlataforma: 'Revisa las indicaciones de la consulta y qué cambia en tu dosis a partir de ahora.',
    posConsultaTextoSemPlataforma: 'Si la dosis o el intervalo cambiaron, vale actualizarlo por aquí — es lo que mantiene bien las cuentas de la aplicación.',
    posConsultaPulso: 'Tratamiento actualizado',

    /* ⚠️ "TENEMOS ALGUNAS COSAS QUE ATENDER" — primera persona del plural,
       y no "tienes pendientes". La lista de abajo es de cosas que dependen
       de ella, y abrir con el dedo apuntando en una tarjeta de salud es el
       comienzo equivocado. */
    pendenciaTitulo: 'Tenemos algunas cosas que atender.',
    /* ⚠️ NOMBRA LO QUE ES, en vez de contar cuántos. "Dos cosas" obliga a
       desplazarse para descubrir si importa. Y los nombres vienen de la
       PROPIA lista, ítem por ítem. */
    pendenciaTexto: (quantas: string, plural: boolean, assuntos: string) =>
      `${quantas} ${plural ? 'pendientes necesitan' : 'pendiente necesita'} de ti — ${assuntos}. Nada urgente, pero vale resolverlo esta semana.`,
    pendenciaPulso: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'ítem pendiente' : 'ítems pendientes'}`,
    /* Hasta cuatro por extenso, que es el techo de pendientes que existen. */
    porExtenso: ['ninguna', 'una', 'dos', 'tres', 'cuatro'],

    emDiaTitulo: 'Tu cuidado está al día.',
    /* ⚠️ LA SEGUNDA VERSIÓN EXISTE PORQUE LA FRASE EMPEZABA POR EL NOMBRE
       DE LA MÉDICA. Sin nadie registrado abría con un espacio en blanco.
       Quien conduce el tratamiento sola lo conduce hace el mismo tiempo. */
    emDiaComQuem: (quem: string, semanas: number) =>
      `${quem} acompaña tu tratamiento hace ${semanas} semanas. Tienes buena adherencia y no hay ninguna pendiente importante por ahora.`,
    emDiaSozinha: (semanas: number) =>
      `Llevas ${semanas} semanas de tratamiento, con buena adherencia y ninguna pendiente importante por ahora.`,
    emDiaPulso: 'Seguimiento al día',
  },

  dose: {
    aplicacaoHoje: 'Aplicación hoy',
    proximaAplicacao: (quando: string) => `Próxima aplicación ${quando}`,
    nestaDoseHa: (semanas: number) =>
      `En esta dosis hace ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,
    /* El `quando` ya llega como "en 9 días" / "mañana", con la preposición
       dentro — por eso la frase no pone otra. */
    revisaoNaConsulta: (quando: string) => `Revisión en la consulta ${quando}`,
    revisaoHoje: 'de hoy',
  },

  equipe: {
    /* El rol de quien no tiene especialidad anotada. No es "Médico": puede
       no serlo, y la aplicación no lo sabe. Lo que sabe es la función. */
    responsavelPadrao: 'Responsable del tratamiento',
  },

  /* ⚠️ CADA LÍNEA SOLO EXISTE CON SU DATO. "Teléfono —" en una lista de
     contactos es la pantalla prometiendo un canal que no existe. Y el
     orden es del canal más rápido al más formal. */
  contato: {
    whatsapp: 'WhatsApp',
    whatsappSub: 'Hablar con la clínica',
    telefone: 'Teléfono',
    site: 'Sitio web',
    email: 'Correo',
    instagram: 'Instagram',
  },
};
