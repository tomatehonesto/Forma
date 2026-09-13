import React, { useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet, TextInput, StyleProp, ViewStyle } from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Txt, Row } from './kit';
import { Icon } from './Icon';
import { AreaCurve } from './charts';
import { useTheme } from './useTheme';
import { ty, font, radius, shadowCard } from '../theme';

/* ============================================================
   TELAS INTERNAS — o vocabulário das telas de dentro

   As abas (Home, Jornada, Cuidado, Insights) são painéis: hero sangrado,
   cards grandes, raio 24/32, uma leitura por bloco. Elas respondem "como
   eu vou".

   As telas internas respondem outra coisa — "me mostra tudo" e "deixa eu
   corrigir". São listas densas, formulários e históricos, e por isso têm
   um desenho próprio:

     · barra de navegação fixa, com título centralizado e uma ação à direita
     · titulão + frase de abertura, que dizem do que a tela trata
     · cartões pequenos, raio 18, empilhados em lista
     · rodapé fixo quando existe UMA ação principal

   Nada aqui inventa cor: tudo sai de theme.ts. O que muda em relação ao
   kit das abas é a DENSIDADE, não a paleta — é a mesma marca vista de
   perto.
   ============================================================ */

const PAD = 16;

/* ------------------------------------------------------------------ */
/* Casca — barra fixa no topo, conteúdo rolando por baixo, rodapé opcional
   colado na base. A barra só ganha fio depois que a rolagem começa: parada
   no topo ela é a mesma superfície do fundo, e um fio ali dividiria a tela
   em duas sem ter o que separar. */
export function TelaInterna({
  titulo, acao, iconeAcao, onAcao, fechar, onVoltar, rodape, children,
}: {
  titulo: string;
  /** rótulo curto da ação à direita ("Nova", "Salvar") */
  acao?: string;
  /** ícone no lugar do rótulo, quando a ação é um gesto e não uma palavra */
  iconeAcao?: string;
  onAcao?: () => void;
  /** troca o "‹" por "✕" — fluxos de captura se fecham, não voltam */
  fechar?: boolean;
  /* Nem todo voltar sai da tela. Onde uma tela guarda dois estados —
     a lista de exames e o detalhe de um marcador —, voltar significa
     desfazer a seleção, não desempilhar a rota. Sem isto a pessoa sairia
     de Exames inteiro ao fechar um marcador. */
  onVoltar?: () => void;
  rodape?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [rolou, setRolou] = useState(false);
  const temAcao = !!onAcao && (!!acao || !!iconeAcao);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <View
        style={{
          paddingTop: insets.top,
          backgroundColor: c.bg,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: rolou ? c.line : 'transparent',
          zIndex: 20,
        }}
      >
        <Row style={{ minHeight: 48, paddingHorizontal: 12, paddingTop: 6, paddingBottom: 8 }}>
          <Pressable
            onPress={onVoltar ?? (() => router.back())}
            hitSlop={8}
            style={({ pressed }) => [{
              width: 36, height: 36, borderRadius: radius.md,
              backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center',
              opacity: pressed ? 0.6 : 1,
            }]}
          >
            <Icon name={fechar ? 'x' : 'back'} size={18} color={c.tx} sw={2} />
          </Pressable>

          <Txt v="bodyMed" style={{ flex: 1, textAlign: 'center' }} numberOfLines={1}>{titulo}</Txt>

          {/* Espelha a largura do botão da esquerda mesmo quando não há ação:
              sem isso o título centralizado desliza e a barra fica torta de
              uma tela para outra. */}
          {temAcao ? (
            <Pressable
              onPress={onAcao}
              hitSlop={8}
              style={({ pressed }) => [{ minWidth: 36, alignItems: 'flex-end', paddingHorizontal: 4, opacity: pressed ? 0.6 : 1 }]}
            >
              {iconeAcao
                ? <Icon name={iconeAcao} size={20} color={c.accent} sw={2.2} />
                : <Txt v="label" c={c.accent}>{acao}</Txt>}
            </Pressable>
          ) : <View style={{ width: 36 }} />}
        </Row>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => setRolou(e.nativeEvent.contentOffset.y > 6)}
        contentContainerStyle={{ paddingHorizontal: PAD, paddingTop: 6, paddingBottom: rodape ? 160 : 110, gap: 26 }}
      >
        {children}
      </ScrollView>

      {/* Fundo chapado com um fio no topo. Aqui havia um véu em degradê, do
          transparente até a cor do fundo, para o conteúdo sumir por baixo do
          botão. A intenção era boa e o resultado não: o esmaecimento lia
          como desfoque, como se a faixa fosse vidro embaçado.

          Sem o degradê, porém, o conteúdo passava a ser cortado numa linha
          reta sem explicação. O fio resolve: ele declara que ali começa
          outra superfície, em vez de deixar o corte parecer um defeito. É o
          mesmo fio que a barra de cima ganha quando a rolagem começa. */}
      {rodape ? (
        <View style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          paddingHorizontal: PAD, paddingTop: 14,
          paddingBottom: (insets.bottom || 12) + 14,
          backgroundColor: c.bg, gap: 8,
          borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.line,
        }}>
          {rodape}
        </View>
      ) : null}
    </View>
  );
}

/* Abertura da tela — o que ela é, em uma manchete e uma frase. A barra de
   cima serve para voltar; o titulão é o que se lê. */
export function Titulao({ titulo, lead, unidade }: { titulo: string; lead?: string; unidade?: string }) {
  const { c } = useTheme();
  return (
    <View style={{ paddingHorizontal: 2, marginBottom: -8 }}>
      <Txt v="display" style={{ letterSpacing: -0.6 }}>
        {titulo}
        {unidade ? <Txt v="h2" c={c.tx2}>{` ${unidade}`}</Txt> : null}
      </Txt>
      {lead ? <Txt v="note" c={c.tx2} style={{ marginTop: 7 }}>{lead}</Txt> : null}
    </View>
  );
}

/* Cabeçalho de bloco — título, link opcional e uma linha de contexto. O
   link mora na linha do título porque ele é sobre o bloco inteiro, não
   sobre um item dele. */
export function Bloco({ titulo, link, onLink, nota, children }: {
  titulo?: string; link?: string; onLink?: () => void; nota?: string; children: React.ReactNode;
}) {
  const { c } = useTheme();
  return (
    <View>
      {titulo ? (
        <View style={{ marginBottom: 12 }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
            <Txt v="h2" style={{ flex: 1, letterSpacing: -0.4 }}>{titulo}</Txt>
            {link && onLink ? (
              <Pressable onPress={onLink} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                <Row gap={4}>
                  <Txt v="label" c={c.accent}>{link}</Txt>
                  <Icon name="chev" size={12} color={c.accent} sw={2.2} />
                </Row>
              </Pressable>
            ) : null}
          </Row>
          {nota ? <Txt v="caption" c={c.tx2} style={{ marginTop: 6 }}>{nota}</Txt> : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Selo — o veredito curto ao lado de um valor.

   Três tons, e a diferença entre eles é de NATUREZA, não de intensidade:
     lima    variação que você mediu     "−7,3 kg"
     verde   estado clínico bom          "Na referência"
     neutra  fato sem juízo              "em uso", "passou"

   Não existe selo vermelho aqui, de propósito: nenhuma leitura destas
   telas é uma falha da pessoa. O que precisa de atenção vira Aviso, com
   texto e espaço para explicar. */
export type SeloTom = 'lima' | 'verde' | 'neutra';

export function Selo({ label, tom = 'lima' }: { label: string; tom?: SeloTom }) {
  const { c } = useTheme();
  const par: Record<SeloTom, [string, string]> = {
    lima: [c.limeSoft, c.limeSoftInk],
    verde: [c.okBg, c.ok],
    neutra: [c.bg2, c.tx2],
  };
  const [bg, fg] = par[tom];
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.sm, alignSelf: 'flex-start' }}>
      <Txt v="tag" c={fg} style={{ fontFamily: font.bodyMed }}>{label}</Txt>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Cartão de lista — a superfície branca que agrupa linhas. Os fios entre
   as linhas são inseridos aqui, e não por cada linha: assim a primeira e a
   última nunca deixam um fio sobrando na borda do cartão. */
export function Cartao({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  const itens = React.Children.toArray(children).filter(Boolean);
  return (
    <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, overflow: 'hidden' }, shadowCard(c), style]}>
      {itens.map((ch, i) => (
        <View key={i}>
          {i > 0 ? <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.line, marginLeft: PAD }} /> : null}
          {ch}
        </View>
      ))}
    </View>
  );
}

/* Linha de cartão — ícone opcional, título, sub, e um fecho à direita que
   pode ser selo, chevron ou nada, quando a linha é só leitura. */
export function Linha({ ic, titulo, sub, selo, seloTom, seta, onPress }: {
  ic?: string; titulo: string; sub?: string;
  selo?: string; seloTom?: SeloTom; seta?: boolean; onPress?: () => void;
}) {
  const { c } = useTheme();
  const mostraSeta = seta ?? !!onPress;
  const corpo = (
    <Row style={{ paddingHorizontal: PAD, paddingVertical: 14, gap: 12 }}>
      {ic ? (
        <View style={{ width: 34, height: 34, borderRadius: radius.md, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={ic} size={17} color={c.accent} sw={1.9} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Txt v="body">{titulo}</Txt>
        {sub ? <Txt v="caption" c={c.tx2} style={{ marginTop: 2 }}>{sub}</Txt> : null}
      </View>
      {selo ? <Selo label={selo} tom={seloTom} /> : null}
      {mostraSeta ? <Icon name="chev" size={14} color={c.tx4} sw={2} /> : null}
    </Row>
  );
  if (!onPress) return corpo;
  return <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>{corpo}</Pressable>;
}

/* ------------------------------------------------------------------ */
/* Progresso — rótulo, número e barra. É o instrumento mais repetido das
   internas: ciclo da dose, doses da caneta, intensidade de sintoma, meta.
   Barra fina, de 5px: ela acompanha o texto, não lidera o card. */
export function Progresso({ label, valor, pct, nota, cor }: {
  label: string; valor?: string; pct: number; nota?: string; cor?: string;
}) {
  const { c } = useTheme();
  const p = Math.max(0, Math.min(100, pct));
  return (
    <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: PAD, gap: 9 }, shadowCard(c)]}>
      <Row style={{ gap: 9 }}>
        <Txt v="body" style={{ flex: 1 }}>{label}</Txt>
        {valor ? <Txt v="caption" c={c.tx2}>{valor}</Txt> : null}
      </Row>
      <View style={{ height: 5, borderRadius: radius.pill, backgroundColor: c.track, overflow: 'hidden' }}>
        <View style={{ width: `${p}%`, height: '100%', borderRadius: radius.pill, backgroundColor: cor ?? c.accent }} />
      </View>
      {nota ? <Txt v="caption" c={c.tx3}>{nota}</Txt> : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Sanfona — lista de linhas que abrem no lugar.

   Abrir no lugar, em vez de empurrar para outra tela, é a escolha certa
   aqui: o detalhe de uma fase do ciclo ou de uma caneta são três frases, e
   fazer a pessoa navegar para ler três frases cobra caro demais pelo que
   entrega. Quando o detalhe É uma tela inteira — uma semana do tratamento
   —, a linha recebe `onPress`, vira navegação, e a seta aponta para o
   lado em vez de para baixo. */
export function Sanfona({ children }: { children: React.ReactNode }) {
  const { c } = useTheme();
  const itens = React.Children.toArray(children).filter(Boolean);
  return (
    <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, overflow: 'hidden' }, shadowCard(c)]}>
      {itens.map((ch, i) => (
        <View key={i}>
          {i > 0 ? <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.line }} /> : null}
          {ch}
        </View>
      ))}
    </View>
  );
}

export function SanfonaLinha({
  titulo, selo, seloTom, sub, meta, itens, aberta: inicial = false, onPress,
}: {
  titulo: string; selo?: string; seloTom?: SeloTom; sub?: string; meta?: string;
  /** pares rótulo/texto que aparecem quando a linha abre */
  itens?: [string, string][];
  aberta?: boolean; onPress?: () => void;
}) {
  const { c } = useTheme();
  const [aberta, setAberta] = useState(inicial);
  const navega = !!onPress;
  const abriu = !navega && aberta && !!itens?.length;

  return (
    <Pressable
      onPress={() => (navega ? onPress!() : setAberta((a) => !a))}
      style={({ pressed }) => [{ paddingHorizontal: PAD, paddingVertical: 14, opacity: pressed ? 0.7 : 1 }]}
    >
      <Row style={{ gap: 9 }}>
        <Txt v="bodyMed" style={{ flex: 1, letterSpacing: -0.2 }}>{titulo}</Txt>
        {selo ? <Selo label={selo} tom={seloTom} /> : null}
        <Icon name={navega ? 'chev' : aberta ? 'chevup' : 'chevdown'} size={14} color={c.tx4} sw={2} />
      </Row>
      {sub ? <Txt v="caption" c={c.tx2} style={{ marginTop: 5 }}>{sub}</Txt> : null}
      {meta ? <Txt v="caption" c={c.tx3} style={{ marginTop: 3 }}>{meta}</Txt> : null}

      {abriu ? (
        <View style={{ marginTop: 11, paddingTop: 2, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.line }}>
          {itens!.map(([rot, txt], i) => (
            <Row
              key={rot + i}
              style={{
                alignItems: 'flex-start', gap: 10, paddingVertical: 9,
                borderBottomWidth: i < itens!.length - 1 ? StyleSheet.hairlineWidth : 0,
                borderBottomColor: c.line,
              }}
            >
              <Txt v="caption" style={{ width: 80 }}>{rot}</Txt>
              <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>{txt}</Txt>
            </Row>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* Chips — filtro de uma escolha só, rolando na horizontal. O contador vem
   junto do rótulo e mais fraco: ele informa o tamanho da lista antes do
   toque, sem virar o assunto do chip. */
export function Chips({ itens, valor, onChange }: {
  itens: { id: string; label: string; n?: number }[];
  valor: string; onChange: (id: string) => void;
}) {
  const { c } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -PAD }}
      contentContainerStyle={{ paddingHorizontal: PAD, gap: 7 }}
    >
      {itens.map((it) => {
        const on = it.id === valor;
        return (
          <Pressable
            key={it.id}
            onPress={() => onChange(it.id)}
            style={({ pressed }) => [{
              flexDirection: 'row', alignItems: 'center', gap: 5,
              paddingHorizontal: 13, paddingVertical: 7, borderRadius: radius.pill,
              borderWidth: 1, borderColor: on ? c.tx : c.line,
              backgroundColor: on ? c.tx : c.bg1, opacity: pressed ? 0.7 : 1,
            }]}
          >
            <Txt v="label" c={on ? c.bg1 : c.tx2}>{it.label}</Txt>
            {it.n != null ? <Txt v="label" c={on ? c.bg1 : c.tx3} style={{ opacity: 0.6 }}>{it.n}</Txt> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/* ------------------------------------------------------------------ */
/* Métrica — o cartão pequeno da grade 2×2. Ícone e selo em cima, nome no
   meio, de-onde-para-onde embaixo: o valor atual em destaque e o inicial
   recuado, porque a comparação é o assunto, não o número solto. */
export function Metrica({ ic, selo, seloTom, nome, de, para, onPress }: {
  ic: string; selo?: string; seloTom?: SeloTom; nome: string;
  de?: string; para: string; onPress?: () => void;
}) {
  const { c } = useTheme();
  const corpo = (
    <View style={[{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.card, paddingHorizontal: 14, paddingVertical: 13, gap: 9 }, shadowCard(c)]}>
      <Row style={{ justifyContent: 'space-between', gap: 8 }}>
        <Icon name={ic} size={17} color={c.tx2} sw={1.8} />
        {selo ? <Selo label={selo} tom={seloTom} /> : null}
      </Row>
      <Txt v="bodyMed">{nome}</Txt>
      <Txt v="caption" c={c.tx3}>
        {de ? `${de} › ` : ''}
        <Txt v="title" style={{ fontFamily: font.bodySemi }}>{para}</Txt>
      </Txt>
    </View>
  );
  if (!onPress) return corpo;
  return <Pressable onPress={onPress} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.9 : 1 }]}>{corpo}</Pressable>;
}

/* ------------------------------------------------------------------ */
/* Card de curva — texto em cima, curva sangrando até as três bordas de
   baixo. É o mesmo desenho do card de evolução da Home, e agora a única
   implementação dele: Peso, Medidas, Evolução, Exames e Sinais vitais
   tinham cinco cópias quase idênticas, que já começavam a divergir.

   A curva responde ao dedo. Deslizando, o card mostra o valor daquele
   ponto e quando ele foi registrado — e mostra no CABEÇALHO, não num balão
   junto do toque. Num gráfico de celular a mão cobre metade do card, então
   um balão sob o dedo é exatamente o lugar onde a leitura não pode estar.
   No cabeçalho, ela fica acima da mão e no lugar onde os olhos já estavam.

   Ao soltar, o cabeçalho volta ao resumo. Nada fica preso: a leitura é do
   gesto, não um estado que a pessoa precise desfazer. */
export function CardCurva({
  nome, sub, valor, unidade, pontos, id, altura = 100, onPress,
}: {
  nome: string;
  /** o que o cabeçalho diz quando ninguém está deslizando */
  sub: string; valor: string; unidade?: string;
  /** série em ordem cronológica, com a leitura de cada ponto pronta */
  pontos: { v: number; rotulo: string; quando: string }[];
  id: string; altura?: number; onPress?: () => void;
}) {
  const { c } = useTheme();
  const navegacao = useNavigation();
  const [i, setI] = useState<number | null>(null);

  /* O arrasto horizontal na curva disputa com o gesto NATIVO de voltar —
     aquele que puxa a tela pela borda. Ele roda fora do sistema de
     responder do JS, então negar o toque aqui dentro não o alcança: a
     pessoa desliza para ler e a tela começa a sair pelo lado.

     A saída é desligar o gesto da tela enquanto o dedo está no gráfico e
     devolvê-lo ao soltar. O ref evita chamar setOptions a cada pixel de
     movimento — só nas duas transições que importam. */
  const travado = React.useRef(false);
  const trava = (quer: boolean) => {
    if (quer === travado.current) return;
    travado.current = quer;
    navegacao.setOptions({ gestureEnabled: !quer } as any);
  };
  const desliza = (idx: number | null) => { setI(idx); trava(idx != null); };

  /* Se a tela sair no meio de um arrasto — um toque que navega, um back de
     hardware —, o gesto voltaria destravado só na próxima montagem. */
  React.useEffect(() => () => {
    if (travado.current) navegacao.setOptions({ gestureEnabled: true } as any);
  }, [navegacao]);

  const curva = React.useMemo(() => {
    if (pontos.length < 2) return [];
    const vs = pontos.map((p) => p.v);
    const lo = Math.min(...vs), hi = Math.max(...vs), span = hi - lo || 1;
    return pontos.map((p, k) => ({ x: k / (pontos.length - 1), y: (p.v - lo) / span }));
  }, [pontos]);

  const ativo = i != null ? pontos[i] : null;

  const corpo = (
    <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, overflow: 'hidden' }, shadowCard(c)]}>
      <Row style={{ paddingHorizontal: PAD, paddingTop: PAD, paddingBottom: 12, alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Txt v="body">{nome}</Txt>
          <Txt v="note" c={ativo ? c.accent : c.tx3} style={{ marginTop: 2 }} numberOfLines={1}>
            {ativo ? ativo.quando : sub}
          </Txt>
        </View>
        <Txt v="metric">
          {ativo ? ativo.rotulo : valor}
          {unidade ? <Txt v="label" c={c.tx3}>{` ${unidade}`}</Txt> : null}
        </Txt>
      </Row>

      {curva.length > 1 ? (
        <AreaCurve
          pts={curva} height={altura} padT={6} padB={0} padX={0} strokeW={2}
          strokeFrom={c.limeDim} strokeTo={c.limeDim} dashed={false} id={id}
          onScrub={desliza} scrub={i}
        />
      ) : (
        <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: PAD, paddingBottom: 20 }}>
          Um registro só não desenha uma curva.
        </Txt>
      )}
    </View>
  );

  if (!onPress) return corpo;
  /* O toque na curva é do scrub, não da navegação: quem arrasta quer ler,
     não sair da tela. Por isso o Pressable envolve o card mas a curva fica
     com o responder — tocar no cabeçalho navega, tocar no gráfico lê. */
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
      {corpo}
    </Pressable>
  );
}

/* Grade de dois — usada pelas métricas e pelos resumos de semana. Ímpar na
   última linha fica alinhado à esquerda, com o vão à direita: esticar o
   último card para a largura toda o promoveria sem motivo. */
export function Grade2({ children }: { children: React.ReactNode }) {
  const itens = React.Children.toArray(children).filter(Boolean);
  const linhas: React.ReactNode[][] = [];
  for (let i = 0; i < itens.length; i += 2) linhas.push(itens.slice(i, i + 2));
  return (
    <View style={{ gap: 10 }}>
      {linhas.map((l, i) => (
        <Row key={i} style={{ gap: 10, alignItems: 'stretch' }}>
          {l}
          {l.length === 1 ? <View style={{ flex: 1 }} /> : null}
        </Row>
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Aviso — a nota de rodapé com peso de card. Existe para o que precisa ser
   dito mas não é dado: o disclaimer clínico, o lembrete de que uma semana
   vazia não é falha, o alerta de que apagar tira o registro do relatório. */
/* Aviso — o que a tela diz depois de ler a resposta. Três formas, e cada
   uma existe por causa de onde o aviso nasce.

   `dentro` tira a casca de cartão e deixa só o conteúdo. É a forma que
   vai dentro da SAIA do Campo — a aba tingida que sai por baixo do
   cartão —, e por isso não traz fundo nem fio: quem separa já é a saia.
   Como cartão solto ele virava mais um bloco na pilha, à mesma distância
   de todos e ligado a nenhum.

   `destaque` é o contrário: o aviso que não pertence a campo nenhum
   porque nasce de vários ao mesmo tempo. Cartão tingido, sem sombra — ele
   não é mais um bloco do formulário, é o app falando sobre o dia inteiro.

   Nas duas, o ícone sobe para cima do texto e o texto ocupa a largura
   toda. Ao lado, ele espremia a coluna e o aviso ficava com cara de nota
   de rodapé; em cima, ele abre o bloco, como um selo. A forma padrão —
   cartão com ícone à esquerda — continua para as outras telas, que usam o
   Aviso como linha de apoio e não como interrupção. */
export function Aviso({ ic = 'info', titulo, texto, dentro, destaque, children }: {
  ic?: string; titulo?: string; texto?: string;
  dentro?: boolean; destaque?: boolean; children?: React.ReactNode;
}) {
  const { c } = useTheme();
  const empilha = dentro || destaque;

  const texto2 = (
    <View style={{ flex: 1 }}>
      {titulo ? <Txt v="bodyMed" style={{ marginBottom: 2 }}>{titulo}</Txt> : null}
      {texto ? <Txt v="caption" c={c.tx2}>{texto}</Txt> : null}
      {children}
    </View>
  );

  if (empilha) {
    return (
      <View style={[
        { gap: 9 },
        destaque && { backgroundColor: c.accentWeak, borderRadius: radius.card, padding: PAD },
      ]}>
        <View style={{ alignSelf: 'flex-start' }}>
          <Icon name={ic} size={18} color={c.accent} sw={1.9} />
        </View>
        {texto2}
      </View>
    );
  }

  return (
    <Row style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: PAD, gap: 11, alignItems: 'flex-start' }, shadowCard(c)]}>
      <Icon name={ic} size={18} color={c.accent} sw={1.9} />
      {texto2}
    </Row>
  );
}

/* ------------------------------------------------------------------ */
/* Campo — o invólucro de um controle de formulário: rótulo em caixa alta,
   controle, e uma linha de ajuda. A ajuda não é decorativa: é onde o app
   diz por que a pergunta existe e o que a resposta muda. */
/* Campo — rótulo, conteúdo e uma linha de ajuda, dentro de um cartão.

   `nu` tira o cartão e deixa só o rótulo e o conteúdo. Serve para o campo
   que É uma escolha e não um formulário: uma fileira de chips dentro de um
   cartão parece um painel de controle montado por quem gosta de painéis;
   solta na tela, ela é só a pergunta e as respostas.

   `saia` é uma aba tingida que sai POR BAIXO do cartão, presa a ele: ela
   sobe o tanto do raio e some atrás do cartão, então as duas peças leem
   como uma coisa só com um degrau. Serve para o que o app tem a dizer
   sobre a resposta — dentro do cartão o recado disputava espaço com o
   controle, e solto embaixo virava outro bloco da pilha. Mais estreita que
   o cartão de propósito: aba que sai de baixo é aba, aba do mesmo tamanho
   é outro cartão. */
export function Campo({ rotulo, ajuda, nu, saia, children }: {
  rotulo?: string; ajuda?: string; nu?: boolean; saia?: React.ReactNode; children: React.ReactNode;
}) {
  const { c } = useTheme();

  const cartao = (
    <View style={nu
      ? { gap: 11, paddingHorizontal: 2 }
      : [{ backgroundColor: c.bg1, borderRadius: radius.card, padding: PAD, gap: 11 }, shadowCard(c)]}>
      {rotulo ? <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1.2 }}>{rotulo.toUpperCase()}</Txt> : null}
      {children}
      {ajuda ? <Txt v="caption" c={c.tx3}>{ajuda}</Txt> : null}
    </View>
  );

  if (!saia || nu) return cartao;

  return (
    <View>
      {/* O cartão por cima, e a saia por baixo: é o cartão que esconde o
          topo dela, então ele precisa vir depois na pilha de desenho. */}
      <View style={{ zIndex: 2 }}>{cartao}</View>
      <View style={{
        zIndex: 1,
        marginTop: -radius.card, marginHorizontal: 10,
        paddingTop: radius.card + 12, paddingHorizontal: PAD, paddingBottom: 14,
        backgroundColor: c.accentWeak,
        borderBottomLeftRadius: radius.card, borderBottomRightRadius: radius.card,
      }}>
        {saia}
      </View>
    </View>
  );
}

/* Opções — botões que embrulham em várias linhas. Servem para escolha
   única e para múltipla; quem decide qual das duas é a tela. */
export function Opcoes({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{children}</View>;
}

export function Opc({ label, on, onPress }: { label: string; on?: boolean; onPress?: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{
        paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.md,
        borderWidth: 1, borderColor: on ? c.accent : c.line,
        backgroundColor: on ? c.accentWeak : c.bg1, opacity: pressed ? 0.7 : 1,
      }]}
    >
      {/* O check entra junto da cor. Só a lavagem azul pedia comparação
          com os vizinhos para se ler como "marcado"; o check diz sozinho,
          sem precisar do resto da lista ao lado. */}
      <Row gap={7}>
        {on ? <Icon name="check" size={14} color={c.accent} sw={2.6} /> : null}
        <Txt v="label" c={on ? c.accent : c.tx2}>{label}</Txt>
      </Row>
    </Pressable>
  );
}

/* Stepper — menos, valor grande, mais. Para peso, dose e medidas: são
   números que a pessoa ajusta em passos conhecidos, e abrir teclado
   numérico para isso erra mais do que acerta (75,1 vira 751 com um toque
   a mais).

   `onDigitar` abre a exceção: o passo resolve a variação de um dia para o
   outro, mas quem voltou de uma semana fora não vai tocar vinte vezes. Com
   ele o número do meio vira campo; sem ele, texto. A dose não recebe —
   ela é uma escada fechada, e digitar ali inventaria valor fora dela. */
export function Stepper({ valor, unidade, onMenos, onMais, onDigitar }: {
  valor: string; unidade: string; onMenos: () => void; onMais: () => void;
  onDigitar?: (v: string) => void;
}) {
  const { c } = useTheme();
  const caixa = {
    width: 44, height: 44, borderRadius: radius.md, borderWidth: 1, borderColor: c.line,
    backgroundColor: c.bg1, alignItems: 'center' as const, justifyContent: 'center' as const,
  };
  return (
    <Row style={{ gap: 14 }}>
      <Pressable onPress={onMenos} style={({ pressed }) => [caixa, { opacity: pressed ? 0.6 : 1 }]}>
        <View style={{ width: 16, height: 2, borderRadius: 1, backgroundColor: c.tx }} />
      </Pressable>
      <Row style={{ flex: 1, justifyContent: 'center', alignItems: 'baseline' }}>
        {onDigitar ? (
          <TextInput
            value={valor}
            onChangeText={onDigitar}
            keyboardType="decimal-pad"
            selectTextOnFocus
            style={[ty.metric, { color: c.tx, letterSpacing: -1, textAlign: 'right', minWidth: 92, paddingVertical: 0 }]}
          />
        ) : (
          <Txt v="metric" style={{ letterSpacing: -1 }}>{valor}</Txt>
        )}
        <Txt v="label" c={c.tx2}>{` ${unidade}`}</Txt>
      </Row>
      <Pressable onPress={onMais} style={({ pressed }) => [caixa, { opacity: pressed ? 0.6 : 1 }]}>
        <Icon name="plus" size={20} color={c.tx} sw={2.2} />
      </Pressable>
    </Row>
  );
}

/* Escala — a fileira de 1 a 5, ou de 2 a 10.

   `suave` é para intensidade de sintoma: marcar "5 de náusea" em azul
   chapado premia o pior dia como se fosse conquista. Ali o selecionado é
   uma lavagem — está marcado, não celebrado. Energia, que é o quanto você
   TEM, segue em azul cheio. */
/* Escala — slider com paradas, uma por valor, e a legenda como manchete.

   O slider é o mesmo de "quanto você bebeu", com passo: ele não para em
   qualquer lugar, só nas cinco posições que existem. Escala com passo dá
   o gesto contínuo sem pedir precisão — não há como errar por um fio.

   A LEGENDA é a resposta, e por isso vem grande e em cima. O número
   sozinho pede que a pessoa invente a régua ("3 de energia é bom?") e
   cada dia acaba respondido com uma régua diferente da do dia anterior,
   o que estraga justamente a série que o app vai ler depois. Embaixo, as
   duas pontas dizem para onde a régua cresce, antes do primeiro toque.

   NÃO RESPONDIDO é um estado de verdade, e é o mais importante desta
   tela: foi confundir ausência com zero que fez os registros mentirem.
   Como todo slider tem o polegar em algum lugar, aqui o vazio se mostra
   pela MATÉRIA: o polegar vazio é da cor do próprio cartão, sobre um
   trilho de um tom só — vidro, não peça. Um polegar cinza chapado era um
   controle como outro qualquer, e um controle posto em algum lugar parece
   um valor escolhido. Cheio, ele vira azul sólido, e a diferença entre
   "não respondi" e "respondi" deixa de depender de ler a manchete.

   O trilho também perde a divisão enquanto não há resposta: dois tons
   desenham uma parte preenchida, e não há o que preencher antes de a
   pessoa escolher. O polegar espera no meio porque é de onde toda
   resposta fica mais perto.

   `onSlidingComplete` existe junto do `onValueChange` de propósito:
   quem quer responder o valor do meio, e toca exatamente onde o polegar
   já está, não muda valor nenhum — sem o segundo evento esse toque não
   registraria nada e o campo continuaria em branco. */
export function Escala({ valores, valor, onChange, onLimpar, suave, legendas }: {
  valores: (string | number)[]; valor: string | number | null;
  onChange: (v: string | number) => void; suave?: boolean;
  /** o que cada valor quer dizer, na mesma ordem de `valores` */
  legendas?: string[];
  /* Desfaz a resposta. Num slider, encostar sem querer já responde — e
     sem uma saída a pessoa fica com um número que ela não quis dar,
     obrigada a escolher o "menos errado". Só aparece quando há o que
     limpar, porque antes disso não há nada a desfazer. */
  onLimpar?: () => void;
}) {
  const { c } = useTheme();
  const i = valores.findIndex((v) => v === valor);
  const respondido = i >= 0;
  const meio = Math.floor((valores.length - 1) / 2);
  const escolhe = (n: number) => {
    const idx = Math.max(0, Math.min(valores.length - 1, Math.round(n)));
    if (valores[idx] !== valor) onChange(valores[idx]);
  };

  const manchete = respondido
    ? (legendas?.[i] ?? String(valores[i]))
    : 'Ainda não respondi';

  return (
    <View>
      <Row style={{ alignItems: 'center' }}>
        <Txt v="title" c={respondido ? c.tx : c.tx3} style={{ flex: 1 }} numberOfLines={1}>{manchete}</Txt>
        {respondido && onLimpar ? (
          <Pressable onPress={onLimpar} hitSlop={10} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
            <View style={{ backgroundColor: c.bg2, borderRadius: radius.pill, paddingHorizontal: 11, paddingVertical: 4 }}>
              <Txt v="tag" c={c.tx3}>Limpar</Txt>
            </View>
          </Pressable>
        ) : null}
      </Row>

      <Slider
        value={respondido ? i : meio}
        minimumValue={0}
        maximumValue={valores.length - 1}
        step={1}
        tapToSeek
        onValueChange={escolhe}
        onSlidingComplete={escolhe}
        minimumTrackTintColor={respondido ? (suave ? c.accentLine : c.accent) : c.bg2}
        maximumTrackTintColor={c.bg2}
        thumbTintColor={respondido ? c.accent : c.bg3}
        style={{ marginTop: 8, marginHorizontal: -6 }}
      />

      {legendas ? (
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt v="micro" c={c.tx4}>{legendas[0]}</Txt>
          <Txt v="micro" c={c.tx4}>{legendas[legendas.length - 1]}</Txt>
        </Row>
      ) : null}
    </View>
  );
}

/* Caixa de texto — a única entrada livre das internas. O placeholder faz
   trabalho de copy: diz que é opcional e que ninguém mais lê. */
export function Texto({ valor, onChange, placeholder, linhas = 3 }: {
  valor: string; onChange: (v: string) => void; placeholder?: string; linhas?: number;
}) {
  const { c } = useTheme();
  return (
    <TextInput
      value={valor}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={c.tx4}
      multiline
      textAlignVertical="top"
      style={[ty.body, {
        color: c.tx, backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line,
        borderRadius: radius.md, padding: 13, minHeight: 26 + linhas * 23,
      }]}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Botão — cheio para a ação principal, fantasma para a alternativa,
   perigo para o que não volta atrás. Perigo é branco com tinta vermelha e
   não vermelho chapado: apagar um registro é uma operação legítima, não
   um alarme. */
export function Botao({ label, onPress, tom = 'cheio' }: {
  label: string; onPress?: () => void; tom?: 'cheio' | 'fantasma' | 'perigo';
}) {
  const { c } = useTheme();
  const fundo = tom === 'cheio' ? c.accent : c.bg1;
  const tinta = tom === 'cheio' ? c.accentInk : tom === 'perigo' ? c.cta : c.tx;
  const borda = tom === 'cheio' ? 'transparent' : tom === 'perigo' ? c.ctaLine : c.line;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{
        borderRadius: radius.md + 3, backgroundColor: fundo, borderWidth: 1, borderColor: borda,
        paddingVertical: 16, alignItems: 'center', opacity: pressed ? 0.85 : 1,
      }]}
    >
      <Txt v="bodyMed" c={tinta}>{label}</Txt>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* Confirmação — a tela que fecha um fluxo. Marca em lima (a cor do feito),
   frase curta, e logo abaixo o que acontece A SEGUIR: quem acabou de
   registrar quer saber quando é a próxima dose, não receber parabéns. */
export function Confirmacao({ titulo, texto, children }: {
  titulo: string; texto: string; children?: React.ReactNode;
}) {
  const { c } = useTheme();
  return (
    <View style={{ alignItems: 'center', gap: 14, paddingHorizontal: 14, paddingTop: 40 }}>
      <View style={{ width: 66, height: 66, borderRadius: 33, backgroundColor: c.lime, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="check" size={28} color={c.limeInk} sw={2.6} />
      </View>
      <Txt v="h2" style={{ textAlign: 'center' }}>{titulo}</Txt>
      <Txt v="note" c={c.tx2} style={{ textAlign: 'center', maxWidth: 280 }}>{texto}</Txt>
      {children ? <View style={{ alignSelf: 'stretch', marginTop: 10 }}>{children}</View> : null}
    </View>
  );
}
