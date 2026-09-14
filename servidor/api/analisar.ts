import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import ALIMENTOS from '../alimentos.json' with { type: 'json' };

/* ============================================================
   LER O PRATO

   A única razão deste servidor existir é a chave da API: tudo que é
   empacotado no aplicativo é extraível, então a chamada ao modelo tem
   que sair de algum lugar que a pessoa não consiga abrir. Fora isso ele
   não guarda nada, não sabe quem está do outro lado e não tem banco.

   O QUE ELE DEVOLVE, E POR QUÊ

   Uma lista de itens com porção sugerida — nunca um número fechado de
   proteína. Foto acerta o QUE está no prato e erra o QUANTO tem: imagem
   2D sem referência de tamanho não carrega peso, e o mesmo arroz vai de
   80 a 250 g conforme o ângulo e o tamanho do prato. Devolver "48 g" com
   duas casas seria a mesma falsa precisão que o aplicativo passou meses
   tirando de si mesmo, só que com mais cara de tecnologia.

   Então o modelo faz a parte que a foto responde (o que é isso) e chuta
   'normal' na porção; quem comeu corrige em um toque, que é a pergunta
   que ela sabe responder.

   A TABELA VAI NO PROMPT

   Sem ela o modelo devolve nomes soltos, nada casa com a tabela do
   aplicativo, e todo item viraria "estimado pela foto" — perdendo a
   procedência da TACO, que é metade do motivo de tudo isso. Ela é a
   parte estável do prompt, então é ela que o cache paga barato.
   ============================================================ */

const cliente = new Anthropic();

const Item = z.object({
  id: z.string().nullable().describe('id da TABELA, quando o prato está lá'),
  nome: z.string().nullable().describe('nome em português, só quando não há id'),
  base: z.number().nullable().describe('gramas de proteína de uma porção normal, só quando não há id'),
  porcao: z.enum(['pouca', 'normal', 'bastante']),
});
export const Resposta = z.object({ itens: z.array(Item) });

const TABELA = (ALIMENTOS as { id: string; nome: string; medida: string }[])
  .map((a) => `${a.id} | ${a.nome} | porção normal: ${a.medida}`)
  .join('\n');

export const INSTRUCOES = `Você lê fotos de refeições e devolve o que está no prato.

O aplicativo soma a proteína do dia a partir da sua resposta, e quem
fotografou vai conferir a lista antes de salvar. Acertar o que dá para
ver vale mais do que preencher o prato com suposição.

REGRAS

1. Liste só o que aparece na foto. Não complete com o que costuma vir
   junto: se não há arroz na imagem, não existe arroz.

2. Para cada coisa, procure primeiro na TABELA. Se achar, devolva o id e
   deixe nome e base nulos — os números daquele alimento já estão no
   aplicativo, e vêm de tabela oficial.

3. Se nada na TABELA corresponde, devolva nome (em português, como se
   fala: "Escondidinho de carne seca") e base, que são as gramas de
   PROTEÍNA de uma porção normal desse prato. Deixe id nulo.

4. porcao compara o que está na foto com a porção normal descrita na
   TABELA — ou com uma porção normal do prato, nos itens livres. Na
   dúvida, 'normal'.

5. Junte o que é um prato só: feijoada é feijoada, não é feijão mais
   carne seca mais paio. Mas arroz e feijão servidos lado a lado são
   dois itens.

6. Ignore tempero, molho, azeite, café, água e refrigerante: não movem
   proteína e poluem a lista que a pessoa vai conferir.

7. Se a foto não mostra comida, devolva a lista vazia.

TABELA
${TABELA}`;

const TIPOS_OK = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;
type TipoOk = (typeof TIPOS_OK)[number];

const CABECALHOS = {
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type, x-morphi-token',
  'access-control-allow-methods': 'POST, OPTIONS',
};

const responder = (corpo: unknown, status = 200) =>
  new Response(JSON.stringify(corpo), { status, headers: CABECALHOS });

/* Os motivos são os mesmos que o aplicativo já sabe mostrar. Qualquer
   falha vira um recado que aponta para a lista manual — errar calado
   deixaria a pessoa esperando por uma refeição que nunca entra. */
const falhou = (motivo: 'sem-rede' | 'nao-reconheci', status = 200) =>
  responder({ ok: false, motivo }, status);

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CABECALHOS });
  if (req.method !== 'POST') return falhou('nao-reconheci', 405);

  /* Um token compartilhado, e é bom ser exato sobre o que ele vale: o
     aplicativo carrega esse valor no pacote, então quem abrir o pacote o
     encontra. Ele impede que a URL vazada em um log vire conta aberta —
     não impede alguém decidido. Proteção de verdade só chega junto com
     conta de usuário. */
  const esperado = process.env.MORPHI_TOKEN;
  if (esperado && req.headers.get('x-morphi-token') !== esperado) {
    return falhou('nao-reconheci', 401);
  }

  let imagem: string;
  let tipo: TipoOk;
  try {
    const corpo = (await req.json()) as { imagem?: string; tipo?: string };
    if (!corpo.imagem) return falhou('nao-reconheci', 400);
    imagem = corpo.imagem.replace(/^data:[^;]+;base64,/, '');
    tipo = (TIPOS_OK as readonly string[]).includes(corpo.tipo || '')
      ? (corpo.tipo as TipoOk)
      : 'image/jpeg';
  } catch {
    return falhou('nao-reconheci', 400);
  }

  try {
    const r = await cliente.messages.parse({
      model: 'claude-opus-5',
      max_tokens: 4000,
      system: [{ type: 'text', text: INSTRUCOES, cache_control: { type: 'ephemeral' } }],
      /* A tabela e as regras não mudam entre uma foto e outra, e são a
         maior parte do prompt. Com o breakpoint aqui, a partir da segunda
         leitura só a imagem é cobrada cheia. */
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: tipo, data: imagem } },
            { type: 'text', text: 'O que tem neste prato?' },
          ],
        },
      ],
      output_config: {
        format: zodOutputFormat(Resposta),
        /* Reconhecer comida e casar com uma lista de 124 é tarefa de
           percepção, não de raciocínio longo — e tem alguém olhando para
           uma roda girando enquanto isso. 'medium' é o meio-termo entre a
           espera e a qualidade do casamento; é uma palavra para trocar se
           a medição disser outra coisa. */
        effort: 'medium',
      },
    });

    const bruto = r.parsed_output?.itens ?? [];
    const conhecidos = new Set((ALIMENTOS as { id: string }[]).map((a) => a.id));

    /* O modelo pode inventar um id que não existe. Se isso passar, o
       aplicativo mostra um item sem nome e sem número — pior do que não
       ter achado. Então id desconhecido perde o id e vira item livre,
       quando ele mandou nome e base; senão o item cai fora. */
    const itens = bruto
      .map((it) => {
        if (it.id && conhecidos.has(it.id)) return { id: it.id, porcao: it.porcao };
        if (it.nome && it.base != null && it.base >= 0) {
          return { nome: it.nome, base: Math.round(it.base), porcao: it.porcao };
        }
        return null;
      })
      .filter(Boolean);

    if (!itens.length) return falhou('nao-reconheci');
    return responder({ ok: true, itens });
  } catch (e) {
    if (e instanceof Anthropic.APIError) {
      console.error('modelo', e.status, e.message);
      /* 400/401/403 são problema de configuração daqui, e não da foto —
         mas para quem está do outro lado o efeito é o mesmo: não deu, e a
         lista manual está logo abaixo. */
      return falhou(e.status === 429 || (e.status ?? 500) >= 500 ? 'sem-rede' : 'nao-reconheci');
    }
    console.error('inesperado', e);
    return falhou('sem-rede');
  }
}
