/* ============================================================
   LA PATIENTE D'EXEMPLE — qui est la démonstration, en français · fr-FR

   ⚠️ Les raisons vivent dans ../pt-BR/semente.ts. Les deux qui commandent
   ce fichier :

   C'EST UNE PERSONNE, PAS UNE TRADUCTION. Camille est française, avec son
   propre médecin et sa propre ville — ce n'est pas Mariana avec d'autres
   mots.

   ET IL N'Y A PAS DE RÉSEAU PARTENAIRE ICI. Il n'existe qu'au Brésil ;
   Camille est donc suivie par son propre médecin, et d'un médecin
   personnel l'application ne sait que ce que la personne saisit : le nom,
   la spécialité et le lieu de consultation. Ni numéro RPPS, ni
   biographie, ni note — personne ne les a donnés.
   ============================================================ */

export const semente = {
  redeParceira: false,

  nome: 'Camille Dubois',
  medica: 'Dr Claire Martin',
  clinica: 'Cabinet du Parc',
  nutri: '',

  clinicaInfo: {
    especialidade: '',
    cidade: '',
    sobre: '',
    endereco: '',
    horario: '',
    convenios: [],
    site: '',
    email: '',
  },

  medicaInfo: {
    especialidade: 'Endocrinologue',
    registro: '',
    sobre: '',
    abordagens: [],
    formacao: [],
  },

  metas: ['Rentrer dans mon ancien jean', 'Retourner à la plage', 'Commencer à marcher le matin'],

  tarefaExame: '',
  mensagens: [],

  documentos: [
    { dias: 40, nome: 'Numération formule sanguine', tipo: 'exame' },
    { dias: 40, nome: 'Bilan lipidique', tipo: 'exame' },
    { dias: 14, nome: 'Résumé de la semaine 8', tipo: 'resumo' },
  ],

  tipoDaConsulta: 'Téléconsultation',
  consultasAnteriores: [
    { dias: 32, tipo: 'Au cabinet', nota: 'Dose passée à 5 mg. Évolution conforme, bonne tolérance.' },
    { dias: 60, tipo: 'Au cabinet', nota: 'Début du traitement. Objectifs fixés, bilan initial prescrit.' },
  ],

  arquivosDeExame: ['Bilan métabolique', 'Bilan initial'],

  receitas: [],

  historico: {
    condicoes: ['Prédiabète', 'Hypertension légère'],
    alergias: ['Aucune connue'],
    remedios: ['Losartan 50 mg'],
  },
  sintomasProprios: ['Reflux'],

  equipe: [],
  materiais: [],

  notas: [
    { dias: 2, texto: 'La constipation a empiré depuis que je suis passée à 5 mg', feita: false },
    { dias: 7, texto: 'Demander si je peux faire l’injection le matin plutôt que le soir', feita: false },
    { dias: 16, texto: 'Vertiges deux jours de suite en semaine 9', feita: false },
    { dias: 23, texto: 'Savoir si je reste à 5 mg ou si j’augmente', feita: false },
    { dias: 38, texto: 'Parler des nausées des premières semaines', feita: true },
    { dias: 45, texto: 'Demander les analyses de suivi', feita: true },
  ],
};
