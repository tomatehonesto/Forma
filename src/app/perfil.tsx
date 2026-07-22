import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import { MO } from '../logic/time';
import { journeyDay, hasClinic } from '../logic/derive';
import { Screen, Txt, Card, IconBadge, Row, Chevron, CircleBtn, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
type Item = [string, string, string, (() => void) | undefined];

function Group({ title, items }: { title: string; items: Item[] }) {
  const { c } = useTheme();
  return (
    <>
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>{title}</Txt>
      <Card style={{ paddingVertical: 4 }}>
        {items.map(([ic, t, sub, onPress], i) => (
          <View key={t}>
            {i > 0 && <Divider style={{ marginLeft: 52 }} />}
            <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed && onPress ? 0.6 : 1 }]}>
              <Row style={{ paddingVertical: 13 }}>
                <IconBadge name={ic} size={40} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt v="title">{t}</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{sub}</Txt>
                </View>
                <Chevron />
              </Row>
            </Pressable>
          </View>
        ))}
      </Card>
    </>
  );
}

export default function Perfil() {
  const S = useStore((s) => s.S);
  const setTheme = useStore((s) => s.setTheme);
  const { c, isDark } = useTheme();
  const router = useRouter();
  const go = (p: string) => () => router.push(p as any);

  const startD = new Date(S.profile.startT);
  const memberSince = `${cap(MO[startD.getMonth()])}. ${startD.getFullYear()}`;
  const linked = hasClinic(S);

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Perfil</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Conta, preferências e configurações</Txt>
        </View>
      </Row>

      {/* identidade */}
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
              <Txt v="caption" c={c.tx3}>Membro desde {memberSince} · dia {journeyDay(S)} da jornada</Txt>
            </Row>
          </View>
          <Chevron />
        </Row>
      </Card>

      {/* clínica — só ganha camada quando há vínculo */}
      {linked ? (
        <Card tint={c.accentWeak} style={{ marginTop: 14, paddingVertical: 15 }} onPress={go('/medico')}>
          <Row>
            <IconBadge name="steth" size={42} bg={c.bg1} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt v="title">{S.profile.clinic}</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{S.profile.doctor} · mensagens, consultas e equipe</Txt>
            </View>
            <Chevron />
          </Row>
        </Card>
      ) : (
        <Card style={{ marginTop: 14, paddingVertical: 15 }}>
          <Row>
            <IconBadge name="steth" size={42} color={c.tx3} bg={c.bg2} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt v="title">Conectar a uma clínica</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Sua equipe acompanha sua evolução de perto — opcional, o Forma funciona completo sem vínculo.</Txt>
            </View>
            <Chevron />
          </Row>
        </Card>
      )}

      <Group title="Conta" items={[
        ['user', 'Dados pessoais', 'Nome, e-mail e informações de saúde', undefined],
        ['leaf', 'Plano', 'Forma Pessoal · gratuito', undefined],
        ['trend', 'Dispositivos e integrações', 'Apple Health, Withings e mais', go('/integracoes')],
      ]} />

      <Group title="Preferências" items={[
        ['bell', 'Notificações', `${S.notifications.length} avisos recentes`, go('/notificacoes')],
        ['clock', 'Lembretes', 'Dose, pesagem, água e proteína', go('/lembretes')],
        ['palette', 'Aparência', isDark ? 'Tema escuro' : 'Tema claro', () => setTheme(isDark ? 'light' : 'dark')],
      ]} />

      <Group title="Privacidade e suporte" items={[
        ['lock', 'Privacidade', 'Seus dados são seus. Sempre.', undefined],
        ['info', 'Central de ajuda', 'Dúvidas frequentes e suporte', undefined],
        ['doc', 'Sobre o app', 'Versão 1.0.0', undefined],
      ]} />

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
