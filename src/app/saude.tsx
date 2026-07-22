import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import { vitalLast } from '../logic/derive';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Pill } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { AreaCurve } from '../ui/charts';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

// faixas de referência dos vitais: [minEscala, maxEscala, normalLo, normalHi]
const VITAL_G: Record<string, [number, number, number, number]> = {
  fc: [45, 120, 60, 100], spo2: [85, 100, 94, 100], fr: [8, 28, 12, 20], glic: [60, 140, 70, 99],
};

function MiniGauge({ k, num }: { k: string; num: number }) {
  const { c } = useTheme();
  const [min, max, lo, hi] = VITAL_G[k];
  const clamp = (x: number) => Math.max(3, Math.min(97, ((x - min) / (max - min)) * 100));
  const ok = num >= lo && num <= hi;
  return (
    <View style={{ height: 6, borderRadius: 3, backgroundColor: c.track, marginTop: 12 }}>
      <View style={{ position: 'absolute', left: `${clamp(lo)}%`, width: `${clamp(hi) - clamp(lo)}%`, top: 0, bottom: 0, borderRadius: 3, backgroundColor: c.accentWeak, borderWidth: 1, borderColor: c.accentLine }} />
      <View style={{ position: 'absolute', left: `${clamp(num)}%`, top: -2.5, width: 11, height: 11, marginLeft: -5.5, borderRadius: 6, backgroundColor: ok ? c.accent : c.cta, borderWidth: 2.5, borderColor: c.bg1 }} />
    </View>
  );
}

export default function Saude() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();

  const pa = vitalLast(S, 'pa'), fc = vitalLast(S, 'fc'), gl = vitalLast(S, 'glic'), sp = vitalLast(S, 'spo2'), fr = vitalLast(S, 'fr');
  const norm = (arr: number[]) => { const mn = Math.min(...arr), mx = Math.max(...arr), pad = (mx - mn) * 0.3 || 1; return arr.map((v, i) => ({ x: i / (arr.length - 1 || 1), y: (v - (mn - pad)) / ((mx + pad) - (mn - pad)) })); };
  const paPts = norm(S.vitals.pa.map((x: any) => x.sys));
  const glPts = norm(S.vitals.glic.map((x: any) => x.v));

  const tiles: { k: string; label: string; val: string; num: number; ic: string }[] = [
    { k: 'fc', label: 'Freq. cardíaca', val: `${fc.v} bpm`, num: fc.v, ic: 'clock' },
    { k: 'spo2', label: 'Saturação O2', val: `${sp.v}%`, num: sp.v, ic: 'drop2' },
    { k: 'fr', label: 'Freq. respiratória', val: `${fr.v} rpm`, num: fr.v, ic: 'full' },
    { k: 'glic', label: 'Glicemia jejum', val: `${gl.v} mg/dL`, num: gl.v, ic: 'water' },
  ];

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Saúde & sinais vitais</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Indicadores que melhoram junto com o peso</Txt>
        </View>
      </Row>

      {/* pressão arterial */}
      <Card style={{ marginTop: 18 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Row gap={6}><Icon name="heart" size={14} color={c.accent} sw={2} /><Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>PRESSÃO ARTERIAL</Txt></Row>
          <Pill label="melhorando" />
        </Row>
        <Txt v="h1" style={{ fontSize: 30, marginTop: 8 }}>{pa.sys}/{pa.dia}<Txt v="label" c={c.tx3}> mmHg</Txt></Txt>
        <View style={{ marginTop: 8 }}><AreaCurve pts={paPts} height={80} padT={10} padB={10} marker={paPts.length - 1} nodes id="pa" /></View>
        <Txt v="micro" c={c.tx3} style={{ marginTop: 6 }}>De 138/88 no início do tratamento.</Txt>
      </Card>

      {/* tiles 2×2 */}
      <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 4 }}>
        {tiles.map((t) => {
          const [, , lo, hi] = VITAL_G[t.k];
          const ok = t.num >= lo && t.num <= hi;
          return (
            <View key={t.k} style={{ width: '48.5%', backgroundColor: c.bg1, borderRadius: radius.lg, borderWidth: 1, borderColor: c.line, padding: 14, marginTop: 10 }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <IconBadge name={t.ic} size={34} />
                <Pill label={ok ? 'normal' : t.num < lo ? 'baixo' : 'alto'} color={ok ? c.accent : c.cta} bg={ok ? c.accentWeak : c.ctaWeak} />
              </Row>
              <Txt v="h2" style={{ marginTop: 12 }}>{t.val}</Txt>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 2 }}>{t.label}</Txt>
              <MiniGauge k={t.k} num={t.num} />
            </View>
          );
        })}
      </Row>

      {/* glicemia */}
      <Card style={{ marginTop: 14 }}>
        <Row gap={6}><Icon name="water" size={14} color={c.water} sw={2} /><Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>GLICEMIA DE JEJUM</Txt></Row>
        <View style={{ marginTop: 8 }}><AreaCurve pts={glPts} height={90} padT={10} padB={10} marker={glPts.length - 1} nodes strokeFrom={c.water} strokeTo={c.accent2} id="gl" /></View>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 6 }}>De 112 para {gl.v} mg/dL — de volta à faixa normal.</Txt>
      </Card>

      {/* withings */}
      <Card style={{ marginTop: 14, paddingVertical: 14 }}>
        <Row>
          <IconBadge name="check" size={40} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Txt v="title">Withings conectada</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>Peso e pressão sincronizam sozinhos</Txt>
          </View>
        </Row>
      </Card>

      <Pressable style={({ pressed }) => [{ marginTop: 16, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
        <LinearGradient colors={[c.gradFrom, c.gradTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: radius.pill, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
          <Icon name="plus" size={16} color="#fff" sw={2.4} />
          <Txt v="title" c="#fff">Registrar medição</Txt>
        </LinearGradient>
      </Pressable>
    </Screen>
  );
}
