/* ============================================================
   LE SCOPERTE — la scheda della Home che non è il ciclo · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/descobertas.ts. Tre tipi si dividono
   lo stesso posto, e il cappello dice quale sia quale: la SCOPERTA (un
   incrocio dei suoi registri, scritto in cruzamentos), l'ANTICIPO (che
   cosa arriva domani, e perché) e l'INVITO (che cosa l'app ancora non sa
   di lei).

   ⚠️ L'ANTICIPO DICE SEMPRE CHE PASSA. "La fame tende a farsi sentire
   oggi" è un avviso, e un avviso senza scadenza diventa una minaccia:
   tutti e tre finiscono dicendo che cosa succede dopo.

   ⚠️ E L'INVITO NON RIMPROVERA. "Non hai ancora detto dove vuoi
   arrivare" è l'assenza detta come possibilità; "non hai creato nessun
   obiettivo" sarebbe la stessa frase con il metro girato verso la
   persona.
   ============================================================ */

export const descobertas = {
  /* Il pulsante della scoperta. Il testo vive in cruzamentos. */
  verDescoberta: 'Vedi la scoperta',

  /* ---------- quello che arriva ---------- */
  chapeuCruzamento: 'SCOPERTA',
  chapeuAntecipacao: 'QUELLO CHE ARRIVA',

  fomeHoje: 'La fame tende a farsi sentire oggi',
  fomeAmanha: 'La fame tende a farsi sentire domani',
  fomeEmDias: (dias: number) => `La fame tende a farsi sentire tra ${dias} giorni`,
  /* La molecola in minuscolo perché è sostanza, e non marca. */
  fomeTexto: (molecula: string) =>
    `È il momento in cui il livello di ${molecula} tocca il punto più basso del ciclo, poco prima della prossima puntura. Passa da sé appena la fai.`,
  fomeCta: 'Vedi il ciclo',

  aguaTitulo: 'Domani di solito è il tuo giorno più secco',
  /* Il `dia` arriva con la preposizione — "il mercoledì" — e viene da
     cruzamentos. */
  aguaTexto: (dele: string, dia: string, outros: string) =>
    `Nei tuoi registri l’idratazione scende a ${dele} ${dia}, contro ${outros} negli altri giorni. Saperlo la sera prima è già metà del lavoro.`,
  aguaCta: 'Vedi l’idratazione',

  enjooTitulo: 'Se la nausea arriva adesso, ha un’ora in cui passa',
  enjooTexto: (perto: string, longe: string) =>
    `Nei tuoi registri resta a ${perto} nei primi due giorni dopo la puntura e scende a ${longe} dal terzo in poi. Sono le prime 48 ore di ogni ciclo, non tutta la terapia.`,
  enjooCta: 'Vedi i sintomi',

  /* ---------- gli inviti ---------- */
  chapeuConvite: 'UN INVITO',

  metaTitulo: 'Non hai ancora detto dove vuoi arrivare',
  metaTexto: 'Un obiettivo tuo — entrare in un paio di pantaloni, tornare al mare, lasciare un’abitudine. Lo teniamo qui per te, e sei tu a segnare quando è arrivato.',
  metaCta: 'Crea un obiettivo',

  medidasTitulo: 'La bilancia racconta solo una parte',
  medidasTexto: 'Il metro da sarta racconta il resto: vita e fianchi continuano a cambiare quando il peso si ferma, ed è lì che mostra che qualcosa si muove ancora.',
  medidasCta: 'Registra le misure',

  refeicaoTitulo: 'Le proteine del giorno possono contarsi da sole',
  refeicaoTexto: 'Registra quello che mangi e il conto della giornata si fa da sé — senza tabelle, senza sommare niente a mente.',
  refeicaoCta: 'Registra un pasto',

  examesTitulo: 'I tuoi esami stanno qui',
  examesTexto: 'Una volta salvati, puoi vedere la linea di ogni valore lungo tutta la terapia — e portare tutto in ordine alla visita.',
  examesCta: 'Salva un esame',

  clinicaTitulo: 'Il tuo centro può stare da questa parte',
  clinicaTexto: 'Con il codice che ti ha dato, il tuo team compare qui e le sue indicazioni smettono di perdersi in mezzo ai messaggi.',
  clinicaCta: 'Usa il codice',
  /* the weekly reading — see ../pt-BR/descobertas.ts */
  semana: {
    chapeu: 'LA TUA SETTIMANA',
    titulo: 'La tua settimana',
    pedirTitulo: 'Vuoi che legga la tua settimana?',
    pedirTexto: 'Ogni lunedì guardo cosa hai registrato la settimana scorsa e ti racconto com’è andata, una scoperta su di te e una prova per la settimana dopo.',
    pedirSim: 'Sì, grazie',
    pedirNao: 'Non ora',
    poucoTitulo: 'Lunedì leggo la tua settimana',
    poucoTexto: 'Fai il check-in almeno 3 giorni, o pesati una volta, e avrò qualcosa da leggere.',
    lendo: 'Sto leggendo la tua settimana…',
    parteSemana: 'La settimana',
    parteDescoberta: 'Una scoperta',
    parteTeste: 'Da provare',
    lerInteira: 'Leggi tutto',
    conversar: 'Parlarne',
    telaTitulo: 'La lettura della settimana',
    desligar: 'Disattiva la lettura della settimana',
    desligada: 'Disattivata. Te lo richiedo tra 4 settimane.',
    aceiteTitulo: 'La lettura della settimana',
    aceitePergunta: 'Vuoi che legga la tua settimana ogni lunedì?',
    termosTitulo: 'Cosa significa',
    termosResumo: 'Cosa esce dal telefono, cosa resta salvato e cos’è',
    aceite1Titulo: 'Cosa esce dal telefono',
    aceite1: 'Ogni lunedì, un riassunto della tua settimana — peso, iniezione, check-in, sintomi, acqua, proteine e allenamenti — e una scoperta calcolata sul tuo telefono vanno al nostro server, che chiede la lettura all’IA di Anthropic, negli Stati Uniti. Senza il tuo nome completo, la tua e-mail o le tue note.',
    aceite2Titulo: 'Cosa resta salvato',
    aceite2: 'La lettura torna sul tuo telefono e resta solo lì, come la conversazione. Il server non salva nulla, e Anthropic non usa i dati per addestrare modelli.',
    aceite3Titulo: 'Cos’è',
    aceite3: 'Una lettura delle tue registrazioni: indica coincidenze, non cause, e non sostituisce il tuo team. Niente al suo interno cambia una dose.',
    politica: 'Leggi l’Informativa sulla privacy',
    aceitar: 'Attiva la lettura della settimana',
    recusar: 'Non ora',
    aceiteRodape: 'Puoi disattivarla quando vuoi, dalla lettura stessa.',
  },
};
