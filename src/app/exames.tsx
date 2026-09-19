import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
  if (g.temMin && g.temMax) return `entre ${fmtV(g.limMin)} e ${fmtV(g.limMax)}`;
  if (g.temMax) return `abaixo de ${fmtV(g.limMax)}`;
  if (g.temMin) return `acima de ${fmtV(g.limMin)}`;
  return e.ref;
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
  const { c } = useTheme();
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
    if (pct < g.bandL || pct > g.bandR) return c.track;
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

     ⚠️ E ELE É VERDE OU VERMELHO, e era preto. Preto dizia "é aqui" e
     parava aí; quem quisesse o veredito tinha que voltar ao selo. Com a
     cor do estado, a régua responde as duas perguntas sozinha — onde eu
     estou, e isso é bom. */
  const iValor = Math.round((g.pos / 100) * (PONTOS_DA_REGUA - 1));
  const corDoValor = g.status === 'ok' ? c.ok : c.cta;
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
   O HISTÓRICO EM PONTOS — e antes era a curva da casa

   ⚠️ UMA LINHA ENTRE DUAS COLETAS DESENHA DADO QUE NÃO EXISTE.

   A curva contínua é a peça certa para peso: a pessoa se pesa toda
   semana, e o traço entre dois pontos descreve um caminho que de fato
   foi percorrido. Exame é o contrário — três coletas em cinco meses —, e
   ligar uma à outra afirma por onde o valor passou nos quatro meses em
   que ninguém mediu nada. Não passou por lugar nenhum: não se sabe.

   Em colunas de pontos, cada coleta é o que ela é: um fato isolado, numa
   data, com um valor. O olho junta os três sozinho, e o que ele junta é
   uma tendência — que é exatamente o grau de certeza que o dado permite.

   ⚠️ E A COLUNA É HASTE, E NÃO BARRA. A diferença está no tom: barra
   afirma quantidade a partir do zero, e o zero de um exame não é o pé
   deste quadro — é um número que o desenho inventou para ter onde
   começar. Em tom baixo, a coluna vira um fio que liga o ponto ao eixo e
   ajuda a achar a altura, sem afirmar grandeza. O dado é o ponto de cima;
   o resto é régua.

   ⚠️ A FAIXA DE REFERÊNCIA ATRAVESSA O QUADRO, e é a mesma da régua de
   cima, na mesma escala. É o que amarra as duas peças: a faixa que a
   pessoa acabou de ver como uma fileira de pontos reaparece aqui como
   uma região, e a pergunta "sempre estive dentro?" se responde sem
   número nenhum.

   ⚠️ E A MALHA DE FUNDO NÃO É ENFEITE. Sem ela, três pontos soltos num
   retângulo vazio não têm escala: não dá para dizer se a diferença entre
   eles é muita ou pouca. A malha dá a régua, e apagada ela não disputa
   com os pontos que importam.
   ============================================================ */
/* ⚠️ 37 × 13, E ERA 21 × 9. Pela mesma razão da régua: com a malha
   larga, o olho lê CÉLULAS e tenta atribuir valor a cada uma; com ela
   fina, lê papel quadriculado e passa direto para os pontos que importam.
   E a malha fina é o que permite a haste ser fina — numa grade de nove
   linhas, cada degrau da coluna vale um pedaço grande demais do eixo. */
const COLS = 33;
const LINS = 13;
const PONTO = 4;
const RESPIRO_LIN = 8;

function HistoricoEmPontos({ e }: { e: any }) {
  const { c } = useTheme();
  const g = examGaugeData(e);
  const vals = (e.values as any[]).slice().sort((a, b) => a.t - b.t);

  const t0 = vals[0].t, t1 = vals[vals.length - 1].t;
  const spanT = Math.max(1, t1 - t0);
  const spanV = Math.max(1e-9, g.max - g.min);

  const pctDe = (v: number) => Math.min(100, Math.max(0, ((v - g.min) / spanV) * 100));
  const linDe = (pct: number) => (LINS - 1) - (pct / 100) * (LINS - 1);
  const valorDaLin = (lin: number) => g.min + ((LINS - 1 - lin) / (LINS - 1)) * spanV;
  const linBandaTopo = Math.round(linDe(g.bandR));
  const linBandaBase = Math.round(linDe(g.bandL));

  const marcas = vals.map((x) => {
    const pct = pctDe(x.v);
    return {
      col: Math.round(((x.t - t0) / spanT) * (COLS - 1)),
      lin: Math.round(linDe(pct)),
      dentro: pct >= g.bandL && pct <= g.bandR,
      v: x.v,
      t: x.t,
    };
  });

  /* ⚠️ O EIXO GANHOU ESCALA, e tinha só as bordas da faixa.

     Eu tinha tirado os números das pontas argumentando que eles descrevem
     a moldura e não o dado — verdade, e irrelevante: TODO eixo descreve a
     moldura, e é para isso que ele serve. Sem nenhum degrau entre as duas
     bordas, a altura de um ponto no meio do quadro não tinha como ser
     lida; o gráfico virava um desenho bonito de onde não se tirava
     número.

     Um a cada três linhas é o que cabe sem virar tabela. As bordas da
     faixa continuam sendo as únicas em tinta forte — elas são o dado, o
     resto é régua. */
  /* ⚠️ AS BORDAS MANDAM, E OS DEGRAUS CEDEM. Com os dois conjuntos
     entrando juntos, `5,7` da borda e `4,8` do degrau caíam em linhas
     vizinhas e se atropelavam — dois números a oito pixels um do outro,
     e o que importa é o de cima. O degrau só entra quando está a duas
     linhas de distância de qualquer borda. */
  const bordas = [linBandaTopo, linBandaBase].filter((l) => l >= 0 && l < LINS);
  const rotulos = new Set<number>(bordas);
  for (const l of [0, 3, 6, 9, 12]) {
    if (bordas.every((b) => Math.abs(b - l) >= 2)) rotulos.add(l);
  }

  return (
    <View style={{ gap: 10 }}>
      <Row gap={8} style={{ alignItems: 'stretch' }}>
        <View style={{ width: 34, alignItems: 'flex-end' }}>
          {Array.from({ length: LINS }).map((_, lin) => {
            const borda = (lin === linBandaTopo && g.temMax) || (lin === linBandaBase && (g.temMin || g.min === 0));
            return (
              <View key={lin} style={{ height: PONTO, marginBottom: lin === LINS - 1 ? 0 : RESPIRO_LIN, justifyContent: 'center' }}>
                {rotulos.has(lin) ? (
                  <Txt v="micro" c={borda ? c.tx2 : c.tx4}>{fmtV(valorDaLin(lin))}</Txt>
                ) : null}
              </View>
            );
          })}
        </View>

        <View style={{ flex: 1 }}>
          {Array.from({ length: LINS }).map((_, lin) => {
            const naFaixa = lin >= linBandaTopo && lin <= linBandaBase;
            return (
              <Row key={lin} style={{ justifyContent: 'space-between', alignItems: 'center', height: PONTO, marginBottom: lin === LINS - 1 ? 0 : RESPIRO_LIN }}>
                {Array.from({ length: COLS }).map((__, col) => {
                  const marca = marcas.find((m) => m.col === col);
                  const naHaste = !!marca && lin > marca.lin;
                  const noTopo = !!marca && lin === marca.lin;

                  if (noTopo) {
                    return (
                      <View
                        key={col}
                        style={{
                          width: 10, height: 10, borderRadius: 5,
                          borderWidth: 2.5, borderColor: c.bg1,
                          backgroundColor: marca!.dentro ? c.accent2 : c.cta,
                          marginVertical: -3,
                        }}
                      />
                    );
                  }
                  if (naHaste) {
                    /* ⚠️ A HASTE ESCURECE PARA CIMA, e é isso que a faz ler
                       como coluna e não como fileira de pontos soltos. O
                       degradê aponta para o dado: o olho sobe por ele e
                       para no ponto cheio, que é onde está a resposta. */
                    const altura = Math.max(1, LINS - 1 - marca!.lin);
                    const fundura = (lin - marca!.lin) / altura;
                    return (
                      <View
                        key={col}
                        style={{
                          width: PONTO + 1, height: PONTO + 1, borderRadius: 3,
                          backgroundColor: mix(c.bg1, c.accent, 0.52 - fundura * 0.34),
                        }}
                      />
                    );
                  }
                  return (
                    <View
                      key={col}
                      style={{
                        width: PONTO, height: PONTO, borderRadius: 2,
                        backgroundColor: naFaixa ? mix(c.bg1, c.accent, 0.22) : c.track,
                      }}
                    />
                  );
                })}
              </Row>
            );
          })}
        </View>
      </Row>

      {/* ⚠️ AS COLETAS DESCERAM PARA CÁ, e eram um bloco inteiro com
          título, cartão e uma linha alta por valor. Três linhas repetindo
          os mesmos três números que o gráfico logo acima acabou de
          desenhar — a mesma informação contada duas vezes, em dois pesos
          diferentes.

          Aqui elas são a LEGENDA do gráfico: cada coleta com a sua data,
          na ordem em que aparecem no quadro, e o ponto colorido dizendo se
          aquela caiu dentro ou fora. É onde os números exatos ficam sem
          virar seção. */}
      <Row gap={14} style={{ flexWrap: 'wrap', paddingLeft: 42 }}>
        {marcas.map((m) => (
          <Row key={m.t} gap={6} style={{ alignItems: 'center' }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: m.dentro ? c.accent2 : c.cta }} />
            <Txt v="micro" c={c.tx2}>{fmtV(m.v)}</Txt>
            <Txt v="micro" c={c.tx4}>{fmtDate(new Date(m.t))}</Txt>
          </Row>
        ))}
      </Row>
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
      {/* ⚠️ SOBRE E EVOLUÇÃO ANDAM JUNTOS, com o respiro curto da Home.
          A <TelaInterna> separa os filhos por 26, que é a distância entre
          ASSUNTOS — e estes dois são o mesmo: o que o marcador é, e o que
          ele fez. A 10 de distância eles leem como um bloco de duas
          partes; a 26, como duas seções que por acaso ficaram vizinhas. */}
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
        <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 18, gap: 16 }, shadowCard(c)]}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
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

          <HistoricoEmPontos e={e} />
        </View>
      ) : null}

      </View>

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
