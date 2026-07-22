import React from 'react';
import { View, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Divider } from '../ui/kit';
import { useTheme } from '../ui/useTheme';

const ITEMS: [string, string, string][] = [
  ['appleHealth', 'Apple Health', 'Passos, sono e treinos'],
  ['healthConnect', 'Health Connect', 'Android · dados de saúde'],
  ['googleFit', 'Google Fit', 'Atividade e passos'],
  ['garmin', 'Garmin', 'Treinos e frequência'],
  ['fitbit', 'Fitbit', 'Sono e passos'],
  ['withings', 'Withings', 'Balança e pressão'],
  ['scale', 'Balança inteligente', 'Peso e composição'],
  ['watch', 'Smartwatch', 'Frequência e atividade'],
];

export default function Integracoes() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Integrações</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Seus dados de saúde em um lugar só</Txt>
        </View>
      </Row>

      <Card style={{ marginTop: 16, paddingVertical: 4 }}>
        {ITEMS.map(([k, t, sub], i) => {
          const on = (S.integrations as any)[k];
          return (
            <View key={k}>
              {i > 0 && <Divider style={{ marginLeft: 52 }} />}
              <Row style={{ paddingVertical: 11 }}>
                <IconBadge name="trend" size={40} color={on ? c.accent : c.tx4} bg={on ? c.accentWeak : c.bg2} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt v="title">{t}</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{sub}</Txt>
                </View>
                <Switch value={!!on} onValueChange={(v) => update((s: any) => { s.integrations[k] = v; })} trackColor={{ false: c.track, true: c.accent }} thumbColor="#fff" />
              </Row>
            </View>
          );
        })}
      </Card>

      <Txt v="micro" c={c.tx4} style={{ textAlign: 'center', marginTop: 16, paddingHorizontal: 16, lineHeight: 16 }}>Demonstração — conexões reais pedem autorização de cada serviço.</Txt>
    </Screen>
  );
}
