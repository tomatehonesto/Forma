import React, { useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { EXAM_CATS } from '../logic/derive';
import { now } from '../logic/time';
import { Txt, Row, SheetScreen, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius, font } from '../theme';

/* Novo exame — captura.

   Importar PDF depende de leitor de documento e de extração de marcadores,
   que o app não tem. O que dá para fazer hoje é anotar um marcador de cada
   vez, que é o que a pessoa faz ao sair do laboratório com o papel na mão. */
export default function MedirExame() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const [marcador, setMarcador] = useState('HbA1c');
  const [valor, setValor] = useState('');

  const existente = (S.exams as any[]).find((e) => e.marker === marcador);
  const num = parseFloat(valor.replace(',', '.'));
  const valido = !isNaN(num) && num > 0;

  const salvar = () => {
    if (!valido) return;
    update((s: any) => {
      const e = s.exams.find((x: any) => x.marker === marcador);
      if (e) e.values.push({ t: +now(), v: num });
      else s.exams.push({ marker: marcador, unit: '', ref: '', good: '', values: [{ t: +now(), v: num }] });
    });
    router.back();
  };

  return (
    <SheetScreen titulo="Qual resultado chegou?" sub="Um marcador por vez" onClose={() => router.back()}>
      <Row gap={12} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16, marginTop: 18, opacity: 0.6 }}>
        <View style={{ width: 34, height: 34, borderRadius: radius.sm, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="doc" size={17} color={c.tx3} sw={1.9} />
        </View>
        <View style={{ flex: 1 }}>
          <Txt v="body" c={c.tx3}>Importar PDF do laboratório</Txt>
          <Txt v="caption" c={c.tx4} style={{ marginTop: 1 }}>ainda não disponível</Txt>
        </View>
      </Row>

      <Row gap={10} style={{ marginTop: 20, marginBottom: 12 }}>
        <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>ANOTAR À MÃO</Txt>
        <View style={{ flex: 1, height: 1, backgroundColor: c.line }} />
      </Row>

      {EXAM_CATS.map(([cat, marcadores]) => (
        <View key={cat} style={{ marginBottom: 12 }}>
          <Txt v="micro" c={c.tx4} style={{ marginBottom: 7 }}>{cat.toUpperCase()}</Txt>
          <Row gap={6} style={{ flexWrap: 'wrap' }}>
            {marcadores.map((m) => {
              const on = marcador === m;
              return (
                <Pressable key={m} onPress={() => setMarcador(m)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                  <View style={{ backgroundColor: on ? c.tx : c.bg1, borderRadius: radius.pill, paddingHorizontal: 13, paddingVertical: 8, marginBottom: 6 }}>
                    <Txt v="caption" c={on ? c.onHero : c.tx2}>{m}</Txt>
                  </View>
                </Pressable>
              );
            })}
          </Row>
        </View>
      ))}

      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, paddingHorizontal: 18 }}>
        <Row style={{ paddingVertical: 14 }}>
          <View style={{ flex: 1 }}>
            <Txt v="body">{marcador}</Txt>
            {existente ? (
              <Txt v="micro" c={c.tx3} style={{ marginTop: 2 }}>
                último: {existente.values[existente.values.length - 1].v} {existente.unit} · ref {existente.ref}
              </Txt>
            ) : (
              <Txt v="micro" c={c.tx4} style={{ marginTop: 2 }}>primeiro registro deste marcador</Txt>
            )}
          </View>
          <TextInput
            value={valor} onChangeText={setValor} keyboardType="decimal-pad" autoFocus
            placeholder="—" placeholderTextColor={c.tx4}
            style={{ width: 92, textAlign: 'right', color: c.tx, fontFamily: font.body, fontSize: 24, paddingVertical: 4 }}
          />
          {existente?.unit ? <Txt v="caption" c={c.tx3} style={{ marginLeft: 6 }}>{existente.unit}</Txt> : null}
        </Row>
      </View>

      <Pressable onPress={salvar} disabled={!valido} style={({ pressed }) => [{ marginTop: 16, opacity: !valido ? 0.4 : pressed ? 0.8 : 1 }]}>
        <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' }}>
          <Txt v="body" c={c.accentInk}>Registrar {marcador}</Txt>
        </View>
      </Pressable>
    </SheetScreen>
  );
}
