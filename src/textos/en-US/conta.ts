/* The account — see the header of pt-BR/conta for the reasons. */

export const conta = {
  titulo: {
    cadastro: 'Create your account',
    abertura: 'Sign in to your account',
    sessao: 'Sign in again',
  },
  lead: {
    cadastro: 'It’s where we keep your journal. If you change or lose your phone, it comes back in full when you sign in.',
    abertura: 'We’ll bring your journal back to this phone.',
    sessao: 'Your session ended. What you logged is still here, and we’ll save it to your account as soon as you sign in.',
  },
  comEmail: 'Continue with email',
  semSenha: 'No password: we send a code to your email.',

  emailTitulo: 'What’s your email?',
  emailLead: (digitos: number) => `We’ll send it a ${digitos}-digit code.`,
  emailCampo: 'you@example.com',
  enviarCodigo: 'Send the code',
  emailIncompleto: 'That email looks incomplete.',

  codigoTitulo: 'Enter the code',
  codigoLead: (email: string, minutos: number) =>
    `We sent it to ${email}. It’s valid for ${minutos} minutes — if it doesn’t arrive, check your spam too.`,
  entrar: 'Sign in',
  reenviar: 'Send another code',
  reenviarEm: (segundos: number) => `Another code in ${segundos} s`,
  outroEmail: 'Use another email',
  voltar: 'Back',
  tentarDeNovo: 'Try again',

  guardando: 'Saving your journal…',
  trazendo: 'Bringing your journal back…',

  erro: {
    semInternet: 'Creating an account or signing in needs internet. What you already wrote stays here, and we’ll try again when the connection is back.',
    codigoErrado: 'That code doesn’t match, or it has expired. Check the numbers, or send another one and use the newest.',
    muitosPedidos: 'Too many requests in a row. Wait a minute and try again.',
    apple: 'Apple didn’t confirm the sign-in. Try again, or continue with email.',
    outro: 'We couldn’t do it right now. Try again in a moment.',
  },

  doisDiarios: {
    titulo: 'This account already has a journal',
    lead: 'One of the two stays: the one in the account, or the one you just set up on this phone.',
    daConta: 'Keep the account’s journal',
    daContaSub: 'What’s on this phone leaves it, and the account’s journal comes down here.',
    desteTelefone: 'Keep this phone’s journal',
    desteTelefoneSub: 'What was in the account is deleted, and this one goes up in its place.',
    confirmar: 'Delete the account’s journal and keep this one?',
    confirmarSim: 'Delete the account’s',
    cancelar: 'Cancel',
  },

  outraConta: {
    titulo: 'This journal belongs to another account',
    lead: 'What’s on this phone was saved to another account, and it doesn’t go up to this one. Sign in with its account, or start a new journal.',
    entrarComADona: 'Sign in with the other account',
    comecarDeNovo: 'Start a new journal',
    comecarPergunta: 'This phone’s journal leaves it, and stays in the other account. Start over?',
    comecarSim: 'Start over',
  },

  linha: {
    titulo: 'Your account',
    guardado: 'Everything saved',
    guardando: 'Saving…',
    semInternet: 'No internet — we’ll save when the connection is back',
    entrarDeNovo: 'Sign in again',
    semConta: 'No internet — we’ll create your account when the connection is back',
    contaApagada: 'This account was deleted',
  },

  sair: {
    rotulo: 'Sign out',
    pergunta: 'The journal leaves this phone and stays saved in your account. To see it here again, just sign in.',
    pendente: 'Some entries haven’t reached your account yet. If you sign out now, they’ll be lost.',
    confirmar: 'Sign out',
    cancelar: 'Stay',
    semConta: 'Redo the sign-up',
  },

  apagada: {
    titulo: 'This account was deleted',
    lead: 'The journal no longer exists in the account. The copy left on this phone can go too.',
    limpar: 'Remove the journal from this phone',
  },

  apagarConta: {
    sub: 'The account and everything in it, with no way back',
    pergunta: 'Delete the account and everything you logged? No copy is left anywhere.',
    apagando: 'Deleting…',
    semInternet: 'Deleting the account needs internet. Nothing was deleted.',
    falhou: 'We couldn’t delete it right now. Nothing was deleted — try again in a moment.',
  },

  jaTenho: 'I already have an account',
};
