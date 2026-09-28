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
    exercicio: 'Movimentar-se todo dia',
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
    peso: 'Pesagens',
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
  /* A tela que a Jornada e o perfil abrem — e que era a última folha
     grande ainda em português. Título, aba e "Semana N" não nascem aqui:
     são os mesmos de `telaJornada`, porque link e destino com nomes
     diferentes fazem a pessoa achar que chegou noutro lugar. */
  telaHistorico: {
    exportar: 'Exportar',
    lead: (data: string) => `Tudo que você registrou desde ${data}.`,
    semPesagem: 'sem pesagem',
    semanasVazias: (quantas: number) =>
      quantas === 1 ? 'Uma semana ficou quase vazia' : `${quantas} semanas ficaram quase vazias`,
    semanasVaziasTexto: 'Semanas sem registro continuam na lista, do mesmo tamanho que as outras. Elas não somem nem viram falha.',
    registrosDesde: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'registro' : 'registros'} desde o início do tratamento`,
    /* Sem dose registrada, "desde o início do tratamento" contaria um
       começo que o diário não tem. */
    registrosAteAqui: (quantos: number) =>
      `${quantos} ${quantos === 1 ? 'registro' : 'registros'} até aqui`,
  },

  telaJornada: {
    ultimos7: 'SEUS ÚLTIMOS 7 DIAS',
    doseEm: (quando: string) => `dose ${quando}`,
    diasComCheckin: (feitos: number, aplicadas: number, vividas: number) =>
      `${feitos} de 7 dias com check-in · ${aplicadas} de ${vividas} ${vividas === 1 ? 'semana' : 'semanas'} com aplicação`,
    /* Sem aplicação registrada, a linha conta só o check-in: "0 de 1
       semanas com aplicação" media um tratamento que ainda não começou a
       ser registrado. */
    diasComCheckinSo: (feitos: number) =>
      `${feitos} de 7 dias com check-in`,
    /* A faixa da fase, antes de haver fase: de onde o ciclo vai contar. */
    primeiraDose: 'Primeira dose',
    primeiraDoseTexto: 'O ciclo começa a contar da primeira dose que você registrar.',
    semanaASemana: 'Semana a semana. Toque para ver o que marcou cada ciclo.',
    verAsSemanas: (quantas: number) => `Ver as ${quantas} semanas`,
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
    /* ⚠️⚠️ ELA DIZIA "NA CANETA" À MÃO, nos seis idiomas — "in the
       pen", "en la pluma", "dans le stylo", "im Pen", "nella penna". A
       linha ignorava a forma e prometia caneta a quem toma comprimido.
       E o recipiente nem é o assunto: o assunto é quanto ainda há.

       ⚠️ E A CONTA É O QUE RESTA. "3 de 4" obriga a subtrair para saber
       se dá para esperar a próxima consulta. */
    dosesRestantes: (restam: number, semanas: number) =>
      restam === 0
        ? 'Nenhuma dose restante'
        : `${restam === 1 ? 'Resta 1 dose' : `Restam ${restam} doses`} · cerca de ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`,

    /* ---------- os cabeçalhos ---------- */
    /* ⚠️ O LINK DIZ O NOME DO DESTINO, e dizia "Ver todas" — que é uma
       instrução, não um lugar. É a mesma regra que tirou o "Ir para" dos
       botões da Home. */
    oQueJaMudou: 'O que já mudou',
    /* Sem duas pesagens não há o que comparar: a seção diz quando passa a
       ter, em vez de mostrar "80,0 → 80,0 · Estável". */
    oQueJaMudouVazio: 'A partir da segunda pesagem, o que mudou aparece aqui.',
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

    /* A meta pessoal não tem porcentagem: tem estado. E meta não se
       "faz" nem fica "aberta": ela está em andamento até ser alcançada. */
    metaFeita: 'alcançada',
    metaAberta: 'em andamento',
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
       devolvê-lo. Aqui o recipiente é o sujeito de verdade: o que acabou
       foi ELE, e a frase seguinte oferece a receita nova.

       ⚠️ O BOTÃO, NÃO. Ele era `verRecipiente` e dizia "Ver a caneta" —
       e o destino se chama Medicamento desde que deixou de se chamar
       pelo recipiente. Porta e destino dizem o mesmo nome, e some com
       ele o caso gramatical que obrigava o alemão a receber duas formas
       do mesmo substantivo (era o item 26 do PENDENCIAS). */
    acabou: (oRecipiente: string) => `${oRecipiente} acabou.`,
    restaUmaDose: (onde: string) => `Resta uma dose ${onde}.`,
    receitaCorpo: 'Uma receita nova leva alguns dias entre o pedido e a farmácia — começar agora evita parar no meio.',
    pedirRenovacao: 'Pedir renovação',
    verMedicamento: 'Ver o medicamento',

    /* ---------- a mensagem do dia ---------- */
    entendaOPorQue: 'Entenda o porquê',
    /* o destaque de boas-vindas, na primeira semana (logic/apresentacao) */
    boasVindasChapeu: 'BOAS-VINDAS',
    boasVindasTitulo: (nome: string): string => (nome ? `Que bom ter você aqui, ${nome}` : 'Que bom ter você aqui'),
    boasVindasCorpo: 'Você registra o tratamento, e nós organizamos o resto: dose, sintomas, alimentação e evolução.',
    boasVindasCta: 'Veja como podemos ajudar',

    /* ---------- a próxima dose ---------- */
    proximaAplicacao: 'PRÓXIMA APLICAÇÃO',
    /* ⚠️ O REMÉDIO NÃO É O SUJEITO. "Mounjaro é hoje" trata a caixinha
       como se ela tivesse agenda; quem aplica é a pessoa. */
    hojeEDiaDeAplicar: 'Hoje é dia de aplicar sua dose.',
    proximaDose: (quando: string) => `Sua próxima dose é ${quando}.`,
    /* ⚠️ O LOCAL VEM DEPOIS DOS DOIS-PONTOS, COM O NOME DITO ANTES.
       "Coxa (dir.) sugerido" errava o gênero uma semana em cada três: o
       particípio concordava com "local", que não estava na frase, e não
       com "coxa", que estava. Com "local sugerido:" na frente, a
       concordância é com a palavra escrita — e o francês e o italiano,
       que tinham o mesmo defeito, seguem a mesma forma. */
    doseCorpo: (medicamento: string, dose: string, local: string) =>
      `${medicamento} ${dose} · local sugerido: ${local}.`,
    verAplicacao: 'Ver suas aplicações',
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
    /* Os hábitos que entram em "Sua evolução" para quem ainda não mede o
       corpo — ver `indicadoresDaEvolucao`, em logic/derive. */
    forca: 'Treinos de força',
    dias: (n: number): string => (n === 1 ? 'dia' : 'dias'),
    nosUltimos7: 'Nos últimos 7 dias',

    /* ---------- quem cuida ---------- */
    quemCuida: 'Quem cuida de você',
    areaMedica: 'Área médica',
    mensagens: 'Mensagens',
    novasMensagens: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'nova mensagem' : 'novas mensagens'}`,
    nenhumaMensagem: 'Nenhuma mensagem nova',
    proximaConsulta: 'Próxima consulta',
    consultaEm: (data: string, diaDaSemana: string) => `${data} • ${diaDaSemana}`,
    semConsulta: 'Nenhuma consulta marcada',
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
  /* ---- a apresentação: como podemos ajudar (app/apresentacao) ---- */
  apresentacao: {
    pular: 'Pular',
    continuar: 'Continuar',
    comecar: 'Começar',
    /** o leitor de tela diz em que página está */
    pagina: (i: number, n: number): string => `${i} de ${n}`,
    /* quem toma comprimido não tem local de aplicação: a frase da dose muda */
    dose: { titulo: 'Dose e ciclo', texto: 'Lembramos da dose na hora, sugerimos onde aplicar da próxima vez e avisamos antes de o remédio acabar.', textoOral: 'Lembramos da dose na hora e avisamos antes de o remédio acabar.' },
    estado: { titulo: 'Como você está', texto: 'Um check-in de menos de um minuto por dia. Com o tempo, mostramos o que mexe com o seu apetite, o seu sono e o seu humor.' },
    comida: { titulo: 'Alimentação', texto: 'Acompanhamos a proteína e a água do dia, e lemos a foto do seu prato quando você pede.' },
    evolucao: { titulo: 'Evolução', texto: 'O peso, as medidas e as metas que vão além da balança, num lugar só.' },
    consultas: { titulo: 'Consultas', texto: 'Montamos um resumo para você levar à consulta, com o que mudou desde a última.' },
    companheiro: { titulo: 'Companheiro', texto: 'Uma dúvida sobre o tratamento, a qualquer hora: é só perguntar.' },
    /* ⚠️ AS VITRINES SÃO EXEMPLO, e não o diário de ninguém: números e
       frases de ilustração, sem o nome da pessoa. As unidades seguem o
       mercado (libras e onças no inglês). */
    vitrine: {
      proxima: 'PRÓXIMA DOSE',
      dia: 'Quinta, 2 de outubro',
      dose: '5 mg',
      local: 'Abdômen, lado esquerdo',
      lembrete: 'Lembrete às 20:00',
      energia: 'Energia',
      fome: 'Fome',
      humor: 'Humor',
      padraoChapeu: 'UM PADRÃO',
      padrao: 'Nos dias com mais água, a fome da tarde é menor.',
      proteina: 'Proteína',
      proteinaValor: '62 de 90 g',
      agua: 'Água',
      aguaValor: '1,4 de 2,5 L',
      prato: 'Frango assado',
      pratoProteina: '38 g de proteína',
      peso: 'Peso',
      pesoValor: '−6,4 kg em 12 semanas',
      meta1: 'Correr 5 km',
      meta2: 'Vestir o vestido azul',
      resumo: 'Resumo para a consulta',
      r1: 'Peso: −6,4 kg desde a última',
      r2: 'Enjoo em 2 dos 14 dias',
      r3: 'Dose de 5 mg, sem atrasos',
      pergunta: 'O que eu registro hoje?',
      resposta: 'Que tal o check-in e a água? Leva menos de um minuto.',
      /* o pedaço de tela atrás das peças: títulos e linhas de exemplo */
      tDose: 'Aplicações',
      tDoseOral: 'Doses',
      ciclo: 'Dia 5 de 7',
      cicloSub: 'do ciclo',
      h1d: 'Quinta, 25 de setembro',
      h1l: 'Abdômen, lado direito',
      h2d: 'Quinta, 18 de setembro',
      h2l: 'Coxa, lado esquerdo',
      tCheckin: 'Como você está hoje?',
      sono: 'Sono',
      tComida: 'Hoje',
      cafe: 'Café da manhã',
      cafePrato: 'Omelete',
      almoco: 'Almoço',
      lanche: 'Lanche',
      lanchePrato: 'Iogurte com granola',
      tEvolucao: 'Sua evolução',
      periodo: 'Últimas 12 semanas',
      r4: 'Metas: 1 de 2 cumprida',
      tCompanheiro: 'Companheiro',
      saudacao: 'Oi! Pode perguntar o que quiser sobre o tratamento.',
    },
  },

  /* ============================================================
     OS PRIMEIROS PASSOS — o cartão da Home de quem acabou de chegar
     (logic/primeirosPassos, ui/primeirosPassos)

     ⚠️ CADA ITEM É UMA LEITURA DO ESTADO, e o texto diz o que falta — não
     o que a pessoa "deveria" fazer. O subtítulo é o porquê, numa linha: é
     ele que faz alguém tocar num item que parece burocracia.

     ⚠️ O NOME DO APLICATIVO DE SAÚDE VEM DO APARELHO ("Apple Saúde" ou
     "Health Connect"), e não se traduz. Por isso o item é função.

     ⚠️ E A FORMA DECIDE A PALAVRA DA APLICAÇÃO: quem toma comprimido
     registra a primeira dose. As duas frases vêm escritas por inteiro,
     como no catálogo das formas — trocar só o substantivo é como a
     concordância quebra no primeiro idioma com gênero diferente.

     ⚠️ "TUDO PRONTO" FALA NA VOZ DO PRODUTO, o "nós": quem acompanha
     somos nós, e não a tela.
     ============================================================ */
  primeirosPassos: {
    titulo: 'Primeiros passos',
    /** o que o leitor de tela diz depois do título de um item cumprido */
    feito: 'Feito',
    plano: 'Seu plano está pronto',
    medicacao: 'Defina a sua medicação',
    medicacaoSub: 'É dela que saem a dose, o ciclo e os lembretes',
    aplicacao: (injetavel: boolean): string => (injetavel ? 'Registre a sua primeira aplicação' : 'Registre a sua primeira dose'),
    aplicacaoSub: 'É dela que contamos o ciclo e a próxima dose',
    checkin: 'Faça o primeiro check-in',
    checkinSub: 'Como você está hoje, em menos de um minuto',
    meta: 'Defina uma meta além do peso',
    metaSub: 'O que mais você quer que mude, além da balança',
    lembretes: 'Permita os lembretes',
    lembretesSub: 'Para o aviso da dose tocar na hora',
    saude: (app: string) => `Conecte o ${app}`,
    saudeSub: 'O peso da balança entra sozinho',
    /* Os dois do aparelho — aviso e app de saúde — não seguram o cartão, e
       o subtítulo diz isso antes do porquê. */
    opcional: (porque: string) => `Opcional · ${porque}`,
    tudoPronto: 'Tudo pronto!',
    tudoProntoTexto: 'Seu diário está montado. Daqui em diante, é só registrar — o resto acompanhamos com você.',
    /* Com só o essencial feito — os opcionais ficaram —, a comemoração
       não diz "tudo": diz o que é, e onde o resto mora. */
    essencialPronto: 'O essencial está pronto!',
    essencialProntoTexto: 'O que ficou é opcional, e está no Perfil para quando você quiser.',
    fechar: 'Fechar',
    reabrir: 'Primeiros passos',
    reabrirSub: (feitos: number, total: number) => `${feitos} de ${total} feitos · mostrar na Home`,
  },
};
