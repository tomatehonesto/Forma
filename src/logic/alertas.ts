import type { State } from './seed';
import { nextInjectionDate, temCiclo, doseDiaria, doseDeHoje } from './derive';
import { WD, diasDaSemana, addDays, hm, now, startOfDay, quandoEm, maiuscula, ordemDaSemana } from './time';
import { T } from '../textos';
import { iconeDaDose, formaDe } from './formas';

/* ============================================================
   ALERTAS — os lembretes deixam de ser quatro interruptores

   O app tinha exatamente quatro lembretes, um por assunto, e cada um
   tinha um horário. Quem quisesse beber água de manhã e de tarde tinha
   um horário. Quem se pesa às segundas e às quintas tinha um dia. O
   assunto e o aviso eram a mesma coisa, e por isso nenhum dos dois podia
   se repetir.

   Aqui eles se separam. O assunto continua sendo uma lista curta — dose,
   check-in, pesagem, hidratação, proteína —, e cada um passa a ter
   QUANTOS ALERTAS QUISER.
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

export type TipoDeAlerta = 'dose' | 'checkin' | 'peso' | 'agua' | 'proteina';

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
  /** só a dose usa: quantos dias antes da próxima dose */
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
   — acontece antes da próxima dose, que anda. Os outros três não
   têm antecedência porque não há evento a anteceder: eles são o próprio
   evento. É a mesma estrutura com dois campos que se alternam, e não dois
   tipos de alerta. */
/* ⚠️ É FUNÇÃO, porque lê o catálogo — constante congelaria o idioma. */
export const TIPOS = (): Record<TipoDeAlerta, {
  titulo: string;
  /* O NOME QUE CABE NUMA COLUNA. Só a dose difere do título, e difere
     porque o título inteiro, numa grade de duas colunas, termina em
     reticências — e um nome cortado numa lista de escolha é a única das
     quatro opções que a pessoa não consegue ler antes de tocar. */
  curto: string;
  ic: string; desc: string; temDias: boolean; temLead: boolean;
}> => ({
  dose: {
    /* ⚠️ `temLead` E `desc` SÃO OS DO SEMANAL: quem toma todo dia recebe
       os próprios por `tiposDe(S)`, sem antecedência (parte B4, 02/10/2026).

       ⚠️ "DOSE", E ERA "APLICAÇÃO" — e antes ainda "DA CANETA" (01/10/2026).
       "Dose" é o substantivo de todas as formas (decisão do dono, ver
       docs/superpowers/specs/2026-10-01-oral-e-diario-design.md), e por
       isso o título não precisa de `S`: serve a caneta, frasco, seringa e
       comprimido igualmente.

       ⚠️ O ÍCONE É O QUE PRECISA DE `S`, e esta tabela não o tem: a seringa
       daqui é a de quem não tem forma conhecida. Quem desenha a lista de
       uma pessoa lê por `tiposDe(S)`, logo abaixo, que troca pelo
       comprimido quando é o caso. */
    titulo: T.alertas.dose, curto: T.alertas.doseCurto, ic: 'syringe',
    desc: T.alertas.doseDesc,
    temDias: false, temLead: true,
  },
  /* ⚠️ O CHECK-IN ENTROU DEPOIS, e era o único registro diário do
     aplicativo sem lembrete. Os quatro originais avisavam sobre coisas
     que a pessoa FAZ — aplicar, pesar, beber, comer —, e o check-in é a
     única em que o app pergunta em vez de cobrar: sono, fome, energia e
     humor. Justamente por isso ele é o que mais se perde, porque nada no
     dia lembra de responder. */
  checkin: {
    titulo: T.alertas.checkin, curto: T.alertas.checkinCurto, ic: 'mood',
    desc: T.alertas.checkinDesc,
    temDias: true, temLead: false,
  },
  peso: {
    titulo: T.alertas.peso, curto: T.alertas.pesoCurto, ic: 'scale',
    desc: T.alertas.pesoDesc,
    temDias: true, temLead: false,
  },
  agua: {
    titulo: T.alertas.agua, curto: T.alertas.aguaCurto, ic: 'water',
    desc: T.alertas.aguaDesc,
    temDias: true, temLead: false,
  },
  proteina: {
    titulo: T.alertas.proteina, curto: T.alertas.proteinaCurto, ic: 'flame',
    desc: T.alertas.proteinaDesc,
    temDias: true, temLead: false,
  },
});

/* ⚠️ A TABELA DE UMA PESSOA: a mesma de `TIPOS()`, com o ícone da dose
   pela forma do remédio dela — seringa ou comprimido (01/10/2026). Função
   nova, e não um parâmetro em `TIPOS`, porque as telas que leem `TIPOS()`
   continuam valendo sem mudar; quem tem `S` à mão passa a ler daqui. */
/* ⚠️ E NA DOSE DIÁRIA, SEM ANTECEDÊNCIA (02/10/2026, parte B4 de
   docs/superpowers/specs/2026-10-01-oral-e-diario-design.md). "1 dia
   antes" de uma dose que é todo dia é o dia da dose de hoje: quem
   registrava o comprimido às 7h recebia às 9h "A sua dose é amanhã", e
   com 2 ou 3 dias de antecedência o aviso nunca tocava. Para quem toma
   todo dia o aviso é o do dia, na hora escolhida — e a folha esconde a
   pergunta que não tem resposta. A descrição diz o que ele faz agora. */
export const tiposDe = (S: State): ReturnType<typeof TIPOS> => {
  const t = TIPOS();
  const diaria = doseDiaria(S) ? { temLead: false, desc: T.alertas.doseDescDiaria } : {};
  return { ...t, dose: { ...t.dose, ic: iconeDaDose(S), ...diaria } };
};

/* ⚠️ A ANTECEDÊNCIA QUE VALE: a do alerta para quem toma por semana, e
   zero para quem toma todo dia (02/10/2026, parte B4).

   É LIDA, E NÃO GRAVADA. O alerta guarda o `lead` que a pessoa escolheu —
   ou o 1 com que todo diário novo nasce (seed, `estadoVazio`) —, e quem
   toma todo dia simplesmente não o usa. Gravar zero no cadastro seria uma
   regra a mais para cada caminho que torna alguém diário (o cadastro, a
   troca de remédio em Tratamento, o intervalo de exceção) e apagaria a
   escolha de quem um dia voltar para a caneta semanal: lida aqui, a volta
   devolve a antecedência que estava lá. É por isso que o padrão do diário
   novo — 9h, no dia — sai do mesmo alerta de todo mundo, sem pergunta no
   cadastro (decisão 5 do dono). */
export const antecedenciaDe = (S: State, a: Alerta): number => (doseDiaria(S) ? 0 : a.lead ?? 0);

/* A ORDEM É A DO CICLO, e não a do alfabeto nem a da idade do recurso:
   dose e check-in são o que o aplicativo pede por si — um por semana, um
   por dia —, e peso, água e proteína são as medidas que acompanham. */
export const ORDEM: TipoDeAlerta[] = ['dose', 'checkin', 'peso', 'agua', 'proteina'];

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
   a dose era hoje. */
export const HORAS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

export const LEADS = [0, 1, 2, 3];

export const rotuloDoLead = (n: number) => (n === 0 ? T.alertas.noDia : T.alertas.diasAntes(n));

const id = () => `al-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

/* O ALERTA NOVO JÁ NASCE VÁLIDO. Sem horário nenhum ele não tocaria, e
   uma folha que abre vazia obriga a pessoa a adivinhar o que falta antes
   de poder salvar. O padrão de cada assunto é o horário em que ele faz
   mais sentido — água à tarde, proteína no almoço, peso de manhã. */
/* E A HIDRATAÇÃO JÁ NASCE EM INTERVALO, que é o jeito como ela é vivida:
   ninguém decide beber água às 15h, decide beber de tempos em tempos. Os
   outros três nascem com a hora em que fazem sentido. */
const PADRAO: Record<TipoDeAlerta, Partial<Alerta>> = {
  /* ⚠️ O `lead: 1` É DO SEMANAL. Para quem toma todo dia este mesmo
     padrão vira "todo dia às 9h, no dia" — a antecedência não é lida (ver
     `antecedenciaDe`; parte B4, 02/10/2026). */
  dose: { modo: 'horas', horas: [9], lead: 1 },
  /* ⚠️ ÀS 21H, E NÃO DE MANHÃ. O check-in pergunta como foi o DIA, e às
     nove da manhã o dia ainda não foi. É o único dos cinco cuja resposta
     depende de o dia já ter acontecido — os outros avisam antes da coisa,
     este avisa depois. */
  checkin: { modo: 'horas', horas: [21] },
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

/* A SEMANA DO CALENDÁRIO. É a ordem em que a fileira de dias aparece na
   folha, e resumo e seletor discordarem seria a pessoa marcar da esquerda
   para a direita e ler de outro jeito.

   ⚠️ ELA COMEÇAVA SEMPRE NO DOMINGO, e agora começa onde a semana de
   quem lê começa (ver `ordemDaSemana`): em alemão, a fileira da folha
   abre pela segunda, e o resumo põe a segunda antes do domingo, na mesma
   ordem. É função, e não constante: a ordem depende do idioma e do
   aparelho, e constante de módulo congelaria a do primeiro import. */
export const semana = () => ordemDaSemana();

/** D S T Q Q S S — a inicial de cada dia, para a fileira de sete. */
export const inicialDoDia = (d: number) => WD()[d].charAt(0).toUpperCase();

const diasEmTexto = (dias: number[]) => {
  const K = T.alertas;
  if (!dias.length) return K.todoDia;
  const ordem = semana().filter((d) => dias.includes(d));
  if (ordem.length === 7) return K.todoDia;
  if (ordem.length === 5 && ![0, 6].some((d) => dias.includes(d))) return K.diasUteis;
  if (ordem.length === 2 && dias.includes(0) && dias.includes(6)) return K.fimDeSemana;
  const nomes = ordem.map((d) => WD()[d]);
  return K.listaDeDias(maiuscula(nomes[0]), nomes.slice(1));
};

/** O alerta em uma linha: quando ele toca, e a que horas. */
/* ⚠️ PEDE `S` DESDE 02/10/2026 (parte B4): a dose de quem toma todo dia
   não tem antecedência, e a linha dizia "1 dia antes · 09:00" de um aviso
   que toca todo dia às nove. Para ela é "Todo dia · 09:00" — o mesmo
   "todo dia" dos outros alertas sem dia escolhido. */
export function resumoDe(a: Alerta, S: State): string {
  const quando = a.tipo === 'dose'
    ? (doseDiaria(S) ? T.alertas.todoDia : rotuloDoLead(a.lead ?? 0))
    : diasEmTexto(a.dias);
  /* O INTERVALO SE DESCREVE, e não se lista. "De 2 em 2h, 8h às 20h" é
     uma frase; as sete horas que ela gera não caberiam na linha, e caberiam
     ainda menos na cabeça de quem só quer conferir o que configurou. */
  const horas = a.modo === 'intervalo'
    ? T.alertas.aCada(a.cada, a.de, a.ate)
    : horasEmTexto(horasDe(a));
  return T.alertas.quandoEHoras(quando, horas);
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
    /* ⚠️ SEM CICLO, O AVISO DA DOSE ESPERA. Antes da primeira dose
       registrada, `nextInjectionDate` é HOJE por recuo — e o aviso tocava
       às nove "é hoje", todo dia em que o app abrisse cedo, para quem
       ainda nem começou. Ele passa a contar da primeira dose registrada,
       como o resto do app. Ver `temCiclo`, em derive. */
    if (!temCiclo(S)) return [];
    /* ⚠️⚠️ NA DOSE DIÁRIA, O AVISO É DE TODO DIA (02/10/2026, parte B4 de
       docs/superpowers/specs/2026-10-01-oral-e-diario-design.md). A conta
       de baixo dá UMA data — a da próxima dose menos a antecedência —, e
       para quem toma todo dia isso quebrava de três jeitos: com o padrão
       de 1 dia antes, quem registrava o comprimido às 7h lia às 9h "A sua
       dose é amanhã"; com 2 ou 3 dias, nunca tocava; e no primeiro dia sem
       registro a data já tinha passado, e o aviso sumia até o próximo
       registro — justo quando ele faria falta.

       Agora é como o check-in: todo dia, nas horas do alerta, quantas
       vezes o agendador pedir (a `cota` de logic/avisos, que reparte o
       orçamento do aparelho). A antecedência não entra (ver
       `antecedenciaDe`), e o único dia que sai é HOJE quando a dose de
       hoje já foi registrada — a mesma pergunta do cartão "Dose de hoje"
       da Home (`doseDeHoje`), para o aviso nunca chamar para uma dose que a
       Home já mostra feita. Registrar depois das nove não desfaz nada: o
       aviso das nove já tocou.

       ⚠️ QUEM CALA O DE HOJE É A REMARCAÇÃO, e não esta conta sozinha: o
       aviso já está agendado no aparelho. Registrar a dose muda a chave de
       `chaveDosAvisos` (logo abaixo), o _layout remarca, e a conta, rodando
       de novo, deixa hoje de fora.

       ⚠️ OS DIAS SÃO DO CALENDÁRIO, e não `addDays` (24 horas somadas): na
       noite em que o relógio volta uma hora (25/10 em Berlim), a soma cai
       às 23h do mesmo dia, e o dia da troca sairia duas vezes — dois avisos
       iguais às nove — e o último da fila, nenhuma. É o mesmo motivo de
       `nextInjectionDate` contar a dose diária pelo calendário. */
    if (doseDiaria(S)) {
      const hoje = startOfDay(agora);
      for (let k = doseDeHoje(S).feita ? 1 : 0; k < 35 && saida.length < quantas; k++) {
        for (const h of horas) {
          const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + k, h, 0, 0, 0);
          if (d > agora) saida.push(d);
        }
      }
      return saida.sort((x, y) => +x - +y).slice(0, quantas);
    }
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

/* O QUE, MUDANDO, PEDE OS AVISOS REMARCADOS — a chave que o Agendador do
   _layout observa: os alertas e a data da próxima dose. Morava escrita lá
   dentro, e subiu para cá (02/10/2026, parte B4) para a sonda da dose
   diária poder afirmar que registrar a dose de hoje a muda.

   ⚠️ NA DOSE DIÁRIA ENTRA TAMBÉM SE A DOSE DE HOJE JÁ FOI FEITA, que é a
   pergunta que tira o aviso de hoje da fila (ver `proximasDe`). Hoje a
   data da próxima dose já anda com o registro — a dose de hoje a leva para
   amanhã —, mas é coincidência da conta, e o aviso depende da outra
   pergunta: escrita na chave, a dependência não some no dia em que a
   conta da próxima dose mudar.

   ⚠️ E O QUE O AVISO DIZ (02/10/2026, achado da revisão da parte B4): o
   remédio, a dose e a forma. Quem abria à noite a caixa nova de 14 mg
   seguia recebendo "Rybelsus 7 mg" nos 34 avisos já marcados, e quem
   trocava o Rybelsus pela Saxenda seguia lendo "tomar", até o app voltar
   ao foco. A fila da caneta semanal tinha o mesmo buraco com um aviso só;
   com a dose diária ele virou cinco semanas de avisos. Mudar o texto
   remarca — as datas do semanal não mudam com isso. */
export const chaveDosAvisos = (S: State): string =>
  JSON.stringify([
    (S as any).alertas, +nextInjectionDate(S), ...(doseDiaria(S) ? [doseDeHoje(S).feita] : []),
    S.profile?.med ?? null, S.profile?.dose ?? null, formaDe(S),
  ]);

/** "hoje · 09:00", "amanhã · 08:00", "sábado · 09:00" */
export function quando(d: Date | null): string | null {
  if (!d) return null;
  const dias = Math.round((+startOfDay(d) - +startOfDay(now())) / 86400000);
  /* Os dois primeiros degraus são os mesmos de qualquer "daqui a
     quanto" do aplicativo, e por isso vêm de lá; o terceiro é próprio
     daqui — um alerta a quatro dias se diz pelo nome do dia da semana,
     que é como alguém guarda um horário, e não por "em 4 dias".

     ⚠️ E OS SETE NOMES VÊM DO FORMATO, e não de uma lista escrita aqui.
     Esta era a sétima cópia dos dias da semana no aplicativo, e a única
     que sobrou depois que as outras seis viraram `diasDaSemana`. */
  const dia = dias <= 1 ? quandoEm(dias).label : diasDaSemana()[d.getDay()];
  return `${dia} · ${hm(d.getHours(), d.getMinutes())}`;
}
