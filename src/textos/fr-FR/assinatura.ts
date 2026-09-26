/* ============================================================
   L'ABONNEMENT — ce qui est en cours, ce que ça coûte, où on y touche · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/assinatura.ts. Deux commandent :

   C'EST UN SEUL ÉCRAN, AVEC UNE SEULE ÉTIQUETTE. Qui est patiente d'une
   clinique partenaire lit « Sans frais » AU MÊME ENDROIT où qui s'abonne
   lit « 29,99 € » — la comparaison est immédiate parce que la place est la
   même. Une langue qui inventerait une phrase plus longue pour le cas
   exonéré déferait le dessin.

   ⚠️ ET LE TEXTE DE L'EXONÉRATION NAÎT DE LA SECTION 4 DES CONDITIONS. Ce
   n'est pas une phrase d'écran : c'est l'engagement que le document prend,
   répété là où il compte. Si les deux s'écartent, l'un devient la
   mauvaise version pour qui a lu l'autre — et c'est le document qui a
   raison. Voir logic/documentos.

   ⚠️ CE QUI N'EST PAS ICI, ET EXPRÈS : « Care » et « Personal » sont les
   noms de nos offres et ne se traduisent pas ; « App Store » et « Google
   Play » sont des marques ; les raccourcis de développement disparaissent
   à la compilation.
   ============================================================ */

export const assinatura = {
  /* ⚠️ LE SUFFIXE N'EST PAS UNE CLÉ. Deux écrans demandaient
     `p.sufixo === '/mês'` pour savoir laquelle était l'offre mensuelle —
     une comparaison de texte faisant le travail d'un identifiant. En
     anglais le suffixe devient « /mo », la comparaison échouait sans rien
     dire, et l'écran de prix se mettait à annoncer le double. Qui demande
     quelle offre c'est demande par l'`id`. */
  mensal: 'Mensuelle',
  anual: 'Annuelle',
  porAno: 'par an',
  porAnoCurto: '/an',

  /* ⚠️ UNE SEULE CLÉ pour le titre de l'écran et l'étiquette de la carte.
     C'est le même sujet dit au même endroit, et les séparer en deux clés,
     c'est les inviter à diverger. */
  titulo: 'Votre abonnement',

  semCusto: 'Sans frais',

  /* Quand nous ne savons pas le nom de la clinique. Elle entre au milieu
     d'une phrase, d'où la minuscule. */
  clinicaGenerica: 'la clinique qui vous suit',
  cobertoPelaClinica: (clinica: string) => `Le lien avec ${clinica} couvre toute l’application.`,

  /* La fiche : l'étiquette à gauche, la valeur à droite.

     ⚠️ « LIEN ACTIF DEPUIS », ET NON « LIÉE DEPUIS » : le participe
     français devrait s'accorder avec quelque chose, et ce quelque chose
     n'est pas dans l'étiquette. Le nom règle la question. */
  vinculadaDesde: 'Lien actif depuis',
  codigoDeConvite: 'Code d’invitation',
  periodicidade: 'Périodicité',
  primeiraCobranca: 'Premier prélèvement',
  proximaCobranca: 'Prochain prélèvement',
  cobrancaPela: 'Prélèvement via',
  naoHa: 'Aucun',

  /* ⚠️ « VOUS AVEZ TOUT TEL QUEL » VIENT AVANT LE PRIX, et l'ordre est le
     message : qui a ouvert cet écran sans être abonnée ne paie rien, et
     l'apprendre ne peut pas dépendre de la lecture de la seconde
     proposition. */
  semPlano: (menorPorMes: string) => `Vous avez tout tel quel. Les offres commencent à ${menorPorMes} par mois.`,

  /* Les actions. Sans sous-titre, parce qu'aucune n'a de conséquence —
     chacune ouvre un écran, et dans une liste d'actions le sous-titre ne
     se paie que quand il prévient de ce qui ne se défait pas. */
  mudarDePlano: 'Changer d’offre',
  verOsPlanos: 'Voir les offres',
  formaDePagamento: 'Moyen de paiement',
  historicoDeCobranca: 'Historique de facturation',

  trocarClinica: 'Changer la clinique qui vous suit',

  /* ⚠️ CES DEUX-LÀ ONT UN SOUS-TITRE, et pour la raison inverse des
     autres : qui paie et saisit un code de clinique partenaire ARRÊTE de
     payer. C'est la plus grande conséquence de l'écran, et elle ne se
     devine pas d'une étiquette qui dit « saisir un code ». */
  inserirCodigo: 'Saisir un code',
  inserirCodigoSub: 'Le suivi dans une clinique partenaire dispense du coût de l’application',
  medicosParceiros: 'Médecins partenaires',
  medicosParceirosSub: 'Qui se soigne dans une clinique partenaire ne paie pas',

  cancelar: 'Résilier l’abonnement',

  /* ⚠️ LE TITRE N'EST PAS LE MÊME DANS LES TROIS. « Bon à savoir » sert à
     l'avis qui n'est qu'une information ; celui qui prévient d'un argent
     qui part pour rien doit le dire dans le titre, sinon il devient une
     note de bas de page avec une tête de note de bas de page. */
  pagandoTitulo: 'Vous payez alors que ce n’est pas nécessaire',
  pagandoTexto: (loja: string) => `Le lien avec la clinique couvre déjà l’application, mais un abonnement est actif sur ${loja} — résiliez-le là-bas et rien ne change pour vous.`,

  /* ⚠️⚠️ ELLE DIT QUI NOUS PRÉVIENT, et ensuite ce qui arrive.

     « Si le lien prend fin » laissait croire que nous nous en apercevons
     seuls, et nous ne nous en apercevons pas : personne ici ne sait qu'une
     personne a cessé d'être patiente d'une clinique. Celle qui le sait,
     c'est la clinique, et c'est elle qui l'informe.

     ⚠️⚠️ ET LA LIGNE DES DONNÉES VA AVEC, toujours. Suspendre l'accès à un
     journal de traitement, c'est enfermer quelqu'un dehors de son propre
     poids, de ses propres piqûres et de ses propres analyses — et cela
     nous ne le faisons pas. Séparée, la première phrase devient une
     menace. */
  bomSaberTitulo: 'Bon à savoir',
  bomSaberTexto: 'Si la clinique partenaire nous informe que le suivi a pris fin, l’accès reste suspendu jusqu’à ce que vous preniez une offre Personal — et aucun prélèvement n’a lieu sans que vous le choisissiez. Rien de ce que vous avez noté ne se perd : les relevés restent dans votre compte et s’exportent quand vous voulez.',

  /* ⚠️ DIRE « VOUS N'ÊTES PAS ABONNÉE » SANS DIRE QUE PERSONNE NE PEUT
     L'ÊTRE laisse la personne chercher un bouton qui n'existe pas. Celle-ci
     sort le jour où le paiement s'allume. */
  semCobrancaTitulo: 'Le paiement n’est pas encore activé',
  semCobrancaTexto: 'Cet écran existe, l’abonnement pas encore. Rien ne vous a été prélevé, et rien ne le sera sans prévenir.',

  /* ============================================================
     LA VITRINE — /planos

     ⚠️⚠️ LE TITRE A UNE COUPURE DE LIGNE MESURÉE, ET NON CHOISIE. Sur un
     téléphone de 375 pt il reste 335 px de ligne. Mesuré dans le corps de
     31 : le portugais demande 321 et 323 px, le français 317 et 251. La
     première moitié frôle la limite comme la portugaise ; la seconde a de
     la marge, et cette marge n'est pas une invitation à rallonger — c'est
     ce qui reste quand la première ligne est déjà au bord.

     Qui traduit doit tenir dans cette largeur, ou toucher au corps avec.
     Une phrase plus longue ne « déborde pas un peu » : elle casse en trois
     lignes et mange le bouton.
     ============================================================ */
  vitrine: {
    titulo: 'Tout change quand vous\nsuivez ',
    tituloDestaque: 'pour de vrai.',
    lead: 'Vos données réunies, votre évolution organisée, et de la clarté à chaque étape du traitement.',

    /* Les quatre arguments. Chacun est ce que l'application fait, et non un
       adjectif sur elle. */
    umLugarTitulo: 'Votre traitement au même endroit',
    umLugarTexto: 'Tout est rangé pour que vous suiviez votre parcours.',
    numerosTitulo: 'Vos chiffres interprétés',
    numerosTexto: 'Vos données deviennent une information qui a du sens.',
    evolucaoTitulo: 'Une évolution que vous arrivez à voir',
    evolucaoTexto: 'Poids, mesures, symptômes, analyses et relevés au fil du temps.',
    assistenteTitulo: 'Un assistant pour le quotidien',
    assistenteTexto: 'Demandez, notez, et comprenez mieux votre parcours.',

    comecarTeste: (dias: number) => `Commencer les ${dias} jours gratuits`,
    assinarPor: (preco: string) => `S’abonner — ${preco}`,

    /* ⚠️ « RÉSILIABLE À TOUT MOMENT » SERT AUX DEUX OFFRES, et c'est vrai
       dans les deux. La seconde change : « sans engagement » rassure qui va
       essayer trois jours ; pour qui engage une année entière, la même
       phrase sonne comme une promesse creuse — elle VIENT de s'engager. Ce
       qui vaut la peine d'être dit là, c'est ce qu'elle reçoit en échange. */
    canceleQuandoQuiser: 'Résiliable à tout moment',
    semCompromisso: 'Sans engagement',
    menorPreco: 'Prix le plus bas',

    depoisDoTeste: (dias: number, preco: string, periodo: string) =>
      `Après ${dias} jours, ${preco} ${periodo}. Résiliez avant et vous ne payez rien.`,
    renovaAte: (preco: string, periodo: string) =>
      `${preco} ${periodo}, avec renouvellement jusqu’à votre résiliation.`,

    naoPaga: 'Vous ne payez pas — l’accès vient du lien',
    aindaNaoLigada: 'L’abonnement n’est pas encore activé',
    temCodigo: 'J’ai un code d’invitation',
  },

  /* ============================================================
     LA SORTIE — /cancelar

     ⚠️⚠️ L'ÉCRAN DEMANDE, MAIS NE RETIENT PAS. Qui l'a ouvert a déjà
     décidé, et la question est pour nous, pas contre elle : le bouton qui
     mène au magasin reste actif en bas sans dépendre d'aucune réponse.
     ============================================================ */
  saida: {
    titulo: 'Résilier l’abonnement',
    perguntaTitulo: 'Avant de partir, une question',
    perguntaLead: 'Répondre est facultatif et ne change rien : la résiliation reste à un toucher, sur le bouton en bas.',
    porQue: 'Pourquoi résiliez-vous ?',
    continuarParaLoja: (loja: string) => `Continuer vers ${loja}`,

    /* ⚠️ L'ORDRE N'EST PAS LIBRE : les trois premiers ont une réponse, les
       trois derniers ont un champ de texte, et « Autre raison » est toujours
       le dernier. Qui lit trouve l'alternative avant le formulaire, et la
       sortie générique après toutes les précises. */
    motivoCaro: 'C’est cher',
    motivoEsqueco: 'Je ne m’en sers pas',
    motivoTerminei: 'J’ai terminé',
    motivoFaltou: 'Il manquait quelque chose',
    motivoProblema: 'Il y a eu un problème',
    motivoOutro: 'Autre raison',

    /* ⚠️⚠️ SUR L'ANNUELLE, LA RÉDUCTION N'EST PAS LA NOUVELLE — LA DATE
       L'EST. Qui paie à l'année et dit que c'est cher n'a aucun prélèvement
       qui arrive. Ce qui change sa décision, c'est que l'année est payée et
       que résilier maintenant ne rend pas l'argent. Et le remboursement est
       dit même s'il coûte : qui veut son argent le cherchera de toute
       façon, et se taire garantit seulement qu'elle le cherche énervée et
       au mauvais endroit. */
    anoPagoTitulo: 'Votre année est déjà payée',
    anoPagoComData: (data: string) => `Le prochain prélèvement n’est qu’en ${data}, et vous gardez tout jusque-là — résilier maintenant ne rend pas ce qui a déjà été payé.`,
    anoPagoSemData: 'Vous gardez tout jusqu’à la fin de la période déjà payée — résilier maintenant ne rend pas ce montant.',
    anoPagoReembolso: (loja: string, comDesconto: string, cheio: string) =>
      `Le remboursement, quand il est possible, se demande sur ${loja}. Et si le problème est le montant, le renouvellement peut passer à ${comDesconto} au lieu de ${cheio}.`,
    querDescontoRenovacao: 'Je veux la réduction au renouvellement',

    descontoTitulo: (porcento: number) => `${porcento}% de réduction le mois prochain`,
    descontoTexto: (comDesconto: string, cheio: string, anualPorMes: string) =>
      `Le prochain prélèvement passe à ${comDesconto} au lieu de ${cheio}. Et si c’est le mensuel qui pose problème, l’annuel revient à ${anualPorMes} par mois.`,
    querDesconto: 'Je veux la réduction',

    lembretesTitulo: 'Si le problème est d’oublier, on peut vous le rappeler',
    lembretesTexto: 'La dose, la pesée, l’eau et les protéines ont chacune un rappel, à l’heure que vous choisissez. Vous pouvez n’activer que ce qui vous sert et laisser le reste.',
    configurarLembretes: 'Configurer les rappels',

    /* ⚠️⚠️ ICI L'ÉCRAN ARRÊTE DE VENDRE ET FÉLICITE. C'est la seule raison
       de la liste où partir est le bon dénouement. Et les félicitations sont
       CONDITIONNELLES exprès : « nous espérons que vous avez atteint » et
       non « vous avez réussi » — tous les traitements qui se terminent ne se
       terminent pas bien, et affirmer la victoire à qui s'est arrêtée pour
       un effet secondaire serait la phrase la plus cruelle de cet écran.

       ⚠️ ET « BRAVO POUR LE CHEMIN PARCOURU », et non « bravo d'être
       arrivée jusqu'ici » : avec être, le participe affirmerait un genre. Le
       participe s'accorde ici avec « chemin », qui est dans la phrase. */
    parabensTitulo: 'Bravo pour le chemin parcouru',
    parabensTexto: 'Nous espérons que vous avez atteint ce que vous cherchiez en commençant. Merci d’avoir fait ce chemin avec nous — et de nous en avoir confié le relevé.',

    campoProblema: 'Qu’est-ce qui s’est passé ?',
    campoFaltou: 'Qu’est-ce qui a manqué ?',
    campoOutro: 'Racontez-nous',
    /* ⚠️ ET LA PHRASE NE PROMET PAS DE RÉPONSE. Ce texte n'a encore nulle
       part où aller. « Nous vous répondrons » serait la promesse la plus
       facile et la plus chère de cet écran. */
    campoAviso: 'Écrire est facultatif, et personne ne vous répondra par ici — ça devient une liste de réparations, et c’est comme ça que nous décidons quoi arranger en premier.',
    campoDicaProblema: 'Ce qui a mal tourné, et quand…',
    campoDicaOutro: 'Écrivez autant que vous voulez',

    recusaTitulo: 'La réduction ne peut pas encore s’appliquer',
    recusaTexto: 'Le paiement n’est pas activé dans cette version, il n’y a donc rien à réduire. Rien n’a changé dans votre abonnement.',

    /* ⚠️ LE TITRE EST LE RÉSUMÉ DES TROIS, et non une étiquette de section.
       Les trois lignes répondent à la même question — « qu'est-ce que je
       perds ? »

       ⚠️ ET « TRANQUILLE » A LA MÊME FORME AU MASCULIN ET AU FÉMININ, ce qui
       est la seule raison pour laquelle cette formule survit à la règle du
       fichier. */
    tranquiloTitulo: 'SOYEZ TRANQUILLE',
    tranquiloAcesso: 'L’accès continue jusqu’à la fin de la période déjà payée.',
    tranquiloDados: 'Rien de ce que vous avez noté ne se perd — tout reste dans votre compte.',
    tranquiloLoja: (loja: string) => `La résiliation se fait sur ${loja} : nous ne pouvons pas le faire à votre place.`,
  },

  /* ============================================================
     LES CLINIQUES PARTENAIRES — /parceiros et /codigo
     ============================================================ */
  /* Os rótulos do campo da folha do código (/codigo). A tela /parceiros,
     de onde eles nasceram, saiu na fase 8: a apresentação da rede e a
     vitrine já explicam o caminho, e têm "Já tenho um código". */
  parceiros: {
    codigoRotulo: 'Code d’invitation',
    digite: 'Saisissez le code',
    confirmar: 'Confirmer le code',
    codigoSub: 'Le code que la clinique partenaire vous a transmis.',
  },

  codigo: {
    minimo: 'Saisissez au moins 4 caractères.',
    liberaNaHora: 'Le code débloque l’application tout de suite. Rien de ce que vous avez déjà enregistré ne change de place.',
    conferindo: 'Vérification…',
    naoAchou: 'Nous n’avons pas trouvé ce code. Vérifiez auprès de la clinique — il est valable tel qu’elle vous l’a donné.',
    exemplo: (codigos: string) => `Dans la liste d’exemple, les codes sont fictifs : ${codigos}.`,
    conferirTitulo: 'Est-ce votre clinique ?',
    conferirSub: 'Le code saisi appartient à cette clinique.',
    conectar: 'Rejoindre cette clinique',
    naoEEssa: 'Ce n’est pas ma clinique',
    conectarTexto: 'Une fois le lien établi, cette clinique vous suit ici. Rien de ce que vous avez déjà enregistré ne change de place.',
    cancelarTitulo: 'Vous pouvez résilier votre abonnement',
    cancelarTexto: (loja: string) => `Le lien avec la clinique couvre déjà votre accès à l’application. L’abonnement sur ${loja} reste facturé jusqu’à ce que vous le résiliiez là-bas — et le résilier ne change rien à ce que vous avez déjà enregistré.`,
    cancelarNaLoja: (loja: string) => `Résilier sur ${loja}`,
    depois: 'Plus tard',
  },

  /* ============================================================
     LE RELEVÉ — /cobrancas
     ============================================================ */
  extrato: {
    titulo: 'Historique de facturation',
    vazioIsenta: 'Aucun prélèvement',
    vazioPagante: 'Aucun prélèvement pour l’instant',
    vazioIsentaTexto: 'L’accès vient du lien avec la clinique, et un lien ne donne lieu à aucun prélèvement. Si la clinique nous informe qu’il a pris fin, l’accès reste suspendu jusqu’à ce que vous preniez une offre — rien n’apparaît ici sans que vous le choisissiez.',
    vazioPaganteTexto: 'Quand l’abonnement commencera, chaque prélèvement apparaîtra ici avec sa date et son montant.',
    inicioDoTeste: 'Début de l’essai gratuit',
    comprovante: 'Le justificatif officiel de chaque prélèvement',
  },

  /* ============================================================
     L'ACCÈS SUSPENDU — /suspenso

     ⚠️ CE QUI EST SUSPENDU, C'EST L'ABONNEMENT, ET NON LE COMPTE. Les deux
     lignes ci-dessous sont la différence entre un avis et une menace.
     ============================================================ */
  suspenso: {
    clinicaGenerica: 'la clinique qui vous suivait',
    nadaApagado: 'Rien n’a été effacé. Poids, piqûres, symptômes, analyses et photos sont là où ils étaient.',
    nadaCobrado: 'Rien n’a été prélevé, et rien ne le sera sans que vous le choisissiez.',
    verOsPlanos: 'Voir les offres',
    outroCodigo: 'J’ai un autre code',
  },

};
