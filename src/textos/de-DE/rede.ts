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
    subtitulo: 'Partnerpraxen begleiten die Behandlung mit der App: Das Team schreibt dir, bekommt deine Übersicht und kümmert sich hier um das Rezept.',
    comoFunciona: 'So funktioniert’s',
    passos: [
      { titulo: 'Du wählst die Praxis', texto: 'Nach Fachgebiet, Versicherung und Entfernung.' },
      { titulo: 'Du vereinbarst den ersten Termin', texto: 'Direkt mit der Praxis — per WhatsApp, telefonisch oder über ihre Online-Buchung. Dieser Kontakt läuft nicht über uns.' },
      { titulo: 'Du bekommst den Einladungscode', texto: 'Die Praxis gibt ihn dir nach dem Termin, und er verbindet deine App mit dem Team.' },
      { titulo: 'Und das Team begleitet dich', texto: 'Alles, was du schon eingetragen hast, bleibt hier — die Verbindung setzt nichts zurück.' },
    ],
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
};
