import { light, dark, type Palette } from '../theme';
import { useStore } from '../logic/store';

/* Tema ativo. As refs (mockups) são claras; padrão = light. Aparência troca S.theme. */
export function useTheme(): { c: Palette; isDark: boolean } {
  const pref = useStore((s) => s.S.theme);
  const isDark = pref === 'dark';
  return { c: isDark ? dark : light, isDark };
}
