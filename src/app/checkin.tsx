import React, { useState } from 'react';
import { View, Pressable, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import { startOfDay, now } from '../logic/time';
import { Txt, Card, Row, IconBadge, CircleBtn } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { space, radius } from '../theme';

type Key = 'fome' | 'enjoo' | 'energia' | 'humor' | 'compulsao';
const METRICS: { key: Key; label: string; ic: string; q: (v: number) => string }[] = [
  { key: 'fome', label: 'Fome', ic: 'utensils', q: (v) => (v <= 3 ? 'Baixa' : v <= 6 ? 'Moderada' : 'Alta') },
  { key: 'enjoo', label: 'Enjoo', ic: 'frown', q: (v) => (v <= 2 ? 'Leve' : v <= 6 ? 'Moderado' : 'Forte') },
  { key: 'energia', label: 'Energia', ic: 'bolt', q: (v) => (v <= 3 ? 'Baixa' : v <= 6 ? 'Média' : 'Alta') },
  { key: 'humor', label: 'Humor', ic: 'mood', q: (v) => (v <= 3 ? 'Baixo' : v <= 6 ? 'Neutro' : 'Bom') },
  { key: 'compulsao', label: 'Compulsão', ic: 'brain', q: (v) => (v <= 2 ? 'Leve' : v <= 6 ? 'Média' : 'Alta') },
];
const TILES: [string, string, string][] = [
  ['water', 'Água', '1,2 L'], ['dumbbell', 'Treino', 'Sim'],
  ['moon', 'Sono', '7h 20min'], ['gut', 'Evacuação', 'Sim'],
  ['leaf', 'Proteína', '75 g'], ['scale', 'Peso', '70,3 kg'],
];

export default function Checkin() {
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const update = useStore((s) => s.update);
  const [vals, setVals] = useState<Record<Key, number>>({ fome: 6, enjoo: 2, energia: 8, humor: 5, compulsao: 2 });
  const [focus, setFocus] = useState<Key>('fome');
  const [note, setNote] = useState('');

  const save = () => {
    update((s: any) => {
      const t = +startOfDay(now());
      s.checkins = s.checkins.filter((x: any) => x.t !== t);
      s.checkins.push({ t, fome: vals.fome, nausea: vals.enjoo, energia: vals.energia, mood: Math.max(1, Math.round(vals.humor / 2)), compulsao: vals.compulsao, sono: 7, agua: 6, prot: 75, exerc: 0, gut: 'normal', refluxo: 0, ansiedade: 0, constip: 0, note });
      s.heroSeen = { milestone: 0, insight: null, replay: null };
    });
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 6, paddingBottom: 130, paddingHorizontal: space.lg }} showsVerticalScrollIndicator={false}>
        {/* header */}
        <Row style={{ justifyContent: 'space-between' }}>
          <CircleBtn name="x" onPress={() => router.back()} />
          <View style={{ alignItems: 'center' }}>
            <Txt v="title">Check-in rápido</Txt>
            <Txt v="micro" c={c.tx3}>Leva menos de 15 segundos</Txt>
          </View>
          <CircleBtn name="info" />
        </Row>

        <View style={{ marginTop: 18 }}>
          <Txt v="display" style={{ fontSize: 28 }}>Como você está agora?</Txt>
          <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 4 }}>Toque e deslize para registrar.</Txt>
        </View>

        {/* chip selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16, marginHorizontal: -space.lg }} contentContainerStyle={{ paddingHorizontal: space.lg, gap: 10 }}>
          {METRICS.map((m) => {
            const on = focus === m.key;
            return (
              <Pressable key={m.key} onPress={() => setFocus(m.key)} style={{ width: 74, alignItems: 'center', backgroundColor: c.bg1, borderRadius: radius.lg, borderWidth: 1.4, borderColor: on ? c.accent : c.line, paddingVertical: 12 }}>
                <Icon name={m.ic} size={22} color={on ? c.accent : c.tx3} sw={1.8} />
                <Txt v="caption" c={on ? c.accent : c.tx3} style={{ marginTop: 6 }} numberOfLines={1}>{m.label}</Txt>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* sliders */}
        <View style={{ marginTop: 16, gap: 10 }}>
          {METRICS.map((m) => {
            const v = vals[m.key]; const on = focus === m.key;
            return (
              <View key={m.key} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, borderWidth: 1.4, borderColor: on ? c.accentLine : c.line, padding: 14 }}>
                <Row>
                  <IconBadge name={m.ic} size={40} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Txt v="title">{m.label}</Txt>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Txt v="h2" c={c.accent}>{v}</Txt>
                        <Txt v="micro" c={c.tx3}>{m.q(v)}</Txt>
                      </View>
                    </Row>
                    <Slider
                      style={{ width: '100%', height: 30, marginTop: 2 }}
                      minimumValue={0} maximumValue={10} step={1} value={v}
                      onValueChange={(nv) => { setFocus(m.key); setVals((s) => ({ ...s, [m.key]: Math.round(nv) })); }}
                      minimumTrackTintColor={c.accent} maximumTrackTintColor={c.track} thumbTintColor={c.accent}
                    />
                  </View>
                </Row>
              </View>
            );
          })}
        </View>

        {/* mini tiles */}
        <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 12 }}>
          {TILES.map(([ic, label, val]) => (
            <View key={label} style={{ width: '48.5%', backgroundColor: c.bg1, borderRadius: radius.md, borderWidth: 1, borderColor: c.line, padding: 12, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
              <IconBadge name={ic} size={34} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Txt v="caption" c={c.tx3}>{label}</Txt>
                <Txt v="title" style={{ marginTop: 1 }}>{val}</Txt>
              </View>
              <Icon name="check" size={18} color={c.good} sw={2} />
            </View>
          ))}
        </Row>

        {/* obs */}
        <View style={{ marginTop: 14, backgroundColor: c.bg1, borderRadius: radius.md, borderWidth: 1, borderColor: c.line, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="pencil" size={16} color={c.tx4} sw={1.7} />
          <TextInput
            value={note} onChangeText={setNote} placeholder="Adicionar observações..." placeholderTextColor={c.tx4}
            style={{ flex: 1, marginLeft: 10, paddingVertical: 15, color: c.tx, fontFamily: 'Inter_400Regular', fontSize: 15 }}
          />
        </View>
      </ScrollView>

      {/* save button (fixed) */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: space.lg, paddingBottom: (insets.bottom || 10) + 8, paddingTop: 10, backgroundColor: c.bg }}>
        <Pressable onPress={save} style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
          <LinearGradient colors={[c.gradFrom, c.gradTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: radius.pill, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
            <Icon name="check" size={20} color="#fff" sw={2.4} />
            <Txt v="title" c="#fff">Salvar check-in</Txt>
          </LinearGradient>
        </Pressable>
        <Row gap={5} style={{ justifyContent: 'center', marginTop: 10 }}>
          <Icon name="lock" size={12} color={c.tx4} sw={1.7} />
          <Txt v="micro" c={c.tx4}>Seus dados são privados e seguros</Txt>
        </Row>
      </View>
    </View>
  );
}
