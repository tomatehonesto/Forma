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

export const useStore = create<Store>((set, get) => ({
  S: buildSeed(),
  ready: false,
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) { const s = ensureDefaults(JSON.parse(raw)); set({ S: s, ready: true }); return; }
    } catch {}
    const s = buildSeed();
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
    const s = buildSeed();
    AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => {});
    set({ S: s });
  },
  setTheme: (t) => get().update((s) => { s.theme = t; }),
}));
