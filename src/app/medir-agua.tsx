import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { waterMlToday, CUP_ML, registroDoDia } from '../logic/derive';
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
  const [escolhido, setEscolhido] = useState(250);

  const alvo = (S.profile as any).targets.waterMl as number;
  const atual = waterMlToday(S);
  const pct = Math.max(0, Math.min(1, atual / alvo));
  const L = (ml: number) => (ml / 1000).toFixed(1).replace('.', ',');

  const beber = (ml: number) => {
    update((s: any) => {
      const t = +startOfDay(now());
      /* Registrar água diz uma coisa só: quanta água. Antes, criar o
         registro do dia aqui afirmava junto sono 7, humor 3 e fome 5 —
         estado que ninguém perguntou. registroDoDia traz só o recipiente. */
      const ci = registroDoDia(s, t);
      ci.agua = (ci.agua || 0) + ml / CUP_ML;
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

      {/* medida na mão — para quem bebeu um copo pela metade ou uma
          garrafa e meia, que os atalhos não cobrem */}
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18, marginTop: 7 }}>
        <Row style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Txt v="caption" c={c.tx3}>Quantidade</Txt>
          <Metric value={`${escolhido}`} unit="ml" v="h2" />
        </Row>
        <Slider
          value={escolhido}
          minimumValue={50} maximumValue={1500} step={50}
          onValueChange={setEscolhido}
          minimumTrackTintColor={c.accent}
          maximumTrackTintColor={c.bg2}
          thumbTintColor={c.accent}
          style={{ marginTop: 8, marginHorizontal: -6 }}
        />
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt v="micro" c={c.tx4}>50 ml</Txt>
          <Txt v="micro" c={c.tx4}>1,5 L</Txt>
        </Row>
        <Pressable onPress={() => beber(escolhido)} style={({ pressed }) => [{ marginTop: 14, opacity: pressed ? 0.8 : 1 }]}>
          <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 14, alignItems: 'center' }}>
            <Txt v="body" c={c.accentInk}>Adicionar {escolhido} ml</Txt>
          </View>
        </Pressable>
      </View>

      <Row gap={10} style={{ marginTop: 22, marginBottom: 12 }}>
        <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>MEDIDAS COMUNS</Txt>
        <View style={{ flex: 1, height: 1, backgroundColor: c.line }} />
      </Row>

      <Row gap={7} style={{ alignItems: 'stretch' }}>
        {MEDIDAS.map(([nome, ml, ic]) => (
          <Pressable key={nome} onPress={() => beber(ml as number)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
            <View style={{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 14, alignItems: 'center' }}>
              <Icon name={ic as string} size={20} color={c.accent} sw={1.9} />
              <Txt v="caption" style={{ marginTop: 8 }}>{nome}</Txt>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 2 }}>{ml} ml</Txt>
            </View>
          </Pressable>
        ))}
      </Row>
    </SheetScreen>
  );
}
