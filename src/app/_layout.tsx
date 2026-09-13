import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Outfit_300Light, Outfit_400Regular,
  Outfit_500Medium, Outfit_600SemiBold,
} from '@expo-google-fonts/outfit';
import { useStore } from '../logic/store';
import { light, APP_MAX_W } from '../theme';

/* Fundo fora da coluna, no web. Não é cor da marca e não entra na paleta:
   é a mesa sobre a qual o aparelho fica apoiado, e só existe em navegador. */
const MESA = '#DDE3F2';

/* No celular o app é a tela inteira e este componente não faz nada. No web
   ele passa a rodar numa coluna de largura de telefone, centrada.

   Sem isso o app renderiza edge-to-edge, e o preview mente: uma manchete de
   32px que domina uma tela de 390 vira uma linha perdida num hero de 1400,
   e quem avalia a tela pelo navegador conclui que a tipografia está pequena
   quando o que está errado é a proporção. */
function Moldura({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web') return <>{children}</>;
  return (
    <View style={{ flex: 1, backgroundColor: MESA, alignItems: 'center' }}>
      <View style={{ flex: 1, width: '100%', maxWidth: APP_MAX_W, backgroundColor: light.bg, overflow: 'hidden' }}>
        {children}
      </View>
    </View>
  );
}

export default function RootLayout() {
  const hydrate = useStore((s) => s.hydrate);
  const ready = useStore((s) => s.ready);
  const [loaded] = useFonts({
    Outfit_300Light, Outfit_400Regular,
    Outfit_500Medium, Outfit_600SemiBold,
  });

  useEffect(() => { hydrate(); }, [hydrate]);
  if (!loaded || !ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Moldura>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: light.bg }, animation: 'slide_from_right' }}>
          <Stack.Screen name="(tabs)" />
          {/* O check-in era folha modal. Virou tela: ele tem três escalas
              fixas, a lista de sintomas e um cartão por sintoma marcado —
              conteúdo que rola, e folha que rola muito é tela com menos
              espaço e um gesto de fechar a mais. */}
          <Stack.Screen name="checkin" />
          <Stack.Screen name="proxima-aplicacao" />
          <Stack.Screen name="ciclo" />
          <Stack.Screen name="evolucao" />
          <Stack.Screen name="historico" />
          <Stack.Screen name="perfil" />
          <Stack.Screen name="aplicacoes" />
          <Stack.Screen name="exames" />
          <Stack.Screen name="notificacoes" />
          <Stack.Screen name="saude" />
          <Stack.Screen name="medidas" />
          <Stack.Screen name="fotos" />
          <Stack.Screen name="sintomas" />
          <Stack.Screen name="medico" />
          <Stack.Screen name="consultas" />
          <Stack.Screen name="protocolos" />
          <Stack.Screen name="metas" />
          <Stack.Screen name="conquistas" />
          <Stack.Screen name="companion" />
          <Stack.Screen name="lembretes" />
          <Stack.Screen name="alimentacao" />
          <Stack.Screen name="integracoes" />
          <Stack.Screen name="biblioteca" />
          <Stack.Screen name="resumo-medico" />
          {/* telas internas da primeira leva — desenho em ui/internas */}
          <Stack.Screen name="marcador" />
          <Stack.Screen name="caneta" />
          <Stack.Screen name="semana" />
          <Stack.Screen name="notas" />
          <Stack.Screen name="exportar" />
          <Stack.Screen name="aplicacao" />
          <Stack.Screen name="aplicacao-ok" />
          {/* Registrar é um bottom sheet montado à mão, não o formSheet
              nativo: aquele só existe em iOS/Android e virava tela cheia na
              web, sem sequer um jeito de fechar. transparentModal deixa o
              scrim e o painel por conta da própria tela, e o comportamento
              fica igual em todo lugar. */}
          <Stack.Screen
            name="registrar"
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
          {/* capturas dedicadas — mesma apresentação do registrar */}
          {['medir-agua','medir-exercicio','medir-refeicao','medir-peso','medir-sintomas','medir-medidas','medir-foto','medir-exame','medir-anotacao',
           'registro','nota','caneta-nova','ritmo','dia'].map((n) => (
            <Stack.Screen
              key={n}
              name={n}
              options={{ presentation: 'transparentModal', animation: 'slide_from_bottom', contentStyle: { backgroundColor: 'transparent' } }}
            />
          ))}
        </Stack>
        </Moldura>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
