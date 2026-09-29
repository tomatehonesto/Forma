import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import { PRATELEIRAS } from '../prateleiras.js';
import { rotuloDaPorcao } from '../rotulo.js';
import { abrirPorta } from '../cota.js';

/* ============================================================
   ESTIMAR PELO NOME

   A pessoa digitou o que comeu — "carbonara", "galinhada", "pad thai" —
   e a lista do aplicativo não tem. Antes, o item entrava anotado e sem
   conta nenhuma: o registro ficava, o número não. Quem comeu uma
   carbonara quer saber o que ela somou ao dia, mesmo que ela some pouca
   coisa de bom.

   Esta função devolve UMA PORÇÃO COMUM daquele prato, com o peso dela e
   o rótulo inteiro: proteína, energia, carboidrato, gordura e fibra. O
   aplicativo grava a estimativa marcada como estimativa — a tela diz
   isso ao lado do item —, e a pessoa ajusta quantas porções comeu.

   ⚠️ É ESTIMATIVA, E O APLICATIVO NÃO FINGE O CONTRÁRIO. Um prato varia
   de receita para receita muito mais do que um ingrediente varia de país
   para país. O número serve para o dia não ficar com um buraco, e não
   para competir com uma tabela de composição.

   ⚠️ O PESO VEM JUNTO, e é o que deixa o resto do aplicativo fazer conta
   com isto: o rótulo é convertido para 100 g aqui, e o item se comporta
   como qualquer alimento da lista — a água do prato, a energia do dia e
   a soma da semana leem o mesmo formato.

   Nada é guardado aqui. O aplicativo guarda a estimativa no próprio
   registro, e da segunda vez que a pessoa digitar "carbonara" ela sai do
   diário dela, sem rede e com o mesmo número.
   ============================================================ */

const cliente = new Anthropic();

export const Resposta = z.object({
  comida: z.boolean().describe('false se o texto não descreve algo que se come ou se bebe'),
  nome: z.string().describe('o nome do prato como se escreve no idioma pedido, com inicial maiúscula'),
  unidade: z.string().describe('a medida de UMA porção no idioma pedido, no singular: "prato", "fatia", "tigela", "unidade"'),
  unidades: z.string().describe('a mesma medida no plural'),
  gramas: z.number().describe('quanto pesa UMA porção comum, em gramas'),
  proteina: z.number().describe('gramas de proteína de UMA porção'),
  kcal: z.number().describe('quilocalorias de UMA porção'),
  carboidrato: z.number().describe('gramas de carboidrato de UMA porção'),
  gordura: z.number().describe('gramas de gordura de UMA porção'),
  fibra: z.number().describe('gramas de fibra de UMA porção'),
  prateleira: z.enum(PRATELEIRAS).describe('em que grupo este alimento cai'),
});

const IDIOMAS: Record<string, string> = {
  'pt-BR': 'português do Brasil',
  'en-US': 'inglês americano',
  'es-419': 'espanhol latino-americano',
  'fr-FR': 'francês',
  'de-DE': 'alemão',
  'it-IT': 'italiano',
};

export const INSTRUCOES = `Você estima o rótulo nutricional de um prato a partir do nome.

Quem pergunta acabou de comer isso e está registrando no diário de um
tratamento. O aplicativo mostra a sua resposta como estimativa, e a pessoa
ajusta quantas porções comeu. Um número plausível e honesto vale mais do
que um número caprichado.

REGRAS

1. Pense na versão mais comum do prato, como ele costuma ser servido em
   casa ou num restaurante comum — não na versão de dieta nem na de
   festa.

2. Os números são de UMA porção comum de um adulto, e o peso é o dessa
   mesma porção. Todos os números precisam ser coerentes entre si: a
   energia tem de bater, de perto, com 4 kcal por grama de proteína e de
   carboidrato e 9 por grama de gordura.

3. Se o nome for de um ingrediente simples (arroz, ovo, maçã), a porção
   é a porção comum daquele ingrediente, pronto para comer.

4. Escreva o nome e as medidas no idioma pedido. Corrija a grafia do
   nome, mas não troque o prato: "carbonara" é carbonara.

5. Se o texto não é comida nem bebida — um objeto, uma frase, uma
   pergunta —, responda comida: false e preencha o resto com zero.`;

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

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CABECALHOS });
  if (req.method !== 'POST') return falhou('nao-reconheci', 405);

  /* O mesmo token da leitura do prato — ver o comentário lá sobre o que
     ele vale e o que não vale. */
  const esperado = process.env.MORPHI_TOKEN;
  if (esperado && req.headers.get('x-morphi-token') !== esperado) {
    return falhou('nao-reconheci', 401);
  }

  let nome: string;
  let idioma: string;
  try {
    const corpo = (await req.json()) as { nome?: string; idioma?: string };
    nome = (corpo.nome ?? '').trim().slice(0, 120);
    idioma = IDIOMAS[corpo.idioma ?? ''] ? (corpo.idioma as string) : 'pt-BR';
    if (nome.length < 2) return falhou('nao-reconheci', 400);
  } catch {
    return falhou('nao-reconheci', 400);
  }

  /* A porta: a sessão de quem chama e o teto do dia — ver servidor/cota.
     Depois de conferir o pedido, para um pedido malformado não gastar a
     cota, e antes do modelo, que é o que custa. */
  const porta = await abrirPorta(req, 'estimativa');
  if (!porta.ok) return falhou(porta.motivo, porta.status);

  try {
    const r = await cliente.messages.parse({
      model: 'claude-opus-5',
      max_tokens: 2000,
      system: [{ type: 'text', text: INSTRUCOES, cache_control: { type: 'ephemeral' } }],
      messages: [
        {
          role: 'user',
          content: `Idioma: ${IDIOMAS[idioma]}\nO que a pessoa comeu: ${nome}`,
        },
      ],
      output_config: {
        format: zodOutputFormat(Resposta),
        /* É conhecimento, e não raciocínio longo: o modelo sabe o que é
           uma carbonara. 'low' deixa a resposta rápida, e a pessoa está
           com o registro aberto esperando. */
        effort: 'low',
      },
    });

    const e = r.parsed_output;
    if (!e || !e.comida) return falhou('nao-reconheci');
    const rotulo = rotuloDaPorcao(e);
    return rotulo ? responder({ ok: true, rotulo }) : falhou('nao-reconheci');
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error('modelo', err.status, err.message);
      return falhou(err.status === 429 || (err.status ?? 500) >= 500 ? 'sem-rede' : 'nao-reconheci');
    }
    console.error('inesperado', err);
    return falhou('sem-rede');
  }
}
