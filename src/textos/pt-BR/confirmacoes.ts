/* ============================================================
   AS CONFIRMAÇÕES — a folha que aparece depois de registrar

   Sete registros, uma folha cada: peso, medidas, exame, anotação,
   refeição, exercício e água. Todas têm a mesma forma — título, o que foi
   registrado, uma ou duas linhas de contexto, e um caminho.

   ⚠️ O TÍTULO SÓ VIRA NOTÍCIA QUANDO A META FECHA. "Hidratação do dia
   fechada" a cada copo seria a mentira de sempre: dizer que acabou quando
   ainda falta. Enquanto falta, o título é o registro — "Água registrada".

   ⚠️ E O SELO DA VARIAÇÃO NÃO JULGA. O mesmo tom vale para quem subiu e
   para quem desceu: pintar um de neutro e outro de lima seria o
   aplicativo dizendo qual dos dois dias foi bom.
   ============================================================ */

export const confirmacoes = {
  /* ⚠️ "SEM MUDANÇA" E NÃO "−0,0". Um número que não se mexeu não variou
     para lado nenhum, e o sinal de menos na frente de um zero sugere uma
     perda que não houve. */
  semMudanca: 'sem mudança',

  /* ---------------- peso ---------------- */
  peso: 'Peso registrado',
  pesoDesdeUltima: 'Desde a última pesagem',
  pesoMeta: 'Meta de peso',
  pesoFaltam: (quanto: string) => `faltam ${quanto}`,
  pesoAlcancada: 'alcançada',
  /* ⚠️ EM PLATÔ O CAMINHO É TROCADO, e não somado: a folha desenha um
     convite discreto só, e dois começam a virar menu. "Ver a curva do
     peso" é justamente o que a pessoa acabou de aprender — uma linha
     reta —, então a troca não tira nada. */
  pesoNotaPlato: 'Um mês com o peso na mesma faixa. É aí que a cintura costuma continuar caindo, e a fita é quem mostra isso.',
  pesoCaminhoPlato: 'Medir o corpo também',
  pesoCaminho: 'Ver a curva do peso',

  /* ---------------- medidas ---------------- */
  medidas: 'Medidas registradas',
  cintura: 'Cintura',
  quadril: 'Quadril',
  braco: 'Braço',
  coxa: 'Coxa',
  medidasCaminho: 'Ver a evolução',

  /* ---------------- exame ---------------- */
  exame: 'Resultado registrado',
  /* ⚠️ O VEREDITO PRIMEIRO, porque é a pergunta de quem acabou de digitar
     um número de exame — e a faixa vem junto, porque é ela que sustenta o
     veredito. Sem referência cadastrada não há veredito, e a linha não
     aparece. */
  exameFaixa: 'Faixa de referência',
  exameNaReferencia: 'na referência',
  exameAcima: 'acima',
  exameAbaixo: 'abaixo',
  exameDesdeAnterior: 'Desde a coleta anterior',
  examePrimeira: 'Primeira coleta deste marcador',
  examePrimeiraSub: 'a próxima já vira comparação',
  exameCaminho: 'Ver no painel de exames',

  /* ---------------- anotação ---------------- */
  anotacao: 'Anotação guardada',
  anotacaoPauta: 'Na pauta da consulta',
  anotacaoComDoutor: (doutor: string) => `vai no resumo para ${doutor}`,
  anotacaoSemDoutor: 'vai no resumo para consulta',
  anotacaoCaminho: 'Ver o resumo para consulta',

  /* ---------------- refeição ---------------- */
  refeicao: 'Refeição registrada',
  refeicaoTexto: (agora: number, alvo: number) => `${agora} de ${alvo} g de proteína hoje`,
  refeicaoFesta: 'Meta de proteína do dia fechada',
  proteinaDoDia: 'Proteína do dia',
  proteinaMeta: (alvo: number) => `meta de ${alvo} g`,
  faltamGramas: (v: string) => `faltam ${v} g`,
  metaBatida: 'meta batida',
  refeicaoCaminho: 'Ver a alimentação do dia',

  /* ---------------- exercício ---------------- */
  exercicio: 'Treino registrado',
  exercicioTexto: (tipo: string, min: string) => `${tipo} · ${min} min`,
  exercicioSemTreino: (agora: number) => `${agora} min hoje`,
  exercicioFesta: 'Meta de movimento do dia fechada',
  movimentoDoDia: 'Movimento do dia',
  movimentoSub: (agora: number, alvo: number) => `${agora} de ${alvo} min`,
  faltamMinutos: (v: string) => `faltam ${v} min`,
  treinosHoje: 'Treinos hoje',
  exercicioCaminho: 'Ver a semana de exercício',

  /* ---------------- água ---------------- */
  agua: 'Água registrada',
  aguaFechada: 'Hidratação do dia fechada',
  aguaTexto: (agora: string, alvo: string) => `${agora} de ${alvo} hoje`,
  hidratacaoDoDia: 'Hidratação do dia',
  hidratacaoMeta: (alvo: string) => `meta de ${alvo}`,
  faltamAgua: (v: string) => `faltam ${v}`,
  aguaCaminho: 'Ver a hidratação',
};
