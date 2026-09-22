/* ============================================================
   L'INSCRIPTION — dix-neuf questions, le plus grand écran de l'application · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/cadastro.ts. Deux qui commandent :

   LES QUESTIONS SE CONJUGUENT. Qui n'a pas encore commencé n'a rien au
   présent à répondre, donc médicament, forme, dose, fréquence et suivi
   viennent par paires — `Agora` et `Futuro`.

   CHAQUE SOUS-TITRE DIT POURQUOI ON DEMANDE, et celui de l'identité dit la
   VRAIE raison, pas la flatteuse : l'identité de genre n'entre dans aucun
   calcul ici. Promettre un bénéfice qui n'existe pas, c'est comme ça qu'on
   perd la confiance de qui s'est arrêté pour lire.

   ⚠️ ET AUCUNE PHRASE N'ACCORDE UN PARTICIPE AVEC QUI LA LIT. Voir le haut
   de etapa.ts : c'est le piège propre au français, et ce fichier est celui
   qui parle le plus directement à la personne.

   ⚠️ LE POINT MÉDIAN N'EST PAS LA SORTIE. « Quand êtes-vous né·e ? » et
   « Êtes-vous suivi·e ? » étaient écrits ici, et c'était abandonner la
   règle en croyant l'appliquer : le point médian contourne l'accord, il
   ne l'évite pas. Il est contesté, et surtout les lecteurs d'écran le
   prononcent mal — dans une application de santé, écarter quelqu'un de la
   lecture pour n'écarter personne du genre est un mauvais échange.

   La sortie est celle des autres fichiers : REFORMULER pour que l'accord
   n'ait pas lieu d'être. « Quelle est votre date de naissance ? » ne
   demande de genre à personne, et c'est en plus une meilleure question.
   ============================================================ */

export const cadastro = {
  aberturaTitulo: 'La compagnie sur votre chemin de ',
  aberturaTituloForte: 'transformation',
  aberturaTexto: 'Plus que suivre des résultats, c’est comprendre le chemin qui est derrière. Une expérience intelligente qui apprend avec vous et s’adapte à chaque étape.',
  comecar: 'Commencer',

  verPlanos: 'Voir les offres',

  titulos: {
    nome: 'Comment doit-on vous appeler ?',
    identidade: 'Comment vous identifiez-vous ?',
    nascimento: 'Quand êtes-vous né·e ?',
    tratamento: 'Avez-vous déjà commencé le traitement ?',
    inicio: 'Quand avez-vous commencé ?',
    medicamentoFuturo: 'Quel médicament pensez-vous utiliser ?',
    medicamentoAgora: 'Quel médicament utilisez-vous ?',
    formaFuturo: 'Comment allez-vous le prendre ?',
    formaAgora: 'Comment le prenez-vous ?',
    doseFuturo: 'Avec quelle dose pensez-vous commencer ?',
    doseAgora: 'Quelle est votre dose actuelle ?',
    frequenciaFuturo: 'À quelle fréquence allez-vous le prendre ?',
    frequenciaAgora: 'À quelle fréquence le prenez-vous ?',
    corpo: 'Quelles sont vos mesures actuelles ?',
    meta: 'Quel est votre objectif de poids ?',
    ritmo: 'Quel rythme voulez-vous suivre pour y arriver ?',
    motivacao: 'Qu’est-ce qui vous amène sur ce chemin ?',
    atividade: 'Quel est votre niveau d’activité physique ?',
    restricao: 'Avez-vous des restrictions alimentaires ?',
    saude: 'Connectez votre application de santé',
    acompanhamentoFuturo: 'Pensez-vous être suivi·e par un·e spécialiste ?',
    acompanhamentoAgora: 'Êtes-vous suivi·e par un·e spécialiste ?',
    consentimento: 'Informations importantes',
  },

  subs: {
    nome: 'Juste le prénom suffit, ou le surnom que vous aimez.',
    identidade: 'C’est pour vous parler comme il faut. Ce qui entre dans les calculs de santé, c’est votre corps, et ça vient dans les questions suivantes.',
    nascimento: 'Chaque étape de la vie a ses besoins — et l’âge entre dans les valeurs de référence de vos analyses.',
    tratamento: 'Juste pour savoir où vous en êtes.',
    inicio: 'À peu près suffit. C’est de là que sort votre semaine de traitement, et c’est ce poids qui devient le début de votre courbe.',
    medicamento: 'C’est de lui que viennent l’escalier des doses et l’intervalle entre les injections.',
    forma: 'Le préparé sort de la pharmacie sous les deux formes, et ce qui change, c’est ce que vous avez en main au moment de le prendre.',
    doseComEscada: (med: string) => `Dans l’ordre de titration de ${med}.`,
    doseSemEscada: 'Le préparé n’a pas d’escalier de notice — le chiffre est celui de votre ordonnance.',
    /* ⚠️ LE RÉCIPIENT ARRIVE DÉJÀ ACCORDÉ — « du flacon », « de la
       seringue ». Voir T.formas.doDa, dans textos/fr-FR/formas.ts. */
    frequencia: (doDaForma: string) => `C’est de là que viennent le comptage du cycle, les rappels et le stock ${doDaForma}.`,
    corpo: 'Avec la taille et le poids nous calculons votre IMC et construisons vos objectifs quotidiens de protéines et d’eau.',
    meta: 'C’est la référence que nous utilisons pour montrer le chemin parcouru. Vous pourrez la changer quand vous voulez.',
    ritmo: (aPercorrer: string) => `${aPercorrer} à parcourir.`,
    motivacao: 'Il n’y a pas de bonne réponse. Celle qui compte est celle dont vous vous souviendriez un jour difficile.',
    restricao: 'Les protéines sont l’axe de ce traitement, et elles viennent d’endroits différents selon ce que vous mangez. Vous pouvez en cocher plusieurs.',
    atividade: 'Ça entre dans votre objectif d’eau quotidien — qui bouge plus perd plus de liquide — et ça dit d’où vous partez.',
    saude: 'Vos données de santé aident à comprendre votre évolution — sans que vous ayez à tout noter.',
    /* ⚠️ CE TEXTE NE PEUT PAS SONNER COMME UNE OFFRE. Dans une question que
       personne ne vérifie, un menu d'avantages est une invitation à mentir
       pour débloquer la meilleure version — et qui ment là reçoit une
       application qui se met à lui parler de consultations qu'elle n'a
       pas. */
    acompanhamento: 'Cette réponse active des fonctions liées au suivi médical, comme les notes et la préparation des consultations.',
    consentimento: 'Deux choses avant de commencer : ce que nous faisons pour votre traitement, et ce qui arrive à ce que vous notez.',
  },

  seuNome: 'Votre prénom',

  /* ⚠️ « AUTRE » ET « JE PRÉFÈRE NE PAS LE DIRE » NE SONT PAS LA MÊME
     RÉPONSE : l'une dit qui la personne est, l'autre dit qu'elle ne veut
     pas le dire. Les réunir obligerait qui veut seulement de la
     discrétion à se déclarer. */
  feminino: 'Féminin',
  masculino: 'Masculin',
  outro: 'Autre',
  prefiroNaoInformar: 'Je préfère ne pas le dire',

  jaIniciei: 'J’ai déjà commencé le traitement',
  jaInicieiSub: 'J’ai déjà pris au moins une dose',
  vouComecar: 'Je commence bientôt',
  vouComecarSub: 'Je n’ai encore rien pris',

  /* ⚠️ « JE NE SAIS PAS ENCORE » APPARAÎT DEUX FOIS, avec des sous-titres
     différents — une au médicament et une à la dose. L'étiquette est la
     même parce que l'hésitation est la même ; ce qui change, c'est ce
     qu'on y répond. */
  aindaNaoSei: 'Je ne sais pas encore',
  aindaNaoSeiMedSub: 'Vous pourrez le définir plus tard dans votre profil',
  aindaNaoSeiDoseSub: 'Presque tout le monde commence par la plus basse',

  manipuladoSub: 'Préparé en pharmacie',
  formaSeringaSub: 'Vous prélevez la dose avec une seringue',
  formaCanetaSub: 'Arrive prérempli, prêt à injecter',

  doseDeInicio: 'Dose de départ',
  doseMaxima: 'Dose maximale',

  todosOsDias: 'Tous les jours',
  aCadaDias: (d: number) => `Tous les ${d} jours`,
  padrao: 'Standard',
  outroIntervaloTitulo: 'Autre intervalle',
  outroIntervalo: 'Vous dites tous les combien de jours',

  pesoDeHoje: 'POIDS AUJOURD’HUI',
  pesoDeQuandoComecou: 'POIDS AU DÉPART',
  querPerder: 'Vous voulez perdre',
  querGanhar: 'Vous voulez prendre',

  /* ⚠️ AUCUN RYTHME NE PROMET RIEN, et c'est pour ça que les noms sont des
     noms de RYTHME et pas de résultat. Ce que la littérature décrit comme
     une perte durable tourne autour de 0,5 à 1 kg par semaine ; au-dessus,
     le calcul appartient au corps et à la dose, pas à la volonté. */
  ritmoDevagar: 'Doucement mais sûrement',
  ritmoConstante: 'Rythme constant',
  ritmoAcelerado: 'Accéléré',
  ritmoMaisRapido: 'Le plus vite possible',
  ritmoPorSemana: (peso: string) => `${peso} par semaine`,
  ritmoAlcanca: (metaProsa: string, mes: string) => `Atteint ${metaProsa} en ${mes}`,

  semRestricao: 'Aucune',
  semRestricaoSub: 'Je mange de tout',

  /* ⚠️ LE PAS SANTÉ A SON PROPRE TITRE, et non la question sèche des
     autres : c'est le seul du formulaire qui demande une AUTORISATION au
     lieu d'une réponse, et ce qui décide quelqu'un à autoriser n'est pas
     de savoir ce que nous voulons — c'est de savoir ce qu'elle gagne. */
  saudeManchete: 'Tout ce que votre corps montre, <b>au même endroit</b>',
  saudeLembrarTitulo: 'Une chose de moins à retenir',
  saudeLembrarTexto: 'Poids, sommeil et séances entrent tout seuls.',
  saudeCurvaTitulo: 'Votre courbe, plus complète',
  saudeCurvaTexto: 'Ce que votre appareil mesure arrive ici.',
  saudeControleTitulo: 'Vous gardez la main',
  saudeControleTexto: 'Choisissez ce que vous partagez, et coupez quand vous voulez.',
  saudeConectar: 'Connecter mes données',
  /* ⚠️ « LE FAIRE PLUS TARD », et non « pas maintenant ». Le refus qui
     ferme la porte est plus facile à donner que celui qui reporte — et
     celui-ci reporte vraiment : l'écran d'Intégrations reste dans le
     profil. */
  saudeDepois: 'Le faire plus tard',

  sim: 'Oui',
  digiteONome: 'Saisissez le nom',
  nadaEnviado: 'Cela sert à nommer la ou le spécialiste au fil de votre parcours. Rien ne lui est envoyé.',
  vouMeTratar: 'Je vais être suivi·e par un médecin ou une clinique',
  meAcompanha: 'Un médecin ou une clinique suit mon traitement',
  porContaPropria: 'Non, par moi-même',
  porContaPropriaSub: 'Vous pourrez en ajouter un plus tard, quand vous voudrez',
  quemVaiAcompanhar: 'QUI VA SUIVRE VOTRE TRAITEMENT (FACULTATIF)',
  quemAcompanha: 'QUI SUIT VOTRE TRAITEMENT (FACULTATIF)',

  menosComumAqui: 'MOINS COURANT ICI',

  /* ⚠️ L'ÉTIQUETTE DIT CE QUE LE GESTE SIGNIFIE. « Continuer » serait la
     personne qui consent sans savoir qu'elle a consenti — et un
     consentement pour des données de santé doit être un acte clair, pas
     l'effet secondaire d'un écran qu'on fait avancer. */
  concordarEMontar: 'Accepter et construire mon plan',
  ficaRegistrado: 'Enregistré à la date d’aujourd’hui.',
  salvar: 'Enregistrer',
  continuar: 'Continuer',

  /* ⚠️ LES TROIS PHRASES DISENT CE QUI EST EN TRAIN DE SE FAIRE, dans
     l'ordre où ça se fait. La barre avance toute seule et ne feint pas un
     progrès réel : elle mesure le temps de l'attente, qui est le seul
     nombre honnête ici. */
  montandoTitulo: 'Construction de votre plan',
  faseLendo: 'Lecture de vos réponses',
  faseCalculando: 'Calcul de vos objectifs du jour',
  faseDesenhando: 'Dessin de votre parcours',

  telaPlano: {
    planoPronto: 'votre plan personnalisé est prêt !',
    manterOPeso: 'maintenir votre poids',
    objetivo: (perder: number, alvo: string, marca: string): [string, string, string] => [
      `Pour ${perder > 0.05 ? 'perdre ' : perder < -0.05 ? 'prendre ' : ''}`,
      alvo,
      `${marca}.`,
    ],
    marcaRegistrada: (medicamento: string) => ` avec ${medicamento}®`,
    marcaGenerica: (medicamento: string) => ` avec ${medicamento}`,
    elaboradoPensando: 'Votre plan a été construit à partir',
    nasSuasRespostas: 'De vos réponses',
    emEstudos: 'Des études sur les GLP-1',

    secaoMetas: 'VOS OBJECTIFS DU JOUR',
    secaoDose: 'VOTRE DOSE',
    secaoAteAMeta: 'JUSQU’À VOTRE OBJECTIF',
    secaoCorpo: 'VOTRE CORPS',
    secaoAjuda: 'COMMENT JE VOUS AIDE',
    secaoCiencia: 'LA SCIENCE DERRIÈRE VOTRE PLAN',

    proteinaPorDia: 'PROTÉINES PAR JOUR',
    proteinaTexto: 'C’est le premier objectif de la journée. Le médicament coupe la faim, et une partie du poids qui descend vient du muscle — les protéines sont ce qui retient la masse maigre pendant que la graisse s’en va.',
    calorias: 'Calories',
    agua: 'Eau',

    aindaADefinir: 'Encore à définir',
    aindaADefinirTexto: 'Quand vous saurez le médicament, je construis l’escalier des doses et le cycle.',
    cicloComeca: 'Le cycle commence à la première injection que vous notez.',
    cadenciaDiaria: 'tous les jours',
    cadenciaSemanal: 'une fois par semaine',
    cadenciaDias: (dias: number) => `tous les ${dias} jours`,

    pesoAPerder: 'Poids à perdre',
    pesoAGanhar: 'Poids à prendre',
    emSemanas: (semanas: number) => `en ${semanas} semaines`,
    ressalvaDaCurva: (ritmo: string) =>
      `La baisse n’est pas une droite : dans les études, les premières semaines rendent davantage et le rythme se relâche à mesure que le corps s’ajuste. Les ${ritmo} par semaine que vous avez choisis sont la moyenne du chemin, pas une prévision.`,

    imcDeHoje: 'IMC d’aujourd’hui',
    naSuaMeta: 'À votre objectif',

    ajudaDose: 'Chaque dose au bon endroit',
    ajudaDoseSub: 'la rotation des endroits et le cycle de la dose, sans que vous comptiez',
    ajudaEnjoo: 'La nausée en chiffres',
    ajudaEnjooSub: 'ce que vous ressentez devient un motif, et le motif part en consultation',
    ajudaPeso: 'Votre courbe de poids',
    ajudaPesoSub: 'chaque pesée entre dans la ligne, avec la lecture de ce qui a changé',
    ajudaResumo: 'Un résumé pour la consultation',
    ajudaResumoSub: 'doses, symptômes et poids rangés sur une seule page',

    feitoEmCimaDeEvidencia: 'Bâti sur des preuves',
    evidenciaTexto: 'Les objectifs, la courbe et les priorités de ce plan suivent des recommandations de santé publique et des essais cliniques relus par des pairs.',
    rodape: 'Nous suivons votre parcours tous les jours et rangeons ce que vous notez — mais celle qui conduit le traitement, c’est votre équipe de santé. Ces chiffres sont un point de départ pour cette conversation, pas une prescription.',

    voltar: 'Retour',
  },

  telaDados: {
    titulo: 'Vos informations',
    lead: 'Ce sont les réponses de votre inscription, et c’est d’elles que sortent votre IMC, vos objectifs du jour et la prévision du plan. Y toucher refait ces chiffres.',

    tratamento: 'Traitement',
    medicamento: 'Médicament',
    dose: 'Dose',
    doseSub: (valor: string, unidade: string) => `${valor} ${unidade}`,
    frequencia: 'Fréquence',

    corpoERitmo: 'Corps et rythme',
    altura: 'Taille',
    pesoInicial: 'Poids de départ',
    metaDePeso: 'Objectif de poids',
    ritmoEscolhido: 'Rythme choisi',
    porSemana: (peso: string) => `${peso} par semaine`,
    semPesoAPerder: 'Pas de poids à perdre',

    nome: 'Nom',
    sexo: 'Sexe',
    nascimento: 'Naissance',
    nascimentoSub: (data: string, idade: number) => `${data} · ${idade} ans`,
    atividadeFisica: 'Activité physique',
    restricoesAlimentares: 'Restrictions alimentaires',
    oQueTeTrouxe: 'Ce qui vous a fait venir',

    rodape: 'Pour noter une nouvelle pesée, utilisez le bouton de saisie.',
  },
};
