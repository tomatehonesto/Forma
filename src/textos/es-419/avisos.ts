/* ============================================================
   LOS AVISOS — las dos líneas de la pantalla de bloqueo · es-419

   ⚠️ Las razones viven en ../pt-BR/avisos.ts. La que manda: quien lee
   esto está en la calle, en medio de otra cosa. Ninguno reclama, ninguno
   dice "no lo hiciste", y ninguno afirma lo que la aplicación no sabe a
   esa hora — si ya tomó agua hoy, si ya comió, si ya se pesó. El aviso
   ofrece; del día sabe ella.

   ⚠️ Y EL DEL CHECK-IN PREGUNTA, en vez de mandar. Es el único de los
   cinco así: "Haz tu check-in" trata como tarea algo que es conversación,
   y "¿cómo te fue hoy?" es lo que alguien preguntaría.
   ============================================================ */

export const avisos = {
  doseHoje: (acao: string) => `Tu ${acao} es hoy`,
  doseHojeCorpo: (dose: string) => `${dose}. Cuando puedas, regístrala aquí.`,
  doseAmanha: (acao: string) => `Tu ${acao} es mañana`,
  doseAmanhaCorpo: (dose: string, oRecipiente: string) => `${dose}. Conviene dejar ${oRecipiente} a la vista.`,
  doseEmDias: (dias: number, acao: string) => `Tu ${acao} es en ${dias} días`,
  doseEmDiasCorpo: (dose: string, doRecipiente: string) => `${dose}. Da tiempo de revisar cuánto queda ${doRecipiente}.`,

  /* ⚠️ LA DOSIS DIARIA TIENE UN SOLO AVISO, EL DEL DÍA (02/10/2026, parte
     B4 — razones en ../pt-BR/avisos.ts). El verbo sigue la forma: quien
     toma comprimido no se aplica nada. Y el cuerpo no afirma que todavía
     no la tomó. */
  doseDiaria: (injetavel: boolean): string => (injetavel ? 'Hora de aplicarte la dosis de hoy' : 'Hora de tomar la dosis de hoy'),
  doseDiariaCorpo: (dose: string) => `${dose}. Después, basta un toque para registrarla.`,

  checkin: '¿Cómo te fue hoy?',
  checkinCorpo: 'Sueño, hambre, energía y ánimo — cuatro respuestas, y el día queda registrado.',
  peso: 'Día de pesarte',
  pesoCorpo: 'Súbete a la balanza cuando puedas. Un número por semana ya dibuja la curva.',
  agua: 'Un vaso de agua',
  aguaCorpo: 'Ayuda con la saciedad y con las náuseas — y cuenta para la meta del día.',
  proteina: 'Proteína primero',
  proteinaCorpo: 'En la próxima comida, empieza por ella. Es lo que sostiene la masa magra.',
};
