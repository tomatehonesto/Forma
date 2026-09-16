import React, { useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Path, Defs, LinearGradient as SvgGrad, Stop, Circle, Line } from 'react-native-svg';
import { Txt } from './kit';
import { useTheme } from './useTheme';

type Pt = { x: number; y: number };

/* A CURVA PASSA PELOS PONTOS.

   O suavizador anterior encadeava quadráticas de ponto-médio a
   ponto-médio, usando cada leitura como ponto de CONTROLE. Ponto de
   controle é ímã, não trilho: a curva era puxada na direção de cada
   leitura sem nunca tocá-la, e só a primeira e a última ficavam em cima
   do traço. Enquanto o gráfico era um fio liso ninguém percebia; no dia
   em que ele ganhou um nó por leitura, os nós apareceram boiando ao lado
   da linha — e o erro estava na linha, não nos nós.

   No lugar entra Catmull-Rom convertido para Bézier cúbica: cada tangente
   sai da direção entre o ponto anterior e o próximo, e a curva é obrigada
   a passar por todos. A tensão de 1/6 é a que reproduz a suavidade que a
   tela já tinha. Ela pode ultrapassar de leve o topo ou a base num pico
   isolado, e é por isso que o cartão reserva folga em cima e embaixo. */
function smooth(P: Pt[]) {
  if (P.length < 2) return '';
  if (P.length === 2) return `M${P[0].x},${P[0].y} L${P[1].x},${P[1].y}`;
  const t = 1 / 6;
  let d = `M${P[0].x},${P[0].y}`;
  for (let i = 0; i < P.length - 1; i++) {
    const a = P[i - 1] || P[i], b = P[i], e = P[i + 1], f = P[i + 2] || e;
    d += ` C${b.x + (e.x - a.x) * t},${b.y + (e.y - a.y) * t} ${e.x - (f.x - b.x) * t},${e.y - (f.y - b.y) * t} ${e.x},${e.y}`;
  }
  return d;
}

/* Curva de área suave. pts em coords normalizadas (x,y ∈ 0..1, y=1 no topo). */
export function AreaCurve({
  pts, height = 150, width, marker, dashed = true, strokeFrom, strokeTo,
  padT = 18, padB = 24, padX = 8, strokeW = 2.6, id = 'c', nodes = false,
  fill = 0.17, onScrub, scrub, nosEm, eixosEm,
}: {
  pts: Pt[]; height?: number; /** largura conhecida — evita esperar o onLayout */ width?: number;
  marker?: number | null; dashed?: boolean;
  strokeFrom?: string; strokeTo?: string; padT?: number; padB?: number; padX?: number; strokeW?: number; id?: string; nodes?: boolean;
  /** opacidade do topo da área. Fio fino de sparkline pede 0,17; cartão de
      gráfico, que é a peça principal da seção, aguenta mais. */
  fill?: number;
  /* Deslizar o dedo pela curva devolve o índice do ponto mais próximo, e
     null ao soltar. Quem passa isto assume a leitura: a curva sozinha não
     sabe o que cada ponto significa. */
  onScrub?: (i: number | null) => void;
  /** índice destacado — controlado por fora, para o card poder reagir junto */
  scrub?: number | null;
  /* EM QUAIS PONTOS O NÓ APARECE.

     `nodes` marca todos, o que serve quando cada ponto é uma medida. Uma
     curva desenhada com nove pontos só para ficar lisa não tem nove
     medidas: tem três marcos e seis pontos de traçado, e nove bolinhas
     transformariam o traçado em informação que ele não é. */
  nosEm?: number[];
  /* O FIO QUE LIGA O PONTO AO RÓTULO DE BAIXO.

     Uma curva que sangra até a borda do card não tem eixo, e sem eixo um
     ponto no meio do traço não diz a que altura do tempo ele está. O fio
     desce do ponto até a base do desenho, onde o rótulo o espera — é o que
     transforma "uma bolinha na curva" em "este dia, este peso".

     Nos extremos ele não existe: ali o ponto encosta na borda do card, e
     um fio na borda lê como moldura, não como marca. */
  eixosEm?: number[];
}) {
  const { c } = useTheme();
  const [medida, setW] = useState(0);
  /* Quem já sabe a largura passa direto: o gráfico aparece no primeiro
     quadro em vez de piscar vazio esperando a medição. */
  const w = width ?? medida;
  const sf = strokeFrom ?? c.gradFrom, st = strokeTo ?? c.gradTo;
  const PX = pts.map((p) => ({ x: padX + p.x * (w - padX * 2), y: padT + (1 - p.y) * (height - padT - padB) }));
  const line = w ? smooth(PX) : '';
  const area = w && PX.length ? `${line} L${PX[PX.length - 1].x},${height - padB} L${PX[0].x},${height - padB} Z` : '';
  const mk = marker != null && PX[marker] ? PX[marker] : null;
  const sc = scrub != null && PX[scrub] ? PX[scrub] : null;

  /* Recuo da área de toque em relação às bordas laterais.

     A curva sangra até a borda do card, e o card fica a 16px da borda da
     tela — ou seja, a ponta esquerda da curva cai DENTRO da faixa em que o
     sistema escuta o gesto de voltar (~20pt no iOS, e as duas bordas no
     Android). Começar um arrasto ali é começar em cima do reconhecedor
     nativo, e ele ganha: ele decide no toque, antes de qualquer código
     nosso rodar.

     A saída não é disputar essa faixa, é DEVOLVÊ-LA: um toque que nasce
     nela faz o nosso gesto desistir, e o do sistema segue o curso normal.
     No resto da curva, quem fica com o dedo somos nós.

     Nenhuma ponta se perde: uma vez ativo, o gesto acompanha o dedo até a
     extremidade, e o arredondamento abaixo entrega o primeiro e o último
     ponto igual. O que se perde é só a possibilidade de COMEÇAR o arrasto
     nos 22px de cada lado — e é exatamente onde não se deveria mesmo. */
  const MARGEM_GESTO = 22;

  /* Ponto mais próximo do dedo. Arredondar em vez de truncar faz a marca
     pular para o ponto vizinho na metade do caminho, que é o que a mão
     espera — truncando, ela só muda ao passar por cima do próximo. */
  const aponta = (x: number) => {
    if (!onScrub || pts.length < 2 || !w) return;
    const t = (x - padX) / Math.max(1, w - padX * 2);
    onScrub(Math.max(0, Math.min(pts.length - 1, Math.round(t * (pts.length - 1)))));
  };

  /* Gesture Handler, e não o responder do JS.

     O responder vivia perdendo: o ScrollView de cima roubava o dedo no meio
     do arrasto, e o gesto nativo de voltar — que no iOS nasce na borda
     esquerda, exatamente onde esta curva começa, porque ela sangra até a
     borda do card — reivindicava antes de qualquer código nosso rodar.

     O Pan do Gesture Handler disputa no mesmo nível dos reconhecedores
     nativos, em vez de reagir depois deles — e, com ativação manual, pode
     decidir no toque se entra na disputa ou sai dela.

     shouldCancelWhenOutside(false) mantém o dedo ligado à curva mesmo
     saindo do card, que é o que acontece quando a pessoa arrasta rápido
     até a ponta. */
  const pan = React.useMemo(
    () => Gesture.Pan()
      .enabled(!!onScrub)
      .runOnJS(true)
      /* Ativação manual para poder DESISTIR quando o toque nasce na faixa
         de borda. Desistindo, o reconhecedor nativo segue o curso dele e o
         gesto de voltar funciona normalmente ali; no resto da curva, quem
         fica com o dedo somos nós. É a diferença entre disputar a borda e
         devolvê-la. */
      .manualActivation(true)
      .shouldCancelWhenOutside(false)
      .onTouchesDown((e, estado) => {
        const x = e.allTouches[0]?.x ?? 0;
        if (w && (x < MARGEM_GESTO || x > w - MARGEM_GESTO)) estado.fail();
      })
      .onTouchesMove((_e, estado) => estado.activate())
      .onBegin((e) => aponta(e.x))
      .onUpdate((e) => aponta(e.x))
      .onFinalize(() => onScrub?.(null)),
    [onScrub, w, pts.length, padX],
  );

  const corpo = (
    <View
      onLayout={(e) => setW(Math.round(e.nativeEvent.layout.width))}
      style={{ height }}
    >
      {w > 0 && (
        <Svg width={w} height={height}>
          <Defs>
            <SvgGrad id={`${id}s`} x1="0" y1="0" x2="1" y2="0"><Stop offset="0" stopColor={sf} /><Stop offset="1" stopColor={st} /></SvgGrad>
            <SvgGrad id={`${id}f`} x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={sf} stopOpacity={fill} /><Stop offset="1" stopColor={sf} stopOpacity={0} /></SvgGrad>
          </Defs>
          <Path d={area} fill={`url(#${id}f)`} />
          {eixosEm?.map((i) => (PX[i] ? (
            <Line
              key={`e${i}`} x1={PX[i].x} y1={PX[i].y} x2={PX[i].x} y2={height - padB}
              stroke={st} strokeWidth={1} opacity={0.32}
            />
          ) : null))}
          <Path
            d={line} stroke={`url(#${id}s)`} strokeWidth={strokeW} fill="none"
            strokeLinecap="round" strokeLinejoin="round"
          />
          {/* Nó vazado, e não cheio: sobre uma curva grossa o ponto cheio
              vira um engrossamento do próprio traço e some. O miolo na cor
              do cartão é o que faz cada marcação existir como marcação. */}
          {nodes && PX.map((p, i) => (nosEm && !nosEm.includes(i) ? null : (
            <Circle key={i} cx={p.x} cy={p.y} r={3.6} fill={c.bg1} stroke={st} strokeWidth={2.2} />
          )))}
          {mk && dashed && <Line x1={mk.x} y1={mk.y} x2={mk.x} y2={height - padB} stroke={st} strokeWidth={1.4} strokeDasharray="3 4" opacity={0.5} />}
          {mk && <><Circle cx={mk.x} cy={mk.y} r={6.5} fill={c.bg1} /><Circle cx={mk.x} cy={mk.y} r={4.3} fill={st} /></>}

          {/* Marca do dedo — fio inteiro da borda de cima à de baixo, para
              ela ser encontrada mesmo com a mão cobrindo metade do card. */}
          {sc && (
            <>
              <Line x1={sc.x} y1={0} x2={sc.x} y2={height} stroke={c.tx} strokeWidth={1} opacity={0.28} />
              <Circle cx={sc.x} cy={sc.y} r={7} fill={c.bg1} />
              <Circle cx={sc.x} cy={sc.y} r={4.5} fill={c.tx} />
            </>
          )}
        </Svg>
      )}
    </View>
  );

  if (!onScrub) return corpo;
  return <GestureDetector gesture={pan}>{corpo}</GestureDetector>;
}

/* Anel de progresso com gradiente verde→azul. */
export function Ring({ size = 120, stroke = 12, pct, color, track, id = 'r', children }: {
  size?: number; stroke?: number; pct: number; color?: string; track?: string; id?: string; children?: React.ReactNode;
}) {
  const { c } = useTheme();
  const r = (size - stroke) / 2, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r;
  const dash = circ * Math.max(0, Math.min(1, pct / 100));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Defs><SvgGrad id={`${id}g`} x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor={c.gradFrom} /><Stop offset="1" stopColor={c.gradTo} /></SvgGrad></Defs>
        <Circle cx={cx} cy={cy} r={r} stroke={track ?? c.track} strokeWidth={stroke} fill="none" />
        <Circle cx={cx} cy={cy} r={r} stroke={color ?? `url(#${id}g)`} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} />
      </Svg>
      {children}
    </View>
  );
}

/* Mini barras (ex.: água por dia da semana). vals 0..1. */
export function MiniBars({ vals, height = 60, color, lowColor, lowIndex, gap = 6 }: {
  vals: number[]; height?: number; color?: string; lowColor?: string; lowIndex?: number; gap?: number;
}) {
  const { c } = useTheme();
  const [w, setW] = useState(0);
  const n = vals.length;
  const bw = n ? (w - gap * (n - 1)) / n : 0;
  return (
    <View onLayout={(e) => setW(Math.round(e.nativeEvent.layout.width))} style={{ height }}>
      {w > 0 && (
        <Svg width={w} height={height}>
          {vals.map((v, i) => {
            const h = Math.max(3, v * (height - 4));
            const x = i * (bw + gap);
            const fill = lowIndex === i ? (lowColor ?? c.cta) : (color ?? c.accent);
            return <Path key={i} d={`M${x},${height} h${bw} v${-h} h${-bw} Z`} fill={fill} opacity={lowIndex === i ? 1 : 0.85} />;
          })}
        </Svg>
      )}
    </View>
  );
}

/* ============================================================
   BARRAS — uma série curta, sem eixo nem grade

   O mínimo que um gráfico pode ser e ainda informar: uma barra por dia,
   altura proporcional, sem números soltos, sem linha de base, sem
   legenda. Existe para mostrar oscilação — a média já está dita em
   texto, e o que o texto não consegue dizer é o formato dela.

   A barra mais recente vem em lima e as outras em cinza: o olho precisa
   de um ponto de entrada, e o ponto de entrada é sempre "e hoje?".
   ============================================================ */
export function Barras({
  data, height = 56, largura = 9, gap = 6, destaque = true,
}: {
  data: { t: number; v: number }[];
  height?: number; largura?: number; gap?: number; destaque?: boolean;
}) {
  const { c } = useTheme();
  if (!data.length) return null;
  /* piso de 4 px: barra de valor zero sumiria, e sumir é dizer que não
     houve registro — que é diferente de ter registrado zero */
  const alt = (v: number) => Math.max(4, (v / 100) * height);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height, gap }}>
      {data.map((d, i) => {
        const ultima = i === data.length - 1;
        return (
          <View
            key={d.t}
            style={{
              width: largura,
              height: alt(d.v),
              borderRadius: largura / 2,
              backgroundColor: destaque && ultima ? c.lime : 'rgba(255,255,255,0.28)',
            }}
          />
        );
      })}
    </View>
  );
}
