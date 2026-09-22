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
  doseHoje: 'Tu inyección es hoy',
  doseHojeCorpo: (dose: string) => `${dose}. Cuando puedas, regístrala aquí.`,
  doseAmanha: 'Tu inyección es mañana',
  doseAmanhaCorpo: (dose: string, oRecipiente: string) => `${dose}. Vale dejar ${oRecipiente} a la vista.`,
  doseEmDias: (dias: number) => `Tu inyección es en ${dias} días`,
  doseEmDiasCorpo: (dose: string, doRecipiente: string) => `${dose}. Da tiempo de revisar cuánto queda ${doRecipiente}.`,

  checkin: '¿Cómo te fue hoy?',
  checkinCorpo: 'Sueño, hambre, energía y ánimo — cuatro respuestas, y el día queda registrado.',
  peso: 'Día de pesarte',
  pesoCorpo: 'Súbete a la balanza cuando puedas. Un número por semana ya dibuja la curva.',
  agua: 'Un vaso de agua',
  aguaCorpo: 'Ayuda con la saciedad y con las náuseas — y cuenta para la meta del día.',
  proteina: 'Proteína primero',
  proteinaCorpo: 'En la próxima comida, empieza por ella. Es lo que sostiene la masa magra.',
};
