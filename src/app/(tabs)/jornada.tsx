import React, { useMemo, useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';

import {
  journeySummary, journeyChanges, journeyGoals, metaDePeso, timelineWeeks, timelineEvents, timelineCounts, weightSeries,
  startWeight, curWeight,
  milestones, doseCycle, penStock, nextInjectionDate, siteLabel, nextSite,
  waterMlToday, litros, checkinToday, protocoloDaSemana, weekGrid, last7Days, M,
  sintomasDaSemana, diasDeSintomas, type Change, type TLEvent, type TLKind, type WeekMetric,
  diasAteAplicar, semanasDaGrade,
} from '../../logic/derive';
import { now, fmtDate, relDay, nf, quandoEm } from '../../logic/time';
import { Txt, Row, SectionHead, Divider, ListRow, Metric, Vazio, Rolagem } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { AreaCurve } from '../../ui/charts';

import { useTheme } from '../../ui/useTheme';
import { useLarguraApp } from '../../ui/useLarguraApp';
import { useLightStatusBar } from '../../ui/useLightStatusBar';
import { radius, RESPIRO_ABAS } from '../../theme';
import { aguaTxt } from '../../logic/medidas';

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
const NOTAVEIS: TLKind[] = ['consulta', 'exame'];

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
  /* ⚠️ TRÊS TONS, E NÃO DOIS. O par verde/vermelho não tem onde pôr
     "acelerado": perder mais de 1,5 kg por semana não é fracasso nem
     sucesso, é assunto para a equipe. Vermelho cobra; âmbar chama.

     ⚠️ E O TERCEIRO NÃO É VERMELHO, e chegou a ser. Vermelho cheio, do
     tamanho da etiqueta e em cima do hero, é a tela acusando alguém: a
     pessoa abre a Jornada para ver como vai, e a primeira cor que ela
     encontra diz que errou. Estar acima do peso inicial é um fato do
     período, não uma falta — e quem trata obesidade sabe que a semana em
     que a balança sobe é a semana em que as pessoas desistem.

     O teal não absolve nem acusa: ele é a única cor viva da paleta que
     não carrega juízo, e por isso é a que sobra para dizer "olha isto"
     sem dizer "você falhou".

     A tinta é o bg1 nos dois primeiros: no tema claro ela é branca sobre
     o verde e o âmbar escuros, no escuro é quase preta sobre os claros. O
     teal é a mesma cor nos dois temas, então a dele é o limeInk, que é a
     tinta escura fixa das superfícies acesas. */
  const tomDoVeredito = r.verdict.tom ?? (r.verdict.good ? 'bom' : 'ruim');
  const [fundoDoVeredito, tintaDoVeredito] =
    tomDoVeredito === 'bom' ? [c.ok, c.bg1]
      : tomDoVeredito === 'atencao' ? [c.amber, c.bg1]
        : [c.teal, c.limeInk];
  const cyc = doseCycle(S);
  const serie = weightSeries(S);
  const nd = nextInjectionDate(S);
  const ndDays = diasAteAplicar(S);
  const dias = last7Days(S);
  const feitos = dias.filter((d) => d.feito).length;
  /* a contagem de semanas continua, agora só como frase: o número diz
     a constância longa que sete dias não alcançam */
  const { vividas, aplicadas } = semanasDaGrade(S);

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
        style={StyleSheet.absoluteFill}
      />
      {/* ---- peso: o número que a pessoa veio buscar ---- */}
      <Txt v="micro" c={c.onHero2} style={{ letterSpacing: 1.2 }}>SEMANA {r.semana} · DIA {r.dia}</Txt>

      <Row style={{ alignItems: 'center', marginTop: 12 }}>
        {/* número inteiro em branco puro — é o destaque da tela, e recuar a
            fração aqui só enfraquecia o que mais importa */}
        <Metric value={r.lostLabel} unit="kg" v="hero" tone={c.onHero} dim={c.onHero} />
        <View style={{ flex: 1 }} />
        {/* A etiqueta emite um juízo, então precisa poder ser auditada: o
            toque abre /ritmo, que mostra de onde ela saiu e — mais
            importante — o que ela NÃO mede. */}
        <Pressable onPress={() => router.push('/ritmo' as any)} hitSlop={6} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}>
          {/* A ETIQUETA É CHEIA, e era lima ou vidro.

              Sobre o gradiente azul não existe versão LAVADA de verde ou
              vermelho: o okBg some no azul e o ctaWeak, com oito por cento
              de tinta, é invisível. E o par lima/vidro que estava aqui
              dizia boa notícia com a cor de "alcançado" da casa e má
              notícia com ausência de cor — que lê como desligado, não como
              alerta.

              Cheia, a pastilha carrega o mesmo verde e vermelho das
              pastilhas la embaixo, e o marcador para de mudar de
              vocabulário dentro da mesma tela.

              A tinta é o bg1 e não um branco cravado: no tema claro ele é
              branco sobre o verde escuro, e no escuro é quase preto sobre
              o verde claro. Uma cor só, que vira duas onde precisa. */}
          <View style={{ backgroundColor: fundoDoVeredito, paddingHorizontal: 13, paddingVertical: 7, borderRadius: radius.pill }}>
            <Txt v="tag" c={tintaDoVeredito}>{r.verdict.label}</Txt>
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
          <Txt v="caption" c={c.onHero2}>{nf(startWeight(S), 1)} kg no início</Txt>
          <Txt v="caption" c={c.onHero2}>·</Txt>
          {/* o peso de hoje é o outro número que importa: fica em branco */}
          <Txt v="bodyMed" c={c.onHero}>{nf(curWeight(S), 1)} kg</Txt>
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
            <Txt v="tag" c={c.onHero}>
              dose {quandoEm(ndDays).label}
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
/* ⚠️ A PASTILHA É VERDE, VERMELHA OU CINZA, e era lima ou cinza.

   Lima é a cor de "alcançado" da casa — ela marca meta batida, streak,
   check-in feito. Aqui o que a pastilha carrega não é conquista: é o
   estado de um marcador do corpo, que é a mesma pergunta que os exames
   respondem duas telas adiante. Verde e vermelho são o par que aquela
   tela já usa, e um marcador não pode mudar de vocabulário quando muda
   de tela.

   E o cinza continua existindo para o terceiro caso, que é o que o par
   verde/vermelho sozinho não sabe dizer: o número que não se mexeu. */
function ChangeTile({ ch, onPress }: { ch: Change; onPress: () => void }) {
  const { c } = useTheme();
  /* ⚠️ O TOM CONTINUA SE CHAMANDO 'ruim', E A COR NÃO É VERMELHA.

     O nome é do FATO — a notícia é má —, e a cor é de como se conta. O
     vermelho saiu da Jornada inteira pelo mesmo motivo que saiu do hero:
     ele acusa, e a semana em que a balança sobe é a semana em que as
     pessoas desistem. O teal marca sem cobrar.

     O par tem token — `tealBg`/`tealInk` —, e por um commit foi montado
     aqui na mão. Virou token quando o mesmo par apareceu na segunda tela:
     duas cópias de uma conta de cor é como começam as divergências. */
  const [fundo, tinta] = ch.tom === 'bom' ? [c.okBg, c.ok]
    : ch.tom === 'ruim' ? [c.tealBg, c.tealInk]
      : [c.bg2, c.tx3];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ width: '49%', opacity: pressed ? 0.7 : 1 }]}>
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18, marginBottom: 7 }}>
        <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Icon name={ch.ic} size={17} color={c.tx3} sw={1.8} />
          <View style={{ backgroundColor: fundo, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill }}>
            <Txt v="tag" c={tinta}>{ch.delta}</Txt>
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
  /* A de peso vem primeiro porque é a que traz a pessoa para cá. Ela
     mora fora de `journeyGoals` — ver a nota lá — e cada tela decide se
     a mostra; a de Metas não mostra, porque já a tem na capa. */
  const metas = [metaDePeso(S), ...journeyGoals(S)].filter(Boolean) as ReturnType<typeof journeyGoals>;
  const eventos = useMemo(() => timelineEvents(S), [S]);
  /* ⚠️ CONSULTA NÃO VIRA FILTRO AQUI, e o evento continua existindo.

     "Seu tratamento" filtra o que se REPETE: check-in, refeição,
     aplicação, pesagem — dezenas de linhas cada, e é isso que faz um
     filtro valer. Consulta são duas em três meses, e a aba abria uma lista
     de dois itens que a pessoa já tinha visto na semana onde eles caíram.

     E ela tem tela própria: /consultas, com preparo, resumo e receita.
     Uma segunda porta menor, no meio de uma fila de chips, é a
     desimportância dizendo o contrário do que a outra tela diz.

     O evento fica na linha do tempo: dentro de "Por semana" ele é um
     destaque do ciclo, que é onde consulta pertence. */
  const contagens = useMemo(
    () => timelineCounts(S).filter((f) => f.kind !== 'consulta'),
    [S],
  );
  const cor = (k: string) => (c as any)[k] as string;

  const semanasVisiveis = todasSemanas ? semanas : semanas.slice(0, FEED_SEMANAS);
  const filtrados = filtro ? eventos.filter((e) => e.kind === filtro) : [];
  const pen = penStock(S);
  const ci = checkinToday(S);
  const mlHoje = waterMlToday(S);
  const proto = protocoloDaSemana(S);

  /* SINTOMAS ENTRA NA LISTA, e por isso ela não se chama mais só de
     hábitos.

     A tela existia, estava registrada no Stack e NENHUMA outra empurrava
     para ela: dava para chegar lá digitando a rota. É metade do
     tratamento — o que a caneta causa — sem porta, enquanto água e
     exercício têm a sua nesta mesma lista.

     O subtítulo diz o sintoma mais presente da semana, e distingue os
     dois silêncios: quem não respondeu lê 'sem registro', quem respondeu
     e não teve nada lê 'sem queixas'. */
  const sint = sintomasDaSemana(S);
  const diasSint = diasDeSintomas(S);
  /* Quais eventos da lista filtrada estão abertos. Mora aqui e não no
     item porque a lista se remonta a cada troca de filtro, e estado
     dentro de um item que some não sobrevive à volta dele. */
  const [eventosAbertos, setEventosAbertos] = useState<Record<string, boolean>>({});
  const vitais = ['pa', 'glic', 'fc', 'spo2', 'fr']
    .filter((k) => (((S.vitals as any)?.[k] ?? []) as any[]).length).length;
  const temas: [string, string, string, string][] = [
    ['utensils', 'Alimentação', `${S.meals.length} refeições`, '/alimentacao'],
    /* A água ia para o MENU de registros enquanto as vizinhas iam para a
       tela do próprio hábito: era a única linha desta lista que não
       levava a lugar nenhum sobre si mesma. E o número usava um
       formatador próprio, que escrevia 1,8 L onde a tela de água escreve
       1,75 L. */
    /* ⚠️ A CONDIÇÃO ERA `ci`, E O NÚMERO É OUTRA CONTA.

       `ci` só diz que EXISTE linha de hoje, e a linha nasce em qualquer
       registro — uma refeição, um treino, um copo. O volume vem de
       `waterMlToday`, que lê os goles e a água da comida. Duas contas
       diferentes decidindo uma frase só: quem registrou o almoço e não
       bebeu nada lia "0 L hoje", que é o aplicativo AFIRMANDO zero sobre
       um dia em que ele não sabe de nada.

       A vizinha de baixo já fazia certo — `ci && ci.exerc` —, e o
       comentário de Sintomas, vinte linhas acima, escreve a regra com
       todas as letras: distinguir os dois silêncios. Agora quem decide é
       o mesmo número que aparece. */
    ['water', 'Hidratação', mlHoje > 0 ? `${aguaTxt(S, mlHoje)} hoje` : 'sem registro', '/agua'],
    ['dumbbell', 'Exercício', ci && ci.exerc ? `${ci.exerc} min hoje` : 'sem registro', '/exercicio'],
    ['waves', 'Sintomas', !diasSint ? 'sem registro'
      : !sint.length ? 'sem queixas na semana'
      : `${sint[0].label.toLowerCase()} em ${sint[0].dias} ${sint[0].dias === 1 ? 'dia' : 'dias'}`, '/sintomas'],
    /* Contado por protocoloDaSemana, e não somando os `done`: os itens
       medidos não têm esse campo — eles se cumprem pelos registros. */
    ['target', 'Protocolos', `${proto.feitas} de ${proto.total}`, '/protocolos'],
    /* ⚠️ SAÚDE E FOTOS ENTRARAM PORQUE NÃO TINHAM PORTA NENHUMA.

       /saude era alcançável por um lugar só — a pastilha de Pressão em "O
       que já mudou" —, e ela só existe com duas medidas guardadas. Quem
       nunca registrou pressão não tinha como chegar na tela que serve
       justamente para registrar a primeira.

       É o mesmo defeito que /exames tinha, e a razão de ele se repetir é
       sempre a mesma: a porta nasce no fluxo que produz o dado, e o fluxo
       que produz o dado só roda para quem já tem o dado.

       (A porta de /fotos morava aqui também, e saiu junto com a foto de
       progresso — ver a nota do recurso, em seed.ts.) */
    /* ⚠️ O CARTÃO SE CHAMA COMO A TELA QUE ELE ABRE, e se chamava
       "Saúde" — um nome largo demais para um app em que tudo é saúde. A
       tela é "Sinais vitais", e o nome dela diz o que tem lá dentro.

       ⚠️ E O SUBTÍTULO DEIXOU DE SER A PRESSÃO. "127/82 mmHg" solto num
       cartão chamado Saúde não diz de que número se trata nem se ele
       está bom — é um dado clínico sem a régua ao lado, que é
       exatamente o que esta tela toda evita. A contagem de indicadores
       diz o que a pessoa vai encontrar, que é o trabalho de um
       subtítulo de porta. */
    ['heart', 'Sinais vitais', vitais ? `${vitais} ${vitais === 1 ? 'indicador' : 'indicadores'}` : 'sem registro', '/saude'],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Rolagem showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: RESPIRO_ABAS, paddingHorizontal: PAD }}>
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
          {/* O LINK DIZ O NOME DO DESTINO, e dizia "Ver todas" — que é uma
              instrução, não um lugar. É a mesma regra que tirou o "Ir para"
              dos botões da Home. E o título ganhou o possessivo das
              vizinhas: "O que já mudou", "Seu tratamento", "Suas metas". */}
          <SectionHead title="Suas metas" link="Metas" onPress={go('/metas')} />

          {/* ⚠️ FILEIRA DE CARTÕES, E ERA UMA LISTA EMPILHADA.

              Quatro metas em linhas de 16 px de respiro, cada uma com
              rótulo, porcentagem, barra e dica, ocupavam quase uma dobra
              inteira da aba — e a Jornada é a tela mais longa do
              aplicativo, com o que já mudou, o tratamento, o dia a dia e
              a história ainda por baixo.

              O que a seção precisa responder de relance é "como vão as
              minhas metas", e isso cabe num cartão pequeno: o nome, o
              número e a barra. A dica — "9 de 13 noites registradas" —
              some daqui e continua na tela de Metas, que é onde se olha
              uma meta de perto.

              ⚠️ E A FILEIRA ROLA, EM VEZ DE QUEBRAR EM GRADE. Meta é lista
              aberta: são três hoje e podem ser seis depois de a pessoa
              criar as suas. Em grade de dois, seis metas viram três
              fileiras e a seção volta a ocupar a dobra que ela acabou de
              devolver. Rolando, seis custam o mesmo que três. */}
          <Rolagem
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 14, marginHorizontal: -PAD }}
            contentContainerStyle={{ paddingHorizontal: PAD, gap: 10 }}
          >
            {metas.map((m) => {
              const feita = !!(m as any).feita;
              const pessoal = !!(m as any).pessoal;
              const cheia = m.pct >= 100;
              return (
                <View
                  key={m.id}
                  style={{ width: 142, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 15, gap: 10 }}
                >
                  <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Icon
                      name={feita ? 'check' : m.ic} size={16} sw={1.9}
                      /* ⚠️ META CUMPRIDA SAI EM LIMA, e saía em azul. Azul é
                         a cor de AÇÃO deste app — é o que leva a algum
                         lugar —, e uma meta fechada não leva a lugar
                         nenhum: ela já aconteceu. */
                      color={feita || cheia ? c.limeSoftInk : c.tx3}
                    />
                    {/* A PESSOAL NÃO TEM PORCENTAGEM. Ela é uma coisa que
                        acontece num dia: 0% ou 100% seria a caixinha dita
                        em número. No lugar dela vai o estado, em palavra. */}
                    <Txt v="micro" c={feita || cheia ? c.limeSoftInk : c.tx3}>
                      {pessoal ? (feita ? 'feita' : 'aberta') : `${Math.round(m.pct)}%`}
                    </Txt>
                  </Row>

                  {/* Duas linhas de altura fixa: sem isso "Vestir a calça
                      jeans antiga" empurra a barra dele para baixo da dos
                      vizinhos, e a fileira fica com os cartões desalinhados
                      por dentro. */}
                  <Txt v="caption" numberOfLines={2} style={{ minHeight: 42, lineHeight: 21 }}>{m.label}</Txt>

                  {/* A barra some na pessoal, e não vira uma barra vazia:
                      não existe sessenta por cento de caber numa calça. */}
                  {pessoal ? null : (
                    <View style={{ height: 5, borderRadius: radius.pill, backgroundColor: c.bg2, overflow: 'hidden' }}>
                      <View style={{ width: `${Math.max(2, m.pct)}%`, height: 5, borderRadius: radius.pill, backgroundColor: cheia ? c.lime : c.accent }} />
                    </View>
                  )}
                </View>
              );
            })}
          </Rolagem>
        </View>

        {/* ---------- O DIA A DIA — uma porta por assunto ----------

             Chamava-se "Hábitos", e o link do cabeçalho levava a
             Protocolos — que é um dos tiles logo abaixo. Duas portas para
             a mesma sala, a de cima escrita menor. Com Sintomas na lista o
             título também deixou de valer: o que a caneta causa não é
             hábito de ninguém. */}
        <View style={{ marginTop: 34 }}>
          <SectionHead title="O dia a dia" />
          <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 14 }}>
            {temas.map(([ic, t, sub, to]) => (
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

        {/* ⚠️ A FITA DE MARCOS SAIU DAQUI, e ela era a seção entre as metas
            e a história.

            Dois motivos, e o segundo é o que decide.

            A parte de CONQUISTA não combinava com esta aba. A Jornada
            responde "como vai o meu tratamento", e uma fita de troféus é
            outro registro: ela premia, e o resto da tela mede. Foi para o
            perfil, que é onde a pessoa vai olhar para si e não para o
            tratamento.

            E o que sobrava depois de tirar as conquistas era quase tudo
            duplicata do que vem logo abaixo: consulta, exame e mudança de
            dose já estão em "Seu tratamento", com filtro por tipo e com o
            check-in abrindo. Dois desenhos da mesma lista, um deles sem
            filtro e sem abrir, separados por trinta pixels.

            Sobravam dois marcos que a linha do tempo não tem — o início do
            tratamento e os 5% do peso. Eles continuam existindo:
            `milestones` segue alimentando os destaques de cada semana,
            dentro do acordeão de "Por semana". */}

        {/* ---------- A HISTÓRIA — por semana, com destaques ---------- */}
        <View style={{ marginTop: 34 }}>
          <SectionHead title="Seu tratamento" link="Ver tudo" onPress={go('/historico')} />
          <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
            Semana a semana. Toque para ver o que marcou cada ciclo.
          </Txt>

          <Rolagem horizontal showsHorizontalScrollIndicator={false}
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
          </Rolagem>

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
            filtrados.length === 0 ? (
            /* Sem o cartão, e não com o cartão vazio por dentro: um
               retângulo branco com uma frase cinza no meio parece a lista
               que não carregou. */
            <Vazio ic="filter" titulo="Nada registrado neste tipo ainda" />
          ) : (
            /* Nos filtros de tipo o ciclo não é a unidade — a leitura é
               cronológica, do mais recente para trás. */
            <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, paddingHorizontal: 16, paddingVertical: 4 }}>
              {/* ⚠️ O EVENTO COM RESPOSTA ABRE, e nenhum abria.

                  O check-in mostrava três acumuladores e uma palavra de
                  humor. O resto do que a pessoa respondeu — enjoo, fome,
                  energia, intestino, o sintoma que ela digitou — estava
                  guardado e sem tela nenhuma: ela respondeu e nunca mais
                  viu. Num aplicativo que pede registro todo dia, isso é o
                  contrato quebrado do lado de cá.

                  Só quem TEM o que mostrar vira botão. Peso, refeição e
                  aplicação continuam linhas de leitura, sem seta e sem
                  toque — seta que abre o vazio é pior do que linha
                  parada. */}
              {filtrados.slice(0, 30).map((ev, i) => {
                const temResposta = !!ev.respostas?.length;
                const aberto = !!eventosAbertos[ev.key];
                const corpo = (
                  <>
                    <Row style={{ alignItems: 'flex-start', paddingTop: 14, paddingBottom: aberto ? 10 : 14 }}>
                      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: cor(ev.color) + '1F', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={ev.ic} size={15} color={cor(ev.color)} sw={1.9} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Row style={{ justifyContent: 'space-between' }}>
                          <Txt v="body" style={{ flex: 1, marginRight: 8 }}>{ev.title}</Txt>
                          {ev.value ? <Txt v="micro" c={ev.valueColor ? cor(ev.valueColor) : c.tx4}>{ev.value}</Txt> : null}
                          {temResposta ? (
                            <Icon name={aberto ? 'chevup' : 'chevdown'} size={14} color={c.tx4} sw={2} />
                          ) : null}
                        </Row>
                        <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }} numberOfLines={1}>{ev.sub}</Txt>
                        <Txt v="micro" c={c.tx4} style={{ marginTop: 4, textTransform: 'capitalize' }}>{relDay(new Date(ev.day))}</Txt>
                      </View>
                    </Row>
                    {aberto && temResposta ? (
                      /* Recuado até a coluna do título: aberto, o bloco é
                         continuação daquela linha, e não um item novo. */
                      <View style={{ marginLeft: 44, paddingBottom: 14, gap: 7 }}>
                        {ev.respostas!.map((r) => (
                          <Row key={r.k} style={{ justifyContent: 'space-between', alignItems: 'flex-start' }} gap={12}>
                            <Txt v="micro" c={c.tx4}>{r.k}</Txt>
                            <Txt v="micro" c={c.tx2} style={{ flex: 1, textAlign: 'right' }}>{r.v}</Txt>
                          </Row>
                        ))}
                      </View>
                    ) : null}
                  </>
                );
                return (
                  <React.Fragment key={ev.key}>
                    {i > 0 && <Divider />}
                    {temResposta ? (
                      <Pressable
                        onPress={() => setEventosAbertos((a) => ({ ...a, [ev.key]: !a[ev.key] }))}
                        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                      >
                        {corpo}
                      </Pressable>
                    ) : corpo}
                  </React.Fragment>
                );
              })}
            </View>
          ))}
        </View>

      </Rolagem>
    </View>
  );
}
