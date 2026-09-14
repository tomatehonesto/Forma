import { type ItemComida } from './prato';

/* ============================================================
   A LEITURA DA FOTO — o contrato

   Uma função só, e é ela que a fase 3 vai preencher. Hoje devolve
   `sem-servidor` porque o app não fala com servidor nenhum: não há um
   único fetch no projeto inteiro, e chave de API não pode ir no bundle
   (tudo que é empacotado é extraível). Então o caminho da foto existe
   inteiro daqui até a tela, e para no lugar certo.

   O QUE A FOTO PODE RESPONDER

   Uma foto acerta o que está no prato e erra o quanto tem. Não é
   limitação de modelo, é limitação física: imagem 2D sem referência de
   tamanho não carrega peso, e o mesmo arroz vai de 80 a 250 g conforme o
   ângulo e o tamanho do prato.

   Por isso o retorno é uma lista de itens COM PORÇÃO SUGERIDA, e não um
   número fechado de proteína. O analisador chuta 'normal' e a pessoa
   corrige em um toque — que é a pergunta que ela sabe responder. Um
   número único e fechado seria a mesma falsa precisão que as faixas de
   30/18/8 tinham, só que com mais cara de tecnologia.

   O tipo de item é o MESMO que a tela monta à mão (ItemComida), de
   propósito: o resultado da análise cai direto no estado da tela sem
   tradução, e sem uma segunda forma de guardar refeição.
   ============================================================ */

export type Motivo = 'sem-servidor' | 'sem-rede' | 'nao-reconheci';

export type Analise =
  | { ok: true; itens: ItemComida[] }
  | { ok: false; motivo: Motivo };

/* Os três recados terminam do mesmo jeito — apontando para o caminho que
   funciona. Um erro que só diz que falhou deixa a pessoa parada com a
   refeição por registrar. */
export const RECADO: Record<Motivo, string> = {
  'sem-servidor': 'A leitura por foto ainda não está ligada. Dá para montar o prato aqui embaixo.',
  'sem-rede': 'Sem conexão para ler a foto agora. Dá para montar o prato aqui embaixo.',
  'nao-reconheci': 'Não consegui reconhecer o prato. Monte aqui embaixo o que tinha.',
};

/**
 * Lê um prato a partir da foto.
 *
 * @param uri caminho da imagem (base64 no web, arquivo no aparelho).
 */
export async function analisarFoto(uri: string): Promise<Analise> {
  if (!uri) return { ok: false, motivo: 'nao-reconheci' };
  return { ok: false, motivo: 'sem-servidor' };
}
