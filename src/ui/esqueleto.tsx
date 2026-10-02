import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing, ReduceMotion, cancelAnimation, useAnimatedStyle, useSharedValue,
  withDelay, withRepeat, withTiming, type SharedValue,
} from 'react-native-reanimated';
import { Image, type ImageProps } from 'expo-image';
import { Txt } from './kit';
import { useTheme } from './useTheme';
import { curvaDoMovimento, useMenosMovimento } from './useMenosMovimento';
import { movimento, radius, ty } from '../theme';

/* ============================================================
   O ESQUELETO — o desenho do que vem, enquanto a espera é de verdade
   (02/10/2026, fase 3 de docs/superpowers/specs/2026-10-02-motion-design.md)

   ⚠️ SÓ ONDE HÁ ESPERA DE VERDADE, por decisão do dono. Quase toda tela
   do aplicativo desenha na hora, a partir do que está no aparelho; um
   esqueleto ali seria uma espera inventada para parecer moderno. Os que
   existem estão onde o dado vem de fora: a vitrine e a ficha das clínicas
   (o banco), os rostos do cartão da rede no Cuidado, a leitura da semana
   e a do prato (a IA).

   ⚠️ UM PULSO SÓ PARA O GRUPO, e não um por peça. O `<Esqueleto>` é dono
   de um valor só, e cada osso lê esse valor: os ossos de uma tela
   respiram juntos. Um laço por peça sai de fase com o tempo — cada um
   começa num quadro — e o que era uma tela esperando vira um painel de
   luzes piscando.

   ⚠️ E O QUE PULSA SÃO OS OSSOS, e não a moldura. O cartão em volta de um
   osso é o cartão de verdade, no lugar dele: fica parado, como vai ficar
   quando o conteúdo chegar. Pulsar o cartão inteiro faria a sombra e a
   borda respirarem, e a tela inteira pareceria instável.

   ⚠️ NADA APARECE ANTES DE ~200 ms. O grupo ocupa o lugar dele desde o
   primeiro quadro — é isso que impede o pulo —, mas transparente; só
   depois do atraso ele surge. Uma resposta rápida (a clínica que a
   vitrine já tinha lido, o servidor que nem está configurado) chega antes
   disso, e então nenhum esqueleto pisca na tela por um quadro. Piscar é
   pior do que esperar parado.

   ⚠️ O FORMATO É O DO CONTEÚDO, e não um retângulo genérico. Cada linha
   tem a altura da linha de texto que ela substitui (a variante do `Txt`,
   com a escala de fonte do sistema), e quem usa monta o esqueleto com as
   mesmas medidas da peça final. Quando o conteúdo chega, ele cai no
   lugar que o esqueleto ocupava — sem empurrar nada.

   ⚠️ COM "REDUZIR MOVIMENTO", PARADO. O atraso continua (não é
   movimento, é não piscar), mas o grupo surge sem fade e os ossos ficam
   acesos, sem pulso. Todas as animações daqui passam `ReduceMotion.Never`
   ao Reanimated de propósito: quem decide é `useMenosMovimento`, que
   escuta a mudança ao vivo — e não o Reanimated, que só sabe o valor de
   quando o aplicativo abriu. Duas fontes decidindo a mesma coisa é como
   uma delas acaba pulando o atraso sozinha.

   ⚠️ NA UI THREAD. A lição de ui/folhas: animação de JS disparada na
   montagem perde os primeiros quadros, porque é justamente quando a
   thread está ocupada montando. O pulso é do Reanimated.
   ============================================================ */

/* ⚠️ OS TEMPOS SAEM DE `movimento`, e não há número novo aqui.
   · o atraso é o `curto` (180 ms): é o "~200 ms" do spec, e o mesmo fade
     de um elemento só que o grupo faz ao surgir;
   · meia volta do pulso é o `grafico` (700 ms), que era exatamente o
     tempo do pulso à mão do `Lendo` — o fôlego que o dono já viu;
   · 0,45 é o ponto mais apagado do mesmo `Lendo`. */
const ATRASO = movimento.curto;
const MEIA_VOLTA = movimento.grafico;
const APAGADO = 0.45;

/* O pulso respira — vai e volta igual —, e por isso a curva é simétrica,
   e não a `curvaDoMovimento`: aquela é de quem chega e assenta, e num
   laço ela daria um tranco em cada ponta. */
const RESPIRO = Easing.inOut(Easing.quad);

type Grupo = { pulso: SharedValue<number>; sobreOFundo: boolean };
const GrupoDoEsqueleto = createContext<Grupo | null>(null);

/** O grupo: um pulso, um atraso, e o que o leitor de tela diz.

    `rotulo` é para onde nada visível diz que se está esperando — a
    vitrine, a ficha da clínica. Onde já há uma frase na tela ("Lendo o
    prato…"), o grupo não leva rótulo e some para o leitor de tela: é
    enfeite, e a frase já disse.

    `sobreOFundo` é para ossos que moram direto no fundo da página, e não
    num cartão: no claro, o `bg2` sobre o `bg` some (#EDF1F3 sobre
    #F5F6FA), e ali o osso sobe um degrau, para o `bg3`. */
export function Esqueleto({ children, rotulo, sobreOFundo = false, style }: {
  children: React.ReactNode;
  rotulo?: string;
  sobreOFundo?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const menos = useMenosMovimento();
  const surge = useSharedValue(0);
  const pulso = useSharedValue(menos ? 1 : APAGADO);
  /* O atraso conta da montagem, e não da última resposta de "reduzir
     movimento": a escuta pode mudar de ideia meio quadro depois de abrir,
     e o esqueleto não pode esperar duas vezes por isso. */
  const [montou] = useState(() => Date.now());

  useEffect(() => {
    const falta = Math.max(0, ATRASO - (Date.now() - montou));
    cancelAnimation(surge);
    cancelAnimation(pulso);
    if (menos) {
      pulso.value = 1;
      surge.value = withDelay(falta, withTiming(1, { duration: 0, reduceMotion: ReduceMotion.Never }), ReduceMotion.Never);
      return;
    }
    surge.value = withDelay(
      falta,
      withTiming(1, { duration: movimento.curto, easing: curvaDoMovimento, reduceMotion: ReduceMotion.Never }),
      ReduceMotion.Never,
    );
    /* Começa no apagado e acende: somado ao fade de quem surge, a
       primeira subida é uma só, sem o osso acender e já apagar. */
    pulso.value = APAGADO;
    pulso.value = withDelay(
      falta,
      withRepeat(
        withTiming(1, { duration: MEIA_VOLTA, easing: RESPIRO, reduceMotion: ReduceMotion.Never }),
        -1, true, undefined, ReduceMotion.Never,
      ),
      ReduceMotion.Never,
    );
    return () => { cancelAnimation(surge); cancelAnimation(pulso); };
  }, [menos, montou, surge, pulso]);

  const estilo = useAnimatedStyle(() => ({ opacity: surge.value }));
  const grupo = useMemo(() => ({ pulso, sobreOFundo }), [pulso, sobreOFundo]);
  /* ⚠️ `role` E `aria-*`, e não os `accessibility*`: são os que valem nos
     três lugares. O react-native-web 0.21 ignora `importantForAccessibility`
     e `accessibilityState` (o esqueleto "escondido" era lido na web), e o
     React Native leva `aria-hidden` ao `accessibilityElementsHidden` do
     iOS e ao `no-hide-descendants` do Android. */
  const leitura = rotulo
    ? { accessible: true, role: 'progressbar' as const, 'aria-label': rotulo, 'aria-busy': true }
    : { 'aria-hidden': true };

  return (
    <GrupoDoEsqueleto.Provider value={grupo}>
      <Animated.View {...leitura} style={[style, estilo]}>
        {children}
      </Animated.View>
    </GrupoDoEsqueleto.Provider>
  );
}

/* Cada osso lê o pulso do grupo. Fora de um grupo ele fica aceso e
   parado — não quebra, mas também não espera nada: osso solto é erro de
   quem montou.

   ⚠️ `cor` É PARA O OSSO QUE MORA NUM CARTÃO DE COR (02/10/2026). O cinza
   das superfícies (`bg2`, ou `bg3` sobre o fundo) foi pensado para o
   cartão branco e para a página. Sobre o azul fraco e o lima da leitura
   da semana ele dava de 1,00 a 1,10:1 nas dez paletas do claro (e no
   azul do escuro também): o cartão parecia vazio, e não esperando. Quem
   põe um osso sobre um fundo de cor passa uma cor medida contra aquele
   fundo — ver o `Lendo`, em app/leitura. Muda a cor, e não o fôlego: o
   pulso continua sendo o do grupo. */
function useOsso(cor?: string) {
  const g = useContext(GrupoDoEsqueleto);
  const { c } = useTheme();
  const pulso = g?.pulso;
  const estilo = useAnimatedStyle(() => ({ opacity: pulso ? pulso.value : 1 }));
  return { cor: cor ?? (g?.sobreOFundo ? c.bg3 : c.bg2), estilo };
}

/** Uma linha de texto que ainda não chegou. `v` é a variante do `Txt` que
    vai ocupar o lugar: a linha é a caixa de um `Txt` dessa variante, e o
    osso, uma barra de ~60% do corpo da letra, deita no meio dela.
    `largura` é a da linha, e em % é da largura de quem a contém.
    `alturaDaLinha` é para o texto que troca o `lineHeight` da variante
    (o endereço da clínica é um `caption` de 22). */
function LinhaDoEsqueleto({ v = 'body', largura = '100%', alturaDaLinha, cor, style }: {
  v?: keyof typeof ty;
  largura?: DimensionValue;
  alturaDaLinha?: number;
  cor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { cor: tinta, estilo } = useOsso(cor);
  /* ⚠️ A ALTURA DA LINHA SAI DO MOTOR DE TEXTO, E NÃO DE UMA CONTA
     (02/10/2026). Era `lineHeight × fontScale`, e a conta só vale enquanto
     a escala da letra é linear. A do Android 14 não é: a 200%, a letra
     pequena quase dobra e a grande cresce bem menos (o corpo de 36 vira
     ~43, e não 72) — e a linha do esqueleto saía mais alta que a do
     texto, e tudo subia quando ele chegava. Justamente para quem aumenta
     a letra: não há teto neste aplicativo, e boa parte de quem usa tem
     mais de 40. Agora a caixa da linha é um `Txt` de verdade, da mesma
     variante, com um espaço transparente dentro: ela tem a altura que o
     sistema dá ao texto, seja qual for a regra dele, e o osso deita por
     cima.

     ⚠️ E O OSSO É UMA FRAÇÃO DA CAIXA, e não `fontSize × fontScale`. Na
     caixa que vem do texto, a conta em pixels faria o osso das letras
     grandes quase encher a linha (o `h1` a 200% daria 45 numa linha de
     ~50); como fração, ele fica no meio dela em qualquer escala.

     ⚠️ O ESPAÇO É `aria-hidden`: ele é medida, e não texto. */
  const fracao = (ty[v].fontSize * 0.62) / (alturaDaLinha ?? ty[v].lineHeight);
  const osso = `${Math.round(fracao * 1000) / 10}%` as const;
  return (
    <View style={style}>
      <View style={{ width: largura }}>
        <Txt v={v} c="transparent" aria-hidden style={alturaDaLinha != null ? { lineHeight: alturaDaLinha } : null}>
          {'\u00A0'}
        </Txt>
        <View style={[StyleSheet.absoluteFill, { justifyContent: 'center' }]}>
          <Animated.View style={[{ height: osso, borderRadius: radius.pill, backgroundColor: tinta }, estilo]} />
        </View>
      </View>
    </View>
  );
}

/** Uma imagem, um botão, um chip — o retângulo de quem ainda não chegou.
    Sem `altura`, ele estica na fileira que o contém (`alignItems:
    'stretch'`), como a foto do cartão da vitrine. */
function BlocoDoEsqueleto({ largura, altura, raio = radius.sm, cor, style }: {
  largura?: DimensionValue;
  altura?: DimensionValue;
  raio?: number;
  cor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { cor: tinta, estilo } = useOsso(cor);
  return <Animated.View style={[{ width: largura, height: altura, borderRadius: raio, backgroundColor: tinta }, style, estilo]} />;
}

/** Um rosto, um ícone redondo. */
function DiscoDoEsqueleto({ lado, cor, style }: { lado: number; cor?: string; style?: StyleProp<ViewStyle> }) {
  const { cor: tinta, estilo } = useOsso(cor);
  return <Animated.View style={[{ width: lado, height: lado, borderRadius: lado / 2, backgroundColor: tinta }, style, estilo]} />;
}

Esqueleto.Linha = LinhaDoEsqueleto;
Esqueleto.Bloco = BlocoDoEsqueleto;
Esqueleto.Disco = DiscoDoEsqueleto;

/* ------------------------------------------------------------------ */
/* OS ROSTOS QUE AINDA VÊM — a fileira sobreposta do cartão da rede, na
   aba Cuidado, enquanto a lista da rede chega. As medidas padrão são as
   de lá: quatro rostos de 42, 12 de sobreposição e o aro de 2 na cor do
   cartão.

   ⚠️ O ARO É MOLDURA, E NÃO OSSO. Ele fica parado e opaco, e só o disco
   de dentro pulsa: com o aro pulsando junto, os discos ficariam
   translúcidos onde se sobrepõem, e a fileira viraria uma mancha de
   círculos atravessando uns aos outros. */
export function RostosChegando({ quantos = 4, lado = 42, sobre = 12, aro = 2 }: {
  quantos?: number; lado?: number; sobre?: number; aro?: number;
}) {
  const { c } = useTheme();
  return (
    <Esqueleto style={{ flexDirection: 'row' }}>
      {Array.from({ length: quantos }, (_, i) => (
        <View
          key={i}
          style={{
            marginLeft: i ? -sobre : 0, width: lado, height: lado, borderRadius: lado / 2,
            borderWidth: aro, borderColor: c.bg1, backgroundColor: c.bg1, overflow: 'hidden',
          }}
        >
          <Esqueleto.Disco lado={lado - 2 * aro} />
        </View>
      ))}
    </Esqueleto>
  );
}

/* ------------------------------------------------------------------ */
/* OS TRÊS PONTOS DA ESPERA — o balão da conversa enquanto a resposta vem.

   ⚠️ UMA ONDA, NÃO TRÊS PISCAS. Um relógio só, e cada ponto acena na sua
   vez: sobe um pouco e acende, um depois do outro, e os três descansam
   juntos antes da volta seguinte. É o "alguém está escrevendo" que todo
   aplicativo de conversa ensinou a ler — três pontos parados leem como
   ícone, e não como alguém trabalhando.

   ⚠️ O TEMPO É O DO ESQUELETO. Uma volta inteira são duas meias voltas do
   pulso (1,4 s): a conversa e a leitura da semana esperam no mesmo
   fôlego. Cada ponto acena por dois `medio` (520 ms) e o seguinte começa
   um `curto` (180 ms) depois — os três acenos cabem na primeira metade da
   volta, e a outra metade é o descanso.

   ⚠️ COM "REDUZIR MOVIMENTO", OS TRÊS PONTOS DE ANTES, parados: o mais
   aceso primeiro e os outros apagando, o desenho que esta peça tinha
   antes de andar. */
const VOLTA_DOS_PONTOS = 2 * MEIA_VOLTA;
const VEZ_DE_CADA = movimento.curto;
const ACENO = 2 * movimento.medio;
const PONTO_APAGADO = 0.4;
/* quanto o ponto sobe no aceno, em px — um terço do próprio ponto */
const SOBE_O_PONTO = 2;

export function PontosDaEspera({ cor, rotulo, tam = 6 }: {
  cor: string;
  /** o que o leitor de tela diz no lugar dos pontos */
  rotulo?: string;
  tam?: number;
}) {
  const menos = useMenosMovimento();
  const relogio = useSharedValue(0);
  useEffect(() => {
    cancelAnimation(relogio);
    relogio.value = 0;
    if (menos) return;
    relogio.value = withRepeat(
      withTiming(1, { duration: VOLTA_DOS_PONTOS, easing: Easing.linear, reduceMotion: ReduceMotion.Never }),
      -1, false, undefined, ReduceMotion.Never,
    );
    return () => cancelAnimation(relogio);
  }, [menos, relogio]);

  const leitura = rotulo ? { accessible: true, 'aria-label': rotulo } : { 'aria-hidden': true };
  return (
    <View {...leitura} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      {[0, 1, 2].map((i) => <Ponto key={i} i={i} relogio={relogio} parado={menos} cor={cor} tam={tam} />)}
    </View>
  );
}

function Ponto({ i, relogio, parado, cor, tam }: {
  i: number; relogio: SharedValue<number>; parado: boolean; cor: string; tam: number;
}) {
  const estilo = useAnimatedStyle(() => {
    if (parado) return { opacity: 1 - i * 0.25, transform: [{ translateY: 0 }] };
    const agora = relogio.value * VOLTA_DOS_PONTOS - i * VEZ_DE_CADA;
    const naVolta = ((agora % VOLTA_DOS_PONTOS) + VOLTA_DOS_PONTOS) % VOLTA_DOS_PONTOS;
    const aceno = naVolta < ACENO ? Math.sin((Math.PI * naVolta) / ACENO) : 0;
    return {
      opacity: PONTO_APAGADO + (1 - PONTO_APAGADO) * aceno,
      transform: [{ translateY: -SOBE_O_PONTO * aceno }],
    };
  });
  return <Animated.View style={[{ width: tam, height: tam, borderRadius: tam / 2, backgroundColor: cor }, estilo]} />;
}

/* ------------------------------------------------------------------ */
/* A IMAGEM QUE CHEGA PELA REDE — o mesmo `Image` do expo-image, com um
   fade de `movimento.curto` quando a fonte vem de fora.

   ⚠️ SÓ PARA O QUE VEM DE FORA. A foto de uma clínica ou de quem atende
   desce do balde do banco e chega depois do resto da tela; sem
   transição, ela estoura no lugar do fundo cinza. A imagem do pacote não
   espera rede nenhuma, e um fade nela seria uma espera de mentira a cada
   abertura. Por isso a pergunta é a do endereço (http ou https), e não a
   da tela: `fotoDaEquipe` devolve um ou outro conforme o vínculo veio da
   rede ou da semente (ver ui/retratos), e a mesma linha de código serve
   os dois.

   ⚠️ E A FOTO DE FORA ESMAECE TODA VEZ, MESMO JÁ GUARDADA (02/10/2026).
   Este comentário dizia que o que já está no aparelho não esmaece, e
   isso só vale para a imagem do pacote. O expo-image faz a transição em
   toda carga, até na que sai do cache da memória: no iOS
   (`UIView.transition`, qualquer que seja a origem), no Android (o alfa
   entre as duas vistas dele) e na web. E ele não diz de graça se a foto
   já está guardada — a única pergunta é `getCachePathAsync`, assíncrona
   e só do disco, e esperar por ela atrasaria justamente a foto. Então
   quem volta a uma clínica vê a foto assentar de novo, em 180 ms, sobre a
   névoa ou o fundo cinza: curto o bastante para ler como a foto chegando,
   e não como a tela piscando.

   ⚠️ COM "REDUZIR MOVIMENTO", A FOTO APARECE DE UMA VEZ. */
export function ImagemQueChega(props: ImageProps) {
  const menos = useMenosMovimento();
  const transicao = props.transition !== undefined
    ? props.transition
    : !menos && vemDeFora(props.source) ? movimento.curto : null;
  return <Image {...props} transition={transicao} />;
}

const DE_FORA = /^https?:\/\//i;

function vemDeFora(fonte: ImageProps['source']): boolean {
  if (fonte == null || typeof fonte === 'number') return false;
  if (typeof fonte === 'string') return DE_FORA.test(fonte);
  if (Array.isArray(fonte)) return (fonte as unknown[]).some((f) => vemDeFora(f as ImageProps['source']));
  const uri = (fonte as { uri?: unknown }).uri;
  return typeof uri === 'string' && DE_FORA.test(uri);
}
