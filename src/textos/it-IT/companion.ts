/* ============================================================
   IL COMPANION — la sua memoria e la biblioteca che suggerisce · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/companion.ts.

   ⚠️ LA MEMORIA PARLA DI PRESENZA, E NON DI VOLUME. La riga elencava
   quello che aveva letto — "ho considerato i tuoi check-in, 11 punture,
   15 esami…" — ed elencare dimostra la capacità di contare, non di
   conoscere. A costruire fiducia è essere stati lì nel tempo.

   ⚠️ E LA BIBLIOTECA NON È UN CATALOGO. Ogni lettura entra perché
   qualcosa nello stato della persona l'ha tirata — la fase del ciclo, un
   sintomo, la visita prenotata — e il motivo compare nella scheda. Un
   contenuto senza motivo visibile diventa un blog.

   ⚠️ E QUI IL COMPANION PARLA AL SINGOLARE, come in equilibrio: è la
   voce del compagno, non quella del prodotto. La divisione è annotata in
   alto in equilibrio.ts.
   ============================================================ */

export const companion = {
  /* ============================================================
     LA MEMORIA — quattro aperture, che ruotano con i registri
     ============================================================ */
  memoria: {
    desdeOComeco: 'Conosco il tuo percorso dall’inizio.',
  },

  /* ============================================================
     LA BIBLIOTECA CONTESTUALE
     ============================================================ */
  biblioteca: {

    /* ============================================================
       LA SCHERMATA DELLA BIBLIOTECA

       ⚠️ PUÒ ARRIVARE VUOTA. Chi è a metà ciclo, dorme bene, ha le
       proteine in ordine e nessuna visita prenotata non ha una lettura
       che si giustifichi — e il vuoto qui è una buona notizia, non una
       mancanza. La frase lo dice.
       ============================================================ */
    tela: {
      titulo: 'Biblioteca',
      sub: 'Contenuti giusti per il tuo momento — non un elenco di articoli',
      minDeLeitura: (min: number) => `${min} min di lettura`,
      vazioTitulo: 'Niente da leggere adesso',
      vazioTexto: 'Le letture entrano quando qualcosa nei tuoi registri ne chiede una. Senza, non c’è niente da leggere — ed è una buona notizia.',
      vazioSemRegistroTexto: 'Le letture entrano quando qualcosa nei tuoi registri ne chiede una. Con i tuoi primi check-in, cominciano a comparire qui.',
    },

    /* ---------- la fame che torna ---------- */
    fomeMotivo: (dia: number) => `Sei al giorno ${dia} del ciclo, quando la fame torna`,
    fomeTitulo: 'Perché la fame torna prima della puntura',
    /* ⚠️ "TOGLIE LA SENSAZIONE DI RICADUTA" è il servizio di questa
       lettura, e il motivo per cui esiste: la fame che torna al quinto
       giorno è il punto in cui le persone concludono di aver fallito. La
       molecola entra nella frase in minuscolo perché è sostanza, non
       marca. */
    fomeDesc: (molecula: string) =>
      `Il livello di ${molecula} scende lungo la settimana, e la sazietà scende insieme. Capire la curva toglie la sensazione di ricaduta.`,

    /* ---------- i primi giorni ---------- */
    primeirosMotivo: (dias: number) => `Hai fatto la puntura ${dias} ${dias === 1 ? 'giorno' : 'giorni'} fa`,
    primeirosTitulo: 'I primi giorni dopo la dose',
    primeirosDesc: 'Che cosa ci si aspetta di sentire nella finestra delle 48 ore e che cosa merita già un messaggio al team.',

    /* ---------- la nausea ---------- */
    enjooMotivo: (dias: number) => `Hai segnato la nausea in ${dias} degli ultimi 7 giorni`,
    enjooTitulo: 'Mangiare senza combattere la nausea',
    /* ⚠️ "COMBATTERE" È IL VERBO GIUSTO, e tutto il titolo dipende da
       lui: chi ha la nausea non ha bisogno di forza di volontà per
       mangiare, ha bisogno di cibo che passi. */
    enjooDesc: 'Abbinamenti e orari che di solito passano meglio nei giorni in cui il cibo sembra troppo.',

    /* ---------- le proteine ---------- */
    proteinaMotivo: (gramas: number) => `Mancano ${gramas} g perché la tua media raggiunga l’obiettivo`,
    proteinaTitulo: 'Proteine senza cucinare di più',
    proteinaDesc: 'Come arrivare all’obiettivo con quello che c’è già nel tuo frigorifero — il problema raramente è la ricetta, è la praticità.',

    /* ---------- il sonno ---------- */
    sonoMotivo: (horas: string) => `La tua media di sonno è a ${horas} h`,
    sonoTitulo: 'Il sonno come parte della terapia',
    sonoDesc: 'Dormire poco cambia gli ormoni della fame il giorno dopo — nei tuoi registri si vede già.',

    /* ---------- dopo il terzo mese ---------- */
    plateauMotivo: (semana: number, perdido: string) => `Settimana ${semana}, con ${perdido} nel tratto`,
    plateauTitulo: 'Che cosa cambia dopo il terzo mese',
    /* ⚠️ "È FISIOLOGIA, NON UN FALLIMENTO" è la stessa difesa che fa la
       scheda del plateau, e deve esserci anche qui: è in questo punto
       della terapia che le persone si fermano. */
    plateauDesc: 'Il calo rallenta, ed è fisiologia, non un fallimento. Che cosa conta più della bilancia da qui in avanti.',

    /* ---------- la visita ---------- */
    consultaMotivo: (dias: number) => `La tua visita è fra ${dias} giorni`,
    consultaTitulo: 'Come sfruttare meglio la tua visita',
    consultaDesc: 'Che cosa portare, che cosa chiedere e come il riepilogo automatico fa risparmiare i primi dieci minuti.',
  },

  /* ============================================================
     LA SCHERMATA DEGLI INSIGHT — la cornice del livello di
     interpretazione

     ⚠️⚠️ "MORPHI HA OSSERVATO" È DIVENTATO "QUELLO CHE ABBIAMO
     OSSERVATO". Il nome del prodotto può essere un'etichetta, ma non può
     avere un verbo appeso: "Morphi conserva", "Morphi avvisa"
     trasformano l'app in un oggetto che osserva la persona.

     ⚠️ E DUE RIGHE IN FONDO AVEVANO LO STESSO NOME, separate da un
     articolo. Quella di mezzo ha preso il nome di quello che fa, e quella
     del documento ha tenuto il titolo della schermata a cui porta.

     ⚠️ L'A CAPO DELLA DOMANDA È DI OGNI LINGUA. "Che cosa vuoi / capire
     oggi?" cade bene in due righe in italiano; la frase tedesca è più
     lunga e spezza in un altro punto. Per questo il `\n` vive dentro il
     testo, e non nel codice della schermata.
     ============================================================ */
  telaInsights: {
    ola: (nome: string) => `Ciao, ${nome}`,
    pergunta: 'Che cosa vuoi\ncapire oggi?',
    escreva: 'Scrivi la tua domanda...',

    descobertaDaSemana: 'LA SCOPERTA DELLA SETTIMANA',
    entenderMelhor: 'Capire meglio',

    oQueMaisPercebi: 'Che altro ho notato',
    oQueMaisPercebiNota: 'Altre osservazioni trovate guardando il tuo percorso.',
    verTodas: (quantas: number) => `Vedi tutte le osservazioni (${quantas})`,

    observamos: 'QUELLO CHE ABBIAMO OSSERVATO',
    hojeDeCem: 'oggi, su 100',

    proximasAcoes: 'Prossime azioni',
    proximasAcoesNota: 'Nell’ordine in cui arrivano. Suggerimenti di tutti i giorni — dose e farmaco li decide chi ti segue.',

    resumos: 'Riepiloghi',
    resumosNota: 'Pronti con i tuoi dati, da leggere e da portare alla visita.',
    disponivelDepois: 'disponibile dopo le prime registrazioni',

    resumoDaSemana: 'Riepilogo della settimana',
    resumoDaSemanaPronto: (periodo: string): string => `pronto · ${periodo}`,
    resumoDaSemanaToda: 'ogni lunedì, una lettura della tua settimana',
    resumoDaSemanaDesligado: 'disattivato',
    documento: 'Riepilogo per la visita',
    documentoSub: 'documento con tutto l’andamento',
  },
  telaConversa: {
    ola: (nome: string) => `Ciao, ${nome}`,
    ouvindo: 'Ti ascolto…',
    escrevaOuFale: 'Scrivi o parla',
    pergunte: 'Chiedi del tuo percorso',
    novaConversa: 'Nuova conversazione',
    assuntoApetite: 'Appetito',
    assuntoTratamento: 'Trattamento',
    assuntoSintomas: 'Sintomi',
    assuntoExames: 'Esami',
    assuntoProgresso: 'Progressi',
    assuntoConsulta: 'Visita',
    assuntoComeco: 'Primi passi',
    menu: 'Conversazioni e nuova conversazione',
    fechar: 'Chiudi',
    irEvolucao: 'Vedi le tue pesate',
    irSintomas: 'Vedi i tuoi sintomi',
    irAplicacoes: 'Vedi le tue somministrazioni',
    irAlimentacao: 'Vedi la tua alimentazione',
    irAgua: 'Vedi l’acqua di oggi',
    irExames: 'Vedi i tuoi esami',
    irResumo: 'Apri il riepilogo per la visita',
    irCheckin: 'Fai il check-in di oggi',
    copiar: 'Copia',
    copiado: 'Copiato',
    levarCurto: 'Porta alla visita',
    dataHoje: 'Oggi',
    dataOntem: 'Ieri',
    fecharMenu: 'Chiudi il menu',
    compartilhar: 'Condividi',
    /* a folha da seleção nativa (app/selecionar-texto) */
    selecionarTitulo: 'Seleziona testo',
    /* o 👍 e o 👎 da resposta, e a folha do 👎 (app/avaliar-resposta) */
    curtir: 'Risposta utile',
    naoCurtir: 'Risposta non utile',
    obrigadoNota: 'Grazie per il parere',
    avaliarTitulo: 'Cosa non ha aiutato?',
    motivos: { errada: 'Informazione sbagliata', 'nao-respondeu': 'Non ha risposto alla mia domanda', tom: 'Il modo di dirlo', arriscada: 'Mi è sembrata rischiosa', outro: 'Altro motivo' } as Record<string, string>,
    avaliarAviso: 'Per migliorare, la tua domanda e questa risposta arrivano a noi. Nient’altro della conversazione né dei tuoi dati. Le conserviamo fino a 12 mesi.',
    avaliarEnviar: 'Invia',
    avaliarCancelar: 'Non ora',
    avaliado: 'Inviato, grazie',
    avaliarFalhou: 'Impossibile inviare ora. Riprova più tardi.',
    avaliarSemConta: 'Accedi al tuo account per valutare una risposta.',
    levarConsulta: 'Porta la domanda alla visita',
    naPauta: 'Annotato per la visita',
    historico: 'Conversazioni precedenti',
    historicoTitulo: 'Conversazioni',
    grupoHoje: 'Oggi',
    grupoSemana: 'Ultimi 7 giorni',
    grupoAntes: 'Prima',
    mensagens: (n: number): string => (n === 1 ? '1 messaggio' : `${n} messaggi`),
    apagar: 'Elimina',
    apagarPergunta: 'Eliminare questa conversazione dal telefono?',
    cancelar: 'Annulla',
    historicoVazio: 'Le tue conversazioni con Morphi Intelligence restano qui, sul tuo telefono.',
    aceiteTitulo: 'Prima di iniziare',
    aceitePergunta: 'Permetti a Morphi Intelligence di consultare i tuoi dati di salute per aiutarti?',
    termosTitulo: 'Termini d’uso',
    termosResumo: 'Cosa fa, cosa consulta, dove passa e i limiti',
    aceite1Titulo: 'Cosa fa',
    aceite1: 'Risponde alle tue domande, scrive un riepilogo della tua settimana ogni lunedì, legge le foto dei pasti e i referti che invii e stima i piatti dal nome.',
    aceite2Titulo: 'Cosa consulta',
    aceite2: 'Farmaco, peso, sintomi, pasti, acqua, attività fisica ed esami, e la foto o il referto quando lo invii. Il tuo nome completo, la tua e-mail e il nome di chi ti segue restano fuori.',
    aceite3Titulo: 'Dove passa',
    aceite3: 'Passa dal nostro server e da Anthropic, l’azienda che fornisce la tecnologia, negli Stati Uniti, solo per creare la risposta. Da loro non resta nulla, e i dati non vengono usati per addestrare modelli.',
    aceite4Titulo: 'I limiti',
    aceite4: 'Morphi Intelligence può sbagliare e non sostituisce chi ti segue. Dose e farmaco, sempre con il tuo team. Il riepilogo della settimana si spegne nel riepilogo stesso.',
    politica: 'Leggi l’Informativa sulla privacy',
    aceitar: 'Consenti',
    recusar: 'Non ora',
    aceiteRodape: 'Senza il permesso, le funzioni di intelligenza artificiale restano spente. Puoi consentirle quando vuoi.',
    semServidor: 'La conversazione non è ancora attiva su questo dispositivo.',
    semRede: 'Non sono riuscito a rispondere — la connessione non è andata. Riprova tra un attimo.',
    semConta: 'Per parlare con me, accedi al tuo account.',
    limiteDoDia: 'Hai raggiunto il limite di domande di oggi. Domani torno a rispondere.',
    limiteDoMes: 'Hai raggiunto il limite di 100 domande in 30 giorni. Tornano a poco a poco, man mano che i giorni più vecchi escono dal conteggio.',
    restam: (n: number): string => (n === 1 ? 'Ti resta 1 domanda oggi' : `Ti restano ${n} domande oggi`),
  },
};
