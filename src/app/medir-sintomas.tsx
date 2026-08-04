import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { checkinToday } from '../logic/derive';
import { now, startOfDay } from '../logic/time';
import { Txt, Row, SheetScreen, Divider } from '../ui/kit';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* Como o corpo reagiu — captura, não a tela de histórico de sintomas.
   Só o que muda com a medicação: enjoo, fome e intestino. Sono e humor
   ficam no check-in, para as duas telas não perguntarem a mesma coisa. */
const INTESTINO: [string, string][] = [
  ['normal', 'Normal'],
  ['preso', 'Preso'],
  ['solto', 'Solto'],
];

export default function MedirSintomas() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const ci: any = checkinToday(S);
  const [nausea, setNausea] = useState(ci?.nausea ?? 0);
  const [fome, setFome] = useState(ci?.fome ?? 5);
  const [gut, setGut] = useState(ci?.gut ?? 'normal');

  const salvar = () => {
    update((s: any) => {
      const t = +startOfDay(now());
      const c2 = s.checkins.find((x: any) => x.t === t);
      if (c2) { c2.nausea = nausea; c2.fome = fome; c2.gut = gut; }
      else s.checkins.push({ t, mood: 3, fome, nausea, sono: 7, gut, energia: 6, agua: 0, prot: 0, exerc: 0, refluxo: 0, ansiedade: 0, constip: 0 });
    });
    router.back();
  };

  const Escala = ({ rotulo, valor, set, esq, dir }: { rotulo: string; valor: number; set: (v: number) => void; esq: string; dir: string }) => (
    <View style={{ paddingVertical: 16 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Txt v="body">{rotulo}</Txt>
        <Txt v="body" c={c.accent}>{valor}</Txt>
      </Row>
      <Slider
        value={valor} minimumValue={0} maximumValue={10} step={1} onValueChange={set}
        minimumTrackTintColor={c.accent} maximumTrackTintColor={c.bg2} thumbTintColor={c.accent}
        style={{ marginTop: 6, marginHorizontal: -6 }}
      />
      <Row style={{ justifyContent: 'space-between' }}>
        <Txt v="micro" c={c.tx4}>{esq}</Txt>
        <Txt v="micro" c={c.tx4}>{dir}</Txt>
      </Row>
    </View>
  );

  return (
    <SheetScreen titulo="Como seu corpo reagiu?" sub="Só o que costuma mudar com a medicação" onClose={() => router.back()}>
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 18, paddingHorizontal: 18 }}>
        <Escala rotulo="Enjoo" valor={nausea} set={setNausea} esq="nenhum" dir="muito forte" />
        <Divider />
        <Escala rotulo="Fome" valor={fome} set={setFome} esq="sem fome" dir="fome constante" />
        <Divider />
        <View style={{ paddingVertical: 16 }}>
          <Txt v="body">Intestino</Txt>
          <Row gap={6} style={{ marginTop: 10 }}>
            {INTESTINO.map(([k, rotulo]) => {
              const on = gut === k;
              return (
                <Pressable key={k} onPress={() => setGut(k)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
                  <View style={{ backgroundColor: on ? c.accentWeak : c.bg2, borderWidth: 1, borderColor: on ? c.accentLine : 'transparent', borderRadius: radius.md, paddingVertical: 11, alignItems: 'center' }}>
                    <Txt v="caption" c={on ? c.accent : c.tx3}>{rotulo}</Txt>
                  </View>
                </Pressable>
              );
            })}
          </Row>
        </View>
      </View>

      {nausea >= 7 && (
        <Row gap={10} style={{ backgroundColor: c.ctaWeak, borderRadius: radius.md, padding: 13, marginTop: 12 }}>
          <View style={{ flex: 1 }}>
            <Txt v="caption" c={c.cta}>Enjoo forte merece ser conversado</Txt>
            <Txt v="micro" c={c.tx2} style={{ marginTop: 2 }}>Vale registrar e comentar com sua equipe na próxima consulta.</Txt>
          </View>
        </Row>
      )}

      <Pressable onPress={salvar} style={({ pressed }) => [{ marginTop: 16, opacity: pressed ? 0.8 : 1 }]}>
        <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' }}>
          <Txt v="body" c={c.accentInk}>Registrar como estou</Txt>
        </View>
      </Pressable>
    </SheetScreen>
  );
}
