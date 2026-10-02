/* Os módulos nativos do Expo que a lógica toca — todos para EFEITO, e
   nenhum para texto: gravar arquivo, compartilhar, agendar aviso. O
   congelamento chama só as funções puras, então o duble existe para o
   import não derrubar o processo, e não para ser usado. */
export const File: any = class { constructor(..._a: any[]) {} write() {} };
export const Paths: any = { cache: '', document: '' };
export const shareAsync: any = async () => {};
export const printToFileAsync: any = async () => ({ uri: '', numberOfPages: 1 });
export const isAvailableAsync: any = async () => false;
/* ⚠️ O AGENDAMENTO É GUARDADO, E NÃO SÓ ENGOLIDO (02/10/2026). A sonda da
   dose diária (scripts/dose-diaria.ts, parte B4) roda o `reagendar` de
   logic/avisos de verdade e lê aqui o que ele marcaria no aparelho — o
   texto, a data e quantos, dentro da cota. Para isso o duble passou a ter
   o que `reagendar` chama e não existia (`cancelAll…`, que limpa a fila) e
   a permissão concedida como o aparelho a devolve (`granted`): sem os dois,
   `reagendar` parava no primeiro passo e a sonda não via nada. Nenhuma
   outra sonda chama o agendador. */
export const agendados: { title: string; body: string; date: Date }[] = [];
export const scheduleNotificationAsync: any = async (p: any) => {
  agendados.push({ title: p?.content?.title, body: p?.content?.body, date: new Date(p?.trigger?.date) });
  return '';
};
export const cancelAllScheduledNotificationsAsync: any = async () => { agendados.length = 0; };
export const cancelScheduledNotificationAsync: any = async () => {};
export const getAllScheduledNotificationsAsync: any = async () => [];
export const setNotificationHandler: any = () => {};
export const getPermissionsAsync: any = async () => ({ status: 'granted', granted: true });
export const requestPermissionsAsync: any = async () => ({ status: 'granted' });
export const SchedulableTriggerInputTypes: any = { DAILY: 'daily', DATE: 'date' };
export const AndroidImportance: any = { DEFAULT: 3, HIGH: 4 };
export const setNotificationChannelAsync: any = async () => {};

/* ⚠️ O expo-crypto é a exceção: ele é USADO. `ensureDefaults` carimba a
   identidade de cada item do diário (ver logic/identidade), e toda sonda
   que monta um estado passa por lá. O Node tem o mesmo gerador. */
export const randomUUID: any = () => globalThis.crypto.randomUUID();
export const getRandomValues: any = (a: any) => globalThis.crypto.getRandomValues(a);
export default {} as any;

/* O cofre seguro (expo-secure-store), para as sondas poderem importar
   logic/nuvem: sem as variáveis do projeto, `nuvem()` é nula e o cofre
   nunca é usado. */
export const getItemAsync: any = async () => null;
export const setItemAsync: any = async () => {};
export const deleteItemAsync: any = async () => {};
