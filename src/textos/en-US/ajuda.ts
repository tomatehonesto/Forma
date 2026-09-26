/* ============================================================
   HELP — the eight questions, and why these eight · en-US

   ⚠️ The reasons live in ../pt-BR/ajuda. The one that governs: EVERY
   ANSWER IS A RULE FROM THE CODE, not a marketing promise. "Achievements
   come from your logs" is written in conquistas.ts; "notifications depend
   on the phone's permission" is in avisos.ts.

   Anyone translating needs to know that before softening a sentence: the
   uninstall answer says there is no copy anywhere because there is none,
   not because it sounds honest to say so.

   ⚠️ And there is NO CONTACT LINE yet. A "get in touch" that goes nowhere
   is the worst line a help screen can have: it shows up precisely for
   people who already couldn't solve it alone.
   ============================================================ */

export const ajuda = {
  titulo: 'Help',
  lead: 'The questions this app tends to raise, answered by what it actually does.',
  perguntasFrequentes: 'Common questions',

  qa: [
    {
      q: 'Where do the numbers here come from?',
      a: 'All of them are calculations on what you logged — weight, shots, check-ins, meals, labs. The app doesn’t fill in what’s missing and doesn’t estimate what you didn’t say: a day without an answer shows up as a day without an answer, not as zero.',
    },
    {
      q: 'Can I fix or delete an entry?',
      a: 'You can, right where it appears. Weigh-ins and measurements are deleted in the marker detail; meals and workouts are deleted by opening the entry in that day’s diary. Whatever you delete drops out of the math immediately — including the charts and the visit summary.',
    },
    {
      q: 'Why did an achievement disappear?',
      a: 'Because it was never stored. Achievements are counted from your logs every time the screen opens, not marked as done somewhere. If the entry that closed a level gets deleted, the level goes with it — as far as the count goes, it never happened.',
    },
    {
      q: 'I set a reminder and it didn’t go off.',
      /* ⚠️ "Morphi" is the app's name and isn't translated: it's what the
         person sees in the system's permission list. */
      a: 'The phone is what rings, and it only rings with permission. If notifications are denied for Morphi in your system settings, your alerts stay saved here and nothing sounds. The Reminders screen shows when that’s the case and takes you to the permission.',
    },
    {
      q: 'Can my weight come from the scale on its own?',
      a: 'If your scale, watch or ring writes to Apple Health (iPhone) or Health Connect (Android), yes — we read from there. We read only weight, and we only read: we never write anything into those apps. Garmin, Fitbit, Withings, Oura and Whoop all come in that way.',
    },
    {
      q: 'What can my care team see?',
      a: 'Nothing, until you connect with a partner clinic using its code. With the connection, the team sees your journal while it lasts, and the full list of what it gets to see shows up before you connect. Your questions to Morphi stay out, and you can disconnect anytime on the clinic’s screen.',
    },
    {
      q: 'Does Morphi replace medical care?',
      a: 'No, and on no screen. What we do is organize what happened and show patterns in your own logs. We don’t diagnose or prescribe: dose, symptoms and treatment decisions belong with a health professional — and when something in the app touches those subjects, it says so.',
    },
    {
      q: 'What if I uninstall the app?',
      a: 'Your journal is kept in your account: reinstall, sign in, and it comes back whole. Only what you logged offline, and hadn’t reached your account yet, is lost. And if you want your own copy, you can build a file in Export.',
    },
  ] as { q: string; a: string }[],

  ondeResolver: 'Where to sort it out',
  lembretes: 'Reminders',
  lembretesSub: 'Create, edit and check notification permission',
  integracoes: 'Devices and connections',
  integracoesSub: 'Connect Apple Health or Health Connect',
  privacidade: 'Privacy and data',
  privacidadeSub: 'Where your journal is kept and what leaves it',
  exportar: 'Export your data',
  exportarSub: 'Build a file with what you logged',

  /* "Fale com a gente" — ver ../pt-BR/ajuda.ts */
  faleConosco: 'Talk to us',
  escreverParaNos: 'Write to us',
  emailAssunto: 'Morphi — help',

  emergenciaTitulo: 'If a symptom is serious',
  emergenciaTexto: 'This screen is about the app. If something in your body needs attention right now, reach your care team or emergency services — don’t wait for the next visit.',
};
