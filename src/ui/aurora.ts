import { useStore } from '../logic/store';

/* ============================================================
   A AURORA DA PALETA

   O gradiente de fundo é IMAGEM, e imagem não segue token de cor: uma
   paleta que trocasse botão, selo e painel deixaria intacta a maior
   superfície colorida do aplicativo — o hero da Home, o Insights, o
   check-in concluído, o companion e as metas.

   Então existem dez arquivos, dois por paleta, gerados antes da
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
  'pitaia': {
    hero: require('../../assets/auroras/hero-pitaia.webp'),
    insights: require('../../assets/auroras/insights-pitaia.webp'),
  },
  'brasa': {
    hero: require('../../assets/auroras/hero-brasa.webp'),
    insights: require('../../assets/auroras/insights-brasa.webp'),
  },
  'floresta': {
    hero: require('../../assets/auroras/hero-floresta.webp'),
    insights: require('../../assets/auroras/insights-floresta.webp'),
  },
};

const PADRAO = AURORAS.original;

/** Os dois fundos da paleta escolhida. Cai no padrão para um id que não
    existe mais — paleta removida não pode deixar tela sem fundo. */
export function useAurora() {
  const id = useStore((s) => (s.S as any).paleta as string | undefined);
  return (id && AURORAS[id]) || PADRAO;
}
