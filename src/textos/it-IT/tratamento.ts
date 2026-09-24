/* ============================================================
   LA TERAPIA — la dose, la cadenza, i traguardi e i metri · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/tratamento.ts. Quello che questo file
   ha in comune: sono le parole che descrivono la terapia in sé, e quasi
   tutte compaiono in più di una schermata.

   ⚠️ NESSUNA DI LORO DÀ UN VOTO ALLA PERSONA. Le etichette di ritmo e di
   scorta qualificano il NUMERO, non chi l'ha prodotto.
   ============================================================ */

export const tratamento = {
  /* ============================================================
     IL NOME DEL PRINCIPIO ATTIVO

     ⚠️⚠️ LA CHIAVE È IL NOME IN PORTOGHESE, E NON SI TRADUCE.
     'Tirzepatida' è quello che sta registrato in `MEDS[x].mol`, è quello
     che `faixaDaMolecula` confronta per trovare la fascia di dose, ed è
     quello che esce nel file esportato.

     ⚠️⚠️ E IL NOME CAMBIA DAVVERO CON LA LINGUA. La denominazione comune
     internazionale ha una grafia propria in ogni lingua, e in italiano
     finisce in "-e" dove il portoghese finisce in "-a": "semaglutide",
     "tirzepatide". Compare DENTRO una frase in sei schermate — la lettera
     del companion sulla fame, il ciclo, la linea del tempo, il riepilogo
     per la visita. Prima di questa tabella un'italiana leggeva
     "Tirzepatida" in mezzo a una frase italiana.

     ⚠️ CHI NON È QUI COMPARE CON LA PROPRIA CHIAVE, per la stessa regola
     di `marcadores.nome`: un farmaco nuovo non sparisce dalla schermata
     perché la tabella non lo conosce ancora.

     ⚠️ E IL TRATTINO È LA PREPARAZIONE MAGISTRALE, che non ha né marca né
     un nome comune proprio — è lo stesso segno in ogni lingua.
     ============================================================ */
  molecula: {
    'Tirzepatida': 'Tirzepatide',
    'Semaglutida': 'Semaglutide',
    'Dulaglutida': 'Dulaglutide',
    'Liraglutida': 'Liraglutide',
    '—': '—',
  } as Record<string, string>,

  /* ---------- la dose e la cadenza ---------- */
  /* ⚠️ L'ASSENZA HA UNA FRASE SUA, ed è corta di proposito: entra in mezzo
     ad altre, come "Mounjaro ancora da definire". */
  doseIndefinida: 'ancora da definire',

  /* ⚠️ DUE LUNGHEZZE, ED È DI PROPOSITO. La riga di apertura di una
     schermata parla per esteso; la cella di una tabella di riepilogo
     medico non ha quella larghezza. */
  cadenciaSemanal: 'una volta a settimana',
  cadenciaDiaria: 'uso quotidiano',
  cadenciaOutra: (dias: number) => `ogni ${dias} giorni`,
  cadenciaSemanalCurta: '1× a settimana',
  cadenciaDiariaCurta: 'quotidiana',
  cadenciaOutraCurta: (dias: number) => `ogni ${dias} giorni`,

  /* ---------- il giorno della terapia ---------- */
  antesDaPrimeiraDose: 'Prima della prima dose',
  comecaAmanha: 'Comincia domani',
  comecaEm: (dias: number) => `Comincia fra ${dias} giorni`,
  /* ⚠️ "GIORNO 71", E NON "GIORNO 71 DELLA TERAPIA". La riga dove questo
     compare finisce già con "Settimana 10". */
  diaDoTratamento: (dia: number) => `Giorno ${dia}`,

  /* ============================================================
     IL RITMO DEL CALO

     ⚠️ UN RITMO NEGATIVO NON È "UN RITMO PIÙ LENTO". Chi aveva preso peso
     finiva nell'ultima etichetta, e la scheda diceva "Ritmo più lento" in
     verde accanto a un numero che era salito. Lento e all'incontrario
     sono cose diverse, e solo una delle due è un ritmo.

     ⚠️ E ACCELERATO NON È CATTIVO. Perdere più di 1,5 kg a settimana è un
     motivo per parlarne con il team — massa magra, idratazione — e non un
     errore che la persona ha commesso.
     ============================================================ */
  ritmoAcimaDoInicio: 'Sopra il peso iniziale',
  ritmoSaudavel: 'A un ritmo sano',
  ritmoAcelerado: 'Ritmo accelerato',
  ritmoLento: 'Ritmo più lento',

  /* ============================================================
     LA SCORTA
     ============================================================ */
  estoqueUrgente: 'Rinnova adesso',
  estoqueRenovar: 'Vale la pena rinnovare la ricetta',
  estoqueEmDia: 'Scorta a posto',

  /* ============================================================
     LE ZONE DELLA PUNTURA

     ⚠️ IL LATO ARRIVA ABBREVIATO E FRA PARENTESI perché queste etichette
     compaiono dentro righe corte — storico, suggerimento del giorno,
     riassunto della settimana. "Addome lato sinistro" non ci sta in
     nessuna.
     ============================================================ */
  locais: {
    'abd-e': 'Addome (sin.)',
    'abd-d': 'Addome (des.)',
    'coxa-e': 'Coscia (sin.)',
    'coxa-d': 'Coscia (des.)',
    'braco-e': 'Braccio (sin.)',
    'braco-d': 'Braccio (des.)',
  },

  /* ============================================================
     I TRAGUARDI DEL PERCORSO
     ============================================================ */
  marcos: {
    inicio: 'Inizio della terapia',
    doseAjustada: (dose: string) => `Dose portata a ${dose} mg`,
    /* ⚠️ "SECONDO INDICAZIONE MEDICA" è quello che impedisce alla riga di
       sembrare che sia stata l'app ad aggiustare qualcosa. Lei registra;
       chi aggiusta è chi prescrive. */
    titulacao: 'Titolazione secondo indicazione medica',
    cincoPorCento: '5% del peso iniziale',
    /* ⚠️ "OLTRE LA BILANCIA" è il cuore: il 5% è il segno a partire dal
       quale la letteratura mostra un guadagno su pressione, glicemia e
       trigliceridi. */
    cincoPorCentoSub: 'Segno clinico, con benefici oltre la bilancia',
    consulta: (tipo: string) => `Visita ${tipo}`,
    marcadoresImportados: (quantos: number) => `${quantos} marcatori importati`,
  },

  /* ============================================================
     LE FASCE DI IMC

     ⚠️ SONO I NOMI DELLA CLASSIFICAZIONE, e non aggettivi scelti da noi.
     "Obesità di I grado" è il termine del referto; sostituirlo con
     qualcosa di più morbido disallineerebbe l'app da quello che la
     persona legge nell'esame e in visita. Dove entra la cura è nel TONO
     del colore, che è una decisione di schermata.
     ============================================================ */
  imc: {
    abaixo: 'Sottopeso',
    normal: 'Normopeso',
    sobrepeso: 'Sovrappeso',
    grau1: 'Obesità di I grado',
    grau2: 'Obesità di II grado',
    grau3: 'Obesità di III grado',
  },

  /* ============================================================
     CHE COSA HA PORTATO LA PERSONA QUI

     ⚠️ NESSUNO DEI CINQUE PARLA SOLO DI ASPETTO, e "Come mi vedo" è il
     più vicino a questo di proposito: la frase è della persona su di sé,
     non dell'app sul suo corpo. "Dimagrire per essere bella" sarebbe un
     altro prodotto.
     ============================================================ */
  motivos: {
    saude: 'Salute',
    saudeSub: 'Esami, pressione, glicemia',
    energia: 'Energia',
    energiaSub: 'Forze durante la giornata',
    espelho: 'Come mi vedo',
    espelhoSub: 'Allo specchio e nelle foto',
    confianca: 'Sicurezza',
    confiancaSub: 'Stare bene con me stessa',
    medico: 'Indicazione medica',
    medicoSub: 'Me l’ha detto chi mi segue',
  },

  /* ============================================================
     I QUATTRO GRADINI DI ATTIVITÀ

     ⚠️ IL SOTTOTITOLO È QUELLO CHE FA SIGNIFICARE QUALCOSA AL GRADINO.
     Senza "da 1 a 3 giorni a settimana", "poco attiva" è un'autovalutazione,
     e ognuna si mette su un gradino diverso — su un numero che diventerà
     il suo obiettivo di proteine.
     ============================================================ */
  atividades: {
    sedentario: 'Sedentaria',
    sedentarioSub: 'Poco o nessun movimento',
    leve: 'Poco attiva',
    leveSub: 'Da 1 a 3 giorni a settimana',
    moderado: 'Moderatamente attiva',
    moderadoSub: 'Da 3 a 5 giorni a settimana',
    muito: 'Molto attiva',
    muitoSub: 'Da 6 a 7 giorni a settimana',
  },

  /* ============================================================
     LA SCHERMATA DEL MOVIMENTO

     ⚠️⚠️ LA DURATA È REGOLA DI LINGUA, ed era scritta fissa nella
     schermata. "6 h 20" invece di "380 min": sopra l'ora, i minuti puri
     obbligano la persona a dividere a mente per capire se sia tanto.

     E ogni lingua scrive l'ora a modo suo — "6 h 20", "6 hr 20", "6 Std.
     20". Lasciare la funzione nella schermata obbligava tutte a usare
     l'abbreviazione portoghese.
     ============================================================ */
  telaExercicio: {
    titulo: 'Movimento',
    /* ⚠️ 'min' È UN SIMBOLO E RESTEREBBE NEL CODICE per la regola in alto
       in questo file — ma il tedesco scrive 'Min.' nella prosa, e le
       altre chiavi di qui lo scrivono già così. */
    unidadeMin: 'min',
    duracao: (min: number) => {
      if (min < 60) return `${min} min`;
      const h = Math.floor(min / 60);
      const m = min % 60;
      return m ? `${h} h ${m}` : `${h} h`;
    },

    /* La copertina: il giorno, e la settimana subito dietro. Il numero di
       oggi DA SOLO trasforma il riposo in un fallimento. */
    hojeSemTreino: (daSemana: number) => `Oggi: ancora nessun allenamento · ${daSemana} min questa settimana`,
    hojeComTreino: (hoje: number, alvo: number, resto: string) => `Oggi: ${hoje} di ${alvo} min · ${resto}`,
    metaAlcancada: 'obiettivo raggiunto',
    faltamMin: (falta: number) => `mancano ${falta} min`,
    registrarTreino: 'Registra un allenamento',

    /* La settimana */
    movimentoTitulo: 'Il tuo movimento',
    estaSemana: 'Questa settimana',
    nenhumDiaComMovimento: 'Nessun giorno con movimento',
    emDiasDosSete: (dias: number) => `In ${dias} ${dias === 1 ? 'giorno' : 'giorni'} su sette`,
    metaMin: (alvo: number) => `Obiettivo: ${alvo} min`,

    /* ⚠️ LA RIGA DELLA FORZA RIFERISCE, NON RIMPROVERA. In deficit
       calorico chi fa solo cardio perde massa magra insieme al grasso, e
       la massa magra è quello che l'app passa la giornata a cercare di
       tenere. La frase dice quanti giorni ci sono stati, e si ferma. */
    semForca: 'Nessun allenamento di forza questa settimana. Pesi, pilates e functional training sono quelli che tengono il muscolo.',
    comForca: (dias: number) => `${dias} ${dias === 1 ? 'giorno' : 'giorni'} con allenamento di forza — è quello che tiene il muscolo mentre il peso scende.`,

    minutosPorSemana: 'Minuti a settimana',
    mediaOitoSemanas: 'Media delle ultime 8 settimane',
    semanaDe: (data: string) => `settimana del ${data}`,

    /* Il periodo */
    periodo7: '7 giorni',
    periodo30: '30 giorni',
    periodo90: '3 mesi',
    noPeriodo: 'Nel periodo',
    noPeriodoNota: 'Solo quello che è stato registrato qui — quello che arriva dall’orologio non indica la disciplina.',
    treinos: 'Allenamenti',
    tempo: 'Tempo',
    maisLongo: 'Il più lungo',
    deForca: 'Di forza',

    /* Il diario */
    diarioTitulo: 'Diario degli allenamenti',
    diarioNota: 'Tocca un allenamento per vederlo, correggerlo o cancellarlo.',
    diaVazioTitulo: 'Nessun allenamento in questo giorno',
    /* "Anche il riposo fa parte" — e non "registra un allenamento": un
       giorno senza allenamento in una terapia non è una cosa in
       sospeso. */
    diaVazioTexto: 'Anche il riposo fa parte.',

    integracoes: 'Collegamenti',
    conectar: 'Collega un orologio o un’app',
    lancamSozinhos: 'Inseriscono i minuti da soli',
    conectarSub: 'Apple Salute, Health Connect, Garmin e altri',
  },

  /* ============================================================
     LA SCHERMATA DELLE PUNTURE
     ============================================================ */
  telaAplicacoes: {
    aplicada: 'fatta',
    /* ⚠️ "NIENTE SENSI DI COLPA PER UN GIORNO CHE È PASSATO" È TUTTA LA
       FRASE, ed è il motivo per cui la griglia non ha il rosso: chi ha
       saltato una dose quasi sempre l'ha saltata perché stava male, e una
       casella rossa in un calendario di farmaci è l'app che rimprovera
       chi ha già pagato. */
    semCulpa: 'Niente sensi di colpa per un giorno che è passato — quello che conta è riprendere. Puoi registrare una puntura precedente in qualsiasi momento, con il pulsante qui sotto.',
    titulo: 'Punture',
    registrar: 'Registra la puntura',
    /* I tre arrivano pronti: la marca, il principio attivo e la cadenza. */
    lead: (med: string, molecula: string, cadencia: string) => `${med} · ${molecula} · ${cadencia}`,

    proximaAplicacao: 'PROSSIMA PUNTURA',

    cicloDaDose: 'Ciclo della dose',
    cicloSub: (dia: number, total: number, fase: string) => `Giorno ${dia} di ${total} · ${fase.toLowerCase()}`,
    emCurso: 'in corso',

    /* Il contenitore arriva concordato e con la maiuscola — "Penna",
       "Flacone". */
    medicamento: 'Farmaco',
    dosesRestantesNo: (restam: number, onde: string) =>
      `${restam === 1 ? 'Resta 1 dose' : `Restano ${restam} dosi`} ${onde}`,
    cobreSemanas: (veredito: string, semanas: number) =>
      `${veredito} — copre circa ${semanas} ${semanas === 1 ? 'settimana' : 'settimane'}`,

    alertasDeDose: (quantos: number) => `${quantos} ${quantos === 1 ? 'avviso' : 'avvisi'} per la puntura`,
    nenhumAlerta: 'Nessun avviso per la puntura',
    tocaEm: (quando: string) => `Suona ${quando}`,
    avisoAntes: 'Un avviso prima della dose, all’ora che scegli tu',

    proxima: 'prossima',

    /* ⚠️ "COSTANZA", E LA NOTA È UNA FRAZIONE E NON UNA PERCENTUALE. Era
       "88% in ordine" — e "in ordine" parla di PUNTUALITÀ, che questo
       conto non misura: chi ha fatto tutte e dieci le dosi sempre con tre
       giorni di ritardo faceva anche lei 100%. */
    constancia: 'Costanza',
    constanciaNota: (feitas: number, previstas: number, semanas: number) =>
      `${feitas} di ${previstas} dosi previste nelle ultime ${semanas} settimane.`,

    nivelNoCorpo: 'Livello nel corpo',
    nivelTexto: (molecula: string, meiaVida: string) =>
      `Stima di ${molecula} nel tuo corpo, con un’emivita di ${meiaVida}. Il punto più basso, prima della dose successiva, è di solito quando la fame aumenta.`,
    meiaVidaDias: (dias: number) => `${dias} giorni`,
    meiaVidaHoras: 'circa 13 ore',

    historico: 'Storico',
    proximaEmLocal: (local: string) => `Prossima · ${local}`,
  },

  /* ============================================================
     LA SCHERMATA DEL CONTENITORE E DELLA RICETTA

     Ci abitano due conteggi diversi, e confonderli è l'errore classico di
     questo tipo di schermata: quante dosi stanno ancora nel dispositivo,
     e quanti giorni dura dopo l'apertura. Un contenitore può avere dosi
     avanzate ed essere scaduto.

     ⚠️⚠️ LE PAROLE CHE CONCORDANO ARRIVANO DA QUI, E NON DALLA SCHERMATA.
     Il codice chiamava `concordar(forma, 'aberto', 'aberta')` — le due
     grafie SCRITTE NEL PUNTO DI CHIAMATA, in portoghese. In tedesco
     restituiva "aberto" o "aberta", che è portoghese in tutti e due i
     modi.

     ⚠️ E "CHIUSA" ERA AL FEMMINILE FISSO, concordando con "penna" in un
     elenco che mostra anche il flacone e il blister. È diventata una
     coppia.
     ============================================================ */
  telaCaneta: {
    /* Le due grafie di ogni parola che concorda. La schermata le unisce
       con `concordar`, che è chi conosce il genere del contenitore. */
    abertoM: 'aperto',
    abertoF: 'aperta',
    nenhumM: 'Nessun',
    nenhumF: 'Nessuna',
    desteM: 'di questo',
    desteF: 'di questa',
    novoM: 'Nuovo',
    novoF: 'Nuova',
    encerradoM: 'chiuso',
    encerradoF: 'chiusa',

    nova: 'Nuova',
    lembrarRenovar: 'Ricordami di rinnovare',
    tituloDose: (medicamento: string, dose: string, unidade: string) =>
      `${medicamento} ${dose} ${unidade}`,

    leadAberto: (Recipiente: string, aberto: string, data: string, total: number, recipiente: string) =>
      `${Recipiente} ${aberto} il ${data} · ${total} dosi per ${recipiente}`,
    leadSemAberto: (nenhum: string, recipiente: string, aberto: string, total: number) =>
      `${nenhum} ${recipiente} ${aberto} · ${total} dosi per ${recipiente}`,

    dosesUsadas: 'Dosi usate',
    usadasDe: (usadas: number, total: number) => `${usadas} di ${total}`,
    ultimaDose: (deste: string, recipiente: string, data: string) =>
      `Ultima dose ${deste} ${recipiente}: ${data}`,

    /* ⚠️ "NON INDICATA" È UNO STATO, e non un vuoto: una preparazione
       magistrale non ha una scadenza da foglietto, e "0 giorni" sarebbe
       l'app che afferma che la cosa è scaduta il giorno in cui è stata
       aperta. */
    validadeApos: (aberto: string) => `Validità dopo ${aberto}`,
    validadeDias: (dias: number) => `${dias} giorni`,
    validadeNaoInformada: 'non indicata',
    venceEm: 'Scade il',
    quemPreparaDefine: 'il termine lo decide chi la prepara',

    receitaAte: 'Ricetta fino al',
    receitaSemanas: (semanas: number) => `${semanas} ${semanas === 1 ? 'settimana' : 'settimane'}`,

    /* Il contenitore può scadere prima che ne esca l'ultima dose — con 14
       giorni di validità e quattro dosi settimanali questa è la regola,
       non l'eccezione. */
    venceAntes: (oRecipiente: string) => `${oRecipiente} scade prima di finire`,
    venceAntesTexto: (medicamento: string, dias: number, total: number, aberto: string) =>
      `${medicamento} dura ${dias} giorni dopo essere ${aberto}, e in quel termine non ci stanno le ${total} dosi. Vale la pena chiedere a chi ti segue che cosa fare di quello che avanza.`,

    momentoDeRenovar: 'È il momento di chiedere il rinnovo',
    renovarTexto: (semanas: number) =>
      `La tua ricetta copre circa ${semanas} ${semanas === 1 ? 'settimana' : 'settimane'}. Chiederlo adesso evita di restare senza il farmaco fra una visita e l’altra.`,

    historico: (plural: string) => `Storico ${plural}`,
    emUso: 'in uso',
    itemEmUso: (Aberto: string, data: string, usadas: number, total: number) =>
      `${Aberto} il ${data} · ${usadas} di ${total} dosi`,
    itemEncerrado: (periodo: string, usadas: number, total: number) =>
      `${periodo} · ${usadas} di ${total} dosi`,
  },

  /* ============================================================
     LA SCHERMATA PER REGISTRARE UNA PUNTURA

     ⚠️ NON CONFONDERLA CON `telaAplicacoes`, che è l'ELENCO.

     ⚠️ LE TRE ZONE E I DUE LATI SONO LA FORMA SPEZZATA delle sei zone di
     `tratamento.locais`. L'id registrato resta la coppia — `abd-e`,
     `coxa-d` — ma presentarle come sei opzioni sciolte faceva leggere
     "Addome" tre volte per trovare il lato che si voleva.

     ⚠️ E L'ORDINALE DELLA DOSE È DI OGNI LINGUA — "3ª dose" in italiano e
     in portoghese, "3. Dosis" in tedesco, "3rd dose" in inglese. In
     italiano l'indicatore è femminile perché "dose" è femminile.
     ============================================================ */
  telaAplicacaoOk: {
    registrada: (Acao: string) => `${Acao} registrata`,
    proximaDose: 'Prossima dose',
    hoje: 'oggi',
    emDias: (dias: number) => `${dias} ${dias === 1 ? 'giorno' : 'giorni'}`,
    restamDoses: (restam: number) => (restam === 1 ? 'Resta 1 dose' : `Restano ${restam} dosi`),
    acabou: (outroRecipiente: string) => `Finita — conviene aprire ${outroRecipiente}`,
    seloFim: 'finita',
    registrarOutro: (outroRecipiente: string) => `Registra ${outroRecipiente}`,
    voltarParaJornada: 'Torna al Percorso',
  },

  telaRegistrarAplicacao: {
    registrar: (acao: string) => `Registra ${acao}`,
    salvar: (acao: string) => `Salva ${acao}`,

    /* ---------- quando ---------- */
    quando: 'Quando',
    ficaRegistradaAgora: (hora: string) => `Resta registrata adesso, ${hora}.`,
    registrarDepois: 'Registrarla dopo non cambia niente oltre alla data — il conto della dose successiva parte da qui.',

    /* ---------- farmaco e dose ---------- */
    medicamentoEDose: 'Farmaco e dose',
    medicamentoEDoseDaReceita: 'Farmaco e dose della ricetta',
    manipuladoSemEscada: 'La preparazione magistrale non ha una scala di dosi standard — il numero è quello della tua ricetta.',
    medComDose: (medicamento: string, dose: string, unidade: string) =>
      `${medicamento} · ${dose} ${unidade}`,
    mudeiADose: 'Ho cambiato la dose',
    /* Senza scala E senza fascia: non c'è una marca con quella molecola
       per quella via da cui ricavare un limite. */
    semFaixa: 'Per questo farmaco non abbiamo una fascia di riferimento. La dose resta quella del tuo ultimo registro.',

    /* ---------- la zona ---------- */
    localDaAplicacao: 'Zona della puntura',
    localAjuda: 'Cambiare zona ogni settimana aiuta a evitare irritazioni e noduli sotto la pelle.',
    regioes: {
      braco: 'Braccio',
      abd: 'Addome',
      coxa: 'Coscia',
    },
    /* Il "suggerita" marca la ZONA, e il suo lato arriva già scelto: la
       rotazione suggerisce un punto, non una metà del corpo. */
    sugerido: (nome: string) => `${nome} · suggerita`,
    lado: 'Lato',
    lados: {
      e: 'Sinistro',
      d: 'Destro',
    },
    localComDescanso: (local: string, descanso: string) => `${local} · ${descanso}`,
    naoUsado: 'Non ancora usata in questa terapia.',
    usadoEstaSemana: 'Usata questa settimana.',
    descansandoHa: (semanas: number) =>
      `A riposo da ${semanas} ${semanas === 1 ? 'settimana' : 'settimane'}.`,
    eOProximo: 'È la prossima della rotazione.',
    foraDaRotacao: 'Fuori dalla rotazione suggerita — nessun problema, è solo un promemoria.',

    /* ---------- il contenitore ---------- */
    ultimaDose: (deste: string, recipiente: string) =>
      `Questa è l’ultima dose ${deste} ${recipiente}.`,
    restamDoses: (quantas: number) => `Restano ${quantas} dosi.`,
    enesimaDose: (numero: number) => `${numero}ª dose`,
  },

  /* ============================================================
     UN ALLENAMENTO — il foglio che si apre toccando la riga del diario

     ⚠️ LE TRE DISCIPLINE DI FORZA NON SONO SCRITTE QUI. "pesi, pilates e
     functional training" è la tabella di `logic/modalidades` detta per
     esteso, e una copia scritta a mano sarebbe quella che resta indietro
     quando entra la quarta.
     ============================================================ */
  telaTreino: {
    titulo: 'Allenamento',
    naoEncontrei: 'Non ho trovato questo registro',
    apagadoEmOutraTela: 'Può essere stato cancellato in un’altra schermata.',

    semanaDoTratamento: (n: number) => `Settimana ${n} della terapia`,

    origem: 'Origine',
    origemVoce: 'Tu — registrato in questa schermata',
    origemIntegracao: (fonte: string) => `${fonte} — arrivato dal collegamento`,

    contaComoForca: 'Conta come forza',
    forcaSim: 'Sì — tira il muscolo',
    forcaNao: (modalidades: string) => `No — a contare sono ${modalidades}`,
    selo: 'Forza',

    corrigir: 'Correggi',
    apagar: 'Cancella',
    /* ⚠️ Il "min" VIENE DAL CATALOGO, ed era scritto qui in due frasi: il
       tedesco scrive "Min." nella prosa. */
    apagarTira: (min: number, unidade: string) =>
      `Cancellarlo toglie ${min === 1 ? 'il' : 'i'} ${min} ${unidade} dal totale di quel giorno.`,
  },

  /* ============================================================
     COME TI SEI MOSSA — il foglio che registra e corregge

     ⚠️⚠️ LA GRIGLIA DELLE DISCIPLINE NON STA QUI, e non può starci: è
     `MODALIDADES()`, in `logic/modalidades`, con gli stessi dieci nomi e
     le stesse dieci icone. La schermata aveva una copia sua in una
     costante di modulo.
     ============================================================ */
  telaMedirExercicio: {
    titulo: 'Come ti sei mossa?',
    tituloCorrigir: 'Correggi l’allenamento',
    subCorrigir: 'Che cosa è rimasto sbagliato nel registro',
    /* Il totale del giorno, e da dove ne è già arrivata una parte.
       L'articolo davanti al nome della fonte entra solo quando è una
       sola. */
    subHoje: (hoje: number, alvo: number, unidade: string, fonte: string | null, uma: boolean) =>
      `${hoje} di ${alvo} ${unidade} oggi${fonte ? ` · già con ${uma ? 'il ' : ''}${fonte}` : ''}`,

    botaoSemNome: 'Di’ che cosa hai fatto',
    botaoSalvarCorrecao: 'Salva la correzione',
    botaoRegistrar: (min: number, unidade: string, modalidade: string) =>
      `Registra ${min} ${unidade} di ${modalidade.toLowerCase()}`,

    somaAoQueContou: (uma: boolean) =>
      `Quello che registri qui si somma a quello che ${uma ? 'ha già contato' : 'hanno già contato'}.`,

    oQueVoceFez: 'CHE COSA HAI FATTO',
    qualPlaceholder: 'Quale? Es.: pallavolo, arrampicata, jiu-jitsu',

    porQuantoTempo: 'PER QUANTO TEMPO',
    duracao: 'Durata',

    apagarTreino: 'Cancella questo allenamento',
  },
};
