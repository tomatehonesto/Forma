import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../logic/store';
import { now, MO, startOfDay, addDays } from '../../logic/time';
import { curWeight, lostKg, goalProgress, checkins30, streak, achDone, M, journeyDay } from '../../logic/derive';
import { kg, nf } from '../../logic/time';
import { Screen, Txt, Card, IconBadge, Row, Chevron, CircleBtn, Divider } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { useTheme } from '../../ui/useTheme';
import { space, radius } from '../../theme';

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

export default function Voce() {
  const S = useStore((s) => s.S);
  const setTheme = useStore((s) => s.setTheme);
  const { c, isDark } = useTheme();
  const router = useRouter();
  const go = (p: string) => () => router.push(p as any);

  const med = M(S);
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
  const colorOf = (k: string) => (c as any)[k] as string;

  const infoRows: [string, string][] = [
    ['Condições', S.history.conditions.join(', ')],
    ['Alergias', S.history.allergies.join(', ')],
    ['Outros medicamentos', S.history.meds.join(', ')],
    ['Prescrição atual', `${med.label} ${nf(S.profile.dose, S.profile.dose % 1 ? 1 : 0)} ${med.unit}`],
  ];

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 8 }}>
        <View style={{ flex: 1 }}>
          <Txt v="display">Perfil</Txt>
          <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 6 }}>Você, sua saúde e suas preferências.</Txt>
        </View>
        <CircleBtn name="bell" onPress={go('/notificacoes')} />
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
              <Txt v="caption" c={c.tx3}>Membro desde {memberSince} · dia {journeyDay(S)} da jornada</Txt>
            </Row>
          </View>
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

      <Group title="Seu tratamento" items={[
        ['syringe', 'Aplicações', 'Histórico, constância e estoque da caneta', go('/aplicacoes')],
        ['activity', 'Ciclo da dose', 'Em que fase do efeito você está', go('/ciclo')],
        ['clock', 'Próxima aplicação', 'Contagem, preparo e local sugerido', go('/proxima-aplicacao')],
      ]} />

      <Group title="Saúde & dados" items={[
        ['scale', 'Evolução & medidas', 'Peso, IMC, composição corporal', go('/evolucao')],
        ['heart', 'Saúde & sinais vitais', 'Pressão, glicemia, frequência', go('/saude')],
        ['doc', 'Exames', '15 marcadores importados e explicados', go('/exames')],
        ['ruler', 'Medidas & composição', 'Cintura, quadril, gordura, músculo', go('/medidas')],
        ['photo', 'Evolução visual', 'Fotos antes e depois, comparadas pela IA', go('/fotos')],
        ['waves', 'Sintomas & radar', 'Equilíbrio e evolução por sintoma', go('/sintomas')],
      ]} />

      {/* histórico médico */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Histórico médico</Txt>
      <Card style={{ paddingVertical: 6 }}>
        {infoRows.map(([k, v]) => (
          <Row key={k} style={{ justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 9 }}>
            <Txt v="bodyMed" c={c.tx3}>{k}</Txt>
            <Txt v="label" style={{ maxWidth: '58%', textAlign: 'right' }}>{v}</Txt>
          </Row>
        ))}
      </Card>

      <Group title="Conta e preferências" items={[
        ['bell', 'Notificações', `${S.notifications.length} avisos · lembretes`, go('/notificacoes')],
        ['palette', 'Aparência', isDark ? 'Tema escuro' : 'Tema claro', () => setTheme(isDark ? 'light' : 'dark')],
        ['user', 'Editar perfil', 'Altere suas informações pessoais', undefined],
        ['lock', 'Privacidade', 'Compartilhado apenas com sua clínica', undefined],
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
