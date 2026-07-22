import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useStore } from '../logic/store';
import { fmtDate } from '../logic/time';
import { Screen, Txt, Card, Row, CircleBtn, Pill, Rich } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

const REGIONS = ['Rosto', 'Abdômen', 'Cintura', 'Braços', 'Pernas'];
const PERSON = 'M30 12c6 0 10 4 10 10 0 4-2 7-2 10 4 2 11 5 13 12l4 16c1 4-5 6-7 2l-5-15-2 30c0 5-9 5-10 0l-1-16-1 16c-1 5-10 5-10 0l-2-30-5 15c-2 4-8 2-7-2l4-16c2-7 9-10 13-12 0-3-2-6-2-10 0-6 4-10 10-10z';

function PhotoLayer({ tag, bg }: { tag: string; bg: string }) {
  const { c } = useTheme();
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Svg viewBox="0 0 60 80" width="58%" height="80%" opacity={0.5}>
        <Path d={PERSON} fill={c.tx4} opacity={0.32} />
      </Svg>
      <View style={{ position: 'absolute', bottom: 10, left: 10 }}><Pill label={tag} color={c.tx2} bg={c.bg1} /></View>
    </View>
  );
}

export default function Fotos() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const [reveal, setReveal] = useState(50);
  const [region, setRegion] = useState(0);
  const [boxW, setBoxW] = useState(0);
  const ph = S.photos;

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Evolução visual</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Antes e depois, com a IA apontando o que mudou</Txt>
        </View>
      </Row>

      {/* comparador */}
      <Card style={{ marginTop: 18 }}>
        <Row style={{ justifyContent: 'space-between', marginBottom: 12 }}>
          <Pill label={`início · ${fmtDate(new Date(ph[0].t))}`} color={c.tx3} bg={c.bg2} />
          <Pill label={`agora · ${fmtDate(new Date(ph[ph.length - 1].t))}`} />
        </Row>
        <View
          onLayout={(e) => setBoxW(e.nativeEvent.layout.width)}
          style={{ aspectRatio: 3 / 4, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: c.line }}
        >
          <PhotoLayer tag="depois" bg={c.accentWeak} />
          <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: (reveal / 100) * boxW, overflow: 'hidden' }}>
            <View style={{ width: boxW, height: '100%' }}><PhotoLayer tag="antes" bg={c.bg3} /></View>
          </View>
          <View style={{ position: 'absolute', top: 0, bottom: 0, left: `${reveal}%`, width: 2, backgroundColor: c.accent }} />
        </View>
        <Slider
          style={{ width: '100%', height: 34, marginTop: 12 }}
          minimumValue={0} maximumValue={100} value={reveal}
          onValueChange={(v) => setReveal(Math.round(v))}
          minimumTrackTintColor={c.accent} maximumTrackTintColor={c.track} thumbTintColor={c.accent}
        />
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt v="micro" c={c.tx4}>antes</Txt>
          <Txt v="micro" c={c.tx4}>arraste para comparar</Txt>
          <Txt v="micro" c={c.tx4}>depois</Txt>
        </Row>
      </Card>

      {/* IA comparou */}
      <Card tint={c.accentWeak} style={{ marginTop: 14 }}>
        <Row gap={7}><Icon name="aura" size={14} color={c.accent} sw={2} /><Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>A IA COMPAROU</Txt></Row>
        <Rich v="bodyMed" base={c.tx2} bold={c.tx} style={{ marginTop: 8, lineHeight: 21 }} text="Mudanças mais visíveis no <b>rosto</b> e na <b>cintura</b>. Contorno do abdômen mais definido e postura mais ereta nas fotos recentes." />
      </Card>

      {/* por região */}
      <Txt v="h2" style={{ marginTop: 22, marginBottom: 10 }}>Por região</Txt>
      <Row gap={8} style={{ flexWrap: 'wrap' }}>
        {REGIONS.map((r, i) => (
          <Pressable key={r} onPress={() => setRegion(i)}>
            <View style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: region === i ? c.accentWeak : c.bg1, borderWidth: 1.2, borderColor: region === i ? c.accent : c.line }}>
              <Txt v="label" c={region === i ? c.accent : c.tx3}>{r}</Txt>
            </View>
          </Pressable>
        ))}
      </Row>

      {/* linha do tempo */}
      <Txt v="h2" style={{ marginTop: 22, marginBottom: 10 }}>Linha do tempo</Txt>
      <Row gap={10}>
        {ph.map((p: any) => (
          <View key={p.t} style={{ alignItems: 'center' }}>
            <View style={{ width: 84, aspectRatio: 3 / 4, borderRadius: radius.sm, backgroundColor: c.bg3, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="photo" size={22} color={c.tx4} sw={1.6} />
            </View>
            <Txt v="micro" c={c.tx3} style={{ marginTop: 5 }}>{p.tag}</Txt>
          </View>
        ))}
      </Row>

      <Pressable style={({ pressed }) => [{ marginTop: 18, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
        <LinearGradient colors={[c.gradFrom, c.gradTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: radius.pill, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
          <Icon name="camera" size={16} color="#fff" sw={2} />
          <Txt v="title" c="#fff">Adicionar foto de progresso</Txt>
        </LinearGradient>
      </Pressable>
    </Screen>
  );
}
