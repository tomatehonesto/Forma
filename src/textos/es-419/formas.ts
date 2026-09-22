/* ============================================================
   LA FORMA DE APLICACIÓN — el vocabulario y la concordancia · es-419

   ⚠️ Las razones viven en ../pt-BR/formas.ts. El español cobra lo mismo
   que el portugués — la pluma, el frasco, la jeringa — y una cosa más:

   ⚠️⚠️ "DE + EL" SE CONTRAE EN "DEL", y no hay excepción. "de la pluma"
   pero "del frasco", nunca "de el frasco". Es exactamente el error que el
   archivo en portugués describe: pasa el `tsc`, pasa la revisión de diff y
   solo aparece en la pantalla de quien usa la forma menos común. Aquí es
   peor que allá, porque en portugués las dos contracciones son simétricas
   ("da"/"do") y en español una se contrae y la otra no.

   ⚠️ "EN" NO SE CONTRAE. "en la pluma" y "en el frasco" — el artículo
   entero se queda. Es la asimetría inversa, y por eso `noNa` y `doDa` no
   se pueden escribir con la misma plantilla.

   ⚠️ LA PALABRA PARA LA PLUMA es "pluma", que es como la nombran los
   laboratorios en América Latina. "Lapicera" se entiende en el Cono Sur y
   no en México; "pluma" se entiende en los dos.

   ⚠️ Y EL RECIPIENTE DEL COMPRIMIDO ES EL BLÍSTER, masculino — mientras
   que en portugués es "cartela", femenino. El género es de la PALABRA, y
   por eso vive en cada archivo y no en la lógica.
   ============================================================ */

type Recipiente = 'caneta' | 'frasco' | 'seringa' | 'comprimido';

/* ⚠️ PRIVADO A PROPÓSITO. No entra en `palavras` y no se exporta: la única
   puerta al género son las funciones de abajo. */
const GENERO: Record<Recipiente, 'm' | 'f'> = {
  caneta: 'f', frasco: 'm', seringa: 'f', comprimido: 'm',
};

const f = (r: Recipiente) => GENERO[r] === 'f';

export const formas = {
  /* ⚠️ EL PLURAL ES CAMPO, y no `recipiente + 's'`. "Blíster" hace
     "blísteres" y no "blísters" — la cuenta fácil ya falla en el cuarto. */
  palavras: {
    caneta: { recipiente: 'pluma', plural: 'plumas', verbo: 'aplicar', acao: 'aplicación' },
    frasco: { recipiente: 'frasco', plural: 'frascos', verbo: 'aplicar', acao: 'aplicación' },
    seringa: { recipiente: 'jeringa', plural: 'jeringas', verbo: 'aplicar', acao: 'aplicación' },
    comprimido: { recipiente: 'blíster', plural: 'blísteres', verbo: 'tomar', acao: 'dosis' },
  } as Record<Recipiente, { recipiente: string; plural: string; verbo: string; acao: string }>,

  concordar: (r: Recipiente, masc: string, fem: string) => (f(r) ? fem : masc),

  /* "en la pluma", "en el frasco" — sin contracción. */
  noNa: (r: Recipiente) => `${f(r) ? 'en la' : 'en el'} ${formas.palavras[r].recipiente}`,
  /* ⚠️⚠️ "de la pluma", pero "DEL frasco". La contracción no es opcional. */
  doDa: (r: Recipiente) => (f(r)
    ? `de la ${formas.palavras[r].recipiente}`
    : `del ${formas.palavras[r].recipiente}`),
  /** "en esta pluma", "en este frasco". */
  nesteNesta: (r: Recipiente) => `${f(r) ? 'en esta' : 'en este'} ${formas.palavras[r].recipiente}`,

  /** "otra pluma", "otro frasco". */
  umOutro: (r: Recipiente, maiusculo = false) => {
    const p = f(r) ? 'otra' : 'otro';
    return maiusculo ? p[0].toUpperCase() + p.slice(1) : p;
  },

  /** "la pluma", "el frasco". */
  oA: (r: Recipiente): string => (f(r) ? 'la' : 'el'),
};
