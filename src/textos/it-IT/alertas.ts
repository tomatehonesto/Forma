/* ============================================================
   I PROMEMORIA — i cinque tipi e come ognuno si descrive · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/alertas.ts. Ogni tipo ha tre pezzi —
   il nome nella schermata di configurazione, lo stesso nome su una riga
   stretta accanto a un orario, e che cosa fa, in una frase.

   ⚠️ "LA PUNTURA", E NON "LA PENNA". La tabella non sa che forma abbia il
   medicinale di chi sta leggendo, e la frase che serve penna, flacone e
   siringa allo stesso modo è quella dell'atto. Il comprimido legge
   ancora "puntura" qui, ed è un debito noto: la parola dovrebbe venire
   dal vocabolario di formas.

   ⚠️ E IL CHECK-IN È L'UNICO CHE FA UNA DOMANDA. Gli altri quattro
   avvisano di cose che la persona FA — pungere, pesarsi, bere, mangiare.
   Proprio per questo è quello che si perde di più: niente nella giornata
   ricorda di rispondere.
   ============================================================ */

export const alertas = {
  dose: 'La puntura della dose',
  doseCurto: 'Puntura',
  doseDesc: 'Un avviso prima della prossima dose, per tenere la terapia in ordine.',

  checkin: 'Check-in del giorno',
  checkinCurto: 'Check-in',
  checkinDesc: 'Un tocco per rispondere com’è andata la giornata — sonno, fame, energia e umore.',

  peso: 'Pesata',
  pesoCurto: 'Pesata',
  pesoDesc: 'Un tocco nei giorni in cui vuoi salire sulla bilancia.',

  agua: 'Idratazione',
  aguaCurto: 'Idratazione',
  aguaDesc: 'Piccole spinte a bere acqua — aiutano con la sazietà e con la nausea.',

  proteina: 'Proteine',
  proteinaCurto: 'Proteine',
  proteinaDesc: 'Un promemoria per dare la precedenza alle proteine nei pasti del giorno.',

  /* ---------- quando ---------- */
  noDia: 'Il giorno stesso',
  diasAntes: (n: number) => `${n} giorn${n > 1 ? 'i' : 'o'} prima`,

  /* ⚠️ LE TRE SCORCIATOIE DI SETTIMANA SONO NOMI DI INSIEME, e non
     elenchi. "Lunedì, martedì, mercoledì, giovedì, venerdì" è corretto e
     nessuno lo legge; "Giorni feriali" dice lo stesso in due parole. */
  todoDia: 'Tutti i giorni',
  diasUteis: 'Giorni feriali',
  fimDeSemana: 'Fine settimana',
  listaDeDias: (primeiro: string, resto: string[]) =>
    primeiro + (resto.length ? `, ${resto.join(', ')}` : ''),

  /* ⚠️ L'INTERVALLO SI DICE COME REGOLA, E NON COME ELENCO. "Ogni 2 h,
     dalle 8 alle 20" è una frase; le sette ore che genera non starebbero
     nella riga, e ancora meno in testa a chi vuole solo ricontrollare
     quello che ha impostato.

     ⚠️ E L'ORA IN ITALIANO VUOLE L'ARTICOLO: "dalle 8 alle 20", non "da 8
     a 20". È la preposizione articolata, come in formas. */
  aCada: (cada: number, de: number, ate: number) => `ogni ${cada} h, dalle ${de} alle ${ate}`,
  quandoEHoras: (quando: string, horas: string) => `${quando} · ${horas}`,

  /* ============================================================
     IL FOGLIO DI UN AVVISO
     ============================================================ */
  tela: {
    alertaDe: (tipo: string) => `Avviso di ${tipo}`,
    novoAlerta: 'Nuovo avviso',
    salvar: 'Salva',
    criar: 'Crea avviso',
    apagar: 'Cancella questo avviso',

    oQueAvisar: 'Che cosa avvisare',

    antecedencia: 'Con quanto anticipo',
    antecedenciaAjuda: 'Contato dalla data della tua prossima puntura.',

    diasDaSemana: 'Giorni della settimana',
    diasDaSemanaAjuda: 'Senza nessuno selezionato, l’avviso suona tutti i giorni.',

    quandoTocar: 'Quando suonare',
    modoHorarios: 'Orari',
    modoIntervalo: 'Intervallo',

    horarios: 'Orari',
    horariosAjuda: 'Puoi sceglierne più di uno — l’avviso suona a ognuno.',

    aCada: 'Ogni',
    aCadaHoras: (horas: number) => `${horas} h`,
    comeca: 'Comincia',
    ate: 'Fino a',
    ateAjuda: (avisos: number, cada: number) =>
      `${avisos} avvisi al giorno, ogni ${cada} ore.`,

    tocaEm: (quando: string) => `Suona ${quando}`,
    semHorario: 'Nessun orario impostato',
  },

  /* ============================================================
     PROMEMORIA — l'elenco di quello che suonerà
     ============================================================ */
  telaLembretes: {
    titulo: 'Promemoria',
    lead: 'Gli avvisi che crei compaiono qui, nell’ordine in cui suonano.',
    criar: 'Crea avviso',

    proximo: (quando: string) => `Prossimo: ${quando}`,
    desligado: 'Spento',
    guardado: 'Salvato — gli avvisi escono dal telefono',
    semAviso: 'Nessun avviso mentre è bloccato',

    bloqueados: 'Gli avvisi sono bloccati',
    bloqueadosTexto: 'Il dispositivo sta bloccando le notifiche di questa app. Finché resta così, niente di quello che accendi qui arriverà.',
    semNavegador: 'Nel browser non si può avvisare',
    semNavegadorTexto: 'Quello che crei resta salvato e comincia a valere quando apri l’app sul telefono.',
    abrirConfiguracoes: 'Apri le impostazioni',

    vazio: 'Ancora nessun avviso',
    vazioTexto: (assuntos: string) => `${assuntos} — crea quelli che hanno senso per la tua giornata.`,

    convite: 'Un avviso è un invito, non una pretesa. Se un giorno salta, qui non si accumula niente.',
  },
  /* NOTIFICHE — vedi ../pt-BR/alertas.ts. L'avviso della dose riprende
     `avisos`; quello della scorta, il verdetto della schermata delle
     punture. */
  telaNotificacoes: {
    titulo: 'Notifiche',
    lead: 'Quello che ti abbiamo segnalato negli ultimi giorni.',
    todos: 'Tutte',
    origemTratamento: 'Trattamento',
    origemMensagens: 'Messaggi',
    vazio: 'Niente per ora',
    vazioTexto: 'Quando avremo qualcosa da dirti, comparirà in questa lista.',
    configurar: 'Imposta i promemoria',
    ligados: (n: number) => (n === 0 ? 'Nessun avviso attivo' : n === 1 ? '1 avviso attivo' : `${n} avvisi attivi`),

    insightTitulo: 'Nuovo insight',
    respondeu: (autor: string) => `${autor} ha risposto`,
    examesTitulo: 'Esami importati',
    examesCorpo: (nome: string, marcadores: number) =>
      `${nome}: ${marcadores} ${marcadores === 1 ? 'marcatore, ordinato' : 'marcatori, ordinati'} per data.`,
    /* Il `falta` arriva pronto — "Mancano 5 pesate". */
    conquistaCorpo: (desc: string, falta: string) => `${desc}. ${falta} per il livello successivo.`,
  },
};
