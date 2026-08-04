import { useEffect } from 'react';
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
import { light } from '../theme';

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
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: light.bg }, animation: 'slide_from_right' }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="checkin" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
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
          {['medir-agua','medir-exercicio','medir-refeicao','medir-peso','medir-sintomas','medir-medidas','medir-foto','medir-exame','medir-anotacao'].map((n) => (
            <Stack.Screen
              key={n}
              name={n}
              options={{ presentation: 'transparentModal', animation: 'slide_from_bottom', contentStyle: { backgroundColor: 'transparent' } }}
            />
          ))}
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
