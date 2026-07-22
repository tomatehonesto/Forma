import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { curWeight, startWeight, lostKg, lostPct, imc, latestMeasure, firstMeasure } from '../logic/derive';
import { daysAgo, fmtDate, nf, kg } from '../logic/time';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Chevron, Pill } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { AreaCurve } from '../ui/charts';
import { useTheme } from '../ui/useTheme';
import { space, radius, font } from '../theme';

const TABS = ['Peso', 'Medidas', 'Composição'];
const RANGES: [string, string][] = [['30', '30d'], ['90', '90d'], ['all', 'Tudo']];

function Delta({ v, unit, goodDown = true, up = false }: { v: number; unit: string; goodDown?: boolean; up?: boolean }) {
  const { c } = useTheme();
  const good = up ? !goodDown : goodDown;
  return (
    <Row gap={3} style={{ marginTop: 4 }}>
      <Icon name={up ? 'arrowup' : 'arrowdown'} size={12} color={good ? c.accent : c.cta} sw={2.2} />
      <Txt v="caption" c={good ? c.accent : c.cta}>{nf(Math.abs(v), 1)}{unit}</Txt>
    </Row>
  );
}

function MeasureRow({ label, from, to, unit, goodUp = false }: { label: string; from: number; to: number; unit: string; goodUp?: boolean }) {
  const { c } = useTheme();
  const d = to - from;
  const good = goodUp ? d > 0 : d < 0;
  return (
    <Row style={{ justifyContent: 'space-between', paddingVertical: 12 }}>
      <Txt v="bodyMed" c={c.tx2}>{label}</Txt>
      <Row gap={10}>
        <Txt v="title">{nf(to, to % 1 ? 1 : 0)}{unit}</Txt>
        <Pill icon={d < 0 ? 'arrowdown' : 'arrowup'} label={`${nf(Math.abs(d), 1)}${unit}`} color={good ? c.accent : c.cta} bg={good ? c.accentWeak : c.ctaWeak} />
      </Row>
    </Row>
  );
}

export default function Evolucao() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [range, setRange] = useState('all');

  const cur = curWeight(S), st = startWeight(S);
  const m0 = firstMeasure(S), m1 = latestMeasure(S);

  // série de peso filtrada pelo range
  const from = range === 'all' ? -Infinity : +daysAgo(+range);
  const w = S.weights.filter((x: any) => x.t >= from);
  const kgs = w.map((x: any) => x.kg);
  const mn = Math.min(...kgs), mx = Math.max(...kgs), pad = (mx - mn) * 0.25 || 1;
  const lo = mn - pad, hi = mx + pad;
  const pts = w.map((x: any, i: number) => ({ x: i / (w.length - 1 || 1), y: (x.kg - lo) / (hi - lo) }));
  const yLabels = [hi, (hi + lo) / 2, lo].map((v) => Math.round(v));
  const xd = [w[0], w[Math.floor(w.length / 2)], w[w.length - 1]].map((x: any) => fmtDate(new Date(x.t)));

  const imcCur = imc(S, cur), imcSt = imc(S, st);

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', marginTop: 4 }}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <CircleBtn name="info" />
      </Row>
      <View style={{ marginTop: 14 }}>
        <Txt v="display">Evolução</Txt>
        <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 6 }}>Acompanhe sua transformação ao longo do tempo.</Txt>
      </View>

      {/* tabs */}
      <Row gap={8} style={{ marginTop: 16 }}>
        {TABS.map((t, i) => (
          <Pressable key={t} onPress={() => setTab(i)} style={{ flex: 1 }}>
            <View style={{ alignItems: 'center', paddingVertical: 11, borderRadius: radius.pill, backgroundColor: tab === i ? c.tx : c.bg1, borderWidth: 1, borderColor: tab === i ? c.tx : c.line }}>
              <Txt v="label" c={tab === i ? c.bg1 : c.tx3}>{t}</Txt>
            </View>
          </Pressable>
        ))}
      </Row>

      {/* ---- PESO ---- */}
      {tab === 0 && (
        <>
          <Card style={{ marginTop: 16 }}>
            <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Row gap={12}>
                <IconBadge name="scale" size={44} />
                <Txt v="title" c={c.accent}>Peso perdido</Txt>
              </Row>
              <Row gap={5} style={{ backgroundColor: c.bg2, borderRadius: radius.pill, padding: 3 }}>
                {RANGES.map(([k, l]) => (
                  <Pressable key={k} onPress={() => setRange(k)}>
                    <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: range === k ? c.bg1 : 'transparent' }}>
                      <Txt v="micro" c={range === k ? c.accent : c.tx3}>{l}</Txt>
                    </View>
                  </Pressable>
                ))}
              </Row>
            </Row>
            <Row style={{ alignItems: 'flex-end', marginTop: 8 }} gap={5}>
              <Txt style={{ fontFamily: font.displayX, fontSize: 42, lineHeight: 46, color: c.accent }}>−{kg(lostKg(S))}</Txt>
              <Txt v="h2" c={c.accent} style={{ marginBottom: 4 }}>kg</Txt>
            </Row>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>desde o início · {kg(cur)} kg hoje · {nf(lostPct(S), 1)}% do peso inicial</Txt>

            {/* chart + eixos */}
            <Row style={{ marginTop: 14, alignItems: 'stretch' }}>
              <View style={{ justifyContent: 'space-between', paddingVertical: 10, paddingRight: 8 }}>
                {yLabels.map((v, i) => <Txt key={i} v="micro" c={c.tx4}>{v}</Txt>)}
              </View>
              <View style={{ flex: 1 }}>
                <AreaCurve pts={pts} height={170} marker={pts.length - 1} nodes id="ev" padB={16} padT={12} />
              </View>
            </Row>
            <Row style={{ justifyContent: 'space-between', paddingLeft: 26 }}>
              {xd.map((d, i) => <Txt key={i} v="micro" c={c.tx4}>{d}</Txt>)}
            </Row>

            {/* footer inicial/atual/meta */}
            <Row style={{ backgroundColor: c.bg2, borderRadius: radius.md, marginTop: 14, paddingVertical: 12 }}>
              {[['Peso inicial', `${kg(st)} kg`, c.tx], ['Peso atual', `${kg(cur)} kg`, c.accent], ['Meta', `${kg(S.profile.goalWeight)} kg`, c.tx]].map(([l, v, col], i) => (
                <View key={i as number} style={{ flex: 1, alignItems: 'center', borderLeftWidth: i ? 1 : 0, borderLeftColor: c.line }}>
                  <Txt v="micro" c={c.tx3}>{l as string}</Txt>
                  <Txt v="title" c={col as string} style={{ marginTop: 3 }}>{v as string}</Txt>
                </View>
              ))}
            </Row>
          </Card>

          {/* métricas principais */}
          <Txt v="h2" style={{ marginTop: 22, marginBottom: 10 }}>Métricas principais</Txt>
          <Row gap={10} style={{ alignItems: 'stretch' }}>
            <View style={{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.lg, borderWidth: 1, borderColor: c.line, padding: 14 }}>
              <IconBadge name="scale" size={36} />
              <Txt v="caption" c={c.tx3} style={{ marginTop: 8 }}>IMC</Txt>
              <Txt v="h2" style={{ marginTop: 2 }}>{nf(imcCur, 1)}</Txt>
              <Delta v={imcCur - imcSt} unit="" />
            </View>
            <View style={{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.lg, borderWidth: 1, borderColor: c.line, padding: 14 }}>
              <IconBadge name="flame" size={36} color={c.amber} bg={c.amberBg} />
              <Txt v="caption" c={c.tx3} style={{ marginTop: 8 }}>Gordura corporal</Txt>
              <Txt v="h2" style={{ marginTop: 2 }}>{nf(m1.gordura, 1)}%</Txt>
              <Delta v={m1.gordura - m0.gordura} unit="%" />
            </View>
            <View style={{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.lg, borderWidth: 1, borderColor: c.line, padding: 14 }}>
              <IconBadge name="dumbbell" size={36} color={c.purple} bg={c.purpleBg} />
              <Txt v="caption" c={c.tx3} style={{ marginTop: 8 }}>Massa magra</Txt>
              <Txt v="h2" style={{ marginTop: 2 }}>{nf(m1.musculo, 1)}%</Txt>
              <Delta v={m1.musculo - m0.musculo} unit="%" up goodDown={false} />
            </View>
          </Row>

          <Card tint={c.accentWeak} style={{ marginTop: 12, paddingVertical: 14 }} onPress={() => setTab(1)}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Txt v="title" c={c.accent}>Ver todas as métricas</Txt>
              <Chevron color={c.accent} />
            </Row>
          </Card>

          {/* motivação + dica */}
          <Card tint={c.accentWeak} style={{ marginTop: 14 }}>
            <Row style={{ alignItems: 'flex-start' }}>
              <IconBadge name="spark" size={44} bg={c.bg1} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Txt v="title">Você está no caminho certo</Txt>
                <Txt v="bodyMed" c={c.tx2} style={{ marginTop: 3 }}>Manter consistência nas suas escolhas é o que gera resultados.</Txt>
              </View>
            </Row>
          </Card>
          <Card style={{ marginTop: 12 }}>
            <Row style={{ alignItems: 'flex-start' }}>
              <IconBadge name="bulb" size={44} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Txt v="title">Dica para continuar evoluindo</Txt>
                <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 3 }}>Priorize proteína, treinos de força e sono de qualidade para potencializar seus resultados.</Txt>
              </View>
              <Chevron />
            </Row>
          </Card>
        </>
      )}

      {/* ---- MEDIDAS ---- */}
      {tab === 1 && (
        <>
          <Card style={{ marginTop: 16, paddingVertical: 8 }}>
            <MeasureRow label="Cintura" from={m0.cintura} to={m1.cintura} unit=" cm" />
            <MeasureRow label="Quadril" from={m0.quadril} to={m1.quadril} unit=" cm" />
            <MeasureRow label="Braço" from={m0.braco} to={m1.braco} unit=" cm" />
            <MeasureRow label="Coxa" from={m0.coxa} to={m1.coxa} unit=" cm" />
            <MeasureRow label="IMC" from={imcSt} to={imcCur} unit="" />
          </Card>
          <Card tint={c.accentWeak} style={{ marginTop: 12, paddingVertical: 14 }}>
            <Row gap={10} style={{ alignItems: 'flex-start' }}>
              <Icon name="spark" size={16} color={c.accent} sw={2} />
              <Txt v="bodyMed" c={c.tx2} style={{ flex: 1 }}>Menos {m0.cintura - m1.cintura} cm de cintura desde o início. A transformação aparece na forma do corpo, não só no número da balança.</Txt>
            </Row>
          </Card>
        </>
      )}

      {/* ---- COMPOSIÇÃO ---- */}
      {tab === 2 && (
        <>
          <Card style={{ marginTop: 16, paddingVertical: 8 }}>
            <MeasureRow label="Gordura corporal" from={m0.gordura} to={m1.gordura} unit="%" />
            <MeasureRow label="Massa magra" from={m0.musculo} to={m1.musculo} unit="%" goodUp />
            <MeasureRow label="Peso" from={st} to={cur} unit=" kg" />
          </Card>
          <Card style={{ marginTop: 12 }}>
            <Row style={{ alignItems: 'flex-start' }}>
              <IconBadge name="dumbbell" size={44} color={c.purple} bg={c.purpleBg} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Txt v="title">Massa magra preservada</Txt>
                <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 3 }}>Sua massa magra subiu de {nf(m0.musculo, 1)}% para {nf(m1.musculo, 1)}% enquanto o peso caiu — sinal de que a proteína e os treinos estão funcionando.</Txt>
              </View>
            </Row>
          </Card>
        </>
      )}
    </Screen>
  );
}
