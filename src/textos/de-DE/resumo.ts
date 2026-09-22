/* ============================================================
   DIE ZUSAMMENFASSUNG FÜR DEN TERMIN — das Blatt, das mitgeht · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/resumo.ts. Die, die alles bestimmt:
   DIESER TEXT GEHT AN DIE ÄRZTIN, und er ist der einzige der App, der sie
   verlässt. Das ändert zweierlei am Schreiben:

   DAS REGISTER IST FÖRMLICHER als sonst. „Rhythmus“, „Veränderung“,
   „In“ — das sind Tabellenköpfe einer klinischen Aufstellung, nicht die
   Gesprächsstimme der Startseite. Wer das auf der anderen Seite liest,
   hat zwei Minuten und sucht Zahlen.

   ⚠️⚠️ UND HIER STEHT DER EINE ORT, AN DEM DIESER KATALOG NICHT DUZT. Die
   App duzt die Person; dieses Blatt redet niemanden an. Es hat keine
   Anrede, weil es keine braucht — es sind Überschriften und Zahlen, und
   die einzige ganze Aussage ist die Herkunftszeile am Ende.

   UND DIE HERKUNFT GEHT MIT, in der letzten Zeile. Wer das als Nachricht
   bekommt, muss wissen, dass es aus einer Begleit-App stammt und nicht
   aus einer Akte — und dass die Zahlen das sind, was die PERSON erfasst
   hat.

   ⚠️ JEDES SYMPTOM MIT SEINER EINHEIT. Übelkeit, Hunger und Energie sind
   Skalen von null bis zehn; Schlaf ist Uhrzeit. Ein ganzer Abschnitt mit
   der Überschrift „(0–10)“ legte sieben Stunden Schlaf an dieselbe
   Latte wie eine Übelkeit von sieben.
   ============================================================ */

export const resumo = {
  /* ---------------- Medikation ---------------- */
  medicacao: 'Medikation',
  medicamento: 'Medikament',
  dose: 'Dosis',
  cadencia: 'Rhythmus',
  tempoDeTratamento: 'Behandlungsdauer',
  emDias: (dias: number) => `${dias} Tage`,
  aplicacoes: 'Injektionen',
  aplicacoesValor: (feitas: number, previstas: number) => `${feitas} von ${previstas} vorgesehenen`,

  /* ---------------- Gewicht ---------------- */
  peso: 'Gewicht',
  inicioAtual: 'Start → aktuell',
  variacao: 'Veränderung',
  em: 'In',
  metaDePeso: 'Zielgewicht',

  /* ---------------- Beschwerden ---------------- */
  sintomas: 'Beschwerden',
  mediaDosDias: (comResposta: number) => `Mittel der letzten 14 Tage · ${comResposta} mit Antwort`,
  semRespostas: 'Keine Antworten in den letzten 14 Tagen',
  nausea: 'Übelkeit',
  fome: 'Hunger',
  energia: 'Energie',
  sono: 'Schlaf',
  de10: ' von 10',
  horas: ' Std.',

  /* ---------------- Befunde und Notizen ---------------- */
  examesRecentes: 'Aktuelle Befunde',
  anotacoes: 'Notizen für den Termin',
  semAnotacoes: '(keine Notizen)',

  /* ---------------- der Text, der verschickt wird ---------------- */
  cabecalho: (nome: string) => `BEHANDLUNGSÜBERSICHT — ${nome}`,
  paraDoutor: (doutor: string) => ` · für ${doutor}`,
  origem: 'Von der App aus den eigenen Aufzeichnungen der Person erstellt.',

  /* Das abgelegte Dokument, in der Dokumentenliste. */
  nomeDoDocumento: 'Behandlungsübersicht',
  enviadoPara: (doutor: string) => `Von dir an ${doutor} geschickt`,
  enviado: 'Von dir geschickt',
};
