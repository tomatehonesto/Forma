import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Line as SvgLine } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import {
  examCats, examBy, examLast, examFirst, examStatus, examGaugeData, examSummary,
  examExplain, examAbout, examInfluences, examWays, examesComValor, examesForaDaRef,
  nomeDoMarcador,
} from '../logic/derive';
import { fmtDate, nf, dataLonga } from '../logic/time';
import { Txt, Row, Rich, Vazio } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { AskCompanion } from '../ui/Ask';
import {
  TelaInterna, Bloco, Cartao, Linha, Selo, Botao,
} from '../ui/internas';
import { CapaDeHabito, FolhaDeHabito, TelaDeHabito } from '../ui/capa';
import { useAurora } from '../ui/aurora';
import { useTheme } from '../ui/useTheme';
import { radius, shadowCard, alfa, mix } from '../theme';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.exames.tela;

/* ============================================================
   EXAMES

   Duas telas em uma: a lista de marcadores por categoria e o detalhe de um
   deles. O detalhe é estado, não rota — por isso a seta de voltar dele
   desfaz a seleção em vez de desempilhar. Sem isso, fechar um marcador
   jogaria a pessoa para fora de Exames inteiro.

   A régua (Gauge) é a peça que justifica esta tela existir. Um resultado de
   exame sozinho não diz nada a quem não é médico: 5,6% é bom ou ruim? A
   régua responde mostrando ONDE o valor caiu dentro da faixa de referência,
   que é a única leitura que a pessoa consegue fazer sem formação.
   ============================================================ */

/* ============================================================
   O TERMO CURTO É "REFERÊNCIA", E FOI "FAIXA"

   O nome completo continua sendo "faixa de referência", que é o termo
   certo. O que mudou foi por qual metade dele a gente encurta.

   ⚠️ "REFERÊNCIA" É A PALAVRA QUE ESTÁ NO PAPEL. Todo laudo de
   laboratório brasileiro imprime "Valores de referência" em cima da
   coluna dos limites. "Faixa" não aparece em lugar nenhum daquela folha —
   quem chega aqui com o exame na mão reconhece uma e não a outra.

   ⚠️ E ELA NOMEIA DE QUEM É O LIMITE. "Fora da faixa" soa como veredito
   nosso; "fora da referência" aponta para quem escreveu a referência, que
   é o laboratório. Numa tela que existe para não dar diagnóstico, a
   diferença não é de estilo.

   ⚠️ E NÃO É "NORMAL"/"ALTERADO", que é como as pessoas falam. Esse par
   importa um juízo que o aplicativo não tem como fazer: um valor fora da
   referência não é necessariamente anormal para aquela pessoa, e um
   dentro não é necessariamente tranquilo. "Alterado" é, das palavras
   possíveis, a que mais assusta antes de haver alguém para conversar.
   ============================================================ */

const fmtV = (v: number) => nf(v, v % 1 ? 1 : 0);

/* ⚠️ O CINZA DE FORA DA FAIXA NÃO É O `c.track`, e era.

   O `track` nasceu para ser a calha de uma barra de progresso: uma FORMA
   grande e contínua, que se enxerga pelo tamanho mesmo sendo quase da cor
   do papel. Aqui ele vira um ponto de cinco pixels sobre o fundo da tela,
   e dois cinzas a essa distância simplesmente não se separam — a metade
   de fora da régua sumia, e com ela a informação de que existe uma metade
   de fora.

   Um cinza de texto rebaixado dá presença sem virar dado: é um ponto que
   se vê e que continua sendo, claramente, o fundo da escala. Sai do
   `tx4` porque ele é o cinza mais apagado de CADA tema — no claro puxa
   para baixo, no escuro para cima, e a régua não precisa saber em qual
   dos dois está. */
const pista = (c: any) => alfa(c.tx4, 0.42);

/* A FAIXA DITA EM PORTUGUÊS, e no laudo ela vem como "< 5,7" ou "15–150".

   Essa notação é de quem já sabe lê-la — e quem já sabe não precisava de
   nós. Para o resto, "<" é um símbolo que exige tradução antes de virar
   informação, e ninguém traduz símbolo no meio de uma frase sobre a
   própria saúde.

   Sai da `examGaugeData` e não do texto do laudo porque `temMin`/`temMax` já
   sabem quais bordas o laboratório de fato escreveu — parsear a string de
   novo seria uma segunda verdade sobre o mesmo dado. */
const faixaEmPalavras = (e: any) => {
  const g = examGaugeData(e);
  /* ⚠️ COM A UNIDADE, e antes ela era subentendida pelo número logo acima.
     Subentendido funciona enquanto os dois estão na mesma tela e na mesma
     leitura — mas o selo é a frase que a pessoa repete para alguém, e
     "abaixo de 5,7" sozinho não é um limite, é um número. */
  const u = e.unit ? ` ${e.unit}` : '';
  if (g.temMin && g.temMax) return K().faixaEntre(fmtV(g.limMin), fmtV(g.limMax), u);
  if (g.temMax) return K().faixaAbaixo(fmtV(g.limMax), u);
  if (g.temMin) return K().faixaAcima(fmtV(g.limMin), u);
  return K().faixaRef(e.ref, u);
};

/* A RÉGUA RESPONDE DUAS COISAS DE UMA VEZ: ONDE EU PRECISO ESTAR, E
   ONDE EU ESTOU.

   ⚠️ SÃO DUAS FILEIRAS DE PONTOS, e por três versões foi uma.

   Uma fileira só, por mais densa que fique, continua sendo uma LINHA — e
   linha é eixo: o olho a percorre da esquerda para a direita procurando
   uma posição, como faria numa régua de escola. Duas fileiras deixam de
   ser eixo e passam a ser SUPERFÍCIE: a faixa de referência vira uma
   área com altura, que se enxerga de relance como região em vez de se
   ler como intervalo.

   É a diferença entre "o normal vai de 13,5 a 18" e "o normal é este
   pedaço aqui". A segunda é a que serve para quem não lê exame.

   ⚠️ E AS DUAS FILEIRAS SÃO IDÊNTICAS, coluna a coluna. A tentação seria
   dar significado à segunda — outra métrica, outra coleta, o valor
   anterior. Não: ela existe para dar corpo à faixa, e qualquer dado que
   morasse nela transformaria uma leitura de relance em duas leituras.

   ⚠️ A INTENSIDADE É A DISTÂNCIA ATÉ O LIMITE MAIS PRÓXIMO. Ponto mais
   forte é ponto mais longe da borda do normal. Isso NÃO é uma opinião
   sobre qual lado da faixa é melhor — é a geometria da própria faixa, e
   vale igual para creatinina, TSH e ferritina, que não declaram lado
   nenhum.

   ⚠️ E O QUE É LIMITE DE VERDADE VEM DA REFERÊNCIA, não do desenho. Numa
   "< 5,7" só existe a borda de cima: a de baixo é o zero que o quadro
   precisou inventar. Contar esse zero faria o ponto mais forte cair em
   2,8% — o aplicativo afirmando que metade do normal é o ideal.

   ⚠️ O MARCADOR ATRAVESSA AS DUAS FILEIRAS, em vez de morar numa delas.
   Dentro de uma fileira ele seria mais um ponto da série, um pouco
   maior; por cima das duas, ele é outra coisa — o que ele é. E o anel na
   cor do fundo o descola da faixa mesmo quando cai bem no meio dela,
   onde a cor por baixo é quase a dele.

   ⚠️ OS NÚMEROS FICAM SOB AS BORDAS, e ficavam nas pontas do quadro. Nas
   pontas eles descreviam a moldura; sob as bordas eles respondem a
   pergunta — "de 13,5 a 18" é o intervalo, e é isso que a pessoa leva
   embora. */
const PONTOS_DA_REGUA = 41;
const RAIO_DO_PONTO = 2.5;
const ALTURA_DA_FILEIRA = 5;
const RESPIRO_ENTRE_FILEIRAS = 5;

function Regua({ e }: { e: any }) {
  const { c, isDark } = useTheme();
  const g = examGaugeData(e);

  /* Quanto este ponto está longe da borda mais próxima da faixa, de 0
     (encostado) a 1 (o mais longe que dá dentro dela). */
  const profundidade = (pct: number) => {
    const distL = g.temMin ? pct - g.bandL : Infinity;
    const distR = g.temMax ? g.bandR - pct : Infinity;
    const dist = Math.min(distL, distR);
    if (!isFinite(dist)) return 1;
    const alcance = (g.temMin && g.temMax)
      ? Math.max(1, (g.bandR - g.bandL) / 2)
      : Math.max(1, g.bandR - g.bandL);
    return Math.min(1, Math.max(0, dist / alcance));
  };

  const corDoPonto = (pct: number) => {
    if (pct < g.bandL || pct > g.bandR) return pista(c);
    const t = profundidade(pct);
    return t < 0.5
      ? mix(c.bg, c.accent, 0.45 + t * 1.1)
      : mix(c.accent, c.accent2, (t - 0.5) * 2);
  };

  /* ⚠️ O MARCADOR É A COLUNA FECHADA, e já foi bola, cápsula e dois
     pontos escuros soltos.

     A bola e a cápsula eram peças NOVAS pousadas sobre a régua — e peça
     pousada tem borda, tem forma própria, e vira alfinete de mapa. Os dois
     pontos escuros resolveram isso, mas custaram o contrário: dois pontos
     soltos entre outros oitenta pontos soltos, e o olho tinha que juntá-los
     para entender que eram uma coisa só.

     Ligando os dois, a coluna inteira vira um traço vertical — a única
     forma vertical numa tela de pontos horizontais. Nada foi acrescentado:
     é a mesma coluna, fechada.

     ⚠️ DENTRO DA FAIXA ELE É O TEAL DA CASA, E FORA É VERMELHO. Já foi
     preto, já foi o verde dos selos e já foi o lima, e a escolha aqui é
     sempre a mesma conta: o traço tem seis pixels de largura, e nessa
     escala a cor não é enfeite, é a única coisa que o torna legível.

     Medido na tela contra o fundo claro: lima 1,12, teal puro 1,50,
     preto 19. Nenhuma das duas cores é ruim — elas foram escolhidas para
     FORMAS GRANDES. A barra de exercício da Home tem oito pixels de
     altura e cento e cinquenta de largura, e nessa área o teal aceso
     canta; em seis pixels ele vira um vinco no papel. É a mesma lição do
     `c.track` logo acima nesta tela.

     ⚠️ E POR ISSO ELE É DIFERENTE NOS DOIS TEMAS, o que normalmente é
     cheiro de remendo.

     Aqui não é: o mesmo teal aclarado sobre fundo escuro é uma cor viva,
     e aprofundado sobre papel branco vira verde-petróleo — a matiz não
     sobrevive à viagem, porque escurecer um ciano é caminhar para o
     verde. No escuro ele fica sendo o teal da casa; no claro, onde não
     dava para ter a cor sem estragá-la, o preto faz o serviço e não
     finge ser uma cor. O "está bom" já está dito no selo, em palavras,
     logo acima.

     O vermelho fica puro nos dois: ele é a exceção, precisa parar o
     olho, e já dá 4,87 sozinho sobre o fundo claro. */
  const iValor = Math.round((g.pos / 100) * (PONTOS_DA_REGUA - 1));
  const corDoValor = g.status === 'ok' ? (isDark ? mix(c.teal, c.tx, 0.45) : c.tx) : c.cta;
  const LARGURA_DO_TRACO = ALTURA_DA_FILEIRA + 1;
  const ALTURA_DO_TRACO = ALTURA_DA_FILEIRA * 2 + RESPIRO_ENTRE_FILEIRAS;

  /* ⚠️ O BALÃO SAIU DAQUI, e o veredito voltou para baixo do número.
     Ele ficava preso ao ponto do valor, então mudava de lugar a cada
     marcador e encolhia perto das bordas — a resposta mais importante da
     tela dependendo de onde o dado tinha caído. Sem ele a régua faz só o
     que régua faz: mostra a faixa e onde você está nela. */

  /* ⚠️ A RÉGUA É UMA FILEIRA DE COLUNAS, e eram duas fileiras de pontos.

     Ligar os dois pontos da mesma coluna, com duas <Row> independentes,
     pedia uma peça absoluta por cima em `left: ${g.pos}%` — e porcentagem
     não cai onde o `space-between` põe o ponto, porque ele reserva a
     largura de um ponto em cada ponta. O erro é de uns dois pixels, que
     numa régua de pontos de cinco é meio ponto de deslocamento: o traço
     nasceria torto em relação à coluna que ele diz ser.

     Por colunas o problema não existe — o marcador não é desenhado SOBRE
     a coluna, ele É a coluna. */
  return (
    <View>
      <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        {Array.from({ length: PONTOS_DA_REGUA }).map((_, i) => {
          if (i === iValor) {
            return (
              <View
                key={i}
                style={{
                  width: LARGURA_DO_TRACO, height: ALTURA_DO_TRACO,
                  borderRadius: LARGURA_DO_TRACO / 2,
                  backgroundColor: corDoValor,
                }}
              />
            );
          }
          const cor = corDoPonto((i / (PONTOS_DA_REGUA - 1)) * 100);
          return (
            <View key={i} style={{ gap: RESPIRO_ENTRE_FILEIRAS }}>
              <View style={{ width: ALTURA_DA_FILEIRA, height: ALTURA_DA_FILEIRA, borderRadius: RAIO_DO_PONTO, backgroundColor: cor }} />
              <View style={{ width: ALTURA_DA_FILEIRA, height: ALTURA_DA_FILEIRA, borderRadius: RAIO_DO_PONTO, backgroundColor: cor }} />
            </View>
          );
        })}
      </Row>

      {/* Os limites, cada um na sua altura. */}
      <View style={{ height: 18, marginTop: 10 }}>
        {/* ⚠️ O ZERO APARECE NAS REFERÊNCIAS DO TIPO "< X", e é a única
            borda inventada que pode virar número na tela.

            Numa "> 30" a borda de cima é o teto que o quadro escolheu e
            não existe no mundo — rotulá-la seria o aplicativo afirmando
            um limite que ninguém escreveu. Já o zero de uma concentração
            é chão de verdade: não existe ferritina negativa, nem HbA1c
            abaixo de zero.

            E com ele a faixa volta a ser um intervalo legível — "de 0 a
            5,7" em vez de um número solto na ponta de uma fita colorida,
            que era o que sobrava. */}
        {g.temMin || g.min === 0 ? (
          <View style={{ position: 'absolute', left: `${g.bandL}%`, width: 60, marginLeft: -30, alignItems: 'center' }}>
            <Txt v="micro" c={c.tx3}>{fmtV(g.temMin ? g.limMin : 0)}</Txt>
          </View>
        ) : null}
        {g.temMax ? (
          <View style={{ position: 'absolute', left: `${g.bandR}%`, width: 60, marginLeft: -30, alignItems: 'center' }}>
            <Txt v="micro" c={c.tx3}>{fmtV(g.limMax)}</Txt>
          </View>
        ) : null}
      </View>
      {/* ⚠️ O RODAPÉ "faixa de referência · < 5,7 %" SAIU DAQUI, e virou a
          segunda metade do selo lá em cima. Ele repetia em notação de laudo
          os mesmos limites que a régua já escreve em cima das bordas, três
          linhas depois do veredito que ele existia para sustentar. */}
    </View>
  );
}

/* ============================================================
   A EVOLUÇÃO — DUAS CAMADAS

   ⚠️ A FAIXA É UMA MALHA DE PONTOS ATRÁS, E A MEDIDA É UMA LINHA NA
   FRENTE. Já foi uma malha só (ilegível: para achar a altura de um ponto
   era preciso contar linhas) e já foi uma linha só sobre uma região
   chapada (a região e o traço eram a mesma camada e brigavam).

   O que resolve é a TEXTURA, não a cor. Pontinhos apagados e um traço
   cheio podem ser da mesma família de cor sem nunca se confundirem: um é
   papel, o outro é tinta. E é o que permite a faixa aparecer como REGIÃO
   — uma área da tela onde o papel é de outra cor — em vez de uma barra
   desenhada entre duas linhas.

   ⚠️ A RESSALVA DA LINHA CONTINUA DE PÉ: o traço entre duas coletas
   desenha caminho que ninguém mediu. Duas coisas a seguram. O x é o tempo
   de verdade, então o vão de oitenta dias aparece como vão longo e o fio
   esticado por cima dele se lê pelo que é. E os segmentos são RETOS: uma
   curva suave insinua aceleração e desaceleração entre as medidas, que é
   exatamente a informação que não existe.

   ⚠️ E O EIXO GANHOU NÚMERO REDONDO. Ele saía da moldura do desenho —
   "9,7", "7,3", "2,4" —, que são os limites do quadro e não valores em
   que alguém pensa. Agora o domínio é esticado até cair num degrau
   bonito, e o preço (o dado ocupa um pouco menos da altura) compra uma
   régua que se lê sem esforço.
   ============================================================ */

/* Degrau "bonito": 1, 2, 2,5 ou 5 vezes uma potência de dez. É a escada
   que todo eixo de gráfico sobe, e a razão de ela ter só esses quatro
   degraus é que são os únicos que a cabeça divide de cabeça. */
function degrauBonito(bruto: number) {
  const dez = Math.pow(10, Math.floor(Math.log10(Math.max(bruto, 1e-9))));
  for (const m of [1, 2, 2.5, 5]) if (dez * m >= bruto - 1e-9) return dez * m;
  return dez * 10;
}

/* ⚠️ MALHA FINA, e ela já foi larga em duas telas desta mesma jornada.
   Com o ponto grande e espaçado, o olho lê CÉLULAS e tenta atribuir valor
   a cada uma; fina, ele lê papel quadriculado e passa direto para o que
   está desenhado em cima. Quatro linhas por degrau do eixo, e não três,
   pelo mesmo motivo: quanto mais perto de uma trama, menos ela pede
   atenção. */
const LINHAS_POR_DEGRAU = 4;
const ESPACO_LINHA = 9;
const RAIO_DA_MALHA = 1.7;
const RAIO_DA_COLETA = 4;
const CALHA = 32;
const RESPIRO_DAS_DATAS = 10;

function MalhaDaEvolucao({ e }: { e: any }) {
  const { c, isDark } = useTheme();
  const g = examGaugeData(e);
  const vals = (e.values as any[]).slice().sort((a, b) => a.t - b.t);
  const [w, setW] = useState(0);

  const limAlto = g.temMax ? g.limMax : null;
  const limBaixo = g.temMin ? g.limMin : null;

  /* O domínio nasce dos DADOS, com folga, e só depois abre espaço para
     uma borda da faixa que esteja perto. "Perto" é um terço da variação
     do próprio marcador: a borda entra quando ela é a próxima pergunta de
     quem olha, e fica de fora quando está a uma distância que só serviria
     para achatar o desenho — num HbA1c de 5,6 a 6,3 com referência
     "< 5,7", deixar o zero mandar punha as três coletas nos dez por cento
     de cima do quadro. */
  const vs = vals.map((x) => x.v);
  let lo = Math.min(...vs), hi = Math.max(...vs);
  const span = Math.max(hi - lo, Math.abs(hi) * 0.06, 1e-6);
  lo -= span * 0.35; hi += span * 0.35;
  const perto = span * 0.35;
  if (limAlto != null && limAlto <= hi + perto) hi = Math.max(hi, limAlto + span * 0.15);
  if (limBaixo != null && limBaixo >= lo - perto) lo = Math.min(lo, limBaixo - span * 0.15);
  /* Concentração não tem lado negativo: a folga pode descer abaixo de
     zero na conta, nunca no eixo. */
  if (lo < 0 && Math.min(...vs) >= 0) lo = 0;

  /* Estica até o degrau redondo mais próximo, para fora dos dois lados.
     Se sobrarem degraus demais, sobe um degrau na escada — seis rótulos
     no eixo já é tabela. */
  let degrau = degrauBonito((hi - lo) / 4);
  let yLo = Math.floor(lo / degrau) * degrau;
  let yHi = Math.ceil(hi / degrau) * degrau;
  while (Math.round((yHi - yLo) / degrau) > 5) {
    degrau = degrauBonito(degrau * 1.5);
    yLo = Math.floor(lo / degrau) * degrau;
    yHi = Math.ceil(hi / degrau) * degrau;
  }
  const degraus = Math.max(1, Math.round((yHi - yLo) / degrau));
  const LINHAS = degraus * LINHAS_POR_DEGRAU + 1;
  const ALTURA = (LINHAS - 1) * ESPACO_LINHA;

  const valorDaLinha = (i: number) => yHi - (i / (LINHAS - 1)) * (yHi - yLo);
  const yDe = (v: number) => (1 - (v - yLo) / Math.max(1e-9, yHi - yLo)) * ALTURA;

  /* ⚠️ A MALHA QUANTIZA A FRONTEIRA, E O VEREDITO NÃO. Uma linha de
     pontos está dentro da janela quando o VALOR dela está dentro — então a
     borda cai em algum lugar do vão entre duas linhas, que é o melhor que
     uma textura consegue. Já o veredito de cada coleta sai do valor
     exato, e é por isso que ele mora no balão do toque e não na malha:
     uma coleta a um décimo do limite pousa num ponto claro e mesmo assim
     diz "acima da referência" quando a pessoa encosta nela. */
  const dentroDe = (v: number) =>
    (limBaixo == null || v >= limBaixo) && (limAlto == null || v <= limAlto);
  const ondeCaiu = (v: number) =>
    dentroDe(v) ? null : (limAlto != null && v > limAlto
      ? T.comum.noMeio(K().vereditoAlto)
      : T.comum.noMeio(K().vereditoBaixo));

  const x0 = CALHA + RAIO_DA_COLETA;
  const x1 = Math.max(x0 + 1, w - RAIO_DA_COLETA);
  const t0 = vals[0].t, t1 = vals[vals.length - 1].t;
  const xDe = (t: number) => x0 + ((t - t0) / Math.max(1, t1 - t0)) * (x1 - x0);

  /* A MALHA É QUADRADA, e tinha um número fixo de colunas. Com o passo
     horizontal derivado do vertical, os pontos ficam à mesma distância nos
     dois sentidos — e malha quadrada lê como PAPEL, enquanto uma achatada
     lê como fileiras, que sugerem uma direção onde não há nenhuma. */
  const colunas = Math.max(8, Math.round(Math.max(1, w - CALHA) / ESPACO_LINHA));

  const P = vals.map((x) => ({ x: xDe(x.t), y: yDe(x.v), v: x.v, t: x.t }));
  const traco = P.map((q, i) => `${i ? 'L' : 'M'}${q.x},${q.y}`).join(' ');

  /* ---- o toque ----

     ⚠️ É AQUI QUE OS NÚMEROS EXATOS VOLTARAM A CABER. O gráfico tinha uma
     fileira de rótulos embaixo, um por coleta, e ela era o gráfico contado
     de novo em texto — e ainda assim não cabia em marcadores com muitas
     coletas. Sob demanda, a mesma informação não custa espaço nenhum: quem
     quer o número encosta no ponto.

     ⚠️ E O VEREDITO DA COLETA VEIO JUNTO, tirando o vermelho das bolinhas.
     Uma bolinha vermelha grita o tempo todo por um fato que a pessoa já
     leu no selo lá em cima, e grita sobre uma coleta de meses atrás, que é
     justamente a que menos importa. Em palavras, dentro do balão, o fato
     continua disponível e para de gritar.

     O Pan com ativação manual, e não o responder do JS: o ScrollView desta
     tela rouba o dedo no meio do arrasto, e o Gesture Handler disputa no
     mesmo nível dos reconhecedores nativos. Tocar sem arrastar já aponta,
     porque `onBegin` dispara no toque. */
  const refP = React.useRef(P);
  refP.current = P;
  const [sel, setSel] = useState<number | null>(null);
  /* ⚠️ O TIQUE SÓ NA TROCA, e não a cada quadro do arrasto. `onUpdate`
     dispara dezenas de vezes por segundo; disparar o háptico ali vira um
     zumbido contínuo, que é ruído e não informação. Guardando o último
     índice, o dedo sente exatamente o que o olho vê: uma batida por coleta
     ultrapassada. */
  const ultimo = React.useRef<number | null>(null);

  const gesto = React.useMemo(
    () => Gesture.Pan()
      .runOnJS(true)
      .manualActivation(true)
      .shouldCancelWhenOutside(false)
      .onTouchesMove((_ev, estado) => estado.activate())
      .onBegin((ev) => aponta(ev.x))
      .onUpdate((ev) => aponta(ev.x))
      .onFinalize(() => { ultimo.current = null; setSel(null); }),
    [],
  );

  function aponta(px: number) {
    const pts = refP.current;
    if (!pts.length) return;
    let melhor = 0, perto2 = Infinity;
    pts.forEach((q, i) => {
      const d = Math.abs(q.x - px);
      if (d < perto2) { perto2 = d; melhor = i; }
    });
    if (ultimo.current !== melhor) {
      ultimo.current = melhor;
      /* Engolido de propósito: um telefone sem motor de vibração, ou um
         navegador, não é motivo para derrubar o gesto. */
      Haptics.selectionAsync().catch(() => {});
    }
    setSel(melhor);
  }

  const alvo = sel != null ? P[sel] : null;
  const LARGURA_DO_BALAO = 150;
  /* O balão tem duas ou três linhas, e a altura dele decide de que lado do
     ponto ele abre — por isso ela é contada, e não estimada no olho. */
  const foraDaFaixa = alvo ? ondeCaiu(alvo.v) : null;
  const ALTURA_DO_BALAO = foraDaFaixa ? 68 : 50;
  /* ⚠️ ELE ABRE PARA BAIXO QUANDO O PONTO ESTÁ NO ALTO. Sempre por cima,
     uma coleta perto do teto do quadro empurrava o balão para fora do
     cartão — e encostado no teto ele cobria justamente o ponto que estava
     sendo consultado. */
  const balaoEmCima = alvo ? alvo.y > ALTURA * 0.42 : true;

  return (
    <View>
      <GestureDetector gesture={gesto}>
      <View style={{ height: ALTURA + RAIO_DA_MALHA * 2 }} onLayout={(ev) => setW(Math.round(ev.nativeEvent.layout.width))}>
        {w > 0 ? (
          <Svg width={w} height={ALTURA + RAIO_DA_MALHA * 2}>
            {Array.from({ length: LINHAS }).map((_, i) => {
              const naJanela = dentroDe(valorDaLinha(i));
              const y = i * ESPACO_LINHA + RAIO_DA_MALHA;
              return Array.from({ length: colunas }).map((__, j) => (
                <Circle
                  key={`${i}-${j}`}
                  cx={CALHA + (j / Math.max(1, colunas - 1)) * Math.max(1, w - CALHA - RAIO_DA_MALHA * 2) + RAIO_DA_MALHA}
                  cy={y}
                  r={RAIO_DA_MALHA}
                  fill={naJanela ? alfa(c.accent, isDark ? 0.46 : 0.34) : alfa(c.tx4, isDark ? 0.3 : 0.26)}
                />
              ));
            })}
            <Path
              d={traco} stroke={c.accent} strokeWidth={2.2} fill="none"
              strokeLinecap="round" strokeLinejoin="round"
              transform={`translate(0,${RAIO_DA_MALHA})`}
            />
            {/* A bolinha da coleta é cheia, e já foi um anel vazado: o anel
                precisa de um miolo da cor do cartão para existir, e sobre a
                malha esse miolo vira um buraco branco de pontos. Cheia, ela
                é só um nó mais grosso do mesmo traço.

                Todas na cor do traço. O vermelho saiu daqui e virou palavra
                dentro do balão — ver a nota do toque, acima. */}
            {P.map((q, i) => (
              <Circle
                key={q.t} cx={q.x} cy={q.y + RAIO_DA_MALHA}
                r={i === sel ? RAIO_DA_COLETA + 1.5 : RAIO_DA_COLETA}
                fill={c.accent}
              />
            ))}
            {alvo ? (
              <SvgLine
                x1={alvo.x} y1={0} x2={alvo.x} y2={ALTURA + RAIO_DA_MALHA * 2}
                stroke={alfa(c.tx, 0.22)} strokeWidth={1}
              />
            ) : null}
          </Svg>
        ) : null}

        {/* ---- o balão ----

            Ele vive acima do ponto e se recolhe nas bordas para não sair do
            cartão. Não tem ponta: com a linha vertical passando pelo ponto,
            a ligação entre os dois já está desenhada — e uma ponta em cima
            da linha seria a terceira peça dizendo a mesma coisa. */}
        {alvo ? (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              /* ⚠️ ELE PARA NA CALHA, e antes parava em zero. A primeira
                 coleta nasce encostada no eixo, e um balão centrado nela
                 recuava até a borda do cartão — em cima dos números do
                 eixo, que é justamente a régua que a pessoa precisa para
                 ler o ponto que ela está apontando. */
              left: Math.min(Math.max(CALHA, alvo.x - LARGURA_DO_BALAO / 2), Math.max(CALHA, w - LARGURA_DO_BALAO)),
              width: LARGURA_DO_BALAO,
              top: balaoEmCima ? alvo.y - ALTURA_DO_BALAO - 6 : alvo.y + 14,
              alignItems: 'center',
            }}
          >
            <View style={{ backgroundColor: c.tx, borderRadius: radius.md, paddingHorizontal: 11, paddingVertical: 7, alignItems: 'center' }}>
              <Row gap={4} style={{ alignItems: 'baseline' }}>
                <Txt v="label" c={c.bg1}>{fmtV(alvo.v)}</Txt>
                <Txt v="micro" c={alfa(c.bg1, 0.62)}>{e.unit}</Txt>
              </Row>
              {/* Uma informação por linha. Juntas com um ponto no meio, a
                  data e o veredito quebravam no meio da palavra num balão
                  estreito — e balão estreito é o que ele tem que ser. */}
              <Txt v="micro" c={alfa(c.bg1, 0.62)} style={{ marginTop: 1 }}>{dataLonga(alvo.t)}</Txt>
              {foraDaFaixa ? (
                <Txt v="micro" c={alfa(c.bg1, 0.62)} style={{ marginTop: 1 }}>{foraDaFaixa}</Txt>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* O eixo, encostado à direita da calha e na altura da sua linha. */}
        {Array.from({ length: LINHAS }).map((_, i) => (i % LINHAS_POR_DEGRAU === 0 ? (
          <View
            key={i} pointerEvents="none"
            style={{ position: 'absolute', left: 0, width: CALHA - 8, alignItems: 'flex-end', top: i * ESPACO_LINHA + RAIO_DA_MALHA - 9 }}
          >
            <Txt v="micro" c={c.tx4}>{fmtV(valorDaLinha(i))}</Txt>
          </View>
        ) : null))}
      </View>
      </GestureDetector>

      {/* As datas das pontas, e não uma por coleta: a fileira cheia era
          uma segunda leitura do gráfico em texto, e o que ela acrescentava
          — o valor exato de cada uma — o eixo agora dá de graça. */}
      <Row style={{ justifyContent: 'space-between', marginTop: RESPIRO_DAS_DATAS, paddingLeft: CALHA }}>
        <Txt v="micro" c={c.tx4}>{fmtDate(new Date(t0))}</Txt>
        {vals.length > 1 ? <Txt v="micro" c={c.tx4}>{fmtDate(new Date(t1))}</Txt> : null}
      </Row>
    </View>
  );
}

/* ------------------------------------------------------------------ */
function Detalhe({ e, onVoltar }: { e: any; onVoltar: () => void }) {
  const { c } = useTheme();
  /* O painel inteiro, só para a leitura poder dizer onde este marcador se
     encaixa no meio dos outros. */
  const todosOsExames = useStore((st) => st.S.exams) as any[];
  const l = examLast(e), f = examFirst(e), st = examStatus(e);
  const sobre = examAbout(e);
  const leitura = examExplain(e, todosOsExames);
  const mexe = examInfluences(e);
  const ajudam = examWays(e);
  const varios = e.values.length > 1;
  const delta = l.v - f.v;
  const bom = e.good === 'up' ? delta > 0 : delta < 0;
  /* Acima/abaixo em vez de "Fora da referência — alto": um travessão
     seguido de minúscula lê como remendo, e a direção cabe na primeira
     palavra. */
  const veredito = st === 'ok' ? K().vereditoOk : st === 'alto' ? K().vereditoAlto : K().vereditoBaixo;

  return (
    /* ⚠️ `tituloFixo` PORQUE NÃO HÁ MANCHETE. A barra da casa só mostra o
       nome depois que o titulão sobe — e aqui o titulão virou o número.
       Sem isto a tela abre dizendo "5,6 %" e mais nada: o marcador só se
       identificaria depois de rolar, e um valor de exame sem o nome do
       exame não é informação, é um número solto. */
    <TelaInterna titulo={nomeDoMarcador(e.marker)} sub={K().colhidoEm(dataLonga(l.t))} onVoltar={onVoltar} tituloFixo>
      {/* ---- o resultado ----

          ⚠️ O NÚMERO É A TELA, e ele estava numa manchete alinhada à
          esquerda como qualquer outro título. Quem abre um marcador de
          exame vem por um número só, e a pergunta seguinte é sempre a
          mesma: está bom? Centrado, com a unidade ao lado e o veredito
          logo abaixo, as duas respostas chegam juntas e sem leitura.

          ⚠️ E O CARTÃO SUMIU DAQUI. A superfície branca em volta fazia do
          resultado um dos blocos da tela; sem ela ele é a abertura dela.
          A régua vem logo abaixo porque é a mesma frase — o valor, e onde
          ele cai. */}
      <View style={{ alignItems: 'center', gap: 14 }}>
        <Row style={{ alignItems: 'baseline', justifyContent: 'center' }} gap={7}>
          <Txt v="display" style={{ fontSize: 56, lineHeight: 62, letterSpacing: -1.5 }}>{fmtV(l.v)}</Txt>
          {/* ⚠️ A UNIDADE EM PESO REGULAR, e estava em `h2`, que é semibold.
              Em negrito ela disputava com o número: "5,6" e "%" viravam
              duas coisas do mesmo tamanho de voz, quando uma é o dado e a
              outra é a régua em que ele se mede. Em regular e na cor de
              apoio, ela acompanha sem competir. */}
          <Txt v="body" c={c.tx3} style={{ fontSize: 22 }}>{e.unit}</Txt>
        </Row>
        {/* ⚠️ O VEREDITO É UM SELO AQUI, e por um tempo foi um balão
            preso à régua.

            O balão amarrava as duas informações — o que é e onde cai —
            numa leitura só, e essa parte era boa. Mas ele andava: nascia
            em cima do ponto do valor, então mudava de lugar a cada
            marcador, e perto das bordas encolhia para não sair da tela. O
            veredito é a resposta mais importante da tela e passava a
            depender de onde o valor tinha caído na fita.

            Embaixo do número ele abre sempre no mesmo ponto, com a mesma
            largura, e responde a pergunta que trouxe a pessoa aqui antes
            de ela precisar ler a régua. A régua continua dizendo o "onde"
            sozinha — os dois pontos acesos são o marcador, e não precisam
            de etiqueta para serem entendidos.

            O <Selo> tem `alignSelf: 'flex-start'` embutido, porque nasceu
            para etiquetar linhas de lista. O invólucro é o que desfaz esse
            alinhamento de origem sem mexer na peça compartilhada. */}
        {/* ⚠️ O SELO DIZ O VEREDITO E A FAIXA, e a faixa morava numa linha
            de rodapé embaixo da régua.

            Lá embaixo ela era uma nota de rodapé: a pessoa lia o número,
            lia o veredito, olhava a régua e só então, se ainda estivesse
            lendo, descobria qual era a faixa. Mas a faixa é o que TORNA o
            veredito verificável — "na referência" sem dizer qual
            referência é o aplicativo pedindo para ser acreditado.

            Juntas num selo só, o veredito passa a vir com a sua prova:
            "Na referência: abaixo de 5,7" se explica sem nenhuma outra
            leitura na tela.

            O <Selo> tem `alignSelf: 'flex-start'` embutido, porque nasceu
            para etiquetar linhas de lista. O invólucro é o que desfaz esse
            alinhamento de origem sem mexer na peça compartilhada. */}
        <View style={{ alignItems: 'center' }}>
          <Selo label={K().vereditoComFaixa(veredito, faixaEmPalavras(e))} tom={st === 'ok' ? 'verde' : 'neutra'} />
        </View>
      </View>

      {/* ⚠️ O PARÁGRAFO SOBRE O QUE É UMA FAIXA DE REFERÊNCIA SAIU DAQUI.
          Ele explicava bem e explicava sempre: cinco linhas de teoria
          entre a régua e o conteúdo, lidas uma vez e atravessadas em
          todas as visitas seguintes. Régua boa dispensa legenda, e esta
          já diz "faixa de referência · 15–150" embaixo dela. */}
      <Regua e={e} />

      {/* ---- sobre o marcador ----

          ⚠️ O QUE A COISA É, e não o que o SEU resultado quer dizer. As
          duas perguntas viviam no mesmo parágrafo lá embaixo, e só a
          segunda aparecia — quem nunca ouviu falar de ferritina lia a
          leitura de um número sem saber do que ele era.

          Vem antes da evolução de propósito: não dá para acompanhar a
          curva de uma coisa que ainda não se sabe o que é. */}
      {/* ⚠️ OS TRÊS CARTÕES ANDAM JUNTOS, com o respiro curto da Home, e
          por um tempo só os dois primeiros andavam.

          A <TelaInterna> separa os filhos por 26, que é a distância entre
          ASSUNTOS — e estes três são o mesmo assunto: o que o marcador é,
          o que ele fez, e o que isso quer dizer. A 10 de distância eles
          leem como um bloco de três partes; a 26, como seções que por
          acaso ficaram vizinhas.

          Deixar o terceiro de fora era pior que não ter agrupado nada: os
          dois de cima colados e o de baixo longe sugeriam que a leitura
          do resultado pertencia a outra parte da tela. */}
      <View style={{ gap: 10 }}>
      {sobre ? (
        <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 18, gap: 8 }, shadowCard(c)]}>
          <Row gap={7}>
            <Icon name="book" size={13} color={c.tx4} sw={2} />
            <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1 }}>{K().sobre}</Txt>
          </Row>
          <Txt v="body" style={{ lineHeight: 25 }}>{sobre.oQueE}</Txt>
          <Txt v="caption" c={c.tx3} style={{ lineHeight: 21 }}>{sobre.porQue}</Txt>
        </View>
      ) : null}

      {/* ---- a evolução ---- */}
      {varios ? (
        /* ⚠️ O CARTÃO VOLTOU A TER RECUO, e por uma versão a curva sangrava
           até a borda. Sangrar é o certo para uma curva sozinha no branco,
           como a de peso na Home. Aqui o desenho tem eixo — e eixo pede
           calha, calha pede margem, e uma malha cortada rente à borda lê
           como pedaço de uma malha maior que ficou de fora. */
        <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 18, gap: 16 }, shadowCard(c)]}>
          {/* ⚠️ O SELO SUBIU PARA A LINHA DO OVERLINE, e morava ao lado da
              manchete.

              Ali ele comia a largura dela: com o selo à direita, a manchete
              vivia num flex de uns 160, e "De 118 a 96 mg/dL" quebrava em
              duas linhas. Na linha do overline não há disputa — os dois são
              informação SOBRE o cartão, não o conteúdo dele —, e a manchete
              passa a ter a largura inteira. */}
          <View>
            <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Row gap={7}>
                <Icon name="trend" size={13} color={c.tx4} sw={2} />
                <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1 }}>{K().evolucao}</Txt>
              </Row>
              {/* ⚠️ A ETIQUETA GANHOU SINAL E UNIDADE, e tinha seta e número
                  pelado.

                  A seta e o sinal diziam a mesma coisa, e com a manchete
                  logo abaixo anunciando "De 118 a 96" a direção já estava
                  dita duas vezes antes de chegar aqui. O sinal é mais
                  preciso que a seta e ocupa um oitavo do espaço dela — e a
                  sobra pagou a unidade, sem a qual "−22" é um número de
                  nada: a diferença entre dois valores tem a mesma unidade
                  deles, e sem ela a etiqueta obriga a pessoa a voltar na
                  manchete para saber do que se trata.

                  ⚠️ E ELA APARECE MESMO SEM `good`. Antes sumia inteira nos
                  marcadores que não declaram lado bom — e com ela ia embora
                  também o quanto mudou, que é um fato e não um juízo. Sem
                  `good`, ela fica neutra: número, unidade, e nenhuma palavra
                  sobre se isso é boa notícia. */}
              {delta !== 0 ? (
                <View style={{ backgroundColor: e.good ? (bom ? c.okBg : c.bg2) : c.bg2, borderRadius: radius.pill, paddingHorizontal: 11, paddingVertical: 5 }}>
                  <Txt v="micro" c={e.good && bom ? c.ok : c.tx3}>
                    {delta > 0 ? '+' : '−'}{fmtV(Math.abs(delta))} {e.unit}{e.good ? (bom ? K().deltaEsperado : K().deltaOposto) : ''}
                  </Txt>
                </View>
              ) : null}
            </Row>

            {/* ⚠️ A MANCHETE É A CRONOLOGIA, e era a faixa em que o número
                viveu — o menor e o maior, nessa ordem.

                A faixa respondia "onde ele esteve", que é uma pergunta boa,
                e apagava a única que a pessoa faz de verdade: para onde
                isto está indo. Pior: em ordem de tamanho ela INVERTIA a
                história de quem melhorou. Uma glicemia que caiu de 118 para
                96 aparecia como "96 a 118", que é a leitura de quem piorou.

                "De 118 a 96" tem começo e fim, e a ordem das palavras é a
                ordem do tempo. O que a faixa dizia a mais — o pico do meio
                — não se perde: ele está desenhado no gráfico logo abaixo, e
                acessível no toque, que é onde um valor intermediário
                pertence. */}
            <Row gap={6} style={{ alignItems: 'baseline', marginTop: 8 }}>
              <Txt v="h1" style={{ fontSize: 30, lineHeight: 36 }}>
                {f.v === l.v ? fmtV(l.v) : K().deAte(fmtV(f.v), fmtV(l.v))}
              </Txt>
              <Txt v="body" c={c.tx3} style={{ fontSize: 20 }}>{e.unit}</Txt>
            </Row>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>
              {K().coletasDesde(e.values.length, dataLonga(f.t))}
            </Txt>
          </View>

          <MalhaDaEvolucao e={e} />
        </View>
      ) : null}


      {/* ---- o cartão que lê o resultado ----

          ⚠️ ERAM DOIS CARTÕES E VIRARAM UM. "O que mexe neste número" e
          "O que isso significa" respondiam a mesma pergunta em dois
          lugares, com a leitura do resultado no segundo e as causas no
          primeiro — a pessoa lia as causas antes de saber o que o número
          dela queria dizer.

          Um cartão, na ordem em que a cabeça pergunta: o que este
          resultado diz, o que costuma ajudar, o que também mexe nele.

          ⚠️ E O "O QUE COSTUMA AJUDAR" É A PARTE QUE PRECISA DE FREIO. As
          travas estão escritas em derive.ts, junto do conteúdo: nada
          sobre medicação, nada com dose ou prazo, nada prometendo
          resultado, e marcador sem item honesto — tireoide, rim — não
          ganha seção. Aqui fica a última: a linha de fecho, que não é
          rodapé jurídico. Ela é o fato. */}
      <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 18, gap: 16 }, shadowCard(c)]}>
        <View style={{ gap: 9 }}>
          <Row gap={7}>
            <Icon name="spark" size={13} color={c.accent} sw={2} />
            <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>{K().oQueSignifica}</Txt>
          </Row>
          {/* ⚠️ MANCHETE E PARÁGRAFO, e era um bloco de texto corrido.

              Corrido, ele obrigava a ler tudo para descobrir se a notícia
              era boa. A manchete responde na primeira linha — e, por ser a
              junção de "onde caiu" com "para onde vem indo", ela é a única
              peça da tela que forma essa frase. O parágrafo embaixo mostra
              a conta, para quem prefere ler a ler gráfico. */}
          <Txt v="h2" style={{ lineHeight: 30 }}>{leitura.titulo}</Txt>
          <Txt v="caption" c={c.tx3} style={{ lineHeight: 22 }}>{leitura.texto}</Txt>
        </View>

        {ajudam.length ? (
          <View style={{ gap: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.line, paddingTop: 16 }}>
            <Txt v="bodyMed">{K().oQueAjuda}</Txt>
            {ajudam.map((g) => (
              <View key={g.grupo} style={{ gap: 9 }}>
                <Txt v="caption" c={c.accent2}>{g.grupo}</Txt>
                {g.itens.map((it) => (
                  /* O fio à esquerda em vez do ponto: o item tem duas
                     alturas de texto — nome e explicação —, e um marcador
                     redondo alinhado com a primeira linha deixaria a
                     segunda solta. O fio acompanha o bloco inteiro. */
                  <Row key={it.nome} gap={11} style={{ alignItems: 'stretch' }}>
                    <View style={{ width: 2, borderRadius: 1, backgroundColor: c.line2 }} />
                    <View style={{ flex: 1 }}>
                      <Txt v="caption" style={{ lineHeight: 22 }}>{it.nome}</Txt>
                      <Txt v="caption" c={c.tx3} style={{ lineHeight: 22 }}>{it.detalhe}</Txt>
                    </View>
                  </Row>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {mexe.length ? (
          <View style={{ gap: 9, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.line, paddingTop: 16 }}>
            <Txt v="bodyMed">{K().oQueMexe}</Txt>
            {mexe.map((x) => (
              <Row key={x} gap={10} style={{ alignItems: 'flex-start' }}>
                <View style={{ marginTop: 8, width: 5, height: 5, borderRadius: 3, backgroundColor: c.tx4 }} />
                <Txt v="caption" c={c.tx2} style={{ flex: 1, lineHeight: 22 }}>{x}</Txt>
              </Row>
            ))}
          </View>
        ) : null}

        <Txt v="micro" c={c.tx4} style={{ lineHeight: 18 }}>{K().rodape}</Txt>

        <AskCompanion q={K().perguntaCompanion(nomeDoMarcador(e.marker))} label={K().perguntarSobre} />
      </View>
      </View>

      <View />
    </TelaInterna>
  );
}

/* ------------------------------------------------------------------ */
/* ⚠️ A LINHA DA LISTA MOSTRA O VEREDITO, E MOSTRAVA A VARIAÇÃO.

   O selo da direita trazia "−0,7" — o quanto mudou desde a primeira
   coleta. É um fato bom, e era o fato errado para esta tela: numa lista de
   quinze marcadores a pergunta não é "quanto andou", é "tem algum fora?".
   A variação exige comparar com a referência de cabeça para virar
   resposta; a cor não exige nada.

   Agora o valor sai vermelho e com seta quando está fora, e em tinta
   normal quando está dentro. Quem está bem não ganha decoração nenhuma —
   é assim que a lista fica com três pontos vermelhos em vez de quinze
   etiquetas. A variação continua existindo, no detalhe, onde ela tem
   espaço para dizer de quanto para quanto. */
function LinhaDoMarcador({ e, onPress }: { e: any; onPress: () => void }) {
  const { c } = useTheme();
  const l = examLast(e), f = examFirst(e);
  const st = examStatus(e);
  const delta = e.values.length > 1 && l.t !== f.t ? l.v - f.v : 0;
  /* ⚠️ A SETA SÓ GANHA COR QUANDO O MARCADOR DECLARA O LADO BOM. Sem
     `good`, subir não é boa nem má notícia — creatinina ou TSH é o
     conjunto que diz, não a direção —, e pintar a seta ali seria o
     aplicativo opinando sobre o que não sabe. Cinza, ela continua
     informando o fato: mudou, e para que lado. */
  const melhorou = e.good ? (e.good === 'up' ? delta > 0 : delta < 0) : null;
  const corDaSeta = melhorou == null ? c.tx4 : melhorou ? c.ok : c.cta;
  return (
    <Linha
      titulo={nomeDoMarcador(e.marker)}
      onPress={onPress}
      /* ⚠️ O SELO É O ESTADO, E A SETA É O RUMO. São duas perguntas
         diferentes — "estou bem?" e "estou indo bem?" — e um marcador pode
         responder sim para uma e não para a outra, que é justamente o caso
         que mais importa. Juntas num sinal só, esse caso desaparecia. */
      /* ⚠️ "REFERÊNCIA", E NÃO "FAIXA" — ver a nota do termo, no topo do
         arquivo. As duas de fora ficam curtas porque a cor e a seta já
         dizem que é exceção; o que falta ali é a DIREÇÃO, e é só isso que
         elas carregam. */
      selo={st === 'ok' ? K().seloOk : st === 'alto' ? K().seloAlto : K().seloBaixo}
      seloTom={st === 'ok' ? 'verde' : 'alerta'}
      sub={
        <Row gap={4} style={{ alignItems: 'center' }}>
          {delta !== 0 ? (
            <Icon name={delta > 0 ? 'arrowup' : 'arrowdown'} size={12} color={corDaSeta} sw={2.8} />
          ) : null}
          <Txt v="label">{fmtV(l.v)}</Txt>
          {/* A REFERÊNCIA SÓ APARECE NAS LINHAS DE FORA.

              Numa lista de quinze, "ref 2,6–24,9" é ruído em catorze delas:
              quem está dentro não precisa conferir a conta, porque a
              pastilha já conferiu. Na linha que destoa ela vira a
              informação que falta — não só que está acima, mas acima DE
              QUE —, e ali o selo é curto e sobra largura para ela.

              E foi o que destravou o marcador mais largo: com o selo em
              "na referência", a insulina quebrava "12 µUI/mL · ref
              2,6–24,9" em duas linhas, e uma linha mais alta que as
              vizinhas lê como defeito. */}
          <Txt v="caption" c={c.tx3}>{e.unit}{st === 'ok' ? '' : K().refCurta(e.ref)}</Txt>
        </Row>
      }
    />
  );
}

/* ============================================================
   A LISTA ABRE COM A AURORA, e abria com um titulão e dois números
   soltos no fundo cinza.

   ⚠️ A CONTAGEM PRECISAVA DE UM LUGAR DE HONRA, e não tinha nenhum. Dois
   números grandes pousados entre o lead e o primeiro cartão são a coisa
   mais importante da tela desenhada como se fosse um rodapé: nada em
   volta deles diz "isto é a resposta". Na capa eles têm a tela inteira.

   ⚠️ E A AURORA COLOCA ESTA TELA DO LADO CERTO DA DIVISÃO, que é a mesma
   razão que ela tem em Protocolos. As capas de água, prato e movimento
   são fotos da MATÉRIA do hábito — coisas do mundo que a pessoa registra.
   Exame não é isso: é um laudo que um laboratório escreveu e uma equipe
   vai ler. A aurora é, no resto do aplicativo, a cara do que o aplicativo
   e a equipe produzem, e é o que ela diz aqui.
   ============================================================ */
export default function Exames() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const aurora = useAurora();
  /* ⚠️ O DETALHE PASSOU A TER ROTA, e antes só existia como estado desta
     tela. Quem vinha de fora atrás de UM marcador — o card de HbA1c na
     Jornada, por exemplo — caía na lista dos quinze e tinha que procurar
     o seu no meio dela. O detalhe é a melhor tela de marcador da casa:
     régua, curva, faixa do laboratório e o que aquilo significa junto do
     resto. Ele não podia depender de a pessoa achar a linha certa. */
  const { m } = useLocalSearchParams<{ m?: string }>();
  const [sel, setSel] = useState<string | null>(m ?? null);

  /* ⚠️ `examesComValor` JÁ NA ENTRADA, e não só no cálculo de `fora`.

     Os três números desta capa — total, fora e dentro — precisam falar do
     mesmo conjunto, ou a soma dos dois últimos deixa de bater com o
     primeiro. Filtrar só `fora` resolveria a contagem e criaria a
     divergência um degrau acima. */
  const todos = examesComValor((S.exams as any[]) ?? []);
  const fora = examesForaDaRef(todos);
  const dentro = todos.length - fora.length;
  const resumo = examSummary(S);
  /* A coleta mais recente entre todos os marcadores — a linha da capa diz
     de quando é o retrato que a tela está mostrando. */
  const ultima = todos.length ? Math.max(...todos.map((e) => examLast(e).t)) : 0;

  /* ⚠️⚠️ A TELA SEM NENHUM EXAME MOSTRAVA SÓ OS TÍTULOS. As cinco
     categorias são fixas — sangue, tireoide, fígado… —, e cada uma
     desenhava o seu cartão com zero linhas dentro; embaixo delas,
     "Arquivos importados" fazia o sexto. Seis títulos e seis retângulos
     vazios não são um vazio: são uma lista que parece ter falhado ao
     carregar. E na capa, "0 fora da referência · 0 na referência" dava
     dois números enormes para dizer que não há número nenhum.

     Aqui a tela inteira vira o convite, que é o que ela é. */
  const semExames = todos.length === 0;
  const arquivos = (S.examBundles as any[]) ?? [];

  if (sel) {
    const e = examBy(S, sel);
    /* Chegando pela rota, a seta volta para quem empurrou. Levar à lista
       seria mandar a pessoa para uma tela que ela nunca pediu. */
    if (e) return <Detalhe e={e} onVoltar={sel === m ? () => router.back() : () => setSel(null)} />;
  }

  return (
    /* ⚠️ OS BOTÕES SAÍRAM DA CAPA E VIRARAM RODAPÉ FIXO.

       No pé da capa, um atalho significa "faça isto agora, a partir do que
       você acabou de ver" — é o que ele é nas outras telas da família,
       onde o número do dia e o botão de registrar são a mesma frase.
       Importar um laudo e mandar para a equipe não nascem da contagem: são
       o que se faz com a TELA, e não com o número. E, fixos embaixo,
       continuam alcançáveis depois de rolar quinze marcadores, que é
       justamente quando a vontade de mandar para a equipe aparece. */
    <TelaDeHabito
      /* Sem exame nenhum não há rodapé: importar é o botão do próprio
         vazio, três centímetros acima, e "enviar ao médico" mandaria uma
         folha em branco. Dois botões fixos para uma tela sem conteúdo é
         moldura sem quadro. */
      rodape={semExames ? undefined : (
        <>
          <Botao label={K().importar} onPress={() => router.push('/medir-exame' as any)} />
          <Botao label={K().enviarAoMedico} tom="fantasma" onPress={() => router.push('/exportar' as any)} />
        </>
      )}
    >
      <CapaDeHabito
        foto={aurora.hero}
        titulo={K().titulo}
        linha={semExames ? K().linhaVazia : K().linha(todos.length, dataLonga(ultima))}
        valor={semExames ? (
          /* O miolo da capa fica com a foto, e só. O par de contagens é a
             resposta de uma pergunta que ainda não foi feita. */
          <View />
        ) : (
          <View>
            {/* ⚠️ SÃO DOIS NÚMEROS E NÃO UM. "3 fora da faixa" sozinho é um
                alarme sem denominador: três de quinze e três de quatro são
                situações diferentes, e ninguém sabe qual é a sua sem contar
                a lista inteira. O par diz o tamanho do problema e o tamanho
                do que está bem, na mesma olhada.

                ⚠️ E AQUI OS DOIS SÃO BRANCOS, e no fundo claro um era
                vermelho e o outro verde. Sobre a aurora não há cor de
                estado que sobreviva: verde e vermelho lavados somem no
                gradiente, e saturados brigam com ele. O que separa os dois
                números é o RÓTULO, que já os separa em qualquer fundo — e
                sobre foto, o branco com sombra difusa é a única tinta que
                lê sempre. */}
            <Row style={{ alignItems: 'flex-end' }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Txt v="display" c={c.onHero} style={{ fontSize: 60, lineHeight: 66, letterSpacing: -2, textShadowColor: 'rgba(0,0,0,0.38)', textShadowRadius: 26, textShadowOffset: { width: 0, height: 2 } }}>{fora.length}</Txt>
                <Txt v="caption" c={c.onHero2} style={{ marginTop: 2 }}>{K().foraDaReferencia}</Txt>
              </View>
              <View style={{ width: 1, height: 50, backgroundColor: c.onHeroLine, marginBottom: 16 }} />
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Txt v="display" c={c.onHero} style={{ fontSize: 60, lineHeight: 66, letterSpacing: -2, textShadowColor: 'rgba(0,0,0,0.38)', textShadowRadius: 26, textShadowOffset: { width: 0, height: 2 } }}>{dentro}</Txt>
                <Txt v="caption" c={c.onHero2} style={{ marginTop: 2 }}>{K().naReferencia}</Txt>
              </View>
            </Row>

            {/* ⚠️ O RESUMO SUBIU PARA A CAPA, e morava solto no alto da
                folha.

                Lá ele era um parágrafo cinza entre a contagem e a primeira
                lista — o comentário sobre os números separado dos números
                por uma dobra de superfície. Aqui ele é a legenda deles: a
                contagem diz quantos, e a frase logo abaixo diz o que isso
                quer dizer, sem precisar mudar de lugar para juntar as duas
                coisas.

                Em branco de apoio ele acompanha sem disputar com o par de
                números, que continua sendo o que se lê primeiro. */}
            {resumo ? (
              <Txt v="micro" c={c.onHero2} numberOfLines={6} style={{ marginTop: 16, textAlign: 'center', lineHeight: 19 }}>
                {resumo}
              </Txt>
            ) : null}
          </View>
        )}
      />

      <FolhaDeHabito>
      {semExames ? (
        <Vazio
          ic="doc"
          titulo={K().vazioTitulo}
          texto={K().vazioTexto}
          acao={K().vazioAcao}
          onAcao={() => router.push('/medir-exame' as any)}
        />
      ) : (
      <>

      {/* ---- os que estão fora ----

          ⚠️ ELES APARECEM DUAS VEZES NA TELA, aqui e na categoria deles, e
          a repetição é o serviço. A contagem diz QUANTOS estão fora; sem
          este bloco, descobrir QUAIS é rolar cinco categorias procurando
          tinta vermelha. É a mesma linha, no atalho.

          Sem nenhum fora, o bloco não existe — e não vira um vazio dizendo
          "nada por aqui", que é ruído com cara de conteúdo. */}
      {fora.length ? (
        <Bloco titulo={K().blocoFora}>
          <Cartao>
            {fora.map((e) => (
              <LinhaDoMarcador key={e.marker} e={e} onPress={() => setSel(e.marker)} />
            ))}
          </Cartao>
        </Bloco>
      ) : null}

      {examCats().map(([cat, ms]) => {
        const linhas = ms.filter((mk) => !!examBy(S, mk));
        /* A categoria sem nenhum marcador respondido não vira cartão
           vazio: importar hemograma não obriga a tela a mostrar um
           retângulo de tireoide esperando. */
        if (!linhas.length) return null;
        return (
          <Bloco key={cat} titulo={cat}>
            <Cartao>
              {linhas.map((mk) => (
                <LinhaDoMarcador key={mk} e={examBy(S, mk)!} onPress={() => setSel(mk)} />
              ))}
            </Cartao>
          </Bloco>
        );
      })}

      {/* Quem anotou tudo à mão nunca importou arquivo nenhum — e via o
          título de um cartão sem nada dentro. */}
      {arquivos.length ? (
        <Bloco titulo={K().arquivosImportados}>
          <Cartao>
            {arquivos.map((b) => (
              <Linha
                key={b.t}
                ic={b.source === 'PDF' ? 'doc' : 'photo'}
                titulo={b.name}
                sub={K().arquivoSub(b.n, b.source, fmtDate(new Date(b.t)))}
                selo={b.shared ? K().seloEnviado : undefined}
                seloTom="neutra"
                seta={false}
              />
            ))}
          </Cartao>
        </Bloco>
      ) : null}
      </>
      )}
      </FolhaDeHabito>
    </TelaDeHabito>
  );
}
