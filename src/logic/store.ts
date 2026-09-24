/* Store — zustand + persistência AsyncStorage (equivale ao load/save/localStorage do protótipo). */
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buildSeed, estadoVazio, ensureDefaults, type State, type Tema } from './seed';
import { fingirModo, modoFingido, marcarPreviaDeIdioma, type Modo } from './modo';
import { trocarLocal, type Local } from './local';

const KEY = 'norte.v1';
const clone = (s: any) => JSON.parse(JSON.stringify(s));

type Store = {
  S: State;
  ready: boolean;
  hydrate: () => Promise<void>;
  update: (mut: (s: State) => void) => void;
  reset: () => void;
  setPaleta: (id: string) => void;
  setTheme: (t: Tema) => void;
  fingir: (m: Modo | null) => void;
  verEm: (l: Local | null) => void;
  resemear: () => void;
};

/* O ESTADO NOVO PASSA PELAS MESMAS GARANTIAS QUE O GRAVADO.

   `ensureDefaults` rodava só no que vinha do armazenamento, como se ele
   fosse "a migração" e a semente já nascesse pronta. Mas ele não migra
   só: ele também estabelece invariantes que nenhum dos dois pode
   quebrar — e a semente quebrou um. A marca d'água das conquistas nasce
   ali, e instalar o app do zero deixava a marca vazia: a primeira
   pesagem comemoraria trinta e nove níveis de uma vez.

   Rodar nos dois é a regra certa, e é barata: a função é idempotente por
   construção, porque toda linha dela pergunta antes de escrever. */
const semente = () => ensureDefaults(buildSeed());

/* ============================================================
   A MÁSCARA DOS MODOS FINGIDOS — ver ./modo.ts

   ⚠️⚠️ ELA APAGA O DADO, E NÃO O PREDICADO. `clinicaConectada` e
   `temAcompanhamento` já são consultados em sessenta e um sítios, e
   trocar a resposta dos dois esconderia as seções certas — mas CINCO
   telas leem `S.profile.doctor` direto para escrever o nome, e no modo
   sem acompanhamento a Home continuaria mostrando "Dra. Helena Costa"
   embaixo de um cartão que diz que não há ninguém.

   Apagando o dado, os sessenta e um sítios fazem o trabalho deles
   sozinhos e as cinco leituras diretas não têm o que escrever. É o mesmo
   desenho de `estadoVazio`, e as formas vazias daqui são copiadas de lá
   — `consult` vira `{ t: 0 }` e não `null` porque é isso que
   `temConsulta` sabe ler.

   ⚠️ O QUE FICA É DELA. Peso, aplicações, check-ins, refeições, exames e
   documentos atravessam os dois modos: a pessoa do modo 2 tem o mesmo
   tratamento da Mariana, e o que ela não tem é plataforma.
   ============================================================ */
/** Exportada para a sonda de scripts/modos.mjs poder afirmar o que ela
    apaga. Nenhuma tela a chama: quem finge é a ação `fingir`. */
export const mascarar = (verdade: State, modo: Modo): State => {
  const S: any = clone(verdade);

  /* ---- o que sai nos DOIS modos: tudo que só existe com plataforma ---- */
  S.profile.vinculo = null;
  S.messages = [];
  S.unread = 0;
  S.prescriptions = [];
  S.team = [];
  /* Guia, vídeo e protocolo alimentar vêm todos com "enviado pela
     enfermeira" e "montado pela nutricionista" escritos no motivo. */
  S.materials = [];

  /* ⚠️ E A TAREFA DE EXAME SAI DO PROTOCOLO, pela mesma razão que sai em
     `estadoVazio`: das cinco linhas da semana, quatro são contas que o
     próprio aplicativo faz, e "Agendar exame de sangue" é a única
     clinicamente autoral. Sem clínica, ela é uma ordem de exame que
     ninguém deu. */
  S.protocol = {
    ...S.protocol,
    tasks: (S.protocol?.tasks ?? []).filter((x: any) => !(x.t && /exame/i.test(x.t))),
  };

  if (modo === 'sem-parceira') return S as State;

  /* ---- e o que sai só no modo 3: a pessoa que conduz sozinha ---- */
  S.profile.doctor = '';
  S.profile.clinic = '';
  S.profile.acompanhamento = 'nenhum';
  S.profile.doctorInfo = {};
  S.profile.nutri = '';
  /* Sem ninguém do outro lado não há consulta para ter nem para ter
     tido — e as metas do protocolo eram o que ela anotou da equipe. */
  S.consult = { t: 0, type: '', doctor: '' };
  S.consultsHistory = [];
  S.protocol = { ...S.protocol, metas: {} };

  return S as State;
};

/* A verdade, enquanto a máscara está no ar. Vive fora do estado de
   propósito: se morasse dentro, seria gravada. */
let real: State | null = null;

export const useStore = create<Store>((set, get) => ({
  S: semente(),
  ready: false,
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) { const s = ensureDefaults(JSON.parse(raw)); set({ S: s, ready: true }); return; }
    } catch {}
    const s = semente();
    AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => {});
    set({ S: s, ready: true });
  },
  /* ⚠️ FINGINDO, O UPDATE NÃO GRAVA. Ele continua valendo na tela —
     registrar um peso durante a prévia funciona e aparece —, mas o que
     seria escrito é o estado MASCARADO, e gravá-lo apagaria de verdade a
     clínica da Mariana. O que se faz dentro da prévia morre com ela. */
  update: (mut) => {
    const s = clone(get().S);
    mut(s);
    if (!modoFingido()) AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => {});
    set({ S: s });
  },
  /* ⚠️ RESET DEVOLVIA A SEMENTE, e por isso não podia ser oferecido como
     "apagar meus dados": quem tocasse veria voltar o tratamento de
     exemplo, com setenta e um dias de registros de outra pessoa. Apagar
     é ir para o estado vazio, e a porta se tranca junto — sem cadastro o
     app não abre. */
  reset: () => {
    const s = estadoVazio();
    AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => {});
    set({ S: s });
  },
  setTheme: (t) => get().update((s) => { s.theme = t; }),
  /* A cor de ação mora no estado como o tema mora: é preferência, e
     preferência sobrevive a fechar o app. */
  /* A paleta mora no estado como o tema mora: é preferência, e
     preferência sobrevive a fechar o app. */
  setPaleta: (id) => get().update((s: any) => { s.paleta = id; }),

  /* ⚠️ O PAR `real` + `fingirModo` ANDA JUNTO, SEMPRE. Um sem o outro
     deixa o valor de módulo e o estado servido discordando — e quem
     discorda em silêncio é `update`, que voltaria a gravar por cima da
     máscara.

     Desligar devolve o estado guardado, e não relê o disco: o que a
     pessoa mexeu antes de entrar na prévia continua lá. */
  fingir: (m) => {
    const verdade = real ?? get().S;
    if (!m) { real = null; fingirModo(null); set({ S: verdade }); return; }
    real = verdade;
    fingirModo(m);
    set({ S: mascarar(verdade, m) });
  },

  /* ⚠️ A PRÉVIA DE IDIOMA PASSA PELA STORE SÓ PARA REPINTAR. Ver
     logic/modo: o idioma já é valor de módulo, e `trocarLocal` sozinho o
     troca — o que ele não faz é avisar o React.

     Quem lê o idioma para montar a chave de remontagem é o layout raiz, e
     ele só relê quando re-renderiza. Hoje isso acontece porque a folha de
     idioma chama `update` logo depois de `trocarLocal`, e a gravação
     muda o `S`. A prévia não grava — então precisa de outro jeito de
     pedir o repinte, e é este: uma referência nova de `S`, com o mesmo
     conteúdo, sem tocar no AsyncStorage.

     ⚠️ E VOLTAR É VOLTAR PARA O QUE ESTÁ GRAVADO, e não para o padrão.
     `trocarLocal(null)` devolveria o idioma do aparelho, e quem tivesse
     escolhido italiano no perfil sairia da prévia em português. */
  verEm: (l) => {
    const salvo = ((get().S as any).profile?.idioma ?? null) as Local | null;
    marcarPreviaDeIdioma(!!l);
    trocarLocal(l ?? salvo);
    set({ S: { ...get().S } });
  },

  /* ⚠️⚠️ RECONSTRUIR A SEMENTE É DE DESENVOLVIMENTO, E APAGA DE VERDADE.

     As outras duas ações daqui — `fingir` e `verEm` — não escrevem nada:
     elas servem uma máscara e morrem ao recarregar. Esta é o contrário, e
     tem de ser: a semente é construída com datas relativas a HOJE, então
     ela só muda quando é reconstruída. Sem isto, mexer no que a Mariana
     tem — as canetas dela, uma aplicação nova, um exame a mais — não
     aparece em aparelho nenhum que já tenha rodado o aplicativo uma vez,
     e o desenvolvimento passa a olhar para um estado antigo achando que é
     o novo.

     ⚠️ E NÃO É "APAGAR MEUS DADOS", que é outra coisa e fica em
     /privacidade: aquela vai para o estado VAZIO e tranca a porta no
     cadastro, porque devolver a semente a quem pediu para apagar seria
     entregar setenta e um dias de registros de outra pessoa. Esta faz
     exatamente o que aquela não pode fazer, e por isso só existe dentro
     de `__DEV__`.

     O fingimento sai junto: a máscara guarda a verdade de lado, e mantê-la
     ligada serviria o recorte de um estado que deixou de existir. */
  resemear: () => {
    real = null;
    fingirModo(null);
    const s = semente();
    AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => {});
    set({ S: s, ready: true });
  },
}));
