/* ============================================================
   LE UNITÀ DI MISURA — le parole, non i simboli · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/medidas.ts. Qui entra solo quello che
   si legge per esteso: "kg", "cm", "oz" e "ml" sono simboli
   internazionali e restano nel codice.

   ⚠️ E L'ELENCO È L'ESEMPIO, NON L'INVENTARIO. Compare sotto il nome del
   sistema, per chi non sa a memoria che cosa voglia dire "imperiale".
   ============================================================ */

export const medidas = {
  metrico: 'Metrico',
  imperial: 'Imperiale',
  unidadesMetrico: 'chili, metri, centimetri e litri',
  unidadesImperial: 'libbre, piedi, pollici e once',

  /* ============================================================
     I SETTE MARCATORI DEL CORPO — e vivono qui, e solo qui

     ⚠️ Gli stessi nomi erano già scritti in due posti: quattro in
     `home.mudancas` e quattro in `confirmacoes`. È la stessa malattia che
     questo catalogo ha già curato tre volte — lo stesso fatto scritto in
     posti diversi diverge la prima volta che qualcuno ne migliora uno.
     ============================================================ */
  corpo: {
    peso: 'Peso',
    cintura: 'Vita',
    quadril: 'Fianchi',
    braco: 'Braccio',
    coxa: 'Coscia',
    gordura: 'Massa grassa',
    massaMagra: 'Massa magra',
  },
  pontosPercentuais: 'p.p.',

  /* ============================================================
     LA SCHERMATA DEL MARCATORE — il grafico e l'elenco che si corregge
     ============================================================ */
  tela: {
    periodo12s: '12 settimane',
    periodo3m: '3 mesi',
    periodoTudo: 'Tutto',

    /* ⚠️ Questo avviso viveva in fondo all'elenco delle circonferenze:
       lì era una nota generale su un argomento, qui arriva accanto al
       numero che spiega. */
    mesmoJeitoTitulo: 'Misurare sempre allo stesso modo',
    mesmoJeitoTexto: 'Stessa ora del giorno, senza vestiti stretti e con il metro appoggiato alla pelle, senza stringere. Confrontare due misure vale solo se le due sono state prese allo stesso modo.',

    /* Solo il peso ha un'ora del giorno; una misura di metro no. */
    notaManha: 'mattina',

    vazioTitulo: (nome: string) => `Nessuna registrazione di ${nome.toLowerCase()}`,
    vazioDaBalanca: 'Questa misura arriva da una bilancia a impedenza, e non ne è ancora arrivata nessuna.',
    vazioRegistre: 'Registra la prima per iniziare a seguirla.',

    lead: (data: string, inicial: string, unidade: string) =>
      `Registrato il ${data} · ${inicial} ${unidade} all’inizio della terapia`,
    subCurva: (periodo: string, quantos: number) =>
      `${periodo.toLowerCase()}${quantos > 1 ? ` · ${quantos} registri` : ''}`,

    registros: 'Registri',
    /* ⚠️ LA NOTA CAMBIA VOCE QUANDO IL NUMERO NON È DELLA PERSONA. "Tocca
       per correggere" su una lettura della bilancia promette una modifica
       che non esiste — e la riga non si apre nemmeno. */
    notaLeitura: 'Letture della bilancia a impedenza. Qui non c’è niente da correggere — arrivano già complete.',
    notaCorrigir: 'Tocca per correggere o cancellare. Quello che sta qui finisce nella relazione per il tuo medico.',
  },

  /* ============================================================
     LA SCHERMATA DELL'ANDAMENTO
     ============================================================ */
  telaEvolucao: {
    titulo: 'Andamento',
    lead: 'Dodici settimane di terapia. Tocca un marcatore per vedere lo storico e correggere i registri.',

    voceRegistra: 'Registri tu',
    voceRegistraNota: 'Marcatori che dipendono solo da te — tocca per vedere lo storico e correggere i registri.',

    vemDeExame: 'Arriva dagli esami',
    vemDeExameNota: 'Servono un referto di laboratorio o una bilancia a impedenza. Solo in lettura — ma ognuno apre il proprio storico.',

    /* ⚠️ "STABILE" ERA TUTTO QUELLO CHE NON FOSSE UN CALO, e una salita di
       quattordici punti usciva come stabile. Anche salire ha un nome. */
    pressao: 'Pressione',
    emQueda: 'In calo',
    emAlta: 'In salita',
    estavel: 'Stabile',
    pressaoValor: (sistolica: number, diastolica: number) => `${sistolica}/${diastolica}`,

    todosOsExames: 'Tutti gli esami',
    todosOsExamesSub: 'Referti, valori di riferimento e storico completo',
  },

  /* ============================================================
     LA SCHERMATA DEI PARAMETRI VITALI

     ⚠️ DUE NATURE DI NUMERO, E LA SCHERMATA LE SEPARA. Pressione e
     glicemia hanno una serie: informa la tendenza. Frequenza,
     saturazione e respiro sono misure puntuali — dicono se la persona è
     dentro la fascia, non dove sta andando.

     ⚠️ E QUESTI NUMERI NON SI SCRIVONO A MANO. Arrivano da un dispositivo
     collegato, e quel collegamento ancora non esiste.
     ============================================================ */
  telaSinaisVitais: {
    titulo: 'Parametri vitali',
    lead: 'Valori che migliorano insieme al peso — e che la bilancia da sola non mostra.',

    aoLongoDoTempo: 'Seguiti nel tempo',
    pressaoArterial: 'Pressione arteriosa',
    pressaoSub: (inicial: string, medicoes: number) =>
      `${inicial} all’inizio · ${medicoes} misurazioni`,
    glicemiaDeJejum: 'Glicemia a digiuno',
    glicemiaSub: (inicial: number, medicoes: number) =>
      `${inicial} mg/dL all’inizio · ${medicoes} misurazioni`,

    ultimaLeitura: 'Ultima lettura',
    ultimaLeituraNota: 'Misura puntuale: questi numeri dicono se sei dentro la fascia, non dove stai andando.',
    pontuais: {
      fc: 'Freq. cardiaca',
      spo2: 'Saturazione O₂',
      fr: 'Freq. respiratoria',
      glic: 'Glicemia',
    },
    seloNormal: 'normale',
    seloBaixo: 'bassa',
    seloAlto: 'alta',

    deOndeVem: 'Da dove arrivano',
    aparelhosEContas: 'Dispositivi e account',
    aparelhosEContasSub: 'Vedi che cosa si può collegare oggi, e che cosa deve ancora arrivare',

    naoSeDigitam: 'Questi numeri non si scrivono a mano',
    naoSeDigitamTexto: 'Pressione, saturazione e frequenza arrivano da un dispositivo collegato — e quel collegamento in questa versione non esiste ancora. Un risultato di laboratorio entra da Esami.',
  },
};
