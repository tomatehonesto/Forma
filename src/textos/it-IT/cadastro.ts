/* ============================================================
   LA REGISTRAZIONE — diciannove domande, e la schermata più grande
   dell'app · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/cadastro.ts.

   ⚠️⚠️ LE DOMANDE SI CONIUGANO. Chi deve ancora cominciare non ha niente
   al presente da rispondere: "quale farmaco usi" obbliga quella persona a
   tradurre la domanda prima di risponderle. Per questo farmaco, forma,
   dose, frequenza e monitoraggio arrivano in coppia — `agora` e `futuro`.

   ⚠️ OGNI SOTTOTITOLO DICE PERCHÉ CHIEDIAMO, e non è un ornamento: è la
   differenza fra un modulo e un interrogatorio. Vale la pena rileggere
   quello dell'identità prima di tradurlo — la motivazione è QUELLA VERA,
   e non quella conveniente. L'identità di genere non entra in nessun
   conto qui; serve a parlare con la persona nel modo giusto, e il corpo
   arriva nelle domande dopo.

   ⚠️⚠️ E IN ITALIANO L'ACCORDO SI VEDE QUASI OVUNQUE. Il femminile è la
   forma predefinita della casa — la ragione sta in comum.ts — e dove si
   può scrivere senza accordo, si scrive senza: "Ho già cominciato" non
   chiede niente a nessuno, "Sono già iniziata" sarebbe sbagliato e
   "Iniziato/a" è la barra che i lettori di schermo pronunciano male.
   ============================================================ */

export const cadastro = {
  /* ============================================================
     L'APERTURA
     ============================================================ */
  aberturaTitulo: 'La compagnia nel tuo percorso di ',
  aberturaTituloForte: 'cambiamento',
  aberturaTexto: 'Più che seguire i risultati, si tratta di capire il percorso che c’è dietro. Un’esperienza intelligente che impara con te e si adatta a ogni fase.',
  comecar: 'Comincia',

  /* ⚠️ E HA UN'USCITA VERSO LA VETRINA, per chi ha aperto la
     registrazione senza volersi registrare. */
  verPlanos: 'Vedi i piani',

  /* ============================================================
     I TITOLI — la domanda di ogni passo
     ============================================================ */
  titulos: {
    nome: 'Come possiamo chiamarti?',
    identidade: 'Come ti identifichi?',
    nascimento: 'Quando sei nata?',
    tratamento: 'Sei già in terapia?',
    inicio: 'Quando hai cominciato?',
    medicamentoFuturo: 'Che farmaco pensi di usare?',
    medicamentoAgora: 'Che farmaco usi?',
    formaFuturo: 'Come farai la puntura?',
    formaAgora: 'Come fai la puntura?',
    doseFuturo: 'Con che dose pensi di cominciare?',
    doseAgora: 'Qual è la tua dose attuale?',
    frequenciaFuturo: 'Ogni quanto farai la puntura?',
    frequenciaAgora: 'Ogni quanto fai la puntura?',
    corpo: 'Quali sono le tue misure attuali?',
    meta: 'Qual è il tuo obiettivo di peso?',
    ritmo: 'Che ritmo vuoi tenere per arrivarci?',
    motivacao: 'Che cosa ti porta in questo percorso?',
    atividade: 'Qual è il tuo livello di attività fisica?',
    restricao: 'Hai qualche restrizione alimentare?',
    saude: 'Collega la tua app di salute',
    acompanhamentoFuturo: 'Pensi di farti seguire da uno specialista?',
    acompanhamentoAgora: 'Ti fai seguire da uno specialista?',
    consentimento: 'Informazioni importanti',
  },

  /* ============================================================
     I SOTTOTITOLI — perché chiediamo
     ============================================================ */
  subs: {
    nome: 'Va bene anche solo il nome, o il soprannome che ti piace.',
    identidade: 'Serve a parlarti nel modo giusto. Quello che entra nei conti di salute è il tuo corpo, e arriva nelle prossime domande.',
    nascimento: 'Ogni fase della vita ha bisogni diversi — e l’età entra nei valori di riferimento dei tuoi esami.',
    tratamento: 'Solo per sapere a che punto sei adesso.',
    inicio: 'Una data approssimativa va bene. Da qui esce la tua settimana di terapia, ed è questo peso a diventare l’inizio della tua curva.',
    medicamento: 'Da lui escono la scala delle dosi e l’intervallo fra le punture.',
    forma: 'La preparazione magistrale esce dalla farmacia in tutte e due le forme, e quello che cambia è ciò che hai in mano al momento di farla.',
    doseComEscada: (med: string) => `Nell’ordine della titolazione di ${med}.`,
    /* Senza scala non c'è titolazione da seguire: una preparazione
       magistrale non ha gradini di foglietto, e a definire il numero è la
       ricetta. */
    doseSemEscada: 'La preparazione magistrale non ha una scala di dosi standard — il numero è quello della tua ricetta.',
    /* ⚠️ IL CONTENITORE ARRIVA GIÀ CONCORDATO — "del flacone", "della
       penna". Vedi T.formas.doDa, in textos/it-IT/formas.ts. */
    frequencia: (doDaForma: string) => `Da qui escono il conteggio del ciclo, i promemoria e la scorta ${doDaForma}.`,
    corpo: 'È con altezza e peso che calcoliamo il tuo IMC e costruiamo i tuoi obiettivi quotidiani di proteine e acqua.',
    meta: 'È il riferimento che usiamo per mostrarti quanta strada hai già fatto. Puoi cambiarlo quando vuoi.',
    ritmo: (aPercorrer: string) => `${aPercorrer} da percorrere.`,
    motivacao: 'Non esiste una risposta giusta. Vale quella che ti verrebbe in mente in un giorno difficile.',
    restricao: 'Le proteine sono il centro di questa terapia, e arrivano da posti diversi a seconda di quello che mangi. Puoi sceglierne più di una.',
    atividade: 'Entra nel tuo obiettivo quotidiano di acqua — muoversi di più fa perdere più liquidi — e dice da dove parti.',
    saude: 'I tuoi dati di salute aiutano a capire il tuo andamento — senza che tu debba registrare tutto.',
    acompanhamento: 'Questa risposta apre quello che è legato al monitoraggio medico, come gli appunti e la preparazione delle visite.',
    consentimento: 'Due cose prima di cominciare: che cosa facciamo per la tua terapia, e che cosa succede a quello che registri.',
  },

  /* ============================================================
     LE RISPOSTE
     ============================================================ */
  seuNome: 'Il tuo nome',

  /* ⚠️ "ALTRO" E "PREFERISCO NON DIRLO" NON SONO LA STESSA RISPOSTA: una
     dice chi è la persona, l'altra dice che non vuole dirlo. Unirle
     obbligherebbe chi vuole solo privacy a dichiararsi. */
  feminino: 'Femminile',
  masculino: 'Maschile',
  outro: 'Altro',
  prefiroNaoInformar: 'Preferisco non dirlo',

  jaIniciei: 'Ho già cominciato la terapia',
  jaInicieiSub: 'Ho già fatto almeno una dose',
  vouComecar: 'Comincio a breve',
  vouComecarSub: 'Non ho ancora fatto punture',

  /* ⚠️ "NON LO SO ANCORA" COMPARE DUE VOLTE, con sottotitoli diversi —
     una nel farmaco e una nella dose. L'etichetta è la stessa perché
     l'esitazione è la stessa; quello che cambia è la nostra risposta. */
  aindaNaoSei: 'Non lo so ancora',
  aindaNaoSeiMedSub: 'Puoi indicarlo dopo nel tuo profilo',
  aindaNaoSeiDoseSub: 'Quasi tutte cominciano dalla più bassa',

  /* ⚠️ "QUI" È IL PAESE CHE LA PERSONA HA RISPOSTO, e non dove si trova.
     L'elenco qui sotto non è di farmaci vietati né di farmaci peggiori —
     è solo quello che circola di meno in quel posto. */
  menosComumAqui: 'MENO COMUNE QUI',
  manipuladoSub: 'Preparata in farmacia galenica',
  formaSeringaSub: 'Aspiri la dose con una siringa',
  formaCanetaSub: 'Arriva già riempita, pronta per la puntura',

  doseDeInicio: 'Dose iniziale',
  doseMaxima: 'Dose massima',

  todosOsDias: 'Tutti i giorni',
  aCadaDias: (d: number) => `Ogni ${d} giorni`,
  padrao: 'Standard',
  outroIntervaloTitulo: 'Un altro intervallo',
  outroIntervalo: 'Dici tu ogni quanti giorni',

  pesoDeHoje: 'PESO DI OGGI',
  pesoDeQuandoComecou: 'PESO DI QUANDO HAI COMINCIATO',
  querPerder: 'Vuoi perdere',
  querGanhar: 'Vuoi prendere',

  /* ⚠️ NESSUN RITMO PROMETTE NIENTE, ed è per questo che i nomi sono di
     RITMO e non di risultato. Quello che la letteratura descrive come
     perdita sostenuta sta intorno a 0,5–1 kg a settimana; sopra, il conto
     è del corpo e della dose, non della volontà. */
  ritmoDevagar: 'Piano e costante',
  ritmoConstante: 'Ritmo costante',
  ritmoAcelerado: 'Accelerato',
  ritmoMaisRapido: 'Il più veloce possibile',
  ritmoPorSemana: (peso: string) => `${peso} a settimana`,
  ritmoAlcanca: (metaProsa: string, mes: string) => `Arrivi ai ${metaProsa} a ${mes}`,

  semRestricao: 'Nessuna',
  semRestricaoSub: 'Mangio di tutto',

  /* ============================================================
     IL PASSO DELLA SALUTE

     ⚠️ HA UN TITOLO SUO, e non la domanda secca degli altri: è l'unico
     del modulo che chiede un'AUTORIZZAZIONE invece di una risposta, e
     quello che convince qualcuno ad autorizzare non è sapere che cosa
     vogliamo — è sapere che cosa ci guadagna.
     ============================================================ */
  saudeManchete: 'Tutto quello che il tuo corpo mostra, <b>in un posto solo</b>',
  saudeLembrarTitulo: 'Una cosa in meno da ricordare',
  saudeLembrarTexto: 'Peso, sonno e allenamenti entrano da soli.',
  saudeCurvaTitulo: 'La tua curva più completa',
  saudeCurvaTexto: 'Quello che il dispositivo misura entra già qui.',
  saudeControleTitulo: 'Il controllo resta tuo',
  saudeControleTexto: 'Scegli che cosa condividere, e stacca quando vuoi.',
  saudeConectar: 'Collega i miei dati',
  /* ⚠️ "LO FARÒ DOPO", e non "adesso no". Il rifiuto che chiude la porta
     è più facile da dare di quello che rimanda — e qui rimanda davvero:
     la schermata dei Collegamenti resta nel profilo. */
  saudeDepois: 'Lo farò dopo',

  /* ============================================================
     IL MONITORAGGIO
     ============================================================ */
  sim: 'Sì',
  digiteONome: 'Scrivi il nome',
  nadaEnviado: 'Serve ad averlo sottomano lungo il tuo percorso. A questa persona non viene inviato niente.',
  vouMeTratar: 'Mi curerò con un medico o un centro',
  meAcompanha: 'Un medico o un centro segue la mia terapia',
  porContaPropria: 'No, da sola',
  porContaPropriaSub: 'Puoi aggiungerlo dopo, quando vuoi',
  quemVaiAcompanhar: 'CHI TI SEGUIRÀ (FACOLTATIVO)',
  quemAcompanha: 'CHI TI SEGUE (FACOLTATIVO)',

  /* ============================================================
     IL CONSENSO

     ⚠️ L'ETICHETTA DICE CHE COSA SIGNIFICA IL TOCCO. "Continua" sarebbe
     la persona che acconsente senza sapere di aver acconsentito — e il
     consenso per un dato sanitario deve essere un atto chiaro, non
     l'effetto collaterale di avanzare di una schermata.
     ============================================================ */
  concordarEMontar: 'Accetto e crea il mio piano',
  ficaRegistrado: 'Resta registrato con la data di oggi.',
  salvar: 'Salva',
  continuar: 'Continua',

  /* ============================================================
     L'ATTESA
     ============================================================ */
  montandoTitulo: 'Sto costruendo il tuo piano',
  faseLendo: 'Leggo le tue risposte',
  faseCalculando: 'Calcolo i tuoi obiettivi del giorno',
  faseDesenhando: 'Disegno il tuo percorso',

  /* ============================================================
     IL PIANO — che cosa sono diventate le risposte

     ⚠️⚠️ `objetivo` RESTITUISCE TRE PEZZI, e non una frase. La schermata
     mette in grassetto quello di mezzo — è il numero che la persona è
     venuta a cercare — e, se la frase arrivasse già pronta, il grassetto
     dovrebbe cadere sempre nello stesso punto. Non ci cade: l'italiano
     dice "Per perdere <b>7 kg</b> con Mounjaro®" e il tedesco "Um <b>7
     kg</b> abzunehmen mit Mounjaro®", con il verbo in fondo.

     ⚠️ IL ® SOLO DOVE È VERO. Una preparazione magistrale è una
     categoria, non un prodotto.

     ⚠️ E NESSUN NUMERO DI QUI È UNA PROMESSA. La precisazione della curva
     lo dice per iscritto, ed è la frase che in traduzione non può
     addolcirsi: la linea è la media del percorso, non una previsione di
     quello che succederà a questa persona.
     ============================================================ */
  telaPlano: {
    /* ---------- l'apertura ---------- */
    planoPronto: 'il tuo piano personalizzato è pronto!',
    manterOPeso: 'mantenere il tuo peso',
    objetivo: (perder: number, alvo: string, marca: string): [string, string, string] => [
      `Per ${perder > 0.05 ? 'perdere ' : perder < -0.05 ? 'prendere ' : ''}`,
      alvo,
      `${marca}.`,
    ],
    marcaRegistrada: (medicamento: string) => ` con ${medicamento}®`,
    marcaGenerica: (medicamento: string) => ` con ${medicamento}`,
    elaboradoPensando: 'Il tuo piano è stato costruito pensando',
    nasSuasRespostas: 'Alle tue risposte',
    emEstudos: 'Agli studi sui GLP-1',

    /* ---------- le sezioni ---------- */
    secaoMetas: 'I TUOI OBIETTIVI DEL GIORNO',
    secaoDose: 'LA TUA DOSE',
    secaoAteAMeta: 'FINO AL TUO OBIETTIVO',
    secaoCorpo: 'IL TUO CORPO',
    secaoAjuda: 'COME TI AIUTO',
    secaoCiencia: 'LA SCIENZA DIETRO IL TUO PIANO',

    /* ---------- gli obiettivi del giorno ----------

       ⚠️ DICEVA "LA PENNA TOGLIE LA FAME", e non tutte fanno la puntura
       con una penna: ci sono il flacone, la siringa e il blister. */
    proteinaPorDia: 'PROTEINE AL GIORNO',
    proteinaTexto: 'È il primo obiettivo della giornata. Il farmaco toglie la fame, e una parte del peso che scende viene dal muscolo — sono le proteine a tenere la massa magra mentre il grasso se ne va.',
    calorias: 'Calorie',
    /* Gli altri tre macro vengono da `alimentacao.tela`, dov'erano già.
       L'acqua resta qui: in `alimentacao` è un NOME DI BEVANDA, che è
       chiave di registro. */
    agua: 'Acqua',

    /* ---------- la dose ---------- */
    aindaADefinir: 'Ancora da definire',
    aindaADefinirTexto: 'Appena saprai il farmaco, costruisco io la scala delle dosi e il ciclo.',
    cicloComeca: 'Il ciclo comincia dalla prima puntura che registri.',
    cadenciaDiaria: 'tutti i giorni',
    cadenciaSemanal: 'una volta a settimana',
    cadenciaDias: (dias: number) => `ogni ${dias} giorni`,

    /* ---------- fino all'obiettivo ---------- */
    pesoAPerder: 'Peso da perdere',
    pesoAGanhar: 'Peso da prendere',
    emSemanas: (semanas: number) => `in ${semanas} settimane`,
    ressalvaDaCurva: (ritmo: string) =>
      `Il calo non è una retta: negli studi le prime settimane rendono di più e il ritmo si allenta man mano che il tuo corpo si adatta. I ${ritmo} a settimana che hai scelto sono una media su tutto il percorso, e non una previsione.`,

    /* ---------- il corpo ---------- */
    imcDeHoje: 'IMC di oggi',
    naSuaMeta: 'Al tuo obiettivo',

    /* ---------- come ti aiuto ---------- */
    ajudaDose: 'Ogni dose al posto giusto',
    ajudaDoseSub: 'la rotazione delle zone e il ciclo della dose, senza che tu conti',
    ajudaEnjoo: 'La nausea in numeri',
    ajudaEnjooSub: 'quello che senti diventa uno schema, e lo schema va alla visita',
    ajudaPeso: 'La tua curva di peso',
    ajudaPesoSub: 'ogni pesata entra nella linea, con la lettura di quello che è cambiato',
    ajudaResumo: 'Un riepilogo per la visita',
    ajudaResumoSub: 'dosi, sintomi e peso in ordine su una pagina sola',

    /* ---------- la scienza ---------- */
    feitoEmCimaDeEvidencia: 'Costruito sulle evidenze',
    evidenciaTexto: 'Gli obiettivi, la curva e le priorità di questo piano seguono linee guida di sanità pubblica e studi clinici revisati da altri ricercatori.',
    /* ⚠️ LA DIVISIONE DEL LAVORO, e non una liberatoria a piè di pagina:
       a condurre la terapia è il team di cura, e questi numeri sono un
       punto di partenza per quella conversazione. */
    rodape: 'Noi seguiamo il tuo percorso tutti i giorni e mettiamo in ordine quello che registri — ma a condurre la terapia è il tuo team di cura. Questi numeri sono un punto di partenza per quella conversazione, e non una prescrizione.',

    voltar: 'Indietro',
  },

  /* ============================================================
     LA SCHERMATA DEI TUOI DATI

     ⚠️ NON ESISTE UN SECONDO EDITOR. Ogni riga riapre la domanda
     originale della registrazione, con lo stesso metro e la stessa
     validazione — per questo questa schermata ha solo ETICHETTE, e le
     risposte arrivano tutte da un altro punto del catalogo.
     ============================================================ */
  telaDados: {
    titulo: 'I tuoi dati',
    lead: 'Sono le risposte della tua registrazione, ed è da lì che escono il tuo IMC, i tuoi obiettivi del giorno e la previsione del piano. Cambiare qualcosa qui rifà quei numeri.',

    /* ---------- la terapia ----------
       Prima perché è quello che cambia di più, e più in fretta: in una
       titolazione la dose sale ogni poche settimane. */
    tratamento: 'Terapia',
    medicamento: 'Farmaco',
    dose: 'Dose',
    doseSub: (valor: string, unidade: string) => `${valor} ${unidade}`,
    frequencia: 'Frequenza',

    /* ---------- il corpo ---------- */
    corpoERitmo: 'Corpo e ritmo',
    altura: 'Altezza',
    pesoInicial: 'Peso iniziale',
    metaDePeso: 'Obiettivo di peso',
    ritmoEscolhido: 'Ritmo scelto',
    porSemana: (peso: string) => `${peso} a settimana`,
    semPesoAPerder: 'Nessun peso da perdere',

    /* ---------- la persona ---------- */
    nome: 'Nome',
    sexo: 'Sesso',
    nascimento: 'Nascita',
    nascimentoSub: (data: string, idade: number) => `${data} · ${idade} anni`,
    atividadeFisica: 'Attività fisica',
    restricoesAlimentares: 'Restrizioni alimentari',
    oQueTeTrouxe: 'Che cosa ti ha portata qui',

    /* Il peso di oggi non sta qui di proposito: non è una risposta di
       registrazione, è un registro — cambia ogni settimana e ha una
       schermata sua. */
    rodape: 'Per registrare una pesata nuova, usa il pulsante di registrazione.',
  },
};
