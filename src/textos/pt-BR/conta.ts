/* ============================================================
   A CONTA — entrar, criar, sair, e a linha que diz se está guardado

   A conta é o que liga o diário a uma pessoa: é com ela que guardamos o
   diário fora do telefone, e é por ela que ele volta num aparelho novo.
   Ela é obrigatória (plano do Supabase, a decisão 1) — e por isso esta
   tela não tem saída que não seja criar a conta ou entrar numa.

   ⚠️ SEM SENHA. A entrada é pela Apple ou por um código que mandamos por
   e-mail. O número de dígitos e a validade vêm de logic/conta, e têm de
   bater com o painel do Supabase e com o modelo do e-mail
   (supabase/modelos/codigo.html).

   ⚠️ QUEM FALA É O PRODUTO, e o produto é "nós": guardamos, mandamos,
   trazemos. Nunca "o aplicativo guarda".

   ⚠️ E A LINHA DE ESTADO NÃO MENTE. "Tudo guardado" só aparece quando o
   servidor confirmou tudo. As cinco frases vêm do desenho (Peça 4, "A
   pessoa sabe o estado") e são irmãs: mudar uma é procurar as outras.
   ============================================================ */

export const conta = {
  /* ---- a porta, nas três entradas ---- */
  titulo: {
    /* o fim do cadastro, e quem reabre sem conta */
    cadastro: 'Crie a sua conta',
    /* "Já tenho conta", na abertura */
    abertura: 'Entre na sua conta',
    /* a sessão caiu: a pessoa já tem conta e diário aqui */
    sessao: 'Entre de novo',
  },
  lead: {
    cadastro: 'É nela que guardamos o seu diário. Se você trocar ou perder o telefone, ele volta inteiro quando você entrar.',
    abertura: 'Trazemos o seu diário de volta para este telefone.',
    sessao: 'A sua sessão terminou. O que você registrou continua aqui, e guardamos na sua conta assim que você entrar.',
  },
  comEmail: 'Continuar com e-mail',
  semSenha: 'Sem senha: mandamos um código para o seu e-mail.',

  /* ---- o e-mail ---- */
  emailTitulo: 'Qual é o seu e-mail?',
  emailLead: (digitos: number) => `Mandamos para ele um código de ${digitos} números.`,
  emailCampo: 'voce@exemplo.com',
  enviarCodigo: 'Mandar o código',
  emailIncompleto: 'Esse e-mail parece incompleto.',

  /* ---- o código ---- */
  codigoTitulo: 'Digite o código',
  codigoLead: (email: string, minutos: number) =>
    `Mandamos para ${email}. Ele vale por ${minutos} minutos — se não chegar, olhe também o spam.`,
  entrar: 'Entrar',
  reenviar: 'Mandar outro código',
  reenviarEm: (segundos: number) => `Outro código em ${segundos} s`,
  outroEmail: 'Usar outro e-mail',
  voltar: 'Voltar',
  tentarDeNovo: 'Tentar de novo',

  /* ---- enquanto o diário sobe ou desce ---- */
  guardando: 'Guardando o seu diário…',
  trazendo: 'Trazendo o seu diário…',

  /* ---- o que pode dar errado ---- */
  erro: {
    semInternet: 'Criar a conta ou entrar precisa de internet. O que você já escreveu fica aqui, e tentamos de novo quando a conexão voltar.',
    /* ⚠️ O SERVIDOR NÃO DISTINGUE o código errado do vencido — os dois
       voltam com o mesmo erro —, e a frase diz os dois. */
    codigoErrado: 'Esse código não confere, ou já venceu. Confira os números, ou mande outro e use o mais novo.',
    muitosPedidos: 'Foram muitos pedidos seguidos. Espere um minuto e tente de novo.',
    apple: 'A Apple não confirmou a entrada. Tente de novo, ou continue com e-mail.',
    outro: 'Não conseguimos agora. Tente de novo em instantes.',
  },

  /* ---- a conta que já tem diário ----

     ⚠️ OS DOIS NÃO SE MISTURAM: misturar dois diários é outro projeto (o
     plano, "Dois diários não se misturam"). A pessoa escolhe um, e a
     frase diz o que acontece com o outro. */
  doisDiarios: {
    titulo: 'Esta conta já tem um diário',
    lead: 'Fica um dos dois: o que está na conta, ou o que você acabou de montar neste telefone.',
    daConta: 'Ficar com o da conta',
    daContaSub: 'O que está neste telefone sai dele, e o da conta desce para cá.',
    desteTelefone: 'Ficar com o deste telefone',
    desteTelefoneSub: 'O que estava na conta é apagado, e este sobe no lugar.',
    confirmar: 'Apagar o diário da conta e ficar com este?',
    confirmarSim: 'Apagar o da conta',
    cancelar: 'Cancelar',
  },

  /* ---- entrou com uma conta que não é a dona deste diário ---- */
  outraConta: {
    titulo: 'Este diário é de outra conta',
    lead: 'O que está neste telefone foi guardado em outra conta, e não sobe para esta. Entre com a conta dele, ou comece um diário novo.',
    entrarComADona: 'Entrar com a outra conta',
    comecarDeNovo: 'Começar um diário novo',
    comecarPergunta: 'O diário deste telefone sai dele, e continua na outra conta. Começar de novo?',
    comecarSim: 'Começar de novo',
  },

  /* ---- a linha de estado, no Perfil ---- */
  linha: {
    titulo: 'Sua conta',
    guardado: 'Tudo guardado',
    guardando: 'Guardando…',
    semInternet: 'Sem internet — guardamos quando a conexão voltar',
    entrarDeNovo: 'Entre de novo',
    /* ⚠️ Também numa faixa da Home: é o único estado em que o diário
       ainda não está em conta nenhuma. */
    semConta: 'Sem internet — criamos a sua conta quando a conexão voltar',
    contaApagada: 'Esta conta foi apagada',
  },

  /* ---- sair ---- */
  sair: {
    /* com conta */
    rotulo: 'Sair da conta',
    pergunta: 'O diário sai deste telefone e continua guardado na sua conta. Para vê-lo aqui de novo, é só entrar.',
    pendente: 'Ainda há registros que não chegaram à sua conta. Se sair agora, eles se perdem.',
    confirmar: 'Sair',
    cancelar: 'Ficar',
    /* ⚠️ SEM CONTA, O BOTÃO NÃO DIZ "SAIR DA CONTA" — não há conta de que
       sair. Ele faz o que sempre fez: volta ao cadastro, com o que foi
       registrado. O rótulo é provisório até o dono decidir (PENDENCIAS,
       item 30). */
    semConta: 'Refazer o cadastro',
  },

  /* ---- a conta apagada, vista de outro aparelho ---- */
  apagada: {
    titulo: 'Esta conta foi apagada',
    lead: 'O diário não existe mais na conta. A cópia que ficou neste telefone pode sair também.',
    limpar: 'Tirar o diário deste telefone',
  },

  /* ---- "Apagar meus dados", com conta ---- */
  apagarConta: {
    sub: 'A conta e tudo o que ela guarda, sem volta',
    /* ⚠️ O QUE ACONTECE DE VERDADE (fase 8): o banco e este aparelho agora;
       as cópias de segurança em até N dias (DIAS_DAS_COPIAS_DE_SEGURANCA,
       em logic/documentos); outro aparelho, quando sair da conta nele. */
    pergunta: (dias: number) =>
      `Apagar a conta e tudo o que ela guarda, aqui e no nosso banco? As cópias de segurança somem em até ${dias} dias, e outro aparelho em que você entrou guarda a cópia dele até você sair da conta ali.`,
    apagando: 'Apagando…',
    semInternet: 'Apagar a conta precisa de internet. Nada foi apagado.',
    falhou: 'Não conseguimos apagar agora. Nada foi apagado — tente de novo em instantes.',
  },

  /* ---- a abertura do cadastro ---- */
  jaTenho: 'Já tenho conta',
};
