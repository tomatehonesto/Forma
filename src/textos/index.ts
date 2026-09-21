import { ciclo as cicloPt } from './pt-BR/ciclo';
import { cruzamentos as cruzamentosPt } from './pt-BR/cruzamentos';
import { cuidado as cuidadoPt } from './pt-BR/cuidado';
import { equilibrio as equilibrioPt } from './pt-BR/equilibrio';
import { etapa as etapaPt } from './pt-BR/etapa';
import { marcadores as marcadoresPt } from './pt-BR/marcadores';
import { metas as metasPt } from './pt-BR/metas';
import { tratamento as tratamentoPt } from './pt-BR/tratamento';

/* ============================================================
   O CATÁLOGO — como o código chega no texto

   ⚠️⚠️ O IDIOMA É UM VALOR DE MÓDULO, e não um parâmetro que atravessa o
   aplicativo.

   A alternativa seria enfiar o idioma em toda função que produz texto,
   como acabou de acontecer com as unidades: `S` teve de entrar em quatro
   tabelas constantes e em oito assinaturas de callback, e aquilo eram
   quatro grandezas. Aqui são mil e quinhentas frases — a mesma solução
   custaria mil e quinhentos sítios de chamada, duas vezes: uma agora e
   outra quando o segundo idioma chegasse.

   Com um valor de módulo, o sítio de chamada é `T.etapa.platoHead` hoje e
   `T.etapa.platoHead` depois do inglês. Nada muda.

   ⚠️ E A TROCA DE IDIOMA REMONTA A ÁRVORE, a partir do layout raiz. O
   React não sabe que este valor mudou — ele não está no estado dele —, e
   uma tela já desenhada continuaria em português. Remontar é o resultado
   certo para uma operação que acontece uma vez na vida do aplicativo, e é
   uma linha: uma `key` no topo.

   ⚠️ POR ENQUANTO SÓ EXISTE PORTUGUÊS, e é de propósito. Esta peça TIRA o
   texto do código; ela não traduz nada. Misturar as duas coisas faria o
   diff da extração carregar mudanças de sentido, e aí não haveria como
   dizer se o aplicativo continuou falando a mesma coisa.

   A rede que garante isso é `scripts/congelar.ts` — ver o README daqui.
   ============================================================ */

export type Idioma = 'pt-BR';

/* Tipos que descrevem a FORMA de um texto, e não de um dado — por isso
   moram no catálogo e saem por aqui. Ver textos/pt-BR/marcadores. */
export type { SobreOMarcador, JeitoDeAjudar } from './pt-BR/marcadores';

/* ⚠️ O CONTRATO SAI DO PORTUGUÊS, e não de uma interface escrita à mão.

   `typeof` sobre o catálogo em português dá, de graça, a assinatura exata
   de cada mensagem — nome, número de parâmetros e tipo de cada um. Quando
   o inglês chegar, ele terá de satisfazer este tipo, e o `tsc` acusa a
   mensagem que faltou e o parâmetro que mudou de forma.

   É a garantia que nenhum arquivo de JSON dá: lá, uma chave esquecida só
   aparece como texto faltando na tela de alguém. */
export type Textos = {
  ciclo: typeof cicloPt;
  cruzamentos: typeof cruzamentosPt;
  cuidado: typeof cuidadoPt;
  equilibrio: typeof equilibrioPt;
  etapa: typeof etapaPt;
  marcadores: typeof marcadoresPt;
  metas: typeof metasPt;
  tratamento: typeof tratamentoPt;
};

const CATALOGOS: Record<Idioma, Textos> = {
  'pt-BR': {
    ciclo: cicloPt, cruzamentos: cruzamentosPt, cuidado: cuidadoPt,
    equilibrio: equilibrioPt, etapa: etapaPt,
    marcadores: marcadoresPt, metas: metasPt, tratamento: tratamentoPt,
  },
};

let atual: Idioma = 'pt-BR';

export const idiomaAtual = () => atual;
export const trocarIdioma = (i: Idioma) => { atual = i; };

/* ⚠️ É UM PROXY, e não o objeto direto: o catálogo precisa ser resolvido
   na hora da LEITURA, e não na hora do import. Exportar
   `CATALOGOS[atual]` congelaria o português no primeiro módulo que
   importasse este arquivo, e a troca de idioma não teria efeito nenhum.

   Uma propriedade por domínio é barato — são poucas dezenas —, e o custo
   por leitura é um acesso a objeto. */
export const T = new Proxy({} as Textos, {
  get: (_alvo, chave: string) => (CATALOGOS[atual] as any)[chave],
});
