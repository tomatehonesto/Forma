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
import { light, radius } from '../theme';

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
          {/* Registrar é um bottom sheet, não uma tela: registrar algo é um
              desvio rápido do que a pessoa estava fazendo, e o contexto de
              trás precisa continuar visível. fitToContents deixa a altura
              seguir o conteúdo em vez de fixar uma fração da tela. */}
          <Stack.Screen
            name="registrar"
            options={{
              presentation: 'formSheet',
              sheetAllowedDetents: 'fitToContents',
              sheetGrabberVisible: true,
              sheetCornerRadius: radius.xl,
              sheetExpandsWhenScrolledToEdge: false,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
