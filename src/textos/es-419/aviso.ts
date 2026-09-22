/* ============================================================
   EL CONSENTIMIENTO Y EL RESTO — el descargo, las tarjetas de datos · es-419

   ⚠️ Las razones viven en ../pt-BR/aviso.ts. La que manda:

   EL DESCARGO NO DISMINUYE LA APLICACIÓN PARA PROTEGERSE. "Esto no es una
   aplicación médica" es verdad y es cobarde: quien está leyendo acaba de
   responder trece preguntas sobre su propio tratamiento, y merece saber
   qué gana, no solo qué no gana. La frase dice las dos cosas, en ese
   orden — qué hacemos, y dónde paramos.
   ============================================================ */

export const aviso = {
  isencaoTitulo: 'Acompañamos tu tratamiento — no lo conducimos',
  isencaoTexto: 'Guardamos lo que registras, te mostramos cómo viene andando la cosa y preparamos lo que vas a llevar a la consulta. No somos un diagnóstico y no recetamos: dosis, intervalo y medicación son decisión de quien te acompaña.',
  isencaoReforco: 'Antes de cambiar cualquier cosa en tu dosis o en tu horario, habla con tu equipo. Y si aparece un síntoma que asusta, no esperes a la próxima consulta.',
  isencaoAceite: 'Entendí y acepto',

  guardadoTitulo: 'Lo que registras se queda en tu dispositivo',
  guardadoTexto: 'Peso, síntomas, inyecciones, exámenes y notas se graban dentro de la aplicación, en este teléfono. No hay cuenta ni contraseña: nadie entra en tus datos con un inicio de sesión.',

  usoTitulo: 'Para qué se usan tus datos',
  usoTexto: 'Para armar tus metas diarias, acompañar la evolución del tratamiento y organizar lo que lleves a la consulta. Nada de eso es un diagnóstico, y la aplicación no receta ni ajusta dosis.',

  /* ⚠️ LA PARTE QUE UN AVISO DE CONSENTIMIENTO SUELE CALLAR, y que aquí es
     la única que cambia lo que la persona decide. */
  saiTitulo: 'Qué puede salir de aquí, y solo con un toque tuyo',
  saiTexto: 'El resumen y los mensajes que le envíes a tu equipo de salud. Y la foto del plato, cuando uses la lectura por foto: se envía para ser leída y no queda guardada.',

  controleTitulo: 'Tú sigues teniendo el control',
  controleTexto: 'Puedes corregir y borrar cualquier registro, exportar todo en un archivo y borrar tus datos por completo, en cualquier momento, en la configuración.',

  /* ⚠️ SOLO EL NOMBRE DE APPLE CAMBIA DE IDIOMA, porque es Apple quien
     traduce el nombre de su propia aplicación. Health Connect, Garmin,
     Fitbit y Withings son marcas y se quedan en el código. */
  appleSaude: 'Apple Salud',
  trazPesagens: 'Tus pesajes — incluso los que tu balanza manda para allá.',
  trazTreinos: 'Entrenamientos y frecuencia cardíaca',
  trazSono: 'Sueño y pasos',
  trazBalanca: 'Balanza y presión',

  /* ⚠️ LAS TRES TERMINAN OFRECIENDO EL CAMINO MANUAL, y es lo que las
     separa de un mensaje de error: la persona fotografió el plato porque
     quiere registrarlo, y decir solo "no se pudo" la deja a mitad de
     camino. */
  fotoSemServidor: 'La lectura por foto todavía no está activada. Puedes armar el plato aquí abajo.',
  fotoSemRede: 'Sin conexión para leer la foto ahora. Puedes armar el plato aquí abajo.',
  fotoNaoReconheci: 'No logré reconocer el plato. Arma aquí abajo lo que había.',

  porMes: 'por mes',
  porMesCurto: '/mes',

  exportacaoAviso: 'Registros hechos por la propia persona en la aplicación. No es historia clínica ni informe.',
  exportacaoTitulo: 'Tus datos de Morphi',

  medIndefinido: 'Todavía sin definir',

  garrafao: 'Bidón',

  /* ⚠️ LOS NOMBRES SON CLAVE Y RÓTULO A LA VEZ — es el `tipo` que queda
     grabado en cada entrenamiento. Misma familia que el momento de la
     comida y el marcador de examen. */
  modalidades: {
    caminhada: 'Caminata',
    corrida: 'Correr',
    musculacao: 'Pesas',
    bike: 'Bicicleta',
    natacao: 'Natación',
    yoga: 'Yoga',
    pilates: 'Pilates',
    funcional: 'Funcional',
    alongamento: 'Estiramiento',
    outro: 'Otro',
  },

  telaExportar: {
    titulo: 'Exportar',
    lead: 'Un archivo con tus registros, para guardar o llevar a otro lado.',

    periodo: 'Período',
    periodoAjuda: (de: string, ate: string, semanas: number) =>
      `Del ${de} al ${ate} · ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,
    ultimas4: 'Últimas 4 semanas',
    desdeAConsulta: 'Desde la última consulta',
    tratamentoInteiro: 'Todo el tratamiento',

    oQueEntra: 'Qué entra',
    oQueEntraNota: 'Toca para incluir o sacar. Lo que quede afuera no entra en el archivo.',
    incluido: 'incluido',
    fora: 'afuera',

    aplicacoes: 'Inyecciones',
    aplicacoesSub: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'registro' : 'registros'} · fecha, dosis y lugar`,
    pesoEMedidas: 'Peso y medidas',
    pesoEMedidasSub: (pesagens: number, medidas: number) =>
      `${pesagens} ${pesagens === 1 ? 'pesaje' : 'pesajes'} · ${medidas} ${medidas === 1 ? 'medida' : 'medidas'}`,
    checkins: 'Check-ins',
    checkinsSub: (dias: number) => `${dias} ${dias === 1 ? 'día' : 'días'} · síntoma por síntoma`,
    exames: 'Exámenes',
    examesSub: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'resultado' : 'resultados'} · valor y rango de referencia`,
    notas: 'Notas para la consulta',
    notasSub: (quantas: number) => `${quantas} ${quantas === 1 ? 'anotación' : 'anotaciones'}`,
    habitos: 'Comidas, agua y ejercicio',
    habitosSub: (refeicoes: number) =>
      `${refeicoes} ${refeicoes === 1 ? 'comida' : 'comidas'} y el diario del día`,

    formatoTitulo: 'Sale un archivo .json',
    formatoTexto: 'Es el formato que otra aplicación puede abrir y leer — sirve para guardar una copia o llevar tus registros a otro lado. Para la versión hecha para que alguien la lea, usa el resumen para la consulta.',

    gerar: 'Armar el archivo',
    gerando: 'Armando...',
    verResumo: 'Ver el resumen para la consulta',

    pronto: 'Archivo armado. Solo va adonde elijas.',
    erro: 'No pudimos armar el archivo en este aparato. Tus registros siguen aquí, intactos.',
    parado: 'Nada sale de aquí sin que lo toques.',
  },

  telaPrivacidade: {
    titulo: 'Privacidad y datos',
    lead: 'Dónde quedan tus registros, qué sale de aquí y qué lee la aplicación de afuera.',

    ondeFicam: 'Dónde quedan tus registros',
    noAparelho: 'En el aparato, dentro de la aplicación',
    noAparelhoTexto: 'Peso, medidas, inyecciones, check-ins, exámenes, fotos y anotaciones se graban en el almacenamiento de la propia aplicación, en este aparato. No hay cuenta ni contraseña aquí: nadie entra en tus datos con un login, porque no existe login.',
    desinstalar: 'Desinstalar se lleva todo',
    desinstalarTexto: 'Como no hay copia en ningún servidor, borrar la aplicación borra los registros. No es posible recuperarlos después.',

    oQueSai: 'Qué sale de aquí',
    oQueSaiNota: 'Nada sale de aquí sin un gesto tuyo.',
    paraEquipe: 'Qué va para tu equipo',
    paraEquipeTexto: 'Por ahora, nada. El resumen para la consulta se arma en tu aparato y eres tú quien lo muestra o lo exporta; los mensajes quedan guardados aquí. Cuando exista el enlace con la clínica, los dos solo van a salir con un toque tuyo — y nada de tu diario viaja solo, ni peso, ni síntoma, ni comida.',
    fotoDoPrato: 'La foto del plato, cuando usas la lectura por foto',
    fotoDoPratoTexto: 'Se reduce en el aparato y se envía para que la lea un modelo, que devuelve los ítems del plato. La imagen no queda guardada: ni en tu registro de la comida, ni en el servidor que hace el puente. Registrar la comida a mano no envía nada.',

    leDeFora: 'Qué lee la aplicación de afuera',
    appDeSaudePadrao: 'aplicación de salud del celular',
    soOPeso: (app: string) => `${app}, y solo el peso`,
    soOPesoTexto: (app: string) =>
      `Con tu permiso, leemos los pesajes que tu balanza, tu reloj u otra aplicación escribieron ahí. Solo leemos: nunca escribimos nada en ${app}. Y leemos solo peso — sueño, pasos y latidos quedan fuera.`,
    permissao: 'El permiso es tuyo, y se quita cuando quieras',
    permissaoTexto: 'Se da en los ajustes del sistema y se revoca en el mismo lugar. Sin él, la aplicación sigue entera: el peso vuelve a entrar como entró hasta aquí, escrito por ti.',

    podeFazer: 'Qué puedes hacer ahora',
    integracoesSub: (app: string) => `Encender o apagar ${app}`,
    resumo: 'Resumen para la consulta',
    resumoSub: 'Ver todo lo que entra en el resumen de la consulta',

    apagar: 'Borrar mis datos',
    apagarSub: 'Todo lo que registraste, sin vuelta',
    apagarPergunta: '¿Borrar todo? No hay copia en ningún lado.',
    apagarConfirma: 'Borrar',
    cancelar: 'Cancelar',

    documentos: 'Los documentos',
    politicaSub: 'El documento completo, con base legal y plazos',
    termosSub: 'Qué somos, qué no somos, y qué puede esperar cada lado',
    semPoliticaTitulo: 'Esto describe la aplicación, no es la política de privacidad',
    semPoliticaTexto: 'Aquí está lo que el programa hace con tus datos. El documento jurídico, con las obligaciones de quien opera el servicio, todavía va a publicarse — y cuando exista, aparece en esta pantalla.',
  },

  telaIntegracoes: {
    titulo: 'Integraciones',
    lead: 'Encendidas, traen tus pesajes sin que los escribas.',

    doSeuAparelho: 'De tu aparato',
    doSeuAparelhoNota: 'Un depósito local: pedimos permiso y leemos. Sin cuenta y sin contraseña.',

    atualizarAgora: 'Actualizar ahora',
    lendo: 'Leyendo…',
    nadaNovo: 'Nada nuevo por allá — tus pesajes ya estaban todos aquí.',
    trazidas: (quantas: number, aparelho: string) =>
      `${quantas} ${quantas === 1 ? 'pesaje traído' : 'pesajes traídos'} de ${aparelho}.`,
    naoDeuParaLer: 'No pudimos leer ahora. Prueba de nuevo en un momento.',
    acessoNegado: 'El acceso no fue autorizado. Puedes cambiarlo en los ajustes del aparato.',

    semAparelhoTitulo: 'La aplicación de salud del aparato aparece en el celular',
    semAparelhoTexto: 'Apple Salud en el iPhone, Health Connect en Android. En el navegador no hay nada que encender.',
    semAppTitulo: (aparelho: string) => `${aparelho} no está disponible en este aparato`,
    semAppTexto: 'Health Connect viene en Android 14 en adelante y puede instalarse en las versiones anteriores. Después de instalarlo, vuelve aquí.',
    semBuildTitulo: 'Esta versión de la aplicación todavía no lee el aparato',
    semBuildTexto: 'Leer Apple Salud y Health Connect necesita una versión instalada de la aplicación, no la vista previa. En Expo Go no existe.',

    contasDeServico: 'Cuentas de servicio',
    contasDeServicoNota: 'Estos entregan los datos a un servidor, y no al teléfono — la conexión entra cuando ese servidor esté de pie. Mientras tanto, lo que mandan a la aplicación de salud de tu aparato ya llega aquí.',
    emBreve: 'Pronto',
  },
};
