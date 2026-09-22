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
  guardadoTexto: 'Gewicht, Beschwerden, Spritzen, Befunde und Notizen werden in der App gespeichert, auf diesem Telefon. Es gibt kein Konto und kein Passwort: niemand kommt mit einem Login an deine Daten.',

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
      `${quantos} ${quantos === 1 ? 'Ergebnis' : 'Ergebnisse'} · Wert und Referenz`,
    notas: 'Notizen für den Termin',
    notasSub: (quantas: number) => `${quantas} ${quantas === 1 ? 'Notiz' : 'Notizen'}`,
    habitos: 'Mahlzeiten, Wasser und Bewegung',
    habitosSub: (refeicoes: number) =>
      `${refeicoes} ${refeicoes === 1 ? 'Mahlzeit' : 'Mahlzeiten'} und das Tagebuch des Tages`,

    formatoTitulo: 'Heraus kommt eine .json-Datei',
    formatoTexto: 'Das ist das Format, das eine andere App öffnen und lesen kann — gut, um eine Kopie aufzuheben oder deine Einträge woandershin mitzunehmen. Für die Fassung, die jemand lesen soll, nimm die Übersicht für den Termin.',

    gerar: 'Die Datei bauen',
    gerando: 'Wird gebaut...',
    verResumo: 'Die Übersicht für den Termin ansehen',

    pronto: 'Datei gebaut. Sie geht nur dorthin, wohin du sie schickst.',
    erro: 'Wir konnten die Datei auf diesem Gerät nicht bauen. Deine Einträge sind weiter hier, unangetastet.',
    parado: 'Von hier geht nichts ohne deinen Fingertipp.',
  },

  /* ⚠️ HIER STEHT DIE APP ALS SUBJEKT, und zwar mit Absicht: „Was die App
     von außen liest“ ist die FRAGE des Abschnitts, nicht die App, die
     über sich erzählt. Die Antwort darunter steht in der ersten Person —
     „wir lesen“ —, denn dort handelt jemand, und das sind wir. */
  telaPrivacidade: {
    titulo: 'Datenschutz und Daten',
    lead: 'Wo deine Einträge bleiben, was von hier weggeht und was die App von außen liest.',

    ondeFicam: 'Wo deine Einträge bleiben',
    noAparelho: 'Auf dem Gerät, in der App',
    noAparelhoTexto: 'Gewicht, Maße, Spritzen, Check-ins, Befunde, Fotos und Notizen werden im Speicher der App selbst abgelegt, auf diesem Gerät. Es gibt hier kein Konto und kein Passwort: niemand kommt mit einem Login an deine Daten, weil es kein Login gibt.',
    desinstalar: 'Deinstallieren nimmt alles mit',
    desinstalarTexto: 'Da es auf keinem Server eine Kopie gibt, löscht das Entfernen der App die Einträge. Sie lassen sich danach nicht wiederherstellen.',

    oQueSai: 'Was von hier weggeht',
    oQueSaiNota: 'Von hier geht nichts ohne eine Geste von dir.',
    paraEquipe: 'Was zu deinem Team geht',
    paraEquipeTexto: 'Bis jetzt nichts. Die Übersicht für den Termin wird auf deinem Gerät gebaut, und du zeigst oder exportierst sie; die Nachrichten bleiben hier. Wenn die Verbindung zur Praxis existiert, gehen beide nur mit einem Tippen von dir weg — und nichts aus deinem Tagebuch reist allein, weder Gewicht noch Symptom noch Mahlzeit.',
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
    apagarPergunta: 'Alles löschen? Es gibt nirgends eine Kopie.',
    apagarConfirma: 'Löschen',
    cancelar: 'Abbrechen',

    documentos: 'Die Dokumente',
    politicaSub: 'Das vollständige Dokument, mit Rechtsgrundlage und Fristen',
    termosSub: 'Was wir sind, was wir nicht sind, und was jede Seite erwarten kann',
    semPoliticaTitulo: 'Das hier beschreibt die App, es ist nicht die Datenschutzerklärung',
    semPoliticaTexto: 'Hier steht, was das Programm mit deinen Daten macht. Das juristische Dokument, mit den Pflichten dessen, der den Dienst betreibt, muss noch veröffentlicht werden — und sobald es existiert, erscheint es auf diesem Bildschirm.',
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
