/* ============================================================
   DIE ZEIT, WIE MAN SIE SAGT — „heute“, „gestern“, „in 3 Tagen“ · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/tempo.ts. Das ist kein Format, das ist
   Rede: das Format sagt, WIE eine Zahl oder ein Datum geschrieben wird,
   und steht in logic/local. Hier steht, WAS man anstelle des Datums sagt.

   ⚠️ ES SIND ZWEI FRAGEN, UND SIE SIND NICHT DIESELBE. `daquiA` schaut nur
   nach vorn: eine überfällige Dosis ist eine Dosis für JETZT, also liest
   alles Vergangene „heute“. `relativo` schaut in beide Richtungen und ist
   das Richtige für eine Blutabnahme oder einen Termin, der schon war.

   ⚠️⚠️ UND DEUTSCH BRAUCHT HIER DEN DATIV IM PLURAL. „in 3 Tagen“, nicht
   „in 3 Tage“ — und „vor 3 Tagen“ für die Vergangenheit. Das Portugiesische
   hat zwei Präpositionen für dieselbe Entfernung („há“ und „em“), das
   Deutsche auch („vor“ und „in“), aber das Substantiv beugt sich in beiden
   Richtungen gleich. Das ist der bequeme Teil.
   ============================================================ */

export const tempo = {
  /** Nur nach vorn: „heute“, „morgen“, „in 3 Tagen“. */
  daquiA: (dias: number) => (dias <= 0 ? 'heute' : dias === 1 ? 'morgen' : `in ${dias} Tagen`),

  /** In beide Richtungen. Negativ ist Vergangenheit. */
  relativo: (dias: number) => {
    if (dias === 0) return 'heute';
    if (dias === -1) return 'gestern';
    if (dias === 1) return 'morgen';
    return dias < 0 ? `vor ${-dias} Tagen` : `in ${dias} Tagen`;
  },
};
