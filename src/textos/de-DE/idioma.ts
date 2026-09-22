/* ============================================================
   DIE SPRACHE — die erste Frage der Anmeldung, und der Bildschirm im Profil · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/idioma.ts. Die, die zählt: DAS IST DER
   EINZIGE TEXT DER APP, DEN JEMAND LESEN KANN, OHNE IHN ZU VERSTEHEN. Er
   erscheint, bevor die Person die Sprache wählt, also steht er in der
   Sprache, die das Gerät vorgeschlagen hat — die beste Vermutung, keine
   Gewissheit. Wer die Frage nicht versteht, kann trotzdem antworten, weil
   jede Option in ihrer eigenen Sprache dasteht: die Liste rettet den
   Bildschirm, nicht der Satz.
   ============================================================ */

export const idioma = {
  /* Die Frage in der Anmeldung. */
  pergunta: 'In welcher Sprache möchtest du lesen?',
  sub: 'Das ändert den Text, die Zahlen und die Daten. Du kannst es später im Profil umstellen.',

  /* ⚠️⚠️ DAS LAND IST DIE ZWEITE FRAGE DIESES BILDSCHIRMS, und es ist
     nicht die Sprache unter anderem Namen. Wer aus Brasilien kommt und in
     Lissabon lebt, liest Portugiesisch und kauft in Euro; wer aus Mexiko
     kommt und in den USA lebt, liest vielleicht lieber Spanisch und hat
     Zepbound in der Apotheke um die Ecke. Eines aus dem anderen
     abzuleiten, geht bei beiden schief.

     ⚠️ UND DIE FRAGE LAUTET „WO BEHANDELST DU DICH“, nicht „woher kommst
     du“. Das Land entscheidet über Apotheke, Währung und
     Lebensmitteltabelle — alles Dinge des Ortes, an dem jemand ist, und
     keines des Ortes, an dem jemand geboren wurde. */
  pais: 'Land',
  paisRotulo: 'Wo du dich behandelst',
  paisRessalva: 'Ändert, welche Medikamente zuerst erscheinen, die Währung und die Lebensmitteltabelle. Nichts verschwindet aus der Liste: was dort seltener ist, rutscht nach unten.',

  /* Der Bildschirm im Profil, wo umgestellt wird. */
  titulo: 'Sprache und Region',
  tituloSub: 'In welcher Sprache du liest, und wo du dich behandelst.',
  rotulo: 'Wie du die App liest',

  /* ⚠️ DIE EINSCHRÄNKUNG IST DER TEIL, DER ÜBERRASCHT. Auf English
     umzustellen tauscht auch das Dezimalkomma gegen den Punkt und das
     Datumsbild — dieselbe Einstellung, und der Grund steht oben in
     logic/local. Was sich NICHT ändert, ist das bereits Erfasste, und das
     zu sagen nimmt die Angst davor, es anzufassen. */
  ressalva: 'Was du schon erfasst hast, bleibt, wie es ist. Es ändert sich nur die Schreibweise: das Wort, das Komma in der Zahl, das Datumsbild und die Uhr.',

  /* Die Zeile im Profil, mit der Sprache, die gerade läuft. */
  idioma: 'Sprache',
};
