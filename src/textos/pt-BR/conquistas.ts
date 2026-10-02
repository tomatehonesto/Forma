/* ============================================================
   AS CONQUISTAS — as trilhas, o que cada nível diz e o que falta

   ⚠️⚠️ OS `id` E OS DEGRAUS NÃO ESTÃO AQUI. 'kg', 'rodizio', 'prot-seq'
   são dado, e os números de cada nível — 2, 5, 10, 15, 20, 30 quilos — são
   conteúdo: degraus próprios por idioma fariam a mesma pessoa ganhar
   conquistas diferentes conforme a língua em que lê. Ficam em
   logic/conquistas, junto da conta que os mede.

   ⚠️ CADA TRILHA FALA EM DOIS TEMPOS, e eles não são a mesma frase:

     · `desc`   o que aquele nível JÁ É — "12 doses registradas"
     · `falta`  o que separa dela o próximo — "Faltam 14 doses"

   O primeiro é do passado e se lê com orgulho; o segundo é do futuro e
   tem de caber numa linha sem soar a cobrança. "Faltam" e não "você
   precisa de": o sujeito é a distância, e não a pessoa.

   ⚠️ E O PLURAL É GRAMÁTICA, e por isso mora aqui. O português tem
   irregular — "local" vira "locais", "sessão" vira "sessões" —, e um
   `+ 's'` pendurado no fim erraria os dois em silêncio.
   ============================================================ */

/* O plural do português, com o irregular dito por extenso quando existe. */
const p = (n: number, s: string, pl = `${s}s`) => `${n} ${n === 1 ? s : pl}`;
/* E o verbo concorda com o número: "Falta 1 dose", e não "Faltam 1".
   Só nas frases em que a quantidade é um número; "Faltam 2,0 kg" fica. */
const v = (n: number, um: string, varios: string) => (n === 1 ? um : varios);

export const conquistas = {
  /* As oito famílias, que são as abas da tela. */
  familias: {
    tratamento: 'Tratamento',
    peso: 'Peso',
    constancia: 'Constância',
    hidratacao: 'Hidratação',
    proteina: 'Proteína',
    movimento: 'Movimento',
    comida: 'Alimentação',
    acompanhamento: 'Acompanhamento',
  },

  /* ---------------- tratamento ---------------- */
  /* ⚠️ "DOSES", E ERA "APLICAÇÕES" (01/10/2026): a trilha é a mesma para
     quem injeta e para quem toma comprimido, e "dose" é o substantivo de
     todas as formas. O ícone é que segue a forma, em logic/conquistas. */
  doses: 'Doses',
  dosesDesc: (a: number) => `${p(a, 'dose')} registrada${a === 1 ? '' : 's'}`,
  dosesFalta: (r: number) => `${v(r, 'Falta', 'Faltam')} ${p(r, 'dose')}`,
  /* ⚠️ A TRILHA DE QUEM TOMA TODO DIA CONTA DIAS COM DOSE (01/10/2026,
     decisão do dono — parte B2 de docs/superpowers/specs/2026-10-01-oral-e-diario-design.md):
     degraus de 7, 30, 90, 180 e 365 dias, e duas doses no mesmo dia são um
     dia. "Dias com dose", e não "doses": é o que a trilha mede, e é a mesma
     palavra do painel da Jornada. */
  dosesDiasDesc: (a: number) => `${p(a, 'dia')} com dose`,
  dosesDiasFalta: (r: number) => `${v(r, 'Falta', 'Faltam')} ${p(r, 'dia')} com dose`,

  tempo: 'Tempo de tratamento',
  /* Abaixo de um ano conta em meses, e a partir dele em anos: "12 meses"
     e "1 ano" são o mesmo tempo, e só o segundo se comemora. */
  tempoDesc: (a: number) => (a < 365
    ? `${a / 30} ${a === 30 ? 'mês' : 'meses'} desde a primeira dose`
    : `${a / 365} ano${a > 365 ? 's' : ''} desde a primeira dose`),
  tempoFalta: (r: number) => `${v(r, 'Falta', 'Faltam')} ${p(r, 'dia')}`,
  /* Sem dose registrada, o tempo de tratamento não começou a contar, e
     "Faltam 30 dias" contava de uma primeira dose que não existe. */
  tempoSemDose: 'Começa na primeira dose registrada',

  /* ⚠️ O RODÍZIO NÃO É ENFEITE: repetir o mesmo ponto causa nódulo, e
     alternar é orientação de bula. É a única trilha que premia uma
     prática de segurança — e só existe para quem injeta (01/10/2026). */
  rodizio: 'Rodízio',
  rodizioDesc: (a: number) => `${p(a, 'local', 'locais')} de aplicação usado${a === 1 ? '' : 's'}`,
  rodizioFalta: (r: number) => `${v(r, 'Falta', 'Faltam')} ${p(r, 'local', 'locais')}`,

  titulacao: 'Titulação',
  titulacaoDesc: (a: string) => `Chegar à dose de ${a}`,
  titulacaoFalta: (a: string) => `Próxima: ${a}`,

  /* ---------------- peso ---------------- */
  /* ⚠️ O PESO CHEGA JÁ ESCRITO, na unidade de quem lê — "4,4 lb abaixo do
     peso inicial". Ver logic/medidas.

     ⚠️⚠️ E POR ISSO O TÍTULO NÃO DIZ A UNIDADE. "Quilos a menos" em cima
     de um valor em libra é a tela se contradizendo — e "Pounds down" em
     cima de um valor em quilo é o mesmo erro pelo outro lado. Os seis
     idiomas tinham um dos dois. A unidade é escolha de quem lê, e quem a
     escreve é o valor; o título nomeia a grandeza, que não muda de
     sistema. Vale igual para a cintura, lá embaixo. */
  kg: 'Peso a menos',
  kgDesc: (peso: string) => `${peso} abaixo do peso inicial`,
  kgFalta: (peso: string) => `Faltam ${peso}`,

  /* ⚠️ A PORCENTAGEM É OUTRA CONVERSA, e não repetição dos quilos: os
     cinco por cento são a marca clínica que a literatura usa, e dez quilos
     significam coisas diferentes em corpos diferentes. */
  pct: 'Percentual perdido',
  pctDesc: (a: number) => `${a}% do peso inicial`,
  pctFalta: (r: string) => `Faltam ${r} pontos`,

  pesagens: 'Pesagens',
  pesagensDesc: (a: number) => `${p(a, 'pesagem', 'pesagens')} registrada${a === 1 ? '' : 's'}`,
  pesagensFalta: (r: number) => `${v(r, 'Falta', 'Faltam')} ${p(r, 'pesagem', 'pesagens')}`,

  /* ---------------- constância ---------------- */
  checkins: 'Check-ins',
  checkinsDesc: (a: number) => `${p(a, 'dia')} com check-in`,
  checkinsFalta: (r: number) => `${v(r, 'Falta', 'Faltam')} ${p(r, 'dia')}`,

  sequencia: 'Dias seguidos',
  sequenciaDesc: (a: number) => `${p(a, 'check-in')} seguidos`,
  sequenciaFalta: (r: number, alvo: number) => `${v(r, 'Falta', 'Faltam')} ${p(r, 'dia')} para ${alvo}`,

  /* ---------------- hidratação ---------------- */
  aguaDias: 'Dias na meta de água',
  aguaDiasDesc: (a: number) => `${p(a, 'dia')} na meta de água`,
  aguaDiasFalta: (r: number) => `${v(r, 'Falta', 'Faltam')} ${p(r, 'dia')}`,

  aguaSemana: 'Semana hidratada',
  aguaSemanaDesc: (a: number) => `${p(a, 'dia')} na meta, na mesma semana`,
  aguaSemanaFalta: (r: number, alvo: number) => `${v(r, 'Falta', 'Faltam')} ${p(r, 'dia')} para ${alvo}`,

  /* ---------------- proteína ---------------- */
  protDias: 'Dias na meta de proteína',
  protDiasDesc: (a: number) => `${p(a, 'dia')} na meta de proteína`,
  protDiasFalta: (r: number) => `${v(r, 'Falta', 'Faltam')} ${p(r, 'dia')}`,

  protSeq: 'Proteína seguida',
  protSeqDesc: (a: number) => `${p(a, 'dia')} seguidos na meta`,
  protSeqFalta: (r: number, alvo: number) => `${v(r, 'Falta', 'Faltam')} ${p(r, 'dia')} para ${alvo}`,

  /* ---------------- movimento ---------------- */
  treinos: 'Treinos',
  treinosDesc: (a: number) => `${p(a, 'sessão', 'sessões')} registrada${a === 1 ? '' : 's'}`,
  treinosFalta: (r: number) => `${v(r, 'Falta', 'Faltam')} ${p(r, 'treino')}`,

  exercSemana: 'Semana ativa',
  exercSemanaDesc: (a: number) => `${p(a, 'dia')} na meta de movimento, na mesma semana`,
  exercSemanaFalta: (r: number, alvo: number) => `${v(r, 'Falta', 'Faltam')} ${p(r, 'dia')} para ${alvo}`,

  /* ---------------- alimentação ---------------- */
  refeicoes: 'Refeições',
  refeicoesDesc: (a: number) => `${p(a, 'refeição', 'refeições')} registrada${a === 1 ? '' : 's'}`,
  refeicoesFalta: (r: number) => `${v(r, 'Falta', 'Faltam')} ${p(r, 'refeição', 'refeições')}`,

  favoritos: 'Pratos favoritos',
  favoritosDesc: (a: number) => `${p(a, 'prato')} guardado${a === 1 ? '' : 's'} para repetir`,
  favoritosFalta: (r: number) => `${v(r, 'Falta', 'Faltam')} ${p(r, 'prato')}`,

  /* ---------------- acompanhamento ---------------- */
  medidas: 'Medidas do corpo',
  medidasDesc: (a: number) => `${p(a, 'medição', 'medições')} registrada${a === 1 ? '' : 's'}`,
  medidasFalta: (r: number) => `${v(r, 'Falta', 'Faltam')} ${p(r, 'medição', 'medições')}`,

  /* ⚠️ SEM UNIDADE NO TÍTULO, pelo mesmo motivo da conquista de peso: o
     valor chega em centímetro ou em polegada, conforme quem lê. */
  cintura: 'Cintura',
  cinturaDesc: (comp: string) => `${comp} a menos na cintura`,
  cinturaFalta: (comp: string) => `Faltam ${comp}`,

  exames: 'Exames',
  examesDesc: (a: number) => `${p(a, 'exame')} anotado${a === 1 ? '' : 's'}`,
  examesFalta: (r: number) => `${v(r, 'Falta', 'Faltam')} ${p(r, 'exame')}`,

  consultas: 'Consultas',
  consultasDesc: (a: number) => `${p(a, 'consulta')} no histórico`,
  consultasFalta: (r: number) => `${v(r, 'Falta', 'Faltam')} ${p(r, 'consulta')}`,

  /* O marco na linha do tempo: a trilha e em que nível ela estava. */
  marco: (titulo: string, nivel: number) => `${titulo} · nível ${nivel}`,
  /* ============================================================
     CONQUISTAS — a tela, e a folha da trilha

     `nivelDeTotal` é lida pelas DUAS: o cartão da grade e o cabeçalho de
     /trilha diziam a mesma frase, cada um com a sua cópia.
     ============================================================ */
  tela: {
    titulo: 'Conquistas',
    lead: 'Marcos que saem sozinhos do que você registrou — ninguém aqui decide se você merece.',

    nivelDeTotal: (nivel: number, total: number) => `Nível ${nivel} de ${total}`,
    niveisTotal: (total: number) => `${total} ${total === 1 ? 'nível' : 'níveis'}`,
    trilhaCompleta: 'Trilha completa',

    todas: 'Todas',
    checkinsNoMes: 'check-ins no mês',
    niveis: 'níveis',
    diasDeJornada: (dias: number): string => (dias === 1 ? 'dia de jornada' : 'dias de jornada'),

    conquistadas: 'Conquistadas',
    nenhumaAinda: 'Nenhuma ainda',
    nenhumaAindaTexto: 'As que estão a caminho aparecem logo abaixo.',
    ossoDaRegra: 'Os níveis saem dos seus registros. Se um registro sair, o nível que ele fechou sai junto.',
    aCaminho: 'A caminho',
  },
  telaConquistaOk: {
    alcancada: 'CONQUISTA ALCANÇADA',
    noMesmoRegistro: 'NO MESMO REGISTRO',
  },
};
