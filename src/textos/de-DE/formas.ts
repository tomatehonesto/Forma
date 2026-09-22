/* ============================================================
   DIE DARREICHUNGSFORM — das Vokabular und die Beugung · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/formas.ts. Deutsch verlangt alles, was
   Portugiesisch, Spanisch und Französisch verlangen, und zwei Dinge mehr:

   ⚠️⚠️ ES GIBT DREI GENERA, NICHT ZWEI. Die anderen drei Sprachen kennen
   männlich und weiblich; Deutsch kennt auch das Neutrum. Deshalb steht in
   der Tabelle 'm' | 'f' | 'n' — und deshalb kann `concordar`, das genau
   zwei Wörter bekommt, das Neutrum gar nicht ausdrücken. Keiner der vier
   heutigen Behälter ist sächlich, der Zweig ist also nie gelaufen: wer
   einen fünften hinzufügt, der „das“ heißt, muss das hier vorher wissen
   und nicht hinterher.

   ⚠️⚠️ UND DER FALL IST DAS EIGENTLICHE PROBLEM. „a caneta“ ist im
   Portugiesischen Subjekt und Objekt zugleich; im Deutschen heißt das
   einmal „der Pen“ und einmal „den Pen“. Drei Funktionen hier kennen
   ihren Fall und stehen richtig:

     · `noNa`       immer Dativ mit „in“ — „im Pen“, „in der Spritze“
     · `nesteNesta` immer Dativ — „in diesem Pen“, „in dieser Spritze“
     · `doDa`       immer Genitiv — „des Pens“, „der Spritze“

   ⚠️⚠️ `oA` KANN NICHT RICHTIG SEIN. Es gibt nur den nackten Artikel
   zurück, und die Aufrufstellen setzen ihn mal ins Subjekt und mal ins
   Objekt — beides im selben Vokabular:

     Nominativ:  index.tsx:245  `${maiuscula(oA(forma))} ${recipiente} acabou.`
                 caneta.tsx:102 `${maiuscula(oA(forma))} … vence antes de acabar`
     Akkusativ:  index.tsx:250  `Ver ${oA(forma)} ${recipiente}`
                 aplicacao-ok.tsx:85  `abrir ${oA(…)} ${…}`
                 caneta.tsx:113 `ficar sem ${oA(forma)} ${recipiente}`
                 derive.ts:2445 `${oA(…)} ${recipiente}`

   Es gibt hier den NOMINATIV zurück. Das ist die Form, die ein deutscher
   Leser als „der Artikel dieses Wortes“ wiedererkennt — und an den
   Akkusativ-Stellen ist es falsch.

   Der Grund, es trotzdem so zu lassen: alle sechs Stellen stehen noch in
   portugiesischen Sätzen, die im Code kleben (PENDENCIAS, Punkt 19). Ein
   Fall-Parameter, der heute in „Ver der Pen“ hineinsticht, hilft niemandem;
   wenn diese Bildschirme in den Katalog wandern, gehört der ganze Satz
   dem Deutschen, und dann entscheidet der Satz über den Fall. Steht in
   PENDENCIAS.

   ⚠️ DAS GENUS GEHÖRT ZUM WORT, und mit vier Sprachen sieht man das
   sofort: der Behälter der Tablette heißt „cartela“ (weiblich) auf
   Portugiesisch, „blíster“ (männlich) auf Spanisch, „plaquette“
   (weiblich) auf Französisch und „der Blister“ (männlich) auf Deutsch.
   Dieselbe Darreichungsform, vier Genera, die nicht zusammenpassen.

   ⚠️ UND „DURCHSTECHFLASCHE“ IST LANG, weil es das Wort ist, das auf der
   Packung steht. Dieselbe Regel wie bei ASAT und ALAT im französischen
   marcadores.ts: was die Person in der Hand hält, entscheidet — nicht
   was kürzer ist. Wer hier das Layout brechen sieht, ändert das Layout.
   ============================================================ */

type Recipiente = 'caneta' | 'frasco' | 'seringa' | 'comprimido';

/* ⚠️ ABSICHTLICH PRIVAT. Es steht nicht in `palavras` und wird nicht
   exportiert: die einzige Tür zum Genus sind die Funktionen unten. */
const GENERO: Record<Recipiente, 'm' | 'f' | 'n'> = {
  caneta: 'm', frasco: 'f', seringa: 'f', comprimido: 'm',
};

/* ⚠️⚠️ DER GENITIV IST EIN FELD, und nicht `recipiente + 's'` — aus genau
   demselben Grund, aus dem der Plural im Portugiesischen ein Feld ist.
   Die vier von heute sind regelmäßig und die Rechnung ginge auf; genau so
   rutscht der fünfte durch, der „des Glases“ heißt und nicht „des Glass“.

   Weiblich beugt gar nicht — „der Spritze“ —, männlich und sächlich
   bekommen -s oder -es, und welches von beiden hängt am Wort. */
const GENITIVO: Record<Recipiente, string> = {
  caneta: 'Pens', frasco: 'Durchstechflasche', seringa: 'Spritze', comprimido: 'Blisters',
};

const g = (r: Recipiente) => GENERO[r];

export const formas = {
  /* ⚠️ DER PLURAL IST EIN FELD, und im Deutschen ist das keine Vorsicht,
     sondern Notwendigkeit: „Pens“, „Spritzen“, „Blister“ — drei
     verschiedene Endungen für drei Wörter, und „Blister“ ändert sich gar
     nicht. Es gibt keine Regel, die man anwenden könnte. */
  palavras: {
    caneta: { recipiente: 'Pen', plural: 'Pens', verbo: 'spritzen', acao: 'Injektion' },
    frasco: { recipiente: 'Durchstechflasche', plural: 'Durchstechflaschen', verbo: 'spritzen', acao: 'Injektion' },
    seringa: { recipiente: 'Spritze', plural: 'Spritzen', verbo: 'spritzen', acao: 'Injektion' },
    comprimido: { recipiente: 'Blister', plural: 'Blister', verbo: 'einnehmen', acao: 'Einnahme' },
  } as Record<Recipiente, { recipiente: string; plural: string; verbo: string; acao: string }>,

  /* ⚠️ ZWEI WÖRTER FÜR DREI GENERA. Das Sächliche bekommt die männliche
     Form — heute trifft das keinen Behälter, und am Tag, an dem es einen
     trifft, ist es still falsch. Siehe oben. */
  concordar: (r: Recipiente, masc: string, fem: string) => (g(r) === 'f' ? fem : masc),

  /* „im Pen“, „in der Spritze“ — Dativ, und „in dem“ zieht sich zu „im“
     zusammen. Das ist keine Kürzung, die man weglassen darf: „in dem Pen“
     klingt wie ein Zeigefinger auf einen bestimmten Pen. */
  noNa: (r: Recipiente) => `${g(r) === 'f' ? 'in der' : 'im'} ${formas.palavras[r].recipiente}`,

  /* ⚠️⚠️ GENITIV, und hier beugt sich das NOMEN mit. „der Spritze“ bleibt
     stehen, „des Pens“ bekommt ein -s. Deshalb die Tabelle oben. */
  doDa: (r: Recipiente) => `${g(r) === 'f' ? 'der' : 'des'} ${GENITIVO[r]}`,

  /** „in diesem Pen“, „in dieser Spritze“ — wieder Dativ. */
  nesteNesta: (r: Recipiente) => `${g(r) === 'f' ? 'in dieser' : 'in diesem'} ${formas.palavras[r].recipiente}`,

  /** „ein anderer Pen“, „eine andere Spritze“. Nominativ, weil es auf
      einem Knopf steht. */
  umOutro: (r: Recipiente, maiusculo = false) => {
    const p = g(r) === 'f' ? 'eine andere' : g(r) === 'n' ? 'ein anderes' : 'ein anderer';
    return maiusculo ? p[0].toUpperCase() + p.slice(1) : p;
  },

  /** „der“, „die“, „das“ — Nominativ. Siehe die Warnung oben. */
  oA: (r: Recipiente): string => (g(r) === 'f' ? 'die' : g(r) === 'n' ? 'das' : 'der'),
};
