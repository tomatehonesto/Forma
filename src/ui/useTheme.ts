import { light, dark, comCor, type Palette } from '../theme';
import { useStore } from '../logic/store';

/* Tema ativo. As refs (mockups) são claras; padrão = light.

   DUAS PREFERÊNCIAS, UM LUGAR SÓ. O tema decide entre claro e escuro; a
   cor decide qual é a cor de ação dentro do modo escolhido. Elas se
   combinam aqui, e não em cada tela: nenhum componente do app precisa
   saber que existe escolha de cor — todos continuam lendo `c.accent`.

   `comCor` devolve a paleta intacta quando a cor é o azul padrão, então
   quem não escolheu nada não paga nem o cálculo nem uma identidade de
   objeto nova a cada render. */
export function useTheme(): { c: Palette; isDark: boolean } {
  const pref = useStore((s) => s.S.theme);
  const cor = useStore((s) => (s.S as any).cor as string | undefined);
  const isDark = pref === 'dark';
  return { c: comCor(isDark ? dark : light, cor, isDark), isDark };
}
