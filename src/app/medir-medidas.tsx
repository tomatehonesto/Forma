import React, { useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { latestMeasure } from '../logic/derive';
import { now, nf } from '../logic/time';
import { Txt, Row, SheetScreen, Divider } from '../ui/kit';
import { useTheme } from '../ui/useTheme';
import { radius, font } from '../theme';

/* Novas medidas — captura, não a tela de histórico. Abre com a última
   medição preenchida: circunferência muda devagar, então quase sempre é
   ajuste de um ou dois campos, não digitar os quatro. */
const CAMPOS: [string, string, string][] = [
  ['cintura', 'Cintura', 'cm'],
  ['quadril', 'Quadril', 'cm'],
  ['braco', 'Braço', 'cm'],
  ['coxa', 'Coxa', 'cm'],
];

export default function MedirMedidas() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const ultima: any = latestMeasure(S);
  const [vals, setVals] = useState<Record<string, string>>(
    Object.fromEntries(CAMPOS.map(([k]) => [k, ultima ? nf(ultima[k], 1).replace('.', ',') : ''])),
  );

  const num = (k: string) => parseFloat((vals[k] || '').replace(',', '.'));
  const valido = CAMPOS.every(([k]) => !isNaN(num(k)) && num(k) > 0);

  const salvar = () => {
    if (!valido) return;
    update((s: any) => {
      s.measures.push({
        t: +now(),
        cintura: num('cintura'), quadril: num('quadril'),
        braco: num('braco'), coxa: num('coxa'),
        /* composição não é medida com fita — herda a última leitura até
           existir balança de bioimpedância conectada */
        gordura: ultima ? ultima.gordura : 0,
        musculo: ultima ? ultima.musculo : 0,
      });
    });
    router.back();
  };

  return (
    <SheetScreen
      titulo="Quais são suas medidas?"
      sub={ultima ? 'começa da última medição — ajuste o que mudou' : undefined}
      onClose={() => router.back()}
    >
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 18, paddingHorizontal: 18 }}>
        {CAMPOS.map(([k, rotulo, un], i) => {
          const antes = ultima ? ultima[k] : null;
          const agora = num(k);
          const d = antes != null && !isNaN(agora) ? agora - antes : 0;
          return (
            <React.Fragment key={k}>
              {i > 0 && <Divider />}
              <Row style={{ paddingVertical: 12 }}>
                <View style={{ flex: 1 }}>
                  <Txt v="body">{rotulo}</Txt>
                  {Math.abs(d) >= 0.1 && (
                    <Txt v="micro" c={d < 0 ? c.limeInk : c.tx3} style={{ marginTop: 2 }}>
                      {d < 0 ? '−' : '+'}{nf(Math.abs(d), 1).replace('.', ',')} cm desde a última
                    </Txt>
                  )}
                </View>
                <TextInput
                  value={vals[k]} onChangeText={(t) => setVals((v) => ({ ...v, [k]: t }))}
                  keyboardType="decimal-pad" selectTextOnFocus placeholder="—" placeholderTextColor={c.tx4}
                  style={{ width: 78, textAlign: 'right', color: c.tx, fontFamily: font.body, fontSize: 22, paddingVertical: 6 }}
                />
                <Txt v="caption" c={c.tx3} style={{ marginLeft: 6, width: 22 }}>{un}</Txt>
              </Row>
            </React.Fragment>
          );
        })}
      </View>

      <Pressable onPress={salvar} disabled={!valido} style={({ pressed }) => [{ marginTop: 16, opacity: !valido ? 0.4 : pressed ? 0.8 : 1 }]}>
        <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' }}>
          <Txt v="body" c={c.accentInk}>Registrar medidas</Txt>
        </View>
      </Pressable>
    </SheetScreen>
  );
}
