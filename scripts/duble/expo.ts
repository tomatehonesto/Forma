/* Os módulos nativos do Expo que a lógica toca — todos para EFEITO, e
   nenhum para texto: gravar arquivo, compartilhar, agendar aviso. O
   congelamento chama só as funções puras, então o duble existe para o
   import não derrubar o processo, e não para ser usado. */
export const File: any = class { constructor(..._a: any[]) {} write() {} };
export const Paths: any = { cache: '', document: '' };
export const shareAsync: any = async () => {};
export const isAvailableAsync: any = async () => false;
export const scheduleNotificationAsync: any = async () => '';
export const cancelScheduledNotificationAsync: any = async () => {};
export const getAllScheduledNotificationsAsync: any = async () => [];
export const setNotificationHandler: any = () => {};
export const getPermissionsAsync: any = async () => ({ status: 'granted' });
export const requestPermissionsAsync: any = async () => ({ status: 'granted' });
export const SchedulableTriggerInputTypes: any = { DAILY: 'daily', DATE: 'date' };
export const AndroidImportance: any = { DEFAULT: 3, HIGH: 4 };
export const setNotificationChannelAsync: any = async () => {};
export default {} as any;
