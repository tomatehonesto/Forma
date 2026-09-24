/* ============================================================
   O CICLO DA DOSE — a manchete da Home e as quatro fases

   O que a pessoa sente muda ao longo dos dias entre uma aplicação e a
   seguinte, e o aplicativo lê essa posição para explicar o que está
   acontecendo com ela HOJE. É o texto que mais gente vê, porque abre a
   Home todo dia.

   ⚠️ QUEM FOR TRADUZIR, A REGRA QUE VALE PARA O ARQUIVO INTEIRO: nenhuma
   destas frases manda fazer nada. Elas dizem o que está acontecendo e o
   que costuma ajudar — a diferença entre "beba mais água" e "água ajuda a
   manter a saciedade nesta fase" é a diferença entre um aplicativo que
   cobra e um que explica, e este é o segundo.
   ============================================================ */

export const ciclo = {
  /* ---------- o chapéu ---------- */
  /* ⚠️ "DIA 5 DEPOIS DA DOSE", E NÃO "DIA 5 DE 7". O de-sete parecia
     contagem regressiva de um prazo — sete do quê, e o que acontece quando
     chegar? A cadência é do medicamento, não meta a cumprir.

     Era "DIA 5 DA DOSE", e dose não é um intervalo de dias. "Depois"
     mantém a contagem sem a meta — e é a palavra da tela do ciclo, "Dia 5
     depois da aplicação". As cinco irmãs já tinham trocado. */
  chapeuDia: (dia: number) => `DIA ${dia} DEPOIS DA DOSE`,
  /* Sem aplicação registrada não há ciclo, e o chapéu não inventa um. */
  chapeuSemCiclo: 'PARA HOJE',

  /* ---------- dia da aplicação ---------- */
  /* ⚠️ NÃO ANUNCIA QUE HOJE É DIA DE APLICAR: o slide seguinte da Home é
     inteiro sobre isso, com a dose e o local. Dois slides seguidos dando a
     mesma notícia gastam o carrossel — este fica com o que o outro não
     diz, que é o que acontece no corpo depois de aplicar. */
  aplicHead: 'O efeito começa a subir nas próximas horas.',
  aplicBody: 'Enjoo leve pode aparecer — refeições menores ao longo do dia costumam cair melhor.',
  aplicQ: 'O que esperar no dia da aplicação?',

  /* ---------- pico ---------- */
  picoHead: 'Seu apetite tende a ficar mais baixo hoje.',
  picoBody: 'Pico de efeito da medicação — bom dia para treinar e adiantar a proteína.',
  picoQ: 'Quando tenho mais energia?',

  /* ---------- estável ---------- */
  estabHead: 'Seu corpo está na fase estável do ciclo.',
  estabBody: 'Efeito constante — água e proteína em dia ajudam a sustentar a saciedade.',
  estabQ: 'Como funciona o ciclo da medicação?',

  /* ---------- retorno da fome ---------- */
  retornoHead: 'Sua fome pode começar a aumentar nas próximas 24 horas.',
  retornoBody: 'Proteína e água ajudam a manter a saciedade nesta fase do ciclo.',
  retornoQ: 'Por que sinto mais fome?',

  /* ---------- ponto alto da fome ---------- */
  /* Duas manchetes pela mesma razão do dia da aplicação: quando a
     aplicação é hoje, quem conta isso é o slide da aplicação. */
  altoHeadHoje: 'Fome no ponto mais alto do ciclo.',
  altoHeadComData: (quando: string) => `Fome no ponto alto do ciclo — aplicação ${quando}.`,
  /* ⚠️ "NÃO PULE REFEIÇÕES" PRESSUPÕE QUE ELA PULA, e no ponto alto da
     fome quem menos pula é quem está com fome. A frase nasceu como
     conselho e chegava como repreensão — a versão afirmativa diz a mesma
     coisa útil sem acusar ninguém de nada. */
  altoBody: 'Porções menores e mais vezes, com proteína, seguram melhor a fome.',
  altoQ: 'Por que sinto mais fome?',

  /* ---------- o sinal extra ---------- */
  /* Entra na frente do corpo da mensagem quando a noite foi boa. É a
     única linha do aplicativo que celebra sono, e ela existe porque dormir
     bem muda o dia inteiro de quem está em tratamento. */
  dormiuBem: (resto: string) => `Você dormiu bem — seu corpo tende a responder melhor hoje. ${resto}`,

  /* ============================================================
     AS CINCO ETAPAS — o stepper do ciclo

     ⚠️ SÃO CINCO AQUI E QUATRO LOGO ABAIXO, e é de propósito. Esta é a
     pergunta "em que ponto eu estou AGORA", e cinco etapas dão
     granularidade para a frase do dia mudar; a tabela de baixo responde
     "como é o ciclo inteiro", e aí cinco linhas é uma a mais do que cabe
     na cabeça de quem lê pela primeira vez. Ver logic/derive.

     ⚠️ O `label` É NOME DE ETAPA E O `hint` É O QUE ELA É. O nome sozinho
     — "Início do retorno da fome" — é diagnóstico sem contexto, e numa
     tela de tratamento isso assusta em vez de orientar.

     ⚠️ E A PERGUNTA DE CADA ETAPA NÃO MORA AQUI: são as mesmas que as
     manchetes acima mandam para o companion, e estão declaradas lá.
     ============================================================ */
  faseAplicLabel: 'Aplicação',
  faseAplicRange: 'Dia 1',
  faseAplicHint: 'O efeito começa a subir nas próximas horas.',

  fasePicoLabel: 'Pico de efeito',
  fasePicoRange: 'Dias 1–2',
  fasePicoHint: 'Remédio no ponto mais alto — a fome fica menor.',

  faseEstabLabel: 'Estabilidade',
  faseEstabRange: 'Dias 3–4',
  faseEstabHint: 'Efeito constante, sem grandes oscilações.',

  faseRetornoLabel: 'Início do retorno da fome',
  faseRetornoRange: 'Dias 5–6',
  faseRetornoHint: 'O nível do remédio começa a cair, e a fome tende a voltar.',

  fasePreLabel: 'Pré-aplicação',
  fasePreRange: 'Dias 7+',
  fasePreHint: 'Ponto mais baixo do ciclo, até a próxima dose.',

  /* ============================================================
     AS QUATRO FASES — a leitura das telas internas

     ⚠️ ESTA TABELA PRESSUPÕE CADÊNCIA SEMANAL, e é dívida conhecida: quem
     usa medicamento diário não tem sete dias de ciclo para atravessar.
     Está escrito aqui para quem traduzir não gastar tempo procurando
     sentido nos rótulos de dia.
     ============================================================ */
  faseSubidaTitulo: 'Dias 1–2 · subida',
  faseSubidaSub: 'Efeito subindo, apetite mais baixo',
  faseSubidaComum: 'náusea leve, saciedade rápida, menos vontade de comer',
  faseSubidaAjuda: 'refeições menores e mais espaçadas; beber água ao longo do dia',

  fasePlatoTitulo: 'Dias 3–4 · platô',
  fasePlatoSub: 'Fase mais estável do ciclo',
  fasePlatoComum: 'apetite constante, intestino mais lento',
  fasePlatoAjuda: 'priorizar proteína e fibra nas refeições',

  faseDescidaTitulo: 'Dias 5–6 · descida',
  faseDescidaSub: 'Efeito cedendo, fome voltando aos poucos',
  faseDescidaComum: 'mais fome que nos primeiros dias, energia oscilando',
  /* ⚠️ A METADE FINAL DESTA FRASE É O MOTIVO DE ELA EXISTIR. A fome voltar
     no quinto dia assusta quem acha que o remédio parou de funcionar, e
     desistir aí é comum. Dizer que é a fase, e não a falha, é o trabalho
     inteiro da linha.

     E ela entra debaixo de "O que ajuda", como as outras três: por isso
     começa em "saber que". Sem isso, o rótulo prometia uma dica e a linha
     só descrevia a fase. */
  faseDescidaAjuda: 'saber que é a fase em que a fome volta — não significa que o tratamento parou de funcionar',
  /* A única fase com atenção: é onde os sintomas que pedem médico
     aparecem. Não é alarme — é o limite entre o esperado e o que não
     espera a próxima consulta. */
  faseDescidaAtencao: 'vômito persistente ou dor abdominal forte: fale com seu médico',

  faseBaixoTitulo: 'Dia 7 · ponto mais baixo',
  faseBaixoSub: 'Véspera da próxima aplicação',
  faseBaixoComum: 'apetite mais próximo do habitual',
  /* "A dose", e não "a caneta": esta tabela é constante e não sabe a forma
     do medicamento — a frase serve caneta, frasco e seringa igualmente.
     Ver logic/formas. */
  faseBaixoAjuda: 'deixar a dose e o local da aplicação definidos na véspera',
  /* ============================================================
     CICLO DA DOSE — a tela que responde "por que a fome voltou?"

     ⚠️ A QUEBRA DE LINHA MORA NO TEXTO, e estava escrita no JSX:
     "depois\nda aplicação" é a largura do português, e o alemão parte em
     outro lugar.

     ⚠️ E A PALAVRA DA AÇÃO VEM DE FORA. A manchete dizia "aplicação" em
     duro, e quem toma comprimido não aplica nada: `formas.palavras` já
     tem a palavra certa para cada recipiente. Nos cinco idiomas as duas
     saídas são femininas — aplicação/dose, injection/prise,
     Injektion/Dosis —, então o artigo do meio é seguro.
     ============================================================ */
  tela: {
    titulo: 'Ciclo da dose',
    diaDepois: (dia: number, acao: string) => `Dia ${dia} depois\nda ${acao}`,
    lead: 'O efeito do medicamento sobe nos primeiros dias e vai cedendo até a próxima dose. O que você sente muda junto — e isso é esperado.',

    cicloAtual: 'Ciclo atual',
    diaDeTotal: (dia: number, total: number) => `dia ${dia} de ${total}`,
    proximaDose: (data: string) => `Próxima dose: ${data}`,

    asQuatroFases: 'As quatro fases',
    comum: 'Comum',
    ajuda: 'O que ajuda',
    atencao: 'Atenção',

    conteudoGeral: 'Isto é conteúdo geral',
    conteudoGeralTexto: 'O ciclo varia de pessoa para pessoa e com a dose. Nada aqui substitui a orientação do seu médico.',

    baseadoEm: (molecula: string) => `Baseado no comportamento típico da ${molecula}`,
  },
};
