/* ============================================================
   O CADASTRO — dezenove perguntas, e a maior tela do aplicativo

   ⚠️⚠️ AS PERGUNTAS SE CONJUGAM. Quem ainda vai começar não tem nada no
   presente para responder: "qual medicamento você usa" obriga essa pessoa
   a traduzir a pergunta antes de respondê-la. Por isso medicamento,
   forma, dose, frequência e acompanhamento vêm em par — `agora` e
   `futuro` —, e um idioma que não distinga os dois tempos pode repetir a
   mesma frase nos dois campos sem perder nada.

   ⚠️ CADA SUBTÍTULO DIZ POR QUE PERGUNTAMOS, e isso não é enfeite: é a
   diferença entre um formulário e um interrogatório. Vale reler o da
   identidade antes de traduzi-lo — a justificativa é a VERDADEIRA, e não
   a vantajosa. Identidade de gênero não entra em conta nenhuma aqui; ela
   serve para falarmos com a pessoa do jeito certo, e o corpo vem nas
   perguntas seguintes. Prometer benefício que não existe é como se perde
   a confiança de quem parou para ler.

   ⚠️ E O SUBTÍTULO DO ACOMPANHAMENTO NÃO PODE SOAR COMO OFERTA. A versão
   anterior listava o que o aplicativo passa a fazer "com acompanhamento"
   — e lida de fora era um cardápio: responda sim e ganhe agenda, resumo e
   preparo de perguntas. Numa pergunta em que ninguém confere a resposta,
   isso é um convite a mentir para destravar a versão melhor; e quem mente
   ali recebe um aplicativo que passa a falar de consultas que não tem.
   A frase nomeia a NATUREZA do que a resposta liga, não a vantagem.
   ============================================================ */

export const cadastro = {
  /* ============================================================
     A ABERTURA
     ============================================================ */
  aberturaTitulo: 'A companhia na sua jornada de ',
  aberturaTituloForte: 'transformação',
  aberturaTexto: 'Mais do que acompanhar resultados, é entender a jornada por trás deles. Uma experiência inteligente que aprende com você e se adapta a cada etapa.',
  comecar: 'Começar',

  /* ⚠️ E ELA TEM SAÍDA PARA A VITRINE, para quem abriu o cadastro sem
     querer se cadastrar. */
  verPlanos: 'Ver planos',

  /* ============================================================
     OS TÍTULOS — a pergunta de cada passo
     ============================================================ */
  titulos: {
    nome: 'Como podemos te chamar?',
    identidade: 'Como você se identifica?',
    nascimento: 'Quando você nasceu?',
    tratamento: 'Você já está em tratamento?',
    inicio: 'Quando você começou?',
    medicamentoFuturo: 'Qual medicamento você pretende usar?',
    medicamentoAgora: 'Qual medicamento você usa?',
    formaFuturo: 'Como você vai aplicar?',
    formaAgora: 'Como você aplica?',
    doseFuturo: 'Com qual dose você pretende começar?',
    doseAgora: 'Qual é a sua dose atual?',
    frequenciaFuturo: 'De quanto em quanto tempo você vai aplicar?',
    frequenciaAgora: 'De quanto em quanto tempo você aplica?',
    corpo: 'Quais são suas medidas atuais?',
    meta: 'Qual é a sua meta de peso?',
    ritmo: 'Qual ritmo você quer seguir para chegar lá?',
    motivacao: 'O que está te levando a essa jornada?',
    atividade: 'Qual é o seu nível de atividade física?',
    restricao: 'Você tem alguma restrição alimentar?',
    saude: 'Conecte o seu aplicativo de saúde',
    acompanhamentoFuturo: 'Você pretende ter o acompanhamento de um especialista?',
    acompanhamentoAgora: 'Você possui o acompanhamento de um especialista?',
    consentimento: 'Informações importantes',
  },

  /* ============================================================
     OS SUBTÍTULOS — por que perguntamos
     ============================================================ */
  subs: {
    nome: 'Pode ser só o primeiro nome, ou o apelido que você gosta.',
    identidade: 'É para falarmos com você do jeito certo. O que entra nas contas de saúde é o seu corpo, e ele vem nas próximas perguntas.',
    nascimento: 'Cada fase da vida tem necessidades diferentes — e a idade entra nas faixas de referência dos seus exames.',
    tratamento: 'Só para saber onde você está agora.',
    inicio: 'Aproximado está bom. É daqui que sai a sua semana de tratamento, e é este peso que vira o começo da sua curva.',
    medicamento: 'É dele que saem a escada de doses e o intervalo entre as aplicações.',
    forma: 'Manipulado sai da farmácia dos dois jeitos, e o que muda é o que você tem na mão na hora de aplicar.',
    doseComEscada: (med: string) => `Na ordem da titulação do ${med}.`,
    /* Sem escada não há titulação a seguir: manipulado não tem degraus de
       bula, e quem define o número é a receita. */
    doseSemEscada: 'Manipulado não tem escada de bula — o número é o da sua receita.',
    /* ⚠️ O RECIPIENTE VEM CONCORDADO — "do frasco", "da caneta". Ver
       T.formas.doDa, em textos/pt-BR/formas.ts. */
    frequencia: (doDaForma: string) => `É daqui que saem a contagem do ciclo, os lembretes e o estoque ${doDaForma}.`,
    corpo: 'É com altura e peso que calculamos o seu IMC e montamos as suas metas diárias de proteína e água.',
    meta: 'É a referência que usamos para mostrar o quanto você já andou. Dá para mudar quando quiser.',
    ritmo: (aPercorrer: string) => `${aPercorrer} a percorrer.`,
    motivacao: 'Não existe resposta certa. Vale a que você lembraria num dia difícil.',
    restricao: 'Proteína é o eixo deste tratamento, e ela vem de lugares diferentes conforme o que você come. Pode marcar mais de uma.',
    atividade: 'Entra na sua meta diária de água — quem se mexe mais perde mais líquido — e diz de onde você está partindo.',
    saude: 'Os seus dados de saúde ajudam a entender a sua evolução — sem você precisar registrar tudo.',
    acompanhamento: 'Essa resposta habilita funcionalidades ligadas ao acompanhamento médico, como anotações e planejamento para consultas.',
    consentimento: 'Duas coisas antes de começar: o que fazemos pelo seu tratamento, e o que acontece com o que você registra.',
  },

  /* ============================================================
     AS RESPOSTAS
     ============================================================ */
  seuNome: 'Seu nome',

  /* ⚠️ "OUTRO" E "PREFIRO NÃO INFORMAR" NÃO SÃO A MESMA RESPOSTA: uma
     diz quem a pessoa é, a outra diz que ela não quer dizer. Juntar as
     duas obrigaria quem só quer privacidade a se declarar. */
  feminino: 'Feminino',
  masculino: 'Masculino',
  outro: 'Outro',
  prefiroNaoInformar: 'Prefiro não informar',

  jaIniciei: 'Já iniciei o tratamento',
  jaInicieiSub: 'Já apliquei pelo menos uma dose',
  vouComecar: 'Vou começar em breve',
  vouComecarSub: 'Ainda não apliquei',

  /* ⚠️ "AINDA NÃO SEI" APARECE DUAS VEZES, com subtítulos diferentes —
     uma no medicamento e outra na dose. O rótulo é o mesmo porque a
     hesitação é a mesma; o que muda é o que a gente responde a ela. */
  aindaNaoSei: 'Ainda não sei',
  aindaNaoSeiMedSub: 'Você pode definir depois no seu perfil',
  aindaNaoSeiDoseSub: 'Quase todo mundo começa pela menor',

  /* ⚠️ "AQUI" É O PAÍS QUE A PESSOA RESPONDEU, e não onde ela está. A
     lista de baixo não é de medicamento proibido nem de medicamento pior
     — é só o que circula menos naquele lugar. */
  menosComumAqui: 'MENOS COMUM AQUI',
  manipuladoSub: 'Preparada em farmácia de manipulação',
  formaSeringaSub: 'Você aspira a dose com uma seringa',
  formaCanetaSub: 'Já vem preenchida, pronta para aplicar',

  doseDeInicio: 'Dose de início',
  doseMaxima: 'Dose máxima',

  todosOsDias: 'Todos os dias',
  aCadaDias: (d: number) => `A cada ${d} dias`,
  padrao: 'Padrão',
  outroIntervaloTitulo: 'Outro intervalo',
  outroIntervalo: 'Você diz de quantos em quantos dias',

  pesoDeHoje: 'PESO DE HOJE',
  pesoDeQuandoComecou: 'PESO DE QUANDO COMEÇOU',
  querPerder: 'Você quer perder',
  querGanhar: 'Você quer ganhar',

  /* ⚠️ NENHUM RITMO PROMETE NADA, e é por isso que os nomes são de RITMO
     e não de resultado. O que a literatura descreve como perda sustentada
     fica por volta de 0,5 a 1 kg por semana; acima disso a conta é do
     corpo e da dose, não da vontade. */
  ritmoDevagar: 'Devagar e sempre',
  ritmoConstante: 'Ritmo constante',
  ritmoAcelerado: 'Acelerado',
  ritmoMaisRapido: 'O mais rápido que der',
  ritmoPorSemana: (peso: string) => `${peso} por semana`,
  ritmoAlcanca: (metaProsa: string, mes: string) => `Alcança os ${metaProsa} em ${mes}`,

  semRestricao: 'Nenhuma',
  semRestricaoSub: 'Como de tudo',

  /* ============================================================
     O PASSO DA SAÚDE

     ⚠️ ELE TEM MANCHETE PRÓPRIA, e não a pergunta seca dos outros: é o
     único do formulário que pede uma AUTORIZAÇÃO em vez de uma resposta,
     e o que decide alguém a autorizar não é saber o que queremos — é
     saber o que ela ganha. O fecho carrega a promessa.
     ============================================================ */
  saudeManchete: 'Tudo o que seu corpo mostra, <b>em um só lugar</b>',
  saudeLembrarTitulo: 'Menos uma coisa para lembrar',
  saudeLembrarTexto: 'Peso, sono e treino entram sozinhos.',
  saudeCurvaTitulo: 'A sua curva mais completa',
  saudeCurvaTexto: 'O que o aparelho mede já entra aqui.',
  saudeControleTitulo: 'Você continua no controle',
  saudeControleTexto: 'Escolha o que liberar, e desligue quando quiser.',
  saudeConectar: 'Conectar meus dados',
  /* ⚠️ "FAZER ISSO DEPOIS", e não "agora não". A recusa que fecha a porta
     é mais fácil de dar do que a que adia — e aqui ela adia mesmo: a tela
     de Integrações continua no perfil. */
  saudeDepois: 'Fazer isso depois',

  /* ============================================================
     O ACOMPANHAMENTO
     ============================================================ */
  sim: 'Sim',
  digiteONome: 'Digite o nome',
  nadaEnviado: 'Serve para referenciar o especialista ao longo da sua jornada. Nada é enviado a essa pessoa.',
  vouMeTratar: 'Vou me tratar com um médico ou clínica',
  meAcompanha: 'Um médico ou clínica acompanha o meu tratamento',
  porContaPropria: 'Não, por conta própria',
  porContaPropriaSub: 'Dá para adicionar depois, quando quiser',
  quemVaiAcompanhar: 'QUEM VAI ACOMPANHAR VOCÊ (OPCIONAL)',
  quemAcompanha: 'QUEM ACOMPANHA VOCÊ (OPCIONAL)',

  /* ============================================================
     O CONSENTIMENTO

     ⚠️ O RÓTULO DIZ O QUE O TOQUE SIGNIFICA. "Continuar" seria a pessoa
     consentindo sem saber que consentiu — e consentimento para dado de
     saúde precisa ser um ato claro, não o efeito colateral de avançar uma
     tela.
     ============================================================ */
  concordarEMontar: 'Concordar e montar meu plano',
  ficaRegistrado: 'Fica registrado com a data de hoje.',
  salvar: 'Salvar',
  continuar: 'Continuar',

  /* ============================================================
     A ESPERA

     ⚠️ AS TRÊS FRASES DIZEM O QUE ESTÁ SENDO FEITO, na ordem em que é
     feito. A barra anda sozinha e não finge progresso real: ela mede o
     tempo da espera, que é o único número honesto que existe aqui.
     ============================================================ */
  montandoTitulo: 'Montando o seu plano',
  faseLendo: 'Lendo as suas respostas',
  faseCalculando: 'Calculando as suas metas do dia',
  faseDesenhando: 'Desenhando a sua jornada',

  /* ============================================================
     O PLANO — o que as respostas viraram

     Mora em dois lugares e é o mesmo componente nos dois: no fim do
     cadastro, como devolutiva de quem acabou de responder quinze
     perguntas, e em /plano, para quem quiser rever. Por isso o texto
     dele mora aqui, no catálogo do cadastro.

     ⚠️⚠️ `objetivo` DEVOLVE TRÊS PEDAÇOS, e não uma frase. A tela põe o
     do meio em negrito — é o número que a pessoa veio buscar — e, se a
     frase viesse pronta, o negrito teria de cair sempre no mesmo lugar.
     Não cai: o português diz "Para perder <b>7 kg</b> com o Mounjaro®" e
     o alemão diz "Um <b>7 kg</b> abzunehmen mit Mounjaro®", com o verbo
     no fim. Cada idioma decide o que vem antes e o que vem depois.

     ⚠️ O ® SÓ ONDE ELE É VERDADE. Manipulado é categoria, não produto:
     "com o Semaglutida manipulada®" seria o aplicativo afirmando uma
     marca registrada que não existe.

     ⚠️ E NENHUM NÚMERO DAQUI É PROMESSA. A ressalva da curva diz isso por
     escrito, e é a frase que não pode amaciar na tradução: o traço é a
     média do caminho, não uma previsão do que vai acontecer com esta
     pessoa.
     ============================================================ */
  telaPlano: {
    /* ---------- a abertura ---------- */
    planoPronto: 'o seu plano personalizado está pronto!',
    manterOPeso: 'manter o seu peso',
    objetivo: (perder: number, alvo: string, marca: string): [string, string, string] => [
      `Para ${perder > 0.05 ? 'perder ' : perder < -0.05 ? 'ganhar ' : ''}`,
      alvo,
      `${marca}.`,
    ],
    marcaRegistrada: (medicamento: string) => ` com o ${medicamento}®`,
    marcaGenerica: (medicamento: string) => ` com ${medicamento}`,
    elaboradoPensando: 'O seu plano foi elaborado pensando',
    nasSuasRespostas: 'Nas suas respostas',
    emEstudos: 'Em estudos sobre GLP-1',

    /* ---------- as seções ---------- */
    secaoMetas: 'AS SUAS METAS DO DIA',
    secaoDose: 'A SUA DOSE',
    secaoAteAMeta: 'ATÉ A SUA META',
    secaoCorpo: 'O SEU CORPO',
    secaoAjuda: 'COMO EU TE AJUDO',
    secaoCiencia: 'A CIÊNCIA POR TRÁS DO SEU PLANO',

    /* ---------- as metas do dia ----------

       ⚠️ DIZIA "A CANETA TIRA A FOME", e nem todo mundo aplica com caneta:
       há frasco, seringa e cartela. A frase não precisa do recipiente
       para dizer o que diz. */
    proteinaPorDia: 'PROTEÍNA POR DIA',
    proteinaTexto: 'É a primeira meta do dia. O medicamento tira a fome, e parte do peso que desce vem de músculo — a proteína é o que segura a massa magra enquanto a gordura vai embora.',
    calorias: 'Calorias',
    /* Os outros três macros vêm de `alimentacao.tela`, onde já estavam. A
       água fica aqui: em `alimentacao` ela é NOME DE BEBIDA, que é chave
       de registro, e rótulo de tela não se pendura numa chave gravada. */
    agua: 'Água',

    /* ---------- a dose ---------- */
    aindaADefinir: 'Ainda a definir',
    aindaADefinirTexto: 'Quando você souber o medicamento, eu monto a escada de doses e o ciclo.',
    cicloComeca: 'O ciclo começa na primeira aplicação que você registrar.',
    cadenciaDiaria: 'todos os dias',
    cadenciaSemanal: 'uma vez por semana',
    cadenciaDias: (dias: number) => `a cada ${dias} dias`,

    /* ---------- até a meta ---------- */
    pesoAPerder: 'Peso a perder',
    pesoAGanhar: 'Peso a ganhar',
    emSemanas: (semanas: number) => `em ${semanas} semanas`,
    ressalvaDaCurva: (ritmo: string) =>
      `A queda não é reta: nos estudos, as primeiras semanas rendem mais e o ritmo afrouxa conforme o corpo se ajusta. Os ${ritmo} por semana que você escolheu são a média do caminho, não uma previsão.`,

    /* ---------- o corpo ---------- */
    imcDeHoje: 'IMC de hoje',
    naSuaMeta: 'Na sua meta',

    /* ---------- como eu te ajudo ---------- */
    ajudaDose: 'Cada dose no lugar certo',
    ajudaDoseSub: 'o rodízio dos locais e o ciclo da dose, sem você contar',
    ajudaEnjoo: 'O enjoo em números',
    ajudaEnjooSub: 'o que você sente vira padrão, e o padrão vai para a consulta',
    ajudaPeso: 'A sua curva de peso',
    ajudaPesoSub: 'cada pesagem entra na linha, com a leitura do que mudou',
    ajudaResumo: 'Um resumo para a consulta',
    ajudaResumoSub: 'doses, sintomas e peso organizados numa página só',

    /* ---------- a ciência ---------- */
    feitoEmCimaDeEvidencia: 'Feito em cima de evidência',
    evidenciaTexto: 'As metas, a curva e as prioridades deste plano seguem diretrizes de saúde pública e ensaios clínicos revisados por pares.',
    /* ⚠️ A DIVISÃO DE TRABALHO, e não isenção de responsabilidade no
       rodapé: quem conduz o tratamento é a equipe de saúde, e estes
       números são ponto de partida para essa conversa. */
    rodape: 'A gente acompanha a sua jornada todos os dias e organiza o que você registra — mas quem conduz o tratamento é a sua equipe de saúde. Estes números são ponto de partida para essa conversa, e não prescrição.',

    voltar: 'Voltar',
  },
};
