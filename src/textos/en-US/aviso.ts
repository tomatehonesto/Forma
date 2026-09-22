/* ============================================================
   CONSENT AND THE REST — the disclaimer, the data cards, the leftovers · en-US

   ⚠️ Reasons live in ../pt-BR/aviso.ts. The one that matters:

   THE DISCLAIMER DOESN'T DIMINISH THE APP TO PROTECT ITSELF. "This is not
   a medical app" is true and it's cowardly: whoever is reading has just
   answered thirteen questions about their own treatment, and deserves to
   know what they get, not only what they don't. The sentence says both,
   in that order — what we do, and where we stop.
   ============================================================ */

export const aviso = {
  isencaoTitulo: 'We follow your treatment — we don’t run it',
  isencaoTexto: 'We keep what you log, show you how things have been going, and get ready what you’ll bring to your appointment. We’re not a diagnosis and we don’t prescribe: dose, interval and medication are decisions for whoever follows your care.',
  isencaoReforco: 'Before changing anything about your dose or your timing, talk to your care team. And if a symptom frightens you, don’t wait for the next appointment.',
  isencaoAceite: 'I understand and agree',

  guardadoTitulo: 'What you log stays on your device',
  guardadoTexto: 'Weight, symptoms, shots, labs and notes are stored inside the app, on this phone. There’s no account and no password: nobody gets into your data with a login.',

  usoTitulo: 'What your data is used for',
  usoTexto: 'To build your daily goals, follow how the treatment is going, and organize what you bring to your appointment. None of that is a diagnosis, and the app doesn’t prescribe or adjust a dose.',

  /* ⚠️ THE PART A CONSENT NOTICE USUALLY LEAVES OUT, and the only one
     here that changes what the person decides. */
  saiTitulo: 'What can leave here, and only with a tap from you',
  saiTexto: 'The summary and the messages you send your care team. And the photo of your plate, when you use photo reading: it’s sent to be read and isn’t kept.',

  controleTitulo: 'You stay in control',
  controleTexto: 'You can fix and delete any entry, export everything to a file, and erase your data entirely, at any time, in settings.',

  /* ⚠️ ONLY APPLE'S NAME CHANGES BY LANGUAGE. Health Connect, Garmin,
     Fitbit and Withings are brands and stay in the code. */
  appleSaude: 'Apple Health',
  trazPesagens: 'Your weigh-ins — including the ones your scale sends there.',
  trazTreinos: 'Workouts and heart rate',
  trazSono: 'Sleep and steps',
  trazBalanca: 'Scale and blood pressure',

  /* ⚠️ ALL THREE END BY OFFERING THE MANUAL PATH, and that's what
     separates them from an error message: the person photographed the
     plate because they want to log it, and saying only "it didn't work"
     leaves them halfway. */
  fotoSemServidor: 'Photo reading isn’t turned on yet. You can build the plate below.',
  fotoSemRede: 'No connection to read the photo right now. You can build the plate below.',
  fotoNaoReconheci: 'I couldn’t recognize the plate. Build below what you had.',

  porMes: 'per month',
  porMesCurto: '/mo',

  exportacaoAviso: 'Entries made by the person themselves in the app. Not a medical record or a lab report.',
  exportacaoTitulo: 'Your Morphi data',

  medIndefinido: 'Not set yet',

  garrafao: 'Jug',

  /* ⚠️ THE NAMES ARE KEY AND LABEL AT ONCE — it's the `tipo` stored on
     each workout. Same family as the meal moment and the lab marker. */
  modalidades: {
    caminhada: 'Walking',
    corrida: 'Running',
    musculacao: 'Strength training',
    bike: 'Cycling',
    natacao: 'Swimming',
    yoga: 'Yoga',
    pilates: 'Pilates',
    funcional: 'Functional',
    alongamento: 'Stretching',
    outro: 'Other',
  },

  telaExportar: {
    titulo: 'Export',
    lead: 'A file with your entries, to keep or to take somewhere else.',

    periodo: 'Period',
    periodoAjuda: (de: string, ate: string, semanas: number) =>
      `From ${de} to ${ate} · ${semanas} ${semanas === 1 ? 'week' : 'weeks'}`,
    ultimas4: 'Last 4 weeks',
    desdeAConsulta: 'Since the last appointment',
    tratamentoInteiro: 'The whole treatment',

    oQueEntra: 'What goes in',
    oQueEntraNota: 'Tap to include or leave out. Whatever stays out doesn’t go into the file.',
    incluido: 'in',
    fora: 'out',

    aplicacoes: 'Shots',
    aplicacoesSub: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'entry' : 'entries'} · date, dose and site`,
    pesoEMedidas: 'Weight and measurements',
    pesoEMedidasSub: (pesagens: number, medidas: number) =>
      `${pesagens} ${pesagens === 1 ? 'weigh-in' : 'weigh-ins'} · ${medidas} ${medidas === 1 ? 'measurement' : 'measurements'}`,
    checkins: 'Check-ins',
    checkinsSub: (dias: number) => `${dias} ${dias === 1 ? 'day' : 'days'} · symptom by symptom`,
    exames: 'Lab results',
    examesSub: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'result' : 'results'} · value and reference range`,
    notas: 'Notes for the appointment',
    notasSub: (quantas: number) => `${quantas} ${quantas === 1 ? 'note' : 'notes'}`,
    habitos: 'Meals, water and exercise',
    habitosSub: (refeicoes: number) =>
      `${refeicoes} ${refeicoes === 1 ? 'meal' : 'meals'} and the day’s diary`,

    formatoTitulo: 'You get a .json file',
    formatoTexto: 'It is the format another app can open and read — good for keeping a copy or moving your entries somewhere else. For the version made for someone to read, use the appointment summary.',

    gerar: 'Build the file',
    gerando: 'Building...',
    verResumo: 'View appointment summary',

    pronto: 'File built. It only goes where you choose.',
    erro: 'We could not build the file on this device. Your entries are still here, untouched.',
    parado: 'Nothing leaves here without your tap.',
  },

  telaPrivacidade: {
    titulo: 'Privacy and data',
    lead: 'Where your entries live, what leaves here, and what the app reads from outside.',

    ondeFicam: 'Where your entries live',
    noAparelho: 'On the device, inside the app',
    noAparelhoTexto: 'Weight, measurements, shots, check-ins, lab results, photos and notes are written to the app’s own storage, on this device. There’s no account and no password here: nobody gets into your data with a login, because there’s no login.',
    desinstalar: 'Uninstalling takes it all with it',
    desinstalarTexto: 'Since there’s no copy on any server, deleting the app deletes the entries. They can’t be recovered afterwards.',

    oQueSai: 'What leaves here',
    oQueSaiNota: 'Nothing leaves here without a move from you.',
    paraEquipe: 'What goes to your team',
    paraEquipeTexto: 'For now, nothing. The appointment summary is built on your device and you’re the one who shows or exports it; messages stay here. When the link with the clinic exists, both will only leave with a tap from you — and nothing from your diary travels on its own, not weight, not symptoms, not meals.',
    fotoDoPrato: 'The photo of your plate, when you use photo reading',
    fotoDoPratoTexto: 'It’s shrunk on the device and sent to be read by a model, which returns the items on the plate. The image is not kept: not in your meal entry, and not on the server that bridges the call. Logging the meal by hand sends nothing.',

    leDeFora: 'What the app reads from outside',
    appDeSaudePadrao: 'the phone’s health app',
    soOPeso: (app: string) => `${app}, and weight only`,
    soOPesoTexto: (app: string) =>
      `With your permission, we read the weigh-ins your scale, your watch or another app wrote there. We only read: we never write anything into ${app}. And we read weight only — sleep, steps and heart rate stay out.`,
    permissao: 'The permission is yours, and you can take it back',
    permissaoTexto: 'It is granted in the system settings and revoked in the same place. Without it, the app stays whole: weight goes back to arriving the way it did before, typed in by you.',

    podeFazer: 'What you can do right now',
    integracoesSub: (app: string) => `Turn ${app} on or off`,
    resumo: 'Appointment summary',
    resumoSub: 'See everything that goes into the appointment summary',

    apagar: 'Delete my data',
    apagarSub: 'Everything you logged, with no way back',
    apagarPergunta: 'Delete everything? There is no copy anywhere.',
    apagarConfirma: 'Delete',
    cancelar: 'Cancel',

    documentos: 'The documents',
    politicaSub: 'The full document, with legal basis and retention periods',
    termosSub: 'What we are, what we’re not, and what each side can expect',
    semPoliticaTitulo: 'This describes the app; it’s not the privacy policy',
    semPoliticaTexto: 'Here is what the program does with your data. The legal document, with the obligations of whoever runs the service, is still to be published — and when it exists, it shows up on this screen.',
  },

  telaIntegracoes: {
    titulo: 'Integrations',
    lead: 'Turned on, they bring your weigh-ins in without you typing them.',

    doSeuAparelho: 'From your device',
    doSeuAparelhoNota: 'A local store: we ask for permission and read. No account and no password.',

    atualizarAgora: 'Refresh now',
    lendo: 'Reading…',
    nadaNovo: 'Nothing new over there — your weigh-ins were all already here.',
    trazidas: (quantas: number, aparelho: string) =>
      `${quantas} ${quantas === 1 ? 'weigh-in brought' : 'weigh-ins brought'} from ${aparelho}.`,
    naoDeuParaLer: 'We could not read it just now. Try again in a moment.',
    acessoNegado: 'Access was not granted. You can change that in the device settings.',

    semAparelhoTitulo: 'The device’s health app shows up on a phone',
    semAparelhoTexto: 'Apple Health on iPhone, Health Connect on Android. In a browser there is nothing to turn on.',
    semAppTitulo: (aparelho: string) => `${aparelho} is not available on this device`,
    semAppTexto: 'Health Connect ships with Android 14 onwards and can be installed on earlier versions. Once it’s installed, come back here.',
    semBuildTitulo: 'This build of the app can’t read the device yet',
    semBuildTexto: 'Reading Apple Health and Health Connect needs an installed build of the app, not the preview. It isn’t available in Expo Go.',

    contasDeServico: 'Service accounts',
    contasDeServicoNota: 'These hand the data to a server, not to the phone — the link comes in once that server is up. In the meantime, whatever they send to your device’s health app already arrives here.',
    emBreve: 'Coming soon',
  },
};
