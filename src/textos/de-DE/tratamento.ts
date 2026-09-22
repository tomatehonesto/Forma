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
  tela: {
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
};
