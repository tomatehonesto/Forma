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
  dose: 'Aplicación de la dosis',
  doseCurto: 'Aplicación',
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
};
