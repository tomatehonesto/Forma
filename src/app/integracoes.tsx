import React from 'react';
import { View, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { Screen, Txt, Row, CircleBtn, Grupo } from '../ui/kit';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   INTEGRAÇÕES — de onde os números podem vir sozinhos

   O QUE CADA UMA DIZ TEM DE SER O QUE O APP LÊ. Apple Health e Health
   Connect ganharam uma tela no cadastro, e lá elas prometem peso, sono e
   treino. Aqui a mesma integração dizia "passos, sono e treinos": passo
   nenhuma tela mostra, e o peso — que vira ponto na curva de evolução —
   ficava de fora da lista. Duas descrições da mesma coisa, e a que a
   pessoa lê primeiro é a que ela cobra depois.

   SEM COLUNA DE ÍCONE. As oito linhas mostravam o MESMO desenho de seta
   oito vezes, dentro de oito pastilhas: uma coluna inteira de tinta que
   não distinguia nada — e não distinguia porque não havia como. Não dá
   para usar o logotipo de cada serviço (são marcas de terceiros), e
   inventar um símbolo para a Garmin seria pior do que não ter. Sem a
   coluna, o nome lidera, que é o que a pessoa procura quando abre esta
   tela.
   ============================================================ */

const ITEMS: [string, string, string][] = [
  ['appleHealth', 'Apple Health', 'Peso, sono e treinos'],
  ['healthConnect', 'Health Connect', 'Android · peso, sono e treinos'],
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
        <Txt v="h1" style={{ flex: 1 }}>Integrações</Txt>
      </Row>
      <Txt v="caption" c={c.tx3} style={{ marginTop: 12 }}>
        Ligadas, elas trazem peso, sono e treino sem você digitar.
      </Txt>

      <Grupo>
        {ITEMS.map(([k, t, sub]) => {
          const on = !!(S.integrations as any)[k];
          return (
            <Row key={k} gap={12}>
              <View style={{ flex: 1 }}>
                <Txt v="body">{t}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{sub}</Txt>
              </View>
              <Switch
                value={on}
                onValueChange={(v) => update((s: any) => { s.integrations[k] = v; })}
                trackColor={{ false: c.track, true: c.accent }}
                thumbColor="#fff"
              />
            </Row>
          );
        })}
      </Grupo>

      <Txt v="micro" c={c.tx4} style={{ textAlign: 'center', marginTop: 16, paddingHorizontal: 16, lineHeight: 17 }}>
        Demonstração — conexões reais pedem autorização de cada serviço.
      </Txt>
    </Screen>
  );
}
