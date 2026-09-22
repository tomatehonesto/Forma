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
  guardadoTexto: 'Peso, síntomas, aplicaciones, exámenes y notas se graban dentro de la aplicación, en este teléfono. No hay cuenta ni contraseña: nadie entra en tus datos con un inicio de sesión.',

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

    aplicacoes: 'Aplicaciones',
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
};
