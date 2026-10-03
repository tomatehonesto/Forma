import { Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants, { ExecutionEnvironment } from 'expo-constants';
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
   client.

   E A PORTA SE FECHA ANTES DO REQUIRE, e não depois. A primeira versão
   confiava num try em volta do require, e não bastou: o HealthKit usa
   Nitro, e o Nitro estoura ao ser AVALIADO — "Failed to get NitroModules"
   —, num ponto em que o try local já não está no caminho. A tela de
   integrações abria e quebrava, que é exatamente o contrário do que ela
   precisa fazer quando não dá.

   Então a pergunta passou a ser outra: este build pode ter módulo nativo?
   O Expo Go não pode, e ele se identifica. Perguntar isso é mais honesto
   do que tentar e cair — e é a diferença entre uma tela que explica e uma
   tela vermelha.
   ============================================================ */

export type Pesagem = { t: number; kg: number };

export type EstadoDaSaude =
  /** o aparelho tem o depósito e o app pode falar com ele */
  | 'pronto'
  /** Android sem o Health Connect instalado, ou com ele desatualizado —
      a Google Play resolve */
  | 'sem-app'
  /** o aparelho não pode ter o depósito: Android anterior ao 9, iPad
      anterior ao iPadOS 17, Mac. Não há o que instalar */
  | 'sem-suporte'
  /** navegador, ou build sem o módulo nativo (Expo Go) */
  | 'indisponivel';

const ios = Platform.OS === 'ios';
const android = Platform.OS === 'android';

/* O Expo Go roda o JS do app dentro de um aplicativo pronto da loja: o
   que ele tem de nativo é o que a Expo pôs lá, e nada do que instalamos
   depois. É ele que se identifica aqui. */
const noExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

/* O require preguiçoso — e só quando há chance de dar certo. O try
   continua, como segunda rede: aparelho antigo, build meio feito, versão
   de biblioteca trocada. Mas ele deixou de ser a única. */
const hk = () => {
  if (!ios || noExpoGo) return null;
  try { return require('@kingstinct/react-native-healthkit'); } catch { return null; }
};
const hc = () => {
  if (!android || noExpoGo) return null;
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

/* E, NO ANDROID, O HISTÓRICO. O Health Connect só deixa ler até 30 dias
   antes da primeira autorização — e pedir mais do que isso não volta
   vazio, volta ERRO, que aqui virava "nada para trazer". A leitura vai
   até o início do tratamento (ver `janelaDaLeitura`), e para isso pedimos
   junto a permissão de histórico. Ela é uma linha à parte no pedido do
   sistema, e quem não a der continua trazendo os últimos 30 dias, pelo
   recuo em `pesagensDoAparelho`.

   ⚠️ AS DUAS ESTÃO DECLARADAS EM app.json (android.permissions). Permissão
   que não está no manifesto nem aparece no pedido: o Android devolve
   "nada liberado" sem abrir tela nenhuma. */
const HISTORICO_ANDROID = 'ReadHealthDataHistory' as const;
const DIA = 86400000;

/* QUANDO O ANDROID LIBEROU. Sem o histórico, o limite dos 30 dias conta
   a partir da PRIMEIRA autorização, e não de hoje. Guardar quando ela veio
   deixa o recuo ir até lá: recuar só até "hoje menos 29" perderia as
   pesagens de quem passou seis semanas sem abrir o aplicativo enquanto a
   balança mandava números. É um detalhe do Health Connect, e por isso
   mora aqui, fora do diário. */
const CHAVE_DA_LIBERACAO = 'norte.health-connect.liberado-em.v1';

/* O TRY COBRE A BUSCA DO MÓDULO JUNTO COM A CHAMADA. Ele cobria só a
   chamada, com o `hk()` de fora, e uma biblioteca que estoura ao ser
   carregada passa por esse buraco — foi assim que a tela quebrou no Expo
   Go. Aqui dentro, qualquer tropeço vira "indisponível", que é o estado
   que a tela sabe explicar. */
export async function estadoDaSaude(): Promise<EstadoDaSaude> {
  try {
    if (ios) {
      const m = hk();
      if (!m) return 'indisponivel';
      /* O iPhone tem o Saúde sempre. Quem responde "não" é um iPad antigo
         ou um Mac — e para esses não há o que instalar. */
      return (await m.isHealthDataAvailable()) ? 'pronto' : 'sem-suporte';
    }
    if (android) {
      const m = hc();
      if (!m) return 'indisponivel';
      /* 3 é SDK_AVAILABLE. 2 é "não instalado ou desatualizado", e a loja
         resolve. 1 é "este aparelho não roda": o Health Connect pede o
         Android 9 em diante, e o nosso mínimo é o 8 — a documentação manda
         esconder a integração, e não mandar instalar o que não instala. */
      const s = await m.getSdkStatus();
      return s === 3 ? 'pronto' : s === 2 ? 'sem-app' : 'sem-suporte';
    }
  } catch { /* cai no indisponível abaixo */ }
  return 'indisponivel';
}

/** Abre a permissão do sistema. Devolve se ficou com acesso de leitura. */
export async function pedirAcesso(): Promise<boolean> {
  try {
    if (ios) {
      const m = hk();
      if (!m) return false;
      await m.requestAuthorization({ toRead: [TIPO_IOS] });
      /* O iOS NÃO DIZ SE A PESSOA DEIXOU LER. É de propósito: revelar que
         a permissão foi negada já contaria algo sobre a saúde de alguém.
         Então a resposta aqui é "a caixa abriu e não deu erro" — e quem
         descobre se veio dado é a leitura, que volta vazia. */
      return true;
    }
    if (android) {
      const m = hc();
      if (!m) return false;
      await m.initialize();
      /* Um Health Connect que não conheça o histórico não falha: ele
         deixa a linha de fora do pedido, e o peso vem igual. */
      const dadas = await m.requestPermission([
        { accessType: 'read', recordType: TIPO_ANDROID },
        { accessType: 'read', recordType: HISTORICO_ANDROID },
      ]);
      /* ⚠️ A RESPOSTA NÃO DIZ SE O HISTÓRICO VEIO — a biblioteca só devolve
         as permissões de tipo de dado. Quem descobre é a leitura. */
      const ok = (dadas ?? []).some((p: any) => p.recordType === TIPO_ANDROID);
      if (ok) AsyncStorage.setItem(CHAVE_DA_LIBERACAO, String(Date.now())).catch(() => {});
      return ok;
    }
  } catch { /* cai no false abaixo */ }
  return false;
}

/* ============================================================
   DESDE QUANDO LER — o começo do tratamento

   A leitura pedia "os últimos 180 dias", e no iPhone nem isso: o filtro
   de data estava escrito com nomes que a biblioteca não conhece, e vinha
   o histórico inteiro do Saúde, de anos. As duas coisas punham na curva
   do tratamento pesagens de antes dele — e o marco dos 5% procura a
   primeira pesagem 5% abaixo do peso inicial, então podia cair numa
   pesagem antiga, antes da primeira dose.

   O que entra é o que aconteceu desde o primeiro dia — o DIA, e não a
   hora: quem se pesou na manhã da primeira dose já se pesou no
   tratamento. Sem começo conhecido (zero, antes do cadastro) ou com o
   começo no futuro, não há o que ler.
   ============================================================ */
export function janelaDaLeitura(inicio: number, agora = Date.now()): { de: Date; ate: Date } | null {
  if (!Number.isFinite(inicio) || inicio <= 0) return null;
  const de = startOfDay(new Date(inicio));
  if (+de >= agora) return null;
  return { de, ate: new Date(agora) };
}

/* ============================================================
   O QUE A LEITURA RESPONDE — e "nada" não é uma resposta só

   Ela devolvia uma lista, e lista vazia queria dizer três coisas: não
   havia pesagem, a leitura não estava liberada, ou o depósito não
   respondeu. A tela dizia a mesma frase para as três, e para duas delas
   a frase era falsa. Agora cada uma tem o seu nome, e a tela, o seu
   recado:
     · { ok: true }              — leu; a lista pode vir vazia
     · { ok: false, sem-acesso } — o Android diz que o peso não está
                                   liberado (o iPhone nunca diz: ver
                                   `pedirAcesso`)
     · { ok: false, falhou }     — tentar de novo resolve
   ============================================================ */
export type Leitura =
  | { ok: true; pesagens: Pesagem[] }
  | { ok: false; porque: 'sem-acesso' | 'falhou' };

/** As pesagens do depósito do aparelho desde o começo do tratamento —
    `inicio` é o `profile.startT`. */
export async function pesagensDoAparelho(inicio: number): Promise<Leitura> {
  const janela = janelaDaLeitura(inicio);
  if (!janela) return { ok: true, pesagens: [] };
  const { de, ate } = janela;

  try {
    if (ios) {
      const m = hk();
      if (!m) return { ok: false, porque: 'falhou' };
      /* ⚠️ startDate E endDate, e não from e to. O filtro de data da
         biblioteca só conhece os dois primeiros; com os outros ele não
         filtrava nada, e o TypeScript não viu porque o módulo chega por
         `require`, sem tipo. Conferido em DateFilter, no
         @react-native-healthkit/core. */
      const amostras = await m.queryQuantitySamples(TIPO_IOS, {
        limit: 0,
        unit: 'kg',
        filter: { date: { startDate: de, endDate: ate } },
      });
      return {
        ok: true,
        pesagens: (amostras ?? []).map((a: any) => ({ t: +new Date(a.endDate ?? a.startDate), kg: a.quantity })),
      };
    }

    if (android) {
      const m = hc();
      if (!m) return { ok: false, porque: 'falhou' };
      await m.initialize();
      /* Liberado ou não, o Android conta — e quem revogou nas
         configurações dele precisa do caminho até lá, e não de um
         "tente de novo". */
      const dadas = await m.getGrantedPermissions();
      if (!(dadas ?? []).some((p: any) => p.accessType === 'read' && p.recordType === TIPO_ANDROID)) {
        return { ok: false, porque: 'sem-acesso' };
      }
      return { ok: true, pesagens: await lerComRecuo(m, de, ate) };
    }
  } catch { /* cai no "falhou" abaixo */ }

  return { ok: false, porque: 'falhou' };
}

/* O RECUO. Sem a permissão de histórico, um começo anterior ao que o
   Health Connect deixa ler faz a leitura INTEIRA dar erro. Tenta-se do
   começo do tratamento; não dando, de 29 dias antes da liberação (a
   folga de um dia cobre o relógio); não dando — a pessoa revogou e
   liberou de novo, e o limite andou —, de 29 dias antes de hoje. Cada
   tentativa só acontece se começar depois da anterior. */
async function lerComRecuo(m: any, de: Date, ate: Date): Promise<Pesagem[]> {
  const liberadoEm = Number(await AsyncStorage.getItem(CHAVE_DA_LIBERACAO).catch(() => null)) || 0;
  const inicios = [+de];
  /* Uma liberação "no futuro" é relógio trocado: vale como hoje. */
  for (const marco of [Math.min(liberadoEm, +ate), +ate]) {
    if (!marco) continue;
    const t = Math.max(+de, marco - 29 * DIA);
    if (t > inicios[inicios.length - 1]) inicios.push(t);
  }

  let erro: unknown;
  for (const t of inicios) {
    try { return await lerHealthConnect(m, new Date(t), ate); } catch (e) { erro = e; }
  }
  throw erro;
}

/* O Health Connect entrega em páginas de mil. Uma balança que pesa duas
   vezes por dia passa disso em um ano e meio de tratamento, e só a
   primeira página vinha. O fim vem como token vazio OU ausente, conforme
   a versão do Health Connect — a documentação dele avisa. */
async function lerHealthConnect(m: any, de: Date, ate: Date): Promise<Pesagem[]> {
  const fora: Pesagem[] = [];
  let pageToken: string | undefined;
  for (let pagina = 0; pagina < 100; pagina++) {
    const r = await m.readRecords(TIPO_ANDROID, {
      timeRangeFilter: { operator: 'between', startTime: de.toISOString(), endTime: ate.toISOString() },
      ...(pageToken ? { pageToken } : {}),
    });
    for (const x of r?.records ?? []) fora.push({ t: +new Date(x.time), kg: x.weight?.inKilograms });
    pageToken = r?.pageToken || undefined;
    if (!pageToken) break;
  }
  return fora;
}

/* ============================================================
   QUANDO A RESPOSTA É "VÁ AO SISTEMA"

   Permissão negada duas vezes não volta a ser perguntada: o Android
   passa a responder "nada liberado" sem mostrar tela nenhuma. A partir
   daí, o único lugar em que dá para mudar é o próprio Health Connect —
   e um recado que diz "nas configurações" sem levar até elas deixa a
   pessoa procurando.

   NO IPHONE NÃO HÁ ENDEREÇO OFICIAL para as permissões do Saúde, e a
   função devolve false: a tela diz o caminho em vez de abrir.
   ============================================================ */
export function abrirPermissoes(): boolean {
  try {
    if (android) {
      const m = hc();
      if (!m) return false;
      m.openHealthConnectSettings();
      return true;
    }
  } catch { /* cai no false abaixo */ }
  return false;
}

/** Android sem o Health Connect, ou com ele desatualizado: a página dele
    na Google Play — os dois casos se resolvem lá. O endereço de loja é o
    que a documentação do Health Connect indica; sem a loja instalada,
    vale a página da web. */
export async function abrirNaLoja(): Promise<void> {
  const id = 'com.google.android.apps.healthdata';
  try {
    await Linking.openURL(`market://details?id=${id}&url=healthconnect%3A%2F%2Fonboarding`);
  } catch {
    await Linking.openURL(`https://play.google.com/store/apps/details?id=${id}`).catch(() => {});
  }
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
