/* ============================================================
   DIE ROUTINE — das Protokoll, die Vorschläge, die Vorbereitung und das Vergangene · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/rotina.ts. Drei bestimmen hier:

   DIE VORGESCHLAGENE FRAGE IST DIE EINGANGSTÜR ZUR KI, und es sind IHRE
   Fragen, keine Angebote von uns. „Warum hatte ich heute mehr Hunger?“
   ist, wie jemand denkt; „Die Rückkehr des Hungers verstehen“ ist, wie
   ein Menü spricht.

   DER IMPERATIV DER `empurroes` IST GEWOLLT, und das `porque` darunter
   ist es nie: das obere weist an, das untere erklärt.

   ⚠️ UND DIE PERSON DUZT DEN COMPANION, so wie er sie duzt. Das ist der
   bequeme Teil im Vergleich zum Französischen, das sich zwischen zwei
   Registern entscheiden musste: hier ist es symmetrisch, weil der ganze
   Katalog duzt. Siehe comum.ts.
   ============================================================ */

export const rotina = {
  perguntas: {
    maisFome: 'Warum hatte ich heute mehr Hunger?',
    semFome: 'Warum habe ich keinen Hunger?',
    depoisDaAplicacao: 'Was ist nach der Spritze zu erwarten?',
    diminuirEnjoo: 'Wie bekomme ich die Übelkeit kleiner?',
    trocarODia: 'Kann ich den Tag der Spritze wechseln?',
    meusExames: 'Was zeigen meine Befunde?',
    /* Diese beiden sind keine Fragen, sondern Aufträge: der Companion
       baut die Auswertung und stellt die Übersicht zusammen. */
    meuProgresso: 'Analysiere meine Entwicklung',
    prepararConsulta: 'Bereite meinen Termin vor',
  },

  /* ⚠️⚠️ DER IMPERATIV HIER IST GEWOLLT — „Trink noch etwas Wasser“,
     „Frag das neue Rezept an“. Bei einer Durchsicht, die nach Text sucht,
     der die Person mahnt, taucht diese Liste komplett auf und sieht aus
     wie der schlimmste Fund der App; sie ist es nicht.

     Mahnen ist die App, die beurteilt, was schon vorbei ist. Das hier ist
     die Form einer Aufgabenliste, und genau dafür hat die Person den
     Bildschirm geöffnet: sie ist gekommen, um zu fragen, was zu tun ist.
     Ins Substantiv zu wechseln — „noch ein Glas heute“ — macht den Text
     nicht sanfter, es macht den Vorschlag schüchterner, und ein
     schüchterner Vorschlag in einer Viererliste wird zur Deko. */
  empurroes: {
    agua: 'Trink heute noch etwas Wasser',
    /* ⚠️ DER GRUND WAR EIN DEFIZIT MIT DEM NAMEN DER PERSON DAVOR. „Du
       liegst unter der Hälfte des Ziels“ setzt das Subjekt an die Stelle
       derer, die versagt hat, und es war der einzige dieser Liste in
       dieser Form: die Nachbarn sprechen vom Pen, vom Kalender, vom
       Zyklus. Was an Wasser fehlt, ist eine Tatsache des Tages und kein
       Charakterfehler. */
    aguaPorqueComEnjoo: 'An deinen gut getrunkenen Tagen zeigt sich die Übelkeit seltener — und der Tag steht noch bei der Hälfte des Ziels',
    aguaPorque: 'Der Tag steht noch bei der Hälfte des Ziels, und Wasser hält die Sättigung bis zum Abend',

    proteina: 'Nimm beim Abendessen mehr Eiweiß',
    proteinaPorque: 'Du bist in der Phase des Zyklus, in der der Hunger zurückkommt, und das Eiweiß von heute zeigt sich im Hunger von morgen',

    checkin: 'Mach das Check-in von heute',
    checkinPorque: 'Das ist der Eintrag, der alles speist, was ich von deinem Weg sehen kann',

    /* ⚠️⚠️ DER BEHÄLTER KOMMT IM NOMINATIV — „der Pen“ —, und deshalb ist
       er hier das SUBJEKT. Das Portugiesische schreibt „Separe a caneta e
       escolha o local“, mit dem Pen als Objekt; Deutsch bräuchte dort „den
       Pen“, und `oA` kann das nicht liefern (siehe formas.ts).

       Also dreht sich der Satz: „Der Pen ist dran — such dir die Stelle
       aus.“ Es ist dieselbe Lösung wie in avisos.ts, und es ist die
       Lösung: wer den Fall nicht wählen kann, baut den Satz um den Fall
       herum, den er bekommt.

       ⚠️ UND DAMIT RUTSCHT DER ARTIKEL AN DEN SATZANFANG, wo `oA` ihn
       klein liefert: auf dem Bildschirm stand „der Pen ist dran“. Im
       Portugiesischen fiel das nie auf, weil dort der Imperativ vorne
       steht. Der erste Buchstabe wird hier großgeschrieben, und zwar an
       dieser einen Stelle — es ist der einzige Satz des Katalogs, der
       mit `oA` anfängt. */
    aplicacao: (recipiente: string) =>
      `${recipiente.charAt(0).toUpperCase()}${recipiente.slice(1)} ist dran — such dir die Stelle aus`,
    aplicacaoPorque: 'Die Spritze der Woche steht an, und die Stelle zu wechseln reizt die Haut weniger',

    receita: 'Frag das neue Rezept an',
    /* ⚠️ HIER KOMMEN DIE ZAHL UND DER ORT GETRENNT AN, und das Wort
       „Dosis“ gehört diesem Katalog. Vorher baute der Aufrufer
       `${p.left} doses ${noNa(forma)}` zusammen — auf Portugiesisch,
       Spanisch und Französisch ist „doses“ dasselbe Wort, und genau
       deshalb fiel es niemandem auf. Auf Deutsch heißt es „Dosen“. */
    receitaPorque: (doses: number, onde: string) =>
      `Es ${doses === 1 ? 'ist' : 'sind'} noch ${doses} ${doses === 1 ? 'Dosis' : 'Dosen'} ${onde} — wenn du jetzt anfragst, kommt es an, bevor der Vorrat endet`,

    /* Der Text der Untersuchung kommt aus dem Protokoll; von uns ist der
       Grund. */
    examePorque: 'Es steht offen im Protokoll dieser Woche, und das Ergebnis braucht meist ein paar Tage',

    consulta: 'Bereite deine Fragen für den Termin vor',
    consultaPorque: (tipo: string, doutor: string) =>
      `${tipo} bei ${doutor} — ich stelle die Übersicht zusammen, du wählst, was du fragen willst`,
  },

  /* ⚠️ DIE ÜBERSCHRIFT DER GRUPPE KOMMT AUS DER FRIST, UND DIE FRIST AUS
     DEN DATEN. „Diese Woche: Termin ausmachen“ ist eine Aufgabenliste;
     „In 9 Tagen: bereite die Fragen vor“ ist jemand, der den Kalender
     einer anderen ordnet. */
  prazo: {
    hoje: 'Heute',
    amanha: 'Morgen',
    estaSemana: 'Diese Woche',
    daquiA: (dias: number) => `In ${dias} Tagen`,
  },

  /* ⚠️ DIESE SÄTZE SIND DAS, WAS DIE PRAXIS VERORDNET, und das Register
     ist deshalb förmlicher als im Rest der App. „Sich bewegen“ taugte,
     solange das Ziel ein Anstoß war; in einer Liste neben Dosis und
     Eiweiß fällt es heraus. */
  protocolo: {
    aguaTodoDia: (quanto: string) => `Jeden Tag ${quanto} trinken`,
    aguaEmDias: (quanto: string, dias: number) => `${quanto} in ${dias} Tagen trinken`,
    origemAgua: 'Trinken',

    proteinaTodoDia: (gramas: number) => `Jeden Tag ${gramas} g Eiweiß essen`,
    proteinaEmDias: (gramas: number, dias: number) => `${gramas} g Eiweiß in ${dias} Tagen essen`,
    origemProteina: 'Essen',

    /* Tage MIT BEWEGUNG, und nicht Minuten: das ist, was der Punkt
       verlangt — dreimal vom Sofa hoch —, und das ist, was der Eintrag
       sagen kann, ohne die Sportart zu raten. */
    exercicio: (dias: number) => `An ${dias} ${dias === 1 ? 'Tag' : 'Tagen'} der Woche Sport machen`,
    origemExercicio: 'Bewegung',

    aplicacaoUma: 'Spritze der Woche',
    aplicacaoVarias: (quantas: number) => `${quantas} Spritzen in der Woche`,
    origemAplicacao: 'Spritzen',

    /* Was in jeder Aufgabe gezählt wird. „1 von 1 Tag“ beschreibt keine
       Spritze, deshalb bringt die Spritze ihr eigenes Paar mit. */
    unidadeDia: ['Tag', 'Tagen'] as [string, string],
    unidadeAplicacao: ['Spritze', 'Spritzen'] as [string, string],
    /* ⚠️ DER PLURAL STEHT IM DATIV — „2 von 7 Tagen“, nicht „von 7 Tage“.
       Deshalb ist die Pluralform oben „Tagen“ und nicht „Tage“: sie
       erscheint an genau einer Stelle, und die Stelle regiert den Dativ. */
    nota: (feito: number, alvo: number, unidade: string) => `${feito} von ${alvo} ${unidade}`,
  },

  /* ⚠️ DIE ZUSAMMENFASSUNG JEDES ZIELS NENNT DEN SCHNITT, und nicht, ob es
     erfüllt wurde. Die Woche ist vorbei; zu mahnen, was sich nicht mehr
     ändern lässt, hilft niemandem. „Kein Eintrag in dieser Woche“ ist das,
     was man sagt, wenn es nichts zu sagen gibt — und das ist etwas anderes
     als null. */
  semanas: {
    aguaMeta: (quanto: string) => `Jeden Tag ${quanto} trinken`,
    proteinaMeta: (gramas: number) => `Jeden Tag ${gramas} g Eiweiß essen`,
    exercicioMeta: (dias: number) => `An ${dias} Tagen der Woche Sport machen`,
    semRegistro: 'kein Eintrag in dieser Woche',
    mediaDeAgua: (quanto: string) => `im Schnitt ${quanto} pro Tag`,
    mediaDeProteina: (gramas: number) => `im Schnitt ${gramas} g pro Tag`,
    minutosNaSemana: (minutos: number) => `${minutos} Min. in der Woche`,
    semMovimento: 'keine Bewegung eingetragen',
  },

  /* ⚠️ JEDER PUNKT HAT ZWEI TITEL, und der Unterschied ist das, was der
     Block tut: fertig, NENNT er, was schon da ist („Gewicht aktuell“);
     offen, sagt er, was zu TUN ist („Vorher wiegen“). Dieselbe Zeile, zwei
     Verben, und die Person liest die Liste mit einem Blick und weiß, was
     fehlt. */
  preparo: {
    pesoNenhum: 'Gewicht eintragen',
    pesoNenhumSub: 'Noch keine Wiegung',
    pesoEmDia: 'Gewicht aktuell',
    pesoAntigo: 'Vorher wiegen',
    pesoAntigoSub: (quando: string) => `Letzte Wiegung ${quando}`,
    pesoSub: (peso: string, quando: string) => `${peso} · ${quando}`,

    notasProntas: 'Fragen notiert',
    notasProntasSub: (quantas: number) => `${quantas} zum Mitnehmen`,
    notasVazias: 'Fragen notieren',
    notasVaziasSub: 'Noch nichts notiert',

    examesRecentes: 'Aktuelle Befunde',
    examesRecentesSub: (nome: string, quando: string) => `${nome} · ${quando}`,
    exames: 'Befunde',
    /* `quando` bringt sein „vor“ schon mit, also kein zweites hier. */
    examesAntigosSub: (quando: string) => `Der letzte war ${quando}`,
    examesNenhumSub: 'Kein Befund abgelegt',
  },

  /* ⚠️ DIESELBE FORM AUF ALLEN ZEILEN DER VORBEREITUNG, damit das Auge die
     Daten vergleicht, statt sie zu übersetzen. „vor einem Monat“ und nicht
     „vor 1 Monat“: die Zahl ausgeschrieben, wenn sie allein steht, ist,
     wie man spricht. */
  quando: {
    hoje: 'heute',
    ontem: 'gestern',
    haDias: (dias: number) => `vor ${dias} Tagen`,
    haUmMes: 'vor einem Monat',
    haMeses: (meses: number) => `vor ${meses} Monaten`,
  },

  periodo: {
    pesoEstavel: 'Gewicht unverändert',
    pesoDe: (de: string, para: string) => `Von ${de} auf ${para}`,
    doseNova: (dose: string) => `Dosis auf ${dose} mg`,
    doseAnterior: (dose: string) => `Kam von ${dose} mg`,
    umaAplicacao: '1 Spritze',
    aplicacoes: (quantas: number) => `${quantas} Spritzen`,
    marcadores: (quantos: number) => `${quantos} Marker`,
    umaOrientacao: '1 Empfehlung des Teams',
    orientacoes: (quantas: number) => `${quantas} Empfehlungen des Teams`,
    /* Wenn der Verlauf die Art des Termins nicht nennt. */
    consultaSemTipo: 'Termin',
  },

  /* ⚠️ „DU“ IST ZUGLEICH BESCHRIFTUNG UND WACHPOSTEN. Eine Einheit ohne
     gespeicherte `fonte` ist von Hand — von Hand ist das, was es gab,
     bevor es eine Herkunft gab —, und der Bildschirm zeigt nie das
     Fehlen: er zeigt „Du“, weil das Fehlen nicht auf „wer hat das
     eingetragen“ antwortet, sondern auf „ich weiß es nicht“. */
  origemManual: 'Du',

  /* ⚠️ ALLE VIER SIND ZEITADVERBIEN UND BEUGEN SICH NICHT. Die Pastille
     steht neben „Anstieg“, „Plateau“, „Abstieg“ — und im Deutschen wäre
     ein Partizip dort ohnehin unveränderlich, anders als im Französischen,
     wo „passé“ mit der Phase übereinstimmen müsste. Hier ist „vorbei“
     schlicht das richtige Wort. */
  selo: {
    passou: 'vorbei',
    agora: 'jetzt',
    amanha: 'morgen',
    emDias: (dias: number) => `in ${dias} Tagen`,
  },
};
