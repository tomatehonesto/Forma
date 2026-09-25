/* Das Konto — die Gründe stehen im Kopf von pt-BR/conta. */

export const conta = {
  titulo: {
    cadastro: 'Erstelle dein Konto',
    abertura: 'Melde dich bei deinem Konto an',
    sessao: 'Melde dich erneut an',
  },
  lead: {
    cadastro: 'Dort bewahren wir dein Tagebuch auf. Wenn du dein Handy wechselst oder verlierst, kommt es vollständig zurück, sobald du dich anmeldest.',
    abertura: 'Wir holen dein Tagebuch auf dieses Handy zurück.',
    sessao: 'Deine Sitzung ist abgelaufen. Was du eingetragen hast, ist noch hier, und wir speichern es in deinem Konto, sobald du dich anmeldest.',
  },
  comEmail: 'Mit E-Mail weiter',
  semSenha: 'Ohne Passwort: Wir schicken dir einen Code per E-Mail.',

  emailTitulo: 'Wie lautet deine E-Mail?',
  emailLead: (digitos: number) => `Wir schicken dir einen ${digitos}-stelligen Code.`,
  emailCampo: 'du@beispiel.de',
  enviarCodigo: 'Code schicken',
  emailIncompleto: 'Diese E-Mail scheint unvollständig.',

  codigoTitulo: 'Gib den Code ein',
  codigoLead: (email: string, minutos: number) =>
    `Wir haben ihn an ${email} geschickt. Er gilt ${minutos} Minuten — wenn er nicht ankommt, sieh auch im Spam nach.`,
  entrar: 'Anmelden',
  reenviar: 'Neuen Code schicken',
  reenviarEm: (segundos: number) => `Neuer Code in ${segundos} s`,
  outroEmail: 'Andere E-Mail verwenden',
  voltar: 'Zurück',
  tentarDeNovo: 'Noch einmal versuchen',

  guardando: 'Wir speichern dein Tagebuch…',
  trazendo: 'Wir holen dein Tagebuch zurück…',

  erro: {
    semInternet: 'Für das Konto oder die Anmeldung braucht es Internet. Was du schon geschrieben hast, bleibt hier, und wir versuchen es wieder, sobald die Verbindung zurück ist.',
    codigoErrado: 'Dieser Code stimmt nicht oder ist abgelaufen. Prüf die Ziffern, oder lass dir einen neuen schicken und nimm den neuesten.',
    muitosPedidos: 'Zu viele Anfragen hintereinander. Warte eine Minute und versuch es noch einmal.',
    apple: 'Apple hat die Anmeldung nicht bestätigt. Versuch es noch einmal, oder mach mit E-Mail weiter.',
    outro: 'Das hat gerade nicht geklappt. Versuch es gleich noch einmal.',
  },

  doisDiarios: {
    titulo: 'Dieses Konto hat schon ein Tagebuch',
    lead: 'Eins der beiden bleibt: das im Konto, oder das, das du gerade auf diesem Handy angelegt hast.',
    daConta: 'Das aus dem Konto behalten',
    daContaSub: 'Was auf diesem Handy ist, verschwindet von hier, und das Tagebuch aus dem Konto kommt hierher.',
    desteTelefone: 'Das von diesem Handy behalten',
    desteTelefoneSub: 'Was im Konto war, wird gelöscht, und dieses kommt an seine Stelle.',
    confirmar: 'Das Tagebuch im Konto löschen und dieses behalten?',
    confirmarSim: 'Das im Konto löschen',
    cancelar: 'Abbrechen',
  },

  outraConta: {
    titulo: 'Dieses Tagebuch gehört zu einem anderen Konto',
    lead: 'Was auf diesem Handy ist, wurde in einem anderen Konto gespeichert und geht nicht in dieses. Melde dich mit seinem Konto an, oder beginne ein neues Tagebuch.',
    entrarComADona: 'Mit dem anderen Konto anmelden',
    comecarDeNovo: 'Neues Tagebuch beginnen',
    comecarPergunta: 'Das Tagebuch auf diesem Handy verschwindet von hier und bleibt im anderen Konto. Neu anfangen?',
    comecarSim: 'Neu anfangen',
  },

  linha: {
    titulo: 'Dein Konto',
    guardado: 'Alles gespeichert',
    guardando: 'Wird gespeichert…',
    semInternet: 'Kein Internet — wir speichern, sobald die Verbindung zurück ist',
    entrarDeNovo: 'Melde dich erneut an',
    semConta: 'Kein Internet — wir erstellen dein Konto, sobald die Verbindung zurück ist',
    contaApagada: 'Dieses Konto wurde gelöscht',
  },

  sair: {
    rotulo: 'Abmelden',
    pergunta: 'Das Tagebuch verschwindet von diesem Handy und bleibt in deinem Konto gespeichert. Um es hier wiederzusehen, melde dich einfach an.',
    pendente: 'Einige Einträge sind noch nicht in deinem Konto angekommen. Wenn du dich jetzt abmeldest, gehen sie verloren.',
    confirmar: 'Abmelden',
    cancelar: 'Bleiben',
    semConta: 'Registrierung neu machen',
  },

  apagada: {
    titulo: 'Dieses Konto wurde gelöscht',
    lead: 'Das Tagebuch gibt es im Konto nicht mehr. Die Kopie auf diesem Handy kann auch weg.',
    limpar: 'Tagebuch von diesem Handy entfernen',
  },

  apagarConta: {
    sub: 'Das Konto und alles darin, ohne Weg zurück',
    pergunta: 'Das Konto und alles, was du eingetragen hast, löschen? Es bleibt nirgends eine Kopie.',
    apagando: 'Wird gelöscht…',
    semInternet: 'Für das Löschen des Kontos braucht es Internet. Es wurde nichts gelöscht.',
    falhou: 'Das Löschen hat gerade nicht geklappt. Es wurde nichts gelöscht — versuch es gleich noch einmal.',
  },

  jaTenho: 'Ich habe schon ein Konto',
};
