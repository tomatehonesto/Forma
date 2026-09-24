/* ============================================================
   I METRI — che cosa vuol dire ogni numero · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/escalas.ts. Un numero da solo chiede
   alla persona di inventarsi il metro: "3 di energia è buono?" non ha
   risposta, e ogni giorno finisce risposto con un metro diverso da
   quello del giorno prima.

   ⚠️⚠️ QUESTO È IL TESTO CHE LA PERSONA TOCCA, e non quello che legge.
   Spostare un gradino non cambia una frase: cambia quello che resta
   REGISTRATO. Chi traduce deve tenere l'ORDINE e la distanza fra i
   gradini prima ancora di pensare alle parole.

   ⚠️⚠️ E QUI L'ITALIANO HA UNA TRAPPOLA TUTTA SUA: IL PARTICIPIO E
   L'AGGETTIVO CONCORDANO. Il portoghese scrive "Leve" e vale per ogni
   sintomo; l'italiano scriverebbe "Leggero" o "Leggera" a seconda della
   parola, e il metro generico non sa quale sintomo stia misurando.

   La via d'uscita è l'aggettivo in "-e", che in italiano NON varia con il
   genere: "lieve" vale per la nausea e per il dolore allo stesso modo.
   Dove serve un participio, si usa la prima persona con "avere", che non
   concorda ("ho vomitato"), e solo dove il verbo chiede "essere" esce il
   femminile ("non mi sono alzata") — che è la scelta della casa,
   annotata in comum.ts.
   ============================================================ */

export const escalas = {
  /* ---------- i quattro assi del check-in ---------- */
  /* 1–5 sullo schermo, 0–10 in archivio. */
  energia: ['Senza forze', 'Ho tirato avanti', 'È bastata per la giornata', 'Con energia', 'Energia da vendere'],

  /* Ore dormite — gli estremi assorbono quello che li supera.
     ⚠️⚠️ LO SPAZIO PRIMA DELLA "h" È UNO SPAZIO UNIFICATORE (U+00A0), e
     non uno spazio comune: in una colonna stretta la riga si spezzava fra
     il numero e la lettera, e restava una "h" orfana sulla riga dopo.

     ⚠️ NELLE ALTRE CINQUE LINGUE è scritto come carattere, ed è
     invisibile — chi ha tradotto lì ha già sbagliato una volta a
     ridigitarlo. Qui è scritto come ` `, che si vede e non si perde
     in un copia e incolla. */
  sono: ['5 h o meno', 'Circa 6 h', 'Circa 7 h', 'Circa 8 h', '9 h o più'],

  /* 1–5 da entrambe le parti, senza conversione. */
  humor: ['Una giornata difficile', 'Un po’ giù', 'Una giornata normale', 'Una bella giornata', 'Una giornata ottima'],

  /* ⚠️ LA FAME È IL CONTRARIO DELLA SAZIETÀ, e il radar la legge come
     sazietà. Per questo 1 è la fame MINORE: il metro sale insieme al
     sintomo, come gli altri. Invertire l'ordine qui inverte l'asse del
     radar. */
  fome: ['Nessuna fame', 'Poca fame', 'Fame normale', 'Parecchia fame', 'Fame tutto il giorno'],

  /* ============================================================
     I SINTOMI — ognuno con il suo metro

     ⚠️ OGNUNO PEGGIORA IN UN MODO SUO, ed è per questo che non c'è una
     scala generica che serva tutti. Il 4 della nausea è "stavo per
     vomitare"; il 4 della stitichezza è "tre giorni senza andare".
     ============================================================ */

  /* La rete di sicurezza, per un sintomo che non ha ancora un metro suo.
     ⚠️ Tutti e cinque i gradini sono scritti senza accordo di genere —
     vedi l'avviso in alto. */
  intensidade: ['Appena percettibile', 'Lieve', 'Mi ha dato fastidio', 'Mi ha rovinato la giornata', 'Ha preso tutta la giornata'],

  sintoma: {
    nausea: ['Un leggero senso di nausea', 'Nausea che va e viene', 'Nausea costante', 'Stavo per vomitare', 'Ho vomitato'],
    constip: ['Sono andata con fatica', 'Un giorno senza andare', 'Due giorni senza andare', 'Tre giorni senza andare', 'Quattro giorni o più'],
    /* ⚠️ IL GRADINO PIÙ BASSO È UNA FASCIA, E NON "UNA VOLTA", e questa è
       una decisione clinica e non di scrittura: una scarica molle non è
       diarrea. La definizione dell'OMS comincia a tre scariche molli al
       giorno. Chi traduce deve tenere i tagli sugli stessi numeri, non
       sulle stesse parole. */
    diarreia: ['Una o due volte', 'Tre volte', 'Quattro volte', 'Cinque o sei volte', 'Sette o più'],
    refluxo: ['Bruciore leggero', 'Dopo i pasti', 'Più volte al giorno', 'Mi ha impedito di mangiare', 'Non riuscivo a stendermi'],
    fadiga: ['Stanchezza leggera', 'Mi sono stancata prima', 'Ho dovuto rallentare', 'Ho dovuto stendermi', 'Non mi sono alzata dal letto'],
    cefaleia: ['Una fitta', 'Fastidio leggero', 'Ho dovuto prendere qualcosa', 'Mi ha rovinato la giornata', 'Sono stata al buio'],
    tontura: ['Un leggero sbandamento', 'Alzandomi di scatto', 'Più volte al giorno', 'Ho dovuto reggermi', 'Non riuscivo a stare in piedi'],
    /* ⚠️ IL VOMITO SI CONTA, NON SI GRADUA: "mi ha rovinato la giornata"
       non dice niente sul vomitare, e il numero di volte è quello che il
       team chiederà. */
    vomito: ['Una volta', 'Due volte', 'Tre volte', 'Quattro o più', 'Non riuscivo a smettere'],
    dor: ['Un fastidio', 'Crampi leggeri', 'Crampi costanti', 'Ho dovuto fermare la giornata', 'Dolore che non passava'],
  },

  /* ============================================================
     L'INTESTINO

     ⚠️ LE CHIAVI SONO DATO E NON SI TRADUCONO: 'normal', 'preso',
     'solto' e 'alterna' sono quello che resta registrato in `gut`.

     ⚠️ E "HA ALTERNATO" È UN VALORE DI PRIMA CLASSE, non un caso strano.
     Bloccarsi e sciogliersi sono le due punte dello stesso effetto — il
     farmaco rallenta tutto il tratto — e nei dati reali compaiono quasi
     alla pari.
     ============================================================ */
  intestino: {
    normal: 'Normale',
    preso: 'Bloccato',
    solto: 'Sciolto',
    alterna: 'Ha alternato',
  },

  /* ⚠️ IL METRO SENZA RISPOSTA DICE CHE È SENZA RISPOSTA, e non zero. È
     la stessa regola dei tre silenzi del Percorso: un giorno senza
     risposta è un giorno senza risposta. */
  aindaNaoRespondi: 'Non ho ancora risposto',

  nomes: {
    nausea: 'Nausea',
    intestino: 'Intestino',
    vomito: 'Vomito',
    dor: 'Dolore alla pancia',
    refluxo: 'Reflusso',
    fadiga: 'Stanchezza',
    cefaleia: 'Mal di testa',
    tontura: 'Capogiri',
    outro: 'Altro',
    preso: 'Intestino bloccato',
    solto: 'Intestino sciolto',
  },

  /* ============================================================
     LA SCHERMATA DEI SINTOMI

     ⚠️⚠️ LA FRASE DELLO SCHEMA È SCRITTURA, E NON CALCOLO.
     `padraoDoCiclo` restituisce QUALI giorni pesano e se stanno
     all'inizio o alla fine; le sei frasi qui sotto ne sono la lettura.

     ⚠️ E PUÒ RISPONDERE "ANCORA NON SI PUÒ DIRE" — `cicloPoucos`. Anche
     quella è informazione, ed è onesta: un'app di terapia che si inventa
     un dato clinico è peggio di una che tace, perché quel dato finisce
     alla visita.

     ⚠️ L'ORDINALE È DI OGNI LINGUA. In italiano si scrive "il 3º giorno
     dopo", con l'indicatore ordinale maschile; in inglese "on day 3
     after", in tedesco "am 3. Tag danach". Non c'è un suffisso che serva
     a tutte e sei.
     ============================================================ */
  tela: {
    titulo: 'Sintomi',
    diasRespondidos: (quantos: number, de: number) =>
      `${quantos} ${quantos === 1 ? 'giorno con risposta' : 'giorni con risposta'} negli ultimi ${de}`,
    nenhumDia: (de: number) => `Nessun giorno con risposta negli ultimi ${de}`,

    /* ---------- la settimana ---------- */
    nestaSemana: 'Questa settimana',
    semRespostaSemana: 'Questa settimana non hai ancora risposto sui sintomi. Entrano dal check-in.',
    fazerCheckin: 'Fai il check-in',
    nenhumSintoma: 'Nessun sintomo questa settimana',
    nenhumSintomaSub: (respondidos: number) =>
      `${respondidos} ${respondidos === 1 ? 'giorno con risposta' : 'giorni con risposta'}, nessuno con un disturbo.`,
    diasDe: (dias: number, respondidos: number) =>
      `${dias} su ${respondidos} ${respondidos === 1 ? 'giorno' : 'giorni'}`,
    noPiorDia: (legenda: string) => `Nel giorno peggiore: ${legenda}`,
    voceEscreveuEm: (data: string) => `Hai scritto il ${data}`,

    /* ---------- il ciclo ---------- */
    aoLongoDoCiclo: 'Lungo il ciclo',
    aoLongoNota: (dias: number) =>
      `Media della nausea in ogni giorno dopo la puntura, su ${dias} ${dias === 1 ? 'giorno con risposta' : 'giorni con risposta'}.`,
    /* L'etichetta del giorno zero sul metro a barre. */
    dose: 'dose',

    cicloParecido: 'Nei giorni con risposta finora, la nausea si presenta simile lungo tutto il ciclo — non sta seguendo la dose.',
    cicloPoucos: 'I giorni con risposta sono ancora troppo pochi per dire se la nausea segue il ciclo. Rispondi ancora qualche giorno e questo conto regge.',
    cicloInicio1: 'La nausea pesa di più il giorno della puntura.',
    cicloInicioN: (dias: number) => `La nausea pesa di più nei primi ${dias} giorni dopo la puntura.`,
    cicloFim1: 'La nausea pesa di più la vigilia della prossima puntura.',
    cicloFimN: (dias: number) => `La nausea pesa di più nei ${dias} giorni che precedono la prossima puntura.`,
    cicloDia0: 'il giorno della puntura',
    cicloDiaN: (dia: number) => `il ${dia}º giorno dopo`,
    cicloEspalhado: (lista: string) => `La nausea pesa di più ${lista}.`,

    /* ---------- come ti sei sentita ---------- */
    comoSeSentiu: 'Come ti sei sentita',
    respostasEm14: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'risposta' : 'risposte'} in 14 giorni`,
    semRespostas: 'Ancora nessuna risposta',
    sentir: {
      energia: 'Energia',
      humor: 'Umore',
      sono: 'Sonno',
      fome: 'Fame',
    },
  },

  /* ============================================================
     LA SCHERMATA DEL CHECK-IN

     ⚠️ "LASCIARE IN BIANCO È ANCH'ESSA UNA RISPOSTA" è la frase che regge
     tutto il resto dell'app. Un giorno senza risposta compare come
     giorno senza risposta, e non come zero — ed è per questo che la
     schermata può chiedere quattro cose senza pretenderne nessuna.
     ============================================================ */
  telaCheckin: {
    titulo: 'Check-in',
    pergunta: 'Com’è andata oggi?',
    lead: 'Rispondi a quello che ha senso. Lasciare in bianco è anch’essa una risposta.',
    salvar: 'Salva il check-in',

    energia: 'Energia',
    fome: 'Fame',
    sono: 'Sonno',
    humor: 'Umore',

    teveSintoma: 'Hai avuto qualche sintomo?',
    comoFoiIntestino: 'Com’è andato l’intestino?',
    qualOutroSintoma: 'Qual è stato l’altro sintomo?',
    outroPlaceholder: 'Es.: sapore metallico in bocca',
    intensidadeDe: (sintoma: string) => `${sintoma} · intensità`,
  },
};
