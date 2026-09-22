/* ============================================================
   DAS ESSEN — was gegessen, was getrunken wird und was draußen bleibt · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/alimentacao.ts. Die, die für die ganze
   Datei gilt: KEIN SATZ VON HIER IST EINE VERORDNUNG. Die Lesarten zeigen
   auf das, was die Zählung ergibt, und schlagen einen nächsten Teller
   vor; keiner sagt der Person, dass sie falsch liegt, weil die App nicht
   weiß, was sie mit ihrem Team vereinbart hat.
   ============================================================ */

export const alimentacao = {
  /* ⚠️ JEDER SATZ TRÄGT DIE ZAHL MIT SICH. „Dein Frühstück bringt 9 g“
     lässt sich auf dem Bildschirm darunter nachprüfen; „beim Frühstück
     machst du das gut“ lässt sich nirgends nachprüfen. Ein Lob ohne Zahl
     ist der schnellste Weg, wie eine App nach Lebenshilfe-Kärtchen klingt.

     ⚠️ UND DIE FRAGE JEDER KARTE STEHT IN DER ERSTEN PERSON, so wie die
     Person sie stellen würde. Das Feld des Companions bekommt Text, und
     eine Abschnittsüberschrift, dort hineingeklebt, läse sich wie ein
     Maschinenbefehl. */
  conselhos: {
    fibraQ: 'Wie bekomme ich mehr Ballaststoffe in meinen Tag, ohne mich am Essen satt zu sehen?',
    fibraTitulo: (media: number) => `Ballaststoffe: ${media} g pro Tag`,
    /* ⚠️ DIE ZWEITE HÄLFTE IST DER GRUND, WARUM DIESE KARTE DIE ERSTE IST:
       Verstopfung gehört zu den häufigsten Nebenwirkungen der Behandlung,
       und Ballaststoffe sind der Hebel beim Essen, den es dafür gibt. */
    fibraTexto: (dias: number, meta: number) =>
      `Das ist dein Schnitt der letzten ${dias} eingetragenen Tage, gegenüber einem Ziel von ${meta} g. Hülsenfrüchte, Haferflocken, Blattgemüse und Obst mit Schale sind der kürzeste Weg — und es sind die Ballaststoffe, die gegen die Verstopfung helfen, eine der häufigsten Nebenwirkungen der Behandlung.`,

    fibraBoaQ: 'Was ändern Ballaststoffe an meiner Behandlung?',
    fibraBoaTitulo: (media: number) => `Ballaststoffe: ${media} g pro Tag, über dem Ziel`,
    fibraBoaTexto: (dias: number, meta: number) =>
      `Das ist dein Schnitt der letzten ${dias} eingetragenen Tage, gegenüber einem Ziel von ${meta} g. Das ist meist das, was die Verstopfung der Behandlung in Schach hält — so lohnt es sich zu bleiben.`,

    /* ⚠️ DER SCHWACHE ZEITPUNKT NENNT DEN ZEITPUNKT, und das sagt die Zahl
       des Tages nicht: ein Frühstück mit 6 g und ein Mittagessen mit 40 g
       ergeben dieselbe Summe wie zwei mit 23, und nur das erste hat einen
       offensichtlichen nächsten Schritt.

       ⚠️ UND `momento` BLEIBT GROSS. Das Portugiesische setzt hier ein
       `toLowerCase()`, weil ein Gattungsname mitten im Satz klein wird;
       im Deutschen wäre „im frühstück“ ein Rechtschreibfehler. */
    momentoFracoQ: (momento: string) => `Was kann ich zum ${momento} essen, um mehr Eiweiß zu bekommen?`,
    momentoFracoTitulo: (momento: string, media: number) => `${momento}: ${media} g Eiweiß im Schnitt`,
    /* ⚠️ DIE QUELLEN RESPEKTIEREN, WAS DIE PERSON ISST. Der Satz sagte
       „ein Ei, ein Joghurt oder ein Stück Käse“ zu allen — ein Rat, dem
       eine vegan lebende Person nicht folgen kann, gesagt von der App, die
       sie gerade gefragt hat, ob sie vegan lebt. */
    momentoFracoTexto: (melhor: string, mediaMelhor: number, fontes: string) =>
      `Das ist dein leichtester Zeitpunkt beim Eiweiß — das ${melhor} bringt ${mediaMelhor} g. Innerhalb dessen, was du isst, liefert am meisten Eiweiß pro Kalorie: ${fontes}.`,

    momentoForteQ: 'Warum zählt Eiweiß bei dieser Behandlung so viel?',
    momentoForteTitulo: (momento: string, media: number) => `${momento}: ${media} g Eiweiß im Schnitt`,
    momentoForteTexto: 'Das ist der Zeitpunkt, der dein Tagesziel am meisten trägt. Zu wiederholen, was dort schon funktioniert, ist leichter, als woanders etwas zu reparieren.',

    /* ⚠️ DER SATZ ZÄHLT, AN WIE VIELEN TAGEN GEMÜSE IM EINTRAG AUFTAUCHTE,
       und nicht, an wie vielen die Person Gemüse gegessen hat. Das sind
       zwei verschiedene Dinge, und ein Fertiggericht kann welches
       enthalten, ohne dass die App es weiß. */
    verdeQ: 'Welches Gemüse passt zu dem, was ich ohnehin esse?',
    verdeTitulo: (comVerde: number, total: number) =>
      `Gemüse an ${comVerde} von ${total} eingetragenen Tagen`,
    verdeTexto: 'Ein Salat oder eine Gemüsebeilage zum Mittagessen füllt den Teller mit wenig Kalorien — das hilft, satt aus der Mahlzeit zu gehen, ohne den Tag anzubrechen, und bringt die Ballaststoffe gleich mit.',
  },

  /* ⚠️ DIE `id` SIND DATEN — 'agua', 'cafe', 'coco' ist das, was in jedem
     Trink-Eintrag gespeichert bleibt. Nur Name und Gefäß kommen von hier.

     ⚠️ UND DAS GEFÄSS IST DAS, WAS DIE PERSON LAUT SAGEN WÜRDE. Niemand
     trinkt einen Kanister Kaffee, und wer eine Tasse getrunken hat, weiß
     nicht auswendig, wie viele Milliliter das waren. */
  bebidas: {
    agua: 'Wasser',
    cafe: 'Kaffee',
    cafeLeite: 'Milchkaffee',
    cha: 'Tee',
    coco: 'Kokoswasser',
    leite: 'Milch',
    suco: 'Saft',
    shake: 'Shake oder Whey',
    refri: 'Limo',
    alcool: 'Alkoholisches Getränk',
    outro: 'Anderes',

    /* ⚠️ DER VORBEHALT ZUM ALKOHOL BLEIBT AUF DEM BILDSCHIRM, und nicht
       versteckt in einer Rechnung. Es ist das einzige Getränk mit gut
       belegter negativer Flüssigkeitsbilanz — es unterdrückt das
       Vasopressin, und der Körper gibt mehr zurück, als er bekommen hat.
       Es bleibt eintragbar, weil das Tagebuch dafür da ist, festzuhalten,
       was passiert ist; es geht nur nicht in die Summe ein. */
    notaAlcool: 'Wird eingetragen, zählt aber nicht zur Summe: Alkohol lässt den Körper mehr Flüssigkeit abgeben, als er bekommen hat.',

    recipientes: {
      xicara: 'Tasse',
      caneca: 'Becher',
      copo: 'Glas',
      garrafa: 'Flasche',
      caixinha: 'Tetrapak',
      lata: 'Dose',
      taca: 'Kelch',
      longNeck: 'Longneck',
      coqueteleira: 'Shaker',
    },
  },

  prato: {
    /* ⚠️ DIE ZEITPUNKTE SIND SCHLÜSSEL UND BESCHRIFTUNG ZUGLEICH: der Name
       ist das, was in jeder Mahlzeit gespeichert bleibt, und auch das, was
       der Bildschirm zeigt. Die Liste zu übersetzen zerbricht KEINEN
       Eintrag, weil der Vergleich immer gegen den Wert läuft, den die App
       gerade zurückgegeben hat — aber eine alte Mahlzeit, die als
       „Almoço“ abgelegt ist, passt nicht zu „Mittagessen“, und deshalb
       fällt der Bildschirm auf den gespeicherten Namen zurück, wenn er ihn
       nicht erkennt. */
    cafeDaManha: 'Frühstück',
    almoco: 'Mittagessen',
    lanche: 'Snack',
    jantar: 'Abendessen',

    porcoes: (qtd: number) => `${qtd} ${qtd === 1 ? 'Portion' : 'Portionen'}`,

    /* ⚠️ DIE HERKUNFT ERSCHEINT NUR, WENN SIE GESAGT WERDEN MUSS. Ein
       Eintrag aus der Tabelle sagt nichts: das ist der Normalfall, und ihn
       anzukündigen wäre Rauschen auf allen Zeilen, um vor keiner zu
       warnen. */
    estimado: 'anhand des Fotos geschätzt',
    semConta: 'zählt noch nicht mit',

    /* ⚠️ DIE LESART EINES LEBENSMITTELS VERBIETET NICHTS. „Es ist nicht
       verboten, aber es nimmt einen guten Teil des Tages ein“ ist das
       Weiteste, wohin sie geht, und das ist Absicht: die App weiß nicht,
       was das Team mit der Person vereinbart hat. */
    muitaProteinaPoucaCaloria: 'Viel Eiweiß für wenig Kalorien. Das ist die Art Essen, die die Behandlung verlangt: es passt auf den Teller, der kleiner geworden ist, und hält trotzdem die Muskelmasse.',
    boaFonte: 'Gute Eiweißquelle, und das ist es, was die Muskelmasse hält, während das Gewicht fällt.',
    caloriaAlta: 'Viele Kalorien und wenig Eiweiß. Es ist nicht verboten, aber es nimmt einen guten Teil des Tages ein und gibt wenig von dem zurück, was die Behandlung braucht.',
    bastanteFibra: 'Viele Ballaststoffe. Das hilft gegen die Verstopfung, eine der häufigsten Nebenwirkungen der Behandlung.',
    quaseNaoPesa: 'Fällt im Tag kaum ins Gewicht. Gut als Beilage, aber das Eiweiß muss von woanders kommen.',
    temFibra: 'Enthält Ballaststoffe, die gegen die Verstopfung helfen — eine der häufigsten Nebenwirkungen der Behandlung.',
  },

  /* ⚠️ WAS DER EINTRAG SELBST ERKLÄRT, WIEGT MEHR ALS DER RÜCKFALL. Ein
     Kettenprodukt bringt die Tabelle der Kette mit, und der Rückfallsatz —
     „die Tabelle der Unicamp führt dieses nicht“ — ist wahr und nutzlos:
     er beschreibt, was die Quelle NICHT ist, während der Eintrag sagen
     kann, was sie ist. */
  origem: {
    porCem: (fonte: string) => `${fonte}. Das sind die Werte pro 100 g, und das Gewicht jeder Portion ist das, was die Kette selbst angibt.`,
    porPorcaoSemPeso: (fonte: string) => `${fonte}. Das sind die Werte der Portion, die die Kette verkauft, und nicht die für 100 g — sie veröffentlicht das Etikett des Produkts, ohne zu sagen, wie viel es wiegt.`,
    porPorcaoComPeso: (fonte: string) => `${fonte}. Das sind die Werte der Portion, die die Kette verkauft, und nicht die für 100 g — mit dem Gewicht, das sie selbst angibt.`,
    taco: 'Die Zahlen kommen aus der brasilianischen Tabelle der Lebensmittelzusammensetzung, erstellt von der Unicamp, die im Labor misst, was in jedem Lebensmittel steckt.',
    somaTaco: 'Das ist ein zusammengesetztes Gericht: wir addieren Zutat für Zutat nach der Tabelle der Unicamp, für eine Restaurantportion. Deine kann größer oder kleiner ausfallen.',
    rotulo: 'Die Tabelle der Unicamp führt dieses nicht, also kommen die Zahlen vom Etikett gängiger Handelsprodukte. Von Marke zu Marke ändern sie sich ein wenig.',
  },

  /* ⚠️ DER UNTERTITEL SAGT, WAS BLEIBT, und nicht nur, was hinausgeht.
     „Ohne Fleisch, Geflügel oder Fisch“ allein lässt die Person im
     Unklaren über Ei und Käse, und genau das ist der Zweifel derer, die
     zwischen vegetarisch und vegan schwankt. */
  restricoes: {
    vegetariano: 'Vegetarisch',
    vegetarianoSub: 'Ohne Fleisch, Geflügel oder Fisch. Ei und Milchprodukte bleiben.',
    vegano: 'Vegan',
    veganoSub: 'Nichts tierischen Ursprungs: Fleisch, Fisch, Ei, Milch und Käse fallen weg.',
    semLactose: 'Ohne Laktose',
    semLactoseSub: 'Milch, Käse und Erzeugnisse daraus fallen weg — wegen Unverträglichkeit oder Allergie.',
    semOvo: 'Ohne Ei',
    semOvoSub: 'Ei und Gerichte mit Ei fallen weg.',
    semPeixe: 'Ohne Fisch und Meeresfrüchte',
    semPeixeSub: 'Fisch, Garnelen und Meeresfrüchte fallen weg.',
    semCarneVermelha: 'Ohne rotes Fleisch',
    semCarneVermelhaSub: 'Rind und Schwein fallen weg. Geflügel und Fisch bleiben.',
  },
};
