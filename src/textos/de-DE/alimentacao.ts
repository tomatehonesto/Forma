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

  /* ⚠️⚠️ DER ENERGIESATZ TRÄGT EIN `<b>` IN SICH, und das ist keine
     Dekoration: es ist das, was die WORTSTELLUNG freigibt.

     Das Portugiesische sagt „Ainda cabem 487 kcal no seu dia“ — Zahl in
     der Mitte. Das Deutsche sagt „Es passen noch 487 kcal in deinen Tag“
     — eine andere Mitte. Baute der Bildschirm das aus drei Stücken
     zusammen (davor, Zahl, danach), müsste jede Sprache in die Ordnung
     des Portugiesischen passen, und das Deutsche passt nicht hinein.

     Die Auszeichnung gab es schon, aus den Insights, und `Rich` in ui/kit
     liest sie. Hier bekommt sie einen zweiten Zweck. Siehe
     ../pt-BR/alimentacao. */
  tela: {
    titulo: 'Essen',
    linhaSemProteina: (alvo: number) => `Eiweiß: nichts eingetragen · Ziel ${alvo} g`,
    linhaComProteina: (prot: number, alvo: number, resto: string) => `Eiweiß: ${prot} von ${alvo} g · ${resto}`,
    faltamParaMeta: (falta: number) => `noch ${falta} g bis zum Ziel`,
    metaAlcancada: 'Ziel erreicht',
    registrarRefeicao: 'Eine Mahlzeit eintragen',

    energiaTitulo: 'Die Energie von heute',
    calorias: 'KALORIEN',
    deKcal: (meta: string) => `von ${meta} kcal`,

    sobramDoQueConta: (quanto: string) => `Es bleiben <b>${quanto} kcal</b> von dem, was sich zählen lässt.`,
    /* ⚠️ „WÄHL GUT, WOFÜR DU SIE AUSGIBST“ IST DIE EINZIGE BITTE DIESES
       BILDSCHIRMS, und sie darf hier stehen, weil sie sein Thema ist: auf
       einem Teller, der kleiner geworden ist, entscheidet nicht die Größe
       des Rests über die Behandlung, sondern was hineinkommt. */
    aindaCabem: (quanto: string) => `Es passen noch <b>${quanto} kcal</b> in deinen Tag. Wähl gut, wofür du sie ausgibst.`,
    /* „Morgen ist ein neuer Tag“ und keine Warnung: das Ziel an einem Tag
       zu überschreiten ist kein Versagen, und der Bildschirm hat einem
       Tag, der schon vorbei ist, nichts vorzuhalten. */
    passouAMeta: (quanto: string) => `Du bist heute <b>${quanto} kcal</b> über dem Ziel. Morgen ist ein neuer Tag.`,

    foraDaConta: (fora: number, total: number) =>
      `${fora} von ${total} ${total === 1 ? 'Mahlzeit zählt' : 'Mahlzeiten zählen'} hier nicht mit: nur ein aus der Tabelle gebauter Teller hat ein geprüftes Etikett.`,

    carboidrato: 'Kohlenhydrate',
    gordura: 'Fett',
    fibra: 'Ballaststoffe',
    deG: (meta: number) => `von ${meta} g`,

    semanaTitulo: 'Das Eiweiß der Woche',
    estaSemana: 'Diese Woche',
    /* ⚠️ SCHNITT AUS DEN EINGETRAGENEN TAGEN, und der Untertitel sagt das.
       Ein Tag ohne eingetragene Mahlzeit ist kein Tag mit 0 g — es ist ein
       Tag, den die Person nicht eingetragen hat, und durch sieben zu
       teilen machte aus dem Vergessen einen Eiweißeinbruch.

       ⚠️ Und der Plural steht im Dativ: „aus 5 eingetragenen Tagen“. */
    nadaNaSemana: 'Nichts in den letzten sieben Tagen eingetragen',
    mediaDeDias: (dias: number) => `Schnitt aus ${dias} ${dias === 1 ? 'eingetragenen Tag' : 'eingetragenen Tagen'}`,
    metaG: (alvo: number) => `Ziel: ${alvo} g`,

    notamosTitulo: 'Was uns aufgefallen ist',
    notamosNota: 'Aus deiner Routine der letzten zwei Wochen — und nur aus dem, was du eingetragen hast.',
    continueAssim: 'WEITER SO',
    umaIdeia: 'EINE IDEE',
    conversarSobre: 'Darüber sprechen',

    diarioTitulo: 'Mahlzeiten-Tagebuch',
    diarioNota: 'Tipp auf eine Mahlzeit, um sie anzusehen, zu korrigieren oder zu löschen.',
    /* ⚠️ DIE HERKUNFT QUALIFIZIERT DIE ZAHL, wie bei den Einheiten: 30 g,
       die du geschrieben hast, und 30 g, die das Foto geschätzt hat, prüft
       man nicht auf dieselbe Weise. Und ein fehlendes `fonte` heißt von
       Hand — der Bildschirm zeigt nie das Fehlen, er zeigt „von dir“. */
    porVoce: 'von dir',
    pelaFoto: 'per Foto',
    deProteina: 'Eiweiß',
    totalDoDia: (refeicoes: number, gramas: number) =>
      `${refeicoes} ${refeicoes === 1 ? 'Mahlzeit' : 'Mahlzeiten'} · ${gramas} g Eiweiß`,
    diaVazioTitulo: 'Keine Mahlzeit an diesem Tag',
    diaVazioTexto: 'Was du einträgst, geht ins Eiweiß des Tages.',

    favoritosTitulo: 'Lieblingsgerichte',
    favoritosLink: 'Anlegen',
    favoritosNota: 'Stell den Teller einmal zusammen, und er wird mit einem Tippen eingetragen.',
    semPratoGuardado: 'Kein Teller gespeichert — öffnet über die Suche',
    favVazioTitulo: 'Kein Lieblingsgericht',
    favVazioTexto: 'Speichere einen Teller, den du wiederholst, und er wird mit einem Tippen eingetragen.',

    seusAlimentos: 'Deine Lebensmittel',
    dicionario: 'Lebensmittel-Lexikon',
    dicionarioSub: 'Lerne, wie jedes Lebensmittel deiner Behandlung helfen kann',
    restricoesLinha: 'Einschränkungen beim Essen',
    semRestricao: 'Keine',
  },

  /* ⚠️ `deBebida` NÃO PASSA POR MINÚSCULA AQUI, e é o motivo de o
     `.toLowerCase()` ter saído da tela: em alemão "Kaffee" e "Milch" são
     substantivos, e abaixá-los escreveria errado. `comum.noMeio` devolve
     o que recebe no alemão, e é por isso que ele existe. */
  telaAgua: {
    titulo: 'Trinken',
    hojeNada: (meta: string) => `Heute: nichts eingetragen · Ziel von ${meta}`,
    hojeCom: (bebido: string, meta: string, resto: string) =>
      `Heute: ${bebido} von ${meta} · ${resto}`,
    faltam: (quanto: string) => `es fehlen ${quanto}`,
    metaAlcancada: 'Ziel erreicht',
    registrar: 'Eintragen, was du getrunken hast',

    suaSemana: 'Deine Woche',
    nadaNaSemana: 'Nichts eingetragen in den letzten sieben Tagen',
    mediaDeDias: (dias: number) =>
      `Durchschnitt aus ${dias} ${dias === 1 ? 'eingetragenem Tag' : 'eingetragenen Tagen'}`,
    meta: (quanto: string) => `Ziel: ${quanto}`,

    diario: 'Getränketagebuch',
    diarioNota: 'Kaffee, Tee, Milch und Saft zählen mit: das Ziel ist Flüssigkeit und nicht reines Wasser. Lösch, was falsch hineingeraten ist.',
    apagarDoDia: 'Das Wasser dieses Tages löschen?',
    apagarGole: (quanto: string, hora: string) => `${quanto} von ${hora} löschen?`,
    deBebida: (nome: string) => ` ${nome}`,
    totalSemHora: 'Tagessumme, ohne eingetragene Uhrzeit',
    asHoras: (hora: string) => `um ${hora}`,
    foraDaContaSufixo: ' · zählt nicht mit',
    registros: (quantos: number, total: string) =>
      `${quantos} ${quantos === 1 ? 'Eintrag' : 'Einträge'} · ${total}`,
    maisForaDaConta: (quantos: number) =>
      ` · ${quantos} ${quantos === 1 ? 'zählt' : 'zählen'} nicht mit`,
    daComida: (quanto: string) => `Dazu ${quanto} aus dem, was du gegessen hast`,
    vazioTitulo: 'An diesem Tag nichts eingetragen',
    vazioTexto: 'Was du einträgst, geht in die Tagessumme.',

    lembrete: 'Erinnerung',
    alertas: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'Erinnerung' : 'Erinnerungen'} ans Trinken`,
    nenhumAlerta: 'Keine Erinnerung ans Trinken',
    tocaEm: (quando: string) => `Klingelt ${quando}`,
    umToquePorDia: 'Ein Signal pro Tag, zu der Zeit, die du wählst',
  },
};
