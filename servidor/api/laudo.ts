import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import { MARCADORES, CHAVES } from '../marcadores.js';

/* ============================================================
   LER O LAUDO

   A mesma razão de existir da leitura do prato (api/analisar): a chave da
   API não pode ir no aplicativo. E o mesmo contrato de não guardar nada —
   o laudo chega, é lido e é esquecido. Aqui isso pesa mais: um laudo é
   dado de saúde sensível, e o aplicativo pede um aceite próprio antes de
   mandar o primeiro (ver src/logic/laudo e a Política, seção 4).

   O QUE ELE DEVOLVE, E POR QUÊ

   Os resultados COMO ESTÃO ESCRITOS NO LAUDO: o valor, a unidade e a
   faixa que o laboratório imprimiu, e a data da coleta. Nenhuma
   conversão, nenhuma interpretação, nenhum "está alto". Quem lê o valor
   contra a faixa é o aplicativo, com a regra que ele já usa para os
   exames anotados à mão — e quem confere tudo contra o papel, antes de
   salvar, é a pessoa.

   O que não é um dos quinze marcadores que o aplicativo acompanha vem
   com `marcador` nulo e o nome como está no laudo: o aplicativo mostra
   que viu, e não grava.
   ============================================================ */

const cliente = new Anthropic();

const Resultado = z.object({
  marcador: z.enum(CHAVES as [string, ...string[]]).nullable()
    .describe('a chave da LISTA, quando o resultado é um dos marcadores dela; senão nulo'),
  nome_no_laudo: z.string().describe('o nome do exame como está escrito no laudo'),
  valor: z.number().nullable().describe('o número do resultado, como impresso; nulo se não for numérico'),
  unidade: z.string().nullable().describe('a unidade, escrita como na LISTA quando for uma delas'),
  referencia: z.string().nullable()
    .describe('a faixa de referência do laudo, só os números e o sinal: "< 5,7", "70–99", "> 40"'),
});
export const Resposta = z.object({
  coleta: z.string().nullable().describe('a data da coleta no formato AAAA-MM-DD; nulo se não estiver no laudo'),
  resultados: z.array(Resultado),
});

const LISTA = CHAVES
  .map((k) => `${k} | unidades: ${MARCADORES[k].unidades.join(', ')} | aparece como: ${MARCADORES[k].nomes}`)
  .join('\n');

export const INSTRUCOES = `Você lê laudos de exames de laboratório e devolve os resultados.

Quem enviou vai conferir cada linha contra o papel antes de salvar. Um
resultado lido errado e salvo vira um número falso no acompanhamento do
tratamento de alguém — deixar de ler é melhor do que ler errado.

REGRAS

1. Devolva o que está impresso. Não converta unidade, não arredonde, não
   calcule nada e não diga se o resultado está bom ou ruim.

2. Para cada resultado, procure o marcador na LISTA, pelo nome ou pelos
   nomes ao lado. Achou: devolva a chave em "marcador". Não achou: deixe
   "marcador" nulo e devolva o nome como está no laudo.

3. Na unidade, se ela for uma das da LISTA para aquele marcador, escreva
   exatamente como na LISTA ("mg/dl" vira "mg/dL", "mU/L" vira "mUI/L",
   "µIU/mL" vira "µUI/mL"). Se não for nenhuma delas, escreva como está.

4. Na referência, devolva só a faixa numérica que o laboratório
   imprimiu: "70–99", "< 5,7", "> 40". Se houver várias faixas (por
   idade, sexo ou jejum), use a que o laudo aplica a esta pessoa; se não
   der para saber, deixe nula. Não invente uma faixa que não está lá.

5. Se o mesmo marcador aparece mais de uma vez (resultado atual e
   anteriores), devolva só o resultado atual, o desta coleta.

6. A data é a da COLETA, e não a da emissão ou da impressão do laudo.

7. Se o arquivo não é um laudo de exame, devolva a lista vazia.

LISTA
${LISTA}`;

const TIPOS_OK = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'] as const;
type TipoOk = (typeof TIPOS_OK)[number];

/* O corpo da requisição tem teto de 4,5 MB na Vercel, e o base64 engorda
   um terço: um PDF de até uns 3 MB passa. O aplicativo confere antes de
   mandar; isto é a segunda porta. */
const MAX_BASE64 = 4_300_000;

const CABECALHOS = {
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type, x-morphi-token',
  'access-control-allow-methods': 'POST, OPTIONS',
};

const responder = (corpo: unknown, status = 200) =>
  new Response(JSON.stringify(corpo), { status, headers: CABECALHOS });

const falhou = (motivo: 'sem-rede' | 'nao-reconheci' | 'grande', status = 200) =>
  responder({ ok: false, motivo }, status);

const DATA = /^\d{4}-\d{2}-\d{2}$/;
const curto = (s: unknown, max: number) =>
  typeof s === 'string' && s.trim() ? s.trim().slice(0, max) : null;

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CABECALHOS });
  if (req.method !== 'POST') return falhou('nao-reconheci', 405);

  /* O mesmo token da leitura do prato, com o mesmo alcance: impede que a
     URL vazada num log vire conta aberta, e não mais que isso. */
  const esperado = process.env.MORPHI_TOKEN;
  if (esperado && req.headers.get('x-morphi-token') !== esperado) {
    return falhou('nao-reconheci', 401);
  }

  let arquivo: string;
  let tipo: TipoOk;
  try {
    const corpo = (await req.json()) as { arquivo?: string; tipo?: string };
    if (!corpo.arquivo || !(TIPOS_OK as readonly string[]).includes(corpo.tipo || '')) {
      return falhou('nao-reconheci', 400);
    }
    arquivo = corpo.arquivo.replace(/^data:[^;]+;base64,/, '');
    tipo = corpo.tipo as TipoOk;
    if (arquivo.length > MAX_BASE64) return falhou('grande', 413);
  } catch {
    return falhou('nao-reconheci', 400);
  }

  try {
    const bloco = tipo === 'application/pdf'
      ? { type: 'document' as const, source: { type: 'base64' as const, media_type: 'application/pdf' as const, data: arquivo } }
      : { type: 'image' as const, source: { type: 'base64' as const, media_type: tipo, data: arquivo } };

    const r = await cliente.messages.parse({
      model: 'claude-opus-5',
      max_tokens: 4000,
      system: [{ type: 'text', text: INSTRUCOES, cache_control: { type: 'ephemeral' } }],
      messages: [
        {
          role: 'user',
          content: [bloco, { type: 'text', text: 'Quais resultados estão neste laudo?' }],
        },
      ],
      output_config: {
        format: zodOutputFormat(Resposta),
        /* Ler um laudo é transcrever uma tabela com cuidado — mais atenção
           do que o prato, porque um dígito errado é um número falso. */
        effort: 'high',
      },
    });

    const bruto = r.parsed_output;
    if (!bruto) return falhou('nao-reconheci');

    /* O que vem do modelo é proposta: número tem de ser número, a chave
       tem de estar na lista e a data tem de ser data. O aplicativo
       confere de novo do lado dele. */
    const resultados = bruto.resultados
      .map((x) => ({
        marcador: x.marcador && (CHAVES as string[]).includes(x.marcador) ? x.marcador : null,
        nome_no_laudo: curto(x.nome_no_laudo, 80) ?? '',
        valor: typeof x.valor === 'number' && Number.isFinite(x.valor) && x.valor >= 0 ? x.valor : null,
        unidade: curto(x.unidade, 20),
        referencia: curto(x.referencia, 40),
      }))
      .filter((x) => x.nome_no_laudo || x.marcador);

    if (!resultados.length) return falhou('nao-reconheci');
    const coleta = bruto.coleta && DATA.test(bruto.coleta) ? bruto.coleta : null;
    return responder({ ok: true, coleta, resultados });
  } catch (e) {
    if (e instanceof Anthropic.APIError) {
      console.error('modelo', e.status, e.message);
      return falhou(e.status === 429 || (e.status ?? 500) >= 500 ? 'sem-rede' : 'nao-reconheci');
    }
    console.error('inesperado', e);
    return falhou('sem-rede');
  }
}
