/* ============================================================
   THE SAMPLE PATIENT — who the demo is, in English · en-US

   ⚠️ The reasons live in ../pt-BR/semente.ts. The two that shape this
   file:

   THIS IS A PERSON, NOT A TRANSLATION. Sarah is American, with her own
   doctor and her own city — not Mariana with her words swapped.

   AND THERE IS NO PARTNER NETWORK HERE. It exists only in Brazil, so
   Sarah sees her own doctor, and of an own doctor the app knows only what
   the person types: name, specialty and where she's seen. No license
   number, bio or rating — nobody provided them.
   ============================================================ */

export const semente = {
  redeParceira: false,

  nome: 'Sarah Mitchell',
  medica: 'Dr. Rachel Morgan',
  clinica: 'Lakeside Endocrinology',
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
    especialidade: 'Endocrinologist',
    registro: '',
    sobre: '',
    abordagens: [],
    formacao: [],
  },

  metas: ['Fit into my old jeans', 'Go to the beach again', 'Start walking in the mornings'],

  tarefaExame: '',
  mensagens: [],

  documentos: [
    { dias: 40, nome: 'Complete blood count', tipo: 'exame' },
    { dias: 40, nome: 'Lipid panel', tipo: 'exame' },
    { dias: 14, nome: 'Week 8 summary', tipo: 'resumo' },
  ],

  tipoDaConsulta: 'Video visit',
  consultasAnteriores: [
    { dias: 32, tipo: 'In person', nota: 'Dose raised to 5 mg. Progress as expected, tolerating it well.' },
    { dias: 60, tipo: 'In person', nota: 'Started treatment. Goals set, baseline labs ordered.' },
  ],

  arquivosDeExame: ['Metabolic panel', 'Baseline labs'],

  receitas: [],

  historico: {
    condicoes: ['Prediabetes', 'Mild high blood pressure'],
    alergias: ['None known'],
    remedios: ['Losartan 50 mg'],
  },
  sintomasProprios: ['Reflux'],

  equipe: [],
  materiais: [],

  notas: [
    { dias: 2, texto: 'Constipation has been worse since I went up to 5 mg', feita: false },
    { dias: 7, texto: 'Ask if I can do my shot in the morning instead of at night', feita: false },
    { dias: 16, texto: 'Dizzy two days in a row in week 9', feita: false },
    { dias: 23, texto: 'Check whether I stay on 5 mg or go up', feita: false },
    { dias: 38, texto: 'Bring up the nausea from the first few weeks', feita: true },
    { dias: 45, texto: 'Ask for the follow-up labs', feita: true },
  ],
};
