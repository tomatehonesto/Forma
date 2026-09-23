/* ============================================================
   LA LINGUA — la prima domanda della registrazione, e la schermata del
   profilo · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/idioma.ts: questo è l'unico testo
   dell'app che qualcuno può leggere senza capirlo, perché esce prima che
   la lingua sia scelta. A salvare la schermata è l'elenco, dove ogni
   opzione è scritta nella propria lingua, non la frase.

   ⚠️⚠️ E QUI SI DECIDE LA PAROLA: "L'APP", E NON "L'APPLICAZIONE".

   Le due sono corrette in italiano, e la seconda sembrerebbe la scelta
   più sobria — è quella che hanno preso lo spagnolo ("la aplicación") e
   il francese ("l'application"). In italiano però "applicazione" è anche
   il gesto di applicare qualcosa sul corpo, ed è esattamente la
   collisione che è costata cara allo spagnolo: lì "aplicación" voleva
   dire l'app E l'iniezione, e la frase "nunca escribimos nada en esas
   aplicaciones" è rimasta rotta per settimane.

   "App" in italiano non ha quel secondo senso, si scrive e si legge come
   in tedesco, e nessuno la confonde con una puntura. Vale per tutto il
   catalogo: qui si dice "l'app".
   ============================================================ */

export const idioma = {
  /* La domanda della registrazione. */
  pergunta: 'In che lingua vuoi leggere?',
  sub: 'Cambia il testo, i numeri e le date. Puoi cambiarla dopo, nel profilo.',

  /* La schermata del profilo, dove si cambia. */
  titulo: 'Lingua',
  rotulo: 'Come leggi l’app',

  /* ⚠️ LA PRECISAZIONE È LA PARTE CHE SORPRENDE. Passare a English cambia
     anche la virgola decimale e il disegno della data — sono lo stesso
     valore, e il motivo sta in alto in logic/local. Quello che NON cambia
     è ciò che è già registrato, e dirlo è ciò che toglie la paura di
     toccare. */
  ressalva: 'Quello che hai già registrato resta com’è. Cambia solo il modo di scrivere: la parola, la virgola del numero, il disegno della data e l’orologio.',
};
