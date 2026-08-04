import React, { useMemo } from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import {
  journeySummary, journeyChanges, timelineWeeks, weightSeries,
  milestones, achDone, doseCycle, penStock, nextInjectionDate, siteLabel, nextSite,
  waterMlToday, checkinToday, M, type Change, type TLEvent,
} from '../../logic/derive';
import { now, diffDays, fmtDate, nf } from '../../logic/time';
import { Txt, Row, SectionHead, Metric } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { AreaCurve } from '../../ui/charts';
import { useTheme } from '../../ui/useTheme';
import { radius } from '../../theme';

/* ============================================================
   JORNADA

   A Home é o painel do carro; esta tela é o álbum da viagem. Mas álbum
   não é desculpa para deixar de ser funcional: o bloco de cima responde
   "onde estou" de relance, e só depois a tela vira narrativa.

   O que dá coesão aqui é o CONTRASTE entre blocos, não a repetição de
   um mesmo cartão. A tela alterna, de propósito:
     painel sangrado  →  grade densa  →  fita horizontal  →  destaque

   O histórico completo NÃO mora aqui: quem abre a Jornada quer saber
   como vai, não auditar registros. A tela mostra o que o ciclo atual
   rendeu; a lista linha por linha fica em app/historico. */

const PAD = 24;

/* ------------------------------------------------------------------ */
/* Painel — sangra até as bordas e é o único bloco que quebra a margem,
   por isso ancora a tela inteira. */
function Painel() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const r = journeySummary(S);
  const cyc = doseCycle(S);
  const serie = weightSeries(S);
  const nd = nextInjectionDate(S);
  const ndDays = diffDays(nd, now());

  return (
    /* Sobe até o topo da tela: o rótulo da aba já diz "Jornada", então o
       espaço vira conteúdo. A safe area entra como padding interno.

       A superfície de ênfase deste app é CLARA. Em vez de um bloco escuro
       — que faria a tela parecer de outro produto — duas lavagens difusas
       das cores da marca sobre branco: lima no alto à direita, azul no
       rodapé à esquerda. Gradiente, nunca cor chapada. */
    <View style={{ backgroundColor: c.bg1, marginHorizontal: -PAD, paddingHorizontal: PAD, paddingTop: insets.top + 20, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, overflow: 'hidden' }}>
      <LinearGradient
        colors={[c.deepFrom, 'transparent']}
        start={{ x: 1, y: 0 }} end={{ x: 0.1, y: 0.62 }}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={['transparent', c.deepTo]}
        start={{ x: 0.9, y: 0.35 }} end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <Txt v="micro" c={c.tx2} style={{ letterSpacing: 1.2 }}>SEMANA {r.semana} · DIA {r.dia}</Txt>

      <Row style={{ alignItems: 'flex-end', marginTop: 12 }}>
        <Metric value={`−${r.lostLabel}`} unit="kg" v="display" />
        <View style={{ flex: 1 }} />
        <View style={{ backgroundColor: r.verdict.good ? c.lime : c.ctaWeak, paddingHorizontal: 11, paddingVertical: 5, borderRadius: radius.pill, marginBottom: 6 }}>
          <Txt v="micro" c={r.verdict.good ? c.limeInk : c.cta}>{r.verdict.label}</Txt>
        </View>
      </Row>

      <View style={{ marginTop: 16 }}>
        <View style={{ height: 6, borderRadius: radius.pill, backgroundColor: c.bg2, overflow: 'hidden' }}>
          <LinearGradient
            colors={[c.bluePale, c.accent2]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ width: `${Math.max(3, Math.min(100, r.pct))}%`, height: 6, borderRadius: radius.pill }}
          />
        </View>
        <Row style={{ justifyContent: 'space-between', marginTop: 8 }}>
          <Txt v="caption" c={c.tx3}>{r.pct}% da meta</Txt>
          <Txt v="caption" c={c.tx3}>faltam {nf(r.goal - r.lost, 1).replace('.', ',')} kg</Txt>
        </Row>
      </View>

      {serie.length > 1 && (
        <View style={{ marginHorizontal: -PAD, marginTop: 24, marginBottom: 22 }}>
          <AreaCurve pts={serie} height={46} padT={4} padB={0} padX={0} strokeW={1.8}
            strokeFrom={c.accent} strokeTo={c.accent2} id="jp" dashed={false} />
        </View>
      )}

      {/* ciclo — a mesma informação da Home, aqui como continuidade */}
      <Pressable onPress={() => router.push('/ciclo' as any)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
        <View style={{ borderTopWidth: 1, borderTopColor: c.line, paddingVertical: 18 }}>
          <Row gap={3}>
            {Array.from({ length: cyc.total }).map((_, i) => (
              <View key={i} style={{ flex: 1, height: 4, borderRadius: radius.pill, backgroundColor: i < cyc.dayIn ? c.accent : c.bg2 }} />
            ))}
          </Row>
          <Row style={{ justifyContent: 'space-between', marginTop: 10 }}>
            <Txt v="caption" c={c.tx}>{cyc.phase.label}</Txt>
            <Txt v="caption" c={c.tx3}>
              próxima dose {ndDays <= 0 ? 'hoje' : ndDays === 1 ? 'amanhã' : `em ${ndDays} dias`}
            </Txt>
          </Row>
        </View>
      </Pressable>

      <Row style={{ borderTopWidth: 1, borderTopColor: c.line }}>
        {[[`${r.dia}`, 'dias'], [`${r.aplicacoes}`, 'aplicações'], [`${S.checkins.length}`, 'check-ins']].map(([v, l], i) => (
          <View key={l} style={{ flex: 1, alignItems: 'center', paddingVertical: 15, borderLeftWidth: i ? 1 : 0, borderLeftColor: c.line }}>
            <Txt v="h2">{v}</Txt>
            <Txt v="micro" c={c.tx3} style={{ marginTop: 3 }}>{l}</Txt>
          </View>
        ))}
      </Row>
    </View>
  );
}

/* Tile de mudança — grade densa de 2 colunas. Forma diferente das linhas
   de lista, de propósito: quebra a monotonia entre blocos. */
function ChangeTile({ ch, onPress }: { ch: Change; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ width: '49%', opacity: pressed ? 0.7 : 1 }]}>
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18, marginBottom: 7 }}>
        <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Icon name={ch.ic} size={17} color={c.tx3} sw={1.8} />
          <View style={{ backgroundColor: ch.good ? c.limeWeak : c.bg2, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill }}>
            <Txt v="micro" c={ch.good ? c.limeInk : c.tx3}>{ch.delta}</Txt>
          </View>
        </Row>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 20 }} numberOfLines={1}>{ch.label}</Txt>
        <Row gap={5} style={{ marginTop: 6, alignItems: 'baseline' }}>
          <Txt v="caption" c={c.tx4}>{ch.from}</Txt>
          <Icon name="chev" size={9} color={c.tx4} sw={2.6} />
          {/* peso regular, como nos demais cards — o destaque vem do
              tamanho e da pílula de variação, não do negrito */}
          <Metric value={ch.to} v="title" />
        </Row>
      </View>
    </Pressable>
  );
}

/* Destaques da semana — o que esta semana rendeu, não tudo que aconteceu.

   O histórico linha por linha existe, mas mora em tela própria: quem abre
   a Jornada quer saber como vai, não auditar registros. */
function DestaquesDaSemana({ w, onVerTudo }: { w: any; onVerTudo: () => void }) {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const perdeu = w.deltaPeso?.startsWith('−');

  /* marcos alcançados dentro deste ciclo — o que merece ser lembrado */
  const conquistas = milestones(S).filter((m) => m.t >= w.t);

  const stats: [string, string][] = [];
  if (w.deltaPeso) stats.push([w.deltaPeso, 'na semana']);
  const ci = w.eventos.filter((e: TLEvent) => e.kind === 'checkin').length;
  if (ci) stats.push([`${ci}`, ci === 1 ? 'check-in' : 'check-ins']);
  const ex = w.eventos.filter((e: TLEvent) => e.kind === 'exercicio').length;
  if (ex) stats.push([`${ex}`, ex === 1 ? 'treino' : 'treinos']);

  return (
    <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, padding: 18 }}>
      <Row style={{ alignItems: 'center' }}>
        <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>SEMANA {w.semana}</Txt>
        {w.mudouDose && (
          <View style={{ backgroundColor: c.accentWeak, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, marginLeft: 8 }}>
            <Txt v="micro" c={c.accent}>dose ajustada</Txt>
          </View>
        )}
      </Row>
      <Txt v="title" style={{ marginTop: 8 }}>{w.dose}</Txt>
      <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{w.site} · {fmtDate(new Date(w.t))}</Txt>

      {stats.length > 0 && (
        <Row style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: c.line, paddingTop: 16 }}>
          {stats.map(([v, l], i) => (
            <View key={l} style={{ flex: 1, borderLeftWidth: i ? 1 : 0, borderLeftColor: c.line, paddingLeft: i ? 14 : 0 }}>
              <Txt v="h2" c={i === 0 && perdeu ? c.limeInk : c.tx}>{v}</Txt>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 3 }}>{l}</Txt>
            </View>
          ))}
        </Row>
      )}

      {conquistas.length > 0 && (
        <Row gap={10} style={{ marginTop: 16, backgroundColor: c.limeWeak, borderRadius: radius.md, padding: 12 }}>
          <Icon name={conquistas[0].ic} size={16} color={c.limeInk} sw={2} />
          <View style={{ flex: 1 }}>
            <Txt v="caption" c={c.tx}>{conquistas[0].title}</Txt>
            <Txt v="micro" c={c.tx2} style={{ marginTop: 1 }} numberOfLines={1}>{conquistas[0].sub}</Txt>
          </View>
        </Row>
      )}

      <Pressable onPress={onVerTudo} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
        <Row gap={6} style={{ marginTop: 16 }}>
          <Txt v="label" c={c.accent2}>Ver histórico completo</Txt>
          <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
        </Row>
      </Pressable>
    </View>
  );
}

/* ------------------------------------------------------------------ */
export default function Jornada() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const go = (to: string) => () => router.push(to as any);

  const r = journeySummary(S);
  const changes = journeyChanges(S);
  const semanas = useMemo(() => timelineWeeks(S), [S]);
  const marcos = milestones(S).slice(0, 8);
  const pen = penStock(S);
  const ci = checkinToday(S);

  const habitos: [string, string, string, string][] = [
    ['utensils', 'Alimentação', `${S.meals.length} refeições`, '/alimentacao'],
    ['water', 'Água', ci ? `${(waterMlToday(S) / 1000).toFixed(1).replace('.', ',')} L hoje` : 'sem registro', '/registrar'],
    ['dumbbell', 'Exercício', ci && ci.exerc ? `${ci.exerc} min hoje` : 'sem registro', '/registrar'],
    ['target', 'Protocolos', `${S.protocol.tasks.filter((t: any) => t.done).length} de ${S.protocol.tasks.length}`, '/protocolos'],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: PAD }}>
        <Painel />

        <Txt v="note" c={c.tx3} style={{ marginTop: 16 }}>
          Perder peso não é linear — semanas paradas fazem parte do tratamento.
        </Txt>

        {/* estoque: ação, fica logo abaixo do painel */}
        {!pen.verdict.good && (
          <Pressable onPress={go('/aplicacoes')} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <Row gap={12} style={{ backgroundColor: c.ctaWeak, borderRadius: radius.lg, padding: 14, marginTop: 16 }}>
              <Icon name="pill" size={18} color={c.cta} sw={1.9} />
              <View style={{ flex: 1 }}>
                <Txt v="body" c={c.cta}>{pen.verdict.label}</Txt>
                <Txt v="caption" c={c.tx2} style={{ marginTop: 1 }}>
                  {pen.left} de {pen.total} doses na caneta · cerca de {pen.semanas} {pen.semanas === 1 ? 'semana' : 'semanas'}
                </Txt>
              </View>
              <Icon name="chev" size={14} color={c.cta} sw={2} />
            </Row>
          </Pressable>
        )}

        {/* ---------- O QUE JÁ MUDOU — grade densa ---------- */}
        <View style={{ marginTop: 34 }}>
          <SectionHead title="O que já mudou" link="Evolução" onPress={go('/evolucao')} />
          <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 14 }}>
            {changes.map((ch) => <ChangeTile key={ch.label} ch={ch} onPress={go(ch.to_)} />)}
          </Row>
          {/* atalhos — pílula com contorno para não competir com os
              tiles de dado acima: botão parece botão, card parece card */}
          <Row gap={8} style={{ marginTop: 10 }}>
            {[['camera', 'Fotos', '/fotos'], ['target', 'Metas', '/metas'], ['heart', 'Saúde', '/saude']].map(([ic, t, to]) => (
              <Pressable key={t} onPress={go(to)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.6 : 1 }]}>
                <Row gap={7} style={{
                  justifyContent: 'center', paddingVertical: 11, borderRadius: radius.pill,
                  borderWidth: 1, borderColor: c.accentLine, backgroundColor: c.accentWeak,
                }}>
                  <Icon name={ic} size={15} color={c.accent} sw={2} />
                  <Txt v="label" c={c.accent}>{t}</Txt>
                </Row>
              </Pressable>
            ))}
          </Row>
        </View>

        {/* ---------- HÁBITOS — quatro tiles ---------- */}
        <View style={{ marginTop: 34 }}>
          <SectionHead title="Hábitos" link="Protocolos" onPress={go('/protocolos')} />
          <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 14 }}>
            {habitos.map(([ic, t, sub, to]) => (
              <Pressable key={t} onPress={go(to)} style={({ pressed }) => [{ width: '49%', opacity: pressed ? 0.7 : 1 }]}>
                <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18, marginBottom: 7 }}>
                  <Icon name={ic} size={17} color={c.tx3} sw={1.8} />
                  <Txt v="bodyMed" style={{ marginTop: 18 }}>{t}</Txt>
                  <Txt v="micro" c={c.tx3} style={{ marginTop: 4 }} numberOfLines={1}>{sub}</Txt>
                </View>
              </Pressable>
            ))}
          </Row>
        </View>

        {/* ---------- MOMENTOS — fita horizontal ---------- */}
        <View style={{ marginTop: 34 }}>
          <SectionHead title="Momentos" link={`${achDone(S).length} conquistas`} onPress={go('/conquistas')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -PAD, marginTop: 14 }}
            contentContainerStyle={{ paddingHorizontal: PAD, gap: 6 }}>
            {marcos.map((m) => (
              <View key={`${m.t}-${m.title}`} style={{ width: 178, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 14 }}>
                <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.limeWeak, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={m.ic} size={15} color={c.limeInk} sw={2} />
                </View>
                <Txt v="bodyMed" style={{ marginTop: 11 }} numberOfLines={2}>{m.title}</Txt>
                <Txt v="micro" c={c.tx3} style={{ marginTop: 4 }} numberOfLines={2}>{m.sub}</Txt>
                <Txt v="micro" c={c.tx4} style={{ marginTop: 8 }}>{fmtDate(new Date(m.t))}</Txt>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ---------- A HISTÓRIA — destaques da semana ---------- */}
        <View style={{ marginTop: 34 }}>
          <SectionHead title="A história" link="Histórico" onPress={go('/historico')} />
          <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
            O que este ciclo rendeu até agora.
          </Txt>
          {semanas[0] && <DestaquesDaSemana w={semanas[0]} onVerTudo={go('/historico')} />}
        </View>

      </ScrollView>
    </View>
  );
}
