/* ============================================================
   A CONTA — entrar, sair, apagar, e a sincronia ligada

   A conta liga o diário a uma pessoa (plano do Supabase, a decisão 1). A
   entrada é sem senha: pela Apple, ou por um código de seis números que
   mandamos por e-mail. O Google chega na fase 5, com a build de
   desenvolvimento.

   ⚠️ TUDO AQUI PASSA POR `nuvem()`. Sem as variáveis do projeto — as
   sondas de scripts/ e as builds de loja até a fase 8 —, não há conta, e
   cada função responde que não há.

   ⚠️ OS ERROS SAEM COMO NOMES, e não como a mensagem do servidor: quem
   escreve a frase é o catálogo (textos/<local>/conta).

   ⚠️ A SINCRONIA MORA AQUI, e não no store: é daqui que ela conhece o
   Supabase (o transporte) e o store (o diário). O motor em si é
   logic/sincronia, provado contra um servidor de mentira.
   ============================================================ */
import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import {
  FunctionsFetchError, FunctionsHttpError, isAuthRetryableFetchError, type AuthError,
} from '@supabase/supabase-js';
import { nuvem } from './nuvem';
import { useStore } from './store';
import { modoFingido } from './modo';
import { localAtual } from './local';
import { criarSincronia, type EstadoDaSincronia, type Sincronia } from './sincronia';
import { transporteDoSupabase } from './transporte';

/** ⚠️ Os mesmos do painel do Supabase (Authentication → Sign In /
    Providers → Email) e do modelo do e-mail (supabase/modelos/codigo.html).
    Mudar aqui é mudar lá. */
export const DIGITOS_DO_CODIGO = 6;
export const VALIDADE_DO_CODIGO_MIN = 10;
/** O servidor recusa um código novo antes de um minuto. */
export const ESPERA_PARA_REENVIAR_S = 60;

export type ErroDaConta = 'sem-internet' | 'codigo-errado' | 'muitos-pedidos' | 'apple' | 'cancelado' | 'outro';
export type Entrada = { ok: true; id: string; email: string | null } | { ok: false; erro: ErroDaConta };

function erroDe(e: unknown): ErroDaConta {
  const err = e as AuthError | undefined;
  if (!err) return 'outro';
  if (isAuthRetryableFetchError(err) || err.status === 0) return 'sem-internet';
  if (err.code === 'otp_expired') return 'codigo-errado';
  if (err.code === 'over_email_send_rate_limit' || err.code === 'over_request_rate_limit' || err.status === 429) {
    return 'muitos-pedidos';
  }
  return 'outro';
}

const semNuvem: Entrada = { ok: false, erro: 'outro' };

/* ============================================================
   O E-MAIL COM CÓDIGO

   ⚠️ O IDIOMA VAI JUNTO, para o e-mail sair na língua de quem pediu: o
   modelo escolhe o texto por ele. O servidor só o grava na criação da
   conta — quem já tem conta recebe na língua em que se cadastrou.
   ============================================================ */
export async function pedirCodigo(email: string): Promise<{ ok: true } | { ok: false; erro: ErroDaConta }> {
  const cliente = nuvem();
  if (!cliente) return semNuvem as any;
  try {
    const { error } = await cliente.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true, data: { idioma: localAtual() } },
    });
    return error ? { ok: false, erro: erroDe(error) } : { ok: true };
  } catch (e) {
    return { ok: false, erro: erroDe(e) };
  }
}

export async function confirmarCodigo(email: string, codigo: string): Promise<Entrada> {
  const cliente = nuvem();
  if (!cliente) return semNuvem;
  try {
    const { data, error } = await cliente.auth.verifyOtp({ email: email.trim(), token: codigo, type: 'email' });
    if (error || !data.user) return { ok: false, erro: erroDe(error) };
    return { ok: true, id: data.user.id, email: data.user.email ?? null };
  } catch (e) {
    return { ok: false, erro: erroDe(e) };
  }
}

/* ============================================================
   A APPLE

   Só no iOS, e só onde o sistema diz que há. O Expo Go serve: o painel do
   `morphi-dev` aceita `host.exp.Exponent` entre os IDs.

   ⚠️ O NONCE: a Apple recebe o resumo (SHA-256 em hexadecimal) e o
   Supabase recebe o original, e confere um contra o outro. É o que impede
   um token de outra entrada de ser reaproveitado aqui.

   ⚠️ SÓ O E-MAIL É PEDIDO. O nome já veio do cadastro, e a Apple só o
   entrega na primeira vez — não há o que guardar dele.
   ============================================================ */
export async function appleDisponivel(): Promise<boolean> {
  if (Platform.OS !== 'ios' || !nuvem()) return false;
  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function entrarComApple(): Promise<Entrada> {
  const cliente = nuvem();
  if (!cliente) return semNuvem;
  try {
    const cru = Crypto.randomUUID();
    const resumo = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, cru);
    const credencial = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
      nonce: resumo,
    });
    if (!credencial.identityToken) return { ok: false, erro: 'apple' };
    const { data, error } = await cliente.auth.signInWithIdToken({
      provider: 'apple', token: credencial.identityToken, nonce: cru,
    });
    if (error || !data.user) return { ok: false, erro: erroDe(error) === 'sem-internet' ? 'sem-internet' : 'apple' };
    return { ok: true, id: data.user.id, email: data.user.email ?? null };
  } catch (e: any) {
    if (e?.code === 'ERR_REQUEST_CANCELED') return { ok: false, erro: 'cancelado' };
    return { ok: false, erro: 'apple' };
  }
}

/* ============================================================
   SAIR E APAGAR
   ============================================================ */

/** ⚠️ SÓ DESTE APARELHO: o padrão do Supabase desliga a pessoa de todos. */
export async function sair() {
  try {
    await nuvem()?.auth.signOut({ scope: 'local' });
  } catch {}
}

/** O diário que a conta já tem no servidor — para "os dois não se
    misturam". Nulo quando não deu para perguntar. */
export async function contaTemDiario(): Promise<boolean | null> {
  const cliente = nuvem();
  if (!cliente) return null;
  const { data: sessao } = await cliente.auth.getSession();
  const id = sessao.session?.user.id;
  if (!id) return null;
  const [perfil, linhas] = await Promise.all([
    cliente.from('perfis').select('user_id').eq('user_id', id).maybeSingle(),
    cliente.from('registros').select('id').eq('user_id', id).is('apagado_em', null).limit(1),
  ]);
  if (perfil.error || linhas.error) return null;
  return !!perfil.data || !!linhas.data?.length;
}

/** Apaga a conta no servidor — a função `apagar-conta`, e a cascata do
    banco leva o resto. O aparelho só é limpo por quem chamou, e só se
    isto responder que apagou. */
export async function apagarConta(): Promise<{ ok: true } | { ok: false; erro: 'sem-internet' | 'outro' }> {
  const cliente = nuvem();
  if (!cliente) return { ok: false, erro: 'outro' };
  try {
    const { error } = await cliente.functions.invoke('apagar-conta', { method: 'POST' });
    if (!error) return { ok: true };
    if (error instanceof FunctionsFetchError) return { ok: false, erro: 'sem-internet' };
    if (error instanceof FunctionsHttpError) return { ok: false, erro: 'outro' };
    return { ok: false, erro: 'outro' };
  } catch {
    return { ok: false, erro: 'sem-internet' };
  }
}

/* ============================================================
   A SINCRONIA LIGADA

   Um motor só, criado na primeira vez que alguém pede. O store entra
   pelas três portas que o motor conhece: ler, mudar (o `update` de
   sempre, que carimba e grava) e avisar quando o estado muda.
   ============================================================ */
let motor: Sincronia | null = null;

export function sincronia(): Sincronia | null {
  if (motor) return motor;
  const cliente = nuvem();
  if (!cliente) return null;
  motor = criarSincronia({
    transporte: transporteDoSupabase(cliente),
    loja: {
      ler: () => useStore.getState().S,
      mudar: (mut) => useStore.getState().update(mut as any),
      assinar: (ouvinte) => useStore.subscribe((agora, antes) => {
        if (agora.S !== antes.S) ouvinte();
      }),
    },
    guarda: AsyncStorage,
    fingindo: () => modoFingido() !== null,
  });
  return motor;
}

const nada = () => () => {};
/** O estado que a linha do Perfil e a faixa da Home leem. */
export function useEstadoDaSincronia(): EstadoDaSincronia {
  const m = sincronia();
  return useSyncExternalStore(m ? m.aoMudar : nada, () => m?.estado() ?? 'desligada');
}
