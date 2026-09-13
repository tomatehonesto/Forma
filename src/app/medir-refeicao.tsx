import React, { useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { registroDoDia } from '../logic/derive';
import { now } from '../logic/time';
import { Txt, Row, SheetScreen, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius, font } from '../theme';

/* Registro de refeição — dois caminhos. O manual funciona hoje; o escanear
   depende de câmera e de reconhecimento de alimento, que o app ainda não
   tem, então aparece marcado como indisponível em vez de fingir. */
const HORARIOS = ['Café da manhã', 'Almoço', 'Lanche', 'Jantar'];
const PROTEINA: [string, string][] = [
  ['alta', 'Bastante'],
  ['média', 'Média'],
  ['baixa', 'Pouca'],
];

export default function MedirRefeicao() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const hora = new Date().getHours();
  const sugerido = hora < 10 ? 'Café da manhã' : hora < 15 ? 'Almoço' : hora < 18 ? 'Lanche' : 'Jantar';

  const [quando, setQuando] = useState(sugerido);
  const [prot, setProt] = useState('média');
  const [oque, setOque] = useState('');

  const salvar = () => {
    update((s: any) => {
      s.meals.unshift({ t: +now(), name: quando, prot, qual: prot === 'alta' ? 'ótima' : 'boa', tag: oque.trim() || quando });
      /* proteína do dia sobe conforme o porte da refeição — estimativa,
         não pesagem, e é assim que ela deve ser lida */
      const t = +new Date(new Date().setHours(0, 0, 0, 0));
      const ganho = prot === 'alta' ? 30 : prot === 'média' ? 18 : 8;
      const ci = registroDoDia(s, t);
      ci.prot = (ci.prot || 0) + ganho;
    });
    router.back();
  };

  return (
    <SheetScreen titulo="O que você comeu?" sub={`${S.meals.length} refeições registradas`} onClose={() => router.back()}>
      {/* escanear — ainda não existe câmera nem reconhecimento no app */}
      <Row gap={12} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16, marginTop: 18, opacity: 0.6 }}>
        <View style={{ width: 34, height: 34, borderRadius: radius.sm, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="camera" size={17} color={c.tx3} sw={1.9} />
        </View>
        <View style={{ flex: 1 }}>
          <Txt v="body" c={c.tx3}>Escanear o prato</Txt>
          <Txt v="caption" c={c.tx4} style={{ marginTop: 1 }}>ainda não disponível</Txt>
        </View>
      </Row>

      <Row gap={10} style={{ marginTop: 20, marginBottom: 12 }}>
        <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>REGISTRAR À MÃO</Txt>
        <View style={{ flex: 1, height: 1, backgroundColor: c.line }} />
      </Row>

      <Row gap={6} style={{ flexWrap: 'wrap' }}>
        {HORARIOS.map((h) => {
          const on = quando === h;
          return (
            <Pressable key={h} onPress={() => setQuando(h)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <View style={{ backgroundColor: on ? c.tx : c.bg1, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9, marginBottom: 6 }}>
                <Txt v="caption" c={on ? c.onHero : c.tx2}>{h}</Txt>
              </View>
            </Pressable>
          );
        })}
      </Row>

      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 10, paddingHorizontal: 16 }}>
        <TextInput
          value={oque} onChangeText={setOque}
          placeholder="O que tinha no prato?" placeholderTextColor={c.tx4}
          style={{ paddingVertical: 16, color: c.tx, fontFamily: font.body, fontSize: 19 }}
        />
        <Divider />
        <View style={{ paddingVertical: 14 }}>
          <Txt v="caption" c={c.tx3}>Quanta proteína tinha?</Txt>
          <Row gap={6} style={{ marginTop: 10 }}>
            {PROTEINA.map(([k, rotulo]) => {
              const on = prot === k;
              return (
                <Pressable key={k} onPress={() => setProt(k)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
                  <View style={{ backgroundColor: on ? c.limeWeak : c.bg2, borderRadius: radius.md, paddingVertical: 11, alignItems: 'center' }}>
                    <Txt v="caption" c={on ? c.limeInk : c.tx3}>{rotulo}</Txt>
                  </View>
                </Pressable>
              );
            })}
          </Row>
        </View>
      </View>

      <Pressable onPress={salvar} style={({ pressed }) => [{ marginTop: 16, opacity: pressed ? 0.8 : 1 }]}>
        <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' }}>
          <Txt v="body" c={c.accentInk}>Registrar {quando.toLowerCase()}</Txt>
        </View>
      </Pressable>
    </SheetScreen>
  );
}
