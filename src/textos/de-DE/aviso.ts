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
  guardadoTitulo: 'Was du einträgst, wird in deinem Konto aufbewahrt',
  guardadoTexto: 'Gewicht, Beschwerden, Spritzen, Befunde und Notizen liegen auf diesem Telefon und in unserer Datenbank in São Paulo, mit deinem Konto verbunden. So geht dein Tagebuch nicht verloren, wenn du das Handy wechselst oder verlierst. Nur dein Konto liest, was dir gehört.',

  usoTitulo: 'Wofür deine Daten verwendet werden',
  usoTexto: 'Um deine Tagesziele zu bauen, die Entwicklung der Behandlung zu verfolgen und zu ordnen, was du zum Termin mitnimmst. Nichts davon ist eine Diagnose, und die App verschreibt nichts und passt keine Dosis an.',

  /* ⚠️ DER TEIL, DEN EIN EINWILLIGUNGSHINWEIS ÜBLICHERWEISE VERSCHWEIGT,
     und der hier als einziger ändert, wie die Person entscheidet. */
  saiTitulo: 'Was sonst noch von hier weggehen kann, und nur durch eine Geste von dir',
  saiTexto: 'Dein Tagebuch, an die Praxis, mit der du dich über ihren Code verbindest, nachdem du gesehen hast, was sie sehen wird. Und das Foto vom Teller, wenn du die Foto-Erkennung nutzt: es wird zum Auslesen geschickt und nicht aufbewahrt.',

  controleTitulo: 'Du behältst die Kontrolle',
  controleTexto: 'Du kannst jeden Eintrag korrigieren und löschen, alles in eine Datei ausgeben und deine Daten jederzeit vollständig löschen, in den Einstellungen.',

  perguntasTitulo: 'Deine Fragen an Morphi',
  perguntasTexto: 'Wenn du es erlaubst, lesen wir die Fragen, die du Morphi stellst, um zu verstehen, welche Zweifel auftauchen, und die Antworten zu verbessern. Wir lesen sie, ohne zu wissen, wer gefragt hat, und die Praxis liest sie nie. Es ist anfangs aus, und Nein zu sagen ändert nichts an der App.',
  perguntasEscolha: 'Das Lesen meiner Fragen erlauben',
  perguntasDetalhe: 'Einschalten schickt auch die Fragen, die schon hier sind. Du kannst es jederzeit unter Datenschutz und Daten ausschalten, und die geschickten werden gelöscht.',

  consentimentoNovo: {
    titulo: 'Wir haben geändert, wie wir dein Tagebuch aufbewahren',
    lead: 'Es liegt jetzt auch in deinem Konto, in unserer Datenbank, damit es beim Handywechsel nicht verloren geht. Lies, was sich geändert hat, bevor du weitermachst.',
    aceitar: 'Zustimmen und weiter',
    recusar: 'Ich stimme nicht zu',
    recusaTitulo: 'Ohne Zustimmung geht es nicht weiter',
    recusaTexto: 'Die App bewahrt das Tagebuch jetzt in deinem Konto auf und funktioniert ohne es nicht. Wenn du nicht zustimmst, kannst du deine Daten als Datei mitnehmen und alles von diesem Gerät löschen. Nichts wird gelöscht, ohne dass du darum bittest.',
    exportar: 'Meine Daten exportieren',
    apagar: 'Meine Daten von diesem Gerät löschen',
    apagarPergunta: 'Alles von diesem Gerät löschen? Das lässt sich nicht rückgängig machen.',
    apagarConfirma: 'Löschen',
    voltar: 'Zurück und noch mal lesen',
  },

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
  exportacaoPerguntasRecentes: 'Ohne Verbindung kamen nur die neueren Fragen dieses Geräts mit. Mit Verbindung bringt die Datei alle aus deinem Konto.',

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

  telaExportar: {
    titulo: 'Exportieren',
    lead: 'Eine Datei mit deinen Einträgen, zum Aufheben oder zum Mitnehmen an einen anderen Ort.',

    periodo: 'Zeitraum',
    periodoAjuda: (de: string, ate: string, semanas: number) =>
      `Vom ${de} bis ${ate} · ${semanas} ${semanas === 1 ? 'Woche' : 'Wochen'}`,
    ultimas4: 'Die letzten 4 Wochen',
    desdeAConsulta: 'Seit dem letzten Termin',
    tratamentoInteiro: 'Die ganze Behandlung',

    oQueEntra: 'Was hineinkommt',
    oQueEntraNota: 'Tippe, um etwas aufzunehmen oder herauszunehmen. Was draußen bleibt, kommt nicht in die Datei.',
    incluido: 'drin',
    fora: 'draußen',

    aplicacoes: 'Spritzen',
    aplicacoesSub: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'Eintrag' : 'Einträge'} · Datum, Dosis und Stelle`,
    pesoEMedidas: 'Gewicht und Maße',
    pesoEMedidasSub: (pesagens: number, medidas: number) =>
      `${pesagens} ${pesagens === 1 ? 'Wiegung' : 'Wiegungen'} · ${medidas} ${medidas === 1 ? 'Maß' : 'Maße'}`,
    checkins: 'Check-ins',
    checkinsSub: (dias: number) => `${dias} ${dias === 1 ? 'Tag' : 'Tage'} · Symptom für Symptom`,
    exames: 'Befunde',
    examesSub: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'Ergebnis' : 'Ergebnisse'} · Wert und Referenzbereich`,
    notas: 'Notizen für den Termin',
    notasSub: (quantas: number) => `${quantas} ${quantas === 1 ? 'Notiz' : 'Notizen'}`,
    habitos: 'Mahlzeiten, Wasser und Bewegung',
    habitosSub: (refeicoes: number) =>
      `${refeicoes} ${refeicoes === 1 ? 'Mahlzeit' : 'Mahlzeiten'} und das Tagebuch des Tages`,
    completo: 'Das vollständige Tagebuch',
    completoSub: 'Alles, was dein Konto aufbewahrt, ohne Zeitraum, mit deinen Fragen',

    formatoTitulo: 'Heraus kommt eine .json-Datei',
    formatoTexto: 'Das ist das Format, das eine andere App öffnen und lesen kann — gut, um eine Kopie aufzuheben oder deine Einträge woandershin mitzunehmen. Für die Fassung, die jemand lesen soll, nimm die Übersicht für den Termin.',

    gerar: 'Die Datei erstellen',
    gerando: 'Wird gebaut...',
    verResumo: 'Die Übersicht für den Termin ansehen',

    pronto: 'Datei gebaut. Sie geht nur dorthin, wohin du sie schickst.',
    erro: 'Wir konnten die Datei auf diesem Gerät nicht erstellen. Deine Einträge sind weiter hier, unangetastet.',
    parado: 'Die Datei wird erst erstellt, wenn du auf den Knopf tippst.',
  },

  /* ⚠️ HIER STEHT DIE APP ALS SUBJEKT, und zwar mit Absicht: „Was die App
     von außen liest“ ist die FRAGE des Abschnitts, nicht die App, die
     über sich erzählt. Die Antwort darunter steht in der ersten Person —
     „wir lesen“ —, denn dort handelt jemand, und das sind wir. */
  telaPrivacidade: {
    titulo: 'Datenschutz und Daten',
    lead: 'Wo deine Einträge bleiben, was von hier weggeht und was die App von außen liest.',

    ondeFicam: 'Wo deine Einträge bleiben',
    noAparelho: 'Auf dem Gerät und in deinem Konto',
    noAparelhoTexto: 'Gewicht, Maße, Spritzen, Check-ins, Befunde und Notizen liegen auf diesem Gerät und in unserer Datenbank in São Paulo, mit deinem Konto verbunden. Nur dein Konto liest dein Tagebuch — und die Praxis, mit der du dich verbindest, solange die Verbindung besteht. Die Körperfotos bleiben nur hier.',
    desinstalar: 'Deinstallieren nimmt dein Tagebuch nicht mit',
    desinstalarTexto: 'Es kommt zurück, wenn du dich in deinem Konto anmeldest, auf diesem Gerät oder einem anderen. Nur was ohne Verbindung eingetragen wurde und noch nicht im Konto angekommen ist, ginge mit der App verloren.',

    oQueSai: 'Was von hier weggeht',
    oQueSaiNota: 'Nur das Erste geht von allein. Der Rest hängt von einer Geste von dir ab.',
    paraConta: 'Dein Tagebuch, in dein Konto',
    paraContaTexto: 'Die Einträge und das Profil gehen in unsere Datenbank, sobald es eine Verbindung gibt. Das bewahrt das Tagebuch über Geräte hinweg auf.',
    paraEquipe: 'Was deine Praxis sieht',
    paraEquipeTexto: 'Nichts, bis du dich über ihren Code mit einer Partnerpraxis verbindest. Vor dem Verbinden erscheint die Liste dessen, was sie sehen wird; sie sieht es, solange die Verbindung besteht, und du kannst dich auf dem Bildschirm der Praxis trennen. Die Übersicht für den Termin wird hier gebaut und geht weg, wenn du sie zeigst oder exportierst.',
    perguntas: 'Deine Fragen an Morphi',
    perguntasTexto: 'Nur wenn du das Lesen erlaubst, mit dem Schalter unten. Wir lesen sie, ohne zu wissen, wer gefragt hat, und die Praxis liest sie nie. Ausschalten löscht die geschickten.',
    ditado: 'Deine Stimme, wenn du das Mikrofon nutzt',
    ditadoTexto: 'Die Sprache in Text verwandelt das System des Geräts. Wir bitten darum, dass das auf dem Gerät selbst passiert, aber ohne lokale Erkennung deiner Sprache kann das System den Ton an Apple oder Google schicken. Nur solange das Mikrofon an ist.',
    fotoDoPrato: 'Das Foto vom Teller, wenn du die Foto-Erkennung nutzt',
    fotoDoPratoTexto: 'Es wird auf dem Gerät verkleinert und zum Lesen an ein Modell geschickt, das die Bestandteile des Tellers zurückgibt. Das Bild wird nicht aufbewahrt: weder in deinem Eintrag zur Mahlzeit noch auf dem Server, der die Brücke bildet. Die Mahlzeit von Hand einzutragen schickt nichts.',

    leDeFora: 'Was die App von außen liest',
    appDeSaudePadrao: 'Gesundheits-App des Telefons',
    soOPeso: (app: string) => `${app}, und nur das Gewicht`,
    /* ⚠️ DER NAME STEHT HIER NICHT NOCH EINMAL, und das ist kein
       Versehen. Nach einer Präposition bräuchte er einen Artikel — "in die
       Gesundheits-App" —, und mit einem echten Namen wäre der Artikel
       falsch: "in Apple Health". Der Satz wird um den Fall herumgebaut,
       den er bekommt; die Überschrift direkt darüber nennt den Namen. */
    soOPesoTexto: (_app: string) =>
      `Mit deiner Erlaubnis lesen wir die Wiegungen, die deine Waage, deine Uhr oder eine andere App dort eingetragen haben. Wir lesen nur — geschrieben wird dort nie etwas. Und wir lesen nur Gewicht: Schlaf, Schritte und Herzfrequenz bleiben draußen.`,
    permissao: 'Die Erlaubnis gehört dir, und du nimmst sie zurück, wann du willst',
    permissaoTexto: 'Sie wird in den Systemeinstellungen gegeben und an derselben Stelle widerrufen. Ohne sie bleibt die App vollständig: das Gewicht kommt wieder so herein wie bisher, von dir eingetippt.',

    podeFazer: 'Was du jetzt tun kannst',
    integracoesSub: (app: string) => `${app} ein- oder ausschalten`,
    resumo: 'Übersicht für den Termin',
    resumoSub: 'Alles ansehen, was in die Übersicht für den Termin kommt',

    apagar: 'Meine Daten löschen',
    apagarSub: 'Alles, was du eingetragen hast, ohne Weg zurück',
    apagarPergunta: 'Alles von diesem Gerät löschen? Dieses Tagebuch hat noch kein Konto, und es gibt nirgendwo anders eine Kopie davon.',
    apagarConfirma: 'Löschen',
    cancelar: 'Abbrechen',

    documentos: 'Die Dokumente',
    politicaSub: 'Das vollständige Dokument, mit Rechtsgrundlage und Fristen',
    termosSub: 'Was wir sind, was wir nicht sind, und was jede Seite erwarten kann',
    semPoliticaTitulo: 'Das hier beschreibt die App, es ist nicht die Datenschutzerklärung',
    semPoliticaTexto: 'Hier steht, was die App mit deinen Daten macht. Das juristische Dokument, mit den Pflichten dessen, der den Dienst betreibt, muss noch veröffentlicht werden — und sobald es existiert, erscheint es auf diesem Bildschirm.',
  },

  telaIntegracoes: {
    titulo: 'Anbindungen',
    lead: 'Eingeschaltet holen sie deine Wiegungen herein, ohne dass du tippst.',

    doSeuAparelho: 'Von deinem Gerät',
    doSeuAparelhoNota: 'Ein lokaler Speicher: wir fragen um Erlaubnis und lesen. Ohne Konto und ohne Passwort.',

    atualizarAgora: 'Jetzt aktualisieren',
    lendo: 'Wird gelesen…',
    nadaNovo: 'Nichts Neues dort — deine Wiegungen waren schon alle hier.',
    trazidas: (quantas: number, aparelho: string) =>
      `${quantas} ${quantas === 1 ? 'Wiegung geholt' : 'Wiegungen geholt'} aus ${aparelho}.`,
    naoDeuParaLer: 'Gerade ließ es sich nicht lesen. Versuch es gleich noch einmal.',
    acessoNegado: 'Der Zugriff wurde nicht erlaubt. Das lässt sich in den Einstellungen des Geräts ändern.',

    semAparelhoTitulo: 'Die Gesundheits-App des Geräts erscheint auf dem Telefon',
    semAparelhoTexto: 'Apple Health auf dem iPhone, Health Connect auf Android. Im Browser gibt es nichts einzuschalten.',
    semAppTitulo: (aparelho: string) => `${aparelho} ist auf diesem Gerät nicht verfügbar`,
    semAppTexto: 'Health Connect kommt ab Android 14 mit und lässt sich auf älteren Versionen installieren. Komm nach der Installation wieder hierher.',
    semBuildTitulo: 'Diese Version der App liest das Gerät noch nicht',
    semBuildTexto: 'Apple Health und Health Connect zu lesen braucht eine installierte Version der App und nicht die Vorschau. In Expo Go gibt es sie nicht.',

    contasDeServico: 'Dienstkonten',
    contasDeServicoNota: 'Diese liefern die Daten an einen Server und nicht ans Telefon — die Verbindung kommt, sobald dieser Server steht. Bis dahin kommt alles, was sie an die Gesundheits-App deines Geräts schicken, schon hier an.',
    emBreve: 'Bald',
  },
};
