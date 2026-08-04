import React, { useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { curWeight } from '../logic/derive';
import { now, nf } from '../logic/time';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius, font } from '../theme';

/* Novo peso — captura, não a tela de evolução. Abre com o último valor já
   preenchido porque a variação de um dia para o outro é pequena: quase
   sempre são dois toques no ajuste fino, não digitar tudo de novo. */
export default function MedirPeso() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const ultimo = curWeight(S);
  const [valor, setValor] = useState(ultimo);
  const [texto, setTexto] = useState(nf(ultimo, 1).replace('.', ','));

  const ajustar = (d: number) => {
    const v = Math.round((valor + d) * 10) / 10;
    if (v < 30 || v > 250) return;
    setValor(v); setTexto(nf(v, 1).replace('.', ','));
  };
  const digitar = (t: string) => {
    setTexto(t);
    const v = parseFloat(t.replace(',', '.'));
    if (v >= 30 && v <= 250) setValor(v);
  };

  const delta = valor - ultimo;
  const salvar = () => {
    update((s: any) => { s.weights.push({ t: +now(), kg: valor }); });
    router.back();
  };

  return (
    <SheetScreen titulo="Quanto você está pesando?" sub={`último: ${nf(ultimo, 1).replace('.', ',')} kg`} onClose={() => router.back()}>
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18, marginTop: 18 }}>
        <Row gap={14} style={{ justifyContent: 'center' }}>
          <Pressable onPress={() => ajustar(-0.1)} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="chevdown" size={20} color={c.tx2} sw={2.2} />
            </View>
          </Pressable>
          <TextInput
            value={texto} onChangeText={digitar} keyboardType="decimal-pad" selectTextOnFocus
            style={{ minWidth: 120, textAlign: 'center', color: c.tx, fontFamily: font.body, fontSize: 40, paddingVertical: 4 }}
          />
          <Pressable onPress={() => ajustar(0.1)} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="chevup" size={20} color={c.tx2} sw={2.2} />
            </View>
          </Pressable>
        </Row>
        <Txt v="note" c={c.tx3} style={{ textAlign: 'center', marginTop: 4 }}>kg</Txt>

        {Math.abs(delta) >= 0.05 && (
          <Row gap={7} style={{ justifyContent: 'center', marginTop: 14 }}>
            <View style={{ backgroundColor: delta < 0 ? c.limeWeak : c.bg2, paddingHorizontal: 11, paddingVertical: 5, borderRadius: radius.pill }}>
              <Txt v="micro" c={delta < 0 ? c.limeInk : c.tx3}>
                {delta < 0 ? '−' : '+'}{nf(Math.abs(delta), 1).replace('.', ',')} kg desde o último
              </Txt>
            </View>
          </Row>
        )}
      </View>

      <Pressable onPress={salvar} style={({ pressed }) => [{ marginTop: 16, opacity: pressed ? 0.8 : 1 }]}>
        <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' }}>
          <Txt v="body" c={c.accentInk}>Registrar {nf(valor, 1).replace('.', ',')} kg</Txt>
        </View>
      </Pressable>
    </SheetScreen>
  );
}
