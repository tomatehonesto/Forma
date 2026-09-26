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
  isencaoTexto: 'We keep what you log, show you how things have been going, and put together what you’ll take to your appointment. We’re not a diagnosis and we don’t prescribe: dose, interval and medication are decisions for whoever follows your care.',
  isencaoReforco: 'Before changing anything about your dose or your timing, talk to your care team. And if a symptom scares you, don’t wait for the next appointment.',
  isencaoAceite: 'I understand and agree',

  guardadoTitulo: 'What you log is kept in your account',
  guardadoTexto: 'Weight, symptoms, shots, labs and notes live on this phone and in our database in São Paulo, tied to your account. That way your journal isn’t lost if you switch or lose your phone. Only your account can read what’s yours.',

  usoTitulo: 'What your data is used for',
  usoTexto: 'To build your daily goals, follow how the treatment is going, and organize what you bring to your appointment. None of that is a diagnosis, and the app doesn’t prescribe or adjust a dose.',

  /* ⚠️ THE PART A CONSENT NOTICE USUALLY LEAVES OUT, and the only one
     here that changes what the person decides. */
  saiTitulo: 'What else can leave here, and only with a move from you',
  saiTexto: 'Your journal, to the clinic you connect with using its code, after you see what it gets to see. And the photo of your plate, when you use photo reading: it’s sent to be read and isn’t kept.',

  controleTitulo: 'You stay in control',
  controleTexto: 'You can fix and delete any entry, export everything to a file, and erase your data entirely, at any time, in settings.',

  perguntasTitulo: 'Your questions to Morphi',
  perguntasTexto: 'If you let us, we read the questions you ask Morphi to understand which doubts come up and to improve the answers. We read them without knowing who asked, and the clinic never reads them. It starts off, and saying no changes nothing in the app.',
  perguntasEscolha: 'Allow my questions to be read',
  perguntasDetalhe: 'Turning it on also sends the questions already here. You can turn it off anytime in Privacy and data, and the ones sent are deleted.',

  consentimentoNovo: {
    titulo: 'We changed how we keep your journal',
    lead: 'It’s now also kept in your account, in our database, so it isn’t lost when you switch phones. Before you go on, read what changed.',
    aceitar: 'Agree and continue',
    recusar: 'I don’t agree',
    recusaTitulo: 'Without agreeing, you can’t go on',
    recusaTexto: 'The app now keeps your journal in your account, and doesn’t work without it. If you don’t agree, you can take your data in a file and delete everything from this device. Nothing is deleted unless you ask.',
    exportar: 'Export my data',
    apagar: 'Delete my data from this device',
    apagarPergunta: 'Delete everything from this device? This can’t be undone.',
    apagarConfirma: 'Delete',
    voltar: 'Go back and read again',
  },

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
  exportacaoPerguntasRecentes: 'Offline, only this device’s recent questions came along. With a connection, the file brings all the ones in your account.',

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
    completo: 'The complete journal',
    completoSub: 'Everything your account keeps, with no date range, including your questions',

    formatoTitulo: 'You get a .json file',
    formatoTexto: 'It’s the format another app can open and read — good for keeping a copy or moving your entries somewhere else. For a version made to be read by a person, use the appointment summary.',

    gerar: 'Build the file',
    gerando: 'Building...',
    verResumo: 'View appointment summary',

    pronto: 'File built. It only goes where you choose.',
    erro: 'We couldn’t build the file on this device. Your entries are still here, untouched.',
    parado: 'The file is only built when you tap the button.',
  },

  telaPrivacidade: {
    titulo: 'Privacy and data',
    lead: 'Where your entries live, what leaves here, and what the app reads from outside.',

    ondeFicam: 'Where your entries live',
    noAparelho: 'On your device and in your account',
    noAparelhoTexto: 'Weight, measurements, shots, check-ins, lab results and notes live on this device and in our database in São Paulo, tied to your account. Only your account reads your journal — and the clinic you connect with, while the connection lasts. Body photos stay only here.',
    desinstalar: 'Uninstalling doesn’t take your journal with it',
    desinstalarTexto: 'It comes back when you sign in to your account, on this device or another. Only what was logged offline and hasn’t reached your account yet would be lost with the app.',

    oQueSai: 'What leaves here',
    oQueSaiNota: 'Only the first one goes on its own. The rest depends on a move from you.',
    paraConta: 'Your journal, to your account',
    paraContaTexto: 'Your entries and profile go to our database whenever there’s a connection. That’s what keeps your journal across devices.',
    paraEquipe: 'What your clinic sees',
    paraEquipeTexto: 'Nothing, until you connect with a partner clinic using its code. Before connecting, you see the list of what it gets to see; it sees it while the connection lasts, and you can disconnect on the clinic’s screen. The appointment summary is built here, and leaves when you show or export it.',
    perguntas: 'Your questions to Morphi',
    perguntasTexto: 'Only if you allow reading, with the switch below. We read them without knowing who asked, and the clinic never does. Turning it off deletes the ones sent.',
    ditado: 'Your voice, when you use the microphone',
    ditadoTexto: 'Turning speech into text is done by your phone’s system. We ask for it to happen on the device itself, but without on-device recognition for your language, the system may send the audio to Apple or Google. Only while the microphone is on.',
    fotoDoPrato: 'The photo of your plate, when you use photo reading',
    fotoDoPratoTexto: 'It’s shrunk on the device and sent to be read by a model, which returns the items on the plate. The image isn’t kept: not in your meal entry, and not on the server in between. Logging the meal by hand sends nothing.',

    leDeFora: 'What the app reads from outside',
    appDeSaudePadrao: 'the phone’s health app',
    soOPeso: (app: string) => `${app}, and weight only`,
    soOPesoTexto: (app: string) =>
      `With your permission, we read the weigh-ins your scale, your watch or another app wrote there. We only read: we never write anything into ${app}. And we read weight only — sleep, steps and heart rate stay out.`,
    permissao: 'The permission is yours, and you can take it back',
    permissaoTexto: 'It’s granted in the system settings and revoked in the same place. Without it, everything here still works: weight goes back to arriving the way it did before, typed in by you.',

    podeFazer: 'What you can do right now',
    integracoesSub: (app: string) => `Turn ${app} on or off`,
    resumo: 'Appointment summary',
    resumoSub: 'See everything that goes into the appointment summary',

    apagar: 'Delete my data',
    apagarSub: 'Everything you logged, with no way back',
    apagarPergunta: 'Delete everything from this device? This journal has no account yet, and there’s no copy of it anywhere else.',
    apagarConfirma: 'Delete',
    cancelar: 'Cancel',

    documentos: 'The documents',
    politicaSub: 'The full document, with legal basis and retention periods',
    termosSub: 'What we are, what we’re not, and what each side can expect',
    semPoliticaTitulo: 'This describes the app; it’s not the privacy policy',
    semPoliticaTexto: 'Here is what the app does with your data. The legal document, with the obligations of whoever runs the service, hasn’t been published yet — and when it exists, it shows up on this screen.',
  },

  telaIntegracoes: {
    titulo: 'Integrations',
    lead: 'Turned on, they bring in your weigh-ins without you typing them.',

    doSeuAparelho: 'From your device',
    doSeuAparelhoNota: 'It’s the device’s own health store: we ask for permission and read. No account and no password.',

    atualizarAgora: 'Refresh now',
    lendo: 'Reading…',
    nadaNovo: 'Nothing new over there — we already had all your weigh-ins.',
    trazidas: (quantas: number, aparelho: string) =>
      `${quantas} ${quantas === 1 ? 'weigh-in brought' : 'weigh-ins brought'} from ${aparelho}.`,
    naoDeuParaLer: 'We could not read it just now. Try again in a moment.',
    acessoNegado: 'Permission wasn’t granted. You can change that in the device settings.',

    semAparelhoTitulo: 'The device’s health app shows up on a phone',
    semAparelhoTexto: 'Apple Health on iPhone, Health Connect on Android. In a browser there’s nothing to turn on.',
    semAppTitulo: (aparelho: string) => `${aparelho} is not available on this device`,
    semAppTexto: 'Health Connect ships with Android 14 onwards and can be installed on earlier versions. Once it’s installed, come back here.',
    semBuildTitulo: 'This build of the app can’t read the device yet',
    semBuildTexto: 'Reading Apple Health and Health Connect needs an installed build of the app, not the preview. It isn’t available in Expo Go.',

    contasDeServico: 'Service accounts',
    contasDeServicoNota: 'These hand the data to a server, not to the phone — the link comes in once that server is up. In the meantime, whatever they send to your device’s health app already arrives here.',
    emBreve: 'Coming soon',
  },
};
