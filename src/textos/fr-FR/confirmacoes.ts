import { medidas } from './medidas';

/* ============================================================
   LES CONFIRMATIONS — la feuille qui apparaît après avoir noté · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/confirmacoes.ts. Les deux qui
   commandent :

   LE TITRE NE DEVIENT UNE NOUVELLE QUE QUAND L'OBJECTIF EST ATTEINT.
   « Hydratation du jour bouclée » à chaque verre serait le mensonge
   habituel : dire que c'est fini alors qu'il manque encore. Tant qu'il
   manque, le titre est le relevé — « Eau notée ».

   ET LE SCEAU DE LA VARIATION NE JUGE PAS. Le même ton vaut pour qui est
   montée et pour qui est descendue : en peindre un en neutre et l'autre en
   vert serait l'application disant laquelle des deux journées était bien.

   ⚠️ ET AUCUN PARTICIPE NE S'ACCORDE AVEC QUI LIT. « Poids noté »,
   « Repas noté » — le participe s'accorde avec la chose notée, jamais
   avec la personne. Voir le haut de ../fr-FR/etapa.ts.
   ============================================================ */

export const confirmacoes = {
  /* ⚠️ « SANS CHANGEMENT » ET NON « −0,0 ». Un nombre qui n'a pas bougé
     n'a varié d'aucun côté, et le signe moins devant un zéro suggère une
     perte qui n'a pas eu lieu. */
  semMudanca: 'sans changement',

  peso: 'Poids noté',
  pesoDesdeUltima: 'Depuis la dernière pesée',
  pesoMeta: 'Objectif de poids',
  pesoFaltam: (quanto: string) => `il reste ${quanto}`,
  pesoAlcancada: 'atteint',
  /* ⚠️ EN PLATEAU LE CHEMIN EST REMPLACÉ, pas ajouté : la feuille ne
     dessine qu'une invitation discrète, et deux commencent à faire un
     menu. */
  pesoNotaPlato: 'Un mois avec le poids dans la même fourchette. C’est là que le tour de taille continue souvent de descendre, et c’est le mètre qui le montre.',
  pesoCaminhoPlato: 'Mesurer le corps aussi',
  pesoCaminho: 'Voir la courbe du poids',

  medidas: 'Mesures notées',
  cintura: medidas.corpo.cintura,
  quadril: medidas.corpo.quadril,
  braco: medidas.corpo.braco,
  coxa: medidas.corpo.coxa,
  medidasCaminho: 'Voir l’évolution',

  exame: 'Résultat noté',
  /* ⚠️ LE VERDICT D'ABORD, parce que c'est la question de qui vient de
     saisir un chiffre d'analyse — et la fourchette vient avec, parce que
     c'est elle qui soutient le verdict. */
  exameFaixa: 'Valeurs de référence',
  exameNaReferencia: 'dans la référence',
  exameAcima: 'au-dessus',
  exameAbaixo: 'en dessous',
  exameDesdeAnterior: 'Depuis le prélèvement précédent',
  examePrimeira: 'Premier prélèvement de ce marqueur',
  examePrimeiraSub: 'le prochain deviendra une comparaison',
  exameCaminho: 'Voir dans le tableau des analyses',

  anotacao: 'Note enregistrée',
  anotacaoPauta: 'À l’ordre du jour de la consultation',
  anotacaoComDoutor: (doutor: string) => `ira dans le résumé pour ${doutor}`,
  anotacaoSemDoutor: 'ira dans le résumé pour la consultation',
  anotacaoCaminho: 'Voir le résumé pour la consultation',

  refeicao: 'Repas noté',
  refeicaoTexto: (agora: number, alvo: number) => `${agora} sur ${alvo} g de protéines aujourd’hui`,
  refeicaoFesta: 'Objectif de protéines du jour bouclé',
  proteinaDoDia: 'Protéines du jour',
  proteinaMeta: (alvo: number) => `objectif de ${alvo} g`,
  faltamGramas: (v: string) => `il reste ${v} g`,
  metaBatida: 'objectif atteint',
  refeicaoCaminho: 'Voir l’alimentation du jour',

  exercicio: 'Séance notée',
  exercicioTexto: (tipo: string, min: string) => `${tipo} · ${min} min`,
  exercicioSemTreino: (agora: number) => `${agora} min aujourd’hui`,
  exercicioFesta: 'Objectif de mouvement du jour bouclé',
  movimentoDoDia: 'Mouvement du jour',
  movimentoSub: (agora: number, alvo: number) => `${agora} sur ${alvo} min`,
  faltamMinutos: (v: string) => `il reste ${v} min`,
  treinosHoje: 'Séances aujourd’hui',
  exercicioCaminho: 'Voir la semaine d’exercice',

  agua: 'Eau notée',
  aguaFechada: 'Hydratation du jour bouclée',
  aguaTexto: (agora: string, alvo: string) => `${agora} sur ${alvo} aujourd’hui`,
  hidratacaoDoDia: 'Hydratation du jour',
  hidratacaoMeta: (alvo: string) => `objectif de ${alvo}`,
  faltamAgua: (v: string) => `il reste ${v}`,
  aguaCaminho: 'Voir l’hydratation',
};
