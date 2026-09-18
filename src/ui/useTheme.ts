import { useColorScheme } from 'react-native';
import { light, dark, comPaleta, type Palette } from '../theme';
import { useStore } from '../logic/store';

/* ============================================================
   O TEMA ATIVO

   Duas preferências, um lugar só: o modo decide entre claro e escuro, a
   paleta decide as cores dentro dele. As duas se combinam aqui, e não em
   cada tela — nenhum componente do app precisa saber que existe escolha
   de paleta, todos continuam lendo `c.accent` e `c.lime`.

   ⚠️ E AGORA EXISTE 'SYSTEM', que é o padrão. Quem instala o aplicativo
   já escolheu claro ou escuro uma vez, nos ajustes do telefone; repetir a
   pergunta é ignorar a resposta que a pessoa já deu. Escolher claro ou
   escuro aqui dentro passa a ser o gesto de quem quer o CONTRÁRIO do
   sistema, que é a única razão de essa opção existir.

   `useColorScheme` devolve nulo enquanto o sistema não respondeu — e
   nulo não é escuro. Cair no claro nesse instante é melhor do que piscar
   preto e voltar.

   `comPaleta` devolve a paleta intacta quando a escolhida é a original,
   então quem não escolheu nada não paga nem o cálculo nem uma identidade
   de objeto nova a cada render.
   ============================================================ */
export function useTheme(): { c: Palette; isDark: boolean } {
  const pref = useStore((s) => s.S.theme);
  const paleta = useStore((s) => (s.S as any).paleta as string | undefined);
  const doSistema = useColorScheme();

  const isDark = pref === 'dark' || (pref !== 'light' && doSistema === 'dark');
  return { c: comPaleta(isDark ? dark : light, paleta, isDark), isDark };
}
