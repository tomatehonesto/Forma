import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Txt, Row, CircleBtn } from '../ui/kit';
import { useTheme } from '../ui/useTheme';

export default function Evolucao() {
  const { c } = useTheme();
  const router = useRouter();
  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', marginTop: 4 }}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <CircleBtn name="info" />
      </Row>
      <View style={{ marginTop: 14 }}>
        <Txt v="display">Evolução</Txt>
        <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 6 }}>Acompanhe sua transformação ao longo do tempo.</Txt>
      </View>
      <Txt v="body" c={c.tx4} style={{ marginTop: 44 }}>Em construção — próxima etapa.</Txt>
    </Screen>
  );
}
