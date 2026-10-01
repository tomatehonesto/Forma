import Anthropic from '@anthropic-ai/sdk';
import { abrirPorta } from '../cota.js';
import { REGRAS_DA_LEITURA, blocoDaLeitura } from '../leitura/prompt.js';

/* ============================================================
   A LEITURA DA SEMANA

   O aparelho manda o resumo da semana e uma descoberta já calculada
   (src/logic/descobertasDaSemana, src/logic/resumoDaSemana); o modelo
   devolve três textos curtos — a semana, a descoberta e um teste. Ver
   docs/superpowers/specs/2026-10-01-leitura-da-semana-design.md.

   ⚠️ NADA É GUARDADO AQUI, como na conversa: a leitura volta para o
   aparelho e fica lá. O log só registra o erro, nunca o conteúdo.

   ⚠️ OS TETOS VÊM ANTES DA PORTA, e a porta antes do modelo.
   ============================================================ */

const cliente = new Anthropic();

const IDIOMAS: Record<string, string> = {
  'pt-BR': 'português do Brasil',
  'en-US': 'inglês americano',
  'es-419': 'espanhol latino-americano',
  'fr-FR': 'francês',
  'de-DE': 'alemão',
  'it-IT': 'italiano',
};

export const TETOS_DA_LEITURA = { resumo: 8000, descoberta: 3000 };
const NIVEIS = new Set(['forte', 'comeco', 'retrato']);

export type PedidoDaLeitura = { resumo: string; descoberta: { nivel: string; area: string; tipo: string; dados: Record<string, unknown> }; idioma: string };

/** Confere o corpo do pedido. Devolve null quando não serve. */
export function lerPedidoDaLeitura(corpo: any): PedidoDaLeitura | null {
  if (!corpo || typeof corpo !== 'object') return null;
  const resumo = typeof corpo.resumo === 'string' ? corpo.resumo : '';
  if (resumo.length < 1 || resumo.length > TETOS_DA_LEITURA.resumo) return null;
  const d = corpo.descoberta;
  if (!d || typeof d !== 'object' || !NIVEIS.has(d.nivel) || typeof d.area !== 'string' || typeof d.tipo !== 'string'
    || !d.dados || typeof d.dados !== 'object') return null;
  if (JSON.stringify(d).length > TETOS_DA_LEITURA.descoberta) return null;
  for (const v of Object.values(d.dados)) if (!['string', 'number', 'boolean'].includes(typeof v)) return null;
  const idioma = IDIOMAS[corpo.idioma] ? corpo.idioma : 'pt-BR';
  return { resumo, descoberta: { nivel: d.nivel, area: d.area, tipo: d.tipo, dados: d.dados }, idioma };
}

const ESQUEMA = {
  type: 'object',
  additionalProperties: false,
  properties: { semana: { type: 'string' }, descoberta: { type: 'string' }, teste: { type: 'string' } },
  required: ['semana', 'descoberta', 'teste'],
};

/** O pedido ao modelo, num lugar só: o handler e a avaliação
    (scripts/avaliacao) chamam esta função. */
export function parametrosDaLeitura(p: PedidoDaLeitura) {
  return {
    model: 'claude-sonnet-5-5',
    max_tokens: 2000,
    system: [
      { type: 'text' as const, text: REGRAS_DA_LEITURA, cache_control: { type: 'ephemeral' as const, ttl: '1h' as const } },
      { type: 'text' as const, text: blocoDaLeitura(IDIOMAS[p.idioma], p.resumo, p.descoberta) },
    ],
    messages: [{ role: 'user' as const, content: 'Escreva a leitura desta semana.' }],
    output_config: { effort: 'low' as const, format: { type: 'json_schema' as const, schema: ESQUEMA } },
  };
}

const CABECALHOS = {
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type, authorization, x-morphi-token',
  'access-control-allow-methods': 'POST, OPTIONS',
};
const responder = (corpo: unknown, status = 200) => new Response(JSON.stringify(corpo), { status, headers: CABECALHOS });
const falhou = (motivo: 'sem-rede' | 'nao-reconheci' | 'sem-conta' | 'limite' | 'limite-do-mes', status = 200) =>
  responder({ ok: false, motivo }, status);

async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CABECALHOS });
  if (req.method !== 'POST') return falhou('nao-reconheci', 405);

  const esperado = process.env.MORPHI_TOKEN;
  if (esperado && req.headers.get('x-morphi-token') !== esperado) return falhou('nao-reconheci', 401);

  let pedido: PedidoDaLeitura | null;
  try { pedido = lerPedidoDaLeitura(await req.json()); } catch { pedido = null; }
  if (!pedido) return falhou('nao-reconheci', 400);

  const porta = await abrirPorta(req, 'leitura');
  if (!porta.ok) return falhou(porta.motivo, porta.status);

  try {
    /* Com a reserva do servidor, como na conversa: uma recusa por engano
       do Sonnet é refeita noutro modelo, na mesma chamada. */
    const r: any = await cliente.beta.messages.create({
      ...parametrosDaLeitura(pedido),
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
    } as any);
    if (r.stop_reason === 'refusal' || r.stop_reason === 'max_tokens') return falhou('sem-rede');
    const texto = r.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
    const leitura = JSON.parse(texto);
    if (typeof leitura?.semana !== 'string' || typeof leitura?.descoberta !== 'string' || typeof leitura?.teste !== 'string') return falhou('sem-rede');
    const u = r.usage;
    return responder({
      ok: true,
      leitura: { semana: leitura.semana, descoberta: leitura.descoberta, teste: leitura.teste },
      uso: { entrada: u.input_tokens, cacheLida: u.cache_read_input_tokens ?? 0, cacheEscrita: u.cache_creation_input_tokens ?? 0, saida: u.output_tokens },
    });
  } catch (err) {
    if (err instanceof Anthropic.APIError) console.error('modelo', err.status, err.message);
    else console.error('inesperado', (err as Error)?.name);
    return falhou('sem-rede');
  }
}

export default { fetch: handler };
