import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { checkinToday } from '../logic/derive';
import { now, startOfDay } from '../logic/time';
import { Txt, Row, SheetScreen, Metric } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* Quanto de movimento — o atalho antigo somava 30 min fixos, o que dava
   no mesmo para uma caminhada curta e para uma hora de academia. */
const TIPOS: [string, string][] = [
  ['journey', 'Caminhada'],
  ['dumbbell', 'Musculação'],
  ['activity', 'Cardio'],
  ['aura', 'Alongamento'],
];
const MINUTOS = [15, 30, 45, 60];

export default function MedirExercicio() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const [tipo, setTipo] = useState('Caminhada');
  const [min, setMin] = useState(30);

  const ci = checkinToday(S);
  const alvo = (S.profile as any).targets.exercMin as number;
  const hoje = ci?.exerc || 0;

  const salvar = () => {
    update((s: any) => {
      const t = +startOfDay(now());
      const c2 = s.checkins.find((x: any) => x.t === t);
      if (c2) c2.exerc = (c2.exerc || 0) + min;
      else s.checkins.push({ t, mood: 3, fome: 5, nausea: 0, sono: 7, gut: 'normal', energia: 6, agua: 0, prot: 0, exerc: min, refluxo: 0, ansiedade: 0, constip: 0 });
    });
    router.back();
  };

  return (
    <SheetScreen titulo="Como você se movimentou?" sub={`${hoje} de ${alvo} min hoje`} onClose={() => router.back()}>
      <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 18 }}>
        {TIPOS.map(([ic, nome]) => {
          const on = tipo === nome;
          return (
            <Pressable key={nome} onPress={() => setTipo(nome)} style={({ pressed }) => [{ width: '49%', opacity: pressed ? 0.7 : 1 }]}>
              <Row gap={10} style={{ backgroundColor: on ? c.accentWeak : c.bg1, borderWidth: 1, borderColor: on ? c.accentLine : 'transparent', borderRadius: radius.lg, padding: 14, marginBottom: 7 }}>
                <Icon name={ic} size={18} color={on ? c.accent : c.tx3} sw={1.9} />
                <Txt v="caption" c={on ? c.accent : c.tx}>{nome}</Txt>
              </Row>
            </Pressable>
          );
        })}
      </Row>

      <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1, marginTop: 14 }}>POR QUANTO TEMPO</Txt>
      <Row gap={7} style={{ marginTop: 10 }}>
        {MINUTOS.map((m) => {
          const on = min === m;
          return (
            <Pressable key={m} onPress={() => setMin(m)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
              <View style={{ backgroundColor: on ? c.accent : c.bg1, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center' }}>
                <Metric value={`${m}`} v="h2" tone={on ? c.accentInk : c.tx} />
                <Txt v="micro" c={on ? c.accentInk : c.tx3} style={{ marginTop: 2 }}>min</Txt>
              </View>
            </Pressable>
          );
        })}
      </Row>

      <Pressable onPress={salvar} style={({ pressed }) => [{ marginTop: 18, opacity: pressed ? 0.8 : 1 }]}>
        <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' }}>
          <Txt v="body" c={c.accentInk}>Registrar {min} min de {tipo.toLowerCase()}</Txt>
        </View>
      </Pressable>
    </SheetScreen>
  );
}
