/* ============================================================
   A PACIENTE DE EXEMPLO — quem a demonstração é, em cada idioma

   ⚠️⚠️ ESTE MÓDULO NÃO É O APLICATIVO FALANDO. O resto do catálogo é a
   voz do Morphi; aqui mora o que PESSOAS da demonstração escreveram ou
   são — a paciente, a médica, a clínica, as notas dela para a consulta.
   Fica separado para a regra "toda frase do catálogo é o aplicativo"
   continuar valendo nos outros módulos.

   ⚠️⚠️ E CADA IDIOMA É UMA PERSONA, NÃO UMA TRADUÇÃO. A Mariana é
   brasileira, com médica paulista, CRM e convênios daqui; a alemã é outra
   pessoa, com outra médica, outra cidade e outro jeito de se tratar.
   Traduzir só a prosa daria meta em alemão ao lado de um CRM de São Paulo
   — é o item 27 do PENDENCIAS, e a decisão de 24/09/2026.

   ⚠️ A REDE PARCEIRA É SÓ BRASILEIRA. `redeParceira` decide se a semente
   grava vínculo, conversa com a equipe, receitas, equipe e materiais. Fora
   do Brasil a persona se trata com médico próprio — e de médico próprio o
   aplicativo só sabe o que a pessoa digita em /acompanhamento: nome,
   especialidade e onde é atendida. Por isso as personas de fora têm
   `medicaInfo` e `clinicaInfo` vazios: registro, biografia e nota de
   avaliação seriam dados que ninguém forneceu.

   ⚠️ É LIDO UMA VEZ, na hora de montar a semente — o que ela grava fica
   gravado, como qualquer registro. Trocar de idioma depois não troca a
   persona; para isso há "Reconstruir a semente", no fim do Perfil.

   `dias` é quantos dias atrás; a semente converte.
   ============================================================ */

export const semente = {
  redeParceira: true,

  nome: 'Mariana Silva',
  medica: 'Dra. Helena Costa',
  clinica: 'Clínica Vitalis',
  /* A nutricionista da equipe. Vazio fora da rede: sem equipe, a meta de
     proteína é anotada da própria médica. */
  nutri: 'Renata Alves',

  /* A ficha da clínica parceira. Sem telefone, de propósito — ver o
     comentário de `clinicInfo` em logic/seed. `.example` é TLD reservado
     (RFC 2606) e nunca vai pertencer a ninguém. */
  clinicaInfo: {
    especialidade: 'Endocrinologia e Metabologia',
    cidade: 'São Paulo, SP',
    sobre: 'Clínica especializada no cuidado integral do paciente, com foco em tratamento clínico da obesidade e saúde metabólica. O acompanhamento é feito por uma equipe que conversa entre si — o que você registra aqui chega a todo mundo que cuida de você.',
    endereco: 'Rua Ficção Exemplar, 100 — Jardim Modelo',
    horario: 'Seg a sex, 8h às 18h',
    convenios: ['Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'Particular'],
    site: 'www.clinicavitalis.example',
    email: 'contato@clinicavitalis.example',
  },

  medicaInfo: {
    especialidade: 'Endocrinologista',
    registro: 'CRM 128456-SP',
    sobre: 'Especialista em tratamento clínico da obesidade, modulação hormonal e saúde metabólica. Meu objetivo é promover saúde com acolhimento, ciência e personalização em cada etapa do tratamento.',
    abordagens: ['Emagrecimento', 'Modulação hormonal', 'Metabolismo', 'Saúde intestinal'],
    formacao: [
      'Residência em Endocrinologia e Metabologia — HC-FMUSP',
      'Título de Especialista pela SBEM',
      'Pós-graduação em Nutrologia',
    ],
  },

  /* As três metas de vida, na voz dela. A terceira já foi conquistada. */
  metas: ['Vestir a calça jeans antiga', 'Voltar a ir à praia', 'Começar a caminhar de manhã'],

  /* A única tarefa da semana que é ordem clínica. Só existe com equipe. */
  tarefaExame: 'Agendar exame de sangue',

  /* A conversa com a equipe — só com rede parceira. `de` é 'doc' ou 'me'. */
  mensagens: [
    { dias: 6, de: 'doc', texto: 'Oi Mariana, vi que você passou pros 5 mg. Como está a náusea nos primeiros dias?' },
    { dias: 6, de: 'me', texto: 'Melhorou bastante, só no primeiro dia foi mais forte.' },
    { dias: 2, de: 'doc', texto: 'Ótimo sinal. Mantém a hidratação e a proteína que combinamos. Na consulta a gente revê a dose com calma.' },
  ],

  /* ⚠️ O `tipo` É CHAVE, igual nas seis personas: 'exame' leva para
     Exames, o resto para o resumo. O rótulo que a tela mostra sai de
     `tipoDoDocumento`, em logic/derive. Era "Exame" e "Gerado pela IA"
     gravados em português, e a rota decidia o destino procurando "exame"
     no rótulo. */
  documentos: [
    { dias: 40, nome: 'Hemograma completo', tipo: 'exame' },
    { dias: 40, nome: 'Perfil lipídico', tipo: 'exame' },
    { dias: 14, nome: 'Resumo da semana 8', tipo: 'resumo' },
  ],

  tipoDaConsulta: 'Teleconsulta',
  consultasAnteriores: [
    { dias: 32, tipo: 'Presencial', nota: 'Ajuste de dose para 5 mg. Evolução dentro do esperado, boa tolerância.' },
    { dias: 60, tipo: 'Presencial', nota: 'Início do tratamento. Metas definidas, exames de base solicitados.' },
  ],

  /* Os dois arquivos de exame importados: o painel recente e o de base. */
  arquivosDeExame: ['Painel metabólico', 'Exames de base'],

  /* Receitas da equipe — só com rede parceira. */
  receitas: [
    { nome: 'Mounjaro (tirzepatida)', detalhe: 'Titulação 2,5 → 5 mg · 1×/semana, subcutânea', por: 'Dra. Helena Costa' },
    { nome: 'Suplemento de proteína', detalhe: 'Conforme necessidade, para atingir a meta diária', por: 'Renata Alves (Nutrição)' },
  ],

  historico: {
    condicoes: ['Pré-diabetes', 'Hipertensão leve'],
    alergias: ['Nenhuma conhecida'],
    remedios: ['Losartana 50 mg'],
  },
  sintomasProprios: ['Refluxo'],

  /* A equipe além da médica — só com rede parceira. Registro, formação e
     áreas são ficção plausível; quando a clínica existir, quem manda a
     ficha é ela. */
  equipe: [
    {
      id: 'renata', name: 'Renata Alves', role: 'Nutricionista',
      registro: 'CRN-3 45821',
      sobre: 'Ajusta o plano alimentar conforme a fase do ciclo, e trabalha com o que você já come — não com uma dieta pronta.',
      formacao: ['Nutrição — USP', 'Especialização em Nutrição Clínica Funcional'],
      areas: ['Plano alimentar', 'Proteína', 'Saciedade', 'Efeitos digestivos'],
    },
    {
      id: 'carla', name: 'Carla Mendes', role: 'Enfermeira',
      registro: 'COREN-SP 412.905',
      sobre: 'Orienta aplicação, locais e conservação do medicamento. É com ela que se tira dúvida de agulha, rodízio e viagem.',
      formacao: ['Enfermagem — UNIFESP', 'Capacitação em terapia injetável'],
      areas: ['Aplicação', 'Rodízio de locais', 'Conservação', 'Descarte'],
    },
    {
      id: 'rafael', name: 'Rafael Lima', role: 'Psicólogo',
      registro: 'CRP 06/152340',
      sobre: 'Acompanha a relação com a comida e com o corpo — o que muda de humor, de imagem e de vontade ao longo do tratamento.',
      formacao: ['Psicologia — PUC-SP', 'Formação em Terapia Cognitivo-Comportamental'],
      areas: ['Compulsão', 'Imagem corporal', 'Ansiedade', 'Adesão'],
    },
  ],

  /* O que a clínica mandou — só com rede parceira. `motivo` é o que separa
     curadoria de biblioteca. */
  materiais: [
    { dias: 32, name: 'O que fazer se enjoar', kind: 'Guia rápido', meta: '2 min', ic: 'bulb', motivo: 'Para a fase de titulação' },
    { dias: 70, name: 'Como aplicar sem dor', kind: 'Vídeo', meta: '4 min', ic: 'play', motivo: 'Enviado pela enfermeira' },
    { dias: 70, name: 'Protocolo alimentar', kind: 'Protocolo', meta: '2,4 MB', ic: 'doc', motivo: 'Montado pela nutricionista' },
    { dias: 60, name: 'Checklist da semana', kind: 'Checklist', meta: '8 itens', ic: 'check', motivo: 'Atualizado toda segunda' },
  ],

  /* As notas dela para a consulta, na voz dela. */
  notas: [
    { dias: 2, texto: 'A constipação piorou desde que subi para 5 mg', feita: false },
    { dias: 7, texto: 'Perguntar se posso aplicar de manhã em vez de à noite', feita: false },
    { dias: 16, texto: 'Tontura em dois dias seguidos na semana 9', feita: false },
    { dias: 23, texto: 'Confirmar se mantenho 5 mg ou subo', feita: false },
    { dias: 38, texto: 'Falar sobre os enjoos das primeiras semanas', feita: true },
    { dias: 45, texto: 'Pedir os exames de acompanhamento', feita: true },
  ],
};
