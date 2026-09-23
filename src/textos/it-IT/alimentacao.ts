/* ============================================================
   L'ALIMENTAZIONE — quello che si mangia, quello che si beve e quello
   che resta fuori · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/alimentacao.ts.

   ⚠️ NESSUNA FRASE DI QUI È UNA PRESCRIZIONE. Le letture indicano quello
   che il conteggio mostra e suggeriscono un piatto successivo; nessuna
   dice alla persona che sta sbagliando, perché l'app non sa che cosa
   abbia concordato con il suo team.
   ============================================================ */

export const alimentacao = {
  /* ============================================================
     QUELLO CHE SI NOTA NELLA ROUTINE

     ⚠️ OGNI FRASE PORTA IL NUMERO CON SÉ. "La tua colazione arriva con 9
     g" si può controllare nella schermata sotto; "stai andando bene a
     colazione" non si può controllare da nessuna parte. Un complimento
     senza numero è il modo più rapido perché un'app suoni come un
     biglietto di auto-aiuto.
     ============================================================ */
  conselhos: {
    fibraQ: 'Come aumento le fibre della mia giornata senza stufarmi di quello che mangio?',
    fibraTitulo: (media: number) => `Fibre: ${media} g al giorno`,
    /* ⚠️ LA SECONDA METÀ È IL MOTIVO PER CUI QUESTA SCHEDA È LA PRIMA: la
       stitichezza è uno degli effetti collaterali più comuni della
       terapia, e la fibra è la leva alimentare che esiste per lei. */
    fibraTexto: (dias: number, meta: number) =>
      `È la tua media negli ultimi ${dias} giorni registrati, contro un obiettivo di ${meta} g. Legumi, avena, verdure a foglia e frutta con la buccia sono la strada più breve — e sono le fibre ad aiutare contro la stitichezza, uno degli effetti collaterali più comuni della terapia.`,

    fibraBoaQ: 'Che cosa cambiano le fibre nella mia terapia?',
    fibraBoaTitulo: (media: number) => `Fibre: ${media} g al giorno, sopra l’obiettivo`,
    fibraBoaTexto: (dias: number, meta: number) =>
      `È la tua media negli ultimi ${dias} giorni registrati, contro un obiettivo di ${meta} g. È quello che di solito tiene a distanza la stitichezza della terapia — vale la pena continuare così.`,

    /* ⚠️ IL MOMENTO DEBOLE NOMINA IL PASTO, ed è quello che il numero del
       giorno non dice: una colazione da 6 g e un pranzo da 40 g fanno lo
       stesso totale di due da 23, e solo il primo ha un passo successivo
       ovvio. */
    momentoFracoQ: (momento: string) => `Che cosa posso mangiare a ${momento.toLowerCase()} per avere più proteine?`,
    momentoFracoTitulo: (momento: string, media: number) => `${momento}: ${media} g di proteine, in media`,
    /* ⚠️ LE FONTI RISPETTANO QUELLO CHE LA PERSONA MANGIA. La frase
       diceva "un uovo, uno yogurt o un pezzo di formaggio" a tutte —
       consiglio che una vegana non può seguire, detto dall'app che le ha
       appena chiesto se è vegana. */
    momentoFracoTexto: (melhor: string, mediaMelhor: number, fontes: string) =>
      `È il tuo pasto più leggero di proteine — ${melhor.toLowerCase()} arriva con ${mediaMelhor} g. Di quello che mangi già, a dare più proteine per caloria è ${fontes}.`,

    momentoForteQ: 'Perché le proteine contano così tanto in questa terapia?',
    momentoForteTitulo: (momento: string, media: number) => `${momento}: ${media} g di proteine, in media`,
    momentoForteTexto: 'È il pasto che sostiene di più il tuo obiettivo del giorno. Ripetere quello che lì funziona già è più facile che sistemarne un altro.',

    /* ⚠️ LA FRASE CONTA IN QUANTI GIORNI UNA VERDURA È COMPARSA NEL
       REGISTRO, e non in quanti la persona ha mangiato verdura. Sono cose
       diverse, e un piatto pronto può avere della verdura dentro senza
       che l'app lo sappia. */
    verdeQ: 'Che verdure stanno bene con quello che mangio di solito?',
    verdeTitulo: (comVerde: number, total: number) =>
      `Verdure in ${comVerde} di ${total} giorni registrati`,
    verdeTexto: 'Un’insalata o un contorno di verdura a pranzo riempie il piatto con poche calorie — aiuta ad arrivare alla fine del pasto sazia senza intaccare le calorie della giornata, e porta le fibre di passaggio.',
  },

  /* ============================================================
     LE BEVANDE

     ⚠️ GLI `id` SONO DATO — 'agua', 'cafe', 'coco' è quello che resta
     registrato in ogni voce di idratazione. Da qui vengono solo il nome e
     il contenitore.

     ⚠️ E IL CONTENITORE È QUELLO CHE LA PERSONA DIREBBE AD ALTA VOCE.
     Nessuno beve un boccione di caffè, e chi ha bevuto una tazzina non sa
     dire a memoria quanti millilitri fossero.
     ============================================================ */
  bebidas: {
    agua: 'Acqua',
    cafe: 'Caffè',
    cafeLeite: 'Caffellatte',
    cha: 'Tè',
    coco: 'Acqua di cocco',
    leite: 'Latte',
    suco: 'Succo',
    shake: 'Shake o proteine in polvere',
    refri: 'Bibita gassata',
    alcool: 'Bevanda alcolica',
    outro: 'Altro',

    /* ⚠️ LA PRECISAZIONE SULL'ALCOL STA SULLA SCHERMATA, e non nascosta
       in un conto. È l'unica bevanda con un effetto netto negativo ben
       stabilito — sopprime la vasopressina e il corpo restituisce più di
       quanto abbia ricevuto. Si può continuare a registrarla, perché il
       diario esiste per registrare quello che è successo; solo non entra
       nel totale. */
    notaAlcool: 'Resta registrata, ma non entra nel totale: l’alcol fa perdere al tuo corpo più liquidi di quanti ne riceva.',

    recipientes: {
      xicara: 'Tazzina',
      caneca: 'Tazza',
      copo: 'Bicchiere',
      garrafa: 'Bottiglia',
      caixinha: 'Brick',
      lata: 'Lattina',
      taca: 'Calice',
      longNeck: 'Bottiglietta',
      coqueteleira: 'Shaker',
    },
  },

  /* ============================================================
     IL PIATTO — i pasti, la misura e la lettura di un alimento
     ============================================================ */
  prato: {
    /* ⚠️ I PASTI SONO CHIAVE ED ETICHETTA INSIEME: il nome è quello che
       resta registrato in ogni pasto, ed è anche quello che la schermata
       mostra. Tradurre l'elenco NON rompe un registro, perché il
       confronto è sempre contro il valore che l'app ha appena
       restituito — ma un pasto vecchio salvato con "Almoço" non combacia
       con "Pranzo", e per questo la schermata ripiega sul nome
       registrato quando non lo riconosce. */
    cafeDaManha: 'Colazione',
    almoco: 'Pranzo',
    lanche: 'Spuntino',
    jantar: 'Cena',

    /* Il ripiego di chi non sta nella tabella: "2 porzioni". */
    porcoes: (qtd: number) => `${qtd} ${qtd === 1 ? 'porzione' : 'porzioni'}`,

    /* ⚠️ LA PROVENIENZA COMPARE SOLO QUANDO VA DETTA. Una voce di tabella
       non dice niente: è il caso normale, e annunciarlo sarebbe rumore su
       ogni riga per avvisare di nessuna. */
    estimado: 'stimato dalla foto',
    semConta: 'non entra ancora nel conto',

    /* ⚠️ LA LETTURA DI UN ALIMENTO NON VIETA NIENTE. "Non è vietato, ma
       prende una buona parte delle calorie del giorno" è il punto più
       lontano a cui arriva, ed è di proposito: l'app non sa che cosa il
       team abbia concordato con la persona. */
    muitaProteinaPoucaCaloria: 'Molte proteine per poche calorie. È il tipo di cibo che la terapia chiede: sta nel piatto che si è rimpicciolito e tiene comunque la massa magra.',
    boaFonte: 'Buona fonte di proteine, che sono quelle che tengono la massa magra mentre il peso scende.',
    caloriaAlta: 'Molte calorie e poche proteine. Non è vietato, ma prende una buona parte delle calorie del giorno e restituisce poco di quello che serve alla terapia.',
    bastanteFibra: 'Molte fibre. Aiutano contro la stitichezza, che è uno degli effetti collaterali più comuni della terapia.',
    quaseNaoPesa: 'Pesa quasi niente sulle calorie del giorno. Buono per accompagnare il piatto, ma le proteine devono arrivare da un’altra parte.',
    temFibra: 'Contiene fibre, che aiutano contro la stitichezza — uno degli effetti collaterali più comuni della terapia.',
  },

  /* ============================================================
     DA DOVE VIENE IL NUMERO, detto alle persone e non in sigla
     ============================================================ */
  origem: {
    porCem: (fonte: string) => `${fonte}. Sono i valori per 100 g, e il peso di ogni porzione è quello che la catena dichiara.`,
    porPorcaoSemPeso: (fonte: string) => `${fonte}. Sono i valori della porzione che la catena vende, e non di 100 g — pubblica l’etichetta del prodotto, senza dire quanto pesa.`,
    porPorcaoComPeso: (fonte: string) => `${fonte}. Sono i valori della porzione che la catena vende, e non di 100 g — con il peso che dichiara lei stessa.`,
    taco: 'I numeri vengono dalla tabella brasiliana di composizione degli alimenti, fatta dall’Unicamp, che misura in laboratorio che cosa contiene ogni alimento.',
    somaTaco: 'Questo è un piatto composto: sommiamo ingrediente per ingrediente con la tabella dell’Unicamp, per una porzione da ristorante. Il tuo può venire più grande o più piccolo.',
    rotulo: 'La tabella dell’Unicamp non analizza questo, quindi i numeri vengono dall’etichetta di prodotti comuni in commercio. Da una marca all’altra cambiano un po’.',
  },

  /* ============================================================
     LE RESTRIZIONI

     ⚠️ IL SOTTOTITOLO DICE CHE COSA RESTA, e non solo che cosa esce.
     "Senza carne, pollo o pesce" da solo lascia la persona senza sapere
     dell'uovo e del formaggio, che è proprio il dubbio di chi sta
     scegliendo fra vegetariano e vegano.
     ============================================================ */
  restricoes: {
    vegetariano: 'Vegetariana',
    vegetarianoSub: 'Senza carne, pollo o pesce. Uovo e latticini restano.',
    vegano: 'Vegana',
    veganoSub: 'Niente di origine animale: carne, pesce, uovo, latte e formaggio restano fuori.',
    semLactose: 'Senza lattosio',
    semLactoseSub: 'Latte, formaggio e derivati restano fuori — per intolleranza o allergia.',
    semOvo: 'Senza uovo',
    semOvoSub: 'L’uovo e i piatti che lo contengono restano fuori.',
    semPeixe: 'Senza pesce e frutti di mare',
    semPeixeSub: 'Pesce, gamberi e frutti di mare restano fuori.',
    semCarneVermelha: 'Senza carne rossa',
    semCarneVermelhaSub: 'Manzo e maiale restano fuori. Pollo e pesce restano.',
  },

  /* ============================================================
     LA SCHERMATA DELL'ALIMENTAZIONE

     ⚠️⚠️ LA FRASE DELL'ENERGIA ARRIVA CON `<b>` DENTRO, e non è un
     ornamento: è quello che permette alla QUANTITÀ di stare in qualsiasi
     punto della frase. L'italiano dice "Ci stanno ancora 487 kcal nella
     tua giornata" — numero in mezzo — e il tedesco lo mette altrove. Se
     la schermata montasse questo in tre pezzi, ogni lingua dovrebbe stare
     nell'ordine del portoghese, e il tedesco non ci sta.

     ⚠️ E LE TRE FRASI SONO TRE, e non una con un condizionale.
     ============================================================ */
  tela: {
    titulo: 'Alimentazione',
    linhaSemProteina: (alvo: number) => `Proteine: niente registrato · obiettivo di ${alvo} g`,
    linhaComProteina: (prot: number, alvo: number, resto: string) => `Proteine: ${prot} di ${alvo} g · ${resto}`,
    faltamParaMeta: (falta: number) => `${falta} g all’obiettivo`,
    metaAlcancada: 'obiettivo raggiunto',
    registrarRefeicao: 'Registra un pasto',

    /* ---------- l'energia del giorno ---------- */
    energiaTitulo: 'L’energia di oggi',
    calorias: 'CALORIE',
    deKcal: (meta: string) => `di ${meta} kcal`,

    sobramDoQueConta: (quanto: string) => `Avanzano <b>${quanto} kcal</b> di quello che si riesce a contare.`,
    /* ⚠️ "SPENDILE BENE" È L'UNICA RICHIESTA DI QUESTA SCHERMATA, e ci
       sta perché è il suo argomento: in un piatto che si è rimpicciolito,
       a decidere la terapia non è la dimensione dell'avanzo, è quello che
       ci entra. */
    aindaCabem: (quanto: string) => `Ci stanno ancora <b>${quanto} kcal</b> nella tua giornata. Spendile bene.`,
    /* "Domani è un altro giorno" e non un allarme: superare l'obiettivo
       in un giorno non è un fallimento, e la schermata non ha niente da
       rimproverare a una giornata già finita. */
    passouAMeta: (quanto: string) => `Hai superato l’obiettivo del giorno di <b>${quanto} kcal</b>. Domani è un altro giorno.`,

    foraDaConta: (fora: number, total: number) =>
      `${fora} ${total === 1 ? 'pasto su' : 'pasti su'} ${total} non ${total === 1 ? 'entra' : 'entrano'} in questo conto: solo un piatto composto con la tabella ha un’etichetta verificata.`,

    carboidrato: 'Carboidrati',
    gordura: 'Grassi',
    fibra: 'Fibre',
    deG: (meta: number) => `di ${meta} g`,

    /* ---------- la settimana ---------- */
    semanaTitulo: 'Le proteine della settimana',
    estaSemana: 'Questa settimana',
    /* ⚠️ MEDIA DEI GIORNI REGISTRATI, e il sottotitolo lo dice. Un giorno
       senza pasti annotati non è un giorno da 0 g — è un giorno che la
       persona non ha registrato, e dividere per sette trasformerebbe una
       dimenticanza in un calo di proteine. */
    nadaNaSemana: 'Niente registrato negli ultimi sette giorni',
    mediaDeDias: (dias: number) => `Media di ${dias} ${dias === 1 ? 'giorno registrato' : 'giorni registrati'}`,
    metaG: (alvo: number) => `Obiettivo: ${alvo} g`,

    /* ---------- quello che abbiamo notato ---------- */
    notamosTitulo: 'Quello che abbiamo notato',
    notamosNota: 'Dalla tua routine delle ultime due settimane — e solo da quello che hai registrato.',
    continueAssim: 'CONTINUA COSÌ',
    umaIdeia: 'UN’IDEA',
    conversarSobre: 'Parliamone',

    /* ---------- il diario ---------- */
    diarioTitulo: 'Diario dei pasti',
    diarioNota: 'Tocca un pasto per vederlo, correggerlo o cancellarlo.',
    /* ⚠️ L'ORIGINE QUALIFICA IL NUMERO, come negli allenamenti: 30 g che
       hai scritto tu e 30 g stimati dalla foto non si controllano allo
       stesso modo. E l'assenza di `fonte` vuol dire manuale — la
       schermata non mostra mai l'assenza, mostra "da te". */
    porVoce: 'da te',
    pelaFoto: 'dalla foto',
    /* "di proteine" scritto, e non solo "g": in un'app che rifiuta di
       contare le calorie, un grammo senza padrone è proprio il dubbio che
       la schermata esiste per non lasciare. */
    deProteina: 'di proteine',
    totalDoDia: (refeicoes: number, gramas: number) =>
      `${refeicoes} ${refeicoes === 1 ? 'pasto' : 'pasti'} · ${gramas} g di proteine`,
    diaVazioTitulo: 'Nessun pasto in questo giorno',
    diaVazioTexto: 'Quello che registri entra nelle proteine del giorno.',

    /* ---------- i preferiti ---------- */
    favoritosTitulo: 'Piatti preferiti',
    favoritosLink: 'Aggiungi',
    favoritosNota: 'Componi il piatto una volta ed entra nel registro con un tocco.',
    semPratoGuardado: 'Nessun piatto salvato — si apre dalla ricerca',
    favVazioTitulo: 'Nessun piatto preferito',
    favVazioTexto: 'Salva un piatto che ripeti ed entra con un tocco.',

    /* ---------- i tuoi alimenti ---------- */
    seusAlimentos: 'I tuoi alimenti',
    dicionario: 'Dizionario degli alimenti',
    dicionarioSub: 'Scopri come ogni cibo può aiutarti nella terapia',
    restricoesLinha: 'Restrizioni alimentari',
    semRestricao: 'Nessuna restrizione',
  },

  /* ============================================================
     LA SCHERMATA DELL'IDRATAZIONE

     ⚠️ IDRATAZIONE, E NON ACQUA. La schermata conta anche caffè, tè,
     latte e succo — il nome vecchio diventava una promessa più piccola di
     quello che la schermata mantiene.

     ⚠️ E IL NOME DELLA BEVANDA ARRIVA GIÀ IN MINUSCOLO, da `comum.noMeio`.
     Il `.toLowerCase()` che stava nel punto di chiamata è regola di
     lingua: in tedesco cancellerebbe la maiuscola di un sostantivo.
     ============================================================ */
  telaAgua: {
    titulo: 'Idratazione',
    /* ⚠️ QUELLO CHE MANCA, e non solo quanto è già stato fatto: "mancano
       2 L" è quello che decide se valga la pena riempire la bottiglia
       adesso. */
    hojeNada: (meta: string) => `Oggi: niente registrato · obiettivo di ${meta}`,
    hojeCom: (bebido: string, meta: string, resto: string) =>
      `Oggi: ${bebido} di ${meta} · ${resto}`,
    faltam: (quanto: string) => `mancano ${quanto}`,
    metaAlcancada: 'obiettivo raggiunto',
    registrar: 'Registra quello che hai bevuto',

    /* ---------- la settimana ---------- */
    suaSemana: 'La tua settimana',
    nadaNaSemana: 'Niente registrato negli ultimi sette giorni',
    mediaDeDias: (dias: number) =>
      `Media di ${dias} ${dias === 1 ? 'giorno registrato' : 'giorni registrati'}`,
    meta: (quanto: string) => `Obiettivo: ${quanto}`,

    /* ---------- il diario ----------

       ⚠️ L'ORA NON È UN ORNAMENTO: è lei a identificare il registro per
       chi cerca quale cancellare. Fra due bicchieri da 0,25 L, a
       distinguerli è "alle 7:18". */
    diario: 'Diario delle bevande',
    diarioNota: 'Caffè, tè, latte e succo contano: l’obiettivo è di liquidi, e non di acqua pura. Cancella quello che hai registrato per errore.',
    apagarDoDia: 'Cancellare l’acqua di questo giorno?',
    apagarGole: (quanto: string, hora: string) => `Cancellare ${quanto} delle ${hora}?`,
    deBebida: (nome: string) => ` di ${nome}`,
    /* ⚠️ IL GIORNO SENZA ORA SI DICE, e non si trucca: un registro di
       prima che il diario esistesse conosce il totale e non sa quando, e
       inventare "08:00" per riempire la riga sarebbe scrivere nel diario
       della persona una cosa che non ha scritto lei. */
    totalSemHora: 'Totale del giorno, senza registro di orario',
    asHoras: (hora: string) => `alle ${hora}`,
    foraDaContaSufixo: ' · fuori dal conto',
    registros: (quantos: number, total: string) =>
      `${quantos} ${quantos === 1 ? 'registro' : 'registri'} · ${total}`,
    maisForaDaConta: (quantos: number) => ` · ${quantos} fuori dal conto`,
    /* L'acqua del piatto entra nel totale del giorno e non in questo
       elenco: non è stata bevuta, è stata mangiata, e ha un diario suo. */
    daComida: (quanto: string) => `Più ${quanto} dal cibo che hai registrato`,
    vazioTitulo: 'Niente registrato in questo giorno',
    vazioTexto: 'Quello che annoti entra nel totale del giorno.',

    /* ---------- il promemoria ---------- */
    lembrete: 'Promemoria',
    alertas: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'avviso' : 'avvisi'} per l’idratazione`,
    nenhumAlerta: 'Nessun avviso per l’idratazione',
    tocaEm: (quando: string) => `Suona ${quando}`,
    umToquePorDia: 'Un avviso al giorno, all’ora che scegli tu',
  },

  /* ============================================================
     IL FOGLIO PER REGISTRARE UN PASTO

     Fa tre lavori con lo stesso modulo — registrare, correggere e salvare
     un preferito — e il titolo, il sottotitolo e il pulsante cambiano in
     tutti e tre. Per questo sono nove chiavi e non tre.
     ============================================================ */
  telaMedirRefeicao: {
    /* ---------- i tre titoli ---------- */
    favorito: 'Un piatto preferito',
    favoritoSub: 'Componi il piatto una volta e resta a un tocco',
    corrigir: 'Correggi il pasto',
    corrigirSub: 'Che cosa è rimasto sbagliato nel registro',
    oQueComeu: 'Che cosa hai mangiato?',
    proteinaHoje: (hoje: number, alvo: number) => `${hoje} di ${alvo} g di proteine oggi`,

    /* ---------- il pulsante ---------- */
    digaOQueTinha: 'Di’ che cosa c’era nel piatto',
    guardarNosFavoritos: 'Salva nei preferiti',
    salvarCorrecao: 'Salva la correzione',
    registrarMomento: (momento: string) => `Registra ${momento.toLowerCase()}`,

    /* ---------- il piatto ---------- */
    quando: 'QUANDO',
    oQueTinhaNoPrato: 'CHE COSA C’ERA NEL PIATTO',
    proteinaDestaRefeicao: 'Proteine di questo pasto',
    gramas: (quanto: number) => `~${quanto} g`,
    semContaUm: (item: string) =>
      `${item} non entra in questo conto — le proteine di quel piatto non ce le ho ancora.`,
    semContaVarios: (quantos: number) =>
      `${quantos} voci non entrano in questo conto — le loro proteine non ce le ho ancora.`,
    estimadoPelaFoto: 'Una parte di questo totale è stata stimata dalla foto, e non presa dalla tabella.',

    /* ---------- i preferiti ---------- */
    pratosFavoritos: 'Piatti preferiti',
    pratosGuardados: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'piatto salvato' : 'piatti salvati'}`,
    favoritoProteina: (quanto: number) => `~${quanto} g di proteine`,

    /* ---------- il compositore del piatto (ui/comida) ---------- */
    buscaPlaceholder: 'Cerca un alimento o un piatto',
    itemSub: (marca: string, medida: string, gramas: number) =>
      `${marca}${medida} · ~${gramas} g di proteine`,
    anotarEscrito: (texto: string) => `Annota «${texto}»`,
    semProteinaAinda: 'Le proteine di questo non ce le ho ancora',
    escanear: 'Scansiona',
    lendoOPrato: 'Sto leggendo il piatto…',
    confiraALista: 'Controlla l’elenco qui sotto e aggiusta quello che serve.',

    apagar: 'Cancella questo pasto',
  },

  /* ============================================================
     LA SCHERMATA DI UN ALIMENTO

     ⚠️⚠️ IL RISALTO È UNA FRASE INTERA PER NUTRIENTE, e non "Molto" più
     un nome. L'italiano concorda, e concorda DUE VOLTE: in genere e in
     numero. "Molte proteine" è femminile plurale — perché in italiano le
     proteine si dicono al plurale, al contrario del portoghese — mentre
     "Molta fibra" è femminile singolare e "Molto calcio" è maschile.
     Quattro forme per la stessa parola, e la schermata scriveva "Muita"
     fisso.

     ⚠️ E LA CHIAVE È IL NOME IN PORTOGHESE, perché è quello che sta
     REGISTRATO in `logic/alimentos` — la tabella degli alimenti è dato, e
     non testo. Stessa famiglia di `tratamento.molecula`: la chiave non
     cambia, quello che si mostra sì.

     ⚠️ LO SPAZIO DI "vitamina C" È UNIFICATORE nella schermata, altrimenti
     la C cade da sola sulla riga sotto. Ad applicarlo è la schermata,
     dopo aver letto da qui.
     ============================================================ */
  telaAlimento: {
    titulo: 'Alimento',
    naoEncontrado: 'Non ho trovato questo alimento.',

    destaque: {
      'proteína': 'Molte proteine',
      'fibra': 'Molta fibra',
      'vitamina C': 'Molta vitamina C',
      'vitamina A': 'Molta vitamina A',
      'cálcio': 'Molto calcio',
      'ferro': 'Molto ferro',
      'magnésio': 'Molto magnesio',
      'zinco': 'Molto zinco',
      'fósforo': 'Molto fosforo',
      'niacina': 'Molta niacina',
      'tiamina': 'Molta tiamina',
      'riboflavina': 'Molta riboflavina',
    },
    porcentoDoDia: (pct: number) => `${pct}% di quello che serve a una persona in un giorno`,

    porcaoDe: (medida: string) => `Porzione: ${medida}`,
    porcaoDe100: 'Porzione da 100 g',
    valoresDe: (medida: string) => `Valori di ${medida}`,
    valoresPor100: 'Valori per 100 g',

    proteina: 'Proteine',
    carboidrato: 'Carboidrati',
    gordura: 'Grassi',

    proteinaEm: (medida: string) => `Proteine in ${medida}`,
    fibraEm: (medida: string) => `Fibre in ${medida}`,
    fibraPor100: 'Fibre per 100 g',
    naoMedida: 'non misurata',
    pesaPertoDe: (medida: string, peso: string) => `${medida} pesa circa ${peso}.`,

    registrarComIsto: 'Registra un pasto con questo',
  },
};
