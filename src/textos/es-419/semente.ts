/* ============================================================
   LA PACIENTE DE EJEMPLO — quién es la demostración, en español · es-419

   ⚠️ Las razones viven en ../pt-BR/semente.ts. Las dos que mandan aquí:

   ES UNA PERSONA, NO UNA TRADUCCIÓN. Valeria es latinoamericana, con su
   propia médica y su propia ciudad — no es Mariana con las palabras
   cambiadas.

   Y AQUÍ NO HAY RED DE CLÍNICAS ASOCIADAS. Solo existe en Brasil, así que
   Valeria se atiende con su propia médica, y de una médica propia la
   aplicación solo sabe lo que la persona escribe: nombre, especialidad y
   dónde la atiende. Sin cédula, biografía ni calificación — nadie las dio.
   ============================================================ */

export const semente = {
  redeParceira: false,

  nome: 'Valeria Ramírez',
  medica: 'Dra. Carolina Méndez',
  clinica: 'Clínica Arboleda',
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
    especialidade: 'Endocrinóloga',
    registro: '',
    sobre: '',
    abordagens: [],
    formacao: [],
  },

  metas: ['Volver a ponerme mis jeans de antes', 'Volver a ir a la playa', 'Empezar a caminar por las mañanas'],

  tarefaExame: '',
  mensagens: [],

  documentos: [
    { dias: 40, nome: 'Biometría hemática', tipo: 'exame' },
    { dias: 40, nome: 'Perfil de lípidos', tipo: 'exame' },
    { dias: 14, nome: 'Resumen de la semana 8', tipo: 'resumo' },
  ],

  tipoDaConsulta: 'Teleconsulta',
  consultasAnteriores: [
    { dias: 32, tipo: 'Presencial', nota: 'Ajuste de dosis a 5 mg. Evolución dentro de lo esperado, buena tolerancia.' },
    { dias: 60, tipo: 'Presencial', nota: 'Inicio del tratamiento. Metas definidas, estudios de base solicitados.' },
  ],

  arquivosDeExame: ['Perfil metabólico', 'Estudios de base'],

  receitas: [],

  historico: {
    condicoes: ['Prediabetes', 'Hipertensión leve'],
    alergias: ['Ninguna conocida'],
    remedios: ['Losartán 50 mg'],
  },
  sintomasProprios: ['Reflujo'],

  equipe: [],
  materiais: [],

  notas: [
    { dias: 2, texto: 'El estreñimiento empeoró desde que subí a 5 mg', feita: false },
    { dias: 7, texto: 'Preguntar si puedo inyectarme en la mañana en vez de en la noche', feita: false },
    { dias: 16, texto: 'Mareo dos días seguidos en la semana 9', feita: false },
    { dias: 23, texto: 'Confirmar si sigo en 5 mg o subo', feita: false },
    { dias: 38, texto: 'Hablar de las náuseas de las primeras semanas', feita: true },
    { dias: 45, texto: 'Pedir los estudios de seguimiento', feita: true },
  ],
};
