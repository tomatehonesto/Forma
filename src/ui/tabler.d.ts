/* O @tabler/icons-react-native aponta os tipos dos imports fundos para
   dist/icons/*.d.ts, e os arquivos estão em dist/icons/icons/*.d.ts — um
   engano do pacote (3.46.0). Sem isto, importar IconWalk direto quebra o
   tsc; com o barril (import { IconWalk } from ...) o tipo resolve, mas
   entram as quase seis mil peças no bundle.

   O curinga cobre o conjunto todo: todas elas aceitam os mesmos três
   adereços, que é o que o <Icon> passa. */
declare module '@tabler/icons-react-native/Icon*' {
  import type { ComponentType } from 'react';
  const Glifo: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  export default Glifo;
}
