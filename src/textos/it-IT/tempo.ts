/* ============================================================
   IL TEMPO DETTO ALLE PERSONE — "oggi", "ieri", "tra 3 giorni" · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/tempo.ts. Qui bastano due note
   italiane.

   ⚠️⚠️ IL PASSATO VA IN FONDO, IL FUTURO IN TESTA. "tra 3 giorni" ma "3
   giorni fa" — l'italiano cambia la POSIZIONE e non solo la parola, come
   l'inglese con "in" e "ago", e al contrario del portoghese, che mette
   "há" e "em" tutti e due davanti. È il motivo per cui questa è una
   funzione per lingua e non una tabella di parole.

   ⚠️ "TRA" E "FRA" SONO LA STESSA PAROLA, e si sceglie a orecchio: si
   evita quella che ripete il suono di quel che segue. "fra tre giorni"
   ha tre erre in due parole; "tra tre giorni" ne ha altrettante. Qui il
   numero è sempre una cifra — "tra 3 giorni" —, quindi la cacofonia non
   si presenta e resta "tra", che è la forma più corrente.
   ============================================================ */

export const tempo = {
  /** Solo in avanti: "oggi", "domani", "tra 3 giorni". */
  daquiA: (dias: number) => (dias <= 0 ? 'oggi' : dias === 1 ? 'domani' : `tra ${dias} giorni`),

  /** Nelle due direzioni. Negativo è passato. */
  relativo: (dias: number) => {
    if (dias === 0) return 'oggi';
    if (dias === -1) return 'ieri';
    if (dias === 1) return 'domani';
    return dias < 0 ? `${-dias} giorni fa` : `tra ${dias} giorni`;
  },
};
