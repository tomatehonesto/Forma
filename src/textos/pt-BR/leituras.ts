/* ============================================================
   AS LEITURAS — o que o aplicativo diz depois de ler as respostas

   ⚠️⚠️ QUATRO TRAVAS VALEM PARA O ARQUIVO INTEIRO, e elas não são estilo:

   1. NENHUMA NOMEIA DIAGNÓSTICO. Quem lê já está com o sintoma, e um nome
      de doença assusta sem ajudar a decidir o próximo passo.

   2. O SUJEITO É O SINTOMA OU O CORPO, NUNCA A PESSOA. "Vomitar muito" e
      "nesse ritmo" descreviam o involuntário como se fosse hábito — quem
      vomita não está vomitando demais, está vomitando. Ela é quem lê, não
      quem causou.

   3. AS FAIXAS SÃO CLÍNICAS, E NÃO EDITORIAIS. Dor e tontura avisam no 4,
      onde o dia já foi interrompido; as contagens — vômito, intestino —
      avisam no degrau em que a graduação clínica troca de patamar. Quem
      traduzir mexe nas palavras e não nos números, que ficam em
      logic/leituras.

   4. O `curto` NOMEIA O OBJETO DO VERBO, SEMPRE. "Beba de pouquinho"
      deixa a pessoa preenchendo a lacuna sozinha, e numa linha lida de
      passagem a lacuna fica. "Beba água de pouquinho" não sobra dúvida —
      e é a única frase que ela vai levar embora.

   ⚠️ CADA LEITURA FALA EM DOIS COMPRIMENTOS. No formulário ela é um aviso
   inteiro — `sobre`, `titulo`, `texto`, `acao`. Na confirmação ela é uma
   linha: `sobre` mais `curto`. Tudo já foi dito um toque antes; o que
   resta é sair da tela lembrando.
   ============================================================ */

export const leituras = {
  /* ============================================================
     OS AVISOS DE CAMPO — um sintoma, respondido agora

     ⚠️ O CORTE É UM SÓ: o aviso existe quando a resposta muda o que a
     pessoa deveria fazer HOJE. Fadiga e dor de cabeça ficam de fora por
     isso — quase sempre vêm de comer e beber pouco, e um aviso ali seria
     ruído sobre o que já é esperado.
     ============================================================ */
  dorSobre: 'Dor abdominal',
  dorCurto: 'fale com sua equipe hoje',
  dorTitulo: 'Essa dor não espera a próxima consulta',
  /* ⚠️ "QUASE SEMPRE NÃO É NADA GRAVE — E É POR ISSO MESMO QUE VALE OLHAR
     CEDO" é a frase inteira. Ela pede atenção sem assustar, e o "por isso
     mesmo" é o que impede a leitura de virar alarme. */
  dorTexto: 'Dor forte na barriga, ou que não passa, é a única que pede atenção no mesmo dia. Quase sempre não é nada grave — e é por isso mesmo que vale olhar cedo.',
  dorAcao: 'Fale com sua equipe hoje. Se piorar ou vier com vômito, procure um atendimento.',

  vomitoSobre: 'Vômito',
  vomitoCurto: 'beba água de pouquinho, várias vezes',
  vomitoTitulo: 'O vômito tira mais líquido do que parece',
  vomitoTexto: 'Junto com a água vai o sal, e o corpo sente antes de você ter sede. E quando a comida não fica, o dia seguinte já começa cansado.',
  vomitoAcao: 'Beba de pouquinho, várias vezes, em vez de um copo de uma vez. Se nem água ficar, fale com sua equipe hoje.',

  tonturaSobre: 'Tontura',
  tonturaCurto: 'sente-se, beba água e coma alguma coisa doce',
  tonturaTitulo: 'Tontura assim costuma ter explicação',
  tonturaTexto: 'Quase sempre é falta de líquido ou açúcar baixo. Se você toma algum remédio para diabetes junto, o açúcar baixo fica ainda mais provável.',
  tonturaAcao: 'Sente-se, beba água e coma alguma coisa. Se repetir nos próximos dias, conte para sua equipe.',

  /* Os dois lados do intestino: um conta dias sem ir, o outro idas no dia. */
  presoSobre: 'Intestino preso',
  presoCurto: 'beba água ao longo do dia, coma fibra e caminhe',
  presoTitulo: 'Quatro dias sem ir já merece atenção',
  presoTexto: 'O medicamento deixa tudo mais lento, e comendo menos sobra pouco para o intestino empurrar. Quatro dias é onde isso costuma parar de se resolver sozinho.',
  presoAcao: 'Água ao longo do dia, fibra nas refeições e uma caminhada. Se passar de cinco dias, ou vier com dor forte e vômito, procure atendimento.',

  soltoSobre: 'Intestino solto',
  soltoCurto: 'beba água com uma pitada de sal, sem esperar sede',
  soltoTitulo: 'O intestino solto leva água e sal junto',
  soltoTexto: 'Sete idas ou mais num dia levam mais do que a sede dá conta de repor.',
  soltoAcao: 'Beba ao longo do dia sem esperar sede, com soro ou uma pitada de sal. Se amanhã continuar assim, avise sua equipe.',

  /* ============================================================
     AS COMBINAÇÕES — o que nenhum sintoma sozinho consegue dizer

     Dor forte é uma coisa; dor forte COM vômito é outra, e a bula trata
     as duas de maneiras diferentes.

     ⚠️ E QUANDO UMA COMBINAÇÃO APARECE, OS AVISOS DE CAMPO SOMEM. Eles
     dizem "converse com sua equipe" sobre um sintoma; a combinação diz
     "vá agora" sobre o conjunto, e manter os dois na tela é deixar o
     menos urgente discutir com o mais urgente.
     ============================================================ */
  travaSobre: 'Intestino, dor e vômito',
  travaCurto: 'procure um pronto atendimento hoje',
  travaTitulo: 'Essa combinação pede atendimento agora',
  travaTexto: 'Intestino parado há dias, dor forte e vômito juntos podem ser sinal de que algo travou. É raro, mas não melhora sozinho.',
  /* ⚠️ "QUAL MEDICAMENTO VOCÊ USA", e era "que usa a caneta". A troca era
     obrigatória pela forma e saiu melhor pelo conteúdo: quem está num
     pronto atendimento precisa dizer O QUE toma, não em que embalagem ele
     vem. */
  travaAcao: 'Procure um pronto atendimento hoje. Diga qual medicamento você usa e há quantos dias não vai ao banheiro.',

  dorVomitoSobre: 'Dor com vômito',
  dorVomitoCurto: 'procure sua equipe ou um atendimento hoje',
  dorVomitoTitulo: 'Dor forte com vômito não espera',
  dorVomitoTexto: 'Dor forte na barriga junto de vômito, às vezes espalhando para as costas, pede atenção no mesmo dia. Chegando cedo, é simples de checar.',
  dorVomitoAcao: 'Procure sua equipe ou um atendimento hoje. Diga qual medicamento você usa, a dose e quando a dor começou.',

  desidratacaoSobre: 'Tontura e perda de líquido',
  desidratacaoCurto: 'beba soro ou água com sal, e levante devagar',
  desidratacaoTitulo: 'Tontura com perda de líquido é sinal de desidratação',
  desidratacaoTexto: 'Quando falta água e sal, a pressão cai ao levantar — e a tontura é o corpo avisando.',
  desidratacaoAcao: 'Beba de pouquinho ao longo do dia, com soro ou uma pitada de sal, e levante devagar. Se não melhorar até amanhã, avise sua equipe.',

  /* ============================================================
     A PERSISTÊNCIA — o que um dia sozinho não diz

     Enjoo hoje é o esperado de quem começou ou acabou de subir a dose.
     Enjoo em quatro dos últimos sete dias é outra frase: é o que separa
     "efeito da dose subindo" de "isso não está passando".

     ⚠️ POR ISSO O TEXTO TRAZ O NÚMERO DE DIAS. "Quatro dos últimos sete"
     é um fato que a pessoa leva para a consulta; "você tem enjoo com
     frequência" é uma impressão que ela já tinha.
     ============================================================ */
  vomitoSemanaSobre: 'Vômito na semana',
  vomitoSemanaCurto: 'fale com sua equipe esta semana',
  vomitoSemanaTitulo: 'Vômito em dias repetidos',
  vomitoSemanaTexto: (n: number) => `${n} dos últimos sete dias com vômito. Assim comida, líquido e o próprio remédio não ficam.`,
  vomitoSemanaAcao: 'Fale com sua equipe esta semana, sem esperar a consulta. Leve o número de dias — é ele que faz diferença.',

  soltoSemanaSobre: 'Intestino na semana',
  soltoSemanaCurto: 'beba mais água e conte para sua equipe',
  soltoSemanaTitulo: 'O intestino está solto há dias',
  soltoSemanaTexto: (n: number) => `${n} dos últimos sete dias assim já pesa na hidratação, mesmo quando cada dia, sozinho, parece tranquilo.`,
  soltoSemanaAcao: 'Beba mais do que a sede pede e conte para sua equipe. Pode ser a dose, pode ser a alimentação.',

  enjooSemanaSobre: 'Enjoo na semana',
  enjooSemanaCurto: 'leve o número de dias para a consulta',
  enjooSemanaTitulo: 'O enjoo não está passando',
  enjooSemanaTexto: (n: number) => `${n} dos últimos sete dias com enjoo deixa de ser adaptação e vira padrão. Costuma mudar com a dose, ou com a velocidade que ela sobe.`,
  /* ⚠️ "SEGURAR A DOSE UM POUCO MAIS NÃO É DESISTIR" é o serviço da
     frase: é a conduta que a pessoa mais resiste a levar para a consulta,
     porque a lê como fracasso. */
  enjooSemanaAcao: 'Leve esse número para a próxima consulta. Segurar a dose um pouco mais não é desistir.',

  /* ⚠️ O INTESTINO PRESO APARECE NAS DUAS LEITURAS, e não é repetição: a
     régua do campo conta dias seguidos sem ir — um episódio —, e esta
     conta dias da semana com o intestino lento, que é o padrão de quem
     vai a cada três dias sem nunca ficar quatro sem ir. */
  presoSemanaSobre: 'Intestino lento na semana',
  presoSemanaCurto: 'beba água, coma fibra e caminhe',
  presoSemanaTitulo: 'O intestino está lento a semana toda',
  presoSemanaTexto: (n: number) => `${n} dos últimos sete dias com o intestino preso. Comer menos é efeito do medicamento, e com menos comida passa menos fibra — ele sente antes da balança.`,
  presoSemanaAcao: 'Água, fibra e caminhada ajudam. Nesse ritmo, vale contar para sua equipe.',

  /* ============================================================
     AS MARCAS DA SEMANA — o que foi bem, em duas palavras

     ⚠️ OS MARCOS SÃO INDEXADOS PELO NÚMERO DE DIAS, e a chave é o número
     porque quem pergunta é a sequência: `marcoDe(7)`. Traduzir o valor
     não mexe em nenhum registro — o que fica gravado é a sequência, que é
     um inteiro.

     ⚠️ E ELES NÃO SÃO SETE NÍVEIS DE UMA ESCADA. Cada um nomeia um tempo
     que a pessoa reconhece — três dias, uma semana, um mês —, e por isso
     o de 30 diz "registros" e não "seguidos": um mês inteiro sem falhar
     um dia é raro, e a frase não pode prometer o que a régua não cobra. */
  marcos: {
    3: 'Três dias seguidos',
    7: 'Uma semana inteira',
    14: 'Duas semanas seguidas',
    21: 'Três semanas seguidas',
    30: 'Um mês de registros',
    60: 'Dois meses seguidos',
    90: 'Três meses seguidos',
  },

  /* ⚠️ AS TRÊS COM NÚMERO TRAZEM O NÚMERO QUE AS SUSTENTA, e é o que as
     separa de um elogio. "Você dormiu bem" é opinião; "Dormindo 7 h+ em 5
     dias" é a contagem dos próprios registros. */
  dormindoBem: (n: number) => `Dormindo 7 h+ em ${n} dias`,
  energiaBoa: (n: number) => `Energia boa em ${n} dias`,
  semEnjooDias: (n: number) => `${n} dias sem enjoo`,

  /* A única sem número, porque o número dela seria a diferença entre duas
     médias — e "fome 1,2 ponto menor" não é uma boa notícia que alguém
     lê. O fato é a saciedade, e ela não tem unidade. */
  saciedadeMelhorando: 'Saciedade melhorando',

};
