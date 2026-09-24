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
    mensagemRotulo: 'los mensajes',

    receita: 'Pide la renovación de la receta',
    receitaSub: (doses: number, semanas: number) =>
      `${doses} ${doses === 1 ? 'dosis restante' : 'dosis restantes'} · cerca de ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,
    receitaRotulo: 'la receta',

    /* El título del examen viene del protocolo — es lo que el equipo
       escribió, y no texto nuestro. Lo nuestro es de dónde vino: con
       equipo, lo pidió ella; sin equipo, quien lo pide es el propio plan, y
       decir "pedido por tu equipo" inventaría uno. */
    exameSubDaEquipe: 'pedido por tu equipo',
    exameSubDoProtocolo: 'del protocolo de esta semana',
    exameRotulo: 'los exámenes',

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
    metricaAplicacoes: 'inyecciones\nregistradas',

    /* ⚠️ "DOSIS" Y NO "APLICACIONES": esta pastilla comparte la línea con
       el pulso, y la palabra larga lo empuja a dos líneas. */
    adesao: (feitas: number, previstas: number) =>
      `${feitas} de ${previstas} ${previstas === 1 ? 'dosis' : 'dosis'}`,

    consultaTitulo: 'Tu consulta está llegando.',
    consultaHoje: (doutor: string) =>
      `Tu consulta con ${doutor} es hoy. Conviene repasar lo que quieres preguntar.`,
    consultaFaltam: (dias: number, doutor: string) =>
      `${dias === 1 ? 'Falta 1 día' : `Faltan ${dias} días`} para tu consulta con ${doutor}.`,
    consultaPulso: (quando: string) => `Consulta ${quando}`,

    /* ⚠️ LAS DOS VERSIONES NO SON DE TONO, SON DE HECHO. Sin plataforma la
       aplicación no sabe qué se decidió en el consultorio, y la frase
       cambia de dueño. */
    posConsultaTituloComPlataforma: 'Tu equipo actualizó tu tratamiento.',
    posConsultaTituloSemPlataforma: 'Tuviste una consulta hace poco.',
    posConsultaTextoComPlataforma: 'Revisa las indicaciones de la consulta y qué cambia en tu dosis a partir de ahora.',
    posConsultaTextoSemPlataforma: 'Si la dosis o el intervalo cambiaron, conviene actualizarlo por aquí — es lo que mantiene bien las cuentas de la aplicación.',
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
      `${quantas} ${plural ? 'cosas necesitan' : 'cosa necesita'} tu atención — ${assuntos}. Nada urgente, pero conviene ${plural ? 'resolverlas' : 'resolverla'} esta semana.`,
    pendenciaPulso: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'ítem pendiente' : 'ítems pendientes'}`,
    /* Hasta cuatro por extenso, que es el techo de pendientes que existen. */
    porExtenso: ['ninguna', 'una', 'dos', 'tres', 'cuatro'],

    emDiaTitulo: 'Tu cuidado está al día.',
    /* ⚠️ LA SEGUNDA VERSIÓN EXISTE PORQUE LA FRASE EMPEZABA POR EL NOMBRE
       DE LA MÉDICA. Sin nadie registrado abría con un espacio en blanco.
       Quien conduce el tratamiento sola lo conduce desde hace el mismo tiempo. */
    emDiaComQuem: (quem: string, semanas: number) =>
      `${quem} acompaña tu tratamiento desde hace ${semanas} semanas. Tienes buena adherencia y no hay ningún pendiente importante por ahora.`,
    emDiaSozinha: (semanas: number) =>
      `Llevas ${semanas} semanas de tratamiento, con buena adherencia y ningún pendiente importante por ahora.`,
    emDiaPulso: 'Seguimiento al día',
  },

  dose: {
    aplicacaoHoje: 'Inyección hoy',
    proximaAplicacao: (quando: string) => `Próxima inyección ${quando}`,
    nestaDoseHa: (semanas: number) =>
      `En esta dosis desde hace ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,
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
    agenda: 'Agendar en línea',
  },

  /* La pantalla de la clínica — /clinica, en sus dos versiones. Ver ../pt-BR/cuidado. */
  telaClinica: {
    titulo: 'Clínica',
    semClinica: 'No tienes una clínica vinculada. Quien acompaña tu tratamiento aparece en el área médica.',
    convenios: 'Seguros médicos aceptados',
    sobre: 'Acerca de',
    outrosCanais: 'Otros canales',
    outrosCanaisNota: 'Para hablar con la recepción. Lo que es del tratamiento va mejor en la conversación de la aplicación, que llega a todo el equipo.',
    entreEmContato: 'Contacto',
    entreEmContatoNota: 'Habla con la clínica para saber cómo empezar el seguimiento.',
    contatosDeExemplo: 'Contactos de ejemplo — no abren nada.',
    comoChegar: 'Cómo llegar',
    quemAcompanha: 'Quién te acompaña',
    quemAtende: 'Quién atiende',
    aEquipe: 'El equipo',
    responsavel: 'Responsable',
    vinculoDesde: (data: string) => `Tu vínculo con esta clínica empezó el ${data}.`,
    parceria: 'Los pacientes de clínicas asociadas no pagan por la aplicación. Al empezar el tratamiento aquí, la clínica te da un código y tu suscripción deja de cobrarse.',
    escrever: 'Escribir al equipo',
  },

  tela: {
    paraAConsulta: (quando: string) => `PARA LA CONSULTA ${quando}`,
    resumoPronto: 'Tu resumen ya está listo',
    vouPreparar: 'Voy a preparar tu resumen',

    linhaDoPlano: (previstas: number, temHorizonte: boolean): [string, string, string] => [
      'Semana ',
      temHorizonte ? ` de ${previstas} rumbo a tu meta · ` : ' de tu tratamiento · ',
      ' con la inyección al día',
    ],

    ultimaOrientacao: 'ÚLTIMA ORIENTACIÓN',
    voceEscreveu: 'TÚ ESCRIBISTE',
    naoLida: 'sin leer',
    responder: 'Responder',
    enviarPrimeira: 'Enviar el primer mensaje',

    /* ⚠️ "NECESITA DE TI" É CALCO. "Necesitar de" é arcaísmo em
       espanhol — hoje se diz "te necesita" —, e como cabeçalho de uma
       lista do que espera a pessoa, "depende de ti" é o que um falante
       escreveria. */
    precisaDeVoce: 'Depende de ti',
    nadaPrecisa: 'Nada depende de ti ahora.',
    emDia: 'Tu seguimiento está al día.',

    proximaConsulta: 'Tu próxima consulta',
    consultasLink: 'Consultas',
    anotarConsulta: 'Anotar una consulta',
    anotarConsultaSub: 'Con la fecha aquí, el resumen queda listo y te avisamos cuando se acerque.',
    eQuando: (quando: string) => `${quando.charAt(0).toUpperCase()}${quando.slice(1)}`,
    preparoTexto: 'Armo un resumen con peso, adherencia y síntomas de ese tramo — tú eliges qué quieres preguntar.',
    prepararAConsulta: 'Preparar la consulta',

    seuTratamento: 'Tu tratamiento',
    aplicacoesLink: 'Inyecciones',
    dosesEm: (onde: string) => `Dosis ${onde}`,
    restamDe: (restam: number, total: number, semanas: number) =>
      `${restam} de ${total} · cerca de ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,
    pedirRenovacao: 'Pedir renovación',

    exames: 'Exámenes',
    marcadoresAcompanhados: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'marcador en seguimiento' : 'marcadores en seguimiento'}`,
    nenhumResultado: 'Ningún resultado guardado',
    importeUmExame: 'Importa un examen para empezar a seguirlo',
    foraDaReferencia: (quantos: number) => `${quantos} fuera del rango`,
    todosNaReferencia: 'Todos dentro del rango',

    quemAcompanha: 'Quién acompaña tu tratamiento',
    ninguemRegistrado: 'Nadie anotado todavía',
    seVoceSeTrata: 'Si alguien te trata, anótalo aquí — el resumen queda listo para la consulta.',

    acompanhamentoProfissional: 'Seguimiento profesional',
    conhecaParceiros: 'Conoce a los médicos aliados',
    parceirosTexto: 'Algunas clínicas acompañan el tratamiento por aquí junto contigo — mensajes entre las consultas, tu resumen llegando al equipo y la agenda ya cargada.',
    passouATer: '¿Pasaste a tener acompañamiento médico?',
    anoteQuemE: 'Anota quién es.',
  },

  telaAcompanhamento: {
    leadComVinculo: 'Estos datos vienen de la clínica que acompaña tu tratamiento.',
    ondeAtendida: 'Dónde ocurre la atención',
    quemCorrige: 'Quien corrige es la clínica',
    quemCorrigeTexto: 'Si algún dato está mal, habla con el equipo — es quien mantiene esta ficha, y lo que se corrija allá llega aquí.',

    lead: 'Si alguien te trata, anótalo aquí. Es lo que hace que el resumen quede listo para la consulta y que la preparación de preguntas aparezca a tiempo.',

    nome: 'Nombre',
    nomeAjuda: 'Cómo llamas a esa persona. Puede ser el nombre del consultorio, si prefieres.',
    nomePlaceholder: 'Escribe el nombre',
    especialidade: 'Especialidad',
    opcional: 'Opcional.',
    especialidadePlaceholder: 'Endocrinología',
    ondeAtende: 'Dónde atiende',
    ondeAtendeAjuda: 'Opcional — clínica, hospital o consultorio.',
    ondeAtendePlaceholder: 'Escribe la clínica o el consultorio',

    nadaEnviado: 'Nada de esto se envía a nadie',
    nadaEnviadoTexto: 'El nombre queda en la aplicación, contigo. Para que tu equipo reciba tus datos hace falta un código de invitación de la clínica — y desde ahí quien cuida esta ficha es ella.',
    salvar: 'Guardar',

    naoTenhoMais: 'Ya no tengo acompañamiento',
    tirarPergunta: '¿Quitar a quien te acompaña?',
    tirarTexto: 'Todos tus registros siguen aquí — peso, inyecciones, síntomas, exámenes y anotaciones. Lo único que sale es el nombre.',
    simTirar: 'Sí, quitar',
    cancelar: 'Cancelar',
  },

  telaAnotarConsulta: {
    titulo: 'Anotar consulta',

    quemMarca: 'Quien agenda es la clínica',
    quemMarcaLead: 'Tu agenda viene del equipo que acompaña tu tratamiento.',
    datasChegam: 'Las fechas llegan de la clínica',
    datasChegamTexto: 'Para reagendar o cancelar, habla con el equipo — lo que cambie allá aparece aquí.',

    proximaConsulta: 'Tu próxima consulta',
    anoteSuaConsulta: 'Anota tu consulta',
    lead: 'Con la fecha aquí, te avisamos cuando se acerque y dejamos el resumen listo para llevar.',

    quando: 'Cuándo',
    comoVaiSer: 'Cómo va a ser',
    tipos: {
      presencial: 'Presencial',
      teleconsulta: 'Teleconsulta',
      retorno: 'Control',
    },
    comQuem: (quem: string) => `Con ${quem}.`,

    dataFicaComVoce: 'La fecha queda contigo',
    dataFicaComVoceTexto: 'Anotarla aquí no avisa al consultorio ni entra en el calendario del teléfono. Somos nosotros los que te avisamos cuando la consulta se acerca.',

    salvar: 'Guardar',
    anotar: 'Anotar consulta',
    naoTenho: 'No tengo consulta agendada',
  },
  telaConsultas: {
    titulo: 'Consultas',
    leadComData: 'La próxima, qué llevar a ella, y las que ya pasaron.',
    leadSemData: 'Qué llevar a la próxima, y las que ya pasaron.',

    jaPassou: 'YA PASÓ',
    proxima: 'PRÓXIMA',
    /* Sin coma: en español la fecha larga se escribe "lunes 3 de
       octubre", y la coma es costumbre del portugués. */
    dataDaConsulta: (diaDaSemana: string, data: string, quem: string) =>
      `${diaDaSemana} ${data}${quem ? ` · ${quem}` : ''}`,
    jaAconteceu: 'Ya ocurrió',
    verResumo: 'Ver el resumen para llevar',
    mudarData: 'Cambiar la fecha',

    nenhumaAnotada: 'Ninguna consulta anotada',
    clinicaMarca: 'Cuando tu equipo agende la próxima, aparece aquí.',
    semDataTexto: 'Con la fecha aquí, te avisamos cuando se acerque y dejamos el resumen listo para llevar.',
    anotarConsulta: 'Anotar consulta',

    paraLevar: 'Para llevar',
    paraLevarSub: (faltando: number): string =>
      faltando === 0
        ? 'Está todo al día — el resumen ya se arma con esto.'
        : faltando === 1
          ? 'Falta una cosa para que el resumen quede completo.'
          : `Faltan ${faltando} cosas para que el resumen quede completo.`,

    anteriores: 'Consultas anteriores',
    linhaAnterior: (tipo: string, data: string) => `${tipo} · ${data}`,

    consultaGenerica: 'Consulta',
  },
  telaConsulta: {
    titulo: 'Consulta',
    naoEstaMais: 'Esta consulta ya no está en tu historial.',

    desdeEntao: 'Desde entonces',
    desdeEntaoSub: 'Lo que tus registros muestran de ese día hasta ahora.',
    ateASeguinte: 'Hasta la consulta siguiente',
    ateASeguinteSub: (data: string) =>
      `Lo que tus registros muestran entre ese día y ${data}.`,

    semRegistro: 'Ningún registro tuyo cayó en esta ventana. Lo que quedó acordado en la consulta está en la anotación de arriba, si la hay.',
  },

  telaAreaMedica: {
    titulo: 'Área médica',
    lead: 'Quien te cuida, y lo que le llega.',

    atalhoMensagem: 'Mensaje',
    atalhoClinica: 'Clínica',

    paraLevar: 'PARA LLEVAR A LA CONSULTA',
    paraLevarTexto: 'Peso, adherencia, síntomas, exámenes y tus anotaciones, en un solo documento. Se arma con tus registros y ya está listo.',
    verResumo: 'Ver el resumen para la consulta',

    suasAnotacoes: 'Tus anotaciones',
    anotar: 'Anotar',
    anotarDuvida: 'Anotar una duda',
    anotarDuvidaSub: 'Para preguntar en la próxima consulta',

    prescricoes: 'Prescripciones',
    pedirReceita: 'Pedir una receta nueva',
    clinicaPreparou: 'Lo que preparó la clínica',

    numerosDaEquipe: 'Los números de tu equipo',
    naoAnotada: 'sin anotar',
    anotadoPor: (por: string, data: string) => `${por} · anotado el ${data}`,
    anoteONumero: 'Anota el número definido en la consulta',

    duasMetas: (minha: string) =>
      `Tu meta de peso, en la aplicación, es ${minha}. Las dos conviven — la tuya sigue midiendo el Camino —, y la diferencia entre ellas es una buena pregunta para la próxima consulta.`,

    documentos: 'Documentos y exámenes',
    tipoExame: 'Estudio',
    tipoResumo: 'Generado por IA',
    documentoSub: (tipo: string, data: string) => `${tipo} · ${data}`,
  },
};
