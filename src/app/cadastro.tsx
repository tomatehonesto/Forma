import React, { useMemo, useState } from 'react';
import { View, Pressable, ScrollView, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { MEDS, CADENCE_DAYS } from '../logic/meds';
import { planoDoCadastro, litros } from '../logic/derive';
import { MO, MO_LONG, now, startOfDay, nf } from '../logic/time';
import { Txt, Row, CircleBtn } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { Botao } from '../ui/internas';
import { Malha } from '../ui/instrumentos';
import { useTheme } from '../ui/useTheme';
import { radius, ty, font } from '../theme';

/* ============================================================
   CADASTRO — as doze perguntas antes da primeira tela

   O app inteiro pressupõe um perfil: como a pessoa se chama, quem ela é,
   qual caneta, qual dose, quanto pesa e mede, aonde quer chegar, em que
   ritmo, por quê, desde quando e quem a acompanha. Até aqui essas coisas
   vinham da semente, ou seja, de ninguém.

   TODAS SÃO OBRIGATÓRIAS. A versão que recebi abria dizendo "7 perguntas
   rápidas — todas opcionais" e punha "Pular esta pergunta" no pé de cada
   uma. É simpático e é uma armadilha: quem pula chega numa Home que não
   sabe dizer nada sobre ele.

   A REGRA DE QUE PERGUNTA ENTRA: alguma tela precisa ler a resposta.
   Campo sem leitor vira formulário que cobra trabalho e não devolve nada,
   e num cadastro obrigatório isso cobra duas vezes. Onde cada uma é lida:

     nome           → a saudação da Home e do Insights
     sexo           → a meta de gordura corporal, e as faixas de exame
     nascimento     → a idade, que o perfil mostra e o exame usa
     tratamento     → decide se o início é passado ou futuro
     medicamento    → meia-vida, escada de doses, cadência, validade
     dose           → a próxima aplicação e o estoque da caneta
     intervalo      → cadenciaDias, e com ela as dez contas do ciclo
     altura e peso  → o IMC, a curva de evolução, o "de → para"
     meta e ritmo   → a barra da Jornada e a data projetada
     movimento      → a meta diária de exercício
     início         → "semana N do tratamento", em toda parte
     acompanhamento → hasClinic, a aba Cuidado e o resumo médico

   A ÚNICA QUE AINDA NÃO TEM LEITOR é a MOTIVAÇÃO, e isso está dito aqui
   em vez de escondido. Ela entrou porque o lugar dela é a voz do
   Companion — quem acompanha alguém precisa saber o que essa pessoa veio
   buscar —, e o Companion ainda não a lê. Por enquanto ela aparece na
   tela de plano e fica guardada. Se ficar sem leitor por muito tempo,
   tire: é o mesmo critério das outras.
   ============================================================ */

type Id = 'nome' | 'identidade' | 'nascimento' | 'tratamento' | 'inicio' | 'medicamento'
  | 'dose' | 'corpo' | 'meta' | 'ritmo' | 'motivacao' | 'atividade' | 'saude' | 'recomendacao';

/* A FILA NÃO É FIXA: quem ainda vai começar não responde QUANDO começou.

   Muita gente chega ao app antes de ter receita, e perguntar a data a
   essa pessoa é pedir um palpite para guardar como fato — a data que
   importa é a da primeira dose, e ela vai ser registrada quando
   acontecer. Para quem já aplicou, a pergunta fica: é ela que dá sentido
   a "semana 11 do tratamento". */
const TODOS: Id[] = [
  'nome', 'identidade', 'nascimento', 'tratamento', 'inicio', 'medicamento', 'dose',
  'corpo', 'meta', 'ritmo', 'motivacao', 'atividade', 'saude', 'recomendacao',
];

/* O NÍVEL DE ATIVIDADE DESCREVE O CENÁRIO, e não define meta.

   A versão anterior perguntava a rotina e convertia a resposta em minutos
   por dia — quem dizia "quase não me movimento" saía do cadastro com uma
   meta de 20 minutos. Virou pelo avesso: a pergunta é sobre onde a pessoa
   ESTÁ, e o que o app faz com isso é saber com quem está falando. A meta
   diária de movimento continua a padrão do app, e muda no perfil.

   Os quatro degraus são os de sempre nesse tipo de escala, com o que cada
   um quer dizer em dias por semana — sem isso "levemente ativo" é
   autoavaliação, e cada pessoa se põe num degrau diferente. */
const ATIVIDADE: { id: string; titulo: string; sub: string }[] = [
  { id: 'sedentario', titulo: 'Sedentário', sub: 'pouco ou nenhum exercício' },
  { id: 'leve', titulo: 'Levemente ativo', sub: '1 a 3 dias por semana' },
  { id: 'moderado', titulo: 'Moderadamente ativo', sub: '3 a 5 dias por semana' },
  { id: 'muito', titulo: 'Muito ativo', sub: '6 a 7 dias por semana' },
];

/* O RITMO É META, NÃO PREVISÃO.

   Os três apps que a gente olhou perguntam "quão rápido você quer
   perder", e dois deles respondem com um gráfico dizendo que com o app
   dele é mais rápido. A pergunta é legítima — ter prazo muda o
   comportamento —, a resposta com gráfico não: quanto o peso desce
   depende do corpo e da dose, não do aplicativo.

   Então aqui a pergunta fica e a promessa não. Cada opção mostra o mês em
   que a meta cai NAQUELE ritmo, e o texto embaixo diz que é plano, não
   previsão. Mês, e não dia: projeção com data exata seria afirmar uma
   precisão que a conta não tem.

   CADA OPÇÃO TEM UM APELIDO, e não só um número. "0,5 kg por semana" é
   uma taxa; "devagar e sempre" é uma postura, e é a postura que a pessoa
   está de fato escolhendo — o número é a consequência dela.

   ⚠️ A faixa vai a 2 kg por semana a pedido do produto. O que se cita
   como perda sustentada fica por volta de 0,5 a 1 kg, e acima disso a
   conta é do corpo e da dose, não da vontade — por isso a nota embaixo da
   lista está lá, e por isso nenhuma opção promete nada. */
const RITMOS: { kg: number; nome: string }[] = [
  { kg: 0.5, nome: 'Devagar e sempre' },
  { kg: 1, nome: 'Ritmo constante' },
  { kg: 1.5, nome: 'Acelerado' },
  { kg: 2, nome: 'O mais rápido que der' },
];

/* A motivação, com as opções que os três apps oferecem em comum. */
const MOTIVOS: { id: string; titulo: string; sub: string; ic: string }[] = [
  { id: 'saude', titulo: 'Saúde', sub: 'exames, pressão, glicemia', ic: 'heart' },
  { id: 'energia', titulo: 'Energia', sub: 'disposição no dia', ic: 'bolt' },
  { id: 'espelho', titulo: 'Como me vejo', sub: 'no espelho e nas fotos', ic: 'camera' },
  { id: 'confianca', titulo: 'Confiança', sub: 'me sentir bem comigo', ic: 'spark' },
  { id: 'medico', titulo: 'Orientação médica', sub: 'foi indicação de quem me acompanha', ic: 'steth' },
];

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

type Respostas = {
  nome: string;
  identidade: 'f' | 'm' | 'o' | 'n' | null;
  /* dia, mês (0–11) e ano, guardados soltos porque a roda mexe um de cada
     vez e o dia 31 tem que sobreviver a um passeio por fevereiro. */
  dia: number; mes: number; ano: number;
  emTratamento: boolean | null;
  med: string | null;
  dose: number | null;
  intervalo: number | null;
  altura: number;
  peso: number;
  /** o peso de quando começou — só quem já iniciou responde */
  pesoInicial: number;
  meta: number;
  ritmo: number | null;
  motivacao: string | null;
  atividade: string | null;
  saude: boolean | null;
  inicio: number | null;
  recomendado: boolean | null;
  codigo: string;
};

const VAZIO: Respostas = {
  nome: '', identidade: null,
  /* Data, altura, peso e meta nascem com um número porque os controles
     deles são roda e régua: os dois precisam de uma posição de partida
     para a pessoa arrastar a partir dali. Não são recomendação nenhuma —
     são o meio da faixa. */
  dia: 1, mes: 0, ano: 1990,
  emTratamento: null, med: null, dose: null, intervalo: null,
  altura: 1.7, peso: 80, pesoInicial: 80, meta: 70, ritmo: null,
  motivacao: null, atividade: null, saude: null, inicio: null,
  recomendado: null, codigo: '',
};

/* ------------------------------------------------------------------ */
/* A LAVAGEM DO TOPO — manchas, não rampa.

   A primeira versão era um LinearGradient de três paradas, e ficou feia
   pelo motivo de sempre: rampa linear tem direção, e direção numa
   superfície de fundo lê como listra. As referências não têm rampa — têm
   manchas de cor grandes e desfocadas, que se cruzam e produzem tons que
   não estão em nenhuma delas.

   O app já sabia fazer isso: `Malha`, da aba Cuidado, é exatamente um
   conjunto de blobs em gradiente radial com as cores da marca. A família
   clara dela concentra as manchas à direita e deixa a esquerda quase
   branca — que é onde mora o texto escuro desta tela.

   Por cima, uma rampa só: do transparente ao fundo da tela, na metade de
   baixo. Ela não é a cor — é o desbotamento, e é o que faz a lavagem
   terminar sem borda. */
function Lavagem({ altura }: { altura: number }) {
  const { c } = useTheme();
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: altura }}
    >
      {/* Força baixa. A família clara da malha foi calibrada para o card
          da aba Cuidado, onde ela é o assunto; aqui ela é o ar atrás de
          uma manchete preta, e na força original virava uma mancha azul
          chapada que engolia o texto. */}
      <Malha id="cad" forca={0.38} />
      <LinearGradient
        colors={['transparent', c.bg]}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: altura * 0.5 }}
      />
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* A ESCOLHA — o cartão de uma alternativa.

   `Opc`, do vocabulário, é de uma linha só, e aqui quase toda opção tem
   duas: "Mounjaro" precisa da molécula embaixo, "Já apliquei alguma dose"
   precisa do que aquilo quer dizer. Mora nesta tela porque é o único
   lugar do app onde a lista de alternativas é a tela inteira.

   O ÍCONE É OPCIONAL, e some onde se repete. Os sete medicamentos tinham
   sete pastilhas idênticas de comprimido, e as seis doses, seis seringas
   iguais: ícone que não distingue nada de nada é ruído com aparência de
   informação — e era ele que fazia esses cartões parecerem apertados.
   Fica onde separa: motivo, situação, acompanhamento.

   `cheia` deita o cartão. Quando a opção é uma frase — "me exercito 3 ou
   4 vezes por semana" —, duas colunas quebram o texto em quatro linhas e
   a lista vira parede. */
function Escolha({ ic, titulo, sub, on, cheia, onPress }: {
  ic?: string; titulo: string; sub?: string; on?: boolean; cheia?: boolean; onPress: () => void;
}) {
  const { c } = useTheme();
  /* A MARCA FICA À DIREITA, E EXISTE MESMO DESMARCADA.

     Antes ela só aparecia no cartão escolhido, e com isso a lista dizia
     "aqui tem uma opção marcada" sem dizer "aqui se marca" — quem chega
     na tela precisa ver que aquilo é escolhível antes de escolher. O
     círculo vazio é o convite; cheio, é a resposta.

     Em azul, que é a cor de ação do app: o lima é a cor do feito, e
     escolher no cadastro ainda não é ter feito nada. */
  const marca = (
    <View style={{
      width: 24, height: 24, borderRadius: 12,
      borderWidth: on ? 0 : 1.5, borderColor: c.line2,
      backgroundColor: on ? c.accentInk : 'transparent',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {on ? <Icon name="check" size={13} color={c.accent} sw={3} /> : null}
    </View>
  );
  const selo = ic ? (
    <View style={{
      width: 34, height: 34, borderRadius: 17,
      backgroundColor: on ? 'rgba(255,255,255,0.22)' : c.bg2,
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name={ic} size={16} color={on ? c.accentInk : c.tx3} sw={1.9} />
    </View>
  ) : null;
  /* O ESCOLHIDO É CHEIO, e não contornado.

     Borda azul com lavagem clara pede que o olho compare com os vizinhos
     para decidir qual está marcado — funciona, mas depois de uma
     conferida. Preenchido, a resposta salta antes da leitura: numa fila
     de treze perguntas em que a pessoa marca e segue, é a diferença entre
     olhar e verificar.

     Sem borda no estado normal pelo mesmo motivo de antes: o cartão se
     separa do fundo pelo branco, e borda cinza em oito cartões empilhados
     vira grade de planilha. */
  const moldura = {
    backgroundColor: on ? c.accent : c.bg1,
    borderRadius: radius.lg,
    paddingHorizontal: 18, paddingVertical: 17,
  };
  const tinta = on ? c.accentInk : c.tx;
  const tintaSub = on ? 'rgba(255,255,255,0.78)' : c.tx3;

  if (cheia) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [moldura, {
          flexDirection: 'row', alignItems: 'center', gap: 14, opacity: pressed ? 0.85 : 1,
        }]}
      >
        {selo}
        <View style={{ flex: 1 }}>
          <Txt v="bodyMed" c={tinta}>{titulo}</Txt>
          {sub ? <Txt v="caption" c={tintaSub} style={{ marginTop: 3 }}>{sub}</Txt> : null}
        </View>
        {marca}
      </Pressable>
    );
  }

  /* SEM ÍCONE, A MARCA VAI PARA A LINHA DO TÍTULO.

     Com o ícone, ela mora na fileira de cima e o texto embaixo — as duas
     coisas têm onde ficar. Sem ele, aquela fileira virava um vão vazio
     com um círculo no canto, e o título caía para o pé de um cartão alto
     e oco. Na mesma linha do título, o cartão volta a ter a altura do que
     ele diz. */
  if (!selo) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [moldura, {
          flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center',
          gap: 12, opacity: pressed ? 0.85 : 1,
        }]}
      >
        <View style={{ flex: 1 }}>
          <Txt v="bodyMed" c={tinta} numberOfLines={2}>{titulo}</Txt>
          {sub ? <Txt v="caption" c={tintaSub} style={{ marginTop: 3 }} numberOfLines={2}>{sub}</Txt> : null}
        </View>
        {marca}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [moldura, { flex: 1, minWidth: 0, gap: 14, opacity: pressed ? 0.85 : 1 }]}
    >
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {selo}
        {marca}
      </Row>
      <View>
        <Txt v="bodyMed" c={tinta} numberOfLines={2}>{titulo}</Txt>
        {sub ? <Txt v="caption" c={tintaSub} style={{ marginTop: 3 }} numberOfLines={2}>{sub}</Txt> : null}
      </View>
    </Pressable>
  );
}

/* Duas colunas de largura igual. Ímpar no fim ocupa a linha inteira, e
   não meia: sobrar um vão do lado direito faz a última opção parecer o
   resto de alguma coisa. */
function Duplas({ children }: { children: React.ReactNode }) {
  const itens = React.Children.toArray(children).filter(Boolean);
  const linhas: React.ReactNode[][] = [];
  for (let i = 0; i < itens.length; i += 2) linhas.push(itens.slice(i, i + 2));
  return (
    <View style={{ gap: 10 }}>
      {linhas.map((l, i) => (
        <Row key={i} style={{ gap: 10, alignItems: 'stretch' }}>{l}</Row>
      ))}
    </View>
  );
}

/* O campo de uma linha. `Texto`, do vocabulário, é sempre multilinha —
   serve para uma anotação, não para um nome ou um código, onde o Enter
   não tem o que fazer e o teclado precisa saber se maiúsculiza palavras
   ou caracteres. */
function CampoTexto({ valor, onChange, placeholder, caixa }: {
  valor: string; onChange: (v: string) => void; placeholder: string;
  caixa?: 'words' | 'characters';
}) {
  const { c } = useTheme();
  return (
    <TextInput
      value={valor}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={c.tx4}
      autoCapitalize={caixa ?? 'sentences'}
      autoCorrect={false}
      style={[ty.body, SEM_ANEL, {
        color: c.tx, backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line,
        borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 14,
      }]}
    />
  );
}

/* O rótulo de um controle solto na tela. Era um cartão em volta — e
   cartão em volta de um número enorme é moldura dentro de moldura, já que
   a tela toda é o cartão dele. */
function Rotulo({ children }: { children: React.ReactNode }) {
  const { c } = useTheme();
  return <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1, marginBottom: 10 }}>{children}</Txt>;
}

/* O CONTADOR — o número que a pessoa move.

   O `Stepper` do vocabulário nasceu para viver DENTRO de um cartão de
   formulário, ao lado de outros campos: caixa, rótulo, número de 40 e
   dois quadradinhos de 44. Aqui o número é a tela inteira — é a única
   coisa que a pergunta pede —, e num fundo limpo aquele desenho lia como
   um campo perdido no meio do branco.

   Então: o número grande de verdade, em peso leve, no centro; a unidade
   colada nele em corpo de texto; e os dois botões redondos, longe um do
   outro, do tamanho de um polegar. Sem caixa em volta — o fundo da tela
   já é o cartão.

   Continua digitável: mover de um em um é bom para ajustar, péssimo para
   ir de 1990 a 1975. */
/* O corpo do número grande — o mesmo no contador e na régua. */
const NUMERO = { fontFamily: font.light, fontSize: 52, lineHeight: 60, letterSpacing: -1.5 };

function Contador({ valor, unidade, nota, onMenos, onMais, onDigitar }: {
  valor: string; unidade?: string; nota?: string;
  onMenos: () => void; onMais: () => void; onDigitar?: (v: string) => void;
}) {
  const { c } = useTheme();
  const botao = {
    width: 56, height: 56, borderRadius: 28, backgroundColor: c.bg1,
    alignItems: 'center' as const, justifyContent: 'center' as const,
  };
  const numero = NUMERO;
  return (
    <View style={{ gap: 12 }}>
      <Row style={{ alignItems: 'center' }}>
        <Pressable onPress={onMenos} style={({ pressed }) => [botao, { opacity: pressed ? 0.6 : 1 }]}>
          <View style={{ width: 18, height: 2, borderRadius: 1, backgroundColor: c.tx }} />
        </Pressable>
        {/* O número puxado à direita e a unidade logo depois, com largura
            fixa entre os dois botões: centralizado, o campo crescia até
            empurrar a unidade para a linha de baixo, e sobrava um "kg"
            órfão embaixo do peso. */}
        <Row style={{ flex: 1, justifyContent: 'center', alignItems: 'baseline', gap: 5 }}>
          {onDigitar ? (
            <TextInput
              value={valor}
              onChangeText={onDigitar}
              keyboardType="decimal-pad"
              selectTextOnFocus
              style={[numero, SEM_ANEL, { color: c.tx, textAlign: 'right', width: 132, paddingVertical: 0 }]}
            />
          ) : (
            <Txt style={numero}>{valor}</Txt>
          )}
          {unidade ? <Txt v="body" c={c.tx2} numberOfLines={1}>{unidade}</Txt> : null}
        </Row>
        <Pressable onPress={onMais} style={({ pressed }) => [botao, { opacity: pressed ? 0.6 : 1 }]}>
          <Icon name="plus" size={22} color={c.tx} sw={2.2} />
        </Pressable>
      </Row>
      {nota ? <Txt v="caption" c={c.tx3} style={{ textAlign: 'center' }}>{nota}</Txt> : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* A RODA — a lista que rola até parar no valor.

   É o controle de data de todo sistema operacional, e é o certo aqui
   pelo mesmo motivo que o é lá: escolher um dia entre trinta e um, ou um
   ano entre noventa, com mais e menos custaria dezenas de toques. A roda
   atravessa a lista inteira num gesto.

   O valor sai da POSIÇÃO DA ROLAGEM, quadro a quadro, e não de um evento
   de "parou de rolar". Na web aquele evento não chega de forma
   confiável, e sem ele a roda girava bonito e não mudava nada.

   A rolagem programática acontece uma vez, na montagem. Mandá-la para o
   valor a cada render criaria a briga clássica: o dedo empurra, o código
   devolve, e a lista treme no lugar. */
function Roda({ itens, valor, onEscolhe, largura }: {
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
/* A RÉGUA — o número que se arrasta, ou se digita.

   Mais e menos servem para corrigir em um passo; não servem para dizer
   quanto alguém pesa. A régua atravessa a faixa inteira num gesto e
   mostra a vizinhança do valor — quem está em 82 vê 78 e 86 ao mesmo
   tempo, e isso é o que um par de botões nunca mostra.

   E o número em cima é tocável: para quem já sabe o seu, digitar é mais
   rápido do que qualquer arrasto.

   OS TRAÇOS SÃO MAIS ESPAÇADOS DO QUE O PASSO. O peso anda de cem em cem
   gramas, e desenhar um traço por decigrama seriam mil e quatrocentas
   vistas numa lista que rola. O traço marca a meia unidade; a parada
   continua sendo a do passo, porque ela é do deslocamento, não do
   desenho. */
function Regua({ min, max, passo, tracoCada, casas, esp = 9, salto, valor, unidade, onEscolhe }: {
  min: number; max: number; passo: number; tracoCada: number; casas: number;
  /* pixels por PASSO. O peso anda de cem em cem gramas e a altura de
     centímetro em centímetro: com o mesmo espaçamento, atravessar quarenta
     quilos viraria uma maratona de arrasto. */
  esp?: number;
  /** quanto os botões movem por toque */
  salto: number;
  valor: number; unidade: string; onEscolhe: (v: number) => void;
}) {
  const { c } = useTheme();
  const ESP = esp;
  const ref = React.useRef<ScrollView>(null);
  const montou = React.useRef(false);
  const [larg, setLarg] = useState(0);
  const [digitando, setDigitando] = useState(false);
  const [rascunho, setRascunho] = useState('');

  const aX = (v: number) => ((v - min) / passo) * ESP;
  /* O SALTO INICIAL DEPENDE DA LARGURA, e a largura só existe depois do
     primeiro layout — o recuo lateral do conteúdo é metade dela. Amarrado
     a onContentSizeChange, o salto acontecia cedo demais e a régua abria
     no lugar errado: o número dizia 80 e o marcador apontava 113.

     Por efeito, ele espera a medida chegar e só então salta. E a escuta
     começa depois do salto: ao montar, a lista reporta deslocamento zero,
     e zero lido como resposta grava o mínimo da faixa por cima do valor
     que já estava lá. */
  const pronto = React.useRef(false);
  React.useEffect(() => {
    if (!larg || montou.current) return;
    montou.current = true;
    const t = setTimeout(() => {
      ref.current?.scrollTo({ x: aX(valor), animated: false });
      setTimeout(() => { pronto.current = true; }, 60);
    }, 0);
    return () => clearTimeout(t);
  }, [larg]);

  const tracos: { v: number; forte: boolean }[] = [];
  for (let v = min; v <= max + 1e-9; v = +(v + tracoCada).toFixed(6)) {
    tracos.push({ v: +v.toFixed(casas), forte: Math.abs(v / (tracoCada * 10) - Math.round(v / (tracoCada * 10))) < 1e-6 });
  }

  /* MAIS E MENOS AO LADO DA RÉGUA, e não no lugar dela.

     A régua atravessa a faixa num gesto e mostra a vizinhança do valor; o
     botão acerta a última casa sem ninguém precisar mirar. Cada um é bom
     numa coisa, e a conversa entre os dois é o que faltava: o botão move
     o número E arrasta a régua junto, senão o marcador diria uma coisa e
     o número outra. */
  const mover = (d: number) => {
    const v = +Math.min(max, Math.max(min, valor + d)).toFixed(casas);
    onEscolhe(v);
    ref.current?.scrollTo({ x: aX(v), animated: true });
  };
  const botao = {
    width: 48, height: 48, borderRadius: 24, backgroundColor: c.bg1,
    alignItems: 'center' as const, justifyContent: 'center' as const,
  };

  return (
    <View style={{ gap: 18 }}>
      <Row style={{ justifyContent: 'center', alignItems: 'center', gap: 5 }}>
        <Pressable onPress={() => mover(-salto)} style={({ pressed }) => [botao, { opacity: pressed ? 0.6 : 1 }]}>
          <View style={{ width: 16, height: 2, borderRadius: 1, backgroundColor: c.tx }} />
        </Pressable>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline', gap: 5 }}>
        {digitando ? (
          <TextInput
            value={rascunho}
            onChangeText={setRascunho}
            onBlur={() => {
              const x = parseFloat(rascunho.replace(',', '.'));
              setDigitando(false);
              if (!Number.isNaN(x)) {
                const v = +Math.min(max, Math.max(min, x)).toFixed(casas);
                onEscolhe(v);
                ref.current?.scrollTo({ x: aX(v), animated: false });
              }
            }}
            keyboardType="decimal-pad"
            autoFocus
            selectTextOnFocus
            style={[NUMERO, SEM_ANEL, { color: c.tx, textAlign: 'right', width: 130, paddingVertical: 0 }]}
          />
        ) : (
          <Pressable onPress={() => { setRascunho(nf(valor, casas)); setDigitando(true); }}>
            <Txt style={NUMERO}>{nf(valor, casas)}</Txt>
          </Pressable>
        )}
          <Txt v="body" c={c.tx2}>{unidade}</Txt>
        </View>
        <Pressable onPress={() => mover(salto)} style={({ pressed }) => [botao, { opacity: pressed ? 0.6 : 1 }]}>
          <Icon name="plus" size={20} color={c.tx} sw={2.2} />
        </Pressable>
      </Row>

      <View style={{ height: 74 }} onLayout={(e) => setLarg(Math.round(e.nativeEvent.layout.width))}>
        {larg > 0 ? (
          <>
            <ScrollView
              ref={ref}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={ESP}
              decelerationRate="fast"
              scrollEventThrottle={16}
              onScroll={(e) => {
                if (!pronto.current) return;
                const v = +(min + Math.round(e.nativeEvent.contentOffset.x / ESP) * passo).toFixed(casas);
                const dentro = Math.min(max, Math.max(min, v));
                if (dentro !== valor) onEscolhe(dentro);
              }}
              contentContainerStyle={{ paddingHorizontal: larg / 2 }}
            >
              {/* O traço forte leva o número embaixo. Régua sem número é
                  textura: ela mostra que existe uma faixa e não diz qual.
                  Com o rótulo, a pessoa vê a vizinhança do próprio valor,
                  que é a razão de a régua ganhar dos botões. */}
              {tracos.map((t) => (
                <View key={t.v} style={{ width: (tracoCada / passo) * ESP, height: 74 }}>
                  <View style={{
                    width: 1.5, height: t.forte ? 30 : 15, borderRadius: 1,
                    backgroundColor: t.forte ? c.tx4 : c.line,
                  }} />
                  {t.forte ? (
                    <Txt v="micro" c={c.tx4} style={{ marginTop: 6, marginLeft: -12, width: 28, textAlign: 'center' }}>
                      {nf(t.v, casas === 2 ? 2 : 0)}
                    </Txt>
                  ) : null}
                </View>
              ))}
            </ScrollView>
            {/* O marcador do meio, em cima de tudo e sem toque. */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute', left: larg / 2 - 1.5, top: 0,
                width: 3, height: 38, borderRadius: 2, backgroundColor: c.accent,
              }}
            />
          </>
        ) : null}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* O CALENDÁRIO — mês na tira, dia na grade.

   A versão que recebi usava roda de três colunas (dia / mês / ano). Roda
   é controle de sistema operacional: fora dele, ela vira uma lista que
   rola sem dizer onde termina, e no navegador não rola direito. Aqui o
   mês é uma tira horizontal e o dia é uma grade de sete colunas — dois
   toques, e a pessoa vê o mês inteiro de uma vez.

   Os dias impossíveis ficam apagados e não respondem: quem já começou não
   começou amanhã, e quem vai começar não vai começar ontem. */
const SIGLAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function Calendario({ valor, onEscolhe, futuro }: {
  valor: number | null; onEscolhe: (t: number) => void; futuro: boolean;
}) {
  const { c } = useTheme();
  const hoje = startOfDay(now());

  /* Doze meses para trás, ou este e os dois seguintes. Ninguém começou um
     tratamento em 2019 e vem cadastrar hoje — e se veio, o perfil resolve
     depois com o número exato. */
  const meses = useMemo(() => {
    const fora: { ano: number; mes: number }[] = [];
    const n = futuro ? 3 : 12;
    for (let i = 0; i < n; i++) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() + (futuro ? i : -i), 1);
      fora.push({ ano: d.getFullYear(), mes: d.getMonth() });
    }
    return futuro ? fora : fora.reverse();
  }, [futuro, +hoje]);

  const doValor = valor != null ? new Date(valor) : null;
  const [sel, setSel] = useState(() => {
    const i = doValor
      ? meses.findIndex((m) => m.ano === doValor.getFullYear() && m.mes === doValor.getMonth())
      : -1;
    return i >= 0 ? i : (futuro ? 0 : meses.length - 1);
  });

  const m = meses[Math.min(sel, meses.length - 1)];
  const primeiro = new Date(m.ano, m.mes, 1);
  const dias = new Date(m.ano, m.mes + 1, 0).getDate();
  const vao = primeiro.getDay();

  const podeDia = (d: number) => {
    const t = +new Date(m.ano, m.mes, d);
    return futuro ? t >= +hoje : t <= +hoje;
  };

  /* A TIRA ABRE NO MÊS ESCOLHIDO, e não no começo dela.

     Doze meses não cabem na largura de um telefone, e quem já começou o
     tratamento começou perto de hoje — o mês certo é quase sempre o
     último da fila. Sem isto, a tira abria em outubro do ano passado
     enquanto a grade embaixo mostrava setembro deste.

     Dois gatilhos porque conteúdo e caixa são medidos em ordens
     diferentes conforme a plataforma. Quem vai começar não precisa: o mês
     dele é o primeiro. */
  const tira = React.useRef<ScrollView>(null);
  const aoFim = () => { if (!futuro) tira.current?.scrollToEnd({ animated: false }); };

  return (
    <View style={{ gap: 14 }}>
      <ScrollView
        ref={tira}
        horizontal
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={aoFim}
        onLayout={aoFim}
        contentContainerStyle={{ gap: 7 }}
      >
        {meses.map((x, i) => {
          const on = i === sel;
          return (
            <Pressable
              key={`${x.ano}-${x.mes}`}
              onPress={() => setSel(i)}
              style={({ pressed }) => [{
                paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill,
                borderWidth: 1, borderColor: on ? c.tx : c.line,
                backgroundColor: on ? c.tx : c.bg1, opacity: pressed ? 0.7 : 1,
              }]}
            >
              <Txt v="label" c={on ? c.bg1 : c.tx2}>
                {MO[x.mes]}{x.ano !== hoje.getFullYear() ? ` ${String(x.ano).slice(2)}` : ''}
              </Txt>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 12, gap: 6 }}>
        <Row>
          {SIGLAS.map((s, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center' }}>
              <Txt v="micro" c={c.tx4}>{s}</Txt>
            </View>
          ))}
        </Row>
        {Array.from({ length: Math.ceil((vao + dias) / 7) }, (_, semana) => (
          <Row key={semana}>
            {Array.from({ length: 7 }, (_, col) => {
              const d = semana * 7 + col - vao + 1;
              if (d < 1 || d > dias) return <View key={col} style={{ flex: 1, height: 38 }} />;
              const t = +new Date(m.ano, m.mes, d);
              const on = valor != null && +startOfDay(new Date(valor)) === t;
              const pode = podeDia(d);
              return (
                <Pressable
                  key={col}
                  onPress={pode ? () => onEscolhe(t) : undefined}
                  style={({ pressed }) => [{
                    flex: 1, height: 38, alignItems: 'center', justifyContent: 'center',
                    opacity: pressed && pode ? 0.6 : 1,
                  }]}
                >
                  <View style={{
                    width: 34, height: 34, borderRadius: 17,
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: on ? c.accent : 'transparent',
                  }}>
                    <Txt v="caption" c={on ? c.accentInk : pode ? c.tx : c.tx4}>{d}</Txt>
                  </View>
                </Pressable>
              );
            })}
          </Row>
        ))}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* A DOSE SE ESCREVE COM AS CASAS QUE ELA TEM.

   O formatador do app arredonda para uma casa, e com isso os 0,25 mg do
   Ozempic viravam "0,3 mg" — dose que não existe em caneta nenhuma, logo
   na tela em que a pessoa está escolhendo a dela. */
const doseTxt = (d: number) => nf(d, d % 1 === 0 ? 0 : Math.round(d * 10) === d * 10 ? 1 : 2);

/* O ANEL DE FOCO DO NAVEGADOR não pertence a esta tela.

   No web, todo campo focado ganha o contorno do sistema — e no campo do
   nome, que é grande e não tem moldura nenhuma, ele aparecia como uma
   caixa amarela em volta de quarenta e quatro pixels de texto. Some só no
   web; no aparelho essa propriedade não existe e o objeto é nulo. */
const SEM_ANEL = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null;

const dataPorExtenso = (t: number) => {
  const d = new Date(t);
  return `${d.getDate()} de ${MO_LONG[d.getMonth()]} de ${d.getFullYear()}`;
};

/* Mês e ano, para projeção. Ver o comentário de RITMOS. */
const mesPorExtenso = (t: number) => {
  const d = new Date(t);
  return `${MO_LONG[d.getMonth()]} de ${d.getFullYear()}`;
};

export default function Cadastro() {
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [n, setN] = useState(-1);
  const [r, setR] = useState<Respostas>(VAZIO);
  const p = (x: Partial<Respostas>) => setR((v) => ({ ...v, ...x }));

  /* QUEM ENTROU PELO LÁPIS VOLTA PELO LÁPIS.

     O resumo promete "toque no lápis para mudar qualquer resposta", e
     mudar uma resposta não devia obrigar a atravessar as outras de novo. */
  const [doResumo, setDoResumo] = useState(false);

  const futuro = r.emTratamento === false;
  const med = r.med ? MEDS[r.med] : null;
  const ativ = ATIVIDADE.find((x) => x.id === r.atividade) ?? null;
  const motivo = MOTIVOS.find((x) => x.id === r.motivacao) ?? null;
  const padrao = r.med ? CADENCE_DAYS(r.med) : 7;
  const perder = r.peso - r.meta;

  /* A fila é montada a cada render porque ela depende de uma resposta:
     quem ainda vai começar não responde QUANDO começou. */
  /* Duas perguntas saem da fila conforme as respostas anteriores: quem
     ainda não começou não responde QUANDO começou, e quem não sabe qual
     caneta vai usar não tem escada de dose para escolher. */
  const passos = useMemo(
    () => TODOS.filter((x) => {
      if (x === 'inicio') return r.emTratamento === true;
      if (x === 'dose') return r.med !== 'indefinido';
      return true;
    }),
    [r.emTratamento, r.med],
  );
  const RESUMO = passos.length;
  const PLANO = passos.length + 1;
  const aoResumo = () => { setDoResumo(false); setN(RESUMO); };

  const plano = useMemo(
    () => planoDoCadastro({ altura: r.altura, peso: r.peso, meta: r.meta, ritmo: r.ritmo }),
    [r.altura, r.peso, r.meta, r.ritmo],
  );

  /* A PERGUNTA RESPONDIDA. É ela que liga o botão: sem a resposta o
     "Continuar" fica desligado, e é assim que "obrigatória" se diz sem
     precisar de mensagem de erro.

     Vai por id, e não por posição: a fila muda de tamanho conforme a
     situação da pessoa, e índice fixo numa lista variável é como se
     acerta a pergunta errada.

     O RITMO só existe para quem tem peso a perder. E o CÓDIGO agora
     trava: ele é o que prova que o profissional é mesmo o responsável —
     sem ele, "vim por indicação" é afirmação sem lastro. */
  const respondida = (x: Id): boolean => {
    if (x === 'nome') return r.nome.trim().length > 1;
    if (x === 'identidade') return r.identidade != null;
    if (x === 'tratamento') return r.emTratamento != null;
    if (x === 'medicamento') return r.med != null;
    if (x === 'dose') return r.dose != null;
    if (x === 'ritmo') return perder <= 0 || r.ritmo != null;
    if (x === 'motivacao') return r.motivacao != null;
    if (x === 'atividade') return r.atividade != null;
    if (x === 'saude') return r.saude != null;
    if (x === 'inicio') return r.inicio != null;
    if (x === 'recomendacao') {
      return r.recomendado === false || (r.recomendado === true && r.codigo.trim().length >= 4);
    }
    return true;
  };

  const salvar = () => {
    update((s: any) => {
      s.profile.name = r.nome.trim();
      s.profile.identidade = r.identidade;
      s.profile.nascimento = +new Date(r.ano, r.mes, r.dia);
      s.profile.height = r.altura;
      s.profile.med = r.med;
      s.profile.dose = r.dose;
      /* Só guarda intervalo quando ele DIFERE do catálogo. Igual, seria
         uma segunda cópia do mesmo fato — e no dia em que a bula mudar,
         a cópia não muda junto. */
      s.profile.intervalo = r.intervalo && r.intervalo !== padrao ? r.intervalo : null;
      /* O PESO DE ONDE A PESSOA PARTIU, que não é o de hoje.

         startWeight é a ponta esquerda de todo "de → para" do app. Antes
         ele recebia o peso de hoje, e com isso quem já estava em
         tratamento há dois meses começava a jornada com zero de
         diferença. Quem ainda vai começar não tem essa distinção, e para
         essa pessoa os dois são o mesmo número. */
      s.profile.startWeight = r.emTratamento ? r.pesoInicial : r.peso;
      s.profile.goalWeight = r.meta;
      s.profile.ritmo = r.ritmo;
      s.profile.motivacao = r.motivacao;
      s.profile.atividade = r.atividade;
      /* A INTEGRAÇÃO DE SAÚDE é a mesma chave que a tela de Integrações
         liga — uma fonte só para o mesmo fato. iOS tem Apple Health,
         Android tem Health Connect; ligar os dois faria o perfil afirmar
         uma integração que aquele aparelho não tem. */
      if (r.saude != null) {
        const chave = Platform.OS === 'ios' ? 'appleHealth' : 'healthConnect';
        s.integrations[chave] = r.saude;
      }
      /* Quem ainda vai começar não respondeu data nenhuma, e o dia do
         cadastro é o único marco que existe. Não vira "dia 1 do
         tratamento": diaDoTratamento só conta a partir da primeira dose. */
      s.profile.startT = r.inicio ?? +startOfDay(now());
      /* O CÓDIGO, e só ele. O nome do profissional saiu: o app não tem
         como conferir um nome digitado, e o que liga a pessoa à clínica é
         o código — resolver código em nome é trabalho de servidor. */
      s.profile.convite = r.recomendado ? r.codigo.trim().toUpperCase() : '';
      /* AS METAS DIÁRIAS DEIXAM DE SER AS DA SEMENTE. Proteína e água
         vinham fixas em 90 g e 2,5 L — os números de outra pessoa, lidos
         dez vezes cada um. */
      s.profile.targets.prot = plano.prot;
      s.profile.targets.waterMl = plano.agua;
      /* O peso de hoje entra como PESAGEM, e não só como número do perfil:
         a curva de evolução, o "de → para" da Jornada e a meta leem a
         lista de pesagens. Desduplica por DIA, e não por instante:
         pesagem gravada às três da tarde tem hora no carimbo. */
      const t = +startOfDay(now());
      const resto = (s.weights || []).filter((w: any) => +startOfDay(new Date(w.t)) !== t);
      const pesagens = [...resto, { t, kg: r.peso }];
      /* Quem já começou tem DUAS pesagens de largada: a de quando começou
         e a de hoje. Sem a primeira, a curva de evolução nasce com um
         ponto só e não tem o que desenhar. */
      if (r.emTratamento && r.inicio && +startOfDay(new Date(r.inicio)) !== t) {
        pesagens.push({ t: +startOfDay(new Date(r.inicio)), kg: r.pesoInicial });
      }
      s.weights = pesagens.sort((a: any, b: any) => a.t - b.t);
    });
    setN(PLANO);
  };

  /* ---------- abertura ---------- */
  if (n === -1) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top, paddingHorizontal: 20 }}>
        <Lavagem altura={insets.top + 380} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <View style={{
            width: 56, height: 56, borderRadius: radius.card, backgroundColor: c.bg1,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="heart" size={26} color={c.accent} sw={1.8} />
          </View>
          <Txt v="h1" style={{ textAlign: 'center' }}>Vamos conhecer{'\n'}seu tratamento</Txt>
          {/* A promessa mudou junto com a regra: onde o texto dizia "todas
              opcionais, você pode pular", ele agora diz quanto custa e o
              que muda depois. */}
          <Txt v="caption" c={c.tx2} style={{ textAlign: 'center', maxWidth: 290 }}>
            Perguntas curtas, uma por tela. É com elas que o Morphi monta a sua Home e as
            suas metas do dia — e qualquer uma muda depois, no perfil.
          </Txt>
        </View>
        <View style={{ paddingBottom: insets.bottom + 20 }}>
          <Botao pilula label="Começar" onPress={() => setN(0)} />
        </View>
      </View>
    );
  }

  /* ---------- o plano ---------- */
  if (n === PLANO) {
    const cartoes: [string, string, string][] = [
      ['utensils', 'PROTEÍNA', `${plano.prot} g por dia`],
      ['water', 'ÁGUA', `${litros(plano.agua)} L por dia`],
      ['scale', 'IMC DE HOJE', nf(plano.imc, 1)],
      ['target', 'META', `${nf(r.meta, 1)} kg`],
    ];
    return (
      <View style={{ flex: 1, backgroundColor: c.accent }}>
        <ScrollView contentContainerStyle={{ paddingTop: insets.top + 28, paddingBottom: 0 }}>
          <View style={{ alignItems: 'center', gap: 14, paddingHorizontal: 24, paddingBottom: 32 }}>
            <View style={{
              width: 60, height: 60, borderRadius: 30, backgroundColor: c.lime,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="check" size={28} color={c.limeInk} sw={2.6} />
            </View>
            <Txt v="h1" c={c.accentInk} style={{ textAlign: 'center' }}>
              Tudo certo, {r.nome.trim().split(' ')[0]}
            </Txt>
            <Txt v="caption" c="rgba(255,255,255,0.82)" style={{ textAlign: 'center', maxWidth: 290 }}>
              {futuro
                ? 'O Morphi já está configurado. A contagem do tratamento começa na sua primeira aplicação.'
                : 'O Morphi já está configurado com o que você contou.'}
            </Txt>
          </View>

          {/* A FOLHA BRANCA sobe sobre o azul, como na Home. O que está
              nela não foi digitado por ninguém: são as metas que o app
              montou com as respostas, e é a primeira vez que ele devolve
              alguma coisa em troca do formulário. */}
          <View style={{
            backgroundColor: c.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28,
            paddingHorizontal: 20, paddingTop: 26, paddingBottom: 28, gap: 16, minHeight: 420,
          }}>
            <View>
              <Txt v="h2">Suas metas do dia</Txt>
              <Txt v="caption" c={c.tx2} style={{ marginTop: 6 }}>
                Calculadas do seu peso. São ponto de partida, não prescrição — todas mudam
                no perfil.
              </Txt>
            </View>

            <Duplas>
              {cartoes.map(([ic, rotulo, valor]) => (
                <View key={rotulo} style={{
                  flex: 1, backgroundColor: c.bg1, borderRadius: radius.card, padding: 14, gap: 10,
                }}>
                  <Icon name={ic} size={16} color={c.tx3} sw={1.9} />
                  <View>
                    <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1 }}>{rotulo}</Txt>
                    <Txt v="bodyMed" style={{ marginTop: 3 }}>{valor}</Txt>
                  </View>
                </View>
              ))}
            </Duplas>

            {plano.chegada ? (
              <View style={{ backgroundColor: c.accentWeak, borderRadius: radius.card, padding: 16, gap: 4 }}>
                <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>NO RITMO QUE VOCÊ ESCOLHEU</Txt>
                <Txt v="bodyMed">
                  {nf(r.meta, 1)} kg por volta de {mesPorExtenso(plano.chegada)}
                </Txt>
                {/* Onde os outros apps põem "com o nosso app é 3x mais
                    rápido", aqui vai a ressalva. */}
                <Txt v="caption" c={c.tx2} style={{ marginTop: 2 }}>
                  É a conta do ritmo que você escolheu, não uma previsão: quanto o peso
                  desce depende do corpo e da dose.
                </Txt>
              </View>
            ) : null}

            <View style={{ marginTop: 4 }}>
              <Botao pilula label="Ir para a minha Home" onPress={() => router.replace('/(tabs)' as any)} />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  /* ---------- resumo ---------- */
  if (n === RESUMO) {
    const idade = (() => {
      const h = now();
      let a = h.getFullYear() - r.ano;
      const m = h.getMonth() - r.mes;
      if (m < 0 || (m === 0 && h.getDate() < r.dia)) a -= 1;
      return a;
    })();
    const cartoes: [string, string, string, Id][] = [
      ['user', 'NOME', r.nome.trim(), 'nome'],
      ['heart', 'IDENTIDADE', r.identidade === 'f' ? 'Feminino'
        : r.identidade === 'm' ? 'Masculino'
          : r.identidade === 'o' ? 'Outro' : 'Não informado', 'identidade'],
      ['cal', 'NASCIMENTO', `${r.dia} de ${MESES[r.mes]} de ${r.ano} · ${idade} anos`, 'nascimento'],
      ['spark', 'SITUAÇÃO', futuro ? 'Vou começar' : 'Já em tratamento', 'tratamento'],
      ['pill', 'MEDICAMENTO', med?.label ?? '—', 'medicamento'],
      ...(r.med === 'indefinido' ? [] : [['syringe', 'DOSE',
        r.dose === 0 ? 'Ainda não sei'
          : `${doseTxt(r.dose ?? 0)} ${med?.unit ?? 'mg'}${r.intervalo && r.intervalo !== padrao ? ` · a cada ${r.intervalo} dias` : ''}`,
        'dose'] as [string, string, string, Id]]),
      ['ruler', 'ALTURA E PESO', `${nf(r.altura, 2)} m · ${nf(r.peso, 1)} kg`, 'corpo'],
      ['target', 'META', `${nf(r.meta, 1)} kg`, 'meta'],
      ['trend', 'RITMO', r.ritmo ? `${nf(r.ritmo, 1)} kg por semana` : 'sem peso a perder', 'ritmo'],
      ['bolt', 'MOTIVO', motivo?.titulo ?? '—', 'motivacao'],
      ['dumbbell', 'ATIVIDADE', ativ?.titulo ?? '—', 'atividade'],
      ['activity', 'APP DE SAÚDE', r.saude ? 'Conectar' : 'Agora não', 'saude'],
      ...(futuro ? [] : [['cal', 'INÍCIO', `${r.inicio ? dataPorExtenso(r.inicio) : '—'} · ${nf(r.pesoInicial, 1)} kg`, 'inicio'] as [string, string, string, Id]]),
      ['steth', 'INDICAÇÃO', r.recomendado ? r.codigo.trim().toUpperCase() : 'Cheguei por conta própria', 'recomendacao'],
    ];
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 24 }}>
          <Txt v="h1" style={{ textAlign: 'center' }}>Prontinho</Txt>
          <Txt v="caption" c={c.tx2} style={{ textAlign: 'center', marginTop: 6, marginBottom: 24 }}>
            Toque no lápis para mudar qualquer resposta.
          </Txt>
          <Duplas>
            {cartoes.map(([ic, rotulo, valor, alvo]) => (
              <View
                key={rotulo}
                style={{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.card, padding: 14, gap: 10 }}
              >
                <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Icon name={ic} size={16} color={c.tx3} sw={1.9} />
                  <Pressable
                    onPress={() => { setDoResumo(true); setN(passos.indexOf(alvo)); }}
                    hitSlop={10}
                    style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                  >
                    <Icon name="pencil" size={15} color={c.accent} sw={1.9} />
                  </Pressable>
                </Row>
                <View>
                  <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1 }}>{rotulo}</Txt>
                  <Txt v="bodyMed" style={{ marginTop: 3 }} numberOfLines={2}>{valor}</Txt>
                </View>
              </View>
            ))}
          </Duplas>
        </ScrollView>
        {/* ARRASTAR PARA CONFIRMAR VIROU BOTÃO. O arraste é o gesto de quem
            vai fazer algo que não dá para desfazer; aqui ele guardava a
            porta da Home, e tudo atrás dela muda no perfil. */}
        <View style={{
          paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 20,
          gap: 12, backgroundColor: c.bg,
        }}>
          <Botao pilula label="Confirmar" onPress={salvar} />
          <Pressable
            onPress={() => setN(passos.length - 1)}
            style={({ pressed }) => [{ alignItems: 'center', opacity: pressed ? 0.6 : 1 }]}
          >
            <Txt v="label" c={c.tx3}>Voltar</Txt>
          </Pressable>
        </View>
      </View>
    );
  }

  /* ---------- as perguntas ---------- */
  const id = passos[n];
  const titulos: Record<Id, string> = {
    nome: 'Como podemos te chamar?',
    identidade: 'Como você se identifica?',
    nascimento: 'Quando você nasceu?',
    tratamento: 'Você já está em tratamento?',
    inicio: 'Quando você começou?',
    medicamento: futuro ? 'Qual medicamento você pretende usar?' : 'Qual medicamento você usa?',
    dose: futuro ? 'Com qual dose você pretende começar?' : 'Qual é a sua dose atual?',
    corpo: 'Quais são suas medidas atuais?',
    meta: 'Qual é a sua meta de peso?',
    ritmo: 'Qual ritmo você quer seguir para chegar lá?',
    motivacao: 'O que está te levando a essa jornada?',
    atividade: 'Qual é o seu nível de atividade física?',
    saude: 'Quer conectar seu app de saúde?',
    recomendacao: 'Você chegou ao Morphi por indicação de um especialista?',
  };
  const subs: Record<Id, string> = {
    nome: 'Pode ser só o primeiro nome, ou o apelido que você gosta.',
    /* A JUSTIFICATIVA DE POR QUE PERGUNTAMOS.

       Um dos apps que olhamos diz que usa esses detalhes "para melhorar
       seu rastreamento nutricional e de atividade física". Aqui isso seria
       falso: identidade de gênero não entra em nenhuma conta do Morphi —
       as contas usam peso, altura e o que a pessoa registra. Então a
       justificativa é a verdadeira, que também responde à pergunta: é
       para o app falar com ela do jeito certo, e o corpo entra nas
       perguntas seguintes. Prometer benefício que não existe é como se
       perde a confiança de quem parou para ler. */
    identidade: 'É para o Morphi falar com você do jeito certo. O que entra nas contas de saúde é o seu corpo, e ele vem nas próximas perguntas.',
    nascimento: 'Cada fase da vida tem necessidades diferentes — e a idade entra nas faixas de referência dos seus exames.',
    tratamento: 'Só para saber onde você está agora.',
    inicio: 'Aproximado está bom. É daqui que sai a sua semana de tratamento, e é este peso que vira o começo da sua curva.',
    medicamento: 'É dele que saem a escada de doses e o intervalo entre as aplicações.',
    dose: med && med.doses.length
      ? `Na ordem da titulação do ${med.label}.`
      : 'Na ordem da titulação.',
    corpo: 'É com altura e peso que o Morphi calcula seu IMC e monta suas metas diárias de proteína e água.',
    meta: 'É a referência que o app usa para mostrar o quanto você já andou. Dá para mudar quando quiser.',
    ritmo: `${nf(Math.abs(perder), 1)} kg a percorrer.`,
    motivacao: 'Entender o seu porquê ajuda a gente a te apoiar melhor. Não tem resposta certa.',
    atividade: 'É só para saber de onde você está partindo.',
    saude: 'Peso, passos, sono e treinos entram sozinhos, sem você digitar.',
    recomendacao: 'Quem chega por um profissional parceiro não paga pelo app.',
  };

  const diasNoMes = new Date(r.ano, r.mes + 1, 0).getDate();

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Lavagem altura={insets.top + 320} />

      {/* O TOPO diz onde a pessoa está e não oferece saída. "Pular tudo"
          ficava aqui; com as perguntas obrigatórias, o que sobra é a
          barra, a contagem e o voltar — e os três flutuam sobre a
          lavagem, sem faixa nem fio embaixo. */}
      <View style={{ paddingHorizontal: 20, paddingTop: insets.top + 10 }}>
        <Row gap={12}>
          <CircleBtn name="back" size={38} bg={c.bg1} onPress={() => (doResumo ? aoResumo() : setN(n - 1))} />
          <View style={{
            flex: 1, height: 4, borderRadius: 2, overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255,0.6)',
          }}>
            <View style={{
              width: `${((n + 1) / passos.length) * 100}%`,
              height: '100%', borderRadius: 2, backgroundColor: c.accent,
            }} />
          </View>
          <Txt v="micro" c={c.tx2}>{n + 1} de {passos.length}</Txt>
        </Row>
      </View>

      <ScrollView
        /* AR ENTRE O TOPO E A PERGUNTA. Colada na barra de progresso, a
           manchete lia como cabeçalho de tela; afastada, ela lê como a
           pergunta que é. */
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 64, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* A pergunta mora DENTRO da lavagem, e não abaixo dela: é ela o
            assunto da tela, e o gradiente existe para dar altura ao que
            ela pergunta. As respostas é que caem no branco. */}
        <Txt v="h1">{titulos[id]}</Txt>
        <Txt v="note" c={c.tx2} style={{ marginTop: 10, marginBottom: 28 }}>{subs[id]}</Txt>

        {/* O NOME SE ESCREVE NA TELA, e não dentro de uma caixa. A caixa de
            formulário existe para separar um campo dos outros campos, e
            aqui não há outros — a tela inteira é essa resposta. */}
        {id === 'nome' ? (
          <TextInput
            value={r.nome}
            onChangeText={(v) => p({ nome: v })}
            placeholder="Seu nome"
            placeholderTextColor={c.tx4}
            autoCapitalize="words"
            autoCorrect={false}
            autoFocus
            style={[ty.hero, SEM_ANEL, { color: c.tx, paddingVertical: 0, letterSpacing: -1 }]}
          />
        ) : null}

        {/* IDENTIDADE, E NÃO SEXO BIOLÓGICO — e a diferença tem
            consequência. O sexo biológico é o que define faixa de
            referência de exame e meta de gordura corporal; a identidade
            não define nenhum dos dois, e derivar um alvo clínico dela
            seria imprecisão silenciosa. Por isso esta resposta não alimenta
            mais aquelas contas: ela existe para o app saber com quem
            fala. */}
        {id === 'identidade' ? (
          <View style={{ gap: 10 }}>
            <Escolha
              ic="venus" cheia titulo="Feminino"
              on={r.identidade === 'f'} onPress={() => p({ identidade: 'f' })}
            />
            <Escolha
              ic="mars" cheia titulo="Masculino"
              on={r.identidade === 'm'} onPress={() => p({ identidade: 'm' })}
            />
            <Escolha
              ic="more" cheia titulo="Outro"
              on={r.identidade === 'o'} onPress={() => p({ identidade: 'o' })}
            />
            {/* "Outro" e "prefiro não informar" não são a mesma resposta:
                uma diz quem a pessoa é, a outra diz que ela não quer
                dizer. Juntar as duas obrigaria quem só quer privacidade a
                se declarar. */}
            <Escolha
              ic="lock" cheia titulo="Prefiro não informar"
              on={r.identidade === 'n'} onPress={() => p({ identidade: 'n' })}
            />
          </View>
        ) : null}

        {id === 'nascimento' ? (
          <Row style={{ gap: 10 }}>
            <Roda
              largura={78}
              itens={Array.from({ length: diasNoMes }, (_, k) => ({ v: k + 1, label: String(k + 1) }))}
              valor={Math.min(r.dia, diasNoMes)}
              onEscolhe={(v) => p({ dia: v })}
            />
            <Roda
              largura={142}
              itens={MESES.map((m, k) => ({ v: k, label: m }))}
              valor={r.mes}
              /* Mudar de mês pode deixar o dia fora do calendário — 31 de
                 fevereiro não existe, e guardar isso encostaria um dia
                 inválido na data de nascimento. */
              onEscolhe={(v) => p({ mes: v, dia: Math.min(r.dia, new Date(r.ano, v + 1, 0).getDate()) })}
            />
            <Roda
              largura={90}
              itens={Array.from({ length: now().getFullYear() - 12 - 1920 + 1 }, (_, k) => ({
                v: 1920 + k, label: String(1920 + k),
              }))}
              valor={r.ano}
              onEscolhe={(v) => p({ ano: v, dia: Math.min(r.dia, new Date(v, r.mes + 1, 0).getDate()) })}
            />
          </Row>
        ) : null}

        {id === 'tratamento' ? (
          <View style={{ gap: 10 }}>
            <Escolha
              ic="syringe" cheia titulo="Já iniciei o tratamento" sub="Já apliquei pelo menos uma dose"
              on={r.emTratamento === true} onPress={() => p({ emTratamento: true })}
            />
            <Escolha
              ic="cal" cheia titulo="Vou começar em breve" sub="Ainda não apliquei"
              on={r.emTratamento === false} onPress={() => p({ emTratamento: false })}
            />
          </View>
        ) : null}

        {id === 'medicamento' ? (
          <View style={{ gap: 10 }}>
            {Object.entries(MEDS).filter(([k]) => k !== 'indefinido').map(([k, m]) => (
              <Escolha
                key={k} cheia
                /* O ® é da marca, e escrevê-lo é o mínimo: são sete nomes
                   registrados de três fabricantes, e o app os lista de
                   graça numa tela de cadastro. */
                titulo={`${m.label}®`} sub={m.mol}
                on={r.med === k}
                /* Trocar de caneta zera a dose e o intervalo: a escada é
                   outra e a cadência também. */
                onPress={() => p(r.med === k ? { med: k } : { med: k, dose: null, intervalo: null })}
              />
            ))}
            {/* SÓ PARA QUEM AINDA VAI COMEÇAR. Quem já aplicou sabe o que
                aplicou — oferecer "não sei" ali seria abrir uma saída para
                uma resposta que a pessoa tem, e o app depende dela para
                tudo: meia-vida, cadência, escada de doses, validade. */}
            {futuro ? (
              <Escolha
                cheia titulo="Ainda não sei" sub="Você pode definir depois no seu perfil"
                on={r.med === 'indefinido'}
                onPress={() => p({ med: 'indefinido', dose: null, intervalo: null })}
              />
            ) : null}
          </View>
        ) : null}

        {id === 'dose' && med ? (
          <View style={{ gap: 16 }}>
            <View style={{ gap: 10 }}>
              {med.doses.map((d, i) => (
                <Escolha
                  key={d} cheia
                  titulo={`${doseTxt(d)} ${med.unit}`}
                  sub={i === 0 ? 'dose de início' : i === med.doses.length - 1 ? 'dose máxima' : undefined}
                  on={r.dose === d}
                  onPress={() => p({ dose: d })}
                />
              ))}
              {/* Mesma regra do medicamento: quem já aplicou sabe a dose
                  que aplicou. Quem vai começar muitas vezes ainda não teve
                  a consulta que define isso. */}
              {futuro ? (
                <Escolha
                  cheia titulo="Ainda não sei" sub="quase todo mundo começa pela menor"
                  on={r.dose === 0}
                  onPress={() => p({ dose: 0 })}
                />
              ) : null}
            </View>

            {/* O INTERVALO É EXCEÇÃO, e por isso fica atrás de um toque. O
                app sabe a cadência de cada caneta; mas aplicar a cada dez
                ou catorze dias existe, e para essa pessoa o app contava
                tudo errado e cobrava dose atrasada de quem não estava
                atrasada. */}
            {r.intervalo == null ? (
              <View style={{ gap: 8 }}>
                <Txt v="caption" c={c.tx3}>
                  {padrao === 1
                    ? `${med.label} é de aplicação diária.`
                    : `${med.label} é de aplicação semanal, a cada ${padrao} dias.`}
                </Txt>
                <Pressable
                  onPress={() => p({ intervalo: padrao })}
                  hitSlop={8}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                  <Txt v="label" c={c.accent}>Aplico em outro intervalo</Txt>
                </Pressable>
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                <View>
                  <Rotulo>APLICO A CADA</Rotulo>
                  <Contador
                    valor={String(r.intervalo)}
                    unidade={r.intervalo === 1 ? 'dia' : 'dias'}
                    onMenos={() => p({ intervalo: Math.max(1, (r.intervalo ?? padrao) - 1) })}
                    onMais={() => p({ intervalo: Math.min(60, (r.intervalo ?? padrao) + 1) })}
                  />
                </View>
                <Pressable
                  onPress={() => p({ intervalo: null })}
                  hitSlop={8}
                  style={({ pressed }) => [{ alignItems: 'center', opacity: pressed ? 0.6 : 1 }]}
                >
                  <Txt v="label" c={c.tx3}>Voltar ao intervalo do {med.label}</Txt>
                </Pressable>
              </View>
            )}
          </View>
        ) : null}

        {id === 'corpo' ? (
          <View style={{ gap: 40 }}>
            <View>
              <Rotulo>ALTURA</Rotulo>
              <Regua
                min={1.2} max={2.2} passo={0.01} tracoCada={0.01} casas={2} esp={12} salto={0.01}
                valor={r.altura} unidade="m" onEscolhe={(v) => p({ altura: v })}
              />
            </View>
            <View>
              <Rotulo>PESO DE HOJE</Rotulo>
              <Regua
                min={40} max={180} passo={0.1} tracoCada={0.5} casas={1} esp={5} salto={0.1}
                valor={r.peso} unidade="kg" onEscolhe={(v) => p({ peso: v })}
              />
            </View>
          </View>
        ) : null}

        {id === 'meta' ? (
          <View style={{ gap: 16 }}>
            <Regua
              min={40} max={180} passo={0.1} tracoCada={0.5} casas={1} esp={5} salto={0.5}
              valor={r.meta} unidade="kg" onEscolhe={(v) => p({ meta: v })}
            />
            {/* Meta ACIMA do peso de hoje é escolha legítima de quem está
                subindo de volta, não erro para bloquear. */}
            <Txt v="caption" c={c.tx3} style={{ textAlign: 'center' }}>
              {perder === 0
                ? 'Mesmo peso de hoje — manter também é meta.'
                : `${nf(Math.abs(perder), 1)} kg ${perder > 0 ? 'abaixo' : 'acima'} do seu peso de hoje.`}
            </Txt>
          </View>
        ) : null}

        {id === 'ritmo' ? (
          perder > 0 ? (
            <View style={{ gap: 10 }}>
              {RITMOS.map((x) => {
                const semanas = Math.ceil(perder / x.kg);
                const quando = +startOfDay(now()) + semanas * 7 * 86400000;
                return (
                  <Escolha
                    key={x.kg} cheia
                    /* O NÚMERO É O TÍTULO, e o apelido desce para a linha
                       de baixo. É entre os números que a pessoa compara —
                       "devagar e sempre" não se compara com "acelerado"
                       sem saber quanto cada um vale. O apelido diz o que
                       aquilo significa depois que ela já viu o quanto. */
                    titulo={`${nf(x.kg, 1)} kg por semana`}
                    sub={`${x.nome} · chega por volta de ${mesPorExtenso(quando)}`}
                    on={r.ritmo === x.kg}
                    onPress={() => p({ ritmo: x.kg })}
                  />
                );
              })}
              <Txt v="caption" c={c.tx3} style={{ marginTop: 4 }}>
                É o ritmo que você quer seguir, não uma previsão: quanto o peso desce
                depende do corpo e da dose.
              </Txt>
            </View>
          ) : (
            <Txt v="note" c={c.tx3}>
              Sua meta não é perder peso, então não há ritmo a escolher aqui.
            </Txt>
          )
        ) : null}

        {id === 'motivacao' ? (
          <View style={{ gap: 10 }}>
            {MOTIVOS.map((x) => (
              <Escolha
                key={x.id} cheia ic={x.ic} titulo={x.titulo} sub={x.sub}
                on={r.motivacao === x.id}
                onPress={() => p({ motivacao: x.id })}
              />
            ))}
          </View>
        ) : null}

        {id === 'atividade' ? (
          <View style={{ gap: 10 }}>
            {ATIVIDADE.map((x) => (
              <Escolha
                key={x.id} cheia titulo={x.titulo} sub={x.sub}
                on={r.atividade === x.id}
                onPress={() => p({ atividade: x.id })}
              />
            ))}
          </View>
        ) : null}

        {id === 'inicio' ? (
          <View style={{ gap: 32 }}>
            <Calendario valor={r.inicio} onEscolhe={(t) => p({ inicio: t })} futuro={false} />
            {/* O PESO DAQUELA ÉPOCA, aqui e não junto do peso de hoje: os
                dois são a mesma grandeza em dois momentos, e perguntados
                lado a lado é onde alguém responde o mesmo número duas
                vezes sem perceber. Perto da data, fica claro de quando ele
                é. */}
            <View>
              <Rotulo>PESO DE QUANDO COMEÇOU</Rotulo>
              <Contador
                valor={nf(r.pesoInicial, 1)}
                unidade="kg"
                onMenos={() => p({ pesoInicial: Math.max(35, Math.round((r.pesoInicial - 0.1) * 10) / 10) })}
                onMais={() => p({ pesoInicial: Math.min(300, Math.round((r.pesoInicial + 0.1) * 10) / 10) })}
                onDigitar={(v) => {
                  const x = parseFloat(v.replace(',', '.'));
                  if (!Number.isNaN(x)) p({ pesoInicial: Math.min(300, Math.max(35, x)) });
                }}
              />
            </View>
          </View>
        ) : null}

        {/* A INDICAÇÃO, E O CÓDIGO QUE A PROVA.

            A pergunta deixou de ser "alguém acompanha você?" e passou a ser
            a que importa comercialmente: veio por um parceiro? E o código
            deixou de ser opcional — ele é o que prova que o profissional é
            mesmo o responsável. Sem ele, "vim por indicação" é afirmação
            sem lastro, e é ela que libera o app.

            O nome do profissional saiu do formulário: o app não tem como
            conferir um nome digitado, e resolver o código em nome é
            trabalho de servidor. O que esta tela pode fazer é aceitar e
            guardar — sem "código válido", sem carimbo verde, sem dizer que
            a partir de agora é grátis. */}
        {/* A INTEGRAÇÃO DE SAÚDE, logo depois da atividade física.

            É onde ela cai naturalmente: a pessoa acabou de dizer quanto se
            mexe, e a pergunta seguinte é se o app pode ver isso sozinho.
            De largada, é o que enche peso, passos, sono e treino sem
            ninguém digitar.

            ⚠️ A CONEXÃO EM SI AINDA NÃO ACONTECE AQUI. O módulo nativo de
            Apple Health / Health Connect não está no projeto, então esta
            tela liga a mesma chave que a tela de Integrações liga — a
            intenção fica registrada, e a permissão de sistema é pedida
            quando o módulo existir. Por isso o texto não diz "conectado":
            dizer isso seria o app afirmar um acesso que ele não tem. */}
        {id === 'saude' ? (
          <View style={{ gap: 16 }}>
            <View style={{ gap: 10 }}>
              <Escolha
                ic="activity" cheia titulo="Quero conectar"
                sub={Platform.OS === 'ios' ? 'Apple Saúde' : 'Health Connect'}
                on={r.saude === true} onPress={() => p({ saude: true })}
              />
              <Escolha
                ic="x" cheia titulo="Agora não" sub="dá para ligar depois, nas integrações"
                on={r.saude === false} onPress={() => p({ saude: false })}
              />
            </View>
            {r.saude ? (
              <Txt v="caption" c={c.tx3}>
                A integração fica ligada no seu perfil. A permissão de leitura é pedida
                pelo próprio sistema do aparelho.
              </Txt>
            ) : null}
          </View>
        ) : null}

        {id === 'recomendacao' ? (
          <View style={{ gap: 16 }}>
            <View style={{ gap: 10 }}>
              <Escolha
                ic="steth" cheia titulo="Sim" sub="tenho um código de convite"
                on={r.recomendado === true} onPress={() => p({ recomendado: true })}
              />
              <Escolha
                ic="user" cheia titulo="Não" sub="cheguei por conta própria"
                on={r.recomendado === false} onPress={() => p({ recomendado: false, codigo: '' })}
              />
            </View>

            {r.recomendado ? (
              <View style={{ gap: 8 }}>
                <Rotulo>CÓDIGO DE CONVITE</Rotulo>
                <CampoTexto
                  valor={r.codigo}
                  onChange={(v) => p({ codigo: v })}
                  placeholder="O código que o profissional te passou"
                  caixa="characters"
                />
                <Txt v="caption" c={c.tx3}>
                  É ele que liga a sua conta ao profissional. A conferência acontece depois.
                </Txt>
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      {/* O RODAPÉ É OPACO. Sem fundo, a lista de opções passava por baixo
          do botão e a última delas aparecia cortada ao meio atrás de uma
          pílula translúcida. */}
      <View style={{
        paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 20,
        backgroundColor: c.bg,
      }}>
        <Botao
          pilula
          label={doResumo || n === passos.length - 1 ? 'Ver o resumo' : 'Continuar'}
          desligado={!respondida(id)}
          onPress={() => (doResumo ? aoResumo() : setN(n + 1))}
        />
      </View>
    </View>
  );
}
