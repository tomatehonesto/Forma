/* ============================================================
   I MARCATORI DEGLI ESAMI — il blocco di testo clinico più grande
   dell'app · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/marcadores.ts. Ogni marcatore ha fino
   a tre testi, e rispondono a tre domande diverse: che cosa la cosa È,
   che cosa la MUOVE, e che cosa si SA di come di solito risponde.
   Nessuno dei tre legge il risultato di chi è sulla schermata — leggere
   un risultato è di chi segue la persona.

   ⚠️⚠️ LE CHIAVI DI QUESTE TABELLE NON SI TRADUCONO. "HbA1c", "Glicemia
   jejum", "Ferritina" sono quello che resta REGISTRATO nel record
   dell'esame, in `e.marker` — non sono etichette di schermata, sono
   dato.

   ⚠️⚠️ E NON È TRADUZIONE DI ETICHETTA. Sul referto italiano le
   transaminasi si chiamano AST e ALT, come negli Stati Uniti e a
   differenza del francese (ASAT/ALAT) e del tedesco (GOT/GPT); e il T4
   libero si stampa FT4. Sono nomi diversi, non la stessa parola in
   un'altra lingua — e se sbagliati, la persona non trova la propria riga
   nel proprio esame. Questa scelta è di letteratura e resta in attesa di
   revisione da parte di chi esercita in Italia: vedi PENDENCIAS, voce
   20.

   ⚠️ E NESSUNO DI QUESTI TESTI PUÒ DIVENTARE UNA CONDOTTA IN TRADUZIONE.
   I blocchi sono scritti in ogni sezione qui sotto, e non sono
   preferenze di stile: sono quello che separa un'app che spiega da una
   che prescrive.
   ============================================================ */

export type SobreOMarcador = { oQueE: string; porQue: string; afeta: string };

/* ============================================================
   IL NOME CHE COMPARE SULLA SCHERMATA

   ⚠️ E CHI NON È QUI COMPARE CON LA PROPRIA CHIAVE. È la stessa regola
   di `siteLabel`: un registro vecchio non sparisce dalla schermata per
   colpa di una tabella che non lo conosce.
   ============================================================ */
const NOME: Record<string, string> = {
  'HbA1c': 'HbA1c',
  'Glicemia jejum': 'Glicemia a digiuno',
  'Insulina': 'Insulina',
  'Colesterol total': 'Colesterolo totale',
  'HDL': 'HDL',
  'LDL': 'LDL',
  'Triglicerídeos': 'Trigliceridi',
  'Creatinina': 'Creatinina',
  'TGO': 'AST',
  'TGP': 'ALT',
  'TSH': 'TSH',
  'T4 livre': 'FT4',
  'Vitamina D': 'Vitamina D',
  'Vitamina B12': 'Vitamina B12',
  'Ferritina': 'Ferritina',
};

/* ⚠️ LA MAIUSCOLA IN MEZZO ALLA FRASE È REGOLA DI LINGUA, e stava in
   derive come un'espressione regolare con dentro gli accenti del
   portoghese. "Vitamina D" diventa "vitamina D" in mezzo a una frase, ma
   "HbA1c", "HDL", "AST" e "FT4" restano come sono: cade solo la
   maiuscola di chi ha la PRIMA PAROLA intera in minuscolo dopo
   l'iniziale, che è il disegno di un nome comune e non di una sigla.

   ⚠️ E GLI ACCENTI SONO QUELLI DELL'ITALIANO, non quelli del portoghese:
   àèéìíîòóùú in minuscolo, ÀÈÉÌÍÎÒÓÙÚ in maiuscolo. Copiare la classe di
   caratteri portoghese avrebbe funzionato per caso su questi quindici
   marcatori, e avrebbe sbagliato in silenzio sul primo nome italiano con
   un accento. */
const NO_MEIO = (nome: string) => {
  const p1 = nome.split(' ')[0];
  return /^[A-ZÀÈÉÌÍÎÒÓÙÚ][a-zàèéìíîòóùú]+$/.test(p1) ? nome[0].toLowerCase() + nome.slice(1) : nome;
};

/* ============================================================
   CHE COS'È IL MARCATORE — e non che cosa vuole dire il TUO risultato

   ⚠️ SONO DUE DOMANDE DIVERSE, e l'app rispondeva a tutte e due con lo
   stesso paragrafo. "Che cos'è l'HbA1c" è una definizione: vale per
   chiunque, con qualsiasi risultato, e non invecchia.

   ⚠️ E NESSUNA DICE SE VA BENE. Una definizione che lascia intendere una
   diagnosi è una diagnosi travestita da glossario.

   ⚠️ `afeta` È UN COMPLEMENTO, E NON UNA FRASE. Entra sempre dopo un
   verbo che porta già la precisazione — "fa differenza…", "è un buon
   segno…" — e per questo comincia dalla preposizione: scritto come frase
   intera, ogni marcatore dovrebbe concordare in genere con il proprio
   nome, e "La tua HbA1c" / "Il tuo ferritina" è il tipo di errore che si
   vede solo in produzione.

   ⚠️ E NOMINA QUELLO CHE È IN GIOCO, NON QUELLO CHE SUCCEDERÀ. "per la
   salute delle arterie negli anni" è il territorio; "può otturare le
   arterie" sarebbe una prognosi, che è del medico.
   ============================================================ */
const SOBRE = {
  /* ⚠️ NESSUNA DEFINIZIONE CITA UN ALTRO MARCATORE NÉ UN TERMINE DI
     REFERTO. La regola: se la frase ha bisogno di una seconda frase per
     essere capita, non è una definizione, è una voce di enciclopedia. */
  'HbA1c': {
    oQueE: 'Quanto zucchero è rimasto attaccato ai globuli rossi del sangue.',
    porQue: 'Siccome quei globuli vivono circa tre mesi, il risultato racconta la media dello zucchero in quel periodo, e non solo quella del giorno del prelievo.',
    afeta: 'per il controllo dello zucchero lungo i mesi',
  },
  'Glicemia jejum': {
    oQueE: 'La quantità di zucchero nel sangue dopo ore senza mangiare.',
    porQue: 'È la misura più diretta di come il corpo gestisce il glucosio a riposo.',
    afeta: 'per come il corpo gestisce lo zucchero',
  },
  'Insulina': {
    oQueE: 'L’ormone che fa uscire lo zucchero dal sangue e lo fa entrare nelle cellule.',
    porQue: 'Quando è alta, di solito è il segno che il corpo deve produrne di più per fare lo stesso lavoro.',
    afeta: 'per lo sforzo del corpo nel tenere in ordine lo zucchero',
  },
  'Colesterol total': {
    oQueE: 'Tutto il colesterolo che circola nel tuo sangue, sommato.',
    porQue: 'Da solo dice poco, perché mette in un conto unico tipi di colesterolo che nel corpo fanno cose opposte.',
    afeta: 'per la salute delle arterie negli anni',
  },
  'HDL': {
    oQueE: 'Il colesterolo che fa le pulizie: raccoglie il grasso dalle arterie e se lo porta via.',
    porQue: 'È l’unico esame del colesterolo in cui un numero più alto è la buona notizia.',
    afeta: 'per la pulizia del grasso dalle arterie',
  },
  'LDL': {
    oQueE: 'Il colesterolo che porta il grasso ai tessuti del corpo.',
    porQue: 'In eccesso, è quello che negli anni si accumula sulla parete delle arterie.',
    afeta: 'per la salute delle arterie negli anni',
  },
  'Triglicerídeos': {
    oQueE: 'Il grasso che circola nel sangue e che arriva dal cibo e dal fegato.',
    porQue: 'Risponde in fretta a quello che si mangia e al peso, e per questo è di solito il primo a muoversi in una terapia.',
    afeta: 'per il grasso nel sangue e per il cuore',
  },
  'Creatinina': {
    oQueE: 'Uno scarto che il muscolo produce di continuo e che il rene butta fuori.',
    porQue: 'Siccome a toglierla dal sangue è il rene, quanta ne resta lì è uno dei modi per vedere se ce la sta facendo.',
    afeta: 'per il lavoro dei reni',
  },
  'TGO': {
    oQueE: 'Una sostanza custodita dentro le cellule del fegato e del muscolo.',
    porQue: 'Compare nel sangue solo quando quelle cellule si rompono — per questo serve da avviso che qualcosa sta irritando il fegato.',
    afeta: 'per la salute del fegato',
  },
  'TGP': {
    oQueE: 'Una sostanza custodita quasi solo dentro le cellule del fegato.',
    porQue: 'Siccome quasi non esiste altrove nel corpo, quando compare nel sangue l’indirizzo è molto più sicuro.',
    afeta: 'per la salute del fegato',
  },
  'TSH': {
    oQueE: 'Il messaggio che il cervello manda alla tiroide per chiederle di lavorare.',
    porQue: 'Sale quando la tiroide è lenta e scende quando è accelerata — è il termostato, non la temperatura.',
    afeta: 'per il ritmo del metabolismo',
  },
  'T4 livre': {
    oQueE: 'L’ormone che la tiroide produce, nella parte che il corpo riesce a usare.',
    porQue: 'Mostra quello che la tiroide sta davvero consegnando, ed è per questo che arriva sempre in coppia con l’esame precedente.',
    afeta: 'per il ritmo del metabolismo',
  },
  'Vitamina D': {
    oQueE: 'La vitamina che il corpo produce con il sole e assorbe dal cibo.',
    porQue: 'Partecipa all’assorbimento del calcio e al funzionamento del muscolo e delle difese.',
    afeta: 'per ossa, muscolo e difese',
  },
  'Vitamina B12': {
    oQueE: 'Una vitamina che arriva da alimenti di origine animale.',
    porQue: 'Serve ai globuli rossi e ai nervi, e chi ne mangia meno di solito la tiene d’occhio.',
    afeta: 'per i nervi e la produzione del sangue',
  },
  'Ferritina': {
    oQueE: 'La dispensa di ferro del corpo — quello che resta custodito dentro le cellule.',
    porQue: 'Per questo mostra la scorta, e non il ferro che sta circolando nel sangue oggi.',
    afeta: 'per la scorta di ferro, che sostiene le forze',
  },
} satisfies Record<string, SobreOMarcador>;

/* ============================================================
   CHE COSA MUOVE QUESTO NUMERO

   ⚠️ È LA PARTE CHE TRASFORMA L'ESAME IN QUALCOSA DI COMPRENSIBILE.
   Sapere che la ferritina è la scorta di ferro aiuta a leggere la
   parola. Non aiuta a capire perché sia cambiata — e "perché è
   cambiata" è la domanda che la persona si porta dalla schermata alla
   vita.

   ⚠️ E NESSUNA VOCE DICE CHE COSA FARE. "Alcol nei giorni precedenti" è
   un fatto sul marcatore; "smetti di bere" sarebbe una condotta, e la
   condotta è di chi segue la persona.

   ⚠️ SONO CAUSE COMUNI, E NON L'ELENCO COMPLETO.
   ============================================================ */
const INFLUENCIAS = {
  'HbA1c': [
    'La media del glucosio degli ultimi due o tre mesi, e non quello che hai mangiato ieri',
    'Anemia e malattie del sangue, che cambiano la vita dei globuli rossi e distorcono il risultato',
    'La perdita di peso e i farmaci per la glicemia, che di solito la abbassano lungo i mesi',
  ],
  'Glicemia jejum': [
    'Quante ore di digiuno prima del prelievo',
    'Sonno storto e stress la sera prima, che alzano lo zucchero del mattino',
    'Movimento e perdita di peso, che tendono ad abbassarla',
  ],
  'Insulina': [
    'Il digiuno prima del prelievo, tanto quanto per la glicemia',
    'La quantità di massa grassa, che è quello che pesa di più sul conto',
    'Si legge di solito insieme alla glicemia, e non da sola',
  ],
  'Colesterol total': [
    'Quanto grasso si mangia, ma meno di quanto la fama suggerisca',
    'La genetica — alcune famiglie producono più colesterolo a prescindere dalla dieta',
    'Una tiroide lenta, che lo alza senza c’entrare niente con il cibo',
  ],
  'HDL': [
    'Il movimento aerobico regolare, che è quello che lo alza di più',
    'Il fumo, che lo riduce',
    'La genetica, che su questo in particolare pesa molto',
  ],
  'LDL': [
    'I grassi saturi e trans nell’alimentazione',
    'La perdita di peso, che di solito lo riduce insieme ai trigliceridi',
    'La genetica, che in alcune famiglie domina il risultato',
  ],
  'Triglicerídeos': [
    'Il digiuno — mangiare vicino al prelievo cambia molto, più che per qualsiasi altro del pannello',
    'L’alcol nei giorni precedenti',
    'Zucchero e farina in eccesso, che il corpo converte in grasso',
  ],
  'Creatinina': [
    'Quanta massa muscolare ha la persona, perché arriva dal muscolo',
    'L’idratazione il giorno del prelievo',
    'Un allenamento pesante la sera prima, che può alzarla per un po’',
  ],
  'TGO': [
    'Il movimento intenso nei giorni precedenti, perché esiste anche nel muscolo',
    'L’alcol',
    'Il grasso nel fegato, comune in chi ha un peso in eccesso',
  ],
  'TGP': [
    'Il grasso nel fegato, che è la causa più comune di un’alterazione lieve',
    'L’alcol e alcuni farmaci',
    'La perdita di peso, che di solito la riduce lungo i mesi',
  ],
  'TSH': [
    'L’ora del prelievo — è più alto di notte e a inizio mattina',
    'Malattie acute e alcuni farmaci',
    'La terapia con ormone tiroideo, quando c’è',
  ],
  'T4 livre': [
    'Il funzionamento della tiroide, letto sempre insieme al TSH',
    'La gravidanza e gli estrogeni, che cambiano le proteine che lo trasportano',
  ],
  'Vitamina D': [
    'Il sole sulla pelle — quantità, orario e quanta parte del corpo resta esposta',
    'La pelle più scura e la protezione solare, che riducono la produzione',
    'L’integrazione, quando c’è',
    'La stagione: l’inverno di solito la fa scendere',
  ],
  'Vitamina B12': [
    'Gli alimenti di origine animale nella dieta',
    'La chirurgia bariatrica e alcuni farmaci per lo stomaco, che riducono l’assorbimento',
    'L’integrazione, quando c’è',
  ],
  'Ferritina': [
    'La scorta di ferro del corpo',
    'Infiammazione e infezione, che la alzano anche senza ferro in più — per questo non si legge mai da sola',
    'Un ciclo abbondante, che nel tempo riduce la scorta',
  ],
} satisfies Record<string, string[]>;

/* ============================================================
   CHE COSA DI SOLITO AIUTA

   ⚠️ QUESTA È LA PARTE PERICOLOSA DEL FILE, E HA QUATTRO BLOCCHI.

   1. NIENTE QUI RIGUARDA I FARMACI. Nessuna voce dice di cominciare,
      smettere, aumentare o ridurre — e dove l'argomento è
      l'integrazione, la frase dice "quando la indica chi ti segue".

   2. NIENTE QUI HA UNA DOSE, UNA QUANTITÀ O UN TEMPO. "L'esposizione al
      sole è la fonte principale" è informazione; "venti minuti al
      giorno" è una ricetta, e una ricetta deve venire da qualcuno che
      abbia visitato la persona.

   3. NIENTE QUI PROMETTE UN RISULTATO.

   4. NIENTE QUI RIGUARDA LA TIROIDE NÉ IL RENE. TSH, FT4 e creatinina
      sono rimasti fuori di proposito: nel primo caso a muovere il numero
      è un farmaco, nel secondo i consigli più ovvi (bere acqua, mangiare
      proteine) sono proprio quelli che una persona con un rene
      malandato non deve seguire per conto suo.
   ============================================================ */
export type JeitoDeAjudar = { grupo: string; itens: { nome: string; detalhe: string }[] };

const AJUDAR = {
  'HbA1c': [
    {
      grupo: 'Nel cibo',
      itens: [
        { nome: 'Carboidrati ad assorbimento lento', detalhe: 'Cereali integrali, legumi e verdure alzano il glucosio più piano della farina bianca e dello zucchero' },
        { nome: 'Proteine e fibre nello stesso pasto', detalhe: 'Riducono il picco di glucosio di quello che si mangia insieme' },
      ],
    },
    {
      grupo: 'Nel movimento',
      itens: [
        { nome: 'Camminare dopo mangiato', detalhe: 'Un muscolo in attività consuma glucosio senza dipendere dall’insulina' },
        { nome: 'Movimento regolare', detalhe: 'Migliora la sensibilità all’insulina, e l’effetto si accumula lungo le settimane' },
      ],
    },
  ],
  'Glicemia jejum': [
    {
      grupo: 'Nella routine',
      itens: [
        { nome: 'Il sonno', detalhe: 'Le notti corte alzano il glucosio della mattina dopo' },
        { nome: 'L’ultimo pasto più presto', detalhe: 'Mangiare molto vicino all’ora di dormire di solito si vede nel digiuno del giorno dopo' },
      ],
    },
    {
      grupo: 'Nel movimento',
      itens: [
        { nome: 'Attività aerobica', detalhe: 'Riduce la glicemia a digiuno lungo le settimane, non lungo i giorni' },
      ],
    },
  ],
  'Insulina': [
    {
      grupo: 'Nel peso e nel movimento',
      itens: [
        { nome: 'Ridurre la massa grassa', detalhe: 'È quello che riduce di più l’insulina necessaria per lo stesso lavoro' },
        { nome: 'Allenamento di forza', detalhe: 'Più massa muscolare vuol dire più posto dove il glucosio può andare' },
      ],
    },
  ],
  'Colesterol total': [
    {
      grupo: 'Nel cibo',
      itens: [
        { nome: 'Meno grassi saturi e trans', detalhe: 'Fritti, salumi e prodotti industriali sono le fonti più comuni' },
        { nome: 'Fibre solubili', detalhe: 'Avena, legumi e frutta riducono l’assorbimento del colesterolo nell’intestino' },
      ],
    },
  ],
  'HDL': [
    {
      grupo: 'Nel movimento',
      itens: [
        { nome: 'Attività aerobica', detalhe: 'È quella che alza di più l’HDL, e l’effetto dipende dalla regolarità' },
      ],
    },
    {
      grupo: 'Nel cibo',
      itens: [
        { nome: 'Grassi buoni', detalhe: 'Olio d’oliva, avocado, frutta secca e pesce grasso' },
      ],
    },
  ],
  'LDL': [
    {
      grupo: 'Nel cibo',
      itens: [
        { nome: 'Meno grassi saturi', detalhe: 'Sono quelli che alzano di più l’LDL — carni grasse, latticini interi, fritti' },
        { nome: 'Fibre solubili', detalhe: 'Avena, fagioli, lenticchie e frutta con la buccia' },
      ],
    },
    {
      grupo: 'Nel peso',
      itens: [
        { nome: 'Perdita di peso', detalhe: 'Di solito riduce LDL e trigliceridi insieme' },
      ],
    },
  ],
  'Triglicerídeos': [
    {
      grupo: 'Nel cibo',
      itens: [
        { nome: 'Meno zucchero e farina', detalhe: 'L’eccesso diventa grasso nel fegato, ed è quello che alza di più questo marcatore' },
        { nome: 'L’alcol', detalhe: 'È la singola causa più comune di trigliceridi alti' },
      ],
    },
    {
      grupo: 'Nel movimento',
      itens: [
        { nome: 'Attività aerobica', detalhe: 'I trigliceridi sono fra i marcatori che rispondono più in fretta' },
      ],
    },
  ],
  'TGO': [
    {
      grupo: 'Nel fegato',
      itens: [
        { nome: 'L’alcol', detalhe: 'È la causa più comune di alterazione di tutte e due le transaminasi' },
        { nome: 'Perdita di peso', detalhe: 'Riduce il grasso nel fegato, che è l’altra causa comune' },
      ],
    },
  ],
  'TGP': [
    {
      grupo: 'Nel fegato',
      itens: [
        { nome: 'Perdita di peso', detalhe: 'Il grasso nel fegato è la causa più comune di un’alterazione lieve, e risponde al peso' },
        { nome: 'L’alcol', detalhe: 'Sparisce dal conto quando sparisce dalla routine' },
      ],
    },
  ],
  'Vitamina D': [
    {
      grupo: 'Nel sole',
      itens: [
        { nome: 'Esporre la pelle', detalhe: 'È la fonte principale — la protezione solare e i vestiti che coprono riducono la produzione' },
      ],
    },
    {
      grupo: 'Nel cibo e nell’integrazione',
      itens: [
        { nome: 'Pesce grasso, tuorlo e funghi', detalhe: 'Sono le fonti alimentari, e da sole di solito non bastano' },
        { nome: 'Integrazione', detalhe: 'Quando la indica chi ti segue — la dose dipende dal tuo livello' },
      ],
    },
  ],
  'Vitamina B12': [
    {
      grupo: 'Nel cibo',
      itens: [
        { nome: 'Origine animale', detalhe: 'Carne, uova, latte e derivati sono le uniche fonti naturali' },
      ],
    },
    {
      grupo: 'Nell’assorbimento',
      itens: [
        { nome: 'Farmaci per lo stomaco', detalhe: 'Un uso prolungato riduce l’assorbimento — argomento da portare alla visita' },
        { nome: 'Integrazione', detalhe: 'Quando la indica chi ti segue, soprattutto dopo una chirurgia bariatrica' },
      ],
    },
  ],
  'Ferritina': [
    {
      grupo: 'Nel cibo',
      itens: [
        { nome: 'Ferro di origine animale', detalhe: 'Carne rossa, fegato e frutti di mare sono i più assorbiti' },
        { nome: 'Vitamina C insieme', detalhe: 'Arance, kiwi e peperoni migliorano l’assorbimento del ferro dei vegetali' },
        { nome: 'Caffè e tè lontano dai pasti', detalhe: 'Disturbano l’assorbimento quando si bevono insieme' },
      ],
    },
  ],
} satisfies Record<string, JeitoDeAjudar[]>;

export const marcadores = {
  /* ---------- le categorie ---------- */
  /* Sono le uniche etichette di schermata di questo file, e per questo le
     uniche che si traducono senza riserve. QUALI marcatori entrino in
     ogni categoria non è una decisione di lingua — è contenuto clinico, e
     sta in logic/derive accanto alle chiavi. */
  catMetabolico: 'Metabolico',
  catLipidico: 'Lipidico',
  catFigadoRim: 'Fegato e reni',
  catTireoide: 'Tiroide',
  catVitaminas: 'Vitamine',

  nome: NOME,
  noMeio: NO_MEIO,
  sobre: SOBRE,
  influencias: INFLUENCIAS,
  ajudar: AJUDAR,
};
