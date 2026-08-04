import { Tabs } from 'expo-router';
import { TabBar } from '../../ui/TabBar';

/* Ordem das abas = ordem dos itens em ui/TabBar (o FAB entra entre a 2ª e a 3ª). */
export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="jornada" />
      <Tabs.Screen name="insights" />
      <Tabs.Screen name="cuidado" />
    </Tabs>
  );
}
