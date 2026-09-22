/* ============================================================
   DIE SKALEN — was jede Zahl bedeutet · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/escalas.ts. Eine Zahl allein verlangt,
   dass die Person sich die Skala selbst ausdenkt. „Ist 3 Energie gut?“ hat
   keine Antwort, und jeder Tag wird am Ende mit einer anderen Skala
   beantwortet als der Tag davor — was genau die Reihe ruiniert, die die
   App später liest. Die Beschriftung liefert die Skala mit.

   ⚠️⚠️ DAS IST DER TEXT, DEN DIE PERSON ANTIPPT, nicht der, den sie liest.
   Eine Stufe zu verschieben ändert keinen Satz: es ändert, was
   GESPEICHERT wird. Die 4 von heute bedeutete etwas anderes als die 4 von
   gestern, und die Reihe, die das Netzdiagramm, die Ziele und die
   Terminübersicht speist, wäre sinnlos. Wer übersetzt, muss die
   REIHENFOLGE und den Abstand zwischen den Stufen halten, bevor er an die
   Wörter denkt.

   ⚠️ IM DEUTSCHEN ENTFÄLLT DIE FALLE, DIE DAS FRANZÖSISCHE HIER HAT:
   Partizipien richten sich nicht nach dem Subjekt. „Fast erbrochen“
   behauptet über niemanden ein Geschlecht — dasselbe auf Französisch
   müsste sich entscheiden. Die deutschen Fallen liegen woanders, und in
   dieser Datei liegt keine.
   ============================================================ */

export const escalas = {
  /* ---------- die vier Achsen des Check-ins ---------- */
  /* 1–5 auf dem Bildschirm, 0–10 im Speicher. */
  energia: ['Keine Kraft', 'Ich habe mich durchgeschleppt', 'Hat für den Tag gereicht', 'Gut in Schwung', 'Energie im Überfluss'],

  /* Geschlafene Stunden — die Enden schlucken, was darüber hinausgeht.

     ⚠️⚠️ DAS LEERZEICHEN VOR „Std.“ IST GESCHÜTZT (U+00A0), und es steht
     hier als   und nicht als unsichtbares Zeichen. Das
     Portugiesische schreibt es direkt, und der Kommentar dort warnt
     genau davor: „es ist unsichtbar, und ich habe das schon einmal falsch
     gemacht — die fünf Stufen neu getippt, und nichts fiel auf, bis der
     Byte-für-Byte-Vergleich kam.“

     Die Fluchtsequenz löst das Problem an der Wurzel: sie ist sichtbar,
     sie lässt sich neu tippen, und sie überlebt jedes Kopieren. */
  sono: ['5 Std. oder weniger', 'Rund 6 Std.', 'Rund 7 Std.', 'Rund 8 Std.', '9 Std. oder mehr'],

  /* 1–5 auf beiden Seiten, ohne Umrechnung. */
  humor: ['Ein schwerer Tag', 'Eher gedrückt', 'Ein normaler Tag', 'Ein guter Tag', 'Ein richtig guter Tag'],

  /* ⚠️ HUNGER IST DAS GEGENTEIL VON SÄTTIGUNG, und das Netzdiagramm liest
     ihn als Sättigung. Deshalb ist 1 der GERINGSTE Hunger: die Skala
     steigt mit dem Symptom, wie die anderen auch. Die Reihenfolge hier
     umzudrehen dreht die Achse im Diagramm um. */
  fome: ['Kein Hunger', 'Wenig Hunger', 'Normaler Hunger', 'Ziemlich hungrig', 'Den ganzen Tag Hunger'],

  /* ⚠️ JEDES SYMPTOM WIRD AUF EIGENE WEISE SCHLIMMER, und deshalb gibt es
     keine allgemeine Skala für alle. Die 4 bei Übelkeit ist „fast
     erbrochen“; die 4 bei Verstopfung ist „drei Tage nicht“. Eine
     einheitliche Skala sagte für beide „hat den Tag gestört“, und das
     beschreibt keines von beiden. */

  /* Das Auffangnetz für ein Symptom, das noch keine eigene Skala hat. */
  intensidade: ['Kaum gemerkt', 'Leicht', 'Hat gestört', 'Hat den Tag gestört', 'Hat den Tag bestimmt'],

  sintoma: {
    nausea: ['Leicht flau', 'Übelkeit kam und ging', 'Dauernd übel', 'Fast erbrochen', 'Erbrochen'],
    constip: ['Nur mit Mühe', 'Einen Tag nicht', 'Zwei Tage nicht', 'Drei Tage nicht', 'Vier Tage oder mehr'],
    /* ⚠️ DIE UNTERSTE STUFE IST EIN BEREICH UND NICHT „EINMAL“, und das
       ist eine klinische Entscheidung und keine redaktionelle: ein weicher
       Gang ist kein Durchfall. Die Definition der WHO beginnt bei drei
       weichen Entleerungen am Tag. Mit der Untergrenze bei einmal nennte
       die Skala etwas ein Symptom, das bei vielen noch im Normalen liegt
       — und eine Spalte, die alles Durchfall nennt, taugt hinterher zu
       nichts.

       Also: Stufe 1 ist das „weich, aber noch nicht das“, Stufe 2 ist,
       wo die WHO anfängt, es Durchfall zu nennen, und Stufe 5 ist der
       Bereich, den die klinische Einteilung als schwer führt. Wer
       übersetzt, muss die Schnitte bei denselben ZAHLEN halten, nicht bei
       denselben Wörtern. */
    diarreia: ['Ein- oder zweimal', 'Dreimal', 'Viermal', 'Fünf- bis sechsmal', 'Sieben oder mehr'],
    refluxo: ['Leichtes Brennen', 'Nach dem Essen', 'Mehrmals am Tag', 'Hat das Essen gestört', 'Konnte nicht liegen'],
    fadiga: ['Leicht müde', 'Schneller müde geworden', 'Musste langsamer machen', 'Musste mich hinlegen', 'Kam nicht aus dem Bett'],
    cefaleia: ['Ein Stechen', 'Leicht störend', 'Brauchte ein Medikament', 'Hat den Tag gestört', 'Lag im Dunkeln'],
    tontura: ['Leicht schwankend', 'Beim schnellen Aufstehen', 'Mehrmals am Tag', 'Musste mich festhalten', 'Konnte nicht stehen'],
    /* ⚠️ ERBRECHEN ZÄHLT MAN, MAN STUFT ES NICHT AB: „hat den Tag
       gestört“ sagt nichts über Erbrechen, und die Anzahl ist das, wonach
       das Team fragen wird. */
    vomito: ['Einmal', 'Zweimal', 'Dreimal', 'Viermal oder mehr', 'Konnte nicht aufhören'],
    dor: ['Ein Unwohlsein', 'Leichte Krämpfe', 'Dauernde Krämpfe', 'Musste den Tag abbrechen', 'Schmerz, der blieb'],
  },

  /* ⚠️ DIE SCHLÜSSEL SIND DATEN UND WERDEN NICHT ÜBERSETZT: 'normal',
     'preso', 'solto' und 'alterna' sind das, was in `gut` gespeichert
     bleibt. Nur die Beschriftung kommt von hier.

     ⚠️ UND „WECHSELND“ IST EIN VOLLWERTIGER WERT, kein Sonderfall.
     Verstopfung und weicher Stuhl sind die beiden Enden derselben Wirkung
     — das Medikament bremst den ganzen Trakt —, und in Daten aus der
     Praxis treten beide fast gleich häufig auf. */
  intestino: {
    normal: 'Normal',
    preso: 'Verstopft',
    solto: 'Weich',
    alterna: 'Wechselnd',
  },

  /* ⚠️ ES SIND ZWEI LISTEN, WEIL ES ZWEI FRAGEN SIND. Die zum FRAGEN hat
     die Verdauung als einen Punkt — die Person antwortet einmal, und die
     Achse hat zwei Seiten. Die zum LESEN hat beide getrennt, weil
     „Verdauung an vier Tagen“ verstopfte Tage mit weichen Tagen
     zusammenzählte und eine Zahl ergäbe, die nichts bedeutet. */
  /* ⚠️ A RÉGUA SEM RESPOSTA DIZ QUE ESTÁ SEM RESPOSTA, e não zero. É a
     mesma regra dos três silêncios da Jornada: um dia sem resposta é um
     dia sem resposta. Mora no topo de `escalas` porque quem a escreve é o
     componente da régua, que serve a mais de uma tela. */
  aindaNaoRespondi: 'Noch nicht beantwortet',

  nomes: {
    nausea: 'Übelkeit',
    intestino: 'Verdauung',
    vomito: 'Erbrechen',
    dor: 'Bauchschmerzen',
    refluxo: 'Sodbrennen',
    fadiga: 'Müdigkeit',
    cefaleia: 'Kopfschmerzen',
    tontura: 'Schwindel',
    outro: 'Anderes',
    preso: 'Verstopfung',
    solto: 'Weicher Stuhl',
  },

  tela: {
    titulo: 'Symptome',
    diasRespondidos: (quantos: number, de: number) =>
      `${quantos} von ${de} Tagen beantwortet`,
    nenhumDia: (de: number) => `Kein Tag in den letzten ${de} beantwortet`,

    nestaSemana: 'Diese Woche',
    semRespostaSemana: 'Du hast diese Woche noch nichts zu Symptomen beantwortet. Sie kommen über das Check-in herein.',
    fazerCheckin: 'Check-in machen',
    nenhumSintoma: 'Diese Woche keine Symptome',
    nenhumSintomaSub: (respondidos: number) =>
      `${respondidos} ${respondidos === 1 ? 'Tag' : 'Tage'} beantwortet, keiner mit Beschwerde.`,
    diasDe: (dias: number, respondidos: number) =>
      `${dias} von ${respondidos} ${respondidos === 1 ? 'Tag' : 'Tagen'}`,
    noPiorDia: (legenda: string) => `Am schlimmsten Tag: ${legenda}`,
    voceEscreveuEm: (data: string) => `Geschrieben am ${data}`,

    aoLongoDoCiclo: 'Im Lauf des Zyklus',
    aoLongoNota: (dias: number) =>
      `Mittlere Übelkeit an jedem Tag nach der Spritze, aus ${dias} ${dias === 1 ? 'beantwortetem Tag' : 'beantworteten Tagen'}.`,
    dose: 'Dosis',

    cicloParecido: 'An den bisher beantworteten Tagen sieht die Übelkeit über den ganzen Zyklus ähnlich aus — sie folgt der Dosis nicht.',
    cicloPoucos: 'Es sind noch zu wenige Tage beantwortet, um zu sagen, ob die Übelkeit dem Zyklus folgt. Mit ein paar Tagen mehr steht diese Rechnung.',
    cicloInicio1: 'Die Übelkeit wiegt am Tag der Spritze am schwersten.',
    cicloInicioN: (dias: number) => `Die Übelkeit wiegt in den ersten ${dias} Tagen nach der Spritze am schwersten.`,
    cicloFim1: 'Die Übelkeit wiegt am Tag vor der nächsten Spritze am schwersten.',
    cicloFimN: (dias: number) => `Die Übelkeit wiegt in den ${dias} Tagen vor der nächsten Spritze am schwersten.`,
    cicloDia0: 'am Tag der Spritze',
    cicloDiaN: (dia: number) => `am ${dia}. Tag danach`,
    cicloEspalhado: (lista: string) => `Die Übelkeit wiegt ${lista} am schwersten.`,

    comoSeSentiu: 'Wie du dich gefühlt hast',
    respostasEm14: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'Antwort' : 'Antworten'} in 14 Tagen`,
    semRespostas: 'Noch keine Antworten',
    sentir: {
      energia: 'Energie',
      humor: 'Stimmung',
      sono: 'Schlaf',
      fome: 'Hunger',
    },
  },

  telaCheckin: {
    titulo: 'Check-in',
    pergunta: 'Wie war dein Tag?',
    lead: 'Beantworte, was passt. Etwas leer zu lassen ist auch eine Antwort.',
    salvar: 'Check-in speichern',

    energia: 'Energie',
    fome: 'Hunger',
    sono: 'Schlaf',
    humor: 'Stimmung',

    teveSintoma: 'Hattest du Beschwerden?',
    comoFoiIntestino: 'Wie war die Verdauung?',
    qualOutroSintoma: 'Was war die andere Beschwerde?',
    outroPlaceholder: 'z. B. metallischer Geschmack im Mund',
    intensidadeDe: (sintoma: string) => `${sintoma} · Stärke`,
  },
};
