import React from 'react';
import { View, StyleSheet } from 'react-native';
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

/* ============================================================
   MALHA — o degradê que não é rampa

   As referências de blob são imagens exportadas de ferramenta de mesh
   gradient. Aqui a malha é desenhada: quatro elipses radiais com queda
   até zero, sobrepostas em posições e tamanhos diferentes. Onde duas se
   encontram a cor soma e nasce um tom que não está em nenhuma delas —
   é isso que dá o aspecto de pintura em vez de rampa, e é o que um
   LinearGradient nunca produz por mais paradas que tenha.

   Desenhada e não importada por três razões: escala sem perder nitidez,
   acompanha o tema (a mesma malha em modo escuro pega as cores certas),
   e não pesa no bundle — as três blobs de referência somariam alguns
   megabytes.

   `forca` regula a saturação toda de uma vez, porque a legibilidade do
   texto por cima depende dela: o mesmo desenho a 0,5 é fundo de card
   claro, a 1,0 é superfície de destaque.
   ============================================================ */
export function Malha({ forca = 1, id, escura = false }: { forca?: number; id: string; escura?: boolean }) {
  const { c } = useTheme();

  /* Duas famílias para o mesmo desenho.

     Na clara, as blobs ficam concentradas à direita e a metade esquerda
     continua quase branca, porque o texto é escuro e mora lá.

     Na escura, elas se espalham e sobem a saturação: o texto é branco e
     lê sobre qualquer ponto, então a malha pode ocupar o card inteiro. É
     essa que dá vida à tela — cor tímida atrás de texto escuro vira
     papel de parede, e papel de parede não é o que a aba precisava. */
  /* Só as cores da marca.

     A primeira versão usava purple e teal como protagonistas da malha —
     e a regra escrita em principios.md é que as cores de dado devem
     ENCOLHER, não crescer. Eu as fiz crescer, e o resultado era bonito e
     de outra marca: quatro cores numa superfície é paleta de wallpaper,
     não identidade.

     Agora a malha é a rampa do azul (accent2 → accent) com um único
     ponto de lima, pequeno e no canto. Duas cores com papéis, que é o
     que o Forma tem — e a variação de tom vem da SOBREPOSIÇÃO, não de
     acrescentar matiz. */
  const blobs = escura
    ? [
      { k: 'a', cor: c.accent, cx: 0.22, cy: 0.26, r: 0.74, o: 0.95 },
      { k: 'b', cor: c.accent2, cx: 0.86, cy: 0.16, r: 0.66, o: 0.92 },
      { k: 'c', cor: c.accent, cx: 0.86, cy: 0.94, r: 0.60, o: 0.7 },
      { k: 'd', cor: c.lime, cx: 0.06, cy: 1.02, r: 0.34, o: 0.3 },
    ]
    : [
      { k: 'a', cor: c.accent2, cx: 0.84, cy: 0.36, r: 0.58, o: 0.82 },
      { k: 'b', cor: c.accent, cx: 1.02, cy: 0.66, r: 0.52, o: 0.72 },
      { k: 'c', cor: c.accent, cx: 0.66, cy: 0.06, r: 0.44, o: 0.4 },
      { k: 'd', cor: c.lime, cx: 0.98, cy: 1.0, r: 0.3, o: 0.22 },
    ];
  /* Coordenadas em 0–100 e preserveAspectRatio="none": a malha se estica
     para o tamanho do pai sem precisar medi-lo. A primeira versão usava
     useWindowDimensions e desenhava com largura negativa no primeiro
     quadro, porque a medida ainda não existia. Blob é forma orgânica —
     esticar não a deforma de um jeito que se perceba. */
  return (
    <Svg
      width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
      style={StyleSheet.absoluteFillObject} pointerEvents="none"
    >
      <Defs>
        {blobs.map((b) => (
          <RadialGradient key={b.k} id={`${id}${b.k}`} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={b.cor} stopOpacity={b.o * forca} />
            <Stop offset="0.45" stopColor={b.cor} stopOpacity={b.o * forca * 0.55} />
            <Stop offset="0.75" stopColor={b.cor} stopOpacity={b.o * forca * 0.16} />
            <Stop offset="1" stopColor={b.cor} stopOpacity={0} />
          </RadialGradient>
        ))}
      </Defs>
      {blobs.map((b) => (
        <Ellipse
          key={b.k}
          cx={b.cx * 100} cy={b.cy * 100}
          rx={b.r * 125} ry={b.r * 135}
          fill={`url(#${id}${b.k})`}
        />
      ))}
    </Svg>
  );
}

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
  pct, traços = 28, altura = 30, cor, sobreEscuro = false, faixa, escala,
}: {
  /** 0..1 */
  pct: number;
  traços?: number; altura?: number; cor?: string; sobreEscuro?: boolean;
  /** zona destacada da régua, em 0..1 — a "faixa boa" */
  faixa?: [number, number];
  /** duas cores: os traços passam de uma à outra ao longo da régua. Serve
      quando a escala TEM direção — começo do ciclo até o fim dele, valor
      dentro e fora da referência. Sem isso a régua é neutra, e neutra é o
      certo quando os extremos não significam melhor nem pior. */
  escala?: [string, string];
}) {
  const { c } = useTheme();
  const marca = Math.max(0, Math.min(1, pct));
  const acento = cor ?? c.lime;
  const base = sobreEscuro ? 'rgba(255,255,255,0.28)' : c.line;
  const dentro = sobreEscuro ? 'rgba(255,255,255,0.55)' : c.accentLine;

  /* interpolação em hex, sem lib: a régua tem 28 traços e cada um precisa
     de uma cor própria para a passagem ser contínua */
  const mistura = (a: string, b: string, t: number) => {
    const n = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
    const [r1, g1, b1] = n(a), [r2, g2, b2] = n(b);
    const m = (x: number, y: number) => Math.round(x + (y - x) * t);
    return `rgb(${m(r1, r2)},${m(g1, g2)},${m(b1, b2)})`;
  };

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
          const tom = escala
            ? mistura(escala[0], escala[1], t)
            : naFaixa ? dentro : base;
          return (
            <View
              key={i}
              style={{
                flex: 1,
                height: perto ? altura : naFaixa ? altura * 0.6 : altura * 0.38,
                borderRadius: 1,
                backgroundColor: perto ? acento : tom,
                /* só o traço do marcador acende — fulgor em todos seria
                   ruído, e o ponto do instrumento é dizer qual é o "aqui" */
                ...(perto ? {
                  shadowColor: acento, shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.9, shadowRadius: 8, elevation: 4,
                } : null),
                opacity: escala && !perto ? (t <= marca ? 1 : 0.35) : 1,
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
  total, cheios, parcial = 0, de, para, sobreEscuro = false, altura = 26,
}: {
  total: number; cheios: number;
  /** 0..1 — preenchimento do próximo glifo, para meia dose / meio copo */
  parcial?: number;
  /** o glifo é preenchido por degradê, não por cor chapada */
  de?: string; para?: string;
  sobreEscuro?: boolean; altura?: number;
}) {
  const { c } = useTheme();
  const topo = de ?? c.lime;
  const base = para ?? c.teal;
  const vazio = sobreEscuro ? 'rgba(255,255,255,0.26)' : c.line;

  return (
    <Row gap={8} style={{ height: altura }}>
      {Array.from({ length: total }, (_, i) => {
        const cheio = i < cheios;
        const meio = i === cheios && parcial > 0;

        if (!cheio && !meio) {
          /* vazio em contorno, não em cinza sólido: dose gasta não é dose
             apagada, é dose ausente — e ausência se desenha com o vazio */
          return (
            <View
              key={i}
              style={{
                flex: 1, height: altura, borderRadius: altura / 2.6,
                borderWidth: 1.5, borderColor: vazio,
              }}
            />
          );
        }

        return (
          <View
            key={i}
            style={{
              flex: 1, height: altura, borderRadius: altura / 2.6,
              /* a sombra colorida é o fulgor: o glifo não é pintado de
                 lima, ele EMITE lima. É o que separa um bloco de cor de
                 uma coisa acesa, e é barato — sombra, não mais uma camada */
              shadowColor: topo,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.75,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <View style={{ flex: 1, borderRadius: altura / 2.6, overflow: 'hidden', justifyContent: 'flex-end' }}>
              <View style={{ height: meio ? `${parcial * 100}%` : '100%' }}>
                {/* Sem reflexo interno.

                    A primeira versão tinha um brilho branco no alto para
                    "dar volume de cápsula". Era gloss esqueumórfico — o
                    botão lustroso de 2008 — e não existe em nenhuma peça da
                    Ron: lá a luz vem da cor emitindo para fora, nunca de um
                    highlight especular fingindo vidro por dentro.

                    Volume aqui é o degradê mais o fulgor. Se a forma
                    precisar de reflexo para parecer um objeto, o problema é
                    a forma. */}
                <SvgGradFill de={topo} para={base} />
              </View>
            </View>
          </View>
        );
      })}
    </Row>
  );
}

/** Preenchimento em degradê vertical, isolado para o Glifos não precisar
    importar expo-linear-gradient em cada uso. */
function SvgGradFill({ de, para }: { de: string; para: string }) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 10 30" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 } as any}>
      <Defs>
        <SvgGrad id={`gf${de.replace('#', '')}${para.replace('#', '')}`} x1="0" y1="0" x2="0.35" y2="1">
          <Stop offset="0" stopColor={de} />
          <Stop offset="1" stopColor={para} />
        </SvgGrad>
      </Defs>
      <Path d="M0,0 H10 V30 H0 Z" fill={`url(#gf${de.replace('#', '')}${para.replace('#', '')})`} />
    </Svg>
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
