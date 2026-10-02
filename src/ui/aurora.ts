import { useStore } from '../logic/store';

/* ============================================================
   A AURORA DA PALETA

   O gradiente de fundo é IMAGEM, e imagem não segue token de cor: uma
   paleta que trocasse botão, selo e painel deixaria intacta a maior
   superfície colorida do aplicativo — o hero da Home, o Insights, o
   check-in concluído, o companion e as metas.

   Então existem nove arquivos por paleta, gerados antes da compilação
   por scripts/gerar-aurora.mjs a partir dos nove originais.

   ⚠️ E O MAPA É ESCRITO À MÃO PORQUE PRECISA SER. O empacotador resolve
   cada `require` em tempo de compilação: um caminho montado com variável
   simplesmente não existe no pacote. Gerar este arquivo seria possível,
   mas ele muda uma vez por paleta nova — e um mapa que se lê é melhor do
   que um gerador que se esquece de rodar.
   ============================================================ */

/* ⚠️ AS AURORAS DE CADA TELA (27/09/2026, enviadas pelo dono). A Home
   tinha a dela e todo o resto repetia a mesma; agora cada tela que abre
   sobre uma aurora escolhe a sua pelo nome — ver quem usa `useAurora`. E
   todas giram com a paleta, como as duas primeiras: a conta também, que
   termina no branco (claro) ou no preto (escuro), e o giro não mexe neles. */
type Aurora = {
  /** a Home, a Aparência e o Insights */
  hero: number;
  /** a das metas, com o orbe desenhado */
  insights: number;
  /** o cadastro */
  onda: number;
  /** o check-in concluído */
  corrente: number;
  /** a conquista */
  raio: number;
  /** os planos */
  nuvem: number;
  /** as capas de Exames e Protocolos */
  veu: number;
  /** a capa da conta, nos dois temas */
  contaClaro: number;
  contaEscuro: number;
};

const AURORAS: Record<string, Aurora> = {
  'original': {
    hero: require('../../assets/auroras/hero-original.webp'),
    insights: require('../../assets/auroras/insights-original.webp'),
    onda: require('../../assets/auroras/onda-original.webp'),
    corrente: require('../../assets/auroras/corrente-original.webp'),
    raio: require('../../assets/auroras/raio-original.webp'),
    nuvem: require('../../assets/auroras/nuvem-original.webp'),
    veu: require('../../assets/auroras/veu-original.webp'),
    contaClaro: require('../../assets/auroras/conta-claro-original.webp'),
    contaEscuro: require('../../assets/auroras/conta-escuro-original.webp'),
  },
  'amora': {
    hero: require('../../assets/auroras/hero-amora.webp'),
    insights: require('../../assets/auroras/insights-amora.webp'),
    onda: require('../../assets/auroras/onda-amora.webp'),
    corrente: require('../../assets/auroras/corrente-amora.webp'),
    raio: require('../../assets/auroras/raio-amora.webp'),
    nuvem: require('../../assets/auroras/nuvem-amora.webp'),
    veu: require('../../assets/auroras/veu-amora.webp'),
    contaClaro: require('../../assets/auroras/conta-claro-amora.webp'),
    contaEscuro: require('../../assets/auroras/conta-escuro-amora.webp'),
  },
  'vinho': {
    hero: require('../../assets/auroras/hero-vinho.webp'),
    insights: require('../../assets/auroras/insights-vinho.webp'),
    onda: require('../../assets/auroras/onda-vinho.webp'),
    corrente: require('../../assets/auroras/corrente-vinho.webp'),
    raio: require('../../assets/auroras/raio-vinho.webp'),
    nuvem: require('../../assets/auroras/nuvem-vinho.webp'),
    veu: require('../../assets/auroras/veu-vinho.webp'),
    contaClaro: require('../../assets/auroras/conta-claro-vinho.webp'),
    contaEscuro: require('../../assets/auroras/conta-escuro-vinho.webp'),
  },
  'telha': {
    hero: require('../../assets/auroras/hero-telha.webp'),
    insights: require('../../assets/auroras/insights-telha.webp'),
    onda: require('../../assets/auroras/onda-telha.webp'),
    corrente: require('../../assets/auroras/corrente-telha.webp'),
    raio: require('../../assets/auroras/raio-telha.webp'),
    nuvem: require('../../assets/auroras/nuvem-telha.webp'),
    veu: require('../../assets/auroras/veu-telha.webp'),
    contaClaro: require('../../assets/auroras/conta-claro-telha.webp'),
    contaEscuro: require('../../assets/auroras/conta-escuro-telha.webp'),
  },
  'oliva': {
    hero: require('../../assets/auroras/hero-oliva.webp'),
    insights: require('../../assets/auroras/insights-oliva.webp'),
    onda: require('../../assets/auroras/onda-oliva.webp'),
    corrente: require('../../assets/auroras/corrente-oliva.webp'),
    raio: require('../../assets/auroras/raio-oliva.webp'),
    nuvem: require('../../assets/auroras/nuvem-oliva.webp'),
    veu: require('../../assets/auroras/veu-oliva.webp'),
    contaClaro: require('../../assets/auroras/conta-claro-oliva.webp'),
    contaEscuro: require('../../assets/auroras/conta-escuro-oliva.webp'),
  },
  'floresta': {
    hero: require('../../assets/auroras/hero-floresta.webp'),
    insights: require('../../assets/auroras/insights-floresta.webp'),
    onda: require('../../assets/auroras/onda-floresta.webp'),
    corrente: require('../../assets/auroras/corrente-floresta.webp'),
    raio: require('../../assets/auroras/raio-floresta.webp'),
    nuvem: require('../../assets/auroras/nuvem-floresta.webp'),
    veu: require('../../assets/auroras/veu-floresta.webp'),
    contaClaro: require('../../assets/auroras/conta-claro-floresta.webp'),
    contaEscuro: require('../../assets/auroras/conta-escuro-floresta.webp'),
  },
  'oceano': {
    hero: require('../../assets/auroras/hero-oceano.webp'),
    insights: require('../../assets/auroras/insights-oceano.webp'),
    onda: require('../../assets/auroras/onda-oceano.webp'),
    corrente: require('../../assets/auroras/corrente-oceano.webp'),
    raio: require('../../assets/auroras/raio-oceano.webp'),
    nuvem: require('../../assets/auroras/nuvem-oceano.webp'),
    veu: require('../../assets/auroras/veu-oceano.webp'),
    contaClaro: require('../../assets/auroras/conta-claro-oceano.webp'),
    contaEscuro: require('../../assets/auroras/conta-escuro-oceano.webp'),
  },
  'marinho': {
    hero: require('../../assets/auroras/hero-marinho.webp'),
    insights: require('../../assets/auroras/insights-marinho.webp'),
    onda: require('../../assets/auroras/onda-marinho.webp'),
    corrente: require('../../assets/auroras/corrente-marinho.webp'),
    raio: require('../../assets/auroras/raio-marinho.webp'),
    nuvem: require('../../assets/auroras/nuvem-marinho.webp'),
    veu: require('../../assets/auroras/veu-marinho.webp'),
    contaClaro: require('../../assets/auroras/conta-claro-marinho.webp'),
    contaEscuro: require('../../assets/auroras/conta-escuro-marinho.webp'),
  },
  'camurca': {
    hero: require('../../assets/auroras/hero-camurca.webp'),
    insights: require('../../assets/auroras/insights-camurca.webp'),
    onda: require('../../assets/auroras/onda-camurca.webp'),
    corrente: require('../../assets/auroras/corrente-camurca.webp'),
    raio: require('../../assets/auroras/raio-camurca.webp'),
    nuvem: require('../../assets/auroras/nuvem-camurca.webp'),
    veu: require('../../assets/auroras/veu-camurca.webp'),
    contaClaro: require('../../assets/auroras/conta-claro-camurca.webp'),
    contaEscuro: require('../../assets/auroras/conta-escuro-camurca.webp'),
  },
  'grafite': {
    hero: require('../../assets/auroras/hero-grafite.webp'),
    insights: require('../../assets/auroras/insights-grafite.webp'),
    onda: require('../../assets/auroras/onda-grafite.webp'),
    corrente: require('../../assets/auroras/corrente-grafite.webp'),
    raio: require('../../assets/auroras/raio-grafite.webp'),
    nuvem: require('../../assets/auroras/nuvem-grafite.webp'),
    veu: require('../../assets/auroras/veu-grafite.webp'),
    contaClaro: require('../../assets/auroras/conta-claro-grafite.webp'),
    contaEscuro: require('../../assets/auroras/conta-escuro-grafite.webp'),
  },
};

const PADRAO = AURORAS.original;

/** Os fundos da paleta escolhida. Cai no padrão para um id que não
    existe mais — paleta removida não pode deixar tela sem fundo. */
export function useAurora() {
  const id = useStore((s) => (s.S as any).paleta as string | undefined);
  return (id && AURORAS[id]) || PADRAO;
}

/* AS MEDIDAS DAS DUAS IMAGENS DA CAPA (assets/images/aurora-conta-*.png):
   a proporção, e a fração da altura em que o papel começa — medidas nos
   originais, na primeira linha toda branca (claro) ou toda preta
   (escuro). É com elas que a capa da conta e a espera do plano sobem a
   imagem até o papel chegar onde o texto está. */
export const PROPORCAO_DA_CAPA = 1983 / 793;
export const PAPEL_COMECA = { claro: 0.745, escuro: 0.677 };
