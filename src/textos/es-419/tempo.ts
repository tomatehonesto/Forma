/* ============================================================
   EL TIEMPO DICHO PARA GENTE — "hoy", "ayer", "en 3 días" · es-419

   ⚠️ Las razones viven en ../pt-BR/tempo.ts. Esto no es formato, es
   habla: responde QUÉ se dice en lugar de la fecha.

   ⚠️ EL ESPAÑOL USA "hace" PARA EL PASADO y "en" para el futuro, igual
   que el portugués — dos preposiciones distintas para la misma
   distancia. El inglés pone "ago" al final, lo que cambia el ORDEN de la
   frase; por eso esto es una función por idioma y no una tabla de
   palabras.
   ============================================================ */

export const tempo = {
  /** Solo hacia adelante: "hoy", "mañana", "en 3 días". */
  daquiA: (dias: number) => (dias <= 0 ? 'hoy' : dias === 1 ? 'mañana' : `en ${dias} días`),

  /** Hacia los dos lados. Negativo es pasado. */
  relativo: (dias: number) => {
    if (dias === 0) return 'hoy';
    if (dias === -1) return 'ayer';
    if (dias === 1) return 'mañana';
    return dias < 0 ? `hace ${-dias} días` : `en ${dias} días`;
  },
};
