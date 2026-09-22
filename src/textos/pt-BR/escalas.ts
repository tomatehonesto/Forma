/* ============================================================
   AS RÉGUAS — o que cada número quer dizer

   Um número sozinho pede que a pessoa invente a régua. "3 de energia é
   bom?" não tem resposta, e cada dia acaba respondido com uma régua
   diferente da do dia anterior — o que estraga justamente a série que o
   aplicativo vai ler depois. A legenda devolve a régua pronta.

   ⚠️⚠️ ESTE É O TEXTO QUE A PESSOA TOCA, e não o que ela lê. Trocar um
   degrau de lugar não muda uma frase: muda o que fica GRAVADO. O 4 de
   hoje passaria a significar outra coisa que o 4 de ontem, e a série que
   alimenta o radar, as metas e o resumo da consulta ficaria sem sentido.
   Quem traduzir precisa manter a ORDEM e a distância entre os degraus,
   antes de pensar nas palavras.

   ⚠️ AS FRASES SÃO CURTAS PORQUE SÃO MANCHETE DO CAMPO, e começam com
   maiúscula pelo mesmo motivo: quem lê "Deu para o dia" embaixo de
   "ENERGIA" está lendo uma resposta, não uma etiqueta.

   ⚠️ E TODAS EM PRIMEIRA PESSOA E SEM CONCORDÂNCIA DE GÊNERO: a mesma
   frase serve para quem usa o aplicativo, seja quem for. Em idioma com
   gênero obrigatório no particípio, isto é o primeiro problema a
   resolver — e a saída é a mesma que foi usada aqui, escolher verbo que
   não peça concordância.
   ============================================================ */

export const escalas = {
  /* ---------- os quatro eixos do check-in ---------- */
  /* 1–5 na tela, 0–10 no armazenamento. */
  energia: ['Sem força', 'Arrastando o dia', 'Deu para o dia', 'Com disposição', 'Energia de sobra'],

  /* Horas dormidas — as pontas absorvem o que passa delas.
     ⚠️ O ESPAÇO ANTES DO "h" É INQUEBRÁVEL (U+00A0), e não um espaço
     comum. Em caixa estreita a linha quebrava entre o número e a letra, e
     sobrava um "h" órfão na segunda linha.

     ⚠️ ELE É INVISÍVEL, e eu já errei isto uma vez: redigitei os cinco
     degraus com espaço comum e nada acusou até a conferência byte a byte.
     Quem traduzir copia e cola, não redigita. */
  sono: ['5 h ou menos', 'Cerca de 6 h', 'Cerca de 7 h', 'Cerca de 8 h', '9 h ou mais'],

  /* 1–5 dos dois lados, sem conversão. */
  humor: ['Um dia difícil', 'Meio para baixo', 'Um dia normal', 'Um bom dia', 'Um ótimo dia'],

  /* ⚠️ FOME() É O CONTRÁRIO DE SACIEDADE, e o radar lê como saciedade. Por
     isso 1 é a fome MENOR: a régua sobe junto com o sintoma, como as
     outras. Inverter a ordem aqui inverte o eixo do radar. */
  fome: ['Sem fome', 'Pouca fome', 'Fome normal', 'Bastante fome', 'Fome o dia todo'],

  /* ============================================================
     OS SINTOMAS() — cada um com a sua régua

     ⚠️ CADA UM PIORA DE UM JEITO, e é por isso que não há uma escala
     genérica servindo a todos. O 4 da náusea é "quase vomitei"; o 4 da
     constipação é "três dias sem ir". Uma régua única diria "atrapalhou
     o dia" para os dois, que não descreve nenhum.
     ============================================================ */

  /* A rede de segurança, para um sintoma que ainda não tem régua própria. */
  intensidade: ['Mal percebi', 'Leve', 'Incomodou', 'Atrapalhou o dia', 'Tomou conta do dia'],

  sintoma: {
    nausea: ['Um leve embrulho', 'Enjoo indo e vindo', 'Enjoo constante', 'Quase vomitei', 'Vomitei'],
    constip: ['Fui com esforço', 'Um dia sem ir', 'Dois dias sem ir', 'Três dias sem ir', 'Quatro dias ou mais'],
    /* ⚠️ O PISO É UMA FAIXA, E NÃO "UMA VEZ", e isto é decisão clínica e
       não de redação: uma ida mole não é diarreia. A definição da OMS
       começa em três evacuações moles no dia. Com o piso em uma vez, a
       escala chamaria de sintoma o que ainda está dentro do normal de
       muita gente — e uma coluna que chama tudo de diarreia não serve
       para ler nada depois.

       Então: o degrau 1 é o "mole, mas ainda não é isso", o 2 é onde a
       OMS passa a chamar de diarreia, e o 5 é a faixa que a graduação
       clínica trata como grave. Quem traduzir tem de manter os cortes
       nos mesmos números, não nas mesmas palavras. */
    diarreia: ['Uma ou duas vezes', 'Três vezes', 'Quatro vezes', 'Cinco a seis vezes', 'Sete ou mais'],
    refluxo: ['Queimação leve', 'Depois das refeições', 'Várias vezes no dia', 'Atrapalhou comer', 'Não consegui deitar'],
    fadiga: ['Cansaço leve', 'Cansei mais rápido', 'Precisei desacelerar', 'Precisei deitar', 'Não saí da cama'],
    cefaleia: ['Uma fisgada', 'Incomodou de leve', 'Precisei de remédio', 'Atrapalhou o dia', 'Fiquei no escuro'],
    tontura: ['Leve desequilíbrio', 'Ao levantar rápido', 'Várias vezes no dia', 'Precisei me segurar', 'Não fiquei de pé'],
    /* ⚠️ VÔMITO SE CONTA, NÃO SE GRADUA: "atrapalhou o dia" não diz nada
       sobre vomitar, e o número de vezes é o que a equipe vai perguntar. */
    vomito: ['Uma vez', 'Duas vezes', 'Três vezes', 'Quatro ou mais', 'Não consegui parar'],
    dor: ['Um desconforto', 'Cólica leve', 'Cólica constante', 'Precisei parar o dia', 'Dor que não passou'],
  },

  /* ============================================================
     O INTESTINO()

     ⚠️ AS CHAVES SÃO DADO E NÃO SE TRADUZEM: 'normal', 'preso', 'solto' e
     'alterna' são o que fica gravado em `gut`. Só o rótulo vem daqui.

     ⚠️ E "ALTERNOU" É VALOR DE PRIMEIRA CLASSE, não caso estranho. Prender
     e soltar são as duas pontas do mesmo efeito — o medicamento
     desacelera o trato inteiro —, e nos dados de mundo real os dois
     aparecem quase empatados. Era a resposta que a pessoa tinha e que a
     tela não aceitava.
     ============================================================ */
  intestino: {
    normal: 'Normal',
    preso: 'Preso',
    solto: 'Solto',
    alterna: 'Alternou',
  },

  /* ============================================================
     OS SINTOMAS(), NAS DUAS LISTAS

     ⚠️ SÃO DUAS LISTAS PORQUE SÃO DUAS PERGUNTAS. A de PERGUNTAR tem o
     intestino como um só item — a pessoa responde uma vez, e o eixo tem
     dois lados. A de LER tem os dois separados, porque "intestino em
     quatro dias" somaria dias presos com dias soltos e viraria um número
     que não quer dizer nada.

     ⚠️ OS `id` SÃO DADO. Só os rótulos passam por aqui.
     ============================================================ */
  /* ⚠️ A RÉGUA SEM RESPOSTA DIZ QUE ESTÁ SEM RESPOSTA, e não zero. É a
     mesma regra dos três silêncios da Jornada: um dia sem resposta é um
     dia sem resposta. Mora no topo de `escalas` porque quem a escreve é o
     componente da régua, que serve a mais de uma tela. */
  aindaNaoRespondi: 'Ainda não respondi',

  nomes: {
    nausea: 'Náusea',
    intestino: 'Intestino',
    vomito: 'Vômito',
    dor: 'Dor abdominal',
    refluxo: 'Refluxo',
    fadiga: 'Fadiga',
    cefaleia: 'Dor de cabeça',
    tontura: 'Tontura',
    outro: 'Outro',
    preso: 'Intestino preso',
    solto: 'Intestino solto',
  },

  /* ============================================================
     A TELA DE SINTOMAS

     ⚠️⚠️ A FRASE DO PADRÃO É REDAÇÃO, E NÃO CÁLCULO. `padraoDoCiclo`
     devolve QUAIS dias pesam e se eles são do começo ou do fim; as seis
     frases abaixo são a leitura disso. A conta fica em derive, em
     qualquer idioma; a frase fica aqui.

     ⚠️ E ELA PODE RESPONDER "AINDA NÃO DÁ PARA DIZER" — `cicloPoucos`.
     Essa resposta também é informação, e é honesta: a versão anterior
     desta tela afirmava em texto fixo que a náusea se concentrava nos
     dois primeiros dias, igual para todo mundo, com cara de achado sobre
     aquela pessoa. Um aplicativo de tratamento que inventa achado clínico
     é pior do que um que cala, porque o achado vai para a consulta.

     ⚠️ O ORDINAL É DE CADA IDIOMA. "no 3º dia depois" em português, "on
     day 3 after" em inglês, "am 3. Tag danach" em alemão — não há sufixo
     que sirva para os cinco, e por isso `cicloDiaN` é função e não
     concatenação na tela.

     ⚠️ E OS QUATRO RÓTULOS DE `sentir` SÃO APELIDOS. O nome do indicador é
     a pergunta inteira — "Horas de sono", "Energia no dia" —, e a
     primeira palavra dele não serve de rótulo: cortar em branco dava um
     chip escrito "Horas". Por isso são chaves próprias, e não um recorte
     de `metas.indicadores`.
     ============================================================ */
  tela: {
    titulo: 'Sintomas',
    diasRespondidos: (quantos: number, de: number) =>
      `${quantos} ${quantos === 1 ? 'dia respondido' : 'dias respondidos'} nos últimos ${de}`,
    nenhumDia: (de: number) => `Nenhum dia respondido nos últimos ${de}`,

    /* ---------- a semana ---------- */
    nestaSemana: 'Nesta semana',
    semRespostaSemana: 'Você ainda não respondeu sobre sintomas nesta semana. É no check-in que eles entram.',
    fazerCheckin: 'Fazer o check-in',
    nenhumSintoma: 'Nenhum sintoma nesta semana',
    nenhumSintomaSub: (respondidos: number) =>
      `${respondidos} ${respondidos === 1 ? 'dia respondido' : 'dias respondidos'}, nenhum com queixa.`,
    diasDe: (dias: number, respondidos: number) =>
      `${dias} de ${respondidos} ${respondidos === 1 ? 'dia' : 'dias'}`,
    noPiorDia: (legenda: string) => `No pior dia: ${legenda}`,
    citacao: (texto: string) => `“${texto}”`,
    voceEscreveuEm: (data: string) => `Você escreveu em ${data}`,

    /* ---------- o ciclo ---------- */
    aoLongoDoCiclo: 'Ao longo do ciclo',
    aoLongoNota: (dias: number) =>
      `Média do enjoo em cada dia depois da aplicação, de ${dias} ${dias === 1 ? 'dia respondido' : 'dias respondidos'}.`,
    /* O rótulo do dia zero na régua de barras. */
    dose: 'dose',

    cicloParecido: 'Nos dias respondidos até agora, o enjoo aparece parecido ao longo de todo o ciclo — ele não está seguindo a dose.',
    cicloPoucos: 'Ainda são poucos dias respondidos para dizer se o enjoo acompanha o ciclo. Respondendo mais dias, essa conta fica de pé.',
    cicloInicio1: 'O enjoo pesa mais no dia da aplicação.',
    cicloInicioN: (dias: number) => `O enjoo pesa mais nos ${dias} primeiros dias depois da aplicação.`,
    cicloFim1: 'O enjoo pesa mais na véspera da próxima aplicação.',
    cicloFimN: (dias: number) => `O enjoo pesa mais nos ${dias} dias que antecedem a próxima aplicação.`,
    cicloDia0: 'no dia da aplicação',
    cicloDiaN: (dia: number) => `no ${dia}º dia depois`,
    cicloEspalhado: (lista: string) => `O enjoo pesa mais ${lista}.`,

    /* ---------- como você se sentiu ---------- */
    comoSeSentiu: 'Como você se sentiu',
    respostasEm14: (quantas: number) =>
      `${quantas} ${quantas === 1 ? 'resposta' : 'respostas'} em 14 dias`,
    semRespostas: 'Sem respostas ainda',
    sentir: {
      energia: 'Energia',
      humor: 'Humor',
      sono: 'Sono',
      fome: 'Fome',
    },
  },

  /* ============================================================
     A TELA DO CHECK-IN

     ⚠️ "DEIXAR EM BRANCO TAMBÉM É UMA RESPOSTA" é a frase que sustenta o
     resto do aplicativo. Um dia sem resposta aparece como dia sem
     resposta, e não como zero — e é por isso que a tela pode pedir quatro
     coisas sem cobrar nenhuma.
     ============================================================ */
  telaCheckin: {
    titulo: 'Check-in',
    pergunta: 'Como foi o seu dia?',
    lead: 'Responda o que fizer sentido. Deixar em branco também é uma resposta.',
    salvar: 'Salvar check-in',

    energia: 'Energia',
    fome: 'Fome',
    sono: 'Sono',
    humor: 'Humor',

    teveSintoma: 'Teve algum sintoma?',
    comoFoiIntestino: 'Como foi o intestino?',
    qualOutroSintoma: 'Qual foi o outro sintoma?',
    outroPlaceholder: 'Ex.: gosto metálico na boca',
    intensidadeDe: (sintoma: string) => `${sintoma} · intensidade`,
  },
};
