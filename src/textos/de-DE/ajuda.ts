/* ============================================================
   DIE HILFE — die acht Fragen, und warum genau diese acht · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/ajuda. Die, die bestimmt: JEDE ANTWORT
   IST EINE REGEL AUS DEM CODE und kein Marketingversprechen. „Die Erfolge
   kommen aus den Einträgen“ steht in conquistas.ts; „die Mitteilungen
   hängen an der Erlaubnis des Telefons“ steht in avisos.ts.

   Wer übersetzt, muss das wissen, bevor er irgendeinen Satz weicher
   macht: die Antwort zum Deinstallieren sagt, dass es nirgends eine Kopie
   gibt, weil es keine gibt — und nicht, weil es ehrlich klingt.

   ⚠️ UND ES GIBT KEINE KONTAKTZEILE, vorerst. Ein „schreib uns“, das
   nirgendwohin führt, ist die schlimmste Zeile, die ein Hilfe-Bildschirm
   haben kann: sie erscheint genau für die, die es allein schon nicht
   geschafft haben.
   ============================================================ */

export const ajuda = {
  titulo: 'Hilfe',
  lead: 'Die Fragen, die diese App üblicherweise auslöst, beantwortet mit dem, was sie tatsächlich tut.',
  perguntasFrequentes: 'Häufige Fragen',

  qa: [
    {
      q: 'Woher kommen die Zahlen, die hier stehen?',
      a: 'Alle sind Rechnungen auf dem, was du eingetragen hast — Gewicht, Injektionen, Check-ins, Mahlzeiten, Befunde. Die App ergänzt nichts, was gefehlt hat, und schätzt nichts, was du nicht gesagt hast: ein Tag ohne Antwort erscheint als Tag ohne Antwort und nicht als null.',
    },
    {
      q: 'Kann ich einen Eintrag korrigieren oder löschen?',
      a: 'Ja, und zwar dort, wo er erscheint. Wiegungen und Maße löschst du im Detail des Markers; Mahlzeiten und Einheiten, indem du den Eintrag im Tagebuch des Tages öffnest. Was du löschst, verschwindet sofort aus den Rechnungen — auch aus den Diagrammen und aus der Übersicht für den Termin.',
    },
    {
      q: 'Warum ist ein Erfolg verschwunden?',
      a: 'Weil er nie gespeichert wurde. Die Erfolge werden bei jedem Öffnen des Bildschirms aus deinen Einträgen gezählt und nicht irgendwo als erledigt markiert. Wird der Eintrag gelöscht, der eine Stufe geschlossen hat, geht die Stufe mit — sie hat aufgehört, stattgefunden zu haben.',
    },
    {
      q: 'Ich habe eine Erinnerung gestellt, und sie hat nicht geklingelt.',
      /* ⚠️ „Morphi“ IST DER NAME DER APP und wird nicht übersetzt: es ist
         das, was die Person in der Berechtigungsliste des Systems sieht.
         Hier etwas anderes zu schreiben schickte sie auf die Suche nach
         einem Namen, den es auf jenem Bildschirm nicht gibt. */
      a: 'Es klingelt das Telefon, und es klingelt nur mit Erlaubnis. Wenn Mitteilungen für Morphi in den Systemeinstellungen abgelehnt sind, bleiben deine Erinnerungen hier gespeichert und nichts klingelt. Der Bildschirm Erinnerungen zeigt, wenn das der Fall ist, und führt zur Erlaubnis.',
    },
    {
      q: 'Kann mein Gewicht von allein von der Waage kommen?',
      /* „Wir lesen nur das Gewicht, und wir lesen nur“ — beide Hälften
         sind nachprüfbare Tatsachen, und die zweite beantwortet die
         eigentliche Sorge derer, die fragt. */
      a: 'Wenn deine Waage, Uhr oder dein Ring in Apple Health (iPhone) oder Health Connect (Android) schreibt, ja — wir lesen von dort. Wir lesen nur das Gewicht, und wir lesen nur: wir schreiben nie etwas in diese Apps. Garmin, Fitbit, Withings, Oura und Whoop kommen über diesen Weg.',
    },
    {
      q: 'Was kann mein Team sehen?',
      a: 'Nur das, was du schickst. Von allein geht hier nichts hinaus: die Übersicht geht, wenn du auf Senden tippst, die Nachrichten, wenn du sie schreibst. Was draußen bleibt, bleibt deins — auch vor denen, die dich behandeln.',
    },
    {
      q: 'Ersetzt ihr das, was mir meine Praxis sagt?',
      a: 'Nein, und auf keinem Bildschirm. Was die App tut, ist ordnen, was passiert ist, und Muster in deinen eigenen Einträgen zeigen — Dosis, Symptom und Vorgehen sind ein Gespräch für die Sprechstunde. Wenn ein Text der App diese Themen berührt, sagt er das dazu.',
    },
    {
      q: 'Und wenn ich die App deinstalliere?',
      a: 'Deine Einträge wohnen auf dem Gerät, in der App — ohne Konto und ohne Server. Deinstallieren nimmt alles mit, und es gibt nirgends eine Kopie, aus der sich etwas zurückholen ließe. Davor kannst du unter Exportieren eine Datei mit dem bauen, was du eingetragen hast.',
    },
  ] as { q: string; a: string }[],

  ondeResolver: 'Wo du es löst',
  lembretes: 'Erinnerungen',
  lembretesSub: 'Anlegen, ändern und die Erlaubnis für Mitteilungen prüfen',
  integracoes: 'Geräte und Verbindungen',
  integracoesSub: 'Apple Health oder Health Connect verbinden',
  privacidade: 'Datenschutz und Daten',
  privacidadeSub: 'Was auf dem Gerät bleibt und was es verlässt',
  exportar: 'Deine Daten exportieren',
  exportarSub: 'Eine Datei mit dem bauen, was du eingetragen hast',

  /* ⚠️⚠️ DAS IST DER EINZIGE SATZ DES BILDSCHIRMS, DER NICHT VON DER APP
     HANDELT, und genau deshalb steht er hier: wer die Hilfe mit einem
     Symptom öffnet, das Angst macht, braucht die richtige Tür — und die
     richtige Tür ist nicht dieser Bildschirm. */
  emergenciaTitulo: 'Bei einem ernsten Symptom',
  emergenciaTexto: 'Dieser Bildschirm handelt von der App. Wenn etwas an deinem Körper jetzt Aufmerksamkeit braucht, wende dich an dein Team oder an den Notdienst — warte nicht bis zum nächsten Termin.',
};
