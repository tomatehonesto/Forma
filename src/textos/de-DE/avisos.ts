/* ============================================================
   DIE MITTEILUNGEN — die zwei Zeilen auf dem Sperrbildschirm · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/avisos.ts. Die, die zählt: WER DAS
   LIEST, IST UNTERWEGS UND MITTEN IN ETWAS ANDEREM. Keine dieser Zeilen
   mahnt, keine sagt „du hast nicht“, und keine behauptet, was die App zu
   dieser Stunde nicht weiß — ob heute schon getrunken, gegessen, gewogen
   wurde. Die Mitteilung bietet an; wer den Tag kennt, ist sie.

   ⚠️ UND DIE ZUM CHECK-IN FRAGT, statt anzuweisen. Sie ist die einzige
   der fünf, und das ist Absicht: „Mach dein Check-in“ macht eine Aufgabe
   aus etwas, das ein Gespräch ist.
   ============================================================ */

export const avisos = {
  /* ---------- die Spritze, in drei Entfernungen ---------- */
  /* `dose` kommt fertig an — „Mounjaro 5 mg“ —, und Behälter und Artikel
     kommen aus logic/formas.

     ⚠️⚠️ UND DER SATZ IST SO GEBAUT, DASS DER BEHÄLTER DAS SUBJEKT IST.
     Auf Portugiesisch heißt es „vale deixar a caneta à vista“ — der Pen
     ist dort Objekt, und Deutsch bräuchte „den Pen“. `oA` gibt aber den
     Nominativ zurück und kann es nicht anders (siehe formas.ts). Also
     dreht der deutsche Satz sich um: „Der Pen kann schon bereitliegen.“
     Das ist kein Trick, das ist die Lösung — wer den Fall nicht wählen
     kann, baut den Satz um den Fall herum, den er bekommt. */
  doseHoje: 'Deine Spritze ist heute',
  doseHojeCorpo: (dose: string) => `${dose}. Trag sie ein, wenn es gerade passt.`,
  doseAmanha: 'Deine Spritze ist morgen',
  doseAmanhaCorpo: (dose: string, oRecipiente: string) => `${dose}. ${oRecipiente} kann schon bereitliegen.`,
  doseEmDias: (dias: number) => `Deine Spritze ist in ${dias} Tagen`,
  /* Hier passt der Genitiv, und `doDa` liefert ihn: „den Vorrat des Pens“. */
  doseEmDiasCorpo: (dose: string, doRecipiente: string) => `${dose}. Zeit genug, den Vorrat ${doRecipiente} zu prüfen.`,

  /* ---------- die anderen vier ---------- */
  checkin: 'Wie war dein Tag?',
  checkinCorpo: 'Schlaf, Hunger, Energie und Stimmung — vier Antworten, und der Tag ist eingetragen.',
  peso: 'Wiegetag',
  pesoCorpo: 'Stell dich auf die Waage, wenn es passt. Eine Zahl pro Woche zeichnet die Kurve schon.',
  agua: 'Ein Glas Wasser',
  aguaCorpo: 'Hilft gegen Hunger und Übelkeit — und zählt fürs Tagesziel.',
  proteina: 'Erst das Eiweiß',
  proteinaCorpo: 'Fang bei der nächsten Mahlzeit damit an. Es ist das, was die Muskelmasse hält.',
};
