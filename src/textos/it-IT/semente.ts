/* ============================================================
   LA PAZIENTE DI ESEMPIO — chi è la demo, in italiano · it-IT

   ⚠️ Le ragioni stanno in ../pt-BR/semente.ts. Le due che comandano
   questo file:

   È UNA PERSONA, NON UNA TRADUZIONE. Giulia è italiana, con la sua
   dottoressa e la sua città — non è Mariana con altre parole.

   E QUI NON C'È RETE DI CLINICHE PARTNER. Esiste solo in Brasile, quindi
   Giulia è seguita dalla sua dottoressa, e di un medico proprio l'app sa
   solo quello che la persona scrive: nome, specializzazione e dove
   riceve. Niente numero d'iscrizione all'Ordine, biografia o voto —
   nessuno li ha forniti.
   ============================================================ */

export const semente = {
  redeParceira: false,

  nome: 'Giulia Romano',
  medica: 'Dott.ssa Elena Ferri',
  clinica: 'Studio medico Ferri',
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
    especialidade: 'Endocrinologa',
    registro: '',
    sobre: '',
    abordagens: [],
    formacao: [],
  },

  metas: ['Rientrare nei jeans di una volta', 'Tornare al mare', 'Cominciare a camminare la mattina'],

  tarefaExame: '',
  mensagens: [],

  documentos: [
    { dias: 40, nome: 'Emocromo completo', tipo: 'exame' },
    { dias: 40, nome: 'Profilo lipidico', tipo: 'exame' },
    { dias: 14, nome: 'Riepilogo della settimana 8', tipo: 'resumo' },
  ],

  tipoDaConsulta: 'Televisita',
  consultasAnteriores: [
    { dias: 32, tipo: 'In studio', nota: 'Dose portata a 5 mg. Andamento come previsto, ben tollerata.' },
    { dias: 60, tipo: 'In studio', nota: 'Inizio della terapia. Obiettivi definiti, esami di base prescritti.' },
  ],

  arquivosDeExame: ['Profilo metabolico', 'Esami di base'],

  receitas: [],

  historico: {
    condicoes: ['Prediabete', 'Ipertensione lieve'],
    alergias: ['Nessuna nota'],
    remedios: ['Losartan 50 mg'],
  },
  sintomasProprios: ['Reflusso'],

  equipe: [],
  materiais: [],

  notas: [
    { dias: 2, texto: 'La stitichezza è peggiorata da quando sono passata a 5 mg', feita: false },
    { dias: 7, texto: 'Chiedere se posso fare la puntura la mattina invece che la sera', feita: false },
    { dias: 16, texto: 'Capogiri per due giorni di fila nella settimana 9', feita: false },
    { dias: 23, texto: 'Verificare se resto a 5 mg o se salgo', feita: false },
    { dias: 38, texto: 'Parlare della nausea delle prime settimane', feita: true },
    { dias: 45, texto: 'Chiedere gli esami di controllo', feita: true },
  ],
};
