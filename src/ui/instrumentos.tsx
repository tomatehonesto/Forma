import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient as SvgGrad, Path, RadialGradient, Stop } from 'react-native-svg';
import { Txt, Row } from './kit';
import { useTheme } from './useTheme';

/* ============================================================
   INSTRUMENTOS — o vocabulário de forma do Forma

   A gramática padrão de um app de saúde é card, título, texto, lista.
   Ela informa e não comunica: quatro números iguais em quatro caixas
   iguais fazem o olho tratar tudo como a mesma coisa, e a tela vira
   prontuário.

   Este arquivo guarda o oposto: peças em que a FORMA carrega o dado.
   Um marcador triangular numa régua diz "você está aqui" antes de
   qualquer rótulo; cinco copos com três cheios dizem o estoque sem
   precisar da palavra "três". Nenhuma delas é enfeite — todas param de
   funcionar se o dado mudar, que é o teste que separa instrumento de
   decoração.

   Regra de uso: se o dado couber num número e o número bastar, use
   texto. Estas peças existem para quando a comparação, a posição numa
   escala ou a passagem do tempo é o que importa — e nenhum número
   sozinho mostra isso.
   ============================================================ */

/* ------------------------------------------------------------------ *
 * MEDIDOR — posição numa faixa
 *
 * Régua de traços finos com um marcador triangular. Serve para valor
 * dentro de um intervalo: dose no ciclo, exame na faixa de referência,
 * proteína contra a meta. O triângulo é lido como "aqui" sem precisar
 * de legenda, e a densidade dos traços dá a sensação de escala contínua
 * que uma barra de progresso não dá.
 * ------------------------------------------------------------------ */
export function Medidor({
  pct, traços = 28, altura = 30, cor, sobreEscuro = false, faixa,
}: {
  /** 0..1 */
  pct: number;
  traços?: number; altura?: number; cor?: string; sobreEscuro?: boolean;
  /** zona destacada da régua, em 0..1 — a "faixa boa" */
  faixa?: [number, number];
}) {
  const { c } = useTheme();
  const marca = Math.max(0, Math.min(1, pct));
  const acento = cor ?? c.lime;
  const base = sobreEscuro ? 'rgba(255,255,255,0.28)' : c.line;
  const dentro = sobreEscuro ? 'rgba(255,255,255,0.55)' : c.accentLine;

  return (
    <View style={{ height: altura + 14 }}>
      {/* marcador acima da régua: sobreposto aos traços ele os apagaria
          justamente no ponto que precisa ser lido */}
      <View style={{ height: 10, justifyContent: 'flex-end' }}>
        <View style={{ position: 'absolute', left: `${marca * 100}%`, marginLeft: -5 }}>
          <Svg width={10} height={8}>
            <Path d="M5,8 L0,0 L10,0 Z" fill={acento} />
          </Svg>
        </View>
      </View>
      <Row gap={2} style={{ alignItems: 'flex-end', height: altura, marginTop: 4 }}>
        {Array.from({ length: traços }, (_, i) => {
          const t = i / (traços - 1);
          const naFaixa = faixa ? t >= faixa[0] && t <= faixa[1] : false;
          /* o traço sob o marcador cresce: o instrumento aponta duas
             vezes para o mesmo lugar, de cima e de baixo */
          const perto = Math.abs(t - marca) < 0.5 / traços;
          return (
            <View
              key={i}
              style={{
                flex: 1,
                height: perto ? altura : naFaixa ? altura * 0.6 : altura * 0.38,
                borderRadius: 1,
                backgroundColor: perto ? acento : naFaixa ? dentro : base,
              }}
            />
          );
        })}
      </Row>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * GLIFOS — quantidade contável
 *
 * Uma forma por unidade, cheias à esquerda e vazias à direita. Só vale
 * quando a unidade é discreta e pequena (doses na caneta, copos de
 * água, aplicações na semana): "3 de 4" vira uma imagem que se lê sem
 * contar, e a que falta fica visível como ausência.
 *
 * Acima de ~8 unidades o olho volta a precisar contar, e aí uma barra
 * comum informa melhor.
 * ------------------------------------------------------------------ */
export function Glifos({
  total, cheios, parcial = 0, cor, sobreEscuro = false, altura = 26,
}: {
  total: number; cheios: number;
  /** 0..1 — preenchimento do próximo glifo, para meia dose / meio copo */
  parcial?: number;
  cor?: string; sobreEscuro?: boolean; altura?: number;
}) {
  const { c } = useTheme();
  const acento = cor ?? c.accent;
  const vazio = sobreEscuro ? 'rgba(255,255,255,0.30)' : c.line;

  return (
    <Row gap={6} style={{ height: altura }}>
      {Array.from({ length: total }, (_, i) => {
        const cheio = i < cheios;
        const meio = i === cheios && parcial > 0;
        return (
          <View
            key={i}
            style={{
              flex: 1, height: altura, borderRadius: 5,
              borderWidth: cheio ? 0 : 1.5,
              borderColor: vazio,
              backgroundColor: cheio ? acento : 'transparent',
              overflow: 'hidden',
              justifyContent: 'flex-end',
            }}
          >
            {meio && <View style={{ height: `${parcial * 100}%`, backgroundColor: acento }} />}
          </View>
        );
      })}
    </Row>
  );
}

/* ------------------------------------------------------------------ *
 * FULGOR — luz atrás do número
 *
 * Um clarão radial posicionado atrás de um valor. Não informa nada
 * sozinho, e é o único elemento aqui que existe por ênfase: marca QUAL
 * número da tela é o principal, num lugar onde tamanho de fonte já
 * chegou ao limite. Usar no máximo uma vez por tela — dois fulgores é
 * nenhum.
 * ------------------------------------------------------------------ */
export function Fulgor({
  cor, size = 200, opacidade = 0.5, style,
}: { cor?: string; size?: number; opacidade?: number; style?: any }) {
  const { c } = useTheme();
  const tom = cor ?? c.accent;
  return (
    <Svg width={size} height={size * 0.7} style={[{ position: 'absolute' }, style]} pointerEvents="none">
      <Defs>
        <RadialGradient id={`fulgor${tom.replace('#', '')}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={tom} stopOpacity={opacidade} />
          <Stop offset="0.45" stopColor={tom} stopOpacity={opacidade * 0.4} />
          <Stop offset="1" stopColor={tom} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={size / 2} cy={size * 0.35} rx={size / 2} ry={size * 0.35} fill={`url(#fulgor${tom.replace('#', '')})`} />
    </Svg>
  );
}

/* ------------------------------------------------------------------ *
 * CURVA VIVA — série com fim luminoso
 *
 * Curva suave com traço em degradê e um ponto aceso na ponta. A ponta
 * é o argumento: ela diz "aqui é agora" e transforma um gráfico de
 * histórico numa coisa que ainda está acontecendo. Sem eixo e sem
 * grade — quando o formato da linha é a informação, número em eixo só
 * divide a atenção.
 * ------------------------------------------------------------------ */
export function CurvaViva({
  data, width, height = 120, de, para, sobreEscuro = false,
}: {
  data: number[]; width: number; height?: number;
  /** cores do traço, do começo ao fim */
  de?: string; para?: string; sobreEscuro?: boolean;
}) {
  const { c } = useTheme();
  if (data.length < 2) return null;
  const inicio = de ?? c.accent;
  const fim = para ?? c.lime;

  const min = Math.min(...data), max = Math.max(...data);
  const faixa = max - min || 1;
  const pad = 14;
  const px = (i: number) => (i / (data.length - 1)) * width;
  const py = (v: number) => pad + (1 - (v - min) / faixa) * (height - pad * 2);

  /* curva por pontos médios: passa perto dos valores sem os picos duros
     de uma polilinha, e sem inventar oscilação que o dado não tem */
  let d = `M${px(0)},${py(data[0])}`;
  for (let i = 1; i < data.length; i++) {
    const mx = (px(i - 1) + px(i)) / 2, my = (py(data[i - 1]) + py(data[i])) / 2;
    d += ` Q${px(i - 1)},${py(data[i - 1])} ${mx},${my}`;
  }
  d += ` L${px(data.length - 1)},${py(data[data.length - 1])}`;

  const fx = px(data.length - 1), fy = py(data[data.length - 1]);

  return (
    <Svg width={width} height={height}>
      <Defs>
        <SvgGrad id="curvaTraco" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={inicio} stopOpacity={sobreEscuro ? 0.35 : 0.25} />
          <Stop offset="0.6" stopColor={inicio} stopOpacity={0.9} />
          <Stop offset="1" stopColor={fim} stopOpacity={1} />
        </SvgGrad>
        <RadialGradient id="curvaPonta" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={fim} stopOpacity={0.55} />
          <Stop offset="1" stopColor={fim} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      {/* halo da ponta, desenhado antes para ficar por baixo */}
      <Circle cx={fx} cy={fy} r={22} fill="url(#curvaPonta)" />
      <Path d={d} stroke="url(#curvaTraco)" strokeWidth={3} fill="none" strokeLinecap="round" />
      <Circle cx={fx} cy={fy} r={5.5} fill={fim} />
      <Circle cx={fx} cy={fy} r={9} fill="none" stroke={fim} strokeOpacity={0.35} strokeWidth={1.5} />
    </Svg>
  );
}

/* ------------------------------------------------------------------ *
 * SEGMENTADO — troca de recorte
 *
 * Pílula com opções curtas (D · S · M). Existe para alternar a janela
 * de tempo de um mesmo dado sem trocar de tela. Só usar quando as
 * opções forem realmente o mesmo dado em outro recorte — se levam a
 * conteúdos diferentes, são abas, não segmentos.
 * ------------------------------------------------------------------ */
export function Segmentado({
  opcoes, valor, onChange, sobreEscuro = false,
}: {
  opcoes: string[]; valor: string; onChange: (v: string) => void; sobreEscuro?: boolean;
}) {
  const { c } = useTheme();
  const fundo = sobreEscuro ? 'rgba(255,255,255,0.14)' : c.bg2;
  const ativo = sobreEscuro ? 'rgba(255,255,255,0.92)' : c.tx;
  const tinta = sobreEscuro ? c.onHero2 : c.tx3;

  return (
    <Row gap={2} style={{ backgroundColor: fundo, borderRadius: 999, padding: 3 }}>
      {opcoes.map((o) => {
        const on = o === valor;
        return (
          <View
            key={o}
            onTouchEnd={() => onChange(o)}
            style={{
              paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
              backgroundColor: on ? ativo : 'transparent',
            }}
          >
            <Txt v="micro" c={on ? (sobreEscuro ? c.tx : c.bg1) : tinta}>{o}</Txt>
          </View>
        );
      })}
    </Row>
  );
}
