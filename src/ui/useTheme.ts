import { light, dark, comPaleta, type Palette } from '../theme';
import { useStore } from '../logic/store';

/* Tema ativo. As refs (mockups) são claras; padrão = light.

   TRÊS PREFERÊNCIAS, UM LUGAR SÓ. O tema decide entre claro e escuro; a
   cor decide a cor de ação; o destaque decide a cor do alcançado. As
   três se combinam aqui, e não em cada tela: nenhum componente do app
   precisa saber que existe escolha de cor — todos continuam lendo
   `c.accent` e `c.lime`.

   `comPaleta` devolve a paleta intacta quando as duas são o padrão,
   então quem não escolheu nada não paga nem o cálculo nem uma identidade
   de objeto nova a cada render. */
export function useTheme(): { c: Palette; isDark: boolean } {
  const pref = useStore((s) => s.S.theme);
  const cor = useStore((s) => (s.S as any).cor as string | undefined);
  const destaque = useStore((s) => (s.S as any).destaque as string | undefined);
  const isDark = pref === 'dark';
  return { c: comPaleta(isDark ? dark : light, cor, destaque, isDark), isDark };
}
