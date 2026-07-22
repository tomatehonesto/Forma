import { Tabs } from 'expo-router';
import { TabBar } from '../../ui/TabBar';

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="jornada" />
      <Tabs.Screen name="insights" />
      <Tabs.Screen name="voce" />
    </Tabs>
  );
}
