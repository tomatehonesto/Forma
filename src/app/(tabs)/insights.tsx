import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../logic/store';
import { insights } from '../../logic/derive';
import { Screen, Txt, Card, Pill, IconBadge, Row, Rich, CircleBtn, Divider } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { AreaCurve, MiniBars } from '../../ui/charts';
import { useTheme } from '../../ui/useTheme';
import { space, radius } from '../../theme';

const TABS = ['Resumo', 'Padrões', 'Correlações'];
const TAB_IC = ['activity', 'barchart', 'target'];

export default function Insights() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const [tab, setTab] = useState(0);

  const ci = S.checkins;
  const norm = (arr: number[]) => { const mn = Math.min(...arr), mx = Math.max(...arr); return arr.map((v) => ({ x: 0, y: (v - mn) / ((mx - mn) || 1) })); };
  const series = (key: string, div: number) => { const a = ci.slice(-10).map((x: any) => x[key] / div); const p = norm(a); return p.map((pt, i) => ({ x: i / (p.length - 1 || 1), y: pt.y })); };
  const energiaPts = series('energia', 1);
  const aguaPts = series('agua', 1);
  const fomePts = series('fome', 1);
  const byWd: Record<number, number[]> = {}; ci.forEach((x: any) => { const w = new Date(x.t).getDay(); (byWd[w] = byWd[w] || []).push(x.mood); });
  const humorBars = [1, 2, 3, 4, 5, 6, 0].map((w) => (byWd[w] ? (byWd[w].reduce((s, x) => s + x, 0) / byWd[w].length) / 5 : 0.3));

  const cards: { key: string; title: string; tag: string; tagColor: string; body: string; chart: React.ReactNode }[] = [
    { key: 'energia', title: 'Energia', tag: 'Em alta', tagColor: c.accent, body: 'Você relatou mais energia nos dias do pico de efeito.', chart: <AreaCurve pts={energiaPts} height={54} padT={6} padB={6} strokeFrom={c.accent} strokeTo={c.accent2} dashed={false} id="e" /> },
    { key: 'agua', title: 'Hidratação', tag: 'Atenção', tagColor: c.water, body: 'Você atingiu a meta de água em cerca de 40% dos dias.', chart: <AreaCurve pts={aguaPts} height={54} padT={6} padB={6} strokeFrom={c.water} strokeTo={c.water} dashed={false} id="a" /> },
    { key: 'sono', title: 'Sono', tag: 'Impacto positivo', tagColor: c.purple, body: 'Noites com sono de qualidade melhoram seu humor no dia seguinte.', chart: <MiniBars vals={humorBars} height={54} color={c.purple} /> },
    { key: 'fome', title: 'Compulsão', tag: 'Padrão', tagColor: c.rose, body: 'Maior tendência nos dias que antecedem o retorno da fome.', chart: <AreaCurve pts={fomePts} height={54} padT={6} padB={6} strokeFrom={c.rose} strokeTo={c.rose} dashed={false} id="f" /> },
  ];
  const ins = insights(S);

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 8 }}>
        <View style={{ flex: 1 }}>
          <Txt v="display">Insights pra você</Txt>
          <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 6 }}>Entenda seus padrões e cuide do que importa.</Txt>
        </View>
        <CircleBtn name="aura" color={c.accent} bg={c.accentWeak} onPress={() => router.push('/companion' as any)} />
      </Row>

      {/* período */}
      <Row style={{ marginTop: 14, alignSelf: 'flex-start', backgroundColor: c.bg1, borderRadius: radius.md, borderWidth: 1, borderColor: c.line, paddingHorizontal: 12, paddingVertical: 8 }} gap={8}>
        <Icon name="cal" size={15} color={c.accent} sw={1.7} />
        <Txt v="label" c={c.tx2}>Últimos 30 dias</Txt>
      </Row>

      {/* tabs */}
      <Row style={{ marginTop: 16, backgroundColor: c.bg2, borderRadius: radius.pill, padding: 4 }}>
        {TABS.map((t, i) => (
          <Pressable key={t} onPress={() => setTab(i)} style={{ flex: 1 }}>
            <Row style={{ justifyContent: 'center', paddingVertical: 9, borderRadius: radius.pill, backgroundColor: tab === i ? c.bg1 : 'transparent' }} gap={6}>
              <Icon name={TAB_IC[i]} size={15} color={tab === i ? c.accent : c.tx3} sw={1.8} />
              <Txt v="label" c={tab === i ? c.accent : c.tx3}>{t}</Txt>
            </Row>
          </Pressable>
        ))}
      </Row>

      {/* hero insight (Resumo) */}
      {tab === 0 && (
        <Card tint={c.accentWeak} style={{ marginTop: 16, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', right: -10, top: 10, opacity: 0.18 }}><Icon name="heart" size={140} color={c.accent} sw={1.2} /></View>
          <Row gap={7}><Icon name="spark" size={16} color={c.accent} sw={2} /><Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>SEU PRINCIPAL INSIGHT</Txt></Row>
          <Txt v="h1" style={{ marginTop: 12, fontSize: 23, lineHeight: 30, maxWidth: '82%' }}>
            Nos dias em que você <Txt v="h1" c={c.accent} style={{ fontSize: 23, lineHeight: 30 }}>dorme melhor</Txt>, sua <Txt v="h1" c={c.accent2} style={{ fontSize: 23, lineHeight: 30 }}>fome e compulsão</Txt> tendem a ser menores.
          </Txt>
          <Txt v="bodyMed" c={c.tx2} style={{ marginTop: 10, maxWidth: '84%' }}>Seu corpo responde bem ao equilíbrio. Pequenas mudanças geram grandes diferenças.</Txt>
        </Card>
      )}

      {/* em destaque (Resumo + Padrões) */}
      {(tab === 0 || tab === 1) && (
        <>
          <Txt v="h2" style={{ marginTop: 22, marginBottom: 4 }}>Em destaque</Txt>
          <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {cards.map((cd) => (
              <View key={cd.key} style={{ width: '48.5%', backgroundColor: c.bg1, borderRadius: radius.lg, borderWidth: 1, borderColor: c.line, padding: 14, marginTop: 12 }}>
                <IconBadge name={cd.key === 'energia' ? 'bolt' : cd.key === 'agua' ? 'water' : cd.key === 'sono' ? 'moon' : 'brain'} size={36} color={cd.tagColor} bg={cd.tagColor + '18'} />
                <Txt v="title" style={{ marginTop: 10 }}>{cd.title}</Txt>
                <View style={{ alignSelf: 'flex-start', marginTop: 4 }}><Pill label={cd.tag} color={cd.tagColor} bg={cd.tagColor + '18'} /></View>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 8 }} numberOfLines={3}>{cd.body}</Txt>
                <View style={{ marginTop: 8 }}>{cd.chart}</View>
              </View>
            ))}
          </Row>
        </>
      )}

      {/* correlações — insights textuais */}
      {tab === 2 && (
        <View style={{ marginTop: 16 }}>
          {ins.map((it, i) => (
            <Card key={i} style={{ marginBottom: 12 }}>
              <Row style={{ alignItems: 'flex-start' }}>
                <IconBadge name={it.ic === 'drop2' ? 'drop2' : it.ic} size={40} />
                <Rich text={it.text} v="bodyMed" base={c.tx2} bold={c.accent} style={{ flex: 1, marginLeft: 12 }} />
              </Row>
            </Card>
          ))}
        </View>
      )}

      {/* dicas + feedback (Resumo) */}
      {tab === 0 && (
        <>
          <Card tint={c.accentWeak} style={{ marginTop: 16 }}>
            <Row>
              <IconBadge name="leaf" size={40} bg={c.bg1} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Txt v="title" c={c.accent}>Pequenas escolhas, grandes impactos</Txt>
                <Txt v="bodyMed" c={c.tx2} style={{ marginTop: 2 }}>Manter uma rotina equilibrada potencializa os efeitos da medicação.</Txt>
              </View>
            </Row>
          </Card>
          <Card style={{ marginTop: 14 }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Txt v="title">Estas insights foram úteis?</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>Seu feedback nos ajuda a personalizar.</Txt>
              </View>
              <Row gap={10}>
                <CircleBtn name="thumbup" color={c.accent} bg={c.accentWeak} />
                <CircleBtn name="thumbdown" color={c.tx3} />
              </Row>
            </Row>
          </Card>
        </>
      )}
    </Screen>
  );
}
