/* ============================================================
   DIE BETREUUNG — der Bereich der Menschen · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/cuidado.ts. Die Regel für die ganze
   Datei ist härter als in den anderen:

   ⚠️⚠️ KEIN SATZ VON HIER DARF BEHAUPTEN, WAS DAS TEAM GETAN HAT, OHNE ES
   ZU WISSEN. „Dein Team hat deine Behandlung angepasst“ stimmt nur, wenn
   es eine Plattform gibt — sie bringt die neue Anweisung. Ohne Server
   weiß die App, dass der Termin stattgefunden hat, weil die Person es
   gesagt hat, und sonst nichts. Deshalb hat fast jedes Satzpaar hier eine
   Fassung mit Plattform und eine ohne, und sie sind keine Tonvarianten:
   der Unterschied ist eine Tatsachenbehauptung.

   ⚠️ UND DIE SCHLAGZEILE BENOTET NICHT. Die Pastille oben sagte „Gute
   Therapietreue“, „Regelmäßige Therapietreue“ oder „Niedrige
   Therapietreue“ — und die dritte erschien bei allen, die zwei Dosen
   verpasst hatten, und verpasst hatte sie fast immer, wer sich schlecht
   fühlte. Eine Folge der Behandlung wurde zur Note über die Person, an
   der ersten Stelle, auf die das Auge fällt. Heute steht dort „8 von 11
   Dosen“, was dasselbe sagt, ohne zu urteilen, und mehr sagt: die Note
   plättete 70% und 89% in dieselbe Etikette.
   ============================================================ */

export const cuidado = {
  /* ⚠️ JEDER PUNKT HAT DREI TEXTE, und der dritte ist keine
     Zusammenfassung der anderen: `texto` ist, was zu tun ist — der Titel
     der Zeile; `sub` ist, warum jetzt; und `rotulo` ist, wie die
     SCHLAGZEILE diesen Punkt nennt, wenn sie mehrere in einem Satz
     aufzählt: „zwei Dinge warten auf dich — Rezept und Befunde“.

     „Blutabnahme vereinbaren“ ist, was man tut; für den Satz heißt das
     Thema „Befunde“. Beide gleich zu übersetzen zerstört die
     Schlagzeile. */
  pendencias: {
    mensagemUma: 'Auf die Nachricht deines Teams antworten',
    mensagemVarias: (quantas: number) => `Auf die ${quantas} Nachrichten deines Teams antworten`,
    mensagemSub: 'wartet auf deine Antwort',
    mensagemRotulo: 'Nachrichten',

    receita: 'Ein neues Rezept anfragen',
    /* Zwei Zählungen in einer Zeile, jede mit eigenem Plural: die Dosen,
       die bleiben, und die Wochen, die sie abdecken. */
    receitaSub: (doses: number, semanas: number) =>
      `${doses} ${doses === 1 ? 'Dosis übrig' : 'Dosen übrig'} · rund ${semanas} ${semanas === 1 ? 'Woche' : 'Wochen'}`,
    receitaRotulo: 'Rezept',

    /* Der Titel der Untersuchung kommt aus dem Protokoll — das hat das
       Team geschrieben, es ist kein Text von uns. Von uns ist, woher er
       kam: mit Team hat es das Team angefordert; ohne Team fordert der
       Plan selbst an, und „von deinem Team angefordert“ erfände eines. */
    exameSubDaEquipe: 'von deinem Team angefordert',
    exameSubDoProtocolo: 'aus dem Protokoll dieser Woche',
    exameRotulo: 'Befunde',

    consulta: 'Vorbereiten, was du zum Termin mitnimmst',
    consultaSub: (tipo: string, quando: string, doutor: string) =>
      `${tipo} ${quando} · bei ${doutor}`,
    consultaRotulo: 'Termin',
  },

  /* Vier Momente, und die Reihenfolge hier ist die Rangfolge zwischen
     ihnen: der nahende Termin schlägt alles, dann der Moment danach, dann
     die offenen Punkte, und die Beständigkeit in der übrigen Zeit — die
     den größten Teil ausmacht. */
  estado: {
    /* ⚠️ ES WAR DASSELBE WORT VIERMAL GESCHRIEBEN, einmal je Moment. Die
       vier Karten sind dieselbe Karte in verschiedenen Momenten, also gibt
       es nur einen Hut. */
    kicker: 'DEINE BETREUUNG',

    /* Die beiden Zählungen oben. Der Zeilenumbruch ist Absicht: Wert
       oben, Einheit unten, für den Blick im Vorbeigehen. */
    metricaSemanas: 'Wochen\nBetreuung',
    metricaAplicacoes: 'Injektionen\neingetragen',

    /* ⚠️ „DOSEN“ UND NICHT „INJEKTIONEN“: diese Pastille teilt sich die
       Zeile mit dem Puls, der „3 offene Punkte“ heißen kann, und das lange
       Wort schiebt den Puls auf zwei Zeilen. */
    adesao: (feitas: number, previstas: number) =>
      `${feitas} von ${previstas} ${previstas === 1 ? 'Dosis' : 'Dosen'}`,

    /* ---------- der nahende Termin ---------- */
    consultaTitulo: 'Dein Termin rückt näher.',
    consultaHoje: (doutor: string) =>
      `Dein Termin bei ${doutor} ist heute. Es lohnt sich, noch einmal durchzugehen, was du fragen willst.`,
    consultaFaltam: (dias: number, doutor: string) =>
      `${dias === 1 ? 'Noch 1 Tag' : `Noch ${dias} Tage`} bis zu deinem Termin bei ${doutor}.`,
    consultaPulso: (quando: string) => `Termin ${quando}`,

    /* ---------- kurz nach dem Termin ---------- */
    /* ⚠️ DIE ZWEI FASSUNGEN SIND KEINE TONFRAGE, SIE SIND EINE
       TATSACHENFRAGE. Siehe oben: ohne Plattform weiß die App nicht, was
       im Sprechzimmer entschieden wurde, und der Satz wechselt den
       Besitzer. */
    posConsultaTituloComPlataforma: 'Dein Team hat deine Behandlung angepasst.',
    posConsultaTituloSemPlataforma: 'Du hattest vor Kurzem einen Termin.',
    posConsultaTextoComPlataforma: 'Sieh dir die Hinweise aus dem Termin an und was sich ab jetzt an deiner Dosis ändert.',
    /* ⚠️ DIESER SATZ SAGTE AUF PORTUGIESISCH „DIE RECHNUNGEN DER APP“, und
       das Wort ist „aplicativo“. Er blieb unbemerkt, weil er aus einem Ast
       kommt, der nie lief: er erscheint nur für die, die in den letzten
       48 Stunden einen Termin hatten und keine Plattform haben. Gefunden
       hat ihn die Abdeckung des Einfrierens. */
    posConsultaTextoSemPlataforma: 'Wenn sich Dosis oder Abstand geändert haben, lohnt es sich, das hier nachzutragen — das hält die Rechnungen der App richtig.',
    posConsultaPulso: 'Behandlung aktualisiert',

    /* ---------- die offenen Punkte ---------- */
    /* ⚠️ „WIR HABEN EIN PAAR DINGE ZU ERLEDIGEN“ — erste Person Plural,
       und nicht „du hast offene Punkte“. Die Liste darunter hängt an ihr,
       und mit dem gezeigten Finger auf einer Gesundheitskarte zu öffnen,
       ist der falsche Anfang. */
    pendenciaTitulo: 'Wir haben ein paar Dinge zu erledigen.',
    /* ⚠️ ER NENNT, WAS ES IST, STATT ZU ZÄHLEN, WIE VIELE. „Zwei Dinge“
       zwingt zum Scrollen, um herauszufinden, ob es wichtig ist. Und die
       Namen kommen aus DERSELBEN Liste, Punkt für Punkt — als sie aus
       einer anderen Menge kamen, konnte der Satz ein Thema nennen, das die
       Liste nicht hatte. */
    pendenciaTexto: (quantas: string, plural: boolean, assuntos: string) =>
      `${quantas} ${plural ? 'Dinge warten' : 'Sache wartet'} auf dich — ${assuntos}. Nichts Dringendes, aber diese Woche lohnt es sich.`,
    pendenciaPulso: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'offener Punkt' : 'offene Punkte'}`,
    /* Bis vier ausgeschrieben, was die Obergrenze an offenen Punkten ist.

       ⚠️ UND SIE STEHEN KLEIN, weil sie mitten im Satz ankommen: „Zwei
       Dinge warten auf dich“ bekommt die Großschreibung vom Satzanfang,
       den der Bildschirm setzt — hier wäre sie doppelt. */
    porExtenso: ['keine', 'eine', 'zwei', 'drei', 'vier'],

    /* ---------- die übrige Zeit ---------- */
    emDiaTitulo: 'Deine Betreuung ist auf Stand.',
    /* ⚠️ DIE ZWEITE FASSUNG GIBT ES, WEIL DER SATZ MIT DEM NAMEN DER
       ÄRZTIN BEGANN. Ohne jemanden Eingetragenen öffnete er mit einem
       Leerzeichen: „ begleitet deine Behandlung seit 10 Wochen“. Wer die
       Behandlung allein führt, führt sie genauso lange. */
    emDiaComQuem: (quem: string, semanas: number) =>
      `${quem} begleitet deine Behandlung seit ${semanas} Wochen. Du bist gut dabei, und im Moment steht nichts Wichtiges offen.`,
    emDiaSozinha: (semanas: number) =>
      `Du bist seit ${semanas} Wochen in Behandlung, bist gut dabei, und im Moment steht nichts Wichtiges offen.`,
    emDiaPulso: 'Betreuung auf Stand',
  },

  /* ============================================================
     DER ZUSAMMENHANG DER DOSIS — die drei kurzen Sätze
     ============================================================ */
  dose: {
    aplicacaoHoje: 'Injektion heute',
    proximaAplicacao: (quando: string) => `Nächste Injektion ${quando}`,
    nestaDoseHa: (semanas: number) =>
      `Bei dieser Dosis seit ${semanas} ${semanas === 1 ? 'Woche' : 'Wochen'}`,
    /* `quando` kommt schon als „in 9 Tagen“ / „morgen“ an, mit der
       Präposition darin — deshalb setzt der Satz keine zweite. */
    revisaoNaConsulta: (quando: string) => `Überprüfung beim Termin ${quando}`,
    revisaoHoje: 'heute',
  },

  /* ============================================================
     DAS TEAM UND DIE PRAXIS
     ============================================================ */
  equipe: {
    /* Die Rolle derer, deren Fachrichtung nicht notiert ist. Nicht
       „Ärztin“ oder „Arzt“: es muss keines von beiden sein, und die App
       weiß es nicht. Was sie weiß, ist die Funktion — und die Funktion
       hat kein Geschlecht. */
    responsavelPadrao: 'Verantwortlich für die Behandlung',
  },

  /* ⚠️ JEDE ZEILE EXISTIERT NUR MIT IHREM DATUM. „Telefon —“ in einer
     Kontaktliste ist der Bildschirm, der einen Kanal verspricht, den es
     nicht gibt. Und die Reihenfolge geht vom schnellsten Kanal zum
     förmlichsten. */
  contato: {
    whatsapp: 'WhatsApp',
    whatsappSub: 'Mit der Praxis sprechen',
    telefone: 'Telefon',
    site: 'Website',
    email: 'E-Mail',
    instagram: 'Instagram',
  },

  tela: {
    paraAConsulta: (quando: string) => `FÜR DEN TERMIN ${quando}`,
    resumoPronto: 'Deine Übersicht ist schon fertig',
    vouPreparar: 'Ich stelle deine Übersicht zusammen',

    linhaDoPlano: (previstas: number, temHorizonte: boolean): [string, string, string] => [
      'Woche ',
      temHorizonte ? ` von ${previstas} bis zu deinem Ziel · ` : ' deiner Behandlung · ',
      ' mit Injektion nach Plan',
    ],

    ultimaOrientacao: 'LETZTER HINWEIS',
    voceEscreveu: 'DU HAST GESCHRIEBEN',
    naoLida: 'ungelesen',
    responder: 'Antworten',
    enviarPrimeira: 'Die erste Nachricht senden',

    precisaDeVoce: 'Braucht dich',
    nadaPrecisa: 'Gerade braucht dich nichts.',
    emDia: 'Deine Begleitung ist auf dem Stand.',

    proximaConsulta: 'Dein nächster Termin',
    consultasLink: 'Termine',
    anotarConsulta: 'Einen Termin eintragen',
    anotarConsultaSub: 'Mit dem Datum hier ist die Übersicht fertig, und wir sagen dir Bescheid, wenn er näher rückt.',
    eQuando: (quando: string) => `Er ist ${quando}`,
    preparoTexto: 'Ich stelle eine Übersicht mit Gewicht, Therapietreue und Symptomen des Zeitraums zusammen — du wählst, was du fragen willst.',
    prepararAConsulta: 'Den Termin vorbereiten',

    seuTratamento: 'Deine Behandlung',
    aplicacoesLink: 'Injektionen',
    dosesEm: (onde: string) => `Dosen ${onde}`,
    restamDe: (restam: number, total: number, semanas: number) =>
      `${restam} von ${total} · etwa ${semanas} ${semanas === 1 ? 'Woche' : 'Wochen'}`,
    pedirRenovacao: 'Rezept anfragen',

    exames: 'Befunde',
    marcadoresAcompanhados: (quantos: number) =>
      `${quantos} Marker verfolgt`,
    nenhumResultado: 'Kein Ergebnis gespeichert',
    importeUmExame: 'Lies einen Befund ein, um ihn zu verfolgen',
    foraDaReferencia: (quantos: number) => `${quantos} außerhalb der Referenz`,
    todosNaReferencia: 'Alle innerhalb der Referenz',

    quemAcompanha: 'Wer deine Behandlung begleitet',
    ninguemRegistrado: 'Noch niemand eingetragen',
    seVoceSeTrata: 'Wenn dich jemand behandelt, trag ihn hier ein — die Übersicht kommt fertig für den Termin heraus.',

    acompanhamentoProfissional: 'Ärztliche Begleitung',
    conhecaParceiros: 'Die Partnerärztinnen und -ärzte kennenlernen',
    parceirosTexto: 'Manche Praxen begleiten die Behandlung hier gemeinsam mit dir — Nachrichten zwischen den Terminen, deine Übersicht, die beim Team ankommt, und der Kalender schon gefüllt.',
    passouATer: 'Hast du jetzt eine ärztliche Begleitung?',
    anoteQuemE: 'Trag ein, wer es ist.',
  },

  /* ⚠️ DER PLATZHALTER DER FACHRICHTUNG IST DAS FACH, nicht die Person.
     „Endokrinologin oder Endokrinologe“ wäre die Doppelnennung, die dieser
     Katalog sonst verlangt — in einem Platzhalter ist sie länger als das
     Feld und länger als die Frage. „Endokrinologie“ beantwortet die Frage
     „Fachrichtung“ genauer und kommt ohne Geschlecht aus. */
  telaAcompanhamento: {
    leadComVinculo: 'Diese Angaben kommen aus der Praxis, die deine Behandlung begleitet.',
    ondeAtendida: 'Wo die Termine stattfinden',
    quemCorrige: 'Korrigieren tut die Praxis',
    quemCorrigeTexto: 'Wenn etwas falsch ist, sprich mit dem Team — es führt diese Angaben, und was dort korrigiert wird, kommt hier an.',

    lead: 'Wenn dich jemand behandelt, trag ihn hier ein. Das ist es, was die Übersicht fertig für den Termin herauskommen lässt und die Vorbereitung der Fragen zur richtigen Zeit erscheinen lässt.',

    nome: 'Name',
    nomeAjuda: 'Wie du diese Person nennst. Es kann auch der Name der Praxis sein, wenn dir das lieber ist.',
    nomePlaceholder: 'Den Namen eintippen',
    especialidade: 'Fachrichtung',
    opcional: 'Optional.',
    especialidadePlaceholder: 'Endokrinologie',
    ondeAtende: 'Wo behandelt wird',
    ondeAtendeAjuda: 'Optional — Praxis, Klinik oder Sprechstunde.',
    ondeAtendePlaceholder: 'Praxis oder Klinik eintippen',

    nadaEnviado: 'Nichts davon wird an jemanden geschickt',
    nadaEnviadoTexto: 'Der Name bleibt in der App, bei dir. Damit dein Team deine Daten bekommt, braucht es einen Einladungscode der Praxis — und von da an führt sie diese Angaben.',
    salvar: 'Speichern',

    naoTenhoMais: 'Ich habe keine Begleitung mehr',
    tirarPergunta: 'Die Begleitung entfernen?',
    tirarTexto: 'Alle deine Einträge bleiben hier — Gewicht, Injektionen, Symptome, Befunde und Notizen. Weg geht nur der Name.',
    simTirar: 'Ja, entfernen',
    cancelar: 'Abbrechen',
  },
};
