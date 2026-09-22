/* ============================================================
   LE SUIVI — l'espace des personnes · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/cuidado.ts. La règle qui vaut pour
   le fichier entier est plus dure que celle des autres :

   ⚠️⚠️ AUCUNE PHRASE D'ICI NE PEUT AFFIRMER CE QUE L'ÉQUIPE A FAIT SANS LE
   SAVOIR. « Votre équipe a mis à jour votre traitement » n'est vrai que
   s'il existe une plateforme — c'est elle qui apporte la nouvelle
   consigne. Sans serveur, l'application sait que la consultation a eu
   lieu, parce que la personne l'a dit, et rien de plus. D'où les paires
   avec et sans plateforme : ce ne sont pas des variantes de ton, la
   différence entre les deux est une affirmation de fait.

   ⚠️ ET LE TITRE NE MET PAS DE NOTE. La pastille du haut disait « Bonne
   observance » ou « Observance faible » — et la troisième apparaissait
   pour qui avait manqué deux doses, ce qui arrive presque toujours parce
   qu'on s'est senti mal. Une conséquence du traitement devenait une note
   sur la personne au premier endroit où tombe l'œil. Aujourd'hui c'est
   « 8 sur 11 doses », qui dit la même chose sans juger et dit plus : la
   note écrasait 70% et 89% sous la même étiquette.
   ============================================================ */

export const cuidado = {
  /* ⚠️ CHAQUE ITEM A TROIS TEXTES, et le troisième n'est pas le résumé des
     autres : `texto` dit quoi faire, `sub` dit pourquoi maintenant, et
     `rotulo` dit comment le TITRE nomme cet item quand il les liste dans
     une seule phrase. « Programmer une prise de sang » est ce qu'on fait ;
     pour la phrase, le sujet est « analyses ». Traduire les deux pareil
     défait le titre. */
  pendencias: {
    mensagemUma: 'Répondre au message de votre équipe',
    mensagemVarias: (quantas: number) => `Répondre aux ${quantas} messages de votre équipe`,
    mensagemSub: 'en attente de votre réponse',
    mensagemRotulo: 'messages',

    receita: 'Demandez le renouvellement de l’ordonnance',
    receitaSub: (doses: number, semanas: number) =>
      `${doses} ${doses === 1 ? 'dose restante' : 'doses restantes'} · environ ${semanas} ${semanas === 1 ? 'semaine' : 'semaines'}`,
    receitaRotulo: 'ordonnance',

    /* Le titre de l'analyse vient du protocole — c'est ce que l'équipe a
       écrit, pas notre texte. Ce qui est de nous, c'est d'où il vient :
       avec une équipe, c'est elle qui l'a demandé ; sans équipe, c'est le
       plan lui-même, et dire « demandé par votre équipe » en inventerait
       une. */
    exameSubDaEquipe: 'demandée par votre équipe',
    exameSubDoProtocolo: 'du protocole de cette semaine',
    exameRotulo: 'analyses',

    consulta: 'Préparez ce que vous apporterez à la consultation',
    consultaSub: (tipo: string, quando: string, doutor: string) =>
      `${tipo} ${quando} · avec ${doutor}`,
    consultaRotulo: 'consultation',
  },

  estado: {
    /* ⚠️ C'ÉTAIT LE MÊME MOT ÉCRIT QUATRE FOIS, un par moment. Les quatre
       cartes sont la même carte à des moments différents. */
    kicker: 'VOTRE SUIVI',

    /* Le saut de ligne est voulu : valeur en haut, unité en bas, pour une
       lecture d'un coup d'œil. */
    metricaSemanas: 'semaines\nde suivi',
    metricaAplicacoes: 'injections\nnotées',

    /* ⚠️ « DOSES » ET NON « INJECTIONS » : cette pastille partage la ligne
       avec le pouls, et le mot long le pousse sur deux lignes. */
    adesao: (feitas: number, previstas: number) =>
      `${feitas} sur ${previstas} ${previstas === 1 ? 'dose' : 'doses'}`,

    consultaTitulo: 'Votre consultation approche.',
    consultaHoje: (doutor: string) =>
      `Votre consultation avec ${doutor} est aujourd’hui. Autant revoir ce que vous voulez demander.`,
    consultaFaltam: (dias: number, doutor: string) =>
      `${dias === 1 ? 'Il reste 1 jour' : `Il reste ${dias} jours`} avant votre consultation avec ${doutor}.`,
    consultaPulso: (quando: string) => `Consultation ${quando}`,

    /* ⚠️ LES DEUX VERSIONS NE SONT PAS DE TON, ELLES SONT DE FAIT. Sans
       plateforme, l'application ne sait pas ce qui a été décidé dans le
       cabinet, et la phrase change de propriétaire. */
    posConsultaTituloComPlataforma: 'Votre équipe a mis à jour votre traitement.',
    posConsultaTituloSemPlataforma: 'Vous avez eu une consultation récemment.',
    posConsultaTextoComPlataforma: 'Regardez les consignes de la consultation et ce qui change dans votre dose à partir de maintenant.',
    posConsultaTextoSemPlataforma: 'Si la dose ou l’intervalle ont changé, autant le mettre à jour ici — c’est ce qui garde les calculs de l’application justes.',
    posConsultaPulso: 'Traitement mis à jour',

    /* ⚠️ « NOUS AVONS QUELQUES CHOSES À RÉGLER » — première personne du
       pluriel, et non « vous avez des choses en attente ». La liste en
       dessous porte sur des choses qui dépendent d'elle, et ouvrir en
       pointant du doigt sur une carte de santé est le mauvais début. */
    pendenciaTitulo: 'Nous avons quelques choses à régler.',
    /* ⚠️ NOMME CE QUE C'EST, au lieu de compter combien. « Deux choses »
       oblige à faire défiler pour savoir si ça compte. Et les noms
       viennent de la liste ELLE-MÊME, item par item. */
    pendenciaTexto: (quantas: string, plural: boolean, assuntos: string) =>
      `${quantas} ${plural ? 'choses attendent' : 'chose attend'} après vous — ${assuntos}. Rien d’urgent, mais autant le régler cette semaine.`,
    pendenciaPulso: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'élément en attente' : 'éléments en attente'}`,
    /* Jusqu'à quatre en toutes lettres, qui est le plafond réel. */
    porExtenso: ['aucune', 'une', 'deux', 'trois', 'quatre'],

    emDiaTitulo: 'Votre suivi est à jour.',
    /* ⚠️ LA SECONDE VERSION EXISTE PARCE QUE LA PHRASE COMMENÇAIT PAR LE
       NOM DE LA MÉDECIN. Sans personne d'enregistré, elle ouvrait sur un
       blanc. Qui mène son traitement seule le mène depuis aussi
       longtemps. */
    emDiaComQuem: (quem: string, semanas: number) =>
      `${quem} suit votre traitement depuis ${semanas} semaines. Votre observance est bonne et il n’y a rien d’important en attente pour l’instant.`,
    emDiaSozinha: (semanas: number) =>
      `Vous êtes à ${semanas} semaines de traitement, avec une bonne observance et rien d’important en attente pour l’instant.`,
    emDiaPulso: 'Suivi à jour',
  },

  dose: {
    aplicacaoHoje: 'Injection aujourd’hui',
    proximaAplicacao: (quando: string) => `Prochaine injection ${quando}`,
    nestaDoseHa: (semanas: number) =>
      `À cette dose depuis ${semanas} ${semanas === 1 ? 'semaine' : 'semaines'}`,
    /* Le `quando` arrive déjà en « dans 9 jours » / « demain », avec la
       préposition dedans — d'où l'absence d'une seconde. */
    revisaoNaConsulta: (quando: string) => `Révision à la consultation ${quando}`,
    revisaoHoje: 'd’aujourd’hui',
  },

  equipe: {
    /* Le rôle de qui n'a pas de spécialité notée. Ce n'est pas
       « Médecin » : ça peut ne pas l'être, et l'application ne le sait
       pas. Ce qu'elle sait, c'est la fonction. */
    responsavelPadrao: 'Responsable du traitement',
  },

  /* ⚠️ CHAQUE LIGNE N'EXISTE QU'AVEC SA DONNÉE. « Téléphone — » dans une
     liste de contacts, c'est l'écran qui promet un canal qui n'existe pas.
     Et l'ordre va du canal le plus rapide au plus formel. */
  contato: {
    whatsapp: 'WhatsApp',
    whatsappSub: 'Parler à la clinique',
    telefone: 'Téléphone',
    site: 'Site web',
    email: 'E-mail',
    instagram: 'Instagram',
  },

  tela: {
    paraAConsulta: (quando: string) => `POUR LA CONSULTATION ${quando}`,
    resumoPronto: 'Votre résumé est déjà prêt',
    vouPreparar: 'Je vais préparer votre résumé',

    linhaDoPlano: (previstas: number, temHorizonte: boolean): [string, string, string] => [
      'Semaine ',
      temHorizonte ? ` sur ${previstas} jusqu’à votre objectif · ` : ' de votre traitement · ',
      ' avec l’injection faite',
    ],

    ultimaOrientacao: 'DERNIER CONSEIL',
    voceEscreveu: 'VOUS AVEZ ÉCRIT',
    naoLida: 'non lu',
    responder: 'Répondre',
    enviarPrimeira: 'Envoyer le premier message',

    precisaDeVoce: 'A besoin de vous',
    nadaPrecisa: 'Rien n’a besoin de vous pour le moment.',
    emDia: 'Votre suivi est à jour.',

    proximaConsulta: 'Votre prochaine consultation',
    consultasLink: 'Consultations',
    anotarConsulta: 'Noter une consultation',
    anotarConsultaSub: 'Avec la date ici, le résumé est prêt et nous vous prévenons quand elle approche.',
    eQuando: (quando: string) => `C’est ${quando}`,
    preparoTexto: 'Je construis un résumé avec le poids, l’observance et les symptômes de la période — vous choisissez ce que vous voulez demander.',
    prepararAConsulta: 'Préparer la consultation',

    seuTratamento: 'Votre traitement',
    aplicacoesLink: 'Injections',
    dosesEm: (onde: string) => `Doses ${onde}`,
    restamDe: (restam: number, total: number, semanas: number) =>
      `${restam} sur ${total} · environ ${semanas} ${semanas === 1 ? 'semaine' : 'semaines'}`,
    pedirRenovacao: 'Demander le renouvellement',

    exames: 'Analyses',
    marcadoresAcompanhados: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'marqueur suivi' : 'marqueurs suivis'}`,
    nenhumResultado: 'Aucun résultat enregistré',
    importeUmExame: 'Importez une analyse pour commencer à la suivre',
    foraDaReferencia: (quantos: number) => `${quantos} hors des valeurs de référence`,
    todosNaReferencia: 'Tous dans les valeurs',

    quemAcompanha: 'Qui suit votre traitement',
    ninguemRegistrado: 'Personne de noté pour l’instant',
    seVoceSeTrata: 'Si quelqu’un vous suit, notez-le ici — le résumé sort prêt pour la consultation.',

    acompanhamentoProfissional: 'Suivi professionnel',
    conhecaParceiros: 'Découvrir les médecins partenaires',
    parceirosTexto: 'Certaines cliniques suivent le traitement ici avec vous — des messages entre les consultations, votre résumé qui arrive à l’équipe et l’agenda déjà rempli.',
    passouATer: 'Vous avez maintenant un suivi médical ?',
    anoteQuemE: 'Notez qui c’est.',
  },

  telaAcompanhamento: {
    leadComVinculo: 'Ces informations viennent de la clinique qui suit votre traitement.',
    /* ⚠️ « Où vous êtes suivie » demanderait le genre de qui lit, comme le
       portugais le demandait. La phrase a été tournée pour ne pas en avoir
       besoin. */
    ondeAtendida: 'Où se passent les consultations',
    quemCorrige: 'C’est la clinique qui corrige',
    quemCorrigeTexto: 'Si une information est fausse, parlez-en à l’équipe — c’est elle qui tient cette fiche, et ce qui est corrigé là-bas arrive ici.',

    lead: 'Si quelqu’un vous suit, notez-le ici. C’est ce qui fait sortir le résumé prêt pour la consultation et apparaître la préparation des questions au bon moment.',

    nome: 'Nom',
    nomeAjuda: 'Comment vous appelez cette personne. Cela peut être le nom du cabinet, si vous préférez.',
    nomePlaceholder: 'Tapez le nom',
    especialidade: 'Spécialité',
    opcional: 'Facultatif.',
    especialidadePlaceholder: 'Endocrinologie',
    ondeAtende: 'Lieu de consultation',
    ondeAtendeAjuda: 'Facultatif — clinique, hôpital ou cabinet.',
    ondeAtendePlaceholder: 'Tapez la clinique ou le cabinet',

    nadaEnviado: 'Rien de tout cela n’est envoyé à personne',
    nadaEnviadoTexto: 'Le nom reste dans l’application, avec vous. Pour que votre équipe reçoive vos données, il faut un code d’invitation de la clinique — et c’est elle qui tient cette fiche à partir de là.',
    salvar: 'Enregistrer',

    naoTenhoMais: 'Je n’ai plus de suivi',
    tirarPergunta: 'Retirer qui vous suit ?',
    tirarTexto: 'Tous vos relevés restent ici — poids, injections, symptômes, analyses et notes. Ce qui part, c’est seulement le nom.',
    simTirar: 'Oui, retirer',
    cancelar: 'Annuler',
  },

  telaAnotarConsulta: {
    titulo: 'Noter une consultation',

    quemMarca: 'C’est la clinique qui prend le rendez-vous',
    quemMarcaLead: 'Votre agenda vient de l’équipe qui suit votre traitement.',
    datasChegam: 'Les dates arrivent de la clinique',
    datasChegamTexto: 'Pour déplacer ou annuler, parlez-en à l’équipe — ce qui change là-bas apparaît ici.',

    proximaConsulta: 'Votre prochaine consultation',
    anoteSuaConsulta: 'Notez votre consultation',
    lead: 'Avec la date ici, nous vous prévenons quand elle approche et nous laissons le résumé prêt à emporter.',

    quando: 'Quand',
    comoVaiSer: 'Comment ça se passera',
    tipos: {
      presencial: 'Sur place',
      teleconsulta: 'Téléconsultation',
      retorno: 'Contrôle',
    },
    comQuem: (quem: string) => `Avec ${quem}.`,

    dataFicaComVoce: 'La date reste chez vous',
    dataFicaComVoceTexto: 'La noter ici ne prévient pas le cabinet et n’entre pas dans le calendrier du téléphone. C’est nous qui savons désormais que la consultation approche.',

    salvar: 'Enregistrer',
    anotar: 'Noter la consultation',
    naoTenho: 'Je n’ai pas de consultation prévue',
  },
  telaConsultas: {
    titulo: 'Consultations',
    leadComData: 'La prochaine, ce qu’il faut y apporter, et celles qui ont déjà eu lieu.',
    leadSemData: 'Ce qu’il faut apporter à la prochaine, et celles qui ont déjà eu lieu.',

    jaPassou: 'DÉJÀ PASSÉE',
    proxima: 'PROCHAINE',
    /* Sans virgule : le français écrit "lundi 3 octobre", et la virgule
       est une habitude du portugais. */
    dataDaConsulta: (diaDaSemana: string, data: string, quem: string) =>
      `${diaDaSemana} ${data}${quem ? ` · ${quem}` : ''}`,
    jaAconteceu: 'Elle a eu lieu',
    verResumo: 'Voir le résumé à emporter',
    mudarData: 'Changer la date',

    nenhumaAnotada: 'Aucune consultation notée',
    clinicaMarca: 'Quand votre équipe prendra la prochaine, elle apparaîtra ici.',
    semDataTexto: 'Avec la date ici, nous vous prévenons quand elle approche et nous laissons le résumé prêt à emporter.',
    anotarConsulta: 'Noter une consultation',

    paraLevar: 'À emporter',
    paraLevarSub: (faltando: number): string =>
      faltando === 0
        ? 'Tout est à jour — le résumé se monte déjà avec ça.'
        : faltando === 1
          ? 'Il manque une chose pour que le résumé soit complet.'
          : `Il manque ${faltando} choses pour que le résumé soit complet.`,

    anteriores: 'Consultations passées',
    linhaAnterior: (tipo: string, data: string) => `${tipo} · ${data}`,

    consultaGenerica: 'Consultation',
  },
};
