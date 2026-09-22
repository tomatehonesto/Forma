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

  tela: {
    titulo: 'Résumé pour la consultation',
    lead: 'Tout ce que vous avez noté, tel que cela arrivera à la consultation.',

    enviar: (doutor: string) => `Envoyer à ${doutor}`,
    enviarDeNovo: (doutor: string) => `Renvoyer à ${doutor}`,
    enviado: 'Envoyé',
    compartilhar: 'Partager autrement',

    resumoDe: (data: string) => `Résumé du ${data}`,
    paraQuem: (quem: string) => `Pour ${quem}`,
    paraQuemComClinica: (doutor: string, clinica: string) => `Pour ${doutor} · ${clinica}`,
    paraLevar: 'À emporter à la prochaine consultation',
    enviadoEm: (quando: string) => `Envoyé ${quando}`,
    enviosSub: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'envoi' : 'envois'} · reste chez votre équipe`,

    examesRecentes: 'Analyses récentes',
    verTodos: 'Voir toutes',

    anotacoes: 'Notes pour la consultation',
    anotar: 'Noter',
    anotacoesNota: 'Seulement celles que vous n’avez pas encore marquées comme abordées.',
    nadaAnotado: 'Rien de noté',
    nadaAnotadoTexto: 'Ce que vous voulez demander à la consultation s’écrit ici, et entre dans le résumé.',

    relatoTitulo: 'C’est un récit, pas un examen',
    relatoTexto: 'Les chiffres viennent de ce que vous avez noté dans l’application. Ils servent à la conversation de la consultation, et ne remplacent ni une évaluation ni un compte rendu.',

    confirmacaoEnvio: (doutor: string) => `Envoyé. Cela parvient à ${doutor}.`,
  },
};
