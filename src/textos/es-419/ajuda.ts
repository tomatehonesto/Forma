/* ============================================================
   LA AYUDA — las ocho preguntas, y por qué son estas ocho · es-419

   ⚠️ Las razones viven en ../pt-BR/ajuda. La que manda: CADA RESPUESTA ES
   UNA REGLA DEL CÓDIGO, y no una promesa de marketing. "Los logros salen
   de los registros" está escrito en conquistas.ts; "los avisos dependen
   del permiso del celular" está en avisos.ts.

   Quien traduzca tiene que saberlo antes de suavizar cualquier frase: la
   respuesta sobre desinstalar dice que no hay copia en ningún lado porque
   no la hay, y no porque suene honesto decirlo.

   ⚠️ Y NO HAY LÍNEA DE CONTACTO, por ahora. Un "escríbenos" que no va a
   ningún lado es la peor línea que puede tener una pantalla de ayuda:
   aparece justo para quien ya no logró resolverlo solo.
   ============================================================ */

export const ajuda = {
  titulo: 'Ayuda',
  lead: 'Las dudas que esta aplicación suele provocar, respondidas por lo que de hecho hace.',
  perguntasFrequentes: 'Preguntas frecuentes',

  qa: [
    {
      q: '¿De dónde salen los números que aparecen aquí?',
      a: 'Todos son cuentas hechas sobre lo que registraste — peso, inyecciones, check-ins, comidas, exámenes. La aplicación no completa lo que faltó ni estima lo que no dijiste: un día sin respuesta aparece como día sin respuesta, y no como cero.',
    },
    {
      q: '¿Puedo corregir o borrar un registro?',
      a: 'Puedes, y en el lugar donde aparece. Los pesajes y las medidas se borran en el detalle del marcador; las comidas y los entrenamientos, abriendo el registro en el diario del día. Lo que borres sale de las cuentas al instante — también de los gráficos y del resumen para la consulta.',
    },
    {
      q: '¿Por qué desapareció un logro?',
      a: 'Porque nunca se guardó. Los logros se cuentan a partir de tus registros cada vez que la pantalla abre, y no se marcan como hechos en algún lado. Si se borra el registro que cerró un nivel, el nivel se va con él — para la cuenta, nunca pasó.',
    },
    {
      q: 'Puse un recordatorio y no sonó.',
      /* ⚠️ "Morphi" es el nombre de la aplicación y no se traduce: es lo
         que la persona ve en la lista de permisos del sistema. */
      a: 'Quien suena es el celular, y solo suena con permiso. Si los avisos están negados para Morphi en los ajustes del sistema, tus alertas siguen guardadas aquí y nada suena. La pantalla de Recordatorios muestra cuándo es ese el caso y lleva al permiso.',
    },
    {
      q: '¿Mi peso puede venir solo de la balanza?',
      a: 'Si tu balanza, reloj o anillo escriben en Apple Salud (iPhone) o en Health Connect (Android), sí — leemos de ahí. Leemos solo el peso, y solo leemos: nunca escribimos nada en esas aplicaciones. Garmin, Fitbit, Withings, Oura y Whoop llegan por ese camino.',
    },
    {
      q: '¿Qué puede ver mi equipo?',
      a: 'Solo lo que envíes. Nada sale de aquí solo: el resumen va cuando tocas enviar, los mensajes cuando los escribes. Lo que queda afuera sigue siendo tuyo, incluso frente a quien te acompaña.',
    },
    {
      q: '¿Ustedes reemplazan lo que me indica quien me acompaña?',
      a: 'No, y en ninguna pantalla. Lo que hace es ordenar lo que pasó y mostrar patrones en tus propios registros — dosis, síntoma y conducta son conversación de consulta. Cuando un texto de la aplicación toca esos temas, lo dice.',
    },
    {
      q: '¿Y si desinstalo la aplicación?',
      a: 'Tus registros viven en el aparato, dentro de la aplicación — sin cuenta y sin servidor. Desinstalar se lleva todo, y no hay copia en ningún lado de donde recuperarlos. Antes de eso, puedes armar un archivo con lo que registraste, en Exportar.',
    },
  ] as { q: string; a: string }[],

  ondeResolver: 'Dónde resolverlo',
  lembretes: 'Recordatorios',
  lembretesSub: 'Crear, editar y revisar el permiso de avisos',
  integracoes: 'Dispositivos e integraciones',
  integracoesSub: 'Conectar Apple Salud o Health Connect',
  privacidade: 'Privacidad y datos',
  privacidadeSub: 'Lo que queda en el aparato y lo que sale de él',
  exportar: 'Exportar tus datos',
  exportarSub: 'Armar un archivo con lo que registraste',

  emergenciaTitulo: 'Si el síntoma es grave',
  emergenciaTexto: 'Esta pantalla es sobre la aplicación. Si algo en tu cuerpo pide atención ahora, busca a tu equipo o un servicio de urgencias — no esperes la próxima consulta.',
};
