import { medidas } from './medidas';

/* ============================================================
   L'ACCUEIL ET LE PARCOURS — les objectifs du jour, les cartes et la frise · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/home.ts. Les deux qui commandent :

   TOUT NOMBRE AFFICHÉ VIENT AVEC UN VERDICT, et c'est le mot que la
   personne cherche en premier. La valeur dit la mesure ; le mot dit si
   c'est bien. Sans lui, elle fait le calcul toute seule, et dans une
   application de santé elle le fait mal.

   ET AUCUN VERDICT D'ICI NE MET UNE NOTE À LA PERSONNE. « En dessous de
   l'objectif » qualifie le nombre ; « vous ne vous êtes pas assez
   appliquée » qualifierait qui l'a produit. La différence se perd
   facilement en traduisant, et le fichier entier en dépend.
   ============================================================ */

/* ⚠️ LES NOMS DU CORPS VIENNENT DE medidas.corpo et ne sont pas écrits
   ici. Voir ../pt-BR. */
export const home = {
  /* ⚠️ « OBJECTIF ATTEINT » N'EST PAS UNE FÊTE, C'EST UN ÉTAT. Ça occupe la
     même place que « Il reste 27 g » — c'est la même ligne qui dit la même
     chose de l'autre côté. Un « Bravo ! » là changerait ce qu'est la
     carte. */
  metas: {
    proteina: 'Apport en protéines',
    agua: 'Boire plus d’eau',
    exercicio: 'Bouger chaque jour',
    batida: 'Objectif atteint',
    faltamProteina: (gramas: number) => `Il reste ${gramas} g`,
    /* La quantité arrive déjà écrite, dans l'unité de qui lit. */
    faltamAgua: (quanto: string) => `Il reste ${quanto}`,
    faltamExercicio: (minutos: number) => `Il reste ${minutos} min`,
  },

  /* ⚠️ « PRÈS DE L'OBJECTIF » EST UNE BONNE NOUVELLE, et c'est voulu : 85%
     de l'objectif de protéines est une bonne journée, et appeler ça « en
     dessous » apprend à la personne à ignorer le mot. Le troisième échelon
     existe pour que le premier continue de vouloir dire quelque chose. */
  veredito: {
    naMeta: 'Dans l’objectif',
    pertoDaMeta: 'Près de l’objectif',
    abaixoDaMeta: 'En dessous de l’objectif',
    /* ⚠️ « EN BAISSE » EST LA BRANCHE QUI SAUVE LA CARTE DE MASSE GRASSE.
       Qui est au-dessus de l'objectif mais descend depuis le début n'est
       pas en échec — elle est à mi-chemin, là où presque tout le monde
       est. */
    emQueda: 'En baisse',
    acimaDaMeta: 'Au-dessus de l’objectif',
  },

  /* ⚠️ LE TITRE CHANGE AUSSI, ET PAS SEULEMENT LE NOMBRE. « Poids perdu »
     au-dessus de « +3,3 kg » est une contradiction à l'intérieur de la
     même carte — et le mauvais mot fait plus mal que le nombre. */
  peso: {
    perdido: 'Poids perdu',
    variacao: 'Variation du poids',
    meta: (quanto: string, unidade: string) => `Objectif : ${quanto} ${unidade}`,
  },

  /* ⚠️ « STABLE », ET NON « −0,0 ». Un nombre qui n'a pas bougé n'a varié
     d'aucun côté, et le mot est celui-là. Ce n'est ni une bonne ni une
     mauvaise nouvelle. */
  estavel: 'Stable',

  tipos: {
    checkin: 'Check-ins',
    aplicacao: 'Injections',
    peso: 'Poids',
    refeicao: 'Repas',
    exercicio: 'Séances',
    consulta: 'Consultations',
    exame: 'Analyses',
  },

  evento: {
    aplicacao: (dose: string, unidade: string) => `Injection ${dose} ${unidade}`,
    peso: 'Poids',
    /* La première pesée n'a pas de précédente à comparer, donc à la place
       de la variation il y a ce qu'elle est. */
    pesoInicial: 'Poids de départ',
    checkin: 'Check-in',
    exercicio: 'Séance',
    minDeMovimento: (minutos: number) => `${minutos} min de mouvement`,
    proteinaDaRefeicao: (quanto: string) => `Protéines ${quanto}`,
    consulta: (tipo: string) => `Consultation ${tipo}`,
    marcadoresDe: (quantos: number, fonte: string) => `${quantos} marqueurs · ${fonte}`,
    marcadoresDetalhe: (nome: string, quantos: number, fonte: string) =>
      `${nome} · ${quantos} marqueurs · ${fonte}`,
    compartilhado: 'Partagé',

    gramasDeProteina: (gramas: number) => `${gramas} g protéines`,
    horasDeSono: (horas: number) => `${horas}h de sommeil`,

    /* ⚠️ LE VERDICT DU JOUR VIENT DE L'HUMEUR, et les trois mots sont
       courts à dessein : ils occupent la colonne de droite, à côté d'un
       nombre. « Difficile » est le plus important des trois — il nomme la
       mauvaise journée sans l'appeler un échec. */
    diaBem: 'Bien',
    diaNeutro: 'Neutre',
    diaDificil: 'Difficile',

    respostaHumor: 'Humeur',
    respostaEnergia: 'Énergie',
    respostaFome: 'Faim',
    respostaOutroSintoma: 'Autre symptôme',
  },

  /* ⚠️ LE RÉSUMÉ RACONTE CE QUE LA SEMAINE A DONNÉ, il ne liste pas ce qui
     s'est passé. D'où le singulier et le pluriel propres à chaque type —
     « 1 pesée » et « 3 pesées » —, et non un « (s) » accroché.

     ⚠️ ET « repas » NE CHANGE PAS au pluriel en français, ce qui est
     exactement la raison pour laquelle la paire est écrite en entier. */
  semana: {
    checkin: ['check-in', 'check-ins'] as [string, string],
    peso: ['pesée', 'pesées'] as [string, string],
    refeicao: ['repas', 'repas'] as [string, string],
    exercicio: ['séance', 'séances'] as [string, string],
    consulta: ['consultation', 'consultations'] as [string, string],
    exame: ['analyse', 'analyses'] as [string, string],
    contagem: (quantos: number, nome: string) => `${quantos} ${nome}`,
    /* ⚠️ UNE SEMAINE VIDE A SA PROPRE PHRASE, et non un blanc : une semaine
       sans relevé a eu lieu, et son chapitre existe. */
    semRegistros: 'Aucun relevé cette semaine',

    hidratacao: 'Hydratation',
    proteina: 'Protéines',
    exercicioMetrica: 'Exercice',
    pesoMetrica: 'Poids',
    litrosPorDia: (quanto: string) => `${quanto} L/jour`,
    gramasPorDia: (quanto: number) => `${quanto} g/jour`,
    minutos: (quanto: number) => `${quanto} min`,
    deltaLitros: (quanto: string) => `${quanto} L`,
    deltaGramas: (quanto: string) => `${quanto} g`,
    deltaMinutos: (quanto: string) => `${quanto} min`,
  },

  mudancas: {
    peso: medidas.corpo.peso,
    cintura: medidas.corpo.cintura,
    gorduraCorporal: medidas.corpo.gordura,
    /* ⚠️ LA SEULE OÙ MONTER EST LA BONNE NOUVELLE : le muscle perdu en
       maigrissant est ce que le traitement essaie d'éviter. L'étiquette ne
       le dit pas — c'est le ton qui le dit —, mais qui traduit doit le
       savoir. */
    massaMagra: medidas.corpo.massaMagra,
    naReferencia: 'Dans la référence',
    foraDaReferencia: 'Hors référence',
    pressao: 'Tension',
    /* ⚠️ « STABLE » ÉTAIT CE QUI RESTAIT DE TOUT CE QUI N'ÉTAIT PAS UNE
       BAISSE, et une tension qui montait de quatorze points sortait comme
       stable — en vert. Monter a un nom. */
    pressaoEmQueda: 'En baisse',
    pressaoEmAlta: 'En hausse',
    pressaoEstavel: 'Stable',
  },

  metaDePeso: {
    /* « Arriver à 68 kg », et non « Objectif : 68 kg » : la liste est
       faite de choses à obtenir, et c'est le verbe qui la fait ressembler
       à l'une d'elles. */
    chegarA: (peso: string) => `Arriver à ${peso}`,
    alcancada: 'objectif atteint',
    faltam: (quanto: string) => `il reste ${quanto}`,
  },

  /* ⚠️ SEUL LE NOM D'APPLE CHANGE DE LANGUE, parce que c'est Apple qui
     traduit le nom de sa propre application. */
  fontes: {
    appleSaude: 'Apple Santé',
  },

  /* ⚠️ L'ÉCRAN DU PARCOURS VIT DANS `home` parce que c'est la même
     conversation — les étiquettes de type et les pluriels de la semaine
     étaient déjà ici. Voir ../pt-BR/home pour les trois silences. */
  telaJornada: {
    ultimos7: 'VOS 7 DERNIERS JOURS',
    doseEm: (quando: string) => `dose ${quando}`,
    diasComCheckin: (feitos: number, aplicadas: number, vividas: number) =>
      `${feitos} jours sur 7 avec un check-in · ${aplicadas} semaines sur ${vividas} avec une injection`,
    semanaASemana: 'Semaine par semaine. Touchez pour voir ce qui a marqué chaque cycle.',
    semanaEDia: (semana: number, dia: number) => `SEMAINE ${semana} · JOUR ${dia}`,
    noInicio: (peso: string) => `${peso} au départ`,
    hoje: 'aujourd’hui',
    faltam: (peso: string) => `il reste ${peso}`,

    protocolos: 'Protocoles',
    sinaisVitais: 'Constantes',
    refeicoesContadas: (quantas: number) => `${quantas} repas`,
    aguaHoje: (quanto: string) => `${quanto} aujourd’hui`,
    minutosHoje: (minutos: number) => `${minutos} min aujourd’hui`,
    indicadores: (quantos: number) => `${quantos} ${quantos === 1 ? 'mesure' : 'mesures'}`,
    feitasDeTotal: (feitas: number, total: number) => `${feitas} sur ${total}`,

    semRegistro: 'rien de noté',
    semQueixas: 'aucune plainte cette semaine',
    sintomaEmDias: (sintoma: string, dias: number) =>
      `${sintoma.toLowerCase()} sur ${dias} ${dias === 1 ? 'jour' : 'jours'}`,

    dosesNaCaneta: (restam: number, total: number, semanas: number) =>
      `${restam} doses sur ${total} dans le stylo · environ ${semanas} ${semanas === 1 ? 'semaine' : 'semaines'}`,

    oQueJaMudou: 'Ce qui a changé',
    evolucao: 'Évolution',
    suasMetas: 'Vos objectifs',
    metas: 'Objectifs',
    oDiaADia: 'Le quotidien',
    seuTratamento: 'Votre traitement',
    verTudo: 'Tout voir',

    porSemana: 'Par semaine',
    semana: (numero: number) => `Semaine ${numero}`,
    doseAjustada: 'dose ajustée',
    semRegistrosNaSemana: 'Rien de noté cette semaine.',
    nadaNesteTipo: 'Rien de noté dans ce type pour l’instant',

    /* ⚠️ « FAIT » ET « OUVERT » AU MASCULIN INVARIABLE : l'étiquette parle
       de l'objectif — masculin en français —, et non de qui l'a atteint.
       Rien n'accorde avec la personne. */
    metaFeita: 'fait',
    metaAberta: 'ouvert',
  },

  telaInicio: {
    bomDia: 'Bonjour',
    /* ⚠️ LE FRANÇAIS N'A QUE DEUX SALUTATIONS, pas trois. « Bon après-midi »
       est une formule de CONGÉ — on la dit en partant —, et l'écran s'en
       sert pour accueillir. « Bonjour » couvre la journée jusqu'au soir,
       et c'est pourquoi les deux premières clés disent la même chose. La
       coupure à midi reste dans le code : elle est juste sans effet ici. */
    boaTarde: 'Bonjour',
    boaNoite: 'Bonsoir',
    linhaDoDia: (dia: string, semana: number) => `${dia} • Semaine ${semana}`,

    semRegistro: 'PAS DE RELEVÉ',
    semRegistroOntem: 'L’injection d’hier n’est pas notée.',
    semRegistroDias: (dias: number) => `L’injection d’il y a ${dias} jours n’est pas notée.`,
    semRegistroCorpo: 'Si vous l’avez faite, vous pouvez la noter maintenant. Sinon, le cycle repart à la prochaine.',
    semRegistroCta: 'Noter une injection',

    aConsulta: 'LA CONSULTATION',
    consultaHoje: 'Votre consultation est aujourd’hui.',
    consultaAmanha: 'Votre consultation est demain.',
    consultaCorpo: 'J’apporte la période mise en ordre — poids, observance, symptômes et les questions qui valent le coup.',
    consultaCta: 'Voir le résumé',

    acabou: (oRecipiente: string) => `${oRecipiente} est vide.`,
    restaUmaDose: (onde: string) => `Il reste une dose ${onde}.`,
    receitaCorpo: 'Une nouvelle ordonnance prend quelques jours entre la demande et la pharmacie — s’y mettre maintenant évite de s’arrêter en chemin.',
    pedirRenovacao: 'Demander le renouvellement',
    verRecipiente: (oRecipiente: string, _recipiente: string) => `Voir ${oRecipiente}`,

    entendaOPorQue: 'Comprendre pourquoi',

    proximaAplicacao: 'PROCHAINE INJECTION',
    hojeEDiaDeAplicar: 'C’est aujourd’hui que vous faites votre dose.',
    proximaDose: (quando: string) => `Votre prochaine dose est ${quando}.`,
    doseCorpo: (medicamento: string, dose: string, local: string) =>
      `${medicamento} ${dose} · ${local} suggéré.`,
    verAplicacao: 'Voir l’injection',
    criarLembrete: 'Créer un rappel',

    checkinFeito: 'Check-in fait',
    fazerCheckin: 'Faire le check-in',
    diasSeguidos: (dias: number): string => (dias === 1 ? 'jour de check‑in' : 'jours de check‑in d’affilée'),

    metasDiarias: 'Vos objectifs du jour',
    metasLink: 'Objectifs',
    registrar: 'Noter',
    evolucao: 'Votre évolution',
    evolucaoLink: 'Évolution',
    gPorDia: 'g/jour',
    semMedida: 'pas de mesure',

    quemCuida: 'Qui prend soin de vous',
    areaMedica: 'Espace médical',
    mensagens: 'Messages',
    novasMensagens: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'nouveau message' : 'nouveaux messages'}`,
    nenhumaMensagem: 'Aucun nouveau message',
    proximaConsulta: 'Prochaine consultation',
    consultaEm: (data: string, diaDaSemana: string) => `${data} • ${diaDaSemana}`,
    solicitarReceita: 'Demander une nouvelle ordonnance',
    solicitarReceitaSub: 'Un message à votre équipe',
    acompanhaSeuTratamento: 'Suit votre traitement',
    resumoParaConsulta: 'Résumé pour la consultation',
    resumoParaConsultaSub: 'Poids, observance, symptômes et analyses dans un seul document',
    anotarConsulta: 'Noter une consultation',
    anotarConsultaSub: 'Pour vous prévenir quand elle approche',
    quemAcompanha: 'Qui suit votre traitement ?',
    quemAcompanhaSub: 'Notez le nom et le résumé sort déjà adressé pour la prochaine consultation.',
    preencherFicha: 'Remplir la fiche',
  },

  telaSemana: {
    titulo: 'Semaine',
    semanaN: (numero: number) => `Semaine ${numero}`,
    vazio: 'Il n’y a pas encore de semaines notées.',
    lead: (periodo: string, dose: string) => `${periodo} · ${dose}`,

    aplicacao: 'Injection',
    semPesagem: 'pas de pesée',

    comoSeSentiu: 'Comment vous vous sentiez',
    diasRespondidos: (quantos: number) => `${quantos} jours sur 7 remplis`,
    sintomaDias: (legenda: string, dias: number) =>
      `${legenda} · ${dias} ${dias === 1 ? 'jour' : 'jours'}`,
    energia: 'Énergie',
    energiaDe5: (media: string) => `${media} sur 5`,

    diaADia: 'Jour après jour',
    diaComData: (diaDaSemana: string, data: string) => `${diaDaSemana}, ${data}`,
    selo: {
      aplicacao: 'injection',
      checkin: 'check-in',
      peso: 'pesée',
      refeicao: 'repas',
      exercicio: 'exercice',
      consulta: 'consultation',
      exame: 'analyse',
    },

    nota: 'Note pour la consultation',
    verTodas: 'Voir toutes',
    citacao: (texto: string) => `« ${texto} »`,
    nenhumaNota: 'Aucune note cette semaine',
    anotadaEm: (data: string) => `Notée le ${data}`,
    toqueParaEscrever: 'Touchez pour en écrire une',
  },

  telaRegistrar: {
    titulo: 'Que voulez-vous noter ?',

    checkinChapeu: 'CHECK-IN DU JOUR',
    checkinFeito: 'Fait aujourd’hui',
    checkinPendente: 'Comment s’est passée votre journée ?',
    checkinEditar: 'Modifier',
    diasSeguidos: (dias: number): string => (dias === 1 ? 'jour d’affilée' : 'jours d’affilée'),

    agua: 'J’ai\nbu',
    aguaSub: (bebido: string, alvo: string) => `${bebido} sur ${alvo} L`,
    exercicio: 'J’ai\nbougé',
    exercicioSub: (feito: number, alvo: number) => `${feito} sur ${alvo} min`,
    refeicao: 'J’ai mangé',
    refeicaoSub: (proteina: number, alvo: number) => `${proteina} sur ${alvo} g`,

    levaUmMinuto: 'ÇA PREND UNE MINUTE',
    aplicacao: 'J’ai fait ma dose',
    peso: 'Je viens de me peser',
    medidas: 'J’ai pris mes mesures',
    exame: 'J’ai reçu une analyse',
    anotacao: 'J’ai noté quelque chose pour la consultation',
  },
  telaRitmo: {
    titulo: 'Comment nous lisons votre rythme',
    sub: 'L’étiquette regarde la régularité du traitement, pas la vitesse de la perte de poids.',

    aplicacoes: 'Injections à jour',
    /* Aqui o nome vem depois de `aplicadas`, e é com ele que concorda. */
    aplicacoesSub: (aplicadas: number, vividas: number) =>
      `${aplicadas} ${aplicadas === 1 ? 'semaine' : 'semaines'} sur ${vividas}`,

    intervalo: 'Intervalle entre les doses',
    intervaloEmDia: (dias: number) => `${dias} ${dias === 1 ? 'jour' : 'jours'}, sans longs retards`,
    intervaloMaior: (dias: number) => `intervalle le plus long : ${dias} ${dias === 1 ? 'jour' : 'jours'}`,

    sintomas: 'Symptômes signalés',
    sintomasLeves: 'Légers',
    sintomasModerados: 'Légers à modérés',
    sintomasFortes: 'Modérés à forts',

    seloOk: 'ok',
    seloAtencao: 'attention',
    seloIrregular: 'irrégulier',
    seloEstavel: 'stable',
    seloEmAlta: 'en hausse',

    avisoTitulo: 'Une semaine différente ne change pas l’étiquette',
    avisoTexto: (etiqueta: string) =>
      `Elle ne monte ni ne descend selon ce que vous avez perdu, et il n’existe aucune version d’elle qui dise que la semaine a été mauvaise. Aujourd’hui elle lit « ${etiqueta} ».`,

    entendi: 'J’ai compris',
  },
};
