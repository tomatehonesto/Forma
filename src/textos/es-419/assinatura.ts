/* ============================================================
   LA SUSCRIPCIÓN — qué rige, cuánto cuesta, dónde se cambia · es-419

   ⚠️ Las razones viven en ../pt-BR/assinatura.ts. Las dos que constriñen
   esta traducción:

   ES UNA SOLA PANTALLA, CON UNA ETIQUETA. Quien es paciente de clínica
   socia lee "Sin costo" en el MISMO punto donde quien paga lee "$299,00" —
   la comparación es inmediata porque el lugar es el mismo. Un idioma que
   inventara una frase más larga para el caso exento desharía el diseño.

   EL TEXTO DE LA EXENCIÓN NACE DE LA SECCIÓN 4 DE LOS TÉRMINOS. No es
   copia de pantalla: es el compromiso que asume el documento, repetido
   donde importa. Si los dos se separan, uno se vuelve la versión
   equivocada para quien leyó el otro — y quien tiene razón es el documento.
   ============================================================ */

export const assinatura = {
  /* ⚠️ EL SUFIJO NO ES CLAVE. Había dos pantallas preguntando
     `p.sufixo === '/mês'` para saber cuál plan era el mensual — una
     comparación de texto haciendo el trabajo de un id. Quien pregunta cuál
     es el plan pregunta por el `id`. */
  mensal: 'Mensual',
  anual: 'Anual',
  porAno: 'por año',
  porAnoCurto: '/año',

  /* ⚠️ UNA SOLA CLAVE para el título de la pantalla y el rótulo de la
     tarjeta. Son el mismo asunto dicho en el mismo lugar, y separarlos en
     dos claves es invitarlos a divergir. */
  titulo: 'Tu suscripción',

  semCusto: 'Sin costo',

  /* Cuando no sabemos el nombre de la clínica. Entra en medio de una
     frase, y por eso va en minúscula. */
  clinicaGenerica: 'la clínica que te acompaña',
  cobertoPelaClinica: (clinica: string) => `El vínculo con ${clinica} cubre la aplicación entera.`,

  vinculadaDesde: 'Vinculada desde',
  codigoDeConvite: 'Código de invitación',
  periodicidade: 'Periodicidad',
  primeiraCobranca: 'Primer cobro',
  proximaCobranca: 'Próximo cobro',
  cobrancaPela: 'Cobro por',
  naoHa: 'No hay',

  /* ⚠️ "TIENES TODO TAL COMO ESTÁ" VIENE ANTES DEL PRECIO, y el orden es
     el mensaje: quien abrió esta pantalla sin suscribirse no está pagando
     nada, y descubrirlo no puede depender de leer la segunda oración. */
  semPlano: (menorPorMes: string) => `Tienes todo tal como está. Los planes empiezan en ${menorPorMes} por mes.`,

  /* Las acciones. Sin subtítulo, porque ninguna tiene consecuencia — cada
     una abre una pantalla, y en una lista de acciones el subtítulo solo se
     paga cuando avisa de algo que no se puede deshacer. */
  mudarDePlano: 'Cambiar de plan',
  verOsPlanos: 'Ver los planes',
  formaDePagamento: 'Forma de pago',
  historicoDeCobranca: 'Historial de cobros',

  trocarClinica: 'Cambiar la clínica que te acompaña',

  /* ⚠️ ESTAS DOS SÍ TIENEN SUBTÍTULO, y por el motivo contrario al de las
     otras: quien está pagando y escribe un código de clínica socia DEJA DE
     PAGAR. Es la mayor consecuencia de la pantalla, y no hay cómo
     adivinarla de un rótulo que dice "ingresar código". */
  inserirCodigo: 'Ingresar código',
  inserirCodigoSub: 'Los pacientes de clínicas socias no pagan por la aplicación',
  medicosParceiros: 'Médicos socios',
  medicosParceirosSub: 'Quien se trata en una clínica socia no paga',

  cancelar: 'Cancelar suscripción',

  /* ⚠️ EL TÍTULO NO ES EL MISMO EN LAS TRES. "Conviene que sepas" sirve al
     aviso que es solo información; el que avisa de dinero parado tiene que
     decirlo en el título, o se vuelve una nota al pie más con cara de nota
     al pie. */
  pagandoTitulo: 'Estás pagando sin necesidad',
  pagandoTexto: (loja: string) => `El vínculo con la clínica ya cubre la aplicación, pero hay una suscripción activa en ${loja} — cancélala allá y nada cambia para ti.`,

  /* ⚠️⚠️ DICE QUIÉN NOS AVISA, y después qué pasa. "Si el vínculo termina"
     hacía parecer que nos damos cuenta solos, y no: nadie aquí sabe que
     alguien dejó de ser paciente de una clínica. Quien lo sabe es la
     clínica, y es ella quien informa.

     ⚠️⚠️ Y LA LÍNEA DE LOS DATOS VA JUNTO, siempre. Suspender el acceso de
     un diario de tratamiento es dejar a alguien afuera de su propio peso,
     de sus propias inyecciones y de sus propios exámenes — y eso no lo
     hacemos. Separadas, la primera frase se vuelve una amenaza. */
  bomSaberTitulo: 'Conviene que sepas',
  bomSaberTexto: 'Si la clínica socia nos informa que el vínculo de tratamiento terminó, el acceso queda suspendido hasta que contrates un plan Personal — y no se cobra nada sin que lo elijas. Nada de lo que registraste se pierde: tus registros siguen en tu cuenta y puedes exportarlos cuando quieras.',

  /* ⚠️ DECIR "NO TE SUSCRIBISTE" SIN DECIR QUE NADIE PUEDE SUSCRIBIRSE
     deja a la persona buscando un botón que no existe. Esta sale el día en
     que entre el cobro. */
  semCobrancaTitulo: 'El cobro todavía no está activado',
  semCobrancaTexto: 'Esta pantalla existe; la suscripción todavía no. No se te cobró nada, y nada se va a cobrar sin aviso.',

  /* ⚠️⚠️ EL TÍTULO TIENE UN SALTO DE LÍNEA MEDIDO, Y NO ELEGIDO. En un
     teléfono de 375 pt sobran 335 px de línea; las dos mitades piden 321 y
     323 px en el cuerpo de 31. Una frase más larga no "queda un poco más
     grande": se parte en tres líneas y se come el botón. */
  vitrine: {
    titulo: 'Todo cambia cuando\nte acompañas ',
    tituloDestaque: 'de verdad.',
    lead: 'Tus datos reunidos, tu evolución organizada, y claridad en cada etapa del tratamiento.',

    umLugarTitulo: 'Tu tratamiento en un solo lugar',
    umLugarTexto: 'Todo ordenado para que sigas tu camino.',
    numerosTitulo: 'Tus números interpretados',
    numerosTexto: 'Tus datos se vuelven información que tiene sentido.',
    evolucaoTitulo: 'Evolución que puedes ver',
    evolucaoTexto: 'Peso, medidas, síntomas, exámenes y registros a lo largo del tiempo.',
    assistenteTitulo: 'Un asistente para el día a día',
    assistenteTexto: 'Pregunta, registra y entiende mejor tu camino.',

    comecarTeste: (dias: number) => `Empezar los ${dias} días gratis`,
    assinarPor: (preco: string) => `Suscribirme — ${preco}`,

    /* ⚠️ "CANCELA CUANDO QUIERAS" SIRVE A LOS DOS PLANES, y es verdad en
       los dos. La segunda cambia: "sin compromiso" calma a quien va a
       probar tres días; para quien está comprometiendo un año entero, la
       misma frase suena a promesa vacía — ACABA de comprometerse. */
    canceleQuandoQuiser: 'Cancela cuando quieras',
    semCompromisso: 'Sin compromiso',
    menorPreco: 'Mejor precio',

    depoisDoTeste: (dias: number, preco: string, periodo: string) =>
      `Después de ${dias} días, ${preco} ${periodo}. Cancela antes y no pagas nada.`,
    renovaAte: (preco: string, periodo: string) =>
      `${preco} ${periodo}, renovándose hasta que canceles.`,

    naoPaga: 'No pagas — el acceso viene del vínculo',
    aindaNaoLigada: 'La suscripción todavía no está activada',
    temCodigo: 'Tengo un código de invitación',
  },

  /* ⚠️⚠️ LA PANTALLA PREGUNTA, PERO NO RETIENE. Quien la abrió ya decidió,
     y la pregunta es para nosotros, no contra ella: el botón que lleva a la
     tienda queda activo en el pie sin depender de responder nada. */
  saida: {
    titulo: 'Cancelar suscripción',
    perguntaTitulo: 'Antes de irte, una pregunta',
    perguntaLead: 'Responder es opcional y no cambia nada: cancelar sigue a un toque, en el botón de abajo.',
    porQue: '¿Por qué estás cancelando?',
    continuarParaLoja: (loja: string) => `Continuar a ${loja}`,

    /* ⚠️ EL ORDEN NO ES SUELTO: los tres primeros tienen respuesta, los
       tres últimos tienen campo de texto, y "Otro motivo" es siempre el
       último. Quien lee encuentra la alternativa antes del formulario, y la
       salida genérica después de todas las específicas. */
    motivoCaro: 'Está caro',
    motivoEsqueco: 'No la estoy usando',
    motivoTerminei: 'Ya terminé',
    motivoFaltou: 'Faltó algo',
    motivoProblema: 'Hubo un problema',
    motivoOutro: 'Otro motivo',

    /* ⚠️⚠️ EN EL ANUAL, EL DESCUENTO NO ES LA NOTICIA — LA FECHA LO ES.
       Quien paga por año y dice que está caro no tiene cobro por llegar. Y
       el reembolso se dice aunque cueste: quien quiere el dinero de vuelta
       lo va a buscar igual, y callarlo solo garantiza que lo busque
       molesta y en el lugar equivocado. */
    anoPagoTitulo: 'Tu año ya está pagado',
    anoPagoComData: (data: string) => `El próximo cobro no es hasta el ${data}, y sigues con todo hasta entonces — cancelar ahora no devuelve lo que ya se pagó.`,
    anoPagoSemData: 'Sigues con todo hasta el final del período ya pagado — cancelar ahora no devuelve ese monto.',
    anoPagoReembolso: (loja: string, comDesconto: string, cheio: string) =>
      `El reembolso, cuando corresponde, se pide en ${loja}. Y si el problema es el monto, la renovación puede salir por ${comDesconto} en vez de ${cheio}.`,
    querDescontoRenovacao: 'Quiero el descuento en la renovación',

    descontoTitulo: (porcento: number) => `${porcento}% de descuento el próximo mes`,
    descontoTexto: (comDesconto: string, cheio: string, anualPorMes: string) =>
      `El próximo cobro sale por ${comDesconto} en vez de ${cheio}. Y si el problema es el mensual, el anual queda en ${anualPorMes} por mes.`,
    querDesconto: 'Quiero el descuento',

    lembretesTitulo: 'Si el problema es olvidarse, podemos avisarte',
    lembretesTexto: 'Dosis, pesaje, agua y proteína tienen recordatorio, en el horario que elijas. Puedes activar solo lo que te hace falta y apagar el resto.',
    configurarLembretes: 'Configurar recordatorios',

    /* ⚠️⚠️ AQUÍ LA PANTALLA DEJA DE VENDER Y FELICITA. Es el único motivo
       de la lista en que irse es el desenlace correcto. Y la felicitación
       es CONDICIONAL a propósito: "esperamos que hayas logrado" y no "lo
       lograste" — no todo tratamiento que termina, termina bien, y afirmar
       la victoria a quien paró por un efecto secundario es la frase más
       cruel que esta pantalla podría tener. */
    parabensTitulo: 'Felicitaciones por llegar hasta aquí',
    parabensTexto: 'Esperamos que hayas logrado lo que buscabas cuando empezaste. Gracias por haber hecho este camino con nosotros — y por confiarnos el registro de ese camino.',

    campoProblema: '¿Qué pasó?',
    campoFaltou: '¿Qué faltó?',
    campoOutro: 'Cuéntanos',
    /* ⚠️ Y LA FRASE NO PROMETE RESPUESTA. No hay adónde vaya ese texto
       todavía. "Vamos a responderte" sería la promesa más fácil y más cara
       de esta pantalla. */
    campoAviso: 'Escribir es opcional, y nadie te va a responder por aquí — esto se vuelve una lista de arreglos, y es así como decidimos qué reparar primero.',
    campoDicaProblema: 'Qué salió mal, y cuándo…',
    campoDicaOutro: 'Escribe lo que quieras',

    recusaTitulo: 'El descuento todavía no se puede aplicar',
    recusaTexto: 'El cobro no está activado en esta versión, así que no hay nada que descontar. Nada cambió en tu suscripción.',

    /* ⚠️ EL TÍTULO ES EL RESUMEN DE LAS TRES, y no un rótulo de sección.
       Las tres líneas responden la misma pregunta — "¿qué pierdo?" */
    tranquiloTitulo: 'QUÉDATE TRANQUILA',
    tranquiloAcesso: 'El acceso continúa hasta el final del período ya pagado.',
    tranquiloDados: 'Nada de lo que registraste se pierde — todo sigue en tu cuenta.',
    tranquiloLoja: (loja: string) => `La cancelación se hace en ${loja}: la aplicación no puede hacerlo por ti.`,
  },

  /* Os rótulos do campo da folha do código (/codigo). A tela /parceiros,
     de onde eles nasceram, saiu na fase 8: a apresentação da rede e a
     vitrine já explicam o caminho, e têm "Já tenho um código". */
  parceiros: {
    codigoRotulo: 'Código de invitación',
    digite: 'Escribe el código',
    confirmar: 'Confirmar código',
    codigoSub: 'El código que te pasó la clínica socia.',
  },

  codigo: {
    minimo: 'Escribe al menos 4 caracteres.',
    liberaNaHora: 'El código libera la aplicación al instante. Nada de lo que ya registraste cambia de lugar.',
    conferindo: 'Verificando…',
    naoAchou: 'No encontramos este código. Confírmalo con la clínica: vale tal como te lo dieron.',
    exemplo: (codigos: string) => `En la lista de ejemplo, los códigos son inventados: ${codigos}.`,
    conferirTitulo: '¿Es esta tu clínica?',
    conferirSub: 'El código que escribiste es de esta clínica.',
    conectar: 'Conectar',
    naoEEssa: 'No es mi clínica',
    conectarTexto: 'Al conectar, esta clínica pasa a acompañarte desde aquí. Nada de lo que ya registraste cambia de lugar.',
    cancelarTitulo: 'Puedes cancelar tu suscripción',
    cancelarTexto: (loja: string) => `El vínculo con la clínica ya cubre tu acceso a la aplicación. La suscripción en ${loja} sigue cobrando hasta que la canceles allá — y cancelarla no cambia nada de lo que ya registraste.`,
    cancelarNaLoja: (loja: string) => `Cancelar en ${loja}`,
    depois: 'Hacerlo después',
  },

  extrato: {
    titulo: 'Historial de cobros',
    vazioIsenta: 'Ningún cobro',
    vazioPagante: 'Ningún cobro todavía',
    vazioIsentaTexto: 'El acceso viene del vínculo con la clínica, y un vínculo no genera cobros. Si la clínica nos informa que terminó, el acceso queda suspendido hasta que te suscribas — nada aparece aquí sin que lo elijas.',
    vazioPaganteTexto: 'Cuando empiece la suscripción, cada cobro aparece aquí con su fecha y su monto.',
    inicioDoTeste: 'Inicio de la prueba gratis',
    comprovante: 'El comprobante oficial de cada cobro',
  },

  /* ⚠️ LO QUE ESTÁ SUSPENDIDO ES LA SUSCRIPCIÓN, Y NO LA CUENTA. Las dos
     líneas de abajo son la diferencia entre un aviso y una amenaza. */
  suspenso: {
    clinicaGenerica: 'la clínica que te acompañaba',
    nadaApagado: 'No se borró nada. Peso, inyecciones, síntomas, exámenes y fotos siguen donde estaban.',
    nadaCobrado: 'No se cobró nada, y nada se va a cobrar sin que lo elijas.',
    verOsPlanos: 'Ver los planes',
    outroCodigo: 'Tengo otro código',
  },

};
