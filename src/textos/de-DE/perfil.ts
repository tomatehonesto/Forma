/* O PERFIL · de-DE — ver o cabeçalho do pt-BR para as regras.

   ⚠️ „Deine Daten“ und „Deine Angaben“ sind hier ZWEI Bildschirme: der
   eine sind die Antworten aus der Anmeldung (`seusDados`), der andere ist
   der Datenschutz-Bildschirm (`privacidade`). Im Portugiesischen heißen
   sie „Seus dados“ und „Privacidade e dados“; wer beide gleich benennt,
   baut zwei Türen mit demselben Schild. */

export const perfil = {
  naoInformado: 'Nicht angegeben',
  nenhuma: 'Keine',
  especialista: 'Fachärztin oder Facharzt',
  dia: (numero: number) => `Tag ${numero}`,
  inicial: 'Start',
  atual: 'Heute',
  meta: 'Ziel',

  consultaEm: (quando: string) => `Termin ${quando}`,
  naoLidas: (quantas: number) => `${quantas} ungelesen`,

  planoECobranca: 'Tarif und Abrechnung',
  suaAssinatura: 'Dein Abo',

  acompanhamento: 'Begleitung',
  metasDiarias: 'Tagesziele',
  metasDiariasSub: (proteina: number, agua: string) => `${proteina} g Eiweiß · ${agua} L Wasser`,
  lembretes: 'Erinnerungen',
  lembretesSub: 'Dosis, Wiegen, Wasser und Eiweiß',
  dispositivos: 'Geräte und Anbindungen',
  dispositivosSub: 'Apple Health, Withings und mehr',

  oQueVoceJaFez: 'Was du schon geschafft hast',
  conquistas: 'Erfolge',
  conquistasSub: 'Was du in der Behandlung schon erreicht hast',

  sobreVoce: 'Über dich',
  seusDados: 'Deine Angaben',
  seusDadosSub: 'Größe, Gewicht, Tempo und mehr',
  exames: 'Befunde',
  examesSub: 'Die Laborwerte, erklärt',
  seuTratamento: 'Deine Behandlung',
  seuTratamentoSub: 'Alles, was du eingetragen hast, Woche für Woche',

  personalize: 'Die App einrichten',
  aparencia: 'Aussehen',
  aparenciaSub: (paleta: string, escuro: boolean) =>
    `${paleta}, ${escuro ? 'dunkler' : 'heller'} Modus · wähl die Farbe der App`,
  idiomaSub: (idioma: string) => idioma,
  unidades: 'Maßeinheiten',
  unidadesSub: (sistema: string, unidades: string) => `${sistema} · ${unidades}`,

  ajudaEDados: 'Hilfe und Daten',
  privacidade: 'Datenschutz und Daten',
  privacidadeSub: 'Was auf dem Gerät bleibt, exportieren, löschen und die Dokumente',
  ajuda: 'Hilfe',
  ajudaSub: 'Häufige Fragen zur App',

  reportar: 'Ein Problem melden',
  reportarSub: 'Erzähl, was passiert ist — wir hängen die App-Version an',
  problemaAssunto: 'Morphi — Problem',
  problemaSistema: (sistema: string, versao: string) => `System: ${sistema} ${versao}`,
  problemaPaleta: (paleta: string, escuro: boolean) =>
    `Palette: ${paleta} · Thema: ${escuro ? 'Dunkel' : 'Hell'}`,
  problemaCorpo: 'Erzähl, was du gerade gemacht hast und was passiert ist.',

  sair: 'Abmelden',
  versao: (numero: string) => `Morphi · Version ${numero}`,
};
