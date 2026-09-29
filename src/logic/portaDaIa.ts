import { nuvem } from './nuvem';

/* ============================================================
   A PORTA DO SERVIDOR DA IA — o que as três chamadas mandam junto

   A leitura da foto (logic/analise), a do laudo (logic/laudo) e a
   estimativa pelo nome (logic/estimativa) falam com o servidor da Vercel,
   e ele só chama o modelo para quem tem sessão e ainda cabe no teto do
   dia (servidor/cota, e a migração "cota_da_ia"). Estes são os
   cabeçalhos que provam quem está chamando:

     authorization   o JWT da sessão do Supabase, quando há sessão;
     x-morphi-token  o token compartilhado, que continua — ele não prova
                     ninguém, mas mantém a URL vazada longe do modelo
                     nas prévias em que a porta ainda deixa passar.

   ⚠️ SEM SESSÃO O CABEÇALHO SIMPLESMENTE NÃO VAI, e quem decide é o
   servidor: em produção ele recusa ("sem-conta"); em desenvolvimento,
   sem o Supabase configurado nele, deixa passar.
   ============================================================ */

/* ⚠️ LIDO ASSIM, POR EXTENSO: o Expo só embute `process.env.EXPO_PUBLIC_*`
   escrito literalmente no código. */
const TOKEN = process.env.EXPO_PUBLIC_ANALISE_TOKEN;

export async function cabecalhosDaIa(): Promise<Record<string, string>> {
  const h: Record<string, string> = { 'content-type': 'application/json' };
  if (TOKEN) h['x-morphi-token'] = TOKEN;
  try {
    const sessao = (await nuvem()?.auth.getSession())?.data?.session;
    if (sessao?.access_token) h.authorization = `Bearer ${sessao.access_token}`;
  } catch {
    /* sem sessão legível, vai sem o cabeçalho — o servidor decide */
  }
  return h;
}

/** Os dois motivos que a porta do servidor pode dar, além dos de cada
    leitura. */
export type MotivoDaPorta = 'sem-conta' | 'limite';

/** O motivo da porta numa resposta de falha, se for um deles. */
export const motivoDaPorta = (corpo: unknown): MotivoDaPorta | null => {
  const m = (corpo as { motivo?: unknown } | null)?.motivo;
  return m === 'sem-conta' || m === 'limite' ? m : null;
};
