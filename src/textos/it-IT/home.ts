import { medidas } from './medidas';

/* ============================================================
   LA HOME E IL PERCORSO — gli obiettivi del giorno, le schede e la linea
   del tempo · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/home.ts. È il testo che vede più
   gente dopo il ciclo della dose, ed è quello che sembra meno un testo:
   quasi tutto qui è un'etichetta corta accanto a un numero.

   ⚠️ OGNI NUMERO MOSTRATO ARRIVA CON UN VERDETTO, ed è la parola che la
   persona cerca per prima. Il valore dice la misura; la parola dice se
   va bene. Senza, la persona fa il conto da sola, e in un'app di salute
   lo fa sbagliato.

   ⚠️ E NESSUN VERDETTO DI QUI DÀ UN VOTO ALLA PERSONA. "Sotto
   l'obiettivo" qualifica il numero; "non ti sei impegnata"
   qualificherebbe chi l'ha prodotto. La differenza sparisce facile in
   traduzione, ed è tutto il file a dipenderne.
   ============================================================ */

export const home = {
  /* ============================================================
     I TRE OBIETTIVI DEL GIORNO

     ⚠️ "OBIETTIVO RAGGIUNTO" NON È UN FESTEGGIAMENTO, È UNO STATO. Occupa
     lo stesso posto di "Mancano 27 g" — è la stessa riga che dice la
     stessa cosa dall'altro lato. Un "Complimenti!" lì cambierebbe che
     cosa è la scheda.
     ============================================================ */
  metas: {
    proteina: 'Proteine da mangiare',
    agua: 'Bere più acqua',
    exercicio: 'Muoversi ogni giorno',
    batida: 'Obiettivo raggiunto',
    faltamProteina: (gramas: number) => `Mancano ${gramas} g`,
    /* La quantità arriva già scritta, con l'unità di chi legge — litro o
       oncia. Vedi logic/medidas. */
    faltamAgua: (quanto: string) => `Mancano ${quanto}`,
    faltamExercicio: (minutos: number) => `Mancano ${minutos} min`,
  },

  /* ============================================================
     I VERDETTI DEI NUMERI

     ⚠️ "VICINO ALL'OBIETTIVO" È UNA BUONA NOTIZIA, ed è di proposito:
     l'85% dell'obiettivo di proteine è una buona giornata, e chiamarlo
     "sotto" insegna alla persona a ignorare la parola. Il terzo gradino
     esiste perché il primo continui a voler dire qualcosa.
     ============================================================ */
  veredito: {
    naMeta: 'In obiettivo',
    pertoDaMeta: 'Vicino all’obiettivo',
    abaixoDaMeta: 'Sotto l’obiettivo',
    /* ⚠️ "IN CALO" È IL RAMO CHE SALVA LA SCHEDA DELLA MASSA GRASSA. Chi
       è sopra l'obiettivo ma in calo dall'inizio non sta fallendo — è a
       metà strada, che è dove sta quasi tutta la gente. */
    emQueda: 'In calo',
    acimaDaMeta: 'Sopra l’obiettivo',
  },

  /* ============================================================
     LA SCHEDA DEL PESO

     ⚠️ CAMBIA ANCHE IL TITOLO, E NON SOLO IL NUMERO. "Peso perso" sopra
     "+3,3 kg" è una contraddizione dentro la stessa scheda — e la parola
     sbagliata fa più male del numero.
     ============================================================ */
  peso: {
    perdido: 'Peso perso',
    variacao: 'Variazione del peso',
    meta: (quanto: string, unidade: string) => `Obiettivo: ${quanto} ${unidade}`,
  },

  /* ⚠️ "STABILE", E NON "−0,0". Un numero che non si è mosso non è
     variato da nessuna parte, e la parola è questa. */
  estavel: 'Stabile',

  /* ============================================================
     LA LINEA DEL TEMPO
     ============================================================ */
  tipos: {
    checkin: 'Check-in',
    aplicacao: 'Punture',
    peso: 'Peso',
    refeicao: 'Pasti',
    exercicio: 'Movimento',
    consulta: 'Visite',
    exame: 'Esami',
  },

  evento: {
    aplicacao: (dose: string, unidade: string) => `Puntura ${dose} ${unidade}`,
    peso: 'Peso',
    /* La prima pesata non ha una precedente con cui confrontarsi, quindi
       al posto della variazione va quello che è. */
    pesoInicial: 'Peso iniziale',
    checkin: 'Check-in',
    exercicio: 'Movimento',
    minDeMovimento: (minutos: number) => `${minutos} min di movimento`,
    proteinaDaRefeicao: (quanto: string) => `Proteine ${quanto}`,
    consulta: (tipo: string) => `Visita ${tipo}`,
    marcadoresDe: (quantos: number, fonte: string) => `${quantos} marcatori · ${fonte}`,
    marcadoresDetalhe: (nome: string, quantos: number, fonte: string) =>
      `${nome} · ${quantos} marcatori · ${fonte}`,
    compartilhado: 'Condiviso',

    gramasDeProteina: (gramas: number) => `${gramas} g proteine`,
    horasDeSono: (horas: number) => `${horas}h di sonno`,

    /* ⚠️ IL VERDETTO DEL GIORNO VIENE DALL'UMORE, e le tre parole sono
       corte di proposito: occupano la colonna di destra, accanto a un
       numero. "Difficile" è la più importante delle tre — nomina la
       giornata storta senza chiamarla un fallimento. */
    diaBem: 'Bene',
    diaNeutro: 'Così così',
    diaDificil: 'Difficile',

    respostaHumor: 'Umore',
    respostaEnergia: 'Energia',
    respostaFome: 'Fame',
    /* L'unico campo in cui la persona ha scritto, invece di scegliere. */
    respostaOutroSintoma: 'Altro sintomo',
  },

  /* ============================================================
     LA SETTIMANA, A CAPITOLI

     ⚠️ IL RIASSUNTO RACCONTA QUELLO CHE LA SETTIMANA HA RESO, e non
     elenca quello che è successo. Per questo ogni tipo ha il suo
     singolare e il suo plurale — "1 pesata" e "3 pesate" — e non una "s"
     appiccicata.
     ============================================================ */
  semana: {
    checkin: ['check-in', 'check-in'] as [string, string],
    peso: ['pesata', 'pesate'] as [string, string],
    refeicao: ['pasto', 'pasti'] as [string, string],
    exercicio: ['allenamento', 'allenamenti'] as [string, string],
    consulta: ['visita', 'visite'] as [string, string],
    exame: ['esame', 'esami'] as [string, string],
    contagem: (quantos: number, nome: string) => `${quantos} ${nome}`,
    /* ⚠️ UNA SETTIMANA VUOTA HA UNA FRASE SUA, e non uno spazio bianco:
       una settimana senza registri c'è stata, e il suo capitolo esiste. */
    semRegistros: 'Nessun registro in questa settimana',

    hidratacao: 'Idratazione',
    proteina: 'Proteine',
    exercicioMetrica: 'Movimento',
    pesoMetrica: 'Peso',
    litrosPorDia: (quanto: string) => `${quanto} L/giorno`,
    gramasPorDia: (quanto: number) => `${quanto} g/giorno`,
    minutos: (quanto: number) => `${quanto} min`,
    deltaLitros: (quanto: string) => `${quanto} L`,
    deltaGramas: (quanto: string) => `${quanto} g`,
    deltaMinutos: (quanto: string) => `${quanto} min`,
  },

  /* ============================================================
     CHE COSA È CAMBIATO DALL'INIZIO
     ============================================================ */
  mudancas: {
    peso: medidas.corpo.peso,
    cintura: medidas.corpo.cintura,
    gorduraCorporal: medidas.corpo.gordura,
    /* ⚠️ L'UNICA IN CUI SALIRE È LA BUONA NOTIZIA: il muscolo perso in un
       dimagrimento è quello che la terapia cerca di evitare. L'etichetta
       non lo dice — lo dice il tono — ma chi traduce deve saperlo. */
    massaMagra: medidas.corpo.massaMagra,
    naReferencia: 'Nella norma',
    foraDaReferencia: 'Fuori dai valori di riferimento',
    pressao: 'Pressione',
    /* ⚠️ "STABILE" ERA QUELLO CHE AVANZAVA DA TUTTO CIÒ CHE NON FOSSE UN
       CALO, e una pressione che saliva di quattordici punti usciva come
       stabile — in verde. Anche salire ha un nome. */
    pressaoEmQueda: 'In calo',
    pressaoEmAlta: 'In salita',
    pressaoEstavel: 'Stabile',
  },

  /* ============================================================
     L'OBIETTIVO DI PESO, NEL PERCORSO
     ============================================================ */
  metaDePeso: {
    /* "Arrivare a 68 kg", e non "Obiettivo: 68 kg": l'elenco è di cose da
       ottenere, e il verbo è quello che la fa sembrare una di loro. */
    chegarA: (peso: string) => `Arrivare a ${peso}`,
    alcancada: 'obiettivo raggiunto',
    faltam: (quanto: string) => `mancano ${quanto}`,
  },

  /* ⚠️ SOLO IL NOME DI APPLE CAMBIA CON LA LINGUA — "Apple Salute" è
     "Apple Health" in inglese, perché è Apple a tradurre il nome della
     propria app. Health Connect, Garmin, Fitbit e Withings sono marchi e
     restano nel codice: un marchio non si traduce. */
  fontes: {
    appleSaude: 'Apple Salute',
  },

  /* ============================================================
     LA SCHERMATA DEL PERCORSO

     ⚠️⚠️ E I TRE SILENZI SONO DIVERSI, che è la regola che costa di più
     mantenere in traduzione:

       · `semRegistro`  la persona non ha risposto — non lo sappiamo
       · `semQueixas`   ha risposto, e non ha avuto niente
       · `semNaSemana`  la settimana c'è stata e non ha avuto registri

     Farne collassare due in uno fa sì che l'app AFFERMI zero su un giorno
     di cui non sa niente.
     ============================================================ */
  telaJornada: {
    ultimos7: 'I TUOI ULTIMI 7 GIORNI',
    doseEm: (quando: string) => `dose ${quando}`,
    diasComCheckin: (feitos: number, aplicadas: number, vividas: number) =>
      `${feitos} di 7 giorni con check-in · ${aplicadas} di ${vividas} settimane con puntura`,
    semanaASemana: 'Settimana per settimana. Tocca per vedere che cosa ha segnato ogni ciclo.',
    /* ---------- il pannello ---------- */
    semanaEDia: (semana: number, dia: number) => `SETTIMANA ${semana} · GIORNO ${dia}`,
    /* ⚠️ I TRE PESI ARRIVANO GIÀ SCRITTI, con l'unità di chi legge. */
    noInicio: (peso: string) => `${peso} all’inizio`,
    hoje: 'oggi',
    faltam: (peso: string) => `mancano ${peso}`,

    /* ---------- i temi del giorno ---------- */
    protocolos: 'Protocolli',
    sinaisVitais: 'Parametri vitali',
    refeicoesContadas: (quantas: number) => `${quantas} pasti`,
    aguaHoje: (quanto: string) => `${quanto} oggi`,
    minutosHoje: (minutos: number) => `${minutos} min oggi`,
    indicadores: (quantos: number) => `${quantos} ${quantos === 1 ? 'indicatore' : 'indicatori'}`,
    feitasDeTotal: (feitas: number, total: number) => `${feitas} di ${total}`,

    semRegistro: 'nessun registro',
    semQueixas: 'nessun disturbo nella settimana',
    /* Il sintomo arriva con il suo nome; la maiuscola è regola di
       lingua. */
    sintomaEmDias: (sintoma: string, dias: number) =>
      `${sintoma.toLowerCase()} in ${dias} ${dias === 1 ? 'giorno' : 'giorni'}`,

    /* ---------- la scorta ---------- */
    dosesRestantes: (restam: number, semanas: number) =>
      restam === 0
        ? 'Nessuna dose rimasta'
        : `${restam === 1 ? 'Resta 1 dose' : `Restano ${restam} dosi`} · circa ${semanas} ${semanas === 1 ? 'settimana' : 'settimane'}`,

    /* ---------- le intestazioni ---------- */
    /* ⚠️ IL LINK DICE IL NOME DELLA DESTINAZIONE, e diceva "Vedi tutte" —
       che è un'istruzione, non un posto. */
    oQueJaMudou: 'Che cosa è già cambiato',
    evolucao: 'Andamento',
    suasMetas: 'I tuoi obiettivi',
    metas: 'Obiettivi',
    oDiaADia: 'Il giorno per giorno',
    seuTratamento: 'La tua terapia',
    verTudo: 'Vedi tutto',

    /* ---------- la linea del tempo ---------- */
    porSemana: 'Per settimana',
    semana: (numero: number) => `Settimana ${numero}`,
    doseAjustada: 'dose modificata',
    semRegistrosNaSemana: 'Nessun registro in questa settimana.',
    nadaNesteTipo: 'Ancora niente registrato in questo tipo',

    /* L'obiettivo personale non ha una percentuale: ha uno stato. */
    metaFeita: 'fatto',
    metaAberta: 'aperto',
  },

  /* ============================================================
     LA SCHERMATA DELLA HOME — il carosello del giorno

     ⚠️⚠️ IL CAROSELLO NON HA UN NUMERO FISSO DI SCHEDE. Ognuna ha la sua
     condizione, e chi non ha niente da dire non entra.

     ⚠️ E NESSUNA SCHEDA ACCUSA LA PERSONA. "La puntura di ieri non è
     registrata" è quello che sappiamo; "non ti sei fatta la puntura" è
     quello che non possiamo sapere, e sarebbe un'accusa sopra una
     supposizione. La seconda riga dà tutte e due le uscite senza
     sceglierne una — ed è la regola che si perde di più in traduzione,
     perché la versione che accusa è di solito la più corta.
     ============================================================ */
  telaInicio: {
    /* ---------- l'intestazione ---------- */
    bomDia: 'Buongiorno',
    boaTarde: 'Buon pomeriggio',
    boaNoite: 'Buonasera',
    linhaDoDia: (dia: string, semana: number) => `${dia} • Settimana ${semana}`,

    /* ---------- la puntura che non è stata registrata ---------- */
    semRegistro: 'NESSUN REGISTRO',
    semRegistroOntem: 'La puntura di ieri non è registrata.',
    semRegistroDias: (dias: number) => `La puntura di ${dias} giorni fa non è registrata.`,
    semRegistroCorpo: 'Se l’hai fatta, puoi registrarla adesso. Se non l’hai fatta, il ciclo riparte dalla prossima.',
    semRegistroCta: 'Registra la puntura',

    /* ---------- la visita di oggi o di domani ---------- */
    aConsulta: 'LA VISITA',
    consultaHoje: 'La tua visita è oggi.',
    consultaAmanha: 'La tua visita è domani.',
    consultaCorpo: 'Porto in ordine tutto quello che è successo dall’ultima visita — peso, aderenza, sintomi e le domande che valgono la pena.',
    consultaCta: 'Vedi il riepilogo',

    /* ---------- il contenitore che sta finendo ----------

       ⚠️ `acabou` RICEVE IL SOGGETTO GIÀ PRONTO — "La penna", "Il
       flacone" —, con l'articolo e la maiuscola, perché è il nominativo e
       `formas.oA` sa restituirlo. Vedi PENDENCIAS, voce 26. */
    acabou: (oRecipiente: string) => `${oRecipiente} è finita.`,
    restaUmaDose: (onde: string) => `Resta una dose ${onde}.`,
    receitaCorpo: 'Una ricetta nuova richiede qualche giorno fra la richiesta e la farmacia — cominciare adesso evita di fermarsi a metà.',
    pedirRenovacao: 'Chiedi il rinnovo',
    verMedicamento: 'Vedi il farmaco',

    /* ---------- il messaggio del giorno ---------- */
    entendaOPorQue: 'Scopri perché',

    /* ---------- la prossima dose ---------- */
    proximaAplicacao: 'PROSSIMA PUNTURA',
    /* ⚠️ IL FARMACO NON È IL SOGGETTO. "Mounjaro è oggi" tratta la
       scatoletta come se avesse un'agenda; a farsi la puntura è la
       persona. */
    hojeEDiaDeAplicar: 'Oggi è il giorno della tua dose.',
    proximaDose: (quando: string) => `La tua prossima dose è ${quando}.`,
    doseCorpo: (medicamento: string, dose: string, local: string) =>
      `${medicamento} ${dose} · ${local} suggerita.`,
    verAplicacao: 'Vedi la puntura',
    criarLembrete: 'Crea un promemoria',

    /* ---------- il check-in e la serie ----------

       ⚠️ IL NUMERO È DISEGNATO A PARTE, grande e in verde, e la frase
       porta solo le parole che gli stanno accanto.

       ⚠️ E IL TRATTINO DI "check‑in" È QUELLO NON SEPARABILE (U+2011). La
       casella ha 120 px fissi, e con il trattino normale la parola si
       spezzava a metà a fine riga. */
    checkinFeito: 'Check-in fatto',
    fazerCheckin: 'Fai il check-in',
    diasSeguidos: (dias: number): string => (dias === 1 ? 'giorno di check‑in' : 'giorni di fila di check‑in'),

    /* ---------- le sezioni ----------

       ⚠️ IL LINK DI SEZIONE È IL NOME DELLA SCHERMATA DALL'ALTRA PARTE, e
       non il gesto: "Obiettivi", e non "Vai agli obiettivi". */
    metasDiarias: 'I tuoi obiettivi del giorno',
    metasLink: 'Obiettivi',
    registrar: 'Registra',
    evolucao: 'Il tuo andamento',
    evolucaoLink: 'Andamento',
    gPorDia: 'g/giorno',
    semMedida: 'nessuna misura',

    /* ---------- chi si prende cura di te ---------- */
    quemCuida: 'Chi si prende cura di te',
    areaMedica: 'Area medica',
    mensagens: 'Messaggi',
    novasMensagens: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'messaggio nuovo' : 'messaggi nuovi'}`,
    nenhumaMensagem: 'Nessun messaggio nuovo',
    proximaConsulta: 'Prossima visita',
    consultaEm: (data: string, diaDaSemana: string) => `${data} • ${diaDaSemana}`,
    solicitarReceita: 'Chiedi una ricetta nuova',
    solicitarReceitaSub: 'Un messaggio al tuo team',
    acompanhaSeuTratamento: 'Segue la tua terapia',
    resumoParaConsulta: 'Riepilogo per la visita',
    resumoParaConsultaSub: 'Peso, aderenza, sintomi ed esami in un documento solo',
    anotarConsulta: 'Annota una visita',
    anotarConsultaSub: 'Così ti avvisiamo quando si avvicina',
    quemAcompanha: 'Chi ti segue?',
    quemAcompanhaSub: 'Annota il nome e il riepilogo sarà già a suo nome per la prossima visita.',
    preencherFicha: 'Compila la scheda',
  },

  /* ============================================================
     LA SCHERMATA DI UNA SETTIMANA — il capitolo aperto

     ⚠️ IL BOLLINO È IL SINGOLARE IN MINUSCOLO, e `home.tipos` è il
     plurale con l'iniziale maiuscola. Sono forme diverse della stessa
     parola per lavori diversi: `tipos` etichetta un FILTRO, il bollino
     qualifica UN giorno.

     ⚠️ E LE VIRGOLETTE DELLA NOTA SONO DI OGNI LINGUA. L'italiano usa le
     caporali «», il portoghese “ ”, il tedesco „ “.
     ============================================================ */
  telaSemana: {
    titulo: 'Settimana',
    semanaN: (numero: number) => `Settimana ${numero}`,
    vazio: 'Non ci sono ancora settimane registrate.',
    lead: (periodo: string, dose: string) => `${periodo} · ${dose}`,

    /* ---------- quello che ho fatto ---------- */
    aplicacao: 'Puntura',
    semPesagem: 'nessuna pesata',

    /* ---------- come mi sono sentita ---------- */
    comoSeSentiu: 'Come ti sei sentita',
    diasRespondidos: (quantos: number) => `${quantos} di 7 giorni con risposta`,
    sintomaDias: (legenda: string, dias: number) =>
      `${legenda} · ${dias} ${dias === 1 ? 'giorno' : 'giorni'}`,
    energia: 'Energia',
    energiaDe5: (media: string) => `${media} su 5`,

    /* ---------- quello che è successo ---------- */
    diaADia: 'Giorno per giorno',
    /* ⚠️ Senza virgola: l'italiano scrive "lunedì 3 ottobre". */
    diaComData: (diaDaSemana: string, data: string) => `${diaDaSemana} ${data}`,
    selo: {
      aplicacao: 'puntura',
      checkin: 'check-in',
      peso: 'pesata',
      refeicao: 'pasto',
      exercicio: 'allenamento',
      consulta: 'visita',
      exame: 'esame',
    },

    /* ---------- quello che ho voluto dire ---------- */
    nota: 'Nota per la visita',
    verTodas: 'Vedi tutte',
    nenhumaNota: 'Nessuna nota in questa settimana',
    anotadaEm: (data: string) => `Annotata il ${data}`,
    toqueParaEscrever: 'Tocca per scriverne una',
  },

  /* ============================================================
     IL FOGLIO PER REGISTRARE — quello che apre il pulsante di mezzo

     ⚠️ I TRE COLLEGAMENTI SI CONFRONTANO CON L'OBIETTIVO DEL PROFILO, e
     non con il totale dall'installazione. "12 registrate" non risponde a
     niente che qualcuno si chieda prima di mangiare; "63 di 90 g"
     risponde.

     ⚠️ E L'A CAPO DEI PRIMI DUE VIVE NEL TESTO. "Mi sono / idratata" sta
     in due righe in italiano e in una in tedesco — il \n scritto nel JSX
     legava l'a capo al portoghese.
   ============================================================ */
  telaRegistrar: {
    titulo: 'Che cosa vuoi registrare?',

    checkinChapeu: 'CHECK-IN DEL GIORNO',
    checkinFeito: 'Fatto oggi',
    checkinPendente: 'Com’è andata oggi?',
    checkinEditar: 'Modifica',
    diasSeguidos: (dias: number): string => (dias === 1 ? 'giorno di fila' : 'giorni di fila'),

    agua: 'Mi sono\nidratata',
    /* ⚠️ L’OBIETTIVO ARRIVA CON L’UNITÀ DENTRO, e per questo qui non c’è
       nessuna "L": in imperiale i due numeri sono once. Vedi
       ../pt-BR/home.ts. */
    aguaSub: (bebido: string, alvo: string) => `${bebido} di ${alvo}`,
    exercicio: 'Mi sono\nmossa',
    exercicioSub: (feito: number, alvo: number) => `${feito} di ${alvo} min`,
    refeicao: 'Ho fatto un pasto',
    refeicaoSub: (proteina: number, alvo: number) => `${proteina} di ${alvo} g`,

    levaUmMinuto: 'CI VUOLE UN MINUTO',
    aplicacao: 'Ho fatto la dose',
    peso: 'Mi sono appena pesata',
    medidas: 'Ho misurato il corpo',
    exame: 'Ho ricevuto un esame',
    anotacao: 'Ho annotato qualcosa per la visita',
  },

  /* ============================================================
     COME LEGGIAMO IL TUO RITMO — il conto dietro l'etichetta

     ⚠️ L'AVVISO IN FONDO CITA L'ETICHETTA FRA VIRGOLETTE, e le
     virgolette cambiano con la lingua: «» in italiano e in francese, “ ”
     in portoghese, „ “ in tedesco. Per questo la frase intera vive qui, e
     non montata nel JSX con le virgolette digitate fuori.

     ⚠️ E L'ETICHETTA ARRIVA GIÀ IN MINUSCOLO, per mano di `comum.noMeio`
     — che in tedesco restituisce il testo com'è arrivato, perché lì la
     parola in mezzo alla frase non perde la maiuscola.
     ============================================================ */
  telaRitmo: {
    titulo: 'Come leggiamo il tuo ritmo',
    sub: 'L’etichetta parla della costanza della terapia, non della velocità con cui il peso scende.',

    aplicacoes: 'Punture in ordine',
    aplicacoesSub: (aplicadas: number, vividas: number) =>
      `${aplicadas} di ${vividas} ${vividas === 1 ? 'settimana' : 'settimane'}`,

    intervalo: 'Intervallo fra le dosi',
    intervaloEmDia: (dias: number) => `${dias} ${dias === 1 ? 'giorno' : 'giorni'}, senza ritardi lunghi`,
    intervaloMaior: (dias: number) => `intervallo più lungo: ${dias} ${dias === 1 ? 'giorno' : 'giorni'}`,

    sintomas: 'Sintomi riferiti',
    sintomasLeves: 'Lievi',
    sintomasModerados: 'Da lievi a moderati',
    sintomasFortes: 'Da moderati a forti',

    /* I bollini sono minuscoli di proposito: sono etichette d'angolo, e
       non frasi. Nessuno di loro è rosso — la schermata spiega un conto,
       non rimprovera. */
    seloOk: 'ok',
    seloAtencao: 'attenzione',
    seloIrregular: 'irregolare',
    seloEstavel: 'stabile',
    seloEmAlta: 'in salita',

    avisoTitulo: 'Una settimana diversa non cambia l’etichetta',
    avisoTexto: (etiqueta: string) =>
      `Non sale e non scende in base a quanto hai perso, e non ne esiste una versione che dica che la settimana è andata male. Oggi dice «${etiqueta}».`,

    entendi: 'Ho capito',
  },

  /* ============================================================
     PROTOCOLLI — l'accordo della settimana
     ============================================================ */
  telaProtocolos: {
    semanaN: (n: number) => `Settimana ${n}`,
    tudoCumprido: 'tutto fatto',
    cumpridasDeTotal: (feitas: number, total: number) => `${feitas} di ${total} fatte`,
    aplicacaoEm: (quando: string) => `puntura ${quando}`,

    /* Compare solo con il legame: parlare con il team ha bisogno di un
       team dall'altra parte, e non del fatto di avere un medico. */
    falarComEquipe: 'Scrivi al team',

    estaSemana: 'Questa settimana',
    ressalva: 'Questi obiettivi sono modi di tirare fuori di più dalla terapia, e non un elenco di pretese — non chiuderli tutti va benissimo. Quello che fa avanzare la terapia sono la dose e il monitoraggio. Quello che resta aperto ricomincia la settimana prossima, e i conteggi si riempiono da soli con i tuoi registri.',

    ressalvaDaSemana: 'Gli obiettivi sono quelli di oggi, misurati sui registri di questa settimana.',

    semanasAnteriores: 'Settimane precedenti',
    semanasAnterioresNota: 'Gli obiettivi di oggi, misurati sui registri di ogni settimana.',
  },

  /* ============================================================
     UN GIORNO — il foglio di un quadratino della fila di sette
     ============================================================ */
  telaDia: {
    registrosDeste: 'Registri di questo giorno',
    diaDeAplicacao: 'Giorno di puntura',
    nadaRegistrado: 'ancora niente registrato',

    aplicacao: 'Puntura',
    doseLinha: (med: string, dose: string, unidade: string, estado?: string) =>
      `${med} ${dose} ${unidade}${estado ? ` · ${estado}` : ''}`,
    prevista: 'prevista per oggi',
    semRegistroMinusculo: 'nessun registro',

    /* Il metro e il numero nella stessa frase, con il suo massimo:
       l'energia arriva a dieci e l'umore a cinque, e a saperlo è chi
       chiama. */
    escalaDe: (nome: string, valor: number, max: number) => `${nome} ${valor} su ${max}`,
    respondidoNesteDia: 'Risposto in questo giorno',
    semRegistro: 'Nessun registro',

    /* ⚠️ DUE BOLLINI PER LA STESSA PAROLA, e la differenza è il genere di
       quello che è stato fatto: la puntura è fatta, il check-in e il peso
       sono fatti. In tedesco tutti e due sono "erledigt", ed è per questo
       che la scelta è del catalogo e non della schermata. */
    seloFeita: 'fatta',
    seloFeito: 'fatto',
    seloRegistrar: 'registra',

    semPrazo: 'I giorni senza registro restano vuoti. Puoi riempirli dopo, senza scadenza.',
  },
};
