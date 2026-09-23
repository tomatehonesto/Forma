/* ============================================================
   LE LETTURE — quello che l'app dice dopo aver letto le risposte
   · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/leituras.ts, e quattro blocchi valgono
   per tutto il file:

   1. NESSUNA NOMINA UNA DIAGNOSI. Chi legge ha già il sintomo, e il nome
      di una malattia spaventa senza aiutare a decidere il passo dopo.

   2. IL SOGGETTO È IL SINTOMO O IL CORPO, MAI LA PERSONA. Chi vomita non
      sta vomitando troppo, sta vomitando. Lei è quella che legge, non
      quella che l'ha causato.

   3. LE FASCE SONO CLINICHE, E NON EDITORIALI. Chi traduce cambia le
      parole e non i numeri, che stanno in logic/leituras.

   4. IL `curto` NOMINA SEMPRE L'OGGETTO DEL VERBO. "Bevi a piccoli
      sorsi" lascia la persona a riempire il buco da sola, e su una riga
      letta di sfuggita il buco resta. "Bevi acqua a piccoli sorsi" non
      lascia dubbi — ed è l'unica frase che si porterà via.
   ============================================================ */

export const leituras = {
  /* ============================================================
     GLI AVVISI DI CAMPO — un sintomo, risposto adesso
     ============================================================ */
  dorSobre: 'Dolore alla pancia',
  dorCurto: 'parlane oggi con il tuo team',
  dorTitulo: 'Questo dolore non aspetta la prossima visita',
  /* ⚠️ "QUASI MAI È QUALCOSA DI GRAVE — ED È PROPRIO PER QUESTO CHE VALE
     LA PENA GUARDARE PRESTO" è la frase intera. Chiede attenzione senza
     spaventare, e il "proprio per questo" è ciò che impedisce alla
     lettura di diventare un allarme. */
  dorTexto: 'Un dolore forte alla pancia, o che non passa, chiede attenzione il giorno stesso. Quasi mai è qualcosa di grave — ed è proprio per questo che vale la pena guardare presto.',
  dorAcao: 'Parlane oggi con il tuo team. Se peggiora o arriva con il vomito, fatti vedere.',

  vomitoSobre: 'Vomito',
  vomitoCurto: 'bevi acqua a piccoli sorsi, spesso',
  vomitoTitulo: 'Il vomito porta via più liquidi di quanto sembri',
  vomitoTexto: 'Insieme all’acqua se ne va il sale, e il tuo corpo lo sente prima che ti venga sete. E quando il cibo non resta giù, cominci il giorno dopo già stanca.',
  vomitoAcao: 'Bevi a piccoli sorsi, spesso, invece di un bicchiere tutto insieme. Se non resta giù nemmeno l’acqua, parlane oggi con il tuo team.',

  tonturaSobre: 'Capogiri',
  tonturaCurto: 'siediti, bevi acqua e mangia qualcosa di dolce',
  tonturaTitulo: 'Un capogiro così di solito ha una spiegazione',
  tonturaTexto: 'Quasi sempre è mancanza di liquidi o glicemia bassa. Se prendi anche un farmaco per il diabete, la glicemia bassa diventa ancora più probabile.',
  tonturaAcao: 'Siediti, bevi acqua e mangia qualcosa. Se si ripete nei prossimi giorni, dillo al tuo team.',

  /* I due lati dell'intestino: uno conta i giorni senza andare, l'altro
     le volte in un giorno. */
  presoSobre: 'Intestino bloccato',
  presoCurto: 'bevi acqua lungo la giornata, mangia fibre e cammina',
  presoTitulo: 'Quattro giorni senza andare meritano attenzione',
  presoTexto: 'Il farmaco rallenta tutto, e mangiando meno resta poco da spingere per l’intestino. Intorno ai quattro giorni è il momento in cui di solito smette di risolversi da sé.',
  presoAcao: 'Acqua lungo la giornata, fibre ai pasti e una camminata. Se supera i cinque giorni, o arriva con dolore forte e vomito, fatti vedere.',

  soltoSobre: 'Intestino sciolto',
  soltoCurto: 'bevi acqua con un pizzico di sale, senza aspettare la sete',
  soltoTitulo: 'L’intestino sciolto porta via acqua e sale insieme',
  soltoTexto: 'Sette volte o più in un giorno portano via più di quanto la sete riesca a rimettere.',
  soltoAcao: 'Bevi lungo la giornata senza aspettare la sete, con una soluzione reidratante o un pizzico di sale. Se domani è ancora così, avvisa il tuo team.',

  /* ============================================================
     LE COMBINAZIONI — quello che nessun sintomo da solo riesce a dire

     Un dolore forte è una cosa; un dolore forte CON il vomito è un'altra,
     e il foglietto illustrativo le tratta in modo diverso.

     ⚠️ E QUANDO COMPARE UNA COMBINAZIONE, GLI AVVISI DI CAMPO SPARISCONO.
     Quelli dicono "parlane con il tuo team" di un sintomo; la
     combinazione dice "vai adesso" sull'insieme, e tenerli tutti e due
     sullo schermo è lasciare che il meno urgente discuta con il più
     urgente.
     ============================================================ */
  travaSobre: 'Intestino, dolore e vomito',
  travaCurto: 'vai oggi al pronto soccorso',
  travaTitulo: 'Questa combinazione chiede di farsi vedere adesso',
  travaTexto: 'Un intestino fermo da giorni, dolore forte e vomito insieme possono essere il segno che qualcosa si è bloccato. È raro, ma non migliora da solo.',
  /* ⚠️ "QUALE FARMACO USI", e non "che usi la penna". Chi è al pronto
     soccorso deve dire CHE COSA prende, non in che confezione arriva. */
  travaAcao: 'Vai oggi al pronto soccorso. Di’ quale farmaco usi e da quanti giorni non vai in bagno.',

  dorVomitoSobre: 'Dolore con vomito',
  dorVomitoCurto: 'cerca il tuo team o il pronto soccorso oggi',
  dorVomitoTitulo: 'Dolore forte con vomito non aspetta',
  dorVomitoTexto: 'Un dolore forte alla pancia insieme al vomito, che a volte si irradia alla schiena, chiede attenzione il giorno stesso. Se arrivi presto, è semplice da controllare.',
  dorVomitoAcao: 'Cerca oggi il tuo team o vai al pronto soccorso. Di’ quale farmaco usi, la dose e quando è cominciato il dolore.',

  desidratacaoSobre: 'Capogiri e perdita di liquidi',
  desidratacaoCurto: 'bevi una soluzione reidratante o acqua con sale, e alzati piano',
  desidratacaoTitulo: 'Capogiri con perdita di liquidi sono un segno di disidratazione',
  desidratacaoTexto: 'Quando mancano acqua e sale, la pressione scende quando ti alzi — e il capogiro è il tuo corpo che avvisa.',
  desidratacaoAcao: 'Bevi a piccoli sorsi lungo la giornata, con una soluzione reidratante o un pizzico di sale, e alzati piano. Se entro domani non migliora, avvisa il tuo team.',

  /* ============================================================
     LA PERSISTENZA — quello che un giorno da solo non dice

     La nausea oggi è quello che ci si aspetta da chi ha iniziato o ha
     appena alzato la dose. La nausea in quattro degli ultimi sette giorni
     è un'altra frase.

     ⚠️ PER QUESTO IL TESTO PORTA IL NUMERO DI GIORNI. "Quattro degli
     ultimi sette" è un fatto che la persona porta alla visita; "hai
     spesso la nausea" è un'impressione che aveva già.
     ============================================================ */
  vomitoSemanaSobre: 'Vomito nella settimana',
  vomitoSemanaCurto: 'parlane con il tuo team questa settimana',
  vomitoSemanaTitulo: 'Vomito in giorni ripetuti',
  vomitoSemanaTexto: (n: number) => `${n} degli ultimi sette giorni con vomito. Così non restano giù né il cibo, né i liquidi, né il farmaco stesso.`,
  vomitoSemanaAcao: 'Parlane con il tuo team questa settimana, senza aspettare la visita. Digli il numero di giorni — è quello che fa la differenza.',

  soltoSemanaSobre: 'Intestino nella settimana',
  soltoSemanaCurto: 'bevi di più e dillo al tuo team',
  soltoSemanaTitulo: 'L’intestino è sciolto da giorni',
  soltoSemanaTexto: (n: number) => `${n} degli ultimi sette giorni così incidono già sui liquidi, anche quando ogni giorno, preso da solo, sembra tranquillo.`,
  soltoSemanaAcao: 'Bevi più di quanto la sete chieda e dillo al tuo team. Può essere la dose, può essere l’alimentazione.',

  enjooSemanaSobre: 'Nausea nella settimana',
  enjooSemanaCurto: 'porta il numero di giorni alla visita',
  enjooSemanaTitulo: 'La nausea non sta passando',
  enjooSemanaTexto: (n: number) => `${n} degli ultimi sette giorni con nausea smettono di essere adattamento e diventano uno schema. Di solito cambia con la dose, o con la velocità con cui la dose sale.`,
  /* ⚠️ "TENERE LA DOSE ANCORA UN PO' NON È MOLLARE" è il servizio della
     frase: è la condotta che la persona fa più fatica a portare alla
     visita, perché la legge come un fallimento. */
  enjooSemanaAcao: 'Porta questo numero alla prossima visita. Tenere la dose ancora un po’ non è mollare.',

  /* ⚠️ L'INTESTINO BLOCCATO COMPARE IN TUTTE E DUE LE LETTURE, e non è
     una ripetizione: il metro del campo conta i giorni di fila senza
     andare — un episodio —, e questo conta i giorni della settimana con
     l'intestino lento, che è lo schema di chi va ogni tre giorni senza
     mai restarne quattro senza andare. */
  presoSemanaSobre: 'Intestino lento nella settimana',
  presoSemanaCurto: 'bevi acqua, mangia fibre e cammina',
  presoSemanaTitulo: 'L’intestino è lento da tutta la settimana',
  presoSemanaTexto: (n: number) => `${n} degli ultimi sette giorni con l’intestino bloccato. Mangiare meno è un effetto del farmaco, e con meno cibo passano meno fibre — l’intestino lo sente prima della bilancia.`,
  presoSemanaAcao: 'Acqua, fibre e camminata aiutano. A questo ritmo, vale la pena dirlo al tuo team.',

  /* ============================================================
     I SEGNI DELLA SETTIMANA — quello che è andato bene, in due parole

     ⚠️ I SEGNI SONO INDICIZZATI DAL NUMERO DI GIORNI, e la chiave è il
     numero perché chi fa la domanda è la sequenza: `marcoDe(7)`. Tradurre
     il valore non tocca nessun registro.

     ⚠️ E NON SONO SETTE GRADINI DI UNA SCALA. Ognuno nomina un tempo che
     la persona riconosce — tre giorni, una settimana, un mese — e per
     questo quello di 30 dice "registri" e non "di fila": un mese intero
     senza saltare un giorno è raro, e la frase non può promettere quello
     che il metro non pretende.
     ============================================================ */
  marcos: {
    3: 'Tre giorni di fila',
    7: 'Una settimana intera',
    14: 'Due settimane di fila',
    21: 'Tre settimane di fila',
    30: 'Un mese di registri',
    60: 'Due mesi di fila',
    90: 'Tre mesi di fila',
  },

  /* ⚠️ LE TRE CON UN NUMERO PORTANO IL NUMERO CHE LE SOSTIENE, ed è quello
     che le separa da un complimento. "Hai dormito bene" è un'opinione;
     "7 h+ di sonno in 5 giorni" è il conto dei suoi stessi registri. */
  dormindoBem: (n: number) => `7 h+ di sonno in ${n} giorni`,
  energiaBoa: (n: number) => `Buona energia in ${n} giorni`,
  semEnjooDias: (n: number) => `${n} giorni senza nausea`,

  /* L'unica senza numero, perché il suo numero sarebbe la differenza fra
     due medie — e "fame più bassa di 1,2 punti" non è una buona notizia
     che qualcuno legga. Il fatto è la sazietà, e non ha unità. */
  saciedadeMelhorando: 'Sazietà in miglioramento',

};
