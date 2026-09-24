/* ============================================================
   LA FASE DELLA TERAPIA — i messaggi che aprono la Home · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/etapa.ts. Leggilo prima di cambiare
   una parola: la scheda del plateau in particolare porta una regola che
   in traduzione si disfa con niente.

   ⚠️ IL CAPPELLO DEVE STARE IN DUE PAROLE. È l'etichetta in maiuscolo
   sopra il titolo, disegnata su una riga sola — quello che la supera
   rompe la scheda.
   ============================================================ */

export const etapa = {
  /* ---------- 1. non è ancora cominciata ---------- */
  antesChapeu: 'PRIMA DI INIZIARE',

  antesComDoseHead: 'La tua prima puntura deve ancora arrivare.',
  /* ⚠️ LA MOLECOLA, E NON LA MARCA. Chi non ha ancora fatto la prima
     puntura sta leggendo di quello che sentirà, e a produrre l'effetto è
     la sostanza — scrivere la marca qui suonerebbe come pubblicità
     nell'unico momento in cui la persona non ha ancora un'esperienza
     propria da opporre. */
  antesComDoseBody: (molecula: string) =>
    `I primi giorni di terapia con ${molecula} di solito portano meno fame e una nausea leggera. Registrare come ti senti fin da ora è quello che dà una base di confronto dopo.`,
  antesComDoseQ: 'Che cosa aspettarsi il giorno della puntura?',

  antesSemDoseHead: 'La tua terapia non ha ancora una dose definita.',
  /* "Quando la definisce il tuo team" e non "quando la definisci tu": la
     dose è decisione di chi prescrive, e l'app non spinge la persona a
     scegliere un numero che non è suo. */
  antesSemDoseBody: 'Quando la definisce il tuo team, va qui — è da lei che costruiamo il ciclo della settimana e i promemoria.',
  antesSemDoseQ: 'Come funziona il ciclo del farmaco?',

  /* ---------- 2. la dose è salita ---------- */
  doseNovaChapeu: 'DOSE NUOVA',
  doseNovaHead: (dose: string, unidade: string) =>
    `Questa settimana sei salita a ${dose} ${unidade}.`,
  /* ⚠️ LA CORNICE È LA STESSA E IL CONTENUTO È SUO QUANDO ESISTE. Con
     abbastanza registri la frase racconta il disegno della SUA nausea;
     senza, racconta quello che di solito succede. */
  doseNovaBodyCom: (perto: string, longe: string) =>
    `Nei tuoi registri la nausea resta a ${perto} nei primi due giorni dopo la puntura e scende a ${longe} dal terzo in poi. Ogni gradino di solito ripete questo disegno.`,
  doseNovaBodySem: 'Ogni gradino di solito riporta indietro, per qualche giorno, quello che era già passato — la nausea più spesso di tutto. Tende a cedere man mano che il tuo corpo si adatta.',
  doseNovaQ: 'Perché ho la nausea?',

  /* ---------- 3. la prima settimana ---------- */
  primeiraChapeu: 'PRIMA SETTIMANA',
  primeiraHead: 'Questa è la tua prima settimana di terapia.',
  /* ⚠️ IL CORPO È IL SOGGETTO, di proposito: quello che sta succedendo non
     è un fallimento della persona e non è qualcosa da sopportare, è un
     adattamento. Il corpo resta quello che agisce. */
  primeiraBody: 'Il tuo corpo sta ancora conoscendo il farmaco. Nausea leggera, meno fame e un po’ di stanchezza sono i racconti più comuni dei primi giorni, e di solito calano con le settimane.',
  primeiraQ: 'Che cosa aspettarsi il giorno della puntura?',

  /* ---------- 4. mantenimento ---------- */
  manutencaoChapeu: 'MANTENIMENTO',
  /* ⚠️ LA PROVENIENZA ENTRA NELLA FRASE, SEMPRE. "La fascia che il tuo
     team ha definito" si può dire solo quando qualcuno ha annotato da chi
     viene — e la differenza fra i due titoli non è di tono, è di fatto. */
  manutencaoHeadEquipe: 'Sei nella fascia che il tuo team ha definito.',
  manutencaoHeadDela: 'Sei al peso che ti sei data come obiettivo.',
  /* ⚠️ "MANTENERE È UN LAVORO DIVERSO DAL PERDERE" è il cuore della frase,
     non un ornamento: chi arriva all'obiettivo di solito si sente dire
     che ha finito, e quello che decide se il risultato resta è proprio
     ciò che viene dopo. */
  manutencaoBody: (atual: string, alvo: string, por: string | null) =>
    `${atual}, contro ${alvo}${por ? ` annotati da ${por}` : ''} — e da almeno un mese in quella fascia. Mantenere è un lavoro diverso dal perdere, ed è quello che decide se il risultato resta.`,
  manutencaoQ: 'Come sta andando in generale?',

  /* ---------- 5. plateau ---------- */
  platoChapeu: 'PESO FERMO',
  platoHead: 'Il tuo peso è fermo da circa un mese.',
  /* ⚠️⚠️ LA SPIEGAZIONE VIENE PRIMA DI QUALSIASI SUGGERIMENTO, E IL
     SUGGERIMENTO NON È "IMPEGNATI DI PIÙ".

     Il plateau è fisiologia: il corpo consuma meno man mano che pesa
     meno, e la stessa dose incontra ormai un corpo diverso. Chi legge
     questo sta facendo quello che ha sempre fatto e vede la bilancia
     fermarsi — l'ultima cosa di cui ha bisogno è un'app che le faccia
     intendere che il problema è lei.

     ⚠️ "È ARGOMENTO DA VISITA, NON QUESTIONE DI IMPEGNO" è la frase
     intera in sei parole, ed è il motivo per cui questa scheda non ha un
     pulsante d'azione. Qualunque cosa sulla linea di "ecco che cosa puoi
     fare" disfa la scheda.

     ⚠️ E QUANDO I DUE NUMERI ARROTONDANO UGUALI, NON SI DICE DUE VOLTE.
     "78,2 kg quattro settimane fa, 78,2 kg adesso" è esatto e sembra un
     difetto del codice. */
  platoBodyIgual: (media: string) =>
    `La media delle tue pesate è a ${media} da allora. Il plateau è una parte attesa della terapia: il tuo corpo comincia a consumare meno man mano che il peso scende. È argomento da visita, non questione di impegno.`,
  platoBodyDois: (antes: string, agora: string) =>
    `${antes} quattro settimane fa, ${agora} adesso. Il plateau è una parte attesa della terapia: il tuo corpo comincia a consumare meno man mano che il peso scende. È argomento da visita, non questione di impegno.`,
  platoQ: 'Come sta andando in generale?',
};
