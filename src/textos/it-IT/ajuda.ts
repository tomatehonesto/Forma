/* ============================================================
   L'AIUTO — le otto domande, e perché proprio queste otto · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/ajuda.ts. Qui non ci sono account né
   password, e i dubbi di questa app sono altri: perché un traguardo è
   sparito, da dove esce un numero, perché il promemoria non ha suonato.

   ⚠️⚠️ OGNI RISPOSTA È UNA REGOLA DEL CODICE, e non una promessa di
   marketing. Chi traduce deve saperlo prima di addolcire una qualsiasi
   frase: la risposta sul disinstallare dice che non esiste copia da
   nessuna parte perché non esiste, e non perché suona onesto dirlo.

   ⚠️ E NON C'È UNA RIGA DI CONTATTO, per ora. Un "scrivici" che non porta
   da nessuna parte è la riga peggiore che una schermata di aiuto possa
   avere: compare proprio a chi non è già riuscito a risolvere da solo.

   ⚠️ L'ORDINE È QUELLO DELLA VITA DI QUALCUNO: prima la diffidenza verso
   i numeri, poi che cosa farne, e alla fine che cosa succede ai dati.
   ============================================================ */

export const ajuda = {
  titulo: 'Aiuto',
  lead: 'I dubbi che questa app di solito fa venire, con la risposta di quello che fa davvero.',
  perguntasFrequentes: 'Domande frequenti',

  qa: [
    {
      q: 'Da dove escono i numeri che vedo qui?',
      a: 'Sono tutti conti fatti su quello che hai registrato — peso, punture, check-in, pasti, esami. L’app non completa quello che è mancato e non stima quello che non hai detto: un giorno senza risposta compare come giorno senza risposta, e non come zero.',
    },
    {
      q: 'Posso correggere o cancellare un registro?',
      a: 'Sì, e nel punto in cui compare. Pesate e misure si cancellano nel dettaglio del marcatore; pasti e allenamenti si cancellano aprendo il registro nel diario del giorno. Quello che cancelli esce dai conti all’istante — grafici e riepilogo per la visita compresi.',
    },
    {
      q: 'Perché un traguardo è sparito?',
      a: 'Perché non è mai stato salvato. I traguardi si contano dai tuoi registri ogni volta che la schermata si apre, e non sono segnati come fatti da qualche parte. Se cancelli il registro che ha chiuso un livello, il livello se ne va con lui — per il conteggio non è mai successo.',
    },
    {
      q: 'Ho impostato un promemoria e non ha suonato.',
      /* ⚠️ "Morphi" È IL NOME DELL'APP, e non si traduce: è quello che la
         persona vede nell'elenco dei permessi di sistema. Cambiarlo qui
         la manderebbe a cercare un nome che in quella schermata non
         esiste. */
      a: 'A suonare è il telefono, e suona solo con il permesso. Se le notifiche sono negate a Morphi nelle impostazioni di sistema, i tuoi avvisi restano salvati qui e non suona niente. La schermata Promemoria mostra quando è questo il caso e porta al permesso.',
    },
    {
      q: 'Il mio peso può arrivare dalla bilancia da solo?',
      a: 'Se la tua bilancia, l’orologio o l’anello scrivono in Apple Salute (iPhone) o in Health Connect (Android), sì — leggiamo da lì. Leggiamo solo il peso, e ci limitiamo a leggere: non scriviamo mai niente in quelle app. Garmin, Fitbit, Withings, Oura e Whoop arrivano per questa strada.',
    },
    {
      q: 'Che cosa riesce a vedere il mio team?',
      a: 'Niente, finché non ti colleghi a una clinica partner con il suo codice. Con il collegamento, il team vede il tuo diario finché dura, e l’elenco completo di cosa potrà vedere compare prima di collegarti. Le tue domande a Morphi restano fuori, e puoi scollegarti in qualsiasi momento, dalla schermata della clinica.',
    },
    {
      q: 'Sostituite le indicazioni di chi mi segue?',
      a: 'No, e in nessuna schermata. Quello che fa è mettere in ordine quello che è successo e mostrare schemi nei tuoi registri — dose, sintomo e condotta sono conversazione da visita. Quando un testo dell’app tocca questi argomenti, lo dice.',
    },
    {
      q: 'E se disinstallo l’app?',
      a: 'Il tuo diario resta salvato nel tuo account: reinstalla, accedi, e torna intero. Si perde solo quello che hai registrato senza connessione e che non era ancora arrivato all’account. E se vuoi una tua copia, puoi preparare un file in Esporta.',
    },
  ] as { q: string; a: string }[],

  /* ⚠️ LE PORTE CHE LE RISPOSTE CITANO. Spiegare dove una cosa succede e
     non portarci trasforma l'aiuto in una lezione: chi ha letto che il
     promemoria dipende dal permesso vuole andare a controllare il
     permesso, non imparare a memoria la strada. */
  ondeResolver: 'Dove si risolve',
  lembretes: 'Promemoria',
  lembretesSub: 'Creare, modificare e controllare il permesso degli avvisi',
  integracoes: 'Dispositivi e collegamenti',
  integracoesSub: 'Collegare Apple Salute o Health Connect',
  privacidade: 'Privacy e dati',
  privacidadeSub: 'Dove resta il tuo diario e che cosa ne esce',
  exportar: 'Esporta i tuoi dati',
  exportarSub: 'Creare un file con quello che hai registrato',

  /* ⚠️⚠️ QUESTA È L'UNICA FRASE DELLA SCHERMATA CHE NON PARLA DELL'APP,
     ed è per questo che sta qui: chi apre l'aiuto con un sintomo che fa
     paura ha bisogno della porta giusta, e la porta giusta non è questa
     schermata. */
  emergenciaTitulo: 'In caso di sintomo grave',
  emergenciaTexto: 'Questa schermata parla dell’app. Se qualcosa nel tuo corpo chiede attenzione adesso, contatta il tuo team o il pronto soccorso — non aspettare la prossima visita.',
};
