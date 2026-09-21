/* ============================================================
   O CICLO DA DOSE — a manchete da Home e as quatro fases

   O que a pessoa sente muda ao longo dos dias entre uma aplicação e a
   seguinte, e o aplicativo lê essa posição para explicar o que está
   acontecendo com ela HOJE. É o texto que mais gente vê, porque abre a
   Home todo dia.

   ⚠️ QUEM FOR TRADUZIR, A REGRA QUE VALE PARA O ARQUIVO INTEIRO: nenhuma
   destas frases manda fazer nada. Elas dizem o que está acontecendo e o
   que costuma ajudar — a diferença entre "beba mais água" e "água segura
   a saciedade nesta fase" é a diferença entre um aplicativo que cobra e
   um que explica, e este é o segundo.
   ============================================================ */

export const ciclo = {
  /* ---------- o chapéu ---------- */
  /* ⚠️ "DIA 5 DA DOSE", E NÃO "DIA 5 DE 7". O de-sete parecia contagem
     regressiva de um prazo — sete do quê, e o que acontece quando chegar?
     A cadência é do medicamento, não meta a cumprir. "Da dose" diz a
     mesma posição e nomeia o relógio que a está medindo. */
  chapeuDia: (dia: number) => `DIA ${dia} DA DOSE`,
  /* Sem aplicação registrada não há ciclo, e o chapéu não inventa um. */
  chapeuSemCiclo: 'PARA HOJE',

  /* ---------- dia da aplicação ---------- */
  /* ⚠️ NÃO ANUNCIA QUE HOJE É DIA DE APLICAR: o slide seguinte da Home é
     inteiro sobre isso, com a dose e o local. Dois slides seguidos dando a
     mesma notícia gastam o carrossel — este fica com o que o outro não
     diz, que é o que acontece no corpo depois de aplicar. */
  aplicHead: 'O efeito começa a subir nas próximas horas.',
  aplicBody: 'Enjoo leve pode aparecer — prefira refeições menores ao longo do dia.',
  aplicQ: 'O que esperar no dia da aplicação?',

  /* ---------- pico ---------- */
  picoHead: 'Seu apetite tende a ficar mais baixo hoje.',
  picoBody: 'Pico de efeito da medicação — bom dia para treinar e adiantar a proteína.',
  picoQ: 'Quando tenho mais energia?',

  /* ---------- estável ---------- */
  estabHead: 'Seu corpo está na fase estável do ciclo.',
  estabBody: 'Efeito constante — mantenha água e proteína em dia para sustentar a saciedade.',
  estabQ: 'Como funciona o ciclo da medicação?',

  /* ---------- retorno da fome ---------- */
  retornoHead: 'Sua fome pode começar a aumentar nas próximas 24 horas.',
  retornoBody: 'Proteína e água seguram a saciedade nesta fase do ciclo.',
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
     inteiro da linha. */
  faseDescidaAjuda: 'é a fase em que a fome volta — não significa que o tratamento parou de funcionar',
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
  faseBaixoAjuda: 'deixe a dose e o local da aplicação definidos na véspera',
};
