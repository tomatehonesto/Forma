import React from 'react';
import { View, Pressable, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { MEDS, CADENCE_DAYS } from '../logic/meds';
import {
  FAIXAS_IMC, curWeight, faixaDoIMC, litros, planoDoPerfil,
} from '../logic/derive';
import type { PlanoInicial } from '../logic/derive';
import { FONTES } from '../logic/fontes';
import { MO_LONG, doseTxt, kgTxt, milhar, nf, now, startOfDay } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { Botao, Grade2 } from '../ui/internas';
import { AreaCurve } from '../ui/charts';
import { Lavagem } from '../ui/lavagem';
import { useTheme } from '../ui/useTheme';
import { radius, font, ty } from '../theme';

/* ============================================================
   O PLANO — o que as respostas do cadastro viraram

   Vive em dois lugares e é o mesmo componente nos dois: no fim do
   cadastro, como a devolutiva de quem acabou de responder quinze
   perguntas, e em /plano, para quem quiser rever depois. A diferença
   entre os dois é uma linha — para onde vai o botão do rodapé.

   ELE NÃO LÊ A LOJA. Recebe os números prontos em `dados`, porque no
   cadastro eles ainda não foram gravados em lugar nenhum: são respostas
   na memória de uma tela. Quem lê a loja é a rota, no fim deste arquivo.

   É UM RESUMO VISUAL, e por isso o texto é curto: toda frase aqui disputa
   espaço com um número, e o número é o assunto.

   O QUE NÃO VEIO DAS REFERÊNCIAS:

     · "você começa a ver diferença em 30 de setembro". Ninguém sabe isso.
       A curva aqui tem a forma que os ensaios mostram, e os dois extremos
       são o ritmo que a pessoa escolheu — nem um nem outro é promessa.
     · o selo de "baseado em evidência" sem nada atrás. A etiqueta do topo
       só existe porque a última seção existe, e lá cada trabalho abre.
   ============================================================ */

export type DadosDoPlano = {
  nome: string;
  peso: number;
  meta: number;
  /** kg por semana; null quando não há o que perder */
  ritmo: number | null;
  /** id do catálogo, ou 'indefinido' */
  med: string;
  dose: number | null;
  /** intervalo fora do padrão da caneta, em dias */
  intervalo: number | null;
  plano: PlanoInicial;
};

export function Plano({ dados: d, aoSair, rotuloSair }: {
  dados: DadosDoPlano;
  aoSair: () => void;
  rotuloSair: string;
}) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const med = MEDS[d.med] ?? null;
  const padrao = CADENCE_DAYS(d.med);
  const perder = d.peso - d.meta;
  const plano = d.plano;
  const primeiro = d.nome.trim().split(' ')[0];
  const marca = d.med !== 'indefinido' && med ? ` com o ${med.label}®` : '';
  /* O QUE VAI EM PESO na frase de abertura: os quilos, ou o verbo
     inteiro quando não há quilo nenhum a percorrer. */
  const alvoForte = Math.abs(perder) > 0.05 ? `${kgTxt(Math.abs(perder))} kg` : 'manter o seu peso';
  const inter = d.intervalo ?? padrao;
  const cadTexto = inter === 1 ? 'todos os dias'
    : inter === 7 ? 'uma vez por semana' : `a cada ${inter} dias`;
  /* A FORMA DA QUEDA — e por que ela deixou de ser uma reta.

     A linha era reta porque "0,5 kg por semana" desenha uma reta, e eu
     tinha recusado a curva da referência por afirmar um modelo que
     ninguém calculou. Estava errado na segunda parte: o modelo existe e
     está publicado.

     O QUE OS ENSAIOS MOSTRAM é uma queda que AFROUXA. No STEP 1, cerca de
     2% do peso por mês nos primeiros seis meses e cerca de 1% por mês
     daí em diante. No mundo real, ~6,4% em doze semanas contra ~15% em
     68 — o começo rende umas três vezes mais por semana do que o fim. E
     no SURMOUNT-1 a mediana até o platô fica entre 24 e 36 semanas,
     conforme o IMC de partida.

     A função forma(x) é isso: a fração do total já perdida na fração x do
     caminho. 45% em linha reta e 55% num afrouxamento quadrático deixa o
     começo cerca de três vezes mais inclinado que o fim, que é a razão
     que os ensaios mostram. Aos 50% do tempo, 64% do caminho — o que
     também é o que se lê quando dizem que "a maior parte da perda
     acontece nos primeiros quatro ou cinco meses".

     O QUE CONTINUA NÃO SENDO PREVISÃO: os dois extremos. A partida é o
     peso de hoje e a chegada é a meta na data que o ritmo escolhido
     produz — o ritmo é a MÉDIA do caminho, e a forma diz como essa média
     se distribui. Nenhum dos dois promete que vai acontecer.

     E a referência desenha a curva ao contrário: a dela cai mais no fim.
     A titulação faz as primeiras semanas renderem menos que as seguintes,
     mas ao longo de meses quem afrouxa é o fim, não o começo. */
  /* A CURVATURA DEPENDE DO TAMANHO DO PLANO, e não é enfeite regulável.

     Um plano de dez semanas cabe inteiro dentro da fase rápida: ali a
     queda é quase constante, e curvar muito seria desenhar um platô que
     não vai acontecer nesse prazo. Um plano de oito meses atravessa a
     janela em que o platô aparece — 24 a 36 semanas nos SURMOUNT —, e
     nele o fim é mesmo quase reto.

     Então a parte reta encolhe conforme o plano se estica: 45% para quem
     tem poucas semanas, 25% para quem cruza a janela do platô. Em razão
     de inclinação, o começo vai de três vezes o fim a sete vezes.

     Aos 50% do tempo isso põe entre 64% e 70% do caminho andado — que é o
     que se lê extrapolando a série de mundo real (~6,4% em doze semanas,
     ~15% em 68) e o "a maior parte acontece nos primeiros quatro ou cinco
     meses". Empurrar mais do que isso deixaria de ser realismo e passaria
     a ser exagero com cara de gráfico. */
  const cruzaPlato = Math.min(1, (plano.semanas ?? 0) / 34);
  const reta = 0.45 - 0.20 * cruzaPlato;
  const forma = (x: number) => reta * x + (1 - reta) * (1 - (1 - x) ** 2);
  const marcos = plano.semanas && d.ritmo
    ? (() => {
      const meio = Math.max(1, Math.round(plano.semanas / 2));
      /* `dt`, e não `d`: o `d` desta tela são os DADOS, e uma data com o
         mesmo nome dentro da função vizinha é o tipo de sombra que passa
         despercebida até alguém mexer numa linha e ler a outra. */
      const quando = (sem: number) => {
        const dt = new Date(+startOfDay(now()) + sem * 7 * 86400000);
        return `${dt.getDate()} de ${MO_LONG[dt.getMonth()].slice(0, 3)}`;
      };
      /* O MARCO DO MEIO SEGUE A MESMA FORMA DA CURVA. Com a reta ele era
         metade da distância; com o afrouxamento, aos 50% do tempo já se
         andou mais do que a metade — e o número embaixo do gráfico tem de
         dizer o que o gráfico desenha. */
      const meioKg = d.peso - perder * forma(meio / (plano.semanas as number));
      return [
        { sem: 0, kg: d.peso, rot: 'hoje', quando: quando(0) },
        { sem: meio, kg: meioKg, rot: `${meio} semanas`, quando: quando(meio) },
        { sem: plano.semanas, kg: d.meta, rot: `${plano.semanas} semanas`, quando: quando(plano.semanas) },
      ];
    })()
    : null;
  /* Nove pontos para o traço sair liso, e nó só em três: começo, meio e
     chegada, que são os marcos que os rótulos embaixo nomeiam. */
  const CURVA = Array.from({ length: 9 }, (_, i) => {
    const x = i / 8;
    const p = forma(x);
    return { x, y: perder > 0.05 ? 1 - p : perder < -0.05 ? p : 0.5 };
  });
  const pos = (v: number) => Math.max(0, Math.min(1, (v - 15) / 25));
  /* O VERDE DA LINHA QUE DESCE.

     Não é token do tema, e é de propósito: no Morphi o lima é a cor do
     feito e o azul é a cor de ação, e nenhuma das duas serve para uma
     linha que representa peso caindo ao longo de meses. Verde descendente
     é convenção da categoria inteira — quem abre a tela já sabe o que a
     linha está dizendo antes de ler o rótulo. */
  const VERDE = '#2FBF71';
  const VERDE_FIM = '#1C9C58';

  /* A RÉGUA DE IMC VAI DE AZUL A VERMELHO, e a direção é a informação.

     Ela era lavanda, turquesa, lima, ouro, rosa e coral: seis cores
     bonitas e sem ordem entre si, e régua sem ordem é arco-íris com uma
     bolinha em cima. Abaixo do peso em azul e o excesso indo ao vermelho é
     a convenção que a pessoa já leu em qualquer laudo — e o verde do meio
     é o mesmo da linha ali de cima, para que "faixa boa" e "caminho até a
     meta" falem a mesma cor.

     São valores fixos, e não tokens, porque isto é escala categórica: não
     querem dizer "fundo" nem "alerta", querem dizer primeira faixa,
     segunda, terceira. */
  const CORES_IMC = ['#5B9CFF', '#2FBF71', '#F0A23C', '#EE7B3C', '#E05038', '#C22E2E'];
  const fxHoje = faixaDoIMC(plano.imc);
  const fxMeta = faixaDoIMC(plano.imcMeta);
  const iHoje = FAIXAS_IMC.indexOf(fxHoje);
  const iMeta = FAIXAS_IMC.indexOf(fxMeta);
  /* Um selo por instituição, e não por trabalho: a Academy of Nutrition
     and Dietetics sustenta dois números, e o nome dela duas vezes lado a
     lado parece erro de montagem. O toque abre o primeiro trabalho dela. */
  const SELOS = FONTES.filter((x, i) => FONTES.findIndex((y) => y.sigla === x.sigla) === i);
  const AJUDA: [string, string, string][] = [
    ['syringe', 'Cada dose no lugar certo', 'o rodízio dos locais e o ciclo da caneta, sem você contar'],
    ['mood', 'O enjoo em números', 'o que você sente vira padrão, e o padrão vai para a consulta'],
    ['scale', 'A sua curva de peso', 'cada pesagem entra na linha, com a leitura do que mudou'],
    ['doc', 'Um resumo para a consulta', 'doses, sintomas e peso organizados numa página só'],
  ];
  const Secao = ({ t }: { t: string }) => (
    <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1.2, marginBottom: 12 }}>{t}</Txt>
  );
  const cartao = { backgroundColor: c.bg1, borderRadius: radius.lg };
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        <Lavagem altura={insets.top + 380} />
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
          {/* UMA FRASE SÓ, e a quebra onde ela couber.

              O nome estava numa linha e o recado em outra, forçados: com
              um nome curto sobrava um vão à direita, com um longo a linha
              apertava, e a frase lia como duas. Solta, ela quebra onde o
              texto pede — e o nome continua sendo o único em peso, que é
              o que separa quem está sendo chamada do que está sendo dito.

              A ENTRELINHA ENCOLHEU. Quarenta e quatro é a medida de uma
              manchete de duas linhas; em três, o bloco vira uma escada
              com degraus altos demais e o começo da frase se solta do
              fim. */}
          <Txt style={{ ...ty.h1, fontFamily: font.body, lineHeight: 38, textAlign: 'center' }}>
            <Txt style={{ ...ty.h1, lineHeight: 38 }}>{primeiro},</Txt>
            {' o seu plano personalizado está pronto!'}
          </Txt>
          {/* O PESO DA META EM DESTAQUE: é o número que a pessoa veio
              buscar, e ele estava diluído no meio da frase. */}
          <Txt v="note" c={c.tx2} style={{ textAlign: 'center' }}>
            Para {perder > 0.05 ? 'perder ' : perder < -0.05 ? 'ganhar ' : ''}
            <Txt v="note" style={{ fontFamily: font.bodySemi, color: c.tx }}>{alvoForte}</Txt>
            {marca}.
          </Txt>
          {/* AS ETIQUETAS VIRARAM UMA FRASE COM DUAS PONTAS.

              "Das suas respostas" e "Com base em estudos" eram dois
              carimbos soltos: cada um se defendia sozinho e nenhum dizia
              do que estava falando. Com a linha em cima, as duas viram o
              fim da mesma frase — o plano foi pensado a partir DISTO e
              DAQUILO —, e o que era selo vira procedência. */}
          <Txt v="caption" c={c.tx3} style={{ textAlign: 'center', marginTop: 4 }}>
            O seu plano foi elaborado pensando
          </Txt>
          <Row style={{ gap: 8, justifyContent: 'center', marginTop: -6 }}>
            {([['user', 'Nas suas respostas'], ['book', 'Em estudos sobre GLP-1']] as [string, string][])
              .map(([ic, t]) => (
                <Row key={t} style={{
                  gap: 6, alignItems: 'center', backgroundColor: c.accentWeak,
                  borderRadius: radius.pill,
                  paddingHorizontal: 11, paddingVertical: 7,
                }}>
                  <Icon name={ic} size={13} color={c.accent} sw={2} />
                  <Txt v="micro" c={c.accent}>{t}</Txt>
                </Row>
              ))}
          </Row>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 30 }}>
          {/* ---------- o dia ---------- */}
          <View>
            <Secao t="A SUA META DE ENERGIA" />

            {/* A ENERGIA É O NÚMERO GRANDE porque é dela que os outros
                saem: carboidrato e gordura são fatia de uma meta de
                energia, e não existem sem ela.

                E AGORA ELA DIZ POR QUE EXISTE. "O seu dia" era um título
                de gaveta: dizia onde o número mora e não o que ele faz.
                Num tratamento de GLP-1 a caneta tira a fome, e o que
                decide o ritmo da perda é o tamanho do déficit — esta é a
                conta que transforma o remédio em quilo perdido, e é
                também a que protege a massa magra quando alguém resolve
                comer muito abaixo dela. */}
            <View style={{
              backgroundColor: c.accentWeak, borderRadius: radius.lg, padding: 16, gap: 8,
            }}>
              <Row style={{ gap: 9, alignItems: 'center' }}>
                <Icon name="flame" size={17} color={c.accent} sw={1.9} />
                <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>CALORIAS POR DIA</Txt>
              </Row>
              <Row style={{ alignItems: 'baseline', gap: 5 }}>
                <Txt v="metric" c={c.accent}>{milhar(plano.kcal)}</Txt>
                <Txt v="caption" c={c.tx2}>kcal</Txt>
              </Row>
              <Txt v="caption" c={c.tx2}>
                A caneta tira a fome; é este número que decide o ritmo da perda. Comer
                muito abaixo dele não acelera nada — só cobra músculo no caminho.
              </Txt>
              {/* QUANDO O RITMO NÃO CABE, A TELA DIZ. Dois quilos por
                  semana pedem 2.200 kcal de déficit por dia — mais do
                  que o gasto inteiro de muita gente. A meta para no piso
                  e a frase explica, em vez de o número aparecer menor do
                  que a conta sem motivo visível. */}
              <Txt v="caption" c={c.tx3}>
                {plano.noPiso
                  ? `No ritmo que você escolheu, a conta pediria menos do que o mínimo seguro sem acompanhamento médico. A meta parou aí.`
                  : `Do seu gasto estimado de ${milhar(plano.gasto)} kcal, menos o déficit do ritmo que você escolheu.`}
              </Txt>
            </View>

            <View style={{ marginTop: 10 }}>
              <Grade2>
                {([
                  ['utensils', c.rose, c.roseBg, 'Proteína', `${plano.prot}`, 'g'],
                  ['leaf', c.ok, c.okBg, 'Carboidrato', `${plano.carb}`, 'g'],
                  ['drop2', c.amber, c.amberBg, 'Gordura', `${plano.gord}`, 'g'],
                  ['gut', c.purple, c.purpleBg, 'Fibra', `${plano.fibra}`, 'g'],
                ] as [string, string, string, string, string, string][])
                  .map(([ic, cor, fundo, nome, val, un]) => (
                    <View key={nome} style={[cartao, { flex: 1, padding: 14 }]}>
                      <Row style={{ gap: 8, alignItems: 'center' }}>
                        <View style={{
                          width: 26, height: 26, borderRadius: 8, backgroundColor: fundo,
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Icon name={ic} size={14} color={cor} sw={1.9} />
                        </View>
                        <Txt v="caption" c={c.tx3}>{nome}</Txt>
                      </Row>
                      <Row style={{ marginTop: 10, alignItems: 'baseline' }}>
                        <Txt v="metric" style={{ fontSize: 26, lineHeight: 32 }}>{val}</Txt>
                        <Txt v="caption" c={c.tx3} style={{ marginLeft: 3 }}>{un}</Txt>
                      </Row>
                    </View>
                  ))}
              </Grade2>
            </View>

            <Row style={[cartao, { marginTop: 10, padding: 14, gap: 12, alignItems: 'center' }]}>
              <View style={{
                width: 26, height: 26, borderRadius: 8, backgroundColor: c.waterBg,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="water" size={14} color={c.water} sw={1.9} />
              </View>
              <Txt v="caption" c={c.tx3} style={{ flex: 1 }}>Água</Txt>
              <Row style={{ alignItems: 'baseline' }}>
                <Txt v="metric" style={{ fontSize: 26, lineHeight: 32 }}>{litros(plano.agua)}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginLeft: 3 }}>L</Txt>
              </Row>
            </Row>
          </View>

          {/* ---------- a dose ---------- */}
          <View>
            <Secao t="A SUA DOSE" />
            <View style={[cartao, { padding: 16, gap: 12 }]}>
              {d.med === 'indefinido' ? (
                <>
                  <Row style={{ gap: 12, alignItems: 'center' }}>
                    <View style={{
                      width: 44, height: 44, borderRadius: 14, backgroundColor: c.bg2,
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon name="syringe" size={21} color={c.tx3} sw={1.9} />
                    </View>
                    <Txt v="body" style={{ flex: 1 }}>Ainda a definir</Txt>
                  </Row>
                  <Txt v="caption" c={c.tx3}>
                    Quando você souber a caneta, eu monto a escada de doses e o ciclo.
                  </Txt>
                </>
              ) : (
                <>
                  <Row style={{ gap: 12, alignItems: 'center' }}>
                    <View style={{
                      width: 44, height: 44, borderRadius: 14, backgroundColor: c.accentWeak,
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon name="syringe" size={21} color={c.accent} sw={1.9} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Txt v="body">{`${med?.label}®`}</Txt>
                      <Txt v="note" c={c.tx3} style={{ marginTop: 1 }}>{cadTexto}</Txt>
                    </View>
                    {d.dose ? (
                      <Row style={{ alignItems: 'center' }}>
                        <Txt v="metric" style={{ fontSize: 28, lineHeight: 34 }}>{doseTxt(d.dose)}</Txt>
                        <Txt v="caption" c={c.tx3} style={{ marginLeft: 3, marginTop: 4 }}>{med?.unit}</Txt>
                      </Row>
                    ) : null}
                  </Row>
                  <Txt v="caption" c={c.tx3}>
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
              {/* A LINHA DESCENDO, que é o que a pessoa veio ver. Ela é
                  RETA porque "1 kg por semana" desenha uma reta — a
                  exponencial da referência afirmaria um modelo de como o
                  peso cai que ninguém calculou. E é TRACEJADA porque
                  nada disso aconteceu ainda: traço cheio é medida, e no
                  primeiro dia existe uma pesagem só.

                  Os três nós são os marcos, e os rótulos embaixo caem
                  debaixo de cada um. */}
              <View style={[cartao, { overflow: 'hidden' }]}>
                <Row style={{ padding: 16, paddingBottom: 4, alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Txt v="body">{perder > 0 ? 'Peso a perder' : 'Peso a ganhar'}</Txt>
                    <Txt v="note" c={c.tx3} style={{ marginTop: 2 }}>
                      {`em ${plano.semanas} semanas`}
                    </Txt>
                  </View>
                  <Row style={{ alignItems: 'center' }}>
                    <Txt v="metric">{kgTxt(Math.abs(perder))}</Txt>
                    <Txt v="caption" c={c.tx3} style={{ marginLeft: 3, marginTop: 6 }}>kg</Txt>
                  </Row>
                </Row>

                {/* A LINHA SANGRA DE PONTA A PONTA, como a de peso na Home:
                    é assim que este app desenha curva, e recuo lateral
                    fazia o gráfico parecer uma figura colada dentro do
                    cartão em vez de ser o cartão.

                    SEM TRACEJADO. Ele dizia "isto ainda não aconteceu", o
                    que continua sendo verdade — só que quem diz isso agora
                    é a frase embaixo, e ela diz melhor: traço picotado é
                    sinal que só lê quem já conhece a convenção.

                    NÓ E FIO SÓ NO MEIO. Nas pontas a curva encosta na borda
                    do cartão, e ali bolinha sai pela metade e fio vira
                    moldura — o começo e a chegada já se marcam pelo próprio
                    fim do traço, com o rótulo logo embaixo. */}
                <AreaCurve
                  pts={CURVA}
                  height={140} padT={18} padB={14} padX={0} strokeW={2.6}
                  id="pl" dashed={false} nodes nosEm={[4]} eixosEm={[4]} fill={0.18}
                  strokeFrom={VERDE} strokeTo={VERDE_FIM}
                />

                <Row style={{ paddingHorizontal: 14, paddingBottom: 16, gap: 6 }}>
                  {marcos.map((m, i) => (
                    <View key={m.rot} style={{
                      flex: 1,
                      alignItems: i === 0 ? 'flex-start' : i === 1 ? 'center' : 'flex-end',
                    }}>
                      <Row style={{ alignItems: 'baseline', gap: 3 }}>
                        <Txt v="label" c={i === 2 ? VERDE_FIM : c.tx}>{nf(m.kg, 1)}</Txt>
                        <Txt v="micro" c={c.tx4}>kg</Txt>
                      </Row>
                      <Txt v="micro" c={c.tx4} style={{ marginTop: 1 }}>
                        {m.sem === 0 ? 'hoje' : m.quando}
                      </Txt>
                    </View>
                  ))}
                </Row>
              </View>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 10 }}>
                {`A queda não é reta: nos estudos, as primeiras semanas rendem mais e o ritmo afrouxa conforme o corpo se ajusta. Os ${nf(d.ritmo ?? 0, 1)} kg por semana que você escolheu são a média do caminho, não uma previsão.`}
              </Txt>
            </View>
          ) : null}

          {/* ---------- o corpo ---------- */}
          <View>
            <Secao t="O SEU CORPO" />
            <View style={[cartao, { padding: 18, gap: 18 }]}>
              <Row style={{ alignItems: 'center', gap: 10 }}>
                {([[fxHoje, 'IMC de hoje', plano.imc, iHoje, 'flex-start'],
                  [fxMeta, 'Na sua meta', plano.imcMeta, iMeta, 'flex-end']] as const)
                  .map(([fx, rot, val, idx, lado], i) => (
                    <React.Fragment key={rot}>
                      {i ? <Icon name="chev" size={15} color={c.tx4} sw={2} /> : null}
                      <View style={{ flex: 1, gap: 4, alignItems: lado }}>
                        <Txt v="caption" c={c.tx3}>{rot}</Txt>
                        <Txt v="metric" style={{ fontSize: 28, lineHeight: 34 }}>{nf(val, 1)}</Txt>
                        <Row style={{ gap: 6, alignItems: 'center' }}>
                          <View style={{
                            width: 7, height: 7, borderRadius: 4, backgroundColor: CORES_IMC[idx],
                          }} />
                          <Txt v="micro" c={c.tx2}>{fx.nome}</Txt>
                        </Row>
                      </View>
                    </React.Fragment>
                  ))}
              </Row>

              {/* A RÉGUA TEM NÍVEIS SEPARADOS — o degradê apagava
                  justamente o que ela existe para mostrar, que é onde
                  uma faixa acaba e a outra começa. As duas que importam
                  ficam cheias; as outras continuam legíveis, porque a
                  régua mostra a escala inteira. */}
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
                  borderWidth: 3, borderColor: c.tx, backgroundColor: c.bg1,
                }} />
                <View style={{
                  position: 'absolute', top: -4, left: `${pos(plano.imc) * 100}%`,
                  marginLeft: -9, width: 18, height: 18, borderRadius: 9,
                  borderWidth: 3, borderColor: c.bg1, backgroundColor: c.tx,
                }} />
              </View>

              <Txt v="caption" c={c.tx3}>
                O IMC é ponto de partida: ele não separa músculo de gordura.
              </Txt>
            </View>
          </View>

          {/* ---------- como eu ajudo ---------- */}
          <View>
            <Secao t="COMO EU TE AJUDO" />
            <View style={[cartao, { paddingHorizontal: 16 }]}>
              {AJUDA.map(([ic, t, sub], i) => (
                <Row key={t} style={{
                  gap: 13, alignItems: 'center', paddingVertical: 14,
                  borderTopWidth: i ? 1 : 0, borderTopColor: c.line2,
                }}>
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
          </View>

          {/* DE ONDE VIERAM OS NÚMEROS — e os nomes de quem publicou.

              Os selos deixaram de abrir link. Um toque que sai do app no
              meio da tela de plano tira a pessoa do fluxo para entregar um
              PDF em inglês de vinte páginas: a promessa é boa e a entrega
              não é. O que eles fazem aqui é o que selo faz numa embalagem
              — dizer de onde vem —, e o título de cada trabalho continua
              em fontes.ts, que é onde ele serve para auditoria. */}
          <View>
            <Secao t="A CIÊNCIA POR TRÁS DO SEU PLANO" />
            <View style={[cartao, { padding: 18, gap: 14 }]}>
              <Row style={{ gap: 11, alignItems: 'center' }}>
                <View style={{
                  width: 38, height: 38, borderRadius: 12, backgroundColor: c.accentWeak,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="book" size={18} color={c.accent} sw={1.9} />
                </View>
                <Txt v="bodyMed" style={{ flex: 1 }}>
                  Cada número saiu de uma diretriz ou de um estudo publicado
                </Txt>
              </Row>
              <Txt v="caption" c={c.tx3}>
                Nada aqui foi estimado no olho: a sua meta de proteína, a de água, a de
                energia e a curva de perda seguem recomendações de saúde pública e ensaios
                clínicos revisados por pares.
              </Txt>
              <Row style={{ gap: 8, flexWrap: 'wrap' }}>
                {SELOS.map((fo) => (
                  <View
                    key={fo.sigla}
                    style={{
                      backgroundColor: c.accentWeak, borderRadius: radius.pill,
                      paddingHorizontal: 12, paddingVertical: 7,
                    }}
                  >
                    <Txt v="micro" c={c.accent}>{fo.sigla}</Txt>
                  </View>
                ))}
              </Row>
            </View>
            {/* O NOSSO PAPEL, DITO POR INTEIRO — e a ordem importa: primeiro
                o que fazemos, depois o que não fazemos. Dizer só "nada aqui
                substitui quem te acompanha" soava como isenção de
                responsabilidade no rodapé; dito assim, é a divisão de
                trabalho que a pessoa precisa entender para usar o app. */}
            <Txt v="caption" c={c.tx3} style={{ marginTop: 10 }}>
              A gente acompanha a sua jornada todos os dias e organiza o que você registra —
              mas quem conduz o tratamento é a sua equipe de saúde. Estes números são ponto
              de partida para essa conversa, e não prescrição.
            </Txt>
          </View>
        </View>
      </ScrollView>

      <View style={{
        paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 20,
        backgroundColor: c.bg,
      }}>
        <Botao pilula label={rotuloSair} onPress={aoSair} />
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * /plano — A PORTA PARA OLHAR A TELA, e não uma tela do app
 *
 * O plano é a ÚLTIMA TELA DO CADASTRO, e é só isso: não existe "meu
 * plano" na área logada, e nada no app leva até aqui. Esta rota existe
 * porque, sem ela, ver uma vírgula fora do lugar custava responder quinze
 * perguntas de novo — e trabalho que se repete a cada ajuste é ajuste que
 * deixa de ser feito.
 *
 * Ela monta a tela com o perfil que estiver na loja, que é o jeito de ter
 * números de gente de verdade em vez dos zeros de um formulário vazio. Se
 * um dia o plano virar tela de produto, é aqui que ele nasce — mas hoje
 * não é, e o comentário existe para que ninguém confunda porta de serviço
 * com porta de entrada.
 * ------------------------------------------------------------------ */
export default function PreviaDoPlano() {
  const S = useStore((s) => s.S);
  const router = useRouter();
  const p = S.profile as any;
  const peso = curWeight(S);
  const plano = planoDoPerfil(S);
  return (
    <Plano
      dados={{
        nome: p.name ?? '',
        peso,
        meta: p.goalWeight,
        ritmo: typeof p.ritmo === 'number' ? p.ritmo : null,
        med: p.med,
        dose: typeof p.dose === 'number' ? p.dose : null,
        intervalo: typeof p.intervalo === 'number' ? p.intervalo : null,
        plano,
      }}
      aoSair={() => router.back()}
      rotuloSair="Voltar"
    />
  );
}
