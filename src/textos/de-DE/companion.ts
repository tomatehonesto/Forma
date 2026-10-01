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
    desdeOComeco: 'Ich kenne deinen Weg von Anfang an.',
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
      vazioSemRegistroTexto: 'Lektüren erscheinen, wenn etwas in deinen Einträgen eine verlangt. Mit deinen ersten Check-ins tauchen sie hier auf.',
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
    proximasAcoesNota: 'In der Reihenfolge, in der sie anstehen. Vorschläge für den Alltag — über Dosis und Medikament entscheidet, wer dich begleitet.',

    resumos: 'Übersichten',
    resumosNota: 'Aus deinen Einträgen erstellt, zum Lesen und zum Mitnehmen zum Termin.',
    disponivelDepois: 'verfügbar nach deinen ersten Einträgen',

    resumoDaSemana: 'Wochenrückblick',
    resumoDaSemanaPronto: (periodo: string): string => `fertig · ${periodo}`,
    resumoDaSemanaToda: 'jeden Montag ein Blick auf deine Woche',
    resumoDaSemanaDesligado: 'ausgeschaltet',
    documento: 'Übersicht für den Termin',
    documentoSub: 'ein Dokument mit dem ganzen Verlauf',
  },
  telaConversa: {
    ola: (nome: string) => `Hallo, ${nome}`,
    ouvindo: 'Ich höre zu…',
    escrevaOuFale: 'Schreib oder sprich',
    pergunte: 'Frag zu deinem Weg',
    novaConversa: 'Neues Gespräch',
    assuntoApetite: 'Appetit',
    assuntoTratamento: 'Behandlung',
    assuntoSintomas: 'Symptome',
    assuntoExames: 'Laborwerte',
    assuntoProgresso: 'Fortschritt',
    assuntoConsulta: 'Termin',
    assuntoComeco: 'Erste Schritte',
    menu: 'Gespräche und neues Gespräch',
    fechar: 'Schließen',
    irEvolucao: 'Deine Wiegungen ansehen',
    irSintomas: 'Deine Symptome ansehen',
    irAplicacoes: 'Deine Anwendungen ansehen',
    irAlimentacao: 'Deine Ernährung ansehen',
    irAgua: 'Das heutige Wasser ansehen',
    irExames: 'Deine Laborwerte ansehen',
    irResumo: 'Zusammenfassung für den Termin öffnen',
    irCheckin: 'Heutigen Check-in machen',
    copiar: 'Kopieren',
    copiado: 'Kopiert',
    levarCurto: 'Für den Termin merken',
    dataHoje: 'Heute',
    dataOntem: 'Gestern',
    fecharMenu: 'Menü schließen',
    compartilhar: 'Teilen',
    /* a folha da seleção nativa (app/selecionar-texto) */
    selecionarTitulo: 'Text auswählen',
    /* o 👍 e o 👎 da resposta, e a folha do 👎 (app/avaliar-resposta) */
    curtir: 'Hilfreiche Antwort',
    naoCurtir: 'Nicht hilfreich',
    obrigadoNota: 'Danke für die Bewertung',
    avaliarTitulo: 'Was hat nicht geholfen?',
    motivos: { errada: 'Falsche Information', 'nao-respondeu': 'Hat meine Frage nicht beantwortet', tom: 'Die Art, wie es gesagt wurde', arriscada: 'Wirkte riskant', outro: 'Etwas anderes' } as Record<string, string>,
    avaliarAviso: 'Damit wir besser werden, gehen deine Frage und diese Antwort an uns. Sonst nichts aus dem Gespräch oder deinen Einträgen. Wir bewahren sie bis zu 12 Monate auf.',
    avaliarEnviar: 'Senden',
    avaliarCancelar: 'Nicht jetzt',
    avaliado: 'Gesendet, danke',
    avaliarFalhou: 'Senden geht gerade nicht. Versuch es später noch einmal.',
    avaliarSemConta: 'Melde dich in deinem Konto an, um eine Antwort zu bewerten.',
    levarConsulta: 'Frage für den Termin merken',
    naPauta: 'Für den Termin notiert',
    historico: 'Frühere Gespräche',
    historicoTitulo: 'Gespräche',
    grupoHoje: 'Heute',
    grupoSemana: 'Letzte 7 Tage',
    grupoAntes: 'Früher',
    mensagens: (n: number): string => (n === 1 ? '1 Nachricht' : `${n} Nachrichten`),
    apagar: 'Löschen',
    apagarPergunta: 'Dieses Gespräch vom Handy löschen?',
    cancelar: 'Abbrechen',
    historicoVazio: 'Deine Gespräche mit Morphi Intelligence werden hier gespeichert, auf deinem Handy.',
    aceiteTitulo: 'Bevor wir anfangen',
    aceitePergunta: 'Darf Morphi Intelligence deine Gesundheitsdaten ansehen, um dir zu helfen?',
    termosTitulo: 'Nutzungsbedingungen',
    termosResumo: 'Was sie tut, was sie liest, wohin es geht und die Grenzen',
    aceite1Titulo: 'Was sie tut',
    aceite1: 'Sie beantwortet deine Fragen, schreibt jeden Montag einen Rückblick auf deine Woche, liest die Fotos deiner Mahlzeiten und die Laborbefunde, die du schickst, und schätzt Gerichte anhand des Namens.',
    aceite2Titulo: 'Was sie liest',
    aceite2: 'Medikament, Gewicht, Symptome, Mahlzeiten, Wasser, Bewegung und Laborwerte, dazu das Foto oder den Befund, wenn du ihn schickst. Dein vollständiger Name, deine E-Mail und der Name deines Behandlungsteams bleiben außen vor.',
    aceite3Titulo: 'Wohin es geht',
    aceite3: 'Es geht an unseren Server und an Anthropic, das Unternehmen, das die Technologie liefert, in den USA, nur um die Antwort zu erstellen. Dort wird nichts gespeichert, und die Daten werden nicht zum Training von Modellen verwendet.',
    aceite4Titulo: 'Die Grenzen',
    aceite4: 'Morphi Intelligence kann sich irren und ersetzt dein Behandlungsteam nicht. Dosis und Medikament immer mit deinem Team. Den Wochenrückblick schaltest du im Rückblick selbst aus.',
    politica: 'Datenschutzerklärung lesen',
    aceitar: 'Erlauben',
    recusar: 'Jetzt nicht',
    aceiteRodape: 'Ohne deine Erlaubnis bleiben die KI-Funktionen aus. Du kannst sie jederzeit erlauben.',
    semServidor: 'Das Gespräch ist auf diesem Gerät noch nicht eingeschaltet.',
    semRede: 'Ich konnte gerade nicht antworten — die Verbindung ist fehlgeschlagen. Versuch es gleich noch einmal.',
    semConta: 'Um mit mir zu sprechen, melde dich in deinem Konto an.',
    limiteDoDia: 'Du hast das heutige Fragenlimit erreicht. Morgen antworte ich wieder.',
    limiteDoMes: 'Du hast das Limit von 100 Fragen in 30 Tagen erreicht. Sie kommen nach und nach zurück, sobald die ältesten Tage aus der Zählung fallen.',
    restam: (n: number): string => (n === 1 ? 'Heute noch 1 Frage' : `Heute noch ${n} Fragen`),
  },
};
