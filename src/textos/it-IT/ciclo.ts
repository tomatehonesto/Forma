/* ============================================================
   IL CICLO DELLA DOSE — il titolo della Home e le quattro fasi · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/ciclo.ts. Quello che la persona sente
   cambia lungo i giorni fra una puntura e la successiva, e l'app legge
   questa posizione per spiegare che cosa le sta succedendo OGGI. È il
   testo che vede più gente, perché apre la Home ogni giorno.

   ⚠️ LA REGOLA CHE VALE PER TUTTO IL FILE: nessuna di queste frasi
   ordina di fare qualcosa. Dicono che cosa sta succedendo e che cosa di
   solito aiuta — la differenza fra "bevi più acqua" e "l'acqua sostiene
   la sazietà in questa fase" è la differenza fra un'app che rimprovera e
   una che spiega, e questa è la seconda.
   ============================================================ */

/* ⚠️ LA MOLECOLA ARRIVA SENZA ARTICOLO, e questa frase lo vuole: « il
   comportamento tipico di tirzepatide » era il portoghese senza il suo
   articolo. In italiano i principi attivi di questa famiglia sono
   femminili — la tirzepatide, la semaglutide —, e l'elisione copre
   quello che cominciasse per vocale. */
const della = (molecula: string) => (/^[aeiouh]/i.test(molecula) ? `dell’${molecula}` : `della ${molecula}`);

export const ciclo = {
  /* ---------- il cappello ---------- */
  /* ⚠️ "GIORNO 5 DOPO LA DOSE", E NON "GIORNO 5 DI 7". Il "di sette"
     sembrava il conto alla rovescia di una scadenza — sette di che cosa,
     e che succede quando arriva? La cadenza è del farmaco, non un
     obiettivo da rispettare.

     Era "GIORNO 5 DELLA DOSE", e una dose non è un intervallo di giorni.
     "Dopo" tiene il conto senza la quota — ed è la parola della
     schermata del ciclo, "Giorno 5 dopo la puntura". */
  chapeuDia: (dia: number) => `GIORNO ${dia} DOPO LA DOSE`,
  /* Senza una puntura registrata non c'è ciclo, e il cappello non se lo
     inventa. */
  chapeuSemCiclo: 'PER OGGI',

  /* ---------- giorno della puntura ---------- */
  /* ⚠️ NON ANNUNCIA CHE OGGI È IL GIORNO DELLA PUNTURA: la scheda
     successiva della Home parla solo di quello, con la dose e la zona. */
  aplicHead: 'L’effetto comincia a salire nelle prossime ore.',
  aplicBody: 'Può comparire una nausea leggera — meglio pasti più piccoli lungo la giornata.',
  aplicQ: 'Che cosa aspettarsi il giorno della puntura?',

  /* ---------- picco ---------- */
  picoHead: 'Oggi il tuo appetito tende a restare più basso.',
  picoBody: 'Picco di effetto del farmaco — buona giornata per allenarsi e portarsi avanti con le proteine.',
  picoQ: 'Quando ho più energia?',

  /* ---------- stabile ---------- */
  estabHead: 'Il tuo corpo è nella fase stabile del ciclo.',
  estabBody: 'Effetto costante — tieni acqua e proteine in ordine per sostenere la sazietà.',
  estabQ: 'Come funziona il ciclo del farmaco?',

  /* ---------- ritorno della fame ---------- */
  retornoHead: 'La tua fame può cominciare a salire nelle prossime 24 ore.',
  retornoBody: 'Proteine e acqua sostengono la sazietà in questa fase del ciclo.',
  retornoQ: 'Perché ho più fame?',

  /* ---------- punto alto della fame ---------- */
  altoHeadHoje: 'Fame al punto più alto del ciclo.',
  altoHeadComData: (quando: string) => `Fame al punto alto del ciclo — puntura ${quando}.`,
  /* ⚠️ "NON SALTARE I PASTI" DÀ PER SCONTATO CHE LI SALTI, e nel punto
     alto della fame chi salta di meno è proprio chi ha fame. La frase
     nasceva come consiglio e arrivava come rimprovero. */
  altoBody: 'Porzioni più piccole e più spesso, con le proteine, tengono meglio la fame.',
  altoQ: 'Perché ho più fame?',

  /* ---------- il segnale in più ---------- */
  dormiuBem: (resto: string) => `Hai dormito bene — il tuo corpo tende a rispondere meglio oggi. ${resto}`,

  /* ============================================================
     LE CINQUE TAPPE — lo stepper del ciclo

     ⚠️ SONO CINQUE QUI E QUATTRO POCO SOTTO, ed è di proposito. Questa è
     la domanda "a che punto sono ADESSO"; la tabella sotto risponde
     "com'è il ciclo intero", e lì cinque righe sono una di troppo per chi
     legge la prima volta.

     ⚠️ IL `label` È IL NOME DELLA TAPPA E IL `hint` È CHE COS'È. Il nome
     da solo — "Inizio del ritorno della fame" — è una diagnosi senza
     contesto, e in una schermata di terapia questo spaventa invece di
     orientare.
     ============================================================ */
  faseAplicLabel: 'Puntura',
  faseAplicRange: 'Giorno 1',
  faseAplicHint: 'L’effetto comincia a salire nelle prossime ore.',

  fasePicoLabel: 'Picco di effetto',
  fasePicoRange: 'Giorni 1–2',
  fasePicoHint: 'Farmaco al punto più alto — la fame si fa più piccola.',

  faseEstabLabel: 'Stabilità',
  faseEstabRange: 'Giorni 3–4',
  faseEstabHint: 'Effetto costante, senza grandi oscillazioni.',

  faseRetornoLabel: 'Inizio del ritorno della fame',
  faseRetornoRange: 'Giorni 5–6',
  faseRetornoHint: 'Il livello del farmaco comincia a scendere, e la fame tende a tornare.',

  fasePreLabel: 'Prima della puntura',
  fasePreRange: 'Giorni 7+',
  fasePreHint: 'Punto più basso del ciclo, fino alla dose successiva.',

  /* ============================================================
     LE QUATTRO FASI — la lettura delle schermate interne

     ⚠️ QUESTA TABELLA DÀ PER SCONTATA UNA CADENZA SETTIMANALE, ed è un
     debito noto: chi usa un farmaco quotidiano non ha sette giorni di
     ciclo da attraversare.
     ============================================================ */
  faseSubidaTitulo: 'Giorni 1–2 · salita',
  faseSubidaSub: 'Effetto in salita, appetito più basso',
  faseSubidaComum: 'nausea leggera, sazietà rapida, meno voglia di mangiare',
  faseSubidaAjuda: 'pasti più piccoli e più distanziati; bere acqua lungo la giornata',

  fasePlatoTitulo: 'Giorni 3–4 · plateau',
  fasePlatoSub: 'La fase più stabile del ciclo',
  fasePlatoComum: 'appetito costante, intestino più lento',
  fasePlatoAjuda: 'dare la precedenza a proteine e fibre nei pasti',

  faseDescidaTitulo: 'Giorni 5–6 · discesa',
  faseDescidaSub: 'Effetto che si attenua, fame che torna poco alla volta',
  faseDescidaComum: 'più fame dei primi giorni, energia che oscilla',
  /* ⚠️ LA SECONDA METÀ DI QUESTA FRASE È IL MOTIVO PER CUI ESISTE. Che la
     fame torni al quinto giorno spaventa chi crede che il farmaco abbia
     smesso di funzionare, e mollare lì è comune. Dire che è la fase, e
     non il fallimento, è tutto il lavoro della riga. */
  faseDescidaAjuda: 'è la fase in cui la fame torna — non vuol dire che la terapia abbia smesso di funzionare',
  /* L'unica fase con un'attenzione: è dove compaiono i sintomi che
     chiedono un medico. Non è un allarme — è il confine fra quello che ci
     si aspetta e quello che non aspetta la prossima visita. */
  faseDescidaAtencao: 'vomito che non passa o dolore forte alla pancia: parlane con il tuo medico',

  faseBaixoTitulo: 'Giorno 7 · punto più basso',
  faseBaixoSub: 'Vigilia della prossima puntura',
  faseBaixoComum: 'appetito più vicino al solito',
  /* "La dose", e non "la penna": questa tabella è costante e non sa che
     forma abbia il farmaco. */
  faseBaixoAjuda: 'lascia decise la sera prima la dose e la zona della puntura',

  /* ============================================================
     CICLO DELLA DOSE — la schermata che risponde "perché è tornata la
     fame?"

     ⚠️ L'A CAPO VIVE NEL TESTO, ed era scritto nel JSX: "dopo\nla
     puntura" è la larghezza dell'italiano, e il tedesco spezza altrove.

     ⚠️ E LA PAROLA DELL'ATTO ARRIVA DA FUORI. In italiano le due uscite
     di `formas.palavras[…].acao` sono femminili — "puntura" e "dose" —,
     quindi l'articolo in mezzo è sicuro. Vale come in portoghese e al
     contrario di quello che accadrebbe con una terza forma maschile.
     ============================================================ */
  tela: {
    titulo: 'Ciclo della dose',
    diaDepois: (dia: number, acao: string) => `Giorno ${dia} dopo\nla ${acao}`,
    lead: 'L’effetto del farmaco sale nei primi giorni e poi si attenua fino alla dose successiva. Quello che senti segue lo stesso andamento — ed è quello che ci si aspetta.',

    cicloAtual: 'Ciclo attuale',
    diaDeTotal: (dia: number, total: number) => `giorno ${dia} su ${total}`,
    proximaDose: (data: string) => `Prossima dose: ${data}`,

    asQuatroFases: 'Le quattro fasi',
    comum: 'Frequente',
    ajuda: 'Cosa aiuta',
    atencao: 'Attenzione',

    conteudoGeral: 'Questo è un contenuto generale',
    conteudoGeralTexto: 'Il ciclo varia da persona a persona e con la dose. Niente di tutto questo sostituisce le indicazioni del tuo medico.',

    baseadoEm: (molecula: string) => `Basato sul comportamento tipico ${della(molecula)}`,
  },
};
