import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { State } from './seed';
import { doseReminderDate, pesoReminderDate, M } from './derive';
import { nf } from './time';

/* ============================================================
   AVISOS — os lembretes saindo do aparelho

   A tela de Lembretes existia inteira antes disto: quatro chaves, hora,
   dia da semana, antecedência, e uma linha dizendo "Próximo: sábado ·
   09:00". Nada daquilo chegava a lugar nenhum. Não havia
   expo-notifications no projeto, nem uma linha que agendasse coisa
   alguma — a pessoa configurava um aviso com hora marcada, o app
   guardava, e o dia passava em silêncio. É a pior espécie de recurso
   incompleto: o que não parece incompleto.

   O QUE ESTE ARQUIVO FAZ: traduz o que está guardado em avisos de
   verdade, agendados no sistema operacional. Ele é o único lugar do app
   que fala com o expo-notifications, porque agendamento espalhado por
   telas é como nascem dois avisos do mesmo lembrete.

   CANCELA TUDO E REMARCA. Não há tentativa de descobrir o que mudou: os
   lembretes são no máximo quatro, o custo é irrelevante, e a alternativa
   — guardar identificadores, casar com o estado, apagar o que sobrou — é
   onde moram os avisos fantasmas que ninguém sabe desligar.

   LOCAL, E NÃO PUSH. Não existe servidor aqui; o aparelho agenda para si
   mesmo. Isso também é o que permite testar no Expo Go, onde push remoto
   não funciona mais no Android desde a SDK 53, mas aviso local funciona.
   ============================================================ */

const CANAL = 'lembretes';

/* No navegador não há como agendar nada. Em vez de deixar a chamada
   falhar lá dentro, a porta se fecha aqui e a tela pergunta o estado
   antes de prometer qualquer coisa. */
const daParaAvisar = Platform.OS !== 'web';

/* Com o app aberto, o aviso aparece assim mesmo. Um lembrete de água que
   só existe quando a pessoa NÃO está no app é um lembrete que some
   justamente para quem abriu o app e esqueceu de registrar. */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type Permissao = 'concedida' | 'negada' | 'nao-perguntada' | 'indisponivel';

const traduz = (p: Notifications.NotificationPermissionsStatus): Permissao =>
  p.granted ? 'concedida' : p.canAskAgain ? 'nao-perguntada' : 'negada';

export async function estadoDaPermissao(): Promise<Permissao> {
  if (!daParaAvisar) return 'indisponivel';
  try {
    return traduz(await Notifications.getPermissionsAsync());
  } catch {
    return 'indisponivel';
  }
}

/* PEDIDA NA PRIMEIRA CHAVE LIGADA, e não na abertura do app. Pedir
   permissão de aviso antes de a pessoa querer um aviso é como se perde a
   permissão para sempre: o sistema só pergunta uma vez, e um "não" dado
   sem contexto não tem volta dentro do app. */
export async function pedirPermissao(): Promise<Permissao> {
  if (!daParaAvisar) return 'indisponivel';
  try {
    const atual = await Notifications.getPermissionsAsync();
    if (atual.granted) return 'concedida';
    return traduz(await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: false, allowSound: true },
    }));
  } catch {
    return 'indisponivel';
  }
}

async function canal() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CANAL, {
    name: 'Lembretes',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 200, 120, 200],
  });
}

/* O TEXTO DO AVISO É ESCRITO PARA O MOMENTO EM QUE ELE CHEGA.

   Quem lê isto está na rua, no meio de outra coisa, e vê duas linhas na
   tela de bloqueio. Por isso nenhum deles cobra, nenhum diz "você não",
   e nenhum afirma o que o app não sabe àquela hora — se a pessoa já
   bebeu água hoje, se já comeu, se já pesou. O aviso oferece; quem sabe
   do dia é ela. */
const textoDaDose = (S: State, lead: number) => {
  const med = M(S);
  const dose = `${med.label} ${nf(S.profile.dose, S.profile.dose % 1 ? 1 : 0)} ${med.unit}`;
  if (lead <= 0) return { title: 'A sua aplicação é hoje', body: `${dose}. Quando der, registre por aqui.` };
  if (lead === 1) return { title: 'A sua aplicação é amanhã', body: `${dose}. Vale deixar a caneta à vista.` };
  return { title: `A sua aplicação é em ${lead} dias`, body: `${dose}. Dá tempo de conferir o estoque da caneta.` };
};

const TEXTO = {
  peso: { title: 'Dia de pesagem', body: 'Suba na balança quando der. Um número por semana já desenha a curva.' },
  agua: { title: 'Um copo de água', body: 'Ajuda com a saciedade e com o enjoo — e conta para a meta do dia.' },
  proteina: { title: 'Proteína primeiro', body: 'Na próxima refeição, comece por ela. É o que segura a massa magra.' },
};

type Texto = { title: string; body: string };

async function noDia(hour: number, min: number, t: Texto) {
  await Notifications.scheduleNotificationAsync({
    content: { ...t, sound: true },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour, minute: min, channelId: CANAL,
    },
  });
}

async function naData(date: Date, t: Texto) {
  await Notifications.scheduleNotificationAsync({
    content: { ...t, sound: true },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date, channelId: CANAL,
    },
  });
}

/* O QUE REPETE E O QUE É MARCADO UMA VEZ.

   Água, proteína e pesagem diária são sempre no mesmo horário: repetem
   sozinhos, todo dia, sem o app precisar abrir.

   A aplicação e a pesagem semanal dependem de uma data que anda — a
   próxima dose muda quando uma é registrada, e o dia da semana escolhido
   cai numa data diferente a cada semana. Esses vão como data marcada, e
   a próxima é remarcada toda vez que o app abre ou que algo muda. É por
   isso que remarcar roda no _layout, e não aqui. */
export async function reagendar(S: State): Promise<void> {
  if (!daParaAvisar) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const perm = await Notifications.getPermissionsAsync();
    /* Sem permissão não se agenda nada — e o cancelamento acima já
       tinha limpado o que ficou de quando havia. Uma pessoa que revoga a
       permissão no sistema não pode voltar semanas depois e receber a
       fila inteira de uma vez. */
    if (!perm.granted) return;
    await canal();

    const R: any = S.reminders ?? {};
    const agora = new Date();

    const dose = doseReminderDate(S);
    if (dose && dose > agora) await naData(dose, textoDaDose(S, R.dose?.lead ?? 0));

    if (R.peso?.on) {
      if (R.peso.freq === 'diaria') await noDia(R.peso.hour ?? 8, R.peso.min ?? 0, TEXTO.peso);
      else { const p = pesoReminderDate(S); if (p && p > agora) await naData(p, TEXTO.peso); }
    }

    if (R.agua?.on) await noDia(R.agua.hour ?? 15, R.agua.min ?? 0, TEXTO.agua);
    if (R.proteina?.on) await noDia(R.proteina.hour ?? 12, R.proteina.min ?? 0, TEXTO.proteina);
  } catch {
    /* Aparelho sem suporte, permissão revogada no meio do caminho,
       simulador sem serviço de notificação: nada disso pode derrubar a
       tela que estava aberta. O lembrete não sai, e a tela já mostra o
       estado da permissão para a pessoa saber por quê. */
  }
}
