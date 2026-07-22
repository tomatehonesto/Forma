import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { radar } from '../logic/derive';
import { nf, relDay } from '../logic/time';
import { Screen, Txt, Card, Row, IconBadge, CircleBtn, Pill, Rich, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { AreaCurve, Radar } from '../ui/charts';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

const SYMS = [
  { k: 'fome', label: 'Fome', ic: 'flame' },
  { k: 'nausea', label: 'Náusea', ic: 'drop2' },
  { k: 'energia', label: 'Energia', ic: 'bolt' },
  { k: 'sono', label: 'Sono', ic: 'moon' },
  { k: 'mood', label: 'Humor', ic: 'mood' },
];
const EXTRA_SYMS: [string, string][] = [['refluxo', 'Refluxo'], ['ansiedade', 'Ansiedade'], ['constip', 'Constipação']];
const LV = ['nenhum', 'leve', 'moderado', 'forte'];

function symReading(k: string, cur: number, old: number, better: boolean) {
  const dir = better ? 'melhorou' : 'subiu um pouco';
  if (k === 'fome') return `Sua fome média está em <b>${nf(cur, 1)}/10</b> e ${dir} em relação à semana passada. Ela tende a oscilar com o ciclo da medicação — é esperado.`;
  if (k === 'nausea') return `Náusea média <b>${nf(cur, 1)}/10</b>, ${dir}. Concentra-se nos dias após a aplicação e costuma diminuir com o tempo.`;
  if (k === 'energia') return `Energia média <b>${nf(cur, 1)}/10</b>, ${dir}. Sono e proteína costumam andar junto com esse número.`;
  if (k === 'sono') return `Você dormiu em média <b>${nf(cur, 1)}h</b> por noite, ${dir}. Noites melhores aparecem associadas a menos náusea.`;
  return `Seu humor médio está em <b>${nf(cur, 1)}/5</b>, ${dir}. Ao longo do tratamento ele vem ficando mais estável.`;
}

export default function Sintomas() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const [key, setKey] = useState('fome');

  const recent = S.checkins.slice(-7), prev = S.checkins.slice(-14, -7);
  const avg = (arr: any[], k: string) => (arr.length ? arr.reduce((s, x) => s + x[k], 0) / arr.length : 0);
  const cur = avg(recent, key), old = avg(prev, key);
  const sym = SYMS.find((s) => s.k === key)!;
  const better = ['fome', 'nausea'].includes(key) ? cur < old : cur > old;

  const series = S.checkins.slice(-14).map((x: any) => x[key]);
  const mn = Math.min(...series), mx = Math.max(...series), pad = (mx - mn) * 0.3 || 1;
  const pts = series.map((v: number, i: number) => ({ x: i / (series.length - 1 || 1), y: (v - (mn - pad)) / ((mx + pad) - (mn - pad)) }));

  const latestSev = (k: string) => {
    for (let i = S.checkins.length - 1; i >= 0; i--) { const x: any = S.checkins[i]; if (x && x[k] != null) return { val: x[k], t: x.t }; }
    return null;
  };
  const extras = EXTRA_SYMS.map(([k, l]) => ({ l, s: latestSev(k) })).filter((x) => x.s);
  const lvColor = (v: number) => [c.tx4, c.accent, c.amber, c.cta][v] || c.tx4;

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Txt v="h1">Sintomas & radar</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Acompanhamento acolhedor, sem alarme</Txt>
        </View>
      </Row>

      {/* radar */}
      <Card style={{ marginTop: 18, alignItems: 'center' }}>
        <Radar data={radar(S)} size={264} />
        <Txt v="caption" c={c.tx3} style={{ marginTop: 4 }}>Seu equilíbrio nos últimos 3 dias de check-in</Txt>
      </Card>

      {/* evolução por sintoma */}
      <Txt v="h2" style={{ marginTop: 22, marginBottom: 10 }}>Evolução por sintoma</Txt>
      <Row gap={8} style={{ flexWrap: 'wrap' }}>
        {SYMS.map((s) => (
          <Pressable key={s.k} onPress={() => setKey(s.k)}>
            <Row gap={5} style={{ paddingHorizontal: 13, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: key === s.k ? c.accentWeak : c.bg1, borderWidth: 1.2, borderColor: key === s.k ? c.accent : c.line }}>
              <Icon name={s.ic} size={14} color={key === s.k ? c.accent : c.tx3} sw={1.9} />
              <Txt v="label" c={key === s.k ? c.accent : c.tx3}>{s.label}</Txt>
            </Row>
          </Pressable>
        ))}
      </Row>

      <Card style={{ marginTop: 12 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt v="h2">{sym.label}</Txt>
          <Row gap={4}>
            <Icon name={better ? 'arrowdown' : 'arrowup'} size={12} color={better ? c.accent : c.cta} sw={2.2} />
            <Txt v="caption" c={better ? c.accent : c.cta}>{nf(Math.abs(cur - old), 1)} vs. semana anterior</Txt>
          </Row>
        </Row>
        <View style={{ marginTop: 8 }}>
          <AreaCurve pts={pts} height={110} padT={10} padB={10} marker={pts.length - 1} id="sy" />
        </View>
        <View style={{ marginTop: 12, backgroundColor: c.accentWeak, borderRadius: radius.md, padding: 13 }}>
          <Row gap={6}><Icon name="aura" size={13} color={c.accent} sw={2} /><Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>LEITURA</Txt></Row>
          <Rich v="bodyMed" base={c.tx2} bold={c.tx} style={{ marginTop: 6, lineHeight: 20 }} text={symReading(key, cur, old, better)} />
        </View>
      </Card>

      {/* outros sintomas */}
      {extras.length > 0 && (
        <>
          <Txt v="h2" style={{ marginTop: 22, marginBottom: 10 }}>Outros sintomas registrados</Txt>
          <Card style={{ paddingVertical: 4 }}>
            {extras.map((x, idx) => (
              <View key={x.l}>
                {idx > 0 && <Divider />}
                <Row style={{ justifyContent: 'space-between', paddingVertical: 11 }}>
                  <View>
                    <Txt v="bodyMed">{x.l}</Txt>
                    <Txt v="micro" c={c.tx3} style={{ marginTop: 1 }}>último registro · {relDay(new Date(x.s!.t))}</Txt>
                  </View>
                  <Row gap={9}>
                    <Row gap={3}>
                      {[0, 1, 2, 3].map((i) => (
                        <View key={i} style={{ width: 6, height: 16, borderRadius: 2, backgroundColor: i <= x.s!.val && x.s!.val > 0 ? lvColor(x.s!.val) : c.track }} />
                      ))}
                    </Row>
                    <Pill label={LV[x.s!.val]} color={c.tx2} bg={c.bg2} />
                  </Row>
                </Row>
              </View>
            ))}
            <Txt v="micro" c={c.tx3} style={{ marginTop: 6, marginBottom: 8, lineHeight: 16 }}>Você registra estes no check-in, em "Mais sintomas". Aqui eles ficam visíveis pra você e pra sua médica — sem alarme.</Txt>
          </Card>
        </>
      )}

      {/* correlação */}
      <Txt v="h2" style={{ marginTop: 22, marginBottom: 10 }}>Correlação com as doses</Txt>
      <Card>
        <Row style={{ alignItems: 'flex-start' }}>
          <IconBadge name="drop2" size={40} />
          <Rich v="bodyMed" base={c.tx2} bold={c.tx} style={{ flex: 1, marginLeft: 12, lineHeight: 20 }} text="Seus registros de <b>náusea</b> concentram-se nos 2 primeiros dias após cada aplicação e caem depois. A <b>fome</b> segue o caminho inverso: menor logo após a dose, maior perto da próxima." />
        </Row>
      </Card>
    </Screen>
  );
}
