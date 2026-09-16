import React from 'react';
import {
  Text, View, Pressable, ScrollView, StyleSheet, useWindowDimensions, KeyboardAvoidingView,
  Platform, TextProps, ViewStyle, StyleProp, TextStyle,
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
export function Rich({ text, v = 'body', base, bold, style }: { text: string; v?: keyof typeof ty; base?: string; bold?: string; style?: StyleProp<TextStyle> }) {
  const { c } = useTheme();
  const parts = text.split(/(<b>.*?<\/b>)/g).filter(Boolean);
  return (
    <Text style={[ty[v], { color: base ?? c.tx }, style]}>
      {parts.map((p, i) =>
        p.startsWith('<b>')
          ? <Text key={i} style={{ color: bold ?? c.accent, fontFamily: v === 'body' || v === 'bodyMed' ? font.bodySemi : font.bold }}>{p.replace(/<\/?b>/g, '')}</Text>
          : <Text key={i}>{p}</Text>
      )}
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

/* Cabeçalho de seção — título + link "Ir para ...". Padrão da Home,
   usado em todas as telas que agrupam conteúdo em seções. */
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
      <View>
        <View style={{ width: 32, height: 32, borderRadius: radius.sm, backgroundColor: warn ? c.ctaWeak : c.bg2, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={ic} size={18} color={warn ? c.cta : c.tx} sw={1.8} />
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
export function Screen({ children, scroll = true, style }: { children: React.ReactNode; scroll?: boolean; style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  /* +20 acima da safe area: encostar o conteúdo na status bar aperta a
     leitura. Vale para todas as telas que usam Screen. */
  if (!scroll) return <View style={[{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top + 20 }, style]}>{children}</View>;
  return (
    <ScrollView
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
   biblioteca, marcos, fotos de progresso, conteúdo recomendado. */
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
          duplicar isso aqui faria a folha pular duas vezes. */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{
        backgroundColor: c.bg, maxHeight: height * 0.86,
        borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
        paddingBottom: (insets.bottom || 12) + 16,
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
              <Txt v="h2">{titulo}</Txt>
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
    </View>
  );
}

export const sectionTitleStyle: TextStyle = { ...ty.h2 };
