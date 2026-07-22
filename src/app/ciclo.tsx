import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import { DAY, MO, startOfDay, now, diffDays, fmtTime } from '../logic/time';
import { doseCycle, lastInjection, pharmaLevel, M } from '../logic/derive';
import { Screen, Txt, Card, Pill, IconBadge, Row, Chevron, CircleBtn, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { Ring, AreaCurve } from '../ui/charts';
import { useTheme } from '../ui/useTheme';
import { space, radius } from '../theme';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const INTENSITY: Record<string, string> = { aplic: 'Aplicação feita', pico: 'Efeito forte', estab: 'Efeito estável', retorno: 'Efeito diminuindo', pre: 'Efeito baixo' };
const DESC: Record<string, string> = {
  aplic: 'Logo após a aplicação o efeito começa a subir. Uma náusea leve pode aparecer nos primeiros dias.',
  pico: 'No pico de efeito é comum sentir menos fome, mais saciedade e menos vontade de doces.',
  estab: 'Na estabilidade o efeito se mantém constante. Um bom momento para firmar seus hábitos.',
  retorno: 'No início do retorno da fome, a vontade de comer tende a subir. Reforce proteína e hidratação.',
  pre: 'Na pré-aplicação o efeito está no ponto mais baixo. A fome pode ficar mais forte até a próxima dose.',
};

export default function Ciclo() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();

  const cyc = doseCycle(S);
  const li = lastInjection(S);
  const injD = li ? new Date(li.t) : now();
  const med = M(S);

  const SYMS: Record<string, [string, string, string, string][]> = {
    aplic: [['utensils', 'Fome', 'Média', c.accent], ['gut', 'Enjoo', 'Leve', c.rose], ['bolt', 'Energia', 'Boa', c.amber], ['mood', 'Humor', 'Bom', c.water], ['cupcake', 'Vontade de doce', 'Média', c.purple]],
    pico: [['utensils', 'Fome', 'Baixa', c.accent], ['gut', 'Enjoo', 'Leve', c.rose], ['bolt', 'Energia', 'Alta', c.amber], ['mood', 'Humor', 'Bom', c.water], ['cupcake', 'Vontade de doce', 'Baixa', c.purple]],
    estab: [['utensils', 'Fome', 'Baixa', c.accent], ['gut', 'Enjoo', 'Nenhum', c.rose], ['bolt', 'Energia', 'Alta', c.amber], ['mood', 'Humor', 'Bom', c.water], ['cupcake', 'Vontade de doce', 'Baixa', c.purple]],
    retorno: [['utensils', 'Fome', 'Subindo', c.accent], ['gut', 'Enjoo', 'Nenhum', c.rose], ['bolt', 'Energia', 'Boa', c.amber], ['mood', 'Humor', 'Bom', c.water], ['cupcake', 'Vontade de doce', 'Média', c.purple]],
    pre: [['utensils', 'Fome', 'Alta', c.accent], ['gut', 'Enjoo', 'Nenhum', c.rose], ['bolt', 'Energia', 'Média', c.amber], ['mood', 'Humor', 'Neutro', c.water], ['cupcake', 'Vontade de doce', 'Alta', c.purple]],
  };
  const syms = SYMS[cyc.phase.key] || SYMS.estab;

  // previsão do ciclo — nível farmacológico normalizado sobre 1 ciclo
  const inj = +startOfDay(injD);
  const N = 40; const raw: number[] = [];
  for (let i = 0; i <= N; i++) raw.push(pharmaLevel(S, inj + (i / N) * cyc.total * DAY));
  const mx = Math.max(...raw) || 1;
  const cpts = raw.map((v, i) => ({ x: i / N, y: v / mx }));
  const marker = Math.max(0, Math.min(N, Math.round(((cyc.dayIn - 1) / cyc.total) * N)));
  const XLAB = ['Aplic.', 'Dias 1–2', 'Dias 3–4', 'Dias 5–6', 'Dias 7+'];

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', marginTop: 4 }}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <CircleBtn name="info" />
      </Row>

      <View style={{ marginTop: 12 }}>
        <Txt v="display">Ciclo da dose</Txt>
        <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 6, maxWidth: '86%' }}>Acompanhe seu ciclo e entenda como seu corpo responde.</Txt>
      </View>

      {/* med card */}
      <Card onPress={() => router.push('/proxima-aplicacao')} style={{ marginTop: 16, paddingVertical: 14 }}>
        <Row>
          <IconBadge name="syringe" size={42} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Txt v="title" c={c.accent}>{med.label} {S.profile.dose} {med.unit}</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Aplicada em {injD.getDate()} {cap(MO[injD.getMonth()])}, {fmtTime(injD)}</Txt>
          </View>
          <Chevron />
        </Row>
      </Card>

      {/* hero: dia N de total + ring */}
      <Card style={{ marginTop: 14, overflow: 'hidden' }}>
        <LinearGradient colors={['rgba(15,185,129,0.09)', 'rgba(46,134,199,0.04)', 'rgba(255,255,255,0)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
        <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Txt v="label" c={c.accent}>Você está em</Txt>
            <Txt v="display" style={{ fontSize: 34, lineHeight: 38, marginTop: 2 }}>Dia {cyc.dayIn} <Txt v="h2" c={c.tx3}>de {cyc.total}</Txt></Txt>
            <Txt v="title" style={{ marginTop: 4 }}>{cyc.phase.label}</Txt>
            <View style={{ marginTop: 10 }}><Pill label={INTENSITY[cyc.phase.key]} /></View>
          </View>
          <Ring size={112} stroke={12} pct={(cyc.dayIn / cyc.total) * 100} id="cyc">
            <View style={{ alignItems: 'center' }}>
              <Icon name="syringe" size={20} color={c.accent} sw={1.8} />
              <Txt v="h1" style={{ fontSize: 24, lineHeight: 26, marginTop: 2 }}>{cyc.dayIn}</Txt>
              <Txt v="micro" c={c.tx3}>de {cyc.total}</Txt>
            </View>
          </Ring>
        </Row>

        {/* stepper */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 18, marginHorizontal: -space.lg }} contentContainerStyle={{ paddingHorizontal: space.lg }}>
          {cyc.phases.map((p, i) => {
            const done = i < cyc.idx, active = i === cyc.idx;
            const fg = active ? c.accentInk : done ? c.accent : c.tx4;
            const bg = active ? c.accent : done ? c.accentWeak : c.bg2;
            return (
              <View key={p.key} style={{ width: 92, alignItems: 'center' }}>
                <Row style={{ width: '100%', justifyContent: 'center' }}>
                  {i > 0 && <View style={{ position: 'absolute', left: 0, right: '50%', top: 18, height: 2, backgroundColor: i <= cyc.idx ? c.accent : c.line2 }} />}
                  {i < cyc.phases.length - 1 && <View style={{ position: 'absolute', left: '50%', right: 0, top: 18, height: 2, backgroundColor: i < cyc.idx ? c.accent : c.line2 }} />}
                  <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', borderWidth: done ? 0 : active ? 0 : 1.4, borderColor: c.line2 }}>
                    <Icon name={done ? 'check' : p.ic} size={18} color={fg} sw={1.9} />
                  </View>
                </Row>
                <Txt v="caption" c={active ? c.tx : c.tx3} style={{ marginTop: 8, textAlign: 'center', fontFamily: active ? undefined : undefined }} numberOfLines={2}>{p.label}</Txt>
                <Txt v="micro" c={c.tx4} style={{ marginTop: 2 }}>{p.range}</Txt>
              </View>
            );
          })}
        </ScrollView>
      </Card>

      {/* insight da fase */}
      <Card tint={c.accentWeak} onPress={() => router.push('/proxima-aplicacao')} style={{ marginTop: 14 }}>
        <Row>
          <IconBadge name="spark" size={40} bg={c.bg1} />
          <Txt v="bodyMed" c={c.tx2} style={{ flex: 1, marginLeft: 12 }}>{DESC[cyc.phase.key]}</Txt>
          <Chevron />
        </Row>
      </Card>

      {/* o que você pode sentir */}
      <View style={{ marginTop: 22 }}>
        <Txt v="h2">O que você pode sentir</Txt>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14, marginHorizontal: -space.lg }} contentContainerStyle={{ paddingHorizontal: space.lg, gap: 10 }}>
          {syms.map(([ic, label, val, color]) => (
            <View key={label} style={{ width: 110, backgroundColor: c.bg1, borderRadius: radius.lg, borderWidth: 1, borderColor: c.line, padding: 14, alignItems: 'center' }}>
              <IconBadge name={ic} size={40} color={color} bg={color + '18'} />
              <Txt v="caption" c={c.tx3} style={{ marginTop: 8 }} numberOfLines={2}>{label}</Txt>
              <Txt v="title" style={{ marginTop: 1 }}>{val}</Txt>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* previsão do ciclo */}
      <Card style={{ marginTop: 20 }}>
        <Txt v="h2">Previsão do seu ciclo</Txt>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Baseado no comportamento típico da {med.mol.toLowerCase()}.</Txt>
        <View style={{ marginTop: 8 }}><AreaCurve pts={cpts} marker={marker} height={140} id="cyc2" /></View>
        <Row style={{ justifyContent: 'space-between', marginTop: 2, paddingHorizontal: 2 }}>
          {XLAB.map((l) => <Txt key={l} v="micro" c={c.tx4}>{l}</Txt>)}
        </Row>
      </Card>

      {/* dica */}
      <Card tint={c.accentWeak} style={{ marginTop: 14 }}>
        <Row>
          <IconBadge name="leaf" size={40} bg={c.bg1} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Txt v="title">Dica para esta fase</Txt>
            <Txt v="bodyMed" c={c.tx2} style={{ marginTop: 3 }}>Priorize proteína, hidratação e sono de qualidade para potencializar os efeitos da medicação.</Txt>
          </View>
        </Row>
      </Card>
    </Screen>
  );
}
