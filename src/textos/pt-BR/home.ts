import { medidas } from './medidas';

/* ============================================================
   A HOME E A JORNADA — as metas do dia, os cartões e a linha do tempo

   É o texto que mais gente vê depois do ciclo da dose, e o que menos
   parece texto: quase tudo aqui é rótulo curto ao lado de um número.

   ⚠️ TODO NÚMERO EXIBIDO VEM COM UM VEREDITO, e é a palavra que a pessoa
   procura primeiro. O valor diz a medida; a palavra diz se está bom. Sem
   ela a pessoa faz a conta sozinha, e num aplicativo de saúde faz errado.

   ⚠️ E NENHUM VEREDITO DAQUI DÁ NOTA À PESSOA. "Abaixo da meta" qualifica
   o número; "Você não se esforçou" qualificaria quem o produziu. A
   diferença some fácil na tradução, e é o arquivo inteiro que depende
   dela.
   ============================================================ */

/* ⚠️⚠️ OS NOMES DO CORPO VÊM DE medidas.corpo, E NÃO ESTÃO ESCRITOS
   AQUI. Eles estavam — e estavam também em confirmacoes, que é a folha
   que aparece depois de medir. Duas cópias da mesma palavra divergem na
   primeira vez que alguém melhora a redação de uma delas. */
export const home = {
  /* ============================================================
     AS TRÊS METAS DO DIA

     ⚠️ "META BATIDA" NÃO É COMEMORAÇÃO, É ESTADO. Ela ocupa o mesmo lugar
     do "Faltam 27 g" — é a mesma linha dizendo a mesma coisa do outro
     lado. Um "Parabéns!" ali mudaria o que o cartão é.
     ============================================================ */
  metas: {
    proteina: 'Ingestão de proteína',
    agua: 'Beber mais água',
    exercicio: 'Exercitar diariamente',
    batida: 'Meta batida',
    faltamProteina: (gramas: number) => `Faltam ${gramas} g`,
    /* A quantidade chega já escrita, com a unidade de quem lê — litro ou
       onça. Ver logic/medidas. */
    faltamAgua: (quanto: string) => `Faltam ${quanto}`,
    faltamExercicio: (minutos: number) => `Faltam ${minutos} min`,
  },

  /* ============================================================
     OS VEREDITOS DE NÚMERO

     ⚠️ "PERTO DA META" É BOA NOTÍCIA, e é de propósito: 85% da meta de
     proteína é um bom dia, e chamar isso de "abaixo" ensina a pessoa a
     ignorar a palavra. O terceiro degrau existe para o primeiro continuar
     significando alguma coisa.
     ============================================================ */
  veredito: {
    naMeta: 'Na meta',
    pertoDaMeta: 'Perto da meta',
    abaixoDaMeta: 'Abaixo da meta',
    /* ⚠️ "EM QUEDA" É O RAMO QUE SALVA O CARTÃO DE GORDURA CORPORAL. Quem
       está acima da meta mas caindo desde o começo não está falhando —
       está no meio do caminho, que é onde quase todo mundo está. */
    emQueda: 'Em queda',
    acimaDaMeta: 'Acima da meta',
  },

  /* ============================================================
     O CARTÃO DE PESO

     ⚠️ O TÍTULO TAMBÉM MUDA, E NÃO SÓ O NÚMERO. "Peso perdido" em cima de
     "+3,3 kg" é uma contradição dentro do mesmo cartão — e a palavra
     errada dói mais do que o número. "Variação do peso" é o nome neutro
     do que aquele número é, e só aparece quando precisa.
     ============================================================ */
  peso: {
    perdido: 'Peso perdido',
    variacao: 'Variação do peso',
    meta: (quanto: string, unidade: string) => `Meta: ${quanto} ${unidade}`,
  },

  /* ⚠️ "ESTÁVEL", E NÃO "−0,0". Um número que não se mexeu não variou para
     lado nenhum, e a palavra é essa. Ele não é boa notícia nem má. */
  estavel: 'Estável',

  /* ============================================================
     A LINHA DO TEMPO

     Os sete tipos são o filtro da tela, e cada chip carrega a contagem
     dele. Os rótulos estão no plural porque nomeiam o conjunto.
     ============================================================ */
  tipos: {
    checkin: 'Check-ins',
    aplicacao: 'Aplicações',
    peso: 'Peso',
    refeicao: 'Refeições',
    exercicio: 'Exercícios',
    consulta: 'Consultas',
    exame: 'Exames',
  },

  evento: {
    aplicacao: (dose: string, unidade: string) => `Aplicação ${dose} ${unidade}`,
    peso: 'Peso',
    /* A primeira pesagem não tem anterior para comparar, então no lugar da
       variação vai o que ela é. */
    pesoInicial: 'Peso inicial',
    checkin: 'Check-in',
    exercicio: 'Exercício',
    minDeMovimento: (minutos: number) => `${minutos} min de movimento`,
    proteinaDaRefeicao: (quanto: string) => `Proteína ${quanto}`,
    consulta: (tipo: string) => `Consulta ${tipo}`,
    marcadoresDe: (quantos: number, fonte: string) => `${quantos} marcadores · ${fonte}`,
    marcadoresDetalhe: (nome: string, quantos: number, fonte: string) =>
      `${nome} · ${quantos} marcadores · ${fonte}`,
    compartilhado: 'Compartilhado',

    /* O resumo do check-in: o que foi respondido, separado por ponto. */
    gramasDeProteina: (gramas: number) => `${gramas} g proteína`,
    horasDeSono: (horas: number) => `${horas}h de sono`,

    /* ⚠️ O VEREDITO DO DIA VEM DO HUMOR, e as três palavras são curtas de
       propósito: elas ocupam a coluna da direita, ao lado de um número.
       "Difícil" é a mais importante das três — ela nomeia o dia ruim sem
       chamá-lo de fracasso. */
    diaBem: 'Bem',
    diaNeutro: 'Neutro',
    diaDificil: 'Difícil',

    /* As respostas do check-in, com o nome de cada pergunta. */
    respostaHumor: 'Humor',
    respostaEnergia: 'Energia',
    respostaFome: 'Fome',
    /* O único campo em que a pessoa escreveu, em vez de escolher. */
    respostaOutroSintoma: 'Outro sintoma',
  },

  /* ============================================================
     A SEMANA, EM CAPÍTULOS

     ⚠️ O RESUMO CONTA O QUE A SEMANA RENDEU, e não lista o que houve. Por
     isso cada tipo tem singular e plural próprios — "1 pesagem" e "3
     pesagens" —, e não um "(s)" pendurado.
     ============================================================ */
  semana: {
    checkin: ['check-in', 'check-ins'] as [string, string],
    peso: ['pesagem', 'pesagens'] as [string, string],
    refeicao: ['refeição', 'refeições'] as [string, string],
    exercicio: ['exercício', 'exercícios'] as [string, string],
    consulta: ['consulta', 'consultas'] as [string, string],
    exame: ['exame', 'exames'] as [string, string],
    contagem: (quantos: number, nome: string) => `${quantos} ${nome}`,
    /* ⚠️ SEMANA VAZIA TEM FRASE PRÓPRIA, e não um espaço em branco: uma
       semana sem registro aconteceu, e o capítulo dela existe. */
    semRegistros: 'Sem registros nesta semana',

    /* Os destaques numéricos do ciclo. */
    hidratacao: 'Hidratação',
    proteina: 'Proteína',
    exercicioMetrica: 'Exercício',
    pesoMetrica: 'Peso',
    litrosPorDia: (quanto: string) => `${quanto} L/dia`,
    gramasPorDia: (quanto: number) => `${quanto} g/dia`,
    minutos: (quanto: number) => `${quanto} min`,
    deltaLitros: (quanto: string) => `${quanto} L`,
    deltaGramas: (quanto: string) => `${quanto} g`,
    deltaMinutos: (quanto: string) => `${quanto} min`,
  },

  /* ============================================================
     O QUE MUDOU DESDE O COMEÇO

     Cada linha é um número de antes contra um de agora. O rótulo é o nome
     da medida; o veredito é a palavra ao lado.
     ============================================================ */
  mudancas: {
    peso: medidas.corpo.peso,
    cintura: medidas.corpo.cintura,
    gorduraCorporal: medidas.corpo.gordura,
    /* ⚠️ A ÚNICA EM QUE SUBIR É A BOA NOTÍCIA: músculo perdido num
       emagrecimento é o que o tratamento tenta evitar. O rótulo não diz
       isso — quem diz é o tom —, mas quem traduzir precisa saber. */
    massaMagra: medidas.corpo.massaMagra,
    naReferencia: 'Na referência',
    foraDaReferencia: 'Fora da referência',
    pressao: 'Pressão',
    /* ⚠️ "ESTÁVEL" ERA O QUE SOBRAVA DE TUDO QUE NÃO FOSSE QUEDA, e a
       pressão subindo catorze pontos saía como estável — em verde. Subir
       tem nome. */
    pressaoEmQueda: 'Em queda',
    pressaoEmAlta: 'Em alta',
    pressaoEstavel: 'Estável',
  },

  /* ============================================================
     A META DE PESO, NA JORNADA
     ============================================================ */
  metaDePeso: {
    /* "Chegar a 68 kg", e não "Meta: 68 kg": a lista é de coisas a
       conseguir, e o verbo é o que a faz parecer uma delas. */
    chegarA: (peso: string) => `Chegar a ${peso}`,
    alcancada: 'meta alcançada',
    faltam: (quanto: string) => `faltam ${quanto}`,
  },

  /* ⚠️ SÓ O NOME DA APPLE MUDA DE IDIOMA — "Apple Saúde" é "Apple Health"
     em inglês, porque é a Apple que traduz o nome do próprio aplicativo.
     Health Connect, Garmin, Fitbit e Withings são marcas e ficam no
     código, sem passar por aqui: marca não se traduz. */
  fontes: {
    appleSaude: 'Apple Saúde',
  },

  /* ============================================================
     A TELA DA JORNADA — o painel, os temas e a linha do tempo

     ⚠️ ELA MORA EM `home` PORQUE É A MESMA CONVERSA: os rótulos de tipo,
     os plurais da semana e os nomes do que mudou já estavam aqui, e a
     Jornada é a tela que os desenha por inteiro. Um módulo `jornada`
     separado teria de importar metade deste.

     ⚠️⚠️ E OS TRÊS SILÊNCIOS SÃO DIFERENTES, o que é a regra que mais
     custa manter na tradução:

       · `semRegistro`  a pessoa não respondeu — não sabemos
       · `semQueixas`   ela respondeu, e não teve nada
       · `semNaSemana`  a semana existiu e não teve registro nenhum

     Colapsar dois num só faz o aplicativo AFIRMAR zero sobre um dia de
     que ele não sabe nada.
     ============================================================ */
  telaJornada: {
    ultimos7: 'SEUS ÚLTIMOS 7 DIAS',
    doseEm: (quando: string) => `dose ${quando}`,
    diasComCheckin: (feitos: number, aplicadas: number, vividas: number) =>
      `${feitos} de 7 dias com check-in · ${aplicadas} de ${vividas} semanas com aplicação`,
    semanaASemana: 'Semana a semana. Toque para ver o que marcou cada ciclo.',
    /* ---------- o painel ---------- */
    semanaEDia: (semana: number, dia: number) => `SEMANA ${semana} · DIA ${dia}`,
    /* ⚠️ OS TRÊS PESOS CHEGAM JÁ ESCRITOS, com a unidade de quem lê. Eles
       vinham com "kg" pregado na tela — e quem lê em libra via o número
       certo com a unidade errada. */
    noInicio: (peso: string) => `${peso} no início`,
    hoje: 'hoje',
    faltam: (peso: string) => `faltam ${peso}`,

    /* ---------- os temas do dia ---------- */
    protocolos: 'Protocolos',
    sinaisVitais: 'Sinais vitais',
    refeicoesContadas: (quantas: number) => `${quantas} refeições`,
    aguaHoje: (quanto: string) => `${quanto} hoje`,
    minutosHoje: (minutos: number) => `${minutos} min hoje`,
    indicadores: (quantos: number) => `${quantos} ${quantos === 1 ? 'indicador' : 'indicadores'}`,
    feitasDeTotal: (feitas: number, total: number) => `${feitas} de ${total}`,

    semRegistro: 'sem registro',
    semQueixas: 'sem queixas na semana',
    /* O sintoma chega com o nome dele; a caixa é regra de idioma. */
    sintomaEmDias: (sintoma: string, dias: number) =>
      `${sintoma.toLowerCase()} em ${dias} ${dias === 1 ? 'dia' : 'dias'}`,

    /* ---------- o estoque ---------- */
    dosesNaCaneta: (restam: number, total: number, semanas: number) =>
      `${restam} de ${total} doses na caneta · cerca de ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,

    /* ---------- os cabeçalhos ---------- */
    /* ⚠️ O LINK DIZ O NOME DO DESTINO, e dizia "Ver todas" — que é uma
       instrução, não um lugar. É a mesma regra que tirou o "Ir para" dos
       botões da Home. */
    oQueJaMudou: 'O que já mudou',
    evolucao: 'Evolução',
    suasMetas: 'Suas metas',
    metas: 'Metas',
    oDiaADia: 'O dia a dia',
    seuTratamento: 'Seu tratamento',
    verTudo: 'Ver tudo',

    /* ---------- a linha do tempo ---------- */
    porSemana: 'Por semana',
    semana: (numero: number) => `Semana ${numero}`,
    doseAjustada: 'dose ajustada',
    semRegistrosNaSemana: 'Sem registros nesta semana.',
    nadaNesteTipo: 'Nada registrado neste tipo ainda',

    /* A meta pessoal não tem porcentagem: tem estado. */
    metaFeita: 'feita',
    metaAberta: 'aberta',
  },

  /* ============================================================
     A TELA DA HOME — o carrossel do dia e o que vem abaixo dele

     ⚠️ O MÓDULO JÁ TINHA UMA CHAVE CHAMADA `tela`, E ELA ERA A JORNADA.
     Num arquivo chamado `home`, "tela" só podia ser uma coisa, e era a
     outra. Virou `telaJornada`, e esta nasce com o nome por extenso.

     ⚠️⚠️ O CARROSSEL NÃO TEM NÚMERO FIXO DE CARTÕES. Cada um tem a
     própria condição, e quem não tem o que dizer não entra — por isso as
     frases daqui vêm em famílias soltas, e não numa lista ordenada: a
     ordem é da tela, a redação é daqui.

     ⚠️ E NENHUM CARTÃO ACUSA A PESSOA. "A aplicação de ontem não está
     registrada" é o que sabemos; "você não aplicou" é o que não temos
     como saber, e seria acusação em cima de um palpite. A segunda linha
     dá as duas saídas sem escolher uma — e essa é a regra que mais se
     perde na tradução, porque a versão acusadora costuma ser a mais
     curta.
     ============================================================ */
  telaInicio: {
    /* ---------- o cabeçalho ---------- */
    bomDia: 'Bom dia',
    boaTarde: 'Boa tarde',
    boaNoite: 'Boa noite',
    linhaDoDia: (dia: string, semana: number) => `${dia} • Semana ${semana}`,

    /* ---------- a aplicação que não foi registrada ---------- */
    semRegistro: 'SEM REGISTRO',
    semRegistroOntem: 'A aplicação de ontem não está registrada.',
    semRegistroDias: (dias: number) => `A aplicação de ${dias} dias atrás não está registrada.`,
    semRegistroCorpo: 'Se você aplicou, dá para registrar agora. Se não aplicou, o ciclo se refaz a partir da próxima.',
    semRegistroCta: 'Registrar aplicação',

    /* ---------- a consulta de hoje ou de amanhã ---------- */
    aConsulta: 'A CONSULTA',
    consultaHoje: 'Sua consulta é hoje.',
    consultaAmanha: 'Sua consulta é amanhã.',
    consultaCorpo: 'Levo o seu período organizado — peso, adesão, sintomas e as perguntas que valem a pena.',
    consultaCta: 'Ver o resumo',

    /* ---------- o recipiente acabando ----------

       ⚠️ `acabou` RECEBE O SUJEITO PRONTO — "A caneta", "O frasco" —, com
       artigo e maiúscula, porque é o nominativo e `formas.oA` sabe
       devolvê-lo. `verRecipiente` recebe as DUAS formas de propósito: a
       com artigo, para quem constrói "Ver a caneta", e a nua, para quem
       escreve o rótulo sem artigo. Ver PENDENCIAS, item 26. */
    acabou: (oRecipiente: string) => `${oRecipiente} acabou.`,
    restaUmaDose: (onde: string) => `Resta uma dose ${onde}.`,
    receitaCorpo: 'Uma receita nova leva alguns dias entre o pedido e a farmácia — começar agora evita parar no meio.',
    pedirRenovacao: 'Pedir renovação',
    verRecipiente: (oRecipiente: string, _recipiente: string) => `Ver ${oRecipiente}`,

    /* ---------- a mensagem do dia ---------- */
    entendaOPorQue: 'Entenda o por quê',

    /* ---------- a próxima dose ---------- */
    proximaAplicacao: 'PRÓXIMA APLICAÇÃO',
    /* ⚠️ O REMÉDIO NÃO É O SUJEITO. "Mounjaro é hoje" trata a caixinha
       como se ela tivesse agenda; quem aplica é a pessoa. */
    hojeEDiaDeAplicar: 'Hoje é dia de aplicar sua dose.',
    proximaDose: (quando: string) => `Sua próxima dose é ${quando}.`,
    doseCorpo: (medicamento: string, dose: string, local: string) =>
      `${medicamento} ${dose} · ${local} sugerido.`,
    verAplicacao: 'Ver a aplicação',
    criarLembrete: 'Criar um lembrete',

    /* ---------- o check-in e a sequência ----------

       ⚠️ O NÚMERO VEM DESENHADO À PARTE, grande e em lima, e a frase só
       traz as palavras ao lado dele. Por isso `diasSeguidos` não escreve
       a contagem: ela recebe o número só para decidir o plural.

       ⚠️ E O HÍFEN DE "check‑in" É O NÃO-SEPARÁVEL (U+2011). A caixa tem
       120 px fixos, e com o hífen comum a palavra partia ao meio no fim
       da linha. */
    checkinFeito: 'Check-in feito',
    fazerCheckin: 'Fazer check-in',
    diasSeguidos: (dias: number): string => (dias === 1 ? 'dia de check‑in' : 'dias seguidos de check‑in'),

    /* ---------- as seções ----------

       ⚠️ O LINK DE SEÇÃO É O NOME DA TELA DO OUTRO LADO, e não o gesto:
       "Metas", e não "Ir para metas". A seta ao lado já diz o gesto, e
       escrever as duas coisas é dizer a mesma coisa duas vezes. */
    metasDiarias: 'Suas metas diárias',
    metasLink: 'Metas',
    registrar: 'Registrar',
    evolucao: 'Sua evolução',
    evolucaoLink: 'Evolução',
    gPorDia: 'g/dia',
    semMedida: 'sem medida',

    /* ---------- quem cuida ---------- */
    quemCuida: 'Quem cuida de você',
    areaMedica: 'Área médica',
    mensagens: 'Mensagens',
    novasMensagens: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'nova mensagem' : 'novas mensagens'}`,
    nenhumaMensagem: 'Nenhuma mensagem nova',
    proximaConsulta: 'Próxima consulta',
    consultaEm: (data: string, diaDaSemana: string) => `${data} • ${diaDaSemana}`,
    solicitarReceita: 'Solicitar nova receita',
    solicitarReceitaSub: 'Uma mensagem para a sua equipe',
    acompanhaSeuTratamento: 'Acompanha o seu tratamento',
    resumoParaConsulta: 'Resumo para consulta',
    resumoParaConsultaSub: 'Peso, adesão, sintomas e exames num documento só',
    anotarConsulta: 'Anotar uma consulta',
    anotarConsultaSub: 'Para avisarmos quando ela chegar perto',
    quemAcompanha: 'Quem acompanha você?',
    quemAcompanhaSub: 'Anote o nome e o resumo já sai endereçado para a próxima consulta.',
    preencherFicha: 'Preencher a ficha',
  },

  /* ============================================================
     A TELA DE UMA SEMANA — o capítulo aberto

     A ordem responde, nesta sequência, o que a pessoa pergunta quando
     volta a uma semana específica: o que eu fiz, como me senti, o que
     aconteceu, o que eu quis falar.

     ⚠️ O SELO É O SINGULAR EM CAIXA BAIXA, e `home.tipos` é o plural com
     inicial maiúscula. São formas diferentes da mesma palavra para
     trabalhos diferentes: `tipos` rotula um FILTRO ("Refeições"), o selo
     qualifica UM dia ("refeição"). Estavam escritos duas vezes, e a
     segunda cópia era uma constante de módulo — em português nos cinco
     idiomas. Ver PENDENCIAS, item 28.

     ⚠️ E AS ASPAS DA NOTA SÃO DE CADA IDIOMA. O português usa “ ”, o
     alemão „ “ e o francês « ». Escritas na tela, a nota de quem lê em
     alemão sairia com aspas inglesas.
     ============================================================ */
  telaSemana: {
    titulo: 'Semana',
    semanaN: (numero: number) => `Semana ${numero}`,
    vazio: 'Ainda não há semanas registradas.',
    lead: (periodo: string, dose: string) => `${periodo} · ${dose}`,

    /* ---------- o que eu fiz ---------- */
    aplicacao: 'Aplicação',
    semPesagem: 'sem pesagem',

    /* ---------- como eu me senti ---------- */
    comoSeSentiu: 'Como você se sentiu',
    diasRespondidos: (quantos: number) => `${quantos} de 7 dias respondidos`,
    sintomaDias: (legenda: string, dias: number) =>
      `${legenda} · ${dias} ${dias === 1 ? 'dia' : 'dias'}`,
    energia: 'Energia',
    energiaDe5: (media: string) => `${media} de 5`,

    /* ---------- o que aconteceu ---------- */
    diaADia: 'Dia a dia',
    diaComData: (diaDaSemana: string, data: string) => `${diaDaSemana}, ${data}`,
    selo: {
      aplicacao: 'aplicação',
      checkin: 'check-in',
      peso: 'pesagem',
      refeicao: 'refeição',
      exercicio: 'exercício',
      consulta: 'consulta',
      exame: 'exame',
    },

    /* ---------- o que eu quis falar ---------- */
    nota: 'Nota para a consulta',
    verTodas: 'Ver todas',
    nenhumaNota: 'Nenhuma nota nesta semana',
    anotadaEm: (data: string) => `Anotada em ${data}`,
    toqueParaEscrever: 'Toque para escrever uma',
  },

  /* ============================================================
     A FOLHA DE REGISTRAR — o que o botão do meio abre

     ⚠️ OS TRÊS ATALHOS COMPARAM COM O ALVO DO PERFIL, e não com o total
     desde a instalação. "12 registradas" não responde nada que alguém se
     pergunte antes de comer; "63 de 90 g" responde.

     ⚠️ E A QUEBRA DE LINHA DOS DOIS PRIMEIROS MORA NO TEXTO. "Me /
     hidratei" cabe em duas linhas no português e em uma no alemão — o \n
     escrito no JSX prendia a quebra ao português.
   ============================================================ */
  telaRegistrar: {
    titulo: 'O que deseja registrar?',

    checkinChapeu: 'CHECK-IN DIÁRIO',
    checkinFeito: 'Concluído hoje',
    checkinPendente: 'Como foi o seu dia?',
    checkinEditar: 'Editar',
    diasSeguidos: (dias: number): string => (dias === 1 ? 'dia seguido' : 'dias seguidos'),

    agua: 'Me\nhidratei',
    /* ⚠️ O ALVO CHEGA COM A UNIDADE DENTRO, e por isso não há "L" escrito
       aqui: quem está no imperial lê os dois números em onça, e a linha
       dizia "51 de 84 L" em cima de um número que já era onça. O `min`
       do exercício, logo abaixo, fica — minuto é minuto nos dois
       sistemas. Ver o alto de logic/medidas. */
    aguaSub: (bebido: string, alvo: string) => `${bebido} de ${alvo}`,
    exercicio: 'Me\nexercitei',
    exercicioSub: (feito: number, alvo: number) => `${feito} de ${alvo} min`,
    refeicao: 'Fiz uma refeição',
    refeicaoSub: (proteina: number, alvo: number) => `${proteina} de ${alvo} g`,

    levaUmMinuto: 'LEVA UM MINUTO',
    aplicacao: 'Apliquei a dose',
    peso: 'Acabei de me pesar',
    medidas: 'Medi meu corpo',
    exame: 'Recebi um exame',
    anotacao: 'Anotei algo para a consulta',
  },
  /* ============================================================
     COMO LEMOS O SEU RITMO — a conta por trás da etiqueta

     ⚠️ O AVISO DO PÉ CITA A ETIQUETA ENTRE ASPAS, e as aspas mudam de
     idioma: “ ” no português, „ “ no alemão, « » no francês. Por isso a
     frase inteira mora aqui, e não montada no JSX com as aspas
     digitadas do lado de fora.

     ⚠️ E A ETIQUETA CHEGA JÁ MINÚSCULA, pela mão de `comum.noMeio` —
     que no alemão devolve o texto como veio, porque lá a palavra no meio
     da frase não perde a maiúscula.
     ============================================================ */
  telaRitmo: {
    titulo: 'Como lemos o seu ritmo',
    sub: 'A etiqueta olha para a constância do tratamento, não para a velocidade da perda de peso.',

    aplicacoes: 'Aplicações em dia',
    aplicacoesSub: (aplicadas: number, vividas: number) =>
      `${aplicadas} de ${vividas} ${vividas === 1 ? 'semana' : 'semanas'}`,

    intervalo: 'Intervalo entre doses',
    intervaloEmDia: (dias: number) => `${dias} ${dias === 1 ? 'dia' : 'dias'}, sem atrasos longos`,
    intervaloMaior: (dias: number) => `maior intervalo: ${dias} ${dias === 1 ? 'dia' : 'dias'}`,

    sintomas: 'Sintomas relatados',
    sintomasLeves: 'Leves',
    sintomasModerados: 'Leves a moderados',
    sintomasFortes: 'Moderados a fortes',

    /* Os selos são minúsculos de propósito: é rótulo de canto, e não
       frase. Nenhum deles é vermelho — a tela explica uma conta, e não
       cobra. */
    seloOk: 'ok',
    seloAtencao: 'atenção',
    seloIrregular: 'irregular',
    seloEstavel: 'estável',
    seloEmAlta: 'em alta',

    avisoTitulo: 'Uma semana diferente não muda a etiqueta',
    avisoTexto: (etiqueta: string) =>
      `Ela não sobe nem desce por quanto você perdeu, e não existe versão dela que diga que a semana foi ruim. Hoje ela lê “${etiqueta}”.`,

    entendi: 'Entendi',
  },
  /* ============================================================
     PROTOCOLOS — o combinado da semana

     O título da tela NÃO está aqui: ele é `telaJornada.protocolos`, o
     mesmo que a linha da Jornada escreve. Duas cópias seriam duas
     chances de a porta e a sala terem nomes diferentes.
     ============================================================ */
  telaProtocolos: {
    semanaN: (n: number) => `Semana ${n}`,
    tudoCumprido: 'tudo cumprido',
    cumpridasDeTotal: (feitas: number, total: number) => `${feitas} de ${total} cumpridas`,
    aplicacaoEm: (quando: string) => `aplicação ${quando}`,

    /* Só aparece com vínculo: falar com a equipe precisa de equipe do
       outro lado, e não do fato de ter médico. */
    falarComEquipe: 'Falar com a equipe',

    estaSemana: 'Esta semana',
    ressalva: 'Estas metas são jeitos de tirar mais do tratamento, e não uma lista de cobranças — não fechar tudo está tudo bem. Quem conduz é a dose e o acompanhamento. O que ficar aberto recomeça na semana que vem, e as contagens acendem sozinhas pelos seus registros.',

    ressalvaDaSemana: 'As metas são as de hoje, medidas nos registros desta semana.',

    semanasAnteriores: 'Semanas anteriores',
    semanasAnterioresNota: 'As metas de hoje, medidas nos registros de cada semana.',
  },
  /* ============================================================
     UM DIA — a folha de um quadradinho da fileira de sete

     "Peso" e "Check-in" NÃO estão aqui: são `evento.peso` e
     `evento.checkin`, o nome do registro na linha do tempo, e é o mesmo
     fato. Só "Aplicação" mora aqui, porque em `evento` aquele nome já é
     uma função que leva dose e unidade.
     ============================================================ */
  telaDia: {
    registrosDeste: 'Registros deste dia',
    diaDeAplicacao: 'Dia de aplicação',
    nadaRegistrado: 'nada registrado ainda',

    aplicacao: 'Aplicação',
    doseLinha: (med: string, dose: string, unidade: string, estado?: string) =>
      `${med} ${dose} ${unidade}${estado ? ` · ${estado}` : ''}`,
    prevista: 'prevista para hoje',
    semRegistroMinusculo: 'sem registro',

    /* A régua e o número na mesma frase, com o máximo dela: energia vai a
       dez e humor vai a cinco, e quem sabe disso é quem chama. */
    escalaDe: (nome: string, valor: number, max: number) => `${nome} ${valor} de ${max}`,
    respondidoNesteDia: 'Respondido neste dia',
    semRegistro: 'Sem registro',

    /* ⚠️ DOIS SELOS PARA A MESMA PALAVRA, e a diferença é o gênero do que
       foi feito: a aplicação é feita, o check-in e o peso são feitos. Em
       alemão os dois são "erledigt", e é por isso que a escolha é do
       catálogo e não da tela. */
    seloFeita: 'feita',
    seloFeito: 'feito',
    seloRegistrar: 'registrar',

    semPrazo: 'Dias sem registro ficam em branco. Você pode preencher depois, sem prazo.',
  },
};
