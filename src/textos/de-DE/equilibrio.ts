/* ============================================================
   DIE BALANCE — die Lesart des Netzdiagramms, in zwei Sätzen · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/equilibrio.ts. Das Diagramm zeigt acht
   Achsen und schließt nichts. Schließen müsste die Person, die nicht
   weiß, ob 62 % bei Eiweiß gut ist — also schließt dieser Satz, und die
   Grafik wird seine Illustration.

   ⚠️ ER SPRICHT IN DER ERSTEN PERSON UND ERÖFFNET EIN GESPRÄCH. „Deine
   Balance ist beständig“ ist ein Befund, und Befunde schreibt ein System.
   „Eine Sache ist mir aufgefallen“ ist jemand, der die Daten angesehen
   hat und etwas dazu sagt — genau das, was der Bildschirm verspricht.

   ⚠️ UND DIE LESART WEIST NIE AN. Die ernsteste Fassung sagt „das wäre
   mein Schwerpunkt für die nächste Woche“ — Konjunktiv, erste Person, ein
   Vorschlag, wo man hinschauen könnte. „Du musst X verbessern“ wäre ein
   anderer Bildschirm.
   ============================================================ */

/* ⚠️ "WIE VERBESSERE ICH BEWEGUNG" FEHLT DAS POSSESSIV. Die Achse kommt
   als Variable und hat drei Geschlechter; die Tabelle gibt jeder Achse
   ihre Form im Akkusativ. Eiweiß allein wäre „mein Eiweiß“, und das sagt
   niemand — gemeint ist die Zufuhr. */
const MEIN: Record<string, string> = {
  Schlaf: 'meinen Schlaf',
  Energie: 'meine Energie',
  Stimmung: 'meine Stimmung',
  Trinken: 'mein Trinken',
  Bewegung: 'meine Bewegung',
  Eiweiß: 'meine Eiweißzufuhr',
  Sättigung: 'meine Sättigung',
  Therapietreue: 'meine Therapietreue',
};
const mein = (eixo: string) => MEIN[eixo] ?? eixo;

export const equilibrio = {
  /* ⚠️ DER NAME DER ACHSE WAR IHR SCHLÜSSEL. `radar()` gab `{k: 'Sono'}`
     zurück, die Reihentabelle wurde mit 'Sono' indiziert, und der
     Bildschirm schickte dasselbe 'Sono' zurück, um die Grafik anzufordern
     — das Wort zu übersetzen zerbrach die Suche. Heute ist der Schlüssel
     `id` ('sono') und die Beschriftung kommt von hier.

     ⚠️ UND „SÄTTIGUNG“ IST NICHT DER NAME DER SPALTE, DIE GEMESSEN WIRD.
     Die Person beantwortet HUNGER im Check-in, und die Achse zeigt das
     Gegenteil davon: je mehr Hunger, desto weniger Sättigung. Die Achse
     trägt den Namen der guten Seite, weil in einem Diagramm, in dem alles
     nach außen wächst, auch sie nach außen wachsen muss. */
  eixos: {
    sono: 'Schlaf',
    energia: 'Energie',
    humor: 'Stimmung',
    hidratacao: 'Trinken',
    exercicio: 'Bewegung',
    proteina: 'Eiweiß',
    saciedade: 'Sättigung',
    adesao: 'Therapietreue',
  },

  /* Die Wahl richtet sich nach der SPANNE zwischen der besten und der
     schlechtesten Achse: sie sagt, ob die Behandlung im Gleichgewicht
     steht oder auf einem Bein. Bis 30, bis 55, und darüber. */
  aberturaTudoBem: 'Mir ist etwas Gutes aufgefallen.',
  aberturaAtencao: 'Eine Sache ist mir aufgefallen.',
  aberturaPreciso: 'Ich muss dir etwas zeigen.',

  /* ⚠️⚠️ DIESES PAAR IST DIE ÜBERSETZUNGSFALLE DIESER DATEI, und genau
     deshalb ist es eine Funktion und keine Verkettung draußen.

     Im Portugiesischen eröffnen die beiden Namen den Satz allein, und der
     ZWEITE fällt in Kleinschreibung: „Sono e adesão puxam para cima“.

     IM DEUTSCHEN FÄLLT ER NICHT. Beide bleiben groß — „Schlaf und
     Therapietreue ziehen nach oben“ —, weil jedes Substantiv groß
     bleibt. Wer die portugiesische Zeile hierher kopiert, bringt das
     `toLowerCase()` mit und schreibt „Schlaf und verlässlichkeit“. */
  par: (primeiro: string, segundo: string) => `${primeiro} und ${segundo}`,

  corpoEquilibrado: (doisFortes: string, fraco: string) =>
    `${doisFortes} ziehen nach oben, und auch ${fraco} hinkt nicht hinterher. Ich würde vorerst nichts ändern.`,
  corpoUmAtras: (doisFortes: string, fraco: string) =>
    `${doisFortes} sind beständig. ${fraco} schwankt am meisten — das wäre mein Schwerpunkt für die nächste Woche.`,

  /* ⚠️ DER KNOPF TRÄGT DIE FRAGE ZUM COMPANION. Wenn Knopftext und
     gesendete Frage auseinanderlaufen, tippt die Person auf das eine und
     bekommt die Antwort auf das andere — und das wäre beinahe passiert:
     der Knopf wurde auf dem Bildschirm zusammengebaut, mit demselben
     `toLowerCase()` ein zweites Mal geschrieben, und die Frage stand hier.

     ⚠️ UND HIER FÄLLT DIE KLEINSCHREIBUNG WIEDER WEG: „Wie verbessere ich
     Schlaf“, nicht „schlaf“. */
  botaoMelhorar: (eixo: string) => `Wie verbessere ich ${mein(eixo)}`,
  perguntaMelhorar: (eixo: string) => `Wie verbessere ich ${mein(eixo)}?`,

  /* Der Hut des Balkendiagramms: die Achse in Versalien und wie viele
     Tage die Reihe abdeckt. Versalien wegen der Typografie des
     Bildschirms — und es steht hier, weil `toUpperCase()` ebenfalls eine
     Sprachoperation ist. */
  serieDe: (eixo: string, dias: number) => `${eixo.toUpperCase()} · LETZTE ${dias} TAGE`,
};
