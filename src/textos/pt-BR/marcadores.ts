/* ============================================================
   OS MARCADORES DE EXAME — o maior bloco de texto clínico do aplicativo

   Cada marcador tem até três textos, e eles respondem a três perguntas
   diferentes: o que a coisa É, o que MEXE nela, e o que se SABE sobre
   como ela costuma responder. Nenhum dos três lê o resultado de quem
   está na tela — ler resultado é de quem acompanha a pessoa.

   ⚠️⚠️ AS CHAVES DESTAS TABELAS NÃO SE TRADUZEM. "HbA1c", "Glicemia
   jejum", "Ferritina" são o que fica GRAVADO no registro do exame, em
   `e.marker` — não são rótulo de tela, são dado. Traduzi-las quebraria o
   vínculo entre o exame que alguém anotou ano passado e a tabela nova.

   O efeito colateral disso é que o NOME do marcador aparece hoje em
   português para quem lê em outro idioma, porque a tela mostra a própria
   chave. Separar nome de exibição de chave de registro é trabalho da peça
   do idioma, e está anotado em PENDENCIAS.

   ⚠️ E NENHUM DESTES TEXTOS PODE VIRAR CONDUTA NA TRADUÇÃO. As travas
   estão escritas em cada seção abaixo, e elas não são preferência de
   estilo: são o que separa um aplicativo que explica de um que prescreve.
   ============================================================ */

/* ============================================================
   O QUE O MARCADOR É — e não o que o SEU resultado quer dizer

   ⚠️ SÃO DUAS PERGUNTAS DIFERENTES, e o aplicativo respondia as duas com
   o mesmo parágrafo. "O que é HbA1c" é uma definição: vale para qualquer
   pessoa, em qualquer resultado, e não envelhece. "O que o seu HbA1c quer
   dizer" é leitura, muda a cada coleta e não deveria existir sem os
   números de quem está lendo.

   Aqui fica só a primeira. Duas frases: o que a coisa é, e por que ela é
   medida — na ordem em que alguém sem formação precisa delas.

   ⚠️ E NENHUMA DELAS DIZ SE ESTÁ BOM. Definição que insinua diagnóstico é
   diagnóstico com roupa de glossário; quem lê o resultado é quem
   acompanha a pessoa.
   ============================================================ */
/* ⚠️ `afeta` É UM COMPLEMENTO, E NÃO UMA FRASE. Ele entra sempre depois
   de um verbo que já carrega a ressalva — "faz diferença…", "é um bom
   sinal…" —, e por isso começa na preposição: escrito como frase inteira,
   cada marcador precisaria concordar em gênero com o próprio nome, e
   "Sua HbA1c" / "Seu ferritina" é o tipo de erro que só aparece em
   produção.

   ⚠️ E ELE NOMEIA O QUE ESTÁ EM JOGO, NÃO O QUE VAI ACONTECER. "para a
   saúde das artérias ao longo dos anos" é o território; "pode causar
   entupimento" seria prognóstico, que é de médico. A moldura da frase
   ("faz diferença para") é o que mantém a distância entre as duas
   coisas. */
export type SobreOMarcador = { oQueE: string; porQue: string; afeta: string };

/* ⚠️ `satisfies` E NÃO ANOTAÇÃO DE TIPO, nas três tabelas: a anotação
   alargaria a chave para `string` e o inglês poderia esquecer um marcador
   em silêncio. Com `satisfies`, o conjunto de chaves faz parte do
   contrato, e o `tsc` acusa o que faltou. */
const SOBRE = {
  /* ⚠️ NENHUMA DEFINIÇÃO CITA OUTRO MARCADOR NEM TERMO DE LAUDO. A do
     colesterol total dizia "como essa soma se divide entre HDL e LDL", o
     que só ajuda quem já sabe o que são HDL e LDL — e quem sabe não
     precisava da definição. A regra: se a frase precisa de uma segunda
     frase para ser entendida, ela não é uma definição, é um verbete. */
  'HbA1c': {
    oQueE: 'O quanto de açúcar ficou grudado nos glóbulos vermelhos do sangue.',
    porQue: 'Como esses glóbulos vivem cerca de três meses, o resultado conta a média do açúcar nesse período, e não só o do dia do exame.',
    afeta: 'para o controle do açúcar ao longo dos meses',
  },
  'Glicemia jejum': {
    oQueE: 'A quantidade de açúcar no sangue depois de horas sem comer.',
    porQue: 'É a medida mais direta de como o corpo administra a glicose em repouso.',
    afeta: 'para como o corpo lida com o açúcar',
  },
  'Insulina': {
    oQueE: 'O hormônio que faz o açúcar sair do sangue e entrar nas células.',
    porQue: 'Quando ele está alto, costuma ser sinal de que o corpo precisa produzir mais para dar conta do mesmo serviço.',
    afeta: 'para o esforço do corpo em manter o açúcar em ordem',
  },
  'Colesterol total': {
    oQueE: 'Todo o colesterol que está circulando no seu sangue, somado.',
    porQue: 'Sozinho ele diz pouco, porque junta numa conta só tipos de colesterol que fazem coisas opostas no corpo.',
    afeta: 'para a saúde das artérias ao longo dos anos',
  },
  'HDL': {
    oQueE: 'O colesterol que faz a limpeza: recolhe gordura das artérias e leva embora.',
    porQue: 'É o único exame de colesterol em que um número mais alto é a boa notícia.',
    afeta: 'para a limpeza de gordura das artérias',
  },
  'LDL': {
    oQueE: 'O colesterol que leva gordura para os tecidos do corpo.',
    porQue: 'Em excesso, é ele que vai se acumulando na parede das artérias ao longo dos anos.',
    afeta: 'para a saúde das artérias ao longo dos anos',
  },
  'Triglicerídeos': {
    oQueE: 'A gordura que circula no sangue vinda da comida e do fígado.',
    porQue: 'Responde rápido ao que se come e ao peso, e por isso costuma ser o primeiro a se mexer num tratamento.',
    afeta: 'para a gordura no sangue e para o coração',
  },
  'Creatinina': {
    oQueE: 'Um resto que o músculo produz o tempo todo e que o rim joga fora.',
    porQue: 'Como quem tira do sangue é o rim, o tanto que sobra ali é uma das formas de ver se ele está dando conta.',
    afeta: 'para o trabalho dos rins',
  },
  'TGO': {
    oQueE: 'Uma substância que fica guardada dentro das células do fígado e do músculo.',
    porQue: 'Ela só aparece no sangue quando essas células se rompem — por isso serve de aviso de que alguma coisa está irritando o fígado.',
    afeta: 'para a saúde do fígado',
  },
  'TGP': {
    oQueE: 'Uma substância que fica guardada quase só dentro das células do fígado.',
    porQue: 'Como ela quase não existe em outro lugar do corpo, quando aparece no sangue o endereço é bem mais certo.',
    afeta: 'para a saúde do fígado',
  },
  'TSH': {
    oQueE: 'O recado que o cérebro manda para a tireoide pedindo que ela trabalhe.',
    porQue: 'Ele sobe quando a tireoide está devagar e cai quando está acelerada — é o termostato, e não a temperatura.',
    afeta: 'para o ritmo do metabolismo',
  },
  'T4 livre': {
    oQueE: 'O hormônio que a tireoide produz, na parte dele que o corpo consegue usar.',
    porQue: 'Ele mostra o que a tireoide está de fato entregando, e é por isso que vem sempre em dupla com o exame anterior.',
    afeta: 'para o ritmo do metabolismo',
  },
  'Vitamina D': {
    oQueE: 'A vitamina que o corpo produz com sol e absorve da comida.',
    porQue: 'Ela participa da absorção de cálcio e do funcionamento de músculo e imunidade.',
    afeta: 'para ossos, músculo e imunidade',
  },
  'Vitamina B12': {
    oQueE: 'Uma vitamina que vem de alimentos de origem animal.',
    porQue: 'É necessária para os glóbulos vermelhos e para os nervos, e quem come menos costuma repô-la de olho.',
    afeta: 'para os nervos e a produção de sangue',
  },
  'Ferritina': {
    oQueE: 'A despensa de ferro do corpo — o que fica guardado dentro das células.',
    porQue: 'Por isso ela mostra o estoque, e não o ferro que está circulando no sangue hoje.',
    afeta: 'para o estoque de ferro, que sustenta a disposição',
  },
} satisfies Record<string, SobreOMarcador>;

/* ============================================================
   O QUE MEXE NESTE NÚMERO

   ⚠️ É A PARTE QUE TRANSFORMA O EXAME EM COISA COMPREENSÍVEL, e ela
   faltava inteira.

   Saber que ferritina é o estoque de ferro ajuda a ler a palavra. Não
   ajuda a entender por que ela mudou — e "por que mudou" é a pergunta
   que a pessoa leva da tela para a vida. Um número de exame sem causas é
   um veredito; com causas, vira uma coisa que tem história e que ela
   reconhece: "jejum curto", "treino forte na véspera", "perdi peso".

   ⚠️ E NENHUM ITEM DIZ O QUE FAZER. "Álcool nos dias anteriores" é um
   fato sobre o marcador; "pare de beber" seria conduta, e conduta é de
   quem acompanha a pessoa. A linha entre educar e prescrever é essa, e
   ela passa exatamente aqui.

   ⚠️ SÃO CAUSAS COMUNS, E NÃO A LISTA COMPLETA. Por isso a seção termina
   dizendo que o que vale para o caso de alguém é quem lê o conjunto que
   diz — a frase não é rodapé jurídico, é a verdade sobre o que uma lista
   dessas pode e não pode fazer.
   ============================================================ */
const INFLUENCIAS = {
  'HbA1c': [
    'A média de glicose dos últimos dois a três meses, e não o que você comeu ontem',
    'Anemia e doenças do sangue, que mudam a vida das hemácias e distorcem o resultado',
    'Perda de peso e medicações para glicose, que costumam baixá-la ao longo de meses',
  ],
  'Glicemia jejum': [
    'Quantas horas de jejum antes da coleta',
    'Sono ruim e estresse na véspera, que elevam o açúcar da manhã',
    'Exercício e perda de peso, que tendem a baixá-la',
  ],
  'Insulina': [
    'O jejum antes da coleta, tanto quanto na glicemia',
    'A quantidade de gordura corporal, que é o que mais pesa na conta',
    'Costuma ser lida junto da glicemia, e não sozinha',
  ],
  'Colesterol total': [
    'O que se come de gordura, mas menos do que a fama sugere',
    'Genética — algumas famílias produzem mais colesterol independentemente da dieta',
    'Tireoide devagar, que eleva sem relação com comida',
  ],
  'HDL': [
    'Exercício aeróbico regular, que é o que mais o eleva',
    'Tabagismo, que o reduz',
    'Genética, com peso grande neste em particular',
  ],
  'LDL': [
    'Gordura saturada e trans na alimentação',
    'Perda de peso, que costuma reduzi-lo junto com os triglicerídeos',
    'Genética, que em algumas famílias domina o resultado',
  ],
  'Triglicerídeos': [
    'O jejum — comer perto da coleta altera muito, mais do que em qualquer outro do painel',
    'Álcool nos dias anteriores',
    'Açúcar e farinha em excesso, que o corpo converte em gordura',
  ],
  'Creatinina': [
    'Quanta massa muscular a pessoa tem, porque ela vem do músculo',
    'Hidratação no dia da coleta',
    'Treino pesado na véspera, que pode elevá-la temporariamente',
  ],
  'TGO': [
    'Exercício intenso nos dias anteriores, porque ela também existe no músculo',
    'Álcool',
    'Gordura no fígado, comum em quem tem excesso de peso',
  ],
  'TGP': [
    'Gordura no fígado, que é a causa mais comum de alteração leve',
    'Álcool e alguns medicamentos',
    'Perda de peso, que costuma reduzi-la ao longo dos meses',
  ],
  'TSH': [
    'A hora da coleta — ele é mais alto de madrugada e no começo da manhã',
    'Doenças agudas e alguns medicamentos',
    'Reposição de hormônio de tireoide, quando existe',
  ],
  'T4 livre': [
    'O funcionamento da tireoide, lido sempre junto do TSH',
    'Gravidez e estrogênio, que mudam as proteínas que o transportam',
  ],
  'Vitamina D': [
    'Sol na pele — quantidade, horário e quanto do corpo fica exposto',
    'Pele mais escura e protetor solar, que reduzem a produção',
    'Suplementação, quando existe',
    'A estação do ano: inverno costuma derrubar',
  ],
  'Vitamina B12': [
    'Alimentos de origem animal na dieta',
    'Cirurgia bariátrica e alguns remédios para estômago, que reduzem a absorção',
    'Suplementação, quando existe',
  ],
  'Ferritina': [
    'O estoque de ferro do corpo',
    'Inflamação e infecção, que a elevam mesmo sem ferro sobrando — por isso ela nunca se lê sozinha',
    'Menstruação volumosa, que ao longo do tempo reduz o estoque',
  ],
} satisfies Record<string, string[]>;

/* ============================================================
   O QUE COSTUMA AJUDAR

   ⚠️ ESTA É A PARTE PERIGOSA DO ARQUIVO, E ELA TEM QUATRO TRAVAS.

   Uma lista de "como melhorar o seu exame" é, sem cuidado, prescrição
   com roupa de dica — e prescrição é de quem acompanha a pessoa. O que
   justifica ela existir é o oposto do que a faria errada: o exame de
   sangue é o documento de saúde que menos gente entende, e deixar alguém
   sozinha com um número e uma faixa é abandoná-la no lugar mais difícil.

   AS TRAVAS:

   1. NADA AQUI É SOBRE MEDICAÇÃO. Nenhum item manda começar, parar,
      aumentar ou diminuir nada — e onde reposição é o assunto, a frase
      diz "quando indicada por quem acompanha você", que é o fato.

   2. NADA AQUI TEM DOSE, QUANTIDADE OU PRAZO. "Exposição ao sol é a
      principal fonte" é informação; "vinte minutos por dia" é receita,
      e receita tem que ser de alguém que examinou a pessoa.

   3. NADA AQUI PROMETE RESULTADO. Os itens dizem o que se SABE sobre o
      marcador — que comer ferro com vitamina C melhora a absorção —, e
      não o que vai acontecer com o número de quem lê.

   4. NADA AQUI É DE TIREOIDE NEM DE RIM. TSH, T4 e creatinina ficaram de
      fora de propósito: no primeiro caso o que move o número é
      medicação, no segundo os conselhos mais óbvios (beber água, comer
      proteína) são justamente os que uma pessoa com rim ruim não deve
      seguir por conta própria. Marcador sem item honesto não ganha
      seção.
   ============================================================ */
export type JeitoDeAjudar = { grupo: string; itens: { nome: string; detalhe: string }[] };

const AJUDAR = {
  'HbA1c': [
    {
      grupo: 'Na comida',
      itens: [
        { nome: 'Carboidrato de absorção lenta', detalhe: 'Grãos integrais, feijões e legumes elevam a glicose mais devagar que farinha branca e açúcar' },
        { nome: 'Proteína e fibra na mesma refeição', detalhe: 'Reduzem o pico de glicose do que se come junto' },
      ],
    },
    {
      grupo: 'No movimento',
      itens: [
        { nome: 'Caminhar depois de comer', detalhe: 'Músculo em atividade consome glicose sem depender de insulina' },
        { nome: 'Exercício regular', detalhe: 'Melhora a sensibilidade à insulina, e o efeito se acumula ao longo de semanas' },
      ],
    },
  ],
  'Glicemia jejum': [
    {
      grupo: 'Na rotina',
      itens: [
        { nome: 'Sono', detalhe: 'Noites curtas elevam a glicose da manhã seguinte' },
        { nome: 'Última refeição mais cedo', detalhe: 'Comer muito perto de dormir costuma aparecer no jejum do dia seguinte' },
      ],
    },
    {
      grupo: 'No movimento',
      itens: [
        { nome: 'Atividade aeróbica', detalhe: 'Reduz a glicose de jejum ao longo de semanas, não de dias' },
      ],
    },
  ],
  'Insulina': [
    {
      grupo: 'No peso e no movimento',
      itens: [
        { nome: 'Redução de gordura corporal', detalhe: 'É o que mais reduz a insulina necessária para o mesmo trabalho' },
        { nome: 'Treino de força', detalhe: 'Mais massa muscular significa mais lugar para a glicose ir' },
      ],
    },
  ],
  'Colesterol total': [
    {
      grupo: 'Na comida',
      itens: [
        { nome: 'Menos gordura saturada e trans', detalhe: 'Frituras, embutidos e industrializados são as fontes mais comuns' },
        { nome: 'Fibras solúveis', detalhe: 'Aveia, feijão e frutas reduzem a absorção de colesterol no intestino' },
      ],
    },
  ],
  'HDL': [
    {
      grupo: 'No movimento',
      itens: [
        { nome: 'Exercício aeróbico', detalhe: 'É o que mais eleva o HDL, e o efeito depende de regularidade' },
      ],
    },
    {
      grupo: 'Na comida',
      itens: [
        { nome: 'Gorduras boas', detalhe: 'Azeite, abacate, castanhas e peixes gordos' },
      ],
    },
  ],
  'LDL': [
    {
      grupo: 'Na comida',
      itens: [
        { nome: 'Menos gordura saturada', detalhe: 'É a que mais eleva o LDL — carnes gordas, laticínios integrais, frituras' },
        { nome: 'Fibras solúveis', detalhe: 'Aveia, feijão, lentilha e frutas com casca' },
      ],
    },
    {
      grupo: 'No peso',
      itens: [
        { nome: 'Perda de peso', detalhe: 'Costuma reduzir LDL e triglicerídeos juntos' },
      ],
    },
  ],
  'Triglicerídeos': [
    {
      grupo: 'Na comida',
      itens: [
        { nome: 'Menos açúcar e farinha', detalhe: 'O excesso vira gordura no fígado, e é o que mais eleva este marcador' },
        { nome: 'Álcool', detalhe: 'É a causa isolada mais comum de triglicerídeos altos' },
      ],
    },
    {
      grupo: 'No movimento',
      itens: [
        { nome: 'Atividade aeróbica', detalhe: 'Os triglicerídeos são dos marcadores que respondem mais rápido' },
      ],
    },
  ],
  'TGO': [
    {
      grupo: 'No fígado',
      itens: [
        { nome: 'Álcool', detalhe: 'É a causa mais comum de alteração nas duas enzimas' },
        { nome: 'Perda de peso', detalhe: 'Reduz a gordura no fígado, que é a outra causa comum' },
      ],
    },
  ],
  'TGP': [
    {
      grupo: 'No fígado',
      itens: [
        { nome: 'Perda de peso', detalhe: 'A gordura no fígado é a causa mais comum de alteração leve, e ela responde ao peso' },
        { nome: 'Álcool', detalhe: 'Some da conta quando some da rotina' },
      ],
    },
  ],
  'Vitamina D': [
    {
      grupo: 'No sol',
      itens: [
        { nome: 'Exposição da pele', detalhe: 'É a principal fonte — protetor solar e roupa cobrindo reduzem a produção' },
      ],
    },
    {
      grupo: 'Na comida e na reposição',
      itens: [
        { nome: 'Peixes gordos, gema e cogumelos', detalhe: 'São as fontes alimentares, e costumam ser insuficientes sozinhas' },
        { nome: 'Suplementação', detalhe: 'Quando indicada por quem acompanha você — a dose depende do seu nível' },
      ],
    },
  ],
  'Vitamina B12': [
    {
      grupo: 'Na comida',
      itens: [
        { nome: 'Origem animal', detalhe: 'Carnes, ovos, leite e derivados são as únicas fontes naturais' },
      ],
    },
    {
      grupo: 'Na absorção',
      itens: [
        { nome: 'Remédios para estômago', detalhe: 'Uso prolongado reduz a absorção — assunto para levar à consulta' },
        { nome: 'Suplementação', detalhe: 'Quando indicada por quem acompanha você, sobretudo após cirurgia bariátrica' },
      ],
    },
  ],
  'Ferritina': [
    {
      grupo: 'Na comida',
      itens: [
        { nome: 'Ferro de origem animal', detalhe: 'Carne vermelha, fígado e frutos do mar são os mais bem absorvidos' },
        { nome: 'Vitamina C junto', detalhe: 'Laranja, acerola e pimentão melhoram a absorção do ferro dos vegetais' },
        { nome: 'Café e chá longe da refeição', detalhe: 'Eles atrapalham a absorção quando tomados junto' },
      ],
    },
  ],
} satisfies Record<string, JeitoDeAjudar[]>;

export const marcadores = {
  /* ---------- as categorias ---------- */
  /* São os únicos rótulos de tela deste arquivo, e por isso os únicos que
     se traduzem sem ressalva. QUAIS marcadores entram em cada categoria
     não é decisão de idioma — é conteúdo clínico, e fica em logic/derive
     junto das chaves. */
  catMetabolico: 'Metabólico',
  catLipidico: 'Lipídico',
  catFigadoRim: 'Fígado & rim',
  catTireoide: 'Tireoide',
  catVitaminas: 'Vitaminas',

  sobre: SOBRE,
  influencias: INFLUENCIAS,
  ajudar: AJUDAR,
};
