/* ============================================================
   IL RIEPILOGO PER LA VISITA — il documento che la persona porta
   · it-IT

   ⚠️⚠️ QUESTO TESTO VA AL MEDICO, ed è l'unico dell'app che esce da
   essa. Questo cambia due cose nella scrittura:

   IL REGISTRO È PIÙ FORMALE del resto. "Cadenza", "Variazione", "In" —
   sono etichette di tabella clinica, non la voce di conversazione della
   Home. Chi legge dall'altra parte ha due minuti e cerca numeri.

   ⚠️ ED È PER QUESTO CHE QUI SI DICE "INIEZIONI" E NON "PUNTURE". È
   l'unico file del catalogo italiano dove la parola clinica è quella
   giusta: il resto dell'app parla, e chi parla dice "puntura". La
   ragione intera sta in alto in formas.ts.

   E L'ORIGINE VA INSIEME, nell'ultima riga. Chi riceve questo per
   messaggio deve sapere che è uscito da un'app di monitoraggio e non da
   una cartella clinica — e che i numeri sono quello che la PERSONA ha
   registrato.

   ⚠️ OGNI SINTOMO CON LA SUA UNITÀ. Nausea, fame ed energia sono scale
   da zero a dieci; il sonno è un'ora di orologio. Una sezione intera
   etichettata "(0–10)" metteva sette ore di sonno sullo stesso metro di
   una nausea sette.
   ============================================================ */

export const resumo = {
  /* ---------------- terapia ---------------- */
  medicacao: 'Terapia',
  medicamento: 'Farmaco',
  dose: 'Dose',
  cadencia: 'Cadenza',
  tempoDeTratamento: 'Durata della terapia',
  emDias: (dias: number) => `${dias} ${dias === 1 ? 'giorno' : 'giorni'}`,
  aplicacoes: 'Iniezioni',
  aplicacoesValor: (feitas: number, previstas: number) => `${feitas} su ${previstas} previste`,
  aplicacoesNenhuma: 'Nessuna registrata',

  /* ---------------- peso ---------------- */
  peso: 'Peso',
  inicioAtual: 'Inizio → attuale',
  pesoAtual: 'Peso attuale',
  variacao: 'Variazione',
  em: 'In',
  metaDePeso: 'Obiettivo di peso',

  /* ---------------- sintomi ---------------- */
  sintomas: 'Sintomi',
  mediaDosDias: (comResposta: number) => `Media degli ultimi 14 giorni · ${comResposta} con risposta`,
  semRespostas: 'Nessuna risposta negli ultimi 14 giorni',
  nausea: 'Nausea',
  fome: 'Fame',
  energia: 'Energia',
  sono: 'Sonno',
  de10: ' su 10',
  horas: ' h',

  /* ---------------- esami e appunti ---------------- */
  examesRecentes: 'Esami recenti',
  anotacoes: 'Appunti per la visita',
  semAnotacoes: '(nessun appunto)',

  /* ---------------- il testo che si invia ---------------- */
  cabecalho: (nome: string) => `RIEPILOGO DELLA TERAPIA — ${nome}`,
  paraDoutor: (doutor: string) => ` · per ${doutor}`,
  origem: 'Generato dall’app a partire dai registri della persona stessa.',

  /* Il documento salvato, nell'elenco dei documenti. */
  nomeDoDocumento: 'Riepilogo della terapia',
  enviadoPara: (doutor: string) => `Inviato da te a ${doutor}`,
  enviado: 'Inviato da te',

  /* ============================================================
     LA SCHERMATA DEL RIEPILOGO — l'anteprima di quello che arriverà

     ⚠️ PER CHI È IL RIEPILOGO NON DIPENDE DALLA PIATTAFORMA. Il
     documento è PER chi la segue; quello che ha bisogno di un server è
     INVIARLO. La riga leggeva il legame con la clinica e diceva "non hai
     ancora un team" a chi aveva appena annotato il proprio medico.
     ============================================================ */
  pdf: {
    exame: 'Esame',
    resultado: 'Risultato',
    referencia: 'Riferimento',
  },

  relatorio: {
    titulo: 'Report della terapia',
    visaoGeral: 'Panoramica',
    pesoAtual: 'Peso attuale',
    variacao: 'Variazione nel periodo',
    aplicacoesNoPeriodo: 'Punture nel periodo',
    checkinsRespondidos: 'Check-in compilati',
    peso: 'Peso',
    medidas: 'Misure',
    aplicacoes: 'Punture',
    sintomas: 'Sintomi',
    exames: 'Esami',
    notas: 'Note per la visita',
    habitos: 'Pasti, liquidi e attività',
    data: 'Data',
    dose: 'Dose',
    local: 'Sede',
    proteinaMedia: 'Proteine al giorno, in media',
    aguaMedia: 'Liquidi al giorno, in media',
    exercicioTotal: 'Attività nel periodo',
    semRegistros: 'Niente registrato nel periodo.',
    conversada: 'discussa',
    periodo: (de: string, ate: string) => `Dal ${de} al ${ate}`,
    geradoEm: (data: string) => `Creato il ${data}`,
    para: (quem: string) => `Per ${quem}`,
    minutos: (min: number) => `${min} min`,
    arquivo: (data: string) => `morphi-report-${data}.pdf`,
    semEnjoo: 'Nessuna nausea',
    melhor: 'meglio',
    pior: 'peggio',
    cadaQuadrado: 'Ogni quadrato è un giorno compilato, dal più vecchio al più recente.',
    diasDe: (n: number, total: number) => `${n} su ${total} ${total === 1 ? 'giorno' : 'giorni'}`,
    piorEm: (palavra: string, n: number) => `Nel momento peggiore: «${palavra}», ${n === 1 ? 'in 1 giorno' : `in ${n} giorni`}`,
    antes: (valor: string, data: string) => `prima: ${valor} il ${data}`,
    coletadoEm: (data: string) => `prelievo del ${data}`,
  },

  tela: {
    titulo: 'Riepilogo per la visita',
    lead: 'Tutto quello che hai registrato, così come si presenterà alla visita.',

    enviar: (doutor: string) => `Invia a ${doutor}`,
    enviarDeNovo: (doutor: string) => `Invia di nuovo a ${doutor}`,
    enviado: 'Inviato',
    compartilharPdf: 'Condividi in PDF',
    ajustarPdf: 'Modifica periodo e contenuto',
    montandoPdf: 'Preparo il PDF…',

    resumoDe: (data: string) => `Riepilogo del ${data}`,
    paraQuem: (quem: string) => `Per ${quem}`,
    paraQuemComClinica: (doutor: string, clinica: string) => `Per ${doutor} · ${clinica}`,
    paraLevar: 'Da portare alla prossima visita',
    enviadoEm: (quando: string) => `Inviato ${quando}`,
    enviosSub: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'invio' : 'invii'} · resta al tuo team`,

    examesRecentes: 'Esami recenti',
    verTodos: 'Vedi tutti',

    /* Gli appunti sono l'unica parte scritta a mano di questo riepilogo,
       e l'unica che sparisce se la persona se ne dimentica. */
    anotacoes: 'Appunti per la visita',
    anotar: 'Annota',
    anotacoesNota: 'Solo quelli che non hai ancora segnato come affrontati.',
    nadaAnotado: 'Niente di annotato',
    nadaAnotadoTexto: 'Quello che vuoi chiedere alla visita si scrive qui, ed entra nel riepilogo.',

    relatoTitulo: 'È un resoconto, non un esame',
    relatoTexto: 'I numeri vengono da quello che hai registrato nell’app. Servono alla conversazione della visita, e non sostituiscono né una valutazione né un referto.',

    confirmacaoEnvio: (doutor: string) => `Inviato. Arriva a ${doutor}.`,
  },
};
