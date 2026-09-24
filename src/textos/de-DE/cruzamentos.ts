/* ============================================================
   DIE KREUZUNGEN — was ihre Einträge sagen, wenn man sie kreuzt · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/cruzamentos.ts. Die, die für die ganze
   Datei gelten:

   KEINER DIESER SÄTZE DARF ZU EINEM RATSCHLAG WERDEN. „Wasser hilft bei
   der Sättigung“ ist eine Information; „trink mehr Wasser“ ist ein
   Befehl, und ein Befehl auf Grundlage der Statistik von dreizehn
   Einträgen ist das Schlechteste aus beiden Welten.

   UND DAS SUBJEKT IST DAS PHÄNOMEN, NICHT DIE PERSON. „Dein Trinken fällt
   sonntags“ und nicht „du trinkst sonntags weniger“ — dieselbe Tatsache
   mit dem ausgestreckten Finger.

   ⚠️ JEDER FUND HAT BIS ZU VIER BEWEGUNGEN, nicht austauschbar: `titulo`
   (die Schlagzeile), `texto` (die Zahlen, die sie tragen), `porque` (der
   Mechanismus) und `significa` (das „na und?“). `significa` wie eine
   Zusammenfassung von `texto` zu übersetzen zerstört die Karte: es gibt
   sie, um zu sagen, was die Zahlen NICHT sagen.
   ============================================================ */

export const cruzamentos = {
  /* ---------- die Kategorie-Etiketten ---------- */
  catAlimentacao: 'Essen',
  catSono: 'Schlaf',
  catSintomas: 'Beschwerden',
  catPeso: 'Gewicht',
  catAplicacoes: 'Spritzen',

  /* ---------- die Wochentage, so wie sie in den Satz kommen ---------- */
  /* ⚠️ SIE KOMMEN ALS ADVERB, nicht nackt. „Dein Trinken fällt Sonntag“
     spricht von einem bestimmten Sonntag, dem nächsten; „sonntags“ ist die
     Gewohnheit, und um die geht es.

     Das Deutsche löst das mit einem angehängten -s und Kleinschreibung —
     sonntags, montags —, wo das Portugiesische zwei Präpositionen braucht
     („aos“ und „às“) und das Französische einen Artikel. Drei Sprachen,
     drei Mechanismen, ein Sinn: deshalb ist die Liste der richtige Ort. */
  nomesDia: ['sonntags', 'montags', 'dienstags', 'mittwochs', 'donnerstags', 'freitags', 'samstags'],

  /* ---------- 1. das Wochenende als andere Behandlung ---------- */
  /* ⚠️ „EINE ANDERE BEHANDLUNG“, UND NICHT „DEIN SCHLECHTESTER MOMENT“.
     Der Fund kreuzt drei Größen, und zwei davon werden am Wochenende
     besser (der Schlaf steigt). Die Schlagzeile benennt den Unterschied,
     ohne zu sagen, welche Seite die falsche ist. */
  fimDeSemana: {
    titulo: 'Dein Wochenende funktioniert wie eine andere Behandlung',
    texto: (copos: string, proteina: string, sono: string) =>
      `Samstags und sonntags trinkst du ${copos} Gläser weniger${proteina}${sono}`,
    /* Optionales Stück: kommt nur, wenn der Eiweißunterschied groß genug
       ist — die Schwelle und ihr Grund stehen in logic/derive. */
    textoProteina: (gramas: number) => ` und isst ${gramas} g weniger Eiweiß`,
    /* ⚠️ DER SCHLAF IST DIE GUTE NACHRICHT IN DER SCHLECHTEN, und deshalb
       schließt er den Satz: „der Schlaf wird besser; es ist die Routine,
       die sich löst“ ist der ganze Fund in einer Zeile, und das ist es,
       was die Karte davon abhält, ein Vorwurf zu werden. */
    textoSono: (horas: string) => ` — schläfst aber ${horas} Std. mehr. Der Schlaf wird besser; es ist die Routine, die sich lockert.`,
    textoSemSono: '.',
    q: 'Wie halte ich das Wochenende besser durch?',
    evid: (copos: string) => ({ valor: `−${copos}`, unidade: 'Gläser', legenda: 'samstags und sonntags' }),
    porque: 'Die Routine der Woche trägt dein Trinken und deine Mahlzeiten, ohne dass du an sie denken musst: feste Zeiten, die Flasche auf dem Tisch, Mittagessen zur selben Stunde. Am Samstag verschwindet diese Struktur, und übrig bleibt, alles im Moment zu entscheiden — genau dann, wenn Entscheiden am schwersten fällt.',
    /* ⚠️ „ES BRAUCHT KEINE NEUE DISZIPLIN“ ist der ganze Satz. Wer das
       liest, weiß längst, dass das Wochenende schwerer ist; was sie nicht
       weiß, ist, dass das Problem in der Struktur liegt und nicht im
       Willen. */
    significa: 'Zwei Tage pro Woche steht die Behandlung ohne ihre Struktur da, und es sind genau die Tage, an denen du am meisten Zeit hast. Es braucht keine neue Disziplin — es braucht, dass das Wochenende eine eigene Routine hat, statt das Fehlen der Wochenroutine zu sein.',
  },

  /* ---------- 2. der schwache Trinktag ---------- */
  aguaDia: {
    /* ⚠️ DAS SUBJEKT IST DAS TRINKEN, UND ES WAR DIE PERSON. „Du trinkst
       sonntags deutlich weniger“ ist dieselbe Tatsache mit dem
       ausgestreckten Finger — und es war der einzige der fünf Funde in
       dieser Form. */
    titulo: (dia: string) => `Dein Trinken fällt ${dia}`,
    texto: (pior: string, outros: string) =>
      `Etwa ${pior} Gläser, gegenüber ${outros} an den anderen Tagen. Wasser hilft bei der Sättigung und bei der Übelkeit — und es ist der Tag, an dem beides am schwersten wiegt.`,
    q: 'Wie steht es um mein Trinken?',
    /* ⚠️ „GEGENÜBER“, UND NICHT „VON“. Das Englische schreibt „3, of 6
       glasses“; auf Deutsch wäre „3 von 6 Gläsern“ ein Bruchteil, während
       die Zahl darunter die der ANDEREN Tage ist. */
    evid: (pior: string, outros: string) =>
      ({ valor: pior, unidade: `gegenüber ${outros} Gläsern`, legenda: 'der Schnitt an diesem Wochentag' }),
    significa: 'Ein Wochentag zieht deinen Schnitt ganz allein nach unten. Weil es immer derselbe ist, reicht eine einzige Erinnerung, statt das Trinken jeden Tag zu überwachen.',
  },

  /* ---------- 3. das Eiweiß von heute gegen den Hunger von morgen ---------- */
  /* ⚠️ DER FUND IST DIE VERSCHIEBUNG UM EINEN TAG, und nicht das Eiweiß.
     Der Zusammenhang verschwindet im Tagesdiagramm, weil die Person den
     Hunger von heute neben dem Teller von heute sieht, nie neben dem von
     gestern — und genau das gibt die Karte ihr zurück. */
  proteinaFome: {
    titulo: 'An den Tagen, an denen du das Eiweißziel erreichst, ist der nächste leichter',
    texto: (meta: number, comMeta: string, semMeta: string) =>
      `Nachdem du die ${meta} g erreicht hattest, lag dein Hunger am nächsten Tag bei ${comMeta}. An den Tagen ohne das Ziel bei ${semMeta}. Die Wirkung zeigt sich nicht am selben Tag — deshalb bleibt sie unbemerkt.`,
    q: 'Wie steht es um mein Eiweiß?',
    evid: (diferenca: string) =>
      ({ valor: `−${diferenca}`, unidade: 'Hunger', legenda: 'am Tag nach einem erreichten Ziel' }),
    porque: 'Eiweiß wirkt auf die Sättigung über einen langsameren Weg als Zucker: es braucht Zeit, um den Magen zu verlassen, und hält die Sättigungssignale über Stunden. Deshalb hält die Wirkung über die Nacht an und taucht im Appetit des nächsten Morgens wieder auf.',
    /* ⚠️ „NICHT NUR EINE TABELLE FÜLLEN“ ist das, was das Eiweißziel aus
       der Pflicht holt und in den Tausch setzt — und der letzte Satz gibt
       den praktischen Nutzen, ohne irgendetwas anzuweisen. */
    significa: 'Das Eiweißziel zu erreichen heißt nicht nur, eine Tabelle zu füllen: es heißt, sich einen ruhigeren nächsten Tag zu erkaufen. Wenn der Hunger drückt, löst ihn nicht das, was du in dem Moment isst — sondern das, was du gestern gegessen hast.',
  },

  /* ---------- 4. der Schlaf gegen den Hunger des nächsten Tages ---------- */
  sonoFome: {
    titulo: 'Mehr als sieben Stunden Schlaf halten deinen Hunger am nächsten Tag',
    texto: (comSono: string, semSono: string) =>
      `Nach vollen Nächten lag dein Hunger bei ${comSono}; nach kurzen Nächten bei ${semSono}. Dein Appetit antwortet auf den Schlaf der Nacht davor genauso wie auf das, was du gegessen hast.`,
    q: 'Was soll ich vor dem Schlafen eintragen?',
    evid: { valor: '7 Std.', unidade: '+', legenda: 'der Punkt, an dem dein Hunger kippt' },
    /* ⚠️ „DAS IST KEIN MANGEL AN DISZIPLIN“ ist der Kern, keine
       Beschwichtigung. Wer schlecht geschlafen und am nächsten Tag mehr
       gegessen hat, macht sich selbst Vorwürfe; der hormonelle Mechanismus
       ist die Tatsache, die die Schuld auflöst. */
    porque: 'Wenig zu schlafen bewegt die beiden Hormone, die den Appetit regeln: das, was Hunger macht, steigt, und das, was meldet, dass es genug ist, fällt. Das ist kein Mangel an Disziplin am nächsten Tag — das ist dein Körper, der schnelle Energie verlangt, um den fehlenden Schlaf auszugleichen.',
    significa: 'Schlaf taucht selten in der Rechnung derer auf, die ihr Gewicht behandeln, aber in deinen Daten bewegt er den Appetit wie wenig anderes. Eine geschützte Nacht kann für den nächsten Tag mehr wert sein als jede Umstellung auf dem Teller.',
  },

  /* ---------- 5. der Schlaf gegen die Übelkeit des nächsten Tages ---------- */
  /* ⚠️ DAS IST DER EINZIGE FUND, DER EINE GEWOHNHEIT MIT EINEM KLINISCHEN
     SYMPTOM VERBINDET, und sein `significa` ist deshalb das vorsichtigste
     der Datei: es LÖST die Ursachenlesart auf, zu der der Titel einlädt.
     Sich hier zu irren kostet keinen schlechten Rat über Wasser — es
     kostet, jemanden schließen zu lassen, ihre Übelkeit sei die Schuld
     einer schlechten Nacht. */
  sonoEnjoo: {
    titulo: 'Nach langen Nächten ist deine Übelkeit geringer',
    texto: (horas: number, comSono: string, semSono: string) =>
      `An den Tagen nach einer Nacht von ${horas} Std. oder mehr lag deine Übelkeit bei ${comSono}. Nach kurzen Nächten bei ${semSono} — auf einer Skala von 5.`,
    q: 'Warum ist mir übel?',
    evid: (comSono: string, semSono: string, noites: number) =>
      ({ valor: comSono, unidade: `gegenüber ${semSono}`, legenda: `die Übelkeit nach ${noites} langen Nächten` }),
    significa: 'Das ist, was deine Einträge zeigen, und kein Ursachenzusammenhang: der Zyklus der Spritze bewegt die Übelkeit mehr als alles andere, und er kann hinter beiden Seiten der Rechnung stehen. Nimm es als Spur mit zu deinem Team, nicht als abgeschlossene Erklärung.',
  },

  /* ---------- 6. das Fenster der Übelkeit ---------- */
  /* Der Fund ist nicht, dass es Übelkeit gibt — es ist, dass sie eine
     Uhrzeit hat, zu der sie endet. */
  janelaEnjoo: {
    titulo: 'Deine Übelkeit verschwindet meist etwa 48 Stunden nach der Spritze',
    texto: (perto: string, longe: string) =>
      `Sie liegt an den ersten beiden Tagen bei ${perto} und fällt ab dem dritten auf ${longe}. Es ist nicht die ganze Behandlung, die übel macht — es sind die ersten 48 Stunden jedes Zyklus.`,
    q: 'Warum ist mir übel?',
    evid: { valor: '48', unidade: 'Stunden', legenda: 'und dann geht es vorbei' },
    /* ⚠️ DER LETZTE SATZ IST DER EINZIGE DER DATEI, DER EINE HANDLUNG
       VORSCHLÄGT, und er darf es: den Tag der Spritze zu wählen ist eine
       Entscheidung der Person mit ihrem Team, keine Änderung von Dosis
       oder Medikament. */
    significa: (dias: number) =>
      `Das hat sich in ${dias} deiner Einträge nach der Spritze wiederholt. Zu wissen, dass es ein Fenster gibt und dass es endet, ändert, was man damit macht: der Tag der Spritze lässt sich so wählen, dass diese 48 Stunden auf den leichtesten Teil deiner Woche fallen.`,
  },

  /* ---------- 7. das Wasser gegen die Übelkeit ---------- */
  aguaEnjoo: {
    titulo: 'An den Tagen, an denen du gut trinkst, ist die Übelkeit geringer',
    /* ⚠️ „DAS BEWEIST KEINE URSACHE“ STEHT IM SATZ, und nicht in einer
       Fußnote. Die ganze Karte ist eine Korrelation über dreizehn Tage;
       der Vorbehalt muss direkt an der Zahl ankommen, weil er dort
       gelesen wird. */
    texto: (corte: string, comAgua: string, semAgua: string) =>
      `Ab ${corte} lag deine mittlere Übelkeit bei ${comAgua}. Darunter bei ${semAgua}. Das beweist keine Ursache — aber es ist unter allem, was mit dem Symptom zusammenhängt, die Größe, die sich am leichtesten bewegen lässt.`,
    q: 'Wie bekomme ich die Übelkeit kleiner?',
    evid: (diferenca: string) =>
      ({ valor: `−${diferenca}`, unidade: 'Übelkeit', legenda: 'an den gut getrunkenen Tagen' }),
    significa: 'Von allem, was mit deiner Übelkeit zusammenhängt, ist Wasser das, was am meisten in deiner Hand liegt. Es ersetzt kein Gespräch mit deinem Team, wenn sie drückt, aber es ist das Erste, was sich davor zu versuchen lohnt.',
  },

  /* ---------- 8. das Plateau, das nichts verhindert hat ---------- */
  /* ⚠️ DAS IST DER FUND, DER DEN ABBRUCH VERHINDERT, und dafür gibt es ihn.
     Die Woche, in der die Waage steigt, ist die Woche, in der Leute
     aufhören — und die Karte zeigt mit ihren eigenen Zahlen, dass das
     schon vorgekommen ist und nicht bedeutet hat, wonach es aussah. */
  platoQueNaoImpediu: {
    titulo: (altas: number, perdido: string) =>
      `Die Waage ist ${altas} Mal gestiegen, und du hast trotzdem ${perdido} verloren`,
    texto: (pesagens: number, altas: number) =>
      `Von ${pesagens} Wiegungen lagen ${altas} über der vorherigen — und die Grundlinie geht weiter nach unten. Eine Woche im Plus ist kein Rückfall: es ist Rauschen aus Wasser und Verdauung innerhalb eines Trends.`,
    q: 'Wie läuft meine Entwicklung?',
    evid: (altas: number, perdido: string) =>
      ({ valor: String(altas), unidade: 'Anstiege', legenda: `innerhalb von −${perdido} im Zeitraum` }),
    porque: 'Das Tagesgewicht ist Fett, aber auch Wasser, Salz, Verdauung und der Hormonzyklus — Schwankungen von ein bis zwei Kilo passieren, ohne dass sich am Körperfett etwas geändert hätte. Fett geht langsam und in einer Linie; der Rest schwingt darüber, und das ist, was die Waage zuerst zeigt.',
    significa: 'Das zählt mehr, als es aussieht: die Woche, in der die Waage steigt, ist die Woche, in der Leute aufgeben. In deinen eigenen Zahlen hat sie nie bedeutet, wonach sie aussah.',
  },

  /* ---------- 9. das Eiweiß im Verlauf der Behandlung ---------- */
  /* Beide Hälften des Satzes wechseln die Richtung gemeinsam, und die
     fallende Fassung MAHNT NICHT: „es lohnt sich, wieder anzusetzen, bevor
     es zur neuen Normalität wird“ ist das Nächste an einer Bitte, wohin
     diese Datei kommt, und es geht um eine Gewohnheit, nicht um die
     Person. */
  proteinaTendencia: {
    titulo: (subiu: boolean, pct: number) =>
      `Dein Eiweiß ist seit dem Start um ${pct}% ${subiu ? 'gestiegen' : 'gefallen'}`,
    textoSubiu: (depois: number, antes: number) =>
      `Im Schnitt ${depois} g/Tag in den letzten Wochen, gegenüber ${antes} g am Anfang. Eiweiß bewahrt die Magermasse während der Gewichtsabnahme.`,
    textoCaiu: (depois: number, antes: number) =>
      `Im Schnitt ${depois} g/Tag in den letzten Wochen, gegenüber ${antes} g davor. Es lohnt sich, wieder anzusetzen — die Magermasse trägt den Stoffwechsel.`,
    q: 'Wie steht es um mein Eiweiß?',
    evid: (pct: number, antes: number, depois: number) =>
      ({ valor: `${pct > 0 ? '+' : ''}${pct}%`, unidade: '', legenda: `${antes} → ${depois} g pro Tag` }),
    significaSubiu: 'Es ist gestiegen, ohne dass du es dir vorgenommen hättest, und das ist meist die Art Gewohnheit, die bleibt. Eiweiß schützt deine Magermasse, während das Gewicht fällt — ohne es ist ein Teil dessen, was verschwindet, kein Fett.',
    significaCaiu: 'Der Rückgang war allmählich, von der Art, die man von einem Tag auf den anderen nicht bemerkt. Eiweiß schützt deine Magermasse, während das Gewicht fällt; es lohnt sich, wieder anzusetzen, bevor es zur neuen Normalität wird.',
  },

  /* ============================================================
     DIE ZWEI PORTRÄTS, AM ENDE DER SCHLANGE

     ⚠️ DIESE BEIDEN BESCHREIBEN EINE ZAHL, DIE DIE PERSON AUF DER
     STARTSEITE SCHON SIEHT, und sie sind deshalb keine Funde: sie sind
     Porträts. Sie stehen mit Absicht zuletzt.

     Der Grund für diese Markierung steht in logic/derive — sie waren die
     einzigen ohne Bedingung drumherum und eröffneten den Reiter, für alle,
     die gerade installiert hatten, mit „Du hast 0% der Spritzen
     pünktlich gehalten“.
     ============================================================ */

  /* ---------- 10. das Tempo ---------- */
  ritmo: {
    /* ⚠️ DIE EINHEIT KOMMT VON AUSSEN und steht nicht hier: in Imperial
       ist das Tempo Pfund pro Woche. Siehe ../pt-BR/cruzamentos.ts. */
    titulo: (ritmo: string, unidade: string) => `Dein Tempo liegt bei ${ritmo} ${unidade} pro Woche`,
    textoBom: (perdido: string, semanas: number) =>
      `${perdido} in ${semanas} Wochen, im Rahmen dessen, was für deine Phase erwartet wird.`,
    /* ⚠️ DIE FASSUNG AUSSERHALB DES ERWARTETEN DIAGNOSTIZIERT NICHT UND
       ALARMIERT NICHT: sie verweist. Ein zu schnelles oder zu langsames
       Tempo ist ein Gespräch für die Sprechstunde, und die Karte hört
       genau dort auf. */
    textoAtencao: (perdido: string, semanas: number) =>
      `${perdido} in ${semanas} Wochen. Es lohnt sich, das Tempo beim nächsten Termin mit deinem Team zu besprechen.`,
    q: 'Wie läuft meine Entwicklung?',
    evid: (ritmo: string, unidade: string, perdido: string, semanas: number) =>
      ({ valor: ritmo, unidade: `${unidade}/Wo.`, legenda: `${perdido} in ${semanas} Wochen` }),
    significaBom: 'Das ist ein Tempo, das sich halten lässt, und Haltbarkeit ist das, was zählt: zu schnelle Verluste nehmen meist Magermasse mit und kommen danach zurück. Deines liegt in dem Bereich, den die Literatur mit einem Ergebnis verbindet, das bleibt.',
    /* ⚠️ „NICHT MIT MIR“ — es ist die einzige Zeile der App, die in der
       ersten Person sagt, was sie NICHT tut. Es gibt sie, weil die
       Alternative war, über ein Tempo zu urteilen, das eine klinische
       Ursache haben kann. */
    significaAtencao: 'Das Tempo ist ein Gespräch mit deinem Team, nicht mit mir. Ich nehme die Zahl geordnet mit zum Termin, wenn du willst.',
  },

  /* ---------- 11. die Verlässlichkeit ---------- */
  adesao: {
    tituloPerfeita: 'Du warst seit dem Start mit keiner Spritze zu spät',
    titulo: (pct: number) => `Du hast ${pct}% der Spritzen pünktlich gehalten`,
    texto: (aplicacoes: number, ressalva: string) =>
      `Das sind ${aplicacoes} Spritzen seit Beginn der Behandlung, ${ressalva}.`,
    textoQuaseTodas: 'fast alle am richtigen Tag',
    textoComAtrasos: 'mit ein paar Verspätungen unterwegs',
    q: 'Wie funktioniert der Zyklus des Medikaments?',
    evid: (pct: number, aplicacoes: number) =>
      ({ valor: `${pct}%`, unidade: '', legenda: `${aplicacoes} Spritzen seit dem Start` }),
    significaAlta: 'Diese Regelmäßigkeit ist einer der Faktoren, die für ein gutes Ansprechen auf das Medikament am meisten wiegen. Der Spiegel der Substanz im Körper hängt von Regelmäßigkeit ab, nicht von Anstrengung — und das ist die Art Sache, die nur auffällt, wenn jemand den ganzen Verlauf ansieht.',
    /* ⚠️ DIE FASSUNG MIT VERSPÄTUNGEN ERKLÄRT DEN PREIS UND MAHNT DAS
       VERSÄUMNIS NICHT AN. „Jede Verspätung lässt ein Fenster, in dem die
       Wirkung zu früh fällt“ ist der Mechanismus; „versuch, nicht zu spät
       zu sein“ wäre der Vorwurf, den dieser Bildschirm nicht macht. */
    significaBaixa: 'Die Regelmäßigkeit wiegt mehr als die genaue Dosis des Tages: jede Verspätung lässt ein Fenster, in dem die Wirkung zu früh fällt, und genau dort kommt der Hunger meist stärker zurück.',
  },
};
