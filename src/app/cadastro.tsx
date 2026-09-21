import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated, View, Image, Pressable, ScrollView, TextInput, Platform, useWindowDimensions,
  KeyboardAvoidingView, Keyboard,
} from 'react-native';
import { useAurora } from '../ui/aurora';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { normalizarConvite, vinculoDoConvite } from '../logic/assinatura';
import { estadoVazio, type State } from '../logic/seed';
import { marcarComoVistas } from '../logic/conquistas';
import { AVISO, TERMOS, POLITICA, VERSAO as VERSAO_DO_AVISO } from '../logic/consentimento';
import { temIdentificacao, IDADE_MINIMA } from '../logic/documentos';
import { MEDS, CADENCE_DAYS } from '../logic/meds';
import { FORMAS, faixaDaMolecula, type Forma } from '../logic/formas';
import { ATIVIDADES, MOTIVOS, curWeight, planoDoCadastro, emTratamento } from '../logic/derive';
import { MO_LONG, doseTxt, kgTxt, now, startOfDay, nf, dataComAno, maiuscula } from '../logic/time';
import { Txt, Row, Rich, Rolagem } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { Botao, Roda, Regua, NUMERO, SEM_ANEL } from '../ui/internas';
import { Lavagem } from '../ui/lavagem';
import { RESTRICOES } from '../logic/restricoes';
import { Marca, CoracaoDeSaude } from '../ui/marca';
import Svg, { Defs, LinearGradient as SvgGradiente, Path, Stop } from 'react-native-svg';
import { VidroDegrade } from '../ui/vidro';
import { Plano } from './plano';
import { useTheme } from '../ui/useTheme';
import { useLightStatusBar } from '../ui/useLightStatusBar';
import { radius, ty, font, shadowCard, alfa } from '../theme';

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
     acompanhamento → temAcompanhamento, a aba Cuidado e o resumo

   A ÚNICA QUE AINDA NÃO TEM LEITOR é a MOTIVAÇÃO, e isso está dito aqui
   em vez de escondido. Ela entrou porque o lugar dela é a voz do
   Companion — quem acompanha alguém precisa saber o que essa pessoa veio
   buscar —, e o Companion ainda não a lê. Por enquanto ela aparece na
   tela de plano e fica guardada. Se ficar sem leitor por muito tempo,
   tire: é o mesmo critério das outras.
   ============================================================ */

type Id = 'nome' | 'identidade' | 'nascimento' | 'tratamento' | 'inicio' | 'medicamento'
  | 'forma' | 'dose' | 'frequencia' | 'corpo' | 'meta' | 'ritmo' | 'motivacao' | 'atividade'
  | 'restricao' | 'saude' | 'acompanhamento' | 'recomendacao' | 'consentimento';

/* A FILA NÃO É FIXA: quem ainda vai começar não responde QUANDO começou.

   Muita gente chega ao app antes de ter receita, e perguntar a data a
   essa pessoa é pedir um palpite para guardar como fato — a data que
   importa é a da primeira dose, e ela vai ser registrada quando
   acontecer. Para quem já aplicou, a pergunta fica: é ela que dá sentido
   a "semana 11 do tratamento". */
/* ⚠️ O MEIO DA FAIXA, para uma régua que precisa abrir em algum lugar.

   Não é recomendação de dose, e o texto da pergunta diz isso: é onde o
   controle nasce, do mesmo jeito que a régua de peso deste formulário
   nasce em 80 kg. Mora fora do componente porque o seletor de medicamento
   precisa dele no mesmo toque em que troca o medicamento — antes de
   qualquer coisa derivada do novo medicamento existir.

   ⚠️ A VIA VEM DO PRÓPRIO CATÁLOGO, e não da resposta da pessoa: ela
   ainda não respondeu a forma quando isto roda. Para manipulado as duas
   formas possíveis são injetáveis, então a faixa é a mesma nas duas. */
const meioDaFaixa = (id: string): number | null => {
  const m = MEDS[id];
  if (!m || m.doses.length) return null;
  const f = faixaDaMolecula(m.mol, m.formas[0]);
  return f ? Math.round(((f.min + f.max) / 2) * 20) / 20 : null;
};

const TODOS: Id[] = [
  /* ⚠️ A FORMA VEM LOGO DEPOIS DO MEDICAMENTO, e antes da dose, porque é
     ela que decide COMO a dose se pergunta: com escada, quando é uma
     caneta de marca; com régua, quando é manipulado e a receita é quem
     define o número. Perguntar a dose antes da forma seria perguntar
     numa ordem que a própria tela não consegue montar. */
  'nome', 'identidade', 'nascimento', 'tratamento', 'inicio', 'medicamento', 'forma', 'dose',
  'frequencia', 'corpo', 'meta', 'ritmo', 'motivacao', 'atividade', 'restricao',
  'saude', 'acompanhamento', 'recomendacao',
  /* O CONSENTIMENTO É O ÚLTIMO PASSO, e não o primeiro. Concordar antes
     de saber o que o aplicativo faz é assinar em branco: aqui a pessoa já
     viu as perguntas, já sabe que ele fala de peso, dose e sintoma, e é aí
     que o aviso significa alguma coisa. O botão do rodapé É o aceite. */
  'consentimento',
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

type Respostas = {
  nome: string;
  identidade: 'f' | 'm' | 'o' | 'n' | null;
  /* dia, mês (0–11) e ano, guardados soltos porque a roda mexe um de cada
     vez e o dia 31 tem que sobreviver a um passeio por fevereiro. */
  dia: number; mes: number; ano: number;
  emTratamento: boolean | null;
  med: string | null;
  /** null quando o medicamento só vem numa forma — a pergunta nem aparece */
  forma: Forma | null;
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
  /* Pode ser mais de uma: vegetariano E sem lactose é combinação comum.
     Lista vazia quer dizer "como de tudo", e não "não respondeu". */
  restricoes: string[];
  saude: boolean | null;
  /* A data do início em três peças, como a de nascimento: a roda mexe uma
     de cada vez, e o dia 31 tem que sobreviver a um passeio por
     fevereiro. Vira carimbo só na hora de salvar. */
  iDia: number; iMes: number; iAno: number;
  /* ⚠️ ERA `recomendado: boolean` — "tem código de convite, sim ou
     não" —, e a resposta "não" cobria duas pessoas diferentes: quem se
     trata com um médico de fora da rede e quem decidiu se tratar
     sozinha. O aplicativo precisa saber a diferença: é ela que liga
     consulta, preparo de perguntas e resumo, e é ela que decide se
     mencionar especialista é serviço ou insistência. */
  acompanhamento: 'proprio' | 'nenhum' | null;
  /** só quando há acompanhamento, e opcional — o nome vem para a ficha */
  profissional: string;
  /* ⚠️ E O CÓDIGO CONTINUA SENDO OUTRA PERGUNTA.

     Houve uma versão em que "tenho clínica parceira" era a terceira
     opção do acompanhamento, e o código aparecia dentro dela. Parecia
     economia de um passo e era perda de uma distinção: ter alguém
     acompanhando é um fato do tratamento; chegar por indicação de um
     parceiro é por onde a pessoa entrou — e é isso que decide a isenção.
     As duas se cruzam quase sempre e não são a mesma, e uma responder
     pela outra quebra as duas no dia em que divergirem. */
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
  emTratamento: null, med: null, forma: null, dose: null, intervalo: null,
  altura: 1.7, peso: 80, pesoInicial: 80, meta: 70, ritmo: null,
  motivacao: null, atividade: null, restricoes: [], saude: null,
  iDia: now().getDate(), iMes: now().getMonth(), iAno: now().getFullYear(),
  acompanhamento: null, profissional: '', recomendado: null, codigo: '',
};

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
function Escolha({ ic, titulo, sub, rodape, selo, on, cheia, onPress }: {
  ic?: string; titulo: string; sub?: string; on?: boolean; cheia?: boolean; onPress: () => void;
  /* UMA SEGUNDA LINHA, quando ela não é texto corrido.

     O ritmo precisa dizer duas coisas por opção — o apelido e quando a
     meta chega —, e as duas emendadas numa frase só ("Devagar e sempre ·
     chega por volta de setembro") viram uma linha longa que o olho lê
     como uma coisa só. Separadas, a de cima qualifica o ritmo e a de
     baixo é data, com ícone de calendário e tudo.

     Vem como função porque a cor depende do estado: no cartão escolhido o
     texto secundário é branco vazado, e quem sabe disso é este
     componente. */
  rodape?: (tinta: string) => React.ReactNode;
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
      /* Pelo mesmo motivo do sub: um véu branco sobre o azul-claro do
         modo escuro some, e a etiqueta fica sem moldura. */
      backgroundColor: on ? alfa(c.accentInk, 0.14) : c.accentWeak,
      borderWidth: 1, borderColor: on ? alfa(c.accentInk, 0.24) : 'transparent',
      borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 4,
    }}>
      <Txt v="micro" c={on ? c.accentInk : c.accent}>{selo}</Txt>
    </View>
  ) : null;
  /* O ÍCONE SEM PASTILHA, como nas listas do resto do app.

     Aqui a pastilha fazia mais do que enfeitar: ela trocava de cor com a
     escolha, então parecia estado. Mas o estado já está dito duas vezes
     no mesmo cartão — o fundo inteiro vira azul e a marca da direita
     acende —, e uma terceira voz dizendo a mesma coisa só engrossa o
     desenho. Sem ela, o ícone é o que sempre foi: a marca do assunto.

     A LARGURA FIXA FICA, pelo motivo de sempre: é ela que alinha os
     títulos de uma lista de opções entre si. */
  const pastilha = ic ? (
    <View style={{ width: 32, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={ic} size={19} color={on ? c.accentInk : c.tx3} sw={1.9} />
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
  /* ALTURA IGUAL PARA TODAS AS ALTERNATIVAS DA MESMA TELA.

     A lista de doses tem subtítulo na primeira e na última ("Dose de
     início", "Dose máxima") e nenhuma no meio; a de frequência só tem no
     "Outro intervalo". Sem piso, o cartão com legenda ficava um degrau
     mais alto que os vizinhos, e a lista parecia desalinhada por
     descuido — quando a diferença era só o texto a mais.

     O piso é a altura de um cartão COM legenda: quem não tem ganha ar em
     vez de encolher. */
  const moldura = {
    backgroundColor: on ? c.accent : c.bg1,
    borderRadius: radius.lg,
    paddingHorizontal: 16, paddingVertical: 13,
    minHeight: 66,
  };
  const tinta = on ? c.accentInk : c.tx;
  /* ⚠️ A SEGUNDA LINHA ERA BRANCA, FIXA NO CÓDIGO.

     Enquanto o app tinha uma cor só, isso funcionava: azul cheio no
     claro, texto branco por cima. Mas no escuro a cor de ação é a clara
     da rampa — o cartão escolhido fica azul-claro —, e branco a 78% em
     cima dele é o borrão que a leitura perde. O título já estava certo,
     em `accentInk`, e era justamente o contraste entre os dois que
     denunciava: mesma pastilha, duas regras.

     Agora as duas saem da mesma tinta, com a de baixo um pouco mais
     apagada — 0,92, e não menos, porque abaixo disso o contraste cai de
     4,5:1 no modo claro e a segunda linha volta a custar esforço. A
     hierarquia entre título e legenda é sutil de propósito: ela já está
     dita pelo tamanho e pelo peso da fonte. */
  const tintaSub = on ? alfa(c.accentInk, 0.92) : c.tx3;

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
          {rodape ? rodape(tintaSub) : null}
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
/* A ABERTURA — a primeira tela de todas

   Ela era a lavagem azul do resto do cadastro, um coração dentro de um
   quadradinho e "Vamos conhecer seu tratamento". Correta, e do tipo de
   correção que não convida ninguém: parecia a antessala de um formulário
   médico, que é exatamente o que vem depois e exatamente o que não se
   quer prometer na porta.

   IMAGEM SANGRANDO, VIDRO NO PÉ E O TEXTO DENTRO DELE. É a gramática que
   Nike, NEOM e companhia usam na primeira tela, e ela funciona porque
   inverte a ordem: primeiro a imagem diz como é, depois as palavras
   dizem o que é.

   A IMAGEM É A AURORA DO PRÓPRIO APP, e não uma fotografia. Passamos por
   duas fotos antes — alguém caminhando no fim de tarde, depois alguém
   correndo por um campo — e as duas tinham o mesmo problema de fundo:
   uma foto bonita é sempre a foto de OUTRA pessoa, e a porta de um app
   de transformação é o pior lugar para alguém encontrar um corpo que não
   é o dela. A aurora resolve isso e ainda é o azul com verde da marca,
   já usado na Home e no Insights — a primeira tela passa a parecer o app
   em vez de parecer uma campanha.

   A CURVA APAGADA ATRAVESSANDO O MEIO é a mesma forma da curva do plano:
   rápida no começo, afrouxando depois. Aqui ela não mede nada e não tem
   rótulo nenhum — é textura com significado, o desenho do que o app faz,
   na intensidade de quem não quer ser lido, só notado.

   O VIDRO É O MESMO DE /alimento E /agua, virado de cabeça para baixo.
   Lá ele desce do topo sobre a foto; aqui sobe do pé, forte embaixo e
   sumindo no meio da tela. Faixa preta reta seria mais simples e seria
   uma costura à mostra. */
/* A marca num quadrado — o mesmo arquivo que vira ícone do app. */
const MARCA_APP = require('../../assets/images/marca-app.png');

/* O TÍTULO DA ABERTURA TEM CORPO PRÓPRIO — ver o comentário no lugar em
   que ele é usado. */
const TITULO_ABERTURA = { fontFamily: font.body, fontSize: 38, lineHeight: 46 };

function Abertura({ onComecar }: { onComecar: () => void }) {
  const aurora = useAurora();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  useLightStatusBar();
  return (
    <View style={{ flex: 1, backgroundColor: c.veu }}>
      {/* Largura e altura explícitas: só com os quatro cantos presos, a
          web escala a imagem pelo tamanho natural dela e o recorte sai
          ampliado, mostrando um canto. */}
      <Image
        source={aurora.hero}
        style={[SOBREPOSTO, { width: '100%', height: '100%' }]}
        resizeMode="cover"
      />

      {/* NADA ENTRE A AURORA E O VIDRO.

          Passaram por aqui, em ordem: a curva do plano, três cartões de
          gráfico, arcos de mostrador, uma régua de borda e o contorno da
          marca. Cada um resolvia uma tela e sobrava na seguinte, e juntos
          transformavam a primeira coisa que a pessoa vê numa vitrine.

          A aurora já é a marca: o azul com verde, a granulação, o
          desenho de luz que a Home usa. Em cima dela, qualquer traço a
          mais é um a mais. */}

      {/* O VIDRO SOBE MAIS ALTO E É AZUL.

          Mais alto porque o texto ganhou três linhas de manchete e o
          desfoque tem de começar antes delas, não na altura da primeira.
          Azul porque o tom escuro do desfoque é cinza-neutro, e cinza
          sobre a aurora acinzenta justamente a cor da marca: o véu de
          azul profundo por cima devolve a temperatura que o desfoque
          tirou. */}
      <VidroDegrade altura={height * 0.66} intensidade={34} deBaixo />
      <LinearGradient
        /* O ZERO DA RAMPA É O PRÓPRIO AZUL SEM OPACIDADE, e não
           `transparent` — que é preto invisível, e faz a rampa escurecer
           antes de chegar na cor. Sobre a aurora escura quase não se vê;
           sobre fundo claro é a faixa cinza que aparecia no formulário. */
        colors={[alfa(c.veu, 0), alfa(c.veu, 0.5), c.veu]}
        locations={[0, 0.42, 1]}
        pointerEvents="none"
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: height * 0.66 }}
      />

      <View style={{
        flex: 1, justifyContent: 'flex-end',
        paddingHorizontal: 24, paddingBottom: insets.bottom + 24, gap: 16,
      }}>
        <Marca altura={30} />
        {/* A MANCHETE EM REGULAR, COM UMA PALAVRA EM PESO.

            Inteira em display, ela era um bloco de peso uniforme: bonita
            e sem hierarquia, do tipo que o olho lê de uma vez e não guarda
            nada. Em regular, a frase soa como alguém falando; e
            "transformação" em peso é a única palavra que precisa ficar,
            porque é ela que diz do que o app trata.

            E ELA CRESCEU. Trinta e quatro era o tamanho de quando a frase
            tinha de dividir a tela com três cartões de gráfico; sem eles,
            o que sobra é texto, e texto pequeno numa tela vazia parece
            legenda. */}
        <Txt c="#FFFFFF" style={TITULO_ABERTURA}>
          A companhia na sua jornada de{' '}
          <Txt c="#FFFFFF" style={{ ...TITULO_ABERTURA, fontFamily: font.bold }}>
            transformação
          </Txt>
        </Txt>
        {/* O APOIO CRESCEU JUNTO, e o branco subiu para 80%: em 70% sobre
            o azul profundo do pé da tela ele ficava no limite do legível
            em aparelho com brilho baixo. */}
        <Txt
          v="note"
          c="rgba(255,255,255,0.8)"
          style={{ marginBottom: 12, lineHeight: 23 }}
        >
          Mais do que acompanhar resultados, é entender a jornada por trás deles. Uma
          experiência inteligente que aprende com você e se adapta a cada etapa.
        </Txt>
        {/* O BOTÃO É AZUL, e não branco: o vidro e a lavagem escurecem o
            pé da tela o bastante para o azul de ação do app aparecer — e
            ele é a mesma cor de avançar de todos os outros botões do app.
            Branco ali era uma exceção que não precisava existir. */}
        <Pressable
          onPress={onComecar}
          style={({ pressed }) => [{
            borderRadius: radius.pill, overflow: 'hidden', opacity: pressed ? 0.85 : 1,
          }]}
        >
          <LinearGradient
            colors={['#3D7BFF', '#065CF5']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ paddingVertical: 18, alignItems: 'center' }}
          >
            <Txt v="bodyMed" c="#FFFFFF">Começar</Txt>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

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
/* ============================================================
   OS DOIS APLICATIVOS, LADO A LADO

   A figura não é enfeite: ela é a pergunta da tela desenhada. Dois
   ícones e três pontos entre eles dizem "um vai falar com o outro" antes
   de qualquer frase — é a gramática que todo mundo já viu em tela de
   permissão, e por isso ela não precisa ser aprendida aqui.

   O NOME DEBAixO DO ÍCONE, dentro da pastilha. O aparelho tem um app de
   saúde só, e ele tem nome: escrever "Health Connect" ali é o que
   transforma um desenho genérico no aplicativo que a pessoa vai ver
   abrir na próxima tela.

   E UM HALO NO LUGAR DA CONSTELAÇÃO. Aqui havia dezenas de ícones soltos
   no fundo, em opacidade baixa — bonito de perto e barulhento atrás de
   duas pastilhas brancas. O halo faz o mesmo trabalho com uma forma só:
   levanta o par do fundo e para de disputar atenção com ele.
   ============================================================ */
function Sincronia({ nome }: { nome: string }) {
  const { c } = useTheme();
  return (
    <View style={{ height: 176, alignItems: 'center', justifyContent: 'center' }}>
      {/* O MESMO BORRÃO DAS OUTRAS TELAS, e não um disco.

          Aqui havia dois círculos chapados atrás das pastilhas, e um
          círculo tem borda: ele lia como um objeto a mais na figura, e
          não como luz. A lavagem é a textura que o formulário inteiro já
          usa no topo — trazê-la para cá liga esta tela às outras catorze
          em vez de inventar um fundo só dela. */}
      {/* `solta`: esta lavagem está no MEIO da tela, e não colada no alto.
          As quatro bordas dela estão à vista — sem isto, ela desenha um
          retângulo de cantos retos atrás dos ícones. Ver a nota em
          ui/lavagem.

          ⚠️ E ELA SOBE 64 PX ALÉM DO QUADRO DOS ÍCONES. A luz nascia na
          altura deles e morria logo acima, o que a fazia parecer um halo
          preso à figura em vez de ar na tela.

          64 é o que cabe: a rolagem recorta, e o começo dela fica a 69 px
          daqui — o que passar disso vira uma aresta reta de novo, que é
          exatamente o defeito que o `solta` veio consertar. */}
      <View
        pointerEvents="none"
        style={{ position: 'absolute', left: -20, right: -20, top: -64, bottom: 0 }}
      >
        <Lavagem altura={240} forca={0.5} solta />
      </View>
      <Row style={{ alignItems: 'center', gap: 14 }}>
        {/* O APP DO APARELHO */}
        <View style={[{
          width: 96, height: 96, borderRadius: 28, backgroundColor: c.bg1,
          alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 6,
        }, shadowCard(c)]}>
          <CoracaoDeSaude tamanho={40} de={Platform.OS === 'android' ? 'android' : 'ios'} />
          {/* Duas linhas: "Health Connect" não cabe numa só num quadrado
              de 96, e cortar o nome do aplicativo em "Health Conn…" é pior
              do que dobrar a linha. */}
          <Txt v="micro" c={c.tx2} numberOfLines={2} style={{ textAlign: 'center', lineHeight: 14 }}>
            {nome}
          </Txt>
        </View>

        {/* OS TRÊS PONTOS, e não uma seta. Seta tem sentido, e aqui o dado
            vai e volta; ponto é passagem, que é o que está acontecendo. */}
        <Row gap={5}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent }} />
          ))}
        </Row>

        {/* NÓS */}
        <Image
          source={MARCA_APP}
          style={{ width: 96, height: 96, borderRadius: 28 }}
          resizeMode="cover"
        />
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


/* A mesma projeção em número, para comparar de relance: entre quatro
   alternativas empilhadas, 02/2027 e 11/2026 se comparam sem leitura. */
const mesEmNumero = (t: number) => {
  const d = new Date(t);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

/* ============================================================
   O PERFIL DE VOLTA EM RESPOSTAS

   O cadastro escrevia num sentido só: quinze perguntas viravam perfil, e
   dali não havia volta. Quem digitou 1,70 de altura no lugar de 1,60
   ficava com o IMC e a meta de caloria errados para sempre — e altura é
   exatamente o tipo de coisa que se erra numa régua, no primeiro minuto
   de uso.

   Esta função é o caminho inverso: lê o perfil e devolve o formulário
   como a pessoa o deixou. Com ela, a mesma tela que perguntou passa a
   ser a tela que corrige — e o app não precisa de um segundo editor, com
   uma segunda régua e uma segunda validação, para dizer a mesma coisa.

   O QUE NÃO VOLTA, VOLTA COMO PADRÃO. Nascimento e peso inicial podem
   não existir num perfil antigo; ali o formulário reabre no mesmo ponto
   de partida que abriria para alguém novo, e não numa data em branco. */
export function respostasDoPerfil(S: State): Partial<Respostas> {
  const p: any = S.profile;
  const nasc = p.nascimento ? new Date(p.nascimento) : null;
  const inicio = p.startT ? new Date(p.startT) : now();
  return {
    nome: p.name ?? '',
    identidade: p.identidade ?? null,
    ...(nasc ? { dia: nasc.getDate(), mes: nasc.getMonth(), ano: nasc.getFullYear() } : {}),
    emTratamento: emTratamento(S),
    med: p.med ?? null,
    dose: p.dose || null,
    intervalo: p.intervalo ?? null,
    altura: p.height,
    peso: curWeight(S),
    pesoInicial: p.startWeight,
    meta: p.goalWeight,
    ritmo: typeof p.ritmo === 'number' ? p.ritmo : null,
    motivacao: p.motivacao ?? null,
    atividade: p.atividade ?? null,
    restricoes: p.restricoes ?? [],
    saude: null,
    iDia: inicio.getDate(), iMes: inicio.getMonth(), iAno: inicio.getFullYear(),
    acompanhamento: p.acompanhamento ?? 'nenhum',
    profissional: p.doctor ?? '',
    recomendado: p.convite ? true : false,
    codigo: p.convite ?? '',
  };
}

export default function Cadastro() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  /* O TECLADO ENCOSTA NO BOTÃO, e não fica a um dedo dele.

     O rodapé reserva a faixa segura do aparelho embaixo — a barra de
     gesto do iPhone —, e com o teclado aberto essa barra não existe: o
     teclado já está ocupando aquele espaço. Sem trocar, sobrava o vão da
     barra somado ao respiro do botão, e o "Continuar" ficava boiando
     acima do teclado.

     `willShow` no iOS porque ele avisa ANTES da animação, e o botão sobe
     junto com o teclado em vez de dar um pulo no fim. */
  const [teclado, setTeclado] = useState(false);
  useEffect(() => {
    const ios = Platform.OS === 'ios';
    const abre = Keyboard.addListener(ios ? 'keyboardWillShow' : 'keyboardDidShow', () => setTeclado(true));
    const fecha = Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', () => setTeclado(false));
    return () => { abre.remove(); fecha.remove(); };
  }, []);

  /* ============================================================
     DOIS MODOS NA MESMA TELA: cadastrar e corrigir.

     `/cadastro` é o formulário inteiro, do zero. `/cadastro?editar=corpo`
     abre a MESMA pergunta com a resposta que já existe no perfil, salva e
     volta para onde a pessoa estava.

     Uma segunda tela de edição significaria uma segunda régua de peso,
     uma segunda roda de data e uma segunda validação — e é exatamente aí
     que uma aceita 300 kg e a outra não. A tela que perguntou é a que
     corrige.

     E SALVAR CONTINUA SENDO UM SÓ. O modo de edição chama o mesmo
     `salvar()` do fim do cadastro, com as respostas hidratadas do perfil:
     muda um campo, e as metas diárias, o plano e o IMC se refazem juntos
     em vez de ficarem coerentes com uma altura que não existe mais. */
  const { editar } = useLocalSearchParams<{ editar?: string }>();
  const editando = TODOS.includes(editar as Id) ? (editar as Id) : null;

  const [n, setN] = useState(-1);
  const [r, setR] = useState<Respostas>(VAZIO);
  /* A hidratação roda uma vez, na entrada em modo de edição: depois disso
     o formulário é do jeito que a pessoa está mexendo nele. */
  const [hidratado, setHidratado] = useState(false);
  useEffect(() => {
    if (!editando || hidratado) return;
    setR((v) => ({ ...v, ...respostasDoPerfil(S) }));
    setHidratado(true);
  }, [editando, hidratado, S]);
  const p = (x: Partial<Respostas>) => setR((v) => ({ ...v, ...x }));

  /* QUEM ENTROU PELO LÁPIS VOLTA PELO LÁPIS.

     O resumo promete "toque no lápis para mudar qualquer resposta", e
     mudar uma resposta não devia obrigar a atravessar as outras de novo. */
  const [doResumo, setDoResumo] = useState(false);

  const futuro = r.emTratamento === false;
  const med = r.med ? MEDS[r.med] : null;
  const ativ = ATIVIDADES.find((x) => x.id === r.atividade) ?? null;
  const motivo = MOTIVOS.find((x) => x.id === r.motivacao) ?? null;
  const padrao = r.med ? CADENCE_DAYS(r.med) : 7;
  const perder = r.peso - r.meta;
  const inicio = +new Date(r.iAno, r.iMes, r.iDia);
  /* A IDADE VIROU CONTA, e não só linha de conferência: ela entra na
     equação de energia e na referência de água por quilo. */
  const idade = (() => {
    const h = now();
    let a = h.getFullYear() - r.ano;
    const m = h.getMonth() - r.mes;
    if (m < 0 || (m === 0 && h.getDate() < r.dia)) a -= 1;
    return a;
  })();
  /* A equação pede sexo biológico e o cadastro pergunta identidade —
     quem respondeu "outro" ou "prefiro não informar" entra como null, e
     derive.ts usa a média dos dois termos. */
  const sexo: 'f' | 'm' | null = r.identidade === 'f' ? 'f' : r.identidade === 'm' ? 'm' : null;
  const PRONTOS = padrao === 1 ? [1] : [7, 10, 14];
  /* ⚠️⚠️ O CONTADOR FICA ABERTO POR ESCOLHA, E NÃO POR VALOR.

     Isto era derivado do número: "o contador está aberto quando o
     intervalo não é nenhum dos prontos". Parecia elegante e tinha um
     defeito que só aparece com o dedo na tela — quem abre "outro
     intervalo" em 9 e vai descendo, ao encostar em 7 vê o contador SUMIR
     debaixo do dedo, e a opção "A cada 7 dias" acender sozinha lá em
     cima. O controle desaparece no meio do gesto que a pessoa está
     fazendo com ele.

     Agora quem abre é o toque, e quem fecha é o toque numa das opções
     prontas. O valor não manda mais na existência do controle.

     ⚠️ O DERIVADO CONTINUA NO "OU", e é por isso que ele não virou só o
     estado: quem volta a esta pergunta pelo lápis do resumo, com um
     intervalo de doze dias já gravado, precisa encontrar o contador
     aberto. O estado responde por quem está mexendo agora; o valor, por
     quem já respondeu antes. */
  const [outroAberto, setOutroAberto] = useState(false);
  const outroIntervalo = outroAberto
    || (r.intervalo != null && !PRONTOS.includes(r.intervalo));
  const nivel = Math.max(0, ATIVIDADES.findIndex((x) => x.id === r.atividade));

  /* A fila é montada a cada render porque ela depende de uma resposta:
     quem ainda vai começar não responde QUANDO começou. */
  /* Três perguntas saem da fila conforme as respostas anteriores: quem
     ainda não começou não responde QUANDO começou, quem não sabe qual
     medicamento vai usar não tem escada de dose para escolher, e a FORMA
     só se pergunta quando o catálogo não sabe.

     ⚠️ A FORMA SÓ APARECE COM MAIS DE UMA. Toda caneta de marca vem numa
     forma só, e perguntar ali seria cobrar um toque por uma resposta que
     o catálogo já tem. Manipulado vem em frasco ou em seringa preenchida,
     e aí quem sabe é quem está com ela na mão. */
  const passos = useMemo(
    () => TODOS.filter((x) => {
      if (x === 'inicio') return r.emTratamento === true;
      if (x === 'forma') return (MEDS[r.med ?? '']?.formas.length ?? 1) > 1;
      if (x === 'dose' || x === 'frequencia') return r.med !== 'indefinido';
      return true;
    }),
    [r.emTratamento, r.med],
  );
  /* EM MODO DE EDIÇÃO, A TELA ABRE NA PERGUNTA — e não na abertura da
     marca. O índice só existe depois de `passos`, que depende das
     respostas: quem não está em tratamento não tem o passo da data de
     início, e a lista encolhe. */
  useEffect(() => {
    if (!editando || !hidratado) return;
    const i = passos.indexOf(editando);
    if (i >= 0) setN(i);
  }, [editando, hidratado, passos]);

  const RESUMO = passos.length;
  const MONTANDO = passos.length + 1;
  const PLANO = passos.length + 2;
  const aoResumo = () => { setDoResumo(false); setN(RESUMO); };
  /* Ir para a próxima é uma coisa só, e agora três rodapés diferentes
     fazem isso: o "Continuar" de sempre, o "Conectar" da tela de saúde e
     o "Salvar" da edição. Quem veio do resumo volta para o resumo; quem
     veio do perfil grava e sai. */
  const avanca = () => {
    if (editando) { salvar(); router.back(); return; }
    if (doResumo) { aoResumo(); return; }
    setN(n + 1);
  };
  const appSaude = Platform.OS === 'ios' ? 'Apple Saúde' : 'Health Connect';

  const plano = useMemo(
    () => planoDoCadastro({
      altura: r.altura, peso: r.peso, meta: r.meta, ritmo: r.ritmo, atividade: nivel,
      idade, sexo,
    }),
    [r.altura, r.peso, r.meta, r.ritmo, nivel, idade, sexo],
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
    /* ⚠️ A IDADE MÍNIMA PASSA A SER UMA TRANCA, e não um aviso.

       O cadastro perguntava a data de nascimento e seguia com qualquer
       resposta. Dado de saúde de menor de idade tem regra própria na
       LGPD (art. 14) e exige consentimento de quem responde por ele. A
       decisão de produto é ser exclusivo para maiores, e a tranca é aqui.

       E o botão desligado não basta sozinho: a tela diz por quê, logo
       abaixo da roda. Botão que não obedece sem explicar é o app
       culpando a pessoa por um limite que ele não contou — e o texto
       aponta para onde esse cuidado de fato acontece, em vez de falar
       das limitações do aplicativo, que não são problema de quem lê. */
    if (x === 'nascimento') return idade >= IDADE_MINIMA;
    if (x === 'identidade') return r.identidade != null;
    if (x === 'tratamento') return r.emTratamento != null;
    if (x === 'medicamento') return r.med != null;
    if (x === 'forma') return r.forma != null;
    if (x === 'dose') return r.dose != null;
    if (x === 'ritmo') return perder <= 0 || r.ritmo != null;
    if (x === 'motivacao') return r.motivacao != null;
    if (x === 'atividade') return r.atividade != null;
    /* Sempre válida: lista vazia é "nenhuma", que é uma resposta. */
    if (x === 'restricao') return true;
    if (x === 'saude') return r.saude != null;
    /* A roda não deixa escolher um dia que ainda não aconteceu, então
       chegar aqui já significa uma data válida. */
    if (x === 'inicio') return inicio <= +startOfDay(now());
    /* O BOTÃO DO RODAPÉ É O ACEITE, como na tela de saúde: não há uma
       resposta a marcar antes dele. */
    if (x === 'consentimento') return true;
    /* O nome do profissional é opcional: quem tem médico e não quer
       escrever o nome agora continua tendo médico, e a ficha fica para
       depois. O código, não — sem ele "vim por indicação" é uma
       afirmação sem nada por trás. */
    if (x === 'acompanhamento') return r.acompanhamento !== null;
    if (x === 'recomendacao') {
      return r.recomendado === false || (r.recomendado === true && r.codigo.trim().length >= 4);
    }
    return true;
  };

  const salvar = () => {
    update((s: any) => {
      /* ⚠️ O CADASTRO INTEIRO COMEÇA DO ZERO, e antes não começava.

         Ele escrevia por cima do estado que estivesse ali — que, para
         quem acabou de instalar, é o de exemplo. Mexia em perfil,
         integrações e nas pesagens de hoje, e em mais nada: as
         aplicações, os check-ins, os exames, as fotos e a conversa com a
         médica da Mariana continuavam inteiros, agora com o nome de quem
         respondeu o formulário.

         Editar uma resposta NÃO passa por aqui — e não pode passar: o
         estado vazio apagaria o tratamento de quem só queria corrigir a
         altura. */
      if (!editando) Object.assign(s, estadoVazio());
      s.profile.name = r.nome.trim();
      s.profile.identidade = r.identidade;
      s.profile.nascimento = +new Date(r.ano, r.mes, r.dia);
      s.profile.height = r.altura;
      s.profile.med = r.med;
      /* ⚠️ SÓ GRAVA QUANDO ELA RESPONDEU. Com uma forma só, a pergunta não
         apareceu, e escrever aqui o único item do catálogo seria guardar
         como resposta dela o que é fato do medicamento. Quem lê usa
         `formaDe(S)`, que cai no catálogo sozinho — e no dia em que um
         medicamento passar a vir em duas formas, quem não respondeu
         continua certo em vez de carregar uma resposta velha. */
      s.profile.forma = r.forma ?? undefined;
      /* ZERO, E NÃO NULO, quando a dose ainda não existe — quem respondeu
         "ainda não sei" no medicamento nem chega à pergunta da dose. Meia
         dúzia de telas formatam este campo direto, e nulo quebrava a Home
         inteira na primeira renderização. Quem escreve dose na tela usa
         doseDoPerfil, que sabe dizer "ainda não definida". */
      s.profile.dose = r.dose ?? 0;
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
      /* A PORTA SE TRANCA ATRÁS DA PESSOA.

         `onboardDone` é o que o _layout lê para decidir se mostra o app ou
         manda para cá. Ele vira verdadeiro aqui, e não no botão do fim do
         plano: quem chegou a esta linha já respondeu tudo e já tem perfil
         escrito — fechar o app na tela de plano não pode devolver a pessoa
         ao formulário que ela acabou de preencher. */
      s.onboardDone = true;
      /* O CONSENTIMENTO FICA GUARDADO COM A DATA E A VERSÃO do texto que
         a pessoa leu. Só a data diria que ela concordou um dia, com um
         aviso que ninguém sabe qual era — e é a versão que permite pedir
         de novo quando o texto mudar. */
      if (!editando) s.profile.consentimento = { em: +now(), versao: VERSAO_DO_AVISO };
      s.profile.startWeight = r.emTratamento ? r.pesoInicial : r.peso;
      s.profile.goalWeight = r.meta;
      s.profile.ritmo = r.ritmo;
      s.profile.motivacao = r.motivacao;
      s.profile.atividade = r.atividade;
      /* QUEM LÊ: a tabela de alimentos, que passa a mostrar primeiro o que
         cabe, e os achados da tela de Alimentação, que sugerem o que
         comer. Ver src/logic/restricoes.ts. */
      (s.profile as any).restricoes = r.restricoes;
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
      /* ⚠️ O NOME VOLTOU, E POR OUTRO MOTIVO. Ele tinha saído porque o
         app não consegue conferir um nome digitado — verdade, e
         irrelevante: ele não liga ninguém a clínica nenhuma. É a ficha da
         pessoa, para o resumo saber para quem é e a consulta saber com
         quem. Quem liga à plataforma continua sendo só o código. */
      s.profile.acompanhamento = r.acompanhamento ?? 'nenhum';
      s.profile.doctor = r.acompanhamento === 'proprio' ? r.profissional.trim() : '';
      /* ⚠️ O CÓDIGO LIGA AQUI TAMBÉM, e não só na folha de /codigo.

         São três portas para o mesmo convite — o cadastro, /parceiros e a
         folha do paywall — e uma delas guardando sem ligar faria a mesma
         pessoa entrar de graça ou não dependendo de por onde passou. O
         que transforma código em vínculo mora em assinatura.ts, e as três
         chamam a mesma função. */
      s.profile.convite = r.recomendado ? normalizarConvite(r.codigo) : '';
      s.profile.vinculo = s.profile.convite ? vinculoDoConvite(s.profile.convite) : null;
      /* AS METAS DIÁRIAS DEIXAM DE SER AS DA SEMENTE. Proteína e água
         vinham fixas em 90 g e 2,5 L — os números de outra pessoa, lidos
         dez vezes cada um. */
      s.profile.targets.prot = plano.prot;
      s.profile.targets.waterMl = plano.agua;
      /* A META DE ENERGIA É GUARDADA, e é lida: /alimentacao conta a
         energia do prato do dia contra ela, e dela saem carboidrato,
         gordura e fibra. Guardada só ela, e não os três: eles são fatia
         desta, e quatro números guardados divergem no dia em que alguém
         mexer num. */
      (s.profile.targets as any).kcal = plano.kcal;
      /* O peso de hoje entra como PESAGEM, e não só como número do perfil:
         a curva de evolução, o "de → para" da Jornada e a meta leem a
         lista de pesagens. Desduplica por DIA, e não por instante:
         pesagem gravada às três da tarde tem hora no carimbo.

         ⚠️ SÓ NO CADASTRO INTEIRO. Este bloco APAGA as pesagens de hoje
         para pôr uma no lugar, e isso é correto quando a lista está
         nascendo: ela ainda não é o registro de ninguém. Depois disso ela
         é, e corrigir uma resposta não pode limpar registro nenhum —
         nem a segunda pesagem do dia, nem a hora do carimbo, nem uma
         linha que a pessoa apagou de propósito.

         A edição faz a coisa oposta e está logo abaixo: acrescenta. */
      if (!editando) {
        const t = +startOfDay(now());
        const resto = (s.weights || []).filter((w: any) => +startOfDay(new Date(w.t)) !== t);
        const pesagens = [...resto, { t, kg: r.peso }];
        /* Quem já começou tem DUAS pesagens de largada: a de quando
           começou e a de hoje. Sem a primeira, a curva de evolução nasce
           com um ponto só e não tem o que desenhar. */
        if (r.emTratamento && +startOfDay(new Date(inicio)) !== t) {
          pesagens.push({ t: +startOfDay(new Date(inicio)), kg: r.pesoInicial });
        }
        s.weights = pesagens.sort((a: any, b: any) => a.t - b.t);
        /* ⚠️ E A MARCA D'ÁGUA DAS CONQUISTAS NASCE AQUI, depois da
           primeira pesagem — não antes.

           O cadastro grava o peso de hoje, e isso fecha o nível 1 da
           trilha de pesagens no mesmo instante. Sem esta linha, a tela
           de conquista subia por cima do plano recém-montado: "1 peso
           registrado", comemorando o formulário que a pessoa acabou de
           preencher em vez de alguma coisa que ela fez.

           A regra é a mesma do ensureDefaults: a marca guarda o que a
           pessoa já sabe, e ela já sabe do peso que acabou de digitar. */
        marcarComoVistas(s);
      }

      /* ---- na edição, o peso se acrescenta ou se corrige. Nunca se apaga.

         MEDIDAS ATUAIS acrescenta. Quem abriu aquela tela para arrumar a
         altura não mexeu no peso, e o valor volta igual ao último — então
         nada acontece. Quem mexeu na régua disse um peso novo, e peso
         novo é uma pesagem: entra com a hora de agora, ao lado das que já
         existem. Substituir a de hoje seria sumir com a da manhã de quem
         se pesa duas vezes.

         COMECEI EM corrige no lugar. Ali não há pesagem nova: é a MESMA
         medição, daquele dia, com o número errado. Acrescentar criaria
         duas pesagens no dia de início, e a curva começaria com um
         degrau que não aconteceu. */
      if (editando === 'corpo' && r.peso !== curWeight(s)) {
        s.weights = [...(s.weights || []), { t: +now(), kg: r.peso }]
          .sort((a: any, b: any) => a.t - b.t);
      }
      if (editando === 'inicio') {
        const diaZero = +startOfDay(new Date(inicio));
        const lista = (s.weights || []) as any[];
        const i = lista.findIndex((w) => +startOfDay(new Date(w.t)) === diaZero);
        if (i >= 0) lista[i] = { ...lista[i], kg: r.pesoInicial };
        else lista.push({ t: diaZero, kg: r.pesoInicial });
        s.weights = lista.sort((a: any, b: any) => a.t - b.t);
      }
    });
    setN(MONTANDO);
  };

  /* ---------- montando ---------- */
  if (n === MONTANDO) return <Montando onFim={() => setN(PLANO)} />;

  /* ---------- abertura ----------

     Ela não aparece na edição: quem veio do perfil corrigir a altura não
     precisa ser apresentado ao app de novo. O quadro em branco enquanto o
     índice não chega é de um piscar; abrir a manchete da marca ali seria
     mostrar a tela errada por um instante e a certa depois. */
  if (n === -1) return editando ? <View style={{ flex: 1, backgroundColor: c.bg }} /> : <Abertura onComecar={() => setN(0)} />;

  /* ---------- o plano ----------

     A TELA MUDOU DE ARQUIVO, e não de dono. Ela é a devolutiva do
     cadastro e também uma tela do app — dá para reabrir o plano em
     /plano sem refazer quinze perguntas —, e uma tela que vive em dois
     lugares não pode morar dentro de um deles.

     O componente não lê a loja: aqui os números ainda são respostas na
     memória desta tela, e só viram perfil quando `salvar` roda. Quem lê
     a loja é a rota, em plano.tsx. */
  if (n === PLANO) {
    return (
      <Plano
        dados={{
          nome: r.nome,
          peso: r.peso,
          meta: r.meta,
          ritmo: r.ritmo,
          med: r.med ?? 'indefinido',
          dose: r.dose,
          intervalo: r.intervalo,
          plano,
        }}
        /* O RÓTULO E O DESTINO VOLTARAM A CONCORDAR. Este botão se
           chamava "Ver planos" e entrava no aplicativo — o nome estava
           escrito adiantado, esperando a tela existir. Ela existe.

           `replace` e não `push`: o cadastro não fica atrás na pilha,
           porque não há para onde voltar depois de salvar. Quem fecha a
           tela de planos cai no aplicativo, e quem cuida disso é o X de
           lá — ele pergunta se há história antes de tentar voltar. */
        aoSair={() => router.replace('/planos' as any)}
        rotuloSair="Ver planos"
      />
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
        ['leaf', 'Restrição', r.restricoes.length
          ? r.restricoes.map((x) => RESTRICOES.find((y) => y.id === x)?.titulo ?? x).join(', ')
          : 'Nenhuma', 'restricao'],
      ]],
      ['O TRATAMENTO', [
        ['spark', 'Situação', futuro ? 'Vou começar' : 'Já em tratamento', 'tratamento'],
        ...(futuro ? [] : [['clock', 'Comecei em', `${dataCurta(inicio)} · ${nf(r.pesoInicial, 1)} kg`, 'inicio'] as L]),
        /* O ® só onde ele é verdade — ver `marca` em logic/meds. */
        ['pill', 'Medicamento', r.med === 'indefinido' ? 'Ainda não sei'
          : `${med?.label}${med?.marca ? '®' : ''}`, 'medicamento'],
        ...((MEDS[r.med ?? '']?.formas.length ?? 1) > 1 && r.forma
          ? [['syringe', 'Forma', maiuscula(FORMAS[r.forma].recipiente), 'forma'] as L]
          : []),
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
        ['steth', 'Acompanhamento',
          r.acompanhamento === 'proprio'
            ? (r.profissional.trim() || 'Com um profissional')
            : 'Por conta própria',
          'acompanhamento'],
        ['heart', 'Indicação', r.recomendado ? r.codigo.trim().toUpperCase() : 'Cheguei por conta própria', 'recomendacao'],
      ]],
    ];
    return (
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <Lavagem altura={insets.top + 270} />
        <Rolagem contentContainerStyle={{
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
        </Rolagem>
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

  /* ⚠️ A FAIXA PRECISA DE UMA FORMA, e no cadastro ela pode ainda não ter
     sido respondida — o passo da forma vem antes do da dose, mas quem
     edita pelo resumo pula direto. O primeiro item do catálogo é a
     resposta certa nesse vão: para manipulado as duas formas são
     injetáveis, então a faixa sai igual de qualquer jeito. */
  const formaEmUso: Forma = r.forma ?? MEDS[r.med ?? '']?.formas[0] ?? 'caneta';
  const faixa = (med && !med.doses.length ? faixaDaMolecula(med.mol, formaEmUso) : null)
    ?? { min: 0.25, max: 2.4 };

  /* ---------- as perguntas ---------- */
  const id = passos[n];
  const titulos: Record<Id, string> = {
    nome: 'Como podemos te chamar?',
    identidade: 'Como você se identifica?',
    nascimento: 'Quando você nasceu?',
    tratamento: 'Você já está em tratamento?',
    inicio: 'Quando você começou?',
    medicamento: futuro ? 'Qual medicamento você pretende usar?' : 'Qual medicamento você usa?',
    forma: futuro ? 'Como você vai aplicar?' : 'Como você aplica?',
    dose: futuro ? 'Com qual dose você pretende começar?' : 'Qual é a sua dose atual?',
    frequencia: futuro ? 'De quanto em quanto tempo você vai aplicar?' : 'De quanto em quanto tempo você aplica?',
    corpo: 'Quais são suas medidas atuais?',
    meta: 'Qual é a sua meta de peso?',
    ritmo: 'Qual ritmo você quer seguir para chegar lá?',
    motivacao: 'O que está te levando a essa jornada?',
    atividade: 'Qual é o seu nível de atividade física?',
    restricao: 'Você tem alguma restrição alimentar?',
    saude: 'Conecte o seu aplicativo de saúde',
    /* Mesma conjugação que medicamento, dose e frequência já fazem: quem
       ainda vai começar não tem nada no presente para responder, e
       perguntar "você tem" obriga a traduzir a pergunta antes de
       respondê-la. */
    acompanhamento: futuro
      ? 'Você pretende ter o acompanhamento de um especialista?'
      : 'Você possui o acompanhamento de um especialista?',
    recomendacao: 'Você chegou até nós por indicação de um especialista?',
    consentimento: 'Antes de montar o seu plano',
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
    identidade: 'É para falarmos com você do jeito certo. O que entra nas contas de saúde é o seu corpo, e ele vem nas próximas perguntas.',
    nascimento: 'Cada fase da vida tem necessidades diferentes — e a idade entra nas faixas de referência dos seus exames.',
    tratamento: 'Só para saber onde você está agora.',
    inicio: 'Aproximado está bom. É daqui que sai a sua semana de tratamento, e é este peso que vira o começo da sua curva.',
    medicamento: 'É dele que saem a escada de doses e o intervalo entre as aplicações.',
    forma: 'Manipulado sai da farmácia dos dois jeitos, e o que muda é o que você tem na mão na hora de aplicar.',
    dose: med && med.doses.length
      ? `Na ordem da titulação do ${med.label}.`
      /* Sem escada não há titulação a seguir: manipulado não tem degraus
         de bula, e quem define o número é a receita. */
      : 'Manipulado não tem escada de bula — o número é o da sua receita.',
    frequencia: 'É daqui que saem a contagem do ciclo, os lembretes e o estoque da caneta.',
    corpo: 'É com altura e peso que calculamos o seu IMC e montamos as suas metas diárias de proteína e água.',
    meta: 'É a referência que usamos para mostrar o quanto você já andou. Dá para mudar quando quiser.',
    ritmo: `${nf(Math.abs(perder), 1)} kg a percorrer.`,
    motivacao: 'Não existe resposta certa. Vale a que você lembraria num dia difícil.',
    restricao: 'Proteína é o eixo deste tratamento, e ela vem de lugares diferentes conforme o que você come. Pode marcar mais de uma.',
    atividade: 'Entra na sua meta diária de água — quem se mexe mais perde mais líquido — e diz de onde você está partindo.',
    saude: 'Os seus dados de saúde ajudam a entender a sua evolução — sem você precisar registrar tudo.',
    /* ⚠️ ESTE TEXTO NÃO PODE SOAR COMO UMA OFERTA.

       A versão anterior listava, em três tópicos com ícone, o que o app
       passa a fazer "com acompanhamento" — e lida de fora, era um
       cardápio: responda sim e ganhe agenda, resumo e preparo de
       perguntas. Numa pergunta em que ninguém confere a resposta, isso é
       um convite a mentir para destravar a versão melhor. E a pessoa que
       mente aqui recebe um aplicativo que passa a falar de consultas que
       ela não tem — o oposto do que ela queria ao mentir.

       Então a frase nomeia a natureza do que a resposta liga, e não a
       vantagem: são funcionalidades LIGADAS A CONSULTA, e quem não tem
       consulta não perde nada por não vê-las.

       ⚠️ E ELA PAROU DE SE DEFENDER. Havia uma oração final garantindo
       que "o resto do aplicativo é o mesmo nas duas respostas" — bem
       intencionada, e contraproducente: ninguém desconfia de um cardápio
       até o garçom jurar que não há prato melhor. Quatro linhas de
       explicação numa pergunta de duas alternativas também é peso
       demais. Uma frase, um exemplo, e a pergunta volta a ser a maior
       coisa da tela. */
    acompanhamento: 'Essa resposta habilita funcionalidades ligadas ao acompanhamento médico, como anotações e planejamento para consultas.',
    /* ⚠️ AQUI DIZIA "quem chega por um profissional parceiro não paga
       pelo app", e a frase estava no pior lugar possível: anunciando o
       prêmio na mesma tela em que faz a pergunta que o concede. Não é
       informação, é incentivo — e o que ela incentiva é tentar.

       Quem tem código não precisa da promessa para digitá-lo; quem não
       tem passa a ter um motivo para procurar um. Benefício se apresenta
       onde ele é cobrado, e não onde ele é perguntado.

       No lugar dela, o que a pergunta de fato faz: o código é o que liga
       a conta à equipe. Ver PENDENCIAS.md — este passo sai daqui quando
       a tela de planos existir. */
    recomendacao: 'O código é o que liga a sua conta à equipe que acompanha você.',
    consentimento: 'O que você acabou de responder é dado de saúde. Veja o que fazemos com ele.',
  };

  const diasNoMes = new Date(r.ano, r.mes + 1, 0).getDate();
  const hoje = startOfDay(now());

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      {/* A MALHA NÃO VAI PARA A TELA DE SAÚDE. Lá o desenho dos dois
          aplicativos é que é o assunto, e ele já tem a constelação atrás —
          duas texturas no mesmo lugar viram só borrão azul. */}
      {id === 'saude' ? null : <Lavagem altura={insets.top + 280} />}

      {/* O TOPO: uma seta e um fio.

          Tinha um botão redondo branco em volta da seta e um "14 de 15"
          no canto. A moldura dava peso de ação a um gesto que é o mais
          barato da tela — voltar —, e a contagem informava justamente o
          que ninguém quer saber no meio de um formulário: quantas
          perguntas ainda faltam. Quinze é um número que assusta em
          qualquer tela em que ele apareça.

          O QUE SOBRA DIZ A MESMA COISA MELHOR. A seta nua, maior, com
          área de toque de sobra; e o progresso como um fio que atravessa
          a tela de ponta a ponta, encostado no alto. Ele responde "quanto
          falta" pelo tamanho, que é como barra de progresso sempre
          respondeu, e não obriga ninguém a fazer conta. */}
      {/* O FIO DE PROGRESSO SOME NA EDIÇÃO: não há fila de perguntas,
          há uma. Uma barra de progresso de um passo só é sempre 100% e
          nunca quis dizer nada. */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top + 4 }}>
        <View style={{
          opacity: editando ? 0 : 1,
          position: 'absolute', left: 0, bottom: 0, height: 3,
          width: `${((n + 1) / passos.length) * 100}%`,
          backgroundColor: c.accent,
          borderTopRightRadius: 2, borderBottomRightRadius: 2,
        }} />
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: insets.top + 12 }}>
        <Pressable
          onPress={() => {
            if (editando) { router.back(); return; }
            if (doResumo) { aoResumo(); return; }
            setN(n - 1);
          }}
          hitSlop={14}
          style={({ pressed }) => [{ alignSelf: 'flex-start', opacity: pressed ? 0.5 : 1 }]}
        >
          <Icon name="back" size={26} color={c.tx} sw={2} />
        </Pressable>
      </View>

      {/* O RODAPÉ SOBE COM O TECLADO.

          A primeira pergunta é o nome, e ela abre com o teclado já aberto:
          o "Continuar" ficava atrás dele, e quem digitava o nome não tinha
          como seguir sem fechar o teclado primeiro — um gesto a mais na
          primeira tela do app, que é onde ele menos cabe. */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
      <Rolagem
        /* AR ENTRE O TOPO E A PERGUNTA. Colada na barra de progresso, a
           manchete lia como cabeçalho de tela; afastada, ela lê como a
           pergunta que é. */
        /* A TELA DE SAÚDE SE APOIA NO RODAPÉ. As outras começam em cima,
           porque a pergunta é a primeira coisa; esta é um convite, e
           convite se lê de baixo para cima — o botão, os motivos, a
           frase, e a imagem ocupando a sobra. */
        contentContainerStyle={id === 'saude'
          ? { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 34, flexGrow: 1, justifyContent: 'center' }
          : { paddingHorizontal: 20, paddingTop: 26, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* A pergunta mora DENTRO da lavagem, e não abaixo dela: é ela o
            assunto da tela, e o gradiente existe para dar altura ao que
            ela pergunta. As respostas é que caem no branco. */}
        {id === 'saude' ? <Sincronia nome={appSaude} /> : null}
        {/* A TELA DE SAÚDE TEM MANCHETE PRÓPRIA, e não a pergunta seca das
            outras. Ela é a única do formulário que pede uma autorização em
            vez de uma resposta, e o que decide alguém a autorizar não é
            saber o que o app quer — é saber o que ela ganha.

            O fecho vem em azul porque é ele que carrega a promessa: o
            resto da frase é o assunto, "em um só lugar" é o benefício. */}
        {id === 'saude' ? (
          <Rich
            v="h1"
            text="Tudo o que seu corpo mostra, <b>em um só lugar</b>"
            style={{ textAlign: 'center', marginTop: 10 }}
          />
        ) : (
          <Txt v="h1">{titulos[id]}</Txt>
        )}
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
          <View>
            <Row style={{ gap: 10 }}>
            <Roda
              largura={78}
              itens={Array.from({ length: diasNoMes }, (_, k) => ({ v: k + 1, label: String(k + 1) }))}
              valor={Math.min(r.dia, diasNoMes)}
              onEscolhe={(v) => p({ dia: v })}
            />
            <Roda
              largura={142}
              itens={MO_LONG.map((m, k) => ({ v: k, label: m }))}
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
            {/* A EXPLICAÇÃO FICA COLADA NA RODA, e não no rodapé: é ali
                que a pessoa acabou de mexer, e é ali que ela procura o
                motivo de o botão ter apagado. */}
            {idade < IDADE_MINIMA ? (
              <Txt v="caption" c={c.tx2} style={{ marginTop: 14, lineHeight: 21 }}>
                Este aplicativo é exclusivo para maiores de {IDADE_MINIMA} anos. O tratamento
                de quem ainda não tem essa idade é acompanhado pela equipe de
                saúde, junto com quem responde legalmente por essa pessoa.
              </Txt>
            ) : null}
          </View>
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
                /* O ® é da marca, e escrevê-lo é o mínimo: são nomes
                   registrados de três fabricantes, e o app os lista de
                   graça numa tela de cadastro.

                   ⚠️ E SÓ ONDE ELE É VERDADE. Manipulado é categoria, não
                   produto — sem dono, sem registro. "Semaglutida
                   manipulada®" seria o aplicativo afirmando uma marca que
                   não existe, numa tela de saúde. */
                titulo={`${m.label}${m.marca ? '®' : ''}`}
                /* A molécula debaixo do nome da marca informa; debaixo de
                   "Semaglutida manipulada" ela repetiria a palavra que a
                   pessoa acabou de ler. Ali o que falta dizer é de onde
                   aquilo vem. */
                sub={m.marca ? m.mol : 'Preparada em farmácia de manipulação'}
                on={r.med === k}
                /* Trocar de medicamento zera dose, forma e intervalo: a
                   escada é outra, a cadência também, e a forma pode nem
                   ser perguntada no próximo.

                   ⚠️ A DOSE NASCE NO MEIO DA FAIXA QUANDO NÃO HÁ ESCADA.
                   Sem degraus, a pergunta seguinte é uma régua, e régua
                   precisa de um ponto de partida. É o mesmo critério que
                   altura, peso e meta já usam neste formulário: o meio da
                   faixa não é recomendação nenhuma, é onde o controle
                   abre. Com escada, segue nulo — ali a pessoa escolhe um
                   degrau, e nenhum degrau é "o do meio". */
                onPress={() => p(r.med === k ? { med: k } : {
                  med: k, forma: null, intervalo: null,
                  dose: MEDS[k].doses.length ? null : meioDaFaixa(k),
                })}
              />
            ))}
          </View>
        ) : null}

        {/* ⚠️ SÓ CHEGA AQUI QUEM TEM MAIS DE UMA FORMA — ver o filtro da
            fila. Uma lista de uma opção só não é pergunta, é aviso. */}
        {id === 'forma' && med ? (
          <View style={{ gap: 8 }}>
            {med.formas.map((fm) => (
              <Escolha
                key={fm} cheia
                titulo={maiuscula(FORMAS[fm].recipiente)}
                sub={fm === 'frasco'
                  ? 'Você aspira a dose com uma seringa'
                  : fm === 'seringa'
                    ? 'Já vem preenchida, pronta para aplicar'
                    : undefined}
                on={r.forma === fm}
                onPress={() => p({ forma: fm })}
              />
            ))}
          </View>
        ) : null}

        {id === 'dose' && med ? (
          <View style={{ gap: 16 }}>
            {/* ⚠️⚠️ SEM ESCADA, A PERGUNTA MUDA DE CONTROLE.

                Um manipulado não tem degraus de bula: quem define o número
                é a receita. A lista de escolhas fica VAZIA para ele — não
                é uma lista curta, é nenhuma —, e sem isto o passo
                apareceria em branco, com o botão de continuar desligado e
                nada na tela explicando por quê.

                A régua é o controle de um número livre, e é o mesmo gesto
                que altura, peso e meta já usam duas telas antes.

                ⚠️ A FAIXA É DERIVADA, e não chutada: o menor e o maior que
                existem em bula para a mesma molécula NA MESMA VIA. Ver
                faixaDaMolecula, em logic/formas, e a nota sobre por que a
                via separa. */}
            {!med.doses.length ? (
              <Regua
                min={faixa.min} max={faixa.max} passo={0.05} tracoCada={0.5} casas={2}
                esp={7} salto={0.05}
                valor={r.dose ?? meioDaFaixa(r.med ?? '') ?? faixa.min}
                unidade={med.unit}
                onEscolhe={(v) => p({ dose: v })}
              />
            ) : null}

            <View style={{ gap: 8 }}>
              {med.doses.map((d, i) => (
                <Escolha
                  key={d} cheia
                  titulo={`${doseTxt(d)} ${med.unit}`}
                  sub={i === 0 ? 'Dose de início' : i === med.doses.length - 1 ? 'Dose máxima' : undefined}
                  on={r.dose === d}
                  onPress={() => p({ dose: d })}
                />
              ))}
              {/* Mesma regra do medicamento: quem já aplicou sabe a dose
                  que aplicou. Quem vai começar muitas vezes ainda não teve
                  a consulta que define isso. */}
              {futuro ? (
                <Escolha
                  cheia titulo="Ainda não sei" sub="Quase todo mundo começa pela menor"
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
              {PRONTOS.map((d) => (
                <Escolha
                  key={d} cheia
                  titulo={d === 1 ? 'Todos os dias' : `A cada ${d} dias`}
                  selo={d === padrao ? 'Padrão' : undefined}
                  /* ⚠️ COM O CONTADOR ABERTO, NENHUMA PRONTA ACENDE. Sem
                     esta guarda, contar até 7 acendia "A cada 7 dias" ao
                     mesmo tempo que "Outro intervalo": duas respostas
                     marcadas para uma pergunta. */
                  on={!outroIntervalo
                    && (d === padrao ? r.intervalo == null || r.intervalo === padrao : r.intervalo === d)}
                  onPress={() => { setOutroAberto(false); p({ intervalo: d === padrao ? null : d }); }}
                />
              ))}
              <Escolha
                cheia titulo="Outro intervalo"
                sub={outroIntervalo ? `A cada ${r.intervalo} dias` : 'Você diz de quantos em quantos dias'}
                on={outroIntervalo}
                /* Só semeia um número quando não há um próprio: tocar de
                   novo em "outro intervalo" com doze dias escolhidos não
                   pode jogá-los fora. */
                onPress={() => {
                  setOutroAberto(true);
                  if (r.intervalo == null || PRONTOS.includes(r.intervalo)) {
                    p({ intervalo: padrao === 1 ? 2 : 9 });
                  }
                }}
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
                valor={r.altura} unidade="m" onEscolhe={(v) => p({ altura: v })} fundo={c.bg}
              />
            </View>
            <View>
              <Rotulo>PESO DE HOJE</Rotulo>
              <Regua
                min={40} max={180} passo={0.1} tracoCada={0.5} casas={1} esp={5} salto={0.1}
                valor={r.peso} unidade="kg" onEscolhe={(v) => p({ peso: v })} fundo={c.bg}
              />
            </View>
          </View>
        ) : null}

        {id === 'meta' ? (
          <View style={{ gap: 16 }}>
            <Regua
              min={40} max={180} passo={0.1} tracoCada={0.5} casas={1} esp={5} salto={0.5}
              valor={r.meta} unidade="kg" onEscolhe={(v) => p({ meta: v })} fundo={c.bg}
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
                const on = r.ritmo === x.kg;
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
                    sub={x.nome}
                    /* A PREVISÃO EM UMA LINHA, E EM OUTRA COR.

                       Era uma frase: "Chega aos 70 kg por volta de
                       fevereiro de 2027" — comprida o bastante para
                       dobrar em duas linhas dentro do cartão, e com isso
                       o ritmo, o apelido e a data pesavam igual. Encurtada
                       e no azul, ela vira o dado que se compara entre uma
                       alternativa e outra, que é a decisão que esta tela
                       pede.

                       O mês em número pelo mesmo motivo: "02/2027" se
                       compara de relance com "11/2026"; "fevereiro de
                       2027" se lê. */
                    rodape={(tinta) => (
                      <Row gap={6} style={{ marginTop: 5, alignItems: 'center' }}>
                        <Icon name="cal" size={13} color={on ? tinta : c.accent} sw={2} />
                        <Txt v="caption" c={on ? tinta : c.accent} style={{ flex: 1 }}>
                          {`Alcança os ${kgTxt(r.meta)} kg em ${mesEmNumero(quando)}`}
                        </Txt>
                      </Row>
                    )}
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

        {/* A RESTRIÇÃO É A ÚNICA PERGUNTA DE MÚLTIPLA ESCOLHA DO
            FORMULÁRIO, e por isso ela precisa dizer isso de alguma forma:
            "Nenhuma" existe como opção, e não como ausência de resposta.
            Sem ela, quem come de tudo ficaria olhando uma lista à espera
            de saber o que fazer — e o botão de continuar desligado.

            E ela limpa as outras ao ser tocada, porque é o que significa:
            não dá para ser vegano e não ter restrição nenhuma. */}
        {id === 'restricao' ? (
          <View style={{ gap: 10 }}>
            <Escolha
              cheia titulo="Nenhuma" sub="Como de tudo"
              on={r.restricoes.length === 0}
              onPress={() => p({ restricoes: [] })}
            />
            {RESTRICOES.map((x) => (
              <Escolha
                key={x.id} cheia titulo={x.titulo} sub={x.sub}
                on={r.restricoes.includes(x.id)}
                onPress={() => p({
                  restricoes: r.restricoes.includes(x.id)
                    ? r.restricoes.filter((y) => y !== x.id)
                    : [...r.restricoes, x.id],
                })}
              />
            ))}
          </View>
        ) : null}

        {id === 'atividade' ? (
          <View style={{ gap: 10 }}>
            {ATIVIDADES.map((x) => (
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
                itens={MO_LONG
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
                valor={r.pesoInicial} unidade="kg" onEscolhe={(v) => p({ pesoInicial: v })} fundo={c.bg}
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
          /* OS MOTIVOS: dois ganhos e uma garantia — menos trabalho, uma
             leitura mais completa, e o controle continuando com ela. Eram
             três descrições do mecanismo, e nenhuma respondia à pergunta
             que a pessoa se faz, que é o que ela ganha deixando um app ver
             isso.

             O SELO DE COR VOLTOU, e só aqui. A regra da casa é ícone solto
             nas listas, porque lá o quadrado repetido vira uma coluna de
             botões que não são botões. Esta não é uma lista de opções: são
             três argumentos, e o quadrado é o que lhes dá o peso de cartaz
             numa tela que está pedindo autorização. */
          <View style={{ gap: 14 }}>
            {([
              ['clock', 'Menos uma coisa para lembrar', 'Peso, sono e treino entram sozinhos.'],
              ['barchart', 'A sua curva mais completa', 'O que o aparelho mede já entra aqui.'],
              ['shield', 'Você continua no controle', 'Escolha o que liberar, e desligue quando quiser.'],
            ] as [string, string, string][]).map(([ic, t, sub]) => (
              <Row key={t} style={{ gap: 14, alignItems: 'center' }}>
                <View style={{
                  width: 46, height: 46, borderRadius: 15, backgroundColor: c.accentWeak,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={ic} size={21} color={c.accent} sw={1.9} />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt v="bodyMed">{t}</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{sub}</Txt>
                </View>
              </Row>
            ))}
          </View>
        ) : null}

        {id === 'acompanhamento' ? (
          <View style={{ gap: 16 }}>
            {/* ⚠️ ESTA PERGUNTA NÃO EXISTIA, e a sua falta juntava duas
                pessoas muito diferentes debaixo do mesmo aplicativo: quem
                se trata com um médico que não usa a plataforma, e quem
                decidiu conduzir o tratamento sozinha.

                Para a primeira, esconder consulta e resumo é tirar o que
                ela mais usaria. Para a segunda, oferecê-los toda hora é
                insistir numa escolha que ela já tomou. Sem perguntar, o
                app errava com as duas — e errava adivinhando pelo campo
                do nome, que é vazio nos dois casos. */}
            {/* ⚠️ AQUI HAVIA UMA LISTA DO QUE A RESPOSTA DESTRAVA, e ela
                saiu inteira. Passou por duas formas — cartão com legendas,
                depois três linhas miúdas — e as duas tinham o mesmo
                defeito de origem: eram uma vitrine de funcionalidades
                dentro de uma pergunta que ninguém confere. A explicação
                agora está na frase da pergunta, onde ela informa sem
                anunciar. */}
            <View style={{ gap: 10 }}>
              <Escolha
                ic="steth" cheia titulo="Sim"
                sub={futuro
                  ? 'Vou me tratar com um médico ou clínica'
                  : 'Um médico ou clínica acompanha o meu tratamento'}
                on={r.acompanhamento === 'proprio'}
                onPress={() => p({ acompanhamento: 'proprio' })}
              />
              <Escolha
                ic="companion" cheia titulo="Não, por conta própria"
                sub="Dá para adicionar depois, quando quiser"
                on={r.acompanhamento === 'nenhum'}
                onPress={() => p({ acompanhamento: 'nenhum', profissional: '' })}
              />
            </View>

            {r.acompanhamento === 'proprio' ? (
              <View style={{ gap: 8 }}>
                {/* O "opcional" sobe para o rótulo. Embaixo ele chegava
                    depois de a pessoa já ter decidido se ia preencher —
                    e quem não quer escrever o nome do próprio médico
                    passava pelo campo achando que era obrigatório. */}
                <Rotulo>{futuro ? 'QUEM VAI ACOMPANHAR VOCÊ (OPCIONAL)' : 'QUEM ACOMPANHA VOCÊ (OPCIONAL)'}</Rotulo>
                <CampoTexto
                  valor={r.profissional}
                  onChange={(v) => p({ profissional: v })}
                  placeholder="Digite o nome"
                />
                <Txt v="caption" c={c.tx3}>
                  Serve para referenciar o especialista ao longo da sua jornada. Nada é
                  enviado a essa pessoa.
                </Txt>
              </View>
            ) : null}

            {/* ⚠️ O AVISO FICA NAS DUAS RESPOSTAS, E ISSO É A DECISÃO.

                Mostrá-lo só depois do "não" faria dele uma reação: a
                pessoa marca uma opção e o aplicativo responde com um
                lembrete sobre a importância de ter médico. Isso é
                julgamento com cara de informação, e numa tela de cadastro
                de tratamento de saúde é a última coisa que alguém precisa
                receber de um app.

                ⚠️ E ELE ERA UM SERMÃO. "O remédio é de prescrição, e dose
                e protocolo são decisão de quem tem formação para isso" diz
                a alguém que acabou de responder sobre o próprio tratamento
                o que ela já sabe — e diz no tom de quem está corrigindo.
                Um aviso que soa como reprimenda é lido como reprimenda, e
                aí ninguém lê a segunda frase, que é a que pode importar.

                Agora ele faz duas coisas úteis e nenhuma cerimônia: diz o
                que o aplicativo não é, e diz quando não esperar. Os
                sintomas são os mesmos que o app já usa em leituras.ts e
                derive.ts — dor abdominal forte e vômito que não passa —,
                porque um app que nomeia sinais de alerta de dois jeitos
                ensina os dois pela metade. */}
            <View style={{ height: 1, backgroundColor: c.line, marginHorizontal: 2 }} />
            <Txt v="caption" c={c.tx3} style={{ lineHeight: 20, paddingHorizontal: 2 }}>
              O aplicativo acompanha e organiza, mas não substitui acompanhamento médico.
              Se aparecer dor abdominal forte ou vômito que não passa, procure atendimento
              o quanto antes — não espere a próxima consulta.
            </Txt>
          </View>
        ) : null}

        {id === 'recomendacao' ? (
          <View style={{ gap: 16 }}>
            <View style={{ gap: 10 }}>
              <Escolha
                ic="heart" cheia titulo="Sim" sub="Tenho um código de convite"
                on={r.recomendado === true} onPress={() => p({ recomendado: true })}
              />
              <Escolha
                ic="user" cheia titulo="Não" sub="Cheguei por conta própria"
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
                  É ele que liga a sua conta ao profissional.
                </Txt>
              </View>
            ) : null}
          </View>
        ) : null}

        {id === 'consentimento' ? (
          <View style={{ gap: 10 }}>
            {AVISO.map((a) => (
              <View key={a.titulo} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16, gap: 5 }}>
                <Txt v="bodyMed">{a.titulo}</Txt>
                <Txt v="caption" c={c.tx2} style={{ lineHeight: 21 }}>{a.texto}</Txt>
              </View>
            ))}
            {/* OS DOCUMENTOS SÓ APARECEM QUANDO ESTIVEREM COMPLETOS. Um
                link para "Termos de uso" que abre um texto sem quem
                responde por ele, numa tela de aceite, é a pior linha
                possível: ela é a prova de que a pessoa aceitou uma coisa
                que ninguém assinou. */}
            {temIdentificacao() ? (
              <Row gap={16} style={{ justifyContent: 'center', paddingVertical: 10 }}>
                <Pressable onPress={() => router.push(TERMOS as any)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <Txt v="label" c={c.accent}>Termos de Uso</Txt>
                </Pressable>
                <Pressable onPress={() => router.push(POLITICA as any)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <Txt v="label" c={c.accent}>Política de Privacidade</Txt>
                </Pressable>
              </Row>
            ) : null}
          </View>
        ) : null}
      </Rolagem>

      {/* O RODAPÉ É OPACO. Sem fundo, a lista de opções passava por baixo
          do botão e a última delas aparecia cortada ao meio atrás de uma
          pílula translúcida. */}
      <View style={{
        paddingHorizontal: 20, paddingTop: 12,
        paddingBottom: teclado ? 24 : insets.bottom + 20,
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
        {/* Em modo de edição o aceite não se refaz: quem corrige a
            altura não está consentindo de novo, e o rodapé continua sendo
            o 'Salvar' de todas as outras. */}
        {id === 'consentimento' && !editando ? (
          <View>
            {/* O RÓTULO DIZ O QUE O TOQUE SIGNIFICA. "Continuar" seria a
                pessoa consentindo sem saber que consentiu — e consentimento
                para dado de saúde precisa ser um ato claro, não o efeito
                colateral de avançar uma tela. */}
            <Botao pilula label="Concordar e montar meu plano" onPress={avanca} />
            <Txt v="micro" c={c.tx4} style={{ textAlign: 'center', marginTop: 10 }}>
              Fica registrado com a data de hoje.
            </Txt>
          </View>
        ) : id === 'saude' ? (
          <View>
            {/* O BOTÃO DIZ O QUE A PESSOA GANHA, e a letra miúda embaixo
                diz por onde isso passa.

                "Conectar ao Health Connect" punha o nome do intermediário
                no lugar onde mora a ação — e o nome muda de aparelho para
                aparelho, então a frase principal da tela mudava com ele.
                "Conectar meus dados" é a mesma ação em qualquer telefone,
                e o "via Health Connect" embaixo é a informação técnica no
                tamanho que ela merece. */}
            <Botao
              pilula
              label="Conectar meus dados"
              onPress={() => { p({ saude: true }); avanca(); }}
            />
            <Txt v="micro" c={c.tx4} style={{ textAlign: 'center', marginTop: 10 }}>
              via {appSaude}
            </Txt>
            {/* "FAZER ISSO DEPOIS", e não "agora não". A recusa que fecha
                a porta é mais fácil de dar do que a que adia, e aqui ela
                adia mesmo: a tela de Integrações continua no perfil, e a
                pessoa liga quando quiser. */}
            <Pressable
              onPress={() => { p({ saude: false }); avanca(); }}
              style={({ pressed }) => [{
                alignItems: 'center', paddingTop: 16, paddingBottom: 2, opacity: pressed ? 0.6 : 1,
              }]}
            >
              <Txt v="label" c={c.accent}>Fazer isso depois</Txt>
            </Pressable>
          </View>
        ) : (
          <Botao
            pilula
            label={editando ? 'Salvar'
              : doResumo || n === passos.length - 1 ? 'Ver o resumo' : 'Continuar'}
            desligado={!respondida(id)}
            onPress={avanca}
          />
        )}
      </View>
      </KeyboardAvoidingView>
    </View>
  );
}
