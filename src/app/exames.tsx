import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  EXAM_CATS, examBy, examLast, examFirst, examStatus, examGaugeData,
  examExplain, examAbout, examInfluences, SOBRE_A_REFERENCIA,
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
  const dentro = g.status === 'ok';
  const col = dentro ? c.accent : c.cta;

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

  const fileira = (chave: string) => (
    <Row key={chave} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
      {Array.from({ length: PONTOS_DA_REGUA }).map((_, i) => (
        <View
          key={i}
          style={{
            width: ALTURA_DA_FILEIRA, height: ALTURA_DA_FILEIRA, borderRadius: RAIO_DO_PONTO,
            backgroundColor: corDoPonto((i / (PONTOS_DA_REGUA - 1)) * 100),
          }}
        />
      ))}
    </Row>
  );

  return (
    <View>
      <View style={{ gap: RESPIRO_ENTRE_FILEIRAS }}>
        {fileira('cima')}
        {fileira('baixo')}

        {/* O marcador vive por cima das duas, centrado na posição do
            valor. `marginLeft` de meia largura é o que faz a porcentagem
            apontar para o centro dele, e não para a borda esquerda. */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute', top: -2, left: `${g.pos}%`, marginLeft: -8,
            width: 16, height: ALTURA_DA_FILEIRA * 2 + RESPIRO_ENTRE_FILEIRAS + 4,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <View style={{
            width: 14, height: 14, borderRadius: 7,
            borderWidth: 3, borderColor: c.bg,
            backgroundColor: col,
          }} />
        </View>
      </View>

      {/* Os limites, cada um na sua altura. */}
      <View style={{ height: 18, marginTop: 10 }}>
        {g.temMin ? (
          <View style={{ position: 'absolute', left: `${g.bandL}%`, width: 60, marginLeft: -30, alignItems: 'center' }}>
            <Txt v="micro" c={c.tx3}>{fmtV(g.limMin)}</Txt>
          </View>
        ) : null}
        {g.temMax ? (
          <View style={{ position: 'absolute', left: `${g.bandR}%`, width: 60, marginLeft: -30, alignItems: 'center' }}>
            <Txt v="micro" c={c.tx3}>{fmtV(g.limMax)}</Txt>
          </View>
        ) : null}
      </View>

      <Txt v="micro" c={c.tx4} style={{ textAlign: 'center' }}>
        {g.temMin && g.temMax ? 'faixa de referência' : g.temMax ? 'abaixo daqui é o esperado' : 'acima daqui é o esperado'} · {e.ref} {e.unit}
      </Txt>
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
const COLS = 37;
const LINS = 13;

function HistoricoEmPontos({ e }: { e: any }) {
  const { c } = useTheme();
  const g = examGaugeData(e);
  const vals = (e.values as any[]).slice().sort((a, b) => a.t - b.t);

  const t0 = vals[0].t, t1 = vals[vals.length - 1].t;
  const spanT = Math.max(1, t1 - t0);
  const spanV = Math.max(1e-9, g.max - g.min);

  const linDe = (pct: number) => (LINS - 1) - (pct / 100) * (LINS - 1);
  const linBandaTopo = Math.round(linDe(g.bandR));
  const linBandaBase = Math.round(linDe(g.bandL));

  /* Cada coleta vira uma coluna: a posição pela DATA de verdade, e não
     pela ordem — duas coletas em semanas seguidas ficam coladas, e um
     intervalo de dois anos fica largo, que é o que aconteceu. */
  const marcas = vals.map((x) => {
    const pct = Math.min(100, Math.max(0, ((x.v - g.min) / spanV) * 100));
    return {
      col: Math.round(((x.t - t0) / spanT) * (COLS - 1)),
      lin: Math.round(linDe(pct)),
      dentro: pct >= g.bandL && pct <= g.bandR,
    };
  });
  const ultima = marcas[marcas.length - 1];

  return (
    <View style={{ gap: 10 }}>
      <Row gap={8} style={{ alignItems: 'stretch' }}>
        <View style={{ width: 30 }}>
          {Array.from({ length: LINS }).map((_, lin) => {
            const topo = lin === linBandaTopo && g.temMax;
            const base = lin === linBandaBase && g.temMin;
            const valor = topo ? g.min + (g.bandR / 100) * spanV : g.min + (g.bandL / 100) * spanV;
            return (
              <View key={lin} style={{ height: 5, marginBottom: lin === LINS - 1 ? 0 : 9, justifyContent: 'center' }}>
                {topo || base ? <Txt v="micro" c={c.tx3}>{fmtV(valor)}</Txt> : null}
              </View>
            );
          })}
        </View>

        <View style={{ flex: 1 }}>
          {Array.from({ length: LINS }).map((_, lin) => {
            const naFaixa = lin >= linBandaTopo && lin <= linBandaBase;
            return (
              <Row key={lin} style={{ justifyContent: 'space-between', alignItems: 'center', height: 5, marginBottom: lin === LINS - 1 ? 0 : 9 }}>
                {Array.from({ length: COLS }).map((__, col) => {
                  const marca = marcas.find((m) => m.col === col);
                  const naHaste = !!marca && lin >= marca.lin;
                  const noTopo = !!marca && lin === marca.lin;

                  if (noTopo) {
                    return (
                      <View
                        key={col}
                        style={{
                          width: 11, height: 11, borderRadius: 6,
                          borderWidth: 2.5, borderColor: c.bg1,
                          backgroundColor: marca!.dentro ? c.accent2 : c.cta,
                          marginVertical: -3,
                        }}
                      />
                    );
                  }
                  if (naHaste) {
                    /* ⚠️ A HASTE É MAIS CLARA QUE O TOPO, e é isso que a
                       impede de virar barra. Barra afirma quantidade a
                       partir do zero, e o zero de um exame não é o pé
                       deste quadro — ele é um número arbitrário do
                       desenho. Em tom baixo, a coluna é um FIO que liga o
                       ponto ao eixo, como numa haste de pirulito: ela
                       ajuda a achar a altura e não afirma grandeza. */
                    /* ⚠️ A HASTE NÃO CARREGA O VEREDITO, e carregava: ela
                       vinha vermelha quando o ponto estava fora da faixa,
                       e descia vermelha atravessando a faixa azul —
                       dizendo "fora" sobre linhas que são o dentro.

                       Contradizia a própria regra desta peça: se a haste é
                       RÉGUA, ela não opina. O veredito é do ponto de cima,
                       e ele já o diz sozinho. */
                    const fundura = (lin - marca!.lin) / Math.max(1, LINS - 1 - marca!.lin);
                    return (
                      <View
                        key={col}
                        style={{
                          width: 5, height: 5, borderRadius: 3,
                          backgroundColor: mix(c.bg1, c.accent, 0.42 - fundura * 0.24),
                        }}
                      />
                    );
                  }
                  return (
                    <View
                      key={col}
                      style={{
                        width: 4, height: 4, borderRadius: 2,
                        /* A faixa de referência desenhada como REGIÃO, e
                           não como duas linhas: é a mesma leitura da
                           régua de cima, deitada. Sem ela o quadro é uma
                           grade neutra e "estive sempre dentro?" volta a
                           depender de conferir número por número. */
                        backgroundColor: naFaixa ? mix(c.bg1, c.accent, 0.26) : c.track,
                      }}
                    />
                  );
                })}
              </Row>
            );
          })}
        </View>
      </Row>

      <Row style={{ justifyContent: 'space-between', paddingLeft: 38 }}>
        <Txt v="micro" c={c.tx4}>{fmtDate(new Date(t0))}</Txt>
        <Txt v="micro" c={c.tx4}>{fmtDate(new Date(t1))}</Txt>
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
  /* Os extremos do período, que é o que o cartão de evolução anuncia. */
  const vs = (e.values as any[]).map((x) => x.v);
  const vMin = Math.min(...vs), vMax = Math.max(...vs);
  const varios = e.values.length > 1;
  const delta = l.v - f.v;
  const bom = e.good === 'up' ? delta > 0 : delta < 0;

  return (
    /* ⚠️ `tituloFixo` PORQUE NÃO HÁ MANCHETE. A barra da casa só mostra o
       nome depois que o titulão sobe — e aqui o titulão virou o número.
       Sem isto a tela abre dizendo "5,6 %" e mais nada: o marcador só se
       identificaria depois de rolar, e um valor de exame sem o nome do
       exame não é informação, é um número solto. */
    <TelaInterna titulo={e.marker} onVoltar={onVoltar} tituloFixo>
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
          <Txt v="h2" c={c.tx3}>{e.unit}</Txt>
        </Row>
        {/* O <Selo> tem `alignSelf: 'flex-start'` embutido — ele nasceu
            para etiquetar linhas de lista, onde encostar à esquerda é o
            certo. Aqui ele é o veredito do número, e veredito fica sob o
            número. O invólucro é o que desfaz o alinhamento de origem sem
            mexer na peça compartilhada. */}
        <View style={{ alignItems: 'center' }}>
          <Selo
            label={st === 'ok' ? 'Na referência' : `Fora da referência — ${st}`}
            tom={st === 'ok' ? 'verde' : 'neutra'}
          />
        </View>
        {/* ⚠️ A DATA DA COLETA VOLTOU. Ela morava no lead da manchete, que
            saiu junto com ela — e um resultado sem data é um resultado sem
            validade: ninguém sabe se está olhando o exame de ontem ou o de
            dois anos atrás. */}
        <Txt v="caption" c={c.tx3}>Colhido em {porExtenso(l.t)}</Txt>
      </View>

      <View style={{ gap: 12 }}>
        <Regua e={e} />
        {/* ⚠️ O QUE É UMA FAIXA DE REFERÊNCIA — a frase mais útil da tela,
            e ela não existia. O aplicativo mostrava "referência 15–150" e
            deixava a pessoa concluir sozinha que fora dali é doença. Não
            é: a faixa é onde cai a maioria das pessoas saudáveis testadas
            naquele laboratório, com o método dele — e por construção,
            algumas pessoas saudáveis caem fora.

            Fica logo abaixo da régua porque é a legenda dela, e não um
            aviso: quem entendeu a régua já parou de ler. */}
        <Txt v="micro" c={c.tx3} style={{ lineHeight: 19 }}>{SOBRE_A_REFERENCIA}</Txt>
      </View>

      {/* ---- sobre o marcador ----

          ⚠️ O QUE A COISA É, e não o que o SEU resultado quer dizer. As
          duas perguntas viviam no mesmo parágrafo lá embaixo, e só a
          segunda aparecia — quem nunca ouviu falar de ferritina lia a
          leitura de um número sem saber do que ele era.

          Vem antes da evolução de propósito: não dá para acompanhar a
          curva de uma coisa que ainda não se sabe o que é. */}
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

      {varios ? (
        <Bloco titulo="Coletas">
          <Cartao>
            {e.values.slice().reverse().map((x: any) => (
              <Linha
                key={x.t}
                titulo={`${fmtV(x.v)} ${e.unit}`}
                sub={fmtDate(new Date(x.t))}
                seta={false}
              />
            ))}
          </Cartao>
        </Bloco>
      ) : null}

      {/* ---- o que mexe neste número ----

          ⚠️ É A SEÇÃO QUE TRANSFORMA O EXAME EM COISA COMPREENSÍVEL.
          Saber que ferritina é o estoque de ferro ajuda a ler a palavra;
          não ajuda a entender por que ela mudou — e "por que mudou" é a
          pergunta que a pessoa leva da tela para a vida. Um número de
          exame sem causas é um veredito; com causas, vira uma coisa que
          tem história e que ela reconhece.

          ⚠️ E NENHUM ITEM DIZ O QUE FAZER. "Álcool nos dias anteriores" é
          um fato sobre o marcador; "pare de beber" seria conduta, e
          conduta é de quem acompanha a pessoa. A linha entre educar e
          prescrever passa exatamente aqui.

          ⚠️ O PONTO É SOLTO, e não numerado. Numerar sugere ordem de
          importância, e não há: são causas comuns, não um ranking. */}
      {mexe.length ? (
        <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 18, gap: 12 }, shadowCard(c)]}>
          <Row gap={7}>
            <Icon name="bulb" size={13} color={c.tx4} sw={2} />
            <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1 }}>O QUE MEXE NESTE NÚMERO</Txt>
          </Row>
          <View style={{ gap: 10 }}>
            {mexe.map((x) => (
              <Row key={x} gap={10} style={{ alignItems: 'flex-start' }}>
                <View style={{ marginTop: 8, width: 5, height: 5, borderRadius: 3, backgroundColor: c.accent }} />
                <Txt v="caption" c={c.tx2} style={{ flex: 1, lineHeight: 22 }}>{x}</Txt>
              </Row>
            ))}
          </View>
          <Txt v="micro" c={c.tx4} style={{ lineHeight: 18 }}>
            São as causas mais comuns, e não a lista inteira. O que vale para o seu caso é
            quem lê o conjunto que diz.
          </Txt>
        </View>
      ) : null}

      <Aviso ic="spark" titulo="O que isso significa">
        <Txt v="caption" c={c.tx2}>{examExplain(e)}</Txt>
        <AskCompanion q={`Explique meu exame de ${e.marker}`} label="Perguntar sobre este exame" style={{ marginTop: 12 }} />
      </Aviso>

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
