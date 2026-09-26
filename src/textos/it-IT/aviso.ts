/* ============================================================
   IL CONSENSO E IL RESTO — la premessa, gli avvisi sui dati e gli avanzi
   · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/aviso.ts. La premessa apre l'ultimo
   passo della registrazione ed è l'unica cosa che qualcuno può capire
   male in un modo che fa danno: credere che l'app sappia se la dose sia
   giusta.

   ⚠️ E NON SI SMINUISCE PER PROTEGGERSI. "Questa non è un'app medica" è
   vero ed è vile: chi legge ha appena risposto a tredici domande sulla
   propria terapia, e merita di sapere che cosa ottiene, non solo che cosa
   non ottiene. La frase dice tutte e due le cose, in quest'ordine — che
   cosa facciamo, e dove ci fermiamo.
   ============================================================ */

export const aviso = {
  isencaoTitulo: 'Non sostituiamo l’assistenza medica',
  isencaoTexto: 'Mettiamo in ordine quello che registri e mostriamo andamenti nei tuoi dati. Non facciamo diagnosi e non prescriviamo, e niente di quello che vedi qui sostituisce il parere di un professionista sanitario.',
  isencaoReforco: 'In caso di sintomo grave, rivolgiti subito a un medico. Cambia dose o farmaco solo su indicazione medica.',

  /* Le quattro schede sui dati, nell'ordine in cui arriva il dubbio. */
  guardadoTitulo: 'Salvato nel tuo account',
  guardadoTexto: 'Su questo telefono e nel nostro database, a San Paolo. Solo il tuo account legge ciò che è tuo.',

  usoTitulo: 'Usato per seguirti',
  usoTexto: 'Per gli obiettivi, l’andamento e quello da portare alla visita. Non è una diagnosi.',

  /* ⚠️ LA PARTE CHE UN AVVISO DI CONSENSO DI SOLITO TACE, e che qui è
     l'unica che cambia quello che la persona decide. */
  saiTitulo: 'Esce solo con un tuo gesto',
  saiTexto: 'Verso la clinica a cui ti colleghi con il suo codice, e la foto del piatto, quando chiedi la lettura.',

  controleTitulo: 'Il controllo resta tuo',
  controleTexto: 'Correggi, esporta o cancella i tuoi dati quando vuoi.',

  /* a frase que faz do Continuar do último passo do cadastro um aceite (ui/consentimento) */
  termosDeUso: 'Termini d’uso',
  politicaDePrivacidade: 'Informativa sulla privacy',
  aceiteAntes: 'Toccando Continua, accetti quanto sopra, i ',
  aceiteEntre: ' e l’',
  aceiteDepois: '.',

  perguntasTitulo: 'Le tue domande a Morphi',
  perguntasTexto: 'Se ce lo permetti, leggiamo le domande che fai a Morphi per capire quali dubbi emergono e migliorare le risposte. Le leggiamo senza sapere chi le ha fatte, e la clinica non le legge mai. È spento all’inizio, e dire di no non cambia niente nell’app.',
  perguntasEscolha: 'Permettere la lettura delle mie domande',
  perguntasDetalhe: 'Accenderlo invia anche le domande già qui. Puoi spegnerlo quando vuoi, in Privacy e dati, e quelle inviate vengono cancellate.',

  consentimentoNovo: {
    titulo: 'Abbiamo cambiato come conserviamo il tuo diario',
    lead: 'Ora resta anche nel tuo account, nel nostro database, per non perdersi quando cambi telefono. Prima di continuare, leggi cosa è cambiato.',
    aceitar: 'Accetta e continua',
    recusar: 'Non sono d’accordo',
    recusaTitulo: 'Senza accettare non si può andare avanti',
    recusaTexto: 'L’app ora conserva il diario nel tuo account, e senza non funziona. Se non sei d’accordo, puoi portare via i tuoi dati in un file e cancellare tutto da questo dispositivo. Non si cancella niente senza che tu lo chieda.',
    exportar: 'Esporta i miei dati',
    apagar: 'Cancella i miei dati da questo dispositivo',
    apagarPergunta: 'Cancellare tutto da questo dispositivo? Non si può annullare.',
    apagarConfirma: 'Cancella',
    voltar: 'Torna indietro e rileggi',
  },

  /* ============================================================
     I COLLEGAMENTI — che cosa porta ogni archivio

     ⚠️ SOLO IL NOME DI APPLE CAMBIA CON LA LINGUA. "Apple Salute" è
     "Apple Health" in inglese perché è Apple stessa a tradurre il nome
     della propria app. Health Connect, Garmin, Fitbit e Withings sono
     marchi e restano nel codice: un marchio non si traduce.
     ============================================================ */
  appleSaude: 'Apple Salute',
  trazPesagens: 'Le tue pesate — comprese quelle che la tua bilancia manda lì.',
  trazTreinos: 'Allenamenti e frequenza cardiaca',
  trazSono: 'Sonno e passi',
  trazBalanca: 'Bilancia e pressione',

  /* ============================================================
     LA LETTURA DA FOTO, quando non riesce

     ⚠️ TUTTE E TRE FINISCONO OFFRENDO LA STRADA MANUALE, ed è quello che
     le separa da un messaggio di errore: la persona ha fotografato il
     piatto perché vuole registrarlo, e dirle solo "non è riuscito" la
     lascia a metà strada.
     ============================================================ */
  fotoSemServidor: 'La lettura da foto non è ancora attiva. Puoi comporre il piatto qui sotto.',
  fotoSemRede: 'Nessuna connessione per leggere la foto adesso. Puoi comporre il piatto qui sotto.',
  fotoNaoReconheci: 'Non sono riuscito a riconoscere il piatto. Componi qui sotto quello che c’era.',

  /* ============================================================
     L'ABBONAMENTO e l'esportazione
     ============================================================ */
  porMes: 'al mese',
  porMesCurto: '/mese',

  /* ⚠️ L'AVVISO DEL FILE ESPORTATO È LO STESSO DEL RIEPILOGO, e per la
     stessa ragione: chi apre questo JSON deve sapere che sono registri
     della persona stessa, e non una cartella clinica. */
  exportacaoAviso: 'Registri fatti dalla persona stessa nell’app. Non è una cartella clinica né un referto.',
  exportacaoTitulo: 'I tuoi dati di Morphi',
  exportacaoPerguntasRecentes: 'Senza connessione sono arrivate solo le domande recenti di questo dispositivo. Con la connessione, il file porta tutte quelle del tuo account.',

  /* Il farmaco di chi non ha ancora risposto. */
  medIndefinido: 'Non ancora definito',

  /* Il contenitore d'acqua più grande, che non stava nell'elenco delle
     bevande. */
  garrafao: 'Boccione',

  /* ============================================================
     LE DISCIPLINE DI MOVIMENTO

     ⚠️ I NOMI SONO CHIAVE ED ETICHETTA INSIEME — è il `tipo` che resta
     registrato in ogni allenamento. Tradurre non rompe un registro nuovo,
     e un registro vecchio compare con il nome con cui è stato salvato.
     ============================================================ */
  modalidades: {
    caminhada: 'Camminata',
    corrida: 'Corsa',
    musculacao: 'Pesi',
    bike: 'Bici',
    natacao: 'Nuoto',
    yoga: 'Yoga',
    pilates: 'Pilates',
    funcional: 'Funzionale',
    alongamento: 'Stretching',
    outro: 'Altro',
  },

  /* ============================================================
     LA SCHERMATA DI ESPORTAZIONE

     ⚠️ OGNI RIGA DI "CHE COSA ENTRA" È UN INTERRUTTORE, e il suo
     sottotitolo racconta che cosa c'è da far entrare. Per questo ogni
     conteggio è una funzione: chi non ha mai registrato un esame legge "0
     risultati", che è la verità, e non una riga muta.

     ⚠️⚠️ E "PRELIEVI" È DIVENTATO "RISULTATI". Il conto somma i VALORI di
     ogni marcatore — tre date di HbA1c sono tre valori — e chiamarli
     prelievi annunciava un numero di prelievi che non c'è mai stato.
     ============================================================ */
  telaExportar: {
    titulo: 'Esporta',
    lead: 'Un file con i tuoi registri, da conservare o da portare altrove.',

    periodo: 'Periodo',
    periodoAjuda: (de: string, ate: string, semanas: number) =>
      `Dal ${de} al ${ate} · ${semanas} ${semanas === 1 ? 'settimana' : 'settimane'}`,
    ultimas4: 'Ultime 4 settimane',
    desdeAConsulta: 'Dall’ultima visita',
    tratamentoInteiro: 'Tutta la terapia',

    oQueEntra: 'Che cosa entra',
    oQueEntraNota: 'Tocca per includere o togliere. Quello che resta fuori non entra nel file.',
    incluido: 'incluso',
    fora: 'fuori',

    aplicacoes: 'Punture',
    aplicacoesSub: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'registro' : 'registri'} · data, dose e zona`,
    pesoEMedidas: 'Peso e misure',
    pesoEMedidasSub: (pesagens: number, medidas: number) =>
      `${pesagens} ${pesagens === 1 ? 'pesata' : 'pesate'} · ${medidas} ${medidas === 1 ? 'misura' : 'misure'}`,
    checkins: 'Check-in',
    checkinsSub: (dias: number) => `${dias} ${dias === 1 ? 'giorno' : 'giorni'} · sintomo per sintomo`,
    exames: 'Esami',
    examesSub: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'risultato' : 'risultati'} · valore e riferimento`,
    notas: 'Note per la visita',
    notasSub: (quantas: number) => `${quantas} ${quantas === 1 ? 'appunto' : 'appunti'}`,
    habitos: 'Pasti, acqua e movimento',
    habitosSub: (refeicoes: number) =>
      `${refeicoes} ${refeicoes === 1 ? 'pasto' : 'pasti'} e il diario del giorno`,
    completo: 'Il diario completo',
    completoSub: 'Tutto quello che conserva il tuo account, senza limiti di periodo, con le tue domande',

    formatoTitulo: 'Esce un file .json',
    formatoTexto: 'È il formato che un’altra app riesce ad aprire e leggere — serve a conservare una copia o a portare i registri altrove. Per una versione fatta per essere letta da una persona, usa il riepilogo per la visita.',

    gerar: 'Crea il file',
    gerando: 'Sto creando…',
    verResumo: 'Vedi il riepilogo per la visita',

    pronto: 'File creato. Va solo dove lo mandi tu.',
    erro: 'Non siamo riusciti a creare il file su questo dispositivo. I tuoi registri sono ancora qui, intatti.',
    parado: 'Il file viene creato solo quando tocchi il pulsante.',
  },

  /* ============================================================
     LA SCHERMATA DI PRIVACY E DATI

     ⚠️⚠️ QUI NESSUNA FRASE PUÒ SBAGLIARE DALLA PARTE COMODA. È la
     schermata dove la persona va a controllare che cosa esce dal suo
     dispositivo, e un errore "sicuro" — promettere più uscite di quante
     ce ne siano — fa sì che qualcuno smetta di registrare un sintomo
     credendo che sia già arrivato a qualcuno.

     ⚠️ E SUPABASE FARÀ CADERE METÀ DI QUESTO. Oggi l'app non ha un
     account, né un server, né una copia, e per questo quello che è
     scritto è vero. La lista frase per frase sta in PENDENCIAS, voce 10 —
     e tradurre non anticipa niente: le sei versioni cambiano insieme.

     ⚠️ QUESTA NON È L'INFORMATIVA. Un documento legale descrive gli
     obblighi di un'azienda; questa schermata descrive il comportamento
     del programma.
     ============================================================ */
  telaPrivacidade: {
    titulo: 'Privacy e dati',
    lead: 'Dove restano i tuoi registri, che cosa esce da qui e che cosa l’app legge da fuori.',
    statusGuardadoTitulo: 'Il tuo diario è al sicuro',
    statusGuardadoTexto: 'Su questo dispositivo e nel tuo account, a San Paolo. Se cambi dispositivo, torna quando accedi.',
    statusAquiTitulo: 'Il tuo diario è su questo dispositivo',
    statusAquiTexto: 'Non ha ancora un account: per ora resta solo qui.',

    /* ---------- dove restano ---------- */

    /* ---------- che cosa esce ---------- */
    oQueSai: 'Che cosa esce da qui',
    oQueSaiNota: 'Solo il primo va da solo. Il resto dipende da un tuo gesto.',
    saiConta: 'Il tuo account',
    saiContaResumo: 'Va da solo',
    saiClinica: 'La tua clinica',
    saiClinicaNenhuma: 'Nessuna collegata',
    saiClinicaConectada: 'Collegata',
    saiFoto: 'Foto del piatto',
    saiFotoResumo: 'Solo se la usi',
    saiMicrofone: 'Microfono',
    saiMicrofoneResumo: 'Solo quando è acceso',
    saiPerguntas: 'Domande a Morphi',
    saiPerguntasResumo: 'Restano qui',
    saiPerguntasTexto: 'Le domande che fai a Morphi restano solo su questo dispositivo: non vanno nel tuo account, né alla clinica, né a noi.',
    paraContaTexto: 'I registri e il profilo vanno nel nostro database ogni volta che c’è connessione. È questo che conserva il diario tra i dispositivi.',
    paraEquipeTexto: 'Niente, finché non ti colleghi a una clinica partner con il suo codice. Prima di collegarti compare l’elenco di cosa potrà vedere; lo vede finché dura il collegamento, e puoi scollegarti dalla schermata della clinica. Il riepilogo per la visita si costruisce qui, ed esce quando lo mostri o lo esporti.',
    perguntas: 'Le tue domande a Morphi',
    perguntasTexto: 'Solo se permetti la lettura, con l’interruttore qui sotto. Le leggiamo senza sapere chi le ha fatte, e la clinica non le legge mai. Spegnerlo cancella quelle inviate.',
    ditadoTexto: 'A trasformare la voce in testo è il sistema del dispositivo. Chiediamo che succeda sul dispositivo stesso, ma senza il riconoscimento locale della tua lingua il sistema può inviare l’audio ad Apple o a Google. Solo finché il microfono è acceso.',
    fotoDoPratoTexto: 'Viene ridotta sul dispositivo e inviata perché la legga un modello, che restituisce gli elementi del piatto. L’immagine non resta salvata: né nel tuo registro del pasto, né sul server che fa da ponte. Registrare il pasto a mano non invia niente.',

    /* ---------- che cosa entra ----------

       ⚠️ IL NOME DELL'ARCHIVIO CAMBIA CON IL DISPOSITIVO, e citare quello
       sbagliato manderebbe la persona a cercare nelle impostazioni una
       cosa che lì non c'è.

       ⚠️ E DICEVA "l'app legge le pesate… Si limita a leggere". Due volte
       l'app che parla di sé in terza persona, in una schermata in cui la
       domanda è proprio chi fa che cosa. A leggere siamo noi. */
    leDeFora: 'Che cosa l’app legge da fuori',
    leSaudeResumo: 'Solo il peso',
    appDeSaudePadrao: 'app di salute del telefono',
    soOPesoTexto: (app: string) =>
      `Con il tuo permesso, leggiamo le pesate che la tua bilancia, il tuo orologio o un’altra app hanno scritto lì. Ci limitiamo a leggere: non scriviamo mai niente in ${app}. E leggiamo solo il peso — sonno, passi e battiti restano fuori.`,
    permissaoTexto: 'Si dà nelle impostazioni di sistema e si revoca nello stesso posto. Senza, qui continua a funzionare tutto: il peso torna a entrare come entrava prima, scritto da te.',

    /* ---------- che cosa si può fare ---------- */
    podeFazer: 'Che cosa puoi fare adesso',
    integracoesSub: (app: string) => `Collegare o scollegare ${app}`,
    resumo: 'Riepilogo per la visita',
    resumoSub: 'Vedi tutto quello che entra nel riepilogo della visita',

    /* ---------- cancellare ----------

       ⚠️ DUE DOMANDE, E NON UNA. La prima è il tocco sulla riga; la
       seconda dice che cosa se ne va e che non c'è una copia da nessuna
       parte. "Sei sicura?" è la domanda che non informa di niente, ed è
       esattamente quella a cui si risponde "sì" in automatico. */
    apagar: 'Cancella i miei dati',
    apagarSub: 'Tutto quello che hai registrato, senza ritorno',
    apagarPergunta: 'Cancellare tutto da questo dispositivo? Questo diario non ha ancora un account, e non ne esiste una copia altrove.',
    apagarConfirma: 'Cancella',
    cancelar: 'Annulla',

    /* ---------- i documenti ---------- */
    documentos: 'I documenti',
    politicaSub: 'Il documento completo, con la base giuridica e i tempi',
    termosSub: 'Che cosa siamo, che cosa non siamo, e che cosa può aspettarsi ciascuna parte',
    semPoliticaTitulo: 'Questo descrive l’app, non è l’informativa sulla privacy',
    semPoliticaTexto: 'Qui c’è che cosa fa l’app con i tuoi dati. Il documento legale, con gli obblighi di chi gestisce il servizio, non è ancora stato pubblicato — e quando esisterà, comparirà in questa schermata.',
  },

  /* ============================================================
     LA SCHERMATA DEI COLLEGAMENTI

     ⚠️ OGNI MOTIVO HA IL SUO MESSAGGIO. "Non disponibile" serve a tutte e
     tre le situazioni e non ne risolve nessuna: chi è nel browser deve
     sapere che è il browser, chi è nell'anteprima deve sapere che è la
     build, e chi è su un Android senza Health Connect deve sapere che si
     può installare.

     ⚠️ E IL NUMERO È IL MESSAGGIO DELLA LETTURA. "Sincronizzato" non dice
     se sia arrivato qualcosa, e zero è una risposta legittima.
     ============================================================ */
  telaIntegracoes: {
    titulo: 'Collegamenti',
    lead: 'Collegati, portano le tue pesate senza che tu scriva niente.',

    doSeuAparelho: 'Dal tuo dispositivo',
    doSeuAparelhoNota: 'Un archivio locale: chiediamo il permesso e leggiamo. Senza account e senza password.',

    atualizarAgora: 'Aggiorna adesso',
    lendo: 'Sto leggendo…',
    nadaNovo: 'Niente di nuovo da quella parte — le tue pesate erano già tutte qui.',
    trazidas: (quantas: number, aparelho: string) =>
      `${quantas} ${quantas === 1 ? 'pesata presa' : 'pesate prese'} da ${aparelho}.`,
    naoDeuParaLer: 'Non è stato possibile leggere adesso. Riprova fra un istante.',
    acessoNegado: 'Il permesso non è stato dato. Puoi cambiarlo nelle impostazioni del dispositivo.',

    semAparelhoTitulo: 'L’app di salute del dispositivo compare sul telefono',
    semAparelhoTexto: 'Apple Salute su iPhone, Health Connect su Android. Nel browser non c’è niente da collegare.',
    semAppTitulo: (aparelho: string) => `${aparelho} non è disponibile su questo dispositivo`,
    semAppTexto: 'Health Connect arriva con Android 14 in poi e si può installare sulle versioni precedenti. Dopo averlo installato, torna qui.',
    semBuildTitulo: 'Questa versione dell’app non legge ancora il dispositivo',
    semBuildTexto: 'Leggere Apple Salute e Health Connect richiede una versione installata dell’app, e non l’anteprima. In Expo Go non esiste.',

    contasDeServico: 'Account di servizio',
    contasDeServicoNota: 'Questi consegnano i dati a un server, e non al telefono — il collegamento arriva quando quel server sarà in piedi. Nel frattempo, quello che mandano all’app di salute del tuo dispositivo arriva già qui.',
    emBreve: 'Presto',
  },
};
