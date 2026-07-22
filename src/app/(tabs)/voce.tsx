import React from 'react';
import { View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../logic/store';
import { now, MO, startOfDay, addDays } from '../../logic/time';
import { curWeight, lostKg, goalProgress, checkins30, streak, achDone } from '../../logic/derive';
import { kg } from '../../logic/time';
import { Screen, Txt, Card, IconBadge, Row, Chevron, CircleBtn, Divider } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { useTheme } from '../../ui/useTheme';
import { space, radius } from '../../theme';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Voce() {
  const S = useStore((s) => s.S);
  const setTheme = useStore((s) => s.setTheme);
  const { c, isDark } = useTheme();

  const startD = new Date(S.profile.startT);
  const memberSince = `${cap(MO[startD.getMonth()])}. ${startD.getFullYear()}`;
  const pct = Math.round(goalProgress(S));
  const goalDate = addDays(startOfDay(now()), 42);
  const stats: [string, string, string, string][] = [
    ['trend', 'Dias registrados', String(checkins30(S)), 'accent'],
    ['flame', 'Sequência atual', `${streak(S)} dias`, 'amber'],
    ['trophy', 'Conquistas', String(achDone(S).length), 'accent'],
    ['target', 'Metas atingidas', String(S.goals.filter((g: any) => (g.prog || 0) >= 100).length || 1), 'water'],
  ];
  const settings: [string, string, string, (() => void) | undefined][] = [
    ['user', 'Editar perfil', 'Altere suas informações pessoais', undefined],
    ['bell', 'Notificações', 'Customize lembretes e alertas', undefined],
    ['lock', 'Privacidade', 'Gerencie seus dados e segurança', undefined],
    ['palette', 'Aparência', isDark ? 'Tema escuro' : 'Tema claro', () => setTheme(isDark ? 'light' : 'dark')],
    ['info', 'Central de ajuda', 'Dúvidas frequentes e suporte', undefined],
    ['doc', 'Sobre o app', 'Versão 1.0.0', undefined],
  ];
  const colorOf = (k: string) => (c as any)[k] as string;

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 8 }}>
        <View style={{ flex: 1 }}>
          <Txt v="display">Perfil</Txt>
          <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 6 }}>Gerencie suas informações e preferências.</Txt>
        </View>
        <CircleBtn name="gear" />
      </Row>

      {/* profile + meta */}
      <Card style={{ marginTop: 18 }}>
        <Row>
          <View>
            <LinearGradient colors={[c.gradFrom, c.gradTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}>
              <Txt v="h1" c="#fff" style={{ fontSize: 24 }}>{S.profile.name[0]}</Txt>
            </LinearGradient>
            <View style={{ position: 'absolute', right: -2, bottom: -2, width: 22, height: 22, borderRadius: 11, backgroundColor: c.bg1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: c.line }}>
              <Icon name="pencil" size={12} color={c.accent} sw={1.8} />
            </View>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Txt v="h2">{S.profile.name}</Txt>
            <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 1 }}>{S.profile.email}</Txt>
            <Row gap={5} style={{ marginTop: 4 }}>
              <Icon name="cal" size={13} color={c.tx4} sw={1.7} />
              <Txt v="caption" c={c.tx3}>Membro desde {memberSince}</Txt>
            </Row>
          </View>
          <Chevron />
        </Row>

        <Divider style={{ marginVertical: 16 }} />

        <Row style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Row gap={7}>
            <Icon name="target" size={17} color={c.accent} sw={1.8} />
            <View>
              <Txt v="title" c={c.accent}>Meta atual</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{kg(S.profile.goalWeight)} kg até {goalDate.getDate()} de {MO[goalDate.getMonth()]}.</Txt>
            </View>
          </Row>
          <View style={{ alignItems: 'flex-end' }}>
            <Txt v="h2" c={c.accent}>{pct}%</Txt>
            <Txt v="micro" c={c.tx3}>da meta</Txt>
          </View>
        </Row>
        <View style={{ height: 8, borderRadius: 4, backgroundColor: c.track, marginTop: 12, overflow: 'hidden' }}>
          <LinearGradient colors={[c.gradFrom, c.gradTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: `${pct}%`, height: '100%', borderRadius: 4 }} />
        </View>
        <Row style={{ justifyContent: 'space-between', marginTop: 14 }}>
          {[['Peso inicial', `${kg(S.profile.startWeight)} kg`, c.tx], ['Meta', `${kg(S.profile.goalWeight)} kg`, c.tx], ['Progresso', `−${kg(lostKg(S))} kg`, c.accent]].map(([l, v, col], i) => (
            <View key={i as number} style={{ alignItems: i === 0 ? 'flex-start' : i === 2 ? 'flex-end' : 'center', flex: 1 }}>
              <Txt v="micro" c={c.tx3}>{l as string}</Txt>
              <Txt v="title" c={col as string} style={{ marginTop: 2 }}>{v as string}</Txt>
            </View>
          ))}
        </Row>
      </Card>

      {/* stat strip */}
      <Card tint={c.accentWeak} style={{ marginTop: 14, paddingVertical: 16 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          {stats.map(([ic, label, val, col]) => (
            <View key={label} style={{ alignItems: 'center', flex: 1 }}>
              <Icon name={ic} size={20} color={colorOf(col)} sw={1.8} />
              <Txt v="h2" style={{ marginTop: 6 }}>{val}</Txt>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 2, textAlign: 'center' }} numberOfLines={2}>{label}</Txt>
            </View>
          ))}
        </Row>
      </Card>

      {/* settings */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Conta e preferências</Txt>
      <Card style={{ paddingVertical: 4 }}>
        {settings.map(([ic, title, sub, onPress], i) => (
          <View key={title}>
            <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Row style={{ paddingVertical: 14 }}>
                <IconBadge name={ic} size={40} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt v="title">{title}</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{sub}</Txt>
                </View>
                <Chevron />
              </Row>
            </Pressable>
            {i < settings.length - 1 && <Divider style={{ marginLeft: 52 }} />}
          </View>
        ))}
      </Card>

      {/* logout */}
      <Card tint={c.ctaWeak} style={{ marginTop: 14, paddingVertical: 16 }}>
        <Row gap={12}>
          <Icon name="logout" size={22} color={c.cta} sw={1.9} />
          <Txt v="title" c={c.cta}>Sair da conta</Txt>
        </Row>
      </Card>
    </Screen>
  );
}
