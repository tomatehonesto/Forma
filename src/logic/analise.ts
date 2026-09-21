import { T } from '../textos';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { alimentoDe, type ItemComida } from './prato';

/* ============================================================
   A LEITURA DA FOTO

   O aplicativo não fala com o modelo — fala com o servidor em
   `servidor/`, e é ele que tem a chave. Não dá para ser diferente: tudo
   que é empacotado aqui é extraível, e chave de API no pacote é chave
   publicada.

   Sem a URL configurada, esta função devolve 'sem-servidor' e a tela cai
   na lista manual, que é exatamente como o aplicativo se comporta hoje.
   Ligar a leitura por foto é uma variável de ambiente, não outro build.

   O QUE VOLTA

   Uma lista de itens COM QUANTAS UNIDADES, nunca um número fechado de
   proteína. Foto acerta o que está no prato e erra o quanto tem — imagem
   2D sem referência de tamanho não carrega peso.

   Mas contar unidades é uma pergunta que a foto responde melhor do que
   "a porção foi normal?": quatro colheres de arroz dá para ver, e a
   pessoa confere no contador em um toque.

   O tipo de item é o MESMO que a tela monta à mão, de propósito: o
   resultado cai direto no estado da tela, sem tradução e sem uma segunda
   forma de guardar refeição.
   ============================================================ */

const URL_ANALISE = process.env.EXPO_PUBLIC_ANALISE_URL;
const TOKEN = process.env.EXPO_PUBLIC_ANALISE_TOKEN;

/* A foto sai daqui com 1024 px de lado maior e qualidade 0,6.

   São dois limites ao mesmo tempo. O corpo da requisição tem teto de
   4,5 MB e base64 engorda em um terço o que passa por ele — foto crua de
   celular estoura. E a imagem vira token no modelo mais ou menos na
   proporção da área, então cada pixel a mais é custo por refeição, três
   vezes por dia, para sempre.

   1024 px continua mostrando o que um prato tem. Foto de comida não
   precisa de resolução, precisa de enquadramento. */
const LADO = 1024;

async function encolher(uri: string): Promise<string | null> {
  try {
    const ctx = ImageManipulator.manipulate(uri);
    ctx.resize({ width: LADO });
    const render = await ctx.renderAsync();
    const saida = await render.saveAsync({ format: SaveFormat.JPEG, compress: 0.6, base64: true });
    return saida.base64 ?? null;
  } catch {
    return null;
  }
}

export type Motivo = 'sem-servidor' | 'sem-rede' | 'nao-reconheci';

export type Analise =
  | { ok: true; itens: ItemComida[] }
  | { ok: false; motivo: Motivo };

/* Os três recados terminam do mesmo jeito — apontando para o caminho que
   funciona. Um erro que só diz que falhou deixa a pessoa parada com a
   refeição por registrar. */
/* ⚠️ É FUNÇÃO, porque lê o catálogo. Ver src/textos/README. */
export const RECADO = (): Record<Motivo, string> => ({
  'sem-servidor': T.aviso.fotoSemServidor,
  'sem-rede': T.aviso.fotoSemRede,
  'nao-reconheci': T.aviso.fotoNaoReconheci,
});

/* Quantidade que veio de fora: inteiro, pelo menos 1, no máximo 20.
   Vinte colheres de arroz já é absurdo; duzentas é erro. */
const qtdDe = (v: unknown) =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(20, Math.max(1, Math.round(v))) : 1;

/* O servidor já limpa a resposta do modelo, e mesmo assim se confere de
   novo aqui. Não é zelo: um id que não existe na tabela vira um item sem
   nome — o cartão não desenha nada, mas a linha embaixo da soma anuncia
   "não entra nessa conta" sem dizer o quê, e o registro salva um item
   fantasma. O que vem da rede vale como proposta, não como verdade. */
function limpar(bruto: unknown): ItemComida[] {
  if (!Array.isArray(bruto)) return [];
  const itens: ItemComida[] = [];
  for (const x of bruto) {
    if (!x || typeof x !== 'object') continue;
    const it = x as any;
    const qtd = qtdDe(it.qtd);
    if (typeof it.id === 'string' && alimentoDe(it.id)) itens.push({ id: it.id, qtd });
    else if (typeof it.nome === 'string' && it.nome && typeof it.base === 'number') {
      itens.push({ nome: it.nome, base: Math.max(0, Math.round(it.base)), qtd });
    }
  }
  return itens;
}

/**
 * Lê um prato a partir da foto.
 *
 * @param uri caminho da imagem (base64 no web, arquivo no aparelho).
 */
export async function analisarFoto(uri: string): Promise<Analise> {
  if (!uri) return { ok: false, motivo: 'nao-reconheci' };
  if (!URL_ANALISE) return { ok: false, motivo: 'sem-servidor' };

  const imagem = await encolher(uri);
  if (!imagem) return { ok: false, motivo: 'nao-reconheci' };

  /* Trinta segundos e desiste. O modelo costuma responder em menos de
     dez; deixar a roda girando além disso é pior do que dizer que não
     deu, porque a lista manual está ali parada esperando. */
  const corta = new AbortController();
  const relogio = setTimeout(() => corta.abort(), 30000);

  try {
    const r = await fetch(URL_ANALISE, {
      method: 'POST',
      signal: corta.signal,
      headers: {
        'content-type': 'application/json',
        ...(TOKEN ? { 'x-morphi-token': TOKEN } : {}),
      },
      body: JSON.stringify({ imagem, tipo: 'image/jpeg' }),
    });

    const corpo = await r.json().catch(() => null);
    if (!corpo || corpo.ok !== true) {
      return { ok: false, motivo: corpo?.motivo === 'sem-rede' ? 'sem-rede' : 'nao-reconheci' };
    }

    const itens = limpar(corpo.itens);
    if (!itens.length) return { ok: false, motivo: 'nao-reconheci' };
    return { ok: true, itens };
  } catch {
    return { ok: false, motivo: 'sem-rede' };
  } finally {
    clearTimeout(relogio);
  }
}
