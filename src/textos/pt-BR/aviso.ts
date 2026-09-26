/* ============================================================
   O CONSENTIMENTO E O RESTO — a isenção, os avisos de dado e as sobras

   ⚠️⚠️ A ISENÇÃO ABRE O ÚLTIMO PASSO DO CADASTRO, E TEM CHAVE PRÓPRIA. O
   resto do aviso é sobre DADO — o que fica guardado, o que sai daqui.
   Ela é sobre o TRATAMENTO, e é a única coisa do cadastro que alguém pode
   entender errado de um jeito que faz mal: achar que o aplicativo sabe se
   a dose está certa.

   ⚠️ E ELA NÃO DIMINUI O APLICATIVO PARA SE PROTEGER. "Isto não é um
   aplicativo médico" é verdade e é covarde: quem está lendo acabou de
   responder treze perguntas sobre o próprio tratamento, e merece saber o
   que ganha, não só o que não ganha. A frase diz as duas coisas, nessa
   ordem — o que fazemos, e onde paramos.

   ⚠️ E ELA NÃO PRESSUPÕE EQUIPE (26/09/2026, pedido do dono). Falava em
   "a sua equipe" e em "a próxima consulta", e quem tinha acabado de
   responder que não tem acompanhamento lia uma promessa vazia: preparar
   uma consulta que não existe, falar com uma equipe que não há. Agora ela
   diz o que vale para qualquer pessoa — não substituímos o acompanhamento
   médico, e sintoma grave e mudança de dose pedem um profissional. A irmã
   dela na Ajuda ("O Morphi substitui o acompanhamento médico?") mudou
   junto.
   ============================================================ */

export const aviso = {
  isencaoTitulo: 'Não substituímos o acompanhamento médico',
  isencaoTexto: 'Organizamos o que você registra e mostramos padrões nos seus próprios dados. Não fazemos diagnóstico nem prescrição, e nada do que aparece aqui substitui a orientação de um profissional de saúde.',
  isencaoReforco: 'Em caso de sintoma grave, procure atendimento médico. Mudança de dose ou de medicação, só com orientação profissional.',

  /* Os quatro cartões de dado, na ordem em que a dúvida aparece.

     ⚠️ A VERSÃO 2 (fase 8 do plano do Supabase). A primeira dizia que tudo
     ficava no telefone, sem conta nem senha, e era verdade até a conta
     existir. `VERSAO`, em logic/consentimento, subiu junto. */
  guardadoTitulo: 'Guardado na sua conta',
  guardadoTexto: 'Neste telefone e no nosso banco, em São Paulo. Só a sua conta lê o que é seu.',

  usoTitulo: 'Usado no seu acompanhamento',
  usoTexto: 'Para as metas, a evolução e o que levar à consulta. Não é diagnóstico.',

  /* ⚠️ A PARTE QUE UM AVISO DE CONSENTIMENTO COSTUMA CALAR, e que aqui é
     a única que muda o que a pessoa decide. */
  saiTitulo: 'Só sai com um gesto seu',
  saiTexto: 'Para a clínica que você conectar pelo código dela, e a foto do prato, quando você pedir a leitura.',

  controleTitulo: 'Você no controle',
  controleTexto: 'Corrija, exporte ou apague os seus dados quando quiser.',

  /* a frase que faz do Continuar do último passo do cadastro um aceite (ui/consentimento) */
  termosDeUso: 'Termos de Uso',
  politicaDePrivacidade: 'Política de Privacidade',
  aceiteAntes: 'Ao tocar em Continuar, você concorda com o que está acima, com os ',
  aceiteEntre: ' e com a ',
  aceiteDepois: '.',

  /* ⚠️ A ESCOLHA DAS PERGUNTAS É PRÓPRIA, E VEM DESLIGADA (a decisão 2 do
     plano). É uma finalidade nova, sobre texto de saúde, e a conta é
     obrigatória: embutida no aceite geral, ela viraria condição para usar
     o diário. Recusar não muda nada.

     ⚠️⚠️ ESTAS QUATRO ESTÃO PARADAS: a leitura das perguntas foi desligada
     pelo dono (`LEITURA_DAS_PERGUNTAS`, em logic/consentimento), e
     nenhuma tela as mostra. Ficam aqui para a escolha voltar pronta. */
  perguntasTitulo: 'As suas perguntas ao Morphi',
  perguntasTexto: 'Se você deixar, lemos as perguntas que você faz ao Morphi para entender as dúvidas que aparecem e melhorar as respostas. Lemos sem saber quem perguntou, e a clínica nunca lê. Vem desligado, e recusar não muda nada no aplicativo.',
  perguntasEscolha: 'Permitir a leitura das minhas perguntas',
  perguntasDetalhe: 'Ligar leva também as perguntas que já estão aqui. Dá para desligar quando quiser, em Privacidade e dados, e aí as que foram são apagadas.',

  /* ============================================================
     O CONSENTIMENTO NOVO, para quem aceitou a versão anterior

     ⚠️ A FOLHA VOLTA EM TODA ABERTURA ATÉ SER ACEITA (a tranca 2 do
     portão, em app/_layout). Quem aceitou a versão 1 concordou com outro
     tratamento, e não pode ter o diário subindo por um texto que não leu.
     E quem não concorda não fica preso: leva os dados num arquivo e apaga
     o aparelho, como os Termos prometem — nada é apagado sem pedido.
     ============================================================ */
  consentimentoNovo: {
    titulo: 'Mudamos como guardamos o seu diário',
    lead: 'Agora ele fica também na sua conta, no nosso banco, para não se perder quando você troca de aparelho. Antes de continuar, leia o que mudou.',
    aceitar: 'Concordar e continuar',
    recusar: 'Não concordo',
    recusaTitulo: 'Sem concordar, não dá para seguir',
    recusaTexto: 'O aplicativo agora guarda o diário na sua conta, e não funciona sem ela. Se não concordar, você pode levar os seus dados num arquivo e apagar tudo deste aparelho. Nada é apagado sem você pedir.',
    exportar: 'Exportar os meus dados',
    apagar: 'Apagar meus dados deste aparelho',
    apagarPergunta: 'Apagar tudo deste aparelho? Não dá para desfazer.',
    apagarConfirma: 'Apagar',
    voltar: 'Voltar e ler de novo',
  },

  /* ============================================================
     AS INTEGRAÇÕES — o que cada depósito traz

     ⚠️ SÓ O NOME DA APPLE MUDA DE IDIOMA. "Apple Saúde" é "Apple Health"
     em inglês porque é a Apple que traduz o nome do próprio aplicativo.
     Health Connect, Garmin, Fitbit e Withings são marcas e ficam no
     código: marca não se traduz.
     ============================================================ */
  appleSaude: 'Apple Saúde',
  trazPesagens: 'As suas pesagens — inclusive as que a sua balança manda para lá.',
  trazTreinos: 'Treinos e frequência cardíaca',
  trazSono: 'Sono e passos',
  trazBalanca: 'Balança e pressão',

  /* ============================================================
     A LEITURA POR FOTO, quando ela não acontece

     ⚠️ AS TRÊS TERMINAM OFERECENDO O CAMINHO MANUAL, e é o que as separa
     de uma mensagem de erro: a pessoa fotografou o prato porque quer
     registrar, e dizer só "não deu" a deixa no meio do caminho.
     ============================================================ */
  fotoSemServidor: 'A leitura por foto ainda não está ligada. Dá para montar o prato aqui embaixo.',
  fotoSemRede: 'Sem conexão para ler a foto agora. Dá para montar o prato aqui embaixo.',
  fotoNaoReconheci: 'Não consegui reconhecer o prato. Monte aqui embaixo o que tinha.',

  /* ============================================================
     A ASSINATURA e a exportação
     ============================================================ */
  porMes: 'por mês',
  porMesCurto: '/mês',

  /* ⚠️ O AVISO DO ARQUIVO EXPORTADO É O MESMO DO RESUMO, e pela mesma
     razão: quem abrir este JSON precisa saber que são registros da
     própria pessoa, e não prontuário. */
  exportacaoAviso: 'Registros feitos pela própria pessoa no aplicativo. Não é prontuário nem laudo.',
  exportacaoTitulo: 'Seus dados do Morphi',
  /* vai dentro do arquivo, quando as perguntas não puderam vir da conta */
  exportacaoPerguntasRecentes: 'Sem conexão, vieram só as perguntas recentes deste aparelho. Com conexão, o arquivo traz todas as da sua conta.',

  /* O medicamento de quem ainda não respondeu. */
  medIndefinido: 'Ainda não definido',

  /* O recipiente maior da água, que não cabia na lista de bebidas. */
  garrafao: 'Garrafão',

  /* ============================================================
     AS MODALIDADES DE EXERCÍCIO

     ⚠️ OS NOMES SÃO CHAVE E RÓTULO AO MESMO TEMPO — é o `tipo` que fica
     gravado em cada treino. Mesma família do momento da refeição e do
     marcador de exame: traduzir não quebra registro novo, e registro
     antigo aparece com o nome que foi gravado.
     ============================================================ */
  modalidades: {
    caminhada: 'Caminhada',
    corrida: 'Corrida',
    musculacao: 'Musculação',
    bike: 'Bike',
    natacao: 'Natação',
    yoga: 'Yoga',
    pilates: 'Pilates',
    funcional: 'Funcional',
    alongamento: 'Alongamento',
    outro: 'Outro',
  },

  /* ============================================================
     A TELA DE EXPORTAR

     ⚠️ CADA LINHA DE "O QUE ENTRA" É UM INTERRUPTOR, e o subtítulo dela
     conta o que existe para entrar. Por isso toda contagem é função: quem
     nunca registrou exame lê "0 resultados", que é a verdade, e não uma
     linha muda.

     ⚠️⚠️ E "COLETAS" VIROU "RESULTADOS". A conta soma os VALORES de cada
     marcador — três datas de HbA1c são três valores —, e chamar isso de
     coleta anunciava um número de coletas que nunca houve. A conta estava
     certa; a palavra é que não estava.
     ============================================================ */
  telaExportar: {
    titulo: 'Exportar',
    lead: 'Um arquivo com os seus registros, para guardar ou levar para outro lugar.',

    periodo: 'Período',
    periodoAjuda: (de: string, ate: string, semanas: number) =>
      `De ${de} a ${ate} · ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,
    ultimas4: 'Últimas 4 semanas',
    desdeAConsulta: 'Desde a última consulta',
    tratamentoInteiro: 'Tratamento inteiro',

    oQueEntra: 'O que entra',
    oQueEntraNota: 'Toque para incluir ou tirar. O que ficar de fora não entra no arquivo.',
    incluido: 'incluído',
    fora: 'fora',

    aplicacoes: 'Aplicações',
    aplicacoesSub: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'registro' : 'registros'} · data, dose e local`,
    pesoEMedidas: 'Peso e medidas',
    pesoEMedidasSub: (pesagens: number, medidas: number) =>
      `${pesagens} ${pesagens === 1 ? 'pesagem' : 'pesagens'} · ${medidas} ${medidas === 1 ? 'medida' : 'medidas'}`,
    checkins: 'Check-ins',
    checkinsSub: (dias: number) => `${dias} ${dias === 1 ? 'dia' : 'dias'} · sintoma a sintoma`,
    exames: 'Exames',
    examesSub: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'resultado' : 'resultados'} · valor e referência`,
    notas: 'Notas para a consulta',
    notasSub: (quantas: number) => `${quantas} ${quantas === 1 ? 'anotação' : 'anotações'}`,
    habitos: 'Refeições, água e exercício',
    habitosSub: (refeicoes: number) =>
      `${refeicoes} ${refeicoes === 1 ? 'refeição' : 'refeições'} e o diário do dia`,
    /* ⚠️ A PORTABILIDADE É DO QUE A CONTA GUARDA, E NÃO DO QUE A TELA
       RESUME (fase 8). As linhas de cima são a leitura para gente; esta é
       a cópia inteira, com todo tipo de registro, o perfil e as
       perguntas — e não obedece ao período, porque recortar a própria
       cópia não é levar os dados embora. */
    completo: 'O diário completo',
    completoSub: 'Tudo o que a sua conta guarda, sem recorte de período, com as suas perguntas',

    formatoTitulo: 'Sai um arquivo .json',
    formatoTexto: 'É o formato que outro aplicativo consegue abrir e ler — serve para guardar uma cópia ou levar os registros para outro lugar. Para a versão feita para alguém ler, use o resumo para consulta.',

    gerar: 'Gerar o arquivo',
    gerando: 'Gerando...',
    verResumo: 'Ver o resumo para a consulta',

    pronto: 'Arquivo gerado. Ele só vai para onde você escolher.',
    erro: 'Não deu para gerar o arquivo neste aparelho. Os seus registros continuam aqui, intactos.',
    parado: 'O arquivo só é montado quando você toca no botão.',
  },

  /* ============================================================
     A TELA DE PRIVACIDADE E DADOS

     ⚠️⚠️ AQUI NENHUMA FRASE PODE ESTAR ERRADA PARA O LADO CONFORTÁVEL.
     É a tela em que a pessoa vai conferir o que sai do aparelho dela, e
     um erro "seguro" — prometer mais saída do que existe — faz alguém
     deixar de registrar um sintoma por achar que ele já foi para alguém.

     ⚠️ A VERSÃO 2 DESCREVE A CONTA (fase 8 do plano do Supabase). A
     primeira descrevia um aplicativo sem conta, sem servidor e sem cópia,
     e era verdade até a nuvem ser ligada; as seis versões mudaram juntas.

     ⚠️ ELA NÃO É A POLÍTICA. Documento jurídico descreve obrigações de
     uma empresa; esta tela descreve o comportamento do programa. A
     política entra aqui embaixo como documento.
     ============================================================ */
  telaPrivacidade: {
    titulo: 'Privacidade e dados',
    lead: 'Onde os seus registros ficam, o que sai daqui e o que o aplicativo lê de fora.',
    statusGuardadoTitulo: 'O seu diário está guardado',
    statusGuardadoTexto: 'Neste aparelho e na sua conta, em São Paulo. Se você trocar de aparelho, ele volta quando você entrar.',
    statusAquiTitulo: 'O seu diário está neste aparelho',
    statusAquiTexto: 'Ele ainda não tem conta: por enquanto, fica só aqui.',

    /* ---------- onde ficam ---------- */

    /* ---------- o que sai ---------- */
    oQueSai: 'O que sai daqui',
    oQueSaiNota: 'Só o primeiro vai sozinho. O resto depende de um gesto seu.',
    saiConta: 'Sua conta',
    saiContaResumo: 'Vai sozinho',
    saiClinica: 'Sua clínica',
    saiClinicaNenhuma: 'Nenhuma conectada',
    saiClinicaConectada: 'Conectada',
    saiFoto: 'Foto do prato',
    saiFotoResumo: 'Só se você usar',
    saiMicrofone: 'Microfone',
    saiMicrofoneResumo: 'Só quando ligado',
    saiPerguntas: 'Perguntas ao Morphi',
    saiPerguntasResumo: 'Ficam aqui',
    saiPerguntasTexto: 'As perguntas que você faz ao Morphi ficam só neste aparelho: não vão para a sua conta, nem para a clínica, nem para nós.',
    paraContaTexto: 'Os registros e o perfil vão para o nosso banco sempre que há conexão. É isso que guarda o diário entre aparelhos.',
    paraEquipeTexto: 'Nada, até você se conectar a uma clínica parceira pelo código dela. Antes de conectar, aparece a lista do que ela passa a ver; ela vê enquanto a conexão durar, e dá para desconectar na tela da clínica. O resumo para consulta se monta aqui, e sai quando você o mostra ou exporta.',
    perguntas: 'As suas perguntas ao Morphi',
    perguntasTexto: 'Só com a leitura permitida por você, no interruptor abaixo. Lemos sem saber quem perguntou, e a clínica nunca lê. Desligar apaga as que foram.',
    ditadoTexto: 'Quem transforma a fala em texto é o sistema do aparelho. Pedimos que isso aconteça no próprio aparelho, mas, sem o reconhecimento local do seu idioma, o sistema pode mandar o áudio para a Apple ou o Google. Só enquanto o microfone está ligado.',
    fotoDoPratoTexto: 'Ela é reduzida no aparelho e enviada para ser lida por um modelo, que devolve os itens do prato. A imagem não fica guardada: nem no seu registro da refeição, nem no servidor que faz a ponte. Registrar a refeição à mão não envia nada.',

    /* ---------- o que entra ----------

       ⚠️ O NOME DO DEPÓSITO MUDA COM O APARELHO, e citar o errado faria a
       pessoa procurar nos ajustes uma coisa que não existe ali. Ele chega
       pronto do catálogo de integrações, que é a mesma fonte que a tela
       de Integrações lê — para as duas não discordarem no nome.

       ⚠️ E DIZIA "o app lê as pesagens... Ele só lê". Duas vezes o
       aplicativo falando de si em terceira pessoa, numa tela em que a
       pergunta é justamente quem faz o quê. Quem lê somos nós. */
    leDeFora: 'O que o aplicativo lê de fora',
    leSaudeResumo: 'Só o peso',
    appDeSaudePadrao: 'aplicativo de saúde do celular',
    soOPesoTexto: (app: string) =>
      `Com a sua permissão, lemos as pesagens que a sua balança, o seu relógio ou outro aplicativo escreveram lá. Só lemos: nunca escrevemos nada no ${app}. E lemos só peso — sono, passos e batimentos ficam de fora.`,
    permissaoTexto: 'Ela é dada nos ajustes do sistema e revogada no mesmo lugar. Sem ela, o aplicativo continua inteiro: o peso passa a entrar como entrou até aqui, digitado por você.',

    /* ---------- o que dá para fazer ---------- */
    podeFazer: 'O que você pode fazer agora',
    integracoesSub: (app: string) => `Ligar ou desligar o ${app}`,
    resumo: 'Resumo para consulta',
    resumoSub: 'Ver tudo o que entra no resumo da consulta',

    /* ---------- apagar ----------

       ⚠️ DUAS PERGUNTAS, E NÃO UMA. A primeira é o toque na linha; a
       segunda diz o que vai embora, e onde ainda sobra cópia (a de apagar
       a conta, em conta.apagarConta, diz as cópias de segurança).
       "Tem certeza?" é a pergunta que não informa nada, e é exatamente a
       que as pessoas respondem "sim" no automático. */
    apagar: 'Apagar meus dados',
    apagarSub: 'Tudo que você registrou, sem volta',
    /* só para o diário sem conta — com conta, a pergunta é a de conta.apagarConta */
    apagarPergunta: 'Apagar tudo deste aparelho? Este diário ainda não tem conta, e não existe cópia dele em outro lugar.',
    apagarConfirma: 'Apagar',
    cancelar: 'Cancelar',

    /* ---------- os documentos ----------

       ⚠️ "O QUE O MORPHI É" VIROU "O QUE SOMOS". O nome do produto pode
       ser rótulo, mas não pode ter verbo pendurado nele — é a mesma regra
       que o cabeçalho do companion carrega por escrito. */
    documentos: 'Os documentos',
    politicaSub: 'O documento completo, com base legal e prazos',
    termosSub: 'O que somos, o que não somos, e o que cada lado pode esperar',
    semPoliticaTitulo: 'Isto descreve o aplicativo, não é a política de privacidade',
    semPoliticaTexto: 'Aqui está o que o programa faz com os seus dados. O documento jurídico, com as obrigações de quem opera o serviço, ainda vai ser publicado — e quando existir, aparece nesta tela.',
  },

  /* ============================================================
     A TELA DE INTEGRAÇÕES

     ⚠️ CADA MOTIVO TEM O SEU RECADO. "Não disponível" serve para as três
     situações e não resolve nenhuma: quem está no navegador precisa saber
     que é o navegador, quem está na prévia precisa saber que é o build, e
     quem está num Android sem Health Connect precisa saber que dá para
     instalar.

     ⚠️ E O NÚMERO É O RECADO DA LEITURA. "Sincronizado" não diz se veio
     alguma coisa, e zero é uma resposta legítima: quem nunca se pesou
     fora do aplicativo precisa saber que a ligação funcionou e que não
     havia o que trazer, em vez de achar que falhou em silêncio.

     ⚠️ OS NOMES DE MARCA FICAM NO CÓDIGO. Health Connect, Garmin, Fitbit
     e Withings não se traduzem; só "Apple Saúde" muda, porque é a própria
     Apple que traduz o nome do aplicativo dela.
     ============================================================ */
  telaIntegracoes: {
    titulo: 'Integrações',
    lead: 'Ligadas, elas trazem as suas pesagens sem você digitar.',

    doSeuAparelho: 'Do seu aparelho',
    doSeuAparelhoNota: 'Um depósito local: pedimos permissão e lemos. Sem conta e sem senha.',

    atualizarAgora: 'Atualizar agora',
    lendo: 'Lendo…',
    nadaNovo: 'Nada novo por lá — as suas pesagens já estavam todas aqui.',
    trazidas: (quantas: number, aparelho: string) =>
      `${quantas} ${quantas === 1 ? 'pesagem trazida' : 'pesagens trazidas'} do ${aparelho}.`,
    naoDeuParaLer: 'Não deu para ler agora. Tente de novo em instantes.',
    acessoNegado: 'O acesso não foi liberado. Dá para mudar isso nas configurações do aparelho.',

    semAparelhoTitulo: 'O aplicativo de saúde do aparelho aparece no celular',
    semAparelhoTexto: 'Apple Saúde no iPhone, Health Connect no Android. No navegador não há o que ligar.',
    semAppTitulo: (aparelho: string) => `${aparelho} não está disponível neste aparelho`,
    semAppTexto: 'O Health Connect vem no Android 14 em diante e pode ser instalado nas versões anteriores. Depois de instalar, volte aqui.',
    semBuildTitulo: 'Esta versão do aplicativo ainda não lê o aparelho',
    semBuildTexto: 'A leitura do Apple Saúde e do Health Connect precisa de uma versão instalada do aplicativo, e não da prévia. No Expo Go ela não existe.',

    contasDeServico: 'Contas de serviço',
    contasDeServicoNota: 'Estes entregam os dados para um servidor, e não para o telefone — a ligação entra quando esse servidor estiver de pé. Enquanto isso, o que eles mandam para o aplicativo de saúde do seu aparelho já chega aqui.',
    emBreve: 'Em breve',
  },
};
