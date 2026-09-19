import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Line as SvgLine } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  EXAM_CATS, examBy, examLast, examFirst, examStatus, examGaugeData,
  examExplain, examAbout, examInfluences, examWays,
} from '../logic/derive';
import { fmtDate, MO_LONG, nf } from '../logic/time';
import { Txt, Row, Rich } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { AskCompanion } from '../ui/Ask';
import { AreaCurve } from '../ui/charts';
import {
  TelaInterna, Titulao, Bloco, Cartao, Linha, Aviso, Botao, Selo,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius, shadowCard, alfa, mix } from '../theme';

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
const porExtenso = (t: number) => { const d = new Date(t); return `${d.getDate()} de ${MO_LONG[d.getMonth()]}`; };

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
  if (g.temMin && g.temMax) return `entre ${fmtV(g.limMin)} e ${fmtV(g.limMax)}${u}`;
  if (g.temMax) return `abaixo de ${fmtV(g.limMax)}${u}`;
  if (g.temMin) return `acima de ${fmtV(g.limMin)}${u}`;
  return `${e.ref}${u}`;
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
   A EVOLUÇÃO EM LINHA — e antes era uma malha de pontos

   ⚠️ A RESSALVA PRIMEIRO, porque ela continua de pé: uma linha entre duas
   coletas desenha caminho que ninguém mediu. São três exames em cinco
   meses, e o traço entre o primeiro e o segundo afirma por onde o valor
   passou nos oitenta dias em que não houve coleta nenhuma. Não passou por
   lugar nenhum — não se sabe.

   A malha de pontos era a resposta honesta a isso, e cobrava caro demais:
   para achar a altura de um ponto era preciso contar linhas, e o eixo
   vertical era mandado pela FAIXA e não pelos dados — num HbA1c de 5,6 a
   6,3 com referência "< 5,7", o quadro ia de 0 a 9,7 e as três coletas se
   espremiam nos dez por cento de cima. O gráfico era honesto sobre o que
   não sabia e mudo sobre o que sabia.

   Duas coisas seguram a honestidade sem custar a leitura:

   ⚠️ O EIXO X É O TEMPO DE VERDADE, e não uma coleta por casa. Com
   espaçamento igual, quatro meses de silêncio e três semanas viram o
   mesmo pedaço de tela, e aí sim o gráfico mente. Proporcional, o vão
   longo APARECE como vão longo: a pessoa vê que entre aqueles dois
   pontos há um deserto, e o fio esticado por cima dele se lê pelo que é —
   um traço ligando duas medidas, não uma medida contínua.

   ⚠️ O FIO É FINO E OS PONTOS SÃO GORDOS. O que tem anel, cor e tamanho
   é a coleta; o fio é só o que leva o olho de uma à outra. Invertesse
   isso — fio grosso, ponto pequeno — e o desenho passaria a afirmar a
   trajetória.

   ⚠️ E O EIXO Y É MANDADO PELOS DADOS. A faixa entra na moldura quando
   está perto deles, e quando está longe ela continua ali como região
   pintada até a borda do quadro, sem puxar a escala. É a diferença entre
   "onde eu estive" legível e um gráfico correto que ninguém lê.
   ============================================================ */
/* ⚠️ A CURVA SANGRA ATÉ A BORDA DO CARTÃO, e antes era um desenho com
   calha à esquerda e folga dos dois lados.

   É assim que este app desenha série temporal — o peso na Home, a
   projeção no plano —, e recuo lateral fazia o gráfico parecer uma figura
   COLADA dentro do cartão em vez de ser o cartão. O eixo saiu junto: sem
   folga não há onde pôr uma calha, e a calha existia só para os números
   da faixa não brigarem com os das coletas.

   ⚠️ E OS NÚMEROS DESCERAM PARA UMA FILEIRA EMBAIXO, um por coleta, no x
   dela. O fio vertical que sai do ponto e desce até o rótulo é o que
   amarra os dois — é o mesmo "eixo" do gráfico do plano. Assim o quadro
   fica só com o desenho, e a leitura exata mora fora dele.

   ⚠️ E TODA COLETA GANHA NÓ E FIO, inclusive as das pontas.

   Na primeira versão as pontas ficavam sem nenhum dos dois, copiando o
   gráfico do plano — e lá faz sentido, porque as pontas dele são "hoje" e
   "a meta", que não são medidas. Aqui são: num marcador de três coletas,
   duas ficavam sem marca nenhuma no desenho, e a que sobrava era a do
   meio. A coleta mais recente — o resultado que trouxe a pessoa para esta
   tela — era justamente uma das invisíveis.

   O preço é uma folga de 14 de cada lado, para a bolinha não sair pela
   metade na borda. A curva continua sangrando: catorze pixels num cartão
   de 343 não fazem ela parecer uma figura colada dentro dele. */
const ALTURA_DO_QUADRO = 150;
const FOLGA_TOPO = 18;
const FOLGA_BASE = 10;
const FOLGA_LADO = 14;

function LinhaDaEvolucao({ e }: { e: any }) {
  const { c, isDark } = useTheme();
  const g = examGaugeData(e);
  const vals = (e.values as any[]).slice().sort((a, b) => a.t - b.t);
  const [w, setW] = useState(0);

  const limAlto = g.temMax ? g.limMax : null;
  const limBaixo = g.temMin ? g.limMin : null;

  /* O domínio nasce dos DADOS, com folga, e só depois abre espaço para
     uma borda da faixa que esteja perto. "Perto" é um terço da variação
     do próprio marcador — assim a borda entra quando ela é a próxima
     pergunta de quem olha, e fica de fora quando está a uma distância que
     só serviria para achatar o desenho.

     ⚠️ E ISTO É O QUE CONSERTOU O GRÁFICO. Na malha de pontos o eixo era
     mandado pela FAIXA: num HbA1c de 5,6 a 6,3 com referência "< 5,7", o
     quadro ia de 0 a 9,7 e as três coletas se espremiam nos dez por cento
     de cima. O desenho era correto e mudo. */
  const vs = vals.map((x) => x.v);
  let lo = Math.min(...vs), hi = Math.max(...vs);
  const span = Math.max(hi - lo, Math.abs(hi) * 0.06, 1e-6);
  lo -= span * 0.35; hi += span * 0.35;
  const perto = span * 0.35;
  if (limAlto != null && limAlto <= hi + perto) hi = Math.max(hi, limAlto + span * 0.15);
  if (limBaixo != null && limBaixo >= lo - perto) lo = Math.min(lo, limBaixo - span * 0.15);

  /* ⚠️ O X É O TEMPO DE VERDADE, e não uma coleta por casa. Com
     espaçamento igual, quatro meses de silêncio e três semanas viram o
     mesmo pedaço de tela — e aí sim o gráfico mente sobre o que houve
     entre as medidas. Proporcional, o vão longo aparece como vão longo, e
     o traço esticado por cima dele se lê pelo que é: um fio ligando duas
     medidas, não uma medida contínua. */
  const t0 = vals[0].t, t1 = vals[vals.length - 1].t;
  const pts = vals.map((x) => ({
    x: (x.t - t0) / Math.max(1, t1 - t0),
    y: (x.v - lo) / (hi - lo),
  }));

  const dentroDe = (v: number) =>
    (limBaixo == null || v >= limBaixo) && (limAlto == null || v <= limAlto);

  /* A mesma conta que a <AreaCurve> faz por dentro, para a faixa cair na
     altura exata em que a curva vai cair. */
  const yPix = (v: number) =>
    FOLGA_TOPO + (1 - (v - lo) / (hi - lo)) * (ALTURA_DO_QUADRO - FOLGA_TOPO - FOLGA_BASE);
  const yTopo = limAlto != null ? yPix(limAlto) : 0;
  const yBase = limBaixo != null ? yPix(limBaixo) : ALTURA_DO_QUADRO;
  const naMoldura = (y: number) => y > 8 && y < ALTURA_DO_QUADRO - 8;
  const topoPintado = Math.max(0, Math.min(yTopo, ALTURA_DO_QUADRO));
  const basePintada = Math.max(0, Math.min(yBase, ALTURA_DO_QUADRO));

  const todas = vals.map((_, i) => i);

  /* ⚠️ O NÚMERO DO LIMITE ESCOLHE O LADO, e ficava sempre no mesmo.

     Com a curva sangrando, as duas pontas dela encostam nas duas pontas
     da linha tracejada — então qualquer canto fixo acaba, um dia, embaixo
     de um nó. E é o pior dia possível: acontece justamente quando a
     coleta está PERTO do limite, que é quando o número dele mais importa.

     Fica do lado onde a curva está mais longe dele. */
  const yPrimeira = yPix(vals[0].v);
  const yUltima = yPix(vals[vals.length - 1].v);
  const ladoLivre = (y: number) =>
    (Math.abs(yPrimeira - y) >= Math.abs(yUltima - y)
      ? { left: 12 as number | undefined, right: undefined }
      : { left: undefined, right: 12 as number | undefined });

  return (
    <View>
      <View style={{ height: ALTURA_DO_QUADRO }} onLayout={(ev) => setW(Math.round(ev.nativeEvent.layout.width))}>
        {w > 0 ? (
          <>
            {/* A faixa fica ATRÁS da curva, e é a única coisa azul do
                quadro: o traço é tinta, não cor de marca, justamente para
                a região não ter com quem disputar. */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <Svg width={w} height={ALTURA_DO_QUADRO}>
                {/* ⚠️ A FAIXA É VERDE, E ERA AZUL COMO O RESTO.

                    Azul é a cor do DADO neste app — é ela que desenha a
                    curva, e uma região azul atrás de um traço azul faz o
                    olho tratar as duas como a mesma camada. Verde é a cor
                    que o selo lá em cima já usa para "na referência": a
                    região passa a ser a mesma afirmação, desenhada.

                    E ela vem em dois pesos: sobre papel branco 12% já é
                    uma região; sobre um cartão escuro some, porque o
                    contraste disponível ABAIXO do fundo é menor que o
                    disponível acima dele. */}
                <Rect x={0} y={topoPintado} width={w} height={Math.max(0, basePintada - topoPintado)} fill={alfa(c.ok, isDark ? 0.18 : 0.12)} />
                {limAlto != null && naMoldura(yTopo) ? (
                  <SvgLine x1={0} y1={yTopo} x2={w} y2={yTopo} stroke={alfa(c.ok, 0.45)} strokeWidth={1} strokeDasharray="3 4" />
                ) : null}
                {limBaixo != null && naMoldura(yBase) ? (
                  <SvgLine x1={0} y1={yBase} x2={w} y2={yBase} stroke={alfa(c.ok, 0.45)} strokeWidth={1} strokeDasharray="3 4" />
                ) : null}
              </Svg>
            </View>

            {/* ⚠️ SEM ÁREA PREENCHIDA, e a curva da casa tem uma.

                Ela existe lá porque o gráfico de peso está sozinho no
                branco e precisa de corpo. Aqui já existe uma lavagem no
                quadro — a faixa —, e duas lavagens sobrepostas viram
                borra: a faixa deixa de ser uma região com limite e vira
                mais um tom no meio de outros. Fica o traço, que é o que
                tem informação. */}
            <AreaCurve
              pts={pts} width={w} height={ALTURA_DO_QUADRO}
              padT={FOLGA_TOPO} padB={FOLGA_BASE} padX={FOLGA_LADO} strokeW={2.4}
              id="ev" dashed={false} nodes eixosEm={todas} fill={0}
            />

            {/* O limite, deitado na linha que ele nomeia. O fundo do cartão
                por baixo do número é o que abre espaço no tracejado sem
                precisar interromper o traço no desenho. */}
            {limAlto != null && naMoldura(yTopo) ? (
              <View pointerEvents="none" style={{ position: 'absolute', ...ladoLivre(yTopo), top: yTopo - 9, backgroundColor: c.bg1, paddingHorizontal: 5 }}>
                <Txt v="micro" c={c.ok}>{fmtV(limAlto)}</Txt>
              </View>
            ) : null}
            {limBaixo != null && naMoldura(yBase) ? (
              <View pointerEvents="none" style={{ position: 'absolute', ...ladoLivre(yBase), top: yBase - 9, backgroundColor: c.bg1, paddingHorizontal: 5 }}>
                <Txt v="micro" c={c.ok}>{fmtV(limBaixo)}</Txt>
              </View>
            ) : null}
          </>
        ) : null}
      </View>

      {/* ---- a fileira de rótulos ----

          Cada coleta no x dela, e não em colunas de larguras iguais: o
          rótulo tem que cair embaixo do ponto, senão o fio que desce do
          ponto aponta para o vizinho. Nas pontas ele encosta na margem do
          cartão em vez de ficar centrado, que é o que impede a primeira e
          a última caixa de sangrarem para fora. */}
      <View style={{ height: 42, marginTop: 2, marginBottom: 16 }}>
        {w > 0 ? pts.map((q, i) => {
          /* ⚠️ O MESMO X QUE A CURVA USA, e não `q.x * w`. A <AreaCurve>
             mapeia para `padX + x * (w - padX*2)` — com folga zero as duas
             contas davam no mesmo, e no dia em que a folga deixou de ser
             zero o rótulo passaria a apontar para o lado do ponto. */
          const x = FOLGA_LADO + q.x * Math.max(1, w - FOLGA_LADO * 2);
          const naEsq = x < 62, naDir = x > w - 62;
          const v = vals[i].v;
          return (
            <View
              key={vals[i].t}
              style={{
                position: 'absolute',
                left: naEsq ? 16 : naDir ? undefined : x - 50,
                right: naDir ? 16 : undefined,
                width: naEsq || naDir ? undefined : 100,
                alignItems: naEsq ? 'flex-start' : naDir ? 'flex-end' : 'center',
              }}
            >
              <Row gap={3} style={{ alignItems: 'baseline' }}>
                <Txt v="label" c={dentroDe(v) ? c.tx : c.cta}>{fmtV(v)}</Txt>
                <Txt v="micro" c={c.tx4}>{e.unit}</Txt>
              </Row>
              <Txt v="micro" c={c.tx4} style={{ marginTop: 1 }}>{fmtDate(new Date(vals[i].t))}</Txt>
            </View>
          );
        }) : null}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
function Detalhe({ e, onVoltar }: { e: any; onVoltar: () => void }) {
  const { c } = useTheme();
  const l = examLast(e), f = examFirst(e), st = examStatus(e);
  const sobre = examAbout(e);
  const mexe = examInfluences(e);
  const ajudam = examWays(e);
  /* Os extremos do período, que é o que o cartão de evolução anuncia. */
  const vs = (e.values as any[]).map((x) => x.v);
  const vMin = Math.min(...vs), vMax = Math.max(...vs);
  const varios = e.values.length > 1;
  const delta = l.v - f.v;
  const bom = e.good === 'up' ? delta > 0 : delta < 0;
  /* Acima/abaixo em vez de "Fora da referência — alto": um travessão
     seguido de minúscula lê como remendo, e a direção cabe na primeira
     palavra. */
  const veredito = st === 'ok' ? 'Na referência' : st === 'alto' ? 'Acima da referência' : 'Abaixo da referência';

  return (
    /* ⚠️ `tituloFixo` PORQUE NÃO HÁ MANCHETE. A barra da casa só mostra o
       nome depois que o titulão sobe — e aqui o titulão virou o número.
       Sem isto a tela abre dizendo "5,6 %" e mais nada: o marcador só se
       identificaria depois de rolar, e um valor de exame sem o nome do
       exame não é informação, é um número solto. */
    <TelaInterna titulo={e.marker} sub={`Colhido em ${porExtenso(l.t)}`} onVoltar={onVoltar} tituloFixo>
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
          <Selo label={`${veredito}: ${faixaEmPalavras(e)}`} tom={st === 'ok' ? 'verde' : 'neutra'} />
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
            <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1 }}>SOBRE</Txt>
          </Row>
          <Txt v="body" style={{ lineHeight: 25 }}>{sobre.oQueE}</Txt>
          <Txt v="caption" c={c.tx3} style={{ lineHeight: 21 }}>{sobre.porQue}</Txt>
        </View>
      ) : null}

      {/* ---- a evolução ---- */}
      {varios ? (
        /* ⚠️ O CARTÃO PERDEU O PADDING, e ele passou para o cabeçalho.
           Curva que sangra não pode nascer dentro de uma caixa de 18 de
           recuo; o recuo agora é de quem precisa dele. */
        <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, overflow: 'hidden' }, shadowCard(c)]}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', padding: 18, paddingBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Row gap={7}>
                <Icon name="trend" size={13} color={c.tx4} sw={2} />
                <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1 }}>EVOLUÇÃO</Txt>
              </Row>
              {/* ⚠️ O TÍTULO É A FAIXA EM QUE O NÚMERO VIVEU, e era o
                  quanto ele mudou.

                  "Caiu 48" responde uma pergunta boa e só ela. "132 a 180"
                  responde duas: para onde foi E onde esteve — e a segunda
                  é a que interessa num marcador com quatro, seis coletas,
                  onde a diferença entre a primeira e a última esconde tudo
                  que aconteceu no meio. Com três coletas, "caiu 0,7" não
                  diz que a do meio foi a mais alta de todas.

                  A direção não se perde: ela está na etiqueta ao lado, que
                  é onde ela tem companhia — o julgamento de se aquele lado
                  era o esperado. */}
              <Txt v="body" style={{ marginTop: 7 }}>
                {vMin === vMax
                  ? `${fmtV(vMin)} ${e.unit}`
                  : `${fmtV(vMin)} a ${fmtV(vMax)} ${e.unit}`}
              </Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>
                {e.values.length} coletas desde {porExtenso(f.t)}
              </Txt>
            </View>
            {/* A seta só aparece quando o marcador declara qual lado é o
                bom. Sem isso ela seria uma opinião sobre a direção. */}
            {delta !== 0 ? (
              /* ⚠️ A ETIQUETA PASSOU A DIZER O QUANTO, e dizia só o rumo. O
                 número saiu do título quando ele virou faixa, e este é o
                 lugar dele: ao lado da seta, que é o que o qualifica.

                 ⚠️ E ELA APARECE MESMO SEM `good`. Antes sumia inteira nos
                 marcadores que não declaram lado bom — e com ela ia embora
                 também o quanto mudou, que é um fato e não um juízo. Sem
                 `good`, ela fica neutra: seta, número, e nenhuma palavra
                 sobre se isso é boa notícia. */
              <Row gap={5} style={{ alignItems: 'center', backgroundColor: e.good ? (bom ? c.okBg : c.bg2) : c.bg2, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 }}>
                <Icon name={delta > 0 ? 'arrowup' : 'arrowdown'} size={13} color={e.good && bom ? c.ok : c.tx3} sw={2.4} />
                <Txt v="micro" c={e.good && bom ? c.ok : c.tx3}>
                  {fmtV(Math.abs(delta))}{e.good ? (bom ? ' · esperado' : ' · oposto') : ''}
                </Txt>
              </Row>
            ) : null}
          </Row>

          <LinhaDaEvolucao e={e} />
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
            <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>O QUE ISSO SIGNIFICA</Txt>
          </Row>
          <Txt v="body" style={{ lineHeight: 25 }}>{examExplain(e)}</Txt>
        </View>

        {ajudam.length ? (
          <View style={{ gap: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.line, paddingTop: 16 }}>
            <Txt v="bodyMed">O que costuma ajudar</Txt>
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
            <Txt v="bodyMed">O que também mexe no resultado</Txt>
            {mexe.map((x) => (
              <Row key={x} gap={10} style={{ alignItems: 'flex-start' }}>
                <View style={{ marginTop: 8, width: 5, height: 5, borderRadius: 3, backgroundColor: c.tx4 }} />
                <Txt v="caption" c={c.tx2} style={{ flex: 1, lineHeight: 22 }}>{x}</Txt>
              </Row>
            ))}
          </View>
        ) : null}

        <Txt v="micro" c={c.tx4} style={{ lineHeight: 18 }}>
          São as causas e os caminhos mais comuns, e não a lista inteira. Mudança de dose ou de
          medicação é decisão de quem acompanha você.
        </Txt>

        <AskCompanion q={`Explique meu exame de ${e.marker}`} label="Perguntar sobre este exame" />
      </View>
      </View>

      <View />
    </TelaInterna>
  );
}

/* ------------------------------------------------------------------ */
export default function Exames() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const [sel, setSel] = useState<string | null>(null);

  if (sel) {
    const e = examBy(S, sel);
    if (e) return <Detalhe e={e} onVoltar={() => setSel(null)} />;
  }

  return (
    <TelaInterna
      titulo="Exames"
      iconeAcao="plus"
      onAcao={() => router.push('/medir-exame' as any)}
      rodape={
        <>
          <Botao label="Importar exame" onPress={() => router.push('/medir-exame' as any)} />
          <Botao label="Enviar ao médico" tom="fantasma" onPress={() => router.push('/exportar' as any)} />
        </>
      }
    >
      <Titulao
        titulo="Exames"
        lead="Importados, organizados por sistema e explicados em português. Toque num marcador para ver a faixa de referência e o histórico."
      />

      <Aviso ic="spark" titulo="Resumo da IA">
        <Rich
          v="caption"
          base={c.tx2}
          bold={c.tx}
          text="Seus marcadores metabólicos <b>melhoraram de forma consistente</b>: HbA1c 6,3 → 5,6%, triglicerídeos e LDL em queda, HDL e vitamina D em alta. Evolução alinhada com a perda de peso e o tratamento."
        />
      </Aviso>

      {EXAM_CATS.map(([cat, ms]) => (
        <Bloco key={cat} titulo={cat}>
          <Cartao>
            {ms.map((mk) => {
              const e = examBy(S, mk);
              if (!e) return null;
              const l = examLast(e), st = examStatus(e);
              const varios = e.values.length > 1;
              const delta = varios ? l.v - examFirst(e).v : 0;
              const bom = e.good === 'up' ? delta > 0 : delta < 0;
              return (
                <Linha
                  key={mk}
                  titulo={mk}
                  sub={`${fmtV(l.v)} ${e.unit} · ref ${e.ref}`}
                  selo={varios
                    ? `${delta > 0 ? '+' : '−'}${fmtV(Math.abs(delta))}`
                    : (st === 'ok' ? 'normal' : st)}
                  seloTom={varios ? (bom ? 'lima' : 'neutra') : (st === 'ok' ? 'verde' : 'neutra')}
                  onPress={() => setSel(mk)}
                />
              );
            })}
          </Cartao>
        </Bloco>
      ))}

      <Bloco titulo="Arquivos importados">
        <Cartao>
          {(S.examBundles as any[]).map((b) => (
            <Linha
              key={b.t}
              ic={b.source === 'PDF' ? 'doc' : 'photo'}
              titulo={b.name}
              sub={`${b.n} marcadores · ${b.source} · ${fmtDate(new Date(b.t))}`}
              selo={b.shared ? 'enviado' : undefined}
              seloTom="neutra"
              seta={false}
            />
          ))}
        </Cartao>
      </Bloco>

      <View />
    </TelaInterna>
  );
}
