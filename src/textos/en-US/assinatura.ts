/* ============================================================
   SUBSCRIPTION — what's in effect, what it costs, where to change it · en-US

   ⚠️ Reasons live in ../pt-BR/assinatura.ts. The two that constrain the
   translation:

   THE EXEMPT CASE AND THE PAYING CASE SHARE ONE LAYOUT. "No charge" sits
   exactly where "$299.00" sits, so the comparison is immediate. A longer
   phrase for the exempt case would undo the design.

   THE EXEMPTION TEXT COMES FROM SECTION 4 OF THE TERMS. It isn't screen
   copy — it's the commitment the document makes, repeated where it
   matters. If the two drift apart, one becomes the wrong version for
   whoever read the other, and the document is the one that's right.
   ============================================================ */

export const assinatura = {
  mensal: 'Monthly',
  anual: 'Annual',
  porAno: 'per year',
  porAnoCurto: '/yr',

  titulo: 'Your subscription',

  semCusto: 'No charge',

  clinicaGenerica: 'the clinic that follows your care',
  cobertoPelaClinica: (clinica: string) => `Your link with ${clinica} covers the whole app.`,

  vinculadaDesde: 'Linked since',
  codigoDeConvite: 'Invite code',
  periodicidade: 'Billing period',
  primeiraCobranca: 'First charge',
  proximaCobranca: 'Next charge',
  cobrancaPela: 'Billed through',
  naoHa: 'None',

  semPlano: (menorPorMes: string) => `You have everything just as it is. Plans start at ${menorPorMes} a month.`,

  mudarDePlano: 'Change plan',
  verOsPlanos: 'View plans',
  formaDePagamento: 'Payment method',
  historicoDeCobranca: 'Billing history',

  trocarClinica: 'Change the clinic that follows your care',

  inserirCodigo: 'Enter a code',
  inserirCodigoSub: 'Patients of partner clinics don’t pay for the app',
  medicosParceiros: 'Partner clinicians',
  medicosParceirosSub: 'If you’re treated at a partner clinic, you don’t pay',

  cancelar: 'Cancel subscription',

  pagandoTitulo: 'You’re paying when you don’t have to',
  pagandoTexto: (loja: string) => `Your clinic link already covers the app, but there’s an active subscription on the ${loja} — cancel it there and nothing changes for you.`,

  /* ⚠️ "IF THE PARTNER CLINIC TELLS US" — not "if the link ends". Nobody
     here finds out on their own that someone stopped being a patient. And
     the line about the data always travels with it: locking someone out
     of their own weight, shots and labs is not something we do. */
  bomSaberTitulo: 'Worth knowing',
  bomSaberTexto: 'If the partner clinic tells us your treatment link has ended, access is suspended until you start a Personal plan — and nothing is charged without you choosing it. Nothing you logged is lost: your entries stay on the device and you can export them whenever you want.',

  semCobrancaTitulo: 'Billing isn’t turned on yet',
  semCobrancaTexto: 'This screen exists; the subscription doesn’t yet. Nothing has been charged to you, and nothing will be without notice.',

  /* ⚠️⚠️ THE TITLE'S LINE BREAK IS MEASURED, NOT CHOSEN. On a 375 pt
     phone the line has 335 px; the two halves ask for 321 and 323 px at
     size 31. A longer phrase doesn't get "a bit bigger" — it wraps to
     three lines and eats the button. */
  vitrine: {
    titulo: 'Everything changes when\nyou really ',
    tituloDestaque: 'follow along.',
    lead: 'Your data in one place, your progress organized, and clarity at every step of treatment.',

    umLugarTitulo: 'Your treatment in one place',
    umLugarTexto: 'Everything organized so you can follow your journey.',
    numerosTitulo: 'Your numbers, read for you',
    numerosTexto: 'Your data turns into something that makes sense.',
    evolucaoTitulo: 'Progress you can actually see',
    evolucaoTexto: 'Weight, measurements, symptoms, labs and entries over time.',
    assistenteTitulo: 'An assistant for everyday',
    assistenteTexto: 'Ask, log, and understand your journey better.',

    comecarTeste: (dias: number) => `Start your ${dias} free days`,
    assinarPor: (preco: string) => `Subscribe — ${preco}`,

    canceleQuandoQuiser: 'Cancel anytime',
    semCompromisso: 'No commitment',
    menorPreco: 'Best price',

    depoisDoTeste: (dias: number, preco: string, periodo: string) =>
      `After ${dias} days, ${preco} ${periodo}. Cancel before and you pay nothing.`,
    renovaAte: (preco: string, periodo: string) =>
      `${preco} ${periodo}, renewing until you cancel.`,

    naoPaga: 'You don’t pay — access comes from your clinic link',
    aindaNaoLigada: 'Subscriptions aren’t turned on yet',
    temCodigo: 'I have an invite code',
  },

  /* ⚠️ THE SCREEN ASKS, BUT DOESN'T HOLD. Whoever opened it has already
     decided, and the question is for us, not against them. */
  saida: {
    titulo: 'Cancel subscription',
    perguntaTitulo: 'One question before you go',
    perguntaLead: 'Answering is optional and changes nothing: canceling is still one tap away, on the button below.',
    porQue: 'Why are you canceling?',
    continuarParaLoja: (loja: string) => `Continue to the ${loja}`,

    motivoCaro: 'Too expensive',
    motivoEsqueco: 'I’m not using it',
    motivoTerminei: 'I’m done',
    motivoFaltou: 'Something was missing',
    motivoProblema: 'Something went wrong',
    motivoOutro: 'Another reason',

    anoPagoTitulo: 'Your year is already paid',
    anoPagoComData: (data: string) => `The next charge isn’t until ${data}, and you keep everything until then — canceling now doesn’t refund what’s already paid.`,
    anoPagoSemData: 'You keep everything until the end of the period you already paid for — canceling now doesn’t refund that.',
    anoPagoReembolso: (loja: string, comDesconto: string, cheio: string) =>
      `Refunds, when they apply, are requested on the ${loja}. And if price is the problem, the renewal can come to ${comDesconto} instead of ${cheio}.`,
    querDescontoRenovacao: 'I want the discount on renewal',

    descontoTitulo: (porcento: number) => `${porcento}% off next month`,
    descontoTexto: (comDesconto: string, cheio: string, anualPorMes: string) =>
      `The next charge comes to ${comDesconto} instead of ${cheio}. And if monthly is the problem, annual works out to ${anualPorMes} a month.`,
    querDesconto: 'I want the discount',

    lembretesTitulo: 'If the problem is forgetting, we can remind you',
    lembretesTexto: 'Dose, weigh-ins, water and protein all have reminders, at the time you choose. You can turn on only what you need and leave the rest off.',
    configurarLembretes: 'Set up reminders',

    /* ⚠️ THE CONGRATULATION IS CONDITIONAL ON PURPOSE. "We hope you got
       what you came for" and not "you did it" — not every treatment that
       ends, ends well. */
    parabensTitulo: 'Congratulations on getting here',
    parabensTexto: 'We hope you got what you were after when you started. Thank you for making this journey with us — and for trusting us with the record of it.',

    campoProblema: 'What happened?',
    campoFaltou: 'What was missing?',
    campoOutro: 'Tell us',
    campoAviso: 'Writing is optional, and nobody will reply to you here — this becomes a fix list, and it’s how we decide what to repair first.',
    campoDicaProblema: 'What went wrong, and when…',
    campoDicaOutro: 'Write as much as you like',

    recusaTitulo: 'The discount can’t be applied yet',
    recusaTexto: 'Billing isn’t turned on in this version, so there’s nothing to discount. Nothing changed about your subscription.',

    tranquiloTitulo: 'REST EASY',
    tranquiloAcesso: 'Access continues until the end of the period you already paid for.',
    tranquiloDados: 'Nothing you logged is lost — it all stays on the device.',
    tranquiloLoja: (loja: string) => `Canceling is done on the ${loja}: the app can’t do it for you.`,
  },

  parceiros: {
    titulo: 'Partner clinicians',
    lead: 'Some clinics follow treatment here alongside you. Without that you still have everything — what changes is what you can do with your care team in here.',

    jaTemTitulo: 'You’re already with a partner clinic',
    jaTemLead: 'Everything on this list already applies to you.',

    conversaTitulo: 'Messages with your team',
    conversaTexto: 'Messages between appointments, without rebooking just to ask something.',
    resumoTitulo: 'Your summary gets there',
    resumoTexto: 'One tap sends weight, adherence, symptoms and labs — organized the way they get used at an appointment.',
    receitaTitulo: 'Prescription and protocol',
    receitaTexto: 'Request a renewal and get the week’s protocol inside the app.',
    agendaTitulo: 'Your schedule, already filled in',
    agendaTexto: 'Appointments show up here without you writing anything down.',

    conviteTitulo: 'The invite comes from the clinic',
    conviteTexto: 'You can’t search for a clinic here. Someone already treated at a partner clinic gets a code from them, and that’s what connects the two ends. If your clinic doesn’t use the app yet, it’s worth mentioning to them.',
    conviteTextoComRede: 'If you’re treated in the partner network, the office gives you a code after the first appointment, and that’s what connects the two ends. If your clinic doesn’t use the app yet, it’s worth mentioning to them.',

    codigoRotulo: 'Invite code',
    codigoAjudaAtual: 'It’s what links you to your clinic.',
    usarOutro: 'Use a different code',
    temCodigoRotulo: 'I have an invite code',
    temCodigoAjuda: 'It’s the code your clinic gave you.',
    digite: 'Enter the code',
    confirmar: 'Confirm code',
    codigoSub: 'The code your partner clinic gave you.',
  },

  extrato: {
    titulo: 'Billing history',
    vazioIsenta: 'No charges',
    vazioPagante: 'No charges yet',
    vazioIsentaTexto: 'Access comes from your clinic link, and a link doesn’t get charged. If the clinic tells us it has ended, access is suspended until you subscribe — nothing shows up here without you choosing it.',
    vazioPaganteTexto: 'Once the subscription starts, each charge appears here with its date and amount.',
    inicioDoTeste: 'Free trial started',
    comprovante: 'The official receipt for each charge',
  },

  suspenso: {
    clinicaGenerica: 'the clinic that was following your care',
    nadaApagado: 'Nothing was deleted. Weight, shots, symptoms, labs and photos all stay on your device.',
    nadaCobrado: 'Nothing was charged, and nothing will be without you choosing it.',
    verOsPlanos: 'View plans',
    outroCodigo: 'I have another code',
  },

};
