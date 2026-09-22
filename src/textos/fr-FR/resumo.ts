/* ============================================================
   LE RÉSUMÉ POUR LA CONSULTATION — le document que la personne apporte · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/resumo.ts. Les deux qui commandent :

   CE TEXTE VA AU MÉDECIN, et c'est le seul de l'application qui en sorte.
   Le registre est PLUS FORMEL que le reste — « Cadence », « Variation »,
   « Sur » sont des étiquettes de tableau clinique, et non la voix de
   conversation de l'écran d'accueil. Qui lit de l'autre côté a deux
   minutes et cherche des chiffres.

   ET L'ORIGINE VA AVEC, en dernière ligne : qui reçoit ceci par message a
   besoin de savoir que ça sort d'une application de suivi et non d'un
   dossier médical, et que les chiffres sont ce que la PERSONNE a noté.

   ⚠️ CHAQUE SYMPTÔME AVEC SON UNITÉ. Nausée, faim et énergie sont des
   échelles de zéro à dix ; le sommeil est une heure de montre. Une
   section entière étiquetée « (0–10) » mettait sept heures de sommeil sur
   la même règle qu'une nausée à sept.
   ============================================================ */

export const resumo = {
  medicacao: 'Médication',
  medicamento: 'Médicament',
  dose: 'Dose',
  cadencia: 'Cadence',
  tempoDeTratamento: 'Durée du traitement',
  emDias: (dias: number) => `${dias} jours`,
  aplicacoes: 'Injections',
  aplicacoesValor: (feitas: number, previstas: number) => `${feitas} sur ${previstas} prévues`,

  peso: 'Poids',
  inicioAtual: 'Début → actuel',
  variacao: 'Variation',
  em: 'Sur',
  metaDePeso: 'Objectif de poids',

  sintomas: 'Symptômes',
  mediaDosDias: (comResposta: number) => `Moyenne des 14 derniers jours · ${comResposta} avec réponse`,
  semRespostas: 'Aucune réponse sur les 14 derniers jours',
  nausea: 'Nausée',
  fome: 'Faim',
  energia: 'Énergie',
  sono: 'Sommeil',
  de10: ' sur 10',
  horas: ' h',

  examesRecentes: 'Analyses récentes',
  anotacoes: 'Notes pour la consultation',
  semAnotacoes: '(aucune note)',

  cabecalho: (nome: string) => `RÉSUMÉ DE TRAITEMENT — ${nome}`,
  paraDoutor: (doutor: string) => ` · pour ${doutor}`,
  origem: 'Généré par l’application à partir des relevés de la personne elle-même.',

  nomeDoDocumento: 'Résumé de traitement',
  enviadoPara: (doutor: string) => `Envoyé par vous à ${doutor}`,
  enviado: 'Envoyé par vous',
};
