/* Le compte — voir l’en-tête de pt-BR/conta pour les raisons. */

export const conta = {
  titulo: {
    cadastro: 'Créez votre compte',
    abertura: 'Connectez-vous à votre compte',
    sessao: 'Reconnectez-vous',
  },
  lead: {
    cadastro: 'C’est là que nous gardons votre journal. Si vous changez ou perdez de téléphone, il revient en entier quand vous vous connectez.',
    abertura: 'Nous ramenons votre journal sur ce téléphone.',
    sessao: 'Votre session a pris fin. Ce que vous avez noté est toujours ici, et nous l’enregistrons dans votre compte dès que vous vous connectez.',
  },
  comEmail: 'Continuer avec l’e-mail',
  semSenha: 'Sans mot de passe : nous envoyons un code à votre e-mail.',

  emailTitulo: 'Quelle est votre adresse e-mail ?',
  emailLead: (digitos: number) => `Nous y envoyons un code de ${digitos} chiffres.`,
  emailCampo: 'vous@exemple.com',
  enviarCodigo: 'Envoyer le code',
  emailIncompleto: 'Cette adresse semble incomplète.',

  codigoTitulo: 'Saisissez le code',
  codigoLead: (email: string, minutos: number) =>
    `Nous l’avons envoyé à ${email}. Il est valable ${minutos} minutes — s’il n’arrive pas, regardez aussi dans les spams.`,
  entrar: 'Se connecter',
  reenviar: 'Envoyer un autre code',
  reenviarEm: (segundos: number) => `Un autre code dans ${segundos} s`,
  outroEmail: 'Utiliser une autre adresse',
  voltar: 'Retour',
  tentarDeNovo: 'Réessayer',

  guardando: 'Enregistrement de votre journal…',
  trazendo: 'Récupération de votre journal…',

  erro: {
    semInternet: 'Créer le compte ou se connecter demande internet. Ce que vous avez déjà écrit reste ici, et nous réessayons quand la connexion revient.',
    codigoErrado: 'Ce code ne correspond pas, ou il a expiré. Vérifiez les chiffres, ou demandez-en un autre et utilisez le plus récent.',
    muitosPedidos: 'Trop de demandes d’affilée. Attendez une minute et réessayez.',
    apple: 'Apple n’a pas confirmé la connexion. Réessayez, ou continuez avec l’e-mail.',
    outro: 'Nous n’avons pas pu pour le moment. Réessayez dans un instant.',
  },

  doisDiarios: {
    titulo: 'Ce compte a déjà un journal',
    lead: 'L’un des deux reste : celui du compte, ou celui que vous venez de créer sur ce téléphone.',
    daConta: 'Garder celui du compte',
    daContaSub: 'Ce qui est sur ce téléphone en sort, et le journal du compte descend ici.',
    desteTelefone: 'Garder celui de ce téléphone',
    desteTelefoneSub: 'Ce qui était dans le compte est effacé, et celui-ci monte à sa place.',
    confirmar: 'Effacer le journal du compte et garder celui-ci ?',
    confirmarSim: 'Effacer celui du compte',
    cancelar: 'Annuler',
  },

  outraConta: {
    titulo: 'Ce journal appartient à un autre compte',
    lead: 'Ce qui est sur ce téléphone a été enregistré dans un autre compte, et ne monte pas dans celui-ci. Connectez-vous avec son compte, ou commencez un nouveau journal.',
    entrarComADona: 'Se connecter avec l’autre compte',
    comecarDeNovo: 'Commencer un nouveau journal',
    comecarPergunta: 'Le journal de ce téléphone en sort, et reste dans l’autre compte. Recommencer ?',
    comecarSim: 'Recommencer',
  },

  linha: {
    titulo: 'Votre compte',
    guardado: 'Tout est enregistré',
    guardando: 'Enregistrement…',
    semInternet: 'Pas d’internet — nous enregistrons quand la connexion revient',
    entrarDeNovo: 'Reconnectez-vous',
    semConta: 'Pas d’internet — nous créons votre compte quand la connexion revient',
    contaApagada: 'Ce compte a été supprimé',
  },

  sair: {
    rotulo: 'Se déconnecter',
    pergunta: 'Le journal quitte ce téléphone et reste enregistré dans votre compte. Pour le revoir ici, il suffit de vous connecter.',
    pendente: 'Certaines entrées ne sont pas encore arrivées dans votre compte. Si vous vous déconnectez maintenant, elles seront perdues.',
    confirmar: 'Se déconnecter',
    cancelar: 'Rester',
    semConta: 'Refaire l’inscription',
  },

  apagada: {
    titulo: 'Ce compte a été supprimé',
    lead: 'Le journal n’existe plus dans le compte. La copie restée sur ce téléphone peut partir aussi.',
    limpar: 'Retirer le journal de ce téléphone',
  },

  apagarConta: {
    sub: 'Le compte et tout ce qu’il garde, sans retour',
    pergunta: 'Supprimer le compte et tout ce que vous avez noté ? Il ne reste de copie nulle part.',
    apagando: 'Suppression…',
    semInternet: 'Supprimer le compte demande internet. Rien n’a été supprimé.',
    falhou: 'Nous n’avons pas pu le supprimer pour le moment. Rien n’a été supprimé — réessayez dans un instant.',
  },

  jaTenho: 'J’ai déjà un compte',
};
