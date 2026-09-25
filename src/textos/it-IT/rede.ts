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
  lugarEDistancia: (lugar: string, distancia: string) => `${lugar} • ${distancia}`,
  soTeleconsulta: 'Solo televisita',
  soPresencial: 'In presenza',
  presencialETele: 'In presenza e in televisita',
  teleconsulta: 'Televisita',
  particular: 'Privato',
  aceita: (convenio: string) => `Accetta ${convenio}`,
  aceitaConvenios: 'Accetta assicurazioni',
  atendeHoje: 'Riceve oggi',
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

  apresentacao: {
    tag: 'Centri partner',
    titulo: 'Un team vicino a te, tra una visita e l’altra',
    subtitulo: 'I centri partner seguono la tua terapia con l’app: il team ti scrive, segue i tuoi progressi e riceve le informazioni del tuo percorso.',
    comoFunciona: 'Come funziona',
    passos: [
      { titulo: 'Trova un centro', texto: 'Scegli per specialità, assicurazione o distanza.' },
      { titulo: 'Prenota la tua prima visita', texto: 'Contatta direttamente il centro e fissa la tua visita.' },
      { titulo: 'Ricevi il codice di invito', texto: 'Il centro ti invia il codice dopo la visita. È quello che collega la tua app al team.' },
      { titulo: 'Il team segue la tua terapia', texto: 'Tutto quello che hai già registrato resta qui. Il legame con il centro non cancella niente.' },
    ],
    isencaoTitulo: 'E non è tutto: Morphi per te è gratis',
    isencaoTexto: 'Chi si cura con un centro partner ha accesso gratuito all’app.',
    conhecer: 'Scopri i centri partner',
    credito: 'Immagine di Drazen Zigic su Magnific',
  },

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
    titulo: 'Specialisti al tuo fianco',
    texto: 'Centri che usano Morphi per seguire da vicino i loro pazienti, monitorare l’andamento della terapia e potenziarne i risultati.',
    acao: 'Vedi i centri',
    saibaMais: 'Scopri di più',
  },

  /* Il collegamento sul server — vedi l’intestazione del blocco in pt-BR/rede. */
  vinculo: {
    titulo: 'Che cosa vedrà la clinica',
    itens: {
      peso: 'Pesate',
      aplicacao: 'Iniezioni',
      checkin: 'Check-in: sintomi, sonno, fame, acqua, proteine e movimento',
      refeicao: 'Pasti',
      refeicao_favorita: 'Pasti preferiti',
      medida: 'Misure del corpo',
      exame: 'Esami',
      laudo: 'Referti',
      sinal_vital: 'Parametri vitali',
      documento: 'Documenti',
      anotacao: 'Appunti',
      meta_pessoal: 'Obiettivi personali',
      caneta: 'I contenitori del farmaco',
      pessoal: 'I tuoi dati: nome, data di nascita, altezza e foto',
      tratamento: 'Il trattamento, con la tua storia clinica: condizioni, allergie e farmaci',
      acompanhamento: 'Chi ti segue, e le visite che hai annotato',
      protocolo: 'Il protocollo della settimana e gli obiettivi',
      preferencias: 'Le preferenze dell’app, come lingua e promemoria',
      vistos: 'Quello che l’app ti ha già mostrato',
    },
    antes: 'Include quello che hai registrato prima di collegarti.',
    perguntas: 'Le domande che fai a Morphi non ne fanno parte.',
    dura: 'La clinica lo vede finché dura il collegamento. Puoi scollegarti in qualsiasi momento, dalla schermata della clinica.',
    guarda: 'Quello che viene registrato durante il percorso resta conservato dalla clinica, come cartella clinica, anche dopo lo scollegamento.',
    aceitar: 'Collegarti vuol dire accettare la condivisione qui sopra.',
    semInternet: 'Controllare il codice richiede internet. Riprova quando torna la connessione.',
    naoValeuAgora: 'Questo codice non è valido: è già stato usato o è scaduto. Chiedine un altro alla clinica.',
    entrarPrimeiro: 'Per collegarti, accedi di nuovo al tuo account. Il codice resta salvato.',
    guardadoTitulo: 'Codice salvato',
    guardadoTexto: 'Colleghiamo la clinica appena il tuo account viene creato.',
    desconectar: 'Scollegati dalla clinica',
    desconectarPergunta: 'Il team non vede più il tuo diario, e l’esenzione dell’app tramite la clinica finisce. Tutte le tue registrazioni restano qui.',
    desconectarSim: 'Scollegati',
    desconectarCancelar: 'Annulla',
    desconectarSemInternet: 'Scollegarti richiede internet. Non è cambiato niente.',
    avisoEncerrouTitulo: 'La clinica ha chiuso il percorso',
    avisoEncerrouTexto: 'Il tuo diario è ancora qui, intero.',
    avisoNaoConfirmadoTitulo: 'Il codice di invito non è stato confermato',
    avisoNaoConfirmadoTexto: 'Non è mai stato controllato con la clinica. Puoi scriverlo di nuovo nella scheda Cura.',
    avisoNaoValeuTitulo: 'Il codice di invito non è valido',
    avisoNaoValeuTexto: 'Era già stato usato o era scaduto. Puoi scriverne un altro nella scheda Cura.',
  },
};
