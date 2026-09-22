/* ============================================================
   OS LEMBRETES — os cinco tipos e como cada um se descreve

   ⚠️ CADA TIPO TEM TRÊS PEÇAS, e a do meio existe por causa de largura:

     · `titulo`  o nome na tela de configuração
     · `curto`   o mesmo nome numa linha apertada, ao lado de um horário
     · `desc`    o que ele faz, em uma frase

   ⚠️ "APLICAÇÃO DA DOSE", E ERA "DA CANETA". A tabela não sabe a forma do
   medicamento de quem está lendo, e a saída foi a frase que serve caneta,
   frasco e seringa igualmente. Comprimido ainda lê "aplicação" aqui, e é
   dívida conhecida: a palavra teria de vir do vocabulário de formas.

   ⚠️ E O CHECK-IN É O ÚNICO QUE PERGUNTA. Os outros quatro avisam sobre
   coisas que a pessoa FAZ — aplicar, pesar, beber, comer. Justamente por
   isso ele é o que mais se perde, porque nada no dia lembra de responder.
   ============================================================ */

export const alertas = {
  dose: 'Aplicação da dose',
  doseCurto: 'Aplicação',
  doseDesc: 'Um aviso antes da próxima dose, para manter o tratamento em dia.',

  checkin: 'Check-in do dia',
  checkinCurto: 'Check-in',
  checkinDesc: 'Um toque para responder como foi o dia — sono, fome, energia e humor.',

  peso: 'Pesagem',
  pesoCurto: 'Pesagem',
  pesoDesc: 'Um toque nos dias em que você quer subir na balança.',

  agua: 'Hidratação',
  aguaCurto: 'Hidratação',
  aguaDesc: 'Empurrõezinhos para beber água — ajudam com saciedade e enjoo.',

  proteina: 'Proteína',
  proteinaCurto: 'Proteína',
  proteinaDesc: 'Lembrete para priorizar proteína nas refeições do dia.',

  /* ---------- quando ---------- */
  /* A antecedência do aviso da dose: no dia, ou tantos dias antes. */
  noDia: 'No dia',
  diasAntes: (n: number) => `${n} dia${n > 1 ? 's' : ''} antes`,

  /* ⚠️ OS TRÊS ATALHOS DE SEMANA SÃO NOME DE CONJUNTO, e não enumeração.
     "Segunda, terça, quarta, quinta, sexta" é correto e ninguém lê;
     "Dias úteis" é a mesma coisa em duas palavras. */
  todoDia: 'Todo dia',
  diasUteis: 'Dias úteis',
  fimDeSemana: 'Fim de semana',
  /* A lista solta, quando não é nenhum dos três atalhos. */
  listaDeDias: (primeiro: string, resto: string[]) =>
    primeiro + (resto.length ? `, ${resto.join(', ')}` : ''),

  /* ⚠️ O INTERVALO SE DIZ COMO REGRA, E NÃO COMO LISTA. "A cada 2h, das 8h
     às 20h" é uma frase; as sete horas que ela gera não caberiam na linha,
     e caberiam ainda menos na cabeça de quem só quer conferir o que
     configurou. */
  aCada: (cada: number, de: number, ate: number) => `a cada ${cada}h, ${de}h às ${ate}h`,
  quandoEHoras: (quando: string, horas: string) => `${quando} · ${horas}`,

  /* ============================================================
     A FOLHA DE UM ALERTA

     ⚠️ O TÍTULO ERA CONCATENAÇÃO NA TELA: `'Alerta de ' + titulo.toLowerCase()`.
     Duas coisas erradas na mesma linha — a ordem das palavras fica presa
     à do português, e o `.toLowerCase()` é regra de idioma: em alemão ele
     abaixaria um substantivo. Agora é função, e `comum.noMeio` cuida da
     caixa.
     ============================================================ */
  tela: {
    alertaDe: (tipo: string) => `Alerta de ${tipo}`,
    novoAlerta: 'Novo alerta',
    salvar: 'Salvar',
    criar: 'Criar alerta',
    apagar: 'Apagar este alerta',

    oQueAvisar: 'O que avisar',

    antecedencia: 'Antecedência',
    antecedenciaAjuda: 'Contada a partir da data da sua próxima aplicação.',

    diasDaSemana: 'Dias da semana',
    diasDaSemanaAjuda: 'Sem nenhum marcado, o alerta toca todo dia.',

    quandoTocar: 'Quando tocar',
    modoHorarios: 'Horários',
    modoIntervalo: 'Intervalo',

    horarios: 'Horários',
    horariosAjuda: 'Dá para marcar mais de um — o alerta toca em cada um deles.',

    aCada: 'A cada',
    aCadaHoras: (horas: number) => `${horas}h`,
    comeca: 'Começa',
    ate: 'Até',
    ateAjuda: (avisos: number, cada: number) =>
      `${avisos} avisos por dia, de ${cada} em ${cada} horas.`,

    tocaEm: (quando: string) => `Toca ${quando}`,
    semHorario: 'Sem horário marcado',
  },
};
