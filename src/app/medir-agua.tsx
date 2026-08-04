import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { waterMlToday, CUP_ML } from '../logic/derive';
import { now, startOfDay } from '../logic/time';
import { Txt, Row, SheetScreen, Metric } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* Quanto de água — antes o atalho somava um copo às cegas. Perguntar
   quanto custa um toque a mais e é a diferença entre registro e chute. */
const MEDIDAS: [string, number, string][] = [
  ['Copo', 250, 'water'],
  ['Garrafa', 500, 'water'],
  ['Garrafão', 1000, 'water'],
];

export default function MedirAgua() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const [somado, setSomado] = useState(0);

  const alvo = (S.profile as any).targets.waterMl as number;
  const atual = waterMlToday(S);
  const pct = Math.max(0, Math.min(1, atual / alvo));
  const L = (ml: number) => (ml / 1000).toFixed(1).replace('.', ',');

  const beber = (ml: number) => {
    update((s: any) => {
      const t = +startOfDay(now());
      const ci = s.checkins.find((x: any) => x.t === t);
      const copos = ml / CUP_ML;
      if (ci) ci.agua = (ci.agua || 0) + copos;
      else s.checkins.push({ t, mood: 3, fome: 5, nausea: 0, sono: 7, gut: 'normal', energia: 6, agua: copos, prot: 0, exerc: 0, refluxo: 0, ansiedade: 0, constip: 0 });
    });
    setSomado((v) => v + ml);
  };

  return (
    <SheetScreen titulo="Quanto você bebeu?" sub="Toque quantas vezes precisar" onClose={() => router.back()}>
      {/* onde está agora */}
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18, marginTop: 18 }}>
        <Row style={{ alignItems: 'flex-end' }}>
          <Metric value={L(atual)} unit="L" />
          <View style={{ flex: 1 }} />
          <Txt v="note" c={c.tx3}>de {L(alvo)} L hoje</Txt>
        </Row>
        <View style={{ height: 6, borderRadius: radius.pill, backgroundColor: c.bg2, overflow: 'hidden', marginTop: 14 }}>
          <View style={{ width: `${Math.max(2, pct * 100)}%`, height: 6, borderRadius: radius.pill, backgroundColor: c.accent }} />
        </View>
        {somado > 0 && (
          <Row gap={7} style={{ marginTop: 12 }}>
            <Icon name="check" size={14} color={c.accent} sw={2.4} />
            <Txt v="caption" c={c.accent}>+{somado >= 1000 ? `${L(somado)} L` : `${somado} ml`} agora</Txt>
          </Row>
        )}
      </View>

      <Row gap={7} style={{ marginTop: 7, alignItems: 'stretch' }}>
        {MEDIDAS.map(([nome, ml, ic]) => (
          <Pressable key={nome} onPress={() => beber(ml as number)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
            <View style={{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16, alignItems: 'center' }}>
              <Icon name={ic as string} size={22} color={c.accent} sw={1.9} />
              <Txt v="body" style={{ marginTop: 10 }}>{nome}</Txt>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 2 }}>{ml} ml</Txt>
            </View>
          </Pressable>
        ))}
      </Row>

      <Pressable onPress={() => router.back()} style={({ pressed }) => [{ marginTop: 16, opacity: pressed ? 0.8 : 1 }]}>
        <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' }}>
          <Txt v="body" c={c.accentInk}>Pronto</Txt>
        </View>
      </Pressable>
    </SheetScreen>
  );
}
