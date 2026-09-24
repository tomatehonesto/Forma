/* ============================================================
   DIE BEISPIELPATIENTIN — wer die Demo ist, auf Deutsch · de-DE

   ⚠️ Die Gründe stehen in ../pt-BR/semente.ts. Die zwei, die diese Datei
   bestimmen:

   DAS IST EINE PERSON, KEINE ÜBERSETZUNG. Julia ist Deutsche, mit eigener
   Ärztin und eigener Stadt — nicht Mariana mit anderen Wörtern.

   UND ES GIBT HIER KEIN PARTNERNETZ. Es existiert nur in Brasilien; Julia
   wird also von ihrer eigenen Ärztin betreut, und von einer eigenen
   Ärztin weiß die App nur, was die Person eintippt: Name, Fachrichtung
   und wo sie behandelt wird. Keine Arztnummer, keine Vita, keine
   Bewertung — niemand hat sie geliefert.
   ============================================================ */

export const semente = {
  redeParceira: false,

  nome: 'Julia Becker',
  medica: 'Dr. Anna Richter',
  clinica: 'Praxis am Stadtpark',
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
    especialidade: 'Endokrinologin',
    registro: '',
    sobre: '',
    abordagens: [],
    formacao: [],
  },

  metas: ['Wieder in die alte Jeans passen', 'Wieder an den Strand gehen', 'Morgens spazieren gehen'],

  tarefaExame: '',
  mensagens: [],

  documentos: [
    { dias: 40, nome: 'Großes Blutbild', tipo: 'exame' },
    { dias: 40, nome: 'Lipidprofil', tipo: 'exame' },
    { dias: 14, nome: 'Übersicht Woche 8', tipo: 'resumo' },
  ],

  tipoDaConsulta: 'Videosprechstunde',
  consultasAnteriores: [
    { dias: 32, tipo: 'In der Praxis', nota: 'Dosis auf 5 mg erhöht. Verlauf wie erwartet, gut verträglich.' },
    { dias: 60, tipo: 'In der Praxis', nota: 'Beginn der Behandlung. Ziele festgelegt, Basislabor angeordnet.' },
  ],

  arquivosDeExame: ['Stoffwechselprofil', 'Basislabor'],

  receitas: [],

  historico: {
    condicoes: ['Prädiabetes', 'Leichter Bluthochdruck'],
    alergias: ['Keine bekannt'],
    remedios: ['Losartan 50 mg'],
  },
  sintomasProprios: ['Sodbrennen'],

  equipe: [],
  materiais: [],

  notas: [
    { dias: 2, texto: 'Die Verstopfung ist schlimmer, seit ich bei 5 mg bin', feita: false },
    { dias: 7, texto: 'Fragen, ob ich morgens statt abends spritzen kann', feita: false },
    { dias: 16, texto: 'Schwindel an zwei Tagen hintereinander in Woche 9', feita: false },
    { dias: 23, texto: 'Klären, ob ich bei 5 mg bleibe oder erhöhe', feita: false },
    { dias: 38, texto: 'Die Übelkeit der ersten Wochen ansprechen', feita: true },
    { dias: 45, texto: 'Nach den Kontrollwerten fragen', feita: true },
  ],
};
