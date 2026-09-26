/* La cuenta — ver el encabezado de pt-BR/conta para las razones. */

export const conta = {
  titulo: {
    cadastro: 'Crea tu cuenta',
    abertura: 'Entra a tu cuenta',
    sessao: 'Entra de nuevo',
  },
  lead: {
    cadastro: 'Es donde guardamos tu diario. Si cambias o pierdes el teléfono, vuelve completo cuando entres.',
    abertura: 'Traemos tu diario de vuelta a este teléfono.',
    sessao: 'Tu sesión terminó. Lo que registraste sigue aquí, y lo guardamos en tu cuenta en cuanto entres.',
  },
  comEmail: 'Continuar con correo',
  semSenha: 'Sin contraseña: te mandamos un código a tu correo.',

  emailTitulo: '¿Cuál es tu correo?',
  emailLead: (digitos: number) => `Te mandamos un código de ${digitos} números.`,
  emailCampo: 'tu@ejemplo.com',
  enviarCodigo: 'Mandar el código',
  emailIncompleto: 'Ese correo parece incompleto.',

  codigoTitulo: 'Escribe el código',
  codigoLead: (email: string, minutos: number) =>
    `Lo mandamos a ${email}. Vale por ${minutos} minutos — si no llega, revisa también el spam.`,
  entrar: 'Entrar',
  reenviar: 'Mandar otro código',
  reenviarEm: (segundos: number) => `Otro código en ${segundos} s`,
  outroEmail: 'Usar otro correo',
  voltar: 'Volver',
  tentarDeNovo: 'Intentar de nuevo',

  guardando: 'Guardando tu diario…',
  trazendo: 'Trayendo tu diario…',

  erro: {
    semInternet: 'Crear la cuenta o entrar necesita internet. Lo que ya escribiste se queda aquí, y lo intentamos de nuevo cuando vuelva la conexión.',
    codigoErrado: 'Ese código no coincide, o ya venció. Revisa los números, o manda otro y usa el más nuevo.',
    muitosPedidos: 'Fueron muchos pedidos seguidos. Espera un minuto e inténtalo de nuevo.',
    apple: 'Apple no confirmó la entrada. Inténtalo de nuevo, o continúa con correo.',
    outro: 'No pudimos ahora. Inténtalo de nuevo en un momento.',
  },

  doisDiarios: {
    titulo: 'Esta cuenta ya tiene un diario',
    lead: 'Se queda uno de los dos: el que está en la cuenta, o el que acabas de armar en este teléfono.',
    daConta: 'Quedarme con el de la cuenta',
    daContaSub: 'Lo que está en este teléfono sale de él, y el de la cuenta baja aquí.',
    desteTelefone: 'Quedarme con el de este teléfono',
    desteTelefoneSub: 'Lo que estaba en la cuenta se borra, y este sube en su lugar.',
    confirmar: '¿Borrar el diario de la cuenta y quedarte con este?',
    confirmarSim: 'Borrar el de la cuenta',
    cancelar: 'Cancelar',
  },

  outraConta: {
    titulo: 'Este diario es de otra cuenta',
    lead: 'Lo que está en este teléfono se guardó en otra cuenta, y no sube a esta. Entra con su cuenta, o empieza un diario nuevo.',
    entrarComADona: 'Entrar con la otra cuenta',
    comecarDeNovo: 'Empezar un diario nuevo',
    comecarPergunta: 'El diario de este teléfono sale de él, y sigue en la otra cuenta. ¿Empezar de nuevo?',
    comecarSim: 'Empezar de nuevo',
  },

  linha: {
    titulo: 'Tu cuenta',
    guardado: 'Todo guardado',
    guardando: 'Guardando…',
    semInternet: 'Sin internet — guardamos cuando vuelva la conexión',
    entrarDeNovo: 'Entra de nuevo',
    semConta: 'Sin internet — creamos tu cuenta cuando vuelva la conexión',
    contaApagada: 'Esta cuenta fue borrada',
  },

  sair: {
    rotulo: 'Cerrar sesión',
    pergunta: 'El diario sale de este teléfono y sigue guardado en tu cuenta. Para verlo aquí de nuevo, solo entra.',
    pendente: 'Todavía hay registros que no llegaron a tu cuenta. Si sales ahora, se pierden.',
    confirmar: 'Salir',
    cancelar: 'Quedarme',
    semConta: 'Rehacer el registro',
  },

  apagada: {
    titulo: 'Esta cuenta fue borrada',
    lead: 'El diario ya no existe en la cuenta. La copia que quedó en este teléfono también puede salir.',
    limpar: 'Quitar el diario de este teléfono',
  },

  apagarConta: {
    sub: 'La cuenta y todo lo que guarda, sin vuelta',
    pergunta: (dias: number) =>
      `¿Borrar la cuenta y todo lo que guarda, aquí y en nuestra base de datos? Las copias de seguridad desaparecen en hasta ${dias} días, y otro aparato en el que entraste guarda su copia hasta que salgas de la cuenta allí.`,
    apagando: 'Borrando…',
    semInternet: 'Borrar la cuenta necesita internet. No se borró nada.',
    falhou: 'No pudimos borrarla ahora. No se borró nada — inténtalo de nuevo en un momento.',
  },

  jaTenho: 'Ya tengo cuenta',
};
