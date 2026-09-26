/* ============================================================
   A NUVEM — o cliente do Supabase, e a sessão guardada no aparelho

   Quem usa o cliente: a conta e a sincronia (logic/conta, fase 4 do plano
   em docs/superpowers/plans/2026-09-25-supabase-ponte-plano.md), todas as
   portas atrás de `contaLigada()`.

   O ENDEREÇO E A CHAVE são públicos e vêm das variáveis de ambiente —
   .env.development, no desenvolvimento. Sem as duas, `nuvem()` é nulo e o
   aplicativo é o de sempre, só no aparelho: é o que acontece nas sondas
   de scripts/ e nas builds de loja até a virada para a produção. A chave
   SECRETA nunca entra aqui, e quem protege o dado são as regras do banco
   (supabase/migrations).
   ============================================================ */
import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import * as aesjs from 'aes-js';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/* ⚠️ Escritas por extenso, com ponto: é assim que o Expo as troca pelo
   valor na hora de montar o pacote. */
const ENDERECO = process.env.EXPO_PUBLIC_SUPABASE_URL;
const CHAVE_PUBLICA = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/* ============================================================
   A SESSÃO CIFRADA — o desenho que a documentação do Supabase indica
   para o Expo

   A sessão é o que abre o diário da pessoa no servidor, e não fica em
   texto claro no AsyncStorage, que vai nas cópias de segurança do
   aparelho. E ela passa dos 2 KB quando traz os dados da Apple ou do
   Google, que algumas versões do iOS recusavam no Keychain. Então o
   Keychain (expo-secure-store) guarda só uma chave AES de 256 bits, nova
   a cada gravação, e a sessão vai cifrada com ela para o AsyncStorage.

   ⚠️ A chave sai de `getRandomValues`, e não de `getRandomBytes`: a
   documentação do SDK 57 avisa que o segundo pode cair em `Math.random`
   em desenvolvimento.

   ⚠️ Chave perdida é sessão perdida, e nada mais: sem ela, a sessão não
   se lê, e a pessoa entra de novo. O diário mora no aparelho e no
   servidor, e não aqui.

   ⚠️ E UMA OPERAÇÃO DE CADA VEZ. A sessão são duas peças em dois lugares
   (a chave no Keychain, a cifra no AsyncStorage), gravadas uma depois da
   outra. O cliente do Supabase não tem trava (a coordenação dele é
   "lockless"), e ler no meio de uma gravação juntava a chave nova com a
   cifra velha: a sessão saía como lixo, o cliente a jogava fora, e a
   pessoa voltava ao login — em laço, porque cada entrada grava de novo
   enquanto a abertura lê. A fila abaixo faz leitura, gravação e remoção
   esperarem a anterior terminar.
   ============================================================ */
let fila: Promise<unknown> = Promise.resolve();
const emFila = <T,>(passo: () => Promise<T>): Promise<T> => {
  const vez = fila.then(passo, passo);
  fila = vez.catch(() => {});
  return vez;
};

const sessaoCifrada = {
  getItem: (nome: string) => emFila(async (): Promise<string | null> => {
    const cifrado = await AsyncStorage.getItem(nome);
    if (!cifrado) return null;
    const chave = await SecureStore.getItemAsync(nome);
    if (!chave) return null;
    const cifra = new aesjs.ModeOfOperation.ctr(aesjs.utils.hex.toBytes(chave), new aesjs.Counter(1));
    return aesjs.utils.utf8.fromBytes(cifra.decrypt(aesjs.utils.hex.toBytes(cifrado)));
  }),
  setItem: (nome: string, valor: string) => emFila(async (): Promise<void> => {
    const chave = Crypto.getRandomValues(new Uint8Array(32));
    const cifra = new aesjs.ModeOfOperation.ctr(chave, new aesjs.Counter(1));
    const cifrado = aesjs.utils.hex.fromBytes(cifra.encrypt(aesjs.utils.utf8.toBytes(valor)));
    await SecureStore.setItemAsync(nome, aesjs.utils.hex.fromBytes(chave));
    await AsyncStorage.setItem(nome, cifrado);
  }),
  removeItem: (nome: string) => emFila(async (): Promise<void> => {
    await AsyncStorage.removeItem(nome);
    await SecureStore.deleteItemAsync(nome);
  }),
};

let cliente: SupabaseClient | null | undefined;

/** O cliente do Supabase — ou nulo, quando este aparelho não tem para onde falar. */
export function nuvem(): SupabaseClient | null {
  if (cliente !== undefined) return cliente;
  if (!ENDERECO || !CHAVE_PUBLICA) {
    cliente = null;
    return cliente;
  }
  cliente = createClient(ENDERECO, CHAVE_PUBLICA, {
    auth: {
      /* Na web, que é só a de testes, fica o localStorage do navegador — o
         padrão do cliente. O expo-secure-store não existe lá. */
      ...(Platform.OS === 'web' ? {} : { storage: sessaoCifrada }),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  /* Fora do navegador, a renovação automática não sabe quando o
     aplicativo vai para o fundo: quem liga e desliga é o AppState, como a
     documentação do Supabase pede. */
  if (Platform.OS !== 'web') {
    AppState.addEventListener('change', (estado) => {
      if (estado === 'active') cliente?.auth.startAutoRefresh();
      else cliente?.auth.stopAutoRefresh();
    });
  }
  return cliente;
}

/* ============================================================
   HÁ CONEXÃO?

   Uma pergunta curta ao endereço de saúde da autenticação — é ele que
   precisa responder para criar a conta ou entrar. A tranca da conta (ver
   o `Portao`, em app/_layout) só fecha com resposta: registrar nunca
   espera o servidor, e trancar sem internet deixaria alguém fora do
   próprio diário, sem poder registrar a dose.
   ============================================================ */
export async function temConexao(espera = 4000): Promise<boolean> {
  if (!ENDERECO || !CHAVE_PUBLICA) return false;
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), espera);
  try {
    const r = await fetch(`${ENDERECO}/auth/v1/health`, {
      headers: { apikey: CHAVE_PUBLICA },
      signal: controle.signal,
    });
    return r.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(relogio);
  }
}

/* ============================================================
   O INTERRUPTOR

   ⚠️ LIGADO NA FASE 8 DO PLANO, no mesmo commit que trocou os textos
   legais — nenhuma frase mentindo nem um dia para quem usa o aplicativo.

   ⚠️⚠️ E POR ISSO NENHUMA BUILD FORA DE `__DEV__` SAI ANTES DA VIRADA
   PARA A PRODUÇÃO (a seção "Depois do plano"). Os textos descrevem a
   nuvem para todas as builds; uma build de loja sem as variáveis do
   projeto de produção teria `nuvem()` nulo, e aí os textos mentiriam
   para o outro lado.
   ============================================================ */
const NUVEM_PARA_TODOS = true;

/** Se as portas da conta e da nuvem aparecem neste aparelho. */
export const contaLigada = (): boolean => !!nuvem() && (__DEV__ || NUVEM_PARA_TODOS);
