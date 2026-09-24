/* ============================================================
   REMINDERS — the five types and how each one describes itself · en-US

   ⚠️ Reasons live in ../pt-BR/alertas.ts. Each type has three pieces, and
   the middle one exists because of width: `titulo` is the name on the
   settings screen, `curto` is the same name on a tight line next to a
   time, and `desc` is what it does in one sentence.
   ============================================================ */

export const alertas = {
  dose: 'Your shot',
  doseCurto: 'Shot',
  doseDesc: 'A heads-up before your next dose, to keep the treatment on track.',

  /* ⚠️ THE CHECK-IN IS THE ONLY ONE THAT ASKS. The other four are about
     things the person DOES — inject, weigh, drink, eat. Which is exactly
     why it's the one most often missed: nothing in the day reminds you to
     answer. */
  checkin: 'Daily check-in',
  checkinCurto: 'Check-in',
  checkinDesc: 'One tap to say how the day went — sleep, hunger, energy and mood.',

  peso: 'Weigh-in',
  pesoCurto: 'Weigh-in',
  pesoDesc: 'A tap on the days you want to step on the scale.',

  agua: 'Hydration',
  aguaCurto: 'Hydration',
  aguaDesc: 'Little nudges to drink water — they help with fullness and nausea.',

  proteina: 'Protein',
  proteinaCurto: 'Protein',
  proteinaDesc: 'A reminder to put protein first at the day’s meals.',

  noDia: 'On the day',
  diasAntes: (n: number) => `${n} day${n > 1 ? 's' : ''} before`,

  /* ⚠️ THE THREE WEEK SHORTCUTS ARE NAMES OF A SET, not a list. "Monday,
     Tuesday, Wednesday, Thursday, Friday" is correct and nobody reads it;
     "Weekdays" is the same thing in one word. */
  todoDia: 'Every day',
  diasUteis: 'Weekdays',
  fimDeSemana: 'Weekends',
  listaDeDias: (primeiro: string, resto: string[]) =>
    primeiro + (resto.length ? `, ${resto.join(', ')}` : ''),

  aCada: (cada: number, de: number, ate: number) => `every ${cada}h, ${de}h to ${ate}h`,
  quandoEHoras: (quando: string, horas: string) => `${quando} · ${horas}`,

  tela: {
    alertaDe: (tipo: string) => `${tipo} reminder`,
    novoAlerta: 'New reminder',
    salvar: 'Save',
    criar: 'Create reminder',
    apagar: 'Delete this reminder',

    oQueAvisar: 'What to remind you of',

    antecedencia: 'How far ahead',
    antecedenciaAjuda: 'Counted from the date of your next shot.',

    diasDaSemana: 'Days of the week',
    diasDaSemanaAjuda: 'With none ticked, the reminder rings every day.',

    quandoTocar: 'When it rings',
    modoHorarios: 'Set times',
    modoIntervalo: 'Interval',

    horarios: 'Times',
    horariosAjuda: 'You can tick more than one — the reminder rings at each of them.',

    aCada: 'Every',
    aCadaHoras: (horas: number) => `${horas}h`,
    comeca: 'Starts',
    ate: 'Until',
    ateAjuda: (avisos: number, cada: number) =>
      `${avisos} reminders a day, every ${cada} hours.`,

    tocaEm: (quando: string) => `Rings ${quando}`,
    semHorario: 'No time set',
  },
  telaLembretes: {
    titulo: 'Reminders',
    lead: 'The alerts you create show up here, in the order they go off.',
    criar: 'Create an alert',

    proximo: (quando: string) => `Next: ${quando}`,
    desligado: 'Off',
    guardado: 'Saved — alerts go off on the phone',
    semAviso: 'No alert while it’s blocked',

    bloqueados: 'Alerts are blocked',
    bloqueadosTexto: 'The device is blocking notifications from this app. While it stays that way, nothing you switch on here will come through.',
    semNavegador: 'In a browser we can’t alert you',
    semNavegadorTexto: 'What you create is saved and starts working when you open the app on the phone.',
    abrirConfiguracoes: 'Open settings',

    vazio: 'No alerts yet',
    vazioTexto: (assuntos: string) => `${assuntos} — create the ones that make sense for your routine.`,

    convite: 'An alert is an invitation, not a demand. If one slips by one day, nothing here turns into a backlog.',
  },
  /* NOTIFICATIONS — see ../pt-BR/alertas.ts. The dose notice reuses
     `avisos`; stock reuses the verdict from Shots. */
  telaNotificacoes: {
    titulo: 'Notifications',
    lead: 'What we’ve told you over the last few days.',
    todos: 'All',
    origemTratamento: 'Treatment',
    origemMensagens: 'Messages',
    vazio: 'Nothing here yet',
    vazioTexto: 'When we have something to tell you, it shows up in this list.',
    configurar: 'Set up reminders',
    ligados: (n: number) => (n === 0 ? 'No reminders on' : n === 1 ? '1 reminder on' : `${n} reminders on`),

    insightTitulo: 'New insight',
    respondeu: (autor: string) => `${autor} replied`,
    examesTitulo: 'Lab results imported',
    examesCorpo: (nome: string, marcadores: number) =>
      `${nome}: ${marcadores} ${marcadores === 1 ? 'marker' : 'markers'}, sorted by date.`,
    /* `falta` arrives ready — "5 weigh-ins to go". */
    conquistaCorpo: (desc: string, falta: string) => `${desc}. ${falta} for the next level.`,
  },
};
