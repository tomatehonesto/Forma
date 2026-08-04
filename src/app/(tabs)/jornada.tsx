import React, { useMemo, useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import {
  journeySummary, journeyChanges, timelineWeeks, timelineEvents, timelineCounts, weightSeries,
  startWeight, curWeight,
  milestones, achDone, doseCycle, penStock, nextInjectionDate, siteLabel, nextSite,
  waterMlToday, checkinToday, M, type Change, type TLEvent, type TLKind, type WeekMetric,
} from '../../logic/derive';
import { now, diffDays, fmtDate, relDay, nf } from '../../logic/time';
import { Txt, Row, SectionHead, Divider, Metric } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { AreaCurve } from '../../ui/charts';
import { useTheme } from '../../ui/useTheme';
import { useLightStatusBar } from '../../ui/useLightStatusBar';
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
const FEED_SEMANAS = 3;
/* eventos que merecem virar destaque; o resto é rotina e vira contagem */
const NOTAVEIS: TLKind[] = ['consulta', 'exame', 'foto'];

/* ------------------------------------------------------------------ */
/* Painel — sangra até as bordas e é o único bloco que quebra a margem,
   por isso ancora a tela inteira. */
function Painel() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: largura } = useWindowDimensions();
  const r = journeySummary(S);
  const cyc = doseCycle(S);
  const serie = weightSeries(S);
  const nd = nextInjectionDate(S);
  const ndDays = diffDays(nd, now());

  return (
    /* Sobe até o topo da tela: o rótulo da aba já diz "Jornada", então o
       espaço vira conteúdo. A safe area entra como padding interno.

       Azul saturado em gradiente. O app inteiro é claro, então a superfície
       de ênfase precisa se separar por SATURAÇÃO — lavagem clara sobre
       branco sumia no fundo e deixava de ler como card. O lima pontua os
       itens dentro: veredito, barra, curva e ciclo. */
    <View style={{ marginHorizontal: -PAD, paddingHorizontal: PAD, paddingTop: insets.top + 26, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, overflow: 'hidden' }}>
      <LinearGradient
        colors={[c.panelFrom, c.panelMid, c.panelTo]}
        start={{ x: 0, y: 0 }} end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {/* ---- peso: o número que a pessoa veio buscar ---- */}
      <Txt v="micro" c={c.onHero2} style={{ letterSpacing: 1.2 }}>SEMANA {r.semana} · DIA {r.dia}</Txt>

      <Row style={{ alignItems: 'flex-end', marginTop: 12 }}>
        <Metric value={`−${r.lostLabel}`} unit="kg" v="display" tone={c.onHero} dim={c.onHero2} />
        <View style={{ flex: 1 }} />
        <View style={{ backgroundColor: r.verdict.good ? c.lime : c.onHeroWeak, paddingHorizontal: 11, paddingVertical: 5, borderRadius: radius.pill, marginBottom: 6 }}>
          <Txt v="micro" c={r.verdict.good ? c.limeInk : c.onHero}>{r.verdict.label}</Txt>
        </View>
      </Row>

      {/* A curva vem colada no número — é a mesma informação em outra
          forma: quanto perdeu (número) e como perdeu (formato). A barra de
          progresso saiu; três gráficos num card era demais, e o que ela
          dizia cabe em texto. */}
      {serie.length > 1 && (
        <View style={{ marginHorizontal: -PAD, marginTop: 14 }}>
          <AreaCurve pts={serie} height={56} width={largura} padT={4} padB={0} padX={PAD} strokeW={2}
            strokeFrom={c.lime} strokeTo={c.lime} id="jp" dashed={false} />
        </View>
      )}
      <Row style={{ justifyContent: 'space-between', marginTop: 8 }}>
        <Txt v="caption" c={c.onHero2}>
          {nf(startWeight(S), 1).replace('.', ',')} kg no início · {nf(curWeight(S), 1).replace('.', ',')} kg hoje
        </Txt>
        <Txt v="caption" c={c.onHero}>faltam {r.faltamLabel} kg</Txt>
      </Row>

      {/* ---- ciclo da dose ----
          As barrinhas são os dias entre uma aplicação e a próxima. Sem o
          "dia X de Y" e sem a explicação da fase, elas não dizem nada. */}
      <Pressable onPress={() => router.push('/ciclo' as any)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
        <View style={{ marginTop: 32 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt v="micro" c={c.onHero2} style={{ letterSpacing: 1 }}>
              CICLO DA DOSE · DIA {cyc.dayIn} DE {cyc.total}
            </Txt>
            <Txt v="micro" c={c.onHero2}>
              {ndDays <= 0 ? 'dose hoje' : ndDays === 1 ? 'dose amanhã' : `dose em ${ndDays} dias`}
            </Txt>
          </Row>
          <Row gap={3} style={{ marginTop: 10 }}>
            {Array.from({ length: cyc.total }).map((_, i) => (
              <View key={i} style={{ flex: 1, height: 5, borderRadius: radius.pill, backgroundColor: i < cyc.dayIn ? c.lime : c.onHeroLine }} />
            ))}
          </Row>
          <Txt v="caption" c={c.onHero} style={{ marginTop: 10 }}>{cyc.phase.label}</Txt>
          <Txt v="caption" c={c.onHero2} style={{ marginTop: 2 }}>{cyc.phase.hint}</Txt>
        </View>
      </Pressable>

      {/* ---- constância ----
          Antes eram 71 dias / 10 aplicações / 13 check-ins: trivia que não
          muda decisão nenhuma. Agora são os três números que dizem se o
          tratamento está indo bem. Sem divisores — o agrupamento vem do
          respiro. */}
      <Row style={{ marginTop: 32, paddingBottom: 24 }}>
        {[
          [`${r.ritmoLabel} kg`, 'por semana'],
          [`${r.adesao}%`, 'das doses em dia'],
          [`${r.streak}`, r.streak === 1 ? 'dia de check-in' : 'dias seguidos'],
        ].map(([v, l]) => (
          <View key={l} style={{ flex: 1, paddingRight: 8 }}>
            <Metric value={v} v="h2" tone={c.onHero} dim={c.onHero2} />
            <Txt v="micro" c={c.onHero2} style={{ marginTop: 3 }}>{l}</Txt>
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
function Semana({ w, proxT, filtro, aberto, onToggle }: { w: any; proxT: number; filtro: TLKind | null; aberto: boolean; onToggle: () => void }) {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const perdeu = w.deltaPeso?.startsWith('−');

  /* Ao abrir, a semana mostra o que os NÚMEROS daquele ciclo dizem —
     hidratação, proteína, exercício, peso — cada um comparado com a semana
     anterior, mais os acontecimentos que marcaram (conquistas, consultas,
     exames, fotos). Registro a registro fica em /historico.

     Com um tipo escolhido nos chips, a mesma view se estreita: só os
     eventos daquele tipo, semana a semana. */
  const conquistas = filtro ? [] : milestones(S).filter((m) => m.t >= w.t && m.t < proxT);
  const notaveis = (w.eventos as TLEvent[]).filter((e) => filtro ? e.kind === filtro : NOTAVEIS.includes(e.kind));
  const metricas: WeekMetric[] = filtro ? [] : w.metricas;
  const cor = (k: string) => (c as any)[k] as string;

  return (
    <Pressable onPress={onToggle} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <View style={{ paddingVertical: 16 }}>
        <Row style={{ alignItems: 'center' }}>
          <Txt v="bodyMed" style={{ marginRight: 8 }}>Semana {w.semana}</Txt>
          {w.mudouDose && (
            <View style={{ backgroundColor: c.accentWeak, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, marginRight: 6 }}>
              <Txt v="micro" c={c.accent}>dose ajustada</Txt>
            </View>
          )}
          <View style={{ flex: 1 }} />
          {w.deltaPeso && (
            <View style={{ backgroundColor: perdeu ? c.limeWeak : c.bg2, paddingHorizontal: 9, paddingVertical: 3, borderRadius: radius.pill }}>
              <Txt v="micro" c={perdeu ? c.limeInk : c.tx3}>{w.deltaPeso}</Txt>
            </View>
          )}
          <View style={{ marginLeft: 10 }}>
            <Icon name={aberto ? 'chevup' : 'chevdown'} size={15} color={c.tx4} sw={2} />
          </View>
        </Row>

        <Txt v="caption" c={c.tx3} style={{ marginTop: 5 }}>{w.dose} · {w.site}</Txt>
        <Txt v="caption" c={c.tx4} style={{ marginTop: 3 }} numberOfLines={1}>{w.resumo}</Txt>

        {aberto && (
          <View style={{ marginTop: 16 }}>
            {/* números do ciclo, cada um comparado com a semana anterior */}
            {metricas.length > 0 && (
              <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {metricas.map((m) => (
                  <View key={m.label} style={{ width: '48.5%', backgroundColor: c.bg2, borderRadius: radius.md, padding: 12, marginBottom: 6 }}>
                    <Row gap={7}>
                      <Icon name={m.ic} size={14} color={c.tx3} sw={1.9} />
                      <Txt v="micro" c={c.tx3}>{m.label}</Txt>
                    </Row>
                    <Row gap={6} style={{ marginTop: 7, alignItems: 'baseline' }}>
                      <Metric value={m.valor} v="bodyMed" />
                      {m.delta && (
                        <Txt v="micro" c={m.good ? c.limeInk : c.tx3}>{m.delta}</Txt>
                      )}
                    </Row>
                  </View>
                ))}
              </Row>
            )}

            {conquistas.map((m) => (
              <Row key={`${m.t}-${m.title}`} gap={10} style={{ backgroundColor: c.limeWeak, borderRadius: radius.md, padding: 12, marginTop: 6 }}>
                <Icon name={m.ic} size={15} color={c.limeInk} sw={2} />
                <View style={{ flex: 1 }}>
                  <Txt v="caption" c={c.tx}>{m.title}</Txt>
                  <Txt v="micro" c={c.tx2} style={{ marginTop: 1 }} numberOfLines={1}>{m.sub}</Txt>
                </View>
              </Row>
            ))}
            {notaveis.map((ev) => (
              <Row key={ev.key} gap={10} style={{ backgroundColor: c.bg2, borderRadius: radius.md, padding: 12, marginTop: 6 }}>
                <Icon name={ev.ic} size={15} color={cor(ev.color)} sw={1.9} />
                <View style={{ flex: 1 }}>
                  <Txt v="caption" c={c.tx}>{ev.title}</Txt>
                  <Txt v="micro" c={c.tx2} style={{ marginTop: 1 }} numberOfLines={1}>{ev.sub}</Txt>
                </View>
              </Row>
            ))}
            {metricas.length === 0 && conquistas.length === 0 && notaveis.length === 0 && (
              <Txt v="caption" c={c.tx4}>Sem registros nesta semana.</Txt>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
export default function Jornada() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const go = (to: string) => () => router.push(to as any);

  useLightStatusBar();
  const [filtro, setFiltro] = useState<TLKind | null>(null);
  const [abertas, setAbertas] = useState<Record<number, boolean>>({});
  const [todasSemanas, setTodasSemanas] = useState(false);

  const r = journeySummary(S);
  const changes = journeyChanges(S);
  const semanas = useMemo(() => timelineWeeks(S), [S]);
  const eventos = useMemo(() => timelineEvents(S), [S]);
  const contagens = useMemo(() => timelineCounts(S), [S]);
  const cor = (k: string) => (c as any)[k] as string;

  /* com um tipo escolhido, semanas sem nada daquele tipo saem da lista */
  const semanasComFiltro = filtro
    ? semanas.filter((w) => w.eventos.some((e) => e.kind === filtro))
    : semanas;
  const semanasVisiveis = todasSemanas ? semanasComFiltro : semanasComFiltro.slice(0, FEED_SEMANAS);
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

        {/* ---------- A HISTÓRIA — por semana, com destaques ---------- */}
        <View style={{ marginTop: 34 }}>
          <SectionHead title="A história" link="Ver tudo" onPress={go('/historico')} />
          <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
            Semana a semana. Toque para ver o que marcou cada ciclo.
          </Txt>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            style={{ marginTop: 14, marginHorizontal: -PAD }}
            contentContainerStyle={{ paddingHorizontal: PAD, gap: 6 }}>
            <Pressable onPress={() => setFiltro(null)}>
              <Row gap={6} style={{ backgroundColor: filtro === null ? c.tx : c.bg1, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill }}>
                <Txt v="label" c={filtro === null ? c.onHero : c.tx2}>Por semana</Txt>
                <Txt v="micro" c={filtro === null ? c.lime : c.tx4}>{semanas.length}</Txt>
              </Row>
            </Pressable>
            {contagens.map((f) => {
              const on = filtro === f.kind;
              return (
                <Pressable key={f.kind} onPress={() => setFiltro(on ? null : f.kind)}>
                  <Row gap={6} style={{ backgroundColor: on ? c.tx : c.bg1, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill }}>
                    <Txt v="label" c={on ? c.onHero : c.tx2}>{f.label}</Txt>
                    <Txt v="micro" c={on ? c.lime : c.tx4}>{f.n}</Txt>
                  </Row>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* A view por semana vale para todas as abas: com um tipo
              escolhido, cada semana mostra só aquele registro. Semanas sem
              nada daquele tipo saem da lista. */}
          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, paddingHorizontal: 18, paddingVertical: 2 }}>
            {semanasVisiveis.map((w, i) => (
              <React.Fragment key={w.semana}>
                {i > 0 && <Divider />}
                <Semana w={w} proxT={semanas[semanas.indexOf(w) - 1]?.t ?? Infinity}
                  filtro={filtro}
                  aberto={!!abertas[w.semana]}
                  onToggle={() => setAbertas((a) => ({ ...a, [w.semana]: !a[w.semana] }))} />
              </React.Fragment>
            ))}
            {semanasVisiveis.length === 0 && (
              <Txt v="note" c={c.tx3} style={{ paddingVertical: 22, textAlign: 'center' }}>Nada registrado neste tipo ainda.</Txt>
            )}
          </View>
          {!todasSemanas && semanasComFiltro.length > FEED_SEMANAS && (
            <Pressable onPress={() => setTodasSemanas(true)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Row gap={6} style={{ justifyContent: 'center', paddingVertical: 16 }}>
                <Txt v="label" c={c.accent2}>Ver as {semanasComFiltro.length} semanas</Txt>
                <Icon name="chevdown" size={14} color={c.accent2} sw={2.2} />
              </Row>
            </Pressable>
          )}
        </View>

      </ScrollView>
    </View>
  );
}
