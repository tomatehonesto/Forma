import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import { M, nextInjectionDate, adesao, siteLabel, nextSite, injCalendar, pharmaSeries, doseReminderDate, reminderWhen } from '../logic/derive';
import { now, diffDays, fmtWD, fmtDate, relDay, nf, startOfDay } from '../logic/time';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Chevron, Pill, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { AreaCurve } from '../ui/charts';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

export default function Aplicacoes() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const med = M(S);
  const nd = nextInjectionDate(S);
  const ndDays = diffDays(nd, now());
  const site = nextSite(S);
  const cal = injCalendar(S);
  const ade = adesao(S);
  const rem = reminderWhen(doseReminderDate(S));

  // curva farmacológica normalizada p/ AreaCurve
  const ph = pharmaSeries(S);
  const t0 = ph.pts[0].t, t1 = ph.pts[ph.pts.length - 1].t;
  const phPts = ph.pts.map((p) => ({ x: (p.t - t0) / (t1 - t0), y: p.n }));
  const tNow = +now();
  let mkIdx = 0; ph.pts.forEach((p, i) => { if (Math.abs(p.t - tNow) < Math.abs(ph.pts[mkIdx].t - tNow)) mkIdx = i; });

  const register = () => {
    update((s: any) => {
      s.injections.push({ t: +now(), med: s.profile.med, dose: s.profile.dose, site: nextSite(s), note: '' });
    });
  };

  const doseStr = nf(S.profile.dose, S.profile.dose % 1 ? 1 : 0);

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Aplicações</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{med.label} · {med.mol} · {med.cad === 'weekly' ? 'semanal' : 'diária'}</Txt>
        </View>
      </Row>

      {/* próxima aplicação */}
      <Card tint={c.accentWeak} style={{ marginTop: 18 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Row gap={6}><Icon name="syringe" size={14} color={c.accent} sw={2} /><Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>PRÓXIMA APLICAÇÃO</Txt></Row>
          <Pill label={siteLabel(site)} />
        </Row>
        <Row style={{ alignItems: 'baseline', marginTop: 12 }} gap={10}>
          <Txt v="h1" style={{ fontSize: 30 }}>{ndDays <= 0 ? 'Hoje' : ndDays === 1 ? 'Amanhã' : `Em ${ndDays} dias`}</Txt>
          <Txt v="bodyMed" c={c.tx3}>{fmtWD(nd)}, {fmtDate(nd)}</Txt>
        </Row>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 4 }}>Dose {doseStr} {med.unit} · sugerimos alternar para <Txt v="caption" c={c.tx}>{siteLabel(site)}</Txt></Txt>
        <Pressable onPress={register} style={({ pressed }) => [{ marginTop: 14, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
          <LinearGradient colors={[c.gradFrom, c.gradTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: radius.pill, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
            <Icon name="plus" size={17} color="#fff" sw={2.4} />
            <Txt v="title" c="#fff">Registrar aplicação</Txt>
          </LinearGradient>
        </Pressable>
      </Card>

      {/* constância */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Constância das aplicações</Txt>
      <Card>
        <Row style={{ justifyContent: 'space-between', marginBottom: 12 }}>
          <Row gap={6}><Icon name="cal" size={14} color={c.accent} sw={2} /><Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>ÚLTIMAS 6 SEMANAS</Txt></Row>
          <Pill label={`${ade}% em dia`} />
        </Row>
        <Row style={{ flexWrap: 'wrap' }}>
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
            <View key={`h${i}`} style={{ width: '14.28%', alignItems: 'center', paddingVertical: 4 }}>
              <Txt v="micro" c={c.tx4}>{d}</Txt>
            </View>
          ))}
          {cal.map((cell, i) => (
            <View key={i} style={{ width: '14.28%', alignItems: 'center', paddingVertical: 3 }}>
              <View style={{
                width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                backgroundColor: cell.applied ? c.accentWeak : 'transparent',
                borderWidth: cell.applied || cell.planned || cell.today ? 1.2 : 0,
                borderColor: cell.applied ? c.accentLine : cell.planned ? c.tx4 : c.accent2,
                borderStyle: cell.planned ? 'dashed' : 'solid',
              }}>
                <Txt v="micro" c={cell.applied ? c.accent : cell.today ? c.accent2 : c.tx3}>{cell.day}</Txt>
              </View>
            </View>
          ))}
        </Row>
        <Row gap={16} style={{ marginTop: 10 }}>
          <Row gap={5}><View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: c.accentWeak, borderWidth: 1, borderColor: c.accentLine }} /><Txt v="micro" c={c.tx3}>aplicada</Txt></Row>
          <Row gap={5}><View style={{ width: 10, height: 10, borderRadius: 3, borderWidth: 1, borderColor: c.tx4, borderStyle: 'dashed' }} /><Txt v="micro" c={c.tx3}>próxima</Txt></Row>
        </Row>
        <Txt v="micro" c={c.tx3} style={{ marginTop: 10, lineHeight: 16 }}>Sem culpa por um dia que passou — o que conta é retomar. Dá pra registrar uma aplicação anterior a qualquer momento.</Txt>
      </Card>

      {/* lembrete */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Lembrete de aplicação</Txt>
      <Card style={{ paddingVertical: 14 }} onPress={() => router.push('/lembretes' as any)}>
        <Row>
          <IconBadge name="bell" size={40} color={S.reminders.dose.on ? c.accent : c.tx4} bg={S.reminders.dose.on ? c.accentWeak : c.bg2} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Txt v="title">{S.reminders.dose.on ? 'Lembrete ativo' : 'Lembrete desativado'}</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{S.reminders.dose.on ? `Próximo: ${rem || 'quando chegar o dia'}` : 'Toque para configurar, no seu ritmo'}</Txt>
          </View>
          <Chevron />
        </Row>
      </Card>

      {/* linha farmacológica */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Linha farmacológica</Txt>
      <Card>
        <AreaCurve pts={phPts} height={130} marker={mkIdx} id="ph" />
        <Txt v="caption" c={c.tx3} style={{ marginTop: 8, lineHeight: 18 }}>Nível estimado de {med.mol.toLowerCase()} no corpo. Meia-vida ~{med.hl >= 1 ? `${med.hl} dias` : '13 h'}. O ponto mais baixo, antes da próxima dose, costuma ser quando a fome aumenta.</Txt>
      </Card>

      {/* estoque */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Estoque da caneta</Txt>
      <Card style={{ paddingVertical: 14 }}>
        <Row>
          <IconBadge name="pill" size={40} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Txt v="title">{med.label} {doseStr} {med.unit}</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>Validade jun/2026 · lote 2K4F1</Txt>
          </View>
          <Pill label="3 doses" />
        </Row>
      </Card>

      {/* histórico */}
      <Txt v="h2" style={{ marginTop: 24, marginBottom: 10 }}>Histórico</Txt>
      <Card style={{ paddingVertical: 8 }}>
        <Row style={{ paddingVertical: 10 }}>
          <View style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1.4, borderColor: c.accent2, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="syringe" size={14} color={c.accent2} sw={2} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Txt v="title">Próxima · {siteLabel(site)}</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{relDay(nd).charAt(0).toUpperCase() + relDay(nd).slice(1)} · {fmtDate(nd)} · {doseStr} {med.unit}</Txt>
          </View>
        </Row>
        {S.injections.slice().reverse().map((i: any, idx: number) => (
          <View key={i.t}>
            <Divider style={{ marginLeft: 42 }} />
            <Row style={{ paddingVertical: 10 }}>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" size={14} color={c.accent} sw={2.4} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Txt v="title">{nf(i.dose, i.dose % 1 ? 1 : 0)} {med.unit} · {siteLabel(i.site)}</Txt>
                  <Txt v="caption" c={c.tx3}>{fmtDate(new Date(i.t))}</Txt>
                </Row>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{relDay(new Date(i.t))}</Txt>
              </View>
            </Row>
          </View>
        ))}
      </Card>
    </Screen>
  );
}
