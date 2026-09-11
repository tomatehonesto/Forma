import React, { useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet, TextInput, StyleProp, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Txt, Row } from './kit';
import { Icon } from './Icon';
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
  titulo, acao, iconeAcao, onAcao, fechar, rodape, children,
}: {
  titulo: string;
  /** rótulo curto da ação à direita ("Nova", "Salvar") */
  acao?: string;
  /** ícone no lugar do rótulo, quando a ação é um gesto e não uma palavra */
  iconeAcao?: string;
  onAcao?: () => void;
  /** troca o "‹" por "✕" — fluxos de captura se fecham, não voltam */
  fechar?: boolean;
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
            onPress={() => router.back()}
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

      {rodape ? (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: PAD, paddingTop: 18, paddingBottom: (insets.bottom || 12) + 14, gap: 8 }}>
          {/* Véu do transparente até o fundo: o conteúdo some por baixo do
              botão em vez de esbarrar nele, e o botão não precisa de sombra
              para se separar da lista. */}
          <LinearGradient
            colors={['rgba(0,0,0,0)', c.bg, c.bg]}
            locations={[0, 0.3, 1]}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
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
      <Txt v="micro" c={fg} style={{ fontFamily: font.bodyMed }}>{label}</Txt>
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
export function Aviso({ ic = 'info', titulo, texto }: { ic?: string; titulo?: string; texto: string }) {
  const { c } = useTheme();
  return (
    <Row style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: PAD, gap: 11, alignItems: 'flex-start' }, shadowCard(c)]}>
      <Icon name={ic} size={18} color={c.accent} sw={1.9} />
      <View style={{ flex: 1 }}>
        {titulo ? <Txt v="bodyMed" style={{ marginBottom: 2 }}>{titulo}</Txt> : null}
        <Txt v="caption" c={c.tx2}>{texto}</Txt>
      </View>
    </Row>
  );
}

/* ------------------------------------------------------------------ */
/* Campo — o invólucro de um controle de formulário: rótulo em caixa alta,
   controle, e uma linha de ajuda. A ajuda não é decorativa: é onde o app
   diz por que a pergunta existe e o que a resposta muda. */
export function Campo({ rotulo, ajuda, children }: { rotulo?: string; ajuda?: string; children: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: PAD, gap: 11 }, shadowCard(c)]}>
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
      <Txt v="label" c={on ? c.accent : c.tx2}>{label}</Txt>
    </Pressable>
  );
}

/* Stepper — menos, valor grande, mais. Para peso e dose: são números que a
   pessoa ajusta em passos conhecidos, e abrir teclado numérico para isso
   erra mais do que acerta (75,1 vira 751 com um toque a mais). */
export function Stepper({ valor, unidade, onMenos, onMais }: {
  valor: string; unidade: string; onMenos: () => void; onMais: () => void;
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
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Txt v="metric" style={{ letterSpacing: -1 }}>
          {valor}
          <Txt v="label" c={c.tx2}>{` ${unidade}`}</Txt>
        </Txt>
      </View>
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
export function Escala({ valores, valor, onChange, suave }: {
  valores: (string | number)[]; valor: string | number | null;
  onChange: (v: string | number) => void; suave?: boolean;
}) {
  const { c } = useTheme();
  return (
    <Row style={{ gap: 6 }}>
      {valores.map((v) => {
        const on = v === valor;
        return (
          <Pressable
            key={String(v)}
            onPress={() => onChange(v)}
            style={({ pressed }) => [{
              flex: 1, height: 42, borderRadius: radius.md, borderWidth: 1,
              borderColor: on ? (suave ? c.accentLine : c.accent) : c.line,
              backgroundColor: on ? (suave ? c.accentWeak : c.accent) : c.bg1,
              alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.7 : 1,
            }]}
          >
            <Txt v="label" c={on ? (suave ? c.accent : c.accentInk) : c.tx2}>{String(v)}</Txt>
          </Pressable>
        );
      })}
    </Row>
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
