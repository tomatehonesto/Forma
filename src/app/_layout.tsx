import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useStore } from '../logic/store';
import { light } from '../theme';

export default function RootLayout() {
  const hydrate = useStore((s) => s.hydrate);
  const ready = useStore((s) => s.ready);
  const [loaded] = useFonts({
    PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold,
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold,
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
          <Stack.Screen name="aplicacoes" />
          <Stack.Screen name="exames" />
          <Stack.Screen name="notificacoes" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
