/* ============================================================
   L'ABBONAMENTO — che cosa vale, quanto costa, dove si cambia · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/assinatura.ts. È UNA SOLA SCHERMATA,
   CON UN'UNICA ETICHETTA, e il catalogo deve conservarlo: chi è paziente
   di una clinica partner legge "Senza costo" NELLO STESSO punto in cui
   chi paga legge "29,99 €". Una lingua che si inventasse una frase più
   lunga per il caso esente disferebbe il disegno.

   ⚠️ QUELLO CHE NON STA QUI, E NON CI STA DI PROPOSITO: "Care" e
   "Personal" sono nomi dei nostri piani e non si traducono; "App Store" e
   "Google Play" sono marchi; le scorciatoie di sviluppo spariscono in
   produzione.

   ⚠️⚠️ E IL TESTO DELL'ESENZIONE NASCE DALLA SEZIONE 4 DEI TERMINI. Non
   è una frase di schermata: è l'impegno che il documento si assume,
   ripetuto dove conta. Se i due si allontanano, uno diventa la versione
   sbagliata per chi ha letto l'altro — e ad avere ragione è il documento.
   ============================================================ */

export const assinatura = {
  /* ============================================================
     I PIANI

     ⚠️ IL SUFFISSO NON È UNA CHIAVE. C'erano due schermate che chiedevano
     `p.sufixo === '/mês'` per sapere quale fosse il piano mensile — un
     confronto di testo che faceva il lavoro di un id. In inglese il
     suffisso è "/mo", il confronto falliva in silenzio, e la schermata
     del prezzo passava a dire che i piani partono dal prezzo annuale.
     ============================================================ */
  mensal: 'Mensile',
  anual: 'Annuale',
  porAno: 'all’anno',
  porAnoCurto: '/anno',

  /* ============================================================
     LA SCHERMATA
     ============================================================ */

  /* ⚠️ UNA CHIAVE SOLA per il titolo della schermata e l'etichetta della
     scheda. Sono lo stesso argomento detto nello stesso posto, e
     separarli in due chiavi è invitarli a divergere. */
  titulo: 'Il tuo abbonamento',

  semCusto: 'Senza costo',

  /* Quando non sappiamo il nome del centro. Entra in mezzo a una frase, e
     per questo è in minuscolo. */
  clinicaGenerica: 'il centro che ti segue',
  cobertoPelaClinica: (clinica: string) => `Il legame con ${clinica} copre tutta l’app.`,

  /* La scheda: etichetta a sinistra, valore a destra. */
  vinculadaDesde: 'Collegata dal',
  codigoDeConvite: 'Codice di invito',
  periodicidade: 'Periodicità',
  primeiraCobranca: 'Primo addebito',
  proximaCobranca: 'Prossimo addebito',
  cobrancaPela: 'Addebito tramite',
  naoHa: 'Non c’è',

  /* ⚠️ "HAI TUTTO COM'È" VIENE PRIMA DEL PREZZO, e l'ordine è il
     messaggio: chi ha aperto questa schermata senza abbonarsi non sta
     pagando niente, e scoprirlo non può dipendere dal leggere la seconda
     frase. */
  semPlano: (menorPorMes: string) => `Hai tutto com’è. I piani partono da ${menorPorMes} al mese.`,

  /* Le azioni. Senza sottotitolo, perché nessuna di loro ha conseguenze:
     ognuna apre una schermata. */
  mudarDePlano: 'Cambia piano',
  verOsPlanos: 'Vedi i piani',
  formaDePagamento: 'Metodo di pagamento',
  historicoDeCobranca: 'Storico degli addebiti',

  trocarClinica: 'Cambia il centro che ti segue',

  /* ⚠️ QUESTE DUE HANNO IL SOTTOTITOLO, per il motivo opposto alle altre:
     chi sta pagando e inserisce un codice di una clinica partner SMETTE
     DI PAGARE. È la conseguenza più grande della schermata, e non c'è
     modo di indovinarla da un'etichetta che dice "inserisci codice". */
  inserirCodigo: 'Inserisci il codice',
  inserirCodigoSub: 'I pazienti dei centri partner non pagano il costo dell’app',
  medicosParceiros: 'Medici partner',
  medicosParceirosSub: 'Chi si cura in un centro partner non paga',

  cancelar: 'Disdici l’abbonamento',

  /* ============================================================
     LE TRE NOTE IN FONDO

     ⚠️ IL TITOLO NON È LO STESSO NEI TRE. "È bene che tu lo sappia" serve
     all'avviso che è solo informazione; quello che avvisa di soldi fermi
     deve dirlo nel titolo, altrimenti diventa l'ennesima nota a piè di
     pagina con l'aria di una nota a piè di pagina.
     ============================================================ */
  pagandoTitulo: 'Stai pagando senza averne bisogno',
  pagandoTexto: (loja: string) => `Il legame con il centro copre già l’app, ma c’è un abbonamento attivo su ${loja} — disdicilo lì e per te non cambia niente.`,

  /* ⚠️⚠️ DICE CHI CE LO COMUNICA, e poi che cosa succede.

     "Se il legame finisce" faceva sembrare che ce ne accorgessimo da
     soli, e non è così: qui nessuno sa che una persona ha smesso di
     essere paziente di un centro. Lo sa il centro, ed è lui a dircelo.

     ⚠️⚠️ E LA RIGA DEI DATI VA SEMPRE INSIEME. Sospendere l'accesso a un
     diario di terapia è chiudere qualcuno fuori dal proprio peso, dalle
     proprie punture e dai propri esami — e questo non lo facciamo.
     Separate, la prima frase diventa una minaccia. */
  bomSaberTitulo: 'È bene che tu lo sappia',
  bomSaberTexto: 'Se il centro partner ci comunica che il percorso di cura è finito, l’accesso resta sospeso finché non scegli un piano Personal — e non viene addebitato niente senza che tu lo scelga. Niente di quello che hai registrato si perde: i registri restano sul dispositivo e puoi esportarli quando vuoi.',

  /* ⚠️ DIRE "NON TI SEI ABBONATA" SENZA DIRE CHE NESSUNO PUÒ ABBONARSI
     lascia la persona a cercare un pulsante che non esiste. Questa
     sparisce il giorno in cui l'addebito entra in funzione. */
  semCobrancaTitulo: 'Gli addebiti non sono ancora attivi',
  semCobrancaTexto: 'Questa schermata esiste, l’abbonamento non ancora. Non ti è stato addebitato niente, e non lo sarà senza preavviso.',

  /* ============================================================
     LA VETRINA — /planos

     ⚠️⚠️ IL TITOLO HA UN A CAPO MISURATO, E NON SCELTO. Su un telefono da
     375 pt avanzano 335 px di riga; le due metà chiedono 321 e 323 px nel
     corpo 31. Chi traduce deve stare dentro questa larghezza, o toccare
     anche il corpo. Una frase più lunga non "viene un po' più grande":
     spezza in tre righe e si mangia il pulsante.
     ============================================================ */
  vitrine: {
    titulo: 'Tutto cambia quando\nsegui ',
    tituloDestaque: 'sul serio.',
    lead: 'I tuoi dati in un posto solo, il tuo andamento in ordine, e chiarezza in ogni fase della terapia.',

    /* I quattro argomenti. Ognuno è quello che l'app fa, e non un
       aggettivo su di lei. */
    umLugarTitulo: 'La tua terapia in un posto solo',
    umLugarTexto: 'Tutto in ordine per seguire il tuo percorso.',
    numerosTitulo: 'I tuoi numeri interpretati',
    numerosTexto: 'I tuoi dati diventano informazioni che hanno senso.',
    evolucaoTitulo: 'Un andamento che riesci a vedere',
    evolucaoTexto: 'Peso, misure, sintomi, esami e registri nel tempo.',
    assistenteTitulo: 'Un assistente per tutti i giorni',
    assistenteTexto: 'Chiedi, registra e capisci meglio il tuo percorso.',

    comecarTeste: (dias: number) => `Inizia i ${dias} giorni gratis`,
    assinarPor: (preco: string) => `Abbonati — ${preco}`,

    /* ⚠️ "DISDICI QUANDO VUOI" SERVE A TUTTI E DUE I PIANI, ed è vero in
       tutti e due. La seconda cambia: "senza impegno" tranquillizza chi
       sta per provare tre giorni; per chi sta impegnando un anno intero
       la stessa frase suona come una promessa vuota — si è APPENA
       impegnata. Lì vale la pena dire che cosa ottiene in cambio. */
    canceleQuandoQuiser: 'Disdici quando vuoi',
    semCompromisso: 'Senza impegno',
    menorPreco: 'Prezzo più basso',

    depoisDoTeste: (dias: number, preco: string, periodo: string) =>
      `Dopo ${dias} giorni, ${preco} ${periodo}. Disdici prima e non paghi niente.`,
    renovaAte: (preco: string, periodo: string) =>
      `${preco} ${periodo}, con rinnovo finché non disdici.`,

    naoPaga: 'Tu non paghi — l’accesso arriva dal legame',
    aindaNaoLigada: 'L’abbonamento non è ancora attivo',
    temCodigo: 'Ho un codice di invito',
  },

  /* ============================================================
     L'USCITA — /cancelar

     ⚠️⚠️ LA SCHERMATA CHIEDE, MA NON TRATTIENE. Chi l'ha aperta ha già
     deciso, e la domanda è per noi, non contro di lei: il pulsante che
     porta allo store resta attivo in fondo senza dipendere da nessuna
     risposta.
     ============================================================ */
  saida: {
    titulo: 'Disdici l’abbonamento',
    perguntaTitulo: 'Prima di andare, una domanda',
    perguntaLead: 'Rispondere è facoltativo e non cambia niente: la disdetta resta a un tocco, sul pulsante qui sotto.',
    porQue: 'Perché stai disdicendo?',
    continuarParaLoja: (loja: string) => `Continua su ${loja}`,

    /* ⚠️ L'ORDINE NON È CASUALE: i primi tre hanno una risposta, gli
       ultimi tre hanno un campo di testo, e "Altro motivo" è sempre
       l'ultimo. */
    motivoCaro: 'Costa troppo',
    motivoEsqueco: 'Non la sto usando',
    motivoTerminei: 'Ho già finito',
    motivoFaltou: 'Mancava qualcosa',
    motivoProblema: 'Ha dato problemi',
    motivoOutro: 'Altro motivo',

    /* ⚠️⚠️ NELL'ANNUALE, LO SCONTO NON È LA NOTIZIA — LO È LA DATA. Chi
       paga a anno e dice che costa troppo non ha nessun addebito in
       arrivo. Quello che le cambia la decisione è che l'anno è pagato e
       che disdire adesso non restituisce i soldi. E il rimborso si dice
       anche se costa: chi rivuole i soldi li cercherà comunque. */
    anoPagoTitulo: 'Il tuo anno è già pagato',
    anoPagoComData: (data: string) => `Il prossimo addebito non è che il ${data}, e fino ad allora resti con tutto — disdire adesso non restituisce quello che hai già pagato.`,
    anoPagoSemData: 'Resti con tutto fino alla fine del periodo già pagato — disdire adesso non restituisce quella cifra.',
    anoPagoReembolso: (loja: string, comDesconto: string, cheio: string) =>
      `Il rimborso, quando è possibile, si chiede su ${loja}. E se il problema è la cifra, il rinnovo può venire ${comDesconto} invece di ${cheio}.`,
    querDescontoRenovacao: 'Voglio lo sconto sul rinnovo',

    descontoTitulo: (porcento: number) => `${porcento}% di sconto sul prossimo mese`,
    descontoTexto: (comDesconto: string, cheio: string, anualPorMes: string) =>
      `Il prossimo addebito viene ${comDesconto} invece di ${cheio}. E se il problema è il mensile, l’annuale viene ${anualPorMes} al mese.`,
    querDesconto: 'Voglio lo sconto',

    lembretesTitulo: 'Se il problema è dimenticarsene, possiamo avvisarti',
    lembretesTexto: 'Dose, pesata, acqua e proteine hanno un promemoria, all’ora che scegli tu. Puoi accendere solo quello che ti serve e lasciare il resto.',
    configurarLembretes: 'Imposta i promemoria',

    /* ⚠️⚠️ QUI LA SCHERMATA SMETTE DI VENDERE E FA I COMPLIMENTI. È
       l'unico motivo dell'elenco in cui andarsene è il finale giusto. E i
       complimenti sono CONDIZIONALI di proposito: "speriamo che tu abbia
       raggiunto" e non "ce l'hai fatta" — non tutte le terapie che
       finiscono finiscono bene, e affermare la vittoria a chi ha smesso
       per un effetto collaterale sarebbe la frase più crudele che questa
       schermata potrebbe avere. */
    parabensTitulo: 'Complimenti per essere arrivata fin qui',
    parabensTexto: 'Speriamo che tu abbia raggiunto quello che cercavi quando hai cominciato. Grazie per aver fatto questo percorso con noi — e per averci affidato il racconto di quel percorso.',

    campoProblema: 'Che cos’è successo?',
    campoFaltou: 'Che cosa mancava?',
    campoOutro: 'Raccontaci',
    /* ⚠️ E LA FRASE NON PROMETTE UNA RISPOSTA. Questo testo non ha ancora
       un posto dove andare. "Ti risponderemo" sarebbe la promessa più
       facile e più cara di questa schermata. */
    campoAviso: 'Scrivere è facoltativo, e qui nessuno ti risponderà — diventa un elenco di cose da sistemare, ed è così che decidiamo che cosa aggiustare per primo.',
    campoDicaProblema: 'Che cosa è andato storto, e quando…',
    campoDicaOutro: 'Scrivi pure liberamente',

    recusaTitulo: 'Lo sconto non si può ancora applicare',
    recusaTexto: 'Gli addebiti non sono attivi in questa versione, quindi non c’è niente da scontare. Nel tuo abbonamento non è cambiato niente.',

    /* ⚠️ IL TITOLO È IL RIASSUNTO DEI TRE, e non l'etichetta di una
       sezione. Le tre righe rispondono alla stessa domanda — "che cosa
       perdo?" */
    tranquiloTitulo: 'STAI TRANQUILLA',
    tranquiloAcesso: 'L’accesso continua fino alla fine del periodo già pagato.',
    tranquiloDados: 'Niente di quello che hai registrato si perde — resta tutto sul dispositivo.',
    tranquiloLoja: (loja: string) => `La disdetta si fa su ${loja}: non possiamo farla noi al posto tuo.`,
  },

  /* ============================================================
     I CENTRI PARTNER — /parceiros e /codigo
     ============================================================ */
  parceiros: {
    titulo: 'Medici partner',
    lead: 'Alcuni centri seguono la terapia qui dentro insieme a te. Senza, resti con tutto — quello che cambia è quello che puoi fare con il tuo team qui.',

    jaTemTitulo: 'Sei già con un centro partner',
    jaTemLead: 'Tutto quello che sta in questo elenco vale già per te.',

    conversaTitulo: 'Conversazione con il team',
    conversaTexto: 'Messaggi fra una visita e l’altra, senza dover riprenotare per togliersi un dubbio.',
    resumoTitulo: 'Il tuo riepilogo arriva lì',
    resumoTexto: 'Un tocco invia peso, aderenza, sintomi ed esami — in ordine, come si usano in visita.',
    receitaTitulo: 'Ricetta e protocollo',
    receitaTexto: 'Chiedi il rinnovo e ricevi il protocollo della settimana dentro l’app.',
    agendaTitulo: 'L’agenda, già compilata',
    agendaTexto: 'Le visite compaiono qui senza che tu debba annotare niente.',

    /* ⚠️ E NON C'È UNA RICERCA DI CENTRI, e la schermata lo dice. Un
       elenco di centri che non esiste sarebbe la porta murata più cara di
       qui. */
    conviteTitulo: 'L’invito arriva dal centro',
    conviteTexto: 'Qui non si può cercare un centro. Chi si cura già in un centro partner riceve da lui un codice, ed è quello a unire le due estremità. Se il tuo centro non usa ancora l’app, vale la pena dirglielo.',
    conviteTextoComRede: 'Chi si cura nella rete partner riceve dal centro un codice dopo la prima visita, ed è quello a unire le due estremità. Se il tuo centro non usa ancora l’app, vale la pena dirglielo.',

    codigoRotulo: 'Codice di invito',
    codigoAjudaAtual: 'È quello che ti collega al tuo centro.',
    usarOutro: 'Usa un altro codice',
    temCodigoRotulo: 'Ho un codice di invito',
    temCodigoAjuda: 'È il codice che ti ha dato il centro.',
    digite: 'Scrivi il codice',
    confirmar: 'Conferma il codice',
    codigoSub: 'Il codice che ti ha dato il centro partner.',
  },

  /* ============================================================
     L'ESTRATTO — /cobrancas
     ============================================================ */
  extrato: {
    titulo: 'Storico degli addebiti',
    vazioIsenta: 'Nessun addebito',
    vazioPagante: 'Ancora nessun addebito',
    vazioIsentaTexto: 'L’accesso arriva dal legame con il centro, e un legame non genera addebiti. Se il centro ci comunica che è finito, l’accesso resta sospeso finché non ti abboni — qui non compare niente senza che tu lo scelga.',
    vazioPaganteTexto: 'Quando l’abbonamento comincerà, ogni addebito comparirà qui con la data e la cifra.',
    inicioDoTeste: 'Inizio della prova gratuita',
    comprovante: 'La ricevuta ufficiale di ogni addebito',
  },

  /* ============================================================
     L'ACCESSO SOSPESO — /suspenso

     ⚠️ A ESSERE SOSPESO È L'ABBONAMENTO, E NON L'ACCOUNT. Le due righe
     qui sotto sono la differenza fra un avviso e una minaccia.
     ============================================================ */
  suspenso: {
    clinicaGenerica: 'il centro che ti seguiva',
    nadaApagado: 'Non è stato cancellato niente. Peso, punture, sintomi, esami e foto restano sul tuo dispositivo.',
    nadaCobrado: 'Non è stato addebitato niente, e non lo sarà senza che tu lo scelga.',
    verOsPlanos: 'Vedi i piani',
    outroCodigo: 'Ho un altro codice',
  },

};
