/* ============================================================
   DIE PHASE DER BEHANDLUNG — die Nachrichten, die die Startseite eröffnen · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/etapa.ts. Eine Phase ist ein Moment,
   den die Behandlung durchläuft und der erklärt, was die Person gerade
   spürt: die Dosis ist gestiegen, die erste Woche, die Erhaltung, das
   Plateau. Außerhalb davon spricht der Dosiszyklus.

   ⚠️ WER ÜBERSETZT: der Hut ist die Versalien-Zeile über der Schlagzeile,
   und er muss in zwei Wörter passen — die Startseite zeichnet ihn auf
   einer einzigen Zeile, und was darüber hinausgeht, bricht die Karte.

   ⚠️⚠️ UND DEUTSCH BAUT DIESE HÜTE AUS EINEM WORT, wo Portugiesisch drei
   braucht: „ANTES DE COMEÇAR“ wird „VOR DEM START“, „PESO ESTÁVEL“ wird
   „PLATEAU“. Das Zusammensetzen ist hier der Freund und nicht der Feind —
   der Feind sind die Komposita in den Fließtexten, wo „Behandlungswoche“
   und „Erhaltungsphase“ Zeilen sprengen, die auf Portugiesisch atmen.
   ============================================================ */

export const etapa = {
  /* ---------- 1. es hat noch nicht angefangen ---------- */
  antesChapeu: 'VOR DEM START',

  antesComDoseHead: 'Deine erste Spritze steht noch bevor.',
  /* ⚠️ DER WIRKSTOFF, NICHT DIE MARKE. Wer noch nicht gespritzt hat,
     liest darüber, was sie spüren wird, und was die Wirkung macht, ist die
     Substanz — die Marke hier zu schreiben klänge nach Werbung, in dem
     einen Moment, in dem die Person noch keine eigene Erfahrung dagegen
     zu setzen hat.

     ⚠️ Der Name kommt durch `comum.noMeio`, das im Deutschen nichts tut,
     und auf Portugiesisch geschrieben an — siehe ../de-DE/descobertas. */
  antesComDoseBody: (molecula: string) =>
    `Die ersten Tage mit ${molecula} bringen meist weniger Hunger und eine leichte Übelkeit. Schon jetzt festzuhalten, wie es dir geht, ist das, was später die Vergleichsgrundlage gibt.`,
  antesComDoseQ: 'Was ist am Tag der Spritze zu erwarten?',

  antesSemDoseHead: 'Für deine Behandlung steht noch keine Dosis fest.',
  /* „Wenn dein Team sie festlegt“ und nicht „wenn du sie festlegst“: die
     Dosis entscheidet, wer verschreibt, und die App drängt niemanden zu
     einer Zahl, die ihr nicht gehört. */
  antesSemDoseBody: 'Sobald dein Team sie festlegt, passt sie hier hinein — aus ihr bauen wir den Wochenzyklus und die Erinnerungen.',
  antesSemDoseQ: 'Wie funktioniert der Zyklus des Medikaments?',

  /* ---------- 2. die Dosis ist gestiegen ---------- */
  doseNovaChapeu: 'NEUE DOSIS',
  doseNovaHead: (dose: string, unidade: string) =>
    `Du bist diese Woche auf ${dose} ${unidade} gegangen.`,
  /* ⚠️ DER RAHMEN IST DERSELBE, DIE FÜLLUNG IST IHRE, WENN ES SIE GIBT.
     Mit genug Aufzeichnungen erzählt der Satz das Muster IHRER Übelkeit;
     ohne sie erzählt er das Muster, das üblicherweise auftritt. Beide
     sagen dasselbe, und nur einer davon handelt von ihr. */
  doseNovaBodyCom: (perto: string, longe: string) =>
    `In deinen Aufzeichnungen liegt die Übelkeit an den ersten beiden Tagen nach der Spritze bei ${perto} und fällt ab dem dritten auf ${longe}. Jede Stufe wiederholt dieses Muster meist.`,
  doseNovaBodySem: 'Jede Stufe bringt für ein paar Tage zurück, was schon vorbei war — Übelkeit am häufigsten. Sie lässt in der Regel nach, während der Körper sich einstellt.',
  doseNovaQ: 'Warum ist mir übel?',

  /* ---------- 3. die erste Woche ---------- */
  primeiraChapeu: 'ERSTE WOCHE',
  primeiraHead: 'Das ist deine erste Behandlungswoche.',
  /* „Der Körper lernt das Medikament noch kennen“ — der Satz setzt
     absichtlich den Körper als Subjekt: was gerade passiert, ist weder ein
     Versagen derjenigen, die es nimmt, noch eine Wirkung, die man
     auszuhalten hat, sondern eine Einstellung. */
  primeiraBody: 'Der Körper lernt das Medikament noch kennen. Leichte Übelkeit, weniger Hunger und etwas Müdigkeit sind das, was in den ersten Tagen am häufigsten berichtet wird, und lassen über die Wochen meist nach.',
  primeiraQ: 'Was ist am Tag der Spritze zu erwarten?',

  /* ---------- 4. Erhaltung ---------- */
  manutencaoChapeu: 'ERHALTUNG',
  /* ⚠️ DIE HERKUNFT GEHÖRT IN DEN SATZ, IMMER. „Der Bereich, den dein Team
     festgelegt hat“ darf nur stehen, wenn jemand notiert hat, woher er
     kam — und der Unterschied zwischen den beiden Schlagzeilen ist kein
     Ton, sondern eine Tatsache. */
  manutencaoHeadEquipe: 'Du bist in dem Bereich, den dein Team festgelegt hat.',
  manutencaoHeadDela: 'Du bist bei dem Gewicht, das du dir als Ziel gesetzt hast.',
  /* ⚠️ „HALTEN IST EINE ANDERE ARBEIT ALS ABNEHMEN“ ist der Kern des
     Satzes und keine Verzierung: wer das Ziel erreicht, hört meist, dass
     es geschafft ist — und was darüber entscheidet, ob das Ergebnis
     bleibt, ist genau das, was danach kommt. */
  manutencaoBody: (atual: string, alvo: string, por: string | null) =>
    `${atual}, gegenüber ${alvo}${por ? `, notiert von ${por}` : ''} — und seit mindestens einem Monat in diesem Bereich. Halten ist eine andere Arbeit als Abnehmen, und sie entscheidet, ob das Ergebnis bleibt.`,
  manutencaoQ: 'Wie läuft meine Entwicklung?',

  /* ---------- 5. Plateau ---------- */
  platoChapeu: 'PLATEAU',
  platoHead: 'Dein Gewicht steht seit etwa einem Monat still.',
  /* ⚠️⚠️ DIE ERKLÄRUNG KOMMT VOR JEDEM VORSCHLAG, UND DER VORSCHLAG LAUTET
     NICHT „STRENG DICH MEHR AN“.

     Das Plateau ist Physiologie: der Körper verbraucht weniger, je weniger
     er wiegt, und dieselbe Dosis trifft auf einen anderen Körper. Wer das
     liest, macht dasselbe wie immer und sieht die Waage stehen bleiben —
     das Letzte, was sie braucht, ist eine App, die andeutet, das Problem
     sei sie.

     ⚠️ „DAS GEHÖRT IN DIE SPRECHSTUNDE, NICHT IN DIE ANSTRENGUNG“ ist der
     ganze Satz, und er ist der Grund, warum diese Karte keinen Aktionsknopf
     hat. Irgendetwas in Richtung „sieh, was du tun kannst“ macht die Karte
     kaputt. Wer übersetzt, muss das wissen, bevor er das Verb wählt.

     ⚠️ UND WENN BEIDE ZAHLEN GLEICH RUNDEN, SAGT MAN SIE NICHT ZWEIMAL.
     „78,2 kg vor vier Wochen, 78,2 kg jetzt“ ist exakt und sieht aus wie
     ein Programmfehler — und eine Zahl, die wie ein Fehler aussieht, reißt
     den ganzen Satz mit. */
  platoBodyIgual: (media: string) =>
    `Der Schnitt deiner Wiegungen liegt seitdem bei ${media}. Ein Plateau gehört zur Behandlung dazu: der Körper verbraucht weniger, je weiter das Gewicht fällt. Das gehört in die Sprechstunde, nicht in die Anstrengung.`,
  platoBodyDois: (antes: string, agora: string) =>
    `${antes} vor vier Wochen, ${agora} jetzt. Ein Plateau gehört zur Behandlung dazu: der Körper verbraucht weniger, je weiter das Gewicht fällt. Das gehört in die Sprechstunde, nicht in die Anstrengung.`,
  platoQ: 'Wie läuft meine Entwicklung?',
};
