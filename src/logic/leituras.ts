/* ============================================================
   LEITURAS — o que o app diz depois de ler as respostas

   Moram aqui, e não na tela do check-in, porque duas telas precisam da
   mesma conclusão: o formulário, enquanto a pessoa responde, e a
   confirmação, depois de salvo. Se cada uma tivesse a sua tabela, o aviso
   que aparece durante o preenchimento poderia divergir do que aparece um
   toque depois — sobre o mesmo dia.

   São três camadas, e a tela escolhe qual mostra:

     · AVISOS de campo — um sintoma, respondido agora. Aparecem grudados
       no campo que os provocou, e só existem no formulário.
     · COMBINAÇÃO — vários sintomas do mesmo dia falando juntos. Nenhum
       campo enxerga isso sozinho.
     · PERSISTÊNCIA — o mesmo sintoma repetido na semana. Nenhum DIA
       enxerga isso sozinho.

   `leituraDoDia` devolve uma só: a combinação ganha da persistência
   porque fala do agora, e a persistência fala da semana.
   ============================================================ */

import { paraTela } from './escalas';

export type Leitura = { titulo: string; texto: string; acao: string };

/* ONDE A TELA DEIXA DE SÓ ANOTAR

   Um diário que registra e cala nos pontos que importam cumpre a função
   de arquivo e falha na de acompanhamento. Mas alarme em todo sintoma
   vira alarme nenhum, então o corte é um só: o aviso existe quando a
   resposta muda o que a pessoa deveria fazer HOJE. Fadiga e dor de cabeça
   ficam de fora por isso — quase sempre vêm de comer e beber pouco, e um
   aviso ali seria ruído sobre o que já é esperado.

   Nenhum deles nomeia diagnóstico. Quem lê já está com o sintoma, e um
   nome de doença assusta sem ajudar a decidir o próximo passo.

   E nenhum trata o sintoma como escolha. "Vomitar muito" e "nesse ritmo"
   descreviam o involuntário como se fosse hábito — quem vomita não está
   vomitando demais, está vomitando. O sujeito das frases é o sintoma ou o
   corpo, nunca a pessoa: ela é quem lê, não quem causou.

   As faixas não são iguais porque os sintomas não são: dor e tontura
   avisam no 4, onde a pessoa já teve o dia interrompido; as contagens —
   vômito, intestino — avisam no degrau em que a graduação clínica troca
   de patamar. */
export const AVISOS: Record<string, { min: number; titulo: string; texto: string; acao: string }> = {
  dor: {
    min: 4,
    titulo: 'Essa dor não espera a próxima consulta',
    texto: 'Dor forte na barriga, ou que não passa, é a única que pede atenção no mesmo dia. Quase sempre não é nada grave — e é por isso mesmo que vale olhar cedo.',
    acao: 'Fale com sua equipe hoje. Se piorar ou vier com vômito, procure um atendimento.',
  },
  vomito: {
    min: 4,
    titulo: 'Isso tira mais líquido do que parece',
    texto: 'Junto com a água vai o sal, e o corpo sente antes de você ter sede. E quando a comida não fica, o dia seguinte já começa cansado.',
    acao: 'Beba de pouquinho, várias vezes, em vez de um copo de uma vez. Se nem água ficar, fale com sua equipe hoje.',
  },
  tontura: {
    min: 4,
    titulo: 'Tontura assim costuma ter explicação',
    texto: 'Quase sempre é falta de líquido ou açúcar baixo. Se você toma algum remédio para diabetes junto, o açúcar baixo fica ainda mais provável.',
    acao: 'Sente-se, beba água e coma alguma coisa. Se repetir nos próximos dias, conte para sua equipe.',
  },
};

/* Os dois lados do intestino têm o seu, e ficam fora do mapa acima porque
   não são medidos em `grau` — um conta dias sem ir, o outro idas no dia. */
export const AVISO_PRESO = {
  min: 5,
  titulo: 'Quatro dias sem ir já merece atenção',
  texto: 'A caneta deixa tudo mais lento, e comendo menos sobra pouco para o intestino empurrar. Quatro dias é onde isso costuma parar de se resolver sozinho.',
  acao: 'Água ao longo do dia, fibra nas refeições e uma caminhada. Se passar de cinco dias, ou vier com dor forte e vômito, procure atendimento.',
};

export const AVISO_SOLTO = {
  min: 5,
  titulo: 'Assim o corpo perde mais do que repõe',
  texto: 'Sete idas ou mais num dia levam mais água e sal do que a sede dá conta de repor.',
  acao: 'Beba ao longo do dia sem esperar sede, com soro ou uma pitada de sal. Se amanhã continuar assim, avise sua equipe.',
};

/* AVISOS POR COMBINAÇÃO — o que nenhum sintoma sozinho consegue dizer.

   Dor forte é uma coisa; dor forte COM vômito é outra, e a bula trata as
   duas de maneiras diferentes. Até aqui cada campo só sabia de si, e o
   quadro que mais importa era justamente o que nenhum deles enxergava.

   A ordem é a da urgência, e só o primeiro que bate aparece: dois avisos
   graves ao mesmo tempo dividem a atenção em vez de somá-la.

   Quando uma combinação aparece, os avisos de campo somem. Eles dizem
   "converse com sua equipe" sobre um sintoma; a combinação diz "vá agora"
   sobre o conjunto, e manter os dois na tela é deixar o menos urgente
   discutir com o mais urgente. */
export type Niveis = { nausea: number; dor: number; vomito: number; tontura: number; preso: number; solto: number };

const COMBINACOES: { quando: (n: Niveis) => boolean; titulo: string; texto: string; acao: string }[] = [
  {
    /* Intestino parado há dias + dor forte + vômito. */
    quando: (n) => n.preso >= 4 && n.dor >= 4 && n.vomito >= 1,
    titulo: 'Essa combinação pede atendimento agora',
    texto: 'Intestino parado há dias, dor forte e vômito juntos podem ser sinal de que algo travou. É raro, mas não melhora sozinho.',
    acao: 'Procure um pronto atendimento hoje. Diga que usa a caneta e há quantos dias não vai ao banheiro.',
  },
  {
    /* Dor abdominal intensa com vômito — o quadro que toda bula de GLP-1
       manda relatar de imediato. */
    quando: (n) => n.dor >= 4 && n.vomito >= 3,
    titulo: 'Dor forte com vômito não espera',
    texto: 'Dor forte na barriga junto de vômito, às vezes espalhando para as costas, pede atenção no mesmo dia. Chegando cedo, é simples de checar.',
    acao: 'Procure sua equipe ou um atendimento hoje. Diga que usa a caneta, a dose e quando a dor começou.',
  },
  {
    /* Perda de líquido dos dois lados, ou muita de um, com tontura. */
    quando: (n) => (n.vomito >= 3 || n.solto >= 4) && n.tontura >= 3,
    titulo: 'Tontura junto disso é sinal de desidratação',
    texto: 'Quando falta água e sal, a pressão cai ao levantar — e a tontura é o corpo avisando.',
    acao: 'Beba de pouquinho ao longo do dia, com soro ou uma pitada de sal, e levante devagar. Se não melhorar até amanhã, avise sua equipe.',
  },
];

/* PERSISTÊNCIA — a outra coisa que um dia sozinho não diz.

   Enjoo hoje é o esperado de quem começou ou acabou de subir a dose.
   Enjoo em quatro dos últimos sete dias é outra frase: é o que separa
   "efeito da dose subindo" de "isso não está passando", e é exatamente o
   que muda a conduta na consulta. Até aqui a tela lia só o dia de hoje, e
   quem se acostuma com um sintoma para de achar que vale contar.

   Por isso o aviso traz o NÚMERO de dias: "quatro dos últimos sete" é um
   fato que a pessoa leva para a consulta, "você tem enjoo com frequência"
   é uma impressão que ela já tinha.

   O intestino preso aparece nas duas leituras, e não é repetição: a régua
   do campo conta dias seguidos sem ir — um episódio —, e aqui conta dias
   da semana com o intestino lento, que é o padrão de quem vai a cada três
   dias sem nunca ficar quatro sem ir.

   A ordem é a da urgência, e só o primeiro que bate aparece. */
const SEMANA = 7;

const PERSISTENCIA: {
  dias: number;
  noDia: (c: any) => boolean;
  hoje: (n: Niveis) => boolean;
  titulo: string;
  texto: (n: number) => string;
  acao: string;
}[] = [
  {
    dias: 3,
    noDia: (c) => ((c?.sint?.vomito ?? 0) as number) >= 1,
    hoje: (n) => n.vomito >= 1,
    titulo: 'Vômito em dias repetidos',
    texto: (n) => `${n} dos últimos sete dias com vômito. Assim comida, líquido e o próprio remédio não ficam.`,
    acao: 'Fale com sua equipe esta semana, sem esperar a consulta. Leve o número de dias — é ele que faz diferença.',
  },
  {
    dias: 3,
    noDia: (c) => c?.gut === 'solto',
    hoje: (n) => n.solto >= 1,
    titulo: 'O intestino está solto há dias',
    texto: (n) => `${n} dos últimos sete dias assim já pesa na hidratação, mesmo quando cada dia, sozinho, parece tranquilo.`,
    acao: 'Beba mais do que a sede pede e conte para sua equipe. Pode ser a dose, pode ser a alimentação.',
  },
  {
    dias: 4,
    /* 6 na régua de armazenamento é o 3 da tela — enjoo que incomodou. */
    noDia: (c) => ((c?.nausea ?? 0) as number) >= 6,
    hoje: (n) => n.nausea >= 3,
    titulo: 'O enjoo não está passando',
    texto: (n) => `${n} dos últimos sete dias com enjoo deixa de ser adaptação e vira padrão. Costuma mudar com a dose, ou com a velocidade que ela sobe.`,
    acao: 'Leve esse número para a próxima consulta. Segurar a dose um pouco mais não é desistir.',
  },
  {
    dias: 5,
    noDia: (c) => c?.gut === 'preso',
    hoje: (n) => n.preso >= 1,
    titulo: 'O intestino está lento a semana toda',
    texto: (n) => `${n} dos últimos sete dias com o intestino preso. Comer menos é efeito da caneta, e com menos comida passa menos fibra — ele sente antes da balança.`,
    acao: 'Água, fibra e caminhada ajudam. Nesse ritmo, vale contar para sua equipe.',
  },
];

/* ------------------------------------------------------------------ */
/* Os níveis a partir do REGISTRO salvo, e não do estado da tela.

   O formulário monta `Niveis` do que está marcado na hora; a tela de
   confirmação só tem o que foi para o arquivo. As duas precisam chegar ao
   mesmo lugar, então a conversão do registro para a mesma régua 1–5 mora
   aqui, ao lado de quem a consome. */
export function niveisDoRegistro(c: any): Niveis {
  const n = (v: any) => paraTela(v) ?? 0;
  return {
    nausea: n(c?.nausea),
    dor: (c?.sint?.dor ?? 0) as number,
    vomito: (c?.sint?.vomito ?? 0) as number,
    tontura: (c?.sint?.tontura ?? 0) as number,
    preso: c?.gut === 'preso' ? n(c?.constip) : 0,
    solto: c?.gut === 'solto' ? n(c?.diarreia) : 0,
  };
}

/** Os dias da semana ANTERIORES ao de hoje — o de hoje entra pelos
    `Niveis`, que podem estar mais novos do que o registro salvo. */
export function diasAnteriores(checkins: any[], hoje: number) {
  const desde = hoje - SEMANA * 24 * 3600 * 1000;
  return (checkins || []).filter((c) => c.t < hoje && c.t >= desde);
}

export function combinacao(n: Niveis): Leitura | null {
  return COMBINACOES.find((x) => x.quando(n)) ?? null;
}

export function persistencia(anteriores: any[], niveis: Niveis): Leitura | null {
  for (const r of PERSISTENCIA) {
    const n = anteriores.filter(r.noDia).length + (r.hoje(niveis) ? 1 : 0);
    if (n >= r.dias) return { titulo: r.titulo, texto: r.texto(n), acao: r.acao };
  }
  return null;
}

/** A leitura do dia, uma só. */
export function leituraDoDia(anteriores: any[], n: Niveis): Leitura | null {
  return combinacao(n) ?? persistencia(anteriores, n);
}

/* Os avisos de CAMPO que se aplicam ao dia, todos.

   No formulário cada um aparece grudado no campo que o provocou, e some
   quando uma combinação toma a frente. A confirmação faz o contrário:
   junta os que sobraram numa lista, porque ali a pessoa já respondeu tudo
   e o que resta é lembrar do que fazer com as respostas. */
export function avisosDoDia(n: Niveis): Leitura[] {
  const fora: Leitura[] = [];
  for (const [id, a] of Object.entries(AVISOS)) {
    if (((n as any)[id] ?? 0) >= a.min) fora.push({ titulo: a.titulo, texto: a.texto, acao: a.acao });
  }
  if (n.preso >= AVISO_PRESO.min) {
    fora.push({ titulo: AVISO_PRESO.titulo, texto: AVISO_PRESO.texto, acao: AVISO_PRESO.acao });
  }
  if (n.solto >= AVISO_SOLTO.min) {
    fora.push({ titulo: AVISO_SOLTO.titulo, texto: AVISO_SOLTO.texto, acao: AVISO_SOLTO.acao });
  }
  return fora;
}

/* O que a confirmação lembra, em ordem de urgência.

   Uma combinação cala o resto — ela diz "vá agora" sobre o conjunto, e
   uma lista embaixo dela vira ruído. Sem combinação, a persistência abre
   a lista e os avisos de campo vêm atrás. */
export function lembretesDoDia(anteriores: any[], n: Niveis): Leitura[] {
  const junto = combinacao(n);
  if (junto) return [junto];
  const semana = persistencia(anteriores, n);
  return [...(semana ? [semana] : []), ...avisosDoDia(n)];
}
