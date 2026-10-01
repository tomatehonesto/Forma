import Anthropic from '@anthropic-ai/sdk';
import { abrirPorta } from '../cota.js';
import { INSTRUCOES, blocoDaPessoa } from '../conversa/prompt.js';

/* ============================================================
   A CONVERSA DO MORPHI INTELLIGENCE

   A pessoa pergunta, e o aplicativo manda junto um resumo dos registros
   dela (src/logic/resumoDaJornada) e as últimas trocas da conversa. A
   resposta sai do modelo com as regras e a base de conhecimento de
   servidor/conversa — ver a especificação,
   docs/superpowers/specs/2026-09-29-morphi-intelligence-design.md.

   ⚠️ NADA É GUARDADO AQUI. Nem a pergunta, nem o resumo, nem a
   resposta: a conversa mora no aparelho. O log só registra o erro, e
   nunca o conteúdo — é dado de saúde.

   ⚠️ OS TETOS DE TAMANHO VÊM ANTES DA PORTA, e a porta vem antes do
   modelo: um pedido malformado não gasta a cota de ninguém, e nada
   chega ao modelo sem sessão e sem caber no dia.
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

/** Os tetos do pedido. O resumo do aplicativo mira bem abaixo do teto
    dele; o teto existe para ninguém mandar um livro pela porta. */
export const TETOS = {
  pergunta: 1000,
  resumo: 24000,
  trocas: 20,
  mensagem: 4000,
};

type Quem = 'eu' | 'morphi';
export type Troca = { quem: Quem; texto: string };

/* O histórico vira as mensagens da API, que pedem começar pela pessoa e
   alternar os papéis. Duas falas seguidas do mesmo lado se juntam; uma
   fala do Morphi no começo cai (sem a pergunta que a originou, ela
   ensinaria o modelo a responder ninguém). */
export function mensagensDe(historico: Troca[], pergunta: string): Anthropic.MessageParam[] {
  const fora: Anthropic.MessageParam[] = [];
  for (const t of [...historico, { quem: 'eu' as Quem, texto: pergunta }]) {
    const role = t.quem === 'eu' ? 'user' : 'assistant';
    if (!fora.length && role === 'assistant') continue;
    const ultima = fora[fora.length - 1];
    if (ultima && ultima.role === role) ultima.content = `${ultima.content}\n\n${t.texto}`;
    else fora.push({ role, content: t.texto });
  }
  return fora;
}

/** Confere o corpo do pedido. Devolve null quando não serve. */
export function lerPedido(corpo: any): { pergunta: string; historico: Troca[]; resumo: string; idioma: string } | null {
  if (!corpo || typeof corpo !== 'object') return null;
  const pergunta = typeof corpo.pergunta === 'string' ? corpo.pergunta.trim() : '';
  if (pergunta.length < 1 || pergunta.length > TETOS.pergunta) return null;
  const resumo = typeof corpo.resumo === 'string' ? corpo.resumo : '';
  if (resumo.length > TETOS.resumo) return null;
  const bruto = Array.isArray(corpo.historico) ? corpo.historico : [];
  if (bruto.length > TETOS.trocas) return null;
  const historico: Troca[] = [];
  for (const t of bruto) {
    if (!t || (t.quem !== 'eu' && t.quem !== 'morphi') || typeof t.texto !== 'string') return null;
    if (t.texto.length > TETOS.mensagem) return null;
    if (t.texto.trim()) historico.push({ quem: t.quem, texto: t.texto });
  }
  const idioma = IDIOMAS[corpo.idioma] ? corpo.idioma : 'pt-BR';
  return { pergunta, historico, resumo, idioma };
}

/** O pedido ao modelo, montado num lugar só: o handler e a avaliação
    (scripts/avaliacao) chamam esta função, e por isso a avaliação mede a
    mesma coisa que vai para a pessoa — modelo, regras, resumo e histórico. */
export function parametrosDaConversa(pedido: NonNullable<ReturnType<typeof lerPedido>>): Anthropic.MessageStreamParams {
  return {
    model: 'claude-opus-5',
    max_tokens: 2000,
    system: [
      { type: 'text', text: INSTRUCOES, cache_control: { type: 'ephemeral' } },
      { type: 'text', text: blocoDaPessoa(IDIOMAS[pedido.idioma], pedido.resumo) },
    ],
    messages: mensagensDe(pedido.historico, pedido.pergunta),
    /* Conversa, e não raciocínio longo: a pessoa está com a tela
       aberta esperando. Sobe se a medição de qualidade pedir. */
    output_config: { effort: 'low' },
  };
}

const CABECALHOS = {
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type, authorization, x-morphi-token',
  'access-control-allow-methods': 'POST, OPTIONS',
};

const responder = (corpo: unknown, status = 200) =>
  new Response(JSON.stringify(corpo), { status, headers: CABECALHOS });

const falhou = (motivo: 'sem-rede' | 'nao-reconheci' | 'sem-conta' | 'limite', status = 200) =>
  responder({ ok: false, motivo }, status);

async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CABECALHOS });
  if (req.method !== 'POST') return falhou('nao-reconheci', 405);

  const esperado = process.env.MORPHI_TOKEN;
  if (esperado && req.headers.get('x-morphi-token') !== esperado) {
    return falhou('nao-reconheci', 401);
  }

  let pedido: ReturnType<typeof lerPedido>;
  try {
    pedido = lerPedido(await req.json());
  } catch {
    pedido = null;
  }
  if (!pedido) return falhou('nao-reconheci', 400);

  const porta = await abrirPorta(req, 'conversa');
  if (!porta.ok) return falhou(porta.motivo, porta.status);
  const restam = porta.restam;

  /* ⚠️ A RESPOSTA VAI EM PEDAÇOS (30/09/2026). Antes ela chegava inteira,
     depois de quatro ou cinco segundos de "pensando"; agora cada trecho
     que o modelo escreve sai na hora, e o aplicativo mostra o texto
     crescendo. Um efeito de digitação sobre a resposta pronta somaria
     espera à espera — este é o de verdade.

     O formato é uma linha de JSON por evento (NDJSON):
       {"t":"texto","v":"..."}   um trecho
       {"t":"fim","uso":{...}}   acabou, com os tokens (só números)
       {"t":"erro","motivo":"sem-rede"}
     Os erros de ANTES do modelo (pedido malformado, porta fechada)
     continuam como JSON comum, com o status HTTP deles: o aplicativo
     distingue pelo content-type. */
  const cod = new TextEncoder();
  const linha = (o: unknown) => cod.encode(`${JSON.stringify(o)}\n`);
  const pedidoOk = pedido;
  const corpo = new ReadableStream<Uint8Array>({
    async start(ctl) {
      let escreveu = false;
      try {
        const fluxo = cliente.messages.stream(parametrosDaConversa(pedidoOk));
        fluxo.on('text', (trecho) => {
          if (!trecho) return;
          escreveu = true;
          ctl.enqueue(linha({ t: 'texto', v: trecho }));
        });
        const final = await fluxo.finalMessage();
        if (!escreveu) {
          ctl.enqueue(linha({ t: 'erro', motivo: 'sem-rede' }));
        } else {
          const u = final.usage;
          ctl.enqueue(linha({
            t: 'fim',
            /* Quantas perguntas ainda cabem hoje: o aplicativo avisa quando
               faltam poucas, em vez de a pessoa descobrir no limite. */
            ...(typeof restam === 'number' ? { restam } : {}),
            uso: {
              entrada: u.input_tokens,
              cacheLida: u.cache_read_input_tokens ?? 0,
              cacheEscrita: u.cache_creation_input_tokens ?? 0,
              saida: u.output_tokens,
            },
          }));
        }
      } catch (err) {
        if (err instanceof Anthropic.APIError) console.error('modelo', err.status, err.message);
        else console.error('inesperado', (err as Error)?.name);
        ctl.enqueue(linha({ t: 'erro', motivo: 'sem-rede' }));
      } finally {
        ctl.close();
      }
    },
  });

  return new Response(corpo, {
    status: 200,
    headers: {
      ...CABECALHOS,
      'content-type': 'application/x-ndjson; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      'x-accel-buffering': 'no',
    },
  });
}

export default { fetch: handler };
