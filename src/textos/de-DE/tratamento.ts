/* ============================================================
   DIE BEHANDLUNG — die Dosis, der Rhythmus, die Meilensteine und die Skalen · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/tratamento.ts. Was diese Datei
   zusammenhält: es sind die Wörter, die die Behandlung selbst beschreiben,
   und fast alle tauchen auf mehr als einem Bildschirm auf.

   ⚠️ KEINES DAVON BENOTET DIE PERSON. Die Etiketten für Tempo und Vorrat
   bewerten die ZAHL, nicht die, die sie erzeugt hat.
   ============================================================ */

export const tratamento = {
  /* ⚠️ DER SCHLÜSSEL IST DER PORTUGIESISCHE NAME und wird nicht
     übersetzt. Siehe ../pt-BR/tratamento.

     ⚠️ UND DIE DEUTSCHEN FREINAMEN ENDEN AUF -id, ohne das -a am Ende:
     Tirzepatid, Semaglutid, Dulaglutid. Das ist keine Kürzung, das ist
     der Name — und er steht so auf der Packung. Er bleibt
     großgeschrieben, weil er ein Substantiv ist, und deshalb tut
     `comum.noMeio` an ihm nichts. */
  molecula: {
    'Tirzepatida': 'Tirzepatid',
    'Semaglutida': 'Semaglutid',
    'Dulaglutida': 'Dulaglutid',
    'Liraglutida': 'Liraglutid',
    '—': '—',
  } as Record<string, string>,

  /* ---------- die Dosis und der Rhythmus ---------- */
  /* ⚠️ DAS FEHLEN HAT EINEN EIGENEN SATZ, und der ist mit Absicht kurz: er
     kommt mitten in andere hinein, wie „Mounjaro, noch nicht festgelegt“. */
  doseIndefinida: 'noch nicht festgelegt',

  /* ⚠️ ZWEI LÄNGEN, UND DAS IST ABSICHT. Die Eröffnungszeile eines
     Bildschirms spricht aus; die Zelle einer ärztlichen Übersichtstabelle
     hat diese Breite nicht. Die kurze Fassung muss neben eine Zahl
     passen. */
  cadenciaSemanal: 'einmal pro Woche',
  cadenciaDiaria: 'tägliche Einnahme',
  cadenciaOutra: (dias: number) => `alle ${dias} Tage`,
  cadenciaSemanalCurta: '1×/Woche',
  cadenciaDiariaCurta: 'täglich',
  cadenciaOutraCurta: (dias: number) => `alle ${dias} Tage`,

  /* ---------- der Behandlungstag ---------- */
  /* Vor dem Start gibt es einen Countdown; danach den Tag. */
  antesDaPrimeiraDose: 'Vor der ersten Dosis',
  comecaAmanha: 'Beginnt morgen',
  comecaEm: (dias: number) => `Beginnt in ${dias} Tagen`,
  /* ⚠️ „TAG 71“, UND NICHT „TAG 71 DER BEHANDLUNG“. Die Zeile, in der das
     steht, endet schon auf „Woche 10“, und beide zusammen können nur
     dasselbe zählen — zu sagen, welcher Behandlung, war das überzählige
     Wort. */
  diaDoTratamento: (dia: number) => `Tag ${dia}`,

  /* ⚠️ EIN NEGATIVES TEMPO IST KEIN „LANGSAMERES TEMPO“. Wer zugenommen
     hat, fiel in die letzte Etikette, und die Karte sagte „Langsameres
     Tempo“ in Grün neben einer Zahl, die gestiegen war. Langsam und
     umgekehrt sind verschiedene Dinge, und nur eines davon ist ein Tempo.

     ⚠️ UND BESCHLEUNIGT IST NICHT SCHLECHT. Mehr als 1,5 kg pro Woche zu
     verlieren ist ein Grund, mit dem Team zu sprechen — Muskelmasse,
     Flüssigkeit —, und kein Fehler, den jemand gemacht hat. Das Wort darf
     nicht nach Zurechtweisung klingen. */
  ritmoAcimaDoInicio: 'Über dem Start',
  ritmoSaudavel: 'In gesundem Tempo',
  ritmoAcelerado: 'Schnelles Tempo',
  ritmoLento: 'Langsameres Tempo',

  /* Drei Grade, und der mittlere erscheint am häufigsten: „ein Rezept
     lohnt sich“ ist ein Hinweis mit Wochen Vorlauf, kein Alarm. */
  estoqueUrgente: 'Jetzt nachbestellen',
  estoqueRenovar: 'Ein neues Rezept lohnt sich',
  estoqueEmDia: 'Vorrat reicht',

  /* ⚠️ DIE SEITE KOMMT ABGEKÜRZT UND IN KLAMMERN, weil diese Etiketten in
     kurzen Zeilen stehen — Verlauf, Vorschlag des Tages, Wochenübersicht.
     „Bauch linke Seite“ passt in keine davon. */
  locais: {
    'abd-e': 'Bauch (li.)',
    'abd-d': 'Bauch (re.)',
    'coxa-e': 'Oberschenkel (li.)',
    'coxa-d': 'Oberschenkel (re.)',
    'braco-e': 'Arm (li.)',
    'braco-d': 'Arm (re.)',
  },

  marcos: {
    inicio: 'Beginn der Behandlung',
    doseAjustada: (dose: string) => `Dosis auf ${dose} mg angepasst`,
    /* ⚠️ „NACH ÄRZTLICHER ANWEISUNG“ ist das, was die Zeile davon abhält,
       so auszusehen, als hätte die App etwas angepasst. Sie trägt ein;
       wer anpasst, ist wer verschreibt. */
    titulacao: 'Aufdosierung nach ärztlicher Anweisung',
    cincoPorCento: '5% des Startgewichts',
    /* ⚠️ „ÜBER DIE WAAGE HINAUS“ ist der Kern: die 5% sind die Marke, ab
       der die Literatur einen Gewinn bei Blutdruck, Blutzucker und
       Triglyzeriden zeigt. Ohne diese Hälfte wird die Zeile zu einer
       weiteren Gewichtszahl. */
    cincoPorCentoSub: 'Klinische Marke, mit Nutzen über die Waage hinaus',
    consulta: (tipo: string) => `Termin ${tipo}`,
    marcadoresImportados: (quantos: number) => `${quantos} Marker eingelesen`,
  },

  /* ⚠️ DAS SIND DIE NAMEN DER KLASSIFIKATION und keine von uns gewählten
     Adjektive. „Adipositas Grad I“ ist der Begriff des Befunds; ihn durch
     etwas Weicheres zu ersetzen brächte die App aus der Linie mit dem, was
     die Person im Befund und in der Sprechstunde liest. Wo die Rücksicht
     hingehört, ist der TON der Farbe, und das ist eine Entscheidung des
     Bildschirms. */
  imc: {
    abaixo: 'Untergewicht',
    normal: 'Normalgewicht',
    sobrepeso: 'Übergewicht',
    grau1: 'Adipositas Grad I',
    grau2: 'Adipositas Grad II',
    grau3: 'Adipositas Grad III',
  },

  /* ⚠️ KEINER DER FÜNF HANDELT VOM AUSSEHEN ALLEIN, und „Wie ich mich
     sehe“ kommt dem mit Absicht am nächsten: der Satz gehört der Person
     über sich, nicht der App über ihren Körper. „Abnehmen, um schön zu
     sein“ wäre ein anderes Produkt. */
  motivos: {
    saude: 'Gesundheit',
    saudeSub: 'Blutwerte, Blutdruck, Blutzucker',
    energia: 'Energie',
    energiaSub: 'Schwung im Alltag',
    espelho: 'Wie ich mich sehe',
    espelhoSub: 'Im Spiegel und auf Fotos',
    confianca: 'Selbstvertrauen',
    confiancaSub: 'Mich wohl mit mir fühlen',
    medico: 'Ärztliche Empfehlung',
    medicoSub: 'Es kam von denen, die mich behandeln',
  },

  /* ⚠️ DER UNTERTITEL IST DAS, WAS DIE STUFE ÜBERHAUPT BEDEUTEN LÄSST.
     Ohne „1 bis 3 Tage pro Woche“ ist „leicht aktiv“ eine
     Selbsteinschätzung, und jede Person setzt sich auf eine andere Stufe —
     bei einer Zahl, aus der ihr Eiweißziel wird. */
  atividades: {
    sedentario: 'Sitzend',
    sedentarioSub: 'Wenig oder keine Bewegung',
    leve: 'Leicht aktiv',
    leveSub: '1 bis 3 Tage pro Woche',
    moderado: 'Mäßig aktiv',
    moderadoSub: '3 bis 5 Tage pro Woche',
    muito: 'Sehr aktiv',
    muitoSub: '6 bis 7 Tage pro Woche',
  },

  /* ============================================================
     DER BEWEGUNGS-BILDSCHIRM · de-DE

     ⚠️⚠️ DIE DAUER IST EINE SPRACHREGEL, und sie stand in der Datei des
     Bildschirms fest geschrieben. „6 Std. 20“ statt „380 Min.“: über
     einer Stunde zwingt die reine Minute dazu, im Kopf zu teilen, um zu
     wissen, ob das viel ist.

     Und jede Sprache schreibt die Stunde anders — „6 h 20“, „6 hr 20“,
     „6 Std. 20“. Die Funktion im Bildschirm zu lassen zwang alle fünf in
     die portugiesische Abkürzung. Siehe ../pt-BR/tratamento.
     ============================================================ */
  telaExercicio: {
    titulo: 'Bewegung',
    /* ⚠️ 'Min.' MIT PUNKT, wie der Rest dieser Datei. 'min' wäre das
       SI-Zeichen und bliebe nach der Regel im Code — aber dann stünden
       zwei Schreibweisen derselben Minute auf demselben Bildschirm. */
    unidadeMin: 'Min.',
    duracao: (min: number) => {
      if (min < 60) return `${min} Min.`;
      const h = Math.floor(min / 60);
      const m = min % 60;
      return m ? `${h} Std. ${m}` : `${h} Std.`;
    },

    hojeSemTreino: (daSemana: number) => `Heute: noch keine Einheit · ${daSemana} Min. diese Woche`,
    hojeComTreino: (hoje: number, alvo: number, resto: string) => `Heute: ${hoje} von ${alvo} Min. · ${resto}`,
    metaAlcancada: 'Ziel erreicht',
    faltamMin: (falta: number) => `noch ${falta} Min.`,
    registrarTreino: 'Eine Einheit eintragen',

    movimentoTitulo: 'Deine Bewegung',
    estaSemana: 'Diese Woche',
    nenhumDiaComMovimento: 'Kein Tag mit Bewegung',
    emDiasDosSete: (dias: number) => `An ${dias} von sieben ${dias === 1 ? 'Tag' : 'Tagen'}`,
    metaMin: (alvo: number) => `Ziel: ${alvo} Min.`,

    /* ⚠️ DIE ZEILE ZUM KRAFTTRAINING BERICHTET, SIE MAHNT NICHT. Im
       Kaloriendefizit verliert, wer nur Ausdauer macht, Magermasse
       zusammen mit dem Fett — und die Magermasse ist das, was die App den
       ganzen Tag zu halten versucht. Der Satz sagt, an wie vielen Tagen es
       welches gab, und hört auf. */
    semForca: 'Diese Woche keine Krafteinheit. Krafttraining, Pilates und Functional sind das, was den Muskel hält.',
    comForca: (dias: number) => `${dias} ${dias === 1 ? 'Tag' : 'Tage'} mit Krafttraining — das ist es, was den Muskel hält, während das Gewicht fällt.`,

    minutosPorSemana: 'Minuten pro Woche',
    mediaOitoSemanas: 'Schnitt der letzten 8 Wochen',
    semanaDe: (data: string) => `Woche vom ${data}`,

    periodo7: '7 Tage',
    periodo30: '30 Tage',
    periodo90: '3 Monate',
    noPeriodo: 'Im Zeitraum',
    noPeriodoNota: 'Nur, was hier eingetragen wurde — was von der Uhr kommt, hat keine Sportart.',
    treinos: 'Einheiten',
    tempo: 'Zeit',
    maisLongo: 'Längste',
    deForca: 'Kraft',

    diarioTitulo: 'Trainingstagebuch',
    diarioNota: 'Tipp auf eine Einheit, um sie anzusehen, zu korrigieren oder zu löschen.',
    diaVazioTitulo: 'Keine Einheit an diesem Tag',
    /* „Ruhe gehört dazu“ — und nicht „trag eine Einheit ein“: ein Tag ohne
       Training ist in einer Behandlung kein offener Punkt. */
    diaVazioTexto: 'Ruhe gehört auch dazu.',

    integracoes: 'Verbindungen',
    conectar: 'Eine Uhr oder App verbinden',
    lancamSozinhos: 'Tragen die Minuten von allein ein',
    conectarSub: 'Apple Health, Health Connect, Garmin und andere',
  },

  /* ============================================================
     DER INJEKTIONS-BILDSCHIRM · de-DE
     ============================================================ */
  telaAplicacoes: {
    aplicada: 'gespritzt',
    semCulpa: 'Kein schlechtes Gewissen wegen eines vergangenen Tages — es zählt, wieder anzuknüpfen. Du kannst eine frühere Injektion jederzeit nachtragen, mit dem Knopf unten.',
    titulo: 'Injektionen',
    registrar: 'Injektion eintragen',
    lead: (med: string, molecula: string, cadencia: string) => `${med} · ${molecula} · ${cadencia}`,

    proximaAplicacao: 'NÄCHSTE INJEKTION',

    cicloDaDose: 'Dosiszyklus',
    /* ⚠️ KEIN `toLowerCase()` AN DER PHASE: „Tag 4 von 7 · anstieg“ wäre
       ein Rechtschreibfehler. Dieselbe Regel wie `comum.noMeio`. */
    cicloSub: (dia: number, total: number, fase: string) => `Tag ${dia} von ${total} · ${fase}`,
    emCurso: 'läuft',

    eReceita: (recipiente: string) => `${recipiente} und Rezept`,
    dosesUsadas: (usadas: number, total: number, onde: string) => `${usadas} von ${total} Dosen verbraucht ${onde}`,
    cobreSemanas: (veredito: string, semanas: number) =>
      `${veredito} — reicht rund ${semanas} ${semanas === 1 ? 'Woche' : 'Wochen'}`,

    alertasDeDose: (quantos: number) => `${quantos} ${quantos === 1 ? 'Erinnerung' : 'Erinnerungen'} für die Injektion`,
    nenhumAlerta: 'Keine Erinnerung für die Injektion',
    tocaEm: (quando: string) => `Klingelt ${quando}`,
    avisoAntes: 'Ein Hinweis vor der Dosis, zu der Uhrzeit, die du wählst',

    /* ⚠️ DER STELLENWECHSEL IST KEIN SCHMUCK: immer dieselbe Stelle zu
       treffen macht Knoten, und zu wechseln steht in der
       Packungsbeilage. */
    rodizioTitulo: 'Wechsel der Einstichstellen',
    naoUsado: 'Noch nicht benutzt — sie ist dran.',
    proximoDaRotacao: 'Sie ist als Nächste dran, auch wenn sie diese Woche schon benutzt wurde.',
    descansandoHa: (semanas: number) =>
      `Ruht seit ${semanas} ${semanas === 1 ? 'Woche' : 'Wochen'} — sie ist dran.`,
    usadoHaPouco: 'kürzlich benutzt',
    oProximo: 'als Nächstes',
    proxima: 'nächste',

    /* ⚠️ EIN BRUCH UND KEIN PROZENTSATZ. Es stand „88% im Takt“ da — und
       „im Takt“ spricht von PÜNKTLICHKEIT, die diese Rechnung nicht
       misst: wer alle zehn Dosen immer drei Tage zu spät gespritzt hat,
       kam auch auf 100%. */
    constancia: 'Beständigkeit',
    constanciaNota: (feitas: number, previstas: number) =>
      `${feitas} von ${previstas} seit Behandlungsbeginn vorgesehenen Dosen.`,

    nivelNoCorpo: 'Spiegel im Körper',
    nivelTexto: (molecula: string, meiaVida: string) =>
      `Schätzung von ${molecula} im Körper, mit einer Halbwertszeit von ${meiaVida}. Der tiefste Punkt, kurz vor der nächsten Dosis, ist meist dann, wenn der Hunger zunimmt.`,
    meiaVidaDias: (dias: number) => `${dias} Tagen`,
    meiaVidaHoras: 'rund 13 Stunden',

    historico: 'Verlauf',
    proximaEmLocal: (local: string) => `Nächste · ${local}`,
  },

  /* ⚠️ DAS PRÄDIKATIVE ADJEKTIV FLEKTIERT IM DEUTSCHEN NICHT: „der Pen ist
     geöffnet“, „die Spritze ist geöffnet“. Deshalb sind `abertoM` und
     `abertoF` dasselbe Wort, und `concordar` läuft hier ins Leere, ohne
     Schaden anzurichten.

     Wo das Deutsche WIRKLICH flektiert, ist der Artikel davor — „Kein
     Pen“, „Keine Spritze“ —, und genau dort zahlt sich das Paar aus. */
  telaCaneta: {
    abertoM: 'geöffnet',
    abertoF: 'geöffnet',
    nenhumM: 'Kein',
    nenhumF: 'Keine',
    desteM: 'aus diesem',
    desteF: 'aus dieser',
    /* ⚠️ ALLEINSTEHEND, als Schaltfläche in der Leiste: da flektiert das
       Deutsche nicht. Attributiv wäre es 'Neuer Pen' / 'Neue Spritze' —
       das ist ein anderer Fall und gehört zu dem Bildschirm, der ihn
       braucht. */
    novoM: 'Neu',
    novoF: 'Neu',
    encerradoM: 'abgeschlossen',
    encerradoF: 'abgeschlossen',

    nova: 'Neu',
    lembrarRenovar: 'Ans Rezept erinnern',
    tituloDose: (medicamento: string, dose: string, unidade: string) =>
      `${medicamento} ${dose} ${unidade}`,

    leadAberto: (Recipiente: string, aberto: string, data: string, total: number, recipiente: string) =>
      `${Recipiente} ${aberto} am ${data} · ${total} Dosen pro ${recipiente}`,
    leadSemAberto: (nenhum: string, recipiente: string, aberto: string, total: number) =>
      `${nenhum} ${recipiente} ${aberto} · ${total} Dosen pro ${recipiente}`,

    dosesUsadas: 'Verbrauchte Dosen',
    usadasDe: (usadas: number, total: number) => `${usadas} von ${total}`,
    ultimaDose: (deste: string, recipiente: string, data: string) =>
      `Letzte Dosis ${deste} ${recipiente}: ${data}`,

    validadeApos: (_aberto: string) => 'Haltbarkeit nach dem Öffnen',
    validadeDias: (dias: number) => `${dias} Tage`,
    validadeNaoInformada: 'nicht angegeben',
    venceEm: (data: string) => `läuft ab ${data}`,
    quemPreparaDefine: 'wer es zubereitet, setzt die Frist',

    receitaAtual: 'Aktuelles Rezept',
    receitaSemanas: (semanas: number) => `${semanas} ${semanas === 1 ? 'Woche' : 'Wochen'}`,
    receitaCobreAte: (data: string) => `deckt bis ${data}`,

    venceAntes: (oRecipiente: string) => `${oRecipiente} läuft ab, bevor alles verbraucht ist`,
    venceAntesTexto: (medicamento: string, dias: number, total: number, aberto: string) =>
      `${medicamento} hält sich ${dias} Tage nach dem Öffnen, und die ${total} Dosen passen nicht in diese Frist. Am besten mit der Person klären, die dich begleitet, was mit dem Rest geschehen soll.`,

    momentoDeRenovar: 'Zeit, das Rezept anzufragen',
    /* ⚠️ HIER STEHT DER BEHÄLTER OHNE ARTIKEL, und das ist kein
       Auslassen: nach „ohne“ verlangt das Deutsche den Akkusativ —
       „ohne den Pen“ —, und formas.oA liefert nur den Nominativ
       (siehe PENDENCIAS, Punkt 26). „ohne Pen dazustehen“ ist die
       idiomatische Form und kommt ohne den Fall aus. Deshalb bekommt
       diese Funktion beide Schreibweisen. */
    renovarTexto: (semanas: number, _oRecipiente: string, recipiente: string) =>
      `Dein Rezept deckt etwa ${semanas} ${semanas === 1 ? 'Woche' : 'Wochen'}. Es jetzt anzufragen bewahrt davor, zwischen zwei Terminen ohne ${recipiente} dazustehen.`,

    historico: (plural: string) => `Verlauf der ${plural}`,
    emUso: 'in Gebrauch',
    itemEmUso: (Aberto: string, data: string, usadas: number, total: number) =>
      `${Aberto} am ${data} · ${usadas} von ${total} Dosen`,
    itemEncerrado: (periodo: string, usadas: number, total: number) =>
      `${periodo} · ${usadas} von ${total} Dosen`,
  },
};
