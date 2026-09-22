/* ============================================================
   O CUIDADO — a área das pessoas

   É a parte do aplicativo que fala da EQUIPE de alguém, e por isso a
   regra que vale para o arquivo inteiro é mais dura que a das outras:

   ⚠️⚠️ NENHUMA FRASE DAQUI PODE AFIRMAR O QUE A EQUIPE FEZ SEM SABER.
   "Sua equipe atualizou seu tratamento" só é verdade quando existe
   plataforma — é ela que traz a orientação nova. Sem servidor, o
   aplicativo sabe que a consulta aconteceu, porque a pessoa disse, e
   mais nada. Por isso quase todo par de frases aqui tem uma versão com
   plataforma e outra sem, e elas não são variações de tom: a diferença
   entre as duas é uma afirmação de fato.

   ⚠️ E A MANCHETE NÃO DÁ NOTA. A pastilha do topo dizia "Boa adesão",
   "Adesão regular" ou "Adesão baixa" — e a terceira aparecia para quem
   perdeu duas doses, que quase sempre perdeu porque passou mal. Uma
   consequência do tratamento virava nota sobre a pessoa no primeiro
   lugar em que o olho cai. Hoje é "8 de 11 doses", que diz a mesma coisa
   sem julgar e diz mais: a nota achatava 70% e 89% no mesmo rótulo.
   ============================================================ */

export const cuidado = {
  /* ============================================================
     O QUE ESTÁ ESPERANDO A PESSOA

     ⚠️ CADA ITEM TEM TRÊS TEXTOS, e o terceiro não é resumo dos outros:

       · `texto`  o que fazer — é o título da linha
       · `sub`    por que agora, que é o que decide entre hoje e semana
                  que vem
       · `rotulo` como a MANCHETE chama este item quando os lista numa
                  frase só: "duas pendências precisam de você — receita e
                  exames"

     "Agendar exame de sangue" é o que se faz; para a frase, o assunto é
     "exames". Traduzir os dois iguais desfaz a manchete.
     ============================================================ */
  pendencias: {
    mensagemUma: 'Responder a mensagem da sua equipe',
    mensagemVarias: (quantas: number) => `Responder as ${quantas} mensagens da sua equipe`,
    mensagemSub: 'aguardando sua resposta',
    mensagemRotulo: 'mensagens',

    receita: 'Peça a renovação da receita',
    /* Duas contagens na mesma linha, cada uma com o próprio plural: as
       doses que restam e as semanas que elas cobrem. */
    receitaSub: (doses: number, semanas: number) =>
      `${doses} ${doses === 1 ? 'dose restante' : 'doses restantes'} · cerca de ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,
    receitaRotulo: 'receita',

    /* O título do exame vem do protocolo — é o que a equipe escreveu, e
       não texto nosso. O que é nosso é de onde ele veio: com equipe, foi
       ela que pediu; sem equipe, quem pede é o próprio plano, e dizer
       "pedido pela sua equipe" inventaria uma. */
    exameSubDaEquipe: 'pedido pela sua equipe',
    exameSubDoProtocolo: 'do protocolo desta semana',
    exameRotulo: 'exames',

    consulta: 'Prepare o que levar para a consulta',
    consultaSub: (tipo: string, quando: string, doutor: string) =>
      `${tipo} ${quando} · com ${doutor}`,
    consultaRotulo: 'consulta',
  },

  /* ============================================================
     A MANCHETE DO ACOMPANHAMENTO

     Quatro momentos, e a ordem em que aparecem aqui é a ordem de
     precedência entre eles: a consulta chegando vence tudo, depois o
     pós-consulta, depois as pendências, e a continuidade no resto do
     tempo — que é a maior parte.
     ============================================================ */
  estado: {
    /* ⚠️ ERA A MESMA PALAVRA ESCRITA QUATRO VEZES, uma por momento. Os
       quatro cartões são o mesmo cartão em momentos diferentes, então o
       chapéu é um só. */
    kicker: 'SEU ACOMPANHAMENTO',

    /* As duas contagens do topo. A quebra de linha é de propósito: valor
       em cima, unidade embaixo, para a leitura de relance. */
    metricaSemanas: 'semanas\nde acompanhamento',
    metricaAplicacoes: 'aplicações\nregistradas',

    /* ⚠️ "DOSES" E NÃO "APLICAÇÕES": esta pastilha divide a linha com o
       pulso, que pode ser "3 itens pendentes", e a palavra longa empurra
       o pulso para duas linhas. */
    adesao: (feitas: number, previstas: number) =>
      `${feitas} de ${previstas} ${previstas === 1 ? 'dose' : 'doses'}`,

    /* ---------- a consulta chegando ---------- */
    consultaTitulo: 'Sua consulta está chegando.',
    consultaHoje: (doutor: string) =>
      `Sua consulta com ${doutor} é hoje. Vale revisar o que você quer perguntar.`,
    consultaFaltam: (dias: number, doutor: string) =>
      `${dias === 1 ? 'Falta 1 dia' : `Faltam ${dias} dias`} para sua consulta com ${doutor}.`,
    consultaPulso: (quando: string) => `Consulta ${quando}`,

    /* ---------- logo depois da consulta ---------- */
    /* ⚠️ AS DUAS VERSÕES NÃO SÃO DE TOM, SÃO DE FATO. Ver o alto do
       arquivo: sem plataforma o aplicativo não sabe o que foi decidido na
       sala, e a frase muda de dono. */
    posConsultaTituloComPlataforma: 'Sua equipe atualizou seu tratamento.',
    posConsultaTituloSemPlataforma: 'Você teve uma consulta há pouco.',
    posConsultaTextoComPlataforma: 'Confira as orientações da consulta e o que muda na sua dose a partir de agora.',
    /* ⚠️ ESTA FRASE DIZIA "AS CONTAS DO APP", e a palavra é "aplicativo".
       Ela passou despercebida porque é de um ramo que nunca rodava: só
       aparece para quem teve consulta nas últimas 48 h e não tem
       plataforma. Foi a cobertura do congelamento que a encontrou. */
    posConsultaTextoSemPlataforma: 'Se a dose ou o intervalo mudaram, vale atualizar por aqui — é o que mantém as contas do aplicativo certas.',
    posConsultaPulso: 'Tratamento atualizado',

    /* ---------- as pendências ---------- */
    /* ⚠️ "TEMOS ALGUMAS COISAS PARA CUIDAR" — primeira pessoa do plural, e
       não "você tem pendências". A lista abaixo é de coisas que dependem
       dela, e abrir com o dedo apontado num cartão de saúde é o começo
       errado. */
    pendenciaTitulo: 'Temos algumas coisas para cuidar.',
    /* ⚠️ NOMEIA O QUE É, EM VEZ DE CONTAR QUANTOS. "Duas coisas" obriga a
       rolar para descobrir se importa. E os nomes vêm da PRÓPRIA lista,
       item por item — quando vinham de outro conjunto, a frase podia
       nomear um assunto que a lista não tinha. */
    pendenciaTexto: (quantas: string, plural: boolean, assuntos: string) =>
      `${quantas} ${plural ? 'pendências precisam' : 'pendência precisa'} de você — ${assuntos}. Nada urgente, mas vale resolver esta semana.`,
    pendenciaPulso: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'item pendente' : 'itens pendentes'}`,
    /* Até quatro por extenso, que é o teto de pendências que existem. */
    porExtenso: ['nenhuma', 'uma', 'duas', 'três', 'quatro'],

    /* ---------- o resto do tempo ---------- */
    emDiaTitulo: 'Seu cuidado está em dia.',
    /* ⚠️ A SEGUNDA VERSÃO EXISTE PORQUE A FRASE COMEÇAVA PELO NOME DA
       MÉDICA. Sem ninguém registrado ela abria com um espaço em branco:
       " acompanha seu tratamento há 10 semanas". Quem conduz o tratamento
       sozinha conduz há o mesmo tanto de tempo. */
    emDiaComQuem: (quem: string, semanas: number) =>
      `${quem} acompanha seu tratamento há ${semanas} semanas. Você está com boa adesão e não há nenhuma pendência importante no momento.`,
    emDiaSozinha: (semanas: number) =>
      `Você está há ${semanas} semanas de tratamento, com boa adesão e nenhuma pendência importante no momento.`,
    emDiaPulso: 'Acompanhamento em dia',
  },

  /* ============================================================
     O CONTEXTO DA DOSE — as três frases curtas
     ============================================================ */
  dose: {
    aplicacaoHoje: 'Aplicação hoje',
    proximaAplicacao: (quando: string) => `Próxima aplicação ${quando}`,
    nestaDoseHa: (semanas: number) =>
      `Nesta dose há ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,
    /* O `quando` já chega como "em 9 dias" / "amanhã", com a preposição
       dentro — por isso a frase não põe outra: "consulta de em 9 dias". */
    revisaoNaConsulta: (quando: string) => `Revisão na consulta ${quando}`,
    revisaoHoje: 'de hoje',
  },

  /* ============================================================
     A EQUIPE E A CLÍNICA
     ============================================================ */
  equipe: {
    /* O papel de quem não tem especialidade anotada. Não é "Médico": pode
       não ser, e o aplicativo não sabe. O que ele sabe é a função. */
    responsavelPadrao: 'Responsável pelo tratamento',
  },

  /* ⚠️ CADA LINHA SÓ EXISTE COM O DADO DELA. "Telefone —" numa lista de
     contatos é a tela prometendo um canal que não existe. E a ordem é a
     do canal mais rápido para o mais formal. */
  contato: {
    whatsapp: 'WhatsApp',
    whatsappSub: 'Falar com a clínica',
    telefone: 'Telefone',
    site: 'Site',
    email: 'E-mail',
    instagram: 'Instagram',
  },

  /* ============================================================
     A TELA DO CUIDADO — a aba das pessoas

     As outras três abas são sobre dados: a Home mostra o dia, a Jornada a
     história, o Insights a interpretação. Esta é sobre quem cuida — e por
     isso quase tudo aqui aparece ou some conforme a pessoa tenha equipe,
     tenha um profissional anotado, ou conduza o tratamento sozinha.

     ⚠️ `linhaDoPlano` DEVOLVE TRÊS PEDAÇOS pelo mesmo motivo de
     `cadastro.telaPlano.objetivo`: a frase tem DOIS números em negrito no
     meio dela — "Semana <b>11</b> de 15 até a sua meta · <b>10</b> com
     aplicação em dia" —, e o que fica entre eles muda de idioma para
     idioma.

     ⚠️ E O DENOMINADOR SÓ APARECE QUANDO EXISTE. Sem meta a perseguir não
     há horizonte, e "de N previstas" seria um plano que ninguém traçou.
     ============================================================ */
  tela: {
    /* ---------- o hero ---------- */
    paraAConsulta: (quando: string) => `PARA A CONSULTA ${quando}`,
    resumoPronto: 'Seu resumo já está pronto',
    vouPreparar: 'Vou preparar seu resumo',

    linhaDoPlano: (previstas: number, temHorizonte: boolean): [string, string, string] => [
      'Semana ',
      temHorizonte ? ` de ${previstas} até a sua meta · ` : ' do seu tratamento · ',
      ' com aplicação em dia',
    ],

    /* ---------- quem cuida ----------

       ⚠️ O TÍTULO SAI DE `home.telaInicio.quemCuida`, e não daqui: é o
       mesmo nos três lugares em que a mesma especialista aparece. */
    ultimaOrientacao: 'ÚLTIMA ORIENTAÇÃO',
    voceEscreveu: 'VOCÊ ESCREVEU',
    naoLida: 'não lida',
    responder: 'Responder',
    enviarPrimeira: 'Enviar a primeira mensagem',

    /* ---------- o que precisa de você ---------- */
    precisaDeVoce: 'Precisa de você',
    nadaPrecisa: 'Nada precisa de você agora.',
    emDia: 'Seu acompanhamento está em dia.',

    /* ---------- a consulta ---------- */
    proximaConsulta: 'Sua próxima consulta',
    consultasLink: 'Consultas',
    anotarConsulta: 'Anotar uma consulta',
    /* ⚠️ DIZIA "o app avisa quando ela chegar perto", e o aplicativo não
       fala de si em terceira pessoa. Quem avisa somos nós. */
    anotarConsultaSub: 'Com a data aqui, o resumo fica pronto e avisamos quando ela chegar perto.',
    eQuando: (quando: string) => `É ${quando}`,
    preparoTexto: 'Eu monto um resumo com peso, adesão e sintomas do período — você escolhe o que quer perguntar.',
    prepararAConsulta: 'Preparar a consulta',

    /* ---------- o tratamento ----------

       ⚠️ "DOSES NA CANETA" ASSUMIA A CANETA, e há frasco, seringa e
       cartela. O `onde` chega pronto de `formas.noNa`, que concorda com o
       recipiente de quem lê. */
    seuTratamento: 'Seu tratamento',
    aplicacoesLink: 'Aplicações',
    dosesEm: (onde: string) => `Doses ${onde}`,
    restamDe: (restam: number, total: number, semanas: number) =>
      `${restam} de ${total} · cerca de ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,
    pedirRenovacao: 'Pedir renovação',

    /* ---------- os exames ---------- */
    exames: 'Exames',
    marcadoresAcompanhados: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'marcador acompanhado' : 'marcadores acompanhados'}`,
    nenhumResultado: 'Nenhum resultado guardado',
    importeUmExame: 'Importe um exame para começar a acompanhar',
    foraDaReferencia: (quantos: number) => `${quantos} fora da referência`,
    todosNaReferencia: 'Todos na referência',

    /* ---------- quem acompanha ---------- */
    quemAcompanha: 'Quem acompanha você',
    ninguemRegistrado: 'Ninguém registrado ainda',
    seVoceSeTrata: 'Se você se trata com alguém, anote aqui — o resumo sai pronto para a consulta.',

    /* ---------- o convite, no fim ----------

       ⚠️ SÓ EXISTE ONDE HÁ REDE PARCEIRA, e só para quem não tem
       acompanhamento nenhum. Ver logic/pais. */
    acompanhamentoProfissional: 'Acompanhamento profissional',
    conhecaParceiros: 'Conheça os médicos parceiros',
    parceirosTexto: 'Algumas clínicas acompanham o tratamento por aqui junto com você — mensagens entre as consultas, o seu resumo chegando na equipe e a agenda já preenchida.',
    passouATer: 'Passou a ter acompanhamento médico?',
    anoteQuemE: 'Anote quem é.',
  },

  /* ============================================================
     A TELA DE QUEM ACOMPANHA VOCÊ

     ⚠️ O QUE SE REGISTRA AQUI É UM FATO DA VIDA DA PESSOA, e não um
     vínculo. A maioria de quem usa GLP-1 tem médico; o que a maioria não
     tem é um médico dentro desta plataforma. Nada do que entra aqui manda
     mensagem para ninguém, e a tela diz isso ANTES do botão de salvar —
     é informação para decidir, não aviso depois do fato.

     ⚠️ COM VÍNCULO, ISTO É LEITURA. Quem veio por uma clínica credenciada
     tem estes campos vindos de lá, e um formulário aberto criaria a
     situação em que a pessoa corrige o nome da própria médica e o
     servidor sobrescreve na sincronização seguinte.

     ⚠️ E "ONDE VOCÊ É ATENDIDA" CONCORDAVA COM UMA LEITORA. O particípio
     em português tem gênero, e a tela não sabe o de quem lê — a frase foi
     reescrita para não precisar saber. O francês teria o mesmo problema
     em "suivie".
     ============================================================ */
  telaAcompanhamento: {
    /* O título é o mesmo da seção na aba Cuidado: mesma pergunta, mesma
       resposta, duas telas. Sai de `cuidado.tela.quemAcompanha`. */
    leadComVinculo: 'Estes dados vêm da clínica que acompanha o seu tratamento.',
    ondeAtendida: 'Onde acontece o atendimento',
    quemCorrige: 'Quem corrige é a clínica',
    quemCorrigeTexto: 'Se algum dado estiver errado, fale com a equipe — é ela que mantém esta ficha, e o que for corrigido lá chega aqui.',

    lead: 'Se você se trata com alguém, anote aqui. É o que faz o resumo sair pronto para a consulta e o preparo de perguntas aparecer na hora certa.',

    nome: 'Nome',
    nomeAjuda: 'Como você chama essa pessoa. Pode ser o nome do consultório, se preferir.',
    nomePlaceholder: 'Digite o nome',
    especialidade: 'Especialidade',
    opcional: 'Opcional.',
    /* Um exemplo, e não um dado. Cada idioma escolhe a forma que não pede
       gênero: onde o nome da pessoa é marcado, entra o nome da área. */
    especialidadePlaceholder: 'Endocrinologia',
    ondeAtende: 'Onde atende',
    ondeAtendeAjuda: 'Opcional — clínica, hospital ou consultório.',
    ondeAtendePlaceholder: 'Digite a clínica ou consultório',

    nadaEnviado: 'Nada disto é enviado a ninguém',
    nadaEnviadoTexto: 'O nome fica no aplicativo, com você. Para que a sua equipe receba os seus dados é preciso um código de convite da clínica — e aí quem passa a cuidar desta ficha é ela.',
    salvar: 'Salvar',

    /* ⚠️ TIRAR QUEM ACOMPANHA NÃO APAGA NADA. É a regra da casa: nenhuma
       atualização das informações limpa registro. O que sai são três
       campos de identificação. */
    naoTenhoMais: 'Não tenho mais acompanhamento',
    tirarPergunta: 'Tirar quem acompanha?',
    tirarTexto: 'Os seus registros continuam todos aqui — peso, aplicações, sintomas, exames e anotações. O que sai é só o nome.',
    simTirar: 'Sim, tirar',
    cancelar: 'Cancelar',
  },

  /* ============================================================
     A TELA DE ANOTAR UMA CONSULTA

     ⚠️ OS TRÊS TIPOS SÃO CHAVE E RÓTULO AO MESMO TEMPO — é o que fica
     gravado em `S.consult.type`. Mesma família do momento da refeição e
     das modalidades de exercício: traduzir não quebra registro novo, e
     registro antigo aparece com o nome que foi gravado.

     ⚠️ E A EXPECTATIVA VEM ANTES DO BOTÃO. Anotar aqui não avisa o
     consultório nem entra no calendário do telefone — dizer isso depois
     do fato seria tarde.
     ============================================================ */
  telaAnotarConsulta: {
    titulo: 'Anotar consulta',

    /* Com clínica vinculada, a agenda vem de lá e esta tela é só leitura. */
    quemMarca: 'Quem marca é a clínica',
    quemMarcaLead: 'A sua agenda vem da equipe que acompanha o seu tratamento.',
    datasChegam: 'As datas chegam da clínica',
    datasChegamTexto: 'Para remarcar ou desmarcar, fale com a equipe — o que mudar lá aparece aqui.',

    proximaConsulta: 'A sua próxima consulta',
    anoteSuaConsulta: 'Anote a sua consulta',
    lead: 'Com a data aqui, avisamos quando ela estiver perto e deixamos o resumo pronto para você levar.',

    quando: 'Quando',
    comoVaiSer: 'Como vai ser',
    tipos: {
      presencial: 'Presencial',
      teleconsulta: 'Teleconsulta',
      retorno: 'Retorno',
    },
    comQuem: (quem: string) => `Com ${quem}.`,

    dataFicaComVoce: 'A data fica com você',
    dataFicaComVoceTexto: 'Anotar aqui não avisa o consultório nem entra no calendário do telefone. Somos nós que passamos a saber que a consulta está chegando.',

    salvar: 'Salvar',
    anotar: 'Anotar consulta',
    naoTenho: 'Não tenho consulta marcada',
  },
  /* ============================================================
     CONSULTAS — a próxima, o que levar nela, e as que já foram

     ⚠️ O DIA DA SEMANA E A DATA SÃO COLADOS POR UMA FUNÇÃO, e não por
     uma vírgula escrita no JSX: "segunda-feira, 3 de outubro" leva
     vírgula no português, no inglês e no alemão, e o francês e o
     espanhol escrevem "lundi 3 octobre" — sem nenhuma. Uma vírgula
     digitada na tela seria uma regra de português aplicada aos cinco.
     ============================================================ */
  telaConsultas: {
    titulo: 'Consultas',
    leadComData: 'A próxima, o que levar nela, e as que já aconteceram.',
    leadSemData: 'O que levar na próxima, e as que já aconteceram.',

    jaPassou: 'JÁ PASSOU',
    proxima: 'PRÓXIMA',
    dataDaConsulta: (diaDaSemana: string, data: string, quem: string) =>
      `${diaDaSemana}, ${data}${quem ? ` · ${quem}` : ''}`,
    jaAconteceu: 'Já aconteceu',
    verResumo: 'Ver o resumo para levar',
    mudarData: 'Mudar a data',

    nenhumaAnotada: 'Nenhuma consulta anotada',
    clinicaMarca: 'Quando a sua equipe marcar a próxima, ela aparece aqui.',
    semDataTexto: 'Com a data aqui, avisamos quando ela estiver perto e deixamos o resumo pronto para levar.',
    anotarConsulta: 'Anotar consulta',

    paraLevar: 'Para levar',
    /* Os três ramos numa função só: o plural é regra de idioma, e
       deixá-lo no ternário da tela prenderia "Falta/Faltam" ao
       português. */
    paraLevarSub: (faltando: number): string =>
      faltando === 0
        ? 'Está tudo em dia — o resumo já se monta com isso.'
        : faltando === 1
          ? 'Falta uma coisa para o resumo ficar completo.'
          : `Faltam ${faltando} coisas para o resumo ficar completo.`,

    anteriores: 'Consultas anteriores',
    linhaAnterior: (tipo: string, data: string) => `${tipo} · ${data}`,

    /* ⚠️ CHAVE E RÓTULO AO MESMO TEMPO, como os três tipos de
       /anotar-consulta: é o que fica GRAVADO no histórico quando a
       consulta não tinha tipo. Mesma família — registro novo nasce no
       idioma de quem gravou, e registro antigo aparece como foi
       gravado. */
    consultaGenerica: 'Consulta',
  },
  /* ============================================================
     UMA CONSULTA QUE JÁ ACONTECEU

     ⚠️ A TELA NÃO DIZ "O QUE VEIO DESTA CONSULTA", e o texto segue essa
     regra: ela mostra um INTERVALO — o que os registros mostram entre
     esta consulta e a seguinte —, e nunca uma causa. O aplicativo não
     estava na sala, e data não é causa.
     ============================================================ */
  telaConsulta: {
    titulo: 'Consulta',
    naoEstaMais: 'Esta consulta não está mais no seu histórico.',

    desdeEntao: 'Desde então',
    desdeEntaoSub: 'O que os seus registros mostram deste dia até agora.',
    ateASeguinte: 'Até a consulta seguinte',
    ateASeguinteSub: (data: string) =>
      `O que os seus registros mostram entre este dia e ${data}.`,

    semRegistro: 'Nenhum registro seu caiu neste período. O que ficou combinado na consulta está na anotação acima, se houver.',
  },

  /* ============================================================
     ÁREA MÉDICA — quem cuida, e o que atravessa

     ⚠️ ELA ABRE POR `temAcompanhamento`, E NÃO POR VÍNCULO. Quem anotou
     o próprio médico chega aqui, em qualquer mercado; o que é da
     plataforma (mensagem, receita, material da clínica) se apaga
     sozinho pela falta do dado, e não por trava de país.
     ============================================================ */
  telaAreaMedica: {
    titulo: 'Área médica',
    lead: 'Quem cuida de você, e o que atravessa para o outro lado.',

    /* Dois dos quatro atalhos, e só dois: "Consultas" e "Protocolos"
       são o nome das telas do outro lado, e já estão escritos lá. Uma
       segunda cópia aqui seria a que fica para trás na primeira vez que
       um dos dois nomes mudar. */
    atalhoMensagem: 'Mensagem',
    atalhoClinica: 'Clínica',

    paraLevar: 'PARA LEVAR À CONSULTA',
    paraLevarTexto: 'Peso, adesão, sintomas, exames e as suas anotações, num documento só. Ele se monta dos seus registros e está pronto agora.',
    verResumo: 'Ver o resumo para consulta',

    suasAnotacoes: 'Suas anotações',
    anotar: 'Anotar',
    anotarDuvida: 'Anotar uma dúvida',
    anotarDuvidaSub: 'Para perguntar na próxima consulta',

    prescricoes: 'Prescrições',
    pedirReceita: 'Pedir nova receita',
    clinicaPreparou: 'O que a clínica preparou',

    numerosDaEquipe: 'Os números da sua equipe',
    naoAnotada: 'não anotada',
    anotadoPor: (por: string, data: string) => `${por} · anotado em ${data}`,
    /* ⚠️ ERA "o número que ELA definiu na consulta", e o aplicativo não
       sabe o gênero de quem acompanha. A semente tem uma médica; o
       médico de quem usa pode ser qualquer pessoa. A frase foi reescrita
       para não precisar saber — mesma saída dos particípios do francês. */
    anoteONumero: 'Anote o número definido na consulta',

    duasMetas: (minha: string) =>
      `A sua meta de peso, no aplicativo, é ${minha}. As duas convivem — a sua continua medindo a Jornada —, e a diferença entre elas é uma boa pergunta para a próxima consulta.`,

    documentos: 'Documentos e exames',
    documentoSub: (tipo: string, data: string) => `${tipo} · ${data}`,
  },
};
