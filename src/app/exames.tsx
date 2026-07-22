import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { EXAM_CATS, examBy, examLast, examFirst, examStatus, examGaugeData, examExplain } from '../logic/derive';
import { fmtDate, nf } from '../logic/time';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Chevron, Pill, Divider, Rich } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { AreaCurve } from '../ui/charts';
import { AskCompanion } from '../ui/Ask';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

const fmtV = (v: number) => nf(v, v % 1 ? 1 : 0);

function Gauge({ e }: { e: any }) {
  const { c } = useTheme();
  const g = examGaugeData(e);
  const col = g.status === 'ok' ? c.accent : c.cta;
  return (
    <View style={{ marginTop: 16 }}>
      <View style={{ height: 10, borderRadius: 5, backgroundColor: c.track }}>
        <View style={{ position: 'absolute', left: `${g.bandL}%`, width: `${Math.max(3, g.bandR - g.bandL)}%`, top: 0, bottom: 0, borderRadius: 5, backgroundColor: c.accentWeak, borderWidth: 1, borderColor: c.accentLine }} />
        <View style={{ position: 'absolute', left: `${g.pos}%`, top: -3, width: 16, height: 16, marginLeft: -8, borderRadius: 8, backgroundColor: col, borderWidth: 3, borderColor: c.bg1 }} />
      </View>
      <Row style={{ justifyContent: 'space-between', marginTop: 8 }}>
        <Txt v="micro" c={c.tx4}>{fmtV(g.min)}</Txt>
        <Txt v="micro" c={c.tx3}>referência {e.ref} {e.unit}</Txt>
        <Txt v="micro" c={c.tx4}>{fmtV(g.max)}</Txt>
      </Row>
    </View>
  );
}

function Detail({ e, onBack }: { e: any; onBack: () => void }) {
  const { c } = useTheme();
  const l = examLast(e), f = examFirst(e), st = examStatus(e);
  const many = e.values.length > 1;
  const trend = l.v - f.v, good = e.good === 'up' ? trend > 0 : trend < 0;
  const pts = many ? e.values.map((x: any, i: number) => {
    const vs = e.values.map((y: any) => y.v); const mn = Math.min(...vs), mx = Math.max(...vs), pad = (mx - mn) * 0.3 || 1;
    return { x: i / (e.values.length - 1), y: (x.v - (mn - pad)) / ((mx + pad) - (mn - pad)) };
  }) : [];
  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={onBack} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">{e.marker}</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>referência {e.ref} {e.unit}</Txt>
        </View>
      </Row>

      <Card style={{ marginTop: 18 }}>
        <Row style={{ alignItems: 'baseline' }} gap={12}>
          <Txt v="h1" style={{ fontSize: 34 }}>{fmtV(l.v)}<Txt v="h2" c={c.tx3}> {e.unit}</Txt></Txt>
          {many && (
            <Row gap={3}>
              <Icon name={trend < 0 ? 'arrowdown' : 'arrowup'} size={13} color={good ? c.accent : c.cta} sw={2.2} />
              <Txt v="label" c={good ? c.accent : c.cta}>{fmtV(Math.abs(trend))}</Txt>
            </Row>
          )}
        </Row>
        <View style={{ marginTop: 10, alignSelf: 'flex-start' }}>
          <Pill label={st === 'ok' ? 'dentro da referência' : `fora da referência — ${st}`} color={st === 'ok' ? c.accent : c.cta} bg={st === 'ok' ? c.accentWeak : c.ctaWeak} />
        </View>
        <Gauge e={e} />
        {many && <View style={{ marginTop: 18 }}><AreaCurve pts={pts} height={120} marker={pts.length - 1} nodes id="ex" /></View>}
        {many && (
          <View style={{ marginTop: 10 }}>
            {e.values.slice().reverse().map((x: any, i: number) => (
              <View key={x.t}>
                {i > 0 && <Divider />}
                <Row style={{ justifyContent: 'space-between', paddingVertical: 9 }}>
                  <Txt v="caption" c={c.tx3}>{fmtDate(new Date(x.t))}</Txt>
                  <Txt v="title">{fmtV(x.v)} {e.unit}</Txt>
                </Row>
              </View>
            ))}
          </View>
        )}
      </Card>

      <Card tint={c.accentWeak} style={{ marginTop: 14 }}>
        <Row gap={7}><Icon name="aura" size={14} color={c.accent} sw={2} /><Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>O QUE ISSO SIGNIFICA</Txt></Row>
        <Txt v="bodyMed" c={c.tx2} style={{ marginTop: 8, lineHeight: 21 }}>{examExplain(e)}</Txt>
        <AskCompanion q={`Explique meu exame de ${e.marker}`} label="Perguntar ao Companion" style={{ marginTop: 12 }} />
      </Card>
    </Screen>
  );
}

export default function Exames() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const [sel, setSel] = useState<string | null>(null);

  if (sel) { const e = examBy(S, sel); if (e) return <Detail e={e} onBack={() => setSel(null)} />; }

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Exames</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Importados, organizados e explicados pela IA</Txt>
        </View>
      </Row>

      <Row gap={10} style={{ marginTop: 16 }}>
        <Pressable style={{ flex: 1 }}>
          <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7 }}>
            <Icon name="doc" size={15} color="#fff" sw={2} /><Txt v="label" c="#fff">Importar exame</Txt>
          </View>
        </Pressable>
        <Pressable style={{ flex: 1 }}>
          <View style={{ backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line2, borderRadius: radius.pill, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7 }}>
            <Icon name="send" size={14} color={c.tx2} sw={2} /><Txt v="label" c={c.tx2}>Enviar ao médico</Txt>
          </View>
        </Pressable>
      </Row>

      <Card tint={c.accentWeak} style={{ marginTop: 14 }}>
        <Row gap={7}><Icon name="aura" size={14} color={c.accent} sw={2} /><Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>RESUMO DA IA</Txt></Row>
        <Rich v="bodyMed" base={c.tx2} bold={c.tx} style={{ marginTop: 8, lineHeight: 21 }} text="Seus marcadores metabólicos <b>melhoraram de forma consistente</b>: HbA1c 6,3 → 5,6%, triglicerídeos e LDL em queda, HDL e vitamina D em alta. Evolução alinhada com a perda de peso e o tratamento." />
      </Card>

      {EXAM_CATS.map(([cat, ms]) => (
        <View key={cat}>
          <Txt v="h2" style={{ marginTop: 22, marginBottom: 10 }}>{cat}</Txt>
          <Card style={{ paddingVertical: 4 }}>
            {ms.map((mk, i) => {
              const e = examBy(S, mk); if (!e) return null;
              const l = examLast(e), st = examStatus(e);
              const many = e.values.length > 1;
              const trend = many ? l.v - examFirst(e).v : 0;
              const good = e.good === 'up' ? trend > 0 : trend < 0;
              return (
                <View key={mk}>
                  {i > 0 && <Divider />}
                  <Pressable onPress={() => setSel(mk)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                    <Row style={{ paddingVertical: 12 }}>
                      <View style={{ flex: 1 }}>
                        <Txt v="title">{mk}</Txt>
                        <Txt v="micro" c={c.tx3} style={{ marginTop: 1 }}>ref {e.ref} {e.unit}</Txt>
                      </View>
                      <View style={{ alignItems: 'flex-end', marginRight: 8 }}>
                        <Txt v="title">{fmtV(l.v)} <Txt v="micro" c={c.tx3}>{e.unit}</Txt></Txt>
                        {many ? (
                          <Row gap={3} style={{ marginTop: 2 }}>
                            <Icon name={trend < 0 ? 'arrowdown' : 'arrowup'} size={11} color={good ? c.accent : c.cta} sw={2.2} />
                            <Txt v="micro" c={good ? c.accent : c.cta}>{fmtV(Math.abs(trend))}</Txt>
                          </Row>
                        ) : (
                          <View style={{ marginTop: 3 }}><Pill label={st === 'ok' ? 'normal' : st} color={st === 'ok' ? c.accent : c.cta} bg={st === 'ok' ? c.accentWeak : c.ctaWeak} /></View>
                        )}
                      </View>
                      <Chevron />
                    </Row>
                  </Pressable>
                </View>
              );
            })}
          </Card>
        </View>
      ))}

      <Txt v="h2" style={{ marginTop: 22, marginBottom: 10 }}>Arquivos importados</Txt>
      <Card style={{ paddingVertical: 4 }}>
        {S.examBundles.map((b: any, i: number) => (
          <View key={b.t}>
            {i > 0 && <Divider style={{ marginLeft: 52 }} />}
            <Row style={{ paddingVertical: 12 }}>
              <IconBadge name={b.source === 'PDF' ? 'doc' : 'photo'} size={40} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Txt v="title">{b.name}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{b.n} marcadores · {b.source} · {fmtDate(new Date(b.t))}</Txt>
              </View>
              {b.shared && <Pill label="enviado" />}
            </Row>
          </View>
        ))}
      </Card>
    </Screen>
  );
}
