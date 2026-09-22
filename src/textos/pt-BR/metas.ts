/* ============================================================
   AS METAS — os números que o aplicativo cobra e os que só a pessoa sabe

   Três catálogos diferentes moram aqui, e é bom saber qual é qual antes
   de traduzir qualquer linha:

     · OS ALVOS       os quatro números do perfil — proteína, água,
                      movimento e a meta de peso. O aplicativo cobra os
                      três primeiros todo dia.

     · OS INDICADORES o que o aplicativo sabe CONTAR. Uma meta medida é um
                      indicador mais um número, e a porcentagem é conta de
                      verdade.

     · AS PESSOAIS    o que só a pessoa sabe dizer quando chegou. Vestir
                      uma calça, voltar à praia, parar de beliscar de
                      madrugada. Sem porcentagem, porque não existe
                      sessenta por cento de caber numa calça.

   ⚠️ AS PESSOAIS SÃO CATEGORIAS E NÃO FRASES PRONTAS. A lista diz de QUE
   coisa se trata, e a pergunta do segundo toque é que a torna dela. Quem
   traduzir precisa manter as duas peças: o nome curto para a lista e a
   pergunta que obriga a especificar.

   ⚠️ E O PREFIXO É O QUE FECHA A FRASE. A pessoa escreve um pedaço —
   "vôlei", "o vestido do casamento" — e o `monta` devolve a sentença
   inteira. Em outro idioma a ordem pode ser outra; o que não pode é a
   frase sair pela metade ou repetir o verbo.

   ⚠️ NENHUMA CATEGORIA ASSUME FAMÍLIA, CORPO OU DINHEIRO. Uma meta que
   não cabe na vida de quem está lendo é pior do que campo vazio.
   ============================================================ */

export const metas = {
  /* ============================================================
     OS ALVOS — os quatro números que o aplicativo cobra
     ============================================================ */
  alvos: {
    /* ⚠️ ERA A MESMA FRASE ESCRITA TRÊS VEZES, uma em cada um dos números
       do dia. Ela é a mesma porque o fato é o mesmo — o protocolo conta
       dias contra os três —, e três cópias divergiriam na primeira vez
       que alguém melhorasse a redação de uma.

       O que ela faz: diz o que a pessoa não tem como saber olhando a
       folha. Baixar a meta de proteína faz o protocolo da equipe marcar
       cumprido sem que nada tenha mudado no prato. Não trava e não julga.

       A meta de peso não tem ressalva porque nenhum protocolo conta
       contra ela. */
    ressalvaDoProtocolo: 'O protocolo da semana conta os dias em que você bateu este número. Mudando ele aqui, muda também o que o protocolo da sua equipe passa a considerar cumprido.',

    prot: {
      nome: 'Proteína por dia',
      onde: 'Cobrada na alimentação e no protocolo',
      origem: 'Calculado do seu peso, a 1,2 g por quilo',
      un: 'g',
      escreve: (gramas: number) => String(gramas),
    },
    waterMl: {
      nome: 'Hidratação por dia',
      origem: 'Calculado do seu peso, da sua idade e do seu nível de atividade',
      onde: 'Cobrada na hidratação e no protocolo',
    },
    exercMin: {
      nome: 'Exercício por dia',
      onde: 'É a tracejada da semana, no exercício',
      /* ⚠️ ESTE NÃO É CALCULADO, e seria fácil escrever que é para a frase
         ficar igual às outras duas. São 60 minutos para todo mundo, e o
         cadastro não pergunta nada que mudasse isso. */
      origem: 'O padrão do aplicativo, igual para todo mundo',
      un: 'min',
      escreve: (minutos: number) => String(minutos),
    },
    peso: {
      /* ⚠️ O MESMO NOME DO CADASTRO. A pergunta lá é "qual é a sua meta de
         peso?", e aqui o campo se chamava "peso de referência" — dois
         nomes para o mesmo número, e quem quisesse mudar o que respondeu
         no cadastro tinha de adivinhar qual dos dois era. */
      nome: 'Meta de peso',
      onde: 'Mede a viagem inteira, na Jornada',
      /* A única dos quatro que a pessoa escolheu de verdade — e é por isso
         que a frase dela não fala de conta nenhuma. */
      origem: 'Você escolheu no cadastro',
    },
  },

  /* ============================================================
     OS INDICADORES — o que o aplicativo sabe contar

     ⚠️ O NOME NA LISTA É GENÉRICO DE PROPÓSITO: "Horas de sono", e não
     "Dormir 7h+". Escolher a coisa e escolher o número são duas decisões,
     e a segunda é a pessoal — sete horas é o que a literatura repete e
     ainda assim é palpite sobre a vida de alguém.

     ⚠️ `origem` DIZ DE ONDE SAI O NÚMERO, e é o que decide se vale a pena
     criar a meta: quem nunca registra refeição precisa ver, antes de
     escolher, que a meta de proteína vai ficar parada em zero.

     ⚠️ `nomes` É O QUE SE CONTA, no singular e no plural, e `femininas`
     é a concordância dele. Sem esse par, o "11 de 13 noites registradas"
     sai como "registrados". Isso era feito comparando a palavra com
     "noite" — o que quebra calado no dia em que entrar um indicador
     feminino novo.
     ============================================================ */
  indicadores: {
    sono: {
      nome: 'Horas de sono',
      pergunta: 'Quantas horas por noite?',
      origem: 'Do sono que você responde no check-in',
      nomes: ['noite', 'noites'] as [string, string],
      femininas: true,
      un: 'h',
      escreve: (horas: number) => `${horas} h`,
      rotulo: (horas: number) => `Dormir ${horas}h por noite`,
      conta: (horas: number) => `Noites com ${horas}h ou mais`,
    },
    energia: {
      nome: 'Energia no dia',
      pergunta: 'De que nível para cima conta?',
      origem: 'Da energia que você responde no check-in',
      nomes: ['dia', 'dias'] as [string, string],
      femininas: false,
      un: 'de 5',
      escreve: (nivel: number) => `${nivel} de 5`,
      rotulo: (nivel: number) => `Energia ${nivel} ou mais`,
      conta: (nivel: number) => `Dias com energia ${nivel} ou mais, de 1 a 5`,
    },
    humor: {
      nome: 'Humor no dia',
      pergunta: 'De que nível para cima conta?',
      origem: 'Do humor que você responde no check-in',
      nomes: ['dia', 'dias'] as [string, string],
      femininas: false,
      un: 'de 5',
      escreve: (nivel: number) => `${nivel} de 5`,
      rotulo: (nivel: number) => `Humor ${nivel} ou mais`,
      conta: (nivel: number) => `Dias com humor ${nivel} ou mais, de 1 a 5`,
    },
    /* ⚠️ ENJOO E FOME CONTAM AO CONTRÁRIO: o acerto é o dia em que o
       número ficou BAIXO, e por isso a pergunta é "até que nível ainda
       conta como bom". Trocar por "de que nível para cima" inverte a meta
       inteira sem que nada acuse. */
    enjoo: {
      nome: 'Enjoo',
      pergunta: 'Até que nível ainda conta como bom?',
      origem: 'Do enjoo que você marca no check-in',
      nomes: ['dia', 'dias'] as [string, string],
      femininas: false,
      un: 'de 5',
      escreve: (nivel: number) => `${nivel} de 5`,
      rotulo: (nivel: number) => `Enjoo ${nivel} ou menos`,
      conta: (nivel: number) => `Dias com enjoo ${nivel} ou menos, de 1 a 5`,
    },
    fome: {
      nome: 'Fome',
      pergunta: 'Até que nível ainda conta como bom?',
      origem: 'Da fome que você responde no check-in',
      nomes: ['dia', 'dias'] as [string, string],
      femininas: false,
      un: 'de 5',
      escreve: (nivel: number) => `${nivel} de 5`,
      rotulo: (nivel: number) => `Fome ${nivel} ou menos`,
      conta: (nivel: number) => `Dias com fome ${nivel} ou menos, de 1 a 5`,
    },
    prot: {
      nome: 'Proteína por dia',
      pergunta: 'Quantos gramas por dia?',
      origem: 'Das refeições que você registra',
      nomes: ['dia', 'dias'] as [string, string],
      femininas: false,
      escreve: (gramas: number) => `${gramas} g`,
      rotulo: (gramas: number) => `Comer ${gramas} g de proteína`,
      conta: (gramas: number) => `Dias com ${gramas} g ou mais`,
    },
    /* Os três de baixo recebem a quantidade JÁ ESCRITA — "2,5 L", "85 fl
       oz" —, porque a unidade é decisão de logic/medidas e não de idioma.
       Aqui entra só a frase em volta dela. */
    agua: {
      nome: 'Hidratação por dia',
      pergunta: 'Quanto por dia?',
      origem: 'Do que você registra na hidratação',
      nomes: ['dia', 'dias'] as [string, string],
      femininas: false,
      rotulo: (quanto: string) => `Beber ${quanto} de água`,
      conta: (quanto: string) => `Dias com ${quanto} ou mais`,
    },
    exerc: {
      nome: 'Minutos de movimento',
      pergunta: 'Quantos minutos por dia?',
      origem: 'Dos treinos que você registra',
      nomes: ['dia', 'dias'] as [string, string],
      femininas: false,
      escreve: (minutos: number) => `${minutos} min`,
      rotulo: (minutos: number) => `Se mexer ${minutos} min por dia`,
      conta: (minutos: number) => `Dias com ${minutos} min ou mais`,
    },
  },

  /* ============================================================
     AS METAS PESSOAIS — o que o aplicativo não mede

     ⚠️ O TEMPO VERBAL ESTAVA ESCOLHENDO A VIDA DA PESSOA, e foi arrumado.
     "Voltar a praticar" pressupõe que ela praticou; quem quer começar
     natação aos quarenta não cabia na única categoria do aplicativo que
     falava de esporte. As frases neutras ficam neutras.

     A única que continua pressupondo é a do lugar — e ela DIZ isso no
     próprio nome, que é a diferença entre pressupor e perguntar.

     ⚠️ OS EXEMPLOS VÃO NA PERGUNTA, NUNCA NA DICA DO CAMPO. Exemplo dentro
     de campo é sugestão: quem lê um antes de pensar na própria meta
     escreve a meta do exemplo. Na pergunta eles são o que devem ser — a
     forma da resposta, não a resposta. A `dica` é neutra de propósito.
     ============================================================ */
  pessoais: {
    roupa: {
      nome: 'Uma peça de roupa',
      pergunta: 'Qual peça você quer vestir? A do fundo do armário, uma que você viu numa vitrine — a que vier à cabeça.',
      dica: 'Digite a peça de roupa',
      monta: (r: string) => `Vestir ${r}`,
    },
    esporte: {
      nome: 'Um esporte',
      pergunta: 'Qual esporte você quer praticar? Vale o que você já fez um dia e o que nunca experimentou.',
      dica: 'Digite o esporte',
      monta: (r: string) => `Praticar ${r}`,
    },
    folego: {
      /* "Algo do dia a dia", e não "sem perder o fôlego": a barreira pode
         ser joelho, pode ser dor, pode ser vergonha — e nomear a errada
         exclui quem tem a outra. */
      nome: 'Algo do dia a dia',
      pergunta: 'O que você quer conseguir fazer sem se cansar? Subir a escada de casa, carregar as compras, andar até ali sem parar no meio.',
      dica: 'Digite a atividade',
      monta: (r: string) => `Conseguir ${r}`,
    },
    sentir: {
      nome: 'Como eu me sinto',
      pergunta: 'Como você quer se sentir? Com mais disposição, mais à vontade no próprio corpo — do jeito que fizer sentido para você.',
      dica: 'Digite como você quer se sentir',
      monta: (r: string) => `Me sentir ${r}`,
    },
    foto: {
      nome: 'Uma foto',
      pergunta: 'Que foto você quer ter? Uma na praia, uma com quem você ama, ou só uma em que você se reconheça.',
      dica: 'Digite a foto',
      monta: (r: string) => `Tirar ${r}`,
    },
    lugar: {
      /* ⚠️ O NOME DIZ A PRESSUPOSIÇÃO, e é a única que sobrou. Aqui ela é
         o assunto: não é sobre conseguir, é sobre voltar — quem deixa de
         ir à praia raramente deixou por não dar conta. Quem quer um lugar
         novo tem "Outra meta". */
      nome: 'Um lugar que você deixou de ir',
      pergunta: 'Aonde você quer voltar? A praia, a piscina, a festa de alguém — o lugar que anda ficando de fora.',
      dica: 'Digite o lugar',
      monta: (r: string) => `Voltar a ${r}`,
    },
    comecar: {
      nome: 'Um hábito para criar',
      pergunta: 'O que você quer começar a fazer? Caminhar de manhã, cozinhar no domingo, dormir mais cedo.',
      dica: 'Digite o hábito',
      monta: (r: string) => `Começar a ${r}`,
    },
    largar: {
      nome: 'Um hábito para largar',
      pergunta: 'O que você quer parar de fazer? Comer em pé, beliscar de madrugada — o que for seu.',
      dica: 'Digite o hábito',
      monta: (r: string) => `Parar de ${r}`,
    },
    /* A saída para o que não cabe em nenhuma categoria — a mesma coisa
       que as outras, só que sem prefixo: aqui a frase inteira é de quem
       escreve, e o `monta` devolve o que ela escreveu. */
    livre: {
      nome: 'Outra meta',
      pergunta: 'O que você quer conseguir? Escreva do seu jeito — guardamos exatamente como você escrever.',
      dica: 'Digite a sua meta',
      monta: (r: string) => r,
    },
  },

  /* ============================================================
     OS PRAZOS — relativos, e opcionais de verdade

     Quem põe prazo numa meta de tratamento pensa em "uns três meses", não
     em 14 de dezembro. E a primeira opção é NÃO ter prazo, selecionada:
     uma meta sem data continua sendo meta; o que ela não pode é ganhar um
     prazo que a pessoa não escolheu.
     ============================================================ */
  prazos: {
    nao: 'Sem prazo',
    umMes: 'Em 1 mês',
    tresMeses: 'Em 3 meses',
    seisMeses: 'Em 6 meses',
    umAno: 'Em 1 ano',
  },

  /* ============================================================
     A LINHA DE CADA META, NA JORNADA
     ============================================================ */
  jornada: {
    /* ⚠️ A CONTA, E NÃO A PORCENTAGEM DE NOVO. A linha dizia "85%" à
       direita e "85% das noites recentes" embaixo — o mesmo número duas
       vezes. "11 de 13 noites" responde de quantas noites falamos. */
    contagem: (quantas: number, de: number, nome: string, femininas: boolean) =>
      `${quantas} de ${de} ${nome} ${femininas ? 'registradas' : 'registrados'}`,
    /* ⚠️ ELA RECEBE O MESMO `femininas` DA CONTA DE CIMA, e é por isso
       que a linha existe assim. O feminino estava escrito em duro aqui —
       "registradas" —, numa frase que recebe o plural dos oito
       indicadores: sete deles são "dias". A tela dizia "sem dias
       registradas ainda", e nenhuma trava acusava, porque para o
       TypeScript é só uma string. */
    semRegistros: (plural: string, femininas: boolean) =>
      `sem ${plural} ${femininas ? 'registradas' : 'registrados'} ainda`,

    /* A pessoal não tem fração: tem a data, que é a parte da conquista
       que se conta para alguém. */
    conquistadaEm: (data: string) => `conquistada em ${data}`,
    /* ⚠️ O PRAZO É FATO, NÃO COBRANÇA. Passado e não conquistada, a linha
       diz que ele passou e para aí — sem vermelho e sem "atrasada". Num
       tratamento de meses, uma data que escorregou é a coisa mais comum
       do mundo, e a meta continua de pé. */
    ate: (data: string) => `até ${data}`,
    oPrazoEra: (data: string) => `o prazo era ${data}`,
    vocemarca: 'você marca quando chegar',
  },

  /* ============================================================
     AS DUAS TELAS DE META — a lista e a folha

     ⚠️ ELAS ESTAVAM NO CÓDIGO, e foi o alemão que denunciou: a lista abria
     "Metas" e "Os números do dia" em português ao lado de "Zielgewicht" e
     "Eiweiß pro Tag", que já vinham daqui. Meia tela traduzida é pior que
     nenhuma — a pessoa conclui que o aplicativo está quebrado.

     ⚠️ TRÊS MODOS MORAM NA MESMA FOLHA, e por isso os nomes das chaves
     dizem qual: `alvo` é um dos quatro números que o aplicativo cobra,
     `nova` é criar uma meta pessoal, e `uma` é abrir uma meta da lista.
     ============================================================ */
  tela: {
    /* ---------- a lista ---------- */
    titulo: 'Metas',
    /* Os três já chegam escritos, na unidade de quem lê. */
    progresso: (perdido: string, total: string, alvo: string) => `${perdido} de ${total} até ${alvo}`,
    novaMeta: 'Nova meta',

    numerosTitulo: 'Os números do dia',
    numerosNota: 'É o que as telas de água, alimentação e exercício cobram, e o que o protocolo conta.',

    /* ⚠️ A ETIQUETA DIZ DE QUEM É O NÚMERO, e são três estados. O terceiro
       é o que importa: quando a pessoa MUDA um número que a equipe
       definiu, a etiqueta não some nem mente — ela passa a dizer que foi
       alterada. Ela pode mudar, é o corpo dela; o que o aplicativo não faz
       é esconder que mudou.

       ⚠️ E "VIA", E NÃO "DA": o número passou PELA equipe, e foi assim que
       chegou aqui — dito numa consulta e anotado depois. "Da sua equipe"
       soa a posse, como se a linha fosse da clínica e não dela. */
    equipeMira: (valor: string) => `Sua equipe mira ${valor}`,
    alterada: 'Alterada por você',
    viaEquipe: 'Via sua equipe',

    /* "As suas" porque a capa da tela já se chama Metas, e uma seção com o
       nome da tela lê como se a anterior não fosse meta. O que separa as
       duas é quem cobra: aquelas o aplicativo conta sozinho, estas a
       pessoa escreveu. */
    suasTitulo: 'As suas metas',
    suasNota: 'As medidas nós acompanhamos pelos seus registros. As suas, você marca.',

    vazioTitulo: 'Nenhuma meta ainda',
    vazioTexto: 'Escreva uma coisa que você quer conseguir. Ela fica aqui até acontecer.',

    /* ---------- a folha de um dos quatro números ---------- */
    definidoPelaEquipe: 'Definido pela sua equipe',
    novoValor: 'Novo valor',
    salvar: 'Salvar',

    hoje: (valor: string) => `Hoje: ${valor}`,
    /* ⚠️ TRÊS RESPOSTAS PARA "DE ONDE VEIO ESTE NÚMERO", e a do cadastro
       vem de `alvos.<chave>.origem`. As outras duas são estas. */
    origemSua: 'Um número seu',
    origemDaEquipe: (por: string, quando: string) => `Definido por ${por}, anotado em ${quando}`,
    origemVoceEm: (quando: string) => `Você definiu este número em ${quando}`,
    /* ⚠️ A JUNÇÃO É DO IDIOMA. O português emenda com ponto e espaço; quem
       traduzir decide como as duas frases se encostam, e o `.trim()` do
       lado de lá cuida do caso em que a segunda é vazia. */
    origemEmuda: (origem: string, muda: string) => `${origem}. ${muda}`,
    mudaPeso: 'É o ponto de chegada combinado com a equipe, e mexer nele muda a régua da Jornada e da evolução — sem apagar nada do que já foi registrado.',
    mudaOutros: 'A mudança vale a partir de agora: os dias já registrados continuam valendo o que valiam, e o que muda é contra o que eles passam a ser comparados.',

    /* ⚠️ NENHUMA DAS TRÊS RESSALVAS TRAVA NADA — é o corpo dela e o
       aplicativo dela. O que muda entre as três é o que ela SABE ao mudar:
       quem sobrescreve 110 g de uma nutricionista merece ler isso antes, e
       merece continuar vendo, depois, que aquele 110 existiu. */
    travadoTitulo: (por: string) => `Quem definiu foi ${por}`,
    travadoTexto: 'Este número é parte do seu tratamento, e por isso não se muda aqui. Se ele não serve mais — outra orientação, uma restrição que apareceu, uma equipe nova —, remova a anotação na Área médica e ele volta a ser seu.',
    divergeTitulo: 'Este número não é o da sua equipe',
    divergeTexto: (por: string, dela: string, nosso: string) =>
      `${por} definiu ${dela}, e estamos cobrando ${nosso}. Guardamos os dois: dá para voltar ao dela na Área médica, ou levar a diferença para a próxima consulta.`,
    recomendadoTitulo: 'Este é o valor recomendado',

    verAnotacao: 'Ver a anotação da sua equipe',
    anotacaoSub: (por: string, valor: string) => `${por} · ${valor}`,

    /* ---------- a folha de uma meta nova ---------- */
    novaSub: 'Uma coisa sua. Guardamos para você, e quem marca é você',
    escolhaOTipo: 'Escolha o tipo',
    escrevaDoSeuJeito: 'Escreva do seu jeito',

    guardarMeta: 'Guardar meta',
    respondaParaGuardar: 'Responda para guardar',
    prazoRotulo: 'Prazo (opcional)',

    /* ⚠️ AS ASPAS SÃO DO IDIOMA, e por isso a frase inteira é função: o
       português usa "assim", o alemão usa „assim“, e o francês « assim ».
       Montar isso fora daqui obrigaria a tela a escolher por todo mundo. */
    vaiAparecer: (frase: string, ate: string) => `Vai aparecer assim: "${frase}"${ate}.`,
    vaiAparecerAte: (data: string) => `, até ${data}`,
    aindaNaoAteMarcar: 'Ela fica em ainda não até você marcar. No dia em que acontecer, guardamos a data junto.',

    /* ---------- a folha de uma meta da lista ---------- */
    metaTitulo: 'Meta',
    naoEncontrei: 'Não encontrei esta meta',
    apagadaEmOutraTela: 'Ela pode ter sido apagada em outra tela.',
    subPessoal: 'Meta sua, marcada por você',
    subMedida: 'Meta medida pelos seus check-ins',

    conquistada: 'Conquistada',
    aindaNao: 'Ainda não',
    consegui: 'Consegui',
    aindaNaoConsegui: 'Ainda não consegui',
    apagar: 'Apagar',

    /* ⚠️ A MEDIDA NÃO SE MARCA NEM SE APAGA À MÃO, e a última frase diz por
       quê: uma caixinha por cima deixaria a pessoa contradizer o próprio
       registro. */
    contamosPorVoce: 'Esta nós contamos por você',
    contamosTexto: 'Sai dos seus check-ins dos últimos catorze dias, e só dos dias que você respondeu. Não dá para marcar à mão — e é isso que faz o número valer alguma coisa.',
  },
};
