import React from 'react';
import {
  Text, View, Pressable, ScrollView, StyleSheet, useWindowDimensions, KeyboardAvoidingView, Animated, Easing,
  Keyboard, Platform, TextProps, ViewStyle, StyleProp, TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ty, font, radius, space, shadowCard } from '../theme';
import { useTheme } from './useTheme';
import { Icon } from './Icon';

type TxtProps = TextProps & { v?: keyof typeof ty; c?: string; style?: StyleProp<TextStyle>; };
export function Txt({ v = 'body', c, style, ...rest }: TxtProps) {
  const { c: col } = useTheme();
  return <Text {...rest} style={[ty[v], { color: c ?? col.tx }, style]} />;
}

/* Texto com ênfase — parseia marcador <b>..</b> vindo dos insights. */
/* ============================================================
   O TEXTO EM LINHA: negrito e termo que leva a algum lugar.

   Sai daqui e do `RichDoc` de baixo, para os dois nunca divergirem — que
   é o jeito como duas versões do mesmo parser passam a aceitar sintaxes
   levemente diferentes e ninguém descobre até um texto sair torto.

   ⚠️ O SUBLINHADO SÓ APARECE COM DESTINO. Termo sublinhado que não abre
   nada é a pior porta emparedada que existe: ela não parece porta de
   longe, parece porta de perto. Sem `ir`, o mesmo texto renderiza como
   texto comum. */
function emLinha(
  txt: string,
  v: keyof typeof ty,
  bold: string | undefined,
  cor: { accent: string },
  ir?: (to: string) => void,
) {
  const pedacos = txt.split(/(<b>.*?<\/b>|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return pedacos.map((p, i) => {
    if (p.startsWith('<b>')) {
      return (
        <Text
          key={i}
          style={{ color: bold ?? cor.accent, fontFamily: v === 'body' || v === 'bodyMed' ? font.bodySemi : font.bold }}
        >
          {p.replace(/<\/?b>/g, '')}
        </Text>
      );
    }
    const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!m) return <Text key={i}>{p}</Text>;
    if (!ir) return <Text key={i}>{m[1]}</Text>;
    return (
      <Text key={i} onPress={() => ir(m[2])} style={{ textDecorationLine: 'underline' }}>
        {m[1]}
      </Text>
    );
  });
}

/* ============================================================
   RESPOSTA COMO DOCUMENTO, e não como balão.

   ⚠️ A DIFERENÇA ENTRE ESTE E O `Rich` DE BAIXO É A NATUREZA DO QUE ELES
   MOSTRAM, e é ela que separa as duas telas de conversa do aplicativo.

   Uma mensagem de uma PESSOA é uma fala: curta, sem título, sem lista, e
   o balão é o desenho certo — ele diz quem falou pela posição e pela cor,
   e é assim que a conversa com a equipe continua sendo desenhada.

   Uma resposta da IA é um TEXTO: tem manchete, tem parágrafo, tem lista.
   Enfiar isso num balão de 84% de largura, com o canto mordido embaixo,
   é vestir um documento de recado — o texto quebra em coluna estreita, a
   lista não tem onde recuar, e o título fica do tamanho do corpo.

   Sem balão, a resposta ocupa a página e passa a ser lida como o que é.
   E a tela inteira muda de gênero sem precisar de um só rótulo dizendo
   "isto aqui é a IA".

   A sintaxe é a menor que dá conta:

     ## Título          uma linha de manchete
     linha em branco    separa parágrafo
     - item             marcador
     <b>negrito</b>     ênfase, como no Rich
     [termo](/rota)     termo que abre uma tela
   ============================================================ */
export function RichDoc({ text, ir, style }: {
  text: string;
  /* Sem isto, os termos entre colchetes viram texto comum — ver emLinha. */
  ir?: (to: string) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  const linhas = text.split('\n');
  const blocos: React.ReactNode[] = [];
  let paragrafo: string[] = [];

  const fecharParagrafo = () => {
    if (!paragrafo.length) return;
    const t = paragrafo.join(' ');
    blocos.push(
      <Text key={`p${blocos.length}`} style={[ty.body, { color: c.tx, lineHeight: 25 }]}>
        {emLinha(t, 'body', c.tx, c, ir)}
      </Text>,
    );
    paragrafo = [];
  };

  for (const linha of linhas) {
    const l = linha.trim();
    if (!l) { fecharParagrafo(); continue; }
    if (l.startsWith('## ')) {
      fecharParagrafo();
      blocos.push(
        <Text key={`h${blocos.length}`} style={[ty.bodyMed, { fontFamily: font.bodySemi, color: c.tx, marginTop: blocos.length ? 10 : 0 }]}>
          {l.slice(3)}
        </Text>,
      );
      continue;
    }
    if (l.startsWith('- ')) {
      fecharParagrafo();
      blocos.push(
        <Row key={`b${blocos.length}`} gap={10} style={{ alignItems: 'flex-start' }}>
          {/* O ponto alinha pela PRIMEIRA LINHA do item, e não pelo meio
              do bloco: item de duas linhas com o ponto centralizado fica
              flutuando no vão entre elas. */}
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: c.tx3, marginTop: 10 }} />
          <Text style={[ty.body, { color: c.tx, lineHeight: 25, flex: 1 }]}>
            {emLinha(l.slice(2), 'body', c.tx, c, ir)}
          </Text>
        </Row>,
      );
      continue;
    }
    paragrafo.push(l);
  }
  fecharParagrafo();

  return <View style={[{ gap: 12 }, style]}>{blocos}</View>;
}

export function Rich({ text, v = 'body', base, bold, style }: { text: string; v?: keyof typeof ty; base?: string; bold?: string; style?: StyleProp<TextStyle> }) {
  const { c } = useTheme();
  /* O mesmo `emLinha` do RichDoc, e sem `ir`: nas telas que usam o Rich não
     há para onde mandar ninguém, e termo sublinhado sem destino é porta
     emparedada. */
  return (
    <Text style={[ty[v], { color: base ?? c.tx }, style]}>
      {emLinha(text, v, bold, c, undefined)}
    </Text>
  );
}

/* Número com a fração recuada.

   O inteiro carrega o peso e o decimal recua um tom — o valor é lido de
   relance, e a precisão fica disponível sem disputar atenção. Também
   funciona para frações (6/20): o denominador é contexto, não resposta.

   O tom de recuo padrão é tx3, não tx4: recuar não pode virar ilegível. */
export function Metric({ value, unit, v = 'metric', tone, dim, style }: {
  value: string; unit?: string; v?: keyof typeof ty;
  tone?: string; dim?: string; style?: StyleProp<TextStyle>;
}) {
  const { c } = useTheme();
  const corte = value.search(/[.,/ ]/);   // decimal, fração ou unidade colada
  const forte = corte === -1 ? value : value.slice(0, corte);
  const fraco = corte === -1 ? '' : value.slice(corte);
  const recuo = dim ?? c.tx3;
  return (
    <Text style={[ty[v], { color: tone ?? c.tx }, style]}>
      {forte}
      {fraco ? <Text style={{ color: recuo }}>{fraco}</Text> : null}
      {unit ? <Text style={[{ color: recuo, fontSize: ty[v].fontSize * 0.42, fontFamily: font.body }]}>{` ${unit}`}</Text> : null}
    </Text>
  );
}

/* Superfície branca sobre o fundo quase-branco. Sem borda: a separação
   vem do tom e de uma sombra mínima (5%), como no frame da Home. */
export function Card({ children, style, onPress, tint }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; tint?: string }) {
  const { c } = useTheme();
  const body = (
    <View style={[{ backgroundColor: tint ?? c.bg1, borderRadius: radius.lg, padding: space.base }, shadowCard(c), style]}>
      {children}
    </View>
  );
  if (!onPress) return body;
  return <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.97 : 1, transform: [{ scale: pressed ? 0.994 : 1 }] }]}>{body}</Pressable>;
}

/* Cabeçalho de seção — título + link. Padrão da Home, usado em todas as
   telas que agrupam conteúdo em seções.

   ⚠️ O LINK É O NOME DO DESTINO, E NÃO O GESTO. Era "Ir para metas", "Ir
   para evolução", "Ir para área médica" — e o "ir para" é exatamente o
   que a seta ao lado já diz. Duas vezes a mesma informação, uma escrita e
   uma desenhada, e a escrita ocupando a largura que o nome precisaria
   para caber.

   "Ver todas" continua valendo onde continua sendo verdade: ali o link
   não nomeia uma tela, ele promete MAIS do que está à vista — três notas
   de dez, cinco exames de quinze. São duas coisas diferentes com dois
   rótulos diferentes. */
export function SectionHead({ title, link, onPress, style }: { title: string; link?: string; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  return (
    <Row style={[{ justifyContent: 'space-between', alignItems: 'center' }, style]}>
      <Txt v="h2">{title}</Txt>
      {link && onPress ? (
        <Pressable onPress={onPress} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
          <Row gap={6}>
            <Txt v="label" c={c.accent2}>{link}</Txt>
            <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
          </Row>
        </Pressable>
      ) : null}
    </Row>
  );
}

/* Linha de lista — ícone em quadrado suave, título, sub e chevron.
   É a unidade de navegação repetida no app inteiro. */
export function ListRow({ ic, title, sub, dot, tone, right, onPress }: {
  ic: string; title: string; sub?: string; dot?: boolean; tone?: 'default' | 'warn';
  right?: React.ReactNode; onPress?: () => void;
}) {
  const { c } = useTheme();
  const warn = tone === 'warn';
  const body = (
    <Row style={{ minHeight: 48 }}>
      {/* O ÍCONE SOLTO, pelo mesmo motivo da Linha das internas: numa
          lista, o quadrado de cor repetido vira coluna de botões que não
          são botões. A largura fixa fica, porque é ela que alinha os
          títulos entre si. */}
      <View>
        <View style={{ width: 32, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={ic} size={20} color={warn ? c.cta : c.tx2} sw={1.8} />
        </View>
        {dot ? <View style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: 4, backgroundColor: c.bad }} /> : null}
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Txt v="body">{title}</Txt>
        {/* Duas linhas, não uma. Com a legenda em 16px, subs como "3 doses
            restantes · cerca de 3 semanas" deixaram de caber numa linha só,
            e o corte comia justamente o fim da frase — que é onde mora a
            informação ("cerca de 3 semanas"). A linha cresce só quando
            precisa. */}
        {sub ? <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }} numberOfLines={2}>{sub}</Txt> : null}
      </View>
      {right ?? (onPress ? <Icon name="chev" size={15} color={c.tx2} sw={2} /> : null)}
    </Row>
  );
  if (!onPress) return body;
  return <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>{body}</Pressable>;
}

export function Pill({ label, color, bg, icon }: { label: string; color?: string; bg?: string; icon?: string }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', backgroundColor: bg ?? c.accentWeak, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill }}>
      {icon ? <Icon name={icon} size={13} color={color ?? c.accent} sw={2} /> : null}
      <Text style={[ty.tag, { color: color ?? c.accent }]}>{label}</Text>
    </View>
  );
}

export function IconBadge({ name, size = 44, iconSize, color, bg, sw }: { name: string; size?: number; iconSize?: number; color?: string; bg?: string; sw?: number }) {
  const { c } = useTheme();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2.6, backgroundColor: bg ?? c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={name} size={iconSize ?? Math.round(size * 0.46)} color={color ?? c.accent} sw={sw ?? 1.8} />
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Vazio — o lugar que existe e está sem conteúdo.

   Não é um Aviso. O aviso TEM algo a dizer, e por isso é um parágrafo:
   ícone em azul à esquerda, título e texto alinhados, como um recado
   pregado na tela. O vazio não tem nada a dizer — ele É a ausência — e
   vesti-lo de recado faz a seção parecer que deu errado, além de pesar
   mais que o conteúdo que deveria estar ali.

   E não vem em cartão. Cartão é superfície de conteúdo: ele existe para
   segurar coisa, e um cartão vazio no meio de uma pilha de cartões cheios
   parece conteúdo que não carregou. Aqui o desenho fica solto sobre o
   fundo da própria tela, que é o que a ausência é — o lugar sem nada em
   cima. O único objeto é o disco do ícone, que dá um centro de gravidade
   para o texto não boiar.

   Tudo centrado e curto: explicar a ausência em três linhas é o erro que
   este componente existe para não deixar acontecer de novo. O texto é
   opcional, e o normal é não ter — ele só entra quando há uma SAÍDA para
   oferecer (trocar o período, a outra aba). Comentar o vazio sem oferecer
   saída é ocupar espaço com nada.

   Mora aqui no kit, e não no vocabulário das telas internas, porque
   vazio não é assunto de tela interna: a Jornada tem, as fotos têm, o
   diário tem. */
/* ------------------------------------------------------------------ */
/* RETRATO — a foto da pessoa, ou a inicial dela.

   ⚠️ ERAM DUAS CÓPIAS. A Home desenhava um círculo em degradê com a
   inicial; o Perfil desenhava outro, com outro degradê e outra tinta. Aí
   o Perfil ganhou a escolha de foto e a Home não soube: a pessoa punha o
   retrato dela e continuava vendo a letra na tela que ela mais abre.

   Uma peça só, e quem tem foto tem foto em todo lugar. A inicial em
   degradê continua sendo o estado sem foto — não existe boneco genérico
   aqui, que ocupa o lugar de alguém com uma figura que não é ela.

   Sem `useStore`: o kit desenha, e quem sabe de onde vêm nome e foto é a
   tela. */
export function Retrato({ foto, nome, tam = 40, tinta }: {
  foto?: string; nome: string; tam?: number; tinta?: string;
}) {
  const { c } = useTheme();
  const r = tam / 2;
  return (
    <View style={{ width: tam, height: tam, borderRadius: r, overflow: 'hidden', backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
      {foto ? (
        <Image source={{ uri: foto }} style={{ width: tam, height: tam }} contentFit="cover" />
      ) : (
        <LinearGradient
          colors={[c.gradFrom, c.gradTo]}
          start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}
          style={{ width: tam, height: tam, alignItems: 'center', justifyContent: 'center' }}
        >
          {/* A letra acompanha o círculo: num retrato de 72 a inicial de
              um de 40 ficaria perdida no meio. */}
          <Text style={[ty.h1, { fontSize: Math.round(tam * 0.4), lineHeight: Math.round(tam * 0.5), color: tinta ?? '#FFFFFF' }]}>
            {nome.trim()[0] ?? '?'}
          </Text>
        </LinearGradient>
      )}
    </View>
  );
}

export function Vazio({ ic, titulo, texto }: {
  ic: string; titulo: string; texto?: string;
}) {
  const { c } = useTheme();
  return (
    <View style={{
      alignItems: 'center', gap: 3,
      paddingVertical: 34, paddingHorizontal: 24,
    }}>
      <View style={{ marginBottom: 12 }}>
        <IconBadge name={ic} size={46} iconSize={21} color={c.tx4} bg={c.bg3} sw={1.7} />
      </View>
      <Txt v="bodyMed" c={c.tx2} style={{ textAlign: 'center' }}>{titulo}</Txt>
      {texto ? (
        <Txt v="caption" c={c.tx3} style={{ textAlign: 'center' }}>{texto}</Txt>
      ) : null}
    </View>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: c.line2 }, style]} />;
}

export function Row({ children, style, gap }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; gap?: number }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center' }, gap != null && { gap }, style]}>{children}</View>;
}

export function Chevron({ color, size = 18 }: { color?: string; size?: number }) {
  const { c } = useTheme();
  return <Icon name="chev" size={size} color={color ?? c.tx4} sw={2} />;
}

export function CircleBtn({ name, onPress, color, bg, size = 40 }: { name: string; onPress?: () => void; color?: string; bg?: string; size?: number }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ width: size, height: size, borderRadius: size / 2.4, alignItems: 'center', justifyContent: 'center', backgroundColor: bg ?? c.bg2, opacity: pressed ? 0.7 : 1 }]}>
      <Icon name={name} size={Math.round(size * 0.5)} color={color ?? c.tx2} sw={1.9} />
    </Pressable>
  );
}

/* Container base de tela — SafeArea topo + scroll + fundo do app. */
/** Grupo de linhas dentro de um card, com fio entre elas.

    OS FIOS SANGRAM ATÉ A BORDA DIREITA, e começam alinhados com o texto.
    Antes o card tinha padding de 16 e o fio vivia dentro dele, recuado
    dos dois lados: a lista virava uma pilha de blocos separados por
    traços flutuantes, e o toque só valia em cima da linha, não na faixa
    inteira. É o mesmo desenho do Cartao das internas, que é o vocabulário
    de lista mais novo do app — e ter dois jeitos de desenhar a mesma coisa
    em telas vizinhas é o que faz um app parecer montado por duas pessoas
    que não se falaram. */
export function Grupo({ title, children }: { title?: string; children: React.ReactNode }) {
  const { c } = useTheme();
  const linhas = React.Children.toArray(children).filter(Boolean);
  return (
    /* SEM TÍTULO, O CARD SOBE. O espaço de 32 existe para separar um
       cabeçalho de seção do que veio antes; um card solto só precisa do
       respiro normal entre blocos. */
    <View style={{ marginTop: title ? 32 : 20 }}>
      {title ? <SectionHead title={title} /> : null}
      <View style={{
        backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: title ? 14 : 0, overflow: 'hidden',
      }}>
        {linhas.map((l, i) => (
          <React.Fragment key={i}>
            {i > 0 && <View style={{ height: 1, backgroundColor: c.line, marginLeft: 16 }} />}
            <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>{l}</View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

/* ⚠️ `scrollRef` existe para quem precisa ROLAR A TELA por código, e
   hoje é uma só: a de equipe, que abre no alto e precisa levar a pessoa
   até a conversa quando ela chega pedindo receita. Sem a referência, a
   única forma de mover a tela seria trocar o `Screen` por um ScrollView
   próprio — e aí a tela deixaria de herdar o respiro e o fundo daqui. */
export function Screen({ children, scroll = true, style, scrollRef }: {
  children: React.ReactNode; scroll?: boolean; style?: StyleProp<ViewStyle>;
  scrollRef?: React.RefObject<ScrollView | null>;
}) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  /* +20 acima da safe area: encostar o conteúdo na status bar aperta a
     leitura. Vale para todas as telas que usam Screen. */
  if (!scroll) return <View style={[{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top + 20 }, style]}>{children}</View>;
  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1, backgroundColor: c.bg }}
      contentContainerStyle={[{ paddingTop: insets.top + 20, paddingBottom: 120, paddingHorizontal: space.xl }, style]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

/* Card de mídia — imagem sangrada, canto grande, texto sobre um véu
   escuro no rodapé. É o padrão que dá caráter ao app fora da Home:
   biblioteca, marcos e conteúdo recomendado. */
export function MediaCard({ source, over, title, sub, height = 200, onPress, style }: {
  source: any; over?: string; title: string; sub?: string;
  height?: number; onPress?: () => void; style?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  const body = (
    <View style={[{ height, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: c.bg3 }, style]}>
      <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.72)']}
        start={{ x: 0, y: 0.25 }} end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={{ marginTop: 'auto', padding: space.base }}>
        {over ? <Text style={[ty.micro, { color: c.lime, letterSpacing: 1 }]}>{over.toUpperCase()}</Text> : null}
        <Text style={[ty.h2, { color: c.onHero, marginTop: over ? 6 : 0 }]}>{title}</Text>
        {sub ? <Text style={[ty.note, { color: c.onHero2, marginTop: 4 }]}>{sub}</Text> : null}
      </View>
    </View>
  );
  if (!onPress) return body;
  return <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}>{body}</Pressable>;
}

/* Sheet de captura — o invólucro que registrar e as telas de medição
   compartilham: scrim que fecha ao toque, grabber, painel flutuando acima
   da tab bar. Mantém as capturas com a mesma cara e o mesmo gesto. */
/* `rodape` fica FORA da rolagem, colado na base da folha. Serve para a
   ação principal de uma captura: dentro do cartão ela descia junto com o
   conteúdo e, em folha cheia, saía de vista bem quando a pessoa terminava
   de montar o que ia registrar. */
export function SheetScreen({ titulo, sub, rodape, children, onClose }: {
  titulo: string; sub?: string; rodape?: React.ReactNode;
  children: React.ReactNode; onClose: () => void;
}) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  /* ⚠️ O PÉ DA FOLHA MUDA DE TAMANHO QUANDO O TECLADO SOBE.

     Parado, o respiro de baixo tem que passar do indicador de gesto —
     daí `insets.bottom` mais dezesseis. Com o teclado aberto o indicador
     está coberto pelo próprio teclado, e aquele mesmo número vira uma
     faixa vazia de cinquenta pixels entre o botão e as teclas: o botão
     parecia flutuando no meio da folha.

     Vinte e quatro é a distância de quem vai tocar no botão logo depois
     de digitar. Não dá para medir isto no navegador — lá não existe
     teclado —, e é por isso que este comentário existe. */
  const [teclado, setTeclado] = React.useState(false);
  React.useEffect(() => {
    const sobe = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setTeclado(true));
    const desce = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setTeclado(false));
    return () => { sobe.remove(); desce.remove(); };
  }, []);

  /* ⚠️ O DESLIZE É DA FOLHA, E NÃO DA ROTA. A rota abre em fade — ver a
     nota em _layout —, então o scrim acende onde está em vez de subir
     pelo pé da tela. Quem sobe é este painel, e só ele, a altura inteira
     dele: a folha continua entrando de baixo, que é o gesto certo. O que
     não sobe mais é a sombra.

     ⚠️ E A DISTÂNCIA É MEDIDA, não chutada. Começa fora da tela — a
     altura da janela, que serve para qualquer folha —, e no primeiro
     layout troca pela altura REAL do painel, que é exatamente o quanto
     ele precisa viajar. Chutar um número faria a folha pequena percorrer
     o triplo do próprio tamanho, e a grande aparecer já pela metade.

     O `jaAnimou` existe porque o layout dispara de novo quando o teclado
     abre e o painel muda de altura — sem ele, a folha recomeçaria a
     entrada no meio de alguém digitando. */
  const { height: alturaDaJanela } = useWindowDimensions();
  const subida = React.useRef(new Animated.Value(alturaDaJanela)).current;
  const jaAnimou = React.useRef(false);
  const aoMedir = (h: number) => {
    if (jaAnimou.current || !h) return;
    jaAnimou.current = true;
    subida.setValue(h);
    Animated.timing(subida, {
      toValue: 0, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ height, justifyContent: 'flex-end' }}>
      <Pressable onPress={onClose} style={[StyleSheet.absoluteFill, { backgroundColor: c.scrim }]} />
      {/* Ancorado na base, cobrindo a tab bar: é o padrão de bottom sheet
          que a pessoa já conhece de outros apps. */}
      {/* O TECLADO EMPURRA A FOLHA, EM VEZ DE COBRI-LA.

          Metade das folhas deste app tem campo de texto — o nome do prato
          favorito, a busca de alimentos, a anotação da refeição —, e sem
          isto o teclado subia por cima de tudo: a pessoa digitava sem ver
          o que estava escrevendo, e o botão de gravar ficava atrás do
          teclado.

          `padding` no iOS, que é o comportamento que respeita a âncora de
          baixo; no Android o próprio sistema redimensiona a janela, e
          duplicar isso aqui faria a folha pular duas vezes.

          E A FAIXA DO PADDING É BRANCA, e não transparente. Ela fica
          exatamente onde o teclado está, e transparente deixava o escuro
          do fundo aparecer nos cantos entre a folha e o teclado — dois
          recortes escuros emoldurando o teclado, como se a folha tivesse
          descolado da base da tela. Branca, a folha continua encostada em
          baixo e o teclado nasce dela. */}
      <Animated.View
        onLayout={(ev) => aoMedir(ev.nativeEvent.layout.height)}
        style={{ transform: [{ translateY: subida }] }}
      >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        /* O raio vem junto: a faixa branca começa na mesma altura da
           folha, e sem o mesmo canto arredondado ela quadraria o topo da
           folha por trás dela. */
        style={{
          backgroundColor: c.bg,
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
        }}
      >
      <View style={{
        backgroundColor: c.bg, maxHeight: height * 0.86,
        borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
        paddingBottom: teclado ? 24 : (insets.bottom || 12) + 16,
      }}>
        <Pressable onPress={onClose} style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 14 }}>
          <View style={{ width: 40, height: 4, borderRadius: radius.pill, backgroundColor: c.bg3 }} />
        </Pressable>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 8 }}
          keyboardShouldPersistTaps="handled"
        >
          <Row style={{ alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              {/* Com `c`, e não sem: um `Txt` sem cor cai no
                  `useTheme()`, e o dia em que alguém emprestar outra
                  paleta a esta folha o título é o primeiro a sumir. É o
                  mesmo defeito que já apagou quatro textos do paywall. */}
              <Txt v="h2" c={c.tx}>{titulo}</Txt>
              {sub ? <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>{sub}</Txt> : null}
            </View>
            {/* fechar explícito — o grabber some para quem não conhece o gesto */}
            <Pressable onPress={onClose} hitSlop={10} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, marginTop: 2 }]}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="x" size={16} color={c.tx2} sw={2.2} />
              </View>
            </Pressable>
          </Row>
          {children}
        </ScrollView>

        {rodape ? (
          <View style={{
            paddingHorizontal: 24, paddingTop: 14,
            borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.line,
          }}>
            {rodape}
          </View>
        ) : null}
      </View>
      </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

export const sectionTitleStyle: TextStyle = { ...ty.h2 };
