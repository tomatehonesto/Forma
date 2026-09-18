import { useStore } from '../logic/store';

/* ============================================================
   A AURORA DA PALETA

   O gradiente de fundo é IMAGEM, e imagem não segue token de cor: uma
   paleta que trocasse botão, selo e painel deixaria intacta a maior
   superfície colorida do aplicativo — o hero da Home, o Insights, o
   check-in concluído, o companion e as metas.

   Então existem vinte arquivos, dois por paleta, gerados antes da
   compilação por scripts/gerar-aurora.mjs a partir dos dois originais.

   ⚠️ E O MAPA É ESCRITO À MÃO PORQUE PRECISA SER. O empacotador resolve
   cada `require` em tempo de compilação: um caminho montado com variável
   simplesmente não existe no pacote. Gerar este arquivo seria possível,
   mas ele muda uma vez por paleta nova — e um mapa que se lê é melhor do
   que um gerador que se esquece de rodar.
   ============================================================ */

const AURORAS: Record<string, { hero: number; insights: number }> = {
  'original': {
    hero: require('../../assets/auroras/hero-original.webp'),
    insights: require('../../assets/auroras/insights-original.webp'),
  },
  'amora': {
    hero: require('../../assets/auroras/hero-amora.webp'),
    insights: require('../../assets/auroras/insights-amora.webp'),
  },
  'framboesa': {
    hero: require('../../assets/auroras/hero-framboesa.webp'),
    insights: require('../../assets/auroras/insights-framboesa.webp'),
  },
  'brasa': {
    hero: require('../../assets/auroras/hero-brasa.webp'),
    insights: require('../../assets/auroras/insights-brasa.webp'),
  },
  'oceano': {
    hero: require('../../assets/auroras/hero-oceano.webp'),
    insights: require('../../assets/auroras/insights-oceano.webp'),
  },
  'floresta': {
    hero: require('../../assets/auroras/hero-floresta.webp'),
    insights: require('../../assets/auroras/insights-floresta.webp'),
  },
  'indigo': {
    hero: require('../../assets/auroras/hero-indigo.webp'),
    insights: require('../../assets/auroras/insights-indigo.webp'),
  },
  'vinho': {
    hero: require('../../assets/auroras/hero-vinho.webp'),
    insights: require('../../assets/auroras/insights-vinho.webp'),
  },
  'menta': {
    hero: require('../../assets/auroras/hero-menta.webp'),
    insights: require('../../assets/auroras/insights-menta.webp'),
  },
  'grafite': {
    hero: require('../../assets/auroras/hero-grafite.webp'),
    insights: require('../../assets/auroras/insights-grafite.webp'),
  },
};

const PADRAO = AURORAS.original;

/** Os dois fundos da paleta escolhida. Cai no padrão para um id que não
    existe mais — paleta removida não pode deixar tela sem fundo. */
export function useAurora() {
  const id = useStore((s) => (s.S as any).paleta as string | undefined);
  return (id && AURORAS[id]) || PADRAO;
}
