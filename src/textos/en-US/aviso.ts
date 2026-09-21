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
  isencaoTexto: 'We keep what you log, show you how things have been going, and get ready what you’ll bring to your appointment. We are not a diagnosis and we don’t prescribe: dose, interval and medication are decisions for whoever follows your care.',
  isencaoReforco: 'Before changing anything about your dose or your timing, talk to your care team. And if a symptom frightens you, don’t wait for the next appointment.',
  isencaoAceite: 'I understand and agree',

  guardadoTitulo: 'What you log stays on your device',
  guardadoTexto: 'Weight, symptoms, injections, labs and notes are stored inside the app, on this phone. There’s no account and no password: nobody gets into your data with a login.',

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
};
