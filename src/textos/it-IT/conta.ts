/* L’account — vedi l’intestazione di pt-BR/conta per le ragioni. */

export const conta = {
  titulo: {
    cadastro: 'Mettiamo al sicuro il tuo diario',
    abertura: 'Che bello rivederti!',
    sessao: 'Manca solo rientrare',
  },
  tituloDoFim: (nome: string) => (nome ? `Tutto pronto, ${nome}!` : 'Tutto pronto!'),
  tituloDaSessao: (nome: string) => (nome ? `Rientra, ${nome}` : 'Rientra'),
  lead: {
    cadastro: 'Il tuo piano è pronto. Crea il tuo account per conservare tutto quello che ci hai raccontato, e iniziare.',
    abertura: 'Accedi, e riportiamo il tuo diario su questo telefono, così come l’hai lasciato.',
    sessao: 'La tua sessione è scaduta, ma non si è perso niente di quello che hai registrato. Appena accedi, salviamo tutto nel tuo account.',
  },


  comApple: 'Continua con Apple',
  comGoogle: 'Continua con Google',
  previaSoNaBuild: 'Questo accesso funziona solo nell’app installata. Qui, continua con l’email.',
  colarCodigo: 'Incolla codice',
  colarNada: (n: number) => `Non abbiamo trovato un codice di ${n} cifre in quello che hai copiato.`,
  comEmail: 'Continua con l’e-mail',
  semSenha: 'Senza password: ti mandiamo un codice via e-mail.',

  emailTitulo: 'Qual è la tua e-mail?',
  emailLead: (digitos: number) => `Ti mandiamo un codice di ${digitos} cifre.`,
  emailCampo: 'tu@esempio.com',
  enviarCodigo: 'Manda il codice',
  emailIncompleto: 'Questa e-mail sembra incompleta.',

  codigoTitulo: 'Scrivi il codice',
  codigoLead: (email: string, minutos: number) =>
    `L’abbiamo mandato a ${email}. Vale ${minutos} minuti — se non arriva, guarda anche nello spam.`,
  entrar: 'Accedi',
  reenviar: 'Manda un altro codice',
  reenviando: 'Invio di un nuovo codice…',
  reenviarEm: (segundos: number) => `Un altro codice tra ${segundos} s`,
  outroEmail: 'Usa un’altra e-mail',
  voltar: 'Indietro',
  tentarDeNovo: 'Riprova',

  guardando: 'Salviamo il tuo diario…',
  trazendo: 'Riportiamo il tuo diario…',

  erro: {
    semInternet: 'Creare l’account o accedere richiede internet. Quello che hai già scritto resta qui, e riproviamo quando torna la connessione.',
    codigoErrado: 'Questo codice non corrisponde, o è scaduto. Controlla le cifre, o fatti mandare un altro codice e usa il più recente.',
    muitosPedidos: 'Troppe richieste di seguito. Aspetta un minuto e riprova.',
    apple: 'Apple non ha confermato l’accesso. Riprova, o continua con l’e-mail.',
    google: 'Google non ha confermato l’accesso. Riprova, o continua con l’email.',
    outro: 'Non ci siamo riusciti ora. Riprova tra un attimo.',
  },

  doisDiarios: {
    titulo: 'Questo account ha già un diario',
    lead: 'Ne resta uno dei due: quello dell’account, o quello che hai appena creato su questo telefono.',
    daConta: 'Tieni quello dell’account',
    daContaSub: 'Quello che è su questo telefono esce da qui, e il diario dell’account scende qui.',
    desteTelefone: 'Tieni quello di questo telefono',
    desteTelefoneSub: 'Quello che era nell’account viene cancellato, e questo sale al suo posto.',
    confirmar: 'Cancellare il diario dell’account e tenere questo?',
    confirmarSim: 'Cancella quello dell’account',
    cancelar: 'Annulla',
  },

  outraConta: {
    titulo: 'Questo diario è di un altro account',
    lead: 'Quello che è su questo telefono è stato salvato in un altro account, e non sale su questo. Accedi con il suo account, o inizia un diario nuovo.',
    entrarComADona: 'Accedi con l’altro account',
    comecarDeNovo: 'Inizia un diario nuovo',
    comecarPergunta: 'Il diario di questo telefono esce da qui, e resta nell’altro account. Ricominciare?',
    comecarSim: 'Ricomincia',
  },

  linha: {
    titulo: 'Il tuo account',
    guardado: 'Tutto salvato',
    guardando: 'Salvataggio…',
    semInternet: 'Niente internet — salviamo quando torna la connessione',
    entrarDeNovo: 'Accedi di nuovo',
    semConta: 'Niente internet — creiamo il tuo account quando torna la connessione',
    contaApagada: 'Questo account è stato cancellato',
  },

  sair: {
    rotulo: 'Esci dall’account',
    pergunta: 'Il diario esce da questo telefono e resta salvato nel tuo account. Per rivederlo qui, basta accedere.',
    perguntaSemDono: 'Esci dal tuo account, e il diario resta su questo telefono. Per salvarlo nell’account, basta rientrare.',
    pendente: 'Ci sono ancora registrazioni che non sono arrivate al tuo account. Se esci ora, si perdono.',
    confirmar: 'Esci',
    cancelar: 'Resta',
    semConta: 'Rifai la registrazione',
  },

  apagada: {
    titulo: 'Questo account è stato cancellato',
    lead: 'Il diario non esiste più nell’account. Anche la copia rimasta su questo telefono può andare.',
    limpar: 'Togli il diario da questo telefono',
  },

  apagarConta: {
    sub: 'L’account e tutto quello che conserva, senza ritorno',
    pergunta: (dias: number) =>
      `Cancellare l’account e tutto quello che conserva, qui e nel nostro database? Le copie di sicurezza spariscono entro ${dias} giorni, e un altro dispositivo in cui hai fatto l’accesso tiene la sua copia finché non esci dall’account lì.`,
    apagando: 'Cancellazione…',
    semInternet: 'Cancellare l’account richiede internet. Non è stato cancellato niente.',
    falhou: 'Non siamo riusciti a cancellarlo ora. Non è stato cancellato niente — riprova tra un attimo.',
  },

  jaTenho: 'Ho già un account',
};
