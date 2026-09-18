import { Platform } from 'react-native';
import { startOfDay } from './time';

/* ============================================================
   A SAÚDE DO APARELHO — o peso que chega sem ninguém digitar

   Apple Saúde no iPhone, Health Connect no Android. São dois depósitos
   locais de dados de saúde: a balança de wi-fi, o relógio, o anel e os
   outros aplicativos escrevem lá, e quem tem permissão lê. Não há conta,
   não há senha e não há servidor no meio — é por isso que esta é a única
   integração que o app consegue ter hoje, e é por isso que ela cobre
   Garmin, Fitbit, Withings, Oura e Whoop de uma vez só: todos eles
   escrevem no depósito do aparelho.

   ESTE ARQUIVO É A ÚNICA PORTA. As duas bibliotecas têm nomes, unidades e
   formatos diferentes, e deixar isso vazar para as telas seria pedir que
   cada uma soubesse em que sistema está rodando. Aqui elas viram a mesma
   coisa: uma lista de pesagens com data e quilo.

   POR ENQUANTO SÓ O PESO, e isso é decisão e não preguiça. O peso tem
   lugar próprio no estado — uma lista de medições, cada uma com data —, e
   importar é acrescentar ao que já existe. Sono e minutos de exercício
   moram DENTRO do check-in do dia, que é a resposta que a pessoa deu:
   escrever por cima seria o aparelho corrigindo alguém sobre o próprio
   dia, e escrever ao lado seria duas verdades para o mesmo campo. Essa
   regra de precedência é uma decisão de produto, e ela vem depois.

   NADA DISTO RODA NO EXPO GO. São módulos nativos: precisam de um dev
   client. Por isso todo acesso passa por um require preguiçoso dentro de
   try — sem ele, abrir o app no Expo Go quebraria na importação, e a
   tela de integrações é justamente a que precisa continuar de pé para
   dizer que ali não dá.
   ============================================================ */

export type Pesagem = { t: number; kg: number };

export type EstadoDaSaude =
  /** o aparelho tem o depósito e o app pode falar com ele */
  | 'pronto'
  /** iOS ou Android sem o app de saúde instalado ou atualizado */
  | 'sem-app'
  /** navegador, ou build sem o módulo nativo (Expo Go) */
  | 'indisponivel';

const ios = Platform.OS === 'ios';
const android = Platform.OS === 'android';

/* O require preguiçoso. Estático, o bundler resolveria o pacote e o
   módulo nativo faltando derrubaria a tela na hora de montar; assim, a
   falta vira um null que o resto do arquivo sabe tratar. */
const hk = () => {
  if (!ios) return null;
  try { return require('@kingstinct/react-native-healthkit'); } catch { return null; }
};
const hc = () => {
  if (!android) return null;
  try { return require('react-native-health-connect'); } catch { return null; }
};

/* O QUE PEDIMOS, e só isso.

   Permissão de saúde é pedida uma vez e some da cara da pessoa: o que não
   entrar nesta lista hoje exige mandá-la às configurações do sistema
   amanhã. Mesmo assim a lista tem um item — pedir sono e treino "já que
   estamos aqui" seria coletar o que nenhuma tela lê, e a lista de
   permissões que o sistema mostra é lida por gente que repara. */
const TIPO_IOS = 'HKQuantityTypeIdentifierBodyMass' as const;
const TIPO_ANDROID = 'Weight' as const;

export async function estadoDaSaude(): Promise<EstadoDaSaude> {
  if (ios) {
    const m = hk();
    if (!m) return 'indisponivel';
    try { return (await m.isHealthDataAvailable()) ? 'pronto' : 'sem-app'; } catch { return 'indisponivel'; }
  }
  if (android) {
    const m = hc();
    if (!m) return 'indisponivel';
    try {
      /* 3 é SDK_AVAILABLE. 1 e 2 são "não tem" e "precisa atualizar" — os
         dois levam a pessoa para a loja, e não para uma permissão. */
      return (await m.getSdkStatus()) === 3 ? 'pronto' : 'sem-app';
    } catch { return 'indisponivel'; }
  }
  return 'indisponivel';
}

/** Abre a permissão do sistema. Devolve se ficou com acesso de leitura. */
export async function pedirAcesso(): Promise<boolean> {
  if (ios) {
    const m = hk();
    if (!m) return false;
    try {
      await m.requestAuthorization({ toRead: [TIPO_IOS] });
      /* O iOS NÃO DIZ SE A PESSOA DEIXOU LER. É de propósito: revelar que
         a permissão foi negada já contaria algo sobre a saúde de alguém.
         Então a resposta aqui é "a caixa abriu e não deu erro" — e quem
         descobre se veio dado é a leitura, que volta vazia. */
      return true;
    } catch { return false; }
  }
  if (android) {
    const m = hc();
    if (!m) return false;
    try {
      await m.initialize();
      const dadas = await m.requestPermission([{ accessType: 'read', recordType: TIPO_ANDROID }]);
      return (dadas ?? []).some((p: any) => p.recordType === TIPO_ANDROID);
    } catch { return false; }
  }
  return false;
}

/** As pesagens do depósito do aparelho, dos últimos `dias`. */
export async function pesagensDoAparelho(dias = 180): Promise<Pesagem[]> {
  const ate = new Date();
  const de = new Date(+ate - dias * 86400000);

  if (ios) {
    const m = hk();
    if (!m) return [];
    try {
      const amostras = await m.queryQuantitySamples(TIPO_IOS, {
        limit: 0,
        unit: 'kg',
        filter: { date: { from: de, to: ate } },
      });
      return (amostras ?? []).map((a: any) => ({ t: +new Date(a.endDate ?? a.startDate), kg: a.quantity }));
    } catch { return []; }
  }

  if (android) {
    const m = hc();
    if (!m) return [];
    try {
      await m.initialize();
      const r = await m.readRecords(TIPO_ANDROID, {
        timeRangeFilter: { operator: 'between', startTime: de.toISOString(), endTime: ate.toISOString() },
      });
      return (r?.records ?? []).map((x: any) => ({ t: +new Date(x.time), kg: x.weight?.inKilograms }));
    } catch { return []; }
  }

  return [];
}

/* ============================================================
   A JUNÇÃO

   O QUE A PESSOA REGISTROU GANHA DO QUE O APARELHO MANDOU, sempre. Ela
   subiu na balança e digitou; o depósito pode ter a mesma pesagem vinda
   da balança de wi-fi, com segundos de diferença e um decimal a mais. Dois
   pontos no mesmo dia viram dois pontos na curva, e a curva passa a ter
   degraus que não aconteceram.

   Por isso a chave é o DIA, e não o instante: um peso por dia é o que a
   tela de evolução desenha, e é assim que alguém se pesa. Dia que já tem
   peso digitado fica como está.

   E SÓ ENTRA O QUE É NÚMERO DE VERDADE. Peso fora de 20 e 400 quilos não
   é uma pessoa: é uma unidade lida errada, ou um aparelho de terceiro
   escrevendo lixo no depósito. Um ponto desses estraga a escala do
   gráfico inteiro e a média de tudo.
   ============================================================ */

const plausivel = (kg: unknown): kg is number =>
  typeof kg === 'number' && Number.isFinite(kg) && kg >= 20 && kg <= 400;

export function juntarPesagens(atuais: Pesagem[], doAparelho: Pesagem[]): { lista: Pesagem[]; novas: number } {
  const diasComPeso = new Set(atuais.map((w) => +startOfDay(new Date(w.t))));
  const entrando = new Map<number, Pesagem>();

  for (const p of doAparelho) {
    if (!plausivel(p.kg) || !Number.isFinite(p.t)) continue;
    const dia = +startOfDay(new Date(p.t));
    if (diasComPeso.has(dia)) continue;
    /* Dois registros do aparelho no mesmo dia: fica o mais tarde, que é
       o que a pessoa veria se abrisse o app de saúde agora. */
    const jaTem = entrando.get(dia);
    if (!jaTem || p.t > jaTem.t) entrando.set(dia, { t: p.t, kg: Math.round(p.kg * 10) / 10 });
  }

  const novas = [...entrando.values()];
  return {
    lista: [...atuais, ...novas].sort((a, b) => a.t - b.t),
    novas: novas.length,
  };
}
