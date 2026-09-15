import React, { useMemo, useState } from 'react';
import { Animated, View, Pressable, ScrollView, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { MEDS, CADENCE_DAYS } from '../logic/meds';
import { FAIXAS_IMC, faixaDoIMC, litros, planoDoCadastro } from '../logic/derive';
import { MO, MO_LONG, now, startOfDay, nf } from '../logic/time';
import { Txt, Row, CircleBtn, SectionHead } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { Botao } from '../ui/internas';
import { Malha } from '../ui/instrumentos';
import { AreaCurve } from '../ui/charts';
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
  | 'dose' | 'frequencia' | 'corpo' | 'meta' | 'ritmo' | 'motivacao' | 'atividade'
  | 'saude' | 'recomendacao';

/* A FILA NÃO É FIXA: quem ainda vai começar não responde QUANDO começou.

   Muita gente chega ao app antes de ter receita, e perguntar a data a
   essa pessoa é pedir um palpite para guardar como fato — a data que
   importa é a da primeira dose, e ela vai ser registrada quando
   acontecer. Para quem já aplicou, a pergunta fica: é ela que dá sentido
   a "semana 11 do tratamento". */
const TODOS: Id[] = [
  'nome', 'identidade', 'nascimento', 'tratamento', 'inicio', 'medicamento', 'dose',
  'frequencia', 'corpo', 'meta', 'ritmo', 'motivacao', 'atividade', 'saude', 'recomendacao',
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
  /* A data do início em três peças, como a de nascimento: a roda mexe uma
     de cada vez, e o dia 31 tem que sobreviver a um passeio por
     fevereiro. Vira carimbo só na hora de salvar. */
  iDia: number; iMes: number; iAno: number;
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
  motivacao: null, atividade: null, saude: null,
  iDia: now().getDate(), iMes: now().getMonth(), iAno: now().getFullYear(),
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
function Escolha({ ic, titulo, sub, selo, on, cheia, onPress }: {
  ic?: string; titulo: string; sub?: string; on?: boolean; cheia?: boolean; onPress: () => void;
  /* A ETIQUETA — "Frequência padrão" ao lado de "a cada 7 dias". Diz qual
     das alternativas é a que o produto indica, sem transformar as outras
     em erro: quem aplica a cada dez dias faz isso com o médico, e o app
     não está ali para discordar. */
  selo?: string;
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
  const etiqueta = selo ? (
    <View style={{
      backgroundColor: on ? 'rgba(255,255,255,0.18)' : c.accentWeak,
      borderWidth: 1, borderColor: on ? 'rgba(255,255,255,0.28)' : 'transparent',
      borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 4,
    }}>
      <Txt v="micro" c={on ? c.accentInk : c.accent}>{selo}</Txt>
    </View>
  ) : null;
  const pastilha = ic ? (
    <View style={{
      width: 32, height: 32, borderRadius: 16,
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
  /* A ALTURA É CURTA DE PROPÓSITO. Sete canetas e seis doses não cabem
     numa tela com cartão de dezessete de folga em cima e embaixo, e uma
     lista que só mostra quatro de sete obriga a rolar para descobrir que
     existe uma oitava. Treze pontos ainda dão um alvo confortável de
     dedo, e a lista inteira passa a caber. */
  const moldura = {
    backgroundColor: on ? c.accent : c.bg1,
    borderRadius: radius.lg,
    paddingHorizontal: 16, paddingVertical: 13,
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
        {pastilha}
        <View style={{ flex: 1 }}>
          <Txt v="bodyMed" c={tinta}>{titulo}</Txt>
          {sub ? <Txt v="caption" c={tintaSub} style={{ marginTop: 1 }}>{sub}</Txt> : null}
        </View>
        {etiqueta}
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
  if (!pastilha) {
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
          {sub ? <Txt v="caption" c={tintaSub} style={{ marginTop: 1 }} numberOfLines={2}>{sub}</Txt> : null}
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
        {pastilha}
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
/* A DOSE SE ESCREVE COM AS CASAS QUE ELA TEM.

   O formatador do app arredonda para uma casa, e com isso os 0,25 mg do
   Ozempic viravam "0,3 mg" — dose que não existe em caneta nenhuma, logo
   na tela em que a pessoa está escolhendo a dela. */
/* O NÚMERO EM PROSA. A régua escreve 10,0 porque anda de 0,1 em 0,1, e
   dentro dela a casa decimal é informação. Numa frase, ninguém diz
   "perder dez vírgula zero quilos". */
const kgTxt = (v: number) => nf(v, v % 1 === 0 ? 0 : 1);

const doseTxt = (d: number) => nf(d, d % 1 === 0 ? 0 : Math.round(d * 10) === d * 10 ? 1 : 2);

/* O ANEL DE FOCO DO NAVEGADOR não pertence a esta tela.

   No web, todo campo focado ganha o contorno do sistema — e no campo do
   nome, que é grande e não tem moldura nenhuma, ele aparecia como uma
   caixa amarela em volta de quarenta e quatro pixels de texto. Some só no
   web; no aparelho essa propriedade não existe e o objeto é nulo. */
const SEM_ANEL = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null;

const SOBREPOSTO = { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 } as const;

/* A CONSTELAÇÃO DE FUNDO da tela de saúde. Não informa nada, e é esse o
   trabalho dela: é textura, e é o que faz o quadro parecer o lugar onde
   dado de saúde mora. As posições são na mão porque sorteio de verdade
   sempre encosta dois no mesmo canto e deixa o outro vazio — e porque
   nenhum deles pode cair atrás dos dois quadrados do meio. */
const GLIFOS: [string, number, number, number][] = [
  ['drop2', 4, 6, 20], ['activity', 18, 26, 18], ['flame', 32, 4, 17], ['target', 46, 24, 16],
  ['bolt', 60, 6, 19], ['pill', 74, 26, 18], ['waves', 88, 8, 20],
  ['trophy', 1, 96, 17], ['brain', 92, 92, 18],
  ['scale', 5, 142, 18], ['moon', 20, 158, 17], ['dumbbell', 34, 140, 20],
  ['heart', 48, 160, 19], ['ruler', 62, 142, 17], ['leaf', 76, 156, 18],
  ['clock', 90, 140, 17],
];

/* ------------------------------------------------------------------ */
/* MONTANDO O PLANO — os três segundos entre a conferência e o plano.

   Não é enfeite, e também não é mentira: o app de fato calcula aqui
   (metas do dia, semanas até a meta, IMC, e a gravação do perfil inteiro
   no armazenamento), só que calcula rápido demais para alguém perceber.
   Sem esta tela, tocar em "montar o meu plano" trocava a tela no mesmo
   quadro — e um plano que aparece instantâneo não parece um plano, parece
   uma tela que já estava pronta.

   As três frases dizem o que está sendo feito, na ordem em que é feito. A
   barra anda sozinha até o fim e não finge progresso real: ela mede o
   tempo da espera, que é o único número honesto que existe aqui. */
const FASES = [
  'Lendo as suas respostas',
  'Calculando as suas metas do dia',
  'Desenhando a sua jornada',
];

function Montando({ onFim }: { onFim: () => void }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const [fase, setFase] = React.useState(0);
  const pulso = React.useRef(new Animated.Value(0)).current;
  const barra = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    /* useNativeDriver desligado: a largura da barra não é animável pela
       thread nativa, e na web o driver nativo não existe de todo jeito. */
    Animated.loop(Animated.sequence([
      Animated.timing(pulso, { toValue: 1, duration: 850, useNativeDriver: false }),
      Animated.timing(pulso, { toValue: 0, duration: 850, useNativeDriver: false }),
    ])).start();
    Animated.timing(barra, { toValue: 1, duration: 2700, useNativeDriver: false }).start();
    const t = [
      setTimeout(() => setFase(1), 950),
      setTimeout(() => setFase(2), 1900),
      setTimeout(onFim, 2850),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <View style={{
      flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center',
      paddingHorizontal: 32, paddingBottom: insets.bottom, gap: 28,
    }}>
      <Lavagem altura={560} />
      <Animated.View style={{
        transform: [{ scale: pulso.interpolate({ inputRange: [0, 1], outputRange: [1, 1.07] }) }],
      }}>
        <View style={{
          width: 96, height: 96, borderRadius: 32, backgroundColor: c.accent,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="heart" size={44} color={c.accentInk} sw={1.9} />
        </View>
      </Animated.View>

      <View style={{ alignItems: 'center', gap: 8 }}>
        <Txt v="h2" style={{ textAlign: 'center' }}>Montando o seu plano</Txt>
        <Txt v="note" c={c.tx2} style={{ textAlign: 'center' }}>{FASES[fase]}</Txt>
      </View>

      <View style={{
        width: 170, height: 5, borderRadius: 3, backgroundColor: c.track, overflow: 'hidden',
      }}>
        <Animated.View style={{
          height: '100%', borderRadius: 3, backgroundColor: c.accent,
          width: barra.interpolate({ inputRange: [0, 1], outputRange: ['4%', '100%'] }),
        }} />
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* O DESENHO DA SINCRONIA.

   As referências resolvem esta tela com uma imagem, e resolvem bem: os
   dois aplicativos lado a lado, a seta circular entre eles, e uma
   constelação apagada de símbolos de saúde atrás — que não informa nada e
   é justamente o que faz a tela parecer o lugar onde dado de saúde mora.

   ELA VEM ANTES DA FRASE, e não depois. Em todas as telas do cadastro a
   pergunta é o assunto e por isso abre; aqui o assunto é uma coisa que a
   pessoa reconhece de olhar — dois apps se dando as mãos —, e a imagem
   explica mais rápido do que a linha de texto que viria antes dela.

   O QUE NÃO COPIAMOS: o logo da Apple. Marca de terceiro num cadastro é
   marca usada sem licença, e o desenho funciona igual com o símbolo
   genérico de saúde. */
function Sincronia() {
  const { c } = useTheme();
  return (
    <View style={{ height: 184, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
      <View style={{ ...SOBREPOSTO, opacity: 0.085 }} pointerEvents="none">
        {GLIFOS.map(([ic, x, y, t], i) => (
          <View key={i} style={{ position: 'absolute', left: `${x}%`, top: y }}>
            <Icon name={ic} size={t} color={c.tx} sw={1.6} />
          </View>
        ))}
      </View>
      <Row style={{ alignItems: 'center', gap: 6 }}>
        <View style={{
          width: 84, height: 84, borderRadius: 26, backgroundColor: c.accent,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="heart" size={38} color={c.accentInk} sw={1.9} />
        </View>
        <Row style={{ width: 74, alignItems: 'center', gap: 8 }}>
          <View style={{ flex: 1, height: 1.5, backgroundColor: c.accentLine }} />
          <Icon name="reset" size={20} color={c.accent} sw={2.2} />
          <View style={{ flex: 1, height: 1.5, backgroundColor: c.accentLine }} />
        </Row>
        <View style={{
          width: 84, height: 84, borderRadius: 26, backgroundColor: c.bg1,
          borderWidth: 1, borderColor: c.line,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="activity" size={38} color={c.rose} sw={2} />
        </View>
      </Row>
    </View>
  );
}

/* A DATA CURTA — a da conferência, onde ela divide a linha com um rótulo
   e um lápis. "15 de setembro de 2026" ali dentro quebra em duas linhas
   ou some no meio de reticências. */
const dataCurta = (t: number) => {
  const d = new Date(t);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

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
  const inicio = +new Date(r.iAno, r.iMes, r.iDia);
  /* Um intervalo que não está entre as alternativas prontas — é ele que
     mantém o contador aberto na tela de frequência. */
  const outroIntervalo = r.intervalo != null
    && !(padrao === 1 ? [1] : [7, 10, 14]).includes(r.intervalo);
  const nivel = Math.max(0, ATIVIDADE.findIndex((x) => x.id === r.atividade));

  /* A fila é montada a cada render porque ela depende de uma resposta:
     quem ainda vai começar não responde QUANDO começou. */
  /* Duas perguntas saem da fila conforme as respostas anteriores: quem
     ainda não começou não responde QUANDO começou, e quem não sabe qual
     caneta vai usar não tem escada de dose para escolher. */
  const passos = useMemo(
    () => TODOS.filter((x) => {
      if (x === 'inicio') return r.emTratamento === true;
      if (x === 'dose' || x === 'frequencia') return r.med !== 'indefinido';
      return true;
    }),
    [r.emTratamento, r.med],
  );
  const RESUMO = passos.length;
  const MONTANDO = passos.length + 1;
  const PLANO = passos.length + 2;
  const aoResumo = () => { setDoResumo(false); setN(RESUMO); };
  /* Ir para a próxima é uma coisa só, e agora dois rodapés diferentes
     fazem isso: o "Continuar" de sempre e o "Conectar" da tela de saúde.
     Quem veio do resumo volta para o resumo, dos dois jeitos. */
  const avanca = () => (doResumo ? aoResumo() : setN(n + 1));
  const appSaude = Platform.OS === 'ios' ? 'Apple Saúde' : 'Health Connect';

  const plano = useMemo(
    () => planoDoCadastro({
      altura: r.altura, peso: r.peso, meta: r.meta, ritmo: r.ritmo, atividade: nivel,
    }),
    [r.altura, r.peso, r.meta, r.ritmo, nivel],
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
    /* A roda não deixa escolher um dia que ainda não aconteceu, então
       chegar aqui já significa uma data válida. */
    if (x === 'inicio') return inicio <= +startOfDay(now());
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
      s.profile.startT = r.emTratamento ? +startOfDay(new Date(inicio)) : +startOfDay(now());
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
      if (r.emTratamento && +startOfDay(new Date(inicio)) !== t) {
        pesagens.push({ t: +startOfDay(new Date(inicio)), kg: r.pesoInicial });
      }
      s.weights = pesagens.sort((a: any, b: any) => a.t - b.t);
    });
    setN(MONTANDO);
  };

  /* ---------- montando ---------- */
  if (n === MONTANDO) return <Montando onFim={() => setN(PLANO)} />;

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

  /* ---------- o plano ----------

     A DEVOLUTIVA, e um resumo VISUAL. Catorze perguntas depois, é a
     primeira vez que o app dá alguma coisa em troca do formulário — e o
     que ele dá não é o que a pessoa digitou (isso é a tela de conferir),
     é o que aquilo virou.

     A TELA É ESCURA, E É A ÚNICA ASSIM NO CADASTRO. O app é claro do
     começo ao fim; esta é a última tela do fluxo e a única que não pede
     nada — inverter a superfície é o jeito mais barato de dizer "acabou,
     e o que vem agora é seu". O gradiente é o mesmo painel azul da
     Jornada, e os cartões viram vidro sobre ele.

     O TEXTO É CURTO. Toda frase aqui disputa espaço com um número, e o
     número é o assunto.

     O QUE NÃO VEIO DAS REFERÊNCIAS:

       · caloria, carboidrato e gordura em gramas. Carboidrato e gordura
         só existem como fatia de uma meta de energia, e o Morphi não
         conta caloria por decisão de produto — /alimentacao tem uma seção
         explicando por quê. Fibra entra porque a recomendação dela é
         absoluta e não depende de caloria nenhuma.
       · "você começa a ver diferença em 30 de setembro". A linha do tempo
         aqui é aritmética do ritmo escolhido, e diz isso.
       · o selo de "baseado em evidência científica". Os coeficientes que
         este app usa ainda carregam ⚠️ de procedência em meds.ts e
         derive.ts: ninguém conferiu um por um contra a diretriz vigente.
         No lugar do selo vai a seção que mostra de onde sai cada número —
         que é o que um selo desses deveria significar. */
  if (n === PLANO) {
    const primeiro = r.nome.trim().split(' ')[0];
    const marca = r.med !== 'indefinido' && med ? ` com o ${med.label}®` : '';
    const alvo = perder > 0.05 ? `perder ${kgTxt(perder)} kg`
      : perder < -0.05 ? `ganhar ${kgTxt(-perder)} kg`
        : 'manter o seu peso';
    const inter = r.intervalo ?? padrao;
    const cadTexto = inter === 1 ? 'todos os dias'
      : inter === 7 ? 'uma vez por semana' : `a cada ${inter} dias`;
    /* A LINHA DO TEMPO É ARITMÉTICA, e não previsão. Três marcos: hoje, o
       meio do caminho e a meta, cada um com a data que o ritmo escolhido
       produz. A referência promete aqui "quando você começa a ver
       efeito"; isso ninguém sabe, e a conta do ritmo, sim. */
    const marcos = plano.semanas && r.ritmo
      ? (() => {
        const meio = Math.max(1, Math.round(plano.semanas / 2));
        const quando = (sem: number) => {
          const d = new Date(+startOfDay(now()) + sem * 7 * 86400000);
          return sem === 0 ? 'hoje' : `${d.getDate()} de ${MESES[d.getMonth()].slice(0, 3)}`;
        };
        return [
          { sem: 0, kg: r.peso, rot: 'hoje', quando: quando(0) },
          { sem: meio, kg: r.peso - (r.ritmo as number) * meio, rot: `${meio} semanas`, quando: quando(meio) },
          { sem: plano.semanas, kg: r.meta, rot: `${plano.semanas} semanas`, quando: quando(plano.semanas) },
        ];
      })()
      : null;
    const pos = (v: number) => Math.max(0, Math.min(1, (v - 15) / 25));
    /* AS CORES DA RÉGUA SÃO FIXAS porque a superfície é fixa: esta tela é
       escura nos dois temas, e um token claro do tema — o verde-oliva, o
       mostarda — vira lama sobre o azul profundo. São os valores da
       paleta escura do Morphi: roxo, turquesa, lima, âmbar, rosa, alerta. */
    const CORES_IMC = ['#9D86FF', '#15E4CB', '#DDF62C', '#E0BC4A', '#F26A9B', '#FF5A5A'];
    const fxHoje = faixaDoIMC(plano.imc);
    const fxMeta = faixaDoIMC(plano.imcMeta);
    const iHoje = FAIXAS_IMC.indexOf(fxHoje);
    const iMeta = FAIXAS_IMC.indexOf(fxMeta);
    const AJUDA: [string, string, string][] = [
      ['syringe', 'Cada dose no lugar certo', 'o rodízio dos locais e o ciclo da caneta, sem você contar'],
      ['mood', 'O enjoo em números', 'o que você sente vira padrão, e o padrão vai para a consulta'],
      ['scale', 'A sua curva de peso', 'cada pesagem entra na linha, com a leitura do que mudou'],
      ['doc', 'Um resumo para a consulta', 'doses, sintomas e peso organizados numa página só'],
    ];
    const FONTES: [string, string][] = [
      ['Proteína', '1,2 g por quilo de peso'],
      ['Água', '35 ml por quilo, mais o seu nível de atividade'],
      ['Fibra', '25 g por dia, a recomendação para adultos'],
      ['IMC', 'as faixas da OMS para adultos'],
      ['Ritmo', 'o que você escolheu — não é projeção'],
    ];
    /* O título de seção é o miúdo em caixa alta: numa tela que é toda
       cartão, um h2 a cada quatro parágrafos vira degrau. */
    const Secao = ({ t }: { t: string }) => (
      <Txt v="micro" c={c.onHero2} style={{ letterSpacing: 1.2, marginBottom: 12 }}>{t}</Txt>
    );
    const vidro = {
      backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassLine,
      borderRadius: radius.lg,
    };
    return (
      <View style={{ flex: 1, backgroundColor: c.altTo }}>
        <LinearGradient
          colors={[c.altFrom, c.altMid, c.altTo]}
          start={{ x: 0, y: 0 }} end={{ x: 0.9, y: 1 }}
          style={SOBREPOSTO}
        />
        <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
          <View style={{
            paddingTop: insets.top + 34, paddingHorizontal: 24, paddingBottom: 32,
            alignItems: 'center', gap: 14,
          }}>
            <View style={{
              width: 58, height: 58, borderRadius: 29, backgroundColor: c.lime,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="check" size={27} color={c.limeInk} sw={2.6} />
            </View>
            <Txt v="h1" c={c.onHero} style={{ textAlign: 'center' }}>
              {`${primeiro}, seu plano personalizado está pronto!`}
            </Txt>
            <Txt v="note" c={c.onHero2} style={{ textAlign: 'center' }}>
              {`Para ${alvo}${marca}.`}
            </Txt>
            {/* AS DUAS ETIQUETAS DIZEM O QUE É VERDADE HOJE. A segunda
                seria "com base em estudos científicos" se alguém já
                tivesse conferido os coeficientes contra a diretriz — e
                não conferiu. Ela aponta para a última seção, que mostra
                de onde sai cada número. */}
            <Row style={{ gap: 8, justifyContent: 'center' }}>
              {([['user', 'Das suas respostas'], ['info', 'Com as contas à mostra']] as [string, string][])
                .map(([ic, t]) => (
                  <Row key={t} style={{
                    gap: 6, alignItems: 'center', backgroundColor: c.onHeroWeak,
                    borderWidth: 1, borderColor: c.onHeroLine, borderRadius: radius.pill,
                    paddingHorizontal: 11, paddingVertical: 7,
                  }}>
                    <Icon name={ic} size={13} color={c.onHero2} sw={2} />
                    <Txt v="micro" c={c.onHero}>{t}</Txt>
                  </Row>
                ))}
            </Row>
          </View>

          <View style={{ paddingHorizontal: 20, gap: 30 }}>
            {/* ---------- o dia ---------- */}
            <View>
              <Secao t="O SEU DIA" />
              <Row style={{ gap: 8, alignItems: 'stretch' }}>
                {([
                  ['utensils', 'Proteína', `${plano.prot}`, 'g'],
                  ['water', 'Água', litros(plano.agua), 'L'],
                  ['leaf', 'Fibra', '25', 'g'],
                ] as [string, string, string, string][]).map(([ic, nome, val, un]) => (
                  <View key={nome} style={[vidro, { flex: 1, padding: 13 }]}>
                    <Icon name={ic} size={17} color={c.lime} sw={1.9} />
                    <Row style={{ marginTop: 16, alignItems: 'center' }}>
                      <Txt v="metric" c={c.onHero} style={{ fontSize: 28, lineHeight: 34 }}>{val}</Txt>
                      <Txt v="caption" c={c.onHero2} style={{ marginLeft: 3, marginTop: 4 }}>{un}</Txt>
                    </Row>
                    <Txt v="caption" c={c.onHero2} style={{ marginTop: 1 }}>{nome}</Txt>
                  </View>
                ))}
              </Row>
            </View>

            {/* ---------- a dose ---------- */}
            <View>
              <Secao t="A SUA DOSE" />
              <View style={[vidro, { padding: 16, gap: 12 }]}>
                {r.med === 'indefinido' ? (
                  <>
                    <Row style={{ gap: 12, alignItems: 'center' }}>
                      <View style={{
                        width: 44, height: 44, borderRadius: 14, backgroundColor: c.onHeroWeak,
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon name="syringe" size={21} color={c.onHero2} sw={1.9} />
                      </View>
                      <Txt v="body" c={c.onHero} style={{ flex: 1 }}>Ainda a definir</Txt>
                    </Row>
                    <Txt v="caption" c={c.onHero2}>
                      Quando você souber a caneta, eu monto a escada de doses e o ciclo.
                    </Txt>
                  </>
                ) : (
                  <>
                    <Row style={{ gap: 12, alignItems: 'center' }}>
                      <View style={{
                        width: 44, height: 44, borderRadius: 14, backgroundColor: c.onHeroWeak,
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon name="syringe" size={21} color={c.lime} sw={1.9} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Txt v="body" c={c.onHero}>{`${med?.label}®`}</Txt>
                        <Txt v="note" c={c.onHero2} style={{ marginTop: 1 }}>{cadTexto}</Txt>
                      </View>
                      {r.dose ? (
                        <Row style={{ alignItems: 'center' }}>
                          <Txt v="metric" c={c.onHero} style={{ fontSize: 28, lineHeight: 34 }}>{doseTxt(r.dose)}</Txt>
                          <Txt v="caption" c={c.onHero2} style={{ marginLeft: 3, marginTop: 4 }}>{med?.unit}</Txt>
                        </Row>
                      ) : null}
                    </Row>
                    <Txt v="caption" c={c.onHero2}>
                      O ciclo começa na primeira aplicação que você registrar.
                    </Txt>
                  </>
                )}
              </View>
            </View>

            {/* ---------- a linha do tempo ---------- */}
            {marcos ? (
              <View>
                <Secao t="ATÉ A SUA META" />
                <View style={[vidro, { padding: 18 }]}>
                  {marcos.map((m, i) => (
                    <Row key={m.rot} style={{ alignItems: 'flex-start', gap: 14 }}>
                      {/* O fio e a bolinha. O último marco é lima cheia —
                          é a chegada; os outros, vazados. */}
                      <View style={{ alignItems: 'center', width: 18 }}>
                        <View style={{
                          width: 14, height: 14, borderRadius: 7, marginTop: 5,
                          borderWidth: 2.5, borderColor: i === marcos.length - 1 ? c.lime : c.onHeroLine,
                          backgroundColor: i === marcos.length - 1 ? c.lime : 'transparent',
                        }} />
                        {i < marcos.length - 1 ? (
                          <View style={{ width: 2, flex: 1, minHeight: 34, backgroundColor: c.onHeroLine }} />
                        ) : null}
                      </View>
                      <View style={{ flex: 1, paddingBottom: i < marcos.length - 1 ? 18 : 0 }}>
                        <Row style={{ alignItems: 'baseline', gap: 5 }}>
                          <Txt v="title" c={i === marcos.length - 1 ? c.lime : c.onHero}>
                            {nf(m.kg, 1)}
                          </Txt>
                          <Txt v="caption" c={c.onHero2}>kg</Txt>
                        </Row>
                        <Txt v="caption" c={c.onHero2} style={{ marginTop: 1 }}>
                          {m.sem === 0 ? 'hoje' : `em ${m.rot} · ${m.quando}`}
                        </Txt>
                      </View>
                    </Row>
                  ))}
                </View>
                <Txt v="caption" c={c.onHero2} style={{ marginTop: 10 }}>
                  {`É a conta de ${nf(r.ritmo ?? 0, 1)} kg por semana, o ritmo que você escolheu — não é previsão.`}
                </Txt>
              </View>
            ) : null}

            {/* ---------- o corpo ---------- */}
            <View>
              <Secao t="O SEU CORPO" />
              <View style={[vidro, { padding: 18, gap: 18 }]}>
                <Row style={{ alignItems: 'center', gap: 10 }}>
                  {([[fxHoje, 'IMC de hoje', plano.imc, iHoje, 'flex-start'],
                    [fxMeta, 'Na sua meta', plano.imcMeta, iMeta, 'flex-end']] as const)
                    .map(([fx, rot, val, idx, lado], i) => (
                      <React.Fragment key={rot}>
                        {i ? <Icon name="chev" size={15} color={c.onHero2} sw={2} /> : null}
                        <View style={{ flex: 1, gap: 4, alignItems: lado }}>
                          <Txt v="caption" c={c.onHero2}>{rot}</Txt>
                          <Txt v="metric" c={c.onHero} style={{ fontSize: 28, lineHeight: 34 }}>{nf(val, 1)}</Txt>
                          <Row style={{ gap: 6, alignItems: 'center' }}>
                            <View style={{
                              width: 7, height: 7, borderRadius: 4, backgroundColor: CORES_IMC[idx],
                            }} />
                            <Txt v="micro" c={c.onHero}>{fx.nome}</Txt>
                          </Row>
                        </View>
                      </React.Fragment>
                    ))}
                </Row>

                {/* A RÉGUA VOLTOU A TER NÍVEIS SEPARADOS — o degradê
                    apagava justamente o que ela existe para mostrar, que é
                    onde uma faixa acaba e a outra começa. O que estava
                    feio eram as cores: verde-oliva, mostarda e dois
                    vermelhos iguais. Agora são as da paleta. */}
                <View>
                  <Row style={{ gap: 3 }}>
                    {FAIXAS_IMC.map((fx, i) => (
                      <View key={fx.nome} style={{
                        flex: fx.ate - fx.de, height: 10, borderRadius: 5,
                        backgroundColor: CORES_IMC[i],
                        opacity: i === iHoje || i === iMeta ? 1 : 0.45,
                      }} />
                    ))}
                  </Row>
                  <View style={{
                    position: 'absolute', top: -4, left: `${pos(plano.imcMeta) * 100}%`,
                    marginLeft: -9, width: 18, height: 18, borderRadius: 9,
                    borderWidth: 3, borderColor: c.onHero,
                  }} />
                  <View style={{
                    position: 'absolute', top: -4, left: `${pos(plano.imc) * 100}%`,
                    marginLeft: -9, width: 18, height: 18, borderRadius: 9,
                    borderWidth: 3, borderColor: c.onHero, backgroundColor: c.onHero,
                  }} />
                </View>

                <Txt v="caption" c={c.onHero2}>
                  O IMC é ponto de partida: ele não separa músculo de gordura.
                </Txt>
              </View>
            </View>

            {/* ---------- como eu ajudo ---------- */}
            <View>
              <Secao t="COMO EU TE AJUDO" />
              <View style={{ gap: 16 }}>
                {AJUDA.map(([ic, t, sub]) => (
                  <Row key={t} style={{ gap: 13, alignItems: 'center' }}>
                    <View style={{
                      width: 42, height: 42, borderRadius: 13, backgroundColor: c.onHeroWeak,
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon name={ic} size={20} color={c.lime} sw={1.9} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Txt v="bodyMed" c={c.onHero}>{t}</Txt>
                      <Txt v="caption" c={c.onHero2} style={{ marginTop: 1 }}>{sub}</Txt>
                    </View>
                  </Row>
                ))}
              </View>
            </View>

            {/* ---------- de onde vêm os números ---------- */}
            <View>
              <Secao t="DE ONDE VÊM OS NÚMEROS" />
              <View style={[vidro, { paddingHorizontal: 16 }]}>
                {FONTES.map(([t, sub], i) => (
                  <View key={t} style={{
                    paddingVertical: 12,
                    borderTopWidth: i ? 1 : 0, borderTopColor: c.onHeroLine,
                  }}>
                    <Txt v="label" c={c.onHero}>{t}</Txt>
                    <Txt v="caption" c={c.onHero2} style={{ marginTop: 1 }}>{sub}</Txt>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* O BOTÃO É BRANCO porque o fundo é escuro — o azul de ação do app
            some sobre o azul do painel. */}
        <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 20 }}>
          <Pressable
            onPress={() => router.replace('/(tabs)' as any)}
            style={({ pressed }) => [{
              borderRadius: radius.pill, backgroundColor: c.onHero, paddingVertical: 18,
              alignItems: 'center', opacity: pressed ? 0.85 : 1,
            }]}
          >
            <Txt v="bodyMed" c="#0A0A0A">Ir para a minha Home</Txt>
          </Pressable>
        </View>
      </View>
    );
  }

  /* ---------- confere ----------

     A ÚLTIMA PARADA ANTES DE ESCREVER O PERFIL. Ela existe porque quinze
     respostas foram dadas uma de cada vez, e ninguém lembra a nona.

     AS LINHAS ANDAM EM GRUPOS. Quinze seguidas são uma parede onde tudo
     tem o mesmo peso e nada se acha; separadas em quem você é, o
     tratamento, a meta e o app, a pessoa sabe onde procurar a que quer
     corrigir antes de começar a ler.

     A linha inteira abre a pergunta; o lápis do fim é só a marca de que
     ela abre. */
  if (n === RESUMO) {
    const idade = (() => {
      const h = now();
      let a = h.getFullYear() - r.ano;
      const m = h.getMonth() - r.mes;
      if (m < 0 || (m === 0 && h.getDate() < r.dia)) a -= 1;
      return a;
    })();
    const freq = (() => {
      const d = r.intervalo ?? padrao;
      return d === 1 ? 'Todos os dias' : `A cada ${d} dias`;
    })();
    type L = [string, string, string, Id];
    const grupos: [string, L[]][] = [
      ['VOCÊ', [
        ['user', 'Nome', r.nome.trim(), 'nome'],
        /* SEXO, e não "identidade": o rótulo de uma conferência é o nome
           curto da coisa, e é esse nome que a pessoa procura quando quer
           corrigir. A pergunta continua sendo como ela se identifica, com
           "prefiro não informar" entre as respostas. */
        ['heart', 'Sexo', r.identidade === 'f' ? 'Feminino'
          : r.identidade === 'm' ? 'Masculino'
            : r.identidade === 'o' ? 'Outro' : 'Não informado', 'identidade'],
        ['cal', 'Nascimento', `${dataCurta(+new Date(r.ano, r.mes, r.dia))} · ${idade} anos`, 'nascimento'],
        ['ruler', 'Altura e peso', `${nf(r.altura, 2)} m · ${nf(r.peso, 1)} kg`, 'corpo'],
        ['dumbbell', 'Atividade', ativ?.titulo ?? '—', 'atividade'],
      ]],
      ['O TRATAMENTO', [
        ['spark', 'Situação', futuro ? 'Vou começar' : 'Já em tratamento', 'tratamento'],
        ...(futuro ? [] : [['clock', 'Comecei em', `${dataCurta(inicio)} · ${nf(r.pesoInicial, 1)} kg`, 'inicio'] as L]),
        ['pill', 'Medicamento', r.med === 'indefinido' ? 'Ainda não sei' : `${med?.label}®`, 'medicamento'],
        ...(r.med === 'indefinido' ? [] : [
          ['syringe', 'Dose', r.dose === 0 ? 'Ainda não sei' : `${doseTxt(r.dose ?? 0)} ${med?.unit ?? 'mg'}`, 'dose'] as L,
          ['reset', 'Frequência', freq, 'frequencia'] as L,
        ]),
      ]],
      ['A SUA META', [
        ['target', 'Peso', `${nf(r.meta, 1)} kg`, 'meta'],
        ['trend', 'Ritmo', r.ritmo ? `${nf(r.ritmo, 1)} kg por semana` : 'sem peso a perder', 'ritmo'],
        ['bolt', 'Motivo', motivo?.titulo ?? '—', 'motivacao'],
      ]],
      ['NO APP', [
        ['activity', 'App de saúde', r.saude ? 'Conectar' : 'Agora não', 'saude'],
        ['steth', 'Indicação', r.recomendado ? r.codigo.trim().toUpperCase() : 'Por conta própria', 'recomendacao'],
      ]],
    ];
    return (
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <Lavagem altura={insets.top + 300} />
        <ScrollView contentContainerStyle={{
          paddingHorizontal: 20, paddingTop: insets.top + 36, paddingBottom: 24,
        }}>
          <Txt v="h1" style={{ textAlign: 'center' }}>Antes de concluir</Txt>
          <Txt v="note" c={c.tx2} style={{ textAlign: 'center', marginTop: 8, marginBottom: 28 }}>
            Confirme as informações — é delas que sai o seu plano.
          </Txt>

          <View style={{ gap: 22 }}>
            {grupos.map(([titulo, itens]) => (
              <View key={titulo}>
                <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1.2, marginBottom: 10 }}>{titulo}</Txt>
                <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, paddingHorizontal: 16 }}>
                  {itens.map(([ic, rotulo, valor, destino], i) => (
                    <Pressable
                      key={rotulo}
                      onPress={() => { setDoResumo(true); setN(passos.indexOf(destino)); }}
                      style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                    >
                      <Row style={{
                        gap: 12, alignItems: 'center', paddingVertical: 13,
                        borderTopWidth: i ? 1 : 0, borderTopColor: c.line2,
                      }}>
                        <Icon name={ic} size={18} color={c.tx4} sw={1.9} />
                        <Txt v="caption" c={c.tx3}>{rotulo}</Txt>
                        <Txt v="label" style={{ flex: 1, textAlign: 'right' }} numberOfLines={1}>
                          {valor}
                        </Txt>
                        <Icon name="pencil" size={14} color={c.accent} sw={2} />
                      </Row>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={{
          paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 20,
          gap: 12, backgroundColor: c.bg,
        }}>
          <Botao pilula label="Montar o meu plano" onPress={salvar} />
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
    frequencia: futuro ? 'De quanto em quanto tempo você vai aplicar?' : 'De quanto em quanto tempo você aplica?',
    corpo: 'Quais são suas medidas atuais?',
    meta: 'Qual é a sua meta de peso?',
    ritmo: 'Qual ritmo você quer seguir para chegar lá?',
    motivacao: 'O que está te levando a essa jornada?',
    atividade: 'Qual é o seu nível de atividade física?',
    saude: 'Conecte o seu app de saúde',
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
    frequencia: 'É daqui que saem a contagem do ciclo, os lembretes e o estoque da caneta.',
    corpo: 'É com altura e peso que o Morphi calcula seu IMC e monta suas metas diárias de proteína e água.',
    meta: 'É a referência que o app usa para mostrar o quanto você já andou. Dá para mudar quando quiser.',
    ritmo: `${nf(Math.abs(perder), 1)} kg a percorrer.`,
    motivacao: 'Não existe resposta certa. Vale a que você lembraria num dia difícil.',
    atividade: 'Entra na sua meta diária de água — quem se mexe mais perde mais líquido — e diz ao Morphi de onde você está partindo.',
    saude: 'O seu aparelho já mede. O Morphi só lê.',
    recomendacao: 'Quem chega por um profissional parceiro não paga pelo app.',
  };

  const diasNoMes = new Date(r.ano, r.mes + 1, 0).getDate();
  const hoje = startOfDay(now());

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      {/* A MALHA NÃO VAI PARA A TELA DE SAÚDE. Lá o desenho dos dois
          aplicativos é que é o assunto, e ele já tem a constelação atrás —
          duas texturas no mesmo lugar viram só borrão azul. */}
      {id === 'saude' ? null : <Lavagem altura={insets.top + 320} />}

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
        /* A TELA DE SAÚDE SE APOIA NO RODAPÉ. As outras começam em cima,
           porque a pergunta é a primeira coisa; esta é um convite, e
           convite se lê de baixo para cima — o botão, os motivos, a
           frase, e a imagem ocupando a sobra. */
        contentContainerStyle={id === 'saude'
          ? { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 34, flexGrow: 1, justifyContent: 'center' }
          : { paddingHorizontal: 20, paddingTop: 64, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* A pergunta mora DENTRO da lavagem, e não abaixo dela: é ela o
            assunto da tela, e o gradiente existe para dar altura ao que
            ela pergunta. As respostas é que caem no branco. */}
        {id === 'saude' ? <Sincronia /> : null}
        <Txt v="h1" style={id === 'saude' ? { textAlign: 'center' } : null}>{titulos[id]}</Txt>
        <Txt
          v="note" c={c.tx2}
          style={[
            { marginTop: 10, marginBottom: id === 'saude' ? 22 : 28 },
            id === 'saude' ? { textAlign: 'center' } : null,
          ]}
        >
          {subs[id]}
        </Txt>

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
          <View style={{ gap: 8 }}>
            {/* "AINDA NÃO SEI" ABRE A LISTA, e não fecha.

                No fim, ela vinha depois de sete marcas — e quem não sabe o
                nome da caneta tinha de percorrer as sete para chegar na
                única resposta que era a dele. Como a lista não cabe numa
                tela, isso é rolagem às cegas, e o caminho mais curto passa
                a ser marcar uma marca qualquer. A resposta de quem ainda
                não teve a consulta é a primeira que ele vê.

                SÓ PARA QUEM AINDA VAI COMEÇAR. Quem já aplicou sabe o que
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
          </View>
        ) : null}

        {id === 'dose' && med ? (
          <View style={{ gap: 16 }}>
            <View style={{ gap: 8 }}>
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

          </View>
        ) : null}

        {/* A FREQUÊNCIA VIROU PERGUNTA, e saiu do rodapé da tela de dose.

            Lá ela era uma linha azul escrita "aplico em outro intervalo",
            escondida embaixo da escada de doses: quem aplica a cada dez ou
            catorze dias — e isso existe, combinado com o médico — tinha de
            reparar num link para o app parar de cobrar dose atrasada dela.
            Uma coisa da qual dependem a contagem do ciclo, os lembretes e
            o estoque não mora no rodapé de outra pergunta.

            E A ETIQUETA DIZ QUAL É A PADRÃO. Sem ela, quatro alternativas
            iguais fazem parecer que o app não sabe qual é a indicada; com
            ela, a resposta comum fica óbvia e as outras continuam sendo
            respostas, e não desvios. */}
        {id === 'frequencia' && med ? (
          <View style={{ gap: 16 }}>
            <View style={{ gap: 8 }}>
              {(padrao === 1 ? [1] : [7, 10, 14]).map((d) => (
                <Escolha
                  key={d} cheia
                  titulo={d === 1 ? 'Todos os dias' : `A cada ${d} dias`}
                  selo={d === padrao ? 'Padrão' : undefined}
                  on={d === padrao ? r.intervalo == null || r.intervalo === padrao : r.intervalo === d}
                  onPress={() => p({ intervalo: d === padrao ? null : d })}
                />
              ))}
              <Escolha
                cheia titulo="Outro intervalo"
                sub={outroIntervalo ? `a cada ${r.intervalo} dias` : 'você diz de quantos em quantos dias'}
                on={outroIntervalo}
                onPress={() => p({ intervalo: padrao === 1 ? 2 : 9 })}
              />
            </View>

            {outroIntervalo ? (
              <View>
                <Rotulo>APLICO A CADA</Rotulo>
                <Contador
                  valor={String(r.intervalo)}
                  unidade={r.intervalo === 1 ? 'dia' : 'dias'}
                  onMenos={() => p({ intervalo: Math.max(1, (r.intervalo ?? padrao) - 1) })}
                  onMais={() => p({ intervalo: Math.min(60, (r.intervalo ?? padrao) + 1) })}
                />
              </View>
            ) : null}
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
            {/* A DISTÂNCIA É O ASSUNTO DA TELA, e não o número absoluto.

                "70 kg" é uma meta; "você quer perder 10 kg" é o que a
                pessoa vai atravessar, e é o que ela fica pensando depois
                de fechar o app. Por isso a diferença sai da legenda cinza
                e vira o segundo número grande da tela.

                E O RÓTULO É UMA FRASE, não uma etiqueta. "DAQUI ATÉ LÁ"
                em caixa alta é como se nomeia um campo de formulário; a
                tela toda é uma conversa, e aqui ela devolve à pessoa o
                que a pessoa acabou de decidir.

                Meta ACIMA do peso de hoje é escolha legítima de quem está
                subindo de volta, não erro para bloquear. */}
            {perder === 0 ? (
              <Txt v="caption" c={c.tx3} style={{ textAlign: 'center' }}>
                Mesmo peso de hoje — manter também é meta.
              </Txt>
            ) : (
              <View style={{
                backgroundColor: c.accentWeak, borderRadius: radius.card,
                paddingVertical: 18, paddingHorizontal: 16, gap: 2, alignItems: 'center',
              }}>
                <Txt v="label" c={c.accent}>
                  {perder > 0 ? 'Você quer perder' : 'Você quer ganhar'}
                </Txt>
                <Row style={{ alignItems: 'baseline', gap: 4 }}>
                  <Txt style={[NUMERO, { fontSize: 40, lineHeight: 48 }]}>{nf(Math.abs(perder), 1)}</Txt>
                  <Txt v="body" c={c.tx2}>kg</Txt>
                </Row>
                <Txt v="caption" c={c.tx2} style={{ textAlign: 'center', marginTop: 4 }}>
                  Uma semana de cada vez — e eu acompanho cada uma delas com você.
                </Txt>
              </View>
            )}
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

        {/* A MESMA RODA DA DATA DE NASCIMENTO.

            Aqui havia tira de meses e grade de dias — dois controles
            diferentes para a mesma coisa que a tela de nascimento já
            resolvia com um. Duas gramáticas de data no mesmo formulário é
            a pessoa reaprendendo a responder no meio do caminho.

            As rodas se limitam ao passado: quem já começou não começou
            amanhã, e o mês e o dia encolhem quando o ano é o de agora. */}
        {id === 'inicio' ? (
          <View style={{ gap: 32 }}>
            <Row style={{ gap: 10 }}>
              <Roda
                largura={78}
                itens={Array.from(
                  { length: r.iAno === hoje.getFullYear() && r.iMes === hoje.getMonth()
                    ? hoje.getDate() : new Date(r.iAno, r.iMes + 1, 0).getDate() },
                  (_, k) => ({ v: k + 1, label: String(k + 1) }),
                )}
                valor={r.iDia}
                onEscolhe={(v) => p({ iDia: v })}
              />
              <Roda
                largura={142}
                itens={MESES
                  .map((m, k) => ({ v: k, label: m }))
                  .filter((x) => r.iAno < hoje.getFullYear() || x.v <= hoje.getMonth())}
                valor={r.iMes}
                onEscolhe={(v) => p({
                  iMes: v,
                  iDia: Math.min(r.iDia, new Date(r.iAno, v + 1, 0).getDate()),
                })}
              />
              <Roda
                largura={90}
                itens={Array.from({ length: 6 }, (_, k) => {
                  const a = hoje.getFullYear() - 5 + k;
                  return { v: a, label: String(a) };
                })}
                valor={r.iAno}
                onEscolhe={(v) => p({
                  iAno: v,
                  iMes: v === hoje.getFullYear() ? Math.min(r.iMes, hoje.getMonth()) : r.iMes,
                  iDia: Math.min(r.iDia, new Date(v, r.iMes + 1, 0).getDate()),
                })}
              />
            </Row>
            {/* O PESO DAQUELA ÉPOCA, aqui e não junto do peso de hoje: os
                dois são a mesma grandeza em dois momentos, e perguntados
                lado a lado é onde alguém responde o mesmo número duas
                vezes sem perceber. Perto da data, fica claro de quando ele
                é. */}
            {/* O MESMO CONTROLE DOS OUTROS PESOS: régua para arrastar, mais
                e menos para acertar, e o número tocável para digitar. Era
                um contador só — três jeitos de dizer peso em duas telas e
                um jeito só nesta. */}
            <View>
              <Rotulo>PESO DE QUANDO COMEÇOU</Rotulo>
              <Regua
                min={40} max={180} passo={0.1} tracoCada={0.5} casas={1} esp={5} salto={0.1}
                valor={r.pesoInicial} unidade="kg" onEscolhe={(v) => p({ pesoInicial: v })}
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
            De largada, é o que enche peso, sono e treino sem ninguém
            digitar.

            ⚠️ A CONEXÃO EM SI AINDA NÃO ACONTECE AQUI. O módulo nativo de
            Apple Health / Health Connect não está no projeto, então esta
            tela liga a mesma chave que a tela de Integrações liga — a
            intenção fica registrada, e a permissão de sistema é pedida
            quando o módulo existir. Por isso o texto não diz "conectado":
            dizer isso seria o app afirmar um acesso que ele não tem. */}
        {id === 'saude' ? (
          /* OS MOTIVOS PERDERAM O CARTÃO.

             Dentro de um cartão branco eles viravam um bloco à parte no
             meio de uma tela que é toda ela um convite — e o cartão ainda
             empurrava o botão para longe. Soltos, com o selo de cor à
             esquerda, eles são a continuação da frase que está logo acima.

             E OS ARGUMENTOS MUDARAM. Eram três descrições do mecanismo
             ("peso, sono e treinos entram sozinhos", "quem pede é o
             aparelho"): verdade, e nenhuma delas responde à pergunta que
             a pessoa está realmente se fazendo, que é o que ela ganha
             deixando um app ver isso. Agora são dois ganhos e uma
             garantia — menos trabalho, curva mais completa, e o controle
             continuando com ela. */
          <View style={{ gap: 18 }}>
            {([
              ['clock', 'Menos uma coisa para lembrar', 'peso, sono e treino entram sozinhos'],
              ['trend', 'A sua curva mais completa', 'o que o aparelho mede já entra aqui'],
              ['shield', 'Você decide o que liberar', 'e desliga quando quiser, no perfil'],
            ] as [string, string, string][]).map(([ic, t, sub]) => (
              <Row key={t} style={{ gap: 13, alignItems: 'center' }}>
                <View style={{
                  width: 42, height: 42, borderRadius: 13, backgroundColor: c.accentWeak,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={ic} size={20} color={c.accent} sw={1.9} />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt v="bodyMed">{t}</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{sub}</Txt>
                </View>
              </Row>
            ))}
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
        {/* NA TELA DE SAÚDE, A RESPOSTA É O PRÓPRIO BOTÃO.

            Ali eram dois cartões de seleção mais o "Continuar": três
            toques e duas gramáticas para uma pergunta de sim ou não. Pior
            que a contagem, o cartão marcado acendia um círculo azul de
            "pronto" antes de a pessoa sair da tela — e não havia nada de
            pronto. Autorizar acesso a dado de saúde é o gesto mais
            delicado do cadastro, e é o único aqui que a pessoa vai
            reconhecer de outros apps: a ação embaixo, e a recusa logo
            abaixo dela, escrita por extenso em vez de escondida. */}
        {id === 'saude' ? (
          <View>
            <Botao
              pilula
              label={`Conectar ao ${appSaude}`}
              onPress={() => { p({ saude: true }); avanca(); }}
            />
            <Pressable
              onPress={() => { p({ saude: false }); avanca(); }}
              style={({ pressed }) => [{
                alignItems: 'center', paddingVertical: 14, opacity: pressed ? 0.6 : 1,
              }]}
            >
              <Txt v="label" c={c.tx3}>Agora não</Txt>
            </Pressable>
          </View>
        ) : (
          <Botao
            pilula
            label={doResumo || n === passos.length - 1 ? 'Ver o resumo' : 'Continuar'}
            desligado={!respondida(id)}
            onPress={avanca}
          />
        )}
      </View>
    </View>
  );
}
