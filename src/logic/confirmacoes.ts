import type { State } from './seed';
import {
  checkinToday, curWeight, examBy, examLast, examStatus,
  journeyDay, notasAbertas, waterMlToday, litros,
} from './derive';
import { nf, now, dataLonga } from './time';

/* ============================================================
   O QUE ACONTECEU DEPOIS DE SALVAR

   ⚠️ QUASE TODO REGISTRO DESTE APP TERMINAVA EM NADA. A folha fechava, a
   tela de trás voltava igual, e a pessoa ficava sem saber se o número
   entrou. Duas capturas fugiam disso — o check-in e a aplicação, que têm
   tela de fim — e as outras oito davam `router.back()` e sumiam.

   O problema não é a falta de festa. É que salvar é a única ação do app
   em que a pessoa entrega um dado e não recebe nada em troca: nem a
   confirmação de que entrou, nem a única coisa que ela quer saber logo
   depois — quanto mudou desde a última vez, quanto falta para a meta, se
   o exame que chegou está na faixa.

   ESTE ARQUIVO É ESSA RESPOSTA, e é um só para todas as capturas. Ele
   monta o que a folha de confirmação mostra, e a folha só desenha. Sem
   isso seriam oito telas parecidas, cada uma com a sua conta — e é assim
   que duas delas começam a discordar.

   NADA AQUI COMEMORA POR COMEMORAR. A marca de check diz "entrou"; o
   lima só aparece quando uma meta do dia fechou de verdade, e a linha do
   cartão só existe quando há uma comparação para fazer. Quem registra o
   primeiro peso não tem "desde a última", e inventar um zero ali seria
   dizer que ela não mudou.
   ============================================================ */

export type TipoDeRegistro =
  | 'peso' | 'medidas' | 'exame' | 'anotacao'
  | 'refeicao' | 'exercicio' | 'agua';

export type LinhaConfirmada = {
  titulo: string; sub?: string;
  selo?: string; seloTom?: 'lima' | 'verde' | 'neutra';
};

export type Confirmado = {
  titulo: string;
  texto: string;
  linhas: LinhaConfirmada[];
  /** o disco vira lima — só quando o registro fechou uma meta do dia */
  lima?: boolean;
  /** a pastilha com a notícia, quando o título não a dá sozinho */
  festa?: string;
  /** o caminho que vale a pena oferecer em seguida, quando existe um */
  caminho?: { label: string; to: string };
};

const n0 = (v: number) => String(Math.round(v));
/* O SINAL É PARTE DO NÚMERO, e o menos é o travessão do app, não o
   hífen do teclado. Quem perdeu peso lê "−0,4 kg"; quem ganhou lê
   "+0,3 kg", sem eufemismo e sem alarme.

   ⚠️ E ZERO NÃO É "−0,0". Quem pesou igual ao da última vez via um sinal
   de menos na frente de um zero — um número que não existe, e que ainda
   por cima sugere uma perda que não houve. */
const delta = (v: number, un: string, casas = 1) => {
  const piso = casas ? 0.05 : 0.5;
  if (Math.abs(v) < piso) return 'sem mudança';
  return `${v > 0 ? '+' : '−'}${casas ? nf(Math.abs(v), 1) : n0(Math.abs(v))} ${un}`;
};
const tomDoDelta = (v: number, casas = 1) =>
  (Math.abs(v) < (casas ? 0.05 : 0.5) ? 'neutra' : 'lima') as 'neutra' | 'lima';

/* ⚠️ "DESDE A ÚLTIMA VEZ" É OUTRO DIA, e não o registro anterior.

   Quem se pesa de novo à tarde tinha o registro da manhã como termo de
   comparação: a folha dizia "desde a última pesagem · 18 de setembro ·
   −0,0 kg" — a data de hoje, e uma variação que é ruído de balança. A
   pergunta que a pessoa faz é sobre a sessão anterior, não sobre a
   mesma manhã. Sem nenhum registro de outro dia, a linha não existe. */
const deOutroDia = <T extends { t: number }>(lista: T[], t: number): T | null => {
  const d = new Date(t); d.setHours(0, 0, 0, 0);
  const hoje = +d;
  for (let i = lista.length - 1; i >= 0; i--) {
    const x = new Date(lista[i].t); x.setHours(0, 0, 0, 0);
    if (+x < hoje) return lista[i];
  }
  return null;
};

/* Quanto falta para a meta do dia, na unidade de quem lê. Devolve nulo
   quando já chegou — aí quem fala é a festa, e não a cobrança. */
const falta = (agora: number, alvo: number, escreve: (v: number) => string) =>
  agora >= alvo ? null : escreve(alvo - agora);

export function confirmacaoDe(S: State, tipo: TipoDeRegistro, ref?: string): Confirmado {
  const p: any = S.profile;
  const alvos = p.targets;
  const ci: any = checkinToday(S);

  switch (tipo) {
    case 'peso': {
      const pesos = (S.weights as any[]).slice().sort((a, b) => a.t - b.t);
      const atual = curWeight(S);
      const anterior = deOutroDia(pesos, pesos[pesos.length - 1]?.t ?? +now());
      const paraMeta = atual - p.goalWeight;
      return {
        titulo: 'Peso registrado',
        texto: `${nf(atual, 1)} kg · ${dataLonga(+now())}`,
        linhas: [
          ...(anterior ? [{
            titulo: 'Desde a última pesagem',
            sub: dataLonga(anterior.t),
            selo: delta(atual - anterior.kg, 'kg'),
            /* Lima é a variação que a pessoa mediu, e não um juízo sobre
               ela: o mesmo selo vale para quem subiu e para quem desceu.
               Pintar um de neutro e outro de lima seria o app dizendo
               qual dos dois dias foi bom. */
            seloTom: tomDoDelta(atual - anterior.kg),
          }] : []),
          {
            titulo: 'Meta de peso',
            sub: `${nf(p.goalWeight, 1)} kg`,
            selo: paraMeta > 0 ? `faltam ${nf(paraMeta, 1)} kg` : 'alcançada',
            seloTom: paraMeta > 0 ? ('neutra' as const) : ('verde' as const),
          },
        ],
        /* ⚠️ ERA `?id=peso`, E A TELA LÊ `m`. Funcionava por acidente: sem
           `m` o catálogo cai no peso, que é o padrão. Copiada para a
           cintura, a linha abriria o peso calada. */
        caminho: { label: 'Ver a curva do peso', to: '/marcador?m=peso' },
      };
    }

    case 'medidas': {
      const medidas = (S.measures as any[]).slice().sort((a, b) => a.t - b.t);
      const u = medidas[medidas.length - 1];
      const ant = deOutroDia(medidas, medidas[medidas.length - 1]?.t ?? +now());
      const nomes: [string, string][] = [['cintura', 'Cintura'], ['quadril', 'Quadril'], ['braco', 'Braço'], ['coxa', 'Coxa']];
      return {
        titulo: 'Medidas registradas',
        texto: `Cintura ${nf(u?.cintura ?? 0, 1)} cm · ${dataLonga(+now())}`,
        /* Só o que MUDOU desde a última fita. Quatro linhas com quatro
           deltas, três deles zero, transformam a confirmação num
           formulário de leitura — e o que a pessoa quer ver é onde o
           corpo se mexeu. */
        linhas: ant
          ? nomes
            .filter(([k]) => Math.abs((u?.[k] ?? 0) - ant[k]) >= 0.1)
            .map(([k, nome]) => ({
              titulo: nome,
              sub: `${nf(ant[k], 1)} › ${nf(u[k], 1)} cm`,
              selo: delta((u[k] ?? 0) - ant[k], 'cm'),
              seloTom: tomDoDelta((u[k] ?? 0) - ant[k]),
            }))
          : nomes.map(([k, nome]) => ({ titulo: nome, selo: `${nf(u?.[k] ?? 0, 1)} cm`, seloTom: 'neutra' as const })),
        caminho: { label: 'Ver as medidas', to: '/medidas' },
      };
    }

    case 'exame': {
      const e = ref ? examBy(S, ref) : null;
      if (!e) return { titulo: 'Resultado registrado', texto: dataLonga(+now()), linhas: [] };
      const u = examLast(e);
      const varios = e.values.length > 1;
      const ant = varios ? deOutroDia(e.values, u.t) : null;
      const st = examStatus(e);
      const rotulo = st === 'ok' ? 'na referência' : st === 'alto' ? 'acima' : 'abaixo';
      return {
        titulo: 'Resultado registrado',
        texto: `${e.marker} · ${nf(u.v, u.v % 1 ? 1 : 0)}${e.unit ? ` ${e.unit}` : ''}`,
        linhas: [
          /* O VEREDITO PRIMEIRO, porque é a pergunta de quem acabou de
             digitar um número de exame — e a faixa vem junto, porque é
             ela que sustenta o veredito. Sem referência cadastrada não há
             veredito nenhum, e a linha não aparece. */
          ...(e.ref ? [{
            titulo: 'Faixa de referência',
            sub: `${e.ref}${e.unit ? ` ${e.unit}` : ''}`,
            selo: rotulo,
            seloTom: (st === 'ok' ? 'verde' : 'neutra') as 'verde' | 'neutra',
          }] : []),
          ...(ant ? [{
            titulo: 'Desde a coleta anterior',
            sub: dataLonga(ant.t),
            selo: delta(u.v - ant.v, e.unit || '', (u.v - ant.v) % 1 ? 1 : 0),
            seloTom: tomDoDelta(u.v - ant.v, (u.v - ant.v) % 1 ? 1 : 0),
          }] : []),
          ...(varios ? [] : [{
            titulo: 'Primeira coleta deste marcador',
            sub: 'a próxima já vira comparação',
          }]),
        ],
        caminho: { label: 'Ver no painel de exames', to: '/exames' },
      };
    }

    case 'anotacao': {
      const abertas = notasAbertas(S);
      return {
        titulo: 'Anotação guardada',
        texto: abertas[0]?.text ?? dataLonga(+now()),
        linhas: [
          {
            titulo: 'Na pauta da consulta',
            sub: p.doctor ? `vai no resumo para ${p.doctor}` : 'vai no resumo para consulta',
            selo: `${abertas.length}`,
            seloTom: 'neutra',
          },
        ],
        caminho: { label: 'Ver o resumo para consulta', to: '/resumo-medico' },
      };
    }

    case 'refeicao': {
      const agora = Math.round(ci?.prot || 0);
      const alvo = alvos.prot as number;
      const f = falta(agora, alvo, (v) => `faltam ${n0(v)} g`);
      return {
        titulo: 'Refeição registrada',
        texto: `${agora} de ${alvo} g de proteína hoje`,
        lima: !f,
        festa: f ? undefined : 'Meta de proteína do dia fechada',
        linhas: [
          { titulo: 'Proteína do dia', sub: `meta de ${alvo} g`, selo: f ?? 'meta batida', seloTom: f ? 'neutra' : 'lima' },
        ],
        caminho: { label: 'Ver a alimentação do dia', to: '/alimentacao' },
      };
    }

    case 'exercicio': {
      const agora = Math.round(ci?.exerc || 0);
      const alvo = alvos.exercMin as number;
      const f = falta(agora, alvo, (v) => `faltam ${n0(v)} min`);
      const treinos = (ci?.treinos as any[]) || [];
      const ultimo = treinos[treinos.length - 1];
      return {
        titulo: 'Treino registrado',
        texto: ultimo ? `${ultimo.tipo} · ${n0(ultimo.min)} min` : `${agora} min hoje`,
        lima: !f,
        festa: f ? undefined : 'Meta de movimento do dia fechada',
        linhas: [
          { titulo: 'Movimento do dia', sub: `${agora} de ${alvo} min`, selo: f ?? 'meta batida', seloTom: f ? 'neutra' : 'lima' },
          ...(treinos.length > 1 ? [{ titulo: 'Treinos hoje', selo: `${treinos.length}`, seloTom: 'neutra' as const }] : []),
        ],
        caminho: { label: 'Ver a semana de exercício', to: '/exercicio' },
      };
    }

    case 'agua': {
      const ml = waterMlToday(S);
      const alvo = alvos.waterMl as number;
      const f = falta(ml, alvo, (v) => `faltam ${litros(v)} L`);
      /* O TÍTULO MUDA QUANDO A META FECHA, e é só aí que ele vira
         notícia. "Hidratação do dia fechada" todo copo seria a mesma
         mentira de sempre: dizer que acabou quando ainda falta. */
      return {
        titulo: f ? 'Água registrada' : 'Hidratação do dia fechada',
        texto: `${litros(ml)} de ${litros(alvo)} L hoje`,
        lima: !f,
        linhas: [
          { titulo: 'Hidratação do dia', sub: `meta de ${litros(alvo)} L`, selo: f ?? 'meta batida', seloTom: f ? 'neutra' : 'lima' },
        ],
        caminho: { label: 'Ver a hidratação', to: '/agua' },
      };
    }
  }
}
