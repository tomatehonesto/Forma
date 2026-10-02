import React, { useEffect, useRef, useState } from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Path, Defs, LinearGradient as SvgGrad, Stop, Circle, Line, ClipPath, Rect, G } from 'react-native-svg';
import Animated, {
  Easing, cancelAnimation, useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Txt } from './kit';
import { useTheme } from './useTheme';
import { useMenosMovimento, curvaDoMovimento } from './useMenosMovimento';
import { movimento } from '../theme';

type Pt = { x: number; y: number };

/* ============================================================
   O GRÁFICO SE DESENHA UMA VEZ POR ABERTURA (02/10/2026)

   Fase 2 de docs/superpowers/specs/2026-10-02-motion-design.md: a curva
   se revela da esquerda para a direita, as barras sobem do pé, a barra
   de progresso enche. Tudo aqui é o relógio que essas peças dividem.

   ⚠️ UMA VEZ POR ABERTURA, E NÃO A CADA REGISTRO. O estado é clonado a
   cada gravação — um copo d'água, um check-in — e um desenho que
   dependesse dos dados recomeçaria a cada um deles: a pessoa registra e
   o gráfico some e se redesenha embaixo do dedo. O relógio anda uma vez
   só, na montagem (ou quando a largura chega, para quem espera medir), e
   dado novo entra pronto. Só uma montagem nova desenha de novo.

   ⚠️ NA UI THREAD, PELO REANIMATED, e não no `Animated` do RN: animação
   de JS disparada na montagem perde os primeiros quadros, porque é
   justamente quando a thread de JS está ocupada montando a tela (a lição
   de ui/folhas).

   UM RELÓGIO SÓ, LINEAR, de 0 a 1. Cada peça recorta dele a própria
   janela (`naJanela`) e aplica a curva da casa — é assim que a meta entra
   antes do dado e cada barra espera a vez dela sem um animador por barra.

   ⚠️ O ESTADO FINAL É O DESENHO DE SEMPRE. Quando o relógio chega ao fim,
   `desenhado` vira verdadeiro e as peças voltam aos elementos comuns, sem
   prop animada nenhuma: o que fica na tela é exatamente o desenho de
   antes, e não "o último quadro de uma animação". É também a rede de
   proteção da web: se uma prop animada de SVG não pegar lá, o pior que
   acontece é o gráfico surgir pronto no fim — nunca ficar pela metade.

   Com "reduzir movimento", `desenhado` nasce verdadeiro: aparece pronto.
   ============================================================ */
export type Desenho = {
  /** o relógio, de 0 a 1, linear — cada peça recorta dele a sua janela */
  t: SharedValue<number>;
  /** a duração do relógio inteiro, em ms */
  total: number;
  /** o relógio acabou (ou nem andou): desenhe o de sempre, sem animação */
  desenhado: boolean;
};

export function useDesenhoDaAbertura(total: number, pronto = true): Desenho {
  const menos = useMenosMovimento();
  const t = useSharedValue(menos ? 1 : 0);
  const [desenhado, setDesenhado] = useState(menos);
  const andou = useRef(false);
  /* A duração que valeu na partida: se a série crescer no meio do
     desenho, as janelas continuam medidas no relógio que está correndo. */
  const daPartida = useRef(total);

  useEffect(() => {
    /* O "reduzir movimento" pode chegar depois da montagem (a escuta do
       AccessibilityInfo responde numa promessa): aí o desenho pula para o
       fim, onde estiver. */
    if (menos) {
      andou.current = true;
      cancelAnimation(t);
      t.value = 1;
      setDesenhado(true);
      return;
    }
    if (!pronto || andou.current) return;
    andou.current = true;
    daPartida.current = total;
    t.value = withTiming(1, { duration: total, easing: Easing.linear }, (fim) => {
      if (fim) scheduleOnRN(setDesenhado, true);
    });
    /* ⚠️ O RELÓGIO PARA JUNTO COM QUEM O ACENDEU — e pode voltar a andar.
       Esta limpeza roda ao desmontar, mas também quando o efeito vai rodar
       de novo: a largura sumiu e voltou, o "reduzir movimento" chegou, a
       recarga do desenvolvimento repassou os efeitos. Se só parasse, o
       `andou` impediria a volta e o gráfico ficaria preso no meio, com o
       recorte pela metade. Então ele para E se desarma: se o componente
       continua de pé, a próxima rodada retoma de onde o relógio estava (e,
       com o desenho já pronto, retomar de 1 até 1 não mexe em nada). */
    return () => {
      cancelAnimation(t);
      andou.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menos, pronto]);

  return { t, total: andou.current ? daPartida.current : total, desenhado };
}

/** Quanto uma peça já andou: a janela dela no relógio (de `de`, por
    `dura` ms, num relógio de `total` ms), na curva da casa. */
export function naJanela(t: number, total: number, de: number, dura: number) {
  'worklet';
  const x = (t * total - de) / Math.max(1, dura);
  return curvaDoMovimento(x <= 0 ? 0 : x >= 1 ? 1 : x);
}

/* O PASSO ENTRE AS BARRAS. É o da casa (`movimento.passo`, 40 ms) enquanto
   a série cabe no tempo de um gráfico; numa série longa ele encurta, para
   a última barra não chegar um segundo e meio depois da primeira — uma
   onda que demora deixa de ser desenho e vira espera. */
function passoDasBarras(n: number, antes: number) {
  return Math.min(movimento.passo, (movimento.grafico - antes - movimento.medio) / Math.max(1, n - 1));
}

/* O RELÓGIO DE UM GRÁFICO DE BARRAS. Com meta, ela entra primeiro, num
   fade curto, e só então as barras começam a subir: a régua aparece antes
   do que ela mede. Cada barra sobe em `movimento.medio`, uma depois da
   outra. `de(i)` diz quando a barra i parte; `dura`, quanto ela leva. */
export function useBarrasQueSobem(n: number, comMeta = false) {
  const antes = comMeta ? movimento.curto : 0;
  const passo = passoDasBarras(n, antes);
  const desenho = useDesenhoDaAbertura(antes + Math.max(0, n - 1) * passo + movimento.medio);
  return { desenho, de: (i: number) => antes + i * passo, dura: movimento.medio as number };
}

/* UMA BARRA QUE SOBE DO PÉ. A altura anima, e não um `scaleY`: barra de
   ponta redonda achatada pela escala vira gota no meio da subida, e o
   rótulo que mora em cima dela (no cartão da semana) sobe junto só se a
   altura for de verdade. Quem passa o `style` não passa a altura — ela é
   a `altura` daqui. */
export function BarraQueSobe({ desenho, de, dura = movimento.medio, altura, style }: {
  desenho: Desenho; de: number; dura?: number; altura: number; style?: StyleProp<ViewStyle>;
}) {
  if (desenho.desenhado) return <View style={[style, { height: altura }]} />;
  return <BarraSubindo t={desenho.t} total={desenho.total} de={de} dura={dura} altura={altura} style={style} />;
}

function BarraSubindo({ t, total, de, dura, altura, style }: {
  t: SharedValue<number>; total: number; de: number; dura: number; altura: number; style?: StyleProp<ViewStyle>;
}) {
  const sobe = useAnimatedStyle(() => ({ height: altura * naJanela(t.value, total, de, dura) }));
  return <Animated.View style={[style, sobe]} />;
}

/* O QUE APARECE NUM FADE — a meta antes das barras, o número com a barra
   dele. Pronto o desenho, vira um View comum. */
export function QueAparece({ desenho, de, dura = movimento.curto, style, pointerEvents, children }: {
  desenho: Desenho; de: number; dura?: number; style?: StyleProp<ViewStyle>;
  pointerEvents?: ViewProps['pointerEvents']; children?: React.ReactNode;
}) {
  if (desenho.desenhado) return <View pointerEvents={pointerEvents} style={style}>{children}</View>;
  return (
    <Aparecendo t={desenho.t} total={desenho.total} de={de} dura={dura} style={style} pointerEvents={pointerEvents}>
      {children}
    </Aparecendo>
  );
}

function Aparecendo({ t, total, de, dura, style, pointerEvents, children }: {
  t: SharedValue<number>; total: number; de: number; dura: number; style?: StyleProp<ViewStyle>;
  pointerEvents?: ViewProps['pointerEvents']; children?: React.ReactNode;
}) {
  const aparece = useAnimatedStyle(() => ({ opacity: naJanela(t.value, total, de, dura) }));
  return <Animated.View pointerEvents={pointerEvents} style={[style, aparece]}>{children}</Animated.View>;
}

/* O RECORTE QUE ABRE A CURVA. Um retângulo dentro do ClipPath, com a
   largura indo de zero à do desenho: a curva aparece da esquerda para a
   direita, como traço sendo feito. A largura anima por prop de SVG
   (`useAnimatedProps`), que o Reanimated 4 dá como suportada nos três.

   ⚠️ CONFERIDO NA WEB (02/10/2026): no navegador o react-native-svg recebe
   a largura quadro a quadro (o `setNativeProps` dele vira atributo do
   <rect>), e o recorte abre como no aparelho. Se um dia deixar de pegar,
   o `desenhado` do fim tira o recorte de qualquer jeito — a curva surge
   pronta, nunca pela metade.

   ⚠️⚠️ E NO ANDROID, O `clipRule="nonzero"` NO GRUPO É O QUE FAZ ABRIR
   (02/10/2026, achado da revisão, lido no código do react-native-svg
   15.15.4). Sem ele a regra é a padrão, evenodd, e o Android usa o caminho
   do recorte que ficou guardado no primeiro quadro: o retângulo dentro do
   ClipPath nunca é desenhado, então mudar a largura dele não limpa esse
   cache — a curva ficava em branco os 0,7 s inteiros e surgia de uma vez
   no fim. Com "nonzero" o Android remonta o recorte a partir do retângulo
   a cada desenho. Para um retângulo só, o resultado é o mesmo no iOS e na
   web. Ainda precisa ser visto num Android de verdade. */
const RetanguloAnimado = Animated.createAnimatedComponent(Rect);

function RecorteQueAbre({ desenho, largura, altura }: { desenho: Desenho; largura: number; altura: number }) {
  const { t, total } = desenho;
  const abre = useAnimatedProps(() => ({ width: largura * naJanela(t.value, total, 0, total) }));
  return <RetanguloAnimado x={0} y={0} height={altura} animatedProps={abre} />;
}

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
  fill = 0.17, onScrub, scrub, onToque, nosEm, eixosEm,
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
  /* ⚠️⚠️ O TOQUE NA CURVA MORA AQUI, e não no <Pressable> de quem a
     envolve — e é essa mudança de casa que conserta o arrasto virando
     navegação.

     Enquanto o toque era um Pressable por fora, os dois gestos viviam em
     sistemas diferentes: o arrasto no Gesture Handler, o toque no
     responder do JS. Sistemas diferentes não disputam entre si, então
     nenhum dos dois sabia do outro — o dedo arrastava para ler e, ao
     soltar, o Pressable navegava.

     Dentro da mesma biblioteca eles disputam: o Tap falha sozinho quando
     o dedo anda além da distância dele, e o Exclusive dá a preferência ao
     arrasto. Quem desliza lê; quem encosta e solta no mesmo lugar, abre.

     Não é elegância — é a única forma que não depende de ordem de
     eventos entre dois sistemas que terminam o toque no mesmo instante. */
  onToque?: () => void;
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

  /* ⚠️ A CURVA SE REVELA DA ESQUERDA PARA A DIREITA, uma vez por abertura
     (02/10/2026 — ver `useDesenhoDaAbertura`, acima). O relógio só parte
     quando a largura existe: quem espera o onLayout desenharia metade do
     caminho no escuro. Pronto o desenho, o recorte sai e a curva volta a
     ser exatamente a de sempre.

     O id do recorte é do componente, e não só o `id` de quem chama: na web
     todos os ids moram no mesmo documento, e duas curvas com o mesmo nome
     de recorte usariam o retângulo da primeira. */
  const desenho = useDesenhoDaAbertura(movimento.grafico, w > 0);
  const recorte = `${id}k${React.useId().replace(/[^A-Za-z0-9_-]/g, '')}`;

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

  /* A distância é a do toque parado: dez pixels de folga para a mão que
     treme, e um pixel a mais já é intenção de ler. */
  const toque = React.useMemo(
    () => Gesture.Tap()
      .enabled(!!onToque)
      .runOnJS(true)
      .maxDistance(10)
      .onEnd((_e, ok) => { if (ok) onToque?.(); }),
    [onToque],
  );
  const gestos = React.useMemo(() => Gesture.Exclusive(pan, toque), [pan, toque]);

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
            {desenho.desenhado ? null : (
              <ClipPath id={recorte}><RecorteQueAbre desenho={desenho} largura={w} altura={height} /></ClipPath>
            )}
          </Defs>
          {/* O que se revela: área, fios, traço, nós e marcador. A marca do
              dedo fica de fora, embaixo — quem arrasta durante o desenho
              lê o ponto que já existe, sem esperar o recorte chegar nele. */}
          <G clipPath={desenho.desenhado ? undefined : `url(#${recorte})`} clipRule="nonzero">
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
          </G>

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
  return <GestureDetector gesture={gestos}>{corpo}</GestureDetector>;
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
  /* As barras sobem do pé, uma depois da outra, uma vez por abertura
     (02/10/2026). Sem meta: aqui não há régua para entrar antes. */
  const sobem = useBarrasQueSobem(data.length);
  if (!data.length) return null;
  /* piso de 4 px: barra de valor zero sumiria, e sumir é dizer que não
     houve registro — que é diferente de ter registrado zero */
  const alt = (v: number) => Math.max(4, (v / 100) * height);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height, gap }}>
      {data.map((d, i) => {
        const ultima = i === data.length - 1;
        return (
          <BarraQueSobe
            key={d.t}
            desenho={sobem.desenho} de={sobem.de(i)} dura={sobem.dura}
            altura={alt(d.v)}
            style={{
              width: largura,
              borderRadius: largura / 2,
              backgroundColor: destaque && ultima ? c.lime : 'rgba(255,255,255,0.28)',
            }}
          />
        );
      })}
    </View>
  );
}
