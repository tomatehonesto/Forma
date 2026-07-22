import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line } from 'react-native-svg';
import { useStore } from '../../logic/store';
import { now, MO, MO_LONG, diffDays } from '../../logic/time';
import { pharmaSeries, nextInjectionDate, alerts, checkinToday } from '../../logic/derive';
import { Screen, Txt, Card, Pill, IconBadge, Row, Chevron, Divider } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { AskCompanion } from '../../ui/Ask';
import { AreaCurve } from '../../ui/charts';
import { useTheme } from '../../ui/useTheme';
import { BRAND, space } from '../../theme';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const WDL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const WDS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const CHECK = [
  { ic: 'utensils', label: 'Fome' },
  { ic: 'frown', label: 'Enjoo' },
  { ic: 'bolt', label: 'Energia' },
  { ic: 'mood', label: 'Humor' },
  { ic: 'brain', label: 'Compulsão' },
];

function BrandMark() {
  const { c } = useTheme();
  return (
    <Row gap={9}>
      <Svg width={24} height={24} viewBox="0 0 24 24">
        <Line x1={6} y1={16.5} x2={12} y2={7.5} stroke={c.accent} strokeWidth={1.9} strokeLinecap="round" />
        <Line x1={12} y1={7.5} x2={18} y2={14} stroke={c.accent2} strokeWidth={1.9} strokeLinecap="round" />
        <Circle cx={6} cy={16.5} r={2.7} fill={c.accent} />
        <Circle cx={12} cy={7.5} r={2.7} fill={c.accent} />
        <Circle cx={18} cy={14} r={2.7} fill={c.accent2} />
      </Svg>
      <Txt v="h2" style={{ letterSpacing: -0.3 }}>{BRAND}</Txt>
    </Row>
  );
}

export default function Home() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();

  const d = now();
  const greet = d.getHours() < 12 ? 'Bom dia' : d.getHours() < 18 ? 'Boa tarde' : 'Boa noite';
  const first = S.profile.name.split(' ')[0];
  const dateStr = `${WDL[d.getDay()]}, ${d.getDate()} de ${cap(MO_LONG[d.getMonth()])}`;

  const nd = nextInjectionDate(S);
  const ndDays = diffDays(nd, now());
  const ndLabel = ndDays <= 0 ? 'Hoje' : ndDays === 1 ? 'Amanhã' : `${ndDays} dias`;
  const ndStr = `${WDS[nd.getDay()]}, ${nd.getDate()} ${cap(MO[nd.getMonth()])}`;

  const ser = pharmaSeries(S);
  const hunger = ser.pts.map((p) => 1 - p.n);
  const mn = Math.min(...hunger), mx = Math.max(...hunger);
  const cpts = ser.pts.map((p, i) => ({ x: i / (ser.pts.length - 1 || 1), y: (hunger[i] - mn) / ((mx - mn) || 1) }));
  const marker = hunger.indexOf(mx);

  return (
    <Screen>
      {/* header */}
      <Row style={{ justifyContent: 'space-between', marginTop: 4 }}>
        <BrandMark />
        <Row gap={16}>
          <Pressable hitSlop={10} onPress={() => router.push('/notificacoes')}>
            <Icon name="bell" size={23} color={c.tx2} sw={1.8} />
            {S.unread > 0 && <View style={{ position: 'absolute', top: -1, right: -1, width: 9, height: 9, borderRadius: 5, backgroundColor: c.accent, borderWidth: 1.6, borderColor: c.bg }} />}
          </Pressable>
          <Pressable hitSlop={6} onPress={() => router.push('/perfil' as any)} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
            <LinearGradient colors={[c.gradFrom, c.gradTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }}>
              <Txt v="title" c="#fff">{first[0]}</Txt>
            </LinearGradient>
          </Pressable>
        </Row>
      </Row>

      {/* greeting */}
      <View style={{ marginTop: 18 }}>
        <Txt v="h1">{greet}, {first}</Txt>
        <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 3 }}>{dateStr}</Txt>
      </View>

      {/* insight hero */}
      <Card style={{ padding: 0, overflow: 'hidden', marginTop: 18 }}>
        <LinearGradient
          colors={['rgba(15,185,129,0.11)', 'rgba(46,134,199,0.05)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        />
        <View style={{ padding: space.lg }}>
          <Row gap={7}>
            <Icon name="spark" size={16} color={c.accent} sw={2} />
            <Txt v="micro" c={c.accent} style={{ letterSpacing: 1.2 }}>INSIGHT DO DIA</Txt>
          </Row>
          <Txt v="h1" style={{ marginTop: 12, fontSize: 27, lineHeight: 32 }}>
            Seu corpo está respondendo <Txt v="h1" c={c.accent} style={{ fontSize: 27, lineHeight: 32 }}>bem</Txt>.
          </Txt>
          <Txt v="bodyMed" c={c.tx2} style={{ marginTop: 10 }}>
            Sua fome tende a aumentar entre o dia 5 e 6 após a aplicação.
          </Txt>
          <View style={{ marginTop: 14 }}>
            <Pill label="Baseado nos seus últimos 14 dias" icon="barchart" />
          </View>
          <View style={{ marginTop: 6, marginHorizontal: -2 }}>
            <AreaCurve pts={cpts} marker={marker} height={150} id="hero" />
          </View>
          <AskCompanion q="Por que sinto mais fome?" label="Entender melhor" style={{ marginTop: 4 }} />
        </View>
      </Card>

      {/* pra hoje — o que precisa de você */}
      <Txt v="h2" style={{ marginTop: 22, marginBottom: 10 }}>Pra hoje</Txt>
      <Card style={{ paddingVertical: 4 }}>
        {alerts(S).map((a, i) => {
          const to = a.act === 'sheet:checkin' ? '/checkin' : a.act.startsWith('nav:') ? `/${a.act.slice(4)}` : null;
          const warn = a.kind === 'warn';
          return (
            <View key={a.text}>
              {i > 0 && <Divider style={{ marginLeft: 52 }} />}
              <Pressable onPress={to ? () => router.push(to as any) : undefined} style={({ pressed }) => [{ opacity: pressed && to ? 0.6 : 1 }]}>
                <Row style={{ paddingVertical: 12 }}>
                  <IconBadge name={a.ic} size={40} color={warn ? c.cta : undefined} bg={warn ? c.ctaWeak : undefined} />
                  <Txt v="title" style={{ flex: 1, marginLeft: 12 }}>{a.text}</Txt>
                  <Chevron />
                </Row>
              </Pressable>
            </View>
          );
        })}
      </Card>

      {/* protocolo de hoje */}
      <Card style={{ marginTop: 14 }} onPress={() => router.push('/protocolos' as any)}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Row gap={6}><Icon name="target" size={14} color={c.accent} sw={2} /><Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>PROTOCOLO · SEMANA {S.protocol.week}</Txt></Row>
          <Txt v="label" c={c.tx3}>{S.protocol.tasks.filter((t: any) => t.done).length}/{S.protocol.tasks.length}</Txt>
        </Row>
        {S.protocol.tasks.filter((t: any) => !t.done).slice(0, 2).map((t: any) => (
          <Row key={t.t} gap={10} style={{ marginTop: 12 }}>
            <View style={{ width: 22, height: 22, borderRadius: 8, borderWidth: 1.6, borderColor: c.line2 }} />
            <View style={{ flex: 1 }}>
              <Txt v="bodyMed">{t.t}</Txt>
              {!!t.note && <Txt v="micro" c={c.tx3} style={{ marginTop: 1 }}>{t.note}</Txt>}
            </View>
          </Row>
        ))}
        <Row gap={4} style={{ marginTop: 12 }}>
          <Txt v="label" c={c.accent}>Ver a semana inteira</Txt>
          <Chevron size={15} color={c.accent} />
        </Row>
      </Card>

      {/* próxima aplicação */}
      <Card onPress={() => router.push('/proxima-aplicacao')} style={{ marginTop: 14 }}>
        <Row>
          <IconBadge name="syringe" size={50} />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Txt v="label" c={c.tx3}>Próxima aplicação</Txt>
            <Txt v="display" style={{ fontSize: 26, lineHeight: 30, marginTop: 1 }}>{ndLabel}</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{ndStr}</Txt>
          </View>
          <Chevron />
        </Row>
      </Card>

      {/* check-in rápido */}
      <Card style={{ marginTop: 14 }}>
        <Txt v="h2">Check-in rápido</Txt>
        <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 2 }}>Como você está agora?</Txt>
        <Row style={{ marginTop: 16, justifyContent: 'space-between' }}>
          {CHECK.map((it) => (
            <Pressable key={it.label} onPress={() => router.push('/checkin')} style={({ pressed }) => [{ alignItems: 'center', opacity: pressed ? 0.6 : 1 }]}>
              <View style={{ width: 52, height: 52, borderRadius: 26, borderWidth: 1.4, borderColor: c.accentLine, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={it.ic} size={22} color={c.accent} sw={1.8} />
              </View>
              <Txt v="caption" c={c.tx2} style={{ marginTop: 7 }}>{it.label}</Txt>
            </Pressable>
          ))}
        </Row>
      </Card>

      {/* privacidade */}
      <Card tint={c.accentWeak} style={{ marginTop: 14 }}>
        <Row>
          <IconBadge name="lock" size={46} bg={c.bg1} />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Txt v="title">Privacidade é a nossa prioridade.</Txt>
            <Txt v="bodyMed" c={c.tx2} style={{ marginTop: 3 }}>Seus dados são seus. Sempre.</Txt>
          </View>
          <Chevron />
        </Row>
      </Card>
    </Screen>
  );
}
