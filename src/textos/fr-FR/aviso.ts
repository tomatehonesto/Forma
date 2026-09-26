/* ============================================================
   LE CONSENTEMENT ET LE RESTE — la clause, les cartes de données · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/aviso.ts. Celle qui commande :

   LA CLAUSE NE RABAISSE PAS L'APPLICATION POUR SE PROTÉGER. « Ceci n'est
   pas une application médicale » est vrai et c'est lâche : qui lit vient
   de répondre à treize questions sur son propre traitement, et mérite de
   savoir ce qu'elle gagne, pas seulement ce qu'elle ne gagne pas. La
   phrase dit les deux, dans cet ordre — ce que nous faisons, et où nous
   nous arrêtons.
   ============================================================ */

export const aviso = {
  isencaoTitulo: 'Nous suivons, nous ne conduisons pas',
  isencaoTexto: 'Nous gardons ce que vous notez et préparons la consultation. Nous ne diagnostiquons pas et ne prescrivons pas : la dose et le médicament relèvent de votre équipe.',
  isencaoReforco: 'Un symptôme vous inquiète ? N’attendez pas la prochaine consultation. Et avant de changer la dose, parlez-en à votre équipe.',

  guardadoTitulo: 'Gardé dans votre compte',
  guardadoTexto: 'Sur ce téléphone et dans notre base de données, à São Paulo. Seul votre compte lit ce qui est à vous.',

  usoTitulo: 'Utilisé pour votre suivi',
  usoTexto: 'Pour vos objectifs, votre évolution et ce que vous apportez à la consultation. Ce n’est pas un diagnostic.',

  /* ⚠️ LA PARTIE QU'UN AVIS DE CONSENTEMENT TAIT D'HABITUDE, et la seule
     ici qui change ce que la personne décide. */
  saiTitulo: 'Ne sort que par un geste de votre part',
  saiTexto: 'Vers la clinique à laquelle vous vous connectez avec son code, et la photo de l’assiette, quand vous demandez la lecture.',

  controleTitulo: 'Vous gardez la main',
  controleTexto: 'Corrigez, exportez ou effacez vos données quand vous voulez.',

  /* a frase que faz do Continuar do último passo do cadastro um aceite (ui/consentimento) */
  termosDeUso: 'Conditions d’utilisation',
  politicaDePrivacidade: 'Politique de confidentialité',
  aceiteAntes: 'En touchant Continuer, vous acceptez ce qui précède, les ',
  aceiteEntre: ' et la ',
  aceiteDepois: '.',

  perguntasTitulo: 'Vos questions à Morphi',
  perguntasTexto: 'Si vous le permettez, nous lisons les questions que vous posez à Morphi pour comprendre quels doutes reviennent et améliorer les réponses. Nous les lisons sans savoir qui les a posées, et la clinique ne les lit jamais. C’est désactivé au départ, et refuser ne change rien dans l’application.',
  perguntasEscolha: 'Permettre la lecture de mes questions',
  perguntasDetalhe: 'L’activer envoie aussi les questions déjà ici. Vous pouvez le désactiver quand vous voulez, dans Confidentialité et données, et celles envoyées sont effacées.',

  consentimentoNovo: {
    titulo: 'Nous avons changé la façon de garder votre journal',
    lead: 'Il est désormais aussi gardé dans votre compte, dans notre base de données, pour ne pas se perdre quand vous changez de téléphone. Avant de continuer, lisez ce qui a changé.',
    aceitar: 'Accepter et continuer',
    recusar: 'Je ne suis pas d’accord',
    recusaTitulo: 'Sans accepter, impossible de continuer',
    recusaTexto: 'L’application garde maintenant le journal dans votre compte, et ne fonctionne pas sans lui. Si vous n’êtes pas d’accord, vous pouvez emporter vos données dans un fichier et tout effacer de cet appareil. Rien n’est effacé sans que vous le demandiez.',
    exportar: 'Exporter mes données',
    apagar: 'Effacer mes données de cet appareil',
    apagarPergunta: 'Tout effacer de cet appareil ? C’est définitif.',
    apagarConfirma: 'Effacer',
    voltar: 'Revenir et relire',
  },

  /* ⚠️ SEUL LE NOM D'APPLE CHANGE DE LANGUE, parce que c'est Apple qui
     traduit le nom de sa propre application. Health Connect, Garmin,
     Fitbit et Withings sont des marques et restent dans le code. */
  appleSaude: 'Apple Santé',
  trazPesagens: 'Vos pesées — y compris celles que votre balance y envoie.',
  trazTreinos: 'Séances et fréquence cardiaque',
  trazSono: 'Sommeil et pas',
  trazBalanca: 'Balance et tension',

  /* ⚠️ LES TROIS FINISSENT EN PROPOSANT LE CHEMIN MANUEL, et c'est ce qui
     les sépare d'un message d'erreur : la personne a photographié
     l'assiette parce qu'elle veut la noter, et dire seulement « ça n'a pas
     marché » la laisse à mi-chemin. */
  fotoSemServidor: 'La lecture par photo n’est pas encore activée. Vous pouvez composer l’assiette juste en dessous.',
  fotoSemRede: 'Pas de connexion pour lire la photo maintenant. Vous pouvez composer l’assiette juste en dessous.',
  fotoNaoReconheci: 'Je n’ai pas réussi à reconnaître l’assiette. Composez ci-dessous ce qu’il y avait.',

  porMes: 'par mois',
  porMesCurto: '/mois',

  exportacaoAviso: 'Relevés faits par la personne elle-même dans l’application. Ce n’est ni un dossier médical ni un compte rendu de laboratoire.',
  exportacaoTitulo: 'Vos données Morphi',
  exportacaoPerguntasRecentes: 'Hors connexion, seules les questions récentes de cet appareil sont venues. Avec une connexion, le fichier apporte toutes celles de votre compte.',

  medIndefinido: 'Pas encore défini',

  garrafao: 'Bonbonne',

  /* ⚠️ LES NOMS SONT CLÉ ET ÉTIQUETTE À LA FOIS — c'est le `tipo` qui
     reste enregistré dans chaque séance. Même famille que le moment du
     repas et le marqueur d'analyse. */
  modalidades: {
    caminhada: 'Marche',
    corrida: 'Course',
    musculacao: 'Musculation',
    bike: 'Vélo',
    natacao: 'Natation',
    yoga: 'Yoga',
    pilates: 'Pilates',
    funcional: 'Fonctionnel',
    alongamento: 'Étirements',
    outro: 'Autre',
  },

  telaExportar: {
    titulo: 'Exporter',
    lead: 'Un fichier avec vos relevés, à garder ou à emporter ailleurs.',

    periodo: 'Période',
    periodoAjuda: (de: string, ate: string, semanas: number) =>
      `Du ${de} au ${ate} · ${semanas} ${semanas === 1 ? 'semaine' : 'semaines'}`,
    ultimas4: 'Les 4 dernières semaines',
    desdeAConsulta: 'Depuis la dernière consultation',
    tratamentoInteiro: 'Tout le traitement',

    oQueEntra: 'Ce qui entre',
    oQueEntraNota: 'Touchez pour inclure ou retirer. Ce qui reste dehors n’entre pas dans le fichier.',
    incluido: 'inclus',
    fora: 'dehors',

    aplicacoes: 'Piqûres',
    aplicacoesSub: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'relevé' : 'relevés'} · date, dose et endroit`,
    pesoEMedidas: 'Poids et mesures',
    pesoEMedidasSub: (pesagens: number, medidas: number) =>
      `${pesagens} ${pesagens === 1 ? 'pesée' : 'pesées'} · ${medidas} ${medidas === 1 ? 'mesure' : 'mesures'}`,
    checkins: 'Check-ins',
    checkinsSub: (dias: number) => `${dias} ${dias === 1 ? 'jour' : 'jours'} · symptôme par symptôme`,
    exames: 'Analyses',
    examesSub: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'résultat' : 'résultats'} · valeur et référence`,
    notas: 'Notes pour la consultation',
    notasSub: (quantas: number) => `${quantas} ${quantas === 1 ? 'note' : 'notes'}`,
    habitos: 'Repas, eau et exercice',
    habitosSub: (refeicoes: number) =>
      `${refeicoes} ${refeicoes === 1 ? 'repas noté' : 'repas notés'} et le journal du jour`,
    completo: 'Le journal complet',
    completoSub: 'Tout ce que garde votre compte, sans limite de période, avec vos questions',

    formatoTitulo: 'Il en sort un fichier .json',
    formatoTexto: 'C’est le format qu’une autre application sait ouvrir et lire — il sert à garder une copie ou à emporter vos relevés ailleurs. Pour la version faite pour être lue par quelqu’un, prenez le résumé de consultation.',

    gerar: 'Construire le fichier',
    gerando: 'Construction...',
    verResumo: 'Voir le résumé de consultation',

    pronto: 'Fichier construit. Il ne va que là où vous le décidez.',
    erro: 'Nous n’avons pas pu construire le fichier sur cet appareil. Vos relevés sont toujours là, intacts.',
    parado: 'Le fichier n’est construit que quand vous touchez le bouton.',
  },

  telaPrivacidade: {
    titulo: 'Confidentialité et données',
    lead: 'Où vos relevés restent, ce qui sort d’ici et ce que l’application lit de l’extérieur.',
    statusGuardadoTitulo: 'Votre journal est bien gardé',
    statusGuardadoTexto: 'Sur cet appareil et dans votre compte, à São Paulo. Si vous changez d’appareil, il revient quand vous vous connectez.',
    statusAquiTitulo: 'Votre journal est sur cet appareil',
    statusAquiTexto: 'Il n’a pas encore de compte : pour l’instant, il reste seulement ici.',


    oQueSai: 'Ce qui sort d’ici',
    oQueSaiNota: 'Seul le premier part tout seul. Le reste dépend d’un geste de votre part.',
    saiConta: 'Votre compte',
    saiContaResumo: 'Part tout seul',
    saiClinica: 'Votre clinique',
    saiClinicaNenhuma: 'Aucune connectée',
    saiClinicaConectada: 'Connectée',
    saiFoto: 'Photo de l’assiette',
    saiFotoResumo: 'Seulement si vous l’utilisez',
    saiMicrofone: 'Micro',
    saiMicrofoneResumo: 'Seulement quand il est allumé',
    saiPerguntas: 'Questions à Morphi',
    saiPerguntasResumo: 'Restent ici',
    saiPerguntasTexto: 'Les questions que vous posez à Morphi restent seulement sur cet appareil : elles ne vont ni dans votre compte, ni à la clinique, ni chez nous.',
    paraContaTexto: 'Les relevés et le profil partent vers notre base de données dès qu’il y a une connexion. C’est ce qui garde le journal d’un appareil à l’autre.',
    paraEquipeTexto: 'Rien, jusqu’à ce que vous vous connectiez à une clinique partenaire avec son code. Avant de vous connecter, vous voyez la liste de ce qu’elle pourra voir ; elle le voit tant que la connexion dure, et vous pouvez vous déconnecter sur l’écran de la clinique. Le résumé de consultation se construit ici, et part quand vous le montrez ou l’exportez.',
    perguntas: 'Vos questions à Morphi',
    perguntasTexto: 'Seulement si vous permettez la lecture, avec l’interrupteur ci-dessous. Nous les lisons sans savoir qui les a posées, et la clinique ne les lit jamais. Le désactiver efface celles envoyées.',
    ditadoTexto: 'C’est le système de l’appareil qui transforme la voix en texte. Nous demandons que cela se fasse sur l’appareil lui-même, mais, sans la reconnaissance locale de votre langue, le système peut envoyer l’audio à Apple ou à Google. Seulement tant que le micro est allumé.',
    fotoDoPratoTexto: 'Elle est réduite sur l’appareil et envoyée pour être lue par un modèle, qui renvoie les éléments de l’assiette. L’image n’est pas conservée : ni dans votre relevé de repas, ni sur le serveur qui fait le pont. Noter le repas à la main n’envoie rien.',

    leDeFora: 'Ce que l’application lit de l’extérieur',
    leSaudeResumo: 'Seulement le poids',
    appDeSaudePadrao: 'l’application santé du téléphone',
    soOPesoTexto: (app: string) =>
      `Avec votre permission, nous lisons les pesées que votre balance, votre montre ou une autre application y ont écrites. Nous ne faisons que lire : nous n’écrivons jamais rien dans ${app}. Et nous ne lisons que le poids — le sommeil, les pas et le rythme cardiaque restent dehors.`,
    permissaoTexto: 'Elle se donne dans les réglages du système et se retire au même endroit. Sans elle, tout ici continue de fonctionner : le poids revient à entrer comme il entrait avant, tapé par vous.',

    podeFazer: 'Ce que vous pouvez faire maintenant',
    integracoesSub: (app: string) => `Activer ou désactiver ${app}`,
    resumo: 'Résumé pour la consultation',
    resumoSub: 'Voir tout ce qui entre dans le résumé de consultation',

    apagar: 'Effacer mes données',
    apagarSub: 'Tout ce que vous avez noté, sans retour',
    apagarPergunta: 'Tout effacer de cet appareil ? Ce journal n’a pas encore de compte, et il n’en existe pas de copie ailleurs.',
    apagarConfirma: 'Effacer',
    cancelar: 'Annuler',

    documentos: 'Les documents',
    politicaSub: 'Le document complet, avec la base légale et les durées',
    termosSub: 'Ce que nous sommes, ce que nous ne sommes pas, et ce que chaque côté peut attendre',
    semPoliticaTitulo: 'Ceci décrit l’application, ce n’est pas la politique de confidentialité',
    semPoliticaTexto: 'Voici ce que l’application fait de vos données. Le document juridique, avec les obligations de la personne qui exploite le service, reste à publier — et quand il existera, il apparaîtra sur cet écran.',
  },

  telaIntegracoes: {
    titulo: 'Intégrations',
    lead: 'Activées, elles font entrer vos pesées sans que vous les tapiez.',

    doSeuAparelho: 'De votre appareil',
    doSeuAparelhoNota: 'C’est le stockage santé de l’appareil : nous demandons la permission et nous lisons. Sans compte et sans mot de passe.',

    atualizarAgora: 'Actualiser maintenant',
    lendo: 'Lecture…',
    nadaNovo: 'Rien de neuf là-bas — vos pesées étaient déjà toutes ici.',
    trazidas: (quantas: number, aparelho: string) =>
      `${quantas} ${quantas === 1 ? 'pesée récupérée' : 'pesées récupérées'} depuis ${aparelho}.`,
    naoDeuParaLer: 'Impossible de lire à l’instant. Réessayez dans un moment.',
    acessoNegado: 'L’accès n’a pas été autorisé. Vous pouvez changer cela dans les réglages de l’appareil.',

    semAparelhoTitulo: 'L’application santé de l’appareil apparaît sur le téléphone',
    semAparelhoTexto: 'Apple Santé sur iPhone, Health Connect sur Android. Dans le navigateur il n’y a rien à activer.',
    semAppTitulo: (aparelho: string) => `${aparelho} n’est pas disponible sur cet appareil`,
    semAppTexto: 'Health Connect est fourni à partir d’Android 14 et peut s’installer sur les versions antérieures. Une fois installé, revenez ici.',
    semBuildTitulo: 'Cette version de l’application ne lit pas encore l’appareil',
    semBuildTexto: 'Lire Apple Santé et Health Connect demande une version installée de l’application, et non l’aperçu. Dans Expo Go elle n’existe pas.',

    contasDeServico: 'Comptes de service',
    contasDeServicoNota: 'Ceux-là livrent les données à un serveur, et non au téléphone — la liaison arrive quand ce serveur sera en place. En attendant, ce qu’ils envoient à l’application santé de votre appareil arrive déjà ici.',
    emBreve: 'Bientôt',
  },
};
