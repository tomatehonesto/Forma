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
  isencaoTexto: 'Guardamos lo que registras, te mostramos cómo viene andando el tratamiento y preparamos lo que vas a llevar a la consulta. No somos un diagnóstico y no recetamos: dosis, intervalo y medicación son decisión de quien te acompaña.',
  isencaoReforco: 'Antes de cambiar cualquier cosa en tu dosis o en tu horario, habla con tu equipo. Y si aparece un síntoma que asusta, no esperes a la próxima consulta.',
  isencaoAceite: 'Entendí y acepto',

  guardadoTitulo: 'Lo que registras queda guardado en tu cuenta',
  guardadoTexto: 'Peso, síntomas, inyecciones, exámenes y notas quedan en este teléfono y en nuestra base de datos, en São Paulo, vinculados a tu cuenta. Así tu diario no se pierde si cambias o pierdes el teléfono. Solo tu cuenta lee lo que es tuyo.',

  usoTitulo: 'Para qué se usan tus datos',
  usoTexto: 'Para armar tus metas diarias, acompañar la evolución del tratamiento y organizar lo que lleves a la consulta. Nada de eso es un diagnóstico, y la aplicación no receta ni ajusta dosis.',

  /* ⚠️ LA PARTE QUE UN AVISO DE CONSENTIMIENTO SUELE CALLAR, y que aquí es
     la única que cambia lo que la persona decide. */
  saiTitulo: 'Qué más puede salir de aquí, y solo con un gesto tuyo',
  saiTexto: 'Tu diario, para la clínica a la que te conectes con su código, después de ver lo que ella pasa a ver. Y la foto del plato, cuando uses la lectura por foto: se envía para ser leída y no queda guardada.',

  controleTitulo: 'Tú sigues teniendo el control',
  controleTexto: 'Puedes corregir y borrar cualquier registro, exportar todo en un archivo y borrar tus datos por completo, en cualquier momento, en la configuración.',

  perguntasTitulo: 'Tus preguntas a Morphi',
  perguntasTexto: 'Si nos dejas, leemos las preguntas que le haces a Morphi para entender qué dudas aparecen y mejorar las respuestas. Las leemos sin saber quién preguntó, y la clínica nunca las lee. Viene apagado, y decir que no, no cambia nada en la aplicación.',
  perguntasEscolha: 'Permitir que se lean mis preguntas',
  perguntasDetalhe: 'Encenderlo envía también las preguntas que ya están aquí. Puedes apagarlo cuando quieras, en Privacidad y datos, y las enviadas se borran.',

  consentimentoNovo: {
    titulo: 'Cambiamos cómo guardamos tu diario',
    lead: 'Ahora también queda en tu cuenta, en nuestra base de datos, para no perderse cuando cambias de teléfono. Antes de seguir, lee lo que cambió.',
    aceitar: 'Aceptar y continuar',
    recusar: 'No estoy de acuerdo',
    recusaTitulo: 'Sin aceptar, no se puede seguir',
    recusaTexto: 'La aplicación ahora guarda el diario en tu cuenta, y no funciona sin ella. Si no estás de acuerdo, puedes llevarte tus datos en un archivo y borrar todo de este aparato. No se borra nada sin que lo pidas.',
    exportar: 'Exportar mis datos',
    apagar: 'Borrar mis datos de este aparato',
    apagarPergunta: '¿Borrar todo de este aparato? No se puede deshacer.',
    apagarConfirma: 'Borrar',
    voltar: 'Volver y leer de nuevo',
  },

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

  exportacaoAviso: 'Registros hechos por la propia persona en la aplicación. No es historia clínica ni informe de laboratorio.',
  exportacaoTitulo: 'Tus datos de Morphi',
  exportacaoPerguntasRecentes: 'Sin conexión, vinieron solo las preguntas recientes de este aparato. Con conexión, el archivo trae todas las de tu cuenta.',

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
    completo: 'El diario completo',
    completoSub: 'Todo lo que guarda tu cuenta, sin recorte de período, con tus preguntas',

    formatoTitulo: 'Sale un archivo .json',
    formatoTexto: 'Es el formato que otra aplicación puede abrir y leer — sirve para guardar una copia o llevar tus registros a otro lado. Para una versión hecha para que la lea una persona, usa el resumen para la consulta.',

    gerar: 'Armar el archivo',
    gerando: 'Armando...',
    verResumo: 'Ver el resumen para la consulta',

    pronto: 'Archivo armado. Solo va adonde elijas.',
    erro: 'No pudimos armar el archivo en este aparato. Tus registros siguen aquí, intactos.',
    parado: 'El archivo solo se arma cuando tocas el botón.',
  },

  telaPrivacidade: {
    titulo: 'Privacidad y datos',
    lead: 'Dónde quedan tus registros, qué sale de aquí y qué lee la aplicación de afuera.',

    ondeFicam: 'Dónde quedan tus registros',
    noAparelho: 'En el aparato y en tu cuenta',
    noAparelhoTexto: 'Peso, medidas, inyecciones, check-ins, exámenes y anotaciones quedan en este aparato y en nuestra base de datos, en São Paulo, vinculados a tu cuenta. Solo tu cuenta lee tu diario — y la clínica a la que te conectes, mientras dure la conexión. Las fotos del cuerpo quedan solo aquí.',
    desinstalar: 'Desinstalar no se lleva tu diario',
    desinstalarTexto: 'Vuelve cuando entras en tu cuenta, en este aparato o en otro. Solo lo que se registró sin conexión, y todavía no llegó a la cuenta, se perdería junto con la aplicación.',

    oQueSai: 'Qué sale de aquí',
    oQueSaiNota: 'Solo lo primero va solo. Lo demás depende de un gesto tuyo.',
    paraConta: 'Tu diario, para tu cuenta',
    paraContaTexto: 'Los registros y el perfil van a nuestra base de datos siempre que hay conexión. Eso es lo que guarda el diario entre aparatos.',
    paraEquipe: 'Lo que ve tu clínica',
    paraEquipeTexto: 'Nada, hasta que te conectes a una clínica asociada con su código. Antes de conectar, aparece la lista de lo que pasa a ver; lo ve mientras dure la conexión, y puedes desconectarte en la pantalla de la clínica. El resumen para la consulta se arma aquí, y sale cuando lo muestras o lo exportas.',
    perguntas: 'Tus preguntas a Morphi',
    perguntasTexto: 'Solo si permites la lectura, con el interruptor de abajo. Las leemos sin saber quién preguntó, y la clínica nunca las lee. Apagarlo borra las que se enviaron.',
    ditado: 'Tu voz, cuando usas el micrófono',
    ditadoTexto: 'Quien convierte la voz en texto es el sistema del aparato. Pedimos que eso ocurra en el propio aparato, pero, sin el reconocimiento local de tu idioma, el sistema puede enviar el audio a Apple o a Google. Solo mientras el micrófono está encendido.',
    fotoDoPrato: 'La foto del plato, cuando usas la lectura por foto',
    fotoDoPratoTexto: 'Se reduce en el aparato y se envía para que la lea un modelo, que devuelve los ítems del plato. La imagen no queda guardada: ni en tu registro de la comida, ni en el servidor que hace el puente. Registrar la comida a mano no envía nada.',

    leDeFora: 'Qué lee la aplicación de afuera',
    appDeSaudePadrao: 'aplicación de salud del celular',
    soOPeso: (app: string) => `${app}, y solo el peso`,
    soOPesoTexto: (app: string) =>
      `Con tu permiso, leemos los pesajes que tu balanza, tu reloj u otra aplicación escribieron ahí. Solo leemos: nunca escribimos nada en ${app}. Y leemos solo peso — sueño, pasos y latidos quedan fuera.`,
    permissao: 'El permiso es tuyo, y se quita cuando quieras',
    permissaoTexto: 'Se da en los ajustes del sistema y se revoca en el mismo lugar. Sin él, todo aquí sigue funcionando: el peso vuelve a entrar como entró hasta aquí, escrito por ti.',

    podeFazer: 'Qué puedes hacer ahora',
    integracoesSub: (app: string) => `Encender o apagar ${app}`,
    resumo: 'Resumen para la consulta',
    resumoSub: 'Ver todo lo que entra en el resumen de la consulta',

    apagar: 'Borrar mis datos',
    apagarSub: 'Todo lo que registraste, sin vuelta',
    apagarPergunta: '¿Borrar todo de este aparato? Este diario todavía no tiene cuenta, y no existe copia de él en otro lugar.',
    apagarConfirma: 'Borrar',
    cancelar: 'Cancelar',

    documentos: 'Los documentos',
    politicaSub: 'El documento completo, con base legal y plazos',
    termosSub: 'Qué somos, qué no somos, y qué puede esperar cada lado',
    semPoliticaTitulo: 'Esto describe la aplicación, no es la política de privacidad',
    semPoliticaTexto: 'Aquí está lo que la aplicación hace con tus datos. El documento jurídico, con las obligaciones de quien opera el servicio, todavía no se publicó — y cuando exista, aparece en esta pantalla.',
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
