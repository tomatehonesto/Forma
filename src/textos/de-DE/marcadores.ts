/* ============================================================
   DIE LABORMARKER — der größte klinische Textblock der App · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/marcadores.ts. Die, die diese
   Übersetzung bestimmen:

   ⚠️⚠️ DIE SCHLÜSSEL DIESER TABELLEN WERDEN NICHT ÜBERSETZT. „HbA1c“,
   „Glicemia jejum“, „Ferritina“ sind das, was im Eintrag des Befunds
   GESPEICHERT bleibt, in `e.marker` — das sind keine Bildschirmetiketten,
   das sind Daten. Sie zu übersetzen zerrisse die Verbindung zwischen dem
   Befund, den jemand letztes Jahr notiert hat, und der neuen Tabelle.
   Deshalb gibt es `nome`: der Schlüssel ist das Datum, der Name ist der
   Bildschirm.

   ⚠️⚠️ UND DAS IST KEINE ÜBERSETZUNG — ES IST DER NAME AUF DEM BEFUND. In
   den USA heißen TGO und TGP AST und ALT, in Frankreich ASAT und ALAT, im
   deutschsprachigen Raum **GOT** und **GPT**. Das portugiesische TGO/TGP
   kommt sogar vom selben Wort wie das deutsche GOT/GPT, und trotzdem ist
   keines das andere. Neuere deutsche Befunde drucken oft „GOT (AST)“ —
   die alte Abkürzung steht weiterhin vorn, und sie ist die, nach der eine
   Person auf ihrem Zettel sucht.

   ⚠️ UND KEINER DIESER TEXTE DARF BEIM ÜBERSETZEN ZU EINER ANWEISUNG
   WERDEN. Die Sperren stehen in jedem Abschnitt: sie trennen eine App,
   die erklärt, von einer App, die verordnet.
   ============================================================ */

export type SobreOMarcador = { oQueE: string; porQue: string; afeta: string };

const NOME: Record<string, string> = {
  'HbA1c': 'HbA1c',
  'Glicemia jejum': 'Nüchternblutzucker',
  'Insulina': 'Insulin',
  'Colesterol total': 'Gesamtcholesterin',
  'HDL': 'HDL',
  'LDL': 'LDL',
  'Triglicerídeos': 'Triglyceride',
  'Creatinina': 'Kreatinin',
  /* ⚠️ GOT UND GPT, und nicht AST und ALT. Siehe den Kopf der Datei. */
  'TGO': 'GOT',
  'TGP': 'GPT',
  'TSH': 'TSH',
  'T4 livre': 'Freies T4',
  'Vitamina D': 'Vitamin D',
  'Vitamina B12': 'Vitamin B12',
  'Ferritina': 'Ferritin',
};

/* ⚠️⚠️ HIER GIBT SIE ZURÜCK, WAS SIE BEKOMMT, und das ist der ganze
   deutsche Beitrag zu dieser Funktion.

   Im Portugiesischen, Spanischen, Französischen und Englischen fällt ein
   Gattungsname mitten im Satz in die Kleinschreibung, und ein Kürzel
   nicht: „Vitamina D“ wird „vitamina D“, „HbA1c“ bleibt. Die Regel dort
   sucht deshalb nach dem Muster eines Gattungsnamens — großer
   Anfangsbuchstabe, danach alles klein.

   Deutsch schreibt jedes Substantiv groß, in jeder Position. Es gibt hier
   nichts zu entscheiden: „Nüchternblutzucker“ bleibt
   „Nüchternblutzucker“, und ein `toLowerCase()` erzeugte einen
   Rechtschreibfehler in jeder Zeile, die hindurchläuft.

   ⚠️ Dieselbe Sache steht als `comum.noMeio` für den allgemeinen Fall;
   diese hier bleibt getrennt, weil sie im Portugiesischen das Kürzel vom
   Gattungsnamen unterscheiden muss und jene nicht. */
const NO_MEIO = (nome: string) => nome;

/* ⚠️ KEINE DEFINITION ZITIERT EINEN ANDEREN MARKER ODER EINEN BEGRIFF VOM
   BEFUND. Die Regel: wenn der Satz einen zweiten Satz braucht, um
   verstanden zu werden, ist er keine Definition, sondern ein
   Lexikoneintrag.

   ⚠️ UND KEINE SAGT, OB ES GUT IST. Eine Definition, die eine Diagnose
   andeutet, ist eine Diagnose im Glossargewand.

   ⚠️ `afeta` IST EINE ERGÄNZUNG, KEIN SATZ. Sie kommt immer nach einem
   Verb, das den Vorbehalt schon trägt — „macht einen Unterschied…“, „ist
   ein gutes Zeichen…“ — und beginnt deshalb mit der Präposition. Als
   ganzer Satz geschrieben, müsste jeder Marker mit seinem eigenen Genus
   übereinstimmen, und im Deutschen sind es drei. */
const SOBRE = {
  'HbA1c': {
    oQueE: 'Wie viel Zucker an den roten Blutkörperchen hängen geblieben ist.',
    porQue: 'Weil diese Blutkörperchen etwa drei Monate leben, erzählt das Ergebnis den Schnitt des Zuckers über diesen Zeitraum, und nicht nur den vom Tag der Blutabnahme.',
    afeta: 'für die Kontrolle des Zuckers über die Monate',
  },
  'Glicemia jejum': {
    oQueE: 'Die Zuckermenge im Blut nach Stunden ohne Essen.',
    porQue: 'Das ist das direkteste Maß dafür, wie der Körper den Zucker in Ruhe verwaltet.',
    afeta: 'dafür, wie der Körper mit Zucker umgeht',
  },
  'Insulina': {
    oQueE: 'Das Hormon, das den Zucker aus dem Blut in die Zellen bringt.',
    porQue: 'Wenn es hoch ist, ist das meist ein Zeichen dafür, dass der Körper mehr davon herstellen muss, um dieselbe Arbeit zu schaffen.',
    afeta: 'für die Mühe, die der Körper hat, den Zucker in Ordnung zu halten',
  },
  'Colesterol total': {
    oQueE: 'Das ganze Cholesterin, das in deinem Blut unterwegs ist, zusammengezählt.',
    porQue: 'Allein sagt es wenig, weil es Cholesterine in eine einzige Rechnung wirft, die im Körper Gegensätzliches tun.',
    afeta: 'für die Gesundheit der Arterien über die Jahre',
  },
  'HDL': {
    oQueE: 'Das Cholesterin, das aufräumt: es sammelt Fett aus den Arterien ein und nimmt es mit.',
    porQue: 'Es ist der einzige Cholesterinwert, bei dem eine höhere Zahl die gute Nachricht ist.',
    afeta: 'für das Aufräumen von Fett in den Arterien',
  },
  'LDL': {
    oQueE: 'Das Cholesterin, das Fett zu den Geweben des Körpers bringt.',
    porQue: 'Im Übermaß ist es das, was sich über die Jahre in der Wand der Arterien ansammelt.',
    afeta: 'für die Gesundheit der Arterien über die Jahre',
  },
  'Triglicerídeos': {
    oQueE: 'Das Fett, das im Blut unterwegs ist, aus dem Essen und aus der Leber.',
    porQue: 'Sie reagieren schnell auf das Essen und auf das Gewicht, und deshalb bewegen sie sich in einer Behandlung meist als Erste.',
    afeta: 'für das Fett im Blut und für das Herz',
  },
  'Creatinina': {
    oQueE: 'Ein Abfallstoff, den der Muskel ständig herstellt und den die Niere ausscheidet.',
    porQue: 'Weil es die Niere ist, die ihn aus dem Blut holt, ist die Menge, die übrig bleibt, eine der Arten zu sehen, ob sie mitkommt.',
    afeta: 'für die Arbeit der Nieren',
  },
  'TGO': {
    oQueE: 'Ein Stoff, der in den Zellen der Leber und des Muskels eingeschlossen liegt.',
    porQue: 'Er taucht im Blut nur auf, wenn diese Zellen aufreißen — daher sein Wert als Hinweis, dass etwas die Leber reizt.',
    afeta: 'für die Gesundheit der Leber',
  },
  'TGP': {
    oQueE: 'Ein Stoff, der fast nur in den Zellen der Leber eingeschlossen liegt.',
    porQue: 'Weil es ihn anderswo im Körper kaum gibt, ist die Adresse viel sicherer, wenn er im Blut auftaucht.',
    afeta: 'für die Gesundheit der Leber',
  },
  'TSH': {
    oQueE: 'Die Nachricht, die das Gehirn an die Schilddrüse schickt, damit sie arbeitet.',
    porQue: 'Sie steigt, wenn die Schilddrüse langsam ist, und fällt, wenn sie zu schnell läuft — sie ist das Thermostat, nicht die Temperatur.',
    afeta: 'für das Tempo des Stoffwechsels',
  },
  'T4 livre': {
    oQueE: 'Das Hormon, das die Schilddrüse herstellt, in dem Teil, den der Körper nutzen kann.',
    porQue: 'Es zeigt, was die Schilddrüse tatsächlich liefert, und deshalb kommt es immer im Doppel mit dem vorigen Wert.',
    afeta: 'für das Tempo des Stoffwechsels',
  },
  'Vitamina D': {
    oQueE: 'Das Vitamin, das der Körper mit Sonne herstellt und aus dem Essen aufnimmt.',
    porQue: 'Es ist an der Aufnahme von Kalzium und an der Arbeit von Muskel und Abwehr beteiligt.',
    afeta: 'für Knochen, Muskel und Abwehr',
  },
  'Vitamina B12': {
    oQueE: 'Ein Vitamin, das aus Lebensmitteln tierischen Ursprungs kommt.',
    porQue: 'Es wird für die roten Blutkörperchen und für die Nerven gebraucht, und wer weniger davon isst, behält es meist genauer im Blick.',
    afeta: 'für die Nerven und die Blutbildung',
  },
  'Ferritina': {
    oQueE: 'Die Eisenvorratskammer des Körpers — das, was in den Zellen gespeichert liegt.',
    porQue: 'Deshalb zeigt es den Vorrat, und nicht das Eisen, das heute im Blut unterwegs ist.',
    afeta: 'für den Eisenvorrat, der die Energie trägt',
  },
} satisfies Record<string, SobreOMarcador>;

/* ============================================================
   WAS DIESE ZAHL BEWEGT

   ⚠️ DAS IST DER TEIL, DER DEN BEFUND VERSTÄNDLICH MACHT. Zu wissen, dass
   Ferritin der Eisenvorrat ist, hilft, das Wort zu lesen. Es hilft nicht
   zu verstehen, warum es sich verändert hat — und „warum hat es sich
   verändert“ ist die Frage, die die Person vom Bildschirm in ihr Leben
   mitnimmt.

   ⚠️ UND KEIN PUNKT SAGT, WAS ZU TUN IST. „Alkohol an den Vortagen“ ist
   eine Tatsache über den Marker; „hör auf zu trinken“ wäre eine
   Anweisung, und Anweisungen gehören denen, die die Person behandeln.

   ⚠️ ES SIND HÄUFIGE URSACHEN, NICHT DIE VOLLSTÄNDIGE LISTE.
   ============================================================ */
const INFLUENCIAS = {
  'HbA1c': [
    'Der Schnitt des Blutzuckers der letzten zwei bis drei Monate, und nicht das, was du gestern gegessen hast',
    'Blutarmut und Bluterkrankungen, die die Lebensdauer der roten Blutkörperchen ändern und das Ergebnis verzerren',
    'Gewichtsabnahme und Medikamente für den Blutzucker, die ihn über Monate meist senken',
  ],
  'Glicemia jejum': [
    'Wie viele Stunden Nüchternzeit vor der Blutabnahme lagen',
    'Schlechter Schlaf und Stress am Vorabend, die den Morgenzucker heben',
    'Bewegung und Gewichtsabnahme, die ihn eher senken',
  ],
  'Insulina': [
    'Die Nüchternzeit vor der Blutabnahme, genauso wie beim Blutzucker',
    'Die Menge an Körperfett, die in dieser Rechnung am schwersten wiegt',
    'Es wird meist zusammen mit dem Blutzucker gelesen, nicht allein',
  ],
  'Colesterol total': [
    'Was an Fett gegessen wird, aber weniger, als sein Ruf vermuten lässt',
    'Die Veranlagung — manche Familien bilden mehr Cholesterin, unabhängig vom Essen',
    'Eine langsame Schilddrüse, die es ohne Zusammenhang mit dem Essen hebt',
  ],
  'HDL': [
    'Regelmäßiges Ausdauertraining, das es am stärksten hebt',
    'Rauchen, das es senkt',
    'Die Veranlagung, die gerade hier schwer wiegt',
  ],
  'LDL': [
    'Gesättigte Fette und Transfette im Essen',
    'Gewichtsabnahme, die es meist zusammen mit den Triglyceriden senkt',
    'Die Veranlagung, die in manchen Familien das Ergebnis bestimmt',
  ],
  'Triglicerídeos': [
    'Die Nüchternzeit — nah an der Blutabnahme zu essen verändert viel, mehr als bei jedem anderen Wert des Profils',
    'Alkohol an den Vortagen',
    'Zucker und Mehl im Übermaß, die der Körper in Fett umwandelt',
  ],
  'Creatinina': [
    'Wie viel Muskelmasse jemand hat, weil es aus dem Muskel kommt',
    'Wie viel am Tag der Blutabnahme getrunken wurde',
    'Hartes Training am Vortag, das es vorübergehend heben kann',
  ],
  'TGO': [
    'Intensive Bewegung an den Vortagen, weil es auch im Muskel vorkommt',
    'Alkohol',
    'Fett in der Leber, häufig bei Übergewicht',
  ],
  'TGP': [
    'Fett in der Leber, die häufigste Ursache einer leichten Erhöhung',
    'Alkohol und einige Medikamente',
    'Gewichtsabnahme, die es über die Monate meist senkt',
  ],
  'TSH': [
    'Die Uhrzeit der Blutabnahme — es ist nachts und am frühen Morgen höher',
    'Akute Erkrankungen und einige Medikamente',
    'Eine Schilddrüsenhormon-Therapie, wenn es eine gibt',
  ],
  'T4 livre': [
    'Die Arbeit der Schilddrüse, immer zusammen mit dem TSH gelesen',
    'Schwangerschaft und Östrogene, die die Transportproteine verändern',
  ],
  'Vitamina D': [
    'Sonne auf der Haut — die Menge, die Uhrzeit und wie viel Haut frei liegt',
    'Dunklere Haut und Sonnencreme, die die Bildung verringern',
    'Eine Einnahme als Präparat, wenn es eine gibt',
    'Die Jahreszeit: der Winter lässt es oft einbrechen',
  ],
  'Vitamina B12': [
    'Lebensmittel tierischen Ursprungs im Essen',
    'Bariatrische Operationen und einige Magenmedikamente, die die Aufnahme verringern',
    'Eine Einnahme als Präparat, wenn es eine gibt',
  ],
  'Ferritina': [
    'Der Eisenvorrat des Körpers',
    'Entzündung und Infektion, die es auch ohne Eisenüberschuss heben — deshalb wird es nie allein gelesen',
    'Starke Regelblutungen, die den Vorrat über die Zeit verringern',
  ],
} satisfies Record<string, string[]>;

/* ============================================================
   WAS ÜBLICHERWEISE HILFT

   ⚠️ DAS IST DER GEFÄHRLICHE TEIL DER DATEI, UND ER HAT VIER SPERREN.

   Eine Liste „wie du deinen Wert verbesserst“ ist ohne Sorgfalt eine
   Verordnung im Tippgewand — und Verordnungen gehören denen, die die
   Person behandeln. Was ihre Existenz rechtfertigt, ist das Gegenteil
   dessen, was sie falsch machte: die Blutabnahme ist das
   Gesundheitsdokument, das die wenigsten verstehen, und jemanden allein
   mit einer Zahl und einem Bereich zu lassen heißt, sie an der
   schwierigsten Stelle im Stich zu lassen.

   DIE SPERREN:

   1. NICHTS HIER HANDELT VON MEDIKAMENTEN. Kein Punkt sagt, etwas
      anzufangen, abzusetzen, zu erhöhen oder zu senken — und wo ein
      Präparat das Thema ist, sagt der Satz „wenn es von denen angezeigt
      ist, die dich behandeln“, und das ist die Tatsache.

   2. NICHTS HIER HAT DOSIS, MENGE ODER FRIST. „Sonne auf der Haut ist die
      wichtigste Quelle“ ist eine Information; „zwanzig Minuten am Tag“
      ist ein Rezept, und ein Rezept muss von jemandem kommen, der die
      Person untersucht hat.

   3. NICHTS HIER VERSPRICHT EIN ERGEBNIS. Die Punkte sagen, was man über
      den Marker WEISS — dass Eisen mit Vitamin C besser aufgenommen wird
      —, und nicht, was mit der Zahl derjenigen passieren wird, die liest.

   4. NICHTS HIER BETRIFFT SCHILDDRÜSE ODER NIERE. TSH, T4 und Kreatinin
      sind absichtlich draußen geblieben: im ersten Fall bewegt ein
      Medikament die Zahl; im zweiten sind die naheliegendsten Ratschläge
      (Wasser trinken, Eiweiß essen) genau die, denen eine Person mit
      schlechter Nierenfunktion nicht auf eigene Faust folgen soll. Ein
      Marker ohne ehrlichen Punkt bekommt keinen Abschnitt.
   ============================================================ */
export type JeitoDeAjudar = { grupo: string; itens: { nome: string; detalhe: string }[] };

const AJUDAR = {
  'HbA1c': [
    {
      grupo: 'Beim Essen',
      itens: [
        { nome: 'Langsam aufgenommene Kohlenhydrate', detalhe: 'Vollkorn, Hülsenfrüchte und Gemüse heben den Blutzucker langsamer als weißes Mehl und Zucker' },
        { nome: 'Eiweiß und Ballaststoffe in derselben Mahlzeit', detalhe: 'Sie senken die Blutzuckerspitze dessen, was man dazu isst' },
      ],
    },
    {
      grupo: 'Bei der Bewegung',
      itens: [
        { nome: 'Nach dem Essen spazieren gehen', detalhe: 'Der arbeitende Muskel verbraucht Zucker, ohne auf Insulin angewiesen zu sein' },
        { nome: 'Regelmäßige Bewegung', detalhe: 'Sie verbessert die Insulinempfindlichkeit, und die Wirkung summiert sich über Wochen' },
      ],
    },
  ],
  'Glicemia jejum': [
    {
      grupo: 'In der Routine',
      itens: [
        { nome: 'Der Schlaf', detalhe: 'Kurze Nächte heben den Blutzucker am nächsten Morgen' },
        { nome: 'Die letzte Mahlzeit früher', detalhe: 'Kurz vor dem Schlafen zu essen zeigt sich meist im Nüchternwert des nächsten Tages' },
      ],
    },
    {
      grupo: 'Bei der Bewegung',
      itens: [
        { nome: 'Ausdauerbewegung', detalhe: 'Sie senkt den Nüchternblutzucker über Wochen, nicht über Tage' },
      ],
    },
  ],
  'Insulina': [
    {
      grupo: 'Beim Gewicht und bei der Bewegung',
      itens: [
        { nome: 'Weniger Körperfett', detalhe: 'Das senkt am stärksten das Insulin, das für dieselbe Arbeit nötig ist' },
        { nome: 'Krafttraining', detalhe: 'Mehr Muskelmasse heißt mehr Platz, wohin der Zucker gehen kann' },
      ],
    },
  ],
  'Colesterol total': [
    {
      grupo: 'Beim Essen',
      itens: [
        { nome: 'Weniger gesättigte Fette und Transfette', detalhe: 'Frittiertes, Wurstwaren und stark verarbeitete Produkte sind die häufigsten Quellen' },
        { nome: 'Lösliche Ballaststoffe', detalhe: 'Hafer, Hülsenfrüchte und Obst senken die Aufnahme von Cholesterin im Darm' },
      ],
    },
  ],
  'HDL': [
    {
      grupo: 'Bei der Bewegung',
      itens: [
        { nome: 'Ausdauerbewegung', detalhe: 'Sie hebt das HDL am stärksten, und die Wirkung hängt an der Regelmäßigkeit' },
      ],
    },
    {
      grupo: 'Beim Essen',
      itens: [
        { nome: 'Gute Fette', detalhe: 'Olivenöl, Avocado, Nüsse und fetter Fisch' },
      ],
    },
  ],
  'LDL': [
    {
      grupo: 'Beim Essen',
      itens: [
        { nome: 'Weniger gesättigte Fette', detalhe: 'Sie heben das LDL am stärksten — fettes Fleisch, Vollmilchprodukte, Frittiertes' },
        { nome: 'Lösliche Ballaststoffe', detalhe: 'Hafer, Bohnen, Linsen und Obst mit Schale' },
      ],
    },
    {
      grupo: 'Beim Gewicht',
      itens: [
        { nome: 'Gewichtsabnahme', detalhe: 'Sie senkt LDL und Triglyceride meist gemeinsam' },
      ],
    },
  ],
  'Triglicerídeos': [
    {
      grupo: 'Beim Essen',
      itens: [
        { nome: 'Weniger Zucker und Mehl', detalhe: 'Der Überschuss wird zu Fett in der Leber, und das hebt diesen Wert am stärksten' },
        { nome: 'Alkohol', detalhe: 'Er ist die häufigste einzelne Ursache hoher Triglyceride' },
      ],
    },
    {
      grupo: 'Bei der Bewegung',
      itens: [
        { nome: 'Ausdauerbewegung', detalhe: 'Die Triglyceride gehören zu den Werten, die am schnellsten reagieren' },
      ],
    },
  ],
  'TGO': [
    {
      grupo: 'Rund um die Leber',
      itens: [
        { nome: 'Alkohol', detalhe: 'Er ist die häufigste Ursache einer Veränderung bei beiden Enzymen' },
        { nome: 'Gewichtsabnahme', detalhe: 'Sie senkt das Fett in der Leber, die andere häufige Ursache' },
      ],
    },
  ],
  'TGP': [
    {
      grupo: 'Rund um die Leber',
      itens: [
        { nome: 'Gewichtsabnahme', detalhe: 'Fett in der Leber ist die häufigste Ursache einer leichten Erhöhung, und es reagiert auf das Gewicht' },
        { nome: 'Alkohol', detalhe: 'Er verschwindet aus der Rechnung, wenn er aus der Routine verschwindet' },
      ],
    },
  ],
  'Vitamina D': [
    {
      grupo: 'In der Sonne',
      itens: [
        { nome: 'Haut, die frei liegt', detalhe: 'Das ist die wichtigste Quelle — Sonnencreme und bedeckende Kleidung verringern die Bildung' },
      ],
    },
    {
      grupo: 'Beim Essen und beim Präparat',
      itens: [
        { nome: 'Fetter Fisch, Eigelb und Pilze', detalhe: 'Das sind die Quellen im Essen, und sie reichen allein meist nicht' },
        { nome: 'Ein Präparat', detalhe: 'Wenn es von denen angezeigt ist, die dich behandeln — die Menge hängt von deinem Wert ab' },
      ],
    },
  ],
  'Vitamina B12': [
    {
      grupo: 'Beim Essen',
      itens: [
        { nome: 'Tierischer Ursprung', detalhe: 'Fleisch, Eier, Milch und Milchprodukte sind die einzigen natürlichen Quellen' },
      ],
    },
    {
      grupo: 'Bei der Aufnahme',
      itens: [
        { nome: 'Magenmedikamente', detalhe: 'Längere Einnahme verringert die Aufnahme — ein Thema für den Termin' },
        { nome: 'Ein Präparat', detalhe: 'Wenn es von denen angezeigt ist, die dich behandeln, vor allem nach einer bariatrischen Operation' },
      ],
    },
  ],
  'Ferritina': [
    {
      grupo: 'Beim Essen',
      itens: [
        { nome: 'Eisen tierischen Ursprungs', detalhe: 'Rotes Fleisch, Leber und Meeresfrüchte werden am besten aufgenommen' },
        { nome: 'Vitamin C dazu', detalhe: 'Orange, Kiwi und Paprika verbessern die Aufnahme des Eisens aus Pflanzen' },
        { nome: 'Kaffee und Tee mit Abstand zur Mahlzeit', detalhe: 'Sie stören die Aufnahme, wenn sie dazu getrunken werden' },
      ],
    },
  ],
} satisfies Record<string, JeitoDeAjudar[]>;

export const marcadores = {
  /* ---------- die Kategorien ---------- */
  /* Das sind die einzigen Bildschirmetiketten dieser Datei und deshalb die
     einzigen, die sich ohne Vorbehalt übersetzen. WELCHE Marker in welche
     Kategorie gehören, ist keine Entscheidung der Sprache — das ist
     klinischer Inhalt und steht in logic/derive bei den Schlüsseln. */
  catMetabolico: 'Stoffwechsel',
  catLipidico: 'Blutfette',
  catFigadoRim: 'Leber & Niere',
  catTireoide: 'Schilddrüse',
  catVitaminas: 'Vitamine',

  nome: NOME,
  noMeio: NO_MEIO,
  sobre: SOBRE,
  influencias: INFLUENCIAS,
  ajudar: AJUDAR,
};
