import React, { useState } from 'react';
import { View } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgGrad, Stop, Circle, Line } from 'react-native-svg';
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
  pts, height = 150, marker, dashed = true, strokeFrom, strokeTo,
  padT = 18, padB = 24, padX = 8, strokeW = 2.6, id = 'c', nodes = false,
}: {
  pts: Pt[]; height?: number; marker?: number | null; dashed?: boolean;
  strokeFrom?: string; strokeTo?: string; padT?: number; padB?: number; padX?: number; strokeW?: number; id?: string; nodes?: boolean;
}) {
  const { c } = useTheme();
  const [w, setW] = useState(0);
  const sf = strokeFrom ?? c.gradFrom, st = strokeTo ?? c.gradTo;
  const PX = pts.map((p) => ({ x: padX + p.x * (w - padX * 2), y: padT + (1 - p.y) * (height - padT - padB) }));
  const line = w ? smooth(PX) : '';
  const area = w && PX.length ? `${line} L${PX[PX.length - 1].x},${height - padB} L${PX[0].x},${height - padB} Z` : '';
  const mk = marker != null && PX[marker] ? PX[marker] : null;
  return (
    <View onLayout={(e) => setW(Math.round(e.nativeEvent.layout.width))} style={{ height }}>
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
