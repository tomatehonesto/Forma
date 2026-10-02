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
  ritmoAcelerado: 'Rythme accéléré',
  ritmoNoPlano: 'À votre rythme',
  ritmoMaisDevagar: 'Plus lent que prévu',
  ritmoMaisRapido: 'Plus rapide que prévu',
  ritmoPorSemana: (peso: string) => `${peso} par semaine`,

  /* Trois degrés, et celui du milieu est le plus fréquent : « pensez à
     renouveler » est un avis des semaines à l'avance, pas une alarme.

     ⚠️ C'ÉTAIT « VAUT LE COUP DE RENOUVELER » — le « vale renovar »
     portugais, calqué, et sans le « ça » qui rend l'expression française.
     Même corrigé, « ça vaut le coup » est familier pour un titre de carte
     qui vouvoie. */
  estoqueUrgente: 'Renouvelez maintenant',
  estoqueRenovar: 'Pensez à renouveler l’ordonnance',
  estoqueEmDia: 'Stock à jour',
  registreORecipiente: (oRecipiente: string) =>
    `Enregistrez ${oRecipiente} et nous compterons les doses restantes.`,
  localNaoInformado: 'Site non renseigné',

  /* ⚠️ La dose du jour, pour la dose quotidienne seulement (01/10/2026,
     partie B1) — voir ../pt-BR/tratamento.ts. Le bouton est la seule
     phrase à la première personne, et il suit la forme. Jamais « en
     attente » : ce que nous savons, c’est que rien n’a été noté. */
  doseDeHoje: {
    titulo: 'Dose du jour',
    chapeu: 'DOSE DU JOUR',
    registrarHoje: (injetavel: boolean): string => (injetavel ? 'Je l’ai injectée' : 'Je l’ai prise'),
    feitaAs: (hora: string) => `Notée à ${hora}`,
    aindaNaoRegistrada: 'Pas encore notée',
    pastilhaFeita: (hora: string) => `Dose du jour notée à ${hora}`,
    pastilhaAindaNao: 'Dose du jour pas encore notée',
    mudar: 'Modifier',
    outraHoje: (hora: string) => `Vous avez déjà noté une dose aujourd’hui, à ${hora}. En noter une autre ?`,
    outraSim: 'En noter une autre',
    cancelar: 'Annuler',
  },

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

    semForca: 'Aucune séance de renforcement cette semaine. Musculation, pilates et entraînement fonctionnel sont ce qui tient le muscle.',
    comForca: (dias: number) => `${dias} ${dias === 1 ? 'jour' : 'jours'} avec du renforcement — c’est ce qui tient le muscle pendant que le poids descend.`,

    minutosPorSemana: 'Minutes par semaine',
    mediaOitoSemanas: 'Moyenne des 8 dernières semaines',
    semanaDe: (data: string) => `semaine du ${data}`,

    periodo7: '7 jours',
    periodo30: '30 jours',
    periodo90: '3 mois',
    noPeriodo: 'Sur la période',
    noPeriodoNota: 'Seulement ce qui a été noté ici — ce qui vient de la montre n’indique pas la discipline.',
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
    aplicada: 'notée',
    semCulpa: 'Pas de culpabilité pour un jour manqué — ce qui compte, c’est de reprendre. Vous pouvez noter une dose plus ancienne à tout moment, avec le bouton en bas.',
    /* plusieurs jours d’un coup, dose quotidienne seulement (voir ../pt-BR) */
    marcarDias: 'Vous avez oublié de noter un jour ? Touchez les jours vides pour noter ces doses en une fois.',
    registrarDias: (n: number) => (n === 1 ? 'Noter la dose de 1 jour' : `Noter les doses de ${n} jours`),
    marcarDiasNota: (injetavel: boolean) =>
      `Chaque jour est noté avec la dose que vous preniez ce jour-là${injetavel ? ', sans le site' : ''}.`,
    desmarcar: 'Désélectionner',
    titulo: 'Doses',
    registrar: 'Noter une dose',
    lead: (med: string, molecula: string, cadencia: string) => `${med} · ${molecula} · ${cadencia}`,

    proximaAplicacao: 'PROCHAINE DOSE',

    cicloDaDose: 'Cycle de la dose',
    cicloSub: (dia: number, total: number, fase: string) => `Jour ${dia} sur ${total} · ${fase.toLowerCase()}`,
    primeiraDose: 'PREMIÈRE DOSE',
    aindaNaoRegistrada: 'Pas encore enregistrée',
    cicloSemDose: 'Commence à la première dose enregistrée',
    emCurso: 'en cours',

    medicamento: 'Médicament',
    dosesRestantesNo: (restam: number, onde: string) =>
      `${restam === 1 ? 'Il reste 1 dose' : `Il reste ${restam} doses`} ${onde}`,
    cobreSemanas: (veredito: string, semanas: number) =>
      `${veredito} — de quoi tenir environ ${semanas} ${semanas === 1 ? 'semaine' : 'semaines'}`,

    alertasDeDose: (quantos: number) => `${quantos} ${quantos === 1 ? 'rappel' : 'rappels'} de dose`,
    nenhumAlerta: 'Aucun rappel de dose',
    tocaEm: (quando: string) => `Sonne ${quando}`,
    avisoAntes: 'Un signal avant la dose, à l’heure que vous choisissez',

    proxima: 'prochaine',

    constancia: 'Régularité',
    constanciaNota: (feitas: number, previstas: number, semanas: number) =>
      `${feitas} ${feitas > 1 ? 'doses' : 'dose'} sur ${previstas} ${previstas > 1 ? 'prévues' : 'prévue'} ces ${semanas} dernières semaines.`,

    nivelNoCorpo: 'Niveau dans le corps',
    nivelTexto: (molecula: string, meiaVida: string) =>
      `Estimation du taux de ${molecula} dans le corps, avec une demi-vie de ${meiaVida}. Le point le plus bas, juste avant la prochaine dose, est en général le moment où la faim monte.`,
    /* dose quotidienne : pas de point bas à attendre (voir ../pt-BR) */
    nivelTextoDiario: (molecula: string, meiaVida: string) =>
      `Estimation du taux de ${molecula} dans le corps, avec une demi-vie de ${meiaVida}. Avec une dose par jour, il reste à un niveau semblable d’un jour à l’autre.`,
    meiaVidaDias: (dias: number) => `${dias} jours`,
    meiaVidaHoras: 'environ 13 heures',

    historico: 'Historique',
    proximaEmLocal: (local: string) => `Prochaine · ${local}`,
    proximaSemLocal: 'Prochaine dose',
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
    registradoM: 'enregistré',
    registradoF: 'enregistrée',

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
    venceEm: 'Expire le',
    quemPreparaDefine: 'la personne qui le prépare fixe le délai',

    receitaAte: 'Ordonnance jusqu’au',
    receitaSemanas: (semanas: number) => `${semanas} ${semanas === 1 ? 'semaine' : 'semaines'}`,

    /* ⚠️ « avant d’être fini » s’accorde, et le conteneur peut être
       féminin : « la plaquette … fini » était faux. La phrase a été
       tournée pour ne pas avoir de participe à accorder. */
    venceAntes: (oRecipiente: string) => `${oRecipiente} expire avant la dernière dose`,
    venceAntesTexto: (medicamento: string, dias: number, total: number, aberto: string) =>
      `${medicamento} se garde ${dias} jours une fois ${aberto}, et les ${total} doses n’entrent pas dans ce délai. Il vaut mieux demander à la personne qui vous suit quoi faire de ce qui reste.`,

    momentoDeRenovar: 'C’est le moment de demander le renouvellement',
    renovarTexto: (semanas: number) =>
      `Votre ordonnance couvre environ ${semanas} ${semanas === 1 ? 'semaine' : 'semaines'}. La demander maintenant évite de vous retrouver sans médicament entre deux consultations.`,

    historico: (plural: string) => `Historique des ${plural}`,
    emUso: 'en cours',
    itemEmUso: (Aberto: string, data: string, usadas: number, total: number) =>
      `${Aberto} le ${data} · ${usadas} ${usadas < 2 ? 'dose' : 'doses'} sur ${total}`,
    itemEncerrado: (periodo: string, usadas: number, total: number) =>
      `${periodo} · ${usadas} ${usadas < 2 ? 'dose' : 'doses'} sur ${total}`,
  },

  telaAplicacaoOk: {
    registrada: (Acao: string) => `${Acao} enregistrée`,
    proximaDose: 'Prochaine dose',
    hoje: 'aujourd’hui',
    emDias: (dias: number) => `${dias} ${dias === 1 ? 'jour' : 'jours'}`,
    restamDoses: (restam: number) => (restam === 1 ? 'Il reste 1 dose' : `Il reste ${restam} doses`),
    acabou: (outroRecipiente: string) => `Terminé — il vaut mieux ouvrir ${outroRecipiente}`,
    seloFim: 'fini',
    registrarOutro: (outroRecipiente: string) => `Enregistrer ${outroRecipiente}`,
    voltarParaJornada: (aba: string) => `Retour au ${aba}`,
  },

  telaRecipienteNovo: {
    novoM: 'Nouveau',
    novoF: 'Nouvelle',
    novoMinM: 'nouveau',
    novoMinF: 'nouvelle',
    zeraContagem: 'Remet le compte de doses à zéro.',
    outro: 'Autre',
    concentracaoEDoses: 'Concentration et doses',
    ajudaDoses: (quantas: number, recipiente: string) => `${quantas} doses par ${recipiente}`,
    ajudaValidade: (dias: number, aberto: string) => ` · se garde ${dias} jours une fois ${aberto}`,
    validadeRotulo: (aberto: string) => `Conservation une fois ${aberto}`,
    validadeAjuda: 'C’est la personne qui le prépare qui fixe ce délai, et il figure en général sur l’étiquette. Sans lui, nous ne parlons pas de péremption — mieux vaut se taire que deviner une date.',
    naoSei: 'Je ne sais pas',
    estaNoRotulo: 'C’est sur l’étiquette',
    dias: 'jours',
    registrar: (novoRecipiente: string) => `Enregistrer le ${novoRecipiente}`,
  },

  telaRegistrarAplicacao: {
    registrar: (acao: string) => `Noter une ${acao}`,
    salvar: (acao: string) => `Enregistrer la ${acao}`,

    quando: 'Quand',
    ficaRegistradaAgora: (hora: string) => `Notée maintenant, ${hora}.`,
    registrarDepois: 'La noter plus tard ne change rien d’autre que la date — le compte de la prochaine dose part d’ici.',

    medicamentoEDose: 'Médicament et dose',
    medicamentoEDoseDaReceita: 'Médicament et dose de l’ordonnance',
    manipuladoSemEscada: 'Une préparation magistrale n’a pas d’escalier de doses standard — le chiffre est celui de votre ordonnance.',
    medComDose: (medicamento: string, dose: string, unidade: string) =>
      `${medicamento} · ${dose} ${unidade}`,
    mudeiADose: 'Ma dose a changé',
    semFaixa: 'Nous n’avons pas de plage de référence pour ce médicament. La dose reste celle de votre dernier relevé.',

    localDaAplicacao: 'Site d’injection',
    localAjuda: 'Changer de site à chaque dose aide à éviter les irritations et les nodules sous la peau.',
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

    escolherMedicamento: 'Choisir le médicament',
    semMedicamentoAjuda: 'Une dose s’enregistre avec son médicament. Ce que vous choisissez reste dans votre traitement.',
    doseDaReceita: 'La dose de votre ordonnance. Elle reste dans votre traitement, et les prochaines la reprennent.',
    jaEmUso: 'Déjà en cours',
    quantasJaSairam: (deste: string, recipiente: string) =>
      `Combien de doses aviez-vous déjà utilisées ${deste} ${recipiente} ?`,
    doses: (n: number) => (n === 1 ? '1 dose' : `${n} doses`),
    registraJunto: (oRecipiente: string, total: number, recipiente: string) =>
      `Nous enregistrons ${oRecipiente} avec cette dose (${total} doses par ${recipiente}), puis nous comptons celles qui restent.`,

    /* Une deuxième dose le même jour demande confirmation (dose
       quotidienne, partie B1). L’heure n’apparaît que pour aujourd’hui :
       un jour passé est noté à midi. */
    jaHaNoDia: (hora: string | null) =>
      (hora ? `Une dose est déjà notée aujourd’hui, à ${hora}.` : 'Une dose est déjà notée ce jour-là.'),
    duplaTexto: 'Si c’était bien une autre dose, notez-la : elle entre dans l’historique comme la deuxième du jour. Sinon, il suffit de changer de jour.',
    registrarMaisUma: 'Noter une autre dose',
    trocarODia: 'Changer de jour',
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
  telaNotas: {
    sugestoes: (): string[] => ['Ajustement de dose', 'Examen à refaire', 'Symptôme à surveiller', 'Question pour la prochaine fois'],
    oQueLembrar: 'Que voulez-vous retenir ?',
    com: (nome: string) => `avec ${nome}`,
    anotacaoPlaceholder: 'Ce qui a été conseillé, ce qui a changé, ce que vous voulez demander ensuite…',
    jaAnotado: 'DÉJÀ NOTÉ',
    guardarAnotacao: 'Enregistrer la note',
    notaTitulo: 'Note pour la consultation',
    guardadaAte: (ate: string | null) => (ate ? `Conservée jusqu’à la consultation du ${ate}.` : 'Conservée jusqu’à votre prochaine consultation.'),
    soEntraNoRelatorio: 'Elle n’entre dans le rapport que si vous cochez les notes à l’export.',
    notaPlaceholder: 'De quoi voulez-vous penser à parler ?',
    guardarNota: 'Enregistrer la note',
    voltarParaPauta: 'Remettre à l’ordre du jour',
    jaConversei: 'Déjà abordé',
    apagar: 'Supprimer',
    listaTitulo: 'Notes pour la consultation',
    novaNota: 'Nouvelle note',
    notas: 'Notes',
    listaLead: (ate: string | null) => `${ate ? `Conservées jusqu’à la consultation du ${ate}.` : 'Conservées jusqu’à votre prochaine consultation.'} Cochez celles déjà abordées.`,
    aConversar: 'À aborder',
    jaConversadas: 'Déjà abordées',
    nadaNaPauta: 'Rien à l’ordre du jour pour l’instant',
    nenhumaConversada: 'Aucune abordée pour l’instant',
    suasNotasEstao: (n: number): string => `${n === 1 ? 'Votre note est' : 'Vos notes sont'} dans « À aborder ».`,
    entramNoRelatorio: 'Les notes entrent dans le rapport',
    entramTexto: 'Quand vous exportez l’historique, vous choisissez si les notes suivent.',
  },
};
