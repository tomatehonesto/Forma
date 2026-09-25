/* ============================================================
   LA CURA — l'area delle persone · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/cuidado.ts. È la parte dell'app che
   parla del TEAM di qualcuno, e per questo la regola che vale per tutto
   il file è più dura delle altre:

   ⚠️⚠️ NESSUNA FRASE DI QUI PUÒ AFFERMARE QUELLO CHE IL TEAM HA FATTO
   SENZA SAPERLO. "Il tuo team ha aggiornato la terapia" è vero solo
   quando esiste la piattaforma — è lei a portare l'indicazione nuova.
   Senza server, l'app sa che la visita è avvenuta, perché lo ha detto la
   persona, e nient'altro. Per questo quasi ogni coppia di frasi qui ha
   una versione con piattaforma e una senza, e non sono variazioni di
   tono: la differenza fra le due è un'affermazione di fatto.

   ⚠️ E IL TITOLO NON DÀ VOTI. La pastiglia in alto diceva "Buona
   aderenza", "Aderenza regolare" o "Aderenza bassa" — e la terza
   compariva a chi aveva saltato due dosi, che quasi sempre le ha saltate
   perché stava male. Oggi è "8 di 11 dosi", che dice la stessa cosa senza
   giudicare e dice di più.
   ============================================================ */

export const cuidado = {
  /* ============================================================
     CHE COSA STA ASPETTANDO LA PERSONA

     ⚠️ OGNI VOCE HA TRE TESTI, e il terzo non è il riassunto degli altri:
     `texto` è che cosa fare, `sub` è perché adesso, e `rotulo` è come il
     TITOLO chiama questa voce quando le elenca in una frase sola.
     ============================================================ */
  pendencias: {
    mensagemUma: 'Rispondi al messaggio del tuo team',
    mensagemVarias: (quantas: number) => `Rispondi ai ${quantas} messaggi del tuo team`,
    mensagemSub: 'in attesa di una tua risposta',
    mensagemRotulo: 'i messaggi',

    receita: 'Chiedi il rinnovo della ricetta',
    receitaSub: (doses: number, semanas: number) =>
      `${doses} ${doses === 1 ? 'dose rimasta' : 'dosi rimaste'} · circa ${semanas} ${semanas === 1 ? 'settimana' : 'settimane'}`,
    receitaRotulo: 'la ricetta',

    /* Il titolo dell'esame viene dal protocollo — è quello che ha scritto
       il team, e non un testo nostro. Nostro è da dove arriva. */
    exameSubDaEquipe: 'richiesto dal tuo team',
    exameSubDoProtocolo: 'dal protocollo di questa settimana',
    exameRotulo: 'gli esami',

    consulta: 'Prepara quello che porti alla visita',
    consultaSub: (tipo: string, quando: string, doutor: string) =>
      `${tipo} ${quando} · con ${doutor}`,
    consultaRotulo: 'visita',
  },

  /* ============================================================
     IL TITOLO DEL MONITORAGGIO

     Quattro momenti, e l'ordine in cui compaiono qui è l'ordine di
     precedenza fra loro: la visita che arriva batte tutto, poi il dopo
     visita, poi le cose in sospeso, e la continuità per il resto del
     tempo — che è la parte più lunga.
     ============================================================ */
  estado: {
    kicker: 'IL TUO MONITORAGGIO',

    /* I due conteggi in alto. L'a capo è di proposito: valore sopra,
       unità sotto, per la lettura di sfuggita. */
    metricaSemanas: 'settimane\ndi monitoraggio',
    metricaAplicacoes: 'punture\nregistrate',

    /* ⚠️ "DOSI" E NON "PUNTURE": questa pastiglia divide la riga con il
       polso, che può essere "3 voci in sospeso", e la parola lunga spinge
       il polso su due righe. */
    adesao: (feitas: number, previstas: number) =>
      `${feitas} su ${previstas} ${previstas === 1 ? 'dose' : 'dosi'}`,

    /* ---------- la visita che arriva ---------- */
    consultaTitulo: 'La tua visita si avvicina.',
    consultaHoje: (doutor: string) =>
      `La tua visita con ${doutor} è oggi. Vale la pena ripassare che cosa vuoi chiedere.`,
    consultaFaltam: (dias: number, doutor: string) =>
      `${dias === 1 ? 'Manca 1 giorno' : `Mancano ${dias} giorni`} alla tua visita con ${doutor}.`,
    consultaPulso: (quando: string) => `Visita ${quando}`,

    /* ---------- subito dopo la visita ---------- */
    /* ⚠️ LE DUE VERSIONI NON SONO DI TONO, SONO DI FATTO. Vedi l'alto del
       file: senza piattaforma l'app non sa che cosa sia stato deciso
       nella stanza, e la frase cambia padrone. */
    posConsultaTituloComPlataforma: 'Il tuo team ha aggiornato la terapia.',
    posConsultaTituloSemPlataforma: 'Hai avuto una visita da poco.',
    posConsultaTextoComPlataforma: 'Guarda le indicazioni della visita e che cosa cambia nella tua dose da adesso in poi.',
    posConsultaTextoSemPlataforma: 'Se la dose o l’intervallo sono cambiati, vale la pena aggiornarli qui — è quello che tiene giusti i conti dell’app.',
    posConsultaPulso: 'Terapia aggiornata',

    /* ---------- le cose in sospeso ---------- */
    /* ⚠️ "ABBIAMO QUALCOSA DA SISTEMARE" — prima persona plurale, e non
       "hai delle cose in sospeso". L'elenco qui sotto è di cose che
       dipendono da lei, e aprire con il dito puntato in una scheda di
       salute è l'inizio sbagliato. */
    pendenciaTitulo: 'Abbiamo qualcosa da sistemare.',
    /* ⚠️ NOMINA CHE COSA SIA, invece di contare quanti. "Due cose"
       obbliga a scorrere per scoprire se contino. */
    pendenciaTexto: (quantas: string, plural: boolean, assuntos: string) =>
      `${quantas} ${plural ? 'cose chiedono' : 'cosa chiede'} la tua attenzione — ${assuntos}. Niente di urgente, ma vale la pena ${plural ? 'sistemarle' : 'sistemarla'} questa settimana.`,
    pendenciaPulso: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'voce in sospeso' : 'voci in sospeso'}`,
    /* Fino a quattro per esteso, che è il tetto delle voci che esistono.
       ⚠️ Il femminile perché concordano con "cose", non con un numero. */
    porExtenso: ['nessuna', 'una', 'due', 'tre', 'quattro'],

    /* ---------- il resto del tempo ---------- */
    emDiaTitulo: 'La tua cura è in ordine.',
    /* ⚠️ LA SECONDA VERSIONE ESISTE PERCHÉ LA FRASE COMINCIAVA CON IL
       NOME DELLA DOTTORESSA. Senza nessuno registrato si apriva con uno
       spazio vuoto. Chi conduce la terapia da sola la conduce da
       altrettanto tempo. */
    emDiaComQuem: (quem: string, semanas: number) =>
      `${quem} segue la tua terapia da ${semanas} settimane. Stai andando bene e al momento non c’è niente di importante in sospeso.`,
    emDiaSozinha: (semanas: number) =>
      `Sei a ${semanas} settimane di terapia, stai andando bene e al momento non c’è niente di importante in sospeso.`,
    emDiaPulso: 'Monitoraggio in ordine',
  },

  /* ============================================================
     IL CONTESTO DELLA DOSE — le tre frasi corte
     ============================================================ */
  dose: {
    aplicacaoHoje: 'Puntura oggi',
    proximaAplicacao: (quando: string) => `Prossima puntura ${quando}`,
    nestaDoseHa: (semanas: number) =>
      `A questa dose da ${semanas} ${semanas === 1 ? 'settimana' : 'settimane'}`,
    /* Il `quando` arriva già come "tra 9 giorni" / "domani", con la
       preposizione dentro. */
    revisaoNaConsulta: (quando: string) => `Revisione alla visita ${quando}`,
    revisaoHoje: 'di oggi',
  },

  /* ============================================================
     IL TEAM E IL CENTRO
     ============================================================ */
  equipe: {
    /* Il ruolo di chi non ha una specialità annotata. Non è "Medico":
       potrebbe non esserlo, e l'app non lo sa. Quello che sa è la
       funzione. */
    responsavelPadrao: 'Responsabile della terapia',
  },

  /* ⚠️ OGNI RIGA ESISTE SOLO CON IL SUO DATO. "Telefono —" in un elenco
     di contatti è la schermata che promette un canale che non esiste. E
     l'ordine è dal canale più rapido al più formale. */
  contato: {
    whatsapp: 'Scrivi su WhatsApp',
    telefone: 'Chiama',
    site: 'Visita il sito',
    email: 'Invia un’e-mail',
    instagram: 'Vedi su Instagram',
    agenda: 'Prenota online',
  },

  /* La schermata del centro — /clinica, nelle sue due versioni. Vedi ../pt-BR/cuidado. */
  telaClinica: {
    titulo: 'Centro',
    semClinica: 'Nessun centro è collegato al tuo percorso. Chi segue la tua terapia compare nell’area medica.',
    convenios: 'Assicurazioni accettate',
    sobre: 'Presentazione',
    outrosCanais: 'Altri canali',
    outrosCanaisNota: 'Per parlare con la reception. Quello che riguarda la terapia va meglio nella conversazione dell’app, che arriva a tutta l’équipe.',
    entreEmContato: 'Contatta il centro',
    entreEmContatoNota: 'Parla con il centro per sapere come iniziare il percorso.',
    contatosDeExemplo: 'Contatti di esempio — aprono l’app giusta, ma non arrivano a nessuno.',
    comoChegar: 'Indicazioni',
    quemAcompanha: 'Chi ti segue',
    quemAtende: 'Chi riceve',
    aEquipe: 'L’équipe',
    responsavel: 'Responsabile',
    vinculoDesde: (data: string) => `Il tuo legame con questo centro è iniziato il ${data}.`,
    parceria: 'I pazienti dei centri partner non pagano l’app. Quando inizi la terapia qui, il centro ti dà un codice e l’abbonamento smette di essere addebitato.',
    escrever: 'Scrivi all’équipe',
  },

  /* ============================================================
     LA SCHERMATA DELLA CURA — la scheda delle persone

     ⚠️ `linhaDoPlano` RESTITUISCE TRE PEZZI per lo stesso motivo di
     `cadastro.telaPlano.objetivo`: la frase ha DUE numeri in grassetto in
     mezzo, e quello che sta fra loro cambia da lingua a lingua.

     ⚠️ E IL DENOMINATORE COMPARE SOLO QUANDO ESISTE. Senza un obiettivo
     da inseguire non c'è orizzonte, e "di N previste" sarebbe un piano
     che nessuno ha tracciato.
     ============================================================ */
  tela: {
    /* ---------- l'apertura ---------- */
    paraAConsulta: (quando: string) => `PER LA VISITA ${quando}`,
    resumoPronto: 'Il tuo riepilogo è già pronto',
    vouPreparar: 'Preparo io il tuo riepilogo',

    linhaDoPlano: (previstas: number, temHorizonte: boolean): [string, string, string] => [
      'Settimana ',
      temHorizonte ? ` su ${previstas} verso il tuo obiettivo · ` : ' della tua terapia · ',
      ' con la puntura fatta',
    ],

    /* ---------- chi ti segue ---------- */
    ultimaOrientacao: 'ULTIMA INDICAZIONE',
    voceEscreveu: 'HAI SCRITTO',
    naoLida: 'non letto',
    responder: 'Rispondi',
    enviarPrimeira: 'Invia il primo messaggio',

    /* ---------- che cosa chiede la tua attenzione ---------- */
    precisaDeVoce: 'Dipende da te',
    nadaPrecisa: 'Adesso non c’è niente che dipenda da te.',
    emDia: 'Il tuo monitoraggio è in ordine.',

    /* ---------- la visita ---------- */
    proximaConsulta: 'La tua prossima visita',
    consultasLink: 'Visite',
    anotarConsulta: 'Annota una visita',
    /* ⚠️ DICEVA "l'app avvisa quando si avvicina", e l'app non parla di sé
       in terza persona. Ad avvisare siamo noi. */
    anotarConsultaSub: 'Con la data qui, il riepilogo è pronto e ti avvisiamo quando si avvicina.',
    eQuando: (quando: string) => `${quando.charAt(0).toUpperCase()}${quando.slice(1)}`,
    preparoTexto: 'Metto insieme un riepilogo con peso, aderenza e sintomi di quel tratto — tu scegli che cosa chiedere.',
    prepararAConsulta: 'Prepara la visita',

    /* ---------- la terapia ----------

       ⚠️ "DOSI NELLA PENNA" DAVA PER SCONTATA LA PENNA, e ci sono il
       flacone, la siringa e il blister. L'`onde` arriva già pronto da
       `formas.noNa`, che concorda con il contenitore di chi legge. */
    seuTratamento: 'La tua terapia',
    aplicacoesLink: 'Punture',
    dosesEm: (onde: string) => `Dosi ${onde}`,
    restamDe: (restam: number, total: number, semanas: number) =>
      `${restam} su ${total} · circa ${semanas} ${semanas === 1 ? 'settimana' : 'settimane'}`,
    pedirRenovacao: 'Chiedi il rinnovo',

    /* ---------- gli esami ---------- */
    exames: 'Esami',
    marcadoresAcompanhados: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'marcatore monitorato' : 'marcatori monitorati'}`,
    nenhumResultado: 'Nessun risultato salvato',
    importeUmExame: 'Importa un esame per cominciare a seguirli',
    foraDaReferencia: (quantos: number) => `${quantos} fuori dai valori di riferimento`,
    todosNaReferencia: 'Tutti nella norma',

    /* ---------- chi ti segue ---------- */
    quemAcompanha: 'Chi ti segue',
    ninguemRegistrado: 'Ancora nessuno registrato',
    seVoceSeTrata: 'Se qualcuno ti segue, annotalo qui — il riepilogo sarà pronto per la visita.',

    /* ---------- l'invito, alla fine ----------

       ⚠️ ESISTE SOLO DOVE C'È UNA RETE PARTNER, e solo per chi non ha
       nessun monitoraggio. Vedi logic/pais. */
    acompanhamentoProfissional: 'Monitoraggio professionale',
    passouATer: 'Hai cominciato a farti seguire da un medico?',
    anoteQuemE: 'Annota chi è.',
  },

  /* ============================================================
     LA SCHERMATA DI CHI TI SEGUE

     ⚠️ QUELLO CHE SI REGISTRA QUI È UN FATTO DELLA VITA DELLA PERSONA, e
     non un legame. La maggior parte di chi usa GLP-1 ha un medico; quello
     che la maggior parte non ha è un medico dentro questa piattaforma.
     Niente di quello che entra qui manda un messaggio a nessuno, e la
     schermata lo dice PRIMA del pulsante di salvataggio.

     ⚠️ CON UN LEGAME, QUESTA È SOLA LETTURA. Chi è arrivata da un centro
     convenzionato ha questi campi che vengono da lì.

     ⚠️ E "DOVE SEI SEGUITA" CONCORDAVA CON UNA LETTRICE. Il participio in
     italiano ha il genere, e la schermata non conosce quello di chi legge
     — la frase è stata riscritta per non doverlo sapere. Il francese
     aveva lo stesso problema con "suivie".
     ============================================================ */
  telaAcompanhamento: {
    leadComVinculo: 'Questi dati arrivano dal centro che segue la tua terapia.',
    ondeAtendida: 'Dove avviene la visita',
    quemCorrige: 'A correggere è il centro',
    quemCorrigeTexto: 'Se un dato è sbagliato, parlane con il team — è lui a tenere questa scheda, e quello che viene corretto lì compare qui.',

    lead: 'Se qualcuno ti segue, annotalo qui. È quello che rende il riepilogo pronto per la visita, e fa comparire al momento giusto quello che c’è da chiedere.',

    nome: 'Nome',
    nomeAjuda: 'Come chiami questa persona. Può anche essere il nome dello studio, se preferisci.',
    nomePlaceholder: 'Scrivi il nome',
    especialidade: 'Specialità',
    opcional: 'Facoltativo.',
    /* Un esempio, e non un dato. Ogni lingua sceglie la forma che non
       chiede il genere: dove il nome della persona è marcato, entra il
       nome dell'area. */
    especialidadePlaceholder: 'Endocrinologia',
    ondeAtende: 'Dove riceve',
    ondeAtendeAjuda: 'Facoltativo — centro, ospedale o studio.',
    ondeAtendePlaceholder: 'Scrivi il centro o lo studio',

    nadaEnviado: 'Niente di tutto questo viene inviato a nessuno',
    nadaEnviadoTexto: 'Il nome resta nell’app, con te. Perché il tuo team riceva i tuoi dati serve un codice di invito del centro — e da lì in poi è lui a tenere questa scheda.',
    salvar: 'Salva',

    /* ⚠️ TOGLIERE CHI TI SEGUE NON CANCELLA NIENTE. È la regola della
       casa: nessun aggiornamento delle informazioni ripulisce un
       registro. Quello che esce sono tre campi di identificazione. */
    naoTenhoMais: 'Non mi fa più seguire da nessuno',
    tirarPergunta: 'Togliere chi ti segue?',
    tirarTexto: 'I tuoi registri restano tutti qui — peso, punture, sintomi, esami e appunti. L’unica cosa che se ne va è il nome.',
    simTirar: 'Sì, togli',
    cancelar: 'Annulla',
  },

  /* ============================================================
     LA SCHERMATA PER ANNOTARE UNA VISITA

     ⚠️ I TRE TIPI SONO CHIAVE ED ETICHETTA INSIEME — è quello che resta
     registrato in `S.consult.type`.

     ⚠️ E L'ASPETTATIVA ARRIVA PRIMA DEL PULSANTE. Annotare qui non avvisa
     lo studio e non entra nel calendario del telefono — dirlo dopo il
     fatto sarebbe tardi.
     ============================================================ */
  telaAnotarConsulta: {
    titulo: 'Annota una visita',

    /* Con un centro collegato, l'agenda arriva da lì e questa schermata è
       sola lettura. */
    quemMarca: 'A prenotare è il centro',
    quemMarcaLead: 'La tua agenda arriva dal team che segue la tua terapia.',
    datasChegam: 'Le date arrivano dal centro',
    datasChegamTexto: 'Per spostare o disdire, parlane con il team — quello che cambia lì compare qui.',

    proximaConsulta: 'La tua prossima visita',
    anoteSuaConsulta: 'Annota la tua visita',
    lead: 'Con la data qui, ti avvisiamo quando si avvicina e teniamo il riepilogo pronto da portare.',

    quando: 'Quando',
    comoVaiSer: 'Come sarà',
    tipos: {
      presencial: 'In presenza',
      teleconsulta: 'A distanza',
      retorno: 'Controllo',
    },
    comQuem: (quem: string) => `Con ${quem}.`,

    dataFicaComVoce: 'La data resta con te',
    dataFicaComVoceTexto: 'Annotarla qui non avvisa lo studio e non entra nel calendario del telefono. Siamo noi ad avvisarti quando la visita si avvicina.',

    salvar: 'Salva',
    anotar: 'Annota la visita',
    naoTenho: 'Non ho visite in programma',
  },

  /* ============================================================
     VISITE — la prossima, che cosa portarci, e quelle già fatte

     ⚠️ IL GIORNO DELLA SETTIMANA E LA DATA SONO UNITI DA UNA FUNZIONE, e
     non da una virgola scritta nel JSX: "lunedì, 3 ottobre" prende la
     virgola in portoghese, inglese e tedesco, mentre francese, spagnolo e
     ITALIANO scrivono "lunedì 3 ottobre" — senza niente. Una virgola
     digitata nella schermata sarebbe una regola portoghese applicata a
     tutte e sei.
     ============================================================ */
  telaConsultas: {
    titulo: 'Visite',
    leadComData: 'La prossima, che cosa portarci, e quelle che ci sono già state.',
    leadSemData: 'Che cosa portare alla prossima, e quelle che ci sono già state.',

    jaPassou: 'GIÀ PASSATA',
    proxima: 'PROSSIMA',
    dataDaConsulta: (diaDaSemana: string, data: string, quem: string) =>
      `${diaDaSemana} ${data}${quem ? ` · ${quem}` : ''}`,
    jaAconteceu: 'C’è già stata',
    verResumo: 'Vedi il riepilogo da portare',
    mudarData: 'Cambia la data',

    nenhumaAnotada: 'Nessuna visita annotata',
    clinicaMarca: 'Quando il tuo team prenoterà la prossima, comparirà qui.',
    semDataTexto: 'Con la data qui, ti avvisiamo quando si avvicina e teniamo il riepilogo pronto da portare.',
    anotarConsulta: 'Annota una visita',

    paraLevar: 'Da portare',
    /* I tre rami in una funzione sola: il plurale è regola di lingua, e
       lasciarlo nel ternario della schermata lo legherebbe al
       portoghese. */
    paraLevarSub: (faltando: number): string =>
      faltando === 0
        ? 'È tutto in ordine — il riepilogo parte già da qui.'
        : faltando === 1
          ? 'Manca una cosa al riepilogo.'
          : `Mancano ${faltando} cose al riepilogo.`,

    anteriores: 'Visite precedenti',
    linhaAnterior: (tipo: string, data: string) => `${tipo} · ${data}`,

    /* ⚠️ CHIAVE ED ETICHETTA INSIEME, come i tre tipi di
       /anotar-consulta: è quello che resta REGISTRATO nello storico
       quando la visita non aveva un tipo. */
    consultaGenerica: 'Visita',
  },

  /* ============================================================
     UNA VISITA CHE C'È GIÀ STATA

     ⚠️ LA SCHERMATA NON DICE "CHE COSA È VENUTO DA QUESTA VISITA", e il
     testo segue quella regola: mostra un INTERVALLO, e mai una causa.
     L'app non era nella stanza, e una data non è una causa.
     ============================================================ */
  telaConsulta: {
    titulo: 'Visita',
    naoEstaMais: 'Questa visita non è più nel tuo storico.',

    desdeEntao: 'Da allora',
    desdeEntaoSub: 'Quello che i tuoi registri mostrano da quel giorno a oggi.',
    ateASeguinte: 'Fino alla visita successiva',
    ateASeguinteSub: (data: string) =>
      `Quello che i tuoi registri mostrano fra quel giorno e il ${data}.`,

    semRegistro: 'Nessun tuo registro cade in questa finestra. Quello che avete concordato in visita sta nell’appunto qui sopra, se c’è.',
  },

  /* ============================================================
     AREA MEDICA — chi ti cura, e che cosa arriva dall'altra parte

     ⚠️ SI APRE CON `temAcompanhamento`, E NON CON IL LEGAME. Chi ha
     annotato il proprio medico arriva qui, in qualsiasi mercato; quello
     che è della piattaforma (messaggi, ricetta, materiale del centro) si
     cancella da solo per mancanza del dato, e non per un blocco di
     paese.
     ============================================================ */
  telaAreaMedica: {
    titulo: 'Area medica',
    lead: 'Chi si prende cura di te, e che cosa gli arriva.',

    /* Due delle quattro scorciatoie, e solo due: "Visite" e "Protocolli"
       sono il nome delle schermate dall'altra parte, e sono già scritti
       lì. */
    atalhoMensagem: 'Messaggio',
    atalhoClinica: 'Centro',

    paraLevar: 'DA PORTARE ALLA VISITA',
    paraLevarTexto: 'Peso, aderenza, sintomi, esami e i tuoi appunti, in un documento solo. Lo prepariamo dalle tue registrazioni, ed è già pronto.',
    verResumo: 'Vedi il riepilogo per la visita',

    suasAnotacoes: 'I tuoi appunti',
    anotar: 'Annota',
    anotarDuvida: 'Annota un dubbio',
    anotarDuvidaSub: 'Da chiedere alla prossima visita',

    prescricoes: 'Prescrizioni',
    pedirReceita: 'Chiedi una ricetta nuova',
    clinicaPreparou: 'Quello che ha preparato il centro',

    numerosDaEquipe: 'I numeri del tuo team',
    naoAnotada: 'da annotare',
    anotadoPor: (por: string, data: string) => `${por} · annotato il ${data}`,
    /* ⚠️ ERA "il numero che LEI ha definito in visita", e l'app non sa il
       genere di chi segue la persona. La frase è stata riscritta per non
       doverlo sapere — stessa uscita dei participi del francese. */
    anoteONumero: 'Annota il numero stabilito in visita',

    duasMetas: (minha: string) =>
      `Il tuo obiettivo di peso, nell’app, è ${minha}. I due convivono — il tuo continua a misurare il Percorso — e la differenza fra loro è una buona domanda per la prossima visita.`,

    documentos: 'Documenti ed esami',
    tipoExame: 'Esame',
    tipoResumo: 'Generato dall’IA',
    documentoSub: (tipo: string, data: string) => `${tipo} · ${data}`,
  },
};
