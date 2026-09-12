import React, { useState } from 'react';
import { View } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgGrad, Stop, Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';
import { Txt } from './kit';
import { useTheme } from './useTheme';

type Pt = { x: number; y: number };
function smooth(P: Pt[]) {
  if (P.length < 2) return '';
  let d = `M${P[0].x},${P[0].y}`;
  for (let i = 1; i < P.length; i++) { const mx = (P[i - 1].x + P[i].x) / 2, my = (P[i - 1].y + P[i].y) / 2; d += ` Q${P[i - 1].x},${P[i - 1].y} ${mx},${my}`; }
  d += ` L${P[P.length - 1].x},${P[P.length - 1].y}`;
  return d;
}

/* Curva de área suave. pts em coords normalizadas (x,y ∈ 0..1, y=1 no topo). */
export function AreaCurve({
  pts, height = 150, width, marker, dashed = true, strokeFrom, strokeTo,
  padT = 18, padB = 24, padX = 8, strokeW = 2.6, id = 'c', nodes = false,
  onScrub, scrub,
}: {
  pts: Pt[]; height?: number; /** largura conhecida — evita esperar o onLayout */ width?: number;
  marker?: number | null; dashed?: boolean;
  strokeFrom?: string; strokeTo?: string; padT?: number; padB?: number; padX?: number; strokeW?: number; id?: string; nodes?: boolean;
  /* Deslizar o dedo pela curva devolve o índice do ponto mais próximo, e
     null ao soltar. Quem passa isto assume a leitura: a curva sozinha não
     sabe o que cada ponto significa. */
  onScrub?: (i: number | null) => void;
  /** índice destacado — controlado por fora, para o card poder reagir junto */
  scrub?: number | null;
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

  /* Ponto mais próximo do dedo. Arredondar em vez de truncar faz a marca
     pular para o ponto vizinho na metade do caminho, que é o que a mão
     espera — truncando, ela só muda ao passar por cima do próximo. */
  const aponta = (x: number) => {
    if (!onScrub || pts.length < 2 || !w) return;
    const t = (x - padX) / Math.max(1, w - padX * 2);
    onScrub(Math.max(0, Math.min(pts.length - 1, Math.round(t * (pts.length - 1)))));
  };

  return (
    <View
      onLayout={(e) => setW(Math.round(e.nativeEvent.layout.width))}
      style={{ height }}
      onStartShouldSetResponder={() => !!onScrub}
      onMoveShouldSetResponder={() => !!onScrub}
      onResponderGrant={(e) => aponta(e.nativeEvent.locationX)}
      onResponderMove={(e) => aponta(e.nativeEvent.locationX)}
      onResponderRelease={() => onScrub?.(null)}
      onResponderTerminate={() => onScrub?.(null)}
    >
      {w > 0 && (
        <Svg width={w} height={height}>
          <Defs>
            <SvgGrad id={`${id}s`} x1="0" y1="0" x2="1" y2="0"><Stop offset="0" stopColor={sf} /><Stop offset="1" stopColor={st} /></SvgGrad>
            <SvgGrad id={`${id}f`} x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={sf} stopOpacity={0.17} /><Stop offset="1" stopColor={sf} stopOpacity={0} /></SvgGrad>
          </Defs>
          <Path d={area} fill={`url(#${id}f)`} />
          <Path d={line} stroke={`url(#${id}s)`} strokeWidth={strokeW} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {nodes && PX.map((p, i) => <Circle key={i} cx={p.x} cy={p.y} r={3.2} fill={c.bg1} stroke={st} strokeWidth={2} />)}
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

/* Radar 0..100 — equilíbrio dos check-ins (8 eixos). */
export function Radar({ data, size = 250 }: { data: { k: string; v: number }[]; size?: number }) {
  const { c } = useTheme();
  const cx = size / 2, cy = size / 2, R = size / 2 - 44;
  const n = data.length;
  const pt = (i: number, r: number): [number, number] => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const ringPts = (f: number) => data.map((_, i) => pt(i, R * f).join(',')).join(' ');
  const poly = data.map((d, i) => pt(i, R * Math.max(0.06, Math.min(1, d.v / 100))).join(',')).join(' ');
  return (
    <Svg width={size} height={size}>
      <Defs>
        <SvgGrad id="radg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={c.gradFrom} /><Stop offset="1" stopColor={c.gradTo} />
        </SvgGrad>
      </Defs>
      {[0.33, 0.66, 1].map((f) => <Polygon key={f} points={ringPts(f)} stroke={c.line2} strokeWidth={1} fill="none" />)}
      {data.map((_, i) => { const [x, y] = pt(i, R); return <Line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={c.line} strokeWidth={1} />; })}
      <Polygon points={poly} fill={c.accent + '2A'} stroke="url(#radg)" strokeWidth={2} strokeLinejoin="round" />
      {data.map((d, i) => { const [x, y] = pt(i, R * Math.max(0.06, Math.min(1, d.v / 100))); return <Circle key={i} cx={x} cy={y} r={3} fill={c.bg1} stroke={c.accent2} strokeWidth={1.8} />; })}
      {data.map((d, i) => {
        const [x, y] = pt(i, R + 16);
        return <SvgText key={i} x={x} y={y + 3.5} fontSize={10.5} fill={c.tx3} textAnchor="middle">{d.k}</SvgText>;
      })}
    </Svg>
  );
}

/* ============================================================
   PÉTALAS — o equilíbrio como oito setores

   Substituiu o radar. Radar desenha um polígono e pede que a pessoa
   julgue a forma dele: quanto mais irregular, pior — mas ninguém sabe
   qual polígono é bom, e um eixo baixo some no meio do contorno. Aqui
   cada indicador tem uma pétala própria: o trilho mostra o que caberia,
   o preenchimento mostra o que há, e a comparação é entre vizinhos, que
   é uma leitura que o olho faz sozinho.

   O eixo mais fraco vem em lima — o mesmo que a leitura escrita logo
   acima aponta como foco da semana. Sem isso o gráfico ilustraria o
   texto por coincidência; com isso, ele aponta para a mesma coisa.
   ============================================================ */
export function Petalas({ data, size = 288, fraco }: { data: { k: string; v: number }[]; size?: number; fraco?: string }) {
  const { c } = useTheme();
  const R = size / 2;
  const meio = R;
  const buraco = R * 0.12;
  const trilhoAte = R * 0.97;
  /* o preenchimento para antes do rótulo: número coberto por pétala é
     dado escondido pelo próprio gráfico */
  const valorAte = R * 0.57;
  const n = data.length;
  const passo = 360 / n;
  const folga = 2.6;          // graus de respiro entre pétalas
  const arredondar = 7;       // vira strokeWidth: o traço arredonda os cantos

  const ponto = (ang: number, r: number) => {
    const rad = ((ang - 90) * Math.PI) / 180;
    return [meio + Math.cos(rad) * r, meio + Math.sin(rad) * r];
  };
  /* setor anular entre dois raios. O contorno com linejoin redondo é o que
     dá o canto arredondado sem precisar calcular arcos de canto — por isso
     os raios entram encolhidos pela metade da espessura. */
  const setor = (a0: number, a1: number, r0: number, r1: number) => {
    const i = arredondar / 2;
    const [x0, y0] = ponto(a0, r0 + i), [x1, y1] = ponto(a1, r0 + i);
    const [x2, y2] = ponto(a1, r1 - i), [x3, y3] = ponto(a0, r1 - i);
    return `M${x0},${y0} A${r0 + i},${r0 + i} 0 0 1 ${x1},${y1} L${x2},${y2} A${r1 - i},${r1 - i} 0 0 0 ${x3},${y3} Z`;
  };

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <SvgGrad id="petala" x1="0" y1="0" x2="0.4" y2="1">
            <Stop offset="0" stopColor={c.panelFrom} />
            <Stop offset="1" stopColor={c.accent2} />
          </SvgGrad>
        </Defs>

        {data.map((d, i) => {
          const a0 = i * passo - passo / 2 + folga / 2;
          const a1 = i * passo + passo / 2 - folga / 2;
          const pct = Math.max(0, Math.min(100, d.v)) / 100;
          const alvo = buraco + (valorAte - buraco) * pct;
          const ehFraco = d.k === fraco;
          return (
            <React.Fragment key={d.k}>
              <Path
                d={setor(a0, a1, buraco, trilhoAte)}
                fill={c.bg2} stroke={c.bg2}
                strokeWidth={arredondar} strokeLinejoin="round"
              />
              {pct > 0.04 && (
                <Path
                  d={setor(a0, a1, buraco, alvo)}
                  fill={ehFraco ? c.lime : 'url(#petala)'}
                  stroke={ehFraco ? c.lime : c.accent2}
                  strokeWidth={arredondar} strokeLinejoin="round"
                />
              )}
            </React.Fragment>
          );
        })}
      </Svg>

      {/* rótulos em View e não em <Text> do SVG: assim herdam a Outfit e a
          escala tipográfica do app, em vez de virarem uma segunda régua */}
      {data.map((d, i) => {
        /* 0,73 e não 0,79: nos setores da esquerda e da direita o rótulo sai
           na horizontal pura, e a caixa de 70 px vazava a borda do desenho */
        const [x, y] = ponto(i * passo, R * 0.73);
        const ehFraco = d.k === fraco;
        return (
          <View key={d.k} pointerEvents="none" style={{ position: 'absolute', left: x - 35, top: y - 19, width: 70, alignItems: 'center' }}>
            <Txt v="bodyMed" c={ehFraco ? c.limeInk : c.tx} style={{ fontSize: 17 }}>{Math.round(d.v)}</Txt>
            <Txt v="micro" c={ehFraco ? c.limeInk : c.tx3} numberOfLines={1}>{d.k}</Txt>
          </View>
        );
      })}
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
