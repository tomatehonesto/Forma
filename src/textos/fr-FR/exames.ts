/* ============================================================
   LA LECTURE DES ANALYSES — le résumé du bilan et la lecture d'un marqueur · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/exames.ts. Les trois qui commandent :

   RIEN ICI NE DONNE D'AVIS, TOUT ICI COMPTE. Combien sont sortis de la
   référence, de combien la valeur a bougé, dans quel sens. C'est de
   l'arithmétique dite en phrase — et c'est voulu : la version précédente
   était un paragraphe écrit à la main avec les chiffres d'UNE personne, et
   affirmait « vos marqueurs se sont améliorés » à qui avait empiré.

   LE SENS N'APPARAÎT QUE SI LE MARQUEUR DÉCLARE QUEL CÔTÉ EST LE BON. Une
   créatinine ou une TSH qui monte n'est en soi ni une bonne ni une
   mauvaise nouvelle ; appeler une direction « amélioration » sans le
   savoir serait un avis. Sans cela la phrase s'arrête au fait : « a monté
   de 20 ».

   ET TOUTE LECTURE FINIT EN RENDANT L'ANALYSE À QUI SUIT LA PERSONNE. La
   dernière phrase n'est pas une note juridique — c'est la vérité sur ce
   qu'une analyse isolée peut dire.

   ⚠️ LE TITRE NE DIT PAS LE NOM DU MARQUEUR. « Votre HbA1c » / « Votre
   ferritine » demanderait une table de genre par marqueur pour écrire
   juste en français, et se tromper d'article dans une phrase sur la santé
   de quelqu'un est un faux pas facile à éviter. « Ce résultat » est
   toujours correct, et le nom est dans la barre du haut.
   ============================================================ */

export const exames = {
  resumo: {
    todosDentro: (quantos: number) =>
      `Les ${quantos} marqueurs de ce bilan sont dans les valeurs de référence du laboratoire.`,
    umFora: (total: number, qual: string) =>
      `Un des ${total} marqueurs de ce bilan est sorti des valeurs de référence : ${qual}.`,
    algunsFora: (fora: number, total: number, quais: string) =>
      `${fora} des ${total} marqueurs de ce bilan sont sortis des valeurs de référence : ${quais}.`,
    /* ⚠️ AU-DELÀ DE TROIS, LE COMPTE SUFFIT. Le résumé vit sur une
       couverture de hauteur fixe, et huit noms à la suite poussent le
       paragraphe dehors — et même s'il tenait, une liste de huit au milieu
       d'une phrase ne se lit pas, elle se compte. */
    muitosFora: (fora: number, total: number) =>
      `${fora} des ${total} marqueurs de ce bilan sont sortis des valeurs de référence.`,

    /* Le morceau de date qui ouvre la seconde phrase, quand il y a un
       historique. Il arrive avec la virgule parce qu'il s'enchaîne. */
    desde: (data: string) => ` Depuis ${data},`,
    melhoraUm: (desde: string, qual: string, de: string, para: string, unidade: string) =>
      `${desde} un marqueur est allé dans le sens attendu, et le plus grand changement est celui de ${qual} : de ${de} à ${para} ${unidade}.`,
    melhoraVarios: (desde: string, quantos: number, qual: string, de: string, para: string, unidade: string) =>
      `${desde} ${quantos} marqueurs sont allés dans le sens attendu, et le plus grand changement est celui de ${qual} : de ${de} à ${para} ${unidade}.`,

    /* ⚠️ L'AGGRAVATION VIENT DANS LA MÊME PHRASE ET AVEC LE MÊME POIDS QUE
       L'AMÉLIORATION. Un résumé qui ne raconte que ce qui s'est amélioré
       est de la publicité, et qui lit une prise de sang a besoin des deux
       moitiés. */
    pioraUm: (qual: string) => ` Un marqueur est allé dans le sens opposé : ${qual}.`,
    pioraPoucos: (quantos: number, quais: string) =>
      ` ${quantos} marqueurs sont allés dans le sens opposé : ${quais}.`,
    pioraMuitos: (quantos: number) => ` ${quantos} marqueurs sont allés dans le sens opposé.`,
  },

  leitura: {
    acima: 'au-dessus',
    abaixo: 'en dessous',

    dentroSemAfeta: 'Ce résultat est dans les valeurs de référence du laboratoire.',
    foraSemAfeta: (lado: string) =>
      `Ce résultat est ${lado} des valeurs de référence du laboratoire.`,
    dentroComAfeta: (afeta: string) =>
      `Ce résultat est dans les valeurs de référence, ce qui est bon signe ${afeta}.`,
    foraComAfeta: (lado: string, afeta: string) =>
      `Ce résultat est ${lado} des valeurs de référence, ce qui compte ${afeta}.`,

    faixaEntre: (min: string, max: string, unidade: string) => `entre ${min} et ${max}${unidade}`,
    faixaAbaixoDe: (max: string, unidade: string) => `en dessous de ${max}${unidade}`,
    faixaAcimaDe: (min: string, unidade: string) => `au-dessus de ${min}${unidade}`,

    /* ⚠️ LE SENS PORTE LA CONCLUSION qui était dans le titre : il ne dit
       pas seulement que ça a monté, mais VERS OÙ. Les quatre versions
       couvrent le fait d'être dans ou hors de la fourchette, croisé avec
       aller du bon ou du mauvais côté. */
    rumoDentroBom: ', dans le sens attendu',
    rumoDentroRuim: ', dans le sens opposé à celui attendu',
    rumoForaBom: ', en se rapprochant de la référence',
    rumoForaRuim: ', en s’en éloignant',
    subiu: 'a monté de',
    caiu: 'a baissé de',
    /* ⚠️ LE VERBE PORTE DÉJÀ « de », parce que le français ne dit pas
       « il a monté 20 mg/dL ». Le portugais s'en passe — « ele subiu 20 » —
       et c'est pour ça que la préposition ne pouvait pas rester dans le
       gabarit : elle appartient à la langue, pas au modèle. */
    andou: (data: string, verbo: string, quanto: string, unidade: string, rumo: string) =>
      ` Depuis ${data}, il ${verbo} ${quanto}${unidade}${rumo}.`,

    /* ⚠️ C'EST LA SEULE PHRASE DE L'ÉCRAN QUI REGARDE HORS DE CE MARQUEUR.
       Un chiffre hors fourchette lu tout seul devient le monde entier de
       qui le lit — et ce qui désamorce ça n'est pas dans le marqueur,
       c'est dans le tableau : savoir que les quatorze autres sont bons
       change la taille de celui-là. */
    painelTudoDentro: (total: number) =>
      ` Les ${total} marqueurs de ce bilan sont dans les valeurs de référence.`,
    painelEsteNao: (total: number, fora: number, plural: boolean) =>
      ` Sur les ${total} marqueurs de ce bilan, ${fora} ${plural ? 'sont sortis' : 'est sorti'} des valeurs de référence ; celui-ci non.`,
    painelUnicoFora: (total: number) =>
      ` Sur les ${total} marqueurs de ce bilan, celui-ci est le seul hors des valeurs de référence.`,
    painelEsteEUmDeles: (total: number, fora: number) =>
      ` Sur les ${total} marqueurs de ce bilan, ${fora} sont hors des valeurs de référence, et celui-ci en fait partie.`,

    /* ⚠️ LA DERNIÈRE PHRASE NE S'ENLÈVE PAS. « Une analyse seule ne conclut
       rien » est ce qui empêche toute la lecture de devenir un diagnostic,
       et « qui vous suit » est vrai dans les trois cas — avec une équipe,
       avec un médecin isolé et sans personne. */
    corpo: (data: string, valor: string, unidade: string, faixa: string, andou: string, painel: string) =>
      `Au prélèvement du ${data}, la valeur était de ${valor}${unidade}, et la référence du laboratoire est ${faixa}.${andou}${painel} Une analyse seule ne conclut rien : la personne qui la met avec le reste de votre histoire, c’est celle qui vous suit.`,
  },

  tela: {
    titulo: 'Analyses',
    linha: (quantos: number, ultimaColeta: string) =>
      `${quantos} ${quantos === 1 ? 'marqueur' : 'marqueurs'} · dernier bilan ${ultimaColeta}`,
    foraDaReferencia: 'hors des valeurs',
    naReferencia: 'dans les valeurs',
    blocoFora: 'Hors des valeurs',
    arquivosImportados: 'Fichiers importés',
    arquivoSub: (marcadores: number, fonte: string, data: string) =>
      `${marcadores} marqueurs · ${fonte} · ${data}`,
    importar: 'Importer une analyse',
    enviarAoMedico: 'Envoyer au médecin',

    colhidoEm: (data: string) => `Prélevé le ${data}`,
    vereditoOk: 'Dans les valeurs',
    vereditoAlto: 'Au-dessus des valeurs',
    vereditoBaixo: 'En dessous des valeurs',
    vereditoComFaixa: (veredito: string, faixa: string) => `${veredito} : ${faixa}`,
    faixaEntre: (minimo: string, maximo: string, unidade: string) =>
      `entre ${minimo} et ${maximo}${unidade}`,
    faixaAbaixo: (maximo: string, unidade: string) => `en dessous de ${maximo}${unidade}`,
    faixaAcima: (minimo: string, unidade: string) => `au-dessus de ${minimo}${unidade}`,
    faixaRef: (referencia: string, unidade: string) => `${referencia}${unidade}`,
    refCurta: (referencia: string) => ` · réf ${referencia}`,

    /* Os selos da LISTA, em caixa baixa e curtos: ali eles cabem ao lado
       do número, e o veredito por extenso mora no detalhe. */
    seloOk: 'dans les valeurs',
    seloAlto: 'au-dessus',
    seloBaixo: 'en dessous',
    seloEnviado: 'envoyé',

    sobre: 'À PROPOS',

    evolucao: 'ÉVOLUTION',
    deAte: (primeiro: string, ultimo: string) => `De ${primeiro} à ${ultimo}`,
    coletasDesde: (quantas: number, data: string) =>
      `${quantas} ${quantas === 1 ? 'bilan' : 'bilans'} depuis le ${data}`,
    deltaEsperado: ' · attendu',
    deltaOposto: ' · à l’inverse',

    oQueSignifica: 'CE QUE CELA VEUT DIRE',
    oQueAjuda: 'Ce qui aide en général',
    oQueMexe: 'Ce qui fait bouger le résultat aussi',
    rodape: 'Ce sont les causes et les pistes les plus courantes, pas la liste entière. Changer une dose ou un médicament est une décision de la personne qui vous suit.',
    perguntarSobre: 'Poser une question sur cette analyse',
    perguntaCompanion: (marcador: string) => `Expliquez mon analyse de ${marcador}`,
  },
};
