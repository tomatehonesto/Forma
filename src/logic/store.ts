/* Store — zustand + persistência AsyncStorage (equivale ao load/save/localStorage do protótipo). */
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buildSeed, estadoVazio, ensureDefaults, type State, type Tema } from './seed';
import { fingirModo, modoFingido, type Modo } from './modo';

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
}));
