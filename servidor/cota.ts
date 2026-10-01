/* ============================================================
   A PORTA DAS TRÊS FUNÇÕES — quem está chamando, e se ainda cabe hoje

   O token compartilhado (MORPHI_TOKEN) vai no pacote do aplicativo e é
   extraível: impedia que a URL vazada num log virasse conta aberta, e
   nada mais. A porta de verdade é a sessão de quem está logado.

   O aplicativo manda o JWT do Supabase em `Authorization`. Este módulo o
   repassa para `public.consumir_cota_da_ia` (supabase/migrations,
   "cota_da_ia") com a chave PÚBLICA do projeto — a mesma que está no
   aplicativo. Uma chamada só faz as duas coisas: a API do Supabase recusa
   um JWT inválido ou vencido, e a função soma um uso e diz se ainda cabe
   no teto do dia. Nenhuma chave secreta mora aqui.

   ⚠️ FALHA FECHADA EM PRODUÇÃO. Sem SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY
   configurados, a porta não tem como conferir ninguém. Numa prévia ou em
   desenvolvimento ela deixa passar — é como o aplicativo é testado sem
   conta —, mas em produção (VERCEL_ENV=production) ela recusa, porque
   deixar passar ali seria o token compartilhado de volta.
   ============================================================ */

export type Tipo = 'foto' | 'laudo' | 'estimativa' | 'conversa' | 'leitura';

export type Porta =
  /** `restam`: quantas chamadas deste tipo ainda cabem hoje, depois desta.
      Ausente quando a porta deixa passar sem o Supabase (desenvolvimento). */
  | { ok: true; restam?: number }
  | { ok: false; motivo: 'sem-conta' | 'limite' | 'limite-do-mes' | 'sem-rede'; status: number };

export async function abrirPorta(req: Request, tipo: Tipo): Promise<Porta> {
  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !chave) {
    if (process.env.VERCEL_ENV === 'production') {
      console.error('porta: SUPABASE_URL ou SUPABASE_PUBLISHABLE_KEY ausente em produção');
      return { ok: false, motivo: 'sem-rede', status: 503 };
    }
    return { ok: true };
  }

  const auth = req.headers.get('authorization') ?? '';
  if (!/^Bearer\s+\S+$/.test(auth)) return { ok: false, motivo: 'sem-conta', status: 401 };

  let r: Response;
  try {
    r = await fetch(`${url.replace(/\/$/, '')}/rest/v1/rpc/consumir_cota_da_ia`, {
      method: 'POST',
      headers: { apikey: chave, authorization: auth, 'content-type': 'application/json' },
      body: JSON.stringify({ tipo }),
    });
  } catch (e) {
    console.error('porta: o Supabase não respondeu', e);
    return { ok: false, motivo: 'sem-rede', status: 503 };
  }

  /* 401 é o JWT recusado (vencido, inválido); 42501 é a função recusando
     quem não tem sessão ou tem sessão anônima. Para quem está do outro
     lado, é o mesmo: entrar de novo na conta. */
  if (r.status === 401 || r.status === 403) return { ok: false, motivo: 'sem-conta', status: 401 };
  const corpo = await r.json().catch(() => null) as { ok?: boolean; code?: string; restam?: number; periodo?: string } | null;
  if (corpo?.code === '42501') return { ok: false, motivo: 'sem-conta', status: 401 };
  if (!r.ok || !corpo) {
    console.error('porta: resposta inesperada', r.status, corpo);
    return { ok: false, motivo: 'sem-rede', status: 503 };
  }
  /* Qual teto barrou: o do dia ("amanhã eu volto") ou o de 30 dias, que
     só a conversa tem (20261001012518_teto_da_conversa). */
  if (corpo.ok !== true) return { ok: false, motivo: corpo.periodo === '30-dias' ? 'limite-do-mes' : 'limite', status: 429 };
  return typeof corpo.restam === 'number' ? { ok: true, restam: corpo.restam } : { ok: true };
}
