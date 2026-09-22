/* ============================================================
   DIE ENTDECKUNGEN — die Karte auf der Startseite, die nicht der Zyklus ist · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/descobertas.ts. Drei Arten teilen sich
   denselben Platz, und der Hut sagt, welche gerade dran ist: der FUND (in
   cruzamentos geschrieben, hier nur der Knopf), die VORWARNUNG (was
   morgen kommt, und warum) und die EINLADUNG (was die App noch nicht
   weiß).

   ⚠️ DIE VORWARNUNG SAGT IMMER, DASS ES VORBEIGEHT. „Der Hunger zieht
   heute an“ ist eine Warnung, und eine Warnung ohne Frist wird zur
   Drohung: alle drei enden damit, was danach passiert.

   ⚠️ UND DIE EINLADUNG MAHNT NICHT. „Du hast noch nicht gesagt, wo du
   hinwillst“ nennt das Fehlende als Möglichkeit, nicht als Versäumnis;
   „du hast kein Ziel angelegt“ wäre derselbe Satz mit dem Maßstab auf die
   Person gerichtet.
   ============================================================ */

export const descobertas = {
  /* Der Knopf zum Fund. Sein Text wohnt in cruzamentos. */
  verDescoberta: 'Den Fund ansehen',

  /* ---------- was kommt ---------- */
  chapeuCruzamento: 'EIN FUND',
  chapeuAntecipacao: 'WAS KOMMT',

  fomeHoje: 'Der Hunger zieht heute eher an',
  fomeAmanha: 'Der Hunger zieht morgen eher an',
  fomeEmDias: (dias: number) => `Der Hunger zieht in ${dias} Tagen eher an`,
  /* ⚠️⚠️ PORTUGIESISCH UNTERSCHEIDET HIER MIT DER SCHREIBWEISE, DEUTSCH
     KANN DAS NICHT. Dort steht „semaglutida“ klein, weil es ein Wirkstoff
     ist, und „Ozempic“ groß, weil es eine Marke ist — die Kleinschreibung
     IST das Signal. Deutsch schreibt jedes Substantiv groß, also fällt das
     Signal weg. Den Unterschied muss hier das Wort selbst tragen.

     Deshalb läuft der Wirkstoff durch `comum.noMeio`, das im Deutschen
     nichts tut. Siehe ../pt-BR/comum.

     ⚠️ UND DER WIRKSTOFFNAME SELBST KOMMT AUF PORTUGIESISCH AN.
     `logic/meds.ts` speichert `mol: 'Tirzepatida'`, und der deutsche
     Freiname lautet „Tirzepatid“ — ohne -a, wie „Semaglutid“ und
     „Dulaglutid“. Das ist Marktdaten, kein Katalogtext, und steht in
     PENDENCIAS. Bis dahin liest dieser Satz den portugiesischen Namen. */
  fomeTexto: (molecula: string) =>
    `Dann ist der ${molecula}-Spiegel am tiefsten Punkt des Zyklus, kurz vor der nächsten Spritze. Das legt sich von selbst, sobald du spritzt.`,
  fomeCta: 'Den Zyklus ansehen',

  aguaTitulo: 'Morgen ist meist dein trockenster Tag',
  /* `dia` kommt mit Artikel — „mittwochs“ — und stammt aus cruzamentos. */
  aguaTexto: (dele: string, dia: string, outros: string) =>
    `In deinen Aufzeichnungen fällt das Trinken ${dia} auf ${dele}, gegenüber ${outros} an den anderen Tagen. Das am Vorabend zu wissen, ist die halbe Miete.`,
  aguaCta: 'Das Trinken ansehen',

  enjooTitulo: 'Wenn jetzt Übelkeit kommt, hat sie eine Uhrzeit, zu der sie geht',
  enjooTexto: (perto: string, longe: string) =>
    `In deinen Aufzeichnungen liegt sie an den ersten beiden Tagen nach der Spritze bei ${perto} und fällt ab dem dritten auf ${longe}. Das sind die 48 Stunden jedes Zyklus, nicht die ganze Behandlung.`,
  enjooCta: 'Die Beschwerden ansehen',

  /* ---------- die Einladungen ---------- */
  chapeuConvite: 'EINE EINLADUNG',

  metaTitulo: 'Du hast noch nicht gesagt, wo du hinwillst',
  metaTexto: 'Ein Ziel, das dir gehört — in eine Hose passen, zurück an den Strand, eine Gewohnheit loswerden. Wir heben es für dich auf, und wann es erreicht ist, hakst du selbst ab.',
  metaCta: 'Ein Ziel anlegen',

  medidasTitulo: 'Die Waage erzählt nur einen Teil',
  medidasTexto: 'Das Maßband erzählt den anderen: Taille und Hüfte verändern sich, wenn das Gewicht stehen bleibt — und genau dann zeigt es, dass etwas passiert.',
  medidasCta: 'Maße eintragen',

  refeicaoTitulo: 'Das Eiweiß des Tages kann sich selbst zusammenzählen',
  refeicaoTexto: 'Wenn du einträgst, was du isst, steht die Tagesrechnung von allein da — ohne Tabelle, ohne Kopfrechnen.',
  refeicaoCta: 'Eine Mahlzeit eintragen',

  examesTitulo: 'Deine Befunde passen hier hinein',
  examesTexto: 'Sind sie abgelegt, siehst du die Linie jedes Markers über die Behandlung hinweg — und nimmst alles geordnet mit zum Termin.',
  examesCta: 'Einen Befund ablegen',

  clinicaTitulo: 'Deine Praxis kann auf diese Seite kommen',
  clinicaTexto: 'Mit dem Code, den sie dir gegeben hat, erscheint dein Team hier, und seine Hinweise gehen nicht mehr zwischen den Nachrichten verloren.',
  clinicaCta: 'Den Code eingeben',
};
