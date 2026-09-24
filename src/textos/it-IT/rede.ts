/* La rete partner — l’elenco e la scheda del professionista. Vedi
   ../pt-BR/rede: perché esiste in tutte le lingue anche se la rete è
   brasiliana, e che cosa NON si traduce (quello che il professionista ha
   scritto nel portale). */

export const rede = {
  titulo: 'Rete partner',
  lead: 'Professionisti che seguono la terapia con l’app. Il primo contatto è diretto con lo studio.',

  exemploTitulo: 'Professionisti di esempio',
  exemploTexto: 'Nomi, iscrizioni all’albo e contatti sono inventati, solo per vedere come appare l’elenco. La lista vera arriva dal portale della rete.',

  busca: 'Nome o specialità',

  localizacao: {
    usar: 'Usa la mia posizione',
    usarSub: 'Per vedere la distanza da ogni studio. Resta sul dispositivo.',
    pedindo: 'Cerchiamo dove sei…',
    ligada: 'Prima i più vicini',
    ligadaSub: 'In ordine di distanza. Tocca per disattivare.',
    negada: 'Nessun permesso per la posizione. Puoi scegliere la città nei filtri.',
    falhou: 'Non riusciamo a sapere dove sei adesso. Puoi scegliere la città nei filtri.',
  },

  /* "Nutrologia" è una specializzazione medica brasiliana, come la nostra
     Scienza dell’alimentazione; "Nutrição" è il nutrizionista. */
  especialidades: {
    endocrinologia: 'Endocrinologia',
    nutrologia: 'Scienza dell’alimentazione',
    nutricao: 'Nutrizione',
    esporte: 'Medicina dello sport',
    psicologia: 'Psicologia',
  },
  todas: 'Tutte',

  filtros: 'Filtri',
  filtrosSub: 'Città, assicurazione, modalità e giorno',
  resultados: (n: number) => `${n} ${n === 1 ? 'professionista' : 'professionisti'}`,

  aDistancia: (quanto: string) => `a ${quanto}`,
  soTeleconsulta: 'Solo televisita',
  teleconsulta: 'Televisita',
  outrosLocais: (n: number) => (n === 1 ? 'un’altra\u00A0sede' : `altre\u00A0${n}\u00A0sedi`),
  /* "da lun a ven" */
  deAte: (de: string, ate: string) => `da ${de} a ${ate}`,
  faixa: (abre: string, fecha: string) => `${abre}\u2060–\u2060${fecha}`,
  horario: (dias: string, faixa: string) => `${dias} · ${faixa}`,

  vazioTitulo: 'Nessuno con questi filtri',
  vazioTexto: 'Prova un’altra specialità, o togli uno dei filtri.',
  limparFiltros: 'Togli i filtri',
  erroTitulo: 'Non siamo riusciti ad aprire la rete',
  erroTexto: 'Controlla la connessione e riprova.',
  tentarDeNovo: 'Riprova',

  jaTenhoCodigo: 'Ho un codice di invito',

  folha: {
    titulo: 'Filtri',
    cidade: 'Città',
    todasAsCidades: 'Tutte',
    modalidade: 'Modalità',
    todas: 'Tutte',
    presencial: 'In presenza',
    teleconsulta: 'Televisita',
    convenio: 'Assicurazione',
    qualquer: 'Qualsiasi',
    particular: 'Privato',
    dia: 'Riceve il',
    qualquerDia: 'Qualsiasi giorno',
    ver: (n: number) => (n ? `Mostra ${n} ${n === 1 ? 'professionista' : 'professionisti'}` : 'Nessun professionista'),
    limpar: 'Azzera',
  },

  ficha: {
    sobre: 'Presentazione',
    ondeAtende: 'Dove riceve',
    presencialETele: 'In presenza e in televisita',
    soPresencial: 'In presenza',
    convenios: 'Assicurazioni',
    soParticular: 'Solo privato',
    particularNaLista: 'privato',
    comoChegar: 'Indicazioni',
    falar: 'Contatta lo studio',
    falarNota: 'I canali indicati dallo studio. Ognuno si apre fuori dall’app.',
    agenda: 'Prenota online',
    exemploContatos: 'Contatti di esempio — non aprono nulla.',
    proximoTitulo: 'Dopo la prima visita',
    proximoTexto: 'Lo studio ti dà un codice di invito. È quello che collega il percorso all’app — i messaggi tra una visita e l’altra, il tuo riepilogo che arriva all’équipe e gli appuntamenti già in agenda.',
    jaTenhoCodigo: 'Ho un codice',
    naoEncontrado: 'Non troviamo questo professionista nella rete.',
  },
};
