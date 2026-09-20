import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Pressable, ScrollView, StyleSheet, TextInput, StyleProp, ViewStyle } from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WD } from '../logic/time';
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
  titulo, sub, acao, iconeAcao, onAcao, fechar, onVoltar, rodape, tituloFixo, children,
}: {
  titulo: string;
  /** a legenda do título na barra — data, origem, o que situa a tela */
  sub?: string;
  /** rótulo curto da ação à direita ("Nova", "Salvar") */
  acao?: string;
  /** ícone no lugar do rótulo, quando a ação é um gesto e não uma palavra */
  iconeAcao?: string;
  onAcao?: () => void;
  /** troca o "‹" por "✕" — fluxos de captura se fecham, não voltam */
  fechar?: boolean;
  /* PARA AS TELAS SEM TITULÃO. A barra só mostra o título depois que o
     título grande sobe — e quem não tem título grande precisa dele
     desde o começo, senão a tela abre sem nome nenhum. Hoje é uma só:
     a confirmação da aplicação. */
  tituloFixo?: boolean;
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

  /* O TÍTULO NÃO SE ESCREVE DUAS VEZES.

     A barra sempre mostrou o título, e logo abaixo dela o Titulão mostrava
     o MESMO título em corpo de manchete. Dezessete telas abriam dizendo o
     próprio nome duas vezes, uma em cima da outra — e o comentário do
     Titulão já dizia a regra certa sem que o código a seguisse: a barra de
     cima serve para voltar, o titulão é o que se lê.

     Agora a barra fica só com a seta enquanto a manchete está à vista, e
     recebe o nome quando ela sai de cena. É o mesmo nome no mesmo lugar o
     tempo todo — só que um de cada vez. */
  const [passou, setPassou] = useState(false);
  const tinta = useRef(new Animated.Value(tituloFixo ? 1 : 0)).current;
  useEffect(() => {
    if (tituloFixo) return;
    Animated.timing(tinta, { toValue: passou ? 1 : 0, duration: 140, useNativeDriver: true }).start();
  }, [passou, tituloFixo, tinta]);

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

          <Animated.View style={{ flex: 1, opacity: tinta }} pointerEvents="none">
            <Txt v="bodyMed" style={{ textAlign: 'center' }} numberOfLines={1}>{titulo}</Txt>
            {/* ⚠️ A SEGUNDA LINHA DA BARRA — o "quando" do que está na tela.

                Ela nasceu para o detalhe de um marcador de exame, onde a
                data da coleta não tinha lugar: solta embaixo do valor ela
                flutuava, e dentro do cartão do resultado ela competia com
                o número. Na barra ela vira o que é — a legenda do título,
                como o subtítulo de um documento.

                Opcional e sem altura própria: quem não passa `sub` tem a
                barra de sempre, do mesmo tamanho de sempre. */}
            {sub ? (
              <Txt v="micro" c={c.tx3} style={{ textAlign: 'center', marginTop: 1 }} numberOfLines={1}>{sub}</Txt>
            ) : null}
          </Animated.View>

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
        onScroll={(e) => {
          /* Dois limiares para dois sinais. O fio aparece ao primeiro
             movimento, porque ele existe para dizer "há conteúdo acima".
             O título só entra quando a manchete já passou — 38 px é a
             altura dela menos o que ainda aparece por baixo da barra. */
          const y = e.nativeEvent.contentOffset.y;
          setRolou(y > 6);
          setPassou(y > 38);
        }}
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
/* ⚠️ `alerta` É O ÚNICO TOM QUE PARA O OLHO, e por isso ele é o último
   a entrar numa tela. Lima e verde são lavagens de boa notícia; neutra é
   o lugar onde mora o que não tem juízo. O vermelho lavado existe para o
   caso em que a lista precisa que uma linha entre quinze seja encontrada
   sem leitura — e num aplicativo de saúde isso é raro o bastante para
   caber num tom só. */
export type SeloTom = 'lima' | 'verde' | 'neutra' | 'alerta';

export function Selo({ label, tom = 'lima' }: { label: string; tom?: SeloTom }) {
  const { c } = useTheme();
  const par: Record<SeloTom, [string, string]> = {
    lima: [c.limeSoft, c.limeSoftInk],
    verde: [c.okBg, c.ok],
    neutra: [c.bg2, c.tx2],
    alerta: [c.ctaWeak, c.cta],
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
  ic?: string; titulo: string;
  /* ⚠️ O SUBTÍTULO ACEITA PEÇA MONTADA, e só aceitava texto.

     Quase toda lista quer uma frase cinza embaixo do título, e para essas
     a string continua sendo o caminho — passar JSX ali seria cerimônia. Mas
     existe um caso em que o subtítulo carrega VEREDITO, e não descrição: a
     lista de exames, onde o valor precisa sair vermelho e com seta quando
     está fora da faixa. Sem isto, aquela tela precisaria de uma cópia local
     da Linha, e uma cópia é onde as duas começam a divergir. */
  sub?: React.ReactNode;
  selo?: string; seloTom?: SeloTom; seta?: boolean; onPress?: () => void;
}) {
  const { c } = useTheme();
  const mostraSeta = seta ?? !!onPress;
  const corpo = (
    <Row style={{ paddingHorizontal: PAD, paddingVertical: 14, gap: 12 }}>
      {/* O ÍCONE SOLTO, E NÃO DENTRO DE UM QUADRADO DE COR.

          Numa lista de quatro, cinco linhas, o quadrado azul repetido
          vira uma coluna de botões — e nenhum deles é botão: quem leva a
          algum lugar é a linha inteira. O peso visual ia todo para a
          moldura, que é a única parte da linha que não diz nada.

          A LARGURA FIXA FICA. É ela que alinha os títulos entre si; sem
          ela, cada linha começaria onde o desenho do seu ícone terminou,
          e uma lista de ícones de larguras diferentes vira uma escada. */}
      {ic ? (
        <View style={{ width: 34, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={ic} size={20} color={c.accent} sw={1.9} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Txt v="body">{titulo}</Txt>
        {sub == null || sub === false ? null : typeof sub === 'string'
          ? <Txt v="caption" c={c.tx2} style={{ marginTop: 2 }}>{sub}</Txt>
          : <View style={{ marginTop: 2 }}>{sub}</View>}
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

/* ------------------------------------------------------------------ */
/* Acordeão — um cartão que guarda conteúdo até ser aberto.

   Diferente da Sanfona, que é uma pilha de linhas que abrem cada uma o
   seu texto: aqui é UM cartão, com filhos livres dentro. Serve para o
   atalho que a maioria não usa em toda visita — visível o bastante para
   ser lembrado, fechado o bastante para não empurrar para baixo o que a
   maioria veio fazer. */
export function Acordeao({ ic, titulo, sub, children, nu, aberto: inicial = false }: {
  ic?: string; titulo: string; sub?: string; children: React.ReactNode;
  /** sem cartão: fios em cima e embaixo, sobre o fundo da tela */
  nu?: boolean; aberto?: boolean;
}) {
  const { c } = useTheme();
  const [aberto, setAberto] = useState(inicial);
  const fio = { height: StyleSheet.hairlineWidth, backgroundColor: c.line };
  const filhos = React.Children.toArray(children).filter(Boolean);

  return (
    <View style={nu
      ? { borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: c.line }
      : [{ backgroundColor: c.bg1, borderRadius: radius.card, overflow: 'hidden' }, shadowCard(c)]}
    >
      <Pressable onPress={() => setAberto((a) => !a)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
        <Row gap={10} style={{ paddingHorizontal: nu ? 2 : PAD, paddingVertical: 13 }}>
          {ic ? <Icon name={ic} size={16} color={c.accent} sw={1.9} /> : null}
          <View style={{ flex: 1 }}>
            <Txt v="bodyMed">{titulo}</Txt>
            {sub ? <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{sub}</Txt> : null}
          </View>
          <Icon name={aberto ? 'chevup' : 'chevdown'} size={15} color={c.tx4} sw={2} />
        </Row>
      </Pressable>
      {/* Fio entre os filhos, e não dentro de cada um: assim o primeiro e
          o último nunca deixam um fio sobrando na borda. É a mesma regra
          do Cartao. */}
      {aberto ? filhos.map((ch, k) => (
        <View key={k}>
          <View style={[fio, nu ? null : { marginLeft: PAD }]} />
          {ch}
        </View>
      )) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */
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
/* CARD DA SEMANA — sete barras, o número do dia e a linha da meta.

   Nasceu solto dentro de /exercicio e virou componente quando a
   alimentação pediu a mesma pergunta: "como foi a minha semana, dia a
   dia, contra a meta diária?". São dados diferentes — minutos e gramas
   — e exatamente a mesma leitura, e duas cópias do mesmo gráfico é como
   começam as divergências que este app passou meses tirando de si.

   A barra diz QUANTO, e não só "teve ou não teve": cada uma carrega o
   número em cima e a tracejada marca a meta. Barra estreita e redonda
   porque a de antes ocupava a coluna inteira — sete blocos colados
   viram parede, não gráfico.

   O rodapé é livre. No exercício ele é a linha de treino de força; em
   outra tela será outra coisa, ou nada. */
const ALT_SEMANA = 64;
/* A calha onde mora a legenda da meta. Reservar a faixa em vez de
   sobrepor o rótulo é o que garante que ele nunca cubra uma barra: o
   eixo dos dias respeita a mesma calha, então rótulo e coluna continuam
   alinhados. */
const CALHA = 82;

export function CardSemana({
  nome, sub, valor, unidade, dias, alvo, rotuloMeta, rotulo, rodape,
}: {
  nome: string; sub: string; valor: string; unidade?: string;
  /** sete dias em ordem, do mais antigo para hoje */
  dias: { t: number; v: number }[];
  alvo: number;
  /** o que a tracejada diz de si mesma: "Meta: 60 min", "Meta: 90 g" */
  rotuloMeta: string;
  /* COMO O NÚMERO DA BARRA SE ESCREVE.

     Minuto e grama são inteiros e se escrevem sozinhos. Litro não: a
     água chega aqui em mililitros, porque é em mililitros que a altura
     da barra e a meta se comparam sem erro de arredondamento, e 1750
     escrito em cima de uma barra de sete é ruído. Quem sabe a unidade é
     a tela; o cartão só pergunta como escrever. */
  rotulo?: (v: number) => string;
  rodape?: React.ReactNode;
}) {
  const { c } = useTheme();
  /* O teto é a meta, ou o maior dia se ele passou dela — assim um dia na
     meta enche a barra e um acima dela não sai da caixa. */
  const teto = Math.max(alvo, ...dias.map((d) => d.v)) || 1;
  const yMeta = Math.round((alvo / teto) * ALT_SEMANA);

  return (
    <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, overflow: 'hidden' }, shadowCard(c)]}>
      <Row style={{ paddingHorizontal: PAD, paddingTop: PAD, paddingBottom: 14, alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Txt v="body">{nome}</Txt>
          <Txt v="note" c={c.tx3} style={{ marginTop: 2 }}>{sub}</Txt>
        </View>
        <Txt v="metric">
          {valor}
          {unidade ? <Txt v="label" c={c.tx3}>{` ${unidade}`}</Txt> : null}
        </Txt>
      </Row>

      <View style={{ paddingHorizontal: PAD }}>
        <View style={{ height: ALT_SEMANA + 24 }}>
          <View
            pointerEvents="none"
            style={{
              position: 'absolute', left: 0, right: CALHA, bottom: yMeta,
              /* Em c.line2 a meta some dentro do cartão branco. Linha de
                 referência precisa ser lida de relance, senão o gráfico
                 volta a ser altura sem unidade. */
              borderTopWidth: 1, borderTopColor: c.tx4, borderStyle: 'dashed',
            }}
          />
          {/* A tracejada aponta para o próprio nome. Sem isto ela era um
              fio no meio do gráfico que só entendia quem já sabia. */}
          <Txt v="micro" c={c.tx3} style={{ position: 'absolute', right: 0, bottom: yMeta - 8 }}>
            {rotuloMeta}
          </Txt>
          <Row style={{ flex: 1, alignItems: 'flex-end', paddingRight: CALHA }}>
            {dias.map((d, i) => {
              const eHoje = i === dias.length - 1;
              return (
                <View key={d.t} style={{ flex: 1, alignItems: 'center' }}>
                  {d.v ? (
                    /* Fundo do cartão atrás do número: a tracejada da meta
                       passa na altura dos rótulos dos dias curtos e cruzava
                       os dígitos. */
                    <Txt
                      v="micro"
                      c={eHoje ? c.tx : c.tx4}
                      style={{ marginBottom: 5, backgroundColor: c.bg1, paddingHorizontal: 3 }}
                    >{rotulo ? rotulo(d.v) : d.v}</Txt>
                  ) : null}
                  {/* O dia em branco ganha um ponto na linha de base: coluna
                      vazia some, e não ter registro não é ausência de dado. */}
                  <View style={{
                    width: d.v ? 16 : 5,
                    height: d.v ? Math.max(8, Math.round((d.v / teto) * ALT_SEMANA)) : 5,
                    borderRadius: radius.pill,
                    backgroundColor: d.v ? c.accent : c.line,
                  }} />
                </View>
              );
            })}
          </Row>
        </View>

        <Row style={{ marginTop: 8, paddingRight: CALHA }}>
          {dias.map((d, i) => (
            /* Três letras, não uma: sáb, seg e sex começam iguais, e a
               fileira virava "s s s" no meio da semana. */
            <View key={d.t} style={{ flex: 1, alignItems: 'center' }}>
              <Txt v="micro" c={i === dias.length - 1 ? c.tx2 : c.tx4}>{WD[new Date(d.t).getDay()]}</Txt>
            </View>
          ))}
        </Row>
      </View>

      {rodape ? (
        <>
          <View style={{ height: 1, backgroundColor: c.line, marginTop: 16 }} />
          {rodape}
        </>
      ) : <View style={{ height: PAD }} />}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* TIRA DE DIAS — o calendário horizontal que escolhe o dia de um
   diário.

   Ela responde uma coisa que nem o gráfico nem a lista dão: o RITMO. O
   gráfico mostra sete dias e diz quanto; a lista mostra os registros e
   some com os dias vazios. A tira mostra os dois juntos — três dias
   seguidos, um de folga, dois — que é como se enxerga constância.

   E navega: ela ESCOLHE o dia, e o diário embaixo mostra só ele.
   Filtro opcional, com tudo listado embaixo, era um seletor de data
   contradizendo a própria lista.

   Duas perguntas, dois lugares no cartão. O rótulo de cima diz onde no
   tempo — o dia da semana, ou "hoje". O ponto de baixo diz se houve
   registro: cheio e maior quando sim, cinza e menor quando o dia passou
   em branco, porque ausência sozinha não responde "não teve", responde
   "não sei". E o preenchimento diz onde você está: tinta no dia aberto,
   azul em hoje quando o dia aberto é outro. */
export function TiraDeDias({ dias, sel, onEscolhe }: {
  /** em ordem, do mais antigo para hoje */
  dias: { t: number; marcado: boolean; hoje: boolean }[];
  sel: number;
  onEscolhe: (t: number) => void;
}) {
  const { c } = useTheme();
  const tira = React.useRef<ScrollView>(null);
  const aoFim = () => tira.current?.scrollToEnd({ animated: false });

  return (
    /* Em ordem, e rolada até o fim assim que mede: a tira nasce mostrando
       HOJE, que é onde a pessoa está, em vez de três meses atrás. Tentei
       antes com row-reverse, que inverte o desenho mas não a rolagem —
       abria no dia mais velho de todos.

       Dois gatilhos, e não um: o conteúdo e a caixa são medidos em ordens
       diferentes conforme a plataforma, e com só o do conteúdo a tira
       parava quarenta pixels antes do fim. */
    <ScrollView
      ref={tira}
      horizontal
      showsHorizontalScrollIndicator={false}
      onContentSizeChange={aoFim}
      onLayout={aoFim}
      style={{ marginHorizontal: -PAD }}
      contentContainerStyle={{ paddingHorizontal: PAD, gap: 6 }}
    >
      {dias.map((d) => {
        const on = sel === d.t;
        const dt = new Date(d.t);
        return (
          <Pressable
            key={d.t}
            onPress={() => onEscolhe(d.t)}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={{
              width: 46, paddingVertical: 8, borderRadius: radius.md, alignItems: 'center', gap: 3,
              backgroundColor: on ? c.tx : d.hoje ? c.accent : d.marcado ? c.accentWeak : c.bg1,
              borderWidth: 1,
              borderColor: on ? c.tx : d.hoje ? c.accent : d.marcado ? c.accentLine : c.line,
            }}>
              {/* A tinta do dia escolhido é `bg1`, e não branco: o
                  preenchimento é `tx`, que no tema escuro é BRANCO — e
                  branco sobre branco some. É a mesma dupla que os chips do
                  app usam desde sempre. */}
              <Txt v="micro" c={on ? c.bg1 : d.hoje ? c.accentInk : c.tx4}>
                {d.hoje ? 'hoje' : WD[dt.getDay()]}
              </Txt>
              <Txt v="caption" c={on ? c.bg1 : d.hoje ? c.accentInk : d.marcado ? c.accent : c.tx3}>
                {dt.getDate()}
              </Txt>
              <View style={{
                width: d.marcado ? 5 : 3,
                height: d.marcado ? 5 : 3,
                borderRadius: 3,
                /* O cinza do dia em branco é o mesmo em qualquer
                   preenchimento: `tx4` é meio-tom nos dois temas, e num dia
                   cheio de cor ele quase some — que é o certo, já que hoje
                   não passou em branco, só não acabou. */
                backgroundColor: d.marcado ? (on ? c.bg1 : d.hoje ? c.accentInk : c.accent) : c.tx4,
              }} />
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
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
        /* A CURVA MARCADA.

           Ela nasceu como um fio de 2px sangrando de borda a borda, sem um
           único ponto — bonita e muda: dava para ver que subia, não dava
           para ver de quantas leituras ela é feita nem onde cada uma cai.
           Um gráfico que só tem forma é enfeite; o que o torna leitura é a
           marcação, porque é ela que diz "aqui houve uma medida".

           Daí os três ajustes: traço mais grosso, área mais presente e um
           nó em cada ponto. E daí também o recuo nas quatro bordas — sem
           ele o primeiro e o último nó sairiam cortados ao meio na dobra
           do cartão, que é pior do que não ter nó nenhum.

           Acima de catorze leituras os nós saem. Aí eles deixam de marcar
           e passam a serrilhar a curva, e a série já é longa o bastante
           para a forma responder sozinha. */
        <AreaCurve
          pts={curva} height={altura} padT={12} padB={12} padX={11} strokeW={2.8}
          strokeFrom={c.limeDim} strokeTo={c.limeDim} dashed={false} id={id}
          nodes={pontos.length <= 14} fill={0.26}
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

   `dentro` tira a casca de cartão e encaixa o aviso NO campo que o
   provocou, abaixo de um fio — e um corpo menor que o do resto da tela.
   Ele é comentário sobre a resposta, não uma segunda pergunta: no mesmo
   tamanho do controle acima, disputava a leitura com ele. Como cartão
   solto virava mais um bloco na pilha, à mesma distância de todos e
   ligado a nenhum.

   `destaque` é o contrário: o aviso que não pertence a campo nenhum
   porque nasce de vários ao mesmo tempo. Cartão tingido, sem sombra — ele
   não é mais um bloco do formulário, é o app falando sobre o dia inteiro.

   Nas duas, o ícone sobe para cima do texto e o texto ocupa a largura
   toda. Ao lado, ele espremia a coluna e o aviso ficava com cara de nota
   de rodapé; em cima, ele abre o bloco, como um selo. A forma padrão —
   cartão com ícone à esquerda — continua para as outras telas, que usam o
   Aviso como linha de apoio e não como interrupção. */
export function Aviso({ ic = 'info', titulo, texto, acao, dentro, destaque, children }: {
  ic?: string; titulo?: string; texto?: string;
  /* O parágrafo de fazer. Vem separado do `texto` de propósito: o de cima
     explica POR QUE aquilo está acontecendo, e este diz o que fazer com
     isso. Juntos num parágrafo só, a explicação engole a instrução — a
     pessoa lê, concorda e não sai do lugar. Separados, o "o que fazer"
     tem endereço fixo e pode ser lido sozinho por quem já entendeu. */
  acao?: string;
  dentro?: boolean; destaque?: boolean; children?: React.ReactNode;
}) {
  const { c } = useTheme();
  const empilha = dentro || destaque;

  /* Dentro do campo o aviso fala mais baixo: título em 16 e corpo em 15,
     contra os 19 e 16 do cartão solto. Ele comenta a resposta que está
     logo acima e não pode ter a mesma voz dela. O cartão da leitura do
     conjunto mantém o corpo cheio — aquele não comenta um campo, fala do
     dia inteiro, e é o único da tela que deve soar mais alto. */
  const vTitulo = dentro ? 'label' : 'bodyMed';
  const vTexto = dentro ? 'tag' : 'caption';
  const tamIcone = dentro ? 15 : 18;

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
        { gap: 5 },
        dentro && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.line, paddingTop: 12 },
        destaque && { backgroundColor: c.accentWeak, borderRadius: radius.card, padding: PAD },
      ]}>
        {/* Ícone na linha do título, e o corpo do texto na largura toda por
            baixo dos dois. Ao lado do bloco inteiro ele espremia a coluna;
            acima de tudo, empurrava o título para longe do que o provocou.
            Na linha do título ele funciona como marcador da frase, que é o
            papel que tem. */}
        <Row gap={8} style={{ alignItems: 'flex-start' }}>
          {/* Alinhado à PRIMEIRA linha do título, não ao centro do bloco:
              com título de duas linhas, centrado ele descia para o meio e
              deixava de marcar onde a frase começa. */}
          <View style={{ marginTop: (ty[vTitulo].lineHeight - tamIcone) / 2 }}>
            <Icon name={ic} size={tamIcone} color={c.accent} sw={1.9} />
          </View>
          {titulo ? <Txt v={vTitulo} style={{ flex: 1 }}>{titulo}</Txt> : null}
        </Row>
        {texto ? <Txt v={vTexto} c={c.tx2}>{texto}</Txt> : null}

        {acao ? (
          <View style={{ gap: 3, marginTop: 3 }}>
            <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>O QUE FAZER</Txt>
            {/* Em tinta cheia, e não na cinza do texto de cima: é a parte
                que a pessoa precisa levar embora da tela. */}
            <Txt v={vTexto} c={c.tx}>{acao}</Txt>
          </View>
        ) : null}

        {children}
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

   Já tentei pendurar uma SAIA aqui — uma aba que saía por baixo do cartão
   com o que o app tem a dizer sobre a resposta. Em azul ela competia com o
   controle logo acima; em cinza, sumia no fundo da tela, que é quase o
   mesmo cinza. O aviso voltou para dentro do cartão, separado por um fio:
   sobre o branco do cartão qualquer coisa se destaca, e é lá que ele está
   preso ao que comenta. */
export function Campo({ rotulo, ajuda, nu, children }: {
  rotulo?: string; ajuda?: string; nu?: boolean; children: React.ReactNode;
}) {
  const { c } = useTheme();
  return (
    <View style={nu
      ? { gap: 11, paddingHorizontal: 2 }
      : [{ backgroundColor: c.bg1, borderRadius: radius.card, padding: PAD, gap: 11 }, shadowCard(c)]}>
      {rotulo ? <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1.2 }}>{rotulo.toUpperCase()}</Txt> : null}
      {children}
      {ajuda ? <Txt v="caption" c={c.tx3}>{ajuda}</Txt> : null}
    </View>
  );
}

/* Opções — botões que embrulham em várias linhas. Servem para escolha
   única e para múltipla; quem decide qual das duas é a tela. */
export function Opcoes({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{children}</View>;
}

/* `ic` troca o check por um glifo próprio. Vale quando a lista é de
   COISAS e não de sim/não: onze modalidades de exercício se reconhecem
   pelo desenho antes do nome, e o estado já é dito pela cor da borda, do
   fundo e do próprio ícone. Com check E ícone seriam três sinais para uma
   informação só. */
/* `cheia` faz a opção ocupar a coluna inteira. Só serve dentro de
   <Grade>, e é lá que está a explicação de por que uma lista pediria
   isso. */
export function Opc({ label, ic, dir, cheia, on, onPress }: {
  label: string; ic?: string; dir?: string; cheia?: boolean; on?: boolean; onPress?: () => void;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      /* O ESCOLHIDO É CHEIO, e não contornado.

         Era borda azul com lavagem clara por dentro, e isso pede que o
         olho COMPARE com os vizinhos para decidir qual está marcado —
         funciona, mas depois de uma conferida. Preenchido, a resposta
         salta antes da leitura. É o mesmo desenho que o cadastro já usa
         nas suas treze perguntas, e ter dois jeitos de dizer "esta é a
         sua escolha" em telas do mesmo app é o tipo de diferença que
         ninguém descreve e todo mundo sente. */
      style={({ pressed }) => [{
        paddingHorizontal: cheia ? 12 : 14, paddingVertical: 10, borderRadius: radius.md,
        borderWidth: 1, borderColor: on ? c.accent : c.line,
        backgroundColor: on ? c.accent : c.bg1, opacity: pressed ? 0.7 : 1,
      }, cheia ? { flex: 1 } : null]}
    >
      {/* O check entra junto da cor. Só a lavagem azul pedia comparação
          com os vizinhos para se ler como "marcado"; o check diz sozinho,
          sem precisar do resto da lista ao lado.

          Dentro de uma <Grade> ele sai: ali as opções são ALTERNATIVAS,
          só uma pode estar ligada, e a cor já diz qual — o check era o
          terceiro sinal de uma informação só. E os 21 px que ele ocupava
          faziam "Café da manhã" caber com reticências numa coluna de
          metade da tela. */}
      {/* CENTRADO QUANDO OCUPA A COLUNA INTEIRA. Numa grade, a peça tem
          largura fixa e o texto tem a dele: encostado à esquerda, cada
          rótulo começava no mesmo lugar e terminava num lugar diferente,
          e a coluna ficava com um rio de espaço irregular à direita.
          Centrado, a grade lê como grade. Com valor à direita não vale:
          ali as duas pontas da linha têm dono. */}
      <Row gap={7} style={cheia && !dir ? { justifyContent: 'center' } : undefined}>
        {ic
          ? <Icon name={ic} size={15} color={on ? c.accentInk : c.tx3} sw={1.9} />
          : on && !cheia ? <Icon name="check" size={14} color={c.accentInk} sw={2.6} /> : null}
        <Txt v="label" c={on ? c.accentInk : c.tx2} numberOfLines={1} style={dir ? { flex: 1 } : undefined}>{label}</Txt>
        {/* Um valor do lado direito — o que aquela escolha vale. Serve
            para listas em que as opções se comparam por número. */}
        {dir ? <Txt v="caption" c={on ? 'rgba(255,255,255,0.78)' : c.tx4}>{dir}</Txt> : null}
      </Row>
    </Pressable>
  );
}

/* GRADE — as opções em colunas de largura igual, em vez de se ajustarem
   ao texto.

   <Opcoes> serve quando a lista é de sim/não e a pessoa lê uma por uma:
   sintomas, por exemplo, onde cada peça é marcada por conta própria. Mas
   quando a lista é de ALTERNATIVAS — uma modalidade de exercício entre
   dez — as peças são comparadas entre si, e aí a largura vira informação
   que não existe: "Bike" ao lado de "Alongamento" fazia uma parecer
   menor que a outra. Em grade as dez pesam igual e o olho corre em duas
   colunas retas em vez de um mosaico. */
export function Grade({ cols = 2, gap = 8, children }: {
  cols?: number; gap?: number; children: React.ReactNode;
}) {
  const itens = React.Children.toArray(children);
  const linhas: React.ReactNode[][] = [];
  for (let i = 0; i < itens.length; i += cols) linhas.push(itens.slice(i, i + cols));
  return (
    <View style={{ gap }}>
      {linhas.map((linha, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'stretch', gap }}>
          {linha}
          {/* A última linha incompleta ganha vãos, e não uma peça
              esticada: uma opção larga no fim leria como a principal. */}
          {Array.from({ length: cols - linha.length }, (_, k) => (
            <View key={`vao${k}`} style={{ flex: 1 }} />
          ))}
        </View>
      ))}
    </View>
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
  /* SEM RESPOSTA, O CURSOR FICA NO INÍCIO — e não no meio da régua.

     No meio, a barra em branco já parecia uma resposta dada, e das piores:
     "médio". Quem só encostava para ver o que era saía com um 3 gravado, e
     quem não encostava via a tela sugerindo que o dia tinha sido assim.
     No início, a régua vazia parece o que ela é: vazia. */
  const repouso = 0;
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
        value={respondido ? i : repouso}
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
/* A RODA — uma lista que rola e para no item escolhido.

   ⚠️ ELA MORAVA DENTRO DO CADASTRO, e saiu de lá quando a segunda tela
   precisou dela. Data de nascimento, início do tratamento e agora a
   próxima consulta são a mesma pergunta em três lugares — e a regra da
   casa é que duas cópias do mesmo gesto é onde um padrão começa a
   divergir.

   O COMPONENTE NÃO SABE DE DATAS. Ele recebe uma lista de { v, label } e
   devolve o v escolhido; quem decide que dia 31 não existe em fevereiro,
   ou que o ano não passa do que vem, é quem chama. Foi assim que ela
   nasceu no cadastro, onde os limites são "não pode ser no futuro", e é
   o que permite usá-la agora onde o limite é o contrário. */
/* ------------------------------------------------------------------ */
export function Roda({ itens, valor, onEscolhe, largura }: {
  itens: { v: number; label: string }[];
  valor: number; onEscolhe: (v: number) => void; largura?: number;
}) {
  const { c } = useTheme();
  const ALT = 44;
  const VISIVEIS = 5;
  const ref = React.useRef<ScrollView>(null);
  const montou = React.useRef(false);
  const i = Math.max(0, itens.findIndex((x) => x.v === valor));

  /* PRIMEIRO POSICIONA, DEPOIS ESCUTA.

     Sem esta trava a roda estragava a resposta que já existia: ao montar,
     a lista reporta deslocamento zero, o onScroll lê zero como "parou no
     primeiro item" e grava 1920 por cima de 1990 — antes mesmo de o
     scrollTo ter acontecido. O quadro de folga garante que o salto
     inicial já passou quando a escuta começa. */
  const pronto = React.useRef(false);
  React.useEffect(() => {
    if (montou.current) return;
    montou.current = true;
    const t = setTimeout(() => {
      ref.current?.scrollTo({ y: i * ALT, animated: false });
      setTimeout(() => { pronto.current = true; }, 60);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={{ width: largura, height: ALT * VISIVEIS }}>
      {/* A faixa do meio marca onde a lista para. Fica atrás dos números e
          não recebe toque — é régua, não botão.

          Em bg2 ela sumia: o fundo da tela é #F5F6FA e ela era #EDF1F3,
          dois cinzas a três pontos de distância. Na lavagem azul do
          cadastro, então, desaparecia de vez. Agora ela usa a cor de
          seleção do app, que é a mesma coisa que a faixa significa. */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute', left: 0, right: 0, top: ALT * 2, height: ALT,
          backgroundColor: c.accentWeak, borderRadius: radius.md,
          borderWidth: 1, borderColor: c.accentLine,
        }}
      />
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ALT}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={(e) => {
          if (!pronto.current) return;
          const k = Math.round(e.nativeEvent.contentOffset.y / ALT);
          const item = itens[Math.max(0, Math.min(itens.length - 1, k))];
          if (item && item.v !== valor) onEscolhe(item.v);
        }}
        contentContainerStyle={{ paddingVertical: ALT * 2 }}
      >
        {itens.map((x) => (
          <View key={x.v} style={{ height: ALT, alignItems: 'center', justifyContent: 'center' }}>
            <Txt v={x.v === valor ? 'bodyMed' : 'body'} c={x.v === valor ? c.accent : c.tx4}>
              {x.label}
            </Txt>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Botão — cheio para a ação principal, fantasma para a alternativa,
   perigo para o que não volta atrás. Perigo é branco com tinta vermelha e
   não vermelho chapado: apagar um registro é uma operação legítima, não
   um alarme. */
/* ------------------------------------------------------------------ */
/* Item que pode ser apagado — a lixeira arma, o segundo toque confirma.

   A pergunta ocupa a própria linha do item, e não um modal: o que vai
   sumir continua à vista enquanto se decide, e a decisão acontece onde a
   mão já está. Registro de tratamento não devia ir embora com um
   deslize, mas também não merece uma caixa cinza no meio da tela.

   Nasceu na lista de treinos e virou peça quando a de refeições precisou
   do mesmo — duas cópias do mesmo gesto é onde um padrão começa a
   divergir. */
export function ItemApagavel({ pergunta, onApagar, children }: {
  /** A frase da confirmação: "Apagar caminhada de 30 min?" */
  pergunta: string;
  onApagar: () => void;
  children: React.ReactNode;
}) {
  const { c } = useTheme();
  const [armado, setArmado] = useState(false);

  if (armado) {
    return (
      <Row gap={10} style={{ paddingHorizontal: PAD, paddingVertical: 13 }}>
        <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>{pergunta}</Txt>
        <Pressable onPress={() => setArmado(false)} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
          <Txt v="label" c={c.tx3}>Cancelar</Txt>
        </Pressable>
        <Pressable onPress={onApagar} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
          <Txt v="label" c={c.cta}>Apagar</Txt>
        </Pressable>
      </Row>
    );
  }

  return (
    <Row gap={12} style={{ paddingHorizontal: PAD, paddingVertical: 13 }}>
      <View style={{ flex: 1 }}>{children}</View>
      <Pressable onPress={() => setArmado(true)} hitSlop={10} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
        <Icon name="trash" size={16} color={c.tx4} sw={1.9} />
      </Pressable>
    </Row>
  );
}

/* ------------------------------------------------------------------ */
/* O botão de ação, com um estado DESLIGADO.

   Ele já existia à mão em /medir-agua — cinza, tinta apagada, e o rótulo
   dizendo o que falta em vez de prometer uma ação que não acontece. Era
   desenho de botão desligado escrito dentro de uma tela; aqui ele vira
   parte do componente, porque toda folha que salva alguma coisa tem um
   momento em que ainda não há o que salvar.

   Desligado ele NÃO CHAMA onPress: um botão que parece apagado e mesmo
   assim funciona é pior do que um que não parece nada. */
export function Botao({ label, onPress, tom = 'cheio', desligado, pilula }: {
  label: string; onPress?: () => void; tom?: 'cheio' | 'fantasma' | 'perigo'; desligado?: boolean;
  /* PÍLULA — o botão que fecha uma tela inteira, e não um cartão.

     No cadastro cada passo é a tela toda: gradiente no topo, uma pergunta
     no meio, um botão no pé. Ali o raio de cartão faz o botão parecer mais
     um bloco da pilha, e o que ele precisa parecer é o fim dela. Dentro de
     um cartão continua valendo o raio de cartão — daí ser opção, e não
     troca. */
  pilula?: boolean;
}) {
  const { c } = useTheme();
  const fundo = desligado ? c.bg2 : tom === 'cheio' ? c.accent : c.bg1;
  const tinta = desligado ? c.tx4 : tom === 'cheio' ? c.accentInk : tom === 'perigo' ? c.cta : c.tx;
  const borda = desligado || tom === 'cheio' ? 'transparent' : tom === 'perigo' ? c.ctaLine : c.line;
  return (
    <Pressable
      onPress={desligado ? undefined : onPress}
      style={({ pressed }) => [{
        borderRadius: pilula ? radius.pill : radius.md + 3,
        backgroundColor: fundo, borderWidth: 1, borderColor: borda,
        paddingVertical: pilula ? 18 : 16, alignItems: 'center',
        opacity: pressed && !desligado ? 0.85 : 1,
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
