import React from 'react';
import { Platform, StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';
import { movimento } from '../theme';
import { useMenosMovimento, curvaDoMovimento } from './useMenosMovimento';

/* ============================================================
   A ENTRADA EM CASCATA (02/10/2026)

   Fase 1 de docs/superpowers/specs/2026-10-02-motion-design.md. Cada
   bloco de uma coluna entra com um fade e sobe `movimento.sobe` px, em
   `movimento.medio` ms, um `movimento.passo` depois do anterior. Só os
   `movimento.teto` primeiros esperam a vez; do sétimo em diante entram
   junto com o sexto — uma tela comprida não pode levar um segundo para
   terminar de chegar. Sutil, por decisão do dono: cada bloco leva pouco
   mais de um quarto de segundo, e o último começa dois décimos depois do
   primeiro — a tela inteira assenta antes de meio segundo.

   ⚠️⚠️ RODA NA THREAD DE UI, E NÃO NO `Animated` DO RN. É a lição de
   ui/folhas: animação de JavaScript disparada na montagem perde os
   primeiros quadros, porque a montagem é justamente o momento em que a
   thread de JS nunca está livre. O `entering` do Reanimated é disparado
   pelo lado nativo quando a caixa nasce, e não precisa de mais nada do
   JavaScript depois do commit.

   ⚠️ É ENTRADA, E SÓ ENTRADA. Quem anima é o bloco que existe no desenho
   em que a tela monta. O que aparece depois — um aviso, o resultado de um
   filtro, a seção que nasce com a segunda pesagem — simplesmente aparece:
   cascata no meio do uso lê como atraso, e não como chegada. Cada bloco
   decide UMA VEZ, ao nascer, e a decisão não muda mais (ver `useEntrada`).

   ⚠️ SEM `exiting`. Quem leva a tela embora é a rota, que desliza; um
   bloco saindo por conta própria disputaria com ela.

   ⚠️ NUNCA EM ITEM DE LINHA OU DE FLEX. A cascata põe uma caixa em volta
   de cada bloco. Numa coluna ela é invisível — estica na largura toda, e
   o `gap` conta a caixa como contava o bloco —, mas em volta de um item de
   linha, de um `flex: 1` ou de algo em `absolute` ela roubaria o lugar
   dele. Por isso as três peças que a usam (TelaInterna, FolhaDeHabito e
   Screen) são colunas, e por isso o filho com `position: 'absolute'`,
   `flex`, `flexGrow` ou `zIndex` no próprio estilo passa sem caixa — é o
   que deixa a imagem e o véu de um hero (`absoluteFill`) parados enquanto
   o texto em cima deles chega. Não entra em `Rolagem`: ela também é tira
   horizontal e carrossel.

   ⚠️ FRAGMENTO É ACHATADO UM NÍVEL. `{ligada ? <>A B</> : <>C D</>}` são
   dois blocos, e não um — é como a aba Cuidado monta as suas duas
   versões. As chaves saem de `Children.toArray` (posição ou `key` de quem
   escreveu) e, dentro do fragmento, levam a chave dele na frente: são
   estáveis de um desenho para o outro, e nenhum bloco remonta por isso.

   ⚠️ "REDUZIR MOVIMENTO" LIGADO: nenhuma caixa, nenhuma animação. Os
   filhos saem como sairiam sem a cascata.
   ============================================================ */

/* ------------------------------------------------------------------ */
/* O PORTÃO DA ENTRADA

   Aberto só no desenho em que a tela monta. Cada bloco pergunta a ele uma
   vez, ao nascer; quem nasce depois encontra fechado.

   ⚠️ É UM OBJETO MUDADO À MÃO, e não estado: fechar o portão não pode
   redesenhar a tela. Um `setState` aqui faria a Home inteira desenhar de
   novo logo depois de montar, no meio da própria entrada, só para avisar
   blocos que já decidiram. */
export type Entrada = { aberta: boolean };

/* ⚠️⚠️ UMA VEZ POR SESSÃO NAS ABAS — e a marca mora no módulo, não no
   estado guardado.

   As abas ficam montadas quando a pessoa vai e volta, então voltar a uma
   aba já não repetiria a entrada. Mas a árvore inteira é remontada quando
   o idioma ou o modo fingido mudam (a chave da `Moldura`, em
   app/_layout), e aí as quatro abas nasceriam de novo — com a cascata
   toda outra vez, no meio de um ajuste. A marca de módulo vive enquanto o
   aplicativo está aberto e morre com ele: é exatamente a sessão.

   Não vai para o store porque não é dado da pessoa: guardada no diário,
   a entrada nunca mais tocaria, nem na próxima vez que ela abrisse o
   aplicativo. */
const jaEntraram = new Set<string>();

/* ⚠️ O PEDIDO DE AGORA, E NÃO O DA ABERTURA. A entrada decide no primeiro
   desenho, antes de qualquer efeito — e o `useReducedMotion` do Reanimated
   é o valor de quando o aplicativo abriu. Quem ligasse o "reduzir
   movimento" com o aplicativo aberto continuaria vendo cada tela nova
   chegar em cascata. `useMenosMovimento` já nasce com a última resposta do
   sistema quando ela existe (a guarda morava aqui e subiu para lá, para
   valer em todas as peças — ver ui/useMenosMovimento). */

/* ⚠️ A ÁRVORE REMONTADA NÃO REPETE A ENTRADA (02/10/2026, achado da
   revisão). Trocar o idioma ou o modo fingido remonta tudo (a chave da
   `Moldura`, em app/_layout) — e a tela que estava aberta, o Perfil por
   exemplo, nascia de novo e tocava a cascata inteira enquanto a folha do
   idioma ainda descia. As abas já tinham a marca de sessão; as outras
   telas não têm nome. Então o _layout segura as entradas por um instante
   quando a chave muda, antes de a árvore nova desenhar. */
let seguradasAte = 0;
export const segurarEntradas = (ms = 1000) => { seguradasAte = Date.now() + ms; };

/** O portão de uma tela. Com `umaVezPorSessao`, a tela de mesmo nome só
    ganha entrada na primeira montagem desde que o aplicativo abriu. */
export function useEntrada(umaVezPorSessao?: string): Entrada {
  const menos = useMenosMovimento();
  const [entrada] = React.useState<Entrada>(() => ({
    aberta: !menos && Date.now() > seguradasAte && !(umaVezPorSessao && jaEntraram.has(umaVezPorSessao)),
  }));
  React.useEffect(() => {
    entrada.aberta = false;
    if (!umaVezPorSessao) return;
    /* ⚠️ A MARCA SÓ DEPOIS QUE A ENTRADA TEVE TEMPO DE TOCAR (02/10/2026,
       achado da revisão). Num aplicativo novo, a Home monta no primeiro
       desenho e o portão das boas-vindas manda para o cadastro logo em
       seguida — e a marca gasta ali, numa Home que ninguém viu, deixava a
       primeira Home de verdade sem entrada na sessão inteira. Uma montagem
       que sai antes do fim da cascata não conta. */
    const t = setTimeout(() => jaEntraram.add(umaVezPorSessao),
      (movimento.teto - 1) * movimento.passo + movimento.medio);
    return () => clearTimeout(t);
  }, [entrada, umaVezPorSessao]);
  return entrada;
}

/* ------------------------------------------------------------------ */
/* A ANIMAÇÃO, uma por vez da fila — montadas uma vez, fora dos
   componentes, como a documentação do Reanimated pede.

   `FadeInDown` é o fade que vem de baixo; a distância dele é 25 px, e
   aqui é a do token.

   ⚠️ `ReduceMotion.Never`, E NÃO O PADRÃO (02/10/2026, achado da
   revisão). O padrão do Reanimated (`System`) lê o pedido do sistema uma
   vez só, na abertura do aplicativo: quem abrisse com o "reduzir
   movimento" ligado e o desligasse depois continuaria sem entrada nenhuma
   no aparelho até reiniciar. Quem decide é o portão, com o valor ao vivo
   de `useMenosMovimento` — com o pedido ligado, nenhuma caixa animada nem
   chega a nascer. */
const ENTRADAS = Array.from({ length: movimento.teto }, (_, vez) =>
  FadeInDown
    .duration(movimento.medio)
    .delay(vez * movimento.passo)
    .easing(curvaDoMovimento)
    .withInitialValues({ translateY: movimento.sobe })
    .reduceMotion(ReduceMotion.Never),
);

/* ⚠️⚠️ NA WEB, CSS — E NÃO O `entering` DO REANIMATED. Dois motivos,
   lidos no código dele (layoutReanimation/web):

   · com `withInitialValues` a animação vira um keyframe próprio, e a
     limpeza agendada para ~5× a duração chama `setElementPosition`, que
     põe a caixa em `position: absolute` com a altura congelada. A coluna
     perderia a altura dos blocos e a rolagem encolheria;
   · a curva como função (`curvaDoMovimento`) não tem nome de CSS: ele
     avisa no console e cai para linear.

   Então a web anima pelo `animationKeyframes` do react-native-web, com a
   mesma curva escrita como cubic-bezier (o out-cubic) — e o navegador
   compõe opacidade e transform fora da thread principal, que é o mesmo
   motivo de a entrada nativa morar no Reanimated.

   ⚠️ E A CLASSE SAI DEPOIS QUE A ENTRADA ACABA. Na web a aba escondida e a
   tela de baixo da pilha ficam em `display: none`, e o navegador REINICIA
   a animação de CSS de um elemento que volta a aparecer — sem isto, a
   cascata tocaria toda vez que a pessoa voltasse a uma aba. */
const CURVA_CSS = movimento.curvaCss;
const NA_WEB: Record<string, any> | null = Platform.OS === 'web'
  ? StyleSheet.create({
    entra: {
      animationKeyframes: [{
        from: { opacity: 0, transform: `translateY(${movimento.sobe}px)` },
        to: { opacity: 1, transform: 'translateY(0px)' },
      }],
      animationDuration: `${movimento.medio}ms`,
      animationTimingFunction: CURVA_CSS,
      /* durante a espera da vez, o primeiro quadro — e não o bloco pronto */
      animationFillMode: 'backwards',
    },
    ...Object.fromEntries(Array.from({ length: movimento.teto }, (_, vez) => [
      `vez${vez}`, { animationDelay: `${vez * movimento.passo}ms` },
    ])),
  } as any)
  : null;

/* ------------------------------------------------------------------ */
/* UM BLOCO QUE ENTRA — a caixa em volta de um filho da coluna.

   As abas o usam à mão, bloco a bloco, porque o alto delas não é uma
   coluna só: a aurora e o painel são palco, e ficam parados (ver as abas);
   quem entra é o que mora em cima deles. */
export function Entra({ entrada, ordem, vao = 0, children }: {
  entrada: Entrada;
  /** a posição na fila; do `teto` em diante, todos entram com o último que esperou */
  ordem: number;
  /** o `gap` da coluna em volta — ver "O VÃO DO gap", abaixo */
  vao?: number;
  children: React.ReactNode;
}) {
  /* Decidido uma vez, ao nascer — ver "É ENTRADA, E SÓ ENTRADA". */
  const [anima] = React.useState(() => entrada.aberta);
  const [vez] = React.useState(() => Math.min(Math.max(ordem, 0), movimento.teto - 1));
  const caixa = React.useRef<any>(null);

  /* ⚠️ O VÃO DO `gap`. Um filho que não desenha nada — o BlocoDaConta sem
     conta ligada, em app/dados — não existia para o `gap` da coluna; com a
     caixa em volta, ele vira um item vazio e o vão conta duas vezes. A
     caixa se olha antes do primeiro quadro (o `useLayoutEffect` roda antes
     de pintar, na nova arquitetura e na web) e, sem filho nenhum dentro,
     devolve o vão com uma margem negativa. Depois, o `onLayout` acompanha:
     se o filho passar a desenhar, a margem sai.

     ⚠️ VAZIA É SEM NÓ NENHUM, E NÃO ALTURA ZERO. Um View vazio desenhado
     pelo filho — o pé do detalhe de um marcador, em app/exames — já
     ocupava o vão antes da caixa existir, e tem de continuar ocupando: a
     margem ali tiraria 26 px do fim da tela. Quem diz se há nó é o
     `childNodes`, da web e das refs da nova arquitetura (RN 0.82+). */
  const [vazio, setVazio] = React.useState(false);
  React.useLayoutEffect(() => {
    if (!anima || !vao) return;
    if (semNo(caixa.current)) setVazio(true);
  }, [anima, vao]);

  /* Só na web: tira a classe da animação quando a entrada acabou — ver
     "E A CLASSE SAI". A folga é uma entrada inteira, para um quadro
     atrasado nunca cortar o fim da curva. */
  const [entrou, setEntrou] = React.useState(false);
  React.useEffect(() => {
    if (!anima || Platform.OS !== 'web') return;
    const t = setTimeout(() => setEntrou(true), vez * movimento.passo + 2 * movimento.medio);
    return () => clearTimeout(t);
  }, [anima, vez]);

  if (!anima) return <>{children}</>;

  const medir = vao
    ? (e: LayoutChangeEvent) => {
      const v = e.nativeEvent.layout.height === 0 && semNo(caixa.current);
      setVazio((antes) => (antes === v ? antes : v));
    }
    : undefined;
  const devolveOVao = vazio ? { marginTop: -vao } : null;

  if (NA_WEB) {
    return (
      <View
        ref={caixa}
        onLayout={medir}
        style={[entrou ? null : NA_WEB.entra, entrou ? null : NA_WEB[`vez${vez}`], devolveOVao]}
      >
        {children}
      </View>
    );
  }
  return (
    <Animated.View ref={caixa} onLayout={medir} entering={ENTRADAS[vez]} style={devolveOVao}>
      {children}
    </Animated.View>
  );
}

/* A caixa sem nada dentro — ver "VAZIA É SEM NÓ NENHUM". Sem `childNodes`
   (a arquitetura antiga) não se sabe, e na dúvida o vão fica como está. */
function semNo(caixa: { childNodes?: { length: number } } | null): boolean {
  return caixa?.childNodes != null && caixa.childNodes.length === 0;
}

/* ------------------------------------------------------------------ */
/* A CASCATA — os filhos de uma coluna, cada um na sua vez. */
export function Cascata({ children, entrada, desde = 0, vao = 0 }: {
  children: React.ReactNode;
  /** o portão de quem monta a tela (as abas); sem ele, a cascata abre o próprio */
  entrada?: Entrada;
  /** a vez do primeiro bloco, quando outros blocos da mesma tela vieram antes */
  desde?: number;
  /** o `gap` da coluna — ver "O VÃO DO gap", no Entra */
  vao?: number;
}) {
  const propria = useEntrada();
  const portao = entrada ?? propria;
  /* A fila conta só quem entra: o fundo em `absolute` de um hero passa
     parado e não gasta a vez de ninguém. */
  let fila = desde;
  return (
    <>
      {blocosDe(children).map(({ chave, no }) => {
        if (!React.isValidElement(no) || !cabeNumaCaixa(no)) {
          return <React.Fragment key={chave}>{no}</React.Fragment>;
        }
        const ordem = fila++;
        return <Entra key={chave} entrada={portao} ordem={ordem} vao={vao}>{no}</Entra>;
      })}
    </>
  );
}

/* Os blocos, com um nível de fragmento achatado e a chave de cada um. */
function blocosDe(children: React.ReactNode): { chave: string; no: React.ReactNode }[] {
  return React.Children.toArray(children).flatMap((filho, i) => {
    const chave = React.isValidElement(filho) && filho.key != null ? String(filho.key) : `.${i}`;
    if (React.isValidElement(filho) && filho.type === React.Fragment) {
      return React.Children.toArray((filho.props as { children?: React.ReactNode }).children).map((neto, j) => ({
        chave: `${chave}/${React.isValidElement(neto) && neto.key != null ? String(neto.key) : `.${j}`}`,
        no: neto,
      }));
    }
    return [{ chave, no: filho }];
  });
}

/* O que não pode ganhar caixa em volta — ver "NUNCA EM ITEM DE LINHA OU
   DE FLEX". Estilo em função (o do Pressable) não dá para ler antes do
   toque, e passa como bloco comum. */
function cabeNumaCaixa(el: React.ReactElement): boolean {
  const estilo = (el.props as { style?: unknown }).style;
  if (!estilo || typeof estilo === 'function') return true;
  const s = StyleSheet.flatten(estilo as StyleProp<ViewStyle>) as ViewStyle | undefined;
  if (!s) return true;
  return s.position !== 'absolute'
    && !(Number(s.flex) > 0)
    && !(Number(s.flexGrow) > 0)
    && s.zIndex == null;
}
