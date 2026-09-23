/* ============================================================
   DIE ANMELDUNG — neunzehn Fragen, der größte Bildschirm der App · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/cadastro.ts. Zwei bestimmen:

   DIE FRAGEN BEUGEN SICH MIT. Wer noch nicht angefangen hat, hat nichts
   in der Gegenwart zu beantworten, also kommen Medikament, Form, Dosis,
   Rhythmus und Begleitung paarweise — `agora` und `futuro`.

   JEDER UNTERTITEL SAGT, WARUM WIR FRAGEN, und der zur Identität sagt den
   ECHTEN Grund, nicht den vorteilhaften: die Geschlechtsidentität geht
   hier in keine einzige Rechnung ein. Einen Nutzen zu versprechen, den es
   nicht gibt, ist die Art, wie man das Vertrauen derer verliert, die zum
   Lesen stehen geblieben sind.

   ⚠️⚠️ UND DAS DEUTSCHE HAT HIER EINE FALLE, DIE DAS FRANZÖSISCHE NICHT
   HAT, und umgekehrt. Französisch musste jedes Partizip umbauen, das sich
   mit der lesenden Person gerichtet hätte — „né·e“, „suivi·e“. Deutsch
   beugt Partizipien nicht nach dem Subjekt, also fällt das weg.

   Was hier stattdessen droht, ist die PERSONENBEZEICHNUNG: „ein Arzt“,
   „ein Spezialist“, „der Facharzt“. Diese Datei spricht mehrmals von der
   Person, die behandelt, und keine davon ist bekannt. Die Antwort ist die
   aus comum.ts: beide nennen, wo Platz ist, und sonst die Rolle statt der
   Person — „ärztliche Begleitung“, „eine Praxis“, „wer dich behandelt“.
   ============================================================ */

export const cadastro = {
  aberturaTitulo: 'Die Begleitung auf deinem Weg der ',
  aberturaTituloForte: 'Veränderung',
  aberturaTexto: 'Mehr als Ergebnisse zu verfolgen, geht es darum, den Weg dahinter zu verstehen. Eine kluge Begleitung, die mit dir lernt und sich jeder Etappe anpasst.',
  comecar: 'Loslegen',

  verPlanos: 'Angebote ansehen',

  titulos: {
    nome: 'Wie dürfen wir dich nennen?',
    identidade: 'Wie identifizierst du dich?',
    nascimento: 'Wann bist du geboren?',
    tratamento: 'Bist du schon in Behandlung?',
    inicio: 'Wann hast du angefangen?',
    medicamentoFuturo: 'Welches Medikament willst du nehmen?',
    medicamentoAgora: 'Welches Medikament nimmst du?',
    formaFuturo: 'Wie wirst du es dir geben?',
    formaAgora: 'Wie gibst du es dir?',
    doseFuturo: 'Mit welcher Dosis willst du anfangen?',
    doseAgora: 'Wie hoch ist deine aktuelle Dosis?',
    frequenciaFuturo: 'In welchem Abstand wirst du spritzen?',
    frequenciaAgora: 'In welchem Abstand spritzt du?',
    corpo: 'Wie sind deine aktuellen Maße?',
    meta: 'Was ist dein Zielgewicht?',
    ritmo: 'In welchem Tempo willst du dorthin?',
    motivacao: 'Was bringt dich auf diesen Weg?',
    atividade: 'Wie viel bewegst du dich?',
    restricao: 'Hast du Einschränkungen beim Essen?',
    saude: 'Verbinde deine Gesundheits-App',
    /* ⚠️ „ÄRZTLICHE BEGLEITUNG“ UND NICHT „EIN SPEZIALIST“. Es ist
       dieselbe Frage wie im Französischen und dieselbe Lösung: die Rolle
       statt der Person, damit kein Geschlecht gewählt werden muss, das
       niemand kennt. */
    acompanhamentoFuturo: 'Willst du dich ärztlich begleiten lassen?',
    acompanhamentoAgora: 'Wirst du ärztlich begleitet?',
    consentimento: 'Wichtige Hinweise',
  },

  subs: {
    nome: 'Der Vorname reicht, oder der Spitzname, den du magst.',
    identidade: 'Damit wir dich richtig ansprechen. Was in die Gesundheitsrechnungen eingeht, ist dein Körper, und der kommt in den nächsten Fragen.',
    nascimento: 'Jede Lebensphase hat eigene Bedürfnisse — und das Alter geht in die Referenzbereiche deiner Blutwerte ein.',
    tratamento: 'Nur, um zu wissen, wo du gerade stehst.',
    inicio: 'Ungefähr reicht. Daraus ergibt sich deine Behandlungswoche, und dieses Gewicht wird zum Anfang deiner Kurve.',
    medicamento: 'Daraus kommen die Dosistreppe und der Abstand zwischen den Spritzen.',
    forma: 'Die Rezeptur kommt in beiden Formen aus der Apotheke, und was sich ändert, ist das, was du beim Spritzen in der Hand hast.',
    doseComEscada: (med: string) => `In der Reihenfolge der Aufdosierung von ${med}.`,
    doseSemEscada: 'Die Rezeptur hat keine Standard-Dosistreppe — die Zahl ist die aus deinem Rezept.',
    /* ⚠️ DER BEHÄLTER KOMMT SCHON GEBEUGT — hier im GENITIV: „des Pens“,
       „der Spritze“. Siehe T.formas.doDa in textos/de-DE/formas.ts. */
    frequencia: (doDaForma: string) => `Daraus kommen die Zählung des Zyklus, die Erinnerungen und der Vorrat ${doDaForma}.`,
    corpo: 'Aus Größe und Gewicht berechnen wir deinen BMI und bauen deine Tagesziele für Eiweiß und Wasser.',
    meta: 'Das ist die Bezugsgröße, an der wir zeigen, wie weit du schon gekommen bist. Du kannst sie jederzeit ändern.',
    ritmo: (aPercorrer: string) => `${aPercorrer} bis dahin.`,
    motivacao: 'Es gibt keine richtige Antwort. Es zählt die, an die du dich an einem schweren Tag erinnern würdest.',
    restricao: 'Eiweiß ist die Achse dieser Behandlung, und es kommt aus verschiedenen Quellen, je nachdem, was du isst. Du kannst mehreres auswählen.',
    atividade: 'Das geht in dein tägliches Wasserziel ein — wer sich mehr bewegt, verliert mehr Flüssigkeit — und sagt, wo du startest.',
    saude: 'Deine Gesundheitsdaten helfen zu verstehen, wie es vorangeht — ohne dass du alles eintragen musst.',
    /* ⚠️ DIESER TEXT DARF NICHT WIE EIN ANGEBOT KLINGEN. In einer Frage,
       die niemand nachprüft, ist eine Liste von Vorteilen eine Einladung
       zu lügen, um die bessere Fassung freizuschalten — und wer dort
       lügt, bekommt eine App, die ihr von Terminen erzählt, die sie nicht
       hat. */
    acompanhamento: 'Diese Antwort öffnet, was mit der ärztlichen Begleitung zu tun hat — Notizen und die Vorbereitung von Terminen.',
    consentimento: 'Zwei Dinge, bevor es losgeht: was wir für deine Behandlung tun, und was mit dem passiert, was du einträgst.',
  },

  seuNome: 'Dein Vorname',

  /* ⚠️ „ANDERES“ UND „MÖCHTE ICH NICHT SAGEN“ SIND NICHT DIESELBE
     ANTWORT: die eine sagt, wer die Person ist, die andere sagt, dass sie
     es nicht sagen will. Sie zusammenzulegen zwänge alle, die nur Ruhe
     wollen, sich zu erklären. */
  feminino: 'Weiblich',
  masculino: 'Männlich',
  outro: 'Anderes',
  prefiroNaoInformar: 'Möchte ich nicht sagen',

  jaIniciei: 'Ich bin schon in Behandlung',
  jaInicieiSub: 'Ich habe mindestens eine Dosis genommen',
  vouComecar: 'Ich fange bald an',
  vouComecarSub: 'Ich habe noch nichts genommen',

  /* ⚠️ „WEISS ICH NOCH NICHT“ ERSCHEINT ZWEIMAL, mit verschiedenen
     Untertiteln — einmal beim Medikament und einmal bei der Dosis. Die
     Beschriftung ist dieselbe, weil das Zögern dasselbe ist; was sich
     ändert, ist, was wir darauf antworten. */
  aindaNaoSei: 'Weiß ich noch nicht',
  aindaNaoSeiMedSub: 'Du kannst es später im Profil festlegen',
  aindaNaoSeiDoseSub: 'Fast alle fangen mit der niedrigsten an',

  /* ⚠️ „HIER“ IST DAS LAND, DAS DIE PERSON ANGEGEBEN HAT, und nicht, wo
     sie gerade ist. Die Liste darunter ist keine Liste verbotener oder
     schlechterer Medikamente — es ist nur das, was dort seltener
     umläuft. */
  menosComumAqui: 'HIER SELTENER',
  manipuladoSub: 'In der Apotheke angefertigt',
  formaSeringaSub: 'Du ziehst die Dosis mit einer Spritze auf',
  formaCanetaSub: 'Kommt fertig gefüllt, bereit zum Spritzen',

  doseDeInicio: 'Anfangsdosis',
  doseMaxima: 'Höchstdosis',

  todosOsDias: 'Jeden Tag',
  aCadaDias: (d: number) => `Alle ${d} Tage`,
  padrao: 'Standard',
  outroIntervaloTitulo: 'Anderer Abstand',
  outroIntervalo: 'Du sagst, alle wie viele Tage',

  pesoDeHoje: 'GEWICHT HEUTE',
  pesoDeQuandoComecou: 'GEWICHT AM ANFANG',
  querPerder: 'Du willst abnehmen',
  querGanhar: 'Du willst zunehmen',

  /* ⚠️ KEIN TEMPO VERSPRICHT ETWAS, und deshalb sind die Namen Namen von
     TEMPO und nicht von Ergebnis. Was die Literatur als gehaltenen Verlust
     beschreibt, liegt bei etwa 0,5 bis 1 kg pro Woche; darüber rechnet der
     Körper und die Dosis, nicht der Wille. */
  ritmoDevagar: 'Langsam und stetig',
  ritmoConstante: 'Gleichmäßiges Tempo',
  ritmoAcelerado: 'Zügig',
  ritmoMaisRapido: 'So schnell wie möglich',
  ritmoPorSemana: (peso: string) => `${peso} pro Woche`,
  ritmoAlcanca: (metaProsa: string, mes: string) => `Erreicht die ${metaProsa} im ${mes}`,

  semRestricao: 'Keine',
  semRestricaoSub: 'Ich esse alles',

  /* ⚠️ DIESER SCHRITT HAT EINE EIGENE SCHLAGZEILE und nicht die trockene
     Frage der anderen: er ist der einzige im Formular, der eine ERLAUBNIS
     erbittet statt einer Antwort, und was jemanden zum Erlauben bewegt,
     ist nicht zu wissen, was wir wollen — sondern zu wissen, was sie
     davon hat. */
  saudeManchete: 'Alles, was dein Körper zeigt, <b>an einem Ort</b>',
  saudeLembrarTitulo: 'Eine Sache weniger zum Merken',
  saudeLembrarTexto: 'Gewicht, Schlaf und Training kommen von allein herein.',
  saudeCurvaTitulo: 'Deine Kurve, vollständiger',
  saudeCurvaTexto: 'Was das Gerät misst, landet schon hier.',
  saudeControleTitulo: 'Du behältst die Kontrolle',
  saudeControleTexto: 'Wähle, was du freigibst, und schalte es ab, wann du willst.',
  saudeConectar: 'Meine Daten verbinden',
  /* ⚠️ „SPÄTER MACHEN“, und nicht „jetzt nicht“. Die Ablehnung, die die
     Tür schließt, gibt man leichter als die, die vertagt — und hier
     vertagt sie wirklich: der Bildschirm für Verbindungen bleibt im
     Profil. */
  saudeDepois: 'Später machen',

  sim: 'Ja',
  digiteONome: 'Namen eingeben',
  nadaEnviado: 'Damit du sie auf deinem Weg zur Hand hast. An diese Person wird nichts geschickt.',
  vouMeTratar: 'Ich werde mich ärztlich behandeln lassen',
  meAcompanha: 'Eine Praxis begleitet meine Behandlung',
  porContaPropria: 'Nein, auf eigene Faust',
  porContaPropriaSub: 'Du kannst es später jederzeit ergänzen',
  quemVaiAcompanhar: 'WER DICH BEGLEITEN WIRD (OPTIONAL)',
  quemAcompanha: 'WER DICH BEGLEITET (OPTIONAL)',

  /* ⚠️ DIE BESCHRIFTUNG SAGT, WAS DAS TIPPEN BEDEUTET. „Weiter“ hieße,
     dass die Person einwilligt, ohne zu wissen, dass sie eingewilligt hat
     — und eine Einwilligung zu Gesundheitsdaten muss ein klarer Akt sein
     und nicht die Nebenwirkung davon, einen Bildschirm weiterzuschalten. */
  concordarEMontar: 'Zustimmen und meinen Plan bauen',
  ficaRegistrado: 'Wird mit dem heutigen Datum festgehalten.',
  salvar: 'Speichern',
  continuar: 'Weiter',

  /* ⚠️ DIE DREI SÄTZE SAGEN, WAS GERADE GETAN WIRD, in der Reihenfolge, in
     der es getan wird. Der Balken läuft von allein und täuscht keinen
     echten Fortschritt vor: er misst die Dauer des Wartens, die einzige
     ehrliche Zahl, die es hier gibt. */
  montandoTitulo: 'Wir bauen deinen Plan',
  faseLendo: 'Wir lesen deine Antworten',
  faseCalculando: 'Wir berechnen deine Tagesziele',
  faseDesenhando: 'Wir zeichnen deinen Weg',

  /* ⚠️ HIER ZAHLT SICH DAS DREITEILIGE `objetivo` AUS. Das Portugiesische
     schreibt „Para perder <b>7 kg</b> com o Mounjaro®“, mit dem Verb
     vorne; das Deutsche stellt es ans Ende: „Um <b>7 kg</b> abzunehmen
     mit Mounjaro®.“ Käme der Satz fertig aus dem Katalog, müsste die
     Fettung immer an derselben Stelle sitzen — und sie sitzt nicht.

     Beim Halten steckt das Verb schon in `manterOPeso` („dein Gewicht zu
     halten“), deshalb darf hinten keins mehr dazukommen. */
  telaPlano: {
    planoPronto: 'dein persönlicher Plan ist fertig!',
    manterOPeso: 'dein Gewicht zu halten',
    objetivo: (perder: number, alvo: string, marca: string): [string, string, string] => {
      const verbo = perder > 0.05 ? ' abzunehmen' : perder < -0.05 ? ' zuzunehmen' : '';
      return ['Um ', alvo, `${verbo}${marca}.`];
    },
    marcaRegistrada: (medicamento: string) => ` mit ${medicamento}®`,
    marcaGenerica: (medicamento: string) => ` mit ${medicamento}`,
    elaboradoPensando: 'Dein Plan wurde gebaut aus',
    nasSuasRespostas: 'Deinen Antworten',
    emEstudos: 'Studien zu GLP-1',

    secaoMetas: 'DEINE ZIELE FÜR HEUTE',
    secaoDose: 'DEINE DOSIS',
    secaoAteAMeta: 'BIS ZU DEINEM ZIEL',
    secaoCorpo: 'DEIN KÖRPER',
    secaoAjuda: 'WIE ICH DIR HELFE',
    secaoCiencia: 'DIE WISSENSCHAFT HINTER DEINEM PLAN',

    proteinaPorDia: 'EIWEISS PRO TAG',
    proteinaTexto: 'Das ist das erste Ziel des Tages. Das Medikament nimmt den Hunger, und ein Teil des Gewichts, das runtergeht, ist Muskel — Eiweiß ist das, was die Magermasse hält, während das Fett geht.',
    calorias: 'Kalorien',
    agua: 'Wasser',

    aindaADefinir: 'Noch offen',
    aindaADefinirTexto: 'Sobald du das Medikament kennst, baue ich die Dosistreppe und den Zyklus.',
    cicloComeca: 'Der Zyklus beginnt mit der ersten Spritze, die du einträgst.',
    cadenciaDiaria: 'jeden Tag',
    cadenciaSemanal: 'einmal pro Woche',
    cadenciaDias: (dias: number) => `alle ${dias} Tage`,

    pesoAPerder: 'Abzunehmendes Gewicht',
    pesoAGanhar: 'Zuzunehmendes Gewicht',
    emSemanas: (semanas: number) => `in ${semanas} Wochen`,
    ressalvaDaCurva: (ritmo: string) =>
      `Der Abfall ist keine Gerade: In den Studien bringen die ersten Wochen mehr, und das Tempo lässt nach, während dein Körper sich einstellt. Die ${ritmo} pro Woche, die du gewählt hast, sind ein Durchschnitt über die ganze Strecke und keine Vorhersage.`,

    imcDeHoje: 'BMI heute',
    naSuaMeta: 'Bei deinem Ziel',

    ajudaDose: 'Jede Dosis an der richtigen Stelle',
    ajudaDoseSub: 'die Rotation der Stellen und der Dosiszyklus, ohne dass du zählst',
    ajudaEnjoo: 'Übelkeit in Zahlen',
    ajudaEnjooSub: 'was du spürst, wird zum Muster, und das Muster geht mit zum Termin',
    ajudaPeso: 'Deine Gewichtskurve',
    ajudaPesoSub: 'jede Wiegung geht in die Linie, mit der Lesart dessen, was sich geändert hat',
    ajudaResumo: 'Eine Übersicht für den Termin',
    ajudaResumoSub: 'Dosen, Symptome und Gewicht geordnet auf einer einzigen Seite',

    feitoEmCimaDeEvidencia: 'Auf Evidenz gebaut',
    evidenciaTexto: 'Die Ziele, die Kurve und die Prioritäten dieses Plans folgen Leitlinien der öffentlichen Gesundheit und von Fachleuten begutachteten klinischen Studien.',
    rodape: 'Wir begleiten deinen Weg jeden Tag und ordnen, was du einträgst — aber wer die Behandlung führt, ist dein Behandlungsteam. Diese Zahlen sind ein Ausgangspunkt für dieses Gespräch und keine Verordnung.',

    voltar: 'Zurück',
  },

  telaDados: {
    titulo: 'Deine Angaben',
    lead: 'Das sind die Antworten aus deiner Anmeldung, und aus ihnen kommen dein BMI, deine Tagesziele und die Vorhersage des Plans. Wenn du hier etwas änderst, werden diese Zahlen neu berechnet.',

    tratamento: 'Behandlung',
    medicamento: 'Medikament',
    dose: 'Dosis',
    doseSub: (valor: string, unidade: string) => `${valor} ${unidade}`,
    frequencia: 'Häufigkeit',

    corpoERitmo: 'Körper und Tempo',
    altura: 'Größe',
    pesoInicial: 'Startgewicht',
    metaDePeso: 'Zielgewicht',
    ritmoEscolhido: 'Gewähltes Tempo',
    porSemana: (peso: string) => `${peso} pro Woche`,
    semPesoAPerder: 'Kein Gewicht abzunehmen',

    nome: 'Name',
    sexo: 'Geschlecht',
    nascimento: 'Geburtsdatum',
    nascimentoSub: (data: string, idade: number) => `${data} · ${idade} Jahre`,
    atividadeFisica: 'Körperliche Aktivität',
    restricoesAlimentares: 'Ernährungseinschränkungen',
    oQueTeTrouxe: 'Was dich hergebracht hat',

    rodape: 'Um eine neue Wiegung einzutragen, nimm die Eintragen-Taste.',
  },
};
