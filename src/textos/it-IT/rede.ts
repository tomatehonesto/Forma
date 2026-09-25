/* La rete partner — l’elenco, i suoi filtri e la scheda della sezione
   Cura. Vedi ../pt-BR/rede: perché esiste in tutte le lingue anche se la
   rete è brasiliana, e che cosa NON si traduce (quello che il centro ha
   scritto nel portale). */

export const rede = {
  titulo: 'Centri partner',
  lead: 'Centri che seguono la terapia con l’app. Il primo contatto è diretto con loro.',

  exemploTitulo: 'Centri di esempio',
  exemploTexto: 'Nomi, iscrizioni all’albo e contatti sono inventati, solo per vedere come appare l’elenco. La lista vera arriva dal portale della rete.',

  busca: 'Centro, medico o specialità',

  perto: 'Vicino a me',
  localizacao: {
    pedindo: 'Cerchiamo dove sei…',
    negada: 'Nessun permesso per la posizione. Puoi scegliere la città.',
    falhou: 'Non riusciamo a sapere dove sei adesso. Puoi scegliere la città.',
  },

  filtro: {
    especialidade: 'Specialità',
    convenio: 'Assicurazione',
    modalidade: 'Modalità',
    dia: 'Giorno',
    cidade: 'Città',
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

  resultados: (n: number) => `${n} ${n === 1 ? 'centro' : 'centri'}`,

  aDistancia: (quanto: string) => `a ${quanto}`,
  soTeleconsulta: 'Solo televisita',
  soPresencial: 'In presenza',
  presencialETele: 'In presenza e in televisita',
  teleconsulta: 'Televisita',
  particular: 'Privato',
  aceita: (convenio: string) => `Accetta ${convenio}`,
  soParticular: 'Solo privato',
  atendeHoje: 'Riceve oggi',
  maisConvenios: (n: number) => `+${n}`,
  /* "da lun a ven" */
  deAte: (de: string, ate: string) => `da ${de} a ${ate}`,
  faixa: (abre: string, fecha: string) => `${abre}\u2060–\u2060${fecha}`,
  horario: (dias: string, faixa: string) => `${dias} · ${faixa}`,

  vazioTitulo: 'Nessun centro con questi filtri',
  vazioTexto: 'Prova un’altra specialità, o togli uno dei filtri.',
  limparFiltros: 'Togli i filtri',
  erroTitulo: 'Non siamo riusciti ad aprire la rete',
  erroTexto: 'Controlla la connessione e riprova.',
  tentarDeNovo: 'Riprova',

  jaTenhoCodigo: 'Ho un codice di invito',

  folha: {
    especialidade: 'Specialità',
    convenio: 'Assicurazione',
    modalidade: 'Modalità',
    dia: 'Giorno di visita',
    cidade: 'Città',
    todas: 'Tutte',
    qualquer: 'Qualsiasi',
    qualquerDia: 'Qualsiasi giorno',
    todasAsCidades: 'Tutte le città',
    presencialOuTele: 'In presenza o in televisita',
    presencial: 'In presenza',
    teleconsulta: 'Televisita',
    limpar: 'Azzera',
  },

  cartao: {
    tag: 'Centri partner',
    titulo: 'Fatti seguire da specialisti',
    naRede: (n: number) => `${n} ${n === 1 ? 'professionista' : 'professionisti'} nella rete`,
    pertoDeVoce: (n: number) => `${n} ${n === 1 ? 'professionista' : 'professionisti'} · i più vicini a te`,
    acao: 'Vedi i centri',
  },
};
