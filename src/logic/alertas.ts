import type { State } from './seed';
import { nextInjectionDate } from './derive';
import { DOW_SHORT, addDays, hm, now, startOfDay } from './time';

/* ============================================================
   ALERTAS — os lembretes deixam de ser quatro interruptores

   O app tinha exatamente quatro lembretes, um por assunto, e cada um
   tinha um horário. Quem quisesse beber água de manhã e de tarde tinha
   um horário. Quem se pesa às segundas e às quintas tinha um dia. O
   assunto e o aviso eram a mesma coisa, e por isso nenhum dos dois podia
   se repetir.

   Aqui eles se separam. O assunto continua sendo quatro — dose, pesagem,
   hidratação, proteína —, e cada um passa a ter QUANTOS ALERTAS QUISER.
   É o modelo do despertador do celular, e não é coincidência: o problema
   é o mesmo. Ninguém acha estranho ter três alarmes de manhã.

   CADA ALERTA GUARDA UMA LISTA DE HORÁRIOS E UMA LISTA DE DIAS. Lista, e
   não valor: "todo dia às 10h e às 16h" é um alerta com dois horários, e
   não dois alertas — a pessoa pensa nisso como uma coisa só, e desligar
   deve desligar as duas pontas de uma vez.

   DIAS VAZIO QUER DIZER TODO DIA. É a ausência com significado, e não um
   caso especial: o alerta que não escolheu dia nenhum não está incompleto,
   está dizendo que vale sempre.
   ============================================================ */

export type TipoDeAlerta = 'dose' | 'peso' | 'agua' | 'proteina';

export type Alerta = {
  id: string;
  tipo: TipoDeAlerta;
  on: boolean;
  /** um ou mais horários do dia, em hora cheia */
  horas: number[];
  /** dias da semana, 0 = domingo. Vazio quer dizer todo dia. */
  dias: number[];
  /** só a dose usa: quantos dias antes da aplicação */
  lead?: number;
};

/* O QUE CADA ASSUNTO É, e o que ele deixa configurar.

   A dose não tem dia da semana porque ela não acontece num dia da semana
   — acontece antes da próxima aplicação, que anda. Os outros três não
   têm antecedência porque não há evento a anteceder: eles são o próprio
   evento. É a mesma estrutura com dois campos que se alternam, e não dois
   tipos de alerta. */
export const TIPOS: Record<TipoDeAlerta, {
  titulo: string; ic: string; desc: string; temDias: boolean; temLead: boolean;
}> = {
  dose: {
    titulo: 'Aplicação da caneta', ic: 'syringe',
    desc: 'Um aviso antes da próxima dose, para manter o tratamento em dia.',
    temDias: false, temLead: true,
  },
  peso: {
    titulo: 'Pesagem', ic: 'scale',
    desc: 'Um toque nos dias em que você quer subir na balança.',
    temDias: true, temLead: false,
  },
  agua: {
    titulo: 'Hidratação', ic: 'water',
    desc: 'Empurrõezinhos para beber água — ajudam com saciedade e enjoo.',
    temDias: true, temLead: false,
  },
  proteina: {
    titulo: 'Proteína', ic: 'flame',
    desc: 'Lembrete para priorizar proteína nas refeições do dia.',
    temDias: true, temLead: false,
  },
};

export const ORDEM: TipoDeAlerta[] = ['dose', 'peso', 'agua', 'proteina'];

/* DE HORA EM HORA, das seis da manhã às nove da noite.

   SEM MINUTOS, e isto é escolha e não falta: um lembrete de beber água às
   15:20 não é melhor do que às 15:00, e uma roda de minutos custaria dois
   gestos a cada alerta por uma precisão que o assunto não pede. Se um dia
   um alerta precisar de hora quebrada, o campo que falta é o minuto e a
   lista continua servindo para o resto.

   E SÃO DEZESSEIS, que é o que preenche quatro colunas exatas. Havia
   dezessete, até as dez da noite, e a décima sétima ficava sozinha numa
   quinta fileira — uma peça órfã embaixo de uma grade cheia. O que se
   perdeu foi um horário em que nenhum dos quatro assuntos faz sentido:
   pesar às dez da noite, beber água antes de dormir, ou saber às 22h que
   a aplicação era hoje. */
export const HORAS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

export const LEADS = [0, 1, 2, 3];

export const rotuloDoLead = (n: number) => (n === 0 ? 'No dia' : `${n} dia${n > 1 ? 's' : ''} antes`);

const id = () => `al-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

/* O ALERTA NOVO JÁ NASCE VÁLIDO. Sem horário nenhum ele não tocaria, e
   uma folha que abre vazia obriga a pessoa a adivinhar o que falta antes
   de poder salvar. O padrão de cada assunto é o horário em que ele faz
   mais sentido — água à tarde, proteína no almoço, peso de manhã. */
const PADRAO: Record<TipoDeAlerta, { horas: number[]; lead?: number }> = {
  dose: { horas: [9], lead: 1 },
  peso: { horas: [8] },
  agua: { horas: [15] },
  proteina: { horas: [12] },
};

export function novoAlerta(tipo: TipoDeAlerta): Alerta {
  return { id: id(), tipo, on: true, horas: [...PADRAO[tipo].horas], dias: [], lead: PADRAO[tipo].lead };
}

export const alertasDe = (S: State, tipo: TipoDeAlerta): Alerta[] =>
  ((S as any).alertas as Alerta[] ?? []).filter((a) => a.tipo === tipo);

export const alertasAtivos = (S: State): number =>
  ((S as any).alertas as Alerta[] ?? []).filter((a) => a.on).length;

export const acharAlerta = (S: State, alertaId: string): Alerta | null =>
  ((S as any).alertas as Alerta[] ?? []).find((a) => a.id === alertaId) ?? null;

/* ------------------------------------------------------------------ */

const horasEmTexto = (horas: number[]) =>
  [...horas].sort((a, b) => a - b).map((h) => hm(h, 0)).join(', ');

const diasEmTexto = (dias: number[]) => {
  if (!dias.length) return 'Todo dia';
  /* Começa na segunda: a semana de quem marca dia de pesagem começa
     quando a rotina começa, e não no domingo do calendário. */
  const ordem = [1, 2, 3, 4, 5, 6, 0].filter((d) => dias.includes(d));
  if (ordem.length === 7) return 'Todo dia';
  if (ordem.length === 5 && ![0, 6].some((d) => dias.includes(d))) return 'Dias úteis';
  if (ordem.length === 2 && dias.includes(0) && dias.includes(6)) return 'Fim de semana';
  const nomes = ordem.map((d) => DOW_SHORT[d]);
  return nomes[0].charAt(0).toUpperCase() + nomes[0].slice(1) + (nomes.length > 1 ? `, ${nomes.slice(1).join(', ')}` : '');
};

/** O alerta em uma linha: quando ele toca, e a que horas. */
export function resumoDe(a: Alerta): string {
  const quando = a.tipo === 'dose' ? rotuloDoLead(a.lead ?? 0) : diasEmTexto(a.dias);
  return `${quando} · ${horasEmTexto(a.horas)}`;
}

/* ------------------------------------------------------------------ */
/* AS PRÓXIMAS VEZES EM QUE ESTE ALERTA TOCA.

   É a mesma conta que a tela usa para escrever "próximo: sábado · 09:00"
   e que o agendador usa para marcar no sistema. Uma conta só: dois jeitos
   de descobrir quando um alerta toca é como a tela passa a prometer um
   horário e o aparelho a tocar em outro. */
export function proximasDe(S: State, a: Alerta): Date[] {
  if (!a.on || !a.horas.length) return [];
  const agora = now();
  const saida: Date[] = [];

  if (a.tipo === 'dose') {
    const base = addDays(startOfDay(nextInjectionDate(S)), -(a.lead ?? 0)) as Date;
    for (const h of a.horas) {
      const d = new Date(base); d.setHours(h, 0, 0, 0);
      if (d > agora) saida.push(d);
    }
    return saida.sort((x, y) => +x - +y);
  }

  /* Para os demais, a próxima ocorrência de cada par (dia, hora) dentro
     dos próximos sete dias. Sem dia escolhido, todo dia entra. */
  const dias = a.dias.length ? a.dias : [0, 1, 2, 3, 4, 5, 6];
  const hoje = startOfDay(agora);
  for (let k = 0; k < 8; k++) {
    const d0 = addDays(hoje, k) as Date;
    if (!dias.includes(d0.getDay())) continue;
    for (const h of a.horas) {
      const d = new Date(d0); d.setHours(h, 0, 0, 0);
      if (d > agora) saida.push(d);
    }
  }
  return saida.sort((x, y) => +x - +y);
}

export const proximaDe = (S: State, a: Alerta): Date | null => proximasDe(S, a)[0] ?? null;

/** "hoje · 09:00", "amanhã · 08:00", "sábado · 09:00" */
export function quando(d: Date | null): string | null {
  if (!d) return null;
  const dias = Math.round((+startOfDay(d) - +startOfDay(now())) / 86400000);
  const DOW = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const dia = dias <= 0 ? 'hoje' : dias === 1 ? 'amanhã' : DOW[d.getDay()];
  return `${dia} · ${hm(d.getHours(), d.getMinutes())}`;
}
