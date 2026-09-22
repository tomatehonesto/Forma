/* ============================================================
   LE TRAITEMENT — la dose, la cadence, les jalons et les règles · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/tratamento.ts. Celle qui vaut pour
   le fichier entier : AUCUN de ces mots ne met une note à la personne.
   Les étiquettes de rythme et de stock qualifient le NOMBRE, pas qui l'a
   produit.
   ============================================================ */

export const tratamento = {
  /* ⚠️ LA CLÉ EST LE NOM PORTUGAIS et ne se traduit pas. Voir
     ../pt-BR/tratamento.

     ⚠️ ET LE FRANÇAIS ACCENTUE LÀ OÙ LES AUTRES N'ACCENTUENT PAS :
     « tirzépatide », « sémaglutide ». La dénomination commune
     internationale suit l'orthographe de chaque langue, et le français
     met l'accent que le portugais n'a pas. */
  molecula: {
    'Tirzepatida': 'Tirzépatide',
    'Semaglutida': 'Sémaglutide',
    'Dulaglutida': 'Dulaglutide',
    'Liraglutida': 'Liraglutide',
    '—': '—',
  } as Record<string, string>,

  /* ⚠️ L'ABSENCE A SA PROPRE PHRASE, et elle est courte à dessein : elle
     entre au milieu d'autres, comme « Mounjaro pas encore définie ». */
  doseIndefinida: 'pas encore définie',

  /* ⚠️ DEUX LONGUEURS, ET C'EST VOULU. La ligne qui ouvre un écran parle
     en toutes lettres ; la cellule d'un tableau de résumé médical n'a pas
     cette largeur. Les deux doivent rester courtes pour leur place. */
  cadenciaSemanal: 'une fois par semaine',
  cadenciaDiaria: 'usage quotidien',
  cadenciaOutra: (dias: number) => `tous les ${dias} jours`,
  cadenciaSemanalCurta: '1× par semaine',
  cadenciaDiariaCurta: 'quotidienne',
  cadenciaOutraCurta: (dias: number) => `tous les ${dias} j`,

  antesDaPrimeiraDose: 'Avant la première dose',
  comecaAmanha: 'Commence demain',
  comecaEm: (dias: number) => `Commence dans ${dias} jours`,
  /* ⚠️ « JOUR 71 », ET NON « JOUR 71 DU TRAITEMENT ». La ligne où ça
     apparaît finit déjà par « Semaine 10 », et les deux ensemble ne
     peuvent compter que la même chose. */
  diaDoTratamento: (dia: number) => `Jour ${dia}`,

  /* ⚠️ UN RYTHME NÉGATIF N'EST PAS « UN RYTHME PLUS LENT ». Qui avait
     repris du poids tombait sur la dernière étiquette, et la carte disait
     « Rythme plus lent » en vert à côté d'un nombre qui montait. Lent et à
     l'envers sont deux choses différentes, et une seule des deux est un
     rythme.

     ⚠️ ET ACCÉLÉRÉ N'EST PAS MAUVAIS. Perdre plus de 1,5 kg par semaine est
     une raison d'en parler à son équipe — masse maigre, hydratation —, pas
     une faute commise. Le mot ne peut pas sonner comme un reproche. */
  ritmoAcimaDoInicio: 'Au-dessus du départ',
  ritmoSaudavel: 'Rythme sain',
  ritmoAcelerado: 'Rythme accéléré',
  ritmoLento: 'Rythme plus lent',

  /* Trois degrés, et celui du milieu est le plus fréquent : « vaut le coup
     de renouveler » est un avis des semaines à l'avance, pas une alarme. */
  estoqueUrgente: 'Renouvelez maintenant',
  estoqueRenovar: 'Vaut le coup de renouveler l’ordonnance',
  estoqueEmDia: 'Stock à jour',

  /* ⚠️ LE CÔTÉ EST ABRÉGÉ ET ENTRE PARENTHÈSES parce que ces étiquettes
     apparaissent dans des lignes courtes — historique, suggestion du jour,
     résumé de la semaine. « Abdomen côté gauche » ne tient dans aucune. */
  locais: {
    'abd-e': 'Abdomen (g.)',
    'abd-d': 'Abdomen (d.)',
    'coxa-e': 'Cuisse (g.)',
    'coxa-d': 'Cuisse (d.)',
    'braco-e': 'Bras (g.)',
    'braco-d': 'Bras (d.)',
  },

  marcos: {
    inicio: 'Début du traitement',
    doseAjustada: (dose: string) => `Dose ajustée à ${dose} mg`,
    /* ⚠️ « SELON L'AVIS MÉDICAL » est ce qui empêche la ligne de laisser
       croire que l'application a ajusté quoi que ce soit. Elle note ; qui
       ajuste, c'est qui prescrit. */
    titulacao: 'Titration selon l’avis médical',
    cincoPorCento: '5% du poids de départ',
    /* ⚠️ « AU-DELÀ DE LA BALANCE » est le cœur : les 5% sont le repère à
       partir duquel la littérature montre un gain sur la tension, la
       glycémie et les triglycérides. Sans cette moitié, la ligne n'est
       qu'un chiffre de poids de plus. */
    cincoPorCentoSub: 'Repère clinique, avec des bénéfices au-delà de la balance',
    consulta: (tipo: string) => `Consultation ${tipo}`,
    marcadoresImportados: (quantos: number) => `${quantos} marqueurs importés`,
  },

  /* ⚠️ CE SONT LES NOMS DE LA CLASSIFICATION, et non des adjectifs choisis
     par nous. « Obésité de classe I » est le terme du compte rendu ; le
     remplacer par quelque chose de plus doux désalignerait l'application
     de ce que la personne lit sur son analyse et en consultation. Là où le
     soin intervient, c'est dans le TON de la couleur, qui est une décision
     d'écran. */
  imc: {
    abaixo: 'Insuffisance pondérale',
    normal: 'Poids normal',
    sobrepeso: 'Surpoids',
    grau1: 'Obésité de classe I',
    grau2: 'Obésité de classe II',
    grau3: 'Obésité de classe III',
  },

  /* ⚠️ AUCUN DES CINQ NE PORTE SUR L'APPARENCE SEULE, et « Comment je me
     vois » est le plus proche de ça à dessein : la phrase est de la
     personne sur elle-même, pas de l'application sur son corps. « Maigrir
     pour être belle » serait un autre produit. */
  motivos: {
    saude: 'Santé',
    saudeSub: 'Analyses, tension, glycémie',
    energia: 'Énergie',
    energiaSub: 'De l’allant dans la journée',
    espelho: 'Comment je me vois',
    espelhoSub: 'Dans le miroir et sur les photos',
    confianca: 'Confiance',
    confiancaSub: 'Me sentir bien avec moi',
    medico: 'Avis médical',
    medicoSub: 'C’est qui me suit qui me l’a conseillé',
  },

  /* ⚠️ LE SOUS-TITRE EST CE QUI DONNE UN SENS À L'ÉCHELON. Sans « 1 à 3
     jours par semaine », « légèrement actif » est une auto-évaluation, et
     chacun se place à un échelon différent — sur un nombre qui va devenir
     son objectif de protéines. */
  atividades: {
    sedentario: 'Sédentaire',
    sedentarioSub: 'Peu ou pas d’exercice',
    leve: 'Légèrement actif',
    leveSub: '1 à 3 jours par semaine',
    moderado: 'Modérément actif',
    moderadoSub: '3 à 5 jours par semaine',
    muito: 'Très actif',
    muitoSub: '6 à 7 jours par semaine',
  },

  /* ⚠️⚠️ LA DURÉE EST UNE RÈGLE DE LANGUE, et elle était écrite en dur
     dans le fichier de l'écran. « 6 h 20 » au lieu de « 380 min » : au-
     dessus d'une heure, la minute pure oblige à diviser de tête pour
     savoir si c'est beaucoup. Voir ../pt-BR/tratamento. */
  telaExercicio: {
    titulo: 'Exercice',
    unidadeMin: 'min',
    duracao: (min: number) => {
      if (min < 60) return `${min} min`;
      const h = Math.floor(min / 60);
      const m = min % 60;
      return m ? `${h} h ${m}` : `${h} h`;
    },

    hojeSemTreino: (daSemana: number) => `Aujourd’hui : pas encore de séance · ${daSemana} min cette semaine`,
    hojeComTreino: (hoje: number, alvo: number, resto: string) => `Aujourd’hui : ${hoje} sur ${alvo} min · ${resto}`,
    metaAlcancada: 'objectif atteint',
    faltamMin: (falta: number) => `encore ${falta} min`,
    registrarTreino: 'Noter une séance',

    movimentoTitulo: 'Votre mouvement',
    estaSemana: 'Cette semaine',
    nenhumDiaComMovimento: 'Aucun jour avec du mouvement',
    emDiasDosSete: (dias: number) => `Sur ${dias} ${dias === 1 ? 'jour' : 'jours'} des sept`,
    metaMin: (alvo: number) => `Objectif : ${alvo} min`,

    semForca: 'Aucune séance de renforcement cette semaine. Musculation, pilates et functional sont ce qui tient le muscle.',
    comForca: (dias: number) => `${dias} ${dias === 1 ? 'jour' : 'jours'} avec du renforcement — c’est ce qui tient le muscle pendant que le poids descend.`,

    minutosPorSemana: 'Minutes par semaine',
    mediaOitoSemanas: 'Moyenne des 8 dernières semaines',
    semanaDe: (data: string) => `semaine du ${data}`,

    periodo7: '7 jours',
    periodo30: '30 jours',
    periodo90: '3 mois',
    noPeriodo: 'Sur la période',
    noPeriodoNota: 'Seulement ce qui a été noté ici — ce qui vient de la montre n’a pas de discipline.',
    treinos: 'Séances',
    tempo: 'Temps',
    maisLongo: 'La plus longue',
    deForca: 'Renforcement',

    diarioTitulo: 'Journal des séances',
    diarioNota: 'Touchez une séance pour la voir, la corriger ou la supprimer.',
    diaVazioTitulo: 'Aucune séance ce jour-là',
    diaVazioTexto: 'Le repos en fait partie aussi.',

    integracoes: 'Connexions',
    conectar: 'Connecter une montre ou une application',
    lancamSozinhos: 'Elles entrent les minutes toutes seules',
    conectarSub: 'Apple Santé, Health Connect, Garmin et d’autres',
  },

  telaAplicacoes: {
    aplicada: 'faite',
    semCulpa: 'Pas de culpabilité pour un jour passé — ce qui compte, c’est de reprendre. Vous pouvez noter une piqûre plus ancienne à tout moment, avec le bouton en bas.',
    titulo: 'Piqûres',
    registrar: 'Noter une piqûre',
    lead: (med: string, molecula: string, cadencia: string) => `${med} · ${molecula} · ${cadencia}`,

    proximaAplicacao: 'PROCHAINE PIQÛRE',

    cicloDaDose: 'Cycle de la dose',
    cicloSub: (dia: number, total: number, fase: string) => `Jour ${dia} sur ${total} · ${fase.toLowerCase()}`,
    emCurso: 'en cours',

    eReceita: (recipiente: string) => `${recipiente} et ordonnance`,
    dosesUsadas: (usadas: number, total: number, onde: string) => `${usadas} doses sur ${total} utilisées ${onde}`,
    cobreSemanas: (veredito: string, semanas: number) =>
      `${veredito} — couvre environ ${semanas} ${semanas === 1 ? 'semaine' : 'semaines'}`,

    alertasDeDose: (quantos: number) => `${quantos} ${quantos === 1 ? 'rappel' : 'rappels'} de piqûre`,
    nenhumAlerta: 'Aucun rappel de piqûre',
    tocaEm: (quando: string) => `Sonne ${quando}`,
    avisoAntes: 'Un signal avant la dose, à l’heure que vous choisissez',

    rodizioTitulo: 'Rotation des endroits',
    naoUsado: 'Pas encore utilisé — c’est son tour.',
    proximoDaRotacao: 'C’est le suivant dans la rotation, même s’il a servi cette semaine.',
    descansandoHa: (semanas: number) =>
      `Au repos depuis ${semanas} ${semanas === 1 ? 'semaine' : 'semaines'} — c’est son tour.`,
    usadoHaPouco: 'utilisé récemment',
    oProximo: 'le suivant',
    proxima: 'prochaine',

    constancia: 'Régularité',
    constanciaNota: (feitas: number, previstas: number) =>
      `${feitas} doses sur ${previstas} prévues depuis le début du traitement.`,

    nivelNoCorpo: 'Niveau dans le corps',
    nivelTexto: (molecula: string, meiaVida: string) =>
      `Estimation de ${molecula} dans le corps, avec une demi-vie de ${meiaVida}. Le point le plus bas, juste avant la prochaine dose, est en général le moment où la faim monte.`,
    meiaVidaDias: (dias: number) => `${dias} jours`,
    meiaVidaHoras: 'environ 13 heures',

    historico: 'Historique',
    proximaEmLocal: (local: string) => `Prochaine · ${local}`,
  },

  telaCaneta: {
    abertoM: 'ouvert',
    abertoF: 'ouverte',
    nenhumM: 'Aucun',
    nenhumF: 'Aucune',
    desteM: 'de ce',
    desteF: 'de cette',
    novoM: 'Nouveau',
    novoF: 'Nouvelle',
    encerradoM: 'terminé',
    encerradoF: 'terminée',

    nova: 'Nouveau',
    lembrarRenovar: 'Me rappeler de renouveler',
    tituloDose: (medicamento: string, dose: string, unidade: string) =>
      `${medicamento} ${dose} ${unidade}`,

    leadAberto: (Recipiente: string, aberto: string, data: string, total: number, recipiente: string) =>
      `${Recipiente} ${aberto} le ${data} · ${total} doses par ${recipiente}`,
    leadSemAberto: (nenhum: string, recipiente: string, aberto: string, total: number) =>
      `${nenhum} ${recipiente} ${aberto} · ${total} doses par ${recipiente}`,

    dosesUsadas: 'Doses utilisées',
    usadasDe: (usadas: number, total: number) => `${usadas} sur ${total}`,
    ultimaDose: (deste: string, recipiente: string, data: string) =>
      `Dernière dose ${deste} ${recipiente} : ${data}`,

    validadeApos: (aberto: string) => `Validité une fois ${aberto}`,
    validadeDias: (dias: number) => `${dias} jours`,
    validadeNaoInformada: 'non renseignée',
    venceEm: (data: string) => `expire ${data}`,
    quemPreparaDefine: 'la personne qui le prépare fixe le délai',

    receitaAtual: 'Ordonnance en cours',
    receitaSemanas: (semanas: number) => `${semanas} ${semanas === 1 ? 'semaine' : 'semaines'}`,
    receitaCobreAte: (data: string) => `couvre jusqu’au ${data}`,

    /* ⚠️ « avant d’être fini » s’accorde, et le conteneur peut être
       féminin : « la plaquette … fini » était faux. La phrase a été
       tournée pour ne pas avoir de participe à accorder. */
    venceAntes: (oRecipiente: string) => `${oRecipiente} expire avant la dernière dose`,
    venceAntesTexto: (medicamento: string, dias: number, total: number, aberto: string) =>
      `${medicamento} se garde ${dias} jours une fois ${aberto}, et les ${total} doses n’entrent pas dans ce délai. Il vaut mieux demander à la personne qui vous suit quoi faire de ce qui reste.`,

    momentoDeRenovar: 'Le moment de demander le renouvellement',
    renovarTexto: (semanas: number, oRecipiente: string, _recipiente: string) =>
      `Votre ordonnance couvre environ ${semanas} ${semanas === 1 ? 'semaine' : 'semaines'}. La demander maintenant évite de vous retrouver sans ${oRecipiente} entre deux consultations.`,

    historico: (plural: string) => `Historique des ${plural}`,
    emUso: 'en cours',
    itemEmUso: (Aberto: string, data: string, usadas: number, total: number) =>
      `${Aberto} le ${data} · ${usadas} sur ${total} doses`,
    itemEncerrado: (periodo: string, usadas: number, total: number) =>
      `${periodo} · ${usadas} sur ${total} doses`,
  },

  telaRegistrarAplicacao: {
    registrar: (acao: string) => `Noter ${acao}`,
    salvar: (acao: string) => `Enregistrer ${acao}`,

    quando: 'Quand',
    ficaRegistradaAgora: (hora: string) => `Notée maintenant, ${hora}.`,
    registrarDepois: 'La noter plus tard ne change rien d’autre que la date — le compte de la prochaine dose part d’ici.',

    medicamentoEDose: 'Médicament et dose',
    medicamentoEDoseDaReceita: 'Médicament et dose de l’ordonnance',
    manipuladoSemEscada: 'Une préparation magistrale n’a pas de palier de notice — le chiffre est celui de votre ordonnance.',
    medComDose: (medicamento: string, dose: string, unidade: string) =>
      `${medicamento} · ${dose} ${unidade}`,
    mudeiADose: 'Ma dose a changé',
    semFaixa: 'Nous n’avons pas de plage de référence pour ce médicament. La dose reste celle de votre dernier relevé.',

    localDaAplicacao: 'Point d’injection',
    localAjuda: 'Changer d’endroit chaque semaine aide à éviter les irritations et les nodules sous la peau.',
    regioes: {
      braco: 'Bras',
      abd: 'Abdomen',
      coxa: 'Cuisse',
    },
    sugerido: (nome: string) => `${nome} · suggéré`,
    lado: 'Côté',
    lados: {
      e: 'Gauche',
      d: 'Droit',
    },
    localComDescanso: (local: string, descanso: string) => `${local} · ${descanso}`,
    naoUsado: 'Pas encore utilisé dans ce traitement.',
    usadoEstaSemana: 'Utilisé cette semaine.',
    descansandoHa: (semanas: number) =>
      `Au repos depuis ${semanas} ${semanas === 1 ? 'semaine' : 'semaines'}.`,
    eOProximo: 'C’est le suivant dans la rotation.',
    foraDaRotacao: 'Hors de la rotation suggérée — pas de souci, ce n’est qu’un rappel.',

    ultimaDose: (deste: string, recipiente: string) =>
      `C’est la dernière dose ${deste} ${recipiente}.`,
    restamDoses: (quantas: number) => `Il reste ${quantas} doses.`,
    enesimaDose: (numero: number) => `${numero}e dose`,
  },
  telaTreino: {
    titulo: 'Séance',
    naoEncontrei: 'Je n’ai pas trouvé ce relevé',
    apagadoEmOutraTela: 'Il a peut-être été effacé sur un autre écran.',

    semanaDoTratamento: (n: number) => `Semaine ${n} du traitement`,

    origem: 'Origine',
    origemVoce: 'Vous — noté sur cet écran',
    origemIntegracao: (fonte: string) => `${fonte} — arrivé par l’intégration`,

    contaComoForca: 'Compte comme renforcement',
    forcaSim: 'Oui — ça travaille le muscle',
    forcaNao: (modalidades: string) => `Non — ce sont ${modalidades} qui comptent`,
    selo: 'Renforcement',

    corrigir: 'Corriger',
    apagar: 'Effacer',
    apagarTira: (min: number, unidade: string) =>
      `Effacer retire ${min === 1 ? 'la' : 'les'} ${min} ${unidade} du total de ce jour-là.`,
  },
  telaMedirExercicio: {
    titulo: 'Comment avez-vous bougé ?',
    tituloCorrigir: 'Corriger la séance',
    subCorrigir: 'Ce qui n’allait pas dans le relevé',
    subHoje: (hoje: number, alvo: number, unidade: string, fonte: string | null, uma: boolean) =>
      `${hoje} sur ${alvo} ${unidade} aujourd’hui${fonte ? ` · déjà avec ${fonte}` : ''}`,

    botaoSemNome: 'Dites ce que vous avez fait',
    botaoSalvarCorrecao: 'Enregistrer la correction',
    botaoRegistrar: (min: number, unidade: string, modalidade: string) =>
      `Noter ${min} ${unidade} de ${modalidade}`,

    somaAoQueContou: (uma: boolean) =>
      `Ce que vous notez ici s’ajoute à ce ${uma ? 'qu’il a déjà compté' : 'qu’ils ont déjà compté'}.`,

    oQueVoceFez: 'CE QUE VOUS AVEZ FAIT',
    qualPlaceholder: 'Laquelle ? Ex. : volley, escalade, jiu-jitsu',

    porQuantoTempo: 'PENDANT COMBIEN DE TEMPS',
    duracao: 'Durée',

    apagarTreino: 'Effacer cette séance',
  },
};
