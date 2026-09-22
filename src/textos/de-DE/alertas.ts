/* ============================================================
   DIE ERINNERUNGEN — die fünf Arten und wie jede sich beschreibt · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/alertas.ts. Jede Art hat drei Stücke,
   und das mittlere gibt es wegen der Breite: `titulo` ist der Name in den
   Einstellungen, `curto` derselbe Name in einer engen Zeile neben einer
   Uhrzeit, `desc` sagt in einem Satz, was sie tut.

   ⚠️ „INJEKTION“ UND NICHT „PEN“. Die Tabelle kennt die Darreichungsform
   der lesenden Person nicht, also muss der Satz Pen, Durchstechflasche
   und Spritze gleichermaßen bedienen. Der Blister liest hier weiterhin
   „Injektion“, und das ist bekannte Schuld — das Wort müsste aus dem
   Vokabular von formas kommen.

   ⚠️ UND DAS CHECK-IN IST DAS EINZIGE, DAS FRAGT. Die anderen vier
   erinnern an Dinge, die man TUT — spritzen, wiegen, trinken, essen.
   Genau deshalb geht es am leichtesten verloren: nichts am Tag erinnert
   daran, zu antworten.
   ============================================================ */

export const alertas = {
  dose: 'Injektion der Dosis',
  doseCurto: 'Injektion',
  doseDesc: 'Eine Erinnerung vor der nächsten Dosis, damit die Behandlung im Takt bleibt.',

  checkin: 'Check-in des Tages',
  checkinCurto: 'Check-in',
  checkinDesc: 'Ein Tippen, um zu beantworten, wie der Tag war — Schlaf, Hunger, Energie und Stimmung.',

  peso: 'Wiegen',
  pesoCurto: 'Wiegen',
  pesoDesc: 'Ein Tippen an den Tagen, an denen du auf die Waage möchtest.',

  agua: 'Trinken',
  aguaCurto: 'Trinken',
  aguaDesc: 'Kleine Anstöße, Wasser zu trinken — sie helfen gegen Hunger und Übelkeit.',

  proteina: 'Eiweiß',
  proteinaCurto: 'Eiweiß',
  proteinaDesc: 'Erinnerung, dem Eiweiß in den Mahlzeiten des Tages den Vortritt zu lassen.',

  /* ---------- wann ---------- */
  /* Der Vorlauf der Injektionserinnerung: am Tag selbst, oder so viele
     Tage vorher.

     ⚠️ „EIN TAG“ UND „ZWEI TAGE“ — der Plural steht ausgeschrieben, nicht
     als angehängtes „s“ wie im Portugiesischen. */
  noDia: 'Am Tag selbst',
  diasAntes: (n: number) => `${n} ${n === 1 ? 'Tag' : 'Tage'} vorher`,

  /* ⚠️ DIE DREI WOCHEN-ABKÜRZUNGEN SIND MENGENNAMEN, keine Aufzählung.
     „Montag, Dienstag, Mittwoch, Donnerstag, Freitag“ ist richtig und
     liest niemand; „Werktags“ ist dasselbe in einem Wort. */
  todoDia: 'Täglich',
  diasUteis: 'Werktags',
  fimDeSemana: 'Am Wochenende',
  /* Die lose Liste, wenn es keine der drei Abkürzungen ist. */
  listaDeDias: (primeiro: string, resto: string[]) =>
    primeiro + (resto.length ? `, ${resto.join(', ')}` : ''),

  /* ⚠️ DAS INTERVALL SAGT SICH ALS REGEL, nicht als Liste. „Alle 2 Std.,
     8–20 Uhr“ ist ein Satz; die sieben Uhrzeiten, die er erzeugt, passten
     weder in die Zeile noch in den Kopf von jemandem, der nur nachsehen
     will, was eingestellt ist.

     ⚠️ UND DEUTSCH SETZT DAS „UHR“ ANS ENDE, einmal, und nicht an jede
     Zahl: „8–20 Uhr“, nicht „8 Uhr bis 20 Uhr“. */
  aCada: (cada: number, de: number, ate: number) => `alle ${cada} Std., ${de}–${ate} Uhr`,
  quandoEHoras: (quando: string, horas: string) => `${quando} · ${horas}`,
};
