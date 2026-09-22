/* ============================================================
   DIE EINWILLIGUNG UND DER REST — der Haftungshinweis, die Datenkarten und die Reste · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/aviso.ts. Die, die bestimmt: DER
   HAFTUNGSHINWEIS ERÖFFNET DEN LETZTEN SCHRITT DER ANMELDUNG UND HAT
   EINEN EIGENEN SCHLÜSSEL. Der Rest der Karten handelt von DATEN — was
   bleibt, was hier hinausgeht. Dieser handelt von der BEHANDLUNG, und er
   ist das Einzige in der Anmeldung, das jemand auf eine Weise
   missverstehen kann, die schadet: zu glauben, die App wisse, ob die
   Dosis stimmt.

   ⚠️ UND ER MACHT DIE APP NICHT KLEIN, UM SICH ZU SCHÜTZEN. „Das ist keine
   medizinische App“ ist wahr und feige: wer das liest, hat gerade
   dreizehn Fragen zur eigenen Behandlung beantwortet und verdient zu
   wissen, was sie bekommt, und nicht nur, was nicht. Der Satz sagt
   beides, in dieser Reihenfolge — was wir tun, und wo wir aufhören.
   ============================================================ */

export const aviso = {
  isencaoTitulo: 'Wir begleiten deine Behandlung — wir führen sie nicht',
  isencaoTexto: 'Wir heben auf, was du einträgst, zeigen dir, wie es läuft, und bereiten vor, was du zum Termin mitnimmst. Wir stellen keine Diagnose und verschreiben nichts: Dosis, Abstand und Medikament entscheidet, wer dich behandelt.',
  isencaoReforco: 'Bevor du an deiner Dosis oder deinem Zeitpunkt etwas änderst, sprich mit deinem Team. Und wenn ein Symptom auftaucht, das dir Angst macht, warte nicht bis zum nächsten Termin.',
  isencaoAceite: 'Verstanden und einverstanden',

  /* Die vier Datenkarten, in der Reihenfolge, in der die Frage aufkommt. */
  guardadoTitulo: 'Was du einträgst, bleibt auf deinem Gerät',
  guardadoTexto: 'Gewicht, Beschwerden, Injektionen, Befunde und Notizen werden in der App gespeichert, auf diesem Telefon. Es gibt kein Konto und kein Passwort: niemand kommt mit einem Login an deine Daten.',

  usoTitulo: 'Wofür deine Daten verwendet werden',
  usoTexto: 'Um deine Tagesziele zu bauen, die Entwicklung der Behandlung zu verfolgen und zu ordnen, was du zum Termin mitnimmst. Nichts davon ist eine Diagnose, und die App verschreibt nichts und passt keine Dosis an.',

  /* ⚠️ DER TEIL, DEN EIN EINWILLIGUNGSHINWEIS ÜBLICHERWEISE VERSCHWEIGT,
     und der hier als einziger ändert, wie die Person entscheidet. */
  saiTitulo: 'Was von hier hinausgehen kann, und nur auf dein Tippen hin',
  saiTexto: 'Die Übersicht und die Nachrichten, die du deinem Behandlungsteam schickst. Und das Foto vom Teller, wenn du die Foto-Erkennung nutzt: es wird zum Auslesen geschickt und nicht aufbewahrt.',

  controleTitulo: 'Du behältst die Kontrolle',
  controleTexto: 'Du kannst jeden Eintrag korrigieren und löschen, alles in eine Datei ausgeben und deine Daten jederzeit vollständig löschen, in den Einstellungen.',

  /* ⚠️ NUR DER NAME VON APPLE ÄNDERT SICH. „Apple Health“ heißt auf
     Deutsch tatsächlich „Apple Health“ — Apple übersetzt den Namen dieser
     App im deutschen Store nicht, anders als im Portugiesischen, wo sie
     „Apple Saúde“ heißt. Health Connect, Garmin, Fitbit und Withings sind
     Marken und bleiben im Code: Marken werden nicht übersetzt. */
  appleSaude: 'Apple Health',
  trazPesagens: 'Deine Wiegungen — auch die, die deine Waage dorthin schickt.',
  trazTreinos: 'Einheiten und Herzfrequenz',
  trazSono: 'Schlaf und Schritte',
  trazBalanca: 'Waage und Blutdruck',

  /* ⚠️ ALLE DREI ENDEN MIT DEM WEG VON HAND, und genau das trennt sie von
     einer Fehlermeldung: die Person hat den Teller fotografiert, weil sie
     eintragen will, und nur „hat nicht geklappt“ zu sagen lässt sie auf
     halbem Weg stehen. */
  fotoSemServidor: 'Die Foto-Erkennung ist noch nicht aktiv. Du kannst den Teller hier unten zusammenstellen.',
  fotoSemRede: 'Keine Verbindung, um das Foto jetzt auszulesen. Du kannst den Teller hier unten zusammenstellen.',
  fotoNaoReconheci: 'Ich konnte den Teller nicht erkennen. Stell hier unten zusammen, was drauf war.',

  /* ============================================================
     DAS ABO und der Export
     ============================================================ */
  porMes: 'pro Monat',
  porMesCurto: '/Mon.',

  /* ⚠️ DER HINWEIS IN DER EXPORTDATEI IST DERSELBE WIE IN DER ÜBERSICHT,
     und aus demselben Grund: wer dieses JSON öffnet, muss wissen, dass es
     Aufzeichnungen der Person selbst sind und keine Akte. */
  exportacaoAviso: 'Von der Person selbst in der App gemachte Aufzeichnungen. Keine Akte und kein Befundbericht.',
  exportacaoTitulo: 'Deine Daten aus Morphi',

  /* Das Medikament derer, die noch nicht geantwortet haben. */
  medIndefinido: 'Noch nicht festgelegt',

  /* Das größte Wassergefäß, das nicht in die Getränkeliste passte. */
  garrafao: 'Kanister',

  /* ⚠️ DIE NAMEN SIND SCHLÜSSEL UND BESCHRIFTUNG ZUGLEICH — es ist der
     `tipo`, der in jeder Einheit gespeichert bleibt. Dieselbe Familie wie
     der Zeitpunkt der Mahlzeit und der Marker des Befunds: Übersetzen
     zerbricht keinen neuen Eintrag, und ein alter Eintrag erscheint mit
     dem Namen, unter dem er gespeichert wurde.

     ⚠️ UND „BIKE“ BLEIBT, weil es im deutschen Sprachgebrauch steht — wer
     radfährt, sagt beides. „Radfahren“ wäre nicht falsch, aber die Liste
     ist eine Liste von Sportarten, und dort heißt es Bike. */
  modalidades: {
    caminhada: 'Spazieren',
    corrida: 'Laufen',
    musculacao: 'Krafttraining',
    bike: 'Bike',
    natacao: 'Schwimmen',
    yoga: 'Yoga',
    pilates: 'Pilates',
    funcional: 'Functional',
    alongamento: 'Dehnen',
    outro: 'Anderes',
  },
};
