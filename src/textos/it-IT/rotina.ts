/* ============================================================
   LA ROUTINE — il protocollo, i suggerimenti, la preparazione e quello
   che è passato · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/rotina.ts.
   ============================================================ */

export const rotina = {
  /* ============================================================
     LE DOMANDE SUGGERITE

     ⚠️ SONO DOMANDE SUE, NON OFFERTE NOSTRE. "Perché oggi ho avuto più
     fame?" è come uno pensa; "Scopri il ritorno della fame" è come parla
     un menu. La prima persona è quello che fa sembrare l'elenco una
     conversazione.
     ============================================================ */
  perguntas: {
    maisFome: 'Perché oggi ho avuto più fame?',
    semFome: 'Perché non ho fame?',
    depoisDaAplicacao: 'Che cosa aspettarsi dopo la puntura?',
    diminuirEnjoo: 'Come far scendere la nausea?',
    trocarODia: 'Posso cambiare il giorno della puntura?',
    meusExames: 'Che cosa dicono i miei esami?',
    meuProgresso: 'Analizza i miei progressi',
    prepararConsulta: 'Prepara la mia visita',
  },

  /* ============================================================
     LE SPINTE DEL GIORNO

     ⚠️⚠️ L'IMPERATIVO QUI È DI PROPOSITO — "Bevi ancora acqua oggi",
     "Chiedi il rinnovo". In una ricerca di testo che rimprovera la
     persona questo elenco compare tutto intero e sembra il peggior
     ritrovamento dell'app; non lo è.

     Rimproverare è l'app che giudica quello che è già passato. Questo è
     il formato di un elenco di cose da fare, ed è quello che la persona
     ha aperto la schermata per vedere: è venuta a chiedere che cosa fare.

     ⚠️ QUELLO CHE NON PUÒ ESSERE IMPERATIVO È IL `porque`: lì vive il
     fatto, e un fatto con un verbo d'ordine diventa una predica. Chi
     traduce deve tenere la differenza — quello sopra ordina, quello sotto
     spiega.
     ============================================================ */
  empurroes: {
    agua: 'Bevi ancora acqua oggi',
    /* ⚠️ IL MOTIVO ERA UN AMMANCO CON IL NOME DELLA PERSONA DAVANTI. "Sei
       sotto la metà dell'obiettivo" mette il soggetto al posto di chi ha
       fallito. Quello che manca di acqua è un fatto della giornata, non un
       difetto di carattere. */
    aguaPorqueComEnjoo: 'Nei tuoi giorni ben idratati la nausea si fa sentire meno — e la giornata è ancora a metà dell’obiettivo',
    aguaPorque: 'La giornata è ancora a metà dell’obiettivo, e l’acqua sostiene la sazietà fino alla fine',

    proteina: 'Rinforza le proteine a cena',
    proteinaPorque: 'Sei nella fase del ciclo in cui la fame torna, e le proteine di oggi si vedono nella fame di domani',

    checkin: 'Fai il check-in di oggi',
    checkinPorque: 'È il registro che alimenta tutto quello che riesco a vedere di te',

    /* Il contenitore con l'articolo arriva da logic/formas: "Prepara la
       penna", "Prepara il flacone". */
    aplicacao: (recipiente: string) => `Prepara ${recipiente} e scegli la zona`,
    aplicacaoPorque: 'La puntura della settimana si avvicina, e cambiare zona riduce l’irritazione della pelle',

    receita: 'Chiedi il rinnovo della ricetta',
    /* ⚠️⚠️ LA PAROLA "dosi" STAVA NEL CODICE, e non qui. Il punto di
       chiamata montava `${p.left} doses ${noNa(forma)}` e mandava la frase
       già pronta — in portoghese, spagnolo e francese "doses" è la stessa
       parola, ed è per questo che nessuno se n'era accorto. In italiano
       il plurale è "dosi", non "dose", e la riga sarebbe uscita tradotta a
       metà, come succedeva in tedesco. */
    receitaPorque: (doses: number, onde: string) =>
      `${doses === 1 ? 'Resta' : 'Restano'} ${doses} ${doses === 1 ? 'dose' : 'dosi'} ${onde} — chiedendolo adesso, arriva prima che finiscano`,

    /* Il testo dell'esame viene dal protocollo; nostro è il motivo. */
    examePorque: 'È ancora aperto nel protocollo di questa settimana, e il risultato di solito ci mette qualche giorno',

    consulta: 'Prepara le tue domande per la visita',
    consultaPorque: (tipo: string, doutor: string) =>
      `${tipo} con ${doutor} — il riepilogo lo preparo io, tu scegli che cosa chiedere`,
  },

  /* ⚠️ L'ETICHETTA DEL GRUPPO ESCE DALLA SCADENZA, E LA SCADENZA ESCE DAL
     DATO. "Questa settimana: prenotare l'esame" è un elenco di cose da
     fare; "Fra 9 giorni: prepara le domande" è qualcuno che organizza
     l'agenda di un'altra persona. */
  prazo: {
    hoje: 'Oggi',
    amanha: 'Domani',
    estaSemana: 'Questa settimana',
    daquiA: (dias: number) => `Tra ${dias} giorni`,
  },

  /* ============================================================
     IL PROTOCOLLO DELLA SETTIMANA

     ⚠️ QUESTE FRASI SONO QUELLO CHE LA CLINICA PRESCRIVE, e per questo il
     registro è più formale del resto dell'app.
     ============================================================ */
  protocolo: {
    aguaTodoDia: (quanto: string) => `Bere ${quanto} tutti i giorni`,
    aguaEmDias: (quanto: string, dias: number) => `Bere ${quanto} in ${dias} giorni`,
    origemAgua: 'Idratazione',

    proteinaTodoDia: (gramas: number) => `Mangiare ${gramas} g di proteine tutti i giorni`,
    proteinaEmDias: (gramas: number, dias: number) => `Mangiare ${gramas} g di proteine in ${dias} giorni`,
    origemProteina: 'Alimentazione',

    /* Giorni CON MOVIMENTO, e non minuti: è quello che la voce chiede —
       alzarsi dal divano tre volte — ed è quello che il registro sa dire
       senza tirare a indovinare la disciplina. */
    exercicio: (dias: number) => `Muoversi in ${dias} ${dias === 1 ? 'giorno' : 'giorni'} della settimana`,
    origemExercicio: 'Movimento',

    aplicacaoUma: 'Puntura della settimana',
    aplicacaoVarias: (quantas: number) => `${quantas} punture nella settimana`,
    origemAplicacao: 'Punture',

    /* Che cosa si conta in ogni voce. "1 di 1 giorno" non descrive
       un'iniezione, per questo la puntura porta la sua coppia. */
    unidadeDia: ['giorno', 'giorni'] as [string, string],
    unidadeAplicacao: ['puntura', 'punture'] as [string, string],
    nota: (feito: number, alvo: number, unidade: string) => `${feito} di ${alvo} ${unidade}`,
  },

  /* ============================================================
     LE SETTIMANE PRECEDENTI — lo stesso obiettivo, letto dopo

     ⚠️ IL RIASSUNTO DI OGNI OBIETTIVO DICE LA MEDIA, E NON SE È STATO
     RISPETTATO. La settimana è già passata; rimproverare quello che non
     si può più cambiare non serve a nessuno.
     ============================================================ */
  semanas: {
    aguaMeta: (quanto: string) => `Bere ${quanto} tutti i giorni`,
    proteinaMeta: (gramas: number) => `Mangiare ${gramas} g di proteine tutti i giorni`,
    exercicioMeta: (dias: number) => `Muoversi in ${dias} giorni della settimana`,
    semRegistro: 'nessuna registrazione nella settimana',
    mediaDeAgua: (quanto: string) => `media di ${quanto} al giorno`,
    mediaDeProteina: (gramas: number) => `media di ${gramas} g al giorno`,
    minutosNaSemana: (minutos: number) => `${minutos} min nella settimana`,
    semMovimento: 'nessun movimento registrato',
  },

  /* ============================================================
     LA PREPARAZIONE DELLA VISITA

     ⚠️ OGNI VOCE HA DUE TITOLI, e la differenza fra i due è quello che il
     blocco fa: pronto, NOMINA quello che già esiste ("Peso aggiornato");
     in sospeso, dice che cosa FARE ("Pesati prima").
     ============================================================ */
  preparo: {
    pesoNenhum: 'Registrare il peso',
    pesoNenhumSub: 'Ancora nessuna pesata',
    pesoEmDia: 'Peso aggiornato',
    pesoAntigo: 'Pesati prima',
    pesoAntigoSub: (quando: string) => `Ultima pesata ${quando}`,
    pesoSub: (peso: string, quando: string) => `${peso} · ${quando}`,

    notasProntas: 'Domande annotate',
    notasProntasSub: (quantas: number) => `${quantas} da portare`,
    notasVazias: 'Annotare le domande',
    notasVaziasSub: 'Ancora niente di annotato',

    examesRecentes: 'Esami recenti',
    examesRecentesSub: (nome: string, quando: string) => `${nome} · ${quando}`,
    exames: 'Esami',
    examesAntigosSub: (quando: string) => `L’ultimo è stato ${quando}`,
    examesNenhumSub: 'Nessun esame salvato',
  },

  /* ⚠️ LA STESSA FRASE SU TUTTE LE RIGHE DELLA PREPARAZIONE, perché
     l'occhio confronti le date invece di tradurle.

     ⚠️ E IN ITALIANO IL PASSATO VA IN FONDO: "un mese fa", non "fa un
     mese". Il portoghese e lo spagnolo lo mettono davanti ("há um mês",
     "hace un mes"), l'italiano e l'inglese in coda. È la stessa nota di
     tempo.ts, e qui torna su quattro righe. */
  quando: {
    hoje: 'oggi',
    ontem: 'ieri',
    haDias: (dias: number) => `${dias} giorni fa`,
    haUmMes: 'un mese fa',
    haMeses: (meses: number) => `${meses} mesi fa`,
  },

  /* ============================================================
     CHE COSA È CAMBIATO NEL PERIODO DI UNA VISITA
     ============================================================ */
  periodo: {
    pesoEstavel: 'Peso stabile',
    pesoDe: (de: string, para: string) => `Da ${de} a ${para}`,
    doseNova: (dose: string) => `Dose a ${dose} mg`,
    doseAnterior: (dose: string) => `Veniva da ${dose} mg`,
    umaAplicacao: '1 puntura',
    aplicacoes: (quantas: number) => `${quantas} punture`,
    marcadores: (quantos: number) => `${quantos} marcatori`,
    umaOrientacao: '1 indicazione del team',
    orientacoes: (quantas: number) => `${quantas} indicazioni del team`,
    /* Quando lo storico non dice il tipo di visita. */
    consultaSemTipo: 'Visita',
  },

  /* ⚠️ "TU" È ETICHETTA ED È SENTINELLA INSIEME. Un allenamento senza
     `fonte` registrata è manuale — manuale è quello che esisteva prima
     che esistesse un'origine — e la schermata non mostra mai l'assenza:
     mostra "Tu", perché l'assenza non risponde a "chi l'ha registrato",
     risponde "non lo so". */
  origemManual: 'Tu',

  /* Il bollino di ogni fase del ciclo rispetto a oggi. */
  selo: {
    passou: 'passata',
    agora: 'adesso',
    amanha: 'domani',
    emDias: (dias: number) => `tra ${dias} giorni`,
  },
};
