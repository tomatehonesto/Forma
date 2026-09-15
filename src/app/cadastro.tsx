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

type Id = 'nome' | 'sexo' | 'idade' | 'tratamento' | 'medicamento' | 'dose' | 'corpo'
  | 'meta' | 'motivacao' | 'movimento' | 'inicio' | 'acompanhamento';

/* SEXO E IDADE EM TELAS SEPARADAS. Estavam juntos numa só, com um
   parágrafo de três linhas explicando as duas de uma vez — e duas
   perguntas embaixo de uma explicação é a pessoa lendo para descobrir
   qual parte vale para qual campo. Uma pergunta por tela é a regra do
   resto do fluxo; não havia motivo para estas duas serem exceção. */
const PASSOS: Id[] = [
  'nome', 'sexo', 'idade', 'tratamento', 'medicamento', 'dose', 'corpo',
  'meta', 'motivacao', 'movimento', 'inicio', 'acompanhamento',
];

/* O MOVIMENTO É PERGUNTADO COMO ROTINA E GUARDADO COMO META.

   "Você é sedentário?" é uma pergunta sobre a pessoa que não devolve nada
   — e ninguém responde "sim" de bom grado. A rotina, essa ela responde
   sem pensar, e o app converte em minutos por dia, que é o que as barras
   da Home, o card da semana em /exercicio e o radar leem.

   O número aparece na própria opção de propósito: é ele que vai virar
   meta, e esconder isso seria decidir por ela sem contar. */
const MOVIMENTO: { id: string; titulo: string; sub: string; min: number }[] = [
  { id: 'parado', titulo: 'Quase não me movimento', sub: 'meta de 20 min por dia', min: 20 },
  { id: 'leve', titulo: 'Caminho de vez em quando', sub: 'meta de 30 min por dia', min: 30 },
  { id: 'ativo', titulo: 'Me exercito 3 ou 4 vezes por semana', sub: 'meta de 45 min por dia', min: 45 },
  { id: 'muito', titulo: 'Me exercito quase todo dia', sub: 'meta de 60 min por dia', min: 60 },
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

   O teto é 0,75 kg por semana. A faixa que se cita como perda segura vai
   a cerca de 1 kg, e oferecer mais do que isso seria o app sugerindo um
   ritmo que ele não deveria sugerir. */
const RITMOS = [0.25, 0.5, 0.75];

/* A motivação, com as opções que os três apps oferecem em comum. */
const MOTIVOS: { id: string; titulo: string; sub: string; ic: string }[] = [
  { id: 'saude', titulo: 'Saúde', sub: 'exames, pressão, glicemia', ic: 'heart' },
  { id: 'energia', titulo: 'Energia', sub: 'disposição no dia', ic: 'bolt' },
  { id: 'espelho', titulo: 'Como me vejo', sub: 'no espelho e nas fotos', ic: 'camera' },
  { id: 'confianca', titulo: 'Confiança', sub: 'me sentir bem comigo', ic: 'spark' },
  { id: 'medico', titulo: 'Orientação médica', sub: 'foi indicação de quem me acompanha', ic: 'steth' },
];

type Respostas = {
  nome: string;
  sexo: 'f' | 'm' | 'n' | null;
  nascimento: number;
  emTratamento: boolean | null;
  med: string | null;
  dose: number | null;
  intervalo: number | null;
  altura: number;
  peso: number;
  meta: number;
  ritmo: number | null;
  motivacao: string | null;
  movimento: string | null;
  inicio: number | null;
  acompanhado: boolean | null;
  quem: string;
  codigo: string;
};

const VAZIO: Respostas = {
  nome: '', sexo: null,
  /* Altura, peso, meta e ano nascem com um número porque o controle deles
     é um stepper: ele precisa de uma posição de partida para a pessoa
     subir ou descer a partir dali. Não são recomendação nenhuma. */
  nascimento: 1990,
  emTratamento: null, med: null, dose: null, intervalo: null,
  altura: 1.7, peso: 80, meta: 70, ritmo: null,
  motivacao: null, movimento: null, inicio: null,
  acompanhado: null, quem: '', codigo: '',
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
      backgroundColor: on ? c.accent : 'transparent',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {on ? <Icon name="check" size={13} color={c.accentInk} sw={3} /> : null}
    </View>
  );
  const selo = ic ? (
    <View style={{
      width: 34, height: 34, borderRadius: 17,
      backgroundColor: on ? c.accent : c.bg2,
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name={ic} size={16} color={on ? c.accentInk : c.tx3} sw={1.9} />
    </View>
  ) : null;
  /* Sem borda no estado normal: o cartão se separa do fundo pelo branco e
     por uma sombra rasa, como todo cartão do app. Borda cinza em oito
     cartões empilhados vira grade de planilha. A borda aparece só no
     escolhido, e aí ela é informação. */
  const moldura = {
    backgroundColor: on ? c.accentWeak : c.bg1,
    borderRadius: radius.lg, borderWidth: 1.5,
    borderColor: on ? c.accent : 'transparent',
    paddingHorizontal: 18, paddingVertical: 17,
  };

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
          <Txt v="bodyMed">{titulo}</Txt>
          {sub ? <Txt v="caption" c={c.tx3} style={{ marginTop: 3 }}>{sub}</Txt> : null}
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
          <Txt v="bodyMed" numberOfLines={2}>{titulo}</Txt>
          {sub ? <Txt v="caption" c={c.tx3} style={{ marginTop: 3 }} numberOfLines={2}>{sub}</Txt> : null}
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
        <Txt v="bodyMed" numberOfLines={2}>{titulo}</Txt>
        {sub ? <Txt v="caption" c={c.tx3} style={{ marginTop: 3 }} numberOfLines={2}>{sub}</Txt> : null}
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
function Contador({ valor, unidade, nota, onMenos, onMais, onDigitar }: {
  valor: string; unidade?: string; nota?: string;
  onMenos: () => void; onMais: () => void; onDigitar?: (v: string) => void;
}) {
  const { c } = useTheme();
  const botao = {
    width: 56, height: 56, borderRadius: 28, backgroundColor: c.bg1,
    alignItems: 'center' as const, justifyContent: 'center' as const,
  };
  const numero = { fontFamily: font.light, fontSize: 52, lineHeight: 60, letterSpacing: -1.5 };
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

  const RESUMO = PASSOS.length;
  const PLANO = PASSOS.length + 1;
  /* -1 é a abertura, 0..10 são as perguntas, 11 é o resumo e 12 é o plano. */
  const [n, setN] = useState(-1);
  const [r, setR] = useState<Respostas>(VAZIO);
  const p = (x: Partial<Respostas>) => setR((v) => ({ ...v, ...x }));

  /* QUEM ENTROU PELO LÁPIS VOLTA PELO LÁPIS.

     O resumo promete "toque no lápis para mudar qualquer resposta", e
     mudar uma resposta não devia obrigar a atravessar as outras de novo. */
  const [doResumo, setDoResumo] = useState(false);
  const aoResumo = () => { setDoResumo(false); setN(RESUMO); };

  const futuro = r.emTratamento === false;
  const med = r.med ? MEDS[r.med] : null;
  const mov = MOVIMENTO.find((x) => x.id === r.movimento) ?? null;
  const motivo = MOTIVOS.find((x) => x.id === r.motivacao) ?? null;
  const padrao = r.med ? CADENCE_DAYS(r.med) : 7;
  const perder = r.peso - r.meta;

  const plano = useMemo(
    () => planoDoCadastro({
      sexo: r.sexo === 'f' || r.sexo === 'm' ? r.sexo : null,
      altura: r.altura, peso: r.peso, meta: r.meta, ritmo: r.ritmo,
    }),
    [r.sexo, r.altura, r.peso, r.meta, r.ritmo],
  );

  /* A PERGUNTA RESPONDIDA, uma por passo. É ela que liga o botão: sem a
     resposta o "Continuar" fica desligado, e é assim que "obrigatória"
     se diz sem precisar de mensagem de erro.

     Duas respostas não travam nada, e por motivos diferentes: o RITMO só
     existe para quem tem peso a perder, e o CÓDIGO de convite quem é
     acompanhado por um profissional não parceiro simplesmente não tem —
     barrar ali transformaria uma vantagem comercial em pedágio. */
  const respondida: boolean[] = [
    r.nome.trim().length > 1,
    r.sexo != null,
    true,
    r.emTratamento != null,
    r.med != null,
    r.dose != null,
    true,
    perder <= 0 || r.ritmo != null,
    r.motivacao != null,
    r.movimento != null,
    r.inicio != null,
    r.acompanhado === false || (r.acompanhado === true && r.quem.trim().length > 1),
  ];

  const salvar = () => {
    update((s: any) => {
      s.profile.name = r.nome.trim();
      /* "Prefiro não informar" grava null, e não a letra: null é a
         ausência, e quem lê depois não precisa saber que existiu uma
         terceira opção na tela. */
      s.profile.sexo = r.sexo === 'n' ? null : r.sexo;
      s.profile.nascimento = r.nascimento;
      s.profile.height = r.altura;
      s.profile.med = r.med;
      s.profile.dose = r.dose;
      /* Só guarda intervalo quando ele DIFERE do catálogo. Igual, seria
         uma segunda cópia do mesmo fato — e no dia em que a bula mudar,
         a cópia não muda junto. */
      s.profile.intervalo = r.intervalo && r.intervalo !== padrao ? r.intervalo : null;
      s.profile.startWeight = r.peso;
      s.profile.goalWeight = r.meta;
      s.profile.ritmo = r.ritmo;
      s.profile.motivacao = r.motivacao;
      s.profile.startT = r.inicio;
      /* AS METAS DIÁRIAS DEIXAM DE SER AS DA SEMENTE. Proteína, água e
         gordura corporal vinham fixas em 90 g, 2,5 L e 28% — os números
         de outra pessoa, lidos dez vezes cada um. */
      s.profile.targets.prot = plano.prot;
      s.profile.targets.waterMl = plano.agua;
      /* Sem sexo informado não há meta de gordura corporal — e a antiga
         não é sobrescrita por um palpite. */
      if (plano.gordura != null) s.profile.targets.bodyFat = plano.gordura;
      s.profile.targets.exercMin = mov?.min ?? s.profile.targets.exercMin;
      /* QUEM ACOMPANHA, e o código que veio com a indicação. Um campo só
         para o nome: se é pessoa ou lugar é assunto de quem responde, e o
         app precisa saber uma coisa só — se existe alguém acompanhando. */
      s.profile.doctor = r.acompanhado ? r.quem.trim() : '';
      s.profile.convite = r.acompanhado ? r.codigo.trim().toUpperCase() : '';
      /* O peso de hoje entra como PESAGEM, e não só como número do perfil:
         a curva de evolução, o "de → para" da Jornada e a meta leem a
         lista de pesagens. Desduplica por DIA, e não por instante:
         pesagem gravada às três da tarde tem hora no carimbo. */
      const t = +startOfDay(now());
      const resto = (s.weights || []).filter((w: any) => +startOfDay(new Date(w.t)) !== t);
      s.weights = [...resto, { t, kg: r.peso }].sort((a: any, b: any) => a.t - b.t);
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
              que muda depois. Prometer que dá para pular e depois não
              deixar seria pior do que nunca ter prometido. */}
          <Txt v="caption" c={c.tx2} style={{ textAlign: 'center', maxWidth: 290 }}>
            Doze perguntas curtas. É com elas que o Morphi monta a sua Home e as suas
            metas do dia — e qualquer uma muda depois, no perfil.
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
      ['dumbbell', 'MOVIMENTO', `${mov?.min ?? 30} min por dia`],
      ['scale', 'IMC DE HOJE', nf(plano.imc, 1)],
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
                ? `Sua primeira aplicação é ${dataPorExtenso(r.inicio as number)}. Daqui até lá, dá para ir conhecendo o app.`
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
                Calculadas do seu peso e da sua rotina. São ponto de partida, não
                prescrição — todas mudam no perfil.
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
                    rápido", aqui vai a ressalva. A conta é aritmética
                    simples sobre o ritmo que a pessoa escolheu; o corpo e
                    a dose é que decidem, e o app não tem como prometer. */}
                <Txt v="caption" c={c.tx2} style={{ marginTop: 2 }}>
                  É a conta do ritmo que você escolheu, não uma previsão: quanto o peso
                  desce depende do corpo e da dose.
                </Txt>
              </View>
            ) : null}

            {motivo ? (
              <Txt v="caption" c={c.tx3}>
                E fica anotado por que você começou: {motivo.titulo.toLowerCase()}.
              </Txt>
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
    const cartoes: [string, string, string, number][] = [
      ['user', 'NOME', r.nome.trim(), 0],
      ['heart', 'SEXO', r.sexo === 'f' ? 'Feminino' : r.sexo === 'm' ? 'Masculino' : 'Não informado', 1],
      ['cal', 'IDADE', `${now().getFullYear() - r.nascimento} anos`, 2],
      ['spark', 'SITUAÇÃO', futuro ? 'Vou começar' : 'Já em tratamento', 3],
      ['pill', 'MEDICAMENTO', med?.label ?? '—', 4],
      ['syringe', 'DOSE', `${doseTxt(r.dose ?? 0)} ${med?.unit ?? 'mg'}${r.intervalo && r.intervalo !== padrao ? ` · a cada ${r.intervalo} dias` : ''}`, 5],
      ['ruler', 'ALTURA E PESO', `${nf(r.altura, 2)} m · ${nf(r.peso, 1)} kg`, 6],
      ['target', 'META', `${nf(r.meta, 1)} kg${r.ritmo ? ` · ${nf(r.ritmo, 2)} kg/semana` : ''}`, 7],
      ['bolt', 'MOTIVO', motivo?.titulo ?? '—', 8],
      ['dumbbell', 'MOVIMENTO', mov ? `${mov.min} min por dia` : '—', 9],
      ['cal', futuro ? 'PRIMEIRA DOSE' : 'INÍCIO', r.inicio ? dataPorExtenso(r.inicio) : '—', 10],
      ['steth', 'ACOMPANHAMENTO', r.acompanhado
        ? `${r.quem.trim()}${r.codigo.trim() ? ` · ${r.codigo.trim().toUpperCase()}` : ''}`
        : 'Por conta própria', 11],
    ];
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 24 }}>
          <Txt v="h1" style={{ textAlign: 'center' }}>Prontinho</Txt>
          <Txt v="caption" c={c.tx2} style={{ textAlign: 'center', marginTop: 6, marginBottom: 24 }}>
            Toque no lápis para mudar qualquer resposta.
          </Txt>
          <Duplas>
            {cartoes.map(([ic, rotulo, valor, passo]) => (
              <View
                key={rotulo}
                style={{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.card, padding: 14, gap: 10 }}
              >
                <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Icon name={ic} size={16} color={c.tx3} sw={1.9} />
                  <Pressable
                    onPress={() => { setDoResumo(true); setN(passo); }}
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
        {/* ARRASTAR PARA CONFIRMAR VIROU BOTÃO.

            O arraste é o gesto de quem vai fazer algo que não dá para
            desfazer — apagar, enviar, pagar. Aqui ele guardava a porta da
            Home, e tudo o que está atrás dela pode ser mudado no perfil a
            qualquer hora. */}
        <View style={{
          paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 20,
          gap: 12, backgroundColor: c.bg,
        }}>
          <Botao pilula label="Confirmar" onPress={salvar} />
          <Pressable
            onPress={() => setN(PASSOS.length - 1)}
            style={({ pressed }) => [{ alignItems: 'center', opacity: pressed ? 0.6 : 1 }]}
          >
            <Txt v="label" c={c.tx3}>Voltar</Txt>
          </Pressable>
        </View>
      </View>
    );
  }

  /* ---------- as doze perguntas ---------- */
  const id = PASSOS[n];
  const titulos: Record<Id, string> = {
    nome: 'Como podemos te chamar?',
    sexo: 'Qual é o seu sexo biológico?',
    idade: 'Em que ano você nasceu?',
    tratamento: 'Você já está em tratamento?',
    medicamento: 'Qual medicamento você usa?',
    dose: futuro ? 'Com qual dose você vai começar?' : 'Qual é a sua dose atual?',
    corpo: 'Sua altura e seu peso de hoje',
    meta: 'Aonde você quer chegar?',
    motivacao: 'O que te trouxe até aqui?',
    movimento: 'Como é a sua rotina de movimento?',
    inicio: futuro ? 'Quando você vai começar?' : 'Quando você começou?',
    acompanhamento: 'Alguém acompanha o seu tratamento?',
  };
  /* UMA LINHA, NÃO UM PARÁGRAFO.

     O subtítulo estava explicando a pergunta, o motivo dela e o que muda
     depois — três linhas antes de qualquer resposta aparecer. Quem chega
     numa fila de doze perguntas não lê três linhas doze vezes; pula, e
     aí o texto não serviu nem de explicação nem de nada. Fica o mínimo
     que evita a dúvida, e o resto vive onde a resposta é usada. */
  const subs: Record<Id, string> = {
    nome: 'É assim que o app vai te chamar todo dia.',
    sexo: 'Entra nas faixas de referência dos seus exames.',
    idade: 'Entra nas mesmas faixas.',
    tratamento: 'Só para saber onde você está agora.',
    medicamento: 'A escada de doses da próxima pergunta vem dele.',
    dose: med ? `Na ordem da titulação do ${med.label}.` : 'Na ordem da titulação.',
    corpo: 'O peso fica como a sua primeira pesagem.',
    meta: 'Um número de referência e o ritmo que você quer seguir.',
    motivacao: 'Escolha a que mais pesa.',
    movimento: 'Vira a sua meta diária de movimento.',
    inicio: 'Aproximado está bom.',
    acompanhamento: 'Médico, nutricionista ou clínica.',
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Lavagem altura={insets.top + 320} />

      {/* O TOPO diz onde a pessoa está e não oferece saída. "Pular tudo"
          ficava aqui; com as perguntas obrigatórias, o que sobra é a
          barra, a contagem e o voltar — e os três passam a flutuar sobre
          a lavagem, sem faixa nem fio embaixo. */}
      <View style={{ paddingHorizontal: 20, paddingTop: insets.top + 10 }}>
        <Row gap={12}>
          <CircleBtn name="back" size={38} bg={c.bg1} onPress={() => (doResumo ? aoResumo() : setN(n - 1))} />
          <View style={{
            flex: 1, height: 4, borderRadius: 2, overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255,0.6)',
          }}>
            <View style={{
              width: `${((n + 1) / PASSOS.length) * 100}%`,
              height: '100%', borderRadius: 2, backgroundColor: c.accent,
            }} />
          </View>
          <Txt v="micro" c={c.tx2}>{n + 1} de {PASSOS.length}</Txt>
        </Row>
      </View>

      <ScrollView
        /* AR ENTRE O TOPO E A PERGUNTA. Colada na barra de progresso, a
           manchete lia como cabeçalho de tela; afastada, ela lê como a
           pergunta que é — é o vão que dá a ela o lugar de assunto. */
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 64, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* A pergunta mora DENTRO da lavagem, e não abaixo dela: é ela o
            assunto da tela, e o gradiente existe para dar altura ao que
            ela pergunta. As respostas é que caem no branco. */}
        <Txt v="h1">{titulos[id]}</Txt>
        <Txt v="note" c={c.tx2} style={{ marginTop: 10, marginBottom: 28 }}>{subs[id]}</Txt>

        {/* O NOME SE ESCREVE NA TELA, e não dentro de uma caixa.

            A caixa de formulário estava ali por hábito: ela existe para
            separar um campo dos outros campos, e aqui não há outros — a
            tela inteira é essa resposta. Sem moldura, o que a pessoa
            digita vira a maior coisa da tela, que é exatamente o peso que
            o próprio nome tem. */}
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

        {/* TRÊS OPÇÕES, e a terceira não é um "pular" disfarçado: quem não
            informa recebe o app sem meta de gordura corporal, e as faixas
            de exame ficam na versão genérica. É uma resposta com
            consequência, e ela está dita no plano do fim. */}
        {id === 'sexo' ? (
          <Duplas>
            <Escolha titulo="Feminino" on={r.sexo === 'f'} onPress={() => p({ sexo: 'f' })} />
            <Escolha titulo="Masculino" on={r.sexo === 'm'} onPress={() => p({ sexo: 'm' })} />
            <Escolha
              titulo="Prefiro não informar"
              sub="as faixas ficam genéricas"
              on={r.sexo === 'n'}
              onPress={() => p({ sexo: 'n' })}
            />
          </Duplas>
        ) : null}

        {id === 'idade' ? (
          <View style={{ gap: 12 }}>
            {/* O ANO, e não a data inteira. A idade é o que o app lê, e
                pedir dia e mês cobraria dois controles a mais por uma
                precisão que nada aqui usa. */}
            <Contador
              valor={String(r.nascimento)}
              nota={`${now().getFullYear() - r.nascimento} anos hoje`}
              onMenos={() => p({ nascimento: Math.max(1920, r.nascimento - 1) })}
              onMais={() => p({ nascimento: Math.min(now().getFullYear() - 12, r.nascimento + 1) })}
              onDigitar={(v) => {
                const x = parseInt(v.replace(/\D/g, ''), 10);
                if (!Number.isNaN(x)) p({ nascimento: Math.min(now().getFullYear() - 12, Math.max(1920, x)) });
              }}
            />
          </View>
        ) : null}

        {id === 'tratamento' ? (
          <Duplas>
            <Escolha
              ic="syringe" titulo="Já apliquei alguma dose" sub="Em tratamento agora"
              on={r.emTratamento === true}
              onPress={() => p({ emTratamento: true })}
            />
            <Escolha
              ic="cal" titulo="Vou começar em breve" sub="Ainda não apliquei"
              on={r.emTratamento === false}
              onPress={() => p({ emTratamento: false })}
            />
          </Duplas>
        ) : null}

        {id === 'medicamento' ? (
          <Duplas>
            {Object.entries(MEDS).map(([k, m]) => (
              <Escolha
                key={k} ic="pill" titulo={m.label} sub={m.mol}
                on={r.med === k}
                /* Trocar de caneta zera a dose e o intervalo: a escada é
                   outra e a cadência também — manter 5 mg semanais ao
                   pular de Mounjaro para Saxenda gravaria uma dose que
                   aquela caneta não tem, num ritmo que ela não usa. */
                onPress={() => p(r.med === k ? { med: k } : { med: k, dose: null, intervalo: null })}
              />
            ))}
          </Duplas>
        ) : null}

        {id === 'dose' && med ? (
          <View style={{ gap: 16 }}>
            <Duplas>
              {med.doses.map((d, i) => (
                <Escolha
                  key={d} ic="syringe"
                  titulo={`${doseTxt(d)} ${med.unit}`}
                  sub={i === 0 ? 'dose de início' : i === med.doses.length - 1 ? 'dose máxima' : undefined}
                  on={r.dose === d}
                  onPress={() => p({ dose: d })}
                />
              ))}
            </Duplas>

            {/* O INTERVALO É EXCEÇÃO, e por isso fica atrás de um toque.

                O app sabe a cadência de cada caneta, e perguntar de novo
                daria à resposta a chance de discordar do catálogo. Mas
                aplicar a cada dez ou catorze dias existe — por tolerância,
                por orientação, por preço — e para essa pessoa o app
                contava tudo errado e cobrava dose atrasada de quem não
                estava atrasada. Fica aqui, dito como o que é: o padrão
                primeiro, a exceção a um toque. */}
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
          <View style={{ gap: 34 }}>
            <View>
              <Rotulo>ALTURA</Rotulo>
              <Contador
                valor={nf(r.altura, 2)}
                unidade="m"
                onMenos={() => p({ altura: Math.max(1.2, Math.round((r.altura - 0.01) * 100) / 100) })}
                onMais={() => p({ altura: Math.min(2.2, Math.round((r.altura + 0.01) * 100) / 100) })}
                onDigitar={(v) => {
                  const x = parseFloat(v.replace(',', '.'));
                  if (!Number.isNaN(x)) p({ altura: Math.min(2.2, Math.max(1.2, x)) });
                }}
              />
            </View>
            <View>
              <Rotulo>PESO DE HOJE</Rotulo>
              <Contador
                valor={nf(r.peso, 1)}
                unidade="kg"
                onMenos={() => p({ peso: Math.max(35, Math.round((r.peso - 0.1) * 10) / 10) })}
                onMais={() => p({ peso: Math.min(300, Math.round((r.peso + 0.1) * 10) / 10) })}
                onDigitar={(v) => {
                  const x = parseFloat(v.replace(',', '.'));
                  if (!Number.isNaN(x)) p({ peso: Math.min(300, Math.max(35, x)) });
                }}
              />
            </View>
          </View>
        ) : null}

        {id === 'meta' ? (
          <View style={{ gap: 16 }}>
            <View>
              <Rotulo>PESO DE REFERÊNCIA</Rotulo>
              <Contador
                valor={nf(r.meta, 1)}
                unidade="kg"
                onMenos={() => p({ meta: Math.max(35, Math.round((r.meta - 0.5) * 10) / 10) })}
                onMais={() => p({ meta: Math.min(300, Math.round((r.meta + 0.5) * 10) / 10) })}
                onDigitar={(v) => {
                  const x = parseFloat(v.replace(',', '.'));
                  if (!Number.isNaN(x)) p({ meta: Math.min(300, Math.max(35, x)) });
                }}
              />
            </View>

            {/* Meta ACIMA do peso de hoje é escolha legítima de quem está
                subindo de volta, não erro para bloquear — e nesse caso o
                ritmo de perda não tem o que fazer na tela. */}
            {perder > 0 ? (
              <View style={{ gap: 10 }}>
                <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1 }}>
                  EM QUE RITMO · {nf(perder, 1)} KG A PERCORRER
                </Txt>
                {RITMOS.map((kg) => {
                  const semanas = Math.ceil(perder / kg);
                  const quando = +new Date(+startOfDay(now()) + semanas * 7 * 86400000);
                  return (
                    <Escolha
                      key={kg} cheia
                      titulo={`${nf(kg, 2)} kg por semana`}
                      sub={`chega por volta de ${mesPorExtenso(quando)}`}
                      on={r.ritmo === kg}
                      onPress={() => p({ ritmo: kg })}
                    />
                  );
                })}
                <Txt v="caption" c={c.tx3}>
                  É o ritmo que você quer seguir, não uma previsão: quanto o peso desce
                  depende do corpo e da dose.
                </Txt>
              </View>
            ) : (
              <Txt v="caption" c={c.tx3} style={{ textAlign: 'center' }}>
                {r.meta === r.peso
                  ? 'Mesmo peso de hoje — manter também é meta.'
                  : `${nf(Math.abs(perder), 1)} kg acima do seu peso de hoje.`}
              </Txt>
            )}
          </View>
        ) : null}

        {id === 'motivacao' ? (
          <Duplas>
            {MOTIVOS.map((x) => (
              <Escolha
                key={x.id} ic={x.ic} titulo={x.titulo} sub={x.sub}
                on={r.motivacao === x.id}
                onPress={() => p({ motivacao: x.id })}
              />
            ))}
          </Duplas>
        ) : null}

        {id === 'movimento' ? (
          <View style={{ gap: 10 }}>
            {MOVIMENTO.map((x) => (
              <Escolha
                key={x.id} cheia
                titulo={x.titulo} sub={x.sub}
                on={r.movimento === x.id}
                onPress={() => p({ movimento: x.id })}
              />
            ))}
          </View>
        ) : null}

        {id === 'inicio' ? (
          <Calendario valor={r.inicio} onEscolhe={(t) => p({ inicio: t })} futuro={futuro} />
        ) : null}

        {id === 'acompanhamento' ? (
          <View style={{ gap: 16 }}>
            <Duplas>
              <Escolha
                ic="steth" titulo="Sim" sub="Médico, nutri ou clínica"
                on={r.acompanhado === true}
                onPress={() => p({ acompanhado: true })}
              />
              <Escolha
                ic="user" titulo="Não" sub="Estou por conta própria"
                on={r.acompanhado === false}
                /* Dizer que não apaga o que foi digitado antes: deixar o
                   nome guardado faria o resumo mostrar "por conta própria"
                   e o perfil gravar um profissional. */
                onPress={() => p({ acompanhado: false, quem: '', codigo: '' })}
              />
            </Duplas>

            {r.acompanhado ? (
              <View style={{ gap: 16 }}>
                <View style={{ gap: 8 }}>
                  <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1 }}>QUEM ACOMPANHA</Txt>
                  <CampoTexto
                    valor={r.quem}
                    onChange={(v) => p({ quem: v })}
                    placeholder="Nome do profissional ou da clínica"
                    caixa="words"
                  />
                </View>
                <View style={{ gap: 8 }}>
                  <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1 }}>CÓDIGO DE CONVITE (OPCIONAL)</Txt>
                  <CampoTexto
                    valor={r.codigo}
                    onChange={(v) => p({ codigo: v })}
                    placeholder="Se você recebeu um, digite aqui"
                    caixa="characters"
                  />
                  {/* O QUE ESTA TELA PODE E NÃO PODE PROMETER.

                      O código é o que libera o app para quem chegou por um
                      profissional parceiro, e conferir se ele existe é
                      trabalho de servidor — que este app ainda não tem.
                      Então aqui ele é aceito e guardado, e nada mais: sem
                      "código válido", sem carimbo verde, sem dizer que a
                      partir de agora é grátis. */}
                  <Txt v="caption" c={c.tx3}>
                    Quem chega por um profissional parceiro não paga pelo app. O código é
                    conferido depois — se você não tiver um, pode seguir sem ele.
                  </Txt>
                </View>
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      {/* O RODAPÉ É OPACO. Sem fundo, a lista de opções passava por baixo
          do botão e a última delas aparecia cortada ao meio atrás de uma
          pílula translúcida — parecia defeito de render, não fim de
          lista. */}
      <View style={{
        paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 20,
        backgroundColor: c.bg,
      }}>
        <Botao
          pilula
          label={doResumo || n === PASSOS.length - 1 ? 'Ver o resumo' : 'Continuar'}
          desligado={!respondida[n]}
          onPress={() => (doResumo ? aoResumo() : setN(n + 1))}
        />
      </View>
    </View>
  );
}
