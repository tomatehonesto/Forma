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
  emDias: (dias: number) => `${dias} ${dias > 1 ? 'jours' : 'jour'}`,
  aplicacoes: 'Injections',
  aplicacoesValor: (feitas: number, previstas: number) => `${feitas} sur ${previstas} prévues`,
  aplicacoesNenhuma: 'Aucune enregistrée',

  peso: 'Poids',
  inicioAtual: 'Début → actuel',
  pesoAtual: 'Poids actuel',
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

  pdf: {
    exame: 'Analyse',
    resultado: 'Résultat',
    referencia: 'Référence',
  },

  relatorio: {
    titulo: 'Rapport du traitement',
    visaoGeral: 'Vue d’ensemble',
    pesoAtual: 'Poids actuel',
    variacao: 'Variation sur la période',
    aplicacoesNoPeriodo: 'Piqûres sur la période',
    checkinsRespondidos: 'Check-ins remplis',
    peso: 'Poids',
    medidas: 'Mensurations',
    aplicacoes: 'Piqûres',
    sintomas: 'Symptômes',
    exames: 'Analyses',
    notas: 'Notes pour la consultation',
    habitos: 'Repas, boissons et activité',
    data: 'Date',
    dose: 'Dose',
    local: 'Site',
    proteinaMedia: 'Protéines par jour, en moyenne',
    aguaMedia: 'Boissons par jour, en moyenne',
    exercicioTotal: 'Activité sur la période',
    semRegistros: 'Rien d’enregistré sur la période.',
    conversada: 'abordée',
    periodo: (de: string, ate: string) => `Du ${de} au ${ate}`,
    geradoEm: (data: string) => `Créé le ${data}`,
    para: (quem: string) => `Pour ${quem}`,
    minutos: (min: number) => `${min} min`,
    arquivo: (data: string) => `morphi-rapport-${data}.pdf`,
    semEnjoo: 'Pas de nausée',
    melhor: 'mieux',
    pior: 'moins bien',
    cadaQuadrado: 'Chaque carré est un jour rempli, du plus ancien au plus récent.',
    diasDe: (n: number, total: number) => `${n} sur ${total} ${total > 1 ? 'jours' : 'jour'}`,
    piorEm: (palavra: string, n: number) => `Au plus fort : « ${palavra} », ${n > 1 ? `${n} jours` : '1 jour'}`,
    antes: (valor: string, data: string) => `avant : ${valor} le ${data}`,
    coletadoEm: (data: string) => `prélèvement du ${data}`,
  },

  tela: {
    titulo: 'Résumé pour la consultation',
    lead: 'Tout ce que vous avez noté, tel que cela se présentera à la consultation.',

    enviar: (doutor: string) => `Envoyer à ${doutor}`,
    enviarDeNovo: (doutor: string) => `Renvoyer à ${doutor}`,
    enviado: 'Envoyé',
    compartilharPdf: 'Partager en PDF',
    ajustarPdf: 'Ajuster la période et le contenu',
    montandoPdf: 'Préparation du PDF…',

    resumoDe: (data: string) => `Résumé du ${data}`,
    paraQuem: (quem: string) => `Pour ${quem}`,
    paraQuemComClinica: (doutor: string, clinica: string) => `Pour ${doutor} · ${clinica}`,
    paraLevar: 'À emporter à la prochaine consultation',
    enviadoEm: (quando: string) => `Envoyé ${quando}`,
    enviosSub: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'envoi' : 'envois'} · reste chez votre équipe`,

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
