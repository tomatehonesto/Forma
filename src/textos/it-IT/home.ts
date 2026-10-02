import { medidas } from './medidas';
import { tempo } from './tempo';

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
    proteina: 'Assunzione di proteine',
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

  /* ⚠️ LE FRAZIONI SI DICONO CON « SU »: « 7 su 7 giorni », « 2 su 4 ».
     « 7 di 7 » era il « 7 de 7 » portoghese, e c'era in trenta posti del
     catalogo. L'ordine resta quello di prima, che l'italiano ammette — « 3
     su 10 italiani » —, e così il nome continua ad accordarsi col totale. */

  /* ============================================================
     LA LINEA DEL TEMPO
     ============================================================ */
  /* ⚠️ "DOSE" É O SUBSTANTIVO DE TODAS AS FORMAS (01/10/2026). Ver ../pt-BR. */
  tipos: {
    checkin: 'Check-in',
    aplicacao: 'Dosi',
    peso: 'Pesate',
    refeicao: 'Pasti',
    exercicio: 'Allenamenti',
    consulta: 'Visite',
    exame: 'Esami',
  },

  evento: {
    aplicacao: (dose: string, unidade: string) => `Dose ${dose} ${unidade}`,
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
    semRegistros: 'Nessuna registrazione in questa settimana',
    /* dose quotidiana, una settimana con sole dosi (vedi ../pt-BR) */
    semOutrosRegistros: 'Nessun’altra registrazione in questa settimana',

    hidratacao: 'Idratazione',
    proteina: 'Proteine',
    exercicioMetrica: 'Movimento',
    pesoMetrica: 'Peso',
    /* o volume já vem escrito na unidade da pessoa (aguaTxt): "1,6 L", "54 fl oz" */
    aguaPorDia: (quanto: string) => `${quanto}/giorno`,
    gramasPorDia: (quanto: number) => `${quanto} g/giorno`,
    minutos: (quanto: number) => `${quanto} min`,
    deltaGramas: (quanto: string) => `${quanto} g`,
    deltaMinutos: (quanto: string) => `${quanto} min`,

    /* ⚠️ Il conteggio della settimana con dose quotidiana (01/10/2026) —
       vedi ../pt-BR/home.ts. I giorni contano fino a oggi, e oggi solo dopo
       la sua dose; lo zero ha una frase sua, perché «0 su 4 dosi» suona
       come un rimprovero. */
    dosesDaSemana: (feitas: number, dias: number) =>
      (feitas === 0 ? 'Nessuna dose registrata' : `${feitas} su ${dias} ${dias === 1 ? 'dose' : 'dosi'}`),
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
  telaHistorico: {
    exportar: 'Esporta',
    lead: (data: string) => `Tutto quello che hai registrato dal ${data}.`,
    semPesagem: 'senza pesata',
    semanasVazias: (quantas: number) =>
      quantas === 1 ? 'Una settimana è rimasta quasi vuota' : `${quantas} settimane sono rimaste quasi vuote`,
    semanasVaziasTexto: 'Le settimane senza registrazioni restano nella lista, grandi come le altre. Non spariscono e non contano come un fallimento.',
    registrosDesde: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'registrazione' : 'registrazioni'} dall’inizio della terapia`,
    registrosAteAqui: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'registrazione' : 'registrazioni'} finora`,
  },

  telaJornada: {
    ultimos7: 'I TUOI ULTIMI 7 GIORNI',
    doseEm: (quando: string) => `dose ${quando}`,
    diasComCheckin: (feitos: number, dias: number, aplicadas: number, vividas: number) =>
      `${feitos} su ${dias} ${dias === 1 ? 'giorno' : 'giorni'} con check-in · ${aplicadas} su ${vividas} ${vividas === 1 ? 'settimana' : 'settimane'} con dose`,
    diasComCheckinSo: (feitos: number, dias: number) =>
      `${feitos} su ${dias} ${dias === 1 ? 'giorno' : 'giorni'} con check-in`,
    /* ⚠️ La riga del pannello con dose quotidiana (01/10/2026) — vedi ../pt-BR/home.ts. */
    diasComCheckinEDose: (feitos: number, dias: number, comDose: number, diasDaSemana: number) =>
      `${feitos} su ${dias} ${dias === 1 ? 'giorno' : 'giorni'} con check-in · ${comDose} su ${diasDaSemana} ${diasDaSemana === 1 ? 'giorno' : 'giorni'} con dose`,
    primeiraDose: 'Prima dose',
    primeiraDoseTexto: 'Il ciclo inizia a contare dalla prima dose che registri.',
    semanaASemana: 'Settimana per settimana. Tocca per vedere che cosa ha segnato ogni ciclo.',
    verAsSemanas: (quantas: number) => `Vedi tutte le ${quantas} settimane`,
    /* ---------- il pannello ---------- */
    semanaEDia: (semana: number, dia: number) => `SETTIMANA ${semana} · GIORNO ${dia}`,
    /* ⚠️ I TRE PESI ARRIVANO GIÀ SCRITTI, con l'unità di chi legge. */
    noInicio: (peso: string) => `${peso} all’inizio`,
    primeiraPesagem: 'prima pesata',
    hoje: 'oggi',
    faltam: (peso: string) => `mancano ${peso}`,

    /* ---------- i temi del giorno ---------- */
    protocolos: 'Protocolli',
    sinaisVitais: 'Parametri vitali',
    refeicoesContadas: (quantas: number) => `${quantas} pasti`,
    aguaHoje: (quanto: string) => `${quanto} oggi`,
    minutosHoje: (minutos: number) => `${minutos} min oggi`,
    indicadores: (quantos: number) => `${quantos} ${quantos === 1 ? 'indicatore' : 'indicatori'}`,
    feitasDeTotal: (feitas: number, total: number) => `${feitas} su ${total}`,

    semRegistro: 'nessuna registrazione',
    semQueixas: 'nessun disturbo nella settimana',
    /* Il sintomo arriva con il suo nome; la maiuscola è regola di
       lingua. */
    sintomaEmDias: (sintoma: string, dias: number) =>
      `${sintoma.toLowerCase()} in ${dias} ${dias === 1 ? 'giorno' : 'giorni'}`,

    /* ---------- la scorta ---------- */
    /* In giorni o in settimane (02/10/2026) — ragioni in ../pt-BR/home.ts. */
    dosesRestantes: (restam: number, c: { n: number; unidade: 'dia' | 'semana' }) =>
      restam === 0 || c.n === 0
        ? 'Nessuna dose rimasta'
        : `${restam === 1 ? 'Resta 1 dose' : `Restano ${restam} dosi`} · circa ${tempo.duracao(c)}`,

    /* ---------- le intestazioni ---------- */
    /* ⚠️ IL LINK DICE IL NOME DELLA DESTINAZIONE, e diceva "Vedi tutte" —
       che è un'istruzione, non un posto. */
    oQueJaMudou: 'Che cosa è già cambiato',
    oQueJaMudouVazio: 'Dalla seconda pesata in poi, qui compare che cosa è cambiato.',
    evolucao: 'Andamento',
    suasMetas: 'I tuoi obiettivi',
    metas: 'Obiettivi',
    oDiaADia: 'Giorno per giorno',
    seuTratamento: 'La tua terapia',
    /* o vazio de "Seu tratamento" e de "Suas metas" (Jornada, Histórico) */
    semanasVaziasTitulo: 'Le settimane iniziano con la prima dose',
    semanasVaziasTexto: 'Il trattamento si conta da una dose all’altra. Registra la prima, e ogni settimana compare qui con quello che è successo.',
    metasVaziasTitulo: 'Crea un obiettivo',
    metasVaziasTexto: 'Acqua, sonno, allenamento o ciò che ha senso per te.',
    verTudo: 'Vedi tutto',

    /* ---------- la linea del tempo ---------- */
    porSemana: 'Per settimana',
    semana: (numero: number) => `Settimana ${numero}`,
    doseAjustada: 'dose modificata',
    semRegistrosNaSemana: 'Nessuna registrazione in questa settimana.',
    verDetalhes: 'Vedi dettagli',
    nadaNesteTipo: 'Ancora niente registrato in questo tipo',

    /* L'obiettivo personale non ha una percentuale: ha uno stato. Era
       "fatto" e "aperto", e un obiettivo "aperto" è il calco di "aberta":
       in italiano è in corso, e quando arriva è raggiunto. */
    metaFeita: 'raggiunto',
    metaAberta: 'in corso',
  },

  /* ============================================================
     LA SCHERMATA DELLA HOME — il carosello del giorno

     ⚠️⚠️ IL CAROSELLO NON HA UN NUMERO FISSO DI SCHEDE. Ognuna ha la sua
     condizione, e chi non ha niente da dire non entra.

     ⚠️ E NESSUNA SCHEDA ACCUSA LA PERSONA. "La dose di ieri non è
     registrata" è quello che sappiamo; "non hai preso la dose" è
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

    /* ---------- la dose che non è stata registrata ---------- */
    semRegistro: 'NESSUN REGISTRO',
    semRegistroOntem: 'La dose di ieri non è registrata.',
    semRegistroDias: (dias: number) => `La dose di ${dias} giorni fa non è registrata.`,
    /* a primeira pessoa segue a forma (ver ../pt-BR) */
    semRegistroCorpo: (injetavel: boolean): string => (injetavel
      ? 'Se l’hai fatta, puoi registrarla adesso. Se non l’hai fatta, il ciclo riparte dalla prossima.'
      : 'Se l’hai presa, puoi registrarla adesso. Se non l’hai presa, il ciclo riparte dalla prossima.'),

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
    /* la dose quotidiana riceve la scheda a tre giorni (02/10/2026) */
    restamDoses: (quantas: number, onde: string) => `Restano ${quantas} dosi ${onde}.`,
    receitaCorpo: 'Una ricetta nuova richiede qualche giorno fra la richiesta e la farmacia — cominciare adesso evita di fermarsi a metà.',
    pedirRenovacao: 'Chiedi il rinnovo',
    verMedicamento: 'Vedi il farmaco',

    /* ---------- il messaggio del giorno ---------- */
    entendaOPorQue: 'Scopri perché',
    /* o destaque de boas-vindas, na primeira semana (logic/apresentacao) */
    boasVindasChapeu: 'CIAO',
    boasVindasTitulo: (nome: string): string => (nome ? `Che bello averti qui, ${nome}` : 'Che bello averti qui'),
    boasVindasCorpo: 'Tu registri la terapia, e noi mettiamo in ordine il resto: dosi, sintomi, alimentazione e progressi.',
    boasVindasCta: 'Scopri come possiamo aiutarti',
    /* a semana que acabou de fechar, nos dois dias depois da dose nova */
    resumoChapeu: 'LA SETTIMANA PASSATA',
    resumoTitulo: (n: number): string => `La tua settimana ${n}`,
    resumoPeso: (d: string): string => `Peso ${d}`,
    resumoCta: 'Vedi la settimana',
    /* o nível de conquista alcançado nos últimos dias */
    marcoChapeu: 'TRAGUARDO RAGGIUNTO',
    marcoCorpo: (trilha: string, n: number, de: number): string => `${trilha} · livello ${n} di ${de}`,
    marcoCta: 'Vedi i traguardi',

    /* ---------- la prossima dose ---------- */
    proximaAplicacao: 'PROSSIMA DOSE',
    /* ⚠️ IL FARMACO NON È IL SOGGETTO. "Mounjaro è oggi" tratta la
       scatoletta come se avesse un'agenda; la dose è della persona. */
    hojeEDiaDeAplicar: 'Oggi è il giorno della tua dose.',
    proximaDose: (quando: string) => `La tua prossima dose è ${quando}.`,
    /* sem local (comprimido), a frase para no medicamento — ver ../pt-BR */
    doseCorpo: (medicamento: string, dose: string, local?: string): string =>
      (local ? `${medicamento} ${dose} · zona suggerita: ${local}.` : `${medicamento} ${dose}.`),
    verAplicacao: 'Vedi le tue dosi',
    criarLembrete: 'Crea un promemoria',

    /* ---------- il check-in e la serie ----------

       ⚠️ IL NUMERO È DISEGNATO A PARTE, grande e in verde, e la frase
       porta solo le parole che gli stanno accanto.

       ⚠️ E IL TRATTINO DI "check‑in" È QUELLO NON SEPARABILE (U+2011). La
       casella ha 120 px fissi, e con il trattino normale la parola si
       spezzava a metà a fine riga. */
    checkinFeito: 'Check-in fatto',
    fazerCheckin: 'Fai il check-in',
    checkinUmMinuto: 'Richiede meno di un minuto',
    diasSeguidos: (dias: number): string => (dias === 1 ? 'giorno di check‑in' : 'giorni di check‑in di fila'),

    /* ---------- le sezioni ----------

       ⚠️ IL LINK DI SEZIONE È IL NOME DELLA SCHERMATA DALL'ALTRA PARTE, e
       non il gesto: "Obiettivi", e non "Vai agli obiettivi". */
    metasDiarias: 'I tuoi obiettivi del giorno',
    metasLink: 'Obiettivi',
    registrar: 'Registra',
    evolucao: 'Il tuo andamento',
    evolucaoLink: 'Andamento',
    gPorDia: 'g/giorno',
    forca: 'Allenamento di forza',
    dias: (n: number): string => (n === 1 ? 'giorno' : 'giorni'),
    nosUltimos7: 'Negli ultimi 7 giorni',

    /* ---------- chi si prende cura di te ---------- */
    quemCuida: 'Chi si prende cura di te',
    areaMedica: 'Area medica',
    mensagens: 'Messaggi',
    novasMensagens: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'messaggio nuovo' : 'messaggi nuovi'}`,
    nenhumaMensagem: 'Nessun messaggio nuovo',
    proximaConsulta: 'Prossima visita',
    consultaEm: (data: string, diaDaSemana: string) => `${data} • ${diaDaSemana}`,
    semConsulta: 'Nessuna visita in programma',
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
    semanaN: (numero: number) => `Settimana ${numero}`,

    /* ---------- come mi sono sentita ---------- */
    comoSeSentiu: 'Come ti sei sentita',
    /* "de N": os dias do período que já passaram — o ciclo nem sempre tem 7 */
    diasRespondidos: (quantos: number, de: number) => `${quantos} di ${de} ${de === 1 ? 'giorno' : 'giorni'} con risposta`,
    sintomaDias: (legenda: string, dias: number) =>
      `${legenda} · ${dias} ${dias === 1 ? 'giorno' : 'giorni'}`,
    energia: 'Energia',
    energiaDe5: (media: string) => `${media} su 5`,

    /* ---------- quello che è successo ---------- */
    diaADia: 'Giorno per giorno',
    /* ⚠️ Senza virgola: l'italiano scrive "lunedì 3 ottobre". */
    diaComData: (diaDaSemana: string, data: string) => `${diaDaSemana} ${data}`,
    selo: {
      aplicacao: 'dose',
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
    aguaSub: (bebido: string, alvo: string) => `${bebido} su ${alvo}`,
    exercicio: 'Mi sono\nmossa',
    exercicioSub: (feito: number, alvo: number) => `${feito} su ${alvo} min`,
    refeicao: 'Ho fatto un pasto',
    refeicaoSub: (proteina: number, alvo: number) => `${proteina} su ${alvo} g`,

    levaUmMinuto: 'CI VUOLE UN MINUTO',
    /* a primeira pessoa segue a forma (ver ../pt-BR) */
    aplicacao: (injetavel: boolean): string => (injetavel ? 'Ho fatto la dose' : 'Ho preso la dose'),
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
    titulo: 'Il tuo ritmo di perdita',
    sub: 'Quanto scende il tuo peso a settimana, in media, accanto al ritmo che hai scelto all’iscrizione.',
    desdeOInicio: 'Dall’inizio',
    media: (semanas: number) => `media di ${semanas} ${semanas === 1 ? 'settimana' : 'settimane'}`,
    recente: 'Ultime quattro settimane',
    recenteSub: 'il tratto più recente della curva',
    escolhido: 'Il ritmo che hai scelto',
    semEscolha: 'Nessun ritmo scelto',
    semEscolhaSub: 'Tocca per sceglierne uno',
    porSemana: (peso: string) => `${peso} a settimana`,
    devagarTitulo: 'Più piano è comunque strada',
    devagarTexto: 'Il corpo non segue il calendario che scegliamo per lui, e settimane più lente capitano in quasi ogni terapia — non vuol dire che qualcosa sia andato storto. Quello che sostiene il risultato è andare avanti: le dosi, le proteine, l’acqua, il sonno. Se il ritmo scelto ti pesa, puoi cambiarlo con uno più adatto a questo momento.',
    acimaTitulo: 'Un numero non è tutta la storia',
    acimaTexto: 'La bilancia oscilla con l’acqua, l’intestino, il sale e gli ormoni, in ogni fase della terapia — un peso sopra l’inizio non cancella quello che la terapia sta facendo. Conviene guardare la linea nel corso delle settimane, e non il giorno. Se continua a salire per qualche settimana, è una buona conversazione da fare con chi ti segue, senza nessun senso di colpa.',
    avisoTitulo: 'La discesa non è dritta',
    avisoTexto: 'Le prime settimane di solito rendono di più, e il ritmo rallenta mentre il corpo si adatta. Il ritmo scelto è la media del percorso, non un obbligo di ogni settimana.',
    aceleradoTitulo: 'Un ritmo di cui parlare',
    aceleradoTexto: (limite: string) => `Oltre ${limite} a settimana, conviene parlarne con chi ti segue, per idratazione e massa magra. Non è un tuo errore: è il corpo che risponde in fretta.`,
    entendi: 'Ho capito',
  },

  /* ============================================================
     PROTOCOLLI — l'accordo della settimana
     ============================================================ */
  telaProtocolos: {
    semanaN: (n: number) => `Settimana ${n}`,
    tudoCumprido: 'tutto fatto',
    cumpridasDeTotal: (feitas: number, total: number) => `${feitas} su ${total} fatte`,
    aplicacaoEm: (quando: string) => `dose ${quando}`,

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
    diaDeAplicacao: 'Giorno della dose',
    nadaRegistrado: 'ancora niente registrato',

    aplicacao: 'Dose',
    doseLinha: (med: string, dose: string, unidade: string, estado?: string) =>
      `${med} ${dose} ${unidade}${estado ? ` · ${estado}` : ''}`,
    prevista: 'prevista per oggi',
    semRegistroMinusculo: 'nessuna registrazione',

    /* Il metro e il numero nella stessa frase, con il suo massimo:
       l'energia arriva a dieci e l'umore a cinque, e a saperlo è chi
       chiama. */
    escalaDe: (nome: string, valor: number, max: number) => `${nome} ${valor} su ${max}`,
    respondidoNesteDia: 'Risposto in questo giorno',
    semRegistro: 'Nessuna registrazione',

    /* ⚠️ DUE BOLLINI PER LA STESSA PAROLA, e la differenza è il genere di
       quello che è stato fatto: la dose è fatta, il check-in e il peso
       sono fatti. In tedesco tutti e due sono "erledigt", ed è per questo
       che la scelta è del catalogo e non della schermata. */
    seloFeita: 'fatta',
    seloFeito: 'fatto',
    seloRegistrar: 'registra',

    semPrazo: 'I giorni senza registro restano vuoti. Puoi riempirli dopo, senza scadenza.',
  },
  /* ---- a apresentação: como podemos ajudar (app/apresentacao) ---- */
  apresentacao: {
    pular: 'Salta',
    continuar: 'Continua',
    comecar: 'Inizia',
    /** o leitor de tela diz em que página está */
    pagina: (i: number, n: number): string => `${i} di ${n}`,
    /* quem toma comprimido não tem local de aplicação: a frase da dose muda */
    dose: { titulo: 'La tua dose, sempre in regola', texto: 'Ti ricordiamo la dose al momento giusto, suggeriamo dove fare la prossima iniezione e ti avvisiamo prima che il farmaco finisca.', textoOral: 'Ti ricordiamo la dose al momento giusto e ti avvisiamo prima che il farmaco finisca.' },
    estado: { titulo: 'Scopri cosa cambia in te', texto: 'Un check-in veloce al giorno e, col tempo, vedrai cosa influisce su appetito, sonno e umore.' },
    comida: { titulo: 'Mangiare bene, senza complicazioni', texto: 'Guarda quante proteine e quanta acqua hai già preso oggi. Fotografa il piatto e lo leggiamo noi per te.' },
    evolucao: { titulo: 'Guarda quanta strada hai fatto', texto: 'Il peso, le misure e gli obiettivi oltre la bilancia, tutti in un unico posto.' },
    consultas: { titulo: 'Un riepilogo per la tua visita', texto: 'Arriva con tutto quello che è cambiato dall’ultima, ordinato in un unico documento.' },
    /* ⚠️ "MORPHI INTELLIGENCE" É NOME, e não se traduz (pedido do dono). */
    companheiro: { titulo: 'Morphi Intelligence', texto: 'Hai un dubbio sulla terapia? Chiedi quando vuoi, a qualsiasi ora.' },
  },

  primeirosPassos: {
    titulo: 'Primi passi',
    feito: 'Fatto',
    plano: 'Il tuo piano è pronto',
    medicacao: 'Scegli il tuo farmaco',
    medicacaoSub: 'Da qui dipendono la dose, il ciclo e i promemoria',
    aplicacao: (_injetavel: boolean): string => 'Registra la tua prima dose',
    aplicacaoSub: 'Da lì contiamo il ciclo e la prossima dose',
    checkin: 'Fai il primo check-in',
    checkinSub: 'Come stai oggi, in meno di un minuto',
    meta: 'Scegli un obiettivo oltre il peso',
    metaSub: 'Cos’altro vuoi che cambi, oltre alla bilancia',
    lembretes: 'Consenti i promemoria',
    lembretesSub: 'Perché il promemoria della dose suoni in tempo',
    saude: (app: string) => `Collega ${app}`,
    saudeSub: 'Il peso della bilancia entra da solo',
    aparencia: 'Scegli il colore dell’app',
    aparenciaSub: (paletas: number) => `${paletas} palette, in modalità chiara o scura`,
    opcional: (porque: string) => `Facoltativo · ${porque}`,
    tudoPronto: 'Tutto pronto!',
    tudoProntoTexto: 'Il tuo diario è pronto. Da qui in poi basta registrare: al resto pensiamo insieme a te.',
    essencialPronto: 'L’essenziale è pronto!',
    essencialProntoTexto: 'Quello che resta è facoltativo, e lo trovi nel tuo Profilo quando vuoi.',
    fechar: 'Chiudi',
    reabrir: 'Primi passi',
    reabrirSub: (feitos: number, total: number) => `${feitos} di ${total} fatti · mostra nella Home`,
  },
  telaCheckinOk: {
    concluido: 'Check-in completato',
    diasSeguidos: (n: number): string => (n === 1 ? 'GIORNO DI FILA CON IL CHECK-IN' : 'GIORNI DI FILA CON IL CHECK-IN'),
    energia: 'Energia',
    sono: 'Sonno',
    humor: 'Umore',
    comoFoiODia: 'COM’È ANDATA LA GIORNATA',
    sintomas: 'SINTOMI',
    nenhumHoje: 'Nessuno oggi',
    naoEsqueca: 'NON DIMENTICARE',
    oQueFazer: 'COSA FARE',
    voltarHome: 'Torna alla Home',
  },
};
