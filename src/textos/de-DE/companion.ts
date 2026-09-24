/* ============================================================
   DER COMPANION — sein Gedächtnis und die Bibliothek, die er vorschlägt · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/companion.ts. Die zwei, die bestimmen:

   DAS GEDÄCHTNIS SPRICHT VON ANWESENHEIT, NICHT VON MENGE. Die Zeile
   zählte auf, was er gelesen hatte — „ich habe deine Check-ins, 11
   Injektionen, 15 Befunde berücksichtigt“ —, und Aufzählen beweist die
   Fähigkeit zu zählen, nicht zu kennen. Was Vertrauen baut, ist,
   über die Zeit dabei gewesen zu sein.

   UND DIE BIBLIOTHEK IST KEIN KATALOG. Jeder Text kommt herein, weil
   etwas im Zustand der Person ihn gerufen hat, und der Grund steht auf
   der Karte. Inhalt ohne sichtbaren Grund wird zum Blog. Daher die DREI
   Stücke, die nicht austauschbar sind: `motivo` sagt, warum das HEUTE
   erscheint, mit ihrer Zahl darin; `titulo` sagt, was der Text lehrt;
   `desc` sagt, was er löst, und das ist nicht dasselbe.
   ============================================================ */

export const companion = {
  memoria: {
    desdeAPrimeira: (dias: number) =>
      `Ich begleite deine Behandlung seit der ersten Dosis vor ${dias} Tagen.`,
    desdeOPrimeiroDiaComSemanas: (semanas: number) =>
      `Ich kenne deinen Weg vom ersten Tag an — ${semanas} Wochen bis hierher.`,
    desdeOPrimeiroDia: 'Ich kenne deinen Weg vom ersten Tag an.',
    dosesAtras: (doses: number) =>
      `Ich bin seit der ersten Dosis bei dir, ${doses} Dosen ist das her.`,
  },

  biblioteca: {

    /* ⚠️⚠️ DER BILDSCHIRM ZEIGTE VIER ERFUNDENE ARTIKEL, fest in die
       Bildschirmdatei geschrieben, während die echte Bibliothek direkt
       darüber stand — in fünf Sprachen übersetzt — und `libraryPicks` sie
       aus dem Zustand der Person zusammenbaute. Niemand rief die Funktion
       auf. Siehe ../pt-BR/companion. */
    tela: {
      titulo: 'Bibliothek',
      sub: 'Die passende Lektüre für deinen Moment — und keine Artikelliste',
      minDeLeitura: (min: number) => `${min} Min. Lesezeit`,
      vazioTitulo: 'Gerade nichts zu lesen',
      vazioTexto: 'Lektüren erscheinen, wenn etwas in deinen Einträgen eine verlangt. Ohne das gibt es nichts zu lesen — und das ist eine gute Nachricht.',
    },
    fomeMotivo: (dia: number) => `Du bist an Tag ${dia} des Zyklus, wenn der Hunger zurückkommt`,
    fomeTitulo: 'Warum der Hunger vor der Injektion zurückkommt',
    /* ⚠️ „NIMMT DAS GEFÜHL EINES RÜCKFALLS“ ist der Dienst dieses Textes
       und der Grund seiner Existenz: der Hunger, der am fünften Tag
       zurückkommt, ist die Stelle, an der Leute schließen, sie hätten
       versagt. */
    fomeDesc: (molecula: string) =>
      `Der ${molecula}-Spiegel sinkt über die Woche, und die Sättigung sinkt mit. Die Kurve zu verstehen nimmt das Gefühl eines Rückfalls.`,

    primeirosMotivo: (dias: number) => `Du hast vor ${dias} ${dias === 1 ? 'Tag' : 'Tagen'} gespritzt`,
    primeirosTitulo: 'Die ersten Tage nach der Dosis',
    primeirosDesc: 'Was im 48-Stunden-Fenster zu spüren normal ist, und was schon eine Nachricht an dein Team verdient.',

    enjooMotivo: (dias: number) => `Du hast an ${dias} der letzten 7 Tage Übelkeit notiert`,
    /* ⚠️ „BEKÄMPFEN“ WÄRE DAS FALSCHE VERB, und der ganze Titel hängt
       daran: wer Übelkeit hat, braucht keinen Willen zum Essen, sie
       braucht Essen, das runtergeht. */
    enjooTitulo: 'Essen, ohne gegen die Übelkeit anzukommen',
    enjooDesc: 'Kombinationen und Uhrzeiten, die an den Tagen besser gehen, an denen Essen zu viel scheint.',

    proteinaMotivo: (gramas: number) => `Es fehlen ${gramas} g, damit dein Schnitt das Ziel erreicht`,
    proteinaTitulo: 'Eiweiß, ohne mehr zu kochen',
    proteinaDesc: 'Wie du das Ziel mit dem erreichst, was ohnehin im Kühlschrank steht — das Problem ist selten das Rezept, es ist die Machbarkeit.',

    sonoMotivo: (horas: string) => `Dein Schlafschnitt liegt bei ${horas} Std.`,
    sonoTitulo: 'Schlaf als Teil der Behandlung',
    sonoDesc: 'Wenig zu schlafen verändert am nächsten Tag die Hungerhormone — in deinen eigenen Aufzeichnungen ist das schon zu sehen.',

    plateauMotivo: (semana: number, perdido: string) => `Woche ${semana}, mit ${perdido} im Zeitraum`,
    plateauTitulo: 'Was sich nach dem dritten Monat ändert',
    /* ⚠️ „DAS IST PHYSIOLOGIE, KEIN VERSAGEN“ ist dieselbe Verteidigung,
       die die Plateau-Karte führt, und sie muss auch hier stehen: an
       diesem Punkt der Behandlung hören Leute auf. */
    plateauDesc: 'Die Abnahme wird langsamer, und das ist Physiologie, kein Versagen. Was von jetzt an mehr zählt als die Waage.',

    consultaMotivo: (dias: number) => `Dein Termin ist in ${dias} Tagen`,
    consultaTitulo: 'Wie du mehr aus deinem Termin machst',
    consultaDesc: 'Was mitnehmen, was fragen, und wie die automatische Übersicht die ersten zehn Minuten spart.',
  },

  telaInsights: {
    ola: (nome: string) => `Hallo, ${nome}`,
    pergunta: 'Was möchtest du\nheute verstehen?',
    escreva: 'Schreib deine Frage...',

    descobertaDaSemana: 'DER FUND DER WOCHE',
    entenderMelhor: 'Besser verstehen',

    oQueMaisPercebi: 'Was mir sonst aufgefallen ist',
    oQueMaisPercebiNota: 'Weitere Beobachtungen aus deinen Einträgen.',
    verTodas: (quantas: number) => `Alle Beobachtungen ansehen (${quantas})`,

    observamos: 'WAS WIR BEOBACHTET HABEN',
    hojeDeCem: 'heute, von 100',

    proximasAcoes: 'Nächste Schritte',
    proximasAcoesNota: 'In der Reihenfolge, in der sie anstehen — nichts zu Dosis oder Protokoll.',

    resumos: 'Übersichten erstellen',
    resumosNota: 'Deine Daten geordnet, um sie jemandem mitzubringen.',

    resumoDaSemana: 'Übersicht der Woche',
    resumoDaSemanaSub: (semana: number, checkins: number, peso: string) =>
      `Woche ${semana} · ${checkins} ${checkins === 1 ? 'Check-in' : 'Check-ins'}, ${peso}`,
    preparoDaConsulta: 'Vorbereitung auf den Termin',
    preparoDaConsultaSub: 'Gewicht, Therapietreue, Symptome und Fragen',
    preparoSemEquipe: 'bereit zum Teilen',
    documento: 'Übersicht für den Termin',
    documentoSub: 'ein Dokument mit dem ganzen Verlauf',
  },
};
