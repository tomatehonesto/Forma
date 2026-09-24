/* ============================================================
   LA LETTURA DEGLI ESAMI — il riassunto del prelievo e la lettura di un
   marcatore · it-IT

   ⚠️ Le ragioni vivono in ../pt-BR/exames.ts. Che cosa SONO i marcatori
   sta in textos/it-IT/marcadores; qui sta quello che si dice sui numeri
   di chi ha aperto la schermata.

   ⚠️⚠️ QUI NIENTE OPINA E TUTTO CONTA. Quanti sono rimasti fuori dai
   valori di riferimento, di quanto il valore si è mosso, in che
   direzione. È aritmetica detta in una frase — e lo è di proposito: la
   versione precedente era un paragrafo scritto a mano con i numeri di UNA
   persona, e affermava "i tuoi valori sono migliorati" a chi era
   peggiorata.

   ⚠️ E LA DIREZIONE COMPARE SOLO QUANDO IL MARCATORE DICHIARA QUAL È IL
   LATO BUONO. Creatinina o TSH che salgono non sono una buona né una
   cattiva notizia di per sé.

   ⚠️ E OGNI LETTURA FINISCE RESTITUENDO L'ESAME A CHI SEGUE LA PERSONA.
   L'ultima frase non è una nota legale — è la verità su quello che un
   esame isolato può dire.
   ============================================================ */

export const exames = {
  /* ============================================================
     IL RIASSUNTO DEL PRELIEVO — la frase della copertina
     ============================================================ */
  resumo: {
    todosDentro: (quantos: number) =>
      `I ${quantos} marcatori di questo prelievo sono dentro i valori di riferimento del laboratorio.`,
    umFora: (total: number, qual: string) =>
      `Uno dei ${total} marcatori di questo prelievo è rimasto fuori dai valori di riferimento: ${qual}.`,
    algunsFora: (fora: number, total: number, quais: string) =>
      `${fora} dei ${total} marcatori di questo prelievo sono rimasti fuori dai valori di riferimento: ${quais}.`,
    /* ⚠️ OLTRE I TRE, IL CONTEGGIO BASTA. Il riassunto vive in una
       copertina di altezza fissa, e otto nomi di fila spingono il
       paragrafo fuori — e anche se ci stesse, un elenco di otto in mezzo a
       una frase non si legge, si conta. */
    muitosFora: (fora: number, total: number) =>
      `${fora} dei ${total} marcatori di questo prelievo sono rimasti fuori dai valori di riferimento.`,

    /* Il pezzo di data che apre la seconda frase, quando c'è uno storico.
       Arriva con la virgola perché si attacca alla frase dopo. */
    desde: (data: string) => ` Dal ${data},`,
    melhoraUm: (desde: string, qual: string, de: string, para: string, unidade: string) =>
      `${desde} un marcatore si è mosso nella direzione attesa. Il cambiamento più grande: ${qual}, da ${de} a ${para} ${unidade}.`,
    melhoraVarios: (desde: string, quantos: number, qual: string, de: string, para: string, unidade: string) =>
      `${desde} ${quantos} marcatori si sono mossi nella direzione attesa. Il cambiamento più grande: ${qual}, da ${de} a ${para} ${unidade}.`,

    /* ⚠️ IL PEGGIORAMENTO ARRIVA NELLA STESSA FRASE E CON LO STESSO PESO
       DEL MIGLIORAMENTO. Un riassunto che racconta solo quello che è
       migliorato è pubblicità, e chi sta leggendo un esame del sangue ha
       bisogno di tutte e due le metà. */
    pioraUm: (qual: string) => ` Un marcatore è andato nella direzione opposta: ${qual}.`,
    pioraPoucos: (quantos: number, quais: string) =>
      ` ${quantos} marcatori sono andati nella direzione opposta: ${quais}.`,
    pioraMuitos: (quantos: number) => ` ${quantos} marcatori sono andati nella direzione opposta.`,
  },

  /* ============================================================
     LA LETTURA DI UN MARCATORE

     ⚠️ IL TITOLO È STATO + CHE COSA È IN GIOCO, ed era stato + direzione.
     Quello che nessun altro pezzo della schermata dice è PERCHÉ questo
     numero conti — e un valore fuori fascia senza questo è un allarme
     senza argomento.

     ⚠️ E IL TITOLO NON DICE IL NOME DEL MARCATORE. "La tua HbA1c" / "Il
     tuo ferritina" chiederebbe una tabella di genere per marcatore per
     scriverlo giusto in italiano, e sbagliare l'articolo in una frase
     sulla salute di qualcuno è un inciampo che costa poco evitare.
     "Questo risultato" è sempre corretto, e il nome sta nella barra in
     alto.
     ============================================================ */
  leitura: {
    acima: 'sopra',
    abaixo: 'sotto',

    dentroSemAfeta: 'Questo risultato è dentro i valori di riferimento del laboratorio.',
    foraSemAfeta: (lado: string) =>
      `Questo risultato è ${lado} i valori di riferimento del laboratorio.`,
    dentroComAfeta: (afeta: string) =>
      `Questo risultato è dentro i valori di riferimento, ed è un buon segno ${afeta}.`,
    foraComAfeta: (lado: string, afeta: string) =>
      `Questo risultato è ${lado} i valori di riferimento, e questo fa differenza ${afeta}.`,

    /* La fascia che il laboratorio ha scritto, nelle tre forme in cui
       compare in un referto. */
    faixaEntre: (min: string, max: string, unidade: string) => `fra ${min} e ${max}${unidade}`,
    faixaAbaixoDe: (max: string, unidade: string) => `sotto ${max}${unidade}`,
    faixaAcimaDe: (min: string, unidade: string) => `sopra ${min}${unidade}`,

    /* ⚠️ LA DIREZIONE HA PRESO LA CONCLUSIONE CHE STAVA NEL TITOLO: non è
       solo che è salito, è che è salito VERSO DOVE. */
    rumoDentroBom: ', nella direzione attesa',
    rumoDentroRuim: ', nella direzione opposta a quella attesa',
    rumoForaBom: ', avvicinandosi ai valori di riferimento',
    rumoForaRuim: ', allontanandosene',
    subiu: 'è salito di',
    caiu: 'è sceso di',
    andou: (data: string, verbo: string, quanto: string, unidade: string, rumo: string) =>
      ` Dal ${data} ${verbo} ${quanto}${unidade}${rumo}.`,

    /* ⚠️ QUESTA È L'UNICA FRASE DELLA SCHERMATA CHE GUARDA FUORI DA
       QUESTO MARCATORE.

       Un numero fuori fascia letto da solo diventa il mondo intero di chi
       legge — e quello che lo disinnesca non sta nel marcatore, sta nel
       pannello: sapere che gli altri quattordici sono andati bene cambia
       la dimensione di questo. */
    painelTudoDentro: (total: number) =>
      ` I ${total} marcatori di questo esame sono dentro i valori di riferimento.`,
    painelEsteNao: (total: number, fora: number, plural: boolean) =>
      ` Dei ${total} marcatori di questo esame, ${fora} ${plural ? 'sono rimasti' : 'è rimasto'} fuori dai valori di riferimento; questo no.`,
    painelUnicoFora: (total: number) =>
      ` Dei ${total} marcatori di questo esame, questo è l’unico fuori dai valori di riferimento.`,
    painelEsteEUmDeles: (total: number, fora: number) =>
      ` Dei ${total} marcatori di questo esame, ${fora} sono fuori dai valori di riferimento, e questo è uno di loro.`,

    /* ⚠️ L'ULTIMA FRASE NON SI TOGLIE. "Un esame da solo non chiude
       niente" è quello che impedisce a tutta la lettura di diventare una
       diagnosi, e "chi ti segue" è vero in tutti e tre i modi — con un
       team, con un medico da sola e senza nessuno. */
    corpo: (data: string, valor: string, unidade: string, faixa: string, andou: string, painel: string) =>
      `Nel prelievo del ${data} il valore è stato ${valor}${unidade}, e il riferimento del laboratorio è ${faixa}.${andou}${painel} Un esame da solo non chiude niente: chi lo mette insieme al resto della tua storia è chi ti segue.`,
  },

  /* ============================================================
     LA SCHERMATA DEGLI ESAMI

     ⚠️ IL VERDETTO ARRIVA CON LA PROVA. "Nella norma" da solo è
     un'affermazione che la persona non può controllare; "Nella norma:
     sotto 5,7 %" è la stessa affermazione con il limite dentro.

     ⚠️ E IN COPERTINA CI SONO DUE NUMERI, E NON UNO. "3 fuori dai valori
     di riferimento" da solo è un allarme senza denominatore: tre su
     quindici e tre su quattro non sono la stessa notizia.
     ============================================================ */
  tela: {
    titulo: 'Esami',
    linha: (quantos: number, ultimaColeta: string) =>
      `${quantos} ${quantos === 1 ? 'marcatore' : 'marcatori'} · ultimo prelievo del ${ultimaColeta}`,
    foraDaReferencia: 'fuori norma',
    naReferencia: 'nella norma',
    blocoFora: 'Fuori norma',
    arquivosImportados: 'File importati',
    arquivoSub: (marcadores: number, fonte: string, data: string) =>
      `${marcadores} marcatori · ${fonte} · ${data}`,
    importar: 'Importa un esame',
    enviarAoMedico: 'Invia al medico',

    linhaVazia: 'Ancora nessun risultato',
    vazioTitulo: 'Qui non c’è ancora nessun esame',
    vazioTexto: 'Non hai ancora annotato nessun risultato. Appena annoti il primo, compare qui con il suo intervallo di riferimento e che cosa significa.',
    vazioAcao: 'Annota un risultato',

    /* ---------- il marcatore ---------- */
    colhidoEm: (data: string) => `Prelevato il ${data}`,
    vereditoOk: 'Nella norma',
    vereditoAlto: 'Sopra i valori di riferimento',
    vereditoBaixo: 'Sotto i valori di riferimento',
    vereditoComFaixa: (veredito: string, faixa: string) => `${veredito}: ${faixa}`,
    faixaEntre: (minimo: string, maximo: string, unidade: string) =>
      `fra ${minimo} e ${maximo}${unidade}`,
    faixaAbaixo: (maximo: string, unidade: string) => `sotto ${maximo}${unidade}`,
    faixaAcima: (minimo: string, unidade: string) => `sopra ${minimo}${unidade}`,
    faixaRef: (referencia: string, unidade: string) => `${referencia}${unidade}`,
    refCurta: (referencia: string) => ` · rif ${referencia}`,

    /* I bollini dell'ELENCO, in minuscolo e corti: lì stanno accanto al
       numero, e il verdetto per esteso vive nel dettaglio. */
    seloOk: 'nella norma',
    seloAlto: 'sopra',
    seloBaixo: 'sotto',
    seloEnviado: 'inviato',

    sobre: 'CHE COS’È',

    /* ---------- l'andamento ----------
       ⚠️ SENZA `good`, LA PASTIGLIA RESTA NEUTRA: numero, unità, e
       nessuna parola su se sia una buona notizia. Non tutti i marcatori
       hanno un lato buono. */
    evolucao: 'ANDAMENTO',
    deAte: (primeiro: string, ultimo: string) => `Da ${primeiro} a ${ultimo}`,
    coletasDesde: (quantas: number, data: string) =>
      `${quantas} ${quantas === 1 ? 'prelievo' : 'prelievi'} dal ${data}`,
    deltaEsperado: ' · atteso',
    deltaOposto: ' · opposto',

    oQueSignifica: 'CHE COSA VUOL DIRE',
    oQueAjuda: 'Che cosa di solito aiuta',
    oQueMexe: 'Che cos’altro muove il risultato',
    rodape: 'Sono le cause e le strade più comuni, e non l’elenco intero. Cambiare una dose o un farmaco è decisione di chi ti segue.',
    perguntarSobre: 'Chiedi di questo esame',
    perguntaCompanion: (marcador: string) => `Spiegami il mio esame di ${marcador}`,
  },
};
