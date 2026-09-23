/* ============================================================
   GLI OBIETTIVI — i numeri che l'app chiede e quelli che sa solo la
   persona · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/metas.ts. Qui abitano tre cataloghi
   diversi: i BERSAGLI (i quattro numeri del profilo), gli INDICATORI
   (quello che l'app sa contare) e i PERSONALI (quello che solo la
   persona sa dire quando è arrivato).

   ⚠️ I PERSONALI SONO CATEGORIE E NON FRASI GIÀ PRONTE. L'elenco dice di
   CHE cosa si tratta, e la domanda del secondo tocco è quella che lo
   rende suo. Chi traduce deve tenere tutti e due i pezzi: il nome corto
   per l'elenco e la domanda che costringe a precisare.

   ⚠️ E IL PREFISSO È QUELLO CHE CHIUDE LA FRASE. La persona scrive un
   pezzo — "pallavolo", "il vestito del matrimonio" — e il `monta`
   restituisce la frase intera.

   ⚠️ NESSUNA CATEGORIA DÀ PER SCONTATI UNA FAMIGLIA, UN CORPO O DEI
   SOLDI. Un obiettivo che non sta nella vita di chi legge è peggio di un
   campo vuoto.
   ============================================================ */

export const metas = {
  /* ============================================================
     I BERSAGLI — i quattro numeri che l'app chiede
     ============================================================ */
  alvos: {
    /* ⚠️ ERA LA STESSA FRASE SCRITTA TRE VOLTE, una per ognuno dei numeri
       del giorno. Quello che fa: dice quello che la persona non può
       sapere guardando il foglio. Abbassare l'obiettivo di proteine fa sì
       che il protocollo del team segni "fatto" senza che sia cambiato
       niente nel piatto. Non blocca e non giudica. */
    ressalvaDoProtocolo: 'Il protocollo della settimana conta i giorni in cui hai raggiunto questo numero. Cambiandolo qui, cambia anche quello che il protocollo del tuo team considera fatto.',

    prot: {
      nome: 'Proteine al giorno',
      onde: 'Chieste nell’alimentazione e nel protocollo',
      origem: 'Calcolato dal tuo peso, a 1,2 g per chilo',
      un: 'g',
      escreve: (gramas: number) => String(gramas),
    },
    waterMl: {
      nome: 'Idratazione al giorno',
      origem: 'Calcolato dal tuo peso, dalla tua età e dal tuo livello di attività',
      onde: 'Chiesta nell’idratazione e nel protocollo',
    },
    exercMin: {
      nome: 'Movimento al giorno',
      onde: 'È la linea tratteggiata della settimana, nel movimento',
      /* ⚠️ QUESTO NON È CALCOLATO, e sarebbe facile scrivere che lo è per
         far venire la frase uguale alle altre due. Sono 60 minuti per
         tutte, e la registrazione non chiede niente che li cambierebbe. */
      origem: 'Lo standard dell’app, uguale per tutte',
      un: 'min',
      escreve: (minutos: number) => String(minutos),
    },
    peso: {
      /* ⚠️ LO STESSO NOME DELLA REGISTRAZIONE. La domanda lì è "qual è il
         tuo obiettivo di peso?", e qui il campo si chiamava "peso di
         riferimento" — due nomi per lo stesso numero. */
      nome: 'Obiettivo di peso',
      onde: 'Misura tutto il viaggio, nel Percorso',
      /* L'unico dei quattro che la persona ha scelto davvero. */
      origem: 'L’hai scelto tu in registrazione',
    },
  },

  /* ============================================================
     GLI INDICATORI — quello che l'app sa contare

     ⚠️ IL NOME NELL'ELENCO È GENERICO DI PROPOSITO: "Ore di sonno", e non
     "Dormire 7h+". Scegliere la cosa e scegliere il numero sono due
     decisioni, e la seconda è quella personale.

     ⚠️ `origem` DICE DA DOVE ESCE IL NUMERO, ed è quello che decide se
     valga la pena creare l'obiettivo: chi non registra mai un pasto deve
     vedere, prima di scegliere, che l'obiettivo di proteine resterà fermo
     a zero.

     ⚠️⚠️ `nomes` È QUELLO CHE SI CONTA, al singolare e al plurale, e
     `femininas` è il suo accordo. In italiano il participio concorda come
     in portoghese: senza questa coppia, "11 di 13 notti registrate"
     uscirebbe come "registrati". Era fatto confrontando la parola con
     "noite" — cosa che si rompe in silenzio il giorno in cui entra un
     indicatore femminile nuovo.
     ============================================================ */
  indicadores: {
    sono: {
      nome: 'Ore di sonno',
      pergunta: 'Quante ore a notte?',
      origem: 'Dal sonno che rispondi nel check-in',
      nomes: ['notte', 'notti'] as [string, string],
      femininas: true,
      un: 'h',
      escreve: (horas: number) => `${horas} h`,
      rotulo: (horas: number) => `Dormire ${horas}h a notte`,
      conta: (horas: number) => `Notti con ${horas}h o più`,
    },
    energia: {
      nome: 'Energia nella giornata',
      pergunta: 'Da che livello in su conta?',
      origem: 'Dall’energia che rispondi nel check-in',
      nomes: ['giorno', 'giorni'] as [string, string],
      femininas: false,
      un: 'su 5',
      escreve: (nivel: number) => `${nivel} su 5`,
      rotulo: (nivel: number) => `Energia ${nivel} o più`,
      conta: (nivel: number) => `Giorni con energia ${nivel} o più, da 1 a 5`,
    },
    humor: {
      nome: 'Umore nella giornata',
      pergunta: 'Da che livello in su conta?',
      origem: 'Dall’umore che rispondi nel check-in',
      nomes: ['giorno', 'giorni'] as [string, string],
      femininas: false,
      un: 'su 5',
      escreve: (nivel: number) => `${nivel} su 5`,
      rotulo: (nivel: number) => `Umore ${nivel} o più`,
      conta: (nivel: number) => `Giorni con umore ${nivel} o più, da 1 a 5`,
    },
    /* ⚠️ NAUSEA E FAME CONTANO AL CONTRARIO: il successo è il giorno in
       cui il numero è stato BASSO, e per questo la domanda è "fino a che
       livello conta ancora come buono". Cambiarla in "da che livello in
       su" ribalta tutto l'obiettivo senza che niente lo denunci. */
    enjoo: {
      nome: 'Nausea',
      pergunta: 'Fino a che livello conta ancora come buono?',
      origem: 'Dalla nausea che segni nel check-in',
      nomes: ['giorno', 'giorni'] as [string, string],
      femininas: false,
      un: 'su 5',
      escreve: (nivel: number) => `${nivel} su 5`,
      rotulo: (nivel: number) => `Nausea ${nivel} o meno`,
      conta: (nivel: number) => `Giorni con nausea ${nivel} o meno, da 1 a 5`,
    },
    fome: {
      nome: 'Fame',
      pergunta: 'Fino a che livello conta ancora come buono?',
      origem: 'Dalla fame che rispondi nel check-in',
      nomes: ['giorno', 'giorni'] as [string, string],
      femininas: false,
      un: 'su 5',
      escreve: (nivel: number) => `${nivel} su 5`,
      rotulo: (nivel: number) => `Fame ${nivel} o meno`,
      conta: (nivel: number) => `Giorni con fame ${nivel} o meno, da 1 a 5`,
    },
    prot: {
      nome: 'Proteine al giorno',
      pergunta: 'Quanti grammi al giorno?',
      origem: 'Dai pasti che registri',
      nomes: ['giorno', 'giorni'] as [string, string],
      femininas: false,
      escreve: (gramas: number) => `${gramas} g`,
      rotulo: (gramas: number) => `Mangiare ${gramas} g di proteine`,
      conta: (gramas: number) => `Giorni con ${gramas} g o più`,
    },
    /* I tre qui sotto ricevono la quantità GIÀ SCRITTA — "2,5 L", "85 fl
       oz" — perché l'unità è una decisione di logic/medidas e non di
       lingua. Qui entra solo la frase intorno. */
    agua: {
      nome: 'Idratazione al giorno',
      pergunta: 'Quanto al giorno?',
      origem: 'Da quello che registri nell’idratazione',
      nomes: ['giorno', 'giorni'] as [string, string],
      femininas: false,
      rotulo: (quanto: string) => `Bere ${quanto} d’acqua`,
      conta: (quanto: string) => `Giorni con ${quanto} o più`,
    },
    exerc: {
      nome: 'Minuti di movimento',
      pergunta: 'Quanti minuti al giorno?',
      origem: 'Dagli allenamenti che registri',
      nomes: ['giorno', 'giorni'] as [string, string],
      femininas: false,
      escreve: (minutos: number) => `${minutos} min`,
      rotulo: (minutos: number) => `Muoversi ${minutos} min al giorno`,
      conta: (minutos: number) => `Giorni con ${minutos} min o più`,
    },
  },

  /* ============================================================
     GLI OBIETTIVI PERSONALI — quello che l'app non misura

     ⚠️ IL TEMPO VERBALE STAVA SCEGLIENDO LA VITA DELLA PERSONA, ed è
     stato sistemato. "Tornare a praticare" dà per scontato che abbia
     praticato; chi vuole cominciare a nuotare a quarant'anni non stava in
     nessuna categoria. Le frasi neutre restano neutre.

     L'unica che continua a dare per scontato è quella del luogo — e lo
     DICE nel proprio nome, che è la differenza fra dare per scontato e
     chiedere.

     ⚠️ GLI ESEMPI STANNO NELLA DOMANDA, MAI NEL SUGGERIMENTO DEL CAMPO.
     Un esempio dentro un campo è una proposta: chi ne legge uno prima di
     pensare al proprio obiettivo scrive l'obiettivo dell'esempio.
     ============================================================ */
  pessoais: {
    roupa: {
      nome: 'Un capo da indossare',
      pergunta: 'Che cosa vuoi indossare? Quello in fondo all’armadio, uno visto in vetrina — quello che ti viene in mente.',
      dica: 'Scrivi il capo',
      monta: (r: string) => `Indossare ${r}`,
    },
    esporte: {
      nome: 'Uno sport',
      pergunta: 'Che sport vuoi fare? Vale sia quello che hai già fatto sia quello che non hai mai provato.',
      dica: 'Scrivi lo sport',
      monta: (r: string) => `Fare ${r}`,
    },
    folego: {
      /* "Qualcosa di tutti i giorni", e non "senza restare senza fiato":
         la barriera può essere il ginocchio, può essere il dolore, può
         essere la vergogna — e nominare quella sbagliata esclude chi ha
         l'altra. */
      nome: 'Qualcosa di tutti i giorni',
      pergunta: 'Che cosa vuoi riuscire a fare senza stancarti? Salire le scale di casa, portare la spesa, arrivare fino all’angolo senza fermarti a metà.',
      dica: 'Scrivi l’attività',
      monta: (r: string) => `Riuscire a ${r}`,
    },
    sentir: {
      nome: 'Come mi sento',
      pergunta: 'Come vuoi sentirti? Con più forze, più a tuo agio nel tuo corpo — come ha senso per te.',
      dica: 'Scrivi come vuoi sentirti',
      monta: (r: string) => `Sentirmi ${r}`,
    },
    foto: {
      nome: 'Una foto',
      pergunta: 'Che foto vuoi avere? Una al mare, una con chi ami, o semplicemente una in cui ti riconosci.',
      dica: 'Scrivi la foto',
      monta: (r: string) => `Fare ${r}`,
    },
    lugar: {
      /* ⚠️ IL NOME DICE LA PRESUPPOSIZIONE, ed è l'unica rimasta. Qui è
         l'argomento: non si tratta di farcela, si tratta di tornare — chi
         smette di andare al mare raramente ha smesso perché non ce la
         faceva. Chi vuole un posto nuovo ha "Un altro obiettivo". */
      nome: 'Un posto che hai smesso di frequentare',
      pergunta: 'Dove vuoi tornare? Il mare, la piscina, la festa di qualcuno — il posto che stai lasciando da parte.',
      dica: 'Scrivi il posto',
      monta: (r: string) => `Tornare ${r}`,
    },
    comecar: {
      nome: 'Un’abitudine da prendere',
      pergunta: 'Che cosa vuoi cominciare a fare? Camminare la mattina, cucinare la domenica, andare a letto prima.',
      dica: 'Scrivi l’abitudine',
      monta: (r: string) => `Cominciare a ${r}`,
    },
    largar: {
      nome: 'Un’abitudine da lasciare',
      pergunta: 'Che cosa vuoi smettere di fare? Mangiare in piedi, spiluccare di notte — quello che vale per te.',
      dica: 'Scrivi l’abitudine',
      monta: (r: string) => `Smettere di ${r}`,
    },
    /* L'uscita per quello che non sta in nessuna categoria — uguale alle
       altre, solo senza prefisso: qui la frase intera è di chi scrive. */
    livre: {
      nome: 'Un altro obiettivo',
      pergunta: 'Che cosa vuoi riuscire a fare? Scrivilo a modo tuo — lo teniamo esattamente come lo scrivi.',
      dica: 'Scrivi il tuo obiettivo',
      monta: (r: string) => r,
    },
  },

  /* ============================================================
     LE SCADENZE — relative, e davvero facoltative

     Chi mette una scadenza a un obiettivo di terapia pensa "fra tre
     mesi", non al 14 dicembre. E la prima opzione è NON avere una
     scadenza, già selezionata.
     ============================================================ */
  prazos: {
    nao: 'Senza scadenza',
    umMes: 'Fra 1 mese',
    tresMeses: 'Fra 3 mesi',
    seisMeses: 'Fra 6 mesi',
    umAno: 'Fra 1 anno',
  },

  /* ============================================================
     LA RIGA DI OGNI OBIETTIVO, NEL PERCORSO
     ============================================================ */
  jornada: {
    /* ⚠️ IL CONTO, E NON DI NUOVO LA PERCENTUALE. La riga diceva "85%" a
       destra e "85% delle notti recenti" sotto — lo stesso numero due
       volte. "11 di 13 notti" risponde di quante notti stiamo parlando. */
    contagem: (quantas: number, de: number, nome: string, femininas: boolean) =>
      `${quantas} di ${de} ${nome} ${femininas ? 'registrate' : 'registrati'}`,
    /* ⚠️ RICEVE LO STESSO `femininas` DEL CONTO QUI SOPRA, ed è per questo
       che la riga esiste così. Il femminile era scritto fisso —
       "registrate" — in una frase che riceve il plurale di otto
       indicatori: sette di loro sono "giorni". */
    semRegistros: (plural: string, femininas: boolean) =>
      `ancora ${femininas ? 'nessuna' : 'nessun'} ${plural === 'notti' ? 'notte' : plural === 'giorni' ? 'giorno' : plural} ${femininas ? 'registrata' : 'registrato'}`,

    /* Il personale non ha una frazione: ha la data, che è la parte del
       traguardo che si racconta a qualcuno. */
    conquistadaEm: (data: string) => `raggiunto il ${data}`,
    /* ⚠️ LA SCADENZA È UN FATTO, NON UN RIMPROVERO. Passata e non
       raggiunta, la riga dice che è passata e si ferma lì — senza rosso e
       senza "in ritardo". In una terapia di mesi una data che slitta è la
       cosa più comune del mondo. */
    ate: (data: string) => `entro il ${data}`,
    oPrazoEra: (data: string) => `la scadenza era il ${data}`,
    vocemarca: 'lo segni tu quando arriva',
  },

  /* ============================================================
     LE DUE SCHERMATE DI OBIETTIVO — l'elenco e il foglio

     ⚠️ ERANO NEL CODICE, ed è stato il tedesco a denunciarlo: l'elenco
     apriva "Metas" e "Os números do dia" in portoghese accanto a
     "Zielgewicht" ed "Eiweiß pro Tag", che venivano già da qui. Mezza
     schermata tradotta è peggio di nessuna — la persona conclude che
     l'app è rotta.

     ⚠️ TRE MODI ABITANO LO STESSO FOGLIO, e per questo i nomi delle
     chiavi dicono quale: `alvo` è uno dei quattro numeri, `nova` è creare
     un obiettivo personale, e `uma` è aprire un obiettivo dell'elenco.
     ============================================================ */
  tela: {
    /* ---------- l'elenco ---------- */
    titulo: 'Obiettivi',
    progresso: (perdido: string, total: string, alvo: string) => `${perdido} di ${total} fino a ${alvo}`,
    novaMeta: 'Nuovo obiettivo',

    numerosTitulo: 'I numeri del giorno',
    numerosNota: 'È quello che chiedono le schermate di acqua, alimentazione e movimento, ed è quello che il protocollo conta.',

    /* ⚠️ L'ETICHETTA DICE DI CHI È IL NUMERO, e sono tre stati. Il terzo è
       quello che conta: quando la persona CAMBIA un numero che il team
       aveva definito, l'etichetta non sparisce e non mente — passa a dire
       che è stato modificato. Può cambiarlo, è il suo corpo; quello che
       l'app non fa è nascondere che è cambiato.

       ⚠️ E "TRAMITE", E NON "DEL": il numero è passato ATTRAVERSO il team,
       ed è così che è arrivato qui — detto in una visita e annotato dopo.
       "Del tuo team" suona come possesso, come se la riga fosse della
       clinica e non sua. */
    equipeMira: (valor: string) => `Il tuo team punta a ${valor}`,
    alterada: 'Modificato da te',
    viaEquipe: 'Tramite il tuo team',

    /* "I tuoi" perché la copertina della schermata si chiama già
       Obiettivi. A separare le due cose è chi li chiede: quelli l'app li
       conta da sola, questi li ha scritti la persona. */
    suasTitulo: 'I tuoi obiettivi',
    suasNota: 'Quelli misurati li seguiamo dai tuoi registri. I tuoi, li segni tu.',

    vazioTitulo: 'Ancora nessun obiettivo',
    vazioTexto: 'Scrivi una cosa che vuoi riuscire a fare. Resta qui finché non succede.',

    /* ---------- il foglio di uno dei quattro numeri ---------- */
    definidoPelaEquipe: 'Definito dal tuo team',
    novoValor: 'Nuovo valore',
    salvar: 'Salva',

    hoje: (valor: string) => `Oggi: ${valor}`,
    /* ⚠️ TRE RISPOSTE A "DA DOVE VIENE QUESTO NUMERO", e quella della
       registrazione viene da `alvos.<chave>.origem`. */
    origemSua: 'Un numero tuo',
    origemDaEquipe: (por: string, quando: string) => `Definito da ${por}, annotato il ${quando}`,
    origemVoceEm: (quando: string) => `Questo numero l’hai definito tu il ${quando}`,
    /* ⚠️ L'UNIONE È DELLA LINGUA. L'italiano attacca con punto e spazio;
       il `.trim()` dall'altra parte si occupa del caso in cui la seconda
       sia vuota. */
    origemEmuda: (origem: string, muda: string) => `${origem}. ${muda}`,
    /* ⚠️ "LA SCALA", E NON "LA REGOLA". In italiano "la regola" al
       singolare è il righello ma anche — e prima — la norma, e al plurale
       è la mestruazione: tre letture in un'app che parla con una donna in
       terapia. "Scala" dice quello che serve e non tira in ballo nessuna
       delle altre due; e a differenza dell'inglese non richiama la
       bilancia, che qui si chiama "bilancia". */
    mudaPeso: 'È il punto di arrivo concordato con il team, e toccarlo cambia la scala del Percorso e dell’andamento — senza cancellare niente di quello che è già registrato.',
    mudaOutros: 'La modifica vale da adesso: i giorni già registrati continuano a valere quello che valevano, e quello che cambia è ciò con cui vengono confrontati.',

    /* ⚠️ NESSUNA DELLE TRE PRECISAZIONI BLOCCA NIENTE — è il suo corpo ed
       è la sua app. Quello che cambia fra le tre è ciò che lei SA mentre
       cambia: chi sovrascrive i 110 g di una nutrizionista merita di
       leggerlo prima, e merita di continuare a vedere, dopo, che quei 110
       sono esistiti. */
    travadoTitulo: (por: string) => `A definirlo è stato ${por}`,
    travadoTexto: 'Questo numero fa parte della tua terapia, e per questo non si cambia qui. Se non va più bene — un’altra indicazione, una restrizione comparsa, un team nuovo —, togli l’annotazione nell’Area medica e torna a essere tuo.',
    divergeTitulo: 'Questo numero non è quello del tuo team',
    divergeTexto: (por: string, dela: string, nosso: string) =>
      `${por} ha definito ${dela}, e noi stiamo chiedendo ${nosso}. Teniamo tutti e due: puoi tornare al suo nell’Area medica, oppure portare la differenza alla prossima visita.`,
    recomendadoTitulo: 'Questo è il valore consigliato',

    verAnotacao: 'Vedi l’annotazione del tuo team',
    anotacaoSub: (por: string, valor: string) => `${por} · ${valor}`,

    /* ---------- il foglio di un obiettivo nuovo ---------- */
    novaSub: 'Una cosa tua. La teniamo qui per te, e sei tu a segnarla',
    escolhaOTipo: 'Scegli il tipo',
    escrevaDoSeuJeito: 'Scrivilo a modo tuo',

    guardarMeta: 'Salva l’obiettivo',
    respondaParaGuardar: 'Rispondi per salvare',
    prazoRotulo: 'Scadenza (facoltativa)',

    /* ⚠️ LE VIRGOLETTE SONO DELLA LINGUA, e per questo la frase intera è
       una funzione: l'italiano usa «così», il portoghese “così”, il
       tedesco „così“. */
    vaiAparecer: (frase: string, ate: string) => `Comparirà così: «${frase}»${ate}.`,
    vaiAparecerAte: (data: string) => `, entro il ${data}`,
    aindaNaoAteMarcar: 'Resta su «non ancora» finché non lo segni. Il giorno in cui succede, salviamo anche la data.',

    /* ---------- il foglio di un obiettivo dell'elenco ---------- */
    metaTitulo: 'Obiettivo',
    naoEncontrei: 'Non ho trovato questo obiettivo',
    apagadaEmOutraTela: 'Può essere stato cancellato in un’altra schermata.',
    subPessoal: 'Obiettivo tuo, segnato da te',
    subMedida: 'Obiettivo misurato dai tuoi check-in',

    conquistada: 'Raggiunto',
    aindaNao: 'Non ancora',
    consegui: 'Ce l’ho fatta',
    aindaNaoConsegui: 'Non ancora',
    apagar: 'Cancella',

    /* ⚠️ QUELLO MISURATO NON SI SEGNA E NON SI CANCELLA A MANO, e
       l'ultima frase dice perché: una caselletta sopra lascerebbe la
       persona contraddire il proprio registro. */
    contamosPorVoce: 'Questo lo contiamo noi per te',
    contamosTexto: 'Esce dai tuoi check-in degli ultimi quattordici giorni, e solo dai giorni a cui hai risposto. Non si può segnare a mano — ed è questo che fa valere qualcosa il numero.',
  },
};
