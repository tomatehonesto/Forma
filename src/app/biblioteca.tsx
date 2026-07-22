import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Txt, Card, Row, CircleBtn, Pill } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';

const ITEMS = [
  { tag: 'Você está aqui · 5 mg', title: 'Passando pros 5 mg: o que esperar', desc: 'Como o corpo responde ao aumento de dose e por que a náusea costuma ser passageira.', ic: 'dose' },
  { tag: 'Perto da sua dose', title: 'Por que a fome volta antes da aplicação', desc: 'A relação entre o nível da medicação e a saciedade ao longo da semana.', ic: 'drop2' },
  { tag: 'Sua meta', title: 'Proteína e preservação de massa magra', desc: 'Comer proteína suficiente sustenta seu metabolismo durante a perda de peso.', ic: 'flame' },
  { tag: 'Consulta chegando', title: 'Como aproveitar melhor sua consulta', desc: 'O que levar, o que perguntar, e como o resumo automático ajuda.', ic: 'steth' },
];

export default function Biblioteca() {
  const { c } = useTheme();
  const router = useRouter();

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Biblioteca</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Conteúdo certo para o seu momento — não uma lista de artigos</Txt>
        </View>
      </Row>

      <View style={{ marginTop: 16, gap: 12 }}>
        {ITEMS.map((it, i) => (
          <Card key={it.title} tint={i === 0 ? c.accentWeak : undefined}>
            <Row gap={6}><Icon name={it.ic} size={14} color={c.accent} sw={2} /><Txt v="micro" c={c.accent} style={{ letterSpacing: 0.6 }}>{it.tag.toUpperCase()}</Txt></Row>
            <Txt v="h2" style={{ marginTop: 9 }}>{it.title}</Txt>
            <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 5, lineHeight: 20 }}>{it.desc}</Txt>
            <Row style={{ marginTop: 12 }}>
              <Pill icon="book" label="3 min de leitura" color={c.tx3} bg={c.bg2} />
            </Row>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
