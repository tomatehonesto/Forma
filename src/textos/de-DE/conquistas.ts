/* ============================================================
   DIE ERFOLGE — die Pfade, was jede Stufe sagt und was fehlt · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/conquistas.ts. DIE `id` UND DIE STUFEN
   STEHEN NICHT HIER: 'kg', 'rodizio', 'prot-seq' sind Daten, und die
   Zahlen jeder Stufe — 2, 5, 10, 15, 20, 30 Kilo — sind Inhalt. Eigene
   Stufen je Sprache ließen dieselbe Person unterschiedliche Erfolge
   bekommen, je nachdem, in welcher Sprache sie liest.

   ⚠️ JEDER PFAD SPRICHT IN ZWEI ZEITEN, und es ist nicht derselbe Satz:
   `desc` ist, was diese Stufe SCHON IST — „12 Spritzen eingetragen“ —,
   und `falta` ist, was von der nächsten trennt — „Noch 14 Spritzen“.

   Das Erste steht in der Vergangenheit und liest sich mit Stolz; das
   Zweite steht in der Zukunft und muss in eine Zeile passen, ohne nach
   Mahnung zu klingen. „Noch“ und nicht „du brauchst noch“: das Subjekt
   ist die Entfernung, nicht die Person.
   ============================================================ */

/* ⚠️⚠️ DER PLURAL IST HIER PFLICHTFELD, und das ist der eine Unterschied
   zum Portugiesischen, der sich durch die ganze Datei zieht.

   Dort ist der Standardfall `s + 's'` und trifft meistens zu; die
   Ausnahmen — „local/locais“, „sessão/sessões“ — sind wenige genug, dass
   man sie einzeln nennt. Im Deutschen trifft `+ 's'` fast NIE zu:
   Spritze/Spritzen, Tag/Tage, Stelle/Stellen, Befund/Befunde, und
   „Teller“ ändert sich gar nicht.

   Es gibt keine Regel, die man als Standard setzen könnte. Also gibt es
   keinen Standard: wer eine Stufe hinzufügt und den Plural vergisst,
   bekommt einen Compiler-Fehler statt eines falschen Wortes auf dem
   Bildschirm. */
const p = (n: number, s: string, pl: string) => `${n} ${n === 1 ? s : pl}`;

export const conquistas = {
  /* Die acht Familien, die die Reiter des Bildschirms sind. */
  familias: {
    tratamento: 'Behandlung',
    peso: 'Gewicht',
    constancia: 'Regelmäßigkeit',
    hidratacao: 'Trinken',
    proteina: 'Eiweiß',
    movimento: 'Bewegung',
    comida: 'Essen',
    acompanhamento: 'Begleitung',
  },

  /* ---------------- Behandlung ---------------- */
  /* ⚠️ UND DAS PARTIZIP BEUGT SICH NICHT MIT. Das Portugiesische schreibt
     „registrada“ oder „registradas“ je nach Anzahl; „eingetragen“ bleibt
     „eingetragen“. Die ganzen `${a === 1 ? '' : 's'}` des Originals fallen
     hier weg — nicht aus Nachlässigkeit, sondern weil es sie nicht gibt. */
  doses: 'Spritzen',
  dosesDesc: (a: number) => `${p(a, 'Spritze', 'Spritzen')} eingetragen`,
  dosesFalta: (r: number) => `Noch ${p(r, 'Spritze', 'Spritzen')}`,

  tempo: 'Behandlungsdauer',
  /* Unter einem Jahr zählt es in Monaten, ab da in Jahren: „12 Monate“
     und „1 Jahr“ sind dieselbe Zeit, und nur das Zweite feiert man. */
  tempoDesc: (a: number) => (a < 365
    ? `${a / 30} ${a === 30 ? 'Monat' : 'Monate'} seit der ersten Dosis`
    : `${a / 365} ${a > 365 ? 'Jahre' : 'Jahr'} seit der ersten Dosis`),
  tempoFalta: (r: number) => `Noch ${p(r, 'Tag', 'Tage')}`,

  /* ⚠️ DER WECHSEL DER EINSTICHSTELLE IST KEIN SCHMUCK: immer dieselbe
     Stelle zu treffen macht Knoten, und zu wechseln steht in der
     Packungsbeilage. Es ist der einzige Pfad, der eine
     Sicherheitspraxis belohnt. */
  rodizio: 'Stellenwechsel',
  rodizioDesc: (a: number) => `${p(a, 'Einstichstelle', 'Einstichstellen')} genutzt`,
  rodizioFalta: (r: number) => `Noch ${p(r, 'Stelle', 'Stellen')}`,

  titulacao: 'Aufdosierung',
  titulacaoDesc: (a: string) => `Die Dosis von ${a} erreicht`,
  titulacaoFalta: (a: string) => `Als Nächstes: ${a}`,

  /* ---------------- Gewicht ---------------- */
  /* ⚠️ DAS GEWICHT KOMMT FERTIG GESCHRIEBEN AN, in der Einheit derjenigen,
     die liest — „4,4 lb unter dem Startgewicht“. Siehe logic/medidas.

     ⚠️⚠️ UND DESHALB NENNT DER TITEL KEINE EINHEIT. „Kilos weniger“
     über einem Wert in Pfund ist der Bildschirm, der sich selbst
     widerspricht. Die Gründe stehen in ../pt-BR/conquistas.ts. */
  kg: 'Weniger Gewicht',
  kgDesc: (peso: string) => `${peso} unter dem Startgewicht`,
  kgFalta: (peso: string) => `Noch ${peso}`,

  /* ⚠️ DER PROZENTSATZ IST EIN ANDERES GESPRÄCH und keine Wiederholung der
     Kilos: die fünf Prozent sind die klinische Marke, die die Literatur
     benutzt, und zehn Kilo bedeuten in verschiedenen Körpern
     Verschiedenes. */
  pct: 'Prozent abgenommen',
  pctDesc: (a: number) => `${a}% des Startgewichts`,
  pctFalta: (r: string) => `Noch ${r} Punkte`,

  pesagens: 'Wiegungen',
  pesagensDesc: (a: number) => `${p(a, 'Wiegung', 'Wiegungen')} eingetragen`,
  pesagensFalta: (r: number) => `Noch ${p(r, 'Wiegung', 'Wiegungen')}`,

  /* ---------------- Beständigkeit ---------------- */
  checkins: 'Check-ins',
  checkinsDesc: (a: number) => `${p(a, 'Tag', 'Tage')} mit Check-in`,
  checkinsFalta: (r: number) => `Noch ${p(r, 'Tag', 'Tage')}`,

  /* „Check-ins“ ist einer der wenigen deutschen Plurale auf -s, und zwar
     weil es ein Fremdwort ist. Der Standard, den es nicht gibt. */
  sequencia: 'Tage in Folge',
  sequenciaDesc: (a: number) => `${p(a, 'Check-in', 'Check-ins')} in Folge`,
  sequenciaFalta: (r: number, alvo: number) => `Noch ${p(r, 'Tag', 'Tage')} bis ${alvo}`,

  /* ---------------- Trinken ---------------- */
  aguaDias: 'Tage am Trinkziel',
  aguaDiasDesc: (a: number) => `${p(a, 'Tag', 'Tage')} mit erfülltem Trinkziel`,
  aguaDiasFalta: (r: number) => `Noch ${p(r, 'Tag', 'Tage')}`,

  aguaSemana: 'Woche am Trinkziel',
  aguaSemanaDesc: (a: number) => `${p(a, 'Tag', 'Tage')} am Ziel, in derselben Woche`,
  aguaSemanaFalta: (r: number, alvo: number) => `Noch ${p(r, 'Tag', 'Tage')} bis ${alvo}`,

  /* ---------------- Eiweiß ---------------- */
  protDias: 'Tage am Eiweißziel',
  protDiasDesc: (a: number) => `${p(a, 'Tag', 'Tage')} mit erfülltem Eiweißziel`,
  protDiasFalta: (r: number) => `Noch ${p(r, 'Tag', 'Tage')}`,

  protSeq: 'Eiweiß in Folge',
  protSeqDesc: (a: number) => `${p(a, 'Tag', 'Tage')} in Folge am Ziel`,
  protSeqFalta: (r: number, alvo: number) => `Noch ${p(r, 'Tag', 'Tage')} bis ${alvo}`,

  /* ---------------- Bewegung ---------------- */
  treinos: 'Einheiten',
  treinosDesc: (a: number) => `${p(a, 'Einheit', 'Einheiten')} eingetragen`,
  treinosFalta: (r: number) => `Noch ${p(r, 'Einheit', 'Einheiten')}`,

  exercSemana: 'Aktive Woche',
  exercSemanaDesc: (a: number) => `${p(a, 'Tag', 'Tage')} am Bewegungsziel, in derselben Woche`,
  exercSemanaFalta: (r: number, alvo: number) => `Noch ${p(r, 'Tag', 'Tage')} bis ${alvo}`,

  /* ---------------- Essen ---------------- */
  refeicoes: 'Mahlzeiten',
  /* „Teller“ im Plural ist „Teller“. Genau der Fall, für den es keinen
     Standard geben kann. */
  refeicoesDesc: (a: number) => `${p(a, 'Mahlzeit', 'Mahlzeiten')} eingetragen`,
  refeicoesFalta: (r: number) => `Noch ${p(r, 'Mahlzeit', 'Mahlzeiten')}`,

  favoritos: 'Lieblingsgerichte',
  favoritosDesc: (a: number) => `${p(a, 'Teller', 'Teller')} zum Wiederholen abgelegt`,
  favoritosFalta: (r: number) => `Noch ${p(r, 'Teller', 'Teller')}`,

  /* ---------------- Begleitung ---------------- */
  medidas: 'Körpermaße',
  medidasDesc: (a: number) => `${p(a, 'Messung', 'Messungen')} eingetragen`,
  medidasFalta: (r: number) => `Noch ${p(r, 'Messung', 'Messungen')}`,

  /* ⚠️ KEINE EINHEIT IM TITEL, aus demselben Grund wie beim Gewicht. */
  cintura: 'Taille',
  cinturaDesc: (comp: string) => `${comp} weniger an der Taille`,
  cinturaFalta: (comp: string) => `Noch ${comp}`,

  exames: 'Befunde',
  examesDesc: (a: number) => `${p(a, 'Befund', 'Befunde')} eingelesen`,
  examesFalta: (r: number) => `Noch ${p(r, 'Befund', 'Befunde')}`,

  consultas: 'Termine',
  consultasDesc: (a: number) => `${p(a, 'Termin', 'Termine')} im Verlauf`,
  consultasFalta: (r: number) => `Noch ${p(r, 'Termin', 'Termine')}`,

  /* Der Meilenstein im Zeitstrahl: der Pfad und auf welcher Stufe er war. */
  marco: (titulo: string, nivel: number) => `${titulo} · Stufe ${nivel}`,
  tela: {
    titulo: 'Erfolge',
    lead: 'Marken, die von selbst aus dem entstehen, was du eingetragen hast — hier entscheidet niemand, ob du sie verdienst.',

    nivelDeTotal: (nivel: number, total: number) => `Stufe ${nivel} von ${total}`,
    niveisTotal: (total: number) => `${total} ${total === 1 ? 'Stufe' : 'Stufen'}`,
    trilhaCompleta: 'Weg abgeschlossen',

    todas: 'Alle',
    checkinsNoMes: 'Check-ins im Monat',
    niveis: 'Stufen',
    diasDeJornada: 'Tage unterwegs',

    conquistadas: 'Erreicht',
    nenhumaAinda: 'Noch keiner',
    nenhumaAindaTexto: 'Die, die unterwegs sind, stehen gleich darunter.',
    ossoDaRegra: 'Die Stufen entstehen aus deinen Einträgen. Verschwindet ein Eintrag, verschwindet die Stufe mit, die er geschlossen hat.',
    aCaminho: 'Unterwegs',
  },
};
