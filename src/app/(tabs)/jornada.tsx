import React, { useMemo, useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import {
  journeySummary, journeyChanges, journeyGoals, timelineWeeks, timelineEvents, timelineCounts, weightSeries,
  startWeight, curWeight,
  milestones, achDone, doseCycle, penStock, nextInjectionDate, siteLabel, nextSite,
  waterMlToday, checkinToday, weekGrid, last7Days, M, type Change, type TLEvent, type TLKind, type WeekMetric,
} from '../../logic/derive';
import { now, diffDays, fmtDate, relDay, nf } from '../../logic/time';
import { Txt, Row, SectionHead, Divider, ListRow, Metric } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { AreaCurve } from '../../ui/charts';

import { useTheme } from '../../ui/useTheme';
import { useLarguraApp } from '../../ui/useLarguraApp';
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
  const largura = useLarguraApp();
  const r = journeySummary(S);
  const cyc = doseCycle(S);
  const serie = weightSeries(S);
  const nd = nextInjectionDate(S);
  const ndDays = diffDays(nd, now());
  const dias = last7Days(S);
  const feitos = dias.filter((d) => d.feito).length;
  /* a contagem de semanas continua, agora só como frase: o número diz
     a constância longa que sete dias não alcançam */
  const grade = weekGrid(S, 0);
  const vividas = grade.filter((g) => !g.futura).length;
  const aplicadas = grade.filter((g) => !g.futura && g.aplicou).length;

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
        {/* número inteiro em branco puro — é o destaque da tela, e recuar a
            fração aqui só enfraquecia o que mais importa */}
        <Metric value={`−${r.lostLabel}`} unit="kg" v="hero" tone={c.onHero} dim={c.onHero} />
        <View style={{ flex: 1 }} />
        {/* A etiqueta emite um juízo, então precisa poder ser auditada: o
            toque abre /ritmo, que mostra de onde ela saiu e — mais
            importante — o que ela NÃO mede. */}
        <Pressable onPress={() => router.push('/ritmo' as any)} hitSlop={6} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}>
          <View style={{ backgroundColor: r.verdict.good ? c.lime : c.onHeroWeak, paddingHorizontal: 13, paddingVertical: 7, borderRadius: radius.pill, marginBottom: 6 }}>
            <Txt v="tag" c={r.verdict.good ? c.limeInk : c.onHero}>{r.verdict.label}</Txt>
          </View>
        </Pressable>
      </Row>

      {/* A curva vem colada no número — é a mesma informação em outra
          forma: quanto perdeu (número) e como perdeu (formato). A barra de
          progresso saiu; três gráficos num card era demais, e o que ela
          dizia cabe em texto. */}
      {/* Altura generosa de propósito: a variação semanal é de menos de
          1 kg contra uma amplitude de 7, então num gráfico baixo os platôs
          e as retomadas viram um pixel e a curva parece uma reta. */}
      {serie.length > 1 && (
        <View style={{ marginHorizontal: -PAD, marginTop: 16 }}>
          {/* padX 0: a curva encosta nas duas bordas da tela, como a de
              peso na Home. Com respiro lateral ela lia como gráfico dentro
              de um card — objeto sobre superfície. Sangrando, ela vira a
              própria superfície: o painel não CONTÉM a curva, ele É a
              curva com texto por cima. */}
          <AreaCurve pts={serie} height={84} width={largura} padT={6} padB={0} padX={0} strokeW={2}
            strokeFrom={c.lime} strokeTo={c.lime} id="jp" dashed={false} />
        </View>
      )}
      <Row style={{ justifyContent: 'space-between', marginTop: 10, alignItems: 'baseline' }}>
        <Row gap={5} style={{ alignItems: 'baseline' }}>
          <Txt v="caption" c={c.onHero2}>{nf(startWeight(S), 1).replace('.', ',')} kg no início</Txt>
          <Txt v="caption" c={c.onHero2}>·</Txt>
          {/* o peso de hoje é o outro número que importa: fica em branco */}
          <Txt v="bodyMed" c={c.onHero}>{nf(curWeight(S), 1).replace('.', ',')} kg</Txt>
          <Txt v="caption" c={c.onHero2}>hoje</Txt>
        </Row>
        <Txt v="caption" c={c.onHero2}>faltam {r.faltamLabel} kg</Txt>
      </Row>

      {/* ---- o calendário do tratamento ----

          Aqui morava o medidor do ciclo da dose: 56 riscos finos que
          enchiam da esquerda para a direita conforme os dias passavam.
          Ele estava tecnicamente correto e era a peça errada para esta
          aba. O ciclo da dose é um dado de HOJE — dura sete dias e
          zera —, e Jornada é a aba do ao longo do tempo. Um instrumento
          que reinicia toda semana não tem nada a dizer sobre uma
          história de dez.

          A primeira tentativa foi uma grade de todas as semanas do
          tratamento, sete por linha. Ela tinha o problema oposto: onze
          células cheias e três em branco viravam um bloco, e bloco não
          é leitura. Numa grade longa a célula de anteontem e a de três
          semanas atrás pesam igual — e só uma delas ainda pode ser
          corrigida hoje.

          Agora são sete dias, uma linha, ancorados em hoje à direita. A
          semana é a unidade em que a pessoa se lembra do que fez, e o
          check é a marca certa: ele não mede quanto, diz FEITO. Quem
          registrou vê a fileira marcada; quem falhou vê exatamente qual
          dia, e ainda dá tempo.

          O ciclo da dose não sumiu do app: ele continua em /ciclo, que é
          para onde este bloco leva. */}
      <Pressable onPress={() => router.push('/ciclo' as any)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
        <View style={{ marginTop: 40 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt v="micro" c={c.onHero2} style={{ letterSpacing: 1 }}>
              SEUS ÚLTIMOS 7 DIAS
            </Txt>
            <Txt v="micro" c={c.onHero2}>
              {ndDays <= 0 ? 'dose hoje' : ndDays === 1 ? 'dose amanhã' : `dose em ${ndDays} dias`}
            </Txt>
          </Row>

          <Row gap={7} style={{ marginTop: 14 }}>
            {/* Cada célula abre o dia dela; o resto da faixa continua
                levando a /ciclo. O caso que isto resolve é o mais comum de
                todos: lembrar na quarta que esqueceu de registrar a terça. */}
            {dias.map((d) => (
              <Pressable
                key={d.t}
                onPress={() => router.push(`/dia?t=${d.t}` as any)}
                style={({ pressed }) => [{ flex: 1, alignItems: 'center', opacity: pressed ? 0.7 : 1 }]}
              >
                <Txt v="micro" c={c.onHero2} style={{ marginBottom: 6, opacity: d.hoje ? 1 : 0.7 }}>{d.dow}</Txt>
                <View
                  style={{
                    width: '100%', aspectRatio: 1, borderRadius: 12,
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: d.feito ? c.lime : c.onHeroLine,
                    /* só hoje ganha contorno. Aqui a borda não separa
                       superfícies (princípio 4): aponta uma célula dentro
                       de uma fileira de iguais. */
                    ...(d.hoje && !d.feito ? { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)' } : null),
                  }}
                >
                  {d.feito
                    ? <Icon name="check" size={16} color={c.limeInk} sw={2.6} />
                    : <Txt v="micro" c={c.onHero2} style={{ opacity: 0.8 }}>{d.dia}</Txt>}
                </View>
                {/* a aplicação da semana é um ponto sob o dia, não outra
                    cor na célula: são dois fatos diferentes no mesmo dia,
                    e misturá-los na mesma marca apagaria os dois */}
                <View style={{ height: 8, justifyContent: 'center' }}>
                  {d.aplicou && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: c.onHero }} />}
                </View>
              </Pressable>
            ))}
          </Row>

          <Txt v="caption" c={c.onHero} style={{ marginTop: 8 }}>
            {feitos} de 7 dias com check-in · {aplicadas} de {vividas} semanas com aplicação
          </Txt>
        </View>
      </Pressable>

      {/* A dica da fase, no mesmo desenho da faixa de vidro do hero de
          Cuidado: círculo de 36 com o ícone, kicker em micro, frase em
          caption e chevron à direita. Eram dois cartões com a mesma
          função — a inteligência do app falando de dentro do hero — em
          dois desenhos diferentes, e isso obriga a pessoa a reconhecer
          duas vezes a mesma coisa.

          Levava ao Morphi com a pergunta da fase já digitada, e isso fazia
          sentido enquanto /ciclo não respondia: perguntar a uma IA era o
          caminho mais curto para "por que a fome voltou?". Agora a tela de
          ciclo abre nas quatro fases, com a de agora já expandida — a
          faixa leva para lá, que é a resposta direta em vez do caminho até
          ela. */}
      <Pressable
        onPress={() => router.push('/ciclo' as any)}
        style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1, marginTop: 22, marginBottom: 26 }]}
      >
        <Row gap={12} style={{ backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine, borderRadius: radius.lg, padding: 14 }}>
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="aura" size={16} color={c.onHero} sw={1.9} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt v="micro" c={c.onHero2}>{cyc.phase.label.toUpperCase()}</Txt>
            <Txt v="caption" c={c.onHero} style={{ marginTop: 2 }}>{cyc.phase.hint}</Txt>
          </View>
          <Icon name="chev" size={15} color={c.onHero2} sw={2} />
        </Row>
      </Pressable>

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
            <Txt v="tag" c={ch.good ? c.limeInk : c.tx3}>{ch.delta}</Txt>
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

  /* Aberta, a semana mostra o que os NÚMEROS daquele ciclo dizem —
     hidratação, proteína, exercício, peso — cada um comparado com a semana
     anterior, mais os acontecimentos que marcaram. Registro a registro
     fica em /historico.

     Com um tipo escolhido nos chips a semana não vira accordion: os
     registros daquele tipo aparecem direto, porque são poucos e é isso
     que a pessoa foi buscar. */
  const conquistas = filtro ? [] : milestones(S).filter((m) => m.t >= w.t && m.t < proxT);
  const notaveis = (w.eventos as TLEvent[]).filter((e) => filtro ? e.kind === filtro : NOTAVEIS.includes(e.kind));
  const metricas: WeekMetric[] = filtro ? [] : w.metricas;
  const cor = (k: string) => (c as any)[k] as string;
  const expandido = filtro ? true : aberto;

  const Cabecalho = (
    <>
      <Row style={{ alignItems: 'center' }}>
        <Txt v="bodyMed" style={{ marginRight: 8 }}>Semana {w.semana}</Txt>
        {!filtro && w.mudouDose && (
          <View style={{ backgroundColor: c.accentWeak, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, marginRight: 6 }}>
            <Txt v="tag" c={c.accent}>dose ajustada</Txt>
          </View>
        )}
        <View style={{ flex: 1 }} />
        {!filtro && w.deltaPeso && (
          <View style={{ backgroundColor: perdeu ? c.limeWeak : c.bg2, paddingHorizontal: 9, paddingVertical: 3, borderRadius: radius.pill }}>
            <Txt v="tag" c={perdeu ? c.limeInk : c.tx3}>{w.deltaPeso}</Txt>
          </View>
        )}
        {!filtro && (
          <View style={{ marginLeft: 10 }}>
            <Icon name={aberto ? 'chevup' : 'chevdown'} size={15} color={c.tx4} sw={2} />
          </View>
        )}
      </Row>
      <Txt v="caption" c={c.tx3} style={{ marginTop: 5 }}>
        {filtro ? fmtDate(new Date(w.t)) : `${w.dose} · ${w.site}`}
      </Txt>
      {!filtro && <Txt v="caption" c={c.tx4} style={{ marginTop: 3 }} numberOfLines={1}>{w.resumo}</Txt>}
    </>
  );

  /* Sem caixas dentro de caixa: o conteúdo aberto respira no próprio card
     da lista, separado por espaço e por um filete à esquerda. */
  const Corpo = (
    <View style={{ marginTop: 14 }}>
      {metricas.length > 0 && (
        <Row style={{ flexWrap: 'wrap' }}>
          {metricas.map((m) => (
            <View key={m.label} style={{ width: '50%', paddingRight: 12, marginBottom: 14 }}>
              <Row gap={7}>
                <Icon name={m.ic} size={14} color={c.tx4} sw={1.9} />
                <Txt v="micro" c={c.tx3}>{m.label}</Txt>
              </Row>
              <Row gap={6} style={{ marginTop: 5, alignItems: 'baseline' }}>
                <Metric value={m.valor} v="bodyMed" />
                {m.delta && <Txt v="micro" c={m.good ? c.tx2 : c.tx4}>{m.delta}</Txt>}
              </Row>
            </View>
          ))}
        </Row>
      )}

      {[...conquistas.map((m) => ({ k: `m-${m.t}-${m.title}`, ic: m.ic, cor: c.lime, titulo: m.title, sub: m.sub })),
        ...notaveis.map((ev) => ({ k: ev.key, ic: ev.ic, cor: cor(ev.color), titulo: ev.title, sub: ev.sub }))
      ].map((it) => (
        <Row key={it.k} gap={12} style={{ alignItems: 'flex-start', marginTop: 12 }}>
          <View style={{ width: 3, alignSelf: 'stretch', borderRadius: 2, backgroundColor: it.cor }} />
          <Icon name={it.ic} size={15} color={c.tx3} sw={1.9} />
          <View style={{ flex: 1 }}>
            <Txt v="caption" c={c.tx}>{it.titulo}</Txt>
            <Txt v="micro" c={c.tx3} style={{ marginTop: 2 }} numberOfLines={1}>{it.sub}</Txt>
          </View>
        </Row>
      ))}

      {metricas.length === 0 && conquistas.length === 0 && notaveis.length === 0 && (
        <Txt v="caption" c={c.tx4}>Sem registros nesta semana.</Txt>
      )}
    </View>
  );

  if (filtro) {
    return <View style={{ paddingVertical: 16 }}>{Cabecalho}{Corpo}</View>;
  }
  return (
    <Pressable onPress={onToggle} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <View style={{ paddingVertical: 16 }}>
        {Cabecalho}
        {expandido && Corpo}
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
  const metas = journeyGoals(S);
  const eventos = useMemo(() => timelineEvents(S), [S]);
  const contagens = useMemo(() => timelineCounts(S), [S]);
  const cor = (k: string) => (c as any)[k] as string;

  const semanasVisiveis = todasSemanas ? semanas : semanas.slice(0, FEED_SEMANAS);
  const filtrados = filtro ? eventos.filter((e) => e.kind === filtro) : [];
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

        {/* Estoque: é lembrete de reposição, não emergência clínica. Em
            vermelho parecia alarme grave — fica em azul, que é a cor de
            ação do app. O vermelho continua reservado para o que de fato
            precisa de atenção imediata. */}
        {!pen.verdict.good && (
          <Pressable onPress={go('/caneta')} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <Row gap={12} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16, marginTop: 20 }}>
              <View style={{ width: 34, height: 34, borderRadius: radius.sm, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="pill" size={17} color={c.accent} sw={1.9} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt v="body">{pen.verdict.label}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>
                  {pen.left} de {pen.total} doses na caneta · cerca de {pen.semanas} {pen.semanas === 1 ? 'semana' : 'semanas'}
                </Txt>
              </View>
              <Icon name="chev" size={14} color={c.tx4} sw={2} />
            </Row>
          </Pressable>
        )}

        {/* ---------- O QUE JÁ MUDOU — grade densa ---------- */}
        <View style={{ marginTop: 34 }}>
          <SectionHead title="O que já mudou" link="Evolução" onPress={go('/evolucao')} />
          <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 14 }}>
            {changes.map((ch) => <ChangeTile key={ch.label} ch={ch} onPress={go(ch.to_)} />)}
          </Row>
          {/* Aqui havia três atalhos (Fotos, Metas, Saúde). Tentei como
              pílula e como linha de navegação, e nenhum dos dois assentou:
              o problema não era o estilo, era a redundância. Os três moram
              em Evolução, que já é o link do cabeçalho desta seção — e a
              pressão arterial já aparece como tile, levando a Saúde. */}
        </View>

        {/* ---------- METAS — a linha de chegada ----------
            As outras seções olham para trás. Esta é a única que aponta
            para onde a pessoa quer chegar, e por isso vem logo depois do
            que já mudou: passado e destino lado a lado. */}
        <View style={{ marginTop: 34 }}>
          <SectionHead title="Onde quero chegar" link="Metas" onPress={go('/metas')} />
          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, paddingHorizontal: 18, paddingVertical: 4 }}>
            {metas.map((m, i) => (
              <React.Fragment key={m.id}>
                {i > 0 && <Divider />}
                <View style={{ paddingVertical: 15 }}>
                  <Row gap={11}>
                    <Icon name={m.ic} size={16} color={c.tx3} sw={1.9} />
                    <Txt v="caption" c={c.tx} style={{ flex: 1 }} numberOfLines={1}>{m.label}</Txt>
                    <Txt v="micro" c={m.pct >= 100 ? c.limeInk : c.tx3}>{Math.round(m.pct)}%</Txt>
                  </Row>
                  <View style={{ height: 5, borderRadius: radius.pill, backgroundColor: c.bg2, overflow: 'hidden', marginTop: 9 }}>
                    <View style={{ width: `${Math.max(2, m.pct)}%`, height: 5, borderRadius: radius.pill, backgroundColor: m.pct >= 100 ? c.lime : c.accent }} />
                  </View>
                  <Txt v="micro" c={c.tx4} style={{ marginTop: 6 }}>{m.hint}</Txt>
                </View>
              </React.Fragment>
            ))}
          </View>
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

          {filtro === null ? (
            /* "Por semana" é a única aba que agrupa por ciclo — é o que
               dá sentido a ela existir como aba própria. */
            <>
              <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, paddingHorizontal: 18, paddingVertical: 2 }}>
                {semanasVisiveis.map((w, i) => (
                  <React.Fragment key={w.semana}>
                    {i > 0 && <Divider />}
                    <Semana w={w} proxT={semanas[semanas.indexOf(w) - 1]?.t ?? Infinity}
                      filtro={null}
                      aberto={!!abertas[w.semana]}
                      onToggle={() => setAbertas((a) => ({ ...a, [w.semana]: !a[w.semana] }))} />
                  </React.Fragment>
                ))}
              </View>
              {!todasSemanas && semanas.length > FEED_SEMANAS && (
                <Pressable onPress={() => setTodasSemanas(true)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <Row gap={6} style={{ justifyContent: 'center', paddingVertical: 16 }}>
                    <Txt v="label" c={c.accent2}>Ver as {semanas.length} semanas</Txt>
                    <Icon name="chevdown" size={14} color={c.accent2} sw={2.2} />
                  </Row>
                </Pressable>
              )}
            </>
          ) : (
            /* Nos filtros de tipo o ciclo não é a unidade — a leitura é
               cronológica, do mais recente para trás. */
            <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, paddingHorizontal: 16, paddingVertical: 4 }}>
              {filtrados.slice(0, 30).map((ev, i) => (
                <React.Fragment key={ev.key}>
                  {i > 0 && <Divider />}
                  <Row style={{ alignItems: 'flex-start', paddingVertical: 14 }}>
                    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: cor(ev.color) + '1F', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={ev.ic} size={15} color={cor(ev.color)} sw={1.9} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Row style={{ justifyContent: 'space-between' }}>
                        <Txt v="body" style={{ flex: 1, marginRight: 8 }}>{ev.title}</Txt>
                        {ev.value ? <Txt v="micro" c={ev.valueColor ? cor(ev.valueColor) : c.tx4}>{ev.value}</Txt> : null}
                      </Row>
                      <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }} numberOfLines={1}>{ev.sub}</Txt>
                      <Txt v="micro" c={c.tx4} style={{ marginTop: 4, textTransform: 'capitalize' }}>{relDay(new Date(ev.day))}</Txt>
                    </View>
                  </Row>
                </React.Fragment>
              ))}
              {filtrados.length === 0 && (
                <Txt v="note" c={c.tx3} style={{ paddingVertical: 22, textAlign: 'center' }}>Nada registrado neste tipo ainda.</Txt>
              )}
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
}
