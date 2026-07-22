import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { activeReminderCount } from '../logic/derive';
import { relDay } from '../logic/time';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Chevron } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';

export default function Notificacoes() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const colorOf: Record<string, [string, string]> = {
    trat: [c.accent, c.accentWeak], ia: [c.accent2, c.waterBg], clin: [c.purple, c.purpleBg], exame: [c.accent, c.accentWeak],
  };
  const navOf: Record<string, string> = { trat: '/aplicacoes', exame: '/exames' };
  const nRem = activeReminderCount(S);

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Notificações</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Lembretes e avisos — só o que importa</Txt>
        </View>
      </Row>

      <View style={{ marginTop: 16, gap: 10 }}>
        {S.notifications.map((n: any) => {
          const [col, bg] = colorOf[n.kind] || [c.tx2, c.bg2];
          const to = navOf[n.kind];
          return (
            <Card key={n.t} style={{ paddingVertical: 14 }} onPress={to ? () => router.push(to as any) : undefined}>
              <Row style={{ alignItems: 'flex-start' }}>
                <IconBadge name={n.ic} size={40} color={col} bg={bg} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt v="title">{n.title}</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 2, lineHeight: 17 }}>{n.body}</Txt>
                </View>
                <Txt v="micro" c={c.tx4}>{relDay(new Date(n.t))}</Txt>
              </Row>
            </Card>
          );
        })}
      </View>

      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Lembretes</Txt>
      <Card style={{ paddingVertical: 14 }}>
        <Row>
          <IconBadge name="bell" size={40} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Txt v="title">Configurar lembretes</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{nRem} ativo{nRem === 1 ? '' : 's'} · dose, pesagem, água, proteína</Txt>
          </View>
          <Chevron />
        </Row>
      </Card>

      <Row gap={6} style={{ marginTop: 14, paddingHorizontal: 4 }}>
        <Icon name="info" size={13} color={c.tx4} sw={1.8} />
        <Txt v="micro" c={c.tx4} style={{ flex: 1, lineHeight: 16 }}>Lembretes acolhem, não cobram — você escolhe o quê, quando, e pode adiar sempre.</Txt>
      </Row>
    </Screen>
  );
}
