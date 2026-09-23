/* ============================================================
   DIE LESARTEN — was die App sagt, nachdem sie die Antworten gelesen hat · de-DE

   ⚠️⚠️ VIER SPERREN GELTEN FÜR DIE GANZE DATEI, und keine davon ist Stil.
   Die vollständigen Gründe stehen in ../pt-BR/leituras.ts:

   1. KEINE NENNT EINE DIAGNOSE. Wer das liest, hat das Symptom bereits,
      und ein Krankheitsname erschreckt, ohne beim nächsten Schritt zu
      helfen.

   2. DAS SUBJEKT IST DAS SYMPTOM ODER DER KÖRPER, NIE DIE PERSON. „Viel
      erbrechen“ und „in diesem Tempo“ beschrieben das Unwillkürliche als
      Gewohnheit — wer erbricht, erbricht nicht zu viel, sie erbricht. Sie
      ist die, die liest, nicht die, die es verursacht hat.

   3. DIE SCHWELLEN SIND KLINISCH, NICHT REDAKTIONELL. Schmerz und
      Schwindel warnen bei 4, dort, wo der Tag schon unterbrochen ist; die
      Zählungen warnen auf der Stufe, auf der die klinische Einteilung
      wechselt. Man übersetzt die Wörter, nicht die Zahlen.

   4. DAS `curto` NENNT IMMER DAS OBJEKT DES VERBS. „Trink in kleinen
      Schlucken“ lässt die Person die Lücke selbst füllen, und in einer
      Zeile, die im Vorbeigehen gelesen wird, bleibt die Lücke. „Trink
      Wasser in kleinen Schlucken“ lässt keinen Zweifel.

   ⚠️⚠️ UND DAS WORT IST „NOTAUFNAHME“, im ganzen deutschsprachigen Raum.
   Das ist die Lektion, die das Spanische gekostet hat: dort stand
   „guardia“, was in Argentinien die Notaufnahme und in Mexiko ein
   SICHERHEITSDIENST ist. Deutsch hat diesen Bruch nicht — aber das zu
   prüfen gehörte zur Arbeit und nicht zum Glück. In Österreich und der
   Schweiz heißt sie auch „Notaufnahme“; die Schweiz sagt daneben
   „Notfallstation“, und beide werden überall verstanden.
   ============================================================ */

export const leituras = {
  dorSobre: 'Bauchschmerzen',
  dorCurto: 'sprich heute noch mit deinem Team',
  dorTitulo: 'Dieser Schmerz wartet nicht bis zum nächsten Termin',
  /* ⚠️ „FAST NIE ETWAS ERNSTES — UND GENAU DESHALB LOHNT ES SICH, FRÜH
     HINZUSEHEN“ ist der ganze Satz. Er bittet um Aufmerksamkeit, ohne zu
     erschrecken, und das „genau deshalb“ ist das, was die Lesart davon
     abhält, ein Alarm zu werden. */
  dorTexto: 'Starke Bauchschmerzen, oder solche, die nicht weggehen, brauchen am selben Tag Aufmerksamkeit. Es ist fast nie etwas Ernstes — und genau deshalb lohnt es sich, früh hinzusehen.',
  dorAcao: 'Sprich heute noch mit deinem Team. Wenn es schlimmer wird oder Erbrechen dazukommt, lass dich behandeln.',

  vomitoSobre: 'Erbrechen',
  vomitoCurto: 'trink Wasser in kleinen Schlucken, oft',
  vomitoTitulo: 'Erbrechen nimmt mehr Flüssigkeit mit, als es aussieht',
  vomitoTexto: 'Mit dem Wasser geht das Salz, und dein Körper merkt es, bevor der Durst kommt. Und wenn das Essen nicht bleibt, fängst du den nächsten Tag schon müde an.',
  vomitoAcao: 'Trink in kleinen Schlucken, oft, statt ein Glas auf einmal. Wenn nicht einmal Wasser bleibt, sprich heute noch mit deinem Team.',

  tonturaSobre: 'Schwindel',
  tonturaCurto: 'setz dich hin, trink Wasser und iss etwas Süßes',
  tonturaTitulo: 'Solcher Schwindel hat meist eine Erklärung',
  tonturaTexto: 'Fast immer ist es ein Mangel an Flüssigkeit oder ein niedriger Blutzucker. Wenn du daneben ein Medikament gegen Diabetes nimmst, wird der niedrige Zucker noch wahrscheinlicher.',
  tonturaAcao: 'Setz dich hin, trink Wasser und iss etwas. Wenn es sich in den nächsten Tagen wiederholt, erzähl es deinem Team.',

  presoSobre: 'Verstopfung',
  presoCurto: 'trink über den Tag verteilt, iss Ballaststoffe und geh spazieren',
  presoTitulo: 'Vier Tage ohne Stuhlgang verdienen schon Aufmerksamkeit',
  presoTexto: 'Das Medikament macht alles langsamer, und wer weniger isst, hat wenig, was der Darm schieben könnte. Nach rund vier Tagen hört es meist auf, sich von selbst zu lösen.',
  presoAcao: 'Über den Tag trinken, Ballaststoffe zu den Mahlzeiten und ein Spaziergang. Wenn es über fünf Tage geht, oder starke Schmerzen und Erbrechen dazukommen, lass dich behandeln.',

  soltoSobre: 'Weicher Stuhl',
  soltoCurto: 'trink Wasser mit einer Prise Salz, ohne auf den Durst zu warten',
  soltoTitulo: 'Weicher Stuhl nimmt Wasser und Salz mit',
  soltoTexto: 'Sieben Gänge oder mehr an einem Tag nehmen mehr mit, als der Durst zu ersetzen schafft.',
  soltoAcao: 'Trink über den Tag, ohne auf den Durst zu warten, mit einer Elektrolytlösung oder einer Prise Salz. Wenn es morgen genauso ist, sag deinem Team Bescheid.',

  /* ⚠️ WENN EINE KOMBINATION AUFTAUCHT, VERSCHWINDEN DIE FELDHINWEISE.
     Sie sagen „sprich mit deinem Team“ über ein Symptom; die Kombination
     sagt „geh jetzt“ über das Ganze, und beide auf dem Bildschirm zu
     lassen heißt, das weniger Dringende mit dem Dringenderen streiten zu
     lassen. */
  travaSobre: 'Verdauung, Schmerz und Erbrechen',
  travaCurto: 'geh heute in die Notaufnahme',
  travaTitulo: 'Diese Kombination braucht jetzt Behandlung',
  travaTexto: 'Ein Darm, der seit Tagen steht, starke Schmerzen und Erbrechen zusammen können ein Zeichen dafür sein, dass etwas blockiert. Das ist selten, aber es wird nicht von allein besser.',
  /* ⚠️ „WELCHES MEDIKAMENT DU NIMMST“, und vorher stand „dass du den Pen
     benutzt“. Wer in der Notaufnahme ist, muss sagen, WAS sie nimmt, und
     nicht, in welcher Verpackung es kommt. */
  travaAcao: 'Geh heute in die Notaufnahme. Sag, welches Medikament du nimmst und seit wie vielen Tagen du keinen Stuhlgang hattest.',

  dorVomitoSobre: 'Schmerz mit Erbrechen',
  dorVomitoCurto: 'geh heute zu deinem Team oder in die Notaufnahme',
  dorVomitoTitulo: 'Starke Schmerzen mit Erbrechen warten nicht',
  dorVomitoTexto: 'Starke Bauchschmerzen zusammen mit Erbrechen, manchmal in den Rücken ausstrahlend, brauchen am selben Tag Aufmerksamkeit. Wenn du früh kommst, ist das einfach zu prüfen.',
  dorVomitoAcao: 'Geh heute zu deinem Team oder in die Notaufnahme. Sag, welches Medikament du nimmst, die Dosis, und wann der Schmerz angefangen hat.',

  desidratacaoSobre: 'Schwindel und Flüssigkeitsverlust',
  desidratacaoCurto: 'trink eine Elektrolytlösung oder Salzwasser, und steh langsam auf',
  desidratacaoTitulo: 'Schwindel mit Flüssigkeitsverlust ist ein Zeichen für Austrocknung',
  desidratacaoTexto: 'Wenn Wasser und Salz fehlen, fällt der Blutdruck beim Aufstehen — und der Schwindel ist dein Körper, der warnt.',
  desidratacaoAcao: 'Trink in kleinen Schlucken über den Tag, mit einer Elektrolytlösung oder einer Prise Salz, und steh langsam auf. Wenn es bis morgen nicht besser wird, sag deinem Team Bescheid.',

  /* ⚠️ DESHALB TRÄGT DER TEXT DIE ZAHL DER TAGE. „Vier der letzten
     sieben“ ist eine Tatsache, die man zum Termin mitnimmt; „dir ist oft
     übel“ ist ein Eindruck, den sie schon hatte. */
  vomitoSemanaSobre: 'Erbrechen in der Woche',
  vomitoSemanaCurto: 'sprich diese Woche mit deinem Team',
  vomitoSemanaTitulo: 'Erbrechen an wiederholten Tagen',
  vomitoSemanaTexto: (n: number) => `${n} der letzten sieben Tage mit Erbrechen. So bleiben weder Essen noch Flüssigkeit noch das Medikament selbst.`,
  vomitoSemanaAcao: 'Sprich diese Woche mit deinem Team, ohne auf den Termin zu warten. Sag ihnen die Zahl der Tage — sie macht den Unterschied.',

  soltoSemanaSobre: 'Verdauung in der Woche',
  soltoSemanaCurto: 'trink mehr und erzähl es deinem Team',
  soltoSemanaTitulo: 'Der Stuhl ist seit Tagen weich',
  soltoSemanaTexto: (n: number) => `${n} der letzten sieben Tage so schlagen schon auf den Flüssigkeitshaushalt durch, auch wenn jeder Tag für sich ruhig aussieht.`,
  soltoSemanaAcao: 'Trink mehr, als der Durst verlangt, und erzähl es deinem Team. Es kann die Dosis sein, es kann das Essen sein.',

  enjooSemanaSobre: 'Übelkeit in der Woche',
  enjooSemanaCurto: 'nimm die Zahl der Tage mit zum Termin',
  enjooSemanaTitulo: 'Die Übelkeit geht nicht weg',
  enjooSemanaTexto: (n: number) => `${n} der letzten sieben Tage mit Übelkeit sind keine Eingewöhnung mehr, das ist ein Muster. Es ändert sich oft mit der Dosis, oder mit dem Tempo, in dem sie steigt.`,
  /* ⚠️ „DIE DOSIS ETWAS LÄNGER ZU HALTEN IST KEIN AUFGEBEN“ ist der
     Dienst dieses Satzes: es ist die Vorgehensweise, die die Person am
     meisten sträubt, zum Termin mitzunehmen, weil sie sie als Scheitern
     liest. */
  enjooSemanaAcao: 'Nimm diese Zahl mit zum nächsten Termin. Die Dosis etwas länger zu halten ist kein Aufgeben.',

  /* ⚠️ DIE VERSTOPFUNG TAUCHT IN BEIDEN LESARTEN AUF, und das ist keine
     Wiederholung: die Feldregel zählt Tage am Stück ohne Stuhlgang — eine
     Episode —, und diese zählt Tage der Woche mit langsamer Verdauung. */
  presoSemanaSobre: 'Langsame Verdauung in der Woche',
  presoSemanaCurto: 'trink Wasser, iss Ballaststoffe und geh spazieren',
  presoSemanaTitulo: 'Die Verdauung ist die ganze Woche langsam',
  presoSemanaTexto: (n: number) => `${n} der letzten sieben Tage mit Verstopfung. Weniger zu essen ist eine Wirkung des Medikaments, und mit weniger Essen gehen weniger Ballaststoffe durch — der Darm merkt es vor der Waage.`,
  presoSemanaAcao: 'Wasser, Ballaststoffe und Spazierengehen helfen. In diesem Tempo lohnt es sich, es deinem Team zu erzählen.',

  /* ⚠️ DIE MEILENSTEINE SIND NACH DER ZAHL DER TAGE INDIZIERT, und der
     Schlüssel bleibt die Zahl, weil die Serie danach fragt: `marcoDe(7)`.
     Den Wert zu übersetzen rührt keinen Eintrag an.

     ⚠️ UND ES SIND NICHT SIEBEN STUFEN EINER LEITER. Jeder benennt eine
     Dauer, die die Person wiedererkennt, und deshalb sagt der bei 30
     „Einträge“ und nicht „am Stück“: ein ganzer Monat ohne einen einzigen
     ausgelassenen Tag ist selten, und der Satz kann nicht versprechen,
     was die Regel nicht verlangt. */
  marcos: {
    3: 'Drei Tage in Folge',
    7: 'Eine ganze Woche',
    14: 'Zwei Wochen in Folge',
    21: 'Drei Wochen in Folge',
    30: 'Ein Monat mit Einträgen',
    60: 'Zwei Monate in Folge',
    90: 'Drei Monate in Folge',
  },

  /* ⚠️ DIE DREI MIT EINER ZAHL TRAGEN DIE ZAHL, DIE SIE STÜTZT, und das
     trennt sie von einem Lob. „Du hast gut geschlafen“ ist eine Meinung;
     „7 Std.+ Schlaf an 5 Tagen“ ist die Zählung ihrer eigenen Einträge. */
  dormindoBem: (n: number) => `7 Std.+ Schlaf an ${n} Tagen`,
  energiaBoa: (n: number) => `Gute Energie an ${n} Tagen`,
  semEnjooDias: (n: number) => `${n} Tage ohne Übelkeit`,

  /* Die einzige ohne Zahl, weil ihre Zahl der Unterschied zweier
     Mittelwerte wäre — und „Hunger 1,2 Punkte niedriger“ ist keine gute
     Nachricht, die jemand liest. */
  saciedadeMelhorando: 'Die Sättigung wird besser',

};
