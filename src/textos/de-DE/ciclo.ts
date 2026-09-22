/* ============================================================
   DER DOSISZYKLUS — die Schlagzeile der Startseite und die Phasen · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/ciclo.ts. Was die Person spürt, ändert
   sich über die Tage zwischen einer Injektion und der nächsten, und die
   App liest diese Position, um zu erklären, was HEUTE mit ihr passiert.
   Es ist der Text, den die meisten sehen, weil er jeden Tag die
   Startseite eröffnet.

   ⚠️ DIE REGEL FÜR DIE GANZE DATEI: keiner dieser Sätze weist etwas an.
   Sie sagen, was gerade passiert und was üblicherweise hilft — der
   Unterschied zwischen „trink mehr Wasser“ und „Wasser hält in dieser
   Phase die Sättigung“ ist der Unterschied zwischen einer App, die mahnt,
   und einer, die erklärt, und das hier ist die zweite.
   ============================================================ */

export const ciclo = {
  /* ---------- der Hut ---------- */
  /* ⚠️ „TAG 5 DER DOSIS“, UND NICHT „TAG 5 VON 7“. Das Von-sieben sah aus
     wie ein Countdown auf eine Frist — sieben wovon, und was passiert,
     wenn sie erreicht ist? Der Rhythmus gehört dem Medikament, er ist kein
     Soll. „Der Dosis“ sagt dieselbe Position und benennt die Uhr, die sie
     misst. */
  chapeuDia: (dia: number) => `TAG ${dia} DER DOSIS`,
  /* Ohne eingetragene Injektion gibt es keinen Zyklus, und der Hut
     erfindet keinen. */
  chapeuSemCiclo: 'FÜR HEUTE',

  /* ---------- Tag der Injektion ---------- */
  /* ⚠️ ER KÜNDIGT NICHT AN, DASS HEUTE GESPRITZT WIRD: die nächste Folie
     der Startseite handelt komplett davon, mit Dosis und Stelle. Zwei
     Folien hintereinander mit derselben Nachricht verbrauchen das
     Karussell. */
  aplicHead: 'Die Wirkung beginnt in den nächsten Stunden zu steigen.',
  aplicBody: 'Leichte Übelkeit kann auftreten — kleinere Mahlzeiten über den Tag gehen besser.',
  aplicQ: 'Was ist am Tag der Injektion zu erwarten?',

  /* ---------- Gipfel ---------- */
  picoHead: 'Dein Appetit ist heute eher niedriger.',
  picoBody: 'Die Wirkung ist am höchsten — ein guter Tag zum Trainieren und um das Eiweiß vorzuziehen.',
  picoQ: 'Wann habe ich mehr Energie?',

  /* ---------- stabil ---------- */
  estabHead: 'Dein Körper ist in der stabilen Phase des Zyklus.',
  estabBody: 'Gleichbleibende Wirkung — Wasser und Eiweiß im Takt halten die Sättigung.',
  estabQ: 'Wie funktioniert der Zyklus des Medikaments?',

  /* ---------- Rückkehr des Hungers ---------- */
  retornoHead: 'Dein Hunger kann in den nächsten 24 Stunden zunehmen.',
  retornoBody: 'Eiweiß und Wasser halten in dieser Phase des Zyklus die Sättigung.',
  retornoQ: 'Warum habe ich mehr Hunger?',

  /* ---------- Höhepunkt des Hungers ---------- */
  /* Zwei Schlagzeilen aus demselben Grund wie am Injektionstag: wenn heute
     gespritzt wird, erzählt das die Injektionsfolie. */
  altoHeadHoje: 'Hunger am höchsten Punkt des Zyklus.',
  altoHeadComData: (quando: string) => `Hunger am hohen Punkt des Zyklus — Injektion ${quando}.`,
  /* ⚠️ „LASS KEINE MAHLZEIT AUS“ SETZT VORAUS, DASS SIE WELCHE AUSLÄSST,
     und am Höhepunkt des Hungers lässt am wenigsten aus, wer Hunger hat.
     Der Satz war als Rat gedacht und kam als Zurechtweisung an — die
     bejahende Fassung sagt dasselbe Nützliche, ohne jemanden zu
     beschuldigen. */
  altoBody: 'Kleinere Portionen, dafür öfter, mit Eiweiß dabei, halten den Hunger besser.',
  altoQ: 'Warum habe ich mehr Hunger?',

  /* ---------- das zusätzliche Zeichen ---------- */
  /* Es steht vor dem Textkörper, wenn die Nacht gut war. Es ist die
     einzige Zeile der App, die Schlaf feiert, und es gibt sie, weil gut
     zu schlafen den ganzen Tag derer ändert, die in Behandlung sind. */
  dormiuBem: (resto: string) => `Du hast gut geschlafen — dein Körper spricht heute meist besser an. ${resto}`,

  /* ============================================================
     DIE FÜNF ETAPPEN — der Fortschrittsbalken des Zyklus

     ⚠️ HIER SIND ES FÜNF UND GLEICH DARUNTER VIER, und das ist Absicht.
     Hier lautet die Frage „an welchem Punkt bin ich JETZT“, und fünf
     Etappen geben genug Feinheit, damit der Satz des Tages sich ändert;
     die Tabelle darunter beantwortet „wie ist der Zyklus als Ganzes“, und
     dort ist die fünfte Zeile eine mehr, als beim ersten Lesen in den Kopf
     passt.

     ⚠️ `label` IST DER NAME DER ETAPPE UND `hint` IST, WAS SIE IST. Der
     Name allein — „Beginn der Rückkehr des Hungers“ — ist Diagnose ohne
     Zusammenhang, und auf einem Behandlungsbildschirm erschreckt das,
     statt zu leiten. */
  faseAplicLabel: 'Injektion',
  faseAplicRange: 'Tag 1',
  faseAplicHint: 'Die Wirkung beginnt in den nächsten Stunden zu steigen.',

  fasePicoLabel: 'Wirkgipfel',
  fasePicoRange: 'Tage 1–2',
  fasePicoHint: 'Medikament am höchsten Punkt — der Hunger wird kleiner.',

  faseEstabLabel: 'Stabilität',
  faseEstabRange: 'Tage 3–4',
  faseEstabHint: 'Gleichbleibende Wirkung, ohne große Ausschläge.',

  faseRetornoLabel: 'Beginn der Rückkehr des Hungers',
  faseRetornoRange: 'Tage 5–6',
  faseRetornoHint: 'Das Medikament beginnt zu fallen, und der Hunger kommt meist zurück.',

  fasePreLabel: 'Vor der Injektion',
  fasePreRange: 'Ab Tag 7',
  fasePreHint: 'Tiefster Punkt des Zyklus, bis zur nächsten Dosis.',

  /* ============================================================
     DIE VIER PHASEN — die Lesart der Innenbildschirme

     ⚠️ DIESE TABELLE SETZT EINEN WOCHENRHYTHMUS VORAUS, und das ist
     bekannte Schuld: wer ein tägliches Medikament nimmt, hat keine sieben
     Tage Zyklus zu durchlaufen. Es steht hier, damit wer übersetzt, keine
     Zeit damit verliert, in den Tagesangaben einen Sinn zu suchen.
     ============================================================ */
  faseSubidaTitulo: 'Tage 1–2 · Anstieg',
  faseSubidaSub: 'Wirkung steigt, Appetit niedriger',
  faseSubidaComum: 'leichte Übelkeit, schnelle Sättigung, weniger Lust zu essen',
  faseSubidaAjuda: 'kleinere Mahlzeiten in größeren Abständen; über den Tag Wasser trinken',

  fasePlatoTitulo: 'Tage 3–4 · Plateau',
  fasePlatoSub: 'Stabilste Phase des Zyklus',
  fasePlatoComum: 'gleichbleibender Appetit, langsamere Verdauung',
  fasePlatoAjuda: 'Eiweiß und Ballaststoffen in den Mahlzeiten den Vortritt lassen',

  faseDescidaTitulo: 'Tage 5–6 · Abstieg',
  faseDescidaSub: 'Wirkung lässt nach, Hunger kommt allmählich zurück',
  faseDescidaComum: 'mehr Hunger als an den ersten Tagen, schwankende Energie',
  /* ⚠️ DIE ZWEITE HÄLFTE DIESES SATZES IST DER GRUND SEINER EXISTENZ. Dass
     der Hunger am fünften Tag zurückkommt, erschreckt alle, die glauben,
     das Medikament habe aufgehört zu wirken, und genau dort aufzuhören ist
     häufig. Zu sagen, dass es die Phase ist und nicht das Versagen, ist
     die ganze Arbeit dieser Zeile. */
  faseDescidaAjuda: 'das ist die Phase, in der der Hunger zurückkommt — es heißt nicht, dass die Behandlung aufgehört hat zu wirken',
  /* Die einzige Phase mit einem Achtung: hier tauchen die Symptome auf,
     die eine Ärztin brauchen. Das ist kein Alarm — es ist die Grenze
     zwischen dem Erwarteten und dem, was nicht bis zum nächsten Termin
     wartet. */
  faseDescidaAtencao: 'anhaltendes Erbrechen oder starke Bauchschmerzen: sprich mit deiner Ärztin oder deinem Arzt',

  faseBaixoTitulo: 'Tag 7 · tiefster Punkt',
  faseBaixoSub: 'Der Tag vor der nächsten Injektion',
  faseBaixoComum: 'Appetit näher am Gewohnten',
  /* „Die Dosis“ und nicht „der Pen“: diese Tabelle ist konstant und kennt
     die Darreichungsform nicht — der Satz bedient Pen, Durchstechflasche
     und Spritze gleichermaßen. Siehe logic/formas. */
  faseBaixoAjuda: 'Dosis und Einstichstelle schon am Vorabend festlegen',
};
