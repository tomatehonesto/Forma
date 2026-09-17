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

/* DOIS JEITOS DE DIZER A QUE HORAS.

   Escolher hora a hora serve para o que acontece uma ou duas vezes no dia:
   a pesagem de manhã, a proteína no almoço. Não serve para a hidratação,
   que é o oposto — não é um momento, é o dia inteiro em intervalos. Marcar
   oito horários a dedo para beber água é o app fazendo a pessoa trabalhar
   para descrever uma coisa que cabe em uma frase: de duas em duas horas,
   das oito às vinte e duas.

   Os dois modos chegam no mesmo lugar, que é uma lista de horas — ver
   horasDe. O modo é guardado, e não só a lista que ele gerou, porque quem
   abre de novo para editar quer mexer no intervalo, e não em oito
   pastilhas soltas que não se sabe mais de onde vieram. */
export type ModoDeHora = 'horas' | 'intervalo';

export type Alerta = {
  id: string;
  tipo: TipoDeAlerta;
  on: boolean;
  modo: ModoDeHora;
  /** modo 'horas': os horários escolhidos a dedo */
  horas: number[];
  /** modo 'intervalo': de quantas em quantas horas, e a janela do dia */
  cada: number;
  de: number;
  ate: number;
  /** dias da semana, 0 = domingo. Vazio quer dizer todo dia. */
  dias: number[];
  /** só a dose usa: quantos dias antes da aplicação */
  lead?: number;
};

export const CADAS = [1, 2, 3, 4, 6];

/* A JANELA TEM LISTAS PRÓPRIAS, e não a grade de horários.

   O começo de uma janela de lembrete é de manhã e o fim é de noite — e as
   22h, que saíram da grade por não fazer sentido como momento de alerta,
   fazem todo sentido como FIM de janela: "até as dez da noite" é
   exatamente o que alguém diz ao descrever o próprio dia. */
export const INICIOS = [6, 7, 8, 9, 10, 11, 12];
export const FINS = [16, 17, 18, 19, 20, 21, 22];

/** As horas em que este alerta toca, venham da lista ou do intervalo. */
export function horasDe(a: Alerta): number[] {
  if (a.modo !== 'intervalo') return [...(a.horas ?? [])].sort((x, y) => x - y);
  const passo = Math.max(1, a.cada || 1);
  const saida: number[] = [];
  for (let h = a.de; h <= a.ate; h += passo) saida.push(h);
  return saida;
}

/* O QUE CADA ASSUNTO É, e o que ele deixa configurar.

   A dose não tem dia da semana porque ela não acontece num dia da semana
   — acontece antes da próxima aplicação, que anda. Os outros três não
   têm antecedência porque não há evento a anteceder: eles são o próprio
   evento. É a mesma estrutura com dois campos que se alternam, e não dois
   tipos de alerta. */
export const TIPOS: Record<TipoDeAlerta, {
  titulo: string;
  /* O NOME QUE CABE NUMA COLUNA. Só a dose difere do título, e difere
     porque "Aplicação da caneta" numa grade de duas colunas termina em
     reticências — e um nome cortado numa lista de escolha é a única das
     quatro opções que a pessoa não consegue ler antes de tocar. */
  curto: string;
  ic: string; desc: string; temDias: boolean; temLead: boolean;
}> = {
  dose: {
    titulo: 'Aplicação da caneta', curto: 'Aplicação', ic: 'syringe',
    desc: 'Um aviso antes da próxima dose, para manter o tratamento em dia.',
    temDias: false, temLead: true,
  },
  peso: {
    titulo: 'Pesagem', curto: 'Pesagem', ic: 'scale',
    desc: 'Um toque nos dias em que você quer subir na balança.',
    temDias: true, temLead: false,
  },
  agua: {
    titulo: 'Hidratação', curto: 'Hidratação', ic: 'water',
    desc: 'Empurrõezinhos para beber água — ajudam com saciedade e enjoo.',
    temDias: true, temLead: false,
  },
  proteina: {
    titulo: 'Proteína', curto: 'Proteína', ic: 'flame',
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
/* E A HIDRATAÇÃO JÁ NASCE EM INTERVALO, que é o jeito como ela é vivida:
   ninguém decide beber água às 15h, decide beber de tempos em tempos. Os
   outros três nascem com a hora em que fazem sentido. */
const PADRAO: Record<TipoDeAlerta, Partial<Alerta>> = {
  dose: { modo: 'horas', horas: [9], lead: 1 },
  peso: { modo: 'horas', horas: [8] },
  agua: { modo: 'intervalo', cada: 2, de: 8, ate: 20 },
  proteina: { modo: 'horas', horas: [12] },
};

export function novoAlerta(tipo: TipoDeAlerta): Alerta {
  return {
    id: id(), tipo, on: true, dias: [],
    modo: 'horas', horas: [9], cada: 2, de: 8, ate: 20,
    ...PADRAO[tipo],
  } as Alerta;
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

/* A SEMANA DO CALENDÁRIO, começando no domingo. É a ordem em que a fileira
   de dias aparece na folha, e resumo e seletor discordarem seria a pessoa
   marcar da esquerda para a direita e ler de outro jeito. */
export const SEMANA = [0, 1, 2, 3, 4, 5, 6];

/** D S T Q Q S S — a inicial de cada dia, para a fileira de sete. */
export const inicialDoDia = (d: number) => DOW_SHORT[d].charAt(0).toUpperCase();

const diasEmTexto = (dias: number[]) => {
  if (!dias.length) return 'Todo dia';
  const ordem = SEMANA.filter((d) => dias.includes(d));
  if (ordem.length === 7) return 'Todo dia';
  if (ordem.length === 5 && ![0, 6].some((d) => dias.includes(d))) return 'Dias úteis';
  if (ordem.length === 2 && dias.includes(0) && dias.includes(6)) return 'Fim de semana';
  const nomes = ordem.map((d) => DOW_SHORT[d]);
  return nomes[0].charAt(0).toUpperCase() + nomes[0].slice(1) + (nomes.length > 1 ? `, ${nomes.slice(1).join(', ')}` : '');
};

/** O alerta em uma linha: quando ele toca, e a que horas. */
export function resumoDe(a: Alerta): string {
  const quando = a.tipo === 'dose' ? rotuloDoLead(a.lead ?? 0) : diasEmTexto(a.dias);
  /* O INTERVALO SE DESCREVE, e não se lista. "De 2 em 2h, 8h às 20h" é
     uma frase; as sete horas que ela gera não caberiam na linha, e caberiam
     ainda menos na cabeça de quem só quer conferir o que configurou. */
  const horas = a.modo === 'intervalo'
    ? `a cada ${a.cada}h, ${a.de}h às ${a.ate}h`
    : horasEmTexto(horasDe(a));
  return `${quando} · ${horas}`;
}

/* ------------------------------------------------------------------ */
/* AS PRÓXIMAS VEZES EM QUE ESTE ALERTA TOCA.

   É a mesma conta que a tela usa para escrever "próximo: sábado · 09:00"
   e que o agendador usa para marcar no sistema. Uma conta só: dois jeitos
   de descobrir quando um alerta toca é como a tela passa a prometer um
   horário e o aparelho a tocar em outro. */
export function proximasDe(S: State, a: Alerta, quantas = 1): Date[] {
  if (!a.on || !horasDe(a).length) return [];
  const agora = now();
  const saida: Date[] = [];

  const horas = horasDe(a);

  if (a.tipo === 'dose') {
    const base = addDays(startOfDay(nextInjectionDate(S)), -(a.lead ?? 0)) as Date;
    for (const h of horas) {
      const d = new Date(base); d.setHours(h, 0, 0, 0);
      if (d > agora) saida.push(d);
    }
    return saida.sort((x, y) => +x - +y);
  }

  /* Para os demais, a próxima ocorrência de cada par (dia, hora), dia a
     dia, até juntar quantas foram pedidas. Sem dia escolhido, todo dia
     entra.

     O HORIZONTE ACOMPANHA O PEDIDO. Ele já foi fixo em sete dias, e isso
     bastava enquanto quem chamava queria só a próxima vez. O agendador
     passou a pedir dezenas — ele reparte um orçamento de avisos entre os
     alertas ligados —, e um alerta semanal não teria o que dar dentro de
     uma semana. Cinco semanas é onde a varredura para: além disso, o app
     já terá aberto, e quem não abrir em cinco semanas tem outro assunto
     com este aplicativo. */
  const dias = a.dias.length ? a.dias : [0, 1, 2, 3, 4, 5, 6];
  const hoje = startOfDay(agora);
  for (let k = 0; k < 35 && saida.length < quantas; k++) {
    const d0 = addDays(hoje, k) as Date;
    if (!dias.includes(d0.getDay())) continue;
    for (const h of horas) {
      const d = new Date(d0); d.setHours(h, 0, 0, 0);
      if (d > agora) saida.push(d);
    }
  }
  return saida.sort((x, y) => +x - +y).slice(0, quantas);
}

export const proximaDe = (S: State, a: Alerta): Date | null => proximasDe(S, a, 1)[0] ?? null;

/** "hoje · 09:00", "amanhã · 08:00", "sábado · 09:00" */
export function quando(d: Date | null): string | null {
  if (!d) return null;
  const dias = Math.round((+startOfDay(d) - +startOfDay(now())) / 86400000);
  const DOW = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const dia = dias <= 0 ? 'hoje' : dias === 1 ? 'amanhã' : DOW[d.getDay()];
  return `${dia} · ${hm(d.getHours(), d.getMinutes())}`;
}
