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

  /* ============================================================
     A TELA DO EXERCÍCIO

     ⚠️⚠️ A DURAÇÃO É REGRA DE IDIOMA, e estava escrita em duro na tela.
     "6 h 20" em vez de "380 min": acima de uma hora, minuto puro obriga a
     pessoa a dividir de cabeça para saber se aquilo é muito.

     E cada língua escreve a hora do seu jeito — "6 h 20", "6 hr 20",
     "6 Std. 20". Deixar a função na tela obrigava as cinco a usarem a
     abreviação portuguesa.
     ============================================================ */
  telaExercicio: {
    titulo: 'Exercício',
    /* ⚠️ 'min' É SÍMBOLO E FICARIA NO CÓDIGO pela regra do alto deste
       arquivo — mas o alemão escreve 'Min.' na prosa, e as outras chaves
       daqui já escrevem assim. Duas grafias do mesmo minuto na mesma tela
       é o tipo de coisa que ninguém nota escrevendo e todo mundo nota
       lendo. */
    unidadeMin: 'min',
    duracao: (min: number) => {
      if (min < 60) return `${min} min`;
      const h = Math.floor(min / 60);
      const m = min % 60;
      return m ? `${h} h ${m}` : `${h} h`;
    },

    /* A capa: o dia, e a semana logo atrás dele. O número de hoje SOZINHO
       transforma descanso em falha — por isso os dois vêm na mesma
       linha. */
    hojeSemTreino: (daSemana: number) => `Hoje: sem treino ainda · ${daSemana} min nesta semana`,
    hojeComTreino: (hoje: number, alvo: number, resto: string) => `Hoje: ${hoje} de ${alvo} min · ${resto}`,
    metaAlcancada: 'meta alcançada',
    faltamMin: (falta: number) => `faltam ${falta} min`,
    registrarTreino: 'Registrar um treino',

    /* A semana */
    movimentoTitulo: 'O seu movimento',
    estaSemana: 'Esta semana',
    nenhumDiaComMovimento: 'Nenhum dia com movimento',
    emDiasDosSete: (dias: number) => `Em ${dias} ${dias === 1 ? 'dia' : 'dias'} dos sete`,
    metaMin: (alvo: number) => `Meta: ${alvo} min`,

    /* ⚠️ A LINHA DA FORÇA RELATA, NÃO COBRA. Em déficit calórico quem só
       faz cardio perde massa magra junto com a gordura, e massa magra é
       o que o aplicativo passa o dia tentando segurar. A frase diz
       quantos dias houve, e para. */
    semForca: 'Nenhum treino de força nesta semana. Musculação, pilates e funcional são o que segura o músculo.',
    comForca: (dias: number) => `${dias} ${dias === 1 ? 'dia' : 'dias'} com treino de força — é o que segura o músculo enquanto o peso cai.`,

    minutosPorSemana: 'Minutos por semana',
    mediaOitoSemanas: 'Média das últimas 8 semanas',
    semanaDe: (data: string) => `semana de ${data}`,

    /* O período */
    periodo7: '7 dias',
    periodo30: '30 dias',
    periodo90: '3 meses',
    noPeriodo: 'No período',
    noPeriodoNota: 'Só o que foi registrado aqui — o que vem do relógio não tem modalidade.',
    treinos: 'Treinos',
    tempo: 'Tempo',
    maisLongo: 'Mais longo',
    deForca: 'De força',

    /* O diário */
    diarioTitulo: 'Diário de treino',
    diarioNota: 'Toque num treino para ver, corrigir ou apagar.',
    diaVazioTitulo: 'Nenhum treino neste dia',
    /* "Descanso também faz parte" — e não "registre um treino": um dia
       sem treino num tratamento não é uma pendência. */
    diaVazioTexto: 'Descanso também faz parte.',

    integracoes: 'Integrações',
    conectar: 'Conectar um relógio ou aplicativo',
    lancamSozinhos: 'Lançam os minutos sozinhos',
    conectarSub: 'Apple Saúde, Health Connect, Garmin e outros',
  },

  /* ============================================================
     A TELA DAS APLICAÇÕES
     ============================================================ */
  telaAplicacoes: {
    aplicada: 'aplicada',
    /* ⚠️ "SEM CULPA POR UM DIA QUE PASSOU" É A FRASE INTEIRA, e ela é o
       motivo de a grade não ter vermelho: quem perdeu uma dose quase
       sempre perdeu porque passou mal, e uma casa vermelha num calendário
       de medicamento é o aplicativo cobrando de quem já pagou. */
    semCulpa: 'Sem culpa por um dia que passou — o que conta é retomar. Dá para registrar uma aplicação anterior a qualquer momento, no botão lá embaixo.',
    titulo: 'Aplicações',
    registrar: 'Registrar aplicação',
    /* Os três chegam prontos: a marca, o princípio ativo e a cadência. */
    lead: (med: string, molecula: string, cadencia: string) => `${med} · ${molecula} · ${cadencia}`,

    proximaAplicacao: 'PRÓXIMA APLICAÇÃO',

    cicloDaDose: 'Ciclo da dose',
    cicloSub: (dia: number, total: number, fase: string) => `Dia ${dia} de ${total} · ${fase.toLowerCase()}`,
    emCurso: 'em curso',

    /* O recipiente chega concordado e com maiúscula — "Caneta", "Frasco". */
    eReceita: (recipiente: string) => `${recipiente} e receita`,
    dosesUsadas: (usadas: number, total: number, onde: string) => `${usadas} de ${total} doses usadas ${onde}`,
    cobreSemanas: (veredito: string, semanas: number) =>
      `${veredito} — cobre cerca de ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,

    alertasDeDose: (quantos: number) => `${quantos} ${quantos === 1 ? 'alerta' : 'alertas'} de aplicação`,
    nenhumAlerta: 'Nenhum alerta de aplicação',
    tocaEm: (quando: string) => `Toca ${quando}`,
    avisoAntes: 'Um aviso antes da dose, na hora que você escolher',

    /* ⚠️ O RODÍZIO NÃO É ENFEITE: repetir o mesmo ponto causa nódulo, e
       alternar é orientação de bula. As três frases dizem por que aquele
       local é a vez — e a do meio é a que existe para o caso em que a
       rotação e o descanso discordam. */
    rodizioTitulo: 'Rodízio dos locais',
    naoUsado: 'Ainda não usado — é a vez dele.',
    proximoDaRotacao: 'É o próximo da rotação, mesmo tendo sido usado esta semana.',
    descansandoHa: (semanas: number) =>
      `Descansando há ${semanas} ${semanas === 1 ? 'semana' : 'semanas'} — é a vez dele.`,
    usadoHaPouco: 'usado há pouco',
    oProximo: 'o próximo',
    proxima: 'próxima',

    /* ⚠️ "CONSTÂNCIA", E A NOTA É UMA FRAÇÃO E NÃO UMA PORCENTAGEM. Era
       "88% em dia" — e "em dia" fala de PONTUALIDADE, que esta conta não
       mede: quem aplicou as dez doses sempre com três dias de atraso
       também dava 100%. */
    constancia: 'Constância',
    constanciaNota: (feitas: number, previstas: number) =>
      `${feitas} de ${previstas} doses previstas desde o começo do tratamento.`,

    nivelNoCorpo: 'Nível no corpo',
    nivelTexto: (molecula: string, meiaVida: string) =>
      `Estimativa de ${molecula} no corpo, com meia-vida de ${meiaVida}. O ponto mais baixo, antes da próxima dose, costuma ser quando a fome aumenta.`,
    meiaVidaDias: (dias: number) => `${dias} dias`,
    meiaVidaHoras: 'cerca de 13 horas',

    historico: 'Histórico',
    proximaEmLocal: (local: string) => `Próxima · ${local}`,
  },

  /* ============================================================
     A TELA DO RECIPIENTE E DA RECEITA

     Duas contagens diferentes moram nela, e confundi-las é o erro
     clássico deste tipo de tela: quantas doses ainda cabem no
     dispositivo, e quantos dias ele dura depois de aberto. Um recipiente
     pode ter dose sobrando e estar vencido.

     ⚠️⚠️ AS PALAVRAS QUE CONCORDAM VÊM DAQUI, E NÃO DA TELA. O código
     chamava `concordar(forma, 'aberto', 'aberta')` — as duas grafias
     ESCRITAS NO SÍTIO DE CHAMADA, em português. Em alemão isso devolvia
     "aberto" ou "aberta", que é português dos dois jeitos.

     `concordar` continua fazendo o seu trabalho; o que mudou é de onde
     saem os dois candidatos. Onde o idioma não flexiona — inglês,
     alemão predicativo —, os dois são a mesma palavra, e é por isso que
     `concordar` em inglês devolve o primeiro argumento sem olhar.

     ⚠️ E "ENCERRADA" ESTAVA NO FEMININO FIXO, concordando com "caneta"
     numa lista que também mostra frasco e blíster. Virou par.
     ============================================================ */
  telaCaneta: {
    /* As duas grafias de cada palavra que concorda. A tela junta com
       `concordar`, que é quem sabe o gênero do recipiente. */
    abertoM: 'aberto',
    abertoF: 'aberta',
    nenhumM: 'Nenhum',
    nenhumF: 'Nenhuma',
    desteM: 'deste',
    desteF: 'desta',
    novoM: 'Novo',
    novoF: 'Nova',
    encerradoM: 'encerrado',
    encerradoF: 'encerrada',

    nova: 'Nova',
    lembrarRenovar: 'Lembrar de renovar',
    tituloDose: (medicamento: string, dose: string, unidade: string) =>
      `${medicamento} ${dose} ${unidade}`,

    leadAberto: (Recipiente: string, aberto: string, data: string, total: number, recipiente: string) =>
      `${Recipiente} ${aberto} em ${data} · ${total} doses por ${recipiente}`,
    leadSemAberto: (nenhum: string, recipiente: string, aberto: string, total: number) =>
      `${nenhum} ${recipiente} ${aberto} · ${total} doses por ${recipiente}`,

    dosesUsadas: 'Doses usadas',
    usadasDe: (usadas: number, total: number) => `${usadas} de ${total}`,
    ultimaDose: (deste: string, recipiente: string, data: string) =>
      `Última dose ${deste} ${recipiente}: ${data}`,

    /* ⚠️ "NÃO INFORMADA" É UM ESTADO, e não um vazio: manipulado não tem
       prazo de bula, e "0 dias" seria o aplicativo afirmando que a coisa
       venceu no dia em que foi aberta. */
    validadeApos: (aberto: string) => `Validade após ${aberto}`,
    validadeDias: (dias: number) => `${dias} dias`,
    validadeNaoInformada: 'não informada',
    venceEm: (data: string) => `vence ${data}`,
    quemPreparaDefine: 'quem prepara define o prazo',

    receitaAtual: 'Receita atual',
    receitaSemanas: (semanas: number) => `${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,
    receitaCobreAte: (data: string) => `cobre até ${data}`,

    /* O recipiente pode vencer antes de a última dose sair dele — com 14
       dias de validade e quatro doses semanais isso é a regra, não a
       exceção. O aviso constata e para por aí: o que fazer com a dose que
       sobra é conversa de médico. */
    venceAntes: (oRecipiente: string) => `${oRecipiente} vence antes de acabar`,
    venceAntesTexto: (medicamento: string, dias: number, total: number, aberto: string) =>
      `${medicamento} dura ${dias} dias depois de ${aberto}, e nesse prazo não cabem as ${total} doses. Vale confirmar com quem acompanha você o que fazer com o que sobrar.`,

    momentoDeRenovar: 'Momento de pedir a renovação',
    renovarTexto: (semanas: number, oRecipiente: string, _recipiente: string) =>
      `Sua receita cobre cerca de ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}. Pedir agora evita ficar sem ${oRecipiente} entre uma consulta e outra.`,

    historico: (plural: string) => `Histórico de ${plural}`,
    emUso: 'em uso',
    itemEmUso: (Aberto: string, data: string, usadas: number, total: number) =>
      `${Aberto} em ${data} · ${usadas} de ${total} doses`,
    itemEncerrado: (periodo: string, usadas: number, total: number) =>
      `${periodo} · ${usadas} de ${total} doses`,
  },
};
