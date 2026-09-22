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
  isencaoTitulo: 'Nous suivons votre traitement — nous ne le conduisons pas',
  isencaoTexto: 'Nous gardons ce que vous notez, nous vous montrons comment les choses avancent et nous préparons ce que vous apporterez à la consultation. Nous ne sommes pas un diagnostic et nous ne prescrivons pas : la dose, l’intervalle et le médicament sont la décision de qui vous suit.',
  isencaoReforco: 'Avant de changer quoi que ce soit à votre dose ou à votre horaire, parlez-en à votre équipe. Et si un symptôme vous inquiète, n’attendez pas la prochaine consultation.',
  isencaoAceite: 'J’ai compris et j’accepte',

  guardadoTitulo: 'Ce que vous notez reste sur votre appareil',
  guardadoTexto: 'Poids, symptômes, injections, analyses et notes sont enregistrés dans l’application, sur ce téléphone. Il n’y a ni compte ni mot de passe : personne n’entre dans vos données avec un identifiant.',

  usoTitulo: 'À quoi servent vos données',
  usoTexto: 'À construire vos objectifs quotidiens, à suivre l’évolution du traitement et à organiser ce que vous apportez à la consultation. Rien de tout cela n’est un diagnostic, et l’application ne prescrit ni n’ajuste de dose.',

  /* ⚠️ LA PARTIE QU'UN AVIS DE CONSENTEMENT TAIT D'HABITUDE, et la seule
     ici qui change ce que la personne décide. */
  saiTitulo: 'Ce qui peut sortir d’ici, et seulement d’un geste de vous',
  saiTexto: 'Le résumé et les messages que vous envoyez à votre équipe de santé. Et la photo de l’assiette, quand vous utilisez la lecture par photo : elle est envoyée pour être lue et n’est pas conservée.',

  controleTitulo: 'Vous gardez la main',
  controleTexto: 'Vous pouvez corriger et effacer n’importe quel relevé, tout exporter dans un fichier et effacer vos données entièrement, à tout moment, dans les réglages.',

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

  exportacaoAviso: 'Relevés faits par la personne elle-même dans l’application. Ce n’est ni un dossier médical ni un compte rendu.',
  exportacaoTitulo: 'Vos données Morphi',

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
      `Du ${de} au ${ate} · ${semanas} ${semanas === 1 ? 'semaine' : 'semaines'}`,
    ultimas4: 'Les 4 dernières semaines',
    desdeAConsulta: 'Depuis la dernière consultation',
    tratamentoInteiro: 'Tout le traitement',

    oQueEntra: 'Ce qui entre',
    oQueEntraNota: 'Touchez pour inclure ou retirer. Ce qui reste dehors n’entre pas dans le fichier.',
    incluido: 'inclus',
    fora: 'dehors',

    aplicacoes: 'Injections',
    aplicacoesSub: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'relevé' : 'relevés'} · date, dose et endroit`,
    pesoEMedidas: 'Poids et mesures',
    pesoEMedidasSub: (pesagens: number, medidas: number) =>
      `${pesagens} ${pesagens === 1 ? 'pesée' : 'pesées'} · ${medidas} ${medidas === 1 ? 'mesure' : 'mesures'}`,
    checkins: 'Check-ins',
    checkinsSub: (dias: number) => `${dias} ${dias === 1 ? 'jour' : 'jours'} · symptôme par symptôme`,
    exames: 'Analyses',
    examesSub: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'résultat' : 'résultats'} · valeur et référence`,
    notas: 'Notes pour la consultation',
    notasSub: (quantas: number) => `${quantas} ${quantas === 1 ? 'note' : 'notes'}`,
    habitos: 'Repas, eau et exercice',
    habitosSub: (refeicoes: number) =>
      `${refeicoes} ${refeicoes === 1 ? 'repas noté' : 'repas notés'} et le journal du jour`,

    formatoTitulo: 'Il en sort un fichier .json',
    formatoTexto: 'C’est le format qu’une autre application sait ouvrir et lire — il sert à garder une copie ou à emporter vos relevés ailleurs. Pour la version faite pour être lue par quelqu’un, prenez le résumé de consultation.',

    gerar: 'Construire le fichier',
    gerando: 'Construction...',
    verResumo: 'Voir le résumé de consultation',

    pronto: 'Fichier construit. Il ne va que là où vous le décidez.',
    erro: 'Nous n’avons pas pu construire le fichier sur cet appareil. Vos relevés sont toujours là, intacts.',
    parado: 'Rien ne sort d’ici sans votre geste.',
  },

  telaPrivacidade: {
    titulo: 'Confidentialité et données',
    lead: 'Où vos relevés restent, ce qui sort d’ici et ce que l’application lit de l’extérieur.',

    ondeFicam: 'Où vos relevés restent',
    noAparelho: 'Sur l’appareil, dans l’application',
    noAparelhoTexto: 'Le poids, les mesures, les injections, les check-ins, les analyses, les photos et les notes sont écrits dans le stockage de l’application elle-même, sur cet appareil. Il n’y a ni compte ni mot de passe ici : personne n’entre dans vos données avec un identifiant, parce qu’il n’y a pas d’identifiant.',
    desinstalar: 'Désinstaller emporte tout',
    desinstalarTexto: 'Comme il n’y a de copie sur aucun serveur, effacer l’application efface les relevés. Il n’est pas possible de les récupérer ensuite.',

    oQueSai: 'Ce qui sort d’ici',
    oQueSaiNota: 'Rien ne sort d’ici sans un geste de votre part.',
    paraEquipe: 'Ce qui part vers votre équipe',
    paraEquipeTexto: 'Pour l’instant, rien. Le résumé de consultation se construit sur votre appareil et c’est vous qui le montrez ou l’exportez ; les messages restent ici. Quand le lien avec la clinique existera, les deux ne partiront qu’avec un geste de votre part — et rien de votre journal ne voyage tout seul, ni le poids, ni les symptômes, ni les repas.',
    fotoDoPrato: 'La photo de l’assiette, quand vous utilisez la lecture par photo',
    fotoDoPratoTexto: 'Elle est réduite sur l’appareil et envoyée pour être lue par un modèle, qui renvoie les éléments de l’assiette. L’image n’est pas conservée : ni dans votre relevé de repas, ni sur le serveur qui fait le pont. Noter le repas à la main n’envoie rien.',

    leDeFora: 'Ce que l’application lit de l’extérieur',
    appDeSaudePadrao: 'l’application santé du téléphone',
    soOPeso: (app: string) => `${app}, et le poids seulement`,
    soOPesoTexto: (app: string) =>
      `Avec votre permission, nous lisons les pesées que votre balance, votre montre ou une autre application y ont écrites. Nous ne faisons que lire : nous n’écrivons jamais rien dans ${app}. Et nous ne lisons que le poids — le sommeil, les pas et le rythme cardiaque restent dehors.`,
    permissao: 'La permission est la vôtre, et se retire quand vous voulez',
    permissaoTexto: 'Elle se donne dans les réglages du système et se retire au même endroit. Sans elle, l’application reste entière : le poids revient à entrer comme il entrait avant, tapé par vous.',

    podeFazer: 'Ce que vous pouvez faire maintenant',
    integracoesSub: (app: string) => `Activer ou désactiver ${app}`,
    resumo: 'Résumé pour la consultation',
    resumoSub: 'Voir tout ce qui entre dans le résumé de consultation',

    apagar: 'Effacer mes données',
    apagarSub: 'Tout ce que vous avez noté, sans retour',
    apagarPergunta: 'Tout effacer ? Il n’y a de copie nulle part.',
    apagarConfirma: 'Effacer',
    cancelar: 'Annuler',

    documentos: 'Les documents',
    politicaSub: 'Le document complet, avec la base légale et les durées',
    termosSub: 'Ce que nous sommes, ce que nous ne sommes pas, et ce que chaque côté peut attendre',
    semPoliticaTitulo: 'Ceci décrit l’application, ce n’est pas la politique de confidentialité',
    semPoliticaTexto: 'Voici ce que le programme fait de vos données. Le document juridique, avec les obligations de qui exploite le service, reste à publier — et quand il existera, il apparaîtra sur cet écran.',
  },

  telaIntegracoes: {
    titulo: 'Intégrations',
    lead: 'Activées, elles font entrer vos pesées sans que vous les tapiez.',

    doSeuAparelho: 'De votre appareil',
    doSeuAparelhoNota: 'Un dépôt local : nous demandons la permission et nous lisons. Sans compte et sans mot de passe.',

    atualizarAgora: 'Actualiser maintenant',
    lendo: 'Lecture…',
    nadaNovo: 'Rien de neuf là-bas — vos pesées étaient déjà toutes ici.',
    trazidas: (quantas: number, aparelho: string) =>
      `${quantas} ${quantas === 1 ? 'pesée récupérée' : 'pesées récupérées'} depuis ${aparelho}.`,
    naoDeuParaLer: 'Impossible de lire à l’instant. Réessayez dans un moment.',
    acessoNegado: 'L’accès n’a pas été autorisé. Vous pouvez changer cela dans les réglages de l’appareil.',

    semAparelhoTitulo: 'L’application santé de l’appareil apparaît sur le téléphone',
    semAparelhoTexto: 'Apple Santé sur iPhone, Health Connect sur Android. Dans le navigateur il n’y a rien à activer.',
    semAppTitulo: (aparelho: string) => `${aparelho} n’est pas disponible sur cet appareil`,
    semAppTexto: 'Health Connect est fourni à partir d’Android 14 et peut s’installer sur les versions antérieures. Une fois installé, revenez ici.',
    semBuildTitulo: 'Cette version de l’application ne lit pas encore l’appareil',
    semBuildTexto: 'Lire Apple Santé et Health Connect demande une version installée de l’application, et non l’aperçu. Dans Expo Go elle n’existe pas.',

    contasDeServico: 'Comptes de service',
    contasDeServicoNota: 'Ceux-là livrent les données à un serveur, et non au téléphone — la liaison arrive quand ce serveur sera debout. En attendant, ce qu’ils envoient à l’application santé de votre appareil arrive déjà ici.',
    emBreve: 'Bientôt',
  },
};
