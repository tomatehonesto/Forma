/* ============================================================
   GLI INCROCI — che cosa dicono i suoi registri quando si incrociano
   · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/cruzamentos.ts. Ognuna di queste
   scoperte è un conto fatto sui registri di UNA persona. Nessuna è
   contenuto generale: se il conto non supera la soglia, la scoperta non
   esiste. Per questo quasi ogni frase qui ha un numero dentro — il numero
   è quello che separa una scoperta da un consiglio.

   ⚠️ LA REGOLA DI TUTTO IL FILE: nessuna di queste frasi può diventare un
   consiglio. "L'acqua aiuta con la sazietà" è informazione; "bevi più
   acqua" è un ordine, e un ordine basato sulla statistica di tredici
   registri è il peggio dei due mondi.

   ⚠️ E IL SOGGETTO È IL FENOMENO, NON LA PERSONA. "La tua idratazione
   scende la domenica", e non "la domenica bevi di meno" — è lo stesso
   fatto con il dito puntato.

   ⚠️ OGNI SCOPERTA HA FINO A QUATTRO MOVIMENTI, e non sono
   intercambiabili: `titulo` è la scoperta in una riga, `texto` sono i
   numeri che la sostengono, `porque` è il meccanismo, e `significa` è
   l'"e allora?". Tradurre `significa` come se fosse il riassunto del
   `texto` disfa la scheda: esiste per dire una cosa che i numeri NON
   dicono.
   ============================================================ */

export const cruzamentos = {
  /* ---------- le etichette di categoria ---------- */
  catAlimentacao: 'Alimentazione',
  catSono: 'Sonno',
  catSintomas: 'Sintomi',
  catPeso: 'Peso',
  catAplicacoes: 'Punture',

  /* ---------- i giorni della settimana, come entrano nella frase ---------- */
  /* ⚠️ ARRIVANO CON L'ARTICOLO, e non nudi. In italiano l'abitudine
     settimanale si dice con l'articolo singolare — "la domenica", "il
     lunedì" — e non con il plurale del portoghese ("aos domingos"). E
     l'articolo cambia con il genere: "la domenica" è femminile, gli altri
     sei sono maschili. Concatenarlo fuori di qui obbligherebbe la tabella
     ad avere un genere. */
  nomesDia: ['la domenica', 'il lunedì', 'il martedì', 'il mercoledì', 'il giovedì', 'il venerdì', 'il sabato'],

  /* ---------- 1. il fine settimana come un'altra terapia ---------- */
  /* ⚠️ "UN'ALTRA TERAPIA", E NON "IL TUO MOMENTO PEGGIORE". La scoperta
     incrocia tre variabili, e due di loro migliorano nel fine settimana
     (il sonno sale). Il titolo nomina la differenza senza dire quale lato
     sia quello sbagliato. */
  fimDeSemana: {
    titulo: 'Il tuo fine settimana funziona come un’altra terapia',
    texto: (copos: string, proteina: string, sono: string) =>
      `Il sabato e la domenica bevi ${copos} bicchieri in meno${proteina}${sono}`,
    textoProteina: (gramas: number) => ` e mangi ${gramas} g di proteine in meno`,
    /* ⚠️ IL SONNO È LA BUONA NOTIZIA DENTRO QUELLA CATTIVA, e per questo
       chiude la frase: "il riposo migliora; è la routine che si allenta" è
       tutta la scoperta riassunta, ed è quello che impedisce alla scheda
       di diventare un rimprovero. */
    textoSono: (horas: string) => ` — ma dormi ${horas} h in più. Il riposo migliora; è la routine che si allenta.`,
    textoSemSono: '.',
    q: 'Come curare meglio il fine settimana?',
    evid: (copos: string) => ({ valor: `−${copos}`, unidade: 'bicchieri', legenda: 'il sabato e la domenica' }),
    porque: 'La routine della settimana porta la tua idratazione e i tuoi pasti senza che tu debba pensarci: orari fissi, la bottiglia sul tavolo, il pranzo alla stessa ora. Il sabato quella struttura sparisce, e resta da decidere tutto sul momento — che è esattamente quando decidere è più difficile.',
    /* ⚠️ "NON SERVE UNA DISCIPLINA NUOVA" è tutta la frase. Chi legge
       questo sa già che il fine settimana è più difficile; quello che non
       sa è che il problema è strutturale e non di volontà. */
    significa: 'Due giorni a settimana la terapia si ritrova senza la sua struttura, e sono proprio i giorni in cui hai più tempo. Non serve una disciplina nuova — serve che il fine settimana abbia una routine propria, invece di essere l’assenza di quella della settimana.',
  },

  /* ---------- 2. il giorno debole di idratazione ---------- */
  aguaDia: {
    /* ⚠️ IL SOGGETTO È L'IDRATAZIONE, ED ERA LA PERSONA. */
    titulo: (dia: string) => `La tua idratazione scende ${dia}`,
    texto: (pior: string, outros: string) =>
      `Circa ${pior} bicchieri, contro ${outros} negli altri giorni. L’acqua aiuta con la sazietà e con la nausea — ed è il giorno in cui tutte e due pesano di più.`,
    q: 'Come va la mia acqua?',
    evid: (pior: string, outros: string) =>
      ({ valor: pior, unidade: `su ${outros} bicchieri`, legenda: 'la media in quel giorno della settimana' }),
    /* Il valore della scoperta è che il problema ha un indirizzo: un
       giorno fisso si risolve con un promemoria, sorvegliare l'idratazione
       tutti i giorni no. */
    significa: 'Un giorno della settimana tira giù la tua media da solo. Siccome è sempre lo stesso, si risolve con un promemoria soltanto, invece di sorvegliare l’idratazione tutti i giorni.',
  },

  /* ---------- 3. le proteine di oggi contro la fame di domani ---------- */
  /* ⚠️ LA SCOPERTA È IL RITARDO DI UN GIORNO, e non le proteine. La
     relazione sparisce nel grafico quotidiano perché la persona vede la
     fame di oggi accanto al piatto di oggi, mai a quello di ieri. */
  proteinaFome: {
    titulo: 'Nei giorni in cui raggiungi le proteine, il giorno dopo è più facile',
    texto: (meta: number, comMeta: string, semMeta: string) =>
      `Dopo essere arrivata ai ${meta} g, la tua fame del giorno dopo è rimasta a ${comMeta}. Quando non ci sei arrivata, ${semMeta}. L’effetto non si vede lo stesso giorno — per questo è difficile accorgersene.`,
    q: 'Come vanno le mie proteine?',
    evid: (diferenca: string) =>
      ({ valor: `−${diferenca}`, unidade: 'di fame', legenda: 'il giorno dopo aver raggiunto l’obiettivo' }),
    porque: 'Le proteine agiscono sulla sazietà per una strada più lenta di quella dello zucchero: ci mettono di più a uscire dallo stomaco e tengono accesi i segnali di sazietà per ore. Per questo l’effetto dura tutta la notte e ricompare nell’appetito della mattina dopo.',
    /* ⚠️ "NON È SOLO RIEMPIRE UNA TABELLA" è quello che toglie l'obiettivo
       di proteine dal posto dell'obbligo e lo mette in quello dello
       scambio. */
    significa: 'Raggiungere l’obiettivo di proteine non è solo riempire una tabella: è guadagnarsi un giorno dopo più tranquillo. Quando la fame stringe, a risolverla non è quello che mangi in quel momento — è quello che hai mangiato ieri.',
  },

  /* ---------- 4. il sonno contro la fame del giorno dopo ---------- */
  sonoFome: {
    titulo: 'Dormire più di sette ore tiene la tua fame il giorno dopo',
    texto: (comSono: string, semSono: string) =>
      `Dopo le notti piene la tua fame è rimasta a ${comSono}; dopo le notti corte, ${semSono}. Il tuo appetito risponde al sonno della notte prima quanto a quello che hai mangiato.`,
    q: 'Che cosa registrare prima di dormire?',
    evid: { valor: '7h', unidade: '+', legenda: 'il punto in cui la tua fame cambia' },
    /* ⚠️ "NON È MANCANZA DI DISCIPLINA" è il cuore, e non un
       addolcimento. Chi ha dormito male e ha mangiato di più il giorno
       dopo di solito se ne dà la colpa; il meccanismo ormonale è il fatto
       che disfa quella colpa. */
    porque: 'Dormire poco tocca i due ormoni che regolano l’appetito: sale quello che dà fame e scende quello che avvisa che basta così. Non è mancanza di disciplina il giorno dopo — è il tuo corpo che chiede energia rapida per compensare il riposo che è mancato.',
    significa: 'Il sonno di solito non entra nei conti quando si cura il peso, ma nei tuoi dati muove l’appetito come poche altre cose. Una notte protetta può valere di più, per il giorno dopo, di qualsiasi aggiustamento nel piatto.',
  },

  /* ---------- 5. il sonno contro la nausea del giorno dopo ---------- */
  /* ⚠️ QUESTA È L'UNICA SCOPERTA CHE LEGA UN'ABITUDINE A UN SINTOMO
     CLINICO, e per questo il suo `significa` è il più attento del file:
     DISFA la lettura di causa che il titolo invita a fare. */
  sonoEnjoo: {
    titulo: 'Dopo le notti lunghe, la tua nausea è stata più bassa',
    texto: (horas: number, comSono: string, semSono: string) =>
      `Nei giorni successivi a una notte di ${horas}h o più, la tua nausea è rimasta a ${comSono}. Dopo le notti corte, ${semSono} — su una scala di 5.`,
    q: 'Perché ho la nausea?',
    evid: (comSono: string, semSono: string, noites: number) =>
      ({ valor: comSono, unidade: `su ${semSono}`, legenda: `la nausea dopo ${noites} notti lunghe` }),
    significa: 'Questo è quello che mostrano i tuoi registri, e non un rapporto di causa: il ciclo della puntura muove la nausea più di qualsiasi altra cosa, e può stare dietro tutti e due i lati del conto. Prendilo come una traccia da portare al tuo team, non come una spiegazione chiusa.',
  },

  /* ---------- 6. la finestra della nausea ---------- */
  /* La scoperta non è che la nausea esista — è che ha un'ora in cui
     finisce. */
  janelaEnjoo: {
    titulo: 'La tua nausea di solito sparisce circa 48 ore dopo la puntura',
    texto: (perto: string, longe: string) =>
      `Resta a ${perto} nei primi due giorni e scende a ${longe} dal terzo in poi. Non è tutta la terapia a dare la nausea — sono le prime 48 ore di ogni ciclo.`,
    q: 'Perché ho la nausea?',
    evid: { valor: '48', unidade: 'ore', legenda: 'e poi passa' },
    /* ⚠️ L'ULTIMA FRASE È L'UNICA DEL FILE CHE SUGGERISCE UN'AZIONE, e
       può: scegliere il giorno della puntura è una decisione della persona
       con il suo team, non un cambio di dose né di farmaco. */
    significa: (dias: number) =>
      `Questo si è ripetuto in ${dias} dei tuoi registri dopo la puntura. Sapere che esiste una finestra, e che finisce, cambia che cosa farne: il giorno della puntura si può scegliere in modo che quelle 48 ore cadano nella parte più leggera della tua settimana.`,
  },

  /* ---------- 7. acqua contro nausea ---------- */
  aguaEnjoo: {
    titulo: 'Nei giorni in cui bevi bene, la nausea è più bassa',
    /* ⚠️ "NON DIMOSTRA UNA CAUSA" STA DENTRO LA FRASE, e non in una nota a
       piè di pagina. Tutta la scheda è una correlazione di tredici giorni;
       la precisazione deve arrivare accanto al numero, perché è lì che si
       legge. */
    texto: (corte: string, comAgua: string, semAgua: string) =>
      `Da ${corte} in su, la tua nausea media è stata ${comAgua}. Sotto, ${semAgua}. Non dimostra che sia la causa — ma di tutto quello che compare legato al sintomo, è la cosa più facile da cambiare.`,
    q: 'Come far scendere la nausea?',
    evid: (diferenca: string) =>
      ({ valor: `−${diferenca}`, unidade: 'di nausea', legenda: 'nei giorni ben idratati' }),
    significa: 'Di tutto quello che compare legato alla tua nausea, l’acqua è quella più alla tua portata. Non sostituisce il parlarne con il tuo team se stringe, ma è la prima cosa che vale la pena provare prima.',
  },

  /* ---------- 8. il plateau che non ha impedito niente ---------- */
  /* ⚠️ QUESTA È LA SCOPERTA CHE EVITA L'ABBANDONO, ed è per questo che
     esiste. La settimana in cui la bilancia sale è la settimana in cui la
     gente si ferma — e la scheda mostra, con i suoi numeri, che è già
     successo prima e non ha voluto dire quello che sembrava. */
  platoQueNaoImpediu: {
    titulo: (altas: number, perdido: string) =>
      `La bilancia è salita ${altas} volte e hai perso ${perdido} lo stesso`,
    texto: (pesagens: number, altas: number) =>
      `Su ${pesagens} pesate, ${altas} sono arrivate sopra la precedente — e la linea di fondo continua a scendere. Una settimana in salita non è una ricaduta: è rumore di acqua e intestino dentro una tendenza.`,
    q: 'Come sta andando in generale?',
    evid: (altas: number, perdido: string) =>
      ({ valor: String(altas), unidade: 'salite', legenda: `dentro a −${perdido} nel tratto` }),
    porque: 'Il peso del giorno è grasso, ma è anche acqua, sale, intestino e il ciclo ormonale — oscillazioni di uno o due chili capitano senza che sia cambiato niente nella massa grassa. Il grasso se ne va piano e in linea; il resto ondeggia sopra, ed è quello che la bilancia mostra per primo.',
    significa: 'Questo conta più di quanto sembri: la settimana in cui la bilancia sale è la settimana in cui di solito la gente molla. Nei tuoi numeri, non ha mai voluto dire quello che sembrava voler dire.',
  },

  /* ---------- 9. le proteine lungo la terapia ---------- */
  proteinaTendencia: {
    titulo: (subiu: boolean, pct: number) =>
      `Le tue proteine ${subiu ? 'sono salite' : 'sono scese'} del ${pct}% dall’inizio`,
    textoSubiu: (depois: number, antes: number) =>
      `Media di ${depois} g al giorno nelle ultime settimane, contro ${antes} g all’inizio. Le proteine preservano la massa magra durante la perdita di peso.`,
    textoCaiu: (depois: number, antes: number) =>
      `Media di ${depois} g al giorno nelle ultime settimane, contro ${antes} g prima. Vale la pena riprenderle — la massa magra sostiene il metabolismo.`,
    q: 'Come vanno le mie proteine?',
    evid: (pct: number, antes: number, depois: number) =>
      ({ valor: `${pct > 0 ? '+' : ''}${pct}%`, unidade: '', legenda: `${antes} → ${depois} g al giorno` }),
    significaSubiu: 'Sono salite senza che tu te lo fossi proposto, e di solito è il tipo di abitudine che resta. Le proteine sono quello che protegge la tua massa magra mentre il peso scende — senza, una parte di quello che sparisce non è grasso.',
    significaCaiu: 'Il calo è stato graduale, del tipo che da un giorno all’altro non si nota. Le proteine sono quello che protegge la tua massa magra mentre il peso scende; vale la pena riprenderle prima che diventi la nuova normalità.',
  },

  /* ============================================================
     I DUE RITRATTI, IN FONDO ALLA FILA

     ⚠️ QUESTI DUE DESCRIVONO UN NUMERO CHE LA PERSONA VEDE GIÀ NELLA
     HOME, e per questo non sono scoperte: sono ritratti. Stanno per
     ultimi di proposito.
     ============================================================ */

  /* ---------- 10. il ritmo ---------- */
  ritmo: {
    titulo: (ritmo: string) => `Il tuo ritmo è di ${ritmo} kg a settimana`,
    textoBom: (perdido: string, semanas: number) =>
      `${perdido} in ${semanas} settimane, dentro quello che ci si aspetta per la tua fase.`,
    /* ⚠️ LA VERSIONE FUORI DALL'ATTESO NON DIAGNOSTICA E NON ALLARMA:
       indirizza. Un ritmo troppo veloce o troppo lento è conversazione da
       visita, e la scheda si ferma esattamente lì. */
    textoAtencao: (perdido: string, semanas: number) =>
      `${perdido} in ${semanas} settimane. Vale la pena parlare del ritmo con il tuo team alla prossima visita.`,
    q: 'Come sta andando in generale?',
    evid: (ritmo: string, perdido: string, semanas: number) =>
      ({ valor: ritmo, unidade: 'kg/sett', legenda: `${perdido} in ${semanas} settimane` }),
    significaBom: 'È un ritmo che si può tenere, ed è quello che conta: le perdite troppo rapide di solito portano via anche massa magra e poi tornano indietro. Il tuo è nell’intervallo che la letteratura associa a un risultato che resta.',
    /* ⚠️ "NON CON ME" — è l'unica riga dell'app che dice, in prima
       persona, quello che NON fa. Esiste perché l'alternativa era opinare
       su un ritmo che può avere una causa clinica. */
    significaAtencao: 'Il ritmo è una conversazione da avere con il tuo team, non con me. Il numero lo porto in ordine alla visita, se vuoi.',
  },

  /* ---------- 11. l'aderenza ---------- */
  adesao: {
    tituloPerfeita: 'Non hai ritardato nessuna puntura dall’inizio',
    titulo: (pct: number) => `Hai tenuto in ordine il ${pct}% delle punture`,
    texto: (aplicacoes: number, ressalva: string) =>
      `Sono ${aplicacoes} punture dall’inizio della terapia, ${ressalva}.`,
    textoQuaseTodas: 'praticamente tutte nella data giusta',
    textoComAtrasos: 'con qualche ritardo lungo la strada',
    q: 'Come funziona il ciclo del farmaco?',
    evid: (pct: number, aplicacoes: number) =>
      ({ valor: `${pct}%`, unidade: '', legenda: `${aplicacoes} punture dall’inizio` }),
    significaAlta: 'Questa costanza è uno dei fattori che pesano di più su una buona risposta al farmaco. Il livello della sostanza nel corpo dipende dalla regolarità, non dall’impegno — ed è il genere di cosa che si vede solo quando qualcuno guarda tutto lo storico.',
    /* ⚠️ LA VERSIONE CON I RITARDI SPIEGA IL COSTO E NON RIMPROVERA LA
       MANCANZA. "Ogni ritardo lascia una finestra in cui l'effetto scende
       prima del tempo" è il meccanismo; "cerca di non ritardare" sarebbe
       il rimprovero che questa schermata non dà. */
    significaBaixa: 'La regolarità pesa più della dose esatta del giorno: ogni ritardo lascia una finestra in cui l’effetto scende prima del tempo, ed è lì che la fame di solito torna più forte.',
  },
};
