/* ============================================================
   GLI AVVISI — le due righe che compaiono sulla schermata di blocco
   · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/avisos.ts. Chi legge questo è per
   strada, in mezzo a qualcos'altro: nessuno dei cinque rimprovera,
   nessuno dice "non hai", e nessuno afferma quello che l'app non sa a
   quell'ora — se ha già bevuto, se ha già mangiato, se si è già pesata.

   ⚠️ E QUELLO DEL CHECK-IN FA UNA DOMANDA invece di dare un ordine. È
   l'unico dei cinque così, perché il check-in è una domanda: "Fai il
   check-in" tratta da compito una cosa che è conversazione.
   ============================================================ */

export const avisos = {
  /* ---------- la puntura, a tre distanze ---------- */
  /* Il `dose` arriva pronto — "Mounjaro 5 mg" —, e il contenitore con
     l'articolo viene da logic/formas: "lasciare la penna in vista",
     "lasciare il flacone in vista". */
  doseHoje: (acao: string) => `La tua ${acao} è oggi`,
  doseHojeCorpo: (dose: string) => `${dose}. Quando puoi, registrala qui.`,
  doseAmanha: (acao: string) => `La tua ${acao} è domani`,
  doseAmanhaCorpo: (dose: string, oRecipiente: string) => `${dose}. Vale la pena lasciare ${oRecipiente} in vista.`,
  doseEmDias: (dias: number, acao: string) => `La tua ${acao} è tra ${dias} giorni`,
  doseEmDiasCorpo: (dose: string, doRecipiente: string) => `${dose}. C’è tempo per controllare la scorta ${doRecipiente}.`,

  /* ---------- gli altri quattro ---------- */
  checkin: 'Com’è andata oggi?',
  checkinCorpo: 'Sonno, fame, energia e umore — quattro risposte, e la giornata è registrata.',
  peso: 'Giorno di pesata',
  pesoCorpo: 'Sali sulla bilancia quando ti viene comodo. Un numero a settimana disegna già la curva.',
  agua: 'Un bicchiere d’acqua',
  aguaCorpo: 'Aiuta con la sazietà e con la nausea — e conta per l’obiettivo del giorno.',
  proteina: 'Prima le proteine',
  proteinaCorpo: 'Al prossimo pasto, comincia da lì. Sono loro a tenere la massa magra.',
};
