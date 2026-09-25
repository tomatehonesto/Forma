/* Das Partnernetzwerk — das Verzeichnis, seine Filter und die Karte im
   Tab Betreuung. Siehe ../pt-BR/rede: warum es in jeder Sprache existiert,
   obwohl das Netzwerk brasilianisch ist, und was NICHT übersetzt wird
   (was die Praxis im Portal geschrieben hat). */

export const rede = {
  titulo: 'Partnerpraxen',
  lead: 'Praxen, die die Behandlung mit der App begleiten. Den ersten Kontakt nimmst du direkt mit ihnen auf.',

  exemploTitulo: 'Beispielpraxen',
  exemploTexto: 'Namen, Registernummern und Kontakte sind erfunden — nur um zu zeigen, wie das Verzeichnis aussieht. Die echte Liste kommt aus dem Portal des Netzwerks.',

  busca: 'Praxis, Ärztin, Arzt oder Fachgebiet',

  perto: 'In meiner Nähe',
  localizacao: {
    pedindo: 'Wir suchen deinen Standort …',
    negada: 'Keine Erlaubnis für den Standort. Du kannst eine Stadt wählen.',
    falhou: 'Wir konnten gerade nicht feststellen, wo du bist. Du kannst eine Stadt wählen.',
  },

  filtro: {
    especialidade: 'Fachgebiet',
    convenio: 'Versicherung',
    modalidade: 'Terminart',
    dia: 'Tag',
    cidade: 'Stadt',
  },

  /* „Nutrologia“ ist in Brasilien ein ärztliches Fachgebiet; „Nutrição“
     ist die Ernährungsberatung. Zwei verschiedene Berufe. */
  especialidades: {
    endocrinologia: 'Endokrinologie',
    nutrologia: 'Ernährungsmedizin',
    nutricao: 'Ernährungsberatung',
    esporte: 'Sportmedizin',
    psicologia: 'Psychologie',
  },

  resultados: (n: number) => `${n} ${n === 1 ? 'Praxis' : 'Praxen'}`,

  aDistancia: (quanto: string) => `${quanto} entfernt`,
  lugarEDistancia: (lugar: string, distancia: string) => `${lugar} • ${distancia}`,
  soTeleconsulta: 'Nur Videosprechstunde',
  soPresencial: 'Vor Ort',
  presencialETele: 'Vor Ort und per Video',
  teleconsulta: 'Videosprechstunde',
  particular: 'Selbstzahler',
  aceita: (convenio: string) => `Akzeptiert ${convenio}`,
  aceitaConvenios: 'Versicherung möglich',
  atendeHoje: 'Heute offen',
  deAte: (de: string, ate: string) => `${de}–${ate}`,
  faixa: (abre: string, fecha: string) => `${abre}\u2060–\u2060${fecha}`,
  horario: (dias: string, faixa: string) => `${dias} · ${faixa}`,

  vazioTitulo: 'Keine Praxis passt zu diesen Filtern',
  vazioTexto: 'Versuch ein anderes Fachgebiet oder nimm einen der Filter heraus.',
  limparFiltros: 'Filter zurücksetzen',
  erroTitulo: 'Wir konnten das Netzwerk nicht öffnen',
  erroTexto: 'Prüf deine Verbindung und versuch es noch einmal.',
  tentarDeNovo: 'Noch einmal versuchen',

  jaTenhoCodigo: 'Ich habe einen Einladungscode',

  apresentacao: {
    tag: 'Partnerpraxen',
    titulo: 'Enge Begleitung — auch zwischen den Terminen',
    subtitulo: 'Partnerpraxen begleiten deine Behandlung mit der App: Das Team schreibt dir, verfolgt deine Fortschritte und bekommt die Informationen aus deinem Verlauf.',
    comoFunciona: 'So funktioniert’s',
    passos: [
      { titulo: 'Finde eine Praxis', texto: 'Wähle nach Fachgebiet, Versicherung oder Entfernung.' },
      { titulo: 'Vereinbare deinen ersten Termin', texto: 'Melde dich direkt bei der Praxis und buche deinen Termin.' },
      { titulo: 'Erhalte deinen Einladungscode', texto: 'Die Praxis schickt dir den Code nach dem Termin. Er verbindet deine App mit dem Team.' },
      { titulo: 'Das Team begleitet deine Behandlung', texto: 'Alles, was du schon eingetragen hast, bleibt hier. Die Verbindung mit der Praxis löscht nichts.' },
    ],
    isencaoTitulo: 'Und noch etwas: Du zahlst nichts für Morphi',
    isencaoTexto: 'Wer bei einer Partnerpraxis in Behandlung ist, nutzt die App kostenlos.',
    conhecer: 'Partnerpraxen kennenlernen',
    credito: 'Bild von Drazen Zigic auf Magnific',
  },

  folha: {
    especialidade: 'Fachgebiet',
    convenio: 'Versicherung',
    modalidade: 'Terminart',
    dia: 'Sprechstundentag',
    cidade: 'Stadt',
    todas: 'Alle',
    qualquer: 'Egal',
    qualquerDia: 'Jeder Tag',
    todasAsCidades: 'Alle Städte',
    presencialOuTele: 'Vor Ort oder per Video',
    presencial: 'Vor Ort',
    teleconsulta: 'Videosprechstunde',
    limpar: 'Zurücksetzen',
  },

  cartao: {
    tag: 'Partnerpraxen',
    titulo: 'Fachleute an deiner Seite',
    texto: 'Praxen, die Morphi nutzen, um ihre Patientinnen und Patienten eng zu begleiten, den Verlauf der Behandlung zu verfolgen und ihre Ergebnisse zu verbessern.',
    acao: 'Praxen ansehen',
    saibaMais: 'Mehr erfahren',
  },

  /* Die Verbindung auf dem Server — siehe den Kopf des Blocks in pt-BR/rede. */
  vinculo: {
    titulo: 'Was die Praxis sehen wird',
    itens: {
      peso: 'Wiegungen',
      aplicacao: 'Injektionen',
      checkin: 'Check-ins: Symptome, Schlaf, Hunger, Wasser, Eiweiß und Bewegung',
      refeicao: 'Mahlzeiten',
      refeicao_favorita: 'Lieblingsmahlzeiten',
      medida: 'Körpermaße',
      exame: 'Laborwerte',
      laudo: 'Befunde',
      sinal_vital: 'Vitalwerte',
      documento: 'Dokumente',
      anotacao: 'Notizen',
      meta_pessoal: 'Persönliche Ziele',
      caneta: 'Die Behälter deines Medikaments',
      pessoal: 'Deine Daten: Name, Geburtsdatum, Größe und Foto',
      tratamento: 'Die Behandlung, mit deiner Krankengeschichte: Erkrankungen, Allergien und Medikamente',
      acompanhamento: 'Wer dich begleitet, und die Termine, die du notiert hast',
      protocolo: 'Das Wochenprotokoll und die Ziele',
      preferencias: 'App-Einstellungen, wie Sprache und Erinnerungen',
      vistos: 'Was die App dir schon gezeigt hat',
    },
    antes: 'Dazu gehört auch, was du vor dem Verbinden eingetragen hast.',
    perguntas: 'Die Fragen, die du Morphi stellst, gehören nicht dazu.',
    dura: 'Die Praxis sieht es, solange die Verbindung besteht. Du kannst dich jederzeit trennen, auf dem Bildschirm der Praxis.',
    guarda: 'Was während der Begleitung eingetragen wird, bleibt bei der Praxis gespeichert, als Patientenakte, auch nach dem Trennen.',
    aceitar: 'Verbinden heißt, der Weitergabe oben zuzustimmen.',
    semInternet: 'Für die Prüfung des Codes braucht es Internet. Versuch es wieder, sobald die Verbindung zurück ist.',
    naoValeuAgora: 'Dieser Code gilt nicht: Er wurde schon benutzt oder ist abgelaufen. Frag die Praxis nach einem neuen.',
    entrarPrimeiro: 'Um dich zu verbinden, melde dich erneut bei deinem Konto an. Der Code bleibt gespeichert.',
    guardadoTitulo: 'Code gespeichert',
    guardadoTexto: 'Wir verbinden die Praxis, sobald dein Konto erstellt ist.',
    desconectar: 'Von der Praxis trennen',
    desconectarPergunta: 'Das Team sieht dein Tagebuch nicht mehr, und die Befreiung der App über die Praxis endet. Alle deine Einträge bleiben hier.',
    desconectarSim: 'Trennen',
    desconectarCancelar: 'Abbrechen',
    desconectarSemInternet: 'Für das Trennen braucht es Internet. Es hat sich nichts geändert.',
    avisoEncerrouTitulo: 'Die Praxis hat die Begleitung beendet',
    avisoEncerrouTexto: 'Dein Tagebuch ist noch hier, vollständig.',
    avisoNaoConfirmadoTitulo: 'Der Einladungscode wurde nicht bestätigt',
    avisoNaoConfirmadoTexto: 'Er wurde nie mit der Praxis abgeglichen. Du kannst ihn im Tab Betreuung neu eingeben.',
    avisoNaoValeuTitulo: 'Der Einladungscode gilt nicht',
    avisoNaoValeuTexto: 'Er war schon benutzt oder abgelaufen. Du kannst im Tab Betreuung einen anderen eingeben.',
  },
};
