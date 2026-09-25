/* ============================================================
   DAS ABO — was gerade gilt, was es kostet, wo man daran rührt · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/assinatura.ts. Zwei bestimmen:

   ES IST EIN EINZIGER BILDSCHIRM MIT EINER EINZIGEN ETIKETTE. Wer Patient
   einer Partnerpraxis ist, liest „Ohne Kosten“ AN DERSELBEN STELLE, an
   der ein Abonnent „29,99 €“ liest — der Vergleich ist unmittelbar, weil
   der Platz derselbe ist. Eine Sprache, die für den befreiten Fall einen
   längeren Satz erfände, zerstörte die Gestaltung.

   ⚠️ UND DER TEXT DER BEFREIUNG STAMMT AUS ABSCHNITT 4 DER BEDINGUNGEN.
   Das ist kein Bildschirmsatz: es ist die Zusage, die das Dokument macht,
   wiederholt, wo sie zählt. Laufen die beiden auseinander, wird eines zur
   falschen Fassung für alle, die das andere gelesen haben — und recht hat
   das Dokument. Siehe logic/documentos.

   ⚠️ WAS NICHT HIER IST, UND ZWAR ABSICHTLICH: „Care“ und „Personal“ sind
   die Namen unserer Angebote und werden nicht übersetzt; „App Store“ und
   „Google Play“ sind Marken; die Entwicklungs-Abkürzungen verschwinden
   beim Kompilieren.
   ============================================================ */

export const assinatura = {
  /* ⚠️ DAS SUFFIX IST KEIN SCHLÜSSEL. Zwei Bildschirme fragten
     `p.sufixo === '/mês'`, um zu wissen, welches das monatliche Angebot
     war — ein Textvergleich, der die Arbeit eines Bezeichners tat. Auf
     Englisch wird das Suffix „/mo“, der Vergleich schlug stumm fehl, und
     der Preisbildschirm nannte plötzlich das Doppelte. Wer fragt, welches
     Angebot es ist, fragt nach der `id`. */
  mensal: 'Monatlich',
  anual: 'Jährlich',
  porAno: 'pro Jahr',
  porAnoCurto: '/Jahr',

  /* ⚠️ EIN EINZIGER SCHLÜSSEL für den Titel des Bildschirms und die
     Beschriftung der Karte. Es ist dasselbe Thema, an derselben Stelle
     gesagt, und sie in zwei Schlüssel zu trennen heißt, sie einzuladen,
     auseinanderzulaufen. */
  titulo: 'Dein Abo',

  semCusto: 'Ohne Kosten',

  /* Wenn wir den Namen der Praxis nicht kennen. Sie kommt mitten in einen
     Satz, daher die Kleinschreibung des Artikels — das Substantiv bleibt
     groß, weil Deutsch das so macht. */
  clinicaGenerica: 'die Praxis, die dich behandelt',
  cobertoPelaClinica: (clinica: string) => `Die Verbindung mit ${clinica} deckt die ganze App ab.`,

  /* Das Datenblatt: Bezeichnung links, Wert rechts. */
  vinculadaDesde: 'Verbindung aktiv seit',
  codigoDeConvite: 'Einladungscode',
  periodicidade: 'Abrechnung',
  primeiraCobranca: 'Erste Abbuchung',
  proximaCobranca: 'Nächste Abbuchung',
  cobrancaPela: 'Abbuchung über',
  naoHa: 'Keine',

  /* ⚠️ „DU HAST ALLES, SO WIE ES IST“ STEHT VOR DEM PREIS, und die
     Reihenfolge ist die Botschaft: wer diesen Bildschirm ohne Abo
     geöffnet hat, zahlt nichts, und das zu erfahren darf nicht davon
     abhängen, den zweiten Halbsatz zu lesen. */
  semPlano: (menorPorMes: string) => `Du hast alles, so wie es ist. Die Angebote beginnen bei ${menorPorMes} pro Monat.`,

  /* Die Aktionen. Ohne Untertitel, weil keine davon eine Folge hat —
     jede öffnet einen Bildschirm, und in einer Aktionsliste zahlt sich
     der Untertitel nur aus, wenn er vor etwas warnt, das sich nicht
     rückgängig machen lässt. */
  mudarDePlano: 'Angebot wechseln',
  verOsPlanos: 'Angebote ansehen',
  formaDePagamento: 'Zahlungsart',
  historicoDeCobranca: 'Rechnungsverlauf',

  trocarClinica: 'Die Praxis wechseln, die dich behandelt',

  /* ⚠️ DIESE BEIDEN HABEN EINEN UNTERTITEL, und zwar aus dem
     umgekehrten Grund der anderen: wer zahlt und einen Code einer
     Partnerpraxis eingibt, HÖRT AUF zu zahlen. Das ist die größte Folge
     des Bildschirms, und sie lässt sich aus einer Beschriftung, die
     „Code eingeben“ sagt, nicht erraten. */
  inserirCodigo: 'Code eingeben',
  inserirCodigoSub: 'Wer in einer Partnerpraxis behandelt wird, zahlt für die App nichts',
  medicosParceiros: 'Partnerpraxen',
  medicosParceirosSub: 'Wer in einer Partnerpraxis behandelt wird, zahlt nicht',

  cancelar: 'Abo kündigen',

  /* ⚠️ DER TITEL IST NICHT IN ALLEN DREI DERSELBE. „Gut zu wissen“ dient
     dem Hinweis, der nur Information ist; der, der vor Geld warnt, das
     umsonst abfließt, muss das im Titel sagen, sonst wird er zur Fußnote
     mit dem Gesicht einer Fußnote. */
  pagandoTitulo: 'Du zahlst, obwohl es nicht nötig ist',
  pagandoTexto: (loja: string) => `Die Verbindung mit der Praxis deckt die App schon ab, aber im ${loja} läuft ein Abo — kündige es dort, und für dich ändert sich nichts.`,

  /* ⚠️⚠️ ER SAGT, WER UNS BESCHEID GIBT, und danach, was passiert.

     „Wenn die Verbindung endet“ klang, als merkten wir es allein, und das
     tun wir nicht: niemand hier weiß, dass jemand aufgehört hat, Patient
     einer Praxis zu sein. Wer es weiß, ist die Praxis, und sie teilt es
     mit.

     ⚠️⚠️ UND DIE ZEILE ZU DEN DATEN GEHT MIT, immer. Den Zugang zu einem
     Behandlungstagebuch auszusetzen heißt, jemanden vor dem eigenen
     Gewicht, den eigenen Spritzen und den eigenen Befunden
     auszusperren — und das tun wir nicht. Getrennt wird der erste Satz zu
     einer Drohung. */
  bomSaberTitulo: 'Gut zu wissen',
  bomSaberTexto: 'Falls die Partnerpraxis uns mitteilt, dass die Behandlung beendet ist, ruht der Zugang, bis du ein Personal-Angebot nimmst — und ohne deine Wahl wird nichts abgebucht. Nichts von dem, was du eingetragen hast, geht verloren: die Einträge bleiben auf dem Gerät und lassen sich jederzeit ausgeben.',

  /* ⚠️ ZU SAGEN „DU HAST KEIN ABO“, OHNE ZU SAGEN, DASS NIEMAND EINES
     ABSCHLIESSEN KANN, lässt die Person nach einem Knopf suchen, den es
     nicht gibt. Dieser verschwindet an dem Tag, an dem die Abrechnung
     angeht. */
  semCobrancaTitulo: 'Die Abrechnung ist noch nicht aktiv',
  semCobrancaTexto: 'Diesen Bildschirm gibt es, das Abo noch nicht. Dir wurde nichts abgebucht, und es wird auch nichts ohne Ankündigung abgebucht.',

  /* ============================================================
     DAS SCHAUFENSTER — /planos

     ⚠️⚠️ DER TITEL HAT EINEN GEMESSENEN ZEILENUMBRUCH, KEINEN GEWÄHLTEN.
     Auf einem Telefon von 375 pt bleiben 335 px Zeile. Gemessen im Grad
     31: Portugiesisch verlangt 321 und 323 px, Französisch 317 und 251.
     Deutsch baut längere Wörter, und genau deshalb ist dieser Titel kurz
     gehalten — wer ihn verlängert, misst nach oder bricht den Knopf.
     ============================================================ */
  vitrine: {
    titulo: 'Alles ändert sich, wenn\ndu ',
    tituloDestaque: 'wirklich hinsiehst.',
    lead: 'Deine Daten an einem Ort, deine Entwicklung geordnet, und Klarheit in jeder Etappe der Behandlung.',

    /* Die vier Argumente. Jedes ist, was die App TUT, und kein Adjektiv
       über sie. */
    umLugarTitulo: 'Deine Behandlung an einem Ort',
    umLugarTexto: 'Alles ist geordnet, damit du deinen Weg verfolgen kannst.',
    numerosTitulo: 'Deine Zahlen gedeutet',
    numerosTexto: 'Aus deinen Daten wird eine Information, die Sinn ergibt.',
    evolucaoTitulo: 'Eine Entwicklung, die du sehen kannst',
    evolucaoTexto: 'Gewicht, Maße, Beschwerden, Befunde und Einträge über die Zeit.',
    assistenteTitulo: 'Ein Assistent für den Alltag',
    assistenteTexto: 'Frag, trag ein, und versteh deinen Weg besser.',

    comecarTeste: (dias: number) => `Die ${dias} Gratis-Tage starten`,
    assinarPor: (preco: string) => `Abonnieren — ${preco}`,

    /* ⚠️ „JEDERZEIT KÜNDBAR“ GILT FÜR BEIDE ANGEBOTE, und stimmt bei
       beiden. Das Zweite ändert sich: „ohne Bindung“ beruhigt, wer drei
       Tage ausprobieren will; für die, die ein ganzes Jahr bindet, klingt
       derselbe Satz wie ein leeres Versprechen — sie hat sich GERADE
       gebunden. Was dort zu sagen lohnt, ist, was sie dafür bekommt. */
    canceleQuandoQuiser: 'Jederzeit kündbar',
    semCompromisso: 'Ohne Bindung',
    menorPreco: 'Bester Preis',

    depoisDoTeste: (dias: number, preco: string, periodo: string) =>
      `Nach ${dias} Tagen ${preco} ${periodo}. Kündige vorher, und du zahlst nichts.`,
    renovaAte: (preco: string, periodo: string) =>
      `${preco} ${periodo}, mit Verlängerung bis zu deiner Kündigung.`,

    naoPaga: 'Du zahlst nicht — der Zugang kommt aus der Verbindung',
    aindaNaoLigada: 'Das Abo ist noch nicht aktiv',
    temCodigo: 'Ich habe einen Einladungscode',
  },

  /* ============================================================
     DER AUSGANG — /cancelar

     ⚠️⚠️ DER BILDSCHIRM FRAGT, ABER ER HÄLT NICHT FEST. Wer ihn geöffnet
     hat, hat sich entschieden, und die Frage ist für uns, nicht gegen sie:
     der Knopf, der zum Store führt, bleibt unten aktiv, ohne von einer
     Antwort abzuhängen.
     ============================================================ */
  saida: {
    titulo: 'Abo kündigen',
    perguntaTitulo: 'Bevor du gehst, eine Frage',
    perguntaLead: 'Antworten ist freiwillig und ändert nichts: die Kündigung bleibt einen Fingertipp entfernt, auf dem Knopf unten.',
    porQue: 'Warum kündigst du?',
    continuarParaLoja: (loja: string) => `Weiter zum ${loja}`,

    /* ⚠️ DIE REIHENFOLGE IST NICHT FREI: die ersten drei haben eine
       Antwort, die letzten drei ein Textfeld, und „Anderer Grund“ ist
       immer der letzte. Wer liest, findet die Alternative vor dem
       Formular und den allgemeinen Ausgang nach allen bestimmten. */
    motivoCaro: 'Es ist zu teuer',
    motivoEsqueco: 'Ich nutze es nicht',
    motivoTerminei: 'Ich bin fertig',
    motivoFaltou: 'Es hat etwas gefehlt',
    motivoProblema: 'Es gab ein Problem',
    motivoOutro: 'Anderer Grund',

    /* ⚠️⚠️ BEIM JAHRESABO IST DER RABATT NICHT DIE NACHRICHT — DAS DATUM
       IST ES. Wer jährlich zahlt und sagt, es sei zu teuer, hat keine
       Abbuchung vor sich. Was ihre Entscheidung ändert, ist, dass das Jahr
       bezahlt ist und eine Kündigung jetzt das Geld nicht zurückbringt.
       Und die Erstattung wird genannt, auch wenn sie kostet: wer sein Geld
       will, sucht ohnehin danach, und zu schweigen sichert nur, dass sie
       genervt und an der falschen Stelle sucht. */
    anoPagoTitulo: 'Dein Jahr ist schon bezahlt',
    anoPagoComData: (data: string) => `Die nächste Abbuchung ist erst am ${data}, und bis dahin behältst du alles — jetzt zu kündigen bringt nicht zurück, was schon bezahlt ist.`,
    anoPagoSemData: 'Du behältst alles bis zum Ende des bereits bezahlten Zeitraums — jetzt zu kündigen bringt diesen Betrag nicht zurück.',
    anoPagoReembolso: (loja: string, comDesconto: string, cheio: string) =>
      `Eine Erstattung, wo sie möglich ist, wird im ${loja} beantragt. Und wenn der Betrag das Problem ist, kann die Verlängerung ${comDesconto} statt ${cheio} kosten.`,
    querDescontoRenovacao: 'Ich will den Rabatt bei der Verlängerung',

    descontoTitulo: (porcento: number) => `${porcento}% Rabatt im nächsten Monat`,
    descontoTexto: (comDesconto: string, cheio: string, anualPorMes: string) =>
      `Die nächste Abbuchung kostet ${comDesconto} statt ${cheio}. Und wenn das Monatsabo das Problem ist, kommt das Jahresabo auf ${anualPorMes} pro Monat.`,
    querDesconto: 'Ich will den Rabatt',

    lembretesTitulo: 'Wenn das Problem das Vergessen ist, können wir erinnern',
    lembretesTexto: 'Dosis, Wiegen, Trinken und Eiweiß haben eine Erinnerung, zu der Uhrzeit, die du wählst. Du kannst nur das anschalten, was du brauchst, und den Rest lassen.',
    configurarLembretes: 'Erinnerungen einrichten',

    /* ⚠️⚠️ HIER HÖRT DER BILDSCHIRM AUF ZU VERKAUFEN UND GRATULIERT. Es
       ist der einzige Grund der Liste, bei dem Gehen der richtige Ausgang
       ist. Und der Glückwunsch ist mit Absicht BEDINGT: „wir hoffen, du
       hast erreicht“ und nicht „du hast es geschafft“ — nicht jede
       Behandlung, die endet, endet gut, und jemandem den Sieg zu
       behaupten, die wegen einer Nebenwirkung aufgehört hat, wäre der
       grausamste Satz, den dieser Bildschirm haben könnte. */
    parabensTitulo: 'Schön, dass du diesen Weg gegangen bist',
    parabensTexto: 'Wir hoffen, du hast erreicht, was du gesucht hast, als du angefangen hast. Danke, dass du diesen Weg mit uns gegangen bist — und dass du uns die Aufzeichnung davon anvertraut hast.',

    campoProblema: 'Was ist passiert?',
    campoFaltou: 'Was hat gefehlt?',
    campoOutro: 'Erzähl es uns',
    /* ⚠️ UND DER SATZ VERSPRICHT KEINE ANTWORT. Dieser Text hat noch
       nirgendwohin zu gehen. „Wir melden uns“ wäre das leichteste und
       teuerste Versprechen dieses Bildschirms. */
    campoAviso: 'Schreiben ist freiwillig, und hier antwortet dir niemand — daraus wird eine Liste zum Reparieren, und so entscheiden wir, was wir zuerst in Ordnung bringen.',
    campoDicaProblema: 'Was schiefging, und wann…',
    campoDicaOutro: 'Schreib so viel du magst',

    recusaTitulo: 'Der Rabatt lässt sich noch nicht anwenden',
    recusaTexto: 'Die Abrechnung ist in dieser Version nicht aktiv, es gibt also nichts zu rabattieren. An deinem Abo hat sich nichts geändert.',

    /* ⚠️ DER TITEL IST DIE ZUSAMMENFASSUNG DER DREI, und keine
       Abschnittsbeschriftung. Die drei Zeilen beantworten dieselbe Frage —
       „was verliere ich?“ */
    tranquiloTitulo: 'KEINE SORGE',
    tranquiloAcesso: 'Der Zugang bleibt bis zum Ende des bereits bezahlten Zeitraums.',
    tranquiloDados: 'Nichts von dem, was du eingetragen hast, geht verloren — alles bleibt auf dem Gerät.',
    tranquiloLoja: (loja: string) => `Die Kündigung läuft über den ${loja}: wir können das nicht für dich tun.`,
  },

  /* ============================================================
     DIE PARTNERPRAXEN — /parceiros und /codigo
     ============================================================ */
  parceiros: {
    titulo: 'Partnerpraxen',
    lead: 'Manche Praxen begleiten die Behandlung hier mit dir zusammen. Ohne das behältst du alles — was sich ändert, ist, was du mit deinem Team hier machen kannst.',

    jaTemTitulo: 'Du bist schon bei einer Partnerpraxis',
    jaTemLead: 'Alles in dieser Liste gilt für dich bereits.',

    conversaTitulo: 'Das Gespräch mit dem Team',
    conversaTexto: 'Nachrichten zwischen den Terminen, ohne für eine einzelne Frage einen neuen Termin ausmachen zu müssen.',
    resumoTitulo: 'Deine Übersicht kommt dort an',
    resumoTexto: 'Ein Tippen schickt Gewicht, Therapietreue, Beschwerden und Befunde — geordnet, so wie sie im Termin gebraucht werden.',
    receitaTitulo: 'Rezept und Protokoll',
    receitaTexto: 'Du fragst eine Verlängerung an und bekommst das Protokoll der Woche in der App.',
    agendaTitulo: 'Der Kalender kommt fertig',
    agendaTexto: 'Die Termine erscheinen hier, ohne dass du etwas notieren musst.',

    /* ⚠️ UND ES GIBT KEINE PRAXENSUCHE, und der Bildschirm sagt das. Eine
       Praxenliste, die es nicht gibt, wäre die teuerste Attrappe hier. */
    conviteTitulo: 'Die Einladung kommt von der Praxis',
    conviteTexto: 'Hier lässt sich keine Praxis suchen. Wer schon in einer Partnerpraxis behandelt wird, bekommt von ihr einen Code, und er verbindet die beiden Enden. Wenn deine Praxis die App noch nicht nutzt, lohnt es sich, sie darauf anzusprechen.',
    conviteTextoComRede: 'Wer im Partnernetzwerk behandelt wird, bekommt nach dem ersten Termin von der Praxis einen Code, und er verbindet die beiden Enden. Wenn deine Praxis die App noch nicht nutzt, lohnt es sich, sie darauf anzusprechen.',

    codigoRotulo: 'Einladungscode',
    codigoAjudaAtual: 'Er ist es, der dich mit deiner Praxis verbindet.',
    usarOutro: 'Einen anderen Code nutzen',
    temCodigoRotulo: 'Ich habe einen Einladungscode',
    temCodigoAjuda: 'Der Code, den die Praxis dir gegeben hat.',
    digite: 'Code eingeben',
    confirmar: 'Code bestätigen',
    codigoSub: 'Der Code, den die Partnerpraxis dir gegeben hat.',
  },

  codigo: {
    minimo: 'Gib mindestens 4 Zeichen ein.',
    liberaNaHora: 'Der Code schaltet die App sofort frei. Nichts von dem, was du schon eingetragen hast, verschiebt sich.',
    conferindo: 'Wird geprüft…',
    naoAchou: 'Diesen Code haben wir nicht gefunden. Frag bei der Praxis nach — er gilt genau so, wie sie ihn dir gegeben hat.',
    exemplo: (codigos: string) => `In der Beispielliste sind die Codes erfunden: ${codigos}.`,
    conferirTitulo: 'Ist das deine Praxis?',
    conferirSub: 'Der Code, den du eingegeben hast, gehört zu dieser Praxis.',
    conectar: 'Verbinden',
    naoEEssa: 'Das ist nicht meine Praxis',
    conectarTexto: 'Sobald du verbunden bist, begleitet dich diese Praxis hier. Nichts von dem, was du schon eingetragen hast, verschiebt sich.',
    cancelarTitulo: 'Du kannst dein Abo kündigen',
    cancelarTexto: (loja: string) => `Die Verbindung mit der Praxis deckt deinen Zugang zur App schon ab. Das Abo im ${loja} wird weiter abgerechnet, bis du es dort kündigst — und das Kündigen ändert nichts an dem, was du schon eingetragen hast.`,
    cancelarNaLoja: (loja: string) => `Im ${loja} kündigen`,
    depois: 'Später',
  },

  /* ============================================================
     DIE AUFSTELLUNG — /cobrancas
     ============================================================ */
  extrato: {
    titulo: 'Rechnungsverlauf',
    vazioIsenta: 'Keine Abbuchung',
    vazioPagante: 'Noch keine Abbuchung',
    vazioIsentaTexto: 'Der Zugang kommt aus der Verbindung mit der Praxis, und eine Verbindung löst keine Abbuchung aus. Falls die Praxis uns mitteilt, dass sie beendet ist, ruht der Zugang, bis du ein Angebot nimmst — hier erscheint nichts ohne deine Wahl.',
    vazioPaganteTexto: 'Sobald das Abo beginnt, erscheint jede Abbuchung hier mit Datum und Betrag.',
    inicioDoTeste: 'Beginn der Gratis-Tage',
    comprovante: 'Der offizielle Beleg jeder Abbuchung',
  },

  /* ============================================================
     DER RUHENDE ZUGANG — /suspenso

     ⚠️ WAS RUHT, IST DAS ABO, UND NICHT DAS KONTO. Die beiden Zeilen
     darunter sind der Unterschied zwischen einem Hinweis und einer
     Drohung.
     ============================================================ */
  suspenso: {
    clinicaGenerica: 'die Praxis, die dich behandelt hat',
    nadaApagado: 'Nichts wurde gelöscht. Gewicht, Spritzen, Beschwerden, Befunde und Fotos bleiben auf deinem Gerät.',
    nadaCobrado: 'Es wurde nichts abgebucht, und es wird nichts ohne deine Wahl abgebucht.',
    verOsPlanos: 'Angebote ansehen',
    outroCodigo: 'Ich habe einen anderen Code',
  },

};
