import { Platform, useWindowDimensions } from 'react-native';
import { APP_MAX_W } from '../theme';

/* Largura útil do app — a que as peças sangradas devem medir.

   No aparelho é a largura da tela, sem corte: o clamp existe só para
   acompanhar a moldura de app/_layout, e a moldura só existe no web. Num
   tablet ou num telefone deitado, limitar aqui deixaria a curva do hero
   parando no meio da tela com um vazio ao lado.

   No navegador o app roda numa coluna de largura de telefone, e aí janela
   e app deixam de ter a mesma medida: uma janela de 1200px com o app em
   430 faria a curva ser desenhada quase três vezes mais larga que a tela e
   vazar por baixo do conteúdo.

   Altura continua vindo de useWindowDimensions: a moldura não limita
   altura, então não há o que reconciliar. */
export function useLarguraApp() {
  const { width } = useWindowDimensions();
  return Platform.OS === 'web' ? Math.min(width, APP_MAX_W) : width;
}
