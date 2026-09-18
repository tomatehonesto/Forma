import type { State } from './seed';
import { MEDS } from './meds';
import { DAY, startOfDay, now, diffDays } from './time';

/* ESTE ARQUIVO NÃO IMPORTA O DERIVE, e o derive importa este. O caminho
   tem uma direção só de propósito: o derive já chama as conquistas — a
   linha do tempo e o aviso de conquista recente leem daqui —, e um
   import de volta fecharia um ciclo entre os dois maiores módulos de
   lógica do app. Ciclo em Metro não estoura, ele entrega `undefined` na
   ordem errada, o que é pior: quebra em um lugar e não no outro, e só às
   vezes.

   O preço são três linhas que o derive também tem. É o preço certo: as
   três são leitura direta do perfil, não regra — e regra duplicada é
   outra conversa. */
const cupMl = 250;
const metaDeCopos = (S: State) => ((S.profile as any).targets?.waterMl ?? 0) / cupMl;
const startWeight = (S: State) => S.profile.startWeight;
const M = (S: State) => MEDS[S.profile.med];

/* ============================================================
   CONQUISTAS — calculadas, e não concedidas

   ⚠️ ELAS ERAM UMA LISTA FIXA NO ESTADO, com `done: true` escrito à mão.
   Cinco vinham marcadas como feitas desde o primeiro segundo do
   aplicativo, com data e tudo, e três vinham por fazer. Ninguém conferia
   nada: quem instalasse hoje abriria a tela com "Primeiros 5% — há 30
   dias" antes de ter se pesado uma vez.

   E a própria tela dizia, em letras garrafais, "marcos que saem sozinhos
   do que você registrou — ninguém aqui decide se você merece". Era a
   frase mais falsa do app: quem decidia era o arquivo de exemplo.

   Aqui cada uma é uma conta sobre os registros. A regra é a mesma do
   resto: uma fonte por fato. Se a pessoa apagar a pesagem que cruzou os
   cinco por cento, a conquista volta a não estar feita — porque ela
   deixou de estar.

   E CADA UMA SABE QUANDO ACONTECEU, que é outra coisa que a lista fixa
   não tinha como saber: a data vem do registro que fechou a conta, e não
   de um carimbo escolhido por alguém.

   AS QUE FALTAM MOSTRAM O QUANTO FALTA. "Em progresso" era o que a tela
   dizia das três não feitas, o que serve para qualquer uma delas em
   qualquer dia. Faltar dois quilos e faltar nove não são o mesmo estado,
   e a diferença é justamente o que faz alguém continuar.
   ============================================================ */

export type Conquista = {
  id: string;
  ic: string;
  titulo: string;
  desc: string;
  /** o instante do registro que fechou a conta; null enquanto não fechou */
  t: number | null;
  /** 0..1, o quanto já andou — só para as que ainda não vieram */
  pct: number;
  /** o que falta, em palavras curtas */
  falta: string;
};

const dias = (S: State) => (S.checkins as any[]).map((c) => +startOfDay(new Date(c.t)));

/* A MAIOR SEQUÊNCIA DE DIAS SEGUIDOS em que uma condição valeu. Serve às
   duas conquistas de constância — check-in e proteína —, e separa o que
   elas têm de diferente (a condição) do que têm de igual (contar dias
   colados). */
function maiorSequencia(S: State, vale: (c: any) => boolean): { n: number; fim: number | null } {
  const bons = (S.checkins as any[])
    .filter(vale)
    .map((c) => +startOfDay(new Date(c.t)))
    .sort((a, b) => a - b);
  let melhor = 0; let fim: number | null = null;
  let n = 0; let anterior: number | null = null;
  for (const d of bons) {
    n = anterior != null && d - anterior === DAY ? n + 1 : 1;
    if (n > melhor) { melhor = n; fim = d; }
    anterior = d;
  }
  return { n: melhor, fim };
}

/* QUANTOS DIAS DE UMA MESMA SEMANA bateram a condição. A semana aqui é a
   janela de sete dias que mais rendeu, e não a do calendário: quem bebe
   água de quinta a segunda cumpriu cinco dias seguidos, e dizer que não
   porque a semana virou no domingo seria o app discutindo calendário com
   alguém. */
function melhorJanela(S: State, vale: (c: any) => boolean): { n: number; fim: number | null } {
  const bons = new Set((S.checkins as any[]).filter(vale).map((c) => +startOfDay(new Date(c.t))));
  const todos = [...new Set(dias(S))].sort((a, b) => a - b);
  let melhor = 0; let fim: number | null = null;
  for (const d0 of todos) {
    let n = 0; let ultimo: number | null = null;
    for (let k = 0; k < 7; k++) {
      const d = d0 + k * DAY;
      if (bons.has(d)) { n++; ultimo = d; }
    }
    if (n > melhor) { melhor = n; fim = ultimo; }
  }
  return { n: melhor, fim };
}

const respondeu = (c: any, campo: string) => c?.[campo] != null && !Number.isNaN(c[campo]);

export function conquistas(S: State): Conquista[] {
  const p: any = S.profile;
  const inicial = startWeight(S);
  const pesos = (S.weights as any[]).slice().sort((a, b) => a.t - b.t);
  const med = M(S);

  /* A PRIMEIRA APLICAÇÃO. A data é a da aplicação, e não a do cadastro:
     quem se cadastrou em março e aplicou em maio começou em maio. */
  const inj1 = (S.injections as any[])[0] ?? null;

  /* OS CINCO POR CENTO são a marca clínica que a literatura usa, e a
     conta é sobre a primeira pesagem que cruzou a linha — se ela existir.
     A mesma conta que a linha do tempo faz; ver milestones em derive. */
  const alvo5 = inicial * 0.95;
  const w5 = pesos.find((w) => w.kg <= alvo5) ?? null;
  const atual = pesos.length ? pesos[pesos.length - 1].kg : inicial;
  const perdido = inicial - atual;

  const alvo10 = inicial - 10;
  const w10 = pesos.find((w) => w.kg <= alvo10) ?? null;

  /* SETE CHECK-INS SEGUIDOS. A sequência é de dias colados, e por isso a
     data é a do sétimo — o dia em que a semana fechou. */
  const seteDias = maiorSequencia(S, (c) => respondeu(c, 'mood'));

  /* HIDRATAÇÃO: cinco dias da mesma semana batendo a meta de água. A meta
     é a do perfil, e não um número redondo — quem tem 2 L de meta não
     precisa beber 2,5 para a conquista contar. */
  const meta = metaDeCopos(S);
  const agua5 = melhorJanela(S, (c) => (c?.agua ?? 0) >= meta);

  /* DEZ SEMANAS de tratamento — setenta dias a partir da primeira dose.
     Sem dose aplicada não há tratamento a contar, e a conquista fica em
     zero em vez de contar do cadastro. */
  const d0 = inj1 ? +startOfDay(new Date(inj1.t)) : null;
  const diasDeTratamento = d0 ? diffDays(now(), new Date(d0)) : 0;

  /* A DOSE DE MANUTENÇÃO é a última da escada do medicamento — é o
     catálogo que diz qual, e não uma constante escrita aqui. Quem ainda
     não escolheu a caneta não tem escada, e a conquista some da lista
     mais abaixo. */
  const escada = med.doses ?? [];
  const manutencao = escada.length ? escada[escada.length - 1] : null;
  const injManutencao = manutencao != null
    ? (S.injections as any[]).find((i) => i.dose >= manutencao) ?? null
    : null;

  /* PROTEÍNA: catorze dias seguidos batendo a meta do perfil. */
  const metaProt = p.targets?.prot ?? 0;
  const prot14 = maiorSequencia(S, (c) => (c?.prot ?? 0) >= metaProt);

  const lista: (Conquista | null)[] = [
    {
      id: 'primeira', ic: 'leaf', titulo: 'Primeiro passo', desc: 'Primeira aplicação registrada',
      t: inj1 ? inj1.t : null, pct: inj1 ? 1 : 0, falta: 'Ao registrar a primeira aplicação',
    },
    {
      id: 'cinco', ic: 'trend', titulo: 'Primeiros 5%', desc: '5% do peso inicial perdidos',
      t: w5 ? w5.t : null,
      pct: Math.max(0, Math.min(1, perdido / (inicial * 0.05))),
      falta: `Faltam ${Math.max(0, inicial * 0.05 - perdido).toFixed(1).replace('.', ',')} kg`,
    },
    {
      id: 'semana', ic: 'check', titulo: 'Semana completa', desc: '7 check-ins seguidos',
      t: seteDias.n >= 7 ? seteDias.fim : null,
      pct: Math.min(1, seteDias.n / 7),
      falta: `Maior sequência: ${seteDias.n} de 7 dias`,
    },
    {
      id: 'agua', ic: 'water', titulo: 'Hidratação em dia', desc: '5 dias na meta de água, na mesma semana',
      t: agua5.n >= 5 ? agua5.fim : null,
      pct: Math.min(1, agua5.n / 5),
      falta: `Melhor semana: ${agua5.n} de 5 dias`,
    },
    {
      id: 'dezsemanas', ic: 'cal', titulo: 'Dez semanas', desc: 'Dez semanas desde a primeira dose',
      t: d0 && diasDeTratamento >= 70 ? d0 + 70 * DAY : null,
      pct: Math.min(1, diasDeTratamento / 70),
      falta: d0 ? `Faltam ${70 - diasDeTratamento} dias` : 'Começa na primeira aplicação',
    },
    manutencao == null ? null : {
      id: 'manutencao', ic: 'dose', titulo: 'Dose de manutenção',
      desc: `Chegar a ${manutencao} ${med.unit}`,
      t: injManutencao ? injManutencao.t : null,
      pct: Math.min(1, (p.dose || 0) / manutencao),
      falta: `Você está em ${p.dose || 0} de ${manutencao} ${med.unit}`,
    },
    {
      id: 'dezkg', ic: 'scale', titulo: '−10 kg', desc: 'Marca de 10 kg a menos',
      t: w10 ? w10.t : null,
      pct: Math.max(0, Math.min(1, perdido / 10)),
      falta: `Faltam ${Math.max(0, 10 - perdido).toFixed(1).replace('.', ',')} kg`,
    },
    metaProt <= 0 ? null : {
      id: 'proteina', ic: 'flame', titulo: 'Proteína em foco',
      desc: `${metaProt} g por dia, por 2 semanas`,
      t: prot14.n >= 14 ? prot14.fim : null,
      pct: Math.min(1, prot14.n / 14),
      falta: `Maior sequência: ${prot14.n} de 14 dias`,
    },
  ];

  return lista.filter((x): x is Conquista => x != null);
}

export const feitas = (l: Conquista[]) => l.filter((x) => x.t != null);
export const aCaminho = (l: Conquista[]) => l.filter((x) => x.t == null);
