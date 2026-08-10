import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Ellipse, LinearGradient as SvgGrad, Path, RadialGradient, Stop } from 'react-native-svg';
import { Txt, Row } from './kit';
import { useTheme } from './useTheme';
import type { Palette } from '../theme';

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
  /* O lima cresceu, e isso é uma decisão de identidade, não de gosto.

     A Jornada usa a mesma família de azul num LinearGradient. Duas
     superfícies escuras azuis em duas abas vizinhas liam como a mesma
     coisa, e a malha perdia o motivo de existir. O que separa as duas não
     pode ser a estrutura (blob vs. rampa) — isso o olho não isola —, tem
     que ser cor.

     Então o lima deixa de ser um ponto no canto e vira duas manchas de
     verdade, embaixo à esquerda e subindo pela direita. Onde ele cruza o
     azul nasce um verde-água que não está em nenhuma das duas: é
     exatamente o que a malha faz de melhor, e é a assinatura de Cuidado.

     Não vira terceira cor da marca: continua sendo o mesmo lima do
     veredito, aqui em opacidade baixa e sob outra cor. Pigmento diluído
     não é matiz nova. */
  const blobs = escura
    ? [
      { k: 'a', cor: c.accent, cx: 0.24, cy: 0.20, r: 0.72, o: 0.95 },
      { k: 'b', cor: c.accent2, cx: 0.88, cy: 0.10, r: 0.62, o: 0.92 },
      { k: 'c', cor: c.lime, cx: 0.04, cy: 0.86, r: 0.46, o: 0.5 },
      { k: 'd', cor: c.lime, cx: 0.92, cy: 1.04, r: 0.40, o: 0.42 },
      { k: 'e', cor: c.accent, cx: 0.62, cy: 0.62, r: 0.50, o: 0.55 },
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
                /* só o traço do marcador acende, e só sobre escuro —
                   fulgor em todos seria ruído, e sobre branco não há
                   escuro para a luz preencher */
                ...(perto && sobreEscuro ? {
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
              /* A sombra colorida é o fulgor: o glifo não é pintado, ele
                 EMITE. Mas só sobre escuro — sobre branco a mesma sombra
                 vira uma auréola suja em volta de cada cápsula, porque não
                 há escuro para a luz preencher. Emissão precisa de
                 ausência de luz atrás; sem isso, é sujeira. */
              ...(sobreEscuro ? {
                shadowColor: topo,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.75,
                shadowRadius: 12,
                elevation: 6,
              } : null),
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
 * NÍVEL — quantidade em traços finos
 *
 * A mesma informação do Glifos numa gramática mais discreta: cada
 * unidade vira um traço vertical fino em vez de uma cápsula cheia. A
 * cápsula tem corpo e por isso pesa — quatro delas lado a lado viram o
 * assunto do card. O traço pesa quase nada e continua contável, o que é
 * o que se quer quando o dado é verdadeiro mas secundário.
 *
 * O gasto não some: ele encolhe. Um traço curto e apagado no lugar de
 * um alto e aceso diz "aqui já foi" melhor do que um vazio, porque a
 * altura vira uma leitura de nível — como um medidor caindo.
 * ------------------------------------------------------------------ */
export function Nivel({
  total, cheios, de, para, sobreEscuro = false, altura = 9,
}: {
  total: number; cheios: number;
  de?: string; para?: string; sobreEscuro?: boolean;
  /** espessura do traço — é a medida toda do instrumento, já que ele é
      deitado. 9 px é grosso o bastante para o degradê aparecer e fino o
      bastante para não virar barra de progresso. */
  altura?: number;
}) {
  const { c } = useTheme();
  const topo = de ?? c.accent;
  const base = para ?? c.accent2;
  const apagado = sobreEscuro ? 'rgba(255,255,255,0.22)' : c.line;

  /* Um traço por unidade, deitado, todos do mesmo tamanho.

     A versão anterior fazia grupos de três em escadinha, para dar
     "textura". Era invenção: a escadinha sugeria que uma dose vale mais
     que a outra, e não vale — quatro doses são quatro iguais. Toda vez
     que a forma insinua uma diferença que o dado não tem, ela mente.

     Deitado e não em pé porque a leitura é de SEQUÊNCIA, não de altura:
     as doses se gastam em ordem, da esquerda para a direita, e um traço
     horizontal com vão entre eles é o desenho mais curto que diz isso. O
     gasto fica no mesmo lugar, apagado — a posição é o que importa. */
  return (
    <Row gap={10} style={{ height: altura, alignItems: 'center' }}>
      {Array.from({ length: total }, (_, i) => {
        const cheio = i < cheios;
        const t = total > 1 ? i / (total - 1) : 0;
        return (
          <View
            key={i}
            style={{
              flex: 1, height: altura, borderRadius: 2,
              backgroundColor: cheio ? mixHex(topo, base, t) : apagado,
            }}
          />
        );
      })}
    </Row>
  );
}

/** Interpolação em hex sem lib — usada pelo Medidor e pelo Nível. */
function mixHex(a: string, b: string, t: number) {
  const n = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const [r1, g1, b1] = n(a), [r2, g2, b2] = n(b);
  const m = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `rgb(${m(r1, r2)},${m(g1, g2)},${m(b1, b2)})`;
}

/* ------------------------------------------------------------------ *
 * GRADE — o calendário do acompanhamento
 *
 * Uma célula por semana, em linhas. Célula preenchida com marca é semana
 * cumprida; apagada é semana vazia; contornada é a de agora; translúcida
 * é futuro.
 *
 * O que ela faz que um número não faz: mostra ONDE. "87% de adesão" é
 * verdade e é opaco — não diz que os buracos foram duas semanas seguidas
 * em maio, que é a informação que explica um platô. O olho lê a falha
 * numa grade antes de ler qualquer rótulo, e é por isso que calendário
 * de contribuição funciona: a ausência tem posição.
 * ------------------------------------------------------------------ */
export type GradeCelula = {
  n: number; cheia: boolean; parcial?: number; atual: boolean; futura: boolean; rotulo?: string;
};

export function Grade({
  celulas, colunas = 6, sobreEscuro = false, cor, corVazia,
}: {
  celulas: GradeCelula[]; colunas?: number; sobreEscuro?: boolean;
  cor?: string; corVazia?: string;
}) {
  const { c } = useTheme();
  const acesa = cor ?? c.lime;
  const vazia = corVazia ?? (sobreEscuro ? 'rgba(255,255,255,0.10)' : c.bg2);
  const contorno = sobreEscuro ? 'rgba(255,255,255,0.55)' : c.accent;
  const tinta = sobreEscuro ? c.onHero2 : c.tx3;

  const linhas: GradeCelula[][] = [];
  for (let i = 0; i < celulas.length; i += colunas) linhas.push(celulas.slice(i, i + colunas));

  return (
    <View style={{ gap: 6 }}>
      {linhas.map((linha, li) => (
        <Row key={li} gap={6}>
          {linha.map((cel) => (
            <View
              key={cel.n}
              style={{
                flex: 1, aspectRatio: 1, borderRadius: 11,
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: cel.futura ? 'transparent' : cel.cheia ? acesa : vazia,
                /* só a semana corrente ganha contorno. É o único lugar do
                   app em que uma borda é o dispositivo certo: aqui ela não
                   separa superfícies (princípio 4), ela aponta uma célula
                   dentro de uma grade de iguais. */
                ...(cel.atual ? { borderWidth: 1.5, borderColor: contorno } : null),
                ...(cel.futura && !cel.atual ? { borderWidth: 1, borderColor: sobreEscuro ? 'rgba(255,255,255,0.12)' : c.line } : null),
              }}
            >
              <Txt
                v="micro"
                c={cel.cheia && !cel.futura ? (sobreEscuro ? c.limeInk : c.limeInk) : cel.futura ? tinta : tinta}
                style={{ opacity: cel.futura ? 0.5 : 1, fontSize: 11 }}
              >
                {cel.rotulo ?? cel.n}
              </Txt>
            </View>
          ))}
          {/* completa a última linha para as células não esticarem */}
          {linha.length < colunas && Array.from({ length: colunas - linha.length }, (_, i) => (
            <View key={`v${i}`} style={{ flex: 1, aspectRatio: 1 }} />
          ))}
        </Row>
      ))}
    </View>
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

/* ============================================================
   ONDA — a presença do Companion

   Substituiu a esfera. Esfera é objeto: fica ali, parada, decorativa. A
   onda é sinal — diz que alguém está ouvindo, que há atividade do outro
   lado. Numa aba cuja tese é "existe uma inteligência acompanhando",
   sinal comunica melhor que objeto.

   Três senóides de amplitude e fase diferentes, com opacidade caindo do
   centro para as bordas — é a queda nas pontas que faz o traço parecer
   emitido em vez de desenhado. O lima leva a linha da frente porque é a
   cor de energia da marca; o teal e o branco ficam atrás, dando volume.
   ============================================================ */
export function Onda({ c, width, height = 96 }: { c: Palette; width: number; height?: number }) {
  const meio = height / 2;

  /* Cada curva é uma senóide amostrada em 48 pontos, com um envelope que
     zera a amplitude nas duas pontas: sem ele o traço termina no ar, com
     um corte reto que denuncia o SVG. */
  const curva = (amp: number, ciclos: number, fase: number) => {
    const n = 48;
    return Array.from({ length: n + 1 }, (_, i) => {
      const t = i / n;
      const envelope = Math.sin(Math.PI * t) ** 1.4;
      const y = meio - Math.sin(t * Math.PI * 2 * ciclos + fase) * amp * envelope;
      return `${i ? 'L' : 'M'}${(t * width).toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  };

  const linhas = [
    { d: curva(height * 0.30, 1.5, 0), cor: c.lime, w: 2, o: 1 },
    { d: curva(height * 0.22, 1.5, 0.7), cor: c.teal, w: 1.6, o: 0.72 },
    { d: curva(height * 0.34, 1.2, 2.1), cor: '#FFFFFF', w: 1.2, o: 0.45 },
    { d: curva(height * 0.16, 2.1, 3.4), cor: c.lime, w: 1, o: 0.34 },
  ];

  return (
    <Svg width={width} height={height}>
      <Defs>
        {/* brilho por trás do feixe — dá o halo sem contorno */}
        <RadialGradient id="ondaGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={c.lime} stopOpacity={0.34} />
          <Stop offset="0.45" stopColor={c.teal} stopOpacity={0.16} />
          <Stop offset="1" stopColor={c.teal} stopOpacity={0} />
        </RadialGradient>
        {/* as pontas somem: o feixe não tem começo nem fim visível */}
        <SvgGrad id="ondaFade" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
          <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={1} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </SvgGrad>
      </Defs>

      <Ellipse cx={width / 2} cy={meio} rx={width / 2} ry={height / 2} fill="url(#ondaGlow)" />

      {linhas.map((l, i) => (
        <React.Fragment key={i}>
          {/* traço largo e translúcido por baixo = o glow da própria linha */}
          <Path d={l.d} stroke={l.cor} strokeWidth={l.w * 4} strokeOpacity={l.o * 0.16} fill="none" strokeLinecap="round" />
          <Path d={l.d} stroke={l.cor} strokeWidth={l.w} strokeOpacity={l.o} fill="none" strokeLinecap="round" />
        </React.Fragment>
      ))}
    </Svg>
  );
}

/* O ORBE morava aqui, desenhado: halo, reflexo, corpo, brasa e aro em
   cinco camadas de degradê radial. Chegava perto e não chegava lá, e o
   limite é o mesmo da aurora — cor calculada não tem o grão nem a
   irregularidade de luz de uma peça renderizada. Numa forma cuja matéria
   É luz, isso não é detalhe, é o assunto.

   Virou PNG com o fundo convertido em alfa por luminância, em
   assets/images/orbe-companion.png. A regra que fica: instrumento se
   desenha quando a FORMA carrega o dado; quando o que carrega é a
   matéria, imagem ganha. */
