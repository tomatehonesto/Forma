/* ============================================================
   L'EQUILIBRIO — la lettura del radar, in due frasi · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/equilibrio.ts. Il radar mostra otto
   assi e non conclude niente; chi dovrebbe concludere è la persona, che
   non sa se 62% di proteine sia buono. Allora conclude questa frase, e
   il grafico diventa la sua illustrazione.

   ⚠️ PARLA IN PRIMA PERSONA SINGOLARE, ED È DI PROPOSITO. "Il tuo
   equilibrio è costante" è un referto, e chi scrive referti è un
   sistema. "Una cosa mi ha colpito" è qualcuno che ha guardato i dati e
   ha deciso di commentare. È la voce del compagno — la stessa che in
   cadastro dice "costruisco io la scala delle dosi" — e non quella del
   prodotto, che parla al plurale.

   ⚠️ E LA LETTURA NON ORDINA MAI NIENTE. La versione più seria dice
   "sarebbe il mio punto d'attenzione per la settimana prossima" —
   condizionale, prima persona, un suggerimento su dove guardare.
   ============================================================ */

export const equilibrio = {
  /* ============================================================
     GLI OTTO ASSI

     ⚠️ "SAZIETÀ" NON È IL NOME DELLA COLONNA. La persona risponde alla
     FAME nel check-in, e l'asse mostra il suo contrario: più fame, meno
     sazietà. Il nome dell'asse è quello del lato buono, perché in un
     grafico dove tutto cresce verso l'esterno anche l'asse deve
     crescere. Vedi logic/escalas.
     ============================================================ */
  eixos: {
    sono: 'Sonno',
    energia: 'Energia',
    humor: 'Umore',
    hidratacao: 'Idratazione',
    exercicio: 'Movimento',
    proteina: 'Proteine',
    saciedade: 'Sazietà',
    adesao: 'Aderenza',
  },

  /* ============================================================
     LE TRE APERTURE

     La scelta dipende dall'AMPIEZZA fra l'asse migliore e il peggiore:
     è lei a dire se la terapia è equilibrata o poggiata su una gamba
     sola. Fino a 30, fino a 55, e oltre.
     ============================================================ */
  aberturaTudoBem: 'Ho notato una cosa bella.',
  aberturaAtencao: 'Una cosa mi ha colpito.',
  aberturaPreciso: 'Devo farti vedere una cosa.',

  /* ============================================================
     IL CORPO — due frasi, e non quattro
     ============================================================ */

  /* ⚠️⚠️ QUESTA COPPIA È UNA TRAPPOLA DI TRADUZIONE, ed è il motivo per
     cui è una funzione e non una concatenazione là fuori.

     In italiano i due nomi aprono la frase da soli e il SECONDO va in
     minuscolo: "Sonno e aderenza tirano su". Senza il possessivo davanti,
     di proposito — "il tuo sonno e aderenza" non regge, e aggiustarlo con
     "il tuo sonno e la tua aderenza" appesantisce la frase.

     In tedesco il sostantivo non scende in minuscolo; in inglese la "and"
     qui non vuole la virgola. Chi traduce cambia QUESTA funzione, non il
     resto. */
  par: (primeiro: string, segundo: string) => `${primeiro} e ${segundo.toLowerCase()}`,

  corpoEquilibrado: (doisFortes: string, fraco: string) =>
    `${doisFortes} tirano su, e nemmeno ${fraco.toLowerCase()} è rimasta indietro. Per ora non cambierei niente.`,
  corpoUmAtras: (doisFortes: string, fraco: string) =>
    `${doisFortes} sono costanti. ${fraco} è quella che oscilla di più — sarebbe il mio punto d’attenzione per la settimana prossima.`,

  /* ============================================================
     IL PULSANTE E LA DOMANDA — la stessa frase, di proposito

     ⚠️ IL PULSANTE PORTA LA DOMANDA AL COMPANION. Se il testo del
     pulsante e la domanda inviata divergono, la persona tocca una cosa e
     riceve la risposta di un'altra.
     ============================================================ */
  botaoMelhorar: (eixo: string) => `Come migliorare ${eixo.toLowerCase()}`,
  perguntaMelhorar: (eixo: string) => `Come migliorare ${eixo.toLowerCase()}?`,

  /* Il cappello del grafico a barre: l'asse in maiuscolo e quanti giorni
     copre la serie. È qui perché anche `toUpperCase()` è operazione di
     lingua. */
  serieDe: (eixo: string, dias: number) => `${eixo.toUpperCase()} · ULTIMI ${dias} GIORNI`,
};
