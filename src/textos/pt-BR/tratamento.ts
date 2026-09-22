/* ============================================================
   O TRATAMENTO — a dose, a cadência, os marcos e as réguas

   O que este arquivo tem em comum: são as palavras que descrevem o
   tratamento em si, e quase todas aparecem em mais de uma tela.

   ⚠️ NENHUMA DELAS DÁ NOTA À PESSOA. Os rótulos de ritmo e de estoque
   qualificam o NÚMERO, não quem o produziu — e onde a diferença é sutil
   está escrito por quê, item por item.
   ============================================================ */

export const tratamento = {
  /* ============================================================
     O NOME DO PRINCÍPIO ATIVO

     ⚠️⚠️ A CHAVE É O NOME EM PORTUGUÊS, E ELA NÃO SE TRADUZ. 'Tirzepatida'
     é o que está gravado em `MEDS[x].mol`, é o que `faixaDaMolecula`
     compara para achar a faixa de dose, e é o que sai no arquivo
     exportado. Mesma família da chave de marcador de exame: dado de um
     lado, tela do outro.

     ⚠️⚠️ E O NOME MUDA DE IDIOMA DE VERDADE. O nome comum internacional
     tem grafia própria em cada língua, e ele aparece DENTRO de frase em
     seis telas — a carta do companion sobre a fome, o ciclo, a linha do
     tempo, o resumo para a consulta. Antes desta tabela, um alemão lia
     "Tirzepatida" no meio de uma frase alemã.

     ⚠️ QUEM NÃO ESTIVER AQUI APARECE COM A PRÓPRIA CHAVE, pela mesma
     regra do `marcadores.nome`: medicamento novo não some da tela porque
     a tabela ainda não o conhece.

     ⚠️ E O TRAVESSÃO É O MANIPULADO, que não tem marca nem nome comum
     próprio — ele é o mesmo sinal em todo idioma.
     ============================================================ */
  molecula: {
    'Tirzepatida': 'Tirzepatida',
    'Semaglutida': 'Semaglutida',
    'Dulaglutida': 'Dulaglutida',
    'Liraglutida': 'Liraglutida',
    '—': '—',
  } as Record<string, string>,

  /* ---------- a dose e a cadência ---------- */
  /* ⚠️ A AUSÊNCIA TEM FRASE PRÓPRIA, e ela é curta de propósito: entra no
     meio de outras, como "Mounjaro ainda não definida". */
  doseIndefinida: 'ainda não definida',

  /* ⚠️ DOIS COMPRIMENTOS, E É DE PROPÓSITO. A linha de abertura de uma
     tela fala por extenso; a célula de uma tabela de resumo médico não tem
     essa largura. Quem traduzir precisa manter as duas curtas o bastante
     para o lugar delas — a versão curta cabe ao lado de um número. */
  cadenciaSemanal: 'uma vez por semana',
  cadenciaDiaria: 'uso diário',
  cadenciaOutra: (dias: number) => `a cada ${dias} dias`,
  cadenciaSemanalCurta: '1× por semana',
  cadenciaDiariaCurta: 'diária',
  cadenciaOutraCurta: (dias: number) => `a cada ${dias} dias`,

  /* ---------- o dia do tratamento ---------- */
  /* Antes de começar o que existe é contagem regressiva; depois, o dia. */
  antesDaPrimeiraDose: 'Antes da primeira dose',
  comecaAmanha: 'Começa amanhã',
  comecaEm: (dias: number) => `Começa em ${dias} dias`,
  /* ⚠️ "DIA 71", E NÃO "DIA 71 DO TRATAMENTO". A linha onde isto aparece
     já termina em "Semana 10", e as duas juntas só podem estar contando a
     mesma coisa — dizer de qual tratamento era a palavra que sobrava. */
  diaDoTratamento: (dia: number) => `Dia ${dia}`,

  /* ============================================================
     O RITMO DA PERDA

     ⚠️ RITMO NEGATIVO NÃO É "RITMO MAIS LENTO". Quem ganhou peso caía no
     último rótulo, e o cartão dizia "Ritmo mais lento" em verde ao lado de
     um número que subiu. Lento e ao contrário são coisas diferentes, e só
     uma delas é ritmo.

     "Acima do início" é o fato, sem adjetivo: a etiqueta abre a tela de
     ritmo, e é lá que se explica o que ela mede e o que não mede.

     ⚠️ E ACELERADO NÃO É RUIM. Perder mais de 1,5 kg por semana é motivo
     para conversar com a equipe — massa magra, hidratação —, e não um erro
     que a pessoa cometeu. A palavra não pode soar a repreensão.
     ============================================================ */
  ritmoAcimaDoInicio: 'Acima do início',
  ritmoSaudavel: 'Em ritmo saudável',
  ritmoAcelerado: 'Ritmo acelerado',
  ritmoLento: 'Ritmo mais lento',

  /* ============================================================
     O ESTOQUE

     Três graus, e o do meio é o que mais aparece: "vale renovar" é um
     aviso com semanas de antecedência, não um alarme.
     ============================================================ */
  estoqueUrgente: 'Renove agora',
  estoqueRenovar: 'Vale renovar a receita',
  estoqueEmDia: 'Estoque em dia',

  /* ============================================================
     OS LOCAIS DE APLICAÇÃO

     ⚠️ O LADO VEM ABREVIADO E ENTRE PARÊNTESES porque estes rótulos
     aparecem dentro de linhas curtas — histórico, sugestão do dia, resumo
     da semana. "Abdômen lado esquerdo" não cabe em nenhuma delas.
     ============================================================ */
  locais: {
    'abd-e': 'Abdômen (esq.)',
    'abd-d': 'Abdômen (dir.)',
    'coxa-e': 'Coxa (esq.)',
    'coxa-d': 'Coxa (dir.)',
    'braco-e': 'Braço (esq.)',
    'braco-d': 'Braço (dir.)',
  },

  /* ============================================================
     OS MARCOS DA JORNADA
     ============================================================ */
  marcos: {
    inicio: 'Início do tratamento',
    doseAjustada: (dose: string) => `Dose ajustada para ${dose} mg`,
    /* ⚠️ "CONFORME ORIENTAÇÃO MÉDICA" é o que impede a linha de parecer
       que o aplicativo ajustou alguma coisa. Ele registra; quem ajusta é
       quem prescreve. */
    titulacao: 'Titulação conforme orientação médica',
    cincoPorCento: '5% do peso inicial',
    /* ⚠️ "ALÉM DA BALANÇA" é o miolo: os 5% são a marca a partir da qual a
       literatura mostra ganho em pressão, glicemia e triglicerídeos. Sem
       essa metade, a linha vira mais um número de peso. */
    cincoPorCentoSub: 'Marca clínica, com benefícios além da balança',
    consulta: (tipo: string) => `Consulta ${tipo}`,
    marcadoresImportados: (quantos: number) => `${quantos} marcadores importados`,
  },

  /* ============================================================
     AS FAIXAS DE IMC

     ⚠️ SÃO OS NOMES DA CLASSIFICAÇÃO, e não adjetivos escolhidos por nós.
     "Obesidade grau I" é o termo do laudo; trocar por algo mais macio
     desalinharia o aplicativo do que a pessoa lê no exame e na consulta.
     Onde o cuidado entra é no TOM da cor, que é decisão de tela.
     ============================================================ */
  imc: {
    abaixo: 'Abaixo do peso',
    normal: 'Peso normal',
    sobrepeso: 'Sobrepeso',
    grau1: 'Obesidade grau I',
    grau2: 'Obesidade grau II',
    grau3: 'Obesidade grau III',
  },

  /* ============================================================
     O QUE TROUXE A PESSOA — a pergunta do cadastro

     ⚠️ NENHUM DOS CINCO É SOBRE APARÊNCIA SOZINHA, e "Como me vejo" é o
     mais perto disso de propósito: a frase é da pessoa sobre si, não do
     aplicativo sobre o corpo dela. "Emagrecer para ficar bonita" seria
     outro produto.
     ============================================================ */
  motivos: {
    saude: 'Saúde',
    saudeSub: 'Exames, pressão, glicemia',
    energia: 'Energia',
    energiaSub: 'Disposição no dia',
    espelho: 'Como me vejo',
    espelhoSub: 'No espelho e nas fotos',
    confianca: 'Confiança',
    confiancaSub: 'Me sentir bem comigo',
    medico: 'Orientação médica',
    medicoSub: 'Foi indicação de quem me acompanha',
  },

  /* ============================================================
     OS QUATRO DEGRAUS DE ATIVIDADE

     ⚠️ O SUBTÍTULO É O QUE FAZ O DEGRAU SIGNIFICAR ALGUMA COISA. Sem "1 a
     3 dias por semana", "levemente ativo" é autoavaliação, e cada pessoa
     se põe num degrau diferente — sobre um número que vai virar a meta de
     proteína dela.
     ============================================================ */
  atividades: {
    sedentario: 'Sedentário',
    sedentarioSub: 'Pouco ou nenhum exercício',
    leve: 'Levemente ativo',
    leveSub: '1 a 3 dias por semana',
    moderado: 'Moderadamente ativo',
    moderadoSub: '3 a 5 dias por semana',
    muito: 'Muito ativo',
    muitoSub: '6 a 7 dias por semana',
  },
};
