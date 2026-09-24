/* Das Partnernetzwerk — das Verzeichnis und die Seite der Fachperson.
   Siehe ../pt-BR/rede: warum es in jeder Sprache existiert, obwohl das
   Netzwerk brasilianisch ist, und was NICHT übersetzt wird (was die
   Fachperson im Portal geschrieben hat). */

export const rede = {
  titulo: 'Partnernetzwerk',
  lead: 'Fachleute, die die Behandlung mit der App begleiten. Den ersten Kontakt nimmst du direkt mit der Praxis auf.',

  exemploTitulo: 'Beispielpersonen',
  exemploTexto: 'Namen, Registernummern und Kontakte sind erfunden — nur um zu zeigen, wie das Verzeichnis aussieht. Die echte Liste kommt aus dem Portal des Netzwerks.',

  busca: 'Name oder Fachgebiet',

  localizacao: {
    usar: 'Meinen Standort verwenden',
    usarSub: 'Um die Entfernung zu jeder Praxis zu sehen. Er bleibt auf dem Gerät.',
    pedindo: 'Wir suchen deinen Standort …',
    ligada: 'Nächste zuerst',
    ligadaSub: 'Nach Entfernung sortiert. Tippen zum Ausschalten.',
    negada: 'Keine Erlaubnis für den Standort. Du kannst die Stadt in den Filtern wählen.',
    falhou: 'Wir konnten gerade nicht feststellen, wo du bist. Du kannst die Stadt in den Filtern wählen.',
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
  todas: 'Alle',

  filtros: 'Filter',
  filtrosSub: 'Stadt, Versicherung, Terminart und Tag',
  resultados: (n: number) => `${n} ${n === 1 ? 'Fachperson' : 'Fachpersonen'}`,

  aDistancia: (quanto: string) => `${quanto} entfernt`,
  soTeleconsulta: 'Nur Videosprechstunde',
  teleconsulta: 'Videosprechstunde',
  outrosLocais: (n: number) => `${n}\u00A0weitere${n === 1 ? 'r' : ''}\u00A0Standort${n === 1 ? '' : 'e'}`,
  deAte: (de: string, ate: string) => `${de}–${ate}`,
  faixa: (abre: string, fecha: string) => `${abre}\u2060–\u2060${fecha}`,
  horario: (dias: string, faixa: string) => `${dias} · ${faixa}`,

  vazioTitulo: 'Niemand passt zu diesen Filtern',
  vazioTexto: 'Versuch ein anderes Fachgebiet oder nimm einen der Filter heraus.',
  limparFiltros: 'Filter zurücksetzen',
  erroTitulo: 'Wir konnten das Netzwerk nicht öffnen',
  erroTexto: 'Prüf deine Verbindung und versuch es noch einmal.',
  tentarDeNovo: 'Noch einmal versuchen',

  jaTenhoCodigo: 'Ich habe einen Einladungscode',

  folha: {
    titulo: 'Filter',
    cidade: 'Stadt',
    todasAsCidades: 'Alle',
    modalidade: 'Terminart',
    todas: 'Alle',
    presencial: 'Vor Ort',
    teleconsulta: 'Videosprechstunde',
    convenio: 'Versicherung',
    qualquer: 'Egal',
    particular: 'Selbstzahler',
    dia: 'Sprechstunde am',
    qualquerDia: 'Jeder Tag',
    ver: (n: number) => (n ? `${n} ${n === 1 ? 'Fachperson' : 'Fachpersonen'} anzeigen` : 'Keine Fachperson'),
    limpar: 'Zurücksetzen',
  },

  ficha: {
    sobre: 'Vorstellung',
    ondeAtende: 'Sprechstunden',
    presencialETele: 'Vor Ort und per Video',
    soPresencial: 'Vor Ort',
    convenios: 'Versicherungen',
    soParticular: 'Nur Selbstzahler',
    particularNaLista: 'Selbstzahler',
    comoChegar: 'Route',
    falar: 'Praxis kontaktieren',
    falarNota: 'Die Kanäle, die die Praxis angegeben hat. Jeder öffnet sich außerhalb der App.',
    agenda: 'Online buchen',
    exemploContatos: 'Beispielkontakte — sie öffnen nichts.',
    proximoTitulo: 'Nach dem ersten Termin',
    proximoTexto: 'Die Praxis gibt dir einen Einladungscode. Er verbindet die Begleitung mit der App — Nachrichten zwischen den Terminen, deine Übersicht beim Team und Termine, die schon eingetragen sind.',
    jaTenhoCodigo: 'Ich habe einen Code',
    naoEncontrado: 'Diese Fachperson ist nicht im Netzwerk.',
  },
};
