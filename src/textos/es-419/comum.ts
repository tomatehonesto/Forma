/* ============================================================
   LAS REGLAS DE IDIOMA QUE NO SON DE NINGÚN DOMINIO · es-419

   ⚠️ Las razones viven en ../pt-BR/comum.ts. Aquí vive lo que es gramática
   pura: lo que todo dominio necesita y de lo que ninguno es dueño.

   ⚠️⚠️ Y EL ESPAÑOL COBRA ALGO QUE EL PORTUGUÉS NO: la "y" se vuelve "e"
   delante de palabra que empieza por i- o hi-. "Sueño e insomnio", y no
   "sueño y insomnio". Es exactamente el tipo de regla que se pierde
   cuando la lista se arma con un join en la pantalla — y por eso esta
   función existe.

   La excepción de la excepción: "hie-" mantiene la "y" ("agua y hielo"),
   porque ahí el sonido ya no es de i.
   ============================================================ */

/* ⚠️ MIRA LA PALABRA, NO LA LETRA. Un acento sobre la i cuenta igual, y
   la "h" muda se salta antes de decidir. */
const pideE = (palavra: string) => {
  const p = palavra.trim().toLowerCase();
  if (/^hie/.test(p)) return false;
  return /^h?[ií]/.test(p);
};

const y = (proxima: string) => (pideE(proxima) ? 'e' : 'y');

export const comum = {
  /* ⚠️ La mayúscula en medio de la frase es regla de idioma. Ver
     ../pt-BR/comum: el alemán escribe TODO sustantivo con mayúscula, y
     por eso esto es una función y no un `.toLowerCase()` suelto en la
     lógica. */
  noMeio: (s: string) => s.toLowerCase(),

  lista: (itens: string[], mostrar = Infinity) => {
    if (!itens.length) return '';
    if (itens.length === 1) return itens[0];
    if (itens.length <= mostrar) {
      const ultimo = itens[itens.length - 1];
      return `${itens.slice(0, -1).join(', ')} ${y(ultimo)} ${ultimo}`;
    }
    return `${itens.slice(0, mostrar).join(', ')} y ${itens.length - mostrar} más`;
  },

  abas: {
    home: 'Inicio',
    jornada: 'Camino',
    cuidado: 'Cuidado',
    insights: 'Insights',
  },
};
