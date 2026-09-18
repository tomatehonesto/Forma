/* Store — zustand + persistência AsyncStorage (equivale ao load/save/localStorage do protótipo). */
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buildSeed, ensureDefaults, type State } from './seed';

const KEY = 'norte.v1';
const clone = (s: any) => JSON.parse(JSON.stringify(s));

type Store = {
  S: State;
  ready: boolean;
  hydrate: () => Promise<void>;
  update: (mut: (s: State) => void) => void;
  reset: () => void;
  setTheme: (t: 'light' | 'dark') => void;
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
  update: (mut) => {
    const s = clone(get().S);
    mut(s);
    AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => {});
    set({ S: s });
  },
  reset: () => {
    const s = semente();
    AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => {});
    set({ S: s });
  },
  setTheme: (t) => get().update((s) => { s.theme = t; }),
}));
