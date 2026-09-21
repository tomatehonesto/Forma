import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { State } from './seed';
import { M } from './derive';
import { FORMAS, formaDe, oA, doDa } from './formas';
import { proximasDe, type Alerta, type TipoDeAlerta } from './alertas';
import { T } from '../textos';
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
  const K = T.avisos;
  if (lead <= 0) return { title: K.doseHoje, body: K.doseHojeCorpo(dose) };
  const rec = FORMAS[formaDe(S)].recipiente;
  if (lead === 1) return { title: K.doseAmanha, body: K.doseAmanhaCorpo(dose, `${oA(formaDe(S))} ${rec}`) };
  return { title: K.doseEmDias(lead), body: K.doseEmDiasCorpo(dose, doDa(formaDe(S))) };
};

/* ⚠️ É FUNÇÃO, como toda tabela que lê o catálogo: constante de módulo
   congelaria o idioma no import. Ver src/textos/README. */
const TEXTO = (): Record<Exclude<TipoDeAlerta, 'dose'>, Texto> => ({
  /* ⚠️ ELE PERGUNTA, E NÃO MANDA — é o único dos cinco assim, e é assim
     porque o check-in é uma pergunta. "Faça o check-in" trata de tarefa
     uma coisa que é conversa; "como foi o seu dia?" é o que alguém
     perguntaria, e é o que a tela do outro lado vai perguntar de novo. */
  checkin: { title: T.avisos.checkin, body: T.avisos.checkinCorpo },
  peso: { title: T.avisos.peso, body: T.avisos.pesoCorpo },
  agua: { title: T.avisos.agua, body: T.avisos.aguaCorpo },
  proteina: { title: T.avisos.proteina, body: T.avisos.proteinaCorpo },
});

type Texto = { title: string; body: string };

async function naData(date: Date, t: Texto) {
  await Notifications.scheduleNotificationAsync({
    content: { ...t, sound: true },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date, channelId: CANAL,
    },
  });
}

/* O ORÇAMENTO DE AVISOS, repartido entre os alertas ligados.

   O iOS guarda sessenta e quatro notificações agendadas por app, e
   descarta o excedente sem avisar. Um alerta de hidratação de duas em
   duas horas das 8h às 22h são oito avisos por dia — sozinho, ele comeria
   a fila inteira em uma semana e deixaria a aplicação de fora.

   Então o teto é global e dividido: cada alerta ligado leva a sua parte,
   com um mínimo de três para que nenhum fique sem nada. Dois alertas
   cobrem quase quatro semanas cada; seis alertas cobrem uma boa semana
   cada. E o resto é remarcado quando o app abre, que é o mesmo mecanismo
   que já mantinha a data da aplicação em dia.

   Cinquenta e seis, e não sessenta e quatro: a margem é para o dia em que
   algo mais neste app precisar agendar um aviso e encontrar a fila
   cheia. */
const ORCAMENTO = 56;
const MINIMO_POR_ALERTA = 3;

/* TUDO VAI COMO DATA MARCADA.

   Houve uma versão com gatilho diário repetido para os lembretes de todo
   dia: um agendamento só, e o sistema cuidava do resto. Ele deixou de
   servir quando o alerta ganhou dias da semana — repetição semanal tem
   convenção de índice de dia diferente em cada plataforma, e errar isso
   significa a pessoa marcar segunda e o aviso chegar no domingo.

   Data marcada não tem essa ambiguidade: o app calcula a data exata da
   próxima vez, na MESMA função que a tela usa para escrever "próximo:
   sábado · 09:00". Uma conta só para o que a tela promete e para o que o
   sistema faz — dois jeitos de descobrir quando um alerta toca é como a
   tela passa a prometer um horário e o aparelho a tocar em outro.

   O preço é depender de o app abrir de vez em quando para marcar as
   seguintes, e é por isso que remarcar roda no _layout. */
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

    const ligados = (((S as any).alertas as Alerta[]) ?? []).filter((a) => a.on);
    if (!ligados.length) return;
    const cota = Math.max(MINIMO_POR_ALERTA, Math.floor(ORCAMENTO / ligados.length));

    for (const a of ligados) {
      const texto = a.tipo === 'dose' ? textoDaDose(S, a.lead ?? 0) : TEXTO()[a.tipo];
      for (const d of proximasDe(S, a, cota)) await naData(d, texto);
    }
  } catch {
    /* Aparelho sem suporte, permissão revogada no meio do caminho,
       simulador sem serviço de notificação: nada disso pode derrubar a
       tela que estava aberta. O lembrete não sai, e a tela já mostra o
       estado da permissão para a pessoa saber por quê. */
  }
}
