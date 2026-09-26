/* ============================================================
   A ASSINATURA — o que está valendo, quanto custa, onde se mexe

   ⚠️⚠️ É UMA TELA SÓ, COM UMA ETIQUETA, e o catálogo tem de preservar
   isso. Quem é paciente de clínica parceira lê "Sem custo" no MESMO ponto
   da tela onde quem assina lê "R$ 299,00" — a comparação é imediata
   porque o lugar é o mesmo. Um idioma que inventasse uma frase mais longa
   para o caso isento desfaria o desenho.

   ⚠️ O QUE NÃO ESTÁ AQUI, E NÃO ESTÁ DE PROPÓSITO:

   · "Care" e "Personal" são nomes dos nossos planos de acesso, e nome de
     plano não se traduz — vivem em logic/assinatura.
   · "App Store" e "Google Play" são marcas.
   · Os ATALHOS DE DESENVOLVIMENTO. `__DEV__` é falso na compilação de
     produção e aquele bloco some: são três linhas que nenhuma pessoa lê
     em idioma nenhum, e traduzi-las seria trabalho para ninguém.

   ⚠️⚠️ E O TEXTO DA ISENÇÃO NASCE DA SEÇÃO 4 DOS TERMOS. Não é frase de
   tela: é o compromisso que o documento assume, repetido onde ele
   importa. Se os dois se afastarem, um vira a versão errada para quem leu
   o outro — e quem tem razão é o documento. Ver logic/documentos.
   ============================================================ */

export const assinatura = {
  /* ============================================================
     OS PLANOS

     ⚠️ O SUFIXO NÃO É CHAVE. Havia duas telas perguntando
     `p.sufixo === '/mês'` para saber qual plano era o mensal — uma
     comparação de texto fazendo o trabalho de um id. Em inglês o sufixo
     é "/mo", a comparação falhava calada, e a tela de preço passava a
     dizer que os planos começam em R$ 598,80 por mês. Quem pergunta qual
     é o plano pergunta pelo `id`.
     ============================================================ */
  mensal: 'Mensal',
  anual: 'Anual',
  porAno: 'por ano',
  porAnoCurto: '/ano',

  /* ============================================================
     A TELA
     ============================================================ */

  /* ⚠️ UMA CHAVE SÓ para o título da tela e o rótulo do cartão. São o
     mesmo assunto dito no mesmo lugar, e separá-los em duas chaves é
     convidar as duas a divergirem. */
  titulo: 'Sua assinatura',

  semCusto: 'Sem custo',

  /* Quando não sabemos o nome da clínica. Ela entra no meio de uma frase,
     e por isso é minúscula. */
  clinicaGenerica: 'a clínica que acompanha você',
  cobertoPelaClinica: (clinica: string) => `O vínculo com ${clinica} cobre o aplicativo inteiro.`,

  /* A ficha: rótulo à esquerda, valor à direita. */
  vinculadaDesde: 'Vinculada desde',
  codigoDeConvite: 'Código de convite',
  periodicidade: 'Periodicidade',
  primeiraCobranca: 'Primeira cobrança',
  proximaCobranca: 'Próxima cobrança',
  cobrancaPela: 'Cobrança pela',
  naoHa: 'Não há',

  /* ⚠️ "VOCÊ TEM TUDO DO JEITO QUE ESTÁ" VEM ANTES DO PREÇO, e a ordem é
     a mensagem: quem abriu esta tela sem assinar não está sendo cobrada
     de nada, e descobrir isso não pode depender de ler a segunda
     oração. */
  semPlano: (menorPorMes: string) => `Você tem tudo do jeito que está. Os planos começam em ${menorPorMes} por mês.`,

  /* As ações. Sem subtítulo, porque nenhuma delas tem consequência — cada
     uma abre uma tela, e numa lista de ações o subtítulo só se paga
     quando avisa de algo que não dá para desfazer. */
  mudarDePlano: 'Mudar de plano',
  verOsPlanos: 'Ver os planos',
  formaDePagamento: 'Forma de pagamento',
  historicoDeCobranca: 'Histórico de cobrança',

  trocarClinica: 'Trocar a clínica que acompanha você',

  /* ⚠️ ESTAS DUAS TÊM SUBTÍTULO, e pelo motivo contrário ao das outras:
     quem está pagando e digita um código de clínica parceira DEIXA DE
     PAGAR. É a maior consequência da tela, e não há como adivinhá-la de
     um rótulo que diz "inserir código". */
  inserirCodigo: 'Inserir código',
  inserirCodigoSub: 'Pacientes de clínicas parceiras possuem isenção do custo do aplicativo',
  medicosParceiros: 'Médicos parceiros',
  medicosParceirosSub: 'Quem se trata numa clínica parceira não paga',

  cancelar: 'Cancelar assinatura',

  /* ============================================================
     AS TRÊS NOTAS DO PÉ

     ⚠️ O TÍTULO NÃO É O MESMO NOS TRÊS. "É bom você saber" serve ao aviso
     que é só informação; a que avisa de dinheiro parado tem de dizer isso
     no título, senão vira mais uma nota de rodapé com cara de nota de
     rodapé.
     ============================================================ */
  pagandoTitulo: 'Você está pagando sem precisar',
  pagandoTexto: (loja: string) => `O vínculo com a clínica já cobre o aplicativo, mas existe uma assinatura ativa na ${loja} — cancele por lá e nada muda para você.`,

  /* ⚠️⚠️ ELA DIZ QUEM AVISA A GENTE, e depois o que acontece.

     "Se o vínculo terminar" fazia parecer que percebemos sozinhos, e não
     percebemos: ninguém aqui sabe que uma pessoa deixou de ser paciente
     de uma clínica. Quem sabe é a clínica, e é ela que informa.

     ⚠️⚠️ E A LINHA DOS DADOS ANDA JUNTO, sempre. Suspender o acesso de um
     diário de tratamento é trancar alguém do lado de fora do próprio
     peso, das próprias aplicações e dos próprios exames — e isso não
     fazemos. Separadas, a primeira frase vira uma ameaça. */
  bomSaberTitulo: 'É bom você saber',
  bomSaberTexto: 'Caso a clínica parceira nos informe que o vínculo de tratamento foi encerrado, o acesso fica suspenso até você aderir a um plano Personal — e nenhuma cobrança acontece sem você escolher. Nada do que você registrou se perde: os registros continuam na sua conta e dá para exportar quando quiser.',

  /* ⚠️ DIZER "VOCÊ NÃO ASSINOU" SEM DIZER QUE NINGUÉM PODE ASSINAR deixa
     a pessoa procurando um botão que não existe. Esta sai no dia em que a
     cobrança entrar. */
  semCobrancaTitulo: 'A cobrança ainda não está ligada',
  semCobrancaTexto: 'Esta tela existe, a assinatura ainda não. Nada foi cobrado de você, e nada vai ser sem aviso.',

  /* ============================================================
     A VITRINE — /planos

     ⚠️⚠️ O TÍTULO TEM UMA QUEBRA DE LINHA MEDIDA, E NÃO ESCOLHIDA. Num
     telefone de 375 pt sobram 335 px de linha; as duas metades pedem 321
     e 323 px no corpo de 31, e 343 no de 33 — onde a frase quebra de
     novo. Quem traduzir precisa caber nessa largura, ou mexer no corpo
     junto. Uma frase mais longa não "fica um pouco maior": ela quebra em
     três linhas e come o botão.
     ============================================================ */
  vitrine: {
    titulo: 'Tudo muda quando você\nacompanha ',
    tituloDestaque: 'de verdade.',
    lead: 'Seus dados reunidos, a sua evolução organizada, e clareza em cada etapa do tratamento.',

    /* Os quatro argumentos. Cada um é o que o aplicativo faz, e não um
       adjetivo sobre ele. */
    umLugarTitulo: 'Seu tratamento em um só lugar',
    umLugarTexto: 'Tudo organizado para você acompanhar sua jornada.',
    numerosTitulo: 'Seus números interpretados',
    numerosTexto: 'Os seus dados viram informação que faz sentido.',
    evolucaoTitulo: 'Evolução que você consegue enxergar',
    evolucaoTexto: 'Peso, medidas, sintomas, exames e registros ao longo do tempo.',
    assistenteTitulo: 'Um assistente para o dia a dia',
    assistenteTexto: 'Pergunte, registre e entenda melhor a sua jornada.',

    comecarTeste: (dias: number) => `Começar os ${dias} dias grátis`,
    assinarPor: (preco: string) => `Assinar — ${preco}`,

    /* ⚠️ "CANCELE QUANDO QUISER" SERVE AOS DOIS PLANOS, e é verdade nos
       dois. A segunda muda: "sem compromisso" acalma quem vai
       experimentar três dias; para quem está comprometendo um ano
       inteiro, a mesma frase soa a promessa vazia — ela ACABOU de se
       comprometer. O que vale dizer ali é o que ela ganha em troca. */
    canceleQuandoQuiser: 'Cancele quando quiser',
    semCompromisso: 'Sem compromisso',
    menorPreco: 'Menor preço',

    depoisDoTeste: (dias: number, preco: string, periodo: string) =>
      `Depois de ${dias} dias, ${preco} ${periodo}. Cancele antes e não paga nada.`,
    renovaAte: (preco: string, periodo: string) =>
      `${preco} ${periodo}, renovando até você cancelar.`,

    naoPaga: 'Você não paga — o acesso vem do vínculo',
    aindaNaoLigada: 'A assinatura ainda não está ligada',
    temCodigo: 'Tenho um código de convite',
  },

  /* ============================================================
     A SAÍDA — /cancelar

     ⚠️⚠️ A TELA PERGUNTA, MAS NÃO SEGURA. Quem abriu já decidiu, e a
     pergunta é para a gente, não contra ela: o botão que leva à loja fica
     ligado no rodapé sem depender de responder nada.
     ============================================================ */
  saida: {
    titulo: 'Cancelar assinatura',
    perguntaTitulo: 'Antes de ir, uma pergunta',
    perguntaLead: 'Responder é opcional e não muda nada: o cancelamento continua a um toque, no botão lá embaixo.',
    porQue: 'Por que você está cancelando?',
    continuarParaLoja: (loja: string) => `Continuar para a ${loja}`,

    /* ⚠️ A ORDEM NÃO É SOLTA: os três primeiros têm resposta, os três
       últimos têm campo de texto, e "Outro motivo" é sempre o último.
       Quem lê encontra a alternativa antes do formulário, e a saída
       genérica depois de todas as específicas. */
    motivoCaro: 'Está caro',
    motivoEsqueco: 'Não estou usando',
    motivoTerminei: 'Já terminei',
    motivoFaltou: 'Faltou algo',
    motivoProblema: 'Deu problema',
    motivoOutro: 'Outro motivo',

    /* ⚠️⚠️ NO ANUAL, O DESCONTO NÃO É A NOTÍCIA — A DATA É. Quem paga por
       ano e diz que está caro não tem cobrança chegando. O que muda a
       decisão dela é que o ano está pago e cancelar agora não devolve o
       dinheiro. E o reembolso é dito mesmo custando: quem quer o dinheiro
       de volta vai procurar de qualquer jeito, e ficar calado só garante
       que procure irritada e no lugar errado. */
    anoPagoTitulo: 'O seu ano já está pago',
    anoPagoComData: (data: string) => `A próxima cobrança é só em ${data}, e você continua com tudo até lá — cancelar agora não devolve o que já foi pago.`,
    anoPagoSemData: 'Você continua com tudo até o fim do período já pago — cancelar agora não devolve esse valor.',
    anoPagoReembolso: (loja: string, comDesconto: string, cheio: string) =>
      `Reembolso, quando cabe, é pedido na ${loja}. E se o problema for o valor, a renovação pode sair por ${comDesconto} em vez de ${cheio}.`,
    querDescontoRenovacao: 'Quero o desconto na renovação',

    descontoTitulo: (porcento: number) => `${porcento}% de desconto no próximo mês`,
    descontoTexto: (comDesconto: string, cheio: string, anualPorMes: string) =>
      `A próxima cobrança sai por ${comDesconto} em vez de ${cheio}. E se o mensal for o problema, o anual fica em ${anualPorMes} por mês.`,
    querDesconto: 'Quero o desconto',

    lembretesTitulo: 'Se o problema é esquecer, dá para avisar',
    lembretesTexto: 'Dose, pesagem, água e proteína têm lembrete, no horário que você escolher. Dá para ligar só o que faz falta e desligar o resto.',
    configurarLembretes: 'Configurar lembretes',

    /* ⚠️⚠️ AQUI A TELA PARA DE VENDER E DÁ PARABÉNS. É o único motivo da
       lista em que sair é o desfecho certo. E o parabéns é CONDICIONAL de
       propósito: "esperamos que você tenha alcançado" e não "você
       conseguiu" — nem todo tratamento que termina termina bem, e afirmar
       a vitória para quem parou por efeito colateral é a frase mais cruel
       que esta tela poderia ter. */
    parabensTitulo: 'Parabéns por chegar até aqui',
    parabensTexto: 'Esperamos que você tenha alcançado o que buscava quando começou. Obrigado por ter feito esse caminho com a gente — e por ter confiado à gente o registro dele.',

    campoProblema: 'O que aconteceu?',
    campoFaltou: 'O que faltou?',
    campoOutro: 'Conta pra gente',
    /* ⚠️ E A FRASE NÃO PROMETE RESPOSTA. Não há para onde esse texto ir
       ainda. "Vamos te responder" seria a promessa mais fácil e mais cara
       desta tela. */
    campoAviso: 'Escrever é opcional, e ninguém vai te responder por aqui — isso vira lista de conserto, e é assim que a gente decide o que arrumar primeiro.',
    campoDicaProblema: 'O que deu errado, e quando…',
    campoDicaOutro: 'Pode escrever à vontade',

    recusaTitulo: 'O desconto ainda não pode ser aplicado',
    recusaTexto: 'A cobrança não está ligada nesta versão, então não há o que descontar. Nada mudou na sua assinatura.',

    /* ⚠️ O TÍTULO É O RESUMO DOS TRÊS, e não um rótulo de seção. As três
       linhas respondem a mesma pergunta — "o que eu perco?" */
    tranquiloTitulo: 'FIQUE TRANQUILO',
    tranquiloAcesso: 'O acesso continua até o fim do período já pago.',
    tranquiloDados: 'Nada do que você registrou se perde — tudo continua na sua conta.',
    tranquiloLoja: (loja: string) => `O cancelamento é feito na ${loja}: o aplicativo não consegue fazer isso por você.`,
  },

  /* ============================================================
     AS CLÍNICAS PARCEIRAS — /parceiros e /codigo
     ============================================================ */
  /* Os rótulos do campo da folha do código (/codigo). A tela /parceiros,
     de onde eles nasceram, saiu na fase 8: a apresentação da rede e a
     vitrine já explicam o caminho, e têm "Já tenho um código". */
  parceiros: {
    codigoRotulo: 'Código de convite',
    digite: 'Digite o código',
    confirmar: 'Confirmar código',
    codigoSub: 'O código que a clínica parceira te passou.',
  },

  /* ============================================================
     A FOLHA DO CÓDIGO — /codigo

     Os rótulos do campo moram em `parceiros`, que é de onde a folha
     nasceu. Aqui fica o resto: o piso do campo, a frase de baixo e a
     conferência, que só existe quando há de onde conferir (ver
     `conferirConvite`, em logic/rede).
     ============================================================ */
  codigo: {
    minimo: 'Digite pelo menos 4 caracteres.',
    liberaNaHora: 'O código libera o aplicativo na hora. Nada do que você já registrou muda de lugar.',
    conferindo: 'Conferindo…',
    naoAchou: 'Não encontramos esse código. Confira com a clínica: ele vale do jeito que ela passou.',
    /* só com a lista de exemplo, que só existe em desenvolvimento */
    exemplo: (codigos: string) => `Na lista de exemplo, os códigos são inventados: ${codigos}.`,
    conferirTitulo: 'É essa a sua clínica?',
    conferirSub: 'O código que você digitou é desta clínica.',
    conectar: 'Conectar',
    naoEEssa: 'Não é essa clínica',
    conectarTexto: 'Ao conectar, esta clínica passa a acompanhar você por aqui. Nada do que você já registrou muda de lugar.',
    /* ⚠️ O TERCEIRO PASSO, SÓ PARA QUEM JÁ PAGA PELA LOJA. Conectar isenta
       (ver `isento`), mas a loja não sabe disso: a assinatura continua
       cobrando até a pessoa cancelar lá, e a Apple não deixa ninguém
       cancelar por ela. É a mesma notícia de `pagandoTexto`, dada na hora
       em que ela importa. */
    cancelarTitulo: 'Você pode cancelar a sua assinatura',
    cancelarTexto: (loja: string) => `O vínculo com a clínica já garante o seu acesso ao aplicativo. A assinatura na ${loja} continua cobrando até você cancelar por lá — e cancelar não muda nada no que você já registrou.`,
    cancelarNaLoja: (loja: string) => `Cancelar na ${loja}`,
    depois: 'Fazer isso depois',
  },

  /* ============================================================
     O EXTRATO — /cobrancas
     ============================================================ */
  extrato: {
    titulo: 'Histórico de cobrança',
    vazioIsenta: 'Nenhuma cobrança',
    vazioPagante: 'Nenhuma cobrança ainda',
    vazioIsentaTexto: 'O acesso vem do vínculo com a clínica, e vínculo não gera cobrança. Caso a clínica nos informe que ele foi encerrado, o acesso fica suspenso até você assinar — nada aparece aqui sem você escolher.',
    vazioPaganteTexto: 'Quando a assinatura começar, cada cobrança aparece aqui com a data e o valor.',
    inicioDoTeste: 'Início do teste grátis',
    comprovante: 'O comprovante oficial de cada cobrança',
  },

  /* ============================================================
     O ACESSO SUSPENSO — /suspenso

     ⚠️ O QUE ESTÁ SUSPENSO É A ASSINATURA, E NÃO A CONTA. As duas linhas
     abaixo são a diferença entre um aviso e uma ameaça.
     ============================================================ */
  suspenso: {
    clinicaGenerica: 'a clínica que acompanhava você',
    nadaApagado: 'Nada foi apagado. Peso, aplicações, sintomas, exames e fotos continuam onde estavam.',
    nadaCobrado: 'Nada foi cobrado, e nada vai ser sem você escolher.',
    verOsPlanos: 'Ver os planos',
    outroCodigo: 'Tenho outro código',
  },

};
