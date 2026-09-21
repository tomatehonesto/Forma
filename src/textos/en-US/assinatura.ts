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
  verOsPlanos: 'See the plans',
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
     of their own weight, injections and labs is not something we do. */
  bomSaberTitulo: 'Worth knowing',
  bomSaberTexto: 'If the partner clinic tells us your treatment link has ended, access is suspended until you take up a Personal plan — and no charge happens without you choosing it. Nothing you logged is lost: your entries stay on the device and you can export them whenever you want.',

  semCobrancaTitulo: 'Billing isn’t turned on yet',
  semCobrancaTexto: 'This screen exists; the subscription doesn’t yet. Nothing has been charged to you, and nothing will be without notice.',
};
